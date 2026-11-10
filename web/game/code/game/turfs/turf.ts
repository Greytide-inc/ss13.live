// Based on /tg/station's code/game/turfs/turf.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, truthy, add, divide } = rt;


rt.type(4412, "/turf", "/atom", {
	intact: 1,
	baseturf: rt.typePath("/turf/open/space"),
	temperature: 293.15,
	to_be_destroyed: 0,
	max_fire_temperature_sustained: 0,
	blocks_air: 0,
	obscured: null,
	blueprint_data: null,
	explosion_level: 0,
	explosion_id: 0,
	decals: null,
	requires_activation: null,
	changing_turf: 0,
	thermal_conductivity: 0.05,
	heat_capacity: 1,
	temperature_archived: null,
	atmos_adjacent_turfs: null,
	atmos_supeconductivity: 0,
	archived_cycle: 0,
	current_cycle: 0,
	initial_gas_mix: "o2=22;n2=82;TEMP=293.15",
	dynamic_lighting: 1,
	lighting_corners_initialised: 0,
	affecting_lights: null,
	lighting_object: null,
	corners: null,
	has_opaque_atom: 0,
	fixed_underlay: null,
	layer: 2,
	icon: rt.rsc("icons/turf/floors.dmi"),
	level: 1,
	flags: 4,
	luminosity: 1,
}, { tmp: ["lighting_corners_initialised","affecting_lights","lighting_object","corners","has_opaque_atom"] });

// turf.dm:29
rt.def("/turf/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, new_value: Value) {
	if (rt.isIn(f, var_name, rt.gl("banned_edits#3"))) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// turf.dm:35
rt.def("/turf/proc/Initialize", function* Initialize(f: Frame) {
	let AM: Value = null;
	if (this.initialized) {
		stack_trace(`Warning: ${this}(${this.type}) initialized multiple times!`);
	}
	this.initialized = 1;
	yield* this.levelupdate();
	if (this.smooth) {
		queue_smooth(this);
	}
	this.visibilityChanged();
	for (AM of each(this, T("/atom/movable"))) {
		yield* this.Entered(AM);
	}
	let A: Value = this.loc;
	if (!this.dynamic_lighting && A.dynamic_lighting) {
		this.add_overlay(T("/obj/effect/fullbright"));
	}
	if (this.requires_activation) {
		this.CalculateAdjacentTurfs();
		GLOB.SSair.add_to_active(this);
	}
	if (this.light_power && this.light_range) {
		yield* this.update_light();
	}
	if (this.opacity) {
		this.has_opaque_atom = 1;
	}
	return 0;
}, true);

// turf.dm:62
rt.def("/turf/proc/Initalize_Atmos", function Initalize_Atmos(f: Frame, times_fired: Value) {
	this.CalculateAdjacentTurfs();
	return f.dot;
});

// turf.dm:66
rt.def("/turf/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	let B: Value = null, A: Value = null, I: Value = null;
	f.dot = QDEL_HINT_IWILLGC;
	if (!this.changing_turf) {
		stack_trace("Incorrect turf deletion");
	}
	this.changing_turf = 0;
	if (force) {
		yield* parent_proc();
		B = (yield* new_(rt.world().turf, this));
		for (A of each(B.contents)) {
			yield* qdel(A);
		}
		for (I of each(B.vars)) {
			rt.setAt(B.vars, I, null);
		}
		return f.dot;
	}
	GLOB.SSair.remove_from_active(this);
	this.visibilityChanged();
	this.initialized = 0;
	this.requires_activation = 0;
	yield* parent_proc();
	return f.dot;
}, true);

// turf.dm:85
rt.def("/turf/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.Move_Pulled(this);
	return f.dot;
}, true);

// turf.dm:88
rt.def("/turf/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let coil: Value = null, LC: Value = null;
	if (this.can_lay_cable() && rt.istype(C, T("/obj/item/stack/cable_coil"))) {
		coil = C;
		for (LC of each(this, T("/obj/structure/cable"))) {
			if (LC.d1 == 0 || LC.d2 == 0) {
				yield* LC.attackby(C, user);
				return f.dot;
			}
		}
		yield* coil.place_turf(this, user);
		return 1;
	}
	return 0;
}, true);

