// From code/modules/projectiles/guns/magic/staff.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/weapon/gun/magic/staff/chaos/proc/<init>  (code/modules/projectiles/guns/magic/staff.dm:41)
rt.def("/obj/item/weapon/gun/magic/staff/chaos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed_projectile_types", rt.list(T("/obj/item/projectile/magic/change"), T("/obj/item/projectile/magic/animate"), T("/obj/item/projectile/magic/resurrection"), T("/obj/item/projectile/magic/death"), T("/obj/item/projectile/magic/teleport"), T("/obj/item/projectile/magic/door"), T("/obj/item/projectile/magic/aoe/fireball"), T("/obj/item/projectile/magic/spellblade"), T("/obj/item/projectile/magic/arcane_barrage")));
	return f.dot;
});

// /obj/item/weapon/gun/magic/staff/chaos/proc/process_fire  (code/modules/projectiles/guns/magic/staff.dm:46)  may sleep
rt.def("/obj/item/weapon/gun/magic/staff/chaos/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value) {
	f.vars = () => [target, user, message, params, zone_override, bonus_spread];
	if (live(message) === null) {
		message = 1;
	}
	if (live(bonus_spread) === null) {
		bonus_spread = 0;
	}
	rt.setFv(f, "projectile_type", rt.sv(f, "chambered"), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "allowed_projectile_types")]));
	f.dot = (yield* g.callSuper(f, [live(target), live(user), live(message), live(params), live(zone_override), live(bonus_spread)]));
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

// /obj/item/weapon/gun/magic/staff/spellblade/proc/hit_reaction  (code/modules/projectiles/guns/magic/staff.dm:85)
rt.def("/obj/item/weapon/gun/magic/staff/spellblade/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (isEqual(live(f.args[5]), 3)) {
		f.args[3] = 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
