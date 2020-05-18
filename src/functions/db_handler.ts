import { app } from "electron";
import * as sqlite3 from "sqlite3";
import * as path from "path";
import { Song, Album, Artist } from "../types";

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
  private _n = 5;

  constructor() {
    const dbPath = path.join(app.getPath("userData"), "song_info.db");
    this._db = new sqlite3.Database(dbPath);
    this._init();
  }

  /**
   * _init()
   *
   * Initiializes the database if it doesn't already exist
   */
  private _init = () => {
    this._db.run(
      `CREATE TABLE IF NOT EXISTS songdata (
      filePath TEXT, title TEXT, thumbnail TEXT, artist TEXT, length INT, numListens INT, liked BOOLEAN, albumId TEXT
    )`
    );
    this._db.run(`CREATE TABLE IF NOT EXISTS albumdata (id TEXT, imagePath TEXT, name TEXT, numSongs INT, artist TEXT)`);
  };

  /**
   * _escape()
   *
   * @param {string} str The string to escape
   *
   * @param {Quotes} quote The type of quote based on enum `Quote`
   *
   * Escapes all quotes based on the type of quote given
   */
  private _escape = (str: string, quote = Quotes.Double) => {
    switch (quote) {
      case Quotes.Double:
        str = str.replace(`"`, `""`);
        break;
      case Quotes.Single:
        str = str.replace(`'`, `''`);
        break;
      default:
        console.error("Unrecognosed Quote:", quote);
        break;
    }
    return str;
  };

  /**
   * addSong()
   *
   * @param {Song} song The song to be added
   *
   * Songs which are downloaded are added to the db for additional information
   */
  addSong = ({ filePath, title, thumbnail, artist, length, albumId }: Song): Promise<void> => {
    return new Promise((res) => {
      this._db.run(
        `INSERT INTO songdata
        (filePath, title, thumbnail, artist, length, numListens, liked, albumId) VALUES
        (
          "${this._escape(filePath)}",
          "${this._escape(title)}",
          "${this._escape(thumbnail)}",
          "${this._escape(artist)}",
          ${length}, 0, false,
          "${this._escape(albumId)}")
      `,
        (err) => {
          if (err) console.error(err);
          res();
        }
      );
    });
  };

  /**
   * deleteSong()
   *
   * @param {string} title Song to delete
   *
   * Delete all instances of songs with title=`title`
   */
  deleteSong = (title: string): Promise<void> => {
    return new Promise((res) => {
      this._db.run(`DELETE FROM songdata WHERE title LIKE "${this._escape(title)}"`, (err) => {
        if (err) console.error(err);
        res();
      });
    });
  };

  /**
   *
   * @param {string} songTitle The title to look up
   *
   * the search queries the database for all songs whose titles contains the search query
   */
  search = (songTitle: string): Promise<Song[]> => {
    songTitle = "%" + songTitle.split("").join("%") + "%";

    return new Promise((res) =>
      this._db.all(
        `SELECT * FROM songdata WHERE title LIKE "${this._escape(songTitle)}" ORDER BY LOWER(title), title`,
        (err, data: Song[]) => res(data)
      )
    );
  };

  /**
   * albumSongs()
   *
   * @param albumId The albumId for the album
   *
   * Returns all songs which have the same albumId
   */
  albumSongs = (albumId: string): Promise<Song[]> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM songdata WHERE albumId LIKE "${this._escape(albumId)}"`, (err, songs: Song[]) => {
        if (err) console.error(err);
        res(songs);
      })
    );

  /**
   * all()
   *
   * Returns every song in the database
   */
  all = (): Promise<Song[]> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM songdata ORDER BY LOWER(title), title`, (err, data: Song[]) => {
        if (err) console.error(err);
        res(data);
      })
    );

  /**
   * albumsFromSongs()
   *
   * returns all albums from songdata, used in database checks
   */
  albumsFromSongs = (): Promise<any[]> =>
    new Promise((res) =>
      this._db.all(`SELECT distinct albumId, artist FROM songdata ORDER BY albumId`, (err, data) => {
        if (err) console.error(err);
        res(data);
      })
    );

  /**
   * mostPopularAlbums()
   *
   * @param {boolean} limit Controls if limited albums need to be returned
   *
   * If not limited all albums are sent
   * If limited the top 'this._n' albums stored in the database are returned
   * - the top albums are essentially based on the most number of database entries that
   *   use a single album picture as its thumbnail
   *   ~ note this may be wrong if multiple songs from the same album are there, but they use different
   *     album id according to the napster result
   */
  mostPopularAlbums = (limit: boolean): Promise<Album[]> =>
    new Promise((res) =>
      this._db.all(
        `SELECT * FROM albumdata
        ORDER BY numSongs DESC
        ${limit ? `LIMIT ${this._n}` : ""}`,
        (err, albums: Album[]) => {
          if (err) console.error(err);
          res(albums);
        }
      )
    );

  /**
   * mostPopularSongs()
   *
   * @param {boolean} limit Controls if limited songs need to be returned
   *
   * If not limited all albums are sent
   * If limited the top 'this._n' number of songs which were heard by the user using this app
   * ~ note Any song not heard using this app will obviously not show up and
   *   if a song is played multiple times within a minute if the user hit forward backward
   *   continously will be picked up as seperate times
   */
  mostPopularSongs = (limit: boolean): Promise<Song[]> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM songdata ORDER BY numListens DESC${limit ? ` LIMIT ${this._n}` : ""}`, (err, songs: Song[]) => {
        if (err) console.error(err);
        res(songs);
      })
    );

  /**
   * liked()
   *
   * Returns all the liked songs
   */
  liked = (): Promise<Song[]> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM songdata WHERE liked ORDER BY LOWER(title), title`, (err, songs: Song[]) => {
        if (err) console.error(err);
        res(songs);
      })
    );

  /**
   * increaseNumListens()
   *
   * @param {string} filePath A way to id the song as no 2 files can have the same path
   *
   * Updates a particular songs times listened by one
   */
  incrementNumListens = (filePath: string) =>
    this._db.run(`UPDATE songdata SET numListens = numListens + 1 WHERE filePath LIKE "${this._escape(filePath)}"`);

  /**
   * changeLiked()
   *
   * @param {string} title The title of the song to be liked/disliked
   *
   * Inverts the liked value of the song - works as both dislike and like
   */
  changeLiked = (title: string) => this._db.run(`UPDATE songdata SET liked = NOT liked WHERE title LIKE "${this._escape(title)}"`);

  /**
   * exists()
   *
   * @param {string} albumId The id of the album
   *
   * Checks if a certain album exists in the database
   */
  exists = (albumId: string): Promise<boolean> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM albumdata WHERE id like "${this._escape(albumId)}"`, (err, data) => {
        if (err) console.error(err);
        res(data.length > 0);
      })
    );

  /**
   * addAlbum()
   *
   * @param {Album} album The album to add
   *
   * Adds an album to the albumdata table
   */
  addAlbum = ({ id, imagePath, name, artist }: Album): Promise<void> =>
    new Promise((res) =>
      this._db.run(
        `INSERT INTO albumdata
          (id, imagePath, name, artist, numSongs) VALUES
          ("${this._escape(id)}",
          "${this._escape(imagePath)}",
          "${this._escape(name)}",
          "${this._escape(artist)}", 0)`,
        (err) => {
          if (err) console.error(err);
          res();
        }
      )
    );

  /**
   * albumDetails()
   *
   * @param {string} id The id of the album
   *
   * Returns the details of the album id
   */
  albumDetails = (id: string): Promise<Album> =>
    new Promise((res) =>
      this._db.get(`SELECT * FROM albumdata where id LIKE "${this._escape(id)}"`, (err, row: Album) => {
        if (err) console.error(err);
        res(row);
      })
    );

  /**
   * incrementNumSongs()
   *
   * @param {string} albumId The id for the album to increment
   *
   * Increments the number of songs for the given albumId
   */
  incrementNumSongs = (albumId: string) =>
    this._db.run(`UPDATE albumdata SET numSongs = numSongs + 1 WHERE id LIKE "${this._escape(albumId)}"`);

  /**
   * decrementNumSongs()
   *
   * @param {string} albumId The image path for the album to increment
   *
   * Deccrements the number of songs for the given albumId
   * Image Path is used because the api is used only while deleteing songs, which does not have albumId as of now
   */
  decrementNumSongs = (albumId: string) => {
    this._db.run(`UPDATE albumdata SET numSongs = numSongs - 1 WHERE id LIKE "${this._escape(albumId)}"`);
    this._db.run(`DELETE FROM albumdata WHERE numSongs < 1`);
  };

  /**
   * deleteAlbum()
   *
   * @param {string} albumId ID of album to delete
   *
   * Deletes the album with the id given
   */
  deleteAlbum = async (albumId: string): Promise<void> =>
    new Promise((res) =>
      this._db.run(`DELETE FROM albumdata WHERE id LIKE ${this._escape(albumId)}`, (err) => {
        if (err) console.error(err);
        res();
      })
    );

  /**
   * artistDetails()
   *
   * @param {string} name Name of the artist
   *
   * Returns the details of the artist
   */
  artistDetails = (name: string): Promise<Artist> =>
    new Promise((res) =>
      this._db.all(
        `SELECT imagePath FROM albumdata WHERE artist LIKE "${this._escape(name)}" ORDER BY numSongs DESC LIMIT 4`,
        (err, albums: Album[]) => {
          if (err) console.error(err);

          const images: string[] = [];

          albums.forEach(({ imagePath }) => {
            images.push(imagePath);
          });

          res({ name, images });
        }
      )
    );

  /**
   * getArtists()
   *
   * Gets all the artists and the top four most heard albums by them (For the image)
   */
  getArtists = (): Promise<Artist[]> =>
    new Promise((res) => {
      const artists: Artist[] = [];
      this._db.each(
        `SELECT DISTINCT artist FROM songdata ORDER BY LOWER(artist)`,
        async (err, row: any) => {
          if (err) console.error(err);

          const artist = await this.artistDetails(row.artist);
          artists.push(artist);
        },
        async (err, n) => {
          if (err) console.error(err);
          const interval = setInterval(() => {
            if (artists.length === n) {
              clearInterval(interval);
              res(artists.sort((a, b) => (a.name > b.name ? 1 : -1)));
            }
          }, 50);
        }
      );
    });

  /**
   * artistSongs()
   *
   * @param {string} artist Name of the artist
   *
   * Returns all songs by the given artist
   */
  artistSongs = (artist: string): Promise<Song[]> =>
    new Promise((res) =>
      this._db.all(`SELECT * FROM songdata WHERE artist LIKE "${this._escape(artist)}" ORDER BY LOWER(title)`, (err, songs: Song[]) => {
        if (err) console.error(err);
        res(songs);
      })
    );

  /**
   * clear()
   *
   * @param {string} table Table to delete
   *
   * clears all entries in the specified database
   */
  clear = (table: string) => {
    this._db.all(`DELETE FROM ${table}`);
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
    this._db.all(`SELECT * FROM songdata`, (err, val) => {
      if (err) console.error(err);
      console.log("SONG DB:\n", val);
    });

    this._db.all(`SELECT * FROM albumsdata`, (err, val) => {
      if (err) console.error(err);
      console.log("ALBUM DB:\n", val);
    });
  };
}

export default new Database();

enum Quotes {
  Double,
  Single,
}
