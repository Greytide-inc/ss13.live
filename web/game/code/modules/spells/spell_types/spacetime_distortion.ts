// From code/modules/spells/spell_types/spacetime_distortion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11384, "/obj/effect/proc_holder/spell/spacetime_dist", "/obj/effect/proc_holder/spell", {
	duration: 150,
	effects: null,
	ready: 1,
	charge_max: 300,
	range: 7,
	centcom_cancast: 0,
	sound: rt.rsc("sound/effects/magic.ogg"),
	cooldown_min: 300,
	level_max: 0,
	name: "Spacetime Distortion",
	desc: "Entangle the strings of spacetime to deny easy movement around you. The strings vibrate...",
});

// /obj/effect/proc_holder/spell/spacetime_dist/proc/can_cast  (code/modules/spells/spell_types/spacetime_distortion.dm:16)
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/can_cast", function can_cast(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = live(f.usr);
	}
	if (truthy(rt.sv(f, "ready"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["user"] });

// /obj/effect/proc_holder/spell/spacetime_dist/proc/choose_targets  (code/modules/spells/spell_types/spacetime_distortion.dm:20)  may sleep
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let turfs: Value = null, turf_steps: Value = null, length: Value = null, i: Value = null, loner: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, turfs, turf_steps, length, i, loner, A, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.getLen(f, (turfs = (yield* g.call(f, P("/proc/spiral_range_turfs"), null, [rt.sv(f, "range"), live(user)])))))) {
		yield* g.srcCall(f, "revert_cast");
		return live(f.dot);
	}
	rt.setSv(f, "ready", 0);
	turf_steps = rt.list();
	length = (yield* g.call(f, P("/proc/round"), null, [multiply(rt.len(f, live(turfs)), 0.5)]));
	i = null;
	rt.forRange(f, 0, 1, live(length), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.setAt(live(turf_steps), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(turfs)])), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(turfs)])));
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(turfs)), 0)) {
		loner = rt.op(f, "PickUnweighted", [1], [live(turfs)]);
		A = (yield* g.call(f, P("/proc/get_area"), null, [live(user)]));
		rt.setAt(live(turf_steps), live(loner), rt.getStep(f, rt.op(f, "PickUnweighted", [1], [rt.fv(f, "contents", live(A))]), 0));
	}
	yield* g.callSrc(f, "perform", [null, live(turf_steps), "user", live(user)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/spacetime_dist/proc/after_cast  (code/modules/spells/spell_types/spacetime_distortion.dm:38)  may sleep
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/after_cast", function* after_cast(f: Frame, targets: Value) {
	f.vars = () => [targets];
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/spell/spacetime_dist/proc/clean_turfs")])), rt.sv(f, "duration")]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/spacetime_dist/proc/cast  (code/modules/spells/spell_types/spacetime_distortion.dm:41)  may sleep
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let V: Value = null, T0: Value = null, T1: Value = null, STD0: Value = null, STD1: Value = null;
	let $e: any;
	f.vars = () => [targets, user, V, T0, T1, STD0, STD1, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "effects", rt.list());
	V = null;
	rt.forList(f, 0, live(targets));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		T0 = live(V);
		T1 = rt.index(live(targets), live(V));
		STD0 = (yield* g.new_(f, T("/obj/effect/cross_action/spacetime_dist"), [live(T0)]));
		STD1 = (yield* g.new_(f, T("/obj/effect/cross_action/spacetime_dist"), [live(T1)]));
		rt.setFv(f, "linked_dist", live(STD0), live(STD1));
		yield* g.callName(f, live(STD0), "add_overlay", [(yield* g.callName(f, live(T1), "photograph", []))]);
		rt.setFv(f, "linked_dist", live(STD1), live(STD0));
		yield* g.callName(f, live(STD1), "add_overlay", [(yield* g.callName(f, live(T0), "photograph", []))]);
		yield* g.callName(f, live(STD1), "set_light", [4, 30, "#c9fff5"]);
		rt.modSrcVar(f, "effects", live(STD0), add);
		rt.modSrcVar(f, "effects", live(STD1), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/spacetime_dist/proc/clean_turfs  (code/modules/spells/spell_types/spacetime_distortion.dm:56)  may sleep
rt.def("/obj/effect/proc_holder/spell/spacetime_dist/proc/clean_turfs", function* clean_turfs(f: Frame) {
	let effect: Value = null;
	let $e: any;
	f.vars = () => [effect, $e];
	effect = null;
	rt.forList(f, 0, rt.sv(f, "effects"));
	while (($e = rt.next(f, 0)) !== undefined) {
		effect = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(effect)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "effects"), "Cut", []);
	rt.setSv(f, "effects", null);
	rt.setSv(f, "ready", 1);
	return f.dot;
}, true);

rt.type(12101, "/obj/effect/cross_action/spacetime_dist", "/obj/effect/cross_action", {
	linked_dist: null,
	busy: 0,
	sound: null,
	walks_left: 50,
	name: "spacetime distortion",
	desc: "A distortion in spacetime. You can hear faint music...",
	icon_state: "",
});

// /obj/effect/cross_action/spacetime_dist/proc/Initialize  (code/modules/spells/spell_types/spacetime_distortion.dm:77)
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "sound", fmt("sound/guitar/＀", [rt.call(f, P("/proc/safepick"), null, [rt.gl("guitar_notes")])]));
	rt.setSv(f, "dir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/effect/cross_action/spacetime_dist/proc/walk_link  (code/modules/spells/spell_types/spacetime_distortion.dm:82)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/walk_link", function* walk_link(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!(truthy(rt.sv(f, "linked_dist")) && rt.gt(rt.sv(f, "walks_left"), 0))) return f.dot;
	yield* g.call(f, P("/proc/flick"), null, ["purplesparkles", live(f.src)]);
	yield* g.callName(f, rt.sv(f, "linked_dist"), "get_walker", [live(AM)]);
	rt.incSrcVar(f, "walks_left", -1, true);
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/get_walker  (code/modules/spells/spell_types/spacetime_distortion.dm:89)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/get_walker", function* get_walker(f: Frame, AM: Value) {
	f.vars = () => [AM];
	rt.setSv(f, "busy", 1);
	yield* g.call(f, P("/proc/flick"), null, ["purplesparkles", live(f.src)]);
	yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.sv(f, "sound"), 70, 0]);
	rt.setSv(f, "busy", 0);
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/Crossed  (code/modules/spells/spell_types/spacetime_distortion.dm:95)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (truthy(rt.sv(f, "busy"))) return f.dot;
	yield* g.srcCall(f, "walk_link", live(AM));
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/attackby  (code/modules/spells/spell_types/spacetime_distortion.dm:99)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(W)])))) {
		yield* g.srcCall(f, "walk_link", live(W));
	} else {
		yield* g.srcCall(f, "walk_link", live(user));
	}
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/attack_hand  (code/modules/spells/spell_types/spacetime_distortion.dm:105)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "walk_link", live(user));
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/attack_paw  (code/modules/spells/spell_types/spacetime_distortion.dm:108)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "walk_link", live(user));
	return f.dot;
}, true);

// /obj/effect/cross_action/spacetime_dist/proc/Destroy  (code/modules/spells/spell_types/spacetime_distortion.dm:113)  may sleep
rt.def("/obj/effect/cross_action/spacetime_dist/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "busy", 1);
	rt.setSv(f, "linked_dist", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
