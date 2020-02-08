import * as React from "react";
import { useState, useEffect } from "react";

import { song } from "#root/types";
import Song from "#shared/Song";

const { ipcRenderer } = window.require("electron");

const initial: song[] = [];

function Music() {
  const [songs, setSongs] = useState(initial);

  useEffect(() => {
    ipcRenderer
      .invoke("get:music-names")
      .then((songs: song[]) => setSongs(songs));
  }, []);

  const len = songs.length;  

  return (
    <div className="my-music">
      <ul className="music-names">
        {songs.length
          ? songs.map((song, i) => <Song key={`song-${i}`} song={song} />)
          : "No Songs"}
      </ul>
    </div>
  );
}

export default Music;
