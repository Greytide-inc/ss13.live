// carried-light.test - The carried light as sent (parseLight, strengthAt); a server tile with it taken out (lessLight) gets each lit corner's base,
// "transparent" (a fully lit tile) and "dark" included, so a corner the server shows at full strength isn't left with the light still in it;
// [] is no light.
import assert from "node:assert/strict";
import { lessLight, parseLight, strengthAt } from "../build/dist/src/render/carried-light.js";

assert.equal(parseLight([]), null);
// a light on the mob's tile lighting its four corners and one corner further east; a room light of 0.125 under it all (each corner's base),
// except the NE corner (1,1), which a lamp keeps at full strength
const c = (cx, cy, br, bg, bb) => [cx, cy, br, bg, bb];
const l = parseLight([7, 0, 0, 1, 2, 3, 0.5, 1, 1, ...c(-1, -1, 0.125, 0.125, 0.125), ...c(1, -1, 0.125, 0.125, 0.125),
	...c(-1, 1, 0.125, 0.125, 0.125), ...c(1, 1, 1, 1, 1), ...c(3, 1, 0.125, 0.125, 0.125)]);
assert.equal(l.mob, 7);
assert.equal(l.tiles.length, 9 + 2); // the 3x3 round the four inner corners, and two more east of the outer one
// a source of power 2, range 3, colour (0.5, 1, 1): from the applied turf, corner (-1, -1) is sqrt(0.5 + 1) / 3 out
assert.deepEqual(l.colour, [0.5, 1, 1]);
assert.ok(Math.abs(strengthAt(l, -1, -1, 0, 0) - 2 * (1 - Math.sqrt(1.5) / 3)) < 1e-9);
assert.ok(strengthAt(l, -1, -1, 0.5, 0) < strengthAt(l, -1, -1, 0, 0)); // the source half a tile east: further off
assert.equal(strengthAt(l, 9, 9, 0, 0), 0); // out of range
// the server tile: light + room, NE at full strength
const server = [0.375, 0.625, 0.625, 0, 0.375, 0.625, 0.625, 0, 0.375, 0.625, 0.625, 0, 1, 1, 1, 0, 0, 0, 0, 1];
const base = lessLight("", server, l, 0, 0);
assert.deepEqual(base.slice(0, 16), [0.125, 0.125, 0.125, 0, 0.125, 0.125, 0.125, 0, 0.125, 0.125, 0.125, 0, 1, 1, 1, 0]);
// tile (1,0): its corners (1,-1) SW, (3,-1) SE, (1,1) NW, (3,1) NE; (3,1) is in row 3
// a fully lit tile ("transparent", no matrix) where the light is: its lit corners get their bases, the rest stay at 1
const lit = lessLight("transparent", null, l, 1, 0);
assert.deepEqual(lit.slice(0, 16), [0.125, 0.125, 0.125, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0.125, 0.125, 0.125, 0]);
assert.equal(lessLight("", null, l, 0, 0), null);
assert.equal(lessLight("", server, l, -1, 3), null); // no lit corner
console.log("carried-light.test: ok");
