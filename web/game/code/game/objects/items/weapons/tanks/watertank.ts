// Based on /tg/station's code/game/objects/items/weapons/tanks/watertank.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7470, "/obj/item/weapon/watertank", "/obj/item/weapon", {
	noz: null,
	on: 0,
	volume: 500,
	name: "backpack water tank",
	desc: "A S.U.N.S.H.I.N.E. brand watertank backpack with nozzle to water plants.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "waterbackpack",
	item_state: "waterbackpack",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// watertank.dm:11
rt.def("/obj/item/weapon/watertank/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_mister"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]);
	return f.dot;
});

// watertank.dm:22
rt.def("/obj/item/weapon/watertank/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(this.volume);
	this.noz = (yield* this.make_noz());
	return f.dot;
}, true);

// watertank.dm:27
rt.def("/obj/item/weapon/watertank/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.toggle_mister();
	return f.dot;
}, true);

// watertank.dm:30
rt.def("/obj/item/weapon/watertank/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != user.getBackSlot()) return f.dot;
	return 1;
});

// watertank.dm:36
rt.def("/obj/item/weapon/watertank/verb/toggle_mister", function* toggle_mister(f: Frame) {
	if (f.usr.get_item_by_slot(f.usr.getBackSlot()) != this) {
		to_chat(f.usr, "<span class='warning'>The watertank must be worn properly to use!</span>");
		return f.dot;
	}
	if (f.usr.incapacitated()) {
		return f.dot;
	}
	this.on = (!this.on ? 1 : 0);
	let user: Value = f.usr;
	if (this.on) {
		if (this.noz === null) {
			this.noz = (yield* this.make_noz());
		}
		if (!(yield* user.put_in_hands(this.noz))) {
			this.on = 0;
			to_chat(user, "<span class='warning'>You need a free hand to hold the mister!</span>");
			return f.dot;
		}
		this.noz.loc = user;
	} else {
		yield* this.remove_noz();
	}
	return f.dot;
}, true, { verb: { name: "Toggle Mister", category: "Object" } });

// watertank.dm:60
rt.def("/obj/item/weapon/watertank/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* new_(T("/obj/item/weapon/reagent_containers/spray/mister"), this));
}, true);

// watertank.dm:63
rt.def("/obj/item/weapon/watertank/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	yield* parent_proc();
	if (slot == slot_back) return f.dot;
	yield* this.remove_noz();
	return f.dot;
}, true);

// watertank.dm:68
rt.def("/obj/item/weapon/watertank/proc/remove_noz", function* remove_noz(f: Frame) {
	let M: Value = null;
	if (ismob(this.noz.loc)) {
		yield* (M = this.noz.loc).temporarilyRemoveItemFromInventory(this.noz, 1);
	}
	return f.dot;
}, true);

// watertank.dm:75
rt.def("/obj/item/weapon/watertank/proc/Destroy", function* Destroy(f: Frame) {
	if (this.on) {
		yield* qdel(this.noz);
	}
	return (yield* parent_proc());
}, true);

// watertank.dm:79
rt.def("/obj/item/weapon/watertank/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user) {
		yield* this.ui_action_click();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// watertank.dm:86
rt.def("/obj/item/weapon/watertank/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null;
	if (!(rt.istype((M = this.loc), T("/mob")) && rt.istype(over_object, T("/obj/screen/inventory/hand")))) return f.dot;
	let H: Value = over_object;
	yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index);
	return f.dot;
}, true);

