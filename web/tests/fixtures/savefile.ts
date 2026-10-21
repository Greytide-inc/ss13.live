// savefile.ts - fixture for the savefile section (tests/engine-sections.ts runSavefileOverlayCheck): the DM sp_held / sp_hold / sp_peek.
import { rt, setG, G } from "./lib.js";
import type { Frame, Value } from "./lib.js";
const { T, live } = rt;

rt.globals([["sp_held", null]]);

rt.def("/proc/sp_hold", function sp_hold(f: Frame, path: Value) {
	setG("sp_held", rt.new_(f, T("/savefile"), [path]));
	rt.op(f, "OutputReference", [rt.R.index], [live(G("sp_held")), "k", rt.list("v", 5)], false);
	rt.set(f, live(G("sp_held")), "cd", "/sub");
	rt.op(f, "OutputReference", [rt.R.index], [live(G("sp_held")), "n", "deep"], false);
	return f.dot;
});

rt.def("/proc/sp_peek", function sp_peek(f: Frame, path: Value) {
	let S: Value = null, L: Value = null;
	S = rt.new_(f, T("/savefile"), [path]);
	L = rt.input(f, rt.R.index, null, [live(S), "k"]);
	return rt.fmt("＀ ＀ ＀ ＀", [rt.get(f, live(L), "len"), rt.index(live(L), 1), rt.index(live(L), 2), rt.input(f, rt.R.index, null, [live(S), "sub/n"])]);
});
