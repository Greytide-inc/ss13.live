// Based on /tg/station's code/modules/clothing/suits/armor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7762, "/obj/item/clothing/suit/armor", "/obj/item/clothing/suit", {
	allowed: null,
	body_parts_covered: 2,
	cold_protection: 6,
	min_cold_protection_temperature: 160,
	heat_protection: 6,
	max_heat_protection_temperature: 600,
	strip_delay: 60,
	equip_delay_other: 40,
	obj_integrity: 250,
	max_integrity: 250,
	resistance_flags: 0,
	armor: null,
});

// armor.dm:2
rt.def("/obj/item/clothing/suit/armor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/weapon/tank/internals/emergency_oxygen"));
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(7782, "/obj/item/clothing/suit/armor/hos", "/obj/item/clothing/suit/armor", {
	name: "armored greatcoat",
	desc: "A greatcoat enhanced with a special alloy for some extra protection and style for those with a commanding presence.",
	icon_state: "hos",
	item_state: "greatcoat",
	body_parts_covered: 414,
	armor: null,
	cold_protection: 414,
	heat_protection: 414,
	strip_delay: 80,
});

// armor.dm:45
rt.def("/obj/item/clothing/suit/armor/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 70, "acid", 90]);
	return f.dot;
});

rt.type(7778, "/obj/item/clothing/suit/armor/vest/capcarapace", "/obj/item/clothing/suit/armor/vest", {
	name: "captain's carapace",
	desc: "A fireproof armored chestpiece reinforced with ceramic plates and plasteel pauldrons to provide additional protection whilst still offering maximum mobility and flexibility. Issued only to the station's finest, although it does chafe your nipples.",
	icon_state: "capcarapace",
	item_state: "armor",
	body_parts_covered: 6,
	armor: null,
	dog_fashion: null,
	resistance_flags: 2,
});

// armor.dm:91
rt.def("/obj/item/clothing/suit/armor/vest/capcarapace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 100, "acid", 90]);
	return f.dot;
});

rt.type(7784, "/obj/item/clothing/suit/armor/riot", "/obj/item/clothing/suit/armor", {
	name: "riot suit",
	desc: "A suit of semi-flexible polycarbonate body armor with heavy padding to protect against melee attacks.",
	icon_state: "riot",
	item_state: "swat_suit",
	body_parts_covered: 2046,
	cold_protection: 2046,
	heat_protection: 2046,
	armor: null,
	strip_delay: 80,
	equip_delay_other: 60,
});

// armor.dm:114
rt.def("/obj/item/clothing/suit/armor/riot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 10, "laser", 10, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]);
	return f.dot;
});

rt.type(7790, "/obj/item/clothing/suit/armor/bone", "/obj/item/clothing/suit/armor", {
	name: "bone armor",
	desc: "A tribal armor plate, crafted from animal bone.",
	icon_state: "bonearmor",
	item_state: "bonearmor",
	blood_overlay_type: "armor",
	armor: null,
	body_parts_covered: 510,
});

// armor.dm:124
rt.def("/obj/item/clothing/suit/armor/bone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 35, "bullet", 25, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(7791, "/obj/item/clothing/suit/armor/bulletproof", "/obj/item/clothing/suit/armor", {
	name: "bulletproof armor",
	desc: "A Type III heavy bulletproof vest that excels in protecting the wearer against traditional projectile weaponry and explosives to a minor extent.",
	icon_state: "bulletproof",
	item_state: "armor",
	blood_overlay_type: "armor",
	armor: null,
	strip_delay: 70,
	equip_delay_other: 50,
});

// armor.dm:133
rt.def("/obj/item/clothing/suit/armor/bulletproof/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 15, "bullet", 60, "laser", 10, "energy", 10, "bomb", 40, "bio", 0, "rad", 0, "fire", 50, "acid", 50]);
	return f.dot;
});

rt.type(7792, "/obj/item/clothing/suit/armor/laserproof", "/obj/item/clothing/suit/armor", {
	hit_reflect_chance: 40,
	name: "reflector vest",
	desc: "A vest that excels in protecting the wearer against energy projectiles, as well as occasionally reflecting them.",
	icon_state: "armor_reflec",
	item_state: "armor_reflec",
	blood_overlay_type: "armor",
	armor: null,
	resistance_flags: 99,
});

