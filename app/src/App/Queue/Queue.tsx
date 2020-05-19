import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";

import useAction from "#root/useAction";
import { ReduxState, create } from "#root/reduxHandler";

import Song from "#shared/Song";
import ContextMenu from "./ContextMenu";

function Queue() {
  const [pos, setPos] = useState([-200, -200]);
  const [index, setIndex] = useState(-1);

  const { queue, cur } = useSelector((state: ReduxState) => ({ ...state }));
  const { setCur, setQueue, likeSong } = useAction((dispatch: Dispatch) => ({
    setQueue: create.setQueue(dispatch),
    setCur: create.setCur(dispatch),
    likeSong: create.likeSong(dispatch),
  }));

  const _play = (index: number) => {
    setCur(index);
  };
  const play = () => {
    if (index === -1) return;
    _play(index);
    setPos([-200, -200]);
  };

  const handleDotClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setPos([e.pageX, e.pageY]);
    setIndex(+e.currentTarget.dataset.index);
  };

  const toggleLiked = async () => {
    likeSong(queue[index]);
    setPos([-200, -200]);
  };

  const del = async () => {
    setPos([-200, -200]);
    setQueue([...queue.slice(0, index), ...queue.slice(index + 1, queue.length)]);
  };

  useEffect(() => {
    document.getElementById(`queue-song-${cur}`).scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="music" id="queue-root">
      <h1 className="header">Queue</h1>
      <ContextMenu
        pos={pos}
        reset={() => setPos([-200, -200])}
        play={play}
        del={del}
        toggleLiked={toggleLiked}
        liked={index !== -1 && queue[index].liked}
      />
      <ul className="music-names">
        {queue.map((song, i) => (
          <Song
            key={`song-${i}`}
            song={song}
            onClick={() => _play(i)}
            className={`has-dot3${i === cur ? " -highlight" : ""}`}
            After={TripleDot}
            afterProps={{
              onClick: handleDotClick,
              "data-index": i,
            }}
            id={`queue-song-${i}`}
          />
        ))}
      </ul>
    </div>
  );
}

export default Queue;

interface TripleDotProps {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

function TripleDot({ onClick, ...props }: TripleDotProps) {
  return (
    <svg {...props} viewBox="-30 -80 150 180" className="dot3" onClick={onClick}>
      <circle cx="10" cy="10" r="10" fill="white" />
      <circle cx="45" cy="10" r="10" fill="white" />
      <circle cx="80" cy="10" r="10" fill="white" />
    </svg>
  );
}
