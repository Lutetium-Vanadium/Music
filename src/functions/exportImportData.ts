import { app } from "electron";
import { createWriteStream, promises as fs, PathLike } from "fs";
import path from "path";
import JSZip from "jszip";

const CONFIG_PATH = path.join(app.getPath("userData"), "config.json");
const DB_PATH = path.join(app.getPath("userData"), "song_info.db");

/**
 * exportData()
 *
 * @param {PathLike}} zipPath The path to write the zip file to [includes the actual zip-file name]
 *
 * Compresses db and config to a single zip file
 */
export const exportData = (zipPath: PathLike): Promise<string> => {
  return new Promise(async (res, rej) => {
    try {
      const files = await Promise.all([fs.readFile(CONFIG_PATH), fs.readFile(DB_PATH)]);

      const zip = new JSZip();

      zip.file("config", files[0]);
      zip.file("db", files[1]);

      const zipWriteStream = createWriteStream(zipPath);

      zip
        .generateNodeStream()
        .pipe(zipWriteStream)
        .on("finish", () => {
          res("Finished writing to " + zipPath);
        })
        .on("error", rej);
    } catch (error) {
      rej(error);
    }
  });
};

/**
 * importData()
 *
 * @param {PathLike} zipPath The path to the zipFile to read
 *
 * Reads the data from a zip file and writes to the config and db file
 */
export const importData = (zipPath: PathLike): Promise<string> => {
  return new Promise(async (res, rej) => {
    try {
      const data = await fs.readFile(zipPath);
      const zip = await JSZip.loadAsync(data);

      const files = Object.keys(zip.files);

      if (!files.includes("config") || !files.includes("db")) {
        rej("Zip file doesn't contain the required files");
      }

      await Promise.all([
        zip
          .file("config")
          .async("nodebuffer")
          .then((data) => fs.writeFile(CONFIG_PATH, data)),
        zip
          .file("db")
          .async("nodebuffer")
          .then((data) => fs.writeFile(DB_PATH, data)),
      ]);
      res("Finished extracting zip files.");
    } catch (error) {
      rej(error);
    }
  });
};
