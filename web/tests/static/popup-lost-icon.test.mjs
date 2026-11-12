// a runtime icon (character preview) whose PNG never arrives holds up popups only for a while: the next browse still opens
// (worker/popups.js, rsc pendingPng). Before, one lost or failed icon made every later popup wait until a reload.
// A failed render (rsc_png with png null) frees the wait at once.
import assert from "node:assert";
const listeners = {};
const mkFrame = () => { const f = { sandbox: "", style: {}, srcSets: 0, posted: [], contentWindow: { postMessage(m) { f.posted.push(m); } }, blur() {}, remove() {} }; Object.defineProperty(f, "src", { set() { f.srcSets++; } }); return f; };
const frames = [];
const mkEl = () => ({ style: {}, dataset: {}, append() {}, remove() {}, querySelector: () => null, offsetLeft: 0, offsetTop: 0 });
globalThis.window = globalThis; globalThis.focus = () => {}; globalThis.innerWidth = 800; globalThis.innerHeight = 600;
globalThis.addEventListener = (t, f) => { (listeners[t] ??= []).push(f); };
globalThis.removeEventListener = () => {};
Object.defineProperty(globalThis, "document", { value: { baseURI: "http://x/index.html", createElement: (t) => (t === "iframe" ? (frames.push(mkFrame()), frames.at(-1)) : mkEl()), activeElement: null }, configurable: true });
const { createPopups, PNG_GIVE_UP_MS } = await import("../../worker/popups.js");
const p = createPopups({ host: { append() {}, clientWidth: 800, clientHeight: 600 }, send() {} });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// a failed render: the worker says so, and the browse after it opens at once
p.rsc({ file: "icon_1", name: "previewicon.png", pendingPng: true });
p.rscPng({ name: "previewicon.png", png: null });
p.browse({ window: "w1", html: "<p>one</p>" }); await wait(100);
assert.strictEqual(frames.length, 1, "a failed icon render does not hold up the next popup");
// a lost icon: no answer at all; the browse opens once the wait gives up
p.rsc({ file: "icon_2", name: "previewicon2.png", pendingPng: true });
p.browse({ window: "w2", html: "<p>two</p>" }); await wait(100);
assert.strictEqual(frames.length, 1, "the popup waits for the icon at first");
await wait(PNG_GIVE_UP_MS);
assert.strictEqual(frames.length, 2, "the popup opens after the icon wait gives up");
console.log("popup-lost-icon: ok");
process.exit(0);
