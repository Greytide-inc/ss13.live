// snapshot-diff - Compare two world snapshots object by object (snapshot fidelity check).
// Usage (from web/): node build/dist/src/tools/snapshot-diff.js A.snap B.snap [--max N]
// Save a snapshot, load it and save again at once (boot --snapshot-load A --seed keep --snapshot-save B
// --snapshot-exit): every difference is something the load didn't reproduce. Prints the first --max
// (default 40) differing objects with the differing keys, and a count by class.
import { readFileSync } from "node:fs";
import { snapshotObjects } from "../vm/snapshot.js";

const [fa, fb] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mi = process.argv.indexOf("--max");
const max = mi > 0 ? Number(process.argv[mi + 1]) : 40;
const A = snapshotObjects(readFileSync(fa));
const B = snapshotObjects(readFileSync(fb));
let shown = 0, total = 0, count = 0;
const byClass = new Map<string, number>();
for (;;) {
	const a = A.next(), b = B.next();
	if (a.done || b.done) {
		console.log(a.done && b.done ? `same object count (${count})` : `object count differs: ${a.done ? "A" : "B"} ended first at ${count}`);
		break;
	}
	count++;
	const x = a.value, y = b.value;
	const diffs: string[] = [];
	if (x.cls !== y.cls) diffs.push(`class ${x.cls} vs ${y.cls}`);
	else if ((x.keys ?? []).join() !== (y.keys ?? []).join()) diffs.push(`keys [${x.keys}] vs [${y.keys}]`);
	else if (x.vals.length !== y.vals.length) diffs.push(`${x.vals.length} vs ${y.vals.length} items`);
	else for (let i = 0; i < x.vals.length; i++) if (x.vals[i] !== y.vals[i]) diffs.push(`${x.keys ? x.keys[i] : `[${i}]`}: ${x.vals[i].slice(0, 80)} vs ${y.vals[i].slice(0, 80)}`);
	if (!diffs.length) continue;
	total++;
	byClass.set(x.cls, (byClass.get(x.cls) ?? 0) + 1);
	if (shown++ < max) console.log(`#${x.id} ${x.cls}${x.path !== null ? ` (vm${x.path})` : ""}: ${diffs.slice(0, 6).join("; ")}`);
}
console.log(`${total} objects differ${total ? `: ${[...byClass].map(([k, n]) => `${k} ${n}`).join(", ")}` : ""}`);
process.exit(total ? 1 : 0);
