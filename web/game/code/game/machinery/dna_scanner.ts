// From code/game/machinery/dna_scanner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10787, "/obj/machinery/dna_scannernew", "/obj/machinery", {
	locked: 0,
	damage_coeff: null,
	scan_level: null,
	precision_coeff: null,
	anchored: 1,
	name: "１DNA scanner",
	desc: "It scans DNA structures.",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "scanner",
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	active_power_usage: 300,
	occupant_typecache: null,
});

// /obj/machinery/dna_scannernew/proc/<init>  (code/game/machinery/dna_scanner.dm:12)
rt.def("/obj/machinery/dna_scannernew/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "occupant_typecache", rt.list(T("/mob/living"), T("/obj/item/bodypart/head"), T("/obj/item/organ/brain")));
	return f.dot;
});

// /obj/machinery/dna_scannernew/proc/New  (code/game/machinery/dna_scanner.dm:18)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/clonescanner"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6720, "/obj/item/weapon/circuitboard/machine/clonescanner", "/obj/item/weapon/circuitboard/machine", {
	name: "Cloning Scanner (Machine Board)",
	build_path: rt.typePath("/obj/machinery/dna_scannernew"),
	origin_tech: "programming=2;biotech=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/clonescanner/proc/<init>  (code/game/machinery/dna_scanner.dm:26)
rt.def("/obj/item/weapon/circuitboard/machine/clonescanner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/stack/sheet/glass"), 1, T("/obj/item/stack/cable_coil"), 2]));
	return f.dot;
});

// /obj/machinery/dna_scannernew/proc/RefreshParts  (code/game/machinery/dna_scanner.dm:37)
rt.def("/obj/machinery/dna_scannernew/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	rt.setSv(f, "scan_level", 0);
	rt.setSv(f, "damage_coeff", 0);
	rt.setSv(f, "precision_coeff", 0);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/scanning_module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.modSrcVar(f, "scan_level", rt.fv(f, "rating", live(_P)), add);
	}
	rt.endFor(f, 0);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.setSv(f, "precision_coeff", rt.fv(f, "rating", live(_P)));
	}
	rt.endFor(f, 0);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.setSv(f, "damage_coeff", rt.fv(f, "rating", live(_P)));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/dna_scannernew/proc/update_icon  (code/game/machinery/dna_scanner.dm:47)
rt.def("/obj/machinery/dna_scannernew/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		$0 = rt.initial(f, live(f.src), "icon_state");
		if (truthy(rt.sv(f, "state_open"))) {
			$1 = "_open";
		} else {
			$1 = "";
		}
		rt.setSv(f, "icon_state", add(add($0, $1), "_unpowered"));
		return live(f.dot);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 8)) || truthy(rt.sv(f, "panel_open")))) {
		$0 = rt.initial(f, live(f.src), "icon_state");
		if (truthy(rt.sv(f, "state_open"))) {
			$1 = "_open";
		} else {
			$1 = "";
		}
		rt.setSv(f, "icon_state", add(add($0, $1), "_maintenance"));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "occupant"))) {
		rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "_occupied"));
		return live(f.dot);
	}
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "state_open"))) {
		$1 = "_open";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", add($0, $1));
	return f.dot;
});

// /obj/machinery/dna_scannernew/proc/power_change  (code/game/machinery/dna_scanner.dm:64)
rt.def("/obj/machinery/dna_scannernew/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/dna_scannernew/proc/toggle_open  (code/game/machinery/dna_scanner.dm:69)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/toggle_open", function* toggle_open(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "panel_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Close the maintenance panel first.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "state_open"))) {
		yield* g.srcCall(f, "close_machine");
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "locked"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The bolts are locked down, securing the door shut.</span>"]);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/dna_scannernew/proc/container_resist  (code/game/machinery/dna_scanner.dm:84)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	let breakout_time: Value = null;
	f.vars = () => [user, breakout_time];
	breakout_time = 2;
	if ((truthy(rt.sv(f, "state_open")) || !truthy(rt.sv(f, "locked")))) {
		rt.setSv(f, "state_open", 1);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing the door open... (this will take about ＀ minutes.)</span>", [live(f.src), live(breakout_time)])]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='italics'>You hear a metallic creaking from ＀!</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(multiply(live(breakout_time), 60), 10), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || truthy(rt.sv(f, "state_open"))) || !truthy(rt.sv(f, "locked")))) {
		return live(f.dot);
	}
	rt.setSv(f, "locked", 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ successfully broke out of ＀!</span>", [live(user), live(f.src)]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully break out of ＀!</span>", [live(f.src)])]);
	yield* g.srcCall(f, "open_machine");
	return f.dot;
}, true);

// /obj/machinery/dna_scannernew/proc/locate_computer  (code/game/machinery/dna_scanner.dm:103)
rt.def("/obj/machinery/dna_scannernew/proc/locate_computer", function locate_computer(f: Frame, type_: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		if (truthy((C = rt.locateIn(f, live(type_), rt.getStep(f, live(f.src), rt.sv(f, "dir")))))) {
			return live(C);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/machinery/dna_scannernew/proc/close_machine  (code/game/machinery/dna_scanner.dm:110)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/close_machine", function* close_machine(f: Frame) {
	let mob_occupant: Value = null, console: Value = null;
	f.vars = () => [mob_occupant, console];
	if (!truthy(rt.sv(f, "state_open"))) {
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype((mob_occupant = (yield* g.call(f, P("/proc/get_mob_or_brainmob"), null, [rt.sv(f, "occupant")]))), T("/mob/living")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "locate_computer", T("/obj/machinery/computer/cloning"))))) {
			if (((!truthy(rt.fv(f, "suiciding", live(mob_occupant))) && !truthy(rt.bitAnd(rt.fv(f, "disabilities", live(mob_occupant)), 128))) && !truthy(rt.fv(f, "hellbound", live(mob_occupant))))) {
				yield* g.callName(f, live(mob_occupant), "notify_ghost_cloning", [null, "Your corpse has been placed into a cloning scanner. Re-enter your corpse if you want to be cloned!", "source", live(f.src)], rt.Args.Named);
			}
		}
	}
	if (truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living")) ? 1 : 0))) {
		if (truthy((console = (yield* g.srcCall(f, "locate_computer", T("/obj/machinery/computer/scan_consolenew")))))) {
			yield* g.callName(f, live(console), "on_scanner_close", []);
		}
	}
	return 1;
}, true);

// /obj/machinery/dna_scannernew/proc/open_machine  (code/game/machinery/dna_scanner.dm:134)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/open_machine", function* open_machine(f: Frame) {
	if (truthy(rt.sv(f, "state_open"))) {
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /obj/machinery/dna_scannernew/proc/relaymove  (code/game/machinery/dna_scanner.dm:139)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.sv(f, "locked")))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "open_machine");
	return live(f.dot);
}, true);

// /obj/machinery/dna_scannernew/proc/attackby  (code/game/machinery/dna_scanner.dm:147)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(rt.sv(f, "occupant")) && truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), rt.sv(f, "icon_state"), rt.sv(f, "icon_state"), live(f.args[0])))))) {
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_pry_open", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/dna_scannernew/proc/attack_hand  (code/game/machinery/dna_scanner.dm:163)  may sleep
rt.def("/obj/machinery/dna_scannernew/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.callSuper(f, [live(user), 1, 0])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "toggle_open", live(user));
	return f.dot;
}, true);
