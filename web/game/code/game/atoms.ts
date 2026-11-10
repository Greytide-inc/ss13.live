// Based on /tg/station's code/game/atoms.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4802, "/atom", "/datum", {
	smooth: 0,
	top_left_corner: null,
	top_right_corner: null,
	bottom_left_corner: null,
	bottom_right_corner: null,
	canSmoothWith: null,
	wires: null,
	alternate_appearances: null,
	level: 2,
	flags: 0,
	secondary_flags: null,
	fingerprints: null,
	fingerprintshidden: null,
	blood_DNA: null,
	container_type: 0,
	admin_spawned: 0,
	reagents: null,
	hud_list: null,
	hud_possible: null,
	explosion_block: 0,
	atom_colours: null,
	initialized: 0,
	our_overlays: null,
	priority_overlays: null,
	proximity_monitor: null,
	CanAtmosPass: 1,
	suit_fibers: null,
	light_power: 1,
	light_range: 0,
	light_color: null,
	light: null,
	light_sources: null,
	orbiters: null,
	name: null,
	text: null,
	desc: null,
	suffix: null,
	verbs: null,
	contents: null,
	overlays: null,
	underlays: null,
	vis_locs: null,
	vis_contents: null,
	loc: null,
	dir: 2,
	x: 0,
	y: 0,
	z: 0,
	pixel_x: 0,
	pixel_y: 0,
	pixel_z: 0,
	pixel_w: 0,
	icon_w: 0,
	icon_z: 0,
	icon: null,
	icon_state: null,
	layer: 2,
	plane: 0,
	alpha: 255,
	color: null,
	invisibility: 0,
	mouse_opacity: 1,
	infra_luminosity: 0,
	luminosity: 0,
	opacity: 0,
	transform: null,
	blend_mode: 0,
	gender: "neuter",
	density: 0,
	maptext: null,
	filters: null,
	appearance: null,
	appearance_flags: 0,
	maptext_width: 32,
	maptext_height: 32,
	maptext_x: 0,
	maptext_y: 0,
	step_x: null,
	step_y: null,
	render_source: null,
	mouse_drag_pointer: null,
	mouse_drop_pointer: 1,
	mouse_over_pointer: null,
	mouse_drop_zone: 0,
	render_target: null,
	vis_flags: null,
	pixloc: null,
}, { tmp: ["light","light_sources","verbs","vis_locs","loc","x","y","z","mouse_drag_pointer","mouse_drop_pointer","mouse_over_pointer"] });

// atoms.dm:35
rt.def("/atom/proc/New", function* New(f: Frame) {
	let do_initialize: Value = null, created: Value = null;
	if (GLOB.use_preloader && this.type == GLOB._preloader.target_path) {
		yield* GLOB._preloader.load(this);
	}
	if ((do_initialize = GLOB.SSatoms.initialized) > INITIALIZATION_INSSATOMS) {
		rt.setAt(f.argsList, 1, (do_initialize == 1 ? 1 : 0));
		if (yield* GLOB.SSatoms.InitAtom(this, f.argsList)) {
			return f.dot;
		}
	}
	if (!(created = GLOB.SSatoms.created_atoms)) return f.dot;
	created += this;
	return f.dot;
}, true, { args: ["loc"] });

// atoms.dm:66
rt.def("/atom/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let _T: Value = null;
	if (this.initialized) {
		stack_trace(`Warning: ${this}(${this.type}) initialized multiple times!`);
	}
	this.initialized = 1;
	if (this.color) {
		this.add_atom_colour(this.color, 4);
	}
	if (this.light_power && this.light_range) {
		this.update_light();
	}
	if (this.opacity && isturf(this.loc)) {
		(_T = this.loc).has_opaque_atom = 1;
	}
	return 0;
});

// atoms.dm:87
rt.def("/atom/proc/Destroy", function* Destroy(f: Frame) {
	let K: Value = null, AA: Value = null;
	if (this.alternate_appearances) {
		for (K of each(this.alternate_appearances)) {
			yield* (AA = rt.index(this.alternate_appearances, K)).remove_from_hud(this);
		}
	}
	if (this.reagents) {
		yield* qdel(this.reagents);
	}
	if (this.overlays) {
		this.overlays.Cut();
	}
	if (this.priority_overlays) {
		this.priority_overlays.Cut();
	}
	yield* qdel(this.light);
	this.light = null;
	return (yield* parent_proc());
}, true);

// atoms.dm:106
rt.def("/atom/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 1.5;
	return ((!this.density ? 1 : 0) || (!height ? 1 : 0));
});

