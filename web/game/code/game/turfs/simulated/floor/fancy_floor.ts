// Based on /tg/station's code/game/turfs/simulated/floor/fancy_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4553, "/turf/open/floor/wood", "/turf/open/floor", {
	broken_states: null,
	icon_state: "wood",
	floor_tile: rt.typePath("/obj/item/stack/tile/wood"),
});

// fancy_floor.dm:16
rt.def("/turf/open/floor/wood/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(C, T("/obj/item/weapon/screwdriver"))) return f.dot;
	yield* this.pry_tile(C, user);
	return f.dot;
}, true);

// fancy_floor.dm:23
rt.def("/turf/open/floor/wood/proc/try_replace_tile", function* try_replace_tile(f: Frame, _T: Value, user: Value, params: Value) {
	let tool: Value = null, _P: Value = null;
	if (_T.turf_type == this.type) {
		return f.dot;
	}
	if (!(tool = user.is_holding_item_of_type(T("/obj/item/weapon/screwdriver")))) {
		tool = user.is_holding_item_of_type(T("/obj/item/weapon/crowbar"));
	}
	if (!tool) {
		return f.dot;
	}
	if (!rt.istype((_P = (yield* this.pry_tile(tool, user, 1))), T("/turf/open/floor/plating"))) {
		return f.dot;
	}
	yield* _P.attackby(_T, user, params);
	return f.dot;
}, true);

// fancy_floor.dm:36
rt.def("/turf/open/floor/wood/proc/pry_tile", function* pry_tile(f: Frame, C: Value, user: Value, silent: Value) {
	silent ??= 0;
	let is_screwdriver: Value = (rt.istype(C, T("/obj/item/weapon/screwdriver")) ? 1 : 0);
	playsound(this, C.usesound, 80, 1);
	return (yield* this.remove_tile(user, silent, { make_tile: is_screwdriver }));
}, true);

// fancy_floor.dm:41
rt.def("/turf/open/floor/wood/proc/remove_tile", function* remove_tile(f: Frame, user: Value, silent: Value, make_tile: Value) {
	silent ??= 0;
	make_tile ??= 1;
	if (this.broken || this.burnt) {
		this.broken = 0;
		this.burnt = 0;
		if (user && !silent) {
			to_chat(user, "<span class='danger'>You remove the broken planks.</span>");
		}
	} else if (make_tile) {
		if (user && !silent) {
			to_chat(user, "<span class='danger'>You unscrew the planks.</span>");
		}
		if (this.floor_tile) {
			yield* new_(this.floor_tile, this);
		}
	} else if (user && !silent) {
		to_chat(user, "<span class='danger'>You forcefully pry off the planks, destroying them in the process.</span>");
	}
	return (yield* this.make_plating());
}, true);

rt.type(4556, "/turf/open/floor/grass", "/turf/open/floor", {
	turfverb: "uproot",
	ore_type: rt.typePath("/obj/item/weapon/ore/glass"),
	broken_states: null,
	name: "grass patch",
	desc: "You can't tell if this is real grass or just cheap plastic imitation.",
	icon_state: "grass",
	floor_tile: rt.typePath("/obj/item/stack/tile/grass"),
	flags: 0,
});

// fancy_floor.dm:68
rt.def("/turf/open/floor/grass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("sand");
	return f.dot;
});

// fancy_floor.dm:74
rt.def("/turf/open/floor/grass/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// fancy_floor.dm:78
rt.def("/turf/open/floor/grass/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (rt.istype(C, T("/obj/item/weapon/shovel")) && params) {
		yield* new_(this.ore_type, this);
		yield* new_(this.ore_type, this);
		user.visible_message(`<span class='notice'>${user} digs up ${this}.</span>`, `<span class='notice'>You ${this.turfverb} ${this}.</span>`);
		playsound(this, rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1);
		yield* this.make_plating();
	}
	if (!(yield* parent_proc())) return f.dot;
	return f.dot;
}, true);

rt.type(4557, "/turf/open/floor/grass/snow", "/turf/open/floor/grass", {
	floor_tile: null,
	name: "snow",
	icon: rt.rsc("icons/turf/snow.dmi"),
	desc: "Looks cold.",
	icon_state: "snow",
	ore_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	planetary_atmos: 1,
	initial_gas_mix: "o2=22;n2=82;TEMP=180",
	slowdown: 2,
});

// fancy_floor.dm:99
rt.def("/turf/open/floor/grass/snow/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(4558, "/turf/open/floor/grass/snow/basalt", "/turf/open/floor/grass/snow", {
	name: "volcanic floor",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "basalt",
	ore_type: rt.typePath("/obj/item/weapon/ore/glass/basalt"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	slowdown: 0,
});

