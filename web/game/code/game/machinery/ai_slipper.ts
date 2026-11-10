// Based on /tg/station's code/game/machinery/ai_slipper.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10773, "/obj/machinery/ai_slipper", "/obj/machinery", {
	uses: 20,
	cooldown: 0,
	cooldown_time: 100,
	anchored: 1,
	name: "foam dispenser",
	desc: "A remotely-activatable dispenser for crowd-controlling foam.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "ai-slipper0",
	layer: 2.75,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	req_access: null,
});

// ai_slipper.dm:10
rt.def("/obj/machinery/ai_slipper/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 20, "laser", 20, "energy", 20, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]);

	this.req_access = list(16);
	return f.dot;
});

// ai_slipper.dm:18
rt.def("/obj/machinery/ai_slipper/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>It has <b>${this.uses}</b> uses of foam remaining.</span>`);
	return f.dot;
}, false);

// ai_slipper.dm:22
rt.def("/obj/machinery/ai_slipper/proc/power_change", function power_change(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	} else {
		if (this.powered()) {
			(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		} else {
			(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		}
		if (rt.bitAnd(this.stat, 3) || this.cooldown_time > rt.worldTime(f) || !this.uses) {
			this.icon_state = "ai-slipper0";
		} else {
			this.icon_state = "ai-slipper1";
		}
	}
	return f.dot;
});

// ai_slipper.dm:35
rt.def("/obj/machinery/ai_slipper/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// ai_slipper.dm:38
rt.def("/obj/machinery/ai_slipper/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!(yield* this.allowed(user))) {
		to_chat(user, "<span class='danger'>Access denied.</span>");
		return f.dot;
	}
	if (!this.uses) {
		to_chat(user, `<span class='danger'>${this} is out of foam and cannot be activated.</span>`);
		return f.dot;
	}
	if (this.cooldown_time > rt.worldTime(f)) {
		to_chat(user, fmt("<span class='danger'>＀ cannot be activated for another <b>＀</b> second５.</span>", [this, round((rt.worldTime(f) - this.cooldown_time) * 0.1)]));
		return f.dot;
	}
	yield* new_(T("/obj/effect/particle_effect/foam"), this.loc);
	this.uses--;
	to_chat(user, `<span class='notice'>You activate ${this}. It now has <b>${this.uses}</b> uses of foam remaining.</span>`);
	this.cooldown = rt.worldTime(f) + this.cooldown_time;
	yield* this.power_change();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/ai_slipper/proc/power_change"))), this.cooldown_time);
	return f.dot;
}, true);
