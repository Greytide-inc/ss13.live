// From code/modules/mob/living/simple_animal/slime/slime.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4851, "/mob/living/simple_animal/slime", "/mob/living/simple_animal", {
	AIproc: 0,
	Atkcool: 0,
	Tempstun: 0,
	Discipline: 0,
	SStun: 0,
	is_adult: 0,
	docile: 0,
	cores: 1,
	mutation_chance: 30,
	powerlevel: 0,
	amount_grown: 0,
	number: 0,
	Target: null,
	Leader: null,
	attacked: 0,
	rabid: 0,
	holding_still: 0,
	target_patience: 0,
	Friends: null,
	speech_buffer: null,
	mood: "",
	mutator_used: 0,
	force_stasis: 0,
	colour: "grey",
	slime_mutation: null,
	coretype: rt.typePath("/obj/item/slime_extract/grey"),
	pass_flags: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/slime"),
	verb_say: "blorbles",
	verb_ask: "inquisitively blorbles",
	verb_exclaim: "loudly blorbles",
	verb_yell: "loudly blorbles",
	name: "grey baby slime (123)",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "grey baby slime",
	ventcrawler: 2,
	gender: "neuter",
	faction: null,
	harm_intent_damage: 5,
	icon_living: "grey baby slime",
	icon_dead: "grey baby slime dead",
	response_help: "pets",
	response_disarm: "shoos",
	response_harm: "stomps on",
	emote_see: null,
	speak_emote: null,
	bubble_icon: "slime",
	atmos_requirements: null,
	maxHealth: 150,
	health: 150,
	healable: 0,
	nutrition: 700,
	see_in_dark: 8,
	status_flags: 12,
}, { global: { slime_colours: 713, slime_name_regex: 1043 } });

