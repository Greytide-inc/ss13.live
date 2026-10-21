// From code/game/atoms.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /atom/proc/New  (code/game/atoms.dm:35)  may sleep
rt.def("/atom/proc/New", function* New(f: Frame) {
	let do_initialize: Value = null, created: Value = null;
	f.vars = () => [do_initialize, created];
	if ((truthy(rt.gl("use_preloader")) && isEqual(rt.fv(f, "type", live(f.src)), rt.fv(f, "target_path", rt.gl("_preloader"))))) {
		yield* g.callName(f, rt.gl("_preloader"), "load", [live(f.src)]);
	}
	if (rt.gt((do_initialize = rt.fv(f, "initialized", rt.gl("SSatoms"))), 0)) {
		rt.setAt(f.argsList, 1, (isEqual(live(do_initialize), 1) ? 1 : 0));
		if (truthy((yield* g.callName(f, rt.gl("SSatoms"), "InitAtom", [live(f.src), f.argsList])))) {
			return live(f.dot);
		}
	}
	if (!truthy((created = rt.fv(f, "created_atoms", rt.gl("SSatoms"))))) return f.dot;
	created = rt.modify(live(created), live(f.src), add);
	return f.dot;
}, true, { args: ["loc"] });

// /atom/proc/Initialize  (code/game/atoms.dm:66)
rt.def("/atom/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.sv(f, "initialized"))) {
		rt.call(f, P("/proc/stack_trace"), null, [fmt("Warning: ＀(＀) initialized multiple times!", [live(f.src), rt.sv(f, "type")])]);
	}
	rt.setSv(f, "initialized", 1);
	if (truthy(rt.sv(f, "color"))) {
		rt.callSrc(f, "add_atom_colour", [rt.sv(f, "color"), 4]);
	}
	if ((truthy(rt.sv(f, "light_power")) && truthy(rt.sv(f, "light_range")))) {
		rt.callSrc(f, "update_light", []);
	}
	if ((truthy(rt.sv(f, "opacity")) && truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		rt.setFv(f, "has_opaque_atom", (_T = rt.sv(f, "loc")), 1);
	}
	return 0;
});

// /atom/proc/Destroy  (code/game/atoms.dm:87)  may sleep
rt.def("/atom/proc/Destroy", function* Destroy(f: Frame) {
	let K: Value = null, AA: Value = null;
	let $e: any;
	f.vars = () => [K, AA, $e];
	if (truthy(rt.sv(f, "alternate_appearances"))) {
		K = null;
		rt.forList(f, 0, rt.sv(f, "alternate_appearances"));
		while (($e = rt.next(f, 0)) !== undefined) {
			K = $e;
			yield* g.callName(f, (AA = rt.index(rt.sv(f, "alternate_appearances"), live(K))), "remove_from_hud", [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "reagents")]);
	}
	if (truthy(rt.sv(f, "overlays"))) {
		yield* g.callName(f, rt.sv(f, "overlays"), "Cut", []);
	}
	if (truthy(rt.sv(f, "priority_overlays"))) {
		yield* g.callName(f, rt.sv(f, "priority_overlays"), "Cut", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "light")]);
	rt.setSv(f, "light", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /atom/proc/CanPass  (code/game/atoms.dm:106)
rt.def("/atom/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 1.5;
	}
	return ((!truthy(rt.sv(f, "density")) ? 1 : 0) || (!truthy(live(height)) ? 1 : 0));
});

