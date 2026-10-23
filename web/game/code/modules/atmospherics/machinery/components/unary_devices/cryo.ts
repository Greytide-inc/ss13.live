// From code/modules/atmospherics/machinery/components/unary_devices/cryo.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10583, "/obj/machinery/atmospherics/components/unary/cryo_cell", "/obj/machinery/atmospherics/components/unary", {
	on: 0,
	autoeject: 0,
	volume: 100,
	efficiency: 1,
	sleep_factor: 750,
	unconscious_factor: 1000,
	heat_capacity: 20000,
	conduction_coefficient: 0.3,
	beaker: null,
	reagent_transfer: 0,
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	radio_channel: "Medical",
	running_bob_anim: 0,
	anchored: 1,
	name: "cryo cell",
	icon: rt.rsc("icons/obj/cryogenics.dmi"),
	icon_state: "pod-off",
	density: 1,
	obj_integrity: 350,
	max_integrity: 350,
	armor: null,
	layer: 3.3,
	state_open: 0,
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/<init>  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:11)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 30, "acid", 30]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/Initialize  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:35)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "initialize_directions", rt.sv(f, "dir"));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/cryo_tube"), []))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "keyslot", rt.sv(f, "radio"), (yield* g.new_(f, rt.sv(f, "radio_key"), [])));
	rt.setFv(f, "subspace_transmission", rt.sv(f, "radio"), 1);
	rt.setFv(f, "canhear_range", rt.sv(f, "radio"), 0);
	yield* g.callName(f, rt.sv(f, "radio"), "recalculateChannels", []);
	return f.dot;
}, true);

