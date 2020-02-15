import * as React from "react";

const playBox1 = "0,0 25,0 25,100 0,100";
const pauseBox1 = "0,0 30,18.75 30,81.25 0,100";
const playBox2 = "55,0 80,0 80,100 55,100";
const pauseBox2 = "30,18.75 80,50 80,50  30,81.25";

interface PlayPauseProps {
  paused: boolean;
}

const PlayPause = ({ paused }: PlayPauseProps) => (
  <svg id="svg" viewBox="0 0 80 100">
    <polygon fill="white" points={paused ? pauseBox1 : playBox1}>
      <animate
        begin="indefinite"
        attributeName="points"
        dur="100ms"
        fill="freeze"
        id="box1-pause"
        to={pauseBox1}
      />
      <animate
        begin="indefinite"
        attributeName="points"
        dur="100ms"
        fill="freeze"
        id="box1-play"
        to={playBox1}
      />
    </polygon>
    <polygon fill="white" points={paused ? pauseBox2 : playBox2}>
      <animate
        begin="indefinite"
        id="box2-pause"
        attributeName="points"
        dur="100ms"
        fill="freeze"
        to={pauseBox2}
      />
      <animate
        begin="indefinite"
        id="box2-play"
        attributeName="points"
        fill="freeze"
        dur="100ms"
        to={playBox2}
      />
    </polygon>
  </svg>
);

export default PlayPause;
