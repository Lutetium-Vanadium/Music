import { ipcMain, app } from "electron";
import * as path from "path";
import * as fs from "fs";

import getYoutubeDetails from "../functions/getYoutubeDetails";
import addAlbum from "../functions/addAlbum";
import db from "../functions/db_handler";
import Store from "../functions/store";
import { song } from "../types";
import { Windows } from ".";

const initMiscellaneous = (store: Store, { win }: Windows, downloader) => {
  // The download song port- Given an id, downloads the song
  ipcMain.handle("download-song", async (evt, songData: song) => {
    const { id: youtubeId, length } = await getYoutubeDetails(songData);

    const fileName = songData.title + ".mp3";
    console.log("Downloading ", songData.title);
    downloader.download(youtubeId, fileName);
    const albumId = songData.albumId;
    addAlbum(albumId, songData.artist);

    console.log({ youtube: length, songData: songData.length });

    songData.length = length;
    songData.thumbnail =
      "file://" +
      path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);
    songData.filePath = path.join(store.get("folderStored"), fileName);
    db.addSong(songData);

    return youtubeId;
  });

  ipcMain.handle("delete:song", async (evt, song: song) => {
    try {
      console.log("Deleting", song.title);
      const dbSongPromise = db.delete(song.title);
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

  // When the search page is clicked out of, this is used to reset the input field
  ipcMain.on("reset-global-search", () => {
    win.webContents.send("reset-search-box");
  });
};

export default initMiscellaneous;

// Helper function that provides a promised based fs.unlink
const rm = (path: fs.PathLike): Promise<void> => {
  return new Promise((res, rej) => {
    fs.unlink(path, err => {
      if (err) rej(err);
      res();
    });
  });
};
