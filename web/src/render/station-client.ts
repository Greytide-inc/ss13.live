// station-client - Browser entry for the whole-station view (web/draw/index.html?scene=station).
// Loads web/build/2g/station.json (written by `npm run station-dump`: every turf/obj/mob
// appearance on Box Station's z2, one BuiltAppearance list per tile, see that tool's header) and
// draws all 65,025 tiles, panned and zoomed with the mouse.
//
// Not PixiJS, unlike draw-client.ts: 65k tiles average ~1.5 drawable layers each (turf + any
// objs/mobs on it, see station-dump.ts's own count in its log) -- tens of thousands of live Pixi
// sprites stutters on this project's reference laptop (Intel UHD 620, 8 GB RAM). Instead this file
// rasterises the whole map ONCE into a grid of plain <canvas> chunks (1024x1024 px each, 32x32
// tiles) using ordinary 2D drawImage calls, then pans/zooms by applying a CSS transform to the
// chunk grid's wrapper div -- the browser's compositor does that for free every frame, no redraw.
// Baking is the only per-tile work; after that, panning/zooming is as cheap as scrolling an image.

import { cellRect, dirIndex, type Dmi } from "../dmi/dmi.js";
import { parseDmiUrl } from "../dmi/dmi-browser.js";
import { animationElapsed, frameAtTime } from "../dmi/animation.js";
import type { Appearance, BuiltAppearance } from "../appearance/appearance.js";
import { findState } from "./sprite-lookup.js";
import { applyColorMatrix } from "./color-matrix.js";
import { drawImageWithTransform } from "./byond-transform.js";
import { drawMaptext } from "./maptext.js";

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

export const TILE_PX = 32; // native icon size, unscaled; zoom is a CSS transform on the whole grid, not a re-bake
const CHUNK_TILES = 32; // 1024x1024 px canvases -- comfortably under every browser's max canvas dimension
const CHUNK_PX = CHUNK_TILES * TILE_PX;

const status = document.getElementById("status")!;
function setStatus(msg: string): void {
	status.textContent = msg;
}

/** One loaded icon sheet, plain-canvas flavour (station-client + client-scene): parsed .dmi metadata
 *  plus the raw decoded <img>, drawn with ordinary drawImage calls (see this file's header for why
 *  not PixiJS). Exported so client-scene.ts shares the same loader/cache shape instead of
 *  duplicating it. */
export interface LoadedIcon {
	dmi: Dmi;
	img: HTMLImageElement;
}

export async function loadIcon(iconPath: string): Promise<LoadedIcon | null> {
	// blob: = a runtime icon from the worker, by the made-up name the page swaps for a real URL (worker/index.html, rtIcon)
	const url = iconPath.startsWith("blob:") ? ((globalThis as { rtIconUrls?: Map<string, string> }).rtIconUrls?.get(iconPath) ?? iconPath) : "/" + iconPath;
	const dmi = await parseDmiUrl(url);
	if (!dmi) return null;
	const img = new Image();
	img.src = url;
	await img.decode();
	return { dmi, img };
}

function collectIcons(dump: StationDump): Set<string> {
	const icons = new Set<string>();
	for (const t of dump.tiles) {
		for (const a of t.appearances) {
			if (a.icon) icons.add(a.icon);
			for (const o of a.overlays) if (o.icon) icons.add(o.icon);
		}
	}
	return icons;
}

/** Multiplies `img`'s cropped rect by a flat color (BYOND's simple string-color tint), masked back
 *  to the source's own alpha shape, into a small canvas (cached, see cachedTint) the caller then draws once. Only
 *  used for the ~3% of layers with a plain color; a color-matrix `color`
 *  (most of the rest -- mainly lighting overlays) is left untinted, same documented gap as
 *  draw-client.ts's Pixi renderer (would need a real color-matrix filter). */
