// From code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7994, "/obj/item/clothing/head/helmet/clockwork", "/obj/item/clothing/head/helmet", {
	name: "clockwork helmet",
	desc: "A heavy helmet made of brass.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_helmet",
	w_class: 3,
	resistance_flags: 34,
	armor: null,
});

// /obj/item/clothing/head/helmet/clockwork/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:9)
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/head/helmet/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:12)  may sleep
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ratvar_act");
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/head/helmet/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:17)  may sleep
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/head/helmet/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:22)
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 1, rt.bitOr));
		rt.setSv(f, "max_heat_protection_temperature", 35000);
		rt.setSv(f, "min_cold_protection_temperature", 2);
	} else {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		rt.setSv(f, "max_heat_protection_temperature", rt.initial(f, live(f.src), "max_heat_protection_temperature"));
		rt.setSv(f, "min_cold_protection_temperature", rt.initial(f, live(f.src), "min_cold_protection_temperature"));
	}
	return f.dot;
});

// /obj/item/clothing/head/helmet/clockwork/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:33)  may sleep
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/equipped", function* equipped(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[1]), 11) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>"]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>As ＀ puts ＀ on, it flickers off their head!</span>", [live(f.args[0]), live(f.src)]), "<span class='warning'>The helmet flickers off your head, leaving only nausea!</span>"]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(f.args[0])), "vomit", [20]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Do you have a hole in your head? You're about to.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The helmet tries to drive a spike through your head as you scramble to remove it!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [30, "brute", "head"]);
		yield* g.callName(f, live(f.args[0]), "adjustBrainLoss", [30]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.args[0]), P("/mob/proc/dropItemToGround")])), live(f.src), 1]);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/head/helmet/clockwork/proc/mob_can_equip  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:50)  may sleep
rt.def("/obj/item/clothing/head/helmet/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(live(f.args[1])) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

rt.type(7764, "/obj/item/clothing/suit/armor/clockwork", "/obj/item/clothing/suit/armor", {
	name: "clockwork cuirass",
	desc: "A bulky cuirass made of brass.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_cuirass",
	w_class: 4,
	body_parts_covered: 30,
	cold_protection: 30,
	heat_protection: 30,
	resistance_flags: 34,
	armor: null,
	allowed: null,
});

// /obj/item/clothing/suit/armor/clockwork/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:64)
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/clockwork"), T("/obj/item/clothing/glasses/wraith_spectacles"), T("/obj/item/clothing/glasses/judicial_visor"), T("/obj/item/device/mmi/posibrain/soul_vessel")));
	return f.dot;
});

// /obj/item/clothing/suit/armor/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:68)  may sleep
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ratvar_act");
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:73)  may sleep
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/suit/armor/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:78)
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 1, rt.bitOr));
		rt.setSv(f, "max_heat_protection_temperature", 35000);
		rt.setSv(f, "min_cold_protection_temperature", 2);
	} else {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		rt.setSv(f, "max_heat_protection_temperature", rt.initial(f, live(f.src), "max_heat_protection_temperature"));
		rt.setSv(f, "min_cold_protection_temperature", rt.initial(f, live(f.src), "min_cold_protection_temperature"));
	}
	return f.dot;
});

// /obj/item/clothing/suit/armor/clockwork/proc/mob_can_equip  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:89)  may sleep
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(live(f.args[1])) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// /obj/item/clothing/suit/armor/clockwork/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:94)  may sleep
rt.def("/obj/item/clothing/suit/armor/clockwork/proc/equipped", function* equipped(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[1]), 13) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>"]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>As ＀ puts ＀ on, it flickers off their body!</span>", [live(f.args[0]), live(f.src)]), "<span class='warning'>The curiass flickers off your body, leaving only nausea!</span>"]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(f.args[0])), "vomit", [20]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"I think this armor is too hot for you to handle.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The curiass emits a burst of flame as you scramble to get it off!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [15, "fire", "chest"]);
		yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [2]);
		yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.args[0]), P("/mob/proc/dropItemToGround"), live(f.src), 1])), 1]);
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(7661, "/obj/item/clothing/gloves/clockwork", "/obj/item/clothing/gloves", {
	name: "clockwork gauntlets",
	desc: "Heavy, shock-resistant gauntlets with brass reinforcement.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_gauntlets",
	item_state: "clockwork_gauntlets",
	item_color: null,
	strip_delay: 50,
	equip_delay_other: 30,
	body_parts_covered: 384,
	cold_protection: 384,
	heat_protection: 384,
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	resistance_flags: 34,
	armor: null,
});

