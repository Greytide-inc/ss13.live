// Based on /tg/station's code/game/objects/items/stacks/sheets/sheet_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// sheet_types.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalmetal_recipes", function InitGlobalmetal_recipes(f: Frame) {
	GLOB.metal_recipes = list(new_(T("/datum/stack_recipe"), "stool", T("/obj/structure/chair/stool"), { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "bar stool", T("/obj/structure/chair/stool/bar"), { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "chair", T("/obj/structure/chair"), { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "swivel chair", T("/obj/structure/chair/office/dark"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "comfy chair", T("/obj/structure/chair/comfy/beige"), 2, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "bed", T("/obj/structure/bed"), 2, { one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "rack parts", T("/obj/item/weapon/rack_parts")), new_(T("/datum/stack_recipe"), "closet", T("/obj/structure/closet"), 2, { time: 15, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "canister", T("/obj/machinery/portable_atmospherics/canister"), 10, { time: 15, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "floor tile", T("/obj/item/stack/tile/plasteel"), 1, 4, 20), new_(T("/datum/stack_recipe"), "metal rod", T("/obj/item/stack/rods"), 1, 2, 60), null, new_(T("/datum/stack_recipe"), "wall girders", T("/obj/structure/girder"), 2, { time: 40, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "computer frame", T("/obj/structure/frame/computer"), 5, { time: 25, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "modular console", T("/obj/machinery/modular_computer/console/buildable"), 10, { time: 25, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "machine frame", T("/obj/structure/frame/machine"), 5, { time: 25, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "airlock assembly", T("/obj/structure/door_assembly"), 4, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "firelock frame", T("/obj/structure/firelock_frame"), 3, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "turret frame", T("/obj/machinery/porta_turret_construct"), 5, { time: 25, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "meatspike frame", T("/obj/structure/kitchenspike_frame"), 5, { time: 25, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "reflector frame", T("/obj/structure/reflector"), 5, { time: 25, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "grenade casing", T("/obj/item/weapon/grenade/chem_grenade")), new_(T("/datum/stack_recipe"), "light fixture frame", T("/obj/item/wallframe/light_fixture"), 2), new_(T("/datum/stack_recipe"), "small light fixture frame", T("/obj/item/wallframe/light_fixture/small"), 1), null, new_(T("/datum/stack_recipe"), "apc frame", T("/obj/item/wallframe/apc"), 2), new_(T("/datum/stack_recipe"), "air alarm frame", T("/obj/item/wallframe/airalarm"), 2), new_(T("/datum/stack_recipe"), "fire alarm frame", T("/obj/item/wallframe/firealarm"), 2), new_(T("/datum/stack_recipe"), "extinguisher cabinet frame", T("/obj/item/wallframe/extinguisher_cabinet"), 2), new_(T("/datum/stack_recipe"), "button frame", T("/obj/item/wallframe/button"), 1), null, new_(T("/datum/stack_recipe"), "iron door", T("/obj/structure/mineral_door/iron"), 20, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "floodlight frame", T("/obj/structure/floodlight_frame"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "metal_recipes";
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

// sheet_types.dm:63
rt.def("/obj/item/stack/sheet/metal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

// sheet_types.dm:71
rt.def("/obj/item/stack/sheet/metal/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/item/stack/tile/brass"), this.loc, this.amount);
	yield* qdel(this);
	return f.dot;
}, true);

// sheet_types.dm:75
rt.def("/obj/item/stack/sheet/metal/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/item/stack/sheet/runed_metal"), this.loc, this.amount);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9016, "/obj/item/stack/sheet/metal/cyborg", "/obj/item/stack/sheet/metal", {
	materials: null,
	is_cyborg: 1,
	cost: 500,
});

// sheet_types.dm:88
rt.def("/obj/item/stack/sheet/metal/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// sheet_types.dm:93
rt.def("/obj/item/stack/sheet/metal/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.metal_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:99
rt.def("/datum/controller/global_vars/proc/InitGlobalplasteel_recipes", function InitGlobalplasteel_recipes(f: Frame) {
	GLOB.plasteel_recipes = list(new_(T("/datum/stack_recipe"), "AI core", T("/obj/structure/AIcore"), 4, { time: 50, one_per_turf: 1 }), new_(T("/datum/stack_recipe"), "bomb assembly", T("/obj/machinery/syndicatebomb/empty"), 10, { time: 50 }));
	this.gvars_datum_init_order += "plasteel_recipes";
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

// sheet_types.dm:110
rt.def("/obj/item/stack/sheet/plasteel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000, "$plasma", 2000]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 80]);
	return f.dot;
});

// sheet_types.dm:119
rt.def("/obj/item/stack/sheet/plasteel/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.plasteel_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:131
rt.def("/datum/controller/global_vars/proc/InitGlobalwood_recipes", function InitGlobalwood_recipes(f: Frame) {
	GLOB.wood_recipes = list(new_(T("/datum/stack_recipe"), "wooden sandals", T("/obj/item/clothing/shoes/sandal"), 1), new_(T("/datum/stack_recipe"), "wood floor tile", T("/obj/item/stack/tile/wood"), 1, 4, 20), new_(T("/datum/stack_recipe"), "wood table frame", T("/obj/structure/table_frame/wood"), 2, { time: 10 }), new_(T("/datum/stack_recipe"), "rifle stock", T("/obj/item/weaponcrafting/stock"), 10, { time: 40 }), new_(T("/datum/stack_recipe"), "rolling pin", T("/obj/item/weapon/kitchen/rollingpin"), 2, { time: 30 }), new_(T("/datum/stack_recipe"), "wooden chair", T("/obj/structure/chair/wood"), 3, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "winged wooden chair", T("/obj/structure/chair/wood/wings"), 3, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "wooden barricade", T("/obj/structure/barricade/wooden"), 5, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "wooden door", T("/obj/structure/mineral_door/wood"), 10, { time: 20, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "coffin", T("/obj/structure/closet/coffin"), 5, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "book case", T("/obj/structure/bookcase"), 4, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "drying rack", T("/obj/machinery/smartfridge/drying_rack"), 10, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "dog bed", T("/obj/structure/bed/dogbed"), 10, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "dresser", T("/obj/structure/dresser"), 10, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "picture frame", T("/obj/item/wallframe/picture"), 1, { time: 10 }), new_(T("/datum/stack_recipe"), "display case chassis", T("/obj/structure/displaycase_chassis"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "wooden buckler", T("/obj/item/weapon/shield/riot/buckler"), 20, { time: 40 }), new_(T("/datum/stack_recipe"), "apiary", T("/obj/structure/beebox"), 40, { time: 50 }), new_(T("/datum/stack_recipe"), "tiki mask", T("/obj/item/clothing/mask/gas/tiki_mask"), 2), new_(T("/datum/stack_recipe"), "honey frame", T("/obj/item/honey_frame"), 5, { time: 10 }), new_(T("/datum/stack_recipe"), "ore box", T("/obj/structure/ore_box"), 4, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "wooden crate", T("/obj/structure/closet/crate/wooden"), 6, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "baseball bat", T("/obj/item/weapon/melee/baseball_bat"), 5, { time: 15 }));
	this.gvars_datum_init_order += "wood_recipes";
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

// sheet_types.dm:165
rt.def("/obj/item/stack/sheet/mineral/wood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 0]);
	return f.dot;
});

// sheet_types.dm:171
rt.def("/obj/item/stack/sheet/mineral/wood/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.wood_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:180
rt.def("/datum/controller/global_vars/proc/InitGlobalcloth_recipes", function InitGlobalcloth_recipes(f: Frame) {
	GLOB.cloth_recipes = list(new_(T("/datum/stack_recipe"), "grey jumpsuit", T("/obj/item/clothing/under/color/grey"), 3), new_(T("/datum/stack_recipe"), "black shoes", T("/obj/item/clothing/shoes/sneakers/black"), 2), null, new_(T("/datum/stack_recipe"), "backpack", T("/obj/item/weapon/storage/backpack"), 4), new_(T("/datum/stack_recipe"), "duffel bag", T("/obj/item/weapon/storage/backpack/duffelbag"), 6), null, new_(T("/datum/stack_recipe"), "plant bag", T("/obj/item/weapon/storage/bag/plants"), 4), new_(T("/datum/stack_recipe"), "book bag", T("/obj/item/weapon/storage/bag/books"), 4), new_(T("/datum/stack_recipe"), "mining satchel", T("/obj/item/weapon/storage/bag/ore"), 4), new_(T("/datum/stack_recipe"), "chemistry bag", T("/obj/item/weapon/storage/bag/chemistry"), 4), new_(T("/datum/stack_recipe"), "bio bag", T("/obj/item/weapon/storage/bag/bio"), 4), null, new_(T("/datum/stack_recipe"), "improvised gauze", T("/obj/item/stack/medical/gauze/improvised"), 1, 2, 6), new_(T("/datum/stack_recipe"), "rag", T("/obj/item/weapon/reagent_containers/glass/rag"), 1), new_(T("/datum/stack_recipe"), "bedsheet", T("/obj/item/weapon/bedsheet"), 3), new_(T("/datum/stack_recipe"), "empty sandbag", T("/obj/item/weapon/emptysandbag"), 4), null, new_(T("/datum/stack_recipe"), "fingerless gloves", T("/obj/item/clothing/gloves/fingerless"), 1), new_(T("/datum/stack_recipe"), "black gloves", T("/obj/item/clothing/gloves/color/black"), 3), null, new_(T("/datum/stack_recipe"), "blindfold", T("/obj/item/clothing/glasses/sunglasses/blindfold"), 2));
	this.gvars_datum_init_order += "cloth_recipes";
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

// sheet_types.dm:216
rt.def("/obj/item/stack/sheet/cloth/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.cloth_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:225
rt.def("/datum/controller/global_vars/proc/InitGlobalcardboard_recipes", function InitGlobalcardboard_recipes(f: Frame) {
	GLOB.cardboard_recipes = list(new_(T("/datum/stack_recipe"), "box", T("/obj/item/weapon/storage/box")), new_(T("/datum/stack_recipe"), "light tubes", T("/obj/item/weapon/storage/box/lights/tubes")), new_(T("/datum/stack_recipe"), "light bulbs", T("/obj/item/weapon/storage/box/lights/bulbs")), new_(T("/datum/stack_recipe"), "mouse traps", T("/obj/item/weapon/storage/box/mousetraps")), new_(T("/datum/stack_recipe"), "cardborg suit", T("/obj/item/clothing/suit/cardborg"), 3), new_(T("/datum/stack_recipe"), "cardborg helmet", T("/obj/item/clothing/head/cardborg")), new_(T("/datum/stack_recipe"), "pizza box", T("/obj/item/pizzabox")), new_(T("/datum/stack_recipe"), "folder", T("/obj/item/weapon/folder")), new_(T("/datum/stack_recipe"), "large box", T("/obj/structure/closet/cardboard"), 4), new_(T("/datum/stack_recipe"), "cardboard cutout", T("/obj/item/cardboard_cutout"), 5));
	this.gvars_datum_init_order += "cardboard_recipes";
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

// sheet_types.dm:249
rt.def("/obj/item/stack/sheet/cardboard/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.cardboard_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:259
rt.def("/datum/controller/global_vars/proc/InitGlobalruned_metal_recipes", function InitGlobalruned_metal_recipes(f: Frame) {
	GLOB.runed_metal_recipes = list(new_(T("/datum/stack_recipe"), "runed door", T("/obj/machinery/door/airlock/cult"), 1, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "runed girder", T("/obj/structure/girder/cult"), 1, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "pylon", T("/obj/structure/destructible/cult/pylon"), 4, { time: 40, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "forge", T("/obj/structure/destructible/cult/forge"), 3, { time: 40, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "archives", T("/obj/structure/destructible/cult/tome"), 3, { time: 40, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "altar", T("/obj/structure/destructible/cult/talisman"), 3, { time: 40, one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "runed_metal_recipes";
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

// sheet_types.dm:279
rt.def("/obj/item/stack/sheet/runed_metal/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/item/stack/tile/brass"), this.loc, this.amount);
	yield* qdel(this);
	return f.dot;
}, true);

// sheet_types.dm:283
rt.def("/obj/item/stack/sheet/runed_metal/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!iscultist(user)) {
		to_chat(user, "<span class='warning'>Only one with forbidden knowledge could hope to work this metal...</span>");
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// sheet_types.dm:289
rt.def("/obj/item/stack/sheet/runed_metal/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	if (!iscultist(user)) {
		to_chat(user, "<span class='warning'>Only one with forbidden knowledge could hope to work this metal...</span>");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// sheet_types.dm:295
rt.def("/obj/item/stack/sheet/runed_metal/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.runed_metal_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:307
rt.def("/datum/controller/global_vars/proc/InitGlobalbrass_recipes", function InitGlobalbrass_recipes(f: Frame) {
	GLOB.brass_recipes = list(new_(T("/datum/stack_recipe"), "wall gear", T("/obj/structure/destructible/clockwork/wall_gear"), 3, { time: 30, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "pinion airlock", T("/obj/machinery/door/airlock/clockwork"), 5, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "brass pinion airlock", T("/obj/machinery/door/airlock/clockwork/brass"), 5, { time: 50, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "brass windoor", T("/obj/machinery/door/window/clockwork"), 2, { time: 30, on_floor: 1, window_checks: 1 }), null, new_(T("/datum/stack_recipe"), "directional brass window", T("/obj/structure/window/reinforced/clockwork/unanchored"), { time: 0, on_floor: 1, window_checks: 1 }), new_(T("/datum/stack_recipe"), "fulltile brass window", T("/obj/structure/window/reinforced/clockwork/fulltile/unanchored"), 2, { time: 0, on_floor: 1, window_checks: 1 }), new_(T("/datum/stack_recipe"), "brass table frame", T("/obj/structure/table_frame/brass"), 1, { time: 5, one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "brass_recipes";
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

// sheet_types.dm:334
rt.def("/obj/item/stack/tile/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/item/stack/sheet/runed_metal"), this.loc, this.amount);
	yield* qdel(this);
	return f.dot;
}, true);

// sheet_types.dm:338
rt.def("/obj/item/stack/tile/brass/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.brass_recipes;
	f.dot = (yield* parent_proc());
	this.pixel_x = 0;
	this.pixel_y = 0;
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:377
rt.def("/datum/controller/global_vars/proc/InitGlobalplastic_recipes", function InitGlobalplastic_recipes(f: Frame) {
	GLOB.plastic_recipes = list(new_(T("/datum/stack_recipe"), "plastic flaps", T("/obj/structure/plasticflaps"), 5, { one_per_turf: 1, on_floor: 1, time: 40 }), new_(T("/datum/stack_recipe"), "water bottle", T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/empty")), new_(T("/datum/stack_recipe"), "large water bottle", T("/obj/item/weapon/reagent_containers/glass/beaker/waterbottle/large/empty"), 3), new_(T("/datum/stack_recipe"), "wet floor sign", T("/obj/item/weapon/caution"), 2));
	this.gvars_datum_init_order += "plastic_recipes";
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

// sheet_types.dm:400
rt.def("/obj/item/stack/sheet/plastic/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.plastic_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// sheet_types.dm:403
rt.def("/datum/controller/global_vars/proc/InitGlobalpaperframe_recipes", function InitGlobalpaperframe_recipes(f: Frame) {
	GLOB.paperframe_recipes = list(new_(T("/datum/stack_recipe"), "paper frame separator", T("/obj/structure/window/paperframe"), 2, { one_per_turf: 1, on_floor: 1, time: 10 }), new_(T("/datum/stack_recipe"), "paper frame door", T("/obj/structure/mineral_door/paperframe"), 3, { one_per_turf: 1, on_floor: 1, time: 10 }));
	this.gvars_datum_init_order += "paperframe_recipes";
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

// sheet_types.dm:417
rt.def("/obj/item/stack/sheet/paperframes/proc/Initialize", function* Initialize(f: Frame) {
	this.recipes = GLOB.paperframe_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
