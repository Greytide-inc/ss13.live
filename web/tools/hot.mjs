#!/usr/bin/env node
// hot - Load edited web/game files into a running dev server (server.mjs --hot): the station keeps running, no rebuild, no restart.
// Usage (from web/): node tools/hot.mjs [--port N] [game/code/.../file.ts ...]
//   No files named: every web/game file edited since the server's build was made. --port: which server, when several run with --hot.
//   exit 0 = loaded (it prints which procs changed); 2 = the edit needs a rebuild and restart, nothing was loaded; 1 = it failed.
// What it can load: new bodies for procs that already exist. Calls made after the swap run the new code; a proc that is asleep or
// looping finishes on the old one. What needs a restart: a new or changed var, type, global, proc, proc argument list or verb setting
// (those are the type tree, built at start), and anything that only runs at world start (New/Initialize of things already made).
// How: tools/translate-tg.mjs --hot turns each file into what the two bundles hold for it; its type block must be the build's own
// (build/NAME-dist/web/build/game-types.js) and its rt.def paths the build's (translated-tg.lines.json); then the bodies go to the
// server as a file, build/hot/PORT.in.json, and src/translate/runtime.ts hotSwap points each proc at its new function.
// A passing check on a swapped world is not the last word (the world may hold what the old code left): finish with one clean start.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), game = path.join(web, "game"), hotDir = path.join(web, "build/hot");
const argv = process.argv.slice(2);
const portAt = argv.indexOf("--port"), wantPort = portAt >= 0 ? argv[portAt + 1] : null;
const named = argv.filter((a, i) => !a.startsWith("--") && (portAt < 0 || i !== portAt + 1));
const die = (code, msg) => { console.error(`[hot] ${msg}`); process.exit(code); };

// The server: build/hot/PORT.json, written by server.mjs --hot while it runs.
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const servers = (fs.existsSync(hotDir) ? fs.readdirSync(hotDir) : []).filter((n) => /^\d+\.json$/.test(n))
	.map((n) => JSON.parse(fs.readFileSync(path.join(hotDir, n), "utf8"))).filter((s) => alive(s.pid) && (!wantPort || String(s.port) === wantPort));
if (servers.length !== 1) die(1, servers.length ? `${servers.length} servers run with --hot (ports ${servers.map((s) => s.port).join(", ")}): name one with --port` : `no running server started with --hot${wantPort ? ` on port ${wantPort}` : ""}`);
const srv = servers[0], built = path.join(srv.dist, "web/build");
const lines = JSON.parse(fs.readFileSync(path.join(built, "translated-tg.lines.json"), "utf8")), types = fs.readFileSync(path.join(built, "game-types.js"), "utf8");

// The files: named, or everything edited since the build.
let rels;
if (named.length) rels = named.map((a) => { const [f, alt] = a.split("="), rel = path.relative(game, path.resolve(f)); return (rel.startsWith("..") ? f : rel) + (alt ? `=${alt}` : ""); });
else {
	const since = fs.statSync(path.join(built, "translated-tg.js")).mtimeMs;
	rels = [];
	const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".ts") && fs.statSync(p).mtimeMs > since) rels.push(path.relative(game, p)); } };
	walk(game);
	if (!rels.length) { console.log("[hot] no web/game file is newer than the server's build: nothing to load"); process.exit(0); }
}
const tmp = path.join(hotDir, `${srv.port}.tr.json`);
try { execFileSync(process.execPath, [path.join(web, "tools/translate-tg.mjs"), "--hot", tmp, ...rels], { cwd: web, stdio: ["ignore", "inherit", "inherit"] }); } catch { die(1, "the file didn't convert (error above): nothing loaded"); }
const out = JSON.parse(fs.readFileSync(tmp, "utf8"));
fs.rmSync(tmp, { force: true });

// Only bodies may differ from the build the world was started from.
const restart = [], files = [];
for (const f of out) {
	const k = lines.files.indexOf(f.file);
	if (k < 0) { restart.push(`${f.file}: not in the server's build (a new file)`); continue; }
	const had = types.includes(`\n{ // ${f.file}\n`);
	if (f.types ? !types.includes(`\n${f.types}\n`) : had) { restart.push(`${f.file}: its types, vars, globals, proc list, proc arguments or verb settings changed`); continue; }
	const paths = lines.defs[k].filter((_, i) => i % 2);
	if (paths.length !== f.defs.length || paths.some((p, i) => p !== f.defs[i])) { restart.push(`${f.file}: its rt.def list changed`); continue; }
	let firstId = 0;
	for (let j = 0; j < k; j++) firstId += lines.defs[j].length / 2;
	if (paths.length) files.push({ file: f.file, js: f.body, firstId, paths });
}
if (restart.length) { for (const r of restart) console.error(`[hot] needs a rebuild and restart: ${r}`); die(2, "nothing loaded"); }
if (!files.length) { console.log("[hot] those files define no procs: nothing to load"); process.exit(0); }

const id = `${Date.now()}-${process.pid}`, inFile = path.join(hotDir, `${srv.port}.in.json`), outFile = path.join(hotDir, `${srv.port}.out.json`);
fs.rmSync(outFile, { force: true });
fs.writeFileSync(inFile + ".tmp", JSON.stringify({ id, files }));
fs.renameSync(inFile + ".tmp", inFile);
for (let i = 0; i < 100; i++) {
	await new Promise((r) => setTimeout(r, 100));
	let res;
	try { res = JSON.parse(fs.readFileSync(outFile, "utf8")); } catch { continue; }
	if (res.id !== id) continue;
	for (const l of res.lines) console.log(`[hot] ${l}`);
	process.exit(res.ok ? 0 : 1);
}
die(1, `the server on port ${srv.port} didn't answer in 10 s (is its world still loading? see ${srv.log})`);
