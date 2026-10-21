// rounds-check - ps-rounds: the server runs several rounds in one process; players stay connected and land in each new lobby.
//   node tools/rounds-check.mjs [DIST=build/psrounds-dist] [PORT=8792] [ROUNDS=3]      exit 0 = all checks passed
// Starts its own server with short rounds (lobby 15 s, auto-join, end 15 s after spawning, 5 s reboot countdown) and one client that
// stays connected throughout. Per round it expects "world N" starting, a full view after the reboot, and reads the worker heap.
import fs from "node:fs";
import { spawn, execSync } from "node:child_process";
import { WebSocket } from "ws";
const dist = process.argv[2] ?? "build/psrounds-dist", port = Number(process.argv[3] ?? "8792"), want = Number(process.argv[4] ?? "3");
const logFile = `build/server-${port}.log`;
const fails = [];
const check = (ok, what) => { console.log(`[rounds] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--lobby", "--lobby-seconds", "15", "--autojoin", "Assistant", "--endround", "15", "--rounddelay", "5", "--log", logFile], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2500));
const ws = new WebSocket(`ws://127.0.0.1:${port}`);
let reboots = 0, viewsAfter = 0, closed = false;
const rss = [];
ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: "Roundy" })));
ws.on("close", () => { closed = true; });
ws.on("error", () => {});
ws.on("message", (d) => {
	const m = JSON.parse(String(d));
	if (m.type === "reboot") { reboots++; viewsAfter = 0; const mb = Math.round(Number(execSync(`ps -o rss= -p ${srv.pid}`)) / 1024); rss.push(mb); console.log(`[rounds] reboot ${reboots}: ${m.reason}, server process ${mb} MB`); }
	if (m.type === "view" && reboots > 0) viewsAfter++;
});
const t0 = Date.now();
while (reboots < want && Date.now() - t0 < 20 * 60 * 1000) await new Promise((r) => setTimeout(r, 2000));
for (let i = 0; i < 60 && viewsAfter === 0; i++) await new Promise((r) => setTimeout(r, 2000)); // the last reboot's next world comes up (~45 s without a snapshot)
check(reboots >= want, `${reboots} round(s) ended (wanted ${want})`);
check(!closed, "the client stayed connected through every reboot");
check(viewsAfter > 0, "views arrive from the world after the last reboot");
const log = fs.readFileSync(logFile, "utf8");
for (let n = 2; n <= reboots + 1; n++) check(new RegExp(`starting world ${n} for 1 connected`).test(log) && new RegExp(`starting the game \\(join \\) for Roundy`).test(log), `world ${n} started with the player in its lobby`);
check(!/worker thread exited/.test(log), "the server process never lost its worker");
check(rss.length < 2 || rss[rss.length - 1] < rss[0] * 1.3 + 200, `server memory flat across rounds (MB at each reboot: ${rss.join(", ")})`);
ws.close(); srv.kill("SIGTERM");
console.log(fails.length ? `[rounds] ${fails.length} FAILED` : "[rounds] all passed");
process.exit(fails.length ? 1 : 0);
