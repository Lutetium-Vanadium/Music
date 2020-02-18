import * as React from "react";
import { useState, useEffect, useReducer } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Settings from "./Settings";
import Music from "./Music";
import SearchPage from "./SearchPage";
import Home from "./Home";
import { song, searchResult } from "../types";
import Player from "../shared/Player";
import { reduxState } from "../reduxHandler";

import logo from "#logos/logo.png";

let ipcRenderer;
if (window.require) ipcRenderer = window.require("electron").ipcRenderer;

function App() {
  const [searchResults, setSearchResults] = useState(initialSearchParams);
  const [searchSuccess, setSearchSuccess] = useState(true);
  // const [progress, setProgress] = useState(0);
  // const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  // const [downloading, setDownloading] = useState({});
  const [downloading, dispatch] = useReducer(reducer, {});
  const queue = useSelector((state: reduxState) => state.queue);

  const search = async (query: string) => {
    if (ipcRenderer) {
      const result: searchResult = await ipcRenderer.invoke(
        "search:global",
        query
      );
      if (result.status) {
        setSearchResults(result.songs);
      } else {
        setSearchSuccess(false);
      }
    }
  };

  const download = async (song: song) => {
    if (ipcRenderer) {
      const id = await ipcRenderer.invoke("download-song", song);
      setDownloadError(false);
      dispatch({
        type: "start:download",
        id,
        payload: song
      });
      new Notification(`Downloading ${song.title}`, {
        body: `Downloading ${song.title} by ${song.artist}.`,
        badge: logo,
        icon: song.thumbnail
      });
    }
  };

  useEffect(() => {
    if (ipcRenderer) {
      // Handles progress updates sent by electron for when a song is being downloaded
      ipcRenderer.on("update:download-query", (evt, { progress, id }) => {
        dispatch({
          type: "update:download",
          id,
          payload: progress
        });
      });
      ipcRenderer.on("finished:download-query", (evt, a) => {
        console.log({ a });
        const { id, filePath } = a;
        dispatch({
          type: "finish:download",
          id,
          payload: filePath
        });
      });
      ipcRenderer.on("error:download-query", () => setDownloadError(true));
    }
  }, []);

  return (
    <div>
      <Navbar
        search={search}
        downloading={downloading}
        errored={downloadError}
      />
      <main>
        <Switch>
          <Route path="/settings" component={Settings} />
          <Route
            path="/search"
            render={() => (
              <SearchPage download={download} results={searchResults} />
            )}
          />
          <Route path="/music" component={Music} />
          <Route path="/" component={Home} />
        </Switch>
      </main>
      {queue.length ? <Player /> : null}
    </div>
  );
}

export default App;

const formatFilePath = (filePath: string) => {
  let fileArray = filePath.split("/");
  fileArray.pop();
  return fileArray.join("/");
};

interface action {
  type: string;
  id: string;
  payload?: any;
}

const reducer = (state: object, action: action) => {
  let newState = { ...state };

  switch (action.type) {
    case "start:download":
      newState[action.id] = {
        progress: 0,
        song: action.payload
      };
      break;
    case "update:download":
      newState[action.id].progress = action.payload;
      break;
    case "finish:download":
      // While this may not be the best place to put a notification, it is required since updated
      // `state` is not available in the useEffect
      console.log({ newState, action });
      const song: song = newState[action.id].song;
      new Notification(`Downloaded ${song.title}`, {
        body: `Finished Downloading ${song.title} by ${
          song.artist
        }.\n It is stored in ${formatFilePath(action.payload)}`,
        badge: logo,
        icon: song.thumbnail
      });
      delete newState[action.id];
      break;
    default:
      break;
  }

  return newState;
};

const temp_song: song = {
  artist: "Artist",
  filePath: "fileName",
  thumbnail: "http://placekitten.com/200/200",
  title:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
  length: 69,
  numListens: 0
};

const initialSearchParams: song[] = [
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
