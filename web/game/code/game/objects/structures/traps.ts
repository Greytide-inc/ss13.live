// From code/game/objects/structures/traps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12881, "/obj/structure/trap", "/obj/structure", {
	last_trigger: 0,
	time_between_triggers: 600,
	charges: 1e+31,
	immune_minds: null,
	spark_system: null,
	anchored: 1,
	name: "IT'S A TRAP",
	desc: "stepping on me is a guaranteed bad day",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "trap",
	density: 0,
	alpha: 30,
}, { global: { ignore_typecache: 804 } });

// /obj/structure/trap/proc/<init>  (code/game/objects/structures/traps.dm:14)
rt.def("/obj/structure/trap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "immune_minds", rt.list());
	return f.dot;
});

// /obj/structure/trap/proc/Initialize  (code/game/objects/structures/traps.dm:19)
rt.def("/obj/structure/trap/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spark_system", rt.new_(f, T("/datum/effect_system/spark_spread"), []));
	rt.callName(f, rt.sv(f, "spark_system"), "set_up", [4, 1, live(f.src)]);
	rt.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	if (truthy(rt.gl("ignore_typecache"))) return f.dot;
	rt.setGl("ignore_typecache", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/effect"), T("/mob/dead"))]));
	return f.dot;
}, false, { args: ["mapload"] });

// /obj/structure/trap/proc/Destroy  (code/game/objects/structures/traps.dm:30)  may sleep
rt.def("/obj/structure/trap/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/trap/proc/examine  (code/game/objects/structures/traps.dm:35)  may sleep
rt.def("/obj/structure/trap/proc/examine", function* examine(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, (rt.fv(f, "mind", live(f.args[0])) && rt.fv(f, "mind", live(f.args[0]))), rt.sv(f, "immune_minds")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1)) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You reveal ＀!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "flare");
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/trap/proc/examine  (_nofile:0)
rt.def("/obj/structure/trap/proc/examine", function examine(f: Frame, user: Value) {
	return live(f.dot);
});

// /obj/structure/trap/proc/flare  (code/game/objects/structures/traps.dm:47)  may sleep
rt.def("/obj/structure/trap/proc/flare", function* flare(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ flares brightly!</span>", [live(f.src)]));
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	rt.setSv(f, "alpha", 200);
	rt.setSv(f, "last_trigger", rt.worldTime(f));
	rt.incSrcVar(f, "charges", -1, true);
	if (rt.le(rt.sv(f, "charges"), 0)) {
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 0, "time", 10]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 10, 8]);
	} else {
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", rt.initial(f, live(f.src), "alpha"), "time", rt.sv(f, "time_between_triggers")]);
	}
	return f.dot;
}, true);

// /obj/structure/trap/proc/Crossed  (code/game/objects/structures/traps.dm:59)  may sleep
rt.def("/obj/structure/trap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	f.vars = () => [AM, M];
	if (rt.gt(add(rt.sv(f, "last_trigger"), rt.sv(f, "time_between_triggers")), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(AM), rt.gl("ignore_typecache")])))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (truthy((rt.isIn(f, rt.gv(f, "mind", (M = live(AM))), rt.sv(f, "immune_minds")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	if (rt.le(rt.sv(f, "charges"), 0)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "flare");
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "trap_effect", live(AM));
	return f.dot;
}, true);

rt.type(12882, "/obj/structure/trap/stun", "/obj/structure/trap", {
	name: "shock trap",
	desc: "A trap that will shock and render you immobile. You'd better avoid it.",
	icon_state: "trap-shock",
});

// /obj/structure/trap/stun/proc/trap_effect  (code/game/objects/structures/traps.dm:83)  may sleep
rt.def("/obj/structure/trap/stun/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.callName(f, live(L), "electrocute_act", [null, 30, null, live(f.src), "safety", 1], rt.Args.Named);
	yield* g.callName(f, live(L), "Knockdown", [100]);
	return f.dot;
}, true);

rt.type(12883, "/obj/structure/trap/fire", "/obj/structure/trap", {
	name: "flame trap",
	desc: "A trap that will set you ablaze. You'd better avoid it.",
	icon_state: "trap-fire",
});

// /obj/structure/trap/fire/proc/trap_effect  (code/game/objects/structures/traps.dm:92)  may sleep
rt.def("/obj/structure/trap/fire/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'><B>Spontaneous combustion!</B></span>"]);
	yield* g.callName(f, live(L), "Knockdown", [20]);
	return f.dot;
}, true);

// /obj/structure/trap/fire/proc/flare  (code/game/objects/structures/traps.dm:96)  may sleep
rt.def("/obj/structure/trap/fire/proc/flare", function* flare(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/hotspot"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

rt.type(12884, "/obj/structure/trap/chill", "/obj/structure/trap", {
	name: "frost trap",
	desc: "A trap that will chill you to the bone. You'd better avoid it.",
	icon_state: "trap-frost",
});

// /obj/structure/trap/chill/proc/trap_effect  (code/game/objects/structures/traps.dm:106)  may sleep
rt.def("/obj/structure/trap/chill/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'><B>You're frozen solid!</B></span>"]);
	yield* g.callName(f, live(L), "Knockdown", [20]);
	(rt.modField(f, live(L), "bodytemperature", 300, subtract));
	yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/freon")]);
	return f.dot;
}, true);

rt.type(12885, "/obj/structure/trap/damage", "/obj/structure/trap", {
	name: "earth trap",
	desc: "A trap that will summon a small earthquake, just for you. You'd better avoid it.",
	icon_state: "trap-earth",
});

// /obj/structure/trap/damage/proc/trap_effect  (code/game/objects/structures/traps.dm:119)  may sleep
rt.def("/obj/structure/trap/damage/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'><B>The ground quakes beneath your feet!</B></span>"]);
	yield* g.callName(f, live(L), "Knockdown", [100]);
	yield* g.callName(f, live(L), "adjustBruteLoss", [35]);
	return f.dot;
}, true);

// /obj/structure/trap/damage/proc/flare  (code/game/objects/structures/traps.dm:124)  may sleep
rt.def("/obj/structure/trap/damage/proc/flare", function* flare(f: Frame) {
	let giant_rock: Value = null;
	f.vars = () => [giant_rock];
	yield* g.callSuper(f, [], rt.Args.Same);
	giant_rock = (yield* g.new_(f, T("/obj/structure/flora/rock"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(giant_rock)])), 200, 8]);
	return f.dot;
}, true);

rt.type(12886, "/obj/structure/trap/ward", "/obj/structure/trap", {
	time_between_triggers: 1200,
	name: "divine ward",
	desc: "A divine barrier, It looks like you could destroy it with enough effort, or wait for it to dissipate...",
	icon_state: "ward",
	density: 1,
});

// /obj/structure/trap/ward/proc/New  (code/game/objects/structures/traps.dm:138)  may sleep
rt.def("/obj/structure/trap/ward/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), rt.sv(f, "time_between_triggers"), 8]);
	return f.dot;
}, true);