// /atom/proc/onCentcom  (code/game/atoms.dm:109)
rt.def("/atom/proc/onCentcom", function onCentcom(f: Frame) {
	let _T: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, A, M, $e];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return 0;
	}
	if (isEqual(rt.fv(f, "z", live(_T)), 11)) {
		A = null;
		rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (truthy((rt.isIn(f, ((isEqual(rt.gv(f, "launch_status", (M = live(A))), 3) ? 1 : 0) && live(_T)), rt.fv(f, "areaInstance", live(M))) ? 1 : 0))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
	}
	if (!isEqual(rt.fv(f, "z", live(_T)), 1)) {
		return 0;
	}
	A = null;
	rt.forList(f, 0, rt.fv(f, "mobile", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.isIn(f, ((isEqual(rt.gv(f, "launch_status", (M = live(A))), 1) ? 1 : 0) && live(_T)), rt.fv(f, "areaInstance", live(M))) ? 1 : 0))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return (rt.istype(rt.fv(f, "loc", live(_T)), T("/area/centcom")) ? 1 : 0);
});

// /atom/proc/onSyndieBase  (code/game/atoms.dm:133)
rt.def("/atom/proc/onSyndieBase", function onSyndieBase(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return 0;
	}
	if (!isEqual(rt.fv(f, "z", live(_T)), 1)) {
		return 0;
	}
	if ((truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/shuttle/syndicate")) ? 1 : 0)) || truthy((rt.istype(rt.fv(f, "loc", live(_T)), T("/area/syndicate_mothership")) ? 1 : 0)))) {
		return 1;
	}
	return 0;
});

// /atom/proc/attack_hulk  (code/game/atoms.dm:147)  may sleep
rt.def("/atom/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!truthy(live(does_attack_animation))) return f.dot;
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(f.src), "punched", "hulk powers"]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "smash"]);
	return f.dot;
}, true);

// /atom/proc/CheckParts  (code/game/atoms.dm:152)  may sleep
rt.def("/atom/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let A: Value = null, M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [parts_list, A, M, L, $e];
	A = null;
	rt.forList(f, 0, live(parts_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/datum/reagent")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "reagents"))) {
				rt.setSv(f, "reagents", (yield* g.new_(f, T("/datum/reagents"), [])));
			}
			yield* g.callName(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), "Add", [live(A)]);
			yield* g.callName(f, rt.sv(f, "reagents"), "conditional_update", []);
		} else {
			if (truthy((rt.istype(live(A), T("/atom/movable")) ? 1 : 0))) {
				if (truthy((rt.istype(rt.gv(f, "loc", (M = live(A))), T("/mob/living")) ? 1 : 0))) {
					yield* g.callName(f, (L = rt.fv(f, "loc", live(M))), "transferItemToLoc", [live(M), live(f.src)]);
				} else {
					yield* g.callName(f, live(M), "forceMove", [live(f.src)]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/proc/assume_air  (code/game/atoms.dm:167)  may sleep
rt.def("/atom/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	f.vars = () => [giver];
	yield* g.call(f, P("/proc/qdel"), null, [live(giver)]);
	return null;
}, true);

// /atom/proc/remove_air  (code/game/atoms.dm:171)
rt.def("/atom/proc/remove_air", function remove_air(f: Frame, amount: Value) {
	return null;
});

// /atom/proc/return_air  (code/game/atoms.dm:175)
rt.def("/atom/proc/return_air", function return_air(f: Frame) {
	if (truthy(rt.sv(f, "loc"))) {
		return rt.callName(f, rt.sv(f, "loc"), "return_air", []);
	}
	return null;
});

// /atom/proc/is_open_container  (code/game/atoms.dm:190)
rt.def("/atom/proc/is_open_container", function is_open_container(f: Frame) {
	return rt.bitAnd(rt.sv(f, "container_type"), 4096);
});

// /atom/proc/is_transparent  (code/game/atoms.dm:193)
rt.def("/atom/proc/is_transparent", function is_transparent(f: Frame) {
	return rt.bitAnd(rt.sv(f, "container_type"), 8192);
});

// /atom/proc/is_injectable  (code/game/atoms.dm:196)  may sleep
rt.def("/atom/proc/is_injectable", function* is_injectable(f: Frame, allowmobs: Value) {
	let L: Value = null;
	f.vars = () => [allowmobs, L];
	if (live(allowmobs) === null) {
		allowmobs = 1;
	}
	if ((truthy((rt.istype(live(f.src), T("/mob/living")) ? 1 : 0)) && truthy(live(allowmobs)))) {
		return (yield* g.callName(f, (L = live(f.src)), "can_inject", []));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "container_type"), 4096))) {
		return 1;
	}
	return rt.bitAnd(rt.sv(f, "container_type"), 1024);
}, true);

