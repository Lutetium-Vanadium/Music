import * as React from "react";

interface ShuffleProps {
  enabled: boolean;
  className: string;
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

function Shuffle({ enabled, onClick, className }: ShuffleProps) {
  return (
    <svg viewBox="2 2 22 22" className={className} onClick={onClick}>
      <g transform="translate(0,-270.54167)">
        <path
          style={{
            fill: "none",
            stroke: enabled ? "rgb(71, 135, 231" : "#dddddd",
            strokeWidth: 1.4,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
          d="m 2.9104166,290.12084 c 2.1169679,-0.35283 4.2336329,-0.70561 5.9532918,-1.76394 1.7196586,-1.05833 3.0427646,-2.82247 4.3655706,-4.58621 1.322805,-1.76374 2.645945,-3.52793 4.365597,-4.58611 1.719651,-1.05818 3.836674,-1.41101 5.95304,-1.76374"
        />
        <path
          style={{
            fill: "none",
            stroke: enabled ? "rgb(71, 135, 231" : "#dddddd",
            strokeWidth: 1.4,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
          d="m 2.9104166,277.42084 c 2.1168809,0.35281 4.233548,0.70559 5.8649613,1.6756 1.6314131,0.97002 2.7780621,2.55768 3.9246221,4.14523"
        />
        <path
          style={{
            fill: "none",
            stroke: enabled ? "rgb(71, 135, 231" : "#dddddd",
            strokeWidth: 1.4,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
          d="m 13.758333,284.3 c 1.146495,1.58745 2.293023,3.17495 3.924776,4.14514 1.631754,0.97019 3.748354,1.32296 5.864807,1.6757"
        />
        <path
          style={{
            fill: "none",
            stroke: enabled ? "rgb(71, 135, 231" : "#dddddd",
            strokeWidth: 1.4,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
          d="m 20.902083,275.56875 2.645833,1.85209 -2.116666,2.38125"
        />
        <path
          style={{
            fill: "none",
            stroke: enabled ? "rgb(71, 135, 231" : "#dddddd",
            strokeWidth: 1.4,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
          d="m 20.902083,291.97292 2.645833,-1.85208 -2.116666,-2.38125"
        />
      </g>
    </svg>
  );
}

export default Shuffle;
