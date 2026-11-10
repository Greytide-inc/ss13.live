// Based on /tg/station's code/game/turfs/simulated/floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4506, "/turf/open/floor", "/turf/open", {
	icon_regular_floor: "floor",
	icon_plating: "plating",
	broken: 0,
	burnt: 0,
	floor_tile: null,
	broken_states: null,
	burnt_states: null,
	name: "floor",
	icon: rt.rsc("icons/turf/floors.dmi"),
	thermal_conductivity: 0.04,
	heat_capacity: 10000,
	intact: 1,
});

// floor.dm:20
rt.def("/turf/open/floor/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	if (!this.broken_states) {
		this.broken_states = GLOB.floor_broken_states; // tg_js: shared read-only lists (_globals.ts), not a copy per tile
	}
	if (!this.burnt_states) {
		this.burnt_states = GLOB.floor_burnt_states;
	}
	yield* parent_proc();
	if (rt.isIn(f, this.icon_state, GLOB.icons_to_ignore_at_floor_init)) {
		this.icon_regular_floor = "floor";
	} else {
		this.icon_regular_floor = this.icon_state;
	}
	if (!mapload) return f.dot;
	yield* this.MakeDirty();
	return f.dot;
}, true);

// floor.dm:49
rt.def("/turf/open/floor/proc/ex_act", function* ex_act(f: Frame) {
	let shielded: Value = this.is_shielded();
	yield* parent_proc();
	if (f.args[0] != 1 && shielded && f.args[1] != this) {
		return f.dot;
	}
	if (f.args[1] == this) {
		yield* this.ChangeTurf(this.baseturf);
	}
	if (f.args[1] !== null) {
		f.args[0] = 3;
	}
	const subject = f.args[0];
	if (subject === 1) {
		yield* this.ChangeTurf(this.baseturf);
	} else if (subject === 2) {
		const result = rt.op(f, "PickWeighted", [3], [100, 1, 2, 75, 100, 3]);
		if (result === 1) {
			yield* this.ReplaceWithLattice();
			if (prob(33)) {
				yield* new_(T("/obj/item/stack/sheet/metal"), this);
			}
		} else if (result === 2) {
			yield* this.ChangeTurf(this.baseturf);
		} else if (result === 3) {
			if (prob(80)) {
				yield* this.break_tile_to_plating();
			} else {
				yield* this.break_tile();
			}
			yield* this.hotspot_expose(1000, CELL_VOLUME);
			if (prob(33)) {
				yield* new_(T("/obj/item/stack/sheet/metal"), this);
			}
		}
	} else if (subject === 3) {
		if (!prob(50)) return f.dot;
		yield* this.break_tile();
		yield* this.hotspot_expose(1000, CELL_VOLUME);
	}
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// floor.dm:81
rt.def("/turf/open/floor/proc/is_shielded", function is_shielded(f: Frame) {
	let A: Value = null;
	for (A of each(this.contents, T("/obj/structure"))) {
		if (A.level == 3) {
			return 1;
		}
	}
	return f.dot;
});

// floor.dm:89
rt.def("/turf/open/floor/proc/update_icon", function update_icon(f: Frame) {
	this.update_visuals();
	return 1;
});

// floor.dm:93
rt.def("/turf/open/floor/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// floor.dm:99
rt.def("/turf/open/floor/proc/break_tile_to_plating", function* break_tile_to_plating(f: Frame) {
	let _T: Value = null;
	yield* (_T = (yield* this.make_plating())).break_tile();
	return f.dot;
}, true);

// floor.dm:105
rt.def("/turf/open/floor/proc/break_tile", function break_tile(f: Frame) {
	if (this.broken) {
		return f.dot;
	}
	this.icon_state = pick(this.broken_states);
	this.broken = 1;
	return f.dot;
});

// floor.dm:109
rt.def("/turf/open/floor/proc/burn_tile", function burn_tile(f: Frame) {
	if (this.broken || this.burnt) {
		return f.dot;
	}
	if (rt.len(f, this.burnt_states)) {
		this.icon_state = pick(this.burnt_states);
	} else {
		this.icon_state = pick(this.broken_states);
	}
	this.burnt = 1;
	return f.dot;
});

// floor.dm:118
rt.def("/turf/open/floor/proc/make_plating", function* make_plating(f: Frame) {
	return (yield* this.ChangeTurf(T("/turf/open/floor/plating")));
}, true);

// floor.dm:121
rt.def("/turf/open/floor/proc/ChangeTurf", function* ChangeTurf(f: Frame, new_path: Value) {
	let W: Value = null;
	if (!rt.istype(this, T("/turf/open/floor"))) {
		return (yield* parent_proc());
	}
	if (!ispath(new_path, T("/turf/open/floor"))) {
		return (yield* parent_proc());
	}
	let old_icon: Value = this.icon_regular_floor;
	let old_dir: Value = this.dir;
	(W = (yield* parent_proc())).icon_regular_floor = old_icon;
	yield* W.setDir(old_dir);
	yield* W.update_icon();
	return W;
}, true);

// floor.dm:134
rt.def("/turf/open/floor/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (!C || !user) {
		return 1;
	}
	if (yield* parent_proc()) {
		return 1;
	}
	if (this.intact && rt.istype(C, T("/obj/item/weapon/crowbar"))) {
		return (yield* this.pry_tile(C, user));
	}
	if (this.intact && rt.istype(C, T("/obj/item/stack/tile"))) {
		yield* this.try_replace_tile(C, user, params);
	}
	return 0;
}, true);

// floor.dm:145
rt.def("/turf/open/floor/proc/try_replace_tile", function* try_replace_tile(f: Frame, _T: Value, user: Value, params: Value) {
	let CB: Value = null, _P: Value = null;
	if (_T.turf_type == this.type) {
		return f.dot;
	}
	if (!(CB = user.is_holding_item_of_type(T("/obj/item/weapon/crowbar")))) {
		return f.dot;
	}
	if (!rt.istype((_P = (yield* this.pry_tile(CB, user, 1))), T("/turf/open/floor/plating"))) {
		return f.dot;
	}
	yield* _P.attackby(_T, user, params);
	return f.dot;
}, true);

// floor.dm:156
rt.def("/turf/open/floor/proc/pry_tile", function* pry_tile(f: Frame, C: Value, user: Value, silent: Value) {
	silent ??= 0;
	playsound(this, C.usesound, 80, 1);
	return (yield* this.remove_tile(user, silent));
}, true);

// floor.dm:160
rt.def("/turf/open/floor/proc/remove_tile", function* remove_tile(f: Frame, user: Value, silent: Value, make_tile: Value) {
	silent ??= 0;
	make_tile ??= 1;
	if (this.broken || this.burnt) {
		this.broken = 0;
		this.burnt = 0;
		if (user && !silent) {
			to_chat(user, "<span class='danger'>You remove the broken plating.</span>");
		}
	} else {
		if (user && !silent) {
			to_chat(user, "<span class='danger'>You remove the floor tile.</span>");
		}
		if (this.floor_tile && make_tile) {
			yield* new_(this.floor_tile, this);
		}
	}
	return (yield* this.make_plating());
}, true);

// floor.dm:173
rt.def("/turf/open/floor/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (current_size == STAGE_THREE) {
		if (prob(30)) {
			if (this.floor_tile) {
				yield* new_(this.floor_tile, this);
				yield* this.make_plating();
			}
		}
	} else if (current_size == STAGE_FOUR) {
		if (prob(50)) {
			if (this.floor_tile) {
				yield* new_(this.floor_tile, this);
				yield* this.make_plating();
			}
		}
	} else {
		if (!(current_size >= STAGE_FIVE)) return f.dot;
		if (this.floor_tile) {
			if (prob(70)) {
				yield* new_(this.floor_tile, this);
				yield* this.make_plating();
			}
		} else {
			if (!prob(50)) return f.dot;
			yield* this.ReplaceWithLattice();
		}
	}
	return f.dot;
}, true);

