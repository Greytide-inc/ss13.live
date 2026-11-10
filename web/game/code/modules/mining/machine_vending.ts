// Based on /tg/station's code/modules/mining/machine_vending.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10936, "/obj/machinery/mineral/equipment_vendor", "/obj/machinery/mineral", {
	inserted_id: null,
	prize_list: null,
	anchored: 1,
	name: "mining equipment vendor",
	desc: "An equipment vendor for miners, points collected at an ore redemption machine can be spent here.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "mining",
	density: 1,
});

// machine_vending.dm:11
rt.def("/obj/machinery/mineral/equipment_vendor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.prize_list = list(new_(T("/datum/data/mining_equipment"), "1 Marker Beacon", T("/obj/item/stack/marker_beacon"), 10), new_(T("/datum/data/mining_equipment"), "10 Marker Beacons", T("/obj/item/stack/marker_beacon/ten"), 100), new_(T("/datum/data/mining_equipment"), "30 Marker Beacons", T("/obj/item/stack/marker_beacon/thirty"), 300), new_(T("/datum/data/mining_equipment"), "Whiskey", T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), 100), new_(T("/datum/data/mining_equipment"), "Absinthe", T("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/premium"), 100), new_(T("/datum/data/mining_equipment"), "Cigar", T("/obj/item/clothing/mask/cigarette/cigar/havana"), 150), new_(T("/datum/data/mining_equipment"), "Soap", T("/obj/item/weapon/soap/nanotrasen"), 200), new_(T("/datum/data/mining_equipment"), "Laser Pointer", T("/obj/item/device/laser_pointer"), 300), new_(T("/datum/data/mining_equipment"), "Alien Toy", T("/obj/item/clothing/mask/facehugger/toy"), 300), new_(T("/datum/data/mining_equipment"), "Advanced Scanner", T("/obj/item/device/t_scanner/adv_mining_scanner"), 800), new_(T("/datum/data/mining_equipment"), "Stabilizing Serum", T("/obj/item/weapon/hivelordstabilizer"), 400), new_(T("/datum/data/mining_equipment"), "Fulton Beacon", T("/obj/item/fulton_core"), 400), new_(T("/datum/data/mining_equipment"), "Shelter Capsule", T("/obj/item/weapon/survivalcapsule"), 400), new_(T("/datum/data/mining_equipment"), "GAR Meson Scanners", T("/obj/item/clothing/glasses/meson/gar"), 500), new_(T("/datum/data/mining_equipment"), "Explorer's Webbing", T("/obj/item/weapon/storage/belt/mining"), 500), new_(T("/datum/data/mining_equipment"), "Survival Medipen", T("/obj/item/weapon/reagent_containers/hypospray/medipen/survival"), 500), new_(T("/datum/data/mining_equipment"), "Brute First-Aid Kit", T("/obj/item/weapon/storage/firstaid/brute"), 600), new_(T("/datum/data/mining_equipment"), "Tracking Implant Kit", T("/obj/item/weapon/storage/box/minertracker"), 600), new_(T("/datum/data/mining_equipment"), "Jaunter", T("/obj/item/device/wormhole_jaunter"), 750), new_(T("/datum/data/mining_equipment"), "Kinetic Crusher", T("/obj/item/weapon/twohanded/required/kinetic_crusher"), 750), new_(T("/datum/data/mining_equipment"), "Kinetic Accelerator", T("/obj/item/weapon/gun/energy/kinetic_accelerator"), 750), new_(T("/datum/data/mining_equipment"), "Resonator", T("/obj/item/weapon/resonator"), 800), new_(T("/datum/data/mining_equipment"), "Fulton Pack", T("/obj/item/weapon/extraction_pack"), 1000), new_(T("/datum/data/mining_equipment"), "Lazarus Injector", T("/obj/item/weapon/lazarus_injector"), 1000), new_(T("/datum/data/mining_equipment"), "Silver Pickaxe", T("/obj/item/weapon/pickaxe/silver"), 1000), new_(T("/datum/data/mining_equipment"), "Jetpack Upgrade", T("/obj/item/weapon/tank/jetpack/suit"), 2000), new_(T("/datum/data/mining_equipment"), "Space Cash", T("/obj/item/stack/spacecash/c1000"), 2000), new_(T("/datum/data/mining_equipment"), "Mining Hardsuit", T("/obj/item/clothing/suit/space/hardsuit/mining"), 2000), new_(T("/datum/data/mining_equipment"), "Diamond Pickaxe", T("/obj/item/weapon/pickaxe/diamond"), 2000), new_(T("/datum/data/mining_equipment"), "Super Resonator", T("/obj/item/weapon/resonator/upgraded"), 2500), new_(T("/datum/data/mining_equipment"), "Luxury Shelter Capsule", T("/obj/item/weapon/survivalcapsule/luxury"), 3000), new_(T("/datum/data/mining_equipment"), "KA White Tracer Rounds", T("/obj/item/borg/upgrade/modkit/tracer"), 100), new_(T("/datum/data/mining_equipment"), "KA Adjustable Tracer Rounds", T("/obj/item/borg/upgrade/modkit/tracer/adjustable"), 150), new_(T("/datum/data/mining_equipment"), "KA Super Chassis", T("/obj/item/borg/upgrade/modkit/chassis_mod"), 250), new_(T("/datum/data/mining_equipment"), "KA Hyper Chassis", T("/obj/item/borg/upgrade/modkit/chassis_mod/orange"), 300), new_(T("/datum/data/mining_equipment"), "KA Range Increase", T("/obj/item/borg/upgrade/modkit/range"), 1000), new_(T("/datum/data/mining_equipment"), "KA Damage Increase", T("/obj/item/borg/upgrade/modkit/damage"), 1000), new_(T("/datum/data/mining_equipment"), "KA Cooldown Decrease", T("/obj/item/borg/upgrade/modkit/cooldown"), 1000), new_(T("/datum/data/mining_equipment"), "KA AoE Damage", T("/obj/item/borg/upgrade/modkit/aoe/mobs"), 2000), new_(T("/datum/data/mining_equipment"), "Point Transfer Card", T("/obj/item/weapon/card/mining_point_card"), 500), new_(T("/datum/data/mining_equipment"), "Mining Drone", T("/mob/living/simple_animal/hostile/mining_drone"), 800), new_(T("/datum/data/mining_equipment"), "Drone Melee Upgrade", T("/obj/item/device/mine_bot_ugprade"), 400), new_(T("/datum/data/mining_equipment"), "Drone Health Upgrade", T("/obj/item/device/mine_bot_ugprade/health"), 400), new_(T("/datum/data/mining_equipment"), "Drone Ranged Upgrade", T("/obj/item/device/mine_bot_ugprade/cooldown"), 600), new_(T("/datum/data/mining_equipment"), "Drone AI Upgrade", T("/obj/item/slimepotion/sentience/mining"), 1000), new_(T("/datum/data/mining_equipment"), "Jump Boots", T("/obj/item/clothing/shoes/bhop"), 2500));
	return f.dot;
});

