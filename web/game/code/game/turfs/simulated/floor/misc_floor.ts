// From code/game/turfs/simulated/floor/misc_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4590, "/turf/open/floor/circuit", "/turf/open/floor", {
	icon_normal: "bcircuit",
	on: 1,
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "bcircuit",
	light_color: "#7DE1E1",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit"),
});

// /turf/open/floor/circuit/proc/Initialize  (code/game/turfs/simulated/floor/misc_floor.dm:22)  may sleep
rt.def("/turf/open/floor/circuit/proc/Initialize", function* Initialize(f: Frame) {
	rt.modField(f, rt.gl("SSmapping"), "nuke_tiles", live(f.src), add);
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /turf/open/floor/circuit/proc/Destroy  (code/game/turfs/simulated/floor/misc_floor.dm:26)  may sleep
rt.def("/turf/open/floor/circuit/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSmapping"), "nuke_tiles", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/open/floor/circuit/proc/update_icon  (code/game/turfs/simulated/floor/misc_floor.dm:31)
rt.def("/turf/open/floor/circuit/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		if (truthy(rt.length(rt.fv(f, "nuke_threats", rt.gl("SSmapping"))))) {
			rt.setSv(f, "icon_state", "rcircuitanim");
			rt.setSv(f, "light_color", "#FA644B");
		} else {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_normal"));
			rt.setSv(f, "light_color", rt.initial(f, live(f.src), "light_color"));
		}
		rt.callSrc(f, "set_light", [1.399999976158142, 0.5]);
	} else {
		rt.setSv(f, "icon_state", fmt("＀off", [rt.sv(f, "icon_normal")]));
		rt.callSrc(f, "set_light", [0]);
	}
	return f.dot;
});

rt.type(4550, "/turf/open/floor/clockwork", "/turf/open/floor", {
	realappearence: null,
	name: "clockwork floor",
	desc: "Tightly-pressed brass tiles. They emit minute vibration.",
	icon_state: "plating",
});

// /turf/open/floor/clockwork/proc/Initialize  (code/game/turfs/simulated/floor/misc_floor.dm:135)  may sleep
rt.def("/turf/open/floor/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/floor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam"), [live(f.src)]);
	rt.setSv(f, "realappearence", (yield* g.new_(f, T("/obj/effect/clockwork/overlay/floor"), [live(f.src)])));
	rt.setFv(f, "linked", rt.sv(f, "realappearence"), live(f.src));
	yield* g.call(f, P("/proc/change_construction_value"), null, [1]);
	return f.dot;
}, true);

