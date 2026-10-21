// From code/modules/power/gravitygenerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalgravity_generators  (code/modules/power/gravitygenerator.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobalgravity_generators", function InitGlobalgravity_generators(f: Frame) {
	rt.setGl("gravity_generators", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "gravity_generators", add);
	return f.dot;
});

rt.type(10634, "/obj/machinery/gravity_generator", "/obj/machinery", {
	sprite_number: 0,
	anchored: 1,
	name: "gravitational generator",
	desc: "A device which produces a graviton field when set up.",
	icon: rt.rsc("icons/obj/machines/gravity_generator.dmi"),
	density: 1,
	use_power: 0,
	resistance_flags: 115,
});

// /obj/machinery/gravity_generator/proc/ex_act  (code/modules/power/gravitygenerator.dm:35)  may sleep
rt.def("/obj/machinery/gravity_generator/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	if (!isEqual(live(severity), 1)) return f.dot;
	yield* g.srcCall(f, "set_broken");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/gravity_generator/proc/blob_act  (code/modules/power/gravitygenerator.dm:39)  may sleep
rt.def("/obj/machinery/gravity_generator/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!truthy(rt.op(f, "Prob", [], [20]))) return f.dot;
	yield* g.srcCall(f, "set_broken");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/proc/tesla_act  (code/modules/power/gravitygenerator.dm:43)  may sleep
rt.def("/obj/machinery/gravity_generator/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["power", "explosive"] });

// /obj/machinery/gravity_generator/proc/update_icon  (code/modules/power/gravitygenerator.dm:48)
rt.def("/obj/machinery/gravity_generator/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀_＀", [rt.callSrc(f, "get_status", []), rt.sv(f, "sprite_number")]));
	return f.dot;
});

// /obj/machinery/gravity_generator/proc/get_status  (code/modules/power/gravitygenerator.dm:56)
rt.def("/obj/machinery/gravity_generator/proc/get_status", function get_status(f: Frame) {
	return "off";
});

// /obj/machinery/gravity_generator/proc/Move  (code/modules/power/gravitygenerator.dm:60)  may sleep
rt.def("/obj/machinery/gravity_generator/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/proc/set_broken  (code/modules/power/gravitygenerator.dm:64)
rt.def("/obj/machinery/gravity_generator/proc/set_broken", function set_broken(f: Frame) {
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// /obj/machinery/gravity_generator/proc/set_fix  (code/modules/power/gravitygenerator.dm:67)
rt.def("/obj/machinery/gravity_generator/proc/set_fix", function set_fix(f: Frame) {
	(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
	return f.dot;
});

rt.type(10635, "/obj/machinery/gravity_generator/part", "/obj/machinery/gravity_generator", {
	main_part: null,
});

// /obj/machinery/gravity_generator/part/proc/Destroy  (code/modules/power/gravitygenerator.dm:71)  may sleep
rt.def("/obj/machinery/gravity_generator/part/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "main_part"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "main_part")]);
	}
	yield* g.srcCall(f, "set_broken");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/gravity_generator/part/proc/attackby  (code/modules/power/gravitygenerator.dm:83)  may sleep
rt.def("/obj/machinery/gravity_generator/part/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	return (yield* g.callName(f, rt.sv(f, "main_part"), "attackby", [live(I), live(user)]));
}, true);

// /obj/machinery/gravity_generator/part/proc/get_status  (code/modules/power/gravitygenerator.dm:86)
rt.def("/obj/machinery/gravity_generator/part/proc/get_status", function get_status(f: Frame) {
	return rt.callName(f, rt.sv(f, "main_part"), "get_status", []);
});

// /obj/machinery/gravity_generator/part/proc/attack_hand  (code/modules/power/gravitygenerator.dm:89)  may sleep
rt.def("/obj/machinery/gravity_generator/part/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.callName(f, rt.sv(f, "main_part"), "attack_hand", [live(user)]));
}, true);

// /obj/machinery/gravity_generator/part/proc/set_broken  (code/modules/power/gravitygenerator.dm:92)  may sleep
rt.def("/obj/machinery/gravity_generator/part/proc/set_broken", function* set_broken(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "main_part")) && !truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "main_part")), 1)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "main_part"), "set_broken", []);
	return f.dot;
}, true);

