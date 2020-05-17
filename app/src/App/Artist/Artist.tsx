import * as React from "react";
import { useState, useEffect } from "react";

import SongView from "#shared/SongView";
import { song, artist } from "#root/types";
import music_symbol from "#root/App/music_symbol.png";

const { ipcRenderer } = window.require("electron");

const emptySongs: song[] = [];
const emptyArtist: artist = {
  images: [music_symbol],
  name: "album",
};

function Artist({
  match: {
    params: { name },
  },
}) {
  const [songs, setSongs] = useState(emptySongs);
  const [artist, setArtist] = useState(emptyArtist);

  useEffect(() => {
    ipcRenderer
      .invoke("get:artist", name)
      .then((res: artist) => setArtist(res));

    ipcRenderer
      .invoke("get:artist-songs", name)
      .then((res: song[]) => setSongs(res));
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
      <SongView
        setSongs={setSongs}
        setAllSongs={setSongs}
        songs={songs}
        allSongs={songs}
      />
    </div>
  );
}

export default Artist;
