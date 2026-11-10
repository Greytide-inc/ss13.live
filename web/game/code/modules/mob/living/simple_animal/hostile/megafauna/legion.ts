// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5028, "/mob/living/simple_animal/hostile/megafauna/legion", "/mob/living/simple_animal/hostile/megafauna", {
	size: 5,
	charging: 0,
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	ranged_cooldown_time: 20,
	vision_range: 13,
	idle_vision_range: 13,
	name: "Legion",
	health: 800,
	maxHealth: 800,
	icon_state: "legion",
	icon_living: "legion",
	desc: "One of many.",
	icon: rt.rsc("icons/mob/lavaland/legion.dmi"),
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	speak_emote: null,
	armour_penetration: 50,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	speed: 2,
	del_on_death: 1,
	medal_type: "Legion",
	score_type: "Legion Killed",
	pixel_y: -90,
	pixel_x: -75,
	loot: null,
	wander: 0,
	elimination: 1,
	appearance_flags: 0,
	mouse_opacity: 1,
});

// legion.dm:30
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("echoes");

	this.loot = rt.alist(f, [T("/obj/item/stack/sheet/bone"), 3]);
	return f.dot;
});

// legion.dm:55
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/legion"), this));
	return f.dot;
}, true);

// legion.dm:59
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	f.dot = (yield* parent_proc());
	if (!this.target) return f.dot;
	this.wander = 1;
	return f.dot;
}, true);

// legion.dm:65
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (GLOB.necropolis_gate) {
		yield* GLOB.necropolis_gate.toggle_the_gate(null, 1);
	}
	return (yield* parent_proc());
}, true, { args: ["amount", "updating_health", "forced"] });

// legion.dm:69
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, A: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living/carbon/human")))) return f.dot;
	if ((L = this.target).stat != 1) return f.dot;
	yield* (A = (yield* new_(T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion"), this.loc))).infest(L);
	return f.dot;
}, true);

// legion.dm:77
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let A: Value = null;
	if (!(rt.worldTime(f) >= this.ranged_cooldown && !this.charging)) return f.dot;
	if (prob(75)) {
		yield* (A = (yield* new_(T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion"), this.loc))).GiveTarget(this.target);
		A.friends = this.friends;
		A.faction = this.faction;
		this.ranged_cooldown = rt.worldTime(f) + this.ranged_cooldown_time;
	} else {
		this.visible_message(`<span class='warning'><b>${this} charges!</b></span>`);
		yield* this.SpinAnimation({ speed: 20, loops: 5 });
		this.ranged = 0;
		this.retreat_distance = 0;
		this.minimum_distance = 0;
		this.speed = 0;
		this.charging = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/hostile/megafauna/legion/proc/reset_charge"))), 50);
	}
	return f.dot;
}, true);

// legion.dm:102
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/death", function* death(f: Frame) {
	let L: Value = null, last_legion: Value = null, other: Value = null;
	if (this.health > 0) {
		return f.dot;
	}
	if (rt.sv(f, "size") > 1) {
		yield* this.adjustHealth(-this.maxHealth);
		(L = (yield* new_(T("/mob/living/simple_animal/hostile/megafauna/legion"), this.loc))).maxHealth = this.maxHealth * 0.6;
		this.maxHealth = L.maxHealth;
		L.health = L.maxHealth;
		this.health = this.maxHealth;
		this.size--;
		rt.setFv(f, "size", L, rt.sv(f, "size"));
		L.resize = rt.fv(f, "size", L) * 0.2;
		this.transform = rt.initial(f, this, "transform");
		this.resize = rt.sv(f, "size") * 0.2;
		yield* L.update_transform();
		yield* this.update_transform();
		L.faction = (yield* this.faction.Copy());
		yield* L.GiveTarget(this.target);
		this.visible_message(`<span class='boldannounce'>${this} splits in twain!</span>`);
	} else {
		last_legion = 1;
		for (other of each(GLOB.mob_list, T("/mob/living/simple_animal/hostile/megafauna/legion"))) {
			if (other != this) {
				last_legion = 0;
				break;
			}
		}
		if (last_legion) {
			this.loot = list(T("/obj/item/weapon/staff/storm"));
			this.elimination = 0;
		} else if (prob(5)) {
			this.loot = list(T("/obj/structure/closet/crate/necropolis/tendril"));
		}
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(7395, "/obj/item/weapon/staff/storm", "/obj/item/weapon/staff", {
	storm_type: rt.typePath("/datum/weather/ash_storm"),
	storm_cooldown: 0,
	name: "staff of storms",
	desc: "An ancient staff retrieved from the remains of Legion. The wind stirs as you move it.",
	icon_state: "staffofstorms",
	item_state: "staffofstorms",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	slot_flags: 1024,
	w_class: 4,
	force: 25,
	damtype: "fire",
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
});

// legion.dm:169
rt.def("/obj/item/weapon/staff/storm/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null, V: Value = null, W: Value = null;
	if (this.storm_cooldown > rt.worldTime(f)) {
		to_chat(user, "<span class='warning'>The staff is still recharging!</span>");
		return f.dot;
	}
	let user_area: Value = get_area(user);
	for (V of each(GLOB.SSweather.existing_weather)) {
		if ((W = V).target_z == user.z && W.area_type == user_area.type) {
			A = W;
			break;
		}
	}
	if (A) {
		if (A.stage != END_STAGE) {
			if (A.stage == WIND_DOWN_STAGE) {
				to_chat(user, "<span class='warning'>The storm is already ending! It would be a waste to use the staff now.</span>");
				return f.dot;
			}
			user.visible_message(`<span class='warning'>${user} holds ${this} skywards as an orange beam travels into the sky!</span>`, `<span class='notice'>You hold ${this} skyward, dispelling the storm!</span>`);
			playsound(user, rt.rsc("sound/magic/staff_change.ogg"), 200, 0);
			yield* A.wind_down();
			return f.dot;
		}
	} else {
		(A = (yield* new_(this.storm_type))).name = "staff storm";
		A.area_type = user_area.type;
		A.target_z = user.z;
		A.telegraph_duration = 100;
		A.end_duration = 100;
	}
	user.visible_message(`<span class='warning'>${user} holds ${this} skywards as red lightning crackles into the sky!</span>`, `<span class='notice'>You hold ${this} skyward, calling down a terrible storm!</span>`);
	playsound(user, rt.rsc("sound/magic/staff_change.ogg"), 200, 0);
	yield* A.telegraph();
	this.storm_cooldown = rt.worldTime(f) + 200;
	return f.dot;
}, true);