// Tinted sprites, made once per image + rect + color (the live view redraws the same tinted sprites,
// e.g. every lit tile's lighting matrix, many times a second). ponytail: cleared whole when full.
const tintCache = new Map<string, HTMLCanvasElement>();
function cachedTint(img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }, color: string | readonly number[], make: (c: HTMLCanvasElement) => void): HTMLCanvasElement {
	const key = `${img.src}|${rect.x},${rect.y},${rect.w},${rect.h}|${color}`;
	let c = tintCache.get(key);
	if (!c) {
		if (tintCache.size >= 4096) tintCache.clear();
		c = document.createElement("canvas");
		c.width = rect.w;
		c.height = rect.h;
		make(c);
		tintCache.set(key, c);
	}
	return c;
}

function tintedRect(img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }, color: string): HTMLCanvasElement {
	return cachedTint(img, rect, color, (c) => tintInto(c, img, rect, color));
}
function tintInto(scratch: HTMLCanvasElement, img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }, color: string): void {
	const ctx = scratch.getContext("2d")!;
	ctx.globalCompositeOperation = "source-over";
	ctx.clearRect(0, 0, rect.w, rect.h);
	ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
	ctx.globalCompositeOperation = "multiply";
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, rect.w, rect.h);
	ctx.globalCompositeOperation = "destination-in";
	ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
	ctx.globalCompositeOperation = "source-over";
}

/** Which sheet frame a state shows, given two clock readings (see src/dmi/animation.ts).
 *  `frameTime` is the shared/global clock (used for loop=0 states); `objectFrameTime` is deciseconds
 *  since THIS object appeared (used for loop>0 states, which start fresh at frame 0 per object rather
 *  than sharing the scene's clock -- BYOND 511 video). It defaults to `frameTime`, so every
 *  call site that doesn't know about per-object start times (the station view's one-shot bake, which
 *  never passes either) keeps drawing exactly frame 0 of everything, unchanged from before this chunk. */
export function frameForState(
	state: { frames: number; delay: number[]; loop: number; rewind: boolean },
	frameTime: number,
	objectFrameTime: number = frameTime,
	flickT0?: number,
): number {
	if (state.frames <= 1) return 0;
	if (flickT0 !== undefined) return frameAtTime(state.frames, state.delay, 1, state.rewind, frameTime - flickT0); // a flick() plays once from its own start
	const t = animationElapsed(state.loop, frameTime, objectFrameTime);
	return frameAtTime(state.frames, state.delay, state.loop, state.rewind, t);
}

/** Draws one appearance layer (an atom's own appearance, or a flattened overlay) at tile-local pixel
 *  origin (originX, originY) -- the tile's own top-left in this chunk's canvas. Same anchoring as
 *  draw-client.ts's spriteFor: BYOND's pixel_y is y-up, canvas y-down, so it's negated; an icon
 *  taller than 32px (e.g. a tree) extends upward from its 32x32 tile footprint. `frameTime`
 *  is deciseconds since the animation's start; omit it (or pass 0) for a static frame-0 draw. */
export function drawLayer(ctx: CanvasRenderingContext2D, a: Appearance, icons: Map<string, LoadedIcon>, originX: number, originY: number, frameTime = 0, objectFrameTime: number = frameTime): void {
	if (!a.icon) return;
	const loaded = icons.get(a.icon);
	if (!loaded) return;
	const state = findState(loaded.dmi, a.iconState);
	if (!state) return;
	const di = dirIndex(state.dirs, a.dir);
	const frame = frameForState(state, frameTime, objectFrameTime, a.flickT0);
	const cell = state.cells[di]?.[frame] ?? state.cells[0][0];
	const rect = cellRect(loaded.dmi, cell);
	const dx = originX + a.pixelX;
	const dy = originY - a.pixelY - (rect.h - 32);
	const alpha = a.alpha / 255;
	if (alpha <= 0) return;
	ctx.globalAlpha = alpha;
	const transform = a.transform;
	if (typeof a.color === "string") {
		try {
			const tinted = tintedRect(loaded.img, rect, a.color);
			drawImageWithTransform(ctx, tinted, { x: 0, y: 0, w: rect.w, h: rect.h }, dx, dy, transform);
		} catch {
			// bad color string -- draw untinted rather than nothing
			drawImageWithTransform(ctx, loaded.img, rect, dx, dy, transform);
		}
	} else {
		drawImageWithTransform(ctx, loaded.img, rect, dx, dy, transform);
	}
	ctx.globalAlpha = 1;
}

