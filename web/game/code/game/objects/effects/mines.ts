// Based on /tg/station's code/game/objects/effects/mines.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11819, "/obj/effect/mine", "/obj/effect", {
	triggered: 0,
	anchored: 1,
	name: "dummy mine",
	desc: "Better stay away from that thing.",
	density: 0,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "uglymine",
});

// mines.dm:11
rt.def("/obj/effect/mine/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	to_chat(victim, "<span class='danger'>*click*</span>");
	return f.dot;
});

// mines.dm:14
rt.def("/obj/effect/mine/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let MM: Value = null;
	if (!isturf(this.loc)) return f.dot;
	if (ismob(AM)) {
		if (!rt.bitAnd((MM = AM).movement_type, 2)) {
			yield* this.triggermine(AM);
		}
	} else {
		yield* this.triggermine(AM);
	}
	return f.dot;
}, true);

// mines.dm:25
rt.def("/obj/effect/mine/proc/triggermine", function* triggermine(f: Frame, victim: Value) {
	let s: Value = null;
	if (this.triggered) {
		return f.dot;
	}
	this.visible_message(`<span class='danger'>${victim} sets off ${bicon(this)} ${this}!</span>`);
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, this);
	yield* s.start();
	yield* this.mineEffect(victim);
	this.triggered = 1;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11820, "/obj/effect/mine/explosive", "/obj/effect/mine", {
	range_devastation: 0,
	range_heavy: 1,
	range_light: 2,
	range_flash: 3,
	name: "explosive mine",
});

// mines.dm:42
rt.def("/obj/effect/mine/explosive/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	explosion(this.loc, this.range_devastation, this.range_heavy, this.range_light, this.range_flash);
	return f.dot;
});

rt.type(11821, "/obj/effect/mine/stun", "/obj/effect/mine", {
	stun_time: 80,
	name: "stun mine",
});

// mines.dm:50
rt.def("/obj/effect/mine/stun/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	if (!rt.istype(victim, T("/mob/living"))) return f.dot;
	yield* victim.Knockdown(this.stun_time);
	return f.dot;
}, true);

rt.type(11822, "/obj/effect/mine/kickmine", "/obj/effect/mine", {
	name: "kick mine",
});

// mines.dm:57
rt.def("/obj/effect/mine/kickmine/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	if (!(rt.istype(victim, T("/mob/living")) && victim.client)) return f.dot;
	to_chat(victim, "<span class='userdanger'>You have been kicked FOR NO REISIN!</span>");
	yield* qdel(victim.client);
	return f.dot;
}, true);

rt.type(11823, "/obj/effect/mine/gas", "/obj/effect/mine", {
	gas_amount: 360,
	gas_type: "o2",
	name: "oxygen mine",
});

// mines.dm:68
rt.def("/obj/effect/mine/gas/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	this.atmos_spawn_air(`${this.gas_type}=${this.gas_amount}`);
	return f.dot;
});

rt.type(11826, "/obj/effect/mine/sound", "/obj/effect/mine", {
	sound: rt.rsc("sound/items/bikehorn.ogg"),
	name: "honkblaster 1000",
});

// mines.dm:86
rt.def("/obj/effect/mine/sound/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	playsound(this.loc, this.sound, 100, 1);
	return f.dot;
});

rt.type(11828, "/obj/effect/mine/pickup", "/obj/effect/mine", {
	duration: 0,
	name: "pickup",
	desc: "pick me up",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "electricity2",
	density: 0,
});

// mines.dm:102
rt.def("/obj/effect/mine/pickup/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", 4, "time", 20, "loop", -1]);
	return f.dot;
}, true);

