// From code/datums/mutations.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmutations_list  (code/datums/mutations.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalmutations_list", function InitGlobalmutations_list(f: Frame) {
	rt.setGl("mutations_list", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "mutations_list", add);
	return f.dot;
});

rt.type(589, "/datum/mutation/human", "/datum/mutation", {
	dna_block: null,
	quality: null,
	get_chance: 100,
	lowest_value: 2048,
	text_gain_indication: "",
	text_lose_indication: "",
	visual_indicators: null,
	layer_used: 26,
	species_allowed: null,
	health_req: null,
	limb_req: null,
	time_coeff: 1,
});

// /datum/mutation/human/proc/<init>  (code/datums/mutations.dm:18)
rt.def("/datum/mutation/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "visual_indicators", rt.list());
	$0 = $0;
	rt.setSv(f, "species_allowed", rt.list());
	return f.dot;
});

// /datum/mutation/human/proc/force_give  (code/datums/mutations.dm:26)  may sleep
rt.def("/datum/mutation/human/proc/force_give", function* force_give(f: Frame, owner: Value) {
	f.vars = () => [owner];
	yield* g.srcCall(f, "set_block", live(owner));
	f.dot = (yield* g.srcCall(f, "on_acquiring", live(owner)));
	return f.dot;
}, true);

// /datum/mutation/human/proc/force_lose  (code/datums/mutations.dm:30)  may sleep
rt.def("/datum/mutation/human/proc/force_lose", function* force_lose(f: Frame, owner: Value) {
	f.vars = () => [owner];
	yield* g.srcCall(f, "set_block", live(owner), 0);
	f.dot = (yield* g.srcCall(f, "on_losing", live(owner)));
	return f.dot;
}, true);

// /datum/mutation/human/proc/set_se  (code/datums/mutations.dm:34)
rt.def("/datum/mutation/human/proc/set_se", function set_se(f: Frame, se_string: Value, on: Value) {
	let before: Value = null, injection: Value = null, after: Value = null;
	let $0: any;
	f.vars = () => [on, before, injection, after, $0];
	if (live(on) === null) {
		on = 1;
	}
	if ((!truthy(live(se_string)) || rt.lt(rt.call(f, P("/proc/lentext"), null, [live(se_string)]), 57))) {
		return live(f.dot);
	}
	before = rt.call(f, P("/proc/copytext"), null, [live(se_string), 1, add(multiply(subtract(rt.sv(f, "dna_block"), 1), 3), 1)]);
	if (truthy(live(on))) {
		$0 = rt.call(f, P("/proc/rand"), null, [rt.sv(f, "lowest_value"), 4095]);
	} else {
		$0 = rt.call(f, P("/proc/rand"), null, [0, subtract(rt.sv(f, "lowest_value"), 1)]);
	}
	injection = rt.call(f, P("/proc/num2hex"), null, [$0, 3]);
	after = rt.call(f, P("/proc/copytext"), null, [live(se_string), add(multiply(rt.sv(f, "dna_block"), 3), 1), 0]);
	return add(add(live(before), live(injection)), live(after));
});

// /datum/mutation/human/proc/set_block  (code/datums/mutations.dm:42)
rt.def("/datum/mutation/human/proc/set_block", function set_block(f: Frame, owner: Value, on: Value) {
	f.vars = () => [on];
	if (live(on) === null) {
		on = 1;
	}
	if (!(truthy(live(owner)) && truthy(rt.callName(f, live(owner), "has_dna", [])))) return f.dot;
	rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(owner)), rt.callSrc(f, "set_se", [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(owner))), live(on)]));
	return f.dot;
});

// /datum/mutation/human/proc/check_block_string  (code/datums/mutations.dm:46)
rt.def("/datum/mutation/human/proc/check_block_string", function check_block_string(f: Frame, se_string: Value) {
	if ((!truthy(live(se_string)) || rt.lt(rt.call(f, P("/proc/lentext"), null, [live(se_string)]), 57))) {
		return 0;
	}
	if (!rt.ge(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/getblock"), null, [live(se_string), rt.sv(f, "dna_block")])]), rt.sv(f, "lowest_value"))) return f.dot;
	return 1;
});

// /datum/mutation/human/proc/check_block  (code/datums/mutations.dm:52)  may sleep
rt.def("/datum/mutation/human/proc/check_block", function* check_block(f: Frame, owner: Value, force_powers: Value) {
	f.vars = () => [owner, force_powers];
	if (live(force_powers) === null) {
		force_powers = 0;
	}
	if (truthy((yield* g.srcCall(f, "check_block_string", rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(owner))))))) {
		if ((truthy(rt.op(f, "Prob", [], [rt.sv(f, "get_chance")])) || truthy(live(force_powers)))) {
			f.dot = (yield* g.srcCall(f, "on_acquiring", live(owner)));
		}
	} else {
		f.dot = (yield* g.srcCall(f, "on_losing", live(owner)));
	}
	return f.dot;
}, true);

