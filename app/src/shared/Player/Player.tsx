import * as React from "react";
import { useState, useCallback } from "react";
import { song } from "../../types";

// import play from "./play.png";
// import pause from "./pause.png";
// import doubleArrow from "./double_arrow.png";

interface PlayerProps {
  song: song;
  back: () => void;
  next: () => void;
}

let empty: HTMLAudioElement;

function Player({ song, back, next }: PlayerProps) {
  song.artist = "Queen";
  song.title = "I´m Going Slightly Mad";
  song.length = 271;

  const [ref, setRef] = useState(empty);
  const [timeStamp, setTimeStamp] = useState(0);
  const onRefChange = useCallback(node => setRef(node), []);
  const [paused, setPaused] = useState(true);
  const [loop, setLoop] = useState(true);

  const pausePlay = () => {
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

  const [formattedTime, formattedTotalTime] = formatLength(
    timeStamp,
    song.length
  );

  return (
    <div className="player-wrapper">
      <div className="player">
        <div className="details">
          <img className="thumbnail" src={song.thumbnail} />
          <div>
            <p className="title">{song.title}</p>
            <p className="artist">{song.artist}</p>
          </div>
        </div>
        <div className="controls">
          <button className="back" onClick={back}>
            <DoubleArrow reversed />
          </button>
          <button className="pause-play" onClick={pausePlay}>
            <PlayPause paused={paused} />
          </button>
          <button className="next" onClick={next}>
            <DoubleArrow />
          </button>
        </div>
        <div className="end">
          <p className="time">
            {formattedTime} / {formattedTotalTime}
          </p>
          <Loop enabled={loop} onClick={() => setLoop(!loop)} />
        </div>
        <audio loop={loop} ref={onRefChange} onTimeUpdate={updateTimeStamp}>
          <source
            src={require("./I´m Going Slightly Mad.mp3")}
            type="audio/mpeg"
          />
        </audio>
      </div>
      <span
        style={{ width: `${(timeStamp / song.length) * 100}%` }}
        className="timeline"
      ></span>
    </div>
  );
}

export default Player;

const formatLength = (length: number, total: number) => {
  let total_secs = (total % 60).toString();
  let total_mins = Math.floor(total / 60).toString();

  let secs = (length % 60).toString();
  let mins = Math.floor(length / 60).toString();

  while (mins.length < total_mins.length) {
    mins = "0" + mins;
  }

  if (secs.length === 1) {
    secs = "0" + secs;
  }
  return [`${mins}:${secs}`, `${total_mins}:${total_secs}`];
};

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

interface DoubleArrowProps {
  reversed?: boolean;
  disabled?: boolean;
}

const DoubleArrow = ({
  reversed = false,
  disabled = false
}: DoubleArrowProps) => {
  return (
    <svg
      style={{
        transform: reversed ? "rotate(180deg)" : "auto",
        opacity: disabled ? 0.5 : 1
      }}
      viewBox="0 0 120 100"
    >
      <polygon fill="white" points="0,0 60,50 0,100"></polygon>
      <polygon fill="white" points="60,0 120,50 60,100"></polygon>
    </svg>
  );
};

interface LoopProps {
  enabled: boolean;
  onClick: () => void;
}

const Loop = ({ enabled, onClick }: LoopProps) => (
  <svg onClick={onClick} className="loop" viewBox="55 83 45 40" height="200">
    <path
      transform="translate(-1.1650337,-42.863079)"
      id="path4594"
      d="m 73.232887,135.41517 c -3.275531,0 -6.677315,0 -9.51228,2.25213 -2.834964,2.25213 -5.165633,6.75599 -5.165658,11.26047 -2.6e-5,4.50448 2.330663,9.00838 5.16568,11.26054 2.835017,2.25216 6.173733,2.25216 9.717111,2.25216 3.543378,0 7.291936,0 10.677867,0 3.385931,0 6.409955,0 9.071384,-2.25207 2.661429,-2.25206 4.960984,-6.75667 4.960961,-11.26063 -2.4e-5,-4.50395 -2.299539,-9.00848 -4.96093,-11.26054 -2.661391,-2.25206 -5.685272,-2.25206 -10.709346,-2.25206"
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: 2,
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
    ></path>
    <path
      id="path4598"
      d="m 87,85.06031 -7.07886,7.55129 8.173345,8.267825"
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: 2,
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
    ></path>
  </svg>
);

// const parse = str => {
//   let dict = {};
//   let i = 0;
//   let val = "";
//   let key = "";
//   while (i < str.length) {
//     if (str[i] === ":") {
//       key = val;
//       val = "";
//     } else if (str[i] == ";") {
//       dict[key] = val;
//       key = "";
//       val = "";
//     } else {
//       val += str[i];
//     }
//     i++;
//   }

//   return dict;
// };