// turf.dm:100
rt.def("/turf/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let obstacle: Value = null;
	height ??= 1.5;
	if (!target) {
		return 0;
	}
	if (rt.istype(mover, T("/atom/movable"))) {
		return (!this.density ? 1 : 0);
	}
	if (target.blocks_air || this.blocks_air) {
		return 0;
	}
	for (obstacle of each(this, T("/obj"))) {
		if (!(yield* obstacle.CanPass(mover, target, height))) {
			return 0;
		}
	}
	obstacle = null;
	for (obstacle of each(target, T("/obj"))) {
		if (!(yield* obstacle.CanPass(mover, this, height))) {
			return 0;
		}
	}
	return 1;
}, true);

// turf.dm:119
rt.def("/turf/proc/Enter", function* Enter(f: Frame, mover: Value, forget: Value) {
	let obstacle: Value = null, border_obstacle: Value = null, tompost_bump: Value = null, obstacle_3: Value = null;
	let $e: any;
	let L: Value = null, sk: Value = null, r: Value = null;
	if (!mover) {
		return 1;
	}
	// stress2c: CheckExit and CanPass only for the atoms where the call can matter (a type with its own CheckExit / CanPass, or
	// a dense atom): hook_list, see src/vm/natives-world.ts. Everything else runs the base proc, which lets the mover go.
	const chk = truthy(rt.call(f, P("/proc/hook_check_mode"), null, []));
	if (isturf(mover.loc) && (L = rt.call(f, P("/proc/hook_list"), null, [mover.loc, 4])) !== null) {
		for (obstacle of each(L, T("/obj"))) {
			sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [obstacle, 4]) : 0);
			r = obstacle.CheckExit(mover, this);
			if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 4]);
			if (!r && obstacle != mover && obstacle != forget) {
				yield* mover.Bump(obstacle, 1);
				return 0;
			}
		}
	}
	let large_dense: Value = list();
	if ((L = rt.call(f, P("/proc/hook_list"), null, [this, 5])) !== null) {
		for (border_obstacle of each(L, T("/atom/movable"))) {
			if (rt.bitAnd(border_obstacle.flags, 512)) {
				sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [border_obstacle, 5]) : 0);
				r = (yield* border_obstacle.CanPass(mover, mover.loc, 1));
				if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 5]);
				if (!r && forget != border_obstacle) {
					yield* mover.Bump(border_obstacle, 1);
					return 0;
				}
			} else {
				large_dense += border_obstacle;
			}
		}
	}
	if (!(yield* this.CanPass(mover, this))) {
		yield* mover.Bump(this, 1);
		return 0;
	}
	let top_layer: Value = 0;
	for (obstacle_3 of each(large_dense, T("/atom/movable"))) {
		sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [obstacle_3, 5]) : 0);
		r = (yield* obstacle_3.CanPass(mover, mover.loc, 1));
		if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 5]);
		if (!r && forget != obstacle_3) {
			if (obstacle_3.layer > top_layer) {
				tompost_bump = obstacle_3;
				top_layer = obstacle_3.layer;
			}
		}
	}
	if (tompost_bump) {
		yield* mover.Bump(tompost_bump, 1);
		return 0;
	}
	return 1;
}, true);

// turf.dm:159
rt.def("/turf/proc/Entered", function Entered(f: Frame, AM: Value) {
	if (!(this.explosion_level && AM.ex_check(this.explosion_id))) return f.dot;
	AM.ex_act(this.explosion_level);
	return f.dot;
});

// turf.dm:163
rt.def("/turf/open/proc/Entered", function* Entered(f: Frame, AM: Value) {
	let M: Value = null, O: Value = null;
	yield* parent_proc();
	if (rt.istype(AM, T("/mob/living/carbon"))) {
		if (rt.bitAnd((M = AM).movement_type, 2)) {
			return f.dot;
		}
		if (this.wet === TURF_WET_WATER) {
			if (!(yield* M.slip(60, null, NO_SLIP_WHEN_WALKING))) {
				M.inertia_dir = 0;
			}
		} else if (this.wet === TURF_WET_LUBE) {
			if (yield* M.slip(80, null, 6)) {
				M.confused = max(M.confused, 8);
			}
		} else if (this.wet === TURF_WET_ICE) {
			yield* M.slip(120, null, 6);
		} else if (this.wet === TURF_WET_PERMAFROST) {
			yield* M.slip(120, null, 12);
		} else if (this.wet === TURF_WET_SLIDE) {
			yield* M.slip(80, null, 6);
		}
	}
	if (!(rt.istype(AM, T("/obj")) && this.air && this.air.temperature > T0C)) return f.dot;
	if (!((O = AM).secondary_flags ? rt.index(O.secondary_flags, "frozen") : 0)) return f.dot;
	O.make_unfrozen();
	return f.dot;
}, true);

