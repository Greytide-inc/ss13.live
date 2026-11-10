// Based on /tg/station's code/game/objects/structures/target_stake.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12880, "/obj/structure/target_stake", "/obj/structure", {
	pinned_target: null,
	flags: 64,
	name: "target stake",
	desc: "A thin platform with negatively-magnetized wheels.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "target_stake",
	density: 1,
});

// target_stake.dm:12
rt.def("/obj/structure/target_stake/proc/Destroy", function* Destroy(f: Frame) {
	if (this.pinned_target) {
		this.pinned_target.nullPinnedLoc();
	}
	return (yield* parent_proc());
}, true);

// target_stake.dm:16
rt.def("/obj/structure/target_stake/proc/nullPinnedTarget", function nullPinnedTarget(f: Frame) {
	this.pinned_target = null;
	return f.dot;
});

// target_stake.dm:19
rt.def("/obj/structure/target_stake/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (!this.pinned_target) return f.dot;
	this.pinned_target.loc = this.loc;
	return f.dot;
}, true);

// target_stake.dm:26
rt.def("/obj/structure/target_stake/proc/attackby", function* attackby(f: Frame, _T: Value, user: Value) {
	if (this.pinned_target) {
		return f.dot;
	}
	if (!(rt.istype(_T, T("/obj/item/target")) && (yield* user.drop_item()))) return f.dot;
	this.pinned_target = _T;
	_T.pinnedLoc = this;
	_T.density = 1;
	_T.layer = 3.01;
	_T.loc = this.loc;
	to_chat(user, "<span class='notice'>You slide the target into the stake.</span>");
	return f.dot;
}, true);

// target_stake.dm:36
rt.def("/obj/structure/target_stake/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.pinned_target) return f.dot;
	yield* this.removeTarget(user);
	return f.dot;
}, true);

// target_stake.dm:39
rt.def("/obj/structure/target_stake/proc/removeTarget", function* removeTarget(f: Frame, user: Value) {
	this.pinned_target.layer = 3;
	this.pinned_target.loc = user.loc;
	this.pinned_target.nullPinnedLoc();
	this.nullPinnedTarget();
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (!user.get_active_held_item()) {
			yield* user.put_in_hands(this.pinned_target);
			to_chat(user, "<span class='notice'>You take the target out of the stake.</span>");
		}
	} else {
		this.pinned_target.loc = rt.getStep(f, user, 0);
		to_chat(user, "<span class='notice'>You take the target out of the stake.</span>");
	}
	return f.dot;
}, true);

// target_stake.dm:53
rt.def("/obj/structure/target_stake/proc/bullet_act", function* bullet_act(f: Frame, P: Value) {
	if (this.pinned_target) {
		yield* this.pinned_target.bullet_act(P);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
