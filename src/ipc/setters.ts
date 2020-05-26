import { ipcMain, dialog, BrowserWindow } from "electron";

import db from "../functions/db_handler";
import Store from "../functions/store";
import checkDBs from "../checkDBs";

// Setters
const initSetters = (store: Store<Settings, SettingsKeys>, win: BrowserWindow) => {
  // Opens a select directory dialog which allows user to customize where the songs are stored and taken from
  ipcMain.handle("set:music-dir", async () => {
    const prevPath = store.get("folderStored");

    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
      title: "Choose Music Directory",
      defaultPath: prevPath,
    });

    if (!canceled && prevPath !== filePaths[0]) {
      store.set("folderStored", filePaths[0]);
      checkDBs(filePaths[0]);
    }

    return store.get("folderStored");
  });

  ipcMain.on("set:animations", (evt, animations) => {
    store.set("animations", animations);
    win.webContents.send("change:animations", animations);
  });

  ipcMain.on("set:info", (evt, info) => {
    store.setAll(info);
  });

  ipcMain.on("set:liked", (evt, title: string) => db.changeLiked(title));

  ipcMain.on("set:custom-album", async (evt, name: string, songs: string[]) => {
    win.webContents.send("update:custom-albums", await db.addCustomAlbum({ name, songs }));
  });
};

export default initSetters;
