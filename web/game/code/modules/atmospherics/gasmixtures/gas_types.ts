// Based on /tg/station's code/modules/atmospherics/gasmixtures/gas_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// gas_types.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalhardcoded_gases", function InitGlobalhardcoded_gases(f: Frame) {
	GLOB.hardcoded_gases = list("o2", "n2", "co2", "plasma");
	this.gvars_datum_init_order += "hardcoded_gases";
	return f.dot;
});

// gas_types.dm:4
rt.def("/proc/meta_gas_list", function* meta_gas_list(f: Frame) {
	let gas_path: Value = null, gas_info: Value = null, gas: Value = null;
	f.dot = (yield* new_(T("/list")));
	for (gas_path of each(typesof(T("/datum/gas")) - T("/datum/gas"))) {
		gas_info = (yield* new_(T("/list"), 5));
		gas = gas_path;
		rt.setAt(gas_info, 1, rt.initial(f, gas, "specific_heat"));
		rt.setAt(gas_info, 2, rt.initial(f, gas, "name"));
		rt.setAt(gas_info, 3, rt.initial(f, gas, "moles_visible"));
		if (rt.initial(f, gas, "moles_visible") !== null) {
			rt.setAt(gas_info, 4, (yield* new_(T("/obj/effect/overlay/gas"), rt.initial(f, gas, "gas_overlay"))));
		}
		rt.setAt(gas_info, 5, rt.initial(f, gas, "dangerous"));
		rt.setAt(f.dot, rt.initial(f, gas, "id"), gas_info);
	}
	return f.dot;
}, true);

rt.type(11781, "/obj/effect/overlay/gas", "/obj/effect/overlay", {
	icon: rt.rsc("icons/effects/tile_effects.dmi"),
	mouse_opacity: 0,
	layer: 5,
	appearance_flags: 256,
});

// gas_types.dm:103
rt.def("/obj/effect/overlay/gas/proc/New", function* New(f: Frame, state: Value) {
	f.dot = (yield* parent_proc());
	this.icon_state = state;
	return f.dot;
}, true);
