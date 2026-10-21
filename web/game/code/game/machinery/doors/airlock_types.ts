// From code/game/machinery/doors/airlock_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10239, "/obj/machinery/door/airlock/uranium", "/obj/machinery/door/airlock", {
	mineral: "uranium",
	last_event: 0,
	name: "uranium airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/uranium.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_uranium"),
});

// /obj/machinery/door/airlock/uranium/proc/process  (code/game/machinery/doors/airlock_types.dm:161)  may sleep
rt.def("/obj/machinery/door/airlock/uranium/proc/process", function* process(f: Frame) {
	if (rt.gt(rt.worldTime(f), add(rt.sv(f, "last_event"), 20))) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "radiate");
		}
		rt.setSv(f, "last_event", rt.worldTime(f));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/door/airlock/uranium/proc/radiate  (code/game/machinery/doors/airlock_types.dm:168)  may sleep
rt.def("/obj/machinery/door/airlock/uranium/proc/radiate", function* radiate(f: Frame) {
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 3, 3, 15, 0]);
	return live(f.dot);
}, true);

rt.type(10213, "/obj/machinery/door/airlock/plasma", "/obj/machinery/door/airlock", {
	mineral: "plasma",
	name: "plasma airlock",
	desc: "No way this can end badly.",
	icon: rt.rsc("icons/obj/doors/airlocks/station/plasma.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_plasma"),
});

// /obj/machinery/door/airlock/plasma/proc/temperature_expose  (code/game/machinery/doors/airlock_types.dm:179)  may sleep
rt.def("/obj/machinery/door/airlock/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/plasma/proc/ignite  (code/game/machinery/doors/airlock_types.dm:183)  may sleep
rt.def("/obj/machinery/door/airlock/plasma/proc/ignite", function* ignite(f: Frame, exposed_temperature: Value) {
	f.vars = () => [exposed_temperature];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "PlasmaBurn", live(exposed_temperature));
	return f.dot;
}, true);

// /obj/machinery/door/airlock/plasma/proc/PlasmaBurn  (code/game/machinery/doors/airlock_types.dm:187)  may sleep
rt.def("/obj/machinery/door/airlock/plasma/proc/PlasmaBurn", function* PlasmaBurn(f: Frame, temperature: Value) {
	f.vars = () => [temperature];
	yield* g.srcCall(f, "atmos_spawn_air", "plasma=500;TEMP=1000");
	yield* g.new_(f, T("/obj/structure/door_assembly/door_assembly_0"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10255, "/obj/machinery/door/airlock/cult", "/obj/machinery/door/airlock", {
	friendly: 0,
	openingoverlaytype: rt.typePath("/obj/effect/temp_visual/cult/door"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/cult/runed/overlays.dmi"),
	hackProof: 1,
	aiControlDisabled: 1,
	name: "cult airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/cult/runed/cult.dmi"),
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_cult"),
});

// /obj/machinery/door/airlock/cult/proc/New  (code/game/machinery/doors/airlock_types.dm:376)  may sleep
rt.def("/obj/machinery/door/airlock/cult/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, rt.sv(f, "openingoverlaytype"), [rt.fv(f, "loc", live(f.src))]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/cult/proc/canAIControl  (code/game/machinery/doors/airlock_types.dm:380)
rt.def("/obj/machinery/door/airlock/cult/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (rt.call(f, P("/proc/iscultist"), null, [live(user)]) && (!truthy(rt.callSrc(f, "isAllPowerCut", [])) ? 1 : 0));
});

// /obj/machinery/door/airlock/cult/proc/allowed  (code/game/machinery/doors/airlock_types.dm:383)  may sleep
rt.def("/obj/machinery/door/airlock/cult/proc/allowed", function* allowed(f: Frame, L: Value) {
	let throwtarget: Value = null;
	f.vars = () => [L, throwtarget];
	if (!truthy(rt.sv(f, "density"))) {
		return 1;
	}
	if ((((truthy(rt.sv(f, "friendly")) || truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)])))) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/shade")) ? 1 : 0))) || truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)))) {
		yield* g.new_(f, rt.sv(f, "openingoverlaytype"), [rt.sv(f, "loc")]);
		return 1;
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/cult/sac"), [rt.sv(f, "loc")]);
		throwtarget = null;
		throwtarget = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(L), live(f.src)])))]));
		rt.op(f, "Output", [], [live(L), rt.op(f, "PickUnweighted", [2], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/hallucinations/turn_around1.ogg"), 0, 1, 50])), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/hallucinations/turn_around2.ogg"), 0, 1, 50]))])], false);
		yield* g.call(f, P("/proc/flash_color"), null, [null, live(L), "flash_color", "#960000", "flash_time", 20], rt.Args.Named);
		yield* g.callName(f, live(L), "Knockdown", [40]);
		yield* g.callName(f, live(L), "throw_at", [live(throwtarget), 5, 1, live(f.src)]);
		return 0;
	}
	return f.dot;
}, true);

