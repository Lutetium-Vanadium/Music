import { app } from "electron";
import * as sqlite3 from "sqlite3";
import * as path from "path";
import { open, Database as SqliteDatabase } from "sqlite";

// This file provides the Database class which is a wrapper around the `song_info.db` database
// It provides all functions needed to interact with the database

/**
 * The following error may occur:
 *
 * Error: Cannot find module '/path/to/project/node_modules/sqlite3/lib/binding/electron-v7.1-linux-x64/node_sqlite3.node'
 *
 * If so run the following command:
 *  `yarn fix-sqlite3`
 *
 * Wait some time and sqlite3 will be rebuilt
 */

// Method decorator to log all errors

function catchError(target: Database, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    try {
      return original.apply(this, args);
    } catch (error) {
      console.error(error);
    }
  };

  return descriptor;
}

class Database {
  private _db: SqliteDatabase<sqlite3.Database, sqlite3.Statement>;
  private _n = 5;
  private ready = false;
  private promises: (() => void)[] = [];

  constructor() {
    this._init();
  }

  /**
   * _init()
   *
   * Initiializes the database if it doesn't already exist
   */
  @catchError
  private async _init() {
    const dbPath = path.join(app.getPath("userData"), "song_info.db");

    this._db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await Promise.all([
      this._db.run(
        `CREATE TABLE IF NOT EXISTS songdata (
        filePath TEXT, title TEXT, thumbnail TEXT, artist TEXT, length INT, numListens INT, liked BOOLEAN, albumId TEXT
      )`
      ),
      this._db.run(`CREATE TABLE IF NOT EXISTS albumdata (id TEXT, imagePath TEXT, name TEXT, numSongs INT, artist TEXT)`),
      // this._db.run(`CREATE TABLE IF NOT EXISTS customalbums (i TEXT, name TEXT, songs TEXT)`),
    ]);

    this.ready = true;
    this.promises.forEach((res) => res());
  }

  /**
   * _escape()
   *
   * @param {string} str The string to escape
   *
   * @param {Quotes} quote The type of quote based on enum `Quote`
   *
   * Escapes all quotes based on the type of quote given
   */
  private _escape(str: string, quote: Quotes = Quotes.Double) {
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
  }

  /**
   * isReady()
   *
   * promise which resolves when db is ready
   */
  isReady() {
    return new Promise<void>((res) => {
      if (this.ready) {
        res();
      } else {
        this.promises.push(res);
      }
    });
  }

  /**
   * addSong()
   *
   * @param {Song} song The song to be added
   *
   * Songs which are downloaded are added to the db for additional information
   */
  @catchError
  async addSong({ filePath, title, thumbnail, artist, length, albumId }: Song) {
    await this._db.run(
      `INSERT INTO songdata
          (filePath, title, thumbnail, artist, length, numListens, liked, albumId) VALUES
          (
            "${this._escape(filePath)}",
            "${this._escape(title)}",
            "${this._escape(thumbnail)}",
            "${this._escape(artist)}",
            ${length}, 0, false,
            "${this._escape(albumId)}"
          )
      `
    );
  }

  /**
   * deleteSong()
   *
   * @param {string} title Song to delete
   *
   * Delete all instances of songs with title=`title`
   */
  @catchError
  async deleteSong(title: string) {
    await this._db.run(`DELETE FROM songdata WHERE title LIKE "${this._escape(title)}"`);
  }

  /**
   *
   * @param {string} songTitle The title to look up
   *
   * the search queries the database for all songs whose titles contains the search query
   */
  @catchError
  search(songTitle: string) {
    songTitle = "%" + songTitle.split("").join("%") + "%";

    return this._db.all<Song[]>(`SELECT * FROM songdata WHERE title LIKE "${this._escape(songTitle)}" ORDER BY LOWER(title), title`);
  }

