// Based on /tg/station's code/modules/spells/spell_types/infinite_guns.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11319, "/obj/effect/proc_holder/spell/targeted/infinite_guns", "/obj/effect/proc_holder/spell/targeted", {
	summon_path: rt.typePath("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted"),
	include_user: 1,
	name: "Lesser Summon Guns",
	desc: "Why reload when you have infinite guns? Summons an unending stream of bolt action rifles. Requires both hands free to use. Learning this spell makes you unable to learn Arcane Barrage.",
	invocation_type: "none",
	range: -1,
	school: "conjuration",
	charge_max: 750,
	clothes_req: 1,
	cooldown_min: 10,
	action_icon_state: "bolt_action",
});

// infinite_guns.dm:16
rt.def("/obj/effect/proc_holder/spell/targeted/infinite_guns/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let C: Value = null, GUN: Value = null;
	user ??= f.usr;
	for (C of each(targets, T("/mob/living/carbon"))) {
		yield* C.drop_item();
		C.swap_hand();
		yield* C.drop_item();
		GUN = (yield* new_(this.summon_path));
		yield* C.put_in_hands(GUN);
		C.swap_hand(C.get_held_index_of_item(GUN));
	}
	return f.dot;
}, true);
