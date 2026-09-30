import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");

console.log("=================================================");
console.log("🛡️  i-VANTAGE V7 Architecture Guardrail Verification");
console.log("=================================================");

let violations = 0;

// 1. Prohibited dependencies check in client/package.json
const clientPkgPath = path.join(clientDir, "package.json");
if (fs.existsSync(clientPkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(clientPkgPath, "utf-8"));
  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  };

  const prohibitedPackages = [
    "mongoose",
    "bcrypt",
    "bcryptjs",
    "jsonwebtoken",
    "nodemailer",
    "cloudinary",
    "@types/bcryptjs",
    "@types/jsonwebtoken",
    "@types/nodemailer",
  ];

  for (const p of prohibitedPackages) {
    if (allDeps[p]) {
      console.error(`❌ VIOLATION: Prohibited backend package "${p}" found in client/package.json!`);
      violations++;
    }
  }
} else {
  console.warn("⚠️  client/package.json not found.");
}

// 2. Prohibited environment variables in client/.env.local and client/.env
const prohibitedEnvKeys = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_API_SECRET",
  "SMTP_PASS",
  "SMTP_USER",
];

for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(clientDir, envFile);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const key of prohibitedEnvKeys) {
      if (new RegExp(`^\\s*${key}\\s*=`, "m").test(content)) {
        console.error(`❌ VIOLATION: Backend secret "${key}" found in client/${envFile}!`);
        violations++;
      }
    }
  }
}

// 3. Prohibited directories: client/src/models and client/src/app/api
const prohibitedDirs = [
  path.join(clientDir, "src", "models"),
  path.join(clientDir, "src", "app", "api"),
];

for (const dir of prohibitedDirs) {
  if (fs.existsSync(dir)) {
    console.error(`❌ VIOLATION: Prohibited legacy backend directory exists: ${path.relative(rootDir, dir)}`);
    violations++;
  }
}

// 4. Code scans in client/src for forbidden direct imports
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        scanDir(fullPath);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const code = fs.readFileSync(fullPath, "utf-8");
      if (/from\s+['"](mongoose|bcryptjs|jsonwebtoken|nodemailer|cloudinary)['"]/.test(code)) {
        console.error(`❌ VIOLATION: Forbidden import in frontend file: ${path.relative(rootDir, fullPath)}`);
        violations++;
      }
      if (/from\s+['"]@\/models(\/.*)?['"]/.test(code)) {
        console.error(`❌ VIOLATION: Forbidden model import in frontend file: ${path.relative(rootDir, fullPath)}`);
        violations++;
      }
    }
  }
}

scanDir(path.join(clientDir, "src"));

console.log("-------------------------------------------------");
if (violations > 0) {
  console.error(`❌ GUARDRAIL FAILED: ${violations} architecture violation(s) detected.`);
  process.exit(1);
} else {
  console.log("✅ ALL GUARDRAILS PASSED: Frontend is 100% UI Only. No backend secrets, models, or DB packages detected.");
  console.log("=================================================");
  process.exit(0);
}
