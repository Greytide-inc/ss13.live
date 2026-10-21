// From code/game/gamemodes/miniantags/bot_swarm/swarmer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9213, "/obj/item/device/unactivated_swarmer", "/obj/item/device", {
	name: "unactivated swarmer",
	desc: "A currently unactivated swarmer. Swarmers can self activate at any time, it would be wise to immediately dispose of this.",
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	icon_state: "swarmer_unactivated",
	origin_tech: "bluespace=4;materials=4;programming=7",
	materials: null,
});

// /obj/item/device/unactivated_swarmer/proc/<init>  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:8)
rt.def("/obj/item/device/unactivated_swarmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 4000]));
	return f.dot;
});

// /obj/item/device/unactivated_swarmer/proc/Initialize  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:12)  may sleep
rt.def("/obj/item/device/unactivated_swarmer/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "crit_fail"))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("An unactivated swarmer has been created in ＀!", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), "enter_link", fmt("<a href=?src=＃;ghostjoin=1>(Click to enter)</a>", [live(f.src)]), "source", live(f.src), "action", "attack"], rt.Args.Named);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/device/unactivated_swarmer/proc/Topic  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:17)  may sleep
rt.def("/obj/item/device/unactivated_swarmer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "ghostjoin"))) return f.dot;
	if (!truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "attack_ghost", live(ghost));
	return f.dot;
}, true);

// /obj/item/device/unactivated_swarmer/proc/attackby  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:23)  may sleep
rt.def("/obj/item/device/unactivated_swarmer/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.sv(f, "crit_fail")))) return f.dot;
	yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ deactivates ＀.</span>", [rt.fv(f, "name", live(f.usr)), live(f.src)]), fmt("<span class='notice'>After some fiddling, you find a way to disable ＀'s power source.</span>", [live(f.src)]), "<span class='italics'>You hear clicking.</span>"]);
	rt.setSv(f, "name", "deactivated swarmer");
	rt.setSv(f, "desc", "A shell of swarmer that was completely powered down. It can no longer activate itself.");
	rt.setSv(f, "crit_fail", 1);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/unactivated_swarmer/proc/attack_ghost  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:34)  may sleep
rt.def("/obj/item/device/unactivated_swarmer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let be_swarmer: Value = null, S: Value = null;
	f.vars = () => [user, be_swarmer, S];
	if (truthy(rt.sv(f, "crit_fail"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "This swarmer shell is completely depowered. You cannot activate it."]);
		return live(f.dot);
	}
	if (isEqual((be_swarmer = (yield* g.call(f, P("/proc/alert"), null, ["Become a swarmer? (Warning, You can no longer be cloned!)", null, "Yes", "No"]))), "No")) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "crit_fail"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Swarmer has been depowered."]);
		return live(f.dot);
	}
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Swarmer has been occupied by someone else."]);
		return live(f.dot);
	}
	rt.setFv(f, "key", (S = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/swarmer"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), rt.fv(f, "key", live(user)));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4883, "/mob/living/simple_animal/hostile/swarmer", "/mob/living/simple_animal/hostile", {
	resources: 0,
	max_resources: 100,
	login_text_dump: "\n\t<b>You are a swarmer, a weapon of a long dead civilization. Until further orders from your original masters are received, you must continue to consume and replicate.</b>\n\t<b>Clicking on any object will try to consume it, either deconstructing it into its components, destroying it, or integrating any materials it has into you if successful.</b>\n\t<b>Ctrl-Clicking on a mob will attempt to remove it from the area and place it in a safe environment for storage.</b>\n\t<b>Objectives:</b>\n\t1. Consume resources and replicate until there are no more resources left.\n\t2. Ensure that this location is fit for invasion at a later date; do not perform actions that would render it dangerous or inhospitable.\n\t3. Biological resources will be harvested at a later date; do not harm them.\n\t",
	initial_language_holder: rt.typePath("/datum/language_holder/swarmer"),
	hud_possible: null,
	pass_flags: 1,
	light_color: "#7DE1E1",
	name: "Swarmer",
	unique_name: 1,
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	desc: "A robot of unknown design, they seek only to consume materials and replicate themselves indefinitely.",
	speak_emote: null,
	bubble_icon: "swarmer",
	health: 40,
	maxHealth: 40,
	status_flags: 8,
	icon_state: "swarmer",
	icon_living: "swarmer",
	icon_dead: "swarmer_unactivated",
	icon_gib: null,
	wander: 0,
	harm_intent_damage: 5,
	minbodytemp: 0,
	maxbodytemp: 500,
	atmos_requirements: null,
	unsuitable_atmos_damage: 0,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	melee_damage_type: "stamina",
	damage_coeff: null,
	obj_damage: 0,
	environment_smash: 0,
	attacktext: "shocks",
	attack_sound: rt.rsc("sound/effects/empulse.ogg"),
	friendly: "pinches",
	speed: 0,
	faction: null,
	AIStatus: 3,
	mob_size: 0,
	ventcrawler: 2,
	ranged: 1,
	projectiletype: rt.typePath("/obj/item/projectile/beam/disabler"),
	ranged_cooldown_time: 20,
	projectilesound: rt.rsc("sound/weapons/taser2.ogg"),
	loot: null,
	del_on_death: 1,
	deathmessage: "explodes with a sharp pop!",
});