rt.type(10637, "/obj/machinery/gravity_generator/main/station", "/obj/machinery/gravity_generator/main", {});

// /obj/machinery/gravity_generator/main/station/proc/Initialize  (code/modules/power/gravitygenerator.dm:101)  may sleep
rt.def("/obj/machinery/gravity_generator/main/station/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "setup_parts");
	yield* g.callName(f, rt.sv(f, "middle"), "add_overlay", ["activated"]);
	yield* g.srcCall(f, "update_list");
	return f.dot;
}, true);

rt.type(10636, "/obj/machinery/gravity_generator/main", "/obj/machinery/gravity_generator", {
	on: 1,
	breaker: 1,
	parts: null,
	middle: null,
	charging_state: 0,
	charge_count: 100,
	current_overlay: null,
	broken_state: 0,
	sprite_number: 8,
	icon_state: "on_8",
	idle_power_usage: 0,
	active_power_usage: 3000,
	power_channel: 3,
	use_power: 1,
	interact_offline: 1,
});

// /obj/machinery/gravity_generator/main/proc/<init>  (code/modules/power/gravitygenerator.dm:126)
rt.def("/obj/machinery/gravity_generator/main/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "parts", rt.list());
	return f.dot;
});

// /obj/machinery/gravity_generator/main/proc/Destroy  (code/modules/power/gravitygenerator.dm:134)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/Destroy", function* Destroy(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	yield* g.srcCall(f, "investigate_log", "was destroyed!", "gravity");
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "update_list");
	O = null;
	rt.forList(f, 0, rt.sv(f, "parts"), T("/obj/machinery/gravity_generator/part"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "main_part", live(O), null);
		if (!(!truthy(live(O)) || isEqual(rt.fv(f, "gc_destroyed", live(O)), -3))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/gravity_generator/main/proc/setup_parts  (code/modules/power/gravitygenerator.dm:144)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/setup_parts", function* setup_parts(f: Frame) {
	let our_turf: Value = null, spawn_turfs: Value = null, count: Value = null, _T: Value = null, part: Value = null;
	let $e: any;
	f.vars = () => [our_turf, spawn_turfs, count, _T, part, $e];
	our_turf = rt.getStep(f, live(f.src), 0);
	spawn_turfs = (yield* g.call(f, P("/proc/block"), null, [rt.locate(subtract(rt.fv(f, "x", live(our_turf)), 1), add(rt.fv(f, "y", live(our_turf)), 2), rt.fv(f, "z", live(our_turf))), rt.locate(add(rt.fv(f, "x", live(our_turf)), 1), rt.fv(f, "y", live(our_turf)), rt.fv(f, "z", live(our_turf)))]));
	count = 10;
	_T = null;
	rt.forList(f, 0, live(spawn_turfs), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		count = rt.inc(live(count), -1);
		if (isEqual(live(_T), live(our_turf))) {
			continue;
		}
		part = (yield* g.new_(f, T("/obj/machinery/gravity_generator/part"), [live(_T)]));
		if (isEqual(live(count), 5)) {
			rt.setSv(f, "middle", live(part));
		}
		if (rt.le(live(count), 3)) {
			rt.setFv(f, "density", live(part), 0);
			rt.setFv(f, "layer", live(part), 4.25);
		}
		rt.setFv(f, "sprite_number", live(part), live(count));
		rt.setFv(f, "main_part", live(part), live(f.src));
		rt.modSrcVar(f, "parts", live(part), add);
		yield* g.callName(f, live(part), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/connected_parts  (code/modules/power/gravitygenerator.dm:164)
rt.def("/obj/machinery/gravity_generator/main/proc/connected_parts", function connected_parts(f: Frame) {
	return (isEqual(rt.len(f, rt.sv(f, "parts")), 8) ? 1 : 0);
});

// /obj/machinery/gravity_generator/main/proc/set_broken  (code/modules/power/gravitygenerator.dm:167)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/set_broken", function* set_broken(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, rt.sv(f, "parts"), T("/obj/machinery/gravity_generator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "stat", live(M)), 1))) {
			yield* g.callName(f, live(M), "set_broken", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "middle"), "cut_overlays", []);
	rt.setSv(f, "charge_count", 0);
	rt.setSv(f, "breaker", 0);
	yield* g.srcCall(f, "set_power");
	yield* g.srcCall(f, "set_state", 0);
	yield* g.srcCall(f, "investigate_log", "has broken down.", "gravity");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/set_fix  (code/modules/power/gravitygenerator.dm:179)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/set_fix", function* set_fix(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, rt.sv(f, "parts"), T("/obj/machinery/gravity_generator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "stat", live(M)), 1))) {
			yield* g.callName(f, live(M), "set_fix", []);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "broken_state", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "set_power");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/attackby  (code/modules/power/gravitygenerator.dm:191)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, PS: Value = null;
	let $0: any;
	f.vars = () => [WT, PS, $0];
	$0 = rt.sv(f, "broken_state");
	if ($0 === 0) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the screws of the framework.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			rt.incSrcVar(f, "broken_state", 1, true);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	} else if ($0 === 1) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [1, live(f.args[1])])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You mend the damaged framework.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
				rt.incSrcVar(f, "broken_state", 1, true);
				yield* g.srcCall(f, "update_icon");
			} else {
				if (truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You don't have enough fuel to mend the damaged framework!</span>"]);
				}
			}
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/plasteel")) ? 1 : 0))) {
			if (rt.ge((yield* g.callName(f, (PS = live(f.args[0])), "get_amount", [])), 10)) {
				yield* g.callName(f, live(PS), "use", [10]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the plating to the framework.</span>"]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 75, 1]);
				rt.incSrcVar(f, "broken_state", 1, true);
				yield* g.srcCall(f, "update_icon");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need 10 sheets of plasteel!</span>"]);
			}
			return live(f.dot);
		}
	} else if ($0 === 3) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the plating to the framework.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 75, 1]);
			yield* g.srcCall(f, "set_fix");
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/gravity_generator/main/proc/attack_hand  (code/modules/power/gravitygenerator.dm:232)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	return (yield* g.srcCall(f, "interact", live(f.args[0])));
}, true, { args: ["user"] });

