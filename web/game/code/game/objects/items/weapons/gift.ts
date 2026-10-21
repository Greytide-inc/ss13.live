// From code/game/objects/items/weapons/gift.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7232, "/obj/item/weapon/a_gift", "/obj/item/weapon", {
	name: "gift",
	desc: "PRESENTS!!!! eek!",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "giftdeliverypackage3",
	item_state: "gift1",
	resistance_flags: 4,
});

// /obj/item/weapon/a_gift/proc/New  (code/game/objects/items/weapons/gift.dm:19)  may sleep
rt.def("/obj/item/weapon/a_gift/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setSv(f, "icon_state", fmt("giftdeliverypackage＀", [(yield* g.call(f, P("/proc/rand"), null, [1, 5]))]));
	return f.dot;
}, true);

// /obj/item/weapon/a_gift/proc/suicide_act  (code/game/objects/items/weapons/gift.dm:25)
rt.def("/obj/item/weapon/a_gift/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ peeks inside ＀ and cries ＀self to death! It looks like ＀ ＀ on the naughty list...</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_they", []), rt.callName(f, live(user), "p_were", [])])]);
	return 1;
});

// /obj/item/weapon/a_gift/proc/attack_self  (code/game/objects/items/weapons/gift.dm:29)  may sleep
rt.def("/obj/item/weapon/a_gift/proc/attack_self", function* attack_self(f: Frame, M: Value) {
	let gift_type_list: Value = null, gift_type: Value = null, I: Value = null;
	f.vars = () => [M, gift_type_list, gift_type, I];
	if (((truthy(live(M)) && truthy(rt.fv(f, "mind", live(M)))) && isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(M))), "Santa"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You're supposed to be spreading gifts, not opening them yourself!</span>"]);
		return live(f.dot);
	}
	gift_type_list = rt.list(T("/obj/item/weapon/sord"), T("/obj/item/weapon/storage/wallet"), T("/obj/item/weapon/storage/photo_album"), T("/obj/item/weapon/storage/box/snappops"), T("/obj/item/weapon/storage/crayons"), T("/obj/item/weapon/storage/backpack/holding"), T("/obj/item/weapon/storage/belt/champion"), T("/obj/item/weapon/soap/deluxe"), T("/obj/item/weapon/pickaxe/diamond"), T("/obj/item/weapon/pen/invisible"), T("/obj/item/weapon/lipstick/random"), T("/obj/item/weapon/grenade/smokebomb"), T("/obj/item/weapon/grown/corncob"), T("/obj/item/weapon/poster/random_contraband"), T("/obj/item/weapon/poster/random_official"), T("/obj/item/weapon/book/manual/barman_recipes"), T("/obj/item/weapon/book/manual/chef_recipes"), T("/obj/item/weapon/bikehorn"), T("/obj/item/toy/beach_ball"), T("/obj/item/toy/beach_ball/holoball"), T("/obj/item/weapon/banhammer"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), T("/obj/item/device/paicard"), T("/obj/item/device/instrument/violin"), T("/obj/item/device/instrument/guitar"), T("/obj/item/weapon/storage/belt/utility/full"), T("/obj/item/clothing/neck/tie/horrible"), T("/obj/item/clothing/suit/jacket/leather"), T("/obj/item/clothing/suit/jacket/leather/overcoat"), T("/obj/item/clothing/suit/poncho"), T("/obj/item/clothing/suit/poncho/green"), T("/obj/item/clothing/suit/poncho/red"), T("/obj/item/clothing/suit/snowman"), T("/obj/item/clothing/head/snowman"), T("/obj/item/trash/coal"));
	gift_type_list = rt.modify(live(gift_type_list), subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/clothing/head/collectable")])), T("/obj/item/clothing/head/collectable")), add);
	gift_type_list = rt.modify(live(gift_type_list), subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy")])), T("/obj/item/toy")), add(add(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/toy/cards")])), T("/obj/item/toy/cards/deck")), T("/obj/item/toy/figure")), T("/obj/item/toy/ammo"))), add);
	if (!truthy((yield* g.call(f, P("/proc/ispath"), null, [(gift_type = rt.op(f, "PickUnweighted", [1], [live(gift_type_list)])), T("/obj/item")])))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	I = (yield* g.new_(f, live(gift_type), [live(M)]));
	yield* g.callName(f, live(M), "put_in_hands", [live(I)]);
	yield* g.callName(f, live(I), "add_fingerprint", [live(M)]);
	return f.dot;
}, true);