/** Draws a layer's icon, then its maptext (if set) on top, clipped to its own box. maptext is
 *  positioned from the tile origin plus the layer's pixel_x/pixel_y (the maptext box moves with the atom, as in
 *  BYOND: a wall status display with pixel_x 32 shows its text on its own screen), then maptext_x/y on top. */
function drawLayerWithMaptext(ctx: CanvasRenderingContext2D, a: Appearance, icons: Map<string, LoadedIcon>, originX: number, originY: number, frameTime: number, objectFrameTime: number): void {
	drawLayer(ctx, a, icons, originX, originY, frameTime, objectFrameTime);
	if (a.maptext) drawMaptext(ctx, a, originX + a.pixelX, originY - a.pixelY, TILE_PX);
}

export function drawAppearance(ctx: CanvasRenderingContext2D, a: BuiltAppearance, icons: Map<string, LoadedIcon>, originX: number, originY: number, frameTime = 0, objectFrameTime: number = frameTime): void {
	drawLayerWithMaptext(ctx, a, icons, originX, originY, frameTime, objectFrameTime);
	// Overlay pixel offsets are relative to the parent's (BYOND adds them), e.g. an APC's screen
	// overlays have pixel_y 0 and ride along with the casing's pixel_y -24. Overlays share their
	// parent's own appear time (objectFrameTime) -- BYOND doesn't give them an independent one.
	for (const o of a.overlays) drawLayerWithMaptext(ctx, o, icons, originX + a.pixelX, originY - a.pixelY, frameTime, objectFrameTime);
}

// --- Lighting -------------------------------------------------------------------------------
//
// Every tile carries a lighting_object atom (code/modules/lighting/lighting_object.dm):
// icon icons/effects/lighting_object.dmi, plane 15 (LIGHTING_PLANE), blend_mode 2. In-game that
// plane's own content is composited onto everything below it with BLEND_MULTIPLY -- not because the
// lighting_object itself is BLEND_MULTIPLY (its DM source sets BLEND_ADD=2, used to combine
// multiple overlapping lighting objects into one plane image), but because the *plane master* for
// LIGHTING_PLANE is (code/_onclick/hud/plane_master.dm: `/obj/screen/plane_master/lighting`,
// `blend_mode = BLEND_MULTIPLY`) -- BYOND composites a whole plane onto the planes below it using
// its plane master's blend_mode. station.json has exactly one lighting_object per tile (no
// overlap), so we don't need to reproduce the ADD-combine step -- just draw each tile's one
// lighting appearance multiplied onto that tile's already-drawn floor/objects.
//
// Three shapes turn up in the dump:
//  - icon_state "dark", color null: the tile is unlit. The sprite's pixels are already flat opaque
//    black -- multiplying black onto anything makes it black, which is correct (unlit maint really
//    is black to a player standing in it).
//  - icon_state "transparent", color null: the tile is fully lit. The sprite's pixels are already
//    flat opaque white -- multiplying white changes nothing, which is correct (a fully-lit tile is
//    unmodified by lighting).
//  - icon_state "", color a 20-number matrix: partial/directional light. This sprite is a per-pixel
//    R/G/B/A corner gradient (see color-matrix.ts's header) that the matrix remaps into the tile's
//    real bilinear-blended light color; see applyColorMatrix. This is the case that showed up as a
//    raw green/blue gradient before this chunk.
//
// Out of scope: a lighting_object's `color` can also be *animated* (the lighting subsystem
// transitions tiles smoothly between two matrices as light sources move/flicker,
// code/modules/lighting/lighting_object.dm's update() plus the engine's built-in `animate()` easing)
// -- station.json is one static snapshot, so this always draws the settled end-state matrix, never
// a mid-transition blend. Not attempted here.

export const LIGHTING_PLANE = 15;
export const LIGHTING_BLEND_MODE = 2;

export function isLighting(a: Appearance): boolean {
	return a.plane === LIGHTING_PLANE && a.blendMode === LIGHTING_BLEND_MODE;
}

