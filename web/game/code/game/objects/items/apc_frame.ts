// From code/game/objects/items/apc_frame.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9539, "/obj/item/wallframe", "/obj/item", {
	result_path: null,
	inverse: 0,
	pixel_shift: null,
	flags: 64,
	icon: rt.rsc("icons/obj/wallframe.dmi"),
	materials: null,
	origin_tech: "materials=1;engineering=1",
	item_state: "syringe_kit",
	w_class: 2,
});

// /obj/item/wallframe/proc/<init>  (code/game/objects/items/apc_frame.dm:3)
rt.def("/obj/item/wallframe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	return f.dot;
});

// /obj/item/wallframe/proc/try_build  (code/game/objects/items/apc_frame.dm:13)
rt.def("/obj/item/wallframe/proc/try_build", function try_build(f: Frame, on_wall: Value, user: Value) {
	let ndir: Value = null, _T: Value = null, A: Value = null;
	f.vars = () => [ndir, _T, A];
	if (rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(on_wall), live(user)]), 1)) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, (ndir = rt.getDir(f, live(on_wall), live(user))), rt.gl("cardinal")) ? 1 : 0))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(user), 0);
	A = rt.call(f, P("/proc/get_area"), null, [live(_T)]);
	if (!truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot place ＀ on this spot!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "always_unpowered", live(A)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You cannot place ＀ in this area!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.call(f, P("/proc/gotwallitem"), null, [live(_T), live(ndir), multiply(rt.sv(f, "inverse"), 2)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There's already an item on this wall!</span>"]);
		return live(f.dot);
	}
	return 1;
});

// /obj/item/wallframe/proc/attach  (code/game/objects/items/apc_frame.dm:34)  may sleep
rt.def("/obj/item/wallframe/proc/attach", function* attach(f: Frame, on_wall: Value, user: Value) {
	let ndir: Value = null, O: Value = null;
	let $0: any;
	f.vars = () => [on_wall, user, ndir, O, $0];
	if (truthy(rt.sv(f, "result_path"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 75, 1]);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ attaches ＀ to the wall.", [rt.fv(f, "name", live(user)), live(f.src)]), fmt("<span class='notice'>You attach ＀ to the wall.</span>", [live(f.src)]), "<span class='italics'>You hear clicking.</span>"]);
		ndir = rt.getDir(f, live(on_wall), live(user));
		if (truthy(rt.sv(f, "inverse"))) {
			ndir = (yield* g.call(f, P("/proc/turn"), null, [live(ndir), 180]));
		}
		O = (yield* g.new_(f, rt.sv(f, "result_path"), [rt.getStep(f, live(user), 0), live(ndir), 1]));
		if (truthy(rt.sv(f, "pixel_shift"))) {
			$0 = live(ndir);
			if ($0 === 1) {
				rt.setFv(f, "pixel_y", live(O), rt.sv(f, "pixel_shift"));
			} else if ($0 === 2) {
				rt.setFv(f, "pixel_y", live(O), rt.neg(rt.sv(f, "pixel_shift")));
			} else if ($0 === 4) {
				rt.setFv(f, "pixel_x", live(O), rt.sv(f, "pixel_shift"));
			} else if ($0 === 8) {
				rt.setFv(f, "pixel_x", live(O), rt.neg(rt.sv(f, "pixel_shift")));
			}
		}
		yield* g.srcCall(f, "after_attach", live(O));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/wallframe/proc/after_attach  (code/game/objects/items/apc_frame.dm:58)
rt.def("/obj/item/wallframe/proc/after_attach", function after_attach(f: Frame, O: Value) {
	rt.callSrc(f, "transfer_fingerprints_to", [live(O)]);
	return f.dot;
});

// /obj/item/wallframe/proc/attackby  (code/game/objects/items/apc_frame.dm:61)  may sleep
rt.def("/obj/item/wallframe/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, metal_amt: Value = null, glass_amt: Value = null;
	f.vars = () => [_T, metal_amt, glass_amt];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy((rt.istype((_T = rt.getStep(f, rt.getStep(f, live(f.args[1]), 0), rt.fv(f, "dir", live(f.args[1])))), T("/turf/closed/wall")) ? 1 : 0))) {
			yield* g.callName(f, live(_T), "attackby", [live(f.src), live(f.args[1]), live(f.args[2])]);
		}
	}
	metal_amt = (yield* g.call(f, P("/proc/round"), null, [divide(rt.at(rt.sv(f, "materials"), "$metal"), 2000)]));
	glass_amt = (yield* g.call(f, P("/proc/round"), null, [divide(rt.at(rt.sv(f, "materials"), "$glass"), 2000)]));
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && (truthy(live(metal_amt)) || truthy(live(glass_amt))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You dismantle ＀.</span>", [live(f.src)])]);
	if (truthy(live(metal_amt))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, live(f.src), 0), live(metal_amt)]);
	}
	if (truthy(live(glass_amt))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [rt.getStep(f, live(f.src), 0), live(glass_amt)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9546, "/obj/item/wallframe/apc", "/obj/item/wallframe", {
	inverse: 1,
	name: "１APC frame",
	desc: "Used for repairing or building APCs",
	icon_state: "apc",
	result_path: rt.typePath("/obj/machinery/power/apc"),
});

// /obj/item/wallframe/apc/proc/try_build  (code/game/objects/items/apc_frame.dm:91)  may sleep
rt.def("/obj/item/wallframe/apc/proc/try_build", function* try_build(f: Frame) {
	let _T: Value = null, A: Value = null, E: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, A, E, C, $e];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.args[1]), 0);
	if (truthy((yield* g.callName(f, (A = (yield* g.call(f, P("/proc/get_area"), null, [live(_T)]))), "get_apc", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This area already has an APC!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "requires_power", live(A)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot place ＀ in this area!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	E = null;
	rt.forList(f, 0, live(_T), T("/obj/machinery/power/terminal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		if (truthy(rt.fv(f, "master", live(E)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is another network terminal here!</span>"]);
			return live(f.dot);
		} else {
			rt.setFv(f, "amount", (C = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(_T)]))), 10);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You cut the cables and disassemble the unused power terminal.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true, { args: ["on_wall", "user"] });

rt.type(6933, "/obj/item/weapon/electronics", "/obj/item/weapon", {
	flags: 64,
	desc: "Looks like a circuit. Probably is.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "door_electronics",
	item_state: "electronic",
	w_class: 2,
	origin_tech: "engineering=2;programming=1",
	materials: null,
});

// /obj/item/weapon/electronics/proc/<init>  (code/game/objects/items/apc_frame.dm:121)
rt.def("/obj/item/weapon/electronics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50, "$glass", 50]));
	return f.dot;
});
