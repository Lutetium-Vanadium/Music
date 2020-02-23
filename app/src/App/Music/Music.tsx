import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { song } from "../../types";
import Search from "../../shared/Search";
import SongView from "../../shared/SongView";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const empty: song[] = [];

function Music() {
  const [allSongs, setAllSongs] = useState(empty);
  const [songs, setSongs] = useState(empty);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:music-names").then((songs: song[]) => {
        setSongs(songs);
        setAllSongs(songs);
      });
    }
  }, []);

  const search = async (value: string) => {
    if (ipcRenderer) {
      const songs = await ipcRenderer.invoke("search:local", value);
      setSongs(songs);
    }
  };

  return (
    <div className="music">
      <div className="header-wrapper">
        <h1 className="header">My Music</h1>
        <Search
          handleChange={search}
          handleSubmit={search}
          placeholder="Filter"
        />
      </div>
      <SongView
        setSongs={setSongs}
        setAllSongs={setAllSongs}
        songs={songs}
        allSongs={allSongs}
      />
    </div>
  );
}

export default Music;