// /atom/proc/is_drawable  (code/game/atoms.dm:204)  may sleep
rt.def("/atom/proc/is_drawable", function* is_drawable(f: Frame, allowmobs: Value) {
	f.vars = () => [allowmobs];
	if (live(allowmobs) === null) {
		allowmobs = 1;
	}
	if (truthy((yield* g.srcCall(f, "is_injectable", live(allowmobs))))) {
		return 1;
	}
	return rt.bitAnd(rt.sv(f, "container_type"), 2048);
}, true);

// /atom/proc/emp_act  (code/game/atoms.dm:218)  may sleep
rt.def("/atom/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let $0: any;
	f.vars = () => [severity, $0];
	$0 = (rt.istype(rt.sv(f, "wires"), T("/datum/wires")) ? 1 : 0);
	if (truthy($0)) {
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "no_emp_wires");
		} else {
			$0 = 0;
		}
		$0 = (!truthy($0) ? 1 : 0);
	}
	if (!truthy($0)) return f.dot;
	yield* g.callName(f, rt.sv(f, "wires"), "emp_pulse", []);
	return f.dot;
}, true);

// /atom/proc/bullet_act  (code/game/atoms.dm:222)  may sleep
rt.def("/atom/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	f.vars = () => [_P, def_zone];
	f.dot = (yield* g.callName(f, live(_P), "on_hit", [live(f.src), 0, live(def_zone)]));
	return f.dot;
}, true);

// /atom/proc/in_contents_of  (code/game/atoms.dm:225)
rt.def("/atom/proc/in_contents_of", function in_contents_of(f: Frame, container: Value) {
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(container)]))) {
		if (truthy(rt.op(f, "IsType", [], [rt.fv(f, "loc", live(f.src)), live(container)]))) {
			return 1;
		}
	} else {
		if (!truthy((rt.isIn(f, live(f.src), live(container)) ? 1 : 0))) return f.dot;
		return 1;
	}
	return f.dot;
});

// /atom/proc/search_contents_for  (code/game/atoms.dm:242)
rt.def("/atom/proc/search_contents_for", function search_contents_for(f: Frame, path: Value, filter_path: Value) {
	let found: Value = null, A: Value = null, pass: Value = null, type: Value = null;
	let $e: any;
	f.vars = () => [filter_path, found, A, pass, type, $e];
	if (live(filter_path) === null) {
		filter_path = null;
	}
	found = rt.list();
	A = null;
	rt.forList(f, 0, live(f.src), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.op(f, "IsType", [], [live(A), live(path)]))) {
			found = rt.modify(live(found), live(A), add);
		}
		if (truthy(live(filter_path))) {
			pass = 0;
			type = null;
			rt.forList(f, 1, live(filter_path));
			while (($e = rt.next(f, 1)) !== undefined) {
				type = $e;
				(pass = rt.modify(live(pass), rt.op(f, "IsType", [], [live(A), live(type)]), rt.bitOr));
			}
			rt.endFor(f, 1);
			if (!truthy(live(pass))) {
				continue;
			}
		}
		if (truthy(rt.getLen(f, rt.fv(f, "contents", live(A))))) {
			found = rt.modify(live(found), rt.callName(f, live(A), "search_contents_for", [live(path), live(filter_path)]), add);
		}
	}
	rt.endFor(f, 0);
	return live(found);
});

