// dmi - Parses a .dmi sprite sheet's zTXt "Description" metadata into states, directions, frames
// and delays, plus the sheet layout needed to slice each frame out of the PNG.
//
// Browser-safe core: no I/O, no decompression. It only walks PNG chunks to find the image size and
// the raw (still-compressed) zTXt "Description" payload (readPngChunks), and turns an already
// -inflated Description string into a Dmi (parseDescription). Two thin loaders wrap those: dmi
// -node.ts (fs + zlib, for tests/tools) and dmi-browser.ts (fetch + DecompressionStream, for the
// gallery page). Neither of those is imported here, so this file has zero Node-only APIs.
//
// Format notes, checked against real files in icons/ (not just trusted from the spec text):
//  - `width`/`height` on the Description default to 32 when absent. A plain PNG or a .dmi with no
//    Description is one frame the size of the whole image (see dmi-size.ts, still used by the VM's
//    icon Width()/Height() hook -- that stays a separate, smaller reader; this module is for the
//    full state/frame/delay table).
//  - Every sheet cell in the whole PNG is filled left-to-right, top-to-bottom, in ONE sequence that
//    runs across all states: for each state in file order, for each frame in order, for each
//    direction in BYOND's stored order (South, North, East, West, Southeast, Southwest, Northeast,
//    Northwest) -- even when the state has only 1 dir (only South's slot is used). States do not
//    each start a new row; they just continue the sequence.
//    Verified two ways: (1) icons/mob/animal.dmi's "carp" state (dirs=4, frames=3) sits exactly at
//    the running cell count after "cow"+"cow_dead"+"cow_gib" (4+1+12=17 cells in), not at a row
//    boundary. (2) decoded actual pixels there: consecutive-frame, same-direction cells differ far
//    less (avg RGBA delta ~54k) than same-frame, consecutive-direction cells (~131k), confirming
//    frame is the outer loop and direction the inner one, not the reverse.
//  - `delay` values are deciseconds and are not always whole numbers (e.g. "0.8,0.8,..." in
//    icons/obj/machines/research.dmi's protolathe animations). Kept as floats.
//  - `movement` and `loop` are real, present-only-when-nonzero keys (grepped across icons/):
//    `movement = 1` marks a walking/move animation, `loop = N` caps replays (0 = forever, the
//    default when the key is absent).
//  - `hotspot = x,y,frame` appears on some effect states (e.g. icons/effects/*_target.dmi); frame is
//    1-based. Kept but not used by the gallery.
//  - A state name is not unique within a sheet: e.g. icons/mob/animal.dmi has two "stickman"
//    entries, a plain one and a second with movement=1 (BYOND swaps to the movement-flagged state
//    of the same name while the atom is moving). Dmi.states is kept as a plain array in file order
//    for this reason -- callers that want "the state named X" should filter/find, and pick the
//    movement-flagged one when relevant, rather than assuming names are keys.

/** BYOND's stored direction order in a DMI: South, North, East, West, SE, SW, NE, NW. */
export const DMI_DIR_ORDER = [2, 1, 4, 8, 6, 10, 5, 9] as const;

export type DmiDirCount = 1 | 4 | 8;

export interface DmiHotspot {
	x: number;
	y: number;
	frame: number;
}

export interface DmiState {
	name: string;
	dirs: DmiDirCount;
	frames: number;
	/** Deciseconds per frame, length `frames` (each 1 when a single-frame state has no delay line). */
	delay: number[];
	loop: number;
	rewind: boolean;
	movement: boolean;
	hotspot: DmiHotspot | null;
	/** cells[dirIndex][frame] = flat cell index into the sheet grid (row-major, see Dmi.columns). */
	cells: number[][];
}

export interface Dmi {
	/** Per-icon frame size (the Description's width/height, default 32x32). */
	width: number;
	height: number;
	imageWidth: number;
	imageHeight: number;
	columns: number;
	rows: number;
	states: DmiState[];
}

/** The pixel rectangle of one sheet cell, ready for canvas drawImage(sheet, x, y, w, h, ...). */
export function cellRect(dmi: Dmi, cellIndex: number): { x: number; y: number; w: number; h: number } {
	return {
		x: (cellIndex % dmi.columns) * dmi.width,
		y: Math.floor(cellIndex / dmi.columns) * dmi.height,
		w: dmi.width,
		h: dmi.height,
	};
}

/** Result of walking a PNG's chunks: its pixel size and the still-compressed zTXt Description, if any. */
export interface PngInfo {
	width: number;
	height: number;
	/** Raw zlib-compressed bytes of the "Description" zTXt chunk's text, or null if there isn't one. */
	compressedDescription: Uint8Array | null;
}

const PNG_MAGIC = 0x89504e47;

