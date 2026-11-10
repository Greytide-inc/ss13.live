// Based on /tg/station's code/game/objects/structures/lattice.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12234, "/obj/structure/lattice", "/obj/structure", {
	number_of_rods: 1,
	anchored: 1,
	canSmoothWith: null,
	smooth: 2,
	name: "lattice",
	desc: "A lightweight support lattice. These hold our station together.",
	icon: rt.rsc("icons/obj/smooth_structures/lattice.dmi"),
	icon_state: "lattice",
	density: 0,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
	layer: 2.2,
});

// lattice.dm:13
rt.def("/obj/structure/lattice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/lattice"), T("/turf/open/floor"), T("/turf/closed/wall"), T("/obj/structure/falsewall"));
	this.armor = rt.alist(f, ["melee", 50, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 50]);
	return f.dot;
});

// lattice.dm:21
rt.def("/obj/structure/lattice/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let LAT: Value = null;
	f.dot = (yield* parent_proc());
	for (LAT of each(this.loc, T("/obj/structure/lattice"))) {
		if (LAT != this) {
			yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), LAT)), 0, 8);
		}
	}
	return f.dot;
}, true);

// lattice.dm:30
rt.def("/obj/structure/lattice/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (IsEven(this.x + this.y)) {
		yield* new_(T("/obj/structure/lattice/clockwork"), this.loc);
	} else {
		yield* new_(T("/obj/structure/lattice/clockwork/large"), this.loc);
	}
	return f.dot;
}, true);

// lattice.dm:36
rt.def("/obj/structure/lattice/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let _T: Value = null;
	if (rt.istype(C, T("/obj/item/weapon/wirecutters"))) {
		to_chat(user, `<span class='notice'>Slicing ${this.name} joints ...</span>`);
		yield* this.deconstruct();
	} else {
		return (yield* (_T = rt.getStep(f, this, 0)).attackby(C, user));
	}
	return f.dot;
}, true);

// lattice.dm:44
rt.def("/obj/structure/lattice/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/rods"), rt.getStep(f, this, 0), this.number_of_rods);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// lattice.dm:49
rt.def("/obj/structure/lattice/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FOUR)) return f.dot;
	yield* this.deconstruct();
	return f.dot;
}, true);

rt.type(12235, "/obj/structure/lattice/clockwork", "/obj/structure/lattice", {
	name: "cog lattice",
	desc: "A lightweight support lattice. These hold the Justicar's station together.",
	icon: rt.rsc("icons/obj/smooth_structures/lattice_clockwork.dmi"),
});

// lattice.dm:58
rt.def("/obj/structure/lattice/clockwork/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* this.ratvar_act();
	return f.dot;
}, true);

// lattice.dm:62
rt.def("/obj/structure/lattice/clockwork/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!IsOdd(this.x + this.y)) return f.dot;
	yield* new_(T("/obj/structure/lattice/clockwork/large"), this.loc);
	return f.dot;
}, true);

rt.type(12236, "/obj/structure/lattice/clockwork/large", "/obj/structure/lattice/clockwork", {});

// lattice.dm:66
rt.def("/obj/structure/lattice/clockwork/large/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	this.icon = rt.rsc("icons/obj/smooth_structures/lattice_clockwork_large.dmi");
	this.pixel_x = -9;
	this.pixel_y = -9;
	return f.dot;
}, true);

// lattice.dm:72
rt.def("/obj/structure/lattice/clockwork/large/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (!IsEven(this.x + this.y)) return f.dot;
	yield* new_(T("/obj/structure/lattice/clockwork"), this.loc);
	return f.dot;
}, true);

rt.type(12237, "/obj/structure/lattice/catwalk", "/obj/structure/lattice", {
	smooth: 1,
	canSmoothWith: null,
	name: "catwalk",
	desc: "A catwalk for easier EVA maneuvering and cable placement.",
	icon: rt.rsc("icons/obj/smooth_structures/catwalk.dmi"),
	icon_state: "catwalk",
	number_of_rods: 2,
});

// lattice.dm:82
rt.def("/obj/structure/lattice/catwalk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});

// lattice.dm:85
rt.def("/obj/structure/lattice/catwalk/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/structure/lattice/catwalk/clockwork"), this.loc);
	return f.dot;
}, true);

// lattice.dm:88
rt.def("/obj/structure/lattice/catwalk/proc/Move", function* Move(f: Frame) {
	let C: Value = null;
	let _T: Value = this.loc;
	for (C of each(_T, T("/obj/structure/cable"))) {
		yield* C.deconstruct();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// lattice.dm:94
rt.def("/obj/structure/lattice/catwalk/proc/deconstruct", function* deconstruct(f: Frame) {
	let C: Value = null;
	let _T: Value = this.loc;
	for (C of each(_T, T("/obj/structure/cable"))) {
		yield* C.deconstruct();
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12238, "/obj/structure/lattice/catwalk/clockwork", "/obj/structure/lattice/catwalk", {
	name: "clockwork catwalk",
	icon: rt.rsc("icons/obj/smooth_structures/catwalk_clockwork.dmi"),
});

// lattice.dm:104
rt.def("/obj/structure/lattice/catwalk/clockwork/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/ratvar/floor/catwalk"), this.loc);
	yield* new_(T("/obj/effect/temp_visual/ratvar/beam/catwalk"), this.loc);
	return f.dot;
}, true);