// /obj/item/clothing/gloves/clockwork/proc/<init>  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:126)
rt.def("/obj/item/clothing/gloves/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/gloves/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:129)  may sleep
rt.def("/obj/item/clothing/gloves/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ratvar_act");
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/gloves/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:134)  may sleep
rt.def("/obj/item/clothing/gloves/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/gloves/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:139)
rt.def("/obj/item/clothing/gloves/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 100, "laser", 100, "energy", 100, "bomb", 100, "bio", 100, "rad", 100, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 1, rt.bitOr));
		rt.setSv(f, "max_heat_protection_temperature", 35000);
		rt.setSv(f, "min_cold_protection_temperature", 2);
	} else {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 70, "laser", -25, "energy", 0, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		rt.setSv(f, "max_heat_protection_temperature", rt.initial(f, live(f.src), "max_heat_protection_temperature"));
		rt.setSv(f, "min_cold_protection_temperature", rt.initial(f, live(f.src), "min_cold_protection_temperature"));
	}
	return f.dot;
});

// /obj/item/clothing/gloves/clockwork/proc/mob_can_equip  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:150)  may sleep
rt.def("/obj/item/clothing/gloves/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(live(f.args[1])) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// /obj/item/clothing/gloves/clockwork/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:155)  may sleep
rt.def("/obj/item/clothing/gloves/clockwork/proc/equipped", function* equipped(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[1]), 9) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>"]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>As ＀ puts ＀ on, it flickers off their arms!</span>", [live(f.args[0]), live(f.src)]), "<span class='warning'>The gauntlets flicker off your arms, leaving only nausea!</span>"]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(f.args[0])), "vomit", []);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Did you like having arms?\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The gauntlets suddenly squeeze tight, crushing your arms before you manage to get them off!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [7, "brute", "l_arm"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [7, "brute", "r_arm"]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.args[0]), P("/mob/proc/dropItemToGround"), live(f.src), 1])), 1]);
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(8458, "/obj/item/clothing/shoes/clockwork", "/obj/item/clothing/shoes", {
	name: "clockwork treads",
	desc: "Industrial boots made of brass. They're very heavy.",
	icon: rt.rsc("icons/obj/clothing/clockwork_garb.dmi"),
	icon_state: "clockwork_treads",
	w_class: 3,
	strip_delay: 50,
	equip_delay_other: 30,
	resistance_flags: 34,
});

// /obj/item/clothing/shoes/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:182)  may sleep
rt.def("/obj/item/clothing/shoes/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "ratvar_act");
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:187)  may sleep
rt.def("/obj/item/clothing/shoes/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/shoes/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:195)
rt.def("/obj/item/clothing/shoes/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		(rt.modSrcVar(f, "flags", 1024, rt.bitOr));
	} else {
		(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
	}
	return f.dot;
});

// /obj/item/clothing/shoes/clockwork/proc/mob_can_equip  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:200)  may sleep
rt.def("/obj/item/clothing/shoes/clockwork/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(live(f.args[1])) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// /obj/item/clothing/shoes/clockwork/proc/equipped  (code/game/gamemodes/clock_cult/clock_items/clockwork_armor.dm:205)  may sleep
rt.def("/obj/item/clothing/shoes/clockwork/proc/equipped", function* equipped(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(live(f.args[1]), 12) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) return f.dot;
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Now now, this is for my servants, not you.\"</span>"]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>As ＀ puts ＀ on, it flickers off their feet!</span>", [live(f.args[0]), live(f.src)]), "<span class='warning'>The treads flicker off your feet, leaving only nausea!</span>"]);
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
			yield* g.callName(f, (C = live(f.args[0])), "vomit", []);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='heavy_brass'>\"Let's see if you can dance with these.\"</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='userdanger'>The treads turn searing hot as you scramble to get them off!</span>"]);
		yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [7, "fire", "l_leg"]);
		yield* g.callName(f, live(f.args[0]), "apply_damage", [7, "fire", "r_leg"]);
	}
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.args[0]), P("/mob/proc/dropItemToGround"), live(f.src), 1])), 1]);
	return f.dot;
}, true, { args: ["user", "slot"] });
