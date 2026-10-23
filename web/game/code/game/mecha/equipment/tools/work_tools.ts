// From code/game/mecha/equipment/tools/work_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9623, "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp", "/obj/item/mecha_parts/mecha_equipment", {
	dam_force: 20,
	cargo_holder: null,
	equip_cooldown: 15,
	energy_drain: 10,
	name: "hydraulic clamp",
	desc: "Equipment for engineering exosuits. Lifts objects and loads them into cargo.",
	icon_state: "mecha_clamp",
});

// /obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/can_attach  (code/game/mecha/equipment/tools/work_tools.dm:15)
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/working/ripley")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/attach  (code/game/mecha/equipment/tools/work_tools.dm:21)
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/attach", function attach(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cargo_holder", live(f.args[0]));
	return live(f.dot);
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/detach  (code/game/mecha/equipment/tools/work_tools.dm:26)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/detach", function* detach(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cargo_holder", null);
	return f.dot;
}, true, { args: ["moveto"] });

// /obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/action  (code/game/mecha/equipment/tools/work_tools.dm:30)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/proc/action", function* action(f: Frame, target: Value) {
	let O: Value = null, M: Value = null;
	f.vars = () => [target, O, M];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "cargo_holder"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "anchored", (O = live(target))))) {
			if (rt.lt(rt.getLen(f, rt.fv(f, "cargo", rt.sv(f, "cargo_holder"))), rt.fv(f, "cargo_capacity", rt.sv(f, "cargo_holder")))) {
				yield* g.callName(f, rt.sv(f, "chassis"), "visible_message", [fmt("＀ lifts ＀ and starts to load it into cargo compartment.", [rt.sv(f, "chassis"), live(target)])]);
				rt.setFv(f, "anchored", live(O), 1);
				if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) {
					rt.modField(f, rt.sv(f, "cargo_holder"), "cargo", live(O), add);
					rt.setFv(f, "loc", live(O), rt.sv(f, "chassis"));
					rt.setFv(f, "anchored", live(O), 0);
					yield* g.srcCall(f, "occupant_message", fmt("<span class='notice'>＀ successfully loaded.</span>", [live(target)]));
					yield* g.srcCall(f, "log_message", fmt("Loaded ＀. Cargo compartment capacity: ＀", [live(O), subtract(rt.fv(f, "cargo_capacity", rt.sv(f, "cargo_holder")), rt.getLen(f, rt.fv(f, "cargo", rt.sv(f, "cargo_holder"))))]));
				} else {
					rt.setFv(f, "anchored", live(O), rt.initial(f, live(O), "anchored"));
				}
			} else {
				yield* g.srcCall(f, "occupant_message", "<span class='warning'>Not enough room in cargo compartment!</span>");
			}
		} else {
			yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>＀ is firmly secured!</span>", [live(target)]));
		}
	} else {
		if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
		if (isEqual(rt.gv(f, "stat", (M = live(target))), 2)) {
			return live(f.dot);
		}
		if (isEqual(rt.gv(f, "a_intent", rt.fv(f, "occupant", rt.sv(f, "chassis"))), "harm")) {
			yield* g.callName(f, live(M), "take_overall_damage", [rt.sv(f, "dam_force")]);
			if (!truthy(live(M))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(M), "adjustOxyLoss", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "dam_force"), 2)]))]);
			yield* g.callName(f, live(M), "updatehealth", []);
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ squeezes ＀.</span>", [rt.sv(f, "chassis"), live(target)]), fmt("<span class='userdanger'>＀ squeezes ＀.</span>", [rt.sv(f, "chassis"), live(target)]), "<span class='italics'>You hear something crack.</span>"]);
			yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), live(M), "attacked", fmt("＀", [rt.sv(f, "name")]), fmt("(INTENT: ＀) (DAMTYE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "a_intent", rt.fv(f, "occupant", rt.sv(f, "chassis")))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.sv(f, "damtype")]))])]);
		} else {
			yield* g.call(f, P("/proc/step_away"), null, [live(M), rt.sv(f, "chassis")]);
			yield* g.srcCall(f, "occupant_message", fmt("You push ＀ out of the way.", [live(target)]));
			yield* g.callName(f, rt.sv(f, "chassis"), "visible_message", [fmt("＀ pushes ＀ out of the way.", [rt.sv(f, "chassis"), live(target)])]);
		}
		return 1;
	}
	return f.dot;
}, true);

