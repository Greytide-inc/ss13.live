// From code/game/machinery/flasher.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10792, "/obj/machinery/flasher", "/obj/machinery", {
	bulb: null,
	id: null,
	range: 2,
	last_flash: 0,
	strength: 100,
	base_state: "mflash",
	anchored: 1,
	name: "mounted flash",
	desc: "A wall-mounted flashbulb device.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mflash1",
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
});

// /obj/machinery/flasher/proc/New  (code/game/machinery/flasher.dm:29)  may sleep
rt.def("/obj/machinery/flasher/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -28;
			} else {
				$0 = 28;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -28;
			} else {
				$0 = 28;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
	} else {
		rt.setSv(f, "bulb", (yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)])));
	}
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// /obj/machinery/flasher/proc/Destroy  (code/game/machinery/flasher.dm:39)  may sleep
rt.def("/obj/machinery/flasher/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "bulb"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "bulb")]);
		rt.setSv(f, "bulb", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/flasher/proc/power_change  (code/game/machinery/flasher.dm:44)
rt.def("/obj/machinery/flasher/proc/power_change", function power_change(f: Frame) {
	if (((truthy(rt.callSrc(f, "powered", [])) && truthy(rt.sv(f, "anchored"))) && truthy(rt.sv(f, "bulb")))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		if (truthy(rt.fv(f, "crit_fail", rt.sv(f, "bulb")))) {
			rt.setSv(f, "icon_state", fmt("＀1-p", [rt.sv(f, "base_state")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀1", [rt.sv(f, "base_state")]));
		}
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		rt.setSv(f, "icon_state", fmt("＀1-p", [rt.sv(f, "base_state")]));
	}
	return f.dot;
});

// /obj/machinery/flasher/proc/attackby  (code/game/machinery/flasher.dm:56)  may sleep
rt.def("/obj/machinery/flasher/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "bulb"))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to disconnect ＀'s flashbulb.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin to disconnect ＀'s flashbulb...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && truthy(rt.sv(f, "bulb")))) {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ has disconnected ＀'s flashbulb!", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You disconnect ＀'s flashbulb.</span>", [live(f.src)])]);
				yield* g.callName(f, rt.sv(f, "bulb"), "forceMove", [rt.sv(f, "loc")]);
				rt.setSv(f, "bulb", null);
				yield* g.srcCall(f, "power_change");
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/flash/handheld")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "bulb"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ installs ＀ into ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You install ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
				rt.setSv(f, "bulb", live(f.args[0]));
				yield* g.srcCall(f, "power_change");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>A flashbulb is already installed in ＀!</span>", [live(f.src)])]);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				if (!truthy(rt.sv(f, "bulb"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start unsecuring the flasher frame...</span>"]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the flasher frame.</span>"]);
						yield* g.srcCall(f, "deconstruct", 1);
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Remove a flashbulb from ＀ first!</span>", [live(f.src)])]);
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/flasher/proc/attack_ai  (code/game/machinery/flasher.dm:93)  may sleep
rt.def("/obj/machinery/flasher/proc/attack_ai", function* attack_ai(f: Frame) {
	if (!truthy(rt.sv(f, "anchored"))) return f.dot;
	return (yield* g.srcCall(f, "flash"));
}, true);

// /obj/machinery/flasher/proc/run_obj_armor  (code/game/machinery/flasher.dm:96)
rt.def("/obj/machinery/flasher/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 10))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/machinery/flasher/proc/flash  (code/game/machinery/flasher.dm:101)  may sleep
rt.def("/obj/machinery/flasher/proc/flash", function* flash(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if ((!truthy((yield* g.srcCall(f, "powered"))) || !truthy(rt.sv(f, "bulb")))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "crit_fail", rt.sv(f, "bulb"))) || (truthy(rt.sv(f, "last_flash")) && rt.lt(rt.worldTime(f), add(rt.fv(f, "last_flash", live(f.src)), 150))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "bulb"), "flash_recharge", [30])))) {
		yield* g.srcCall(f, "power_change");
		return live(f.dot);
	}
	rt.incField(f, rt.sv(f, "bulb"), "times_used", 1, true);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/flash.ogg"), 100, 1]);
	yield* g.call(f, P("/proc/flick"), null, [fmt("＀_flash", [rt.sv(f, "base_state")]), live(f.src)]);
	rt.setSv(f, "last_flash", rt.worldTime(f));
	yield* g.srcCall(f, "use_power", 1000);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(f.src), null])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(L)])), rt.sv(f, "range"))) {
			continue;
		}
		if (truthy((yield* g.callName(f, live(L), "flash_act", ["affect_silicon", 1], rt.Args.Named)))) {
			yield* g.callName(f, live(L), "Knockdown", [rt.sv(f, "strength")]);
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /obj/machinery/flasher/proc/emp_act  (code/game/machinery/flasher.dm:128)  may sleep
rt.def("/obj/machinery/flasher/proc/emp_act", function* emp_act(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		if ((truthy(rt.sv(f, "bulb")) && truthy(rt.op(f, "Prob", [], [divide(75, live(f.args[0]))])))) {
			yield* g.srcCall(f, "flash");
			yield* g.callName(f, rt.sv(f, "bulb"), "burn_out", []);
			yield* g.srcCall(f, "power_change");
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/flasher/proc/obj_break  (code/game/machinery/flasher.dm:136)  may sleep
rt.def("/obj/machinery/flasher/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	if (!truthy(rt.sv(f, "bulb"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "bulb"), "burn_out", []);
	yield* g.srcCall(f, "power_change");
	return f.dot;
}, true);

// /obj/machinery/flasher/proc/deconstruct  (code/game/machinery/flasher.dm:144)  may sleep
rt.def("/obj/machinery/flasher/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	f.vars = () => [disassembled, F];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "bulb"))) {
			yield* g.callName(f, rt.sv(f, "bulb"), "forceMove", [rt.sv(f, "loc")]);
			rt.setSv(f, "bulb", null);
		}
		if (truthy(live(disassembled))) {
			yield* g.srcCall(f, "transfer_fingerprints_to", (F = (yield* g.new_(f, T("/obj/item/wallframe/flasher"), [rt.getStep(f, live(f.src), 0)]))));
			rt.setFv(f, "id", live(F), rt.sv(f, "id"));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
		} else {
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10793, "/obj/machinery/flasher/portable", "/obj/machinery/flasher", {
	strength: 80,
	anchored: 0,
	base_state: "pflash",
	name: "portable flasher",
	desc: "A portable flashing device. Wrench to activate and deactivate. Cannot detect slow movements.",
	icon_state: "pflash1-p",
	density: 1,
});

// /obj/machinery/flasher/portable/proc/Initialize  (code/game/machinery/flasher.dm:158)  may sleep
rt.def("/obj/machinery/flasher/portable/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "proximity_monitor", (yield* g.new_(f, T("/datum/proximity_monitor"), [live(f.src), 0])));
	return f.dot;
}, true);

// /obj/machinery/flasher/portable/proc/HasProximity  (code/game/machinery/flasher.dm:162)  may sleep
rt.def("/obj/machinery/flasher/portable/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	let M: Value = null;
	f.vars = () => [AM, M];
	if ((truthy(rt.sv(f, "last_flash")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_flash"), 150)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!(!isEqual(rt.gv(f, "m_intent", (M = live(AM))), "walk") && truthy(rt.sv(f, "anchored")))) return f.dot;
	yield* g.srcCall(f, "flash");
	return f.dot;
}, true);

// /obj/machinery/flasher/portable/proc/attackby  (code/game/machinery/flasher.dm:171)  may sleep
rt.def("/obj/machinery/flasher/portable/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
		if ((!truthy(rt.sv(f, "anchored")) && !truthy((yield* g.srcCall(f, "isinspace"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ is now secured.</span>", [live(f.src)])]);
			yield* g.srcCall(f, "add_overlay", fmt("＀-s", [rt.sv(f, "base_state")]));
			rt.setSv(f, "anchored", 1);
			yield* g.srcCall(f, "power_change");
			yield* g.callName(f, rt.sv(f, "proximity_monitor"), "SetRange", [rt.sv(f, "range")]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ can now be moved.</span>", [live(f.src)])]);
			yield* g.srcCall(f, "cut_overlays");
			rt.setSv(f, "anchored", 0);
			yield* g.srcCall(f, "power_change");
			yield* g.callName(f, rt.sv(f, "proximity_monitor"), "SetRange", [0]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9542, "/obj/item/wallframe/flasher", "/obj/item/wallframe", {
	id: null,
	name: "mounted flash frame",
	desc: "Used for building wall-mounted flashers.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mflash_frame",
	result_path: rt.typePath("/obj/machinery/flasher"),
});

// /obj/item/wallframe/flasher/proc/examine  (code/game/machinery/flasher.dm:199)
rt.def("/obj/item/wallframe/flasher/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Its channel ID is '＀'.</span>", [rt.sv(f, "id")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/wallframe/flasher/proc/after_attach  (code/game/machinery/flasher.dm:203)
rt.def("/obj/item/wallframe/flasher/proc/after_attach", function after_attach(f: Frame) {
	let F: Value = null;
	f.vars = () => [F];
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "id", (F = live(f.args[0])), rt.sv(f, "id"));
	return f.dot;
}, false, { args: ["O"] });