// atoms.dm:109
rt.def("/atom/proc/onCentcom", function onCentcom(f: Frame) {
	let _T: Value = null, A: Value = null, M: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return 0;
	}
	if (_T.z == ZLEVEL_TRANSIT) {
		for (A of each(GLOB.SSshuttle.mobile)) {
			if (rt.isIn(f, (((M = A).launch_status == ENDGAME_TRANSIT ? 1 : 0) && _T), M.areaInstance)) {
				return 1;
			}
		}
	}
	if (_T.z != 1) {
		return 0;
	}
	A = null;
	for (A of each(GLOB.SSshuttle.mobile)) {
		if (rt.isIn(f, (((M = A).launch_status == 1 ? 1 : 0) && _T), M.areaInstance)) {
			return 1;
		}
	}
	return (rt.istype(_T.loc, T("/area/centcom")) ? 1 : 0);
});

// atoms.dm:133
rt.def("/atom/proc/onSyndieBase", function onSyndieBase(f: Frame) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return 0;
	}
	if (_T.z != ZLEVEL_CENTCOM) {
		return 0;
	}
	if (rt.istype(_T.loc, T("/area/shuttle/syndicate")) || rt.istype(_T.loc, T("/area/syndicate_mothership"))) {
		return 1;
	}
	return 0;
});

// atoms.dm:147
rt.def("/atom/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (!does_attack_animation) return f.dot;
	user.changeNext_move(8);
	add_logs(user, this, "punched", "hulk powers");
	yield* user.do_attack_animation(this, "smash");
	return f.dot;
}, true);

// atoms.dm:152
rt.def("/atom/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let A: Value = null, M: Value = null, L: Value = null;
	for (A of each(parts_list)) {
		if (rt.istype(A, T("/datum/reagent"))) {
			if (!this.reagents) {
				this.reagents = (yield* new_(T("/datum/reagents")));
			}
			this.reagents.reagent_list.Add(A);
			yield* this.reagents.conditional_update();
		} else if (rt.istype(A, T("/atom/movable"))) {
			if (rt.istype((M = A).loc, T("/mob/living"))) {
				yield* (L = M.loc).transferItemToLoc(M, this);
			} else {
				yield* M.forceMove(this);
			}
		}
	}
	return f.dot;
}, true);

// atoms.dm:167
rt.def("/atom/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	yield* qdel(giver);
	return null;
}, true);

// atoms.dm:171
rt.def("/atom/proc/remove_air", function remove_air(f: Frame, amount: Value) {
	return null;
});

// atoms.dm:175
rt.def("/atom/proc/return_air", function return_air(f: Frame) {
	if (this.loc) {
		return this.loc.return_air();
	}
	return null;
});

// atoms.dm:190
rt.def("/atom/proc/is_open_container", function is_open_container(f: Frame) {
	return rt.bitAnd(this.container_type, OPENCONTAINER);
});

// atoms.dm:193
rt.def("/atom/proc/is_transparent", function is_transparent(f: Frame) {
	return rt.bitAnd(this.container_type, TRANSPARENT);
});

// atoms.dm:196
rt.def("/atom/proc/is_injectable", function* is_injectable(f: Frame, allowmobs: Value) {
	let L: Value = null;
	allowmobs ??= 1;
	if (rt.istype(this, T("/mob/living")) && allowmobs) {
		return (yield* (L = this).can_inject());
	}
	if (rt.bitAnd(this.container_type, OPENCONTAINER)) {
		return 1;
	}
	return rt.bitAnd(this.container_type, INJECTABLE);
}, true);

// atoms.dm:204
rt.def("/atom/proc/is_drawable", function* is_drawable(f: Frame, allowmobs: Value) {
	allowmobs ??= 1;
	if (yield* this.is_injectable(allowmobs)) {
		return 1;
	}
	return rt.bitAnd(this.container_type, DRAWABLE);
}, true);

// atoms.dm:218
rt.def("/atom/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let $0: any = (rt.istype(this.wires, T("/datum/wires")) ? 1 : 0);
	if ($0) {
		if (this.secondary_flags) {
			$0 = rt.index(this.secondary_flags, "no_emp_wires");
		} else {
			$0 = 0;
		}
		$0 = (!$0 ? 1 : 0);
	}
	if (!$0) return f.dot;
	yield* this.wires.emp_pulse();
	return f.dot;
}, true);

// atoms.dm:222
rt.def("/atom/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	f.dot = (yield* _P.on_hit(this, 0, def_zone));
	return f.dot;
}, true);

