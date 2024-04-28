#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Define the path to the assets directory
const assetsDirPath = path.join(process.cwd(), "src", "assets");

// Check if the assets directory exists
fs.access(assetsDirPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("assets folder is not placed correctly");
    return;
  }

  // Read all files from the assets directory
  fs.readdir(assetsDirPath, (err, files) => {
    if (err) {
      console.error("Error reading the assets directory:", err);
      return;
    }

    // Filter files to include only images with valid formats
    const validImageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
    const imageFiles = files.filter((file) =>
      validImageExtensions.includes(path.extname(file).toLowerCase())
    );
    if (imageFiles.length === 0) {
      console.error("No valid image files found in the assets directory.");
      return;
    }

    // Prepare content for the react_gen.js file
    const imports = imageFiles
      .map(
        (file) =>
          `import ${path.basename(file, path.extname(file))} from './${file}';`
      )
      .join("\n");
    const exports = imageFiles
      .map((file) => `  ${path.basename(file, path.extname(file))},`)
      .join("\n");

    const content = `${imports}\n\nexport const IMAGES = {\n${exports}\n};\n`;

    // Define the path for the react_gen.js file inside the assets directory
    const reactGenFilePath = path.join(assetsDirPath, "react_gen.js");

    // Write the content to the react_gen.js file
    fs.writeFile(reactGenFilePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log(
        "react_gen.js has been written successfully with image paths."
      );
    });
  });
});
