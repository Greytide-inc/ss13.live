// From code/modules/events/wizard/curseditems.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(337, "/datum/round_event/wizard/cursed_items", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/cursed_items/proc/start  (code/modules/events/wizard/curseditems.dm:13)  may sleep
rt.def("/datum/round_event/wizard/cursed_items/proc/start", function* start(f: Frame) {
	let item_set: Value = null, wearslots: Value = null, loadout: Value = null, ruins_spaceworthiness: Value = null, ruins_wizard_loadout: Value = null, H: Value = null, slots: Value = null, i: Value = null, J: Value = null, I: Value = null, smoke: Value = null;
	let $0: any, $e: any;
	f.vars = () => [item_set, wearslots, loadout, ruins_spaceworthiness, ruins_wizard_loadout, H, slots, i, J, I, smoke, $0, $e];
	item_set = rt.op(f, "PickUnweighted", [6], ["wizardmimic", "swords", "bigfatdoobie", "boxing", "voicemodulators", "catgirls2015"]);
	wearslots = rt.list(13, 12, 11, 2, 9, 7);
	loadout = rt.list();
	ruins_spaceworthiness = null;
	ruins_wizard_loadout = null;
	rt.setFv(f, "len", live(loadout), 7);
	$0 = live(item_set);
	if ($0 === "wizardmimic") {
		loadout = rt.list(T("/obj/item/clothing/suit/wizrobe"), T("/obj/item/clothing/shoes/sandal/magic"), T("/obj/item/clothing/head/wizard"));
		ruins_spaceworthiness = 1;
	} else if ($0 === "swords") {
		rt.setAt(live(loadout), 5, T("/obj/item/weapon/katana/cursed"));
	} else if ($0 === "bigfatdoobie") {
		rt.setAt(live(loadout), 4, T("/obj/item/clothing/mask/cigarette/rollie/trippy"));
		ruins_spaceworthiness = 1;
	} else if ($0 === "boxing") {
		rt.setAt(live(loadout), 4, T("/obj/item/clothing/mask/luchador"));
		rt.setAt(live(loadout), 6, T("/obj/item/clothing/gloves/boxing"));
		ruins_spaceworthiness = 1;
	} else if ($0 === "voicemodulators") {
		rt.setAt(live(loadout), 4, T("/obj/item/clothing/mask/chameleon"));
	} else if ($0 === "catgirls2015") {
		rt.setAt(live(loadout), 3, T("/obj/item/clothing/head/kitty"));
		ruins_spaceworthiness = 1;
		ruins_wizard_loadout = 1;
	}
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((truthy(live(ruins_spaceworthiness)) && ((!isEqual(rt.fv(f, "z", live(H)), 2) || truthy((rt.istype(rt.fv(f, "loc", live(H)), T("/turf/open/space")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/is_species"), null, [live(H), T("/datum/species/plasmaman")])))))) {
			continue;
		}
		if (((truthy(live(ruins_wizard_loadout)) && truthy(rt.fv(f, "mind", live(H)))) && (truthy((rt.isIn(f, rt.fv(f, "mind", live(H)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)) || truthy((rt.isIn(f, rt.fv(f, "mind", live(H)), rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))))) {
			continue;
		}
		if (isEqual(live(item_set), "catgirls2015")) {
			rt.setFv(f, "gender", live(H), "female");
		}
		slots = rt.list(rt.fv(f, "wear_suit", live(H)), rt.fv(f, "shoes", live(H)), rt.fv(f, "head", live(H)), rt.fv(f, "wear_mask", live(H)), rt.fv(f, "gloves", live(H)), rt.fv(f, "ears", live(H)));
		i = null;
		rt.forRange(f, 1, 1, rt.len(f, live(loadout)), 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			i = $e;
			if (truthy(rt.index(live(loadout), live(i)))) {
				J = rt.index(live(loadout), live(i));
				I = (yield* g.new_(f, live(J), []));
				yield* g.callName(f, live(H), "temporarilyRemoveItemFromInventory", [rt.index(live(slots), live(i)), 1]);
				yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(I), rt.index(live(wearslots), live(i))]);
				(rt.modField(f, live(I), "flags", 2, rt.bitOr));
				rt.setFv(f, "name", live(I), add("cursed ", rt.fv(f, "name", live(I))));
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.fv(f, "loc", live(H))]);
		yield* g.callName(f, live(smoke), "start", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