// /datum/mutation/human/proc/on_acquiring  (code/datums/mutations.dm:59)
rt.def("/datum/mutation/human/proc/on_acquiring", function on_acquiring(f: Frame, owner: Value) {
	let mut_overlay: Value = null;
	f.vars = () => [mut_overlay];
	if ((((!truthy(live(owner)) || !truthy((rt.istype(live(owner), T("/mob/living/carbon/human")) ? 1 : 0))) || isEqual(rt.fv(f, "stat", live(owner)), 2)) || truthy((rt.isIn(f, live(f.src), rt.gv(f, "mutations", rt.fv(f, "dna", live(owner)))) ? 1 : 0)))) {
		return 1;
	}
	if ((truthy(rt.len(f, rt.sv(f, "species_allowed"))) && !truthy(rt.callName(f, rt.sv(f, "species_allowed"), "Find", [rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(owner))))])))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "health_req")) && rt.lt(rt.fv(f, "health", live(owner)), rt.sv(f, "health_req")))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "limb_req")) && !truthy(rt.callName(f, live(owner), "get_bodypart", [rt.sv(f, "limb_req")])))) {
		return 1;
	}
	rt.callName(f, rt.gv(f, "mutations", rt.fv(f, "dna", live(owner))), "Add", [live(f.src)]);
	if (truthy(rt.sv(f, "text_gain_indication"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(owner), rt.sv(f, "text_gain_indication")]);
	}
	if (!truthy(rt.len(f, rt.sv(f, "visual_indicators")))) return f.dot;
	mut_overlay = rt.list(rt.callSrc(f, "get_visual_indicator", [live(owner)]));
	if (truthy(rt.index(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used")))) {
		mut_overlay = rt.index(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used"));
		(mut_overlay = rt.modify(live(mut_overlay), rt.callSrc(f, "get_visual_indicator", [live(owner)]), rt.bitOr));
	}
	rt.callName(f, live(owner), "remove_overlay", [rt.sv(f, "layer_used")]);
	rt.setAt(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used"), live(mut_overlay));
	rt.callName(f, live(owner), "apply_overlay", [rt.sv(f, "layer_used")]);
	return f.dot;
});

// /datum/mutation/human/proc/on_losing  (code/datums/mutations.dm:95)
rt.def("/datum/mutation/human/proc/on_losing", function on_losing(f: Frame, owner: Value) {
	let mut_overlay: Value = null;
	f.vars = () => [mut_overlay];
	if (((truthy(live(owner)) && truthy((rt.istype(live(owner), T("/mob/living/carbon/human")) ? 1 : 0))) && truthy(rt.callName(f, rt.gv(f, "mutations", rt.fv(f, "dna", live(owner))), "Remove", [live(f.src)])))) {
		if ((truthy(rt.sv(f, "text_lose_indication")) && !isEqual(rt.fv(f, "stat", live(owner)), 2))) {
			rt.call(f, P("/proc/to_chat"), null, [live(owner), rt.sv(f, "text_lose_indication")]);
		}
		if (truthy(rt.len(f, rt.sv(f, "visual_indicators")))) {
			mut_overlay = rt.list();
			if (truthy(rt.index(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used")))) {
				mut_overlay = rt.index(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used"));
			}
			rt.callName(f, live(owner), "remove_overlay", [rt.sv(f, "layer_used")]);
			rt.callName(f, live(mut_overlay), "Remove", [rt.callSrc(f, "get_visual_indicator", [live(owner)])]);
			rt.setAt(rt.fv(f, "overlays_standing", live(owner)), rt.sv(f, "layer_used"), live(mut_overlay));
			rt.callName(f, live(owner), "apply_overlay", [rt.sv(f, "layer_used")]);
		}
		return 0;
	}
	return 1;
});

// /datum/mutation/human/proc/get_spans  (code/datums/mutations.dm:114)
rt.def("/datum/mutation/human/proc/get_spans", function get_spans(f: Frame) {
	return rt.list();
});

rt.type(590, "/datum/mutation/human/hulk", "/datum/mutation/human", {
	name: "Hulk",
	quality: 1,
	get_chance: 15,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>Your muscles hurt!</span>",
	species_allowed: null,
	health_req: 25,
});

// /datum/mutation/human/hulk/proc/<init>  (code/datums/mutations.dm:123)
rt.def("/datum/mutation/human/hulk/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "species_allowed", rt.list("human"));
	return f.dot;
});

// /datum/mutation/human/hulk/proc/on_acquiring  (code/datums/mutations.dm:127)  may sleep
rt.def("/datum/mutation/human/hulk/proc/on_acquiring", function* on_acquiring(f: Frame) {
	let status: Value = null;
	f.vars = () => [status];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	status = 15;
	(rt.modField(f, live(f.args[0]), "status_flags", rt.op(f, "BitNot", [], [live(status)]), rt.bitAnd));
	yield* g.callName(f, live(f.args[0]), "update_body_parts", []);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/hulk/proc/on_attack_hand  (code/datums/mutations.dm:135)  may sleep
rt.def("/datum/mutation/human/hulk/proc/on_attack_hand", function* on_attack_hand(f: Frame, owner: Value, target: Value, proximity: Value) {
	f.vars = () => [owner, target, proximity];
	if (!truthy(live(proximity))) return f.dot;
	return (yield* g.callName(f, live(target), "attack_hulk", [live(owner)]));
}, true);

// /datum/mutation/human/hulk/proc/on_life  (code/datums/mutations.dm:138)  may sleep
rt.def("/datum/mutation/human/hulk/proc/on_life", function* on_life(f: Frame, owner: Value) {
	f.vars = () => [owner];
	if (!rt.lt(rt.fv(f, "health", live(owner)), 0)) return f.dot;
	yield* g.srcCall(f, "on_losing", live(owner));
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='danger'>You suddenly feel very weak.</span>"]);
	return f.dot;
}, true);

// /datum/mutation/human/hulk/proc/on_losing  (code/datums/mutations.dm:143)  may sleep
rt.def("/datum/mutation/human/hulk/proc/on_losing", function* on_losing(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "status_flags", 15, rt.bitOr));
	yield* g.callName(f, live(f.args[0]), "update_body_parts", []);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/hulk/proc/say_mod  (code/datums/mutations.dm:150)
rt.def("/datum/mutation/human/hulk/proc/say_mod", function say_mod(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(live(message))) {
		message = fmt("＀!!", [rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/replacetext"), null, [live(message), ".", "!"])])]);
	}
	return live(message);
});

rt.type(591, "/datum/mutation/human/telekinesis", "/datum/mutation/human", {
	name: "Telekinesis",
	quality: 1,
	get_chance: 20,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>You feel smarter!</span>",
	limb_req: "head",
});

// /datum/mutation/human/telekinesis/proc/New  (code/datums/mutations.dm:163)
rt.def("/datum/mutation/human/telekinesis/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "visual_indicators", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/genetics.dmi"), "telekinesishead", -26]), rt.bitOr));
	return f.dot;
});

// /datum/mutation/human/telekinesis/proc/get_visual_indicator  (code/datums/mutations.dm:167)
rt.def("/datum/mutation/human/telekinesis/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(rt.sv(f, "visual_indicators"), 1);
});