// machine_vending.dm:71
rt.def("/obj/machinery/mineral/equipment_vendor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6761, "/obj/item/weapon/circuitboard/machine/mining_equipment_vendor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Mining Equipment Vendor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mineral/equipment_vendor"),
	origin_tech: "programming=1;engineering=3",
});

// machine_vending.dm:79
rt.def("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 3]);
	return f.dot;
});

// machine_vending.dm:84
rt.def("/obj/machinery/mineral/equipment_vendor/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// machine_vending.dm:88
rt.def("/obj/machinery/mineral/equipment_vendor/proc/update_icon", function update_icon(f: Frame) {
	if (this.powered()) {
		this.icon_state = rt.initial(f, this, "icon_state");
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-off`;
	}
	return f.dot;
});

// machine_vending.dm:95
rt.def("/obj/machinery/mineral/equipment_vendor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// machine_vending.dm:101
rt.def("/obj/machinery/mineral/equipment_vendor/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, prize: Value = null, popup: Value = null;
	dat += "<div class='statusDisplay'>";
	if (rt.istype(this.inserted_id, T("/obj/item/weapon/card/id"))) {
		dat += fmt("You have ＀ mining points collected. <A href='?src=＃;choice=eject'>Eject ID.</A><br>", [this.inserted_id.mining_points, this]);
	} else {
		dat += fmt("No ID inserted.  <A href='?src=＃;choice=insert'>Insert ID.</A><br>", [this]);
	}
	dat += "</div>";
	dat += "<br><b>Equipment point cost list:</b><BR><table border='0' width='300'>";
	for (prize of each(this.prize_list, T("/datum/data/mining_equipment"))) {
		dat += fmt("<tr><td>＀</td><td>＀</td><td><A href='?src=＃;purchase=＃'>Purchase</A></td></tr>", [prize.equipment_name, prize.cost, this, prize]);
	}
	dat += "</table>";
	(popup = (yield* new_(T("/datum/browser"), user, "miningvendor", "Mining Equipment Vendor", 400, 350))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// machine_vending.dm:118
rt.def("/obj/machinery/mineral/equipment_vendor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, prize: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "choice")) {
		if (rt.istype(this.inserted_id, T("/obj/item/weapon/card/id"))) {
			if (rt.at(href_list, "choice") == "eject") {
				this.inserted_id.loc = this.loc;
				yield* this.inserted_id.verb_pickup();
				this.inserted_id = null;
			}
		} else if (rt.at(href_list, "choice") == "insert") {
			if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
				if (!(yield* f.usr.drop_item())) {
					return f.dot;
				}
				I.loc = this;
				this.inserted_id = I;
			} else {
				to_chat(f.usr, "<span class='danger'>No valid ID.</span>");
			}
		}
	}
	if (rt.at(href_list, "purchase")) {
		if (rt.istype(this.inserted_id, T("/obj/item/weapon/card/id"))) {
			if (!(prize = rt.locateIn(f, rt.at(href_list, "purchase"), rt.world())) || !rt.isIn(f, prize, this.prize_list)) {
				return f.dot;
			}
			if (!(prize.cost > this.inserted_id.mining_points)) {
				this.inserted_id.mining_points -= prize.cost;
				yield* new_(prize.equipment_path, this.loc);
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// machine_vending.dm:151
rt.def("/obj/machinery/mineral/equipment_vendor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/mining_voucher"))) {
		yield* this.RedeemVoucher(I, user);
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		if (rt.istype((C = f.usr.get_active_held_item()), T("/obj/item/weapon/card/id")) && !rt.istype(this.inserted_id, T("/obj/item/weapon/card/id"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			C.loc = this;
			this.inserted_id = C;
			yield* this.interact(user);
		}
		return f.dot;
	}
	if (this.default_deconstruction_screwdriver(user, "mining-open", "mining", I)) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// machine_vending.dm:173
rt.def("/obj/machinery/mineral/equipment_vendor/proc/RedeemVoucher", function* RedeemVoucher(f: Frame, voucher: Value, redeemer: Value) {
	let selection: Value = null;
	let items: Value = list("Survival Capsule and Explorer's Webbing", "Resonator and Advanced Scanner", "Mining Drone", "Extraction and Rescue Kit", "Crusher Kit", "Mining Conscription Kit");
	if (!(selection = (yield* g.op(f, "Prompt", [1], [null, "Mining Voucher Redemption", "Pick your equipment", redeemer, items]))) || !this.Adjacent(redeemer) || !voucher || voucher.gc_destroyed || voucher.loc != redeemer) {
		return f.dot;
	}
	if (selection === "Survival Capsule and Explorer's Webbing") {
		yield* new_(T("/obj/item/weapon/storage/belt/mining/vendor"), this.loc);
	} else if (selection === "Resonator and Advanced Scanner") {
		yield* new_(T("/obj/item/weapon/resonator"), this.loc);
		yield* new_(T("/obj/item/device/t_scanner/adv_mining_scanner"), this.loc);
	} else if (selection === "Mining Drone") {
		yield* new_(T("/mob/living/simple_animal/hostile/mining_drone"), this.loc);
		yield* new_(T("/obj/item/weapon/weldingtool/hugetank"), this.loc);
		yield* new_(T("/obj/item/clothing/glasses/welding"), this.loc);
	} else if (selection === "Extraction and Rescue Kit") {
		yield* new_(T("/obj/item/weapon/extraction_pack"), this.loc);
		yield* new_(T("/obj/item/fulton_core"), this.loc);
		yield* new_(T("/obj/item/stack/marker_beacon/thirty"), this.loc);
	} else if (selection === "Crusher Kit") {
		yield* new_(T("/obj/item/weapon/twohanded/required/kinetic_crusher"), this.loc);
		yield* new_(T("/obj/item/weapon/storage/belt/mining/alt"), this.loc);
		yield* new_(T("/obj/item/weapon/extinguisher/mini"), this.loc);
	} else if (selection === "Mining Conscription Kit") {
		yield* new_(T("/obj/item/weapon/storage/backpack/duffelbag/mining_conscript"), this.loc);
	}
	yield* qdel(voucher);
	return f.dot;
}, true);

// machine_vending.dm:201
rt.def("/obj/machinery/mineral/equipment_vendor/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* do_sparks(5, 1, this);
	if (!(prob(50 / severity) && severity < 3)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(10937, "/obj/machinery/mineral/equipment_vendor/golem", "/obj/machinery/mineral/equipment_vendor", {
	name: "golem ship equipment vendor",
});

// machine_vending.dm:212
rt.def("/obj/machinery/mineral/equipment_vendor/golem/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.desc += "\nIt seems a few selections have been added.";
	this.prize_list += list((yield* new_(T("/datum/data/mining_equipment"), "Extra Id", T("/obj/item/weapon/card/id/mining"), 250)), (yield* new_(T("/datum/data/mining_equipment"), "Science Goggles", T("/obj/item/clothing/glasses/science"), 250)), (yield* new_(T("/datum/data/mining_equipment"), "Monkey Cube", T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), 300)), (yield* new_(T("/datum/data/mining_equipment"), "Toolbelt", T("/obj/item/weapon/storage/belt/utility"), 350)), (yield* new_(T("/datum/data/mining_equipment"), "Sulphuric Acid", T("/obj/item/weapon/reagent_containers/glass/beaker/sulphuric"), 500)), (yield* new_(T("/datum/data/mining_equipment"), "Grey Slime Extract", T("/obj/item/slime_extract/grey"), 1000)), (yield* new_(T("/datum/data/mining_equipment"), "Modification Kit", T("/obj/item/borg/upgrade/modkit/trigger_guard"), 1700)), (yield* new_(T("/datum/data/mining_equipment"), "The Liberator's Legacy", T("/obj/item/weapon/storage/box/rndboards"), 2000)), (yield* new_(T("/datum/data/mining_equipment"), "Royal Cape of the Liberator", T("/obj/item/weapon/bedsheet/rd/royal_cape"), 500)));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor/golem"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(7122, "/obj/item/weapon/card/mining_point_card", "/obj/item/weapon/card", {
	points: 500,
	name: "mining points card",
	desc: "A small card preloaded with mining points. Swipe your ID card over it to transfer the points, then discard.",
	icon_state: "data",
});

// machine_vending.dm:254
rt.def("/obj/item/weapon/card/mining_point_card/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		if (this.points) {
			(C = I).mining_points += this.points;
			to_chat(user, `<span class='info'>You transfer ${this.points} points to ${C}.</span>`);
			this.points = 0;
		} else {
			to_chat(user, `<span class='info'>There's no points left on ${this}.</span>`);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// machine_vending.dm:265
rt.def("/obj/item/weapon/card/mining_point_card/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("There's ＀ point５ on the card.", [this.points]));
	return f.dot;
}, false);

rt.type(7123, "/obj/item/weapon/card/mining_access_card", "/obj/item/weapon/card", {
	name: "mining access card",
	desc: "A small card, that when used on any ID, will add mining access.",
	icon_state: "data",
});

// machine_vending.dm:275
rt.def("/obj/item/weapon/card/mining_access_card/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, proximity: Value) {
	let I: Value = null;
	if (rt.istype(AM, T("/obj/item/weapon/card/id")) && proximity) {
		(rt.modField(f, (I = AM), "access", 48, rt.bitOr));
		(rt.modField(f, I, "access", 54, rt.bitOr));
		(rt.modField(f, I, "access", 64, rt.bitOr));
		(rt.modField(f, I, "access", 31, rt.bitOr));
		to_chat(user, `You upgrade ${I} with mining access.`);
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5501, "/obj/item/weapon/storage/backpack/duffelbag/mining_conscript", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "mining conscription kit",
	desc: "A kit containing everything a crewmember needs to support a shaft miner in the field.",
});

// machine_vending.dm:290
rt.def("/obj/item/weapon/storage/backpack/duffelbag/mining_conscript/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/pickaxe/mini"), this);
	yield* new_(T("/obj/item/clothing/glasses/meson"), this);
	yield* new_(T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), this);
	yield* new_(T("/obj/item/weapon/storage/bag/ore"), this);
	yield* new_(T("/obj/item/clothing/suit/hooded/explorer"), this);
	yield* new_(T("/obj/item/device/encryptionkey/headset_cargo"), this);
	yield* new_(T("/obj/item/clothing/mask/gas/explorer"), this);
	yield* new_(T("/obj/item/weapon/card/mining_access_card"), this);
	return f.dot;
}, true);
