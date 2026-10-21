// From code/modules/mob/living/simple_animal/guardian/guardian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalparasites  (code/modules/mob/living/simple_animal/guardian/guardian.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalparasites", function InitGlobalparasites(f: Frame) {
	rt.setGl("parasites", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "parasites", add);
	return f.dot;
});

rt.type(4872, "/mob/living/simple_animal/hostile/guardian", "/mob/living/simple_animal/hostile", {
	guardian_overlays: null,
	reset: 0,
	cooldown: 0,
	summoner: null,
	range: 10,
	namedatum: null,
	playstyle_string: "<span class='holoparasite'>You are a standard Guardian. You shouldn't exist!</span>",
	magic_fluff_string: "<span class='holoparasite'>You draw the Coder, symbolizing bugs and errors. This shouldn't happen! Submit a bug report!</span>",
	tech_fluff_string: "<span class='holoparasite'>BOOT SEQUENCE COMPLETE. ERROR MODULE LOADED. THIS SHOULDN'T HAPPEN. Submit a bug report!</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP SOME SORT OF HORRIFIC BUG BLAME THE CODERS CARP CARP CARP</span>",
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode/Inactive"),
	name: "Guardian Spirit",
	real_name: "Guardian Spirit",
	desc: "A mysterious being that stands by its charge, ever vigilant.",
	speak_emote: null,
	gender: "neuter",
	bubble_icon: "guardian",
	response_help: "passes through",
	response_disarm: "flails at",
	response_harm: "punches",
	icon: rt.rsc("icons/mob/guardian.dmi"),
	icon_state: "magicOrange",
	icon_living: "magicOrange",
	icon_dead: "magicOrange",
	speed: 0,
	a_intent: "harm",
	stop_automated_movement: 1,
	movement_type: 2,
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	attacktext: "punches",
	maxHealth: 1e+31,
	health: 1e+31,
	healable: 0,
	damage_coeff: null,
	environment_smash: 1,
	obj_damage: 40,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	butcher_results: null,
	AIStatus: 3,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous/guardian"),
});

