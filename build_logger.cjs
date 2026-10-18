const { exec } = require("child_process");
const fs = require("fs");

exec("npm run build", { cwd: __dirname }, (error, stdout, stderr) => {
  const out = (stdout + "\\n" + stderr).replace(/\\r/g, "").replace(/\\x1b\\[[0-9;]*m/g, "");
  fs.writeFileSync("build_actual_error.txt", out, "utf8");
});