// /datum/mutation/human/telekinesis/proc/on_ranged_attack  (code/datums/mutations.dm:170)  may sleep
rt.def("/datum/mutation/human/telekinesis/proc/on_ranged_attack", function* on_ranged_attack(f: Frame, owner: Value, target: Value) {
	f.vars = () => [owner, target];
	yield* g.callName(f, live(target), "attack_tk", [live(owner)]);
	return f.dot;
}, true);

rt.type(592, "/datum/mutation/human/cold_resistance", "/datum/mutation/human", {
	name: "Cold Resistance",
	quality: 1,
	get_chance: 25,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>Your body feels warm!</span>",
	time_coeff: 5,
});

// /datum/mutation/human/cold_resistance/proc/New  (code/datums/mutations.dm:182)
rt.def("/datum/mutation/human/cold_resistance/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "visual_indicators", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/genetics.dmi"), "fire", -26]), rt.bitOr));
	return f.dot;
});

// /datum/mutation/human/cold_resistance/proc/get_visual_indicator  (code/datums/mutations.dm:186)
rt.def("/datum/mutation/human/cold_resistance/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(rt.sv(f, "visual_indicators"), 1);
});

// /datum/mutation/human/cold_resistance/proc/on_life  (code/datums/mutations.dm:189)  may sleep
rt.def("/datum/mutation/human/cold_resistance/proc/on_life", function* on_life(f: Frame, owner: Value) {
	f.vars = () => [owner];
	if (!truthy((yield* g.callName(f, live(owner), "getFireLoss", [])))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	yield* g.callName(f, live(owner), "heal_bodypart_damage", [0, 1]);
	return f.dot;
}, true);

rt.type(593, "/datum/mutation/human/x_ray", "/datum/mutation/human", {
	name: "X Ray Vision",
	quality: 1,
	get_chance: 25,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>The walls suddenly disappear!</span>",
	time_coeff: 2,
});

// /datum/mutation/human/x_ray/proc/on_acquiring  (code/datums/mutations.dm:203)  may sleep
rt.def("/datum/mutation/human/x_ray/proc/on_acquiring", function* on_acquiring(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "update_sight", []);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/x_ray/proc/on_losing  (code/datums/mutations.dm:209)  may sleep
rt.def("/datum/mutation/human/x_ray/proc/on_losing", function* on_losing(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "update_sight", []);
	return f.dot;
}, true, { args: ["owner"] });

rt.type(594, "/datum/mutation/human/nearsight", "/datum/mutation/human", {
	name: "Near Sightness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You can't see very well.</span>",
});

// /datum/mutation/human/nearsight/proc/on_acquiring  (code/datums/mutations.dm:220)  may sleep
rt.def("/datum/mutation/human/nearsight/proc/on_acquiring", function* on_acquiring(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "become_nearsighted", []);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/nearsight/proc/on_losing  (code/datums/mutations.dm:225)  may sleep
rt.def("/datum/mutation/human/nearsight/proc/on_losing", function* on_losing(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "cure_nearsighted", []);
	return f.dot;
}, true, { args: ["owner"] });

rt.type(595, "/datum/mutation/human/epilepsy", "/datum/mutation/human", {
	name: "Epilepsy",
	quality: 2,
	text_gain_indication: "<span class='danger'>You get a headache.</span>",
});

// /datum/mutation/human/epilepsy/proc/on_life  (code/datums/mutations.dm:236)  may sleep
rt.def("/datum/mutation/human/epilepsy/proc/on_life", function* on_life(f: Frame, owner: Value) {
	f.vars = () => [owner];
	if (!(truthy(rt.op(f, "Prob", [], [1])) && isEqual(rt.fv(f, "stat", live(owner)), 0))) return f.dot;
	yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ starts having a seizure!</span>", [live(owner)]), "<span class='userdanger'>You have a seizure!</span>"]);
	yield* g.callName(f, live(owner), "Unconscious", [200]);
	yield* g.callName(f, live(owner), "Jitter", [1000]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/mutation/human/epilepsy/proc/jitter_less"), live(owner)])), 90]);
	return f.dot;
}, true);

// /datum/mutation/human/epilepsy/proc/jitter_less  (code/datums/mutations.dm:244)
rt.def("/datum/mutation/human/epilepsy/proc/jitter_less", function jitter_less(f: Frame, owner: Value) {
	if (!truthy(live(owner))) return f.dot;
	rt.setFv(f, "jitteriness", live(owner), 10);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

rt.type(596, "/datum/mutation/human/bad_dna", "/datum/mutation/human", {
	name: "Unstable DNA",
	quality: 2,
	text_gain_indication: "<span class='danger'>You feel strange.</span>",
});

// /datum/mutation/human/bad_dna/proc/on_acquiring  (code/datums/mutations.dm:252)  may sleep
rt.def("/datum/mutation/human/bad_dna/proc/on_acquiring", function* on_acquiring(f: Frame, owner: Value) {
	let new_mob: Value = null;
	f.vars = () => [owner, new_mob];
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), rt.sv(f, "text_gain_indication")]);
	new_mob = null;
	if (truthy(rt.op(f, "Prob", [], [95]))) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			new_mob = (yield* g.callName(f, live(owner), "randmutb", []));
		} else {
			new_mob = (yield* g.callName(f, live(owner), "randmuti", []));
		}
	} else {
		new_mob = (yield* g.callName(f, live(owner), "randmutg", []));
	}
	if ((truthy(live(new_mob)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(new_mob)]))))) {
		owner = live(new_mob);
	}
	f.dot = live(owner);
	yield* g.srcCall(f, "on_losing", live(owner));
	return f.dot;
}, true);

