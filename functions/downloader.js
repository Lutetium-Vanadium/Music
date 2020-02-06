const Downloader = require("youtube-mp3-downloader");
const { store } = require("../main");

// This file has the specified configurations for the youtuber downloader

// NOTE ffmpegPath must be fixed as it only supports linux as of now (die plebs)

const options = {
  ffmpegPath: "/usr/bin/ffmpeg",
  outputPath: store.get("folderStored"),
  youtubeVideoQuality: "highest",
  progressTimeout: 500,
  queueParallelism: 2
};

const downloader = new Downloader(options);

module.exports = downloader;
