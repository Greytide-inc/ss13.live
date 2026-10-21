// server - multiplayer server: one Node process that runs the game loop from the browser worker
// (build/dist/src/worker/boot-worker.js inside <dist>) in a worker thread, serves the dist folder over HTTP and accepts
// WebSocket connections. Messages are the worker protocol (see the top of src/worker/boot-worker.ts), as JSON text frames.
//   node tools/server.mjs --dist build/mp-server-dist --port 8780 [--join Assistant] [--roundstart] [--seconds N] [--log FILE]
//        [--map NAME] [--spawn-near] [--seed N] [--second KEY] [--tgui /obj/path [--tgui-watch var,var]] [--lobby] [--lobby-seconds N --autojoin JOB --endround S --rounddelay S: test aids] [--host-key KEY] [--log-level quiet|normal|chatty] [--hot] [--no-click-now] [--admins FILE] [--reserved FILE] [--bans FILE] [--pepper FILE] [--saves FILE] [--empty-reset S]
// --log-level: how much of the per-input log (key, topic, Click, to client: ...) goes in the log: quiet = none of it, chatty = also every "to client:" line, uncut.
//   /status: players on, map, round (JSON for the landing page, no names).
//   Mid-round: curl "http://127.0.0.1:PORT/loglevel?level=chatty" (this machine only, no X-Forwarded-For; a player's socket can't send it).
// --hot: dev only: `node tools/hot.mjs` loads edited game procs into this running world (no restart).
// --no-click-now: a click waits for the next tick, as before netcode step 1 (by default it runs when it arrives and its answer goes out at once).
// --empty-reset S: once everyone has left a world, a fresh one starts after S seconds with nobody back (default 900; 0 = never), so a
//   visitor hours later doesn't walk into a dark, half-dead station.
// --lobby: a normal round: every player arrives in tg's lobby (character setup, job preferences, Ready / late-join themselves).
// Who is admin, and kick/ban. Behind a proxy (Caddy on this machine)
//   every socket is local, so a local connection that carries X-Forwarded-For is a proxied player: its address is the last entry (the
//   proxy's own). Being on this machine never makes a player admin: only a secret in the hello does (the page sends ?adminkey=). The host
//   key (--host-key KEY, else a random one printed as a link at start) is admin under any name;
//   --admins FILE (one tag a line, # comments) lists tripcode tags whose players are admin. A kick is
//   del(client) in the game (admin panel): the server closes that connection. A permanent ban in the game also lands in --bans FILE
//   (JSON {keys, ips}); a banned key or address is refused at hello, before it reaches the game.
// Server -> client: every worker message, as JSON. Messages with `player` go to the connection of that ckey only; the rest go to
//   everyone. Uint8Array bytes (rsc_png.png) are sent as {"$b64": "..."}; runtime icons come first as {type:"rtIcon", url, path, dmi} (the client makes
//   its own blob URL and swaps it for `url` in later views). Client -> server: input messages (key, click, command, ...), forwarded to the
//   worker; "start" and "stop" from clients are ignored. A connection must first send {type:"hello", player:"Name", trip?:"secret"}: the name
//   (made a ckey like the engine's) is its player. Tripcodes: with a trip, the player's key is "Name @tag" (tools/tripcode.mjs: one way,
//   keyed by --pepper FILE, made if missing; without it a fresh pepper each start), so its ckey, mob and saves belong to that tag. A name
//   is free for anyone (two players can both be "Sam": the tag tells them apart) unless --reserved FILE lists it (one name a line, # comments,
//   compared as a ckey): then only admins use it. One address may bring 5 different tags an hour,
//   so secrets can't be guessed online (the tag shows in Who). The same key again while still connected (a dead tab) replaces the old connection. The page
//   always sends a trip (Name#secret, else a random one kept in the browser); no trip (test tools) is the plain name. The first
//   message back is {type:"you", key, ckey}. --saves FILE keeps the savefiles (character setups) in FILE across rounds and restarts
//   (tools/server-prelude.mjs); without it they last one round. The game starts when the first hello arrives (that name is the first player, readied in the lobby as --join);
//   each later hello is connected as a new player while the round runs and late-joins as Assistant. A name already connected is refused
//   ({type:"nameTaken", name, reason}, then closed). A closed connection disconnects its client (its mob stays).
//   On connect the client gets the log/milestone backlog and a { type: "resync" } is sent for it so its next view is a full one.
//   Views are numbered per connection (update.seq). A hello with acks: 1 (the page) promises {"type":"ack","s":SEQ} for each view; while
//   its acks lag (a backed-up link), views are held and merged (view-merge.mjs). Acks are outside the message budget. A hello with pack: 1
//   gets packed views (worker/view-pack.js).
// What a hostile connection can't do. A frame over MAX_FRAME closes it; each connection has
//   a message budget (RATE_BURST, refilled RATE_PER_S a second: a real page stays under ~60/s) and a byte budget (BYTE_BURST, refilled
//   BYTE_PER_S: past it only at 60 messages a second of over ~500 bytes each; input is ~100-200 bytes, a pasted book page ~20 KB once), messages over either are dropped and a connection that keeps flooding is closed; resync and bugstate (the costly ones) once a second; a hello must come within HELLO_MS; at most
//   MAX_SOCKETS connections, MAX_PER_IP from one outside address (an IPv6 /64 counts as one address, as for every per-address limit and IP ban); a client too slow to take its views (MAX_BUFFERED waiting) is closed.
//   A page (acks: 1, it pings once a second) silent for SILENT_MS is closed: a link that died without a close (a VPN or tunnel drop) would
//   otherwise stay "connected" forever and its name could not join again.
//   Names keep only letters, digits, space and _ - . (@ marks a tag; a name is shown to other players as HTML). The shape of each message is checked
//   in the worker (src/worker/input-check.ts). World log lines (they hold every player's typed commands) and the round-end data files go only to admins.
import http from "node:http";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import net from "node:net";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import { ViewQueue } from "./view-merge.mjs";
import { ViewPacker } from "../worker/view-pack.js";
import { tagOf, loadPepper } from "./tripcode.mjs";

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const dist = path.resolve(opt("--dist", "build/mp-server-dist"));
const port = Number(opt("--port", "8780"));
const lobby = argv.includes("--lobby");
const join = lobby ? "" : opt("--join", "Assistant");
const logFile = opt("--log", `build/server-${port}.log`);
const seconds = opt("--seconds", null);
const script = path.join(dist, "web/build/dist/src/worker/boot-worker.js");
if (!fs.existsSync(script)) { console.error(`no ${script}: build first (npm run build:static -- --dist ${opt("--dist", "build/mp-server-dist")})`); process.exit(2); }