rt.type(597, "/datum/mutation/human/cough", "/datum/mutation/human", {
	name: "Cough",
	quality: 3,
	text_gain_indication: "<span class='danger'>You start coughing.</span>",
});

// /datum/mutation/human/cough/proc/on_life  (code/datums/mutations.dm:272)  may sleep
rt.def("/datum/mutation/human/cough/proc/on_life", function* on_life(f: Frame, owner: Value) {
	f.vars = () => [owner];
	if (!(truthy(rt.op(f, "Prob", [], [5])) && isEqual(rt.fv(f, "stat", live(owner)), 0))) return f.dot;
	yield* g.callName(f, live(owner), "drop_item", []);
	yield* g.callName(f, live(owner), "emote", ["cough"]);
	return f.dot;
}, true);

rt.type(598, "/datum/mutation/human/dwarfism", "/datum/mutation/human", {
	name: "Dwarfism",
	quality: 1,
	get_chance: 15,
	lowest_value: 3072,
});

// /datum/mutation/human/dwarfism/proc/on_acquiring  (code/datums/mutations.dm:283)
rt.def("/datum/mutation/human/dwarfism/proc/on_acquiring", function on_acquiring(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.setFv(f, "resize", live(f.args[0]), 0.800000011920929);
	rt.callName(f, live(f.args[0]), "update_transform", []);
	(rt.modField(f, live(f.args[0]), "pass_flags", 1, rt.bitOr));
	rt.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ suddenly shrinks!</span>", [live(f.args[0])]), "<span class='notice'>Everything around you seems to grow..</span>"]);
	return f.dot;
}, false, { args: ["owner"] });

// /datum/mutation/human/dwarfism/proc/on_losing  (code/datums/mutations.dm:291)
rt.def("/datum/mutation/human/dwarfism/proc/on_losing", function on_losing(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.setFv(f, "resize", live(f.args[0]), 1.25);
	rt.callName(f, live(f.args[0]), "update_transform", []);
	(rt.modField(f, live(f.args[0]), "pass_flags", 16777214, rt.bitAnd));
	rt.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ suddenly grows!</span>", [live(f.args[0])]), "<span class='notice'>Everything around you seems to shrink..</span>"]);
	return f.dot;
}, false, { args: ["owner"] });

rt.type(599, "/datum/mutation/human/clumsy", "/datum/mutation/human", {
	name: "Clumsiness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You feel lightheaded.</span>",
});

// /datum/mutation/human/clumsy/proc/on_acquiring  (code/datums/mutations.dm:305)
rt.def("/datum/mutation/human/clumsy/proc/on_acquiring", function on_acquiring(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 256, rt.bitOr));
	return f.dot;
}, false, { args: ["owner"] });

// /datum/mutation/human/clumsy/proc/on_losing  (code/datums/mutations.dm:310)
rt.def("/datum/mutation/human/clumsy/proc/on_losing", function on_losing(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 16776959, rt.bitAnd));
	return f.dot;
}, false, { args: ["owner"] });

rt.type(600, "/datum/mutation/human/tourettes", "/datum/mutation/human", {
	name: "Tourettes Syndrome",
	quality: 2,
	text_gain_indication: "<span class='danger'>You twitch.</span>",
});

