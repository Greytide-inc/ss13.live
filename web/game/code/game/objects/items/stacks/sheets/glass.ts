// Based on /tg/station's code/game/objects/items/stacks/sheets/glass.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, fmt } = rt;


// glass.dm:11
rt.def("/datum/controller/global_vars/proc/InitGlobalglass_recipes", function InitGlobalglass_recipes(f: Frame) {
	GLOB.glass_recipes = list(new_(T("/datum/stack_recipe"), "directional window", T("/obj/structure/window/unanchored"), { time: 0, on_floor: 1, window_checks: 1 }), new_(T("/datum/stack_recipe"), "fulltile window", T("/obj/structure/window/fulltile/unanchored"), 2, { time: 0, on_floor: 1, window_checks: 1 }));
	rt.modSrcVar(f, "gvars_datum_init_order", "glass_recipes", add);
	return f.dot;
});

rt.type(9022, "/obj/item/stack/sheet/glass", "/obj/item/stack/sheet", {
	name: "glass",
	desc: "HOLY SHEET! That is a lot of glass.",
	singular_name: "glass sheet",
	icon_state: "sheet-glass",
	materials: null,
	origin_tech: "materials=1",
	armor: null,
	resistance_flags: 32,
	merge_type: rt.typePath("/obj/item/stack/sheet/glass"),
});

// glass.dm:21
rt.def("/obj/item/stack/sheet/glass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 2000]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 100]);
	return f.dot;
});

rt.type(9023, "/obj/item/stack/sheet/glass/cyborg", "/obj/item/stack/sheet/glass", {
	materials: null,
	is_cyborg: 1,
	cost: 500,
});

// glass.dm:28
rt.def("/obj/item/stack/sheet/glass/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// glass.dm:36
rt.def("/obj/item/stack/sheet/glass/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.glass_recipes;
	yield* parent_proc();
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// glass.dm:40
rt.def("/obj/item/stack/sheet/glass/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let CC: Value = null, new_tile: Value = null, V: Value = null, RG: Value = null, G: Value = null, replace: Value = null;
	yield* g.srcCall(f, "add_fingerprint", user);
	if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		CC = W;
		if ((yield* g.srcCall(f, "get_amount")) < 1 || CC.get_amount() < 5) {
			to_chat(user, "<span class='warning>You need five lengths of coil and one sheet of glass to make wired glass!</span>");
			return f.dot;
		}
		yield* CC.use(5);
		yield* g.srcCall(f, "use", 1);
		to_chat(user, `<span class='notice'>You attach wire to the ${rt.sv(f, "name")}.</span>`);
		yield* (new_tile = (yield* new_(T("/obj/item/stack/light_w"), user.loc))).add_fingerprint(user);
	} else if (rt.istype(W, T("/obj/item/stack/rods"))) {
		if ((V = W).get_amount() >= 1 && f.src.get_amount() >= 1) {
			yield* (RG = (yield* new_(T("/obj/item/stack/sheet/rglass"), user.loc))).add_fingerprint(user);
			G = f.src;
			f.src = null;
			replace = (user.get_inactive_held_item() == G ? 1 : 0);
			yield* V.use(1);
			yield* G.use(1);
			if (!G && replace) {
				yield* user.put_in_hands(RG);
			}
		} else {
			to_chat(user, "<span class='warning'>You need one rod and one sheet of glass to make reinforced glass!</span>");
			return f.dot;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// glass.dm:73
rt.def("/datum/controller/global_vars/proc/InitGlobalreinforced_glass_recipes", function InitGlobalreinforced_glass_recipes(f: Frame) {
	GLOB.reinforced_glass_recipes = list(new_(T("/datum/stack_recipe"), "windoor frame", T("/obj/structure/windoor_assembly"), 5, { time: 0, on_floor: 1, window_checks: 1 }), null, new_(T("/datum/stack_recipe"), "directional reinforced window", T("/obj/structure/window/reinforced/unanchored"), { time: 0, on_floor: 1, window_checks: 1 }), new_(T("/datum/stack_recipe"), "fulltile reinforced window", T("/obj/structure/window/reinforced/fulltile/unanchored"), 2, { time: 0, on_floor: 1, window_checks: 1 }));
	rt.modSrcVar(f, "gvars_datum_init_order", "reinforced_glass_recipes", add);
	return f.dot;
});

rt.type(9025, "/obj/item/stack/sheet/rglass", "/obj/item/stack/sheet", {
	name: "reinforced glass",
	desc: "Glass which seems to have rods or something stuck in them.",
	singular_name: "reinforced glass sheet",
	icon_state: "sheet-rglass",
	materials: null,
	origin_tech: "materials=2",
	armor: null,
	resistance_flags: 32,
	merge_type: rt.typePath("/obj/item/stack/sheet/rglass"),
});

// glass.dm:86
rt.def("/obj/item/stack/sheet/rglass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 1000, "$glass", 2000]);
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 100]);
	return f.dot;
});

rt.type(9026, "/obj/item/stack/sheet/rglass/cyborg", "/obj/item/stack/sheet/rglass", {
	glasource: null,
	metcost: 250,
	glacost: 500,
	materials: null,
});

// glass.dm:93
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// glass.dm:99
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/get_amount", function get_amount(f: Frame) {
	return min(round(this.source.energy / this.metcost), round(this.glasource.energy / this.glacost));
});

// glass.dm:102
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/use", function use(f: Frame, amount: Value) {
	this.source.use_charge(amount * this.metcost);
	this.glasource.use_charge(amount * this.glacost);
	return f.dot;
});

