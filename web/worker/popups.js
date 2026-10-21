// browse() popups as HTML windows on the page, browse_rsc() files, and byond:// links.
// createPopups({ host, send }): host = the element windows go in; send(msg) posts to the worker.
// Returns { browse(msg), rsc(msg), link(href) }; `link` is also what the output pane's links use.
// Modelled: window=, size=WxH, can_close, can_resize, titlebar, title, on-close (via the worker), files by name.
// scripts run, in an iframe sandboxed WITHOUT allow-same-origin (the game's HTML can't touch the page or the worker).
// A bridge script injected into every popup posts links/forms/`__go=` navigations up, and receives output(msg,"win.browser:fn") calls.
// byond:// navigation from script (tgui's `window.location.href = "byond://..."`) can't be trapped in a frame, so the text
// `window.location.href =` in popup .js files and html is rewritten to `window.__go =`, a setter the bridge defines.
// Not modelled: focus/border/can_minimize/... options, `file=` option, icons passed to browse_rsc (only files).
// css url(name) and script strings like loadCSS("font-awesome.min.css") resolve to the browse_rsc'd data URLs (done by the browse that uses them, once every file sent before it has arrived).
const MIME = { css: "text/css", js: "text/javascript", png: "image/png", gif: "image/gif", jpg: "image/jpeg", jpeg: "image/jpeg", html: "text/html", svg: "image/svg+xml", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", eot: "application/vnd.ms-fontobject", ogg: "audio/ogg" };
const opts = (t) => Object.fromEntries((t ?? "").split(";").map((p) => p.trim()).filter(Boolean).map((p) => { const i = p.indexOf("="); return i < 0 ? [p, "1"] : [p.slice(0, i).trim(), p.slice(i + 1).trim()]; }));
const off = (v) => v === "0" || v === "false";

// tgui drags a window with winset pos = mouse delta + window.screenLeft/Top and keeps it on screen with screen.availWidth/Height
// (tgui/src/util/dragresize.js). In a frame those are the browser's, so the bridge reports the popup's position on the page instead
// (G, told by the page; a winset pos from this frame updates it at once, so a fast drag never works from a stale position) and the page's size.
// tgui draws <img src='batt_100.gif'> at run time, after browse() has rewritten the html, so the bridge maps a bare browse_rsc'd image name
// to its data URL itself (IM, the images known at this browse) in img.src and setAttribute("src"); no request is made for the bare name.
const BRIDGE = (g, im) => `<script>(()=>{const P=(m)=>parent.postMessage(m,"*");
const IM=${JSON.stringify(im)};const fx=(v)=>{v=String(v);return Object.prototype.hasOwnProperty.call(IM,v)?IM[v]:v};
{const sd=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src");Object.defineProperty(HTMLImageElement.prototype,"src",{get(){return sd.get.call(this)},set(v){sd.set.call(this,fx(v))},configurable:true});
const sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(k,v){if(k==="src"&&this instanceof HTMLImageElement)v=fx(v);return sa.call(this,k,v)}}
let G=${JSON.stringify(g)};
const def=(o,k,f)=>{try{Object.defineProperty(o,k,{get:f,configurable:true})}catch(e){}};
for(const k of ["screenLeft","screenX"])def(window,k,()=>G.x);for(const k of ["screenTop","screenY"])def(window,k,()=>G.y);
for(const k of ["width","availWidth"])def(screen,k,()=>G.w);for(const k of ["height","availHeight"])def(screen,k,()=>G.h);
// tgui's corner resize sends innerWidth + the mouse delta on every move. The size winset reaches the popup only after the page has applied it
// (postMessage), so with a real mouse (several moves per frame) innerWidth was stale and most of the motion was lost. Like G.x for pos: a size this
// frame has just sent is what innerWidth/innerHeight report for 400 ms (the page has applied it long before), then the real ones again.
let S=null;const ND=(k)=>Object.getOwnPropertyDescriptor(window,k);const OW=ND("innerWidth"),OH=ND("innerHeight");
const real=(d,k)=>d&&d.get?d.get.call(window):d?d.value:document.documentElement[k];
def(window,"innerWidth",()=>S&&Date.now()-S.t<400?S.w:real(OW,"clientWidth"));def(window,"innerHeight",()=>S&&Date.now()-S.t<400?S.h:real(OH,"clientHeight"));
Object.defineProperty(window,"__go",{set(v){v=String(v);const m=/^byond:\\/\\/winset\\?[^=]*\\.pos=(-?\\d+)(?:,|%2C)(-?\\d+)/i.exec(v);if(m){G.x=+m[1];G.y=+m[2]}const z=/^byond:\\/\\/winset\\?[^=]*\\.size=(\\d+)(?:,|%2C|x)(\\d+)/i.exec(v);if(z)S={w:+z[1],h:+z[2],t:Date.now()};P({href:v})}});
addEventListener("click",(e)=>{const a=e.target.closest&&e.target.closest("a[href]");if(!a)return;const h=a.getAttribute("href");e.preventDefault();if(h[0]==="#"){const t=h.length>1&&document.getElementById(h.slice(1));if(t)t.scrollIntoView();return}P({href:h})},true);
const sub=(f)=>{const b=f.getAttribute("action")||"?";const q=[...new FormData(f)].map(([k,v])=>encodeURIComponent(k)+"="+encodeURIComponent(v)).join(";");P({href:b.split("?")[0]+"?"+q,kb:1})};
addEventListener("submit",(e)=>{e.preventDefault();sub(e.target)},true);
HTMLFormElement.prototype.submit=function(){sub(this)};
addEventListener("error",(e)=>P({err:(e.message||"load failed "+(e.target.src||e.target.href))+" @"+e.lineno+":"+e.colno}),true);
const info=()=>P({info:{tg:(()=>{try{return window.tgui?JSON.stringify({config:window.tgui.get("config"),data:window.tgui.get("data")}):null}catch(e){return null}})(),imgs:[...document.images].map((i)=>i.src.slice(0,22)+" "+i.naturalWidth),vw:document.documentElement.clientWidth,boxes:[...document.querySelectorAll(".display,section .content")].map((e)=>Math.round(e.getBoundingClientRect().width)),text:document.body?document.body.innerText:"",links:[...document.querySelectorAll("a,button,[data-tgui-command],.button")].map((a)=>{const r=a.getBoundingClientRect();return{t:a.textContent.trim(),c:String(a.className),x:r.x+r.width/2,y:r.y+r.height/2}})}});
let lt=null;const tt=()=>{if(document.title!==lt)P({title:lt=document.title})};setInterval(tt,300);
addEventListener("message",(e)=>{const d=e.data;if(!d||e.source!==parent)return;if(d.geo){G=d.geo}else if(d.fn){const f=window[d.fn];if(typeof f==="function")f(...(d.args||[d.arg]))}else if(d.q)info()});
})()<\/script>`;
const noNav = (t) => t.replace(/window\.location\.href\s*=(?!=)/g, "window.__go=");

export function createPopups({ host, send }) {
	const waiters = [];
	const raw = new Map(); // css/js files waiting for bake(): name -> text
	const dataUrl = (body, ext) => new Promise((ok, no) => { const f = new FileReader(); f.onload = () => ok(f.result); f.onerror = no; f.readAsDataURL(new Blob([body], { type: MIME[ext] ?? "" })); });
	// a stylesheet or script becomes a data URL only when a browse() uses it (bake), together with the files it names, never earlier:
	// browse_rsc files arrive a tick or more apart, and baking tgui.js at some unrelated browse between it and font-awesome.min.css left
	// loadCSS("font-awesome.min.css") a plain relative URL (404 at the site root). Stylesheet: url(font) -> data URL. Script: "x.css" -> data URL.
	const bake = async (name) => {
		const t = raw.get(name); if (t === undefined || rscUrl.get(name)) return;
		raw.delete(name); // (a cycle finds nothing left to bake)
		const deps = name.endsWith(".css") ? [...t.matchAll(/url\(\s*(["']?)([^"')?#]+)[^"')]*\1\s*\)/g)].map((m) => m[2].split("/").pop()) : [...t.matchAll(/(["'])([\w.-]+\.css)\1/g)].map((m) => m[2]);
		for (const d of deps) await bake(d);
		let o = t;
		if (name.endsWith(".css")) o = t.replace(/url\(\s*(["']?)([^"')?#]+)[^"')]*\1\s*\)/g, (all, q, v) => { const u = rscUrl.get(v.split("/").pop()); return u ? `url(${u})` : all; });
		else o = noNav(t).replace(/(["'])([\w.-]+\.css)\1/g, (all, q, v) => { const u = rscUrl.get(v); return u ? q + u + q : all; });
		rscUrl.set(name, await dataUrl(o, name.split(".").pop()));
	};
	const rscUrl = new Map(), pending = new Set(), wins = new Map();
	let queue = Promise.resolve(), z = 1, n = 0;
	const fetchFile = async (path) => { const r = await fetch("/" + path.replace(/\\/g, "/")); if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`); return r; };

	// where the popup is on the page (the space winset pos uses) and the page's size, as the frame's screenLeft/Top/availWidth report it.
	const geo = (w) => ({ x: w.el.offsetLeft, y: w.el.offsetTop, w: host.clientWidth || innerWidth, h: host.clientHeight || innerHeight });
	const tell = (w) => w.frame.contentWindow?.postMessage({ geo: geo(w) }, "*");
	addEventListener("resize", () => wins.forEach(tell));
	// A winset from a popup that only moves/resizes popups (tgui's title-bar drag and corner resize) is applied here at once, not sent
	// to the game: the round trip through the VM's tick is what made tgui windows lag and shake. Returns true when handled.
	const localWinset = (href) => {
		const m = /^byond:\/\/winset\?(.*)$/i.exec(href); if (!m) return false;
		const q = [...new URLSearchParams(m[1])];
		if (!q.length || !q.every(([k]) => /^[^.]+\.(pos|size)$/.test(k) && wins.has(k.split(".")[0]))) return false;
		for (const [k, v] of q) winset(null, k + "=" + v, true);
		return true;
	};
	// A click/submit in a popup or the output pane: hash links stay local, http(s) opens a tab, everything else is a topic.
	const link = (href) => {
		if (/^https?:/i.test(href)) window.open(href, "_blank", "noopener");
		else if (/^(byond:\/\/|\?)/i.test(href)) send({ type: "topic", href });
	};
	const pngWait = new Map();
	const rscPng = async (m) => { rscUrl.set(m.name, await dataUrl(m.png, "png")); (pngWait.get(m.name) ?? []).splice(0).forEach((ok) => ok()); };
	const rsc = (m) => {
		if (typeof m.file !== "string") return; // not a file or icon: not modelled
		const name = m.name ?? m.file.split(/[\\/]/).pop();
		if (m.pendingPng) { // a runtime icon (character preview): the next browse waits until its PNG arrives (rscPng), and it replaces any earlier one of that name
			const p = new Promise((ok) => (pngWait.get(name)?.push(ok) ?? pngWait.set(name, [ok])));
			pending.add(p); p.finally(() => pending.delete(p));
			return;
		}
		if (rscUrl.has(name)) return; // once per name
		rscUrl.set(name, null);
		const ext = name.split(".").pop().toLowerCase();
		const p = fetchFile(m.file).then(async (r) => { // data: URLs, not blob: (a null-origin frame can't load the page's blob: URLs)
			if (ext === "css" || ext === "js") { raw.set(name, await r.text()); return; } // built into a data URL by bake()
			rscUrl.set(name, await dataUrl(await r.arrayBuffer(), ext));
		}).catch((e) => { rscUrl.delete(name); console.warn("browse_rsc", e.message); }).finally(() => pending.delete(p));
		pending.add(p);
	};
	const rewrite = (html) => html.replace(/\b(src|href)\s*=\s*(["']?)([^"'\s>]+)\2/gi, (all, a, q, v) => rscUrl.get(v) ? `${a}=${q || '"'}${rscUrl.get(v)}${q || '"'}` : all);

	// the bar's height while it shows. winset size (and tgui's corner resize, which sends innerHeight + the mouse delta) is the page area's size:
	// counting a hidden bar added 20 px per mouse move and the window ran away downward.
	const barH = (w) => { const b = w.el.querySelector(".bbar"); return b && b.style.display !== "none" ? 20 : 0; };
	const close = (name, notify) => {
		const w = wins.get(name);
		if (!w) return;
		w.el.remove(); wins.delete(name);
		if (notify) send({ type: "winclose", name });
	};
	// A window never exceeds the page area and always keeps its title bar (the top edge) and left/right edges on it.
	const clamp = (w) => {
		const el = w.el, HW = host.clientWidth || innerWidth, HH = host.clientHeight || innerHeight;
		if (!HW || !HH) return;
		if (el.offsetWidth > HW) el.style.width = HW + "px";
		if (el.offsetHeight > HH) el.style.height = HH + "px";
		const x = Math.max(0, Math.min(el.offsetLeft, HW - el.offsetWidth)), y = Math.max(0, Math.min(el.offsetTop, HH - el.offsetHeight));
		if (x !== el.offsetLeft) el.style.left = x + "px";
		if (y !== el.offsetTop) el.style.top = y + "px";
	};
	// A frame for a popup's html. Not-first pages of an open window load in a second, hidden frame (w.next) and take over when written, so a
	// refresh never shows the blank page between (the flicker); the first page of a window loads in the frame that is already showing.
	const newFrame = () => { const f = document.createElement("iframe"); f.sandbox = "allow-scripts"; return f; }; // scripts, but a null origin: talks to us only through the bridge's postMessage
	const swap = (w) => {
		const nf = w.next; if (!nf) return;
		clearTimeout(w.swapTimer); w.next = null;
		nf.style.cssText = ""; w.frame.remove(); w.frame = nf; tell(w);
	};
	const make = (name, o) => {
		const [W, H] = (o.size ?? "400x300").split("x").map(Number);
		const el = document.createElement("div"); el.className = "bwin"; el.dataset.window = name;
		el.style.cssText = `width:${W || 400}px;height:${(H || 300) + (off(o.titlebar) ? 0 : 20)}px;left:${Math.max(0, 60 + 30 * (n % 8))}px;top:${Math.max(0, 40 + 30 * (n++ % 8))}px;max-width:100%;max-height:100%;z-index:${z++};${off(o.can_resize) ? "" : "resize:both"}`;
		let fixedTitle = false;
		const frame = newFrame();
		if (!off(o.titlebar)) {
			const bar = document.createElement("div"); bar.className = "bbar";
			const t = document.createElement("span"); t.textContent = o.title ?? (/^browser_\[0x/.test(name) ? "" : name); bar.append(t); fixedTitle = !!o.title;
			if (!off(o.can_close)) { const x = document.createElement("button"); x.textContent = "x"; x.title = "Close"; x.onclick = () => close(name, true); bar.append(x); }
			bar.onpointerdown = (e) => { // drag by the bar
				if (e.target.tagName === "BUTTON") return;
				el.style.zIndex = z++; w.frame.style.pointerEvents = "none";
				const dx = e.clientX - el.offsetLeft, dy = e.clientY - el.offsetTop;
				const move = (ev) => { el.style.left = ev.clientX - dx + "px"; el.style.top = ev.clientY - dy + "px"; clamp(w); tell(w); };
				const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); w.frame.style.pointerEvents = ""; };
				addEventListener("pointermove", move); addEventListener("pointerup", up);
			};
			el.append(bar);
		}
		el.append(frame); host.append(el);
		const w = { el, frame, name, fixedTitle }; wins.set(name, w); clamp(w); return w;
	};
	const images = () => Object.fromEntries([...rscUrl].filter(([k, u]) => u && /\.(gif|png|jpe?g)$/i.test(k) && u.length < 200000));
	// One browse at a time, in order: the files it names may still be loading.
	const browse = (m) => { queue = queue.then(async () => {
		if (m.embedded) return; // the skin's own browser controls aren't drawn (the output pane stands in for goonchat)
		if (m.html === null) return close(m.window, false);
		while (pending.size) await Promise.all([...pending]);
		const o = opts(m.options);
		let html = m.html;
		if (html === undefined) html = await (await fetchFile(m.file)).text();
		for (const x of html.matchAll(/\b(src|href)\s*=\s*(["']?)([^"'\s>]+)\2/gi)) await bake(x[3]);
		html = noNav(rewrite(html));
		html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (h) => h + "\0BRIDGE\0") : "\0BRIDGE\0" + html;
		const w = wins.get(m.window) ?? make(m.window, o);
		// tsh-chat: the frame loads popup.html (next to the page), which asks for this html once it's up; a srcdoc frame would get the page's CSP
		const doc = html.replace("\0BRIDGE\0", () => BRIDGE(geo(w), images()));
		const url = new URL("popup.html", document.baseURI).href;
		if (!w.shown) { w.doc = doc; w.frame.src = url; return; } // nothing on screen yet: load in the frame itself
		if (w.next) { clearTimeout(w.swapTimer); w.next.remove(); } // a newer page replaces one still loading
		const nf = w.next = newFrame(); nf.doc = doc;
		nf.style.cssText = `position:absolute;visibility:hidden;left:0;right:0;bottom:0;top:${barH(w)}px;width:100%;height:auto`;
		w.el.append(nf); nf.src = url;
		w.swapTimer = setTimeout(() => swap(w), 1500); // a page that never reports in still takes over
	}).catch((e) => console.warn("browse", e.message)); };
	addEventListener("message", (e) => {
		const w = [...wins.values()].find((w) => w.frame.contentWindow === e.source || w.next?.contentWindow === e.source), d = e.data;
		if (!w || !d) return;
		const loading = w.next?.contentWindow === e.source ? w.next : null; // the hidden frame of a refresh
		if (d.popupReady) e.source.postMessage({ popupHtml: (loading ?? w).doc ?? "" }, "*");
		else if (d.popupWritten) { w.shown = true; if (loading) { loading.onload = () => swap(w); clearTimeout(w.swapTimer); w.swapTimer = setTimeout(() => swap(w), 300); } } // (the html is in; its images and scripts are still coming: swap on load)
		else if (typeof d.href === "string") {
			// a click on a link/button leaves keyboard focus inside the popup's iframe, whose keydowns never reach the page's key handler
			// (WASD dead until a click elsewhere). Hand focus back to the page; a form submit (kb) is typing, so it keeps focus.
			if (!d.kb && document.activeElement === w.frame) { w.frame.blur(); window.focus(); }
			if (!localWinset(d.href)) link(d.href);
		}
		else if (typeof d.title === "string") { // the page's <title> is the window title (html_interface sets it that way, use-title=true), unless browse() gave title=
			const t = w.el.querySelector(".bbar span"); if (t && !w.fixedTitle && d.title) t.textContent = d.title;
		}
		else if (d.err) (window.popupErrors ??= []).push(w.name + ": " + d.err);
		else if (d.info) { w.info = d.info; waiters.splice(0).forEach((f) => f()); }
	});
	// output(msg, "win.browser:fn") / output(msg, "win:fn"): call fn(arg) in that popup. BYOND url-decodes the argument.
	const output = (control, text) => {
		const m = /^([^.:]+)(?:\.[^:]*)?:(\w+)$/.exec(control), w = m && wins.get(m[1]);
		if (!w) return;
		// the text is a param string: "a&b" calls fn(a, b) (list2params(list(id, html)) is how html_interface sends two)
		const args = text.split("&").map((a) => { try { return decodeURIComponent(a.replace(/\+/g, " ")); } catch { return a; } });
		w.frame.contentWindow.postMessage({ fn: m[2], args }, "*");
	};
	// winset on a popup: "win.key=v;..." (id null) or id + "key=v;...". Cheap keys only: size, pos, is-visible, titlebar, can-resize.
	const winset = (id, params, fromFrame) => {
		for (const p of params.split(";")) {
			const i = p.indexOf("="); if (i < 0) continue;
			let k = p.slice(0, i).trim(), v = p.slice(i + 1).trim().replace(/^"|"$/g, ""), name = id;
			if (name === null || name === "") { const j = k.indexOf("."); if (j < 0) continue; name = k.slice(0, j); k = k.slice(j + 1); }
			const w = wins.get(name); if (!w) continue;
			if (k === "parent" && v === "none") close(name, false); // a cloned window let go (html_interface hide)
			else if (k === "is-visible") w.el.style.display = off(v) ? "none" : "";
			else if (k === "size") { const [W, H] = v.split(/[x,]/).map(Number); if (W && H) { w.el.style.width = W + "px"; w.el.style.height = H + barH(w) + "px"; clamp(w); if (!fromFrame) tell(w); } }
			else if (k === "pos") { const [x, y] = v.split(",").map(Number); if (!isNaN(x) && !isNaN(y)) { w.el.style.left = x + "px"; w.el.style.top = y + "px"; clamp(w); if (!fromFrame) tell(w); } }
			else if (k === "titlebar") { const b = w.el.querySelector(".bbar"); if (b && (b.style.display === "none") === !off(v)) { const h = w.el.offsetHeight - 4 + (off(v) ? -20 : 20); b.style.display = off(v) ? "none" : ""; w.el.style.height = h + "px"; } } // the page area keeps its size (the bar is the 20 px extra)
			else if (k === "can-resize") w.el.style.resize = off(v) ? "none" : "both";
		}
	};
	// For the test driver: ask every popup for its text and links (positions are relative to the frame), then add the frame's page offset.
	const probe = async () => {
		const ps = [...wins.values()]; if (!ps.length) return [];
		for (const w of ps) w.info = null;
		const got = new Promise((r) => { const t = setInterval(() => ps.every((w) => w.info) && (clearInterval(t), r()), 50); setTimeout(() => (clearInterval(t), r()), 2000); });
		ps.forEach((w) => w.frame.contentWindow.postMessage({ q: 1 }, "*"));
		await got;
		return ps.map((w) => { const o = w.frame.getBoundingClientRect(); return { name: w.name, text: (w.info?.text ?? "").replace(/\s+/g, " ").slice(0, 300), links: (w.info?.links ?? []).map((l) => ({ t: l.t, c: l.c, x: o.x + l.x, y: o.y + l.y })) }; });
	};
	// the world rebooted; BYOND closes a client's browse() windows when it reconnects. The worker is gone, so no winclose.
	const closeAll = () => { for (const name of [...wins.keys()]) close(name, false); };
	return { browse, rsc, rscPng, link, output, winset, probe, closeAll, windows: wins };
}
