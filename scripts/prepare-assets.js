const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.join(__dirname, "..");
const sourcePath = path.join(repoRoot, "assets", "logo", "ravah-logo.png.base64");
const outputPath = path.join(repoRoot, "public", "assets", "logo", "ravah-logo.png");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function prepareLogo() {
  const encoded = fs.readFileSync(sourcePath, "utf8").replace(/\s+/g, "");
  const image = Buffer.from(encoded, "base64");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  if (fs.existsSync(outputPath)) {
    const current = fs.readFileSync(outputPath);
    if (sha256(current) === sha256(image)) {
      return;
    }
  }

  fs.writeFileSync(outputPath, image);
}

prepareLogo();
