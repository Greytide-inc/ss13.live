// mem-budget - how much memory web/dist takes in a real browser, against the memory budget (an 8 GB machine).
// Usage (from web/, after `npm run build:static`): node --experimental-websocket tests/static/mem-budget.mjs [chrome|firefox ...]
//        [--play S] [--budget MB] [--query "extra=1"] [--about-memory] [--timeline] [--out FILE] [--gc-log FILE]
// --gc-log FILE: Firefox writes one line per major-GC slice of every JS runtime (main thread, each worker) to FILE
//   (JS_GC_PROFILE=0,all; columns PID, Runtime, Timestamp, Reason, ..., SizeKB = GC heap, MllcKB = malloc heap, both at the
//   end of the slice, so after a non-incremental worker GC they are what survived). It also turns off the content sandbox
//   (MOZ_DISABLE_CONTENT_SANDBOX): the sandbox stops the game process opening the file, the tab crashes and every
//   evaluate fails with "System access is required". MEM_DEBUG=1 prints the page state and failed BiDi replies.
// --out FILE: writes the page's log lines (window.bootResult.lines) to FILE (with one browser) or FILE.<browser> (tr1).
// Each run: a fresh profile, dist served by a small Node server, the page opened with ?nocache=1&join=Assistant (snapshot
// start, straight into the round), then --play seconds (default 60) of the round with the player standing still.
// --timeline prints the game process's RSS every second. Measured from /proc: peak RSS of the biggest browser process (the one running the game) and of all of them together,
// over the whole run, and the same at the end ("settled"). Chrome also reports the worker's and the page's JS heap after a
// forced GC (CDP). --about-memory: Firefox runs "minimize memory usage" (a full GC; Firefox otherwise keeps the
// boot's garbage for a long time), prints the RSS after it, and writes its about:memory report to build/mem-budget/
// (open it in about:memory with "Load..."). Exit 1 if the game process's peak is over --budget (default 2500 MB).
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, rmSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dist = join(web, "dist");
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const browsers = argv.filter((a) => a === "chrome" || a === "firefox");
if (!browsers.length) browsers.push("chrome", "firefox");
const timeline = argv.includes("--timeline");
const gcLog = opt("--gc-log", "") ? resolve(opt("--gc-log", "")) : ""; // absolute: Firefox's cwd differs
if (gcLog) { mkdirSync(dirname(gcLog), { recursive: true }); rmSync(gcLog, { force: true }); }
const play = Number(opt("--play", "60")), budget = Number(opt("--budget", "2500")), extra = opt("--query", "");
const CHROME = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const spawned = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".ogg": "audio/ogg" };
const srv = createServer((q, r) => {
	let p = decodeURIComponent(q.url.split("?")[0]);
	if (p.endsWith("/")) p += "index.html";
	const f = join(dist, p);
	if (!f.startsWith(dist) || !existsSync(f) || !statSync(f).isFile()) { r.writeHead(404); return r.end(); }
	r.writeHead(200, { "content-type": mime[extname(f)] ?? "application/octet-stream" });
	r.end(readFileSync(f));
});
const PORT = 20000 + (process.pid % 20000);
await new Promise((ok) => srv.listen(PORT, "127.0.0.1", ok));

