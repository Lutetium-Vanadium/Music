import { ipcMain } from "electron";
import Store from "../functions/store";
import db from "../functions/db_handler";
// Get methods

const initGetters = (store: Store<Settings, SettingsKeys>) => {
  // gets the configured music directory
  ipcMain.handle("get:info", () => {
    return new Promise((res) => {
      res(store.getAll());
    });
  });

  ipcMain.handle("get:animations", () => store.get("animations"));

  // Gets all music files stored in the configured directory
  ipcMain.handle("get:music-names", () => db.all());

  // Home page methods to show popular stuff
  ipcMain.handle("get:top-songs", (evt, limit: boolean) => db.mostPopularSongs(limit));
  ipcMain.handle("get:top-albums", (evt, limit: boolean) => db.mostPopularAlbums(limit));
  ipcMain.handle("get:custom-albums", () => db.getAllCustomAlbums());
  ipcMain.handle("get:artists", () => db.getArtists());

  ipcMain.handle("get:custom-album", (evt, id: string) => db.getCustomAlbumDetails(id));
  ipcMain.handle("get:album", (evt, id: string) => db.albumDetails(id));
  ipcMain.handle("get:artist", (evt, name: string) => db.artistDetails(name));

  ipcMain.handle("get:album-songs", (evt, albumId: string) => db.albumSongs(albumId));
  ipcMain.handle("get:custom-album-songs", (evt, albumId: string) => db.getCustomAlbumSongs(albumId));
  ipcMain.handle("get:artist-songs", (evt, name: string) => db.artistSongs(name));
  ipcMain.handle("get:liked", () => db.liked());
};

export default initGetters;
