#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

/**
 * Recursively reads directories to find and collect file paths.
 * @param {string} dir - The directory to read recursively.
 * @param {array} fileList - An array of collected file paths.
 * @returns {array} The updated fileList with paths of files found in dir.
 */
function readDirRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readDirRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Define the path to the assets directory
const assetsDirPath = path.join(process.cwd(), "src", "assets");

// Check if the assets directory exists
fs.access(assetsDirPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("Assets folder is not placed correctly");
    return;
  }

  // Define valid image extensions
  const validImageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];

  // Get all files recursively in the assets directory
  const allFiles = readDirRecursively(assetsDirPath);
  const imageFiles = allFiles.filter((file) =>
    validImageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.error("No valid image files found in the assets directory.");
    return;
  }

  // Prepare content for imports and dynamic structure of exports
  const imports = [];
  const exports = [];
  imageFiles.forEach((file) => {
    const relativePath = path.relative(assetsDirPath, file);
    const importName =
      path.basename(file, path.extname(file)) +
      relativePath.replace(/[^a-zA-Z0-9]/g, "_");
    imports.push(`import ${importName} from './${relativePath}';`);
    const dirs = relativePath.split(path.sep);
    dirs.pop(); // Remove the file name
    let current = exports;
    dirs.forEach((dir, index) => {
      if (!current[dir]) {
        current[dir] = index === dirs.length - 1 ? {} : {};
      }
      current = current[dir];
    });
    current[path.basename(file, path.extname(file))] = importName;
  });

  // Function to build the nested export object structure
  const buildExportsObject = (obj) => {
    const entries = Object.entries(obj);
    return `{${entries
      .map(([key, value]) =>
        typeof value === "string"
          ? `${key}: ${value}`
          : `${key}: ${buildExportsObject(value)}`
      )
      .join(", ")}}`;
  };

  // Generate the final content for react_gen.js
  const content = `${imports.join(
    "\n"
  )}\n\nexport const IMAGES = ${buildExportsObject(exports)};\n`;

  // Define the path for the react_gen.js file inside the assets directory
  const reactGenFilePath = path.join(assetsDirPath, "react_gen.js");

  // Check if react_gen.js exists and remove it before writing a new one
  if (fs.existsSync(reactGenFilePath)) {
    fs.unlinkSync(reactGenFilePath);
    console.log("Existing react_gen.js file removed.");
  }

  // Write the generated content to the react_gen.js file
  fs.writeFile(reactGenFilePath, content, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("react_gen.js has been written successfully with image paths.");
  });
});