fs.mkdirSync(path.dirname(path.resolve(logFile)), { recursive: true });
const logStream = fs.createWriteStream(logFile);
const out = (line) => { const l = `${new Date().toISOString().slice(11, 19)} ${line}`; console.log(l); logStream.write(l + "\n"); };

// ---- HTTP: the dist folder
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".dmi": "image/png", ".gz": "application/octet-stream", ".ogg": "audio/ogg", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".map": "application/json", ".dmf": "text/plain", ".txt": "text/plain", ".svg": "image/svg+xml" };
// Log level: quiet | normal | chatty. --log-level at start; mid-round `curl "http://127.0.0.1:PORT/loglevel?level=chatty"`,
// answered only for this machine with no X-Forwarded-For header (isHostRequest); anyone else gets 404. Not a player message: never in FORWARD.
let logLevel = opt("--log-level", "normal");
if (!["quiet", "normal", "chatty"].includes(logLevel)) { console.error(`--log-level must be quiet, normal or chatty (got ${logLevel})`); process.exit(2); }
// A request's peer address, and whether it is this machine (loopback or one of its own interface addresses).
const peerOf = (req) => String(req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
const isLocalPeer = (peer) => peer === "::1" || peer.startsWith("127.") || Object.values(os.networkInterfaces()).flat().map((i) => i?.address).includes(peer);
// What the per-address limits and IP bans count (security review 2026-10-21): an IPv4 address, or an IPv6 address's /64, written
// "2001:db8:1:2::/64": one home or rented server gets a whole /64, so counting each IPv6 address alone would let it walk past every limit.
const blockOf = (ip) => {
	if (!net.isIPv6(ip)) return ip;
	const [h, t] = ip.split("::"), head = h ? h.split(":") : [], tail = t ? t.split(":") : [];
	const all = t === undefined ? head : [...head, ...Array(Math.max(0, 8 - head.length - tail.length)).fill("0"), ...tail];
	return `${all.slice(0, 4).map((x) => parseInt(x, 16).toString(16)).join(":")}::/64`;
};
// /loglevel only (admin is by secret): the host also asked for this machine by name (security review fix 1): a page whose domain was rebound to 127.0.0.1 sends its own
// domain as Host, so it is not the host. Any X-Forwarded-For, even an empty one, means a proxy and not the host (review fix 3).
const ownNames = () => ["localhost", os.hostname().toLowerCase(), `${os.hostname().toLowerCase()}.local`];
const isLocalName = (host) => { try { const h = new URL(`http://${host}`).hostname.replace(/^\[|\]$/g, ""); return ownNames().includes(h) || isLocalPeer(h); } catch { return false; } };
const isHostRequest = (req) => isLocalPeer(peerOf(req)) && req.headers["x-forwarded-for"] === undefined && isLocalName(String(req.headers.host ?? "").toLowerCase());
// A request a web page from another site made: any site can open ws://127.0.0.1:PORT or load
// /loglevel in an <img>. Browsers always send Origin on a websocket; Node tools and curl
// send none, so no Origin is let in. Behind Caddy, Host is passed through unchanged, so the match holds there too.
const foreignOrigin = (req) => {
	const o = req.headers.origin;
	if (o === undefined) return false;
	try { return new URL(o).host.toLowerCase() !== String(req.headers.host ?? "").toLowerCase(); } catch { return true; } // "null" (a sandboxed frame) or junk
};
const crossSite = (req) => foreignOrigin(req) || !["same-origin", "none", undefined].includes(req.headers["sec-fetch-site"]);
// Hosting: every answer: no type sniffing, never inside another site's frame (its own popups are frames). Every file is
// "no-cache" with an ETag (size + time), so a returning player's browser asks once per file and gets a short 304 while it is unchanged:
// a deploy reaches players at once and never mixes old and new code. Icons and sounds (tg's art, ~2000 files, almost never changed) are
// used from the browser's copy without asking for an hour, then checked in the background (stale-while-revalidate): no round trip
// through the tunnel before a sprite or sound shows; a changed one reaches a player within the hour or on their next visit. index.html gets the ss13-server marker, so the page plays on this
// server with no ?server= in the link (worker/index.html, serverUrl).
const SERVER_MARK = `<meta name="ss13-server" content="1">`;
const httpServer = http.createServer((req, res) => {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "SAMEORIGIN"); // not DENY: the game's popups are frames of popup.html
	if ((req.url ?? "").split("?")[0] === "/loglevel") {
		const lv = new URL(req.url, "http://x").searchParams.get("level");
		if (!isHostRequest(req) || crossSite(req)) { res.writeHead(404).end("not found"); return; }
		if (!["quiet", "normal", "chatty"].includes(lv)) { res.writeHead(400).end("level must be quiet, normal or chatty\n"); return; }
		logLevel = lv; out(`[server] log level now ${lv} (from this machine)`);
		worker.postMessage({ type: "loglevel", level: lv });
		res.writeHead(200).end(`log level ${lv}\n`); return;
	}
	if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405).end(); return; }
	if ((req.url ?? "").split("?")[0] === "/status") { // plans/site.md step 1: for the landing page on ss13.live (another address): no names
		const body = JSON.stringify({ players: clients.size, map: mapName, round, started: roundStarted, roundSeconds: roundStartAt ? Math.round((Date.now() - roundStartAt) / 1000) : null });
		res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" }).end(req.method === "HEAD" ? undefined : body); return;
	}
	let p;
	try { p = decodeURIComponent((req.url ?? "/").split("?")[0]); } catch { res.writeHead(400).end("bad request"); return; } // a broken %-escape throws
	if (p.includes("\0")) { res.writeHead(400).end("bad request"); return; }
	if (p.endsWith("/")) p += "index.html";
	const f = path.join(dist, path.normalize(p));
	if (!f.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
	// the test scenarios (the page's ?scenario=, single-player only) stay private, as in the public repo
	if (f.startsWith(path.join(dist, "web/scenarios") + path.sep)) { res.writeHead(404).end("not found"); return; }
	fs.stat(f, (err, st) => {
		if (err || !st.isFile()) { res.writeHead(404).end("not found"); return; }
		const etag = `"${st.size.toString(36)}-${Math.floor(st.mtimeMs).toString(36)}"`;
		const art = /^\/(icons|sound)\//.test(p);
		const head = { "Content-Type": MIME[path.extname(f)] ?? "application/octet-stream", "Cache-Control": art ? "public, max-age=3600, stale-while-revalidate=604800" : "no-cache", ETag: etag };
		if (req.headers["if-none-match"] === etag) { res.writeHead(304, head).end(); return; }
		if (f === path.join(dist, "index.html")) {
			fs.readFile(f, "utf8", (e, html) => {
				if (e) { res.writeHead(404).end("not found"); return; }
				const body = Buffer.from(html.replace(/<meta charset="utf-8">\n?/, (m) => `${m.trimEnd()}\n${SERVER_MARK}\n`));
				res.writeHead(200, { ...head, "Content-Length": body.length }).end(req.method === "HEAD" ? undefined : body);
			});
			return;
		}
		res.writeHead(200, { ...head, "Content-Length": st.size });
		if (req.method === "HEAD") { res.end(); return; }
		fs.createReadStream(f).on("error", () => res.destroy()).pipe(res);
	});
});

