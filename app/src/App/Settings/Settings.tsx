import * as React from "react";
import { useState, useEffect } from "react";

let ipcRenderer;

if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

function Settings() {
  const [dir, setDir] = useState("");

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:music-dir").then((res: string) => setDir(res));
    }
  }, []);

  const changeDirectory = () => {
    if (ipcRenderer) {
      ipcRenderer.invoke("set:music-dir").then((res: string) => setDir(res));
    }
  };

  return (
    <div className="settings">
      <h1 className="header">Settings</h1>
      <div className="dir">
        <p className="song-dir">
          Directory from which songs are taken:
          {dir.length ? <span>{dir}</span> : "  Unset"}
        </p>
        <button className="change-dir" onClick={changeDirectory}>
          Change Directory
        </button>
      </div>
    </div>
  );
}

export default Settings;
