// firefox-perf - Boot the live page in headless Firefox, walk, and print the latency/perf log lines (lat1).
// Usage (from web/, after `npm run build`): node --experimental-websocket tools/firefox-perf.mjs [--after-start S] [--query "shoot=1"]
//        [--ff-port P] (drive a Firefox already listening on P, e.g. another machine's through ssh -L; it needs a real display: headless runs no frames)
//        [--keys-after S] [--keys "east*6,west*6,south@2000"] [--out FILE] [--url URL] (open URL as is instead, e.g. a server page through netem-proxy) [--for S] (stop S s after joining)
//        pd-measure: [--hits N] (after the keys: pointAt on an N-point grid over the map canvas, as mouse moves would; prints hitMs)
//        pd-screen: [--screen-check] (locate/pointAt round trip on known tiles + applyOff shake probe + pixi canvas info) [--pd 0|1] (needs query renderer=pd: pixel diff vs the ?pd=0 path, HUD off/on; then a live diff: the kept picture, not redrawn)
//        [--resize W,H] (setViewport after the keys, then the canvas info) [--late-cmd "zoom-in"] (typed after that, then the canvas info)
//        pd-dirty: [--steps "cmd:jump-to-coordinate 128 128 3;wait:6;keys:east*5;resync;fails;pd"] (pd: live pixel diff, query renderer=pd) (after the keys, in order; with query check=1 the page compares its kept scene with a full snapshot every 2 s)
//        netcode 5: --steps "cmd:spawn /obj/structure/closet/crate;keys:east;click:ctrl+rel:-1,0;keys:west*8;stat:predPullGap" (pull a crate; the "prediction:" line is printed before the steps: use stat:)
//        netcode 1: [--clicks "shift+eye*8/1500"] (after the keys: mouse clicks on a locateClick spot, modifiers held; prints click -> answer ms)
//        ws1: [--window W,H] [--pre-cmd "toggle-widescreen"] (typed 5 s after joining; ";" separates several) [--shot FILE.png] (just before the keys) [--shot-end FILE.png] (after them) [--shot-mid MS:FILE.png] (MS after the keys start, while they run) [--fps N] (rAF rate, e.g. 144)
//        gc: [--no-join] (nobody joins: no view is built) [--join ROLE] (default Assistant; e.g. AI) [--ff-stderr FILE] (Firefox's stderr; JS_GC_PROFILE=0 in the env logs the page's GCs, not the worker's); MOZ_PROFILER_SHUTDOWN=FILE.json
//        (+ MOZ_PROFILER_STARTUP=1) quits Firefox cleanly so it writes a profile, worker GC markers included
// Drives /usr/bin/firefox over WebDriver BiDi (ws://127.0.0.1:PORT/session): real trusted key events via input.performActions,
// so the page's keydown -> first moving frame numbers (viewStats.keyLat) are measured as in worker-boot.mjs. Keys: north/south/
// east/west, a letter, ctrl+X; *N = N taps 340 ms apart (*N/MS: MS apart), @MS = hold. Writes the page's log lines to --out and prints the
// "[vm-boot] live", "long tick", "[page] perf" lines and the key latencies. Uses a throwaway profile in build/ff-profile-PID.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, openSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const stopAfter = Number(opt("--for", "0")); // --for S: stop S seconds after joining (a --url server page never says it is done)
const afterStart = opt("--after-start", "90"), query = opt("--query", ""), keys = opt("--keys", ""), keysAfter = Number(opt("--keys-after", "20"));
const out = opt("--out", "build/lat1/firefox.log");
const pdHud = opt("--pd", ""), screenCheck = argv.includes("--screen-check"), resizeTo = opt("--resize", ""), lateCmd = opt("--late-cmd", ""), steps = opt("--steps", "");
const inject = Number(opt("--inject", "0")), hits = Number(opt("--hits", "0")), win = opt("--window", "1000,1400"), preCmd = opt("--pre-cmd", ""), shot = opt("--shot", ""), shotEnd = opt("--shot-end", ""), shotMid = opt("--shot-mid", "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const WEB_PORT = String(20000 + (process.pid % 20000)), FF_PORT = opt("--ff-port", "") || String(40000 + (process.pid % 20000)); // --ff-port P: drive a Firefox already listening there (e.g. the laptop's, through an ssh tunnel)
const prof = resolve(`build/ff-profile-${process.pid}`);
mkdirSync(prof, { recursive: true });
if (opt("--fps", "")) writeFileSync(`${prof}/user.js`, `user_pref("layout.frame_rate", ${Number(opt("--fps", ""))});\n`); // --fps N: rAF rate
const server = spawn(process.execPath, ["build/dist/src/tools/gallery-server.js"], { env: { ...process.env, PORT: WEB_PORT }, stdio: "ignore" });
const ff = opt("--ff-port", "") ? { kill() {} } : spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${FF_PORT}`, `--window-size=${win}`], { stdio: ["ignore", "ignore", opt("--ff-stderr", "") ? openSync(opt("--ff-stderr", ""), "w") : "ignore"], env: { ...process.env, MOZ_HEADLESS: "1" } });
const t0 = Date.now();
const KEYS = { north: "", south: "", east: "", west: "", ctrl: "", shift: "", alt: "", tab: "" };
try {
	let ws;
	for (let i = 0; i < 100 && !ws; i++) {
		await sleep(300);
		try { const s = new WebSocket(`ws://127.0.0.1:${FF_PORT}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {}
	}
	if (!ws) throw new Error("no BiDi connection to Firefox");
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	await send("session.new", { capabilities: {} });
	const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	const evaluate = async (expression) => { const r = await send("script.evaluate", { expression, target: { context: ctx }, awaitPromise: true }); return r.result?.result?.value; };
	await send("browsingContext.navigate", { context: ctx, url: opt("--url", "") || `http://127.0.0.1:${WEB_PORT}/web/worker/index.html?seed=24301&ticks=100000&afterStart=${afterStart}${argv.includes("--no-join") ? "" : `&join=${opt("--join", "Assistant")}`}${query ? `&${query}` : ""}`, wait: "complete" });
	console.log(`firefox ${(await send("session.status")).result ? "up" : "?"}; page loaded; renderer: ${await evaluate("(() => { const g = document.createElement('canvas').getContext('webgl'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return g ? String(g.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : g.RENDERER)) : 'no webgl'; })()")}`);
	if (argv.includes("--window")) { const [vw, vh] = win.split(",").map(Number); await send("browsingContext.setViewport", { context: ctx, viewport: { width: vw, height: vh } }); }
	await evaluate("dispatchEvent(new Event('pointerdown')), 1"); // audio unlock, as a first click would
	const act = (actions) => send("input.performActions", { context: ctx, actions: [{ type: "key", id: "kb", actions }] });
	const sendKeys = async (list) => {
		for (const tok of list.split(",")) {
			const m = /^(.+?)(?:\*(\d+)|@(\d+))?(?:\/(\d+))?$/.exec(tok.trim()), parts = m[1].toLowerCase().split("+"), k = parts.pop(), v = KEYS[k] ?? k;
			for (let i = 0; i < Number(m[2] ?? 1); i++) {
				const mods = parts.map((p) => KEYS[p]);
				await act([...mods.map((x) => ({ type: "keyDown", value: x })), { type: "keyDown", value: v }, { type: "pause", duration: m[3] ? Number(m[3]) : 40 }, { type: "keyUp", value: v }, ...mods.map((x) => ({ type: "keyUp", value: x }))]);
				await sleep(m[4] ? Math.max(0, Number(m[4]) - 40) : 300);
			}
			console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: sent ${tok.trim()}`);
		}
	};
	// netcode 1: --clicks "shift+eye*8/1500": after the keys, real mouse clicks (held 100 ms) on a window.locateClick spot, with modifier keys
	// held; prints the page's click -> first chat line or sound times.
	const clicks = opt("--clicks", ""), hudProbe = opt("--hud-probe", ""); // --hud-probe hand#1: print that screen object's look around every click, not only hud: ones
	const sendClicks = async (list) => {
		for (const tok of list.split(/,(?![-\d])/)) {
			const m = /^(.+?)(?:\*(\d+))?(?:\/(\d+))?$/.exec(tok.trim()), parts = m[1].split("+"), spot = parts.pop(), mid = parts.includes("mid"), mods = parts.filter((p) => p !== "mid").map((p) => KEYS[p.toLowerCase()]); // "mid+eye": the middle button
			for (let i = 0; i < Number(m[2] ?? 1); i++) {
				const at = JSON.parse((await evaluate(`JSON.stringify(window.locateClick(${JSON.stringify(spot)}))`)) ?? "null");
				if (!at) { console.log(`click ${spot}: not found`); break; }
				const hudSpec0 = spot.startsWith("hud:") ? spot.slice(4) : hudProbe || null;
				if (hudSpec0) console.log(`  ${spot} before: ${await evaluate(`window.hudState(${JSON.stringify(hudSpec0)})`)}`);
				const kb = [...mods.map((x) => ({ type: "keyDown", value: x })), { type: "pause", duration: 0 }, { type: "pause", duration: 100 }, { type: "pause", duration: 0 }, { type: "pause", duration: 0 }, { type: "pause", duration: 0 }, ...mods.map((x) => ({ type: "keyUp", value: x }))]; // the modifier stays down through the release (the mouse side has a tick more for the modifier keys' own)
				const ms = [...mods.map(() => ({ type: "pause", duration: 0 })), { type: "pointerMove", x: Math.round(at.x), y: Math.round(at.y) }, { type: "pointerDown", button: mid ? 1 : 0 }, { type: "pause", duration: 100 }, { type: "pointerUp", button: mid ? 1 : 0 }];
				await send("input.performActions", { context: ctx, actions: [{ type: "key", id: "kb", actions: kb }, { type: "pointer", id: "mouse", parameters: { pointerType: "mouse" }, actions: ms }] });
				const hudSpec = spot.startsWith("hud:") ? spot.slice(4) : hudProbe || null; // netcode 2: the object's look just after the release (a guess, before the answer), and once the answer is in
				if (hudSpec) console.log(`  ${spot} just after the click: ${await evaluate(`window.hudState(${JSON.stringify(hudSpec)})`)}`);
				if (hudSpec) await evaluate(`(() => { const t0 = performance.now(), log = window.hudFrames = []; let last = ""; const f = () => { const s = window.hudState(${JSON.stringify(hudSpec)}); if (s !== last) { log.push(Math.round(performance.now() - t0) + " ms " + s); last = s; } if (performance.now() - t0 < 1400) requestAnimationFrame(f); }; f(); return 1; })()`); // every frame's look: a flicker between the guess and the answer
				await sleep(m[3] ? Number(m[3]) : 1500);
				if (hudSpec) console.log(`  ${spot} frame by frame: ${await evaluate("JSON.stringify(window.hudFrames)")}`);
				if (hudSpec) console.log(`  ${spot} ${m[3] ?? 1500} ms later: ${await evaluate(`window.hudState(${JSON.stringify(hudSpec)})`)}`);
			}
			console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: clicked ${tok.trim()}`);
		}
		await sleep(1500);
		console.log("click->answer ms: " + await evaluate("JSON.stringify(window.bootResult.viewStats.clickLat)"));
	};
	let joinedAt = null, keysDone = !keys && !clicks, preDone = !preCmd;
	const probe = async () => console.log("probe " + await evaluate(`JSON.stringify((() => { const h = document.getElementById("client-host"), cs = [...h.querySelectorAll("canvas")].map((c) => ({ w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight, ar: getComputedStyle(c).getPropertyValue("--ar"), style: c.getAttribute("style") })); const m = document.getElementById("mapwindow"); return { canvases: cs, map: [m.clientWidth, m.clientHeight], hostAr: h.style.cssText, eye: window.locateClick?.("eye"), swap: window.locateClick?.("hud:swap") }; })())`));
	const capture = async (file) => { await probe(); const r = await send("browsingContext.captureScreenshot", { context: ctx }); if (r.result?.data) { mkdirSync(dirname(resolve(file)), { recursive: true }); writeFileSync(file, Buffer.from(r.result.data, "base64")); console.log(`screenshot ${file}`); } else console.log(`screenshot failed: ${JSON.stringify(r).slice(0, 200)}`); };
	for (;;) {
		await sleep(2000);
		const st = JSON.parse((await evaluate("JSON.stringify({ joined: window.bootResult?.milestones?.joined ?? null, done: window.bootResult?.done, n: window.bootResult?.lines?.length })")) ?? "{}");
		if (st.joined != null && joinedAt === null) { joinedAt = Date.now(); console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: joined`); }
		if (!preDone && joinedAt !== null && Date.now() - joinedAt > 5000) { preDone = true; for (const c of preCmd.split(";")) { await evaluate(`window.sendCommand(${JSON.stringify(c)}), 1`); await new Promise((r) => setTimeout(r, 300)); } console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: typed ${preCmd}`); }
		if (!keysDone && joinedAt !== null && Date.now() - joinedAt > keysAfter * 1000) {
			keysDone = true;
			if (shot) await capture(shot);
			const sent = keys ? sendKeys(keys) : Promise.resolve();
			if (shotMid) { const i = shotMid.indexOf(":"); await sleep(Number(shotMid.slice(0, i))); await capture(shotMid.slice(i + 1)); }
			await sent;
			if (clicks) await sendClicks(clicks);
			console.log("prediction: " + await evaluate(`JSON.stringify((({ predSteps, predOk, predWrong, predLate, predFace, predFaceOk, predFaceWrong, predPull, predPullFrames, predPullGap, predPullFar, predSkip }) => ({ predSteps, predOk, predWrong, predLate, predFace, predFaceOk, predFaceWrong, predPull, predPullFrames, predPullGap, predPullFar, predSkip }))(window.bootResult.viewStats))`));
			if (shotEnd) { await sleep(1500); await capture(shotEnd); }
			const info = async (label) => console.log(`${label}: ` + await evaluate(`JSON.stringify({ pixi: window.bootResult.viewStats.pixiInfo, canvases: [...document.querySelectorAll("#client-host canvas")].map((c) => ({ w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight })), dpr: devicePixelRatio, renders: window.bootResult.viewStats.renders })`));
			if (screenCheck) {
				await info("canvas info");
				for (const spec of ["eye", "rel:3,2", "rel:-6,-4", "rel:20,15", "rel:-40,30"]) console.log(`locate ${spec}: ` + await evaluate(`JSON.stringify((() => { const q = window.locateClick(${JSON.stringify(spec)}), p = q && window.pointAt(q.x, q.y), e = window.locateClick("eye"), pe = e && window.pointAt(e.x, e.y); return { at: q, tile: p?.tile ?? null, eyeTile: pe?.tile ?? null, px: p && [p.px, p.py] }; })())`));
				for (const o of [[8, 0], [0, -5], [-12, 7]]) console.log(`shake ${o}: ` + await evaluate(`JSON.stringify(window.bootResult.viewStats.shakeProbe(${o[0]}, ${o[1]}))`));
			}
			if (inject) { console.log("animInject: " + await evaluate(`JSON.stringify(window.bootResult.viewStats.animInject(${inject}))`)); await sleep(1500); console.log("animLog: " + await evaluate("JSON.stringify([window.bootResult.viewStats.animEvents, window.bootResult.viewStats.flickFrames])")); }
			if (pdHud !== "") {
				{ // first: the forced diffs below redraw every plane
					const r = await evaluate(`(async () => { try { return JSON.stringify(await window.pdDiff(true, false, true)); } catch (e) { return "pdDiff failed: " + e; } })()`);
					console.log(`pixel diff (live: the picture as kept, not redrawn): ${r}`);
				}
				for (const nt of [false, true]) {
					const r = await evaluate(`(async () => { try { return JSON.stringify(await window.pdDiff(${pdHud === "1"}, ${nt})); } catch (e) { return "pdDiff failed: " + e; } })()`);
					console.log(`pixel diff (hud ${pdHud}, transformed items ${nt ? "left out" : "in"}): ${r}`);
				}
			}
			if (resizeTo) {
				const [vw, vh] = resizeTo.split(",").map(Number);
				await send("browsingContext.setViewport", { context: ctx, viewport: { width: vw, height: vh } });
				await sleep(4000);
				await info(`after resize to ${resizeTo}`);
			}
			if (lateCmd) {
				for (const c of lateCmd.split(";")) { await evaluate(`window.sendCommand(${JSON.stringify(c)}), 1`); await sleep(4000); await info(`after ${c}`); }
			}
			// --steps "cmd:TEXT;keys:east*5,north*3;resync;wait:S;fails": after the keys, in order. cmd types a command (then waits 4 s), keys walks, resync asks the worker for a full view
			// (window.resyncView, as the page's own check does), wait sleeps S seconds, fails prints the failed-check count so far.
			for (const st of steps ? steps.split(";") : []) {
				const [kind, ...rest] = st.split(":"), arg = rest.join(":");
				if (kind === "cmd") { await evaluate(`window.sendCommand(${JSON.stringify(arg)}), 1`); await sleep(4000); }
				else if (kind === "keys") await sendKeys(arg);
				else if (kind === "click") await sendClicks(arg); // netcode 5: e.g. click:ctrl+rel:-1,0 (pull the thing west of you), then keys:...
				else if (kind === "resync") await evaluate("window.resyncView(), 1");
				else if (kind === "wait") await sleep(Number(arg) * 1000);
				else if (kind === "stat") console.log(`viewStats.${arg}: ` + await evaluate(`JSON.stringify(window.bootResult.viewStats.${arg})`));
				else if (kind === "pd") console.log("live pixel diff: " + await evaluate(`(async () => { try { const r = await window.pdDiff(true, false, true); return typeof r === "string" ? r : JSON.stringify({ differing: r.differing, over2: r.over2, first: r.first.slice(0, 3) }); } catch (e) { return "pdDiff failed: " + e; } })()`)); // needs query renderer=pd
				else if (kind === "js") console.log("js: " + await evaluate(`String(${arg})`)); // js:EXPR (no ";"): evaluated in the page, result printed
				else if (kind === "fails") console.log("view checks so far: " + await evaluate("JSON.stringify([window.bootResult.viewStats.checks, window.bootResult.viewStats.checkFails])"));
				console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: step ${st}`);
			}
			if (hits) {
				await sleep(1500);
				const h = JSON.parse(await evaluate(`JSON.stringify((() => { const c = document.querySelector("#client-host canvas"), r = c.getBoundingClientRect(), n = Math.ceil(Math.sqrt(${hits})), s = window.bootResult.viewStats, k = s.hitMs.length; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) window.pointAt(r.left + (i + 0.5) / n * r.width, r.top + (j + 0.5) / n * r.height); return s.hitMs.slice(k); })())`));
				const sh = [...h].sort((a, b) => a - b);
				console.log(`hit tests (pointAt sweep): ${h.length}, median ${sh[sh.length >> 1]} ms, p95 ${sh[Math.floor(sh.length * 0.95)]} ms, max ${sh[sh.length - 1]} ms`);
			}
		}
		if (st.done || Date.now() - t0 > 900000 || (stopAfter && joinedAt !== null && Date.now() - joinedAt > stopAfter * 1000)) break;
	}
	const r = JSON.parse(await evaluate("JSON.stringify({ lines: window.bootResult.lines, keyLat: window.bootResult.viewStats.keyLat, keyRecv: window.bootResult.viewStats.keyRecv, checks: window.bootResult.viewStats.checks, ownMoves: window.bootResult.viewStats.ownMoves, ownMoveGaps: window.bootResult.viewStats.ownMoveGaps, checkFails: window.bootResult.viewStats.checkFails })"));
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, r.lines.join("\n") + "\n");
	for (const l of r.lines.filter((l) => /^\[vm-boot\] (live|long tick|after round start|stopped)|^\[page\] (perf|split|chunks|view check)|shoot:/.test(l))) console.log(l);
	if (r.checks) console.log(`view checks (?check=1): ${r.checks} run, ${r.checkFails} failed`);
	console.log(`key latency (keydown -> first moving frame), ms: ${JSON.stringify(r.keyLat)}; keydown -> update arriving: ${JSON.stringify(r.keyRecv)}; own mob steps seen ${r.ownMoves ?? "-"}, ms apart ${JSON.stringify(r.ownMoveGaps ?? [])}`);
	if (process.env.MOZ_PROFILER_SHUTDOWN) { // the profile is written on a clean quit; Firefox writes a small one at startup too, so wait for a newer file
		const f = process.env.MOZ_PROFILER_SHUTDOWN, closedAt = Date.now(), gone = new Promise((r) => ff.on?.("exit", r));
		send("browser.close");
		const written = () => existsSync(f) && statSync(f).mtimeMs > closedAt;
		let exited = false; gone.then(() => (exited = true));
		while (Date.now() - closedAt < 300000 && !exited && !written()) await sleep(1000);
		for (let size = -1; written() && statSync(f).size !== size; ) { size = statSync(f).size; await sleep(3000); } // until it stops growing
		if (!written()) console.log(`profile ${f} NOT written after quitting`);
	}
	ws.close();
} finally { ff.kill(); server.kill(); await sleep(1000); rmSync(prof, { recursive: true, force: true }); }
