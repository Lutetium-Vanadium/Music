const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const Store = require("./functions/store");
const store = new Store({
  name: "config",
  defaults: {
    folderStored: app.getPath("music")
  }
});

// store instance is required by 'downloader.js'
module.exports = {
  store
};

const { getSongInfo, search } = require("./functions/napster");
const {
  songDownloader: downloader,
  downloadImage
} = require("./functions/downloader");
const getYoutubeId = require("./functions/getYoutubeId");
const db = require("./functions/db_handler");

// Downloader settings
downloader.on("error", err => {
  console.error(err);
  win.webContents.send("error:download-query", err);
});

downloader.on("progress", ({ progress }) => {
  console.log(progress.percentage.toFixed(2) + "%");
  win.webContents.send("update:download-query", progress);
});

downloader.on("finished", async (err, data) => {
  console.log("Finished ", data);
  db.print();
  win.webContents.send("finished:download-query", "Done");
});

// Initialising

// check if image directory exists
const album_images_path = path.join(app.getPath("userData"), "album_images");

if (!fs.existsSync(album_images_path)) fs.mkdir(album_images_path);

// creating db
db.init();

// needed variables
let win = null;
const dev = true;

// Main window creation
app.on("ready", () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  // dev should be changed to false and frontend should be built for a proper app
  dev
    ? win.loadURL("http://localhost:1234/")
    : win.loadFile("./public/index.html");
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
ipcMain.handle("get:music-names", (evt, val) => db.all());

// search methods

// Gets all the songs stored in the db whose name contains the given string
ipcMain.handle("search:local", async (evt, val) => {
  const results = db.search(val);
  return results;
});

// Handles general search query for new songs
ipcMain.handle("search:global", async (evt, val) => {
  const result = await search(val);
  if (!result.success) return result.error;

  return result.songs;
});

// Setters

ipcMain.handle("set:music-dir", async (evt, val) => {
  console.log("Changing Directories...");
  const { cancelled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
    title: "Choose Music Directory",
    defaultPath: store.get("folderStored")
  });

  if (!cancelled) {
    store.set("folderStored", filePaths[0]);
  }

  return store.get("folderStored");
});

// The download song port- Given an id, downloads the song
ipcMain.on("download-song", async (evt, songData) => {
  const youtubeId = getYoutubeId(songData.title);
  downloader.download(youtubeId);
  downloadImage(songData.thumbnail);
  const albumId = songData.thumbnail.split("/")[6];
  songData.thumbnail =
    "file//" +
    path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);
  await db.addSong(songData);
});
