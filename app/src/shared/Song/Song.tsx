import * as React from "react";
import { song } from "#types";

interface SongProps {
  song: song;
  first: boolean;
}

function Song({ song: { title, thumbnail, artist }, first }: SongProps) {
  return (
    <div className="song">
      <img className="thumbnail" src={thumbnail} alt="thumbnail" />
      <div className="details">
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
    </div>
  );
}

export default Song;
