// view-merge.test - Random update chains: applying the merged update gives the same appearances, tiles, screen and offset as applying them one by one.
import assert from "node:assert/strict";
import { mergeViews, ViewQueue, GUESS_RTT, QUEUE_MS } from "../tools/view-merge.mjs";

let seed = 7;
const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
// the parts of client-scene.ts update() that hold state (the drawing and glides aside)
function apply(s, u) {
	if (u.full) { s.apps.clear(); s.tiles.clear(); s.screen = []; s.off = [0, 0]; }
	for (const id of u.gone) s.apps.delete(id);
	if (u.off) s.off = u.off;
	for (const [id, a] of u.apps) s.apps.set(id, a);
	for (const [x, y, ids] of u.tiles) s.tiles.set(x + "," + y, ids);
	if (u.screen) s.screen = u.screen;
	if (u.hud) s.hud = u.hud;
	if (u.light !== undefined || u.full) s.light = u.light ?? null; // a full update without one: none (client-scene.ts)
	if (u.opq !== undefined || u.full) s.opq = u.opq ?? null;
	if (u.lum !== undefined || u.full) s.lum = u.lum ?? null;
	s.eye = u.eyeTile;
}
const fresh = () => ({ apps: new Map(), tiles: new Map(), screen: [], off: [0, 0], eye: null, hud: null, light: null, opq: null, lum: null });
const dump = (s) => JSON.stringify([[...s.apps].sort((a, b) => a[0] - b[0]), [...s.tiles].sort(), s.screen, s.off, s.eye, s.hud, s.light, s.opq, s.lum]);
function randomUpdate(i) {
	const u = { seq: i, full: rnd(15) === 0, worldTime: i, eyeTile: { x: rnd(4), y: 0, z: 1 }, apps: [], gone: [], tiles: [], moved: [], screen: rnd(5) === 0 ? [[rnd(9), "s", "1,1"]] : null };
	for (let k = rnd(4); k > 0; k--) u.apps.push([rnd(12), { look: rnd(100) }]);
	for (let k = rnd(3); k > 0; k--) { const id = rnd(12); if (!u.apps.some((a) => a[0] === id)) u.gone.push(id); }
	for (let k = rnd(4); k > 0; k--) u.tiles.push([rnd(5), rnd(5), [rnd(12), rnd(12)]]);
	for (let k = rnd(3); k > 0; k--) u.moved.push([rnd(12), 0, 0, 1, 0, 4, 1]);
	if (rnd(4) === 0) u.off = [rnd(8), rnd(8)];
	if (rnd(1000) < 300) u.light = rnd(1000) < 500 ? [] : [5, rnd(1000) < 500 ? 1 : 0, 0, 1, 1, 0.5, 0.5, 0.5];
	if (rnd(1000) < 300) u.opq = rnd(1000) < 500 ? [] : [rnd(9), 1, 2, 2, "P"];
	if (rnd(1000) < 300) u.lum = rnd(1000) < 500 ? [] : ["A", rnd(4), 1 + rnd(3)];
	if (rnd(4) === 0) u.hud = { ia: ["help", "harm"].slice(0, 1 + rnd(2)), iq: rnd(2) };
	if (rnd(3) === 0) u.anims = [["f", rnd(12), "x"]];
	return u;
}
for (let run = 0; run < 2000; run++) {
	const before = fresh(); apply(before, { ...randomUpdate(0), full: true });
	const one = structuredClone(before), merged = structuredClone(before);
	const chain = Array.from({ length: 2 + rnd(6) }, (_, i) => randomUpdate(i + 1));
	for (const u of chain) apply(one, u);
	const m = chain.reduce((acc, u) => mergeViews(acc, u));
	apply(merged, m);
	assert.equal(dump(merged), dump(one), `run ${run}`);
	const lastFull = chain.map((u) => u.full).lastIndexOf(true);
	assert.equal(m.merged ?? 1, lastFull < 0 ? chain.length : chain.length - lastFull, `ticks, run ${run}`);
	for (const g of m.gone) assert.ok(!m.apps.some((a) => a[0] === g), `gone id also in apps, run ${run}`);
}
// ViewQueue on a fake clock: a client that doesn't ack gets every view; an acking one gets held views merged once the queue clears.
{
	let t = 0; const got = [], v = (i) => ({ ...randomUpdate(i), full: false });
	const quiet = new ViewQueue((u) => got.push(u));
	for (let i = 1; i <= 10; i++) { t += 50; quiet.push(v(i)); }
	assert.deepEqual(got.map((u) => u.seq), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	got.length = 0;
	const q = new ViewQueue((u) => got.push(u), true, () => t);
	q.push(v(1)); t += 40; q.ack(1); // a 40 ms round trip
	for (let i = 2; i <= 20; i++) { t += 50; q.push(v(i)); } // then no acks: a stall
	const sentBeforeHold = Math.floor((40 + QUEUE_MS) / 50) + 1;
	assert.equal(got.length, 1 + sentBeforeHold, "held once the oldest unacked view is older than the round trip + QUEUE_MS");
	q.ack(got.at(-1).seq);
	assert.equal(got.length, 2 + sentBeforeHold, "the ack that clears the queue sends the held views as one");
	assert.equal(got.at(-1).merged, 19 - sentBeforeHold);
	assert.equal(got.at(-1).seq, got.at(-2).seq + 1);
	assert.ok(GUESS_RTT > 0);
}
// a full view's icon preload list survives being merged with later views
{
	const a = { ...randomUpdate(1), full: true, icons: ["icons/turf/floors.dmi"] }, b = { ...randomUpdate(2), full: false };
	assert.deepEqual(mergeViews(a, b).icons, ["icons/turf/floors.dmi"]);
}
console.log("view-merge: 2000 chains, merged == one by one; ViewQueue holds and merges");
