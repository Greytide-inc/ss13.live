// a draggable splitter like BYOND's (skin.dmf `splitter` = % for the first pane). createSplitter({bar, first, vertical, container, percent, key, min})
// sets first's flex-basis; the other pane is flex:1. Clamped so neither pane drops under `min` px; saved in localStorage under `key`.
export function clampPercent(p, total, min) { const lo = Math.min(50, (min / total) * 100); return Math.max(lo, Math.min(100 - lo, p)); }
export function createSplitter({ bar, first, container, vertical, percent, key, min = 60 }) {
	let pct = percent;
	try { const s = parseFloat(localStorage.getItem(key)); if (s > 0 && s < 100) pct = s; } catch {}
	const apply = () => { first.style.flex = `0 0 calc((100% - 5px) * ${pct / 100})`; };
	const total = () => { const r = container.getBoundingClientRect(); return (vertical ? r.width : r.height) - 5; };
	bar.classList.add("splitbar", vertical ? "v" : "h");
	bar.addEventListener("pointerdown", (e) => {
		e.preventDefault(); bar.setPointerCapture(e.pointerId); bar.classList.add("drag"); document.body.style.cursor = vertical ? "col-resize" : "row-resize";
		const move = (ev) => {
			const r = container.getBoundingClientRect(), t = total();
			pct = clampPercent(((vertical ? ev.clientX - r.left : ev.clientY - r.top) - 2) / t * 100, t, min);
			apply();
		};
		const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); bar.removeEventListener("pointercancel", up); bar.classList.remove("drag"); document.body.style.cursor = ""; try { localStorage.setItem(key, String(pct)); } catch {} };
		bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", up); bar.addEventListener("pointercancel", up);
	});
	apply();
	// useKey(k, fallback) switches to another saved position (e.g. the widescreen map's), or fallback if none is saved yet.
	const useKey = (k, fallback) => {
		key = k; pct = clampPercent(fallback, total(), min);
		try { const s = parseFloat(localStorage.getItem(key)); if (s > 0 && s < 100) pct = s; } catch {}
		apply();
	};
	return { get percent() { return pct; }, set(p) { pct = clampPercent(p, total(), min); apply(); }, useKey };
}