// mines.dm:110
rt.def("/obj/effect/mine/pickup/proc/triggermine", function* triggermine(f: Frame, victim: Value) {
	if (this.triggered) {
		return f.dot;
	}
	this.triggered = 1;
	this.invisibility = INVISIBILITY_ABSTRACT;
	yield* this.mineEffect(victim);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11829, "/obj/effect/mine/pickup/bloodbath", "/obj/effect/mine/pickup", {
	duration: 1200,
	name: "Red Orb",
	desc: "You feel angry just looking at it.",
	color: "#FF0000",
});

// mines.dm:121
rt.def("/obj/effect/mine/pickup/bloodbath/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	let chainsaw: Value = null;
	if (!victim.client || !rt.istype(victim, T("/mob/living/carbon"))) {
		return f.dot;
	}
	to_chat(victim, "<span class='reallybig redtext'>RIP AND TEAR</span>");
	rt.op(f, "Output", [], [victim, rt.rsc("sound/misc/e1m1.ogg")], false);
	let old_color: Value = victim.client.color;
	let red_splash: Value = list(1, 0, 0, 0.8, 0.2, 0, 0.8, 0, 0.2, 0.1, 0, 0);
	let pure_red: Value = list(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);
	rt.spawnTail(f, 0, "/obj/effect/mine/pickup/bloodbath/proc/mineEffect: spawn at game/objects/effects/mines.dm:129", victim, old_color, red_splash, pure_red, chainsaw);
	(rt.modField(f, (chainsaw = (yield* new_(T("/obj/item/weapon/twohanded/required/chainsaw/doomslayer"), victim.loc))), "flags", NODROP, rt.bitOr));
	yield* victim.drop_all_held_items();
	yield* victim.put_in_hands(chainsaw);
	yield* chainsaw.attack_self(victim);
	yield* chainsaw.wield(victim);
	yield* victim.reagents.add_reagent("adminordrazine", 25);
	victim.client.color = pure_red;
	rt.op(f, "Animate", [2, 8], [null, victim.client, "color", red_splash, "time", 10, "easing", 129]);
	yield* sleep(10);
	rt.op(f, "Animate", [2, 6], [null, victim.client, "color", old_color, "time", this.duration]);
	yield* sleep(this.duration);
	to_chat(victim, "<span class='notice'>Your bloodlust seeps back into the bog of your subconscious and you regain self control.<span>");
	yield* qdel(chainsaw);
	yield* qdel(this);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

// a spawn(0) body of /obj/effect/mine/pickup/bloodbath/proc/mineEffect, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/mine/pickup/bloodbath/proc/mineEffect: spawn at game/objects/effects/mines.dm:129", function* (f: Frame, victim: Value, old_color: Value, red_splash: Value, pure_red: Value, chainsaw: Value) {
	yield* new_(T("/obj/effect/hallucination/delusion"), victim.loc, victim, "demon", this.duration, 0);
	return null;
});

rt.type(11830, "/obj/effect/mine/pickup/healing", "/obj/effect/mine/pickup", {
	name: "Blue Orb",
	desc: "You feel better just looking at it.",
	color: "#0000FF",
});

// mines.dm:155
rt.def("/obj/effect/mine/pickup/healing/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	if (!victim.client || !rt.istype(victim, T("/mob/living/carbon"))) {
		return f.dot;
	}
	to_chat(victim, "<span class='notice'>You feel great!</span>");
	yield* victim.revive({ full_heal: 1, admin_revive: 1 });
	return f.dot;
}, true);

rt.type(11831, "/obj/effect/mine/pickup/speed", "/obj/effect/mine/pickup", {
	duration: 300,
	name: "Yellow Orb",
	desc: "You feel faster just looking at it.",
	color: "#FFFF00",
});

// mines.dm:167
rt.def("/obj/effect/mine/pickup/speed/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	if (!victim.client || !rt.istype(victim, T("/mob/living/carbon"))) {
		return f.dot;
	}
	to_chat(victim, "<span class='notice'>You feel fast!</span>");
	(rt.modField(f, victim, "status_flags", 64, rt.bitOr));
	yield* sleep(this.duration);
	(rt.modField(f, victim, "status_flags", 16777151, rt.bitAnd));
	to_chat(victim, "<span class='notice'>You slow down.</span>");
	return f.dot;
}, true);
