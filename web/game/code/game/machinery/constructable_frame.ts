// From code/game/machinery/constructable_frame.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12541, "/obj/structure/frame", "/obj/structure", {
	circuit: null,
	state: 1,
	name: "frame",
	icon: rt.rsc("icons/obj/stock_parts.dmi"),
	icon_state: "box_0",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// /obj/structure/frame/proc/examine  (code/game/machinery/constructable_frame.dm:12)
rt.def("/obj/structure/frame/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "circuit"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It has ＇！ installed.", [rt.sv(f, "circuit")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/frame/proc/deconstruct  (code/game/machinery/constructable_frame.dm:18)  may sleep
rt.def("/obj/structure/frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
		if (truthy(rt.sv(f, "circuit"))) {
			yield* g.callName(f, rt.sv(f, "circuit"), "forceMove", [rt.sv(f, "loc")]);
			rt.setSv(f, "circuit", null);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12542, "/obj/structure/frame/machine", "/obj/structure/frame", {
	components: null,
	req_components: null,
	req_component_names: null,
	name: "machine frame",
});

// /obj/structure/frame/machine/proc/examine  (code/game/machinery/constructable_frame.dm:33)
rt.def("/obj/structure/frame/machine/proc/examine", function examine(f: Frame) {
	let hasContent: Value = null, requires: Value = null, i: Value = null, tname: Value = null, amt: Value = null, use_and: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [hasContent, requires, i, tname, amt, use_and, $0, $1, $2, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(rt.sv(f, "state"), 3) && truthy(rt.sv(f, "req_components"))) && truthy(rt.sv(f, "req_component_names")))) return f.dot;
	hasContent = 0;
	requires = "It requires";
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "req_components")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		tname = rt.index(rt.sv(f, "req_components"), live(i));
		if (isEqual((amt = rt.index(rt.sv(f, "req_components"), live(tname))), 0)) {
			continue;
		}
		use_and = (isEqual(live(i), rt.len(f, rt.sv(f, "req_components"))) ? 1 : 0);
		if (truthy(live(hasContent))) {
			if (truthy(live(use_and))) {
				$0 = ", and";
			} else {
				$0 = ",";
			}
		} else {
			$0 = "";
		}
		$1 = live(amt);
		if (isEqual(live(amt), 1)) {
			$2 = rt.index(rt.sv(f, "req_component_names"), live(tname));
		} else {
			$2 = fmt("＀５", [rt.index(rt.sv(f, "req_component_names"), live(tname))]);
		}
		requires = rt.modify(live(requires), fmt("＀ ＀ ＀", [$0, $1, $2]), add);
		hasContent = 1;
	}
	rt.endFor(f, 0);
	if (truthy(live(hasContent))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), add(live(requires), ".")]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It does not require any more components."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/frame/machine/proc/update_namelist  (code/game/machinery/constructable_frame.dm:53)
