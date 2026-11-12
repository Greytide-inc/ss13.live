// join-check - players who come and go while the station boots, on a fresh tools/server.mjs (not --lobby): Alpha starts the round and leaves
// during the boot, Beta joins and leaves during the boot, Gamma joins during the boot and stays. Checks: Gamma gets a view; the game never
// connects Alpha or Beta (a connect queued before its disconnect must not run after it, or a body plays itself).
//   node tools/join-check.mjs PORT LOG [SECONDS=90]      start the server just before: node tools/server.mjs --dist DIST --port PORT --log LOG
import { WebSocket } from "ws";
import fs from "node:fs";
const port = Number(process.argv[2] ?? "8781"), logFile = process.argv[3], limit = Number(process.argv[4] ?? "90") * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (s) => console.log(`[join-check] ${s}`);
async function player(name) {
	for (let i = 0; ; i++) { // the server may still be starting
		const p = { name, ws: new WebSocket(`ws://127.0.0.1:${port}`), views: 0 };
		const ok = await new Promise((r) => { p.ws.on("open", () => r(true)); p.ws.on("error", () => r(false)); });
		if (!ok) { if (i > 60) throw new Error("no server"); await sleep(500); continue; }
		p.ws.send(JSON.stringify({ type: "hello", player: name }));
		p.ws.on("message", (d) => { if (JSON.parse(String(d)).type === "view") p.views++; });
		return p;
	}
}
const A = await player("Alpha"); log("Alpha joined (starts the round)");
await sleep(2000);
const B = await player("Beta"); log("Beta joined");
await sleep(2000);
B.ws.close(); log("Beta left");
A.ws.close(); log("Alpha left");
await sleep(1000);
const G = await player("Gamma"); log("Gamma joined");
const t0 = Date.now();
while (G.views < 3 && Date.now() - t0 < limit) await sleep(500);
await sleep(5000); // the queue has drained by now
G.ws.close();
const text = fs.readFileSync(logFile, "utf8");
const fails = [];
const check = (ok, what) => { log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
check(G.views >= 3, `Gamma gets views (${G.views})`);
check(!/client Alpha connected/.test(text), "Alpha, gone before the world was ready, never connects");
check(!/client Beta connected/.test(text), "Beta, gone before the world was ready, never connects");
check(!/Error|TypeError/.test(text.split("\n").filter((l) => l.includes("[vm-boot]") || l.includes("worker")).join("\n")), "no worker error");
log(fails.length ? `${fails.length} failed` : "all passed");
process.exit(fails.length ? 1 : 0);
