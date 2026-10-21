// png - Browser-safe PNG pixel decode/encode for runtime icons (split out of dmi-node.ts).
// The zlib step is passed in: dmi-node.ts gives node:zlib's inflateSync/deflateSync; the browser
// worker inflates ahead of time with DecompressionStream (async only) and hands the result in, and
// encodes with zlibStored (uncompressed zlib blocks: sync, no library, fine for a few small icons).

import { type IconImage, dmiDescription, sheetCells } from "./icon-ops.js";

/** Every IDAT chunk of a PNG, joined: the zlib stream decodePng's `inflate` is given. */
export function pngIdat(bytes: Uint8Array): Uint8Array {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const parts: Uint8Array[] = [];
	for (let i = 8; i + 8 <= bytes.length; ) {
		const len = view.getUint32(i), kind = String.fromCharCode(...bytes.subarray(i + 4, i + 8));
		if (kind === "IDAT") parts.push(bytes.subarray(i + 8, i + 8 + len));
		else if (kind === "IEND") break;
		i += 12 + len;
	}
	return concat(parts);
}

/** Decodes a non-interlaced 8-bit RGBA or paletted (1/2/4/8-bit, with tRNS) PNG, the two kinds tg's
 *  .dmi files use. `inflate` gets pngIdat(bytes). Returns RGBA rows top to bottom, or null for anything else. */
export function decodePng(bytes: Uint8Array, inflate: (zlib: Uint8Array) => Uint8Array): { width: number; height: number; rgba: Uint8Array } | null {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let width = 0, height = 0, depth = 0, type = 0, interlace = 0;
	let palette: Uint8Array | null = null, trns: Uint8Array | null = null;
	for (let i = 8; i + 8 <= bytes.length; ) {
		const len = view.getUint32(i), kind = String.fromCharCode(...bytes.subarray(i + 4, i + 8)), body = bytes.subarray(i + 8, i + 8 + len);
		if (kind === "IHDR") [width, height, depth, type, interlace] = [view.getUint32(i + 8), view.getUint32(i + 12), body[8], body[9], body[12]];
		else if (kind === "PLTE") palette = body;
		else if (kind === "tRNS") trns = body;
		else if (kind === "IEND") break;
		i += 12 + len;
	}
	if (interlace || !(type === 6 && depth === 8) && !(type === 3 && palette)) return null;
	const raw = inflate(pngIdat(bytes));
	const bpp = type === 6 ? 4 : 1; // bytes per pixel for filtering (at least 1)
	const stride = type === 6 ? width * 4 : Math.ceil((width * depth) / 8);
	const line = new Uint8Array(height * stride);
	for (let y = 0, p = 0; y < height; y++) {
		const f = raw[p++], row = y * stride, prev = row - stride;
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? line[row + x - bpp] : 0, b = y ? line[prev + x] : 0, c = x >= bpp && y ? line[prev + x - bpp] : 0;
			let v = raw[p++];
			if (f === 1) v += a;
			else if (f === 2) v += b;
			else if (f === 3) v += (a + b) >> 1;
			else if (f === 4) {
				const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
				v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
			}
			line[row + x] = v;
		}
	}
	if (type === 6) return { width, height, rgba: line };
	const rgba = new Uint8Array(width * height * 4);
	for (let y = 0; y < height; y++)
		for (let x = 0; x < width; x++) {
			const bit = x * depth, idx = (line[y * stride + (bit >> 3)] >> (8 - depth - (bit & 7))) & ((1 << depth) - 1), o = (y * width + x) * 4;
			rgba.set(palette!.subarray(idx * 3, idx * 3 + 3), o);
			rgba[o + 3] = trns && idx < trns.length ? trns[idx] : 255;
		}
	return { width, height, rgba };
}

function concat(parts: Uint8Array[]): Uint8Array {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let o = 0;
	for (const p of parts) out.set(p, (o += p.length) - p.length);
	return out;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
	let c = n;
	for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c >>> 0;
});
function crc32(b: Uint8Array): number {
	let c = 0xffffffff;
	for (const x of b) c = CRC_TABLE[(c ^ x) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}
const u32 = (n: number) => new Uint8Array([n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
const latin1 = (s: string) => Uint8Array.from(s, (ch) => ch.charCodeAt(0));

/** A zlib stream of stored (uncompressed) blocks: valid input to any inflater, no compression. */
export function zlibStored(data: Uint8Array): Uint8Array {
	const parts: Uint8Array[] = [new Uint8Array([0x78, 0x01])];
	for (let i = 0; i === 0 || i < data.length; i += 65535) {
		const n = Math.min(65535, data.length - i);
		parts.push(new Uint8Array([i + n >= data.length ? 1 : 0, n & 255, n >> 8, ~n & 255, (~n >> 8) & 255]), data.subarray(i, i + n));
	}
	let a = 1, b = 0;
	for (const x of data) { a = (a + x) % 65521; b = (b + a) % 65521; }
	parts.push(u32(((b << 16) | a) >>> 0));
	return concat(parts);
}

function pngChunk(kind: string, body: Uint8Array): Uint8Array {
	const kb = concat([latin1(kind), body]);
	return concat([u32(body.length), kb, u32(crc32(kb))]);
}

/** A runtime icon as a real .dmi file: every cell in one row, 8-bit RGBA, with its Description. */
export function encodeDmi(icon: IconImage, deflate: (data: Uint8Array) => Uint8Array = zlibStored): Uint8Array {
	const cells = sheetCells(icon), { width: w, height: h } = icon, sheetW = Math.max(1, cells.length) * w;
	const raw = new Uint8Array(h * (1 + sheetW * 4));
	for (let y = 0; y < h; y++)
		cells.forEach((c, i) => raw.set(c.subarray(y * w * 4, (y + 1) * w * 4), y * (1 + sheetW * 4) + 1 + i * w * 4));
	const ihdr = concat([u32(sheetW), u32(h), new Uint8Array([8, 6, 0, 0, 0])]);
	const ztxt = concat([latin1("Description\0\0"), deflate(latin1(dmiDescription(icon)))]);
	return concat([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngChunk("IHDR", ihdr), pngChunk("zTXt", ztxt), pngChunk("IDAT", deflate(raw)), pngChunk("IEND", new Uint8Array())]);
}

/** One frame as a plain 8-bit RGBA PNG (what a browser <img> shows for a browse_rsc'd icon). */
export function encodePng(width: number, height: number, rgba: Uint8Array | Uint8ClampedArray, deflate: (data: Uint8Array) => Uint8Array = zlibStored): Uint8Array {
	const raw = new Uint8Array(height * (1 + width * 4));
	for (let y = 0; y < height; y++) raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * (1 + width * 4) + 1);
	const ihdr = concat([u32(width), u32(height), new Uint8Array([8, 6, 0, 0, 0])]);
	return concat([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pngChunk("IHDR", ihdr), pngChunk("IDAT", deflate(raw)), pngChunk("IEND", new Uint8Array())]);
}
