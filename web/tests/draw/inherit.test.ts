// client-scene.ts inherit()/itemsOf: overlays follow the owner's static transform, alpha and color.
import assert from "node:assert";
import { inherit, blendOf } from "../../src/render/inherit.js";

const app = (o: Record<string, unknown> = {}) => ({ alpha: 255, color: null, transform: null, pixelX: 0, pixelY: 0, layer: 2, plane: 0, overlays: [], ...o }) as never as Parameters<typeof inherit>[0];
const near = (a: number[], b: number[]) => a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) < 1e-9, `${a} != ${b}`));

// owner turned 90 deg (a=0,b=1,d=-1,e=0), overlay with no offset: same matrix
near(inherit(app(), app({ transform: [0, 1, 0, -1, 0, 0] })).transform!, [0, 1, 0, -1, 0, 0]);
// overlay 8 px right of the owner's centre swings to 8 px below (y-up: f = -8): net translate of (x'-x, y'-y)
near(inherit(app({ pixelX: 8 }), app({ transform: [0, 1, 0, -1, 0, 0] })).transform!, [0, 1, -8, -1, 0, -8]);
// alpha multiplies, color inherited only when the overlay has none
const r = inherit(app({ alpha: 128 }), app({ alpha: 128, color: "#f00" }));
assert.ok(Math.abs(r.alpha - 64.25) < 0.01); assert.equal(r.color, "#f00");
assert.equal(inherit(app({ color: "#0f0" }), app({ color: "#f00" })).color, "#000000");
assert.equal(inherit(app({ color: "#ff8000" }), app({ color: "#808080" })).color, "#804000");
assert.deepEqual(inherit(app({ color: [1, 0, 0, 0, 1, 0, 0, 0, 1] }), app({ color: "#f00" })).color, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
// RESET_* on the child (2 color, 4 alpha, 8 transform)
const own = app({ flags: 2 | 4 | 8, alpha: 128, color: "#0f0" }), par = app({ alpha: 128, color: "#f00", transform: [0, 1, 0, -1, 0, 0] });
const z = inherit(own, par); assert.equal(z.alpha, 128); assert.equal(z.color, "#0f0"); assert.equal(z.transform, null);
assert.equal(inherit(app({ flags: 2 }), par).color, null);
assert.ok(inherit(app({ flags: 4 }), par).alpha === 255 && inherit(app({ flags: 4 }), par).color === "#f00");
assert.ok(inherit(app({ flags: 8 }), par).transform === null && inherit(app({ flags: 8 }), par).alpha < 129);
assert.equal(inherit(app(), app()).transform, null);
console.log("inherit: ok");
{
	const b = (n: number) => ({ blendMode: n }) as never as Parameters<typeof inherit>[0];
	assert.equal(blendOf(b(0), b(4)), 4); // BLEND_DEFAULT overlay follows the owner
	assert.equal(blendOf(b(2), b(4)), 2); // its own mode wins
	assert.equal(blendOf(b(1), b(4)), 1); // BLEND_OVERLAY is explicit: normal, not the owner's multiply
	assert.equal(blendOf(b(0), b(0)), 0);
}
console.log("blendOf: ok");
