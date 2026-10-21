// From code/modules/power/lighting.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9552, "/obj/item/wallframe/light_fixture/small", "/obj/item/wallframe/light_fixture", {
	name: "small light fixture frame",
	icon_state: "bulb-construct-item",
	result_path: rt.typePath("/obj/structure/light_construct/small"),
	materials: null,
});

// /obj/item/wallframe/light_fixture/small/proc/<init>  (code/modules/power/lighting.dm:26)
rt.def("/obj/item/wallframe/light_fixture/small/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

rt.type(9551, "/obj/item/wallframe/light_fixture", "/obj/item/wallframe", {
	inverse: 1,
	name: "light fixture frame",
	desc: "Used for building lights.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube-construct-item",
	result_path: rt.typePath("/obj/structure/light_construct"),
});

// /obj/item/wallframe/light_fixture/proc/try_build  (code/modules/power/lighting.dm:29)
rt.def("/obj/item/wallframe/light_fixture/proc/try_build", function try_build(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (!isEqual(rt.gv(f, "dynamic_lighting", (A = rt.call(f, P("/proc/get_area"), null, [live(f.args[1])]))), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot place ＀ in this area!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	return 1;
}, false, { args: ["on_wall", "user"] });

rt.type(12976, "/obj/structure/light_construct", "/obj/structure", {
	stage: 1,
	fixture_type: "tube",
	sheets_refunded: 2,
	newlight: null,
	anchored: 1,
	name: "light fixture frame",
	desc: "A light fixture under construction.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube-construct-stage1",
	layer: 4.25,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// /obj/structure/light_construct/proc/<init>  (code/modules/power/lighting.dm:47)
rt.def("/obj/structure/light_construct/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 50]));
	return f.dot;
});

// /obj/structure/light_construct/proc/New  (code/modules/power/lighting.dm:55)  may sleep
rt.def("/obj/structure/light_construct/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[2]))) return f.dot;
	yield* g.srcCall(f, "setDir", live(f.args[1]));
	return f.dot;
}, true, { args: ["loc", "ndir", "building"] });

// /obj/structure/light_construct/proc/examine  (code/modules/power/lighting.dm:60)
rt.def("/obj/structure/light_construct/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.fv(f, "stage", live(f.src));
	if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's an empty frame."]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's wired."]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "The casing is closed."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/light_construct/proc/attackby  (code/modules/power/lighting.dm:70)  may sleep
rt.def("/obj/structure/light_construct/proc/attackby", function* attackby(f: Frame) {
	let coil: Value = null;
	let $0: any;
	f.vars = () => [coil, $0];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	$0 = rt.sv(f, "stage");
	if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You begin deconstructing ＀...</span>", [live(f.src)])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				return live(f.dot);
			}
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0), rt.sv(f, "sheets_refunded")]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ deconstructs ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You deconstruct ＀.</span>", [live(f.src)]), "<span class='italics'>You hear a ratchet.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 75, 1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (coil = live(f.args[0])), "use", [1])))) {
				$0 = rt.sv(f, "fixture_type");
				if ($0 === "tube") {
					rt.setSv(f, "icon_state", "tube-construct-stage2");
				} else if ($0 === "bulb") {
					rt.setSv(f, "icon_state", "bulb-construct-stage2");
				}
				rt.setSv(f, "stage", 2);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds wires to ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You add wires to ＀.</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need one length of cable to wire ＀!</span>", [live(f.src)])]);
			}
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You have to remove the wires first!</span>"]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			rt.setSv(f, "stage", 1);
			$0 = rt.sv(f, "fixture_type");
			if ($0 === "tube") {
				rt.setSv(f, "icon_state", "tube-construct-stage1");
			} else if ($0 === "bulb") {
				rt.setSv(f, "icon_state", "bulb-construct-stage1");
			}
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, rt.sv(f, "loc"), 0), 1, "red"]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the wiring from ＀.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You remove the wiring from ＀.</span>", [live(f.src)]), "<span class='italics'>You hear clicking.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ closes ＀'s casing.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You close ＀'s casing.</span>", [live(f.src)]), "<span class='italics'>You hear screwing.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			$0 = rt.sv(f, "fixture_type");
			if ($0 === "tube") {
				rt.setSv(f, "newlight", (yield* g.new_(f, T("/obj/machinery/light/built"), [rt.sv(f, "loc")])));
			} else if ($0 === "bulb") {
				rt.setSv(f, "newlight", (yield* g.new_(f, T("/obj/machinery/light/small/built"), [rt.sv(f, "loc")])));
			}
			yield* g.callName(f, rt.sv(f, "newlight"), "setDir", [rt.sv(f, "dir")]);
			yield* g.srcCall(f, "transfer_fingerprints_to", rt.sv(f, "newlight"));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/structure/light_construct/proc/blob_act  (code/modules/power/lighting.dm:133)  may sleep
