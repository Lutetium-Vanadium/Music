import { app } from "electron";
import * as path from "path";
import { getAlbumInfo } from "./napster";

import { downloadImage } from "./downloader";
import db from "./db_handler";

/**
 * addAlbum()
 *
 * @param {string} albumId The id of the album
 *
 * Adds an album and downloads the image for the album if they dont exist
 */
const addAlbum = async (albumId: string, artist: string, numSongs = 1) => {
  const imagePath = "file://" + path.join(app.getPath("userData"), "album_images", `${albumId}.jpg`);

  downloadImage(albumId);

  if (await db.exists(albumId)) {
    db.incrementNumSongs(albumId);
    return;
  }

  const { id, name } = await getAlbumInfo(albumId);

  if (albumId !== id) {
    console.error("Failed album " + albumId);
  }

  console.log(`Adding album ${name}.`);

  const album: Album = {
    id,
    name,
    imagePath,
    numSongs,
    artist,
  };

  db.addAlbum(album);
};

export default addAlbum;
