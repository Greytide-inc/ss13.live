// Based on /tg/station's code/modules/mining/equipment/resonator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7542, "/obj/item/weapon/resonator", "/obj/item/weapon", {
	burst_time: 30,
	fieldlimit: 4,
	fields: null,
	quick_burst_mod: 0.8,
	name: "resonator",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "resonator",
	item_state: "resonator",
	desc: "A handheld device that creates small fields of energy that resonate until they detonate, crushing rock. It's more effective in a vacuum.",
	w_class: 3,
	force: 15,
	throwforce: 10,
	origin_tech: "magnets=3;engineering=3",
});

// resonator.dm:13
rt.def("/obj/item/weapon/resonator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.fields = list();
	return f.dot;
});

// resonator.dm:27
rt.def("/obj/item/weapon/resonator/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.burst_time == 50) {
		this.burst_time = 30;
		to_chat(user, "<span class='info'>You set the resonator's fields to detonate after 3 seconds.</span>");
	} else {
		this.burst_time = 50;
		to_chat(user, "<span class='info'>You set the resonator's fields to detonate after 5 seconds.</span>");
	}
	return f.dot;
});

// resonator.dm:35
rt.def("/obj/item/weapon/resonator/proc/CreateResonance", function* CreateResonance(f: Frame, target: Value, user: Value) {
	let R: Value = null;
	let _T: Value = rt.getStep(f, target, 0);
	if (R = rt.locateIn(f, T("/obj/effect/temp_visual/resonance"), _T)) {
		R.damage_multiplier = this.quick_burst_mod;
		yield* R.burst();
		return f.dot;
	}
	if (!(rt.length(this.fields) < this.fieldlimit)) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/resonance"), _T, user, this, this.burst_time);
	user.changeNext_move(8);
	return f.dot;
}, true);

// resonator.dm:46
rt.def("/obj/item/weapon/resonator/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	if (this.check_allowed_items(target, 1)) {
		yield* this.CreateResonance(target, user);
	}
	return 1;
}, true);

rt.type(11672, "/obj/effect/temp_visual/resonance", "/obj/effect/temp_visual", {
	resonance_damage: 20,
	damage_multiplier: 1,
	creator: null,
	res: null,
	duration: 50,
	name: "resonance field",
	desc: "A resonating field that significantly damages anything inside of it when the field eventually ruptures. More damaging in low pressure environments.",
	icon_state: "shield1",
	layer: 4.5,
});

// resonator.dm:63
rt.def("/obj/effect/temp_visual/resonance/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_creator: Value, set_resonator: Value, set_duration: Value) {
	this.duration = set_duration;
	f.dot = (yield* parent_proc());
	this.creator = set_creator;
	this.res = set_resonator;
	if (this.res) {
		this.res.fields += this;
	}
	playsound(this, rt.rsc("sound/weapons/resonator_fire.ogg"), 50, 1);
	this.transform = matrix() * 0.75;
	rt.op(f, "Animate", [2, 6], [null, this, "transform", matrix() * 1.5, "time", this.duration]);
	yield* deltimer(this.timerid);
	this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/temp_visual/resonance/proc/burst"))), this.duration, 8));
	return f.dot;
}, true);

// resonator.dm:77
rt.def("/obj/effect/temp_visual/resonance/proc/Destroy", function* Destroy(f: Frame) {
	if (this.res) {
		this.res.fields -= this;
		this.res = null;
	}
	this.creator = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// resonator.dm:83
rt.def("/obj/effect/temp_visual/resonance/proc/check_pressure", function check_pressure(f: Frame, proj_turf: Value) {
	if (!proj_turf) {
		proj_turf = rt.getStep(f, this, 0);
	}
	if (!rt.istype(proj_turf, T("/turf"))) {
		return f.dot;
	}
	let environment: Value = proj_turf.return_air();
	let pressure: Value = environment.return_pressure();
	this.resonance_damage = rt.initial(f, this, "resonance_damage");
	if (pressure < 50) {
		this.name = `strong ${rt.initial(f, this, "name")}`;
		this.resonance_damage *= 3;
	} else {
		this.name = rt.initial(f, this, "name");
	}
	this.resonance_damage *= this.damage_multiplier;
	return f.dot;
});

// resonator.dm:98
rt.def("/obj/effect/temp_visual/resonance/proc/burst", function* burst(f: Frame) {
	let _T: Value = null, M: Value = null, L: Value = null;
	yield* new_(T("/obj/effect/temp_visual/resonance_crush"), (_T = rt.getStep(f, this, 0)));
	if (rt.istype(_T, T("/turf/closed/mineral"))) {
		yield* (M = _T).gets_drilled(this.creator);
	}
	this.check_pressure(_T);
	playsound(_T, rt.rsc("sound/weapons/resonator_blast.ogg"), 50, 1);
	for (L of each(_T, T("/mob/living"))) {
		if (this.creator) {
			add_logs(this.creator, L, "used a resonator field on", "resonator");
		}
		to_chat(L, `<span class='userdanger'>${this} ruptured with you in it!</span>`);
		yield* L.apply_damage(this.resonance_damage, "brute");
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11673, "/obj/effect/temp_visual/resonance_crush", "/obj/effect/temp_visual", {
	duration: 4,
	icon_state: "shield1",
	layer: 4.5,
});

// resonator.dm:118
rt.def("/obj/effect/temp_visual/resonance_crush/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.transform = matrix() * 1.5;
	rt.op(f, "Animate", [2, 8], [null, this, "transform", matrix() * 0.1, "alpha", 50, "time", 4]);
	return f.dot;
}, true);