// turf.dm:192
rt.def("/turf/proc/levelupdate", function* levelupdate(f: Frame) {
	let O: Value = null;
	for (O of each(this, T("/obj"))) {
		if (O.level == 1) {
			yield* O.hide(this.intact);
		}
	}
	return f.dot;
}, true);

// turf.dm:198
rt.def("/turf/open/space/proc/levelupdate", function* levelupdate(f: Frame) {
	let O: Value = null;
	for (O of each(this, T("/obj"))) {
		if (O.level == 1) {
			yield* O.hide(0);
		}
	}
	return f.dot;
}, true);

// turf.dm:204
rt.def("/turf/proc/RemoveLattice", function* RemoveLattice(f: Frame) {
	let L: Value = null;
	if (!(L = rt.locateIn(f, T("/obj/structure/lattice"), this))) return f.dot;
	yield* qdel(L);
	return f.dot;
}, true);

// turf.dm:210
rt.def("/turf/proc/TerraformTurf", function* TerraformTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	defer_change ??= 0;
	ignore_air ??= 0;
	return (yield* this.ChangeTurf(path, defer_change, ignore_air));
}, true);

// turf.dm:214
rt.def("/turf/proc/ChangeTurf", function* ChangeTurf(f: Frame, path: Value, defer_change: Value, ignore_air: Value) {
	let W: Value = null;
	defer_change ??= 0;
	ignore_air ??= 0;
	if (!path) {
		return f.dot;
	}
	if (!GLOB.use_preloader && path == this.type) {
		return this;
	}
	let old_baseturf: Value = this.baseturf;
	this.changing_turf = 1;
	yield* qdel(this);
	(W = (yield* new_(path, this))).baseturf = old_baseturf;
	if (!defer_change) {
		yield* W.AfterChange(ignore_air);
	}
	return W;
}, true);

// turf.dm:232
rt.def("/turf/proc/AfterChange", function* AfterChange(f: Frame, ignore_air: Value) {
	let C: Value = null, I: Value = null, _T: Value = null, FD: Value = null;
	ignore_air ??= 0;
	yield* this.levelupdate();
	this.CalculateAdjacentTurfs();
	if (!this.can_have_cabling()) {
		for (C of each(this.contents, T("/obj/structure/cable"))) {
			yield* C.deconstruct();
		}
	}
	let turfs_to_check: Value = rt.bitOr(get_adjacent_open_turfs(this), this);
	for (I of each(turfs_to_check)) {
		_T = I;
		FD = null;
		for (FD of each(_T, T("/obj/machinery/door/firedoor"))) {
			FD.CalculateAffectingAreas();
		}
	}
	queue_smooth_neighbors(this);
	yield* this.HandleTurfChange(this);
	return f.dot;
}, true);

// turf.dm:251
rt.def("/turf/open/proc/AfterChange", function* AfterChange(f: Frame, ignore_air: Value) {
	yield* parent_proc();
	yield* this.RemoveLattice();
	if (ignore_air) return f.dot;
	this.Assimilate_Air();
	return f.dot;
}, true);

// turf.dm:261
rt.def("/turf/open/proc/Assimilate_Air", function Assimilate_Air(f: Frame) {
	let _T: Value = null, S: Value = null, S_gases: Value = null, id: Value = null, id_4: Value = null;
	if (this.blocks_air) {
		return f.dot;
	}
	let total: Value = new_(T("/datum/gas_mixture"));
	let total_gases: Value = total.gases;
	let turf_count: Value = rt.length(this.atmos_adjacent_turfs);
	for (_T of each(this.atmos_adjacent_turfs)) {
		if (!(S = _T).air) {
			continue;
		}
		S_gases = S.air.gases;
		id = null;
		for (id of each(S_gases)) {
			total.assert_gas(id);
			rt.modAt(rt.index(total_gases, id), 1, rt.index(rt.index(S_gases, id), 1), add);
		}
		total.temperature += S.air.temperature;
	}
	this.air.copy_from(total);
	if (!turf_count) {
		return f.dot;
	}
	let air_gases: Value = this.air.gases;
	for (id_4 of each(air_gases)) {
		(rt.modAt(rt.index(air_gases, id_4), 1, turf_count, divide));
	}
	this.air.temperature /= turf_count;
	GLOB.SSair.add_to_active(this);
	return f.dot;
});

