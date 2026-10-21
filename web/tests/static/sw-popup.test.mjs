// sw-popup.test - the offline copy (?offline=1) serves popup.html to a sandboxed frame with the server stopped (headless Chromium, copy of web/dist).
// Usage: node tests/static/sw-popup.test.mjs   (copies dist to build/sw-popup-test, ~150 MB; about 1 minute)
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { cpSync, rmSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const copy = join(web, "build", "sw-popup-test"), prof = join(web, "build", "sw-popup-test-profile");
rmSync(copy, { recursive: true, force: true }); rmSync(prof, { recursive: true, force: true });
cpSync(join(web, "dist"), copy, { recursive: true });
const H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".ogg": "audio/ogg" };
const serve = (port) => new Promise((res) => { const s = createServer((q, r) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; const f = join(copy, p); if (!f.startsWith(copy) || !existsSync(f) || !statSync(f).isFile()) { r.writeHead(404).end(); return; } r.writeHead(200, { "content-type": mime[extname(f)] ?? "application/octet-stream" }).end(readFileSync(f)); }).listen(port, "127.0.0.1", () => res(s)); });
const PORT = 8495, URL0 = `http://127.0.0.1:${PORT}/`, dbg = 9337;
const srv = await serve(PORT);
const chrome = spawn(H, ["--no-sandbox", `--remote-debugging-port=${dbg}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
try {
	let list;
	for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json(); } catch {} }
	const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
	await new Promise((r) => (ws.onopen = r));
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
	const until = async (expr, secs, what) => { for (let i = 0; i < secs * 4; i++) { if (await ev(expr)) return true; await sleep(250); } console.log("timeout waiting for " + what); return false; };
	await send("Page.enable");
	// the same frame popups.js makes, loaded the same way (sandbox allow-scripts, src = popup.html next to the page); answers like the game does
	const probe = `new Promise((res)=>{const f=document.createElement("iframe");f.sandbox="allow-scripts";const t=setTimeout(()=>res("no popupReady"),8000);
		addEventListener("message",(e)=>{if(e.source!==f.contentWindow)return;if(e.data.popupReady)e.source.postMessage({popupHtml:"<b id=x>hi</b><script>parent.postMessage({ran:1},'*')<\\/script>"},"*");
		else if(e.data.popupWritten){}else if(e.data.ran){clearTimeout(t);res("ok")}});
		f.src=new URL("popup.html",document.baseURI).href;document.body.append(f)})`;

	await send("Page.navigate", { url: URL0 + "?offline=1" });
	const nFiles = JSON.parse(readFileSync(join(copy, "sw.js"), "utf8").match(/const MANIFEST = (.*);/)[1]).length;
	check(await until(`(async()=>{const k=await caches.keys();return k.length===1&&(await (await caches.open(k[0])).keys()).length===${nFiles}})()`, 240, "cache fill"), "first visit filled the cache");
	check(await until(`navigator.serviceWorker.controller !== null`, 30, "control"), "page is controlled by the service worker");
	check((await ev(probe)) === "ok", "online: popup frame loads popup.html and runs its script");

	await send("Page.navigate", { url: "about:blank" }); await sleep(500);
	srv.closeAllConnections(); await new Promise((r) => srv.close(r));
	await send("Page.navigate", { url: URL0 });
	check(await until(`!!document.getElementById("boot")`, 30, "index.html"), "offline: index.html loaded with the server stopped");
	check(await until(`navigator.serviceWorker.controller !== null`, 30, "control"), "offline: page is controlled");
	const r = await ev(probe);
	if (r !== "ok") console.log("frame tree: " + JSON.stringify((await send("Page.getFrameTree")).result.frameTree.childFrames?.map((c) => c.frame)));
	check(r === "ok", "offline: sandboxed popup frame loads popup.html from the cache and runs its script (" + r + ")");
} finally { chrome.kill(); srv.closeAllConnections?.(); srv.close(); }
console.log(bad ? `${bad} FAILED` : "all ok"); process.exit(bad ? 1 : 0);
