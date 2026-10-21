// ws-measure - bytes per message type per player on a running tools/server.mjs (wire-size step 1). Two raw WebSocket players, hello as the page
// sends it (acks 1, pack 1). Alpha joins, Beta late-joins; phases per player: join (first 15 s after its hello), stand (30 s), walk (60 s, Alpha
// walks back and forth, Beta watches). Prints a table of KB per type per phase and of what the `view` bytes are made of (per update key).
// "wire KB" is what really came over the socket (after the server's deflate, step 2); "deflate ms" re-compresses Alpha's messages the way the
// server does (one stream per player, flushed per message) and times it: the server's compression cost for one player.
//   node tools/ws-measure.mjs PORT [--walk-seconds 60]      (start the server with --spawn-near)
import { WebSocket } from "ws";
import zlib from "node:zlib";
const argv = process.argv.slice(2);
const port = Number(argv[0] ?? "8780");
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const WALK = Number(opt("--walk-seconds", "60")) * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PHASES = ["join", "stand", "walk"];
function player(name) {
	const p = { name, ws: new WebSocket(`ws://127.0.0.1:${port}`), phase: "join", views: 0, t: {}, tviews: {}, keys: {}, secs: {}, phaseAt: Date.now(), wire: {}, wireAt: 0, texts: [] };
	for (const ph of PHASES) { p.t[ph] = {}; p.tviews[ph] = 0; p.keys[ph] = {}; p.secs[ph] = 0; }
	const read = () => p.ws._socket?.bytesRead ?? 0;
	p.setPhase = (ph) => { p.wire[p.phase] = (p.wire[p.phase] ?? 0) + read() - p.wireAt; p.wireAt = read(); p.secs[p.phase] += (Date.now() - p.phaseAt) / 1000; p.phase = ph; p.phaseAt = Date.now(); };
	p.ws.on("open", () => p.ws.send(JSON.stringify({ type: "hello", player: name, acks: 1, pack: 1 })));
	p.ping = setInterval(() => { if (p.ws.readyState === 1) p.ws.send(`{"type":"ping","t":${Date.now()}}`); }, 1000); // the page pings once a second; a silent page is closed
	p.ws.on("message", (d) => {
		const s = String(d), len = Buffer.byteLength(s), m = JSON.parse(s);
		if (!p.t[p.phase]) return; // after the last phase
		if (m.type !== "log") p.texts.push([p.phase, s]); // log only goes to players on the server's machine
		const row = (p.t[p.phase][m.type] ??= { n: 0, bytes: 0 }); row.n++; row.bytes += len;
		if (m.type === "view") {
			p.views++; p.tviews[p.phase]++;
			p.ws.send(`{"type":"ack","s":${m.update.seq}}`);
			for (const [k, v] of Object.entries(m.update)) p.keys[p.phase][k] = (p.keys[p.phase][k] ?? 0) + Buffer.byteLength(JSON.stringify(v) ?? "");
		}
	});
	return p;
}
const key = (p, k) => { p.ws.send(JSON.stringify({ type: "key", key: k, down: true })); setTimeout(() => p.ws.send(JSON.stringify({ type: "key", key: k, down: false })), 60); };

const A = player("Alpha");
while (A.views < 5) await sleep(200);
console.log("Alpha has views");
const B = player("Beta");
for (const p of [A, B]) p.phaseAt = Date.now();
A.phase = "join"; A.setPhase("join");
// Beta's join phase starts at its hello; Alpha's was already running, so Alpha's table starts here too (Alpha's own first 15 s is the "join" of a first player, in the next run line)
await sleep(15000);
for (const p of [A, B]) p.setPhase("stand");
await sleep(30000);
for (const p of [A, B]) p.setPhase("walk");
const end = Date.now() + WALK;
const dirs = ["EAST", "EAST", "EAST", "EAST", "WEST", "WEST", "WEST", "WEST"];
for (let i = 0; Date.now() < end; i++) { key(A, dirs[i % dirs.length]); await sleep(300); }
for (const p of [A, B]) p.setPhase("done");
const kb = (n) => (n / 1024).toFixed(1).padStart(8);
for (const p of [A, B]) {
	console.log(`\n== ${p.name}: KB per type (n = messages), then KB/s`);
	const types = [...new Set(PHASES.flatMap((ph) => Object.keys(p.t[ph])))].sort();
	console.log("type".padEnd(16) + PHASES.map((ph) => ph.padStart(18)).join(""));
	for (const ty of types) console.log(ty.padEnd(16) + PHASES.map((ph) => { const r = p.t[ph][ty]; return r ? `${kb(r.bytes)} (${String(r.n).padStart(4)})` .padStart(18) : "".padStart(18); }).join(""));
	const tot = (ph) => Object.values(p.t[ph]).reduce((a, r) => a + r.bytes, 0);
	console.log("total KB".padEnd(16) + PHASES.map((ph) => kb(tot(ph)).padStart(18)).join(""));
	console.log("seconds".padEnd(16) + PHASES.map((ph) => p.secs[ph].toFixed(0).padStart(18)).join(""));
	console.log("wire KB".padEnd(16) + PHASES.map((ph) => kb(p.wire[ph] ?? 0).padStart(18)).join("") + `   (deflate ${p.ws.extensions.includes("permessage-deflate") ? "on" : "off"})`);
	console.log("wire KB/s".padEnd(16) + PHASES.map((ph) => ((p.wire[ph] ?? 0) / 1024 / (p.secs[ph] || 1)).toFixed(1).padStart(18)).join(""));
	console.log("KB/s".padEnd(16) + PHASES.map((ph) => (tot(ph) / 1024 / (p.secs[ph] || 1)).toFixed(1).padStart(18)).join(""));
	console.log(`view updates by key (KB, per phase):`);
	const keys = [...new Set(PHASES.flatMap((ph) => Object.keys(p.keys[ph])))].sort((a, b) => PHASES.reduce((t, ph) => t + (p.keys[ph][b] ?? 0) - (p.keys[ph][a] ?? 0), 0));
	for (const k of keys.slice(0, 12)) console.log("  " + k.padEnd(14) + PHASES.map((ph) => kb(p.keys[ph][k] ?? 0).padStart(18)).join(""));
}
for (const p of [A, B]) { clearInterval(p.ping); p.ws.close(); }
for (const level of [1, 6]) {
	const z = zlib.createDeflateRaw({ level }), inp = {}, out = {}; let ph = "", ms = 0;
	z.on("data", (b) => { out[ph] = (out[ph] ?? 0) + b.length; });
	for (const [phase, s] of A.texts) {
		ph = phase; inp[ph] = (inp[ph] ?? 0) + Buffer.byteLength(s);
		const t0 = process.hrtime.bigint(); z.write(s); await new Promise((r) => z.flush(zlib.constants.Z_SYNC_FLUSH, r)); ms += Number(process.hrtime.bigint() - t0) / 1e6;
	}
	const secs = PHASES.reduce((t, p) => t + A.secs[p], 0);
	console.log(`Alpha without log, deflate level ${level}: ` + PHASES.map((p) => `${p} ${(inp[p] / 1024).toFixed(0)} -> ${(out[p] / 1024).toFixed(1)} KB (${(out[p] / 1024 / A.secs[p]).toFixed(2)} KB/s)`).join(", ") + `; ${ms.toFixed(0)} ms for ${secs.toFixed(0)} s of play (${(ms / secs / 10).toFixed(2)}% of one core per player, wall time)`);
}
process.exit(0);
