import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import likedImg from "#root/App/liked.png";
import musicSymbol from "#root/App/music_symbol.png";
import CreateAlbum from "./CreateAlbum";

const { ipcRenderer } = window.require("electron");

function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [customAlbums, setCustomAlbums] = useState<CustomAlbum[]>([]);
  const [showAddAlbum, setShowAddAlbum] = useState(false);

  const close = () => {
    setShowAddAlbum(false);
  };

  useEffect(() => {
    // Show in alphabetical order
    ipcRenderer.invoke("get:top-albums", false).then((res: Album[]) => setAlbums(res.sort((a, b) => (a.name > b.name ? 1 : -1))));
    ipcRenderer.invoke("get:custom-albums").then(setCustomAlbums);

    ipcRenderer.on("update:custom-albums", (evt, albums: CustomAlbum[]) => setCustomAlbums(albums));
  }, []);

  return (
    <div className="albums">
      <div className={`add-album-screen-wrapper${showAddAlbum ? "" : " -disabled"}`} onClick={close}>
        {showAddAlbum && <CreateAlbum close={close} />}
      </div>
      <h1 className="header">Custom Albums</h1>
      <div className="content" style={{ marginBottom: "5rem" }}>
        <Link to="/albums/liked" className="album">
          <img className="album-img" src={likedImg} alt="top-album" />
          <p className="album-title">Liked</p>
        </Link>
        {customAlbums.map((album) => (
          <div className="album" key={album.id}>
            <Link to={`/albums/${album.id}`}>
              <img className="album-img" src={musicSymbol} alt="top-album" />
            </Link>
            <p className="album-title">{album.name}</p>
          </div>
        ))}
        <button className="album add-album-btn" onClick={() => setShowAddAlbum(true)}>
          <svg viewBox="0 0 100 100" style={{ width: "3rem", height: "3rem" }}>
            <path
              d="M0 50 L100 50 M50 0 L50 100"
              style={{
                stroke: "white",
                strokeWidth: "0.5rem",
              }}
            />
          </svg>
        </button>
      </div>
      <h1 className="header">Albums</h1>
      <div className="content">
        {albums.map((album) => (
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