// /datum/mutation/human/tourettes/proc/on_life  (code/datums/mutations.dm:320)  may sleep
rt.def("/datum/mutation/human/tourettes/proc/on_life", function* on_life(f: Frame, owner: Value) {
	let x_offset_old: Value = null, y_offset_old: Value = null, x_offset: Value = null, y_offset: Value = null;
	let $0: any, $1: any;
	f.vars = () => [owner, x_offset_old, y_offset_old, x_offset, y_offset, $0, $1];
	if (!(truthy(rt.op(f, "Prob", [], [10])) && isEqual(rt.fv(f, "stat", live(owner)), 0))) return f.dot;
	yield* g.callName(f, live(owner), "Stun", [200]);
	$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	if ($0 === 1) {
		yield* g.callName(f, live(owner), "emote", ["twitch"]);
	} else if (rt.inRange($0, 2, 3)) {
		$0 = live(owner);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$1 = ";";
		} else {
			$1 = "";
		}
		yield* g.callName(f, $0, "say", [fmt("＀＀", [$1, rt.op(f, "PickUnweighted", [7], ["SHIT", "PISS", "FUCK", "CUNT", "COCKSUCKER", "MOTHERFUCKER", "TITS"])])]);
	}
	x_offset_old = rt.fv(f, "pixel_x", live(owner));
	y_offset_old = rt.fv(f, "pixel_y", live(owner));
	x_offset = add(rt.fv(f, "pixel_x", live(owner)), (yield* g.call(f, P("/proc/rand"), null, [-2, 2])));
	y_offset = add(rt.fv(f, "pixel_y", live(owner)), (yield* g.call(f, P("/proc/rand"), null, [-1, 1])));
	rt.op(f, "Animate", [2, 8], [null, live(owner), "pixel_x", live(x_offset), "pixel_y", live(y_offset), "time", 1]);
	rt.op(f, "Animate", [2, 8], [null, live(owner), "pixel_x", live(x_offset_old), "pixel_y", live(y_offset_old), "time", 1]);
	return f.dot;
}, true);

rt.type(601, "/datum/mutation/human/nervousness", "/datum/mutation/human", {
	name: "Nervousness",
	quality: 3,
	text_gain_indication: "<span class='danger'>You feel nervous.</span>",
});

// /datum/mutation/human/nervousness/proc/on_life  (code/datums/mutations.dm:340)
rt.def("/datum/mutation/human/nervousness/proc/on_life", function on_life(f: Frame, owner: Value) {
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	rt.setFv(f, "stuttering", live(owner), rt.call(f, P("/proc/max"), null, [10, rt.fv(f, "stuttering", live(owner))]));
	return f.dot;
});

rt.type(602, "/datum/mutation/human/deaf", "/datum/mutation/human", {
	name: "Deafness",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to hear anything.</span>",
});

// /datum/mutation/human/deaf/proc/on_acquiring  (code/datums/mutations.dm:349)
rt.def("/datum/mutation/human/deaf/proc/on_acquiring", function on_acquiring(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 4, rt.bitOr));
	return f.dot;
}, false, { args: ["owner"] });

// /datum/mutation/human/deaf/proc/on_losing  (code/datums/mutations.dm:354)
rt.def("/datum/mutation/human/deaf/proc/on_losing", function on_losing(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 16777211, rt.bitAnd));
	return f.dot;
}, false, { args: ["owner"] });

rt.type(603, "/datum/mutation/human/blind", "/datum/mutation/human", {
	name: "Blindness",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to see anything.</span>",
});

// /datum/mutation/human/blind/proc/on_acquiring  (code/datums/mutations.dm:364)  may sleep
rt.def("/datum/mutation/human/blind/proc/on_acquiring", function* on_acquiring(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "become_blind", []);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/blind/proc/on_losing  (code/datums/mutations.dm:369)  may sleep
rt.def("/datum/mutation/human/blind/proc/on_losing", function* on_losing(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "cure_blind", []);
	return f.dot;
}, true, { args: ["owner"] });

rt.type(604, "/datum/mutation/human/race", "/datum/mutation/human", {
	name: "Monkified",
	quality: 2,
	time_coeff: 2,
});