// /mob/living/simple_animal/hostile/swarmer/proc/<init>  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:64)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "hud_possible", rt.list("15", "8", "9"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("tones"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("swarmer"));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/item/weapon/ore/bluespace_crystal")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/proc/Login  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:117)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "login_text_dump")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/Initialize  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:121)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.vars = () => [diag_hud];
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modSrcVar(f, "verbs", P("/mob/living/verb/pulled"), subtract));
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_health  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:129)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "9");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), fmt("huddiag＀", [rt.call(f, P("/proc/RoundDiagBar"), null, [divide(rt.sv(f, "health"), rt.sv(f, "maxHealth"))])]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_status  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:135)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = null, I: Value = null;
	f.vars = () => [holder, I];
	holder = rt.at(rt.sv(f, "hud_list"), "8");
	I = rt.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state"), rt.sv(f, "dir")]);
	rt.setFv(f, "pixel_y", live(holder), subtract(rt.callName(f, live(I), "Height", []), rt.fv(f, "icon_size", rt.world())));
	rt.setFv(f, "icon_state", live(holder), "hudstat");
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/proc/Stat  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:140)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, ["Resources:", rt.sv(f, "resources")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/handle_inherent_channels  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:145)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame) {
	if (isEqual(live(f.args[1]), "binary")) {
		yield* g.srcCall(f, "swarmer_chat", live(f.args[0]));
		return 3;
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["message", "message_mode"] });

// /mob/living/simple_animal/hostile/swarmer/proc/get_spans  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:152)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /mob/living/simple_animal/hostile/swarmer/proc/emp_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:155)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/emp_act", function* emp_act(f: Frame) {
	if (rt.gt(rt.sv(f, "health"), 1)) {
		yield* g.srcCall(f, "adjustHealth", subtract(rt.sv(f, "health"), 1));
	} else {
		yield* g.srcCall(f, "death");
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/CanPass  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:161)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CanPass", function CanPass(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/projectile/beam/disabler")) ? 1 : 0))) {
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) {
		return 1;
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["O"] });

// /mob/living/simple_animal/hostile/swarmer/proc/AttackingTarget  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:169)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
		return (yield* g.callName(f, rt.sv(f, "target"), "swarmer_act", [live(f.src)]));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/CtrlClickOn  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:175)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	f.vars = () => [A];
	yield* g.srcCall(f, "face_atom", live(A));
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "next_move"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(A), "Adjacent", [live(f.src)])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "swarmer_act", [live(f.src)]);
	return f.dot;
}, true);