// armor.dm:143
rt.def("/obj/item/clothing/suit/armor/laserproof/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 10, "laser", 60, "energy", 50, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// armor.dm:148
rt.def("/obj/item/clothing/suit/armor/laserproof/proc/IsReflect", function IsReflect(f: Frame, def_zone: Value) {
	if (!rt.isIn(f, def_zone, list("chest", "groin"))) {
		return 0;
	}
	if (!prob(this.hit_reflect_chance)) return f.dot;
	return 1;
});

rt.type(7781, "/obj/item/clothing/suit/armor/vest/det_suit", "/obj/item/clothing/suit/armor/vest", {
	name: "detective's armor vest",
	desc: "An armored vest with a detective's badge on it.",
	icon_state: "detective-armor",
	allowed: null,
	resistance_flags: 4,
	dog_fashion: null,
});

// armor.dm:157
rt.def("/obj/item/clothing/suit/armor/vest/det_suit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/device/detective_scanner"), T("/obj/item/device/taperecorder"), T("/obj/item/weapon/melee/classic_baton"));
	return f.dot;
});

rt.type(7793, "/obj/item/clothing/suit/armor/reactive", "/obj/item/clothing/suit/armor", {
	active: 0,
	reactivearmor_cooldown_duration: 0,
	reactivearmor_cooldown: 0,
	name: "reactive armor",
	desc: "Doesn't seem to do much for some reason.",
	icon_state: "reactiveoff",
	item_state: "reactiveoff",
	blood_overlay_type: "armor",
	armor: null,
	actions_types: null,
	resistance_flags: 99,
	hit_reaction_chance: 50,
});

// armor.dm:172
rt.def("/obj/item/clothing/suit/armor/reactive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// armor.dm:179
rt.def("/obj/item/clothing/suit/armor/reactive/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		to_chat(user, `<span class='notice'>${this} is now active.</span>`);
		this.icon_state = "reactive";
		this.item_state = "reactive";
	} else {
		to_chat(user, `<span class='notice'>${this} is now inactive.</span>`);
		this.icon_state = "reactiveoff";
		this.item_state = "reactiveoff";
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// armor.dm:193
rt.def("/obj/item/clothing/suit/armor/reactive/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.active = 0;
	this.icon_state = "reactiveoff";
	this.item_state = "reactiveoff";
	this.reactivearmor_cooldown = rt.worldTime(f) + 200;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7794, "/obj/item/clothing/suit/armor/reactive/teleport", "/obj/item/clothing/suit/armor/reactive", {
	tele_range: 6,
	rad_amount: 15,
	reactivearmor_cooldown_duration: 100,
	name: "reactive teleport armor",
	desc: "Someone seperated our Research Director from his own head!",
});

// armor.dm:207
rt.def("/obj/item/clothing/suit/armor/reactive/teleport/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let H: Value = null, turfs: Value = null, _T: Value = null, picked: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (!this.active) {
		return 0;
	}
	if (prob(this.hit_reaction_chance)) {
		H = owner;
		if (rt.worldTime(f) < this.reactivearmor_cooldown) {
			owner.visible_message(`<span class='danger'>The reactive teleport system is still recharging! It fails to teleport ${H}!</span>`);
			return f.dot;
		}
		owner.visible_message(`<span class='danger'>The reactive teleport system flings ${H} clear of ${attack_text}!</span>`);
		turfs = (yield* new_(T("/list")));
		for (_T of each(orange(this.tele_range, H), T("/turf"))) {
			if (_T.density) {
				continue;
			}
			if (_T.x > rt.world().maxx - this.tele_range || _T.x < this.tele_range) {
				continue;
			}
			if (_T.y > rt.world().maxy - this.tele_range || _T.y < this.tele_range) {
				continue;
			}
			turfs += _T;
		}
		if (!rt.len(f, turfs)) {
			turfs += pick((rt.isIn(f, T("/turf"), orange(this.tele_range, H)) ? 1 : 0));
		}
		if (!isturf((picked = pick(turfs)))) {
			return f.dot;
		}
		yield* H.forceMove(picked);
		yield* H.rad_act(this.rad_amount);
		this.reactivearmor_cooldown = rt.worldTime(f) + this.reactivearmor_cooldown_duration;
		return 1;
	}
	return 0;
}, true);