rt.def("/obj/structure/light_construct/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!(truthy(live(B)) && isEqual(rt.fv(f, "loc", live(B)), rt.sv(f, "loc")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/light_construct/proc/deconstruct  (code/modules/power/lighting.dm:138)  may sleep
rt.def("/obj/structure/light_construct/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), rt.sv(f, "sheets_refunded")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10342, "/obj/machinery/light", "/obj/machinery", {
	base_state: "tube",
	on: 0,
	on_gs: 0,
	static_power_used: 0,
	brightness: 8,
	status: 0,
	flickering: 0,
	light_type: rt.typePath("/obj/item/weapon/light/tube"),
	fitting: "tube",
	switchcount: 0,
	rigged: 0,
	anchored: 1,
	name: "light fixture",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "tube1",
	desc: "A lighting fixture.",
	layer: 4.25,
	obj_integrity: 100,
	max_integrity: 100,
	use_power: 2,
	idle_power_usage: 2,
	active_power_usage: 20,
	power_channel: 2,
});

// /obj/machinery/light/proc/Move  (code/modules/power/lighting.dm:191)  may sleep
rt.def("/obj/machinery/light/proc/Move", function* Move(f: Frame) {
	if (!isEqual(rt.sv(f, "status"), 2)) {
		yield* g.srcCall(f, "break_light_tube", 1);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(10345, "/obj/machinery/light/built", "/obj/machinery/light", {});

// /obj/machinery/light/built/proc/New  (code/modules/power/lighting.dm:197)  may sleep
rt.def("/obj/machinery/light/built/proc/New", function* New(f: Frame) {
	rt.setSv(f, "status", 1);
	yield* g.srcCall(f, "update", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(10344, "/obj/machinery/light/small/built", "/obj/machinery/light/small", {});

// /obj/machinery/light/small/built/proc/New  (code/modules/power/lighting.dm:202)  may sleep
rt.def("/obj/machinery/light/small/built/proc/New", function* New(f: Frame) {
	rt.setSv(f, "status", 1);
	yield* g.srcCall(f, "update", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/light/proc/New  (code/modules/power/lighting.dm:208)  may sleep
rt.def("/obj/machinery/light/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.spawnTail(f, 2, "/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:209");
	return f.dot;
}, true);

// a spawn(2) body of /obj/machinery/light/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:209", function* (f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "fitting");
	if ($0 === "tube") {
		rt.setSv(f, "brightness", 8);
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			yield* g.srcCall(f, "break_light_tube", 1);
		}
	} else if ($0 === "bulb") {
		rt.setSv(f, "brightness", 4);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			yield* g.srcCall(f, "break_light_tube", 1);
		}
	}
	rt.spawnTail(f, 1, "/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:219");
	return null;
});

// a spawn(1) body of /obj/machinery/light/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/light/proc/New: spawn at modules/power/lighting.dm:219", function* (f: Frame) {
	yield* g.srcCall(f, "update", 0);
	return null;
});

// /obj/machinery/light/proc/Destroy  (code/modules/power/lighting.dm:223)  may sleep
rt.def("/obj/machinery/light/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) {
		rt.setSv(f, "on", 0);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/light/proc/update_icon  (code/modules/power/lighting.dm:231)
rt.def("/obj/machinery/light/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "status");
	if ($0 === 0) {
		rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "base_state"), rt.sv(f, "on")]));
	} else if ($0 === 1) {
		rt.setSv(f, "icon_state", fmt("＀-empty", [rt.sv(f, "base_state")]));
		rt.setSv(f, "on", 0);
	} else if ($0 === 3) {
		rt.setSv(f, "icon_state", fmt("＀-burned", [rt.sv(f, "base_state")]));
		rt.setSv(f, "on", 0);
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", fmt("＀-broken", [rt.sv(f, "base_state")]));
		rt.setSv(f, "on", 0);
	}
	return live(f.dot);
});

