// map-vote-check - the map vote (plans/anarchy-light.md step 5) on a real server: a player starts it from the Vote panel and votes
//   PubbyStation; the server notes it, and when the round ends the next world loads Pubby. Short rounds as in rounds-check.mjs.
//   node tools/map-vote-check.mjs [DIST=build/bootvote-dist] [PORT=8794]      exit 0 = all checks passed (~5 min: two world starts, one without a snapshot)
import fs from "node:fs";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
const dist = process.argv[2] ?? "build/bootvote-dist", port = Number(process.argv[3] ?? "8794");
const logFile = `build/server-${port}.log`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[mapvote] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--lobby", "--lobby-seconds", "15", "--autojoin", "Assistant", "--endround", "100", "--rounddelay", "5", "--log", logFile, ...(process.env.CHATTY ? ["--log-level", "chatty"] : [])], { stdio: "ignore" });
await sleep(2500);
const ws = new WebSocket(`ws://127.0.0.1:${port}`);
let html = [], reboots = 0, inRound = false;
ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: "Mappy" })));
ws.on("error", () => {});
ws.on("message", (d) => {
	const m = JSON.parse(String(d));
	if (m.type === "browse" && typeof m.html === "string") html.push(m.html);
	if (m.type === "reboot") reboots++;
	if (m.type === "milestone" && m.name === "joined") inRound = true;
});
const until = async (f, s) => { for (let i = 0; i < s * 2 && !f(); i++) await sleep(500); return f(); };
const log = () => fs.readFileSync(logFile, "utf8");
check(await until(() => inRound, 180), "the player is in the round");
await sleep(2000);
ws.send(JSON.stringify({ type: "command", text: "vote" }));
await until(() => html.some((h) => /vote=map/.test(h)), 10);
const ref = /src=([^;&'"]+)(?:;|&amp;|&)vote=map/.exec(html.find((h) => /vote=map/.test(h)) ?? "")?.[1];
check(!!ref, `the Vote panel has "Next map" (${ref})`);
html = [];
ws.send(JSON.stringify({ type: "topic", href: `?src=${ref};vote=map` }));
await until(() => html.some((h) => /PubbyStation/.test(h)), 10);
const ballot = html.find((h) => /PubbyStation/.test(h)) ?? "";
const pick = /vote=(\d+)'>PubbyStation</.exec(ballot)?.[1];
const names = [...ballot.matchAll(/vote=\d+'>([^<]+)</g)].map((x) => x[1]);
check(!!pick && !names.includes("MetaStation") && names.includes("Box Station"), `the ballot lists the maps for 1 player (${names.join(", ")})`);
ws.send(JSON.stringify({ type: "topic", href: `?src=${ref};vote=${pick}` }));
check(await until(() => /next world's map: pubbystation/.test(log()), 90), "the server takes the result (next world's map: pubbystation)");
check(await until(() => reboots > 0, 180), "the round ends");
const w2 = () => log().split("starting world 2")[1] ?? "";
check(await until(() => /Loading PubbyStation/.test(w2()), 240), "the next world loads PubbyStation");
const t2 = Date.now();
check(await until(() => /milestone lobby/.test(w2()), 300), `PubbyStation reaches its lobby (${Math.round((Date.now() - t2) / 1000)} s after it started loading; no saved world for it)`);
ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[mapvote] ${fails.length} FAILED` : "[mapvote] all passed");
process.exit(fails.length ? 1 : 0);
