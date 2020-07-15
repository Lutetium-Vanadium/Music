import { ipcMain, app, BrowserWindow, dialog, Notification } from "electron";
import * as path from "path";
import * as fs from "fs";

import getYoutubeDetails from "../functions/getYoutubeDetails";
import addAlbum from "../functions/addAlbum";
import db from "../functions/db_handler";
import Store from "../functions/store";
import { exportData, importData } from "../functions/exportImportData";

const initMiscellaneous = (store: Store<Settings, SettingsKeys>, win: BrowserWindow, downloader: YoutubeMp3Downloader) => {
  // The download song port- Given an id, downloads the song
  ipcMain.handle("download-song", async (evt, songData: Song) => {
    const data = await getYoutubeDetails(songData);

    if (data === null) return;

    const { id: youtubeId, length } = data;

    const fileName = songData.title + ".mp3";
    console.log("Downloading ", songData.title);
    downloader.download(youtubeId, fileName);
    const albumId = songData.albumId;
    addAlbum(albumId, songData.artist);

    songData.length = length;
    songData.thumbnail = "file://" + path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);
    songData.filePath = path.join(store.get("folderStored"), fileName);
    db.addSong(songData);

    return youtubeId;
  });

  ipcMain.handle("delete:song", async (evt, song: Song) => {
    try {
      console.log("Deleting", song.title);
      const dbSongPromise = db.deleteSong(song.title);
      const dbAlbumPromise = db.decrementNumSongs(song.albumId);
      const fsPromise = rm(song.filePath);

      await Promise.all([dbSongPromise, fsPromise, dbAlbumPromise]);
      console.log("Finished deletion");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  ipcMain.handle("delete:custom-album", async (evt, album: CustomAlbum) => {
    try {
      console.log("Deleting", album.name);
      await db.deleteCustomAlbum(album.id);
      console.log("Finished deletion.");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  ipcMain.on("create:custom-album", async (evt, name: string, songs: string[]) => {
    win.webContents.send("update:custom-albums", await db.addCustomAlbum({ name, songs }));
  });

  ipcMain.on("export-data", async () => {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      properties: ["createDirectory"],
      title: "Save exported data",
      defaultPath: path.join(app.getPath("documents"), "music-data.zip"),
      filters: [
        { name: "Zip Files", extensions: ["zip"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!canceled) {
      try {
        const message = await exportData(filePath);
        new Notification({
          title: "Export Success",
          body: `${message}\nYou can import it in the Settings section of your music app.`,
        }).show();
      } catch (error) {
        console.error(error);

        const message = error instanceof Error ? error.message + "\n" : typeof error === "string" ? error + "\n" : "";

        new Notification({
          title: "Export Error",
          body: `${message}For more information, see the error logs at ${path.join(app.getPath("logs"), "error.log")}`,
        }).show();
      }
    }
  });

  ipcMain.on("import-data", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
      title: "Select file to import",
      defaultPath: app.getPath("documents"),
      filters: [
        { name: "Zip Files", extensions: ["zip"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!canceled && filePaths[0]) {
      try {
        await importData(filePaths[0]);
        store.refresh();
        win.webContents.send("update:info", store.getAll());
        new Notification({
          title: "Import Success",
          body: "Settings and song metadata have been imported.",
        }).show();
      } catch (error) {
        console.error(error);

        const message = error instanceof Error ? error.message + "\n" : typeof error === "string" ? error + "\n" : "";

        new Notification({
          title: "Import Success",
          body: `${message}For more information, see the error logs at ${path.join(app.getPath("logs"), "error.log")}`,
        }).show();
      }
    }
  });

  // When the search page is clicked out of, this is used to reset the input field
  ipcMain.on("reset-global-search", () => {
    win.webContents.send("reset-search-box");
  });
};

export default initMiscellaneous;

// Helper function that provides a promised based fs.unlink
const rm = (path: fs.PathLike): Promise<void> => {
  return new Promise((res, rej) => {
    fs.unlink(path, (err) => {
      if (err) rej(err);
      res();
    });
  });
};