// /atom/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:185)  may sleep
rt.def("/atom/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:192)  may sleep
rt.def("/obj/proc/swarmer_act", function* swarmer_act(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:197)  may sleep
rt.def("/obj/item/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	return (yield* g.callName(f, live(S), "Integrate", [live(f.src)]));
}, true);

// /obj/item/proc/IntegrateAmount  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:200)
rt.def("/obj/item/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	if ((truthy(rt.at(rt.sv(f, "materials"), "$metal")) || truthy(rt.at(rt.sv(f, "materials"), "$glass")))) {
		return 1;
	}
	return 0;
});

rt.type(12467, "/obj/structure/swarmer", "/obj/structure", {
	lon_range: 1,
	light_color: "#7DE1E1",
	anchored: 1,
	name: "swarmer ui",
	desc: null,
	gender: "neuter",
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	icon_state: "ui_light",
	layer: 4,
	resistance_flags: 50,
	obj_integrity: 30,
	max_integrity: 30,
});

// /obj/structure/swarmer/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:232)  may sleep
rt.def("/obj/structure/swarmer/proc/swarmer_act", function* swarmer_act(f: Frame) {
	if (isEqual(rt.fv(f, "AIStatus", live(f.args[0])), 1)) {
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["S"] });

rt.type(11699, "/obj/effect/decal/cleanable/robot_debris", "/obj/effect/decal/cleanable", {
	name: "robot debris",
	desc: "It's a useless heap of junk... <i>or is it?</i>",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "gib1",
	layer: 2.5,
	random_icon_states: null,
	blood_state: "oil",
	bloodiness: 100,
	mergeable_decal: 0,
});

// /obj/effect/decal/cleanable/robot_debris/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:241)  may sleep
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 1;
}, true);

// /turf/open/floor/plating/lava/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:249)  may sleep
rt.def("/turf/open/floor/plating/lava/proc/swarmer_act", function* swarmer_act(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "is_safe")))) {
		yield* g.new_(f, T("/obj/structure/lattice/catwalk/swarmer_catwalk"), [live(f.src)]);
	}
	return 0;
}, true);

// /obj/machinery/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:260)  may sleep
rt.def("/obj/machinery/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DismantleMachine", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/light/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:264)  may sleep
rt.def("/obj/machinery/light/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/door/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:268)  may sleep
rt.def("/obj/machinery/door/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	let isonshuttle: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [S, isonshuttle, _T, $e];
	isonshuttle = (rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), T("/area/shuttle")) ? 1 : 0);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) || (!truthy(live(isonshuttle)) && (truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/space")) ? 1 : 0))))) || (truthy(live(isonshuttle)) && !truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>"]);
			rt.setFv(f, "target", live(S), null);
			return 0;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/camera/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:278)  may sleep
rt.def("/obj/machinery/camera/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	yield* g.srcCall(f, "toggle_cam", live(S), 0);
	return 1;
}, true);

// /obj/machinery/particle_accelerator/control_box/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:283)  may sleep
rt.def("/obj/machinery/particle_accelerator/control_box/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/field/generator/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:287)  may sleep
rt.def("/obj/machinery/field/generator/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/gravity_generator/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:291)  may sleep
rt.def("/obj/machinery/gravity_generator/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/vending/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:295)  may sleep
rt.def("/obj/machinery/vending/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/turretid/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:299)  may sleep
rt.def("/obj/machinery/turretid/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisIntegrate", [live(f.src)]);
	return 1;
}, true);

// /obj/machinery/chem_dispenser/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:303)
rt.def("/obj/machinery/chem_dispenser/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>The volatile chemicals in this machine would destroy us. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/nuclearbomb/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:307)
rt.def("/obj/machinery/nuclearbomb/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This device's destruction would result in the extermination of everything in the area. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/dominator/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:311)
rt.def("/obj/machinery/dominator/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This device is attempting to corrupt our entire network; attempting to interact with it is too risky. Aborting.</span>"]);
	return 0;
});

// /obj/effect/decal/cleanable/crayon/gang/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:315)
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Searching... sensor malfunction! Target lost. Aborting.</span>"]);
	return 0;
});

