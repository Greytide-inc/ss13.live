// From code/game/turfs/simulated/wall/misc_walls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4418, "/turf/closed/wall/mineral/cult", "/turf/closed/wall/mineral", {
	name: "runed metal wall",
	desc: "A cold metal wall engraved with indecipherable symbols. Studying them causes your head to pound.",
	icon: rt.rsc("icons/turf/walls/cult_wall.dmi"),
	icon_state: "cult",
	canSmoothWith: null,
	smooth: 2,
	sheet_amount: 1,
	sheet_type: rt.typePath("/obj/item/stack/sheet/runed_metal"),
	girder_type: rt.typePath("/obj/structure/girder/cult"),
});

// /turf/closed/wall/mineral/cult/proc/<init>  (code/game/turfs/simulated/wall/misc_walls.dm:6)
rt.def("/turf/closed/wall/mineral/cult/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});

// /turf/closed/wall/mineral/cult/proc/Initialize  (code/game/turfs/simulated/wall/misc_walls.dm:13)  may sleep
rt.def("/turf/closed/wall/mineral/cult/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/turf"), [live(f.src)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /turf/closed/wall/mineral/cult/proc/devastate_wall  (code/game/turfs/simulated/wall/misc_walls.dm:17)  may sleep
rt.def("/turf/closed/wall/mineral/cult/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* g.new_(f, rt.sv(f, "sheet_type"), [rt.getStep(f, live(f.src), 0), rt.sv(f, "sheet_amount")]);
	return f.dot;
}, true);

// /turf/closed/wall/mineral/cult/proc/Exited  (code/game/turfs/simulated/wall/misc_walls.dm:20)  may sleep
rt.def("/turf/closed/wall/mineral/cult/proc/Exited", function* Exited(f: Frame) {
	let H: Value = null, stored_pulling: Value = null;
	f.vars = () => [H, stored_pulling];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/construct/harvester")) ? 1 : 0))) return f.dot;
	H = live(f.args[0]);
	if (!truthy((stored_pulling = rt.fv(f, "pulling", live(H))))) return f.dot;
	yield* g.callName(f, live(stored_pulling), "setDir", [rt.getDir(f, rt.fv(f, "loc", live(stored_pulling)), live(f.args[1]))]);
	yield* g.callName(f, live(stored_pulling), "forceMove", [live(f.src)]);
	yield* g.callName(f, live(H), "start_pulling", [live(stored_pulling), 1]);
	return f.dot;
}, true, { args: ["AM", "newloc"] });

// /turf/closed/wall/mineral/cult/proc/ratvar_act  (code/game/turfs/simulated/wall/misc_walls.dm:30)  may sleep
rt.def("/turf/closed/wall/mineral/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.src), T("/turf/closed/wall/mineral/cult")) ? 1 : 0))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#FAE48C");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

rt.type(4419, "/turf/closed/wall/mineral/cult/artificer", "/turf/closed/wall/mineral/cult", {
	name: "runed stone wall",
	desc: "A cold stone wall engraved with indecipherable symbols. Studying them causes your head to pound.",
});

// /turf/closed/wall/mineral/cult/artificer/proc/break_wall  (code/game/turfs/simulated/wall/misc_walls.dm:42)  may sleep
rt.def("/turf/closed/wall/mineral/cult/artificer/proc/break_wall", function* break_wall(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/turf"), [rt.getStep(f, live(f.src), 0)]);
	return null;
}, true);

// /turf/closed/wall/mineral/cult/artificer/proc/devastate_wall  (code/game/turfs/simulated/wall/misc_walls.dm:46)  may sleep
rt.def("/turf/closed/wall/mineral/cult/artificer/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/turf"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

rt.type(4443, "/turf/closed/wall/clockwork", "/turf/closed/wall", {
	realappearence: null,
	linkedcache: null,
	name: "clockwork wall",
	desc: "A huge chunk of warm metal. The clanging of machinery emanates from within.",
	explosion_block: 2,
	hardness: 10,
	slicing_duration: 80,
	sheet_amount: 1,
	sheet_type: rt.typePath("/obj/item/stack/tile/brass"),
	girder_type: rt.typePath("/obj/structure/destructible/clockwork/wall_gear"),
});

// /turf/closed/wall/clockwork/proc/Initialize  (code/game/turfs/simulated/wall/misc_walls.dm:62)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/wall"), [live(f.src)]);
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam"), [live(f.src)]);
	rt.setSv(f, "realappearence", (yield* g.new_(f, T("/obj/effect/clockwork/overlay/wall"), [live(f.src)])));
	rt.setFv(f, "linked", rt.sv(f, "realappearence"), live(f.src));
	yield* g.call(f, P("/proc/change_construction_value"), null, [5]);
	return f.dot;
}, true);

