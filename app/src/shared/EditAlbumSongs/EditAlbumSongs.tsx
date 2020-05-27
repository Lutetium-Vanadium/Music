import React from "react";
import EditAlbumScreen from "./EditAlbumScreen";

interface EditAlbumSongsProps {
  show: boolean;
  songs?: Song[];
  name?: string;
  finishButtonName: string;
  finish: (name: string, songTitles: string[]) => void;
  close: () => void;
}

function EditAlbumSongs({ show, close, ...props }: EditAlbumSongsProps) {
  return (
    <div className={`add-album-screen-wrapper${show ? "" : " -disabled"}`} onClick={close}>
      {show && <EditAlbumScreen close={close} {...props} />}
    </div>
  );
}

export default EditAlbumSongs;
