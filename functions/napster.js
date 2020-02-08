const axios = require("axios");
require("dotenv").config();

/**
 * All Functions follow the same basic pattern:
 *   They all return objects of the schema
 *   {
 *      status: (int),
 *      ...return params
 *   }
 *
 * There are 2 main types of return which can be found out from the status
 *
 * case status == 0:
 *   The only other key availble is error which provides the reason for failure
 *
 * case status == 1:
 *   The keys correspond to the various return values expected by the various functions
 *
 *
 * Basic object definations:
 *   Song: {
 *     artist: {string},   -> name of the artist
 *     title: {string},    -> title of the song
 *     thumbnail: {string} -> url to the album cover
 *   }
 */

// -------- Functions --------

/**
 * getSongInfo()
 *
 * @param {string} query The search term
 *
 * Gets the info for only one particular song
 *
 * succes return schema {
 *   success: 1,
 *   song: Song
 * }
 */
const getSongInfo = async query => {
  try {
    const response = await axios.get("http://api.napster.com/v2.2/search", {
      params: {
        apikey: process.env.NAPSTER_API_KEY,
        type: "track",
        per_type_limit: 1,
        query
      }
    });
    if (response.status !== 200) throw response.headers.status;
    console.log("\n\n\nDATA: ", response.data);

    return {
      status: 1,
      song: formatTrackData(response.data.tracks[0])
    };
  } catch (error) {
    console.error(error);
    return { status: 0, error };
  }
};

/**
 * search()
 *
 * @param {string} query The search query
 *
 * Returns the top 5 songs which fit the query
 *
 * success return schema {
 *   success: 1,
 *   songs: {Song[]} -> 5 songs
 * }
 */
const search = async query => {
  try {
    const response = axios.get("http://api.napster.com/v2.2/search", {
      params: {
        apikey: process.env.NAPSTER_API_KEY,
        type: "track",
        per_type_limit: 5,
        query
      }
    });
    if (response.status !== 200) throw response.headers.status;
    console.log("DATA: ", response.data);

    let songs = [];

    for (let track of response.data.tracks) {
      songs.push(formatTrackData(track));
    }

    return {
      status: 1,
      songs
    };
  } catch (error) {
    console.error(error);
    return { status: 0, error };
  }
};

module.exports = {
  getInfo: getSongInfo,
  search
};

/**
 * formatTrackData()
 *
 * @param {Object} track The track object given by the napster api
 *
 * Returns a `Song` Object
 */

const formatTrackData = track => {
  return {
    artist: track.artistName,
    title: track.name,
    thumbnail: `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg`
  };
};
