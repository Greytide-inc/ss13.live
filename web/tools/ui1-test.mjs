// Runs in headless Chromium (CDP) and in headless Firefox (WebDriver BiDi, as tools/firefox-perf.mjs): --browser chromium|firefox|both (default both).
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
const H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const which = process.argv.includes("--browser") ? process.argv[process.argv.indexOf("--browser") + 1] : "both";
let totalBad = 0;
for (const kind of ["chromium", "firefox"]) if (which === "both" || which === kind) { console.log("== " + kind); totalBad += await run(kind); }
console.log(totalBad ? `${totalBad} FAILED` : "all ok"); process.exit(totalBad ? 1 : 0);
async function run(kind) {
const port = 9335, gport = 8479 + (kind === "firefox" ? 1 : 0), ffport = 9336;
const prof = "build/ff-profile-ui1";
const srv = spawn("node", ["build/dist/src/tools/gallery-server.js"], { stdio: "ignore", env: { ...process.env, PORT: String(gport) } });
let p;
if (kind === "chromium") p = spawn(H, ["--no-sandbox", `--remote-debugging-port=${port}`, "--window-size=900,700", "about:blank"], { stdio: "ignore" });
else { mkdirSync(prof, { recursive: true }); p = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${ffport}`, "--window-size=900,700"], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } }); }
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
try {
	let ev, mouse, navigate;
	if (kind === "chromium") {
		let list;
		for (let i = 0; i < 50 && !list; i++) { await sleep(200); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {} }
		const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
		await new Promise((r) => (ws.onopen = r));
		let id = 0; const pending = new Map();
		ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
		const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
		ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
		mouse = (type, x, y) => send("Input.dispatchMouseEvent", { type, x, y, button: type === "mouseMoved" ? "none" : "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1 });
		await send("Page.enable");
		await send("Emulation.setDeviceMetricsOverride", { width: 900, height: 700, deviceScaleFactor: 1, mobile: false });
		navigate = (url) => send("Page.navigate", { url });
	} else {
		let ws;
		for (let i = 0; i < 100 && !ws; i++) { await sleep(300); try { const s = new WebSocket(`ws://127.0.0.1:${ffport}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {} }
		if (!ws) throw new Error("no BiDi connection to Firefox");
		let id = 0; const pending = new Map();
		ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
		const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
		await send("session.new", { capabilities: {} });
		const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
		await send("browsingContext.setViewport", { context: ctx, viewport: { width: 900, height: 700 } });
		ev = async (expression) => { const r = await send("script.evaluate", { expression, target: { context: ctx }, awaitPromise: true }); return r.result?.result?.value; };
		mouse = (type, x, y) => send("input.performActions", { context: ctx, actions: [{ type: "pointer", id: "m", parameters: { pointerType: "mouse" }, actions: [type === "mouseMoved" ? { type: "pointerMove", x: Math.round(x), y: Math.round(y), origin: "viewport" } : { type: type === "mousePressed" ? "pointerDown" : "pointerUp", button: 0 }] }] });
		navigate = (url) => send("browsingContext.navigate", { context: ctx, url, wait: "complete" });
	}
	await navigate(`http://127.0.0.1:${gport}/web/tests/popups/ui1.html`);
	for (let i = 0; i < 50 && !(await ev("window.ready")); i++) await sleep(200);
	await sleep(1000);
	const pos = async () => JSON.parse(await ev(`(()=>{const e=document.querySelector('.bwin');const r=e.getBoundingClientRect();return JSON.stringify([e.offsetLeft,e.offsetTop,r.width,r.height])})()`));
	// 1. drag by the header (frame-relative y 15 => page y = top + 2 border + 15)
	let [x0, y0] = await pos(); console.log("start", x0, y0);
	const sx = x0 + 60, sy = y0 + 2 + 15;
	await mouse("mouseMoved", sx, sy); await mouse("mousePressed", sx, sy);
	for (let i = 1; i <= 20; i++) { await mouse("mouseMoved", sx + 10 * i, sy + 6 * i); await sleep(8); }
	await mouse("mouseReleased", sx + 200, sy + 120); await sleep(300);
	let [x1, y1] = await pos();
	check(x1 === x0 + 200 && y1 === y0 + 120, `dragged window ended at mouse offset: ${x0},${y0} -> ${x1},${y1} (want +200,+120)`);
	check(!(await ev("window.sent.some(m=>m.type==='topic')")), "the drag's winset was not sent to the game");
	// drag far off the bottom-right: stays on the page
	const s2x = x1 + 60, s2y = y1 + 17;
	await mouse("mouseMoved", s2x, s2y); await mouse("mousePressed", s2x, s2y);
	for (let i = 1; i <= 10; i++) { await mouse("mouseMoved", s2x + 100 * i, s2y + 100 * i); await sleep(8); }
	await mouse("mouseReleased", s2x + 1000, s2y + 1000); await sleep(300);
	[x1, y1] = await pos();
	const [W, Hh] = [await ev("innerWidth"), await ev("innerHeight")], [, , pw, ph] = await pos();
	check(x1 >= 0 && y1 >= 0 && x1 + pw <= W + 4 && y1 + ph <= Hh + 4, `window kept on the page after a far drag: ${x1},${y1} size ${pw}x${ph} in ${W}x${Hh}`);
	// 2. long menu near the bottom-right
	await ev(`menu.show({ id: 1, sx: innerWidth - 20, sy: innerHeight - 10, items: Array.from({ length: 40 }, (_, i) => ({ name: "Item " + i, verbs: Array.from({ length: i % 3 ? 4 : 35 }, (_, j) => "Verb " + j) })) })`);
	const box = async (sel) => JSON.parse(await ev(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return JSON.stringify([r.left,r.top,r.right,r.bottom])})()`));
	let b = await box("#ctxmenu");
	check(b[0] >= 0 && b[1] >= 0 && b[2] <= W && b[3] <= Hh, "main menu inside the viewport " + b.map(Math.round));
	const last = await ev(`(()=>{const c=document.querySelector('#ctxmenu');c.scrollTop=1e5;const r=c.lastElementChild.getBoundingClientRect();return JSON.stringify([r.left+10,r.top+5])})()`);
	await sleep(100);
	const [lx, ly] = JSON.parse(last);
	check(ly < Hh, "after scrolling, the last row is reachable at " + Math.round(ly));
	// hover row 0 (35 verbs): submenu opens left of the menu, fits, every verb reachable by scrolling
	for (const row of [0, 38]) {
		await ev(`document.querySelector('#ctxmenu').scrollTop = ${row ? 1e5 : 0}`);
		const rr = JSON.parse(await ev(`(()=>{const r=document.querySelectorAll('#ctxmenu>.row')[${row}].getBoundingClientRect();return JSON.stringify([r.left+10,r.top+5])})()`));
		await mouse("mouseMoved", rr[0], rr[1]); await sleep(150);
		const s = JSON.parse(await ev(`(()=>{const r=document.querySelectorAll('#ctxmenu>.row')[${row}].querySelector('.sm').getBoundingClientRect();return JSON.stringify([r.left,r.top,r.right,r.bottom])})()`));
		check(s[0] >= 0 && s[1] >= 0 && s[2] <= W && s[3] <= Hh, `submenu of row ${row} inside the viewport ` + s.map(Math.round));
		check(s[2] <= b[0] + 2, `submenu of row ${row} flipped to the left of the menu`);
	}
	// click a verb in the last submenu: the pick arrives
	const v = JSON.parse(await ev(`(()=>{const sm=document.querySelectorAll('#ctxmenu>.row')[38].querySelector('.sm');sm.scrollTop=1e5;const r=sm.lastElementChild.getBoundingClientRect();return JSON.stringify([r.left+10,r.top+5])})()`));
	await sleep(50);
	await mouse("mouseMoved", v[0], v[1]); await mouse("mousePressed", v[0], v[1]); await mouse("mouseReleased", v[0], v[1]); await sleep(150);
	const pick = await ev("JSON.stringify(window.sent.filter(m=>m.type==='menupick'))");
	check(/"a":38,"v":\d+/.test(pick), "clicking the last verb of the last submenu picks it: " + pick);
} finally { p.kill(); srv.kill(); await sleep(800); if (kind === "firefox") rmSync(prof, { recursive: true, force: true }); }
return bad;
}
