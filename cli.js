#!/usr/bin/env node
const fs = require("fs");

console.log("Hello from my CLI tool!");

const fileName = "output.txt";
const content = "This is the content of my file.";

fs.writeFile(fileName, content, (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File has been written successfully.");
});
// You can add more complex logic, handle command line arguments, etc.
