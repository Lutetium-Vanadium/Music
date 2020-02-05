import * as React from "react";
import { NavLink } from "react-router-dom";

import logo from "#logos/logo.png";

function Navbar() {
  return (
    <div className="navbar">
      <div className="identifier">
        <img className="logo" src={logo} alt="logo" />
        <h2>Music</h2>
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
      </div>
    </div>
  );
}

export default Navbar;
