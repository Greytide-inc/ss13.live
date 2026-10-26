// old-garbage - Run a headless boot and sample which code makes long-lived garbage (objects that outlive a minor GC, then die).
// Usage (from web/, after npm run build): node --max-old-space-size=3072 tools/old-garbage.mjs [--from RE] [--top N] [--pretenure] -- BOOT ARGS...
//   e.g. tools/old-garbage.mjs -- --ticks 1000000 --after-start 300 --connect LocalPlayer --join AI --log build/og/boot.log --data-out build/og/data
// The boot runs unpaced (game time flies). Starts V8's sampling heap profiler at the first boot log line matching RE (default
// "joining as": the player joins), until the boot stops; rates are per game minute. Keeps objects a major GC freed but not
// the ones that died young: that is what fills the old heap and sets off Firefox's whole-heap worker GC (plans: solo freezes).
// Prints the top N game procs by sampled bytes (the innermost game proc on the stack, then any game proc on it) and writes
// build/old-garbage.heapprofile (loads in Chrome devtools).
import { Session } from "node:inspector";
import fs, { readFileSync, writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { setFlagsFromString } from "node:v8";
const argv = process.argv.slice(2), cut = argv.indexOf("--");
const own = cut < 0 ? argv : argv.slice(0, cut), bootArgs = cut < 0 ? [] : argv.slice(cut + 1);
const opt = (n, d) => (own.includes(n) ? own[own.indexOf(n) + 1] : d);
const from = new RegExp(opt("--from", "joining as")), top = Number(opt("--top", "30"));
// Firefox-like: V8 puts objects from allocation sites that mostly survive straight into the old heap (the VM's shared
// object constructors: atmos temporaries then showed as old garbage), while ~90% of Firefox's worker old-heap growth
// is promotion from the young heap (2026-10-25 profile). --pretenure keeps V8's default.
if (!own.includes("--pretenure")) setFlagsFromString("--no-allocation-site-pretenuring");
const s = new Session();
s.connect();
const post = (m, p = {}) => { let out, err; s.post(m, p, (e, r) => { err = e; out = r; }); if (err) throw err; return out; }; // in-process sessions answer synchronously
let started = 0, t0 = 0, t1 = 0;
const write = fs.writeSync;
fs.writeSync = (fd, data, ...rest) => { // boot.ts logs with writeSync: watch its lines for the start mark and world.time
	if (typeof data === "string") {
		const t = /world\.time (\d+(?:\.\d+)?)/.exec(data);
		if (t) t1 = Number(t[1]);
		if (!started && from.test(data)) { post("HeapProfiler.enable"); post("HeapProfiler.startSampling", { samplingInterval: 16384, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: false }); started = Date.now(); t0 = t1; write(1, `[old-garbage] sampling from world.time ${t0}\n`); }
	}
	return write(fd, data, ...rest);
};
syncBuiltinESMExports();
process.on("exit", () => {
	if (!started) return console.log("[old-garbage] the boot ended before sampling started");
	const { profile } = post("HeapProfiler.getSamplingProfile");
	post("HeapProfiler.stopSampling");
	writeFileSync("build/old-garbage.heapprofile", JSON.stringify(profile));
	const mins = (t1 - t0) / 600, inner = new Map(), any = new Map();
	const src = readFileSync("build/translated-tg.js", "utf8").split("\n"), procAt = new Map();
	const proc = (line) => { // the rt.def at or above a line of the bundle
		if (!procAt.has(line)) { let l = line, m = null; while (l > 0 && !(m = /rt\.def\("([^"]+)"/.exec(src[l - 1]))) l--; procAt.set(line, m ? m[1] : "?"); }
		return procAt.get(line);
	};
	let all = 0;
	const walk = (n, stack) => {
		const c = n.callFrame, st = c.url.endsWith("translated-tg.js") ? [...stack, proc(c.lineNumber + 1)] : stack;
		if (n.selfSize) {
			all += n.selfSize;
			const k = st.at(-1) ?? "(no game proc)";
			inner.set(k, (inner.get(k) ?? 0) + n.selfSize);
			for (const p of new Set(st)) any.set(p, (any.get(p) ?? 0) + n.selfSize);
		}
		for (const ch of n.children) walk(ch, st);
	};
	walk(profile.head, []);
	const mb = (b) => (b / 1e6).toFixed(1).padStart(7);
	console.log(`[old-garbage] ${mb(all)} MB sampled over ${mins.toFixed(1)} game minutes (${(all / 1e6 / mins).toFixed(1)} MB a game minute; live objects at the end included)`);
	console.log("MB, innermost game proc:"); for (const [k, v] of [...inner].sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(`${mb(v)}  ${k}`);
	console.log("MB, any game proc on the stack:"); for (const [k, v] of [...any].sort((a, b) => b[1] - a[1]).slice(0, top)) console.log(`${mb(v)}  ${k}`);
});
process.argv = [process.argv[0], "boot.js", ...bootArgs];
await import("../build/dist/src/tools/boot.js");