// /obj/machinery/light/proc/update  (code/modules/power/lighting.dm:248)
rt.def("/obj/machinery/light/proc/update", function update(f: Frame, trigger: Value) {
	f.vars = () => [trigger];
	if (live(trigger) === null) {
		trigger = 1;
	}
	rt.callSrc(f, "update_icon", []);
	if (truthy(rt.sv(f, "on"))) {
		if ((!truthy(rt.sv(f, "light")) || !isEqual(rt.fv(f, "light_range", rt.sv(f, "light")), rt.sv(f, "brightness")))) {
			rt.incSrcVar(f, "switchcount", 1, true);
			if (truthy(rt.sv(f, "rigged"))) {
				if ((isEqual(rt.sv(f, "status"), 0) && truthy(live(trigger)))) {
					rt.callSrc(f, "explode", []);
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [rt.call(f, P("/proc/min"), null, [60, multiply(multiply(rt.sv(f, "switchcount"), rt.sv(f, "switchcount")), 0.009999999776482582)])]))) {
					if (truthy(live(trigger))) {
						rt.callSrc(f, "burn_out", []);
					}
				} else {
					rt.setSv(f, "use_power", 2);
					rt.callSrc(f, "set_light", [rt.sv(f, "brightness")]);
				}
			}
		}
	} else {
		rt.setSv(f, "use_power", 1);
		rt.callSrc(f, "set_light", [0]);
	}
	rt.setSv(f, "active_power_usage", multiply(rt.sv(f, "brightness"), 10));
	if (isEqual(rt.sv(f, "on"), rt.sv(f, "on_gs"))) return f.dot;
	rt.setSv(f, "on_gs", rt.sv(f, "on"));
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "static_power_used", multiply(rt.sv(f, "brightness"), 20));
		rt.callSrc(f, "addStaticPower", [rt.sv(f, "static_power_used"), 6]);
	} else {
		rt.callSrc(f, "removeStaticPower", [rt.sv(f, "static_power_used"), 6]);
	}
	return f.dot;
});

// /obj/machinery/light/proc/burn_out  (code/modules/power/lighting.dm:276)
rt.def("/obj/machinery/light/proc/burn_out", function burn_out(f: Frame) {
	if (!isEqual(rt.sv(f, "status"), 0)) return f.dot;
	rt.setSv(f, "status", 3);
	rt.setSv(f, "icon_state", fmt("＀-burned", [rt.sv(f, "base_state")]));
	rt.setSv(f, "on", 0);
	rt.callSrc(f, "set_light", [0]);
	return f.dot;
});

// /obj/machinery/light/proc/seton  (code/modules/power/lighting.dm:285)
rt.def("/obj/machinery/light/proc/seton", function seton(f: Frame, s: Value) {
	rt.setSv(f, "on", (live(s) && (isEqual(rt.sv(f, "status"), 0) ? 1 : 0)));
	rt.callSrc(f, "update", []);
	return f.dot;
});

// /obj/machinery/light/proc/examine  (code/modules/power/lighting.dm:290)
rt.def("/obj/machinery/light/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "status");
	if ($0 === 0) {
		$0 = live(f.args[0]);
		if (truthy(rt.sv(f, "on"))) {
			$1 = "on";
		} else {
			$1 = "off";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("It is turned ＀.", [$1])]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The ＀ has been removed.", [rt.sv(f, "fitting")])]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The ＀ is burnt out.", [rt.sv(f, "fitting")])]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("The ＀ has been smashed.", [rt.sv(f, "fitting")])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/light/proc/attackby  (code/modules/power/lighting.dm:308)  may sleep
