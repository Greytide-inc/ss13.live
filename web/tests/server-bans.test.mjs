// server-bans (code review 2026-10-27): the --bans file. A permanent ban in the game ([server-ban] KEY ADDRESS) is saved there and
// refused at hello; lifting it in the game's unban panel ([server-unban] KEY) takes the key and the addresses banned with it back out,
// so the player can come back. A bans file that isn't valid JSON (a hand edit gone wrong) stops the server with the reason in its
// log file too: ss13-host throws away the server's terminal output, so a reason only printed there was never seen.
// Runs server.mjs on a tiny fake dist whose game thread only writes the ban lines, no build needed. Usage (from web/): node tests/server-bans.test.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { WebSocket } from "ws";

let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const dist = fs.mkdtempSync(path.join(os.tmpdir(), "server-bans-"));
fs.mkdirSync(path.join(dist, "web/build/dist/src/worker"), { recursive: true });
// the fake game: the admin's typed "ban" / "unban" become the lines the real game's AddBan / RemoveBan write (scenarios/unban-server.txt)
fs.writeFileSync(path.join(dist, "web/build/dist/src/worker/boot-worker.js"), `
postMessage({ type: "worker-ready" });
self.onmessage = ({ data }) => {
	if (data.type === "command" && data.text === "ban") postMessage({ type: "log", line: "[server-ban] bob 203.0.113.5" });
	if (data.type === "command" && data.text === "unban") postMessage({ type: "log", line: "[server-unban] bob" });
};
setInterval(() => {}, 1e9);
`);
const bansFile = path.join(dist, "bans.json");
fs.writeFileSync(bansFile, JSON.stringify({ keys: { carol: true }, ips: { "198.51.100.7": true } })); // an older file's entries stay
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 8700 + Math.floor(Math.random() * 80);
const start = (extra = []) => spawn(process.execPath, ["tools/server.mjs", "--dist", dist, "--port", String(port), "--log", path.join(dist, "server.log"), "--host-key", "hk", "--bans", bansFile, ...extra], { stdio: "ignore" });
const join = async (hello, xff) => {
	const ws = new WebSocket(`ws://127.0.0.1:${port}`, xff ? { headers: { "X-Forwarded-For": xff } } : {}), got = [];
	ws.on("message", (d) => got.push(JSON.parse(String(d))));
	await new Promise((r, j) => { ws.on("open", r); ws.on("error", j); });
	ws.send(JSON.stringify({ type: "hello", ...hello }));
	await sleep(600);
	return { ws, got };
};
const refused = (j) => j.got.some((m) => m.type === "refused");
let srv = start();
try {
	let up = false;
	for (let i = 0; i < 50 && !up; i++) { await sleep(100); up = await fetch(`http://127.0.0.1:${port}/`).then(() => true, () => false); }
	check(up, "server answers");
	const admin = await join({ player: "Host", secret: "hk" });
	admin.ws.send(JSON.stringify({ type: "command", text: "ban" })); await sleep(400);
	const saved = JSON.parse(fs.readFileSync(bansFile, "utf8"));
	check(saved.keys.bob && saved.ips["203.0.113.5"], `a game ban is saved, key and address (${JSON.stringify(saved)})`);
	const b1 = await join({ player: "Bob" }, "203.0.113.5"); b1.ws.close();
	check(refused(b1), "the banned player is refused");
	const b2 = await join({ player: "Robert" }, "203.0.113.5"); b2.ws.close();
	check(refused(b2), "a new name from the banned address is refused");
	admin.ws.send(JSON.stringify({ type: "command", text: "unban" })); await sleep(400);
	const after = JSON.parse(fs.readFileSync(bansFile, "utf8"));
	check(!after.keys.bob && !after.ips["203.0.113.5"], `the game's unban takes key and address out of the file (${JSON.stringify(after)})`);
	check(after.keys.carol && after.ips["198.51.100.7"], "other bans stay");
	const b3 = await join({ player: "Bob" }, "203.0.113.5"); b3.ws.close();
	check(!refused(b3) && b3.got.some((m) => m.type === "you"), `the unbanned player gets back in (${JSON.stringify(b3.got.find((m) => m.type === "refused") ?? null)})`);
	check(!fs.readdirSync(dist).some((f) => f.startsWith("bans.json.")), "no temp file left beside the bans file");
	admin.ws.close();
} finally { srv.kill(); }
await sleep(300);
// a broken bans file: the server stops (letting banned players in would be worse), and says why in its log file
fs.writeFileSync(bansFile, '{"keys":{"griefer":true},"ips":{"203.0.113');
fs.rmSync(path.join(dist, "server.log"), { force: true });
srv = start();
const code = await new Promise((r) => { const t = setTimeout(() => { srv.kill(); r("still running"); }, 8000); srv.on("exit", (c) => { clearTimeout(t); r(c); }); });
check(code === 2, `a broken bans file stops the server (exit ${code})`);
const log = fs.existsSync(path.join(dist, "server.log")) ? fs.readFileSync(path.join(dist, "server.log"), "utf8") : "";
check(/bans\.json.*(JSON|position)/.test(log), `the reason is in the server's log file, where ss13-host's restarts can be read (${JSON.stringify(log.slice(0, 200))})`);
fs.rmSync(dist, { recursive: true, force: true });
process.exit(bad ? 1 : 0);
