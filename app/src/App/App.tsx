import * as React from "react";
import { useState, useEffect, useReducer } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Music from "./Music";
import SearchPage from "./SearchPage";
import Settings from "./Settings";
import Home from "./Home";
import Albums from "./Albums";
import Album from "./Album";
import Artists from "./Artists";
import Artist from "./Artist";
import { song, searchResult } from "#root/types";
import Player from "#shared/Player";
import { reduxState } from "#root/reduxHandler";

import logo from "#logos/logo.png";
const { ipcRenderer } = window.require("electron");

const empty: song[] = [];

function App() {
  const [searchResults, setSearchResults] = useState(empty);
  // TODO use searchSuccess
  const [searchSuccess, setSearchSuccess] = useState(true);
  const [downloadError, setDownloadError] = useState(false);
  const [downloading, dispatch] = useReducer(reducer, {});
  const queue = useSelector((state: reduxState) => state.queue);
  // Used by SearchPage to show loader on initial search results
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const search = async (query: string) => {
    const result: searchResult = await ipcRenderer.invoke(
      "search:global",
      query
    );
    if (result.status) {
      setSearchResults(result.songs);
    }

    setSearchSuccess(result.status);
    setLoading(false);
  };

  const download = async (song: song) => {
    const id = await ipcRenderer.invoke("download-song", song);
    setDownloadError(false);
    dispatch({
      type: "start:download",
      id,
      payload: song
    });
    new Notification(song.title, {
      body: `Downloading ${song.title} by ${song.artist}.`,
      badge: logo,
      icon: song.thumbnail
    });
  };

  useEffect(() => {
    // Handles progress updates sent by electron for when a song is being downloaded
    ipcRenderer.on("update:download-query", (evt, { progress, id }) => {
      dispatch({
        type: "update:download",
        id,
        payload: progress
      });
    });
    ipcRenderer.on("finished:download-query", (evt, { id, filePath }) => {
      dispatch({
        type: "finish:download",
        id,
        payload: filePath
      });
    });
    ipcRenderer.on("error:download-query", () => setDownloadError(true));
    ipcRenderer.on("reset-global-search", () => setLoading(true));
  }, []);

  const showBack =
    location.pathname.match(
      /\/(albums\/alb\.[0-9]*|liked|search|artists\/[a-zA-Z0-9]*)/
    ) !== null;

  return (
    <div>
      <Navbar
        search={search}
        downloading={downloading}
        errored={downloadError}
        showBack={showBack}
        // backClick={handleBackClick}
      />
      <main>
        <Switch>
          <Route
            path="/search"
            render={() => (
              <SearchPage
                download={download}
                results={searchResults}
                loading={loading}
                success={searchSuccess}
              />
            )}
          />
          <Route path="/music" component={Music} />
          <Route path="/albums/:id" component={Album} />
          <Route path="/albums" component={Albums} />
          <Route path="/artists/:name" component={Artist} />
          <Route path="/artists" component={Artists} />
          <Route path="/settings" component={Settings} />
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
      const song: song = newState[action.id].song;
      new Notification(song.title, {
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
