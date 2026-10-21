// the window's menu bar, from interface/skin.dmf's `menu "menu"` (File, Help, ...). parseMenu is pure (tests/static/menubar.test.mjs).
// "&X" in a name = access key (underlined); text after a literal \t = right-aligned shortcut label; an empty name = separator;
// can-check items keep their check (saved in localStorage like BYOND's saved-params "is-checked"; group = radio set).

const unq = (s) => { // a DMF quoted string's body -> text (\t, \n, \\, \")
	let o = "";
	for (let i = 0; i < s.length; i++) {
		if (s[i] === "\\" && i + 1 < s.length) { const c = s[++i]; o += c === "t" ? "\t" : c === "n" ? "\n" : c; } else o += s[i];
	}
	return o;
};

/** Every elem of `menu "<menuName>"` in skin.dmf text, in order: {id, name, command, category, canCheck, checked, group, disabled}. */
export function parseMenu(dmf, menuName = "menu") {
	const lines = dmf.split(/\r?\n/), out = [];
	let i = lines.findIndex((l) => l.trim() === `menu "${menuName}"` && !/^\s/.test(l));
	if (i < 0) return out;
	let cur = null;
	for (i++; i < lines.length; i++) {
		const l = lines[i];
		if (l && !/^\s/.test(l)) break; // next top-level block
		let m = /^\s*elem\s*(?:"([^"]*)")?\s*$/.exec(l);
		if (m) { out.push((cur = { id: m[1] ?? "", name: "", command: "", category: "", canCheck: false, checked: false, group: "", disabled: false })); continue; }
		m = /^\s*([a-z-]+)\s*=\s*(.*?)\s*$/.exec(l);
		if (!m || !cur) continue;
		const [, k, raw] = m, v = raw.startsWith('"') ? unq(raw.slice(1, raw.lastIndexOf('"'))) : raw;
		if (k === "name") cur.name = v; else if (k === "command") cur.command = v; else if (k === "category") cur.category = v;
		else if (k === "group") cur.group = v; else if (k === "can-check") cur.canCheck = v === "true";
		else if (k === "is-checked") cur.checked = v === "true"; else if (k === "is-disabled") cur.disabled = v === "true";
	}
	return out;
}

/** Splits "&Save as...\tShift+F2" -> {text, key (access key letter or ""), at (index of the underlined letter in text), shortcut}. */
export function splitLabel(name) {
	const [lab, shortcut = ""] = name.split("\t");
	let text = "", key = "", at = -1;
	for (let i = 0; i < lab.length; i++) {
		if (lab[i] === "&" && i + 1 < lab.length) { if (lab[i + 1] === "&") { text += "&"; i++; } else if (at < 0) { at = text.length; key = lab[i + 1].toLowerCase(); } continue; }
		text += lab[i];
	}
	return { text, key, at, shortcut };
}

/** The elems as a tree: [{...elem, label, children}] for the top-level menus (category ""); an empty name is a separator. */
export function menuTree(elems) {
	const node = (e) => ({ ...e, ...splitLabel(e.name), sep: e.name === "", children: [] });
	const nodes = elems.map(node), byName = new Map();
	for (const n of nodes) if (!n.sep && !byName.has(n.name)) byName.set(n.name, n);
	const top = [];
	for (const n of nodes) { if (n.category === "") top.push(n); else byName.get(n.category)?.children.push(n); }
	return top;
}

