// Based on /tg/station's code/game/objects/effects/temporary_visuals/clockcult.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11553, "/obj/effect/temp_visual/ratvar/mending_mantra", "/obj/effect/temp_visual/ratvar", {
	light_range: 1.5,
	light_color: "#1E8CE1",
	layer: 4.1,
	duration: 20,
	alpha: 200,
	icon_state: "mending_mantra",
});

// clockcult.dm:74
rt.def("/obj/effect/temp_visual/ratvar/mending_mantra/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	this.transform = matrix() * 2;
	(M = this.transform).Turn(90);
	rt.op(f, "Animate", [2, 10], [null, this, "alpha", 20, "time", this.duration, "easing", 4, "flags", 4]);
	rt.op(f, "Animate", [2, 8], [null, this, "transform", M, "time", this.duration, "flags", 4]);
	return f.dot;
}, true);

rt.type(11554, "/obj/effect/temp_visual/ratvar/volt_hit", "/obj/effect/temp_visual/ratvar", {
	user: null,
	damage: 25,
	light_range: 1.5,
	light_power: 2,
	light_color: "#FA9632",
	name: "volt blast",
	layer: 4.1,
	duration: 8,
	icon_state: "volt_hit",
});

// clockcult.dm:93
rt.def("/obj/effect/temp_visual/ratvar/volt_hit/proc/Initialize", function* Initialize(f: Frame, mapload: Value, caster: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	this.user = caster;
	if (this.user) {
		(M = (yield* new_(T("/matrix")))).Turn(Get_Angle(this, this.user));
		this.transform = M;
	}
	yield* ImmediateInvokeAsync(this, P("/obj/effect/temp_visual/ratvar/volt_hit/proc/volthit"));
	return f.dot;
}, true);

// clockcult.dm:103
rt.def("/obj/effect/temp_visual/ratvar/volt_hit/proc/volthit", function* volthit(f: Frame) {
	let L: Value = null, I: Value = null, M: Value = null;
	if (this.user) {
		yield* this.Beam(rt.getStep(f, this.user, 0), "volt_ray", { time: this.duration, maxdistance: 8, beam_type: T("/obj/effect/ebeam/volt_ray") });
	}
	let hit_amount: Value = 0;
	let _T: Value = rt.getStep(f, this, 0);
	for (L of each(_T, T("/mob/living"))) {
		if (is_servant_of_ratvar(L)) {
			continue;
		}
		if (I = L.null_rod_check()) {
			L.visible_message(`<span class='warning'>Strange energy flows into ${L}'s ${I.name}!</span>`, `<span class='userdanger'>Your ${I.name} shields you from ${this}!</span>`);
			continue;
		}
		L.visible_message(`<span class='warning'>${L} is struck by a ${this.name}!</span>`, `<span class='userdanger'>You're struck by a ${this.name}!</span>`);
		yield* L.apply_damage(this.damage, "fire", "chest", L.run_armor_check("chest", "laser", `Your armor absorbs ${this}!`, `Your armor blocks part of ${this}!`, 0, `Your armor was penetrated by ${this}!`));
		add_logs(this.user, L, "struck with a volt blast");
		hit_amount++;
	}
	for (M of each(_T, T("/obj/mecha"))) {
		if (M.occupant) {
			if (is_servant_of_ratvar(M.occupant)) {
				continue;
			}
			to_chat(M.occupant, `<span class='userdanger'>Your ${M.name} is struck by a ${this.name}!</span>`);
		}
		M.visible_message(`<span class='warning'>${M} is struck by a ${this.name}!</span>`);
		yield* M.take_damage(this.damage, "fire", 0, 0);
		hit_amount++;
	}
	if (hit_amount) {
		playsound(this, rt.rsc("sound/machines/defib_zap.ogg"), this.damage * hit_amount, 1, -1);
	} else {
		playsound(this, "sparks", 50, 1);
	}
	return f.dot;
}, true);

rt.type(11555, "/obj/effect/temp_visual/ratvar/ocular_warden", "/obj/effect/temp_visual/ratvar", {
	name: "warden's gaze",
	layer: 4.1,
	icon_state: "warden_gaze",
	duration: 3,
});

// clockcult.dm:138
rt.def("/obj/effect/temp_visual/ratvar/ocular_warden/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-8, 8);
	this.pixel_y = rand(-10, 10);
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 0, "time", 3, "easing", 128]);
	return f.dot;
}, true);

rt.type(11556, "/obj/effect/temp_visual/ratvar/prolonging_prism", "/obj/effect/temp_visual/ratvar", {
	icon: rt.rsc("icons/effects/64x64.dmi"),
	icon_state: "prismhex1",
	layer: 5.1,
	pixel_y: -16,
	pixel_x: -16,
	duration: 30,
});

// clockcult.dm:152
rt.def("/obj/effect/temp_visual/ratvar/prolonging_prism/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_appearance: Value) {
	f.dot = (yield* parent_proc());
	if (set_appearance) {
		this.appearance = set_appearance;
	}
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 0, "time", this.duration, "easing", 4]);
	return f.dot;
}, true);

rt.type(11560, "/obj/effect/temp_visual/ratvar/component", "/obj/effect/temp_visual/ratvar", {
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "belligerent_eye",
	layer: 4.1,
	duration: 10,
});

// clockcult.dm:177
rt.def("/obj/effect/temp_visual/ratvar/component/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.transform = matrix() * 0.75;
	this.pixel_x = rand(-10, 10);
	this.pixel_y = rand(-10, -2);
	rt.op(f, "Animate", [2, 10], [null, this, "pixel_y", this.pixel_y + 10, "alpha", 50, "time", 10, "easing", 128]);
	return f.dot;
}, true);

rt.type(11566, "/obj/effect/temp_visual/ratvar/sigil/transgression", "/obj/effect/temp_visual/ratvar/sigil", {
	light_range: 5,
	light_power: 2,
	light_color: "#FAE48C",
	color: "#FAE48C",
	layer: 4.1,
	duration: 70,
});

// clockcult.dm:208
rt.def("/obj/effect/temp_visual/ratvar/sigil/transgression/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let oldtransform: Value = this.transform;
	rt.op(f, "Animate", [2, 6], [null, this, "transform", matrix() * 2, "time", 5]);
	rt.op(f, "Animate", [2, 6], ["transform", oldtransform, "alpha", 0, "time", 65]);
	return f.dot;
}, true);
