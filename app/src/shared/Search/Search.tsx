import * as React from "react";
import { useState, useEffect } from "react";

import search_icon from "./search_icon.jpg";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface SearchProps {
  handleChange?: (value: string) => void;
  handleSubmit?: (value: string) => void;
}

function Search({ handleChange, handleSubmit }: SearchProps) {
  const [value, setValue] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (handleChange) handleChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length) {
      if (handleSubmit) handleSubmit(value);
      setValue("");
    }
  };

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on("reset-search-box", () => setValue(""));
    }
  }, []);

  return (
    <div className="search">
      <img
        style={{ cursor: value.length ? "pointer" : "auto" }}
        onClick={value.length ? () => handleSubmit(value) : null}
        className="icon"
        src={search_icon}
        alt="search_icon"
      />
      <input
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="search-box"
        type="text"
        value={value}
      />
    </div>
  );
}

export default Search;
