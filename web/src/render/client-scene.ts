// client-scene - Browser entry for the connected-player view (web/draw/index.html?scene=client).
// Draws a client's map view plus its `client.screen` HUD, from web/build/2i/client.json (written by
// `npm run boot -- --connect KEY`; `?dump=lobby` reads the lobby view from before `--join`) or live
// from the worker's ViewUpdates (liveClientView; its parts are in live-move, live-items, live-light, live-sight, live-anim
// and live-pointer.ts).
//
// Every plane is composited onto the planes below it using its own /obj/screen/plane_master's
// color/alpha/blend_mode, which is BYOND's plane model. The station view hardcodes one lighting
// multiply instead.
//
// Icon loading and per-appearance drawing come from station-client.ts so the two views cannot drift
// apart. That view bakes once; this one redraws every animation frame, which is affordable only
// because a view is a few hundred tiles, not the station's 65k.
//
// A dump with no `viewTiles` (older dumps) falls back to a window cut out of
// web/build/2g/station.json around FALLBACK_ANCHOR, and says so on the page.

import { inherit } from "../appearance/inherit.js";
import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import { parseScreenLoc } from "./screen-loc.js";
import { applyColorMatrix } from "./color-matrix.js";
import { findState } from "./sprite-lookup.js";
import type { ViewUpdate } from "../worker/client-view.js";
import { isSplit, splitLook, wholeSheet } from "./split-sheets.js";
import { loadIcon, drawAppearance, drawLighting, isLighting, TILE_PX, type LoadedIcon } from "./station-client.js";
import type { Hit } from "./hit-test.js";
import { ChunkIndex, chunkCol, chunkRow } from "./chunk-index.js";
import { relBox } from "./item-box.js";
import { makePredictHud, PREDICT_HIDE_MS } from "./predict-hud.js";
import { glideAt, type Glide } from "./glide.js";
import { makeMovePredict } from "./live-move.js";
import { makeItemPredict } from "./live-items.js";
import { CARRIED_ID0, makeCarriedLight } from "./live-light.js";
import { makeSight } from "./live-sight.js";
import { makeLiveAnim } from "./live-anim.js";
import { makePointer } from "./live-pointer.js";
import type { ShadowPaint } from "./sight-shadow-paint.js";

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
/** Same shape as station.json's tiles. */
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

/** Stand-in eye tile for dumps with no viewTiles. Any busy spot works for a "does this draw" check, so it is just the map's rough centre. */
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

/** One appearance to draw at a fixed pixel origin in the view canvas. The origin excludes the appearance's own
 *  pixelX/pixelY, which drawAppearance/drawLighting add (as in station-client.ts). `plane`/`layer` only
 *  bucket and order draws; they are not applied again at draw time. */
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

/** BYOND blend_mode -> the closest canvas compositing operation. DEFAULT/OVERLAY/INSET_OVERLAY (0/1/5) differ only
 *  in how partly transparent destination pixels are treated, which never matters over an opaque plane.
 *  SUBTRACT (3) has no canvas equivalent; "difference" is a rough stand-in no current data uses. */
function compositeOp(blendMode: number): GlobalCompositeOperation {
	switch (blendMode) {
		case 2: return "lighter"; // BLEND_ADD
		case 3: return "difference"; // BLEND_SUBTRACT
		case 4: return "multiply"; // BLEND_MULTIPLY
		default: return "source-over"; // BLEND_DEFAULT(0) / BLEND_OVERLAY(1) / BLEND_INSET_OVERLAY(5)
	}
}

/** Canvas pixel origin of tile (tileX0, tileY0), counted from the view's bottom-left (y flipped), plus screen_loc's
 *  `:PX,PY` offset. That offset is where the object is anchored, so it stays apart from the appearance's own pixel_x/pixel_y. */
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

/** A color matrix whose every output channel is the source alpha (tg's parallax "whitifier"). */
export function isAlphaToWhite(m: number[]): boolean {
	return m.length === 20 && m.every((v, i) => v === (i >= 12 && i < 16 ? 1 : 0));
}

