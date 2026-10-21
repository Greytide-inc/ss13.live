// From code/game/machinery/droneDispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10762, "/obj/machinery/droneDispenser", "/obj/machinery", {
	icon_off: "off",
	icon_on: "on",
	icon_recharging: "recharge",
	icon_creating: "make",
	materials: null,
	using_materials: null,
	metal_cost: 1000,
	glass_cost: 1000,
	power_used: 1000,
	mode: "ready",
	timer: null,
	cooldownTime: 1800,
	production_time: 30,
	dispense_type: rt.typePath("/obj/item/drone_shell"),
	maximum_idle: 3,
	work_sound: rt.rsc("sound/items/rped.ogg"),
	create_sound: rt.rsc("sound/items/deconstruct.ogg"),
	recharge_sound: rt.rsc("sound/machines/ping.ogg"),
	begin_create_message: "whirs to life!",
	end_create_message: "dispenses a drone shell.",
	recharge_message: "pings.",
	recharging_text: "It is whirring and clicking. It seems to be recharging.",
	break_message: "lets out a tinny alarm before falling dark.",
	break_sound: rt.rsc("sound/machines/warning-buzzer.ogg"),
	anchored: 1,
	name: "drone shell dispenser",
	desc: "A hefty machine that, when supplied with metal and glass, will periodically create a drone shell. Does not need to be manually operated.",
	icon: rt.rsc("icons/obj/machines/droneDispenser.dmi"),
	icon_state: "on",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 80,
});

// /obj/machinery/droneDispenser/proc/New  (code/game/machinery/droneDispenser.dm:57)  may sleep
rt.def("/obj/machinery/droneDispenser/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass"), 200000])));
	rt.setSv(f, "using_materials", rt.alist(f, ["$metal", rt.sv(f, "metal_cost"), "$glass", rt.sv(f, "glass_cost")]));
	return f.dot;
}, true);

// /obj/machinery/droneDispenser/proc/Destroy  (code/game/machinery/droneDispenser.dm:65)  may sleep
rt.def("/obj/machinery/droneDispenser/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(10764, "/obj/machinery/droneDispenser/preloaded", "/obj/machinery/droneDispenser", {});

// /obj/machinery/droneDispenser/preloaded/proc/New  (code/game/machinery/droneDispenser.dm:69)  may sleep
rt.def("/obj/machinery/droneDispenser/preloaded/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "materials"), "insert_amount", [5000]);
	return f.dot;
}, true);

rt.type(10765, "/obj/machinery/droneDispenser/syndrone", "/obj/machinery/droneDispenser", {
	dispense_type: rt.typePath("/obj/item/drone_shell/syndrone"),
	cooldownTime: 100,
	end_create_message: "dispenses a suspicious drone shell.",
	name: "syndrone shell dispenser",
	desc: "A suspicious machine that will create Syndicate exterminator drones when supplied with metal and glass. Disgusting.",
});

// /obj/machinery/droneDispenser/syndrone/proc/New  (code/game/machinery/droneDispenser.dm:82)  may sleep
rt.def("/obj/machinery/droneDispenser/syndrone/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "materials"), "insert_amount", [25000]);
	return f.dot;
}, true);

rt.type(10768, "/obj/machinery/droneDispenser/snowflake/preloaded", "/obj/machinery/droneDispenser/snowflake", {});

// /obj/machinery/droneDispenser/snowflake/preloaded/proc/New  (code/game/machinery/droneDispenser.dm:107)  may sleep
rt.def("/obj/machinery/droneDispenser/snowflake/preloaded/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "materials"), "insert_amount", [10000]);
	return f.dot;
}, true);

