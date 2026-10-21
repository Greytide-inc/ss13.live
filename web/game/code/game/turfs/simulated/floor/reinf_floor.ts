// From code/game/turfs/simulated/floor/reinf_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4757, "/turf/open/floor/engine", "/turf/open/floor", {
	name: "reinforced floor",
	icon_state: "engine",
	thermal_conductivity: 0.025,
	heat_capacity: 1e+31,
	floor_tile: rt.typePath("/obj/item/stack/rods"),
});

// /turf/open/floor/engine/proc/make_plating  (code/game/turfs/simulated/floor/reinf_floor.dm:20)  may sleep
rt.def("/turf/open/floor/engine/proc/make_plating", function* make_plating(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy(live(f.args[0]))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["force"] });

// /turf/open/floor/engine/proc/attackby  (code/game/turfs/simulated/floor/reinf_floor.dm:24)  may sleep
rt.def("/turf/open/floor/engine/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	f.vars = () => [C, user, params];
	if ((!truthy(live(C)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(C), T("/obj/item/weapon/wrench")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin removing rods...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(C)), 80, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(30, rt.fv(f, "toolspeed", live(C))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (!truthy((rt.istype(live(f.src), T("/turf/open/floor/engine")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/item/stack/rods"), [live(f.src), 2]);
	yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
	return live(f.dot);
}, true);

// /turf/open/floor/engine/proc/acid_act  (code/game/turfs/simulated/floor/reinf_floor.dm:37)  may sleep
rt.def("/turf/open/floor/engine/proc/acid_act", function* acid_act(f: Frame) {
	f.args[0] = (yield* g.call(f, P("/proc/min"), null, [live(f.args[0]), 50]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["acidpwr", "acid_volume"] });

// /turf/open/floor/engine/proc/ex_act  (code/game/turfs/simulated/floor/reinf_floor.dm:41)  may sleep
rt.def("/turf/open/floor/engine/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let shielded: Value = null;
	let $0: any;
	f.vars = () => [severity, target, shielded, $0];
	shielded = (yield* g.srcCall(f, "is_shielded"));
	yield* g.srcCall(f, "contents_explosion", live(severity), live(target));
	if (((!isEqual(live(severity), 1) && truthy(live(shielded))) && !isEqual(live(target), live(f.src)))) {
		return live(f.dot);
	}
	if (isEqual(live(target), live(f.src))) {
		yield* g.callName(f, live(f.src), "ChangeTurf", [rt.fv(f, "baseturf", live(f.src))]);
		return live(f.dot);
	}
	$0 = live(severity);
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [80]))) {
			yield* g.srcCall(f, "ReplaceWithLattice");
		} else {
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "baseturf", live(f.src)));
			} else {
				yield* g.srcCall(f, "make_plating", 1);
			}
		}
	} else if ($0 === 2) {
		if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
		yield* g.srcCall(f, "make_plating", 1);
	}
	return f.dot;
}, true, { waitfor: false });

// /turf/open/floor/engine/proc/singularity_pull  (code/game/turfs/simulated/floor/reinf_floor.dm:61)  may sleep
rt.def("/turf/open/floor/engine/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	if (truthy(rt.sv(f, "floor_tile"))) {
		if (truthy(rt.op(f, "Prob", [], [30]))) {
			yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
			yield* g.srcCall(f, "make_plating");
		}
	} else {
		if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
		yield* g.srcCall(f, "ReplaceWithLattice");
	}
	return f.dot;
}, true);

// /turf/open/floor/engine/proc/attack_paw  (code/game/turfs/simulated/floor/reinf_floor.dm:70)  may sleep
rt.def("/turf/open/floor/engine/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /turf/open/floor/engine/proc/attack_hand  (code/game/turfs/simulated/floor/reinf_floor.dm:73)  may sleep
rt.def("/turf/open/floor/engine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "Move_Pulled", [live(f.src)]);
	return f.dot;
}, true);

rt.type(4765, "/turf/open/floor/engine/cult", "/turf/open/floor/engine", {
	realappearence: null,
	name: "engraved floor",
	icon_state: "plating",
});

// /turf/open/floor/engine/cult/proc/Initialize  (code/game/turfs/simulated/floor/reinf_floor.dm:110)  may sleep
rt.def("/turf/open/floor/engine/cult/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/turf/floor"), [live(f.src)]);
	rt.setSv(f, "realappearence", (yield* g.new_(f, T("/obj/effect/clockwork/overlay/floor/bloodcult"), [live(f.src)])));
	rt.setFv(f, "linked", rt.sv(f, "realappearence"), live(f.src));
	return f.dot;
}, true);

// /turf/open/floor/engine/cult/proc/Destroy  (code/game/turfs/simulated/floor/reinf_floor.dm:116)  may sleep
rt.def("/turf/open/floor/engine/cult/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "be_removed");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/open/floor/engine/cult/proc/ChangeTurf  (code/game/turfs/simulated/floor/reinf_floor.dm:120)  may sleep
rt.def("/turf/open/floor/engine/cult/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!isEqual(live(f.args[0]), rt.sv(f, "type"))) {
		yield* g.srcCall(f, "be_removed");
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["path", "defer_change"] });

// /turf/open/floor/engine/cult/proc/be_removed  (code/game/turfs/simulated/floor/reinf_floor.dm:125)  may sleep
rt.def("/turf/open/floor/engine/cult/proc/be_removed", function* be_removed(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "realappearence")]);
	rt.setSv(f, "realappearence", null);
	return f.dot;
}, true);

// /turf/open/floor/engine/cult/proc/ratvar_act  (code/game/turfs/simulated/floor/reinf_floor.dm:129)  may sleep
rt.def("/turf/open/floor/engine/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.src), T("/turf/open/floor/engine/cult")) ? 1 : 0))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#FAE48C");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);
