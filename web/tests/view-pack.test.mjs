// view-pack.test - Random updates through ViewPacker, JSON and ViewUnpacker come back the same, layers come back as fresh objects, and the layer limit starts over cleanly.
import assert from "node:assert/strict";
import { ViewPacker, ViewUnpacker } from "../worker/view-pack.js";

let seed = 11;
const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
const layer = () => ({ icon: rnd(3) ? "icons/mob/human.dmi" : null, iconState: ["", "a", "b"][rnd(3)], dir: [1, 2, 4, 8][rnd(4)], layer: rnd(5), plane: rnd(2) - 1, color: rnd(4) ? null : rnd(2) ? "#f00" : [1, 0, 0, 1], alpha: rnd(3) ? 255 : rnd(255),
	transform: rnd(5) ? null : [1, 0, rnd(3), 0, 1, 0], pixelX: rnd(3) - 1, pixelY: 0, invisibility: 0, blendMode: rnd(2), maptext: null, maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0, ...(rnd(4) ? {} : { flags: 2, explicitLayer: true }) });
const app = () => ({ ...layer(), ...(rnd(5) ? {} : { mouseOpacity: 0 }), overlays: Array.from({ length: rnd(4) }, layer) });
const scr = (n) => Array.from({ length: n }, (_, i) => [i + 1, "/obj/screen/x", `${rnd(3)},1`]);
const sorted = (x) => JSON.stringify(x, (k, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, v[k]])) : v);

const P = new ViewPacker(), U = new ViewUnpacker();
let bytes = [0, 0], screenN = 6;
for (let i = 1; i <= 3000; i++) {
	if (rnd(40) === 0) screenN = 4 + rnd(4);
	const u = { seq: i, full: i === 1 || rnd(200) === 0, worldTime: i, key: "K", view: rnd(50) ? "19x15" : "21x15", baseView: "19x15", eyeTile: { x: rnd(3), y: 1, z: 2 }, sight: { see_invisible: 25 },
		apps: Array.from({ length: rnd(5) }, () => [rnd(30), app()]), gone: [rnd(30)], tiles: [[1, 2, [3]]], moved: [], screen: rnd(3) ? null : scr(screenN), pred: rnd(4) ? [5, 2 << rnd(3)] : null, ...(rnd(9) ? {} : { anims: [["f", 1, "x"]] }) };
	if (u.full) u.screen = scr(screenN);
	const before = sorted(u), text = JSON.stringify(P.pack(u));
	assert.equal(sorted(u), before, "pack must not change its input");
	const back = U.unpack(JSON.parse(text));
	assert.equal(sorted(back), before, `update ${i} came back different`);
	bytes[0] += JSON.stringify(u).length; bytes[1] += text.length;
}
assert.ok(bytes[1] < bytes[0] * 0.7, `packed ${bytes[1]} vs plain ${bytes[0]}`);

// fresh objects: the page writes flickT0/appearedT0 into what it got
{
	const P = new ViewPacker(), U = new ViewUnpacker(), a = app();
	const one = U.unpack(JSON.parse(JSON.stringify(P.pack({ seq: 1, full: true, apps: [[1, a], [2, a]], gone: [], tiles: [], moved: [], screen: [] }))));
	one.apps[0][1].flickT0 = 5;
	assert.equal(one.apps[1][1].flickT0, undefined);
}

// past the limit both sides start over: a layer numbered before is sent again
{
	const P = new ViewPacker(), U = new ViewUnpacker(), a = app();
	U.unpack(JSON.parse(JSON.stringify(P.pack({ seq: 1, full: true, apps: [[1, a]], gone: [], tiles: [], moved: [], screen: [] }))));
	for (let i = 0; i <= 50000; i++) P.nums.set("x" + i, P.nums.size);
	const p = P.pack({ seq: 2, full: false, apps: [[1, a]], gone: [], tiles: [], moved: [], screen: null });
	assert.equal(p.Lreset, 1);
	assert.equal(sorted(U.unpack(JSON.parse(JSON.stringify(p))).apps), sorted([[1, a]]));
}
console.log(`view-pack: ok (3000 random updates, ${bytes[1]} bytes packed vs ${bytes[0]} plain)`);