// /atom/proc/examine  (code/game/atoms.dm:259)
rt.def("/atom/proc/examine", function examine(f: Frame, user: Value) {
	let f_name: Value = null, R: Value = null, total_volume: Value = null, R_2: Value = null;
	let $e: any;
	f.vars = () => [f_name, R, total_volume, R_2, $e];
	f_name = fmt("＇！.", [live(f.src)]);
	if ((truthy(rt.fv(f, "blood_DNA", live(f.src))) && !truthy((rt.istype(live(f.src), T("/obj/effect/decal")) ? 1 : 0)))) {
		if (isEqual(rt.sv(f, "gender"), "plural")) {
			f_name = "some ";
		} else {
			f_name = "a ";
		}
		f_name = rt.modify(live(f_name), fmt("<span class='danger'>blood-stained</span> ＀!", [rt.sv(f, "name")]), add);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ That's ＀", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f_name)])]);
	if (truthy(rt.sv(f, "desc"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "desc")]);
	}
	if (!(truthy(rt.sv(f, "reagents")) && (truthy(rt.callSrc(f, "is_open_container", [])) || truthy(rt.callSrc(f, "is_transparent", []))))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "It contains:"]);
	if (truthy(rt.getLen(f, rt.fv(f, "reagent_list", rt.sv(f, "reagents"))))) {
		if (truthy(rt.callName(f, live(user), "can_see_reagents", []))) {
			R = null;
			rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ units of ＀", [rt.fv(f, "volume", live(R)), rt.fv(f, "name", live(R))])]);
			}
			rt.endFor(f, 0);
		} else {
			total_volume = 0;
			R_2 = null;
			rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R_2 = $e;
				total_volume = rt.modify(live(total_volume), rt.fv(f, "volume", live(R_2)), add);
			}
			rt.endFor(f, 0);
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ units of various reagents", [live(total_volume)])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Nothing."]);
	}
	return f.dot;
});

// /atom/proc/ex_act  (code/game/atoms.dm:296)  may sleep
rt.def("/atom/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	f.vars = () => [severity, target];
	yield* g.srcCall(f, "contents_explosion", live(severity), live(target));
	return f.dot;
}, true, { waitfor: false });

// /atom/proc/hitby  (code/game/atoms.dm:305)  may sleep
rt.def("/atom/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value, blocked: Value) {
	f.vars = () => [AM, skipcatch, hitpush, blocked];
	if (!(truthy(rt.sv(f, "density")) && !truthy((yield* g.srcCall(f, "has_gravity", live(AM)))))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/hitby_react"), live(AM)])), 2]);
	return f.dot;
}, true);

// /atom/proc/hitby_react  (code/game/atoms.dm:309)  may sleep
rt.def("/atom/proc/hitby_react", function* hitby_react(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (!(truthy(live(AM)) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(AM))]))))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(AM), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(AM)), 180]))]);
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }] });

// /datum/controller/global_vars/proc/InitGlobalblood_splatter_icons  (code/game/atoms.dm:312)
rt.def("/datum/controller/global_vars/proc/InitGlobalblood_splatter_icons", function InitGlobalblood_splatter_icons(f: Frame) {
	rt.setGl("blood_splatter_icons", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "blood_splatter_icons", add);
	return f.dot;
});

// /atom/proc/blood_splatter_index  (code/game/atoms.dm:315)
rt.def("/atom/proc/blood_splatter_index", function blood_splatter_index(f: Frame) {
	return fmt("＃-＀", [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state")]);
});

// /mob/living/proc/get_blood_dna_list  (code/game/atoms.dm:319)
rt.def("/mob/living/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	if (!isEqual(rt.callSrc(f, "get_blood_id", []), "blood")) {
		return live(f.dot);
	}
	return rt.alist(f, ["ANIMAL DNA", "Y-"]);
});

