const { app, BrowserWindow, ipcMain } = require("electron");
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
  await db.addSong(data);
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
      nodeIntegration: true
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
ipcMain.handle("ssearch:local", async (evt, val) => {
  const results = db.search(val);
  return results;
});

// Handles general search query for new songs
ipcMain.handle("search:global", async (evt, val) => {
  const result = await search(val);
  if (!result.success) return result.error;

  return result.songs;
});

// The download song port- Given a string, downloads the first result of the youtube API result
ipcMain.on("download-song", async (evt, val) => {
  const id = google(val);
  downloader.download(id);
});
