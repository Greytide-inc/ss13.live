// Chat text is HTML from the game, and some of it carries player-typed text. Before it
// goes into the page, cleanChat() keeps only the tags and attributes tg's own chat uses, so no player text can run a script in the page.
// cleanChat(html, doc = document) -> { frag, removed }: frag = the cleaned nodes (append them as they are: no second parse), removed =
// what was taken out ("tag script", "attr img onerror", ...), for the page log.
// Parsed in a <template>, whose content is inert: nothing in it loads or runs while it's being cleaned.
// Kept: the tags below; unknown tags are unwrapped (their text stays); DROP tags go with everything in them. Attributes: KEEP only,
// href only on <a> (?..., byond:// but not byond://winset, http(s), #, relative), src only on <img> (data:image/png|gif|jpeg, blob:, relative), style without
// positioning (a fixed box over the screen could fake the game's own text) or url().
const TAGS = new Set("a abbr b big blockquote br center code dd div dl dt em font h1 h2 h3 h4 h5 h6 hr i img li ol p pre s small span strike strong sub sup table tbody td tfoot th thead tr tt u ul".split(" "));
const DROP = new Set("script style iframe frame frameset object embed applet svg math template noscript link meta base form input button textarea select option audio video source track canvas title".split(" "));
const KEEP = new Set("class style color face size align valign title alt width height border colspan rowspan bgcolor".split(" "));
const BAD_STYLE = /^(position|z-index|inset|top|left|right|bottom|transform|translate|rotate|scale)/;
const scheme = (v) => /^([a-z][a-z0-9+.-]*):/i.exec(v.replace(/[\u0000- \u007f]/g, ""))?.[1].toLowerCase();
// byond://winset links run a command as whoever clicks them: tg's chat never sends one (security review 2026-10-25 #3)
const hrefOk = (v) => { const s = scheme(v); return !s || (s === "byond" && !/^byond:\/\/winset/i.test(v.replace(/[\u0000- \u007f]/g, ""))) || s === "http" || s === "https"; };
const srcOk = (v) => { const s = scheme(v); return !s || s === "blob" || (s === "data" && /^\s*data:image\/(png|gif|jpeg);/i.test(v)); };

export function cleanChat(html, doc = document) {
	const t = doc.createElement("template"), removed = [];
	t.innerHTML = html;
	const walk = (parent) => {
		for (const el of [...parent.children]) {
			const tag = el.localName;
			if (el.namespaceURI !== "http://www.w3.org/1999/xhtml" || DROP.has(tag)) { removed.push("tag " + tag); el.remove(); continue; }
			walk(el);
			if (!TAGS.has(tag)) { removed.push("tag " + tag); el.replaceWith(...el.childNodes); continue; }
			for (const a of [...el.attributes]) {
				const n = a.name.toLowerCase();
				const ok = KEEP.has(n) || (n === "href" && tag === "a" && hrefOk(a.value)) || (n === "src" && tag === "img" && srcOk(a.value));
				if (!ok) { removed.push(`attr ${tag} ${n}`); el.removeAttribute(a.name); }
			}
			if (el.hasAttribute("style")) {
				for (const p of [...el.style]) if (BAD_STYLE.test(p) || /url\(|expression|binding/i.test(el.style.getPropertyValue(p))) { removed.push("style " + p); el.style.removeProperty(p); }
				if (!el.style.length) el.removeAttribute("style");
			}
		}
	};
	walk(t.content);
	return { frag: t.content, removed };
}
