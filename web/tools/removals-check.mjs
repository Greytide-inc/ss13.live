// removals-check - punishments are seen (plans/server-rules.md step 5) on a real server: admin Alice (a listed tag) kicks Bob (his mob ref
//   from his adminhelp's admin links); Bob is disconnected, Carol is told "... was kicked by an admin", and when the round ends (--endround) the round-end
//   report lists the kick under "Removed this round". Also the server rules (plans/server-rules.md step 1): the welcome message shows
//   them, and the same OOC line 11 times in a row auto-mutes the sender.
//   node tools/removals-check.mjs [DIST=build/removals-dist] [PORT=8796]      exit 0 = all checks passed (~2 min)
import fs from "node:fs";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
import { tagOf, loadPepper } from "./tripcode.mjs";
const dist = process.argv[2] ?? "build/removals-dist", port = Number(process.argv[3] ?? "8796");
const logFile = `build/server-${port}.log`, pepperFile = `build/removals-check-${port}.pepper`, adminsFile = `build/removals-check-${port}.admins`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[removals] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const pepper = loadPepper(pepperFile);
fs.writeFileSync(adminsFile, tagOf(pepper, "alices-secret") + "\n");
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "400", "--pepper", pepperFile, "--admins", adminsFile, "--endround", "75", "--log", logFile], { stdio: "ignore" });
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
const saw = (p, re) => p.text.some((t) => re.test(t));
const alice = await connect("Alice", "198.51.100.1", "alices-secret");
const bob = await connect("Bob", "198.51.100.2", "bobs-secret");
const carol = await connect("Carol", "198.51.100.3", "carols-secret");
check(await until(() => alice.stat && bob.stat && carol.stat, 150), "all three are in the round");
await sleep(3000);
send(bob, { type: "command", text: 'adminhelp "someone is griefing"' });
// the admins' copy of an adminhelp carries links with the sender's mob ref (adminplayeropts=REF)
await until(() => alice.text.some((t) => /adminplayeropts=\[0x[0-9a-f]+\]/i.test(t)), 15);
const bobRef = /adminplayeropts=(\[0x[0-9a-f]+\])/i.exec(alice.text.find((t) => /adminplayeropts=/i.test(t)) ?? "")?.[1];
check(!!bobRef, `the adminhelp gives admins Bob's mob (${bobRef})`);
send(alice, { type: "topic", href: `?_src_=holder;boot2=${bobRef}` });
check(await until(() => bob.closed, 15), "Bob is disconnected");
check(await until(() => saw(carol, /Bob @\w+\) was kicked by an admin/), 10), "Carol is told Bob was kicked by an admin");
check(await until(() => saw(carol, /Removed this round:.*Bob @\w+\) was kicked by an admin/), 150), "the round-end report lists the kick");
check(saw(carol, /Anything goes in the round/) && saw(carol, /Use Adminhelp, not OOC/), "players see the server rules on joining (config/motd.txt)");
for (let i = 0; i < 11; i++) { send(carol, { type: "command", text: 'ooc "same message again"' }); await sleep(150); }
check(await until(() => saw(carol, /auto-mute was applied/), 10), "the same OOC line 11 times auto-mutes the sender (AUTOMUTE_ON)");
for (const p of [alice, bob, carol]) p.ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[removals] ${fails.length} FAILED` : "[removals] all passed");
process.exit(fails.length ? 1 : 0);
