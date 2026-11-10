// Based on /tg/station's code/modules/fields/turf_objects.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// turf_objects.dm:15
rt.def("/obj/effect/abstract/proximity_checker/advanced/proc/Initialize", function Initialize(f: Frame, mapload: Value, _monitor: Value) {
	if (_monitor) {
		this.parent = _monitor;
	}
	return parent_proc();
}, false);

rt.type(11807, "/obj/effect/abstract/proximity_checker/advanced/field_turf", "/obj/effect/abstract/proximity_checker/advanced", {
	name: "energy field",
	desc: "Get off my turf!",
});

// turf_objects.dm:28
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/CanPass", function CanPass(f: Frame, AM: Value, target: Value, height: Value) {
	if (this.parent) {
		return this.parent.field_turf_canpass(AM, this, target);
	}
	return 1;
});

// turf_objects.dm:33
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_turf_crossed(AM, this);
	}
	return 1;
}, false, { waitfor: false });

// turf_objects.dm:38
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncross", function Uncross(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_turf_uncross(AM, this);
	}
	return 1;
});

// turf_objects.dm:43
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_turf/proc/Uncrossed", function Uncrossed(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_turf_uncrossed(AM, this);
	}
	return 1;
});

rt.type(11808, "/obj/effect/abstract/proximity_checker/advanced/field_edge", "/obj/effect/abstract/proximity_checker/advanced", {
	name: "energy field edge",
	desc: "Edgy description here.",
});

// turf_objects.dm:52
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/CanPass", function CanPass(f: Frame, AM: Value, target: Value, height: Value) {
	if (this.parent) {
		return this.parent.field_edge_canpass(AM, this, target);
	}
	return 1;
});

// turf_objects.dm:57
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_edge_crossed(AM, this);
	}
	return 1;
}, false, { waitfor: false });

// turf_objects.dm:62
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncross", function Uncross(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_edge_uncross(AM, this);
	}
	return 1;
});

// turf_objects.dm:67
rt.def("/obj/effect/abstract/proximity_checker/advanced/field_edge/proc/Uncrossed", function Uncrossed(f: Frame, AM: Value) {
	if (this.parent) {
		return this.parent.field_edge_uncrossed(AM, this);
	}
	return 1;
});

// turf_objects.dm:71
rt.def("/proc/is_turf_in_field", function is_turf_in_field(f: Frame, _T: Value, F: Value) {
	let O: Value = null;
	for (O of each(_T, T("/obj/effect/abstract/proximity_checker/advanced"))) {
		if (rt.istype(O, T("/obj/effect/abstract/proximity_checker/advanced/field_edge"))) {
			if (O.parent == F) {
				return FIELD_EDGE;
			}
		}
		if (O.parent == F) {
			return FIELD_TURF;
		}
	}
	return NO_FIELD;
});
