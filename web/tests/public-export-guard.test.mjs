// public-export-guard (code review 2026-10-27): tools/public-export.sh empties its target folder before copying the game in. Given a
// folder that isn't an export (a typo: the home folder, the desktop), it must stop before deleting anything. Usage (from web/): node tests/public-export-guard.test.mjs
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "export-guard-"));
const run = (d) => spawnSync("bash", ["tools/public-export.sh", d], { encoding: "utf8" });
// a folder of someone's own files
fs.mkdirSync(path.join(dir, "renders")); fs.writeFileSync(path.join(dir, "renders/final.blend"), "precious");
let r = run(dir);
check(r.status !== 0 && fs.existsSync(path.join(dir, "renders/final.blend")), `a folder of other files: refused, nothing deleted (exit ${r.status}: ${r.stderr.trim().slice(0, 120)})`);
// a git repo that isn't the export (its own history)
spawnSync("git", ["-C", dir, "init", "-q"]); spawnSync("git", ["-C", dir, "-c", "user.name=x", "-c", "user.email=x@x", "commit", "-q", "--allow-empty", "-m", "my project"]);
r = run(dir);
check(r.status !== 0 && fs.existsSync(path.join(dir, "renders/final.blend")), `another git repo: refused, nothing deleted (exit ${r.status})`);
fs.rmSync(dir, { recursive: true, force: true });
process.exit(bad ? 1 : 0);
