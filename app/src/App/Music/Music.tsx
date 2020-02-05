import * as React from "react";
import { useState, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

const initial: string[] = [];

function Music() {
  const [songs, setSongs] = useState(initial);

  useEffect(() => {
    ipcRenderer
      .invoke("get:music-names")
      .then((songs: string[]) => setSongs(songs));
  }, []);

  return (
    <div className="my-music">
      <ul className="music-names">
        {songs.length
          ? songs.map((song, i) => (
              <li key={`song-${i}`} className="song-name">
                {song.slice(0, -3)}
              </li>
            ))
          : "No Songs"}
      </ul>
    </div>
  );
}

export default Music;
