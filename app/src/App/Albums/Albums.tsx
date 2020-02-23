import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { album } from "../../types";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const empty: album[] = [];

function Albums() {
  const [albums, setAlbums] = useState(empty);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer
        .invoke("get:top-albums", false)
        .then((res: album[]) => setAlbums(res));
    }
  }, []);

  return (
    <div className="albums">
      <h1 className="header">Albums</h1>
      <div className="content">
        <Link to="/albums/liked" className="album">
          <img
            className="album-img"
            src={require("../liked.png")}
            alt="top-album"
          />
          <p className="album-title">Liked</p>
        </Link>
        {albums.map(album => (
          <Link to={`/albums/${album.id}`} key={album.id} className="album">
            <img className="album-img" src={album.imagePath} alt="top-album" />
            <p className="album-title">{album.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Albums;
