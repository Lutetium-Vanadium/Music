import * as React from "react";
import { useState, useEffect } from "react";

import NumberSelection from "./NumberSelection";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const min = 2;
const thresh = 30;
// Modulo cannot give the top-most value
const dthresh = thresh - min + 1;

function Settings() {
  const [dir, setDir] = useState("");
  const [jumpBack, setJumpBack] = useState(min * 2);
  const [seekBack, setSeekBack] = useState(min);
  const [seekAhead, setSeekAhead] = useState(min);
  const [jumpAhead, setJumpAhead] = useState(min * 2);

  const changeDirectory = () => {
    if (ipcRenderer) {
      ipcRenderer.invoke("set:music-dir").then((res: string) => setDir(res));
    }
  };

  const generateFunctions = (
    func: React.Dispatch<React.SetStateAction<number>>
  ) => ({
    prev: (num: number) => func(((num - 1 + dthresh - min) % dthresh) + min),
    next: (num: number) => func(((num + 1 - min) % dthresh) + min)
  });

  const applyChanges = () => {
    if (ipcRenderer) {
      ipcRenderer.send("set:info", {
        jumpBack,
        seekBack,
        seekAhead,
        jumpAhead
      });
    }
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.invoke("get:info").then(info => {
        setDir(info.dir);
        setJumpBack(info.jumpBack);
        setSeekBack(info.seekBack);
        setSeekAhead(info.seekAhead);
        setJumpAhead(info.jumpAhead);
      });
    }
  }, []);

  return (
    <div className="settings">
      <h1 className="header">Settings</h1>
      <div className="setting">
        <p className="name">
          Directory from which songs are taken:
          {dir.length ? <span>{dir}</span> : "  Unset"}
        </p>
        <button className="change" onClick={changeDirectory}>
          Change Directory
        </button>
      </div>
      <hr />
      <div className="setting">
        <p className="name">Jump Backward timer: </p>
        <NumberSelection num={jumpBack} {...generateFunctions(setJumpBack)} />
      </div>
      <div className="setting">
        <p className="name">Seek Backward timer: </p>
        <NumberSelection num={seekBack} {...generateFunctions(setSeekBack)} />
      </div>
      <div className="setting">
        <p className="name">Seek Forward timer: </p>
        <NumberSelection num={seekAhead} {...generateFunctions(setSeekAhead)} />
      </div>
      <div className="setting">
        <p className="name">Jump Forward timer: </p>
        <NumberSelection num={jumpAhead} {...generateFunctions(setJumpAhead)} />
      </div>
      <button className="change center" onClick={applyChanges}>
        Change
      </button>
    </div>
  );
}

export default Settings;
