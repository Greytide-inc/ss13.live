// From code/game/gamemodes/devil/imp/imp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5046, "/mob/living/simple_animal/imp", "/mob/living/simple_animal", {
	boost: 0,
	consumed_mobs: null,
	playstyle_string: "<B><font size=3 color='red'>You are an imp,</font> a mischevious creature from hell. You are the lowest rank on the hellish totem pole  Though you are not obligated to help, perhaps by aiding a higher ranking devil, you might just get a promotion.  However, you are incapable\tof intentionally harming a fellow devil.</B>",
	name: "imp",
	real_name: "imp",
	desc: "A large, menacing creature covered in armored black scales.",
	speak_emote: null,
	emote_hear: null,
	response_help: "thinks better of touching",
	response_disarm: "flails at",
	response_harm: "punches",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "imp",
	icon_living: "imp",
	speed: 1,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	atmos_requirements: null,
	minbodytemp: 250,
	maxbodytemp: 1e+31,
	faction: null,
	attacktext: "wildly tears into",
	maxHealth: 200,
	health: 200,
	healable: 0,
	environment_smash: 1,
	obj_damage: 40,
	melee_damage_lower: 10,
	melee_damage_upper: 15,
	see_in_dark: 8,
	lighting_alpha: 128,
	bloodcrawl: 2,
});

// /mob/living/simple_animal/imp/proc/<init>  (code/game/gamemodes/devil/imp/imp.dm:36)
rt.def("/mob/living/simple_animal/imp/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "consumed_mobs", rt.list());
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("cackles"));
	rt.setSv(f, "emote_hear", rt.list("cackles", "screeches"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("hell"));
	return f.dot;
});

// /mob/living/simple_animal/imp/proc/Initialize  (code/game/gamemodes/devil/imp/imp.dm:42)  may sleep
rt.def("/mob/living/simple_animal/imp/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "boost", add(rt.worldTime(f), 30));
	return f.dot;
}, true);

// /mob/living/simple_animal/imp/proc/Life  (code/game/gamemodes/devil/imp/imp.dm:46)
rt.def("/mob/living/simple_animal/imp/proc/Life", function Life(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "boost"), rt.worldTime(f))) {
		rt.setSv(f, "speed", 1);
	} else {
		rt.setSv(f, "speed", 0);
	}
	return f.dot;
}, false, { waitfor: false });

// /mob/living/simple_animal/imp/proc/death  (code/game/gamemodes/devil/imp/imp.dm:53)  may sleep
rt.def("/mob/living/simple_animal/imp/proc/death", function* death(f: Frame) {
	yield* g.callSuper(f, [1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/demon_dies.ogg"), 200, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ screams in agony as it sublimates into a sulfurous smoke.</span>", [live(f.src)]));
	yield* g.srcCall(f, "ghostize");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
