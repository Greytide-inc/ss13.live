// Player text in chat can't run a script in the game page.
// 1. worker/index.html's CSP hashes match its inline scripts (else `node tools/csp.mjs`).
// 2. In headless Firefox and Chromium: attack strings through cleanChat (worker/chathtml.js), on a page with NO CSP, run nothing;
//    tg's own chat formatting comes out unchanged. On a page with index.html's CSP: raw innerHTML with an onerror runs nothing,
//    popup.html frames still run their inline scripts and handlers, same-origin WebSockets are allowed, other hosts aren't.
// Usage (from web/): node --experimental-websocket tests/static/csp.test.mjs
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fixCsp } from "../../tools/csp.mjs";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
let bad = 0; const check = (ok, msg) => { console.log((ok ? "ok   " : "FAIL ") + msg); if (!ok) bad++; };
const index = readFileSync(join(web, "worker/index.html"), "utf8");
check(fixCsp(index) === index, "worker/index.html CSP hashes match its inline scripts");
const cspMeta = index.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];

const ATTACKS = [
	`<img src=x onerror="hits.push('img')">`, `<script>hits.push('script')<\/script>`, `<svg><script>hits.push('svg')<\/script></svg>`,
	`<svg onload="hits.push('svgload')"></svg>`, `<iframe srcdoc="<script>parent.hits.push('iframe')<\/script>"></iframe>`,
	`<a class=go href="javascript:hits.push('js')">x</a>`, `<a class=go href=" java&#9;script:hits.push('js2')">x</a>`,
	`<details open ontoggle="hits.push('toggle')">x</details>`, `<body onload="hits.push('body')">`, `<b onmouseover="hits.push('b')" style="color:red">x</b>`,
	`<math><mi xlink:href="javascript:hits.push('math')">x</mi></math>`, `<style>*{color:red}</style>`,
	`<noscript><p title="</noscript><img src=x onerror=hits.push('mxss')>">`, `<form action="javascript:hits.push('form')"><button>x</button></form>`,
	`<object data="javascript:hits.push('obj')"></object>`, `<embed src="javascript:hits.push('embed')">`, `<base href="javascript:hits.push('base')//">`,
	`<meta http-equiv="refresh" content="0;url=javascript:hits.push('meta')">`, `<img src="data:image/svg+xml,<svg onload=hits.push(1)>">`,
	`<a class=go href="data:text/html,<script>alert(1)<\/script>">d</a>`, `<span style="position:fixed;inset:0;background:url(//example.invalid/x.png)">fake</span>`,
	`<scr<script>ipt>hits.push('nest')</scr</script>ipt>`, `<img src=x id=popups name=addOutput onerror="hits.push('id')">`,
];
const GAME = [ // tg's own chat formats: must come out exactly as a plain parse
	`<span class='game say'><span class='name'>John Smith</span> <span class='message'>says, "hi &amp; bye"</span></span>`,
	`<span class='radio'>[Common] <span class='name'>AI</span> <span class='message'>states, "x"</span></span>`,
	`<font color='red'><b>Warning</b></font>`, `<span style='color:#ff0000;font-size:2'>x</span>`, `<big><b>Big</b></big><br>`,
	`<a href='?_src_=holder;adminplayeropts=[0x2000001]'>PP</a> <a href='byond://?src=[0x2];choice=1'>x</a> <a href='#top'>t</a>`,
	`<img class='icon misc' src='data:image/png;base64,iVBORw0KGgo='> <img class='icon floor' src='data:image/gif;base64,R0lGOD'>`,
	`<h1 class='alert'>Priority Announcement</h1><br><span class='alert'>x</span><hr><center><i>y</i></center>`,
	`<table><tbody><tr><td colspan='2'>a</td></tr></tbody></table><ul><li>z</li></ul><font face='Courier' size='3'>m</font>`,
	`<a href='https://tgstation13.org/wiki/Guide'>wiki</a> <span class='prefix'>OOC:</span> <tt>t</tt>`,
];
const PLAIN = `import { cleanChat } from "/web/worker/chathtml.js";
window.hits = [];
const box = document.body.appendChild(document.createElement("div")), out = { removed: [], changed: [] };
for (const a of ${JSON.stringify(ATTACKS)}) { const d = box.appendChild(document.createElement("div")), c = cleanChat(a); out.removed.push(c.removed.length); d.append(c.frag); }
for (const a of box.querySelectorAll("a.go")) a.click();
for (const g of ${JSON.stringify(GAME)}) { const t = document.createElement("template"); t.innerHTML = g; const c = cleanChat(g), d = document.createElement("div"); d.append(c.frag);
	if (d.innerHTML !== t.innerHTML || c.removed.length) out.changed.push(g + " -> " + d.innerHTML + " (" + c.removed + ")"); }
await new Promise((r) => setTimeout(r, 800));
out.hits = hits; out.html = box.innerHTML; out.popups = typeof window.popups; window.result = out;`;
const CSP = `window.hits = []; const v = []; addEventListener("securitypolicyviolation", (e) => v.push(e.effectiveDirective + " " + e.blockedURI));
const out = {}, msgs = [];
addEventListener("message", (e) => { msgs.push(e.data); if (e.data?.popupReady) e.source.postMessage({ popupHtml: "<b>p</b><script>parent.postMessage({ran:1},'*')<\\/script><img src=x onerror=\\"parent.postMessage({ran2:1},'*')\\">" }, "*"); });
document.body.insertAdjacentHTML("beforeend", "<img src=x onerror=\\"hits.push('raw')\\">");
const f = document.createElement("iframe"); f.sandbox = "allow-scripts"; f.src = "/web/worker/popup.html"; document.body.append(f);
const s = document.createElement("iframe"); s.sandbox = "allow-scripts"; s.srcdoc = "<script>parent.postMessage({srcdocRan:1},'*')<\\/script>"; document.body.append(s);
try { new WebSocket("ws://" + location.host + "/nows"); } catch (e) { out.selfWsThrew = String(e); }
try { new WebSocket("ws://example.invalid/"); } catch (e) { out.otherWsThrew = String(e); }
await new Promise((r) => setTimeout(r, 1500));
Object.assign(out, { hits, violations: v, msgs: JSON.stringify(msgs) }); window.result = out;`;

