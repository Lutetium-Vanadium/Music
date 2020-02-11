import * as React from "react";
import { song } from "../../types";
import Song from "../../shared/Song";

import download from "./download.png";

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface SearchPageParams {
  results: song[];
}

function SearchPage({ results }: SearchPageParams) {
  const handleDownload = e => {
    if (ipcRenderer) {
      const song = results[+e.target.dataset.index];
      ipcRenderer.send("download-song", song);
    } else {
      console.log("Download");
    }
  };

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
                    src={download}
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
        "No Results"
      )}
    </div>
  );
}

export default SearchPage;
