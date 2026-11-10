// Based on /tg/station's code/game/objects/structures/traps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12881, "/obj/structure/trap", "/obj/structure", {
	last_trigger: 0,
	time_between_triggers: 600,
	charges: 1e+31,
	immune_minds: null,
	spark_system: null,
	anchored: 1,
	name: "IT'S A TRAP",
	desc: "stepping on me is a guaranteed bad day",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "trap",
	density: 0,
	alpha: 30,
}, { global: { ignore_typecache: 804 } });

// traps.dm:14
rt.def("/obj/structure/trap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.immune_minds = list();
	return f.dot;
});

// traps.dm:19
rt.def("/obj/structure/trap/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	parent_proc();
	this.spark_system = new_(T("/datum/effect_system/spark_spread"));
	this.spark_system.set_up(4, 1, this);
	this.spark_system.attach(this);
	if (GLOB.ignore_typecache) return f.dot;
	GLOB.ignore_typecache = typecacheof(list(T("/obj/effect"), T("/mob/dead")));
	return f.dot;
}, false);

// traps.dm:30
rt.def("/obj/structure/trap/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spark_system);
	this.spark_system = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// traps.dm:35
rt.def("/obj/structure/trap/proc/examine", function* examine(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (rt.isIn(f, (user.mind && user.mind), this.immune_minds)) {
		return f.dot;
	}
	if (!(get_dist(user, this) <= 1)) return f.dot;
	to_chat(user, `<span class='notice'>You reveal ${this}!</span>`);
	yield* this.flare();
	return f.dot;
}, true);


rt.def("/obj/structure/trap/proc/examine", function examine(f: Frame, user: Value) {
	return f.dot;
});

// traps.dm:47
rt.def("/obj/structure/trap/proc/flare", function* flare(f: Frame) {
	this.visible_message(`<span class='warning'>${this} flares brightly!</span>`);
	yield* this.spark_system.start();
	this.alpha = 200;
	this.last_trigger = rt.worldTime(f);
	this.charges--;
	if (this.charges <= 0) {
		rt.op(f, "Animate", [2, 6], [null, this, "alpha", 0, "time", 10]);
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	} else {
		rt.op(f, "Animate", [2, 6], [null, this, "alpha", rt.initial(f, this, "alpha"), "time", this.time_between_triggers]);
	}
	return f.dot;
}, true);

// traps.dm:59
rt.def("/obj/structure/trap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	if (this.last_trigger + this.time_between_triggers > rt.worldTime(f)) {
		return f.dot;
	}
	if (is_type_in_typecache(AM, GLOB.ignore_typecache)) {
		return f.dot;
	}
	if (ismob(AM)) {
		if (rt.isIn(f, (M = AM).mind, this.immune_minds)) {
			return f.dot;
		}
	}
	if (this.charges <= 0) {
		return f.dot;
	}
	yield* this.flare();
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	yield* this.trap_effect(AM);
	return f.dot;
}, true);

rt.type(12882, "/obj/structure/trap/stun", "/obj/structure/trap", {
	name: "shock trap",
	desc: "A trap that will shock and render you immobile. You'd better avoid it.",
	icon_state: "trap-shock",
});

// traps.dm:83
rt.def("/obj/structure/trap/stun/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	yield* L.electrocute_act(30, this, { safety: 1 });
	yield* L.Knockdown(100);
	return f.dot;
}, true);

rt.type(12883, "/obj/structure/trap/fire", "/obj/structure/trap", {
	name: "flame trap",
	desc: "A trap that will set you ablaze. You'd better avoid it.",
	icon_state: "trap-fire",
});

// traps.dm:92
rt.def("/obj/structure/trap/fire/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	to_chat(L, "<span class='danger'><B>Spontaneous combustion!</B></span>");
	yield* L.Knockdown(20);
	return f.dot;
}, true);

// traps.dm:96
rt.def("/obj/structure/trap/fire/proc/flare", function* flare(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/hotspot"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

rt.type(12884, "/obj/structure/trap/chill", "/obj/structure/trap", {
	name: "frost trap",
	desc: "A trap that will chill you to the bone. You'd better avoid it.",
	icon_state: "trap-frost",
});

// traps.dm:106
rt.def("/obj/structure/trap/chill/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	to_chat(L, "<span class='danger'><B>You're frozen solid!</B></span>");
	yield* L.Knockdown(20);
	L.bodytemperature -= 300;
	yield* L.apply_status_effect(T("/datum/status_effect/freon"));
	return f.dot;
}, true);

rt.type(12885, "/obj/structure/trap/damage", "/obj/structure/trap", {
	name: "earth trap",
	desc: "A trap that will summon a small earthquake, just for you. You'd better avoid it.",
	icon_state: "trap-earth",
});

// traps.dm:119
rt.def("/obj/structure/trap/damage/proc/trap_effect", function* trap_effect(f: Frame, L: Value) {
	to_chat(L, "<span class='danger'><B>The ground quakes beneath your feet!</B></span>");
	yield* L.Knockdown(100);
	yield* L.adjustBruteLoss(35);
	return f.dot;
}, true);

// traps.dm:124
rt.def("/obj/structure/trap/damage/proc/flare", function* flare(f: Frame) {
	yield* parent_proc();
	let giant_rock: Value = (yield* new_(T("/obj/structure/flora/rock"), rt.getStep(f, this, 0)));
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), giant_rock)), 200, 8);
	return f.dot;
}, true);

rt.type(12886, "/obj/structure/trap/ward", "/obj/structure/trap", {
	time_between_triggers: 1200,
	name: "divine ward",
	desc: "A divine barrier, It looks like you could destroy it with enough effort, or wait for it to dissipate...",
	icon_state: "ward",
	density: 1,
});

// traps.dm:138
rt.def("/obj/structure/trap/ward/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), this.time_between_triggers, 8);
	return f.dot;
}, true);
