// anim.ts: easing, chaining, loops, interruption.
import assert from "node:assert";
import { byondMatrixToCanvas } from "../../src/render/byond-transform.js";
import { ease, ObjectAnims, lerpValue, CLIENT_ANIM_ID, foldPixels } from "../../src/render/anim.js";

const near = (a: number, b: number, m = "") => assert.ok(Math.abs(a - b) < 1e-6, `${m} ${a} != ${b}`);
for (const e of [0, 1, 2, 3, 4, 5, 6, 7, 64, 128, 192, 65, 129]) { near(ease(e, 0), 0, `ease ${e} at 0`); near(ease(e, 1), 1, `ease ${e} at 1`); }
near(ease(0, 0.3), 0.3); near(ease(1, 0.5), 0.5); assert.ok(ease(3 | 64, 0.5) < 0.2); assert.ok(ease(3 | 128, 0.5) > 0.8);
assert.ok(ease(6, 0.1) < 0, "back goes backwards first");

// alpha 255 -> 0 over 10 ds, linear
let a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["alpha", 255, 0]]);
near(a.values(500).get("alpha") as number, 127.5);
assert.equal(a.values(1000).size, 0, "finished: nothing overrides the server's value");
assert.equal(a.seqs.length, 0);

// chain: step 2 (0 -> 255 over 10 ds) after step 1; a var only in step 2 shows its "before" during step 1
a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["alpha", 255, 0]]);
a.step(0, false, 10, 1, 0, 0, [["alpha", 0, 255], ["pixel_y", 3, 9]]);
near(a.values(1500).get("alpha") as number, 127.5);
near(a.values(500).get("pixel_y") as number, 3);
near(a.values(1500).get("pixel_y") as number, 6);

// loop forever: the same value one cycle later; loop=2 stops after two cycles
a = new ObjectAnims();
a.step(0, true, 10, -1, 0, 0, [["alpha", 0, 100]]);
near(a.values(50_500).get("alpha") as number, 50);
a = new ObjectAnims();
a.step(0, true, 10, 2, 0, 0, [["alpha", 0, 100]]);
assert.equal(a.values(1500).get("alpha"), 50);
assert.equal(a.values(2000).size, 0);

// a new animation while one runs starts from the shown value; END_NOW starts from the recorded "before"
a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["alpha", 255, 0]]);
a.step(500, true, 10, 1, 0, 0, [["alpha", 0, 255]]);
near(a.values(500).get("alpha") as number, 127.5);
a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["alpha", 255, 0]]);
a.step(500, true, 10, 1, 0, 1, [["alpha", 0, 255]]);
near(a.values(500).get("alpha") as number, 0);

// icon_state switches at its step; parallel keeps the other animation
a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["icon_state", "a", "b"]]);
a.step(0, false, 10, 1, 0, 0, [["icon_state", "b", "c"]]);
assert.equal(a.values(500).get("icon_state"), "b");
assert.equal(a.values(1500).get("icon_state"), "c");
a = new ObjectAnims();
a.step(0, true, 10, 1, 0, 0, [["pixel_x", 0, 10]]);
a.step(0, true, 10, 1, 0, 4, [["alpha", 255, 0]]);
assert.equal(a.seqs.length, 2);

// colors and matrices
assert.equal(lerpValue("color", "#000000", "#ffffff", 0.5, 0), "#808080");
const turn = (t: number) => [Math.cos(t), Math.sin(t), 0, -Math.sin(t), Math.cos(t), 0];
const mid = lerpValue("transform", null, turn(Math.PI / 2), 0.5, 0) as number[];
near(Math.hypot(mid[0], mid[3]), 1, "rotation keeps size");
const lin = lerpValue("transform", null, turn(Math.PI / 2), 0.5, 2) as number[];
assert.ok(Math.hypot(lin[0], lin[3]) < 0.8, "LINEAR_TRANSFORM shrinks");

