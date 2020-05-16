import { ipcMain, dialog } from "electron";

import db from "../functions/db_handler";
import Store from "../functions/store";
import { song } from "../types";
import { Windows } from ".";

// Setters
const initSetters = (store: Store, { win, remote }: Windows, setUpRemote: (song: song) => void) => {
  // Opens a select directory dialog which allows user to customize where the songs are stored and taken from
  ipcMain.handle("set:music-dir", async (evt, val) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
      title: "Choose Music Directory",
      defaultPath: store.get("folderStored"),
    });

    if (!canceled) {
      store.set("folderStored", filePaths[0]);
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
};

export default initSetters;
