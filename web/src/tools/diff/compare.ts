// diff-compare - Compares two diaries (PREFIX.diary from boot.ts --diff): the first differing tick and field, the
// side-file lines (log, runtimes, what players were sent) that differ in that tick, and then, from the first state
// check at or after it, where the two worlds differ (state-compare.ts). Exit 0 = identical.
//   node --max-old-space-size=4096 build/dist/src/tools/diff/compare.js A B [--max N]   (A, B: the diary prefix or the .diary file)
import { existsSync, readFileSync } from "node:fs";
import { compareStates } from "./state-compare.js";

const FIELDS = ["tick", "world.time", "rng draws", "rng state", "objects created", "sleeping threads", "log hash"];
const FP_FIELDS = ["marker", "tick", "state hash", "objects", "lists"];

const mi = process.argv.indexOf("--max"), max = mi > 0 ? Number(process.argv[mi + 1]) : 4; // records shown per kind
const [a, b] = process.argv.slice(2).filter((x, i, all) => !x.startsWith("--") && all[i - 1] !== "--max");
if (!a || !b) { console.error("usage: diff-compare A B (diary prefixes)"); process.exit(2); }
const pre = (p: string) => p.replace(/\.diary(\.log)?$/, "");
const read = (p: string, ext: string): string[] => {
	const f = pre(p) + ext;
	if (!existsSync(f)) { console.error(`missing ${f}`); process.exit(2); }
	const t = readFileSync(f, "utf8");
	return t === "" ? [] : t.replace(/\n$/, "").split("\n");
};
const da = read(a, ".diary").filter((l) => !l.startsWith("#"));
const db = read(b, ".diary").filter((l) => !l.startsWith("#"));
const ta = read(a, ".diary.log");
const tb = read(b, ".diary.log");

const n = Math.min(da.length, db.length);
let bad = -1;
for (let i = 0; i < n; i++) if (da[i] !== db[i]) { bad = i; break; }

if (bad < 0) {
	if (da.length === db.length) {
		console.log(`diff-compare: identical, ${da.length} diary lines (${da.filter((l) => l.startsWith("F\t")).length} fingerprints)`);
		process.exit(0);
	}
	console.log(`diff-compare: first ${n} lines identical, but A has ${da.length} and B has ${db.length}`);
	process.exit(1);
}

const fa = da[bad].split("\t"), fb = db[bad].split("\t");
const isF = fa[0] === "F" || fb[0] === "F";
const names = isF ? FP_FIELDS : FIELDS;
const tick = isF ? fa[1] ?? fb[1] : fa[0];
console.log(`diff-compare: first difference at diary line ${bad + 1}, tick ${tick}`);
for (let i = 0; i < Math.max(fa.length, fb.length); i++)
	if (fa[i] !== fb[i]) console.log(`  field "${names[i] ?? i}": A ${fa[i]}  B ${fb[i]}`);
if (!isF && fa[4] !== fb[4]) console.log("  (objects are numbered in creation order: every object made after this differs in number, so the state below differs wherever one is named)");
if (!isF) {
	// A diary line is the end of its tick, so the cause is in this tick's lines: those only one side has.
	const at = (lines: string[]) => lines.filter((l) => l.slice(0, l.indexOf("\t")) === tick).map((l) => l.slice(l.indexOf("\t") + 1));
	const la = at(ta), lb = at(tb), only = (x: string[], y: string[]) => { const c = new Map<string, number>(); for (const l of y) c.set(l, (c.get(l) ?? 0) + 1); return x.filter((l) => { const n = c.get(l) ?? 0; if (n) c.set(l, n - 1); return !n; }); };
	for (const [name, sel] of [["A", only(la, lb)], ["B", only(lb, la)]] as const) {
		console.log(`--- only in ${name} at tick ${tick} (${sel.length} of ${name === "A" ? la.length : lb.length} lines):`);
		for (const l of sel.slice(0, 20)) console.log("  " + l.slice(0, 300));
	}
}
// The state at the first check at or after the difference (B stops there with --diff-ref).
const checks = (d: string[]) => new Map(d.filter((l) => l.startsWith("F\t")).map((l) => [Number(l.split("\t")[1]), l]));
const ca = checks(da), cb = checks(db);
const t0 = Number(tick);
const ct = [...ca.keys()].filter((t) => t >= t0 && cb.has(t)).sort((x, y) => x - y)[0];
if (ct === undefined) console.log("(no state check at or after it in both runs)");
else {
	const sa = `${pre(a)}.state/${ct}.gz`, sb = `${pre(b)}.state/${ct}.gz`;
	if (ca.get(ct) === cb.get(ct)) console.log(`state at the check at tick ${ct}: identical`);
	else if (!existsSync(sa) || !existsSync(sb)) console.log(`state at tick ${ct} differs; dump missing: ${!existsSync(sa) ? sa : sb}`);
	else { console.log(`--- state at tick ${ct}:`); compareStates(sa, sb, max); }
}
process.exit(1);
