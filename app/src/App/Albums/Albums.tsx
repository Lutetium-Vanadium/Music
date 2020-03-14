import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { album } from "#root/types";

import likedImg from "#root/App/liked.png";

const { ipcRenderer } = window.require("electron");

const empty: album[] = [];

function Albums() {
  const [albums, setAlbums] = useState(empty);

  useEffect(() => {
    ipcRenderer.invoke("get:top-albums", false).then((res: album[]) => setAlbums(res));
  }, []);

  return (
    <div className="albums">
      <h1 className="header">Albums</h1>
      <div className="content">
        <Link to="/albums/liked" className="album">
          <img className="album-img" src={likedImg} alt="top-album" />
          <p className="album-title">Liked</p>
        </Link>
        {albums.map(album => (
          <div className="album" key={album.id}>
            <Link to={`/albums/${album.id}`}>
              <img className="album-img" src={album.imagePath} alt="top-album" />
            </Link>
            <p className="album-title">{album.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;
