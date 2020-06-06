import React from "react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useHistory } from "react-router-dom";

import useAction from "#root/useAction";
import { ReduxState, create } from "#root/reduxHandler";
import { getNum, setNum } from "#root/localStorage";
import formatLength from "#shared/formatLength";

import { DoubleArrow, isEqual, Loop, PlayPause, Shuffle, randOrder, VolumeControl } from "./helpers";

import songLiked from "./song-liked.png";
import songNotLiked from "./song-not-liked.png";

const { ipcRenderer } = window.require("electron");

function Player() {
  const { songs, queue, cur } = useSelector((state: ReduxState) => state);

  const { _nextSong, _prevSong, setQueue, setCur, likeSong } = useAction((dispatch: Dispatch) => ({
    _nextSong: create.nextSong(dispatch),
    _prevSong: create.prevSong(dispatch),
    setQueue: create.setQueue(dispatch),
    setCur: create.setCur(dispatch),
    likeSong: create.likeSong(dispatch),
  }));

  const song: Song = queue[cur];

  const [timeStamp, setTimeStamp] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(!isEqual(songs, queue));
  const [exit, setExit] = useState(false);

  const ref = useRef<HTMLAudioElement>();
  const box1Play = useRef<AnimationElement>();
  const box1Pause = useRef<AnimationElement>();
  const box2Play = useRef<AnimationElement>();
  const box2Pause = useRef<AnimationElement>();

  const history = useHistory();

  const pausePlay = (isRemote = false) => {
    if (ref.current?.paused) {
      ref.current?.play();
      box1Play.current?.beginElement();
      box2Play.current?.beginElement();
    } else {
      ref.current?.pause();
      box1Pause.current?.beginElement();
      box2Pause.current?.beginElement();
    }

    if (!isRemote) {
      ipcRenderer.send("main-play-pause", ref.current?.paused);
    }
    setPaused(ref.current?.paused ?? false);
  };

  const prevSong = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    _prevSong();
  };

  const nextSong = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    _nextSong();
  };

  const updateTimeStamp = (e) => {
    const newTime = Math.round(e.target.currentTime);
    setTimeStamp(newTime);
  };

  const _shuffleSongs = (shuffle: boolean) => {
    if (shuffle) {
      const index = songs.findIndex((_song) => _song === song);
      setQueue(songs);
      setCur(index);
    } else {
      setQueue(randOrder([...queue], cur));
      setCur(0);
    }
  };

  const shuffleSongs = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();

    _shuffleSongs(shuffle);
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
    likeSong(song);
  };

  const toggleLoop = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setLoop(!loop);
  };

  const openQueue = () => {
    if (history.location.pathname === "/queue") return;
    history.push("/queue");
  };

  useEffect(() => {
    ipcRenderer.send("main-song-update", song);
  }, [song.title]);

  useEffect(() => {
    ipcRenderer.on("jump-back", (evt: any, val: number) => (ref.current.currentTime -= val));
    ipcRenderer.on("seek-back", (evt: any, val: number) => (ref.current.currentTime -= val));
    ipcRenderer.on("seek-ahead", (evt: any, val: number) => (ref.current.currentTime += val));
    ipcRenderer.on("jump-ahead", (evt: any, val: number) => (ref.current.currentTime += val));
    ipcRenderer.on("volume++", () => (ref.current.volume += 0.05));
    ipcRenderer.on("volume--", () => (ref.current.volume -= 0.05));
    ipcRenderer.on("loop-song", () => setLoop((loop) => !loop));
    ipcRenderer.on("shuffle-songs", () =>
      setShuffle((shuffle) => {
        _shuffleSongs(shuffle);
        return !shuffle;
      })
    );
    ipcRenderer.on("prev-track", () => _prevSong());
    ipcRenderer.on("next-track", () => _nextSong());
    ipcRenderer.on("pause-play", (evt: any, isRemote: boolean) => {
      if (document.activeElement.tagName === "INPUT" && !isRemote) return;
      pausePlay(isRemote);
    });
    ipcRenderer.send("toggle-remote", song);

    window.onkeydown = (e: KeyboardEvent) => {
      if (document.activeElement.tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        pausePlay(false);
      }
    };

    const volume = getNum("volume");

    if (volume !== 0) {
      ref.current.volume = volume;
    }

    return () => {
      setNum("volume", ref.current.volume);
      ipcRenderer.send("toggle-remote", null);
      window.onkeydown = null;
    };
  }, []);

  const [formattedTime, formattedTotalTime] = formatLength(timeStamp, song.length);

  return (
    <div className={`player-wrapper${exit ? " closed" : ""}`} onClick={openQueue}>
      <button onClick={close} className="close">
        <span>&#215;</span>
      </button>
      <div className="player">
        <div className="details">
          <img className="thumbnail" src={song.thumbnail} alt="thumbnail" />
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
            onClick={(e) => {
              e.stopPropagation();
              pausePlay();
            }}
          >
            <PlayPause paused={paused} refs={{ box1Play, box1Pause, box2Play, box2Pause }} />
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
          onEnded={handleEnded}
          loop={loop}
          ref={ref}
          onTimeUpdate={updateTimeStamp}
          onError={console.error}
          autoPlay={!paused}
          src={`file://${song.filePath}`}
        ></audio>
      </div>
      <input type="range" name="timeline" className="timeline" value={timeStamp} min={0} max={song.length} onChange={handleChange} />
    </div>
  );
}

export default Player;
