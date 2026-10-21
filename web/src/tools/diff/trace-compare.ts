// diff-trace - compares two detail-mode traces (PREFIX.trace from boot.ts --diff --diff-trace FROM-TO) and names the
// first differing RNG draw (its caller: proc path + source line) or DM proc entry (proc + hash of src and args).
//   node build/dist/src/tools/diff/trace-compare.js A.trace B.trace [--context N]
//   node build/dist/src/tools/diff/trace-compare.js A.trace --ids [--upto TICK]   proc ids entered (for DIFF_TR_SKIP/ONLY bisects)
// Exit 0 = identical, 1 = differ, 2 = usage.
import { existsSync, readFileSync } from "node:fs";

const argv = process.argv.slice(2);
const files = argv.filter((x, i) => !x.startsWith("--") && !(i > 0 && (argv[i - 1] === "--context" || argv[i - 1] === "--upto")));
const opt = (k: string, d: number) => { const i = argv.indexOf(k); return i >= 0 ? Number(argv[i + 1]) : d; };
const read = (p: string): string[] => {
	const f = p.endsWith(".trace") ? p : p + ".trace";
	if (!existsSync(f)) { console.error(`missing ${f}`); process.exit(2); }
	return readFileSync(f, "utf8").split("\n").filter((l) => l !== "" && !l.startsWith("#"));
};

if (argv.includes("--ids")) {
	if (!files[0]) { console.error("usage: trace-compare A.trace --ids [--upto TICK]"); process.exit(2); }
	const upto = opt("--upto", Infinity);
	const ids = new Set<number>();
	for (const l of read(files[0])) { const f = l.split("\t"); if (f[1] === "E" && Number(f[0]) <= upto) ids.add(Number(f[2])); }
	console.log([...ids].sort((a, b) => a - b).join(","));
	process.exit(0);
}

const [a, b] = files;
if (!a || !b) { console.error("usage: trace-compare A.trace B.trace [--context N]"); process.exit(2); }
const ta = read(a), tb = read(b);
const n = Math.min(ta.length, tb.length);
let bad = -1;
// Source lines aren't compared (shown only): a translated frame knows its statement's first offset (f.at), the VM its current
// instruction's, and macro-expanded statements map those to different lines (MC Loop's REALTIMEOFDAY: master.dm 269 vs 278).
const key = (l: string): string => { const f = l.split("\t"); if (f[1] === "R") f.length = 4; else if (f[1] === "E") f.length = 6; return f.join("\t"); };
for (let i = 0; i < n; i++) if (ta[i] !== tb[i] && key(ta[i]) !== key(tb[i])) { bad = i; break; }
const draws = (t: string[]) => t.filter((l) => l.split("\t")[1] === "R").length;
if (bad < 0) {
	if (ta.length === tb.length) {
		let lines = 0;
		for (let i = 0; i < n; i++) if (ta[i] !== tb[i]) lines++;
		console.log(`diff-trace: identical, ${ta.length} lines (${draws(ta)} draws)${lines ? `; ${lines} differ only in a source line` : ""}`);
		process.exit(0);
	}
	bad = n;
	console.log(`diff-trace: first ${n} lines identical, then A has ${ta.length} and B has ${tb.length}`);
}
const show = (l: string | undefined): string => {
	if (l === undefined) return "(end of trace)";
	const f = l.split("\t");
	return f[1] === "R" ? `tick ${f[0]} RNG draw #${f[2]} from ${f[3]} (${f[4]})` : f[1] === "E" ? `tick ${f[0]} enter ${f[3]} [proc id ${f[2]}] args ${f[4]}, called from ${f[5]} (${f[6]})` : l;
};
console.log(`diff-trace: first difference at trace line ${bad + 1}:`);
console.log(`  A: ${show(ta[bad])}`);
console.log(`  B: ${show(tb[bad])}`);
// The culprit is usually the last proc entered before the split (its maths or branch differs) or the proc that drew.
let lastE = "";
for (let i = bad - 1; i >= 0 && !lastE; i--) if (ta[i].split("\t")[1] === "E") lastE = show(ta[i]);
if (lastE) console.log(`  last proc entered before it (both): ${lastE}`);
const ctx = opt("--context", 8);
console.log(`--- the ${ctx} lines before (same in both):`);
for (const l of ta.slice(Math.max(0, bad - ctx), bad)) console.log("  " + show(l));
for (const [name, t] of [["A", ta], ["B", tb]] as const) {
	console.log(`--- ${name} from the split:`);
	for (const l of t.slice(bad, bad + ctx)) console.log("  " + show(l));
}
process.exit(1);