// watertank.dm:91
rt.def("/obj/item/weapon/watertank/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (W == this.noz) {
		yield* this.remove_noz();
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(6373, "/obj/item/weapon/reagent_containers/spray/mister", "/obj/item/weapon/reagent_containers/spray", {
	tank: null,
	flags: 6,
	container_type: 4096,
	name: "water mister",
	desc: "A mister nozzle attached to a water tank.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "mister",
	item_state: "mister",
	w_class: 4,
	amount_per_transfer_from_this: 50,
	possible_transfer_amounts: null,
	volume: 500,
	slot_flags: 0,
});

// watertank.dm:118
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/New", function* New(f: Frame, parent_tank: Value) {
	yield* parent_proc();
	if (yield* check_tank_exists(parent_tank, this)) {
		this.tank = parent_tank;
		this.reagents = this.tank.reagents;
		this.loc = this.tank;
	}
	return f.dot;
}, true);

// watertank.dm:126
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='notice'>The mister snaps back onto the watertank.</span>");
	this.tank.on = 0;
	this.loc = this.tank;
	return f.dot;
}, true);

// watertank.dm:135
rt.def("/proc/check_tank_exists", function* check_tank_exists(f: Frame, parent_tank: Value, M: Value, O: Value) {
	if (!parent_tank || !rt.istype(parent_tank, T("/obj/item/weapon/watertank"))) {
		yield* qdel(O);
		return 0;
	} else {
		return 1;
	}
}, true);

// watertank.dm:142
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (this.loc == this.tank.loc) return f.dot;
	this.loc = this.tank.loc;
	return f.dot;
}, true);

// watertank.dm:147
rt.def("/obj/item/weapon/reagent_containers/spray/mister/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (target.loc == this.loc) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7471, "/obj/item/weapon/watertank/janitor", "/obj/item/weapon/watertank", {
	name: "backpack water tank",
	desc: "A janitorial watertank backpack with nozzle to clean dirt and graffiti.",
	icon_state: "waterbackpackjani",
	item_state: "waterbackpackjani",
});

// watertank.dm:159
rt.def("/obj/item/weapon/watertank/janitor/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("cleaner", 500);
	return f.dot;
}, true);

rt.type(6374, "/obj/item/weapon/reagent_containers/spray/mister/janitor", "/obj/item/weapon/reagent_containers/spray/mister", {
	name: "janitor spray nozzle",
	desc: "A janitorial spray nozzle attached to a watertank, designed to clean up large messes.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "misterjani",
	item_state: "misterjani",
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
});

// watertank.dm:169
rt.def("/obj/item/weapon/reagent_containers/spray/mister/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	return f.dot;
});

// watertank.dm:172
rt.def("/obj/item/weapon/watertank/janitor/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* new_(T("/obj/item/weapon/reagent_containers/spray/mister/janitor"), this));
}, true);

// watertank.dm:175
rt.def("/obj/item/weapon/reagent_containers/spray/mister/janitor/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	this.amount_per_transfer_from_this = this.amount_per_transfer_from_this == 10 ? 5 : 10;
	$0 = user;
	if (this.amount_per_transfer_from_this == 10) {
		$1 = "remove";
	} else {
		$1 = "fix";
	}
	to_chat($0, `<span class='notice'>You ${$1} the nozzle. You'll now use ${this.amount_per_transfer_from_this} units per spray.</span>`);
	return f.dot;
});

rt.type(7472, "/obj/item/weapon/watertank/atmos", "/obj/item/weapon/watertank", {
	volume: 200,
	name: "backpack firefighter tank",
	desc: "A refridgerated and pressurized backpack tank with extinguisher nozzle, intended to fight fires. Swaps between extinguisher, resin launcher and a smaller scale resin foamer.",
	item_state: "waterbackpackatmos",
	icon_state: "waterbackpackatmos",
	slowdown: 0,
});

// watertank.dm:193
rt.def("/obj/item/weapon/watertank/atmos/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("water", 200);
	return f.dot;
}, true);

// watertank.dm:197
rt.def("/obj/item/weapon/watertank/atmos/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* new_(T("/obj/item/weapon/extinguisher/mini/nozzle"), this));
}, true);

