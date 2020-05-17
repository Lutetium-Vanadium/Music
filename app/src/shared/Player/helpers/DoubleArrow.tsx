import React from "react";

interface DoubleArrowProps {
  reversed?: boolean;
  disabled?: boolean;
}

function DoubleArrow({ reversed = false, disabled = false }: DoubleArrowProps) {
  return (
    <svg
      style={{
        transform: reversed ? "rotate(180deg)" : "auto",
        opacity: disabled ? 0.5 : 1,
      }}
      viewBox="0 0 120 100"
    >
      <polygon fill="white" points="0,0 60,50 0,100"></polygon>
      <polygon fill="white" points="60,0 120,50 60,100"></polygon>
    </svg>
  );
}

export default DoubleArrow;
