// chunk-index - the kept scene cut into chunks of 16x16 tiles (512x512 map pixels), one list of draw items per chunk and plane. page-draw step 4.
// An item is in every chunk its box touches (spill), so a chunk's list is everything that can show in it. A changed tile bumps the `version` of every
// chunk-plane it was in and is in now; the Pixi backend redraws a chunk-plane when its version moved, and hit tests read the items of the chunk
// under the pointer. Pure (no Pixi, no DOM): tests/draw/chunk-index.test.ts.
//
// Map pixels: x = tile x * 32, y = -tile y * 32 (the tile's top edge, y down). Chunk column = floor(x / 512); chunk row r covers y in
// [512 r - 480, 512 r + 32): a tile row's top edge -32 ty, so tile rows 16c .. 16c+15 share row -c.

import type { DrawItem } from "./client-scene.js";
import type { Box } from "./item-box.js";

export const CHUNK_PX = 512;
const ROW_SHIFT = 480;
export const chunkCol = (x: number): number => Math.floor(x / CHUNK_PX);
export const chunkRow = (y: number): number => Math.floor((y + ROW_SHIFT) / CHUNK_PX);
export const chunkId = (col: number, row: number): number => col + 1024 + (row + 1024) * 2048;
/** The map-pixel rectangle of a chunk (x1/y1 exclusive). */
export const chunkRect = (col: number, row: number): { x0: number; y0: number; x1: number; y1: number } => ({ x0: col * CHUNK_PX, y0: row * CHUNK_PX - ROW_SHIFT, x1: (col + 1) * CHUNK_PX, y1: (row + 1) * CHUNK_PX - ROW_SHIFT });

/** One plane's items in one chunk. `version` changes whenever the items (or their order) may have changed. */
export interface ChunkPlane {
	chunk: number; col: number; row: number; plane: number;
	tiles: Map<number, DrawItem[]>; // tile key -> that tile's items on this plane that touch this chunk, in the tile's own order
	version: number;
	list: DrawItem[] | null; // cache of items(): draw order
	minLayer: number; maxLayer: number;
}

function sameItems(a: DrawItem[], b: DrawItem[]): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		const p = a[i], q = b[i];
		if (p.appearance !== q.appearance || p.originX !== q.originX || p.originY !== q.originY || p.id !== q.id || p.layer !== q.layer) return false;
	}
	return true;
}

export class ChunkIndex {
	readonly cps = new Map<number, ChunkPlane>(); // chunk * 8192 + plane + 4096 -> chunk-plane
	readonly chunks = new Map<number, ChunkPlane[]>(); // chunk id -> its chunk-planes
	readonly planeItems = new Map<number, number>(); // plane -> items on it (map items only)
	private tileCps = new Map<number, ChunkPlane[]>();
	private tileItems = new Map<number, DrawItem[]>();
	/** Bumped when a chunk-plane appears or goes. */
	shape = 0;
	constructor(private boxOf: (it: DrawItem) => Box) {}

	clear(): void {
		this.cps.clear(); this.chunks.clear(); this.planeItems.clear(); this.tileCps.clear(); this.tileItems.clear(); this.shape++;
	}

	private touch(cp: ChunkPlane): void { cp.version++; cp.list = null; }

	/** Replace tile `key`'s items (null: the tile is gone). Chunk-planes whose list for this tile changed get a new version. */
	setTile(key: number, items: DrawItem[] | null): void {
		const oldItems = this.tileItems.get(key);
		if (oldItems) for (const it of oldItems) { const n = (this.planeItems.get(it.plane) ?? 0) - 1; if (n > 0) this.planeItems.set(it.plane, n); else this.planeItems.delete(it.plane); }
		if (items?.length) {
			this.tileItems.set(key, items);
			for (const it of items) this.planeItems.set(it.plane, (this.planeItems.get(it.plane) ?? 0) + 1);
		} else this.tileItems.delete(key);
		const next = new Map<ChunkPlane, DrawItem[]>();
		if (items) for (const it of items) {
			const b = this.boxOf(it);
			const c0 = chunkCol(it.originX + b.x0), c1 = chunkCol(Math.ceil(it.originX + b.x1) - 1), r0 = chunkRow(it.originY + b.y0), r1 = chunkRow(Math.ceil(it.originY + b.y1) - 1);
			for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
				const cp = this.cp(c, r, it.plane);
				const arr = next.get(cp);
				if (arr) arr.push(it); else next.set(cp, [it]);
			}
		}
		for (const [cp, arr] of next) {
			const prev = cp.tiles.get(key);
			if (!prev || !sameItems(prev, arr)) this.touch(cp);
			cp.tiles.set(key, arr);
		}
		const old = this.tileCps.get(key);
		if (old) for (const cp of old) if (!next.has(cp)) { cp.tiles.delete(key); this.touch(cp); if (!cp.tiles.size) this.remove(cp); }
		if (next.size) this.tileCps.set(key, [...next.keys()]); else this.tileCps.delete(key);
	}

	private cp(col: number, row: number, plane: number): ChunkPlane {
		const chunk = chunkId(col, row), id = chunk * 8192 + plane + 4096;
		let cp = this.cps.get(id);
		if (!cp) {
			cp = { chunk, col, row, plane, tiles: new Map(), version: 0, list: null, minLayer: 0, maxLayer: 0 };
			this.cps.set(id, cp);
			const l = this.chunks.get(chunk);
			if (l) l.push(cp); else this.chunks.set(chunk, [cp]);
			this.shape++;
		}
		return cp;
	}
	private remove(cp: ChunkPlane): void {
		this.cps.delete(cp.chunk * 8192 + cp.plane + 4096);
		const l = this.chunks.get(cp.chunk)!;
		l.splice(l.indexOf(cp), 1);
		if (!l.length) this.chunks.delete(cp.chunk);
		this.shape++;
	}

	/** The chunk-plane's items in draw order: by layer, ties by tile (south to north, west to east) then the tile's own order. */
	items(cp: ChunkPlane): DrawItem[] {
		if (cp.list) return cp.list;
		const keys = [...cp.tiles.keys()].sort((a, b) => a - b);
		const out: DrawItem[] = [];
		for (const k of keys) for (const it of cp.tiles.get(k)!) out.push(it);
		out.sort((a, b) => a.layer - b.layer); // stable
		cp.minLayer = out.length ? out[0].layer : 0; cp.maxLayer = out.length ? out[out.length - 1].layer : 0;
		return (cp.list = out);
	}

	/** Every map item that can show in chunk (col, row), all planes (hit tests: the caller orders by plane and layer; ties keep this order). */
	chunkItems(col: number, row: number): DrawItem[] {
		const out: DrawItem[] = [];
		for (const cp of this.chunks.get(chunkId(col, row)) ?? []) for (const it of this.items(cp)) out.push(it);
		return out;
	}
}
