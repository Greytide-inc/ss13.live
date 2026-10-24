// boot-vote-check - the boot vote (plans/anarchy-light.md step 4) end to end on a real server: three players join, Alice starts a boot
//   vote on Carol from the Vote panel, Alice and Bob vote "Boot them", Carol doesn't vote. When the vote ends Carol is disconnected and
//   refused until the next round: her own name and secret, and a new name and secret from her address. Someone from another address still joins.
//   node tools/boot-vote-check.mjs [DIST=build/bootvote-dist] [PORT=8793]      exit 0 = all checks passed (~2.5 min: game start + the 60 s vote)
import fs from "node:fs";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
const dist = process.argv[2] ?? "build/bootvote-dist", port = Number(process.argv[3] ?? "8793");
const logFile = `build/server-${port}.log`, pepperFile = `build/boot-vote-check-${port}.pepper`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[bootvote] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "400", "--pepper", pepperFile, "--log", logFile], { stdio: "ignore" });
await sleep(2500);
const connect = (name, xff, trip) => new Promise((res) => {
	const ws = new WebSocket(`ws://127.0.0.1:${port}`, { headers: { "X-Forwarded-For": xff } });
	const r = { ws, you: null, refused: null, closed: false, stat: false, html: [], dialogs: [], text: [] };
	ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: name, trip })));
	ws.on("message", (d) => {
		const m = JSON.parse(String(d));
		if (m.type === "you") r.you = m;
		else if (m.type === "refused") r.refused = m.reason;
		else if (m.type === "stat") r.stat = true;
		else if (m.type === "browse" && typeof m.html === "string") r.html.push(m.html);
		else if (m.type === "dialog") r.dialogs.push(m);
		else if (m.type !== "view") { const t = JSON.stringify(m); try { r.text.push(decodeURIComponent(t)); } catch { r.text.push(t); } } // chat comes in several message types, some URL-encoded
	});
	ws.on("close", () => { r.closed = true; });
	ws.on("error", () => {});
	setTimeout(() => res(r), 1500);
});
const send = (p, m) => p.ws.send(JSON.stringify(m));
const until = async (f, s) => { for (let i = 0; i < s * 2 && !f(); i++) await sleep(500); return f(); };
const alice = await connect("Alice", "198.51.100.1", "alices-secret");
const bob = await connect("Bob", "198.51.100.2", "bobs-secret");
const carol = await connect("Carol", "198.51.100.3", "carols-secret");
check(await until(() => alice.stat && bob.stat && carol.stat, 150), "all three are in the round");
await sleep(3000);
send(alice, { type: "command", text: "vote" });
await until(() => alice.html.some((h) => /vote=boot/.test(h)), 10);
const panel = alice.html.find((h) => /vote=boot/.test(h)) ?? "";
const ref = /src=([^;&'"]+)(?:;|&amp;|&)vote=boot/.exec(panel)?.[1];
check(!!ref, `the Vote panel has "Boot a player" (${ref})`);
send(alice, { type: "topic", href: `?src=${ref};vote=boot` });
await until(() => alice.dialogs.length > 0, 10);
const dlg = alice.dialogs[0], items = dlg?.items ?? [];
check(items.length === 2 && items.some((i) => i.includes("Carol @")) && items.some((i) => i.includes("Bob @")) && !items.some((i) => i.includes("Alice @")), `the picker lists the other players, not yourself (${items.join(" | ")})`);
send(alice, { type: "answer", id: dlg?.id ?? 0, value: items.findIndex((i) => i.includes("Carol @")) });
check(await until(() => bob.text.some((t) => /Boot vote started by Alice/.test(t) && /Boot .*Carol.* for the rest of the round\?/.test(t)), 10), "everyone hears the vote start, with who it is about");
send(alice, { type: "topic", href: `?src=${ref};vote=1` });
send(bob, { type: "topic", href: `?src=${ref};vote=1` });
check(await until(() => carol.closed, 90), "when the vote ends, Carol is disconnected");
await sleep(1000);
const log = fs.readFileSync(logFile, "utf8");
check(/Vote Result: Boot them/.test(log) || alice.text.some((t) => /Vote Result: Boot them/.test(t)), "the result is Boot them (2 of 3)");
check(bob.text.some((t) => /voted off the station for the rest of the round/.test(t)), "everyone is told");
check(carol.text.some((t) => /The crew voted you off/.test(t)), "Carol is told why");
check(/voted off until the next round: carol@\w+ 198\.51\.100\.3/.test(log), "the server records her key and address");
const back = await connect("Carol", "198.51.100.3", "carols-secret");
check(/voted you off/.test(back.refused ?? ""), `Carol rejoining is refused (${back.refused})`);
const newName = await connect("Totally Not Carol", "198.51.100.3", "another-secret");
check(/voted you off/.test(newName.refused ?? ""), `a new name and secret from her address is refused (${newName.refused})`);
const other = await connect("Dave", "198.51.100.4", "daves-secret");
check(other.refused === null && other.you !== null, "a player from another address still joins");
check(!alice.closed && !bob.closed, "the voters stay connected");
for (const p of [alice, bob, carol, back, newName, other]) p.ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[bootvote] ${fails.length} FAILED` : "[bootvote] all passed");
process.exit(fails.length ? 1 : 0);
