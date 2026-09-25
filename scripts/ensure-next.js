#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const nodeModulesPath = path.join(root, "node_modules");

function fail(message) {
  console.error("\n[ravah-website] Startup check failed:\n");
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(nodeModulesPath)) {
  fail(
    "Dependencies are missing (node_modules not found).\n" +
      "Run: npm install\n" +
      "Then retry: npm run dev"
  );
}

try {
  require.resolve("next/package.json", { paths: [root] });
} catch {
  fail(
    "The 'next' package is not installed in this project.\n" +
      "Run: npm install\n" +
      "If install fails, verify npm registry access and proxy settings."
  );
}

console.log("[ravah-website] Next.js dependency check passed.");
