import * as React from "react";
import { useState, useEffect } from "react";
import { song } from "#root/types";
import formatLength from "#shared/formatLength";

import backup from "./backup.png";

interface SongProps {
  song: song;
  className?: string;
  onClick?: () => void;
  After?: (props: any) => JSX.Element;
  afterProps?: object;
  id?: string;
}

function Song({ song: { title, thumbnail, artist, length }, After, onClick, className = "", afterProps = {}, id = "" }: SongProps) {
  const [src, setSrc] = useState(thumbnail);

  useEffect(() => {
    setSrc(thumbnail);
  }, [thumbnail]);

  return (
    <div className={"song " + className} onClick={onClick} id={id}>
      <img className="thumbnail" onError={() => setSrc(backup)} src={src} alt="thumbnail" />
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
