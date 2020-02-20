import Downloader from "youtube-mp3-downloader";
import { store } from "../main";
import { app } from "electron";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";

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

/**
 * downloadImage()
 *
 * @param id Album Id of the image to download
 *
 * Downloads the Album cover from the id as per the napster API
 */
const downloadImage = async (id: string) => {
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

export { songDownloader, downloadImage };