// admin-check - ps-admin, admin-link, tripcodes: being on this machine is not admin; the host key or a listed tag is; a banned key or address is refused at hello;
//   a name is free for any tag (the tag tells players apart) except a --reserved one, which only admins use; an address may bring only 5 new tags an hour (no guessing secrets online).
//   node tools/admin-check.mjs [DIST=build/psadmin-dist] [PORT=8791]      exit 0 = all checks passed
// Starts its own server (no game boot needed past the first hello: ~40 s) and reads its log. Kick/ban inside the game: topic-check.mjs.
import fs from "node:fs";
import http from "node:http";
import { spawn } from "node:child_process";
import { WebSocket } from "ws";
import { tagOf, loadPepper } from "./tripcode.mjs";
const dist = process.argv[2] ?? "build/psadmin-dist", port = Number(process.argv[3] ?? "8791");
const logFile = `build/server-${port}.log`, adminsFile = `build/admin-check-${port}.admins`, bansFile = `build/admin-check-${port}.bans.json`, pepperFile = `build/admin-check-${port}.pepper`, reservedFile = `build/admin-check-${port}.reserved`;
const HOST_KEY = "admin-check-host-key-0123456789";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { console.log(`[admin] ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };
fs.rmSync(pepperFile, { force: true });
const pepper = loadPepper(pepperFile), tag = (trip) => tagOf(pepper, trip); // made here; the server reads the same file
fs.writeFileSync(adminsFile, `# test\n${tag("carols-trip")} # Carol\n@${tag("erins-trip")}\n`);
fs.writeFileSync(reservedFile, "# only admins\nSam # the owner\nCent Com\n");
fs.writeFileSync(bansFile, JSON.stringify({ keys: { badguy: true }, ips: { "203.0.113.50": true } }));
const srv = spawn("node", ["tools/server.mjs", "--dist", dist, "--port", String(port), "--seconds", "120", "--admins", adminsFile, "--reserved", reservedFile, "--bans", bansFile, "--pepper", pepperFile, "--host-key", HOST_KEY, "--log", logFile], { stdio: "ignore" });
await sleep(2500);
const connect = (name, { xff, secret, trip, origin, host } = {}) => new Promise((res) => {
	const ws = new WebSocket(`ws://127.0.0.1:${port}`, { headers: { ...(xff !== undefined ? { "X-Forwarded-For": xff } : {}), ...(host ? { Host: host } : {}) }, origin });
	const r = { refused: null, nameTaken: false, reason: null, you: null, opened: false, closed: false };
	ws.on("open", () => { r.opened = true; });
	ws.on("open", () => ws.send(JSON.stringify({ type: "hello", player: name, secret, trip })));
	ws.on("message", (d) => { const m = JSON.parse(String(d)); if (m.type === "refused") r.refused = m.reason; if (m.type === "nameTaken") { r.nameTaken = true; r.reason = m.reason; } if (m.type === "you") r.you = m; if (m.type === "stat") r.tabs = m.tabs; });
	ws.on("close", () => { r.closed = true; });
	ws.on("error", () => {});
	setTimeout(() => res(Object.assign(r, { ws })), 1500); // live: later messages still land in it
});
const conns = [];
conns.push(await connect("Host"));                                                       // this machine, no proxy header, no key
conns.push(await connect("Stale", { secret: "last-runs-host-key" }));                     // this machine, an old host key (a tab from an earlier run)
conns.push(await connect("Owner", { secret: HOST_KEY }));                                  // this machine, the host key
conns.push(await connect("Boss", { xff: "198.51.100.70", secret: HOST_KEY }));             // from outside, the host key
conns.push(await connect("Bravo", { xff: "198.51.100.7" }));                              // proxied player
conns.push(await connect("Carol", { xff: "198.51.100.8", trip: "wrong" }));             // an unlisted tag
conns.push(await connect("Mallory", { xff: "198.51.100.9", secret: "carols-trip" }));    // a listed tag's trip sent as a secret
conns[2].ws.close(); await sleep(500);
// a name from tg's 2017 staff list (the file is gone): a plain name from it must not be admin in the game (read from its stat tabs at the end)
const legacy = await connect("Optimumtact", { xff: "198.51.100.95" });
const carol = await connect("Carol2", { xff: "198.51.100.11", trip: "carols-trip" });     // a listed tag, under any name
const bad = await connect("BadGuy", { xff: "198.51.100.12" });
const ipbad = await connect("Nice", { xff: "203.0.113.50" });
// a web page from another site (security step 1): refused before the socket opens; the game's own page (same host) and Node tools (no Origin) are let in
const evil = await connect("Evil", { origin: "https://evil.example" });
const nullOrigin = await connect("Sandboxed", { origin: "null" });
const ownPage = await connect("OwnPage", { origin: `http://127.0.0.1:${port}` });
// review fix 1 (DNS rebinding): a page whose domain now points at 127.0.0.1 sends a matching Origin and Host; it may play, but not as admin
const rebound = await connect("Rebound", { origin: `http://evil.example:${port}`, host: `evil.example:${port}` });
const rebound2 = await connect("Rebound2", { host: `evil.example:${port}` });
// review fix 3: an empty X-Forwarded-For from this machine is not the host
const emptyXff = await connect("EmptyXff", { xff: "" });
// a player squatting an admin's name: the admin (listed tag) still gets in under it
const squatter = await connect("Erin", { xff: "198.51.100.40" });
const erinBack = await connect("Erin", { xff: "198.51.100.41", trip: "erins-trip" }); erinBack.ws.close(); await sleep(300);
// tripcodes: a dropped player's name is free to others, but their key differs by tag, so the character only goes back to the same tag
const capT = tag("caps-secret");
const cap = await connect("Cap", { xff: "198.51.100.80", trip: "caps-secret" }); cap.ws.close(); await sleep(500); // the captain's link drops
const thief = await connect("Cap", { xff: "198.51.100.81", trip: "thief" });
const plainThief = await connect("cap", { xff: "198.51.100.82" });
const capBack = await connect("Cap", { xff: "198.51.100.83", trip: "caps-secret" });
const fake = await connect(`Zed @${capT}`, { xff: "198.51.100.86" }); // "@" can't be typed into a name to fake a tag
const twin1 = await connect("Twin", { xff: "198.51.100.84", trip: "twins" });
const twin2 = await connect("Twin", { xff: "198.51.100.85", trip: "twins" }); // the same tag again (a dead tab): the old connection goes
const resPlain = await connect("Sam", { xff: "198.51.100.90", trip: "anyone" }), resDots = await connect("S.a m", { xff: "198.51.100.96", trip: "anyone2" }), resCent = await connect("centcom", { xff: "198.51.100.92", trip: "anyone3" });
const resNear = await connect("Sam2", { xff: "198.51.100.93", trip: "anyone4" });
const resAdmin = await connect("Sam", { xff: "198.51.100.94", trip: "carols-trip" }), resHost = await connect("CentCom", { xff: "198.51.100.95", secret: HOST_KEY });
const bravo2 = await connect("Bravo", { xff: "198.51.100.87" }); // a plain name already connected: refused
const loglevel = (headers) => new Promise((res) => http.get({ host: "127.0.0.1", port, path: "/loglevel?level=normal", headers }, (r) => { r.resume(); res(r.statusCode); }).on("error", () => res(0)));
const llCross = await loglevel({ "Sec-Fetch-Site": "cross-site" }), llEvil = await loglevel({ Origin: "https://evil.example" }), llPlain = await loglevel({}), llRebound = await loglevel({ Host: `evil.example:${port}` });
// guessing: 5 other tags under one name from one address, then even the right one is refused from there (not from elsewhere)
const dave = await connect("Dave", { xff: "198.51.100.19", trip: "daves-long-secret" }); dave.ws.close(); await sleep(300);
const guesses = [];
for (let i = 0; i < 5; i++) { const g = await connect("Dave", { xff: "198.51.100.20", trip: `guess${i}` }); guesses.push(g); g.ws.close(); await sleep(300); }
const sixth = await connect("Dave", { xff: "198.51.100.20", trip: "daves-long-secret" }); sixth.ws.close(); await sleep(300);
const elsewhere = await connect("Dave", { xff: "198.51.100.21", trip: "daves-long-secret" });
// online guessing under free names: the tag a join gets back (and shows in Who) tells a guesser when a secret hits someone's tag, so one
// address may bring 5 different tags an hour; the 6th is refused, a right guess or an admin's too. A tag it brought before still joins.
const frank = await connect("Frank", { xff: "198.51.100.90", trip: "franks-pw" });
const probes = [];
for (let i = 0; i < 5; i++) { const p = await connect(`Probe${i}`, { xff: "198.51.100.91", trip: `pw${i}` }); probes.push(p); p.ws.close(); await sleep(300); }
const probeHit = await connect("Probe5", { xff: "198.51.100.91", trip: "franks-pw" }); probeHit.ws.close();
const probeAdmin = await connect("Probe6", { xff: "198.51.100.91", trip: "erins-trip" }); probeAdmin.ws.close();
const probeAgain = await connect("Probe0", { xff: "198.51.100.91", trip: "pw0" });
// acks on a budget (security step 5): 5000 acks in a second from a joined player get it closed for flooding
const acker = await connect("Acker", { xff: "198.51.100.30" });
for (let i = 0; i < 5000; i++) acker.ws.send(`{"type":"ack","s":${i}}`);
await sleep(1500);
// connection rate (review: connection floods): 12 quick connections from one address, the last 2 refused; another address is unaffected
const quickOpened = []; // per connection: cut = the server closed it at once
const quick = async (xff) => { const ws = new WebSocket(`ws://127.0.0.1:${port}`, { headers: { "X-Forwarded-For": xff } }); const x = { cut: false }; ws.on("error", () => {}); await new Promise((r) => { ws.on("close", () => { x.cut = true; r(); }); setTimeout(r, 1000); }); if (xff.endsWith(".60")) quickOpened.push({ ...x }); /* read before this side closes it */ ws.close(); await sleep(50); };
for (let i = 0; i < 12; i++) await quick("198.51.100.60");
await quick("198.51.100.61");
await sleep(500);
for (let i = 0; i < 60 && !legacy.tabs; i++) await sleep(1000); // its first stat panel comes once the world has started
const log = fs.readFileSync(logFile, "utf8");
check(legacy.tabs && !legacy.tabs.includes("Debug") && !legacy.tabs.includes("Server"), `a name from tg's old staff list, with no tripcode: not admin in the game (tabs ${legacy.tabs?.join(",") ?? "none came"})`);
check((log.match(/connection from 198\.51\.100\.60 refused \(too fast, 1 in a row/g) ?? []).length === 1 && quickOpened.length === 12 && quickOpened.slice(10).every((x) => x.cut) && !quickOpened.slice(0, 10).some((x) => x.cut) && !/198\.51\.100\.61 refused/.test(log), "the 11th and 12th connection in a minute from one address are refused, another address is not");
check(/closing Acker: flooding/.test(log), "a player sending 5000 acks in a second is closed for flooding");
const daveT = tag("daves-long-secret");
check(guesses.every((g) => g.you !== null) && sixth.refused !== null && /Too many/.test(sixth.refused ?? ""), "after 5 different tags from one address, the 6th (right) one is refused");
check(/Dave @\w+ \(198\.51\.100\.20\) refused: too many tries/.test(log), "the refusal is logged");
check(elsewhere.refused === null && elsewhere.you?.key === `Dave @${daveT}`, "the right tag from another address still gets the name");
check(probes.every((p) => p.you !== null) && probeHit.you === null && /Too many/.test(probeHit.refused ?? "") && probeAdmin.you === null && !/ probe6@\w+ is admin/.test(log), `after 5 new tags from one address under free names, the 6th (another player's secret) and 7th (an admin's) are refused (${probeHit.you?.key ?? probeHit.refused}; ${probeAdmin.you?.key ?? probeAdmin.refused})`);
check(probeAgain.you?.key === `Probe0 @${tag("pw0")}`, "a tag the address brought before still joins (a reconnect)");
check(!thief.nameTaken && !plainThief.nameTaken && thief.you?.key !== cap.you?.key && plainThief.you?.key === "cap", `a dropped player's name is free to another tag and to no tag, under their own keys (${thief.you?.key}, ${plainThief.you?.key})`);
check(resPlain.reason === "reserved" && resDots.reason === "reserved" && resCent.reason === "reserved" && !resNear.nameTaken && resNear.you !== null, `a reserved name is refused by ckey (Sam, S.a m, centcom: ${resPlain.reason}, ${resDots.reason}, ${resCent.reason}); Sam2 is not (${resNear.reason})`);
check(resAdmin.you !== null && resHost.you !== null && !resAdmin.nameTaken && !resHost.nameTaken, "an admin tag or the host key may use a reserved name");
check(cap.you?.key === `Cap @${capT}` && capBack.you?.key === cap.you?.key && capBack.you?.ckey === `cap@${capT}` && !capBack.nameTaken, `the same secret gets the name and character back (${cap.you?.key} then ${capBack.you?.key})`);
check(fake.you?.ckey === `zed${capT}`, `an @ typed into a name is dropped, so no name looks like a tag (${fake.you?.ckey})`);
check(twin1.reason === "replaced" && twin1.closed && !twin2.nameTaken && twin2.you?.key === `Twin @${tag("twins")}`, "the same tag again while still connected replaces the old connection");
check(!twin2.closed, "the new connection stays (the game's disconnect of the old client didn't close it too)");
check(bravo2.reason === "connected", `a plain name already connected is refused (${bravo2.reason})`);
check(!evil.opened && /refused: page from https:\/\/evil\.example/.test(log), "a page from another site is refused (and logged)");
check(!nullOrigin.opened, "a sandboxed page (Origin: null) is refused");
check(ownPage.opened && / OwnPage \(ownpage\) joined/.test(log) && !/ ownpage is admin/.test(log), "the game's own page (same host) connects, as a normal player without a key");
// review #2: a connection from this machine asking for another site's name with no X-Forwarded-For looks like a proxy that drops it: warned once
check((log.match(/warning: a connection from this machine for evil\.example:\d+ has no X-Forwarded-For/g) ?? []).length === 1, "a proxy that drops X-Forwarded-For is warned about once");
check(rebound.opened && /websocket connected from 127\.0\.0\.1\n/.test(log) && / Rebound \(rebound\) joined/.test(log), "a rebound page (Origin and Host both evil.example) joins, but not as admin");
check(/websocket connected from 127\.0\.0\.1 \(via proxy\)\n/.test(log) && / EmptyXff \(emptyxff\) joined/.test(log), "an empty X-Forwarded-For from this machine is not admin");
check(erinBack.refused === null && !erinBack.nameTaken && new RegExp(` erin@${tag("erins-trip")} is admin \\(tag from 198\\.51\\.100\\.41\\)`).test(log), "an admin (listed tag) is admin under a name another player is using");
check(llCross === 404 && llEvil === 404 && llRebound === 404 && llPlain === 200, `/loglevel: cross-site ${llCross}, other origin ${llEvil}, rebound host ${llRebound} (want 404), curl-like ${llPlain} (want 200)`);
check(!/ host is admin/.test(log) && !/ stale is admin/.test(log) && !/stale: wrong/.test(log), "from this machine without the key, or with an old one: a normal player (an old key is not counted as a guess)");
check(/ owner is admin \(host key from 127\.0\.0\.1\)/.test(log) && / boss is admin \(host key from 198\.51\.100\.70\)/.test(log), "the host key is admin, from this machine or from outside");
check(/connected from 198\.51\.100\.7 \(via proxy\)\n/.test(log), "proxied player shows its real address, not the host");
check(!/ bravo is admin/.test(log) && !/ carol@\w+ is admin/.test(log) && !/ mallory\S* is admin/.test(log), "no tag, an unlisted tag, or a listed tag's trip as a secret: not admin");
check(new RegExp(` carol2@${tag("carols-trip")} is admin \\(tag from 198\\.51\\.100\\.11\\)`).test(log), "a listed tag (written with or without @): admin");
check(bad.refused !== null, "banned key refused at hello");
check(ipbad.refused !== null, "banned address refused at hello");
check(conns.every((c) => c.refused === null) && carol.refused === null, "everyone else was let in");
for (const c of [...conns, carol, bad, ipbad, evil, nullOrigin, ownPage, rebound, rebound2, emptyXff, squatter, elsewhere, frank, probeAgain, legacy, acker, thief, plainThief, capBack, fake, twin1, twin2, bravo2]) c.ws.close();
srv.kill("SIGTERM");
console.log(fails.length ? `[admin] ${fails.length} FAILED` : "[admin] all passed");
process.exit(fails.length ? 1 : 0);
