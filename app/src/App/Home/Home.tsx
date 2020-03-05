import * as React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Link } from "react-router-dom";

import { create } from "#root/reduxHandler";
import { song, album } from "#root/types";
import { getArr, getNum } from "#root/localStorage";

const { ipcRenderer } = window.require("electron");

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
    const songs: song[] = await ipcRenderer.invoke("get:top-songs", false);
    setCur(index);
    setQueue(songs);
    setSongs(songs);
  };

  const playLastQueue = (index: number) => {
    setCur(index);
    setQueue(lastQueue);
    setSongs(lastQueue);
  };

  useEffect(() => {
    ipcRenderer.invoke("get:top-songs", true).then((data: song[]) => {
      setTopSongs(data);
    });
    ipcRenderer.invoke("get:top-albums", true).then((data: album[]) => {
      setTopAlbums(data);
    });
  }, []);

  const showPrev = lastQueue.length > 0;

  return (
    <div className="home">
      <h1 className="header">Top Albums</h1>
      <div className="top-list">
        {topAlbums.map(album => (
          <div className="top-wrapper" key={album.id}>
            <Link to={`/albums/${album.id}`}>
              <img className="top" src={album.imagePath} alt="top-album" />
            </Link>
            <p className="top-title">{album.name}</p>
          </div>
        ))}
      </div>
      <h1 className="header">Most Heard Songs</h1>
      <div className={`top-list${showPrev ? "" : " last"}`}>
        {topSongs.map((song, i) => (
          <div key={song.filePath} className="top-wrapper">
            <img
              onClick={() => playSong(i)}
              className="top"
              src={song.thumbnail}
              alt="top-song"
            />
            <p className="top-title">{song.title}</p>
          </div>
        ))}
      </div>
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
  );
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCur: create.setCur(dispatch),
  setQueue: create.setQueue(dispatch),
  setSongs: create.setSongs(dispatch)
});

export default connect(null, mapDispatchToProps)(Home);
