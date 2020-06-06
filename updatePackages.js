/* eslint-disable */
const spawn = require("child_process").spawn;
const path = require("path");

const prevPackageJSON = JSON.parse(process.argv[2]);
const prevAppPackageJSON = JSON.parse(process.argv[3]);

const newPackageJSON = require("./package.json");
const newAppPackageJSON = require("./app/package.json");

const isEqual = (lst1, lst2) => {
  if (lst1.length !== lst2.length) {
    return false;
  }

  for (let i = 0; i < lst1.length; i++) {
    if (lst1[i] !== lst2[i]) {
      return false;
    }
  }
  return true;
};

const getDeps = (package) => {
  return Object.keys(package.dependencies);
};

if (!isEqual(getDeps(prevPackageJSON), getDeps(newPackageJSON))) {
  const yarn = spawn("yarn", {
    cwd: path.resolve(),
  });

  yarn.stdout.on("data", (data) => {
    console.log("Out [/]:", data.toString());
  });

  yarn.stderr.on("data", (data) => {
    console.error("Err [/]:", data.toString());
  });
}

if (!isEqual(getDeps(prevAppPackageJSON), getDeps(newAppPackageJSON))) {
  const yarn = spawn("yarn", {
    cwd: path.resolve("app"),
  });

  yarn.stdout.on("data", (data) => {
    console.log("Out [/app]:", data.toString());
  });

  yarn.stderr.on("data", (data) => {
    console.error("Err [/app]:", data.toString());
  });
}
