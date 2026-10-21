// sprite-lookup (3ag): a missing icon_state falls back to the sheet's "" state, as BYOND does (tg's fullbright,
// alphacolors.dmi "white", only exists as the "" state); no "" state either -> undefined (draw nothing).
import assert from "node:assert";
import { findState } from "../../src/render/sprite-lookup.js";

const st = (name: string) => ({ name, dirs: 1, frames: 1, delay: [], loop: 0, rewind: false, cells: [[0]] });
const dmi = (...names: string[]) => ({ width: 32, height: 32, imageWidth: 32, imageHeight: 32, columns: 1, rows: 1, states: names.map(st) }) as never;
assert.equal(findState(dmi("", "blue"), "blue")?.name, "blue");
assert.equal(findState(dmi("blue", ""), "white")?.name, "", "missing state -> default state");
assert.equal(findState(dmi("blue"), "white"), undefined, "no default state -> nothing");
assert.equal(findState(dmi("blue", ""), "")?.name, "");
console.log("sprite-lookup: ok");