// atoms.dm:225
rt.def("/atom/proc/in_contents_of", function in_contents_of(f: Frame, container: Value) {
	if (ispath(container)) {
		if (rt.op(f, "IsType", [], [this.loc, container])) {
			return 1;
		}
	} else {
		if (!rt.isIn(f, this, container)) return f.dot;
		return 1;
	}
	return f.dot;
});

// atoms.dm:242
rt.def("/atom/proc/search_contents_for", function search_contents_for(f: Frame, path: Value, filter_path: Value) {
	let A: Value = null, pass: Value = null, type: Value = null;
	let found: Value = list();
	for (A of each(this, T("/atom"))) {
		if (rt.op(f, "IsType", [], [A, path])) {
			found += A;
		}
		if (filter_path) {
			pass = 0;
			type = null;
			for (type of each(filter_path)) {
				(pass = rt.modify(pass, rt.op(f, "IsType", [], [A, type]), rt.bitOr));
			}
			if (!pass) {
				continue;
			}
		}
		if (rt.len(f, A.contents)) {
			found += A.search_contents_for(path, filter_path);
		}
	}
	return found;
});

// atoms.dm:259
rt.def("/atom/proc/examine", function examine(f: Frame, user: Value) {
	let R: Value = null, total_volume: Value = null, R_2: Value = null;
	let f_name: Value = fmt("＇！.", [this]);
	if (this.blood_DNA && !rt.istype(this, T("/obj/effect/decal"))) {
		if (this.gender == "plural") {
			f_name = "some ";
		} else {
			f_name = "a ";
		}
		f_name += `<span class='danger'>blood-stained</span> ${this.name}!`;
	}
	to_chat(user, `${bicon(this)} That's ${f_name}`);
	if (this.desc) {
		to_chat(user, this.desc);
	}
	if (!(this.reagents && (this.is_open_container() || this.is_transparent()))) return f.dot;
	to_chat(user, "It contains:");
	if (rt.len(f, this.reagents.reagent_list)) {
		if (user.can_see_reagents()) {
			for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
				to_chat(user, `${R.volume} units of ${R.name}`);
			}
		} else {
			total_volume = 0;
			for (R_2 of each(this.reagents.reagent_list, T("/datum/reagent"))) {
				total_volume += R_2.volume;
			}
			to_chat(user, `${total_volume} units of various reagents`);
		}
	} else {
		to_chat(user, "Nothing.");
	}
	return f.dot;
});

// atoms.dm:296
rt.def("/atom/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.contents_explosion(severity, target);
	return f.dot;
}, true, { waitfor: false });

// atoms.dm:305
rt.def("/atom/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value, blocked: Value) {
	if (!(this.density && !this.has_gravity(AM))) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/hitby_react"), AM)), 2);
	return f.dot;
}, true);

// atoms.dm:309
rt.def("/atom/proc/hitby_react", function* hitby_react(f: Frame, AM: Value) {
	if (!(AM && isturf(AM.loc))) return f.dot;
	yield* step(AM, turn(AM.dir, 180));
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }] });

// atoms.dm:312
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_splatter_icons", function InitGlobalblood_splatter_icons(f: Frame) {
	GLOB.blood_splatter_icons = list();
	this.gvars_datum_init_order += "blood_splatter_icons";
	return f.dot;
});

// atoms.dm:315
rt.def("/atom/proc/blood_splatter_index", function blood_splatter_index(f: Frame) {
	return fmt("＃-＀", [rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state")]);
});

// atoms.dm:319
rt.def("/mob/living/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	if (this.get_blood_id() != "blood") {
		return f.dot;
	}
	return rt.alist(f, ["ANIMAL DNA", "Y-"]);
});

// atoms.dm:324
rt.def("/mob/living/carbon/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	if (this.get_blood_id() != "blood") {
		return f.dot;
	}
	let blood_dna: Value = list();
	if (this.dna) {
		rt.setAt(blood_dna, this.dna.unique_enzymes, this.dna.blood_type);
	} else {
		rt.setAt(blood_dna, "UNKNOWN DNA", "X*");
	}
	return blood_dna;
});

// atoms.dm:334
rt.def("/mob/living/carbon/alien/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	return rt.alist(f, ["UNKNOWN DNA", "X*"]);
});

// atoms.dm:339
rt.def("/atom/proc/transfer_mob_blood_dna", function transfer_mob_blood_dna(f: Frame, L: Value) {
	let new_blood_dna: Value = null;
	if (!(new_blood_dna = L.get_blood_dna_list())) {
		return 0;
	}
	if (!this.blood_DNA) {
		this.blood_DNA = list();
	}
	let old_length: Value = rt.len(f, this.blood_DNA);
	(rt.modSrcVar(f, "blood_DNA", new_blood_dna, rt.bitOr));
	if (rt.len(f, this.blood_DNA) == old_length) {
		return 0;
	}
	return 1;
});

