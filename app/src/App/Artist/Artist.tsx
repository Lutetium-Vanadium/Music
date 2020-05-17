import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import SongView from "#shared/SongView";
import { Song, Artist } from "#root/types";
import music_symbol from "#root/App/music_symbol.png";

const { ipcRenderer } = window.require("electron");

const defaultArtist: Artist = {
  images: [music_symbol],
  name: "album",
};

function Artist({
  match: {
    params: { name },
  },
}: RouteComponentProps<{ name: string }>) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artist, setArtist] = useState(defaultArtist);

  useEffect(() => {
    ipcRenderer.invoke("get:artist", name).then((res: Artist) => setArtist(res));

    ipcRenderer.invoke("get:artist-songs", name).then((res: Song[]) => setSongs(res));
  }, []);

  return (
    <div className="music">
      <div className="album-header">
        {artist.images.length === 4 ? (
          <div className="album-img mozaic">
            <img src={artist.images[0]} alt="image-0" />
            <img src={artist.images[1]} alt="image-1" />
            <img src={artist.images[2]} alt="image-2" />
            <img src={artist.images[3]} alt="image-3" />
          </div>
        ) : (
          <img className="album-img" src={artist.images[0]} alt="top-album" />
        )}
        <h1 className="header">{artist.name}</h1>
      </div>
      <SongView setSongs={setSongs} setAllSongs={setSongs} songs={songs} allSongs={songs} />
    </div>
  );
}

export default Artist;