// shake_camera on the /client: animate(C, pixel_x=, pixel_y=, time=1) x3 then back to the old offset (here 0,0; the VM has already set the final value)
a = new ObjectAnims();
assert.equal(CLIENT_ANIM_ID, -1);
a.step(0, true, 1, 1, 0, 0, [["pixel_x", 0, 20], ["pixel_y", 0, -10]]);
a.step(0, false, 1, 1, 0, 0, [["pixel_x", 20, -5], ["pixel_y", -10, 7]]);
a.step(0, false, 1, 1, 0, 0, [["pixel_x", -5, 0], ["pixel_y", 7, 0]]);
near(a.values(50).get("pixel_x") as number, 10, "half way to the first jolt");
near(a.values(50).get("pixel_y") as number, -5);
near(a.values(150).get("pixel_x") as number, 7.5, "half way from 20 to -5");
near(a.values(250).get("pixel_y") as number, 3.5, "half way back from 7 to 0");
assert.equal(a.values(300).size, 0, "done: the page falls back to client.pixel_x/y");
assert.equal(a.seqs.length, 0);
// a second shake while the first runs starts from the shown offset (not from the server's 0,0)
a = new ObjectAnims();
a.step(0, true, 1, 1, 0, 0, [["pixel_x", 0, 32]]);
a.step(0, false, 1, 1, 0, 0, [["pixel_x", 32, 0]]);
a.step(150, true, 1, 1, 0, 0, [["pixel_x", 0, -32]]);
near(a.values(150).get("pixel_x") as number, 16, "restarts from 16, where the first shake was");
assert.ok(Math.abs((a.values(249).get("pixel_x") as number) + 32) < 1, "ends at -32");
// pixel_z (tg's box alert image: pixel_z 0 -> 32, ELASTIC) and pixel_y together; the appearance holds the sum
a = new ObjectAnims();
a.step(0, true, 5, 1, 5, 0, [["pixel_z", 0, 32], ["alpha", 0, 255]]);
let ap: { pixelX: number; pixelY: number; pixelW?: number; pixelZ?: number } = { pixelX: 0, pixelY: 32, pixelZ: 32 }; // the server value (final)
foldPixels(ap, a.values(0));
assert.equal(ap.pixelY, 0, "starts at pixel_z 0");
ap = { pixelX: 0, pixelY: 32, pixelZ: 32 };
foldPixels(ap, a.values(250));
assert.ok(ap.pixelY > 32 && ap.pixelY < 33, "elastic overshoots 32 a little at half time (1.0156)");
assert.equal(a.values(500).size, 0, "done: the page shows the server's pixel_z 32");
// a mob with pixel_y 2 and pixel_z 12 animating only pixel_y keeps its pixel_z
ap = { pixelX: -3, pixelY: 14, pixelW: -3, pixelZ: 12 };
foldPixels(ap, new Map([["pixel_y", 10]]));
assert.deepEqual([ap.pixelX, ap.pixelY], [-3, 22]);
ap = { pixelX: -3, pixelY: 14, pixelW: -3, pixelZ: 12 };
foldPixels(ap, new Map([["pixel_w", 0]]));
assert.deepEqual([ap.pixelX, ap.pixelY], [0, 14], "pixel_x stays 0, w animates alone");
ap = { pixelX: 5, pixelY: 5 };
foldPixels(ap, new Map());
assert.deepEqual([ap.pixelX, ap.pixelY], [5, 5], "nothing animating: untouched");
assert.equal(lerpValue("alpha", 0, 255, 1.25, 0), 255, "alpha clamped when an elastic ease overshoots");
assert.equal(lerpValue("alpha", 255, 0, 1.25, 0), 0);
console.log("anim tests passed");

// ghost orbit: translate(0, r) then Turn(120 deg x i) keyframes (as SpinAnimation builds them; the VM's Turn rotates the translate too).
// Sampled between the keyframes the drawn offset of the icon centre must stay at radius r and go clockwise on screen (y down).
{
	const r = 16, deg = (x: number) => (x * Math.PI) / 180;
	const key = (d: number) => { const t = deg(d), c = Math.cos(t), s = Math.sin(t); return [c, s, c * 0 + s * r, -s, c, c * r]; };
	const keys = [key(0), key(120), key(240), key(360)];
	let prev = NaN, total = 0;
	for (let seg = 0; seg < 3; seg++) for (let i = seg ? 1 : 0; i <= 10; i++) {
		const m = (i === 10 ? keys[seg + 1] : lerpValue("transform", keys[seg], keys[seg + 1], i / 10, 0)) as number[];
		const cv = byondMatrixToCanvas(m), x = cv[4], y = cv[5]; // where the centre is drawn (canvas, y down)
		near(Math.hypot(x, y), r, `orbit radius seg ${seg} step ${i}`);
		const ang = Math.atan2(y, x); // increasing = clockwise on screen
		if (!Number.isNaN(prev)) { let d = ang - prev; if (d < -Math.PI) d += 2 * Math.PI; if (d > Math.PI) d -= 2 * Math.PI; assert.ok(d > 0, `orbit goes clockwise on screen seg ${seg} i ${i} d ${d} xy ${x},${y}`); total += d; }
		prev = ang;
	}
	near(total, 2 * Math.PI, "one full turn");
}
