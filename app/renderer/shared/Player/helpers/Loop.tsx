import React from "react";

interface LoopProps {
  enabled: boolean;
  className: string;
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

function Loop({ enabled, onClick, className }: LoopProps) {
  return (
    <svg onClick={onClick} className={"loop " + className} viewBox="55 83 45 40" height="200">
      <path
        transform="translate(-1.1650337,-42.863079)"
        d="m 73.232887,135.41517 c -3.275531,0 -6.677315,0 -9.51228,2.25213 -2.834964,2.25213 -5.165633,6.75599 -5.165658,11.26047 -2.6e-5,4.50448 2.330663,9.00838 5.16568,11.26054 2.835017,2.25216 6.173733,2.25216 9.717111,2.25216 3.543378,0 7.291936,0 10.677867,0 3.385931,0 6.409955,0 9.071384,-2.25207 2.661429,-2.25206 4.960984,-6.75667 4.960961,-11.26063 -2.4e-5,-4.50395 -2.299539,-9.00848 -4.96093,-11.26054 -2.661391,-2.25206 -5.685272,-2.25206 -10.709346,-2.25206"
        style={{
          fill: "none",
          stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
          strokeWidth: 2,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
        }}
      ></path>
      <path
        d="m 87,85.06031 -7.07886,7.55129 8.173345,8.267825"
        style={{
          fill: "none",
          stroke: enabled ? "rgb(71, 135, 231)" : "#dddddd",
          strokeWidth: 2,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
        }}
      ></path>
    </svg>
  );
}

export default Loop;
