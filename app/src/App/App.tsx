import * as React from "react";
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Settings from "./Settings";
import Music from "./Music";
import SearchPage from "./SearchPage";
import { song, searchResult } from "../types";
import Player from "../shared/Player";

let ipcRenderer;
if (window.require) ipcRenderer = window.require("electron").ipcRenderer;

const Null = () => <div></div>;

function App() {
  const [searchResults, setSearchResults] = useState(initialSearchParams);
  const [searchSuccess, setSearchSuccess] = useState(true);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [queue, setqueue] = useState(initialSearchParams);
  const [cur, setCur] = useState(0);

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

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("update:download-query", (evt, progress: number) => {
        if (!downloading) setDownloading(true);
        setProgress(progress);
      });
      ipcRenderer.on("finished:download-query", () => setDownloading(false));
      ipcRenderer.on("error:download-query", () => setDownloadError(true));
    }
  }, []);

  return (
    <div>
      <Navbar
        progressbarProps={{ progress, errored: downloadError }}
        search={search}
        downloading={downloading}
      />
      <main>
        <Switch>
          <Route path="/settings" component={Settings} />
          <Route
            path="/search"
            render={() => <SearchPage results={searchResults} />}
          />
          <Route path="/music" component={Music} />
          <Route path="/" component={Null} />
        </Switch>
      </main>
      <Player
        song={queue[cur]}
        back={cur === 0 ? null : () => setCur(cur - 1)}
        next={cur === queue.length - 1 ? null : () => setCur(cur + 1)}
      />
    </div>
  );
}

export default App;

const temp_song = {
  artist: "Artist",
  fileName: "fileName",
  thumbnail: "http://placekitten.com/200/200",
  title:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
  length: 69
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