rt.def("/obj/structure/frame/machine/proc/update_namelist", function update_namelist(f: Frame) {
	let tname: Value = null, S: Value = null, singular_name: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [tname, S, singular_name, O, $e];
	if (!truthy(rt.sv(f, "req_components"))) {
		return live(f.dot);
	}
	rt.setSv(f, "req_component_names", rt.new_(f, T("/list"), []));
	tname = null;
	rt.forList(f, 0, rt.sv(f, "req_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		tname = $e;
		if (truthy(rt.call(f, P("/proc/ispath"), null, [live(tname), T("/obj/item/stack")]))) {
			S = live(tname);
			if (truthy((singular_name = rt.initial(f, live(S), "singular_name")))) {
				rt.setAt(rt.sv(f, "req_component_names"), live(tname), live(singular_name));
			} else {
				rt.setAt(rt.sv(f, "req_component_names"), live(tname), rt.initial(f, live(S), "name"));
			}
		} else {
			O = live(tname);
			rt.setAt(rt.sv(f, "req_component_names"), live(tname), rt.initial(f, live(O), "name"));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/frame/machine/proc/get_req_components_amt  (code/game/machinery/constructable_frame.dm:71)
rt.def("/obj/structure/frame/machine/proc/get_req_components_amt", function get_req_components_amt(f: Frame) {
	let amt: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [amt, path, $e];
	amt = 0;
	path = null;
	rt.forList(f, 0, rt.sv(f, "req_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		amt = rt.modify(live(amt), rt.index(rt.sv(f, "req_components"), live(path)), add);
	}
	rt.endFor(f, 0);
	return live(amt);
});

// /obj/structure/frame/machine/proc/attackby  (code/game/machinery/constructable_frame.dm:76)  may sleep
rt.def("/obj/structure/frame/machine/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, M: Value = null, B: Value = null, A: Value = null, component_check: Value = null, R: Value = null, new_machine: Value = null, O: Value = null, replacer: Value = null, added_components: Value = null, part_list: Value = null, co: Value = null, path: Value = null, part: Value = null, part_3: Value = null, I: Value = null, S: Value = null, used_amt: Value = null, NS: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [C, M, B, A, component_check, R, new_machine, O, replacer, added_components, part_list, co, path, part, part_3, I, S, used_amt, NS, $0, $1, $e];
	$0 = rt.sv(f, "state");
	if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard/machine")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The frame needs wiring first!</span>"]);
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This frame does not accept circuit boards of this type!</span>"]);
				return live(f.dot);
			}
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.ge((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 5)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to add cables to the frame...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((rt.ge((yield* g.callName(f, live(C), "get_amount", [])), 5) && isEqual(rt.sv(f, "state"), 1))) {
						yield* g.callName(f, live(C), "use", [5]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add cables to the frame.</span>"]);
						rt.setSv(f, "state", 2);
						rt.setSv(f, "icon_state", "box_1");
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need five length of cable to wire the frame!</span>"]);
			}
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the frame.</span>", [live(f.args[1])]), "<span class='notice'>You start to disassemble the frame...</span>", "You hear banging and clanking."]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (isEqual(rt.sv(f, "state"), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disassemble the frame.</span>"]);
					yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]))), "add_fingerprint", [live(f.args[1])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start ＀securing ＀...</span>", [$1, rt.sv(f, "name")])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (isEqual(rt.sv(f, "state"), 1)) {
					$0 = live(f.args[1]);
					if (truthy(rt.sv(f, "anchored"))) {
						$1 = "un";
					} else {
						$1 = "";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀secure ＀.</span>", [$1, rt.sv(f, "name")])]);
					rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "anchored"))) {
				$1 = "un";
			} else {
				$1 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You start ＀securing ＀...</span>", [$1, rt.sv(f, "name")])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				$0 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = "un";
				} else {
					$1 = "";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀secure ＀.</span>", [$1, rt.sv(f, "name")])]);
				rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard/machine")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "anchored"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The frame needs to be secured first!</span>"]);
				return live(f.dot);
			}
			B = live(f.args[0]);
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the circuit board to the frame.</span>"]);
			rt.setSv(f, "circuit", live(B));
			rt.setFv(f, "loc", live(B), live(f.src));
			rt.setSv(f, "icon_state", "box_2");
			rt.setSv(f, "state", 3);
			rt.setSv(f, "components", rt.list());
			rt.setSv(f, "req_components", (yield* g.callName(f, rt.fv(f, "req_components", live(B)), "Copy", [])));
			yield* g.srcCall(f, "update_namelist");
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This frame does not accept circuit boards of this type!</span>"]);
				return live(f.dot);
			}
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the cables.</span>"]);
			rt.setSv(f, "state", 1);
			rt.setSv(f, "icon_state", "box_0");
			rt.setFv(f, "amount", (A = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.fv(f, "loc", live(f.src))]))), 5);
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			rt.setSv(f, "state", 2);
			rt.setFv(f, "loc", rt.sv(f, "circuit"), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, rt.sv(f, "components"), "Remove", [rt.sv(f, "circuit")]);
			rt.setSv(f, "circuit", null);
			if (isEqual(rt.len(f, rt.sv(f, "components")), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the circuit board.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the circuit board and other components.</span>"]);
				A = null;
				rt.forList(f, 0, rt.sv(f, "components"), T("/atom/movable"));
				while (($e = rt.next(f, 0)) !== undefined) {
					A = $e;
					rt.setFv(f, "loc", live(A), rt.fv(f, "loc", live(f.src)));
				}
				rt.endFor(f, 0);
			}
			rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
			rt.setSv(f, "req_components", null);
			rt.setSv(f, "components", null);
			rt.setSv(f, "icon_state", "box_1");
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			component_check = 1;
			R = null;
			rt.forList(f, 0, rt.sv(f, "req_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (rt.gt(rt.index(rt.sv(f, "req_components"), live(R)), 0)) {
					component_check = 0;
					break;
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(component_check))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.callName(f, (new_machine = (yield* g.new_(f, rt.gv(f, "build_path", rt.fv(f, "circuit", live(f.src))), [rt.fv(f, "loc", live(f.src)), 1]))), "on_construction", []);
				O = null;
				rt.forList(f, 0, rt.fv(f, "component_parts", live(new_machine)), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					O = $e;
					yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
				}
				rt.endFor(f, 0);
				rt.setFv(f, "component_parts", live(new_machine), rt.list());
				O = null;
				rt.forList(f, 0, live(f.src), T("/obj"));
				while (($e = rt.next(f, 0)) !== undefined) {
					O = $e;
					rt.setFv(f, "loc", live(O), null);
					rt.modField(f, live(new_machine), "component_parts", live(O), add);
				}
				rt.endFor(f, 0);
				rt.setFv(f, "loc", rt.sv(f, "circuit"), null);
				yield* g.callName(f, live(new_machine), "RefreshParts", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
			return live(f.dot);
		}
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/part_replacer")) ? 1 : 0)) && truthy(rt.getLen(f, rt.fv(f, "contents", live(f.args[0]))))) && truthy((yield* g.srcCall(f, "get_req_components_amt"))))) {
			replacer = live(f.args[0]);
			added_components = rt.list();
			part_list = rt.list();
			co = null;
			rt.forList(f, 0, live(replacer), T("/obj/item/weapon/stock_parts"));
			while (($e = rt.next(f, 0)) !== undefined) {
				co = $e;
				part_list = rt.modify(live(part_list), live(co), add);
			}
			rt.endFor(f, 0);
			part_list = (yield* g.call(f, P("/proc/sortTim"), null, [live(part_list), P("/proc/cmp_rped_sort")]));
			path = null;
			rt.forList(f, 0, rt.sv(f, "req_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				path = $e;
				while (rt.gt(rt.index(rt.sv(f, "req_components"), live(path)), 0) && truthy(rt.locateIn(f, live(path), live(part_list)))) {
					part = rt.locateIn(f, live(path), live(part_list));
					rt.setAt(live(added_components), live(part), live(path));
					yield* g.callName(f, live(replacer), "remove_from_storage", [live(part), live(f.src)]);
					rt.incAt(rt.sv(f, "req_components"), live(path), -1, true);
					(part_list = rt.modify(live(part_list), live(part), subtract));
				}
			}
			rt.endFor(f, 0);
			part_3 = null;
			rt.forList(f, 0, live(added_components), T("/obj/item/weapon/stock_parts"));
			while (($e = rt.next(f, 0)) !== undefined) {
				part_3 = $e;
				rt.modSrcVar(f, "components", live(part_3), add);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ applied.</span>", [rt.fv(f, "name", live(part_3))])]);
			}
			rt.endFor(f, 0);
			if (truthy(rt.len(f, live(added_components)))) {
				yield* g.callName(f, live(replacer), "play_rped_sound", []);
			}
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "get_req_components_amt"))))) {
			I = null;
			rt.forList(f, 0, rt.sv(f, "req_components"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				if ((truthy(rt.op(f, "IsType", [], [live(f.args[0]), live(I)])) && rt.gt(rt.index(rt.sv(f, "req_components"), live(I)), 0))) {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack")) ? 1 : 0))) {
						S = live(f.args[0]);
						if ((truthy((used_amt = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(S), "get_amount", []))])), rt.index(rt.sv(f, "req_components"), live(I))])))) && truthy((yield* g.callName(f, live(S), "use", [live(used_amt)]))))) {
							if (!truthy((NS = rt.locateIn(f, rt.fv(f, "merge_type", live(S)), rt.sv(f, "components"))))) {
								rt.modSrcVar(f, "components", (NS = (yield* g.new_(f, rt.fv(f, "merge_type", live(S)), [live(f.src), live(used_amt)]))), add);
							} else {
								yield* g.callName(f, live(NS), "add", [live(used_amt)]);
							}
							(rt.modAt(rt.sv(f, "req_components"), live(I), live(used_amt), subtract));
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
						}
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						break;
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
					yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
					rt.modSrcVar(f, "components", live(f.args[0]), add);
					rt.incAt(rt.sv(f, "req_components"), live(I), -1, true);
					return 1;
				}
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You cannot add that to the machine!</span>"]);
			return 0;
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P", "user", "params"] });

