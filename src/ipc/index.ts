import { BrowserWindow } from "electron";

import initGetters from "./getters";
import initMiscellaneous from "./miscellaneous";
import initSearch from "./search";
import initSetters from "./setters";
import Store from "../functions/store";
import { song } from "../types";

export interface Windows {
  [key: string]: BrowserWindow;
}

const initIpc = (
  store: Store,
  windows: Windows,
  setUpRemote: (song: song) => void,
  downloader
) => {
  initGetters(store);
  initMiscellaneous(store, windows, downloader);
  initSearch();
  initSetters(store, windows, setUpRemote);
};

export default initIpc;
