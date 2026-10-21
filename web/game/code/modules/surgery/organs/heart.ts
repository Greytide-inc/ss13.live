// From code/modules/surgery/organs/heart.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9440, "/obj/item/organ/heart", "/obj/item/organ", {
	beating: 1,
	icon_base: "heart",
	beat: 0,
	name: "heart",
	icon_state: "heart-on",
	zone: "chest",
	slot: "heart",
	origin_tech: "biotech=5",
	attack_verb: null,
});

// /obj/item/organ/heart/proc/update_icon  (code/modules/surgery/organs/heart.dm:15)
rt.def("/obj/item/organ/heart/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "beating"))) {
		rt.setSv(f, "icon_state", fmt("＀-on", [rt.sv(f, "icon_base")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀-off", [rt.sv(f, "icon_base")]));
	}
	return f.dot;
});

// /obj/item/organ/heart/proc/Remove  (code/modules/surgery/organs/heart.dm:20)  may sleep
rt.def("/obj/item/organ/heart/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/heart/proc/stop_if_unowned")])), 120]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/heart/proc/stop_if_unowned  (code/modules/surgery/organs/heart.dm:25)
rt.def("/obj/item/organ/heart/proc/stop_if_unowned", function stop_if_unowned(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) return f.dot;
	rt.callSrc(f, "Stop", []);
	return f.dot;
});

// /obj/item/organ/heart/proc/attack_self  (code/modules/surgery/organs/heart.dm:29)  may sleep
rt.def("/obj/item/organ/heart/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "beating"))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ squeezes ＀ to make it beat again!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You squeeze ＀ to make it beat again!</span>", [live(f.src)]));
	yield* g.srcCall(f, "Restart");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/heart/proc/stop_if_unowned")])), 80]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/organ/heart/proc/Stop  (code/modules/surgery/organs/heart.dm:39)
rt.def("/obj/item/organ/heart/proc/Stop", function Stop(f: Frame) {
	rt.setSv(f, "beating", 0);
	rt.callSrc(f, "update_icon", []);
	return 1;
});

// /obj/item/organ/heart/proc/Restart  (code/modules/surgery/organs/heart.dm:44)
rt.def("/obj/item/organ/heart/proc/Restart", function Restart(f: Frame) {
	rt.setSv(f, "beating", 1);
	rt.callSrc(f, "update_icon", []);
	return 1;
});

// /obj/item/organ/heart/proc/prepare_eat  (code/modules/surgery/organs/heart.dm:48)  may sleep
rt.def("/obj/item/organ/heart/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "icon_state", (S = (yield* g.callSuper(f, [], rt.Args.Same))), "heart-off");
	return live(S);
}, true);

// /obj/item/organ/heart/proc/on_life  (code/modules/surgery/organs/heart.dm:53)
rt.def("/obj/item/organ/heart/proc/on_life", function on_life(f: Frame) {
	let slowbeat: Value = null, fastbeat: Value = null, H: Value = null;
	f.vars = () => [slowbeat, fastbeat, H];
	if (!truthy(rt.fv(f, "client", rt.sv(f, "owner")))) return f.dot;
	slowbeat = rt.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/health/slowbeat.ogg"), "repeat", 1], rt.Args.Named);
	fastbeat = rt.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/health/fastbeat.ogg"), "repeat", 1], rt.Args.Named);
	if ((rt.le(rt.gv(f, "health", (H = rt.sv(f, "owner"))), 0) && !isEqual(rt.sv(f, "beat"), 2))) {
		rt.setSv(f, "beat", 2);
		rt.callName(f, live(H), "playsound_local", [null, rt.getStep(f, live(H), 0), null, live(slowbeat), null, 40, null, 0, "channel", 1019], rt.Args.Named);
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class = 'notice'>You feel your heart slow down...</span>"]);
	}
	if ((isEqual(rt.sv(f, "beat"), 2) && rt.gt(rt.fv(f, "health", live(H)), 0))) {
		rt.callName(f, live(H), "stop_sound_channel", [1019]);
		rt.setSv(f, "beat", 0);
	}
	if (!truthy(rt.fv(f, "jitteriness", live(H)))) return f.dot;
	if (!(!truthy(rt.sv(f, "beat")) || isEqual(rt.sv(f, "beat"), 2))) return f.dot;
	rt.callName(f, live(H), "playsound_local", [null, rt.getStep(f, live(H), 0), null, live(fastbeat), null, 40, null, 0, "channel", 1019], rt.Args.Named);
	rt.setSv(f, "beat", 1);
	return f.dot;
});

