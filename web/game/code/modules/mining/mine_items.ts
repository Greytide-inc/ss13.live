// Based on /tg/station's code/modules/mining/mine_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12081, "/obj/effect/light_emitter", "/obj/effect", {
	set_luminosity: 8,
	set_cap: 0,
	anchored: 1,
	name: "Light emitter",
	invisibility: 101,
});

// mine_items.dm:12
rt.def("/obj/effect/light_emitter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.set_light(this.set_luminosity, this.set_cap);
	return f.dot;
}, true);

rt.type(12336, "/obj/structure/closet/wardrobe/miner", "/obj/structure/closet/wardrobe", {
	icon_door: "mixed",
	name: "mining wardrobe",
});

// mine_items.dm:22
rt.def("/obj/structure/closet/wardrobe/miner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/explorer"), this);
	yield* new_(T("/obj/item/weapon/storage/backpack/satchel/explorer"), this);
	yield* new_(T("/obj/item/clothing/under/rank/miner/lavaland"), this);
	yield* new_(T("/obj/item/clothing/under/rank/miner/lavaland"), this);
	yield* new_(T("/obj/item/clothing/under/rank/miner/lavaland"), this);
	yield* new_(T("/obj/item/clothing/shoes/workboots/mining"), this);
	yield* new_(T("/obj/item/clothing/shoes/workboots/mining"), this);
	yield* new_(T("/obj/item/clothing/shoes/workboots/mining"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	yield* new_(T("/obj/item/clothing/gloves/color/black"), this);
	return f.dot;
}, true);

rt.type(12408, "/obj/structure/closet/secure_closet/miner", "/obj/structure/closet/secure_closet", {
	name: "miner's equipment",
	icon_state: "mining",
	req_access: null,
});

// mine_items.dm:38
rt.def("/obj/structure/closet/secure_closet/miner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(48);
	return f.dot;
});

// mine_items.dm:41
rt.def("/obj/structure/closet/secure_closet/miner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/stack/sheet/mineral/sandbags"), this, 5);
	yield* new_(T("/obj/item/weapon/storage/box/emptysandbags"), this);
	yield* new_(T("/obj/item/weapon/shovel"), this);
	yield* new_(T("/obj/item/weapon/pickaxe/mini"), this);
	yield* new_(T("/obj/item/device/radio/headset/headset_cargo/mining"), this);
	yield* new_(T("/obj/item/device/flashlight/seclite"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/plants"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/ore"), this);
	yield* new_(T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), this);
	yield* new_(T("/obj/item/weapon/gun/energy/kinetic_accelerator"), this);
	yield* new_(T("/obj/item/clothing/glasses/meson"), this);
	yield* new_(T("/obj/item/weapon/survivalcapsule"), this);
	yield* new_(T("/obj/item/device/assault_pod/mining"), this);
	return f.dot;
}, true);

rt.type(10391, "/obj/machinery/computer/shuttle/mining", "/obj/machinery/computer/shuttle", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mining_shuttle"),
	name: "Mining Shuttle Console",
	desc: "Used to call and send the mining shuttle.",
	shuttleId: "mining",
	possible_destinations: "mining_home;mining_away;landing_zone_dock;mining_public",
	no_destination_swap: 1,
}, { global: { dumb_rev_heads: 746 } });

// mine_items.dm:69
rt.def("/obj/machinery/computer/shuttle/mining/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.z == ZLEVEL_STATION && user.mind && rt.isIn(f, user.mind, GLOB.SSticker.mode.head_revolutionaries) && !rt.isIn(f, user.mind, GLOB.dumb_rev_heads)) {
		to_chat(user, "<span class='warning'>You get a feeling that leaving the station might be a REALLY dumb idea...</span>");
		GLOB.dumb_rev_heads += user.mind;
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);