// glass.dm:106
rt.def("/obj/item/stack/sheet/rglass/cyborg/proc/add", function _add(f: Frame, amount: Value) {
	this.source.add_charge(amount * this.metcost);
	this.glasource.add_charge(amount * this.glacost);
	return f.dot;
});

// glass.dm:110
rt.def("/obj/item/stack/sheet/rglass/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	this.recipes = GLOB.reinforced_glass_recipes;
	yield* parent_proc();
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

rt.type(7052, "/obj/item/weapon/shard", "/obj/item/weapon", {
	cooldown: 0,
	name: "shard",
	desc: "A nasty looking shard of glass.",
	icon: rt.rsc("icons/obj/shards.dmi"),
	icon_state: "large",
	w_class: 1,
	force: 5,
	throwforce: 10,
	item_state: "shard-glass",
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	resistance_flags: 32,
	armor: null,
	obj_integrity: 40,
	max_integrity: 40,
	sharpness: 1,
});

// glass.dm:123
rt.def("/obj/item/weapon/shard/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 2000]);
	this.attack_verb = list("stabbed", "slashed", "sliced", "cut");
	this.armor = rt.alist(f, ["melee", 100, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 100]);
	return f.dot;
});

// glass.dm:134
rt.def("/obj/item/weapon/shard/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is slitting ${user.p_their()} ${pick("wrists", "throat")} with the shard of glass! It looks like ${user.p_theyre()} trying to commit suicide.</span>`);
	return 1;
});

// glass.dm:139
rt.def("/obj/item/weapon/shard/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.icon_state = pick("large", "medium", "small");
	if (this.icon_state === "small") {
		this.pixel_x = rand(-12, 12);
		this.pixel_y = rand(-12, 12);
	} else if (this.icon_state === "medium") {
		this.pixel_x = rand(-8, 8);
		this.pixel_y = rand(-8, 8);
	} else if (this.icon_state === "large") {
		this.pixel_x = rand(-5, 5);
		this.pixel_y = rand(-5, 5);
	}
	return f.dot;
}, true);

// glass.dm:153
rt.def("/obj/item/weapon/shard/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let H: Value = null, M: Value = null;
	if (!proximity || !rt.isIn(f, f.src, user)) {
		return f.dot;
	}
	if (isturf(A)) {
		return f.dot;
	}
	if (rt.istype(A, T("/obj/item/weapon/storage"))) {
		return f.dot;
	}
	let hit_hand: Value = (user.active_hand_index % 2 == 0 ? "r_" : "l_") + "arm";
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if (!(H = user).gloves && !rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
			to_chat(H, `<span class='warning'>${f.src} cuts into your hand!</span>`);
			yield* H.apply_damage(this.force * 0.5, "brute", hit_hand);
		}
	} else {
		if (!rt.istype(user, T("/mob/living/carbon/monkey"))) return f.dot;
		to_chat((M = user), `<span class='warning'>${f.src} cuts into your hand!</span>`);
		yield* M.apply_damage(this.force * 0.5, "brute", hit_hand);
	}
	return f.dot;
}, true);

// glass.dm:172
rt.def("/obj/item/weapon/shard/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, NG: Value = null, G: Value = null;
	if (rt.istype(I, T("/obj/item/device/lightreplacer"))) {
		yield* I.attackby(f.src, user);
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = I).remove_fuel(0, user)) {
			NG = (yield* new_(T("/obj/item/stack/sheet/glass"), user.loc));
			for (G of each(user.loc, T("/obj/item/stack/sheet/glass"))) {
				if (G == NG) {
					continue;
				}
				if (G.amount >= G.max_amount) {
					continue;
				}
				yield* G.attackby(NG, user);
			}
			to_chat(user, fmt("<span class='notice'>You add the newly-formed glass to the stack. It now contains ＀ sheet５.</span>", [NG.amount]));
			yield* qdel(f.src);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// glass.dm:190
rt.def("/obj/item/weapon/shard/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let O: Value = null;
	if (!(rt.istype(AM, T("/mob")) && (yield* this.has_gravity(this.loc)))) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/glass_step.ogg"), 50, 1);
	if (!rt.istype(AM, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = AM;
	if (rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
		return f.dot;
	}
	let picked_def_zone: Value = pick("l_leg", "r_leg");
	if (!rt.istype((O = H.get_bodypart(picked_def_zone)), T("/obj/item/bodypart"))) {
		return f.dot;
	}
	if (O.status == BODYPART_ROBOTIC) {
		return f.dot;
	}
	let feetCover: Value = ((H.wear_suit && rt.bitAnd(H.wear_suit.body_parts_covered, FEET)) || (H.w_uniform && rt.bitAnd(H.w_uniform.body_parts_covered, FEET)));
	if (H.shoes || feetCover || rt.bitAnd(H.movement_type, BODYPART_ROBOTIC) || H.buckled) {
		return f.dot;
	}
	yield* H.apply_damage(5, "brute", picked_def_zone);
	if (this.cooldown < rt.worldTime(f) - 10) {
		if (!H.incapacitated()) {
			H.visible_message(`<span class='danger'>${H} steps in the broken glass!</span>`, "<span class='userdanger'>You step in the broken glass!</span>");
		} else {
			H.visible_message(`<span class='danger'>${H} slides on the broken glass!</span>`, "<span class='userdanger'>You slide on the broken glass!</span>");
		}
		this.cooldown = rt.worldTime(f);
	}
	yield* H.Knockdown(60);
	return f.dot;
}, true);