// /mob/living/carbon/proc/get_blood_dna_list  (code/game/atoms.dm:324)
rt.def("/mob/living/carbon/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	let blood_dna: Value = null;
	f.vars = () => [blood_dna];
	if (!isEqual(rt.callSrc(f, "get_blood_id", []), "blood")) {
		return live(f.dot);
	}
	blood_dna = rt.list();
	if (truthy(rt.sv(f, "dna"))) {
		rt.setAt(live(blood_dna), rt.fv(f, "unique_enzymes", rt.sv(f, "dna")), rt.fv(f, "blood_type", rt.sv(f, "dna")));
	} else {
		rt.setAt(live(blood_dna), "UNKNOWN DNA", "X*");
	}
	return live(blood_dna);
});

// /mob/living/carbon/alien/proc/get_blood_dna_list  (code/game/atoms.dm:334)
rt.def("/mob/living/carbon/alien/proc/get_blood_dna_list", function get_blood_dna_list(f: Frame) {
	return rt.alist(f, ["UNKNOWN DNA", "X*"]);
});

// /atom/proc/transfer_mob_blood_dna  (code/game/atoms.dm:339)
rt.def("/atom/proc/transfer_mob_blood_dna", function transfer_mob_blood_dna(f: Frame, L: Value) {
	let new_blood_dna: Value = null, old_length: Value = null;
	f.vars = () => [new_blood_dna, old_length];
	if (!truthy((new_blood_dna = rt.callName(f, live(L), "get_blood_dna_list", [])))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "blood_DNA"))) {
		rt.setSv(f, "blood_DNA", rt.list());
	}
	old_length = rt.len(f, rt.sv(f, "blood_DNA"));
	(rt.modSrcVar(f, "blood_DNA", live(new_blood_dna), rt.bitOr));
	if (isEqual(rt.len(f, rt.sv(f, "blood_DNA")), live(old_length))) {
		return 0;
	}
	return 1;
});

// /atom/proc/transfer_blood_dna  (code/game/atoms.dm:352)
rt.def("/atom/proc/transfer_blood_dna", function transfer_blood_dna(f: Frame, blood_dna: Value) {
	let old_length: Value = null;
	f.vars = () => [old_length];
	if (!truthy(rt.sv(f, "blood_DNA"))) {
		rt.setSv(f, "blood_DNA", rt.list());
	}
	old_length = rt.len(f, rt.sv(f, "blood_DNA"));
	(rt.modSrcVar(f, "blood_DNA", live(blood_dna), rt.bitOr));
	if (!rt.gt(rt.len(f, rt.sv(f, "blood_DNA")), live(old_length))) return f.dot;
	return 1;
});

// /atom/proc/add_mob_blood  (code/game/atoms.dm:362)  may sleep
rt.def("/atom/proc/add_mob_blood", function* add_mob_blood(f: Frame, M: Value) {
	let blood_dna: Value = null;
	f.vars = () => [M, blood_dna];
	if (!truthy((blood_dna = (yield* g.callName(f, live(M), "get_blood_dna_list", []))))) {
		return 0;
	}
	return (yield* g.srcCall(f, "add_blood", live(blood_dna)));
}, true);

// /obj/proc/add_blood  (code/game/atoms.dm:372)
rt.def("/obj/proc/add_blood", function add_blood(f: Frame, blood_dna: Value) {
	return rt.callSrc(f, "transfer_blood_dna", [live(blood_dna)]);
});

// /obj/item/proc/add_blood  (code/game/atoms.dm:375)
rt.def("/obj/item/proc/add_blood", function add_blood(f: Frame) {
	let blood_count: Value = null;
	let $0: any;
	f.vars = () => [blood_count, $0];
	if (!truthy(rt.sv(f, "blood_DNA"))) {
		$0 = 0;
	} else {
		$0 = rt.len(f, rt.sv(f, "blood_DNA"));
	}
	blood_count = $0;
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!truthy(live(blood_count))) {
		rt.callSrc(f, "add_blood_overlay", []);
	}
	return 1;
}, false, { args: ["blood_dna"] });

