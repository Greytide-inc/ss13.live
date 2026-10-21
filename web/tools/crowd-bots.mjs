// crowd-bots - A crowd of raw WebSocket players for load tests: each joins like the page (acks, pack, a ping a second), wanders in random directions and says a line now and then; prints key -> own move latency, view gaps and bytes/s over the whole crowd.
//   node tools/crowd-bots.mjs URL COUNT [SECONDS=60] [--prefix Bot] [--join-every MS=400]      (URL like ws://127.0.0.1:8780; start the server with --spawn-near --roundstart)
// The server's own cost per tick is in its log: the "[vm-boot] live:" lines. Up to 8 bots per outside address (MAX_PER_IP): run from this machine or through an ssh -L to it.
import { WebSocket } from "ws";
const argv = process.argv.slice(2), opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const url = argv[0], count = Number(argv[1]), secs = Number(argv[2] && !argv[2].startsWith("--") ? argv[2] : 60), prefix = opt("--prefix", "Bot"), joinEvery = Number(opt("--join-every", "400"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lat = [], gaps = [];
let bytes = 0, views = 0, joined = 0, closed = 0, measuring = false;
const LINES = ["hello", "anyone here?", "where is the bar", "nice", "help maint", "lol", "who has tools"];
const DIRS = ["NORTH", "SOUTH", "EAST", "WEST"];
async function bot(i) {
	const ws = new WebSocket(url);
	let eye = null, pending = 0, lastView = 0, got = 0, alive = true;
	ws.on("close", () => { if (alive) closed++; alive = false; });
	ws.on("error", () => {});
	ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: `${prefix}${i}`, acks: 1, pack: 1 })));
	ws.on("message", (d) => {
		const t = String(d), now = performance.now();
		if (measuring) bytes += t.length;
		if (!t.startsWith('{"type":"view"')) return;
		const m = JSON.parse(t); got++;
		ws.send(`{"type":"ack","s":${m.update.seq}}`);
		if (measuring) { views++; if (lastView) gaps.push(now - lastView); }
		lastView = now;
		const e = m.update.eyeTile;
		if (e && eye && (e.x !== eye.x || e.y !== eye.y) && pending) { if (measuring) lat.push(now - pending); pending = 0; }
		if (e) eye = e;
	});
	const ping = setInterval(() => { if (ws.readyState === 1) ws.send(`{"type":"ping","t":${Date.now()}}`); }, 1000);
	while (alive && got < 3) await sleep(200);
	if (!alive) { clearInterval(ping); return; }
	joined++;
	let dir = DIRS[i % 4];
	while (alive && !done) {
		if (Math.random() < 0.3) dir = DIRS[Math.floor(Math.random() * 4)];
		pending = performance.now();
		ws.send(JSON.stringify({ type: "key", key: dir, down: true })); await sleep(80);
		ws.send(JSON.stringify({ type: "key", key: dir, down: false }));
		if (Math.random() < 0.03) ws.send(JSON.stringify({ type: "command", text: `say "${LINES[Math.floor(Math.random() * LINES.length)]}"` }));
		await sleep(300 + Math.random() * 400);
	}
	clearInterval(ping); ws.close();
}
let done = false;
const pct = (a, p) => (a.length ? [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))] : NaN);
const f = (a) => `p50 ${pct(a, 0.5).toFixed(0)} p95 ${pct(a, 0.95).toFixed(0)} p99 ${pct(a, 0.99).toFixed(0)} max ${pct(a, 1).toFixed(0)} (n=${a.length})`;
const bots = [];
for (let i = 1; i <= count; i++) { bots.push(bot(i)); await sleep(joinEvery); }
for (let w = 0; joined + closed < count && w < 300; w++) await sleep(200);
console.log(`${joined}/${count} joined, ${closed} closed; measuring ${secs} s`);
measuring = true; const t0 = performance.now();
await sleep(secs * 1000);
measuring = false; const s = (performance.now() - t0) / 1000;
console.log(`key -> own move (ms): ${f(lat)}`);
console.log(`view gaps (ms):       ${f(gaps)}`);
console.log(`per bot: ${(views / s / Math.max(1, joined)).toFixed(1)} views/s, ${(bytes / 1024 / s / Math.max(1, joined)).toFixed(1)} KB/s; whole crowd ${((bytes * 8) / 1e6 / s).toFixed(2)} Mbps; ${closed} closed by the server`);
done = true; await Promise.all(bots); await sleep(300); process.exit(0);
