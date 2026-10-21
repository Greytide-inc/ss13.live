// From code/modules/mining/mine_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12081, "/obj/effect/light_emitter", "/obj/effect", {
	set_luminosity: 8,
	set_cap: 0,
	anchored: 1,
	name: "Light emitter",
	invisibility: 101,
});

// /obj/effect/light_emitter/proc/New  (code/modules/mining/mine_items.dm:12)  may sleep
rt.def("/obj/effect/light_emitter/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_light", rt.sv(f, "set_luminosity"), rt.sv(f, "set_cap"));
	return f.dot;
}, true);

rt.type(12336, "/obj/structure/closet/wardrobe/miner", "/obj/structure/closet/wardrobe", {
	icon_door: "mixed",
	name: "mining wardrobe",
});

// /obj/structure/closet/wardrobe/miner/proc/PopulateContents  (code/modules/mining/mine_items.dm:22)  may sleep
rt.def("/obj/structure/closet/wardrobe/miner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/explorer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/explorer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/miner/lavaland"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/miner/lavaland"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/under/rank/miner/lavaland"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/workboots/mining"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/workboots/mining"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/workboots/mining"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(12408, "/obj/structure/closet/secure_closet/miner", "/obj/structure/closet/secure_closet", {
	name: "miner's equipment",
	icon_state: "mining",
	req_access: null,
});

// /obj/structure/closet/secure_closet/miner/proc/<init>  (code/modules/mining/mine_items.dm:38)
rt.def("/obj/structure/closet/secure_closet/miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(48));
	return f.dot;
});

// /obj/structure/closet/secure_closet/miner/proc/PopulateContents  (code/modules/mining/mine_items.dm:41)  may sleep
rt.def("/obj/structure/closet/secure_closet/miner/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/stack/sheet/mineral/sandbags"), [live(f.src), 5]);
	yield* g.new_(f, T("/obj/item/weapon/storage/box/emptysandbags"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/shovel"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/pickaxe/mini"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/radio/headset/headset_cargo/mining"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/plants"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/ore"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/energy/kinetic_accelerator"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/meson"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/survivalcapsule"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assault_pod/mining"), [live(f.src)]);
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

// /obj/machinery/computer/shuttle/mining/proc/attack_hand  (code/modules/mining/mine_items.dm:69)  may sleep
rt.def("/obj/machinery/computer/shuttle/mining/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((((isEqual(rt.fv(f, "z", live(f.args[0])), 2) && truthy(rt.fv(f, "mind", live(f.args[0])))) && truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gv(f, "head_revolutionaries", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) && !truthy((rt.isIn(f, rt.fv(f, "mind", live(f.args[0])), rt.gl("dumb_rev_heads")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You get a feeling that leaving the station might be a REALLY dumb idea...</span>"]);
		rt.modGl("dumb_rev_heads", rt.fv(f, "mind", live(f.args[0])), add);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
