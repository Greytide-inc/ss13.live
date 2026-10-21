// worker-boot - Boot tg in a Web Worker in headless Chromium and write the combined log (world.log + game.log) for compare-logs.
// Usage (from web/, after `npm run build && npm run icon-sizes`):
//   node --experimental-websocket tools/worker-boot.mjs [--after-start S] [--ticks N] [--cap S] [--out FILE]
//        [--join JOB [--gender male|female] [--shot-after S] [--shot FILE]]
// --join: the worker joins the round as JOB and the page draws the player's view live; --shot-after
// (default 30) seconds after joining, the page is screenshotted to --shot (default build/2v/live.png).
// --keys "ctrl+b,east*5,south@1500,tab,d*2": after joining (+ --keys-after S, default 5), press keys in
// the page through CDP Input.dispatchKeyEvent, one after another: *N = N taps (40 ms each) 340 ms apart, @MS = hold
// that long. Names: north/south/east/west (arrows), tab, a letter or digit, with ctrl+/shift+/alt+ in front.
// With --keys the screenshot is taken 3 s after the last key (default file build/3a/walked.png).
// --clicks ("drag:eye>rel:1,0", press on the first spot, release on the second) "shift+eye;hud:inventory@800;dbl+tile:41,144": after the keys, click in the page through CDP Input.dispatchMouseEvent,
// `;`-separated. Target: eye (the tile the camera is on), rel:DX,DY (a tile offset from it), tile:X,Y (a world tile, as drawn now), px:X,Y (a canvas pixel, 480 px square), hud:TEXT or hud:TEXT#N (the Nth client.screen object whose
// type contains TEXT, e.g. hud:swap_hand). Prefixes shift+ ctrl+ alt+ right+ middle+ dbl+ (two presses); @MS waits after. The page's own
// mouse handlers see real mouse events and pick the object by pixel (hit-test.ts); tg's replies show in the log as "[vm-boot] to client".
// --record DIR (hv1; a "rec:start" key token drops the frames so far, and the GPU is on while recording): records the page (CDP Page.startScreencast, jpeg frames + DIR/frames.txt for ffmpeg's concat) from the
// start of --keys/--clicks/--command until the final screenshot; archive/tools/verify-file.mjs turned it into a clip for a (retired) verify ticket.
// --query "check=1": extra page query; check=1 has the worker send a full snapshot every 2 s to check the per-tick updates against,
// and asks for one resync (a full view update) after the keys.
// --rounds N: round end / restart. Use with --lobby-route (the route is clicked again in every new world's lobby) and
// --query "endround=S&rounddelay=S". Each time tg calls world.Reboot() the page starts the next world; the run stops when
// world N reaches its lobby. In every world's lobby (10 s after it, after a forced GC) the worker's heap is measured over
// CDP. Writes one combined log per world: --out with .log replaced by -world1.log, -world2.log, ...
// Starts its own gallery server on a port picked from its pid, opens web/worker/index.html in Playwright's cached
// headless Chromium (driven over CDP), waits for the worker's "done", then writes
// --out (default build/2u/worker-combined.log). --cap (default 900 s) stops waiting if it never finishes.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const afterStart = opt("--after-start", "120"), ticks = opt("--ticks", "100000"), cap = Number(opt("--cap", "900"));
const clicks = opt("--clicks", "");
const answers = opt("--answer", ""); // ";"-separated answers to input()/alert() dialogs, after the keys/commands: text for a box, a button's label for an alert, @cancel, @item:N for a list
const dialogShot = opt("--dialog-shot", "build/3w/dialog.png"); // screenshot of the first dialog while it is open
const statSteps = opt("--stat", ""); // ";"-separated steps after the join: a tab's text (click it), @line:TEXT (click a stat line), @shot (screenshot only)
const statShot = opt("--stat-shot", "build/3y/stat"); // PREFIX-N.png after each step
const commands = opt("--command", ""); // ";"-separated lines typed into the input bar after the join, e.g. --command 'say "hello";me waves'
const lobbyRoute = opt("--lobby-route", ""); // ";"-separated link texts clicked in the lobby's popups (each waits, up to 300 s, for a link whose text starts with it; screenshot after each into --route-shot PREFIX-N.png); no --join: the page connects a player into tg's lobby. "@shot" = screenshot only.
const routeShot = opt("--route-shot", "build/3ac/step");
const lobbySecs = opt("--lobby", ""); // shorten tg's pregame countdown (default 120 s) to this many seconds
const lobby = argv.includes("--lobby-route") || argv.includes("--lobby");
const rounds = Number(opt("--rounds", "0")); // round end / restart
const mapArg = opt("--map", ""); // --map runtime boots Runtime Station (page option ?map=runtime)
const join = opt("--join", ""), gender = opt("--gender", "");
const out = opt("--out", clicks ? "build/3j/worker-combined.log" : argv.includes("--keys") ? "build/3a/worker-combined.log" : join ? "build/2v/worker-combined.log" : "build/2u/worker-combined.log");
const second = opt("--second", ""); // --second KEY connects a second client ~80 ticks after the join (late-joins as --second-job, default Assistant)
const extraQuery = [opt("--query", ""), opt("--name", "") && `name=${encodeURIComponent(opt("--name", ""))}`, /* --name N is this page's player name with --server-port */ second && `second=${encodeURIComponent(second)}`, opt("--second-job", "") && `secondjob=${opt("--second-job", "")}`].filter(Boolean).join("&"); // extra page query, e.g. "snapshotMs=50"
const glideShots = opt("--glide-shots", ""); // "PREFIX": screenshots (PREFIX-1.png...) right after the first tap, i.e. mid-glide; use with --query glideslow=8
const earlyShot = opt("--early-shot", "");
const animMatch = opt("--anim-match", "."); // regexp an animLog entry must match to start --anim-shots (e.g. "flick")
const animShots = opt("--anim-shots", ""); // "PREFIX": when the first animate() step reaches the page, 5 screenshots --anim-gap ms apart (default 1500; PREFIX-N.png); use with --query glideslow=4
const browseClicks = opt("--browse-click", ""); // ";"-separated link texts to click (real mouse click) inside the first popup window, one after another; screenshots PREFIX-0.png (window open), PREFIX-1.png (after the first click)...
const browseShot = opt("--browse-shot", "build/3x/win");
const cpuProfile = opt("--cpu-profile", ""); // FILE.cpuprofile of the page's main thread from the join to the screenshot (open in Chrome DevTools, or tools/cpuprofile-top.mjs)
const keys = opt("--keys", ""), keysAfter = Number(opt("--keys-after", "5"));
const shotAfter = Number(opt("--shot-after", "30")), shot = opt("--shot", clicks ? "build/3j/clicked.png" : keys ? "build/3a/walked.png" : "build/2v/live.png");
// "ctrl+b" -> CDP key event fields. Arrows/Tab/letters/digits are all --keys needs.
const ARROWS = { north: ["ArrowUp", 38], south: ["ArrowDown", 40], east: ["ArrowRight", 39], west: ["ArrowLeft", 37], tab: ["Tab", 9] };
const keyEvent = (name) => {
	const parts = name.toLowerCase().split("+"), k = parts.pop();
	const modifiers = (parts.includes("alt") ? 1 : 0) | (parts.includes("ctrl") ? 2 : 0) | (parts.includes("shift") ? 8 : 0);
	if (ARROWS[k]) return { key: ARROWS[k][0], code: ARROWS[k][0], windowsVirtualKeyCode: ARROWS[k][1], modifiers };
	const up = k.toUpperCase();
	return { key: k, code: /\d/.test(k) ? `Digit${k}` : `Key${up}`, windowsVirtualKeyCode: up.charCodeAt(0), modifiers };
};
const H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// ponytail: ports from the pid so two boots at once don't share a server/Chromium; a clash is unlikely, not impossible.
const WEB_PORT = opt("--server-port", "") || opt("--port", opt("--profile", "") ? "20777" : String(20000 + (process.pid % 20000))) /* IndexedDB is per origin, so a --profile run needs the same port every time */, CDP_PORT = String(40000 + (process.pid % 20000));
const serverPort = opt("--server-port", ""); // --server-port N plays through tools/server.mjs already running on N (its HTTP serves the page; the page gets ?server=ws://127.0.0.1:N); no static server of our own
const useDist = argv.includes("--dist") || !!serverPort, profile = opt("--profile", ""); // --dist [DIR] serves web/dist or DIR (npm run build:static first); --profile DIR keeps Chrome's user-data (IndexedDB) between runs
const distArg = opt("--dist", ""), distDir = distArg && !distArg.startsWith("--") ? distArg : "dist";
if (useDist && !serverPort && !existsSync(`${distDir}/index.html`)) { console.error(`worker-boot: no ${distDir}/index.html (build it first)`); process.exit(2); }
console.log(`[worker-boot] serving ${useDist && !serverPort ? distDir : serverPort ? `server port ${serverPort}` : "the source tree"}`);
const server = serverPort ? { kill() {}, on() {} } : useDist ? spawn("python3", ["-m", "http.server", WEB_PORT, "--bind", "127.0.0.1", "--directory", distDir], { stdio: "ignore" }) : spawn(process.execPath, ["build/dist/src/tools/gallery-server.js"], { env: { ...process.env, PORT: WEB_PORT }, stdio: "ignore" });
// No heap flag: the worker peaks ~1.3-1.4 GB in Chromium (pointer compression; Node's is ~2.3 GB) and
// boots fine with the browser's default limit, as a normal browser would run it.
const chrome = spawn(H, ["--no-sandbox", `--remote-debugging-port=${CDP_PORT}`, "--window-size=1000,1400", ...(profile ? [`--user-data-dir=${resolve(profile)}`] : []), ...(opt("--record", "") ? ["--use-gl=angle", "--use-angle=gl-egl", "--ignore-gpu-blocklist"] : []) /* demo-stage: the GPU lifts a recording from ~13 to ~55 fps */, ...(process.env.CHROME_FLAGS ?? "").split(" ").filter(Boolean), "about:blank"], { stdio: "ignore" });
const t0 = Date.now();
try {
	let list;
	for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json(); } catch {} }
	const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
	await new Promise((r) => (ws.onopen = r));
	let id = 0; const pending = new Map();
	let rec = null; // {dir, frames:[{t,n}]} while recording
	let workerSession = null; // CDP session of the boot worker, to read its heap (performance.memory isn't in workers)
	ws.onmessage = (e) => {
		const m = JSON.parse(e.data);
		if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
		if (m.method === "Page.screencastFrame" && rec?.frames) { // --record
			rec.frames.push({ t: m.params.metadata.timestamp, n: rec.frames.length });
			writeFileSync(`${rec.dir}/f${rec.frames.length - 1}.jpg`, Buffer.from(m.params.data, "base64"));
			ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId: m.params.sessionId } }));
		}
		if (m.method === "Target.attachedToTarget" && m.params.targetInfo.type === "worker") workerSession = m.params.sessionId;
	};
	const send = (method, params = {}, sessionId) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params, sessionId })); });
	await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
	let peakMB = 0;
	const evaluate = async (expression, awaitPromise = false) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise })).result?.result?.value;
	await send("Page.navigate", { url: `http://127.0.0.1:${WEB_PORT}/${useDist ? "index.html" : "web/worker/index.html"}?${serverPort ? `server=ws://127.0.0.1:${serverPort}&` : ""}seed=24301&ticks=${ticks}&afterStart=${afterStart}${join ? `&join=${join}` : lobby ? (lobbySecs ? `&lobby=${lobbySecs}` : "") : "&nolobby=1"}${gender ? `&gender=${gender}` : ""}${mapArg ? `&map=${mapArg}` : ""}${extraQuery ? `&${extraQuery}` : ""}` });
	const unlockAt = Number(opt("--unlock-at", "0")); // (3ab) seconds after load to unlock audio (default: at once, as a player clicking the page would); 3aa
	let unlocked = false;
	const unlock = async () => { unlocked = true; await evaluate("dispatchEvent(new Event(\"pointerdown\"))"); };
	if (!unlockAt) { await sleep(1500); await unlock(); }
	let shotAt = null, shotDone = false, glideShotsDone = new Set();
	let animShotsDone = false, routeDone = false, cmdFrom = 0;
	let last = "", earlyDone = !earlyShot;
	let worldsSeen = 0, heapAt = null; const heaps = []; // --rounds
	for (;;) {
		await sleep(animShots && !animShotsDone ? 100 : 2000);
		if (!unlocked && Date.now() - t0 > unlockAt * 1000) await unlock();
		if (!earlyDone && Date.now() - t0 > 15000) { // --early-shot FILE: the page during init, ~15 s in
			earlyDone = true;
			const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data;
			mkdirSync(dirname(earlyShot), { recursive: true });
			if (img) writeFileSync(earlyShot, Buffer.from(img, "base64"));
			console.log(`early screenshot ${img ? earlyShot : "FAILED"}`);
		}
		if (animShots && !animShotsDone && (await evaluate(`window.bootResult?.viewStats?.animLog.some((l) => /${animMatch}/.test(l)) ? 1 : 0`)) > 0) {
			animShotsDone = true;
			for (let n = 1; n <= 5; n++) {
				const img = (await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1000, height: 1000, scale: 1 } })).result?.data;
				if (img) writeFileSync(`${animShots}-${n}.png`, Buffer.from(img, "base64"));
				console.log(`anim shot ${n}: ${await evaluate("JSON.stringify(window.bootResult.viewStats.animLog.slice(-3))")}`);
				await sleep(Number(opt("--anim-gap", "1500")));
			}
		}
		const s = await evaluate("JSON.stringify({ done: window.bootResult?.done, error: window.bootResult?.error, status: document.getElementById('boot')?.textContent, n: window.bootResult?.lines.length, joined: window.bootResult?.milestones.joined, views: window.bootResult?.views, view: document.getElementById('status')?.textContent })");
		const st = s ? JSON.parse(s) : {};
		if (workerSession) peakMB = Math.max(peakMB, Math.round(((await send("Runtime.getHeapUsage", {}, workerSession)).result?.usedSize ?? 0) / 1048576));
		if (st.status !== last) console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: ${(last = st.status)} (${st.n} lines)`);
		if (rounds) { // round end / restart
			const nr = await evaluate("window.bootResult.rounds?.length ?? 0");
			if (nr > worldsSeen) { worldsSeen = nr; routeDone = false; heapAt = null; console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: world ${nr} rebooted (${await evaluate("JSON.stringify(window.bootResult.rounds.at(-1).reason)")}); world ${nr + 1} starting`); }
			if (heapAt === null && (await evaluate("window.bootResult?.milestones.lobby != null"))) heapAt = Date.now() + 10000;
			if (heapAt !== null && heapAt > 0 && Date.now() >= heapAt && workerSession) {
				heapAt = -1;
				await send("HeapProfiler.collectGarbage", {}, workerSession);
				const mb = Math.round(((await send("Runtime.getHeapUsage", {}, workerSession)).result?.usedSize ?? 0) / 1048576);
				heaps.push(mb);
				console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: world ${worldsSeen + 1} lobby: worker heap after GC ${mb} MB`);
				if (worldsSeen + 1 >= rounds) break;
			}
		}
		if (lobby && lobbyRoute && !routeDone && (!rounds || heapAt === -1) && (await evaluate("window.bootResult?.milestones.lobby != null"))) {
			routeDone = true;
			const probe = async () => JSON.parse(await evaluate("window.popups.probe().then(JSON.stringify)", true));
			const snapR = async (k) => { const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data; mkdirSync(dirname(routeShot), { recursive: true }); if (img) writeFileSync(`${routeShot}-${k}.png`, Buffer.from(img, "base64")); };
			await sleep(4000); await snapR(0);
			let k = 0;
			for (const t0_ of lobbyRoute.split(";")) {
				const want = t0_.trim(); k++;
				if (want === "@shot") { await snapR(k); continue; }
				let pt = null;
				for (let n = 0; n < 150 && !pt; n++) {
					const ws_ = await probe();
					pt = ws_.flatMap((w) => w.links).find((l) => l.t.startsWith(want)) ?? null;
					if (!pt) { if (n % 10 === 9) console.log(`route: waiting for "${want}"; popups: ${JSON.stringify(ws_.map((w) => [w.name, w.text.slice(0, 120)]))}`); await sleep(2000); }
				}
				if (!pt) { console.log(`route: no link "${want}" ever appeared`); break; }
				await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...pt, button: "left", buttons: 0 });
				await send("Input.dispatchMouseEvent", { type: "mousePressed", ...pt, button: "left", buttons: 1, clickCount: 1 });
				await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...pt, button: "left", buttons: 0, clickCount: 1 });
				console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: route clicked "${pt.t}"`);
				await sleep(3000); await snapR(k);
			console.log(`route popups: ${JSON.stringify((await probe()).map((w) => [w.name, w.text.slice(0, 700), w.links.map((l) => l.t).slice(0, 40)]))}`);
			}
		}
		if ((join || lobby) && st.joined != null && shotAt === null) {
			shotAt = Date.now() + shotAfter * 1000;
			if (cpuProfile) { await send("Profiler.enable"); await send("Profiler.setSamplingInterval", { interval: 500 }); await send("Profiler.start"); console.log("page CPU profile started"); } // lat1
			if (keys || clicks || commands || answers || statSteps) {
				await sleep(keysAfter * 1000);
				if (/(^|&)setup=/.test(extraQuery)) { // the worker stages ?setup= about 10 s after the join; wait for it before recording and sending input
					for (let n = 0; n < 240 && !(await evaluate("window.bootResult.lines.some((l) => l.includes('setup: done'))")); n++) await sleep(500);
					console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: setup done`); await sleep(1000);
				}
				if (opt("--record", "")) { // hv1
					rec = { dir: resolve(opt("--record", "")), frames: [] }; mkdirSync(rec.dir, { recursive: true });
					await send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1, maxWidth: 1000, maxHeight: 1400 });
				}
				for (const tok of keys ? keys.split(",") : []) {
					if (tok.trim().startsWith("goto:")) { // "goto:X,Y" is goto:XxY (a world tile), walks with arrow taps, x first, sidestepping on a block
						const [tx, ty] = tok.trim().slice(5).split("x").map(Number);
						const pos = async () => JSON.parse(await evaluate(`JSON.stringify((/player at (\\d+),(\\d+),\\d+/.exec(window.bootResult.lines.findLast((l) => /player at \\d+,\\d+,\\d+/.test(l))) ?? []).slice(1).map(Number))`));
						let stuck = 0, side = 1, [px, py] = await pos();
						for (let n = 0; n < 80 && (px !== tx || py !== ty); n++) {
							const dx = tx - px, dy = ty - py;
							let name;
							if (stuck < 4) name = dx !== 0 ? (dx > 0 ? "east" : "west") : (dy > 0 ? "north" : "south");
							else if (stuck < 12) { // blocked: sidestep across the direction we want (a door may be a row over), flipping sides every 6 fails
								const ns = dx !== 0 ? (side > 0 ? "north" : "south") : (side > 0 ? "east" : "west");
								name = ns; if (stuck % 6 === 5) side = -side;
							} else { stuck = 0; continue; }
							const ev = keyEvent(name);
							await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...ev }); await sleep(40); await send("Input.dispatchKeyEvent", { type: "keyUp", ...ev });
							await sleep(350);
							const [nx, ny] = await pos();
							stuck = nx === px && ny === py ? stuck + 1 : 0; // a sidestep that worked: try the direct way again
							[px, py] = [nx, ny];
						}
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: goto ${tx}x${ty}: now at ${px},${py}`); continue;
					}
					if (tok.trim() === "rec:start") { if (rec) rec.frames = []; continue; } // demo-stage: drop the frames so far, the clip starts here
					if (tok.trim().startsWith("wait:")) { await sleep(Number(tok.trim().slice(5))); continue; } // "wait:MS"
					if (tok.trim().startsWith("waitline:")) { // "waitline:REGEX" (no commas) waits up to 90 s for a log line, new since this token, to match
						const from = cmdFrom, re = tok.trim().slice(9);
						for (let n = 0; n < 180 && !(await evaluate(`window.bootResult.lines.slice(${from}).some((l) => new RegExp(${JSON.stringify(re)}).test(l))`)); n++) await sleep(500);
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: waited for /${re}/`); continue;
					}
					if (tok.trim().startsWith("shot:")) { // "shot:FILE" screenshot between keys
						const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data;
						mkdirSync(dirname(tok.trim().slice(5)), { recursive: true }); if (img) writeFileSync(tok.trim().slice(5), Buffer.from(img, "base64"));
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: screenshot ${tok.trim().slice(5)}`); continue;
					}
					if (tok.trim().startsWith("cmd:")) {
						cmdFrom = await evaluate("window.bootResult.lines.length"); // "cmd:resist" types a verb line into the input bar between key presses
						await evaluate("document.getElementById('input').focus()");
						await send("Input.insertText", { text: tok.trim().slice(4) });
						await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
						await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: typed ${tok.trim().slice(4)}`);
						await evaluate("document.getElementById('input').blur()"); // the input box swallows game keys while focused
						await sleep(1500); continue;
					}
					const m = /^(.+?)(?:\*(\d+)|@(\d+))?$/.exec(tok.trim());
					const ev = keyEvent(m[1]);
					for (let i = 0; i < Number(m[2] ?? 1); i++) {
						await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...ev });
						await sleep(m[3] ? Number(m[3]) : 40); // a 40 ms tap is down for at most one tick: one step
						await send("Input.dispatchKeyEvent", { type: "keyUp", ...ev });
						if (glideShots && !glideShotsDone.has(m[1]) && ["east", "west", "north", "south"].includes(m[1].toLowerCase())) {
							glideShotsDone.add(m[1]);
							for (let n = 1; n <= 5; n++) {
								const img = (await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1000, height: 1000, scale: 1 } })).result?.data;
								const g = await evaluate("JSON.stringify(window.bootResult.viewStats.glideLog.slice(-1)[0])");
								writeFileSync(`${glideShots}-${m[1].toLowerCase()}-${n}.png`, Buffer.from(img, "base64"));
								console.log(`glide shot ${n}: last rebuilt frame [ms, camX, camY, atoms gliding, atom x, y] = ${g}`);
							}
						}
						await sleep(300);
					}
					console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: sent ${tok.trim()}`);
				}
				for (const tok of clicks ? clicks.split(";") : []) {
					if (tok.trim().startsWith("cmd:")) { // "cmd:TEXT@MS" types a command line into the input bar between clicks
						await evaluate("document.getElementById('input').focus()");
						await send("Input.insertText", { text: tok.trim().slice(4).split("@")[0] });
						await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
						await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
						await evaluate("document.getElementById('input').blur()");
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: typed ${tok.trim()}`);
						await sleep(Number(tok.split("@")[1] ?? 1500)); continue;
					}
					if (tok.trim().startsWith("key:")) { // "key:x" a key tap between clicks (swap hands)
						const ev = keyEvent(tok.trim().slice(4).split("@")[0]);
						await send("Input.dispatchKeyEvent", { type: "rawKeyDown", ...ev }); await sleep(40); await send("Input.dispatchKeyEvent", { type: "keyUp", ...ev });
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: tapped ${tok.trim()}`);
						await sleep(Number(tok.split("@")[1] ?? 700)); continue;
					}
					const mv = /^(move|wheel):([^>@]+)(?:>([^@]+))?(?:@(\d+))?$/.exec(tok.trim()); // move:A>B (hover A then B), wheel:A (shift+wheel:A)
					if (mv) {
						const pts = await Promise.all([mv[2], mv[3]].filter(Boolean).map(async (t) => JSON.parse((await evaluate(`JSON.stringify(window.locateClick(${JSON.stringify(t)}))`)) ?? "null")));
						if (pts.some((p) => !p)) { console.log(`${tok.trim()}: no such target on screen`); continue; }
						for (const pt of pts) { await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: pt.x, y: pt.y, buttons: 0 }); await sleep(120); }
						if (mv[1] === "wheel") await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: pts[0].x, y: pts[0].y, deltaX: 0, deltaY: -100 });
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: ${mv[1]} ${tok.trim()}`);
						await sleep(Number(mv[4] ?? 700));
						continue;
					}
					const dr = /^drag:([^>]+)>([^@]+)(?:@(\d+))?$/.exec(tok.trim()); // drag:A>B, A and B as below
					if (dr) {
						const [a, b] = await Promise.all([dr[1], dr[2]].map(async (t) => JSON.parse((await evaluate(`JSON.stringify(window.locateClick(${JSON.stringify(t)}))`)) ?? "null")));
						if (!a || !b) { console.log(`drag ${tok.trim()}: no such target on screen`); continue; }
						const ev = (pt, buttons) => ({ x: pt.x, y: pt.y, button: "left", buttons });
						await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...ev(a, 0) });
						await send("Input.dispatchMouseEvent", { type: "mousePressed", clickCount: 1, ...ev(a, 1) });
						await sleep(120);
						await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...ev(b, 1) });
						await sleep(120);
						await send("Input.dispatchMouseEvent", { type: "mouseReleased", clickCount: 1, ...ev(b, 0) });
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: dragged ${dr[1]} to ${dr[2]}`);
						await sleep(Number(dr[3] ?? 700));
						continue;
					}
					const m = /^((?:[a-z]+\+)*)([a-z]+(?::[^@]*)?)(?:@(\d+))?$/.exec(tok.trim());
					const mods = (m[1] || "").split("+").filter(Boolean);
					const at = await evaluate(`JSON.stringify(window.locateClick(${JSON.stringify(m[2])}))`);
					const pt = at && JSON.parse(at);
					if (!pt) { console.log(`click ${tok.trim()}: no such target on screen`); continue; }
					const button = mods.includes("right") ? "right" : mods.includes("middle") ? "middle" : "left";
					const ev = { x: pt.x, y: pt.y, button, buttons: { left: 1, right: 2, middle: 4 }[button], modifiers: (mods.includes("alt") ? 1 : 0) | (mods.includes("ctrl") ? 2 : 0) | (mods.includes("shift") ? 8 : 0) };
					await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...ev, buttons: 0 });
					for (let n = 1; n <= (mods.includes("dbl") ? 2 : 1); n++) {
						await send("Input.dispatchMouseEvent", { type: "mousePressed", clickCount: n, ...ev });
						await send("Input.dispatchMouseEvent", { type: "mouseReleased", clickCount: n, ...ev, buttons: 0 });
					}
					console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: clicked ${tok.trim()} at ${pt.x.toFixed(0)},${pt.y.toFixed(0)}`);
					await sleep(Number(m[3] ?? 700));
				}
				for (const line of commands ? commands.split(";") : []) { // typed through CDP into the real input box: click it, type, Enter
					await evaluate("document.getElementById('input').focus()");
					await send("Input.insertText", { text: line.trim() });
					await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
					await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
					console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: typed ${line.trim()}`);
					await sleep(1500);
				}
				if (statSteps) { // click statpanel tabs / lines by text with real mouse events
					await sleep(2500); // Stat() runs once a second
					let k = 0;
					const snap = async () => { const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data; mkdirSync(dirname(statShot), { recursive: true }); if (img) writeFileSync(`${statShot}-${k}.png`, Buffer.from(img, "base64")); };
					const dump = async (t) => console.log(`stat ${t}: tabs=${await evaluate("[...document.querySelectorAll('#stattabs button')].map((b) => (b.className ? '*' : '') + b.textContent).join(' | ')")}\n` + (await evaluate("[...document.querySelectorAll('#statlines div')].map((d) => d.innerText.replace(/\\n/g, ' ')).join('\\n')")));
					await dump("start"); await snap();
					for (const step of statSteps.split(";")) {
						const t = step.trim();
						if (t !== "@shot") {
							const line = t.startsWith("@line:"), want = line ? t.slice(6) : t;
							const pt = JSON.parse(await evaluate(`(() => { const e = [...document.querySelectorAll(${line ? "'#statlines span.c'" : "'#stattabs button'"})].find((e) => e.textContent.trim() === ${JSON.stringify(want)}); if (!e) return "null"; const r = e.getBoundingClientRect(); return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`));
							if (!pt) { console.log(`stat: no ${line ? "line" : "tab"} "${want}"`); continue; }
							await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...pt, button: "left", buttons: 0 });
							await send("Input.dispatchMouseEvent", { type: "mousePressed", ...pt, button: "left", buttons: 1, clickCount: 1 });
							await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...pt, button: "left", buttons: 0, clickCount: 1 });
						}
						await sleep(2500); k++;
						await dump(t); await snap();
					}
				}
				let shotDlg = false;
				for (const a of answers ? answers.split(";") : []) { // wait for a dialog, shoot it, answer it
					let n = 0;
					while (n++ < 60 && !(await evaluate("!!document.querySelector('.dlg')"))) await sleep(500);
					if (n > 60) { console.log("no dialog appeared for answer " + a); break; }
					if (!shotDlg) {
						shotDlg = true;
						const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data;
						mkdirSync(dirname(dialogShot), { recursive: true });
						if (img) writeFileSync(dialogShot, Buffer.from(img, "base64"));
						console.log(`dialog screenshot ${dialogShot}: ${(await evaluate("document.querySelector('.dlg').innerText")).replace(/\n/g, " | ")}`);
					}
					const t = a.trim();
					if (await evaluate("!!document.querySelector('.dlg .body > :is(input,textarea,select)')") && !t.startsWith("@")) {
						await send("Input.insertText", { text: t });
						await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
						await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
					} else if (t.startsWith("@item:")) await evaluate(`(()=>{const s=document.querySelector('.dlg select');s.selectedIndex=${Number(t.slice(6))};s.ondblclick()})()`);
					else await evaluate(`[...document.querySelectorAll('.dlg button')].find((b)=>b.textContent===${JSON.stringify(t === "@cancel" ? "Cancel" : t)}).click()`);
					console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: answered ${t}`);
					await sleep(1500);
				}
				if (browseClicks || browseShot !== "build/3x/win") { // wait for a popup, shoot it, click links in it by text
					let n = 0;
					while (n++ < 60 && !(await evaluate("!!document.querySelector('.bwin iframe')"))) await sleep(500);
					await sleep(3000); // scripts in the popup (tgui) need a moment to run and get their data
					const probe = async () => JSON.parse(await evaluate("window.popups.probe().then(JSON.stringify)", true));
					const snap = async (k) => { const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data; mkdirSync(dirname(browseShot), { recursive: true }); if (img) writeFileSync(`${browseShot}-${k}.png`, Buffer.from(img, "base64")); };
					console.log(`popups: ${JSON.stringify((await probe()).map((w) => [w.name, w.text]))}`);
					console.log(`popup script errors: ${await evaluate("JSON.stringify(window.popupErrors ?? [])")}`);
					await snap(0);
					let k = 0;
					for (const t of browseClicks ? browseClicks.split(";") : []) {
						if (t.trim() === "@close") { await evaluate("document.querySelector('.bwin .bbar button').click()"); console.log("clicked the close button"); await sleep(2500); console.log(`popups now: ${await evaluate("document.querySelectorAll('.bwin').length")}`); await snap(++k); continue; }
						const [linkText, linkAnswer] = t.trim().split("="); // "Add Line=C4,E4" answers the text box the click opens
						const pt = (await probe()).flatMap((w) => w.links).find((l) => l.t === linkText) ?? null;
						if (!pt) { console.log(`no link "${linkText}" in any popup`); continue; }
						await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...pt, button: "left", buttons: 0 });
						await send("Input.dispatchMouseEvent", { type: "mousePressed", ...pt, button: "left", buttons: 1, clickCount: 1 });
						await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...pt, button: "left", buttons: 0, clickCount: 1 });
						console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: clicked link "${linkText}"`);
						if (linkAnswer !== undefined) {
							for (let w = 0; w < 20 && !(await evaluate("!!document.querySelector('.dlg .body > :is(input,textarea)')")); w++) await sleep(250);
							await send("Input.insertText", { text: linkAnswer });
							await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
							await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
							console.log(`answered ${linkAnswer}`);
						}
						await sleep(2500);
						console.log(`popups now: ${JSON.stringify((await probe()).map((w) => [w.name, w.text]))}`);
						await snap(++k);
					}
				}
				shotAt = Date.now() + 3000;
				if (extraQuery.includes("check")) { await evaluate("window.resyncView()"); console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: asked the worker for a full view (resync)`); }
			}
		}
		if (shotAt !== null && !shotDone && Date.now() >= shotAt) {
			shotDone = true;
			if (cpuProfile) { const pr = (await send("Profiler.stop")).result?.profile; mkdirSync(dirname(cpuProfile), { recursive: true }); writeFileSync(cpuProfile, JSON.stringify(pr)); console.log(`page CPU profile written to ${cpuProfile} (summary: node tools/cpuprofile-top.mjs ${cpuProfile})`); }
			if (rec) { // stop recording; frames.txt = ffmpeg concat list with real frame times
				await send("Page.stopScreencast");
				const f = rec.frames; rec.frames = null; const lines = ["ffconcat version 1.0"];
				f.forEach((fr, i) => { lines.push(`file f${fr.n}.jpg`, `duration ${i + 1 < f.length ? (f[i + 1].t - fr.t).toFixed(3) : "1.000"}`); });
				if (f.length) lines.push(`file f${f[f.length - 1].n}.jpg`);
				writeFileSync(`${rec.dir}/frames.txt`, lines.join("\n") + "\n");
				console.log(`recorded ${f.length} frames to ${rec.dir}/frames.txt`); rec = null;
			}
			const img = (await send("Page.captureScreenshot", { format: "png" })).result?.data;
			mkdirSync(dirname(shot), { recursive: true });
			if (img) writeFileSync(shot, Buffer.from(img, "base64"));
			console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: screenshot ${img ? shot : "FAILED"} (${st.views} view snapshots so far; page says: ${st.view})`);
			if (opt("--probe", "")) console.log(`probe: ${await evaluate(readFileSync(opt("--probe", ""), "utf8"), true)}`); // --probe FILE, a JS expression (may be a promise of a string) run in the page after the shot
		}
		if (st.done || st.error) break;
		if (Date.now() - t0 > cap * 1000) { console.log(`cap ${cap} s reached; writing what there is`); break; }
	}
	const r = JSON.parse(await evaluate("JSON.stringify(window.bootResult)"));
	if (r.viewStats) {
		const v = r.viewStats, span = (v.lastAt - v.firstAt) / 1000;
		console.log(`page view stats: ${v.received} updates in ${span.toFixed(1)} s = ${(v.received / span).toFixed(1)}/s, ${v.changed ?? "?"} with changes; rebuilt ${v.applied}x at ${(v.applyMs / v.applied).toFixed(2)} ms; drew ${v.renders}x at ${(v.renderMs / v.renders).toFixed(2)} ms (new views ${v.newViewRenders}x at ${(v.newViewMs / v.newViewRenders).toFixed(2)} ms, median ${[...v.newViewTimes].sort((a, b) => a - b)[v.newViewTimes.length >> 1]}, first ${v.newViewTimes[0]}, max ${Math.max(...v.newViewTimes)}; the rest are animation frames at ${((v.renderMs - v.newViewMs) / (v.renders - v.newViewRenders)).toFixed(2)} ms); new-view p95 ${[...v.newViewTimes].sort((a, b) => a - b)[Math.floor(v.newViewTimes.length * 0.95)]}${v.bench ? `; FORCED FULL REDRAWS ${JSON.stringify(v.bench)}` : ""}; checks ${v.checks ?? "-"}, failed ${v.checkFails ?? "-"}`);
	}
	if (r.viewStats?.hitMs?.length) { const h = [...r.viewStats.hitMs].sort((a, b) => a - b); console.log(`hit tests: ${h.length}, median ${h[h.length >> 1]} ms, max ${h[h.length - 1]} ms, in order ${r.viewStats.hitMs.join(" ")}`); }
	if (r.viewStats?.animEvents) console.log(`animations on the page: ${r.viewStats.animEvents} steps received, ${r.viewStats.flickFrames} flick frames built; first: ${JSON.stringify(r.viewStats.animLog.slice(0, 8))}`);
	if (r.viewStats?.shakeApplied) console.log(`screen shake on the page: ${r.viewStats.shakeApplied} offsets applied to the canvas, largest ${r.viewStats.shakeMax} px`);
	if (r.viewStats?.glideFrames) { // glide frames (redraws of a view with something mid-glide) and the per-frame offsets
		const v = r.viewStats, t = [...v.glideTimes].sort((a, b) => a - b);
		console.log(`glide: (page rAF ticks ${v.rafs} in ${((v.lastAt - v.firstAt) / 1000).toFixed(0)} s) ${v.glideFrames} frames drawn at ${(v.glideMs / v.glideFrames).toFixed(2)} ms avg, median ${t[t.length >> 1]}, p95 ${t[Math.floor(t.length * 0.95)]}, max ${t[t.length - 1]}; rAF gaps while gliding (ms) median ${[...v.glideGaps].sort((a, b) => a - b)[v.glideGaps.length >> 1]}, max ${Math.max(...v.glideGaps)}; ${v.glideLog.length} rebuilt frames logged to ${out}.glide.json`);
		mkdirSync(dirname(out), { recursive: true });
		console.log(`key latency (keydown on the page to the first drawn frame that moves), ms: ${JSON.stringify(v.keyLat)}; keydown to the update that starts the glide arriving on the page: ${JSON.stringify(v.keyRecv)}`);
		console.log(`visible tiles not held mid-camera-glide: ${v.missingVis} ${JSON.stringify(v.missingLog.slice(0, 5))}`);
		writeFileSync(out + ".glide.json", JSON.stringify(v.glideLog));
	}
	const game = Object.keys(r.files).filter((k) => k.endsWith("/game.log")).pop();
	mkdirSync(dirname(out), { recursive: true });
	if (rounds) { // one combined log per world (the last one only up to its lobby)
		const worlds = [...(r.rounds ?? []), { lines: r.lines, files: r.files, milestones: r.milestones }];
		worlds.forEach((w, i) => {
			const g = Object.keys(w.files).filter((k) => k.endsWith("/game.log")).pop(), f = out.replace(/\.log$/, "") + `-world${i + 1}.log`;
			writeFileSync(f, w.lines.join("\n") + "\n" + (g ? w.files[g] : ""));
			console.log(`world ${i + 1}: milestones ${JSON.stringify(w.milestones)}; ${w.lines.length} log lines + ${g ?? "no game.log"}; wrote ${f}`);
		});
		console.log(`worker heap after GC in each world's lobby: ${heaps.join(", ")} MB`);
	}
	writeFileSync(out, r.lines.join("\n") + "\n" + (game ? r.files[game] : ""));
	console.log(`milestones ${JSON.stringify(r.milestones)}; ${r.lines.length} log lines + ${game ?? "no game.log"}; wrote ${out}; worker heap peak (sampled every 2 s) ${peakMB} MB`);
	for (const l of r.lines.filter((l) => /Initializations complete|^\[vm-boot\] (second|players|stopped|after round start|heap|live|joined|first view|client|key|player state|Click|DblClick|to client|player|gender|icon pixels|runtime icon|worker: fetched)|^\[page\] (sound|audio)/.test(l))) console.log(l);
	if (profile) console.log(`IndexedDB ss13-classic/kv/files: ${await evaluate(`new Promise((ok) => { const q = indexedDB.open("ss13-classic"); q.onerror = () => ok("open failed"); q.onsuccess = () => { const g = q.result.transaction("kv").objectStore("kv").get("files"); g.onsuccess = () => ok(JSON.stringify(Object.entries(g.result ?? {}).map(([k, v]) => [k, v.length]))); g.onerror = () => ok("get failed"); }; })`, true)}`); // 4c
	ws.close();
} finally { chrome.kill(); server.kill(); }