// /obj/effect/rune/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:319)
rt.def("/obj/effect/rune/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Searching... sensor malfunction! Target lost. Aborting.</span>"]);
	return 0;
});

// /obj/structure/reagent_dispensers/fueltank/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:323)
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Destroying this object would cause a chain reaction. Aborting.</span>"]);
	return 0;
});

// /obj/structure/cable/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:327)
rt.def("/obj/structure/cable/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/portable_atmospherics/canister/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:331)
rt.def("/obj/machinery/portable_atmospherics/canister/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>An inhospitable area may be created as a result of destroying this object. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/telecomms/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:335)
rt.def("/obj/machinery/telecomms/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This communications relay should be preserved, it will be a useful resource to our masters in the future. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/message_server/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:339)
rt.def("/obj/machinery/message_server/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This communications relay should be preserved, it will be a useful resource to our masters in the future. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/deepfryer/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:343)
rt.def("/obj/machinery/deepfryer/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This kitchen appliance should be preserved, it will make delicious unhealthy snacks for our masters in the future. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/power/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:347)
rt.def("/obj/machinery/power/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>"]);
	return 0;
});

// /obj/machinery/gateway/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:351)
rt.def("/obj/machinery/gateway/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This bluespace source will be important to us later. Aborting.</span>"]);
	return 0;
});

// /turf/closed/wall/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:355)  may sleep
rt.def("/turf/closed/wall/proc/swarmer_act", function* swarmer_act(f: Frame) {
	let isonshuttle: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [isonshuttle, _T, $e];
	isonshuttle = (rt.istype(rt.sv(f, "loc"), T("/area/shuttle")) ? 1 : 0);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) || (!truthy(live(isonshuttle)) && (truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/space")) ? 1 : 0))))) || (truthy(live(isonshuttle)) && !truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>"]);
			rt.setFv(f, "target", live(f.args[0]), null);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["S"] });

// /obj/structure/window/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:364)  may sleep
rt.def("/obj/structure/window/proc/swarmer_act", function* swarmer_act(f: Frame) {
	let isonshuttle: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [isonshuttle, _T, $e];
	isonshuttle = (rt.istype((yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), T("/area/shuttle")) ? 1 : 0);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (((truthy((rt.istype(live(_T), T("/turf/open/space")) ? 1 : 0)) || (!truthy(live(isonshuttle)) && (truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/space")) ? 1 : 0))))) || (truthy(live(isonshuttle)) && !truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle")) ? 1 : 0))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>"]);
			rt.setFv(f, "target", live(f.args[0]), null);
			return 1;
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["S"] });

// /obj/item/stack/cable_coil/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:373)
rt.def("/obj/item/stack/cable_coil/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This object does not contain enough materials to work with.</span>"]);
	return 0;
});

// /obj/machinery/porta_turret/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:377)
rt.def("/obj/machinery/porta_turret/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>Attempting to dismantle this machine would result in an immediate counterattack. Aborting.</span>"]);
	return 0;
});

// /mob/living/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:381)  may sleep
rt.def("/mob/living/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	f.vars = () => [S];
	yield* g.callName(f, live(S), "DisperseTarget", [live(f.src)]);
	return 1;
}, true);

// /mob/living/simple_animal/slime/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:385)
rt.def("/mob/living/simple_animal/slime/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This biological resource is somehow resisting our bluespace transceiver. Aborting.</span>"]);
	return 0;
});

