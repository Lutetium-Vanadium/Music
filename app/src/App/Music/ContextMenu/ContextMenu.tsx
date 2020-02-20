import React from "react";

interface ContextMenuProps {
  play: () => void;
  del: () => void;
}

function ContextMenu({ play, del }: ContextMenuProps) {
  return (
    <div className="context-menu">
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
