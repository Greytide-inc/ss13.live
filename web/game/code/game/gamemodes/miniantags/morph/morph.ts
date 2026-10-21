// From code/game/gamemodes/miniantags/morph/morph.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4888, "/mob/living/simple_animal/hostile/morph", "/mob/living/simple_animal/hostile", {
	morphed: 0,
	form: null,
	morph_time: 0,
	playstyle_string: "<b><font size=3 color='red'>You are a morph,</font> an abomination of science created primarily with changeling cells. You may take the form of anything nearby by shift-clicking it. This process will alert any nearby observers, and can only be performed once every five seconds. While morphed, you move faster, but do less damage. In addition, anyone within three tiles will note an uncanny wrongness if examining you. You can attack any item or dead creature to consume it - creatures will fully restore your health. Finally, you can restore yourself to your original form while morphed by shift-clicking yourself.</b>",
	pass_flags: 1,
	name: "morph",
	real_name: "morph",
	desc: "A revolting, pulsating pile of flesh.",
	speak_emote: null,
	emote_hear: null,
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "morph",
	icon_living: "morph",
	icon_dead: "morph_dead",
	speed: 2,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	ventcrawler: 2,
	atmos_requirements: null,
	minbodytemp: 0,
	maxHealth: 150,
	health: 150,
	healable: 0,
	obj_damage: 50,
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	see_in_dark: 8,
	lighting_alpha: 128,
	idle_vision_range: 1,
	wander: 0,
	attacktext: "glomps",
	attack_sound: rt.rsc("sound/effects/blobattack.ogg"),
	butcher_results: null,
}, { global: { blacklist_typecache: 1045 } });

