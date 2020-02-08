const axios = require("axios");

const getYoutubeId = async query => {
  // Makes sure to get the write video
  query += " official music video";

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

module.exports = getYoutubeId;
