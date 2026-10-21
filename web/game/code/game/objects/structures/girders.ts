// From code/game/objects/structures/girders.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12240, "/obj/structure/girder", "/obj/structure", {
	state: 0,
	girderpasschance: 20,
	can_displace: 1,
	anchored: 1,
	name: "girder",
	icon_state: "girder",
	density: 1,
	layer: 2.9,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/girder/proc/examine  (code/game/objects/structures/girders.dm:14)
rt.def("/obj/structure/girder/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "state");
	if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The support struts are <b>screwed</b> in place.</span>"]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The support struts are <i>unscrewed</i> and the inner <b>grille</b> is intact.</span>"]);
	} else if ($0 === 0) {
		if (truthy(rt.sv(f, "can_displace"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The bolts are <b>wrenched</b> in place.</span>"]);
		}
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The bolts are <i>loosened</i>, but the <b>screws</b> are holding ＀ together.</span>", [live(f.src)])]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is disassembled! You probably shouldn't be able to see this examine message.</span>", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/girder/proc/attackby  (code/game/objects/structures/girders.dm:29)  may sleep
rt.def("/obj/structure/girder/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null, G: Value = null, D: Value = null, S: Value = null, FW: Value = null, _T: Value = null, F: Value = null, R: Value = null, M_1: Value = null, F_2: Value = null, FW_3: Value = null, _T_2: Value = null, _P: Value = null;
	f.vars = () => [M, G, D, S, FW, _T, F, R, M_1, F_2, FW_3, _T_2, _P];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "state"), 3)) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the girder.</span>", [live(f.args[1])]), "<span class='notice'>You start to disassemble the girder...</span>", "You hear clanking and banging noises."]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (!isEqual(rt.sv(f, "state"), 3)) {
					return live(f.dot);
				}
				rt.setSv(f, "state", 4);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disassemble the girder.</span>"]);
				yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]))), "add_fingerprint", [live(f.args[1])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			if (isEqual(rt.sv(f, "state"), 2)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start unsecuring support struts...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (!isEqual(rt.sv(f, "state"), 2)) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the support struts.</span>"]);
					rt.setSv(f, "state", 1);
				}
			} else {
				if (isEqual(rt.sv(f, "state"), 1)) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start securing support struts...</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if (!isEqual(rt.sv(f, "state"), 1)) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the support struts.</span>"]);
						rt.setSv(f, "state", 2);
					}
				}
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "state"), 3)) {
				if (!truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A floor must be present to secure the girder!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start securing the girder...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the girder.</span>"]);
					yield* g.srcCall(f, "transfer_fingerprints_to", (G = (yield* g.new_(f, T("/obj/structure/girder"), [rt.sv(f, "loc")]))));
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				if ((isEqual(rt.sv(f, "state"), 0) && truthy(rt.sv(f, "can_displace")))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start unsecuring the girder...</span>"]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the girder.</span>"]);
						yield* g.srcCall(f, "transfer_fingerprints_to", (D = (yield* g.new_(f, T("/obj/structure/girder/displaced"), [rt.sv(f, "loc")]))));
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					}
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start slicing apart the girder...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You slice apart the girder.</span>"]);
					yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]))), "add_fingerprint", [live(f.args[1])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
					D = live(f.args[0]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You smash through the girder!</span>"]);
					yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, live(f.src), 0)]);
					yield* g.callName(f, live(D), "playDigSound", []);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 1))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start removing the inner grille...</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the inner grille.</span>"]);
							yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, live(f.src), 0)]);
							yield* g.srcCall(f, "transfer_fingerprints_to", (G = (yield* g.new_(f, T("/obj/structure/girder"), [rt.sv(f, "loc")]))));
							yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						}
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack")) ? 1 : 0))) {
							if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/closed/wall")) ? 1 : 0))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a wall present!</span>"]);
								return live(f.dot);
							}
							if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/turf/open/floor")) ? 1 : 0))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>A floor must be present to build a false wall!</span>"]);
								return live(f.dot);
							}
							if (truthy(rt.locateIn(f, T("/obj/structure/falsewall"), rt.gv(f, "contents", rt.fv(f, "loc", live(f.src)))))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a false wall present!</span>"]);
								return live(f.dot);
							}
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0))) {
								S = live(f.args[0]);
								if (isEqual(rt.sv(f, "state"), 3)) {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two rods to create a false wall!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a reinforced false wall...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>"]);
										yield* g.srcCall(f, "transfer_fingerprints_to", (FW = (yield* g.new_(f, T("/obj/structure/falsewall/iron"), [rt.sv(f, "loc")]))));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
								} else {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 5)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least five rods to add plating!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start adding plating...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 5))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [5]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the plating.</span>"]);
										yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [T("/turf/closed/wall/mineral/iron")]);
										yield* g.srcCall(f, "transfer_fingerprints_to", live(_T));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
									return live(f.dot);
								}
							}
							if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
								return live(f.dot);
							}
							if (truthy((rt.istype((S = live(f.args[0])), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
								if (isEqual(rt.sv(f, "state"), 3)) {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of metal to create a false wall!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a false wall...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>"]);
										yield* g.srcCall(f, "transfer_fingerprints_to", (F = (yield* g.new_(f, T("/obj/structure/falsewall"), [rt.sv(f, "loc")]))));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
								} else {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of metal to finish a wall!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start adding plating...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
										if ((rt.sv(f, "loc") === null || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the plating.</span>"]);
										yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [T("/turf/closed/wall")]);
										yield* g.srcCall(f, "transfer_fingerprints_to", live(_T));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
									return live(f.dot);
								}
							}
							if (truthy((rt.istype(live(S), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
								if (isEqual(rt.sv(f, "state"), 3)) {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two sheets to create a false wall!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start building a reinforced false wall...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You create a reinforced false wall. Push on it to open or close the passage.</span>"]);
										yield* g.srcCall(f, "transfer_fingerprints_to", (FW = (yield* g.new_(f, T("/obj/structure/falsewall/reinforced"), [rt.sv(f, "loc")]))));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
								} else {
									if (isEqual(rt.sv(f, "state"), 2)) {
										if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 1)) {
											return live(f.dot);
										}
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start finalizing the reinforced wall...</span>"]);
										if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
											if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 1))) {
												return live(f.dot);
											}
											yield* g.callName(f, live(S), "use", [1]);
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fully reinforce the wall.</span>"]);
											yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [T("/turf/closed/wall/r_wall")]);
											yield* g.srcCall(f, "transfer_fingerprints_to", live(_T));
											yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
										}
										return live(f.dot);
									} else {
										if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 1)) {
											return live(f.dot);
										}
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start reinforcing the girder...</span>"]);
										if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 60, "target", live(f.src)], rt.Args.Named)))) {
											if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 1))) {
												return live(f.dot);
											}
											yield* g.callName(f, live(S), "use", [1]);
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You reinforce the girder.</span>"]);
											yield* g.srcCall(f, "transfer_fingerprints_to", (R = (yield* g.new_(f, T("/obj/structure/girder/reinforced"), [rt.sv(f, "loc")]))));
											yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
										}
										return live(f.dot);
									}
								}
							}
							if (truthy(rt.fv(f, "sheettype", live(S)))) {
								M_1 = rt.fv(f, "sheettype", live(S));
								if (isEqual(rt.sv(f, "state"), 3)) {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two sheets to create a false wall!</span>"]);
										return live(f.dot);
									}
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You create a false wall. Push on it to open or close the passage.</span>"]);
										F_2 = (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/structure/falsewall/＀", [live(M_1)])]));
										yield* g.srcCall(f, "transfer_fingerprints_to", (FW_3 = (yield* g.new_(f, live(F_2), [rt.sv(f, "loc")]))));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
								} else {
									if (rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2)) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two sheets to add plating!</span>"]);
										return live(f.dot);
									}
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start adding plating...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
										if (((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(live(S))) || rt.lt((yield* g.callName(f, live(S), "get_amount", [])), 2))) {
											return live(f.dot);
										}
										yield* g.callName(f, live(S), "use", [2]);
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the plating.</span>"]);
										yield* g.callName(f, (_T_2 = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [(yield* g.call(f, P("/proc/text2path"), null, [fmt("/turf/closed/wall/mineral/＀", [live(M_1)])]))]);
										yield* g.srcCall(f, "transfer_fingerprints_to", live(_T_2));
										yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
									}
									return live(f.dot);
								}
							}
							yield* g.srcCall(f, "add_hiddenprint", live(f.args[1]));
						} else {
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/pipe")) ? 1 : 0))) {
								if (truthy((rt.isIn(f, rt.gv(f, "pipe_type", (_P = live(f.args[0]))), rt.list(0, 1, 5)) ? 1 : 0))) {
									if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
										return live(f.dot);
									}
									rt.setFv(f, "loc", live(_P), rt.fv(f, "loc", live(f.src)));
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fit the pipe into ％！.</span>", [live(f.src)])]);
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
}, true, { args: ["W", "user", "params"] });

