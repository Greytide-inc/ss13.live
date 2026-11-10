// Based on /tg/station's code/game/objects/items/weapons/gift.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7232, "/obj/item/weapon/a_gift", "/obj/item/weapon", {
	name: "gift",
	desc: "PRESENTS!!!! eek!",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "giftdeliverypackage3",
	item_state: "gift1",
	resistance_flags: 4,
});

// gift.dm:19
rt.def("/obj/item/weapon/a_gift/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(-10, 10);
	this.pixel_y = rand(-10, 10);
	this.icon_state = `giftdeliverypackage${rand(1, 5)}`;
	return f.dot;
}, true);

// gift.dm:25
rt.def("/obj/item/weapon/a_gift/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} peeks inside ${this} and cries ${user.p_them()}self to death! It looks like ${user.p_they()} ${user.p_were()} on the naughty list...</span>`);
	return 1;
});

// gift.dm:29
rt.def("/obj/item/weapon/a_gift/proc/attack_self", function* attack_self(f: Frame, M: Value) {
	let gift_type: Value = null;
	if (M && M.mind && M.mind.special_role == "Santa") {
		to_chat(M, "<span class='warning'>You're supposed to be spreading gifts, not opening them yourself!</span>");
		return f.dot;
	}
	let gift_type_list: Value = list(T("/obj/item/weapon/sord"), T("/obj/item/weapon/storage/wallet"), T("/obj/item/weapon/storage/photo_album"), T("/obj/item/weapon/storage/box/snappops"), T("/obj/item/weapon/storage/crayons"), T("/obj/item/weapon/storage/backpack/holding"), T("/obj/item/weapon/storage/belt/champion"), T("/obj/item/weapon/soap/deluxe"), T("/obj/item/weapon/pickaxe/diamond"), T("/obj/item/weapon/pen/invisible"), T("/obj/item/weapon/lipstick/random"), T("/obj/item/weapon/grenade/smokebomb"), T("/obj/item/weapon/grown/corncob"), T("/obj/item/weapon/poster/random_contraband"), T("/obj/item/weapon/poster/random_official"), T("/obj/item/weapon/book/manual/barman_recipes"), T("/obj/item/weapon/book/manual/chef_recipes"), T("/obj/item/weapon/bikehorn"), T("/obj/item/toy/beach_ball"), T("/obj/item/toy/beach_ball/holoball"), T("/obj/item/weapon/banhammer"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), T("/obj/item/device/paicard"), T("/obj/item/device/instrument/violin"), T("/obj/item/device/instrument/guitar"), T("/obj/item/weapon/storage/belt/utility/full"), T("/obj/item/clothing/neck/tie/horrible"), T("/obj/item/clothing/suit/jacket/leather"), T("/obj/item/clothing/suit/jacket/leather/overcoat"), T("/obj/item/clothing/suit/poncho"), T("/obj/item/clothing/suit/poncho/green"), T("/obj/item/clothing/suit/poncho/red"), T("/obj/item/clothing/suit/snowman"), T("/obj/item/clothing/head/snowman"), T("/obj/item/trash/coal"));
	gift_type_list += typesof(T("/obj/item/clothing/head/collectable")) - T("/obj/item/clothing/head/collectable");
	gift_type_list += typesof(T("/obj/item/toy")) - T("/obj/item/toy") - (typesof(T("/obj/item/toy/cards")) - T("/obj/item/toy/cards/deck") + T("/obj/item/toy/figure") + T("/obj/item/toy/ammo"));
	if (!ispath((gift_type = pick(gift_type_list)), T("/obj/item"))) {
		return f.dot;
	}
	yield* qdel(this);
	let I: Value = (yield* new_(gift_type, M));
	yield* M.put_in_hands(I);
	yield* I.add_fingerprint(M);
	return f.dot;
}, true);
