import React, { useState, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

interface SelectSong extends Song {
  selected: boolean;
}

interface EditAlbumScreenProps {
  songs?: Song[];
  name?: string;
  finish: (name: string, songTitles: string[]) => void;
  close: () => void;
}

function EditAlbumScreen({ songs: _songs = [], name: _name = "", finish, close }: EditAlbumScreenProps) {
  const [name, setName] = useState(_name);
  const [songs, setSongs] = useState<SelectSong[]>([]);

  const toggleSelectSong = (index: number) => {
    setSongs([...songs.slice(0, index), { ...songs[index], selected: !songs[index].selected }, ...songs.slice(index + 1)]);
  };

  const makeCustomAlbum = () => {
    const songTitles = songs.filter((song) => song.selected).map((song) => song.title);

    finish(name, songTitles);

    close();
  };

  useEffect(() => {
    ipcRenderer
      .invoke("get:music-names")
      .then((songs: Song[]) =>
        setSongs(songs.map((song) => ({ ...song, selected: _songs.findIndex((_song) => _song.title === song.title) > -1 })))
      );
  }, []);

  return (
    <div className="add-album-screen" onClick={(e) => e.stopPropagation()}>
      <header>
        <button onClick={close}>Cancel</button>
        <span>
          <input type="text" value={name} placeholder="Album Name" onChange={(e) => setName(e.target.value)} />
        </span>
        <button onClick={makeCustomAlbum} disabled={name.trim().length === 0}>
          Finish
        </button>
      </header>
      <div className="all-songs">
        {songs.map((song, i) => (
          <div key={song.filePath} onClick={() => toggleSelectSong(i)}>
            <img className="thumbnail" src={song.thumbnail} alt="thumbnail" />
            <div className="details">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
            <svg className="svg" viewBox="0 0 110 110">
              <rect className="box" x="5" y="5" width="100" height="100" transform="rotate(90 55 55)" />
              <path className={song.selected ? "check" : "unchecked"} d="M90,20 L45.7,75.1 L20.2,55.4" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditAlbumScreen;