/** A layer at or above BACKGROUND_LAYER (20000) draws behind everything else on its plane (OpenDream: layer -= 40000).
 *  tg's lighting backdrops use it: on LIGHTING_PLANE the white "unlit" (+20) then the black "lit" (+21, invisibility 20)
 *  go under the per-tile lighting objects. A living mob's see_invisible is 25, so "lit" shows: a tile with no lighting
 *  object stays dark unless its area is unlit by design, whose /obj/effect/fullbright overlay whitens it. */
function sortLayer(layer: number): number {
	return layer >= 20000 ? layer - 40000 : layer;
}

/** The origin-independent part of itemsOf. Memoised per appearance object so an unchanged appearance gives the same
 *  derived appearance objects next frame (pixi-view's sameItems and glide shift path compare them by identity). */
interface ItemTemplate { a: BuiltAppearance; items: { plane: number; layer: number; owner: boolean; appearance: BuiltAppearance }[] }
const tmplMemo = new WeakMap<BuiltAppearance, ItemTemplate>();
/** An appearance as draw items. BYOND 511 (tests/render-rules/layers.dm): a floating-layer overlay
 *  draws with its owner, just above it, and an underlay just below it, both inside the owner's slot,
 *  so an obj on a higher layer draws over them and one on a lower layer under them (ties go to
 *  creation order). An overlay with an explicit layer (>= 0) sorts against every atom at that layer,
 *  and an overlay on another plane draws on that plane (e.g. an area's fullbright). Those get their
 *  own items; underlays get theirs at the owner's layer, emitted before the owner (stable sort). */
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
	/** The map items that can show at view pixel (px, py) (its chunk's, spill included), in view pixels, so a hit test skips the whole map; absent: hitTest walks `mapItems`. */
	mapNear?: (px: number, py: number) => DrawItem[];
	/** sight shadows (sight-shadow-paint.ts): drawn above the lighting, below the fullscreen and HUD planes (Pixi path only). */
	shadow?: ShadowPaint;
	/** how strong the shadow is drawn (sight-shadow.ts shadowStrength: 1, or dimmed with mesons/thermals) */
	shadowAlpha?: number;
}
/** The kept scene as the default Pixi path reads it: every tile's items in map pixels (x = tile x * 32, y = -tile y * 32; view px = map px - (cx, cy)),
 *  tie order south to north, west to east, then the tile's own list. */
