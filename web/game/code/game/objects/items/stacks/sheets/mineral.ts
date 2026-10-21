// From code/game/objects/items/stacks/sheets/mineral.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9041, "/obj/item/stack/sheet/mineral", "/obj/item/stack/sheet", {
	icon: rt.rsc("icons/obj/mining.dmi"),
});

// /obj/item/stack/sheet/mineral/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:26)  may sleep
rt.def("/obj/item/stack/sheet/mineral/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload"] });

// /datum/controller/global_vars/proc/InitGlobalsandstone_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:34)
rt.def("/datum/controller/global_vars/proc/InitGlobalsandstone_recipes", function InitGlobalsandstone_recipes(f: Frame) {
	rt.setGl("sandstone_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "pile of dirt", null, T("/obj/machinery/hydroponics/soil"), null, 3, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "sandstone door", null, T("/obj/structure/mineral_door/sandstone"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["aesthetic volcanic floor tile", T("/obj/item/stack/tile/basalt"), 2, 2, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Assistant Statue", null, T("/obj/structure/statue/sandstone/assistant"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Breakdown into sand", null, T("/obj/item/weapon/ore/glass"), null, 1, "one_per_turf", 0, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "sandstone_recipes", add);
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

// /obj/item/stack/sheet/mineral/sandstone/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:50)
rt.def("/obj/item/stack/sheet/mineral/sandstone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000]));
	return f.dot;
});

// /obj/item/stack/sheet/mineral/sandstone/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:54)  may sleep
rt.def("/obj/item/stack/sheet/mineral/sandstone/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("sandstone_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalsandbag_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:73)
rt.def("/datum/controller/global_vars/proc/InitGlobalsandbag_recipes", function InitGlobalsandbag_recipes(f: Frame) {
	rt.setGl("sandbag_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "sandbags", null, T("/obj/structure/barricade/sandbags"), null, 1, "time", 25, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "sandbag_recipes", add);
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

// /obj/item/stack/sheet/mineral/sandbags/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:78)  may sleep
rt.def("/obj/item/stack/sheet/mineral/sandbags/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("sandbag_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(7053, "/obj/item/weapon/emptysandbag", "/obj/item/weapon", {
	name: "empty sandbag",
	desc: "A bag to be filled with sand.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "sandbag",
	w_class: 1,
});

// /obj/item/weapon/emptysandbag/proc/attackby  (code/game/objects/items/stacks/sheets/mineral.dm:89)  may sleep
rt.def("/obj/item/weapon/emptysandbag/proc/attackby", function* attackby(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/ore/glass")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You fill the sandbag.</span>"]);
		I = (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/sandbags"), []));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(I)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9045, "/obj/item/stack/sheet/mineral/diamond", "/obj/item/stack/sheet/mineral", {
	name: "diamond",
	icon_state: "sheet-diamond",
	singular_name: "diamond",
	origin_tech: "materials=6",
	sheettype: "diamond",
	materials: null,
	novariants: 1,
});

// /obj/item/stack/sheet/mineral/diamond/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:107)
rt.def("/obj/item/stack/sheet/mineral/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$diamond", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldiamond_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:110)
rt.def("/datum/controller/global_vars/proc/InitGlobaldiamond_recipes", function InitGlobaldiamond_recipes(f: Frame) {
	rt.setGl("diamond_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "diamond door", null, T("/obj/structure/mineral_door/transparent/diamond"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["diamond tile", T("/obj/item/stack/tile/mineral/diamond"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Captain Statue", null, T("/obj/structure/statue/diamond/captain"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "AI Hologram Statue", null, T("/obj/structure/statue/diamond/ai1"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "AI Core Statue", null, T("/obj/structure/statue/diamond/ai2"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "diamond_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/diamond/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:119)  may sleep
rt.def("/obj/item/stack/sheet/mineral/diamond/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("diamond_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/uranium/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:131)
rt.def("/obj/item/stack/sheet/mineral/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$uranium", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaluranium_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:134)
rt.def("/datum/controller/global_vars/proc/InitGlobaluranium_recipes", function InitGlobaluranium_recipes(f: Frame) {
	rt.setGl("uranium_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "uranium door", null, T("/obj/structure/mineral_door/uranium"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["uranium tile", T("/obj/item/stack/tile/mineral/uranium"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Nuke Statue", null, T("/obj/structure/statue/uranium/nuke"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Engineer Statue", null, T("/obj/structure/statue/uranium/eng"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "uranium_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/uranium/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:142)  may sleep
rt.def("/obj/item/stack/sheet/mineral/uranium/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("uranium_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/plasma/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:157)
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$plasma", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalplasma_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:159)
rt.def("/datum/controller/global_vars/proc/InitGlobalplasma_recipes", function InitGlobalplasma_recipes(f: Frame) {
	rt.setGl("plasma_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "plasma door", null, T("/obj/structure/mineral_door/transparent/plasma"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["plasma tile", T("/obj/item/stack/tile/mineral/plasma"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Scientist Statue", null, T("/obj/structure/statue/plasma/scientist"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "plasma_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/plasma/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:166)  may sleep
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("plasma_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /obj/item/stack/sheet/mineral/plasma/proc/attackby  (code/game/objects/items/stacks/sheets/mineral.dm:170)  may sleep
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, $0, $1];
	if (rt.gt((yield* g.callName(f, live(f.args[0]), "is_hot", [])), 300)) {
		_T = rt.getStep(f, live(f.src), 0);
		$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[1])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[1])])]);
		if (truthy(live(_T))) {
			$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$1 = "nonexistent location";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Plasma sheets ignited by ＀ in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Plasma sheets ignited by ＀ in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])])]);
		yield* g.srcCall(f, "fire_act", (yield* g.callName(f, live(f.args[0]), "is_hot", [])));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/stack/sheet/mineral/plasma/proc/fire_act  (code/game/objects/items/stacks/sheets/mineral.dm:179)  may sleep
rt.def("/obj/item/stack/sheet/mineral/plasma/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "atmos_spawn_air", fmt("plasma=＀;TEMP=＀", [multiply(rt.sv(f, "amount"), 10), live(exposed_temperature)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
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

// /obj/item/stack/sheet/mineral/gold/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:191)
rt.def("/obj/item/stack/sheet/mineral/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalgold_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:193)
rt.def("/datum/controller/global_vars/proc/InitGlobalgold_recipes", function InitGlobalgold_recipes(f: Frame) {
	rt.setGl("gold_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "golden door", null, T("/obj/structure/mineral_door/gold"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["gold tile", T("/obj/item/stack/tile/mineral/gold"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "HoS Statue", null, T("/obj/structure/statue/gold/hos"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "HoP Statue", null, T("/obj/structure/statue/gold/hop"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "CE Statue", null, T("/obj/structure/statue/gold/ce"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "RD Statue", null, T("/obj/structure/statue/gold/rd"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["Simple Crown", T("/obj/item/clothing/head/crown"), 5]), rt.new_(f, T("/datum/stack_recipe"), [null, "CMO Statue", null, T("/obj/structure/statue/gold/cmo"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "gold_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/gold/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:205)  may sleep
rt.def("/obj/item/stack/sheet/mineral/gold/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("gold_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/silver/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:217)
rt.def("/obj/item/stack/sheet/mineral/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalsilver_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:219)
rt.def("/datum/controller/global_vars/proc/InitGlobalsilver_recipes", function InitGlobalsilver_recipes(f: Frame) {
	rt.setGl("silver_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "silver door", null, T("/obj/structure/mineral_door/silver"), null, 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["silver tile", T("/obj/item/stack/tile/mineral/silver"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Med Officer Statue", null, T("/obj/structure/statue/silver/md"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Janitor Statue", null, T("/obj/structure/statue/silver/janitor"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Sec Officer Statue", null, T("/obj/structure/statue/silver/sec"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Sec Borg Statue", null, T("/obj/structure/statue/silver/secborg"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Med Borg Statue", null, T("/obj/structure/statue/silver/medborg"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "silver_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/silver/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:230)  may sleep
rt.def("/obj/item/stack/sheet/mineral/silver/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("silver_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/bananium/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:242)
rt.def("/obj/item/stack/sheet/mineral/bananium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bananium", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalclown_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:245)
rt.def("/datum/controller/global_vars/proc/InitGlobalclown_recipes", function InitGlobalclown_recipes(f: Frame) {
	rt.setGl("clown_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["bananium tile", T("/obj/item/stack/tile/mineral/bananium"), 1, 4, 20]), rt.new_(f, T("/datum/stack_recipe"), [null, "Clown Statue", null, T("/obj/structure/statue/bananium/clown"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "clown_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/bananium/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:251)  may sleep
rt.def("/obj/item/stack/sheet/mineral/bananium/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("clown_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/titanium/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:268)
rt.def("/obj/item/stack/sheet/mineral/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltitanium_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:270)
rt.def("/datum/controller/global_vars/proc/InitGlobaltitanium_recipes", function InitGlobaltitanium_recipes(f: Frame) {
	rt.setGl("titanium_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["titanium tile", T("/obj/item/stack/tile/mineral/titanium"), 1, 4, 20])));
	rt.modSrcVar(f, "gvars_datum_init_order", "titanium_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/titanium/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:275)  may sleep
rt.def("/obj/item/stack/sheet/mineral/titanium/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("titanium_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/item/stack/sheet/mineral/plastitanium/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:293)
rt.def("/obj/item/stack/sheet/mineral/plastitanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 2000, "$plasma", 2000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalplastitanium_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:295)
rt.def("/datum/controller/global_vars/proc/InitGlobalplastitanium_recipes", function InitGlobalplastitanium_recipes(f: Frame) {
	rt.setGl("plastitanium_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), ["plas-titanium tile", T("/obj/item/stack/tile/mineral/plastitanium"), 1, 4, 20])));
	rt.modSrcVar(f, "gvars_datum_init_order", "plastitanium_recipes", add);
	return f.dot;
});

// /obj/item/stack/sheet/mineral/plastitanium/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:300)  may sleep
rt.def("/obj/item/stack/sheet/mineral/plastitanium/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("plastitanium_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalsnow_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:315)
rt.def("/datum/controller/global_vars/proc/InitGlobalsnow_recipes", function InitGlobalsnow_recipes(f: Frame) {
	rt.setGl("snow_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "Snow Wall", null, T("/turf/closed/wall/mineral/snow"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "Snowman", null, T("/obj/structure/statue/snow/snowman"), null, 5, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), ["Snowball", T("/obj/item/toy/snowball"), 1])));
	rt.modSrcVar(f, "gvars_datum_init_order", "snow_recipes", add);
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

// /obj/item/stack/sheet/mineral/snow/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:322)  may sleep
rt.def("/obj/item/stack/sheet/mineral/snow/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("snow_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(9054, "/obj/item/stack/sheet/mineral/enruranium", "/obj/item/stack/sheet/mineral", {
	name: "enriched uranium",
	icon_state: "sheet-enruranium",
	singular_name: "enriched uranium sheet",
	origin_tech: "materials=6",
	materials: null,
});

// /obj/item/stack/sheet/mineral/enruranium/proc/<init>  (code/game/objects/items/stacks/sheets/mineral.dm:335)
rt.def("/obj/item/stack/sheet/mineral/enruranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$uranium", 3000]));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaladamantine_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:340)
rt.def("/datum/controller/global_vars/proc/InitGlobaladamantine_recipes", function InitGlobaladamantine_recipes(f: Frame) {
	rt.setGl("adamantine_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "incomplete servant golem shell", null, T("/obj/item/golem_shell/servant"), "req_amount", 1, "res_amount", 1], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "adamantine_recipes", add);
	return f.dot;
});

rt.type(9055, "/obj/item/stack/sheet/mineral/adamantine", "/obj/item/stack/sheet/mineral", {
	name: "adamantine",
	icon_state: "sheet-adamantine",
	singular_name: "adamantine sheet",
	origin_tech: "materials=4",
});

// /obj/item/stack/sheet/mineral/adamantine/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:351)  may sleep
rt.def("/obj/item/stack/sheet/mineral/adamantine/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("adamantine_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /datum/controller/global_vars/proc/InitGlobalabductor_recipes  (code/game/objects/items/stacks/sheets/mineral.dm:375)
rt.def("/datum/controller/global_vars/proc/InitGlobalabductor_recipes", function InitGlobalabductor_recipes(f: Frame) {
	rt.setGl("abductor_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "alien bed", null, T("/obj/structure/bed/abductor"), null, 2, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "alien locker", null, T("/obj/structure/closet/abductor"), null, 2, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "alien table frame", null, T("/obj/structure/table_frame/abductor"), null, 1, "time", 15, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "alien airlock assembly", null, T("/obj/structure/door_assembly/door_assembly_abductor"), null, 4, "time", 20, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), null, rt.new_(f, T("/datum/stack_recipe"), ["alien floor tile", T("/obj/item/stack/tile/mineral/abductor"), 1, 4, 20])));
	rt.modSrcVar(f, "gvars_datum_init_order", "abductor_recipes", add);
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

// /obj/item/stack/sheet/mineral/abductor/proc/Initialize  (code/game/objects/items/stacks/sheets/mineral.dm:389)  may sleep
rt.def("/obj/item/stack/sheet/mineral/abductor/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "recipes", rt.gl("abductor_recipes"));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });
