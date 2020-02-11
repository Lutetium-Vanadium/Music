import { app } from "electron";
import sqlite3 from "sqlite3";
import * as path from "path";
import { song } from "../types";

// This file contains all database related functions and interactions

/**
 * The following error may occur:
 *
 * Error: Cannot find module '/path/to/project/node_modules/sqlite3/lib/binding/electron-v7.1-linux-x64/node_sqlite3.node'
 *
 * If so run the following command:
 *  `./node_modules/.bin/electron-rebuild -w sqlite3 -p
 *
 * Wait some time and sqlite3 will be rebuilt
 */

class Database {
  private _db: sqlite3.Database;

  constructor() {
    const db_path = path.join(app.getPath("userData"), "song_info.db");
    this._db = new sqlite3.Database(db_path);
  }

  /**
   * init()
   *
   * Initiializes the database if it doesn't already exist
   */
  init = () => {
    this._db.run(`CREATE TABLE IF NOT EXISTS songdata (
      filePath TEXT, title TEXT, thumbnail TEXT, artist TEXT, length INT
    )`);
  };

  /**
   * addSong()
   *
   * @param {song} song The song to be added
   *
   * Songs which are downloaded are added to the db for additional information
   */

  addSong = async ({ filePath, title, thumbnail, artist, length }: song) => {
    this._db.run(
      `INSERT INTO songdata
      (filePath, title, thumbnail, artist, length) VALUES
      ('${filePath}', '${title}', '${thumbnail}', '${artist}', ${length})
    `,
      [],
      (err, val) => console.error(err)
    );
  };

  /**
   *
   * @param {string} songTitle The title to look up
   */
  // the search queries the database for all songs whose titles contains the search query
  search = async (songTitle: string): Promise<song[]> =>
    new Promise(async (res, rej) =>
      this._db.all(
        `SELECT * FROM songdata WHERE title LIKE '%${songTitle}%'`,
        [],
        (err, data: song[]) => res(data)
      )
    );

  /**
   * all()
   *
   * Returns every song in the database
   */
  all = (): Promise<song[]> =>
    new Promise((res, rej) =>
      this._db.all(`SELECT * FROM songdata`, [], (err, data: song[]) => {
        if (err) console.error(err);
        res(data);
      })
    );

  /**
   * clear()
   *
   * Clears the database
   */
  clear = () => {
    this._db.all("DELETE FROM songdata");
  };

  /**
   * close()
   *
   * Ends the connection to the database
   */
  close = () => this._db.close();

  /**
   * print()
   *
   * Prints the whole database
   */
  print = () => {
    this._db.all(`SELECT * FROM songdata`, [], (err, val) => {
      if (err) console.error(err);
      console.log("SONG DB:\n", val);
    });
  };
}

export default new Database();
