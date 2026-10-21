// server-private (security review 2026-10-21): what tools/server.mjs keeps from normal players. At round end the game sends every
// file it wrote under data/ ({type:"file"}: game.log, the say/whisper/PDA logs, the access log with each player's address): like the
// world log ({type:"log"}), only admins get them. A player named "Constructor" (a name every plain JS object already has) is not banned.
// The per-address limits (open connections, new tags an hour, IP bans) take an IPv6 /64 as one address: one home or server holds a
// whole /64, so counting each address alone would let it walk past them. Each connection has a byte budget besides its message budget,
// so a flood of big frames can't keep the server parsing megabytes of JSON a second.
// Runs server.mjs on a tiny fake dist whose game thread only sends those messages, no build needed. Usage (from web/): node tests/server-private.test.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { WebSocket } from "ws";

let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const dist = fs.mkdtempSync(path.join(os.tmpdir(), "server-private-"));
fs.mkdirSync(path.join(dist, "web/build/dist/src/worker"), { recursive: true });
// the fake game: ready at once; on start, a world log line and a round-end file to everyone, again on each "resync" (a later join);
// it counts the commands that reach it and logs the count on a "count?" command
fs.writeFileSync(path.join(dist, "web/build/dist/src/worker/boot-worker.js"), `
postMessage({ type: "worker-ready" });
let commands = 0;
self.onmessage = ({ data }) => {
	if (data.type === "start" || data.type === "resync") { postMessage({ type: "log", line: "secret log line" }); postMessage({ type: "file", path: "data/logs/access.log", text: "Login: x from 203.0.113.9" }); }
	if (data.type === "command") { if (data.text === "count?") postMessage({ type: "log", line: "commands " + commands }); else commands++; }
};
setInterval(() => {}, 1e9);
`);
fs.writeFileSync(path.join(dist, "bans.json"), JSON.stringify({ ips: { "2001:db8:1:4::/64": true } }));
const port = 8700 + Math.floor(Math.random() * 80);
const srv = spawn(process.execPath, ["tools/server.mjs", "--dist", dist, "--port", String(port), "--log", path.join(dist, "server.log"), "--host-key", "hk", "--bans", path.join(dist, "bans.json")], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// xff: the address a proxy on this machine (cloudflared) says the player has
const join = async (hello, xff) => {
	const ws = new WebSocket(`ws://127.0.0.1:${port}`, xff ? { headers: { "X-Forwarded-For": xff } } : {}), got = [];
	ws.on("message", (d) => got.push(JSON.parse(String(d))));
	await new Promise((r, j) => { ws.on("open", r); ws.on("error", j); });
	ws.send(JSON.stringify({ type: "hello", ...hello }));
	await new Promise((r) => setTimeout(r, 800));
	return { ws, got };
};
try {
	let up = false;
	for (let i = 0; i < 50 && !up; i++) { await new Promise((r) => setTimeout(r, 100)); up = await fetch(`http://127.0.0.1:${port}/`).then(() => true, () => false); }
	check(up, "server answers");
	const player = await join({ player: "Visitor" });
	const admin = await join({ player: "Host", secret: "hk" });
	await new Promise((r) => setTimeout(r, 500));
	check(!player.got.some((m) => m.type === "file"), "a player gets no round-end data files (logs with everyone's messages and addresses)");
	check(!player.got.some((m) => m.type === "log"), "a player gets no world log lines");
	check(admin.got.some((m) => m.type === "file"), "an admin gets the data files");
	check(admin.got.some((m) => m.type === "log"), "an admin gets the world log");
	const ctor = await join({ player: "Constructor" });
	check(ctor.got.some((m) => m.type === "you") && !ctor.got.some((m) => m.type === "refused"), `a player named Constructor joins, not refused as banned (${JSON.stringify(ctor.got.find((m) => m.type === "refused") ?? null)})`);
	// IPv6: one /64 is one address
	const socks = [];
	for (let i = 1; i <= 9; i++) { const ws = new WebSocket(`ws://127.0.0.1:${port}`, { headers: { "X-Forwarded-For": `2001:db8:1:2::${i}` } }); ws.on("error", () => {}); socks.push(ws); await sleep(50); }
	await sleep(500);
	const open = socks.filter((w) => w.readyState === WebSocket.OPEN).length;
	check(open === 8, `9 connections from one IPv6 /64 (different addresses): 8 stay open, as from one address (${open})`);
	for (const w of socks) w.close();
	const tagTries = [];
	for (let i = 1; i <= 6; i++) { const t = await join({ player: `Guess${i}`, trip: `secret${i}` }, `2001:db8:1:3:${i}::1`); tagTries.push(t); t.ws.close(); }
	check(tagTries.slice(0, 5).every((t) => t.got.some((m) => m.type === "you")) && tagTries[5].got.some((m) => m.type === "refused"), "a 6th new tag in an hour from the same /64 (another address in it) is refused");
	const banned = await join({ player: "Banned6" }, "2001:0db8:0001:0004:abcd::77");
	check(banned.got.some((m) => m.type === "refused"), "an address inside a banned /64 is refused at hello");
	banned.ws.close();
	// the byte budget: 20 frames of ~100 KB in a row (well under the message budget); only the first few reach the game
	const big = await join({ player: "Bigsender" });
	for (let i = 0; i < 20; i++) big.ws.send(JSON.stringify({ type: "command", text: "x".repeat(100000) }));
	await sleep(1500);
	big.ws.send(JSON.stringify({ type: "command", text: "count?" }));
	await sleep(500);
	const n = Number(/commands (\d+)/.exec(fs.readFileSync(path.join(dist, "server.log"), "utf8"))?.[1] ?? -1);
	check(n >= 1 && n <= 3, `20 frames of 100 KB at once: 1-3 reach the game, the rest are over the byte budget (${n})`);
	for (const c of [player, admin, ctor, big]) c.ws.close();
} finally {
	srv.kill("SIGTERM");
	await new Promise((r) => setTimeout(r, 300));
	fs.rmSync(dist, { recursive: true, force: true });
}
console.log(bad ? `${bad} FAILED` : "all ok");
process.exit(bad ? 1 : 0);
