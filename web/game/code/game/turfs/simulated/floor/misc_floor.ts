// Based on /tg/station's code/game/turfs/simulated/floor/misc_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4590, "/turf/open/floor/circuit", "/turf/open/floor", {
	icon_normal: "bcircuit",
	on: 1,
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "bcircuit",
	light_color: "#7DE1E1",
	floor_tile: rt.typePath("/obj/item/stack/tile/circuit"),
});

// misc_floor.dm:22
rt.def("/turf/open/floor/circuit/proc/Initialize", function* Initialize(f: Frame) {
	GLOB.SSmapping.nuke_tiles += this;
	yield* this.update_icon();
	yield* parent_proc();
	return f.dot;
}, true);

// misc_floor.dm:26
rt.def("/turf/open/floor/circuit/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSmapping.nuke_tiles -= this;
	return (yield* parent_proc());
}, true);

// misc_floor.dm:31
rt.def("/turf/open/floor/circuit/proc/update_icon", function update_icon(f: Frame) {
	if (this.on) {
		if (rt.length(GLOB.SSmapping.nuke_threats)) {
			this.icon_state = "rcircuitanim";
			this.light_color = "#FA644B";
		} else {
			this.icon_state = this.icon_normal;
			this.light_color = rt.initial(f, this, "light_color");
		}
		this.set_light(1.4, 0.5);
	} else {
		this.icon_state = `${this.icon_normal}off`;
		this.set_light(0);
	}
	return f.dot;
});

rt.type(4550, "/turf/open/floor/clockwork", "/turf/open/floor", {
	realappearence: null,
	name: "clockwork floor",
	desc: "Tightly-pressed brass tiles. They emit minute vibration.",
	icon_state: "plating",
});

// misc_floor.dm:135
rt.def("/turf/open/floor/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/ratvar/floor"), this);
	yield* new_(T("/obj/effect/temp_visual/ratvar/beam"), this);
	this.realappearence = (yield* new_(T("/obj/effect/clockwork/overlay/floor"), this));
	this.realappearence.linked = this;
	change_construction_value(1);
	return f.dot;
}, true);

// misc_floor.dm:143
rt.def("/turf/open/floor/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	change_construction_value(-1);
	if (this.realappearence) {
		yield* qdel(this.realappearence);
		this.realappearence = null;
	}
	return (yield* parent_proc());
}, true);

// misc_floor.dm:151
rt.def("/turf/open/floor/clockwork/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	let L: Value = null;
	yield* parent_proc();
	for (L of each(this, T("/obj/structure/lattice"))) {
		yield* L.ratvar_act();
	}
	return f.dot;
}, true);

// misc_floor.dm:156
rt.def("/turf/open/floor/clockwork/proc/Entered", function* Entered(f: Frame, AM: Value) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// misc_floor.dm:160
rt.def("/turf/open/floor/clockwork/proc/process", function* process(f: Frame) {
	if (yield* this.healservants()) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// misc_floor.dm:164
rt.def("/turf/open/floor/clockwork/proc/healservants", function* healservants(f: Frame) {
	let L: Value = null, I: Value = null, viewing: Value = null, M: Value = null;
	for (L of each(this, T("/mob/living"))) {
		if (L.stat == 2) {
			continue;
		}
		f.dot = 1;
		if (!is_servant_of_ratvar(L) || !L.toxloss) {
			continue;
		}
		(I = (yield* new_(T("/image"), rt.rsc("icons/effects/effects.dmi"), this, "heal", ABOVE_MOB_LAYER))).appearance_flags = 2;
		I.color = "#5A6068";
		I.pixel_x = rand(-12, 12);
		I.pixel_y = rand(-9, 0);
		viewing = list();
		M = null;
		for (M of each(viewers(this), T("/mob"))) {
			if (M.client && (is_servant_of_ratvar(M) || rt.istype(M, T("/mob/dead/observer")) || M.stat == 2)) {
				viewing += M.client;
			}
		}
		yield* flick_overlay(I, viewing, 8);
		yield* L.adjustToxLoss(-3, 1, 1);
	}
	return f.dot;
}, true);

// misc_floor.dm:184
rt.def("/turf/open/floor/clockwork/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		user.visible_message(`<span class='notice'>${user} begins slowly prying up ${this}...</span>`, `<span class='notice'>You begin painstakingly prying up ${this}...</span>`);
		playsound(this, I.usesound, 20, 1);
		if (!(yield* do_after(user, 70 * I.toolspeed, { target: this }))) {
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} pries up ${this}!</span>`, `<span class='notice'>You pry up ${this}!</span>`);
		playsound(this, I.usesound, 80, 1);
		yield* this.make_plating();
		return 1;
	}
	return (yield* parent_proc());
}, true);

// misc_floor.dm:196
rt.def("/turf/open/floor/clockwork/proc/make_plating", function* make_plating(f: Frame) {
	yield* new_(T("/obj/item/stack/tile/brass"), this);
	return (yield* parent_proc());
}, true);

// misc_floor.dm:200
rt.def("/turf/open/floor/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* parent_proc();
	if (!rt.istype(this, T("/turf/open/floor/clockwork"))) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

rt.type(4611, "/turf/open/floor/vines", "/turf/open/floor", {
	broken_states: null,
	color: "#aa77aa",
	icon_state: "vinefloor",
});

// misc_floor.dm:228
rt.def("/turf/open/floor/vines/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list();
	return f.dot;
});

// misc_floor.dm:249
rt.def("/turf/open/floor/vines/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* parent_proc();
	if (!(severity < 3 || target == this)) return f.dot;
	yield* this.ChangeTurf(this.baseturf);
	return f.dot;
}, true, { waitfor: false });

// misc_floor.dm:254
rt.def("/turf/open/floor/vines/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	probability ??= 20;
	if (!(prob(probability) || force)) return f.dot;
	yield* this.ChangeTurf(this.baseturf);
	yield* this.narsie_act(force, ignore_mobs, probability);
	return f.dot;
}, true);

// misc_floor.dm:259
rt.def("/turf/open/floor/vines/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	if (!prob(50)) return f.dot;
	yield* this.ChangeTurf(this.baseturf);
	return f.dot;
}, true);

// misc_floor.dm:264
rt.def("/turf/open/floor/vines/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	let SV: Value = null;
	f.dot = (yield* parent_proc());
	for (SV of each(this, T("/obj/structure/spacevine"))) {
		if (!(!SV || SV.gc_destroyed == -3)) {
			yield* qdel(SV);
		}
	}
	return f.dot;
}, true, { args: ["T"] });
