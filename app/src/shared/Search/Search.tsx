import * as React from "react";
import { useState, useEffect, useRef } from "react";

import search_icon from "./search_icon.jpg";

const { ipcRenderer } = window.require("electron");

let empty: HTMLInputElement;

interface SearchProps {
  placeholder?: string;
  handleChange?: (value: string) => void;
  handleSubmit?: (value: string) => void;
}

function Search({ handleChange, handleSubmit, placeholder = "Search" }: SearchProps) {
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
    ipcRenderer.on("reset-search-box", () => setValue(""));
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
      <input onChange={onChange} onKeyDown={handleKeyDown} className="search-box" type="search" value={value} placeholder={placeholder} />
    </div>
  );
}

export default Search;
