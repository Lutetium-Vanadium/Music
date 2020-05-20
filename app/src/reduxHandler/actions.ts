import { Dispatch } from "redux";

const { ipcRenderer } = window.require("electron");

// These functions take a dispatch event and return a function which call a dispatch with the appropiate options

const create = {
  setSongs: (dispatch: Dispatch) => (songs: Song[]) => {
    dispatch({
      type: "set:songs",
      payload: songs,
    });
  },

  setQueue: (dispatch: Dispatch) => (songs: Song[]) => {
    dispatch({
      type: "set:queue",
      payload: songs,
    });
  },

  setCur: (dispatch: Dispatch) => (num: number) => {
    dispatch({
      type: "set:cur",
      payload: num,
    });
  },

  nextSong: (dispatch: Dispatch) => () => {
    dispatch({
      type: "update:cur",
      payload: 1,
    });
  },

  prevSong: (dispatch: Dispatch) => () => {
    dispatch({
      type: "update:cur",
      payload: -1,
    });
  },

  likeSong: (dispatch: Dispatch) => (song: Song) => {
    console.log({ song });

    ipcRenderer.send("set:liked", song.title);
    dispatch({
      type: "toggle:liked",
      payload: song,
    });
  },
};

export default create;
