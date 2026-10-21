// From code/modules/awaymissions/gateway.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalthe_gateway  (code/modules/awaymissions/gateway.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalthe_gateway", function InitGlobalthe_gateway(f: Frame) {
	rt.setGl("the_gateway", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "the_gateway", add);
	return f.dot;
});

rt.type(10339, "/obj/machinery/gateway", "/obj/machinery", {
	active: 0,
	checkparts: 1,
	randomspawns: null,
	calibrated: 1,
	linked: null,
	can_link: 0,
	anchored: 1,
	name: "gateway",
	desc: "A mysterious gateway built by unknown hands, it allows for faster than light travel to far-flung locations.",
	icon: rt.rsc("icons/obj/machines/gateway.dmi"),
	icon_state: "off",
	density: 1,
	resistance_flags: 115,
});

// /obj/machinery/gateway/proc/<init>  (code/modules/awaymissions/gateway.dm:13)
rt.def("/obj/machinery/gateway/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "randomspawns", rt.list());
	$0 = $0;
	rt.setSv(f, "linked", rt.list());
	return f.dot;
});

// /obj/machinery/gateway/proc/Initialize  (code/modules/awaymissions/gateway.dm:19)  may sleep
rt.def("/obj/machinery/gateway/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "randomspawns", rt.gl("awaydestinations"));
	yield* g.srcCall(f, "update_icon");
	if ((!truthy((rt.istype(live(f.src), T("/obj/machinery/gateway/centerstation")) ? 1 : 0)) && !truthy((rt.istype(live(f.src), T("/obj/machinery/gateway/centeraway")) ? 1 : 0)))) {
		$0 = rt.sv(f, "dir");
		if ($0 === 2 || $0 === 6 || $0 === 10) {
			rt.setSv(f, "density", 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/gateway/proc/toggleoff  (code/modules/awaymissions/gateway.dm:28)
rt.def("/obj/machinery/gateway/proc/toggleoff", function toggleoff(f: Frame) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	G = null;
	rt.forList(f, 0, rt.sv(f, "linked"), T("/obj/machinery/gateway"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.setFv(f, "active", live(G), 0);
		rt.callName(f, live(G), "update_icon", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "active", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/gateway/proc/detect  (code/modules/awaymissions/gateway.dm:35)
rt.def("/obj/machinery/gateway/proc/detect", function detect(f: Frame) {
	let _T: Value = null, ready: Value = null, i: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [_T, ready, i, G, $e];
	if (!truthy(rt.sv(f, "can_link"))) {
		return 0;
	}
	rt.setSv(f, "linked", rt.list());
	_T = rt.sv(f, "loc");
	ready = 0;
	i = null;
	rt.forList(f, 0, rt.gl("alldirs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, rt.sv(f, "loc"), live(i));
		if (truthy((G = rt.locateIn(f, T("/obj/machinery/gateway"), live(_T))))) {
			rt.callName(f, rt.sv(f, "linked"), "Add", [live(G)]);
			continue;
		}
		ready = 0;
		rt.callSrc(f, "toggleoff", []);
		break;
	}
	rt.endFor(f, 0);
	if ((isEqual(rt.len(f, rt.sv(f, "linked")), 8) || !truthy(rt.sv(f, "checkparts")))) {
		ready = 1;
	}
	return live(ready);
});

// /obj/machinery/gateway/proc/update_icon  (code/modules/awaymissions/gateway.dm:59)
rt.def("/obj/machinery/gateway/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "on");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "off");
	return f.dot;
});

// /obj/machinery/gateway/proc/attack_hand  (code/modules/awaymissions/gateway.dm:68)
rt.def("/obj/machinery/gateway/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!truthy(rt.callSrc(f, "detect", []))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) {
		rt.callSrc(f, "toggleon", [live(user)]);
		return live(f.dot);
	}
	rt.callSrc(f, "toggleoff", []);
	return f.dot;
});

rt.type(10340, "/obj/machinery/gateway/centerstation", "/obj/machinery/gateway", {
	wait: 0,
	awaygate: null,
	density: 1,
	icon_state: "offcenter",
	use_power: 1,
	can_link: 1,
});

// /obj/machinery/gateway/centerstation/proc/New  (code/modules/awaymissions/gateway.dm:79)  may sleep
rt.def("/obj/machinery/gateway/centerstation/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("the_gateway"))) return f.dot;
	rt.setGl("the_gateway", live(f.src));
	return f.dot;
}, true);

// /obj/machinery/gateway/centerstation/proc/Destroy  (code/modules/awaymissions/gateway.dm:84)  may sleep
rt.def("/obj/machinery/gateway/centerstation/proc/Destroy", function* Destroy(f: Frame) {
	if (isEqual(rt.gl("the_gateway"), live(f.src))) {
		rt.setGl("the_gateway", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/gateway/centerstation/proc/Initialize  (code/modules/awaymissions/gateway.dm:100)  may sleep
rt.def("/obj/machinery/gateway/centerstation/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "wait", add(rt.worldTime(f), rt.fv(f, "gateway_delay", rt.gl("config"))));
	rt.setSv(f, "awaygate", rt.locateIn(f, T("/obj/machinery/gateway/centeraway"), rt.world()));
	return f.dot;
}, true);

// /obj/machinery/gateway/centerstation/proc/update_icon  (code/modules/awaymissions/gateway.dm:107)
rt.def("/obj/machinery/gateway/centerstation/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "oncenter");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "offcenter");
	return f.dot;
});

// /obj/machinery/gateway/centerstation/proc/process  (code/modules/awaymissions/gateway.dm:112)
rt.def("/obj/machinery/gateway/centerstation/proc/process", function process(f: Frame) {
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) && truthy(rt.sv(f, "use_power")))) {
		if (truthy(rt.sv(f, "active"))) {
			rt.callSrc(f, "toggleoff", []);
		}
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	rt.callSrc(f, "use_power", [5000]);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/gateway/centerstation/proc/toggleon  (code/modules/awaymissions/gateway.dm:121)
rt.def("/obj/machinery/gateway/centerstation/proc/toggleon", function toggleon(f: Frame, user: Value) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	if (!truthy(rt.callSrc(f, "detect", []))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "powered", []))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "awaygate"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Error: No destination found.</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), rt.sv(f, "wait"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Error: Warpspace triangulation in progress. Estimated time to completion: ＀ minutes.</span>", [rt.call(f, P("/proc/round"), null, [divide(divide(subtract(rt.sv(f, "wait"), rt.worldTime(f)), 10), 60)])])]);
		return live(f.dot);
	}
	G = null;
	rt.forList(f, 0, rt.sv(f, "linked"), T("/obj/machinery/gateway"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.setFv(f, "active", live(G), 1);
		rt.callName(f, live(G), "update_icon", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "active", 1);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/gateway/centerstation/proc/Bumped  (code/modules/awaymissions/gateway.dm:140)  may sleep
rt.def("/obj/machinery/gateway/centerstation/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let M: Value = null, dest: Value = null;
	f.vars = () => [AM, M, dest];
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "detect")))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "awaygate")) || (!truthy(rt.sv(f, "awaygate")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "awaygate")))))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "calibrated", rt.sv(f, "awaygate")))) {
		yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, rt.fv(f, "loc", rt.sv(f, "awaygate")), 2)]);
		yield* g.callName(f, live(AM), "setDir", [2]);
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
			if (truthy(rt.gv(f, "client", (M = live(AM))))) {
				rt.setFv(f, "move_delay", rt.fv(f, "client", live(M)), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), 5), rt.gv(f, "move_delay", rt.fv(f, "client", live(M)))])));
			}
		}
		return live(f.dot);
	} else {
		if (truthy((dest = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "randomspawns")])))) {
			yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, live(dest), 0)]);
			yield* g.callName(f, live(AM), "setDir", [2]);
			yield* g.srcCall(f, "use_power", 5000);
		}
		return live(f.dot);
	}
	return f.dot;
}, true);

