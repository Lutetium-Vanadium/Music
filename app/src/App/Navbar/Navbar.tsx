import * as React from "react";
import { NavLink, useHistory } from "react-router-dom";

import Search from "../../shared/Search";

import logo from "#logos/logo.png";
import ProgressBar, { ProgressBarProps } from "../../shared/ProgressBar";

interface NavbarParams {
  downloading: object;
  errored: boolean;
  search: (query: string) => void;
}

function Navbar({ downloading, errored, search }: NavbarParams) {
  const history = useHistory();

  const handleChange = (value: string) => {
    if ((value.length + 1) % 2 == 0) {
      history.push("/search");
      search(value);
    }
  };

  const handleSubmit = (value: string) => {
    search(value);
  };

  return (
    <div className="navbar">
      <div className="identifier">
        <img className="logo" src={logo} alt="logo" />
        <h2>Music</h2>
        {Object.keys(downloading).map(key => (
          <ProgressBar
            key={key}
            progress={downloading[key].progress}
            song={downloading[key].song}
            errored={errored}
          />
        ))}
      </div>
      <div className="routes">
        <NavLink to="/" exact className="link" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/music" className="link" activeClassName="active">
          My Music
        </NavLink>
        <Search
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          placeholder="Download"
        />
      </div>
    </div>
  );
}

export default Navbar;
