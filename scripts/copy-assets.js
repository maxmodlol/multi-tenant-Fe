#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Copy static assets from public directory to standalone build output
 * This ensures that icons and other static assets are available in production
 */

const sourceDir = path.join(__dirname, "..", "public");
const targetDir = path.join(__dirname, "..", ".next", "standalone", "public");

function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

// Only run if we're in production and standalone build exists
if (
  process.env.NODE_ENV === "production" &&
  fs.existsSync(path.join(__dirname, "..", ".next", "standalone"))
) {
  console.log("Copying static assets to standalone build...");
  copyDirectory(sourceDir, targetDir);
  console.log("Static assets copied successfully!");
} else {
  console.log("Skipping asset copy - not in production or standalone build not found");
}

