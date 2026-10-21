// sw.test - headless Chromium against a copy of web/dist (needs `npm run build:static` first): first load fills the cache with
// progress shown, with the server stopped the page still loads and the world starts, a rebuilt copy swaps the cache, IndexedDB survives.
// also reloads the page offline when dist ships build/translated-tg.js (translated is the only mode).
// Usage: node tests/static/sw.test.mjs   (copies dist to build/sw-test, ~150 MB; about 2-3 minutes)
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { cpSync, rmSync, readFileSync, appendFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeSw } from "../../tools/write-sw.mjs";

const web = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const copy = join(web, "build", "sw-test"), prof = join(web, "build", "sw-test-profile");
rmSync(copy, { recursive: true, force: true }); rmSync(prof, { recursive: true, force: true });
cpSync(join(web, "dist"), copy, { recursive: true });
const H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".ogg": "audio/ogg" };
let hits = 0;
const serve = (port) => new Promise((res) => { const s = createServer((q, r) => { hits++; let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html"; const f = join(copy, p); if (!f.startsWith(copy) || !existsSync(f) || !statSync(f).isFile()) { r.writeHead(404).end(); return; } r.writeHead(200, { "content-type": mime[extname(f)] ?? "application/octet-stream" }).end(readFileSync(f)); }).listen(port, "127.0.0.1", () => res(s)); });
const PORT = 8494, URL0 = `http://127.0.0.1:${PORT}/`;
let srv = await serve(PORT);
const dbg = 9336;
const chrome = spawn(H, ["--no-sandbox", `--remote-debugging-port=${dbg}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
try {
	let list;
	for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json(); } catch {} }
	const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
	await new Promise((r) => (ws.onopen = r));
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	const ev = async (expression) => { const r = (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result; return r?.result?.value; };
	const until = async (expr, secs, what) => { for (let i = 0; i < secs * 4; i++) { if (await ev(expr)) return true; await sleep(250); } console.log("timeout waiting for " + what); return false; };
	await send("Page.enable");
	const cacheInfo = `(async()=>{const ks=await caches.keys();const o={};for(const k of ks)o[k]=(await (await caches.open(k)).keys()).length;return JSON.stringify(o)})()`;

	// 1. first visit
	await send("Page.navigate", { url: URL0 + "?offline=1" }); // the copy is opt-in; remembered for the later visits
	let sawProgress = false;
	for (let i = 0; i < 240 * 4; i++) { const t = await ev(`document.getElementById("loading-stage")?.textContent || ""`); if (/\d+ \/ \d+ MB/.test(t)) sawProgress = true; if (/Game code loaded|World created|Round starting|In the lobby/.test(t) || !(await ev(`!!document.getElementById("loading")`))) break; await sleep(250); }
	const nFiles = JSON.parse(readFileSync(join(copy, "sw.js"), "utf8").match(/const MANIFEST = (.*);/)[1]).length;
	const v1 = readFileSync(join(copy, "sw.js"), "utf8").match(/const VERSION = "(\w+)"/)[1];
	check(sawProgress, "loading screen showed 'N / M MB' download progress");
	let ci = JSON.parse(await ev(cacheInfo));
	check(ci["ss13-" + v1] === nFiles && Object.keys(ci).length === 1, `first visit filled cache ss13-${v1} with all ${nFiles} files: ${JSON.stringify(ci)}`);
	check(await ev(`navigator.serviceWorker.controller !== null`), "page is controlled by the service worker");
	await ev(`new Promise((res)=>{const r=indexedDB.open("sw-test-keep",1);r.onupgradeneeded=()=>r.result.createObjectStore("s");r.onsuccess=()=>{r.result.transaction("s","readwrite").objectStore("s").put("saved","k").oncomplete=()=>res(1)}})`);

	// 2. server stopped: page loads, the world starts
	await send("Page.navigate", { url: "about:blank" }); await sleep(500);
	srv.closeAllConnections(); await new Promise((r) => srv.close(r));
	await send("Page.navigate", { url: URL0 });
	check(await until(`!!document.getElementById("boot")`, 30, "index.html"), "offline: index.html loaded with the server stopped");
	check(await until(`window.bootResult && window.bootResult.milestones && window.bootResult.milestones.loaded !== undefined`, 240, "world start"), "offline: the game code loaded and the world started (milestone 'loaded'); " + JSON.stringify(await ev(`JSON.stringify(window.bootResult.milestones)`)));
	check(!(await ev(`document.body.innerText.includes("The game stopped")`)), "offline: no error on screen");
	if (existsSync(join(copy, "web/build/world-snap.json"))) { // the pre-started world is precached like the rest
		const man = JSON.parse(readFileSync(join(copy, "sw.js"), "utf8").match(/const MANIFEST = (.*);/)[1]).map((m) => m[0]);
		check(man.includes("web/build/world.snap.gz") && man.includes("web/build/world-snap.json"), "the snapshot (world.snap.gz, world-snap.json) is in the precache manifest");
		check(await until(`window.bootResult.milestones.snapshot !== undefined`, 120, "snapshot load"), "offline: the world snapshot loaded from the cache; " + JSON.stringify(await ev(`JSON.stringify(window.bootResult.lines.filter((l) => /snapshot (loaded|not used)/.test(l)).map((l) => l.slice(0, 120)))`)));
	}
	if (existsSync(join(copy, "web/build/translated-tg.js"))) { // a second offline load works too (the translated code is precached)
		await send("Page.navigate", { url: "about:blank" }); await sleep(500);
		await send("Page.navigate", { url: URL0 + "index.html" });
		check(await until(`window.bootResult && window.bootResult.milestones && window.bootResult.milestones.translated !== undefined && window.bootResult.milestones.snapshot !== undefined`, 180, "translated start"), "offline: a second load ran the translated code and the snapshot from the cache; " + JSON.stringify(await ev(`JSON.stringify(window.bootResult.lines.filter((l) => /translated:|snapshot (loaded|not used)|FATAL/.test(l)).map((l) => l.slice(0, 120)))`)));
	}
	await send("Page.navigate", { url: "about:blank" }); await sleep(500);

	// 3. rebuild with a changed file
	appendFileSync(join(copy, "html", "changelog.css"), "\n/* sw-test change */\n");
	const v2 = writeSw(copy);
	check(v2 !== v1, `rebuild changed the version ${v1} -> ${v2}`);
	srv = await serve(PORT);
	await send("Page.navigate", { url: URL0 });
	check(await until(`(async()=>{const k=await caches.keys();return k.length===1&&k[0]==="ss13-${v2}"})()`, 120, "cache swap"), "new build replaced the old cache");
	ci = JSON.parse(await ev(cacheInfo));
	check(ci["ss13-" + v2] === nFiles && Object.keys(ci).length === 1, "only the new cache remains, complete: " + JSON.stringify(ci));
	await until(`!!document.getElementById("boot")`, 30, "page");
	check((await ev(`fetch("./html/changelog.css").then(r=>r.text())`)).includes("sw-test change"), "the changed file is served new (no old/new mixing)");
	check(await ev(`new Promise((res)=>{const r=indexedDB.open("sw-test-keep");r.onsuccess=()=>{const g=r.result.transaction("s").objectStore("s").get("k");g.onsuccess=()=>res(g.result==="saved")}})`), "IndexedDB data survived the cache update");

	// 4. failed download: server missing one file -> no half cache is used, game still starts online
	await send("Page.navigate", { url: "about:blank" }); await sleep(500);
	appendFileSync(join(copy, "html", "changelog.css"), "\n/* second change */\n");
	const v3 = writeSw(copy);
	const real = join(copy, "html", "changelog.html"); // make one manifest file 404
	const bak = readFileSync(real); rmSync(real);
	await send("Page.navigate", { url: URL0 });
	await until(`document.getElementById("loading-stage")?.textContent.includes("didn't finish") || !document.getElementById("loading")`, 120, "failure notice");
	ci = JSON.parse(await ev(cacheInfo));
	check(!!ci["ss13-" + v2], "failed update left the working cache active: " + JSON.stringify(ci));
	check(!(await ev(`fetch("./html/changelog.css").then(r=>r.text())`)).includes("second change"), "half-downloaded build is not served");

	// 5. ?nocache=1 (turns the remembered ?offline=1 off): removes the service worker and its caches, page loads from the server, saves kept
	writeFileSync(real, bak);
	await send("Page.navigate", { url: "about:blank" }); await sleep(500);
	await send("Page.navigate", { url: URL0 + "?nocache=1" });
	check(await until(`(async()=>(await navigator.serviceWorker.getRegistrations()).length===0 && (await caches.keys()).length===0 && !!document.getElementById("boot"))()`, 60, "nocache cleanup"), "nocache: service worker and caches removed");
	check(await until(`navigator.serviceWorker.controller === null`, 30, "uncontrolled page"), "nocache: page served by the server, not the old copy");
	check(await ev(`new Promise((res)=>{const r=indexedDB.open("sw-test-keep");r.onsuccess=()=>{const g=r.result.transaction("s").objectStore("s").get("k");g.onsuccess=()=>res(g.result==="saved")}})`), "nocache: IndexedDB saves kept");

	// 6. default (no ?offline=1 since the ?nocache=1 above): plain visits keep no copy
	await send("Page.navigate", { url: "about:blank" }); await sleep(500);
	await send("Page.navigate", { url: URL0 });
	check(await until(`!!document.getElementById("boot")`, 30, "plain visit"), "default: page loaded");
	await sleep(3000);
	check(await ev(`(async()=>(await navigator.serviceWorker.getRegistrations()).length===0 && (await caches.keys()).length===0)()`), "default: no service worker and no copy kept");
} finally { chrome.kill(); srv.closeAllConnections?.(); srv.close(); }
console.log(bad ? `${bad} FAILED` : "all ok"); process.exit(bad ? 1 : 0);
