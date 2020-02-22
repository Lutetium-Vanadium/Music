import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { song } from "../../types";
import Search from "../../shared/Search";
import SongView from "../../shared/SongView";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

function Music() {
  const [allSongs, setAllSongs] = useState(initial);
  const [songs, setSongs] = useState(initial);

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

const initial: song[] = [
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://pacekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  },
  {
    artist: "Artist",
    filePath: "filePath",
    thumbnail: "http://placekitten.com/200/200",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, quibusdam!",
    length: 69,
    numListens: 0
  }
];
