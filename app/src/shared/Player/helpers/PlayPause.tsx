import React from "react";
import { RefObject } from "react";

const playBox1 = "0,0 25,0 25,100 0,100";
const pauseBox1 = "0,0 30,18.75 30,81.25 0,100";
const playBox2 = "55,0 80,0 80,100 55,100";
const pauseBox2 = "30,18.75 80,50 80,50  30,81.25";

interface AnimateRefs {
  box1Play: RefObject<AnimationElement>;
  box1Pause: RefObject<AnimationElement>;
  box2Play: RefObject<AnimationElement>;
  box2Pause: RefObject<AnimationElement>;
}

interface PlayPauseProps {
  paused: boolean;
  refs: AnimateRefs;
}

function PlayPause({ paused, refs }: PlayPauseProps) {
  return (
    <svg viewBox="0 0 80 100">
      <polygon fill="white" points={paused ? pauseBox1 : playBox1}>
        <animate begin="indefinite" attributeName="points" dur="100ms" fill="freeze" to={pauseBox1} ref={refs.box1Pause} />
        <animate begin="indefinite" attributeName="points" dur="100ms" fill="freeze" ref={refs.box1Play} to={playBox1} />
      </polygon>
      <polygon fill="white" points={paused ? pauseBox2 : playBox2}>
        <animate begin="indefinite" ref={refs.box2Pause} attributeName="points" dur="100ms" fill="freeze" to={pauseBox2} />
        <animate begin="indefinite" ref={refs.box2Play} attributeName="points" fill="freeze" dur="100ms" to={playBox2} />
      </polygon>
    </svg>
  );
}

export default PlayPause;