// /mob/living/simple_animal/hostile/guardian/proc/<init>  (code/modules/mob/living/simple_animal/guardian/guardian.dm:41)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "guardian_overlays", rt.op(f, "CreateMultidimensionalList", [1], [1]));
	$0 = $0;
	rt.setSv(f, "namedatum", rt.new_(f, T("/datum/guardianname"), []));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 0.5, "fire", 0.5, "tox", 0.5, "clone", 0.5, "stamina", 0, "oxy", 0.5]));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/Initialize  (code/modules/mob/living/simple_animal/guardian/guardian.dm:54)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Initialize", function* Initialize(f: Frame) {
	rt.modGl("parasites", live(f.src), add);
	yield* g.srcCall(f, "setthemename", live(f.args[1]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload", "theme"] });

// /mob/living/simple_animal/hostile/guardian/proc/med_hud_set_health  (code/modules/mob/living/simple_animal/guardian/guardian.dm:62)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	rt.setFv(f, "icon_state", (holder = rt.at(rt.sv(f, "hud_list"), "1")), fmt("hud＀", [rt.call(f, P("/proc/RoundHealth"), null, [rt.sv(f, "summoner")])]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/med_hud_set_status  (code/modules/mob/living/simple_animal/guardian/guardian.dm:67)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	holder = rt.at(rt.sv(f, "hud_list"), "2");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	if (isEqual(rt.fv(f, "stat", rt.sv(f, "summoner")), 2)) {
		rt.setFv(f, "icon_state", live(holder), "huddead");
	} else {
		rt.setFv(f, "icon_state", live(holder), "hudhealthy");
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/Destroy  (code/modules/mob/living/simple_animal/guardian/guardian.dm:75)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("parasites", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/setthemename  (code/modules/mob/living/simple_animal/guardian/guardian.dm:79)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/setthemename", function* setthemename(f: Frame, pickedtheme: Value) {
	let possible_names: Value = null, type: Value = null;
	let $0: any, $e: any;
	f.vars = () => [pickedtheme, possible_names, type, $0, $e];
	if (!truthy(live(pickedtheme))) {
		pickedtheme = rt.op(f, "PickUnweighted", [3], ["magic", "tech", "carp"]);
	}
	possible_names = rt.list();
	$0 = live(pickedtheme);
	if ($0 === "magic") {
		type = null;
		rt.forList(f, 0, subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/guardianname/magic")])), T("/datum/guardianname/magic")), rt.fv(f, "type", rt.sv(f, "namedatum"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			type = $e;
			possible_names = rt.modify(live(possible_names), (yield* g.new_(f, live(type), [])), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === "tech") {
		type = null;
		rt.forList(f, 0, subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/guardianname/tech")])), T("/datum/guardianname/tech")), rt.fv(f, "type", rt.sv(f, "namedatum"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			type = $e;
			possible_names = rt.modify(live(possible_names), (yield* g.new_(f, live(type), [])), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === "carp") {
		type = null;
		rt.forList(f, 0, subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/guardianname/carp")])), T("/datum/guardianname/carp")), rt.fv(f, "type", rt.sv(f, "namedatum"))));
		while (($e = rt.next(f, 0)) !== undefined) {
			type = $e;
			possible_names = rt.modify(live(possible_names), (yield* g.new_(f, live(type), [])), add);
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "namedatum", rt.op(f, "PickUnweighted", [1], [live(possible_names)]));
	yield* g.srcCall(f, "updatetheme", live(pickedtheme));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/updatetheme  (code/modules/mob/living/simple_animal/guardian/guardian.dm:96)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/updatetheme", function updatetheme(f: Frame, theme: Value) {
	rt.setSv(f, "name", fmt("＀ ＀", [rt.fv(f, "prefixname", rt.sv(f, "namedatum")), rt.fv(f, "suffixcolour", rt.sv(f, "namedatum"))]));
	rt.setSv(f, "real_name", fmt("＀", [rt.sv(f, "name")]));
	rt.setSv(f, "icon_living", fmt("＀", [rt.fv(f, "parasiteicon", rt.sv(f, "namedatum"))]));
	rt.setSv(f, "icon_state", fmt("＀", [rt.fv(f, "parasiteicon", rt.sv(f, "namedatum"))]));
	rt.setSv(f, "icon_dead", fmt("＀", [rt.fv(f, "parasiteicon", rt.sv(f, "namedatum"))]));
	rt.setSv(f, "bubble_icon", fmt("＀", [rt.fv(f, "bubbleicon", rt.sv(f, "namedatum"))]));
	if (truthy(rt.fv(f, "stainself", rt.sv(f, "namedatum")))) {
		rt.callSrc(f, "add_atom_colour", [rt.fv(f, "colour", rt.sv(f, "namedatum")), 4]);
	}
	if (!isEqual(live(theme), "carp")) return f.dot;
	rt.setSv(f, "speak_emote", rt.list("gnashes"));
	rt.setSv(f, "desc", "A mysterious fish that stands by its charge, ever vigilant.");
	rt.setSv(f, "attacktext", "bites");
	rt.setSv(f, "attack_sound", rt.rsc("sound/weapons/bite.ogg"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/Login  (code/modules/mob/living/simple_animal/guardian/guardian.dm:116)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "mind"))) {
		rt.setFv(f, "name", rt.sv(f, "mind"), fmt("＀", [rt.sv(f, "real_name")]));
	}
	if (!truthy(rt.sv(f, "summoner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='holoparasitebold'>For some reason, somehow, you have no summoner. Please report this bug immediately.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>You are <font color=\"＀\"><b>＀</b></font>, bound to serve ＀.</span>", [rt.fv(f, "colour", rt.sv(f, "namedatum")), rt.sv(f, "real_name"), rt.fv(f, "real_name", rt.sv(f, "summoner"))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='holoparasite'>You are capable of manifesting or recalling to your master with the buttons on your HUD. You will also find a button to communicate with them privately there.</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>While personally invincible, you will die if ＀ does, and any damage dealt to you will have a portion passed on to them as you feed upon them to sustain yourself.</span>", [rt.fv(f, "real_name", rt.sv(f, "summoner"))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "playstyle_string")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/Life  (code/modules/mob/living/simple_animal/guardian/guardian.dm:128)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Life", function* Life(f: Frame) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_health_hud");
	yield* g.srcCall(f, "med_hud_set_health");
	yield* g.srcCall(f, "med_hud_set_status");
	if (truthy(rt.sv(f, "summoner"))) {
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "summoner")), 2)) {
			yield* g.srcCall(f, "forceMove", rt.fv(f, "loc", rt.sv(f, "summoner")));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your summoner has died!</span>"]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'><B>＄！ dies along with its user!</B></span>", [live(f.src)]));
			yield* g.callName(f, rt.sv(f, "summoner"), "visible_message", [fmt("<span class='danger'><B>＀'s body is completely consumed by the strain of sustaining ＀!</B></span>", [rt.sv(f, "summoner"), live(f.src)])]);
			W = null;
			rt.forList(f, 0, rt.sv(f, "summoner"), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				W = $e;
				if (!truthy((yield* g.callName(f, rt.sv(f, "summoner"), "dropItemToGround", [live(W)])))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
				}
			}
			rt.endFor(f, 0);
			yield* g.callName(f, rt.sv(f, "summoner"), "dust", []);
			yield* g.srcCall(f, "death", 1);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Your summoner has died!</span>"]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'><B>The ＀ dies along with its user!</B></span>", [live(f.src)]));
		yield* g.srcCall(f, "death", 1);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.srcCall(f, "snapback");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/guardian/proc/Stat  (code/modules/mob/living/simple_animal/guardian/guardian.dm:152)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Stat", function* Stat(f: Frame) {
	let resulthealth: Value = null;
	f.vars = () => [resulthealth];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (truthy(rt.sv(f, "summoner"))) {
		resulthealth = null;
		if (truthy((rt.istype(rt.sv(f, "summoner"), T("/mob/living/carbon")) ? 1 : 0))) {
			resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "summoner")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "summoner")))])), 100)]));
		} else {
			resulthealth = (yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "summoner")), rt.fv(f, "maxHealth", rt.sv(f, "summoner"))), 100), 0.5]));
		}
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Summoner Health: ＀%", [live(resulthealth)])]);
	}
	if (!rt.ge(rt.sv(f, "cooldown"), rt.worldTime(f))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Manifest/Recall Cooldown Remaining: ＀ seconds", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "cooldown"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/Move  (code/modules/mob/living/simple_animal/guardian/guardian.dm:165)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "snapback");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/snapback  (code/modules/mob/living/simple_animal/guardian/guardian.dm:170)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/snapback", function* snapback(f: Frame) {
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.getStep(f, rt.sv(f, "summoner"), 0), rt.getStep(f, live(f.src), 0)])), rt.sv(f, "range"))) {
		return live(f.dot);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ＀ meters from ＀!</span>", [rt.sv(f, "range"), rt.fv(f, "real_name", rt.sv(f, "summoner"))])]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ jumps back to its user.</span>", [live(f.src)]));
		if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "summoner")), T("/obj/effect")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recall", 1);
		} else {
			yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [rt.sv(f, "loc")]);
			yield* g.srcCall(f, "forceMove", rt.fv(f, "loc", rt.sv(f, "summoner")));
			yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase"), [rt.sv(f, "loc")]);
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/AttackingTarget  (code/modules/mob/living/simple_animal/guardian/guardian.dm:186)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You must be manifested to attack!</span></B>"]);
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/death  (code/modules/mob/living/simple_animal/guardian/guardian.dm:193)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "drop_all_held_items");
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), fmt("<span class='danger'><B>Your ＀ died somehow!</span></B>", [rt.sv(f, "name")])]);
	yield* g.callName(f, rt.sv(f, "summoner"), "death", []);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/update_health_hud  (code/modules/mob/living/simple_animal/guardian/guardian.dm:200)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/update_health_hud", function update_health_hud(f: Frame) {
	let resulthealth: Value = null;
	f.vars = () => [resulthealth];
	if (!((truthy(rt.sv(f, "summoner")) && truthy(rt.sv(f, "hud_used"))) && truthy(rt.fv(f, "healths", rt.sv(f, "hud_used"))))) return f.dot;
	resulthealth = null;
	if (truthy((rt.istype(rt.sv(f, "summoner"), T("/mob/living/carbon")) ? 1 : 0))) {
		resulthealth = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "health", rt.sv(f, "summoner")))]), rt.op(f, "Abs", [], [subtract(-100, rt.fv(f, "maxHealth", rt.sv(f, "summoner")))])), 100)]);
	} else {
		resulthealth = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "health", rt.sv(f, "summoner")), rt.fv(f, "maxHealth", rt.sv(f, "summoner"))), 100), 0.5]);
	}
	rt.setFv(f, "maptext", rt.fv(f, "healths", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#efeeef'>＀%</font></div>", [live(resulthealth)]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/adjustHealth  (code/modules/mob/living/simple_animal/guardian/guardian.dm:209)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	f.vars = () => [amount, updating_health, forced];
	if (live(updating_health) === null) {
		updating_health = 1;
	}
	if (live(forced) === null) {
		forced = 0;
	}
	f.dot = live(amount);
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) {
		return 0;
	}
	yield* g.callName(f, rt.sv(f, "summoner"), "adjustBruteLoss", [live(amount)]);
	if (rt.gt(live(amount), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), fmt("<span class='danger'><B>Your ＀ is under attack! You take damage!</span></B>", [rt.sv(f, "name")])]);
		yield* g.callName(f, rt.sv(f, "summoner"), "visible_message", [fmt("<span class='danger'><B>Blood sprays from ＀ as ＀ takes damage!</B></span>", [rt.sv(f, "summoner"), live(f.src)])]);
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "summoner")), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), fmt("<span class='danger'><B>Your body can't take the strain of sustaining ＀ in this condition, it begins to fall apart!</span></B>", [live(f.src)])]);
			yield* g.callName(f, rt.sv(f, "summoner"), "adjustCloneLoss", [multiply(live(amount), 0.5)]);
		}
	}
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/ex_act  (code/modules/mob/living/simple_animal/guardian/guardian.dm:223)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let $0: any;
	f.vars = () => [severity, target, $0];
	$0 = live(severity);
	if ($0 === 1) {
		yield* g.srcCall(f, "gib");
		return live(f.dot);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "adjustBruteLoss", 60);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "adjustBruteLoss", 30);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/guardian/proc/gib  (code/modules/mob/living/simple_animal/guardian/guardian.dm:234)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/gib", function* gib(f: Frame) {
	if (truthy(rt.sv(f, "summoner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), fmt("<span class='danger'><B>Your ＀ was blown up!</span></B>", [live(f.src)])]);
		yield* g.callName(f, rt.sv(f, "summoner"), "gib", []);
	}
	yield* g.srcCall(f, "ghostize");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/equip_to_slot  (code/modules/mob/living/simple_animal/guardian/guardian.dm:242)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null;
	f.vars = () => [I, slot, index];
	if (!truthy(live(slot))) {
		return 0;
	}
	if (!truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) {
		return 0;
	}
	f.dot = 1;
	if (truthy((index = (yield* g.srcCall(f, "get_held_index_of_item", live(I)))))) {
		rt.setAt(rt.sv(f, "held_items"), live(index), null);
		yield* g.srcCall(f, "update_inv_hands");
	}
	if (truthy(rt.fv(f, "pulledby", live(I)))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(I)), "stop_pulling", []);
	}
	rt.setFv(f, "screen_loc", live(I), null);
	rt.setFv(f, "loc", live(I), live(f.src));
	yield* g.callName(f, live(I), "equipped", [live(f.src), live(slot)]);
	rt.setFv(f, "layer", live(I), 20);
	rt.setFv(f, "plane", live(I), 20);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/apply_overlay  (code/modules/mob/living/simple_animal/guardian/guardian.dm:263)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!truthy((f.dot = rt.index(rt.sv(f, "guardian_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "add_overlay", [live(f.dot)]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/remove_overlay  (code/modules/mob/living/simple_animal/guardian/guardian.dm:267)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy((I = rt.index(rt.sv(f, "guardian_overlays"), live(cache_index))))) return f.dot;
	rt.callSrc(f, "cut_overlay", [live(I)]);
	rt.setAt(rt.sv(f, "guardian_overlays"), live(cache_index), null);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/update_inv_hands  (code/modules/mob/living/simple_animal/guardian/guardian.dm:273)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let hands_overlays: Value = null, l_hand: Value = null, r_hand: Value = null, r_state: Value = null, l_state: Value = null;
	f.vars = () => [hands_overlays, l_hand, r_hand, r_state, l_state];
	rt.callSrc(f, "remove_overlay", [1]);
	hands_overlays = rt.list();
	l_hand = rt.callSrc(f, "get_item_for_held_index", [1]);
	if (truthy((r_hand = rt.callSrc(f, "get_item_for_held_index", [2])))) {
		if (!truthy((r_state = rt.fv(f, "item_state", live(r_hand))))) {
			r_state = rt.fv(f, "icon_state", live(r_hand));
		}
		hands_overlays = rt.modify(live(hands_overlays), rt.callName(f, live(r_hand), "build_worn_icon", ["state", live(r_state), "default_layer", 1, "default_icon_file", rt.fv(f, "righthand_file", live(r_hand)), "isinhands", 1], rt.Args.Named), add);
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "layer", live(r_hand), 20);
			rt.setFv(f, "plane", live(r_hand), 20);
			rt.setFv(f, "screen_loc", live(r_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(r_hand)])]));
			(rt.modField(f, rt.sv(f, "client"), "screen", live(r_hand), rt.bitOr));
		}
	}
	if (truthy(live(l_hand))) {
		if (!truthy((l_state = rt.fv(f, "item_state", live(l_hand))))) {
			l_state = rt.fv(f, "icon_state", live(l_hand));
		}
		hands_overlays = rt.modify(live(hands_overlays), rt.callName(f, live(l_hand), "build_worn_icon", ["state", live(l_state), "default_layer", 1, "default_icon_file", rt.fv(f, "lefthand_file", live(l_hand)), "isinhands", 1], rt.Args.Named), add);
		if (((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used"))) && !isEqual(rt.fv(f, "hud_version", rt.sv(f, "hud_used")), 3))) {
			rt.setFv(f, "layer", live(l_hand), 20);
			rt.setFv(f, "plane", live(l_hand), 20);
			rt.setFv(f, "screen_loc", live(l_hand), rt.call(f, P("/proc/ui_hand_position"), null, [rt.callSrc(f, "get_held_index_of_item", [live(l_hand)])]));
			(rt.modField(f, rt.sv(f, "client"), "screen", live(l_hand), rt.bitOr));
		}
	}
	if (truthy(rt.len(f, live(hands_overlays)))) {
		rt.setAt(rt.sv(f, "guardian_overlays"), 1, live(hands_overlays));
	}
	rt.callSrc(f, "apply_overlay", [1]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/regenerate_icons  (code/modules/mob/living/simple_animal/guardian/guardian.dm:309)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	rt.callSrc(f, "update_inv_hands", []);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/Manifest  (code/modules/mob/living/simple_animal/guardian/guardian.dm:314)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Manifest", function* Manifest(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if ((truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "summoner")), T("/obj/effect")) ? 1 : 0)) || (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f)) && !truthy(live(forced))))) {
		return 0;
	}
	if (isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) {
		yield* g.srcCall(f, "forceMove", rt.fv(f, "loc", rt.sv(f, "summoner")));
		yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase"), [rt.sv(f, "loc")]);
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 10));
		return 1;
	}
	return 0;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/Recall  (code/modules/mob/living/simple_animal/guardian/guardian.dm:324)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Recall", function* Recall(f: Frame, forced: Value) {
	f.vars = () => [forced];
	if (((!truthy(rt.sv(f, "summoner")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "summoner"))) || (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f)) && !truthy(live(forced))))) {
		return 0;
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/guardian/phase/out"), [rt.sv(f, "loc")]);
	yield* g.srcCall(f, "forceMove", rt.sv(f, "summoner"));
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 10));
	return 1;
}, true);

