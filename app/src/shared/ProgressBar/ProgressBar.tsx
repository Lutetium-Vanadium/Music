import * as React from "react";
import { song } from "../../types";

export interface ProgressBarProps {
  song: song;
  progress: number;
  errored: boolean;
}

const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

function ProgressBar({ progress, song, errored }: ProgressBarProps) {
  const radius = 1.7 * rem;
  const stroke = 5;

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="progressbar-wrapper"
      title={`${song.title} by ${song.artist}`}
    >
      <svg height={radius * 2} width={radius * 2}>
        <circle
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            stroke: errored ? "red" : "rgb(5, 79, 190)",
            transition:
              "all 1s cubic-bezier(0.215, 0.610, 0.355, 1), stroke 250ms linear"
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
}

export default ProgressBar;
