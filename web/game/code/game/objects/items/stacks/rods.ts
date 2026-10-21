// From code/game/objects/items/stacks/rods.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalrod_recipes  (code/game/objects/items/stacks/rods.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalrod_recipes", function InitGlobalrod_recipes(f: Frame) {
	rt.setGl("rod_recipes", rt.list(rt.new_(f, T("/datum/stack_recipe"), [null, "grille", null, T("/obj/structure/grille"), null, 2, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "table frame", null, T("/obj/structure/table_frame"), null, 2, "time", 10, "one_per_turf", 1, "on_floor", 1], rt.Args.Named), rt.new_(f, T("/datum/stack_recipe"), [null, "scooter frame", null, T("/obj/item/scooter_frame"), null, 10, "time", 25, "one_per_turf", 0], rt.Args.Named)));
	rt.modSrcVar(f, "gvars_datum_init_order", "rod_recipes", add);
	return f.dot;
});

rt.type(9006, "/obj/item/stack/rods", "/obj/item/stack", {
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "metal rod",
	desc: "Some rods. Can be used for building or something.",
	singular_name: "metal rod",
	icon_state: "rods",
	item_state: "rods",
	w_class: 3,
	force: 9,
	throwforce: 10,
	materials: null,
	max_amount: 50,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	novariants: 1,
});

// /obj/item/stack/rods/proc/<init>  (code/game/objects/items/stacks/rods.dm:19)
rt.def("/obj/item/stack/rods/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	rt.setSv(f, "attack_verb", rt.list("hit", "bludgeoned", "whacked"));
	return f.dot;
});

// /obj/item/stack/rods/proc/Initialize  (code/game/objects/items/stacks/rods.dm:26)  may sleep
rt.def("/obj/item/stack/rods/proc/Initialize", function* Initialize(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "recipes", rt.gl("rod_recipes"));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /obj/item/stack/rods/proc/update_icon  (code/game/objects/items/stacks/rods.dm:32)
rt.def("/obj/item/stack/rods/proc/update_icon", function update_icon(f: Frame) {
	let amount: Value = null;
	f.vars = () => [amount];
	if ((rt.le((amount = rt.callSrc(f, "get_amount", [])), 5) && rt.gt(live(amount), 0))) {
		rt.setSv(f, "icon_state", fmt("rods-＀", [live(amount)]));
	} else {
		rt.setSv(f, "icon_state", "rods");
	}
	return f.dot;
});

// /obj/item/stack/rods/proc/attackby  (code/game/objects/items/stacks/rods.dm:39)  may sleep
rt.def("/obj/item/stack/rods/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, new_item: Value = null, R: Value = null, replace: Value = null, S: Value = null, A: Value = null;
	f.vars = () => [WT, new_item, R, replace, S, A];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		WT = live(f.args[0]);
		if (rt.lt((yield* g.srcCall(f, "get_amount")), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two rods to do this!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
			new_item = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.usr))]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaped ＀ into metal with the welding tool.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You shape ＀ into metal with the welding tool.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
			R = live(f.src);
			f.src = null;
			replace = (isEqual((yield* g.callName(f, live(f.args[1]), "get_inactive_held_item", [])), live(R)) ? 1 : 0);
			yield* g.callName(f, live(R), "use", [2]);
			if ((!truthy(live(R)) && truthy(live(replace)))) {
				yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(new_item)]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks")) ? 1 : 0))) {
			S = live(f.args[0]);
			if (!isEqual(rt.sv(f, "amount"), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You must use a single rod!</span>"]);
			} else {
				if (rt.gt(rt.fv(f, "w_class", live(S)), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ingredient is too big for ＀!</span>", [live(f.src)])]);
				} else {
					yield* g.callName(f, (A = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab"), [rt.getStep(f, live(f.src), 0)]))), "initialize_custom_food", [live(f.src), live(S), live(f.args[1])]);
				}
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9007, "/obj/item/stack/rods/cyborg", "/obj/item/stack/rods", {
	materials: null,
	is_cyborg: 1,
	cost: 250,
});

// /obj/item/stack/rods/cyborg/proc/<init>  (code/game/objects/items/stacks/rods.dm:71)
rt.def("/obj/item/stack/rods/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});