// /obj/structure/frame/machine/proc/deconstruct  (code/game/machinery/constructable_frame.dm:257)  may sleep
rt.def("/obj/structure/frame/machine/proc/deconstruct", function* deconstruct(f: Frame) {
	let X: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [X, I, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (rt.ge(rt.sv(f, "state"), 2)) {
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 5]);
		}
		X = null;
		rt.forList(f, 0, rt.sv(f, "components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			yield* g.callName(f, (I = live(X)), "forceMove", [rt.sv(f, "loc")]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

rt.type(6713, "/obj/item/weapon/circuitboard/machine", "/obj/item/weapon/circuitboard", {
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/proc/apply_default_parts  (code/game/machinery/constructable_frame.dm:281)  may sleep
rt.def("/obj/item/weapon/circuitboard/machine/proc/apply_default_parts", function* apply_default_parts(f: Frame, M: Value) {
	let comp_path: Value = null, comp_amt: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [M, comp_path, comp_amt, i, $e];
	if (!truthy(rt.sv(f, "req_components"))) {
		return live(f.dot);
	}
	rt.setFv(f, "component_parts", live(M), rt.list(live(f.src)));
	rt.setSv(f, "loc", null);
	comp_path = null;
	rt.forList(f, 0, rt.sv(f, "req_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		comp_path = $e;
		if (!truthy((comp_amt = rt.index(rt.sv(f, "req_components"), live(comp_path))))) {
			continue;
		}
		if ((truthy(rt.sv(f, "def_components")) && truthy(rt.index(rt.sv(f, "def_components"), live(comp_path))))) {
			comp_path = rt.index(rt.sv(f, "def_components"), live(comp_path));
		}
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(comp_path), T("/obj/item/stack")])))) {
			rt.modField(f, live(M), "component_parts", (yield* g.new_(f, live(comp_path), [null, live(comp_amt)])), add);
		} else {
			i = null;
			rt.forRange(f, 1, 1, live(comp_amt), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				rt.modField(f, live(M), "component_parts", (yield* g.new_(f, live(comp_path), [null])), add);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(M), "RefreshParts", []);
	return f.dot;
}, true);
