// lobby-menu - tg's "New Player Options" window (playersetup) drawn as a title-screen menu over the lobby picture: plain text on the
// left, a > on the one under the mouse, the current ready choice in green (mockup E, plans/lobby-art/lobby-window-mockups.html).
// It shows only while the mouse is on the picture: the whole picture darkens to 80% black and the menu fades in (lobby-menu-fade-mockup.html);
// mouse off, the picture is clear and the menu invisible. Touch screens (no hover, finger pointer) always show it.
// The game still sends tg's window html; the page reads its links out of it, so a click is the same topic the window's link sent.
// The line under the menu is the Lobby stat tab (time to start, players), passed in by the page whenever that tab updates.

// tg's link text -> [place in the menu, what the menu says]. Links it doesn't know go after these, in tg's order.
const KNOWN = { "Join Game!": [0, "JOIN GAME"], "Ready": [1, "READY"], "Not Ready": [2, "NOT READY"], "View the Crew Manifest": [3, "CREW MANIFEST"], "Observe": [4, "OBSERVE"], "Setup Character": [5, "SETUP CHARACTER"] };
const text = (h) => h.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim();

/** playersetup html -> [{tg (tg's text), label, href, current, join}] in menu order. A <b> is tg's current ready choice (no link). */
export function menuItems(html) {
	const out = [];
	for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>|<b>([\s\S]*?)<\/b>/gi)) {
		const raw = text(m[3] ?? m[4]), k = KNOWN[raw];
		if (!raw) continue;
		out.push({ tg: raw, label: k ? k[1] : raw.toUpperCase(), href: m[4] === undefined ? m[2] : null, current: m[4] !== undefined, join: raw === "Join Game!", at: k ? k[0] : 100 + out.length });
	}
	return out.sort((a, b) => a.at - b.at);
}

/** the Lobby stat tab's [name, value] lines -> the line under the menu */
export function statLine(lines) {
	const v = Object.fromEntries(lines.map(([n, t]) => [n, t]));
	const players = v["Players:"] !== undefined ? ` · ${v["Players:"]} PLAYER${v["Players:"] === "1" ? "" : "S"}` : "";
	const left = v["Time To Start:"];
	if (left === "DELAYED") return "START DELAYED" + players;
	if (left !== undefined) { const s = parseInt(left, 10) || 0; return `STARTS IN ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` + players; }
	if (v["Map:"]) return `${String(v["Map:"]).toUpperCase()} · ROUND IN PROGRESS`;
	return "";
}

const CSS = `.lobby-menu-box{position:absolute;top:0;left:50%;transform:translateX(-50%);width:min(100cqh,100cqw);height:min(100cqh,100cqw);z-index:2;--u:calc(min(100cqh,100cqw) / 480);background:#0000;transition:background-color .45s}
.lobby-menu-box:hover{background:#000c}.lobby-menu-box:hover .lobby-menu{opacity:1}
@media (hover:none) and (pointer:coarse){.lobby-menu-box{background:#000c}.lobby-menu-box .lobby-menu{opacity:1}}
.lobby-menu{position:absolute;left:calc(22 * var(--u));top:calc(var(--menu-y,176) * var(--u));padding:.5em 1.4em .6em .7em;font:bold max(12px,calc(18 * var(--u))) "DejaVu Sans Mono",monospace;user-select:none;opacity:0;transition:opacity .45s}
.lobby-menu div{padding:.22em 0 .22em 1.1em;position:relative;cursor:pointer;color:#ccd;white-space:nowrap;text-shadow:2px 2px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000}
.lobby-menu div:hover{color:#ffd34e}.lobby-menu div:hover::before{content:">";position:absolute;left:0}
.lobby-menu div.join{color:#6f6}.lobby-menu div.join:hover{color:#ffd34e}
.lobby-menu div.cur{color:#6f6;cursor:default}.lobby-menu div.cur:hover::before{content:""}
.lobby-menu .sub:empty{display:none}.lobby-menu .sub{font-size:.67em;color:#9ab;cursor:default;margin-top:.7em}.lobby-menu .sub:hover{color:#9ab}.lobby-menu .sub:hover::before{content:""}`;

/** The menu over `host` (the map window). show(html) on each playersetup browse, hide() when it closes; stat(lines) from the Lobby tab;
 *  click(href) sends a link's topic; menuY = how far down the 480 px picture it sits. */
export function createLobbyMenu(host, click, menuY = 176) {
	let box = null, sub = null, line = "";
	const style = () => { if (document.getElementById("lobby-menu-css")) return; const s = document.createElement("style"); s.id = "lobby-menu-css"; s.textContent = CSS; document.head.append(s); };
	return {
		get shown() { return !!box; },
		get items() { return box ? [...box.querySelectorAll(".lobby-menu div:not(.sub)")].map((d) => d.textContent) : []; },
		show(html) {
			style();
			if (!box) { box = document.createElement("div"); box.className = "lobby-menu-box"; box.style.setProperty("--menu-y", menuY); host.append(box); }
			const menu = document.createElement("div"); menu.className = "lobby-menu";
			for (const it of menuItems(html)) {
				const d = document.createElement("div"); d.textContent = (it.current ? "✓ " : "") + it.label;
				if (it.current) d.className = "cur"; else if (it.join) d.className = "join";
				d.dataset.tg = it.tg; if (it.href) d.onclick = () => click(it.href);
				menu.append(d);
			}
			sub = document.createElement("div"); sub.className = "sub"; sub.textContent = line; menu.append(sub);
			box.replaceChildren(menu);
		},
		hide() { box?.remove(); box = sub = null; },
		// for the test tools (popups.probe): the menu as a window named playersetup, its links by tg's own text, at their page position
		probe() {
			if (!box) return [];
			const ds = [...box.querySelectorAll(".lobby-menu div[data-tg]")];
			return [{ name: "playersetup", text: ds.map((d) => d.textContent).join(" "), links: ds.filter((d) => d.onclick).map((d) => { const r = d.getBoundingClientRect(); return { t: d.dataset.tg, c: "lobby-menu", x: r.x + r.width / 2, y: r.y + r.height / 2 }; }) }];
		},
		stat(lines) { line = statLine(lines); if (sub) sub.textContent = line; },
	};
}
