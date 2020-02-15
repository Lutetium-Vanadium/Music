import * as React from "react";
import { song } from "#types";

interface SongProps {
  song: song;
  onClick?: () => void;
  After?: () => JSX.Element;
  afterProps?: object;
}

function Song({
  song: { title, thumbnail, artist },
  After,
  onClick,
  afterProps = {}
}: SongProps) {
  return (
    <div className="song" onClick={onClick}>
      <img className="thumbnail" src={thumbnail} alt="thumbnail" />
      <div className="details">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
      {After && <After {...afterProps} />}
    </div>
  );
}

export default Song;
