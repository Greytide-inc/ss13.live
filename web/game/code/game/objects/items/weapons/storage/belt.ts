// From code/game/objects/items/weapons/storage/belt.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5287, "/obj/item/weapon/storage/belt", "/obj/item/weapon/storage", {
	name: "belt",
	desc: "Can hold various things.",
	icon: rt.rsc("icons/obj/clothing/belts.dmi"),
	icon_state: "utilitybelt",
	item_state: "utility",
	slot_flags: 512,
	attack_verb: null,
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/item/weapon/storage/belt/proc/update_icon  (code/game/objects/items/weapons/storage/belt.dm:13)
rt.def("/obj/item/weapon/storage/belt/proc/update_icon", function update_icon(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callSrc(f, "cut_overlays", []);
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.callSrc(f, "add_overlay", [fmt("＀", [rt.fv(f, "name", live(I))])]);
	}
	rt.endFor(f, 0);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(5296, "/obj/item/weapon/storage/belt/utility", "/obj/item/weapon/storage/belt", {
	name: "toolbelt",
	desc: "Holds tools.",
	icon_state: "utilitybelt",
	item_state: "utility",
	can_hold: null,
});

// /obj/item/weapon/storage/belt/utility/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:23)
rt.def("/obj/item/weapon/storage/belt/utility/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/crowbar"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/wirecutters"), T("/obj/item/weapon/wrench"), T("/obj/item/device/multitool"), T("/obj/item/device/flashlight"), T("/obj/item/stack/cable_coil"), T("/obj/item/device/t_scanner"), T("/obj/item/device/analyzer"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves")));
	return f.dot;
});

rt.type(5298, "/obj/item/weapon/storage/belt/utility/chief/full", "/obj/item/weapon/storage/belt/utility/chief", {});

// /obj/item/weapon/storage/belt/utility/chief/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:46)  may sleep
rt.def("/obj/item/weapon/storage/belt/utility/chief/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver/power"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/power"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/experimental"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, rt.op(f, "PickUnweighted", [3], ["red", "yellow", "orange"])]);
	yield* g.new_(f, T("/obj/item/weapon/extinguisher/mini"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/analyzer"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5299, "/obj/item/weapon/storage/belt/utility/full", "/obj/item/weapon/storage/belt/utility", {});

// /obj/item/weapon/storage/belt/utility/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:57)  may sleep
rt.def("/obj/item/weapon/storage/belt/utility/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, rt.op(f, "PickUnweighted", [3], ["red", "yellow", "orange"])]);
	return f.dot;
}, true);

rt.type(5300, "/obj/item/weapon/storage/belt/utility/full/engi", "/obj/item/weapon/storage/belt/utility/full", {});

// /obj/item/weapon/storage/belt/utility/full/engi/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:66)  may sleep
rt.def("/obj/item/weapon/storage/belt/utility/full/engi/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/largetank"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, rt.op(f, "PickUnweighted", [3], ["red", "yellow", "orange"])]);
	return f.dot;
}, true);

rt.type(5301, "/obj/item/weapon/storage/belt/utility/atmostech", "/obj/item/weapon/storage/belt/utility", {});

// /obj/item/weapon/storage/belt/utility/atmostech/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:76)  may sleep
rt.def("/obj/item/weapon/storage/belt/utility/atmostech/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/t_scanner"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/extinguisher/mini"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5302, "/obj/item/weapon/storage/belt/medical", "/obj/item/weapon/storage/belt", {
	name: "medical belt",
	desc: "Can hold various medical equipment.",
	icon_state: "medicalbelt",
	item_state: "medical",
	max_w_class: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/medical/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:92)