// /datum/mutation/human/race/proc/on_acquiring  (code/datums/mutations.dm:380)  may sleep
rt.def("/datum/mutation/human/race/proc/on_acquiring", function* on_acquiring(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callName(f, live(f.args[0]), "monkeyize", [311]));
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/race/proc/on_losing  (code/datums/mutations.dm:385)  may sleep
rt.def("/datum/mutation/human/race/proc/on_losing", function* on_losing(f: Frame, owner: Value) {
	f.vars = () => [owner];
	if (!(((truthy(live(owner)) && truthy((rt.istype(live(owner), T("/mob/living/carbon/monkey")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", live(owner)), 2)) && truthy((yield* g.callName(f, rt.gv(f, "mutations", rt.fv(f, "dna", live(owner))), "Remove", [live(f.src)]))))) return f.dot;
	f.dot = (yield* g.callName(f, live(owner), "humanize", [311]));
	return f.dot;
}, true);

rt.type(605, "/datum/mutation/human/chameleon", "/datum/mutation/human", {
	name: "Chameleon",
	quality: 1,
	get_chance: 20,
	lowest_value: 3072,
	text_gain_indication: "<span class='notice'>You feel one with your surroundings.</span>",
	text_lose_indication: "<span class='notice'>You feel oddly exposed.</span>",
	time_coeff: 5,
});

// /datum/mutation/human/chameleon/proc/on_acquiring  (code/datums/mutations.dm:398)
rt.def("/datum/mutation/human/chameleon/proc/on_acquiring", function on_acquiring(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.setFv(f, "alpha", live(f.args[0]), 204);
	return f.dot;
}, false, { args: ["owner"] });

// /datum/mutation/human/chameleon/proc/on_life  (code/datums/mutations.dm:403)
rt.def("/datum/mutation/human/chameleon/proc/on_life", function on_life(f: Frame, owner: Value) {
	rt.setFv(f, "alpha", live(owner), rt.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "alpha", live(owner)), 25)]));
	return f.dot;
});

// /datum/mutation/human/chameleon/proc/on_move  (code/datums/mutations.dm:406)
rt.def("/datum/mutation/human/chameleon/proc/on_move", function on_move(f: Frame, owner: Value) {
	rt.setFv(f, "alpha", live(owner), 204);
	return f.dot;
});

// /datum/mutation/human/chameleon/proc/on_attack_hand  (code/datums/mutations.dm:410)
rt.def("/datum/mutation/human/chameleon/proc/on_attack_hand", function on_attack_hand(f: Frame, owner: Value, target: Value, proximity: Value) {
	if (!truthy(live(proximity))) return f.dot;
	rt.setFv(f, "alpha", live(owner), 204);
	return live(f.dot);
});

// /datum/mutation/human/chameleon/proc/on_losing  (code/datums/mutations.dm:414)
rt.def("/datum/mutation/human/chameleon/proc/on_losing", function on_losing(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	rt.setFv(f, "alpha", live(f.args[0]), 255);
	return f.dot;
}, false, { args: ["owner"] });

rt.type(606, "/datum/mutation/human/wacky", "/datum/mutation/human", {
	name: "Wacky",
	quality: 3,
	text_gain_indication: "<span class='sans'>You feel an off sensation in your voicebox.</span>",
	text_lose_indication: "<span class='notice'>The off sensation passes.</span>",
});

// /datum/mutation/human/wacky/proc/get_spans  (code/datums/mutations.dm:425)
rt.def("/datum/mutation/human/wacky/proc/get_spans", function get_spans(f: Frame) {
	return rt.list("sans");
});

rt.type(607, "/datum/mutation/human/mute", "/datum/mutation/human", {
	name: "Mute",
	quality: 2,
	text_gain_indication: "<span class='danger'>You feel unable to express yourself at all.</span>",
	text_lose_indication: "<span class='danger'>You feel able to speak freely again.</span>",
});

// /datum/mutation/human/mute/proc/on_acquiring  (code/datums/mutations.dm:434)
rt.def("/datum/mutation/human/mute/proc/on_acquiring", function on_acquiring(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 2, rt.bitOr));
	return f.dot;
}, false, { args: ["owner"] });

// /datum/mutation/human/mute/proc/on_losing  (code/datums/mutations.dm:439)
rt.def("/datum/mutation/human/mute/proc/on_losing", function on_losing(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[0]), "disabilities", 16777213, rt.bitAnd));
	return f.dot;
}, false, { args: ["owner"] });

rt.type(608, "/datum/mutation/human/smile", "/datum/mutation/human", {
	name: "Smile",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel so happy. Nothing can be wrong with anything. :)</span>",
	text_lose_indication: "<span class='notice'>Everything is terrible again. :(</span>",
});

// /datum/mutation/human/smile/proc/say_mod  (code/datums/mutations.dm:452)
rt.def("/datum/mutation/human/smile/proc/say_mod", function say_mod(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(live(message))) {
		message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = fmt(" ＀ ", [live(message)])), " stupid ", " smart "])), " retard ", " genius "])), " unrobust ", " robust "])), " dumb ", " smart "])), " awful ", " great "])), " gay ", rt.op(f, "PickUnweighted", [3], [" nice ", " ok ", " alright "])])), " horrible ", " fun "])), " terrible ", " terribly fun "])), " terrifying ", " wonderful "])), " gross ", " cool "])), " disgusting ", " amazing "])), " loser ", " winner "])), " useless ", " useful "])), " oh god ", " cheese and crackers "])), " jesus ", " gee wiz "])), " weak ", " strong "])), " kill ", " hug "])), " murder ", " tease "])), " ugly ", " beautiful "])), " douchbag ", " nice guy "])), " whore ", " lady "])), " nerd ", " smart guy "])), " moron ", " fun person "])), " IT'S LOOSE ", " EVERYTHING IS FINE "])), " sex ", " hug fight "])), " idiot ", " genius "])), " fat ", " thin "])), " beer ", " water with ice "])), " drink ", " water "])), " feminist ", " empowered woman "])), " i hate you ", " you're mean "])), " nigger ", " african american "])), " jew ", " jewish "])), " shit ", " shiz "])), " crap ", " poo "])), " slut ", " tease "])), " ass ", " butt "])), " damn ", " dang "])), " fuck ", "  "])), " penis ", " privates "])), " cunt ", " privates "])), " dick ", " jerk "])), " vagina ", " privates "]);
	}
	return rt.call(f, P("/proc/trim"), null, [live(message)]);
});

rt.type(609, "/datum/mutation/human/unintelligable", "/datum/mutation/human", {
	name: "Unintelligable",
	quality: 2,
	text_gain_indication: "<span class='danger'>You can't seem to form any coherent thoughts!</span>",
	text_lose_indication: "<span class='danger'>Your mind feels more clear.</span>",
});

