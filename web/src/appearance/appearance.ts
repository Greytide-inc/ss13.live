// Appearances: turns a live atom in the VM into a plain-data record of
// everything a renderer needs to draw it -- icon, icon_state, dir, layer, plane, overlays/
// underlays (flattened, recursively, with BYOND's floating-layer/plane and inherited icon/dir
// rules), color, alpha, transform and pixel offsets, invisibility and blend_mode.
//
// This module only reads vars through the ordinary DMObject/DMList API (objects.ts, value.ts) --
// no Node APIs (fs, zlib, ...) -- so it can run in a browser worker exactly as it runs in Node
// tests today. Its *output* (`Appearance`/`BuiltAppearance`) is plain JSON-serialisable data with
// no VM object references, so it can cross the worker/page postMessage boundary untouched.
//
// BYOND rules implemented here, and where they come from:
//
//  - FLOAT_LAYER (-1) / FLOAT_PLANE (-32767): the default `layer`/`plane` of /image (and its
//    subtype /mutable_appearance), confirmed in the DM standard library
//    (env/src/OpenDream/DMCompiler/DMStandard/{Defines,_Globals,Types/Image}.dm: `#define
//    FLOAT_LAYER -1`, `#define FLOAT_PLANE -32767`, `/image var/layer = FLOAT_LAYER`, `var/plane =
//    FLOAT_PLANE`) and by tg's own comment in code/datums/mutable_appearance.dm ("plane =
//    FLOAT_PLANE ... BYOND ignores it if you set it as a normal var").
//  - The floating-layer math (an overlay/underlay with a negative layer sits at a fixed offset
//    from its owner's layer instead of an absolute layer) and the icon/icon_state/dir inheritance
//    rule (an overlay with no icon/icon_state/dir of its own uses its owner's *resolved* one,
//    recursively) are both taken directly from tg's own flattening helper,
//    code/__HELPERS/icons.dm's `getFlatIcon()`:
//      - `currentLayer = current:layer; if(currentLayer<0) { if(underlay) currentLayer =
//        A.layer+currentLayer/1000; else currentLayer = A.layer+(1000+currentLayer)/1000 }`
//      - `curdir = (A.dir != 2) ? A.dir : defdir` (2 = SOUTH, the default direction) -- so a
//        default-direction overlay inherits its owner's dir, but an overlay given an explicit dir
//        keeps it regardless of the owner's facing.
//      - the recursive call `getFlatIcon(new/image(I), curdir, curicon, curstate, curblend)` shows
//        icon/icon_state/dir/blend_mode are threaded down the same way: an unset value inherits the
//        immediate parent's *already-resolved* value, not the top-level atom's raw one.
//    getFlatIcon() is tg's chat-message icon flattener, not the game's live renderer, so one
//    assumption doesn't come from it: this module does NOT replicate its `currentLayer <= -1000 =>
//    return a blank icon` special case (a "hide everything" hack specific to that one helper). A
//    layer that negative here is just resolved by the same formula as any other floating layer.
//
// Assumptions not confirmed against a running BYOND (no DM reference text was found in
// env/byond):
//  - icon_state precedence when `atom.icon` is itself an `icon()` object carrying its own baked-in
//    state: the atom/image's own `icon_state` var wins if set; otherwise the icon object's own
//    `icon_state` is used; otherwise "" (documented BYOND behaviour, not re-verified here).
//  - alpha, color, blend_mode, transform, pixel_x/pixel_y and invisibility are each the item's own
//    value, never inherited from the owner (only icon, icon_state, dir, layer and plane are).
//  - pixel_x/pixel_y are reported as each layer's own raw offset, not pre-added to the owner's; a
//    renderer that wants the final on-screen offset must add the owner's pixelX/pixelY itself. This
//    keeps "what BYOND actually composites" (icon flattening) separate from "where the renderer
//    places it on screen", which this module deliberately doesn't decide.
//  - A non-DMObject item in an overlays/underlays list (shouldn't happen: BYOND only allows
//    /image, /mutable_appearance or /atom references there) is silently skipped rather than erroring.

import { DMList, DMObject, live } from "../vm/objects.js";
import { DMAppearance } from "../vm/appearances.js";
import { Resource } from "../vm/objtree.js";
import { SOUTH } from "../vm/world.js";
import { inherit } from "../render/inherit.js";
import type { Value } from "../vm/value.js";

export const FLOAT_LAYER = -1;
export const FLOAT_PLANE = -32767;
const DEFAULT_DIR = SOUTH;
const MAX_OVERLAY_DEPTH = 8;

