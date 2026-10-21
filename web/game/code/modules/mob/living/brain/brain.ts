// From code/modules/mob/living/brain/brain.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5093, "/mob/living/brain", "/mob/living", {
	container: null,
	timeofhostdeath: 0,
	emp_damage: 0,
	stored_dna: null,
	stat: 2,
	see_invisible: 25,
});

// /mob/living/brain/proc/Initialize  (code/modules/mob/living/brain/brain.dm:10)  may sleep
rt.def("/mob/living/brain/proc/Initialize", function* Initialize(f: Frame) {
	let OB: Value = null;
	f.vars = () => [OB];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "create_dna", live(f.src));
	yield* g.callName(f, rt.sv(f, "stored_dna"), "initialize_dna", [(yield* g.call(f, P("/proc/random_blood_type"), null, []))]);
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	rt.setSv(f, "loc", (OB = (yield* g.new_(f, T("/obj/item/organ/brain"), [rt.sv(f, "loc")]))));
	rt.setFv(f, "brainmob", live(OB), live(f.src));
	return f.dot;
}, true);

// /mob/living/brain/proc/create_dna  (code/modules/mob/living/brain/brain.dm:20)  may sleep
rt.def("/mob/living/brain/proc/create_dna", function* create_dna(f: Frame) {
	let rando_race: Value = null;
	f.vars = () => [rando_race];
	rt.setSv(f, "stored_dna", (yield* g.new_(f, T("/datum/dna/stored"), [live(f.src)])));
	if (truthy(rt.fv(f, "species", rt.sv(f, "stored_dna")))) return f.dot;
	rando_race = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "roundstart_races", rt.gl("config"))]);
	rt.setFv(f, "species", rt.sv(f, "stored_dna"), (yield* g.new_(f, live(rando_race), [])));
	return f.dot;
}, true);

// /mob/living/brain/proc/Destroy  (code/modules/mob/living/brain/brain.dm:27)  may sleep
rt.def("/mob/living/brain/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "key"))) {
		if (!isEqual(rt.sv(f, "stat"), 2)) {
			yield* g.srcCall(f, "death", 1);
		}
		if (truthy(rt.sv(f, "mind"))) {
			rt.setFv(f, "current", rt.sv(f, "mind"), null);
		}
		yield* g.srcCall(f, "ghostize");
	}
	rt.setSv(f, "container", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/brain/proc/update_canmove  (code/modules/mob/living/brain/brain.dm:36)
rt.def("/mob/living/brain/proc/update_canmove", function update_canmove(f: Frame) {
	if (truthy(rt.callSrc(f, "in_contents_of", [T("/obj/mecha")]))) {
		rt.setSv(f, "canmove", 1);
	} else {
		rt.setSv(f, "canmove", 0);
	}
	return rt.sv(f, "canmove");
});

// /mob/living/brain/proc/can_be_revived  (code/modules/mob/living/brain/brain.dm:59)
rt.def("/mob/living/brain/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = 1;
	if (!(!truthy(rt.sv(f, "container")) || rt.le(rt.sv(f, "health"), -100))) return f.dot;
	return 0;
});

// /mob/living/brain/proc/fully_replace_character_name  (code/modules/mob/living/brain/brain.dm:63)
rt.def("/mob/living/brain/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "stored_dna"))) return f.dot;
	rt.setFv(f, "real_name", rt.sv(f, "stored_dna"), rt.sv(f, "real_name"));
	return f.dot;
}, false, { args: ["oldname", "newname"] });

// /mob/living/brain/proc/ClickOn  (code/modules/mob/living/brain/brain.dm:68)  may sleep
rt.def("/mob/living/brain/proc/ClickOn", function* ClickOn(f: Frame) {
	let MMI: Value = null, M: Value = null;
	f.vars = () => [MMI, M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/device/mmi")) ? 1 : 0))) return f.dot;
	MMI = rt.sv(f, "loc");
	M = rt.fv(f, "mecha", live(MMI));
	if (!(isEqual(live(f.src), rt.fv(f, "brainmob", live(MMI))) && truthy((rt.istype(live(M), T("/obj/mecha")) ? 1 : 0)))) return f.dot;
	return (yield* g.callName(f, live(M), "click_action", [live(f.args[0]), live(f.src), live(f.args[1])]));
}, true, { args: ["A", "params"] });
