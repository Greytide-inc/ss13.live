// Based on /tg/station's code/modules/events/wizard/curseditems.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(337, "/datum/round_event/wizard/cursed_items", "/datum/round_event/wizard", {});

// curseditems.dm:13
rt.def("/datum/round_event/wizard/cursed_items/proc/start", function* start(f: Frame) {
	let ruins_spaceworthiness: Value = null, ruins_wizard_loadout: Value = null, H: Value = null, slots: Value = null, i: Value = null, J: Value = null, I: Value = null, smoke: Value = null;
	let $e: any;
	let item_set: Value = pick("wizardmimic", "swords", "bigfatdoobie", "boxing", "voicemodulators", "catgirls2015");
	let wearslots: Value = list(slot_wear_suit, slot_shoes, slot_head, slot_wear_mask, slot_gloves, slot_ears);
	let loadout: Value = list();
	loadout.len = 7;
	if (item_set === "wizardmimic") {
		loadout = list(T("/obj/item/clothing/suit/wizrobe"), T("/obj/item/clothing/shoes/sandal/magic"), T("/obj/item/clothing/head/wizard"));
		ruins_spaceworthiness = 1;
	} else if (item_set === "swords") {
		rt.setAt(loadout, 5, T("/obj/item/weapon/katana/cursed"));
	} else if (item_set === "bigfatdoobie") {
		rt.setAt(loadout, 4, T("/obj/item/clothing/mask/cigarette/rollie/trippy"));
		ruins_spaceworthiness = 1;
	} else if (item_set === "boxing") {
		rt.setAt(loadout, 4, T("/obj/item/clothing/mask/luchador"));
		rt.setAt(loadout, 6, T("/obj/item/clothing/gloves/boxing"));
		ruins_spaceworthiness = 1;
	} else if (item_set === "voicemodulators") {
		rt.setAt(loadout, 4, T("/obj/item/clothing/mask/chameleon"));
	} else if (item_set === "catgirls2015") {
		rt.setAt(loadout, 3, T("/obj/item/clothing/head/kitty"));
		ruins_spaceworthiness = 1;
		ruins_wizard_loadout = 1;
	}
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (ruins_spaceworthiness && (H.z != ZLEVEL_STATION || rt.istype(H.loc, T("/turf/open/space")) || is_species(H, T("/datum/species/plasmaman")))) {
			continue;
		}
		if (ruins_wizard_loadout && H.mind && (rt.isIn(f, H.mind, GLOB.SSticker.mode.wizards) || rt.isIn(f, H.mind, GLOB.SSticker.mode.apprentices))) {
			continue;
		}
		if (item_set == "catgirls2015") {
			H.gender = "female";
		}
		slots = list(H.wear_suit, H.shoes, H.head, H.wear_mask, H.gloves, H.ears);
		i = null;
		rt.forRange(f, 1, 1, rt.len(f, loadout), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			i = $e;
			if (rt.index(loadout, i)) {
				J = rt.index(loadout, i);
				I = (yield* new_(J));
				yield* H.temporarilyRemoveItemFromInventory(rt.index(slots, i), 1);
				yield* H.equip_to_slot_or_del(I, rt.index(wearslots, i));
				(rt.modField(f, I, "flags", NODROP, rt.bitOr));
				I.name = "cursed " + I.name;
			}
		}
		rt.endFor(f, 1);
	}
	H = null;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, H.loc);
		yield* smoke.start();
	}
	return f.dot;
}, true);
