import * as React from "react";

interface ShuffleProps {
  enabled: boolean;
  onClick: () => void;
}

const Shuffle = ({ enabled, onClick }: ShuffleProps) => (
  <svg viewBox="-10 -10 150 120" onClick={onClick}>
    <path
      d="M0 0 L126 97 M130 100 h-30 m30 0 l-7.69 -28.9"
      fill="none"
      strokeLinecap="round"
      strokeWidth="7"
      stroke={enabled ? "rgb(71, 135, 231)" : "#dddddd"}
    />
    <path
      d="M0 100 L126 3 M130 0 h-30 m30 0 l-7.69 28.9"
      fill="none"
      strokeLinecap="round"
      strokeWidth="7"
      stroke={enabled ? "rgb(71, 135, 231)" : "#dddddd"}
    />
  </svg>
);

export default Shuffle;
