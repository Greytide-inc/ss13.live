// game-decl.test.mjs - the editor's address book (build/game-decl/, written by translate-tg.mjs via tools/game-decl.mjs) has one
// entry per proc of web/game, and its map sends a proc and a var back to their lines. Usage (from web/, after translate-tg): node tests/game-decl.test.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const web = resolve(import.meta.dirname, ".."), game = resolve(web, "game"), dir = resolve(web, "build/game-decl");
let bad = 0;
const fail = (t) => { bad++; console.log(`FAIL game-decl: ${t}`); };

// every proc in the game files, counted from the text (not by the generator's parser)
const files = [];
const walk = (d) => { for (const e of readdirSync(d)) { const p = resolve(d, e); if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) files.push(p); } };
walk(game);
let procs = 0;
const want = new Map(); // a proc and a var to find: "file:line" (0-based)
for (const f of files) {
	const lines = readFileSync(f, "utf8").split("\n");
	lines.forEach((l, i) => {
		if (/^rt\.def\("[^"]*\/(proc|verb)\/[^"]+"/.test(l)) procs++;
		if (l.startsWith('rt.def("/datum/explosion/proc/New"')) want.set("New", `${relative(dir, f)}:${i}`);
		if (/^rt\.type\([^"]*"\/obj\/effect\/vortex",/.test(l)) for (let j = i + 1; j < lines.length && !lines[j].startsWith("}"); j++) if (/^\tpull_range:/.test(lines[j])) want.set("pull_range", `${relative(dir, f)}:${j}`);
	});
}
const text = readFileSync(resolve(dir, "game.d.ts"), "utf8").split("\n");
const thisEntries = text.filter((l) => /^\t"\/[^"]+\/(proc|verb)\/[^"]+": DM/.test(l)).length;
const globalFns = new Set(text.filter((l) => /^declare function /.test(l)).map((l) => l.slice(17, l.indexOf("("))));
const globalDefs = files.reduce((n, f) => n + (readFileSync(f, "utf8").match(/^rt\.def\("\/proc\/[^"]+"/gm)?.length ?? 0), 0);
if (thisEntries + globalDefs !== procs) fail(`${procs} procs in web/game, but ${thisEntries} typed procs + ${globalDefs} global ones`);
if (!globalFns.has("explosion") || !globalFns.has("to_chat")) fail("global procs explosion/to_chat not declared");

// decode the map: each generated line's first segment -> "source:line"
const map = JSON.parse(readFileSync(resolve(dir, "game.d.ts.map"), "utf8"));
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const vlqs = (s) => { const out = []; let v = 0, sh = 0; for (const ch of s) { const d = B64.indexOf(ch); v += (d & 31) << sh; if (d & 32) sh += 5; else { out.push(v & 1 ? -(v >>> 1) : v >>> 1); v = 0; sh = 0; } } return out; };
let src = 0, line = 0;
const at = map.mappings.split(";").map((seg) => { if (!seg) return null; const [, ds, dl] = vlqs(seg.split(",")[0]); src += ds; line += dl; return `${map.sources[src]}:${line}`; });
const memberAt = (iface, name) => { const i = text.findIndex((l) => l.startsWith(`interface ${iface} `)); for (let j = i + 1; i >= 0 && !text[j].startsWith("}"); j++) if (text[j] === `\t${name}: any;`) return at[j]; return null; };
for (const [name, iface] of [["New", "DM$datum$explosion"], ["pull_range", "DM$obj$effect$vortex"]]) {
	const got = memberAt(iface, name);
	if (!want.get(name) || got !== want.get(name)) fail(`${iface}.${name} maps to ${got}, want ${want.get(name)}`);
}
console.log(bad ? `game-decl: ${bad} FAILED` : `game-decl: OK (${procs} procs, map lands on their lines)`);
process.exit(bad ? 1 : 0);
