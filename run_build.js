const { spawn } = require("child_process");
const fs = require("fs");

const child = spawn("npm.cmd", ["run", "build"], { cwd: __dirname });

let out = "";
child.stdout.on("data", (data) => { out += data.toString("utf8"); });
child.stderr.on("data", (data) => { out += data.toString("utf8"); });

child.on("close", (code) => {
  // Strip carriage returns and ANSI color codes to avoid overwriting and garbage text
  const cleanOut = out.replace(/\r/g, "").replace(/\x1b\[[0-9;]*m/g, "");
  fs.writeFileSync("build_error_clean.txt", cleanOut, "utf8");
  console.log("Done");
});