// /mob/living/simple_animal/hostile/morph/proc/<init>  (code/game/gamemodes/miniantags/morph/morph.dm:7)
rt.def("/mob/living/simple_animal/hostile/morph/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("gurgles"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("gurgles"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/morph/proc/examine  (code/game/gamemodes/miniantags/morph/morph.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/examine", function* examine(f: Frame) {
	if (truthy(rt.sv(f, "morphed"))) {
		yield* g.callName(f, rt.sv(f, "form"), "examine", [live(f.args[0])]);
		if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 3)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It doesn't look quite right...</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["user"] });

// /mob/living/simple_animal/hostile/morph/proc/med_hud_set_health  (code/game/gamemodes/miniantags/morph/morph.dm:61)
rt.def("/mob/living/simple_animal/hostile/morph/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if ((truthy(rt.sv(f, "morphed")) && !truthy((rt.istype(rt.sv(f, "form"), T("/mob/living")) ? 1 : 0)))) {
		rt.setFv(f, "icon_state", (holder = rt.at(rt.sv(f, "hud_list"), "1")), null);
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /mob/living/simple_animal/hostile/morph/proc/med_hud_set_status  (code/game/gamemodes/miniantags/morph/morph.dm:68)
rt.def("/mob/living/simple_animal/hostile/morph/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null;
	f.vars = () => [holder];
	if ((truthy(rt.sv(f, "morphed")) && !truthy((rt.istype(rt.sv(f, "form"), T("/mob/living")) ? 1 : 0)))) {
		rt.setFv(f, "icon_state", (holder = rt.at(rt.sv(f, "hud_list"), "2")), null);
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /mob/living/simple_animal/hostile/morph/proc/allowed  (code/game/gamemodes/miniantags/morph/morph.dm:75)
rt.def("/mob/living/simple_animal/hostile/morph/proc/allowed", function allowed(f: Frame, A: Value) {
	return ((!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(A), rt.gl("blacklist_typecache")])) ? 1 : 0) && ((rt.istype(live(A), T("/obj")) ? 1 : 0) || rt.call(f, P("/proc/ismob"), null, [live(A)])));
});

// /mob/living/simple_animal/hostile/morph/proc/eat  (code/game/gamemodes/miniantags/morph/morph.dm:78)
rt.def("/mob/living/simple_animal/hostile/morph/proc/eat", function eat(f: Frame, A: Value) {
	if ((truthy(live(A)) && !isEqual(rt.fv(f, "loc", live(A)), live(f.src)))) {
		rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ swallows ＀ whole!</span>", [live(f.src), live(A)])]);
		rt.setFv(f, "loc", live(A), live(f.src));
		return 1;
	}
	return 0;
});

// /mob/living/simple_animal/hostile/morph/proc/ShiftClickOn  (code/game/gamemodes/miniantags/morph/morph.dm:85)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/ShiftClickOn", function* ShiftClickOn(f: Frame) {
	if ((rt.le(rt.sv(f, "morph_time"), rt.worldTime(f)) && !truthy(rt.sv(f, "stat")))) {
		if (isEqual(live(f.args[0]), live(f.src))) {
			yield* g.srcCall(f, "restore");
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "allowed", live(f.args[0])))))) {
			yield* g.srcCall(f, "assume", live(f.args[0]));
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Your chameleon skin is still repairing itself!</span>"]);
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/hostile/morph/proc/assume  (code/game/gamemodes/miniantags/morph/morph.dm:97)
rt.def("/mob/living/simple_animal/hostile/morph/proc/assume", function assume(f: Frame, target: Value) {
	rt.setSv(f, "morphed", 1);
	rt.setSv(f, "form", live(target));
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ suddenly twists and changes shape, becoming a copy of ＀!</span>", [live(f.src), live(target)]), fmt("<span class='notice'>You twist your body and assume the form of ＀.</span>", [live(target)])]);
	rt.setSv(f, "appearance", rt.fv(f, "appearance", live(target)));
	rt.callSrc(f, "copy_overlays", [live(target)]);
	rt.setSv(f, "alpha", rt.call(f, P("/proc/max"), null, [rt.sv(f, "alpha"), 150]));
	rt.setSv(f, "transform", rt.initial(f, live(f.src), "transform"));
	rt.setSv(f, "pixel_y", rt.initial(f, live(f.src), "pixel_y"));
	rt.setSv(f, "pixel_x", rt.initial(f, live(f.src), "pixel_x"));
	rt.setSv(f, "melee_damage_lower", 5);
	rt.setSv(f, "melee_damage_upper", 5);
	rt.setSv(f, "speed", 0);
	rt.setSv(f, "morph_time", add(rt.worldTime(f), 50));
	rt.callSrc(f, "med_hud_set_health", []);
	rt.callSrc(f, "med_hud_set_status", []);
	return live(f.dot);
});

// /mob/living/simple_animal/hostile/morph/proc/restore  (code/game/gamemodes/miniantags/morph/morph.dm:119)
rt.def("/mob/living/simple_animal/hostile/morph/proc/restore", function restore(f: Frame) {
	if (!truthy(rt.sv(f, "morphed"))) {
		return live(f.dot);
	}
	rt.setSv(f, "morphed", 0);
	rt.setSv(f, "form", null);
	rt.setSv(f, "alpha", rt.initial(f, live(f.src), "alpha"));
	rt.setSv(f, "color", rt.initial(f, live(f.src), "color"));
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ suddenly collapses in on itself, dissolving into a pile of green flesh!</span>", [live(f.src)]), "<span class='notice'>You reform to your normal body.</span>"]);
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.callSrc(f, "cut_overlays", []);
	rt.setSv(f, "melee_damage_lower", rt.initial(f, live(f.src), "melee_damage_lower"));
	rt.setSv(f, "melee_damage_upper", rt.initial(f, live(f.src), "melee_damage_upper"));
	rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
	rt.setSv(f, "morph_time", add(rt.worldTime(f), 50));
	rt.callSrc(f, "med_hud_set_health", []);
	rt.callSrc(f, "med_hud_set_status", []);
	return f.dot;
});

// /mob/living/simple_animal/hostile/morph/proc/death  (code/game/gamemodes/miniantags/morph/morph.dm:144)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/death", function* death(f: Frame) {
	if (truthy(rt.sv(f, "morphed"))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ twists and dissolves into a pile of green flesh!</span>", [live(f.src)]), "<span class='userdanger'>Your skin ruptures! Your flesh breaks apart! No disguise can ward off de--</span>");
		yield* g.srcCall(f, "restore");
	}
	yield* g.srcCall(f, "barf_contents");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/morph/proc/barf_contents  (code/game/gamemodes/miniantags/morph/morph.dm:151)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/barf_contents", function* barf_contents(f: Frame) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.setFv(f, "loc", live(AM), rt.sv(f, "loc"));
		if (truthy(rt.op(f, "Prob", [], [90]))) {
			yield* g.call(f, P("/proc/step"), null, [live(AM), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/morph/proc/wabbajack_act  (code/game/gamemodes/miniantags/morph/morph.dm:157)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/wabbajack_act", function* wabbajack_act(f: Frame) {
	yield* g.srcCall(f, "barf_contents");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["new_mob"] });

// /mob/living/simple_animal/hostile/morph/proc/Aggro  (code/game/gamemodes/miniantags/morph/morph.dm:161)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/Aggro", function* Aggro(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "restore");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/morph/proc/LoseAggro  (code/game/gamemodes/miniantags/morph/morph.dm:165)
rt.def("/mob/living/simple_animal/hostile/morph/proc/LoseAggro", function LoseAggro(f: Frame) {
	rt.setSv(f, "vision_range", rt.sv(f, "idle_vision_range"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/morph/proc/AIShouldSleep  (code/game/gamemodes/miniantags/morph/morph.dm:168)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/AIShouldSleep", function* AIShouldSleep(f: Frame) {
	let things: Value = null, A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [things, A, _T, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	things = rt.list();
	A = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [live(f.src)])), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.srcCall(f, "allowed", live(A))))) {
			things = rt.modify(live(things), live(A), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "assume", (_T = rt.op(f, "PickUnweighted", [1], [live(things)])));
	return f.dot;
}, true, { args: ["possible_targets"] });

// /mob/living/simple_animal/hostile/morph/proc/can_track  (code/game/gamemodes/miniantags/morph/morph.dm:180)
rt.def("/mob/living/simple_animal/hostile/morph/proc/can_track", function can_track(f: Frame) {
	if (truthy(rt.sv(f, "morphed"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /mob/living/simple_animal/hostile/morph/proc/AttackingTarget  (code/game/gamemodes/miniantags/morph/morph.dm:183)  may sleep
rt.def("/mob/living/simple_animal/hostile/morph/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, I: Value = null;
	f.vars = () => [L, I];
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 2)) {
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 30, "target", live(L)], rt.Args.Named)))) {
				if (truthy((yield* g.srcCall(f, "eat", live(L))))) {
					yield* g.srcCall(f, "adjustHealth", -50);
				}
			}
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/item")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "anchored", (I = rt.sv(f, "target"))))) {
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 20, "target", live(I)], rt.Args.Named)))) {
					yield* g.srcCall(f, "eat", live(I));
				}
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(275, "/datum/round_event/ghost_role/morph", "/datum/round_event/ghost_role", {
	minimum_required: 1,
	role_name: "morphling",
});

