// client-scene - Browser entry for the connected-player view (web/draw/index.html?scene=client).
// Loads web/build/2i/client.json (written by `npm run boot -- --connect KEY`) and draws
// the first client's map view plus its `client.screen` HUD, generalising the station view's one hardcoded
// lighting-plane-multiply into "every plane composites onto the planes below it using its own
// /obj/screen/plane_master's color/alpha/blend_mode" -- BYOND's actual plane model.
//
// Reuses station-client.ts's icon loader and per-appearance drawing helpers (loadIcon,
// drawAppearance, drawLighting, isLighting) rather than re-implementing them; screen_loc placement
// math comes from screen-loc.ts; the color-matrix math comes from color-matrix.ts.
//
// Map data: client.json doesn't yet carry the client's own view tiles (that would be
// `client.viewTiles`/`client.eyeTile`, never added).
// If they're present this file uses them directly (trusting the same {x,y,appearances}
// shape as station.json, world-absolute tile coordinates). If not, it falls back to cutting the
// same (2*view+1) square out of web/build/2g/station.json around a fixed stand-in tile (see
// FALLBACK_ANCHOR below) and says so on the page.
//
// `transform`: now applied, via station-client.ts's drawLayer/drawLightingLayer (this
// file just reuses drawAppearance/drawLighting, so it gets the fix for free) -- see
// byond-transform.ts for the BYOND-matrix-to-canvas conversion this relies on. Parallax layers now
// tile correctly instead of stacking at one spot.
//
// Lighting backdrops: drawn, see sortLayer(). Screen objects above the mob's see_invisible are
// hidden. `?dump=lobby` draws client-lobby.json (the lobby view from before `--join`) instead.
//
// Animation: multi-frame icon_states now play, via src/dmi/animation.ts's pure
// frameAtTime(frames, delay, loop, rewind, t) fed into station-client.ts's drawLayer/drawLightingLayer
// (both now take an optional frameTime, in deciseconds since the animation started; omitting it keeps
// station-client.ts's own one-shot bake at frame 0, unchanged). This scene redraws every animation
// frame via requestAnimationFrame instead of baking once -- see the redraw loop near the end of
// main() for why that's fine at this scene's size (15x15 tiles) but wouldn't be for the 65k-tile
// station view.

import { inherit } from "./inherit.js";
import { CLIENT_ANIM_ID, ease, foldPixels, ObjectAnims, SMOOTH, SWITCH, type AnimValue, type StepVar } from "./anim.js";
import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import { parseScreenLoc } from "./screen-loc.js";
import { applyColorMatrix } from "./color-matrix.js";
import { buildAnimationSteps } from "../dmi/animation.js";
import { findState } from "./sprite-lookup.js";
import type { ViewUpdate } from "../worker/client-view.js";
import { loadIcon, drawAppearance, drawLighting, isLighting, TILE_PX, type LoadedIcon } from "./station-client.js";
import { hitTest, type Hit } from "./hit-test.js";
import { ChunkIndex, chunkCol, chunkRow } from "./chunk-index.js";
import { relBox } from "./item-box.js";
import { makePredictHud, PREDICT_HIDE_MS } from "./predict-hud.js";
import { glideAt, predGlide as predGlideAt, serverGlide, type Glide } from "./glide.js";
import { cornersOf, lessLight, parseLight, strengthAt, type CarriedLight } from "./carried-light.js";
import { shadowPainter, type ShadowPaint } from "./sight-shadow-paint.js";
import { shadowStrength, type Lum, type Opq, type ShadowMode } from "./sight-shadow.js";
import { pageSees, pageSight, withSight, type PageSight } from "./sight-pop-in.js";

// --- client.json shapes ---------------------------------------------------------------------

interface EyeInfo {
	ref: string;
	type: string;
	name: string;
	x: number;
	y: number;
	z: number;
}
interface ScreenEntry {
	/** The view id (live view only), so a click on it can name the object. */
	id?: number;
	type: string;
	screen_loc: string | null;
	appearance: BuiltAppearance;
}
/** Same shape as station.json's tiles; not yet written by anything (see header) -- read
 *  defensively in case client.json's shape changes. */
interface ViewTile {
	x: number;
	y: number;
	appearances: BuiltAppearance[];
	/** Pixel offsets of gliding atoms, parallel to `appearances` (east+, north+); absent = none. */
	glide?: ([number, number] | undefined)[];
	/** View ids of the objects, parallel to `appearances` (live view only). */
	ids?: number[];
}
export interface ClientEntry {
	key: string;
	ckey: string;
	/** client.view: a number n (a (2n+1) square) or "WxH" text (widescreen "19x15"). */
	view: number | string;
	/** client.default_view (the unzoomed view); the HUD is laid out against it. Absent: the HUD is laid out against `view`. */
	baseView?: number | string;
	eye?: EyeInfo | null;
	eyeTile?: { x: number; y: number; z: number };
	viewTiles?: ViewTile[];
	screen: ScreenEntry[];
	/** The mob's see_invisible/see_in_dark/sight (absent in older dumps). */
	sight?: { see_invisible: number; see_in_dark: number; sight: number } | null;
}
export interface ClientDump {
	builtAt: string;
	worldTime: number;
	clients: ClientEntry[];
}

// --- station.json fallback -------------------------------------------------------------------

interface StationTile {
	x: number;
	y: number;
	appearances: BuiltAppearance[];
}
interface StationDump {
	builtAt: string;
	z: number;
	width: number;
	height: number;
	tiles: StationTile[];
}

/** Stand-in eye tile used only when client.json has no real viewTiles yet (see header). Anywhere on
 *  the station with real floor/wall/obj traffic works for the "does this draw" check; this is just
 *  the map's rough centre, not an attempt at a specific landmark like the arrivals shuttle. */
const FALLBACK_ANCHOR = { x: 128, y: 128, z: 2 };

/** client.view as half-sizes [x, y] in tiles (as client-view.ts viewRadius): n -> n both ways, "19x15" -> 9, 7. */
export function viewHalf(v: unknown): [number, number] {
	if (typeof v === "number" && Number.isFinite(v)) return [Math.trunc(v), Math.trunc(v)];
	const m = typeof v === "string" ? /^(\d+)x(\d+)$/.exec(v) : null;
	return m ? [Math.floor((+m[1] - 1) / 2), Math.floor((+m[2] - 1) / 2)] : [7, 7];
}

function windowFromStation(station: StationDump, anchorX: number, anchorY: number, view: number | string): ViewTile[] {
	const byCoord = new Map<string, StationTile>();
	for (const t of station.tiles) byCoord.set(`${t.x},${t.y}`, t);
	const tiles: ViewTile[] = [];
	const [hx, hy] = viewHalf(view);
	for (let dy = -hy; dy <= hy; dy++) {
		for (let dx = -hx; dx <= hx; dx++) {
			const x = anchorX + dx, y = anchorY + dy;
			const t = byCoord.get(`${x},${y}`);
			tiles.push({ x, y, appearances: t ? t.appearances : [] });
		}
	}
	return tiles;
}

// --- drawing ---------------------------------------------------------------------------------

const status = document.getElementById("status")!;
function setStatus(msg: string): void {
	status.textContent = msg;
}

/** One appearance to draw at a fixed pixel origin within the view canvas (before that appearance's
 *  own pixelX/pixelY are added by drawAppearance/drawLighting -- same convention as
 *  station-client.ts). `plane`/`layer` are the appearance's own resolved values, used only to bucket
 *  and order draws; not reapplied at draw time. */
export interface DrawItem {
	plane: number;
	layer: number;
	originX: number;
	originY: number;
	appearance: BuiltAppearance;
	/** For clicks, set by itemsOf: the view id of the object this draws (a map atom or screen object), its
	 *  mouse_opacity, and its icon's left edge / bottom edge in canvas pixels (icon-x/icon-y count from these). */
	id?: number;
	mo?: number;
	/** a screen (HUD) object: it samples on the view's pixel grid, map items on the map's. */
	hud?: boolean;
	/** a screen object laid out in base-view pixels (originX/Y, iconX0/Y1 are in those): it draws at view pixel = base pixel * k + (dx, dy), so the HUD keeps its size when only the map zooms. Absent: view pixels. */
	hk?: HudFit;
	iconX0?: number;
	iconY1?: number;
}

export interface HudFit { k: number; dx: number; dy: number }

/** how the HUD fits a (zoomed) view: laid out for the base view's tiles, drawn k times as big, bottom-centred in the view. k is the biggest scale that keeps the whole base-view HUD inside the view. */
export function hudFit(baseW: number, baseH: number, viewW: number, viewH: number): HudFit {
	const k = Math.min(viewW / baseW, viewH / baseH);
	return { k, dx: (viewW - baseW * k) * TILE_PX / 2, dy: (viewH - baseH * k) * TILE_PX };
}

/** The width (px) of a view that shows on screen. A zoomed view (game: zoomView) is the first whole, odd number of tiles wide that covers the base view's
 *  shape at its height; the page shows that shape, the view's middle, so the map pane keeps its width at every zoom. Any other view shows whole. */
export function boxWidth(baseW: number, baseH: number, viewW: number, viewH: number): number {
	const exact = viewH * baseW / baseH;
	let w = Math.ceil(exact - 1e-9);
	if (w % 2 === 0) w++;
	return (w === viewW ? exact : viewW) * TILE_PX;
}

/** A plane_master's compositing rule for its whole plane: applied once per plane, over everything
 *  drawn on it, when that plane is composited onto the planes below (see main()'s render loop). */
export interface PlaneMaster {
	color: string | number[] | null;
	alpha: number;
	blendMode: number;
	/** The plane master's mouse_opacity: 0 makes everything on its plane click-through. */
	mouseOpacity?: number;
}

/** BYOND's blend_mode constants (env/src/OpenDream DMStandard/Defines.dm) mapped onto the closest
 *  canvas 2D compositing operation. BLEND_DEFAULT/OVERLAY/INSET_OVERLAY (0/1/5) all draw normally
 *  here -- the real distinction between them is about how partially-transparent destination pixels
 *  are treated, which doesn't come up for a fully opaque plane below. BLEND_SUBTRACT (3) has no
 *  faithful canvas equivalent; "difference" is a rough stand-in and isn't seen in this data. */
function compositeOp(blendMode: number): GlobalCompositeOperation {
	switch (blendMode) {
		case 2: return "lighter"; // BLEND_ADD
		case 3: return "difference"; // BLEND_SUBTRACT (rough approximation, not seen in current data)
		case 4: return "multiply"; // BLEND_MULTIPLY
		default: return "source-over"; // BLEND_DEFAULT(0) / BLEND_OVERLAY(1) / BLEND_INSET_OVERLAY(5)
	}
}

/** Tile-local pixel origin (top-left of tile (tileX0,tileY0), 0-based from the view's bottom-left,
 *  Y flipped for canvas), plus a placement-level pixel offset (screen_loc's `:PX,PY` suffix -- a
 *  property of *where the object is anchored*, separate from the appearance's own pixel_x/pixel_y,
 *  which drawAppearance/drawLighting add on top of whatever origin they're given). */
function tileOrigin(tileX0: number, tileY0: number, viewH: number, offsetX: number, offsetY: number) {
	return {
		originX: tileX0 * TILE_PX + offsetX,
		originY: (viewH - 1 - tileY0) * TILE_PX - offsetY,
	};
}

function rangeInclusive(a: number, b: number): number[] {
	const lo = Math.min(a, b), hi = Math.max(a, b);
	const out: number[] = [];
	for (let i = lo; i <= hi; i++) out.push(i);
	return out;
}

/** A 20-number color matrix whose every output channel is the source alpha (row 4 all 1, the rest 0). */
export function isAlphaToWhite(m: number[]): boolean {
	return m.length === 20 && m.every((v, i) => v === (i >= 12 && i < 16 ? 1 : 0));
}

/** BYOND's BACKGROUND_LAYER (20000, DMStandard Defines.dm): a layer at or above it draws behind
 *  everything else on its plane (OpenDream DreamViewOverlay.cs: layer -= 40000). tg's lighting
 *  backdrops use it: on LIGHTING_PLANE, the white "unlit" (BACKGROUND_LAYER+20) then the black "lit"
 *  (+21, invisibility 20) go under the per-tile lighting objects. A living mob's see_invisible is 25
 *  (client.json `sight`), so "lit" shows: tiles with no lighting object stay dark unless their area
 *  is unlit-by-design, whose /obj/effect/fullbright overlay (lighting plane) whitens them. */
function sortLayer(layer: number): number {
	return layer >= 20000 ? layer - 40000 : layer;
}

/** An appearance as draw items. BYOND 511 (tests/render-rules/layers.dm): a floating-layer overlay
 *  draws with its owner, just above it, and an underlay just below it -- both inside the owner's slot,
 *  so an obj on a higher layer draws over them and one on a lower layer under them (ties go to
 *  creation order). An overlay with an explicit layer (>= 0) sorts against every atom at that layer,
 *  and an overlay on another plane draws on that plane (e.g. an area's fullbright). Those get their
 *  own items; underlays get theirs at the owner's layer, emitted before the owner (stable sort). */
// the origin-independent part of itemsOf, memoised per appearance object, so an appearance that is the same object on the next frame
// gives the same derived appearance objects again (pixi-view's sameItems / glide shift path compare appearances by identity).
interface ItemTemplate { a: BuiltAppearance; items: { plane: number; layer: number; owner: boolean; appearance: BuiltAppearance }[] }
const tmplMemo = new WeakMap<BuiltAppearance, ItemTemplate>();
export function itemsOf(a0: BuiltAppearance, originX: number, originY: number, id?: number): DrawItem[] {
	let t = tmplMemo.get(a0);
	if (!t) tmplMemo.set(a0, (t = itemTemplate(a0)));
	const a = t.a;
	// Every item of one object carries the object's id, mouse_opacity and icon box (the owner's, not an overlay's).
	const hit = { id, mo: a.mouseOpacity ?? 1, iconX0: originX + a.pixelX, iconY1: originY - a.pixelY + TILE_PX };
	const ox = originX + a.pixelX, oy = originY - a.pixelY;
	const out: DrawItem[] = [];
	for (const e of t.items) out.push({ plane: e.plane, layer: e.layer, originX: e.owner ? originX : ox, originY: e.owner ? originY : oy, appearance: e.appearance, ...hit });
	return out;
}
function itemTemplate(a: BuiltAppearance): ItemTemplate {
	if (a.overlays.length && (a.transform || a.alpha < 255 || a.color)) a = { ...a, overlays: a.overlays.map((o) => inherit(o, a)) };
	const slot = (o: Appearance) => !o.explicitLayer && o.plane === a.plane;
	if (a.overlays.every(slot) && a.overlays.every((o) => o.layer >= a.layer)) return { a, items: [{ plane: a.plane, layer: sortLayer(a.layer), owner: true, appearance: a }] };
	const items: ItemTemplate["items"] = [];
	for (const o of a.overlays) if (slot(o) && o.layer < a.layer) items.push({ plane: a.plane, layer: sortLayer(a.layer), owner: false, appearance: { ...o, overlays: [] } });
	items.push({ plane: a.plane, layer: sortLayer(a.layer), owner: true, appearance: { ...a, overlays: a.overlays.filter((o) => slot(o) && o.layer >= a.layer) } });
	for (const o of a.overlays) if (!slot(o)) items.push({ plane: o.plane, layer: sortLayer(o.layer), owner: false, appearance: { ...o, overlays: [] } });
	return { a, items };
}

/** A client's view, ready to draw: its map and HUD draw items and plane masters. */
export interface Prepared {
	mapItems: DrawItem[];
	hudItems: DrawItem[];
	masters: Map<number, PlaneMaster>;
	/** Canvas size in px (a widescreen view is wider than tall). */
	canvasW: number;
	canvasH: number;
	/** The middle part of the canvas that shows (px wide), see boxWidth; absent: all of it. */
	boxW?: number;
	/** Something drawn has more than one frame, so the view must be redrawn as time passes. */
	animated: boolean;
	/** Something is mid-glide: the next frame differs, so the page rebuilds and redraws each frame. */
	gliding?: boolean;
	/** Bench: redraw every plane even if its items are the same as last time. */
	forceDraw?: boolean;
	/** Where the map sits on the canvas: the tile at the view's bottom-left, the view size in tiles and the camera glide offset (px, north+). */
	geom?: { minX: number; minY: number; viewW: number; viewH: number; camX: number; camY: number };
	/** the live page's kept scene. Then `mapItems` is a getter that builds the view-space list on first use (canvas path, hit tests, ?pd=0);
	 *  the default Pixi path reads `scene` instead and never builds it. */
	scene?: SceneRef;
	/** page-draw step 4: the map items that can show at view pixel (px, py) (its chunk's, spill included), in view pixels, for hit tests; else hitTest walks `mapItems`. */
	mapNear?: (px: number, py: number) => DrawItem[];
	/** sight shadows (sight-shadow-paint.ts): drawn above the lighting, below the fullscreen and HUD planes (Pixi path only). */
	shadow?: ShadowPaint;
	/** how strong the shadow is drawn (sight-shadow.ts shadowStrength: 1, or dimmed with mesons/thermals) */
	shadowAlpha?: number;
}
/** The kept scene as the default Pixi path reads it: every tile's items in map pixels (x = tile x * 32, y = -tile y * 32; view px = map px - (cx, cy)),
 *  tie order south to north, west to east, then the tile's own list. */
export interface SceneRef { items: () => DrawItem[]; cx: number; cy: number; /** page-draw step 4: the same items cut into 16x16-tile chunks per plane (spill included) */ chunks: ChunkIndex }

const animatedStates = new Map<string, boolean>(); // "icon\nstate" -> has more than one frame
// per appearance object (they are replaced, not edited, when the game changes them); only memoised once its sheet is loaded.
const animMemo = new WeakMap<object, boolean>();
export function isAnimated(a: { icon: string | null; iconState: string }): boolean {
	let r = animMemo.get(a);
	if (r === undefined) {
		r = isAnimated0(a);
		if (!a.icon || icons.has(a.icon)) animMemo.set(a, r);
	}
	return r;
}
function isAnimated0(a: { icon: string | null; iconState: string }): boolean {
	if (!a.icon) return false;
	const key = a.icon + "\n" + a.iconState;
	let b = animatedStates.get(key);
	if (b === undefined) {
		const loaded = icons.get(a.icon);
		if (!loaded) return false; // not cached: asked again once it loads
		animatedStates.set(key, (b = (findState(loaded.dmi, a.iconState)?.frames ?? 1) > 1));
	}
	return b;
}

