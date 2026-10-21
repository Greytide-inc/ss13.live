// From code/modules/modular_computers/computers/item/computer_damage.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/item/device/modular_computer/proc/take_damage  (code/modules/modular_computers/computers/item/computer_damage.dm:2)  may sleep
rt.def("/obj/item/device/modular_computer/proc/take_damage", function* take_damage(f: Frame) {
	let component_probability: Value = null, I: Value = null, H: Value = null;
	let $0: any, $e: any;
	f.vars = () => [component_probability, I, H, $0, $e];
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
	component_probability = (yield* g.call(f, P("/proc/min"), null, [50, (yield* g.call(f, P("/proc/max"), null, [multiply(live(f.args[0]), 0.10000000149011612), subtract(1, divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")))]))]));
	$0 = live(f.args[2]);
	if ($0 === "bullet") {
		component_probability = multiply(live(f.args[0]), 0.5);
	} else if ($0 === "laser") {
		component_probability = multiply(live(f.args[0]), 0.6600000262260437);
	}
	if (!truthy(live(component_probability))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "all_components"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		H = rt.index(rt.sv(f, "all_components"), live(I));
		if (truthy(rt.op(f, "Prob", [], [live(component_probability)]))) {
			yield* g.callName(f, live(H), "take_damage", [(yield* g.call(f, P("/proc/round"), null, [multiply(live(f.args[0]), 0.5)])), live(f.args[1]), live(f.args[2]), 0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/item/device/modular_computer/proc/deconstruct  (code/modules/modular_computers/computers/item/computer_damage.dm:17)  may sleep
rt.def("/obj/item/device/modular_computer/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.srcCall(f, "break_apart");
	return f.dot;
}, true);

// /obj/item/device/modular_computer/proc/break_apart  (code/modules/modular_computers/computers/item/computer_damage.dm:20)  may sleep
rt.def("/obj/item/device/modular_computer/proc/break_apart", function* break_apart(f: Frame) {
	let newloc: Value = null, C: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [newloc, C, H, $e];
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.callName(f, rt.sv(f, "physical"), "visible_message", [fmt("＄！ breaks apart!", [live(f.src)])]);
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [(newloc = rt.getStep(f, live(f.src), 0)), (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "steel_sheet_cost"), 2)]))]);
		C = null;
		rt.forList(f, 0, rt.sv(f, "all_components"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			yield* g.srcCall(f, "uninstall_component", (H = rt.index(rt.sv(f, "all_components"), live(C))));
			yield* g.callName(f, live(H), "forceMove", [live(newloc)]);
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				yield* g.callName(f, live(H), "take_damage", [(yield* g.call(f, P("/proc/rand"), null, [10, 30])), "brute", 0, 0]);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "relay_qdel");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
