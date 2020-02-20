console.error = (...args: any[]) => {
  console.log("\x1b[31m", ...args, "\x1b[0m");
};
