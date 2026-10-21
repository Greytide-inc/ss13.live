// ui2-tgui - Headless Firefox on a built web/dist: opens a tgui window (?tgui=PATH test aid), logs the server's non-200 requests,
// what the window shows, and (with --resize) drags tgui's own corner and the .bwin native corner and prints the window sizes.
// Usage (from web/, after `npm run build:static -- --dist build/NAME-dist`): node --experimental-websocket tools/ui2-tgui.mjs [--dist DIR] [--atom /obj/machinery/disposal/bin] [--resize] [--shot FILE] [--click TEXT] [--job JOB] [--query "&roundstart=1"] [--steps "click:Notekeeper;;answer:hello;;expect:hello;;capture:NAME"]
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
const argv = process.argv.slice(2), opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const dist = resolve(opt("--dist", "dist")), atom = opt("--atom", "/obj/machinery/disposal/bin"), shot = opt("--shot", "build/ui2/shot.png");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = String(20000 + (process.pid % 20000)), FF = String(40000 + (process.pid % 20000)), prof = resolve(`build/ff-profile-${process.pid}`), slog = resolve(`build/ui2/server-${process.pid}.log`);
mkdirSync(prof, { recursive: true }); mkdirSync(dirname(slog), { recursive: true });
const srv = spawn("sh", ["-c", `exec python3 -m http.server ${PORT} --bind 127.0.0.1 --directory ${dist} 2> ${slog}`], { stdio: "ignore" });
const ff = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${FF}`, "--window-size=1000,900"], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } });
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
try {
	let ws;
	for (let i = 0; i < 100 && !ws; i++) { await sleep(300); try { const s = new WebSocket(`ws://127.0.0.1:${FF}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {} }
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	await send("session.new", { capabilities: {} });
	const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	const ev = async (expression) => { const r = await send("script.evaluate", { expression, target: { context: ctx }, awaitPromise: true }); return r.result?.result?.value; };
	await send("browsingContext.navigate", { context: ctx, url: `http://127.0.0.1:${PORT}/index.html?join=${encodeURIComponent(opt("--job", "Assistant"))}${opt("--query", "")}${argv.includes("--nosnap") ? "&nosnap=1" : ""}&tgui=${atom}`, wait: "none" });
	// Wait for the window, but give up early: on a crash, a stopped world, "tgui: no PATH on this map", or a runtime error in
	// ui_*/tgui code (the window can't open then); otherwise after 90 s (it opens in 15-46 s; 150 s with --nosnap). Ends 1 instead of 200 s.
	const t0 = Date.now(), waitMs = argv.includes("--nosnap") ? 150000 : 90000; let shown = 0, why = "";
	const ERR = /\[vm-boot\] (runtime|VM gap):|FATAL/; // "[vm-boot] runtime:", not plain "runtime" (the CMO's cat is called Runtime)
	for (; Date.now() - t0 < waitMs; await sleep(1000)) {
		if (Number(await ev("window.popups ? [...window.popups.windows.keys()].filter((k) => /-main$/.test(k)).length : 0")) > 0) { shown = Date.now(); break; }
		why = (await ev(`(() => { const b = window.bootResult; if (!b) return ""; if (b.error) return "worker error: " + b.error; if (b.done) return "the world stopped";
			const l = b.lines.find((l) => /FATAL|tgui: no /.test(l) || (/\\[vm-boot\\] (runtime|VM gap):/.test(l) && /ui_|tgui/i.test(l))); return l ?? ""; })()`)) ?? "";
		if (why) break;
	}
	check(shown > 0, "the tgui window opened after " + ((Date.now() - t0) / 1000).toFixed(0) + " s" + (why ? ` (gave up: ${why.slice(0, 300)})` : ""));
	if (!shown) console.log("game errors and last lines:\n" + ((await ev(`(() => { const L = window.bootResult?.lines ?? []; return [...L.filter((l) => ${ERR}.test(l)).slice(-10), "--- last 10 (no stat/perf lines):", ...L.filter((l) => !/^\\[(vm-boot|page)\\] (stat |perf |live:|MC cost)/.test(l)).slice(-10)].join("\\n"); })()`)) ?? "").slice(0, 4000));
	const early = await send("browsingContext.captureScreenshot", { context: ctx }); if (early.result?.data) writeFileSync(shot.replace(".png", "-early.png"), Buffer.from(early.result.data, "base64"));
	await sleep(4000);
	writeFileSync(shot.replace(".png", ".log"), (await ev("(window.bootResult?.lines ?? []).filter((l) => /browse|tgui|DBG|\\[vm-boot\\] (runtime|VM gap):|FATAL/.test(l)).join('\\n')")) ?? "");
	const rect = () => ev(`JSON.stringify([...window.popups.windows.values()].map(w=>{const r=w.el.getBoundingClientRect();return {n:w.name,x:r.x,y:r.y,w:r.width,h:r.height,sty:w.el.style.cssText,txt:(w.info?.text||"")}}))`);
	console.log("window rect: " + await rect());
	console.log("probe: " + await ev("window.popups.probe().then(JSON.stringify)"));
	console.log("images: " + await ev("JSON.stringify([...window.popups.windows.values()].map((w) => w.info?.imgs))"));
	console.log("popup errors: " + await ev("JSON.stringify(window.popupErrors||[])"));
	if (argv.includes("--click")) { // click the first link whose text is --click TEXT (e.g. Vend) with a real mouse click, then show the window text again
		await ev("window.__hrefs = []; addEventListener(\"message\", (e) => { if (e.data && e.data.href) window.__hrefs.push(e.data.href); })"); const want = opt("--click", "Vend"), before = JSON.parse(await ev("window.popups.probe().then(JSON.stringify)"))[0];
		const l = before.links.find((l) => l.t === want);
		check(!!l, `a "${want}" button is in the window`);
		if (l) {
			await send("input.performActions", { context: ctx, actions: [{ type: "pointer", id: "m", parameters: { pointerType: "mouse" }, actions: [{ type: "pointerMove", x: Math.round(l.x + 4), y: Math.round(l.y + 4) }, { type: "pointerDown", button: 0 }, { type: "pointerUp", button: 0 }] }] });
			await sleep(4000);
			const after = JSON.parse(await ev("window.popups.probe().then(JSON.stringify)"))[0];
			console.log("hrefs sent by the window: " + await ev("JSON.stringify(window.__hrefs)")); console.log("popup errors: " + await ev("JSON.stringify(window.popupErrors||[])")); console.log("before: " + before.text + "\nafter:  " + after.text);
			check(after.text !== before.text, "the window changed after the click");
		}
	}
	if (argv.includes("--steps")) { // a ;;-separated script. links: = print the buttons and window text; click:TEXT = mouse click on the first button/link whose text contains TEXT; answer:TEXT = fill the open input() box and press OK; expect:TEXT = the window text contains TEXT; wait:MS; dump:CSS-SELECTOR = print its innerHTML
		await ev("window.__hrefs = window.__hrefs || []; addEventListener(\"message\", (e) => { if (e.data && e.data.href) window.__hrefs.push(e.data.href); })");
		const probe = async () => JSON.parse(await ev("window.popups.probe().then(JSON.stringify)"))[0];
		for (const st of opt("--steps", "").split(";;")) {
			const k = st.indexOf(":"), kind = st.slice(0, k), arg = st.slice(k + 1);
			if (kind === "click") {
				let lk = (await probe()).links, l = lk.find((l) => l.t === arg) || lk.find((l) => l.t.includes(arg));
				for (let s = 0; l && s < 8 && l.y > 560; s++) { // below the window's visible area: wheel-scroll the page (pda menus are long), then look again
					await send("input.performActions", { context: ctx, actions: [{ type: "wheel", id: "w", actions: [{ type: "scroll", x: Math.round(l.x), y: 300, deltaX: 0, deltaY: 300 }] }] }); await sleep(500);
					lk = (await probe()).links; l = lk.find((l) => l.t === arg) || lk.find((l) => l.t.includes(arg));
				}
				check(!!l, `step click "${arg}": a button is in the window`);
				if (l) { await ev("window.__hrefs.length = 0"); await send("input.performActions", { context: ctx, actions: [{ type: "pointer", id: "m", parameters: { pointerType: "mouse" }, actions: [{ type: "pointerMove", x: Math.round(l.x + 4), y: Math.round(l.y + 4) }, { type: "pointerDown", button: 0 }, { type: "pointerUp", button: 0 }] }] }); await sleep(3500); console.log("  hrefs: " + await ev("JSON.stringify(window.__hrefs)")); }
			} else if (kind === "answer") {
				let ok = false; for (let i = 0; i < 20 && !ok; i++) { ok = await ev(`(() => { const d = document.querySelector("#dialogs .dlg"); if (!d) return false; const f = d.querySelector("input,textarea"); if (f) f.value = ${JSON.stringify(arg)}; d.querySelector("button").click(); return true; })()`); if (!ok) await sleep(500); }
				check(ok, `step answer "${arg}": an input() box was open`); await sleep(3500);
			} else if (kind === "expect") { const t = (await probe()).text; check(t.includes(arg), `step expect "${arg}" in the window text`); if (!t.includes(arg)) console.log("  window text: " + t.slice(0, 400)); }
			else if (kind === "disabled") { const pr = await probe(); console.log("  buttons whose class has 'disabled': " + JSON.stringify(pr.links.filter((l) => /disabled/i.test(l.c || "")).map((l) => l.t)) + " ; all with a class: " + pr.links.length); } // disabled: = which buttons are greyed out
			else if (kind === "capture") { await probe(); const i = JSON.parse(await ev("JSON.stringify([...window.popups.windows.values()].map(x=>x.info))"))[0], r = JSON.parse(await rect())[0]; // capture:NAME = save the live window's tgui config+data as tests/tgui-fixtures/NAME.json (for tools/tgui-quick.mjs)
				if (!i.tg) console.log("FAIL capture: this window has no tgui (info.tg empty)"), bad++; else { const t = JSON.parse(i.tg); mkdirSync("tests/tgui-fixtures", { recursive: true }); writeFileSync(`tests/tgui-fixtures/${arg}.json`, JSON.stringify({ _note: "captured by ui2-tgui capture:", config: t.config, data: t.data, window: { w: Math.round(r.w), h: Math.round(r.h) }, checks: {} }, null, 1) + "\n"); console.log("  captured tests/tgui-fixtures/" + arg + ".json (interface " + t.config?.interface + ")"); } }
			else if (kind === "boxes") { await probe(); const i = JSON.parse(await ev("JSON.stringify([...window.popups.windows.values()].map(x=>x.info))"))[0]; console.log("  viewport " + i.vw + ", box widths " + JSON.stringify(i.boxes)); } // boxes: = widths of the .display / section boxes against the window width
			else if (kind === "dump") console.log("  html of " + arg + ": " + (await ev(`(() => { const w = [...window.popups.windows.values()][0]; const e = w.frame.contentDocument.querySelector(${JSON.stringify(arg)}); return e ? e.innerHTML.slice(0, 1500) : "(no such element)"; })()`)));
			else if (kind === "links") { const pr = await probe(); console.log("  links: " + JSON.stringify(pr.links.map((l) => `${l.t}@${Math.round(l.x)},${Math.round(l.y)}`)) + " text: " + pr.text); }
			else if (kind === "wait") await sleep(Number(arg));
			console.log("  popup errors: " + await ev("JSON.stringify(window.popupErrors||[])"));
		}
		console.log("game errors:\n" + ((await ev("(window.bootResult?.lines ?? []).filter((l) => /\\[vm-boot\\] (runtime|VM gap):|FATAL|dialog|tgui:|DBG|\\[page\\] (CSP|chat cleaned)/.test(l)).join('\\n')")) ?? "").slice(-3000));
		console.log("final window text: " + (await probe()).text.replace(/\s+/g, " ").slice(0, 600));
	}
	const r = await send("browsingContext.captureScreenshot", { context: ctx }); if (r.result?.data) { mkdirSync(dirname(resolve(shot)), { recursive: true }); writeFileSync(shot, Buffer.from(r.result.data, "base64")); console.log("shot " + shot); }
	if (argv.includes("--resize")) {
		const [w0] = JSON.parse(await rect());
		// steps/ms: a real mouse sends many moves per frame; the fast runs (--fast) are what exposed the lag (winset round trip to the page).
		const drag = async (x, y, dx, dy, steps = 10, ms = 30) => { await send("input.performActions", { context: ctx, actions: [{ type: "pointer", id: "m", parameters: { pointerType: "mouse" }, actions: [{ type: "pointerMove", x: Math.round(x), y: Math.round(y) }, { type: "pointerDown", button: 0 }, ...Array.from({ length: steps }, (_, i) => ({ type: "pointerMove", x: Math.round(x + dx * (i + 1) / steps), y: Math.round(y + dy * (i + 1) / steps), duration: ms })), { type: "pointerUp", button: 0 }] }] }); await sleep(800); };
		const runs = [[80, 60, 10, 30], [100, 70, 100, 0], [-60, -50, 120, 0], [200, 150, 400, 0]];
		for (const [dx, dy, steps, ms] of runs) {
			const [a] = JSON.parse(await rect());
			await drag(a.x + a.w - 12, a.y + a.h - 12, dx, dy, steps, ms);
			const [b] = JSON.parse(await rect());
			console.log(`corner drag ${dx >= 0 ? "+" : ""}${dx},${dy >= 0 ? "+" : ""}${dy} in ${steps} moves/${ms}ms: ${a.w}x${a.h} -> ${b.w}x${b.h} (grew ${b.w - a.w},${b.h - a.h})`);
			check(Math.abs(b.w - a.w - dx) < 8 && Math.abs(b.h - a.h - dy) < 8, "window followed the mouse by about the drag");
		}
		const r2 = await send("browsingContext.captureScreenshot", { context: ctx }); if (r2.result?.data) writeFileSync(shot.replace(".png", "-resized.png"), Buffer.from(r2.result.data, "base64"));
	}
} finally { ff.kill(); srv.kill(); await sleep(1000); rmSync(prof, { recursive: true, force: true }); console.log("server non-200 lines:\n" + (readFileSync(slog, "utf8").split("\n").filter((l) => /"GET [^"]*" (?:[45]\d\d)/.test(l)).join("\n") || "(none)")); }
process.exit(bad ? 1 : 0);