rt.type(7795, "/obj/item/clothing/suit/armor/reactive/fire", "/obj/item/clothing/suit/armor/reactive", {
	name: "reactive incendiary armor",
	desc: "An experimental suit of armor with a reactive sensor array rigged to a flame emitter. For the stylish pyromaniac.",
});

// armor.dm:240
rt.def("/obj/item/clothing/suit/armor/reactive/fire/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let C: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (!this.active) {
		return 0;
	}
	if (prob(this.hit_reaction_chance)) {
		if (rt.worldTime(f) < this.reactivearmor_cooldown) {
			owner.visible_message(`<span class='danger'>The reactive incendiary armor on ${owner} activates, but fails to send out flames as it is still recharging its flame jets!</spawn>`);
			return f.dot;
		}
		owner.visible_message(`<span class='danger'>The ${this} blocks the ${attack_text}, sending out jets of flame!</span>`);
		for (C of each(range(6, owner), T("/mob/living/carbon"))) {
			if (C != owner) {
				C.fire_stacks += 8;
				yield* C.IgniteMob();
			}
		}
		owner.fire_stacks = -20;
		this.reactivearmor_cooldown = rt.worldTime(f) + this.reactivearmor_cooldown_duration;
		return 1;
	}
	return 0;
}, true);

rt.type(7796, "/obj/item/clothing/suit/armor/reactive/stealth", "/obj/item/clothing/suit/armor/reactive", {
	name: "reactive stealth armor",
	desc: "An experimental suit of armor that renders the wearer invisible on detection of imminent harm, and creates a decoy that runs away from the owner. You can't fight what you can't see.",
});

// armor.dm:262
rt.def("/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let E: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (!this.active) {
		return 0;
	}
	if (!prob(this.hit_reaction_chance)) return f.dot;
	if (rt.worldTime(f) < this.reactivearmor_cooldown) {
		owner.visible_message(`<span class='danger'>The reactive stealth system on ${owner} activates, but is still recharging its holographic emitters!</spawn>`);
		return f.dot;
	}
	yield* (E = (yield* new_(T("/mob/living/simple_animal/hostile/illusion/escape"), owner.loc))).Copy_Parent(owner, 50);
	yield* E.GiveTarget(owner);
	E.Goto(owner, E.move_to_delay, E.minimum_distance);
	owner.alpha = 0;
	owner.visible_message(`<span class='danger'>${owner} is hit by ${attack_text} in the chest!</span>`);
	rt.spawnTail(f, 40, "/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction: spawn at modules/clothing/suits/armor.dm:274", owner, hitby, attack_text, final_block_chance, damage, attack_type, E);
	this.reactivearmor_cooldown = rt.worldTime(f) + this.reactivearmor_cooldown_duration;
	return 1;
}, true);

// a spawn(40) body of /obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction: spawn at modules/clothing/suits/armor.dm:274", function* (f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value, E: Value) {
	owner.alpha = rt.initial(f, owner, "alpha");
	return null;
});

rt.type(7797, "/obj/item/clothing/suit/armor/reactive/tesla", "/obj/item/clothing/suit/armor/reactive", {
	tesla_power: 25000,
	tesla_range: 20,
	tesla_boom: 0,
	tesla_stun: 0,
	name: "reactive tesla armor",
	desc: "An experimental suit of armor with sensitive detectors hooked up to a huge capacitor grid, with emitters strutting out of it. Zap.",
	siemens_coefficient: -1,
});

