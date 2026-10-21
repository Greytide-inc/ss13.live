// From code/game/turfs/simulated/chasm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4793, "/turf/open/chasm", "/turf/open", {
	drop_x: 1,
	drop_y: 1,
	drop_z: 1,
	name: "chasm",
	desc: "Watch your step.",
	baseturf: rt.typePath("/turf/open/chasm"),
	smooth: 11,
	icon: rt.rsc("icons/turf/floors/chasms.dmi"),
	icon_state: "smooth",
	canSmoothWith: null,
	density: 1,
});

// /turf/open/chasm/proc/<init>  (code/game/turfs/simulated/chasm.dm:11)
rt.def("/turf/open/chasm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/fakepit"), T("/turf/open/chasm")));
	return f.dot;
});

// /turf/open/chasm/proc/Entered  (code/game/turfs/simulated/chasm.dm:18)  may sleep
rt.def("/turf/open/chasm/proc/Entered", function* Entered(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "drop_stuff", live(AM));
	return f.dot;
}, true);

// /turf/open/chasm/proc/process  (code/game/turfs/simulated/chasm.dm:22)  may sleep
rt.def("/turf/open/chasm/proc/process", function* process(f: Frame) {
	if (truthy((yield* g.srcCall(f, "drop_stuff")))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /turf/open/chasm/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/chasm.dm:26)
rt.def("/turf/open/chasm/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "basalt");
	return 1;
});

// /turf/open/chasm/proc/attackby  (code/game/turfs/simulated/chasm.dm:31)  may sleep
rt.def("/turf/open/chasm/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, L: Value = null, L_0: Value = null, S: Value = null;
	f.vars = () => [R, L, L_0, S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
		R = live(f.args[0]);
		if (!truthy((L = rt.locateIn(f, T("/obj/structure/lattice"), live(f.src))))) {
			if (truthy((yield* g.callName(f, live(R), "use", [1])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You construct a lattice.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
				yield* g.srcCall(f, "ReplaceWithLattice");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one rod to build a lattice.</span>"]);
			}
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/plasteel")) ? 1 : 0))) return f.dot;
	if (truthy((L_0 = rt.locateIn(f, T("/obj/structure/lattice"), live(f.src))))) {
		if (truthy((yield* g.callName(f, (S = live(f.args[0])), "use", [1])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(L_0)]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You build a floor.</span>"]);
			yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one floor tile to build a floor!</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The plating is going to need some support! Place metal rods first.</span>"]);
	}
	return f.dot;
}, true, { args: ["C", "user", "params", "area_restriction"] });

// /turf/open/chasm/proc/is_safe  (code/game/turfs/simulated/chasm.dm:60)
rt.def("/turf/open/chasm/proc/is_safe", function is_safe(f: Frame) {
	let found_safeties: Value = null;
	f.vars = () => [found_safeties];
	return rt.length((found_safeties = rt.call(f, P("/proc/typecache_filter_list"), null, [rt.sv(f, "contents"), rt.gl("chasm_safeties_typecache")])));
});

// /turf/open/chasm/proc/drop_stuff  (code/game/turfs/simulated/chasm.dm:65)  may sleep
rt.def("/turf/open/chasm/proc/drop_stuff", function* drop_stuff(f: Frame, AM: Value) {
	let thing_to_check: Value = null, thing: Value = null;
	let $e: any;
	f.vars = () => [AM, thing_to_check, thing, $e];
	f.dot = 0;
	if (truthy((yield* g.srcCall(f, "is_safe")))) {
		return 0;
	}
	thing_to_check = live(f.src);
	if (truthy(live(AM))) {
		thing_to_check = rt.list(live(AM));
	}
	thing = null;
	rt.forList(f, 0, live(thing_to_check));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if (truthy((yield* g.srcCall(f, "droppable", live(thing))))) {
			f.dot = 1;
			yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/turf/open/chasm/proc/drop"), live(thing)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/chasm/proc/droppable  (code/game/turfs/simulated/chasm.dm:76)  may sleep
rt.def("/turf/open/chasm/proc/droppable", function* droppable(f: Frame, AM: Value) {
	let MM: Value = null, H: Value = null, J: Value = null;
	f.vars = () => [AM, MM, H, J];
	if ((!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0)) && !truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0)))) {
		return 0;
	}
	if (((truthy((rt.istype(live(AM), T("/obj/singularity")) ? 1 : 0)) || truthy((rt.istype(live(AM), T("/obj/item/projectile")) ? 1 : 0))) || truthy(rt.fv(f, "throwing", live(AM))))) {
		return 0;
	}
	if (truthy((rt.istype(live(AM), T("/obj/effect/portal")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.bitAnd(rt.gv(f, "movement_type", (MM = live(AM))), 2))) {
			return 0;
		}
	}
	if (truthy((rt.istype(live(AM), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.gv(f, "belt", (H = live(AM))), T("/obj/item/device/wormhole_jaunter")) ? 1 : 0))) {
			J = rt.fv(f, "belt", live(H));
			yield* g.srcCall(f, "visible_message", fmt("<span class='boldwarning'>＀ falls into ＀!</span>", [live(H), live(f.src)]));
			yield* g.callName(f, live(J), "chasm_react", [live(H)]);
			return 0;
		}
	}
	return 1;
}, true);

// /turf/open/chasm/proc/drop  (code/game/turfs/simulated/chasm.dm:100)  may sleep
rt.def("/turf/open/chasm/proc/drop", function* drop(f: Frame, AM: Value) {
	let _T: Value = null, L: Value = null;
	f.vars = () => [AM, _T, L];
	if ((!truthy(live(AM)) || (!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM)))))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.locate(rt.sv(f, "drop_x"), rt.sv(f, "drop_y"), rt.sv(f, "drop_z"))))) return f.dot;
	yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='boldwarning'>＀ falls into ＀!</span>", [live(AM), live(f.src)]), "<span class='userdanger'>GAH! Ah... where are you?</span>"]);
	yield* g.callName(f, live(_T), "visible_message", [fmt("<span class='boldwarning'>＀ falls from above!</span>", [live(AM)])]);
	yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
	if (!truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (L = live(AM)), "Knockdown", [100]);
	yield* g.callName(f, live(L), "adjustBruteLoss", [30]);
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }] });