rt.def("/obj/item/weapon/storage/belt/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/dnainjector"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/stack/medical"), T("/obj/item/device/flashlight/pen"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/sensor_device"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/lazarus_injector"), T("/obj/item/weapon/bikehorn/rubberducky"), T("/obj/item/clothing/mask/surgical"), T("/obj/item/clothing/mask/breath"), T("/obj/item/clothing/mask/breath/medical"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/circular_saw"), T("/obj/item/weapon/surgicaldrill"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/hemostat"), T("/obj/item/device/geiger_counter"), T("/obj/item/clothing/neck/stethoscope"), T("/obj/item/weapon/stamp"), T("/obj/item/clothing/glasses"), T("/obj/item/weapon/wrench/medical"), T("/obj/item/clothing/mask/muzzle"), T("/obj/item/weapon/storage/bag/chemistry"), T("/obj/item/weapon/storage/bag/bio"), T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	return f.dot;
});

rt.type(5303, "/obj/item/weapon/storage/belt/security", "/obj/item/weapon/storage/belt", {
	name: "security belt",
	desc: "Can hold security gear like handcuffs and flashes.",
	icon_state: "securitybelt",
	item_state: "security",
	storage_slots: 5,
	max_w_class: 3,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/security/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:142)
rt.def("/obj/item/weapon/storage/belt/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/melee/classic_baton"), T("/obj/item/weapon/grenade"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/assembly/flash/handheld"), T("/obj/item/clothing/glasses"), T("/obj/item/ammo_casing/shotgun"), T("/obj/item/ammo_box"), T("/obj/item/weapon/reagent_containers/food/snacks/donut"), T("/obj/item/weapon/reagent_containers/food/snacks/donut/jelly"), T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/restraints/legcuffs/bola")));
	return f.dot;
});

rt.type(5304, "/obj/item/weapon/storage/belt/security/full", "/obj/item/weapon/storage/belt/security", {});

// /obj/item/weapon/storage/belt/security/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:163)  may sleep
rt.def("/obj/item/weapon/storage/belt/security/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/reagent_containers/spray/pepper"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/flashbang"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/melee/baton/loaded"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(5305, "/obj/item/weapon/storage/belt/mining", "/obj/item/weapon/storage/belt", {
	name: "explorer's webbing",
	desc: "A versatile chest rig, cherished by miners and hunters alike.",
	icon_state: "explorer1",
	item_state: "explorer1",
	storage_slots: 6,
	w_class: 4,
	max_w_class: 4,
	max_combined_w_class: 20,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/mining/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:180)
rt.def("/obj/item/weapon/storage/belt/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/crowbar"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/weldingtool"), T("/obj/item/weapon/wirecutters"), T("/obj/item/weapon/wrench"), T("/obj/item/device/flashlight"), T("/obj/item/stack/cable_coil"), T("/obj/item/device/analyzer"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/device/radio"), T("/obj/item/clothing/gloves"), T("/obj/item/weapon/resonator"), T("/obj/item/device/mining_scanner"), T("/obj/item/weapon/pickaxe"), T("/obj/item/stack/sheet/animalhide"), T("/obj/item/stack/sheet/sinew"), T("/obj/item/stack/sheet/bone"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), T("/obj/item/stack/medical"), T("/obj/item/weapon/kitchen/knife"), T("/obj/item/weapon/reagent_containers/hypospray"), T("/obj/item/device/gps"), T("/obj/item/weapon/storage/bag/ore"), T("/obj/item/weapon/survivalcapsule"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/storage/pill_bottle"), T("/obj/item/weapon/ore"), T("/obj/item/weapon/reagent_containers/food/drinks"), T("/obj/item/organ/regenerative_core"), T("/obj/item/device/wormhole_jaunter"), T("/obj/item/weapon/storage/bag/plants"), T("/obj/item/stack/marker_beacon")));
	return f.dot;
});

rt.type(5306, "/obj/item/weapon/storage/belt/mining/vendor", "/obj/item/weapon/storage/belt/mining", {
	contents: null,
});

// /obj/item/weapon/storage/belt/mining/vendor/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:220)  may sleep
rt.def("/obj/item/weapon/storage/belt/mining/vendor/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "contents", rt.list((yield* g.new_(f, T("/obj/item/weapon/survivalcapsule"), []))));
	return f.dot;
}, true);

