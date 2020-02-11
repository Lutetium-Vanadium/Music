import * as React from "react";
import { useState, useEffect } from "react";

import { song } from "../../types";
import Song from "../../shared/Song";
// import { song } from "#root/types";
// import Song from "#shared/Song";

let ipcRenderer;

if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

function Music() {
  const [songs, setSongs] = useState(initial);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer
        .invoke("get:music-names")
        .then((songs: song[]) => setSongs(songs));
    }
  }, []);

  return (
    <div className="music">
      <h1 className="header">My Music</h1>
      <ul className="music-names">
        {songs.length
          ? songs.map((song, i) => <Song key={`song-${i}`} song={song} />)
          : "No Songs"}
      </ul>
    </div>
  );
}

export default Music;

const initial: song[] = [
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  },
  {
    artist: "Artist",
    fileName: "fileName",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!"
  }
];
