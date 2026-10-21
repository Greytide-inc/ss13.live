// lag-replay - Plays a recorded view stream (lag-probe --record) to one acking client through netem-proxy, the same every time, to compare server view handling on a bad link.
//   node tools/lag-replay.mjs FILE [--no-hold] [--no-pack] [--jb] [netem-proxy args: --delay MS --jitter MS --stall-every S --stall-ms MS --kbps N]
// --jb: the client holds views in worker/jitter-buffer.js as the page does, and age/gaps are taken when it lets them go.
// Prints how old what the client sees is (arrival - when the server made that tick, includes the one-way delay), the gaps between views, and how many ticks were merged.
import { WebSocketServer, WebSocket } from "ws";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { ViewQueue } from "./view-merge.mjs";
import { ViewPacker, ViewUnpacker } from "../worker/view-pack.js";
import { JitterBuffer } from "../worker/jitter-buffer.js";
const a = process.argv.slice(2), hold = !a.includes("--no-hold"), pack = !a.includes("--no-pack"), jb = a.includes("--jb"), netem = a.slice(1).filter((x) => !["--no-hold", "--no-pack", "--jb"].includes(x));
const recs = fs.readFileSync(a[0], "utf8").trim().split("\n").map((l) => { const i = l.indexOf("\t"); return [Number(l.slice(0, i)), JSON.parse(l.slice(i + 1)).update]; });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = Number(process.env.LAG_PORT ?? 8795), PROXY = PORT + 1; // LAG_PORT: two runs side by side
const wss = new WebSocketServer({ port: PORT });
const proxy = spawn("node", [new URL("./netem-proxy.mjs", import.meta.url).pathname, String(PROXY), String(PORT), ...netem], { stdio: "ignore" });
await sleep(400);
let t0 = 0, q = null;
wss.on("connection", (ws) => {
	ws.setMaxListeners?.(0);
	const packer = new ViewPacker();
	q = new ViewQueue((u) => ws.send(JSON.stringify({ type: "view", update: pack ? packer.pack(u) : u })), hold);
	ws.on("message", (d) => { const m = /"s":(\d+)/.exec(String(d)); if (m) q.ack(Number(m[1])); });
	t0 = performance.now();
	(async () => {
		for (const [t, u] of recs) { const w = t0 + t - recs[0][0] - performance.now(); if (w > 0) await sleep(w); q.push({ ...u, made: performance.now() - t0 }); }
	})();
});
const age = [], gaps = [];
let last = 0, n = 0, bytes = 0;
const ws = new WebSocket(`ws://127.0.0.1:${PROXY}`), unpacker = new ViewUnpacker();
const shown = (m) => { const now = performance.now(); age.push(now - t0 - m.update.made); if (last) gaps.push(now - last); last = now; };
const buf = jb ? new JitterBuffer(shown) : null;
ws.on("message", (d) => {
	const m = JSON.parse(String(d)); m.update = unpacker.unpack(m.update); n++; bytes += d.length;
	if (buf) buf.push(m, m.update.worldTime); else shown(m);
	ws.send(`{"type":"ack","s":${m.update.seq}}`);
});
const span = recs.at(-1)[0] - recs[0][0];
await sleep(span + 3000);
for (let i = 0; i < 200 && q.held; i++) await sleep(50);
const pct = (x, p) => x.length ? [...x].sort((u, v) => u - v)[Math.min(x.length - 1, Math.floor(x.length * p))] : NaN;
const f = (x) => `p50 ${pct(x, .5).toFixed(0)} p95 ${pct(x, .95).toFixed(0)} p99 ${pct(x, .99).toFixed(0)} max ${pct(x, 1).toFixed(0)}`;
console.log(`${hold ? "hold" : "no hold"}${pack ? "" : ", no pack"}${jb ? ", jitter buffer" : ""} ${netem.join(" ") || "(direct)"}: ${recs.length} ticks in ${(span / 1000).toFixed(0)} s, ${n} views (${q.merged} ticks merged), ${(bytes / 1024 / (span / 1000)).toFixed(1)} KB/s`);
console.log(`  age of what is shown (ms): ${f(age)}`);
console.log(`  gaps between views (ms):   ${f(gaps)}`);
if (buf) console.log(`  held in the buffer (ms):   ${f(buf.held)}`);
proxy.kill(); ws.close(); wss.close(); process.exit(0);