// turf.dm:288
rt.def("/turf/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	yield* this.ChangeTurf(this.baseturf);
	yield* new_(T("/obj/structure/lattice"), rt.locate(this.x, this.y, this.z));
	return f.dot;
}, true);

// turf.dm:301
rt.def("/turf/proc/Bless", function Bless(f: Frame) {
	(rt.modSrcVar(f, "flags", 1, rt.bitOr));
	return f.dot;
});

// turf.dm:304
rt.def("/turf/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	if (rt.len(f, src_object.contents)) {
		to_chat(f.usr, "<span class='notice'>You start dumping out the contents...</span>");
		if (!(yield* do_after(f.usr, 20, { target: src_object }))) {
			return 0;
		}
	}
	let things: Value = (yield* src_object.contents.Copy());
	let progress: Value = (yield* new_(T("/datum/progressbar"), user, rt.len(f, things), this));
	while (yield* do_after(f.usr, 10, 1, this, 0, (yield* new_(T("/datum/callback"), src_object, P("/obj/item/weapon/storage/proc/mass_remove_from_storage"), this, things, progress)))) {
		yield* sleep(1);
	}
	yield* qdel(progress);
	return 1;
}, true);

// turf.dm:323
rt.def("/turf/proc/Distance", function Distance(f: Frame, _T: Value) {
	return get_dist(this, _T);
}, false, { argTypes: [{ path: "/turf" }] });

// turf.dm:329
rt.def("/turf/proc/Distance_cardinal", function Distance_cardinal(f: Frame, _T: Value) {
	if (!this || !_T) {
		return 0;
	}
	return rt.op(f, "Abs", [], [this.x - _T.x]) + rt.op(f, "Abs", [], [this.y - _T.y]);
}, false, { argTypes: [{ path: "/turf" }] });

// turf.dm:336
rt.def("/turf/proc/singularity_act", function* singularity_act(f: Frame) {
	let O: Value = null;
	if (this.intact) {
		for (O of each(this.contents, T("/obj"))) {
			if (O.level != 1) {
				continue;
			}
			if (O.invisibility == INVISIBILITY_MAXIMUM) {
				yield* O.singularity_act();
			}
		}
	}
	yield* this.ChangeTurf(this.baseturf);
	return 2;
}, true);

// turf.dm:348
rt.def("/turf/proc/can_lay_cable", function can_lay_cable(f: Frame) {
	return rt.bitAnd(this.can_have_cabling(), (!this.intact ? 1 : 0));
});

// turf.dm:352
rt.def("/turf/proc/visibilityChanged", function visibilityChanged(f: Frame) {
	if (!GLOB.SSticker) return f.dot;
	GLOB.cameranet.updateVisibility(this);
	return f.dot;
});

