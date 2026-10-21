// From code/game/machinery/camera/camera_assembly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9544, "/obj/item/wallframe/camera", "/obj/item/wallframe", {
	name: "camera assembly",
	desc: "The basic construction for Nanotrasen-Always-Watching-You cameras.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "cameracase",
	materials: null,
	result_path: rt.typePath("/obj/structure/camera_assembly"),
});

// /obj/item/wallframe/camera/proc/<init>  (code/game/machinery/camera/camera_assembly.dm:6)
rt.def("/obj/item/wallframe/camera/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400, "$glass", 250]));
	return f.dot;
});

rt.type(12553, "/obj/structure/camera_assembly", "/obj/structure", {
	upgrades: null,
	state: 1,
	name: "camera assembly",
	desc: "The basic construction for Nanotrasen-Always-Watching-You cameras.",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "camera1",
	obj_integrity: 150,
	max_integrity: 150,
}, { global: { possible_upgrades: 798 } });

// /obj/structure/camera_assembly/proc/Initialize  (code/game/machinery/camera/camera_assembly.dm:30)
rt.def("/obj/structure/camera_assembly/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		rt.callSrc(f, "setDir", [live(f.args[1])]);
	}
	rt.setSv(f, "upgrades", rt.list());
	return f.dot;
}, false, { args: ["mapload", "ndir", "building"] });

// /obj/structure/camera_assembly/proc/Destroy  (code/game/machinery/camera/camera_assembly.dm:36)  may sleep
rt.def("/obj/structure/camera_assembly/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "upgrades"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "upgrades"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "upgrades"), "Cut", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/camera_assembly/proc/attackby  (code/game/machinery/camera/camera_assembly.dm:40)  may sleep
rt.def("/obj/structure/camera_assembly/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, input: Value = null, tempnetwork: Value = null, C_2: Value = null, A: Value = null, U: Value = null;
	let $0: any;
	f.vars = () => [C, input, tempnetwork, C_2, A, U, $0];
	$0 = rt.sv(f, "state");
	if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.srcCall(f, "weld", live(f.args[0]), live(f.args[1]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You weld the assembly securely into place.</span>"]);
				rt.setSv(f, "anchored", 1);
				rt.setSv(f, "state", 2);
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unattach the assembly from its place.</span>"]);
				yield* g.new_(f, T("/obj/item/wallframe/camera"), [rt.getStep(f, live(f.src), 0)]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				return live(f.dot);
			}
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (C = live(f.args[0])), "use", [2])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add wires to the assembly.</span>"]);
				rt.setSv(f, "state", 3);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two lengths of cable to wire a camera!</span>"]);
				return live(f.dot);
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (truthy((yield* g.srcCall(f, "weld", live(f.args[0]), live(f.args[1]))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unweld the assembly from its place.</span>"]);
					rt.setSv(f, "state", 1);
					rt.setSv(f, "anchored", 1);
				}
				return live(f.dot);
			}
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Which networks would you like to connect this camera to? Seperate networks with a comma. No Spaces!\nFor example: SS13,Security,Secret ", "Set Network", "SS13"]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>No input found, please hang up and try your call again!</span>"]);
				return live(f.dot);
			}
			if (rt.lt(rt.getLen(f, (tempnetwork = (yield* g.call(f, P("/proc/splittext"), null, [live(input), ","])))), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>No network found, please hang up and try your call again!</span>"]);
				return live(f.dot);
			}
			rt.setSv(f, "state", 4);
			C_2 = (yield* g.new_(f, T("/obj/machinery/camera"), [rt.fv(f, "loc", live(f.src))]));
			rt.setFv(f, "loc", live(f.src), live(C_2));
			rt.setFv(f, "assembly", live(C_2), live(f.src));
			yield* g.callName(f, live(C_2), "setDir", [rt.fv(f, "dir", live(f.src))]);
			rt.setFv(f, "network", live(C_2), live(tempnetwork));
			A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
			rt.setFv(f, "c_tag", live(C_2), fmt("＀ (＀)", [rt.fv(f, "name", live(A)), (yield* g.call(f, P("/proc/rand"), null, [1, 999]))]));
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
				yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.src), 0), 2]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You cut the wires from the circuits.</span>"]);
				rt.setSv(f, "state", 2);
				return live(f.dot);
			}
		}
	}
	if ((truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.gl("possible_upgrades")]))) && !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.sv(f, "upgrades")]))))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [live(f.args[0])])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach ％！ into the assembly inner circuits.</span>", [live(f.args[0])])]);
		rt.modSrcVar(f, "upgrades", live(f.args[0]), add);
		yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
		return live(f.dot);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.len(f, rt.sv(f, "upgrades"))))) {
			if (truthy((U = rt.locateIn(f, T("/obj"), rt.sv(f, "upgrades"))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unattach an upgrade from the assembly.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				rt.setFv(f, "loc", live(U), rt.getStep(f, live(f.src), 0));
				(rt.modSrcVar(f, "upgrades", live(U), subtract));
			}
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/camera_assembly/proc/weld  (code/game/machinery/camera/camera_assembly.dm:133)  may sleep
rt.def("/obj/structure/camera_assembly/proc/weld", function* weld(f: Frame, WT: Value, user: Value) {
	f.vars = () => [WT, user];
	if (!truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(user)])))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start to weld ％！...</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(WT)), 50, 1]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(20, rt.fv(f, "toolspeed", live(WT))), "target", live(f.src)], rt.Args.Named)))) {
		if (truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
			return 1;
		}
	}
	return 0;
}, true);

// /obj/structure/camera_assembly/proc/deconstruct  (code/game/machinery/camera/camera_assembly.dm:144)  may sleep
rt.def("/obj/structure/camera_assembly/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
