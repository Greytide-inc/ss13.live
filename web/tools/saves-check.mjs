// saves-check - server --saves: a character setup outlives a server restart. Starts tools/server.mjs twice on one saves file; the same
// tripcode joins each time, says a line, and its character's name (from "NAME says") must be the same in both runs.
//   node tools/saves-check.mjs [DIST=build/trip-dist] [PORT=8794] [--no-saves: the old way, to see the check fail]   exit 0 = passed (~2 min)
import fs from "node:fs";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
const args = process.argv.slice(2).filter((a) => !a.startsWith("--")), noSaves = process.argv.includes("--no-saves");
const dist = args[0] ?? "build/trip-dist", port = Number(args[1] ?? "8794");
const saves = `build/saves-check-${port}.json`, pepper = `build/saves-check-${port}.pepper`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.rmSync(saves, { force: true }); fs.rmSync(pepper, { force: true });
async function run(n) {
	const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "150", "--pepper", pepper, ...(noSaves ? [] : ["--saves", saves]), "--log", `build/saves-check-${port}-${n}.log`], { stdio: "ignore" });
	await sleep(2500);
	const ws = new WebSocket(`ws://127.0.0.1:${port}`), chat = [];
	let views = 0;
	ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: "Keeper", trip: "keepers-secret" })));
	ws.on("message", (d) => { const m = JSON.parse(String(d)); if (m.type === "view") views++; if (m.type === "output") for (const l of m.lines) chat.push(String(l).replace(/<[^>]*>/g, "")); });
	ws.on("error", () => {});
	for (let i = 0; i < 600 && !chat.some((l) => /You are the Assistant/.test(l)); i++) await sleep(200); // spawned, not still in the lobby
	ws.send(JSON.stringify({ type: "command", text: 'say "keeping my name"' }));
	await sleep(6000); // the store writes every 3 s
	const name = chat.map((l) => /^(.+?) says, "Keeping my name"/i.exec(l)?.[1]).find(Boolean) ?? null;
	ws.close(); srv.kill("SIGTERM"); await sleep(1500);
	console.log(`[saves] run ${n}: views ${views}, character "${name}"`);
	return name;
}
const first = await run(1), second = await run(2);
const ok = first !== null && first === second;
console.log(ok ? `[saves] ok   the same tag is "${first}" again after a restart` : `[saves] FAIL "${first}" then "${second}"`);
process.exit(ok ? 0 : 1);