export interface SceneRef { items: () => DrawItem[]; cx: number; cy: number; /** The same items cut into 16x16-tile chunks per plane (spill included). */ chunks: ChunkIndex }

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
	if (!p) iconLoads.set(path, (p = loadIcon(path).catch(() => null).then(async (loaded) => {
		const whole = wholeSheet(path);
		if (!loaded && whole !== path && !path.endsWith("/-none-.dmi")) { await loadOne(whole); loaded = icons.get(whole) ?? null; } // no cut sheet on this server: the whole one, shared
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
	for (const p of paths) if (!icons.has(p) && !failedIcons.has(p) && !isSplit(p)) preloadQueue.push(p); // a cut sheet: its states load as they show
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

function hudOf(client: Pick<ClientEntry, "view" | "baseView" | "sight" | "screen">, viewW: number, viewH: number): { hudItems: DrawItem[]; masters: Map<number, PlaneMaster> } {
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
		// The live page holds a ring of extra tiles around the view while the camera glides.
		minX = client.eyeTile.x - hx;
		minY = client.eyeTile.y - hy;
	} else {
		// No eye tile: size the map from the tiles we have.
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
	/** glideTimes: redraw ms of gliding views. glideLog: per rebuilt glide frame, [ms, camX, camY, atoms gliding, largest atom offset x, y]. */
	missingVis: 0, iconHolds: [] as number[], iconHoldAt: 0, preloaded: "", longFrames: [] as number[], animEvents: 0, flickFrames: 0, shakeMax: 0, shakeApplied: 0, animLog: [] as string[], missingLog: [] as string[], keyAt: 0, clickAt: 0, clickLat: [] as number[], pings: [] as number[], pingRecent: [] as number[], keyRecv: [] as number[], keyLat: [] as number[], keyPaint: [] as number[], viewGaps: [] as number[], hitMs: [] as number[], redrawTimes: [] as number[], rafs: 0, glideGaps: [] as number[], glideFrames: 0, glideMs: 0, glideTimes: [] as number[], glideLog: [] as number[][], lightFades: 0, dirtyBy: {} as Record<string, number>, carriedTiles: 0, lessenedTiles: 0, shadowPaints: 0, shadowMs: 0, sightRuns: 0,
	/** Movement prediction: predicted steps, ones the server then took, took differently, or never took in time; frames with the mob gliding and
	 *  images on it (a speech bubble), and the most px one was drawn off the mob. */
	predImgFrames: 0, predImgGap: 0, ownMoves: 0, ownMoveGaps: [] as number[], // ownMove*: your mob's steps as views brought them, ms apart (under 1 s; for walk-pace checks)
	predSteps: 0, predPull: 0, predSwap: 0, predPullFrames: 0, predPullGap: 0, predPullFar: 0, predToggle: 0, predThrow: 0, predPick: 0, predPickOk: 0, predPickBack: 0, predPut: 0, predPutOk: 0, predPutBack: 0, predFace: 0, predTurns: 0, predFaceOk: 0, predFaceWrong: 0, predOk: 0, predWrong: 0, predLate: 0, predJumps: [] as string[], predSkip: { last: "" } as Record<string, number | string>,
	/** rebuild split (ms totals: current0 / missingIcons / buildPrepared), last view's tile and item counts; the Pixi backend adds its render split
	 *  (rSort / rPlace / rTex = plane render textures / rComp = final composite; GPU time only with ?sync=1), planes drawn (changed / animated / shifted / skipped), sprites placed. */
	cFallInfo: "", cRender: 0, cPlace: 0, cFrame: 0, cComp: 0, cFall: 0, cVisible: 0, rbCur: 0, rbMiss: 0, rbBuild: 0, rbTiles: 0, tiles: 0, items: 0, rSort: 0, rPlace: 0, rTex: 0, rComp: 0, sFull: 0, sPatch: 0, sSame: 0, iRep: 0, iMov: 0, iKeep: 0, plDrawn: 0, plAnim: 0, plShift: 0, plSame: 0, sprites: 0,
	planeAcc: {} as Record<number, { draws: number; anim: number; items: number; sprites: number; placeMs: number; texMs: number }>, pixiInfo: "" };

/** called at the top of every animation frame, before the draw (liveClientView's pending rebuild). */
const frameHooks: (() => void)[] = [];
let hooksRanAt = -1;
let paintKeyAt = 0; // keydown time of the move that was just rebuilt; the next draw logs viewStats.keyPaint

/** The page's one clock: frame times (clientView) and flick/appear times (liveClientView) all count from here. */
export const pageT0 = performance.now();
export interface ViewBackend { canvas: HTMLElement; render: (p: Prepared, showHud: boolean, frameTime: number) => void; /** The pane (CSS box, devicePixelRatio) changed since the last render: draw again at the new size. */ stale?: () => boolean }
/** Draws a client view into `host` and redraws it every animation frame. Returns the function that swaps in a new view. */
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
					if (it.hk) { planeCtx.save(); planeCtx.translate(it.hk.dx, it.hk.dy); planeCtx.scale(it.hk.k, it.hk.k); } // HUD keeps its size when only the map zooms
					if (isLighting(it.appearance)) drawLighting(planeCtx, it.appearance, icons, it.originX, it.originY, frameTime, frameTime - (it.appearance.appearedT0 ?? 0));
					else drawAppearance(planeCtx, it.appearance, icons, it.originX, it.originY, frameTime, frameTime - (it.appearance.appearedT0 ?? 0));
					if (it.hk) planeCtx.restore();
				}
				planeCtx.globalCompositeOperation = "source-over";
				if (master?.color != null) {
					if (Array.isArray(master.color) && isAlphaToWhite(master.color)) {
						// Same result as the matrix branch below, without reading pixels back.
						planeCtx.globalCompositeOperation = "source-in";
						planeCtx.fillStyle = "#fff";
						planeCtx.fillRect(0, 0, cw, ch);
						planeCtx.globalCompositeOperation = "source-over";
					} else if (Array.isArray(master.color)) {
						// Applied to the whole plane canvas, including pixels nothing was drawn on: that is what
						// a backdrop plane master is for (see plane_master.dm).
						const img = planeCtx.getImageData(0, 0, cw, ch);
						applyColorMatrix(img.data, master.color);
						planeCtx.putImageData(img, 0, 0);
					} else {
						// A plain tint: multiply the whole canvas, then mask back to what the plane drew, so
						// empty pixels stay transparent (as station-client.ts's tintedRect does).
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

	// Animations count from page load for every icon at once. The page has no per-atom "first shown" moment
	// as BYOND does; the visible result is that atoms showing the same icon_state stay in step.
	// Redraw only on a new view, a HUD toggle, or (animated views) a new decisecond: BYOND frame delays are whole deciseconds.
	const animationStartMs = pageT0;
	let lastRafMs = 0;
	let drawn: Prepared | null = null, drawnHud = true, drawnDs = -1, aspect = 0, viewRatio = "";
	function tick(nowMs: number): void {
		if (nowMs !== hooksRanAt) { hooksRanAt = nowMs; for (const f of frameHooks) f(); } // a pending rebuild goes first, or the frame would show the old view; once per frame even with two views (?renderer=both)
		viewStats.rafs++;
		if (current?.gliding && viewStats.glideGaps.length < 5000) viewStats.glideGaps.push(Math.round(nowMs - lastRafMs));
		if (lastRafMs && nowMs - lastRafMs > 100 && viewStats.longFrames.length < 1000) viewStats.longFrames.push(Math.round(nowMs - lastRafMs)); // F9 perf line
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
/** The live view for the worker page: feed it each ViewUpdate the worker posts (client-view.ts's ViewDiffer). It keeps
 *  the view keyed per object (appearance by id, each tile's id list), applies each update at once, and rebuilds the
 *  draw items at most once per frame, and only when something changed. `resync` is called when an update is missing
 *  (the worker then sends a full one); updates are ignored until that full one comes. */
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
	// Light fades: a lighting object whose look changed is drawn as a mix of its old look and the new one, moving from old to new over the time of the latest
	// glide: a carried light then slides with its carrier instead of jumping a tile per step. Lighting objects are BLEND_ADD (they add up on their plane), so
	// the looks are drawn with alphas that sum to 1: one at full alpha under another at part alpha would be too bright.
	// Per id: the looks oldest first, each later one coming in from its t0; the last is apps.get(id). 2017 tg sets the new colours at once.
	const lightFades = new Map<number, { a: BuiltAppearance; t0: number; ms: number }[]>();
	const lightFadeOn = new URLSearchParams(location.search).get("lightfade") !== "0"; // ?lightfade=0: lights change at once, as before
	const preloadOn = new URLSearchParams(location.search).get("preload") !== "0"; // ?preload=0: no background download of the station's icon sheets
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
	const chunks = new ChunkIndex((it) => relBox(it.appearance, icons)); // the kept items cut into chunks; keep() maintains it
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
	let markWhy = "other"; // F9 split line: what dirtied the rebuilt tiles, per cause; a look change on many tiles at once is named
	const dirtied = (why: string, n: number): void => { viewStats.dirtyBy[why] = (viewStats.dirtyBy[why] ?? 0) + n; };
	function markId(id: number): void {
		if (lt.carried && id === lt.carried.mob) { const w = markWhy; markWhy = "carried light"; for (let i = 0; i < lt.carriedN; i++) markId(CARRIED_ID0 - i); markWhy = w; } // its carried light glides with it
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
	// The parts in their own files: each gets what it shares with the rest of the view.
	const mv = makeMovePredict({ apps, glides, get last() { return last; }, viewStats, glideSlow, sendStep, markId, schedule: () => schedule() });
	const camera = mv.cam;
	const { predictClick, predictThrow, swapHands, hidden, setHudHint } = makePredictHud({ apps, get screen() { return screen; }, viewStats, schedule: () => schedule() });
	const itemPred = makeItemPredict({ apps, tiles, idx, dirty, hidden, get screen() { return screen; }, mv, viewStats, markId, schedule: () => schedule() });
	const { picked, placed } = itemPred;
	frameHooks.push(() => {
		if (!mv.predOn) return;
		const now = performance.now();
		if (hidden.size) for (const [id, at] of hidden) if (now - at > PREDICT_HIDE_MS) { hidden.delete(id); schedule(); } // no answer: show it again
		itemPred.expire(now);
		mv.frame(now);
	});
	const lt = makeCarriedLight({ apps, tiles, idx, idxAdd, idxDel, dirty, glides, lightFades, lightFadeOn, mv, viewStats, markId });
	const sg = makeSight({ tiles, dirty, mv, viewStats, viewHalf, redraw: () => { forceNext = true; schedule(); } });
	const an = makeLiveAnim({ host, apps, idx, get shown() { return shown; }, icons, failedIcons, loadOne, t0, glideSlow, viewStats, markId, schedule: () => schedule(), allDirty: () => { fullDirty = true; } });
	const { anims, flicks, animNow } = an;
	(viewStats as Record<string, unknown>).tileItems = (x: number, y: number): DrawItem[] => scene.get(x + y * 65536)?.items ?? []; // for the light-fade test: one kept tile's draw items

	/** One tile's items at `now`. pure: for check(), leaves the animation bookkeeping alone. */
	function buildKept(t: { x: number; y: number; ids: number[] }, now: number, anyAnim: boolean, pure = false): KeptTile {
		const save = pure ? [an.animating, viewStats.flickFrames] : null;
		let dyn = false;
		const list: { id: number; a: BuiltAppearance; g: Glide | undefined }[] = [];
		for (const id of t.ids) {
			if (anims.has(id) || flicks.has(id)) dyn = true;
			if (id <= CARRIED_ID0) { // our carried light: per corner, at the light there now
				const c = lt.carriedLooksAt(id, now);
				if (c.dyn) { dyn = true; if (!pure) an.animating++; }
				for (const a of c.looks) list.push({ id, a, g: undefined });
				continue;
			}
			const base = apps.get(id);
			if (!base || (picked.size && picked.has(id)) || (itemPred.flies.length && itemPred.serverFly(t.x + t.y * 65536, id, base))) continue;
			const pl = placed.size ? placed.get(id) : undefined;
			if (pl) { // the server's copy of a predicted put-down: the slide goes on
				const sl = itemPred.slideLook(base, pl, now);
				if (sl.dyn) { dyn = true; if (!pure) an.animating++; }
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
		if (itemPred.flies.length) for (const f of itemPred.flies) if (f.key === t.x + t.y * 65536) { const a = itemPred.flyLook(f, now); if (a) { list.push({ id: f.id, a, g: undefined }); dyn = true; if (!pure) an.animating++; } }
		if (placed.size) for (const [id, p] of placed) if (!p.landed && p.key === t.x + t.y * 65536) { const sl = itemPred.slideLook(p.a, p, now); if (sl.dyn) { dyn = true; if (!pure) an.animating++; } list.push({ id, a: sl.a, g: undefined }); }
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
		if (save) { an.animating = save[0]; viewStats.flickFrames = save[1]; }
		return { key: t.x + t.y * 65536, x: t.x, y: t.y, items, anim, dyn, gliding };
	}
	function keep(kt: KeptTile | null, key: number): void {
		const old = scene.get(key);
		chunks.setTile(key, kt?.items ?? null);
		if (old?.anim) animTiles--;
		itemCount += (kt?.items.length ?? 0) - (old?.items.length ?? 0);
		if (!old !== !kt) orderKeys = null; // a rebuilt tile is a new KeptTile: only its key may be cached (caching the tiles drew replaced ones until the next move)
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
		an.animating = 0;
		const anyAnim = now > 0 && (anims.size > 0 || flicks.size > 0);
		const off = now > 0 ? an.clientOffNow(now) : an.clientOff;
		const appOf = (id: number): BuiltAppearance | undefined => { const a = (asServer && lt.lessened.get(id)?.server) || apps.get(id); return a && anyAnim ? animNow(id, a, now) : a; };
		for (const { x, y, ids } of [...tiles.values()].sort(tileOrder)) {
			const list = (asServer && lt.carriedN ? ids.filter((id) => id > CARRIED_ID0) : ids).map((id) => ({ id, a: appOf(id), g: glides.size ? glides.get(id) : undefined })).filter((e): e is { id: number; a: BuiltAppearance; g: Glide | undefined } => !!e.a);
			list.sort((p, q) => p.a.plane - q.a.plane || p.a.layer - q.a.layer); // as tile-dump.ts buildTile
			const tile: ViewTile = { x, y, appearances: list.map((e) => e.a), ids: list.map((e) => e.id) };
			if (list.some((e) => e.g)) {
				tile.glide = list.map((e) => (e.g ? glideAt(e.g, now) ?? undefined : undefined));
				glidingAtoms += tile.glide.filter(Boolean).length;
			}
			viewTiles.push(tile);
		}
		const cam = camera.glide ? glideAt(camera.glide, now) ?? undefined : undefined;
		const client: ClientEntry = {
			key: String(u.key), ckey: "", view: u.view as number | string, baseView: (u.baseView ?? undefined) as number | string | undefined, eyeTile: u.eyeTile ?? undefined, viewTiles,
			sight: u.sight as ClientEntry["sight"],
			screen: screenOf(appOf),
		};
		return { client, viewTiles, cam, glidingAtoms, off };
	}
	const screenOf = (appOf: (id: number) => BuiltAppearance | undefined): ScreenEntry[] => {
		const out = screen.filter(([id]) => apps.has(id) && !hidden.has(id) && !(placed.size && placed.has(id))).map(([id, type, loc]) => ({ id, type, screen_loc: loc as string | null, appearance: appOf(id)! }));
		for (const [id, p] of picked) { const a = appOf(id); if (a) out.push({ id, type: "/obj/item", screen_loc: p.loc as string | null, appearance: itemPred.heldLook(a) }); }
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
		an.animating = 0;
		const off = an.clientOffNow(now);
		an.applyOff(off);
		for (const [id, lf] of lightFades) { // a finished fade goes (its tile is still in dynTiles, so this frame draws the new look alone)
			const top = lf[lf.length - 1];
			if (now >= top.t0 + top.ms) lightFades.delete(id); else { an.animating++; markWhy = "light fades"; markId(id); }
		}
		markWhy = "other";
		sg.updateSight(u);
		let rebuilt = 0;
		if (fullDirty || !scene.size && tiles.size) {
			scene.clear(); chunks.clear(); dynTiles.clear(); orderKeys = flatCache = null; animTiles = 0; itemCount = 0; dirty.clear();
			for (const [key, tile] of tiles) if (!sg.hides(tile.x, tile.y)) keep(buildKept(tile, now, anyAnim), key);
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
				keep(tile && !sg.hides(tile.x, tile.y) ? buildKept(tile, now, anyAnim) : null, key);
				rebuilt++;
			}
			dirty.clear();
		}
		lastNow = now;
		let glidingAtoms = 0;
		for (const k of dynTiles) glidingAtoms += scene.get(k)!.gliding;
		const cam = camera.glide ? glideAt(camera.glide, now) ?? undefined : undefined;
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
			const { shadow, shadowA } = sg.shadowAt(client.sight, e.x + 0.5 + camX / TILE_PX, e.y + 0.5 + camY / TILE_PX); // smoothed tg: the page's own sight
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
		if (cam && camera.fresh && viewStats.keyAt) { camera.fresh = false; viewStats.keyLat.push(Math.round(performance.now() - viewStats.keyAt)); paintKeyAt = viewStats.keyAt; viewStats.keyAt = 0; } // keydown to the first moving frame
		if (an.animating) schedule(); // an animate() or flick() is running: the next frame differs
		if (glidingAtoms || cam) {
			let bx = 0, by = 0;
			for (const k of dynTiles) {
				const kt = scene.get(k)!;
				if (!kt.gliding) continue;
				for (const id of tiles.get(k)!.ids) { const g = glides.get(id); const gv = g && glideAt(g, now); if (gv && Math.abs(gv[0]) + Math.abs(gv[1]) > Math.abs(bx) + Math.abs(by)) [bx, by] = gv; }
			}
			if (viewStats.glideLog.length < 5000) viewStats.glideLog.push([Math.round(now), cam?.[0] ?? 0, cam?.[1] ?? 0, glidingAtoms, bx, by]);
			schedule(); // next frame: the offsets have moved on (a finished glide gives none, and the loop ends)
		} else if (glides.size || camera.glide) { glides.clear(); camera.glide = null; }
		viewStats.applied++;
		viewStats.applyMs += performance.now() - t;
		setStatus(`live: ${client.key}'s view, world.time ${u.worldTime}, eye at ${u.eyeTile ? `${u.eyeTile.x},${u.eyeTile.y},${u.eyeTile.z}` : "?"}`);
	}
	// The draw loop's frame hook is the only caller of rebuild: a rebuild that schedules the next one must not also queue its own
	// requestAnimationFrame, or each glide/animation frame adds one more rebuild per frame (an early version made 25k rebuilds in 10 s of walking).
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
		// appearedT0 is the page's own arrival clock, not part of the server's appearance, so it stays out of the comparison.
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
			// The list the draws read (flat(); viewItems walks the same order) holds every kept tile's current items, in tile order
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
		if (u.full || prev?.eyeTile?.z !== u.eyeTile?.z) { clearTiles(); glides.clear(); camera.glide = null; lightFades.clear(); }
		if (u.full) { apps.clear(); screen = []; }
		mv.forget(u);
		markWhy = "gone";
		for (const id of u.gone) { markId(id); apps.delete(id); glides.delete(id); anims.delete(id); flicks.delete(id); lightFades.delete(id); }
		an.serverOff(u);
		{
			const at = (performance.now() - t0) / 100;
			for (const [id, got] of u.apps) {
				const a = splitLook(got); // a look on a cut sheet: its state's own small sheet (split-sheets.ts)
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
				mv.newLook(id, a);
			}
		}
		const animEv = an.events(u);
		for (const [x, y, ids] of u.tiles) setTile(x, y, ids);
		if (u.screen) screen = u.screen;
		itemPred.answer(u);
		if (hidden.size) { // netcode 3: the server answered (the item's look came again, or it left the screen list): show what is there
			for (const [id] of u.apps) hidden.delete(id);
			for (const id of u.gone) hidden.delete(id);
			if (u.screen) for (const id of [...hidden.keys()]) if (!u.screen.some((s) => s[0] === id)) hidden.delete(id);
		}
		const viewChanged = JSON.stringify([prev?.view, prev?.sight]) !== JSON.stringify([u.view, u.sight]);
		if (viewChanged) fullDirty = true;
		let changed = u.full || animEv || u.apps.length > 0 || u.gone.length > 0 || u.tiles.length > 0 || u.screen !== null || viewChanged;
		const e = u.eyeTile, pe = prev?.eyeTile;
		const now = performance.now();
		mv.serverState(u, prev);
		itemPred.lists(u);
		if (u.hud) setHudHint(u.hud);
		if (u.icons && preloadOn) preloadIcons(u.icons);
		if (mv.applyMoves(u, prev, now)) changed = true;
		if (now - mv.lastGlide.at < 500) for (const lf of freshFades) lf.ms = Math.max(50, Math.min(400, mv.lastGlide.ms)); // as long as the latest glide (the light's update can come a tick or two after the step)
		if (e && pe && (e.x !== pe.x || e.y !== pe.y) && !(u.moved ?? []).some((m) => m[3] === e.x && m[4] === e.y && m[1] === pe.x && m[2] === pe.y && m[6] !== 0 && !u.full)) camera.glide = null; // eye jumped: the camera snaps
		if (e && (!pe || e.x !== pe.x || e.y !== pe.y || viewChanged)) {
			changed = true;
			// Tiles that left the view (the worker forgets them too, and resends them if they come back). A smaller view (zooming in) drops them at once too, not at the next step.
			const [rx, ry] = viewHalf(u.view);
			const ring = mv.predOn ? 1 + mv.PRED_MAX : 1; // as client-view.ts clientSeen: one ring more than the view for the camera glide, more when the camera runs steps ahead
			for (const [k, t] of tiles) if (Math.abs(t.x - e.x) > rx + ring || Math.abs(t.y - e.y) > ry + ring) dropTile(k);
		}
		if (sg.takeBoxes(u)) changed = true;
		if (u.light !== undefined || u.full || lt.carried) { lt.applyCarried(u.light ?? (u.full ? [] : undefined)); changed ||= lt.carriedN > 0 || u.light !== undefined; }
		if (changed) { viewStats.changed++; schedule(); }
	};

	const { pointAt, locate, hudState } = makePointer({ host, get shown() { return shown; }, get last() { return last; }, get screen() { return screen; }, apps, hidden, items: itemPred, icons, t0, viewStats });
	return { update, check, pointAt, locate, predictKey: mv.predictKey, predictClick, predictSwap: () => swapHands(null), predictThrow, predictPick: itemPred.predictPick, predictPut: itemPred.predictPut, hudState };
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
