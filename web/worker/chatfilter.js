// chat filters and highlights for the output pane, and the Game settings (sight shadows, theme). Pure functions (classify, parseWords, matchWords) plus createChatFilter(pane).
// Categories come from the span classes tg 2017 puts in its chat lines; a line that matches nothing is never hidden.
export const CATEGORIES = [
	{ id: "combat", label: "Combat", classes: ["userdanger", "danger", "attack", "disarm", "passive", "boldwarning"] },
	{ id: "radio", label: "Radio", classes: ["radio", "sciradio", "comradio", "secradio", "medradio", "engradio", "suppradio", "servradio", "syndradio", "centcomradio", "aiprivradio", "redteamradio", "blueteamradio"] },
	{ id: "speech", label: "Speech", classes: ["say", "yell"] },
	{ id: "ooc", label: "OOC", classes: ["ooc", "adminooc", "adminobserverooc"] },
	{ id: "dead", label: "Deadchat", classes: ["deadsay"] },
	{ id: "info", label: "Info", classes: ["notice", "info", "boldnotice", "adminnotice", "announce", "boldannounce"] },
];
// Priority order: a radio line is also "game say", a combat line may also hold a notice span.
const ORDER = ["ooc", "dead", "radio", "combat", "speech", "info"];
const CLASS_TO_CAT = new Map();
for (const c of CATEGORIES) for (const k of c.classes) CLASS_TO_CAT.set(k, c.id);
const RANK = new Map(ORDER.map((id, i) => [id, i]));
const CLASS_ATTR = /class\s*=\s*(?:'([^']*)'|"([^"]*)")/gi;

// html -> category id, or "" when nothing matches.
export function classify(html) {
	let best = "", bestRank = 99;
	CLASS_ATTR.lastIndex = 0;
	let m;
	while ((m = CLASS_ATTR.exec(html))) {
		for (const k of (m[1] ?? m[2]).split(/\s+/)) {
			const cat = CLASS_TO_CAT.get(k);
			if (cat !== undefined && RANK.get(cat) < bestRank) { best = cat; bestRank = RANK.get(cat); }
		}
	}
	return best;
}
// "Foo, bar baz ,," -> ["foo", "bar baz"]
export const parseWords = (s) => String(s).split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
export const matchWords = (text, words) => { if (!words.length) return false; const t = text.toLowerCase(); return words.some((w) => t.includes(w)); };
const stripTags = (html) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const KEY = "ss13.chatfilter";
const CSS = `#infowindow{position:relative}
#cf-btn{position:absolute;top:2px;right:18px;z-index:5;font:13px sans-serif;line-height:1;padding:1px 4px;border:1px solid #888;background:#eeeeeeee;cursor:pointer;opacity:.75}#cf-btn:hover{opacity:1}
#cf-panel{position:absolute;top:22px;right:18px;z-index:6;width:200px;background:#f4f4f4;border:1px solid #666;box-shadow:2px 2px 6px #0006;padding:6px 8px;font:12px sans-serif;color:#000}
#cf-panel[hidden]{display:none}#cf-panel b{display:block;margin:4px 0 2px}#cf-panel label{display:block;cursor:pointer}#cf-panel input[type=text]{width:100%;box-sizing:border-box}
.cf-hl{background:#fff176}
${CATEGORIES.map((c) => `.cf-hide-${c.id} .cf-${c.id}{display:none}`).join("\n")}`;

// Wire up the pane: returns { tag(div, html), setWords, setShown }. tag() is the only per-line cost.
export function createChatFilter(pane, storage = globalThis.localStorage) {
	let state = { hidden: [], words: "" };
	try { state = { ...state, ...JSON.parse(storage.getItem(KEY) ?? "{}") }; } catch {}
	let words = parseWords(state.words);
	const save = () => { try { storage.setItem(KEY, JSON.stringify(state)); } catch {} };
	const applyHidden = () => { for (const c of CATEGORIES) pane.classList.toggle("cf-hide-" + c.id, state.hidden.includes(c.id)); };
	const tag = (div, html) => {
		const cat = classify(html);
		if (cat) div.classList.add("cf-" + cat);
		if (words.length && matchWords(stripTags(html), words)) div.classList.add("cf-hl");
	};
	const rehighlight = () => { for (const d of pane.children) d.classList.toggle("cf-hl", words.length > 0 && matchWords(d.textContent, words)); };
	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.append(style);
	applyHidden();
	const btn = document.createElement("button");
	btn.id = "cf-btn"; btn.textContent = "⚙"; btn.title = "Chat filters, highlights and game settings";
	const panel = document.createElement("div");
	panel.id = "cf-panel"; panel.hidden = true;
	panel.innerHTML = "<b>Show</b>" + CATEGORIES.map((c) => `<label><input type="checkbox" data-cat="${c.id}"> ${c.label}</label>`).join("") + '<b>Highlight words (comma separated)</b><input type="text" id="cf-words" autocomplete="off" spellcheck="false">'
		+ '<b>Game</b><label>Sight shadows <select id="cf-shadows"><option value="tg">tg (black squares)</option><option value="smooth">smoothed tg</option><option value="full">cast shadows</option></select></label>'
		+ '<label>Theme <select id="cf-theme"><option value="light">light (tg)</option><option value="dark">dark</option></select></label>';
	for (const cb of panel.querySelectorAll("input[data-cat]")) {
		cb.checked = !state.hidden.includes(cb.dataset.cat);
		cb.addEventListener("change", () => {
			state.hidden = CATEGORIES.map((c) => c.id).filter((id) => id === cb.dataset.cat ? !cb.checked : state.hidden.includes(id));
			applyHidden(); save();
			pane.scrollTop = pane.scrollHeight;
		});
	}
	const wi = panel.querySelector("#cf-words");
	wi.value = state.words;
	wi.addEventListener("input", () => { state.words = wi.value; words = parseWords(wi.value); rehighlight(); save(); });
	// the sight shadow look (render/sight-shadow.ts ShadowMode), read by the map drawing (client-scene.ts) at once
	const sh = panel.querySelector("#cf-shadows");
	try { sh.value = storage.getItem("ss13-shadows") ?? "tg"; } catch {}
	if (!sh.value) sh.value = "tg";
	sh.addEventListener("change", () => { try { storage.setItem("ss13-shadows", sh.value); } catch {} dispatchEvent(new Event("ss13-shadows")); sh.blur(); }); // blur: a focused select takes WASD (S picks "smoothed tg")
	// the page theme: dark = .dark on <html>, the colours are in output.css
	const th = panel.querySelector("#cf-theme");
	try { th.value = storage.getItem("ss13-theme") ?? "light"; } catch {}
	if (!th.value) th.value = "light";
	const applyTheme = () => document.documentElement.classList.toggle("dark", th.value === "dark");
	applyTheme();
	th.addEventListener("change", () => { try { storage.setItem("ss13-theme", th.value); } catch {} applyTheme(); th.blur(); });
	btn.addEventListener("click", () => { panel.hidden = !panel.hidden; });
	document.addEventListener("pointerdown", (e) => { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) { panel.hidden = true; if (panel.contains(document.activeElement)) document.activeElement.blur(); } });
	pane.parentElement.append(btn, panel);
	return { tag, state: () => state };
}
