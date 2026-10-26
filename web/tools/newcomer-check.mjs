// newcomer-check - new arrivals wait (plans/server-rules.md step 4) on a real server: Alice joins before the round starts and can use
//   OOC at once. Newbie joins from a new address more than NEWCOMER_WAIT (2 min) after it started (earlier joins are free): OOC, starting a vote and voting are refused, a reconnect and a second name
//   from his address are refused too, a second name from Alice's address isn't. After NEWCOMER_WAIT (2 min) Newbie's OOC goes through.
//   node tools/newcomer-check.mjs [DIST=build/newcomer-dist] [PORT=8795]      exit 0 = all checks passed (~5.5 min: game start + 2 min free joins + the 2 min wait)
import fs from "node:fs";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
const dist = process.argv[2] ?? "build/newcomer-dist", port = Number(process.argv[3] ?? "8795");
const logFile = `build/server-${port}.log`, pepperFile = `build/newcomer-check-${port}.pepper`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[newcomer] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
try { fs.unlinkSync(logFile); } catch {}
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "500", "--pepper", pepperFile, "--log", logFile], { stdio: "ignore" });
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
const ooc = (p, words) => send(p, { type: "command", text: `ooc "${words}"` });
const saw = (p, re) => p.text.some((t) => re.test(t));
const started = () => { try { return /Game start took/.test(fs.readFileSync(logFile, "utf8")); } catch { return false; } };

const alice = await connect("Alice", "198.51.100.1", "alices-secret");
check(await until(() => alice.stat, 150), "Alice is in, before the round starts");
check(await until(started, 150), "the round starts");
await sleep(125000); // past the free joins at round start
ooc(alice, "alice says hi");
let newbie = await connect("Newbie", "198.51.100.7", "newbies-secret");
check(await until(() => newbie.stat, 60), "Newbie joins over 2 minutes after the round started");
const joinedAt = Date.now();
await sleep(1000);
ooc(alice, "alice again");
check(await until(() => saw(newbie, /alice again/), 10), "Alice (here before the round) can use OOC");
ooc(newbie, "newbie one");
check(await until(() => saw(newbie, /New arrivals can use OOC after \d+ more seconds/), 10), "Newbie's OOC is refused, with how long is left");
await sleep(1000);
check(!saw(alice, /newbie one/), "nobody sees Newbie's refused OOC");
send(newbie, { type: "command", text: "vote" });
await until(() => newbie.html.some((h) => /vote=shuttle/.test(h)), 10);
const ref = /src=([^;&'"]+)(?:;|&amp;|&)vote=shuttle/.exec(newbie.html.find((h) => /vote=shuttle/.test(h)) ?? "")?.[1];
send(newbie, { type: "topic", href: `?src=${ref};vote=shuttle` });
check(await until(() => saw(newbie, /New arrivals can start a vote after/), 10), "Newbie can't start a vote");
check(!saw(alice, /Shuttle vote started/), "no vote started");
send(alice, { type: "topic", href: `?src=${ref};vote=shuttle` });
check(await until(() => saw(newbie, /Shuttle vote started by Alice/), 10), "Alice can start a vote");
send(newbie, { type: "topic", href: `?src=${ref};vote=1` });
check(await until(() => saw(newbie, /New arrivals can vote after/), 10), "Newbie's vote is refused");
newbie.ws.close();
await sleep(1500);
newbie = await connect("Newbie", "198.51.100.7", "newbies-secret");
await until(() => newbie.stat, 30);
ooc(newbie, "newbie reconnected");
check(await until(() => saw(newbie, /New arrivals can use OOC/), 10), "a reconnect doesn't skip the wait");
const newbie2 = await connect("Newbie Alt", "198.51.100.7", "alt-secret");
await until(() => newbie2.stat, 30);
ooc(newbie2, "newbie alt");
check(await until(() => saw(newbie2, /New arrivals can use OOC/), 10), "a new name from Newbie's address waits too");
const alice2 = await connect("Alice Alt", "198.51.100.1", "alice-alt-secret");
await until(() => alice2.stat, 30);
ooc(alice2, "alice alt here");
check(await until(() => saw(alice, /alice alt here/), 10) && !saw(alice2, /New arrivals/), "a new name from Alice's (known) address doesn't wait");
await sleep(Math.max(0, joinedAt + 125000 - Date.now()));
ooc(newbie, "newbie after the wait");
check(await until(() => saw(alice, /newbie after the wait/), 10), "after 2 minutes Newbie's OOC goes through");
for (const p of [alice, newbie, newbie2, alice2]) p.ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[newcomer] ${fails.length} FAILED` : "[newcomer] all passed");
process.exit(fails.length ? 1 : 0);
