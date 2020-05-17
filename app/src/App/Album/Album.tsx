import * as React from "react";
import { useState, useEffect } from "react";

import SongView from "#shared/SongView";
import { song, album } from "#root/types";
import liked from "#root/App/liked.png";
import music_symbol from "#root/App/music_symbol.png";

const { ipcRenderer } = window.require("electron");

const emptySongs: song[] = [];
const emptyAlbum: album = {
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
}) {
  const [songs, setSongs] = useState(emptySongs);
  const [album, setAlbum] = useState(emptyAlbum);

  useEffect(() => {
    if (id === "liked") {
      ipcRenderer.invoke("get:liked").then((res: song[]) => {
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
      ipcRenderer.invoke("get:album", id).then((res: album) => setAlbum(res));

      ipcRenderer
        .invoke("get:album-songs", id)
        .then((res: song[]) => setSongs(res));
    }
  }, []);

  return (
    <div className="music">
      <div className="album-header">
        <img className="album-img" src={album.imagePath} alt="album-picture" />
        <h1 className="header">{album.name}</h1>
      </div>
      <SongView
        setSongs={setSongs}
        setAllSongs={setSongs}
        songs={songs}
        allSongs={songs}
      />
    </div>
  );
}

export default Album;
