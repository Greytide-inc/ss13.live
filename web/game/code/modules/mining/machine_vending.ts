// From code/modules/mining/machine_vending.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/mineral/equipment_vendor/proc/<init>  (code/modules/mining/machine_vending.dm:11)
rt.def("/obj/machinery/mineral/equipment_vendor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "prize_list", rt.list(rt.new_(f, T("/datum/data/mining_equipment"), ["1 Marker Beacon", T("/obj/item/stack/marker_beacon"), 10]), rt.new_(f, T("/datum/data/mining_equipment"), ["10 Marker Beacons", T("/obj/item/stack/marker_beacon/ten"), 100]), rt.new_(f, T("/datum/data/mining_equipment"), ["30 Marker Beacons", T("/obj/item/stack/marker_beacon/thirty"), 300]), rt.new_(f, T("/datum/data/mining_equipment"), ["Whiskey", T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), 100]), rt.new_(f, T("/datum/data/mining_equipment"), ["Absinthe", T("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/premium"), 100]), rt.new_(f, T("/datum/data/mining_equipment"), ["Cigar", T("/obj/item/clothing/mask/cigarette/cigar/havana"), 150]), rt.new_(f, T("/datum/data/mining_equipment"), ["Soap", T("/obj/item/weapon/soap/nanotrasen"), 200]), rt.new_(f, T("/datum/data/mining_equipment"), ["Laser Pointer", T("/obj/item/device/laser_pointer"), 300]), rt.new_(f, T("/datum/data/mining_equipment"), ["Alien Toy", T("/obj/item/clothing/mask/facehugger/toy"), 300]), rt.new_(f, T("/datum/data/mining_equipment"), ["Advanced Scanner", T("/obj/item/device/t_scanner/adv_mining_scanner"), 800]), rt.new_(f, T("/datum/data/mining_equipment"), ["Stabilizing Serum", T("/obj/item/weapon/hivelordstabilizer"), 400]), rt.new_(f, T("/datum/data/mining_equipment"), ["Fulton Beacon", T("/obj/item/fulton_core"), 400]), rt.new_(f, T("/datum/data/mining_equipment"), ["Shelter Capsule", T("/obj/item/weapon/survivalcapsule"), 400]), rt.new_(f, T("/datum/data/mining_equipment"), ["GAR Meson Scanners", T("/obj/item/clothing/glasses/meson/gar"), 500]), rt.new_(f, T("/datum/data/mining_equipment"), ["Explorer's Webbing", T("/obj/item/weapon/storage/belt/mining"), 500]), rt.new_(f, T("/datum/data/mining_equipment"), ["Survival Medipen", T("/obj/item/weapon/reagent_containers/hypospray/medipen/survival"), 500]), rt.new_(f, T("/datum/data/mining_equipment"), ["Brute First-Aid Kit", T("/obj/item/weapon/storage/firstaid/brute"), 600]), rt.new_(f, T("/datum/data/mining_equipment"), ["Tracking Implant Kit", T("/obj/item/weapon/storage/box/minertracker"), 600]), rt.new_(f, T("/datum/data/mining_equipment"), ["Jaunter", T("/obj/item/device/wormhole_jaunter"), 750]), rt.new_(f, T("/datum/data/mining_equipment"), ["Kinetic Crusher", T("/obj/item/weapon/twohanded/required/kinetic_crusher"), 750]), rt.new_(f, T("/datum/data/mining_equipment"), ["Kinetic Accelerator", T("/obj/item/weapon/gun/energy/kinetic_accelerator"), 750]), rt.new_(f, T("/datum/data/mining_equipment"), ["Resonator", T("/obj/item/weapon/resonator"), 800]), rt.new_(f, T("/datum/data/mining_equipment"), ["Fulton Pack", T("/obj/item/weapon/extraction_pack"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Lazarus Injector", T("/obj/item/weapon/lazarus_injector"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Silver Pickaxe", T("/obj/item/weapon/pickaxe/silver"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Jetpack Upgrade", T("/obj/item/weapon/tank/jetpack/suit"), 2000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Space Cash", T("/obj/item/stack/spacecash/c1000"), 2000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Mining Hardsuit", T("/obj/item/clothing/suit/space/hardsuit/mining"), 2000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Diamond Pickaxe", T("/obj/item/weapon/pickaxe/diamond"), 2000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Super Resonator", T("/obj/item/weapon/resonator/upgraded"), 2500]), rt.new_(f, T("/datum/data/mining_equipment"), ["Luxury Shelter Capsule", T("/obj/item/weapon/survivalcapsule/luxury"), 3000]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA White Tracer Rounds", T("/obj/item/borg/upgrade/modkit/tracer"), 100]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Adjustable Tracer Rounds", T("/obj/item/borg/upgrade/modkit/tracer/adjustable"), 150]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Super Chassis", T("/obj/item/borg/upgrade/modkit/chassis_mod"), 250]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Hyper Chassis", T("/obj/item/borg/upgrade/modkit/chassis_mod/orange"), 300]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Range Increase", T("/obj/item/borg/upgrade/modkit/range"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Damage Increase", T("/obj/item/borg/upgrade/modkit/damage"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA Cooldown Decrease", T("/obj/item/borg/upgrade/modkit/cooldown"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["KA AoE Damage", T("/obj/item/borg/upgrade/modkit/aoe/mobs"), 2000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Point Transfer Card", T("/obj/item/weapon/card/mining_point_card"), 500]), rt.new_(f, T("/datum/data/mining_equipment"), ["Mining Drone", T("/mob/living/simple_animal/hostile/mining_drone"), 800]), rt.new_(f, T("/datum/data/mining_equipment"), ["Drone Melee Upgrade", T("/obj/item/device/mine_bot_ugprade"), 400]), rt.new_(f, T("/datum/data/mining_equipment"), ["Drone Health Upgrade", T("/obj/item/device/mine_bot_ugprade/health"), 400]), rt.new_(f, T("/datum/data/mining_equipment"), ["Drone Ranged Upgrade", T("/obj/item/device/mine_bot_ugprade/cooldown"), 600]), rt.new_(f, T("/datum/data/mining_equipment"), ["Drone AI Upgrade", T("/obj/item/slimepotion/sentience/mining"), 1000]), rt.new_(f, T("/datum/data/mining_equipment"), ["Jump Boots", T("/obj/item/clothing/shoes/bhop"), 2500])));
	return f.dot;
});

