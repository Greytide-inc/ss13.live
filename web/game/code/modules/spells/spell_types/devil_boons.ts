// Based on /tg/station's code/modules/spells/spell_types/devil_boons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


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

// devil_boons.dm:15
rt.def("/obj/effect/proc_holder/spell/targeted/summon_wealth/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, item: Value = null;
	user ??= f.usr;
	for (C of each(targets, T("/mob/living/carbon"))) {
		if (yield* user.drop_item()) {
			item = pick((yield* new_(T("/obj/item/weapon/coin/gold"), user.loc)), (yield* new_(T("/obj/item/weapon/coin/diamond"), user.loc)), (yield* new_(T("/obj/item/weapon/coin/silver"), user.loc)), (yield* new_(T("/obj/item/clothing/accessory/medal/gold"), user.loc)), (yield* new_(T("/obj/item/stack/sheet/mineral/gold"), user.loc)), (yield* new_(T("/obj/item/stack/sheet/mineral/silver"), user.loc)), (yield* new_(T("/obj/item/stack/sheet/mineral/diamond"), user.loc)), (yield* new_(T("/obj/item/stack/spacecash/c1000"), user.loc)));
			yield* C.put_in_hands(item);
		}
	}
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

// devil_boons.dm:41
rt.def("/obj/effect/proc_holder/spell/targeted/view_range/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	user ??= f.usr;
	for (C of each(targets, T("/mob"))) {
		if (!C.client) {
			continue;
		}
		yield* C.client.change_view((yield* g.op(f, "Prompt", [0], [null, 4, "Range", "Select view range:", this.ranges])));
	}
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

// devil_boons.dm:60
rt.def("/obj/effect/proc_holder/spell/targeted/summon_friend/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, L: Value = null;
	user ??= f.usr;
	if (!(!this.friend || this.friend.gc_destroyed)) {
		to_chat(this.friend, "<span class='userdanger'>Your master has deemed you a poor friend.  Your durance in hell will now resume.</span>");
		yield* this.friend.dust(1);
		yield* qdel(this.friendShell);
		return f.dot;
	}
	if (!(!this.friendShell || this.friendShell.gc_destroyed)) {
		yield* qdel(this.friendShell);
		return f.dot;
	}
	for (C of each(targets)) {
		this.friendShell = (yield* new_(T("/obj/effect/mob_spawn/human/demonic_friend"), (L = C).loc, L.mind, this));
	}
	return f.dot;
}, true);
