import React from "react";
import { useState, useEffect, useReducer } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Music from "./Music";
import SearchPage from "./SearchPage";
import Settings from "./Settings";
import Home from "./Home";
import Albums from "./Albums";
import Album from "./Album";
import Artists from "./Artists";
import Artist from "./Artist";
import Queue from "./Queue";

import Player from "#shared/Player";
import Transition from "#shared/Transition";
import { ReduxState } from "#root/reduxHandler";

import logo from "#logos/logo.png";

const { ipcRenderer } = window.require("electron");

interface Place {
  regex: RegExp;
  left: string;
  right: string;
}

function App() {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchSuccess, setSearchSuccess] = useState(true);
  const [downloadError, setDownloadError] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [showBack, setShowBack] = useState(false);

  // Used by SearchPage to show loader on initial search results
  const [loading, setLoading] = useState(true);

  const [downloading, dispatch] = useReducer(reducer, {});
  const queue = useSelector((state: ReduxState) => state.queue);
  const history = useHistory();

  const search = async (query: string) => {
    const result: SearchResult = await ipcRenderer.invoke("search:global", query);
    if (result.status) {
      setSearchResults(result.songs);
    }

    setSearchSuccess(result.status);
    setLoading(false);
  };

  const download = async (song: Song) => {
    const id = await ipcRenderer.invoke("download-song", song);
    setDownloadError(false);
    dispatch({
      type: "start:download",
      id,
      payload: song,
    });
    new Notification(song.title, {
      body: `Downloading ${song.title} by ${song.artist}.`,
      badge: logo,
      icon: song.thumbnail,
    });
  };

  useEffect(() => {
    ipcRenderer.invoke("get:animations").then(setAnimations);

    // Handles progress updates sent by electron for when a song is being downloaded
    ipcRenderer.on("update:download-query", (evt: any, { progress, id }: { progress: number; id: string }) => {
      dispatch({
        type: "update:download",
        id,
        payload: progress,
      });
    });
    ipcRenderer.on("finished:download-query", (evt: any, { id, filePath }: { id: string; filePath: string }) => {
      dispatch({
        type: "finish:download",
        id,
        payload: filePath,
      });
    });
    ipcRenderer.on("error:download-query", () => setDownloadError(true));

    // Miscellaneous handlers
    ipcRenderer.on("reset-global-search", () => setLoading(true));
    ipcRenderer.on("goto-link", (evt: any, url: string) => history.push(url));
    ipcRenderer.on("change:animations", (evt: any, animations: boolean) => setAnimations(animations));

    const unlisten = history.listen((location) => {
      setShowBack(location.pathname.match(/\/(albums\/(liked|(alb|cst)\.[0-9]+)|search|artists\/[a-zA-Z0-9]+)/) !== null);
    });

    const handleKeydown = (evt: KeyboardEvent) => {
      const places: Place[] = [
        { regex: /\/$/, right: "/settings", left: "/music" },
        { regex: /\/settings$/, right: "/artists", left: "/" },
        { regex: /\/artists/, right: "/albums", left: "/settings" },
        { regex: /\/albums/, right: "/music", left: "/artists" },
        { regex: /\/music$/, right: "/", left: "/albums" },
      ];

      if (evt.altKey) {
        if (evt.key === "ArrowLeft") {
          for (const place of places) {
            if (place.regex.test(history.location.pathname)) {
              history.push(place.left);
              break;
            }
          }
        } else if (evt.key === "ArrowRight") {
          for (const place of places) {
            if (place.regex.test(history.location.pathname)) {
              history.push(place.right);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      unlisten();
    };
  }, []);

  return (
    <div>
      <Navbar search={search} downloading={downloading} errored={downloadError} showBack={showBack} />
      <main>
        <Transition
          grid={[[/\/search$/], [/\/$/, /\/settings$/, /\/artists/, /\/albums/, /\/music$/], [/\/queue$/]]}
          timeout={400}
          classExtension="main"
          animate={animations}
        >
          {(location: typeof history.location) => (
            <Switch location={location}>
              <Route
                path="/search"
                render={() => <SearchPage download={download} results={searchResults} loading={loading} success={searchSuccess} />}
              />
              <Route path="/music" component={Music} />
              <Route path="/albums/:id" component={Album} />
              <Route path="/albums" component={Albums} />
              <Route path="/artists/:name" component={Artist} />
              <Route path="/artists" component={Artists} />
              <Route path="/settings" component={Settings} />
              <Route path="/queue" component={Queue} />
              <Route path="/" component={Home} />
            </Switch>
          )}
        </Transition>
      </main>
      {queue.length ? <Player /> : null}
    </div>
  );
}

export default App;

const formatFilePath = (filePath: string) => {
  const fileArray = filePath.split("/");
  fileArray.pop();
  return fileArray.join("/");
};

interface Action {
  type: string;
  id: string;
  payload?: any;
}

const reducer = (state: { [key: string]: any }, action: Action) => {
  const newState = { ...state };

  switch (action.type) {
    case "start:download":
      newState[action.id] = {
        progress: 0,
        song: action.payload,
      };
      break;
    case "update:download":
      newState[action.id].progress = action.payload;
      break;
    case "finish:download":
      // While this may not be the best place to put a notification, it is required since updated
      // `state` is not available in the useEffect
      const song: Song = newState[action.id].song;
      new Notification(song.title, {
        body: `Finished Downloading ${song.title} by ${song.artist}.\n It is stored in ${formatFilePath(action.payload)}`,
        badge: logo,
        icon: song.thumbnail,
      });
      delete newState[action.id];
      break;
    default:
      break;
  }

  return newState;
};
