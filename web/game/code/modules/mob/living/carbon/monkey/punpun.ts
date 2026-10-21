// From code/modules/mob/living/carbon/monkey/punpun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4821, "/mob/living/carbon/monkey/punpun", "/mob/living/carbon/monkey", {
	ancestor_name: null,
	ancestor_chain: 1,
	relic_hat: null,
	relic_mask: null,
	memory_saved: 0,
	pet_monkey_names: null,
	rare_pet_monkey_names: null,
	name: "Pun Pun",
	unique_name: 0,
});

// /mob/living/carbon/monkey/punpun/proc/Initialize  (code/modules/mob/living/carbon/monkey/punpun.dm:13)  may sleep
rt.def("/mob/living/carbon/monkey/punpun/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "Read_Memory");
	if (truthy(rt.sv(f, "ancestor_name"))) {
		rt.setSv(f, "name", rt.sv(f, "ancestor_name"));
		if (rt.gt(rt.sv(f, "ancestor_chain"), 1)) {
			rt.modSrcVar(f, "name", fmt(" ３！", [rt.sv(f, "ancestor_chain")]), add);
		}
	} else {
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "rare_pet_monkey_names")]));
		} else {
			rt.setSv(f, "name", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "pet_monkey_names")]));
		}
		rt.setSv(f, "gender", rt.op(f, "PickUnweighted", [2], ["male", "female"]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "relic_hat"))) {
		yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, rt.sv(f, "relic_hat"), [])), 11);
	}
	if (!truthy(rt.sv(f, "relic_mask"))) return f.dot;
	yield* g.srcCall(f, "equip_to_slot_or_del", (yield* g.new_(f, rt.sv(f, "relic_mask"), [])), 2);
	return f.dot;
}, true);

// /mob/living/carbon/monkey/punpun/proc/Life  (code/modules/mob/living/carbon/monkey/punpun.dm:35)
rt.def("/mob/living/carbon/monkey/punpun/proc/Life", function Life(f: Frame) {
	if ((isEqual(rt.fv(f, "current_state", rt.gl("SSticker")), 4) && !truthy(rt.sv(f, "memory_saved")))) {
		rt.callSrc(f, "Write_Memory", [0]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/carbon/monkey/punpun/proc/death  (code/modules/mob/living/carbon/monkey/punpun.dm:40)  may sleep
rt.def("/mob/living/carbon/monkey/punpun/proc/death", function* death(f: Frame) {
	if ((!truthy(rt.sv(f, "memory_saved")) || truthy(live(f.args[0])))) {
		yield* g.srcCall(f, "Write_Memory", 1, live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/carbon/monkey/punpun/proc/Read_Memory  (code/modules/mob/living/carbon/monkey/punpun.dm:45)
rt.def("/mob/living/carbon/monkey/punpun/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setSv(f, "ancestor_name", rt.input(f, rt.R.index, null, [(S = rt.new_(f, T("/savefile"), ["data/npc_saves/Punpun.sav"])), "ancestor_name"]));
	rt.setSv(f, "ancestor_chain", rt.input(f, rt.R.index, null, [live(S), "ancestor_chain"]));
	rt.setSv(f, "relic_hat", rt.input(f, rt.R.index, null, [live(S), "relic_hat"]));
	rt.setSv(f, "relic_mask", rt.input(f, rt.R.index, null, [live(S), "relic_mask"]));
	return f.dot;
});

// /mob/living/carbon/monkey/punpun/proc/Write_Memory  (code/modules/mob/living/carbon/monkey/punpun.dm:52)
rt.def("/mob/living/carbon/monkey/punpun/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value, gibbed: Value) {
	let S: Value = null;
	f.vars = () => [S];
	S = rt.new_(f, T("/savefile"), ["data/npc_saves/Punpun.sav"]);
	if (truthy(live(gibbed))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "ancestor_name", null], false);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "ancestor_chain", 1], false);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_hat", null], false);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_mask", null], false);
		return live(f.dot);
	}
	if (truthy(live(dead))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "ancestor_name", rt.sv(f, "ancestor_name")], false);
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "ancestor_chain", add(rt.sv(f, "ancestor_chain"), 1)], false);
	}
	if (!truthy(rt.sv(f, "ancestor_name"))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "ancestor_name", rt.sv(f, "name")], false);
	}
	if (truthy(rt.sv(f, "head"))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_hat", rt.fv(f, "type", rt.sv(f, "head"))], false);
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_hat", null], false);
	}
	if (truthy(rt.sv(f, "wear_mask"))) {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_mask", rt.fv(f, "type", rt.sv(f, "wear_mask"))], false);
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [live(S), "relic_mask", null], false);
	}
	if (truthy(live(dead))) return f.dot;
	rt.setSv(f, "memory_saved", 1);
	return f.dot;
});