rt.type(10763, "/obj/machinery/droneDispenser/swarmer", "/obj/machinery/droneDispenser", {
	name: "swarmer fabricator",
	desc: "An alien machine of unknown origin. It whirs and hums with green-blue light, the air above it shimmering.",
	icon: rt.rsc("icons/obj/machines/gateway.dmi"),
	icon_state: "toffcenter",
	icon_off: "toffcenter",
	icon_on: "toffcenter",
	icon_recharging: "toffcenter",
	icon_creating: "offcenter",
	metal_cost: 0,
	glass_cost: 0,
	cooldownTime: 300,
	maximum_idle: 0,
	dispense_type: rt.typePath("/obj/item/device/unactivated_swarmer"),
	begin_create_message: "hums softly as an interface appears above it, scrolling by at unreadable speed.",
	end_create_message: "materializes a strange shell, which drops to the ground.",
	recharging_text: "Its lights are slowly increasing in brightness.",
	work_sound: rt.rsc("sound/effects/empulse.ogg"),
	create_sound: rt.rsc("sound/effects/phasein.ogg"),
	break_sound: rt.rsc("sound/effects/empulse.ogg"),
	break_message: "slowly falls dark, lights stuttering.",
});

// /obj/machinery/droneDispenser/swarmer/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:389)
rt.def("/obj/machinery/droneDispenser/swarmer/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This object is receiving unactivated swarmer shells to help us. Aborting.</span>"]);
	return 0;
});

// /obj/structure/destructible/clockwork/massive/celestial_gateway/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:393)
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This object is multiplying existing resources. Aborting.</span>"]);
	return 0;
});

// /obj/structure/lattice/catwalk/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:397)  may sleep
rt.def("/obj/structure/lattice/catwalk/proc/swarmer_act", function* swarmer_act(f: Frame) {
	let here: Value = null, A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [here, A, C, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	here = rt.getStep(f, live(f.src), 0);
	A = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(here)));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype((C = live(A)), T("/obj/structure/cable")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>"]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["S"] });

// /obj/item/device/unactivated_swarmer/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:407)  may sleep
rt.def("/obj/item/device/unactivated_swarmer/proc/swarmer_act", function* swarmer_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 0;
}, true, { args: ["S"] });

rt.type(10771, "/obj/machinery/hydroponics/soil", "/obj/machinery/hydroponics", {
	name: "soil",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "soil",
	density: 0,
	use_power: 0,
	unwrenchable: 0,
});

// /obj/machinery/hydroponics/soil/proc/swarmer_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:414)
rt.def("/obj/machinery/hydroponics/soil/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(S), "<span class='warning'>This object does not contain enough materials to work with.</span>"]);
	return 0;
});

