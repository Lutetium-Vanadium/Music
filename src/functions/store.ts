import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

interface StoreParams {
  name: string;
  defaults?: object;
}

/**
 * Store - interface between a json config file and electron app
 *
 *   @param {string} name name of the file to be stored in
 *
 *   @param {object} defaults default values if the file has been corrupted or is being made for the first time
 */

class Store {
  private _path: string;
  private _data: object;

  constructor({ name, defaults = {} }: StoreParams) {
    this._path = path.join(app.getPath("userData"), name + ".json");
    this.parseDataFile(defaults);
  }

  /**
   * Store.get()
   *
   * @param {string} key The key of the property
   */
  get = (key: string) => {
    return this._data[key];
  };

  /**
   * Store.set()
   *
   * @param {string} key The key of the property
   *
   * @param {any} value The value to store for that key
   *
   * Stores the value for a key in the store file
   */
  set = (key: string, val: any) => {
    this._data[key] = val;

    fs.writeFileSync(this._path, JSON.stringify(this._data));
  };

  /**
   * Store.parseDataFile()
   *
   * @param {object} defaults The JSON to store if the file doesn't exist
   *
   * Reads the value of the store file, if it doesn't exist, returns the defaults
   */
  private parseDataFile = (defaults: object) => {
    try {
      this._data = JSON.parse(fs.readFileSync(this._path).toString());
    } catch (error) {
      this._data = defaults;
    }
  };
}

export default Store;
