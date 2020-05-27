import React, { useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

import SongView from "#shared/SongView";
import EditAlbumSongs from "#shared/EditAlbumSongs";
import liked from "#root/App/liked.png";
import musicSymbol from "#root/App/music_symbol.png";

const { ipcRenderer } = window.require("electron");

const defaultAlbum: Album = {
  id: "alb.id",
  imagePath: musicSymbol,
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
  const [showEditAlbum, setShowEditAlbum] = useState(false);

  const history = useHistory();

  const editAlbum = (name: string, songTitles: string[]) => {
    ipcRenderer.send("set:custom-album", album.id, name, songTitles);
  };

  const deleteAlbum = async () => {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${album.name}`);

    if (shouldDelete) {
      await ipcRenderer.invoke("delete:custom-album", album);
      history.goBack();
    }
  };

  useEffect(() => {
    ipcRenderer.on("update:custom-album", (evt, album: CustomAlbum, songs: Song[]) => {
      console.log(album, songs);
      setAlbum({
        id: album.id,
        name: album.name,
        numSongs: songs.length,
        artist: "",
        imagePath: musicSymbol,
      });
      setSongs(songs);
    });
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
    } else if (isCustom(id)) {
      ipcRenderer.invoke("get:custom-album", id).then((res: CustomAlbum) => {
        setAlbum({
          id: res.id,
          name: res.name,
          numSongs: res.songs.length,
          artist: "",
          imagePath: musicSymbol,
        });
      });
      ipcRenderer.invoke("get:custom-album-songs", id).then(setSongs);
    } else {
      ipcRenderer.invoke("get:album", id).then(setAlbum);
      ipcRenderer.invoke("get:album-songs", id).then(setSongs);
    }
  }, []);

  return (
    <div className="music">
      <EditAlbumSongs
        finish={editAlbum}
        finishButtonName={"Edit"}
        close={() => setShowEditAlbum(false)}
        show={showEditAlbum}
        name={album.name}
        songs={songs}
      />
      <div className="album-header">
        <img className="album-img" src={album.imagePath} alt="album" />
        <h1 className="header">{album.name}</h1>
        {isCustom(album.id) && (
          <div className="custom-options">
            <button className="edit" onClick={() => setShowEditAlbum(true)}>
              Edit
            </button>
            <button className="delete" onClick={deleteAlbum}>
              Delete
            </button>
          </div>
        )}
      </div>
      <SongView setSongs={setSongs} setAllSongs={setSongs} songs={songs} allSongs={songs} />
    </div>
  );
}

export default Album;

const isCustom = (id: string) => id.slice(0, 3) === "cst";
