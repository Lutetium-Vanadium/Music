import React from "react";
import { useState, useEffect } from "react";

import SongView from "../../shared/SongView";
import { song, album } from "../../types";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const emptySongs: song[] = [];
const emptyAlbum: album = {
  id: "id",
  imagePath: "file:///path/to/image",
  name: "album",
  numSongs: 0
};

function Album({
  match: {
    params: { id }
  }
}) {
  const [songs, setSongs] = useState(emptySongs);
  const [album, setAlbum] = useState(emptyAlbum);

  useEffect(() => {
    if (ipcRenderer) {
      if (id === "liked") {
        ipcRenderer.invoke("get:liked").then((res: song[]) => {
          setSongs(res);
          setAlbum({
            id: "liked",
            imagePath: require("../liked.png"),
            name: "Liked",
            numSongs: songs.length
          });
        });
      } else {
        ipcRenderer.invoke("get:album", id).then((res: album) => setAlbum(res));

        ipcRenderer
          .invoke("get:album-songs", id)
          .then((res: song[]) => setSongs(res));
      }
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
