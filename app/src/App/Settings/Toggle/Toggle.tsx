import * as React from "react";

interface ToggleProps {
  toggled: boolean;
  toggle: () => void;
}

function Toggle({ toggled, toggle }: ToggleProps) {
  return (
    <div className="toggle" onClick={toggle}>
      <span className={toggled ? "toggled button" : "button"}></span>
      <span className={toggled ? "toggled color" : "color"}></span>
    </div>
  );
}

export default Toggle;
