// Based on /tg/station's code/game/objects/effects/decals/decal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11697, "/obj/effect/decal", "/obj/effect", {
	anchored: 1,
	name: "decal",
	resistance_flags: 50,
});

// decal.dm:7
rt.def("/obj/effect/decal/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// decal.dm:10
rt.def("/obj/effect/decal/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (rt.bitAnd(this.resistance_flags, FIRE_PROOF)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// decal.dm:14
rt.def("/obj/effect/decal/proc/HandleTurfChange", function* HandleTurfChange(f: Frame) {
	yield* parent_proc();
	if (!(f.args[0] == this.loc && (rt.istype(f.args[0], T("/turf/open/space")) || rt.istype(f.args[0], T("/turf/closed")) || rt.istype(f.args[0], T("/turf/open/floor/plating/lava")) || rt.istype(f.args[0], T("/turf/open/water")) || rt.istype(f.args[0], T("/turf/open/chasm"))))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { args: ["T"] });

rt.type(11902, "/obj/effect/turf_decal", "/obj/effect", {
	group: "paint",
	anchored: 1,
	icon: rt.rsc("icons/turf/decals.dmi"),
	icon_state: "warningline",
});

// decal.dm:26
rt.def("/obj/effect/turf_decal/proc/get_decal", function get_decal(f: Frame) {
	return image({ icon: rt.rsc("icons/turf/decals.dmi"), icon_state: this.icon_state, dir: this.dir, layer: 2 });
});

// decal.dm:29
rt.def("/obj/effect/turf_decal/proc/Initialize", function Initialize(f: Frame) {
	let _T: Value = null;
	parent_proc();
	if (!rt.istype((_T = this.loc), T("/turf"))) {
		CRASH("Turf decal initialized in an object/nullspace");
	}
	_T.add_decal(this.get_decal(), this.group);
	return INITIALIZE_HINT_QDEL;
});
