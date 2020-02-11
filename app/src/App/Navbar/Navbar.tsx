import * as React from "react";
import { NavLink } from "react-router-dom";

import Search from "./Search";

import logo from "#logos/logo.png";
import ProgressBar, { ProgressBarProps } from "../../shared/ProgressBar";

interface NavbarParams {
  downloading: boolean;
  progressbarProps: ProgressBarProps;
  search: (query: string) => void;
}

function Navbar({ downloading, progressbarProps, search }: NavbarParams) {
  return (
    <div className="navbar">
      <div className="identifier">
        <img className="logo" src={logo} alt="logo" />
        <h2>Music</h2>
        {downloading && <ProgressBar {...progressbarProps} />}
      </div>
      <div className="routes">
        <NavLink to="/" exact className="link" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/settings" className="link" activeClassName="active">
          Settings
        </NavLink>
        <NavLink to="/music" className="link" activeClassName="active">
          My Music
        </NavLink>
        <Search search={search} />
      </div>
    </div>
  );
}

export default Navbar;