// turf.dm:360
rt.def("/turf/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let affecting_level: Value = null, V: Value = null, A: Value = null, AM: Value = null;
	if (severity == 1) {
		affecting_level = 1;
	} else if (this.is_shielded()) {
		affecting_level = 3;
	} else if (this.intact) {
		affecting_level = 2;
	} else {
		affecting_level = 1;
	}
	for (V of each(this.contents)) {
		if ((A = V).level >= affecting_level) {
			if (rt.istype(A, T("/atom/movable"))) {
				if (!(AM = A).ex_check(this.explosion_id)) {
					continue;
				}
			}
			yield* A.ex_act(severity, target);
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	return f.dot;
}, true);

// turf.dm:380
rt.def("/turf/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
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

// turf.dm:389
rt.def("/turf/proc/ratvar_act", function* ratvar_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	let I: Value = null, A: Value = null;
	probability ??= 40;
	f.dot = (prob(probability) || force);
	for (I of each(this)) {
		A = I;
		if (ignore_mobs && ismob(A)) {
			continue;
		}
		if (ismob(A) || f.dot) {
			yield* A.ratvar_act();
		}
	}
	return f.dot;
}, true);

// turf.dm:404
rt.def("/turf/proc/add_blueprints", function add_blueprints(f: Frame, AM: Value) {
	let I: Value = null;
	(I = new_(T("/image"))).appearance = AM.appearance;
	I.appearance_flags = 14;
	I.loc = this;
	I.setDir(AM.dir);
	I.alpha = 128;
	if (!this.blueprint_data) {
		this.blueprint_data = list();
	}
	this.blueprint_data += I;
	return f.dot;
});

// turf.dm:417
rt.def("/turf/proc/add_blueprints_preround", function add_blueprints_preround(f: Frame, AM: Value) {
	if (GLOB.SSticker.HasRoundStarted()) return f.dot;
	this.add_blueprints(AM);
	return f.dot;
});

// turf.dm:422
rt.def("/turf/proc/empty", function* empty(f: Frame, turf_type: Value) {
	let A: Value = null;
	turf_type ??= T("/turf/open/space");
	let T0: Value = this;
	for (A of each(T0.GetAllContents())) {
		if (rt.istype(A, T("/mob/dead"))) {
			continue;
		}
		if (rt.istype(A, T("/obj/effect/landmark"))) {
			continue;
		}
		if (rt.istype(A, T("/obj/docking_port"))) {
			continue;
		}
		if (A == T0) {
			continue;
		}
		yield* qdel(A, { force: 1 });
	}
	yield* T0.ChangeTurf(turf_type);
	GLOB.SSair.remove_from_active(T0);
	T0.CalculateAdjacentTurfs();
	GLOB.SSair.add_to_active(T0, 1);
	return f.dot;
}, true);

// turf.dm:446
rt.def("/turf/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	let O: Value = null, A: Value = null;
	f.dot = 1;
	let acid_type: Value = T("/obj/effect/acid");
	if (acidpwr >= 200) {
		acid_type = T("/obj/effect/acid/alien");
	}
	let has_acid_effect: Value = 0;
	for (O of each(this, T("/obj"))) {
		if (this.intact && O.level == 1) {
			continue;
		}
		if (rt.op(f, "IsType", [], [O, acid_type])) {
			(A = O).acid_level = min(A.level + acid_volume * acidpwr, 12000);
			has_acid_effect = 1;
			continue;
		}
		yield* O.acid_act(acidpwr, acid_volume);
	}
	if (has_acid_effect) return f.dot;
	yield* new_(acid_type, this, acidpwr, acid_volume);
	return f.dot;
}, true);

// turf.dm:468
rt.def("/turf/proc/copyTurf", function* copyTurf(f: Frame, _T: Value) {
	let O: Value = null, group: Value = null;
	if (_T.type != this.type) {
		if (rt.len(f, this.underlays)) {
			(O = (yield* new_(T("/obj")))).underlays.Add(_T);
		}
		yield* _T.ChangeTurf(this.type);
		for (group of each(this.decals)) {
			_T.add_decal(rt.index(this.decals, group), group);
		}
		if (rt.len(f, this.underlays)) {
			_T.underlays = O.underlays;
		}
	}
	if (_T.icon_state != this.icon_state) {
		_T.icon_state = this.icon_state;
	}
	if (_T.icon != this.icon) {
		_T.icon = this.icon;
	}
	if (this.color) {
		_T.atom_colours = (yield* this.atom_colours.Copy());
		_T.update_atom_colour();
	}
	if (_T.dir != this.dir) {
		yield* _T.setDir(this.dir);
	}
	return _T;
}, true);

// turf.dm:490
rt.def("/turf/proc/handle_fall", function handle_fall(f: Frame, faller: Value, forced: Value) {
	faller.lying = pick(90, 270);
	if (!forced) {
		return f.dot;
	}
	if (!this.has_gravity(this)) return f.dot;
	playsound(this, "bodyfall", 50, 1);
	return f.dot;
});

// turf.dm:498
rt.def("/turf/proc/add_decal", function add_decal(f: Frame, decal: Value, group: Value) {
	if (!this.decals) {
		this.decals = list();
	}
	if (!rt.index(this.decals, group)) {
		rt.setAt(this.decals, group, list());
	}
	rt.modAt(this.decals, group, decal, add);
	this.add_overlay(rt.index(this.decals, group));
	return f.dot;
});

// turf.dm:510
rt.def("/turf/proc/photograph", function photograph(f: Frame, limit: Value) {
	let I: Value = null, V: Value = null, A: Value = null;
	limit ??= 20;
	(I = new_(T("/image"))).overlays += this;
	for (V of each(this.contents)) {
		if ((A = V).invisibility) {
			continue;
		}
		I.overlays += A;
		if (limit) {
			limit--;
		} else {
			return I;
		}
	}
	return I;
});
