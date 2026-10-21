// From code/modules/power/singularity/narsie.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13039, "/obj/singularity/narsie/large", "/obj/singularity/narsie", {
	name: "Nar-Sie",
	icon: rt.rsc("icons/obj/narsie.dmi"),
	pixel_x: -236,
	pixel_y: -256,
	current_size: 12,
	grav_pull: 10,
	consume_range: 12,
});

// /obj/singularity/narsie/large/proc/Initialize  (code/modules/power/singularity/narsie.dm:31)  may sleep
rt.def("/obj/singularity/narsie/large/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, alert_overlay: Value = null;
	f.vars = () => [A, alert_overlay];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/send_to_playing_players"), null, ["<span class='narsie'>NAR-SIE HAS RISEN</span>"]);
	yield* g.call(f, P("/proc/sound_to_playing_players"), null, ["im_here"]);
	if (truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) {
		alert_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/cult_effects.dmi"), "ghostalertsie"]));
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Nar-Sie has risen in ％！. Reach out to the Geometer to be given a new shell for your soul.", [rt.fv(f, "name", live(A))]), "source", live(f.src), "alert_overlay", live(alert_overlay), "action", "attack"], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/singularity/narsie/proc/narsie_spawn_animation")]);
	return f.dot;
}, true);

rt.type(13040, "/obj/singularity/narsie/large/cult", "/obj/singularity/narsie/large", {
	souls_needed: null,
	soul_goal: 0,
	souls: 0,
	resolved: 0,
});

// /obj/singularity/narsie/large/cult/proc/<init>  (code/modules/power/singularity/narsie.dm:42)
rt.def("/obj/singularity/narsie/large/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "souls_needed", rt.list());
	return f.dot;
});

// /obj/singularity/narsie/large/cult/proc/resize  (code/modules/power/singularity/narsie.dm:48)
rt.def("/obj/singularity/narsie/large/cult/proc/resize", function resize(f: Frame, ratio: Value) {
	let ntransform: Value = null;
	f.vars = () => [ntransform];
	rt.callName(f, (ntransform = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")])), "Scale", [live(ratio)]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(ntransform), "time", 40, "easing", 192]);
	return f.dot;
});

// /obj/singularity/narsie/large/cult/proc/Initialize  (code/modules/power/singularity/narsie.dm:53)  may sleep
rt.def("/obj/singularity/narsie/large/cult/proc/Initialize", function* Initialize(f: Frame) {
	let cult_mind: Value = null, L: Value = null, player: Value = null;
	let $e: any;
	f.vars = () => [cult_mind, L, player, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setGl("cult_narsie", live(f.src));
	yield* g.call(f, P("/proc/deltimer"), null, [rt.gl("blood_target_reset_timer")]);
	rt.setGl("blood_target", live(f.src));
	yield* g.srcCall(f, "resize", 0.6000000238418579);
	cult_mind = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		cult_mind = $e;
		if (truthy((rt.istype(rt.fv(f, "current", live(cult_mind)), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, (L = rt.fv(f, "current", live(cult_mind))), "narsie_act", []);
		}
	}
	rt.endFor(f, 0);
	player = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		player = $e;
		if (((!isEqual(rt.fv(f, "stat", live(player)), 2) && isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(player))), 2)) && !truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(player)]))))) {
			rt.setAt(rt.sv(f, "souls_needed"), live(player), 1);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "soul_goal", (yield* g.call(f, P("/proc/round"), null, [add(1, multiply(rt.length(rt.sv(f, "souls_needed")), 0.6000000238418579))])));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/singularity/narsie/large/cult/proc/begin_the_end")]);
	return f.dot;
}, true);

// /obj/singularity/narsie/large/cult/proc/begin_the_end  (code/modules/power/singularity/narsie.dm:69)  may sleep
rt.def("/obj/singularity/narsie/large/cult/proc/begin_the_end", function* begin_the_end(f: Frame) {
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	yield* g.call(f, P("/proc/priority_announce"), null, ["An acausal dimensional event has been detected in your sector. Event has been flagged EXTINCTION-CLASS. Directing all available assets toward simulating solutions. SOLUTION ETA: 60 SECONDS.", "Central Command Higher Dimensional Affairs", rt.rsc("sound/misc/airraid.ogg")]);
	yield* g.call(f, P("/proc/sleep"), null, [550]);
	yield* g.call(f, P("/proc/priority_announce"), null, ["Simulations on acausal dimensional event complete. Deploying solution package now. Deployment ETA: TWO MINUTES. ", "Central Command Higher Dimensional Affairs"]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	yield* g.call(f, P("/proc/set_security_level"), null, ["delta"]);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	rt.setFv(f, "lockdown", rt.gl("SSshuttle"), 1);
	yield* g.call(f, P("/proc/sleep"), null, [1150]);
	if (!isEqual(rt.sv(f, "resolved"), 0)) return f.dot;
	rt.setSv(f, "resolved", 1);
	rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/machines/alarm.ogg")]))], false);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/cult_ending_helper")])), 120]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/ending_helper")])), 220]);
	return f.dot;
}, true);