  /**
   * albumSongs()
   *
   * @param albumId The albumId for the album
   *
   * Returns all songs which have the same albumId
   */
  @catchError
  albumSongs(albumId: string) {
    return this._db.all<Song[]>(`SELECT * FROM songdata WHERE albumId LIKE "${this._escape(albumId)}"`);
  }

  /**
   * all()
   *
   * Returns every song in the database
   */
  @catchError
  all() {
    return this._db.all<Song[]>(`SELECT * FROM songdata ORDER BY LOWER(title), title`);
  }

  /**
   * albumsFromSongs()
   *
   * returns all albums from songdata, used in database checks
   */
  @catchError
  async albumsFromSongs() {
    const data = await this._db.all<{ albumId: string; artist: string }[]>(`SELECT albumId, artist FROM songdata ORDER BY albumId`);

    const uniqueAlbums: { [albumId: string]: { artist: string; numSongs: number } } = {};
    for (const { albumId, artist } of data) {
      if (uniqueAlbums[albumId] === undefined) {
        uniqueAlbums[albumId] = {
          artist,
          numSongs: 1,
        };
      } else {
        uniqueAlbums[albumId].numSongs++;
      }
    }

    return Object.keys(uniqueAlbums).map((albumId) => ({ albumId, ...uniqueAlbums[albumId] }));
  }

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
  @catchError
  mostPopularAlbums(limit: boolean) {
    return this._db.all<Album[]>(
      `SELECT * FROM albumdata
        ORDER BY numSongs DESC
        ${limit ? `LIMIT ${this._n}` : ""}`
    );
  }

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
  @catchError
  mostPopularSongs(limit: boolean) {
    return this._db.all<Song[]>(`SELECT * FROM songdata ORDER BY numListens DESC${limit ? ` LIMIT ${this._n}` : ""}`);
  }

  /**
   * liked()
   *
   * Returns all the liked songs
   */
  @catchError
  liked() {
    return this._db.all<Song[]>(`SELECT * FROM songdata WHERE liked ORDER BY LOWER(title), title`);
  }

  /**
   * increaseNumListens()
   *
   * @param {string} filePath A way to id the song as no 2 files can have the same path
   *
   * Updates a particular songs times listened by one
   */
  @catchError
  async incrementNumListens(filePath: string) {
    await this._db.run(`UPDATE songdata SET numListens = numListens + 1 WHERE filePath LIKE "${this._escape(filePath)}"`);
  }

  /**
   * changeLiked()
   *
   * @param {string} title The title of the song to be liked/disliked
   *
   * Inverts the liked value of the song - works as both dislike and like
   */
  @catchError
  async changeLiked(title: string) {
    await this._db.run(`UPDATE songdata SET liked = NOT liked WHERE title LIKE "${this._escape(title)}"`);
  }

  /**
   * exists()
   *
   * @param {string} albumId The id of the album
   *
   * Checks if a certain album exists in the database
   */
  @catchError
  async exists(albumId: string) {
    const data = await this._db.all<Album[]>(`SELECT * FROM albumdata WHERE id like "${this._escape(albumId)}"`);
    return data.length > 0;
  }

  /**
   * addAlbum()
   *
   * @param {Album} album The album to add
   *
   * Adds an album to the albumdata table
   */
  @catchError
  async addAlbum({ id, imagePath, name, artist }: Album) {
    await this._db.run(
      `INSERT INTO albumdata
        (id, imagePath, name, artist, numSongs) VALUES
        ("${this._escape(id)}",
        "${this._escape(imagePath)}",
        "${this._escape(name)}",
        "${this._escape(artist)}", 0)`
    );
  }

  /**
   * albumDetails()
   *
   * @param {string} id The id of the album
   *
   * Returns the details of the album id
   */
  @catchError
  albumDetails(id: string) {
    return this._db.get<Album>(`SELECT * FROM albumdata where id LIKE "${this._escape(id)}"`);
  }

