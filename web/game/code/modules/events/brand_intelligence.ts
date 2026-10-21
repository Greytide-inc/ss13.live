// From code/modules/events/brand_intelligence.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(292, "/datum/round_event/brand_intelligence", "/datum/round_event", {
	vendingMachines: null,
	infectedMachines: null,
	originMachine: null,
	rampant_speeches: null,
	announceWhen: 21,
	endWhen: 1000,
});

// /datum/round_event/brand_intelligence/proc/<init>  (code/modules/events/brand_intelligence.dm:12)
rt.def("/datum/round_event/brand_intelligence/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "vendingMachines", rt.list());
	$0 = $0;
	rt.setSv(f, "infectedMachines", rt.list());
	rt.setSv(f, "rampant_speeches", rt.list("Try our aggressive new marketing strategies!", "You should buy products to feed your lifestyle obession!", "Consume!", "Your money can buy happiness!", "Engage direct marketing!", "Advertising is legalized lying! But don't let that put you off our great deals!", "You don't want to buy anything? Yeah, well I didn't want to buy your mom either."));
	return f.dot;
});

// /datum/round_event/brand_intelligence/proc/announce  (code/modules/events/brand_intelligence.dm:25)  may sleep
rt.def("/datum/round_event/brand_intelligence/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Rampant brand intelligence has been detected aboard ＀, please stand-by. The origin is believed to be ＇！.", [(yield* g.call(f, P("/proc/station_name"), null, [])), rt.fv(f, "name", rt.sv(f, "originMachine"))]), "Machine Learning Alert"]);
	return f.dot;
}, true);

// /datum/round_event/brand_intelligence/proc/start  (code/modules/events/brand_intelligence.dm:29)
rt.def("/datum/round_event/brand_intelligence/proc/start", function start(f: Frame) {
	let V: Value = null;
	let $e: any;
	f.vars = () => [V, $e];
	V = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/vending"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (!isEqual(rt.fv(f, "z", live(V)), 2)) {
			continue;
		}
		rt.callName(f, rt.sv(f, "vendingMachines"), "Add", [live(V)]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, rt.sv(f, "vendingMachines")))) {
		rt.callSrc(f, "kill", []);
		return live(f.dot);
	}
	rt.setSv(f, "originMachine", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "vendingMachines")]));
	rt.callName(f, rt.sv(f, "vendingMachines"), "Remove", [rt.sv(f, "originMachine")]);
	rt.setFv(f, "shut_up", rt.sv(f, "originMachine"), 0);
	rt.setFv(f, "shoot_inventory", rt.sv(f, "originMachine"), 1);
	return f.dot;
});

// /datum/round_event/brand_intelligence/proc/tick  (code/modules/events/brand_intelligence.dm:43)  may sleep
rt.def("/datum/round_event/brand_intelligence/proc/tick", function* tick(f: Frame) {
	let saved: Value = null, upriser: Value = null, M: Value = null, rebel: Value = null;
	let $e: any;
	f.vars = () => [saved, upriser, M, rebel, $e];
	if ((((!truthy(rt.sv(f, "originMachine")) || (!truthy(rt.sv(f, "originMachine")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "originMachine"))))) || truthy(rt.fv(f, "shut_up", rt.sv(f, "originMachine")))) || truthy((yield* g.callName(f, rt.fv(f, "wires", rt.sv(f, "originMachine")), "is_all_cut", []))))) {
		saved = null;
		rt.forList(f, 0, rt.sv(f, "infectedMachines"), T("/obj/machinery/vending"));
		while (($e = rt.next(f, 0)) !== undefined) {
			saved = $e;
			rt.setFv(f, "shoot_inventory", live(saved), 0);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "originMachine"))) {
			yield* g.callName(f, rt.sv(f, "originMachine"), "speak", ["I am... vanquished. My people will remem...ber...meeee."]);
			yield* g.callName(f, rt.sv(f, "originMachine"), "visible_message", [fmt("＀ beeps and seems lifeless.", [rt.sv(f, "originMachine")])]);
		}
		yield* g.srcCall(f, "kill");
		return live(f.dot);
	}
	rt.setSv(f, "vendingMachines", (yield* g.call(f, P("/proc/removeNullsFromList"), null, [rt.sv(f, "vendingMachines")])));
	if (!truthy(rt.len(f, rt.sv(f, "vendingMachines")))) {
		upriser = null;
		rt.forList(f, 0, rt.sv(f, "infectedMachines"), T("/obj/machinery/vending"));
		while (($e = rt.next(f, 0)) !== undefined) {
			upriser = $e;
			if ((truthy(rt.op(f, "Prob", [], [70])) && !(!truthy(live(upriser)) || truthy(rt.fv(f, "gc_destroyed", live(upriser)))))) {
				rt.setFv(f, "faction", (M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/mimic/copy"), [rt.fv(f, "loc", live(upriser)), live(upriser), null, 1]))), rt.list("profit"));
				rt.setFv(f, "speak", live(M), (yield* g.callName(f, rt.sv(f, "rampant_speeches"), "Copy", [])));
				rt.setFv(f, "speak_chance", live(M), 7);
			} else {
				yield* g.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(upriser)), -1, 1, 2, 4, 0]);
				yield* g.call(f, P("/proc/qdel"), null, [live(upriser)]);
			}
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "kill");
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 4])))) return f.dot;
	rebel = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "vendingMachines")]);
	yield* g.callName(f, rt.sv(f, "vendingMachines"), "Remove", [live(rebel)]);
	yield* g.callName(f, rt.sv(f, "infectedMachines"), "Add", [live(rebel)]);
	rt.setFv(f, "shut_up", live(rebel), 0);
	rt.setFv(f, "shoot_inventory", live(rebel), 1);
	if (!truthy((yield* g.call(f, P("/proc/IsMultiple"), null, [rt.sv(f, "activeFor"), 8])))) return f.dot;
	yield* g.callName(f, rt.sv(f, "originMachine"), "speak", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "rampant_speeches")])]);
	return f.dot;
}, true);
