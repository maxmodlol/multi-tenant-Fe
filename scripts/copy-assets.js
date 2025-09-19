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

// Always run the copy operation during build process
console.log("Starting asset copy process...");
console.log("Source directory:", sourceDir);
console.log("Target directory:", targetDir);

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error("Source directory does not exist:", sourceDir);
  process.exit(1);
}

// Check if .next directory exists (build must have completed)
const nextDir = path.join(__dirname, "..", ".next");
if (!fs.existsSync(nextDir)) {
  console.error("Build directory does not exist. Make sure 'next build' completed successfully.");
  process.exit(1);
}

// Create standalone directory if it doesn't exist
const standaloneDir = path.join(__dirname, "..", ".next", "standalone");
if (!fs.existsSync(standaloneDir)) {
  console.log("Creating standalone directory...");
  fs.mkdirSync(standaloneDir, { recursive: true });
}

console.log("Copying static assets to standalone build...");
copyDirectory(sourceDir, targetDir);
console.log("Static assets copied successfully!");

// Also copy to static directory for additional safety
const staticTargetDir = path.join(__dirname, "..", ".next", "static", "public");
if (!fs.existsSync(staticTargetDir)) {
  fs.mkdirSync(staticTargetDir, { recursive: true });
}
console.log("Copying assets to static directory as well...");
copyDirectory(sourceDir, staticTargetDir);
console.log("All asset copying completed successfully!");
