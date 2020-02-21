import * as React from "react";
import { useState, useEffect } from "react";
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
        {albums.length ? (
          albums.map(album => (
            <div key={album.imagePath} className="album">
              <img
                className="album-img"
                src={album.imagePath}
                alt="top-album"
              />
              <p className="album-title">{album.name}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No Results</p>
        )}
      </div>
    </div>
  );
}

export default Albums;
