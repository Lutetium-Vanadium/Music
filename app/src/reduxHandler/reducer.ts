import { song } from "../types";
import { setArr, setNum } from "../localStorage";

/**
 * interface reduxState
 *
 * queue: the current playing queue;
 * songs: the list of all songs in the queue; (it exists because of shuffle)
 * cur: the index of the song playing in the queue;
 */
export interface reduxState {
  queue: song[];
  songs: song[];
  cur: number;
}

export interface reduxAction {
  type: string;
  payload: any;
}

const initialState: reduxState = {
  queue: [],
  songs: [],
  cur: -1
};

const reducer = (oldState = initialState, action: reduxAction) => {
  let state = { ...oldState };

  switch (action.type) {
    case "set:songs":
      state.songs = action.payload;
      break;
    case "set:queue":
      state.queue = action.payload;
      setArr("queue", action.payload);
      break;
    case "set:cur":
      state.cur = action.payload;
      setNum("cur", action.payload);
      break;
    case "update:cur":
      state.cur =
        (action.payload + state.cur + state.queue.length) % state.queue.length;
      setNum("cur", state.cur);
      break;
    default:
      break;
  }

  return state;
};

export default reducer;
