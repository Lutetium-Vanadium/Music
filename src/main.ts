import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import * as fs from "fs";

import "./console";
import setMenu from "./menu";
import Store from "./functions/store";

// store instance is required by 'downloader.js'
export const store = new Store({
  name: "config",
  defaults: {
    folderStored: app.getPath("music"),
    jumpAhead: 15,
    seekAhead: 5,
    seekBack: 5,
    jumpBack: 15
  }
});

import { getInfo, search } from "./functions/napster";
import { songDownloader as downloader } from "./functions/downloader";
import addAlbum from "./functions/addAlbum";
import getYoutubeId from "./functions/getYoutubeId";
import db from "./functions/db_handler";
import dataurl from "dataurl";
import { song } from "./types";

// Downloader settings
downloader.on("error", err => {
  console.error({ err });
  win.webContents.send("error:download-query", err);
});

downloader.on("progress", ({ progress, videoId }) => {
  win.webContents.send("update:download-query", {
    progress: progress.percentage,
    id: videoId
  });
});

downloader.on("finished", async (err, data) => {
  console.log(`Finished Downloading:  ${data.title} by ${data.artist}`);
  win.webContents.send("finished:download-query", {
    id: data.videoId,
    filePath: data.file
  });
});

// Initialising

// check if image directory exists
const album_images_path = path.join(app.getPath("userData"), "album_images");

if (!fs.existsSync(album_images_path)) fs.mkdir(album_images_path, console.log);

// needed variables
let win: BrowserWindow;
const dev = true;

// Main window creation
app.on("ready", () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    icon: path.resolve("app", "src", "logos", "logo.png")
  });

  // dev should be changed to false and frontend should be built for a proper app
  dev
    ? win.loadURL("http://localhost:1234/")
    : win.loadFile("./public/index.html");

  setMenu(win);
  checkSongs();
});

app.on("quit", () => {
  db.close();
  app.quit();
});

// Get methods

// gets the configured music directory
ipcMain.handle("get:music-dir", (evt, val) => {
  return new Promise((res, rej) => {
    res(store.get("folderStored"));
  });
});

// Gets all music files stored in the configured directory
ipcMain.handle("get:music-names", async (evt, val) => await db.all());

ipcMain.handle("get:song-audio", async (evt, filePath: string) => {
  return new Promise((res, rej) => {
    try {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        res(dataurl.convert({ data, mimetype: "audio/mp3" }));
        db.incrementNumListens(filePath);
      });
    } catch (error) {
      console.error(error);
      rej(error);
    }
  });
});

// Home page methods to show popular stuff
ipcMain.handle(
  "get:top-songs",
  async (evt, limit: boolean) => await db.mostPopularSongs(limit)
);
ipcMain.handle(
  "get:top-albums",
  async (evt, limit: boolean) => await db.mostPopularAlbums(limit)
);

ipcMain.handle(
  "get:album-songs",
  async (evt, filePath: string) => await db.albums(filePath)
);

ipcMain.handle("get:liked", async () => await db.liked());

// search methods

// Gets all the songs stored in the db whose name contains the given string
ipcMain.handle("search:local", async (evt, val) => {
  const results = db.search(val);
  return results;
});

// Handles general search query for new songs
ipcMain.handle("search:global", async (evt, val) => {
  const result = await search(val);

  if (!result.status) console.error(`\x1b[31m${result.error}\x1b[0m`);

  return result;
});

// Setters

// Opens a select directory dialog which allows user to customize where the songs are stored and taken from
ipcMain.handle("set:music-dir", async (evt, val) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
    title: "Choose Music Directory",
    defaultPath: store.get("folderStored")
  });

  if (!canceled) {
    store.set("folderStored", filePaths[0]);
  }

  return store.get("folderStored");
});

// The download song port- Given an id, downloads the song
ipcMain.handle("download-song", async (evt, songData: song) => {
  const youtubeId = await getYoutubeId(songData);

  const fileName = songData.title + ".mp3";
  console.log("Downloading ", songData.title);
  downloader.download(youtubeId, fileName);
  const albumId = songData.thumbnail.split("/")[6];
  addAlbum(albumId);

  songData.thumbnail =
    "file://" +
    path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);
  songData.filePath = path.join(store.get("folderStored"), fileName);
  db.addSong(songData);

  return youtubeId;
});

// When the search page is clicked out of, this is used to reset the input field
ipcMain.on("reset-global-search", () => {
  win.webContents.send("reset-search-box");
});

ipcMain.on("delete:song", (evt, song: song) => {
  db.delete(song.title);
});

// Given a range of song names, this adds them to the database
// Note, it is not in the database as this function handles the data formatting and only directly database
// related line is `await db.addSong(songData)`
const addRange = async (lst: string[]) => {
  for (let i = 0; i < lst.length; i++) {
    const { song, status } = await getInfo(lst[i]);

    if (status === 0) {
      console.log("Failed: " + lst[i]);
      continue;
    }

    const fileName = lst[i] + ".mp3";
    const albumId = song.thumbnail.split("/")[6];
    addAlbum(albumId);
    console.log({ albumId });

    const songData = {
      thumbnail:
        "file://" +
        path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`),
      filePath: path.join(store.get("folderStored"), fileName),
      artist: song.artist,
      length: song.length,
      title: lst[i],
      numListens: 0
    };
    await db.addSong(songData);

    console.log(`${i}: ${lst[i]} finished succesfully`);
  }
};

const deleteRange = async (lst: string[]) => {
  for (let i = 0; i < lst.length; i++) {
    await db.delete(lst[i]);
    console.log("Deleted " + lst[i]);
  }
};

// Updates the db for songs which were not downloaded throught the app
const checkSongs = async () => {
  const allSongs = await db.all();

  let formattedAllSongs: string[] = [];

  for (let song of allSongs) {
    const pathArray = song.filePath.split("/");

    formattedAllSongs.push(pathArray[pathArray.length - 1]);
  }

  const dir = await ls(store.get("folderStored"));

  let notAdded: string[] = [];

  for (let i = 0; i < dir.length; i++) {
    if (!formattedAllSongs.includes(dir[i])) {
      notAdded.push(dir[i].slice(0, -4));
    }
  }

  let changed = false;

  console.log(notAdded.length + " unknown songs detected.");
  if (notAdded.length) {
    console.log("Updating database...");
    await addRange(notAdded);
    changed = true;
  }

  let deleted: string[] = [];

  for (let i = 0; i < formattedAllSongs.length; i++) {
    if (!dir.includes(formattedAllSongs[i])) {
      deleted.push(formattedAllSongs[i].slice(0, -4));
    }
  }

  console.log(deleted.length + " extra songs detected.");
  if (deleted.length) {
    console.log("Updating database...");
    await deleteRange(deleted);
    changed = true;
  }

  if (changed) console.log("Completed database update");
};

// Helper function that provides a promise based fs.readdir
const ls = (path: fs.PathLike): Promise<string[]> => {
  return new Promise((res, rej) => {
    return fs.readdir(path, (err, files) => {
      if (err) rej(err);
      res(files);
    });
  });
};

// const temp = async () => {
//   for (let album of albums) {
//     console.log("Starting: " + album);
//     await addAlbum(album);
//     console.log("Finished: " + album);
//   }
// };
// temp();
