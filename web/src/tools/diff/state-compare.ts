// dt-diff: where two state dumps (state.ts, PREFIX.state/TICK.gz) differ: header fields, globals, sleepers and
// objects (by number, with their place on the map or what holds them, and each var that differs, shown around its
// first differing character: lists are written inside their holder's record). compare.ts calls it; alone:
//   node --max-old-space-size=4096 build/dist/src/tools/diff/state-compare.js A.gz B.gz [--max N]
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const SECTIONS = "HTGSO";
const NAMES: Record<string, string> = { H: "header", T: "type defaults", G: "global", S: "sleeping proc", O: "object" };

const load = (f: string): string[] => { const t = gunzipSync(readFileSync(f)).toString("utf8"); return t === "" ? [] : t.replace(/\n$/, "").split("\n"); };
/** A record's place in the dump's order: section, then key. */
const rank = (l: string): number => { const t = l.indexOf("\t"), u = l.indexOf("\t", t + 1); return SECTIONS.indexOf(l[0]) * 1e12 + Number(l.slice(t + 1, u < 0 ? undefined : u)); };
/** A record's named fields: an object's k=v after the type (atoms' @x,y,z as "@"), a global's value as "value". */
const fields = (l: string): Map<string, string> => {
	const m = new Map<string, string>(), f = l.split("\t");
	if (l[0] !== "O") { m.set("value", f.slice(l[0] === "G" ? 3 : 2).join("\t")); return m; }
	for (let i = 3; i < f.length; i++) { const e = f[i].indexOf("="); if (f[i][0] === "@") m.set("@", f[i]); else m.set(f[i].slice(0, e), f[i].slice(e + 1)); }
	return m;
};
/** A and B around their first differing character. */
const around = (a: string | undefined, b: string | undefined): string => {
	if (a === undefined || b === undefined) return `A ${a === undefined ? "(default)" : a.slice(0, 120)}  B ${b === undefined ? "(default)" : b.slice(0, 120)}`;
	let k = 0;
	while (k < a.length && k < b.length && a[k] === b[k]) k++;
	const from = Math.max(0, k - 40), part = (s: string) => (from > 0 ? "..." : "") + s.slice(from, k + 80) + (s.length > k + 80 ? "..." : "");
	return `A ${part(a)}  B ${part(b)}`;
};

/** Prints where A and B differ (at most `max` records of each kind in detail); returns how many records differ. */
export function compareStates(fa: string, fb: string, max = 4): number {
	const A = load(fa), B = load(fb);
	// Where an object is, from A's records: an atom's turf (through locs); for a datum, the record and var holding it.
	const objA = new Map<number, string>();
	for (const l of A) if (l[0] === "O") objA.set(Number(l.slice(2, l.indexOf("\t", 2))), l);
	const holder = (id: number): string => {
		const re = new RegExp(`(^|[=\\[ ,(\\t>])#${id}([\\t,\\]=) ]|$)`), self = `O\t${id}\t`;
		for (const l of A) if (re.test(l) && !l.startsWith(self)) {
			const f = l.split("\t");
			if (l[0] === "G") return `global ${f[2]}`;
			if (l[0] !== "O") return `${NAMES[l[0]]} ${f[1]}`;
			const k = [...fields(l)].find(([, v]) => re.test("=" + v))?.[0];
			return `#${f[1]} ${f[2]}${k ? "." + k : ""}`;
		}
		return "nothing";
	};
	const where = (id: number): string => {
		const l0 = objA.get(id);
		if (l0 === undefined) return "";
		if (!fields(l0).has("loc")) return ` (held by ${holder(id)})`;
		for (let d = 0, cur = id; d < 10; d++) {
			const fs = fields(objA.get(cur) ?? ""), at = fs.get("@");
			if (at) return " " + at;
			const loc = fs.get("loc");
			if (!loc || loc[0] !== "#") return d === 0 ? " (nullspace)" : ` (in #${cur}, nullspace)`;
			cur = Number(loc.slice(1));
		}
		return "";
	};
	const counts = new Map<string, number>(), byType = new Map<string, number>();
	const shown = new Map<string, string[]>();
	let total = 0;
	const note = (kind: string, text: () => string, type?: string) => { // text only for the ones shown (finding a holder scans the dump)
		total++;
		counts.set(kind, (counts.get(kind) ?? 0) + 1);
		if (type) byType.set(type, (byType.get(type) ?? 0) + 1);
		const sh = shown.get(kind) ?? [];
		shown.set(kind, sh);
		if (sh.length < max) sh.push(text());
	};
	let i = 0, j = 0;
	while (i < A.length || j < B.length) {
		const a = i < A.length ? A[i] : null, b = j < B.length ? B[j] : null;
		const ra = a !== null ? rank(a) : Infinity, rb = b !== null ? rank(b) : Infinity;
		if (ra === rb) {
			i++; j++;
			if (a === b) continue;
			const s = a![0], fa = a!.split("\t"), fb = b!.split("\t");
			if (s === "O" && fa[2] !== fb[2]) { note(s, () => `object #${fa[1]}: type A ${fa[2]}  B ${fb[2]}`, fa[2]); continue; }
			const ma = fields(a!), mb = fields(b!), d: string[] = [];
			for (const k of new Set([...ma.keys(), ...mb.keys()])) if (ma.get(k) !== mb.get(k)) d.push(`${k}: ${around(ma.get(k), mb.get(k))}`);
			if (s === "O") note(s, () => `object #${fa[1]} ${fa[2]}${where(Number(fa[1]))}\n      ${d.join("\n      ")}`, fa[2]);
			else note(s, () => `${NAMES[s]} ${fa[1]}${s === "G" ? " " + fa[2] : ""}: ${d.join("; ")}`);
		} else if (ra < rb) { i++; const f = a!.split("\t"); note(a![0], () => `only in A: ${NAMES[a![0]]} ${f[1]} ${f.slice(2).join(" ").slice(0, 160)}`, a![0] === "O" ? f[2] : undefined); }
		else { j++; const f = b!.split("\t"); note(b![0], () => `only in B: ${NAMES[b![0]]} ${f[1]} ${f.slice(2).join(" ").slice(0, 160)}`, b![0] === "O" ? f[2] : undefined); }
	}
	if (!total) { console.log(`state: identical (${A.length} records)`); return 0; }
	console.log(`state: ${total} records differ: ${[...counts].map(([k, n]) => `${NAMES[k]} ${n}`).join(", ")}`);
	if (byType.size) console.log(`  objects by type: ${[...byType].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([t, n]) => `${t} ${n}`).join(", ")}`);
	for (const k of SECTIONS) {
		const sh = shown.get(k);
		if (!sh) continue;
		for (const t of sh) console.log("  " + t);
		if (counts.get(k)! > sh.length) console.log(`  ... ${counts.get(k)! - sh.length} more ${NAMES[k]} records`);
	}
	return total;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	const [a, b] = process.argv.slice(2).filter((x, i, all) => !x.startsWith("--") && all[i - 1] !== "--max");
	if (!a || !b) { console.error("usage: state-compare A.gz B.gz [--max N]"); process.exit(2); }
	const mi = process.argv.indexOf("--max");
	process.exit(compareStates(a, b, mi > 0 ? Number(process.argv[mi + 1]) : 4) ? 1 : 0);
}
