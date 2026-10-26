// vote-address-check - one vote per address (plans/server-rules.md step 3) on a real server: Alice and Bob join from their own
//   addresses, Mal from one address under three names. Mal starts a shuttle vote and votes "Call the shuttle" from two tabs, the third
//   stays silent; Alice votes "Keep playing", Bob votes "Call". The count must be Call 2 (Mal once, Bob), Keep 1 (Alice; Mal's silent
//   tab is not a non-voter, his address voted), and Mal's second tab is told someone at his address already voted.
//   node tools/vote-address-check.mjs [DIST=build/voteaddr-dist] [PORT=8794]      exit 0 = all checks passed (~2 min: game start + the 60 s vote)
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
const dist = process.argv[2] ?? "build/voteaddr-dist", port = Number(process.argv[3] ?? "8794");
const logFile = `build/server-${port}.log`, pepperFile = `build/vote-address-check-${port}.pepper`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[voteaddr] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "400", "--pepper", pepperFile, "--log", logFile], { stdio: "ignore" });
await sleep(2500);
const connect = (name, xff, trip) => new Promise((res) => {
	const ws = new WebSocket(`ws://127.0.0.1:${port}`, { headers: { "X-Forwarded-For": xff } });
	const r = { ws, you: null, refused: null, closed: false, stat: false, html: [], text: [] };
	ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: name, trip })));
	ws.on("message", (d) => {
		const m = JSON.parse(String(d));
		if (m.type === "you") r.you = m;
		else if (m.type === "refused") r.refused = m.reason;
		else if (m.type === "stat") r.stat = true;
		else if (m.type === "browse" && typeof m.html === "string") r.html.push(m.html);
		else if (m.type !== "view") { const t = JSON.stringify(m); try { r.text.push(decodeURIComponent(t)); } catch { r.text.push(t); } }
	});
	ws.on("close", () => { r.closed = true; });
	ws.on("error", () => {});
	setTimeout(() => res(r), 1500);
});
const send = (p, m) => p.ws.send(JSON.stringify(m));
const until = async (f, s) => { for (let i = 0; i < s * 2 && !f(); i++) await sleep(500); return f(); };
const alice = await connect("Alice", "198.51.100.1", "alices-secret");
const bob = await connect("Bob", "198.51.100.2", "bobs-secret");
const mals = [];
for (const n of ["Mal", "Mal Two", "Mal Three"]) mals.push(await connect(n, "198.51.100.9", `${n}-secret`));
const all = [alice, bob, ...mals];
check(await until(() => all.every((p) => p.stat), 150), "all five are in the round");
await sleep(3000);
send(mals[0], { type: "command", text: "vote" });
await until(() => mals[0].html.some((h) => /vote=shuttle/.test(h)), 10);
const ref = /src=([^;&'"]+)(?:;|&amp;|&)vote=shuttle/.exec(mals[0].html.find((h) => /vote=shuttle/.test(h)) ?? "")?.[1];
check(!!ref, `the Vote panel has the shuttle vote (${ref})`);
send(mals[0], { type: "topic", href: `?src=${ref};vote=shuttle` });
check(await until(() => alice.text.some((t) => /Shuttle vote started by Mal/.test(t)), 10), "the shuttle vote starts");
send(mals[0], { type: "topic", href: `?src=${ref};vote=1` });
await sleep(500);
send(mals[1], { type: "topic", href: `?src=${ref};vote=1` });
send(bob, { type: "topic", href: `?src=${ref};vote=1` });
send(alice, { type: "topic", href: `?src=${ref};vote=2` });
check(await until(() => mals[1].text.some((t) => /at your address has already voted/.test(t)), 10), "Mal's second tab is told his address already voted");
check(await until(() => alice.text.some((t) => /Vote Result/.test(t)), 90), "the vote ends");
const result = alice.text.find((t) => /Vote Result/.test(t)) ?? "";
const call = /Call the shuttle:(?:<\/b>)? (\d+)/.exec(result)?.[1], keep = /Keep playing:(?:<\/b>)? (\d+)/.exec(result)?.[1];
check(call === "2", `Call the shuttle counts 2: Mal once, Bob (${call})`);
check(keep === "1", `Keep playing counts 1: Alice; Mal's silent tab doesn't count, his address voted (${keep})`);
for (const p of all) p.ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[voteaddr] ${fails.length} FAILED` : "[voteaddr] all passed");
process.exit(fails.length ? 1 : 0);