rt.type(4794, "/turf/open/chasm/straight_down", "/turf/open/chasm", {});

// /turf/open/chasm/straight_down/proc/Initialize  (code/game/turfs/simulated/chasm.dm:115)  may sleep
rt.def("/turf/open/chasm/straight_down/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "drop_x", rt.sv(f, "x"));
	rt.setSv(f, "drop_y", rt.sv(f, "y"));
	if (!rt.le(add(rt.sv(f, "z"), 1), rt.fv(f, "maxz", rt.world()))) return f.dot;
	rt.setSv(f, "drop_z", add(rt.sv(f, "z"), 1));
	return f.dot;
}, true);

rt.type(4795, "/turf/open/chasm/straight_down/lava_land_surface", "/turf/open/chasm/straight_down", {
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	planetary_atmos: 1,
	baseturf: rt.typePath("/turf/open/chasm/straight_down/lava_land_surface"),
	light_range: 1.9,
	light_power: 0.65,
	light_color: "#C48A18",
});

// /turf/open/chasm/straight_down/lava_land_surface/proc/drop  (code/game/turfs/simulated/chasm.dm:132)  may sleep
rt.def("/turf/open/chasm/straight_down/lava_land_surface/proc/drop", function* drop(f: Frame, AM: Value) {
	let L: Value = null, oldtransform: Value = null, oldcolor: Value = null, oldalpha: Value = null, i: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [AM, L, oldtransform, oldcolor, oldalpha, i, S, $e];
	if ((!truthy(live(AM)) || (!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(AM), "visible_message", [fmt("<span class='boldwarning'>＀ falls into ＀!</span>", [live(AM), live(f.src)]), "<span class='userdanger'>You stumble and stare into an abyss before you. It stares back, and you fall into the enveloping dark.</span>"]);
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "notransform", (L = live(AM)), 1);
		yield* g.callName(f, live(L), "Stun", [200]);
		rt.setFv(f, "resting", live(L), 1);
	}
	oldtransform = rt.fv(f, "transform", live(AM));
	oldcolor = rt.fv(f, "color", live(AM));
	oldalpha = rt.fv(f, "alpha", live(AM));
	rt.op(f, "Animate", [2, 10], [null, live(AM), "transform", subtract((yield* g.call(f, P("/proc/matrix"), null, [])), (yield* g.call(f, P("/proc/matrix"), null, []))), "alpha", 0, "color", rt.op(f, "Rgb", [1, 3], [0, 0, 0]), "time", 10]);
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((!truthy(live(AM)) || (!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM)))))) {
			return live(f.dot);
		}
		rt.incField(f, live(AM), "pixel_y", -1, true);
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	rt.endFor(f, 0);
	if ((!truthy(live(AM)) || (!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM)))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(AM), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.gv(f, "mmi", (S = live(AM)))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
	if (!(truthy(live(AM)) && !(!truthy(live(AM)) || truthy(rt.fv(f, "gc_destroyed", live(AM)))))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldwarning'>＀ spits out the ＀!</span>", [live(f.src), live(AM)]));
	rt.setFv(f, "alpha", live(AM), live(oldalpha));
	rt.setFv(f, "color", live(AM), live(oldcolor));
	rt.setFv(f, "transform", live(AM), live(oldtransform));
	yield* g.callName(f, live(AM), "throw_at", [(yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])])), (yield* g.call(f, P("/proc/rand"), null, [1, 10])), (yield* g.call(f, P("/proc/rand"), null, [1, 10]))]);
	return f.dot;
}, true);

rt.type(4798, "/turf/open/chasm/jungle", "/turf/open/chasm", {
	icon: rt.rsc("icons/turf/floors/junglechasm.dmi"),
	planetary_atmos: 1,
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
});

// /turf/open/chasm/jungle/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/chasm.dm:187)
rt.def("/turf/open/chasm/jungle/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "dirt");
	return 1;
});
