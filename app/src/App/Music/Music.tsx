import * as React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

import ContextMenu from "./ContextMenu";
import { song } from "../../types";
import Song from "../../shared/Song";
import { Dispatch } from "redux";
import { create } from "../../reduxHandler";
import Search from "../../shared/Search";
// import { song } from "#root/types";
// import Song from "#shared/Song";

let ipcRenderer;

if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface MusicProps {
  setQueue: (songs: song[]) => void;
  setSongs: (songs: song[]) => void;
  setCur: (num: number) => void;
}

function Music({ setQueue, setSongs: reduxSetSongs, setCur }: MusicProps) {
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

  const playSong = (song: song) => {
    const index = allSongs.findIndex(_song => _song.title === song.title);

    console.log({ index, allSongs, song });

    reduxSetSongs(allSongs);
    setQueue(allSongs);
    setCur(index);
  };

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
        <Search handleChange={search} handleSubmit={search} />
      </div>
      <ul className="music-names">
        {songs.length ? (
          songs.map((song, i) => (
            <Song
              key={`song-${i}`}
              song={song}
              onClick={() => playSong(song)}
            />
          ))
        ) : (
          <p className="no-results">No Songs</p>
        )}
      </ul>
    </div>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setQueue: create.setQueue(dispatch),
  setSongs: create.setSongs(dispatch),
  setCur: create.setCur(dispatch)
});

export default connect(null, mapDispatchToProps)(Music);

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
