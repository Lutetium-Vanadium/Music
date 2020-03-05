require("electron-reload")(require("path").resolve("src"));
require("ts-node").register();
require("./src/main");
