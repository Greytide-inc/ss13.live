// Based on /tg/station's code/modules/hydroponics/grown/towercap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10086, "/obj/item/seeds/tower", "/obj/item/seeds", {
	species: "towercap",
	plantname: "Tower Caps",
	product: rt.typePath("/obj/item/weapon/grown/log"),
	lifespan: 80,
	endurance: 50,
	maturation: 15,
	production: 1,
	yield: 5,
	potency: 50,
	growthstages: 3,
	growing_icon: rt.rsc("icons/obj/hydroponics/growing_mushrooms.dmi"),
	icon_dead: "towercap-dead",
	genes: null,
	name: "pack of tower-cap mycelium",
	desc: "This mycelium grows into tower-cap mushrooms.",
	icon_state: "mycelium-tower",
	mutatelist: null,
});

// towercap.dm:17
rt.def("/obj/item/seeds/tower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"));

	this.mutatelist = list(T("/obj/item/seeds/tower/steel"));
	return f.dot;
});

rt.type(10087, "/obj/item/seeds/tower/steel", "/obj/item/seeds/tower", {
	species: "steelcap",
	plantname: "Steel Caps",
	product: rt.typePath("/obj/item/weapon/grown/log/steel"),
	mutatelist: null,
	rarity: 20,
	name: "pack of steel-cap mycelium",
	desc: "This mycelium grows into steel logs.",
	icon_state: "mycelium-steelcap",
});

// towercap.dm:27
rt.def("/obj/item/seeds/tower/steel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();
	return f.dot;
});

rt.type(7504, "/obj/item/weapon/grown/log", "/obj/item/weapon/grown", {
	plank_name: "wooden planks",
	accepted: null,
	plank_type: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	throw_speed: 2,
	throw_range: 3,
	seed: rt.typePath("/obj/item/seeds/tower"),
	name: "tower-cap log",
	desc: "It's better than bad, it's good!",
	icon_state: "logs",
	force: 5,
	throwforce: 5,
	w_class: 3,
	origin_tech: "materials=1",
	attack_verb: null,
});

// towercap.dm:47
rt.def("/obj/item/weapon/grown/log/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.accepted = list(T("/obj/item/weapon/reagent_containers/food/snacks/grown/tobacco"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/tea"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/vulgaris"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/ambrosia/deus"), T("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"));
	this.attack_verb = list("bashed", "battered", "bludgeoned", "whacked");
	return f.dot;
});

// towercap.dm:54
rt.def("/obj/item/weapon/grown/log/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.accepted = typecacheof(this.accepted);
	return f.dot;
}, true);

