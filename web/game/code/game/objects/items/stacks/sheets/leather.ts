// From code/game/objects/items/stacks/sheets/leather.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalhuman_recipes  (code/game/objects/items/stacks/sheets/leather.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalhuman_recipes", function InitGlobalhuman_recipes(f: Frame) {
	rt.setGl("human_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "bloated human costume", null, T("/obj/item/clothing/suit/hooded/bloated_human"), null, 5, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "human_recipes", add);
	return f.dot;
});

rt.type(9028, "/obj/item/stack/sheet/animalhide/human", "/obj/item/stack/sheet/animalhide", {
	name: "human skin",
	desc: "The by-product of human farming.",
	singular_name: "human skin piece",
	icon_state: "sheet-hide",
	novariants: 0,
});

// /obj/item/stack/sheet/animalhide/human/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:19)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/human/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("human_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalcorgi_recipes  (code/game/objects/items/stacks/sheets/leather.dm:35)
rt.def("/datum/controller/global_vars/proc/InitGlobalcorgi_recipes", function InitGlobalcorgi_recipes(f: Frame) {
	rt.setGl("corgi_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "corgi costume", null, T("/obj/item/clothing/suit/hooded/ian_costume"), null, 3, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "corgi_recipes", add);
	return f.dot;
});

rt.type(9030, "/obj/item/stack/sheet/animalhide/corgi", "/obj/item/stack/sheet/animalhide", {
	name: "corgi hide",
	desc: "The by-product of corgi farming.",
	singular_name: "corgi hide piece",
	icon_state: "sheet-corgi",
});

// /obj/item/stack/sheet/animalhide/corgi/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:40)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/corgi/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("corgi_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalmonkey_recipes  (code/game/objects/items/stacks/sheets/leather.dm:55)
rt.def("/datum/controller/global_vars/proc/InitGlobalmonkey_recipes", function InitGlobalmonkey_recipes(f: Frame) {
	rt.setGl("monkey_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "monkey mask", null, T("/obj/item/clothing/mask/gas/monkeymask"), null, 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "monkey suit", null, T("/obj/item/clothing/suit/monkeysuit"), null, 2, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "monkey_recipes", add);
	return f.dot;
});

rt.type(9032, "/obj/item/stack/sheet/animalhide/monkey", "/obj/item/stack/sheet/animalhide", {
	name: "monkey hide",
	desc: "The by-product of monkey farming.",
	singular_name: "monkey hide piece",
	icon_state: "sheet-monkey",
});

// /obj/item/stack/sheet/animalhide/monkey/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:61)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/monkey/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("monkey_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalxeno_recipes  (code/game/objects/items/stacks/sheets/leather.dm:76)
rt.def("/datum/controller/global_vars/proc/InitGlobalxeno_recipes", function InitGlobalxeno_recipes(f: Frame) {
	rt.setGl("xeno_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "alien helmet", null, T("/obj/item/clothing/head/xenos"), null, 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "alien suit", null, T("/obj/item/clothing/suit/xenos"), null, 2, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "xeno_recipes", add);
	return f.dot;
});

rt.type(9034, "/obj/item/stack/sheet/animalhide/xeno", "/obj/item/stack/sheet/animalhide", {
	name: "alien hide",
	desc: "The skin of a terrible creature.",
	singular_name: "alien hide piece",
	icon_state: "sheet-xeno",
});

// /obj/item/stack/sheet/animalhide/xeno/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:82)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/xeno/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("xeno_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGloballeather_recipes  (code/game/objects/items/stacks/sheets/leather.dm:135)
rt.def("/datum/controller/global_vars/proc/InitGloballeather_recipes", function InitGloballeather_recipes(f: Frame) {
	rt.setGl("leather_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["wallet", T("/obj/item/weapon/storage/wallet"), 1]), rt.new_(f, T("/datum/stack_recipe"), ["muzzle", T("/obj/item/clothing/mask/muzzle"), 2]), rt.new_(f, T("/datum/stack_recipe"), ["botany gloves", T("/obj/item/clothing/gloves/botanic_leather"), 3]), rt.new_(f, T("/datum/stack_recipe"), ["toolbelt", T("/obj/item/weapon/storage/belt/utility"), 4]), rt.new_(f, T("/datum/stack_recipe"), ["leather satchel", T("/obj/item/weapon/storage/backpack/satchel"), 5]), rt.new_(f, T("/datum/stack_recipe"), ["bandolier", T("/obj/item/weapon/storage/belt/bandolier"), 5]), rt.new_(f, T("/datum/stack_recipe"), ["leather jacket", T("/obj/item/clothing/suit/jacket/leather"), 7]), rt.new_(f, T("/datum/stack_recipe"), ["leather overcoat", T("/obj/item/clothing/suit/jacket/leather/overcoat"), 10])));
	rt.modSrcVar(f, "gvars_datum_init_order", "leather_recipes", add);
	return f.dot;
});

rt.type(9039, "/obj/item/stack/sheet/leather", "/obj/item/stack/sheet", {
	name: "leather",
	desc: "The by-product of mob grinding.",
	singular_name: "leather piece",
	icon_state: "sheet-leather",
	origin_tech: "materials=2",
});

// /obj/item/stack/sheet/leather/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:147)  may sleep
rt.def("/obj/item/stack/sheet/leather/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("leather_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalsinew_recipes  (code/game/objects/items/stacks/sheets/leather.dm:163)
rt.def("/datum/controller/global_vars/proc/InitGlobalsinew_recipes", function InitGlobalsinew_recipes(f: Frame) {
	rt.setGl("sinew_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "sinew restraints", null, T("/obj/item/weapon/restraints/handcuffs/sinew"), null, 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "sinew_recipes", add);
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

// /obj/item/stack/sheet/sinew/proc/Initialize  (code/game/objects/items/stacks/sheets/leather.dm:168)  may sleep
rt.def("/obj/item/stack/sheet/sinew/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("sinew_recipes"));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9027, "/obj/item/stack/sheet/animalhide", "/obj/item/stack/sheet", {
	name: "hide",
	desc: "Something went wrong.",
	origin_tech: "biotech=3",
	novariants: 1,
});

// /obj/item/stack/sheet/animalhide/proc/attackby  (code/game/objects/items/stacks/sheets/leather.dm:203)  may sleep
rt.def("/obj/item/stack/sheet/animalhide/proc/attackby", function* attackby(f: Frame) {
	let HS: Value = null;
	f.vars = () => [HS];
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ starts cutting hair off ％！.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start cutting the hair off ％！...</span>", [live(f.src)]), "<span class='italics'>You hear the sound of a knife rubbing against flesh.</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut the hair from this ＀.</span>", [rt.fv(f, "singular_name", live(f.src))])]);
			rt.setFv(f, "amount", (HS = (yield* g.new_(f, T("/obj/item/stack/sheet/hairlesshide"), [rt.fv(f, "loc", live(f.args[1]))]))), 1);
			yield* g.srcCall(f, "use", 1);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9038, "/obj/item/stack/sheet/wetleather", "/obj/item/stack/sheet", {
	wetness: 30,
	drying_threshold_temperature: 500,
	name: "wet leather",
	desc: "This leather has been cleaned but still needs to be dried.",
	singular_name: "wet leather piece",
	icon_state: "sheet-wetleather",
	origin_tech: null,
});

// /obj/item/stack/sheet/wetleather/proc/temperature_expose  (code/game/objects/items/stacks/sheets/leather.dm:219)  may sleep
rt.def("/obj/item/stack/sheet/wetleather/proc/temperature_expose", function* temperature_expose(f: Frame) {
	let HS: Value = null;
	let $e: any;
	f.vars = () => [HS, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.ge(live(f.args[1]), rt.sv(f, "drying_threshold_temperature"))) return f.dot;
	rt.incSrcVar(f, "wetness", -1, true);
	if (!isEqual(rt.sv(f, "wetness"), 0)) return f.dot;
	HS = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/item/stack/sheet/leather"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HS = $e;
		if (rt.lt(rt.fv(f, "amount", live(HS)), 50)) {
			rt.incField(f, live(HS), "amount", 1, true);
			yield* g.callName(f, live(f.src), "use", [1]);
			rt.setSv(f, "wetness", rt.initial(f, live(f.src), "wetness"));
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "amount", (HS = (yield* g.new_(f, T("/obj/item/stack/sheet/leather"), [rt.fv(f, "loc", live(f.src))]))), 1);
	rt.setSv(f, "wetness", rt.initial(f, live(f.src), "wetness"));
	yield* g.callName(f, live(f.src), "use", [1]);
	return f.dot;
}, true, { args: ["air", "exposed_temperature", "exposed_volume"] });

// /obj/item/stack/sheet/wetleather/proc/microwave_act  (code/game/objects/items/stacks/sheets/leather.dm:237)  may sleep
rt.def("/obj/item/stack/sheet/wetleather/proc/microwave_act", function* microwave_act(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "amount", (L = (yield* g.new_(f, T("/obj/item/stack/sheet/leather"), [rt.sv(f, "loc")]))), rt.sv(f, "amount"));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["MW"] });