/** Reads a sprite rect's pixels exactly as stored in the PNG, i.e. NOT premultiplied by alpha.
 *  The lighting "" sprite keeps its corner weights in R/G/B at alpha ~1 (only its NE weight is in
 *  alpha), and a 2D canvas stores pixels premultiplied, so drawImage + getImageData rounds those
 *  weights away and each tile showed a bright glint. WebGL with UNPACK_PREMULTIPLY_ALPHA off hands
 *  back the raw values. Cached per image + rect. */
const rawCache = new Map<string, Uint8ClampedArray>();
let rawGl: WebGLRenderingContext | null = null;
function rawRect(img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }): Uint8ClampedArray {
	const key = `${img.src}|${rect.x},${rect.y},${rect.w},${rect.h}`;
	const hit = rawCache.get(key);
	if (hit) return hit;
	if (!rawGl) rawGl = document.createElement("canvas").getContext("webgl");
	const gl = rawGl;
	if (!gl) throw new Error("WebGL unavailable: can't read unpremultiplied lighting sprite");
	const tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	const fb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	// Texture row 0 is the image's top row (no UNPACK_FLIP_Y), so this reads rows top-down.
	const out = new Uint8Array(rect.w * rect.h * 4);
	gl.readPixels(rect.x, rect.y, rect.w, rect.h, gl.RGBA, gl.UNSIGNED_BYTE, out);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.deleteFramebuffer(fb);
	gl.deleteTexture(tex);
	const data = new Uint8ClampedArray(out.buffer);
	rawCache.set(key, data);
	return data;
}

/** Runs the sprite's raw pixels through a BYOND color matrix into a scratch canvas. The matrix's
 *  constant row makes the result opaque, so putImageData loses nothing. Returns the (cached) canvas
 *  so the caller can drawImage it once. */
export function matrixTintedRect(img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }, matrix: readonly number[]): HTMLCanvasElement {
	return cachedTint(img, rect, matrix, (c) => {
		const imageData = new ImageData(new Uint8ClampedArray(rawRect(img, rect)), rect.w, rect.h);
		applyColorMatrix(imageData.data, matrix);
		c.getContext("2d")!.putImageData(imageData, 0, 0);
	});
}

/** Draws one lighting-plane layer, with normal (source-over) compositing, onto the *lighting*
 *  chunk canvas -- a separate transparent canvas stacked on top of the base map canvas with CSS
 *  `mix-blend-mode: multiply` (see main()/index.html), so the actual multiply-onto-the-map happens
 *  for free in the compositor and can be toggled on/off without re-baking anything. */
function drawLightingLayer(ctx: CanvasRenderingContext2D, a: Appearance, icons: Map<string, LoadedIcon>, originX: number, originY: number, frameTime = 0, objectFrameTime: number = frameTime): void {
	if (!a.icon) return;
	const loaded = icons.get(a.icon);
	if (!loaded) return;
	const state = findState(loaded.dmi, a.iconState);
	if (!state) return;
	const di = dirIndex(state.dirs, a.dir);
	const frame = frameForState(state, frameTime, objectFrameTime, a.flickT0);
	const cell = state.cells[di]?.[frame] ?? state.cells[0][0];
	const rect = cellRect(loaded.dmi, cell);
	const dx = originX + a.pixelX;
	const dy = originY - a.pixelY - (rect.h - 32);
	const alpha = a.alpha / 255;
	if (alpha <= 0) return;
	ctx.globalAlpha = alpha;
	const transform = a.transform;
	if (Array.isArray(a.color)) {
		const tinted = matrixTintedRect(loaded.img, rect, a.color);
		drawImageWithTransform(ctx, tinted, { x: 0, y: 0, w: rect.w, h: rect.h }, dx, dy, transform);
	} else {
		// "transparent"/"dark" (color null): the sprite's own pixels are already the correct flat
		// multiply-ready color (opaque white / opaque black respectively) -- draw as-is.
		drawImageWithTransform(ctx, loaded.img, rect, dx, dy, transform);
	}
	ctx.globalAlpha = 1;
}

export function drawLighting(ctx: CanvasRenderingContext2D, a: BuiltAppearance, icons: Map<string, LoadedIcon>, originX: number, originY: number, frameTime = 0, objectFrameTime: number = frameTime): void {
	drawLightingLayer(ctx, a, icons, originX, originY, frameTime, objectFrameTime);
	for (const o of a.overlays) drawLightingLayer(ctx, o, icons, originX + a.pixelX, originY - a.pixelY, frameTime, objectFrameTime);
}