// fancy_floor.dm:112
rt.def("/turf/open/floor/grass/snow/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!prob(15)) return f.dot;
	this.icon_state = `basalt${rand(0, 12)}`;
	set_basalt_light(this);
	return f.dot;
}, true);

rt.type(4559, "/turf/open/floor/grass/fakebasalt", "/turf/open/floor/grass", {
	turfverb: "dig up",
	name: "aesthetic volcanic flooring",
	desc: "Safely recreated turf for your hellplanet-scaping",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "basalt",
	floor_tile: rt.typePath("/obj/item/stack/tile/basalt"),
	ore_type: rt.typePath("/obj/item/weapon/ore/glass/basalt"),
	slowdown: 0,
});

// fancy_floor.dm:129
rt.def("/turf/open/floor/grass/fakebasalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!prob(15)) return f.dot;
	this.icon_state = `basalt${rand(0, 12)}`;
	set_basalt_light(this);
	return f.dot;
}, true);

rt.type(4560, "/turf/open/floor/carpet", "/turf/open/floor", {
	broken_states: null,
	name: "carpet",
	desc: "Soft velvet carpeting. Feels good between your toes.",
	icon: rt.rsc("icons/turf/floors/carpet.dmi"),
	icon_state: "carpet",
	floor_tile: rt.typePath("/obj/item/stack/tile/carpet"),
	smooth: 1,
	canSmoothWith: null,
	flags: 0,
});

// fancy_floor.dm:141
rt.def("/turf/open/floor/carpet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("damaged");

	this.canSmoothWith = list(T("/turf/open/floor/carpet"));
	return f.dot;
});

// fancy_floor.dm:147
rt.def("/turf/open/floor/carpet/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// fancy_floor.dm:151
rt.def("/turf/open/floor/carpet/proc/update_icon", function* update_icon(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	if (!this.broken && !this.burnt) {
		if (this.smooth) {
			queue_smooth(this);
		}
	} else {
		yield* this.make_plating();
		if (!this.smooth) return f.dot;
		queue_smooth_neighbors(this);
	}
	return f.dot;
}, true);

rt.type(4561, "/turf/open/floor/carpet/black", "/turf/open/floor/carpet", {
	icon: rt.rsc("icons/turf/floors/carpet_black.dmi"),
	floor_tile: rt.typePath("/obj/item/stack/tile/carpet/black"),
	canSmoothWith: null,
});

// fancy_floor.dm:164
rt.def("/turf/open/floor/carpet/black/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/carpet/black"));
	return f.dot;
});

// fancy_floor.dm:168
rt.def("/turf/open/floor/carpet/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	let I: Value = null, A: Value = null;
	probability ??= 20;
	f.dot = (prob(probability) || force);
	for (I of each(this)) {
		A = I;
		if (ignore_mobs && ismob(A)) {
			continue;
		}
		if (ismob(A) || f.dot) {
			yield* A.narsie_act();
		}
	}
	return f.dot;
}, true);

// fancy_floor.dm:178
rt.def("/turf/open/floor/carpet/proc/break_tile", function* break_tile(f: Frame) {
	this.broken = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// fancy_floor.dm:182
rt.def("/turf/open/floor/carpet/proc/burn_tile", function* burn_tile(f: Frame) {
	this.burnt = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(4562, "/turf/open/floor/fakepit", "/turf/open/floor", {
	desc: "A clever illusion designed to look like a bottomless pit.",
	smooth: 11,
	canSmoothWith: null,
	icon: rt.rsc("icons/turf/floors/chasms.dmi"),
	icon_state: "smooth",
});

// fancy_floor.dm:191
rt.def("/turf/open/floor/fakepit/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/open/floor/fakepit"));
	return f.dot;
});

// fancy_floor.dm:196
rt.def("/turf/open/floor/fakepit/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/floors.dmi");
	underlay_appearance.icon_state = "basalt";
	return 1;
});

rt.type(4563, "/turf/open/floor/fakespace", "/turf/open/floor", {
	broken_states: null,
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
	floor_tile: rt.typePath("/obj/item/stack/tile/fakespace"),
	plane: -95,
});

// fancy_floor.dm:204
rt.def("/turf/open/floor/fakespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.broken_states = list("damaged");
	return f.dot;
});

// fancy_floor.dm:208
rt.def("/turf/open/floor/fakespace/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
	return f.dot;
}, true);

// fancy_floor.dm:212
rt.def("/turf/open/floor/fakespace/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	underlay_appearance.icon = rt.rsc("icons/turf/space.dmi");
	underlay_appearance.icon_state = `${rt.bitXor(this.x + this.y, rt.op(f, "BitNot", [], [this.x * this.y]) + this.z) % 25}`;
	underlay_appearance.plane = PLANE_SPACE;
	return 1;
});