rt.def("/obj/machinery/light/proc/attackby", function* attackby(f: Frame) {
	let LR: Value = null, L: Value = null;
	f.vars = () => [LR, L];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/lightreplacer")) ? 1 : 0))) {
		yield* g.callName(f, (LR = live(f.args[0])), "ReplaceLight", [live(f.src), live(f.args[1])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/light")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "status"), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is a ＀ already inserted!</span>", [rt.sv(f, "fitting")])]);
			} else {
				yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[1])]);
				if (truthy(rt.op(f, "IsType", [], [(L = live(f.args[0])), rt.sv(f, "light_type")]))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[1])]);
					if (!isEqual(rt.sv(f, "status"), 1)) {
						yield* g.srcCall(f, "drop_light_tube", live(f.args[1]));
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You replace ＀.</span>", [live(L)])]);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(L)])]);
					}
					rt.setSv(f, "status", rt.fv(f, "status", live(L)));
					rt.setSv(f, "switchcount", rt.fv(f, "switchcount", live(L)));
					rt.setSv(f, "rigged", rt.fv(f, "rigged", live(L)));
					rt.setSv(f, "brightness", rt.fv(f, "brightness", live(L)));
					rt.setSv(f, "on", (yield* g.srcCall(f, "has_power")));
					yield* g.srcCall(f, "update");
					yield* g.call(f, P("/proc/qdel"), null, [live(L)]);
					if ((truthy(rt.sv(f, "on")) && truthy(rt.sv(f, "rigged")))) {
						yield* g.srcCall(f, "explode");
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>This type of light requires a ＀!</span>", [rt.sv(f, "fitting")])]);
				}
			}
		} else {
			if (isEqual(rt.sv(f, "status"), 1)) {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ opens ＀'s casing.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You open ＀'s casing.</span>", [live(f.src)]), "<span class='italics'>You hear a noise.</span>"]);
					yield* g.srcCall(f, "deconstruct");
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='userdanger'>You stick ％！ into the light socket!</span>", [live(f.args[0])])]);
					if ((truthy((yield* g.srcCall(f, "has_power"))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 64)))) {
						yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
						if (truthy(rt.op(f, "Prob", [], [75]))) {
							yield* g.call(f, P("/proc/electrocute_mob"), null, [live(f.args[1]), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), (yield* g.call(f, P("/proc/rand"), null, [0.699999988079071, 1])), 1]);
						}
					}
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/light/proc/deconstruct  (code/modules/power/lighting.dm:360)  may sleep
rt.def("/obj/machinery/light/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let newlight: Value = null, cur_stage: Value = null;
	let $0: any;
	f.vars = () => [disassembled, newlight, cur_stage, $0];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		newlight = null;
		cur_stage = 2;
		if (!truthy(live(disassembled))) {
			cur_stage = 1;
		}
		$0 = rt.sv(f, "fitting");
		if ($0 === "tube") {
			rt.setFv(f, "icon_state", (newlight = (yield* g.new_(f, T("/obj/structure/light_construct"), [rt.fv(f, "loc", live(f.src))]))), fmt("tube-construct-stage＀", [live(cur_stage)]));
		} else if ($0 === "bulb") {
			rt.setFv(f, "icon_state", (newlight = (yield* g.new_(f, T("/obj/structure/light_construct/small"), [rt.fv(f, "loc", live(f.src))]))), fmt("bulb-construct-stage＀", [live(cur_stage)]));
		}
		yield* g.callName(f, live(newlight), "setDir", [rt.fv(f, "dir", live(f.src))]);
		rt.setFv(f, "stage", live(newlight), live(cur_stage));
		if (!truthy(live(disassembled))) {
			rt.setFv(f, "obj_integrity", live(newlight), multiply(rt.fv(f, "max_integrity", live(newlight)), 0.5));
			if (!isEqual(rt.sv(f, "status"), 2)) {
				yield* g.srcCall(f, "break_light_tube");
			}
			if (!isEqual(rt.sv(f, "status"), 1)) {
				yield* g.srcCall(f, "drop_light_tube");
			}
			yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 1, "red"]);
		}
		yield* g.srcCall(f, "transfer_fingerprints_to", live(newlight));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/light/proc/attacked_by  (code/modules/power/lighting.dm:386)  may sleep