// watertank.dm:200
rt.def("/obj/item/weapon/watertank/atmos/proc/dropped", function* dropped(f: Frame, user: Value) {
	let N: Value = null;
	yield* parent_proc();
	this.icon_state = "waterbackpackatmos";
	if (!rt.istype(this.noz, T("/obj/item/weapon/extinguisher/mini/nozzle"))) return f.dot;
	(N = this.noz).nozzle_mode = 0;
	return f.dot;
}, true);

rt.type(7228, "/obj/item/weapon/extinguisher/mini/nozzle", "/obj/item/weapon/extinguisher/mini", {
	tank: null,
	nozzle_mode: 0,
	metal_synthesis_cooldown: 0,
	resin_cooldown: 0,
	safety: 0,
	max_water: 200,
	power: 8,
	precision: 1,
	cooling_power: 5,
	flags: 2,
	name: "extinguisher nozzle",
	desc: "A heavy duty nozzle attached to a firefighter's backpack tank.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "atmos_nozzle",
	item_state: "nozzleatmos",
	force: 10,
	w_class: 5,
});

// watertank.dm:226
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/New", function* New(f: Frame, parent_tank: Value) {
	yield* parent_proc();
	if (!(yield* check_tank_exists(parent_tank, this))) return f.dot;
	this.tank = parent_tank;
	this.reagents = this.tank.reagents;
	this.max_water = this.tank.volume;
	this.loc = this.tank;
	return f.dot;
}, true);

// watertank.dm:235
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (this.loc != this.tank.loc) {
		this.loc = this.tank;
	}
	return f.dot;
}, true);

// watertank.dm:241
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.nozzle_mode === EXTINGUISHER) {
		this.nozzle_mode = RESIN_LAUNCHER;
		this.tank.icon_state = "waterbackpackatmos_1";
		to_chat(user, "Swapped to resin launcher");
		return f.dot;
	} else if (this.nozzle_mode === RESIN_LAUNCHER) {
		this.nozzle_mode = RESIN_FOAM;
		this.tank.icon_state = "waterbackpackatmos_2";
		to_chat(user, "Swapped to resin foamer");
		return f.dot;
	} else if (this.nozzle_mode === RESIN_FOAM) {
		this.nozzle_mode = EXTINGUISHER;
		this.tank.icon_state = "waterbackpackatmos_0";
		to_chat(user, "Swapped to water extinguisher");
		return f.dot;
	}
	return f.dot;
});

// watertank.dm:260
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='notice'>The nozzle snaps back onto the tank!</span>");
	this.tank.on = 0;
	this.loc = this.tank;
	return f.dot;
}, true);

// watertank.dm:266
rt.def("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	let Adj: Value = null, R: Value = null, A: Value = null, a: Value = null, S: Value = null, F: Value = null;
	if (this.nozzle_mode == EXTINGUISHER) {
		yield* parent_proc();
		return f.dot;
	}
	if (Adj = user.Adjacent(target)) {
		yield* this.AttemptRefill(target, user);
	}
	if (this.nozzle_mode == RESIN_LAUNCHER) {
		if (Adj) {
			return f.dot;
		}
		if ((R = this.reagents).total_volume < 100) {
			to_chat(user, "<span class='warning'>You need at least 100 units of water to use the resin launcher!</span>");
			return f.dot;
		}
		if (this.resin_cooldown) {
			to_chat(user, "<span class='warning'>Resin launcher is still recharging...</span>");
			return f.dot;
		}
		this.resin_cooldown = 1;
		yield* R.remove_any(100);
		A = (yield* new_(T("/obj/effect/resin_container"), rt.getStep(f, this, 0)));
		log_game(`${key_name_admin(user)} used Resin Launcher at ${get_area(user)} ${`(${user.x},${user.y},${user.z})`}.`);
		playsound(this, rt.rsc("sound/items/syringeproj.ogg"), 40, 1);
		a = 0;
		while (a < 5) {
			yield* step_towards(A, target);
			yield* sleep(2);
			a++;
		}
		yield* A.Smoke();
		rt.spawnTail(f, 100, "/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:291", Adj, R, A, a, S, F);
		return f.dot;
	}
	if (this.nozzle_mode != RESIN_FOAM) return f.dot;
	if (!Adj || !isturf(target)) {
		return f.dot;
	}
	for (S of each(target)) {
		if (rt.istype(S, T("/obj/effect/particle_effect/foam/metal/resin")) || rt.istype(S, T("/obj/structure/foamedmetal/resin"))) {
			to_chat(user, "<span class='warning'>There's already resin here!</span>");
			return f.dot;
		}
	}
	if (this.metal_synthesis_cooldown < 5) {
		(F = (yield* new_(T("/obj/effect/particle_effect/foam/metal/resin"), rt.getStep(f, target, 0)))).amount = 0;
		this.metal_synthesis_cooldown++;
		rt.spawnTail(f, 100, "/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:306", Adj, R, A, a, S, F);
	} else {
		to_chat(user, "<span class='warning'>Resin foam mix is still being synthesized...</span>");
		return f.dot;
	}
	return f.dot;
}, true);