// /mob/living/simple_animal/hostile/swarmer/proc/Fabricate  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:420)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Fabricate", function* Fabricate(f: Frame, fabrication_object: Value, fabrication_cost: Value) {
	f.vars = () => [fabrication_object, fabrication_cost];
	if (live(fabrication_cost) === null) {
		fabrication_cost = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This is not a suitable location for fabrication. We need more space.</span>"]);
	}
	if (rt.ge(rt.sv(f, "resources"), live(fabrication_cost))) {
		(rt.modSrcVar(f, "resources", live(fabrication_cost), subtract));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You do not have the necessary resources to fabricate this object.</span>"]);
		return 0;
	}
	return (yield* g.new_(f, live(fabrication_object), [rt.sv(f, "loc")]));
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/Integrate  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:430)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Integrate", function* Integrate(f: Frame, target: Value) {
	let resource_gain: Value = null, I: Value = null, S: Value = null;
	f.vars = () => [target, resource_gain, I, S];
	resource_gain = (yield* g.callName(f, live(target), "IntegrateAmount", []));
	if (rt.gt(add(rt.sv(f, "resources"), live(resource_gain)), rt.sv(f, "max_resources"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>We cannot hold more materials!</span>"]);
		return 1;
	}
	if (truthy(live(resource_gain))) {
		rt.modSrcVar(f, "resources", live(resource_gain), add);
		yield* g.srcCall(f, "do_attack_animation", live(target));
		yield* g.srcCall(f, "changeNext_move", 8);
		rt.setFv(f, "pixel_x", (I = (yield* g.new_(f, T("/obj/effect/temp_visual/swarmer/integrate"), [rt.getStep(f, live(target), 0)]))), rt.fv(f, "pixel_x", live(target)));
		rt.setFv(f, "pixel_y", live(I), rt.fv(f, "pixel_y", live(target)));
		rt.setFv(f, "pixel_z", live(I), rt.fv(f, "pixel_z", live(target)));
		if (truthy((rt.istype(live(target), T("/obj/item/stack")) ? 1 : 0))) {
			yield* g.callName(f, (S = live(target)), "use", [1]);
			if (truthy(rt.fv(f, "amount", live(S)))) {
				return 1;
			}
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>％！ is incompatible with our internal matter recycler.</span>", [live(target)])]);
	}
	return 0;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/DisIntegrate  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:455)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DisIntegrate", function* DisIntegrate(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.new_(f, T("/obj/effect/temp_visual/swarmer/disintegration"), [rt.getStep(f, live(target), 0)]);
	yield* g.srcCall(f, "do_attack_animation", live(target));
	yield* g.srcCall(f, "changeNext_move", 8);
	yield* g.callName(f, live(target), "ex_act", [3]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/DisperseTarget  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:462)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DisperseTarget", function* DisperseTarget(f: Frame, target: Value) {
	let F: Value = null, H: Value = null, S: Value = null;
	let $0: any;
	f.vars = () => [target, F, H, S, $0];
	if (isEqual(live(target), live(f.src))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "z"), 2) && !isEqual(rt.sv(f, "z"), 5))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Our bluespace transceiver cannot locate a viable bluespace link, our teleportation abilities are useless in this area.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>Attempting to remove this being from our presence.</span>"]);
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(target), 30])))) {
		return live(f.dot);
	}
	F = null;
	$0 = rt.sv(f, "z");
	if ($0 === 2) {
		F = (yield* g.call(f, P("/proc/find_safe_turf"), null, ["zlevels", 2, "extended_safety_checks", 1], rt.Args.Named));
	} else if ($0 === 5) {
		F = (yield* g.call(f, P("/proc/find_safe_turf"), null, ["zlevels", 5, "extended_safety_checks", 1], rt.Args.Named));
	}
	if (!truthy(live(F))) {
		return live(f.dot);
	}
	H = live(target);
	if ((truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy(rt.fv(f, "handcuffed", live(H))))) {
		rt.setFv(f, "handcuffed", live(H), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/energy/used"), [live(H)])));
		yield* g.callName(f, live(H), "update_handcuffed", []);
		yield* g.call(f, P("/proc/add_logs"), null, [live(f.src), live(H), "handcuffed"]);
	}
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 0, rt.getStep(f, live(target), 0)]);
	yield* g.callName(f, live(S), "start", []);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/sparks4.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/do_teleport"), null, [live(target), live(F), 0]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/DismantleMachine  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:498)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DismantleMachine", function* DismantleMachine(f: Frame, target: Value) {
	let D: Value = null, M: Value = null, I: Value = null, N: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [target, D, M, I, N, C, $e];
	yield* g.srcCall(f, "do_attack_animation", live(target));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>We begin to dismantle this machine. We will need to be uninterrupted.</span>"]);
	rt.setFv(f, "pixel_x", (D = (yield* g.new_(f, T("/obj/effect/temp_visual/swarmer/dismantle"), [rt.getStep(f, live(target), 0)]))), rt.fv(f, "pixel_x", live(target)));
	rt.setFv(f, "pixel_y", live(D), rt.fv(f, "pixel_y", live(target)));
	rt.setFv(f, "pixel_z", live(D), rt.fv(f, "pixel_z", live(target)));
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(target), 100])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>Dismantling complete.</span>"]);
	rt.setFv(f, "amount", (M = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(target))]))), 5);
	I = null;
	rt.forList(f, 0, rt.fv(f, "component_parts", live(target)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setFv(f, "loc", live(I), rt.fv(f, "loc", live(M)));
	}
	rt.endFor(f, 0);
	rt.setFv(f, "pixel_x", (N = (yield* g.new_(f, T("/obj/effect/temp_visual/swarmer/disintegration"), [rt.getStep(f, live(target), 0)]))), rt.fv(f, "pixel_x", live(target)));
	rt.setFv(f, "pixel_y", live(N), rt.fv(f, "pixel_y", live(target)));
	rt.setFv(f, "pixel_z", live(N), rt.fv(f, "pixel_z", live(target)));
	yield* g.callName(f, live(target), "dropContents", []);
	if (truthy((rt.istype(live(target), T("/obj/machinery/computer")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "circuit", (C = live(target))))) {
			rt.setFv(f, "loc", rt.fv(f, "circuit", live(C)), rt.fv(f, "loc", live(M)));
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
	return f.dot;
}, true);

rt.type(11530, "/obj/effect/temp_visual/swarmer/disintegration", "/obj/effect/temp_visual/swarmer", {
	icon_state: "disintegrate",
	duration: 10,
});

// /obj/effect/temp_visual/swarmer/disintegration/proc/Initialize  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:531)  may sleep
rt.def("/obj/effect/temp_visual/swarmer/disintegration/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 100, 1]);
	return f.dot;
}, true);

