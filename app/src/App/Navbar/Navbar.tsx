import * as React from "react";
import { NavLink, useHistory } from "react-router-dom";

import Search from "#shared/Search";
import ProgressBar from "#shared/ProgressBar";

import logo from "#logos/logo.png";

interface NavbarParams {
  downloading: object;
  errored: boolean;
  showBack: boolean;
  search: (query: string) => void;
}

function Navbar({ downloading, errored, search, showBack }: NavbarParams) {
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

  const backClick = () => {
    history.goBack();
  };

  return (
    <div className="navbar">
      <div className="identifier">
        <Back show={showBack} onClick={backClick} />
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
        <NavLink to="/" exact activeClassName="active" className="link">
          Home
        </NavLink>
        <NavLink to="/settings" activeClassName="active" className="link">
          Settings
        </NavLink>
        <NavLink to="/artists" activeClassName="active" className="link">
          Artist
        </NavLink>
        <NavLink to="/albums" activeClassName="active" className="link">
          Albums
        </NavLink>
        <NavLink to="/music" activeClassName="active" className="link">
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

interface BackProps {
  show: boolean;
  onClick: () => void;
}

function Back({ show, onClick }: BackProps) {
  return (
    <svg
      viewBox="0 0 50 100"
      onClick={onClick}
      className={`back${show ? " show" : ""}`}
    >
      <path
        d="M50 0 L0 50 L50 100"
        fill="transparent"
        stroke="white"
        strokeWidth="10"
      />
    </svg>
  );
}
