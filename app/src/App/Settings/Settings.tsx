import * as React from "react";
import { useState, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

function Settings() {
  const [dir, setDir] = useState("");

  useEffect(() => {
    ipcRenderer.invoke("get:music-dir").then((res: string) => setDir(res));
  }, []);

  return <div>
    Directory from which songs are taken: {dir}
  </div>;
}

export default Settings;
