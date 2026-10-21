// From code/game/objects/items/dehy_carp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9680, "/obj/item/toy/carpplushie/dehy_carp", "/obj/item/toy/carpplushie", {
	owner: null,
	owned: 0,
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/carp"),
});

// /obj/item/toy/carpplushie/dehy_carp/proc/attack_self  (code/game/objects/items/dehy_carp.dm:14)  may sleep
rt.def("/obj/item/toy/carpplushie/dehy_carp/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[0])]);
	if (!truthy(rt.sv(f, "owned"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You pet ＀. You swear it looks up at you.</span>", [live(f.src)])]);
		rt.setSv(f, "owner", live(f.args[0]));
		rt.setSv(f, "owned", 1);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/toy/carpplushie/dehy_carp/proc/Swell  (code/game/objects/items/dehy_carp.dm:22)  may sleep
rt.def("/obj/item/toy/carpplushie/dehy_carp/proc/Swell", function* Swell(f: Frame) {
	let M: Value = null, factions: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [M, factions, F, $e];
	rt.setSv(f, "desc", "It's growing!");
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ swells up!</span>", [live(f.src)]));
	rt.setSv(f, "icon", rt.rsc("icons/mob/animal.dmi"));
	yield* g.call(f, P("/proc/flick"), null, ["carp_swell", live(f.src)]);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	if ((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		return live(f.dot);
	}
	M = (yield* g.new_(f, rt.sv(f, "mobtype"), [rt.getStep(f, live(f.src), 0)]));
	if (truthy(rt.sv(f, "owner"))) {
		factions = (yield* g.callName(f, rt.fv(f, "faction", rt.sv(f, "owner")), "Copy", []));
		F = null;
		rt.forList(f, 0, live(factions));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			if (isEqual(live(F), "neutral")) {
				(factions = rt.modify(live(factions), live(F), subtract));
			}
		}
		rt.endFor(f, 0);
		rt.setFv(f, "faction", live(M), live(factions));
	}
	if ((!truthy(rt.sv(f, "owner")) || !isEqual(rt.fv(f, "faction", rt.sv(f, "owner")), rt.fv(f, "faction", live(M))))) {
		yield* g.srcCall(f, "visible_message", "<span class='warning'>You have a bad feeling about this.</span>");
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>The newly grown ＀ looks up at you with friendly eyes.</span>", [rt.fv(f, "name", live(M))]));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