rt.type(9624, "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill", "/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp", {
	energy_drain: 0,
	name: "１KILL CLAMP",
	desc: "They won't know what clamped them!",
});

// /obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill/proc/action  (code/game/mecha/equipment/tools/work_tools.dm:81)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill/proc/action", function* action(f: Frame, target: Value) {
	let O: Value = null, M: Value = null;
	f.vars = () => [target, O, M];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "cargo_holder"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
		if (!truthy(rt.gv(f, "anchored", (O = live(target))))) {
			if (rt.lt(rt.getLen(f, rt.fv(f, "cargo", rt.sv(f, "cargo_holder"))), rt.fv(f, "cargo_capacity", rt.sv(f, "cargo_holder")))) {
				yield* g.callName(f, rt.sv(f, "chassis"), "visible_message", [fmt("＀ lifts ＀ and starts to load it into cargo compartment.", [rt.sv(f, "chassis"), live(target)])]);
				rt.setFv(f, "anchored", live(O), 1);
				if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) {
					rt.modField(f, rt.sv(f, "cargo_holder"), "cargo", live(O), add);
					rt.setFv(f, "loc", live(O), rt.sv(f, "chassis"));
					rt.setFv(f, "anchored", live(O), 0);
					yield* g.srcCall(f, "occupant_message", fmt("<span class='notice'>＀ successfully loaded.</span>", [live(target)]));
					yield* g.srcCall(f, "log_message", fmt("Loaded ＀. Cargo compartment capacity: ＀", [live(O), subtract(rt.fv(f, "cargo_capacity", rt.sv(f, "cargo_holder")), rt.getLen(f, rt.fv(f, "cargo", rt.sv(f, "cargo_holder"))))]));
				} else {
					rt.setFv(f, "anchored", live(O), rt.initial(f, live(O), "anchored"));
				}
			} else {
				yield* g.srcCall(f, "occupant_message", "<span class='warning'>Not enough room in cargo compartment!</span>");
			}
		} else {
			yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>＀ is firmly secured!</span>", [live(target)]));
		}
	} else {
		if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
		if (isEqual(rt.gv(f, "stat", (M = live(target))), 2)) {
			return live(f.dot);
		}
		if (isEqual(rt.gv(f, "a_intent", rt.fv(f, "occupant", rt.sv(f, "chassis"))), "harm")) {
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ destroys ＀ in an unholy fury.</span>", [rt.sv(f, "chassis"), live(target)]), fmt("<span class='userdanger'>＀ destroys ＀ in an unholy fury.</span>", [rt.sv(f, "chassis"), live(target)])]);
		}
		if (isEqual(rt.gv(f, "a_intent", rt.fv(f, "occupant", rt.sv(f, "chassis"))), "disarm")) {
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ rips ＀'s arms off.</span>", [rt.sv(f, "chassis"), live(target)]), fmt("<span class='userdanger'>＀ rips ＀'s arms off.</span>", [rt.sv(f, "chassis"), live(target)])]);
		} else {
			yield* g.call(f, P("/proc/step_away"), null, [live(M), rt.sv(f, "chassis")]);
			yield* g.callName(f, live(target), "visible_message", [fmt("＀ tosses ＀ like a piece of paper.", [rt.sv(f, "chassis"), live(target)])]);
		}
		return 1;
	}
	return f.dot;
}, true);

rt.type(9625, "/obj/item/mecha_parts/mecha_equipment/extinguisher", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 5,
	energy_drain: 0,
	range: 3,
	name: "exosuit extinguisher",
	desc: "Equipment for engineering exosuits. A rapid-firing high capacity fire extinguisher.",
	icon_state: "mecha_exting",
});