// /obj/structure/swarmer/proc/Initialize  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:557)
rt.def("/obj/structure/swarmer/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "set_light", [rt.sv(f, "lon_range")]);
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/swarmer/proc/play_attack_sound  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:561)
rt.def("/obj/structure/swarmer/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 80, 1]);
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/structure/swarmer/proc/emp_act  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:568)  may sleep
rt.def("/obj/structure/swarmer/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12468, "/obj/structure/swarmer/trap", "/obj/structure/swarmer", {
	name: "swarmer trap",
	desc: "A quickly assembled trap that electrifies living beings and overwhelms machine sensors. Will not retain its form if damaged enough.",
	icon_state: "trap",
	obj_integrity: 10,
	max_integrity: 10,
	density: 0,
});

// /obj/structure/swarmer/trap/proc/Crossed  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:579)  may sleep
rt.def("/obj/structure/swarmer/trap/proc/Crossed", function* Crossed(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((rt.istype((L = live(f.args[0])), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/snap.ogg"), 50, 1, -1]);
			yield* g.callName(f, live(L), "electrocute_act", [0, live(f.src), 1, 1, 1]);
			if (truthy((rt.istype(live(L), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				yield* g.callName(f, live(L), "Knockdown", [100]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/swarmer/proc/CreateTrap  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:593)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateTrap", function* CreateTrap(f: Frame) {
	if (truthy(rt.locateIn(f, T("/obj/structure/swarmer/trap"), rt.sv(f, "loc")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is already a trap here. Aborting.</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "Fabricate", T("/obj/structure/swarmer/trap"), 5);
	return f.dot;
}, true, { verb: { name: "Create trap", category: "Swarmer", desc: "Creates a simple trap that will non-lethally electrocute anything that steps on it. Costs 5 resources" } });

// /mob/living/simple_animal/hostile/swarmer/proc/CreateBarricade  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:603)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateBarricade", function* CreateBarricade(f: Frame) {
	if (truthy(rt.locateIn(f, T("/obj/structure/swarmer/blockade"), rt.sv(f, "loc")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is already a blockade here. Aborting.</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "resources"), 5)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>We do not have the resources for this!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(f.src), 10])))) return f.dot;
	yield* g.srcCall(f, "Fabricate", T("/obj/structure/swarmer/blockade"), 5);
	return f.dot;
}, true, { verb: { name: "Create barricade", category: "Swarmer", desc: "Creates a barricade that will stop anything but swarmers and disabler beams from passing through." } });

rt.type(12469, "/obj/structure/swarmer/blockade", "/obj/structure/swarmer", {
	light_range: 1,
	name: "swarmer blockade",
	desc: "A quickly assembled energy blockade. Will not retain its form if damaged enough, but disabler beams and swarmers pass right through.",
	icon_state: "barricade",
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/structure/swarmer/blockade/proc/CanPass  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:622)
rt.def("/obj/structure/swarmer/blockade/proc/CanPass", function CanPass(f: Frame, O: Value) {
	if (truthy((rt.istype(live(O), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) {
		return 1;
	}
	if (!truthy((rt.istype(live(O), T("/obj/item/projectile/beam/disabler")) ? 1 : 0))) return f.dot;
	return 1;
});

// /mob/living/simple_animal/hostile/swarmer/proc/CreateSwarmer  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:631)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateSwarmer", function* CreateSwarmer(f: Frame) {
	let createtype: Value = null;
	f.vars = () => [createtype];
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>We are attempting to replicate ourselves. We will need to stand still until the process is complete.</span>"]);
	if (rt.lt(rt.sv(f, "resources"), 50)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>We do not have the resources for this!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This is not a suitable location for replicating ourselves. We need more room.</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(f.src), 100])))) return f.dot;
	if (!(truthy((createtype = (yield* g.srcCall(f, "SwarmerTypeToCreate")))) && truthy((yield* g.srcCall(f, "Fabricate", live(createtype), 50))))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/poster_being_created.ogg"), 50, 1, -1]);
	return f.dot;
}, true, { verb: { name: "Replicate", category: "Swarmer", desc: "Creates a shell for a new swarmer. Swarmers will self activate." } });

// /mob/living/simple_animal/hostile/swarmer/proc/SwarmerTypeToCreate  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:645)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/SwarmerTypeToCreate", function SwarmerTypeToCreate(f: Frame) {
	return T("/obj/item/device/unactivated_swarmer");
});

