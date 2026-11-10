// Based on /tg/station's code/game/objects/items/stacks/rods.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


// rods.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalrod_recipes", function InitGlobalrod_recipes(f: Frame) {
	GLOB.rod_recipes = list(new_(T("/datum/stack_recipe"), "grille", T("/obj/structure/grille"), 2, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "table frame", T("/obj/structure/table_frame"), 2, { time: 10, one_per_turf: 1, on_floor: 1 }), new_(T("/datum/stack_recipe"), "scooter frame", T("/obj/item/scooter_frame"), 10, { time: 25, one_per_turf: 0 }));
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

// rods.dm:19
rt.def("/obj/item/stack/rods/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1000]);
	this.attack_verb = list("hit", "bludgeoned", "whacked");
	return f.dot;
});

// rods.dm:26
rt.def("/obj/item/stack/rods/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	yield* parent_proc();
	this.recipes = GLOB.rod_recipes;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// rods.dm:32
rt.def("/obj/item/stack/rods/proc/update_icon", function update_icon(f: Frame) {
	let amount: Value = null;
	if ((amount = this.get_amount()) <= 5 && amount > 0) {
		this.icon_state = `rods-${amount}`;
	} else {
		this.icon_state = "rods";
	}
	return f.dot;
});

// rods.dm:39
rt.def("/obj/item/stack/rods/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null, new_item: Value = null, R: Value = null, replace: Value = null, S: Value = null, A: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		WT = W;
		if ((yield* g.srcCall(f, "get_amount")) < 2) {
			to_chat(user, "<span class='warning'>You need at least two rods to do this!</span>");
			return f.dot;
		}
		if (yield* WT.remove_fuel(0, user)) {
			new_item = (yield* new_(T("/obj/item/stack/sheet/metal"), f.usr.loc));
			user.visible_message(`${user.name} shaped ${f.src} into metal with the welding tool.`, `<span class='notice'>You shape ${f.src} into metal with the welding tool.</span>`, "<span class='italics'>You hear welding.</span>");
			R = f.src;
			f.src = null;
			replace = (user.get_inactive_held_item() == R ? 1 : 0);
			yield* R.use(2);
			if (!R && replace) {
				yield* user.put_in_hands(new_item);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		S = W;
		if (rt.sv(f, "amount") != 1) {
			to_chat(user, "<span class='warning'>You must use a single rod!</span>");
		} else if (S.w_class > WEIGHT_CLASS_SMALL) {
			to_chat(user, `<span class='warning'>The ingredient is too big for ${f.src}!</span>`);
		} else {
			yield* (A = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/customizable/kebab"), rt.getStep(f, f.src, 0)))).initialize_custom_food(f.src, S, user);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9007, "/obj/item/stack/rods/cyborg", "/obj/item/stack/rods", {
	materials: null,
	is_cyborg: 1,
	cost: 250,
});

// rods.dm:71
rt.def("/obj/item/stack/rods/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});
