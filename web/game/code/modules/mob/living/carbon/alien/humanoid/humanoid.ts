// From code/modules/mob/living/carbon/alien/humanoid/humanoid.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4824, "/mob/living/carbon/alien/humanoid", "/mob/living/carbon/alien", {
	r_store: null,
	l_store: null,
	caste: "",
	alt_icon: rt.rsc("icons/mob/alienleap.dmi"),
	leap_on_click: 0,
	pounce_cooldown: 0,
	pounce_cooldown_time: 30,
	custom_pixel_x_offset: 0,
	custom_pixel_y_offset: 0,
	sneaking: 0,
	drooling: 0,
	pass_flags: 1,
	name: "alien",
	icon_state: "alien",
	butcher_results: null,
	possible_a_intents: null,
	limb_destroyer: 1,
	bodyparts: null,
});

// /mob/living/carbon/alien/humanoid/proc/<init>  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:5)
rt.def("/mob/living/carbon/alien/humanoid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 5, T("/obj/item/stack/sheet/animalhide/xeno"), 1]));
	rt.setSv(f, "possible_a_intents", rt.list("help", "disarm", "grab", "harm"));
	$0 = $0;
	rt.setSv(f, "bodyparts", rt.list(T("/obj/item/bodypart/chest/alien"), T("/obj/item/bodypart/head/alien"), T("/obj/item/bodypart/l_arm/alien"), T("/obj/item/bodypart/r_arm/alien"), T("/obj/item/bodypart/r_leg/alien"), T("/obj/item/bodypart/l_leg/alien")));
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/Initialize  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:25)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/regurgitate"), [null])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/movement_delay  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:29)
rt.def("/mob/living/carbon/alien/humanoid/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), add(add(rt.sv(f, "move_delay_add"), rt.fv(f, "alien_delay", rt.gl("config"))), rt.sv(f, "sneaking")), add);
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/restrained  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:33)
rt.def("/mob/living/carbon/alien/humanoid/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = rt.sv(f, "handcuffed");
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/show_inv  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:37)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/Topic  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:62)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1, 1])))) return f.dot;
	if (!truthy(rt.at(live(f.args[1]), "pouches"))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ tries to empty ＀'s pouches.</span>", [live(f.usr), live(f.src)]), fmt("<span class='userdanger'>＀ tries to empty ＀'s pouches.</span>", [live(f.usr), live(f.src)]));
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.usr), live(f.src), 20])))) return f.dot;
	yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "r_store"));
	yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "l_store"));
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/carbon/alien/humanoid/proc/cuff_resist  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:73)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/cuff_resist", function* cuff_resist(f: Frame, I: Value) {
	f.vars = () => [I];
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/voice/hiss5.ogg"), 40, 1, 1]);
	yield* g.callSuper(f, [null, live(I), "cuff_break", 2], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/resist_grab  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:77)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/resist_grab", function* resist_grab(f: Frame, moving_resist: Value) {
	f.vars = () => [moving_resist];
	if (truthy(rt.fv(f, "grab_state", rt.sv(f, "pulledby")))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has broken free of ＀'s grip!</span>", [live(f.src), rt.sv(f, "pulledby")]));
	}
	yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	f.dot = 0;
	return f.dot;
}, true);

// /mob/living/carbon/alien/humanoid/proc/get_standard_pixel_y_offset  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:84)
rt.def("/mob/living/carbon/alien/humanoid/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	if (truthy(rt.sv(f, "leaping"))) {
		return -32;
	} else {
		if (truthy(rt.sv(f, "custom_pixel_y_offset"))) {
			return rt.sv(f, "custom_pixel_y_offset");
		} else {
			return rt.initial(f, live(f.src), "pixel_y");
		}
	}
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/get_standard_pixel_x_offset  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:92)
rt.def("/mob/living/carbon/alien/humanoid/proc/get_standard_pixel_x_offset", function get_standard_pixel_x_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	if (truthy(rt.sv(f, "leaping"))) {
		return -32;
	} else {
		if (truthy(rt.sv(f, "custom_pixel_x_offset"))) {
			return rt.sv(f, "custom_pixel_x_offset");
		} else {
			return rt.initial(f, live(f.src), "pixel_x");
		}
	}
	return f.dot;
});

// /mob/living/carbon/alien/humanoid/proc/alien_evolve  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:102)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/alien_evolve", function* alien_evolve(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	yield* g.srcCall(f, "drop_all_held_items");
	A = null;
	rt.forList(f, 0, rt.sv(f, "stomach_contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, rt.sv(f, "stomach_contents"), "Remove", [live(A)]);
		yield* g.callName(f, rt.fv(f, "stomach_contents", live(f.args[0])), "Add", [live(A)]);
		rt.setFv(f, "loc", live(A), live(f.args[0]));
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["new_xeno"] });

// /proc/get_alien_type  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:111)
rt.def("/proc/get_alien_type", function get_alien_type(f: Frame, alienpath: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/alien/humanoid"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.op(f, "IsType", [], [live(A), live(alienpath)]))) {
			continue;
		}
		if ((!truthy(rt.fv(f, "key", live(A))) || isEqual(rt.fv(f, "stat", live(A)), 2))) {
			continue;
		}
		return live(A);
	}
	rt.endFor(f, 0);
	return 0;
});

// /mob/living/carbon/alien/humanoid/proc/check_breath  (code/modules/mob/living/carbon/alien/humanoid/humanoid.dm:121)  may sleep
rt.def("/mob/living/carbon/alien/humanoid/proc/check_breath", function* check_breath(f: Frame) {
	if (((truthy(live(f.args[0])) && rt.gt((yield* g.callName(f, live(f.args[0]), "total_moles", [])), 0)) && !truthy(rt.sv(f, "sneaking")))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/voice/lowHiss2.ogg"), rt.rsc("sound/voice/lowHiss3.ogg"), rt.rsc("sound/voice/lowHiss4.ogg")]), 50, 0, -5]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["breath"] });
