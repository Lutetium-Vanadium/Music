import { ipcMain } from "electron";
import Store from "../functions/store";
import db from "../functions/db_handler";
// Get methods

const initGetters = (store: Store) => {
  // gets the configured music directory
  ipcMain.handle("get:info", (evt, val) => {
    return new Promise((res, rej) => {
      const settings = store.getAll();
      res({
        ...settings,
        dir: settings.folderStored,
      });
    });
  });

  ipcMain.handle("get:animations", (evt, val) => store.get("animations"));

  // Gets all music files stored in the configured directory
  ipcMain.handle("get:music-names", async (evt, val) => await db.all());

  // Home page methods to show popular stuff
  ipcMain.handle("get:top-songs", async (evt, limit: boolean) => await db.mostPopularSongs(limit));
  ipcMain.handle("get:top-albums", async (evt, limit: boolean) => await db.mostPopularAlbums(limit));
  ipcMain.handle("get:artists", async () => await db.getArtists());

  ipcMain.handle("get:album", async (evt, id: string) => await db.albumDetails(id));
  ipcMain.handle("get:artist", async (evt, name: string) => await db.artistDetails(name));

  ipcMain.handle("get:album-songs", async (evt, albumId: string) => await db.albumSongs(albumId));
  ipcMain.handle("get:artist-songs", async (evt, name: string) => await db.artistSongs(name));
  ipcMain.handle("get:liked", async () => await db.liked());
};

export default initGetters;
