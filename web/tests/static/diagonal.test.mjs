// held direction keys -> one diagonal step; opposite keys cancel; other commands untouched.
import assert from "node:assert";
const { mergeMoves } = await import("../../build/dist/src/vm/clients.js");
const D = "\u0002", U = ".moveup", Dn = ".movedown", R = ".moveright", L = ".moveleft";
const t = (a, b, msg) => assert.deepStrictEqual(mergeMoves(a), b, msg);
t([U], [U], "single stays");
t([U, R], [D + 5], "W+D = NORTHEAST");
t([Dn, R], [D + 6], "S+D = SOUTHEAST");
t([Dn, L], [D + 10], "S+A = SOUTHWEST");
t([U, L], [D + 9], "W+A = NORTHWEST");
t([R, U], [D + 5], "order does not matter");
t([U, Dn], [], "opposites cancel");
t([U, Dn, R], [R], "N+S+E = just east");
t([U, Dn, L, R], [], "all four = nothing");
t([U, U], [U], "same direction twice (W and UP held) = one step");
t([U, R, L], [U], "E+W cancel, N remains");
t(["a-intent left", U, R, "quick-equip"], ["a-intent left", D + 5, "quick-equip"], "other commands keep their place");
t(["quick-equip"], ["quick-equip"]);
console.log("diagonal: ok");
