// Based on /tg/station's code/modules/mining/equipment/goliath_hide.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9035, "/obj/item/stack/sheet/animalhide/goliath_hide", "/obj/item/stack/sheet/animalhide", {
	flags: 4,
	name: "goliath hide plates",
	desc: "Pieces of a goliath's rocky hide, these might be able to make your suit a bit more durable to attack from the local fauna.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "goliath_hide",
	singular_name: "hide plate",
	max_amount: 6,
	novariants: 0,
	w_class: 3,
	layer: 4,
});

// goliath_hide.dm:16
rt.def("/obj/item/stack/sheet/animalhide/goliath_hide/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let C: Value = null, current_armor: Value = null, D: Value = null;
	if (!proximity_flag) return f.dot;
	if (rt.istype(target, T("/obj/item/clothing/suit/space/hardsuit/mining")) || rt.istype(target, T("/obj/item/clothing/head/helmet/space/hardsuit/mining")) || rt.istype(target, T("/obj/item/clothing/suit/hooded/explorer")) || rt.istype(target, T("/obj/item/clothing/head/hooded/explorer"))) {
		C = target;
		if (rt.index((current_armor = C.armor), "melee") < 60) {
			rt.setAt(current_armor, "melee", min(rt.at(current_armor, "melee") + 10, 60));
			to_chat(user, `<span class='info'>You strengthen ${target}, improving its resistance against melee attacks.</span>`);
			yield* this.use(1);
		} else {
			to_chat(user, `<span class='warning'>You can't improve ${C} any further!</span>`);
			return f.dot;
		}
	}
	if (!rt.istype(target, T("/obj/mecha/working/ripley"))) return f.dot;
	if ((D = target).hides < 3) {
		D.hides++;
		rt.setAt(D.armor, "melee", min(rt.index(D.armor, "melee") + 10, 70));
		rt.setAt(D.armor, "bullet", min(rt.index(D.armor, "bullet") + 5, 50));
		rt.setAt(D.armor, "laser", min(rt.index(D.armor, "laser") + 5, 50));
		to_chat(user, `<span class='info'>You strengthen ${target}, improving its resistance against melee attacks.</span>`);
		yield* D.update_icon();
		if (D.hides == 3) {
			D.desc = "Autonomous Power Loader Unit. It's wearing a fearsome carapace entirely composed of goliath hide plates - its pilot must be an experienced monster hunter.";
		} else {
			D.desc = "Autonomous Power Loader Unit. Its armour is enhanced with some goliath hide plates.";
		}
		yield* qdel(this);
	} else {
		to_chat(user, `<span class='warning'>You can't improve ${D} any further!</span>`);
		return f.dot;
	}
	return f.dot;
}, true);
