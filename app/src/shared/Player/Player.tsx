import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useHistory } from "react-router-dom";

import { DoubleArrow, Loop, PlayPause, Shuffle, randOrder, VolumeControl } from "./helpers";
import { song } from "#root/types";
import { reduxState, create } from "#root/reduxHandler";
import formatLength from "#shared/formatLength";

import songLiked from "./song-liked.png";
import songNotLiked from "./song-not-liked.png";

const { ipcRenderer } = window.require("electron");

let emptyAudio: HTMLAudioElement;
let emptyAnimate: AnimationElement;

function Player({ songs, queue, cur, nextSong: _nextSong, prevSong: _prevSong, setQueue, setCur }) {
  const song: song = queue[cur];

  const [timeStamp, setTimeStamp] = useState(0);
  const [paused, setPaused] = useState(true);
  const [loop, setLoop] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [songData, setSongData] = useState();
  const [shuffle, setShuffle] = useState(true);
  const [exit, setExit] = useState(false);

  const ref = useRef(emptyAudio);
  const box1Play = useRef(emptyAnimate);
  const box1Pause = useRef(emptyAnimate);
  const box2Play = useRef(emptyAnimate);
  const box2Pause = useRef(emptyAnimate);

  const history = useHistory();

  const pausePlay = (override = false, isRemote = false) => {
    if (!(loaded || override)) return;
    if (ref.current.paused) {
      ref.current.play();
      box1Play.current?.beginElement();
      box2Play.current?.beginElement();
    } else {
      ref.current.pause();
      box1Pause.current?.beginElement();
      box2Pause.current?.beginElement();
    }

    if (!isRemote) {
      ipcRenderer.send("main-play-pause", ref.current.paused);
    }
    setPaused(ref.current.paused);
  };

  const prevSong = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    _prevSong();
  };

  const nextSong = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    _nextSong();
  };

  const updateTimeStamp = e => {
    const newTime = Math.round(e.target.currentTime);
    setTimeStamp(newTime);
  };

  const getSong = async (filePath: string) => {
    try {
      const newSongData = await ipcRenderer.invoke("get:song-audio", filePath);
      setSongData(newSongData);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const shuffleSongs = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();

    if (shuffle) {
      const index = songs.findIndex(_song => _song === song);
      setQueue(songs);
      setCur(index);
    } else {
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

  const close = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setExit(true);
    if (history.location.pathname === "/queue") history.goBack();
    setTimeout(() => setQueue([]), 301);
  };

  const toggleLiked = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    song.liked = !song.liked;
    await ipcRenderer.send("set:liked", song.title);
  };

  const toggleLoop = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setLoop(!loop);
  };

  const openQueue = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (history.location.pathname === "/queue") return;
    history.push("/queue");
  };

  useEffect(() => {
    setPaused(false);
    getSong(song.filePath);
    ipcRenderer.send("main-song-update", song);
  }, [song]);

  useEffect(() => {
    ipcRenderer.on("jump-back", (evt, val: number) => (ref.current.currentTime -= val));
    ipcRenderer.on("seek-back", (evt, val: number) => (ref.current.currentTime -= val));
    ipcRenderer.on("seek-ahead", (evt, val: number) => (ref.current.currentTime += val));
    ipcRenderer.on("jump-ahead", (evt, val: number) => (ref.current.currentTime += val));
    ipcRenderer.on("volume++", () => (ref.current.volume += 0.05));
    ipcRenderer.on("volume--", () => (ref.current.volume -= 0.05));
    ipcRenderer.on("prev-track", () => _prevSong());
    ipcRenderer.on("next-track", () => _nextSong());
    ipcRenderer.on("pause-play", (evt, isRemote) => {
      if (document.activeElement.tagName === "INPUT") return;
      pausePlay(true, isRemote);
    });
    ipcRenderer.send("toggle-remote", song);

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.keyCode == 32 && document.activeElement.tagName !== "INPUT") {
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

  const [formattedTime, formattedTotalTime] = formatLength(timeStamp, song.length);

  return (
    <div className={`player-wrapper${exit ? " closed" : ""}`} id="player-wrapper" onClick={openQueue}>
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
          <button onClick={cur === 0 ? null : prevSong}>
            <DoubleArrow reversed disabled={cur === 0} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              pausePlay();
            }}
          >
            {loaded ? <PlayPause paused={paused} refs={{ box1Play, box1Pause, box2Play, box2Pause }} /> : "Loading"}
          </button>
          <button onClick={cur === songs.length - 1 ? null : nextSong}>
            <DoubleArrow disabled={cur === song.length - 1} />
          </button>
        </div>
        <div className="end">
          <p className="time">
            {formattedTime} / {formattedTotalTime}
          </p>
          <Loop className="control" enabled={loop} onClick={toggleLoop} />
          <Shuffle className="control" enabled={shuffle} onClick={shuffleSongs} />
          <img
            src={song.liked ? songLiked : songNotLiked}
            alt={song.liked ? "liked" : "not liked"}
            className="control"
            onClick={toggleLiked}
          />
          <VolumeControl className="control" audio={ref.current} />
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
      <input type="range" name="timeline" className="timeline" value={timeStamp} min={0} max={song.length} onChange={handleChange} />
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
