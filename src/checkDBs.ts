import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

import { getInfo } from "./functions/napster";
import addAlbum from "./functions/addAlbum";
import db from "./functions/db_handler";
import debug from "./console";

// Given a range of song names, this adds them to the database
// Note, it is not in the database as this function handles the data formatting and only directly database
// related line is `await db.addSong(songData)`
const addRangeSong = async (lst: string[], folderStored: string) => {
  lst.forEach(async (songName, i) => {
    const { song, status } = await getInfo(songName);

    if (status === 0) {
      console.error("Failed: " + songName);
      return;
    }

    const fileName = songName + ".mp3";
    const albumId = song.thumbnail.split("/")[6];
    addAlbum(albumId, song.artist);
    debug.log({ albumId });

    const songData = {
      thumbnail: "file://" + path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`),
      filePath: path.join(folderStored, fileName),
      artist: song.artist,
      length: song.length,
      title: songName,
      numListens: 0,
      albumId,
      liked: false
    };
    await db.addSong(songData);

    console.log(`${i}: ${lst[i]} added`);
  });
};

const addRangeAlbum = async (lst: any[]) => {
  lst.forEach(async (item, i) => {
    await addAlbum(item.albumId, item.artist);
    console.log(`${i}: ${item.albumId} by ${item.artist} added`);
  });
};

const deleteRangeSongs = async (lst: string[]) => {
  lst.forEach(async songName => {
    await db.deleteSong(songName);
    console.log("Deleted " + songName);
  });
};

const deleteRangeAlbums = async (lst: string[]) => {
  lst.forEach(async item => {
    await db.deleteAlbum(item);
    console.log("Deleted " + item);
  });
};

// Updates the db for songs which were not downloaded through the app and albums which arent there in the albumdata db
const checkDBs = async (folderStored: string) => {
  const allSongs = await db.all();

  let formattedAllSongs: string[] = [];

  for (let song of allSongs) {
    const pathArray = song.filePath.split("/");

    formattedAllSongs.push(pathArray[pathArray.length - 1]);
  }

  const dir = await ls(folderStored);

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
    await addRangeSong(notAdded, folderStored);
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
    await deleteRangeSongs(deleted);
    changed = true;
  }

  const albumsFromSongData = await db.albumsFromSongs();
  const albumsFromAlbumData = (await db.mostPopularAlbums(false)).sort((a, b) => (a.id > b.id ? 1 : -1));

  let i = 0,
    j = 0;
  let albumsToDelete = [];
  let albumsToAdd = [];

  while (i < albumsFromSongData.length && j < albumsFromAlbumData.length) {
    const albumCur = albumsFromAlbumData[j].id;
    const songCur = albumsFromSongData[i].albumId;

    if (albumCur === songCur) {
      i++;
      j++;
    } else if (albumCur > songCur) {
      albumsToAdd.push(albumsFromSongData[i]);
      i++;
    } else {
      albumsToDelete.push(albumCur);
      j++;
    }
  }

  console.log();

  for (i; i < albumsFromSongData.length; i++) albumsToAdd.push(albumsFromSongData[i]);

  for (j; j < albumsFromAlbumData.length; j++) albumsToDelete.push(albumsFromAlbumData[j].id);

  console.log(albumsToDelete.length + " extra albums detected.");
  if (albumsToDelete.length) {
    console.log("Updating database...");
    deleteRangeAlbums(albumsToDelete);
  }

  console.log(albumsToAdd.length + " unknown albums detected.");
  if (albumsToAdd.length) {
    console.log("Updating database...");
    addRangeAlbum(albumsToAdd);
  }

  if (changed) console.log("Completed database update");
};

export default checkDBs;

// Helper function that provides a promise based fs.readdir
const ls = (path: fs.PathLike): Promise<string[]> => {
  return new Promise((res, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) rej(err);
      res(files);
    });
  });
};
