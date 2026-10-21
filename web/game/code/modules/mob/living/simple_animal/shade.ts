// From code/modules/mob/living/simple_animal/shade.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5077, "/mob/living/simple_animal/shade", "/mob/living/simple_animal", {
	initial_language_holder: rt.typePath("/datum/language_holder/construct"),
	name: "Shade",
	real_name: "Shade",
	desc: "A bound spirit",
	gender: "plural",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "shade",
	icon_living: "shade",
	maxHealth: 50,
	health: 50,
	healable: 0,
	speak_emote: null,
	emote_hear: null,
	response_help: "puts their hand through",
	response_disarm: "flails at",
	response_harm: "punches",
	speak_chance: 1,
	melee_damage_lower: 5,
	melee_damage_upper: 15,
	attacktext: "metaphysically strikes",
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	atmos_requirements: null,
	speed: -1,
	stop_automated_movement: 1,
	status_flags: 8,
	faction: null,
	movement_type: 2,
	loot: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/shade/proc/<init>  (code/modules/mob/living/simple_animal/shade.dm:12)
rt.def("/mob/living/simple_animal/shade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("hisses"));
	rt.setSv(f, "emote_hear", rt.list("wails.", "screeches."));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("cult"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/ectoplasm")));
	return f.dot;
});

// /mob/living/simple_animal/shade/proc/death  (code/modules/mob/living/simple_animal/shade.dm:35)  may sleep
rt.def("/mob/living/simple_animal/shade/proc/death", function* death(f: Frame) {
	rt.setSv(f, "deathmessage", fmt("lets out a contented sigh as ＀ form unwinds.", [(yield* g.srcCall(f, "p_their"))]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/shade/proc/canSuicide  (code/modules/mob/living/simple_animal/shade.dm:39)
rt.def("/mob/living/simple_animal/shade/proc/canSuicide", function canSuicide(f: Frame) {
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/device/soulstone")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /mob/living/simple_animal/shade/proc/attack_animal  (code/modules/mob/living/simple_animal/shade.dm:47)  may sleep
rt.def("/mob/living/simple_animal/shade/proc/attack_animal", function* attack_animal(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "can_repair_constructs", (C = live(f.args[0]))))) {
			return live(f.dot);
		}
		if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
			yield* g.srcCall(f, "adjustHealth", -25);
			yield* g.callSrc(f, "Beam", [null, live(f.args[0]), "icon_state", "sendbeam", "time", 4], rt.Args.Named);
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀ heals ％<b>！</b>.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='cult'>You heal <b>＀</b>, leaving <b>＀</b> at <b>＀/＀</b> health.</span>", [live(f.src), live(f.src), rt.sv(f, "health"), rt.sv(f, "maxHealth")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cult'>You cannot heal <b>＀</b>, as ＀ ＀ unharmed!</span>", [live(f.src), (yield* g.srcCall(f, "p_they")), (yield* g.srcCall(f, "p_are"))])]);
		}
	} else {
		if (isEqual(live(f.src), live(f.args[0]))) return f.dot;
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/shade/proc/attackby  (code/modules/mob/living/simple_animal/shade.dm:62)  may sleep
rt.def("/mob/living/simple_animal/shade/proc/attackby", function* attackby(f: Frame) {
	let SS: Value = null;
	f.vars = () => [SS];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/soulstone")) ? 1 : 0))) {
		yield* g.callName(f, (SS = live(f.args[0])), "transfer_soul", ["SHADE", live(f.src), live(f.args[1])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });
