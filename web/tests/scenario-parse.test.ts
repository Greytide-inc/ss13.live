// Scenario text parsing: Ns: times, header lines skipped by parseScript, the pure-JS hash.
import assert from "node:assert";
import { hashText, parseHeader, parseScript } from "../src/worker/scenario-script.js";

const src = "# c\nmap: runtime\njob: Assistant\nseed: 7\nlength: 30\n\n5s: spawn /obj/x x3 r2\n2.5s: wait\n10: key press W\n";
const h = parseHeader(src);
assert.deepStrictEqual(h, { map: "runtime", job: "Assistant", seed: 7, length: 30 });
const a = parseScript(src);
assert.deepStrictEqual(a.map((x) => [x.tick, x.verb]), [[10, "key"], [50, "wait"], [100, "spawn"]]);
assert.strictEqual(parseHeader("# job: X\n").job, undefined);
assert.strictEqual(hashText("abc"), hashText("abc"));
assert.notStrictEqual(hashText("abc"), hashText("abd"));
assert.strictEqual(hashText("").length, 14);
const e = "map: x\njob: A\nlength: 5\nexpect: crate at 3:4\nexpect: pulling=1\nexpect-not: undefined variable\n1s: say hi\n";
assert.deepStrictEqual(parseHeader(e), { map: "x", job: "A", length: 5, expect: ["crate at 3:4", "pulling=1"], expectNot: ["undefined variable"] });
assert.deepStrictEqual(parseScript(e).map((x) => x.verb), ["say"]); // expect lines are not script actions
console.log("scenario-parse ok");