// armor.dm:289
rt.def("/obj/item/clothing/suit/armor/reactive/tesla/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let sparks: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (!this.active) {
		return 0;
	}
	if (!prob(this.hit_reaction_chance)) return f.dot;
	if (rt.worldTime(f) < this.reactivearmor_cooldown) {
		yield* (sparks = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(1, 1, this);
		yield* sparks.start();
		owner.visible_message(`<span class='danger'>The tesla capacitors on ${owner}'s reactive tesla armor are still recharging! The armor merely emits some sparks.</spawn>`);
		return f.dot;
	}
	owner.visible_message(`<span class='danger'>The ${this} blocks the ${attack_text}, sending out arcs of lightning!</span>`);
	yield* tesla_zap(owner, this.tesla_range, this.tesla_power, this.tesla_boom, this.tesla_stun);
	this.reactivearmor_cooldown = rt.worldTime(f) + this.reactivearmor_cooldown_duration;
	return 1;
}, true);

rt.type(7798, "/obj/item/clothing/suit/armor/reactive/table", "/obj/item/clothing/suit/armor/reactive", {
	tele_range: 10,
	name: "reactive table armor",
	desc: "If you can't beat the memes, embrace them.",
});

// armor.dm:309
rt.def("/obj/item/clothing/suit/armor/reactive/table/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let H: Value = null, turfs: Value = null, _T: Value = null, picked: Value = null;
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	if (!this.active) {
		return 0;
	}
	if (prob(this.hit_reaction_chance)) {
		H = owner;
		if (rt.worldTime(f) < this.reactivearmor_cooldown) {
			owner.visible_message("<span class='danger'>The reactive table armor's fabricators are still on cooldown!</span>");
			return f.dot;
		}
		owner.visible_message(`<span class='danger'>The reactive teleport system flings ${H} clear of ${attack_text} and slams them into a fabricated table!</span>`);
		owner.visible_message(`<font color='red' size='3'>${H} GOES ON THE TABLE!!!</font>`);
		yield* owner.Knockdown(40);
		turfs = (yield* new_(T("/list")));
		for (_T of each(orange(this.tele_range, H), T("/turf"))) {
			if (_T.density) {
				continue;
			}
			if (_T.x > rt.world().maxx - this.tele_range || _T.x < this.tele_range) {
				continue;
			}
			if (_T.y > rt.world().maxy - this.tele_range || _T.y < this.tele_range) {
				continue;
			}
			turfs += _T;
		}
		if (!rt.len(f, turfs)) {
			turfs += pick((rt.isIn(f, T("/turf"), orange(this.tele_range, H)) ? 1 : 0));
		}
		if (!isturf((picked = pick(turfs)))) {
			return f.dot;
		}
		yield* H.forceMove(picked);
		yield* new_(T("/obj/structure/table"), rt.getStep(f, owner, 0));
		this.reactivearmor_cooldown = rt.worldTime(f) + this.reactivearmor_cooldown_duration;
		return 1;
	}
	return 0;
}, true);

rt.type(7799, "/obj/item/clothing/suit/armor/centcom", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	name: "１Centcom armor",
	desc: "A suit that protects against some damage.",
	icon_state: "centcom",
	item_state: "centcom",
	w_class: 4,
	body_parts_covered: 2046,
	allowed: null,
	flags_inv: 13,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	armor: null,
});

// armor.dm:351
rt.def("/obj/item/clothing/suit/armor/centcom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed = list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals/emergency_oxygen"));
	this.armor = rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]);
	return f.dot;
});

rt.type(7800, "/obj/item/clothing/suit/armor/heavy", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	name: "heavy armor",
	desc: "A heavily armored suit that protects against moderate damage.",
	icon_state: "heavy",
	item_state: "swat_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.9,
	body_parts_covered: 2046,
	slowdown: 3,
	flags_inv: 13,
	armor: null,
});

// armor.dm:371
rt.def("/obj/item/clothing/suit/armor/heavy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]);
	return f.dot;
});

rt.type(7801, "/obj/item/clothing/suit/armor/tdome", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	body_parts_covered: 2046,
	flags_inv: 13,
	cold_protection: 2046,
	heat_protection: 2046,
	armor: null,
});

// armor.dm:379
rt.def("/obj/item/clothing/suit/armor/tdome/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]);
	return f.dot;
});
