import * as React from "react";
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Settings from "./Settings";
import Music from "./Music";
import SearchPage from "./SearchPage";
import { song, searchResult } from "../types";
import Player from "../shared/Player";
import { reduxState } from "../reduxHandler";

let ipcRenderer;
if (window.require) ipcRenderer = window.require("electron").ipcRenderer;

const Null = () => <div></div>;

function App() {
  const [searchResults, setSearchResults] = useState(initialSearchParams);
  const [searchSuccess, setSearchSuccess] = useState(true);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  // const [songs, setSongs] = useState(initialSearchParams);
  // const [queue, setQueue] = useState(initialSearchParams);
  // const [cur, setCur] = useState(0);
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

  // const playSong = (songs: song[], index: number) => {
  //   console.log("Playing songs");

  //   console.log({ songs });

  //   setQueue(songs);
  //   setSongs(songs);
  //   setCur(index);
  // };

  // const pushShuffle = () => {
  //   if (shuffle) {
  //     setQueue(songs);
  //     setCur(songs.findIndex(song => song === songs[cur]));
  //   } else {
  //     // Since arrays are passed in by reference, a shallow copy is passed down
  //     setQueue(shuffleSongs([...songs], cur));
  //     setCur(0);
  //   }
  //   setShuffle(!shuffle);
  // };

  useEffect(() => {
    if (ipcRenderer) {
      // Handles progress updates sent by electron for when a song is being downloaded
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
      {queue.length ? <Player /> : null}
    </div>
  );
}

export default App;

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
