import axios from "axios";
import { song } from "../types";

/**
 * getYoutubeId()
 *
 * @param {string} query The title of the video to search on youtube's API
 *
 * Returns the first result's youtube id from a search query
 */
const getYoutubeId = async (song: song): Promise<string> => {
  // Makes sure to get the right video
  let query = `${song.title} ${song.artist} official music video`;

  query = query.replace(" ", "+");
  const url = "https://www.googleapis.com/youtube/v3/search";

  const result = await axios.get(url, {
    params: {
      key: process.env.GOOGLE_API_KEY,
      q: query,
      part: "snippet"
    }
  });
  return result.data.items[0].id.videoId;
};

export default getYoutubeId;
