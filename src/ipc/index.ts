import { BrowserWindow } from "electron";

import initGetters from "./getters";
import initMiscellaneous from "./miscellaneous";
import initSearch from "./search";
import initSetters from "./setters";
import Store from "../functions/store";

const initIpc = (store: Store<Settings, SettingsKeys>, win: BrowserWindow, downloader: YoutubeMp3Downloader) => {
  initGetters(store);
  initMiscellaneous(store, win, downloader);
  initSearch();
  initSetters(store, win);
};

export default initIpc;
