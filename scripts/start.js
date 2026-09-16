// scripts/start.js
// Cross-platform local runner for Crown & Cross (Admin + Storefront)
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

const rootDir = path.resolve(__dirname, "..");
const adminDir = path.join(rootDir, "admin");
const publicDir = path.join(rootDir, "CC-Hosting-Public");

console.log("=========================================");
console.log("  Crown & Cross — Local Development Runner");
console.log("=========================================");
console.log("  Admin App:      http://localhost:3000");
console.log("  Public Store:   http://localhost:3001");
console.log("=========================================\n");

function openBrowser(url) {
  const plat = process.platform;
  try {
    if (plat === "win32") {
      spawn("cmd", ["/c", "start", "", url], { stdio: "ignore" });
    } else if (plat === "darwin") {
      spawn("open", [url], { stdio: "ignore" });
    } else {
      spawn("xdg-open", [url], { stdio: "ignore" });
    }
  } catch (err) {
    console.error(`Could not automatically open browser for ${url}:`, err.message);
  }
}

const activePollers = [];

function waitForUrlAndOpen(url, label, delayMs = 0) {
  let opened = false;
  const pollInterval = setInterval(() => {
    if (opened) {
      clearInterval(pollInterval);
      return;
    }

    const req = http.get(url, (res) => {
      if (!opened) {
        opened = true;
        clearInterval(pollInterval);
        setTimeout(() => {
          console.log(`\n>>> [${label}] is ready! Opening in your browser: ${url}\n`);
          openBrowser(url);
        }, delayMs);
      }
      res.resume();
    });

    req.on("error", () => {
      // Server still booting up, continue polling
    });

    req.setTimeout(1000, () => {
      req.destroy();
    });
  }, 600);

  activePollers.push(pollInterval);
}

function run(name, command, cwd) {
  const child = spawn(command, {
    cwd,
    stdio: "inherit",
    shell: true
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
const adminProcess = run("Admin", "npm run dev", adminDir);

// Start Public Storefront on port 3001
const publicProcess = run("Storefront", "npm run dev", publicDir);

// Automatically open in browser once each service responds
waitForUrlAndOpen("http://localhost:3000", "Admin App", 0);
waitForUrlAndOpen("http://localhost:3001", "Public Storefront", 800);

const shutdown = () => {
  console.log("\nShutting down Crown & Cross servers...");
  activePollers.forEach((p) => clearInterval(p));
  try {
    if (process.platform === "win32") {
      if (adminProcess.pid) {
        spawn("taskkill", ["/pid", adminProcess.pid, "/T", "/F"], { stdio: "ignore" });
      }
      if (publicProcess.pid) {
        spawn("taskkill", ["/pid", publicProcess.pid, "/T", "/F"], { stdio: "ignore" });
      }
    } else {
      try {
        if (adminProcess.pid) process.kill(-adminProcess.pid, "SIGTERM");
      } catch (_) {
        if (adminProcess.kill) adminProcess.kill("SIGTERM");
      }
      try {
        if (publicProcess.pid) process.kill(-publicProcess.pid, "SIGTERM");
      } catch (_) {
        if (publicProcess.kill) publicProcess.kill("SIGTERM");
      }
    }
  } catch (_) {}
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
