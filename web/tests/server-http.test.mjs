// server-http (hosting): what tools/server.mjs's HTTP side sends a browser. Every answer has nosniff and same-site-only framing;
// every file is "no-cache" with an ETag: a returning player's browser keeps its copy and asks once per file, getting a short 304
// while the file is unchanged, so a deploy reaches players at once and nothing old mixes with new code. Icons and sounds (tg's own
// art, ~2000 files, almost never changed) are the exception: the browser uses its copy without asking, for up to an hour (then it
// checks in the background). index.html carries the <meta name="ss13-server"> marker, so the page plays on this server with no
// ?server= in the link. /status says how many are on, the map and the round (JSON, any site may read it, no names). The test scenarios (web/scenarios/, kept out of the public repo too) are not served. With nobody connected for --empty-reset seconds the server starts a fresh world.
// Runs server.mjs on a tiny fake dist (its game thread does nothing), no build needed. Usage (from web/): node tests/server-http.test.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { WebSocket } from "ws";

let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const dist = fs.mkdtempSync(path.join(os.tmpdir(), "server-http-"));
fs.mkdirSync(path.join(dist, "web/build/dist/src/worker"), { recursive: true });
fs.writeFileSync(path.join(dist, "web/build/dist/src/worker/boot-worker.js"), "setInterval(() => {}, 1e9);\n");
fs.writeFileSync(path.join(dist, "index.html"), `<!doctype html>\n<html lang="en">\n<meta charset="utf-8">\n<title>x</title>\n`);
fs.writeFileSync(path.join(dist, "sw.js"), "// sw\n");
fs.writeFileSync(path.join(dist, "a.png"), "png");
fs.mkdirSync(path.join(dist, "web/scenarios"), { recursive: true });
fs.writeFileSync(path.join(dist, "web/scenarios/s.txt"), "scenario\n");
for (const d of ["icons", "sound"]) fs.mkdirSync(path.join(dist, d));
fs.writeFileSync(path.join(dist, "icons/x.dmi"), "dmi"); fs.writeFileSync(path.join(dist, "sound/x.ogg"), "ogg");
const port = 8700 + Math.floor(Math.random() * 80);
const srv = spawn(process.execPath, ["tools/server.mjs", "--dist", dist, "--port", String(port), "--log", path.join(dist, "server.log"), "--empty-reset", "1"], { stdio: "ignore" });
try {
	let up = false;
	for (let i = 0; i < 50 && !up; i++) { await new Promise((r) => setTimeout(r, 100)); up = await fetch(`http://127.0.0.1:${port}/sw.js`).then(() => true, () => false); }
	check(up, "server answers");
	const get = (p) => fetch(`http://127.0.0.1:${port}${p}`);
	const page = await get("/"), sw = await get("/sw.js"), png = await get("/a.png"), missing = await get("/nope.png");
	for (const [name, r] of [["/", page], ["/sw.js", sw], ["/a.png", png], ["404", missing]]) {
		check(r.headers.get("x-content-type-options") === "nosniff", `${name}: X-Content-Type-Options nosniff`);
		check(r.headers.get("x-frame-options") === "SAMEORIGIN", `${name}: X-Frame-Options SAMEORIGIN (the game's own popup frames load; other sites can't frame it)`);
	}
	for (const p of ["/web/scenarios/s.txt", "/web//scenarios/s.txt", "/web/x/../scenarios/s.txt", "/web/Scenarios/s.txt"]) check((await get(p)).status === 404, `${p}: not served (test scenarios stay private)`);
	check(page.headers.get("cache-control") === "no-cache", "/: Cache-Control no-cache");
	check(sw.headers.get("cache-control") === "no-cache", "/sw.js: Cache-Control no-cache");
	check(png.headers.get("cache-control") === "no-cache" && !!png.headers.get("etag"), "/a.png: no-cache with an ETag");
	const again = await fetch(`http://127.0.0.1:${port}/a.png`, { headers: { "If-None-Match": png.headers.get("etag") ?? "" } });
	check(again.status === 304 && (await again.text()) === "", "/a.png again with its ETag: 304, no body");
	const pageAgain = await fetch(`http://127.0.0.1:${port}/`, { headers: { "If-None-Match": page.headers.get("etag") ?? "" } });
	check(pageAgain.status === 304, "/ again with its ETag: 304");
	const html = await page.text();
	check(/<meta charset="utf-8">\n?<meta name="ss13-server" content="1">/.test(html), "index.html carries the ss13-server marker after <meta charset>");
	check(Number(page.headers.get("content-length")) === Buffer.byteLength(html), "index.html Content-Length matches the marked page");
	const head = await fetch(`http://127.0.0.1:${port}/index.html`, { method: "HEAD" });
	check(Number(head.headers.get("content-length")) === Buffer.byteLength(html), "HEAD /index.html: same length");
	for (const p of ["/icons/x.dmi", "/sound/x.ogg"]) {
		const r = await get(p);
		check(/^public, max-age=3600, stale-while-revalidate=\d+$/.test(r.headers.get("cache-control") ?? "") && !!r.headers.get("etag"), `${p}: cached an hour without asking (${r.headers.get("cache-control")})`);
	}
	// an empty server: no fresh world before anyone came; one --empty-reset after the last player left
	const log = () => fs.readFileSync(path.join(dist, "server.log"), "utf8");
	await new Promise((r) => setTimeout(r, 1500));
	check(!/starting world 2/.test(log()), "nobody has joined yet: no fresh world");
	// /status (plans/site.md step 1): what the landing page on another address shows, no names
	const status = async () => { const r = await get("/status"); return { r, j: await r.json().catch(() => null) }; };
	const st0 = await status();
	check(st0.r.status === 200 && st0.j?.players === 0 && st0.j?.round === 1 && "map" in st0.j && st0.j?.started === false, `/status: nobody on, round 1, not started (${JSON.stringify(st0.j)})`);
	check(st0.r.headers.get("access-control-allow-origin") === "*" && st0.r.headers.get("cache-control") === "no-store", "/status: readable from any site, never cached");
	const ws = new WebSocket(`ws://127.0.0.1:${port}`);
	await new Promise((r) => ws.on("open", r));
	ws.send(JSON.stringify({ type: "hello", player: "Visitor" }));
	await new Promise((r) => setTimeout(r, 1500));
	check(!/starting world 2/.test(log()), "a player still connected: no fresh world");
	const st1 = await status();
	check(st1.j?.players === 1 && !JSON.stringify(st1.j).includes("Visitor"), `/status: one player on, no names (${JSON.stringify(st1.j)})`);
	ws.close();
	await new Promise((r) => setTimeout(r, 2000));
	check(/nobody connected for 1 s: a fresh world[^\n]*\n[^\n]*starting world 2 for 0 connected/.test(log()), "the last player left: a fresh world after --empty-reset");
	const st2 = await status();
	check(st2.j?.players === 0 && st2.j?.round === 2, `/status: after the fresh world, round 2 (${JSON.stringify(st2.j)})`);
} finally {
	srv.kill("SIGTERM");
	await new Promise((r) => setTimeout(r, 300));
	fs.rmSync(dist, { recursive: true, force: true });
}
console.log(bad ? `${bad} FAILED` : "all ok");
process.exit(bad ? 1 : 0);