/** Walks a PNG's chunk list. Pure and sync: no decompression happens here. */
export function readPngChunks(bytes: Uint8Array): PngInfo | null {
	const buf = bytes;
	if (buf.length < 24) return null;
	const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	if (view.getUint32(0) !== PNG_MAGIC >>> 0) return null;
	let width = 0, height = 0;
	let compressedDescription: Uint8Array | null = null;
	for (let i = 8; i + 8 <= buf.length; ) {
		const len = view.getUint32(i);
		const kind = String.fromCharCode(buf[i + 4], buf[i + 5], buf[i + 6], buf[i + 7]);
		const bodyStart = i + 8;
		if (kind === "IHDR") {
			width = view.getUint32(bodyStart);
			height = view.getUint32(bodyStart + 4);
		} else if (kind === "zTXt") {
			const body = buf.subarray(bodyStart, bodyStart + len);
			const nul = body.indexOf(0);
			if (nul > 0 && bytesEqualAscii(body, 0, nul, "Description")) {
				// byte after the NUL-terminated keyword is the compression method (always 0 = zlib);
				// the rest of the chunk is the compressed text.
				compressedDescription = body.subarray(nul + 2);
			}
		} else if (kind === "IEND") {
			break;
		}
		i = bodyStart + len + 4; // + 4-byte CRC
	}
	if (!width) return null;
	return { width, height, compressedDescription };
}

function bytesEqualAscii(body: Uint8Array, start: number, end: number, s: string): boolean {
	if (end - start !== s.length) return false;
	for (let k = 0; k < s.length; k++) if (body[start + k] !== s.charCodeAt(k)) return false;
	return true;
}

/**
 * Turns an inflated Description string plus the PNG's own pixel size into a Dmi. Returns null for
 * a plain PNG (no "# BEGIN DMI" description): callers should treat that as one full-image state.
 */
export function parseDescription(desc: string | null, imageWidth: number, imageHeight: number): Dmi | null {
	if (desc === null || !desc.startsWith("# BEGIN DMI")) return null;
	const lines = desc.split("\n");
	let width = 32, height = 32;
	const states: DmiState[] = [];
	let cur: DmiState | null = null;
	let nextCell = 0;

	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line || line === "# BEGIN DMI" || line === "# END DMI") continue;
		const eq = line.indexOf("=");
		if (eq < 0) continue;
		const key = line.slice(0, eq).trim();
		const value = line.slice(eq + 1).trim();
		if (key === "version") continue;
		if (key === "width") {
			width = Number(value);
		} else if (key === "height") {
			height = Number(value);
		} else if (key === "state") {
			cur = {
				name: unquote(value),
				dirs: 1,
				frames: 1,
				delay: [],
				loop: 0,
				rewind: false,
				movement: false,
				hotspot: null,
				cells: [],
			};
			states.push(cur);
		} else if (cur) {
			if (key === "dirs") {
				const n = Number(value);
				cur.dirs = (n === 4 || n === 8 ? n : 1) as DmiDirCount;
			} else if (key === "frames") {
				cur.frames = Number(value);
			} else if (key === "delay") {
				cur.delay = value.split(",").map((v) => Number(v.trim()));
			} else if (key === "loop") {
				cur.loop = Number(value);
			} else if (key === "rewind") {
				cur.rewind = value === "1";
			} else if (key === "movement") {
				cur.movement = value === "1";
			} else if (key === "hotspot") {
				const parts = value.split(",").map((v) => Number(v.trim()));
				if (parts.length === 3) cur.hotspot = { x: parts[0], y: parts[1], frame: parts[2] };
			}
			// unrecognized keys (future DMI versions) are ignored rather than failing the parse
		}
	}

	const columns = width > 0 ? Math.floor(imageWidth / width) : 0;
	const rows = height > 0 ? Math.floor(imageHeight / height) : 0;

	for (const state of states) {
		if (state.delay.length === 0 && state.frames > 1) {
			// BYOND treats a missing delay list on a multi-frame state as 1 decisecond per frame
			state.delay = new Array(state.frames).fill(1);
		} else if (state.delay.length > state.frames) {
			// BYOND's icon editor sometimes leaves extra delays in the Description; trim to frame count
			state.delay = state.delay.slice(0, state.frames);
		}
		const dirCount = state.dirs;
		for (let d = 0; d < dirCount; d++) {
			const row: number[] = [];
			for (let f = 0; f < state.frames; f++) {
				row.push(nextCell + f * dirCount + d);
			}
			state.cells.push(row);
		}
		nextCell += state.frames * dirCount;
	}

	return { width, height, imageWidth, imageHeight, columns, rows, states };
}

function unquote(value: string): string {
	const m = /^"(.*)"$/.exec(value);
	if (!m) return value;
	return m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

/** Index into DMI_DIR_ORDER (and so into DmiState.cells) for a state with the given dir count. */
export function dirIndex(dirs: DmiDirCount, byondDir: number): number {
	const i = DMI_DIR_ORDER.indexOf(byondDir as (typeof DMI_DIR_ORDER)[number]);
	return i >= 0 && i < dirs ? i : 0;
}
