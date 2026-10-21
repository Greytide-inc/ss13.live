// From code/modules/atmospherics/gasmixtures/gas_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhardcoded_gases  (code/modules/atmospherics/gasmixtures/gas_types.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalhardcoded_gases", function InitGlobalhardcoded_gases(f: Frame) {
	rt.setGl("hardcoded_gases", rt.list("o2", "n2", "co2", "plasma"));
	rt.modSrcVar(f, "gvars_datum_init_order", "hardcoded_gases", add);
	return f.dot;
});

// /proc/meta_gas_list  (code/modules/atmospherics/gasmixtures/gas_types.dm:4)  may sleep
rt.def("/proc/meta_gas_list", function* meta_gas_list(f: Frame) {
	let gas_path: Value = null, gas_info: Value = null, gas: Value = null;
	let $e: any;
	f.vars = () => [gas_path, gas_info, gas, $e];
	f.dot = (yield* g.new_(f, T("/list"), []));
	gas_path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/gas")])), T("/datum/gas")));
	while (($e = rt.next(f, 0)) !== undefined) {
		gas_path = $e;
		gas_info = (yield* g.new_(f, T("/list"), [5]));
		gas = live(gas_path);
		rt.setAt(live(gas_info), 1, rt.initial(f, live(gas), "specific_heat"));
		rt.setAt(live(gas_info), 2, rt.initial(f, live(gas), "name"));
		rt.setAt(live(gas_info), 3, rt.initial(f, live(gas), "moles_visible"));
		if (rt.initial(f, live(gas), "moles_visible") !== null) {
			rt.setAt(live(gas_info), 4, (yield* g.new_(f, T("/obj/effect/overlay/gas"), [rt.initial(f, live(gas), "gas_overlay")])));
		}
		rt.setAt(live(gas_info), 5, rt.initial(f, live(gas), "dangerous"));
		rt.setAt(live(f.dot), rt.initial(f, live(gas), "id"), live(gas_info));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11781, "/obj/effect/overlay/gas", "/obj/effect/overlay", {
	icon: rt.rsc("icons/effects/tile_effects.dmi"),
	mouse_opacity: 0,
	layer: 5,
	appearance_flags: 256,
});

// /obj/effect/overlay/gas/proc/New  (code/modules/atmospherics/gasmixtures/gas_types.dm:103)  may sleep
rt.def("/obj/effect/overlay/gas/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", live(f.args[0]));
	return f.dot;
}, true, { args: ["state"] });
