import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

import ContextMenu from "./ContextMenu";
import { song } from "../../types";
import Song from "../../shared/Song";
import { Dispatch } from "redux";
import { create, reduxState } from "../../reduxHandler";
import Search from "../../shared/Search";
// import { song } from "#root/types";
// import Song from "#shared/Song";

import logo from "#logos/logo.png";

let ipcRenderer;

if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface MusicProps {
  setQueue: (songs: song[]) => void;
  setSongs: (songs: song[]) => void;
  setCur: (num: number) => void;
  cur: number;
}

function Music({ setQueue, setSongs: reduxSetSongs, setCur }: MusicProps) {
  const [allSongs, setAllSongs] = useState(initial);
  const [songs, setSongs] = useState(initial);
  const [pos, setPos] = useState([-200, -200]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:music-names").then((songs: song[]) => {
        setSongs(songs);
        setAllSongs(songs);
      });
    }
  }, []);

  const _play = (index: number) => {
    reduxSetSongs(allSongs);
    setQueue(allSongs);
    setCur(index);
  };

  const play = () => {
    if (index === -1) return;
    _play(index);
    setPos([-200, -200]);
  };

  const playSong = (song: song) => {
    const index = allSongs.findIndex(_song => _song.title === song.title);
    _play(index);
  };

  const search = async (value: string) => {
    if (ipcRenderer) {
      const songs = await ipcRenderer.invoke("search:local", value);
      setSongs(songs);
    }
  };

  const handleDotClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    // Prevent event bubbling
    e.stopPropagation();
    setPos([e.pageX, e.pageY]);
    setIndex(+e.currentTarget.dataset.index);
  };

  const del = async () => {
    const song = songs[index];
    setSongs([
      ...songs.slice(0, index),
      ...songs.slice(index + 1, songs.length)
    ]);
    const allSongsIndex = allSongs.findIndex(
      value => value.title === song.title
    );
    setAllSongs([
      ...allSongs.slice(0, allSongsIndex),
      ...allSongs.slice(allSongsIndex + 1, allSongs.length)
    ]);
    setPos([-200, -200]);
    if (ipcRenderer) {
      const success = await ipcRenderer.invoke("delete:song", song);
      let body = success
        ? `Succesfully deleted ${song.title} by ${song.artist}`
        : `Couldn't delete ${song.title} by ${song.artist}`;

      new Notification(`${song.title}`, {
        body,
        badge: logo,
        icon: song.thumbnail
      });
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
      <ContextMenu
        pos={pos}
        reset={() => setPos([-200, -200])}
        play={play}
        del={del}
      />
      <ul className="music-names">
        {songs.length ? (
          songs.map((song, i) => (
            <Song
              key={`song-${i}`}
              song={song}
              onClick={() => playSong(song)}
              className="has-dot3"
              After={TripleDot}
              afterProps={{
                onClick: handleDotClick,
                "data-index": i
              }}
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

interface TripleDotProps {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const TripleDot = ({ onClick, ...props }: TripleDotProps) => (
  <svg {...props} viewBox="-30 -80 150 180" className="dot3" onClick={onClick}>
    <circle cx="10" cy="10" r="10" fill="white" />
    <circle cx="45" cy="10" r="10" fill="white" />
    <circle cx="80" cy="10" r="10" fill="white" />
  </svg>
);

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
