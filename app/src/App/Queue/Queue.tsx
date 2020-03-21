import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { reduxState, create } from "#root/reduxHandler";
import { song } from "#root/types";

import Song from "#shared/Song";
import ContextMenu from "./ContextMenu";

const { ipcRenderer } = window.require("electron");

interface QueueProps {
  queue: song[];
  cur: number;
  setCur: (num: number) => void;
  setQueue: (songs: song[]) => void;
}

function Queue({ cur, queue, setCur, setQueue }: QueueProps) {
  const [pos, setPos] = useState([-200, -200]);
  const [index, setIndex] = useState(-1);

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
    await ipcRenderer.send("set:liked", queue[index].title);
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
              "data-index": i
            }}
            id={`queue-song-${i}`}
          />
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state: reduxState) => ({ ...state });

const mapDispatchToProps = (dispatch: Dispatch) => ({
  nextSong: create.nextSong(dispatch),
  prevSong: create.prevSong(dispatch),
  setQueue: create.setQueue(dispatch),
  setCur: create.setCur(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Queue);

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