// floor.dm:192
rt.def("/turf/open/floor/proc/narsie_act", function* narsie_act(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.ChangeTurf(T("/turf/open/floor/engine/cult"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs", "probability"] });

// floor.dm:197
rt.def("/turf/open/floor/proc/ratvar_act", function* ratvar_act(f: Frame, force: Value, ignore_mobs: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.ChangeTurf(T("/turf/open/floor/clockwork"));
	return f.dot;
}, true);

// floor.dm:202
rt.def("/turf/open/floor/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* this.ChangeTurf(this.baseturf);
	return f.dot;
}, true);

// floor.dm:205
rt.def("/turf/open/floor/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_FLOORWALL) {
		return rt.alist(f, ["mode", RCD_FLOORWALL, "delay", 20, "cost", 16]);
	} else if (the_rcd.mode === RCD_AIRLOCK) {
		if (the_rcd.airlock_glass) {
			return rt.alist(f, ["mode", RCD_AIRLOCK, "delay", 50, "cost", 20]);
		}
		return rt.alist(f, ["mode", RCD_AIRLOCK, "delay", 50, "cost", 16]);
	} else if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 50, "cost", 33]);
	} else if (the_rcd.mode === RCD_WINDOWGRILLE) {
		return rt.alist(f, ["mode", RCD_WINDOWGRILLE, "delay", 10, "cost", 4]);
	}
	return 0;
});

// floor.dm:219
rt.def("/turf/open/floor/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let A: Value = null, G: Value = null;
	if (passed_mode === 1) {
		to_chat(user, "<span class='notice'>You build a wall.</span>");
		yield* this.ChangeTurf(T("/turf/closed/wall"));
		return 1;
	} else if (passed_mode === RCD_AIRLOCK) {
		if (rt.locateIn(f, T("/obj/machinery/door/airlock"), this)) {
			return 0;
		}
		to_chat(user, "<span class='notice'>You build an airlock.</span>");
		(A = (yield* new_(the_rcd.airlock_type, this))).electronics = (yield* new_(T("/obj/item/weapon/electronics/airlock"), A));
		if (the_rcd.conf_access) {
			A.electronics.accesses = (yield* the_rcd.conf_access.Copy());
		}
		A.electronics.one_access = the_rcd.use_one_access;
		if (A.electronics.one_access) {
			A.req_one_access = A.electronics.accesses;
		} else {
			A.req_access = A.electronics.accesses;
		}
		A.autoclose = 1;
		return 1;
	} else if (passed_mode === RCD_DECONSTRUCT) {
		if (rt.op(f, "IsType", [], [this, this.baseturf])) {
			return 0;
		}
		to_chat(user, `<span class='notice'>You deconstruct ${this}.</span>`);
		yield* this.ChangeTurf(this.baseturf);
		return 1;
	} else if (passed_mode === RCD_WINDOWGRILLE) {
		if (rt.locateIn(f, T("/obj/structure/grille"), this)) {
			return 0;
		}
		to_chat(user, "<span class='notice'>You construct the grille.</span>");
		(G = (yield* new_(T("/obj/structure/grille"), this))).anchored = 1;
		return 1;
	}
	return 0;
}, true);
