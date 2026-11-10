// Based on /tg/station's code/game/objects/items/weapons/extinguisher.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7226, "/obj/item/weapon/extinguisher", "/obj/item/weapon", {
	max_water: 50,
	last_use: 1,
	safety: 1,
	refilling: 0,
	sprite_name: "fire_extinguisher",
	power: 5,
	precision: 0,
	cooling_power: 2,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "fire extinguisher",
	desc: "A traditional red fire extinguisher.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "fire_extinguisher0",
	item_state: "fire_extinguisher",
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
	throwforce: 10,
	w_class: 3,
	force: 10,
	materials: null,
	attack_verb: null,
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
	resistance_flags: 2,
});

// extinguisher.dm:14
rt.def("/obj/item/weapon/extinguisher/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 90]);
	this.attack_verb = list("slammed", "whacked", "bashed", "thunked", "battered", "bludgeoned", "thrashed");
	return f.dot;
});

rt.type(7227, "/obj/item/weapon/extinguisher/mini", "/obj/item/weapon/extinguisher", {
	flags: null,
	max_water: 30,
	sprite_name: "miniFE",
	name: "pocket fire extinguisher",
	desc: "A light and compact fibreglass-framed model fire extinguisher.",
	icon_state: "miniFE0",
	item_state: "miniFE",
	hitsound: null,
	throwforce: 2,
	w_class: 2,
	force: 3,
	materials: null,
	dog_fashion: null,
});

// extinguisher.dm:37
rt.def("/obj/item/weapon/extinguisher/mini/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = list();
	return f.dot;
});

// extinguisher.dm:43
rt.def("/obj/item/weapon/extinguisher/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.max_water);
	yield* this.reagents.add_reagent("water", this.max_water);
	return f.dot;
}, true);

// extinguisher.dm:48
rt.def("/obj/item/weapon/extinguisher/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.safety = (!this.safety ? 1 : 0);
	this.icon_state = `${this.sprite_name}${(!this.safety ? 1 : 0)}`;
	let $0: any = this;
	$0.desc = `The safety is ${this.safety ? "on" : "off"}.`;
	to_chat(user, `The safety is ${this.safety ? "on" : "off"}.`);
	return f.dot;
});

// extinguisher.dm:55
rt.def("/obj/item/weapon/extinguisher/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (user.a_intent == "help" && !this.safety) {
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// extinguisher.dm:61
rt.def("/obj/item/weapon/extinguisher/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	if (yield* this.AttemptRefill(O, user)) {
		this.refilling = 1;
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// extinguisher.dm:68
rt.def("/obj/item/weapon/extinguisher/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.reagents.total_volume) {
		to_chat(user, `It contains ${round(this.reagents.total_volume)} units.`);
	} else {
		to_chat(user, "It is empty.");
	}
	return f.dot;
}, false);

// extinguisher.dm:75
rt.def("/obj/item/weapon/extinguisher/proc/AttemptRefill", function* AttemptRefill(f: Frame, target: Value, user: Value) {
	let safety_save: Value = null, W: Value = null, transferred: Value = null, R: Value = null;
	if (rt.istype(target, T("/obj/structure/reagent_dispensers/watertank")) && target.Adjacent(user)) {
		safety_save = this.safety;
		this.safety = 1;
		if (this.reagents.total_volume == this.reagents.maximum_volume) {
			to_chat(user, fmt("<span class='warning'>＄！ is already full!</span>", [this]));
			this.safety = safety_save;
			return 1;
		}
		W = target;
		if ((transferred = (yield* W.reagents.trans_to(this, this.max_water))) > 0) {
			to_chat(user, fmt("<span class='notice'>＄！ has been refilled by ＀ units.</span>", [this, transferred]));
			playsound(this.loc, rt.rsc("sound/effects/refill.ogg"), 50, 1, -6);
			for (R of each(this.reagents.reagent_list, T("/datum/reagent/water"))) {
				R.cooling_temperature = this.cooling_power;
			}
		} else {
			to_chat(user, fmt("<span class='warning'>＄！ is empty!</span>", [W]));
		}
		this.safety = safety_save;
		return 1;
	} else {
		return 0;
	}
}, true);

