// From code/modules/fields/turf_objects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11805, "/obj/effect/abstract/proximity_checker/advanced", "/obj/effect/abstract/proximity_checker", {
	parent: null,
	flags: 640,
	name: "field",
	desc: "Why can you see energy fields?!",
	icon: null,
	icon_state: null,
	alpha: 0,
	invisibility: 101,
	mouse_opacity: 0,
});

// /obj/effect/abstract/proximity_checker/advanced/proc/Initialize  (code/modules/fields/turf_objects.dm:15)
rt.def("/obj/effect/abstract/proximity_checker/advanced/proc/Initialize", function Initialize(f: Frame) {
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "parent", live(f.args[1]));
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["mapload", "_monitor"] });

rt.type(11807, "/obj/effect/abstract/proximity_checker/advanced/field_turf", "/obj/effect/abstract/proximity_checker/advanced", {
	name: "energy field",
	desc: "Get off my turf!",
});

// /obj/effect/abstract/proximity_checker/advanced/field_turf/proc/CanPass  (code/modules/fields/turf_objects.dm:28)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/CanPass", function CanPass(f: Frame, AM: Value, target: Value, height: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_turf_canpass", [live(AM), live(f.src), live(target)]);
	}
	return 1;
});

// /obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Crossed  (code/modules/fields/turf_objects.dm:33)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_turf_crossed", [live(AM), live(f.src)]);
	}
	return 1;
}, false, { waitfor: false });

// /obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncross  (code/modules/fields/turf_objects.dm:38)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncross", function Uncross(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_turf_uncross", [live(AM), live(f.src)]);
	}
	return 1;
});

// /obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncrossed  (code/modules/fields/turf_objects.dm:43)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncrossed", function Uncrossed(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_turf_uncrossed", [live(AM), live(f.src)]);
	}
	return 1;
});

rt.type(11808, "/obj/effect/abstract/proximity_checker/advanced/field_edge", "/obj/effect/abstract/proximity_checker/advanced", {
	name: "energy field edge",
	desc: "Edgy description here.",
});

// /obj/effect/abstract/proximity_checker/advanced/field_edge/proc/CanPass  (code/modules/fields/turf_objects.dm:52)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/CanPass", function CanPass(f: Frame, AM: Value, target: Value, height: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_edge_canpass", [live(AM), live(f.src), live(target)]);
	}
	return 1;
});

// /obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Crossed  (code/modules/fields/turf_objects.dm:57)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_edge_crossed", [live(AM), live(f.src)]);
	}
	return 1;
}, false, { waitfor: false });

// /obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncross  (code/modules/fields/turf_objects.dm:62)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncross", function Uncross(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_edge_uncross", [live(AM), live(f.src)]);
	}
	return 1;
});

// /obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncrossed  (code/modules/fields/turf_objects.dm:67)
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncrossed", function Uncrossed(f: Frame, AM: Value) {
	if (truthy(rt.sv(f, "parent"))) {
		return rt.callName(f, rt.sv(f, "parent"), "field_edge_uncrossed", [live(AM), live(f.src)]);
	}
	return 1;
});

// /proc/is_turf_in_field  (code/modules/fields/turf_objects.dm:71)
rt.def("/proc/is_turf_in_field", function is_turf_in_field(f: Frame, _T: Value, F: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, live(_T), T("/obj/effect/abstract/proximity_checker/advanced"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((rt.istype(live(O), T("/obj/effect/abstract/proximity_checker/advanced/field_edge")) ? 1 : 0))) {
			if (isEqual(rt.fv(f, "parent", live(O)), live(F))) {
				return 2;
			}
		}
		if (isEqual(rt.fv(f, "parent", live(O)), live(F))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});
