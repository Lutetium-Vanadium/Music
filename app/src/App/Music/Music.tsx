import * as React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

import { song } from "../../types";
import Song from "../../shared/Song";
import { Dispatch } from "redux";
import { create } from "../../reduxHandler";
// import { song } from "#root/types";
// import Song from "#shared/Song";

let ipcRenderer;

if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface MusicProps {
  setQueue: (songs: song[]) => void;
  setCur: (num: number) => void;
}

function Music({ setQueue, setCur }: MusicProps) {
  const [songs, setSongs] = useState(initial);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer
        .invoke("get:music-names")
        .then((songs: song[]) => setSongs(songs));
    }
  }, []);

  const playSong = (index: number) => {
    console.log({ songs });

    setQueue(songs);
    setCur(index);
  };

  // const playSong = (index: number) => {
  //   pushSong(songs, index);
  // };

  return (
    <div className="music">
      <h1 className="header">My Music</h1>
      <ul className="music-names">
        {songs.length
          ? songs.map((song, i) => (
              <Song key={`song-${i}`} song={song} onClick={() => playSong(i)} />
            ))
          : "No Songs"}
      </ul>
    </div>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setQueue: create.setQueue(dispatch),
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
