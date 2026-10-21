// layers-demo - web/draw/index.html?scene=layers-demo. The tile cases of
// tests/render-rules/layers.dm (BYOND 511 reference: reference/render-rules/byond-511-layers.png), built by
// hand as appearances and drawn through the live view's own itemsOf + sortPrepared + drawAppearance.
// The canvas sits at the page's top-left, 32 px per tile, so it can be cropped and diffed against
// the BYOND capture (tests/render-rules/layers-sample.py prints who is on top at each case).
import { FLOAT_LAYER, FLOAT_PLANE, resolveOverlay, type Appearance, type BuiltAppearance, type RawVars } from "../appearance/appearance.js";
import { icons, itemsOf, sortPrepared, type DrawItem } from "./client-scene.js";
import { drawAppearance, loadIcon } from "./station-client.js";

const D = "web/tests/render-rules/";
const [P, O, Q, Y, FLOOR] = ["sq_p", "sq_o", "sq_q", "sq_y", "floor"].map((n) => `${D}${n}.png`);

const own = (icon: string, layer: number): Appearance => ({
	icon, iconState: "", dir: 2, layer, plane: 0, color: null, alpha: 255, transform: null, pixelX: 0, pixelY: 0,
	invisibility: 0, blendMode: 0, maptext: null, maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0,
});
const raw = (icon: string, layer: number): RawVars => ({ ...own(icon, layer), iconState: null, dir: null, plane: FLOAT_PLANE });
type Sub = [string, number];
/** What buildAppearance does with an atom's lists: underlays then overlays, stable-sorted by (plane, layer). */
function built(icon: string, layer: number, over: Sub[] = [], under: Sub[] = []): BuiltAppearance {
	const root = own(icon, layer);
	const overlays = [...under.map(([i, l]) => resolveOverlay(raw(i, l), root, true)), ...over.map(([i, l]) => resolveOverlay(raw(i, l), root, false))];
	overlays.sort((a, b) => a.plane - b.plane || a.layer - b.layer);
	return { ...root, overlays };
}

const F = FLOAT_LAYER;
// [x, y, atoms in creation order]: mirrors mk() (Q before or after P) and the row-3 cases in layers.dm
const q = (layer: number) => built(Q, layer);
const cases: [number, number, BuiltAppearance[]][] = [];
const mk = (x: number, y: number, ql: number, over: Sub[] = [], under: Sub[] = [], before = false) => {
	const p = built(P, 3, over, under);
	cases.push([x, y, before ? [q(ql), p] : [p, q(ql)]]);
};
mk(2, 9, 3, [[O, F]]); mk(4, 9, 3, [[O, F]], [], true); mk(6, 9, 3.01, [[O, F]]); mk(8, 9, 3.5, [[O, F]]); mk(10, 9, 4, [[O, F]]); mk(12, 9, 2.99, [[O, F]]);
mk(2, 7, 4, [[O, 3.5]]); mk(4, 7, 4, [[O, 4.5]]); mk(6, 7, 4, [[O, 4]]); mk(8, 7, 4, [[O, 4]], [], true); mk(10, 7, 3, [[O, 2.5]]);
mk(2, 5, 2.99, [], [[O, F]]); mk(4, 5, 2.5, [], [[O, F]]); mk(6, 5, 3, [], [[O, F]], true); mk(8, 5, 2.5, [], [[O, 2.9]]); mk(10, 5, 3.5, [], [[O, 3.6]]);
cases.push([2, 3, [built(P, 3, [[O, F], [Y, F]])]], [4, 3, [built(P, 3, [[Y, F], [O, F]])]], [6, 3, [built(P, 3, [[O, F], [Y, F - 1]])]],
	[8, 3, [built(P, 3, [[Y, F - 1], [O, F]])]], [10, 3, [built(P, 3, [[O, F]], [[Y, F]])]]);

export async function main(): Promise<void> {
	const paths = new Set<string>([FLOOR]);
	for (const [, , atoms] of cases) for (const a of atoms) { paths.add(a.icon!); for (const o of a.overlays) paths.add(o.icon!); }
	for (const p of paths) { const li = await loadIcon(p); if (li) icons.set(p, li); }
	const items: DrawItem[] = [];
	for (let y = 1; y <= 11; y++) for (let x = 1; x <= 15; x++) items.push(...itemsOf({ ...own(FLOOR, 2), overlays: [] }, (x - 1) * 32, (11 - y) * 32));
	for (const [x, y, atoms] of cases) for (const a of atoms) items.push(...itemsOf(a, (x - 1) * 32, (11 - y) * 32));
	const sorted = sortPrepared({ mapItems: items, hudItems: [], masters: new Map(), canvasW: 480, canvasH: 480, animated: false }, false);
	const canvas = document.createElement("canvas");
	canvas.width = 480; canvas.height = 352;
	canvas.style.cssText = "position:absolute;left:0;top:0;z-index:99999";
	document.body.appendChild(canvas);
	const ctx = canvas.getContext("2d")!;
	for (const plane of sorted.planes) for (const it of sorted.byPlane.get(plane) ?? []) drawAppearance(ctx, it.appearance, icons, it.originX, it.originY, 0);
	document.getElementById("status")!.textContent = `drew ${items.length} items`;
}
