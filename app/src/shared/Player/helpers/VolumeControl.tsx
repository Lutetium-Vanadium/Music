import * as React from "react";
import { ChangeEvent, useState, useRef } from "react";

interface VolumeControlProps {
  className: string;
  audio: HTMLAudioElement;
}

function VolumeControl({ className, audio }: VolumeControlProps) {
  const reload = useReload();
  const prev = useRef(audio?.volume ?? 1);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = +e.target.value;
    audio.volume = newVolume;
    prev.current = newVolume;
    reload();
  };

  const onClick = () => {
    if (prev.current === audio.volume) {
      audio.volume = 0;
    } else {
      audio.volume = prev.current ?? 0;
    }
    reload();
  };

  const volume = audio?.volume ?? 1;

  return (
    <div className={className} style={{ position: "relative", height: "4rem" }} onClick={e => e.stopPropagation()}>
      <VolumeButton volume={volume} className={`${className}-volume`} onClick={onClick} />
      <div className={`${className}-slider-wrapper`}>
        <input className={`${className}-slider`} type="range" min={0} max={1} value={volume} onChange={onChange} step={0.001} />
      </div>
    </div>
  );
}

export default VolumeControl;

const useReload = () => {
  const [reload, setReload] = useState(false);

  return () => {
    setReload(!reload);
  };
};

interface VolumeButtonProps {
  volume: number;
  className: string;
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

function VolumeButton({ volume, className, onClick }: VolumeButtonProps) {
  return (
    <svg viewBox="0 0 45 37.865425" className={className} onClick={onClick}>
      <path
        d="m 0.5,13.932712 v 10 l 6,2 12,9 V 2.9327122 l -12,8.9999998 z"
        fill="#ffffff"
        stroke="#ffffff"
        style={{
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeOpacity: 1
        }}
      />
      {volume > 0 && (
        <path
          transform="translate(-4.5,-5.0672878)"
          d="m 26,18 c 2.039146,0.881486 3.587631,2.817093 4,5 0.249939,1.323074 0.09699,2.719505 -0.43341,3.95711 C 29.036188,28.194716 28.13046,29.268526 27,30"
          fill="none"
          stroke="#ffffff"
          style={{
            strokeWidth: 3,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
        />
      )}
      {volume > 0.33 && (
        <path
          transform="translate(-6.5,-5.0672878)"
          d="m 34,12 c 3.459262,2.570424 5.711728,6.699945 6,11 0.332898,4.965726 -2.005226,10.031661 -6,13"
          fill="none"
          stroke="#ffffff"
          style={{
            strokeWidth: 3,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1
          }}
        />
      )}
      {volume > 0.66 && (
        <path
          transform="matrix(1.3033398,0,0,1.5,-12.206874,-17.067288)"
          d="m 36,12 c 3.459262,2.570424 5.711728,6.699945 6,11 0.332898,4.965726 -2.005226,10.031661 -6,13"
          fill="none"
          stroke="#ffffff"
          style={{
            strokeWidth: 3,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 4,
            strokeDasharray: "none",
            strokeOpacity: 1
          }}
        />
      )}
      {volume === 0 && (
        <>
          <path
            d="M 23.25702256,13.25702256 36.257023,26.257023"
            fill="none"
            stroke="#ffffff"
            style={{
              strokeWidth: 2.14118314,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1
            }}
          />
          <path
            d="M 36.257023,13.25702256 23.25702256,26.257023"
            fill="none"
            stroke="#ffffff"
            style={{
              strokeWidth: 2.14118314,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1
            }}
          />
        </>
      )}
    </svg>
  );
}
