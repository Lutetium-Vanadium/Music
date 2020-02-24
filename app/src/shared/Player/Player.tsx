import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { song } from "../../types";
import { connect } from "react-redux";
import { reduxState, create } from "../../reduxHandler";
import { Dispatch } from "redux";
import { DoubleArrow, Loop, PlayPause, Shuffle, randOrder } from "./helpers";
import formatLength from "../formatLength";

const songLiked = require("./song-liked.png");
const songNotLiked = require("./song-not-liked.png");

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

let empty: HTMLAudioElement;

function Player({ songs, queue, cur, nextSong, prevSong, setQueue, setCur }) {
  const song: song = queue[cur];

  const ref = useRef(empty);
  // const [ref, setRef] = useState(empty);
  const [timeStamp, setTimeStamp] = useState(0);
  // const onRefChange = useCallback(node => setRef(node), []);
  const [paused, setPaused] = useState(false);
  const [loop, setLoop] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [songData, setSongData] = useState();
  const [shuffle, setShuffle] = useState(true);
  const [exit, setExit] = useState(false);

  const pausePlay = (override = false, isRemote = false) => {
    console.log({ override, isRemote });
    if (!(loaded || override)) return;
    if (ref.current.paused) {
      ref.current.play();
      document.getElementById("box1-play").beginElement();
      document.getElementById("box2-play").beginElement();
    } else {
      ref.current.pause();
      document.getElementById("box1-pause").beginElement();
      document.getElementById("box2-pause").beginElement();
    }

    if (!isRemote) {
      ipcRenderer.send("main-play-pause", ref.current.paused);
    }
    setPaused(ref.current.paused);
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
        setSongData(newSongData);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const shuffleSongs = () => {
    if (shuffle) {
      const index = songs.findIndex(_song => _song === song);
      setQueue(songs);
      setCur(index);
    } else {
      // Since arrays are passed in by reference, a shallow copy is passed down
      setQueue(randOrder([...queue], cur));
      setCur(0);
    }
    setShuffle(!shuffle);
  };

  const handleEnded = () => {
    setCur((cur + 1) % queue.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ref.current.currentTime = e.target.valueAsNumber;
  };

  const close = () => {
    setExit(true);
    setTimeout(() => setQueue([]), 301);
  };

  const toggleLiked = async () => {
    if (ipcRenderer) {
      await ipcRenderer.send("set:liked", song.title);
    }
  };

  useEffect(() => {
    setPaused(false);
    getSong(song.filePath);
    if (ipcRenderer) {
      ipcRenderer.send("main-song-update", song);
    }
  }, [song]);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on(
        "jump-back",
        (evt, val: number) => (ref.current.currentTime -= val)
      );
      ipcRenderer.on(
        "seek-back",
        (evt, val: number) => (ref.current.currentTime -= val)
      );
      ipcRenderer.on(
        "seek-ahead",
        (evt, val: number) => (ref.current.currentTime += val)
      );
      ipcRenderer.on(
        "jump-ahead",
        (evt, val: number) => (ref.current.currentTime += val)
      );
      ipcRenderer.on("prev-track", () => prevSong());
      ipcRenderer.on("next-track", () => nextSong());
      ipcRenderer.on("pause-play", (evt, isRemote) =>
        pausePlay(true, isRemote)
      );
      ipcRenderer.send("toggle-remote");
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.keyCode == 32 && !window.isFocused) {
        e.preventDefault();
        pausePlay(true);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      ipcRenderer.send("toggle-remote", null);
    };
  }, []);

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
            <DoubleArrow reversed disabled={cur === 0} />
          </button>
          <button className="pause-play" onClick={() => pausePlay()}>
            {loaded ? <PlayPause paused={paused} /> : "Loading"}
          </button>
          <button
            className="next"
            onClick={cur === songs.length - 1 ? null : nextSong}
          >
            <DoubleArrow disabled={cur === song.length - 1} />
          </button>
        </div>
        <div className="end">
          <p className="time">
            {formattedTime} / {formattedTotalTime}
          </p>
          <Loop
            className="control"
            enabled={loop}
            onClick={() => setLoop(!loop)}
          />
          <Shuffle
            className="control"
            enabled={shuffle}
            onClick={shuffleSongs}
          />
          <img
            src={song.liked ? songLiked : songNotLiked}
            alt="liked"
            className="control"
            onClick={toggleLiked}
          />
        </div>
        <audio
          onLoad={() => setLoaded(true)}
          onEnded={handleEnded}
          loop={loop}
          ref={ref}
          onTimeUpdate={updateTimeStamp}
          onError={console.error}
          src={songData}
          autoPlay={!paused}
        ></audio>
      </div>
      <input
        type="range"
        name="timeline"
        className="timeline"
        value={timeStamp}
        min={0}
        max={song.length}
        onChange={handleChange}
      />
    </div>
  );
}

const mapStateToProps = (state: reduxState) => {
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
