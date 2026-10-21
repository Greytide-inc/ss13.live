// sound.js with a fake Web Audio: repeat -> loop, stopped by a later same-channel / null sound, sounds before the first gesture.
import assert from "node:assert";
import { createSound } from "../../worker/sound.js";

const made = []; let state = "suspended", resumes = 0;
class Node { connect() {} }
globalThis.AudioContext = class {
	get state() { return state; }
	currentTime = 0; sampleRate = 48000;
	get destination() { return new Node(); }
	resume() { resumes++; state = "running"; return Promise.resolve(); }
	decodeAudioData() { return Promise.resolve({}); }
	createGain() { const n = new Node(); n.gain = {}; return n; }
	createBufferSource() { const n = new Node(); n.playbackRate = {}; n.stopped = false; n.start = () => { n.started = true; }; n.stop = () => { n.stopped = true; }; made.push(n); return n; }
};
globalThis.fetch = () => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)) });
const tick = () => new Promise((r) => setTimeout(r, 5));
const logs = []; const s = createSound((l) => logs.push(l));

// before any gesture: hum (repeat) and a one-shot wait
s.play({ file: "ship.ogg", repeat: 1, channel: 2, volume: 35 });
s.play({ file: "welcome.ogg", channel: 1 });
s.play({ file: "gone.ogg", channel: 3 }); s.play({ channel: 3 }); // stopped before unlock
assert.strictEqual(made.length, 0);
s.unlock(); await tick();
assert.strictEqual(made.length, 2, "hum and welcome start on unlock, the stopped one doesn't");
const hum = made[0]; assert.strictEqual(hum.loop, true, "repeat=1 loops"); assert.ok(hum.started); assert.strictEqual(made[1].loop, false);
// a later gesture resumes a suspended context, and is a no-op when running
state = "suspended"; const r0 = resumes; s.unlock(); assert.strictEqual(resumes, r0 + 1);
s.unlock(); assert.strictEqual(resumes, r0 + 1);
// same-channel sound replaces the hum
s.play({ file: "other.ogg", channel: 2 }); await tick();
assert.ok(hum.stopped, "later sound on channel 2 stops the loop");
assert.strictEqual(made[2].loop, false);
// null sound on the channel stops; channel 0 null stops all
s.play({ file: "ship.ogg", repeat: 1, channel: 2 }); await tick();
const hum2 = made[3]; assert.strictEqual(hum2.loop, true);
s.play({ channel: 2 }); assert.ok(hum2.stopped);
s.play({ file: "ship.ogg", repeat: 1, channel: 2 }); s.play({ file: "b.ogg", repeat: 1, channel: 5 }); await tick();
const [h3, h4] = made.slice(4); s.play({}); assert.ok(h3.stopped && h4.stopped, "null sound, channel 0 stops all");
assert.ok(s.debug().includes("audio: state"));
console.log("ok   sound.js: repeat loops, same-channel/null stop, pending until unlock, resume on every gesture");
