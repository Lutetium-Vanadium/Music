import * as React from "react";
import { useEffect } from "react";

import { song } from "../../types";
import Song from "../../shared/Song";

import downloadImg from "./download.png";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface SearchPageParams {
  results: song[];
  download: (song: song) => Promise<void>;
}

function SearchPage({ results, download }: SearchPageParams) {
  const handleDownload = e => {
    const song = results[+e.target.dataset.index];
    download(song);
  };

  useEffect(() => {
    return () => {
      if (ipcRenderer) {
        ipcRenderer.send("reset-global-search");
      }
    };
  }, []);

  return (
    <div className="music">
      {results.length ? (
        <ul className="music-names">
          {results.map((song, i) => (
            <li className="result" key={`song-${i}`}>
              <Song
                song={song}
                After={() => (
                  <img
                    className="download"
                    src={downloadImg}
                    alt="download button"
                    onClick={handleDownload}
                    data-index={i}
                  />
                )}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results">No Results</p>
      )}
    </div>
  );
}

export default SearchPage;