// /datum/round_event/ghost_role/morph/proc/spawn_role  (code/game/gamemodes/miniantags/morph/morph.dm:211)  may sleep
rt.def("/datum/round_event/ghost_role/morph/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, selected: Value = null, player_mind: Value = null, S: Value = null;
	f.vars = () => [candidates, selected, player_mind, S];
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "alien", null, "xenomorph")))))) {
		return 3;
	}
	selected = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
	rt.setFv(f, "active", (player_mind = (yield* g.new_(f, T("/datum/mind"), [rt.fv(f, "key", live(selected))]))), 1);
	if (!truthy(rt.gl("xeno_spawn"))) {
		return 4;
	}
	S = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/morph"), [rt.op(f, "PickUnweighted", [1], [rt.gl("xeno_spawn")])]));
	yield* g.callName(f, live(player_mind), "transfer_to", [live(S)]);
	rt.setFv(f, "assigned_role", live(player_mind), "Morph");
	rt.setFv(f, "special_role", live(player_mind), "Morph");
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", live(player_mind), rt.bitOr));
	yield* g.call(f, P("/proc/to_chat"), null, [live(S), rt.fv(f, "playstyle_string", live(S))]);
	rt.op(f, "Output", [], [live(S), rt.rsc("sound/magic/mutate.ogg")], false);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into a morph by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(S)]))])]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as a morph by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(S)]))])]);
	rt.modSrcVar(f, "spawned_mobs", live(S), add);
	return 2;
}, true);