// atoms.dm:352
rt.def("/atom/proc/transfer_blood_dna", function transfer_blood_dna(f: Frame, blood_dna: Value) {
	if (!this.blood_DNA) {
		this.blood_DNA = list();
	}
	let old_length: Value = rt.len(f, this.blood_DNA);
	(rt.modSrcVar(f, "blood_DNA", blood_dna, rt.bitOr));
	if (!(rt.len(f, this.blood_DNA) > old_length)) return f.dot;
	return 1;
});

// atoms.dm:362
rt.def("/atom/proc/add_mob_blood", function* add_mob_blood(f: Frame, M: Value) {
	let blood_dna: Value = null;
	if (!(blood_dna = M.get_blood_dna_list())) {
		return 0;
	}
	return (yield* this.add_blood(blood_dna));
}, true);

// atoms.dm:372
rt.def("/obj/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return this.transfer_blood_dna(blood_dna);
});

// atoms.dm:375
rt.def("/obj/item/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	let blood_count: Value = !this.blood_DNA ? 0 : rt.len(f, this.blood_DNA);
	if (!parent_proc()) {
		return 0;
	}
	if (!blood_count) {
		this.add_blood_overlay();
	}
	return 1;
}, false);

// atoms.dm:383
rt.def("/obj/item/proc/add_blood_overlay", function add_blood_overlay(f: Frame) {
	let blood_splatter_icon: Value = null;
	if (!(rt.initial(f, this, "icon") && rt.initial(f, this, "icon_state"))) return f.dot;
	let index: Value = this.blood_splatter_index();
	if (!(blood_splatter_icon = rt.index(GLOB.blood_splatter_icons, index))) {
		(blood_splatter_icon = icon(rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state"), null, 1)).Blend("#fff", 0);
		blood_splatter_icon.Blend(icon(rt.rsc("icons/effects/blood.dmi"), "itemblood"), 2);
		blood_splatter_icon = fcopy_rsc(blood_splatter_icon);
		rt.setAt(GLOB.blood_splatter_icons, index, blood_splatter_icon);
	}
	this.add_overlay(blood_splatter_icon);
	return f.dot;
});

// atoms.dm:396
rt.def("/obj/item/clothing/gloves/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	f.dot = parent_proc();
	this.transfer_blood = rand(2, 4);
	return f.dot;
}, false);

// atoms.dm:400
rt.def("/turf/proc/add_blood", function* add_blood(f: Frame, blood_dna: Value) {
	let B: Value = null;
	if (!(B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/splatter"), this))) {
		B = (yield* new_(T("/obj/effect/decal/cleanable/blood/splatter"), this));
	}
	B.transfer_blood_dna(blood_dna);
	return 1;
}, true);

// atoms.dm:408
rt.def("/mob/living/carbon/human/proc/add_blood", function* add_blood(f: Frame, blood_dna: Value) {
	let G: Value = null;
	if (this.wear_suit) {
		yield* this.wear_suit.add_blood(blood_dna);
		yield* this.update_inv_wear_suit();
	} else if (this.w_uniform) {
		yield* this.w_uniform.add_blood(blood_dna);
		yield* this.update_inv_w_uniform();
	}
	if (this.gloves) {
		yield* (G = this.gloves).add_blood(blood_dna);
	} else {
		this.transfer_blood_dna(blood_dna);
		this.bloody_hands = rand(2, 4);
	}
	this.update_inv_gloves();
	return 1;
}, true);

// atoms.dm:423
rt.def("/atom/proc/clean_blood", function clean_blood(f: Frame) {
	if (!rt.istype(this.blood_DNA, T("/list"))) return f.dot;
	this.blood_DNA = null;
	return 1;
});

// atoms.dm:447
rt.def("/atom/proc/isinspace", function isinspace(f: Frame) {
	if (rt.istype(rt.getStep(f, this, 0), T("/turf/open/space"))) {
		return 1;
	} else {
		return 0;
	}
});

// atoms.dm:490
rt.def("/atom/proc/HandleTurfChange", function* HandleTurfChange(f: Frame, _T: Value) {
	let a: Value = null, A: Value = null;
	for (a of each(this)) {
		yield* (A = a).HandleTurfChange(_T);
	}
	return f.dot;
}, true);

// atoms.dm:503
rt.def("/atom/proc/add_vomit_floor", function* add_vomit_floor(f: Frame, M: Value, toxvomit: Value) {
	toxvomit ??= 0;
	if (!isturf(this)) return f.dot;
	let V: Value = (yield* new_(T("/obj/effect/decal/cleanable/vomit"), this));
	if (toxvomit) {
		V.icon_state = `vomittox_${pick(1, 4)}`;
	}
	if (!M.reagents) return f.dot;
	yield* this.clear_reagents_to_vomit_pool(M, V);
	return f.dot;
}, true);

// atoms.dm:512
rt.def("/atom/proc/clear_reagents_to_vomit_pool", function* clear_reagents_to_vomit_pool(f: Frame, M: Value, V: Value) {
	let R: Value = null, nutri_check: Value = null;
	yield* M.reagents.trans_to(V, M.reagents.total_volume / 10);
	for (R of each(M.reagents.reagent_list, T("/datum/reagent"))) {
		if (rt.istype(R, T("/datum/reagent/consumable"))) {
			if ((nutri_check = R).nutriment_factor > 0) {
				yield* M.reagents.remove_reagent(R.id, R.volume);
			}
		}
	}
	return f.dot;
}, true);

// atoms.dm:522
rt.def("/atom/proc/setDir", function setDir(f: Frame, newdir: Value) {
	this.dir = newdir;
	return f.dot;
});

// atoms.dm:530
rt.def("/atom/proc/on_log", function on_log(f: Frame, login: Value) {
	if (!this.loc) return f.dot;
	this.loc.on_log(login);
	return f.dot;
});

// atoms.dm:545
rt.def("/atom/proc/add_atom_colour", function add_atom_colour(f: Frame, coloration: Value, colour_priority: Value) {
	if (!this.atom_colours || !rt.len(f, this.atom_colours)) {
		this.atom_colours = list();
		this.atom_colours.len = COLOUR_PRIORITY_AMOUNT;
	}
	if (!coloration) {
		return f.dot;
	}
	if (colour_priority > rt.len(f, this.atom_colours)) {
		return f.dot;
	}
	rt.setAt(this.atom_colours, colour_priority, coloration);
	this.update_atom_colour();
	return f.dot;
});

// atoms.dm:560
rt.def("/atom/proc/remove_atom_colour", function remove_atom_colour(f: Frame, colour_priority: Value, coloration: Value) {
	if (!this.atom_colours) {
		this.atom_colours = list();
		this.atom_colours.len = COLOUR_PRIORITY_AMOUNT;
	}
	if (colour_priority > rt.len(f, this.atom_colours)) {
		return f.dot;
	}
	if (coloration && rt.index(this.atom_colours, colour_priority) != coloration) {
		return f.dot;
	}
	rt.setAt(this.atom_colours, colour_priority, null);
	this.update_atom_colour();
	return f.dot;
});

// atoms.dm:576
rt.def("/atom/proc/update_atom_colour", function update_atom_colour(f: Frame) {
	let C: Value = null, L: Value = null;
	if (!this.atom_colours) {
		this.atom_colours = list();
		this.atom_colours.len = COLOUR_PRIORITY_AMOUNT;
	}
	this.color = null;
	for (C of each(this.atom_colours)) {
		if (rt.istype(C, T("/list"))) {
			if (rt.len(f, (L = C))) {
				this.color = L;
				return f.dot;
			}
		} else if (C) {
			this.color = C;
			return f.dot;
		}
	}
	return f.dot;
});

// atoms.dm:591
rt.def("/atom/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (!GLOB.Debug2) {
		this.admin_spawned = 1;
	}
	f.dot = parent_proc();
	if (var_name === "color") {
		this.add_atom_colour(this.color, 1);
	}
	return f.dot;
}, false);

// atoms.dm:599
rt.def("/atom/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	let curturf: Value = null;
	f.dot = parent_proc();
	f.dot += "---";
	if (curturf = rt.getStep(f, this, 0)) {
		rt.setAt(f.dot, "Jump to", `?_src_=holder;adminplayerobservecoodjump=1;X=${curturf.x};Y=${curturf.y};Z=${curturf.z}`);
	}
	rt.setAt(f.dot, "Add reagent", fmt("?_src_=vars;addreagent=＃", [this]));
	rt.setAt(f.dot, "Trigger EM pulse", fmt("?_src_=vars;emp=＃", [this]));
	rt.setAt(f.dot, "Trigger explosion", fmt("?_src_=vars;explode=＃", [this]));
	return f.dot;
});
