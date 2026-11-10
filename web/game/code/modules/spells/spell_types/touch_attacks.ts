// Based on /tg/station's code/modules/spells/spell_types/touch_attacks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11335, "/obj/effect/proc_holder/spell/targeted/touch", "/obj/effect/proc_holder/spell/targeted", {
	hand_path: "/obj/item/weapon/melee/touch_attack",
	attached_hand: null,
	include_user: 1,
	invocation_type: "none",
	range: -1,
});

// touch_attacks.dm:10
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/Click", function* Click(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = f.usr;
	}
	if (this.attached_hand) {
		yield* qdel(this.attached_hand);
		this.charge_counter = this.charge_max;
		this.attached_hand = null;
		to_chat(f.args[0], "<span class='notice'>You draw the power out of your hand.</span>");
		return 0;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["user"] });

// touch_attacks.dm:18
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null;
	user ??= f.usr;
	for (C of each(targets, T("/mob/living/carbon"))) {
		if (!this.attached_hand) {
			if (!(yield* this.ChargeHand(C))) {
				return 0;
			}
		}
	}
	while (this.attached_hand) {
		this.charge_counter = 0;
		yield* sleep(1);
	}
	return f.dot;
}, true);

// touch_attacks.dm:27
rt.def("/obj/effect/proc_holder/spell/targeted/touch/proc/ChargeHand", function* ChargeHand(f: Frame, user: Value) {
	this.attached_hand = (yield* new_(this.hand_path, this));
	if (!(yield* user.put_in_hands(this.attached_hand))) {
		yield* qdel(this.attached_hand);
		this.charge_counter = this.charge_max;
		this.attached_hand = null;
		to_chat(user, "<span class='warning'>Your hands are full!</span>");
		return 0;
	}
	to_chat(user, "<span class='notice'>You channel the power of the spell to your hand.</span>");
	return 1;
}, true);
