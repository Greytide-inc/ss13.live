// From code/game/objects/structures/table_frames.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12203, "/obj/structure/table_frame", "/obj/structure", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	framestackamount: 2,
	anchored: 0,
	name: "table frame",
	desc: "Four metal legs with four framing rods for a table. You could easily pass through this.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "table_frame",
	density: 0,
	layer: 2.75,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/structure/table_frame/proc/attackby  (code/game/objects/structures/table_frames.dm:26)  may sleep
rt.def("/obj/structure/table_frame/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, M: Value = null, G: Value = null, S: Value = null, C: Value = null;
	f.vars = () => [_P, M, G, S, C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start disassembling ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.srcCall(f, "deconstruct", 1);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (_P = live(f.args[0])), "get_amount", [])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one plasteel sheet to do this!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(_P), live(f.src)])]);
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(_P), "use", [1]))))) {
				yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/reinforced"));
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
				if (rt.lt((yield* g.callName(f, (M = live(f.args[0])), "get_amount", [])), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one metal sheet to do this!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(M), live(f.src)])]);
				if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(M), "use", [1]))))) {
					yield* g.srcCall(f, "make_new_table", T("/obj/structure/table"));
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
					if (rt.lt((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 1)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one glass sheet to do this!</span>"]);
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(G), live(f.src)])]);
					if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(G), "use", [1]))))) {
						yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/glass"));
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/silver")) ? 1 : 0))) {
						if (rt.lt((yield* g.callName(f, (S = live(f.args[0])), "get_amount", [])), 1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one silver sheet to do this!</span>"]);
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(S), live(f.src)])]);
						if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(S), "use", [1]))))) {
							yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/optable"));
						}
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/carpet/black")) ? 1 : 0))) {
							if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 1)) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one  black carpet sheet to do this!</span>"]);
								return live(f.dot);
							}
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(C), live(f.src)])]);
							if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(C), "use", [1]))))) {
								yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/wood/fancy/black"));
							}
						} else {
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/carpet")) ? 1 : 0))) {
								if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 1)) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one carpet sheet to do this!</span>"]);
									return live(f.dot);
								}
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(C), live(f.src)])]);
								if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(C), "use", [1]))))) {
									yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/wood/fancy"));
								}
							} else {
								return (yield* g.callSuper(f, [], rt.Args.Same));
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/table_frame/proc/make_new_table  (code/game/objects/structures/table_frames.dm:84)  may sleep
rt.def("/obj/structure/table_frame/proc/make_new_table", function* make_new_table(f: Frame, table_type: Value) {
	let _T: Value = null;
	f.vars = () => [table_type, _T];
	rt.setFv(f, "frame", (_T = (yield* g.new_(f, live(table_type), [rt.sv(f, "loc")]))), rt.sv(f, "type"));
	rt.setFv(f, "framestack", live(_T), rt.sv(f, "framestack"));
	rt.setFv(f, "framestackamount", live(_T), rt.sv(f, "framestackamount"));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/table_frame/proc/deconstruct  (code/game/objects/structures/table_frames.dm:91)  may sleep
rt.def("/obj/structure/table_frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, rt.sv(f, "framestack"), [rt.getStep(f, live(f.src), 0), rt.sv(f, "framestackamount")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/table_frame/proc/narsie_act  (code/game/objects/structures/table_frames.dm:95)  may sleep
rt.def("/obj/structure/table_frame/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/table_frame/wood"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/table_frame/proc/ratvar_act  (code/game/objects/structures/table_frames.dm:99)  may sleep
rt.def("/obj/structure/table_frame/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/table_frame/brass"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12206, "/obj/structure/table_frame/wood", "/obj/structure/table_frame", {
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	framestackamount: 2,
	name: "wooden table frame",
	desc: "Four wooden legs with four framing wooden rods for a wooden table. You could easily pass through this.",
	icon_state: "wood_frame",
	resistance_flags: 4,
});

// /obj/structure/table_frame/wood/proc/attackby  (code/game/objects/structures/table_frames.dm:115)  may sleep
rt.def("/obj/structure/table_frame/wood/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null, C: Value = null;
	f.vars = () => [W, C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/wood")) ? 1 : 0))) {
		if (rt.lt((yield* g.callName(f, (W = live(f.args[0])), "get_amount", [])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one wood sheet to do this!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(W), live(f.src)])]);
		if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(W), "use", [1]))))) {
			yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/wood"));
		}
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/carpet")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one carpet sheet to do this!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(C), live(f.src)])]);
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(C), "use", [1]))))) {
				yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/wood/poker"));
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(12204, "/obj/structure/table_frame/brass", "/obj/structure/table_frame", {
	name: "brass table frame",
	desc: "Four pieces of brass arranged in a square. It's slightly warm to the touch.",
	icon_state: "brass_frame",
	resistance_flags: 34,
	framestack: rt.typePath("/obj/item/stack/tile/brass"),
	framestackamount: 1,
});

// /obj/structure/table_frame/brass/proc/New  (code/game/objects/structures/table_frames.dm:144)  may sleep
rt.def("/obj/structure/table_frame/brass/proc/New", function* New(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [1]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/table_frame/brass/proc/Destroy  (code/game/objects/structures/table_frames.dm:148)  may sleep
rt.def("/obj/structure/table_frame/brass/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [-1]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/table_frame/brass/proc/attackby  (code/game/objects/structures/table_frames.dm:152)  may sleep
rt.def("/obj/structure/table_frame/brass/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/brass")) ? 1 : 0))) {
		if (rt.lt((yield* g.callName(f, (W = live(f.args[0])), "get_amount", [])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one brass sheet to do this!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(W), live(f.src)])]);
		if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && truthy((yield* g.callName(f, live(W), "use", [1]))))) {
			yield* g.srcCall(f, "make_new_table", T("/obj/structure/table/reinforced/brass"));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/table_frame/brass/proc/narsie_act  (code/game/objects/structures/table_frames.dm:164)  may sleep
rt.def("/obj/structure/table_frame/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);