// a spawn(100) body of /obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:306", function* (f: Frame, Adj: Value, R: Value, A: Value, a: Value, S: Value, F: Value) {
	this.metal_synthesis_cooldown--;
	return null;
});

// a spawn(100) body of /obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/extinguisher/mini/nozzle/proc/afterattack: spawn at game/objects/items/weapons/tanks/watertank.dm:291", function* (f: Frame, Adj: Value, R: Value, A: Value, a: Value, S: Value, F: Value) {
	if (this) {
		this.resin_cooldown = 0;
	}
	return null;
});

rt.type(11953, "/obj/effect/resin_container", "/obj/effect", {
	pass_flags: 1,
	name: "resin container",
	desc: "A compacted ball of expansive resin, used to repair the atmosphere in a room, or seal off breaches.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "frozen_smoke_capsule",
	mouse_opacity: 0,
});

// watertank.dm:321
rt.def("/obj/effect/resin_container/proc/Smoke", function* Smoke(f: Frame) {
	let S: Value = null;
	(S = (yield* new_(T("/obj/effect/particle_effect/foam/metal/resin"), rt.getStep(f, this.loc, 0)))).amount = 3;
	playsound(this, rt.rsc("sound/effects/bamf.ogg"), 100, 1);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6389, "/obj/item/weapon/reagent_containers/chemtank", "/obj/item/weapon/reagent_containers", {
	on: 0,
	usage_ratio: 5,
	injection_amount: 1,
	container_type: 4096,
	name: "backpack chemical injector",
	desc: "A chemical autoinjector that can be carried on your back.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "waterbackpackatmos",
	item_state: "waterbackpackatmos",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
	volume: 300,
	amount_per_transfer_from_this: 5,
	spillable: 0,
	possible_transfer_amounts: null,
});

// watertank.dm:339
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/activate_injector"));
	this.possible_transfer_amounts = list(5, 10, 15);
	return f.dot;
});

// watertank.dm:351
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/ui_action_click", function ui_action_click(f: Frame) {
	this.toggle_injection();
	return f.dot;
});

// watertank.dm:354
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_back) return f.dot;
	return 1;
});

// watertank.dm:358
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/toggle_injection", function toggle_injection(f: Frame) {
	let user: Value = null;
	if (!rt.istype((user = f.usr), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (user.get_item_by_slot(slot_back) != this) {
		to_chat(user, "<span class='warning'>The chemtank needs to be on your back before you can activate it!</span>");
		return f.dot;
	}
	if (this.on) {
		this.turn_off();
	} else {
		this.turn_on();
	}
	return f.dot;
});

