// Based on /tg/station's code/modules/mining/minebot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4919, "/mob/living/simple_animal/hostile/mining_drone", "/mob/living/simple_animal/hostile", {
	mode: 1,
	light_on: 0,
	toggle_light_action: null,
	toggle_mode_action: null,
	dump_ore_action: null,
	name: "nanotrasen minebot",
	desc: "The instructions printed on the side read: This is a small robot used to support miners, can be set to search and collect loose ore, or to help fend off wildlife. A mining scanner can instruct it to drop loose ore. Field repairs can be done with a welder.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "mining_drone",
	icon_living: "mining_drone",
	status_flags: 11,
	mouse_opacity: 1,
	faction: null,
	a_intent: "harm",
	atmos_requirements: null,
	minbodytemp: 0,
	wander: 0,
	idle_vision_range: 5,
	move_to_delay: 10,
	retreat_distance: 1,
	minimum_distance: 2,
	health: 125,
	maxHealth: 125,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	obj_damage: 0,
	environment_smash: 0,
	check_friendly_fire: 1,
	stop_automated_movement_when_pulled: 1,
	attacktext: "drills",
	attack_sound: rt.rsc("sound/weapons/circsawhit.ogg"),
	ranged: 1,
	sentience_type: 4,
	ranged_message: "shoots",
	ranged_cooldown_time: 30,
	projectiletype: rt.typePath("/obj/item/projectile/kinetic"),
	projectilesound: rt.rsc("sound/weapons/gunshot4.ogg"),
	speak_emote: null,
	wanted_objects: null,
	healable: 0,
});

// minebot.dm:13
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("neutral");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.speak_emote = list("states");

	this.wanted_objects = list(T("/obj/item/weapon/ore/diamond"), T("/obj/item/weapon/ore/gold"), T("/obj/item/weapon/ore/silver"), T("/obj/item/weapon/ore/plasma"), T("/obj/item/weapon/ore/uranium"), T("/obj/item/weapon/ore/iron"), T("/obj/item/weapon/ore/bananium"), T("/obj/item/weapon/ore/titanium"));
	return f.dot;
});

// minebot.dm:51
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.toggle_light_action = (yield* new_(T("/datum/action/innate/minedrone/toggle_light")));
	yield* this.toggle_light_action.Grant(this);
	this.toggle_mode_action = (yield* new_(T("/datum/action/innate/minedrone/toggle_mode")));
	yield* this.toggle_mode_action.Grant(this);
	this.dump_ore_action = (yield* new_(T("/datum/action/innate/minedrone/dump_ore")));
	yield* this.dump_ore_action.Grant(this);
	this.SetCollectBehavior();
	return f.dot;
}, true);

// minebot.dm:66
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if ((W = I).welding && !this.stat) {
			if (this.AIStatus != AI_OFF && this.AIStatus != AI_IDLE) {
				to_chat(user, `<span class='info'>${this} is moving around too much to repair!</span>`);
				return f.dot;
			}
			if (this.maxHealth == this.health) {
				to_chat(user, `<span class='info'>${this} is at full integrity.</span>`);
			} else if (yield* W.remove_fuel(0, user)) {
				yield* this.adjustBruteLoss(-10);
				to_chat(user, `<span class='info'>You repair some of the armor on ${this}.</span>`);
			}
			return f.dot;
		}
	}
	if (rt.istype(I, T("/obj/item/device/mining_scanner")) || rt.istype(I, T("/obj/item/device/t_scanner/adv_mining_scanner"))) {
		to_chat(user, `<span class='info'>You instruct ${this} to drop any collected ore.</span>`);
		this.DropOre();
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// minebot.dm:86
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/death", function* death(f: Frame) {
	yield* parent_proc();
	this.visible_message(`<span class='danger'>${this} is destroyed!</span>`);
	yield* new_(T("/obj/effect/decal/cleanable/robot_debris"), this.loc);
	this.DropOre(0);
	yield* qdel(this);
	return f.dot;
}, true);

// minebot.dm:94
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	if (M.a_intent == "help") {
		yield* this.toggle_mode();
		if (this.mode === MINEDRONE_COLLECT) {
			to_chat(M, `<span class='info'>${this} has been set to search and store loose ore.</span>`);
		} else if (this.mode === MINEDRONE_ATTACK) {
			to_chat(M, `<span class='info'>${this} has been set to attack hostile wildlife.</span>`);
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// minebot.dm:112
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/SetCollectBehavior", function SetCollectBehavior(f: Frame) {
	this.mode = MINEDRONE_COLLECT;
	this.idle_vision_range = 9;
	this.search_objects = 2;
	this.wander = 1;
	this.ranged = 0;
	this.minimum_distance = 1;
	this.retreat_distance = null;
	this.icon_state = "mining_drone";
	to_chat(this, "<span class='info'>You are set to collect mode. You can now collect loose ore.</span>");
	return f.dot;
});

// minebot.dm:123
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/SetOffenseBehavior", function SetOffenseBehavior(f: Frame) {
	this.mode = MINEDRONE_ATTACK;
	this.idle_vision_range = 7;
	this.search_objects = 0;
	this.wander = 0;
	this.ranged = 1;
	this.retreat_distance = 1;
	this.minimum_distance = 2;
	this.icon_state = "mining_drone_offense";
	to_chat(this, "<span class='info'>You are set to attack mode. You can now attack from range.</span>");
	return f.dot;
});

