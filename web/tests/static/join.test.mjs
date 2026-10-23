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
// the join window (plans/site.md step 4): short or common secrets are warned about, never refused; no secret is no warning
eq(j.weakSecret(""), false, "no secret: nothing to warn about");
eq(j.weakSecret("abc"), true, "under 8 characters");
eq(j.weakSecret("Password"), true, "on the common list, any case");
eq(j.weakSecret("blue walrus engine"), false, "long and uncommon");
eq(j.joinString(" Ian ", "k3x9 secret"), "Ian#k3x9 secret", "the page sends Name#secret as before");
eq(j.joinString("I#an", ""), "Ian", "a # typed in the name can't start a secret");
eq(j.joinString("  ", ""), "Player");
eq(j.nameAnswer("connected", "Ian").cls, "red");
assert.match(j.nameAnswer("reserved", "Ian").text, /admins/);
eq(j.nameAnswer("replaced", "Ian"), null, "another tab took over: the error window, not the join window");
// the loading window's steps follow the worker's messages and never go back
eq(j.loadStepOf("solo", "loaded"), 1); eq(j.loadStepOf("solo", "Loading the station... 12 / 36 MB"), 1);
eq(j.loadStepOf("solo", "Unpacking the station..."), 2); eq(j.loadStepOf("solo", "world-new"), 2); eq(j.loadStepOf("solo", "lobby"), 3);
eq(j.loadStepOf("mp", "connected"), 1); eq(j.loadStepOf("mp", "connect"), 0);
eq(j.stepShare("Loading the station... 12 / 36 MB"), 1 / 3); eq(j.stepShare("Unpacking"), 0);
// the bar: a message with no MB count (the game code finishing mid-download) never pulls it back; the download is most of it
{
	const p = j.loadProgress("solo");
	p.see("start"); p.see("Loading the station..."); p.see("Loading the station... 28 / 37 MB");
	const mid = p.shown; assert.ok(mid > 0.4, `28 of 37 MB is most of the download's part (${mid})`);
	p.see("translated"); assert.ok(p.shown >= mid, `the game code arriving keeps the bar at ${mid}, not ${p.shown}`); eq(p.gameDone, true);
	p.see("Unpacking the station..."); const un = p.shown; p.creep(); assert.ok(p.shown > un && p.shown < j.LOAD_ENDS.solo[2], "unpacking creeps on, short of its end");
	p.see("snapshot"); p.see("joined"); p.finish(); eq(p.shown, 1, "full before the window closes");
	const m = j.loadProgress("mp"); m.see("connect"); m.see("connected"); eq(m.shown, j.LOAD_ENDS.mp[0]); eq(m.gameDone, true);
}
for (const k of ["crash", "tab", "lost", "refused"]) eq(j.ERRORS[k].length, 3, `error window ${k}: title, detail, buttons`);
console.log("join: ok");