// /obj/singularity/narsie/large/cult/proc/Destroy  (code/modules/power/singularity/narsie.dm:86)  may sleep
rt.def("/obj/singularity/narsie/large/cult/proc/Destroy", function* Destroy(f: Frame) {
	rt.setGl("cult_narsie", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /proc/ending_helper  (code/modules/power/singularity/narsie.dm:89)
rt.def("/proc/ending_helper", function ending_helper(f: Frame) {
	rt.setFv(f, "force_ending", rt.gl("SSticker"), 1);
	return f.dot;
});

// /proc/cult_ending_helper  (code/modules/power/singularity/narsie.dm:92)  may sleep
rt.def("/proc/cult_ending_helper", function* cult_ending_helper(f: Frame, no_explosion: Value) {
	f.vars = () => [no_explosion];
	if (live(no_explosion) === null) {
		no_explosion = 0;
	}
	yield* g.callName(f, rt.gl("SSticker"), "station_explosion_cinematic", [live(no_explosion), "cult", null]);
	return f.dot;
}, true);

// /obj/singularity/narsie/large/proc/attack_ghost  (code/modules/power/singularity/narsie.dm:96)  may sleep
rt.def("/obj/singularity/narsie/large/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/makeNewConstruct"), null, [null, T("/mob/living/simple_animal/hostile/construct/harvester"), null, live(user), "cultoverride", 1, "loc_override", rt.fv(f, "loc", live(f.src))], rt.Args.Named);
	return f.dot;
}, true);

rt.type(13037, "/obj/singularity/narsie", "/obj/singularity", {
	clashing: 0,
	light_power: 0.7,
	light_range: 15,
	light_color: "#ff0000",
	name: "Nar-sie's Avatar",
	desc: "Your mind begins to bubble and ooze as it tries to comprehend what it sees.",
	icon: rt.rsc("icons/obj/magic_terror.dmi"),
	pixel_x: -89,
	pixel_y: -85,
	density: 0,
	current_size: 9,
	contained: 0,
	dissipate: 0,
	move_self: 1,
	grav_pull: 5,
	consume_range: 6,
	gender: "female",
});

// /obj/singularity/narsie/proc/process  (code/modules/power/singularity/narsie.dm:102)  may sleep
rt.def("/obj/singularity/narsie/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "clashing"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "eat");
	if ((!truthy(rt.sv(f, "target")) || truthy(rt.op(f, "Prob", [], [5])))) {
		yield* g.srcCall(f, "pickcultist");
	}
	if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/structure/destructible/clockwork/massive/ratvar")) ? 1 : 0))) {
		yield* g.srcCall(f, "move", rt.getDir(f, live(f.src), rt.sv(f, "target")));
	} else {
		yield* g.srcCall(f, "move");
	}
	if (!truthy(rt.op(f, "Prob", [], [25]))) return f.dot;
	yield* g.srcCall(f, "mezzer");
	return f.dot;
}, true, { waitfor: false });

// /obj/singularity/narsie/proc/Bump  (code/modules/power/singularity/narsie.dm:118)  may sleep
rt.def("/obj/singularity/narsie/proc/Bump", function* Bump(f: Frame, A: Value) {
	let _T: Value = null;
	f.vars = () => [A, _T];
	if (isEqual((_T = rt.getStep(f, live(A), 0)), rt.sv(f, "loc"))) {
		_T = rt.getStep(f, live(A), rt.fv(f, "dir", live(A)));
	}
	yield* g.srcCall(f, "forceMove", live(_T));
	return f.dot;
}, true);

