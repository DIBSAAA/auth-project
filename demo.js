const fs = require("fs");
const path = require("path");
const os = require("os");
const EventEmitter = require("events");

/// Create a custom event emitter
const eventEmitter = new EventEmitter();

/// Event handling on log
eventEmitter.on("log", (msg) => {
  console.log("[LOG]", msg);
});

// Print OS info
// console.log("Platform:", os.platform());
// console.log("CPU:", os.cpus()[0].model);
// console.log("Free Memory:", os.freemem());

/// Defining the output and input paths
const filePath = path.join(__dirname, "demo.txt");
fs.readFile(filePath, (err, data) => {
  if (err) {
    eventEmitter.emit("log", "Failed to read file:" + err.message);
  } else {
    eventEmitter.emit("log", "File read successfully:\n" + data);
  }
});

const outputPath = path.join(__dirname, "demo.txt");
const outputData = "Hello from Node.js core modules app!";
fs.writeFile(outputPath, outputData, (err) => {
  if (err) {
    eventEmitter.emit("log", "Failed to write to file");
  } else {
    eventEmitter.emit("log", "Successfully wrote to output.txt");
  }
});