/** One drawable layer: an atom's own appearance, or one flattened overlay/underlay. Plain data. */
export interface Appearance {
	/** File path of the .dmi (or plain image) this layer draws from, or null for no icon (invisible). */
	icon: string | null;
	iconState: string;
	dir: number;
	/** Resolved, absolute layer: floating (negative) overlay/underlay layers are already applied
	 *  relative to their owner, so every Appearance in a scene sorts correctly by plane then layer. */
	layer: number;
	/** Set on an overlay/underlay entry whose own layer was >= 0 (an absolute layer). The renderer
	 *  sorts it against every other atom at that layer; an entry without it (floating layer) draws
	 *  inside its owner's slot: underlays just below the owner, overlays just above. */
	explicitLayer?: true;
	/** Resolved, absolute plane (FLOAT_PLANE already replaced by the owner's plane). */
	plane: number;
	/** A color name/hex string, a flattened color-matrix (raw numbers, length not validated here), or null. */
	color: string | number[] | null;
	alpha: number;
	/** [a, b, c, d, e, f] (BYOND /matrix order), or null for no transform (identity). */
	transform: number[] | null;
	/** Includes pixel_w (x) / pixel_z (y): on a top-down map they offset like pixel_x/pixel_y (an1). */
	pixelX: number;
	pixelY: number;
	/** the pixel_w / pixel_z part already inside pixelX / pixelY, on a root appearance, only when non-zero (so the page can animate each var alone). */
	pixelW?: number;
	pixelZ?: number;
	invisibility: number;
	blendMode: number;
	/** appearance_flags, overlays/underlays only and only when non-zero (RESET_* are read by render/inherit.ts). */
	flags?: number;
	/** The small HTML-subset text BYOND draws on top of this layer's icon, or null if unset.
	 *  Own value only, never inherited from the owner (same as color/alpha/transform -- see header
	 *  assumptions). Defaults confirmed against the DM standard library (env/src/OpenDream/
	 *  DMCompiler/DMStandard/Types/{Image,Atoms/_Atom}.dm: `maptext = null`, `maptext_width = 32`,
	 *  `maptext_height = 32`, `maptext_x = 0`, `maptext_y = 0`) -- high confidence: this matches
	 *  documented BYOND behaviour (a maptext box defaults to the same 32x32 footprint as a standard
	 *  icon cell) and OpenDream's reimplementation agrees exactly on all five values. */
	maptext: string | null;
	maptextWidth: number;
	maptextHeight: number;
	maptextX: number;
	maptextY: number;
	/** The atom's own mouse_opacity, set only when it isn't the default 1 (0 = clicks pass through, 2 = the whole box takes them). Top level only. */
	mouseOpacity?: number;
	/** Page only: a flick() is playing this state; its start on the page clock (deciseconds). */
	flickT0?: number;
	/** pt-d, page only, top level: when this appearance arrived (page clock, deciseconds). loop>0 states (airlock "opening") play once from here, as BYOND restarts them when the appearance changes. */
	appearedT0?: number;
}

/** An atom's full appearance: its own drawable plus every overlay/underlay, flattened and sorted. */
export interface BuiltAppearance extends Appearance {
	/** Underlays and overlays together, resolved to absolute layer/plane, in ascending (plane,
	 *  layer) draw order (ties keep list order: underlays before overlays, each in list order --
	 *  matches getFlatIcon's stable insertion sort). Does not include the atom's own layer. How a renderer
	 *  places them against other atoms (owner's slot vs `explicitLayer`) is in client-scene.ts itemsOf. */
	overlays: Appearance[];
}

function num(v: Value, dflt: number): number {
	return typeof v === "number" ? v : dflt;
}

function getVar(obj: DMObject, name: string): Value {
	return obj.hasVar(name) ? live(obj.getVar(name)) : null;
}

/** `icon` var: a file resource, a plain path text, or an /icon datum (itself wrapping one of those). */
export function resolveIconPath(v: Value, depth = 0): string | null {
	if (v === null || depth > MAX_OVERLAY_DEPTH) return null;
	if (v instanceof Resource) return v.path;
	if (typeof v === "string") return v;
	if (v instanceof DMObject && v.hasVar("icon")) return resolveIconPath(getVar(v, "icon"), depth + 1);
	return null;
}

/** `icon_state`, falling back to an `icon()` object's own baked-in state (see header assumptions). */
function ownIconState(obj: DMObject): string | null {
	const s = getVar(obj, "icon_state");
	if (typeof s === "string") return s;
	const iconVar = getVar(obj, "icon");
	if (iconVar instanceof DMObject) {
		const inner = getVar(iconVar, "icon_state");
		if (typeof inner === "string") return inner;
	}
	return null;
}

function colorOf(v: Value): string | number[] | null {
	if (typeof v === "string") return v;
	if (v instanceof DMList) return v.items.map((x) => (typeof x === "number" ? x : 0));
	return null;
}

