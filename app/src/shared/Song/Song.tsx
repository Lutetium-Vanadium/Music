import * as React from "react";
import { song } from "../../types";
import formatLength from "../formatLength";

interface SongProps {
  song: song;
  onClick?: () => void;
  After?: () => JSX.Element;
  afterProps?: object;
}

function Song({
  song: { title, thumbnail, artist, length },
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
      <p className="length">{formatLength(length)}</p>
      {After && <After {...afterProps} />}
    </div>
  );
}

export default Song;
