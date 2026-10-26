// snap-time - how long web/dist takes from opening the page to tg's lobby, with the pre-started world snapshot and
// without it (?nosnap=1), in headless Chromium (CDP) and Firefox (WebDriver BiDi), plus the browsers' peak memory.
// Usage (from web/, after `npm run build:static`): node --experimental-websocket tests/static/snap-time.mjs [chrome|firefox ...] [--modes snap,nosnap] [--dist DIR]
// Each run: a fresh browser profile, dist served by a small Node server, the page opened with ?nocache=1 (no service worker
// download first); stops at the "lobby" milestone. Peak memory: /proc RSS of the browser's
// processes, sampled every 250 ms (max single process = the one running the game worker, and the sum).
// Fallback modes (the page must still boot normally, stopping at "world-new"): missing (world-snap.json 404s), garbage (a
// gzip of junk: "not a world snapshot", handled in the same worker), midload (a real snapshot with one object record broken,
// so loadSnapshot fails half-way: the page must reload itself with ?nosnap=1). E.g. --modes missing,garbage,midload chrome
// zstd: there's a world.snap.zst, sent with Content-Encoding: zstd as ss13.live's worker does (site/worker.js) to a browser that
// accepts zstd; the page must load it ("MB zstd" in its snapshot line). Needs the zstd command. zstdraw: the .snap.zst comes
// unpacked with no Content-Encoding, as Cloudflare sends it to a browser without zstd: the page must drop it and load the gzip.
// nogz: the same, but no .gz (an older ss13.live build): the page must boot normally and show the loading note saying why.
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, rmSync, statSync, mkdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const dist = join(web, opt("--dist", "dist"));
const browsers = argv.filter((a) => a === "chrome" || a === "firefox");
if (!browsers.length) browsers.push("chrome", "firefox");
const modes = opt("--modes", "snap,nosnap").split(",");
const CHROME = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const spawned = []; // browsers started, killed on exit
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".ogg": "audio/ogg" };
let serveMode = "snap", brokenGz = null;
// midload: flip one early object record in the head part to an unknown kind (format: magic 8, version 4, then u32 length + bytes per part: meta, head, ...)
const broken = () => { if (brokenGz) return brokenGz; const raw = gunzipSync(readFileSync(join(dist, "web/build/world.snap.gz"))); const metaLen = raw.readUInt32LE(12), head = 12 + 4 + metaLen + 4; raw[head + 5000] = 0x0f; return (brokenGz = gzipSync(raw, { level: 1 })); };
// packed before any browser starts (~30 s): packing on the first request held up the whole server
const zst = modes.includes("zstd") ? execFileSync("zstd", ["-19", "-T0", "-q", "-c"], { input: gunzipSync(readFileSync(join(dist, "web/build/world.snap.gz"))), maxBuffer: 1 << 30 }) : null;
const srv = createServer((q, r) => {
	let p = decodeURIComponent(q.url.split("?")[0]);
	if (serveMode === "missing" && p.endsWith("/world-snap.json")) { r.writeHead(404); return r.end(); }
	if (serveMode === "garbage" && p.endsWith("/world.snap.gz")) { r.writeHead(200); return r.end(gzipSync(Buffer.alloc(Number(JSON.parse(readFileSync(join(dist, "web/build/world-snap.json"), "utf8")).raw), 7))); }
	if (serveMode === "midload" && p.endsWith("/world.snap.gz")) { r.writeHead(200); return r.end(broken()); }
	if (serveMode === "zstd" && p.endsWith("/world.snap.zst") && /\bzstd\b/.test(q.headers["accept-encoding"] ?? "")) { r.writeHead(200, { "content-encoding": "zstd", "content-length": zst.length }); return r.end(zst); }
	if (serveMode === "nogz" && p.endsWith("/world.snap.gz")) { r.writeHead(404); return r.end(); }
	if ((serveMode === "zstdraw" || serveMode === "nogz") && p.endsWith("/world.snap.zst")) { r.writeHead(200); return r.end(gunzipSync(readFileSync(join(dist, "web/build/world.snap.gz")))); }
	if (p.endsWith("/")) p += "index.html";
	const f = join(dist, p);
	if (!f.startsWith(dist) || !existsSync(f) || !statSync(f).isFile()) { r.writeHead(404); return r.end(); }
	r.writeHead(200, { "content-type": mime[extname(f)] ?? "application/octet-stream" });
	r.end(readFileSync(f));
});
const PORT = 20000 + (process.pid % 20000); // below the browsers' debug ports (42000+, 48000+)
await new Promise((ok) => srv.listen(PORT, "127.0.0.1", ok));

// RSS of a process and all its descendants
const kids = () => { const m = new Map(); for (const d of readdirSync("/proc")) { if (!/^\d+$/.test(d)) continue; try { const st = readFileSync(`/proc/${d}/stat`, "utf8"); const pp = Number(st.slice(st.lastIndexOf(")") + 2).split(" ")[1]); if (!m.has(pp)) m.set(pp, []); m.get(pp).push(Number(d)); } catch {} } return m; };
const rssMB = (pid) => { try { return Number(/VmRSS:\s+(\d+)/.exec(readFileSync(`/proc/${pid}/status`, "utf8"))[1]) / 1024; } catch { return 0; } };
function sampler(root) {
	const peak = { one: 0, sum: 0 };
	const t = setInterval(() => {
		const k = kids(), all = [], walk = (p) => { all.push(p); for (const c of k.get(p) ?? []) walk(c); };
		walk(root);
		let sum = 0; for (const p of all) { const r = rssMB(p); sum += r; peak.one = Math.max(peak.one, r); }
		peak.sum = Math.max(peak.sum, sum);
	}, 250);
	return { peak, stop: () => clearInterval(t) };
}