export async function main(): Promise<void> {
	setStatus("loading station.json...");
	const dump = (await (await fetch("/web/build/2g/station.json")).json()) as StationDump;

	const iconPaths = collectIcons(dump);
	setStatus(`loading ${iconPaths.size} .dmi files...`);
	const icons = new Map<string, LoadedIcon>();
	let loaded = 0;
	for (const path of iconPaths) {
		const li = await loadIcon(path);
		if (li) icons.set(path, li);
		else console.warn(`failed to load ${path}`);
		if (++loaded % 40 === 0) setStatus(`loading .dmi files... ${loaded}/${iconPaths.size}`);
	}

	setStatus(`baking ${dump.tiles.length} tiles...`);
	const host = document.getElementById("station-host")!;
	host.innerHTML = "";
	const viewport = document.createElement("div");
	viewport.id = "station-viewport";
	const world = document.createElement("div");
	world.id = "station-world";
	viewport.appendChild(world);
	host.appendChild(viewport);

	const numChunksX = Math.ceil(dump.width / CHUNK_TILES);
	const numChunksY = Math.ceil(dump.height / CHUNK_TILES);
	// Two canvases per chunk, indexed [cy][cx]: the base map (floors/walls/objs/mobs), and a
	// separate transparent lighting canvas stacked exactly on top of it with CSS
	// `mix-blend-mode: multiply` (index.html). Keeping lighting on its own canvas layer means the
	// on/off toggle just hides/shows that layer -- no re-baking either grid.
	const chunkCtx: CanvasRenderingContext2D[][] = [];
	function makeChunk(cx: number, cy: number, extraClass: string): CanvasRenderingContext2D {
		const canvas = document.createElement("canvas");
		canvas.width = CHUNK_PX;
		canvas.height = CHUNK_PX;
		canvas.className = `station-chunk ${extraClass}`.trim();
		// BYOND y grows upward; a chunk covering larger tile-y values sits nearer the top of the
		// world div (smaller `top`), same flip convention as draw-client.ts's 5x5 scene.
		canvas.style.left = `${cx * CHUNK_PX}px`;
		canvas.style.top = `${(numChunksY - 1 - cy) * CHUNK_PX}px`;
		return canvas.getContext("2d")!;
	}
	for (let cy = 0; cy < numChunksY; cy++) {
		const row: CanvasRenderingContext2D[] = [];
		for (let cx = 0; cx < numChunksX; cx++) {
			const ctx = makeChunk(cx, cy, "");
			world.appendChild(ctx.canvas);
			row.push(ctx);
		}
		chunkCtx.push(row);
	}
	world.style.width = `${numChunksX * CHUNK_PX}px`;
	world.style.height = `${numChunksY * CHUNK_PX}px`;
	// Isolate mix-blend-mode to world's own children (base + lighting canvases), so lighting
	// multiplies onto the map, not onto the page background behind the whole viewport.
	world.style.isolation = "isolate";

	// The lighting canvases are appended AFTER every base canvas above, so in DOM/paint order they
	// sit on top; `display: contents` on their wrapper means it contributes no box of its own (the
	// canvases still position absolutely against `world`, same coordinate space as the base grid),
	// so toggling the whole layer is just wrapper.style.display = "none"/"contents".
	const lightingLayer = document.createElement("div");
	lightingLayer.id = "station-lighting-layer";
	lightingLayer.style.display = "contents";
	world.appendChild(lightingLayer);
	const lightingChunkCtx: CanvasRenderingContext2D[][] = [];
	for (let cy = 0; cy < numChunksY; cy++) {
		const row: CanvasRenderingContext2D[] = [];
		for (let cx = 0; cx < numChunksX; cx++) {
			const ctx = makeChunk(cx, cy, "station-lighting-chunk");
			lightingLayer.appendChild(ctx.canvas);
			row.push(ctx);
		}
		lightingChunkCtx.push(row);
	}

	for (const tile of dump.tiles) {
		const cx = Math.floor((tile.x - 1) / CHUNK_TILES);
		const cy = Math.floor((tile.y - 1) / CHUNK_TILES);
		const ctx = chunkCtx[cy]?.[cx];
		const lctx = lightingChunkCtx[cy]?.[cx];
		if (!ctx || !lctx) continue;
		const localTileX = (tile.x - 1) % CHUNK_TILES;
		const localTileY = (tile.y - 1) % CHUNK_TILES;
		const originX = localTileX * TILE_PX;
		// within the chunk, the row with the largest tile.y is at the top (pixel row 0)
		const originY = (CHUNK_TILES - 1 - localTileY) * TILE_PX;
		for (const a of tile.appearances) {
			if (isLighting(a)) drawLighting(lctx, a, icons, originX, originY);
			else drawAppearance(ctx, a, icons, originX, originY);
		}
	}

	setupLightingToggle(lightingLayer);

	// Center the initial view roughly on the map, at a zoom that fits most of it on screen.
	const vpRect = viewport.getBoundingClientRect();
	const worldPxW = numChunksX * CHUNK_PX, worldPxH = numChunksY * CHUNK_PX;
	const fitScale = Math.min(vpRect.width / worldPxW, vpRect.height / worldPxH, 1);
	world.style.transform = `translate(${(vpRect.width - worldPxW * fitScale) / 2}px, ${(vpRect.height - worldPxH * fitScale) / 2}px) scale(${fitScale})`;
	setupPanZoom(viewport, world, fitScale);

	setStatus(`drew ${dump.tiles.length} tiles, z${dump.z}, ${dump.width}x${dump.height} (built ${dump.builtAt}). Drag to pan, wheel to zoom, L to toggle lighting.`);
}