const kids = () => { const m = new Map(); for (const d of readdirSync("/proc")) { if (!/^\d+$/.test(d)) continue; try { const st = readFileSync(`/proc/${d}/stat`, "utf8"); const pp = Number(st.slice(st.lastIndexOf(")") + 2).split(" ")[1]); if (!m.has(pp)) m.set(pp, []); m.get(pp).push(Number(d)); } catch {} } return m; };
const rssMB = (pid) => { try { return Number(/VmRSS:\s+(\d+)/.exec(readFileSync(`/proc/${pid}/status`, "utf8"))[1]) / 1024; } catch { return 0; } };
function sampler(root) {
	const s = { peakOne: 0, peakSum: 0, one: 0, sum: 0, n: 0, line: [] };
	const t = setInterval(() => {
		const k = kids(), all = [], walk = (p) => { all.push(p); for (const c of k.get(p) ?? []) walk(c); };
		walk(root);
		let sum = 0, one = 0; for (const p of all) { const r = rssMB(p); sum += r; one = Math.max(one, r); }
		Object.assign(s, { one, sum, peakOne: Math.max(s.peakOne, one), peakSum: Math.max(s.peakSum, sum) });
		if (timeline && ++s.n % 4 === 0) s.line.push(Math.round(one / 10) * 10);
	}, 250);
	return { s, stop: () => clearInterval(t) };
}

