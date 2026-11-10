// Based on /tg/station's code/game/objects/items/weapons/grenades/grenade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(6879, "/obj/item/weapon/grenade", "/obj/item/weapon", {
	active: 0,
	det_time: 50,
	display_timer: 1,
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	name: "grenade",
	desc: "It has an adjustable timer.",
	w_class: 2,
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "grenade",
	item_state: "flashbang",
	slot_flags: 512,
	resistance_flags: 4,
	obj_integrity: 40,
	max_integrity: 40,
});

// Empty in tg.
rt.def("/obj/item/weapon/grenade/proc/prime");

// grenade.dm:20
rt.def("/obj/item/weapon/grenade/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!disassembled) {
		yield* this.prime();
	}
	if (!this || this.gc_destroyed) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// grenade.dm:26
rt.def("/obj/item/weapon/grenade/proc/clown_check", function clown_check(f: Frame, user: Value) {
	if (rt.bitAnd(user.disabilities, 256) && prob(50)) {
		to_chat(user, "<span class='warning'>Huh? How does this thing work?</span>");
		this.active = 1;
		this.icon_state = rt.initial(f, this, "icon_state") + "_active";
		playsound(this.loc, rt.rsc("sound/weapons/armbomb.ogg"), 75, 1, -3);
		rt.spawnTail(f, 5, "/obj/item/weapon/grenade/proc/clown_check: spawn at game/objects/items/weapons/grenades/grenade.dm:31", user);
		return 0;
	}
	return 1;
});

// a spawn(5) body of /obj/item/weapon/grenade/proc/clown_check, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/grenade/proc/clown_check: spawn at game/objects/items/weapons/grenades/grenade.dm:31", function* (f: Frame, user: Value) {
	if (user) {
		yield* user.drop_item();
	}
	yield* this.prime();
	return null;
});

// grenade.dm:40
rt.def("/obj/item/weapon/grenade/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.display_timer) return f.dot;
	if (this.det_time > 1) {
		to_chat(user, fmt("The timer is set to ＀ second５.", [this.det_time / 10]));
	} else {
		to_chat(user, fmt("＄！ is set for instant detonation.", [this]));
	}
	return f.dot;
}, false);

// grenade.dm:49
rt.def("/obj/item/weapon/grenade/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let C: Value = null;
	if (this.active) return f.dot;
	if (!(yield* this.clown_check(user))) return f.dot;
	yield* this.preprime(user);
	if (!rt.istype(user, T("/mob/living/carbon"))) return f.dot;
	(C = user).throw_mode_on();
	return f.dot;
}, true);

// grenade.dm:58
rt.def("/obj/item/weapon/grenade/proc/preprime", function* preprime(f: Frame, user: Value) {
	let message: Value = null;
	let $0: any, $1: any, $2: any;
	if (user) {
		to_chat(user, `<span class='warning'>You prime the ${this.name}! ${this.det_time / 10} seconds!</span>`);
	}
	playsound(this.loc, rt.rsc("sound/weapons/armbomb.ogg"), 60, 1);
	this.active = 1;
	this.icon_state = rt.initial(f, this, "icon_state") + "_active";
	yield* this.add_fingerprint(user);
	let bombturf: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(bombturf);
	if (user) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		$1 = this.name;
		if (bombturf) {
			$2 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
		} else {
			$2 = "nonexistent location";
		}
		GLOB.bombers += (message = `${$0}) has primed a ${$1} for detonation at ${`${$2}`}`);
		message_admins(message);
		log_game(`${key_name(f.usr)} has primed a ${this.name} for detonation at ${A.name} ${`(${bombturf.x},${bombturf.y},${bombturf.z})`}.`);
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/proc/prime"))), this.det_time);
	return f.dot;
}, true);

// grenade.dm:76
rt.def("/obj/item/weapon/grenade/proc/update_mob", function* update_mob(f: Frame) {
	let M: Value = null;
	if (!ismob(this.loc)) return f.dot;
	yield* (M = this.loc).dropItemToGround(this);
	return f.dot;
}, true);

// grenade.dm:82
rt.def("/obj/item/weapon/grenade/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.det_time === "1") {
			this.det_time = 10;
			to_chat(user, `<span class='notice'>You set the ${this.name} for 1 second detonation time.</span>`);
		} else if (this.det_time === "10") {
			this.det_time = 30;
			to_chat(user, `<span class='notice'>You set the ${this.name} for 3 second detonation time.</span>`);
		} else if (this.det_time === "30") {
			this.det_time = 50;
			to_chat(user, `<span class='notice'>You set the ${this.name} for 5 second detonation time.</span>`);
		} else if (this.det_time === "50") {
			this.det_time = 1;
			to_chat(user, `<span class='notice'>You set the ${this.name} for instant detonation.</span>`);
		}
		yield* this.add_fingerprint(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// grenade.dm:101
rt.def("/obj/item/weapon/grenade/proc/attack_hand", function* attack_hand(f: Frame) {
	walk(this, null, null);
	yield* parent_proc();
	return f.dot;
}, true);

// grenade.dm:105
rt.def("/obj/item/weapon/grenade/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// grenade.dm:108
rt.def("/obj/item/weapon/grenade/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	let _P: Value = hitby;
	if (!(damage && attack_type == 3 && _P.damage_type != "stamina" && prob(15))) return f.dot;
	owner.visible_message(`<span class='danger'>${attack_text} hits ${owner}'s ${this}, setting it off! What a shot!</span>`);
	yield* this.prime();
	return 1;
}, true);
