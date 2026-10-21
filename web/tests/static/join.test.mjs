// joining ss13.live: the name the page offers and keeps, and when closing the tab asks first.
import assert from "node:assert";
const j = await import("../../worker/join.js");
const eq = assert.deepStrictEqual;
const offered = [];
const ask = (answer) => (def) => { offered.push(def); return answer; };
// a first visit offers a name nobody else is likely to have, not plain "Player" (two visitors pressing OK clashed: "held this round")
const a = j.joinName(null, ask(null), () => 0.5), b = j.joinName(null, ask(null), () => 0.25);
assert.match(a, /^Player\d{4}$/, "Cancel on a first visit joins as the offered Player####");
assert.notStrictEqual(a, b, "two first visits get different names");
eq(j.joinName(null, ask(""), () => 0.5), a, "an empty answer is the offered name too");
eq(j.joinName("Bob", ask(null)), "Bob", "a returning player is offered their last name");
eq(offered.at(-1), "Bob");
eq(j.joinName("Bob", ask(" Alice#hunter2 ")), "Alice#hunter2", "a typed name (with a secret) is used");
eq(j.nameToSave("Alice#hunter2"), "Alice", "only the name is kept, never the secret");
eq(j.nameToSave("  #x"), null, "nothing worth keeping");
// Ctrl+W can't be blocked by a page (W walks, Ctrl+W is a game key too): while a game is showing, closing the tab asks first
eq(j.warnOnLeave({ views: 0 }), false, "still loading: close freely");
eq(j.warnOnLeave({ views: 3 }), true, "playing: ask before closing");
eq(j.warnOnLeave({ views: 3, done: true }), false, "the world stopped / connection lost: close freely");
eq(j.warnOnLeave({ views: 3, error: "refused" }), false, "refused or replaced: close freely");
eq(j.warnOnLeave({ views: 3 }, true), false, "test drivers (navigator.webdriver) never get the question");
console.log("join: ok");