// /obj/structure/girder/proc/CanPass  (code/game/objects/structures/girders.dm:270)
rt.def("/obj/structure/girder/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [4])))) {
		return rt.op(f, "Prob", [], [rt.sv(f, "girderpasschance")]);
	}
	if (truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0))) {
		return rt.op(f, "Prob", [], [rt.sv(f, "girderpasschance")]);
	}
	return 0;
});

// /obj/structure/girder/proc/CanAStarPass  (code/game/objects/structures/girders.dm:281)
rt.def("/obj/structure/girder/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [4]));
	return f.dot;
});

// /obj/structure/girder/proc/deconstruct  (code/game/objects/structures/girders.dm:287)  may sleep
rt.def("/obj/structure/girder/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let remains: Value = null;
	f.vars = () => [disassembled, remains];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		remains = rt.op(f, "PickUnweighted", [2], [T("/obj/item/stack/rods"), T("/obj/item/stack/sheet/metal")]);
		yield* g.new_(f, live(remains), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/girder/proc/ratvar_act  (code/game/objects/structures/girders.dm:294)  may sleep
rt.def("/obj/structure/girder/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (truthy(rt.sv(f, "anchored"))) {
		yield* g.new_(f, T("/obj/structure/destructible/clockwork/wall_gear"), [rt.sv(f, "loc")]);
	} else {
		yield* g.new_(f, T("/obj/structure/destructible/clockwork/wall_gear/displaced"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/girder/proc/narsie_act  (code/game/objects/structures/girders.dm:300)  may sleep
rt.def("/obj/structure/girder/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/girder/cult"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12243, "/obj/structure/girder/cult", "/obj/structure/girder", {
	can_displace: 0,
	name: "runed girder",
	desc: "Framework made of a strange and shockingly cold metal. It doesn't seem to have any bolts.",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "cultgirder",
});

// /obj/structure/girder/cult/proc/attackby  (code/game/objects/structures/girders.dm:332)  may sleep
rt.def("/obj/structure/girder/cult/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, WT: Value = null, R_1: Value = null, D: Value = null, _T: Value = null;
	f.vars = () => [R, WT, R_1, D, _T];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tome")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ strikes ＀ with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You demolish ＀.</span>", [live(f.src)])]);
		rt.setFv(f, "amount", (R = (yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.getStep(f, live(f.src), 0)]))), 1);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start slicing apart the girder...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You slice apart the girder.</span>"]);
					rt.setFv(f, "amount", (R_1 = (yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.getStep(f, live(f.src), 0)]))), 1);
					yield* g.srcCall(f, "transfer_fingerprints_to", live(R_1));
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start slicing apart the girder...</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You slice apart the girder.</span>"]);
					rt.setFv(f, "amount", (R = (yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.getStep(f, live(f.src), 0)]))), 1);
					yield* g.srcCall(f, "transfer_fingerprints_to", live(R));
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
					D = live(f.args[0]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Your jackhammer smashes through the girder!</span>"]);
					rt.setFv(f, "amount", (R_1 = (yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.getStep(f, live(f.src), 0)]))), 2);
					yield* g.srcCall(f, "transfer_fingerprints_to", live(R_1));
					yield* g.callName(f, live(D), "playDigSound", []);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/runed_metal")) ? 1 : 0))) {
						if (rt.lt((yield* g.callName(f, (R = live(f.args[0])), "get_amount", [])), 1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least one sheet of runed metal to construct a runed wall!</span>"]);
							return 0;
						}
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins laying runed metal on ＀...</span>", [live(f.args[1]), live(f.src)]), "<span class='notice'>You begin constructing a runed wall...</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
							if ((rt.lt((yield* g.callName(f, live(R), "get_amount", [])), 1) || !truthy(live(R)))) {
								return live(f.dot);
							}
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ plates ＀ with runed metal.</span>", [live(f.args[1]), live(f.src)]), "<span class='notice'>You construct a runed wall.</span>"]);
							yield* g.callName(f, live(R), "use", [1]);
							yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "ChangeTurf", [T("/turf/closed/wall/mineral/cult")]);
							yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/girder/cult/proc/deconstruct  (code/game/objects/structures/girders.dm:394)  may sleep
rt.def("/obj/structure/girder/cult/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.getStep(f, live(f.src), 0), 1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/girder/proc/rcd_vals  (code/game/objects/structures/girders.dm:399)
rt.def("/obj/structure/girder/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 1) {
		return rt.alist(f, ["mode", 1, "delay", 20, "cost", 8]);
	} else if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 20, "cost", 13]);
	}
	return 0;
});

// /obj/structure/girder/proc/rcd_act  (code/game/objects/structures/girders.dm:407)  may sleep
rt.def("/obj/structure/girder/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let _T: Value = null;
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, _T, $0];
	_T = rt.getStep(f, live(f.src), 0);
	$0 = live(passed_mode);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You finish a wall.</span>"]);
		yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall")]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deconstruct the girder.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return 0;
}, true);
