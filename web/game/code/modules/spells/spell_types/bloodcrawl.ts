// From code/modules/spells/spell_types/bloodcrawl.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11382, "/obj/effect/proc_holder/spell/bloodcrawl", "/obj/effect/proc_holder/spell", {
	phased: 0,
	charge_max: 0,
	clothes_req: 0,
	phase_allowed: 1,
	selection_type: "range",
	range: 1,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "bloodcrawl",
	action_background_icon_state: "bg_demon",
	name: "Blood Crawl",
	desc: "Use pools of blood to phase out of existence.",
});

// /obj/effect/proc_holder/spell/bloodcrawl/proc/choose_targets  (code/modules/spells/spell_types/bloodcrawl.dm:17)  may sleep
rt.def("/obj/effect/proc_holder/spell/bloodcrawl/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [user, target, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	target = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "range"), rt.getStep(f, live(user), 0)])), T("/obj/effect/decal/cleanable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		if (truthy((yield* g.callName(f, live(target), "can_bloodcrawl_in", [])))) {
			yield* g.srcCall(f, "perform", live(target));
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "revert_cast");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There must be a nearby source of blood!</span>"]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/bloodcrawl/proc/perform  (code/modules/spells/spell_types/bloodcrawl.dm:25)  may sleep
rt.def("/obj/effect/proc_holder/spell/bloodcrawl/proc/perform", function* perform(f: Frame, target: Value, recharge: Value, user: Value) {
	f.vars = () => [target, recharge, user];
	if (live(recharge) === null) {
		recharge = 1;
	}
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "phased"))) {
			if (truthy((yield* g.callName(f, live(user), "phasein", [live(target)])))) {
				rt.setSv(f, "phased", 0);
			}
		} else {
			if (truthy((yield* g.callName(f, live(user), "phaseout", [live(target)])))) {
				rt.setSv(f, "phased", 1);
			}
		}
		yield* g.srcCall(f, "start_recharge");
		return live(f.dot);
	}
	yield* g.srcCall(f, "revert_cast");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are unable to blood crawl!</span>"]);
	return f.dot;
}, true);
