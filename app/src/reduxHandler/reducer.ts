import { song } from "../types";

export interface reduxState {
  queue: song[];
  songs: song[];
  cur: number;
}

export interface reduxAction {
  type: string;
  payload: any;
}

const temp_song: song = {
  artist: "Artist",
  filePath: "fileName",
  thumbnail: "http://placekitten.com/200/200",
  title:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
  length: 69,
  numListens: 0
};

const initial: song[] = [
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song,
  temp_song
];

const initialState: reduxState = {
  queue: initial,
  songs: initial,
  cur: 0
};

const reducer = (oldState = initialState, action: reduxAction) => {
  let state = { ...oldState };

  switch (action.type) {
    case "set:songs":
      state.songs = action.payload;
      break;
    case "set:queue":
      state.queue = action.payload;
      break;
    case "set:cur":
      state.cur = action.payload;
      break;
    case "update:cur":
      state.cur += action.payload;
      break;
    default:
      break;
  }

  return state;
};

export default reducer;