// /obj/machinery/gravity_generator/main/proc/interact  (code/modules/power/gravitygenerator.dm:236)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let $0: any;
	f.vars = () => [user, dat, popup, $0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	dat = "Gravity Generator Breaker: ";
	if (truthy(rt.sv(f, "breaker"))) {
		dat = rt.modify(live(dat), fmt("<span class='linkOn'>ON</span> <A href='?src=＃;gentoggle=1'>OFF</A>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;gentoggle=1'>ON</A> <span class='linkOn'>OFF</span> ", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), "<br>Generator Status:<br><div class='statusDisplay'>", add);
	if (!isEqual(rt.sv(f, "charging_state"), 0)) {
		if (isEqual(rt.sv(f, "charging_state"), 1)) {
			$0 = "Charging...";
		} else {
			$0 = "Discharging...";
		}
		dat = rt.modify(live(dat), fmt("<font class='bad'>WARNING</font> Radiation Detected. <br>＀", [$0]), add);
	} else {
		if (truthy(rt.sv(f, "on"))) {
			dat = rt.modify(live(dat), "Powered.", add);
		} else {
			dat = rt.modify(live(dat), "Unpowered.", add);
		}
	}
	dat = rt.modify(live(dat), fmt("<br>Gravity Charge: ＀%</div>", [rt.sv(f, "charge_count")]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "gravgen", rt.sv(f, "name")]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/Topic  (code/modules/power/gravitygenerator.dm:261)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.at(live(f.args[1]), "gentoggle"))) return f.dot;
	rt.setSv(f, "breaker", (!truthy(rt.sv(f, "breaker")) ? 1 : 0));
	if (truthy(rt.sv(f, "breaker"))) {
		$0 = "<font color='green'>ON</font>";
	} else {
		$0 = "<font color='red'>OFF</font>";
	}
	yield* g.srcCall(f, "investigate_log", fmt("was toggled ＀ by ＀.", [$0, rt.fv(f, "key", live(f.usr))]), "gravity");
	yield* g.srcCall(f, "set_power");
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/gravity_generator/main/proc/power_change  (code/modules/power/gravitygenerator.dm:273)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/power_change", function* power_change(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		$0 = "lost";
	} else {
		$0 = "regained";
	}
	yield* g.srcCall(f, "investigate_log", fmt("has ＀ power.", [$0]), "gravity");
	yield* g.srcCall(f, "set_power");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/get_status  (code/modules/power/gravitygenerator.dm:278)
