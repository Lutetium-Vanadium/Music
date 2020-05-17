import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import SongView from "#shared/SongView";
import { Song, Album } from "#root/types";
import liked from "#root/App/liked.png";
import music_symbol from "#root/App/music_symbol.png";

const { ipcRenderer } = window.require("electron");

const defaultAlbum: Album = {
  id: "id",
  imagePath: music_symbol,
  name: "album",
  numSongs: 0,
  artist: "artist",
};

function Album({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [album, setAlbum] = useState(defaultAlbum);

  useEffect(() => {
    if (id === "liked") {
      ipcRenderer.invoke("get:liked").then((res: Song[]) => {
        setSongs(res);
        setAlbum({
          id: "liked",
          imagePath: liked,
          name: "Liked",
          numSongs: songs.length,
          artist: "You",
        });
      });
    } else {
      ipcRenderer.invoke("get:album", id).then((res: Album) => setAlbum(res));

      ipcRenderer.invoke("get:album-songs", id).then((res: Song[]) => setSongs(res));
    }
  }, []);

  return (
    <div className="music">
      <div className="album-header">
        <img className="album-img" src={album.imagePath} alt="album-picture" />
        <h1 className="header">{album.name}</h1>
      </div>
      <SongView setSongs={setSongs} setAllSongs={setSongs} songs={songs} allSongs={songs} />
    </div>
  );
}

export default Album;
