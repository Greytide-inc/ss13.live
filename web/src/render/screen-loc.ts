// screen-loc - Parses BYOND `screen_loc` strings (client.screen HUD placement) into pixel-ready
// tile/pixel coordinates. Pure function, no DOM/VM dependency: takes the raw string plus the
// viewport size (in tiles -- tg's world.view=7 gives a 15x15 client.view) and returns either a
// list of placements or an error value. Never throws: an unrecognised form is reported, not
// crashed on, since this runs against live server data a future teammate hasn't audited yet.
//
// BYOND screen_loc grammar (from code/_onclick/hud/_defines.dm's header comment, plus every form
// actually found in tg's 2017 source -- see extract-screen-locs.ts and its output,
// tests/draw/screen-locs.json):
//
//   "X,Y"                    plain 1-based tile coords, (1,1) = bottom-left of the view
//   "X:PX,Y:PY"              tile coords plus a pixel offset (can be negative, or "" for 0)
//   "NORTH/SOUTH/EAST/WEST"  the view's respective edge row/column
//   "CENTER"                 the view's middle row/column
//   "KEYWORD+N" / "KEYWORD-N"  offset N tiles from that edge/center (also plain "N"/"-N" alone)
//   "A to B"                 two coordinates: the atom is tiled across every tile in that
//                            rectangle (inclusive), e.g. "WEST,SOUTH to EAST,NORTH" fills the
//                            screen
//   "A,B,C,D,..."            (BYOND spec) a flat list of coordinate pairs: the same atom is
//                            placed at each pair independently (not seen in tg 2017 source, but
//                            documented BYOND behaviour, so it's supported here)
//   "mapname:X,Y"            an optional map-name prefix selecting a secondary map (client.screen
//                            can target more than one map via the skin's <map> elements); not used
//                            anywhere in this tg snapshot, best-effort support only
//
// X and Y are independent: either can be a keyword or a number, each optionally offset and/or
// given a pixel suffix. Whitespace is inconsistent in tg's own source (e.g.
// `"SOUTH: 6, CENTER+2:24"`, `"CENTER-1  :16,SOUTH:5"`) and is stripped before parsing.

export interface Coord {
	/** 1-based tile index from the bottom-left of the view, after resolving keywords/offsets. */
	tile: number;
	/** Pixel offset added on top of the tile position (can be negative; 0 if omitted). */
	pixel: number;
}

export interface ScreenLocPlacement {
	x: Coord;
	y: Coord;
	/** Present only for an "A to B" range: the atom tiles from (x,y) to (toX,toY) inclusive. */
	toX?: Coord;
	toY?: Coord;
}

export interface ScreenLocResult {
	ok: true;
	/** The optional "mapname:" prefix, if present. */
	mapName?: string;
	placements: ScreenLocPlacement[];
}

export interface ScreenLocError {
	ok: false;
	error: string;
	input: string;
}

const KEYWORDS = ["NORTH", "SOUTH", "EAST", "WEST", "CENTER"] as const;
type Keyword = (typeof KEYWORDS)[number];

// A single axis token: KEYWORD, KEYWORD+N, KEYWORD-N, N, or -N (spaces already stripped).
const TOKEN_RE = /^(NORTH|SOUTH|EAST|WEST|CENTER)([+-]-?\d+)?$|^([+-]?\d+)$/i;

// Does `s` look like a valid bare axis token (no pixel suffix)? Used to tell a map-name prefix
// (which is *not* a valid token) apart from a real coordinate's first axis.
function looksLikeToken(s: string): boolean {
	return TOKEN_RE.test(s);
}

function resolveKeywordBase(keyword: string, viewSize: number): number {
	const kw = keyword.toUpperCase() as Keyword;
	switch (kw) {
		case "WEST":
		case "SOUTH":
			return 1;
		case "EAST":
		case "NORTH":
			return viewSize;
		case "CENTER":
			// BYOND: for a 15-wide view, CENTER is tile 8 (the exact middle of an odd-sized view).
			return Math.ceil((viewSize + 1) / 2);
	}
	// unreachable given TOKEN_RE, kept for exhaustiveness
	return 1;
}

