import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { artist } from "#root/types";

const { ipcRenderer } = window.require("electron");

const empty: artist[] = [];

function Artists() {
  const [artists, setArtists] = useState(empty);

  useEffect(() => {
    ipcRenderer.invoke("get:artists").then((res: artist[]) => {
      console.log({ res });
      setArtists(res);
    });
  }, []);

  return (
    <div className="albums">
      <h1 className="header">Artists</h1>
      <div className="content">
        {artists.map(artist => (
          <div className="album" key={artist.name}>
            <Link to={`/artists/${artist.name}`}>
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
            </Link>
            <p className="album-title">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Artists;
