// glide.test - A run of predicted diagonal steps keeps the camera up with them: each step is sent at the walking pace and drawn ahead
// (predGlide to the new target), the server's answer a step later rebases it (the target counted from the new tile, as client-scene does).
// Counted by its length, a diagonal step lost 0.4 tile each time: a ghost flying diagonally left the drawn map tiles behind.
import assert from "node:assert/strict";
import { glideAt, predGlide, serverGlide } from "../build/dist/src/render/glide.js";

const T = 32, walk = 50;
for (const [dx, dy] of [[1, 0], [1, 1], [-1, 1]]) {
	let g = null, now = 0, worst = 0;
	for (let i = 0; i < 40; i++, now += walk) {
		g = predGlide(g, 2 * dx * T, 2 * dy * T, walk, now, T); // two steps drawn ahead of the server's tile
		const at = glideAt(g, now + walk) ?? [0, 0]; // where it is when the next step goes out
		worst = Math.max(worst, Math.abs(at[0] - 2 * dx * T), Math.abs(at[1] - 2 * dy * T));
		g.ox -= dx * T; g.oy -= dy * T; g.tx = dx * T; g.ty = dy * T; // the server took the oldest step
	}
	assert.ok(worst <= T, `steps ${dx},${dy}: the camera fell ${worst} px behind its target`);
}
// Steps the server draws itself (not predicted: someone else's mob, a step prediction couldn't take): walking diagonally at glide_size 16 (a step
// every 2 ticks), looked at every 16 ms, the mob moves at an even pace (32 px a step is ~5 px a look). Diagonal glides timed by their length
// never finished before the next step, and the "at most a tile behind" cap snapped them ~9 px forward at every step.
for (const [dx, dy] of [[1, 0], [1, 1]]) {
	let g = null, x = 0, y = 0, prev = null, worst = 0;
	for (let t = 0; t < 4000; t += 16) {
		if (t % 100 < 16) { g = serverGlide(g, dx, dy, 16, t, 50, T); x += dx * T; y += dy * T; }
		const o = glideAt(g, t) ?? [0, 0], at = [x + o[0], y + o[1]];
		if (prev) worst = Math.max(worst, Math.abs(at[0] - prev[0]), Math.abs(at[1] - prev[1]));
		prev = at;
	}
	assert.ok(worst <= 8, `server steps ${dx},${dy}: the mob jumped ${worst} px in one look`);
}
console.log("glide.test: ok");
