import { setArr, setNum } from "#root/localStorage";

/**
 * interface reduxState
 *
 * queue: the current playing queue;
 * songs: the list of all songs in the queue; (it exists because of shuffle)
 * cur: the index of the song playing in the queue;
 */
export interface ReduxState {
  queue: Song[];
  songs: Song[];
  cur: number;
}

export interface ReduxAction {
  type: string;
  payload: any;
}

const initialState: ReduxState = {
  queue: [],
  songs: [],
  cur: -1,
};

const reducer = (oldState = initialState, action: ReduxAction) => {
  const state = { ...oldState };

  switch (action.type) {
    case "toggle:liked":
      const songsIndex = state.songs.indexOf(action.payload);
      if (songsIndex >= 0) {
        state.songs[songsIndex].liked = !state.songs[songsIndex].liked;
      }

      const queueIndex = state.queue.indexOf(action.payload);
      if (queueIndex >= 0) {
        state.queue[queueIndex].liked = !state.queue[queueIndex].liked;
      }
      setArr("queue", state.queue);
      break;
    case "set:songs":
      console.log({ action });
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
      state.cur = (action.payload + state.cur + state.queue.length) % state.queue.length;
      setNum("cur", state.cur);
      break;
  }

  return state;
};

export default reducer;
