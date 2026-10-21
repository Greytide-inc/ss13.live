// dmi-node - Node loader for the full DMI parser (src/dmi/dmi.ts): reads a .dmi file from disk and
// inflates its zTXt Description with node:zlib, which has a synchronous inflate unlike the
// browser's DecompressionStream (see dmi-browser.ts for that side).

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";
import { type Dmi, type DmiState, parseDescription, readPngChunks } from "./dmi.js";
import { type IconImage, iconFromSheet } from "./icon-ops.js";
import { decodePng as decodePngWith, encodeDmi as encodeDmiWith } from "./png.js";

/** Parses a .dmi (or plain PNG) already read into memory. Returns null if it isn't a readable PNG. */
export function parseDmiBytes(bytes: Uint8Array): Dmi | null {
	const png = readPngChunks(bytes);
	if (!png) return null;
	let desc: string | null = null;
	if (png.compressedDescription) {
		try {
			desc = inflateSync(Buffer.from(png.compressedDescription)).toString("latin1");
		} catch {
			desc = null;
		}
	}
	const dmi = parseDescription(desc, png.width, png.height);
	if (dmi) return dmi;
	// plain PNG (or unreadable description): one full-image state, matching dmi-size.ts's fallback
	return {
		width: png.width,
		height: png.height,
		imageWidth: png.width,
		imageHeight: png.height,
		columns: 1,
		rows: 1,
		states: [
			{
				name: "",
				dirs: 1,
				frames: 1,
				delay: [],
				loop: 0,
				rewind: false,
				movement: false,
				hotspot: null,
				cells: [[0]],
			},
		],
	};
}

/** Parses a .dmi file at the given path. */
export function parseDmiFile(path: string): Dmi | null {
	return parseDmiBytes(readFileSync(path));
}

// ---- Pixels: PNG decode/encode for runtime icons (src/dmi/icon-ops.ts).

/** decodePng (png.ts) with node:zlib's inflate. */
export function decodePng(bytes: Uint8Array): { width: number; height: number; rgba: Uint8Array } | null {
	return decodePngWith(bytes, (z) => inflateSync(z));
}

/** A runtime icon as a real .dmi file (png.ts's encodeDmi, compressed with node:zlib). */
export function encodeDmi(icon: IconImage): Buffer {
	return Buffer.from(encodeDmiWith(icon, (d) => deflateSync(d)));
}

/** Loads a whole .dmi as a runtime icon, looking the path up under each base dir; cached per path. */
/** A VM.iconStates hook: an icon file's states, read from its header only (no pixel decode), cached. */
export function iconStatesReader(baseDirs: string[]): (path: string) => DmiState[] | null {
	const cache = new Map<string, DmiState[] | null>();
	return (path) => {
		if (!cache.has(path)) {
			let states: DmiState[] | null = null;
			for (const dir of baseDirs) {
				const file = resolve(dir, path.replace(/\\/g, "/"));
				if (!existsSync(file)) continue;
				states = parseDmiBytes(readFileSync(file))?.states ?? null;
				break;
			}
			cache.set(path, states);
		}
		return cache.get(path)!;
	};
}

export function iconLoader(baseDirs: string[]): (path: string) => IconImage | null {
	const cache = new Map<string, IconImage | null>();
	return (path) => {
		if (!cache.has(path)) {
			let icon: IconImage | null = null;
			for (const dir of baseDirs) {
				const file = resolve(dir, path);
				if (!existsSync(file)) continue;
				const bytes = readFileSync(file), dmi = parseDmiBytes(bytes), png = decodePng(bytes);
				if (dmi && png) icon = iconFromSheet(dmi, png.rgba, png.width);
				break;
			}
			cache.set(path, icon);
		}
		return cache.get(path)!;
	};
}