// /datum/mutation/human/unintelligable/proc/say_mod  (code/datums/mutations.dm:507)
rt.def("/datum/mutation/human/unintelligable/proc/say_mod", function say_mod(f: Frame, message: Value) {
	let prefix: Value = null, words: Value = null, rearranged: Value = null, i: Value = null, cword: Value = null, suffix: Value = null;
	f.vars = () => [message, prefix, words, rearranged, i, cword, suffix];
	if (truthy(live(message))) {
		if (isEqual((prefix = rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2])), ";")) {
			message = rt.call(f, P("/proc/copytext"), null, [live(message), 2]);
		} else {
			if (truthy((rt.isIn(f, live(prefix), rt.list(":", "#")) ? 1 : 0))) {
				prefix = rt.modify(live(prefix), rt.call(f, P("/proc/copytext"), null, [live(message), 2, 3]), add);
				message = rt.call(f, P("/proc/copytext"), null, [live(message), 3]);
			} else {
				prefix = "";
			}
		}
		words = rt.call(f, P("/proc/splittext"), null, [live(message), " "]);
		rearranged = rt.list();
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, live(words)))) {
			cword = rt.op(f, "PickUnweighted", [1], [live(words)]);
			rt.callName(f, live(words), "Remove", [live(cword)]);
			suffix = rt.call(f, P("/proc/copytext"), null, [live(cword), subtract(rt.length(live(cword)), 1), rt.length(live(cword))]);
			while (truthy((rt.isIn(f, ((rt.gt(rt.length(live(cword)), 0) ? 1 : 0) && live(suffix)), rt.list(".", ",", ";", "!", ":", "?")) ? 1 : 0))) {
				suffix = rt.call(f, P("/proc/copytext"), null, [(cword = rt.call(f, P("/proc/copytext"), null, [live(cword), 1, subtract(rt.length(live(cword)), 1)])), subtract(rt.length(live(cword)), 1), rt.length(live(cword))]);
			}
			if (truthy(rt.length(live(cword)))) {
				rearranged = rt.modify(live(rearranged), live(cword), add);
			}
			i = rt.inc(live(i), 1);
		}
		message = fmt("＀＀!!", [live(prefix), rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/jointext"), null, [live(rearranged), " "])])]);
	}
	return live(message);
});

rt.type(610, "/datum/mutation/human/swedish", "/datum/mutation/human", {
	name: "Swedish",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel Swedish, however that works.</span>",
	text_lose_indication: "<span class='notice'>The feeling of Swedishness passes.</span>",
});

// /datum/mutation/human/swedish/proc/say_mod  (code/datums/mutations.dm:539)
rt.def("/datum/mutation/human/swedish/proc/say_mod", function say_mod(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(live(message))) {
		message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [live(message), "w", "v"])), "j", "y"])), "a", rt.op(f, "PickUnweighted", [4], ["�", "�", "�", "a"])])), "bo", "bjo"])), "o", rt.op(f, "PickUnweighted", [3], ["�", "�", "o"])]);
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			message = rt.modify(live(message), fmt(" Bork＀!", [rt.op(f, "PickUnweighted", [3], ["", ", bork", ", bork, bork"])]), add);
		}
	}
	return live(message);
});

rt.type(611, "/datum/mutation/human/chav", "/datum/mutation/human", {
	name: "Chav",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>Ye feel like a reet prat like, innit?</span>",
	text_lose_indication: "<span class='notice'>You no longer feel like being rude and sassy.</span>",
});

// /datum/mutation/human/chav/proc/say_mod  (code/datums/mutations.dm:557)
rt.def("/datum/mutation/human/chav/proc/say_mod", function say_mod(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(live(message))) {
		message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = fmt(" ＀ ", [live(message)])), " looking at  ", "  gawpin' at "])), " great ", " bangin' "])), " man ", " mate "])), " friend ", rt.op(f, "PickUnweighted", [3], [" mate ", " bruv ", " bledrin "])])), " what ", " wot "])), " drink ", " wet "])), " get ", " giz "])), " what ", " wot "])), " no thanks ", " wuddent fukken do one "])), " i don't know ", " wot mate "])), " no ", " naw "])), " robust ", " chin "])), "  hi  ", " how what how "])), " hello ", " sup bruv "])), " kill ", " bang "])), " murder ", " bang "])), " windows ", " windies "])), " window ", " windy "])), " break ", " do "])), " your ", " yer "])), " security ", " coppers "]);
	}
	return rt.call(f, P("/proc/trim"), null, [live(message)]);
});

rt.type(612, "/datum/mutation/human/elvis", "/datum/mutation/human", {
	name: "Elvis",
	quality: 3,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel pretty good, honeydoll.</span>",
	text_lose_indication: "<span class='notice'>You feel a little less conversation would be great.</span>",
});

// /datum/mutation/human/elvis/proc/on_life  (code/datums/mutations.dm:589)
rt.def("/datum/mutation/human/elvis/proc/on_life", function on_life(f: Frame, owner: Value) {
	let dancetypes: Value = null, dancemoves: Value = null;
	let $0: any;
	f.vars = () => [dancetypes, dancemoves, $0];
	$0 = rt.op(f, "PickUnweighted", [2], [1, 2]);
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			dancetypes = rt.list("swinging", "fancy", "stylish", "20'th century", "jivin'", "rock and roller", "cool", "salacious", "bashing", "smashing");
			dancemoves = rt.op(f, "PickUnweighted", [1], [live(dancetypes)]);
			rt.callName(f, live(owner), "visible_message", [fmt("<b>＀</b> busts out some ＀ moves!", [live(owner), live(dancemoves)])]);
		}
	} else if ($0 === 2) {
		if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
		rt.callName(f, live(owner), "visible_message", [fmt("<b>＀</b> ＀!", [live(owner), rt.op(f, "PickUnweighted", [7], ["jiggles their hips", "rotates their hips", "gyrates their hips", "taps their foot", "dances to an imaginary song", "jiggles their legs", "snaps their fingers"])])]);
	}
	return f.dot;
});

