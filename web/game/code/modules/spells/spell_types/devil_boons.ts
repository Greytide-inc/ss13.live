// From code/modules/spells/spell_types/devil_boons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11308, "/obj/effect/proc_holder/spell/targeted/summon_wealth", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Summon wealth",
	desc: "The reward for selling your soul.",
	invocation_type: "none",
	range: -1,
	clothes_req: 0,
	school: "conjuration",
	charge_max: 100,
	cooldown_min: 10,
	action_icon_state: "moneybag",
});

// /obj/effect/proc_holder/spell/targeted/summon_wealth/proc/cast  (code/modules/spells/spell_types/devil_boons.dm:15)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summon_wealth/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, item: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, item, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	C = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			item = rt.op(f, "PickUnweighted", [8], [(yield* g.new_(f, T("/obj/item/weapon/coin/gold"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/weapon/coin/diamond"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/weapon/coin/silver"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/clothing/accessory/medal/gold"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/gold"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/silver"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/diamond"), [rt.fv(f, "loc", live(user))])), (yield* g.new_(f, T("/obj/item/stack/spacecash/c1000"), [rt.fv(f, "loc", live(user))]))]);
			yield* g.callName(f, live(C), "put_in_hands", [live(item)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11309, "/obj/effect/proc_holder/spell/targeted/view_range", "/obj/effect/proc_holder/spell/targeted", {
	ranges: null,
	include_user: 1,
	name: "Distant vision",
	desc: "The reward for selling your soul.",
	invocation_type: "none",
	range: -1,
	clothes_req: 0,
	charge_max: 50,
	cooldown_min: 10,
	action_icon_state: "camera_jump",
});

// /obj/effect/proc_holder/spell/targeted/view_range/proc/cast  (code/modules/spells/spell_types/devil_boons.dm:41)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/view_range/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	C = null;
	rt.forList(f, 0, live(targets), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (!truthy(rt.fv(f, "client", live(C)))) {
			continue;
		}
		yield* g.callName(f, rt.fv(f, "client", live(C)), "change_view", [(yield* g.op(f, "Prompt", [0], [null, 4, "Range", "Select view range:", rt.sv(f, "ranges")]))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11310, "/obj/effect/proc_holder/spell/targeted/summon_friend", "/obj/effect/proc_holder/spell/targeted", {
	friend: null,
	friendShell: null,
	include_user: 1,
	name: "Summon Friend",
	desc: "The reward for selling your soul.",
	invocation_type: "none",
	range: -1,
	clothes_req: 0,
	charge_max: 50,
	cooldown_min: 10,
	action_icon_state: "sacredflame",
});

// /obj/effect/proc_holder/spell/targeted/summon_friend/proc/cast  (code/modules/spells/spell_types/devil_boons.dm:60)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/summon_friend/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [targets, user, C, L, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!(!truthy(rt.sv(f, "friend")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "friend"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "friend"), "<span class='userdanger'>Your master has deemed you a poor friend.  Your durance in hell will now resume.</span>"]);
		yield* g.callName(f, rt.sv(f, "friend"), "dust", [1]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "friendShell")]);
		return live(f.dot);
	}
	if (!(!truthy(rt.sv(f, "friendShell")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "friendShell"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "friendShell")]);
		return live(f.dot);
	}
	C = null;
	rt.forList(f, 0, live(targets));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		rt.setSv(f, "friendShell", (yield* g.new_(f, T("/obj/effect/mob_spawn/human/demonic_friend"), [rt.gv(f, "loc", (L = live(C))), rt.fv(f, "mind", live(L)), live(f.src)])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
