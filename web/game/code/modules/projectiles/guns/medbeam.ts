// From code/modules/projectiles/guns/medbeam.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5279, "/obj/item/weapon/gun/medbeam", "/obj/item/weapon/gun", {
	current_target: null,
	last_check: 0,
	check_delay: 10,
	max_range: 8,
	active: 0,
	current_beam: null,
	mounted: 0,
	weapon_weight: 2,
	name: "Medical Beamgun",
	desc: "Don't cross the streams!",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronogun",
	item_state: "chronogun",
	w_class: 3,
});

// /obj/item/weapon/gun/medbeam/proc/Initialize  (code/modules/projectiles/guns/medbeam.dm:20)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/gun/medbeam/proc/Destroy  (code/modules/projectiles/guns/medbeam.dm:24)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.srcCall(f, "LoseTarget");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

// /obj/item/weapon/gun/medbeam/proc/dropped  (code/modules/projectiles/guns/medbeam.dm:29)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "LoseTarget");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/medbeam/proc/equipped  (code/modules/projectiles/guns/medbeam.dm:33)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "LoseTarget");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/medbeam/proc/LoseTarget  (code/modules/projectiles/guns/medbeam.dm:38)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/LoseTarget", function* LoseTarget(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "current_beam")]);
		rt.setSv(f, "current_beam", null);
		rt.setSv(f, "active", 0);
		yield* g.srcCall(f, "on_beam_release", rt.sv(f, "current_target"));
	}
	rt.setSv(f, "current_target", null);
	return f.dot;
}, true);

// /obj/item/weapon/gun/medbeam/proc/process_fire  (code/modules/projectiles/guns/medbeam.dm:45)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value) {
	f.vars = () => [target, user, message, params, zone_override];
	if (live(message) === null) {
		message = 1;
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		yield* g.srcCall(f, "add_fingerprint", live(user));
	}
	if (truthy(rt.sv(f, "current_target"))) {
		yield* g.srcCall(f, "LoseTarget");
	}
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "current_target", live(target));
	rt.setSv(f, "active", 1);
	rt.setSv(f, "current_beam", (yield* g.new_(f, T("/datum/beam"), [null, live(user), null, rt.sv(f, "current_target"), "time", 6000, "beam_icon_state", "medbeam", "btype", T("/obj/effect/ebeam/medical")], rt.Args.Named)));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [rt.sv(f, "current_beam"), P("/datum/beam/proc/Start")]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/medbeam/proc/process  (code/modules/projectiles/guns/medbeam.dm:62)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/process", function* process(f: Frame) {
	let source: Value = null;
	f.vars = () => [source];
	source = rt.sv(f, "loc");
	if ((!truthy(rt.sv(f, "mounted")) && !truthy((rt.istype(live(source), T("/mob/living")) ? 1 : 0)))) {
		yield* g.srcCall(f, "LoseTarget");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "current_target"))) {
		yield* g.srcCall(f, "LoseTarget");
		return live(f.dot);
	}
	if (rt.le(rt.worldTime(f), add(rt.sv(f, "last_check"), rt.sv(f, "check_delay")))) {
		return live(f.dot);
	}
	rt.setSv(f, "last_check", rt.worldTime(f));
	if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(source), rt.sv(f, "current_target")])), rt.sv(f, "max_range")) || !truthy((yield* g.srcCall(f, "los_check", live(source), rt.sv(f, "current_target")))))) {
		yield* g.srcCall(f, "LoseTarget");
		if (truthy((rt.istype(live(source), T("/mob/living")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(source), "<span class='warning'>You lose control of the beam!</span>"]);
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "current_target"))) return f.dot;
	yield* g.srcCall(f, "on_beam_tick", rt.sv(f, "current_target"));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/gun/medbeam/proc/los_check  (code/modules/projectiles/guns/medbeam.dm:88)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/los_check", function* los_check(f: Frame, user: Value, target: Value) {
	let user_turf: Value = null, dummy: Value = null, turf: Value = null, AM: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [user, target, user_turf, dummy, turf, AM, B, $e];
	user_turf = rt.fv(f, "loc", live(user));
	if (truthy(rt.sv(f, "mounted"))) {
		user_turf = rt.getStep(f, live(user), 0);
	} else {
		if (!truthy((rt.istype(live(user_turf), T("/turf")) ? 1 : 0))) {
			return 0;
		}
	}
	(rt.modField(f, (dummy = (yield* g.new_(f, T("/obj"), [live(user_turf)]))), "pass_flags", 7, rt.bitOr));
	turf = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [live(user_turf), live(target)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turf = $e;
		if ((truthy(rt.sv(f, "mounted")) && isEqual(live(turf), live(user_turf)))) {
			continue;
		}
		if (truthy(rt.fv(f, "density", live(turf)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
			return 0;
		}
		AM = null;
		rt.forList(f, 1, live(turf), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			if (!truthy((yield* g.callName(f, live(AM), "CanPass", [live(dummy), live(turf), 1])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
				return 0;
			}
		}
		rt.endFor(f, 1);
		B = null;
		rt.forList(f, 1, live(turf), T("/obj/effect/ebeam/medical"));
		while (($e = rt.next(f, 1)) !== undefined) {
			B = $e;
			if (!isEqual(rt.fv(f, "owner", live(B)), rt.sv(f, "current_beam"))) {
				yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(B)), 0, 3, 5, 8]);
				yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
				return 0;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(dummy)]);
	return 1;
}, true);

// /obj/item/weapon/gun/medbeam/proc/on_beam_tick  (code/modules/projectiles/guns/medbeam.dm:115)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/proc/on_beam_tick", function* on_beam_tick(f: Frame, target: Value) {
	f.vars = () => [target];
	if (!isEqual(rt.fv(f, "health", live(target)), rt.fv(f, "maxHealth", live(target)))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [rt.getStep(f, live(target), 0), "#80F5FF"]);
	}
	yield* g.callName(f, live(target), "adjustBruteLoss", [-4]);
	yield* g.callName(f, live(target), "adjustFireLoss", [-4]);
	return live(f.dot);
}, true);

rt.type(5280, "/obj/item/weapon/gun/medbeam/mech", "/obj/item/weapon/gun/medbeam", {
	mounted: 1,
});

// /obj/item/weapon/gun/medbeam/mech/proc/Initialize  (code/modules/projectiles/guns/medbeam.dm:132)  may sleep
rt.def("/obj/item/weapon/gun/medbeam/mech/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true);