// minebot.dm:127
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (rt.istype(this.target, T("/obj/item/weapon/ore")) && this.mode == MINEDRONE_COLLECT) {
		this.CollectOre();
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// minebot.dm:134
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/CollectOre", function CollectOre(f: Frame) {
	let O: Value = null, dir: Value = null, _T: Value = null;
	for (O of each(this.loc, T("/obj/item/weapon/ore"))) {
		O.loc = this;
	}
	for (dir of each(GLOB.alldirs)) {
		for (O of each((_T = rt.getStep(f, this, dir)), T("/obj/item/weapon/ore"))) {
			O.loc = this;
		}
	}
	return f.dot;
});

// minebot.dm:143
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/DropOre", function DropOre(f: Frame, message: Value) {
	let O: Value = null;
	message ??= 1;
	if (!rt.len(f, this.contents)) {
		if (message) {
			to_chat(this, "<span class='notice'>You attempt to dump your stored ore, but you have none.</span>");
		}
		return f.dot;
	}
	if (message) {
		to_chat(this, "<span class='notice'>You dump your stored ore.</span>");
	}
	for (O of each(this.contents, T("/obj/item/weapon/ore"))) {
		this.contents -= O;
		O.loc = this.loc;
	}
	return f.dot;
});

// minebot.dm:155
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value) {
	if (this.mode != MINEDRONE_ATTACK && amount > 0) {
		this.SetOffenseBehavior();
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// minebot.dm:160
rt.def("/mob/living/simple_animal/hostile/mining_drone/proc/toggle_mode", function toggle_mode(f: Frame) {
	if (this.mode === MINEDRONE_COLLECT) {
		this.SetOffenseBehavior();
	} else if (this.mode === MINEDRONE_ATTACK) {
		this.SetCollectBehavior();
	} else {
		this.mode = MINEDRONE_COLLECT;
		this.SetCollectBehavior();
	}
	return f.dot;
});

rt.type(146, "/datum/action/innate/minedrone/toggle_light", "/datum/action/innate/minedrone", {
	name: "Toggle Light",
	button_icon_state: "mech_lights_off",
});

// minebot.dm:180
rt.def("/datum/action/innate/minedrone/toggle_light/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	if ((user = this.owner).light_on) {
		user.set_light(0);
	} else {
		user.set_light(6);
	}
	user.light_on = (!user.light_on ? 1 : 0);
	let $0: any = user;
	to_chat($0, `<span class='notice'>You toggle your light ${user.light_on ? "on" : "off"}.</span>`);
	return f.dot;
});

rt.type(147, "/datum/action/innate/minedrone/toggle_mode", "/datum/action/innate/minedrone", {
	name: "Toggle Mode",
	button_icon_state: "mech_cycle_equip_off",
});

// minebot.dm:194
rt.def("/datum/action/innate/minedrone/toggle_mode/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	(user = this.owner).toggle_mode();
	return f.dot;
});

rt.type(148, "/datum/action/innate/minedrone/dump_ore", "/datum/action/innate/minedrone", {
	name: "Dump Ore",
	button_icon_state: "mech_eject",
});

// minebot.dm:202
rt.def("/datum/action/innate/minedrone/dump_ore/proc/Activate", function Activate(f: Frame) {
	let user: Value = null;
	(user = this.owner).DropOre();
	return f.dot;
});

rt.type(9397, "/obj/item/device/mine_bot_ugprade", "/obj/item/device", {
	name: "minebot melee upgrade",
	desc: "A minebot upgrade.",
	icon_state: "door_electronics",
	icon: rt.rsc("icons/obj/module.dmi"),
});

// minebot.dm:217
rt.def("/obj/item/device/mine_bot_ugprade/proc/afterattack", function* afterattack(f: Frame, M: Value, user: Value, proximity: Value) {
	if (!rt.istype(M, T("/mob/living/simple_animal/hostile/mining_drone")) || !proximity) {
		return f.dot;
	}
	yield* this.upgrade_bot(M, user);
	return f.dot;
}, true);

// minebot.dm:222
rt.def("/obj/item/device/mine_bot_ugprade/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	if (M.melee_damage_upper != rt.initial(f, M, "melee_damage_upper")) {
		to_chat(user, `${this} already has a combat upgrade installed!`);
		return f.dot;
	}
	M.melee_damage_lower = 22;
	M.melee_damage_upper = 22;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9398, "/obj/item/device/mine_bot_ugprade/health", "/obj/item/device/mine_bot_ugprade", {
	name: "minebot chassis upgrade",
});

// minebot.dm:235
rt.def("/obj/item/device/mine_bot_ugprade/health/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	if (M.maxHealth != rt.initial(f, M, "maxHealth")) {
		to_chat(user, `${this} already has a reinforced chassis!`);
		return f.dot;
	}
	M.maxHealth = 170;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9399, "/obj/item/device/mine_bot_ugprade/cooldown", "/obj/item/device/mine_bot_ugprade", {
	name: "minebot cooldown upgrade",
});

// minebot.dm:248
rt.def("/obj/item/device/mine_bot_ugprade/cooldown/proc/upgrade_bot", function* upgrade_bot(f: Frame, M: Value, user: Value) {
	this.name = "minebot cooldown upgrade";
	if (M.ranged_cooldown_time != rt.initial(f, M, "ranged_cooldown_time")) {
		to_chat(user, `${this} already has a decreased weapon cooldown!`);
		return f.dot;
	}
	M.ranged_cooldown_time = 10;
	yield* qdel(this);
	return f.dot;
}, true);