// /mob/living/simple_animal/slime/proc/<init>  (code/modules/mob/living/simple_animal/slime/slime.dm:59)
rt.def("/mob/living/simple_animal/slime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "Friends", rt.list());
	$0 = $0;
	rt.setSv(f, "speech_buffer", rt.list());
	$0 = $0;
	rt.setSv(f, "slime_mutation", rt.op(f, "CreateMultidimensionalList", [1], [4]));
	rt.setSv(f, "faction", rt.list("slime", "neutral"));
	rt.setSv(f, "emote_see", rt.list("jiggles", "bounces in place"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("blorbles"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/Initialize  (code/modules/mob/living/simple_animal/slime/slime.dm:80)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null, R: Value = null, E: Value = null;
	f.vars = () => [F, R, E];
	if (live(f.args[1]) === null) {
		f.args[1] = "grey";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.callName(f, (F = (yield* g.new_(f, T("/datum/action/innate/slime/feed"), []))), "Grant", [live(f.src)]);
	rt.setSv(f, "is_adult", live(f.args[2]));
	if (truthy(rt.sv(f, "is_adult"))) {
		yield* g.callName(f, (R = (yield* g.new_(f, T("/datum/action/innate/slime/reproduce"), []))), "Grant", [live(f.src)]);
		rt.setSv(f, "health", 200);
		rt.setSv(f, "maxHealth", 200);
	} else {
		yield* g.callName(f, (E = (yield* g.new_(f, T("/datum/action/innate/slime/evolve"), []))), "Grant", [live(f.src)]);
	}
	yield* g.srcCall(f, "create_reagents", 100);
	yield* g.srcCall(f, "set_colour", live(f.args[1]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_colour", "new_is_adult"] });

// /mob/living/simple_animal/slime/proc/set_colour  (code/modules/mob/living/simple_animal/slime/slime.dm:98)
rt.def("/mob/living/simple_animal/slime/proc/set_colour", function set_colour(f: Frame, new_colour: Value) {
	let sanitizedcolour: Value = null;
	f.vars = () => [sanitizedcolour];
	rt.setSv(f, "colour", live(new_colour));
	rt.callSrc(f, "update_name", []);
	rt.setSv(f, "slime_mutation", rt.callSrc(f, "mutation_table", [rt.sv(f, "colour")]));
	rt.setSv(f, "coretype", rt.call(f, P("/proc/text2path"), null, [fmt("/obj/item/slime_extract/＀", [(sanitizedcolour = rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "colour"), " ", ""]))])]));
	rt.callSrc(f, "regenerate_icons", []);
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/update_name  (code/modules/mob/living/simple_animal/slime/slime.dm:106)
rt.def("/mob/living/simple_animal/slime/proc/update_name", function update_name(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.callName(f, rt.gl("slime_name_regex"), "Find", [rt.sv(f, "name")]))) return f.dot;
	rt.setSv(f, "number", rt.call(f, P("/proc/rand"), null, [1, 1000]));
	$0 = rt.sv(f, "colour");
	if (truthy(rt.sv(f, "is_adult"))) {
		$1 = "adult";
	} else {
		$1 = "baby";
	}
	rt.setSv(f, "name", fmt("＀ ＀ slime (＀)", [$0, $1, rt.sv(f, "number")]));
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/regenerate_icons  (code/modules/mob/living/simple_animal/slime/slime.dm:115)
rt.def("/mob/living/simple_animal/slime/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	let icon_text: Value = null;
	let $0: any, $1: any;
	f.vars = () => [icon_text, $0, $1];
	rt.callSrc(f, "cut_overlays", []);
	$0 = rt.sv(f, "colour");
	if (truthy(rt.sv(f, "is_adult"))) {
		$1 = "adult";
	} else {
		$1 = "baby";
	}
	rt.setSv(f, "icon_dead", fmt("＀ dead", [(icon_text = fmt("＀ ＀ slime", [$0, $1]))]));
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		rt.setSv(f, "icon_state", live(icon_text));
		if ((truthy(rt.sv(f, "mood")) && !truthy(rt.sv(f, "stat")))) {
			rt.callSrc(f, "add_overlay", [fmt("aslime-＀", [rt.sv(f, "mood")])]);
		}
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_dead"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/movement_delay  (code/modules/mob/living/simple_animal/slime/slime.dm:127)
rt.def("/mob/living/simple_animal/slime/proc/movement_delay", function movement_delay(f: Frame) {
	let health_deficiency: Value = null;
	f.vars = () => [health_deficiency];
	if (rt.ge(rt.sv(f, "bodytemperature"), 330.2300109863281)) {
		return -1;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (rt.ge((health_deficiency = subtract(100, rt.sv(f, "health"))), 45)) {
		f.dot = rt.modify(live(f.dot), divide(live(health_deficiency), 25), add);
	}
	if (rt.lt(rt.sv(f, "bodytemperature"), 183.2220001220703)) {
		f.dot = rt.modify(live(f.dot), multiply(divide(subtract(283.22198486328125, rt.sv(f, "bodytemperature")), 10), 1.75), add);
	}
	if (truthy(rt.sv(f, "reagents"))) {
		if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["morphine"]))) {
			(f.dot = rt.modify(live(f.dot), 2, multiply));
		}
		if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["frostoil"]))) {
			(f.dot = rt.modify(live(f.dot), 5, multiply));
		}
	}
	if (rt.le(rt.sv(f, "health"), 0)) {
		(f.dot = rt.modify(live(f.dot), 2, multiply));
	}
	f.dot = rt.modify(live(f.dot), rt.fv(f, "slime_delay", rt.gl("config")), add);
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/ObjBump  (code/modules/mob/living/simple_animal/slime/slime.dm:152)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/ObjBump", function* ObjBump(f: Frame, O: Value) {
	let probab: Value = null;
	let $0: any;
	f.vars = () => [O, probab, $0];
	if (!(!truthy(rt.sv(f, "client")) && rt.gt(rt.sv(f, "powerlevel"), 0))) return f.dot;
	probab = 10;
	$0 = rt.sv(f, "powerlevel");
	if (rt.inRange($0, 1, 2)) {
		probab = 20;
	} else if (rt.inRange($0, 3, 4)) {
		probab = 30;
	} else if (rt.inRange($0, 5, 6)) {
		probab = 40;
	} else if (rt.inRange($0, 7, 8)) {
		probab = 60;
	} else if ($0 === 9) {
		probab = 70;
	} else if ($0 === 10) {
		probab = 95;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(probab)]))) return f.dot;
	if (!(truthy((rt.istype(live(O), T("/obj/structure/window")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/structure/grille")) ? 1 : 0)))) return f.dot;
	if (!(rt.le(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition"))) && !truthy(rt.sv(f, "Atkcool")))) return f.dot;
	if (!(truthy(rt.sv(f, "is_adult")) || truthy(rt.op(f, "Prob", [], [5])))) return f.dot;
	yield* g.callName(f, live(O), "attack_slime", [live(f.src)]);
	rt.setSv(f, "Atkcool", 1);
	rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/ObjBump: spawn at modules/mob/living/simple_animal/slime/slime.dm:173", O, probab);
	return f.dot;
}, true);

// a spawn(45) body of /mob/living/simple_animal/slime/proc/ObjBump, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/ObjBump: spawn at modules/mob/living/simple_animal/slime/slime.dm:173", function* (f: Frame, O: Value, probab: Value) {
	f.vars = () => [O, probab];
	rt.setSv(f, "Atkcool", 0);
	return null;
});

// /mob/living/simple_animal/slime/proc/Stat  (code/modules/mob/living/simple_animal/slime/slime.dm:180)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Stat", function* Stat(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.sv(f, "docile"))) {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Nutrition: ＀/＀", [rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_max_nutrition"))])]);
	}
	if (rt.ge(rt.sv(f, "amount_grown"), 10)) {
		if (truthy(rt.sv(f, "is_adult"))) {
			yield* g.call(f, P("/proc/stat"), null, [null, "You can reproduce!"]);
		} else {
			yield* g.call(f, P("/proc/stat"), null, [null, "You can evolve!"]);
		}
	}
	if (isEqual(rt.sv(f, "stat"), 1)) {
		yield* g.call(f, P("/proc/stat"), null, [null, "You are knocked out by high levels of BZ!"]);
	} else {
		yield* g.call(f, P("/proc/stat"), null, [null, fmt("Power Level: ＀", [rt.sv(f, "powerlevel")])]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/adjustFireLoss  (code/modules/mob/living/simple_animal/slime/slime.dm:197)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/adjustFireLoss", function* adjustFireLoss(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (!truthy(live(f.args[2]))) {
		f.args[0] = rt.neg(rt.op(f, "Abs", [], [live(f.args[0])]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/slime/proc/bullet_act  (code/modules/mob/living/simple_animal/slime/slime.dm:202)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	f.vars = () => [Proj];
	if (!truthy(live(Proj))) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "attacked", 10, add);
	if (isEqual(rt.fv(f, "damage_type", live(Proj)), "fire")) {
		yield* g.srcCall(f, "adjustBruteLoss", rt.neg(rt.op(f, "Abs", [], [rt.fv(f, "damage", live(Proj))])));
		yield* g.callName(f, live(Proj), "on_hit", [live(f.src)]);
	} else {
		yield* g.callSuper(f, [live(Proj)]);
	}
	return 0;
}, true);

// /mob/living/simple_animal/slime/proc/emp_act  (code/modules/mob/living/simple_animal/slime/slime.dm:214)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/emp_act", function* emp_act(f: Frame) {
	rt.setSv(f, "powerlevel", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/simple_animal/slime/proc/MouseDrop  (code/modules/mob/living/simple_animal/slime/slime.dm:217)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let Food: Value = null;
	f.vars = () => [Food];
	if (((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && !isEqual(live(f.args[0]), live(f.src))) && isEqual(live(f.usr), live(f.src)))) {
		if (truthy((yield* g.srcCall(f, "CanFeedon", (Food = live(f.args[0])))))) {
			yield* g.srcCall(f, "Feedon", live(Food));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A"] });

// /mob/living/simple_animal/slime/proc/attack_slime  (code/modules/mob/living/simple_animal/slime/slime.dm:233)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_slime", function* attack_slime(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (isEqual(live(f.args[0]), live(f.src))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callSrc(f, "Feedstop", ["silent", 1], rt.Args.Named);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ pulls ＀ off!</span>", [live(f.args[0]), live(f.src)]));
		return live(f.dot);
	}
	rt.modSrcVar(f, "attacked", 5, add);
	if (rt.ge(rt.sv(f, "nutrition"), 100)) {
		(rt.modSrcVar(f, "nutrition", add(50, multiply(40, rt.fv(f, "is_adult", live(f.args[0])))), subtract));
		yield* g.callName(f, live(f.args[0]), "add_nutrition", [add(50, multiply(40, rt.fv(f, "is_adult", live(f.args[0]))))]);
	}
	if (!rt.gt(rt.sv(f, "health"), 0)) return f.dot;
	yield* g.callName(f, live(f.args[0]), "adjustBruteLoss", [add(-10, multiply(-10, rt.fv(f, "is_adult", live(f.args[0]))))]);
	yield* g.callName(f, live(f.args[0]), "updatehealth", []);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/slime/proc/attack_animal  (code/modules/mob/living/simple_animal/slime/slime.dm:249)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_animal", function* attack_animal(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.modSrcVar(f, "attacked", 10, add);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/slime/proc/attack_paw  (code/modules/mob/living/simple_animal/slime/slime.dm:255)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_paw", function* attack_paw(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.modSrcVar(f, "attacked", 10, add);
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/slime/proc/attack_larva  (code/modules/mob/living/simple_animal/slime/slime.dm:259)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_larva", function* attack_larva(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.modSrcVar(f, "attacked", 10, add);
	return f.dot;
}, true, { args: ["L"] });

// /mob/living/simple_animal/slime/proc/attack_hulk  (code/modules/mob/living/simple_animal/slime/slime.dm:263)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) return f.dot;
	yield* g.srcCall(f, "discipline_slime", live(f.args[0]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "does_attack_animation"] });

// /mob/living/simple_animal/slime/proc/attack_hand  (code/modules/mob/living/simple_animal/slime/slime.dm:271)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_hand", function* attack_hand(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src), "disarm"]);
		if (isEqual(rt.sv(f, "buckled"), live(f.args[0]))) {
			if (truthy(rt.op(f, "Prob", [], [60]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ attempts to wrestle ％！ off!</span>", [live(f.args[0]), rt.sv(f, "name")]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
			} else {
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ manages to wrestle ％！ off!</span>", [live(f.args[0]), rt.sv(f, "name")]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
				yield* g.srcCall(f, "discipline_slime", live(f.args[0]));
			}
		} else {
			if (truthy(rt.op(f, "Prob", [], [30]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ attempts to wrestle ％！ off of ＀!</span>", [live(f.args[0]), rt.sv(f, "name"), rt.sv(f, "buckled")]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
			} else {
				yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ manages to wrestle ％！ off of ＀!</span>", [live(f.args[0]), rt.sv(f, "name"), rt.sv(f, "buckled")]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
				yield* g.srcCall(f, "discipline_slime", live(f.args[0]));
			}
		}
	} else {
		if ((isEqual(rt.sv(f, "stat"), 2) && truthy(rt.len(f, rt.sv(f, "surgeries"))))) {
			if (isEqual(rt.fv(f, "a_intent", live(f.args[0])), "help")) {
				S = null;
				rt.forList(f, 0, rt.sv(f, "surgeries"), T("/datum/surgery"));
				while (($e = rt.next(f, 0)) !== undefined) {
					S = $e;
					if (truthy((yield* g.callName(f, live(S), "next_step", [live(f.args[0])])))) {
						return 1;
					}
				}
				rt.endFor(f, 0);
			}
		}
		if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
		rt.modSrcVar(f, "attacked", 10, add);
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/slime/proc/attack_alien  (code/modules/mob/living/simple_animal/slime/slime.dm:303)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attack_alien", function* attack_alien(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.modSrcVar(f, "attacked", 10, add);
	yield* g.srcCall(f, "discipline_slime", live(f.args[0]));
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/slime/proc/attackby  (code/modules/mob/living/simple_animal/slime/slime.dm:309)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, force_effect: Value = null;
	let $e: any;
	f.vars = () => [S, force_effect, $e];
	if ((isEqual(rt.sv(f, "stat"), 2) && truthy(rt.len(f, rt.sv(f, "surgeries"))))) {
		if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help")) {
			S = null;
			rt.forList(f, 0, rt.sv(f, "surgeries"), T("/datum/surgery"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				if (truthy((yield* g.callName(f, live(S), "next_step", [live(f.args[1])])))) {
					return 1;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/plasma")) ? 1 : 0)) && !truthy(rt.sv(f, "stat")))) {
		if (truthy((rt.isIn(f, live(f.args[1]), rt.sv(f, "Friends")) ? 1 : 0))) {
			rt.incAt(rt.sv(f, "Friends"), live(f.args[1]), 1, false);
		} else {
			rt.setAt(rt.sv(f, "Friends"), live(f.args[1]), 1);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You feed the slime the plasma. It chirps happily.</span>"]);
		yield* g.callName(f, (S = live(f.args[0])), "use", [1]);
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "force", live(f.args[0])), 0)) {
		rt.modSrcVar(f, "attacked", 10, add);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			yield* g.callName(f, live(f.args[1]), "do_attack_animation", [live(f.src)]);
			yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='danger'>＀ passes right through ＀!</span>", [live(f.args[0]), live(f.src)])]);
			return live(f.dot);
		}
		if ((truthy(rt.sv(f, "Discipline")) && truthy(rt.op(f, "Prob", [], [50])))) {
			rt.setSv(f, "Discipline", 0);
		}
	}
	if (rt.ge(rt.fv(f, "force", live(f.args[0])), 3)) {
		force_effect = multiply(2, rt.fv(f, "force", live(f.args[0])));
		if (truthy(rt.sv(f, "is_adult"))) {
			force_effect = (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "force", live(f.args[0])), 2)]));
		}
		if (truthy(rt.op(f, "Prob", [], [add(10, live(force_effect))]))) {
			yield* g.srcCall(f, "discipline_slime", live(f.args[1]));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/slime/proc/apply_water  (code/modules/mob/living/simple_animal/slime/slime.dm:341)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/apply_water", function* apply_water(f: Frame) {
	yield* g.srcCall(f, "adjustBruteLoss", (yield* g.call(f, P("/proc/rand"), null, [15, 20])));
	if (!truthy(rt.sv(f, "client"))) {
		if (truthy(rt.sv(f, "Target"))) {
			rt.setSv(f, "Target", null);
			rt.incSrcVar(f, "Discipline", 1, false);
		}
	}
	return live(f.dot);
}, true);

// /mob/living/simple_animal/slime/proc/examine  (code/modules/mob/living/simple_animal/slime/slime.dm:350)
rt.def("/mob/living/simple_animal/slime/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = null;
	let $0: any;
	f.vars = () => [msg, $0];
	msg = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	if (isEqual(rt.fv(f, "stat", live(f.src)), 2)) {
		msg = rt.modify(live(msg), "<span class='deadsay'>It is limp and unresponsive.</span>\n", add);
	} else {
		if (isEqual(rt.sv(f, "stat"), 1)) {
			msg = rt.modify(live(msg), "<span class='deadsay'>It appears to be alive but unresponsive.</span>\n", add);
		}
		if (truthy(rt.callName(f, live(f.src), "getBruteLoss", []))) {
			msg = rt.modify(live(msg), "<span class='warning'>", add);
			if (rt.lt(rt.callName(f, live(f.src), "getBruteLoss", []), 40)) {
				msg = rt.modify(live(msg), "It has some punctures in its flesh!", add);
			} else {
				msg = rt.modify(live(msg), "<B>It has severe punctures and tears in its flesh!</B>", add);
			}
			msg = rt.modify(live(msg), "</span>\n", add);
		}
		$0 = rt.sv(f, "powerlevel");
		if (rt.inRange($0, 2, 3)) {
			msg = rt.modify(live(msg), "It is flickering gently with a little electrical activity.\n", add);
		} else if (rt.inRange($0, 4, 5)) {
			msg = rt.modify(live(msg), "It is glowing gently with moderate levels of electrical activity.\n", add);
		} else if (rt.inRange($0, 6, 9)) {
			msg = rt.modify(live(msg), "<span class='warning'>It is glowing brightly with high levels of electrical activity.</span>\n", add);
		} else if ($0 === 10) {
			msg = rt.modify(live(msg), "<span class='warning'><B>It is radiating with massive levels of electrical activity!</B></span>\n", add);
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return live(f.dot);
});

// /mob/living/simple_animal/slime/proc/discipline_slime  (code/modules/mob/living/simple_animal/slime/slime.dm:385)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/discipline_slime", function* discipline_slime(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "stat"))) {
		return live(f.dot);
	}
	if ((truthy(rt.op(f, "Prob", [], [80])) && !truthy(rt.sv(f, "client")))) {
		rt.incSrcVar(f, "Discipline", 1, true);
		if (!truthy(rt.sv(f, "is_adult"))) {
			if (isEqual(rt.sv(f, "Discipline"), 1)) {
				rt.setSv(f, "attacked", 0);
			}
		}
	}
	if (truthy(rt.sv(f, "Target"))) {
		rt.setSv(f, "Target", null);
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callSrc(f, "Feedstop", ["silent", 1], rt.Args.Named);
	}
	rt.setSv(f, "SStun", add(rt.worldTime(f), (yield* g.call(f, P("/proc/rand"), null, [20, 60]))));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/slime/proc/discipline_slime: spawn at modules/mob/living/simple_animal/slime/slime.dm:398", user);
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/slime/proc/discipline_slime, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/discipline_slime: spawn at modules/mob/living/simple_animal/slime/slime.dm:398", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "canmove", 0);
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(user), 15]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(user), 15]);
	}
	yield* g.srcCall(f, "update_canmove");
	return null;
});

// /mob/living/simple_animal/slime/proc/get_mob_buckling_height  (code/modules/mob/living/simple_animal/slime/slime.dm:417)
rt.def("/mob/living/simple_animal/slime/proc/get_mob_buckling_height", function get_mob_buckling_height(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	return 3;
}, false, { args: ["seat"] });

rt.type(4853, "/mob/living/simple_animal/slime/random", "/mob/living/simple_animal/slime", {});

// /mob/living/simple_animal/slime/random/proc/Initialize  (code/modules/mob/living/simple_animal/slime/slime.dm:421)  may sleep
rt.def("/mob/living/simple_animal/slime/random/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_colour: Value, new_is_adult: Value) {
	f.vars = () => [mapload, new_colour, new_is_adult];
	f.dot = (yield* g.callSuper(f, [live(mapload), rt.op(f, "PickUnweighted", [1], [rt.gl("slime_colours")]), rt.op(f, "Prob", [], [50])]));
	return f.dot;
}, true);
