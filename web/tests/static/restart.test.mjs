// restart.test - round end and world restart in the tab, in headless Firefox (WebDriver BiDi) and/or Chromium (CDP).
// Usage (from web/, after `npm run build:static`): node --experimental-websocket tests/static/restart.test.mjs [firefox|chrome ...] [--worlds 3]
// Opens web/dist with a fresh profile: lobby 15 s, then in every world the page joins as Assistant through the lobby's
// late-join link (?autojoin), ends the round 15 s after spawning through tg's own path (?endround: SSticker.force_ending,
// what the admin "End Round" verb does), tg's reboot countdown shortened to 5 s (?rounddelay). tg calls world.Reboot()
// and the page starts the next world. Stops 10 s into world N's lobby (default 3 = two restarts).
// Checks: every world reached its lobby; tg's round-end report and reboot notice reached the output pane; world 2+ read
// the files the previous round saved (Poly's rounds_survived goes up by one per round, the log's "saved file" lines);
// no world has runtimes; the game process's memory in world N's lobby is within 10% of world 2's (the old worlds are
// freed). Memory, 10 s into each lobby: in Chrome the worker's JS heap after a forced GC (CDP), in Firefox the RSS of the
// browser's biggest process (the one running the game worker).
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, rmSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dist = join(web, "dist");
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const browsers = argv.filter((a) => a === "chrome" || a === "firefox");
if (!browsers.length) browsers.push("firefox");
const worlds = Number(opt("--worlds", "3"));
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
const biggestRss = (root) => { const k = kids(); let best = 0; const walk = (p) => { best = Math.max(best, rssMB(p)); for (const c of k.get(p) ?? []) walk(c); }; walk(root); return Math.round(best); };

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
		if (m.method === "Target.attachedToTarget" && m.params.targetInfo.type === "worker") worker = m.params.sessionId; // each world's new worker
	};
	const send = (method, params = {}, sessionId) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params, sessionId })); });
	await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
	// The game worker's JS heap after a forced GC: a single RSS sample swings ±15% with GC timing once the world is ~1 GB.
	const workerHeap = async () => { if (!worker) return null; await send("HeapProfiler.collectGarbage", {}, worker); const u = (await send("Runtime.getHeapUsage", {}, worker)).result; return u ? Math.round(u.usedSize / 1048576) : null; };
	return { proc, workerHeap, navigate: (url) => send("Page.navigate", { url }), evaluate: async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value, close: () => { ws.close(); proc.kill(); } };
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
	return { proc, navigate: (url) => send("browsingContext.navigate", { context: ctx, url, wait: "none" }), evaluate: async (expr) => (await send("script.evaluate", { expression: expr, target: { context: ctx }, awaitPromise: true })).result?.result?.value, close: () => { ws.close(); proc.kill(); } };
}

