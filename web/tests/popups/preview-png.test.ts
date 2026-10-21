// a runtime icon browse_rsc'd to a popup is sent as a plain PNG (first state, south, frame 0).
import { decodePng, encodePng } from "../../src/dmi/png.js";
import { inflateSync } from "node:zlib";
import assert from "node:assert";

const w = 3, h = 2, px = new Uint8ClampedArray(w * h * 4).map((_, i) => (i * 37) & 255);
const bytes = encodePng(w, h, px);
assert.deepStrictEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const back = decodePng(bytes, (z) => inflateSync(z))!;
assert.strictEqual(back.width, w);
assert.strictEqual(back.height, h);
assert.deepStrictEqual([...back.rgba], [...px]);
console.log("preview-png: ok");