rt.def("/obj/machinery/light/proc/attacked_by", function* attacked_by(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(rt.sv(f, "status"), 2) || isEqual(rt.sv(f, "status"), 1))) return f.dot;
	if (!(truthy(rt.sv(f, "on")) && truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 64)))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [12]))) return f.dot;
	yield* g.call(f, P("/proc/electrocute_mob"), null, [live(f.args[1]), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 0.30000001192092896, 1]);
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/machinery/light/proc/take_damage  (code/modules/power/lighting.dm:393)  may sleep
rt.def("/obj/machinery/light/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [multiply(live(f.args[0]), 5)]))) return f.dot;
	yield* g.srcCall(f, "break_light_tube");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/machinery/light/proc/play_attack_sound  (code/modules/power/lighting.dm:402)
rt.def("/obj/machinery/light/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		$0 = rt.sv(f, "status");
		if ($0 === 1) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/smash.ogg"), 50, 1]);
		} else if ($0 === 2) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 90, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glasshit.ogg"), 90, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/light/proc/has_power  (code/modules/power/lighting.dm:418)
rt.def("/obj/machinery/light/proc/has_power", function has_power(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	return (rt.gv(f, "lightswitch", (A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]))) && rt.fv(f, "power_light", live(A)));
});

// /obj/machinery/light/proc/flicker  (code/modules/power/lighting.dm:425)  may sleep
rt.def("/obj/machinery/light/proc/flicker", function* flicker(f: Frame, amount: Value) {
	let i: Value = null;
	f.vars = () => [amount, i];
	if (live(amount) === null) {
		amount = (yield* g.call(f, P("/proc/rand"), null, [10, 20]));
	}
	if (truthy(rt.sv(f, "flickering"))) {
		return live(f.dot);
	}
	rt.setSv(f, "flickering", 1);
	if ((truthy(rt.sv(f, "on")) && isEqual(rt.sv(f, "status"), 0))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), live(amount))) {
			if (!isEqual(rt.sv(f, "status"), 0)) {
				break;
			}
			rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
			yield* g.srcCall(f, "update", 0);
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [5, 15]))]);
			i = rt.inc(live(i), 1);
		}
		rt.setSv(f, "on", (isEqual(rt.sv(f, "status"), 0) ? 1 : 0));
		yield* g.srcCall(f, "update", 0);
	}
	rt.setSv(f, "flickering", 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/light/proc/attack_ai  (code/modules/power/lighting.dm:438)
rt.def("/obj/machinery/light/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	rt.callName(f, live(f.src), "flicker", [1]);
	return live(f.dot);
});

// /obj/machinery/light/proc/attack_hand  (code/modules/power/lighting.dm:445)  may sleep
rt.def("/obj/machinery/light/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let prot: Value = null, H: Value = null, G: Value = null, affecting: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, prot, H, G, affecting, $0, $1];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (isEqual(rt.sv(f, "status"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("There is no ＀ in this light.", [rt.sv(f, "fitting")])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "on"))) {
		prot = 0;
		if (truthy((rt.istype((H = live(user)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "gloves", live(H)))) {
				if (truthy(rt.gv(f, "max_heat_protection_temperature", (G = rt.fv(f, "gloves", live(H)))))) {
					prot = (rt.gt(rt.fv(f, "max_heat_protection_temperature", live(G)), 360) ? 1 : 0);
				}
			}
		} else {
			prot = 1;
		}
		if (rt.gt(live(prot), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the light ＀.</span>", [rt.sv(f, "fitting")])]);
		} else {
			if ((truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "dna", live(user)), "check_mutation", ["Telekinesis"]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You telekinetically remove the light ＀.</span>", [rt.sv(f, "fitting")])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You try to remove the light ＀, but you burn your hand on it!</span>", [rt.sv(f, "fitting")])]);
				$0 = live(H);
				if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2), 0)) {
					$1 = "r";
				} else {
					$1 = "l";
				}
				if ((truthy((affecting = (yield* g.callName(f, $0, "get_bodypart", [fmt("＀_arm", [$1])])))) && truthy((yield* g.callName(f, live(affecting), "receive_damage", [0, 5]))))) {
					yield* g.callName(f, live(H), "update_damage_overlays", []);
				}
				return live(f.dot);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the light ＀.</span>", [rt.sv(f, "fitting")])]);
	}
	yield* g.srcCall(f, "drop_light_tube", live(user));
	return f.dot;
}, true);