// /mob/living/simple_animal/hostile/guardian/proc/ToggleMode  (code/modules/mob/living/simple_animal/guardian/guardian.dm:333)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ToggleMode", function ToggleMode(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'><B>You don't have another mode!</span></B>"]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/ToggleLight  (code/modules/mob/living/simple_animal/guardian/guardian.dm:336)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ToggleLight", function ToggleLight(f: Frame) {
	if (rt.lt(rt.sv(f, "light_range"), 3)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You activate your light.</span>"]);
		rt.callSrc(f, "set_light", [3]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You deactivate your light.</span>"]);
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/verb/ShowType  (code/modules/mob/living/simple_animal/guardian/guardian.dm:347)
rt.def("/mob/living/simple_animal/hostile/guardian/verb/ShowType", function ShowType(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "playstyle_string")]);
	return f.dot;
}, false, { verb: { name: "Check Guardian Type", category: "Guardian", desc: "Check what type you are." } });

// /mob/living/simple_animal/hostile/guardian/proc/Communicate  (code/modules/mob/living/simple_animal/guardian/guardian.dm:353)  may sleep
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Communicate", function* Communicate(f: Frame) {
	let input: Value = null, preliminary_message: Value = null, my_message: Value = null, guardians: Value = null, para: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [input, preliminary_message, my_message, guardians, para, M, link, $e];
	if (!truthy(rt.sv(f, "summoner"))) return f.dot;
	if (!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.src), "Please enter a message to tell your summoner.", "Guardian", ""]))))) {
		return live(f.dot);
	}
	preliminary_message = fmt("<span class='holoparasitebold'>＀</span>", [live(input)]);
	my_message = fmt("<font color=\"＀\"><b><i>＀:</i></b></font> ＀", [rt.fv(f, "colour", rt.sv(f, "namedatum")), live(f.src), live(preliminary_message)]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "summoner"), live(my_message)]);
	guardians = (yield* g.callName(f, rt.sv(f, "summoner"), "hasparasites", []));
	para = null;
	rt.forList(f, 0, live(guardians));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(para), live(my_message)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(my_message)])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ : ＀", [rt.fv(f, "real_name", live(f.src)), rt.fv(f, "key", live(f.src)), live(input)])]);
	return f.dot;
}, true);

