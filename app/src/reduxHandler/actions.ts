import { song } from "../types";
import { Dispatch } from "redux";

// These functions take a dispatch event and return a function which call a dispatch with the appropiate options

const create = {
  setSongs: (dispatch: Dispatch) => (songs: song[]) => {
    dispatch({
      type: "set:songs",
      payload: songs
    });
  },

  setQueue: (dispatch: Dispatch) => (songs: song[]) => {
    dispatch({
      type: "set:queue",
      payload: songs
    });
  },

  setCur: (dispatch: Dispatch) => (num: number) => {
    dispatch({
      type: "set:cur",
      payload: num
    });
  },

  nextSong: (dispatch: Dispatch) => () => {
    dispatch({
      type: "update:cur",
      payload: 1
    });
  },

  prevSong: (dispatch: Dispatch) => () => {
    dispatch({
      type: "update:cur",
      payload: -1
    });
  }
};

export default create;
