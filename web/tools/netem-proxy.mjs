// netem-proxy - A TCP proxy that adds delay, jitter, stalls and a bandwidth cap, to test the game server as if over the internet (no sudo, unlike tc).
//   node tools/netem-proxy.mjs LISTEN_PORT TARGET_PORT [--delay MS] [--jitter MS] [--stall-every S --stall-ms MS] [--kbps N]
// --delay is one way (ping = twice it). Order is kept, like TCP: a "lost packet" shows up as a --stall (everything waits). Works for browsers too.
import net from "node:net";
const a = process.argv.slice(2), opt = (n, d) => { const i = a.indexOf(n); return i < 0 ? d : Number(a[i + 1]); };
const [listen, target] = [Number(a[0]), Number(a[1])];
const delay = opt("--delay", 0), jitter = opt("--jitter", 0), stallEvery = opt("--stall-every", 0), stallMs = opt("--stall-ms", 0), kbps = opt("--kbps", 0);
// one direction: chunks leave in order, each no earlier than its arrival + delay (+ jitter), the cap and any stall
function pipe(from, to) {
	let last = 0, nextStall = stallEvery ? Date.now() + stallEvery * 1000 * (0.5 + Math.random()) : Infinity, wire = 0, timer = null;
	const q = []; // [leaveAt, chunk], leaveAt never goes down: one timer drains it in order
	const drain = () => {
		timer = null;
		while (q.length && q[0][0] <= Date.now()) { const [, d] = q.shift(); if (!to.destroyed) to.write(d); }
		if (q.length) timer = setTimeout(drain, Math.max(0, q[0][0] - Date.now()));
	};
	from.on("data", (d) => {
		const now = Date.now();
		let at = now + delay + Math.random() * jitter;
		if (kbps) { wire = Math.max(wire, now) + d.length / (kbps * 128) * 1000; at = Math.max(at, wire); }
		if (now >= nextStall) { at += stallMs; nextStall = now + stallEvery * 1000 * (0.5 + Math.random()); }
		at = Math.max(at, last); last = at;
		q.push([at, d]);
		if (!timer) timer = setTimeout(drain, Math.max(0, at - now));
	});
	from.on("close", () => setTimeout(() => to.destroy(), Math.max(0, last - Date.now()) + 5));
	from.on("error", () => {});
}
net.createServer((c) => { c.setNoDelay(true); const s = net.connect(target, "127.0.0.1"); s.setNoDelay(true); pipe(c, s); pipe(s, c); s.on("error", () => c.destroy()); })
	// this machine only: a raw TCP pipe adds no X-Forwarded-For, so a LAN player through it would look like the host (admin). A LAN lag test needs an HTTP proxy.
	.listen(listen, "127.0.0.1", () => console.log(`[netem] :${listen} -> :${target} delay ${delay}ms jitter ${jitter}ms stall ${stallMs}ms/${stallEvery}s cap ${kbps || "none"} kbps`));
