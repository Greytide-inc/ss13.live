// baseline-table - Turns resource-baseline.mjs's JSON files into the markdown tables of plans/resource-baseline.md.
// Usage (from web/): node tools/baseline-table.mjs build/baseline/desktop-solo.json build/baseline/desktop-creative.json
import { readFileSync } from "node:fs";
const f = (x, d = 0) => (x == null || Number.isNaN(x) ? "-" : x.toFixed(d));
const files = process.argv.slice(2).map((p) => JSON.parse(readFileSync(p, "utf8")));
const label = { solo: "Singleplayer", creative: "Creative" }, cases = ["idle", "typical", "stress"];
console.log("| Mode | Case | CPU total % | game thread % | page thread % | page ms/frame | game views /s | redraws /s | FPS avg | frame p99 ms | worst frame ms | frames >50 ms | RAM MB | RAM peak so far MB |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const r of files) for (const c of cases) {
	const p = r.phases[c]; if (!p) continue;
	console.log(`| ${label[r.mode]} | ${c} | ${f(p.cpuTotalPct)} | ${f(p.cpuGameWorkerPct)} | ${f(p.cpuPageMainThreadPct)} | ${f(p.pageMsPerFrame, 2)} | ${f(p.viewUpdatesPerSec, 1)} | ${f(p.redrawsPerSec)} | ${f(1000 / p.frames.avg)} | ${f(p.frames.p99, 1)} | ${f(p.frames.max)} | ${p.frames.over50} | ${p.memory.totalMB} | ${p.peakSoFarMB} |`);
}
console.log("\n| Mode | First view s | Joined s | Download MB (raw) | Download MB (gzip) | Files | RAM at load MB | RAM at 10 min MB | RAM peak MB | Biggest process peak MB |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const r of files) { const l = r.load, m = r.memory; console.log(`| ${label[r.mode]} | ${f(l.firstViewS, 1)} | ${f(l.joinedS, 1)} | ${f(l.bytesRaw / 1e6, 1)} | ${f(l.bytesGzip / 1e6, 1)} | ${l.files} | ${m.atPlayable.totalMB} | ${m.after10min?.totalMB ?? "-"} | ${m.peakTotalMB ?? "-"} | ${m.peakBiggestProcessMB ?? "-"} |`); }
for (const r of files) if (r.error) console.log(`\n${label[r.mode]} FAILED: ${r.error.split("\n")[0]}`);
