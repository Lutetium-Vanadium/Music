import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Link } from "react-router-dom";

import { create } from "../../reduxHandler";
import { song, album } from "../../types";
import { getArr, getNum } from "../../localStorage";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const emptyAlbum: album[] = [];
const emptySong: song[] = [];

const reposition = (arr: any[], index: number) => {
  return [...arr.slice(index, arr.length), ...arr.slice(0, index)];
};

const lastQueue: song[] = reposition(getArr("queue"), getNum("cur"));

function Home({ setCur, setQueue, setSongs }) {
  const [topAlbums, setTopAlbums] = useState(emptyAlbum);
  const [topSongs, setTopSongs] = useState(emptySong);

  const playSong = async (index: number) => {
    if (ipcRenderer) {
      const songs: song[] = await ipcRenderer.invoke("get:top-songs", false);
      setCur(index);
      setQueue(songs);
      setSongs(songs);
    }
  };

  const playLastQueue = (index: number) => {
    setCur(index);
    setQueue(lastQueue);
    setSongs(lastQueue);
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

  const showPrev = lastQueue.length > 0;

  return (
    <div className="home">
      <h1 className="header">Top Albums</h1>
      <div className="top-list">
        {topAlbums.map(album => (
          <Link
            to={`/albums/${album.id}`}
            key={album.id}
            className="top-wrapper"
          >
            <img className="top" src={album.imagePath} alt="top-album" />
            <p className="top-title">{album.name}</p>
          </Link>
        ))}
      </div>
      <h1 className="header">Most Heard Songs</h1>
      <div className={`top-list${showPrev ? "" : " last"}`}>
        {topSongs.map((song, i) => (
          <div
            key={song.filePath}
            className="top-wrapper"
            onClick={() => playSong(i)}
          >
            <img className="top" src={song.thumbnail} alt="top-song" />
            <p className="top-title">{song.title}</p>
          </div>
        ))}
      {showPrev ? (
        <>
          <h1 className="header">Pickup Where You Left Off</h1>
          <div className="top-list last">
            {lastQueue.slice(0, 5).map((song, i) => (
              <div
                key={song.filePath}
                className="top-wrapper"
                onClick={() => playLastQueue(i)}
              >
                <img className="top" src={song.thumbnail} alt="top-song" />
                <p className="top-title">{song.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCur: create.setCur(dispatch),
  setQueue: create.setQueue(dispatch),
  setSongs: create.setSongs(dispatch)
});

export default connect(null, mapDispatchToProps)(Home);
