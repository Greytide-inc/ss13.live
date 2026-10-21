// ws-client-test - tiny client for tools/server.mjs: connects, counts messages per type and bytes, exits 0 if it got log
// messages and (after the server's player joined) view updates.
//   node tools/ws-client-test.mjs [--url ws://127.0.0.1:8780] [--seconds 120] [--wait 90] [--name wstest] [--key HOSTKEY]
// --key: the server's --host-key (log messages only go to admins).
// --wait: keep retrying the connection for this many seconds (the server may still be starting).
import { WebSocket } from "ws"; // Node 20's own (--experimental-websocket) never connected here: it exited 0 with no output
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const url = opt("--url", "ws://127.0.0.1:8780"), secs = Number(opt("--seconds", "120")), waitS = Number(opt("--wait", "60"));
const counts = {}, bytes = {};
let total = 0, firstView = 0, t0 = 0, milestones = [], viewBytesAfterFirst = 0, lastReport = 0;
function connect(deadline) {
	const ws = new WebSocket(url);
	ws.onerror = () => {};
	ws.onclose = () => { if (!t0) { if (Date.now() < deadline) setTimeout(() => connect(deadline), 1000); else { console.log("never connected"); process.exit(1); } } };
	ws.onopen = () => { t0 = Date.now(); console.log("connected"); ws.send(JSON.stringify({ type: "hello", player: opt("--name", "wstest"), secret: opt("--key", undefined) })); setTimeout(finish, secs * 1000); }; // the server closes a connection that sends no hello
	ws.onmessage = (e) => {
		const s = String(e.data), m = JSON.parse(s);
		counts[m.type] = (counts[m.type] ?? 0) + 1;
		bytes[m.type] = (bytes[m.type] ?? 0) + s.length;
		total += s.length;
		if (m.type === "milestone") { milestones.push(m.name); console.log(`${((Date.now() - t0) / 1000).toFixed(0)}s milestone ${m.name}`); }
		if (m.type === "view" && !firstView) { firstView = Date.now(); console.log(`${((Date.now() - t0) / 1000).toFixed(0)}s first view (${s.length} bytes, player ${m.player})`); }
		if (m.type === "view" && firstView) viewBytesAfterFirst += s.length;
		if (Date.now() - lastReport > 20000) { lastReport = Date.now(); console.log(`${((Date.now() - t0) / 1000).toFixed(0)}s ${JSON.stringify(counts)}`); }
	};
}
function finish() {
	const dt = (Date.now() - t0) / 1000, vt = firstView ? (Date.now() - firstView) / 1000 : 0;
	console.log(`done after ${dt.toFixed(0)} s: messages ${JSON.stringify(counts)}; bytes ${JSON.stringify(bytes)}; total ${(total / dt).toFixed(0)} B/s; view ${vt ? (viewBytesAfterFirst / vt).toFixed(0) : 0} B/s over ${vt.toFixed(0)} s; milestones ${milestones.join(",")}`);
	process.exit(counts.log && counts.view ? 0 : 1);
}
connect(Date.now() + waitS * 1000);
