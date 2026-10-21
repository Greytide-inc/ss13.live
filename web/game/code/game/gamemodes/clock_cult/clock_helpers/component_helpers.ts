// From code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/generate_cache_component  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:3)  may sleep
rt.def("/proc/generate_cache_component", function* generate_cache_component(f: Frame, specific_component_id: Value, A: Value) {
	let component_animation_type: Value = null;
	f.vars = () => [specific_component_id, A, component_animation_type];
	if (!truthy(live(specific_component_id))) {
		specific_component_id = (yield* g.call(f, P("/proc/get_weighted_component_id"), null, []));
	}
	rt.incAt(rt.gl("clockwork_component_cache"), live(specific_component_id), 1, true);
	if (truthy(live(A))) {
		component_animation_type = (yield* g.call(f, P("/proc/get_component_animation_type"), null, [live(specific_component_id)]));
		yield* g.new_(f, live(component_animation_type), [rt.getStep(f, live(A), 0)]);
	}
	yield* g.call(f, P("/proc/update_slab_info"), null, []);
	return live(specific_component_id);
}, true);

// /proc/get_weighted_component_id  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:14)
rt.def("/proc/get_weighted_component_id", function get_weighted_component_id(f: Frame, storage_slab: Value) {
	let i: Value = null, G: Value = null, i_1: Value = null;
	let $e: any;
	f.vars = () => [i, G, i_1, $e];
	f.dot = rt.list();
	if (truthy(live(storage_slab))) {
		if (truthy(rt.gl("clockwork_caches"))) {
			i = null;
			rt.forList(f, 0, rt.gl("clockwork_component_cache"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				rt.setAt(live(f.dot), live(i), rt.call(f, P("/proc/max"), null, [subtract(100, multiply(10, add(rt.index(rt.gl("clockwork_component_cache"), live(i)), rt.index(rt.fv(f, "stored_components", live(storage_slab)), live(i))))), 1]));
			}
			rt.endFor(f, 0);
		} else {
			i = null;
			rt.forList(f, 0, rt.gl("clockwork_component_cache"));
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				rt.setAt(live(f.dot), live(i), rt.call(f, P("/proc/max"), null, [subtract(100, multiply(10, rt.index(rt.fv(f, "stored_components", live(storage_slab)), live(i)))), 1]));
			}
			rt.endFor(f, 0);
		}
	} else {
		i = null;
		rt.forList(f, 0, rt.gl("clockwork_component_cache"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			rt.setAt(live(f.dot), live(i), rt.call(f, P("/proc/max"), null, [subtract(100, multiply(10, rt.index(rt.gl("clockwork_component_cache"), live(i)))), 1]));
		}
		rt.endFor(f, 0);
	}
	G = null;
	rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
	if (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy(rt.callName(f, live(G), "still_needs_components", []))) {
			i_1 = null;
			rt.forList(f, 1, rt.fv(f, "required_components", live(G)));
			while (($e = rt.next(f, 1)) !== undefined) {
				i_1 = $e;
				if (!truthy(rt.index(rt.fv(f, "required_components", live(G)), live(i_1)))) {
					(f.dot = rt.modify(live(f.dot), live(i_1), subtract));
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	f.dot = rt.call(f, P("/proc/pickweight"), null, [live(f.dot)]);
	return f.dot;
});

// /proc/get_component_name  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:35)
rt.def("/proc/get_component_name", function get_component_name(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return "Belligerent Eye";
	} else if ($0 === "vanguard_cogwheel") {
		return "Vanguard Cogwheel";
	} else if ($0 === "geis_capacitor") {
		return "Geis Capacitor";
	} else if ($0 === "replicant_alloy") {
		return "Replicant Alloy";
	} else if ($0 === "hierophant_ansible") {
		return "Hierophant Ansible";
	} else {
		return null;
	}
	return f.dot;
});

// /proc/get_component_acronym  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:51)
rt.def("/proc/get_component_acronym", function get_component_acronym(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return "BE";
	} else if ($0 === "vanguard_cogwheel") {
		return "VC";
	} else if ($0 === "geis_capacitor") {
		return "GC";
	} else if ($0 === "replicant_alloy") {
		return "RA";
	} else if ($0 === "hierophant_ansible") {
		return "HA";
	} else {
		return null;
	}
	return f.dot;
});

// /proc/get_component_id  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:67)
rt.def("/proc/get_component_id", function get_component_id(f: Frame, name: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(name);
	if ($0 === "Belligerent Eye") {
		return "belligerent_eye";
	} else if ($0 === "Vanguard Cogwheel") {
		return "vanguard_cogwheel";
	} else if ($0 === "Geis Capacitor") {
		return "geis_capacitor";
	} else if ($0 === "Replicant Alloy") {
		return "replicant_alloy";
	} else if ($0 === "Hierophant Ansible") {
		return "hierophant_ansible";
	} else {
		return null;
	}
	return f.dot;
});

// /proc/get_component_span  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:83)
rt.def("/proc/get_component_span", function get_component_span(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return "neovgre";
	} else if ($0 === "vanguard_cogwheel") {
		return "inathneq";
	} else if ($0 === "geis_capacitor") {
		return "sevtug";
	} else if ($0 === "replicant_alloy") {
		return "nezbere";
	} else if ($0 === "hierophant_ansible") {
		return "nzcrentr";
	} else {
		return "brass";
	}
	return f.dot;
});

// /proc/get_component_color_bright  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:99)
rt.def("/proc/get_component_color_bright", function get_component_color_bright(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return "#880020";
	} else if ($0 === "replicant_alloy") {
		return "#5A6068";
	} else {
		return rt.call(f, P("/proc/get_component_color"), null, [live(id)]);
	}
	return f.dot;
});

