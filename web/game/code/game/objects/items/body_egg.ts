// From code/game/objects/items/body_egg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9457, "/obj/item/organ/body_egg", "/obj/item/organ", {
	name: "body egg",
	desc: "All slimy and yuck.",
	icon_state: "innards",
	origin_tech: "biotech=5",
	zone: "chest",
	slot: "parasite_egg",
});

// /obj/item/organ/body_egg/proc/on_find  (code/game/objects/items/body_egg.dm:10)
rt.def("/obj/item/organ/body_egg/proc/on_find", function on_find(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You found an unknown alien organism in ＀'s ＀!</span>", [rt.sv(f, "owner"), rt.sv(f, "zone")])]);
	return f.dot;
}, false, { args: ["finder"] });

// /obj/item/organ/body_egg/proc/New  (code/game/objects/items/body_egg.dm:14)  may sleep
rt.def("/obj/item/organ/body_egg/proc/New", function* New(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, live(f.src), "Insert", [live(f.args[0])]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["loc"] });

// /obj/item/organ/body_egg/proc/Insert  (code/game/objects/items/body_egg.dm:19)  may sleep
rt.def("/obj/item/organ/body_egg/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modField(f, rt.sv(f, "owner"), "status_flags", 32768, rt.bitOr));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "med_hud_set_status", []);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/organ/body_egg/proc/AddInfectionImages"), rt.sv(f, "owner")]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/body_egg/proc/Remove  (code/game/objects/items/body_egg.dm:26)  may sleep
rt.def("/obj/item/organ/body_egg/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "owner"))) {
		(rt.modField(f, rt.sv(f, "owner"), "status_flags", 16744447, rt.bitAnd));
		yield* g.callName(f, rt.sv(f, "owner"), "med_hud_set_status", []);
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/organ/body_egg/proc/RemoveInfectionImages"), rt.sv(f, "owner")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/body_egg/proc/process  (code/game/objects/items/body_egg.dm:34)  may sleep
rt.def("/obj/item/organ/body_egg/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(f.src), rt.fv(f, "internal_organs", rt.sv(f, "owner"))) ? 1 : 0))) {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
		return live(f.dot);
	}
	yield* g.srcCall(f, "egg_process");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/organ/body_egg/proc/RefreshInfectionImage  (code/game/objects/items/body_egg.dm:45)  may sleep
rt.def("/obj/item/organ/body_egg/proc/RefreshInfectionImage", function* RefreshInfectionImage(f: Frame) {
	yield* g.srcCall(f, "RemoveInfectionImages");
	yield* g.srcCall(f, "AddInfectionImages");
	return f.dot;
}, true);