// /datum/mutation/human/elvis/proc/say_mod  (code/datums/mutations.dm:601)
rt.def("/datum/mutation/human/elvis/proc/say_mod", function say_mod(f: Frame, message: Value) {
	f.vars = () => [message];
	if (truthy(live(message))) {
		message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = fmt(" ＀ ", [live(message)])), " i'm not ", " I aint "])), " girl ", rt.op(f, "PickUnweighted", [3], [" honey ", " baby ", " baby doll "])])), " man ", rt.op(f, "PickUnweighted", [5], [" son ", " buddy ", " brother", " pal ", " friendo "])])), " out of ", " outta "])), " thank you ", " thank you, thank you very much "])), " what are you ", " whatcha "])), " yes ", rt.op(f, "PickUnweighted", [2], [" sure", "yea "])])), " faggot ", " square "])), " muh valids ", " getting my kicks "]);
	}
	return rt.call(f, P("/proc/trim"), null, [live(message)]);
});

rt.type(613, "/datum/mutation/human/stoner", "/datum/mutation/human", {
	name: "Stoner",
	quality: 2,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel...totally chill, man!</span>",
	text_lose_indication: "<span class='notice'>You feel like you have a better sense of time.</span>",
});

// /datum/mutation/human/stoner/proc/on_acquiring  (code/datums/mutations.dm:621)  may sleep
rt.def("/datum/mutation/human/stoner/proc/on_acquiring", function* on_acquiring(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "grant_language", [T("/datum/language/beachbum")]);
	yield* g.callName(f, live(f.args[0]), "remove_language", [T("/datum/language/common")]);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/mutation/human/stoner/proc/on_losing  (code/datums/mutations.dm:626)  may sleep
rt.def("/datum/mutation/human/stoner/proc/on_losing", function* on_losing(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "grant_language", [T("/datum/language/common")]);
	yield* g.callName(f, live(f.args[0]), "remove_language", [T("/datum/language/beachbum")]);
	return f.dot;
}, true, { args: ["owner"] });

rt.type(614, "/datum/mutation/human/laser_eyes", "/datum/mutation/human", {
	name: "Laser Eyes",
	quality: 1,
	dna_block: -1,
	text_gain_indication: "<span class='notice'>You feel pressure building up behind your eyes.</span>",
	layer_used: 21,
	limb_req: "head",
});

// /datum/mutation/human/laser_eyes/proc/New  (code/datums/mutations.dm:639)
rt.def("/datum/mutation/human/laser_eyes/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "visual_indicators", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/genetics.dmi"), "lasereyes", -21]), rt.bitOr));
	return f.dot;
});

// /datum/mutation/human/laser_eyes/proc/get_visual_indicator  (code/datums/mutations.dm:643)
rt.def("/datum/mutation/human/laser_eyes/proc/get_visual_indicator", function get_visual_indicator(f: Frame, owner: Value) {
	return rt.index(rt.sv(f, "visual_indicators"), 1);
});

// /datum/mutation/human/laser_eyes/proc/on_ranged_attack  (code/datums/mutations.dm:646)  may sleep
rt.def("/datum/mutation/human/laser_eyes/proc/on_ranged_attack", function* on_ranged_attack(f: Frame, owner: Value, target: Value) {
	f.vars = () => [owner, target];
	if (!isEqual(rt.fv(f, "a_intent", live(owner)), "harm")) return f.dot;
	yield* g.callName(f, live(owner), "LaserEyes", [live(target)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/update_mutations_overlay  (code/datums/mutations.dm:654)  may sleep
rt.def("/mob/living/carbon/human/proc/update_mutations_overlay", function* update_mutations_overlay(f: Frame) {
	let CM: Value = null, mut_overlay: Value = null, V: Value = null, MA: Value = null;
	let $e: any;
	f.vars = () => [CM, mut_overlay, V, MA, $e];
	CM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		CM = $e;
		if ((truthy(rt.getLen(f, rt.fv(f, "species_allowed", live(CM)))) && !truthy((yield* g.callName(f, rt.fv(f, "species_allowed", live(CM)), "Find", [rt.gv(f, "id", rt.fv(f, "species", rt.sv(f, "dna")))]))))) {
			yield* g.callName(f, live(CM), "force_lose", [live(f.src)]);
			continue;
		}
		if (truthy(rt.getLen(f, rt.fv(f, "visual_indicators", live(CM))))) {
			mut_overlay = rt.list();
			if (truthy(rt.index(rt.sv(f, "overlays_standing"), rt.fv(f, "layer_used", live(CM))))) {
				mut_overlay = rt.index(rt.sv(f, "overlays_standing"), rt.fv(f, "layer_used", live(CM)));
			}
			V = (yield* g.callName(f, live(CM), "get_visual_indicator", [live(f.src)]));
			if (!truthy((yield* g.callName(f, live(mut_overlay), "Find", [live(V)])))) {
				yield* g.srcCall(f, "remove_overlay", rt.fv(f, "layer_used", live(CM)));
				MA = null;
				rt.forList(f, 1, rt.fv(f, "visual_indicators", live(CM)), T("/mutable_appearance"));
				while (($e = rt.next(f, 1)) !== undefined) {
					MA = $e;
					yield* g.callName(f, live(mut_overlay), "Remove", [live(MA)]);
				}
				rt.endFor(f, 1);
				(mut_overlay = rt.modify(live(mut_overlay), live(V), rt.bitOr));
				rt.setAt(rt.sv(f, "overlays_standing"), rt.fv(f, "layer_used", live(CM)), live(mut_overlay));
				yield* g.srcCall(f, "apply_overlay", rt.fv(f, "layer_used", live(CM)));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