/** Parses one axis token (e.g. "CENTER-1", "16", "SOUTH") -> resolved tile index, or null. */
function parseAxisToken(token: string, viewSize: number): number | null {
	const m = TOKEN_RE.exec(token);
	if (!m) return null;
	if (m[3] !== undefined) {
		// plain signed integer, e.g. "16" or "-2"
		return parseInt(m[3], 10);
	}
	const base = resolveKeywordBase(m[1]!, viewSize);
	const offset = m[2] ? parseInt(m[2].replace("+-", "-"), 10) : 0; // tg's ui_hand_position writes "CENTER+-1" for the right hand
	return base + offset;
}

/** Parses one "X" or "Y" field, which is a token optionally followed by ":pixel". */
function parseCoordField(field: string, viewSize: number): Coord | null {
	const colon = field.indexOf(":");
	let tokenPart: string;
	let pixelPart: string;
	if (colon === -1) {
		tokenPart = field;
		pixelPart = "";
	} else {
		tokenPart = field.slice(0, colon);
		pixelPart = field.slice(colon + 1);
	}
	const tile = parseAxisToken(tokenPart, viewSize);
	if (tile === null) return null;
	let pixel = 0;
	if (pixelPart !== "") {
		if (!/^[+-]?\d+$/.test(pixelPart)) return null;
		pixel = parseInt(pixelPart, 10);
	}
	return { tile, pixel };
}

// BYOND lets NORTH/SOUTH/EAST/WEST self-identify which physical axis they belong to, so a pair's
// field *order* is not authoritative when a direction keyword is present: "SOUTH:6,WEST" (tg's
// ui_ai_core) means x=WEST, y=SOUTH:6, even though SOUTH (a Y-axis keyword) is written first.
// Per BYOND's own screen_loc docs: "the order of coordinates is arbitrary when using directions,
// so one may specify y before x as in NORTH,WEST". CENTER and plain numbers don't identify an
// axis, so they fall back to position.
type AxisTag = "x" | "y" | null;
function axisTagOf(field: string): AxisTag {
	const m = /^(NORTH|SOUTH|EAST|WEST)/i.exec(field);
	if (!m) return null;
	const kw = m[1]!.toUpperCase();
	return kw === "EAST" || kw === "WEST" ? "x" : "y";
}

/** Resolves which of two raw fields is X and which is Y, honouring direction self-identification. */
function resolveAxes(fieldA: string, fieldB: string): { xRaw: string; yRaw: string } {
	const tagA = axisTagOf(fieldA);
	const tagB = axisTagOf(fieldB);
	// fieldA claims Y, or fieldB claims X: the pair was written Y-then-X, so swap. (A field with no
	// direction keyword, e.g. a plain number or CENTER, never claims an axis and always yields to
	// whichever field does; if neither claims one, position stands: fieldA=X, fieldB=Y.)
	if (tagA === "y" || tagB === "x") {
		return { xRaw: fieldB, yRaw: fieldA };
	}
	return { xRaw: fieldA, yRaw: fieldB };
}

/**
 * Parses a BYOND screen_loc string against a view of `viewW` x `viewH` tiles (tg 2017:
 * world.view=7 -> a 15x15 client.view; NORTH/SOUTH use viewH, EAST/WEST use viewW).
 * Never throws -- returns a ScreenLocError on anything it doesn't recognise.
 */
