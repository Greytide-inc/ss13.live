// From code/game/turfs/space/space.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4498, "/turf/open/space", "/turf/open", {
	destination_z: null,
	destination_x: null,
	destination_y: null,
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
	name: "０space",
	intact: 0,
	temperature: 2.7,
	thermal_conductivity: 0.4,
	heat_capacity: 700000,
	plane: -95,
	light_power: 0.25,
	dynamic_lighting: 0,
}, { global: { space_gas: 690 } });

// /turf/open/space/proc/Initialize  (code/game/turfs/space/space.dm:26)
rt.def("/turf/open/space/proc/Initialize", function Initialize(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	rt.setSv(f, "icon_state", fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
	rt.setSv(f, "air", rt.gl("space_gas"));
	if (truthy(rt.sv(f, "initialized"))) {
		rt.call(f, P("/proc/stack_trace"), null, [fmt("Warning: ＀(＀) initialized multiple times!", [live(f.src), rt.sv(f, "type")])]);
	}
	rt.setSv(f, "initialized", 1);
	A = rt.sv(f, "loc");
	if ((!truthy(rt.fv(f, "dynamic_lighting", live(f.src))) && truthy(rt.fv(f, "dynamic_lighting", live(A))))) {
		rt.callSrc(f, "add_overlay", [T("/obj/effect/fullbright")]);
	}
	if (truthy(rt.sv(f, "requires_activation"))) {
		rt.callName(f, rt.gl("SSair"), "add_to_active", [live(f.src)]);
	}
	if ((truthy(rt.sv(f, "light_power")) && truthy(rt.sv(f, "light_range")))) {
		rt.callSrc(f, "update_light", []);
	}
	if (truthy(rt.sv(f, "opacity"))) {
		rt.setSv(f, "has_opaque_atom", 1);
	}
	return 0;
});

// /turf/open/space/proc/attack_ghost  (code/game/turfs/space/space.dm:50)  may sleep
rt.def("/turf/open/space/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [user, _T];
	if (!truthy(rt.sv(f, "destination_z"))) return f.dot;
	_T = rt.locate(rt.sv(f, "destination_x"), rt.sv(f, "destination_y"), rt.sv(f, "destination_z"));
	yield* g.callName(f, live(user), "forceMove", [live(_T)]);
	return f.dot;
}, true);

// /turf/open/space/proc/AfterChange  (code/game/turfs/space/space.dm:62)  may sleep
rt.def("/turf/open/space/proc/AfterChange", function* AfterChange(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "atmos_overlay_types", null);
	return f.dot;
}, true);

// /turf/open/space/proc/update_starlight  (code/game/turfs/space/space.dm:69)
rt.def("/turf/open/space/proc/update_starlight", function update_starlight(f: Frame) {
	let t: Value = null;
	let $e: any;
	f.vars = () => [t, $e];
	if (!truthy(rt.fv(f, "starlight", rt.gl("config")))) return f.dot;
	t = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1]), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1]), rt.fv(f, "z", live(f.src))), rt.locate(rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())]), rt.fv(f, "z", live(f.src)))]));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (truthy((rt.istype(live(t), T("/turf/open/space")) ? 1 : 0))) {
			continue;
		}
		rt.callSrc(f, "set_light", [2]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "set_light", [0]);
	return f.dot;
});