// Icons stay loaded across snapshots (the live view rebuilds its items a few times a second).
export const icons = new Map<string, LoadedIcon>();
const ICON_HOLD_MS = 150; // longest the live view waits for icon sheets before drawing without them
const failedIcons = new Set<string>();

/** Icon paths the view uses that aren't loaded (or known to fail) yet. */
function missingIcons(client: ClientEntry, viewTiles: ViewTile[]): string[] {
	const iconPaths = new Set<string>();
	const addIcons = (a: BuiltAppearance) => {
		if (a.icon) iconPaths.add(a.icon);
		for (const o of a.overlays) if (o.icon) iconPaths.add(o.icon);
	};
	for (const t of viewTiles) for (const a of t.appearances) addIcons(a);
	for (const s of client.screen) if (s.screen_loc != null) addIcons(s.appearance);
	return [...iconPaths].filter((p) => !icons.has(p) && !failedIcons.has(p));
}

const iconLoads = new Map<string, Promise<void>>(); // sheets on their way (a preload and the view asking for the same sheet share one download)
function loadOne(path: string): Promise<void> {
	let p = iconLoads.get(path);
	if (!p) iconLoads.set(path, (p = loadIcon(path).catch(() => null).then((loaded) => {
		iconLoads.delete(path);
		if (loaded) icons.set(path, loaded);
		else {
			failedIcons.add(path);
			console.warn(`failed to load ${path}`);
		}
	})));
	return p;
}

async function loadIcons(missing: string[]): Promise<void> {
	if (missing.length) setStatus(`loading ${missing.length} .dmi files...`);
	// all at once: one at a time cost a round trip each, and the picture waits for the last (seconds per new area over a phone)
	await Promise.all(missing.map(loadOne));
}

// The station's sheets (ViewUpdate.icons, most used first), downloaded in the background a few at a time after joining, so the picture
// seldom has to wait for one (it held up to ICON_HOLD_MS a few times a minute in the first minutes of a round).
const PRELOAD_AT_ONCE = 3, PRELOAD_DELAY_MS = 1000; // few at a time, after the first view's own sheets: the view's needs go first
const preloadQueue: string[] = [];
let preloading = 0;
function preloadIcons(paths: string[]): void {
	const fresh = !preloadQueue.length && !preloading;
	preloadQueue.length = 0;
	for (const p of paths) if (!icons.has(p) && !failedIcons.has(p)) preloadQueue.push(p);
	if (fresh) setTimeout(preloadNext, PRELOAD_DELAY_MS);
	preloadLog = { n: preloadQueue.length, t0: performance.now() + PRELOAD_DELAY_MS };
}
let preloadLog: { n: number; t0: number } | null = null;
function preloadNext(): void {
	while (preloading < PRELOAD_AT_ONCE && preloadQueue.length) {
		const p = preloadQueue.shift()!;
		if (icons.has(p) || failedIcons.has(p)) continue;
		preloading++;
		void loadOne(p).finally(() => { preloading--; preloadNext(); });
	}
	if (!preloading && !preloadQueue.length && preloadLog) { viewStats.preloaded = `${preloadLog.n} icon sheets in ${Math.round(performance.now() - preloadLog.t0)} ms`; preloadLog = null; }
}

async function prepare(client: ClientEntry, viewTiles: ViewTile[]): Promise<Prepared> {
	await loadIcons(missingIcons(client, viewTiles));
	return buildPrepared(client, viewTiles);
}

/** The order tiles are drawn in (and so how same-plane, same-layer things on different tiles overlap): south to north, then west to east. */
export const tileOrder = (a: { x: number; y: number }, b: { x: number; y: number }): number => a.y - b.y || a.x - b.x;

/** The HUD items (screen objects placed via screen_loc) and plane masters of a client. */
function hudOf(client: Pick<ClientEntry, "view" | "baseView" | "sight" | "screen">, viewW: number, viewH: number): { hudItems: DrawItem[]; masters: Map<number, PlaneMaster> } {
	// --- HUD items, placed via screen_loc --------------------------------------------------
	const hudItems: DrawItem[] = [];
	const seeInvisible = client.sight?.see_invisible ?? 25; // SEE_INVISIBLE_LIVING for old dumps
	const masters = new Map<number, PlaneMaster>();
	const [bhx, bhy] = viewHalf(client.baseView ?? client.view);
	const baseW = 2 * bhx + 1, baseH = 2 * bhy + 1;
	const fit = baseW === viewW && baseH === viewH ? undefined : hudFit(baseW, baseH, viewW, viewH);
	for (const s of client.screen) {
		if (s.type.includes("/plane_master/")) {
			masters.set(s.appearance.plane, { color: s.appearance.color, alpha: s.appearance.alpha, blendMode: s.appearance.blendMode, mouseOpacity: s.appearance.mouseOpacity });
		}
		if (s.screen_loc == null) continue; // not drawn, as in BYOND (e.g. the hide_toggle action button)
		if (s.appearance.invisibility > seeInvisible) continue; // hidden from this mob, as on the map
		const parsed = parseScreenLoc(s.screen_loc, viewW, viewH);
		const based = fit ? parseScreenLoc(s.screen_loc, baseW, baseH) : parsed;
		if (!parsed.ok || !based.ok) {
			console.warn(`client-scene: couldn't parse screen_loc "${s.screen_loc}" on ${s.type}: ${parsed.ok ? (based as { error: string }).error : parsed.error}`);
			continue;
		}
		for (let pi = 0; pi < parsed.placements.length; pi++) {
			// a placement that tiles the whole base view ("WEST,SOUTH to EAST,NORTH": blind, flash, damage overlays) tiles the whole zoomed view instead; the rest keeps its base-view place and size.
			const bp = based.placements[pi];
			const full = !!fit && !!bp.toX && !!bp.toY && bp.x.tile <= 1 && bp.y.tile <= 1 && bp.toX.tile >= baseW && bp.toY.tile >= baseH;
			const p = full || !fit ? parsed.placements[pi] : bp, hk = full ? undefined : fit, vh = full || !fit ? viewH : baseH;
			if (p === undefined) continue;
			const xTiles = p.toX ? rangeInclusive(p.x.tile, p.toX.tile) : [p.x.tile];
			const yTiles = p.toY ? rangeInclusive(p.y.tile, p.toY.tile) : [p.y.tile];
			for (const tx of xTiles) {
				for (const ty of yTiles) {
					const { originX, originY } = tileOrigin(tx - 1, ty - 1, vh, p.x.pixel, p.y.pixel);
					for (const it of itemsOf(s.appearance, originX, originY, s.id)) { it.hud = true; if (hk) it.hk = hk; hudItems.push(it); }
				}
			}
		}
	}
	return { hudItems, masters };
}

/** Draw items for a view whose icons are loaded (prepare, or the live view after loadIcons). */
export function buildPrepared(client: ClientEntry, viewTiles: ViewTile[], cam?: [number, number]): Prepared {
	const [hx, hy] = viewHalf(client.view);
	const viewW = 2 * hx + 1, viewH = 2 * hy + 1;
	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	let canvasW = viewW * TILE_PX, canvasH = viewH * TILE_PX;
	if (client.eyeTile) {
		// The view is centred on the eye tile (the live page may hold a ring of extra tiles while the camera glides).
		minX = client.eyeTile.x - hx;
		minY = client.eyeTile.y - hy;
	} else {
		// Bounding box of the actual tiles we have (matches viewSize exactly for the fallback window, built to that size).
		for (const t of viewTiles) {
			if (t.x < minX) minX = t.x;
			if (t.x > maxX) maxX = t.x;
			if (t.y < minY) minY = t.y;
			if (t.y > maxY) maxY = t.y;
		}
		const mapW = maxX - minX + 1, mapH = maxY - minY + 1;
		if (mapW !== viewW || mapH !== viewH) {
			console.warn(`client-scene: map window is ${mapW}x${mapH}, expected ${viewW}x${viewH} from client.view=${client.view}`);
		}
		canvasW = Math.max(mapW, viewW) * TILE_PX;
		canvasH = Math.max(mapH, viewH) * TILE_PX;
	}
	// Camera glide offset (px, north+): the view is centred that far from the eye tile, so map items shift the other way.
	const [camX, camY] = cam ?? [0, 0];
	let gliding = !!cam && (camX !== 0 || camY !== 0);

	// --- map items -----------------------------------------------------------------------------
	const mapItems: DrawItem[] = [];
	for (const t of [...viewTiles].sort(tileOrder)) { // ties of plane and layer go south to north, west to east, then the tile's own list order
		const { originX, originY } = tileOrigin(t.x - minX, t.y - minY, viewH, 0, 0);
		if (client.eyeTile && (originX - camX < -2 * TILE_PX || originX - camX > canvasW + TILE_PX || originY + camY < -2 * TILE_PX || originY + camY > canvasH + TILE_PX)) continue; // the held ring, off the canvas (a tile's own glide is at most a tile)
		t.appearances.forEach((a, i) => {
			const g = t.glide?.[i];
			if (g) gliding = true;
			mapItems.push(...itemsOf(a, originX - camX + (g ? g[0] : 0), originY + camY - (g ? g[1] : 0), t.ids?.[i]));
		});
	}

	const { hudItems, masters } = hudOf(client, viewW, viewH);
	const animated = mapItems.some((it) => isAnimated(it.appearance) || it.appearance.overlays.some(isAnimated))
		|| hudItems.some((it) => isAnimated(it.appearance) || it.appearance.overlays.some(isAnimated));
	const [bhx, bhy] = viewHalf(client.baseView ?? client.view);
	return { mapItems, hudItems, masters, canvasW, canvasH, boxW: boxWidth(2 * bhx + 1, 2 * bhy + 1, viewW, viewH), animated, gliding, geom: { minX, minY, viewW, viewH, camX, camY } };
}

export interface SortedPrepared { byPlane: Map<number, DrawItem[]>; planes: number[]; animated: Set<number> }
const itemAnimated = (it: DrawItem): boolean => isAnimated(it.appearance) || it.appearance.overlays.some(isAnimated);
/** the sorted map part of the last scene call. `pos[j]` is where flat item j sits in its plane's array; `anim` counts the animated items per plane. */
interface SceneSort { icons: number; flat: DrawItem[]; byPlane: Map<number, DrawItem[]>; pos: Int32Array; anim: Map<number, number> }
let sceneSorted: SceneSort | null = null;
function sortScene(map: DrawItem[]): SceneSort {
	const idxOf = new Map<number, number[]>(), byPlane = new Map<number, DrawItem[]>(), pos = new Int32Array(map.length), anim = new Map<number, number>();
	for (let j = 0; j < map.length; j++) {
		const pl = map[j].plane;
		let l = idxOf.get(pl);
		if (!l) idxOf.set(pl, (l = []));
		l.push(j);
	}
	for (const [pl, l] of idxOf) {
		l.sort((a, b) => map[a].layer - map[b].layer || a - b); // equal layers keep flat order (what a stable sort of the plane's items does)
		const arr: DrawItem[] = new Array(l.length);
		let n = 0;
		for (let k = 0; k < l.length; k++) { arr[k] = map[l[k]]; pos[l[k]] = k; if (itemAnimated(arr[k])) n++; }
		byPlane.set(pl, arr);
		if (n) anim.set(pl, n);
	}
	return { icons: icons.size, flat: map, byPlane, pos, anim };
}
/** The same list with some items swapped for others of the same plane and layer at the same index: patch the sort instead of redoing it. Null if not so. */
function patchScene(old: SceneSort, map: DrawItem[]): SceneSort | null {
	const prev = old.flat;
	if (prev.length !== map.length) return null;
	let byPlane: Map<number, DrawItem[]> | null = null, anim: Map<number, number> | null = null;
	const copied = new Set<number>();
	for (let j = 0; j < map.length; j++) {
		const n = map[j], o = prev[j];
		if (n === o) continue;
		if (n.plane !== o.plane || n.layer !== o.layer) return null;
		if (!byPlane) { byPlane = new Map(old.byPlane); anim = new Map(old.anim); }
		if (!copied.has(n.plane)) { copied.add(n.plane); byPlane.set(n.plane, byPlane.get(n.plane)!.slice()); }
		byPlane.get(n.plane)![old.pos[j]] = n;
		const d = (itemAnimated(n) ? 1 : 0) - (itemAnimated(o) ? 1 : 0);
		if (d) { const c = (anim!.get(n.plane) ?? 0) + d; if (c) anim!.set(n.plane, c); else anim!.delete(n.plane); }
	}
	return { icons: old.icons, flat: map, byPlane: byPlane ?? old.byPlane, pos: old.pos, anim: anim ?? old.anim };
}
/** A view's draw items by plane (each sorted by layer), the planes to composite in order, and which planes hold animated items. */
export function sortPrepared(p: Prepared, showHud: boolean, useScene = false): SortedPrepared {
	const map = useScene && p.scene ? p.scene.items() : p.mapItems; // the Pixi path sorts the kept scene's items (map pixels) and never builds mapItems
	let byPlane: Map<number, DrawItem[]>, animated: Set<number>;
	if (useScene && p.scene) { // the scene's list is the same as last time, or differs only in items that swapped places-for-places: reuse or patch the last sort
		if (sceneSorted?.flat === map && sceneSorted.icons === icons.size) viewStats.sSame++;
		else {
			const patched = sceneSorted && sceneSorted.icons === icons.size ? patchScene(sceneSorted, map) : null;
			if (patched) viewStats.sPatch++; else { viewStats.sFull++; sceneSorted = sortScene(map); }
			if (patched) sceneSorted = patched;
		}
		byPlane = new Map(sceneSorted!.byPlane);
		animated = new Set(sceneSorted!.anim.keys());
	} else {
		byPlane = new Map();
		for (const it of map) {
			let arr = byPlane.get(it.plane);
			if (!arr) byPlane.set(it.plane, (arr = []));
			arr.push(it);
		}
		for (const arr of byPlane.values()) arr.sort((a, b) => a.layer - b.layer);
		animated = new Set<number>();
		for (const [pl, arr] of byPlane) if (arr.some(itemAnimated)) animated.add(pl);
	}
	if (showHud && p.hudItems.length) { // the screen objects join their planes after the map items (the same order as sorting the two lists joined)
		const hud = new Map<number, DrawItem[]>();
		for (const it of p.hudItems) { let arr = hud.get(it.plane); if (!arr) hud.set(it.plane, (arr = [])); arr.push(it); }
		for (const [pl, h] of hud) {
			const m = byPlane.get(pl), joined = m ? m.concat(h) : h;
			joined.sort((a, b) => a.layer - b.layer);
			byPlane.set(pl, joined);
			if (h.some(itemAnimated)) animated.add(pl);
		}
	}
	const planes = new Set<number>(byPlane.keys());
	if (showHud) for (const pl of p.masters.keys()) planes.add(pl);
	return { byPlane, planes: [...planes].sort((a, b) => a - b), animated };
}

/** Live-view costs on the page, read by tools/worker-boot.mjs through window.bootResult.viewStats.
 *  renders = every redraw (new views plus animation frames); newView* = only the redraws of a new view. */
export const viewStats = { received: 0, changed: 0, applied: 0, applyMs: 0, renders: 0, renderMs: 0, newViewRenders: 0, newViewMs: 0, newViewTimes: [] as number[], firstAt: 0, lastAt: 0,
	/** redraws of gliding views (ms each) and, per rebuilt glide frame, [ms, camX, camY, atoms gliding, largest atom offset x, y]. */
	missingVis: 0, iconHolds: [] as number[], iconHoldAt: 0, preloaded: "", longFrames: [] as number[], animEvents: 0, flickFrames: 0, shakeMax: 0, shakeApplied: 0, animLog: [] as string[], missingLog: [] as string[], keyAt: 0, clickAt: 0, clickLat: [] as number[], pings: [] as number[], pingRecent: [] as number[], keyRecv: [] as number[], keyLat: [] as number[], keyPaint: [] as number[], viewGaps: [] as number[], hitMs: [] as number[], redrawTimes: [] as number[], rafs: 0, glideGaps: [] as number[], glideFrames: 0, glideMs: 0, glideTimes: [] as number[], glideLog: [] as number[][], lightFades: 0, dirtyBy: {} as Record<string, number>, carriedTiles: 0, lessenedTiles: 0, shadowPaints: 0, shadowMs: 0, sightRuns: 0,
	/** lag-smoothing step 4: predicted steps, ones the server then took, took differently, or never took in time; frames with the mob gliding and
	 *  images on it (a speech bubble), and the most px one was drawn off the mob. */
	predImgFrames: 0, predImgGap: 0, ownMoves: 0, ownMoveGaps: [] as number[], // ownMove*: your mob's steps as views brought them, ms apart (under 1 s; for walk-pace checks)
	predSteps: 0, predPull: 0, predPullFrames: 0, predPullGap: 0, predPullFar: 0, predToggle: 0, predThrow: 0, predPick: 0, predPickOk: 0, predPickBack: 0, predPut: 0, predPutOk: 0, predPutBack: 0, predFace: 0, predTurns: 0, predFaceOk: 0, predFaceWrong: 0, predOk: 0, predWrong: 0, predLate: 0, predJumps: [] as string[], predSkip: { last: "" } as Record<string, number | string>,
	/** rebuild split (ms totals: current0 / missingIcons / buildPrepared), last view's tile and item counts; the Pixi backend adds its render split
	 *  (rSort / rPlace / rTex = plane render textures / rComp = final composite; GPU time only with ?sync=1), planes drawn (changed / animated / shifted / skipped), sprites placed. */
	cFallInfo: "", cRender: 0, cPlace: 0, cFrame: 0, cComp: 0, cFall: 0, cVisible: 0, rbCur: 0, rbMiss: 0, rbBuild: 0, rbTiles: 0, tiles: 0, items: 0, rSort: 0, rPlace: 0, rTex: 0, rComp: 0, sFull: 0, sPatch: 0, sSame: 0, iRep: 0, iMov: 0, iKeep: 0, plDrawn: 0, plAnim: 0, plShift: 0, plSame: 0, sprites: 0,
	planeAcc: {} as Record<number, { draws: number; anim: number; items: number; sprites: number; placeMs: number; texMs: number }>, pixiInfo: "" };

