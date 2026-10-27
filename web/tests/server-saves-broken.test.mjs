// server-saves-broken (code review 2026-10-27): tools/server-prelude.mjs's --saves FILE (every player's character setups). A file that
// can't be read (one byte short, a hand edit gone wrong) must not be overwritten by the next save: the game logs the failed load, starts
// with no saves and writes the file within seconds, so before this fix the setups were gone for good. Now the broken file is moved
// aside (FILE.broken-DATE), where it can be mended by hand. Runs the real prelude with a stand-in game script that does what
// src/worker/load-world.ts does (load, a failed load logged and taken as no saves, then a save). Usage (from web/): node tests/server-saves-broken.test.mjs
import { Worker } from "node:worker_threads";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "saves-broken-"));
const saves = path.join(dir, "saves.json"), script = path.join(dir, "game.mjs");
fs.writeFileSync(script, `
let files = {}, failed = "";
try { files = await globalThis.tgjsFileStore.load(); } catch (e) { failed = String(e.message); }
await globalThis.tgjsFileStore.save({ "data/round_end.json": new Uint8Array([123, 125]) });
postMessage({ type: "result", failed, n: Object.keys(files).length });
`);
const run = () => new Promise((resolve, reject) => {
	const w = new Worker(fileURLToPath(new URL("../tools/server-prelude.mjs", import.meta.url)), { workerData: { script, saves } });
	w.on("message", (m) => { if (m.type === "result") { void w.terminate(); resolve(m); } });
	w.on("error", reject);
});
const good = JSON.stringify({ "data/player_saves/i/ian/preferences.sav": Buffer.from("real_name = Ian").toString("base64") });
fs.writeFileSync(saves, good);
const r1 = await run();
check(r1.failed === "" && r1.n === 1, `a good file loads (${JSON.stringify(r1)})`);
fs.writeFileSync(saves, good.slice(0, -1)); // one byte short
const r2 = await run();
const aside = fs.readdirSync(dir).filter((f) => f.startsWith("saves.json.broken-"));
check(r2.failed !== "" && r2.n === 0, `a broken file fails to load and the round starts with no saves (${JSON.stringify(r2)})`);
check(aside.length === 1 && fs.readFileSync(path.join(dir, aside[0] ?? "x"), "utf8") === good.slice(0, -1), `the broken file is kept beside it, unchanged (${aside.join(", ") || "none"})`);
check(aside.length === 1 && r2.failed.includes(aside[0]), "the load error names where it was kept");
check(JSON.parse(fs.readFileSync(saves, "utf8"))["data/round_end.json"] === "e30=", "the new saves file is written as usual");
fs.rmSync(dir, { recursive: true, force: true });
process.exit(bad ? 1 : 0);