// /turf/open/floor/clockwork/proc/Destroy  (code/game/turfs/simulated/floor/misc_floor.dm:143)  may sleep
rt.def("/turf/open/floor/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/change_construction_value"), null, [-1]);
	if (truthy(rt.sv(f, "realappearence"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "realappearence")]);
		rt.setSv(f, "realappearence", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/open/floor/clockwork/proc/ReplaceWithLattice  (code/game/turfs/simulated/floor/misc_floor.dm:151)  may sleep
rt.def("/turf/open/floor/clockwork/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	L = null;
	rt.forList(f, 0, live(f.src), T("/obj/structure/lattice"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "ratvar_act", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/floor/clockwork/proc/Entered  (code/game/turfs/simulated/floor/misc_floor.dm:156)  may sleep
rt.def("/turf/open/floor/clockwork/proc/Entered", function* Entered(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["AM"] });

// /turf/open/floor/clockwork/proc/process  (code/game/turfs/simulated/floor/misc_floor.dm:160)  may sleep
rt.def("/turf/open/floor/clockwork/proc/process", function* process(f: Frame) {
	if (truthy((yield* g.srcCall(f, "healservants")))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /turf/open/floor/clockwork/proc/healservants  (code/game/turfs/simulated/floor/misc_floor.dm:164)  may sleep
rt.def("/turf/open/floor/clockwork/proc/healservants", function* healservants(f: Frame) {
	let L: Value = null, I: Value = null, viewing: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, I, viewing, M, $e];
	L = null;
	rt.forList(f, 0, live(f.src), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
			continue;
		}
		f.dot = 1;
		if ((!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) || !truthy(rt.fv(f, "toxloss", live(L))))) {
			continue;
		}
		rt.setFv(f, "appearance_flags", (I = (yield* g.new_(f, T("/image"), [rt.rsc("icons/effects/effects.dmi"), live(f.src), "heal", 4.099999904632568]))), 2);
		rt.setFv(f, "color", live(I), "#5A6068");
		rt.setFv(f, "pixel_x", live(I), (yield* g.call(f, P("/proc/rand"), null, [-12, 12])));
		rt.setFv(f, "pixel_y", live(I), (yield* g.call(f, P("/proc/rand"), null, [-9, 0])));
		viewing = rt.list();
		M = null;
		rt.forList(f, 1, (yield* g.call(f, P("/proc/viewers"), null, [live(f.src)])), T("/mob"));
		while (($e = rt.next(f, 1)) !== undefined) {
			M = $e;
			if ((truthy(rt.fv(f, "client", live(M))) && ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(M)]))) || truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) || isEqual(rt.fv(f, "stat", live(M)), 2)))) {
				viewing = rt.modify(live(viewing), rt.fv(f, "client", live(M)), add);
			}
		}
		rt.endFor(f, 1);
		yield* g.call(f, P("/proc/flick_overlay"), null, [live(I), live(viewing), 8]);
		yield* g.callName(f, live(L), "adjustToxLoss", [-3, 1, 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/floor/clockwork/proc/attackby  (code/game/turfs/simulated/floor/misc_floor.dm:184)  may sleep
rt.def("/turf/open/floor/clockwork/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins slowly prying up ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin painstakingly prying up ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 20, 1]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(70, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			return 0;
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ pries up ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You pry up ＀!</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 80, 1]);
		yield* g.srcCall(f, "make_plating");
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /turf/open/floor/clockwork/proc/make_plating  (code/game/turfs/simulated/floor/misc_floor.dm:196)  may sleep
rt.def("/turf/open/floor/clockwork/proc/make_plating", function* make_plating(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/brass"), [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/open/floor/clockwork/proc/narsie_act  (code/game/turfs/simulated/floor/misc_floor.dm:200)  may sleep
rt.def("/turf/open/floor/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.src), T("/turf/open/floor/clockwork")) ? 1 : 0))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

rt.type(4611, "/turf/open/floor/vines", "/turf/open/floor", {
	broken_states: null,
	color: "#aa77aa",
	icon_state: "vinefloor",
});

// /turf/open/floor/vines/proc/<init>  (code/game/turfs/simulated/floor/misc_floor.dm:228)
rt.def("/turf/open/floor/vines/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list());
	return f.dot;
});

// /turf/open/floor/vines/proc/ex_act  (code/game/turfs/simulated/floor/misc_floor.dm:249)  may sleep
rt.def("/turf/open/floor/vines/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(rt.lt(live(f.args[0]), 3) || isEqual(live(f.args[1]), live(f.src)))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "baseturf", live(f.src)));
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /turf/open/floor/vines/proc/narsie_act  (code/game/turfs/simulated/floor/misc_floor.dm:254)  may sleep
rt.def("/turf/open/floor/vines/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	f.vars = () => [force, ignore_mobs, probability];
	if (live(probability) === null) {
		probability = 20;
	}
	if (!(truthy(rt.op(f, "Prob", [], [live(probability)])) || truthy(live(force)))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf"));
	yield* g.srcCall(f, "narsie_act", live(force), live(ignore_mobs), live(probability));
	return f.dot;
}, true);

// /turf/open/floor/vines/proc/singularity_pull  (code/game/turfs/simulated/floor/misc_floor.dm:259)  may sleep
rt.def("/turf/open/floor/vines/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", rt.fv(f, "baseturf", live(f.src)));
	return f.dot;
}, true);

// /turf/open/floor/vines/proc/ChangeTurf  (code/game/turfs/simulated/floor/misc_floor.dm:264)  may sleep
rt.def("/turf/open/floor/vines/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	let SV: Value = null;
	let $e: any;
	f.vars = () => [SV, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	SV = null;
	rt.forList(f, 0, live(f.src), T("/obj/structure/spacevine"));
	while (($e = rt.next(f, 0)) !== undefined) {
		SV = $e;
		if (!(!truthy(live(SV)) || isEqual(rt.fv(f, "gc_destroyed", live(SV)), -3))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(SV)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["T"] });
