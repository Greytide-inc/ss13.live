// mp-check - multiplayer check: two raw WebSocket players on a running tools/server.mjs, no browser. Alpha joins, Beta joins later; Alpha walks and talks;
// the check is what Beta's stream shows: Alpha's mob moving (Beta's view `moved` list has a move onto Alpha's new tile) and Alpha's say line in
// Beta's chat output. Also: a second connection with a taken plain name is refused; Beta plays under a tripcode and gets the same mob back. Prints views / bytes per second per player.
//   node tools/mp-check.mjs PORT [SECONDS_AFTER_BETA=25]      exit 0 = all checks passed
import { WebSocket } from "ws";
const port = Number(process.argv[2] ?? "8780"), wait = Number(process.argv[3] ?? "25") * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (s) => console.log(`[mp-check] ${s}`);
function player(name, trip) {
	const p = { name, ws: new WebSocket(`ws://127.0.0.1:${port}`), views: 0, bytes: 0, t0: Date.now(), eye: null, eyes: [], moves: [], chat: [], hudType: new Map(), active: new Map(), tileIds: new Map(), nowViews: [], msgs: {}, nameTaken: false, closed: false };
	p.hands = () => [...p.hudType].filter(([, t]) => t === "/obj/screen/inventory/hand").map(([id]) => id);
	p.ws.on("open", () => p.ws.send(JSON.stringify({ type: "hello", player: name, trip })));
	p.ws.on("close", () => (p.closed = true));
	p.ws.on("message", (d) => {
		const t = String(d); p.bytes += t.length;
		const m = JSON.parse(t); p.msgs[m.type] = (p.msgs[m.type] ?? 0) + 1;
		if (m.type === "nameTaken") p.nameTaken = true;
		if (m.type === "output") for (const l of m.lines) p.chat.push(String(l).replace(/<[^>]*>/g, ""));
		if (m.type === "view") {
			p.views++;
			const e = m.update.eyeTile;
			if (e && (!p.eye || p.eye.x !== e.x || p.eye.y !== e.y)) { p.eye = e; p.eyes.push({ ...e, at: Date.now() }); }
			for (const sc of m.update.screen ?? []) p.hudType.set(sc[0], sc[1]);
			for (const [id, a] of m.update.apps ?? []) p.active.set(id, (a.overlays ?? []).some((o) => o.iconState === "hand_active"));
			for (const t of m.update.tiles ?? []) p.tileIds.set(`${t[0]},${t[1]}`, t[2]);
			if (m.update.now === 1) p.nowViews.push({ at: Date.now(), hands: p.hands().map((h) => p.active.get(h)) });
			for (const mv of m.update.moved ?? []) p.moves.push({ from: [mv[1], mv[2]], to: [mv[3], mv[4]], at: Date.now() });
		}
	});
	return p;
}
const key = (p, k) => { p.ws.send(JSON.stringify({ type: "key", key: k, down: true })); setTimeout(() => p.ws.send(JSON.stringify({ type: "key", key: k, down: false })), 60); };
const fails = [];
const check = (ok, what) => { log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };

const A = player("Alpha");
while (A.views < 5) await sleep(200);
log(`Alpha has views, eye ${JSON.stringify(A.eye)}`);
const B = player("Beta", "betas-secret");
await sleep(wait);
const dup = player("alpha"); // a plain name (no tag) already connected is refused; a tagged one would replace its own old connection
await sleep(1500);
check(dup.nameTaken && dup.closed, "a second plain-named 'alpha' is refused (nameTaken)");
check(B.views > 20, `Beta gets views (${B.views})`);
const a0 = { ...A.eye }, mark = Date.now();
for (let i = 0; i < 4; i++) { key(A, "EAST"); await sleep(400); }
for (let i = 0; i < 3; i++) { key(A, "SOUTH"); await sleep(400); }
A.ws.send(JSON.stringify({ type: "command", text: 'say "hello from alpha"' }));
await sleep(3000);
log(`Alpha's eye ${JSON.stringify(a0)} -> ${JSON.stringify(A.eye)}`);
check(A.eye.x !== a0.x || A.eye.y !== a0.y, "Alpha's own view says Alpha moved");
const seen = A.eyes.filter((e) => e.at > mark).slice(1).filter((e, i, a) => B.moves.some((m) => m.at > mark && m.to[0] === e.x && m.to[1] === e.y));
check(seen.length >= 1, `Beta's view has Alpha's mob moving onto Alpha's new tiles (${seen.length} of ${A.eyes.filter((e) => e.at > mark).length - 1} steps matched: ${seen.map((e) => `${e.x},${e.y}`).join(" ")})`);
check(B.chat.some((l) => /hello from alpha/i.test(l)), `Beta's chat has Alpha's say (${B.chat.filter((l) => /alpha/i.test(l)).slice(-2).join(" | ")})`);
// a plain middle click on Alpha's own tile swaps hands; the answer sent at once (a view marked now: 1) must already show the other hand active (rt-hand, efa855c6)
const before = A.hands().map((h) => A.active.get(h)), mobIds = A.tileIds.get(`${A.eye.x},${A.eye.y}`) ?? [], clickAt = Date.now();
A.nowViews.length = 0;
A.ws.send(JSON.stringify({ type: "click", id: mobIds[mobIds.length - 1] ?? null, x: A.eye.x, y: A.eye.y, dbl: false, control: "", params: "middle=1" }));
await sleep(2000);
const answer = A.nowViews.find((v) => v.at >= clickAt);
log(`hands before ${JSON.stringify(before)}, in the first now:1 view ${JSON.stringify(answer?.hands)}`);
check(before.length === 2 && before.filter(Boolean).length === 1 && !!answer && answer.hands.every((a, i) => a === !before[i]), "a middle click's own answer (now: 1) already shows the other hand active");
// disconnect: Beta leaves (the game runs client/Del and Beta's mob Logout: Who no longer lists Beta), a new Beta may come back
const who = async () => { const n = A.chat.length; A.ws.send(JSON.stringify({ type: "command", text: "Who" })); await sleep(1500); return A.chat.slice(n).join(" "); };
const whoIn = await who();
B.ws.close(); await sleep(1500);
const whoOut = await who();
log(`Who with Beta: ${whoIn.slice(0, 120)} | after Beta left: ${whoOut.slice(0, 120)}`);
check(/Beta @[a-z2-9]{8}/.test(whoIn) && !/beta/i.test(whoOut), "Who lists Beta with its tag while connected, not after Beta left");
const B2 = player("Beta", "betas-secret"); await sleep(3000);
check(!B2.nameTaken && !B2.closed, "Beta can reconnect after leaving");
check(!!B2.eye && B2.eye.x === B.eye.x && B2.eye.y === B.eye.y, `Beta is back in its own mob (eye ${JSON.stringify(B.eye)} before, ${JSON.stringify(B2.eye)} after)`);
const secs = (Date.now() - A.t0) / 1000;
for (const p of [A, B, B2]) log(`${p.name}: ${p.views} views, ${(p.bytes / 1024).toFixed(0)} KB, ${(p.bytes / 1024 / ((Date.now() - p.t0) / 1000)).toFixed(1)} KB/s, msgs ${JSON.stringify(p.msgs)}`);
for (const p of [A, B2]) p.ws.close();
await sleep(500);
log(fails.length ? `FAILED: ${fails.join("; ")}` : "all checks passed");
process.exit(fails.length ? 1 : 0);
