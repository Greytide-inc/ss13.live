// The lobby pictures (worker/lobby-art.js, plans/lobby-art.md), in headless Firefox:
// 1. every sprite loads and every design draws at a few times with no error and not all black;
// 2. the overlay: show(true) puts one 480x480 canvas in the host, show(false) takes it out again.
// Usage (from web/): node --experimental-websocket tests/static/lobby-art.test.mjs
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };

const TEST = `
import { DESIGNS, loadLobbyArt, createLobbyArt } from "/web/worker/lobby-art.js";
const out = { errors: [], dark: [] };
addEventListener("error", (e) => out.errors.push("window: " + e.message));
try {
	await loadLobbyArt();
	const cv = document.createElement("canvas"); cv.width = cv.height = 480; const c = cv.getContext("2d");
	for (const d of DESIGNS) for (const t of [0.5, 6, 37]) {
		try { c.save(); d.draw(c, t); c.restore(); } catch (e) { out.errors.push(d.name + " at " + t + ": " + e.message); continue; }
		const px = c.getImageData(0, 0, 480, 480).data; let lit = 0;
		for (let i = 0; i < px.length; i += 4 * 97) if (px[i] + px[i + 1] + px[i + 2] > 60) lit++;
		if (lit < 20) out.dark.push(d.name + " at " + t);
	}
	out.designs = DESIGNS.length;
	const host = document.createElement("div"); document.body.append(host);
	const art = createLobbyArt(host, "5b");
	art.show(true); await new Promise((r) => setTimeout(r, 300));
	const shown = host.querySelectorAll("canvas.lobby-art");
	out.shown = shown.length; out.size = shown[0] ? shown[0].width + "x" + shown[0].height : ""; out.design = art.design;
	art.show(false); out.fading = host.querySelectorAll("canvas").length; await new Promise((r) => setTimeout(r, 3300)); out.after = host.querySelectorAll("canvas").length;
	art.show(true); await new Promise((r) => setTimeout(r, 300)); out.again = host.querySelectorAll("canvas").length; art.show(false);
} catch (e) { out.errors.push(String(e)); }
window.result = out;`;

const srv = createServer((q, r) => {
	const u = q.url.split("?")[0];
	if (u === "/t.html") { r.writeHead(200, { "content-type": "text/html" }); return r.end(`<!doctype html><meta charset="utf-8"><script type="module" src="/t.js"></script>`); }
	if (u === "/t.js") { r.writeHead(200, { "content-type": "text/javascript" }); return r.end(TEST); }
	const f = join(web, u.replace(/^\/web\//, "")); // /web/worker/... -> web/worker/...
	if (u.startsWith("/web/worker/") && !u.includes("..") && existsSync(f)) { r.writeHead(200, { "content-type": f.endsWith(".js") ? "text/javascript" : "image/png" }); return r.end(readFileSync(f)); }
	r.writeHead(404).end();
});
await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const connect = async (url) => { for (let i = 0; i < 100; i++) { await sleep(150); try { const s = new WebSocket(await url()); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); return s; } catch {} } throw new Error("no browser"); };
const rpc = (ws) => { let id = 0; const pending = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } }; return (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); }); };

const port = 40000 + ((process.pid + 7) % 20000), prof = join(web, `build/ff-profile-lobby${process.pid}`); mkdirSync(prof, { recursive: true });
const ff = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${port}`], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } });
try {
	const send = rpc(await connect(async () => `ws://127.0.0.1:${port}/session`));
	await send("session.new", { capabilities: {} });
	const context = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	await send("browsingContext.navigate", { context, url: base + "/t.html", wait: "complete" });
	let res = null;
	for (let i = 0; i < 100 && !res; i++) {
		await sleep(100);
		const r = await send("script.evaluate", { expression: "window.result ? JSON.stringify(window.result) : ''", target: { context }, awaitPromise: false });
		if (r.result?.result?.value) res = JSON.parse(r.result.result.value);
	}
	if (!res) check(false, "the test page gave no result");
	else {
		check(res.errors.length === 0, `sprites load, every design draws with no error${res.errors.length ? ":\n      " + res.errors.join("\n      ") : ""}`);
		check(res.designs === 13, `13 designs (${res.designs})`);
		check(res.dark.length === 0, `no design is all black${res.dark.length ? ": " + res.dark.join(", ") : ""}`);
		check(res.shown === 1 && res.size === "480x480" && res.design.startsWith("5b"), `show(true): one 480x480 canvas (${res.shown}, ${res.size}, ${res.design})`);
		check(res.fading === 1 && res.after === 0 && res.again === 1, `show(false) fades it out and removes it after 3 s, show(true) brings it back (${res.fading}, ${res.after}, ${res.again})`);
	}
} finally {
	ff.kill(); srv.close();
	await new Promise((r) => ff.once("exit", r)); rmSync(prof, { recursive: true, force: true });
}
console.log(bad ? `lobby-art: ${bad} failed` : "lobby-art: ok");
process.exit(bad ? 1 : 0);