// /mob/living/proc/guardian_comm  (code/modules/mob/living/simple_animal/guardian/guardian.dm:374)  may sleep
rt.def("/mob/living/proc/guardian_comm", function* guardian_comm(f: Frame) {
	let input: Value = null, preliminary_message: Value = null, my_message: Value = null, guardians: Value = null, para: Value = null, G: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [input, preliminary_message, my_message, guardians, para, G, M, link, $e];
	if (!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.src), "Please enter a message to tell your guardian.", "Message", ""]))))) {
		return live(f.dot);
	}
	preliminary_message = fmt("<span class='holoparasitebold'>＀</span>", [live(input)]);
	my_message = fmt("<span class='holoparasitebold'><i>＀:</i> ＀</span>", [live(f.src), live(preliminary_message)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(my_message)]);
	guardians = (yield* g.srcCall(f, "hasparasites"));
	para = null;
	rt.forList(f, 0, live(guardians));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [(G = live(para)), fmt("<font color=\"＀\"><b><i>＀:</i></b></font> ＀", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), live(f.src), live(preliminary_message)])]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("dead_mob_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(my_message)])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀/＀ : ＀", [rt.fv(f, "real_name", live(f.src)), rt.fv(f, "key", live(f.src)), rt.sv(f, "text")])]);
	return f.dot;
}, true, { verb: { name: "Communicate", category: "Guardian", desc: "Communicate telepathically with your guardian." } });

