// From code/game/machinery/computer/computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10349, "/obj/machinery/computer", "/obj/machinery", {
	circuit: null,
	processing: 0,
	brightness_on: 2,
	icon_keyboard: "generic_key",
	icon_screen: "generic",
	clockwork: 0,
	anchored: 1,
	name: "computer",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "computer",
	density: 1,
	use_power: 1,
	idle_power_usage: 300,
	active_power_usage: 300,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
	armor: null,
});

// /obj/machinery/computer/proc/<init>  (code/game/machinery/computer/computer.dm:13)
rt.def("/obj/machinery/computer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 40, "acid", 20]));
	return f.dot;
});

// /obj/machinery/computer/proc/New  (code/game/machinery/computer/computer.dm:22)  may sleep
rt.def("/obj/machinery/computer/proc/New", function* New(f: Frame, location: Value, C: Value) {
	f.vars = () => [location, C];
	yield* g.callSuper(f, [live(location)]);
	if ((truthy(live(C)) && truthy((rt.istype(live(C), T("/obj/item/weapon/circuitboard")) ? 1 : 0)))) {
		rt.setSv(f, "circuit", live(C));
	} else {
		if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "circuit")])))) return f.dot;
		rt.setSv(f, "circuit", (yield* g.new_(f, rt.sv(f, "circuit"), [null])));
	}
	return f.dot;
}, true);

// /obj/machinery/computer/proc/Destroy  (code/game/machinery/computer/computer.dm:33)  may sleep
rt.def("/obj/machinery/computer/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "circuit"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "circuit")]);
		rt.setSv(f, "circuit", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/proc/Initialize  (code/game/machinery/computer/computer.dm:38)  may sleep
rt.def("/obj/machinery/computer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "power_change");
	return f.dot;
}, true);

// /obj/machinery/computer/proc/process  (code/game/machinery/computer/computer.dm:42)
rt.def("/obj/machinery/computer/proc/process", function process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	return 1;
}, false, { waitfor: false });

// /obj/machinery/computer/proc/ratvar_act  (code/game/machinery/computer/computer.dm:47)
rt.def("/obj/machinery/computer/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (truthy(rt.sv(f, "clockwork"))) return f.dot;
	rt.setSv(f, "clockwork", 1);
	rt.setSv(f, "icon_screen", fmt("ratvar＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.setSv(f, "icon_keyboard", fmt("ratvar_key＀", [rt.call(f, P("/proc/rand"), null, [1, 6])]));
	rt.setSv(f, "icon_state", fmt("ratvarcomputer＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/computer/proc/narsie_act  (code/game/machinery/computer/computer.dm:55)
rt.def("/obj/machinery/computer/proc/narsie_act", function narsie_act(f: Frame) {
	if (!(truthy(rt.sv(f, "clockwork")) && !isEqual(rt.sv(f, "clockwork"), rt.initial(f, live(f.src), "clockwork")))) return f.dot;
	rt.setSv(f, "clockwork", 0);
	rt.setSv(f, "icon_screen", rt.initial(f, live(f.src), "icon_screen"));
	rt.setSv(f, "icon_keyboard", rt.initial(f, live(f.src), "icon_keyboard"));
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/computer/proc/update_icon  (code/game/machinery/computer/computer.dm:63)
rt.def("/obj/machinery/computer/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_off", [rt.sv(f, "icon_keyboard")])]);
		return live(f.dot);
	}
	rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_keyboard")]);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_broken", [rt.sv(f, "icon_state")])]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_screen")]);
	}
	return f.dot;
});

// /obj/machinery/computer/proc/power_change  (code/game/machinery/computer/computer.dm:74)
rt.def("/obj/machinery/computer/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.callSrc(f, "set_light", [0]);
	} else {
		rt.callSrc(f, "set_light", [rt.sv(f, "brightness_on")]);
	}
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
});

// /obj/machinery/computer/proc/attackby  (code/game/machinery/computer/computer.dm:83)  may sleep
rt.def("/obj/machinery/computer/proc/attackby", function* attackby(f: Frame) {
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "circuit"))) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'> You start to disconnect the monitor...</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "deconstruct", 1, live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/proc/play_attack_sound  (code/game/machinery/computer/computer.dm:92)
rt.def("/obj/machinery/computer/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/glasshit.ogg"), 75, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/computer/proc/obj_break  (code/game/machinery/computer/computer.dm:102)
rt.def("/obj/machinery/computer/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(truthy(rt.sv(f, "circuit")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/computer/proc/emp_act  (code/game/machinery/computer/computer.dm:109)  may sleep
rt.def("/obj/machinery/computer/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === 1) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "obj_break", "energy");
		}
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			yield* g.srcCall(f, "obj_break", "energy");
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/computer/proc/deconstruct  (code/game/machinery/computer/computer.dm:119)  may sleep
rt.def("/obj/machinery/computer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let A: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [disassembled, user, A, C, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.srcCall(f, "on_deconstruction");
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "circuit"))) {
			rt.setFv(f, "circuit", (A = (yield* g.new_(f, T("/obj/structure/frame/computer"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "circuit"));
			rt.setFv(f, "anchored", live(A), 1);
			if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
				if (truthy(live(user))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The broken glass falls out.</span>"]);
				} else {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1]);
				}
				yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
				yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
				rt.setFv(f, "state", live(A), 3);
				rt.setFv(f, "icon_state", live(A), "3");
			} else {
				if (truthy(live(user))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You disconnect the monitor.</span>"]);
				}
				rt.setFv(f, "state", live(A), 4);
				rt.setFv(f, "icon_state", live(A), "4");
			}
			rt.setSv(f, "circuit", null);
		}
		C = null;
		rt.forList(f, 0, live(f.src), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.callName(f, live(C), "forceMove", [rt.sv(f, "loc")]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
