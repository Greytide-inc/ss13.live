// Based on /tg/station's code/game/objects/items/stacks/sheets/mineral.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9041, "/obj/item/stack/sheet/mineral", "/obj/item/stack/sheet", {
	icon: rt.rsc("icons/obj/mining.dmi"),
});

// mineral.dm:26
rt.def("/obj/item/stack/sheet/mineral/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	this.pixel_x = rand(-4, 4);
	this.pixel_y = rand(-4, 4);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mineral.dm:34
rt.def("/datum/controller/global_vars/proc/InitGlobalsandstone_recipes", function InitGlobalsandstone_recipes(f: Frame) {
	GLOB.sandstone_recipes = list(new_(T("/datum/stack_recipe"), "pile of dirt", T("/obj/machinery/hydroponics/soil"), 3, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "sandstone door", T("/obj/structure/mineral_door/sandstone"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "aesthetic volcanic floor tile", T("/obj/item/stack/tile/basalt"), 2, 2, 4, 20), new_(T("/datum/stack_recipe"), "Assistant Statue", T("/obj/structure/statue/sandstone/assistant"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Breakdown into sand", T("/obj/item/weapon/ore/glass"), 1, { one_per_turf: 0, on_floor: 1 }));
	this.gvars_datum_init_order += "sandstone_recipes";
	return f.dot;
});

rt.type(9042, "/obj/item/stack/sheet/mineral/sandstone", "/obj/item/stack/sheet/mineral", {
	throw_speed: 3,
	throw_range: 5,
	name: "sandstone brick",
	desc: "This appears to be a combination of both sand and stone.",
	singular_name: "sandstone brick",
	icon_state: "sheet-sandstone",
	origin_tech: "materials=1",
	materials: null,
	sheettype: "sandstone",
});

// mineral.dm:50
rt.def("/obj/item/stack/sheet/mineral/sandstone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 2000]);
	return f.dot;
});

// mineral.dm:54
rt.def("/obj/item/stack/sheet/mineral/sandstone/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.sandstone_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// mineral.dm:73
rt.def("/datum/controller/global_vars/proc/InitGlobalsandbag_recipes", function InitGlobalsandbag_recipes(f: Frame) {
	GLOB.sandbag_recipes = list(new_(T("/datum/stack_recipe"), "sandbags", T("/obj/structure/barricade/sandbags"), 1, { time: 25, one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "sandbag_recipes";
	return f.dot;
});

rt.type(9044, "/obj/item/stack/sheet/mineral/sandbags", "/obj/item/stack/sheet/mineral", {
	name: "sandbags",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "sandbags",
	singular_name: "sandbag",
	layer: 2.95,
	origin_tech: "materials=2",
	novariants: 1,
});

// mineral.dm:78
rt.def("/obj/item/stack/sheet/mineral/sandbags/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.sandbag_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(7053, "/obj/item/weapon/emptysandbag", "/obj/item/weapon", {
	name: "empty sandbag",
	desc: "A bag to be filled with sand.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "sandbag",
	w_class: 1,
});

// mineral.dm:89
rt.def("/obj/item/weapon/emptysandbag/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let I: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/ore/glass"))) {
		to_chat(user, "<span class='notice'>You fill the sandbag.</span>");
		I = (yield* new_(T("/obj/item/stack/sheet/mineral/sandbags")));
		yield* qdel(this);
		yield* user.put_in_hands(I);
		yield* qdel(W);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9045, "/obj/item/stack/sheet/mineral/diamond", "/obj/item/stack/sheet/mineral", {
	name: "diamond",
	icon_state: "sheet-diamond",
	singular_name: "diamond",
	origin_tech: "materials=6",
	sheettype: "diamond",
	materials: null,
	novariants: 1,
});

// mineral.dm:107
rt.def("/obj/item/stack/sheet/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$diamond", 2000]);
	return f.dot;
});

// mineral.dm:110
rt.def("/datum/controller/global_vars/proc/InitGlobaldiamond_recipes", function InitGlobaldiamond_recipes(f: Frame) {
	GLOB.diamond_recipes = list(new_(T("/datum/stack_recipe"), "diamond door", T("/obj/structure/mineral_door/transparent/diamond"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "diamond tile", T("/obj/item/stack/tile/mineral/diamond"), 1, 4, 20), new_(T("/datum/stack_recipe"), "Captain Statue", T("/obj/structure/statue/diamond/captain"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "AI Hologram Statue", T("/obj/structure/statue/diamond/ai1"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "AI Core Statue", T("/obj/structure/statue/diamond/ai2"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "diamond_recipes";
	return f.dot;
});

// mineral.dm:119
rt.def("/obj/item/stack/sheet/mineral/diamond/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.diamond_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9046, "/obj/item/stack/sheet/mineral/uranium", "/obj/item/stack/sheet/mineral", {
	name: "uranium",
	icon_state: "sheet-uranium",
	singular_name: "uranium sheet",
	origin_tech: "materials=5",
	sheettype: "uranium",
	materials: null,
	novariants: 1,
});

// mineral.dm:131
rt.def("/obj/item/stack/sheet/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$uranium", 2000]);
	return f.dot;
});

// mineral.dm:134
rt.def("/datum/controller/global_vars/proc/InitGlobaluranium_recipes", function InitGlobaluranium_recipes(f: Frame) {
	GLOB.uranium_recipes = list(new_(T("/datum/stack_recipe"), "uranium door", T("/obj/structure/mineral_door/uranium"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "uranium tile", T("/obj/item/stack/tile/mineral/uranium"), 1, 4, 20), new_(T("/datum/stack_recipe"), "Nuke Statue", T("/obj/structure/statue/uranium/nuke"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Engineer Statue", T("/obj/structure/statue/uranium/eng"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "uranium_recipes";
	return f.dot;
});

// mineral.dm:142
rt.def("/obj/item/stack/sheet/mineral/uranium/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.uranium_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9047, "/obj/item/stack/sheet/mineral/plasma", "/obj/item/stack/sheet/mineral", {
	name: "solid plasma",
	icon_state: "sheet-plasma",
	singular_name: "plasma sheet",
	origin_tech: "plasmatech=2;materials=2",
	sheettype: "plasma",
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	materials: null,
});

// mineral.dm:157
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$plasma", 2000]);
	return f.dot;
});

// mineral.dm:159
rt.def("/datum/controller/global_vars/proc/InitGlobalplasma_recipes", function InitGlobalplasma_recipes(f: Frame) {
	GLOB.plasma_recipes = list(new_(T("/datum/stack_recipe"), "plasma door", T("/obj/structure/mineral_door/transparent/plasma"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "plasma tile", T("/obj/item/stack/tile/mineral/plasma"), 1, 4, 20), new_(T("/datum/stack_recipe"), "Scientist Statue", T("/obj/structure/statue/plasma/scientist"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "plasma_recipes";
	return f.dot;
});

// mineral.dm:166
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.plasma_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// mineral.dm:170
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	let $0: any, $1: any;
	if (W.is_hot() > 300) {
		_T = rt.getStep(f, this, 0);
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (_T) {
			$1 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma sheets ignited by ${$0} in ${`${$1}`}`, 0, 1);
		log_game(`Plasma sheets ignited by ${key_name(user)} in ${`(${_T.x},${_T.y},${_T.z})`}`);
		yield* this.fire_act(W.is_hot());
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// mineral.dm:179
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	this.atmos_spawn_air(`plasma=${this.amount * 10};TEMP=${exposed_temperature}`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9048, "/obj/item/stack/sheet/mineral/gold", "/obj/item/stack/sheet/mineral", {
	name: "gold",
	icon_state: "sheet-gold",
	singular_name: "gold bar",
	origin_tech: "materials=4",
	sheettype: "gold",
	materials: null,
});

// mineral.dm:191
rt.def("/obj/item/stack/sheet/mineral/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 2000]);
	return f.dot;
});

// mineral.dm:193
rt.def("/datum/controller/global_vars/proc/InitGlobalgold_recipes", function InitGlobalgold_recipes(f: Frame) {
	GLOB.gold_recipes = list(new_(T("/datum/stack_recipe"), "golden door", T("/obj/structure/mineral_door/gold"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "gold tile", T("/obj/item/stack/tile/mineral/gold"), 1, 4, 20), new_(T("/datum/stack_recipe"), "HoS Statue", T("/obj/structure/statue/gold/hos"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "HoP Statue", T("/obj/structure/statue/gold/hop"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "CE Statue", T("/obj/structure/statue/gold/ce"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "RD Statue", T("/obj/structure/statue/gold/rd"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Simple Crown", T("/obj/item/clothing/head/crown"), 5), new_(T("/datum/stack_recipe"), "CMO Statue", T("/obj/structure/statue/gold/cmo"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "gold_recipes";
	return f.dot;
});

// mineral.dm:205
rt.def("/obj/item/stack/sheet/mineral/gold/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.gold_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9049, "/obj/item/stack/sheet/mineral/silver", "/obj/item/stack/sheet/mineral", {
	name: "silver",
	icon_state: "sheet-silver",
	singular_name: "silver bar",
	origin_tech: "materials=4",
	sheettype: "silver",
	materials: null,
});

// mineral.dm:217
rt.def("/obj/item/stack/sheet/mineral/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$silver", 2000]);
	return f.dot;
});

// mineral.dm:219
rt.def("/datum/controller/global_vars/proc/InitGlobalsilver_recipes", function InitGlobalsilver_recipes(f: Frame) {
	GLOB.silver_recipes = list(new_(T("/datum/stack_recipe"), "silver door", T("/obj/structure/mineral_door/silver"), 10, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "silver tile", T("/obj/item/stack/tile/mineral/silver"), 1, 4, 20), new_(T("/datum/stack_recipe"), "Med Officer Statue", T("/obj/structure/statue/silver/md"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Janitor Statue", T("/obj/structure/statue/silver/janitor"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Sec Officer Statue", T("/obj/structure/statue/silver/sec"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Sec Borg Statue", T("/obj/structure/statue/silver/secborg"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Med Borg Statue", T("/obj/structure/statue/silver/medborg"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "silver_recipes";
	return f.dot;
});

// mineral.dm:230
rt.def("/obj/item/stack/sheet/mineral/silver/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.silver_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9050, "/obj/item/stack/sheet/mineral/bananium", "/obj/item/stack/sheet/mineral", {
	name: "bananium",
	icon_state: "sheet-clown",
	singular_name: "bananium sheet",
	origin_tech: "materials=4",
	sheettype: "clown",
	materials: null,
	novariants: 1,
});

// mineral.dm:242
rt.def("/obj/item/stack/sheet/mineral/bananium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bananium", 2000]);
	return f.dot;
});

// mineral.dm:245
rt.def("/datum/controller/global_vars/proc/InitGlobalclown_recipes", function InitGlobalclown_recipes(f: Frame) {
	GLOB.clown_recipes = list(new_(T("/datum/stack_recipe"), "bananium tile", T("/obj/item/stack/tile/mineral/bananium"), 1, 4, 20), new_(T("/datum/stack_recipe"), "Clown Statue", T("/obj/structure/statue/bananium/clown"), 5, { one_per_turf: 1, on_floor: 1 }));
	this.gvars_datum_init_order += "clown_recipes";
	return f.dot;
});

// mineral.dm:251
rt.def("/obj/item/stack/sheet/mineral/bananium/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.clown_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9051, "/obj/item/stack/sheet/mineral/titanium", "/obj/item/stack/sheet/mineral", {
	throw_speed: 1,
	throw_range: 3,
	name: "titanium",
	icon_state: "sheet-titanium",
	singular_name: "titanium sheet",
	force: 5,
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=4",
	sheettype: "titanium",
	materials: null,
});

// mineral.dm:268
rt.def("/obj/item/stack/sheet/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$titanium", 2000]);
	return f.dot;
});

// mineral.dm:270
rt.def("/datum/controller/global_vars/proc/InitGlobaltitanium_recipes", function InitGlobaltitanium_recipes(f: Frame) {
	GLOB.titanium_recipes = list(new_(T("/datum/stack_recipe"), "titanium tile", T("/obj/item/stack/tile/mineral/titanium"), 1, 4, 20));
	this.gvars_datum_init_order += "titanium_recipes";
	return f.dot;
});

// mineral.dm:275
rt.def("/obj/item/stack/sheet/mineral/titanium/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.titanium_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9052, "/obj/item/stack/sheet/mineral/plastitanium", "/obj/item/stack/sheet/mineral", {
	throw_speed: 1,
	throw_range: 3,
	name: "plastitanium",
	icon_state: "sheet-plastitanium",
	singular_name: "plastitanium sheet",
	force: 5,
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=4",
	sheettype: "plastitanium",
	materials: null,
});

// mineral.dm:293
rt.def("/obj/item/stack/sheet/mineral/plastitanium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$titanium", 2000, "$plasma", 2000]);
	return f.dot;
});

// mineral.dm:295
rt.def("/datum/controller/global_vars/proc/InitGlobalplastitanium_recipes", function InitGlobalplastitanium_recipes(f: Frame) {
	GLOB.plastitanium_recipes = list(new_(T("/datum/stack_recipe"), "plas-titanium tile", T("/obj/item/stack/tile/mineral/plastitanium"), 1, 4, 20));
	this.gvars_datum_init_order += "plastitanium_recipes";
	return f.dot;
});

// mineral.dm:300
rt.def("/obj/item/stack/sheet/mineral/plastitanium/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.plastitanium_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// mineral.dm:315
rt.def("/datum/controller/global_vars/proc/InitGlobalsnow_recipes", function InitGlobalsnow_recipes(f: Frame) {
	GLOB.snow_recipes = list(new_(T("/datum/stack_recipe"), "Snow Wall", T("/turf/closed/wall/mineral/snow"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Snowman", T("/obj/structure/statue/snow/snowman"), 5, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "Snowball", T("/obj/item/toy/snowball"), 1));
	this.gvars_datum_init_order += "snow_recipes";
	return f.dot;
});

rt.type(9053, "/obj/item/stack/sheet/mineral/snow", "/obj/item/stack/sheet/mineral", {
	name: "snow",
	icon_state: "sheet-snow",
	singular_name: "snow block",
	force: 1,
	throwforce: 2,
	origin_tech: "materials=1",
});

// mineral.dm:322
rt.def("/obj/item/stack/sheet/mineral/snow/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.snow_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9054, "/obj/item/stack/sheet/mineral/enruranium", "/obj/item/stack/sheet/mineral", {
	name: "enriched uranium",
	icon_state: "sheet-enruranium",
	singular_name: "enriched uranium sheet",
	origin_tech: "materials=6",
	materials: null,
});

// mineral.dm:335
rt.def("/obj/item/stack/sheet/mineral/enruranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$uranium", 3000]);
	return f.dot;
});

// mineral.dm:340
rt.def("/datum/controller/global_vars/proc/InitGlobaladamantine_recipes", function InitGlobaladamantine_recipes(f: Frame) {
	GLOB.adamantine_recipes = list(new_(T("/datum/stack_recipe"), "incomplete servant golem shell", T("/obj/item/golem_shell/servant"), { req_amount: 1, res_amount: 1 }));
	this.gvars_datum_init_order += "adamantine_recipes";
	return f.dot;
});

rt.type(9055, "/obj/item/stack/sheet/mineral/adamantine", "/obj/item/stack/sheet/mineral", {
	name: "adamantine",
	icon_state: "sheet-adamantine",
	singular_name: "adamantine sheet",
	origin_tech: "materials=4",
});

// mineral.dm:351
rt.def("/obj/item/stack/sheet/mineral/adamantine/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.adamantine_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// mineral.dm:375
rt.def("/datum/controller/global_vars/proc/InitGlobalabductor_recipes", function InitGlobalabductor_recipes(f: Frame) {
	GLOB.abductor_recipes = list(new_(T("/datum/stack_recipe"), "alien bed", T("/obj/structure/bed/abductor"), 2, { one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "alien locker", T("/obj/structure/closet/abductor"), 2, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "alien table frame", T("/obj/structure/table_frame/abductor"), 1, { time: 15, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "alien airlock assembly", T("/obj/structure/door_assembly/door_assembly_abductor"), 4, { time: 20, one_per_turf: 1, on_floor: 1 }), null, new_(T("/datum/stack_recipe"), "alien floor tile", T("/obj/item/stack/tile/mineral/abductor"), 1, 4, 20));
	this.gvars_datum_init_order += "abductor_recipes";
	return f.dot;
});

rt.type(9057, "/obj/item/stack/sheet/mineral/abductor", "/obj/item/stack/sheet/mineral", {
	name: "alien alloy",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "sheet-abductor",
	singular_name: "alien alloy sheet",
	origin_tech: "materials=6;abductor=1",
	sheettype: "abductor",
});

// mineral.dm:389
rt.def("/obj/item/stack/sheet/mineral/abductor/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.abductor_recipes;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });
