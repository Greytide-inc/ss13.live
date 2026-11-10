// Based on /tg/station's code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// component_helpers.dm:3
rt.def("/proc/generate_cache_component", function* generate_cache_component(f: Frame, specific_component_id: Value, A: Value) {
	let component_animation_type: Value = null;
	if (!specific_component_id) {
		specific_component_id = get_weighted_component_id();
	}
	rt.incAt(GLOB.clockwork_component_cache, specific_component_id, 1, true);
	if (A) {
		component_animation_type = get_component_animation_type(specific_component_id);
		yield* new_(component_animation_type, rt.getStep(f, A, 0));
	}
	yield* update_slab_info();
	return specific_component_id;
}, true);

// component_helpers.dm:14
rt.def("/proc/get_weighted_component_id", function get_weighted_component_id(f: Frame, storage_slab: Value) {
	let i: Value = null, G: Value = null, i_1: Value = null;
	let $e: any;
	f.dot = list();
	if (storage_slab) {
		if (GLOB.clockwork_caches) {
			for (i of each(GLOB.clockwork_component_cache)) {
				rt.setAt(f.dot, i, max(MAX_COMPONENTS_BEFORE_RAND - LOWER_PROB_PER_COMPONENT * (rt.index(GLOB.clockwork_component_cache, i) + rt.index(storage_slab.stored_components, i)), 1));
			}
		} else {
			i = null;
			for (i of each(GLOB.clockwork_component_cache)) {
				rt.setAt(f.dot, i, max(MAX_COMPONENTS_BEFORE_RAND - LOWER_PROB_PER_COMPONENT * rt.index(storage_slab.stored_components, i), 1));
			}
		}
	} else {
		i = null;
		for (i of each(GLOB.clockwork_component_cache)) {
			rt.setAt(f.dot, i, max(MAX_COMPONENTS_BEFORE_RAND - LOWER_PROB_PER_COMPONENT * rt.index(GLOB.clockwork_component_cache, i), 1));
		}
	}
	rt.forList(f, 0, GLOB.all_clockwork_objects, T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
	if (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (G.still_needs_components()) {
			for (i_1 of each(G.required_components)) {
				if (!rt.index(G.required_components, i_1)) {
					f.dot -= i_1;
				}
			}
		}
	}
	rt.endFor(f, 0);
	f.dot = pickweight(f.dot);
	return f.dot;
});

// component_helpers.dm:35
rt.def("/proc/get_component_name", function get_component_name(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return "Belligerent Eye";
	} else if (id === "vanguard_cogwheel") {
		return "Vanguard Cogwheel";
	} else if (id === "geis_capacitor") {
		return "Geis Capacitor";
	} else if (id === "replicant_alloy") {
		return "Replicant Alloy";
	} else if (id === "hierophant_ansible") {
		return "Hierophant Ansible";
	} else {
		return null;
	}
});

// component_helpers.dm:51
rt.def("/proc/get_component_acronym", function get_component_acronym(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return "BE";
	} else if (id === "vanguard_cogwheel") {
		return "VC";
	} else if (id === "geis_capacitor") {
		return "GC";
	} else if (id === "replicant_alloy") {
		return "RA";
	} else if (id === "hierophant_ansible") {
		return "HA";
	} else {
		return null;
	}
});

// component_helpers.dm:83
rt.def("/proc/get_component_span", function get_component_span(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return "neovgre";
	} else if (id === "vanguard_cogwheel") {
		return "inathneq";
	} else if (id === "geis_capacitor") {
		return "sevtug";
	} else if (id === "replicant_alloy") {
		return "nezbere";
	} else if (id === "hierophant_ansible") {
		return "nzcrentr";
	} else {
		return "brass";
	}
});

// component_helpers.dm:99
rt.def("/proc/get_component_color_bright", function get_component_color_bright(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return "#880020";
	} else if (id === "replicant_alloy") {
		return "#5A6068";
	} else {
		return get_component_color(id);
	}
});

// component_helpers.dm:109
rt.def("/proc/get_component_color", function get_component_color(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return "#6E001A";
	} else if (id === "vanguard_cogwheel") {
		return "#1E8CE1";
	} else if (id === "geis_capacitor") {
		return "#AF0AAF";
	} else if (id === "replicant_alloy") {
		return "#42474D";
	} else if (id === "hierophant_ansible") {
		return "#DAAA18";
	} else {
		return "#BE8700";
	}
});

// component_helpers.dm:125
rt.def("/proc/get_component_animation_type", function get_component_animation_type(f: Frame, id: Value) {
	if (id === "belligerent_eye") {
		return T("/obj/effect/temp_visual/ratvar/component");
	} else if (id === "vanguard_cogwheel") {
		return T("/obj/effect/temp_visual/ratvar/component/cogwheel");
	} else if (id === "geis_capacitor") {
		return T("/obj/effect/temp_visual/ratvar/component/capacitor");
	} else if (id === "replicant_alloy") {
		return T("/obj/effect/temp_visual/ratvar/component/alloy");
	} else if (id === "hierophant_ansible") {
		return T("/obj/effect/temp_visual/ratvar/component/ansible");
	} else {
		return null;
	}
});
