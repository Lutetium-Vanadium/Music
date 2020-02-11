import * as React from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";

import search_icon from "./search_icon.jpg";

function Search({ search, history }) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if ((e.target.value.length + 1) % 4 == 0) {
      history.push("/search");
      search(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.length) {
      search(value);
      setValue("");
    }
  };

  return (
    <div className="search">
      <img
        style={{ cursor: value.length ? "pointer" : "auto" }}
        onClick={value.length ? search : null}
        className="icon"
        src={search_icon}
        alt="search_icon"
      />
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="search-box"
        type="text"
        value={value}
      />
    </div>
  );
}

export default withRouter(Search);
