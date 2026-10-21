// From code/game/machinery/computer/buildandrepair.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12543, "/obj/structure/frame/computer", "/obj/structure/frame", {
	state: 0,
	name: "computer frame",
	icon_state: "0",
});

// /obj/structure/frame/computer/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:7)  may sleep
rt.def("/obj/structure/frame/computer/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, M: Value = null, C: Value = null, A: Value = null, G: Value = null, B: Value = null;
	let $0: any;
	f.vars = () => [WT, M, C, A, G, B, $0];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	$0 = rt.sv(f, "state");
	if ($0 === 0) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start wrenching the frame into place...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wrench the frame into place.</span>"]);
				rt.setSv(f, "anchored", 1);
				rt.setSv(f, "state", 1);
			}
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
				if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The welding tool must be on to complete this task!</span>"]);
				}
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start deconstructing the frame...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You deconstruct the frame.</span>"]);
				yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]))), "add_fingerprint", [live(f.args[1])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
			return live(f.dot);
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to unfasten the frame...</span>"]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unfasten the frame.</span>"]);
				rt.setSv(f, "anchored", 0);
				rt.setSv(f, "state", 0);
			}
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard/computer")) ? 1 : 0)) && !truthy(rt.sv(f, "circuit")))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You place the circuit board inside the frame.</span>"]);
			rt.setSv(f, "icon_state", "1");
			rt.setSv(f, "circuit", live(f.args[0]));
			yield* g.callName(f, rt.sv(f, "circuit"), "add_fingerprint", [live(f.args[1])]);
			rt.setFv(f, "loc", live(f.args[0]), null);
			return live(f.dot);
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard")) ? 1 : 0)) && !truthy(rt.sv(f, "circuit")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This frame does not accept circuit boards of this type!</span>"]);
				return live(f.dot);
			}
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "circuit")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You screw the circuit board into place.</span>"]);
			rt.setSv(f, "state", 2);
			rt.setSv(f, "icon_state", "2");
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.sv(f, "circuit")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the circuit board.</span>"]);
			rt.setSv(f, "state", 1);
			rt.setSv(f, "icon_state", "0");
			rt.setFv(f, "loc", rt.sv(f, "circuit"), rt.fv(f, "loc", live(f.src)));
			yield* g.callName(f, rt.sv(f, "circuit"), "add_fingerprint", [live(f.args[1])]);
			rt.setSv(f, "circuit", null);
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "circuit")))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unfasten the circuit board.</span>"]);
			rt.setSv(f, "state", 1);
			rt.setSv(f, "icon_state", "1");
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (rt.ge((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 5)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start adding cables to the frame...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((rt.ge((yield* g.callName(f, live(C), "get_amount", [])), 5) && isEqual(rt.sv(f, "state"), 2))) {
						yield* g.callName(f, live(C), "use", [5]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add cables to the frame.</span>"]);
						rt.setSv(f, "state", 3);
						rt.setSv(f, "icon_state", "3");
					}
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need five lengths of cable to wire the frame!</span>"]);
			}
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the cables.</span>"]);
			rt.setSv(f, "state", 2);
			rt.setSv(f, "icon_state", "2");
			rt.setFv(f, "amount", (A = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc")]))), 5);
			yield* g.callName(f, live(A), "add_fingerprint", [live(f.args[1])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
			if (rt.lt((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two glass sheets to continue construction!</span>"]);
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to put in the glass panel...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
					if ((rt.ge((yield* g.callName(f, live(G), "get_amount", [])), 2) && isEqual(rt.sv(f, "state"), 3))) {
						yield* g.callName(f, live(G), "use", [2]);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You put in the glass panel.</span>"]);
						rt.setSv(f, "state", 4);
						rt.setFv(f, "icon_state", live(f.src), "4");
					}
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 4) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the glass panel.</span>"]);
			rt.setSv(f, "state", 3);
			rt.setSv(f, "icon_state", "3");
			yield* g.callName(f, (G = (yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [rt.sv(f, "loc"), 2]))), "add_fingerprint", [live(f.args[1])]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You connect the monitor.</span>"]);
			yield* g.srcCall(f, "transfer_fingerprints_to", (B = (yield* g.new_(f, rt.gv(f, "build_path", rt.fv(f, "circuit", live(f.src))), [rt.fv(f, "loc", live(f.src)), rt.sv(f, "circuit")]))));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P", "user", "params"] });

// /obj/structure/frame/computer/proc/deconstruct  (code/game/machinery/computer/buildandrepair.dm:139)  may sleep
rt.def("/obj/structure/frame/computer/proc/deconstruct", function* deconstruct(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (isEqual(rt.sv(f, "state"), 4)) {
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.sv(f, "loc")]);
		}
		if (rt.ge(rt.sv(f, "state"), 3)) {
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 5]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

rt.type(6712, "/obj/item/weapon/circuitboard", "/obj/item/weapon", {
	build_path: null,
	name: "circuit board",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "id_mod",
	item_state: "electronic",
	origin_tech: "programming=2",
	materials: null,
	w_class: 2,
});

// /obj/item/weapon/circuitboard/proc/<init>  (code/game/machinery/computer/buildandrepair.dm:154)
rt.def("/obj/item/weapon/circuitboard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 1000]));
	return f.dot;
});

rt.type(6806, "/obj/item/weapon/circuitboard/computer/card/minor", "/obj/item/weapon/circuitboard/computer/card", {
	target_dept: 1,
	dept_list: null,
	name: "Department Management Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/card/minor"),
});

// /obj/item/weapon/circuitboard/computer/card/minor/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:223)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/card/minor/proc/attackby", function* attackby(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "target_dept"), rt.len(f, rt.sv(f, "dept_list")))) {
			$0 = 1;
		} else {
			$0 = add(rt.sv(f, "target_dept"), 1);
		}
		rt.setSv(f, "target_dept", $0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You set the board to \"＀\".</span>", [rt.index(rt.sv(f, "dept_list"), rt.sv(f, "target_dept"))])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/circuitboard/computer/card/minor/proc/examine  (code/game/machinery/computer/buildandrepair.dm:230)
rt.def("/obj/item/weapon/circuitboard/computer/card/minor/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Currently set to \"＀\".", [rt.index(rt.sv(f, "dept_list"), rt.sv(f, "target_dept"))])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(6827, "/obj/item/weapon/circuitboard/computer/rdconsole", "/obj/item/weapon/circuitboard/computer", {
	name: "R&D Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/rdconsole/core"),
});

// /obj/item/weapon/circuitboard/computer/rdconsole/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:311)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/rdconsole/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "build_path"), T("/obj/machinery/computer/rdconsole/core"))) {
			rt.setSv(f, "name", "R&D Console - Robotics (Computer Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/computer/rdconsole/robotics"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Access protocols successfully updated.</span>"]);
		} else {
			rt.setSv(f, "name", "R&D Console (Computer Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/computer/rdconsole/core"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Defaulting access protocols.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6832, "/obj/item/weapon/circuitboard/computer/cargo", "/obj/item/weapon/circuitboard/computer", {
	contraband: 0,
	emagged: 0,
	name: "Supply Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/cargo"),
	origin_tech: "programming=3",
});

// /obj/item/weapon/circuitboard/computer/cargo/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:346)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/cargo/proc/attackby", function* attackby(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "emagged"))) {
			rt.setSv(f, "contraband", (!truthy(rt.sv(f, "contraband")) ? 1 : 0));
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "contraband"))) {
				$1 = "Broad";
			} else {
				$1 = "Standard";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Receiver spectrum set to ＀.</span>", [$1])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The spectrum chip is unresponsive.</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/emag")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "emagged"))) {
				rt.setSv(f, "contraband", 1);
				rt.setSv(f, "emagged", 1);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You adjust ＀'s routing and receiver spectrum, unlocking special supplies and contraband.</span>", [live(f.src)])]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6839, "/obj/item/weapon/circuitboard/computer/shuttle", "/obj/item/weapon/circuitboard/computer", {
	shuttleId: null,
	possible_destinations: "",
	name: "Shuttle (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/shuttle"),
});