// /obj/machinery/droneDispenser/proc/examine  (code/game/machinery/droneDispenser.dm:158)
rt.def("/obj/machinery/droneDispenser/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (((isEqual(rt.sv(f, "mode"), "recharging") && !truthy(rt.sv(f, "stat"))) && truthy(rt.sv(f, "recharging_text")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀</span>", [rt.sv(f, "recharging_text")])]);
	}
	if (truthy(rt.sv(f, "metal_cost"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has ＀ units of metal stored.</span>", [rt.callName(f, rt.sv(f, "materials"), "amount", ["$metal"])])]);
	}
	if (!truthy(rt.sv(f, "glass_cost"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has ＀ units of glass stored.</span>", [rt.callName(f, rt.sv(f, "materials"), "amount", ["$glass"])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/droneDispenser/proc/power_change  (code/game/machinery/droneDispenser.dm:167)
rt.def("/obj/machinery/droneDispenser/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.callSrc(f, "powered", []))) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/droneDispenser/proc/process  (code/game/machinery/droneDispenser.dm:175)  may sleep
rt.def("/obj/machinery/droneDispenser/proc/process", function* process(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "anchored")))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_materials", [rt.sv(f, "using_materials")])))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "timer"), rt.worldTime(f))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === "ready") {
		if ((truthy(rt.sv(f, "maximum_idle")) && rt.ge((yield* g.srcCall(f, "count_shells")), rt.sv(f, "maximum_idle")))) {
			return live(f.dot);
		}
		if (truthy(rt.sv(f, "begin_create_message"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ ＀</span>", [live(f.src), rt.sv(f, "begin_create_message")]));
		}
		if (truthy(rt.sv(f, "work_sound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "work_sound"), 50, 1]);
		}
		rt.setSv(f, "mode", "production");
		rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "production_time")));
		yield* g.srcCall(f, "update_icon");
	} else if ($0 === "production") {
		yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [rt.sv(f, "using_materials")]);
		if (truthy(rt.sv(f, "power_used"))) {
			yield* g.srcCall(f, "use_power", rt.sv(f, "power_used"));
		}
		rt.setFv(f, "admin_spawned", (A = (yield* g.new_(f, rt.sv(f, "dispense_type"), [rt.sv(f, "loc")]))), rt.sv(f, "admin_spawned"));
		if (truthy(rt.sv(f, "create_sound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "create_sound"), 50, 1]);
		}
		if (truthy(rt.sv(f, "end_create_message"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ ＀</span>", [live(f.src), rt.sv(f, "end_create_message")]));
		}
		rt.setSv(f, "mode", "recharging");
		rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "cooldownTime")));
		yield* g.srcCall(f, "update_icon");
	} else if ($0 === "recharging") {
		if (truthy(rt.sv(f, "recharge_sound"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "recharge_sound"), 50, 1]);
		}
		if (truthy(rt.sv(f, "recharge_message"))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ ＀</span>", [live(f.src), rt.sv(f, "recharge_message")]));
		}
		rt.setSv(f, "mode", "ready");
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/droneDispenser/proc/count_shells  (code/game/machinery/droneDispenser.dm:230)
rt.def("/obj/machinery/droneDispenser/proc/count_shells", function count_shells(f: Frame) {
	let a: Value = null;
	let $e: any;
	f.vars = () => [a, $e];
	f.dot = 0;
	a = null;
	rt.forList(f, 0, rt.sv(f, "loc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		if (truthy(rt.op(f, "IsType", [], [live(a), rt.sv(f, "dispense_type")]))) {
			f.dot = rt.inc(live(f.dot), 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/droneDispenser/proc/update_icon  (code/game/machinery/droneDispenser.dm:235)
rt.def("/obj/machinery/droneDispenser/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_off"));
	} else {
		if (isEqual(rt.sv(f, "mode"), "recharging")) {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_recharging"));
		} else {
			if (isEqual(rt.sv(f, "mode"), "production")) {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_creating"));
			} else {
				rt.setSv(f, "icon_state", rt.sv(f, "icon_on"));
			}
		}
	}
	return f.dot;
});

// /obj/machinery/droneDispenser/proc/attackby  (code/game/machinery/droneDispenser.dm:245)  may sleep
rt.def("/obj/machinery/droneDispenser/proc/attackby", function* attackby(f: Frame) {
	let sheets: Value = null, used: Value = null, WT: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [sheets, used, WT, $0, $1, $2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack")) ? 1 : 0))) {
		if ((!truthy(rt.index(rt.fv(f, "materials", live(f.args[0])), "$metal")) && !truthy(rt.index(rt.fv(f, "materials", live(f.args[0])), "$glass")))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		if ((!truthy(rt.sv(f, "metal_cost")) && !truthy(rt.sv(f, "glass_cost")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There isn't a place to insert ＀!</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		sheets = live(f.args[0]);
		if (!truthy((yield* g.callName(f, live(f.args[1]), "canUnEquip", [live(sheets)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is stuck to your hand, you can't get it off!</span>", [live(f.args[0])])]);
			return live(f.dot);
		}
		if (truthy((used = (yield* g.callName(f, rt.sv(f, "materials"), "insert_stack", [live(sheets), rt.fv(f, "amount", live(sheets))]))))) {
			$0 = live(f.args[1]);
			$1 = live(used);
			if (rt.gt(live(used), 1)) {
				$2 = "s";
			} else {
				$2 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You insert ＀ sheet＀ into ＀.</span>", [$1, $2, live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ isn't accepting the ＀.</span>", [live(f.src), live(sheets)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You retrieve the materials from ＀.</span>", [live(f.src)])]);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
				if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ doesn't need repairs.</span>", [live(f.src)])]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
					return live(f.dot);
				}
				if (rt.lt((yield* g.callName(f, live(WT), "get_fuel", [])), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more fuel to complete this task!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(WT)), 50, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins patching up ＀ with ＀.</span>", [live(f.args[1]), live(f.src), live(WT)]), fmt("<span class='notice'>You begin restoring the damage to ＀...</span>", [live(f.src)])]);
				if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					return live(f.dot);
				}
				if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "remove_fuel", [1, live(f.args[1])]))))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ fixes ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You restore ＀ to operation.</span>", [live(f.src)])]);
				(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
				rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
				yield* g.srcCall(f, "update_icon");
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/machinery/droneDispenser/proc/obj_break  (code/game/machinery/droneDispenser.dm:305)
rt.def("/obj/machinery/droneDispenser/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	if (truthy(rt.sv(f, "break_message"))) {
		rt.callSrc(f, "audible_message", [fmt("<span class='warning'>＀ ＀</span>", [live(f.src), rt.sv(f, "break_message")])]);
	}
	if (truthy(rt.sv(f, "break_sound"))) {
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "break_sound"), 50, 1]);
	}
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/droneDispenser/proc/deconstruct  (code/game/machinery/droneDispenser.dm:316)  may sleep
rt.def("/obj/machinery/droneDispenser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
