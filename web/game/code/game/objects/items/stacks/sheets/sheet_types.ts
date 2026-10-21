// From code/game/objects/items/stacks/sheets/sheet_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmetal_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalmetal_recipes", function InitGlobalmetal_recipes(f: Frame) {
	rt.setGl("metal_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "stool", null, T("/obj/structure/chair/stool"), "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "bar stool", null, T("/obj/structure/chair/stool/bar"), "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "chair", null, T("/obj/structure/chair"), "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "swivel chair", null, T("/obj/structure/chair/office/dark"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "comfy chair", null, T("/obj/structure/chair/comfy/beige"), null, 2, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "bed", null, T("/obj/structure/bed"), null, 2, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), ["rack parts", T("/obj/item/weapon/rack_parts")]), rt.new_(f, T("/datum/stack_recipe"), [null, "closet", null, T("/obj/structure/closet"), null, 2, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), [null, "canister", null, T("/obj/machinery/portable_atmospherics/canister"), null, 10, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), ["floor tile", T("/obj/item/stack/tile/plasteel"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), ["metal rod", T("/obj/item/stack/rods"), 1, 2, 60]), null, rt.new_(f, T("/datum/stack_recipe"), [null, "wall girders", null, T("/obj/structure/girder"), null, 2, "time", 40, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), [null, "computer frame", null, T("/obj/structure/frame/computer"), null, 5, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "modular console", null, T("/obj/machinery/modular_computer/console/buildable"), null, 10, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "machine frame", null, T("/obj/structure/frame/machine"), null, 5, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "airlock assembly", null, T("/obj/structure/door_assembly"), null, 4, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "firelock frame", null, T("/obj/structure/firelock_frame"), null, 3, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "turret frame", null, T("/obj/machinery/porta_turret_construct"), null, 5, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "meatspike frame", null, T("/obj/structure/kitchenspike_frame"), null, 5, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "reflector frame", null, T("/obj/structure/reflector"), null, 5, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), ["grenade casing", T("/obj/item/weapon/grenade/chem_grenade")]), rt.new_(f, T("/datum/stack_recipe"), ["light fixture frame", T("/obj/item/wallframe/light_fixture"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["small light fixture frame", T("/obj/item/wallframe/light_fixture/small"), 1]), null, rt.new_(f, T("/datum/stack_recipe"), ["apc frame", T("/obj/item/wallframe/apc"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["air alarm frame", T("/obj/item/wallframe/airalarm"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["fire alarm frame", T("/obj/item/wallframe/firealarm"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["extinguisher cabinet frame", T("/obj/item/wallframe/extinguisher_cabinet"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["button frame", T("/obj/item/wallframe/button"), 1]), null, rt.new_(f, T("/datum/stack_recipe"), [null, "iron door", null, T("/obj/structure/mineral_door/iron"), null, 20, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "floodlight frame", null, T("/obj/structure/floodlight_frame"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "metal_recipes", add);
	return f.dot;
});

rt.type(9012, "/obj/item/stack/sheet/metal", "/obj/item/stack/sheet", {
	flags: 64,
	name: "metal",
	desc: "Sheets made out of metal.",
	singular_name: "metal sheet",
	icon_state: "sheet-metal",
	materials: null,
	throwforce: 10,
	origin_tech: "materials=1",
	resistance_flags: 2,
	merge_type: rt.typePath("/obj/item/stack/sheet/metal"),
});

// /obj/item/stack/sheet/metal/proc/<init>  (code/game/objects/items/stacks/sheets/sheet_types.dm:63)
rt.def("/obj/item/stack/sheet/metal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/stack/sheet/metal/proc/ratvar_act  (code/game/objects/items/stacks/sheets/sheet_types.dm:71)  may sleep
rt.def("/obj/item/stack/sheet/metal/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/brass"), [rt.sv(f, "loc"), rt.sv(f, "amount")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/stack/sheet/metal/proc/narsie_act  (code/game/objects/items/stacks/sheets/sheet_types.dm:75)  may sleep
rt.def("/obj/item/stack/sheet/metal/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.sv(f, "loc"), rt.sv(f, "amount")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9016, "/obj/item/stack/sheet/metal/cyborg", "/obj/item/stack/sheet/metal", {
	materials: null,
	is_cyborg: 1,
	cost: 500,
});

// /obj/item/stack/sheet/metal/cyborg/proc/<init>  (code/game/objects/items/stacks/sheets/sheet_types.dm:88)
rt.def("/obj/item/stack/sheet/metal/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/stack/sheet/metal/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:93)  may sleep
rt.def("/obj/item/stack/sheet/metal/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("metal_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalplasteel_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:99)
rt.def("/datum/controller/global_vars/proc/InitGlobalplasteel_recipes", function InitGlobalplasteel_recipes(f: Frame) {
	rt.setGl("plasteel_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "AI core", null, T("/obj/structure/AIcore"), null, 4, "time", 50, "one_per_turf", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "bomb assembly", null, T("/obj/machinery/syndicatebomb/empty"), null, 10, "time", 50], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "plasteel_recipes", add);
	return f.dot;
});

rt.type(9017, "/obj/item/stack/sheet/plasteel", "/obj/item/stack/sheet", {
	flags: 64,
	name: "plasteel",
	singular_name: "plasteel sheet",
	desc: "This sheet is an alloy of iron and plasma.",
	icon_state: "sheet-plasteel",
	item_state: "sheet-metal",
	materials: null,
	throwforce: 10,
	origin_tech: "materials=2",
	armor: null,
	resistance_flags: 2,
	merge_type: rt.typePath("/obj/item/stack/sheet/plasteel"),
});

// /obj/item/stack/sheet/plasteel/proc/<init>  (code/game/objects/items/stacks/sheets/sheet_types.dm:110)
rt.def("/obj/item/stack/sheet/plasteel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000, "$plasma", 2000]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 80]));
	return f.dot;
});

// /obj/item/stack/sheet/plasteel/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:119)  may sleep
rt.def("/obj/item/stack/sheet/plasteel/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("plasteel_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalwood_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:131)
rt.def("/datum/controller/global_vars/proc/InitGlobalwood_recipes", function InitGlobalwood_recipes(f: Frame) {
	rt.setGl("wood_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["wooden sandals", T("/obj/item/clothing/shoes/sandal"), 1]), rt.new_(f, T("/datum/stack_recipe"), ["wood floor tile", T("/obj/item/stack/tile/wood"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "wood table frame", null, T("/obj/structure/table_frame/wood"), null, 2, "time", 10], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "rifle stock", null, T("/obj/item/weaponcrafting/stock"), null, 10, "time", 40], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "rolling pin", null, T("/obj/item/weapon/kitchen/rollingpin"), null, 2, "time", 30], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "wooden chair", null, T("/obj/structure/chair/wood"), null, 3, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "winged wooden chair", null, T("/obj/structure/chair/wood/wings"), null, 3, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "wooden barricade", null, T("/obj/structure/barricade/wooden"), null, 5, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "wooden door", null, T("/obj/structure/mineral_door/wood"), null, 10, "time", 20, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "coffin", null, T("/obj/structure/closet/coffin"), null, 5, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "book case", null, T("/obj/structure/bookcase"), null, 4, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "drying rack", null, T("/obj/machinery/smartfridge/drying_rack"), null, 10, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "dog bed", null, T("/obj/structure/bed/dogbed"), null, 10, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "dresser", null, T("/obj/structure/dresser"), null, 10, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "picture frame", null, T("/obj/item/wallframe/picture"), null, 1, "time", 10], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "display case chassis", null, T("/obj/structure/displaycase_chassis"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "wooden buckler", null, T("/obj/item/weapon/shield/riot/buckler"), null, 20, "time", 40], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "apiary", null, T("/obj/structure/beebox"), null, 40, "time", 50], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["tiki mask", T("/obj/item/clothing/mask/gas/tiki_mask"), 2]), rt.new_(f, T("/datum/stack_recipe"), [null, "honey frame", null, T("/obj/item/honey_frame"), null, 5, "time", 10], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "ore box", null, T("/obj/structure/ore_box"), null, 4, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "wooden crate", null, T("/obj/structure/closet/crate/wooden"), null, 6, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "baseball bat", null, T("/obj/item/weapon/melee/baseball_bat"), null, 5, "time", 15], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "wood_recipes", add);
	return f.dot;
});

rt.type(9058, "/obj/item/stack/sheet/mineral/wood", "/obj/item/stack/sheet/mineral", {
	name: "wooden plank",
	desc: "One can only guess that this is a bunch of wood.",
	singular_name: "wood plank",
	icon_state: "sheet-wood",
	icon: rt.rsc("icons/obj/items.dmi"),
	origin_tech: "materials=1;biotech=1",
	sheettype: "wood",
	armor: null,
	resistance_flags: 4,
	merge_type: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	novariants: 1,
});

// /obj/item/stack/sheet/mineral/wood/proc/<init>  (code/game/objects/items/stacks/sheets/sheet_types.dm:165)
rt.def("/obj/item/stack/sheet/mineral/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]));
	return f.dot;
});

// /obj/item/stack/sheet/mineral/wood/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:171)  may sleep
rt.def("/obj/item/stack/sheet/mineral/wood/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("wood_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalcloth_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:180)
rt.def("/datum/controller/global_vars/proc/InitGlobalcloth_recipes", function InitGlobalcloth_recipes(f: Frame) {
	rt.setGl("cloth_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["grey jumpsuit", T("/obj/item/clothing/under/color/grey"), 3]), rt.new_(f, T("/datum/stack_recipe"), ["black shoes", T("/obj/item/clothing/shoes/sneakers/black"), 2]), null, rt.new_(f, T("/datum/stack_recipe"), ["backpack", T("/obj/item/weapon/storage/backpack"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["duffel bag", T("/obj/item/weapon/storage/backpack/duffelbag"), 6]), null, rt.new_(f, T("/datum/stack_recipe"), ["plant bag", T("/obj/item/weapon/storage/bag/plants"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["book bag", T("/obj/item/weapon/storage/bag/books"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["mining satchel", T("/obj/item/weapon/storage/bag/ore"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["chemistry bag", T("/obj/item/weapon/storage/bag/chemistry"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["bio bag", T("/obj/item/weapon/storage/bag/bio"), 4]), null, rt.new_(f, T("/datum/stack_recipe"), ["improvised gauze", T("/obj/item/stack/medical/gauze/improvised"), 1, 2, 6]), rt.new_(f, T("/datum/stack_recipe"), ["rag", T("/obj/item/weapon/reagent_containers/glass/rag"), 1]), rt.new_(f, T("/datum/stack_recipe"), ["bedsheet", T("/obj/item/weapon/bedsheet"), 3]), rt.new_(f, T("/datum/stack_recipe"), ["empty sandbag", T("/obj/item/weapon/emptysandbag"), 4]), null, rt.new_(f, T("/datum/stack_recipe"), ["fingerless gloves", T("/obj/item/clothing/gloves/fingerless"), 1]), rt.new_(f, T("/datum/stack_recipe"), ["black gloves", T("/obj/item/clothing/gloves/color/black"), 3]), null, rt.new_(f, T("/datum/stack_recipe"), ["blindfold", T("/obj/item/clothing/glasses/sunglasses/blindfold"), 2])));
	rt.modSrcVar(f, "gvars_datum_init_order", "cloth_recipes", add);
	return f.dot;
});

rt.type(9060, "/obj/item/stack/sheet/cloth", "/obj/item/stack/sheet", {
	name: "cloth",
	desc: "Is it cotton? Linen? Denim? Burlap? Canvas? You can't tell.",
	singular_name: "cloth roll",
	icon_state: "sheet-cloth",
	origin_tech: "materials=2",
	resistance_flags: 4,
	force: 0,
	throwforce: 0,
	merge_type: rt.typePath("/obj/item/stack/sheet/cloth"),
});

// /obj/item/stack/sheet/cloth/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:216)  may sleep
rt.def("/obj/item/stack/sheet/cloth/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("cloth_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalcardboard_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:225)
rt.def("/datum/controller/global_vars/proc/InitGlobalcardboard_recipes", function InitGlobalcardboard_recipes(f: Frame) {
	rt.setGl("cardboard_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["box", T("/obj/item/weapon/storage/box")]), rt.new_(f, T("/datum/stack_recipe"), ["light tubes", T("/obj/item/weapon/storage/box/lights/tubes")]), rt.new_(f, T("/datum/stack_recipe"), ["light bulbs", T("/obj/item/weapon/storage/box/lights/bulbs")]), rt.new_(f, T("/datum/stack_recipe"), ["mouse traps", T("/obj/item/weapon/storage/box/mousetraps")]), rt.new_(f, T("/datum/stack_recipe"), ["cardborg suit", T("/obj/item/clothing/suit/cardborg"), 3]), rt.new_(f, T("/datum/stack_recipe"), ["cardborg helmet", T("/obj/item/clothing/head/cardborg")]), rt.new_(f, T("/datum/stack_recipe"), ["pizza box", T("/obj/item/pizzabox")]), rt.new_(f, T("/datum/stack_recipe"), ["folder", T("/obj/item/weapon/folder")]), rt.new_(f, T("/datum/stack_recipe"), ["large box", T("/obj/structure/closet/cardboard"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["cardboard cutout", T("/obj/item/cardboard_cutout"), 5])));
	rt.modSrcVar(f, "gvars_datum_init_order", "cardboard_recipes", add);
	return f.dot;
});

rt.type(9062, "/obj/item/stack/sheet/cardboard", "/obj/item/stack/sheet", {
	name: "cardboard",
	desc: "Large sheets of card, like boxes folded flat.",
	singular_name: "cardboard sheet",
	icon_state: "sheet-card",
	origin_tech: "materials=1",
	resistance_flags: 4,
	merge_type: rt.typePath("/obj/item/stack/sheet/cardboard"),
	novariants: 1,
});

// /obj/item/stack/sheet/cardboard/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:249)  may sleep
rt.def("/obj/item/stack/sheet/cardboard/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("cardboard_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalruned_metal_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:259)
rt.def("/datum/controller/global_vars/proc/InitGlobalruned_metal_recipes", function InitGlobalruned_metal_recipes(f: Frame) {
	rt.setGl("runed_metal_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "runed door", null, T("/obj/machinery/door/airlock/cult"), null, 1, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "runed girder", null, T("/obj/structure/girder/cult"), null, 1, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "pylon", null, T("/obj/structure/destructible/cult/pylon"), null, 4, "time", 40, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "forge", null, T("/obj/structure/destructible/cult/forge"), null, 3, "time", 40, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "archives", null, T("/obj/structure/destructible/cult/tome"), null, 3, "time", 40, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "altar", null, T("/obj/structure/destructible/cult/talisman"), null, 3, "time", 40, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "runed_metal_recipes", add);
	return f.dot;
});

rt.type(9064, "/obj/item/stack/sheet/runed_metal", "/obj/item/stack/sheet", {
	name: "runed metal",
	desc: "Sheets of cold metal with shifting inscriptions writ upon them.",
	singular_name: "runed metal sheet",
	icon_state: "sheet-runed",
	icon: rt.rsc("icons/obj/items.dmi"),
	sheettype: "runed",
	merge_type: rt.typePath("/obj/item/stack/sheet/runed_metal"),
	novariants: 1,
});

// /obj/item/stack/sheet/runed_metal/proc/ratvar_act  (code/game/objects/items/stacks/sheets/sheet_types.dm:279)  may sleep
rt.def("/obj/item/stack/sheet/runed_metal/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/tile/brass"), [rt.sv(f, "loc"), rt.sv(f, "amount")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/stack/sheet/runed_metal/proc/attack_self  (code/game/objects/items/stacks/sheets/sheet_types.dm:283)  may sleep
rt.def("/obj/item/stack/sheet/runed_metal/proc/attack_self", function* attack_self(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Only one with forbidden knowledge could hope to work this metal...</span>"]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

// /obj/item/stack/sheet/runed_metal/proc/attack  (code/game/objects/items/stacks/sheets/sheet_types.dm:289)  may sleep
rt.def("/obj/item/stack/sheet/runed_metal/proc/attack", function* attack(f: Frame) {
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Only one with forbidden knowledge could hope to work this metal...</span>"]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/stack/sheet/runed_metal/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:295)  may sleep
rt.def("/obj/item/stack/sheet/runed_metal/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("runed_metal_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalbrass_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:307)
rt.def("/datum/controller/global_vars/proc/InitGlobalbrass_recipes", function InitGlobalbrass_recipes(f: Frame) {
	rt.setGl("brass_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "wall gear", null, T("/obj/structure/destructible/clockwork/wall_gear"), null, 3, "time", 30, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), [null, "pinion airlock", null, T("/obj/machinery/door/airlock/clockwork"), null, 5, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "brass pinion airlock", null, T("/obj/machinery/door/airlock/clockwork/brass"), null, 5, "time", 50, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "brass windoor", null, T("/obj/machinery/door/window/clockwork"), null, 2, "time", 30, "on_floor", 1, "window_checks", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), [null, "directional brass window", null, T("/obj/structure/window/reinforced/clockwork/unanchored"), "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "fulltile brass window", null, T("/obj/structure/window/reinforced/clockwork/fulltile/unanchored"), null, 2, "time", 0, "on_floor", 1, "window_checks", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "brass table frame", null, T("/obj/structure/table_frame/brass"), null, 1, "time", 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "brass_recipes", add);
	return f.dot;
});

rt.type(8972, "/obj/item/stack/tile/brass", "/obj/item/stack/tile", {
	throw_speed: 1,
	throw_range: 3,
	name: "brass",
	desc: "Sheets made out of brass.",
	singular_name: "brass sheet",
	icon_state: "sheet-brass",
	icon: rt.rsc("icons/obj/items.dmi"),
	resistance_flags: 34,
	throwforce: 10,
	max_amount: 50,
	turf_type: rt.typePath("/turf/open/floor/clockwork"),
	novariants: 0,
});

// /obj/item/stack/tile/brass/proc/narsie_act  (code/game/objects/items/stacks/sheets/sheet_types.dm:334)  may sleep
rt.def("/obj/item/stack/tile/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/item/stack/sheet/runed_metal"), [rt.sv(f, "loc"), rt.sv(f, "amount")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/stack/tile/brass/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:338)  may sleep
rt.def("/obj/item/stack/tile/brass/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("brass_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", 0);
	rt.setSv(f, "pixel_y", 0);
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalplastic_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:377)
rt.def("/datum/controller/global_vars/proc/InitGlobalplastic_recipes", function InitGlobalplastic_recipes(f: Frame) {
	rt.setGl("plastic_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "plastic flaps", null, T("/obj/structure/plasticflaps"), null, 5, "one_per_turf", 1, "on_floor", 1, "time", 40], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["water bottle", T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty")]), rt.new_(f, T("/datum/stack_recipe"), ["large water bottle", T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty"), 3]), rt.new_(f, T("/datum/stack_recipe"), ["wet floor sign", T("/obj/item/weapon/caution"), 2])));
	rt.modSrcVar(f, "gvars_datum_init_order", "plastic_recipes", add);
	return f.dot;
});

rt.type(9070, "/obj/item/stack/sheet/plastic", "/obj/item/stack/sheet", {
	name: "plastic",
	desc: "Compress dinosaur over millions of years, then refine, split and mold, and voila! You have plastic.",
	singular_name: "plastic sheet",
	icon_state: "sheet-plastic",
	throwforce: 7,
	origin_tech: "materials=1;biotech=1",
	merge_type: rt.typePath("/obj/item/stack/sheet/plastic"),
});

// /obj/item/stack/sheet/plastic/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:400)  may sleep
rt.def("/obj/item/stack/sheet/plastic/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("plastic_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalpaperframe_recipes  (code/game/objects/items/stacks/sheets/sheet_types.dm:403)
rt.def("/datum/controller/global_vars/proc/InitGlobalpaperframe_recipes", function InitGlobalpaperframe_recipes(f: Frame) {
	rt.setGl("paperframe_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "paper frame separator", null, T("/obj/structure/window/paperframe"), null, 2, "one_per_turf", 1, "on_floor", 1, "time", 10], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "paper frame door", null, T("/obj/structure/mineral_door/paperframe"), null, 3, "one_per_turf", 1, "on_floor", 1, "time", 10], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "paperframe_recipes", add);
	return f.dot;
});

rt.type(9073, "/obj/item/stack/sheet/paperframes", "/obj/item/stack/sheet", {
	name: "paper frames",
	desc: "A thin wooden frame with paper attached.",
	singular_name: "paper frame",
	icon_state: "sheet-paper",
	origin_tech: "materials=1",
	merge_type: rt.typePath("/obj/item/stack/sheet/paperframes"),
	resistance_flags: 4,
});

// /obj/item/stack/sheet/paperframes/proc/Initialize  (code/game/objects/items/stacks/sheets/sheet_types.dm:417)  may sleep
rt.def("/obj/item/stack/sheet/paperframes/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "recipes", rt.gl("paperframe_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