const store = (k, v) => { try { v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch {} };
const load = (k) => { try { return localStorage.getItem(k); } catch { return null; } };

/**
 * createMenubar({ bar, tree, run(command), info(command) -> null | {disabled, title} })
 * `run` gets an item's command (the page sends it as the input bar would); `info` marks commands that can't work in a browser.
 */
export function createMenubar({ bar, tree, run, info = () => null }) {
	let open = null; // the top-level node whose dropdown is showing
	const tops = new Map(), drops = new Map();
	const label = (n) => { const s = document.createElement("span"); s.className = "lab"; if (n.at < 0) s.textContent = n.text; else { s.append(n.text.slice(0, n.at)); const u = document.createElement("u"); u.textContent = n.text[n.at]; s.append(u, n.text.slice(n.at + 1)); } return s; };
	const ckey = (n) => "ss13.menu.check." + (n.id || n.name);
	for (const n of tree) if (n.canCheck) { const v = load(ckey(n)); if (v !== null) n.checked = v === "1"; }
	const check = (n, siblings) => {
		if (n.group) for (const o of siblings) if (o !== n && o.group === n.group && o.checked) { o.checked = false; store(ckey(o), "0"); }
		n.checked = n.group ? true : !n.checked; store(ckey(n), n.checked ? "1" : "0");
	};
	const close = () => { if (!open) return; drops.get(open)?.remove(); tops.get(open)?.classList.remove("on"); open = null; };
	const dropdown = (n) => {
		const d = document.createElement("div"); d.className = "mdrop";
		const rows = [];
		for (const c of n.children) {
			if (c.sep) { const s = document.createElement("div"); s.className = "msep"; d.append(s); continue; }
			if (c.canCheck && load(ckey(c)) !== null) c.checked = load(ckey(c)) === "1";
			const r = document.createElement("div"), inf = c.children.length ? null : info(c.command);
			r.className = "mrow"; r.dataset.key = c.key;
			const ck = document.createElement("span"); ck.className = "chk"; ck.textContent = c.checked ? "✓" : "";
			const sc = document.createElement("span"); sc.className = "sc"; sc.textContent = c.shortcut;
			r.append(ck, label(c), sc);
			if (c.disabled || inf?.disabled) { r.classList.add("off"); if (inf?.title) r.title = inf.title; }
			else r.onclick = (e) => { e.stopPropagation(); if (c.canCheck) check(c, n.children); close(); if (c.command) run(c.command); };
			rows.push([r, c]); d.append(r);
		}
		d.addEventListener("keydown", () => {});
		return d;
	};
	const show = (n) => {
		if (open === n) return;
		close();
		if (!n.children.length) return;
		const d = dropdown(n), t = tops.get(n);
		t.classList.add("on"); open = n; drops.set(n, d);
		d.style.left = t.offsetLeft + "px"; bar.append(d);
	};
	for (const n of tree) {
		const t = document.createElement("div"); t.className = "mtop"; t.append(label(n));
		t.onmousedown = (e) => { e.preventDefault(); if (open === n) close(); else show(n); };
		t.onmouseenter = () => { if (open && open !== n) show(n); };
		if (n.disabled) t.classList.add("off");
		tops.set(n, t); bar.append(t);
	}
	addEventListener("mousedown", (e) => { if (open && !bar.contains(e.target)) close(); }, true);
	addEventListener("blur", close);
	// Keys: Alt+letter opens that menu; while one is open, a letter picks the item with that access key, Up/Down/Enter walk it, Left/Right switch menus, Escape closes.
	let cursor = -1;
	const rowsOf = () => [...(drops.get(open)?.querySelectorAll(".mrow:not(.off)") ?? [])];
	const mark = (rows) => rows.forEach((r, i) => r.classList.toggle("hot", i === cursor));
	addEventListener("keydown", (e) => {
		if (!open) {
			if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key.length === 1) {
				const n = tree.find((x) => x.key && x.key === e.key.toLowerCase());
				if (n) { e.preventDefault(); e.stopImmediatePropagation(); cursor = -1; show(n); }
			}
			return;
		}
		const rows = rowsOf(), idx = tree.indexOf(open);
		let used = true;
		if (e.key === "Escape") close();
		else if (e.key === "ArrowDown") { cursor = (cursor + 1) % rows.length; mark(rows); }
		else if (e.key === "ArrowUp") { cursor = (cursor - 1 + rows.length) % rows.length; mark(rows); }
		else if (e.key === "ArrowRight" || e.key === "ArrowLeft") { cursor = -1; show(tree[(idx + (e.key === "ArrowRight" ? 1 : tree.length - 1)) % tree.length]); }
		else if (e.key === "Enter") rows[cursor]?.click();
		else if (e.key.length === 1 && !e.ctrlKey) rows.find((r) => r.dataset.key === e.key.toLowerCase())?.click();
		else used = false;
		if (used) { e.preventDefault(); e.stopImmediatePropagation(); }
	}, true);
	// the game's winset(client, "<elem id>", "is-checked=true") sets an item's check (Help > Show screentips: the saved preference decides it at login)
	const winset = (id, params) => {
		const item = tree.flatMap((n) => n.children).find((c) => c.id && c.id === id);
		if (!item) return false;
		for (const p of String(params).split(";")) {
			const [k, v] = p.split("=").map((x) => x.trim().replace(/^"|"$/g, ""));
			if (k === "is-checked" && item.canCheck) { item.checked = v === "true"; store(ckey(item), item.checked ? "1" : "0"); }
			else if (k === "is-disabled") item.disabled = v === "true";
		}
		return true;
	};
	return { winset, close, isOpen: () => open !== null, openMenu: (name) => { const n = tree.find((x) => x.text === name); if (n) show(n); } };
}

/** Download the map canvas as a PNG (menu: Quick screenshot / Save screenshot as). The map is a WebGL canvas that clears after
 *  each frame, so the copy is taken inside an animation frame right after the page's own redraw. */
export function screenshot(host, say) {
	const real = window.requestAnimationFrame.bind(window);
	let tries = 0;
	const grab = () => {
		const c = host.querySelector("canvas");
		if (!c || !c.width) return say("Screenshot: nothing is drawn yet.");
		const copy = document.createElement("canvas"); copy.width = c.width; copy.height = c.height;
		const g = copy.getContext("2d", { willReadFrequently: true });
		g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height); g.drawImage(c, 0, 0);
		const px = g.getImageData(0, 0, c.width, c.height).data; let lit = 0;
		for (let i = 0; i < px.length; i += 4 * 97) if (px[i] || px[i + 1] || px[i + 2]) lit++;
		if (!lit && ++tries < 40) return real(() => real(grab));
		const d = new Date(), p = (n) => String(n).padStart(2, "0");
		copy.toBlob((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `screenshot-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }, "image/png");
	};
	// run after the page's own rAF callbacks of the next frame (they redraw the map)
	real(() => real(grab));
}
