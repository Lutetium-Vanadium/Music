import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { song } from "../../types";
import { connect } from "react-redux";
import { reduxState, create } from "../../reduxHandler";
import { Dispatch } from "redux";
import {
  DoubleArrow,
  Loop,
  PlayPause,
  Shuffle,
  formatLength,
  randOrder
} from "./helpers";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

let empty: HTMLAudioElement;

function Player({ songs, queue, cur, nextSong, prevSong, setQueue, setCur }) {
  const song: song = queue[cur];

  const [ref, setRef] = useState(empty);
  const [timeStamp, setTimeStamp] = useState(0);
  const onRefChange = useCallback(node => setRef(node), []);
  const [paused, setPaused] = useState(false);
  const [loop, setLoop] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [songData, setSongData] = useState();
  const [shuffle, setShuffle] = useState(false);
  const [exit, setExit] = useState(false);

  const pausePlay = () => {
    if (!loaded) return;
    if (ref.paused) {
      ref.play();
      document.getElementById("box1-play").beginElement();
      document.getElementById("box2-play").beginElement();
    } else {
      ref.pause();
      document.getElementById("box1-pause").beginElement();
      document.getElementById("box2-pause").beginElement();
    }

    setPaused(ref.paused);
  };

  const updateTimeStamp = e => {
    const newTime = Math.round(e.target.currentTime);
    setTimeStamp(newTime);
  };

  const getSong = async (filePath: string) => {
    if (ipcRenderer) {
      try {
        const newSongData = await ipcRenderer.invoke(
          "get:song-audio",
          filePath
        );
        console.log({ newSongData });
        setSongData(newSongData);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const shuffleSongs = () => {
    if (shuffle) {
      setQueue(songs);
      setCur(songs.findIndex(song => song === songs[cur]));
    } else {
      // Since arrays are passed in by reference, a shallow copy is passed down
      setQueue(randOrder([...songs], cur));
      setCur(0);
    }
    setShuffle(!shuffle);
  };

  const close = () => {
    setExit(true);
    setTimeout(() => setQueue([]), 301);
  };

  useEffect(() => {
    getSong(song.filePath);
  }, [song]);

  const [formattedTime, formattedTotalTime] = formatLength(
    timeStamp,
    song.length
  );

  return (
    <div className={`player-wrapper${exit ? " closed" : ""}`}>
      <button onClick={close} className="close">
        <span>&#215;</span>
      </button>
      <div className="player">
        <div className="details">
          <img className="thumbnail" src={song.thumbnail} />
          <div>
            <p className="title">{song.title}</p>
            <p className="artist">{song.artist}</p>
          </div>
        </div>
        <div className="controls">
          <button className="back" onClick={cur === 0 ? null : prevSong}>
            <DoubleArrow reversed />
          </button>
          <button className="pause-play" onClick={pausePlay}>
            {loaded ? <PlayPause paused={paused} /> : "Loading"}
          </button>
          <button
            className="next"
            onClick={cur === songs.length - 1 ? null : nextSong}
          >
            <DoubleArrow />
          </button>
        </div>
        <div className="end">
          <p className="time">
            {formattedTime} / {formattedTotalTime}
          </p>
          <Loop enabled={loop} onClick={() => setLoop(!loop)} />
          {/* <Shuffle enabled={shuffle} onClick={shuffleSongs} /> */}
        </div>
        <audio
          onLoad={() => setLoaded(true)}
          loop={loop}
          ref={onRefChange}
          onTimeUpdate={updateTimeStamp}
          onError={console.log}
          src={songData}
        ></audio>
      </div>
      <span
        style={{ width: `${(timeStamp / song.length) * 100}%` }}
        className="timeline"
      ></span>
    </div>
  );
}

const mapStateToProps = (state: reduxState) => {
  console.log(state);
  return { ...state };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    nextSong: create.nextSong(dispatch),
    prevSong: create.prevSong(dispatch),
    setQueue: create.setQueue(dispatch),
    setCur: create.setCur(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
