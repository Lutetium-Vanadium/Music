import React from "react";
import { useState } from "react";

interface ContextMenuProps {
  pos: number[];
  liked: boolean;
  toggleLiked: () => void;
  reset: () => void;
  play: () => void;
  del: () => void;
}

function ContextMenu({ pos, reset, play, del, liked, toggleLiked }: ContextMenuProps) {
  const [_timeout, _setTimeout] = useState<NodeJS.Timeout | null>();

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
        top: pos[1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="play" onClick={play}>
        Play
      </div>
      <div className="like" onClick={toggleLiked}>
        {liked ? "Unlike" : "Like"}
      </div>
      <div className="delete" onClick={del}>
        Remove
      </div>
    </div>
  );
}

export default ContextMenu;
