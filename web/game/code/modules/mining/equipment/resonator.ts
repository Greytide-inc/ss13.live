// From code/modules/mining/equipment/resonator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7542, "/obj/item/weapon/resonator", "/obj/item/weapon", {
	burst_time: 30,
	fieldlimit: 4,
	fields: null,
	quick_burst_mod: 0.8,
	name: "resonator",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "resonator",
	item_state: "resonator",
	desc: "A handheld device that creates small fields of energy that resonate until they detonate, crushing rock. It's more effective in a vacuum.",
	w_class: 3,
	force: 15,
	throwforce: 10,
	origin_tech: "magnets=3;engineering=3",
});

// /obj/item/weapon/resonator/proc/<init>  (code/modules/mining/equipment/resonator.dm:13)
rt.def("/obj/item/weapon/resonator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "fields", rt.list());
	return f.dot;
});

// /obj/item/weapon/resonator/proc/attack_self  (code/modules/mining/equipment/resonator.dm:27)
rt.def("/obj/item/weapon/resonator/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (isEqual(rt.sv(f, "burst_time"), 50)) {
		rt.setSv(f, "burst_time", 30);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>You set the resonator's fields to detonate after 3 seconds.</span>"]);
	} else {
		rt.setSv(f, "burst_time", 50);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='info'>You set the resonator's fields to detonate after 5 seconds.</span>"]);
	}
	return f.dot;
});

// /obj/item/weapon/resonator/proc/CreateResonance  (code/modules/mining/equipment/resonator.dm:35)  may sleep
rt.def("/obj/item/weapon/resonator/proc/CreateResonance", function* CreateResonance(f: Frame, target: Value, user: Value) {
	let _T: Value = null, R: Value = null;
	f.vars = () => [target, user, _T, R];
	_T = rt.getStep(f, live(target), 0);
	if (truthy((R = rt.locateIn(f, T("/obj/effect/temp_visual/resonance"), live(_T))))) {
		rt.setFv(f, "damage_multiplier", live(R), rt.sv(f, "quick_burst_mod"));
		yield* g.callName(f, live(R), "burst", []);
		return live(f.dot);
	}
	if (!rt.lt(rt.length(rt.sv(f, "fields")), rt.sv(f, "fieldlimit"))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/resonance"), [live(_T), live(user), live(f.src), rt.sv(f, "burst_time")]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	return f.dot;
}, true);

// /obj/item/weapon/resonator/proc/pre_attackby  (code/modules/mining/equipment/resonator.dm:46)  may sleep
rt.def("/obj/item/weapon/resonator/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	f.vars = () => [target, user, params];
	if (truthy((yield* g.srcCall(f, "check_allowed_items", live(target), 1)))) {
		yield* g.srcCall(f, "CreateResonance", live(target), live(user));
	}
	return 1;
}, true);

rt.type(11672, "/obj/effect/temp_visual/resonance", "/obj/effect/temp_visual", {
	resonance_damage: 20,
	damage_multiplier: 1,
	creator: null,
	res: null,
	duration: 50,
	name: "resonance field",
	desc: "A resonating field that significantly damages anything inside of it when the field eventually ruptures. More damaging in low pressure environments.",
	icon_state: "shield1",
	layer: 4.5,
});

// /obj/effect/temp_visual/resonance/proc/Initialize  (code/modules/mining/equipment/resonator.dm:63)  may sleep
rt.def("/obj/effect/temp_visual/resonance/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "duration", live(f.args[3]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "creator", live(f.args[1]));
	rt.setSv(f, "res", live(f.args[2]));
	if (truthy(rt.sv(f, "res"))) {
		rt.modField(f, rt.sv(f, "res"), "fields", live(f.src), add);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/resonator_fire.ogg"), 50, 1]);
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 0.75));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5), "time", rt.sv(f, "duration")]);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/temp_visual/resonance/proc/burst")])), rt.sv(f, "duration"), 8])));
	return f.dot;
}, true, { args: ["mapload", "set_creator", "set_resonator", "set_duration"] });

// /obj/effect/temp_visual/resonance/proc/Destroy  (code/modules/mining/equipment/resonator.dm:77)  may sleep
rt.def("/obj/effect/temp_visual/resonance/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "res"))) {
		(rt.modField(f, rt.sv(f, "res"), "fields", live(f.src), subtract));
		rt.setSv(f, "res", null);
	}
	rt.setSv(f, "creator", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/temp_visual/resonance/proc/check_pressure  (code/modules/mining/equipment/resonator.dm:83)
rt.def("/obj/effect/temp_visual/resonance/proc/check_pressure", function check_pressure(f: Frame, proj_turf: Value) {
	let environment: Value = null, pressure: Value = null;
	f.vars = () => [proj_turf, environment, pressure];
	if (!truthy(live(proj_turf))) {
		proj_turf = rt.getStep(f, live(f.src), 0);
	}
	if (!truthy((rt.istype(live(proj_turf), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	environment = rt.callName(f, live(proj_turf), "return_air", []);
	pressure = rt.callName(f, live(environment), "return_pressure", []);
	rt.setSv(f, "resonance_damage", rt.initial(f, live(f.src), "resonance_damage"));
	if (rt.lt(live(pressure), 50)) {
		rt.setSv(f, "name", fmt("strong ＀", [rt.initial(f, live(f.src), "name")]));
		(rt.modSrcVar(f, "resonance_damage", 3, multiply));
	} else {
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	}
	(rt.modSrcVar(f, "resonance_damage", rt.sv(f, "damage_multiplier"), multiply));
	return f.dot;
});

// /obj/effect/temp_visual/resonance/proc/burst  (code/modules/mining/equipment/resonator.dm:98)  may sleep
rt.def("/obj/effect/temp_visual/resonance/proc/burst", function* burst(f: Frame) {
	let _T: Value = null, M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, M, L, $e];
	yield* g.new_(f, T("/obj/effect/temp_visual/resonance_crush"), [(_T = rt.getStep(f, live(f.src), 0))]);
	if (truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.callName(f, (M = live(_T)), "gets_drilled", [rt.sv(f, "creator")]);
	}
	yield* g.srcCall(f, "check_pressure", live(_T));
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1]);
	L = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy(rt.sv(f, "creator"))) {
			yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "creator"), live(L), "used a resonator field on", "resonator"]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＀ ruptured with you in it!</span>", [live(f.src)])]);
		yield* g.callName(f, live(L), "apply_damage", [rt.sv(f, "resonance_damage"), "brute"]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11673, "/obj/effect/temp_visual/resonance_crush", "/obj/effect/temp_visual", {
	duration: 4,
	icon_state: "shield1",
	layer: 4.5,
});

// /obj/effect/temp_visual/resonance_crush/proc/Initialize  (code/modules/mining/equipment/resonator.dm:118)  may sleep
rt.def("/obj/effect/temp_visual/resonance_crush/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.5));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 0.10000000149011612), "alpha", 50, "time", 4]);
	return f.dot;
}, true);
