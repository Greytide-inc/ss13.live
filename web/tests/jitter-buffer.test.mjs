// jitter-buffer.test - Views that arrive unevenly leave evenly, in order, held at most 100 ms; steady views are not held; other messages stay behind held views.
import assert from "node:assert/strict";
import { JitterBuffer } from "../worker/jitter-buffer.js";

let seed = 3;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
// steady: nothing held
{
	const b = new JitterBuffer(() => {});
	for (let i = 0; i < 400; i++) b.push({ type: "view" }, i / 2, 1000 + i * 50);
	clearTimeout(b.timer);
	assert.ok(b.held.every((h) => h <= 1), "steady views are not held");
}
// jittered by up to 40 ms: release times (as computed) keep order and even out
{
	const at = [], arrive = (i) => (at[i] ??= 1000 + i * 50 + rnd() * 40);
	const b = new JitterBuffer(() => {}), rel = [];
	for (let i = 0; i < 400; i++) { b.push({ type: "view", i }, i / 2, arrive(i)); rel.push(at[i] + b.held.at(-1)); b.q.length = 0; }
	clearTimeout(b.timer);
	const gapsIn = [], gapsOut = [];
	for (let i = 100; i < 400; i++) { gapsIn.push(at[i] - at[i - 1]); gapsOut.push(rel[i] - rel[i - 1]); }
	const spread = (g) => Math.max(...g) - Math.min(...g);
	assert.ok(spread(gapsOut) < spread(gapsIn) / 2, `gaps even out (${spread(gapsIn).toFixed(0)} -> ${spread(gapsOut).toFixed(0)} ms spread)`);
	assert.ok(b.held.every((h) => h <= 100), "held at most 100 ms");
}
// world.time jumps ahead: never held past 100 ms (a new round, world.time starting over, plays at once)
{
	const b = new JitterBuffer(() => {});
	for (let i = 0; i < 60; i++) b.push({ type: "view" }, i / 2, i * 50);
	b.push({ type: "view" }, 5000, 3000);
	assert.equal(b.held.at(-1), 100, "a view far ahead is held 100 ms");
	b.push({ type: "sound" }, undefined, 3001);
	assert.equal(b.q.length, 2, "a sound waits behind the held view");
	clearTimeout(b.timer);
	const out = []; b.release = (m) => out.push(m.type); b.flush();
	assert.deepEqual(out, ["view", "sound"], "flush keeps order");
}
console.log("jitter-buffer: ok");