// /turf/closed/wall/clockwork/proc/examine  (code/game/turfs/simulated/wall/misc_walls.dm:70)
rt.def("/turf/closed/wall/clockwork/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0))) && truthy(rt.sv(f, "linkedcache")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='brass'>It is linked to a Tinkerer's Cache, generating components!</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /turf/closed/wall/clockwork/proc/Destroy  (code/game/turfs/simulated/wall/misc_walls.dm:76)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "linkedcache"))) {
		rt.setFv(f, "linkedwall", rt.sv(f, "linkedcache"), null);
		rt.setSv(f, "linkedcache", null);
	}
	yield* g.call(f, P("/proc/change_construction_value"), null, [-5]);
	if (truthy(rt.sv(f, "realappearence"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "realappearence")]);
		rt.setSv(f, "realappearence", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /turf/closed/wall/clockwork/proc/ReplaceWithLattice  (code/game/turfs/simulated/wall/misc_walls.dm:85)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
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

// /turf/closed/wall/clockwork/proc/narsie_act  (code/game/turfs/simulated/wall/misc_walls.dm:90)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.src), T("/turf/closed/wall/clockwork")) ? 1 : 0))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /turf/closed/wall/clockwork/proc/dismantle_wall  (code/game/turfs/simulated/wall/misc_walls.dm:99)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/dismantle_wall", function* dismantle_wall(f: Frame, devastated: Value, explode: Value) {
	let newgirder: Value = null, O: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [devastated, explode, newgirder, O, _P, $e];
	if (live(devastated) === null) {
		devastated = 0;
	}
	if (live(explode) === null) {
		explode = 0;
	}
	if (truthy(live(devastated))) {
		yield* g.srcCall(f, "devastate_wall");
		yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
		if (truthy((newgirder = (yield* g.srcCall(f, "break_wall"))))) {
			yield* g.srcCall(f, "transfer_fingerprints_to", live(newgirder));
		}
		yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/clockwork"));
	}
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((rt.istype(live(O), T("/obj/structure/sign/poster")) ? 1 : 0))) {
			yield* g.callName(f, (_P = live(O)), "roll_and_drop", [live(f.src)]);
		} else {
			rt.setFv(f, "loc", live(O), live(f.src));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/closed/wall/clockwork/proc/devastate_wall  (code/game/turfs/simulated/wall/misc_walls.dm:116)  may sleep
rt.def("/turf/closed/wall/clockwork/proc/devastate_wall", function* devastate_wall(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/large"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/medium"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/clockwork/alloy_shards/small"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(4445, "/turf/closed/wall/ice", "/turf/closed/wall", {
	hardness: 35,
	slicing_duration: 150,
	icon: rt.rsc("icons/turf/walls/icedmetal_wall.dmi"),
	icon_state: "iced",
	desc: "A wall covered in a thick sheet of ice.",
	canSmoothWith: null,
});

// /turf/closed/wall/ice/proc/<init>  (code/game/turfs/simulated/wall/misc_walls.dm:132)
rt.def("/turf/closed/wall/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});
