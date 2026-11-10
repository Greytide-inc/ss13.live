// resource-baseline - How much of a computer solo play uses: load time + bytes, then CPU, RAM and frame times in three cases (idle, typical play, stress).
// Usage (from web/): node --experimental-websocket tools/resource-baseline.mjs --dist build/perf-dist --mode solo|creative --out build/baseline/NAME.json
//   [--idle 60] [--typical 540] [--stress 90] [--headed] [--fps 144] [--window 1280,720] [--ff-port P (drive a Firefox already running)]
// The player's-computer baseline (CPU, RAM, FPS, load). Serves --dist itself (counting bytes sent), starts Firefox with a fresh profile, runs the phases, writes JSON.
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { gzipSync } from "node:zlib";
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const dist = resolve(opt("--dist", "build/perf-dist")), mode = opt("--mode", "solo"), outFile = opt("--out", `build/baseline/${mode}.json`);
const T = { idle: Number(opt("--idle", "60")), typical: Number(opt("--typical", "540")), stress: Number(opt("--stress", "90")) };
const headed = argv.includes("--headed"), win = opt("--window", "1280,720"), fps = opt("--fps", "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const query = mode === "creative" ? "map=creative&join=Assistant" : "join=Assistant&roundstart=1";

// --- static server that counts bytes sent (raw, and what gzip would have sent: the real host compresses) ---
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".gif": "image/gif", ".ogg": "audio/ogg", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".gz": "application/gzip", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".wasm": "application/wasm", ".webp": "image/webp" };
const NOGZ = new Set([".png", ".gif", ".ogg", ".mp3", ".gz", ".woff2", ".woff", ".webp", ".wasm"]); // already compressed: gzip sends them as is
const gzCache = new Map();
const bytes = { raw: 0, gz: 0, files: 0, since: Date.now() };
const gzSize = (p, size) => { if (NOGZ.has(extname(p))) return size; if (!gzCache.has(p)) gzCache.set(p, gzipSync(readFileSync(p), { level: 6 }).length); return gzCache.get(p); };
const server = createServer((req, res) => {
	let p = normalize(join(dist, decodeURIComponent(new URL(req.url, "http://x").pathname)));
	if (!p.startsWith(dist)) { res.writeHead(403).end(); return; }
	if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
	if (!existsSync(p)) { res.writeHead(404).end(); return; }
	const size = statSync(p).size;
	bytes.raw += size; bytes.gz += gzSize(p, size); bytes.files++;
	res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream", "content-length": size, "cache-control": "no-store" });
	createReadStream(p).pipe(res);
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const WEB_PORT = server.address().port, FF_PORT = opt("--ff-port", "") || String(40000 + (process.pid % 20000));

// --- Firefox processes: CPU ticks and memory read from /proc ---
const prof = resolve(`build/ff-profile-${process.pid}`);
mkdirSync(prof, { recursive: true });
writeFileSync(`${prof}/user.js`, `${fps ? `user_pref("layout.frame_rate", ${Number(fps)});\n` : ""}user_pref("browser.shell.checkDefaultBrowser", false);\n`);
const ffArgs = [...(headed ? [] : ["--headless"]), "--no-remote", "--profile", prof, `--remote-debugging-port=${FF_PORT}`, `--window-size=${win}`];
const ff = spawn("/usr/bin/firefox", ffArgs, { stdio: "ignore", env: { ...process.env, ...(headed ? {} : { MOZ_HEADLESS: "1" }) } });
const HZ = 100; // clock ticks per second (getconf CLK_TCK)
const readStat = (path) => { try { const s = readFileSync(path, "utf8"), i = s.lastIndexOf(")"), f = s.slice(i + 2).split(" "); return { comm: s.slice(s.indexOf("(") + 1, i), ppid: Number(f[1]), ticks: Number(f[11]) + Number(f[12]) }; } catch { return null; } };
const tree = () => { // every process under the Firefox we started
	const all = new Map();
	for (const d of readdirSync("/proc")) if (/^\d+$/.test(d)) { const s = readStat(`/proc/${d}/stat`); if (s) all.set(Number(d), s); }
	const mine = new Set([ff.pid]); let grew = true;
	while (grew) { grew = false; for (const [pid, s] of all) if (!mine.has(pid) && mine.has(s.ppid)) { mine.add(pid); grew = true; } }
	return [...mine].filter((p) => all.has(p));
};
const pssMB = (pid) => { try { const m = /Pss:\s+(\d+) kB/.exec(readFileSync(`/proc/${pid}/smaps_rollup`, "utf8")); return m ? Number(m[1]) / 1024 : 0; } catch { return 0; } };
const sample = () => { // { total ticks, game worker ticks ("DOM Worker" threads), page main-thread ticks (GeckoMain of every content process, summed), pss MB, biggest process PSS }
	let total = 0, worker = 0, main = 0, mem = 0, big = 0;
	for (const pid of tree()) {
		const s = readStat(`/proc/${pid}/stat`); if (!s) continue;
		total += s.ticks;
		const p = pssMB(pid); mem += p; big = Math.max(big, p);
		if (s.comm === "firefox-bin" || s.comm === "firefox" || /Web Content|Isolated/.test(s.comm)) {
			let m = 0, w = 0;
			try { for (const t of readdirSync(`/proc/${pid}/task`)) { const ts = readStat(`/proc/${pid}/task/${t}/stat`); if (!ts) continue; if (ts.comm === "DOM Worker") w += ts.ticks; else if (Number(t) === pid) m += ts.ticks; } } catch {}
			worker += w; if (m > 0 && s.comm !== "firefox-bin" && s.comm !== "firefox") main += m;
		}
	}
	return { t: Date.now(), total, worker, main, mem, big };
};

const t0 = Date.now();
const log = (...a) => console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s:`, ...a);
const result = { mode, query, window: win, headed, fps: fps || null, date: new Date().toISOString(), phases: {} };
try {
	let ws;
	for (let i = 0; i < 100 && !ws; i++) {
		await sleep(300);
		try { const s = new WebSocket(`ws://127.0.0.1:${FF_PORT}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {}
	}
	if (!ws) throw new Error("no BiDi connection to Firefox");
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	await send("session.new", { capabilities: {} });
	const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	const evaluate = async (expression) => { const r = await send("script.evaluate", { expression, target: { context: ctx }, awaitPromise: true }); return r.result?.result?.value; };
	const [vw, vh] = win.split(",").map(Number);
	await send("browsingContext.setViewport", { context: ctx, viewport: { width: vw, height: vh } });
	result.firefox = (await send("session.status")).result?.message ?? "";
	// Load: navigate, then poll until the first view arrives (you can see and walk).
	bytes.raw = bytes.gz = bytes.files = 0; const navAt = Date.now();
	const nav = send("browsingContext.navigate", { context: ctx, url: `http://127.0.0.1:${WEB_PORT}/index.html?${query}`, wait: "none" });
	await nav;
	let firstView = null, joined = null;
	for (let i = 0; i < 1200; i++) {
		await sleep(250);
		const st = JSON.parse((await evaluate("JSON.stringify({ v: window.bootResult?.viewStats?.received ?? 0, j: window.bootResult?.milestones?.joined ?? null })")) ?? "{}");
		if (firstView === null && st.v > 0) firstView = (Date.now() - navAt) / 1000;
		if (joined === null && st.j != null) joined = (Date.now() - navAt) / 1000;
		if (firstView !== null && joined !== null) break;
	}
	if (firstView === null) throw new Error("never got a first view");
	result.load = { firstViewS: firstView, joinedS: joined, bytesRaw: bytes.raw, bytesGzip: bytes.gz, files: bytes.files };
	result.renderer = await evaluate("(() => { const g = document.createElement('canvas').getContext('webgl'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return g ? String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER)) : 'no webgl'; })()");
	log(`playable: first view ${firstView.toFixed(1)} s, joined ${joined?.toFixed(1)} s, ${(bytes.raw / 1e6).toFixed(1)} MB raw / ${(bytes.gz / 1e6).toFixed(1)} MB gzip in ${bytes.files} files`);
	await evaluate("dispatchEvent(new Event('pointerdown')), 1"); // audio unlock, as a first click would
	const playableAt = Date.now();
	const memSeries = []; let peakMem = 0, peakBig = 0;
	const memTimer = setInterval(() => { const s = sample(); memSeries.push([Math.round((Date.now() - playableAt) / 1000), Math.round(s.mem)]); peakMem = Math.max(peakMem, s.mem); peakBig = Math.max(peakBig, s.big); }, 5000);
	const memAt = async () => { const s = sample(); peakMem = Math.max(peakMem, s.mem); return { totalMB: Math.round(s.mem), biggestProcessMB: Math.round(s.big) }; };
	result.memory = { atPlayable: await memAt() };

	// Key walking: real trusted keys over BiDi. One lap = 8 steps each way round a square, then a chat line and an emote.
	const KEYS = { north: "", south: "", east: "", west: "" };
	const tap = (k) => send("input.performActions", { context: ctx, actions: [{ type: "key", id: "kb", actions: [{ type: "keyDown", value: KEYS[k] }, { type: "pause", duration: 40 }, { type: "keyUp", value: KEYS[k] }] }] });
	const cmd = (c) => evaluate(`window.sendCommand(${JSON.stringify(c)}), 1`);
	// A real mouse click on a HUD button (hud:TEXT = a screen object whose type contains TEXT).
	const clickHud = async (spec) => {
		const at = JSON.parse((await evaluate(`JSON.stringify(window.locateClick(${JSON.stringify(spec)}))`)) ?? "null");
		if (!at) { log(`click ${spec}: not found`); return false; }
		log(`click ${spec} at ${Math.round(at.x)},${Math.round(at.y)}`);
		await send("input.performActions", { context: ctx, actions: [{ type: "pointer", id: "mouse", parameters: { pointerType: "mouse" }, actions: [{ type: "pointerMove", x: Math.round(at.x), y: Math.round(at.y) }, { type: "pointerDown", button: 0 }, { type: "pause", duration: 80 }, { type: "pointerUp", button: 0 }] }] });
		return true;
	};
	// Answers the game's question boxes (#dialogs): a list picks the first entry containing `pick`, a text/number box gets `power` (or `text`), then OK.
	// Keeps answering until no box shows up for 1.5 s.
	const answerDialogs = async (a) => {
		for (let quiet = 0; quiet < 6;) {
			const r = await evaluate(`(() => { const d = document.querySelector("#dialogs .dlg"); if (!d) return ""; const f = d.querySelector("select,input,textarea"), msg = d.querySelector(".msg")?.textContent ?? "", a = ${JSON.stringify(a)};
				if (f?.tagName === "SELECT") { const t = (o) => o.text.toLowerCase(), w = a.pick.toLowerCase(); let i = [...f.options].findIndex((o) => t(o).endsWith(w)); if (i < 0) i = [...f.options].findIndex((o) => t(o).includes(w)); f.selectedIndex = i < 0 ? 0 : i; }
				else if (f) f.value = /explosive|power/i.test(msg) ? a.power : a.text;
				const ok = [...d.querySelectorAll("button")].find((b) => b.textContent === "OK") ?? d.querySelector("button"); const info = (d.querySelector("h4")?.textContent ?? "") + "/" + msg + "/" + (f ? f.tagName + ":" + (f.tagName === "SELECT" ? f.options[f.selectedIndex]?.text : f.value) : "");
				ok.click(); return info; })()`);
			if (r) { quiet = 0; log("dialog:", r); } else { quiet++; await sleep(250); }
		}
	};
	const lap = async () => { for (const k of ["east", "north", "west", "south"]) for (let i = 0; i < 8; i++) { await tap(k); await sleep(300); } await cmd("say Checking the baseline"); await cmd("me waves"); };

	const startFrames = () => evaluate("(() => { const a = window.__fr = { dts: [], last: performance.now(), on: true }; const f = (t) => { if (!a.on) return; a.dts.push(t - a.last); a.last = t; requestAnimationFrame(f); }; requestAnimationFrame((t) => { a.last = t; requestAnimationFrame(f); }); return 1; })()");
	const stopFrames = async () => JSON.parse(await evaluate("(() => { window.__fr.on = false; const d = window.__fr.dts.slice(1).sort((a, b) => a - b), n = d.length, q = (p) => d[Math.min(n - 1, Math.floor(p * n))]; return JSON.stringify({ n, avg: d.reduce((a, b) => a + b, 0) / n, p95: q(0.95), p99: q(0.99), max: d[n - 1], over50: d.filter((x) => x > 50).length, over100: d.filter((x) => x > 100).length }); })()"));
	const vs = () => evaluate("JSON.stringify((({ renders, renderMs, applied, applyMs, received }) => ({ renders, renderMs, applied, applyMs, received }))(window.bootResult.viewStats))").then(JSON.parse);

	// A phase: run `body` (which takes `seconds`), and measure CPU / frames / page work over exactly that time.
	const phase = async (name, seconds, body) => {
		await sleep(1000);
		const a = sample(), v0 = await vs(); await startFrames(); const w0 = Date.now();
		await body(seconds);
		const frames = await stopFrames(), b = sample(), v1 = await vs(), dt = (Date.now() - w0) / 1000, d = (k) => v1[k] - v0[k];
		const cpu = (k) => ((b[k] - a[k]) / HZ / dt) * 100; // percent of one core
		const mainMsPerFrame = frames.n ? (d("renderMs") + d("applyMs")) / frames.n : null;
		result.phases[name] = {
			seconds: Math.round(dt), cpuTotalPct: cpu("total"), cpuGameWorkerPct: cpu("worker"), cpuPageMainThreadPct: cpu("main"),
			pageMsPerFrame: mainMsPerFrame, pageMsPerSec: (d("renderMs") + d("applyMs")) / dt, redrawsPerSec: d("renders") / dt, viewUpdatesPerSec: d("received") / dt,
			frames, memory: await memAt(), peakSoFarMB: Math.round(peakMem),
		};
		log(name, JSON.stringify({ cpu: cpu("total").toFixed(0), fps: (1000 / frames.avg).toFixed(0), worst: frames.max.toFixed(0), mem: result.phases[name].memory.totalMB }));
	};
	const waitFor = (s) => sleep(s * 1000);
	if (mode === "creative") { // Creative starts as a ghost: a body, so the walk is a real walk. The button can show up a few seconds after the first view (laptop: not there at 13 s).
		let ok = false; for (let i = 0; i < 30 && !ok; i++) { ok = await clickHud("hud:reenter_corpse"); if (!ok) await sleep(1000); }
		if (!ok) throw new Error("Creative: no 'Become human' button after 30 s"); log("became human"); await sleep(3000);
	}
	await sleep(15000); // settle: let the arrival animations and the first-second work finish
	await phase("idle", T.idle, waitFor);
	await phase("typical", T.typical, async (s) => { const end = Date.now() + s * 1000; while (Date.now() < end) await lap(); });
	result.memory.after10min = await memAt(); result.memory.after10minAtS = Math.round((Date.now() - playableAt) / 1000);
	// Stress: the same in both modes, through the admin verbs a player has: a crowd of carp, then three DynEx bombs (blast + fire) around the player, then a lap of walking through it.
	await phase("stress", T.stress, async (s) => {
		for (let i = 0; i < 12; i++) { await cmd("spawn"); await answerDialogs({ pick: "/hostile/carp", text: "/mob/living/simple_animal/hostile/carp", power: "250" }); }
		for (let i = 0; i < 3; i++) { await cmd("drop-dynex-bomb"); await answerDialogs({ pick: "", text: "", power: "250" }); await sleep(2000); }
		if (mode === "creative") { await clickHud("hud:reenter_corpse"); await sleep(1000); } // the blasts kill the player: back in a body to walk
		await sleep(3000);
		const shot = await send("browsingContext.captureScreenshot", { context: ctx });
		if (shot.result?.data) writeFileSync(outFile.replace(/\.json$/, "-stress.png"), Buffer.from(shot.result.data, "base64"));
		const end = Date.now() + s * 1000; while (Date.now() < end) await lap();
	});
	clearInterval(memTimer);
	result.memory.peakTotalMB = Math.round(peakMem); result.memory.peakBiggestProcessMB = Math.round(peakBig); result.memory.series = memSeries;
	result.perfLines = JSON.parse(await evaluate("JSON.stringify(window.bootResult.lines.filter((l) => /^\\[page\\] perf|runtime error|long tick/.test(l)).slice(-12))"));
	result.chatTail = await evaluate("document.getElementById('outputwindow')?.innerText.split('\\n').slice(-25).join(' | ')");
} catch (e) {
	result.error = String(e?.stack ?? e);
	console.log("FAILED", result.error);
} finally {
	mkdirSync(dirname(resolve(outFile)), { recursive: true });
	writeFileSync(outFile, JSON.stringify(result, null, 1));
	console.log(`wrote ${outFile}`);
	ff.kill(); server.close(); await sleep(500); rmSync(prof, { recursive: true, force: true });
	process.exit(result.error ? 1 : 0);
}
