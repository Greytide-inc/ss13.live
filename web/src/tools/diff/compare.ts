// diff-compare - Compares two diaries (PREFIX.diary from boot.ts --diff): the first differing tick and field, plus the
// side-file log lines around it from both runs. Exit 0 = identical.
//   npm run diff-compare -- A B      (A, B: the diary prefix or the .diary file)
import { existsSync, readFileSync } from "node:fs";

const FIELDS = ["tick", "world.time", "rng draws", "rng state", "objects created", "sleeping threads", "log hash"];
const FP_FIELDS = ["marker", "tick", "world hash", "mob hash"];

const [a, b] = process.argv.slice(2).filter((x) => !x.startsWith("--"));
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
if (!isF) {
	// A diary line is the end of its tick, so the cause is in this tick's lines; previous tick is shown for context.
	const prevTick = bad > 0 ? da[bad - 1].split("\t")[0] : "";
	const near = (lines: string[]) => lines.filter((l) => { const t = l.split("\t")[0]; return t === tick || (prevTick !== "" && t === prevTick && !prevTick.startsWith("F")); });
	for (const [name, lines] of [["A", ta], ["B", tb]] as const) {
		const sel = near(lines);
		console.log(`--- ${name} log/runtime lines at ticks ${prevTick}..${tick} (${sel.length}):`);
		for (const l of sel.slice(0, 40)) console.log("  " + l.slice(0, 300));
	}
} else {
	console.log("  (a fingerprint differs: the earlier per-tick lines matched, so state diverged without a counted draw/log; check the F line's tick against the previous one)");
}
process.exit(1);