// /mob/living/proc/guardian_recall  (code/modules/mob/living/simple_animal/guardian/guardian.dm:398)  may sleep
rt.def("/mob/living/proc/guardian_recall", function* guardian_recall(f: Frame) {
	let guardians: Value = null, para: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [guardians, para, G, $e];
	guardians = (yield* g.srcCall(f, "hasparasites"));
	para = null;
	rt.forList(f, 0, live(guardians));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		yield* g.callName(f, (G = live(para)), "Recall", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { name: "Recall Guardian", category: "Guardian", desc: "Forcibly recall your guardian." } });

// /mob/living/proc/guardian_reset  (code/modules/mob/living/simple_animal/guardian/guardian.dm:408)  may sleep
rt.def("/mob/living/proc/guardian_reset", function* guardian_reset(f: Frame) {
	let guardians: Value = null, para: Value = null, _P: Value = null, G: Value = null, candidates: Value = null, new_stand: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [guardians, para, _P, G, candidates, new_stand, $0, $1, $e];
	guardians = (yield* g.srcCall(f, "hasparasites"));
	para = null;
	rt.forList(f, 0, live(guardians));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		if (truthy(rt.gv(f, "reset", (_P = live(para))))) {
			(guardians = rt.modify(live(guardians), live(_P), subtract));
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(guardians)))) {
		if (truthy((G = (yield* g.op(f, "Prompt", [1], [null, "Guardian Reset", "Pick the guardian you wish to reset", live(f.src), live(guardians)]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>You attempt to reset <font color=\"＀\"><b>＀</b></font>'s personality...</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
			candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as ＀'s ＀?", [rt.fv(f, "real_name", live(f.src)), rt.fv(f, "real_name", live(G))]), "pAI", null, 0, 100]));
			new_stand = null;
			if (truthy(rt.len(f, live(candidates)))) {
				new_stand = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(G), "<span class='holoparasite'>Your user reset you, and your body was taken over by a ghost. Looks like they weren't happy with your performance.</span>"]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasitebold'>Your <font color=\"＀\">＀</font> has been successfully reset.</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has taken control of (＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(new_stand)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(G)]))])]);
				yield* g.callName(f, live(G), "ghostize", [0]);
				yield* g.callName(f, live(G), "setthemename", [rt.gv(f, "theme", rt.fv(f, "namedatum", live(G)))]);
				rt.setFv(f, "key", live(G), rt.fv(f, "key", live(new_stand)));
				rt.setFv(f, "reset", live(G), 1);
				$0 = rt.gv(f, "theme", rt.fv(f, "namedatum", live(G)));
				if ($0 === "tech") {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'><font color=\"＀\"><b>＀</b></font> is now online!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
				} else if ($0 === "magic") {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'><font color=\"＀\"><b>＀</b></font> has been summoned!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
				}
				(guardians = rt.modify(live(guardians), live(G), subtract));
				if (!truthy(rt.len(f, live(guardians)))) {
					(rt.modSrcVar(f, "verbs", P("/mob/living/proc/guardian_reset"), subtract));
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='holoparasite'>There were no ghosts willing to take control of <font color=\"＀\"><b>＀</b></font>. Looks like you're stuck with it for now.</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
			}
		} else {
			$0 = live(f.src);
			if (rt.gt(rt.len(f, live(guardians)), 1)) {
				$1 = "any of your guardians";
			} else {
				$1 = "your guardian";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='holoparasite'>You decide not to reset ＀.</span>", [$1])]);
		}
	} else {
		(rt.modSrcVar(f, "verbs", P("/mob/living/proc/guardian_reset"), subtract));
	}
	return f.dot;
}, true, { verb: { name: "Reset Guardian Player (One Use)", category: "Guardian", desc: "Re-rolls which ghost will control your Guardian. One use per Guardian." } });

// /mob/living/proc/hasparasites  (code/modules/mob/living/simple_animal/guardian/guardian.dm:446)
rt.def("/mob/living/proc/hasparasites", function hasparasites(f: Frame) {
	let _P: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_P, G, $e];
	f.dot = rt.list();
	_P = null;
	rt.forList(f, 0, rt.gl("parasites"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (isEqual(rt.gv(f, "summoner", (G = live(_P))), live(f.src))) {
			f.dot = rt.modify(live(f.dot), live(G), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/guardian/proc/hasmatchingsummoner  (code/modules/mob/living/simple_animal/guardian/guardian.dm:453)
rt.def("/mob/living/simple_animal/hostile/guardian/proc/hasmatchingsummoner", function hasmatchingsummoner(f: Frame, G: Value) {
	return ((rt.istype(live(G), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0) && (isEqual(rt.fv(f, "summoner", live(G)), rt.sv(f, "summoner")) ? 1 : 0));
});

rt.type(7568, "/obj/item/weapon/guardiancreator", "/obj/item/weapon", {
	used: 0,
	theme: "magic",
	mob_name: "Guardian Spirit",
	use_message: "<span class='holoparasite'>You shuffle the deck...</span>",
	used_message: "<span class='holoparasite'>All the cards seem to be blank now.</span>",
	failure_message: "<span class='holoparasitebold'>..And draw a card! It's...blank? Maybe you should try again later.</span>",
	ling_failure: "<span class='holoparasitebold'>The deck refuses to respond to a souless creature such as you.</span>",
	possible_guardians: null,
	random: 1,
	allowmultiple: 0,
	allowling: 1,
	allowguardian: 0,
	name: "deck of tarot cards",
	desc: "An enchanted deck of tarot cards, rumored to be a source of unimaginable power. ",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_syndicate_full",
});

// /obj/item/weapon/guardiancreator/proc/attack_self  (code/modules/mob/living/simple_animal/guardian/guardian.dm:477)  may sleep
rt.def("/obj/item/weapon/guardiancreator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let guardians: Value = null, candidates: Value = null, theghost: Value = null;
	f.vars = () => [user, guardians, candidates, theghost];
	if ((truthy((rt.istype(live(user), T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0)) && !truthy(rt.sv(f, "allowguardian")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'>＀ chains are not allowed.</span>", [rt.sv(f, "mob_name")])]);
		return live(f.dot);
	}
	if ((truthy(rt.getLen(f, (guardians = (yield* g.callName(f, live(user), "hasparasites", []))))) && !truthy(rt.sv(f, "allowmultiple")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'>You already have a ＀!</span>", [rt.sv(f, "mob_name")])]);
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "mind", live(user))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))) && !truthy(rt.sv(f, "allowling")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.sv(f, "ling_failure")])]);
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "used"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.sv(f, "used_message")])]);
		return live(f.dot);
	}
	rt.setSv(f, "used", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.sv(f, "use_message")])]);
	candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as the ＀ of ＀?", [rt.sv(f, "mob_name"), rt.fv(f, "real_name", live(user))]), "pAI", null, 0, 100]));
	theghost = null;
	if (truthy(rt.len(f, live(candidates)))) {
		theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]);
		yield* g.srcCall(f, "spawn_guardian", live(user), rt.fv(f, "key", live(theghost)));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.sv(f, "failure_message")])]);
		rt.setSv(f, "used", 0);
	}
	return f.dot;
}, true);

