import React from "react";
import { useState } from "react";
import { Dispatch } from "redux";

import useAction from "#root/useAction";
import { create } from "#root/reduxHandler";
import { song } from "#root/types";
import Song from "#shared/Song";

import ContextMenu from "./ContextMenu";

import logo from "#logos/logo.png";

const { ipcRenderer } = window.require("electron");

interface SongViewProps {
  songs: song[];
  allSongs: song[];
  setSongs: React.Dispatch<React.SetStateAction<song[]>>;
  setAllSongs: React.Dispatch<React.SetStateAction<song[]>>;
  showButtons?: boolean;
}

function SongView({ setSongs, setAllSongs, allSongs, songs, showButtons = true }: SongViewProps) {
  const [pos, setPos] = useState([-200, -200]);
  const [index, setIndex] = useState(-1);

  const { setCur, setQueue, reduxSetSongs, likeSong } = useAction((dispatch: Dispatch) => ({
    setQueue: create.setQueue(dispatch),
    reduxSetSongs: create.setSongs(dispatch),
    setCur: create.setCur(dispatch),
    likeSong: create.likeSong(dispatch),
  }));

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
    const index = allSongs.findIndex((_song) => _song.title === song.title);
    _play(index);
  };

  const handleDotClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setPos([e.pageX, e.pageY]);
    setIndex(+e.currentTarget.dataset.index);
  };

  const toggleLiked = async () => {
    likeSong(songs[index]);
    setPos([-200, -200]);
  };

  const del = async () => {
    const song = songs[index];

    const confirmed = confirm(`Are you sure you want to delete ${song.title} by ${song.artist}?`);
    setPos([-200, -200]);
    if (!confirmed) return;

    setSongs([...songs.slice(0, index), ...songs.slice(index + 1, songs.length)]);
    const allSongsIndex = allSongs.findIndex((value) => value.title === song.title);
    setAllSongs([...allSongs.slice(0, allSongsIndex), ...allSongs.slice(allSongsIndex + 1, allSongs.length)]);
    setIndex(index - 1);
    const success = await ipcRenderer.invoke("delete:song", song);
    let body = success ? `Succesfully deleted ${song.title} by ${song.artist}` : `Couldn't delete ${song.title} by ${song.artist}`;

    new Notification(`${song.title}`, {
      body,
      badge: logo,
      icon: song.thumbnail,
    });
  };

  return (
    <>
      {showButtons && (
        <div className="buttons">
          <button className="begin" onClick={() => _play(0)}>
            Play First Song
          </button>
          <button className="random" onClick={() => _play(randint(songs.length))}>
            Play Random Song
          </button>
        </div>
      )}
      <ContextMenu
        pos={pos}
        reset={() => setPos([-200, -200])}
        play={play}
        del={del}
        toggleLiked={toggleLiked}
        liked={index !== -1 && songs[index].liked}
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
                "data-index": i,
              }}
            />
          ))
        ) : (
          <p className="no-results">No Songs</p>
        )}
      </ul>
    </>
  );
}

export default SongView;

interface TripleDotProps {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

function TripleDot({ onClick, ...props }: TripleDotProps) {
  return (
    <svg {...props} viewBox="-30 -80 150 180" className="dot3" onClick={onClick}>
      <circle cx="10" cy="10" r="10" fill="white" />
      <circle cx="45" cy="10" r="10" fill="white" />
      <circle cx="80" cy="10" r="10" fill="white" />
    </svg>
  );
}

const randint = (max: number) => {
  return Math.floor(Math.random() * max);
};
