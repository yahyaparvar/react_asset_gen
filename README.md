# react_asset_gen

`react_asset_gen` is a command-line interface (CLI) tool designed to streamline the process of managing and importing static image assets in React projects. It automatically scans your `src/assets` folder, identifies all image files, and generates a JavaScript module that exports these images in an easily accessible object format.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Example & Usage](#usage)

## <a name="features"></a>🌟 Features

- **Automated Image Exports**: Automatically generates an export file for image assets found in your project's `src/assets` directory.
- **Support for Multiple Formats**: Handles `.png`, `.jpg`, `.jpeg`, `.gif`, and `.svg` files.
- **Simplified Image Importing**: Allows you to import all your images from a single file, reducing the boilerplate code in your React components.

## <a name="installation"></a>📦 Installation

You can install `react_asset_gen` via npm or use it directly with npx:

```bash
npm install -g react_asset_gen
```

Alternatively:

```bash
npx react_asset_gen
```

## <a name="usage"></a>⚙️ Example & Usage

### Initial Setup

Before running `react_asset_gen`, ensure you have created an `assets` folder inside your `src` directory (`src/assets`) and placed your static image files there. This setup is <strong>necessary</strong> for the tool to locate and process the images.

To use `react_asset_gen`, navigate to the root of your React project and run:

```bash
npx react_asset_gen
```

This command will generate a `react_gen.js` file within your `src/assets` directory that might look like this:

```javascript
// react_gen.js
import example_svg from "./example.svg";

export const IMAGES = {
  example_svg,
};
```

You can now import and use your images directly in your React components with ease:

```jsx
import React from 'react';
import { IMAGES } from '../assets/react_gen';

function MyComponent() {
  return <img src={IMAGES.example_svg} alt="Example" />;
}

export default MyComponent;
```
