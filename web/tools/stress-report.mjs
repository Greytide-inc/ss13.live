// stress-report - Reads the file boot.js --stress-log FILE wrote (FILE = per-tick JSON lines, FILE.cpuprofile) and prints the stutter plan's step-1 answers.
// Usage: node tools/stress-report.mjs FILE [--slow MS=100]   (needs build/translated-tg.js to name the DM procs)
import { readFileSync, existsSync } from "node:fs";
const argv = process.argv.slice(2), si = argv.indexOf("--slow"), SLOW = si >= 0 ? Number(argv.splice(si, 2)[1]) : 100;
const file = argv[0];
const src = readFileSync(new URL("../build/translated-tg.js", import.meta.url), "utf8").split("\n");
const procAt = (ln) => { for (let i = Math.min(ln, src.length) - 1; i >= 0 && i > ln - 4000; i--) { const m = /^\/\/ (\S+)\s+\((.*?)\)/.exec(src[i]); if (m) return `${m[1]} (${m[2].replace(/^code\//, "")})`; } return `translated-tg.js:${ln}`; };
const lines = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const sum = lines.pop();
const T = lines, ms = T.map((r) => r.ms).sort((a, b) => a - b), pct = (p) => ms[Math.min(ms.length - 1, Math.floor(ms.length * p))];
const slow = T.filter((r) => r.ms > SLOW), tot = T.reduce((a, r) => a + r.ms, 0);
console.log(`== ticks: ${T.length} (world ${(T.length / 20).toFixed(0)} s); total ${(tot / 1000).toFixed(1)} s of tick time, mean ${(tot / T.length).toFixed(1)} ms, p50 ${pct(0.5).toFixed(1)}, p95 ${pct(0.95).toFixed(1)}, p99 ${pct(0.99).toFixed(1)}, max ${ms[ms.length - 1].toFixed(0)} ms`);
console.log(`   over 50 ms: ${T.filter((r) => r.ms > 50).length}; over ${SLOW} ms: ${slow.length} (${slow.reduce((a, r) => a + r.ms, 0).toFixed(0)} ms in them); over 500 ms: ${T.filter((r) => r.ms > 500).length}; over 1000 ms: ${T.filter((r) => r.ms > 1000).length}`);
let runs = [], cur = [];
for (const r of T) { if (r.ms > 50) cur.push(r); else { if (cur.length) runs.push(cur); cur = []; } }
if (cur.length) runs.push(cur);
const runMs = runs.map((c) => c.reduce((a, r) => a + r.ms, 0)).sort((a, b) => b - a);
console.log(`   unbroken stretches of ticks over 50 ms: ${runs.length}, longest ${Math.max(0, ...runs.map((c) => c.length))} ticks; longest total ${(runMs[0] ?? 0).toFixed(0)} ms`);
const last = T[T.length - 1], maxLag = Math.max(...T.map((r) => r.lag));
console.log(`   modelled world-behind-wall (a tick over 50 ms pushes the world back, idle ticks don't give it back... see lag in the jsonl): max ${maxLag.toFixed(0)} ms, at the end ${last.lag.toFixed(0)} ms; headless raw (world ms minus wall ms, negative = headless ran ahead) at the end ${last.wallBehind} ms`);
const sp = T.find((r) => r.stepMs > 5) ?? T[100];
console.log(`== spawn tick (script tick ${sp.tick}): ${sp.ms} ms, of which the script's own actions ${sp.stepMs} ms; ${sp.threads} threads resumed, los ${sp.los} calls ${sp.losMs} ms, gc ${sp.gcMs} ms`);
console.log(`== 8 longest ticks`);
for (const r of [...T].sort((a, b) => b.ms - a.ms).slice(0, 8)) console.log(`   tick ${r.tick} (world ${r.wtime}) ${r.ms} ms: threads ${r.threads}, los ${r.los} calls/${r.losMs} ms, gc ${r.gcMs} ms ${r.gcKinds ?? ""}, tick_usage reads ${r.uReads} (>=80%: ${r.uHi}, >=100%: ${r.uOver}, max ${r.uMax}%), sleeping ${r.sleeping}`);
const gc = (a) => a.reduce((x, r) => x + r.gcMs, 0);
console.log(`== GC: ${gc(T).toFixed(0)} ms over the run (${(100 * gc(T) / tot).toFixed(1)}% of tick time), ${gc(slow).toFixed(0)} ms inside the ${slow.length} slow ticks (${slow.length ? (100 * gc(slow) / slow.reduce((a, r) => a + r.ms, 0)).toFixed(1) : 0}% of them); worst single tick ${Math.max(...T.map((r) => r.gcMs)).toFixed(1)} ms`);
const over = T.filter((r) => r.uOver > 0);
console.log(`== TICK_CHECK: tick_usage was read ${T.reduce((a, r) => a + r.uReads, 0)} times; ticks where a read was >=80%: ${T.filter((r) => r.uHi > 0).length}, >=100%: ${over.length}; slow ticks with a read >=100%: ${slow.filter((r) => r.uOver > 0).length}/${slow.length}; ticks over 50 ms with NO read >=80%: ${T.filter((r) => r.ms > 50 && r.uHi === 0).length}`);
const key = (k) => { const m = k.split(" | dm@"); const dm = (m[1] ?? "").split(",").filter(Boolean).map((l) => procAt(Number(l))); return `${m[0].slice(0, 50)}  <-  ${dm[0] ?? "?"}  <-  ${dm[1] ?? "?"}`; };
for (const [name, tab] of [["whole run", sum.losAll], ["slow ticks only", sum.losSlow]]) {
	const rows = Object.entries(tab), n = rows.reduce((a, [, v]) => a + v[0], 0), t = rows.reduce((a, [, v]) => a + v[1], 0);
	console.log(`== computeLos callers, ${name}: ${n} calls, ${t.toFixed(0)} ms in computeLos`);
	for (const [k, v] of rows.sort((a, b) => b[1][1] - a[1][1]).slice(0, 6)) console.log(`   ${String(v[0]).padStart(6)} calls ${v[1].toFixed(1).padStart(8)} ms  ${k.startsWith("client-view") ? k : key(k)}`);
}
const pf = file + ".cpuprofile";
if (existsSync(pf)) {
	const p = JSON.parse(readFileSync(pf, "utf8")), byId = new Map(p.nodes.map((n) => [n.id, n])), parent = new Map();
	for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
	const labelOf = new Map(), lab = (n) => { let l = labelOf.get(n.id); if (l === undefined) { const cf = n.callFrame; l = null; if (cf.url.endsWith("translated-tg.js")) l = procAt(cf.lineNumber + 1); labelOf.set(n.id, l); } return l; };
	// stack of DM labels, outermost first, for a node
	const stackOf = new Map(), stack = (id) => { let s = stackOf.get(id); if (s) return s; const n = byId.get(id), up = parent.get(id) === undefined ? [] : stack(parent.get(id)), l = lab(n); s = l ? [...up, l] : up; stackOf.set(id, s); return s; };
	let t = p.startTime / 1000; const times = p.samples.map((id, i) => (t += (p.timeDeltas[i] ?? 0) / 1000)), base = times[times.length - 1] - (T[T.length - 1].t + T[T.length - 1].ms); // aligned by the end of the run (the profile's first sample comes ~0.9 s after its startTime)
	const dt = new Float64Array(p.samples.length); p.samples.forEach((_, i) => (dt[i] = (p.timeDeltas[i + 1] ?? p.timeDeltas[i] ?? 0) / 1000));
	const win = (rs) => { const ws = rs.map((r) => [r.t + base, r.t + base + r.ms]); let j = 0; const out = []; for (let i = 0; i < times.length; i++) { while (j < ws.length && ws[j][1] < times[i]) j++; if (j < ws.length && times[i] >= ws[j][0]) out.push(i); } return out; };
	const SS = /subsystem\/(\w+)\/proc\/fire/;
	const analyse = (name, rs) => {
		const idx = win(rs); const incl = new Map(), self = new Map(), ss = new Map(); let mc = 0, other = 0, all = 0; const roots = new Map();
		for (const i of idx) {
			const d = dt[i], st = stack(p.samples[i]); all += d;
			if (st.some((l) => /controller\/(master|subsystem)/.test(l))) mc += d; else other += d;
			for (const l of new Set(st)) incl.set(l, (incl.get(l) ?? 0) + d);
			if (st.length) self.set(st[st.length - 1], (self.get(st[st.length - 1]) ?? 0) + d);
			const f = st.find((l) => SS.test(l)); if (f) ss.set(SS.exec(f)[1], (ss.get(SS.exec(f)[1]) ?? 0) + d);
			const r0 = st[0] ?? "(no DM frame: engine only)"; roots.set(r0, (roots.get(r0) ?? 0) + d);
		}
		const top = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `     ${v.toFixed(0).padStart(7)} ms  ${k}`).join("\n");
		console.log(`== profile, ${name}: ${rs.length} ticks, ${all.toFixed(0)} ms sampled; with a controller/subsystem frame on the stack (MC work) ${mc.toFixed(0)} ms, without (sleep/spawn threads, verbs, engine) ${other.toFixed(0)} ms`);
		console.log(`   per subsystem fire (inclusive):\n${top(ss, 8)}\n   thread roots (the first DM proc on the stack = what the resumed thread was running):\n${top(roots, 8)}\n   top procs, inclusive:\n${top(incl, 14)}\n   top procs, self (with engine work they call):\n${top(self, 10)}`);
	};
	analyse(`slow ticks (>${SLOW} ms)`, slow);
	analyse("the spawn tick", [sp]);
	analyse("all ticks", T);
}