// /obj/singularity/narsie/proc/mezzer  (code/modules/power/singularity/narsie.dm:125)  may sleep
rt.def("/obj/singularity/narsie/proc/mezzer", function* mezzer(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [rt.sv(f, "consume_range"), live(f.src)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "stat", live(M)), 0)) {
			if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='cultsmall'>You feel conscious thought crumble away in an instant as you gaze upon ＀...</span>", [rt.fv(f, "name", live(f.src))])]);
				yield* g.callName(f, live(M), "apply_effect", [60, "stun"]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/singularity/narsie/proc/consume  (code/modules/power/singularity/narsie.dm:133)  may sleep
rt.def("/obj/singularity/narsie/proc/consume", function* consume(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) return f.dot;
	yield* g.callName(f, live(A), "narsie_act", []);
	return f.dot;
}, true);

// /obj/singularity/narsie/proc/pickcultist  (code/modules/power/singularity/narsie.dm:142)
rt.def("/obj/singularity/narsie/proc/pickcultist", function pickcultist(f: Frame) {
	let cultists: Value = null, noncultists: Value = null, enemy: Value = null, food: Value = null, pos: Value = null, ghost: Value = null;
	let $e: any;
	f.vars = () => [cultists, noncultists, enemy, food, pos, ghost, $e];
	cultists = rt.list();
	noncultists = rt.list();
	enemy = null;
	rt.forList(f, 0, rt.gl("poi_list"), T("/obj/structure/destructible/clockwork/massive/ratvar"));
	while (($e = rt.next(f, 0)) !== undefined) {
		enemy = $e;
		if (!isEqual(rt.fv(f, "z", live(enemy)), rt.sv(f, "z"))) {
			continue;
		}
		rt.callSrc(f, "acquire", [live(enemy)]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	food = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		food = $e;
		if (!isEqual(rt.gv(f, "z", (pos = rt.getStep(f, live(food), 0))), rt.fv(f, "z", live(f.src)))) {
			continue;
		}
		if (truthy(rt.call(f, P("/proc/iscultist"), null, [live(food)]))) {
			cultists = rt.modify(live(cultists), live(food), add);
		} else {
			noncultists = rt.modify(live(noncultists), live(food), add);
		}
		if (truthy(rt.len(f, live(cultists)))) {
			rt.callSrc(f, "acquire", [rt.op(f, "PickUnweighted", [1], [live(cultists)])]);
			return live(f.dot);
		}
		if (truthy(rt.len(f, live(noncultists)))) {
			rt.callSrc(f, "acquire", [rt.op(f, "PickUnweighted", [1], [live(noncultists)])]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	ghost = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ghost = $e;
		if (!truthy(rt.fv(f, "client", live(ghost)))) {
			continue;
		}
		if (!isEqual(rt.gv(f, "z", (pos = rt.getStep(f, live(ghost), 0))), rt.fv(f, "z", live(f.src)))) {
			continue;
		}
		cultists = rt.modify(live(cultists), live(ghost), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(cultists)))) return f.dot;
	rt.callSrc(f, "acquire", [rt.op(f, "PickUnweighted", [1], [live(cultists)])]);
	return live(f.dot);
});

// /obj/singularity/narsie/proc/acquire  (code/modules/power/singularity/narsie.dm:182)
rt.def("/obj/singularity/narsie/proc/acquire", function acquire(f: Frame, food: Value) {
	if (isEqual(live(food), rt.sv(f, "target"))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class='cultsmall'>NAR-SIE HAS LOST INTEREST IN YOU.</span>"]);
	rt.setSv(f, "target", live(food));
	if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class ='cult'>NAR-SIE HUNGERS FOR YOUR SOUL.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class ='cult'>NAR-SIE HAS CHOSEN YOU TO LEAD HER TO HER NEXT MEAL.</span>"]);
	}
	return f.dot;
});

rt.type(13041, "/obj/singularity/narsie/wizard", "/obj/singularity/narsie", {
	grav_pull: 0,
});

// /obj/singularity/narsie/wizard/proc/eat  (code/modules/power/singularity/narsie.dm:199)  may sleep
rt.def("/obj/singularity/narsie/wizard/proc/eat", function* eat(f: Frame) {
	let X: Value = null;
	let $e: any;
	f.vars = () => [X, $e];
	X = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [rt.sv(f, "consume_range"), live(f.src), 1])), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [live(X)]))) || truthy((rt.istype(live(X), T("/atom/movable")) ? 1 : 0)))) {
			yield* g.srcCall(f, "consume", live(X));
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /obj/singularity/narsie/proc/narsie_spawn_animation  (code/modules/power/singularity/narsie.dm:208)  may sleep
rt.def("/obj/singularity/narsie/proc/narsie_spawn_animation", function* narsie_spawn_animation(f: Frame) {
	rt.setSv(f, "icon", rt.rsc("icons/obj/narsie_spawn_anim.dmi"));
	yield* g.srcCall(f, "setDir", 2);
	rt.setSv(f, "move_self", 0);
	yield* g.call(f, P("/proc/flick"), null, ["narsie_spawn_anim", live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [11]);
	rt.setSv(f, "move_self", 1);
	rt.setSv(f, "icon", rt.initial(f, live(f.src), "icon"));
	return f.dot;
}, true);