rt.type(10211, "/obj/machinery/door/airlock/clockwork", "/obj/machinery/door/airlock", {
	construction_state: 1,
	name: "pinion airlock",
	desc: "A massive cogwheel set into two heavy slabs of brass.",
	icon: rt.rsc("icons/obj/doors/airlocks/clockwork/pinion_airlock.dmi"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/clockwork/overlays.dmi"),
	opacity: 1,
	hackProof: 1,
	aiControlDisabled: 1,
	use_power: 0,
	resistance_flags: 34,
	damage_deflection: 30,
	normal_integrity: 240,
});

// /obj/machinery/door/airlock/clockwork/proc/New  (code/game/machinery/doors/airlock_types.dm:445)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/door"), [(_T = rt.getStep(f, live(f.src), 0))]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam/door"), [live(_T)]);
	yield* g.call(f, P("/proc/change_construction_value"), null, [5]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/clockwork/proc/Destroy  (code/game/machinery/doors/airlock_types.dm:452)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [-5]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/door/airlock/clockwork/proc/examine  (code/game/machinery/doors/airlock_types.dm:456)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/examine", function* examine(f: Frame) {
	let gear_text: Value = null;
	let $0: any;
	f.vars = () => [gear_text, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	gear_text = "The cogwheel is flickering and twisting wildly. Report this to a coder.";
	$0 = rt.sv(f, "construction_state");
	if ($0 === 1) {
		gear_text = "<span class='brass'>The cogwheel is solidly <b>wrenched</b> to the brass around it.</span>";
	} else if ($0 === 2) {
		gear_text = "<span class='alloy'>The cogwheel has been <i>loosened</i>, but remains <b>connected loosely</b> to the door!</span>";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(gear_text)]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/door/airlock/clockwork/proc/emp_act  (code/game/machinery/doors/airlock_types.dm:466)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy(rt.op(f, "Prob", [], [divide(80, live(severity))]))) return f.dot;
	yield* g.srcCall(f, "open");
	return f.dot;
}, true);

// /obj/machinery/door/airlock/clockwork/proc/canAIControl  (code/game/machinery/doors/airlock_types.dm:470)
rt.def("/obj/machinery/door/airlock/clockwork/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return (rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]) && (!truthy(rt.callSrc(f, "isAllPowerCut", [])) ? 1 : 0));
});

// /obj/machinery/door/airlock/clockwork/proc/narsie_act  (code/game/machinery/doors/airlock_types.dm:476)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/clockwork/proc/attackby  (code/game/machinery/doors/airlock_types.dm:484)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "attempt_construction", live(f.args[0]), live(f.args[1]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/door/airlock/clockwork/proc/allowed  (code/game/machinery/doors/airlock_types.dm:488)
rt.def("/obj/machinery/door/airlock/clockwork/proc/allowed", function allowed(f: Frame, M: Value) {
	if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) {
		return 1;
	}
	return 0;
});

// /obj/machinery/door/airlock/clockwork/proc/deconstruct  (code/game/machinery/doors/airlock_types.dm:499)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	f.vars = () => [disassembled, _T];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		_T = rt.getStep(f, live(f.src), 0);
		if (truthy(live(disassembled))) {
			yield* g.new_(f, T("/obj/item/stack/tile/brass"), [live(_T), 4]);
		} else {
			yield* g.new_(f, T("/obj/item/clockwork/alloy_shards"), [live(_T)]);
		}
		yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/pinion_lock"), [live(_T)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/door/airlock/clockwork/proc/attempt_construction  (code/game/machinery/doors/airlock_types.dm:510)  may sleep
rt.def("/obj/machinery/door/airlock/clockwork/proc/attempt_construction", function* attempt_construction(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	if (((!truthy(live(I)) || !truthy(live(user))) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)]))))) {
		return 0;
	} else {
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "construction_state"), 1)) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ begins loosening ＀'s cogwheel...</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You begin loosening ＀'s cogwheel...</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(I)), 50, 1]);
				if ((!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(75, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named))) || !isEqual(rt.sv(f, "construction_state"), 1))) {
					return 1;
				}
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ loosens ＀'s cogwheel!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>＀'s cogwheel pops off and dangles loosely.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				rt.setSv(f, "construction_state", 2);
			} else {
				if (isEqual(rt.sv(f, "construction_state"), 2)) {
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ begins tightening ＀'s cogwheel...</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You begin tightening ＀'s cogwheel into place...</span>", [live(f.src)])]);
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(I)), 50, 1]);
					if ((!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(75, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named))) || !isEqual(rt.sv(f, "construction_state"), 2))) {
						return 1;
					}
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ tightens ＀'s cogwheel!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You firmly tighten ＀'s cogwheel into place.</span>", [live(f.src)])]);
					yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					rt.setSv(f, "construction_state", 1);
				}
			}
			return 1;
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				if (isEqual(rt.sv(f, "construction_state"), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s cogwheel is too tightly secured! Your ＀ can't reach under it!</span>", [live(f.src), rt.fv(f, "name", live(I))])]);
					return 1;
				} else {
					if (isEqual(rt.sv(f, "construction_state"), 2)) {
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ begins slowly lifting off ＀'s cogwheel...</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You slowly begin lifting off ＀'s cogwheel...</span>", [live(f.src)])]);
						yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(I)), 50, 1]);
						if ((!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(75, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named))) || !isEqual(rt.sv(f, "construction_state"), 2))) {
							return 1;
						}
						yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ lifts off ＀'s cogwheel, causing it to fall apart!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You lift off ＀'s cogwheel, causing it to fall apart!</span>", [live(f.src)])]);
						yield* g.srcCall(f, "deconstruct", 1);
					}
				}
				return 1;
			}
		}
	}
	return 0;
}, true);