  /**
   * incrementNumSongs()
   *
   * @param {string} albumId The id for the album to increment
   *
   * Increments the number of songs for the given albumId
   */
  @catchError
  async incrementNumSongs(albumId: string) {
    await this._db.run(`UPDATE albumdata SET numSongs = numSongs + 1 WHERE id LIKE "${this._escape(albumId)}"`);
  }

  /**
   * decrementNumSongs()
   *
   * @param {string} albumId The image path for the album to increment
   *
   * Decrements the number of songs for the given albumId
   * Image Path is used because the api is used only while deleteing songs, which does not have albumId as of now
   */
  @catchError
  async decrementNumSongs(albumId: string) {
    await this._db.run(`UPDATE albumdata SET numSongs = numSongs - 1 WHERE id LIKE "${this._escape(albumId)}"`);

    // Incase all songs were removed from the album, delete it
    await this._db.run(`DELETE FROM albumdata WHERE numSongs < 1`);
  }

  /**
   * updateNumSongs()
   *
   * @param albumData The id for the album for which the numSongs needs to be updated
   *
   * Sets the number of song for the given albumId
   */
  @catchError
  async updateNumSongs({ albumId, numSongs }: { albumId: string; numSongs: number }) {
    await this._db.run(`UPDATE albumdata SET numSongs = ${numSongs} WHERE id like "${this._escape(albumId)}"`);
  }

  /**
   * deleteAlbum()
   *
   * @param {string} albumId ID of album to delete
   *
   * Deletes the album with the id given
   */
  @catchError
  async deleteAlbum(albumId: string) {
    await this._db.run(`DELETE FROM albumdata WHERE id LIKE "${this._escape(albumId)}"`);
  }

  /**
   * artistDetails()
   *
   * @param {string} name Name of the artist
   *
   * Returns the details of the artist
   */
  @catchError
  async artistDetails(name: string) {
    const albums = await this._db.all<{ imagePath: string }[]>(
      `SELECT imagePath FROM albumdata WHERE artist LIKE "${this._escape(name)}" ORDER BY numSongs DESC LIMIT 4`
    );

    return { name, images: albums.map((album) => album.imagePath) };
  }

  /**
   * getArtists()
   *
   * Gets all the artists and the top four most heard albums by them (For the image)
   */
  @catchError
  async getArtists() {
    const artistNames = await this._db.all<{ artist: string }[]>(`SELECT DISTINCT artist FROM songdata ORDER BY LOWER(artist)`);

    const artists = await Promise.all(artistNames.map(({ artist }) => this.artistDetails(artist)));

    return artists.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  /**
   * artistSongs()
   *
   * @param {string} artist Name of the artist
   *
   * Returns all songs by the given artist
   */
  @catchError
  artistSongs(artist: string) {
    return this._db.all<Song[]>(`SELECT * FROM songdata WHERE artist LIKE "${this._escape(artist)}" ORDER BY LOWER(title)`);
  }

  /**
   * clear()
   *
   * @param {string} table Table to delete
   *
   * clears all entries in the specified database
   */
  @catchError
  async clear(table: string) {
    await this._db.run(`DELETE FROM ${table}`);
  }

  /**
   * close()
   *
   * Ends the connection to the database
   */
  @catchError
  close() {
    return this._db.close();
  }

  /**
   * print()
   *
   * Prints the whole database
   */
  @catchError
  async print() {
    const databaseContents = await Promise.all([
      this._db.all<Song[]>(`SELECT * FROM songdata`),
      this._db.all<Album[]>(`SELECT * FROM albumdata`),
      // this._db.all(`SELECT * FROM customalbums`)
    ]);

    console.log(`[SONG DATA]: ${databaseContents[0]}`);
    console.log(`[ALBUM DATA]: ${databaseContents[1]}`);
    // console.log(`[CUSTOM ALBUMS]: ${databaseContents[2]}`)
  }
}

export default new Database();

enum Quotes {
  Double,
  Single,
}