rt.type(10341, "/obj/machinery/gateway/centeraway", "/obj/machinery/gateway", {
	stationgate: null,
	density: 1,
	icon_state: "offcenter",
	use_power: 0,
	can_link: 1,
});

// /obj/machinery/gateway/centeraway/proc/attackby  (code/modules/awaymissions/gateway.dm:164)
rt.def("/obj/machinery/gateway/centeraway/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!truthy((rt.istype(live(W), T("/obj/item/device/multitool")) ? 1 : 0))) return f.dot;
	if (truthy(rt.sv(f, "calibrated"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), " The gate is already calibrated, there is no work for you to do here."]);
		return live(f.dot);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldnotice'>Recalibration successful!</span>:  This gate's systems have been fine tuned.  Travel to this gate will now be on target."]);
		rt.setSv(f, "calibrated", 1);
		return live(f.dot);
	}
	return f.dot;
});

// /obj/machinery/gateway/centeraway/proc/Initialize  (code/modules/awaymissions/gateway.dm:185)  may sleep
rt.def("/obj/machinery/gateway/centeraway/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "stationgate", rt.locateIn(f, T("/obj/machinery/gateway/centerstation"), rt.world()));
	return f.dot;
}, true);

// /obj/machinery/gateway/centeraway/proc/update_icon  (code/modules/awaymissions/gateway.dm:192)
rt.def("/obj/machinery/gateway/centeraway/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "oncenter");
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", "offcenter");
	return f.dot;
});

