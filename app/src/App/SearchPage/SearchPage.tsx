import * as React from "react";
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
        "No Results"
      )}
    </div>
  );
}

export default SearchPage;