// /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/New  (code/game/mecha/equipment/tools/work_tools.dm:129)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 1000);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["water", 1000]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action  (code/game/mecha/equipment/tools/work_tools.dm:135)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action", function* action(f: Frame, target: Value) {
	let WT: Value = null, direction: Value = null, _T: Value = null, T1: Value = null, T2: Value = null, the_targets: Value = null, a: Value = null, W: Value = null, my_target: Value = null, R: Value = null, b: Value = null, W_turf: Value = null, atm: Value = null;
	f.vars = () => [target, WT, direction, _T, T1, T2, the_targets, a, W, my_target, R, b, W_turf, atm];
	if ((!truthy((yield* g.srcCall(f, "action_checks", live(target)))) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "chassis"), live(target)])), 3))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(target), T("/obj/structure/reagent_dispensers/watertank")) ? 1 : 0)) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "chassis"), live(target)])), 1))) {
		yield* g.callName(f, rt.gv(f, "reagents", (WT = live(target))), "trans_to", [live(f.src), 1000]);
		yield* g.srcCall(f, "occupant_message", "<span class='notice'>Extinguisher refilled.</span>");
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.rsc("sound/effects/refill.ogg"), 50, 1, -6]);
	} else {
		if (rt.gt(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 0)) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.rsc("sound/effects/extinguish.ogg"), 75, 1, -3]);
			direction = rt.getDir(f, rt.sv(f, "chassis"), live(target));
			_T = rt.getStep(f, live(target), 0);
			T1 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), 90])));
			T2 = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [live(direction), -90])));
			the_targets = rt.list(live(_T), live(T1), live(T2));
			rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action: spawn at game/mecha/equipment/tools/work_tools.dm:152", target, WT, direction, _T, T1, T2, the_targets, a, W, my_target, R, b, W_turf, atm);
		}
		return 1;
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/action: spawn at game/mecha/equipment/tools/work_tools.dm:152", function* (f: Frame, target: Value, WT: Value, direction: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, W_turf: Value, atm: Value) {
	let $e: any;
	f.vars = () => [target, WT, direction, _T, T1, T2, the_targets, a, W, my_target, R, b, W_turf, atm, $e];
	a = null;
	a = 0;
	while (rt.lt(live(a), 5)) {
		if (!truthy((W = (yield* g.new_(f, T("/obj/effect/particle_effect/water"), [rt.getStep(f, rt.sv(f, "chassis"), 0)]))))) {
			return live(f.dot);
		}
		my_target = rt.op(f, "PickUnweighted", [1], [live(the_targets)]);
		R = (yield* g.new_(f, T("/datum/reagents"), [5]));
		rt.setFv(f, "reagents", live(W), live(R));
		rt.setFv(f, "my_atom", live(R), live(W));
		yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(W), 1]);
		b = null;
		b = 0;
		while (rt.lt(live(b), 4)) {
			if (!truthy(live(W))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/step_towards"), null, [live(W), live(my_target)]);
			if (!truthy(live(W))) {
				return live(f.dot);
			}
			W_turf = rt.getStep(f, live(W), 0);
			yield* g.callName(f, rt.fv(f, "reagents", live(W)), "reaction", [live(W_turf)]);
			atm = null;
			rt.forList(f, 0, live(W_turf), T("/atom"));
			while (($e = rt.next(f, 0)) !== undefined) {
				atm = $e;
				yield* g.callName(f, rt.fv(f, "reagents", live(W)), "reaction", [live(atm)]);
			}
			rt.endFor(f, 0);
			if (isEqual(rt.fv(f, "loc", live(W)), live(my_target))) {
				break;
			}
			yield* g.call(f, P("/proc/sleep"), null, [2]);
			b = rt.inc(live(b), 1);
		}
		a = rt.inc(live(a), 1);
	}
	return null;
});

// /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/get_equip_info  (code/game/mecha/equipment/tools/work_tools.dm:178)
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/get_equip_info", function get_equip_info(f: Frame) {
	return fmt("＀ [＀]", [rt.callSuper(f, [], rt.Args.Same), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.src)))]);
});

// /obj/item/mecha_parts/mecha_equipment/extinguisher/proc/can_attach  (code/game/mecha/equipment/tools/work_tools.dm:184)
rt.def("/obj/item/mecha_parts/mecha_equipment/extinguisher/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/working")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

