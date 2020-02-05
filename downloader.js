const Downloader = require("youtube-mp3-downloader");

const downloader = new Downloader({
  ffmpegPath: "/usr/bin/ffmpeg",
  outputPath: store.get("folderStored"),
  youtubeVideoQuality: "highest",
  progressTimeout: 500,
  queueParallelism: 2
});

module.exports = downloader;