// /obj/machinery/light/proc/drop_light_tube  (code/modules/power/lighting.dm:483)  may sleep
rt.def("/obj/machinery/light/proc/drop_light_tube", function* drop_light_tube(f: Frame, user: Value) {
	let L: Value = null;
	f.vars = () => [user, L];
	rt.setFv(f, "status", (L = (yield* g.new_(f, rt.sv(f, "light_type"), []))), rt.sv(f, "status"));
	rt.setFv(f, "rigged", live(L), rt.sv(f, "rigged"));
	rt.setFv(f, "brightness", live(L), rt.sv(f, "brightness"));
	rt.setFv(f, "switchcount", live(L), rt.sv(f, "switchcount"));
	rt.setSv(f, "switchcount", 0);
	yield* g.callName(f, live(L), "update", []);
	yield* g.callName(f, live(L), "forceMove", [rt.sv(f, "loc")]);
	if (truthy(live(user))) {
		yield* g.callName(f, live(L), "add_fingerprint", [live(user)]);
		yield* g.callName(f, live(user), "put_in_active_hand", [live(L)]);
	}
	rt.setSv(f, "status", 1);
	yield* g.srcCall(f, "update");
	return live(L);
}, true);

// /obj/machinery/light/proc/attack_tk  (code/modules/power/lighting.dm:504)  may sleep
rt.def("/obj/machinery/light/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let L: Value = null;
	f.vars = () => [user, L];
	if (isEqual(rt.sv(f, "status"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("There is no ＀ in this light.", [rt.sv(f, "fitting")])]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You telekinetically remove the light ＀.</span>", [rt.sv(f, "fitting")])]);
	yield* g.callName(f, (L = (yield* g.srcCall(f, "drop_light_tube"))), "attack_tk", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/light/proc/break_light_tube  (code/modules/power/lighting.dm:517)  may sleep
rt.def("/obj/machinery/light/proc/break_light_tube", function* break_light_tube(f: Frame, skip_sound_and_sparks: Value) {
	f.vars = () => [skip_sound_and_sparks];
	if (live(skip_sound_and_sparks) === null) {
		skip_sound_and_sparks = 0;
	}
	if ((isEqual(rt.sv(f, "status"), 1) || isEqual(rt.sv(f, "status"), 2))) {
		return live(f.dot);
	}
	if (!truthy(live(skip_sound_and_sparks))) {
		if ((isEqual(rt.sv(f, "status"), 0) || isEqual(rt.sv(f, "status"), 3))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
		}
		if (truthy(rt.sv(f, "on"))) {
			yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
		}
	}
	rt.setSv(f, "status", 2);
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/machinery/light/proc/fix  (code/modules/power/lighting.dm:529)
rt.def("/obj/machinery/light/proc/fix", function fix(f: Frame) {
	if (isEqual(rt.sv(f, "status"), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "status", 0);
	rt.setSv(f, "brightness", rt.initial(f, live(f.src), "brightness"));
	rt.setSv(f, "on", 1);
	rt.callSrc(f, "update", []);
	return f.dot;
});

// /obj/machinery/light/proc/tesla_act  (code/modules/power/lighting.dm:538)  may sleep
rt.def("/obj/machinery/light/proc/tesla_act", function* tesla_act(f: Frame, power: Value, explosive: Value) {
	f.vars = () => [power, explosive];
	if (live(explosive) === null) {
		explosive = 0;
	}
	if (truthy(live(explosive))) {
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, 0, null, 0, null, 0, "flame_range", 5, "adminlog", 0], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/light/proc/power_change  (code/modules/power/lighting.dm:543)
rt.def("/obj/machinery/light/proc/power_change", function power_change(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	rt.callSrc(f, "seton", [(rt.gv(f, "lightswitch", (A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]))) && rt.fv(f, "power_light", live(A)))]);
	return f.dot;
});

// /obj/machinery/light/proc/temperature_expose  (code/modules/power/lighting.dm:549)  may sleep
rt.def("/obj/machinery/light/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/max"), null, [0, subtract(live(exposed_temperature), 673)]))]))) return f.dot;
	yield* g.srcCall(f, "break_light_tube");
	return f.dot;
}, true);