async function cdpBrowser(prof) {
	const port = 42000 + (process.pid % 5000);
	const proc = spawn(CHROME, ["--no-sandbox", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
	spawned.push(proc);
	let list;
	for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {} }
	const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
	await new Promise((r) => (ws.onopen = r));
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	return {
		proc,
		navigate: (url) => send("Page.navigate", { url }),
		evaluate: async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value,
		close: () => { ws.close(); proc.kill(); },
	};
}
async function bidiBrowser(prof) {
	const port = 48000 + (process.pid % 5000);
	const proc = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${port}`], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } });
	spawned.push(proc);
	let ws;
	for (let i = 0; i < 100 && !ws; i++) { await sleep(300); try { const s = new WebSocket(`ws://127.0.0.1:${port}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {} }
	if (!ws) throw new Error("no BiDi connection to Firefox");
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	await send("session.new", { capabilities: {} });
	const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	return {
		proc,
		navigate: (url) => send("browsingContext.navigate", { context: ctx, url, wait: "none" }),
		evaluate: async (expr) => (await send("script.evaluate", { expression: expr, target: { context: ctx }, awaitPromise: true })).result?.result?.value,
		close: () => { ws.close(); proc.kill(); },
	};
}

process.on("exit", () => { for (const p of spawned) try { p.kill(); } catch {} }); // a crash mustn't leave a browser running
const results = [];
for (const b of browsers) for (const mode of modes) {
	const prof = join(web, "build", `snap-time-${b}-${process.pid}`);
	rmSync(prof, { recursive: true, force: true }); mkdirSync(prof, { recursive: true });
	const br = b === "chrome" ? await cdpBrowser(prof) : await bidiBrowser(prof);
	const mem = sampler(br.proc.pid);
	serveMode = mode;
	const fallback = !["snap", "nosnap", "zstd", "zstdraw"].includes(mode);
	const t0 = Date.now();
	await br.navigate(`http://127.0.0.1:${PORT}/index.html?nocache=1${mode === "nosnap" ? "&nosnap=1" : ""}`);
	let st = null;
	for (let i = 0; i < 300 * 2; i++) {
		await sleep(500);
		const s = await br.evaluate(`JSON.stringify(window.bootResult ? { pageAt: window.bootResult.pageAt, ms: window.bootResult.milestones, done: window.bootResult.done, search: location.search, snap: window.bootResult.lines.filter((l) => /snapshot (loaded|not used)|load failed|loading: Loading the station[.]{3} [0-9]|loading note/.test(l)) } : null)`).catch(() => null);
		st = s ? JSON.parse(s) : null;
		if (st && ((fallback ? st.pageAt?.["world-new"] : st.pageAt?.lobby) !== undefined || st.done)) break;
	}
	if (!fallback) await sleep(3000); // a little of the lobby, for the memory peak
	mem.stop(); br.close(); await sleep(1500);
	rmSync(prof, { recursive: true, force: true });
	// zstd: the download counter counts to the zstd file's size, not the unpacked size (it showed "... / 195 MB" on 2026-10-26)
	const counts = (st?.snap ?? []).map((l) => /Loading the station\.\.\. (\d+) \/ (\d+) MB/.exec(l)).filter(Boolean).map((m) => [Number(m[1]), Number(m[2])]);
	const countOk = mode !== "zstd" || (counts.length > 0 && counts.every(([n, of]) => of === Math.round(zst.length / 1e6) && n <= of));
	const ok = !countOk ? false : mode === "zstd" || mode === "zstdraw" ? st?.pageAt?.lobby !== undefined && st.snap.some((l) => new RegExp(`snapshot loaded \\([\\d.]+ MB ${mode === "zstd" ? "zstd" : "gzip"}`).test(l)) : fallback ? st?.pageAt?.["world-new"] !== undefined && (mode === "midload" ? /nosnap=1/.test(st.search) : mode === "nogz" ? st.snap.some((l) => /snapshot not used/.test(l)) && st.snap.some((l) => /loading note: .*zstd/.test(l)) : st.snap.some((l) => /snapshot not used/.test(l))) : st?.pageAt?.lobby !== undefined;
	const r = { browser: b, mode, ok, search: st?.search, lobbyAfterPageOpen: st?.pageAt?.lobby ?? null, milestonesSincePageOpen: st?.pageAt, wall: (Date.now() - t0) / 1000, peakRssProcessMB: Math.round(mem.peak.one), peakRssAllMB: Math.round(mem.peak.sum), snapshotLines: st?.snap };
	results.push(r);
	console.log(JSON.stringify(r));
}
srv.close();
console.log("\nbrowser  mode    page open -> lobby   peak RSS (worker process / all)");
for (const r of results) console.log(`${r.browser.padEnd(8)} ${r.mode.padEnd(7)} ${!r.ok ? "FAIL" : r.lobbyAfterPageOpen === null ? "fell back to a normal boot: ok" : (r.lobbyAfterPageOpen.toFixed(1) + " s").padEnd(19)} ${r.peakRssProcessMB} / ${r.peakRssAllMB} MB`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