const srv = createServer((q, r) => {
	const u = q.url.split("?")[0], page = (b) => { r.writeHead(200, { "content-type": "text/html" }); r.end(b); }, js = (b) => { r.writeHead(200, { "content-type": "text/javascript" }); r.end(b); };
	if (u === "/plain.html") return page(`<!doctype html><meta charset="utf-8"><script type="module" src="/t-plain.js"></script>`);
	if (u === "/csp.html") return page(`<!doctype html><meta charset="utf-8">${cspMeta}<script type="module" src="/t-csp.js"></script>`);
	if (u === "/t-plain.js") return js(PLAIN);
	if (u === "/t-csp.js") return js(CSP);
	if (u === "/web/worker/chathtml.js") return js(readFileSync(join(web, "worker/chathtml.js")));
	if (u === "/web/worker/popup.html") return page(readFileSync(join(web, "worker/popup.html")));
	r.writeHead(404).end();
});
await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const connect = async (url) => { for (let i = 0; i < 100; i++) { await sleep(150); try { const s = new WebSocket(await url()); await new Promise((ok, no) => { s.onopen = ok; s.onerror = no; }); return s; } catch {} } throw new Error("no browser"); };
const rpc = (ws) => { let id = 0; const pending = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } }; return (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); }); };

async function firefox() {
	const port = 40000 + (process.pid % 20000), prof = join(web, `build/ff-profile-csp${process.pid}`); mkdirSync(prof, { recursive: true });
	const p = spawn("/usr/bin/firefox", ["--headless", "--no-remote", "--profile", prof, `--remote-debugging-port=${port}`], { stdio: "ignore", env: { ...process.env, MOZ_HEADLESS: "1" } });
	const send = rpc(await connect(async () => `ws://127.0.0.1:${port}/session`));
	await send("session.new", { capabilities: {} });
	const context = (await send("browsingContext.getTree", {})).result.contexts[0].context;
	return { name: "firefox", close: () => { p.kill(); setTimeout(() => rmSync(prof, { recursive: true, force: true }), 500); },
		go: (url) => send("browsingContext.navigate", { context, url, wait: "complete" }),
		ev: async (e) => { const r = await send("script.evaluate", { expression: e, target: { context }, awaitPromise: true, serializationOptions: { maxObjectDepth: 3 } }); return r.result?.result?.type === "string" ? r.result.result.value : undefined; } };
}
async function chromium() {
	const port = 20000 + (process.pid % 20000), H = process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell";
	const p = spawn(H, ["--no-sandbox", `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
	const send = rpc(await connect(async () => (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page").webSocketDebuggerUrl));
	return { name: "chromium", close: () => p.kill(), go: (url) => send("Page.navigate", { url }),
		ev: async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value };
}
const result = async (b) => { for (let i = 0; i < 60; i++) { await sleep(100); const r = await b.ev("window.result ? JSON.stringify(window.result) : ''"); if (r) return JSON.parse(r); } return null; };
try {
	for (const make of [firefox, chromium]) {
		const b = await make();
		try {
			await b.go(base + "/plain.html"); const p = await result(b);
			if (!p) { check(false, `${b.name}: plain page gave no result`); continue; }
			check(p.hits.length === 0, `${b.name}: ${ATTACKS.length} attack strings through cleanChat, no CSP: nothing ran (${p.hits.join(",") || "none"})`);
			check(p.removed.every((n, i) => n > 0 || ATTACKS[i].startsWith("<body")), `${b.name}: every attack string had something removed (${p.removed.join(",")})`);
			const left = p.html.match(/.{0,40}(?: on\w+=|javascript:|<script|<iframe|<svg|<style|(?<![-\w])position:|url\().{0,40}/i); check(!left,`${b.name}: no handler, javascript:, script, iframe, svg, style, positioning left in the output${left ? ": " + left[0] : ""}`);
			check(p.popups === "undefined", `${b.name}: id/name attributes dropped (no window.popups clobber)`);
			check(p.changed.length === 0, `${b.name}: ${GAME.length} lines of tg's own chat formatting unchanged${p.changed.length ? ":\n      " + p.changed.join("\n      ") : ""}`);
			await b.go(base + "/csp.html"); const c = await result(b);
			if (!c) { check(false, `${b.name}: CSP page gave no result`); continue; }
			check(c.hits.length === 0 && c.violations.some((v) => v.startsWith("script-src")), `${b.name}: with the CSP, raw innerHTML onerror is blocked (violations: ${c.violations.join("; ")})`);
			check(/"ran":1/.test(c.msgs) && /"ran2":1/.test(c.msgs), `${b.name}: popup.html frame runs its inline script and handler (${c.msgs})`);
			check(!c.violations.some((v) => v.startsWith("connect-src") && v.includes("127.0.0.1")) && !c.selfWsThrew, `${b.name}: same-origin WebSocket allowed`);
			check(c.violations.some((v) => v.startsWith("connect-src") && v.includes("example.invalid")) || !!c.otherWsThrew, `${b.name}: WebSocket to another host blocked`);
			console.log(`      (${b.name}: a srcdoc frame's inline script ${/srcdocRan/.test(c.msgs) ? "ran" : "was blocked"} under the page CSP)`);
		} finally { b.close(); }
	}
} finally { srv.close(); }
console.log(bad ? `csp: ${bad} FAILED` : "csp: ok");
process.exit(bad ? 1 : 0);
