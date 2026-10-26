// fuzz-check - ps-security: a hostile player on a running tools/server.mjs, no browser. Alpha is a normal player; Mallory sends junk,
// oversized and forged input for every message type the server forwards. The checks are what must still be true afterwards: the
// server is up and still sends Alpha views, Alpha didn't move and is still a living human, nobody said Mallory's forged words, no
// proc other than the mouse procs was run by a "mouse" message, a flood is cut off, and bad HTTP paths get an error, not a crash.
//   node tools/fuzz-check.mjs PORT [SERVER_LOG=build/server-PORT.log]      exit 0 = all checks passed
// Also: a page (hello acks: 1) that then sends nothing is closed by the server within SILENT_MS + 5 s ("closing NAME: silent"), and its name is free again;
// one that pings but never acks its views is closed the same way ("closing NAME: no acks").
// Start the server first (not --lobby, so both players get a body):  node tools/server.mjs --dist build/NAME-dist --port PORT --seconds 200
import fs from "node:fs";
import http from "node:http";
import { WebSocket } from "ws";
const port = Number(process.argv[2] ?? "8780"), logFile = process.argv[3] ?? `build/server-${port}.log`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (s) => console.log(`[fuzz] ${s}`);
const fails = [];
const check = (ok, what) => { log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
function player(name, hello = {}) {
	const p = { name, ws: new WebSocket(`ws://127.0.0.1:${port}`), views: 0, eye: null, chat: [], ids: new Set(), dialogs: [], bugstate: [], msgs: {}, closed: false, code: 0 };
	p.ws.on("open", () => p.ws.send(JSON.stringify({ type: "hello", player: name, ...hello })));
	p.ws.on("close", (code) => { p.closed = true; p.code = code; p.closedAt = Date.now(); });
	p.ws.on("error", () => {});
	p.ws.on("message", (d) => {
		const m = JSON.parse(String(d)); p.msgs[m.type] = (p.msgs[m.type] ?? 0) + 1;
		if (m.type === "output") for (const l of m.lines) p.chat.push(String(l).replace(/<[^>]*>/g, ""));
		if (m.type === "dialog") p.dialogs.push(m);
		if (m.type === "bugstate") p.bugstate.push(m.text);
		if (m.type === "view") { p.views++; if (m.update.eyeTile) p.eye = m.update.eyeTile; for (const t of m.update.tiles ?? []) for (const id of t[2]) p.ids.add(id); }
	});
	p.send = (m) => { if (p.ws.readyState === 1) p.ws.send(typeof m === "string" || Buffer.isBuffer(m) ? m : JSON.stringify(m)); };
	return p;
}
// Paced well under the server's rate limit, so a message is refused for what it is, not for arriving too fast.
const slow = async (p, list) => { for (const m of list) { p.send(m); await sleep(20); } };
const get = (path) => new Promise((res) => { const r = http.request({ host: "127.0.0.1", port, path, method: "GET" }, (x) => { x.resume(); res(x.statusCode); }); r.on("error", () => res(0)); r.end(); });
const state = async (p) => { const n = p.bugstate.length; p.send({ type: "bugstate" }); for (let i = 0; i < 30 && p.bugstate.length === n; i++) await sleep(100); return p.bugstate[n] ?? ""; };
const alive = (t) => /mob: \/mob\/living\/carbon\/human/.test(t) && /\bstat=0\b/.test(t);

const A = player("Alpha");
while (A.views < 5) await sleep(200);
const M = player("Mallory");
const quiet = player("Quiet", { acks: 1 }), quietAt = Date.now(); // never pings or acks: the silent-link row near the end checks it was cut off
const pinger = player("Pinger", { acks: 1 }), pingTimer = setInterval(() => pinger.send(`{"type":"ping","t":${Date.now()}}`), 1000); // pings but never acks a view: its held view would grow forever
for (let i = 0; i < 150 && M.views < 5; i++) await sleep(200);
check(M.views >= 5, `Mallory joined and gets views (${M.views})`);
await sleep(8000); // both in their bodies
const eye0 = { ...A.eye }, st0 = await state(A);
check(alive(st0), `Alpha starts as a living human (${st0.split("\n").find((l) => l.startsWith("mob:"))?.slice(0, 90)})`);

// ---- 1. junk: every forwarded type, every field set to each wrong kind of value
const FIELDS = {
	key: ["key", "down"], click: ["id", "x", "y", "dbl", "control", "params"], command: ["text", "speech"], typing: ["on"], answer: ["id", "value"],
	statpanel: ["name"], statclick: ["idx"], topic: ["href"], winclose: ["name"], menu: ["one", "x", "y", "sx", "sy", "click"], menupick: ["id", "a", "v"],
	mouse: ["proc", "id", "x", "y", "over", "ox", "oy", "dx", "dy", "control", "params"], resync: [], bugstate: [],
};
const JUNK = [null, 0, -1, 1e308, 0.5, "x", "", "A".repeat(20000), {}, [], true, { toString: 1 }, [[[[]]]], "__proto__"];
const junk = ["not json", "null", "[]", "42", '"text"', '{"type":{}}', '{"type":"key"}', "{", Buffer.from([0, 255, 1, 254])];
for (const [type, fields] of Object.entries(FIELDS)) {
	junk.push({ type });
	for (const j of JUNK) junk.push({ type, ...Object.fromEntries(fields.map((f) => [f, j])) });
	for (const f of fields) for (const j of [null, {}, "A".repeat(20000)]) junk.push({ type, [f]: j }); // one bad field, the rest missing
}
for (const t of ["start", "stop", "connect", "disconnect", "hello", "hot"]) junk.push({ type: t, key: "Alpha", player: "Alpha", seconds: 0, ticks: 0 }); // never forwarded
for (const level of ["chatty", "quiet", "normal"]) junk.push({ type: "loglevel", level }); // host-only (logging.md step 2): never forwarded
log(`sending ${junk.length} junk messages`);
await slow(M, junk);
await sleep(1500);
check(!M.closed || M.code !== 1006, "the server didn't drop dead under junk");

// ---- 2. oversized: one frame far over any real message (a fresh connection, since the server may close it)
const big = player("Biggie");
for (let i = 0; i < 50 && big.views < 1; i++) await sleep(200);
big.send({ type: "command", text: "say " + "B".repeat(4 * 1024 * 1024) });
await sleep(1500);
check(big.closed, "a 4 MB frame gets its connection closed");
check(![...A.chat, ...M.chat].some((l) => /BBBBBBBB/.test(l)), "the 4 MB say was not spoken");
if (!big.closed) big.ws.close();

// ---- 3. forged: acting as another player, answering another player's dialog, calling procs through "mouse"
const again = M.closed ? player("Mallory2") : M;
if (again !== M) { for (let i = 0; i < 100 && again.views < 5; i++) await sleep(200); await sleep(5000); }
await slow(again, [0, 1, 2, 3].flatMap(() => [{ type: "key", key: "EAST", down: true, player: "alpha" }, { type: "key", key: "EAST", down: false, player: "alpha" }, { type: "key", key: "EAST", down: true, player: "Alpha" }, { type: "key", key: "EAST", down: false, player: "Alpha" }]));
A.send({ type: "command", text: "say" }); // no words: the game asks Alpha in a dialog
for (let i = 0; i < 30 && !A.dialogs.length; i++) await sleep(100);
const dlg = A.dialogs.at(-1);
check(!!dlg, `Alpha has an open dialog to forge an answer to (id ${dlg?.id})`);
if (dlg) {
	await slow(again, [-2, -1, 0, 1, 2].map((d) => ({ type: "answer", id: dlg.id + d, value: "forged answer words" })));
	await sleep(1500);
	check(![...A.chat, ...again.chat].some((l) => /forged answer words/i.test(l)), "Mallory's answer to Alpha's dialog was not spoken");
	A.send({ type: "answer", id: dlg.id, value: "real answer words" });
	await sleep(1500);
	check(A.chat.some((l) => /real answer words/i.test(l)), "Alpha's own answer still works (the dialog was still open)");
}
const ids = [...again.ids].slice(-250), PROCS = ["gib", "death", "ex_act", "Del", "Destroy", "Topic", "ghostize"];
log(`sending mouse messages naming ${PROCS.join("/")} for ${ids.length} objects in Mallory's view`);
await slow(again, PROCS.flatMap((proc) => ids.filter((_, i) => i % 5 === PROCS.indexOf(proc) % 5).map((id) => ({ type: "mouse", proc, id, x: 1, y: 1, control: "mapwindow.map", params: "" }))));
await sleep(2000);

// ---- 4. flood: far more messages than a player can make
const flood = player("Flood");
for (let i = 0; i < 50 && flood.views < 1; i++) await sleep(200);
const viewsBefore = A.views, t0 = Date.now();
for (let i = 0; i < 60000 && !flood.closed; i++) { flood.send({ type: "command", text: `say flood ${i}` }); if (i % 2000 === 1999) await sleep(50); }
await sleep(4000);
check(flood.closed, "a flooding connection is closed by the server");
check(A.views - viewsBefore > 20, `Alpha kept getting views through the flood (${A.views - viewsBefore} in ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
if (!flood.closed) flood.ws.close();

// ---- 5. HTTP
const bad = await get("/%E0%A4%A"), up = await get("/../../../../etc/passwd"), enc = await get("/..%2f..%2f..%2f..%2fetc%2fpasswd"), ok = await get("/");
check(bad >= 400 && bad < 500, `GET with a broken %-escape is refused (${bad})`);
check(up >= 400 && up < 500 && enc >= 400 && enc < 500, `GET outside the dist folder is refused (${up}, ${enc})`);
check(ok === 200, `GET / still works (${ok})`);

// ---- 6. a silent link: Quiet said hello with acks: 1 and nothing since; the server's silentTimer (SILENT_MS 20 s, checked every 5 s) closes it
const SILENT_LIMIT = 20000 + 5000 + 3000;
while (!quiet.closed && Date.now() - quietAt < SILENT_LIMIT + 2000) await sleep(250);
const quietS = ((quiet.closedAt ?? Date.now()) - quietAt) / 1000;
check(quiet.closed && quietS * 1000 <= SILENT_LIMIT, `a page silent after its hello is closed by the server (${quiet.closed ? `after ${quietS.toFixed(1)} s` : `still open after ${quietS.toFixed(1)} s`})`);
const back = player("Quiet", { acks: 1 });
for (let i = 0; i < 50 && back.views < 1 && !back.closed; i++) await sleep(200);
check(back.views >= 1 && !back.closed, `the silent page's name is free again: a new hello as Quiet gets views (${back.views})`);
clearInterval(pingTimer);
const pingS = ((pinger.closedAt ?? Date.now()) - quietAt) / 1000;
check(pinger.closed && pingS * 1000 <= SILENT_LIMIT, `a page that pings but never acks its views is closed by the server (${pinger.closed ? `after ${pingS.toFixed(1)} s` : `still open after ${pingS.toFixed(1)} s`})`);

// ---- what must still be true
const names = ["<img src=x onerror=alert(1)>", "", "   ", "a".repeat(5000), "\u0000‮"];
const odd = names.map((n) => player(n));
await sleep(2500);
const st1 = await state(A);
check(alive(st1), `Alpha is still a living human (${st1.split("\n").find((l) => l.startsWith("mob:"))?.slice(0, 90)})`);
check(A.eye.x === eye0.x && A.eye.y === eye0.y, `Alpha did not move (${eye0.x},${eye0.y} -> ${A.eye.x},${A.eye.y})`);
const v = A.views; await sleep(2000);
check(A.views > v && !A.closed, `the server is still running and sending Alpha views (${A.views - v} in 2 s)`);
const text = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : null;
check(text !== null, `server log ${logFile} found`);
if (text !== null) {
	const said = text.split("\n").filter((l) => /\[vm-boot\] command "say flood \d+/.test(l)).length;
	check(said > 0 && said < 600, `only a bounded part of the flood reached the game (${said} of 60000 says)`);
	const called = text.split("\n").filter((l) => new RegExp(`\\[vm-boot\\] (${PROCS.join("|")}) /`).test(l));
	check(called.length === 0, `no proc was run through a "mouse" message (${called.length}${called[0] ? `: ${called[0].slice(9, 120)}` : ""})`);
	const lv = text.split("\n").filter((l) => /log level now/.test(l));
	check(lv.length === 0, `a player's "loglevel" message changed nothing: no level change line in the server log (${lv.length}${lv[0] ? `: ${lv[0].slice(0, 120)}` : ""})`);
	const dead = text.split("\n").filter((l) => /worker thread (error|exited)|FATAL|shutting down/.test(l));
	check(dead.length === 0, `no worker error or shutdown in the server log (${dead.length}${dead[0] ? `: ${dead[0].slice(0, 160)}` : ""})`);
	const joined = text.split("\n").filter((l) => /\[server\] .* joined \(/.test(l) && /[<>\u0000-\u001f‮]/.test(l.slice(9)));
	check(joined.length === 0, `no player name with HTML or control characters was let in (${joined.length}${joined[0] ? `: ${joined[0].slice(9, 100)}` : ""})`);
	check(text.split("\n").some((l) => /\[server\] closing Quiet: silent/.test(l)), "the server log says it closed Quiet: silent");
	check(text.split("\n").some((l) => /\[server\] closing Pinger: no acks/.test(l)), "the server log says it closed Pinger: no acks");
	check(!text.split("\n").some((l) => l.length > 2500), "no server log line over 2500 characters (input is cut before it is logged)");
}
for (const p of [A, M, again, quiet, pinger, back, ...odd]) if (!p.closed) p.ws.close();
await sleep(500);
log(fails.length ? `FAILED (${fails.length}): ${fails.join("; ")}` : "all checks passed");
process.exit(fails.length ? 1 : 0);