rt.type(6744, "/obj/item/weapon/circuitboard/machine/cryo_tube", "/obj/item/weapon/circuitboard/machine", {
	name: "Cryotube (Machine Board)",
	build_path: rt.typePath("/obj/machinery/atmospherics/components/unary/cryo_cell"),
	origin_tech: "programming=4;biotech=3;engineering=4;plasmatech=3",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/cryo_tube/proc/<init>  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:50)
rt.def("/obj/item/weapon/circuitboard/machine/cryo_tube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 2]));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_construction  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:57)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_construction", function* on_construction(f: Frame) {
	yield* g.callSuper(f, [rt.sv(f, "dir"), rt.sv(f, "dir")]);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/RefreshParts  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:61)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [C, M, $e];
	C = null;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		C = rt.modify(live(C), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", multiply(rt.initial(f, live(f.src), "efficiency"), live(C)));
	rt.setSv(f, "sleep_factor", multiply(rt.initial(f, live(f.src), "sleep_factor"), live(C)));
	rt.setSv(f, "unconscious_factor", multiply(rt.initial(f, live(f.src), "unconscious_factor"), live(C)));
	rt.setSv(f, "heat_capacity", divide(rt.initial(f, live(f.src), "heat_capacity"), live(C)));
	rt.setSv(f, "conduction_coefficient", multiply(rt.initial(f, live(f.src), "conduction_coefficient"), live(C)));
	return f.dot;
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/Destroy  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:71)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
	rt.setSv(f, "radio", null);
	if (truthy(rt.sv(f, "beaker"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "beaker")]);
		rt.setSv(f, "beaker", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/contents_explosion  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:79)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/contents_explosion", function contents_explosion(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.callName(f, rt.sv(f, "beaker"), "ex_act", [live(f.args[0]), live(f.args[1])]);
	return f.dot;
}, false, { args: ["severity", "target"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/handle_atom_del  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:84)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/handle_atom_del", function* handle_atom_del(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.args[0]), rt.sv(f, "beaker"))) return f.dot;
	rt.setSv(f, "beaker", null);
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["A"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_deconstruction  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:91)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [rt.sv(f, "loc")]);
	rt.setSv(f, "beaker", null);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/update_icon  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:95)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/update_icon", function* update_icon(f: Frame) {
	let occupant_overlay: Value = null;
	f.vars = () => [occupant_overlay];
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "state_open"))) {
		rt.setSv(f, "icon_state", "pod-open");
	} else {
		if (truthy(rt.sv(f, "occupant"))) {
			occupant_overlay = null;
			if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
				occupant_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "monkey"]));
			} else {
				if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0))) {
					if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/alien/humanoid/royal")) ? 1 : 0))) {
						occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "alienq"]));
					} else {
						if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/alien/humanoid/hunter")) ? 1 : 0))) {
							occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "alienh"]));
						} else {
							if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/alien/humanoid/sentinel")) ? 1 : 0))) {
								occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "aliens"]));
							} else {
								occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "aliend"]));
							}
						}
					}
				} else {
					if (((truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/alien/larva")) ? 1 : 0))) || (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/simple_animal")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))))) {
						yield* g.callName(f, (occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.fv(f, "icon", rt.sv(f, "occupant")), rt.fv(f, "icon_state", rt.sv(f, "occupant"))]))), "copy_overlays", [rt.sv(f, "occupant")]);
					} else {
						occupant_overlay = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/cryo_mobs.dmi"), "generic"]));
					}
				}
			}
			rt.setFv(f, "dir", live(occupant_overlay), 2);
			rt.setFv(f, "pixel_y", live(occupant_overlay), 22);
			if (((truthy(rt.sv(f, "on")) && truthy((yield* g.srcCall(f, "is_operational")))) && !truthy(rt.sv(f, "running_bob_anim")))) {
				rt.setSv(f, "icon_state", "pod-on");
				rt.setSv(f, "running_bob_anim", 1);
				yield* g.srcCall(f, "run_bob_anim", 1, live(occupant_overlay));
			} else {
				rt.setSv(f, "icon_state", "pod-off");
				yield* g.srcCall(f, "add_overlay", live(occupant_overlay));
				yield* g.srcCall(f, "add_overlay", "cover-off");
			}
		} else {
			if ((truthy(rt.sv(f, "on")) && truthy((yield* g.srcCall(f, "is_operational"))))) {
				rt.setSv(f, "icon_state", "pod-on");
				yield* g.srcCall(f, "add_overlay", "cover-on");
			} else {
				rt.setSv(f, "icon_state", "pod-off");
				yield* g.srcCall(f, "add_overlay", "cover-off");
			}
		}
	}
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	yield* g.srcCall(f, "add_overlay", "pod-panel");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/run_bob_anim  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:148)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/run_bob_anim", function* run_bob_anim(f: Frame, anim_up: Value, occupant_overlay: Value) {
	f.vars = () => [anim_up, occupant_overlay];
	if (((!truthy(rt.sv(f, "on")) || !truthy(rt.sv(f, "occupant"))) || !truthy((yield* g.srcCall(f, "is_operational"))))) {
		rt.setSv(f, "running_bob_anim", 0);
		return live(f.dot);
	}
	yield* g.srcCall(f, "cut_overlays");
	if (!isEqual(rt.fv(f, "pixel_y", live(occupant_overlay)), 23)) {
		anim_up = (isEqual(rt.fv(f, "pixel_y", live(occupant_overlay)), 22) ? 1 : 0);
	}
	if (truthy(live(anim_up))) {
		rt.incField(f, live(occupant_overlay), "pixel_y", 1, true);
	} else {
		rt.incField(f, live(occupant_overlay), "pixel_y", -1, true);
	}
	yield* g.srcCall(f, "add_overlay", live(occupant_overlay));
	yield* g.srcCall(f, "add_overlay", "cover-on");
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/run_bob_anim"), live(anim_up), live(occupant_overlay)])), 7, 1]);
	return f.dot;
}, true, { argTypes: [{  }, { path: "/image" }] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/process  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:163)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/process", function* process(f: Frame) {
	let air1: Value = null, _T: Value = null, mob_occupant: Value = null;
	f.vars = () => [air1, _T, mob_occupant];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		rt.setSv(f, "on", 0);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "occupant"))) {
		if (rt.ge(rt.gv(f, "health", (mob_occupant = rt.sv(f, "occupant"))), (yield* g.callName(f, live(mob_occupant), "getMaxHealth", [])))) {
			rt.setSv(f, "on", 0);
			yield* g.srcCall(f, "update_icon");
			yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/machines/cryo_warning.ogg"), rt.sv(f, "volume")]);
			yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "Patient fully restored", rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
			if (truthy(rt.sv(f, "autoeject"))) {
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "Auto ejecting patient now", rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				yield* g.srcCall(f, "open_machine");
			}
			return live(f.dot);
		} else {
			if (isEqual(rt.fv(f, "stat", live(mob_occupant)), 2)) {
				// tg bug: a `return` here made the auto-eject below unreachable, so a dead patient stayed in (modern tg ejects)
				if (truthy(rt.sv(f, "autoeject"))) {
					yield* g.srcCall(f, "open_machine");
				}
				return live(f.dot);
			}
		}
		if (truthy(rt.getLen(f, rt.fv(f, "gases", live(air1))))) {
			if (rt.lt(rt.fv(f, "bodytemperature", live(mob_occupant)), 273.1499938964844)) {
				yield* g.callName(f, live(mob_occupant), "Sleeping", [multiply(divide(rt.fv(f, "bodytemperature", live(mob_occupant)), rt.sv(f, "sleep_factor")), 2000)]);
				yield* g.callName(f, live(mob_occupant), "Unconscious", [multiply(divide(rt.fv(f, "bodytemperature", live(mob_occupant)), rt.sv(f, "unconscious_factor")), 2000)]);
			}
			if (truthy(rt.sv(f, "beaker"))) {
				if (isEqual(rt.sv(f, "reagent_transfer"), 0)) {
					yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "trans_to", [rt.sv(f, "occupant"), 1, multiply(10, rt.sv(f, "efficiency"))]);
					yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "reaction", [rt.sv(f, "occupant"), 3]);
					(rt.modAt(rt.index(rt.fv(f, "gases", live(air1)), "o2"), 1, divide(2, rt.sv(f, "efficiency")), subtract));
				}
				if (rt.ge(rt.incSrcVar(f, "reagent_transfer", 1, false), multiply(10, rt.sv(f, "efficiency")))) {
					rt.setSv(f, "reagent_transfer", 0);
				}
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/process_atmos  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:204)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/process_atmos", function* process_atmos(f: Frame) {
	let air1: Value = null, mob_occupant: Value = null, cold_protection: Value = null, H: Value = null, temperature_delta: Value = null, air_heat_capacity: Value = null, heat: Value = null;
	f.vars = () => [air1, mob_occupant, cold_protection, H, temperature_delta, air_heat_capacity, heat];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	air1 = rt.index(rt.sv(f, "airs"), 1);
	if ((((!truthy(rt.index(rt.sv(f, "nodes"), 1)) || !truthy(rt.index(rt.sv(f, "airs"), 1))) || !truthy(rt.getLen(f, rt.fv(f, "gases", live(air1))))) || rt.lt(rt.index(rt.index(rt.fv(f, "gases", live(air1)), "o2"), 1), 5))) {
		rt.setSv(f, "on", 0);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	mob_occupant = rt.sv(f, "occupant");
	cold_protection = 0;
	if (truthy((rt.istype((H = rt.sv(f, "occupant")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		cold_protection = (yield* g.callName(f, live(H), "get_cold_protection", [rt.fv(f, "temperature", live(air1))]));
	}
	if (rt.gt(rt.op(f, "Abs", [], [(temperature_delta = subtract(rt.fv(f, "temperature", live(air1)), rt.fv(f, "bodytemperature", live(mob_occupant))))]), 1)) {
		air_heat_capacity = (yield* g.callName(f, live(air1), "heat_capacity", []));
		heat = multiply(multiply(add(divide(subtract(1, live(cold_protection)), 10), rt.sv(f, "conduction_coefficient")), live(temperature_delta)), divide(multiply(live(air_heat_capacity), rt.sv(f, "heat_capacity")), add(live(air_heat_capacity), rt.sv(f, "heat_capacity"))));
		rt.setFv(f, "temperature", live(air1), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "temperature", live(air1)), divide(live(heat), live(air_heat_capacity))), 2.700000047683716])));
		rt.setFv(f, "bodytemperature", live(mob_occupant), (yield* g.call(f, P("/proc/max"), null, [add(rt.fv(f, "bodytemperature", live(mob_occupant)), divide(live(heat), rt.sv(f, "heat_capacity"))), 2.700000047683716])));
	}
	(rt.modAt(rt.index(rt.fv(f, "gases", live(air1)), "o2"), 1, divide(0.5, rt.sv(f, "efficiency")), subtract));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/power_change  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:231)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/power_change", function* power_change(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/relaymove  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:235)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "container_resist", live(user));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/open_machine  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:238)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/open_machine", function* open_machine(f: Frame) {
	let M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [M, L, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if ((!truthy(rt.sv(f, "state_open")) && !truthy(rt.sv(f, "panel_open")))) {
		rt.setSv(f, "on", 0);
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	M = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
			yield* g.callName(f, (L = live(M)), "update_canmove", []);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "occupant", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["drop"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/close_machine  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:250)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(((live(user) === null || truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) && truthy(rt.sv(f, "state_open"))) && !truthy(rt.sv(f, "panel_open")))) return f.dot;
	yield* g.callSuper(f, [live(user)]);
	return rt.sv(f, "occupant");
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/container_resist  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:255)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You struggle inside the cryotube, kicking the release with your foot... (This will take around 30 seconds.)</span>"]);
	yield* g.srcCall(f, "audible_message", fmt("<span class='notice'>You hear a thump from ＀.</span>", [live(f.src)]));
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 300])))) return f.dot;
	if (!isEqual(rt.sv(f, "occupant"), live(user))) return f.dot;
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/examine  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:262)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "occupant"))) {
		if (truthy(rt.sv(f, "on"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Someone's inside ＀!", [live(f.src)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("You can barely make out a form floating in ＀.", [live(f.src)])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ seems empty.", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/MouseDrop_T  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:272)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if ((((((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.fv(f, "lying", live(user)))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user))))) || !truthy((yield* g.callName(f, live(user), "Adjacent", [live(target)])))) || !truthy((rt.istype(live(target), T("/mob/living/carbon")) ? 1 : 0))) || !truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", []))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "close_machine", live(target));
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/attackby  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:277)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/attackby", function* attackby(f: Frame) {
	let reagentlist: Value = null;
	f.vars = () => [reagentlist];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
		f.dot = 1;
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>A beaker is already loaded into ＀!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setSv(f, "beaker", live(f.args[0]));
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ places ＀ in ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You place ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
		reagentlist = (yield* g.call(f, P("/proc/pretty_string_from_reagent_list"), null, [rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(f.args[0])))]));
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ added an ＀ to cyro containing ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), live(f.args[0]), live(reagentlist)])]);
		return live(f.dot);
	}
	if (((!truthy(rt.sv(f, "on")) && !truthy(rt.sv(f, "occupant"))) && !truthy(rt.sv(f, "state_open")))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "cell-o", "cell-off", live(f.args[0]))))) {
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "default_change_direction_wrench", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_interact  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:306)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("notcontained_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "cryo", rt.sv(f, "name"), 400, 550, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_data  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:312)
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, occupantData: Value = null, mob_occupant: Value = null, air1: Value = null, beakerContents: Value = null, R: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, occupantData, mob_occupant, air1, beakerContents, R, $0, $1, $2, $e];
	rt.setAt((data = rt.list()), "isOperating", rt.sv(f, "on"));
	$0 = live(data);
	$1 = "hasOccupant";
	if (truthy(rt.sv(f, "occupant"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "isOpen", rt.sv(f, "state_open"));
	rt.setAt(live(data), "autoEject", rt.sv(f, "autoeject"));
	occupantData = rt.list();
	if (truthy(rt.sv(f, "occupant"))) {
		mob_occupant = rt.sv(f, "occupant");
		rt.setAt(live(occupantData), "name", rt.fv(f, "name", live(mob_occupant)));
		rt.setAt(live(occupantData), "stat", rt.fv(f, "stat", live(mob_occupant)));
		rt.setAt(live(occupantData), "health", rt.fv(f, "health", live(mob_occupant)));
		rt.setAt(live(occupantData), "maxHealth", rt.fv(f, "maxHealth", live(mob_occupant)));
		rt.setAt(live(occupantData), "minHealth", -100);
		rt.setAt(live(occupantData), "bruteLoss", rt.callName(f, live(mob_occupant), "getBruteLoss", []));
		rt.setAt(live(occupantData), "oxyLoss", rt.callName(f, live(mob_occupant), "getOxyLoss", []));
		rt.setAt(live(occupantData), "toxLoss", rt.callName(f, live(mob_occupant), "getToxLoss", []));
		rt.setAt(live(occupantData), "fireLoss", rt.callName(f, live(mob_occupant), "getFireLoss", []));
		rt.setAt(live(occupantData), "bodyTemperature", rt.fv(f, "bodytemperature", live(mob_occupant)));
	}
	rt.setAt(live(data), "occupant", live(occupantData));
	air1 = rt.index(rt.sv(f, "airs"), 1);
	rt.setAt(live(data), "cellTemperature", rt.call(f, P("/proc/round"), null, [rt.fv(f, "temperature", live(air1))]));
	$0 = live(data);
	$1 = "isBeakerLoaded";
	if (truthy(rt.sv(f, "beaker"))) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	rt.setAt($0, $1, $2);
	beakerContents = rt.list();
	if (((truthy(rt.sv(f, "beaker")) && truthy(rt.fv(f, "reagents", rt.sv(f, "beaker")))) && truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			beakerContents = rt.modify(live(beakerContents), rt.list(rt.alist(f, ["name", rt.fv(f, "name", live(R)), "volume", rt.fv(f, "volume", live(R))])), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "beakerContents", live(beakerContents));
	return live(data);
});

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_act  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:346)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "power") {
		if (truthy(rt.sv(f, "on"))) {
			rt.setSv(f, "on", 0);
		} else {
			if (!truthy(rt.sv(f, "state_open"))) {
				rt.setSv(f, "on", 1);
			}
		}
		f.dot = 1;
	} else if ($0 === "door") {
		if (truthy(rt.sv(f, "state_open"))) {
			yield* g.srcCall(f, "close_machine");
		} else {
			yield* g.srcCall(f, "open_machine");
		}
		f.dot = 1;
	} else if ($0 === "autoeject") {
		rt.setSv(f, "autoeject", (!truthy(rt.sv(f, "autoeject")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "ejectbeaker") {
		if (truthy(rt.sv(f, "beaker"))) {
			yield* g.callName(f, rt.sv(f, "beaker"), "forceMove", [rt.sv(f, "loc")]);
			rt.setSv(f, "beaker", null);
			f.dot = 1;
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/atmospherics/components/unary/cryo_cell/proc/get_remote_view_fullscreens  (code/modules/atmospherics/machinery/components/unary_devices/cryo.dm:375)  may sleep
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "overlay_fullscreen", ["remote_view", T("/obj/screen/fullscreen/impaired"), 1]);
	return f.dot;
}, true);
