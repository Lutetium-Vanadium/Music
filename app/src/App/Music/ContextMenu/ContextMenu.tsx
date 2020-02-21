import React from "react";
import { useState } from "react";

interface ContextMenuProps {
  pos: number[];
  reset: () => void;
  play: () => void;
  del: () => void;
}

function ContextMenu({ pos, reset, play, del }: ContextMenuProps) {
  const [_timeout, _setTimeout] = useState();

  const handleMouseEnter = () => {
    if (_timeout) {
      clearTimeout(_timeout);
      setTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      if (_timeout) {
        reset();
        _setTimeout(null);
      }
    }, 300);
    _setTimeout(timeout);
  };

  return (
    <div
      className="context-menu"
      style={{
        left: pos[0],
        top: pos[1]
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="play" onClick={play}>
        Play
      </div>
      <div className="delete" onClick={del}>
        Delete
      </div>
    </div>
  );
}

export default ContextMenu;
