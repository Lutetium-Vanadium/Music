import * as React from "react";

interface ShuffleProps {
  enabled: boolean;
  onClick: () => void;
}

const Shuffle = ({ enabled, onClick }: ShuffleProps) => (
  <svg viewBox="0 0 140 85" onClick={onClick}>
    <path
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: "2.6458332px",
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
      d="M 0.75239443,0.99622943 128.91186,84.24701 123.78475,65.112488"
    />
    <path
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: "2.6458332px",
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
      d="M 128.91186,84.24701 H 109.21519"
    />
    <path
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: "2.6458332px",
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
      d="M 0.75239443,84.24701 127.91186,0.69622943 123.77187,20.178823"
    />
    <path
      style={{
        fill: "none",
        stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
        strokeWidth: "2.6458332px",
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
      d="M 128.91186,0.99622943 H 109.21519"
    />
  </svg>
);

export default Shuffle;
