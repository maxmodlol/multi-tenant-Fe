#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Verification script to check if assets are properly copied and accessible
 * This helps debug production asset loading issues
 */

console.log("🔍 Verifying asset deployment...\n");

// Paths to check
const paths = {
  public: path.join(__dirname, "..", "public"),
  standalone: path.join(__dirname, "..", ".next", "standalone", "public"),
  static: path.join(__dirname, "..", ".next", "static", "public"),
};

// Critical assets to verify
const criticalAssets = [
  "logo.svg",
  "icons/arrow-left.svg",
  "icons/arrow-right.svg",
  "icons/author-avatar.png",
  "icons/copy.svg",
  "icons/facebook.svg",
  "icons/whatsapp.svg",
  "icons/telegram.svg",
  "icons/X.svg",
  "icons/instagram.svg",
];

function checkDirectory(dirPath, name) {
  console.log(`📁 Checking ${name}: ${dirPath}`);

  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Directory does not exist\n`);
    return false;
  }

  console.log(`✅ Directory exists`);

  let allAssetsPresent = true;
  criticalAssets.forEach((asset) => {
    const assetPath = path.join(dirPath, asset);
    if (fs.existsSync(assetPath)) {
      const stats = fs.statSync(assetPath);
      console.log(`  ✅ ${asset} (${stats.size} bytes)`);
    } else {
      console.log(`  ❌ ${asset} - MISSING`);
      allAssetsPresent = false;
    }
  });

  console.log("");
  return allAssetsPresent;
}

// Check all paths
let allGood = true;
Object.entries(paths).forEach(([name, dirPath]) => {
  const result = checkDirectory(dirPath, name);
  allGood = allGood && result;
});

// Additional checks
console.log("🔧 Additional checks:");

// Check Next.js build output
const nextDir = path.join(__dirname, "..", ".next");
if (fs.existsSync(nextDir)) {
  console.log("✅ Next.js build directory exists");

  const standaloneServer = path.join(nextDir, "standalone", "server.js");
  if (fs.existsSync(standaloneServer)) {
    console.log("✅ Standalone server.js exists");
  } else {
    console.log("❌ Standalone server.js missing");
    allGood = false;
  }
} else {
  console.log("❌ Next.js build directory missing");
  allGood = false;
}

// Check environment
console.log(`📊 NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
console.log(
  `📊 Build mode: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}`,
);

console.log("\n" + "=".repeat(50));
if (allGood) {
  console.log("🎉 All assets verified successfully!");
  console.log("✅ Your production build should work correctly.");
} else {
  console.log("⚠️  Some assets are missing or incorrectly deployed.");
  console.log("❌ This may cause issues in production.");
  console.log("\n💡 Troubleshooting steps:");
  console.log("1. Run: npm run build:production");
  console.log("2. Check that all files copied successfully");
  console.log("3. Verify your deployment includes the .next/standalone directory");
  console.log("4. Ensure public assets are accessible at the root level");
}

process.exit(allGood ? 0 : 1);