// /proc/get_component_color  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:109)
rt.def("/proc/get_component_color", function get_component_color(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return "#6E001A";
	} else if ($0 === "vanguard_cogwheel") {
		return "#1E8CE1";
	} else if ($0 === "geis_capacitor") {
		return "#AF0AAF";
	} else if ($0 === "replicant_alloy") {
		return "#42474D";
	} else if ($0 === "hierophant_ansible") {
		return "#DAAA18";
	} else {
		return "#BE8700";
	}
	return f.dot;
});

// /proc/get_component_animation_type  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:125)
rt.def("/proc/get_component_animation_type", function get_component_animation_type(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return T("/obj/effect/temp_visual/ratvar/component");
	} else if ($0 === "vanguard_cogwheel") {
		return T("/obj/effect/temp_visual/ratvar/component/cogwheel");
	} else if ($0 === "geis_capacitor") {
		return T("/obj/effect/temp_visual/ratvar/component/capacitor");
	} else if ($0 === "replicant_alloy") {
		return T("/obj/effect/temp_visual/ratvar/component/alloy");
	} else if ($0 === "hierophant_ansible") {
		return T("/obj/effect/temp_visual/ratvar/component/ansible");
	} else {
		return null;
	}
	return f.dot;
});

// /proc/get_component_type  (code/game/gamemodes/clock_cult/clock_helpers/component_helpers.dm:141)
rt.def("/proc/get_component_type", function get_component_type(f: Frame, id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(id);
	if ($0 === "belligerent_eye") {
		return T("/obj/item/clockwork/component/belligerent_eye");
	} else if ($0 === "vanguard_cogwheel") {
		return T("/obj/item/clockwork/component/vanguard_cogwheel");
	} else if ($0 === "geis_capacitor") {
		return T("/obj/item/clockwork/component/geis_capacitor");
	} else if ($0 === "replicant_alloy") {
		return T("/obj/item/clockwork/component/replicant_alloy");
	} else if ($0 === "hierophant_ansible") {
		return T("/obj/item/clockwork/component/hierophant_ansible");
	} else {
		return null;
	}
	return f.dot;
});