rt.type(5309, "/obj/item/weapon/storage/belt/soulstone", "/obj/item/weapon/storage/belt", {
	name: "soul stone belt",
	desc: "Designed for ease of access to the shards during a fight, as to not let a single enemy spirit slip away",
	icon_state: "soulstonebelt",
	item_state: "soulstonebelt",
	storage_slots: 6,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/soulstone/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:239)
rt.def("/obj/item/weapon/storage/belt/soulstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/device/soulstone")));
	return f.dot;
});

rt.type(5310, "/obj/item/weapon/storage/belt/soulstone/full", "/obj/item/weapon/storage/belt/soulstone", {});

// /obj/item/weapon/storage/belt/soulstone/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:244)  may sleep
rt.def("/obj/item/weapon/storage/belt/soulstone/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 6, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/device/soulstone"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5288, "/obj/item/weapon/storage/belt/champion", "/obj/item/weapon/storage/belt", {
	name: "championship belt",
	desc: "Proves to the world that you are the strongest!",
	icon_state: "championbelt",
	item_state: "champion",
	materials: null,
	storage_slots: 1,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/champion/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:252)
rt.def("/obj/item/weapon/storage/belt/champion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 400]));
	$0 = $0;
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/clothing/mask/luchador")));
	return f.dot;
});

rt.type(5293, "/obj/item/weapon/storage/belt/military/abductor/full", "/obj/item/weapon/storage/belt/military/abductor", {});

// /obj/item/weapon/storage/belt/military/abductor/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:273)  may sleep
rt.def("/obj/item/weapon/storage/belt/military/abductor/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool/abductor"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, "white"]);
	return f.dot;
}, true);

rt.type(5311, "/obj/item/weapon/storage/belt/grenade", "/obj/item/weapon/storage/belt", {
	name: "grenadier belt",
	desc: "A belt for holding grenades.",
	icon_state: "grenadebeltnew",
	item_state: "security",
	max_w_class: 4,
	display_contents_with_number: 1,
	storage_slots: 30,
	max_combined_w_class: 60,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/grenade/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:304)
rt.def("/obj/item/weapon/storage/belt/grenade/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/grenade"), T("/obj/item/weapon/screwdriver"), T("/obj/item/weapon/lighter"), T("/obj/item/device/multitool"), T("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov"), T("/obj/item/weapon/grenade/plastic/c4")));
	return f.dot;
});

rt.type(5312, "/obj/item/weapon/storage/belt/grenade/full", "/obj/item/weapon/storage/belt/grenade", {});

// /obj/item/weapon/storage/belt/grenade/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:313)  may sleep
rt.def("/obj/item/weapon/storage/belt/grenade/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/grenade/flashbang"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/smokebomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/smokebomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/smokebomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/smokebomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/empgrenade"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb/concussion/frag"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/gluon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/gluon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/gluon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/gluon"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/incendiary"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/incendiary"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/facid"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/grenade/syndieminibomb"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5313, "/obj/item/weapon/storage/belt/wands", "/obj/item/weapon/storage/belt", {
	name: "wand belt",
	desc: "A belt designed to hold various rods of power. A veritable fanny pack of exotic magic.",
	icon_state: "soulstonebelt",
	item_state: "soulstonebelt",
	storage_slots: 6,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/wands/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:348)
rt.def("/obj/item/weapon/storage/belt/wands/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/gun/magic/wand")));
	return f.dot;
});

rt.type(5314, "/obj/item/weapon/storage/belt/wands/full", "/obj/item/weapon/storage/belt/wands", {});

// /obj/item/weapon/storage/belt/wands/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:353)  may sleep
rt.def("/obj/item/weapon/storage/belt/wands/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/death"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/resurrection"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/polymorph"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/teleport"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/door"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/fireball"), [live(f.src)]);
	W = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/weapon/gun/magic/wand"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		rt.setFv(f, "max_charges", live(W), rt.initial(f, live(W), "max_charges"));
		rt.setFv(f, "charges", live(W), rt.fv(f, "max_charges", live(W)));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5315, "/obj/item/weapon/storage/belt/janitor", "/obj/item/weapon/storage/belt", {
	name: "janibelt",
	desc: "A belt used to hold most janitorial supplies.",
	icon_state: "janibelt",
	item_state: "janibelt",
	storage_slots: 6,
	max_w_class: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/janitor/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:371)
rt.def("/obj/item/weapon/storage/belt/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/grenade/chem_grenade"), T("/obj/item/device/lightreplacer"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/reagent_containers/spray"), T("/obj/item/weapon/soap"), T("/obj/item/weapon/holosign_creator"), T("/obj/item/key/janitor"), T("/obj/item/clothing/gloves")));
	return f.dot;
});