// /obj/item/proc/add_blood_overlay  (code/game/atoms.dm:383)
rt.def("/obj/item/proc/add_blood_overlay", function add_blood_overlay(f: Frame) {
	let index: Value = null, blood_splatter_icon: Value = null;
	f.vars = () => [index, blood_splatter_icon];
	if (!(truthy(rt.initial(f, live(f.src), "icon")) && truthy(rt.initial(f, live(f.src), "icon_state")))) return f.dot;
	index = rt.callSrc(f, "blood_splatter_index", []);
	if (!truthy((blood_splatter_icon = rt.index(rt.gl("blood_splatter_icons"), live(index))))) {
		rt.callName(f, (blood_splatter_icon = rt.call(f, P("/proc/icon"), null, [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state"), null, 1])), "Blend", ["#fff", 0]);
		rt.callName(f, live(blood_splatter_icon), "Blend", [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/blood.dmi"), "itemblood"]), 2]);
		blood_splatter_icon = rt.call(f, P("/proc/fcopy_rsc"), null, [live(blood_splatter_icon)]);
		rt.setAt(rt.gl("blood_splatter_icons"), live(index), live(blood_splatter_icon));
	}
	rt.callSrc(f, "add_overlay", [live(blood_splatter_icon)]);
	return f.dot;
});

// /obj/item/clothing/gloves/proc/add_blood  (code/game/atoms.dm:396)
rt.def("/obj/item/clothing/gloves/proc/add_blood", function add_blood(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "transfer_blood", rt.call(f, P("/proc/rand"), null, [2, 4]));
	return f.dot;
}, false, { args: ["blood_dna"] });

// /turf/proc/add_blood  (code/game/atoms.dm:400)  may sleep
rt.def("/turf/proc/add_blood", function* add_blood(f: Frame, blood_dna: Value) {
	let B: Value = null;
	f.vars = () => [blood_dna, B];
	if (!truthy((B = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/splatter"), live(f.src))))) {
		B = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/splatter"), [live(f.src)]));
	}
	yield* g.callName(f, live(B), "transfer_blood_dna", [live(blood_dna)]);
	return 1;
}, true);

// /mob/living/carbon/human/proc/add_blood  (code/game/atoms.dm:408)  may sleep
rt.def("/mob/living/carbon/human/proc/add_blood", function* add_blood(f: Frame, blood_dna: Value) {
	let G: Value = null;
	f.vars = () => [blood_dna, G];
	if (truthy(rt.sv(f, "wear_suit"))) {
		yield* g.callName(f, rt.sv(f, "wear_suit"), "add_blood", [live(blood_dna)]);
		yield* g.srcCall(f, "update_inv_wear_suit");
	} else {
		if (truthy(rt.sv(f, "w_uniform"))) {
			yield* g.callName(f, rt.sv(f, "w_uniform"), "add_blood", [live(blood_dna)]);
			yield* g.srcCall(f, "update_inv_w_uniform");
		}
	}
	if (truthy(rt.sv(f, "gloves"))) {
		yield* g.callName(f, (G = rt.sv(f, "gloves")), "add_blood", [live(blood_dna)]);
	} else {
		yield* g.srcCall(f, "transfer_blood_dna", live(blood_dna));
		rt.setSv(f, "bloody_hands", (yield* g.call(f, P("/proc/rand"), null, [2, 4])));
	}
	yield* g.srcCall(f, "update_inv_gloves");
	return 1;
}, true);

// /atom/proc/clean_blood  (code/game/atoms.dm:423)
rt.def("/atom/proc/clean_blood", function clean_blood(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "blood_DNA"), T("/list")) ? 1 : 0))) return f.dot;
	rt.setSv(f, "blood_DNA", null);
	return 1;
});

// /atom/proc/get_global_map_pos  (code/game/atoms.dm:431)
rt.def("/atom/proc/get_global_map_pos", function get_global_map_pos(f: Frame) {
	let cur_x: Value = null, cur_y: Value = null, y_arr: Value = null;
	f.vars = () => [cur_x, cur_y, y_arr];
	if ((!truthy((rt.istype(rt.gl("global_map"), T("/list")) ? 1 : 0)) || truthy(rt.call(f, P("/proc/isemptylist"), null, [rt.gl("global_map")])))) {
		return live(f.dot);
	}
	cur_x = null;
	cur_y = null;
	y_arr = null;
	cur_x = 1;
	while (rt.le(live(cur_x), rt.len(f, rt.gl("global_map")))) {
		if (truthy((cur_y = rt.callName(f, (y_arr = rt.index(rt.gl("global_map"), live(cur_x))), "Find", [rt.fv(f, "z", live(f.src))])))) {
			break;
		}
		cur_x = rt.inc(live(cur_x), 1);
	}
	if ((truthy(live(cur_x)) && truthy(live(cur_y)))) {
		return rt.alist(f, ["x", live(cur_x), "y", live(cur_y)]);
	}
	return 0;
});

// /atom/proc/isinspace  (code/game/atoms.dm:447)
rt.def("/atom/proc/isinspace", function isinspace(f: Frame) {
	if (truthy((rt.istype(rt.getStep(f, live(f.src), 0), T("/turf/open/space")) ? 1 : 0))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /atom/proc/HandleTurfChange  (code/game/atoms.dm:490)  may sleep
rt.def("/atom/proc/HandleTurfChange", function* HandleTurfChange(f: Frame, _T: Value) {
	let a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [_T, a, A, $e];
	a = null;
	rt.forList(f, 0, live(f.src));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		yield* g.callName(f, (A = live(a)), "HandleTurfChange", [live(_T)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/proc/add_vomit_floor  (code/game/atoms.dm:503)  may sleep
rt.def("/atom/proc/add_vomit_floor", function* add_vomit_floor(f: Frame, M: Value, toxvomit: Value) {
	let V: Value = null;
	f.vars = () => [M, toxvomit, V];
	if (live(toxvomit) === null) {
		toxvomit = 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.src)])))) return f.dot;
	V = (yield* g.new_(f, T("/obj/effect/decal/cleanable/vomit"), [live(f.src)]));
	if (truthy(live(toxvomit))) {
		rt.setFv(f, "icon_state", live(V), fmt("vomittox_＀", [rt.op(f, "PickUnweighted", [2], [1, 4])]));
	}
	if (!truthy(rt.fv(f, "reagents", live(M)))) return f.dot;
	yield* g.srcCall(f, "clear_reagents_to_vomit_pool", live(M), live(V));
	return f.dot;
}, true);

// /atom/proc/clear_reagents_to_vomit_pool  (code/game/atoms.dm:512)  may sleep
rt.def("/atom/proc/clear_reagents_to_vomit_pool", function* clear_reagents_to_vomit_pool(f: Frame, M: Value, V: Value) {
	let R: Value = null, nutri_check: Value = null;
	let $e: any;
	f.vars = () => [M, V, R, nutri_check, $e];
	yield* g.callName(f, rt.fv(f, "reagents", live(M)), "trans_to", [live(V), divide(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(M))), 10)]);
	R = null;
	rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(M))), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (truthy((rt.istype(live(R), T("/datum/reagent/consumable")) ? 1 : 0))) {
			if (rt.gt(rt.gv(f, "nutriment_factor", (nutri_check = live(R))), 0)) {
				yield* g.callName(f, rt.fv(f, "reagents", live(M)), "remove_reagent", [rt.fv(f, "id", live(R)), rt.fv(f, "volume", live(R))]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/proc/setDir  (code/game/atoms.dm:522)
rt.def("/atom/proc/setDir", function setDir(f: Frame, newdir: Value) {
	rt.setSv(f, "dir", live(newdir));
	return f.dot;
});

// /atom/proc/on_log  (code/game/atoms.dm:530)
rt.def("/atom/proc/on_log", function on_log(f: Frame, login: Value) {
	if (!truthy(rt.sv(f, "loc"))) return f.dot;
	rt.callName(f, rt.sv(f, "loc"), "on_log", [live(login)]);
	return f.dot;
});

// /atom/proc/add_atom_colour  (code/game/atoms.dm:545)
rt.def("/atom/proc/add_atom_colour", function add_atom_colour(f: Frame, coloration: Value, colour_priority: Value) {
	if ((!truthy(rt.sv(f, "atom_colours")) || !truthy(rt.len(f, rt.sv(f, "atom_colours"))))) {
		rt.setSv(f, "atom_colours", rt.list());
		rt.setFv(f, "len", rt.sv(f, "atom_colours"), 4);
	}
	if (!truthy(live(coloration))) {
		return live(f.dot);
	}
	if (rt.gt(live(colour_priority), rt.len(f, rt.sv(f, "atom_colours")))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "atom_colours"), live(colour_priority), live(coloration));
	rt.callSrc(f, "update_atom_colour", []);
	return f.dot;
});

// /atom/proc/remove_atom_colour  (code/game/atoms.dm:560)
rt.def("/atom/proc/remove_atom_colour", function remove_atom_colour(f: Frame, colour_priority: Value, coloration: Value) {
	if (!truthy(rt.sv(f, "atom_colours"))) {
		rt.setSv(f, "atom_colours", rt.list());
		rt.setFv(f, "len", rt.sv(f, "atom_colours"), 4);
	}
	if (rt.gt(live(colour_priority), rt.len(f, rt.sv(f, "atom_colours")))) {
		return live(f.dot);
	}
	if ((truthy(live(coloration)) && !isEqual(rt.index(rt.sv(f, "atom_colours"), live(colour_priority)), live(coloration)))) {
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "atom_colours"), live(colour_priority), null);
	rt.callSrc(f, "update_atom_colour", []);
	return f.dot;
});

// /atom/proc/update_atom_colour  (code/game/atoms.dm:576)
rt.def("/atom/proc/update_atom_colour", function update_atom_colour(f: Frame) {
	let C: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [C, L, $e];
	if (!truthy(rt.sv(f, "atom_colours"))) {
		rt.setSv(f, "atom_colours", rt.list());
		rt.setFv(f, "len", rt.sv(f, "atom_colours"), 4);
	}
	rt.setSv(f, "color", null);
	C = null;
	rt.forList(f, 0, rt.sv(f, "atom_colours"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (truthy((rt.istype(live(C), T("/list")) ? 1 : 0))) {
			if (truthy(rt.getLen(f, (L = live(C))))) {
				rt.setSv(f, "color", live(L));
				return live(f.dot);
			}
		} else {
			if (truthy(live(C))) {
				rt.setSv(f, "color", live(C));
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /atom/proc/vv_edit_var  (code/game/atoms.dm:591)
rt.def("/atom/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.gl("Debug2"))) {
		rt.setSv(f, "admin_spawned", 1);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if ($0 === "color") {
		rt.callSrc(f, "add_atom_colour", [rt.sv(f, "color"), 1]);
	}
	return f.dot;
}, false, { args: ["var_name", "var_value"] });

// /atom/proc/vv_get_dropdown  (code/game/atoms.dm:599)
rt.def("/atom/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	let curturf: Value = null;
	f.vars = () => [curturf];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), "---", add);
	if (truthy((curturf = rt.getStep(f, live(f.src), 0)))) {
		rt.setAt(live(f.dot), "Jump to", fmt("?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀", [rt.fv(f, "x", live(curturf)), rt.fv(f, "y", live(curturf)), rt.fv(f, "z", live(curturf))]));
	}
	rt.setAt(live(f.dot), "Add reagent", fmt("?_src_=vars;addreagent=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Trigger EM pulse", fmt("?_src_=vars;emp=＃", [live(f.src)]));
	rt.setAt(live(f.dot), "Trigger explosion", fmt("?_src_=vars;explode=＃", [live(f.src)]));
	return f.dot;
});
