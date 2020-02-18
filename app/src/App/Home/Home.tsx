import React from "react";
import { useState, useEffect } from "react";
import { song } from "../../types";
let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const emptyStr: string[] = [];
const emptySong: song[] = [];

function Home() {
  const [topAlbums, setTopAlbums] = useState(emptyStr);
  const [topSongs, setTopSongs] = useState(emptySong);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:top-songs").then((data: song[]) => {
        setTopSongs(data);
      });
      ipcRenderer.invoke("get:top-albums").then((data: string[]) => {
        setTopAlbums(data);
      });
    }
  }, []);

  return (
    <div className="home">
      <h1 className="header">Top Albums</h1>
      <div className="top-list">
        {topAlbums.map((thumbnail, i) => (
          <img
            key={`index-${i}`}
            className="top"
            src={thumbnail}
            alt="top-album"
          />
        ))}
      </div>
      <h1 className="header">Top Songs</h1>
      <div className="top-list last">
        {topSongs.map(song => (
          <div key={song.filePath} className="top-song">
            <img className="top" src={song.thumbnail} alt="top-song" />
            <p className="top-title">{song.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
