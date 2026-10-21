// dmi-browser - Browser loader for the full DMI parser (src/dmi/dmi.ts): given the raw bytes of a
// .dmi file (e.g. from fetch().arrayBuffer()), inflates its zTXt Description with the standard
// DecompressionStream API. That API is stream-based and async only (no browser equivalent of
// node:zlib's inflateSync), so this loader -- unlike dmi-node.ts -- is async. Used by the sprite
// gallery (gallery/gallery.ts).

import { type Dmi, parseDescription, readPngChunks } from "./dmi.js";

async function inflate(bytes: Uint8Array): Promise<string> {
	const ds = new DecompressionStream("deflate"); // zTXt's compression method 0 = zlib (RFC1950),
	// which is what the "deflate" format string means in the Compression Streams API (distinct from
	// "deflate-raw"). Matches node:zlib.inflateSync's default (also zlib-format) used in dmi-node.ts.
	const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(ds);
	const buf = await new Response(stream).arrayBuffer();
	return new TextDecoder("latin1").decode(buf);
}

/** Parses a .dmi (or plain PNG) already read into memory. Returns null if it isn't a readable PNG. */
export async function parseDmiBytes(bytes: Uint8Array): Promise<Dmi | null> {
	const png = readPngChunks(bytes);
	if (!png) return null;
	let desc: string | null = null;
	if (png.compressedDescription) {
		try {
			desc = await inflate(png.compressedDescription);
		} catch {
			desc = null;
		}
	}
	const dmi = parseDescription(desc, png.width, png.height);
	if (dmi) return dmi;
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

/** Fetches and parses a .dmi file by URL. */
export async function parseDmiUrl(url: string): Promise<Dmi | null> {
	const res = await fetch(url);
	if (!res.ok) return null;
	const bytes = new Uint8Array(await res.arrayBuffer());
	return parseDmiBytes(bytes);
}
