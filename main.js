const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("./functions/store");
const fs = require("fs");
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

const google = require("./functions/google");
const downloader = require("./functions/downloader");
const db = require("./functions/db_handler");

// Initialises the song-data database
db.init();

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

// Get methods

// gets the configured music directory
ipcMain.handle("get:music-dir", (evt, val) => {
  return new Promise((res, rej) => {
    res(store.get("folderStored"));
  });
});

// Gets all music files stored in the configured directory
ipcMain.handle("get:music-names", async (evt, val) => {
  const files = await fs.promises.readdir(store.get("folderStored"));

  // Only files with an mp3 or wav extension want to be taken into account
  const re = /\.(mp3|wav)/giu;

  files.filter(name => Boolean(name.match(re)));

  console.log("Files: ", files);

  return files;
});

// Gets all the songs stored in the db whose name contains the given string
ipcMain.handle("get:search-query", async (evt, val) => {
  const results = db.search(val);
  return results;
});

// The download song port- Given a string, downloads the first result of the youtube API result
ipcMain.on("get:download-query", async (evt, val) => {
  const id = google(val);
  downloader.download(id);

  downloader.on("error", err => {
    console.error(err);
    // Todo report download failed
    win.webContents.send("error:download-query", err);
  });

  downloader.on("progress", ({ progress }) =>
    win.webContents.send("update:download-query", progress)
  );

  downloader.on("finished", async (err, data) => {
    await db.addSong(data);
    //Todo report complete
    win.webContents.send("finished:download-query", "Done");
  });
});

// A basic function to test if a the basic download and search APIs work
const run_test = async () => {
  const test_query = "Khashoggis Ship";

  const id = await google(test_query);
  const id = vid.id.videoId;

  console.log({ id });

  downloader.download(id);

  downloader.on("error", console.error);
  downloader.on("finished", console.log);
  downloader.on("progress", console.log);

  console.log("Done.");
};
