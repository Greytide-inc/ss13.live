// From code/game/machinery/deployable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12544, "/obj/structure/barricade", "/obj/structure", {
	proj_pass_rate: 50,
	material: 1,
	anchored: 1,
	name: "chest high wall",
	desc: "Looks like this would make good cover.",
	density: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/structure/barricade/proc/deconstruct  (code/game/machinery/deployable.dm:22)  may sleep
rt.def("/obj/structure/barricade/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.srcCall(f, "make_debris");
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/barricade/proc/attackby  (code/game/machinery/deployable.dm:30)  may sleep
rt.def("/obj/structure/barricade/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) && isEqual(rt.sv(f, "material"), 1))) {
		WT = live(f.args[0]);
		if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
			if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "obj_integrity"), 20), rt.sv(f, "max_integrity")]))])));
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/barricade/proc/CanPass  (code/game/machinery/deployable.dm:42)
rt.def("/obj/structure/barricade/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let proj: Value = null;
	f.vars = () => [height, proj];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/barricade"), rt.getStep(f, live(mover), 0)))) {
		return 1;
	} else {
		if (truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "anchored"))) {
				return 1;
			}
			if ((truthy(rt.gv(f, "firer", (proj = live(mover)))) && truthy(rt.callSrc(f, "Adjacent", [rt.fv(f, "firer", live(proj))])))) {
				return 1;
			}
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "proj_pass_rate")]))) {
				return 1;
			}
			return 0;
		} else {
			return (!truthy(rt.sv(f, "density")) ? 1 : 0);
		}
	}
	return f.dot;
});

rt.type(12545, "/obj/structure/barricade/wooden", "/obj/structure/barricade", {
	material: 2,
	name: "wooden barricade",
	desc: "This space is blocked off by a wooden barricade.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "woodenbarricade",
});

// /obj/structure/barricade/wooden/proc/make_debris  (code/game/machinery/deployable.dm:70)  may sleep
rt.def("/obj/structure/barricade/wooden/proc/make_debris", function* make_debris(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/wood"), [rt.getStep(f, live(f.src), 0), 3]);
	return f.dot;
}, true);

rt.type(12546, "/obj/structure/barricade/sandbags", "/obj/structure/barricade", {
	proj_pass_rate: 20,
	pass_flags: 32,
	material: 3,
	smooth: 1,
	name: "sandbags",
	desc: "Bags of sand. Self explanatory.",
	icon: rt.rsc("icons/obj/smooth_structures/sandbags.dmi"),
	icon_state: "sandbags",
	obj_integrity: 280,
	max_integrity: 280,
	climbable: 1,
	canSmoothWith: null,
});

// /obj/structure/barricade/sandbags/proc/<init>  (code/game/machinery/deployable.dm:85)
rt.def("/obj/structure/barricade/sandbags/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/barricade/sandbags"), T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/obj/structure/barricade/security")));
	return f.dot;
});

rt.type(12547, "/obj/structure/barricade/security", "/obj/structure/barricade", {
	deploy_time: 40,
	deploy_message: 1,
	anchored: 0,
	proj_pass_rate: 20,
	name: "security barrier",
	desc: "A deployable barrier. Provides good cover in fire fights.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "barrier0",
	density: 0,
	obj_integrity: 180,
	max_integrity: 180,
	armor: null,
});

// /obj/structure/barricade/security/proc/<init>  (code/game/machinery/deployable.dm:98)
rt.def("/obj/structure/barricade/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 10, "acid", 0]));
	return f.dot;
});

// /obj/structure/barricade/security/proc/New  (code/game/machinery/deployable.dm:105)  may sleep
rt.def("/obj/structure/barricade/security/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/barricade/security/proc/deploy")])), rt.sv(f, "deploy_time")]);
	return f.dot;
}, true);

// /obj/structure/barricade/security/proc/deploy  (code/game/machinery/deployable.dm:109)
rt.def("/obj/structure/barricade/security/proc/deploy", function deploy(f: Frame) {
	rt.setSv(f, "icon_state", "barrier1");
	rt.setSv(f, "density", 1);
	rt.setSv(f, "anchored", 1);
	if (!truthy(rt.sv(f, "deploy_message"))) return f.dot;
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ deploys!</span>", [live(f.src)])]);
	return f.dot;
});

rt.type(6880, "/obj/item/weapon/grenade/barrier", "/obj/item/weapon/grenade", {
	mode: "single",
	name: "barrier grenade",
	desc: "Instant cover. Alt+click to toggle modes.",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "flashbang",
	item_state: "flashbang",
	actions_types: null,
});

// /obj/item/weapon/grenade/barrier/proc/<init>  (code/game/machinery/deployable.dm:122)
rt.def("/obj/item/weapon/grenade/barrier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_barrier_spread")));
	return f.dot;
});

// /obj/item/weapon/grenade/barrier/proc/AltClick  (code/game/machinery/deployable.dm:126)
rt.def("/obj/item/weapon/grenade/barrier/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if ((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || truthy(rt.callName(f, live(user), "incapacitated", [])))) {
		return live(f.dot);
	}
	rt.callSrc(f, "toggle_mode", [live(user)]);
	return f.dot;
});

// /obj/item/weapon/grenade/barrier/proc/toggle_mode  (code/game/machinery/deployable.dm:131)
rt.def("/obj/item/weapon/grenade/barrier/proc/toggle_mode", function toggle_mode(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === "single") {
		rt.setSv(f, "mode", "vertical");
	} else if ($0 === "vertical") {
		rt.setSv(f, "mode", "horizontal");
	} else if ($0 === "horizontal") {
		rt.setSv(f, "mode", "single");
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is now in ＀ mode.", [live(f.src), rt.sv(f, "mode")])]);
	return f.dot;
});

// /obj/item/weapon/grenade/barrier/proc/prime  (code/game/machinery/deployable.dm:142)  may sleep
rt.def("/obj/item/weapon/grenade/barrier/proc/prime", function* prime(f: Frame) {
	let target_turf: Value = null, target_turf2: Value = null;
	let $0: any;
	f.vars = () => [target_turf, target_turf2, $0];
	yield* g.new_(f, T("/obj/structure/barricade/security"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]);
	$0 = rt.sv(f, "mode");
	if ($0 === "vertical") {
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target_turf = rt.getStep(f, live(f.src), 1))])))) {
			yield* g.new_(f, T("/obj/structure/barricade/security"), [live(target_turf)]);
		}
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target_turf2 = rt.getStep(f, live(f.src), 2))])))) {
			yield* g.new_(f, T("/obj/structure/barricade/security"), [live(target_turf2)]);
		}
	} else if ($0 === "horizontal") {
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target_turf = rt.getStep(f, live(f.src), 4))])))) {
			yield* g.new_(f, T("/obj/structure/barricade/security"), [live(target_turf)]);
		}
		if (!truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target_turf2 = rt.getStep(f, live(f.src), 8))])))) {
			yield* g.new_(f, T("/obj/structure/barricade/security"), [live(target_turf2)]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/grenade/barrier/proc/ui_action_click  (code/game/machinery/deployable.dm:163)
rt.def("/obj/item/weapon/grenade/barrier/proc/ui_action_click", function ui_action_click(f: Frame, user: Value) {
	rt.callSrc(f, "toggle_mode", [live(user)]);
	return f.dot;
});
