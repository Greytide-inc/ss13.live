// make-snapshot - saves the world at a chosen point (e.g. Runtime Station 5 min into the round, no players) for the page's ?snap=NAME.
// Usage (from web/, after npm run build:static): node tools/make-snapshot.mjs NAME [--map runtime] [--after-start SECONDS]
// Boots headless (as fast as it can, not real time) and saves --after-start game seconds after round start (default 300), or at the
// lobby without it. The file goes to build/snapshot-cache/world-NAME.snap.gz and into web/dist; build:static keeps shipping it
// while the build still matches (else it says so and leaves it out). Play: index.html?map=runtime&snap=NAME&join=Assistant
// (the round is running, so join= is tg's late join: you arrive like a latecomer).
import { snapshotKey } from "./snapshot-key.mjs";
import { logRebuild } from "./rebuild-log.mjs";
import { cpSync, createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const name = args[0];
if (!name || name.startsWith("-") || !/^[a-z0-9-]+$/.test(name)) throw new Error("usage: node tools/make-snapshot.mjs NAME [--map runtime] [--after-start SECONDS] (NAME: a-z, 0-9, -)");
const map = opt("--map", ""), afterStart = opt("--after-start", "300");
const cache = join(web, "build/snapshot-cache"), gz = `world-${name}.snap.gz`, meta = `world-${name}-snap.json`;
const raw = join(web, `build/world-${name}.snap`), logFile = join(web, `build/snapshot-${name}.log`), t0 = Date.now();
rmSync(raw, { force: true });
console.log(`booting ${map || "BoxStation"} and saving ${afterStart} s after round start (log: build/snapshot-${name}.log)...`);
const r = spawnSync(process.execPath, ["--max-old-space-size=4096", "build/dist/src/tools/boot.js", ...(map ? ["--map", map] : []), "--ticks", "10000000", "--seconds", "3600",
	"--snapshot-save", raw, "--snapshot-after-start", afterStart, "--snapshot-exit", "--log", logFile, "--data-out", join(web, `build/snapshot-${name}-data`)], { cwd: web, stdio: ["ignore", "ignore", "inherit"] });
const log = readFileSync(logFile, "utf8");
if (r.status !== 0 || !log.includes("[vm-boot] snapshot saved")) throw new Error(`boot failed (exit ${r.status}); see ${logFile}`);
mkdirSync(cache, { recursive: true });
await pipeline(createReadStream(raw), createGzip({ level: 6 }), createWriteStream(join(cache, gz)));
const rawBytes = statSync(raw).size, gzBytes = statSync(join(cache, gz)).size;
rmSync(raw, { force: true });
writeFileSync(join(cache, meta), JSON.stringify({ raw: rawBytes, gz: gzBytes, made: new Date().toISOString(), map, afterStart: Number(afterStart) }) + "\n");
writeFileSync(join(cache, `key-${name}`), snapshotKey(web));
const dist = join(web, "dist/web/build");
if (existsSync(dist)) for (const f of [gz, meta]) cpSync(join(cache, f), join(dist, f));
console.log(`snapshot ${name}: ${(gzBytes / 1048576).toFixed(1)} MB gzip in ${((Date.now() - t0) / 1000).toFixed(0)} s; ${log.match(/^\[vm-boot\] snapshot saved.*$/m)?.[0].replace(/.* at /, "saved at ").slice(0, 80)}`);
logRebuild(`saved round ${name}`);
console.log(`play: index.html?${map ? `map=${map}&` : ""}snap=${name}&join=Assistant`);
