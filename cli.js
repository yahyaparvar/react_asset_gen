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
    console.error(
      "\x1b[31m%s\x1b[0m",
      `-----------------------------------
❌ ERROR: Assets folder not found.
  ➤ Expected location: 'src/assets'
  ➤ Please ensure the folder structure is correct.
-----------------------------------`
    );
    return;
  }

  const validImageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
  // Get all files recursively in the assets directory
  const allFiles = readDirRecursively(assetsDirPath);
  const imageFiles = allFiles.filter((file) =>
    validImageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `-----------------------------------
❌ No valid image files found.
  ➤ Valid extensions: '.png', '.jpg', '.jpeg', '.gif', '.svg'
-----------------------------------`
    );
    return;
  }

  // Prepare content for imports and dynamic structure of exports
  const imports = [];
  const exports = [];
  imageFiles.forEach((file) => {
    const relativePath = path.relative(assetsDirPath, file);
    const importName = path.basename(file, path.extname(file));
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

  // Generate the final content for react_asset_gen.js
  const content = `${imports.join(
    "\n"
  )}\n\nexport const IMAGES = ${buildExportsObject(exports)};\n`;

  // Define the path for the react_asset_gen.js file inside the assets directory
  const reactGenFilePath = path.join(assetsDirPath, "react_asset_gen.js");

  // Check if react_asset_gen.js exists and remove it before writing a new one
  if (fs.existsSync(reactGenFilePath)) {
    fs.unlinkSync(reactGenFilePath);
    console.log(
      "\x1b[36m%s\x1b[0m",
      "🔄 Existing react_asset_gen.js file removed. Updating...\n"
    );
  }

  // Write the generated content to the react_asset_gen.js file
  fs.writeFile(reactGenFilePath, content, (err) => {
    if (err) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `-----------------------------------
❌ ERROR: Unable to write file:
  ➤ ${err}
-----------------------------------`
      );
      return;
    }
    console.log(
      "\x1b[32m%s\x1b[0m",
      `-----------------------------------
✅ 💃 SUCCESS: react_asset_gen.js has been created successfully!
  ➤ Path: src/assets/react_asset_gen.js
  ➤ All image paths have been processed and are now accessible.
-----------------------------------`
    );
  });
});