// /obj/machinery/light/proc/explode  (code/modules/power/lighting.dm:556)  may sleep
rt.def("/obj/machinery/light/proc/explode", function* explode(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
	yield* g.srcCall(f, "break_light_tube");
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	yield* g.call(f, P("/proc/explosion"), null, [live(_T), 0, 0, 2, 2]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(7638, "/obj/item/weapon/light", "/obj/item/weapon", {
	status: 0,
	base_state: null,
	switchcount: 0,
	rigged: 0,
	brightness: 2,
	icon: rt.rsc("icons/obj/lighting.dmi"),
	force: 2,
	throwforce: 5,
	w_class: 1,
	materials: null,
});

// /obj/item/weapon/light/proc/<init>  (code/modules/power/lighting.dm:575)
rt.def("/obj/item/weapon/light/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 100]));
	return f.dot;
});

// /obj/item/weapon/light/proc/throw_impact  (code/modules/power/lighting.dm:596)
rt.def("/obj/item/weapon/light/proc/throw_impact", function throw_impact(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) return f.dot;
	rt.callSrc(f, "shatter", []);
	return f.dot;
}, false, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/light/proc/update  (code/modules/power/lighting.dm:602)
rt.def("/obj/item/weapon/light/proc/update", function update(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "status");
	if ($0 === 0) {
		rt.setSv(f, "icon_state", rt.sv(f, "base_state"));
		rt.setSv(f, "desc", fmt("A replacement ＀.", [rt.sv(f, "name")]));
	} else if ($0 === 3) {
		rt.setSv(f, "icon_state", fmt("＀-burned", [rt.sv(f, "base_state")]));
		rt.setSv(f, "desc", fmt("A burnt-out ＀.", [rt.sv(f, "name")]));
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", fmt("＀-broken", [rt.sv(f, "base_state")]));
		rt.setSv(f, "desc", fmt("A broken ＀.", [rt.sv(f, "name")]));
	}
	return f.dot;
});

// /obj/item/weapon/light/proc/New  (code/modules/power/lighting.dm:615)  may sleep
rt.def("/obj/item/weapon/light/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update");
	return f.dot;
}, true);

// /obj/item/weapon/light/proc/attackby  (code/modules/power/lighting.dm:622)  may sleep
rt.def("/obj/item/weapon/light/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
		S = live(f.args[0]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You inject the solution into ％！.</span>", [live(f.src)])]);
		if (truthy((yield* g.callName(f, rt.fv(f, "reagents", live(S)), "has_reagent", ["plasma", 5])))) {
			rt.setSv(f, "rigged", 1);
		}
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "clear_reagents", []);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return live(f.dot);
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/light/proc/attack  (code/modules/power/lighting.dm:638)  may sleep
rt.def("/obj/item/weapon/light/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "shatter");
	return f.dot;
}, true, { args: ["M", "user", "def_zone"] });

// /obj/item/weapon/light/proc/attack_obj  (code/modules/power/lighting.dm:642)  may sleep
rt.def("/obj/item/weapon/light/proc/attack_obj", function* attack_obj(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "shatter");
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/weapon/light/proc/shatter  (code/modules/power/lighting.dm:646)
rt.def("/obj/item/weapon/light/proc/shatter", function shatter(f: Frame) {
	if (!(isEqual(rt.sv(f, "status"), 0) || isEqual(rt.sv(f, "status"), 3))) return f.dot;
	rt.callName(f, live(f.src), "visible_message", [fmt("<span class='danger'>＀ shatters.</span>", [rt.sv(f, "name")]), "<span class='italics'>You hear a small glass object shatter.</span>"]);
	rt.setSv(f, "status", 2);
	rt.setSv(f, "force", 5);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
	rt.callSrc(f, "update", []);
	return f.dot;
});