rt.def("/obj/machinery/gravity_generator/main/proc/get_status", function get_status(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return fmt("fix＀", [rt.call(f, P("/proc/min"), null, [rt.sv(f, "broken_state"), 3])]);
	}
	if ((truthy(rt.sv(f, "on")) || !isEqual(rt.sv(f, "charging_state"), 0))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	return $0;
});

// /obj/machinery/gravity_generator/main/proc/update_icon  (code/modules/power/gravitygenerator.dm:283)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/update_icon", function* update_icon(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	O = null;
	rt.forList(f, 0, rt.sv(f, "parts"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/set_power  (code/modules/power/gravitygenerator.dm:290)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/set_power", function* set_power(f: Frame) {
	let new_state: Value = null;
	let $0: any;
	f.vars = () => [new_state, $0];
	new_state = 0;
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "breaker")))) {
		new_state = 0;
	} else {
		if (truthy(rt.sv(f, "breaker"))) {
			new_state = 1;
		}
	}
	if (truthy(live(new_state))) {
		$0 = 1;
	} else {
		$0 = 2;
	}
	rt.setSv(f, "charging_state", $0);
	if (isEqual(rt.sv(f, "charging_state"), 1)) {
		$0 = "charging";
	} else {
		$0 = "discharging";
	}
	yield* g.srcCall(f, "investigate_log", fmt("is now ＀.", [$0]), "gravity");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/set_state  (code/modules/power/gravitygenerator.dm:302)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/set_state", function* set_state(f: Frame, new_state: Value) {
	let alert: Value = null, A: Value = null;
	let $0: any, $1: any;
	f.vars = () => [new_state, alert, A, $0, $1];
	rt.setSv(f, "charging_state", 0);
	rt.setSv(f, "on", live(new_state));
	if (truthy(rt.sv(f, "on"))) {
		$0 = 2;
	} else {
		$0 = 1;
	}
	rt.setSv(f, "use_power", $0);
	alert = 0;
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]));
	if (truthy((yield* g.callName(f, rt.gl("SSticker"), "IsRoundInProgress", [])))) {
		if (truthy(rt.sv(f, "on"))) {
			if (isEqual((yield* g.srcCall(f, "gravity_in_level")), 0)) {
				alert = 1;
				yield* g.srcCall(f, "investigate_log", "was brought online and is now producing gravity for this level.", "gravity");
				$0 = live(A);
				if (truthy(live(f.src))) {
					$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
				} else {
					$1 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("The gravity generator was brought online ＀＀", [$0, fmt("＀", [$1])])]);
			}
		} else {
			if (isEqual((yield* g.srcCall(f, "gravity_in_level")), 1)) {
				alert = 1;
				yield* g.srcCall(f, "investigate_log", "was brought offline and there is now no gravity for this level.", "gravity");
				$0 = live(A);
				if (truthy(live(f.src))) {
					$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])]);
				} else {
					$1 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("The gravity generator was brought offline with no backup generator. ＀＀", [$0, fmt("＀", [$1])])]);
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "update_list");
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	if (!truthy(live(alert))) return f.dot;
	yield* g.srcCall(f, "shake_everyone");
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/process  (code/modules/power/gravitygenerator.dm:328)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/process", function* process(f: Frame) {
	let overlay_state: Value = null;
	let $0: any;
	f.vars = () => [overlay_state, $0];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "charging_state"), 0)) return f.dot;
	if ((isEqual(rt.sv(f, "charging_state"), 1) && rt.ge(rt.sv(f, "charge_count"), 100))) {
		yield* g.srcCall(f, "set_state", 1);
	} else {
		if ((isEqual(rt.sv(f, "charging_state"), 2) && rt.le(rt.sv(f, "charge_count"), 0))) {
			yield* g.srcCall(f, "set_state", 0);
		} else {
			if (isEqual(rt.sv(f, "charging_state"), 1)) {
				rt.modSrcVar(f, "charge_count", 2, add);
			} else {
				if (isEqual(rt.sv(f, "charging_state"), 2)) {
					(rt.modSrcVar(f, "charge_count", 2, subtract));
				}
			}
			if ((isEqual(rt.modulus(rt.sv(f, "charge_count"), 4), 0) && truthy(rt.op(f, "Prob", [], [75])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/empulse.ogg"), 100, 1]);
			}
			yield* g.srcCall(f, "updateDialog");
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				yield* g.srcCall(f, "pulse_radiation");
			}
			overlay_state = null;
			$0 = rt.sv(f, "charge_count");
			if (rt.inRange($0, 0, 20)) {
				overlay_state = null;
			} else if (rt.inRange($0, 21, 40)) {
				overlay_state = "startup";
			} else if (rt.inRange($0, 41, 60)) {
				overlay_state = "idle";
			} else if (rt.inRange($0, 61, 80)) {
				overlay_state = "activating";
			} else if (rt.inRange($0, 81, 100)) {
				overlay_state = "activated";
			}
			if (isEqual(live(overlay_state), rt.sv(f, "current_overlay"))) return f.dot;
			if (!truthy(rt.sv(f, "middle"))) return f.dot;
			yield* g.callName(f, rt.sv(f, "middle"), "cut_overlays", []);
			if (truthy(live(overlay_state))) {
				yield* g.callName(f, rt.sv(f, "middle"), "add_overlay", [live(overlay_state)]);
			}
			rt.setSv(f, "current_overlay", live(overlay_state));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/gravity_generator/main/proc/pulse_radiation  (code/modules/power/gravitygenerator.dm:370)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/pulse_radiation", function* pulse_radiation(f: Frame) {
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 3, 7, 20]);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/shake_everyone  (code/modules/power/gravitygenerator.dm:374)  may sleep
rt.def("/obj/machinery/gravity_generator/main/proc/shake_everyone", function* shake_everyone(f: Frame) {
	let _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, M, $e];
	_T = rt.getStep(f, live(f.src), 0);
	M = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!isEqual(rt.fv(f, "z", live(M)), rt.sv(f, "z"))) {
			continue;
		}
		yield* g.callName(f, live(M), "update_gravity", [(yield* g.callName(f, live(M), "mob_has_gravity", []))]);
		if (truthy(rt.fv(f, "client", live(M)))) {
			yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 15, 1]);
			yield* g.callName(f, live(M), "playsound_local", [live(_T), rt.rsc("sound/effects/alert.ogg"), 100, 1, 0.5]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/gravity_generator/main/proc/gravity_in_level  (code/modules/power/gravitygenerator.dm:384)
rt.def("/obj/machinery/gravity_generator/main/proc/gravity_in_level", function gravity_in_level(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return 0;
	}
	if (truthy(rt.index(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))])))) {
		return rt.length(rt.index(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))])));
	}
	return 0;
});

// /obj/machinery/gravity_generator/main/proc/update_list  (code/modules/power/gravitygenerator.dm:392)
rt.def("/obj/machinery/gravity_generator/main/proc/update_list", function update_list(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)))) return f.dot;
	if (!truthy(rt.index(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))])))) {
		rt.setAt(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))]), rt.list());
	}
	if (truthy(rt.sv(f, "on"))) {
		(rt.modAt(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))]), live(f.src), rt.bitOr));
	} else {
		(rt.modAt(rt.gl("gravity_generators"), fmt("＀", [rt.fv(f, "z", live(_T))]), live(f.src), subtract));
	}
	return f.dot;
});
