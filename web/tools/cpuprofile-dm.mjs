// cpuprofile-dm - Call tree of DM procs only (translated tg frames, named by their DM path:file:line) from a .cpuprofile; engine frames fold into the proc that called them.
// Usage: node tools/cpuprofile-dm.mjs FILE.cpuprofile [DEPTH=8] [MINMS=5] [--flat N]   (needs build/translated-tg.js next to web/)
// --flat N: instead of the tree, top N procs by inclusive and by self ms (self = incl. the engine work it called directly).
// --by-file N [--from S]: top N DM files by the engine work their procs called directly (samples after S seconds, default 0), as a share of all time.
import { readFileSync } from "node:fs";
const argv = process.argv.slice(2), fi = argv.indexOf("--flat"), flat = fi >= 0 ? Number(argv.splice(fi, 2)[1]) : 0;
const bi = argv.indexOf("--by-file"), byFile = bi >= 0 ? Number(argv.splice(bi, 2)[1]) : 0;
const fri = argv.indexOf("--from"), fromS = fri >= 0 ? Number(argv.splice(fri, 2)[1]) : 0;
const [file, d, m] = argv, depth = Number(d ?? 8), min = Number(m ?? 5);
const src = readFileSync(process.env.TG_JS ?? new URL("../build/translated-tg.js", import.meta.url), "utf8").split("\n");
const p = JSON.parse(readFileSync(file, "utf8")), byId = new Map(p.nodes.map((n) => [n.id, n])), selfMs = new Map();
p.samples.forEach((id, i) => selfMs.set(id, (selfMs.get(id) ?? 0) + (p.timeDeltas[i] ?? 0) / 1000));
const label = (n) => {
	const cf = n.callFrame;
	if (!cf.url.endsWith("translated-tg.js")) return null;
	const c = src[cf.lineNumber - 1] ?? "";
	const mt = /^\/\/ (\S+)\s+\((.*?)\)/.exec(c);
	return mt ? `${mt[1]} (${mt[2].replace(/^code\//, "")})` : `${cf.functionName}:${cf.lineNumber + 1}`;
};
class T { constructor(l) { this.l = l; this.kids = new Map(); this.self = 0; this.incl = 0; } }
const root = new T("(root)");
const flatIncl = new Map(), flatSelf = new Map();
(function walk(n, cur, stack) {
	const l = label(n);
	let at = cur;
	if (l) { at = cur.kids.get(l) ?? (cur.kids.set(l, new T(l)), cur.kids.get(l)); }
	const own = selfMs.get(n.id) ?? 0;
	at.self += own;
	let st = stack;
	if (l) { st = stack.includes(l) ? stack : [...stack, l]; if (st !== stack) flatIncl.set(l, flatIncl.get(l) ?? 0); }
	for (const k of n.children ?? []) walk(byId.get(k), at, st);
	if (own) { for (const s of st) flatIncl.set(s, (flatIncl.get(s) ?? 0) + own); const top = st[st.length - 1]; if (top) flatSelf.set(top, (flatSelf.get(top) ?? 0) + own); }
})(p.nodes[0], root, []);
if (byFile) {
	// The nearest translated frame up the stack owns each sample; its DM file gets the time, split into own code and engine work.
	const parent = new Map(), dmFile = new Map();
	for (const n of p.nodes) for (const k of n.children ?? []) parent.set(k, n.id);
	const fileOf = (n) => {
		if (!dmFile.has(n.id)) {
			const cf = n.callFrame, mt = cf.url.endsWith("translated-tg.js") && /^\/\/ \S+\s+\((.*?):\d+\)/.exec(src[cf.lineNumber - 1] ?? "");
			dmFile.set(n.id, mt ? mt[1].replace(/^code\//, "") : null);
		}
		return dmFile.get(n.id);
	};
	const engine = /translate\/runtime|vm\/interpreter|vm\/objects|vm\/gc/, agg = new Map();
	let t = 0, total = 0;
	p.samples.forEach((id, i) => {
		const dt = p.timeDeltas[i] ?? 0;
		t += dt;
		if (t / 1e6 < fromS) return;
		total += dt / 1000;
		const leaf = byId.get(id);
		let f = null;
		for (let n = leaf; n && !(f = fileOf(n)); n = byId.get(parent.get(n.id)));
		if (!f) return;
		const a = agg.get(f) ?? { engine: 0, all: 0 };
		a.all += dt / 1000;
		if (engine.test(leaf.callFrame.url)) a.engine += dt / 1000;
		agg.set(f, a);
	});
	const rows = [...agg].sort((a, b) => b[1].engine - a[1].engine), pc = (v) => `${((100 * v) / total).toFixed(1).padStart(4)}%`;
	console.log(`${total.toFixed(0)} ms after ${fromS} s; engine work under game procs ${pc(rows.reduce((s, r) => s + r[1].engine, 0))}`);
	for (const [f, a] of rows.slice(0, byFile)) console.log(`engine ${pc(a.engine)}  all ${pc(a.all)}  ${f}`);
	process.exit(0);
}
const tot = (t) => (t.incl = t.self + [...t.kids.values()].reduce((a, k) => a + tot(k), 0));
tot(root);
if (flat) {
	const top = (mp) => [...mp].sort((a, b) => b[1] - a[1]).slice(0, flat).map(([k, v]) => `${v.toFixed(1).padStart(8)}  ${k}`).join("\n");
	console.log(`-- inclusive ms --\n${top(flatIncl)}\n-- self ms (with engine work it calls) --\n${top(flatSelf)}`);
} else {
	(function show(t, lvl) {
		console.log(`${"  ".repeat(lvl)}${t.incl.toFixed(1)} (self ${t.self.toFixed(1)}) ${t.l}`);
		if (lvl >= depth) return;
		for (const k of [...t.kids.values()].filter((k) => k.incl >= min).sort((a, b) => b.incl - a.incl)) show(k, lvl + 1);
	})(root, 0);
}