rt.type(5316, "/obj/item/weapon/storage/belt/bandolier", "/obj/item/weapon/storage/belt", {
	name: "bandolier",
	desc: "A bandolier for holding shotgun ammunition.",
	icon_state: "bandolier",
	item_state: "bandolier",
	storage_slots: 18,
	display_contents_with_number: 1,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/bandolier/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:389)
rt.def("/obj/item/weapon/storage/belt/bandolier/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/ammo_casing/shotgun")));
	return f.dot;
});

rt.type(5317, "/obj/item/weapon/storage/belt/holster", "/obj/item/weapon/storage/belt", {
	name: "shoulder holster",
	desc: "A holster to carry a handgun and ammo. WARNING: Badasses only.",
	icon_state: "holster",
	item_state: "holster",
	storage_slots: 3,
	max_w_class: 3,
	alternate_worn_layer: 15,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/holster/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:400)
rt.def("/obj/item/weapon/storage/belt/holster/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/gun/ballistic/automatic/pistol"), T("/obj/item/weapon/gun/ballistic/revolver"), T("/obj/item/ammo_box")));
	return f.dot;
});

rt.type(5318, "/obj/item/weapon/storage/belt/holster/full", "/obj/item/weapon/storage/belt/holster", {});

// /obj/item/weapon/storage/belt/holster/full/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:408)  may sleep
rt.def("/obj/item/weapon/storage/belt/holster/full/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/detective"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/c38"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/ammo_box/c38"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5330, "/obj/item/weapon/storage/belt/sabre", "/obj/item/weapon/storage/belt", {
	name: "sabre sheath",
	desc: "An ornate sheath designed to hold an officer's blade.",
	icon_state: "sheath",
	item_state: "sheath",
	storage_slots: 1,
	w_class: 4,
	max_w_class: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/belt/sabre/proc/<init>  (code/game/objects/items/weapons/storage/belt.dm:478)
rt.def("/obj/item/weapon/storage/belt/sabre/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/melee/sabre")));
	return f.dot;
});

// /obj/item/weapon/storage/belt/sabre/proc/examine  (code/game/objects/items/weapons/storage/belt.dm:483)
rt.def("/obj/item/weapon/storage/belt/sabre/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click it to quickly draw the blade.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/storage/belt/sabre/proc/AltClick  (code/game/objects/items/weapons/storage/belt.dm:488)  may sleep
rt.def("/obj/item/weapon/storage/belt/sabre/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let I: Value = null;
	f.vars = () => [user, I];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named))))) {
		return live(f.dot);
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		I = rt.index(rt.sv(f, "contents"), 1);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ takes ＀ out of ＀.", [live(user), live(I), live(f.src)]), fmt("<span class='notice'>You take ＀ out of ＀.</span>", [live(I), live(f.src)])]);
		yield* g.callName(f, live(user), "put_in_hands", [live(I)]);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is empty.", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/storage/belt/sabre/proc/update_icon  (code/game/objects/items/weapons/storage/belt.dm:500)  may sleep
rt.def("/obj/item/weapon/storage/belt/sabre/proc/update_icon", function* update_icon(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	rt.setSv(f, "icon_state", "sheath");
	rt.setSv(f, "item_state", "sheath");
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		rt.modSrcVar(f, "icon_state", "-sabre", add);
		rt.modSrcVar(f, "item_state", "-sabre", add);
	}
	if ((truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, (L = rt.sv(f, "loc")), "regenerate_icons", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/storage/belt/sabre/proc/PopulateContents  (code/game/objects/items/weapons/storage/belt.dm:512)  may sleep
rt.def("/obj/item/weapon/storage/belt/sabre/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/melee/sabre"), [live(f.src)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);
