// Based on /tg/station's code/game/turfs/simulated/floor/plating/lava.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4526, "/turf/open/floor/plating/lava", "/turf/open/floor/plating", {
	name: "lava",
	icon_state: "lava",
	gender: "plural",
	baseturf: rt.typePath("/turf/open/floor/plating/lava"),
	slowdown: 2,
	light_range: 2,
	light_power: 0.75,
	light_color: "#C48A18",
});

// lava.dm:21
rt.def("/turf/open/floor/plating/lava/proc/Entered", function* Entered(f: Frame, AM: Value) {
	if (!(yield* this.burn_stuff(AM))) return f.dot;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// lava.dm:25
rt.def("/turf/open/floor/plating/lava/proc/hitby", function* hitby(f: Frame, AM: Value) {
	if (!(yield* this.burn_stuff(AM))) return f.dot;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// lava.dm:29
rt.def("/turf/open/floor/plating/lava/proc/process", function* process(f: Frame) {
	if (yield* this.burn_stuff()) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// lava.dm:42
rt.def("/turf/open/floor/plating/lava/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "basalt";
	return 1;
});

// lava.dm:58
rt.def("/turf/open/floor/plating/lava/proc/is_safe", function is_safe(f: Frame) {
	let found_safeties: Value = null;
	return rt.length((found_safeties = typecache_filter_list(this.contents, GLOB.lava_safeties_typecache)));
});

// lava.dm:65
rt.def("/turf/open/floor/plating/lava/proc/burn_stuff", function* burn_stuff(f: Frame, AM: Value) {
	let thing: Value = null, O: Value = null, L: Value = null, O_3: Value = null, _live: Value = null;
	f.dot = 0;
	if (this.is_safe()) {
		return 0;
	}
	let thing_to_check: Value = this;
	if (AM) {
		thing_to_check = list(AM);
	}
	for (thing of each(thing_to_check)) {
		if (rt.istype(thing, T("/obj"))) {
			if (rt.bitAnd((O = thing).resistance_flags, 65) || O.throwing) {
				continue;
			}
			f.dot = 1;
			if (rt.bitAnd(O.resistance_flags, 8)) {
				continue;
			}
			if (!rt.bitAnd(O.resistance_flags, 4)) {
				(rt.modField(f, O, "resistance_flags", 4, rt.bitOr));
			}
			if (rt.bitAnd(O.resistance_flags, FIRE_PROOF)) {
				(rt.modField(f, O, "resistance_flags", 16777213, rt.bitAnd));
			}
			if (rt.index(O.armor, "fire") > 50) {
				rt.setAt(O.armor, "fire", 50);
			}
			yield* O.fire_act(10000, 1000);
		} else if (rt.istype(thing, T("/mob/living"))) {
			f.dot = 1;
			if (rt.bitAnd((L = thing).movement_type, 2)) {
				continue;
			}
			if (rt.isIn(f, "lava", L.weather_immunities)) {
				continue;
			}
			if (L.buckled) {
				if (rt.istype(L.buckled, T("/obj"))) {
					if (rt.bitAnd((O_3 = L.buckled).resistance_flags, 1)) {
						continue;
					}
				}
				if (rt.istype(L.buckled, T("/mob/living"))) {
					_live = L.buckled;
					if (rt.isIn(f, "lava", _live.weather_immunities)) {
						continue;
					}
				}
			}
			yield* L.adjustFireLoss(20);
			if (L) {
				yield* L.adjust_fire_stacks(20);
				yield* L.IgniteMob();
			}
		}
	}
	return f.dot;
}, true);

rt.type(4528, "/turf/open/floor/plating/lava/smooth", "/turf/open/floor/plating/lava", {
	name: "lava",
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth"),
	icon: rt.rsc("icons/turf/floors/lava.dmi"),
	icon_state: "unsmooth",
	smooth: 10,
	canSmoothWith: null,
});

// lava.dm:131
rt.def("/turf/open/floor/plating/lava/smooth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/plating/lava/smooth"));
	return f.dot;
});