// /obj/machinery/gateway/centeraway/proc/toggleon  (code/modules/awaymissions/gateway.dm:197)
rt.def("/obj/machinery/gateway/centeraway/proc/toggleon", function toggleon(f: Frame, user: Value) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [G, $e];
	if (!truthy(rt.callSrc(f, "detect", []))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "stationgate"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Error: No destination found.</span>"]);
		return live(f.dot);
	}
	G = null;
	rt.forList(f, 0, rt.sv(f, "linked"), T("/obj/machinery/gateway"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.setFv(f, "active", live(G), 1);
		rt.callName(f, live(G), "update_icon", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "active", 1);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/gateway/centeraway/proc/check_exile_implant  (code/modules/awaymissions/gateway.dm:210)
rt.def("/obj/machinery/gateway/centeraway/proc/check_exile_implant", function check_exile_implant(f: Frame, C: Value) {
	let E: Value = null;
	let $e: any;
	f.vars = () => [E, $e];
	E = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(C)), T("/obj/item/weapon/implant/exile"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(C), " The station gate has detected your exile implant and is blocking your entry."]);
		return 1;
	}
	rt.endFor(f, 0);
	return 0;
});

// /obj/machinery/gateway/centeraway/proc/Bumped  (code/modules/awaymissions/gateway.dm:216)  may sleep
rt.def("/obj/machinery/gateway/centeraway/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [AM, C, M, $e];
	if (!truthy((yield* g.srcCall(f, "detect")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "active"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "stationgate")) || (!truthy(rt.sv(f, "stationgate")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "stationgate")))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "check_exile_implant", live(AM))))) {
			return live(f.dot);
		}
	} else {
		C = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(AM)), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((yield* g.srcCall(f, "check_exile_implant", live(C))))) {
				yield* g.srcCall(f, "say", fmt("Rejecting ＀: Exile implant detected in contained lifeform.", [live(AM)]));
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy((yield* g.callName(f, live(AM), "has_buckled_mobs", [])))) {
		C = null;
		rt.forList(f, 0, rt.fv(f, "buckled_mobs", live(AM)), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy((yield* g.srcCall(f, "check_exile_implant", live(C))))) {
				yield* g.srcCall(f, "say", fmt("Rejecting ＀: Exile implant detected in close proximity lifeform.", [live(AM)]));
				return live(f.dot);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, live(AM), "forceMove", [rt.getStep(f, rt.fv(f, "loc", rt.sv(f, "stationgate")), 2)]);
	yield* g.callName(f, live(AM), "setDir", [2]);
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) return f.dot;
	if (!truthy(rt.gv(f, "client", (M = live(AM))))) return f.dot;
	rt.setFv(f, "move_delay", rt.fv(f, "client", live(M)), (yield* g.call(f, P("/proc/max"), null, [add(rt.worldTime(f), 5), rt.gv(f, "move_delay", rt.fv(f, "client", live(M)))])));
	return f.dot;
}, true);
