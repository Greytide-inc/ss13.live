// Based on /tg/station's code/modules/clothing/shoes/miscellaneous.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// miscellaneous.dm:4
rt.def("/obj/item/clothing/shoes/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is bashing ${user.p_their()} own head in with ${this}! Ain't that a kick in the head?</span>`);
	let i: Value = 0;
	while (i < 3) {
		yield* sleep(3);
		playsound(user, rt.rsc("sound/weapons/genhit2.ogg"), 50, 1);
		i++;
	}
	return 1;
}, true);

rt.type(8460, "/obj/item/clothing/shoes/combat", "/obj/item/clothing/shoes", {
	name: "combat boots",
	desc: "High speed, low drag combat boots.",
	icon_state: "jackboots",
	item_state: "jackboots",
	armor: null,
	strip_delay: 70,
	resistance_flags: 0,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
});

// miscellaneous.dm:20
rt.def("/obj/item/clothing/shoes/combat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 25, "laser", 25, "energy", 25, "bomb", 50, "bio", 10, "rad", 0, "fire", 70, "acid", 50]);
	return f.dot;
});

rt.type(8463, "/obj/item/clothing/shoes/combat/swat", "/obj/item/clothing/shoes/combat", {
	flags: 1024,
	name: "１SWAT boots",
	desc: "High speed, no drag combat boots.",
	permeability_coefficient: 0.01,
	armor: null,
});

// miscellaneous.dm:30
rt.def("/obj/item/clothing/shoes/combat/swat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 40, "bullet", 30, "laser", 25, "energy", 25, "bomb", 50, "bio", 30, "rad", 30, "fire", 90, "acid", 50]);
	return f.dot;
});

rt.type(8495, "/obj/item/clothing/shoes/galoshes", "/obj/item/clothing/shoes", {
	flags: 1024,
	desc: "A pair of yellow rubber boots, designed to prevent slipping on wet surfaces.",
	name: "galoshes",
	icon_state: "galoshes",
	permeability_coefficient: 0.05,
	slowdown: 1,
	strip_delay: 50,
	equip_delay_other: 50,
	resistance_flags: 0,
	armor: null,
});

// miscellaneous.dm:60
rt.def("/obj/item/clothing/shoes/galoshes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 40, "acid", 75]);
	return f.dot;
});

rt.type(8496, "/obj/item/clothing/shoes/galoshes/dry", "/obj/item/clothing/shoes/galoshes", {
	name: "absorbent galoshes",
	desc: "A pair of orange rubber boots, designed to prevent slipping on wet surfaces while also drying them.",
	icon_state: "galoshes_dry",
});

// miscellaneous.dm:68
rt.def("/obj/item/clothing/shoes/galoshes/dry/proc/step_action", function step_action(f: Frame) {
	let t_loc: Value = null;
	if (!(rt.istype((t_loc = rt.getStep(f, this, 0)), T("/turf/open")) && t_loc.wet)) return f.dot;
	t_loc.MakeDry(TURF_WET_WATER);
	t_loc.wet_time = 0;
	return f.dot;
});

rt.type(8487, "/obj/item/clothing/shoes/clown_shoes", "/obj/item/clothing/shoes", {
	footstep: 1,
	desc: "The prankster's standard-issue clowning shoes. Damn, they're huge!",
	name: "clown shoes",
	icon_state: "clown",
	item_state: "clown_shoes",
	slowdown: 1,
	item_color: "clown",
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes/clown"),
});

// miscellaneous.dm:84
rt.def("/obj/item/clothing/shoes/clown_shoes/proc/step_action", function step_action(f: Frame) {
	if (this.footstep > 1) {
		playsound(this, "clownstep", 50, 1);
		this.footstep = 0;
	} else {
		this.footstep++;
	}
	return f.dot;
});

rt.type(8509, "/obj/item/clothing/shoes/bhop", "/obj/item/clothing/shoes", {
	jumpdistance: 5,
	jumpspeed: 3,
	recharging_rate: 60,
	recharging_time: 0,
	jumping: 0,
	name: "jump boots",
	desc: "A specialized pair of combat boots with a built-in propulsion system for rapid foward movement.",
	icon_state: "jetboots",
	item_state: "jetboots",
	item_color: "hosred",
	resistance_flags: 2,
	pockets: rt.typePath("/obj/item/weapon/storage/internal/pocket/shoes"),
	actions_types: null,
});

// miscellaneous.dm:182
rt.def("/obj/item/clothing/shoes/bhop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/bhop"));
	return f.dot;
});

// miscellaneous.dm:190
rt.def("/obj/item/clothing/shoes/bhop/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	if (!rt.istype(f.usr, T("/mob/living"))) {
		return f.dot;
	}
	if (this.jumping) {
		return f.dot;
	}
	if (this.recharging_time > rt.worldTime(f)) {
		to_chat(f.usr, "<span class='warning'>The boot's internal propulsion needs to recharge still!</span>");
		return f.dot;
	}
	let target: Value = get_edge_target_turf(f.usr, f.usr.dir);
	this.jumping = 1;
	playsound(this.loc, rt.rsc("sound/effects/stealthoff.ogg"), 50, 1, 1);
	f.usr.visible_message(`<span class='warning'>${f.usr} dashes foward into the air!</span>`);
	yield* f.usr.throw_at(target, this.jumpdistance, this.jumpspeed, { spin: 0, diagonals_first: 1, callback: (yield* new_(T("/datum/callback"), this, P("/obj/item/clothing/shoes/bhop/proc/hop_end"))) });
	return f.dot;
}, true);

// miscellaneous.dm:209
rt.def("/obj/item/clothing/shoes/bhop/proc/hop_end", function hop_end(f: Frame) {
	this.jumping = 0;
	this.recharging_time = rt.worldTime(f) + this.recharging_rate;
	return f.dot;
});
