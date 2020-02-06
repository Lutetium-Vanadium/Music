const fetch = require("node-fetch");
require("dotenv").config();

const google = async query => {
  // Makes sure to get the write video
  query += " official music video";

  query = query.replace(" ", "+");
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.GOOGLE_API_KEY}&q=${query}&part=snippet`;

  const result = await fetch(url);
  const data = await result.json();
  return data.items[0].id.videoId;
};

module.exports = google;
