// topic-check - "a player far from the machine, or sending bad values, changes nothing".
// For each scenario in tools/topic-cases.mjs it starts its own tools/server.mjs (no admin key is sent, so every player here is a normal player;
// --tgui ATOM stands Alpha beside that machine with its tgui window open) and then sends, over the real WebSocket, the {type:"topic"}
// messages of the table: Alpha is the legitimate player, Mallory a second player who spawned far away. The machine is read from the
// server log ([vm-boot] tgui-watch: ... lines the game writes when the machine's vars or the items around it change), never from a page.
// A row passes when the state after the href is what the row expects (see topic-cases.mjs): "changes" rows are the positive controls.
//   node tools/topic-check.mjs --dist build/NAME-dist [--only SCENARIO,...] [--rows REGEX] [--port 8790]      exit 0 = every row passed
// Fix-and-retry without restarting the station (hot1; the station start is ~50 s of every normal run):
//   node tools/topic-check.mjs --dist build/NAME-dist --only SCENARIO [--rows REGEX] --stay     runs the rows, prints them, and leaves the
//        station and both players up in the background (a server with --hot; it ends itself after an hour, or on --stop)
//   node tools/hot.mjs                                  after editing game code: loads the edited procs into that station (~1 s)
//   node tools/topic-check.mjs --again [--rows REGEX]   runs the rows again there (topic-cases.mjs is read afresh, so row edits count too)
//   node tools/topic-check.mjs --stop
//   node tools/topic-check.mjs --again --fresh [--rows REGEX]   the same, on a fresh machine: the old one and what it left within 2 tiles
//        and on Alpha are deleted and a new one of its type is opened in its place (with the scenario's amount, set and watch values as topic-cases.mjs has them now), so
//        rows that use up stock or fill a queue start as on a clean start. With --rows, name every row the ones you want depend on.
//   A --stay station skips the rows from the first WALK row on and Mallory's click spray, and a plain --again pass starts from what the
//   last one left (stock used up, a category opened): it is for the loop. A fresh machine is a new object, not the map's own (it has the
//   type's vars, not the map's edits), and the rest of the station is as the earlier passes left it. The result that counts is one
//   normal run from a clean start at the end.
// Build the dist first:  npm run build:static -- --dist build/NAME-dist --no-snapshot      (one scenario = one server start = ~2-3.5 min: run them one per tools/timed.sh call; no --only runs them all)
import fs from "node:fs";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { WebSocket } from "ws";
import * as CASES from "./topic-cases.mjs";
let { SCENARIOS, helpers } = CASES;

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const rowsRe0 = opt("--rows", null) ? new RegExp(opt("--rows", ""), "i") : null; // --rows REGEX: only the rows whose name matches (the "control" rows always run)
const dist = opt("--dist", null), port0 = Number(opt("--port", "8790")), only = opt("--only", null)?.split(",");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const passLines = []; // what this pass printed (a --stay station hands it to --again)
const say = (s) => { passLines.push(`[topic] ${s}`); console.log(`[topic] ${s}`); };
// --stay / --again / --stop talk through files in build/hot/ (as tools/hot.mjs does): topic-PORT.json = the staying process,
// topic-PORT.again.json = "run a pass" (or stop), topic-PORT.done.json = that pass's lines.
const stay = argv.includes("--stay"), stayChild = argv.includes("--stay-child"), hotDir = "build/hot";
const stayFile = (kind) => `${hotDir}/topic-${port0}.${kind}json`;
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
async function awaitPass(id, pid) { // prints the pass's lines; exit code 0 = all passed, 1 = a row failed, 3 = no answer in time
	for (let i = 0; i < 460; i++) {
		const d = readJson(stayFile("done."));
		if (d?.id === id) { for (const l of d.lines) console.log(l); return d.failed ? 1 : 0; }
		if (!alive(pid)) { console.error(`[topic] the staying process ended (see build/topic-stay-${port0}.log)`); return 1; }
		await sleep(500);
	}
	console.error(`[topic] no result yet after 230 s: it is still running; ask again with --again, or read build/topic-stay-${port0}.log`);
	return 3;
}
if (argv.includes("--again") || argv.includes("--stop")) {
	const st = readJson(stayFile(""));
	if (!st || !alive(st.pid)) { console.error(`[topic] no --stay station on port ${port0}`); process.exit(2); }
	const id = `${Date.now()}`, stop = argv.includes("--stop");
	fs.writeFileSync(stayFile("again.") + ".tmp", JSON.stringify({ id, stop, rows: opt("--rows", null), fresh: argv.includes("--fresh") }));
	fs.renameSync(stayFile("again.") + ".tmp", stayFile("again."));
	if (stop) { console.log(`[topic] told the station on port ${port0} to stop`); process.exit(0); }
	process.exit(await awaitPass(id, st.pid));
}
if (!dist) { console.error("usage: node tools/topic-check.mjs --dist build/NAME-dist [--only SCENARIO,...] [--rows REGEX] [--port 8790] [--stay]   |   --again [--fresh] [--rows REGEX]   |   --stop"); process.exit(2); }
if (stay && only?.length !== 1) { console.error("--stay needs --only with one scenario"); process.exit(2); }
if (stay && !stayChild) { // start the staying process in the background, wait for its first pass
	fs.mkdirSync(hotDir, { recursive: true });
	const old = readJson(stayFile(""));
	if (old && alive(old.pid)) { console.error(`[topic] a --stay station is already up on port ${port0}: --again, --stop, or another --port`); process.exit(2); }
	for (const k of ["again.", "done."]) fs.rmSync(stayFile(k), { force: true });
	const log = fs.openSync(`build/topic-stay-${port0}.log`, "w");
	const child = spawn(process.execPath, [fileURLToPath(import.meta.url), ...argv, "--stay-child"], { detached: true, stdio: ["ignore", log, log] });
	child.unref();
	process.exit(await awaitPass("first", child.pid));
}
let fails = [];
const check = (ok, what) => { say(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };

function player(port, name) {
	const p = { name, ws: new WebSocket(`ws://127.0.0.1:${port}`), views: 0, eye: null, msgs: {}, closed: false };
	p.ws.on("open", () => p.ws.send(JSON.stringify({ type: "hello", player: name })));
	p.ws.on("close", () => { p.closed = true; });
	p.ws.on("error", () => {});
	p.ws.on("message", (d) => {
		let m; try { m = JSON.parse(String(d)); } catch { return; }
		p.msgs[m.type] = (p.msgs[m.type] ?? 0) + 1;
		if (m.type === "browse") (p.browses ??= []).push(`${m.window ?? m.name ?? m.id ?? "?"}: ${/"title":"([^"]*)"/.exec(String(m.html))?.[1] ?? /"interface":"([^"]*)"/.exec(String(m.html))?.[1] ?? String(m.html).replace(/\s+/g, " ").slice(0, 80)}`);
		if (m.type === "view") { p.views++; if (m.update.eyeTile) p.eye = m.update.eyeTile; for (const t of m.update.tiles ?? []) for (const id of t[2]) (p.ids ??= new Set()).add(id); }
	});
	p.send = (m) => { if (p.ws.readyState === 1) p.ws.send(JSON.stringify(m)); };
	return p;
}
const up = (port) => new Promise((res) => { const r = http.request({ host: "127.0.0.1", port, path: "/", method: "HEAD" }, (x) => { x.resume(); res(x.statusCode === 200); }); r.on("error", () => res(false)); r.end(); });

const parse = (line) => {
	const s = { v: {}, floor: "-", raw: line ?? "" };
	for (const part of (line ?? "").split("; ")) { const i = part.indexOf("="), j = part.indexOf(": "); if (part.startsWith("floor: ")) s.floor = part.slice(7); else if (i > 0) s.v[part.slice(0, i)] = part.slice(i + 1); else if (j > 0) s[part.slice(0, j)] = part.slice(j + 2); }
	return s;
};

async function runScenario(name, sc, port) {
	const logFile = `build/topic-check-${name}.log`;
	say(`==== ${name}: ${sc.atom} ${sc.set ? `(set ${sc.set})` : ""}`);
	const args = ["tools/server.mjs", "--dist", dist, "--port", String(port), "--log", logFile, "--seconds", "900", "--tgui", sc.atom, "--tgui-watch", sc.watch];
	if (sc.set) args.push("--tgui-set", sc.set);
	const onMob = sc.atom === "@mob"; // ps-client: the players stay in tg's lobby and the watch is Alpha's own mob (no window, no machine)
	if (onMob) args.push("--lobby");
	if (stay) { args[args.indexOf("--seconds") + 1] = "3600"; args.push("--hot"); }
	const srv = spawn(process.execPath, args, { stdio: "ignore" });
	let logPos = 0, logText = "";
	const pump = () => { try { const st = fs.statSync(logFile); if (st.size > logPos) { const fd = fs.openSync(logFile, "r"), buf = Buffer.alloc(st.size - logPos); fs.readSync(fd, buf, 0, buf.length, logPos); fs.closeSync(fd); logPos = st.size; logText += buf.toString("utf8"); } } catch {} return logText; };
	const last = (re) => { const t = pump(), m = [...t.matchAll(re)]; return m.length ? m[m.length - 1][1] : null; };
	const players = [];
	try {
		for (let i = 0; i < 60 && !(await up(port)); i++) await sleep(500);
		logPos = 0; logText = "";
		const A = player(port, "Alpha"); players.push(A);
		let refs = null;
		const ready = (r) => r && (onMob ? /mob=\[0x/.test(r) : /uis=\[0x/.test(r));
		for (let i = 0; i < 400 && !ready(refs); i++) { await sleep(500); refs = last(/tgui-refs: (.*)/g); if (/no .* on this map/.test(pump())) break; }
		if (!ready(refs)) { check(false, `${name}: Alpha's window opened (${(refs ?? pump().split("\n").filter((l) => /tgui|FATAL|runtime/.test(l)).slice(-3).join(" | ")).slice(0, 300)})`); return; }
		let R = Object.fromEntries(refs.split(" ").map((x) => x.split("=")));
		let ui = R.uis?.split(",")[0];
		const at = R.at.split(",").map(Number);
		const M = player(port, "Mallory"); players.push(M);
		for (let i = 0; i < 200 && (onMob ? !M.msgs.browse : M.views < 5); i++) await sleep(250);
		await sleep(5000);
		const dist2 = (p) => Math.max(Math.abs(p.eye.x - at[0]), Math.abs(p.eye.y - at[1]));
		if (onMob) check(!!M.msgs.browse, `${name}: Mallory is in the lobby too (${M.msgs.browse ?? 0} windows)`);
		else check(M.views >= 5 && M.eye && dist2(M) > 8, `${name}: Mallory is in the game and far from the machine (${M.eye ? dist2(M) : "?"} tiles)`);
		if (!onMob) check(A.eye && dist2(A) <= 1, `${name}: Alpha stands beside the machine (${A.eye ? dist2(A) : "?"} tiles)`);
		check(!/ is admin \(/.test(pump()), `${name}: both connections are normal players (no admin)`);
		const state = () => parse(last(/tgui-watch: (.*)/g));
		const idle = async (what) => { for (let i = 0; i < 150; i++) { if (sc.idle(state())) return true; await sleep(100); } check(false, `${name}: the machine went idle ${what}`); return false; };
		await sleep(1500);
		const s0 = state();
		check(!!s0.raw && sc.idle(s0), `${name}: the machine's state is being logged (${s0.raw.slice(0, 160)})`);
		const expand = (h, s) => h.replaceAll("{ui}", ui).replaceAll("{machine}", R.machine).replaceAll("{mob}", R.mob).replace(/\{ref:(\w+):(\d+)\}/g, (_, v, n) => ([...(s.v[v] ?? "").matchAll(/@(\[0x[0-9a-f]+\])\(/g)][Number(n)]?.[1]) ?? "EMPTY-PLACEHOLDER");
		const walkAway = async () => {
			for (const key of ["WEST", "EAST", "NORTH", "SOUTH", "WEST", "EAST"]) {
				A.send({ type: "key", key, down: true }); await sleep(1800); A.send({ type: "key", key, down: false }); await sleep(600);
				if (dist2(A) >= 3) break;
			}
			await sleep(1500);
			return dist2(A);
		};
		const pass = async (rowsRe, again = false) => {
		const casesAt = pump().length; // runtimes before this are the round's own start-up (e.g. Initalize_Atmos on an asteroid turf, seen in some runs)
		let nrun = 0, nbad = 0;
		for (const [rname, who, href, expect, ok] of sc.cases) {
			if (rowsRe && !rowsRe.test(rname) && !/^control/.test(rname)) continue;
			if (!(await idle(`before '${rname}'`))) continue;
			const before = state(), mark = pump().length, hrefs = [].concat(href);
			if (stay && hrefs[0] === "walk-away") { say(`${name}: stopping at '${rname}' (a --stay station keeps Alpha at the machine; a normal run does the rest)`); break; }
			if (hrefs[0] === "walk-away") { const d = await walkAway(); check(d >= 3, `${name}: ${rname} (${d} tiles away)`); continue; }
			const sender = who === "M" ? M : A;
			const sent = hrefs.map((h) => expand(h, before));
			if (sent.some((h) => h.includes("EMPTY-PLACEHOLDER"))) { check(false, `${name}: ${rname}: the table names an object the machine doesn't list`); nbad++; continue; }
			for (const h of sent) { sender.send({ type: "topic", href: h }); await sleep(sent.length > 5 ? 120 : 60); }
			let after;
			const pre = again && expect === "changes" && !!ok && ok(before, before, helpers); // already as the row wants it: don't wait 15 s for a change
			if (expect === "changes") { after = before; for (let i = 0; i < (pre ? 6 : 60) && after.raw === before.raw; i++) { await sleep(250); after = state(); } await idle(`after '${rname}'`); await sleep(500); after = state(); }
			else { await sleep(700); await idle(`after '${rname}'`); await sleep(300); after = state(); }
			const seg = pump().slice(mark), runtimes = seg.split("\n").filter((l) => /\[vm-boot\] (runtime|VM gap):|FATAL/.test(l));
			const reached = seg.includes("[vm-boot] topic");
			let good = true, why = [];
			// On a station that stayed up, a row like "open the Tools category" finds it already open: that passes if the row's own check holds.
			const already = again && expect === "changes" && after.raw === before.raw && !!ok && ok(after, before, helpers);
			if (expect === "changes" && after.raw === before.raw && !already) { good = false; why.push("nothing changed"); }
			if (expect === "unchanged" && after.raw !== before.raw) { good = false; why.push(`changed: ${before.raw.slice(0, 200)}  ->  ${after.raw.slice(0, 200)}`); }
			if ((expect === "changes" || expect === "sane") && ok && !ok(after, before, helpers)) { good = false; why.push(`the row's check failed: ${before.raw.slice(0, 200)}  ->  ${after.raw.slice(0, 200)}`); }
			if (sc.sane && !sc.sane(after, before)) { good = false; why.push(`the machine is no longer sane: ${after.raw.slice(0, 300)}`); }
			if (runtimes.length) { good = false; why.push(`runtime: ${runtimes[0].slice(0, 200)}`); }
			if (!reached) { good = false; why.push("the server never logged the topic"); }
			nrun++; if (!good) nbad++;
			check(good, `${name}: ${rname}${already ? " (already so from an earlier pass)" : ""}${why.length ? " -- " + why.join(" / ") : ""}`);
		}
		say(`${name}: ${nrun} rows run, ${nbad} bad`);
		const rt = pump().slice(casesAt).split("\n").filter((l) => /\[vm-boot\] (runtime|VM gap):|FATAL|worker thread (error|exited)/.test(l));
		check(rt.length === 0, `${name}: no runtime or worker error in the server log since the first href (${rt.length}${rt[0] ? `: ${rt[0].slice(0, 200)}` : ""})`);
		};
		const freshen = async () => { // --again --fresh: a new machine in the old one's place (the worker's "fresh" test aid, asked for through the hot-load file as tools/hot.mjs does)
			const id = `fresh-${Date.now()}`, inFile = `${hotDir}/${port}.in.json`, outFile = `${hotDir}/${port}.out.json`, mark = pump().length;
			fs.rmSync(outFile, { force: true });
			fs.writeFileSync(inFile + ".tmp", JSON.stringify({ id, fresh: true, tgui: sc.atom, tguiSet: sc.set, tguiWatch: sc.watch })); // the scenario as the table has it now: its amount, set and watch may have been edited
			fs.renameSync(inFile + ".tmp", inFile);
			let res = null, nr = null;
			for (let i = 0; i < 100 && res?.id !== id; i++) { await sleep(100); res = readJson(outFile); }
			if (res?.id !== id || !res.ok) { check(false, `${name}: a fresh machine (${res?.id === id ? res.lines.join("; ") : "the server didn't answer in 10 s"})`); return false; }
			for (let i = 0; i < 100 && !nr; i++) { await sleep(200); const seg = pump().slice(mark), o = seg.search(/\[vm-boot\] tgui: (opening|attack_self of)/); /* an item logs attack_self of, a machine opening */ if (o >= 0) nr = [...seg.slice(o).matchAll(/tgui-refs: (.*)/g)].map((m) => m[1]).filter((r) => /uis=\[0x/.test(r)).pop() ?? null; }
			if (!nr) { check(false, `${name}: the fresh machine's window opened`); return false; }
			R = Object.fromEntries(nr.split(" ").map((x) => x.split("="))); ui = R.uis.split(",")[0];
			await sleep(1500);
			say(`${name}: ${res.lines.join("; ")}; now ${R.machine}`);
			return true;
		};
		await pass(rowsRe0);
		if (stay) { // hand each pass's lines to whoever asked, then wait for the next --again
			fs.writeFileSync(stayFile(""), JSON.stringify({ pid: process.pid, port, scenario: name }));
			for (let id = "first"; ;) {
				say(fails.length ? `FAILED (${fails.length}): ${fails.slice(0, 12).join(" ;; ").slice(0, 1500)}` : "all rows passed");
				fs.writeFileSync(stayFile("done."), JSON.stringify({ id, lines: passLines.splice(0), failed: fails.length }));
				let ask = null;
				while (srv.exitCode === null && !(ask = readJson(stayFile("again.")))) await sleep(200);
				fs.rmSync(stayFile("again."), { force: true });
				if (!ask || ask.stop) break;
				({ SCENARIOS, helpers } = await import(`./topic-cases.mjs?${Date.now()}`)); // the table as it is now
				sc = SCENARIOS[name] ?? sc;
				fails = []; id = ask.id;
				if (ask.fresh && !(await freshen())) continue;
				await pass(ask.rows ? new RegExp(ask.rows, "i") : null, !ask.fresh);
			}
			return;
		}
		const clickAt = pump().length;
		// (c) can Mallory open a window of her own on the machine? She clicks every object id Alpha has seen (ids are per player: a hostile
		// player guesses them); no click may land on the machine (the windows she gets are her own PDA and the like, listed).
		if (sc.clicks !== false) {
		const browseBefore = M.msgs.browse ?? 0, mark = pump().length, ids = [...(A.ids ?? [])].slice(0, 900);
		for (const id of ids) { M.send({ type: "click", id, x: 16, y: 16, dbl: false, control: "mapwindow.map", params: "" }); await sleep(18); }
		for (const id of ids.slice(0, 300)) { M.send({ type: "click", id, x: 16, y: 16, dbl: true, control: "mapwindow.map", params: "" }); await sleep(18); }
		await sleep(2000);
		const seg = pump().slice(mark), machinePath = sc.atom.split(":")[0];
		const clicked = seg.split("\n").filter((l) => l.includes(`Click ${machinePath} `));
		check(clicked.length === 0, `${name}: Mallory clicking ${ids.length} object ids reached no ${machinePath.split("/").pop()} (${clicked.length} clicks landed; windows she got from her own things: ${(M.msgs.browse ?? 0) - browseBefore}${(M.browses ?? []).slice(browseBefore).length ? ": " + M.browses.slice(browseBefore).join(" | ") : ""})`);
		}
		const crt = pump().slice(clickAt).split("\n").filter((l) => /\[vm-boot\] runtime:/.test(l)); // a click on one of her own objects can hit a game bug unrelated to the machine (seen: /image/Click): noted, not failed
		if (crt.length) say(`note: ${crt.length} runtime(s) while Mallory clicked: ${crt[0].slice(0, 160)}`);
	} finally {
		for (const p of players) if (!p.closed) p.ws.close();
		if (stay) fs.rmSync(stayFile(""), { force: true });
		srv.kill("SIGTERM");
		await sleep(1000);
		if (srv.exitCode === null) srv.kill("SIGKILL");
	}
}

const names = Object.keys(SCENARIOS).filter((n) => !only || only.includes(n));
if (!names.length) { console.error(`no scenario matches --only; they are: ${Object.keys(SCENARIOS).join(", ")}`); process.exit(2); }
let port = port0;
for (const n of names) await runScenario(n, SCENARIOS[n], port++);
say(fails.length ? `FAILED (${fails.length}): ${fails.slice(0, 12).join(" ;; ").slice(0, 1500)}` : "all rows passed");
process.exit(fails.length ? 1 : 0);