/** `transform`: a /matrix datum's a..f vars, or null (no transform set = identity). */
function transformOf(v: Value): number[] | null {
	if (!(v instanceof DMObject) || !v.hasVar("a")) return null;
	return ["a", "b", "c", "d", "e", "f"].map((k, i) => num(getVar(v, k), i === 0 || i === 4 ? 1 : 0));
}

/** An object's own appearance vars, unresolved: null means "not set" (inherit or default). */
export interface RawVars {
	icon: string | null;
	iconState: string | null;
	dir: number | null;
	/** dir came from image()'s dir argument: kept when drawn even if SOUTH (vm/appearances.ts, ov1). */
	dirFixed?: true;
	layer: number;
	plane: number;
	color: string | number[] | null;
	alpha: number;
	transform: number[] | null;
	pixelX: number;
	pixelY: number;
	pixelW?: number;
	pixelZ?: number;
	invisibility: number;
	blendMode: number;
	flags?: number;
	maptext: string | null;
	maptextWidth: number;
	maptextHeight: number;
	maptextX: number;
	maptextY: number;
}

function maptextOf(v: Value): string | null {
	return typeof v === "string" && v !== "" ? v : null;
}

function rawVarsOf(obj: DMObject): RawVars {
	const dir = getVar(obj, "dir");
	return {
		icon: resolveIconPath(getVar(obj, "icon")),
		iconState: ownIconState(obj),
		dir: typeof dir === "number" ? dir : null,
		...(obj instanceof DMAppearance && obj.dirFixed ? { dirFixed: true as const } : {}),
		layer: num(getVar(obj, "layer"), FLOAT_LAYER),
		plane: num(getVar(obj, "plane"), FLOAT_PLANE),
		color: colorOf(getVar(obj, "color")),
		alpha: num(getVar(obj, "alpha"), 255),
		transform: transformOf(getVar(obj, "transform")),
		pixelX: num(getVar(obj, "pixel_x"), 0) + num(getVar(obj, "pixel_w"), 0),
		pixelY: num(getVar(obj, "pixel_y"), 0) + num(getVar(obj, "pixel_z"), 0),
		pixelW: num(getVar(obj, "pixel_w"), 0),
		pixelZ: num(getVar(obj, "pixel_z"), 0),
		invisibility: num(getVar(obj, "invisibility"), 0),
		blendMode: num(getVar(obj, "blend_mode"), 0),
		flags: num(getVar(obj, "appearance_flags"), 0),
		maptext: maptextOf(getVar(obj, "maptext")),
		maptextWidth: num(getVar(obj, "maptext_width"), 32),
		maptextHeight: num(getVar(obj, "maptext_height"), 32),
		maptextX: num(getVar(obj, "maptext_x"), 0),
		maptextY: num(getVar(obj, "maptext_y"), 0),
	};
}

/** The root atom's own appearance: nothing to inherit from, so unset icon_state/dir get plain defaults. */
function resolveRoot(obj: DMObject): Appearance {
	const raw = rawVarsOf(obj);
	return {
		icon: raw.icon,
		iconState: raw.iconState ?? "",
		dir: raw.dir ?? DEFAULT_DIR,
		layer: raw.layer,
		// A placed atom's plane is a real /atom var (default 0, never FLOAT_PLANE in practice --
		// only /image defaults to FLOAT_PLANE); the fallback below only guards a hand-built object.
		plane: raw.plane === FLOAT_PLANE ? 0 : raw.plane,
		color: raw.color,
		alpha: raw.alpha,
		transform: raw.transform,
		pixelX: raw.pixelX,
		pixelY: raw.pixelY,
		...(raw.pixelW ? { pixelW: raw.pixelW } : {}),
		...(raw.pixelZ ? { pixelZ: raw.pixelZ } : {}),
		invisibility: raw.invisibility,
		blendMode: raw.blendMode,
		maptext: raw.maptext,
		maptextWidth: raw.maptextWidth,
		maptextHeight: raw.maptextHeight,
		maptextX: raw.maptextX,
		maptextY: raw.maptextY,
	};
}

