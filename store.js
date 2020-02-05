const { app } = require("electron");
const path = require("path");
const fs = require("fs");

/**
 * Store - interface between a json config file and electron app
 *
 *   @param {string} name name of the file to be stored in
 *
 *   @param {object} defaults default values if the file has been corrupted or is being made for the first time
 */

class Store {
  constructor({ name, defaults = {} }) {
    this.path = path.join(app.getPath("userData"), name + ".json");
    this.parseDataFile(defaults);
  }

  get = key => {
    return this.data[key];
  };

  set = (key, val) => {
    this.data[key] = val;

    fs.writeFileSync(this.path, JSON.stringify(this.data));
  };

  parseDataFile = defaults => {
    try {
      this.data = JSON.parse(fs.readFileSync(this.path));
    } catch (error) {
      this.data = defaults;
    }
  };
}

module.exports = Store;
