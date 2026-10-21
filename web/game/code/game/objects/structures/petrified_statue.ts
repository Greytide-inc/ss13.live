// From code/game/objects/structures/petrified_statue.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12830, "/obj/structure/statue/petrified", "/obj/structure/statue", {
	timer: 240,
	petrified_mob: null,
	anchored: 1,
	name: "statue",
	desc: "An incredibly lifelike marble carving.",
	icon_state: "human_male",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/statue/petrified/proc/New  (code/game/objects/structures/petrified_statue.dm:14)  may sleep
rt.def("/obj/structure/statue/petrified/proc/New", function* New(f: Frame) {
	if (truthy(live(f.args[2]))) {
		rt.setSv(f, "timer", live(f.args[2]));
	}
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "petrified_mob", live(f.args[1]));
		if (truthy(rt.fv(f, "buckled", live(f.args[1])))) {
			yield* g.callName(f, rt.fv(f, "buckled", live(f.args[1])), "unbuckle_mob", [null, live(f.args[1]), "force", 1], rt.Args.Named);
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀'s skin rapidly turns to marble!</span>", [live(f.args[1])]), "<span class='userdanger'>Your body freezes up! Can't... move... can't...  think...</span>"]);
		yield* g.callName(f, live(f.args[1]), "forceMove", [live(f.src)]);
		(rt.modField(f, live(f.args[1]), "disabilities", 2, rt.bitOr));
		rt.modField(f, live(f.args[1]), "faction", "mimic", add);
		(rt.modField(f, live(f.args[1]), "status_flags", 4096, rt.bitOr));
		rt.setSv(f, "obj_integrity", add(rt.fv(f, "health", live(f.args[1])), 100));
		rt.setSv(f, "max_integrity", rt.sv(f, "obj_integrity"));
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["loc", "L", "statue_timer"] });

// /obj/structure/statue/petrified/proc/process  (code/game/objects/structures/petrified_statue.dm:30)  may sleep
rt.def("/obj/structure/statue/petrified/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "petrified_mob"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	rt.incSrcVar(f, "timer", -1, true);
	yield* g.callName(f, rt.sv(f, "petrified_mob"), "Stun", [40]);
	if (!rt.le(rt.sv(f, "timer"), 0)) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/statue/petrified/proc/handle_atom_del  (code/game/objects/structures/petrified_statue.dm:42)
rt.def("/obj/structure/statue/petrified/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "petrified_mob"))) return f.dot;
	rt.setSv(f, "petrified_mob", null);
	return f.dot;
});

// /obj/structure/statue/petrified/proc/Destroy  (code/game/objects/structures/petrified_statue.dm:47)  may sleep
rt.def("/obj/structure/statue/petrified/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [S, O, $e];
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/simple_animal/hostile/statue")) ? 1 : 0))) {
		yield* g.srcCall(f, "forceMove", rt.gv(f, "loc", (S = rt.fv(f, "loc", live(f.src)))));
		if (truthy(rt.fv(f, "mind", live(S)))) {
			if (truthy(rt.sv(f, "petrified_mob"))) {
				yield* g.callName(f, rt.fv(f, "mind", live(S)), "transfer_to", [rt.sv(f, "petrified_mob")]);
				yield* g.callName(f, rt.sv(f, "petrified_mob"), "Knockdown", [100]);
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "petrified_mob"), "<span class='notice'>You slowly come back to your senses. You are in control of yourself again!</span>"]);
			}
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	}
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "forceMove", [rt.sv(f, "loc")]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "petrified_mob"))) {
		(rt.modField(f, rt.sv(f, "petrified_mob"), "status_flags", 16773119, rt.bitAnd));
		yield* g.callName(f, rt.sv(f, "petrified_mob"), "forceMove", [rt.sv(f, "loc")]);
		(rt.modField(f, rt.sv(f, "petrified_mob"), "disabilities", 16777213, rt.bitAnd));
		yield* g.callName(f, rt.sv(f, "petrified_mob"), "take_overall_damage", [add(subtract(rt.fv(f, "health", rt.sv(f, "petrified_mob")), rt.sv(f, "obj_integrity")), 100)]);
		(rt.modField(f, rt.sv(f, "petrified_mob"), "faction", "mimic", subtract));
		rt.setSv(f, "petrified_mob", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/statue/petrified/proc/deconstruct  (code/game/objects/structures/petrified_statue.dm:70)  may sleep
rt.def("/obj/structure/statue/petrified/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(live(disassembled))) {
		if (truthy(rt.sv(f, "petrified_mob"))) {
			yield* g.callName(f, rt.sv(f, "petrified_mob"), "dust", []);
		}
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ shatters!.</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/petrify  (code/game/objects/structures/petrified_statue.dm:80)  may sleep
rt.def("/mob/living/carbon/human/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null, newcolor: Value = null;
	f.vars = () => [statue_timer, S, newcolor];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return 0;
	}
	rt.setFv(f, "name", (S = (yield* g.new_(f, T("/obj/structure/statue/petrified"), [rt.sv(f, "loc"), live(f.src), live(statue_timer)]))), fmt("statue of ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "bleedsuppress", 1);
	yield* g.callName(f, live(S), "copy_overlays", [live(f.src)]);
	newcolor = rt.list("#4d4d4d", "#969696", "#1c1c1c", "#000000");
	yield* g.callName(f, live(S), "add_atom_colour", [live(newcolor), 4]);
	return 1;
}, true);

// /mob/living/carbon/monkey/proc/petrify  (code/game/objects/structures/petrified_statue.dm:91)  may sleep
rt.def("/mob/living/carbon/monkey/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null;
	f.vars = () => [statue_timer, S];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return 0;
	}
	rt.setFv(f, "name", (S = (yield* g.new_(f, T("/obj/structure/statue/petrified"), [rt.sv(f, "loc"), live(f.src), live(statue_timer)]))), "statue of a monkey");
	rt.setFv(f, "icon_state", live(S), "monkey");
	return 1;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/petrify  (code/game/objects/structures/petrified_statue.dm:99)  may sleep
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null;
	f.vars = () => [statue_timer, S];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		return 0;
	}
	rt.setFv(f, "name", (S = (yield* g.new_(f, T("/obj/structure/statue/petrified"), [rt.sv(f, "loc"), live(f.src), live(statue_timer)]))), "statue of a corgi");
	rt.setFv(f, "icon_state", live(S), "corgi");
	rt.setFv(f, "desc", live(S), "If it takes forever, I will wait for you...");
	return 1;
}, true);