process.on("exit", () => { for (const p of spawned) try { p.kill(); } catch {} });
let allOk = true;
for (const b of browsers) {
	const prof = join(web, "build", `restart-test-${b}-${process.pid}`);
	rmSync(prof, { recursive: true, force: true }); mkdirSync(prof, { recursive: true });
	const br = b === "chrome" ? await cdpBrowser(prof) : await bidiBrowser(prof);
	const t0 = Date.now(), at = () => ((Date.now() - t0) / 1000).toFixed(0) + " s";
	await br.navigate(`http://127.0.0.1:${PORT}/index.html?nocache=1&seed=24301&lobby=15&autojoin=Assistant&endround=15&rounddelay=5`);
	const rss = [], heaps = [], lobbyAt = [], rebootAt = [];
	let seen = 0, lobbySeen = false, measureAt = 0, st = null;
	for (let i = 0; i < 1200; i++) { // at most 10 min
		await sleep(500);
		const s = await br.evaluate(`JSON.stringify(window.bootResult ? { n: window.bootResult.rounds?.length ?? 0, lobby: window.bootResult.pageAt.lobby, joined: window.bootResult.pageAt.joined, done: window.bootResult.done, error: window.bootResult.error } : null)`);
		st = s ? JSON.parse(s) : null;
		if (!st) continue;
		if (st.error || st.done) { console.log(`${b}: the page stopped: ${st.error ?? "done"}`); break; }
		if (st.n > seen) { seen = st.n; lobbySeen = false; rebootAt.push(Number(at().split(" ")[0])); console.log(`${b} ${at()}: world ${seen} rebooted`); }
		if (!lobbySeen && st.lobby !== undefined) { lobbySeen = true; measureAt = Date.now() + 10000; lobbyAt.push(Number(at().split(" ")[0])); console.log(`${b} ${at()}: world ${seen + 1} lobby (${st.lobby.toFixed(1)} s after the page opened)`); }
		if (measureAt && Date.now() >= measureAt) {
			measureAt = 0;
			rss.push(biggestRss(br.proc.pid));
			if (br.workerHeap) heaps.push(await br.workerHeap());
			console.log(`${b} ${at()}: world ${seen + 1} lobby + 10 s: biggest process RSS ${rss.at(-1)} MB${br.workerHeap ? `, worker heap after GC ${heaps.at(-1)} MB` : ""}`);
			if (seen + 1 >= worlds) break;
		}
	}
	const r = JSON.parse(await br.evaluate(`JSON.stringify({ rounds: window.bootResult.rounds.map((w) => ({ reason: w.reason, lines: w.lines })), lines: window.bootResult.lines, out: document.getElementById("outputwindow").innerText })`));
	br.close(); await sleep(1500);
	rmSync(prof, { recursive: true, force: true });
	const all = [...r.rounds.map((w) => w.lines), r.lines];
	const outFile = join(web, "build", `restart-test-${b}.log`);
	writeFileSync(outFile, all.map((l, i) => `===== world ${i + 1} =====\n${l.join("\n")}`).join("\n"));
	const poly = all.map((l) => { const m = l.map((x) => /Poly rounds_survived (-?\d+)/.exec(x)).find(Boolean); return m ? Number(m[1]) : null; });
	const runtimes = all.map((l) => l.filter((x) => /^\[vm-boot\] (runtime|VM gap):/.test(x)).length);
	const checks = [
		[`${worlds} worlds reached the lobby`, lobbyAt.length === worlds],
		["tg's round-end report in the output pane", /The round has ended/.test(r.out)],
		["tg's reboot notice in the output pane", /Rebooting World in 5 seconds/.test(r.out) && /Rebooting world\.\.\./.test(r.out)],
		[`world 2+ read what the round before saved (Poly rounds_survived per world: ${JSON.stringify(poly)})`, poly.slice(1).every((v, i) => v === i + 1)],
		[`no runtimes (per world: ${JSON.stringify(runtimes)})`, runtimes.every((n) => n === 0)],
		// Chrome: the worker's heap after a forced GC (RSS shown for reference); Firefox: RSS, steady by then (its one idle GC
		// runs ~5 s after the load).
		heaps.length
			? [`worker heap after GC in world ${worlds}'s lobby within 10% of world 2's (${JSON.stringify(heaps)} MB; RSS ${JSON.stringify(rss)} MB)`, heaps.length >= 3 && Math.abs(heaps[worlds - 1] - heaps[1]) <= heaps[1] * 0.1]
			: [`game process RSS in world ${worlds}'s lobby within 10% of world 2's (${JSON.stringify(rss)} MB)`, rss.length >= 3 && Math.abs(rss[worlds - 1] - rss[1]) <= rss[1] * 0.1],
	];
	console.log(`\n${b}: lobbies at ${JSON.stringify(lobbyAt)} s, reboots at ${JSON.stringify(rebootAt)} s after page open; restart -> next lobby ${lobbyAt.slice(1).map((l, i) => (l - rebootAt[i]).toFixed(0) + " s").join(", ")}; log ${outFile}`);
	for (const [name, ok] of checks) { console.log(`${ok ? "ok  " : "FAIL"} ${b}: ${name}`); if (!ok) allOk = false; }
}
srv.close();
process.exit(allOk ? 0 : 1);
