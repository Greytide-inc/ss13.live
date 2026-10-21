// From code/modules/spells/spell_types/touch_attacks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11335, "/obj/effect/proc_holder/spell/targeted/touch", "/obj/effect/proc_holder/spell/targeted", {
	hand_path: "/obj/item/weapon/melee/touch_attack",
	attached_hand: null,
	include_user: 1,
	invocation_type: "none",
	range: -1,
});

// /obj/effect/proc_holder/spell/targeted/touch/proc/Click  (code/modules/spells/spell_types/touch_attacks.dm:10)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/Click", function* Click(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = live(f.usr);
	}
	if (truthy(rt.sv(f, "attached_hand"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "attached_hand")]);
		rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
		rt.setSv(f, "attached_hand", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You draw the power out of your hand.</span>"]);
		return 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/effect/proc_holder/spell/targeted/touch/proc/cast  (code/modules/spells/spell_types/touch_attacks.dm:18)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	C = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(rt.sv(f, "attached_hand"))) {
			if (!truthy((yield* g.srcCall(f, "ChargeHand", live(C))))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	while (truthy(rt.sv(f, "attached_hand"))) {
		rt.setSv(f, "charge_counter", 0);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/touch/proc/ChargeHand  (code/modules/spells/spell_types/touch_attacks.dm:27)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/ChargeHand", function* ChargeHand(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "attached_hand", (yield* g.new_(f, rt.sv(f, "hand_path"), [live(f.src)])));
	if (!truthy((yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "attached_hand")])))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "attached_hand")]);
		rt.setSv(f, "charge_counter", rt.sv(f, "charge_max"));
		rt.setSv(f, "attached_hand", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your hands are full!</span>"]);
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You channel the power of the spell to your hand.</span>"]);
	return 1;
}, true);
