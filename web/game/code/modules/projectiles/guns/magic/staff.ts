// Based on /tg/station's code/modules/projectiles/guns/magic/staff.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5127, "/obj/item/weapon/gun/magic/staff/chaos", "/obj/item/weapon/gun/magic/staff", {
	allowed_projectile_types: null,
	max_charges: 10,
	recharge_rate: 2,
	no_den_usage: 1,
	name: "staff of chaos",
	desc: "An artefact that spits bolts of chaotic magic that can potentially do anything.",
	fire_sound: rt.rsc("sound/magic/staff_chaos.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/chaos"),
	icon_state: "staffofchaos",
	item_state: "staffofchaos",
});

// staff.dm:41
rt.def("/obj/item/weapon/gun/magic/staff/chaos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed_projectile_types = list(T("/obj/item/projectile/magic/change"), T("/obj/item/projectile/magic/animate"), T("/obj/item/projectile/magic/resurrection"), T("/obj/item/projectile/magic/death"), T("/obj/item/projectile/magic/teleport"), T("/obj/item/projectile/magic/door"), T("/obj/item/projectile/magic/aoe/fireball"), T("/obj/item/projectile/magic/spellblade"), T("/obj/item/projectile/magic/arcane_barrage"));
	return f.dot;
});

// staff.dm:46
rt.def("/obj/item/weapon/gun/magic/staff/chaos/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value) {
	message ??= 1;
	bonus_spread ??= 0;
	this.chambered.projectile_type = pick(this.allowed_projectile_types);
	f.dot = (yield* parent_proc(target, user, message, params, zone_override, bonus_spread));
	return f.dot;
}, true);

rt.type(5130, "/obj/item/weapon/gun/magic/staff/spellblade", "/obj/item/weapon/gun/magic/staff", {
	max_charges: 4,
	name: "spellblade",
	desc: "A deadly combination of laziness and boodlust, this blade allows the user to dismember their enemies without all the hard work of actually swinging the sword.",
	fire_sound: rt.rsc("sound/magic/fireball.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/spellblade"),
	icon_state: "spellblade",
	item_state: "spellblade",
	hitsound: rt.rsc("sound/weapons/rapierhit.ogg"),
	force: 20,
	armour_penetration: 75,
	block_chance: 50,
	sharpness: 1,
});

// staff.dm:85
rt.def("/obj/item/weapon/gun/magic/staff/spellblade/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	if (f.args[5] == 3) {
		f.args[3] = 0;
	}
	return parent_proc();
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
