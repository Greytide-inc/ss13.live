// tgui-quick - open one tgui interface in headless Firefox from a JSON fixture, no game boot (a few seconds per fixture).
// Usage (from web/): node --experimental-websocket tools/tgui-quick.mjs [--shot DIR] [--click TEXT] FIXTURE.json|NAME ...
//   NAME = tests/tgui-fixtures/NAME.json. A fixture is {config, data, window:{w,h}, checks}; config.interface picks the template.
//   Loads tgui/assets/tgui.js + tgui.css (repo copy, else web/dist) in a page the size of the window, inlines {config,data} as tgui.html does,
//   and traps tgui's `window.location.href = "byond://..."` (rewritten to window.__go, as web/worker/popups.js does) so a click's href is
//   captured, never executed. Prints window text, buttons (disabled or not), .display box widths vs the window width, image loads, page errors.
//   checks (all optional): text:[..] window text contains; disabled:[..] / enabled:[..] buttons (exact text) greyed / not greyed;
//   boxMin: fraction of window width every .display must reach (default 0.8); clicks:[{button, href|hrefPart, none:true}] (none = a click sends nothing).
//   Exit 1 if any check FAILs. Capture fixtures from a real game with tools/ui2-tgui.mjs --steps "capture:NAME".
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, existsSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url)), web = resolve(here, ".."), root = resolve(web, "..");
const argv = process.argv.slice(2), flags = {}, files = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === "--shot" || argv[i] === "--click") flags[argv[i].slice(2)] = argv[++i]; else files.push(argv[i]); }
if (!files.length) { console.error("usage: tgui-quick.mjs [--shot DIR] [--click TEXT] FIXTURE.json|NAME ..."); process.exit(2); }
const assets = [join(root, "tgui/assets"), join(web, "dist/tgui/assets")].find((d) => existsSync(join(d, "tgui.js")));
if (!assets) { console.error("no tgui/assets/tgui.js (run the tgui build)"); process.exit(2); }
const MIME = { ".js": "text/javascript", ".css": "text/css", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".svg": "image/svg+xml", ".eot": "application/vnd.ms-fontobject", ".html": "text/html" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const load = (f) => JSON.parse(readFileSync(existsSync(f) ? f : join(web, "tests/tgui-fixtures", f.replace(/\.json$/, "") + ".json"), "utf8"));
const fixtures = files.map((f) => [f, load(f)]);
let cur = null, notFound = [];
const srv = createServer((q, r) => {
	const u = q.url.split("?")[0];
	if (u === "/host.html") { const [w, h] = q.url.split("?")[1].split(","); r.writeHead(200, { "content-type": "text/html" }); return r.end(`<body style="margin:0"><iframe id="f" src="/page.html" style="width:${+w}px;height:${+h}px;border:0"></iframe>`); }
	if (u === "/page.html") {
		const fx = cur, init = JSON.stringify({ config: fx.config, data: fx.data }).replace(/</g, "\\u003c");
		let h = readFileSync(join(root, "tgui/tgui.html"), "utf8").replace("{}</script>", () => init + "</script>").replace("[ref]", fx.config.ref ?? "[0x1]").replace("[style]", fx.config.style ?? "");
		h = h.replace("<head>", "<head><script>window.__hrefs=[];window.__errs=[];Object.defineProperty(window,'__go',{set(v){window.__hrefs.push(String(v))}});addEventListener('error',(e)=>window.__errs.push(String(e.message)));</script>");
		r.writeHead(200, { "content-type": "text/html" }); return r.end(h);
	}
	let p = join(assets, decodeURIComponent(u).replace(/^\/+/, "").replace(/\.\./g, ""));
	if (!existsSync(p)) p = join(assets, "fonts", decodeURIComponent(u).replace(/^.*\//, "")); // the game maps font files by bare name (browse_rsc)
	if (!existsSync(p) || u === "/") { notFound.push(u); r.writeHead(404); return r.end(); }
	let body = readFileSync(p);
	if (u === "/tgui.js") body = Buffer.from(body.toString("utf8").replace(/window\.location\.href\s*=/g, "window.__go ="));
	r.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" }); r.end(body);
});
await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
const PORT = srv.address().port, FF = String(40000 + (process.pid % 20000)), prof = resolve(web, `build/ff-profile-q${process.pid}`);
mkdirSync(prof, { recursive: true });
const ff = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${FF}`, "--window-size=1000,900"], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } });
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const t00 = Date.now();
try {
	let ws;
	for (let i = 0; i < 100 && !ws; i++) { await sleep(150); try { const s = new WebSocket(`ws://127.0.0.1:${FF}/session`); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); ws = s; } catch {} }
	let id = 0; const pending = new Map();
	ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
	const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
	await send("session.new", { capabilities: {} });
	const ctx = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	const ev = async (expression) => { const r = await send("script.evaluate", { expression, target: { context: ctx }, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text); return r.result?.result?.value; };
	for (const [name, fx] of fixtures) {
		const t0 = Date.now(); cur = fx; notFound = []; const win = fx.window ?? { w: 420, h: 500 }, ck = fx.checks ?? {};
		console.log(`\n== ${name}: ${fx.config.interface} (${win.w}x${win.h})`);
		await send("browsingContext.navigate", { context: ctx, url: `http://127.0.0.1:${PORT}/host.html?${win.w},${win.h}`, wait: "complete" });
		let ready = false;
		for (let i = 0; i < 100 && !ready; i++) { ready = await ev(`(() => { const w = document.getElementById("f").contentWindow; return !!(w && w.tgui && w.document.querySelector(".display, ui-display, section, .notice") && w.document.body.innerText.length > 20); })()`).catch(() => false); if (!ready) await sleep(100); }
		check(ready, `the window rendered (${Date.now() - t0} ms)`);
		const F = `document.getElementById("f").contentWindow`;
		await sleep(300); // tgui animates its content in
		const info = JSON.parse(await ev(`(() => { const w = ${F}, d = w.document; return JSON.stringify({ vw: d.documentElement.clientWidth, text: d.body.innerText.replace(/\\s+/g, " "), imgs: [...d.images].map((i) => i.src.slice(-30) + " " + i.naturalWidth), boxes: [...d.querySelectorAll(".display")].map((e) => Math.round(e.getBoundingClientRect().width)), errs: w.__errs, links: [...d.querySelectorAll("a,button,[data-tgui-command],.button")].map((a) => ({ t: a.textContent.trim(), dis: /disabled/i.test(String(a.className)) })) }); })()`));
		console.log(`window text: ${info.text.slice(0, 700)}`);
		console.log(`buttons: ${info.links.map((l) => l.t + (l.dis ? " [disabled]" : "")).join(" | ")}`);
		console.log(`boxes: viewport ${info.vw}, .display widths ${JSON.stringify(info.boxes)}`);
		console.log(`images: ${JSON.stringify(info.imgs)}; not found: ${JSON.stringify(notFound.filter((u) => u !== "/favicon.ico"))}; page errors: ${JSON.stringify(info.errs)}`);
		check(info.errs.length === 0, "no page errors");
		for (const t of ck.text ?? []) check(info.text.includes(t), `window text has "${t}"`);
		for (const t of ck.disabled ?? []) check(info.links.some((l) => l.t === t && l.dis), `"${t}" is greyed out`);
		for (const t of ck.enabled ?? []) check(info.links.some((l) => l.t === t && !l.dis), `"${t}" is not greyed out`);
		const min = (ck.boxMin ?? 0.8) * info.vw;
		check(info.boxes.length === 0 || info.boxes.every((b) => b >= min), `every .display box is at least ${Math.round(min)} px of ${info.vw}`);
		const clicks = [...(ck.clicks ?? [])]; if (flags.click) clicks.push({ button: flags.click, report: true });
		for (const c of clicks) {
			const hrefs = JSON.parse(await ev(`(() => { const w = ${F}; w.__hrefs.length = 0; const a = [...w.document.querySelectorAll("a,button,[data-tgui-command],.button")].filter((a) => a.textContent.trim() === ${JSON.stringify(c.button)}); if (!a.length) return "null"; a[${c.nth ?? 0}].click(); return JSON.stringify(w.__hrefs); })()`) ?? "null");
			if (hrefs === null) { check(false, `click "${c.button}": no such button`); continue; }
			const h = decodeURIComponent(hrefs.join(" ")), sent = hrefs.map((x) => decodeURIComponent(x).replace(/^byond:\/\/\?/, "").replace(/(^|&)src=[^&]*&?/, "$1"));
			console.log(`click "${c.button}" sends: ${JSON.stringify(hrefs)}`);
			if (c.none) check(hrefs.length === 0, `click "${c.button}" sends nothing`);
			else if (c.href !== undefined) check(sent.length === 1 && sent[0] === c.href, `click "${c.button}" sends ${c.href}`);
			else if (c.hrefPart !== undefined) check(h.includes(c.hrefPart), `click "${c.button}" sends ${c.hrefPart}`);
			else if (c.report) check(hrefs.length > 0, `click "${c.button}" sent a href`);
		}
		if (flags.shot) { mkdirSync(flags.shot, { recursive: true }); const s = await send("browsingContext.captureScreenshot", { context: ctx }); if (s.result?.data) writeFileSync(join(flags.shot, name.replace(/.*\//, "").replace(/\.json$/, "") + ".png"), Buffer.from(s.result.data, "base64")); }
		console.log(`(${Date.now() - t0} ms)`);
	}
} catch (e) { console.log("FAIL tool error: " + (e.stack ?? e)); bad++; }
ff.kill(); srv.close(); try { rmSync(prof, { recursive: true, force: true }); } catch {}
console.log(`\n${bad ? "FAILED " + bad : "all ok"} (${((Date.now() - t00) / 1000).toFixed(1)} s total)`);
process.exit(bad ? 1 : 0);