// extinguisher.dm:98
rt.def("/obj/item/weapon/extinguisher/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let direction: Value = null, B: Value = null, movementdirection: Value = null, _T: Value = null, T1: Value = null, T2: Value = null, the_targets: Value = null, T3: Value = null, T4: Value = null, a: Value = null, W: Value = null, my_target: Value = null, R: Value = null, b: Value = null, A: Value = null;
	if (target.loc == user) {
		return f.dot;
	}
	if (this.refilling) {
		this.refilling = 0;
		return f.dot;
	}
	if (!this.safety) {
		if (this.reagents.total_volume < 1) {
			to_chat(f.usr, fmt("<span class='warning'>＄！ is empty!</span>", [this]));
			return f.dot;
		}
		if (rt.worldTime(f) < this.last_use + 12) {
			return f.dot;
		}
		this.last_use = rt.worldTime(f);
		playsound(this.loc, rt.rsc("sound/effects/extinguish.ogg"), 75, 1, -3);
		direction = rt.getDir(f, this, target);
		if (user.buckled && rt.istype(user.buckled, T("/obj")) && !user.buckled.anchored) {
			rt.spawnTail(f, 0, "/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:119", direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A);
		} else {
			yield* user.newtonian_move(turn(direction, 180));
		}
		_T = rt.getStep(f, target, 0);
		T1 = rt.getStep(f, _T, turn(direction, 90));
		T2 = rt.getStep(f, _T, turn(direction, -90));
		the_targets = list(_T, T1, T2);
		if (this.precision) {
			T3 = rt.getStep(f, T1, turn(direction, 90));
			T4 = rt.getStep(f, T2, turn(direction, -90));
			the_targets = list(_T, T1, T2, T3, T4);
		}
		a = 0;
		while (a < 5) {
			rt.spawnTail(f, 0, "/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:152", direction, B, movementdirection, _T, T1, T2, the_targets, T3, T4, a, W, my_target, R, b, A);
			a++;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/weapon/extinguisher/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:152", function* (f: Frame, direction: Value, B: Value, movementdirection: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, T3: Value, T4: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, A: Value) {
	W = (yield* new_(T("/obj/effect/particle_effect/water"), rt.getStep(f, this, 0)));
	my_target = pick(the_targets);
	if (this.precision) {
		the_targets -= my_target;
	}
	R = (yield* new_(T("/datum/reagents"), 5));
	if (!W) {
		return f.dot;
	}
	W.reagents = R;
	R.my_atom = W;
	if (!W || !this) {
		return f.dot;
	}
	yield* this.reagents.trans_to(W, 1);
	b = null;
	b = 0;
	while (b < this.power) {
		yield* step_towards(W, my_target);
		if (!W || !W.reagents) {
			return f.dot;
		}
		yield* W.reagents.reaction(rt.getStep(f, W, 0));
		A = null;
		for (A of each(rt.getStep(f, W, 0))) {
			if (!W) {
				return f.dot;
			}
			yield* W.reagents.reaction(A);
		}
		if (W.loc == my_target) {
			break;
		}
		yield* sleep(2);
		b++;
	}
	return null;
});

// a spawn(0) body of /obj/item/weapon/extinguisher/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/proc/afterattack: spawn at game/objects/items/weapons/extinguisher.dm:119", function* (f: Frame, direction: Value, B: Value, movementdirection: Value, _T: Value, T1: Value, T2: Value, the_targets: Value, T3: Value, T4: Value, a: Value, W: Value, my_target: Value, R: Value, b: Value, A: Value) {
	B = f.args[1].buckled;
	movementdirection = turn(direction, 180);
	yield* step(B, movementdirection);
	yield* sleep(1);
	yield* step(B, movementdirection);
	yield* sleep(1);
	yield* step(B, movementdirection);
	yield* sleep(1);
	yield* step(B, movementdirection);
	yield* sleep(2);
	yield* step(B, movementdirection);
	yield* sleep(2);
	yield* step(B, movementdirection);
	yield* sleep(3);
	yield* step(B, movementdirection);
	yield* sleep(3);
	yield* step(B, movementdirection);
	yield* sleep(3);
	yield* step(B, movementdirection);
	return null;
});

// extinguisher.dm:177
rt.def("/obj/item/weapon/extinguisher/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* this.EmptyExtinguisher(user);
	return f.dot;
}, true);

// extinguisher.dm:180
rt.def("/obj/item/weapon/extinguisher/proc/EmptyExtinguisher", function* EmptyExtinguisher(f: Frame, user: Value) {
	let _T: Value = null, theturf: Value = null;
	if (!(this.loc == user && this.reagents.total_volume)) return f.dot;
	yield* this.reagents.clear_reagents();
	if (rt.istype((_T = rt.getStep(f, this.loc, 0)), T("/turf/open"))) {
		yield* (theturf = _T).MakeSlippery({ min_wet_time: 10, wet_time_to_add: 5 });
	}
	user.visible_message(fmt("＀ empties out ％！ onto the floor using the release valve.", [user, this]), fmt("<span class='info'>You quietly empty out ％！ using its release valve.</span>", [this]));
	return f.dot;
}, true);
