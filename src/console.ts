import { createWriteStream } from "fs";
import { app } from "electron";
import * as path from "path";

// This file provides better console interactivity

const logPath = app.getPath("logs");

if (app.isPackaged) {
  const mainLogs = createWriteStream(path.join(logPath, "music.log"), {
    flags: "a",
  });
  process.stdout.write = mainLogs.write.bind(mainLogs);

  const errorLogs = createWriteStream(path.join(logPath, "error.log"), {
    flags: "a",
  });
  process.stderr.write = errorLogs.write.bind(errorLogs);

  const { log, error } = console;

  console.log = (message: any = "", ...optionalParams: any[]) => {
    const time = `[${new Date().toLocaleString()}]`;

    log(time, message, ...optionalParams, "\n");
  };

  console.error = (message: any = "", ...optionalParams: any[]) => {
    const time = `[${new Date().toLocaleString()} - ${getPos()}]`;

    error(time, message, ...optionalParams, "\n");
  };
} else {
  console.error = (message: any = "", ...optionalParams: any[]) => {
    console.log("\x1b[31m" + message, ...optionalParams, "\t@" + getPos() + "\x1b[0m");
  };
}

const getPos = () =>
  new Error().stack
    .split("\n")[3]
    .match(/\(?\/(.*?)(.*?):[0-9]*:[0-9]*/)[0]
    .split("/")
    .pop();

process.on("uncaughtException", function (err) {
  console.error(err && err.stack ? err.stack : err);
});

class Debug {
  constructor(private readonly _debug: boolean) {}

  log(...args: any[]) {
    if (this._debug) {
      console.log(...args, "\t@" + getPos());
    }
  }

  error(...args: any[]) {
    if (this._debug) {
      console.trace("\x1b[31m", ...args, "\x1b[0m");
    }
  }
}

export default new Debug(!app.isPackaged);