// /obj/item/weapon/guardiancreator/proc/spawn_guardian  (code/modules/mob/living/simple_animal/guardian/guardian.dm:504)  may sleep
rt.def("/obj/item/weapon/guardiancreator/proc/spawn_guardian", function* spawn_guardian(f: Frame, user: Value, key: Value) {
	let guardiantype: Value = null, pickedtype: Value = null, guardians: Value = null, G: Value = null;
	let $0: any;
	f.vars = () => [user, key, guardiantype, pickedtype, guardians, G, $0];
	guardiantype = "Standard";
	if (truthy(rt.sv(f, "random"))) {
		guardiantype = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible_guardians")]);
	} else {
		if (!truthy((guardiantype = (yield* g.op(f, "Prompt", [1], [null, fmt("＀ Creation", [rt.sv(f, "mob_name")]), fmt("Pick the type of ＀", [rt.sv(f, "mob_name")]), live(user), rt.sv(f, "possible_guardians")]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.sv(f, "failure_message")])]);
			rt.setSv(f, "used", 0);
			return live(f.dot);
		}
	}
	pickedtype = T("/mob/living/simple_animal/hostile/guardian/punch");
	$0 = live(guardiantype);
	if ($0 === "Chaos") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/fire");
	} else if ($0 === "Standard") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/punch");
	} else if ($0 === "Ranged") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/ranged");
	} else if ($0 === "Support") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/healer");
	} else if ($0 === "Explosive") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/bomb");
	} else if ($0 === "Lightning") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/beam");
	} else if ($0 === "Protector") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/protector");
	} else if ($0 === "Charger") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/charger");
	} else if ($0 === "Assassin") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/assassin");
	} else if ($0 === "Dextrous") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/dextrous");
	}
	if ((truthy(rt.getLen(f, (guardians = (yield* g.callName(f, live(user), "hasparasites", []))))) && !truthy(rt.sv(f, "allowmultiple")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'>You already have a ＀!</span>", [rt.sv(f, "mob_name")])]);
		rt.setSv(f, "used", 0);
		return live(f.dot);
	}
	rt.setFv(f, "summoner", (G = (yield* g.new_(f, live(pickedtype), [live(user), rt.sv(f, "theme")]))), live(user));
	rt.setFv(f, "key", live(G), live(key));
	yield* g.callName(f, rt.fv(f, "mind", live(G)), "enslave_mind_to_creator", [live(user)]);
	$0 = rt.sv(f, "theme");
	if ($0 === "tech") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.fv(f, "tech_fluff_string", live(G))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'><font color=\"＀\"><b>＀</b></font> is now online!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
	} else if ($0 === "magic") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.fv(f, "magic_fluff_string", live(G))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'><font color=\"＀\"><b>＀</b></font> has been summoned!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
	} else if ($0 === "carp") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [rt.fv(f, "carp_fluff_string", live(G))])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='holoparasite'><font color=\"＀\"><b>＀</b></font> has been caught!</span>", [rt.gv(f, "colour", rt.fv(f, "namedatum", live(G))), rt.fv(f, "real_name", live(G))])]);
	}
	rt.modField(f, live(user), "verbs", P("/mob/living/proc/guardian_comm"), add);
	rt.modField(f, live(user), "verbs", P("/mob/living/proc/guardian_recall"), add);
	rt.modField(f, live(user), "verbs", P("/mob/living/proc/guardian_reset"), add);
	return f.dot;
}, true);

rt.type(5438, "/obj/item/weapon/storage/box/syndie_kit/guardian", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "holoparasite injector kit",
});

// /obj/item/weapon/storage/box/syndie_kit/guardian/proc/Initialize  (code/modules/mob/living/simple_animal/guardian/guardian.dm:657)  may sleep
rt.def("/obj/item/weapon/storage/box/syndie_kit/guardian/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/guardiancreator/tech/choose/traitor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/paper/guardian"), [live(f.src)]);
	return live(f.dot);
}, true);
