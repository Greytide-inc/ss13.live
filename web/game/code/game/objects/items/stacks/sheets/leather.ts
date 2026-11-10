// Based on /tg/station's code/game/objects/items/stacks/sheets/leather.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// leather.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalhuman_recipes", function InitGlobalhuman_recipes(f: Frame) {
	GLOB.human_recipes = list(new_(T("/datum/stack_recipe"), "bloated human costume", T("/obj/item/clothing/suit/hooded/bloated_human"), 5, { on_floor: 1 }));
	this.gvars_datum_init_order += "human_recipes";
	return f.dot;
});

rt.type(9028, "/obj/item/stack/sheet/animalhide/human", "/obj/item/stack/sheet/animalhide", {
	name: "human skin",
	desc: "The by-product of human farming.",
	singular_name: "human skin piece",
	icon_state: "sheet-hide",
	novariants: 0,
});

// leather.dm:19
rt.def("/obj/item/stack/sheet/animalhide/human/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.human_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// leather.dm:35
rt.def("/datum/controller/global_vars/proc/InitGlobalcorgi_recipes", function InitGlobalcorgi_recipes(f: Frame) {
	GLOB.corgi_recipes = list(new_(T("/datum/stack_recipe"), "corgi costume", T("/obj/item/clothing/suit/hooded/ian_costume"), 3, { on_floor: 1 }));
	this.gvars_datum_init_order += "corgi_recipes";
	return f.dot;
});

rt.type(9030, "/obj/item/stack/sheet/animalhide/corgi", "/obj/item/stack/sheet/animalhide", {
	name: "corgi hide",
	desc: "The by-product of corgi farming.",
	singular_name: "corgi hide piece",
	icon_state: "sheet-corgi",
});

// leather.dm:40
rt.def("/obj/item/stack/sheet/animalhide/corgi/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.corgi_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// leather.dm:55
rt.def("/datum/controller/global_vars/proc/InitGlobalmonkey_recipes", function InitGlobalmonkey_recipes(f: Frame) {
	GLOB.monkey_recipes = list(new_(T("/datum/stack_recipe"), "monkey mask", T("/obj/item/clothing/mask/gas/monkeymask"), 1, { on_floor: 1 }), new_(T("/datum/stack_recipe"), "monkey suit", T("/obj/item/clothing/suit/monkeysuit"), 2, { on_floor: 1 }));
	this.gvars_datum_init_order += "monkey_recipes";
	return f.dot;
});

rt.type(9032, "/obj/item/stack/sheet/animalhide/monkey", "/obj/item/stack/sheet/animalhide", {
	name: "monkey hide",
	desc: "The by-product of monkey farming.",
	singular_name: "monkey hide piece",
	icon_state: "sheet-monkey",
});

// leather.dm:61
rt.def("/obj/item/stack/sheet/animalhide/monkey/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.monkey_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// leather.dm:76
rt.def("/datum/controller/global_vars/proc/InitGlobalxeno_recipes", function InitGlobalxeno_recipes(f: Frame) {
	GLOB.xeno_recipes = list(new_(T("/datum/stack_recipe"), "alien helmet", T("/obj/item/clothing/head/xenos"), 1, { on_floor: 1 }), new_(T("/datum/stack_recipe"), "alien suit", T("/obj/item/clothing/suit/xenos"), 2, { on_floor: 1 }));
	this.gvars_datum_init_order += "xeno_recipes";
	return f.dot;
});

rt.type(9034, "/obj/item/stack/sheet/animalhide/xeno", "/obj/item/stack/sheet/animalhide", {
	name: "alien hide",
	desc: "The skin of a terrible creature.",
	singular_name: "alien hide piece",
	icon_state: "sheet-xeno",
});

// leather.dm:82
rt.def("/obj/item/stack/sheet/animalhide/xeno/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.xeno_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// leather.dm:135
rt.def("/datum/controller/global_vars/proc/InitGloballeather_recipes", function InitGloballeather_recipes(f: Frame) {
	GLOB.leather_recipes = list(new_(T("/datum/stack_recipe"), "wallet", T("/obj/item/weapon/storage/wallet"), 1), new_(T("/datum/stack_recipe"), "muzzle", T("/obj/item/clothing/mask/muzzle"), 2), new_(T("/datum/stack_recipe"), "botany gloves", T("/obj/item/clothing/gloves/botanic_leather"), 3), new_(T("/datum/stack_recipe"), "toolbelt", T("/obj/item/weapon/storage/belt/utility"), 4), new_(T("/datum/stack_recipe"), "leather satchel", T("/obj/item/weapon/storage/backpack/satchel"), 5), new_(T("/datum/stack_recipe"), "bandolier", T("/obj/item/weapon/storage/belt/bandolier"), 5), new_(T("/datum/stack_recipe"), "leather jacket", T("/obj/item/clothing/suit/jacket/leather"), 7), new_(T("/datum/stack_recipe"), "leather overcoat", T("/obj/item/clothing/suit/jacket/leather/overcoat"), 10));
	this.gvars_datum_init_order += "leather_recipes";
	return f.dot;
});

rt.type(9039, "/obj/item/stack/sheet/leather", "/obj/item/stack/sheet", {
	name: "leather",
	desc: "The by-product of mob grinding.",
	singular_name: "leather piece",
	icon_state: "sheet-leather",
	origin_tech: "materials=2",
});

// leather.dm:147
rt.def("/obj/item/stack/sheet/leather/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.leather_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

// leather.dm:163
rt.def("/datum/controller/global_vars/proc/InitGlobalsinew_recipes", function InitGlobalsinew_recipes(f: Frame) {
	GLOB.sinew_recipes = list(new_(T("/datum/stack_recipe"), "sinew restraints", T("/obj/item/weapon/restraints/handcuffs/sinew"), 1, { on_floor: 1 }));
	this.gvars_datum_init_order += "sinew_recipes";
	return f.dot;
});

rt.type(9040, "/obj/item/stack/sheet/sinew", "/obj/item/stack/sheet", {
	name: "watcher sinew",
	icon: rt.rsc("icons/obj/mining.dmi"),
	desc: "Long stringy filaments which presumably came from a watcher's wings.",
	singular_name: "watcher sinew",
	icon_state: "sinew",
	origin_tech: "biotech=4",
	novariants: 1,
});

// leather.dm:168
rt.def("/obj/item/stack/sheet/sinew/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.sinew_recipes;
	return (yield* parent_proc());
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9027, "/obj/item/stack/sheet/animalhide", "/obj/item/stack/sheet", {
	name: "hide",
	desc: "Something went wrong.",
	origin_tech: "biotech=3",
	novariants: 1,
});

// leather.dm:203
rt.def("/obj/item/stack/sheet/animalhide/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let HS: Value = null;
	if (W.is_sharp()) {
		playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1);
		user.visible_message(fmt("＀ starts cutting hair off ％！.", [user, this]), fmt("<span class='notice'>You start cutting the hair off ％！...</span>", [this]), "<span class='italics'>You hear the sound of a knife rubbing against flesh.</span>");
		if (yield* do_after(user, 50, { target: this })) {
			to_chat(user, `<span class='notice'>You cut the hair from this ${this.singular_name}.</span>`);
			(HS = (yield* new_(T("/obj/item/stack/sheet/hairlesshide"), user.loc))).amount = 1;
			yield* this.use(1);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9038, "/obj/item/stack/sheet/wetleather", "/obj/item/stack/sheet", {
	wetness: 30,
	drying_threshold_temperature: 500,
	name: "wet leather",
	desc: "This leather has been cleaned but still needs to be dried.",
	singular_name: "wet leather piece",
	icon_state: "sheet-wetleather",
	origin_tech: null,
});

// leather.dm:219
rt.def("/obj/item/stack/sheet/wetleather/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	let HS: Value = null;
	yield* parent_proc();
	if (!(exposed_temperature >= this.drying_threshold_temperature)) return f.dot;
	this.wetness--;
	if (this.wetness != 0) return f.dot;
	for (HS of each(this.loc, T("/obj/item/stack/sheet/leather"))) {
		if (HS.amount < 50) {
			HS.amount++;
			yield* this.use(1);
			this.wetness = rt.initial(f, this, "wetness");
			break;
		}
	}
	(HS = (yield* new_(T("/obj/item/stack/sheet/leather"), this.loc))).amount = 1;
	this.wetness = rt.initial(f, this, "wetness");
	yield* this.use(1);
	return f.dot;
}, true);

// leather.dm:237
rt.def("/obj/item/stack/sheet/wetleather/proc/microwave_act", function* microwave_act(f: Frame, MW: Value) {
	let L: Value = null;
	yield* parent_proc();
	(L = (yield* new_(T("/obj/item/stack/sheet/leather"), this.loc))).amount = this.amount;
	yield* qdel(this);
	return f.dot;
}, true);
