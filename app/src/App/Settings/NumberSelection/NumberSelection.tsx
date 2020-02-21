import React from "react";

interface NumberSelectionProps {
  num: number;
  prev: (num: number) => void;
  next: (num: number) => void;
}

function NumberSelection({ num, prev, next }: NumberSelectionProps) {
  return (
    <div className="number-selection">
      <Arrow onClick={() => prev(num)} />
      <span className="num">{num}s</span>
      <Arrow onClick={() => next(num)} reversed />
    </div>
  );
}

export default NumberSelection;

const Arrow = ({ onClick, reversed = false }) => (
  <svg
    onClick={onClick}
    viewBox="0 0 86.6 100"
    className={reversed ? "rev" : ""}
  >
    <path
      d={reversed ? "M0 0 L86.6 50 L0 100" : "M86.6 100 L0 50 L86.6 0"}
      style={{
        fill: "none",
        stroke: "white",
        strokeWidth: 10,
        strokeLinecap: "butt",
        strokeLinejoin: "miter"
      }}
    />
  </svg>
);
