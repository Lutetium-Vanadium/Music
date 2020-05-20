import React from "react";
import { useState, useEffect } from "react";

import Search from "#shared/Search";
import SongView from "#shared/SongView";

const { ipcRenderer } = window.require("electron");

function Music() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    ipcRenderer.invoke("get:music-names").then((songs: Song[]) => {
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
