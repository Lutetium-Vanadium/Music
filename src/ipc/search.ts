import { ipcMain } from "electron";

import { search } from "../functions/napster";
import db from "../functions/db_handler";
// search methods

const initSearch = () => {
  // Gets all the songs stored in the db whose name contains the given string
  ipcMain.handle("search:local", async (evt, val) => {
    const results = db.search(val);
    return results;
  });

  // Handles general search query for new songs
  ipcMain.handle("search:global", async (evt, val) => {
    const result = await search(val);

    if (!result.status) console.error(`\x1b[31m${result.error}\x1b[0m`);

    return result;
  });
};

export default initSearch;
