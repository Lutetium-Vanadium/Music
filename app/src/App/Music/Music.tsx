import React from "react";
import { useState, useEffect, useRef } from "react";

import { song } from "#root/types";
import Search from "#shared/Search";
import SongView from "#shared/SongView";

const { ipcRenderer } = window.require("electron");

const empty: song[] = [];

function Music() {
  const [allSongs, setAllSongs] = useState(empty);
  const [songs, setSongs] = useState(empty);

  useEffect(() => {
    ipcRenderer.invoke("get:music-names").then((songs: song[]) => {
      setSongs(songs);
      setAllSongs(songs);
    });

    console.log("RENDER");
  }, []);

  const search = async (value: string) => {
    const songs = await ipcRenderer.invoke("search:local", value);
    setSongs(songs);
  };

  return (
    <div className="music">
      <div className="header-wrapper">
        <h1 className="header">My Music</h1>
        <Search handleChange={search} handleSubmit={search} placeholder="Filter" />
      </div>
      <SongView setSongs={setSongs} setAllSongs={setAllSongs} songs={songs} allSongs={allSongs} />
    </div>
  );
}

export default Music;