/** called at the top of every animation frame, before the draw (liveClientView's pending rebuild). */
const frameHooks: (() => void)[] = [];
let hooksRanAt = -1;
let paintKeyAt = 0; // keydown time of the move that was just rebuilt; the next draw logs viewStats.keyPaint

/**
 * Draws a client view into `host` and keeps redrawing it every animation frame. Returns show(),
 * which swaps in a new view (the file dump once, or the worker's live snapshots).
 */
/** The page's one clock: frame times (clientView) and flick/appear times (liveClientView) all count from here. */
export const pageT0 = performance.now();
export interface ViewBackend { canvas: HTMLElement; render: (p: Prepared, showHud: boolean, frameTime: number) => void; /** The pane (CSS box, devicePixelRatio) changed since the last render: draw again at the new size. */ stale?: () => boolean }
export function clientView(host: HTMLElement, backend?: ViewBackend): (p: Prepared) => void {
	const mainCanvas = document.createElement("canvas");
	mainCanvas.className = "client-canvas";
	const mainCtx = mainCanvas.getContext("2d")!;
	// One canvas per plane, kept between redraws: a plane is redrawn only when the view changed or it
	// has animated items; otherwise its last drawing is composited again.
	const planeCanvases = new Map<number, { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; p: Prepared | null; hud: boolean }>();
	let sorted: ({ p: Prepared; hud: boolean } & SortedPrepared) | null = null;
	const maskCanvas = document.createElement("canvas"); // scratch: original alpha shape before a string tint
	const maskCtx = maskCanvas.getContext("2d")!;
	let current: Prepared | null = null;

	function render(p: Prepared, showHud: boolean, frameTime: number): void {
		const cw = p.canvasW, ch = p.canvasH;
		for (const c of [mainCanvas, maskCanvas]) if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
		if (sorted?.p !== p || sorted.hud !== showHud) sorted = { p, hud: showHud, ...sortPrepared(p, showHud) };
		const { byPlane, planes: sortedPlanes, animated } = sorted;

		mainCtx.clearRect(0, 0, cw, ch);
		for (const plane of sortedPlanes) {
			let pc = planeCanvases.get(plane);
			if (!pc) {
				const canvas = document.createElement("canvas");
				planeCanvases.set(plane, (pc = { canvas, ctx: canvas.getContext("2d")!, p: null, hud: showHud }));
			}
			const { canvas: planeCanvas, ctx: planeCtx } = pc;
			const master = showHud ? p.masters.get(plane) : undefined;
			let redraw = pc.p !== p || pc.hud !== showHud || animated.has(plane);
			if (planeCanvas.width !== cw || planeCanvas.height !== ch) { planeCanvas.width = cw; planeCanvas.height = ch; redraw = true; }
			if (redraw) {
				pc.p = p;
				pc.hud = showHud;
				planeCtx.clearRect(0, 0, cw, ch);
				for (const it of byPlane.get(plane) ?? []) {
					// Each item's own blend_mode within its plane: e.g. see_through_darkness is BLEND_ADD
					// on the lighting plane, so it only brightens; drawn plain, it blacked out the whole view.
					planeCtx.globalCompositeOperation = compositeOp(it.appearance.blendMode);
					if (it.hk) { planeCtx.save(); planeCtx.translate(it.hk.dx, it.hk.dy); planeCtx.scale(it.hk.k, it.hk.k); } // pt-zoom3
					if (isLighting(it.appearance)) drawLighting(planeCtx, it.appearance, icons, it.originX, it.originY, frameTime, frameTime - (it.appearance.appearedT0 ?? 0));
					else drawAppearance(planeCtx, it.appearance, icons, it.originX, it.originY, frameTime, frameTime - (it.appearance.appearedT0 ?? 0));
					if (it.hk) planeCtx.restore();
				}
				planeCtx.globalCompositeOperation = "source-over";
				if (master?.color != null) {
					if (Array.isArray(master.color) && isAlphaToWhite(master.color)) {
						// Fast path for tg's parallax_white "whitifier" (r = g = b = a = source alpha): white,
						// keeping each pixel's alpha. Same result as the matrix below, without reading pixels back.
						planeCtx.globalCompositeOperation = "source-in";
						planeCtx.fillStyle = "#fff";
						planeCtx.fillRect(0, 0, cw, ch);
						planeCtx.globalCompositeOperation = "source-over";
					} else if (Array.isArray(master.color)) {
						// A full-plane color matrix (e.g. parallax_white's "whitifier"): applied to the whole
						// plane canvas, including pixels this plane drew nothing on -- that's the point of a
						// backdrop/whitifier plane master (see plane_master.dm's comment on why they exist).
						const img = planeCtx.getImageData(0, 0, cw, ch);
						applyColorMatrix(img.data, master.color);
						planeCtx.putImageData(img, 0, 0);
					} else {
						// A plain color/name tint: multiply the whole canvas by it, then mask back to this
						// plane's own drawn alpha shape (same two-step approach as station-client.ts's
						// tintedRect: draw source-over multiply first, then destination-in a copy of the
						// pre-tint content to restore transparency where nothing was drawn).
						maskCtx.clearRect(0, 0, cw, ch);
						maskCtx.drawImage(planeCanvas, 0, 0);
						planeCtx.globalCompositeOperation = "multiply";
						planeCtx.fillStyle = master.color;
						planeCtx.fillRect(0, 0, cw, ch);
						planeCtx.globalCompositeOperation = "destination-in";
						planeCtx.drawImage(maskCanvas, 0, 0);
						planeCtx.globalCompositeOperation = "source-over";
					}
				}
			}
			mainCtx.save();
			mainCtx.globalAlpha = (master?.alpha ?? 255) / 255;
			mainCtx.globalCompositeOperation = compositeOp(master?.blendMode ?? 0);
			mainCtx.drawImage(planeCanvas, 0, 0);
			mainCtx.restore();
		}
	}

	host.innerHTML = "";
	host.appendChild(backend ? backend.canvas : mainCanvas);
	const hudCheckbox = document.getElementById("hud-toggle") as HTMLInputElement | null;

	// --- animation -------------------------------------------------------------------------------
	// BYOND starts an icon's animation when its appearance is first shown to the client; this page
	// has no such per-atom "first shown" moment to reproduce, so every atom on the page starts its
	// animation together, at page load -- a fine stand-in here (every
	// atom showing the same icon_state stays in sync with each other, which is the visible thing to
	// check by eye; it just means a mid-cycle BYOND screenshot could show a different frame than this
	// page does at the same wall-clock moment, which nothing here can observe anyway).
	//
	// Redraws every animation frame rather than baking (unlike station-client.ts's one-shot bake):
	// this scene is at most view*2+1 tiles across (15x15 for the default view=7), so redoing the
	// whole plane-composite pass every frame is cheap -- nowhere near station-client.ts's 65k-tile
	// scale, which is why that page still bakes once and stays static (left alone).
	// redraw only when there is a new view, the HUD toggle changed, or (animated views) a new decisecond
	// started (BYOND frame delays are whole deciseconds, at tg's tick_lag).
	const animationStartMs = pageT0; // one clock: the same start as liveClientView's t0 (flick/appear times count from it), and as every other view on the page
	let lastRafMs = 0;
	let drawn: Prepared | null = null, drawnHud = true, drawnDs = -1, aspect = 0, viewRatio = "";
	function tick(nowMs: number): void {
		if (nowMs !== hooksRanAt) { hooksRanAt = nowMs; for (const f of frameHooks) f(); } // apply a pending rebuild first, so this frame draws the new view (it used to show one frame late); once per frame even with two views (?renderer=both)
		viewStats.rafs++;
		if (current?.gliding && viewStats.glideGaps.length < 5000) viewStats.glideGaps.push(Math.round(nowMs - lastRafMs));
		if (lastRafMs && nowMs - lastRafMs > 100 && viewStats.longFrames.length < 1000) viewStats.longFrames.push(Math.round(nowMs - lastRafMs)); // F9 perf line: stutters
		lastRafMs = nowMs;
		const frameTime = (nowMs - animationStartMs) / 100; // deciseconds since page load
		const hud = hudCheckbox?.checked ?? true, ds = Math.floor(frameTime);
		if (current && (current !== drawn || hud !== drawnHud || (current.animated && ds !== drawnDs) || backend?.stale?.())) {
			const newView = current !== drawn;
			drawn = current; drawnHud = hud; drawnDs = ds;
			const boxW = current.boxW ?? current.canvasW, box = boxW / current.canvasH, vr = String(current.canvasW / current.canvasH);
			if (vr !== viewRatio) { viewRatio = vr; host.style.setProperty("--vr", vr); } // the canvas's own shape: wider than the box that shows when zoomed (boxWidth)
			if (Math.abs(box - aspect) > 1e-6) { // the shape that shows changed (widescreen on/off): CSS keeps its aspect (--ar), the page can refit its panes
				aspect = box;
				host.style.setProperty("--ar", String(box));
				host.dispatchEvent(new CustomEvent("viewaspect", { bubbles: true, detail: { w: boxW, h: current.canvasH } }));
			}
			const t = performance.now();
			(backend ? backend.render : render)(current, hud, frameTime);
			const ms = performance.now() - t;
			viewStats.renders++;
			viewStats.renderMs += ms;
			if (viewStats.redrawTimes.length < 100000) viewStats.redrawTimes.push(Math.round(ms * 10) / 10);
			if (current.gliding) { viewStats.glideFrames++; viewStats.glideMs += ms; if (viewStats.glideTimes.length < 10000) viewStats.glideTimes.push(Math.round(ms * 10) / 10); }
			if (paintKeyAt) { viewStats.keyPaint.push(Math.round(performance.now() - paintKeyAt)); paintKeyAt = 0; } // keydown to the frame that draws the move (render call returned; the browser paints right after)
			if (newView) { viewStats.newViewRenders++; viewStats.newViewMs += ms; if (viewStats.newViewTimes.length < 10000) viewStats.newViewTimes.push(Math.round(ms * 10) / 10); }
		}
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
	return (p) => { current = p; };
}

/** The live view for the worker page (per-tick updates): call it with each ViewUpdate the
 *  worker posts (client-view.ts's ViewDiffer). The page keeps the view keyed per object (appearance by id,
 *  each tile's id list), applies each update at once, and rebuilds the draw items at most once per frame,
 *  only when something changed. `resync` is called when an update is missing (the worker then sends a
 *  full one); updates until that full one are ignored. */
export interface PointerInfo {
	/** What is under the pointer (null: nothing clickable), by BYOND's mouse_opacity rule (hit-test.ts). */
	hit: Hit | null;
	/** Pointer in canvas pixels (whole), and the canvas size. */
	px: number;
	py: number;
	canvasW: number;
	canvasH: number;
	/** The map tile drawn under the pointer, in world coordinates (the camera glide offset is taken into account). */
	tile: [number, number] | null;
	/** The view id of the object hit (map atom or screen object), or null. */
	id: number | null;
}
export function liveClientView(host: HTMLElement, resync: () => void, sendStep: (dir: number) => void = () => {}): {
	update: (u: ViewUpdate) => void;
	check: (dump: ClientDump) => string[];
	pointAt: (clientX: number, clientY: number) => PointerInfo | null;
	locate: (spec: string) => { x: number; y: number } | null;
	/** movement prediction: a key press or release (BYOND key name); the first call turns prediction on */
	predictKey: (key: string, down: boolean) => void;
	/** netcode 2: a plain left click on screen object `id`: the toggle it makes shows at once, the server's next view confirms or corrects it */
	predictClick: (id: number, params: string) => void;
	/** netcode 2: a plain middle click anywhere: tg swaps hands (MiddleClickOn) */
	predictSwap: () => void;
	/** netcode 3: a plain left click on a map tile with throw mode on: the held item leaves the hand at once */
	predictThrow: () => void;
	/** predicted pick-up: a plain left click on map object `id`: an item the server listed in pick, within reach, goes into the empty active hand at once */
	predictPick: (id: number) => void;
	/** predicted put-down: a plain left click on map object `id` (params: the click's) or a key press: the held item goes on a table or rack the server listed in put, or on your tile for its drop keys */
	predictPut: (id: number | null, params: string, key?: string) => void;
	/** the driver: the look of the screen object whose type contains TEXT ("hud:hand#2" picks the second) */
	hudState: (spec: string) => string;
} {
	// PixiJS by default; ?renderer=canvas keeps the canvas 2D path; ?renderer=both draws the same views with both,
	// side by side at native size (for the pixel diff). Pixi starts async: the first view waits for it.
	const mode = new URLSearchParams(location.search).get("renderer");
	let early: Prepared | null = null;
	let showPixi: (p: Prepared) => void = (p) => { early = p; };
	let showCanvas: (p: Prepared) => void = () => {};
	if (mode === "canvas" || mode === "both") {
		if (mode === "both") {
			host.style.cssText = "display:flex;--sz:480px";
			document.head.append(Object.assign(document.createElement("style"), { textContent: ".client-canvas{width:480px!important;height:480px!important}" }));
			const h2 = document.createElement("div");
			host.append(h2);
			showCanvas = clientView(h2);
		} else showCanvas = clientView(host);
		if (mode === "canvas") showPixi = () => {};
	}
	if (mode !== "canvas") {
		const h1 = mode === "both" ? document.createElement("div") : host;
		if (mode === "both") host.prepend(h1);
		// ?pd=0 keeps today's view-size canvas (the pixel-diff reference); ?renderer=pd shows the screen-size view and adds window.pdDiff (pixi-diff.ts).
		const loadBackend = mode === "pd" ? import("./pixi-diff.js").then((m) => m.createPdBackend()) : import("./pixi-view.js").then((m) => m.createPixiBackend({ screen: new URLSearchParams(location.search).get("pd") !== "0" }));
		void loadBackend.then((b) => { showPixi = clientView(h1, b); if (early) showPixi(early); });
	}
	const show = (p: Prepared): void => { showPixi(p); showCanvas(p); };
	const apps = new Map<number, BuiltAppearance>();
	const tiles = new Map<number, { x: number; y: number; ids: number[] }>(); // key x + y * 65536
	let screen: [number, string, unknown][] = [];
	let last: ViewUpdate | null = null;
	// Gliding: a movable atom that stepped one tile draws at its new tile plus an offset (px, east+ / north+, from its
	// start) that shrinks to 0 at glide_size px per server tick (BYOND's rules). The camera glides with the eye.
	// tx, ty (movement prediction): where the glide ends, if not on the tile itself; it stays there until the server's move comes.
	const glides = new Map<number, Glide>();
	const glideSlow = Number(new URLSearchParams(location.search).get("glideslow")) || 1; // ?glideslow=8: glides 8x slower, to catch them in screenshots
	let camGlide: Glide | null = null, camFresh = false; // camFresh: a camera glide started that no frame has drawn yet (latency)
	// lag-smoothing step 4, movement prediction (multiplayer only, ?predict=0 off): a direction key moves your own mob and the camera at once,
	// one tile at most ahead of the server, onto a tile the server called free (u.pred). The server's own step then takes over the glide where it
	// is; a different step, or none within the timeout (a door, a stun), glides back to where the server has the mob.
	// the page sends each step itself (sendStep, at the mob's walking pace) instead of held direction keys, and the server takes exactly
	// those (Clients.step): a key let go can't add a step the page never drew. A step is drawn ahead only when the server has finished every
	// step sent before it (u.steps counts them) or drawn ahead itself.
	// up to PRED_MAX steps drawn ahead (a ping longer than a step no longer makes every other step wait for the server), inside the
	// 7x7 square of free tiles the server sends (pred[1], bit (dy + 3) * 7 + dx + 3: 49 bits, past what << reaches). Three ahead since a Canada
	// VPN (ping ~400 ms): quick taps waited a ping with two. Steps past those go out at once all the same (up to QUEUE_MAX unanswered) and are
	// drawn as the server answers the ones before: holding them back made a run at ping > 3 steps go in bursts, 3 steps then a pause.
	const PRED_MAX = 3, QUEUE_MAX = 8;
	let stepsSent = 0, stepsDone = 0, lastSentAt = -1e9;
	// The AI eye (u.predRun = [sprint, acceleration]): AIMove moves it ceil(max(sprint, 10) / 20) tiles a step; sprint grows 0.5 a step up to 50
	// (acceleration on) and is back to 10 after half a second without a step. The server's sprint counts the steps it took; ours adds the ones
	// still unanswered. runFrom: the step sent after such a pause, until the server has taken it (its sprint is from before the pause till then).
	let run: [number, number] | null = null, runFrom = -1;
	const runTiles = (): number => {
		if (!run) return 1;
		const k = stepsSent - 1, s = !run[1] ? 10 : runFrom >= 0 && stepsDone <= runFrom ? 10 + 0.5 * (k - runFrom) : run[0] + 0.5 * (k - stepsDone);
		return Math.ceil(Math.max(10, Math.min(50, s)) / 20);
	};
	let drawnAt: number[] | null = null, jumpPrev = 0; // jumpPrev: px moved at the last look // your mob's and the camera's drawn spots (x, y px) at the last look, and its time (predJumps)
	let predOn = false, pred: number[] | null = null;
	let pending: { id: number; dx: number; dy: number; tiles: number; dir: number; at: number; rest: boolean; drawn: boolean; n: number }[] = []; // steps sent and not yet answered, oldest first; the first ones (up to PRED_MAX) drawn ahead; tiles 0: a turn in place
	// A mech (u.predTurn): a key in a direction it doesn't face only turns it (domove -> mechturn), one step's time like a step. The facing is
	// that of the last step or turn sent, else the server's.
	let turnFirst = false;
	const predFree = (dx: number, dy: number): boolean => Math.abs(dx) <= PRED_MAX && Math.abs(dy) <= PRED_MAX && !!pred && Math.floor(pred[1] / 2 ** ((dy + PRED_MAX) * (2 * PRED_MAX + 1) + dx + PRED_MAX)) % 2 === 1;
	const heldDirs: number[] = []; // direction bits held down, in press order
	let tap = 0; // the last direction pressed, until a step is sent: a tap let go before the walking pace allowed a step still makes one
	let lastStepAt = -1e9, lastConfirmAt = -1e9, stepMs = 0;
	const confirmMs: number[] = []; // keypress (from standing still) to the server's step, recent
	const predTimeout = (): number => {
		const s = [...confirmMs].sort((a, b) => a - b), p = viewStats.pingRecent;
		const t = s.length ? Math.max(250, Math.min(1500, 2 * s[Math.floor(s.length * 0.9)] + 100)) : 600;
		// never before the slowest recent ping could have answered (a Japan VPN, ping 1-3.6 s: every guess used to glide back, then the step came)
		return p.length ? Math.max(t, Math.min(6000, Math.max(...p) + 300 + (stepMs || 200))) : t;
	};
	const predGlide = (old: Glide | null | undefined, tx: number, ty: number, ms: number, now: number): Glide => predGlideAt(old, tx, ty, ms, now, TILE_PX);
	// The mob's images (a speech bubble, pred[2..]) draw with the mob's own glide: a copy of it, set wherever prediction sets the mob's.
	const predImgs = (id: number): void => {
		if (!pred || pred[0] !== id) return;
		const g = glides.get(id);
		for (let i = 2; i < pred.length; i++) { if (g) glides.set(pred[i], { ...g }); else glides.delete(pred[i]); markId(pred[i]); }
	};
	// netcode 4: your mob faces the way it steps or bumps at once (/atom/movable/Move ends in setDir(direct), blocked or not). Straight steps only.
	// The page draws a copy of the server's look with the dir swapped on every layer that shares the root's (clothes, hair: overlays with no dir
	// of their own); once the server has finished that step (u.steps), its own look comes back, turned or not.
	let faced: { id: number; dir: number; server: BuiltAppearance; n: number } | null = null;
	const turned = (a: BuiltAppearance, dir: number): BuiltAppearance =>
		({ ...a, dir, overlays: a.overlays.map((o) => (o.dir === a.dir ? { ...o, dir } : o)) });
	const face = (id: number, dx: number, dy: number, n: number): void => {
		if (dx && dy) return;
		const dir = dx > 0 ? 4 : dx < 0 ? 8 : dy > 0 ? 1 : 2, server = faced?.id === id ? faced.server : apps.get(id);
		if (!server) return;
		faced = { id, dir, server, n };
		if (apps.get(id)!.dir !== dir) { apps.set(id, turned(server, dir)); viewStats.predFace++; markId(id); schedule(); }
	};
	const unface = (): void => {
		if (!faced) return;
		if (faced.server.dir === faced.dir) viewStats.predFaceOk++; else viewStats.predFaceWrong++;
		apps.set(faced.id, faced.server); markId(faced.id); schedule();
		faced = null;
	};
	// netcode 5: a pulled thing (u.pull: [id, its tile minus the mob's server tile, blocks]) follows the drawn steps by tg's rule (/mob/living/Move):
	// after the puller steps, a pulled thing now more than a tile away, or diagonal to it, moves into the tile the puller left, except on the second
	// half of a diagonal step (atoms_movable Move: vertical half first, then horizontal, then the rule runs once more for the whole step). Tiles
	// are counted from the mob's server tile, east+/north+. Its target is worked out afresh from the server's offset and the drawn steps.
	let pull: number[] | null = null, pullPred = -1; // pullPred: the id whose glide has a target we set
	const pullMove = (fx: number, fy: number, tx: number, ty: number, p: [number, number], second: boolean): void => {
		const ex = p[0] - tx, ey = p[1] - ty;
		if (Math.max(Math.abs(ex), Math.abs(ey)) > 1 || (!second && ex && ey)) { p[0] = fx; p[1] = fy; }
	};
	const pullAfter = (p: [number, number], ax: number, ay: number, dx: number, dy: number): void => {
		if (dx && dy) {
			pullMove(ax, ay, ax, ay + dy, p, false);
			pullMove(ax, ay + dy, ax + dx, ay + dy, p, true);
		}
		pullMove(ax, ay, ax + dx, ay + dy, p, false);
	};
	const predPull = (now: number, ms = stepMs || 150): void => {
		let tx = 0, ty = 0, id = -1;
		if (pred && pull) {
			id = pull[0];
			const p: [number, number] = [pull[1], pull[2]];
			let ax = 0, ay = 0;
			for (const q of pending) if (q.drawn) { pullAfter(p, ax, ay, q.dx, q.dy); ax += q.dx; ay += q.dy; }
			tx = (p[0] - pull[1]) * TILE_PX; ty = (p[1] - pull[2]) * TILE_PX;
		}
		if (pullPred >= 0 && pullPred !== id) { // no longer pulling it: back to the tile the server has it on
			const g0 = glides.get(pullPred);
			if (g0 && (g0.tx || g0.ty)) { glides.set(pullPred, predGlide(g0, 0, 0, 150, now)); markId(pullPred); schedule(); }
			pullPred = -1;
		}
		if (id < 0) return;
		const g = glides.get(id);
		if (g ? (g.tx ?? 0) === tx && (g.ty ?? 0) === ty : !tx && !ty) return;
		glides.set(id, predGlide(g, tx, ty, ms, now));
		pullPred = id;
		viewStats.predPull++;
		markId(id);
		schedule();
	};
	const predBack = (now: number): void => { // the guess was wrong: glide back to the tile the server has
		unface();
		if (!pending.length) return;
		const id = pending[0].id;
		pending = [];
		const g = glides.get(id);
		if (g) { glides.set(id, predGlide(g, 0, 0, 150, now)); markId(id); predImgs(id); }
		if (camGlide) camGlide = predGlide(camGlide, 0, 0, 150, now);
		predPull(now, 150);
		schedule();
	};
	// Steps go out on a timer at the walking pace: a frame hook alone would wait for frames, and a still scene draws none.
	let stepTimer: ReturnType<typeof setTimeout> | undefined, stepHeld = false;
	const predStep = (now: number): void => {
		stepNow(now);
		clearTimeout(stepTimer);
		if (predOn && (heldDirs.length || tap)) stepTimer = setTimeout(() => predStep(performance.now()), Math.max(stepHeld ? 16 : 0, lastStepAt + (stepMs || 200) - performance.now()));
	};
	const skip = (why: string): void => { if (why !== viewStats.predSkip.last) { viewStats.predSkip.last = why; viewStats.predSkip[why] = Number(viewStats.predSkip[why] ?? 0) + 1; } };
	// Draws the sent steps not drawn yet, while fewer than PRED_MAX are drawn ahead and each lands on a tile the server called free. One that
	// doesn't leaves pending with the ones after it: unanswered and undrawn, they hold the next keys until the server has answered them.
	const drawNext = (now: number): void => {
		if (!pred) return;
		let ax = 0, ay = 0, nd = 0; // where the mob is drawn heading, from the server's tile
		const pp: [number, number] | null = pull ? [pull[1], pull[2]] : null; // and the pulled thing
		for (const [i, q] of pending.entries()) {
			if (q.drawn) { if (pp) pullAfter(pp, ax, ay, q.dx, q.dy); ax += q.dx; ay += q.dy; nd++; continue; }
			if (nd >= PRED_MAX || q.id !== pred[0]) return;
			if (!q.tiles) { q.drawn = true; nd++; face(q.id, q.dir & 4 ? 1 : q.dir & 8 ? -1 : 0, q.dir & 1 ? 1 : q.dir & 2 ? -1 : 0, q.n); viewStats.predTurns++; continue; } // a turn in place
			const { id, dx, dy } = q, walk = (stepMs || 150) / q.tiles; // a tile's time: an AI eye's step of several tiles takes one step's time
			if (nd && Math.max(Math.abs(ax + dx), Math.abs(ay + dy)) > PRED_MAX) return skip("far"); // AI eye steps: never more than PRED_MAX tiles ahead (the tiles sent end there)
			if (pp && pull![3] && ((pp[0] === ax + dx && pp[1] === ay + dy) || (dx && dy && ((pp[0] === ax + dx && pp[1] === ay) || (pp[0] === ax && pp[1] === ay + dy))))) return skip("pulled"); // a dense thing in the way: the server decides (swap, bump)
			let past = true; // an eye's step of several tiles: each tile on the way (a xenobio eye stops at its area's edge)
			for (let k = 1; k < q.tiles; k++) past &&= predFree(ax + Math.sign(dx) * k, ay + Math.sign(dy) * k);
			if (!past || !predFree(ax + dx, ay + dy) || (dx && dy && !(predFree(ax + dx, ay) && predFree(ax, ay + dy)))) {
				if (i === nd) face(id, dx, dy, q.n); // the next step the server tries: it bumps, and Move turns the mob all the same
				pending.length = i; return skip("blocked");
			}
			viewStats.predSkip.last = "";
			// From standing still, the first step takes as long as the server's answer usually does, less the steps that may be drawn ahead after it
			// (up to 400 ms): with a ping longer than that, a step at walking speed would stand ahead waiting, then walk on (a hitch at every start).
			const ms = q.rest && !nd && confirmMs.length ? Math.max(walk, Math.min(400, [...confirmMs].sort((a, b) => a - b)[confirmMs.length >> 1] - (PRED_MAX - 1) * walk)) : walk;
			if (pp) pullAfter(pp, ax, ay, dx, dy);
			ax += dx; ay += dy; nd++;
			q.drawn = true;
			face(id, dx, dy, q.n);
			glides.set(id, predGlide(glides.get(id), ax * TILE_PX, ay * TILE_PX, ms, now));
			predImgs(id);
			predPull(now, ms);
			camGlide = predGlide(camGlide, ax * TILE_PX, ay * TILE_PX, ms, now);
			camFresh = true;
			viewStats.predSteps++;
			markId(id);
			schedule();
		}
	};
	const stepNow = (now: number): void => {
		if (!predOn || (!heldDirs.length && !tap)) return;
		if (now < lastStepAt + (stepMs || 200)) return;
		let d = 0;
		for (const b of heldDirs) d |= b;
		if ((d & 3) === 3) d &= ~3; // as clients.ts mergeMoves: opposite keys cancel
		if ((d & 12) === 12) d &= ~12;
		if (tap && !heldDirs.includes(tap)) d = tap;
		if (!d) { tap = 0; return; }
		const ahead = stepsSent - stepsDone > pending.length && now - lastSentAt < 1000; // a step sent but not drawn is unfinished (1 s: a step message the server dropped as a flood is never counted)
		// Held, not sent: a step sent outside pending (a bump the server took, QUEUE_MAX unanswered) made every later one wait too, until the
		// keys paused for a ping (a Canada VPN: one wall bump, then 40 steps each a ping late). Held until the server answers, it goes out and is
		// drawn at once; the server still has the steps before it to walk meanwhile, so it doesn't fall behind.
		stepHeld = !!pred && !!last?.eyeTile && (ahead || pending.length >= QUEUE_MAX) && !(pending.length && pending[0].id !== pred[0]);
		if (stepHeld) return skip("held");
		tap = 0;
		sendStep(d);
		if (run && now - lastSentAt > 500) runFrom = stepsSent;
		stepsSent++; lastSentAt = now;
		const rested = now - Math.max(lastStepAt, lastConfirmAt), pace = stepMs || 200;
		lastStepAt = now - lastStepAt < pace + 50 ? lastStepAt + pace : now; // walking on: keep the server's cadence (frames would add ~8 ms a step)
		if (!pred || !last?.eyeTile) return skip("off");
		if (ahead || pending.length >= QUEUE_MAX || (pending.length && pending[0].id !== pred[0])) return skip("waiting");
		const facing = pending.length ? pending[pending.length - 1].dir : apps.get(pred[0])?.dir;
		const tiles = turnFirst && facing !== d ? 0 : runTiles(), dx = d & 4 ? tiles : d & 8 ? -tiles : 0, dy = d & 1 ? tiles : d & 2 ? -tiles : 0;
		pending.push({ id: pred[0], dx, dy, tiles, dir: d, at: now, rest: rested > 2 * (stepMs || 150), drawn: false, n: stepsSent });
		drawNext(now);
	};
	// Your mob as drawn (its server tile plus its glide), px: a frame that moves it most of a tile at once, and much more than the last, is a jump (predJumps). ?jumpprobe=1
	// also looks every 16 ms, for headless runs that draw no frames.
	const jumpProbe = (now: number): void => {
		const e = last?.eyeTile;
		if (!pred || !e) return;
		const g = glides.get(pred[0]), o = (g && glideAt(g, now)) ?? [0, 0], c = (camGlide && glideAt(camGlide, now)) ?? [0, 0];
		const at = [e.x * TILE_PX + o[0], e.y * TILE_PX + o[1], e.x * TILE_PX + c[0], e.y * TILE_PX + c[1], now];
		if (drawnAt && viewStats.predJumps.length < 20) {
			const dm = [at[0] - drawnAt[0], at[1] - drawnAt[1]], dc = [at[2] - drawnAt[2], at[3] - drawnAt[3]];
			const step = Math.max(...dm.map(Math.abs), ...dc.map(Math.abs));
			if (step >= 24 && step > 2 * jumpPrev + 8) // a fast mover (an AI eye, 3 tiles a tick) moves that far every look: only a sudden change counts
				viewStats.predJumps.push(`${Math.round(now)}ms (+${Math.round(now - drawnAt[4])}) mob ${dm} cam ${dc} px, glide ${g ? `${g.ox},${g.oy}->${g.tx ?? 0},${g.ty ?? 0} ${Math.round(now - g.t0)}/${Math.round(g.ms)} ms` : "none"}, cam ${camGlide ? `${camGlide.ox},${camGlide.oy}->${camGlide.tx ?? 0},${camGlide.ty ?? 0} ${Math.round(now - camGlide.t0)}/${Math.round(camGlide.ms)} ms` : "none"}, drawn ahead ${pending.filter((q) => q.drawn).length} of ${pending.length}, sent-done ${stepsSent - stepsDone}`);
			jumpPrev = step;
		}
		drawnAt = at;
	};
	if (new URLSearchParams(location.search).get("jumpprobe") === "1") setInterval(() => jumpProbe(performance.now()), 16);
	frameHooks.push(() => {
		if (!predOn) return;
		const now = performance.now();
		if (hidden.size) for (const [id, at] of hidden) if (now - at > PREDICT_HIDE_MS) { hidden.delete(id); schedule(); } // no answer: show it again
		if (picked.size) for (const [id, p] of picked) if (now - p.at > Math.max(PREDICT_HIDE_MS, predTimeout())) { picked.delete(id); unhand(p); viewStats.predPickBack++; markId(id); schedule(); }
		if (flies.length && flies.some((f) => now - f.at > flyKeep())) flies = flies.filter((f) => now - f.at <= flyKeep());
		if (placed.size) for (const [id, p] of placed) {
			if (!p.landed && now - p.at > Math.max(PREDICT_HIDE_MS, predTimeout())) { unput(id, p); viewStats.predPutBack++; schedule(); }
			else if (p.landed && now - p.at > flyKeep()) { placed.delete(id); markId(id); schedule(); } // the server's slide and in-hand sprite had their time to come
		}
		if (pending.length && now - pending[0].at > predTimeout()) { viewStats.predLate++; predBack(now); }
		predStep(now);
		jumpProbe(now);
		if (pred && pred.length > 2 && glides.has(pred[0])) {
			const at = (id: number) => { const g = glides.get(id); return (g && glideAt(g, now)) ?? [0, 0]; }, m = at(pred[0]);
			viewStats.predImgFrames++;
			for (let i = 2; i < pred.length; i++) { const b = at(pred[i]); viewStats.predImgGap = Math.max(viewStats.predImgGap, Math.abs(b[0] - m[0]) + Math.abs(b[1] - m[1])); }
		}
		if (pred && pull && glides.has(pred[0])) { // the pulled thing's distance from the mob as drawn, px (a tile = 32 when it trails)
			const at = (id: number) => { const g = glides.get(id); return (g && glideAt(g, now)) ?? [0, 0]; }, m = at(pred[0]), b = at(pull[0]);
			const gap = Math.max(Math.abs(pull[1] * TILE_PX + b[0] - m[0]), Math.abs(pull[2] * TILE_PX + b[1] - m[1]));
			viewStats.predPullFrames++;
			viewStats.predPullGap = Math.max(viewStats.predPullGap, Math.round(gap));
			if (gap > 1.5 * TILE_PX) viewStats.predPullFar++;
		}
	});
	const DIR_BITS: Record<string, number> = { NORTH: 1, SOUTH: 2, EAST: 4, WEST: 8 };
	const predictKey = (key: string, down: boolean): void => {
		predOn = true;
		const b = DIR_BITS[key];
		if (!b) return;
		const i = heldDirs.indexOf(b);
		if (i >= 0) heldDirs.splice(i, 1);
		if (down) { heldDirs.push(b); tap = b; predStep(performance.now()); }
	};
	const { predictClick, predictThrow, swapHands, hidden, setHudHint } = makePredictHud({ apps, get screen() { return screen; }, viewStats, schedule: () => schedule() });
	// Predicted pick-up: the server lists the items a plain left click would pick up (u.pick: id, tile minus the mob's), and the page checks the
	// rest: the item within reach of where it draws the mob (a diagonal one past a free side tile, as Adjacent), throw mode off, the active hand
	// empty. It leaves the floor and shows in the hand slot (on the HUD plane, as put_in_hand) until the server sends the item's look again, which
	// it does after running such a click (input.ts): a pick-up comes with the item on the screen list, a refused one shows it back on the floor.
	let pick: NonNullable<ViewUpdate["pick"]> | null = null;
	const picked = new Map<number, { at: number; loc: unknown; mob: number; hand: Appearance | null }>();
	const HUD_PLANE = 20, HANDS_LAYER = 3; // ABOVE_HUD_PLANE and ABOVE_HUD_LAYER; the in-hand sprites' overlay layer
	const predictPick = (id: number): void => {
		if (!predOn || !pred || !pick || picked.has(id)) return;
		const pk = pick.find((p) => p[0] === id);
		if (!pk) return;
		let ax = 0, ay = 0;
		for (const q of pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		const rx = pk[1] - ax, ry = pk[2] - ay;
		if (Math.abs(rx) > 1 || Math.abs(ry) > 1 || (rx && ry && !predFree(ax + rx, ay) && !predFree(ax, ay + ry))) return;
		const th = screen.find((s) => s[1] === "/obj/screen/throw_catch");
		if (th && apps.get(th[0])?.iconState === "act_throw_on") return;
		const hand = screen.find((s) => s[1].startsWith("/obj/screen/inventory/hand") && apps.get(s[0])?.overlays.some((o) => o.iconState === "hand_active"));
		if (!hand || hand[2] == null || screen.some((s) => s[2] === hand[2] && s[0] !== hand[0] && !s[1].startsWith("/obj/screen") && !hidden.has(s[0])) || [...picked.values()].some((p) => p.loc === hand[2])) return;
		const now = performance.now(), a = apps.get(id), t = [...tiles.values()].find((q) => q.ids.includes(id)), mob = pred[0], ma = apps.get(mob);
		// update_inv_hands: the item's in-hand sprite as an overlay of your mob, at -HANDS_LAYER (a floating layer: just above the mob, as resolveOverlay places it)
		const inHand: Appearance | null = ma && pk[3] ? { icon: pk[3], iconState: pk[4], dir: ma.dir, layer: ma.layer + (1000 - HANDS_LAYER) / 1000, plane: ma.plane, color: null, alpha: 255, transform: null,
			pixelX: 0, pixelY: 0, invisibility: 0, blendMode: 0, maptext: null, maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0 } : null;
		picked.set(id, { at: now, loc: hand[2], mob, hand: inHand });
		if (inHand && ma) { apps.set(mob, { ...ma, overlays: [...ma.overlays, inHand].sort((p, q) => p.plane - q.plane || p.layer - q.layer) }); markId(mob); }
		if (a && t) flies.push({ id, key: t.x + t.y * 65536, a, at: now, tx: -rx * TILE_PX, ty: -ry * TILE_PX });
		viewStats.predPick++;
		markId(id);
		schedule();
	};
	// tg's do_pickup_animation, drawn by the page at the click: a copy of the item flies from its tile to the mob (pixel_x/y to the mob, scaled
	// to 0.65, alpha to 175, 3 ds cubic), then fades out (2 ds). The server's own copy (an /image of the same icon and state at
	// ABOVE_ALL_MOB_LAYER on that tile) comes a ping later: it isn't drawn for this player.
	const FLY_MS = 300, FADE_MS = 200, ABOVE_ALL_MOB_LAYER = 4.5;
	let flies: { id: number; key: number; a: BuiltAppearance; at: number; tx: number; ty: number }[] = [];
	const flyLook = (f: (typeof flies)[number], now: number): BuiltAppearance | null => {
		const t = now - f.at;
		if (t >= FLY_MS + FADE_MS) return null;
		const k = ease(3, Math.min(1, t / FLY_MS)), sc = 1 - 0.35 * k, a = f.a;
		return { ...a, layer: ABOVE_ALL_MOB_LAYER, pixelX: a.pixelX + (f.tx - a.pixelX) * k, pixelY: a.pixelY + (f.ty - a.pixelY) * k, transform: [sc, 0, 0, 0, sc, 0],
			alpha: t < FLY_MS ? a.alpha + (175 - a.alpha) * k : 175 * (1 - (t - FLY_MS) / FADE_MS), overlays: a.overlays.map((o) => ({ ...o, layer: o.layer === a.layer ? ABOVE_ALL_MOB_LAYER : o.layer })) };
	};
	const flyKeep = (): number => Math.max(PREDICT_HIDE_MS, predTimeout()) + 1000; // how long the server's copy may take to come
	/** the server's copy of a fly the page drew itself: same icon and state on that tile, not the item */
	const serverFly = (key: number, id: number, a: BuiltAppearance): boolean =>
		a.layer === ABOVE_ALL_MOB_LAYER && flies.some((f) => f.key === key && f.id !== id && f.a.icon === a.icon && f.a.iconState === a.iconState);
	/** a refused pick-up: the guessed in-hand sprite comes off your mob (unless the server's look of it replaced it already) */
	const unhand = (p: { mob: number; hand: Appearance | null }): void => {
		const ma = apps.get(p.mob);
		if (p.hand && ma?.overlays.includes(p.hand)) { apps.set(p.mob, { ...ma, overlays: ma.overlays.filter((o) => o !== p.hand) }); markId(p.mob); }
	};
	const heldLook = (a: BuiltAppearance): BuiltAppearance => ({ ...a, plane: HUD_PLANE, layer: HUD_PLANE, pixelX: 0, pixelY: 0, overlays: a.overlays.map((o) => ({ ...o, plane: o.plane === a.plane ? HUD_PLANE : o.plane, layer: o.layer === a.layer ? HUD_PLANE : o.layer })) });
	// Predicted put-down: the server lists, with the held item (u.put), the tables and racks a plain left click puts it on and the keys that drop it
	// (putOf, client-view.ts). The page checks reach (as predictPick) and throw mode, takes the item out of the hand slot and its in-hand sprite
	// off your mob, and draws it on the floor at its floor layer and plane: on a table centred on the click (table attackby), sliding there from
	// where your mob is drawn (do_drop_animation, 3 ds cubic); dropped, on the tile your mob is drawn on (the server runs the key after the steps
	// sent before it). The server's copy lands a ping later on the same tile with the same look; its own slide is not played again. A refused
	// click (the answer sends the item's look again, still in the hand) or no answer within the step timeout puts it back.
	let put: NonNullable<ViewUpdate["put"]> | null = null;
	const placed = new Map<number, { at: number; key: number; a: BuiltAppearance; ox: number; oy: number; mob: number; ih: [string, string]; ours: BuiltAppearance | null; server: BuiltAppearance | null; click: boolean; landed: boolean; handGone: boolean }>();
	const SLIDE_MS = 300;
	/** the item's look on the floor: its held look at the floor layer and plane, overlays that went with it too */
	const floorLook = (a: BuiltAppearance, layer: number, plane: number, px: number, py: number): BuiltAppearance =>
		({ ...a, plane, layer, pixelX: px, pixelY: py, overlays: a.overlays.map((o) => ({ ...o, plane: o.plane === a.plane ? plane : o.plane, layer: o.layer === a.layer ? layer : o.layer })) });
	const slideLook = (a: BuiltAppearance, p: { at: number; ox: number; oy: number }, now: number): { a: BuiltAppearance; dyn: boolean } => {
		if (!p.ox && !p.oy) return { a, dyn: false };
		const t = now - p.at;
		if (t >= SLIDE_MS) return { a, dyn: false };
		const k = 1 - ease(3, t / SLIDE_MS);
		return { a: { ...a, pixelX: a.pixelX + p.ox * k, pixelY: a.pixelY + p.oy * k }, dyn: true };
	};
	/** your mob's look without the put-down item's in-hand sprite (update_inv_hands); the server's look is kept to put back */
	const strip = (p: { mob: number; ih: [string, string]; ours: BuiltAppearance | null; server: BuiltAppearance | null; handGone: boolean }): void => {
		const ma = apps.get(p.mob);
		if (!ma || ma === p.ours) return;
		const o = ma.overlays.filter((x) => !(x.icon === p.ih[0] && x.iconState === p.ih[1]));
		if (o.length === ma.overlays.length) { p.handGone = true; return; } // the server's look has it off already
		p.server = ma; p.ours = { ...ma, overlays: o };
		apps.set(p.mob, p.ours); markId(p.mob);
	};
	const unstrip = (p: { mob: number; ours: BuiltAppearance | null; server: BuiltAppearance | null }): void => {
		if (p.ours && p.server && apps.get(p.mob) === p.ours) { apps.set(p.mob, p.server); markId(p.mob); }
	};
	const unput = (id: number, p: (typeof placed) extends Map<number, infer V> ? V : never): void => { placed.delete(id); if (!p.landed) unstrip(p); dirty.add(p.key); markId(id); };
	const predictPut = (id: number | null, params: string, key?: string): void => {
		if (!predOn || !pred || !put || picked.size || [...placed.values()].some((q) => !q.landed)) return;
		const it = put.id, a = apps.get(it), mob = pred[0], mk = idx.get(mob);
		const old = placed.get(it);
		if (old) placed.delete(it); // the same item put down again (landed: its in-hand sprite stays off): the last one's slide is over
		if (!a || typeof mk !== "number" || hidden.has(it) || !screen.some((s) => s[0] === it)) return;
		let ax = 0, ay = 0;
		for (const q of pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		let tk: number, ox = 0, oy = 0, fl: BuiltAppearance;
		if (key !== undefined) {
			if (!put.keys.includes(key)) return;
			tk = mk + ax + ay * 65536;
			fl = floorLook(a, put.layer, put.plane, a.pixelX, a.pixelY);
		} else {
			const on = put.on.find((o) => o[0] === id), t = id === null ? undefined : idx.get(id);
			if (!on || typeof t !== "number") return;
			const rx = on[1] - ax, ry = on[2] - ay;
			if (Math.abs(rx) > 1 || Math.abs(ry) > 1 || (rx && ry && !predFree(ax + rx, ay) && !predFree(ax, ay + ry))) return;
			const th = screen.find((s) => s[1] === "/obj/screen/throw_catch");
			if (th && apps.get(th[0])?.iconState === "act_throw_on") return;
			const ix = /(?:^|;)icon-x=(\d+)/.exec(params), iy = /(?:^|;)icon-y=(\d+)/.exec(params), c = (v: number) => Math.max(-TILE_PX / 2, Math.min(TILE_PX / 2, v - 16));
			if (on[3] && (!ix || !iy)) return; // no click position: tg leaves pixel_x/y as they were
			tk = t; ox = -rx * TILE_PX; oy = -ry * TILE_PX;
			fl = floorLook(a, put.layer, put.plane, on[3] ? c(+ix![1]) : a.pixelX, on[3] ? c(+iy![1]) : a.pixelY);
		}
		const p: (typeof placed) extends Map<number, infer V> ? V : never = { at: performance.now(), key: tk, a: fl, ox, oy, mob, ih: put.ih, ours: null, server: null, click: key === undefined, landed: false, handGone: false };
		placed.set(it, p);
		strip(p);
		dirty.add(tk); markId(it);
		viewStats.predPut++;
		schedule();
	};
	// animate() and flick(): per object id. See anim.ts for the rules.
	const anims = new Map<number, ObjectAnims>();
	const flicks = new Map<number, { state: string; t0: number; ms: number }>();
	let animating = 0; // objects whose animation or flick was still running when current() last looked
	// Light fades: a lighting object whose look changed is drawn as a mix of its old look and the new one, moving from old to new over the time of the latest
	// glide: a carried light then slides with its carrier instead of jumping a tile per step. Lighting objects are BLEND_ADD (they add up on their plane), so
	// the looks are drawn with alphas that sum to 1: one at full alpha under another at part alpha would be too bright.
	// Per id: the looks oldest first, each later one coming in from its t0; the last is apps.get(id). 2017 tg sets the new colours at once.
	const lightFades = new Map<number, { a: BuiltAppearance; t0: number; ms: number }[]>();
	const lightFadeOn = new URLSearchParams(location.search).get("lightfade") !== "0"; // ?lightfade=0: lights change at once, as before
	// Carried light (carried-light.ts; ?carrylight=0 off): the light your mob carries is taken out of the server's lighting tiles and drawn as
	// lighting tiles of the page's own (ids CARRIED_ID0 down), redone on every update (applyCarried): the server's tiles and looks may have changed under it.
	// They stay put in the world, on the tiles round the corners the server's shape lights (the mask): walls cut the light off per tile, and a shape that
	// glided with the mob lit wall corners mid-step, then snapped back when the next shape came (the seclite flicker round corners in dark maint).
	// What moves with the mob as it is drawn (predicted steps too) is how strongly each corner is lit (strengthAt); a new mask fades in over the old one.
	// Each tile is drawn as one item per corner (that corner's row of the matrix, in the light's colour) at an alpha for its strength: alphas change
	// every frame, the four looks only when the light does.
	const CARRIED_ID0 = -1000000;
	const carryOn = new URLSearchParams(location.search).get("carrylight") !== "0";
	// Sight shadows (plans/archive/sight-shadows.md): soft shadows cast past walls from where the camera is drawn, over the box of opacity the server
	// sends (u.opq, only when it changes); dimmed with mesons/thermals, none for ghosts and the AI (shadowStrength). The look (ShadowMode) is
	// the player's pick in the ⚙ panel (localStorage "ss13-shadows", event "ss13-shadows" when it changes), tg's black squares by default;
	// ?shadows=0 / smooth / full overrides it.
	const shadowP = shadowPainter();
	const shadowQ = new URLSearchParams(location.search).get("shadows");
	const modeOf = (v: string | null): ShadowMode => (v === "smooth" || v === "full" ? v : "tg");
	const pickedMode = (): ShadowMode => { try { return modeOf(localStorage.getItem("ss13-shadows")); } catch { return "tg"; } };
	let shadowMode: ShadowMode = shadowQ !== null ? modeOf(shadowQ) : pickedMode();
	if (shadowQ === null) globalThis.addEventListener?.("ss13-shadows", () => { shadowMode = pickedMode(); forceNext = true; schedule(); });
	let opqNow: Opq | null = null, shadowVersion = 0;
	// Sight pop-in (plans/archive/sight-pop-in.md): with prediction the server sends what could be seen a step or two ahead (u.lum then comes with the
	// box's light); the page shows only what is seen from the tile it has stepped you to (sightNow, worked out again when that tile or the box
	// changes). Tiles it doesn't see are left out of the scene: black and unclickable, as tiles the server doesn't send.
	let lumNow: Lum | null = null, sightNow: PageSight | null = null, sightOpq: Opq | null = null, sightFrom: unknown[] = [];
	const sightHides = (sg: PageSight | null, x: number, y: number): boolean => sg !== null && !pageSees(sg, x, y);
	const updateSight = (u: ViewUpdate): void => {
		let ax = 0, ay = 0;
		if (pred) for (const q of pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
		const [hx, hy] = viewHalf(u.view), sid = Number((u.sight as { see_in_dark?: unknown } | null)?.see_in_dark ?? 0) || 0;
		const from = [opqNow, lumNow, ax, ay, hx, hy, sid];
		if (from.every((v, i) => v === sightFrom[i])) return;
		sightFrom = from;
		const next = opqNow && lumNow ? pageSight(opqNow, lumNow, ax, ay, hx, hy, sid) : null;
		for (const [k, t] of tiles) if (sightHides(sightNow, t.x, t.y) !== sightHides(next, t.x, t.y)) dirty.add(k);
		sightNow = next;
		sightOpq = next && opqNow ? withSight(opqNow, next) : null;
		viewStats.sightRuns++;
	};
	let carried: CarriedLight | null = null, carriedN = 0;
	const carriedTiles = new Map<number, number>(); // our id -> the tile key it was put on
	const lessened = new Map<number, { server: BuiltAppearance; ours: BuiltAppearance }>(); // real lighting objects drawn with the light taken out
	const wck = (wcx: number, wcy: number): number => wcx * 8192 + wcy; // a corner in world half tiles (odd)
	let mask = new Set<number>(), maskOld: Set<number> | null = null, maskFade = { t0: 0, ms: 1 }, appliedAt = { x: 0, y: 0 }; // appliedAt: the sources' applied turf
	let cornerLooks: BuiltAppearance[] = [], cornerKey = ""; // per matrix row (SW, SE, NW, NE): the light's look on that corner alone
	/** Our tile's draw looks at `now`: per corner the light reaches, its look at the alpha for the light there. dyn: it changes while the mob glides or the mask fades. */
	const carriedLooksAt = (id: number, now: number): { looks: BuiltAppearance[]; dyn: boolean } => {
		const key = carriedTiles.get(id), l = carried, at = l && idx.get(l.mob);
		if (key === undefined || !l || typeof at !== "number") return { looks: [], dyn: false };
		const g = glides.size ? glides.get(l.mob) : undefined, gv = (g && glideAt(g, now)) ?? [0, 0];
		const px = at % 65536 + gv[0] / TILE_PX - appliedAt.x, py = Math.floor(at / 65536) + gv[1] / TILE_PX - appliedAt.y; // the source as drawn, from the applied turf
		const k = maskOld ? Math.max(0, Math.min(1, (now - maskFade.t0) / maskFade.ms)) : 1, tx = key % 65536 - appliedAt.x, ty = Math.floor(key / 65536) - appliedAt.y;
		const looks: BuiltAppearance[] = [];
		cornersOf(tx, ty).forEach(([cx, cy], row) => {
			const w = 2 * appliedAt.x + cx, h = 2 * appliedAt.y + cy, wk = wck(w, h), m = (mask.has(wk) ? k : 0) + (maskOld?.has(wk) ? 1 - k : 0);
			const a = m > 0 ? 255 * Math.min(1, m * strengthAt(l, cx, cy, px, py)) : 0;
			if (a >= 0.5) looks.push({ ...cornerLooks[row], alpha: a });
		});
		return { looks, dyn: !!g || k < 1 };
	};
	const applyCarried = (fresh: number[] | undefined): void => {
		for (const [id, key] of carriedTiles) {
			const t = tiles.get(key);
			if (t && t.ids.includes(id)) { t.ids = t.ids.filter((i) => i !== id); idxDel(id, key); dirty.add(key); }
			apps.delete(id);
		}
		carriedTiles.clear(); carriedN = 0;
		for (const [id, e] of lessened) if (apps.get(id) === e.ours) { apps.set(id, e.server); markId(id); }
		lessened.clear();
		const was = carried;
		if (fresh) carried = carryOn ? parseLight(fresh) : null;
		if (!carried) { mask = new Set(); maskOld = null; return; }
		const l = carried, at = idx.get(l.mob);
		if (typeof at !== "number") return;
		const mx = at % 65536, my = Math.floor(at / 65536), now = performance.now();
		if (fresh) {
			const old = mask;
			appliedAt = { x: mx + l.ax, y: my + l.ay };
			mask = new Set([...l.bases.keys()].map((c) => { const cx = Math.floor(c / 8192) - 4096, cy = c % 8192 - 4096; return wck(2 * appliedAt.x + cx, 2 * appliedAt.y + cy); }));
			const going = maskOld && now < maskFade.t0 + maskFade.ms ? maskOld : null; // mid-fade: what the old mask still shows goes on fading out with it
			if (lightFadeOn && was && was.mob === l.mob && old.size) {
				maskOld = going ? new Set([...old, ...going]) : old;
				maskFade = { t0: now, ms: now - lastGlide.at < 500 ? Math.max(50, Math.min(400, lastGlide.ms)) : 100 };
			} else maskOld = null;
		}
		if (maskOld && now >= maskFade.t0 + maskFade.ms) maskOld = null;
		const ck = l.colour.join(",");
		const lightingOf = (key: number): number | undefined => tiles.get(key)?.ids.find((i) => { const a = apps.get(i); return i > CARRIED_ID0 && !!a && isLighting(a); });
		for (const [tx, ty] of l.tiles) { // the server's tiles under the light: the light taken out
			const rk = appliedAt.x + tx + (appliedAt.y + ty) * 65536, rid = lightingOf(rk);
			if (rid === undefined) continue;
			const server = apps.get(rid)!, m = lessLight(server.iconState, server.color, l, tx, ty);
			if (!m) continue;
			const ours = { ...server, iconState: "", color: m }; lessened.set(rid, { server, ours }); apps.set(rid, ours); markId(rid);
			for (const e of lightFades.get(rid) ?? []) if (e.a === server) e.a = ours; // a fade under way keeps it as a look to come: once the next update makes it an older look, it is drawn as it is (light doubled)
		}
		const ours = new Set<number>(); // the tiles round every corner the mask (old or new) lights
		for (const set of maskOld ? [mask, maskOld] : [mask]) for (const c of set) {
			const w = Math.floor(c / 8192), h = c % 8192;
			for (const x of [(w - 1) / 2, (w + 1) / 2]) for (const y of [(h - 1) / 2, (h + 1) / 2]) ours.add(x + y * 65536);
		}
		for (const ok of ours) {
			const oid = lightingOf(ok);
			if (oid === undefined) continue; // no lighting object there (space, an always-lit area): nothing to light
			if (cornerKey !== ck || !cornerLooks.length) {
				cornerKey = ck;
				cornerLooks = [0, 1, 2, 3].map((row) => { const m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; for (let k = 0; k < 3; k++) m[row * 4 + k] = l.colour[k]; return { ...apps.get(oid)!, iconState: "", color: m, alpha: 255, overlays: [] }; });
			}
			const id = CARRIED_ID0 - carriedN++, t = tiles.get(ok)!;
			apps.set(id, { ...cornerLooks[0], alpha: 0 }); // a stand-in (nothing) for the paths that take one look per id: carriedLooksAt draws it
			t.ids = [...t.ids, id];
			idxAdd(id, ok);
			dirty.add(ok);
			carriedTiles.set(id, ok);
		}
		viewStats.carriedTiles = carriedN; viewStats.lessenedTiles = lessened.size;
	};
	const preloadOn = new URLSearchParams(location.search).get("preload") !== "0"; // ?preload=0: no background download of the station's icon sheets
	let lastGlide = { ms: 0, at: -1e9 };
	const animNow = (id: number, a: BuiltAppearance, now: number): BuiltAppearance => {
		let out = a;
		const oa = anims.get(id);
		if (oa) {
			const vals = oa.values(now);
			if (!oa.seqs.length) anims.delete(id); else animating++;
			if (vals.size) {
				out = { ...a };
				for (const [n, v] of vals) {
					const f = SMOOTH[n] ?? SWITCH[n];
					if (f) (out as unknown as Record<string, AnimValue>)[f] = f === "iconState" ? (typeof v === "string" ? v : "") : v;
				}
				foldPixels(out, vals);
			}
		}
		const fl = flicks.get(id);
		if (fl) {
			if (now - fl.t0 >= fl.ms) flicks.delete(id);
			else { animating++; out = { ...out, iconState: fl.state, flickT0: (fl.t0 - t0) / 100 }; viewStats.flickFrames++; }
		}
		return out;
	};
	// client.pixel_x/pixel_y (+ animate(client) steps, id CLIENT_ANIM_ID in anims): shifts the whole map pane, screen objects too
	// (BYOND's map control scrolls as one; the skin background shows at the edge). The view moves by +pixel_x, so the picture moves by -pixel_x; y is up.
	let clientOff: [number, number] = [0, 0], appliedOff = "0,0";
	const clientOffNow = (now: number): [number, number] => {
		const oa = anims.get(CLIENT_ANIM_ID);
		if (!oa) return clientOff;
		const vals = oa.values(now);
		if (!oa.seqs.length) anims.delete(CLIENT_ANIM_ID); else animating++;
		return [(vals.get("pixel_x") as number | undefined) ?? clientOff[0], (vals.get("pixel_y") as number | undefined) ?? clientOff[1]];
	};
	const applyOff = (o: [number, number]): void => {
		const key = `${o[0]},${o[1]}`;
		if (key === appliedOff) return;
		appliedOff = key;
		viewStats.shakeApplied++; viewStats.shakeMax = Math.max(viewStats.shakeMax, Math.abs(o[0]), Math.abs(o[1]));
		const cv = host.querySelector("canvas");
		if (!cv) return;
		const vw = shown?.canvasW ?? cv.width; // the VIEW's width in px: the canvas itself may be smaller (drawn at screen size)
		const k = vw > 0 ? cv.clientWidth / vw : 1;
		cv.style.transform = o[0] || o[1] ? `translate(${-o[0] * k}px, ${o[1] * k}px)` : "";
		host.style.overflow = o[0] || o[1] ? "hidden" : "";
	};
	// pd-chunks2 probe: puts n animations of each kind on map objects (long ones, so a pdDiff sees them mid-way): flick() to a state with frames,
	// animate() of alpha + pixel_x, and an icon_state swap (what a door opening does). Returns what it used.
	(viewStats as Record<string, unknown>).animInject = (n: number): string[] => {
		const out: string[] = [], at = performance.now();
		let f = 0, a = 0, w = 0;
		for (const [id, ap] of apps) {
			if (!idx.has(id) || !ap.icon) continue;
			const ic = icons.get(ap.icon);
			if (!ic) continue;
			const st = ic.dmi.states.find((x) => x.name !== ap.iconState && x.frames > 1 && x.name);
			const sw = ic.dmi.states.find((x) => x.name !== ap.iconState && x.name);
			if (f < n && st) { flicks.set(id, { state: st.name, t0: at, ms: 600000 }); markId(id); out.push(`flick ${id} ${ap.icon} ${st.name}`); f++; }
			else if (a < n) { let oa = anims.get(id); if (!oa) anims.set(id, (oa = new ObjectAnims())); oa.step(at, true, 600000, 0, 0, 0, [["alpha", ap.alpha ?? 255, 90], ["pixel_x", 0, 12]] as StepVar[]); markId(id); out.push(`animate ${id} ${ap.icon} ${ap.iconState}`); a++; }
			else if (w < n && sw) { apps.set(id, { ...ap, iconState: sw.name }); markId(id); out.push(`swap ${id} ${ap.icon} ${ap.iconState}->${sw.name}`); w++; }
			if (f >= n && a >= n && w >= n) break;
		}
		fullDirty = true;
		return out;
	};
	// pd-screen probe: what applyOff does for offset (ox, oy), as the CSS transform and the canvas/view sizes it was worked out from; puts the real offset back.
	(viewStats as Record<string, unknown>).shakeProbe = (ox: number, oy: number): unknown => {
		const cv = host.querySelector("canvas");
		if (!cv) return null;
		const back = appliedOff.split(",").map(Number) as [number, number];
		appliedOff = ""; applyOff([ox, oy]);
		const out = { transform: cv.style.transform, canvasW: cv.width, viewW: shown?.canvasW ?? null, clientW: cv.clientWidth, expectPx: shown ? -ox * cv.clientWidth / shown.canvasW : null };
		appliedOff = ""; applyOff(back);
		return out;
	};
	(viewStats as Record<string, unknown>).tileItems = (x: number, y: number): DrawItem[] => scene.get(x + y * 65536)?.items ?? []; // light-fade test: one kept tile's draw items
	let waitingFull = false, scheduled = false, loading = false, iconsLate = false, forceNext = false; // iconsLate: drawn without some icons; forceNext: redraw every plane and chunk once
	let shown: Prepared | null = null; // the view last handed to the renderers: what the pointer is over
	const t0 = pageT0; // one clock (see clientView's animationStartMs)

	// the kept scene. Each tile's draw items stay between updates (in map pixels: x = tile x * 32, y = -tile y * 32, so the camera is one offset at
	// draw time); a rebuild redoes only the dirty tiles: those in an update's tile list, holding an id that came, went or moved, with a running glide, animate()
	// or flick() (up to and including the frame it ends on), or a new appearance. A full update, a z change or a new view/sight redoes them all.
	interface KeptTile { key: number; x: number; y: number; items: DrawItem[]; anim: boolean; dyn: boolean; gliding: number }
	const scene = new Map<number, KeptTile>();
	const dynTiles = new Set<number>(); // tiles built with a glide, animate() or flick() on one of their ids
	const dirty = new Set<number>();
	const chunks = new ChunkIndex((it) => relBox(it.appearance, icons)); // page-draw step 4: the kept items cut into chunks (keep() maintains it)
	let fullDirty = true, animTiles = 0, itemCount = 0, orderKeys: number[] | null = null, flatCache: DrawItem[] | null = null, lastNow = 0;
	const pendingIcons = new Set<string>(); // icon paths of appearances that arrived and weren't loaded yet
	// id -> the tile(s) holding it (an area is one id on every tile of its area): a key, or a set of keys
	const idx = new Map<number, number | Set<number>>();
	function idxAdd(id: number, key: number): void {
		const c = idx.get(id);
		if (c === undefined) idx.set(id, key);
		else if (typeof c === "number") { if (c !== key) idx.set(id, new Set([c, key])); } else c.add(key);
	}
	function idxDel(id: number, key: number): void {
		const c = idx.get(id);
		if (c === undefined) return;
		if (typeof c === "number") { if (c === key) idx.delete(id); } else { c.delete(key); if (c.size === 1) idx.set(id, c.values().next().value!); else if (!c.size) idx.delete(id); }
	}
	let markWhy = "other"; // F9 split line (lds-1): what dirtied the rebuilt tiles, per cause; a look change on many tiles at once is named
	const dirtied = (why: string, n: number): void => { viewStats.dirtyBy[why] = (viewStats.dirtyBy[why] ?? 0) + n; };
	function markId(id: number): void {
		if (carried && id === carried.mob) { const w = markWhy; markWhy = "carried light"; for (let i = 0; i < carriedN; i++) markId(CARRIED_ID0 - i); markWhy = w; } // its carried light glides with it
		const c = idx.get(id);
		if (c === undefined) return;
		if (typeof c === "number") { dirty.add(c); dirtied(markWhy, 1); return; }
		for (const k of c) dirty.add(k);
		dirtied(markWhy, c.size);
		if (c.size >= 8) { const a = apps.get(id); dirtied(`${markWhy} ${a ? `${a.icon?.split("/").pop()}:${a.iconState}` : id} (${c.size} tiles)`, 0.001); }
	}
	function setTile(x: number, y: number, ids: number[]): void {
		const key = x + y * 65536, old = tiles.get(key);
		if (old) for (const id of old.ids) idxDel(id, key);
		tiles.set(key, { x, y, ids });
		for (const id of ids) idxAdd(id, key);
		dirty.add(key); dirtied("tile lists", 1);
	}
	function dropTile(key: number): void {
		const old = tiles.get(key);
		if (old) for (const id of old.ids) idxDel(id, key);
		tiles.delete(key);
		dirty.add(key); // rebuild() takes it out of the scene
	}
	function clearTiles(): void { tiles.clear(); idx.clear(); fullDirty = true; }
	const missingOf = (a: BuiltAppearance): void => {
		if (a.icon && !icons.has(a.icon) && !failedIcons.has(a.icon)) pendingIcons.add(a.icon);
		for (const o of a.overlays) if (o.icon && !icons.has(o.icon) && !failedIcons.has(o.icon)) pendingIcons.add(o.icon);
	};

	/** One tile's items at `now`. pure: for check(), leaves the animation bookkeeping alone. */
	function buildKept(t: { x: number; y: number; ids: number[] }, now: number, anyAnim: boolean, pure = false): KeptTile {
		const save = pure ? [animating, viewStats.flickFrames] : null;
		let dyn = false;
		const list: { id: number; a: BuiltAppearance; g: Glide | undefined }[] = [];
		for (const id of t.ids) {
			if (anims.has(id) || flicks.has(id)) dyn = true;
			if (id <= CARRIED_ID0) { // our carried light: per corner, at the light there now
				const c = carriedLooksAt(id, now);
				if (c.dyn) { dyn = true; if (!pure) animating++; }
				for (const a of c.looks) list.push({ id, a, g: undefined });
				continue;
			}
			const base = apps.get(id);
			if (!base || (picked.size && picked.has(id)) || (flies.length && serverFly(t.x + t.y * 65536, id, base))) continue;
			const pl = placed.size ? placed.get(id) : undefined;
			if (pl) { // the server's copy of a predicted put-down: the slide goes on
				const sl = slideLook(base, pl, now);
				if (sl.dyn) { dyn = true; if (!pure) animating++; }
				list.push({ id, a: sl.a, g: undefined });
				continue;
			}
			const g = glides.size ? glides.get(id) : undefined;
			if (g) dyn = true;
			const lf = lightFades.size ? lightFades.get(id) : undefined;
			if (lf) { // each look's share: how far it has come in, times what the later ones have left of it
				dyn = true;
				const w: number[] = new Array(lf.length);
				let rest = 1;
				for (let i = lf.length - 1; i > 0; i--) { const k = Math.max(0, Math.min(1, (now - lf[i].t0) / lf[i].ms)); w[i] = k * rest; rest *= 1 - k; }
				w[0] = rest;
				for (let i = 0; i < lf.length; i++) { const la = i === lf.length - 1 ? base : lf[i].a; list.push({ id, a: w[i] === 1 ? la : { ...la, alpha: la.alpha * w[i] }, g }); }
				continue;
			}
			list.push({ id, a: anyAnim ? animNow(id, base, now) : base, g });
		}
		if (flies.length) for (const f of flies) if (f.key === t.x + t.y * 65536) { const a = flyLook(f, now); if (a) { list.push({ id: f.id, a, g: undefined }); dyn = true; if (!pure) animating++; } }
		if (placed.size) for (const [id, p] of placed) if (!p.landed && p.key === t.x + t.y * 65536) { const sl = slideLook(p.a, p, now); if (sl.dyn) { dyn = true; if (!pure) animating++; } list.push({ id, a: sl.a, g: undefined }); }
		list.sort((p, q) => p.a.plane - q.a.plane || p.a.layer - q.a.layer); // as tile-dump.ts buildTile
		const items: DrawItem[] = [];
		let gliding = 0, anim = false;
		const mx = t.x * TILE_PX, my = -t.y * TILE_PX;
		for (const e of list) {
			const gv = e.g ? glideAt(e.g, now) ?? undefined : undefined;
			if (gv) gliding++;
			for (const it of itemsOf(e.a, mx + (gv ? gv[0] : 0), my - (gv ? gv[1] : 0), e.id)) {
				if (!anim && (isAnimated(it.appearance) || it.appearance.overlays.some(isAnimated))) anim = true;
				items.push(it);
			}
		}
		if (save) { animating = save[0]; viewStats.flickFrames = save[1]; }
		return { key: t.x + t.y * 65536, x: t.x, y: t.y, items, anim, dyn, gliding };
	}
	function keep(kt: KeptTile | null, key: number): void {
		const old = scene.get(key);
		chunks.setTile(key, kt?.items ?? null);
		if (old?.anim) animTiles--;
		itemCount += (kt?.items.length ?? 0) - (old?.items.length ?? 0);
		if (!old !== !kt) orderKeys = null; // a rebuilt tile is a new KeptTile: only its key may be cached (pd-normal-lag: caching the tiles drew replaced ones until the next move)
		flatCache = null;
		if (!kt) { scene.delete(key); dynTiles.delete(key); return; }
		scene.set(key, kt);
		if (kt.anim) animTiles++;
		if (kt.dyn) dynTiles.add(key); else dynTiles.delete(key);
	}
	const ordered = (): number[] => (orderKeys ??= [...scene.keys()].sort((a, b) => a - b)); // key x + y * numeric order is tileOrder
	function flat(): DrawItem[] {
		if (!flatCache) {
			const out: DrawItem[] = [];
			for (const key of ordered()) for (const it of scene.get(key)!.items) out.push(it);
			flatCache = out;
		}
		return flatCache;
	}
	/** The scene in view pixels (canvas path, hit tests): items shifted by the camera (cx, cy), the held ring off the canvas left out. */
	function viewItems(cx: number, cy: number, canvasW: number, canvasH: number): DrawItem[] {
		const out: DrawItem[] = [];
		for (const key of ordered()) {
			const k = scene.get(key)!, ox = k.x * TILE_PX - cx, oy = -k.y * TILE_PX - cy;
			if (ox < -2 * TILE_PX || ox > canvasW + TILE_PX || oy < -2 * TILE_PX || oy > canvasH + TILE_PX) continue;
			for (const it of k.items) out.push({ ...it, originX: it.originX - cx, originY: it.originY - cy, iconX0: it.iconX0! - cx, iconY1: it.iconY1! - cy });
		}
		return out;
	}

	// The full tile lists (appearances in a tile's order), for the fallback without an eye tile and for check().
	function current0(u: ViewUpdate, now = 0, asServer = false): { client: ClientEntry; viewTiles: ViewTile[]; cam?: [number, number]; glidingAtoms: number; off: [number, number] } {
		const viewTiles: ViewTile[] = [];
		let glidingAtoms = 0;
		animating = 0;
		const anyAnim = now > 0 && (anims.size > 0 || flicks.size > 0);
		const off = now > 0 ? clientOffNow(now) : clientOff;
		const appOf = (id: number): BuiltAppearance | undefined => { const a = (asServer && lessened.get(id)?.server) || apps.get(id); return a && anyAnim ? animNow(id, a, now) : a; };
		for (const { x, y, ids } of [...tiles.values()].sort(tileOrder)) {
			const list = (asServer && carriedN ? ids.filter((id) => id > CARRIED_ID0) : ids).map((id) => ({ id, a: appOf(id), g: glides.size ? glides.get(id) : undefined })).filter((e): e is { id: number; a: BuiltAppearance; g: Glide | undefined } => !!e.a);
			list.sort((p, q) => p.a.plane - q.a.plane || p.a.layer - q.a.layer); // as tile-dump.ts buildTile
			const tile: ViewTile = { x, y, appearances: list.map((e) => e.a), ids: list.map((e) => e.id) };
			if (list.some((e) => e.g)) {
				tile.glide = list.map((e) => (e.g ? glideAt(e.g, now) ?? undefined : undefined));
				glidingAtoms += tile.glide.filter(Boolean).length;
			}
			viewTiles.push(tile);
		}
		const cam = camGlide ? glideAt(camGlide, now) ?? undefined : undefined;
		const client: ClientEntry = {
			key: String(u.key), ckey: "", view: u.view as number | string, baseView: (u.baseView ?? undefined) as number | string | undefined, eyeTile: u.eyeTile ?? undefined, viewTiles,
			sight: u.sight as ClientEntry["sight"],
			screen: screenOf(appOf),
		};
		return { client, viewTiles, cam, glidingAtoms, off };
	}
	const screenOf = (appOf: (id: number) => BuiltAppearance | undefined): ScreenEntry[] => {
		const out = screen.filter(([id]) => apps.has(id) && !hidden.has(id) && !(placed.size && placed.has(id))).map(([id, type, loc]) => ({ id, type, screen_loc: loc as string | null, appearance: appOf(id)! }));
		for (const [id, p] of picked) { const a = appOf(id); if (a) out.push({ id, type: "/obj/item", screen_loc: p.loc as string | null, appearance: heldLook(a) }); }
		return out;
	};

	function rebuild(): void {
		if (!scheduled) return; // already done by the frame hook
		scheduled = false;
		const u = last;
		if (!u || !tiles.size) return;
		const t = performance.now();
		const now = t;
		// Icons: appearances that arrived with a sheet that isn't loaded hold the update (the last view stays) until it is,
		// for at most ICON_HOLD_MS (over a phone a new area's sheets took 0.25-3 s and froze the picture): then the view is
		// drawn without them, and drawn again in full once they land.
		if (pendingIcons.size) {
			const missing = [...pendingIcons].filter((p) => !icons.has(p) && !failedIcons.has(p));
			if (missing.length) {
				if (!loading) { loading = true; void loadIcons(missing).finally(() => { loading = false; schedule(); }); }
				if (!iconsLate) {
					if (!viewStats.iconHoldAt) { viewStats.iconHoldAt = t; setTimeout(schedule, ICON_HOLD_MS); }
					if (t - viewStats.iconHoldAt < ICON_HOLD_MS) return;
					iconsLate = true;
				}
			} else {
				pendingIcons.clear();
				if (iconsLate) { iconsLate = false; fullDirty = true; forceNext = true; }
			}
			if (viewStats.iconHoldAt) { viewStats.iconHolds.push(Math.round(t - viewStats.iconHoldAt)); viewStats.iconHoldAt = 0; } // F9 perf line: how long the picture waited for icons
		}
		const anyAnim = anims.size > 0 || flicks.size > 0;
		animating = 0;
		const off = clientOffNow(now);
		applyOff(off);
		for (const [id, lf] of lightFades) { // a finished fade goes (its tile is still in dynTiles, so this frame draws the new look alone)
			const top = lf[lf.length - 1];
			if (now >= top.t0 + top.ms) lightFades.delete(id); else { animating++; markWhy = "light fades"; markId(id); }
		}
		markWhy = "other";
		updateSight(u);
		let rebuilt = 0;
		if (fullDirty || !scene.size && tiles.size) {
			scene.clear(); chunks.clear(); dynTiles.clear(); orderKeys = flatCache = null; animTiles = 0; itemCount = 0; dirty.clear();
			for (const [key, tile] of tiles) if (!sightHides(sightNow, tile.x, tile.y)) keep(buildKept(tile, now, anyAnim), key);
			rebuilt = tiles.size;
			fullDirty = false;
		} else {
			markWhy = "animate/flick";
			for (const id of anims.keys()) markId(id);
			for (const id of flicks.keys()) markId(id);
			markWhy = "other";
			for (const k of dynTiles) dirty.add(k);
			dirtied("gliding/animating tiles", dynTiles.size);
			for (const key of dirty) {
				const tile = tiles.get(key);
				keep(tile && !sightHides(sightNow, tile.x, tile.y) ? buildKept(tile, now, anyAnim) : null, key);
				rebuilt++;
			}
			dirty.clear();
		}
		lastNow = now;
		let glidingAtoms = 0;
		for (const k of dynTiles) glidingAtoms += scene.get(k)!.gliding;
		const cam = camGlide ? glideAt(camGlide, now) ?? undefined : undefined;
		const e = u.eyeTile;
		const t1 = performance.now();
		viewStats.rbCur += t1 - t; viewStats.rbTiles += rebuilt;
		const client = { key: String(u.key), view: u.view as number | string, baseView: (u.baseView ?? undefined) as number | string | undefined, eyeTile: e ?? undefined, sight: u.sight as ClientEntry["sight"], screen: screenOf((id) => { const a = apps.get(id); return a && anyAnim ? animNow(id, a, now) : a; }) };
		const [hx, hy] = viewHalf(client.view), viewW = 2 * hx + 1, viewH = 2 * hy + 1;
		const { hudItems, masters } = hudOf(client, viewW, viewH);
		const hudAnimated = hudItems.some((it) => isAnimated(it.appearance) || it.appearance.overlays.some(isAnimated));
		const [camX, camY] = cam ?? [0, 0];
		const gliding = glidingAtoms > 0 || camX !== 0 || camY !== 0;
		if (e) {
			// The view is centred on the eye tile; the camera glide moves it (view px = map px - (cx, cy)).
			const minX = e.x - hx, minY = e.y - hy, canvasW = viewW * TILE_PX, canvasH = viewH * TILE_PX;
			const cx = minX * TILE_PX + camX, cy = -((viewH - 1 + minY) * TILE_PX + camY);
			let mi: DrawItem[] | null = null;
			const [bhx, bhy] = viewHalf(client.baseView ?? client.view);
			const shadowA = shadowMode !== "tg" ? shadowStrength(Number(client.sight?.sight ?? 0), opqNow !== null) : 0;
			let shadow: ShadowPaint | undefined;
			if (shadowA > 0) {
				shadow = shadowP.paint(shadowMode === "smooth" && sightOpq ? sightOpq : opqNow!, e.x + 0.5 + camX / TILE_PX, e.y + 0.5 + camY / TILE_PX, shadowMode); // smoothed tg: the page's own sight
				if (shadow.version !== shadowVersion) { shadowVersion = shadow.version; viewStats.shadowPaints++; viewStats.shadowMs += shadow.ms; }
			}
			shown = {
				shadow, shadowAlpha: shadowA,
				get mapItems() { return (mi ??= viewItems(cx, cy, canvasW, canvasH)); },
				hudItems, masters, canvasW, canvasH, boxW: boxWidth(2 * bhx + 1, 2 * bhy + 1, viewW, viewH), animated: animTiles > 0 || hudAnimated, gliding,
				geom: { minX, minY, viewW, viewH, camX, camY },
				scene: { items: flat, cx, cy, chunks },
				mapNear: (px, py) => {
					const mx = px + cx, my = py + cy;
					return chunks.chunkItems(chunkCol(mx), chunkRow(my)).map((it) => ({ ...it, originX: it.originX - cx, originY: it.originY - cy, iconX0: it.iconX0! - cx, iconY1: it.iconY1! - cy }));
				},
			};
		} else { // no eye tile (not seen live): the whole view from the tile lists, as the canvas path always did
			const c = current0(u, now);
			shown = buildPrepared(c.client, c.viewTiles, cam);
		}
		const t2 = performance.now();
		viewStats.rbBuild += t2 - t1; viewStats.tiles = scene.size; viewStats.items = itemCount + hudItems.length;
		show(forceNext ? { ...shown, forceDraw: true } : shown);
		forceNext = false;
		if (cam && e) { // every map tile that shows on the canvas at this camera offset must be held (else a black edge)
			const sw = viewW * TILE_PX, sh = viewH * TILE_PX, ex = e.x, ey = e.y;
			for (let x = ex - hx - 1; x <= ex + hx + 1; x++) for (let y = ey - hy - 1; y <= ey + hy + 1; y++) {
				const px = (x - (ex - hx)) * TILE_PX - cam[0], py = sh - (y - (ey - hy) + 1) * TILE_PX + cam[1];
				if (px > -TILE_PX && px < sw && py > -TILE_PX && py < sh && x >= 1 && y >= 1 && x <= 255 && y <= 255 && !tiles.has(x + y * 65536)) {
					viewStats.missingVis++;
					if (viewStats.missingLog.length < 50) viewStats.missingLog.push(`${x},${y} cam ${cam} eye ${ex},${ey}`);
				}
			}
		}
		if (cam && camFresh && viewStats.keyAt) { camFresh = false; viewStats.keyLat.push(Math.round(performance.now() - viewStats.keyAt)); paintKeyAt = viewStats.keyAt; viewStats.keyAt = 0; } // keydown to the first moving frame
		if (animating) schedule(); // an animate() or flick() is running: the next frame differs
		if (glidingAtoms || cam) {
			let bx = 0, by = 0;
			for (const k of dynTiles) {
				// the largest glide offset this frame, for the glide log
				const kt = scene.get(k)!;
				if (!kt.gliding) continue;
				for (const id of tiles.get(k)!.ids) { const g = glides.get(id); const gv = g && glideAt(g, now); if (gv && Math.abs(gv[0]) + Math.abs(gv[1]) > Math.abs(bx) + Math.abs(by)) [bx, by] = gv; }
			}
			if (viewStats.glideLog.length < 5000) viewStats.glideLog.push([Math.round(now), cam?.[0] ?? 0, cam?.[1] ?? 0, glidingAtoms, bx, by]);
			schedule(); // next frame: the offsets have moved on (a finished glide gives none, and the loop ends)
		} else if (glides.size || camGlide) { glides.clear(); camGlide = null; }
		viewStats.applied++;
		viewStats.applyMs += performance.now() - t;
		setStatus(`live: ${client.key}'s view, world.time ${u.worldTime}, eye at ${u.eyeTile ? `${u.eyeTile.x},${u.eyeTile.y},${u.eyeTile.z}` : "?"}`);
	}
	// The draw loop's frame hook is the only caller of rebuild: a rebuild that schedules the next one must not also queue its own
	// requestAnimationFrame, or each glide/animation frame adds one more rebuild per frame (lat2's first version: 25k rebuilds in 10 s of walking).
	frameHooks.push(() => { if (scheduled) rebuild(); });
	const schedule = () => { scheduled = true; };

	/** Differences between the view as rebuilt from the updates and a full snapshot of the same tick
	 *  (the driver's check, `?check=1`): empty when the updates add up to the snapshot. */
	function check(dump: ClientDump): string[] {
		const want = dump.clients[0];
		if (!last || !want) return ["no view"];
		if (scheduled) rebuild(); // bring the kept scene up to the updates received so far, then compare it
		const { client, viewTiles } = current0(last, 0, true); // the server's looks: the carried light (applyCarried) is the page's own
		const out: string[] = [];
		// appearedT0 (pt-d) is the page's own arrival clock, not part of the appearance: leave it out of the comparison (vc1).
		const js = (v: unknown) => JSON.stringify(v, (key, val) => (key === "appearedT0" ? undefined : val));
		const have = new Map(viewTiles.map((t) => [`${t.x},${t.y}`, js(t.appearances)]));
		for (const t of want.viewTiles ?? []) {
			const k = `${t.x},${t.y}`;
			const h = have.get(k), w = js(t.appearances);
			if (h !== w) {
				if (!out.length && h !== undefined) { // where the first differing tile differs: page vs snapshot around the first changed character
					let i = 0;
					while (i < h.length && h[i] === w[i]) i++;
					out.push(`tile ${k} [page ...${h.slice(Math.max(0, i - 60), i + 60)}... | snapshot ...${w.slice(Math.max(0, i - 60), i + 60)}...]`);
				} else out.push(`tile ${k}`);
			}
			have.delete(k);
		}
		for (const k of have.keys()) {
			const [tx, ty] = k.split(",").map(Number), e = want.eyeTile, [vx, vy] = viewHalf(want.view);
			if (!(e && (Math.abs(tx - e.x) === vx + 1 || Math.abs(ty - e.y) === vy + 1))) out.push(`extra tile ${k}`); // the one-tile ring is kept for the camera glide
		}
		const scr = (l: ScreenEntry[]) => js(l.map((e) => [e.type, e.screen_loc, e.appearance]));
		if (scr(client.screen) !== scr(want.screen)) out.push("screen");
		if (JSON.stringify(last.eyeTile) !== JSON.stringify(want.eyeTile)) out.push("eyeTile");
		// every tile's items built fresh, for the moment of the last rebuild (glides, animate(), flicks included), against the kept ones.
		if (last.eyeTile && !scheduled && !loading && !fullDirty) {
			const anyAnim = anims.size > 0 || flicks.size > 0, key1 = (it: DrawItem) => `${it.plane},${it.layer},${it.originX},${it.originY},${it.id},${it.mo},${it.iconX0},${it.iconY1}`;
			const memo = new Map<object, string>(), ajs = (a: object) => { let v = memo.get(a); if (v === undefined) memo.set(a, (v = js(a))); return v; };
			let bad = 0;
			for (const [key, tile] of tiles) {
				const kept = scene.get(key), fresh = buildKept(tile, lastNow, anyAnim, true);
				let why = "";
				if (!kept) why = "not in scene";
				else if (kept.items.length !== fresh.items.length) why = `${kept.items.length} items kept, ${fresh.items.length} fresh`;
				else for (let i = 0; i < fresh.items.length; i++) {
					const k = kept.items[i], f = fresh.items[i];
					if (key1(k) !== key1(f)) { why = `item ${i} ${key1(k)} kept vs ${key1(f)} fresh`; break; }
					if (k.appearance !== f.appearance && ajs(k.appearance) !== ajs(f.appearance)) { why = `item ${i} appearance differs: kept ${ajs(k.appearance).slice(0, 160)} | fresh ${ajs(f.appearance).slice(0, 160)}`; break; }
				}
				if (why) { if (bad++ < 3) out.push(`kept tile ${tile.x},${tile.y}: ${why}`); }
			}
			for (const key of scene.keys()) if (!tiles.has(key)) { if (bad++ < 3) out.push(`kept tile ${key % 65536},${Math.floor(key / 65536)} is not in the view`); }
			if (bad > 3) out.push(`${bad} kept tiles differ in all`);
			// pd-normal-lag: the list the draws read (flat(); viewItems walks the same order) holds every kept tile's current items, in tile order
			const drawn = flat(), want = [...scene.values()].sort(tileOrder).flatMap((k) => k.items);
			const at = drawn.length !== want.length ? Math.min(drawn.length, want.length) : drawn.findIndex((it, i) => it !== want[i]);
			if (at >= 0) out.push(`drawn list differs from the kept tiles at item ${at} (${drawn.length} drawn, ${want.length} kept)`);
		}
		return out;
	}

	const update = (u: ViewUpdate): void => {
		viewStats.received++;
		const arrived = performance.now();
		if (viewStats.lastAt && viewStats.viewGaps.length < 20000) viewStats.viewGaps.push(Math.round(arrived - viewStats.lastAt)); // view inter-arrival
		viewStats.lastAt = arrived;
		if (!viewStats.firstAt) viewStats.firstAt = viewStats.lastAt;
		if (!u.full && (waitingFull || !last || u.seq !== last.seq + 1)) {
			if (!waitingFull) { waitingFull = true; resync(); }
			return;
		}
		waitingFull = false;
		const prev = last;
		last = u;
		const freshFades: { ms: number }[] = []; // light fades started by this update: their length is set once its moves are known
		if (u.full || prev?.eyeTile?.z !== u.eyeTile?.z) { clearTiles(); glides.clear(); camGlide = null; lightFades.clear(); }
		if (u.full) { apps.clear(); screen = []; faced = null; }
		if (faced && u.gone.includes(faced.id)) faced = null;
		markWhy = "gone";
		for (const id of u.gone) { markId(id); apps.delete(id); glides.delete(id); anims.delete(id); flicks.delete(id); lightFades.delete(id); }
		if (u.full) { anims.clear(); flicks.clear(); clientOff = [0, 0]; }
		if (u.off) clientOff = u.off;
		{
			const at = (performance.now() - t0) / 100;
			for (const [id, a] of u.apps) {
				const old = lightFadeOn && !u.full ? apps.get(id) : undefined;
				if (old && isLighting(old) && isLighting(a)) {
					let lf = lightFades.get(id);
					if (!lf) lightFades.set(id, (lf = [{ a: old, t0: 0, ms: 0 }]));
					lf.push({ a, t0: arrived, ms: 100 });
					freshFades.push(lf[lf.length - 1]);
					viewStats.lightFades++;
					if (lf.length > 4) lf.shift(); // many changes inside one fade: the oldest look goes
				}
				a.appearedT0 = at; apps.set(id, a); markWhy = "look changes"; markId(id); markWhy = "other"; missingOf(a);
				if (faced?.id === id) { faced.server = a; if (a.dir !== faced.dir) apps.set(id, turned(a, faced.dir)); } // a new look before the step is done: still turned
			}
		}
		let animEv = false;
		if (!u.full || u.seq === 1) for (const ev of u.anims ?? []) { // animate()/flick()
			const at = performance.now();
			if (ev[0] === "f") {
				const a = apps.get(ev[1]), st = a?.icon ? icons.get(a.icon) && findState(icons.get(a.icon)!.dmi, ev[2]) : null;
				viewStats.animEvents++; animEv = true;
				if (viewStats.animLog.length < 200) viewStats.animLog.push(`${ev[1]} flick ${ev[2]} ${a ? (st ? "ok" : "nostate " + a.icon) : "noapp"}`);
				if (a && st) flicks.set(ev[1], { state: ev[2], t0: at, ms: buildAnimationSteps(st.frames, st.delay, st.rewind).reduce((n, x) => n + x.delay, 0) * 100 });
				continue;
			}
			const [, id, fresh, time, loop, easing, flags, vars] = ev;
			if (id !== CLIENT_ANIM_ID && !apps.has(id)) continue;
			let oa = anims.get(id);
			if (!oa) anims.set(id, (oa = new ObjectAnims()));
			oa.step(at, fresh === 1, time * glideSlow, loop, easing, flags, vars.filter((v) => v[0] in SMOOTH || v[0] in SWITCH) as StepVar[]);
			viewStats.animEvents++;
			if (viewStats.animLog.length < 200) viewStats.animLog.push(`${id} ${vars.map((v) => v[0]).join(",")} ${time}ds e${easing} l${loop}`);
			animEv = true;
		}
		for (const [x, y, ids] of u.tiles) setTile(x, y, ids);
		if (u.screen) screen = u.screen;
		if (picked.size) for (const [id] of picked) { // the server answered the pick-up click (the item's look came again) or the item is gone
			const back = u.apps.some((a) => a[0] === id);
			if (!back && !u.gone.includes(id) && !u.full) continue;
			const p = picked.get(id)!;
			picked.delete(id); markId(id);
			if (back && (u.screen ?? screen).some((s) => s[0] === id)) viewStats.predPickOk++; else { viewStats.predPickBack++; unhand(p); } // picked up: the guessed in-hand sprite stays till the mob's own look comes
		}
		if (placed.size) for (const [id, p] of placed) { // predicted put-down: the server's copy is on a tile (landed), the item is gone, or the click's answer still has it in the hand
			if (u.full || u.gone.includes(id)) { unput(id, p); continue; }
			const onScreen = (u.screen ?? screen).some((s) => s[0] === id);
			if (p.landed && onScreen) { placed.delete(id); markId(id); continue; } // picked up again
			if (!p.landed && !onScreen && idx.has(id)) { p.landed = true; viewStats.predPutOk++; dirty.add(p.key); markId(id); }
			else if (!p.landed && p.click && onScreen && u.apps.some((x) => x[0] === id)) { unput(id, p); viewStats.predPutBack++; continue; }
			if (!p.handGone && u.apps.some((x) => x[0] === p.mob)) { p.ours = null; strip(p); } // a new look of your mob before the server took the item out of the hand
		}
		if (hidden.size) { // netcode 3: the server answered (the item's look came again, or it left the screen list): show what is there
			for (const [id] of u.apps) hidden.delete(id);
			for (const id of u.gone) hidden.delete(id);
			if (u.screen) for (const id of [...hidden.keys()]) if (!u.screen.some((s) => s[0] === id)) hidden.delete(id);
		}
		const viewChanged = JSON.stringify([prev?.view, prev?.sight]) !== JSON.stringify([u.view, u.sight]);
		if (viewChanged) fullDirty = true;
		let changed = u.full || animEv || u.apps.length > 0 || u.gone.length > 0 || u.tiles.length > 0 || u.screen !== null || viewChanged;
		const e = u.eyeTile, pe = prev?.eyeTile;
		const now = performance.now(), tickMs = prev && u.worldTime > prev.worldTime ? Math.max(10, (u.worldTime - prev.worldTime) * 100 / (u.merged ?? 1)) : 50; // world.time is in deciseconds; one update per tick (merged: several, held back by the server on a slow link; netcode 1: a click's at-once view has the last tick's time)
		const start = (old: Glide | null | undefined, dx: number, dy: number, size: number): Glide => serverGlide(old, dx, dy, size, now, tickMs * glideSlow, TILE_PX);
		let camSz = -1; // pt-orbit: the glide size the camera started with in this update (an orbiting ghost moves along with its eye object: the faster of the two wins)
		pred = u.pred ?? null;
		run = u.predRun ?? null;
		turnFirst = !!u.predTurn;
		pull = u.pull ?? null;
		pick = u.pick ?? null;
		put = u.put ?? null;
		if (u.hud) setHudHint(u.hud);
		if (u.icons && preloadOn) preloadIcons(u.icons);
		if (u.full || prev?.eyeTile?.z !== u.eyeTile?.z) pending = [];
		if (u.full) stepsSent = u.steps ?? 0; // a new connection counts from 0
		stepsDone = u.steps ?? 0;
		if (faced && stepsDone >= faced.n) unface();
		const imgsOk = new Set<number>(); // the mob's images, when its predicted step was taken: they keep the mob's glide, not their own server step
		for (const [id, x0, y0, x1, y1, size, anim] of u.moved ?? []) {
			const dx = x1 - x0, dy = y1 - y0;
			if (imgsOk.has(id)) continue;
			if (pull && id === pull[0] && !u.full && anim !== 0 && Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
				const g = glides.get(id);
				if (g && (g.tx || g.ty)) { // drawn ahead (netcode 5): its glide goes on from where it is, now counted from the new tile; predPull sets the target
					g.ox -= dx * TILE_PX; g.oy -= dy * TILE_PX; g.tx = (g.tx ?? 0) - dx * TILE_PX; g.ty = (g.ty ?? 0) - dy * TILE_PX;
					markId(id);
					changed = true;
					continue;
				}
			}
			if (pred && id === pred[0]) { viewStats.ownMoves++; if (now - lastConfirmAt < 1000 && viewStats.ownMoveGaps.length < 2000) viewStats.ownMoveGaps.push(Math.round(now - lastConfirmAt)); lastConfirmAt = now; if (size > 0) stepMs = TILE_PX / size * 50; } // client/Move sets glide_size from the mob's move delay (32 / ticks per step)
			if (pending.length && id === pending[0].id) {
				const g = glides.get(id);
				let n = 0, sx = 0, sy = 0; // the server's move is the first n predicted steps (a merged view can bring two at once)
				for (let i = 0; i < pending.length && !n; i++) { sx += pending[i].dx; sy += pending[i].dy; if (sx === dx && sy === dy) n = i + 1; }
				const p = pending[0];
				if (p.rest) { confirmMs.push(now - p.at); if (confirmMs.length > 20) confirmMs.shift(); }
				pending = n ? pending.slice(n) : [];
				if (n && !u.full && anim !== 0 && g) { // the server took the predicted step(s): the glide goes on from where it is, now from the new tile
					viewStats.predOk += n;
					let ax = 0, ay = 0; // the steps still drawn ahead (the server can take undrawn ones too, when a merged view brings several)
					for (const q of pending) if (q.drawn) { ax += q.dx; ay += q.dy; }
					const rebase = (q: Glide) => { q.ox -= dx * TILE_PX; q.oy -= dy * TILE_PX; q.tx = ax * TILE_PX; q.ty = ay * TILE_PX; };
					rebase(g);
					for (let i = 2; i < (pred?.[0] === id ? pred.length : 0); i++) imgsOk.add(pred![i]);
					predImgs(id);
					if (camGlide && e && pe && e.x === x1 && e.y === y1 && pe.x === x0 && pe.y === y0) rebase(camGlide);
					if (viewStats.keyAt) viewStats.keyRecv.push(Math.round(now - viewStats.keyAt));
					markId(id);
					changed = true;
					continue;
				}
				viewStats.predWrong++;
			}
			if (u.full || anim === 0 || Math.abs(dx) > 1 || Math.abs(dy) > 1) { glides.delete(id); markId(id); continue; } // a jump, or NO_STEPS: snap
			glides.set(id, start(glides.get(id), dx, dy, size));
			lastGlide = { ms: glides.get(id)!.ms, at: now };
			markId(id);
			if (e && pe && e.z === pe.z && e.x === x1 && e.y === y1 && pe.x === x0 && pe.y === y0 && (size > 0 ? size : 4) > camSz) { camSz = size > 0 ? size : 4; camGlide = start(camGlide, dx, dy, size); camFresh = true; if (viewStats.keyAt) viewStats.keyRecv.push(Math.round(now - viewStats.keyAt)); } // the eye's mob: the camera follows it
			changed = true;
		}
		while (pending.length && !pending[0].tiles && pending[0].n <= stepsDone) pending.shift(); // turns the server has done (they move nothing)
		if (pending.length && stepsSent - stepsDone < pending.length) predBack(now); // the server finished a sent step without taking it (a bump)
		drawNext(now); // the server's answers freed room to draw more of the sent steps
		predPull(now); // the pulled thing's server step or offset changed: its target from the drawn steps again
		if (pending.length) predImgs(pending[0].id); // a bubble that appeared mid-step, or whose own server step came before the mob's: it goes where the mob is drawn
		if (now - lastGlide.at < 500) for (const lf of freshFades) lf.ms = Math.max(50, Math.min(400, lastGlide.ms)); // as long as the latest glide (the light's update can come a tick or two after the step)
		if (e && pe && (e.x !== pe.x || e.y !== pe.y) && !(u.moved ?? []).some((m) => m[3] === e.x && m[4] === e.y && m[1] === pe.x && m[2] === pe.y && m[6] !== 0 && !u.full)) camGlide = null; // eye jumped: the camera snaps
		if (e && (!pe || e.x !== pe.x || e.y !== pe.y || viewChanged)) {
			changed = true;
			// Tiles that left the view (the worker forgets them too, and resends them if they come back). A smaller view (zooming in) drops them at once too, not at the next step.
			const [rx, ry] = viewHalf(u.view);
			const ring = predOn ? 1 + PRED_MAX : 1; // as client-view.ts clientSeen: one ring more than the view for the camera glide, more when the camera runs steps ahead
			for (const [k, t] of tiles) if (Math.abs(t.x - e.x) > rx + ring || Math.abs(t.y - e.y) > ry + ring) dropTile(k);
		}
		if (u.opq !== undefined || u.full) { const o = u.opq && u.opq.length ? u.opq as Opq : null; changed ||= o !== opqNow; opqNow = o; }
		if (u.lum !== undefined || u.full) { const l = u.lum && u.lum.length ? u.lum as Lum : null; changed ||= l !== lumNow; lumNow = l; }
		if (u.light !== undefined || u.full || carried) { applyCarried(u.light ?? (u.full ? [] : undefined)); changed ||= carriedN > 0 || u.light !== undefined; }
		if (changed) { viewStats.changed++; schedule(); }
	};

	// Clicks. The canvas shows the view at its own pixel size, scaled by CSS; the pointer is mapped back to canvas pixels.
	const canvasBox = () => host.querySelector("canvas");
	function pointAt(clientX: number, clientY: number): PointerInfo | null {
		const c = canvasBox(), p = shown;
		if (!c || !p) return null;
		const r = c.getBoundingClientRect();
		const px = Math.floor((clientX - r.left) / r.width * p.canvasW), py = Math.floor((clientY - r.top) / r.height * p.canvasH);
		if (px < 0 || py < 0 || px >= p.canvasW || py >= p.canvasH) return null;
		const th = performance.now();
		const hit = hitTest(p, icons, px, py, (th - t0) / 100);
		viewStats.hitMs.push(Math.round((performance.now() - th) * 100) / 100); // the driver prints these
		const g = p.geom;
		// Tile columns/rows as buildPrepared places them: x from minX at -camX, y from the top (maxY) at +camY.
		const tile: [number, number] | null = g ? [g.minX + Math.floor((px + g.camX) / TILE_PX), g.minY + g.viewH - 1 - Math.floor((py - g.camY) / TILE_PX)] : null;
		return { hit, px, py, canvasW: p.canvasW, canvasH: p.canvasH, tile, id: hit?.item.id ?? null };
	}
	/** Client coordinates of a spot for the driver's clicks: "tile:X,Y", "rel:DX,DY" (from the eye tile) or "eye" (that tile's centre), "px:X,Y" (canvas pixel), "hud:TEXT[#N]" (a screen object whose type contains TEXT). */
	function locate(spec: string): { x: number; y: number } | null {
		const c = canvasBox(), p = shown, g = p?.geom;
		if (!c || !p || !g) return null;
		const r = c.getBoundingClientRect(), k = r.width / p.canvasW;
		const at = (cx: number, cy: number) => ({ x: r.left + (cx + 0.5) * k, y: r.top + (cy + 0.5) * k });
		const [kind, arg = ""] = spec.split(":");
		if (kind === "tile" || kind === "eye" || kind === "rel") {
			const [ex, ey] = [last?.eyeTile?.x ?? 0, last?.eyeTile?.y ?? 0], [ax, ay, dpx = 0, dpy = 0] = arg.split(",").map(Number); // optional 3rd/4th = pixel offset (right, up), for wall-mounted things drawn pixel_x away from their tile
			const [tx, ty] = kind === "eye" ? [ex, ey] : kind === "rel" ? [ex + ax, ey + ay] : [ax, ay];
			return at((tx - g.minX) * TILE_PX + 16 - g.camX + dpx, (g.viewH - 1 - (ty - g.minY)) * TILE_PX + 16 + g.camY - dpy);
		}
		if (kind === "hud") {
			const [text, nth = "1"] = arg.split("#"); // hud:hand#2 = the second match
			// Only objects whose centre is on the canvas (a screen_loc can put one outside the view).
			const spot = (id: number) => { const i = p.hudItems.find((h) => h.id === id && (h.mo ?? 1) !== 0); return i && { x: i.iconX0! * (i.hk?.k ?? 1) + (i.hk?.dx ?? 0) + 16 * (i.hk?.k ?? 1), y: i.iconY1! * (i.hk?.k ?? 1) + (i.hk?.dy ?? 0) - 16 * (i.hk?.k ?? 1) }; };
			const on = (q: { x: number; y: number } | undefined | null) => !!q && q.x >= 0 && q.y >= 0 && q.x < p.canvasW && q.y < p.canvasH;
			const e = screen.filter(([id, type]) => type.includes(text) && on(spot(id)))[Number(nth) - 1];
			let q = e && spot(e[0]);
			if (q && e) { // an icon with a see-through middle (throw, swap hand) isn't hit there: the nearest pixel of it that is
				const t = (performance.now() - t0) / 100, hits = (x: number, y: number) => hitTest(p, icons, Math.round(x), Math.round(y), t)?.item.id === e[0];
				if (!hits(q.x, q.y)) {
					let best: { x: number; y: number } | null = null;
					for (let dy = -16; dy <= 16; dy += 2) for (let dx = -16; dx <= 16; dx += 2) if ((!best || Math.hypot(dx, dy) < Math.hypot(best.x - q.x, best.y - q.y)) && hits(q.x + dx, q.y + dy)) best = { x: q.x + dx, y: q.y + dy };
					if (best) q = best;
				}
			}
			return q ? at(q.x, q.y) : null;
		}
		if (kind === "px") { // a canvas pixel
			const [x, y] = arg.split(",").map(Number);
			return at(x, y);
		}
		return null;
	}
	const hudState = (spec: string): string => {
		if (spec.startsWith("pick:")) { const [dx, dy] = spec.slice(5).split(",").map(Number), p = pick?.find((q) => q[1] === dx && q[2] === dy); return p ? String(p[0]) : "none"; } // the id of an item listed in pick at that offset
		if (spec === "held") return screen.filter((e) => !e[1].startsWith("/obj/screen") && apps.has(e[0]) && !hidden.has(e[0]) && !placed.has(e[0])).map((e) => `${e[0]} ${e[1]}`).concat([...picked.keys()].map((id) => `${id} (predicted)`)).join("; ") || "none"; // what is held (items on the screen list) and the predicted pick-ups
		const [text, nth = "1"] = spec.split("#"), e = screen.filter(([, type]) => type.includes(text))[Number(nth) - 1], a = e && apps.get(e[0]);
		return a ? `${e[1]} ${a.iconState}${a.overlays.length ? " +" + a.overlays.map((o) => o.iconState).join(",") : ""}${hidden.has(e[0]) ? " (hidden)" : ""}` : "none";
	};
	return { update, check, pointAt, locate, predictKey, predictClick, predictSwap: () => swapHands(null), predictThrow, predictPick, predictPut, hudState };
}

export async function main(): Promise<void> {
	setStatus("loading client.json...");
	const dump = (await (await fetch(`/web/build/2i/client${new URLSearchParams(location.search).get("dump") === "lobby" ? "-lobby" : ""}.json`)).json()) as ClientDump;
	if (dump.clients.length === 0) {
		setStatus("client.json has no connected clients -- run `npm run boot -- --connect <key>` first.");
		return;
	}
	const client = dump.clients[0];
	let viewTiles = client.viewTiles;
	let mapNote: string;
	if (viewTiles && viewTiles.length > 0) {
		mapNote = `client.viewTiles (eye at ${client.eyeTile ? `${client.eyeTile.x},${client.eyeTile.y},${client.eyeTile.z}` : "?"})`;
	} else {
		setStatus("no client.viewTiles yet -- loading web/build/2g/station.json fallback...");
		const station = (await (await fetch("/web/build/2g/station.json")).json()) as StationDump;
		viewTiles = windowFromStation(station, FALLBACK_ANCHOR.x, FALLBACK_ANCHOR.y, client.view);
		mapNote = `STAND-IN: station.json cut around (${FALLBACK_ANCHOR.x},${FALLBACK_ANCHOR.y},${FALLBACK_ANCHOR.z}), not the real client eye`;
	}
	const p = await prepare(client, viewTiles);
	clientView(document.getElementById("client-host")!)(p);
	const [hx, hy] = viewHalf(client.view), viewSize = `${2 * hx + 1}x${2 * hy + 1}`;
	setStatus(
		`drew ${client.key}'s view (${viewSize} tiles, ${client.screen.length} screen objects) using ${mapNote}. ` +
			`Built ${dump.builtAt}. Animating from page load.`,
	);
}