async function cdpBrowser(prof) {
	const port = 42000 + (process.pid % 5000);
	const proc = spawn(CHROME, ["--no-sandbox", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
	spawned.push(proc);
	let list;
	for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {} }
	const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
	await new Promise((r) => (ws.onopen = r));
	let id = 0, worker = null; const pending = new Map();
	ws.onmessage = (e) => {
		const m = JSON.parse(e.data);
		if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
		if (m.method === "Target.attachedToTarget" && m.params.targetInfo.type === "worker") worker = m.params.sessionId;
	};
	const send = (method, params = {}, sessionId) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params, sessionId })); });
	await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
	const heap = async (s) => { await send("HeapProfiler.collectGarbage", {}, s); const u = (await send("Runtime.getHeapUsage", {}, s)).result; return u ? `${Math.round(u.usedSize / 1048576)}/${Math.round(u.totalSize / 1048576)}` : "?"; };
	return {
		proc,
		navigate: (url) => send("Page.navigate", { url }),
		evaluate: async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value,
		heaps: async () => `worker heap ${worker ? await heap(worker) : "?"} MB used/total, page heap ${await heap(undefined)} MB`,
		close: () => { ws.close(); proc.kill(); },
	};
}
async function bidiBrowser(prof) {
	const port = 48000 + (process.pid % 5000);
	const proc = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${port}`], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1", ...(gcLog ? { JS_GC_PROFILE: "0,all", JS_GC_PROFILE_FILE: gcLog, MOZ_DISABLE_CONTENT_SANDBOX: "1" } : {}) } });
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
		navigate: async (url) => { const m = await send("browsingContext.navigate", { context: ctx, url, wait: "none" }); if (process.env.MEM_DEBUG) console.log("navigate:", JSON.stringify(m).slice(0, 300)); return m; },
		evaluate: async (expr) => { const m = await send("script.evaluate", { expression: expr, target: { context: ctx }, awaitPromise: true }); if (process.env.MEM_DEBUG && m.result?.result?.value === undefined) console.log("evaluate:", JSON.stringify(m).slice(0, 400)); return m.result?.result?.value; },
		heaps: async () => "",
		close: () => { ws.close(); proc.kill(); },
	};
}

process.on("exit", () => { for (const p of spawned) try { p.kill(); } catch {} });
const results = [];
for (const b of browsers) {
	const prof = join(web, "build", `mem-budget-${b}-${process.pid}`);
	rmSync(prof, { recursive: true, force: true }); mkdirSync(prof, { recursive: true });
	const br = b === "chrome" ? await cdpBrowser(prof) : await bidiBrowser(prof);
	const mem = sampler(br.proc.pid);
	const t0 = Date.now();
	await br.navigate(`http://127.0.0.1:${PORT}/index.html?nocache=1&join=Assistant${extra ? "&" + extra : ""}`);
	let st = null, joinedAt = null;
	for (let i = 0; i < 600; i++) {
		await sleep(500);
		const s = await br.evaluate(`JSON.stringify(window.bootResult ? { pageAt: window.bootResult.pageAt, done: window.bootResult.done, error: window.bootResult.error, snap: window.bootResult.lines.filter((l) => /snapshot (loaded|not used)/.test(l)) } : null)`).catch(() => null);
		st = s ? JSON.parse(s) : null;
		if (st?.pageAt?.joined !== undefined && joinedAt === null) { joinedAt = Date.now(); console.log(`${b}: joined at ${st.pageAt.joined.toFixed(1)} s, playing ${play} s`); }
		if (joinedAt !== null && Date.now() - joinedAt > play * 1000) break;
		if (st?.done || st?.error) break;
		if (i % 20 === 0 && process.env.MEM_DEBUG) console.log(`t=${(Date.now() - t0) / 1000} st=${JSON.stringify(st)}`);
	}
	if (opt("--out", "")) {
		const lines = await br.evaluate("JSON.stringify(window.bootResult?.lines ?? [])").catch(() => "[]");
		const f = browsers.length > 1 ? `${opt("--out", "")}.${b}` : opt("--out", "");
		mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.parse(lines ?? "[]").join("\n") + "\n"); console.log(`${b}: page log written to ${f}`);
	}
	const heaps = await br.heaps();
	let minimized = null;
	const endBefore = { ...mem.s };
	if (b === "firefox" && argv.includes("--about-memory")) { // Firefox writes an about:memory report to /tmp on SIGRTMIN (34)
		const isReport = (f) => /^unified-memory-report-.*\.json\.gz$/.test(f);
		const before = new Set(readdirSync("/tmp").filter(isReport));
		process.kill(br.proc.pid, 35); // SIGRTMIN+1: "minimize memory usage" (full GC everywhere), then the report
		await sleep(8000); // RSS after the minimize (the sampler keeps running)
		minimized = { one: Math.round(mem.s.one), sum: Math.round(mem.s.sum) };
		let f;
		for (let i = 0; i < 60 && !f; i++) { await sleep(1000); f = readdirSync("/tmp").find((x) => isReport(x) && !before.has(x)); }
		await sleep(2000); // let it finish writing
		if (f) { mkdirSync(join(web, "build", "mem-budget"), { recursive: true }); writeFileSync(join(web, "build", "mem-budget", "firefox-memory-report.json.gz"), readFileSync(join("/tmp", f))); rmSync(join("/tmp", f)); console.log("about:memory report: build/mem-budget/firefox-memory-report.json.gz"); }
		else console.log("no about:memory report written");
	}
	await sleep(1000);
	const end = { ...mem.s, ...(minimized ? { one: endBefore.one, sum: endBefore.sum } : {}) };
	mem.stop(); br.close(); await sleep(1500);
	rmSync(prof, { recursive: true, force: true });
	if (timeline) console.log(`${b} game process RSS each second (MB), milestones s since page open ${JSON.stringify(st?.pageAt)}:\n${mem.s.line.join(" ")}`);
	const r = { browser: b, ok: joinedAt !== null && !st?.error, joinedAt: st?.pageAt?.joined ?? null, peakProcessMB: Math.round(end.peakOne), peakAllMB: Math.round(end.peakSum), endProcessMB: Math.round(end.one), endAllMB: Math.round(end.sum), heaps: minimized ? `after "minimize memory" ${minimized.one} / ${minimized.sum} MB` : heaps, error: st?.error ?? null, wall: (Date.now() - t0) / 1000 };
	results.push(r);
	console.log(JSON.stringify(r));
}
srv.close();
console.log(`\nbrowser  peak RSS game process / all   at the end (after ${play} s in the round)   budget ${budget} MB`);
for (const r of results) console.log(`${r.browser.padEnd(8)} ${!r.ok ? "FAIL " : ""}${r.peakProcessMB} / ${r.peakAllMB} MB`.padEnd(42) + `${r.endProcessMB} / ${r.endAllMB} MB  ${r.peakProcessMB > budget ? "OVER" : "ok"}  ${r.heaps}`);
process.exit(results.every((r) => r.ok && r.peakProcessMB <= budget) ? 0 : 1);
