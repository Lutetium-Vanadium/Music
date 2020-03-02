import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";

import { createDownloader } from "./functions/downloader";
import db from "./functions/db_handler";
import Store from "./functions/store";
import checkSongs from "./checkSongs";
import { song } from "./types";
import debug from "./console";
import createMenu from "./menu";
import initIpc from "./ipc";

// In the built application, proccess directory is taken as the one it is being run from.
// app.getAppPath() gives the correct directory for everything to be loaded
process.chdir(app.getAppPath());

// store instance is required by 'downloader.js'
const store = new Store({
  name: "config",
  defaults: {
    folderStored: app.getPath("music"),
    jumpAhead: 15,
    seekAhead: 5,
    seekBack: 5,
    jumpBack: 15,
    controlWindow: false
  }
});

// To many event listeners are added for the default
ipcMain.setMaxListeners(20);

const downloader = createDownloader(store.get("folderStored"));

// Downloader settings
downloader.on("error", err => {
  console.error(err);
  win.webContents.send("error:download-query", err);
});

downloader.on("progress", ({ progress, videoId }) => {
  debug.log(videoId + ":", progress.percentage);
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
if (!fs.existsSync(album_images_path)) fs.mkdir(album_images_path, debug.log);

// needed variables
let win: BrowserWindow = null;
let remote: BrowserWindow = null;
const dev = !app.isPackaged;

app.allowRendererProcessReuse = true;

// Main window creation
app.on("ready", () => {
  win = new BrowserWindow({
    width: 1130,
    height: 840,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !dev
    },
    icon: path.join(app.getAppPath(), "src", "logo.png")
  });

  // dev should be changed to false and frontend should be built for a proper app
  dev
    ? win.loadURL("http://localhost:1234/")
    : win.loadURL(
        "file://" + path.join(app.getAppPath(), "public", "index.html")
      );

  createMenu(win, store, dev);
  initIpc(store, { win, remote }, setUpRemote, downloader);
  checkSongs(store.get("folderStored"));
  globalShortcut.register("MediaPlayPause", () =>
    win.webContents.send("pause-play", false)
  );
  globalShortcut.register("MediaNextTrack", () =>
    win.webContents.send("next-track")
  );
  globalShortcut.register("MediaPreviousTrack", () =>
    win.webContents.send("prev-track")
  );
  globalShortcut.register("MediaStop", () => {
    remote?.close();
  });

  win.on("close", () => app.quit());
});

app.on("quit", () => {
  db.close();
  globalShortcut.unregisterAll();
  app.quit();
});

const setUpRemote = (song: song) => {
  remote = new BrowserWindow({
    width: 500,
    height: 105,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !dev
    },
    resizable: false,
    alwaysOnTop: true,
    icon: path.join(app.getAppPath(), "app", "src", "logos", "logo.png")
  });

  remote.on("close", () => (remote = null));

  remote.loadURL("file://" + path.join(app.getAppPath(), "src", "remote.html"));

  ipcMain.on("remote-ready", () => {
    remote.webContents.send("song-update", song);
  });
};

// Methods to handle the remote controller
// NOTE they aren't placed in a seperate file, like other ipc functions in `/ipc`,
// as they require the updated `remote` variable to function
ipcMain.on("toggle-remote", (evt, song: song) => {
  if (!store.get("controlWindow")) return;
  if (song === null && remote) {
    remote.close();
  } else if (song !== null && !remote) {
    setUpRemote(song);
  }
});

ipcMain.on("main-song-update", (evt, song: song) => {
  remote?.webContents.send("song-update", song);
});

ipcMain.on("main-play-pause", (evt, isPaused) => {
  remote?.webContents.send("song-pause-play", isPaused);
});

ipcMain.on("remote-prev", () => {
  win.webContents.send("prev-track", true);
});

ipcMain.on("remote-next", () => {
  win.webContents.send("next-track");
});

ipcMain.on("remote-pause-play", () => {
  win.webContents.send("pause-play");
});