/** Wires up the lighting on/off control: the `#lighting-toggle` checkbox (index.html) and the `L`
 *  key both just flip `lightingLayer`'s visibility -- the layer is already fully baked, so there is
 *  nothing to redraw. Default is on (checkbox starts checked, layer starts `display: contents`). */
function setupLightingToggle(lightingLayer: HTMLElement): void {
	const checkbox = document.getElementById("lighting-toggle") as HTMLInputElement | null;
	const apply = (on: boolean) => {
		lightingLayer.style.display = on ? "contents" : "none";
	};
	if (checkbox) {
		checkbox.checked = true;
		checkbox.addEventListener("change", () => apply(checkbox.checked));
	}
	window.addEventListener("keydown", (e) => {
		if (e.key !== "l" && e.key !== "L") return;
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		const on = checkbox ? !checkbox.checked : lightingLayer.style.display === "none";
		if (checkbox) checkbox.checked = on;
		apply(on);
	});
}

/** Pan (drag) + zoom (wheel, around the cursor) on `world` inside `viewport`, via a CSS transform --
 *  the compositor handles every frame, no re-bake or per-frame JS drawing work. Reads its starting
 *  pan/scale back off `world`'s already-applied initial transform (set by the caller, to center and
 *  fit the map on first load) instead of assuming pan=0,0 scale=1. */
function setupPanZoom(viewport: HTMLElement, world: HTMLElement, initialScale: number): void {
	const m = new DOMMatrix(getComputedStyle(world).transform);
	let panX = m.e, panY = m.f, scale = initialScale;
	const apply = () => {
		world.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
	};
	let dragging = false, lastX = 0, lastY = 0;
	viewport.addEventListener("pointerdown", (e) => {
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		viewport.setPointerCapture(e.pointerId);
	});
	viewport.addEventListener("pointermove", (e) => {
		if (!dragging) return;
		panX += e.clientX - lastX;
		panY += e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		apply();
	});
	const stop = () => {
		dragging = false;
	};
	viewport.addEventListener("pointerup", stop);
	viewport.addEventListener("pointercancel", stop);
	viewport.addEventListener(
		"wheel",
		(e) => {
			e.preventDefault();
			const rect = viewport.getBoundingClientRect();
			const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
			const worldX = (cx - panX) / scale, worldY = (cy - panY) / scale;
			const factor = Math.exp(-e.deltaY * 0.0015);
			scale = Math.min(8, Math.max(0.05, scale * factor));
			panX = cx - worldX * scale;
			panY = cy - worldY * scale;
			apply();
		},
		{ passive: false },
	);
}