rt.type(9626, "/obj/item/mecha_parts/mecha_equipment/rcd", "/obj/item/mecha_parts/mecha_equipment", {
	mode: 0,
	equip_cooldown: 10,
	energy_drain: 250,
	range: 3,
	name: "mounted RCD",
	desc: "An exosuit-mounted Rapid Construction Device.",
	icon_state: "mecha_rcd",
	origin_tech: "materials=4;bluespace=3;magnets=4;powerstorage=4;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/New  (code/game/mecha/equipment/tools/work_tools.dm:202)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/New", function* New(f: Frame) {
	rt.modGl("rcd_list", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/Destroy  (code/game/mecha/equipment/tools/work_tools.dm:206)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("rcd_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/action  (code/game/mecha/equipment/tools/work_tools.dm:210)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/action", function* action(f: Frame, target: Value) {
	let W: Value = null, F: Value = null, S: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [target, W, F, S, _T, $0];
	if (truthy((rt.istype(live(target), T("/turf/open/space/transit")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) && !truthy((rt.istype(live(target), T("/obj/machinery/door/airlock")) ? 1 : 0)))) {
		target = rt.getStep(f, live(target), 0);
	}
	if ((!truthy((yield* g.srcCall(f, "action_checks", live(target)))) || rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "chassis"), live(target)])), 3))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "chassis"), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		if (truthy((rt.istype(live(target), T("/turf/closed/wall")) ? 1 : 0))) {
			yield* g.srcCall(f, "occupant_message", fmt("Deconstructing ＀...", [(W = live(target))]));
			if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(W))))) {
				yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
				yield* g.callName(f, live(W), "ChangeTurf", [T("/turf/open/floor/plating")]);
				yield* g.call(f, P("/proc/playsound"), null, [live(W), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			}
		} else {
			if (truthy((rt.istype(live(target), T("/turf/open/floor")) ? 1 : 0))) {
				yield* g.srcCall(f, "occupant_message", fmt("Deconstructing ＀...", [(F = live(target))]));
				if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) {
					yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
					yield* g.callName(f, live(F), "ChangeTurf", [rt.fv(f, "baseturf", live(F))]);
					yield* g.call(f, P("/proc/playsound"), null, [live(F), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				}
			} else {
				if (truthy((rt.istype(live(target), T("/obj/machinery/door/airlock")) ? 1 : 0))) {
					yield* g.srcCall(f, "occupant_message", fmt("Deconstructing ＀...", [live(target)]));
					if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) {
						yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
						yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
						yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					}
				}
			}
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(target), T("/turf/open/space")) ? 1 : 0))) {
			S = live(target);
			yield* g.srcCall(f, "occupant_message", "Building Floor...");
			if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(S))))) {
				yield* g.callName(f, live(S), "ChangeTurf", [T("/turf/open/floor/plating")]);
				yield* g.call(f, P("/proc/playsound"), null, [live(S), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
			}
		} else {
			if (truthy((rt.istype(live(target), T("/turf/open/floor")) ? 1 : 0))) {
				F = live(target);
				yield* g.srcCall(f, "occupant_message", "Building Wall...");
				if (truthy((yield* g.srcCall(f, "do_after_cooldown", live(F))))) {
					yield* g.callName(f, live(F), "ChangeTurf", [T("/turf/closed/wall")]);
					yield* g.call(f, P("/proc/playsound"), null, [live(F), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
				}
			}
		}
	} else if ($0 === 2) {
		if (!truthy((rt.istype(live(target), T("/turf/open/floor")) ? 1 : 0))) return f.dot;
		yield* g.srcCall(f, "occupant_message", "Building Airlock...");
		if (!truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) return f.dot;
		yield* g.callName(f, rt.fv(f, "spark_system", rt.sv(f, "chassis")), "start", []);
		rt.setFv(f, "autoclose", (_T = (yield* g.new_(f, T("/obj/machinery/door/airlock"), [live(target)]))), 1);
		yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/effects/sparks2.ogg"), 50, 1]);
	}
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/do_after_cooldown  (code/game/mecha/equipment/tools/work_tools.dm:269)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/do_after_cooldown", function* do_after_cooldown(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/Topic  (code/game/mecha/equipment/tools/work_tools.dm:272)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "mode"))) {
		rt.setSv(f, "mode", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mode")])));
		$0 = rt.sv(f, "mode");
		if ($0 === 0) {
			yield* g.srcCall(f, "occupant_message", "Switched RCD to Deconstruct.");
			rt.setSv(f, "energy_drain", rt.initial(f, live(f.src), "energy_drain"));
		} else if ($0 === 1) {
			yield* g.srcCall(f, "occupant_message", "Switched RCD to Construct.");
			rt.setSv(f, "energy_drain", multiply(2, rt.initial(f, live(f.src), "energy_drain")));
		} else if ($0 === 2) {
			yield* g.srcCall(f, "occupant_message", "Switched RCD to Construct Airlock.");
			rt.setSv(f, "energy_drain", multiply(2, rt.initial(f, live(f.src), "energy_drain")));
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/rcd/proc/get_equip_info  (code/game/mecha/equipment/tools/work_tools.dm:288)
rt.def("/obj/item/mecha_parts/mecha_equipment/rcd/proc/get_equip_info", function get_equip_info(f: Frame) {
	return fmt("＀ [<a href='?src=＃;mode=0'>D</a>|<a href='?src=＃;mode=1'>C</a>|<a href='?src=＃;mode=2'>A</a>]", [rt.callSuper(f, [], rt.Args.Same), live(f.src), live(f.src), live(f.src)]);
});

rt.type(9627, "/obj/item/mecha_parts/mecha_equipment/cable_layer", "/obj/item/mecha_parts/mecha_equipment", {
	event: null,
	old_turf: null,
	last_piece: null,
	cable: null,
	max_cable: 1000,
	name: "cable layer",
	desc: "Equipment for engineering exosuits. Lays cable along the exosuit's path.",
	icon_state: "mecha_wire",
});

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/New  (code/game/mecha/equipment/tools/work_tools.dm:304)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/New", function* New(f: Frame) {
	rt.setSv(f, "cable", (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src)])));
	rt.setFv(f, "amount", rt.sv(f, "cable"), 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/can_attach  (code/game/mecha/equipment/tools/work_tools.dm:309)
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha/working")) ? 1 : 0))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/attach  (code/game/mecha/equipment/tools/work_tools.dm:315)
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/attach", function attach(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "event", rt.callName(f, rt.fv(f, "events", rt.sv(f, "chassis")), "addEvent", ["onMove", rt.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/layCable")])]));
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/detach  (code/game/mecha/equipment/tools/work_tools.dm:320)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/detach", function* detach(f: Frame) {
	yield* g.callName(f, rt.fv(f, "events", rt.sv(f, "chassis")), "clearEvent", ["onMove", rt.sv(f, "event")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Destroy  (code/game/mecha/equipment/tools/work_tools.dm:325)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "chassis"))) {
		yield* g.callName(f, rt.fv(f, "events", rt.sv(f, "chassis")), "clearEvent", ["onMove", rt.sv(f, "event")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/action  (code/game/mecha/equipment/tools/work_tools.dm:329)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/action", function* action(f: Frame, target: Value) {
	let cur_amount: Value = null, to_load: Value = null;
	let $0: any;
	f.vars = () => [target, cur_amount, to_load, $0];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(target), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && truthy(rt.fv(f, "amount", live(target))))) {
		if (truthy(rt.sv(f, "cable"))) {
			$0 = rt.fv(f, "amount", rt.sv(f, "cable"));
		} else {
			$0 = 0;
		}
		cur_amount = $0;
		if (truthy((to_load = (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "max_cable"), live(cur_amount)), 0]))))) {
			to_load = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "amount", live(target)), live(to_load)]));
			if (!truthy(rt.sv(f, "cable"))) {
				rt.setSv(f, "cable", (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src)])));
				rt.setFv(f, "amount", rt.sv(f, "cable"), 0);
			}
			rt.modField(f, rt.sv(f, "cable"), "amount", live(to_load), add);
			yield* g.callName(f, live(target), "use", [live(to_load)]);
			yield* g.srcCall(f, "occupant_message", fmt("<span class='notice'>＀ meters of cable successfully loaded.</span>", [live(to_load)]));
			yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
		} else {
			yield* g.srcCall(f, "occupant_message", "<span class='warning'>Reel is full.</span>");
		}
	} else {
		yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>Unable to load ＀ - no cable found.</span>", [live(target)]));
	}
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Topic  (code/game/mecha/equipment/tools/work_tools.dm:350)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/Topic", function* Topic(f: Frame) {
	let m: Value = null, CC: Value = null;
	let $0: any, $1: any;
	f.vars = () => [m, CC, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "toggle"))) {
		yield* g.srcCall(f, "set_ready_state", (!truthy(rt.sv(f, "equip_ready")) ? 1 : 0));
		$0 = live(f.src);
		if (truthy(rt.sv(f, "equip_ready"))) {
			$1 = "dea";
		} else {
			$1 = "a";
		}
		yield* g.srcCall(f, "occupant_message", fmt("＀ ＀ctivated.", [$0, $1]));
		if (truthy(rt.sv(f, "equip_ready"))) {
			$0 = "Dea";
		} else {
			$0 = "A";
		}
		yield* g.srcCall(f, "log_message", fmt("＀ctivated.", [$0]));
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "cut"))) {
		if ((truthy(rt.sv(f, "cable")) && truthy(rt.fv(f, "amount", rt.sv(f, "cable"))))) {
			if (truthy((m = (yield* g.call(f, P("/proc/min"), null, [(m = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [32], [(yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "amount", rt.sv(f, "cable")), 30])), "Cut cable", "Please specify the length of cable to cut", rt.fv(f, "occupant", rt.sv(f, "chassis")), null])), 1]))), rt.fv(f, "amount", rt.sv(f, "cable"))]))))) {
				yield* g.srcCall(f, "use_cable", live(m));
				rt.setFv(f, "amount", (CC = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "chassis"), 0)]))), live(m));
			}
		} else {
			yield* g.srcCall(f, "occupant_message", "There's no more cable on the reel.");
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/get_equip_info  (code/game/mecha/equipment/tools/work_tools.dm:369)
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [output, $0, $1, $2, $3];
	if (truthy((output = rt.callSuper(f, [], rt.Args.Same)))) {
		$0 = live(output);
		if (truthy(rt.sv(f, "cable"))) {
			$1 = rt.fv(f, "amount", rt.sv(f, "cable"));
		} else {
			$1 = 0;
		}
		if ((truthy(rt.sv(f, "cable")) && truthy(rt.fv(f, "amount", rt.sv(f, "cable"))))) {
			$2 = live(f.src);
			if (!truthy(rt.sv(f, "equip_ready"))) {
				$3 = "Dea";
			} else {
				$3 = "A";
			}
			$2 = fmt("- <a href='?src=＃;toggle=1'>＀ctivate</a>|<a href='?src=＃;cut=1'>Cut</a>", [$2, $3, live(f.src)]);
		} else {
			$2 = null;
		}
		return fmt("＀ [Cable: ＀ m]＀", [$0, $1, $2]);
	}
	return live(f.dot);
});

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/use_cable  (code/game/mecha/equipment/tools/work_tools.dm:375)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/use_cable", function* use_cable(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if ((!truthy(rt.sv(f, "cable")) || rt.lt(rt.fv(f, "amount", rt.sv(f, "cable")), 1))) {
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.srcCall(f, "occupant_message", fmt("Cable depleted, ＀ deactivated.", [live(f.src)]));
		yield* g.srcCall(f, "log_message", fmt("Cable depleted, ＀ deactivated.", [live(f.src)]));
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "amount", rt.sv(f, "cable")), live(amount))) {
		yield* g.srcCall(f, "occupant_message", "No enough cable to finish the task.");
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "cable"), "use", [live(amount)]);
	yield* g.srcCall(f, "update_equip_info");
	return 1;
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/reset  (code/game/mecha/equipment/tools/work_tools.dm:388)
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/reset", function reset(f: Frame) {
	rt.setSv(f, "last_piece", null);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/dismantleFloor  (code/game/mecha/equipment/tools/work_tools.dm:391)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/dismantleFloor", function* dismantleFloor(f: Frame, new_turf: Value) {
	let _T: Value = null;
	f.vars = () => [new_turf, _T];
	if (truthy((rt.istype(live(new_turf), T("/turf/open/floor")) ? 1 : 0))) {
		if (!truthy((rt.istype((_T = live(new_turf)), T("/turf/open/floor/plating")) ? 1 : 0))) {
			if ((!truthy(rt.fv(f, "broken", live(_T))) && !truthy(rt.fv(f, "burnt", live(_T))))) {
				yield* g.new_(f, rt.fv(f, "floor_tile", live(_T)), [live(_T)]);
			}
			yield* g.callName(f, live(_T), "make_plating", []);
		}
	}
	return (!truthy(rt.fv(f, "intact", live(new_turf))) ? 1 : 0);
}, true);

