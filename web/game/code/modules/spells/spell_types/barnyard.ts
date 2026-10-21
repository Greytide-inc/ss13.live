// From code/modules/spells/spell_types/barnyard.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/<init>  (code/modules/spells/spell_types/barnyard.dm:15)
rt.def("/obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "compatible_mobs", rt.list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey")));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/cast  (code/modules/spells/spell_types/barnyard.dm:20)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/barnyardcurse/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, masks: Value = null, mSounds: Value = null, randM: Value = null, choice: Value = null, magichead: Value = null;
	f.vars = () => [targets, user, target, masks, mSounds, randM, choice, magichead];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if (!truthy(rt.len(f, live(targets)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>No target found in range.</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, rt.gv(f, "type", (target = rt.index(live(targets), 1))), rt.sv(f, "compatible_mobs")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You are unable to curse ＀'s head!</span>", [live(target)])]);
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(target), (yield* g.call(f, P("/proc/oview"), null, [rt.sv(f, "range")]))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>They are too far away!</span>"]);
		return live(f.dot);
	}
	masks = rt.list(T("/obj/item/clothing/mask/spig"), T("/obj/item/clothing/mask/cowmask"), T("/obj/item/clothing/mask/horsehead"));
	mSounds = rt.list(rt.rsc("sound/magic/pighead_curse.ogg"), rt.rsc("sound/magic/cowhead_curse.ogg"), rt.rsc("sound/magic/horsehead_curse.ogg"));
	randM = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	choice = rt.index(live(masks), live(randM));
	(rt.modField(f, (magichead = (yield* g.new_(f, live(choice), []))), "flags", 2, rt.bitOr));
	rt.setFv(f, "flags_inv", live(magichead), null);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀'s face bursts into flames, and a barnyard animal's head takes its place!</span>", [live(target)]), "<span class='danger'>Your face burns up, and shortly after the fire you realise you have the face of a barnyard animal!</span>"]);
	if (!truthy((yield* g.callName(f, live(target), "dropItemToGround", [rt.fv(f, "wear_mask", live(target))])))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_mask", live(target))]);
	}
	yield* g.callName(f, live(target), "equip_to_slot_if_possible", [live(magichead), 2, 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(target), 0), rt.index(live(mSounds), live(randM)), 50, 1]);
	yield* g.callName(f, live(target), "flash_act", []);
	return f.dot;
}, true);