// towercap.dm:58
rt.def("/obj/item/weapon/grown/log/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let seed_modifier: Value = null, plank: Value = null, old_plank_amount: Value = null, ST: Value = null, leaf: Value = null, _T: Value = null;
	if (W.sharpness) {
		user.show_message(fmt("<span class='notice'>You make ＀ out of ％！!</span>", [this.plank_name, this]), 1);
		seed_modifier = 0;
		if (this.seed) {
			seed_modifier = round(this.seed.potency / 25);
		}
		plank = (yield* new_(this.plank_type, user.loc, 1 + seed_modifier));
		old_plank_amount = plank.amount;
		for (ST of each(user.loc, T("/obj/item/stack"))) {
			if (ST != plank && rt.op(f, "IsType", [], [ST, this.plank_type]) && ST.amount < ST.max_amount) {
				yield* ST.attackby(plank, user);
			}
		}
		if (plank.amount > old_plank_amount) {
			to_chat(user, `<span class='notice'>You add the newly-formed ${this.plank_name} to the stack. It now contains ${plank.amount} ${this.plank_name}.</span>`);
		}
		yield* qdel(this);
	}
	if (is_type_in_typecache(W, this.accepted)) {
		if ((leaf = W).dry) {
			user.show_message(fmt("<span class='notice'>You wrap ％！ around the log, turning it into a torch!</span>", [W]));
			_T = (yield* new_(T("/obj/item/device/flashlight/flare/torch"), user.loc));
			yield* f.usr.dropItemToGround(W);
			yield* f.usr.put_in_active_hand(_T);
			yield* qdel(leaf);
			yield* qdel(this);
			return f.dot;
		} else {
			to_chat(f.usr, "<span class ='warning'>You must dry this first!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(7506, "/obj/item/weapon/grown/log/steel", "/obj/item/weapon/grown/log", {
	accepted: null,
	plank_name: "rods",
	seed: rt.typePath("/obj/item/seeds/tower/steel"),
	name: "steel-cap log",
	desc: "It's made of metal.",
	icon_state: "steellogs",
	plank_type: rt.typePath("/obj/item/stack/rods"),
});

// towercap.dm:97
rt.def("/obj/item/weapon/grown/log/steel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.accepted = list();
	return f.dot;
});

rt.type(12941, "/obj/structure/bonfire", "/obj/structure", {
	burning: 0,
	grill: 0,
	fire_stack_strength: 5,
	anchored: 1,
	buckle_lying: 0,
	name: "bonfire",
	desc: "For grilling, broiling, charring, smoking, heating, roasting, toasting, simmering, searing, melting, and occasionally burning things.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "bonfire",
	density: 0,
});

// towercap.dm:117
rt.def("/obj/structure/bonfire/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let R: Value = null, choice: Value = null, rod_underlay: Value = null, grill_overlay: Value = null, click_params: Value = null;
	if (rt.istype(W, T("/obj/item/stack/rods")) && !this.can_buckle && !this.grill) {
		R = W;
		const subject = (choice = (yield* g.op(f, "Prompt", [1], [null, "Bonfire", "What would you like to construct?", user, list("Stake", "Grill")])));
		if (subject === "Stake") {
			yield* R.use(1);
			this.can_buckle = 1;
			this.buckle_requires_restraints = 1;
			to_chat(user, fmt("<span class='italics'>You add a rod to ％！.", [this]));
			(rod_underlay = mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "bonfire_rod")).pixel_y = 16;
			this.underlays += rod_underlay;
		} else if (subject === "Grill") {
			yield* R.use(1);
			this.grill = 1;
			to_chat(user, fmt("<span class='italics'>You add a grill to ％！.", [this]));
			this.overlays += (grill_overlay = mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "bonfire_grill"));
		} else {
			return (yield* parent_proc());
		}
	}
	if (W.is_hot()) {
		yield* this.StartBurning();
	}
	if (!this.grill) return f.dot;
	if (user.a_intent != "harm" && !rt.bitAnd(W.flags, ABSTRACT)) {
		if (yield* user.temporarilyRemoveItemFromInventory(W)) {
			yield* W.forceMove(rt.getStep(f, this, 0));
			if (!(click_params = params2list(params)) || !rt.at(click_params, "icon-x") || !rt.at(click_params, "icon-y")) {
				return f.dot;
			}
			W.pixel_x = max(-(rt.world().icon_size / 2), min(text2num(rt.at(click_params, "icon-x")) - 16, rt.world().icon_size / 2));
			W.pixel_y = max(-(rt.world().icon_size / 2), min(text2num(rt.at(click_params, "icon-y")) - 16, rt.world().icon_size / 2));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// towercap.dm:156
rt.def("/obj/structure/bonfire/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let I: Value = null, L: Value = null;
	let $e: any;
	if (this.burning) {
		to_chat(user, `<span class='warning'>You need to extinguish ${this} before removing the logs!`);
		return f.dot;
	}
	if (!this.has_buckled_mobs() && (yield* do_after(user, 50, { target: this }))) {
		rt.forRange(f, 0, 1, 5, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			(L = (yield* new_(T("/obj/item/weapon/grown/log"), this.loc))).pixel_x += rand(1, 4);
			L.pixel_y += rand(1, 4);
		}
		rt.endFor(f, 0);
		yield* qdel(this);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// towercap.dm:169
rt.def("/obj/structure/bonfire/proc/CheckOxygen", function CheckOxygen(f: Frame) {
	let O: Value = null, G: Value = null;
	if (rt.istype(this.loc, T("/turf/open"))) {
		if ((O = this.loc).air) {
			if (rt.index(rt.index((G = O.air.gases), "o2"), 1) > 13) {
				return 1;
			}
		}
	}
	return 0;
});

// towercap.dm:178
rt.def("/obj/structure/bonfire/proc/StartBurning", function* StartBurning(f: Frame) {
	if (!(!this.burning && this.CheckOxygen())) return f.dot;
	this.icon_state = "bonfire_on_fire";
	this.burning = 1;
	this.set_light(6);
	yield* this.Burn();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// towercap.dm:186
rt.def("/obj/structure/bonfire/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* this.StartBurning();
	return f.dot;
}, true);

// towercap.dm:189
rt.def("/obj/structure/bonfire/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (!rt.bitAnd(this.burning, (!this.grill ? 1 : 0))) return f.dot;
	yield* this.Burn();
	return f.dot;
}, true);

// towercap.dm:193
rt.def("/obj/structure/bonfire/proc/Burn", function* Burn(f: Frame) {
	let current_location: Value = null, A: Value = null, O: Value = null, L: Value = null;
	yield* (current_location = rt.getStep(f, this, 0)).hotspot_expose(1000, 500, 1);
	for (A of each(current_location)) {
		if (A == this) {
			continue;
		}
		if (rt.istype(A, T("/obj"))) {
			yield* (O = A).fire_act(1000, 500);
		} else if (rt.istype(A, T("/mob/living"))) {
			yield* (L = A).adjust_fire_stacks(this.fire_stack_strength);
			yield* L.IgniteMob();
		}
	}
	return f.dot;
}, true);

// towercap.dm:207
rt.def("/obj/structure/bonfire/proc/Cook", function* Cook(f: Frame) {
	let A: Value = null, L: Value = null, O: Value = null;
	let current_location: Value = rt.getStep(f, this, 0);
	for (A of each(current_location)) {
		if (A == this) {
			continue;
		}
		if (rt.istype(A, T("/mob/living"))) {
			yield* (L = A).adjust_fire_stacks(this.fire_stack_strength);
			yield* L.IgniteMob();
		} else if (rt.istype(A, T("/obj/item")) && prob(20)) {
			yield* (O = A).microwave_act();
		}
	}
	return f.dot;
}, true);

// towercap.dm:220
rt.def("/obj/structure/bonfire/proc/process", function* process(f: Frame) {
	if (!this.CheckOxygen()) {
		yield* this.extinguish();
		return f.dot;
	}
	if (!this.grill) {
		yield* this.Burn();
	} else {
		yield* this.Cook();
	}
	return f.dot;
}, true, { waitfor: false });

// towercap.dm:230
rt.def("/obj/structure/bonfire/proc/extinguish", function extinguish(f: Frame) {
	if (!this.burning) return f.dot;
	this.icon_state = "bonfire";
	this.burning = 0;
	this.set_light(0);
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

// towercap.dm:236
rt.def("/obj/structure/bonfire/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (!(yield* parent_proc())) return f.dot;
	f.args[0].pixel_y += 13;
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// towercap.dm:240
rt.def("/obj/structure/bonfire/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	f.args[0].pixel_y -= 13;
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });
