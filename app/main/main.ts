import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import { createDownloader } from "./functions/downloader";
import db from "./functions/db_handler";
import Store from "./functions/store";
import checkDBs from "./checkDBs";
import checkVersion from "./checkVersion";
// import "./types";
import debug from "./console";
import createMenu from "./menu";
import initIpc from "./ipc";

// store instance is required by 'downloader.js'
const store = new Store<Settings, SettingsKeys>({
  name: "config",
  defaults: {
    folderStored: app.getPath("music"),
    jumpAhead: 15,
    seekAhead: 5,
    seekBack: 5,
    jumpBack: 15,
    controlWindow: false,
    animations: true,
  },
});

const downloader = createDownloader(store.get("folderStored"));

// Downloader settings
downloader.on("error", (err) => {
  console.error(err);
  win?.webContents.send("error:download-query", err);
});

downloader.on("progress", ({ progress, videoId }) => {
  debug.log(videoId + ":", progress.percentage);
  win?.webContents.send("update:download-query", {
    progress: progress.percentage,
    id: videoId,
  });
});

downloader.on("finished", async (err, data) => {
  console.log(`Finished Downloading:  ${data.title} by ${data.artist}`);
  win?.webContents.send("finished:download-query", {
    id: data.videoId,
    filePath: data.file,
  });
});

// Initialising

// check if image directory exists
const albumImagesPath = path.join(app.getPath("userData"), "album_images");
fs.exists(albumImagesPath, (exists) => {
  if (!exists) fs.mkdir(albumImagesPath, debug.log);
});

// needed variables
let win: BrowserWindow | null = null;
let remote: BrowserWindow | null = null;
let help: BrowserWindow | null = null;
const dev = !app.isPackaged;

app.allowRendererProcessReuse = true;

// Main window creation
app.on("ready", () => {
  win = new BrowserWindow({
    width: 1170,
    height: 840,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !dev,
    },
    icon: path.join(app.getAppPath(), "resources", "logo.png"),
  });

  if (dev) {
    win.loadURL("http://localhost:1234/");
  } else {
    win.loadURL(
      "file://" + path.join(app.getAppPath(), "public", "index.html")
    );
  }

  // Initialize everything
  createMenu(win, store, dev, toggleHelp);
  initIpc(store, win, downloader);

  // Perform Checks
  checkDBs(store.get("folderStored"));
  checkVersion();

  // Register media controls
  globalShortcut.register("MediaPlayPause", () =>
    win?.webContents.send("pause-play", false)
  );
  globalShortcut.register("MediaNextTrack", () =>
    win?.webContents.send("next-track")
  );
  globalShortcut.register("MediaPreviousTrack", () =>
    win?.webContents.send("prev-track")
  );
  globalShortcut.register("MediaStop", () => {
    remote?.close();
  });

  win.on("close", () => app.quit());
  win.webContents.on("new-window", (evt, url) => {
    evt.preventDefault();
    win?.webContents.send("goto-link", "/" + url.split("/").slice(3).join("/"));
  });
});

app.on("quit", () => {
  db.close();
  globalShortcut.unregisterAll();
  app.quit();
});

const toggleHelp = () => {
  if (help === null) {
    help = new BrowserWindow({
      width: 1000,
      height: 800,
      icon: path.join(app.getAppPath(), "resources", "logo.png"),
    });

    help.on("close", () => (help = null));

    help.loadURL(
      "file://" + path.join(app.getAppPath(), "resources", "help.html")
    );
  } else {
    help.close();
  }
};

const setUpRemote = (song: Song) => {
  remote = new BrowserWindow({
    width: 500,
    height: 105,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: !dev,
    },
    resizable: false,
    alwaysOnTop: true,
    icon: path.join(app.getAppPath(), "resources", "logo.png"),
    frame: false,
  });

  remote.on("close", () => (remote = null));

  remote.loadURL(
    "file://" + path.join(app.getAppPath(), "resources", "remote.html")
  );

  ipcMain.on("remote-ready", () => {
    remote?.webContents.send("song-update", song);
  });
};

// NOTE these aren't placed in a seperate file, like other ipc functions in `/ipc`,
// as they require the updated `remote` variable to function

ipcMain.on(
  "set:control-window",
  (evt, value: boolean, playing: boolean, song: Song) => {
    store.set("controlWindow", value);
    if (!remote && value && playing) {
      setUpRemote(song);
    } else if (remote && !value) {
      remote.close();
    }
  }
);

// Methods to handle the remote controller
ipcMain.on("toggle-remote", (evt, song: Song) => {
  if (!store.get("controlWindow")) return;
  if (song === null && remote) {
    remote.close();
  } else if (song !== null && !remote) {
    setUpRemote(song);
  }
});

ipcMain.on("main-song-update", (evt, song: Song) => {
  db.incrementNumListens(song.filePath);
  remote?.webContents.send("song-update", song);
});

ipcMain.on("main-play-pause", (evt, isPaused) => {
  remote?.webContents.send("song-pause-play", isPaused);
});

ipcMain.on("remote-prev", () => {
  win?.webContents.send("prev-track", true);
});

ipcMain.on("remote-next", () => {
  win?.webContents.send("next-track");
});

ipcMain.on("remote-pause-play", () => {
  win?.webContents.send("pause-play");
});