export function resolveOverlay(raw: RawVars, owner: Appearance, isUnderlay: boolean): Appearance {
	const icon = raw.icon ?? owner.icon;
	const iconState = raw.iconState ?? owner.iconState;
	// dir 0: an overlay entry made from something whose dir was assigned at run time reads 0 in
	// BYOND (vm/appearances.ts); it follows the owner. So does a SOUTH one, unless it came from
	// image()'s dir argument (measured, tests/render-rules/nested.dm row 7).
	const dir = raw.dir === null || raw.dir === 0 || (raw.dir === DEFAULT_DIR && !raw.dirFixed) ? owner.dir : raw.dir;
	const plane = raw.plane === FLOAT_PLANE ? owner.plane : raw.plane;
	const layer = raw.layer < 0 ? owner.layer + (isUnderlay ? raw.layer / 1000 : (1000 + raw.layer) / 1000) : raw.layer;
	return {
		icon,
		iconState,
		dir,
		layer,
		...(raw.layer >= 0 ? { explicitLayer: true as const } : {}),
		plane,
		color: raw.color,
		alpha: raw.alpha,
		transform: raw.transform,
		pixelX: raw.pixelX,
		pixelY: raw.pixelY,
		invisibility: raw.invisibility,
		blendMode: raw.blendMode,
		...(raw.flags ? { flags: raw.flags } : {}),
		maptext: raw.maptext,
		maptextWidth: raw.maptextWidth,
		maptextHeight: raw.maptextHeight,
		maptextX: raw.maptextX,
		maptextY: raw.maptextY,
	};
}

function flattenList(list: Value, owner: Appearance, isUnderlay: boolean, depth: number, out: Appearance[]): void {
	if (!(list instanceof DMList) || depth > MAX_OVERLAY_DEPTH) return;
	for (const rawItem of list.items) {
		const item = live(rawItem);
		if (!(item instanceof DMObject)) continue; // unverified: BYOND shouldn't put anything else here
		const resolved = resolveOverlay(rawVarsOf(item), owner, isUnderlay);
		// An /image or referenced /atom can carry its own overlays/underlays: they draw as one group with it.
		const nested: Appearance[] = [];
		if (item.hasVar("underlays")) nestedList(getVar(item, "underlays"), resolved, true, depth + 1, nested);
		nested.push(resolved);
		if (item.hasVar("overlays")) nestedList(getVar(item, "overlays"), resolved, false, depth + 1, nested);
		for (const n of nested) out.push(n === resolved ? n : { ...n, layer: n.explicitLayer ? n.layer : resolved.layer, ...(n.plane === resolved.plane ? {} : { plane: n.plane }) });
	}
}

/** An overlay's own overlays/underlays (ov1, measured in BYOND 511: tests/render-rules/nested.dm).
 *  They draw in their parent's slot: underlays just under it, overlays just over it (a child with a
 *  lower float layer, e.g. FLOAT_LAYER-25, still draws over its parent), and a later sibling of the
 *  parent draws over the whole group. Pixel offsets add up (a child is placed relative to its
 *  parent). Siblings sort by float layer among themselves, like top-level ones (assumed). The
 *  parent's alpha/color carry down (transform: unmodelled). Out: flat, in draw order; the caller
 *  gives every floating member the group's layer so the outer stable sort keeps the group together. */
function nestedList(list: Value, parent: Appearance, isUnderlay: boolean, depth: number, out: Appearance[]): void {
	if (!(list instanceof DMList) || depth > MAX_OVERLAY_DEPTH) return;
	const kids: { raw: RawVars; item: DMObject }[] = [];
	for (const rawItem of list.items) {
		const item = live(rawItem);
		if (item instanceof DMObject) kids.push({ raw: rawVarsOf(item), item });
	}
	kids.sort((a, b) => (a.raw.layer < 0 && b.raw.layer < 0 ? a.raw.layer - b.raw.layer : 0)); // stable
	for (const { raw, item } of kids) {
		const r = resolveOverlay(raw, parent, isUnderlay);
		const { transform: _t, ...colored } = inherit(r, parent);
		const resolved: Appearance = { ...colored, transform: r.transform, pixelX: r.pixelX + parent.pixelX, pixelY: r.pixelY + parent.pixelY };
		if (item.hasVar("underlays")) nestedList(getVar(item, "underlays"), resolved, true, depth + 1, out);
		out.push(resolved);
		if (item.hasVar("overlays")) nestedList(getVar(item, "overlays"), resolved, false, depth + 1, out);
	}
}

/** Builds the flattened, plain-data appearance of a live atom (or /image/mutable_appearance). */
export function buildAppearance(atom: DMObject): BuiltAppearance {
	const root = resolveRoot(atom);
	const overlays: Appearance[] = [];
	if (atom.hasVar("underlays")) flattenList(getVar(atom, "underlays"), root, true, 0, overlays);
	if (atom.hasVar("overlays")) flattenList(getVar(atom, "overlays"), root, false, 0, overlays);
	// Stable sort (guaranteed since ES2019): ties keep insertion order, i.e. underlays before
	// overlays and list order within each -- matching getFlatIcon's stable insertion sort.
	overlays.sort((a, b) => a.plane - b.plane || a.layer - b.layer);
	const mo = getVar(atom, "mouse_opacity");
	return typeof mo === "number" && mo !== 1 ? { ...root, overlays, mouseOpacity: mo } : { ...root, overlays };
}
