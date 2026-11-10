#!/usr/bin/env node
// pb-headers - rewrites the machine-looking comments in web/game/**/*.ts (file-top "From ... translated once", per-proc "/path/proc/x  (file.dm:N)  may sleep") into plain ones. Comments only. Usage: node tools/pb-headers.mjs [--check] [files...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.join(here, "..", "game");
const TG = path.join(process.env.HOME, "Desktop/projects/tgstation");
const check = process.argv.includes("--check");
const explicit = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
	e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".ts") ? [path.join(d, e.name)] : []);

const HEAD = /^\/\/ From (\S.*?\.dm) \(translated once from the DM; this file is now the source, edit it by hand\)\.$/;
const DEF = /^\/\/ \S+ {2}\(([^()]*?\.dm):(\d+)\)( {2}may sleep)?$/;

const origin = (p) => (fs.existsSync(path.join(TG, p)) ? "/tg/station's " : /^(_Standard|Types\/)/.test(p) ? "BYOND's " : "");
const stats = { headers: 0, headersOther: [], defs: 0, defsBase: 0, defsFull: 0, left: [] };

for (const file of explicit.length ? explicit : walk(gameDir)) {
	const lines = fs.readFileSync(file, "utf8").split("\n");
	let dm = null, changed = false;
	const m = HEAD.exec(lines[0]);
	if (m) {
		dm = m[1];
		const o = origin(dm);
		if (!o) stats.headersOther.push(dm);
		lines[0] = `// Based on ${o}${dm}.`;
		stats.headers++; changed = true;
	}
	for (let i = 1; i < lines.length; i++) {
		if (!lines[i].startsWith("// /") || !lines[i].includes(".dm:")) continue;
		const d = DEF.exec(lines[i]);
		if (!d) { stats.left.push(`${path.relative(gameDir, file)}:${i + 1}: ${lines[i].slice(0, 140)}`); continue; }
		const base = dm && d[1] === dm;
		lines[i] = `// ${base ? path.basename(d[1]) : d[1]}:${d[2]}`;
		stats.defs++; base ? stats.defsBase++ : stats.defsFull++; changed = true;
	}
	if (changed && !check) fs.writeFileSync(file, lines.join("\n"));
}
console.log(`headers: ${stats.headers} (no tg/BYOND origin: ${stats.headersOther.length})`);
console.log(`defs: ${stats.defs} (base name ${stats.defsBase}, full path ${stats.defsFull}); left: ${stats.left.length}`);
if (stats.headersOther.length) console.log("other-origin headers:", [...new Set(stats.headersOther)].slice(0, 15).join(", "));
for (const l of stats.left.slice(0, 20)) console.log("  left", l);
