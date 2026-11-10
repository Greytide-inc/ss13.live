// Based on /tg/station's code/modules/spells/spell_types/barnyard.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11283, "/obj/effect/proc_holder/spell/targeted/barnyardcurse", "/obj/effect/proc_holder/spell/targeted", {
	compatible_mobs: null,
	name: "Curse of the Barnyard",
	desc: "This spell dooms an unlucky soul to possess the speech and facial attributes of a barnyard animal.",
	school: "transmutation",
	charge_type: "recharge",
	charge_max: 150,
	charge_counter: 0,
	clothes_req: 0,
	stat_allowed: 0,
	invocation: "KN'A FTAGHU, PUCK 'BTHNK!",
	invocation_type: "shout",
	range: 7,
	cooldown_min: 30,
	selection_type: "range",
	action_icon_state: "barn",
});

// barnyard.dm:15
rt.def("/obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.compatible_mobs = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// barnyard.dm:20
rt.def("/obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, magichead: Value = null;
	user ??= f.usr;
	if (!rt.len(f, targets)) {
		to_chat(user, "<span class='notice'>No target found in range.</span>");
		return f.dot;
	}
	if (!rt.isIn(f, (target = rt.index(targets, 1)).type, this.compatible_mobs)) {
		to_chat(user, `<span class='notice'>You are unable to curse ${target}'s head!</span>`);
		return f.dot;
	}
	if (!rt.isIn(f, target, oview(this.range))) {
		to_chat(user, "<span class='notice'>They are too far away!</span>");
		return f.dot;
	}
	let masks: Value = list(T("/obj/item/clothing/mask/spig"), T("/obj/item/clothing/mask/cowmask"), T("/obj/item/clothing/mask/horsehead"));
	let mSounds: Value = list(rt.rsc("sound/magic/pighead_curse.ogg"), rt.rsc("sound/magic/cowhead_curse.ogg"), rt.rsc("sound/magic/horsehead_curse.ogg"));
	let randM: Value = rand(1, 3);
	let choice: Value = rt.index(masks, randM);
	(rt.modField(f, (magichead = (yield* new_(choice))), "flags", NODROP, rt.bitOr));
	magichead.flags_inv = null;
	target.visible_message(`<span class='danger'>${target}'s face bursts into flames, and a barnyard animal's head takes its place!</span>`, "<span class='danger'>Your face burns up, and shortly after the fire you realise you have the face of a barnyard animal!</span>");
	if (!(yield* target.dropItemToGround(target.wear_mask))) {
		yield* qdel(target.wear_mask);
	}
	yield* target.equip_to_slot_if_possible(magichead, slot_wear_mask, 1, 1);
	playsound(rt.getStep(f, target, 0), rt.index(mSounds, randM), 50, 1);
	yield* target.flash_act();
	return f.dot;
}, true);