// /obj/item/weapon/circuitboard/computer/shuttle/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:392)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/shuttle/proc/attackby", function* attackby(f: Frame) {
	let chosen_id: Value = null;
	f.vars = () => [chosen_id];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (rt.ge((chosen_id = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [null, "Input an Integer", "Choose an ID number (-1 for reset):", live(f.usr), null]))]))), 0)) {
			rt.setSv(f, "shuttleId", live(chosen_id));
		} else {
			rt.setSv(f, "shuttleId", rt.initial(f, live(f.src), "shuttleId"));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6851, "/obj/item/weapon/circuitboard/computer/libraryconsole", "/obj/item/weapon/circuitboard/computer", {
	name: "Library Visitor Console (Computer Board)",
	build_path: rt.typePath("/obj/machinery/computer/libraryconsole"),
	origin_tech: "programming=1",
});

// /obj/item/weapon/circuitboard/computer/libraryconsole/proc/attackby  (code/game/machinery/computer/buildandrepair.dm:444)  may sleep
rt.def("/obj/item/weapon/circuitboard/computer/libraryconsole/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "build_path"), T("/obj/machinery/computer/libraryconsole/bookmanagement"))) {
			rt.setSv(f, "name", "Library Visitor Console (Computer Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/computer/libraryconsole"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Defaulting access protocols.</span>"]);
		} else {
			rt.setSv(f, "name", "Book Inventory Management Console (Computer Board)");
			rt.setSv(f, "build_path", T("/obj/machinery/computer/libraryconsole/bookmanagement"));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Access protocols successfully updated.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