// watertank.dm:371
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/update_filling", function update_filling(f: Frame) {
	let percent: Value = null;
	this.cut_overlays();
	if (!this.reagents.total_volume) return f.dot;
	let filling: Value = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), "backpack-10");
	const subject = (percent = round(this.reagents.total_volume / this.volume * 100));
	if (rt.inRange(subject, 0, 15)) {
		filling.icon_state = "backpack-10";
	} else if (rt.inRange(subject, 16, 60)) {
		filling.icon_state = "backpack50";
	} else if (rt.inRange(subject, 61, 1e+31)) {
		filling.icon_state = "backpack100";
	}
	filling.color = mix_color_from_reagents(this.reagents.reagent_list);
	this.add_overlay(filling);
	return f.dot;
});

// watertank.dm:389
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/worn_overlays", function worn_overlays(f: Frame, isinhands: Value) {
	let percent: Value = null;
	isinhands ??= 0;
	f.dot = list();
	if (!(!isinhands && this.reagents.total_volume)) return f.dot;
	let filling: Value = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), "backpackmob-10");
	const subject = (percent = round(this.reagents.total_volume / this.volume * 100));
	if (rt.inRange(subject, 0, 15)) {
		filling.icon_state = "backpackmob-10";
	} else if (rt.inRange(subject, 16, 60)) {
		filling.icon_state = "backpackmob50";
	} else if (rt.inRange(subject, 61, 1e+31)) {
		filling.icon_state = "backpackmob100";
	}
	filling.color = mix_color_from_reagents(this.reagents.reagent_list);
	f.dot += filling;
	return f.dot;
});

// watertank.dm:408
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/turn_on", function turn_on(f: Frame) {
	this.on = 1;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	if (!ismob(this.loc)) return f.dot;
	to_chat(this.loc, `<span class='notice'>${this} turns on.</span>`);
	return f.dot;
});

// watertank.dm:414
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/turn_off", function turn_off(f: Frame) {
	this.on = 0;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (!ismob(this.loc)) return f.dot;
	to_chat(this.loc, `<span class='notice'>${this} turns off.</span>`);
	return f.dot;
});

// watertank.dm:419
rt.def("/obj/item/weapon/reagent_containers/chemtank/proc/process", function* process(f: Frame) {
	let user: Value = null;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		yield* this.turn_off();
		return f.dot;
	}
	if (!this.reagents.total_volume) {
		yield* this.turn_off();
		return f.dot;
	}
	if ((user = this.loc).back != this) {
		yield* this.turn_off();
		return f.dot;
	}
	let used_amount: Value = this.injection_amount / this.usage_ratio;
	yield* this.reagents.reaction(user, INJECT, this.injection_amount, 0);
	yield* this.reagents.trans_to(user, used_amount, { multiplier: this.usage_ratio });
	this.update_filling();
	user.update_inv_back();
	return f.dot;
}, true, { waitfor: false });

rt.type(7473, "/obj/item/weapon/watertank/operator", "/obj/item/weapon/watertank", {
	volume: 2000,
	name: "backpack water tank",
	desc: "A New Russian backpack spray for systematic cleansing of carbon lifeforms.",
	icon_state: "waterbackpackjani",
	item_state: "waterbackpackjani",
	w_class: 3,
	slowdown: 0,
});

// watertank.dm:447
rt.def("/obj/item/weapon/watertank/operator/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("mutagen", 350);
	yield* this.reagents.add_reagent("napalm", 125);
	yield* this.reagents.add_reagent("welding_fuel", 125);
	yield* this.reagents.add_reagent("clf3", 300);
	yield* this.reagents.add_reagent("cryptobiolin", 350);
	yield* this.reagents.add_reagent("plasma", 250);
	yield* this.reagents.add_reagent("condensedcapsaicin", 500);
	return f.dot;
}, true);

// watertank.dm:467
rt.def("/obj/item/weapon/watertank/operator/proc/make_noz", function* make_noz(f: Frame) {
	return (yield* new_(T("/obj/item/weapon/reagent_containers/spray/mister/operator"), this));
}, true);
