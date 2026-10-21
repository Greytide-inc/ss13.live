// cpuprofile-top - Print where a .cpuprofile's time went: top functions by self time, and total time per script file.
// Usage: node tools/cpuprofile-top.mjs FILE.cpuprofile [N] [--from SEC]   (lat1; --from skips the first SEC seconds, e.g. a snapshot load)
import { readFileSync } from "node:fs";
const argv = process.argv.slice(2), fi = argv.indexOf("--from"), from = fi >= 0 ? Number(argv.splice(fi, 2)[1]) * 1e6 : 0;
const p = JSON.parse(readFileSync(argv[0], "utf8")), N = Number(argv[1] ?? 25);
const byId = new Map(p.nodes.map((n) => [n.id, n])), self = new Map();
const dt = p.timeDeltas;
let t = 0, total = 0;
p.samples.forEach((id, i) => {
	t += dt[i] ?? 0;
	if (t < from) return;
	self.set(id, (self.get(id) ?? 0) + (dt[i] ?? 0) / 1000);
	total += (dt[i] ?? 0) / 1000;
});
const fn = new Map(), file = new Map();
for (const [id, ms] of self) {
	const cf = byId.get(id).callFrame, f = cf.url.split("/").slice(-2).join("/");
	const k = `${cf.functionName || "(anon)"} ${f}:${cf.lineNumber + 1}`;
	fn.set(k, (fn.get(k) ?? 0) + ms);
	file.set(f || cf.functionName, (file.get(f || cf.functionName) ?? 0) + ms);
}
const show = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, ms]) => `${ms.toFixed(0).padStart(7)} ms ${((100 * ms) / total).toFixed(1).padStart(5)}%  ${k}`).join("\n");
console.log(`${total.toFixed(0)} ms profiled${from ? ` (from ${from / 1e6} s)` : ""}\n-- by file --\n${show(file, 12)}\n-- by function (self) --\n${show(fn, N)}`);