// ---- the game loop in a worker thread
const toJson = (m) => JSON.stringify(m, (k, v) => (v instanceof Uint8Array ? { $b64: Buffer.from(v).toString("base64") } : v));
const clients = new Set(); // { ws, player }
const rtIcons = []; // runtime icons sent so far (.dmi bytes)
const backlog = []; // log/milestone/stage/done messages, replayed to a connecting client (capped)
const stats = { toWorker: 0, dropped: 0, acksDropped: 0, byType: {}, bytes: 0 };
let tickLines = 0, roundStarted = false, roundStartAt = 0, mapName = null; // for /status: tg's "Loading Box Station..." line names the map
let shuttingDown = false, doneSeen = false;
let workerReady = false, firstName = null, firstAddress = null, started = false;
let round = 1; // ps-rounds: which world this is; each reboot starts a fresh worker thread (frees all of the old world)
let worker;
function spawnWorker() {
	const w = new Worker(fileURLToPath(new URL("./server-prelude.mjs", import.meta.url)), {
		workerData: { script, saves: opt("--saves", null) && path.resolve(opt("--saves")) },
		execArgv: ["--experimental-default-type=module"],
		resourceLimits: { maxOldGenerationSizeMb: 3072, stackSizeMb: 8 },
	});
	w.on("error", (e) => out(`[server] worker thread error: ${e.stack ?? e}`));
	w.on("exit", (c) => { if (w !== worker) return; if (!shuttingDown) out(`[server] worker thread exited (${c})`); shutdown(c && !doneSeen ? 1 : 0); });
	w.on("message", (m) => { if (w === worker) onWorkerMessage(m); });
	worker = w;
}
// ps-rounds: tg called world.Reboot(): end this world's thread and start the next one; the connected players stay connected
// and arrive in the new world's lobby (the first one is its start player, the rest connect as later hellos do).
function nextRound() {
	const old = worker;
	round++;
	out(`[server] round over: starting world ${round} for ${clients.size} connected player(s)`);
	started = false; workerReady = false; roundStarted = false; roundStartAt = 0; mapName = null; tickLines = 0;
	firstName = null; firstAddress = null; clearTimeout(emptyTimer); emptyTimer = null;
	rtIcons.length = 0; backlog.length = 0;
	for (const c of clients) { c.viewReady = false; c.views.held = null; }
	spawnWorker();
	void old.terminate();
}
// --hot (dev only, tools/hot.mjs): edited game procs are loaded into the running world. The tool drops them in
// build/hot/PORT.in.json, a file on this machine: nothing a player sends over the network can reach this.
const hotDir = argv.includes("--hot") ? fileURLToPath(new URL("../build/hot", import.meta.url)) : null;
if (hotDir) {
	fs.mkdirSync(hotDir, { recursive: true });
	const inFile = path.join(hotDir, `${port}.in.json`);
	fs.rmSync(inFile, { force: true });
	fs.writeFileSync(path.join(hotDir, `${port}.json`), JSON.stringify({ port, pid: process.pid, dist, log: path.resolve(logFile) }));
	setInterval(() => {
		let m;
		try { m = JSON.parse(fs.readFileSync(inFile, "utf8")); } catch { return; } // not there, or still being written
		fs.rmSync(inFile, { force: true });
		worker.postMessage({ type: "hot", id: String(m.id), files: m.files ?? [], fresh: m.fresh === true, tgui: m.tgui, tguiSet: m.tguiSet, tguiWatch: m.tguiWatch }); // fresh: topic-check --again --fresh (a new --tgui machine)
	}, 200).unref();
}
const ckeyOf = (k) => String(k).toLowerCase().replace(/[^a-z0-9@]/g, "");
// ---- admins and bans (files on this machine)
const sha = (t) => crypto.createHash("sha256").update(String(t)).digest();
let pepper;
try { pepper = loadPepper(opt("--pepper", null)); } catch (e) { console.error(`[server] ${e.message}`); process.exit(2); }
const admins = new Set(); // tripcode tags
if (opt("--admins", null)) {
	for (const line of fs.readFileSync(opt("--admins"), "utf8").split("\n")) {
		const t = line.trim().split(/\s+/)[0]?.replace(/^@/, "");
		if (t && !t.startsWith("#")) admins.add(t);
	}
	console.log(`[server] ${admins.size} admin tag(s) from ${opt("--admins")}`);
}
const reserved = new Set(); // ckeys of names only admins may use
if (opt("--reserved", null)) {
	for (const line of fs.readFileSync(opt("--reserved"), "utf8").split("\n")) {
		const n = ckeyOf(line.replace(/#.*/, ""));
		if (n) reserved.add(n);
	}
	console.log(`[server] ${reserved.size} reserved name(s) from ${opt("--reserved")}`);
}
// Guessing secrets online: the tag a join gets back (and shows in OOC and Who) tells whoever joined whether its secret gives someone's
// tag, under any free name. So every different tag an address brings counts: past NEW_TAGS_MAX in NEW_TAGS_MS, a hello with another
// tag is refused, the right one too. The same tag again is free (a reconnect) and stays known; the host key is not a tag.
const NEW_TAGS_MAX = 5, NEW_TAGS_MS = 60 * 60 * 1000, tagsSeen = new Map(); // blockOf(ip) -> Map(tag -> when it last brought it)
const tagsOf = (ip) => { const t = tagsSeen.get(ip) ?? new Map(); for (const [k, at] of t) if (Date.now() - at >= NEW_TAGS_MS) t.delete(k); if (t.size) tagsSeen.set(ip, t); else tagsSeen.delete(ip); return t; };
// The host key: fresh each start unless given, so nobody can guess it and a stale tab's old key just plays as a normal
// player (not counted as a guess: counting would lock out this machine's own address after a few restarts). Printed, never in the log file.
const hostKeyText = opt("--host-key", null) ?? crypto.randomBytes(18).toString("base64url"), hostKey = sha(hostKeyText);
const hostKeyOk = (secret) => typeof secret === "string" && crypto.timingSafeEqual(hostKey, sha(secret));
const banFile = opt("--bans", null);
let bans = { keys: {}, ips: {} };
if (banFile && fs.existsSync(banFile)) { try { bans = { keys: {}, ips: {}, ...JSON.parse(fs.readFileSync(banFile, "utf8")) }; } catch (e) { console.error(`[server] ${banFile}: ${e.message}`); process.exit(2); } }
function addBan(ck, addr) {
	bans.keys[ck] = true;
	if (addr && net.isIP(addr) && !addr.startsWith("127.") && addr !== "::1" && addr !== "192.0.2.1") bans.ips[blockOf(addr)] = true; // IPv6: its /64
	if (banFile) fs.writeFileSync(banFile, JSON.stringify(bans, null, 1));
	out(`[server] ban saved: ${ck} ${addr ?? ""}`);
}
// --empty-reset: the last player left a world someone played in: a fresh world after EMPTY_RESET_S unless someone comes back first
const EMPTY_RESET_S = Number(opt("--empty-reset", "900"));
let emptyTimer = null;
function emptyCheck() {
	clearTimeout(emptyTimer); emptyTimer = null;
	if (clients.size || !EMPTY_RESET_S || (firstName === null && !started)) return;
	emptyTimer = setTimeout(() => {
		emptyTimer = null;
		if (clients.size || shuttingDown) return;
		out(`[server] nobody connected for ${EMPTY_RESET_S} s: a fresh world`);
		nextRound();
	}, EMPTY_RESET_S * 1000);
}
function tryStart() {
	if (started || !workerReady) return;
	if (round > 1) { // a later world: the first connected player starts it, the others connect after
		const f = [...clients][0];
		if (!f) { firstName = null; return; }
		firstName = f.name; firstAddress = f.address;
	}
	if (firstName === null) return;
	started = true;
	{
		const isLobby = lobby || round > 1; // the next world always starts in the lobby
		const start = { type: "start", playerKey: firstName, playerAddress: firstAddress, snapshot: true, fastAir: true, dirty: true, lobby: isLobby, rtIcons: true, join: isLobby ? "" : join, gender: "male", roundstart: !isLobby, ticks: Infinity, seconds: seconds ? Number(seconds) : Infinity, afterStart: null, seed: round > 1 ? crypto.randomInt(1, 1e6) : Number(opt("--seed", String(Date.now() % 1e6))), busyWait: false, round, clickNow: !argv.includes("--no-click-now"), log: logLevel };
		if (opt("--map", null)) start.map = opt("--map");
		// test aids (tools/rounds-check.mjs): short rounds. --autojoin JOB late-joins the first player in every lobby once the round starts.
		if (opt("--lobby-seconds", null)) start.lobbySeconds = Number(opt("--lobby-seconds"));
		if (opt("--autojoin", null)) start.autojoin = opt("--autojoin");
		if (opt("--endround", null)) start.endround = Number(opt("--endround"));
		if (opt("--rounddelay", null)) start.rounddelay = Number(opt("--rounddelay"));
		if (opt("--tgui-set", null)) start.tguiSet = opt("--tgui-set"); // test aid: set vars on the --tgui atom when its window opens, e.g. disabled=1
		if (opt("--tgui-watch", null)) start.tguiWatch = opt("--tgui-watch"); // test aid (tools/topic-check.mjs): log these vars of the --tgui atom when they change
		if (opt("--tgui", null)) start.tgui = opt("--tgui"); // test aid: e.g. /obj/machinery/disposal/bin opens that tgui window for the player
		if (opt("--second", null)) start.second = opt("--second");
		if (hotDir) start.hot = true;
		out(`[server] starting the game (join ${join}) for ${firstName}`);
		worker.postMessage(start);
		if (round > 1) for (const c of clients) { if (c.name !== firstName) worker.postMessage({ type: "connect", key: c.name, job: "", near: false, address: c.address }); worker.postMessage({ type: "resync", player: c.player }); }
	}
}
function onWorkerMessage(m) {
	if (m.type === "hotResult") { fs.writeFileSync(path.join(hotDir, `${port}.out.json`), JSON.stringify(m)); return; }
	if (m.type === "worker-ready") { workerReady = true; out("[server] worker ready, waiting for the first player"); tryStart(); return; }
	if (m.type === "log") { out(m.line); const b = /^\[server-ban\] ([a-z0-9@]+) (\S+)$/.exec(m.line); if (b) addBan(b[1], b[2] === "-" ? null : b[2]); if (/Game start took/.test(m.line)) { roundStarted = true; roundStartAt = Date.now(); } const mp = /^Loading (.+)\.\.\.$/.exec(m.line); if (mp) mapName = mp[1]; if (/live:/.test(m.line)) tickLines++; }
	if (m.type === "milestone") out(`[server] milestone ${m.name} (${m.s}s)`);
	if (m.type === "rtIcon") rtIcons.push(m); // replayed to a connecting client (the views it gets use these URLs)
	if (m.type === "log" || m.type === "milestone" || m.type === "done") { backlog.push(m); if (backlog.length > 500) backlog.shift(); }
	if (m.type === "done") doneSeen = true;
	if (m.type === "done") setTimeout(() => shutdown(0), 1000); // the run is over (--seconds)
	const text = m.type === "view" ? "" : toJson(m); // views are numbered per player: sendView writes them
	stats.byType[m.type] = (stats.byType[m.type] ?? 0) + 1;
	stats.bytes += text.length;
	const to = m.player ? ckeyOf(m.player) : null;
	if (to === null && m.type === "bugstate") return; // one player's state (security step 6): never to everyone
	for (const c of clients) if (to === null || c.player === to) {
		if (m.type === "view") { if (!c.viewReady && !m.update?.full) continue; c.viewReady = true; } // a new connection's views start at its resync's full one
		if ((m.type === "log" || m.type === "file") && !c.admin) continue; // the world log has every player's commands in it, and the round-end data files (security review 2026-10-21) their say/PDA logs and addresses: only for admins
		if (c.ws.readyState !== 1) continue;
			if (m.type === "disconnect" || m.type === "refused") setTimeout(() => c.ws.close(), 300); // del(client): the game kicked this player
		if (c.ws.bufferedAmount > MAX_BUFFERED) { kick(c, `not reading (${(c.ws.bufferedAmount / 1048576).toFixed(0)} MB waiting)`); continue; }
		if (m.type === "view") { c.views.push(m.update); continue; }
		c.ws.send(text);
	}
	if (m.type === "reboot") nextRound();
}
spawnWorker();

// ---- WebSocket: each connection is one player
const MAX_FRAME = 128 * 1024, RATE_BURST = 120, RATE_PER_S = 60, BYTE_BURST = 256 * 1024, BYTE_PER_S = 32 * 1024, FLOOD_DROPS = 600, HELLO_MS = 10000, MAX_SOCKETS = 200, MAX_PER_IP = 8, MAX_BUFFERED = 16 * 1024 * 1024, SILENT_MS = 20000;
// New connections per address (security review: connection floods): MAX_PER_IP caps the open ones, this caps how fast they arrive, so a
// few addresses can't keep the MAX_SOCKETS slots full by reconnecting. Every attempt counts, refused ones too. This machine is exempt.
const CONN_MAX = 10, CONN_MS = 60 * 1000, connTimes = new Map(); // blockOf(ip) -> times of its recent connections
const connsOf = (ip) => { const t = (connTimes.get(ip) ?? []).filter((at) => Date.now() - at < CONN_MS); if (t.length) connTimes.set(ip, t); else connTimes.delete(ip); return t; };
const ACK_BURST = 200, ACK_PER_S = 40; // acks and pings (security step 5): their own budget; a page sends at most one ack per view (20 a second) and a ping a second
const SLOW = { resync: 1000, bugstate: 1000 }; // ms between two of these from one connection
// WebSocket compression: every message deflated, with each player's history kept so small views shrink too.
// --no-deflate turns it off; a page that doesn't offer it gets plain frames either way.
const deflate = argv.includes("--no-deflate") ? false : { threshold: 0, zlibDeflateOptions: { level: 6 } };
const wss = new WebSocketServer({ server: httpServer, maxPayload: MAX_FRAME, perMessageDeflate: deflate,
	verifyClient: ({ req }) => { if (!foreignOrigin(req)) return true; out(`[server] refused: page from ${String(req.headers.origin).slice(0, 100)} (${peerOf(req)})`); return false; } });
let xffWarned = false; // the proxy warning below, once per run
const sockets = new Set(); // every open connection, named or not: { ws, ip }
// lag-smoothing: each player's views go through a ViewQueue (view-merge.mjs), which holds and merges them while the link is backed up,
// then, for a page that says pack: 1 in its hello, a ViewPacker (worker/view-pack.js: each look sent once, by number after).
function viewQueue(c, acks, pack) {
	const packer = pack ? new ViewPacker() : null;
	return new ViewQueue((update) => { const text = toJson({ type: "view", player: c.player, update: packer ? packer.pack(update) : update }); stats.bytes += text.length; if (c.ws.readyState === 1) c.ws.send(text); }, acks);
}
const kick = (c, why) => { out(`[server] closing ${c.name ?? c.ip}: ${why}`); c.ws.terminate(); };
const FORWARD = new Set(["key", "step", "click", "command", "typing", "answer", "statpanel", "statclick", "topic", "winclose", "menu", "menupick", "mouse", "resync", "bugstate"]);
wss.on("connection", (ws, req) => {
	const c = { ws, player: null, name: null, viewReady: false, views: null, ip: "", admin: false, tokens: RATE_BURST, byteTokens: BYTE_BURST, at: Date.now(), ackTokens: ACK_BURST, ackAt: Date.now(), drops: 0, last: {}, heardAt: Date.now() }; // player = its ckey, set by hello
	ws.on("error", () => {}); // a frame over MAX_FRAME or a broken one: ws closes the connection itself
	// The player's address as the game sees it (client.address): an admin (a secret in the hello) is "127.0.0.1", which tg makes a
	// localhost admin; anyone else gets their real address (192.0.2.1 if it is this machine's) and plays as a normal player.
	const peer = peerOf(req);
	const peerLocal = isLocalPeer(peer);
	// only a proxy on this machine is believed about X-Forwarded-For; it appends the address it saw, so the last entry is the real one
	const proxied = peerLocal && req.headers["x-forwarded-for"] !== undefined;
	const fwd = proxied ? String(req.headers["x-forwarded-for"]).split(",").pop().trim().replace(/^::ffff:/, "") : "";
	const ip = proxied && net.isIP(fwd) ? fwd : peer;
	c.ip = ip; c.block = blockOf(ip);
	// security review #2: from this machine, for a name that isn't this machine's, with no X-Forwarded-For: a proxy that drops the header.
	// Not admin either way (Host), but every player would share this machine's address, so bans by address and the per-address limits stop working.
	if (peerLocal && !proxied && !xffWarned && !isLocalName(String(req.headers.host ?? "").toLowerCase())) { xffWarned = true; out(`[server] warning: a connection from this machine for ${String(req.headers.host).slice(0, 100)} has no X-Forwarded-For: if a proxy (Caddy) is in front, make it send one, or bans by address and the per-address limits can't tell players apart`); }
	let address = isLocalPeer(ip) ? "192.0.2.1" : ip; // 192.0.2.1: a documentation address, never a host; an admin gets 127.0.0.1 at hello
	if (!isLocalPeer(ip)) { const t = connsOf(c.block); t.push(Date.now()); connTimes.set(c.block, t); if (t.length > CONN_MAX) { if ((t.length - CONN_MAX) % 100 === 1) out(`[server] connection from ${ip} refused (too fast, ${t.length - CONN_MAX} in a row; logged every 100th)`); ws.terminate(); return; } }
	if (sockets.size >= MAX_SOCKETS || (!isLocalPeer(ip) && [...sockets].filter((o) => o.block === c.block).length >= MAX_PER_IP)) { out(`[server] connection from ${ip} refused (too many)`); ws.terminate(); return; }
	sockets.add(c);
	out(`[server] websocket connected from ${ip}${proxied ? " (via proxy)" : ""}`);
	const helloTimer = setTimeout(() => { if (c.player === null) kick(c, "no hello"); }, HELLO_MS);
	ws.on("message", (data, isBinary) => {
		c.heardAt = Date.now();
		if (isBinary) return;
		if (data.length < 40 && c.player !== null) { // an ack or ping: outside the message budget (one per view), on a budget of their own
			const a = /^\{"type":"ack","s":(\d+)\}$/.exec(String(data)), p = a ? null : /^\{"type":"ping","t":(\d+)\}$/.exec(String(data));
			if (a || p) {
				const now = Date.now();
				c.ackTokens = Math.min(ACK_BURST, c.ackTokens + ((now - c.ackAt) / 1000) * ACK_PER_S); c.ackAt = now;
				if (c.ackTokens < 1) { stats.acksDropped++; if (++c.drops === FLOOD_DROPS) kick(c, `flooding (${FLOOD_DROPS} messages over the limit)`); return; }
				c.ackTokens--;
			}
			if (a) { c.views.ack(Number(a[1])); return; } // it only moves this player's own counter
			if (p) { const now = Date.now(); if (now - (c.pongAt ?? 0) >= 500) { c.pongAt = now; ws.send(`{"type":"pong","t":${p[1]}}`); } return; } // the page's round-trip probe (once a second): answered at once, at most twice a second
		}
		// the message and byte budgets: counted before anything is parsed
		const now = Date.now(), dt = (now - c.at) / 1000; c.at = now;
		c.tokens = Math.min(RATE_BURST, c.tokens + dt * RATE_PER_S); c.byteTokens = Math.min(BYTE_BURST, c.byteTokens + dt * BYTE_PER_S);
		if (c.tokens < 1 || c.byteTokens < data.length) { stats.dropped++; if (++c.drops === FLOOD_DROPS) kick(c, `flooding (${FLOOD_DROPS} messages over the limit)`); return; }
		c.tokens--; c.byteTokens -= data.length;
		let m;
		try { m = JSON.parse(String(data)); } catch { return; }
		if (!m || typeof m !== "object" || Array.isArray(m) || typeof m.type !== "string") return;
		if (m.type === "hello") {
			if (c.player !== null) return;
			const name = String(typeof m.player === "string" ? m.player : "").replace(/[^A-Za-z0-9 _.-]/g, "").trim().slice(0, 30), base = ckeyOf(name);
			if (!base) { out(`[server] name "${name}" refused (empty)`); ws.send(toJson({ type: "nameTaken", name, reason: "empty" })); ws.close(); return; }
			const tag = typeof m.trip === "string" && m.trip !== "" ? tagOf(pepper, m.trip.slice(0, 200)) : "";
			const key = tag ? `${name} @${tag}` : name, ck = ckeyOf(key);
			if (hostKeyOk(m.secret)) { c.admin = true; address = "127.0.0.1"; out(`[server] ${ck} is admin (host key from ${ip})`); }
			else if (tag) {
				const seen = tagsOf(c.block);
				if (!seen.has(tag) && seen.size >= NEW_TAGS_MAX) {
					out(`[server] ${key} (${ip}) refused: too many tries with new secrets (${NEW_TAGS_MAX} different tags this hour)`);
					ws.send(toJson({ type: "refused", reason: "Too many different secrets from your address, try again in an hour." })); ws.close(); return;
				}
				seen.set(tag, Date.now()); tagsSeen.set(c.block, seen);
				if (admins.has(tag)) { c.admin = true; address = "127.0.0.1"; out(`[server] ${ck} is admin (tag from ${ip})`); }
			}
			if (!c.admin && (Object.hasOwn(bans.keys, ck) || Object.hasOwn(bans.ips, ip) || Object.hasOwn(bans.ips, c.block))) { // hasOwn: a player named Constructor is not Object's constructor
				out(`[server] ${key} (${ip}) refused: banned`);
				ws.send(toJson({ type: "refused", reason: "You are banned from this server." })); ws.close(); return;
			}
			if (reserved.has(base) && !c.admin) {
				out(`[server] name "${name}" refused from ${ip}: reserved`);
				ws.send(toJson({ type: "nameTaken", name, reason: "reserved" })); ws.close(); return;
			}
			// the same key still connected: a tag (or an admin) is the same person on a new tab or after a dead link, so the old connection goes;
			// a plain name is refused
			const holder = [...clients].find((o) => o.player === ck);
			if (holder && !tag && !c.admin) {
				out(`[server] name "${name}" refused (already connected)`);
				ws.send(toJson({ type: "nameTaken", name, reason: "connected" })); ws.close(); return;
			}
			if (holder) { // done here, not in its close handler, so the game hears the disconnect before this connect
				clients.delete(holder); out(`[server] ${holder.name} (${holder.ip}) replaced by the same key from ${ip}`);
				if (holder.name !== firstName || started) worker.postMessage({ type: "disconnect", key: holder.name });
				holder.ws.send(toJson({ type: "nameTaken", name: holder.name, reason: "replaced" })); holder.ws.close();
			}
			ws.send(toJson({ type: "you", key, ckey: ck }));
			c.player = ck; c.name = key; c.address = address; c.acks = m.acks === 1; c.views = viewQueue(c, c.acks, m.pack === 1); clients.add(c); emptyCheck();
			out(`[server] ${key} (${ck}) joined (${clients.size} connected)`);
			for (const r of rtIcons) ws.send(toJson(r));
			for (const b of backlog) if (b.type !== "log" || c.admin) ws.send(toJson(b));
			if (firstName === null) { firstName = key; firstAddress = address; tryStart(); }
			else if (round === 1 || started) worker.postMessage({ type: "connect", key, job: lobby ? "" : "Assistant", near: argv.includes("--spawn-near"), address });
			worker.postMessage({ type: "resync", player: c.player });
			return;
		}
		if (c.player === null || !FORWARD.has(m.type)) return;
		if (SLOW[m.type]) { if (now - (c.last[m.type] ?? 0) < SLOW[m.type]) return; c.last[m.type] = now; }
		m.player = c.player; // a client can only act as its own player
		stats.toWorker++;
		worker.postMessage(m);
	});
	ws.on("close", () => {
		clearTimeout(helloTimer); sockets.delete(c);
		if (!clients.delete(c)) return;
		out(`[server] ${c.name} left (${clients.size} connected)`);
		if (c.name !== firstName || started) worker.postMessage({ type: "disconnect", key: c.name });
		emptyCheck();
	});
});

httpServer.listen(port, () => {
	out(`[server] http + ws on port ${port}, dist ${dist}, log ${logFile}`);
	if (!opt("--host-key", null)) console.log(`[server] admin link (this run only): http://localhost:${port}/?server=ws://localhost:${port}&adminkey=${hostKeyText}`);
});
const silentTimer = setInterval(() => { const now = Date.now(); for (const c of clients) if (c.acks && now - c.heardAt > SILENT_MS) kick(c, `silent for ${Math.round((now - c.heardAt) / 1000)} s (link lost)`); }, 5000);
let cpuLast = process.cpuUsage(), cpuAt = Date.now();
const statTimer = setInterval(() => {
	const cpu = process.cpuUsage(cpuLast), cpuPct = Math.round((cpu.user + cpu.system) / 10 / (Date.now() - cpuAt)); // the whole process, game worker included; 100 = one core
	cpuLast = process.cpuUsage(); cpuAt = Date.now();
	for (const ip of [...connTimes.keys()]) connsOf(ip);
	for (const ip of [...tagsSeen.keys()]) tagsOf(ip); // drops addresses whose tags are all old (review fix 6)
	out(`[server] clients ${clients.size}, round started ${roundStarted}, sent ${JSON.stringify(stats.byType)}, ${stats.bytes} bytes, cpu ${cpuPct}%, from clients ${stats.toWorker}${stats.dropped ? `, dropped (over the rate limit) ${stats.dropped}` : ""}${stats.acksDropped ? `, acks/pings dropped ${stats.acksDropped}` : ""}${(() => { const n = [...clients].reduce((t, c) => t + c.views.merged, 0); return n ? `, views merged on slow links ${n}` : ""; })()}`);
}, 10000);
function shutdown(code = 0) {
	if (shuttingDown) return;
	shuttingDown = true;
	clearInterval(statTimer); clearInterval(silentTimer);
	if (hotDir) fs.rmSync(path.join(hotDir, `${port}.json`), { force: true });
	out("[server] shutting down");
	worker.terminate().finally(() => logStream.end(() => process.exit(code)));
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