// /obj/machinery/mineral/equipment_vendor/proc/New  (code/modules/mining/machine_vending.dm:71)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6761, "/obj/item/weapon/circuitboard/machine/mining_equipment_vendor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Mining Equipment Vendor (Machine Board)",
	build_path: rt.typePath("/obj/machinery/mineral/equipment_vendor"),
	origin_tech: "programming=1;engineering=3",
});

// /obj/item/weapon/circuitboard/machine/mining_equipment_vendor/proc/<init>  (code/modules/mining/machine_vending.dm:79)
rt.def("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/matter_bin"), 3]));
	return f.dot;
});

// /obj/machinery/mineral/equipment_vendor/proc/power_change  (code/modules/mining/machine_vending.dm:84)
rt.def("/obj/machinery/mineral/equipment_vendor/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/mineral/equipment_vendor/proc/update_icon  (code/modules/mining/machine_vending.dm:88)
rt.def("/obj/machinery/mineral/equipment_vendor/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.callSrc(f, "powered", []))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", fmt("＀-off", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return live(f.dot);
});

// /obj/machinery/mineral/equipment_vendor/proc/attack_hand  (code/modules/mining/machine_vending.dm:95)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/mineral/equipment_vendor/proc/interact  (code/modules/mining/machine_vending.dm:101)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, prize: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, prize, popup, $e];
	dat = null;
	dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
	if (truthy((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		dat = rt.modify(live(dat), fmt("You have ＀ mining points collected. <A href='?src=＃;choice=eject'>Eject ID.</A><br>", [rt.fv(f, "mining_points", rt.sv(f, "inserted_id")), live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("No ID inserted.  <A href='?src=＃;choice=insert'>Insert ID.</A><br>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), "</div>", add);
	dat = rt.modify(live(dat), "<br><b>Equipment point cost list:</b><BR><table border='0' width='300'>", add);
	prize = null;
	rt.forList(f, 0, rt.sv(f, "prize_list"), T("/datum/data/mining_equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		prize = $e;
		dat = rt.modify(live(dat), fmt("<tr><td>＀</td><td>＀</td><td><A href='?src=＃;purchase=＃'>Purchase</A></td></tr>", [rt.fv(f, "equipment_name", live(prize)), rt.fv(f, "cost", live(prize)), live(f.src), live(prize)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "</table>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "miningvendor", "Mining Equipment Vendor", 400, 350]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/mineral/equipment_vendor/proc/Topic  (code/modules/mining/machine_vending.dm:118)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/Topic", function* Topic(f: Frame) {
	let I: Value = null, prize: Value = null;
	f.vars = () => [I, prize];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "choice"))) {
		if (truthy((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			if (isEqual(rt.at(live(f.args[1]), "choice"), "eject")) {
				rt.setFv(f, "loc", rt.sv(f, "inserted_id"), rt.sv(f, "loc"));
				yield* g.callName(f, rt.sv(f, "inserted_id"), "verb_pickup", []);
				rt.setSv(f, "inserted_id", null);
			}
		} else {
			if (isEqual(rt.at(live(f.args[1]), "choice"), "insert")) {
				if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", live(I), live(f.src));
					rt.setSv(f, "inserted_id", live(I));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>No valid ID.</span>"]);
				}
			}
		}
	}
	if (truthy(rt.at(live(f.args[1]), "purchase"))) {
		if (truthy((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			if ((!truthy((prize = rt.locateIn(f, rt.at(live(f.args[1]), "purchase"), rt.world()))) || !truthy((rt.isIn(f, live(prize), rt.sv(f, "prize_list")) ? 1 : 0)))) {
				return live(f.dot);
			}
			if (!rt.gt(rt.fv(f, "cost", live(prize)), rt.fv(f, "mining_points", rt.sv(f, "inserted_id")))) {
				(rt.modField(f, rt.sv(f, "inserted_id"), "mining_points", rt.fv(f, "cost", live(prize)), subtract));
				yield* g.new_(f, rt.fv(f, "equipment_path", live(prize)), [rt.fv(f, "loc", live(f.src))]);
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/mineral/equipment_vendor/proc/attackby  (code/modules/mining/machine_vending.dm:151)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/mining_voucher")) ? 1 : 0))) {
		yield* g.srcCall(f, "RedeemVoucher", live(f.args[0]), live(f.args[1]));
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if ((truthy((rt.istype((C = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0)) && !truthy((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id")) ? 1 : 0)))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(C), live(f.src));
			rt.setSv(f, "inserted_id", live(C));
			yield* g.srcCall(f, "interact", live(f.args[1]));
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "mining-open", "mining", live(f.args[0]))))) {
		yield* g.srcCall(f, "updateUsrDialog");
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/mineral/equipment_vendor/proc/RedeemVoucher  (code/modules/mining/machine_vending.dm:173)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/RedeemVoucher", function* RedeemVoucher(f: Frame, voucher: Value, redeemer: Value) {
	let items: Value = null, selection: Value = null;
	let $0: any;
	f.vars = () => [voucher, redeemer, items, selection, $0];
	items = rt.list("Survival Capsule and Explorer's Webbing", "Resonator and Advanced Scanner", "Mining Drone", "Extraction and Rescue Kit", "Crusher Kit", "Mining Conscription Kit");
	if ((((!truthy((selection = (yield* g.op(f, "Prompt", [1], [null, "Mining Voucher Redemption", "Pick your equipment", live(redeemer), live(items)])))) || !truthy((yield* g.srcCall(f, "Adjacent", live(redeemer))))) || (!truthy(live(voucher)) || truthy(rt.fv(f, "gc_destroyed", live(voucher))))) || !isEqual(rt.fv(f, "loc", live(voucher)), live(redeemer)))) {
		return live(f.dot);
	}
	$0 = live(selection);
	if ($0 === "Survival Capsule and Explorer's Webbing") {
		yield* g.new_(f, T("/obj/item/weapon/storage/belt/mining/vendor"), [rt.fv(f, "loc", live(f.src))]);
	} else if ($0 === "Resonator and Advanced Scanner") {
		yield* g.new_(f, T("/obj/item/weapon/resonator"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.new_(f, T("/obj/item/device/t_scanner/adv_mining_scanner"), [rt.fv(f, "loc", live(f.src))]);
	} else if ($0 === "Mining Drone") {
		yield* g.new_(f, T("/mob/living/simple_animal/hostile/mining_drone"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.new_(f, T("/obj/item/weapon/weldingtool/hugetank"), [rt.fv(f, "loc", live(f.src))]);
		yield* g.new_(f, T("/obj/item/clothing/glasses/welding"), [rt.fv(f, "loc", live(f.src))]);
	} else if ($0 === "Extraction and Rescue Kit") {
		yield* g.new_(f, T("/obj/item/weapon/extraction_pack"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/fulton_core"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/stack/marker_beacon/thirty"), [rt.sv(f, "loc")]);
	} else if ($0 === "Crusher Kit") {
		yield* g.new_(f, T("/obj/item/weapon/twohanded/required/kinetic_crusher"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/weapon/storage/belt/mining/alt"), [rt.sv(f, "loc")]);
		yield* g.new_(f, T("/obj/item/weapon/extinguisher/mini"), [rt.sv(f, "loc")]);
	} else if ($0 === "Mining Conscription Kit") {
		yield* g.new_(f, T("/obj/item/weapon/storage/backpack/duffelbag/mining_conscript"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(voucher)]);
	return f.dot;
}, true);

// /obj/machinery/mineral/equipment_vendor/proc/ex_act  (code/modules/mining/machine_vending.dm:201)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	if (!(truthy(rt.op(f, "Prob", [], [divide(50, live(severity))])) && rt.lt(live(severity), 3))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(10937, "/obj/machinery/mineral/equipment_vendor/golem", "/obj/machinery/mineral/equipment_vendor", {
	name: "golem ship equipment vendor",
});

// /obj/machinery/mineral/equipment_vendor/golem/proc/New  (code/modules/mining/machine_vending.dm:212)  may sleep
rt.def("/obj/machinery/mineral/equipment_vendor/golem/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "desc", "\nIt seems a few selections have been added.", add);
	rt.modSrcVar(f, "prize_list", rt.list((yield* g.new_(f, T("/datum/data/mining_equipment"), ["Extra Id", T("/obj/item/weapon/card/id/mining"), 250])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Science Goggles", T("/obj/item/clothing/glasses/science"), 250])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Monkey Cube", T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube"), 300])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Toolbelt", T("/obj/item/weapon/storage/belt/utility"), 350])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Sulphuric Acid", T("/obj/item/weapon/reagent_containers/glass/beaker/sulphuric"), 500])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Grey Slime Extract", T("/obj/item/slime_extract/grey"), 1000])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Modification Kit", T("/obj/item/borg/upgrade/modkit/trigger_guard"), 1700])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["The Liberator's Legacy", T("/obj/item/weapon/storage/box/rndboards"), 2000])), (yield* g.new_(f, T("/datum/data/mining_equipment"), ["Royal Cape of the Liberator", T("/obj/item/weapon/bedsheet/rd/royal_cape"), 500]))), add);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/mining_equipment_vendor/golem"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(7122, "/obj/item/weapon/card/mining_point_card", "/obj/item/weapon/card", {
	points: 500,
	name: "mining points card",
	desc: "A small card preloaded with mining points. Swipe your ID card over it to transfer the points, then discard.",
	icon_state: "data",
});

// /obj/item/weapon/card/mining_point_card/proc/attackby  (code/modules/mining/machine_vending.dm:254)  may sleep
rt.def("/obj/item/weapon/card/mining_point_card/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "points"))) {
			rt.modField(f, (C = live(f.args[0])), "mining_points", rt.sv(f, "points"), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>You transfer ＀ points to ＀.</span>", [rt.sv(f, "points"), live(C)])]);
			rt.setSv(f, "points", 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>There's no points left on ＀.</span>", [live(f.src)])]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/card/mining_point_card/proc/examine  (code/modules/mining/machine_vending.dm:265)
rt.def("/obj/item/weapon/card/mining_point_card/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There's ＀ point５ on the card.", [rt.sv(f, "points")])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(7123, "/obj/item/weapon/card/mining_access_card", "/obj/item/weapon/card", {
	name: "mining access card",
	desc: "A small card, that when used on any ID, will add mining access.",
	icon_state: "data",
});

// /obj/item/weapon/card/mining_access_card/proc/afterattack  (code/modules/mining/machine_vending.dm:275)  may sleep
rt.def("/obj/item/weapon/card/mining_access_card/proc/afterattack", function* afterattack(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0)) && truthy(live(f.args[2])))) {
		(rt.modField(f, (I = live(f.args[0])), "access", 48, rt.bitOr));
		(rt.modField(f, live(I), "access", 54, rt.bitOr));
		(rt.modField(f, live(I), "access", 64, rt.bitOr));
		(rt.modField(f, live(I), "access", 31, rt.bitOr));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("You upgrade ＀ with mining access.", [live(I)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "user", "proximity"] });

rt.type(5501, "/obj/item/weapon/storage/backpack/duffelbag/mining_conscript", "/obj/item/weapon/storage/backpack/duffelbag", {
	name: "mining conscription kit",
	desc: "A kit containing everything a crewmember needs to support a shaft miner in the field.",
});

// /obj/item/weapon/storage/backpack/duffelbag/mining_conscript/proc/New  (code/modules/mining/machine_vending.dm:290)  may sleep
rt.def("/obj/item/weapon/storage/backpack/duffelbag/mining_conscript/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, T("/obj/item/weapon/pickaxe/mini"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/glasses/meson"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/storage/bag/ore"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/suit/hooded/explorer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_cargo"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/mask/gas/explorer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/card/mining_access_card"), [live(f.src)]);
	return f.dot;
}, true);