// /turf/open/space/proc/attack_paw  (code/game/turfs/space/space.dm:79)  may sleep
rt.def("/turf/open/space/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /turf/open/space/proc/attackby  (code/game/turfs/space/space.dm:85)  may sleep
rt.def("/turf/open/space/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, L: Value = null, W: Value = null, L_0: Value = null, S: Value = null;
	f.vars = () => [R, L, W, L_0, S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.srcCall(f, "CanBuildHere")))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
		R = live(f.args[0]);
		L = rt.locateIn(f, T("/obj/structure/lattice"), live(f.src));
		if (truthy((W = rt.locateIn(f, T("/obj/structure/lattice/catwalk"), live(f.src))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a catwalk here!</span>"]);
			return live(f.dot);
		}
		if (truthy(live(L))) {
			if (truthy((yield* g.callName(f, live(R), "use", [1])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You construct a catwalk.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
				yield* g.new_(f, T("/obj/structure/lattice/catwalk"), [live(f.src)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two rods to build a catwalk!</span>"]);
			}
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(R), "use", [1])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You construct a lattice.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			yield* g.srcCall(f, "ReplaceWithLattice");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one rod to build a lattice.</span>"]);
		}
		return live(f.dot);
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
}, true, { args: ["C", "user", "params"] });

// /turf/open/space/proc/Entered  (code/game/turfs/space/space.dm:125)  may sleep
rt.def("/turf/open/space/proc/Entered", function* Entered(f: Frame) {
	let L: Value = null, _T: Value = null;
	f.vars = () => [L, _T];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((!truthy(live(f.args[0])) || !isEqual(live(f.src), rt.fv(f, "loc", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "destination_z"))) return f.dot;
	rt.setFv(f, "x", live(f.args[0]), rt.sv(f, "destination_x"));
	rt.setFv(f, "y", live(f.args[0]), rt.sv(f, "destination_y"));
	rt.setFv(f, "z", live(f.args[0]), rt.sv(f, "destination_z"));
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "pulling", (L = live(f.args[0]))))) {
			_T = rt.getStep(f, rt.fv(f, "loc", live(L)), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.args[0])), 180])));
			rt.setFv(f, "loc", rt.fv(f, "pulling", live(L)), live(_T));
		}
	}
	yield* g.call(f, P("/proc/stoplag"), null, []);
	yield* g.callName(f, live(f.args[0]), "newtonian_move", [rt.fv(f, "inertia_dir", live(f.args[0]))]);
	return f.dot;
}, true, { args: ["A"] });

// /turf/open/space/proc/can_have_cabling  (code/game/turfs/space/space.dm:151)
rt.def("/turf/open/space/proc/can_have_cabling", function can_have_cabling(f: Frame) {
	if (truthy(rt.locateIn(f, T("/obj/structure/lattice/catwalk"), live(f.src)))) {
		return 1;
	}
	return 0;
});

// /turf/open/space/proc/is_transition_turf  (code/game/turfs/space/space.dm:156)
rt.def("/turf/open/space/proc/is_transition_turf", function is_transition_turf(f: Frame) {
	if (!((truthy(rt.sv(f, "destination_x")) || truthy(rt.sv(f, "destination_y"))) || truthy(rt.sv(f, "destination_z")))) return f.dot;
	return 1;
});

// /turf/open/space/proc/get_smooth_underlay_icon  (code/game/turfs/space/space.dm:164)
rt.def("/turf/open/space/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/space.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
	rt.setFv(f, "plane", live(underlay_appearance), -95);
	return 1;
});

// /turf/open/space/proc/rcd_vals  (code/game/turfs/space/space.dm:171)
rt.def("/turf/open/space/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [L, $0];
	if (!truthy(rt.callSrc(f, "CanBuildHere", []))) {
		return 0;
	}
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 1) {
		if (truthy((L = rt.locateIn(f, T("/obj/structure/lattice"), live(f.src))))) {
			return rt.alist(f, ["mode", 1, "delay", 0, "cost", 1]);
		}
		return rt.alist(f, ["mode", 1, "delay", 0, "cost", 3]);
	}
	return 0;
});

// /turf/open/space/proc/rcd_act  (code/game/turfs/space/space.dm:183)  may sleep
rt.def("/turf/open/space/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, $0];
	$0 = live(passed_mode);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You build a floor.</span>"]);
		yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
		return 1;
	}
	return 0;
}, true);

// /turf/open/space/proc/ReplaceWithLattice  (code/game/turfs/space/space.dm:191)  may sleep
rt.def("/turf/open/space/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	let dest_x: Value = null, dest_y: Value = null, dest_z: Value = null;
	f.vars = () => [dest_x, dest_y, dest_z];
	dest_x = rt.sv(f, "destination_x");
	dest_y = rt.sv(f, "destination_y");
	dest_z = rt.sv(f, "destination_z");
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "destination_x", live(dest_x));
	rt.setSv(f, "destination_y", live(dest_y));
	rt.setSv(f, "destination_z", live(dest_z));
	return f.dot;
}, true);
