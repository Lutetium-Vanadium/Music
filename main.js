const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("./store");
const fs = require("fs");

const store = new Store({
  name: "config",
  defaults: {
    folderStored: app.getPath("music")
  }
});

let win = null;

const dev = true;

app.on("ready", () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  dev
    ? win.loadURL("http://localhost:1234/")
    : win.loadFile("./public/index.html");
});

// Get methods
ipcMain.handle("get:music-dir", (evt, val) => {
  return new Promise((res, rej) => {
    res(store.get("folderStored"));
  });
});

ipcMain.handle("get:music-names", async (evt, val) => {
  const files = await fs.promises.readdir(store.get("folderStored"));

  const re = /\.(mp3|wav)/giu;

  files.filter(name => Boolean(name.match(re)));

  console.log("Files: ", files);

  return files;
});

module.exports = {
  store
};

require("./downloader");