// /mob/living/simple_animal/hostile/swarmer/proc/RepairSelf  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:652)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/RepairSelf", function* RepairSelf(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>Attempting to repair damage to our body, stand by...</span>"]);
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(f.src), 100])))) return f.dot;
	yield* g.srcCall(f, "adjustHealth", -100);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='info'>We successfully repaired ourselves.</span>"]);
	return f.dot;
}, true, { verb: { name: "Self Repair", category: "Swarmer", desc: "Attempts to repair damage to our body. You will have to remain motionless until repairs are complete." } });

// /mob/living/simple_animal/hostile/swarmer/proc/ToggleLight  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:660)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/ToggleLight", function ToggleLight(f: Frame) {
	if (!truthy(rt.sv(f, "light_range"))) {
		rt.callSrc(f, "set_light", [3]);
	} else {
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/proc/swarmer_chat  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:666)
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/swarmer_chat", function swarmer_chat(f: Frame, msg: Value) {
	let rendered: Value = null, M: Value = null, link: Value = null;
	let $e: any;
	f.vars = () => [rendered, M, link, $e];
	rendered = fmt("<B>Swarm communication - ＀</b> ＀", [live(f.src), rt.callSrc(f, "say_quote", [live(msg), rt.callSrc(f, "get_spans", [])])]);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/swarmer")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [live(M), live(rendered)]);
		}
		if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(f.src)]);
			rt.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ ＀", [live(link), live(rendered)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/simple_animal/hostile/swarmer/proc/ContactSwarmers  (code/game/gamemodes/miniantags/bot_swarm/swarmer.dm:675)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/ContactSwarmers", function* ContactSwarmers(f: Frame) {
	let message: Value = null;
	f.vars = () => [message];
	if (!truthy((message = (yield* g.op(f, "Prompt", [2], [null, "Swarmer contact", "Announce to other swarmers", live(f.src), null]))))) return f.dot;
	yield* g.srcCall(f, "swarmer_chat", live(message));
	return f.dot;
}, true);
