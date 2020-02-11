const Downloader = require("youtube-mp3-downloader");
const { store } = require("../main");
const { app } = require("electron");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

// This file has the specified configurations for the youtuber downloader
// and a function to download images

// NOTE ffmpegPath must be fixed as it only supports linux as of now (die plebs)

const options = {
  ffmpegPath: "/usr/bin/ffmpeg",
  outputPath: store.get("folderStored"),
  youtubeVideoQuality: "highest",
  progressTimeout: 100,
  queueParallelism: 2
};

const songDownloader = new Downloader(options);

const downloadImage = async id => {
  const download_path = path.join(
    app.getPath("userData"),
    "album_images",
    id + ".jpg"
  );

  if (fs.existsSync(download_path)) return;

  const url = `https://api.napster.com/imageserver/v2/albums/${id}/images/500x500.jpg`;
  const writer = fs.createWriteStream(download_path);

  const response = await axios.get(url, { responseType: "stream" });

  response.data.pipe(writer);

  return new Promise((res, rej) => {
    writer.on("finish", res);
    writer.on("error", rej);
  });
};

module.exports = {
  songDownloader,
  downloadImage
};
