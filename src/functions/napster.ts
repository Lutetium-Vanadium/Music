import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * All Functions follow the same basic pattern:
 *   They all return objects of the schema
 *   {
 *      status: (int),
 *      ...(return params)
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
 *     thumbnail: {string} -> url to the album cover,
 *     length: {int}       -> length of the track in seconds
 *   }
 */

// -------- Functions --------

/**
 * getAlbumInfo()
 *
 * @param {string} albumId The id of the album
 *
 * Gets the info for an album
 *
 * returns {
 *   id,
 *   name
 * }
 */
const getAlbumInfo = async (albumId: string) => {
  try {
    const response = await axios.get(`https://api.napster.com/v2.2/albums/${albumId}`, {
      params: {
        apikey: process.env.NAPSTER_API_KEY,
      },
    });

    if (response.status !== 200) throw response.headers.status;

    return formatAlbumData(response.data.albums[0]);
  } catch (error) {
    console.error(error);
    return {
      id: "",
      name: "",
    };
  }
};

/**
 * getSongInfo()
 *
 * @param {string} query The search term
 *
 * Gets the info for only one particular song, and downloads the thumbnail for it
 *
 * succes return schema {
 *   success: 1,
 *   song: Song
 * }
 */
const getSongInfo = async (query: string) => {
  try {
    const response = await axios.get("https://api.napster.com/v2.2/search", {
      params: {
        apikey: process.env.NAPSTER_API_KEY,
        type: "track",
        per_type_limit: 1,
        query,
      },
    });
    if (response.status !== 200) throw response.headers.status;

    // console.log("STATUS: ", response.status);
    // console.log(response.data.search.data);

    const track = response.data.search.data.tracks[0];

    return {
      status: 1,
      song: formatTrackData(track),
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
const search = async (query: string) => {
  try {
    const response = await axios.get("https://api.napster.com/v2.2/search", {
      params: {
        apikey: process.env.NAPSTER_API_KEY,
        type: "track",
        per_type_limit: 10,
        query,
      },
    });

    if (response.status !== 200) throw response.headers.status;

    let songs = [];

    for (let track of response.data.search.data.tracks) {
      songs.push(formatTrackData(track));
    }

    return {
      status: 1,
      songs,
    };
  } catch (error) {
    // console.error(error);
    return { status: 0, error };
  }
};

export { getAlbumInfo, getSongInfo, search };

/**
 * formatAlbumData()
 *
 * @param param0 The album object returned by napster api
 *
 * Returns the id and name for the album object
 */
const formatAlbumData = ({ id, name }) => ({
  id,
  name,
});

/**
 * formatTrackData()
 *
 * @param {Object} track The track object given by the napster api
 *
 * Returns a `Song` Object
 */
const formatTrackData = (track) => ({
  artist: track.artistName,
  title: track.name,
  length: track.playbackSeconds,
  thumbnail: `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg`,
  albumId: track.albumId,
});
