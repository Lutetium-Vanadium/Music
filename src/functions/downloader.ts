import { app } from "electron";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";

import Downloader from "youtube-mp3-downloader";

// This file has the specified configurations for the youtuber downloader
// and a function to download images

const createDownloader = (path: string) => {
  const options = {
    outputPath: path,
    youtubeVideoQuality: "highest",
    progressTimeout: 100,
    queueParallelism: 2,
  };

  return new Downloader(options);
};
/**
 * downloadImage()
 *
 * @param id Album Id of the image to download
 *
 * Downloads the Album cover from the id as per the napster API
 */
const downloadImage = async (id: string) => {
  try {
    const downloadPath = path.join(
      app.getPath("userData"),
      "album_images",
      id + ".jpg"
    );

    if (fs.existsSync(downloadPath)) return;

    const url = `https://api.napster.com/imageserver/v2/albums/${id}/images/500x500.jpg`;
    const writer = fs.createWriteStream(downloadPath);

    const response = await axios.get(url, { responseType: "stream" });

    response.data.pipe(writer);

    return new Promise((res, rej) => {
      writer.on("finish", res);
      writer.on("error", rej);
    });
  } catch (err) {
    console.error(err);
    return;
  }
};

export { createDownloader, downloadImage };
