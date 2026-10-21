// From code/game/objects/items/documents.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9775, "/obj/item/documents/photocopy", "/obj/item/documents", {
	forgedseal: 0,
	copy_type: null,
	desc: "A copy of some top-secret documents. Nobody will notice they aren't the originals... right?",
});

// /obj/item/documents/photocopy/proc/New  (code/game/objects/items/documents.dm:41)  may sleep
rt.def("/obj/item/documents/photocopy/proc/New", function* New(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "copy_type", rt.fv(f, "type", live(f.args[1])));
	if (!truthy((rt.istype(live(f.args[1]), T("/obj/item/documents/photocopy")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "copy_type", rt.gv(f, "copy_type", (C = live(f.args[1]))));
	return f.dot;
}, true, { args: ["loc", "copy"] });

// /obj/item/documents/photocopy/proc/attackby  (code/game/objects/items/documents.dm:49)
rt.def("/obj/item/documents/photocopy/proc/attackby", function attackby(f: Frame, O: Value, user: Value, params: Value) {
	let C: Value = null;
	f.vars = () => [C];
	if (!(truthy((rt.istype(live(O), T("/obj/item/toy/crayon/red")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/item/toy/crayon/blue")) ? 1 : 0)))) return f.dot;
	if (truthy(rt.sv(f, "forgedseal"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You have already forged a seal on ＀!</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "name", fmt("＀ secret documents", [rt.gv(f, "item_color", (C = live(O)))]));
		rt.setSv(f, "icon_state", fmt("docs_＀", [rt.fv(f, "item_color", live(C))]));
		rt.setSv(f, "forgedseal", rt.fv(f, "item_color", live(C)));
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You forge the official seal with a ＀ crayon. No one will notice... right?</span>", [rt.fv(f, "item_color", live(C))])]);
		rt.callSrc(f, "update_icon", []);
	}
	return f.dot;
});