export function parseScreenLoc(raw: string, viewW: number, viewH: number): ScreenLocResult | ScreenLocError {
	const input = raw;
	if (raw === "") {
		// tg uses "" to mean "hidden"/no on-screen position (e.g. fullscreen.dm's ui_alert clear,
		// alert.dm's `screen_loc = ""`). Not an error, but not a placement either.
		return { ok: true, placements: [] };
	}

	// Strip all whitespace -- tg's own source has inconsistent spacing around ':'/','/'+'/'-'
	// (e.g. "SOUTH: 6, CENTER+2:24", "CENTER-1  :16,SOUTH:5") and none of NORTH/SOUTH/EAST/WEST/
	// CENTER/"to"/digits contain meaningful whitespace of their own.
	let s = raw.replace(/\s+/g, "");
	if (s === "") return { ok: true, placements: [] };

	// Optional "mapname:" prefix: only if the text before the first ':' is not itself a valid bare
	// axis token (a real axis token's own ':' is a pixel-offset separator, not a map prefix).
	let mapName: string | undefined;
	const firstColon = s.indexOf(":");
	if (firstColon !== -1) {
		const before = s.slice(0, firstColon);
		if (before !== "" && !before.includes(",") && !looksLikeToken(before)) {
			mapName = before;
			s = s.slice(firstColon + 1);
		}
	}
	if (s === "") return { ok: false, error: "empty after map-name prefix", input };

	// "A to B" range form.
	const toIdx = s.search(/to/i);
	if (toIdx !== -1) {
		const left = s.slice(0, toIdx);
		const right = s.slice(toIdx + 2);
		// Each side's X uses viewW (EAST/WEST) and Y uses viewH (NORTH/SOUTH/CENTER).
		const fromPair = parseXY(left, viewW, viewH);
		const toPair = parseXY(right, viewW, viewH);
		if (!fromPair || !toPair) {
			return { ok: false, error: `unrecognised range form: "${raw}"`, input };
		}
		return {
			ok: true,
			mapName,
			placements: [{ x: fromPair.x, y: fromPair.y, toX: toPair.x, toY: toPair.y }],
		};
	}

	// A single field with no comma, e.g. "CENTER": BYOND's documented shorthand for centering the
	// object on both axes at once (screen_loc var docs: "CENTER... alone to completely center the
	// object"). Applies the one token to both X and Y, each resolved against its own axis size.
	const fields = s.split(",");
	if (fields.length === 1) {
		const x = parseCoordField(fields[0]!, viewW);
		const y = parseCoordField(fields[0]!, viewH);
		if (x === null || y === null) {
			return { ok: false, error: `unrecognised single-axis form: "${raw}"`, input };
		}
		return { ok: true, mapName, placements: [{ x, y }] };
	}

	// Flat list of coordinate pairs: "x1,y1,x2,y2,...". A plain "X,Y" is just the n=1 case.
	if (fields.length % 2 !== 0) {
		return { ok: false, error: `unrecognised form (odd field count): "${raw}"`, input };
	}
	const placements: ScreenLocPlacement[] = [];
	for (let i = 0; i < fields.length; i += 2) {
		const { xRaw, yRaw } = resolveAxes(fields[i]!, fields[i + 1]!);
		const x = parseCoordField(xRaw, viewW);
		const y = parseCoordField(yRaw, viewH);
		if (x === null || y === null) {
			return { ok: false, error: `unrecognised coordinate: "${fields[i]},${fields[i + 1]}"`, input };
		}
		placements.push({ x, y });
	}
	return { ok: true, mapName, placements };
}

/** Parses one "X,Y" side of a range, with X sized against viewW and Y against viewH. */
function parseXY(s: string, viewW: number, viewH: number): { x: Coord; y: Coord } | null {
	const parts = s.split(",");
	if (parts.length !== 2) return null;
	const { xRaw, yRaw } = resolveAxes(parts[0]!, parts[1]!);
	const x = parseCoordField(xRaw, viewW);
	const y = parseCoordField(yRaw, viewH);
	if (x === null || y === null) return null;
	return { x, y };
}

export function isScreenLocError(r: ScreenLocResult | ScreenLocError): r is ScreenLocError {
	return r.ok === false;
}