rt.type(9455, "/obj/item/organ/heart/cursed", "/obj/item/organ/heart", {
	last_pump: 0,
	add_colour: 1,
	pump_delay: 30,
	blood_loss: 100,
	heal_brute: 0,
	heal_burn: 0,
	heal_oxy: 0,
	name: "cursed heart",
	desc: "A heart that, when inserted, will force you to pump it manually.",
	icon_state: "cursedheart-off",
	icon_base: "cursedheart",
	origin_tech: "biotech=6",
	actions_types: null,
});

// /obj/item/organ/heart/cursed/proc/<init>  (code/modules/surgery/organs/heart.dm:77)
rt.def("/obj/item/organ/heart/cursed/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/organ_action/cursed_heart")));
	return f.dot;
});

// /obj/item/organ/heart/cursed/proc/attack  (code/modules/surgery/organs/heart.dm:90)  may sleep
rt.def("/obj/item/organ/heart/cursed/proc/attack", function* attack(f: Frame) {
	if ((isEqual(live(f.args[0]), live(f.args[1])) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1]);
		yield* g.callName(f, live(f.args[1]), "drop_item", []);
		yield* g.srcCall(f, "Insert", live(f.args[1]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["H", "user", "target"] });

// /obj/item/organ/heart/cursed/proc/on_life  (code/modules/surgery/organs/heart.dm:98)  may sleep
rt.def("/obj/item/organ/heart/cursed/proc/on_life", function* on_life(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!rt.gt(rt.worldTime(f), add(rt.sv(f, "last_pump"), rt.sv(f, "pump_delay")))) return f.dot;
	if ((truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.fv(f, "client", rt.sv(f, "owner"))))) {
		if ((truthy(rt.gv(f, "dna", (H = rt.sv(f, "owner")))) && !truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
			rt.setFv(f, "blood_volume", live(H), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "blood_volume", live(H)), rt.sv(f, "blood_loss")), 0])));
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class = 'userdanger'>You have to keep pumping your blood!</span>"]);
			if (truthy(rt.sv(f, "add_colour"))) {
				yield* g.callName(f, live(H), "add_client_colour", [T("/datum/client_colour/cursed_heart_blood")]);
				rt.setSv(f, "add_colour", 0);
			}
		}
	} else {
		rt.setSv(f, "last_pump", rt.worldTime(f));
	}
	return f.dot;
}, true);

// /obj/item/organ/heart/cursed/proc/Insert  (code/modules/surgery/organs/heart.dm:111)  may sleep
rt.def("/obj/item/organ/heart/cursed/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "owner"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class ='userdanger'>Your heart has been replaced with a cursed one, you have to pump this one manually otherwise you'll die!</span>"]);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(230, "/datum/action/item_action/organ_action/cursed_heart", "/datum/action/item_action/organ_action", {
	name: "Pump your blood",
});

// /datum/action/item_action/organ_action/cursed_heart/proc/Trigger  (code/modules/surgery/organs/heart.dm:120)  may sleep
rt.def("/datum/action/item_action/organ_action/cursed_heart/proc/Trigger", function* Trigger(f: Frame) {
	let cursed_heart: Value = null, H: Value = null;
	f.vars = () => [cursed_heart, H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/obj/item/organ/heart/cursed")) ? 1 : 0)))) return f.dot;
	cursed_heart = rt.sv(f, "target");
	if (rt.lt(rt.worldTime(f), add(rt.fv(f, "last_pump", live(cursed_heart)), subtract(rt.fv(f, "pump_delay", live(cursed_heart)), 10)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='userdanger'>Too soon!</span>"]);
		return live(f.dot);
	}
	rt.setFv(f, "last_pump", live(cursed_heart), rt.worldTime(f));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "owner"), rt.rsc("sound/effects/singlebeat.ogg"), 40, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class = 'notice'>Your heart beats.</span>"]);
	if (!truthy((rt.istype((H = rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.fv(f, "dna", live(H))) && !truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "blood_volume", live(H), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "blood_volume", live(H)), multiply(rt.fv(f, "blood_loss", live(cursed_heart)), 0.5)), 2000])));
	yield* g.callName(f, live(H), "remove_client_colour", [T("/datum/client_colour/cursed_heart_blood")]);
	rt.setFv(f, "add_colour", live(cursed_heart), 1);
	yield* g.callName(f, live(H), "adjustBruteLoss", [rt.neg(rt.fv(f, "heal_brute", live(cursed_heart)))]);
	yield* g.callName(f, live(H), "adjustFireLoss", [rt.neg(rt.fv(f, "heal_burn", live(cursed_heart)))]);
	yield* g.callName(f, live(H), "adjustOxyLoss", [rt.neg(rt.fv(f, "heal_oxy", live(cursed_heart)))]);
	return f.dot;
}, true);
