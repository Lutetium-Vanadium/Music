const { app } = require("electron");
const sqlite3 = require("sqlite3");
const path = require("path");

// This file conntains all database related functions and interactions

const db_path = path.join(app.getPath("appData"), "song_info.db");

// A generic function called by all others which connects to the database
const connect = () => new sqlite3.Database(db_path);

// Initialises the song-data table
const init = () =>
  db.run(`CREATE TABLE IF NOT EXISTS song-data (
    fileName TEXT, title TEXT, thumbnail TEXT, artist TEXT
  )`);

// Songs which are downloaded are added to the db for additional information
const addSong = async ({ fileName, title, thumbnail, artist }) => {
  const db = connect();
  db.run(`INSERT INTO song-data
    (fileName, title, thumbnail, artist) VALUES
    ('${fileName}', '${title}', '${thumbnail}', '${artist}')
  `);
  db.close();
};

// the search queries the database for all songs whose titles contains the search query
const search = async songTitle => {
  return Promise(async (res, rej) => {
    const db = connect();
    db.all(
      `SELECT * FROM song-data WHERE title LIKE '%${songTitle}%'`,
      [],
      (err, data) => {
        res(data);
      }
    );
    db.close();
  });
};

module.exports = {
  init,
  addSong,
  search
};
