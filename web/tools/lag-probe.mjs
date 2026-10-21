// lag-probe - One raw WebSocket player that walks back and forth and reports what the network does to it: key -> own move latency, gaps between views, bytes/s.
//   node tools/lag-probe.mjs PORT [SECONDS=40] [NAME=Probe] [--record FILE]      (point PORT at netem-proxy or straight at server.mjs)
// --record FILE: every view it gets, one per line as "ms<TAB>json", for tools/lag-replay.mjs.
import { WebSocket } from "ws";
import fs from "node:fs";
const port = Number(process.argv[2] ?? "8780"), secs = Number(process.argv[3] ?? "40"), name = process.argv[4] ?? "Probe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rec = process.argv.includes("--record") ? fs.createWriteStream(process.argv[process.argv.indexOf("--record") + 1]) : null, recT0 = performance.now();
const ws = new WebSocket(`ws://127.0.0.1:${port}`);
let bytes = 0, views = 0, merged = 0, lastView = 0, eye = null, pending = null, t0 = 0;
const gaps = [], lat = [], sizes = [];
ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: name, acks: 1 })));
ws.on("message", (d) => {
	const t = String(d), now = performance.now(); bytes += t.length;
	if (!t.startsWith('{"type":"view"')) return;
	rec?.write(`${Math.round(now - recT0)}\t${t}\n`);
	const m = JSON.parse(t); views++; sizes.push(t.length); merged += (m.update.merged ?? 1) - 1;
	ws.send(`{"type":"ack","s":${m.update.seq}}`); // as the page does
	if (lastView) gaps.push(now - lastView); lastView = now;
	const e = m.update.eyeTile;
	if (e && eye && (e.x !== eye.x || e.y !== eye.y) && pending) { lat.push(now - pending); pending = null; }
	if (e) eye = e;
});
const pct = (a, p) => a.length ? [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))] : NaN;
const f = (a) => `n=${a.length} p50 ${pct(a, .5).toFixed(0)} p95 ${pct(a, .95).toFixed(0)} p99 ${pct(a, .99).toFixed(0)} max ${pct(a, 1).toFixed(0)}`;
while (views < 5) await sleep(200);
t0 = performance.now(); const v0 = views, b0 = bytes; gaps.length = 0;
const dirs = ["EAST", "WEST"];
for (let i = 0; performance.now() - t0 < secs * 1000; i++) {
	const k = dirs[i & 1]; pending = performance.now();
	ws.send(JSON.stringify({ type: "key", key: k, down: true })); await sleep(80); ws.send(JSON.stringify({ type: "key", key: k, down: false }));
	await sleep(700); // a step is ~0.2-0.3 s; the pause keeps one probe from piling up
}
const s = (performance.now() - t0) / 1000;
console.log(`key -> own move (ms): ${f(lat)}`);
console.log(`view gaps (ms):       ${f(gaps)}`);
console.log(`views ${((views - v0) / s).toFixed(1)}/s, ${((bytes - b0) / 1024 / s).toFixed(1)} KB/s, view size p50 ${pct(sizes, .5)} max ${pct(sizes, 1)} bytes, ${merged} ticks merged into others`);
ws.close(); rec?.end(); await sleep(200); process.exit(0);