// /obj/item/mecha_parts/mecha_equipment/cable_layer/proc/layCable  (code/game/mecha/equipment/tools/work_tools.dm:400)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/cable_layer/proc/layCable", function* layCable(f: Frame, new_turf: Value) {
	let fdirn: Value = null, LC: Value = null, NC: Value = null, PN: Value = null;
	let $e: any;
	f.vars = () => [new_turf, fdirn, LC, NC, PN, $e];
	if (((truthy(rt.sv(f, "equip_ready")) || !truthy((rt.istype(live(new_turf), T("/turf")) ? 1 : 0))) || !truthy((yield* g.srcCall(f, "dismantleFloor", live(new_turf)))))) {
		return (yield* g.srcCall(f, "reset"));
	}
	fdirn = (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", rt.sv(f, "chassis")), 180]));
	LC = null;
	rt.forList(f, 0, live(new_turf), T("/obj/structure/cable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		LC = $e;
		if ((isEqual(rt.fv(f, "d1", live(LC)), live(fdirn)) || isEqual(rt.fv(f, "d2", live(LC)), live(fdirn)))) {
			return (yield* g.srcCall(f, "reset"));
		}
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.srcCall(f, "use_cable", 1)))) {
		return (yield* g.srcCall(f, "reset"));
	}
	yield* g.callName(f, (NC = (yield* g.new_(f, T("/obj/structure/cable"), [live(new_turf)]))), "cableColor", ["red"]);
	rt.setFv(f, "d1", live(NC), 0);
	rt.setFv(f, "d2", live(NC), live(fdirn));
	yield* g.callName(f, live(NC), "update_icon", []);
	PN = null;
	if ((truthy(rt.sv(f, "last_piece")) && !isEqual(rt.fv(f, "d2", rt.sv(f, "last_piece")), rt.fv(f, "dir", rt.sv(f, "chassis"))))) {
		rt.setFv(f, "d1", rt.sv(f, "last_piece"), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "d2", rt.sv(f, "last_piece")), rt.fv(f, "dir", rt.sv(f, "chassis"))])));
		rt.setFv(f, "d2", rt.sv(f, "last_piece"), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "d2", rt.sv(f, "last_piece")), rt.fv(f, "dir", rt.sv(f, "chassis"))])));
		yield* g.callName(f, rt.sv(f, "last_piece"), "update_icon", []);
		PN = rt.fv(f, "powernet", rt.sv(f, "last_piece"));
	}
	if (!truthy(live(PN))) {
		rt.modGl("powernets", (PN = (yield* g.new_(f, T("/datum/powernet"), []))), add);
	}
	rt.setFv(f, "powernet", live(NC), live(PN));
	rt.modField(f, live(PN), "cables", live(NC), add);
	yield* g.callName(f, live(NC), "mergeConnectedNetworks", [rt.fv(f, "d2", live(NC))]);
	rt.setSv(f, "last_piece", live(NC));
	return 1;
}, true, { argTypes: [{ path: "/turf" }] });
