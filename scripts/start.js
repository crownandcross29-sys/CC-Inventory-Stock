// scripts/start.js
// Cross-platform local runner for Crown & Cross (Admin + Storefront)
const { spawn } = require("child_process");
const path = require("path");
const isWin = process.platform === "win32";

const rootDir = path.resolve(__dirname, "..");
const adminDir = path.join(rootDir, "admin");
const publicDir = path.join(rootDir, "CC-Hosting-Public");

console.log("=========================================");
console.log("  Crown & Cross — Local Development Runner");
console.log("=========================================");
console.log("  Admin App:      http://localhost:3000");
console.log("  Public Store:   http://localhost:3001");
console.log("=========================================\n");

function run(name, cmd, args, cwd) {
  const executable = isWin ? `${cmd}.cmd` : cmd;
  const child = spawn(executable, args, {
    cwd,
    stdio: "inherit",
    shell: false
  });

  child.on("error", (err) => {
    console.error(`[${name}] Failed to start:`, err.message);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`[${name}] exited with code ${code}`);
    }
  });

  return child;
}

// Start Admin on port 3000
const adminProcess = run("Admin", "npm", ["run", "dev"], adminDir);

// Start Public Storefront on port 3001
const publicProcess = run("Storefront", "npm", ["run", "dev"], publicDir);

process.on("SIGINT", () => {
  console.log("\nShutting down Crown & Cross servers...");
  adminProcess.kill();
  publicProcess.kill();
  process.exit(0);
});
