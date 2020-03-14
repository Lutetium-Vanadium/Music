import { app } from "electron";
import * as path from "path";
import * as fs from "fs";

interface Object {
  [key: string]: any;
}

interface StoreParams {
  name: string;
  defaults?: Object;
}

/**
 * Store - interface between a json config file and electron app
 *
 *   @param {string} name name of the file to be stored in
 *
 *   @param {Object} defaults default values if the file has been corrupted or is being made for the first time
 */

class Store {
  private _path: string;
  private _data: Object;

  constructor({ name, defaults = {} }: StoreParams) {
    this._path = path.join(app.getPath("userData"), name + ".json");
    this.parseDataFile(defaults);
  }

  /**
   * Store.get()
   *
   * @param {string} key The key of the property
   *
   * Gets a particular property
   */
  get = (key: string) => {
    return this._data[key];
  };

  /**
   * Store.getAll()
   *
   * Returns all the properties
   */
  getAll = () => this._data;

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
    this._write();
  };

  /**
   * Store.setAll()
   *
   * @param {object} obj An Object to destructure into data
   *
   * Adds/replaces all values in the given object in the data file
   * WARNING: The data being sent has to be only what you want added. It does not perform any checks and just destructures it
   */
  setAll = (obj: Object) => {
    this._data = { ...this._data, ...obj };
    this._write();
  };

  /**
   * Store.parseDataFile()
   *
   * @param {object} defaults The JSON to store if the file doesn't exist
   *
   * Reads the value of the store file, if it doesn't exist, returns the defaults
   */
  private parseDataFile = (defaults: Object) => {
    try {
      const data = JSON.parse(fs.readFileSync(this._path).toString());
      // Makes sure if new properties have been introduced, they will be set to their defaults;
      this._data = {
        ...defaults,
        ...data
      };
    } catch (error) {
      this._data = defaults;
    }
    this._write();
  };

  // The defination for the @Write decorator
  private _write = () => {
    fs.writeFileSync(this._path, JSON.stringify(this._data));
  };
}

export default Store;
