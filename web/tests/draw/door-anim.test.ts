// pt-d: an airlock's "opening" state (public.dmi: 6 frames, delay 2 ds, loop=1) is added as an overlay when the door
// opens. It must play from frame 0 when the appearance arrives (the object's own clock), not from page load.
import assert from "node:assert";
import { animationElapsed, frameAtTime } from "../../src/dmi/animation.js";

// station-client.ts touches the DOM at import, so this repeats frameForState's two lines.
const frameForState = (st: { frames: number; delay: number[]; loop: number; rewind: boolean }, frameTime: number, objTime: number): number =>
	frameAtTime(st.frames, st.delay, st.loop, st.rewind, animationElapsed(st.loop, frameTime, objTime));

const opening = { frames: 6, delay: [2, 2, 2, 2, 2, 2], loop: 1, rewind: false };
const arrivedAt = 5000; // ds since page load: long after the shared clock passed the 12 ds the state lasts
for (const [dt, want] of [[0, 0], [1, 0], [2, 1], [5, 2], [11, 5], [12, 5], [40, 5]] as const) {
	const now = arrivedAt + dt;
	assert.equal(frameForState(opening, now, now - arrivedAt), want, `${dt} ds after arriving`);
}
// the old behaviour (object clock = page clock) sat on the last frame: no animation
assert.equal(frameForState(opening, arrivedAt + 2, arrivedAt + 2), 5);
// a loop=0 state stays on the shared clock
const blink = { frames: 2, delay: [5, 5], loop: 0, rewind: false };
assert.equal(frameForState(blink, 7, 0), 1);
console.log("door-anim.test: ok");
