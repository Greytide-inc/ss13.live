// dirty-scene (pd-dirty): the live view keeps each tile's draw items and rebuilds only dirty tiles. Random update sequences (appearance changes, tile
// lists changing, ids leaving, an area id on every tile, glides, animate() steps, z changes, a full resync) against a model; after every rebuild
// check() (kept items vs items built fresh for the same moment, appearances vs the model's snapshot) must report nothing.
import assert from "node:assert";
const ctx = new Proxy({}, { get: () => () => {}, set: () => true });
(globalThis as Record<string, unknown>).document = { createElement: () => ({ width: 0, height: 0, className: "", style: {}, getContext: () => ctx }), getElementById: (id: string) => (id === "status" ? { textContent: "" } : null), head: { append() {} } };
(globalThis as Record<string, unknown>).window = globalThis;
(globalThis as Record<string, unknown>).location = { search: "?renderer=canvas" };
let frame: ((t: number) => void) | null = null;
(globalThis as Record<string, unknown>).requestAnimationFrame = (f: (t: number) => void) => { frame = f; return 1; };
const { liveClientView, viewStats, tileOrder } = await import("../../src/render/client-scene.js");

const app = (o: Record<string, unknown> = {}) => ({ icon: null, iconState: "s", dir: 2, alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], mouseOpacity: 1, invisibility: 0, ...o }) as never as any;
const step = () => { const f = frame; frame = null; assert(f, "no frame requested"); f(performance.now()); };
let seed = 12345;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };

let resyncs = 0;
const host = { innerHTML: "", appendChild() {}, style: { setProperty() {} }, dispatchEvent() {}, querySelector: () => null } as never as HTMLElement;
const v = liveClientView(host, () => { resyncs++; });

const AREA = 9999;
let eye = { x: 100, y: 50, z: 2 };
const model = { apps: new Map<number, any>(), tiles: new Map<number, number[]>() };
let seq = 0, nextId = 1;
const key = (x: number, y: number) => x + y * 65536;
const base = (full: boolean) => ({ seq: ++seq, full, worldTime: seq, key: "k", view: 7, eyeTile: { ...eye }, sight: null, apps: [] as [number, any][], gone: [] as number[], tiles: [] as [number, number, number[]][], moved: [] as any[], screen: null as any, anims: [] as any[] });
const setApp = (u: ReturnType<typeof base>, id: number, o: Record<string, unknown> = {}) => { const a = app({ plane: rnd(3), layer: 1 + rnd(5), iconState: `s${rnd(1000)}`, ...o }); model.apps.set(id, a); u.apps.push([id, a]); };
function fullUpdate(): ReturnType<typeof base> {
	const u = base(true);
	model.apps.clear(); model.tiles.clear();
	setApp(u, AREA);
	for (let dy = -8; dy <= 8; dy++) for (let dx = -8; dx <= 8; dx++) {
		const ids = [AREA];
		for (let i = 0; i < 1 + rnd(3); i++) { const id = nextId++; setApp(u, id); ids.push(id); }
		model.tiles.set(key(eye.x + dx, eye.y + dy), ids);
		u.tiles.push([eye.x + dx, eye.y + dy, ids]);
	}
	return u;
}
const dump = () => ({ builtAt: "", worldTime: seq, clients: [{ key: "k", ckey: "k", view: 7, eyeTile: { ...eye }, screen: [], viewTiles: [...model.tiles].map(([k, ids]) => ({ x: k % 65536, y: Math.floor(k / 65536), appearances: ids.map((id) => model.apps.get(id)).sort((p, q) => p.plane - q.plane || p.layer - q.layer) })) }] }) as never;
const send = (u: ReturnType<typeof base>) => { v.update(u as never); step(); };
const verify = (what: string) => { const d = v.check(dump()); assert.deepStrictEqual(d, [], `${what}: ${d.join("; ")}`); };

send(fullUpdate());
verify("full");
let rebuilt0 = viewStats.rbTiles;
for (let i = 0; i < 400; i++) {
	const u = base(false);
	const ids = [...model.apps.keys()].filter((id) => id !== AREA);
	const op = rnd(8);
	if (op <= 1) setApp(u, ids[rnd(ids.length)]); // one object's look changes
	else if (op === 2) setApp(u, AREA); // an area-wide change: every tile
	else if (op === 3) { // a tile's list changes: an object steps onto it
		const id = ids[rnd(ids.length)], tx = eye.x + rnd(17) - 8, ty = eye.y + rnd(17) - 8, k = key(tx, ty);
		for (const [k0, l] of model.tiles) if (l.includes(id)) { const nl = l.filter((x) => x !== id); model.tiles.set(k0, nl); u.tiles.push([k0 % 65536, Math.floor(k0 / 65536), nl]); }
		const nl = [...model.tiles.get(k)!, id]; model.tiles.set(k, nl); u.tiles.push([tx, ty, nl]);
		u.moved.push([id, tx - 1, ty, tx, ty, 8, 1]);
	} else if (op === 4) { // an object leaves
		const id = ids[rnd(ids.length)];
		for (const [k0, l] of model.tiles) if (l.includes(id)) { const nl = l.filter((x) => x !== id); model.tiles.set(k0, nl); u.tiles.push([k0 % 65536, Math.floor(k0 / 65536), nl]); }
		model.apps.delete(id); u.gone.push(id);
	} else if (op === 5) { // a new object, and a look change on the same update
		const id = nextId++, k = key(eye.x + rnd(17) - 8, eye.y + rnd(17) - 8);
		setApp(u, id); const nl = [...model.tiles.get(k)!, id]; model.tiles.set(k, nl); u.tiles.push([k % 65536, Math.floor(k / 65536), nl]);
	} else if (op === 6) { // animate(): alpha steps on one object
		const id = ids[rnd(ids.length)];
		u.anims.push(["a", id, 1, 3, 0, 0, 0, [["alpha", 255, 100]]]);
	} // op 7: nothing changes
	send(u);
	if (op === 6) { for (let f = 0; f < 3; f++) step(); }
	verify(`step ${i} op ${op}`);
	if (i === 150) { seq++; v.update(base(false) as never); /* a skipped seq: the page asks for a full one */ step(); assert.strictEqual(resyncs, 1); send(fullUpdate()); verify("resync"); }
	if (i === 250) { eye = { ...eye, z: 3 }; send(fullUpdate()); verify("z change"); }
}
assert(viewStats.rbTiles - rebuilt0 < 400 * 17 * 17 / 4, `rebuilt ${viewStats.rbTiles - rebuilt0} tiles in 400 updates: not only the dirty ones`);

// tie order: south to north, then west to east
const ts = [{ x: 3, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 2 }, { x: 1, y: 2 }].sort(tileOrder).map((t) => `${t.x},${t.y}`);
assert.deepStrictEqual(ts, ["1,2", "2,2", "3,2", "1,3"]);
console.log(`dirty-scene: ok (${viewStats.rbTiles - rebuilt0} tiles rebuilt in 400 updates over a ${17 * 17}-tile view)`);
