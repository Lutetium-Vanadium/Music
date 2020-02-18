import { app } from "electron";
import sqlite3 from "sqlite3";
import * as path from "path";
import { song } from "../types";

// This file provides the Database class which is a wrapper around the `song_info.db` database
// It provides all functions needed to interact with the database

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
    this._init();
  }

  /**
   * init()
   *
   * Initiializes the database if it doesn't already exist
   */
  private _init = () => {
    this._db.run(`CREATE TABLE IF NOT EXISTS songdata (
      filePath TEXT, title TEXT, thumbnail TEXT, artist TEXT, length INT, numListens INT
    )`);
  };

  /**
   * addSong()
   *
   * @param {song} song The song to be added
   *
   * Songs which are downloaded are added to the db for additional information
   */

  addSong = ({
    filePath,
    title,
    thumbnail,
    artist,
    length
  }: song): Promise<void> => {
    return new Promise((res, rej) => {
      this._db.run(
        `INSERT INTO songdata
        (filePath, title, thumbnail, artist, length, numListens) VALUES
        ("${filePath}", "${title}", "${thumbnail}", "${artist}", ${length}, 0)
      `,
        [],
        err => {
          if (err) console.error(err);
          res();
        }
      );
    });
  };

  delete = (title: string): Promise<void> => {
    return new Promise((res, rej) => {
      this._db.run(`DELETE FROM songdata WHERE title LIKE "${title}"`, err => {
        if (err) console.error(err);
        res();
      });
    });
  };

  /**
   *
   * @param {string} songTitle The title to look up
   */
  // the search queries the database for all songs whose titles contains the search query
  search = (songTitle: string): Promise<song[]> =>
    new Promise((res, rej) =>
      this._db.all(
        `SELECT * FROM songdata WHERE title LIKE '%${songTitle}%'`,
        [],
        (err, data: song[]) => res(data)
      )
    );

  albums = (filePath: string): Promise<song[]> =>
    new Promise((res, rej) =>
      this._db.all(
        `SELECT * FROM songdata WHERE filePath LIKE '${filePath}'`,
        [],
        (err, songs: song[]) => {
          if (err) console.error(err);
          res(songs);
        }
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
   * most_popular_albums()
   *
   * @param {number} n The number of results to be returned
   *
   * The top 'n' albums stored in the database
   * - the top albums are essentially based on the most number of database entries that
   *   use a single album picture as its thumbnail
   *   ~ note this may be wrong if multiple songs from the same album are there, but they use different
   *     album id according to the napster result
   */
  most_popular_albums = (n: number): Promise<string[]> =>
    new Promise((res, rej) =>
      this._db.all(
        `SELECT thumbnail, COUNT(thumbnail) as cnt FROM songdata 
        GROUP BY thumbnail
        ORDER BY cnt
        DESC LIMIT ${n}`,
        [],
        (err, lst) => {
          if (err) console.error(err);

          let thumbnails: string[] = [];

          for (let { thumbnail } of lst) {
            thumbnails.push(thumbnail);
          }

          res(thumbnails);
        }
      )
    );

  /**
   * most_popular_songs()
   *
   * @param {number} n The number of results to be returned
   *
   * The top n number of songs which were heard by the user using this app
   * ~ note Any song not heard using this app will obviously not show up and
   *   if a song is played multiple times within a minute if the user hit forward backward
   *   continously will be picked up as seperate times
   */
  most_popular_songs = (n: number): Promise<song[]> =>
    new Promise((res, rej) =>
      this._db.all(
        `SELECT * FROM songdata ORDER BY numListens DESC LIMIT ${n}`,
        [],
        (err, songs: song[]) => {
          if (err) console.error(err);
          res(songs);
        }
      )
    );

  /**
   * increase_song_count()
   *
   * @param {string} filePath A way to id the song as no 2 files can have the same path
   *
   * Updates a particular songs times listened by one
   */
  increase_song_count = (filePath: string) =>
    this._db.run(
      `UPDATE songdata SET numListens = numListens + 1 WHERE filePath LIKE '${filePath}'`
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
