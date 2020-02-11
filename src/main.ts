import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import * as fs from "fs";
import Store from "./functions/store";
const store = new Store({
  name: "config",
  defaults: {
    folderStored: app.getPath("music")
  }
});

// store instance is required by 'downloader.js'
export { store };

import { getInfo, search } from "./functions/napster";
import {
  songDownloader as downloader,
  downloadImage
} from "./functions/downloader";
import getYoutubeId from "./functions/getYoutubeId";
import db from "./functions/db_handler";

// Downloader settings
downloader.on("error", err => {
  console.error(err);
  win.webContents.send("error:download-query", err);
});

downloader.on("progress", ({ progress }) => {
  win.webContents.send("update:download-query", progress.percentage);
});

downloader.on("finished", async (err, data) => {
  win.webContents.send("finished:download-query", "Done");
});

// Initialising

// check if image directory exists
const album_images_path = path.join(app.getPath("userData"), "album_images");

if (!fs.existsSync(album_images_path)) fs.mkdir(album_images_path, console.log);

// creating db
db.init();

// needed variables
let win = null;
const dev = false;

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
ipcMain.handle("get:music-names", async (evt, val) => await db.all());

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
ipcMain.on("download-song", async (evt, songData) => {
  const youtubeId = await getYoutubeId(songData.title);

  const fileName = songData.title + ".mp3";
  downloader.download(youtubeId, fileName);
  const albumId = songData.thumbnail.split("/")[6];
  downloadImage(albumId);

  songData.thumbnail =
    "file://" +
    path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);
  songData.filePath = path.join(store.get("folderStored"), fileName);
  await db.addSong(songData);
});

console.debug("test");
