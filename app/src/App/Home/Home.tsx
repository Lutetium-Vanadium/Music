import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { create } from "../../reduxHandler";
import { song, album } from "../../types";
import Settings from "./Settings";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const emptyAlbum: album[] = [];
const emptySong: song[] = [];

function Home({ setCur, setQueue, setSongs }) {
  const [topAlbums, setTopAlbums] = useState(emptyAlbum);
  const [topSongs, setTopSongs] = useState(emptySong);

  const playSong = async (index: number) => {
    if (ipcRenderer) {
      const songs = await ipcRenderer.invoke("get:top-songs", false);
      setCur(index);
      setQueue(songs);
      setSongs(songs);
    }
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:top-songs", true).then((data: song[]) => {
        setTopSongs(data);
      });
      ipcRenderer.invoke("get:top-albums", true).then((data: album[]) => {
        setTopAlbums(data);
      });
    }
  }, []);

  return (
    <div className="home">
      <h1 className="header">Top Albums</h1>
      <div className="top-list">
        {topAlbums.map((album, i) => (
          <div key={album.imagePath} className="top">
            <img className="top" src={album.imagePath} alt="top-album" />
            <p className="top-title">{album.name}</p>
          </div>
        ))}
      </div>
      <h1 className="header">Top Songs</h1>
      <div className="top-list last">
        {topSongs.map((song, i) => (
          <div
            key={song.filePath}
            className="top-song"
            onClick={() => playSong(i)}
          >
            <img className="top" src={song.thumbnail} alt="top-song" />
            <p className="top-title">{song.title}</p>
          </div>
        ))}
      </div>
      <hr />
      <Settings />
    </div>
  );
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCur: create.setCur(dispatch),
  setQueue: create.setQueue(dispatch),
  setSongs: create.setSongs(dispatch)
});

export default connect(null, mapDispatchToProps)(Home);
