import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import NumberSelection from "./NumberSelection";
import Setting from "./Setting";
import Toggle from "./Toggle";
import { ReduxState } from "#root/reduxHandler";

const { ipcRenderer } = window.require("electron");

const min = 2;
const thresh = 30;
const dthresh = thresh - min + 1;

function Settings() {
  const [dir, setDir] = useState("");
  const [jumpBack, setJumpBack] = useState(min * 2);
  const [seekBack, setSeekBack] = useState(min);
  const [seekAhead, setSeekAhead] = useState(min);
  const [jumpAhead, setJumpAhead] = useState(min * 2);
  const [controls, setControls] = useState(false);
  const [animations, setAnimations] = useState(false);

  const { queue, cur } = useSelector((state: ReduxState) => state);

  const changeDirectory = () => {
    ipcRenderer.invoke("set:music-dir").then((res: string) => setDir(res));
  };

  const generateFunctions = (func: React.Dispatch<React.SetStateAction<number>>) => ({
    prev: (num: number) => func(((num - 1 + dthresh - min) % dthresh) + min),
    next: (num: number) => func(((num + 1 - min) % dthresh) + min),
  });

  const applyChanges = () => {
    ipcRenderer.send("set:info", {
      jumpBack,
      seekBack,
      seekAhead,
      jumpAhead,
    });
  };

  const toggleControlWindow = () => {
    const isPlaying: boolean = queue.length > 0;

    ipcRenderer.send("set:control-window", !controls, isPlaying, isPlaying ? queue[cur] : null);
    setControls(!controls);
  };

  const toggleAnimations = () => {
    ipcRenderer.send("set:animations", !animations);
    setAnimations(!animations);
  };

  const importData = () => {
    ipcRenderer.send("import-data");
  };

  const exportData = () => {
    ipcRenderer.send("export-data");
  };

  useEffect(() => {
    const setAllState = (info: Settings) => {
      setDir(info.folderStored);
      setJumpBack(info.jumpBack);
      setSeekBack(info.seekBack);
      setSeekAhead(info.seekAhead);
      setJumpAhead(info.jumpAhead);
      setControls(info.controlWindow);
      setAnimations(info.animations);
    };

    ipcRenderer.invoke("get:info").then(setAllState);
    ipcRenderer.on("info:update", (e, info) => setAllState(info));
  }, []);

  return (
    <div className="settings">
      <h1 className="header">Settings</h1>
      {/* This is put like this because the name has html and not plain text */}
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
      <Setting name="Jump Backward timer: ">
        <NumberSelection num={jumpBack} {...generateFunctions(setJumpBack)} />
      </Setting>
      <Setting name="Seek Backward timer: ">
        <NumberSelection num={seekBack} {...generateFunctions(setSeekBack)} />
      </Setting>
      <Setting name="Seek Forward timer: ">
        <NumberSelection num={seekAhead} {...generateFunctions(setSeekAhead)} />
      </Setting>
      <Setting name="Jump Forward timer: ">
        <NumberSelection num={jumpAhead} {...generateFunctions(setJumpAhead)} />
      </Setting>
      <button className="change center" onClick={applyChanges}>
        Change
      </button>
      <hr />
      <Setting name="Open Secondary Control Window when music is playing?">
        <Toggle toggled={controls} toggle={toggleControlWindow} />
      </Setting>
      <Setting name="Animate between pages">
        <Toggle toggled={animations} toggle={toggleAnimations} />
      </Setting>
      <hr />
      <Setting name="Backup and Restore Data">
        <div>
          <button className="change" onClick={importData} style={{ marginRight: "2rem" }}>
            Import Data
          </button>
          <button className="change" onClick={exportData}>
            Export Data
          </button>
        </div>
      </Setting>
    </div>
  );
}

export default Settings;
