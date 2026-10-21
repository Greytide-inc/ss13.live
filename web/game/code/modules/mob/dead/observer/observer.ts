// From code/modules/mob/dead/observer/observer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalghost_images_default  (code/modules/mob/dead/observer/observer.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_images_default", function InitGlobalghost_images_default(f: Frame) {
	rt.setGl("ghost_images_default", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_images_default", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalghost_images_simple  (code/modules/mob/dead/observer/observer.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_images_simple", function InitGlobalghost_images_simple(f: Frame) {
	rt.setGl("ghost_images_simple", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "ghost_images_simple", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalobserver_default_invisibility  (code/modules/mob/dead/observer/observer.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalobserver_default_invisibility", function InitGlobalobserver_default_invisibility(f: Frame) {
	rt.setGl("observer_default_invisibility", 60);
	rt.modSrcVar(f, "gvars_datum_init_order", "observer_default_invisibility", add);
	return f.dot;
});

rt.type(5096, "/mob/dead/observer", "/mob/dead", {
	can_reenter_corpse: null,
	hud: null,
	bootime: 0,
	started_as_observer: null,
	following: null,
	fun_verbs: 0,
	ghostimage_default: null,
	ghostimage_simple: null,
	ghostvision: 1,
	observetarget: null,
	orbit_eye: null,
	ghost_hud_enabled: 1,
	data_huds_on: 0,
	datahuds: null,
	ghost_orbit: "circle",
	hair_style: null,
	hair_color: null,
	hair_overlay: null,
	facial_hair_style: null,
	facial_hair_color: null,
	facial_hair_overlay: null,
	updatedir: 1,
	lastsetting: null,
	ghost_accs: 100,
	ghost_others: 100,
	deadchat_name: null,
	anchored: 1,
	name: "ghost",
	desc: "It's a g-g-g-g-ghooooost!",
	icon: rt.rsc("icons/mob/mob.dmi"),
	icon_state: "ghost",
	layer: 6,
	stat: 2,
	density: 0,
	canmove: 0,
	sight: 60,
	see_invisible: 60,
	see_in_dark: 100,
	invisibility: 60,
});

// /mob/dead/observer/proc/Initialize  (code/modules/mob/dead/observer/observer.dm:57)  may sleep
rt.def("/mob/dead/observer/proc/Initialize", function* Initialize(f: Frame) {
	let _T: Value = null, body: Value = null, body_human: Value = null, turfs: Value = null, v: Value = null, AA: Value = null;
	let $e: any;
	f.vars = () => [_T, body, body_human, turfs, v, AA, $e];
	yield* g.srcCall(f, "set_invisibility", rt.gl("observer_default_invisibility"));
	rt.modSrcVar(f, "verbs", P("/mob/dead/observer/proc/dead_tele"), add);
	if (truthy((rt.isIn(f, rt.sv(f, "icon_state"), rt.gl("ghost_forms_with_directions_list")) ? 1 : 0))) {
		rt.setSv(f, "ghostimage_default", (yield* g.call(f, P("/proc/image"), null, [rt.fv(f, "icon", live(f.src)), live(f.src), add(rt.fv(f, "icon_state", live(f.src)), "_nodir")])));
	} else {
		rt.setSv(f, "ghostimage_default", (yield* g.call(f, P("/proc/image"), null, [rt.fv(f, "icon", live(f.src)), live(f.src), rt.fv(f, "icon_state", live(f.src))])));
	}
	rt.setFv(f, "override", rt.sv(f, "ghostimage_default"), 1);
	(rt.modGl("ghost_images_default", rt.sv(f, "ghostimage_default"), rt.bitOr));
	rt.setSv(f, "ghostimage_simple", (yield* g.call(f, P("/proc/image"), null, [rt.fv(f, "icon", live(f.src)), live(f.src), "ghost_nodir"])));
	rt.setFv(f, "override", rt.sv(f, "ghostimage_simple"), 1);
	(rt.modGl("ghost_images_simple", rt.sv(f, "ghostimage_simple"), rt.bitOr));
	yield* g.call(f, P("/proc/updateallghostimages"), null, []);
	_T = null;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(body = rt.sv(f, "loc"))])))) {
		_T = rt.getStep(f, live(body), 0);
		rt.setSv(f, "logging", rt.fv(f, "logging", live(body)));
		rt.setSv(f, "gender", rt.fv(f, "gender", live(body)));
		if ((truthy(rt.fv(f, "mind", live(body))) && truthy(rt.gv(f, "name", rt.fv(f, "mind", live(body)))))) {
			rt.setSv(f, "name", rt.gv(f, "name", rt.fv(f, "mind", live(body))));
		} else {
			if (truthy(rt.fv(f, "real_name", live(body)))) {
				rt.setSv(f, "name", rt.fv(f, "real_name", live(body)));
			} else {
				rt.setSv(f, "name", (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.sv(f, "gender")])));
			}
		}
		rt.setSv(f, "mind", rt.fv(f, "mind", live(body)));
		if (truthy((rt.istype(live(body), T("/mob/living/carbon/human")) ? 1 : 0))) {
			body_human = live(body);
			if (truthy((rt.isIn(f, 2, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(body_human))))) ? 1 : 0))) {
				rt.setSv(f, "hair_style", rt.fv(f, "hair_style", live(body_human)));
				rt.setSv(f, "hair_color", (yield* g.srcCall(f, "brighten_color", rt.fv(f, "hair_color", live(body_human)))));
			}
			if (truthy((rt.isIn(f, 3, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(body_human))))) ? 1 : 0))) {
				rt.setSv(f, "facial_hair_style", rt.fv(f, "facial_hair_style", live(body_human)));
				rt.setSv(f, "facial_hair_color", (yield* g.srcCall(f, "brighten_color", rt.fv(f, "facial_hair_color", live(body_human)))));
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	if (!truthy(live(_T))) {
		if (truthy(rt.getLen(f, (turfs = (yield* g.call(f, P("/proc/get_area_turfs"), null, [T("/area/shuttle/arrival")])))))) {
			_T = rt.op(f, "PickUnweighted", [1], [live(turfs)]);
		} else {
			_T = rt.locate((yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxx", rt.world()), 2)])), (yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "maxy", rt.world()), 2)])), 2);
		}
	}
	rt.setSv(f, "loc", live(_T));
	if (!truthy(rt.sv(f, "name"))) {
		rt.setSv(f, "name", (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.sv(f, "gender")])));
	}
	rt.setSv(f, "real_name", rt.sv(f, "name"));
	if (!truthy(rt.sv(f, "fun_verbs"))) {
		(rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/boo"), subtract));
		(rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/possess"), subtract));
	}
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", 2, "time", 10, "loop", -1]);
	rt.modGl("dead_mob_list", live(f.src), add);
	v = null;
	rt.forList(f, 0, rt.gl("active_alternate_appearances"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		if (!truthy(live(v))) {
			continue;
		}
		yield* g.callName(f, (AA = live(v)), "onNewMob", [live(f.src)]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "grant_all_languages");
	return f.dot;
}, true);

// /mob/dead/observer/proc/narsie_act  (code/modules/mob/dead/observer/observer.dm:133)  may sleep
rt.def("/mob/dead/observer/proc/narsie_act", function* narsie_act(f: Frame) {
	let old_color: Value = null;
	f.vars = () => [old_color];
	old_color = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "color", live(old_color), "time", 10, "flags", 4]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 10]);
	return f.dot;
}, true);

// /mob/dead/observer/proc/ratvar_act  (code/modules/mob/dead/observer/observer.dm:139)  may sleep
rt.def("/mob/dead/observer/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let old_color: Value = null;
	f.vars = () => [old_color];
	old_color = rt.sv(f, "color");
	rt.setSv(f, "color", "#FAE48C");
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "color", live(old_color), "time", 10, "flags", 4]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 10]);
	return f.dot;
}, true);

// /mob/dead/observer/proc/Destroy  (code/modules/mob/dead/observer/observer.dm:145)  may sleep
rt.def("/mob/dead/observer/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("ghost_images_default", rt.sv(f, "ghostimage_default"), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ghostimage_default")]);
	rt.setSv(f, "ghostimage_default", null);
	(rt.modGl("ghost_images_simple", rt.sv(f, "ghostimage_simple"), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "ghostimage_simple")]);
	rt.setSv(f, "ghostimage_simple", null);
	yield* g.call(f, P("/proc/updateallghostimages"), null, []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/dead/observer/proc/update_icon  (code/modules/mob/dead/observer/observer.dm:166)  may sleep
rt.def("/mob/dead/observer/proc/update_icon", function* update_icon(f: Frame, new_form: Value) {
	let S: Value = null;
	f.vars = () => [new_form, S];
	if (truthy(rt.sv(f, "client"))) {
		rt.setSv(f, "ghost_accs", rt.gv(f, "ghost_accs", rt.fv(f, "prefs", rt.sv(f, "client"))));
		rt.setSv(f, "ghost_others", rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client"))));
	}
	if (truthy(rt.sv(f, "hair_overlay"))) {
		yield* g.srcCall(f, "cut_overlay", rt.sv(f, "hair_overlay"));
		rt.setSv(f, "hair_overlay", null);
	}
	if (truthy(rt.sv(f, "facial_hair_overlay"))) {
		yield* g.srcCall(f, "cut_overlay", rt.sv(f, "facial_hair_overlay"));
		rt.setSv(f, "facial_hair_overlay", null);
	}
	if (truthy(live(new_form))) {
		rt.setSv(f, "icon_state", live(new_form));
		if (truthy((rt.isIn(f, rt.sv(f, "icon_state"), rt.gl("ghost_forms_with_directions_list")) ? 1 : 0))) {
			rt.setFv(f, "icon_state", rt.sv(f, "ghostimage_default"), add(live(new_form), "_nodir"));
		} else {
			rt.setFv(f, "icon_state", rt.sv(f, "ghostimage_default"), live(new_form));
		}
	}
	if (truthy((rt.isIn(f, ((rt.ge(rt.sv(f, "ghost_accs"), 50) ? 1 : 0) && rt.sv(f, "icon_state")), rt.gl("ghost_forms_with_directions_list")) ? 1 : 0))) {
		rt.setSv(f, "updatedir", 1);
	} else {
		rt.setSv(f, "updatedir", 0);
		yield* g.srcCall(f, "setDir", 2);
	}
	if (!truthy((rt.isIn(f, ((isEqual(rt.sv(f, "ghost_accs"), 100) ? 1 : 0) && rt.sv(f, "icon_state")), rt.gl("ghost_forms_with_accessories_list")) ? 1 : 0))) return f.dot;
	S = null;
	if (truthy(rt.sv(f, "facial_hair_style"))) {
		if (truthy((S = rt.index(rt.gl("facial_hair_styles_list"), rt.sv(f, "facial_hair_style"))))) {
			rt.setSv(f, "facial_hair_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(S)), fmt("＀", [rt.fv(f, "icon_state", live(S))]), -8])));
			if (truthy(rt.sv(f, "facial_hair_color"))) {
				rt.setFv(f, "color", rt.sv(f, "facial_hair_overlay"), add("#", rt.sv(f, "facial_hair_color")));
			}
			rt.setFv(f, "alpha", rt.sv(f, "facial_hair_overlay"), 200);
			yield* g.srcCall(f, "add_overlay", rt.sv(f, "facial_hair_overlay"));
		}
	}
	if (!truthy(rt.sv(f, "hair_style"))) return f.dot;
	if (!truthy((S = rt.index(rt.gl("hair_styles_list"), rt.sv(f, "hair_style"))))) return f.dot;
	rt.setSv(f, "hair_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(S)), fmt("＀", [rt.fv(f, "icon_state", live(S))]), -8])));
	if (truthy(rt.sv(f, "hair_color"))) {
		rt.setFv(f, "color", rt.sv(f, "hair_overlay"), add("#", rt.sv(f, "hair_color")));
	}
	rt.setFv(f, "alpha", rt.sv(f, "hair_overlay"), 200);
	yield* g.srcCall(f, "add_overlay", rt.sv(f, "hair_overlay"));
	return f.dot;
}, true);

// /mob/proc/brighten_color  (code/modules/mob/dead/observer/observer.dm:220)
rt.def("/mob/proc/brighten_color", function brighten_color(f: Frame, input_color: Value) {
	let r_val: Value = null, b_val: Value = null, g_val: Value = null, color_format: Value = null;
	f.vars = () => [r_val, b_val, g_val, color_format];
	r_val = null;
	b_val = null;
	g_val = null;
	if (isEqual((color_format = rt.call(f, P("/proc/lentext"), null, [live(input_color)])), 3)) {
		r_val = multiply(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 1, 2])]), 16);
		g_val = multiply(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 2, 3])]), 16);
		b_val = multiply(rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 3, 0])]), 16);
	} else {
		if (isEqual(live(color_format), 6)) {
			r_val = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 1, 3])]);
			g_val = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 3, 5])]);
			b_val = rt.call(f, P("/proc/hex2num"), null, [rt.call(f, P("/proc/copytext"), null, [live(input_color), 5, 0])]);
		} else {
			return 0;
		}
	}
	if (rt.gt((r_val = rt.modify(live(r_val), multiply(subtract(255, live(r_val)), 0.4000000059604645), add)), 255)) {
		r_val = 255;
	}
	if (rt.gt((g_val = rt.modify(live(g_val), multiply(subtract(255, live(g_val)), 0.4000000059604645), add)), 255)) {
		g_val = 255;
	}
	if (rt.gt((b_val = rt.modify(live(b_val), multiply(subtract(255, live(b_val)), 0.4000000059604645), add)), 255)) {
		b_val = 255;
	}
	return add(add(rt.call(f, P("/proc/num2hex"), null, [live(r_val), 2]), rt.call(f, P("/proc/num2hex"), null, [live(g_val), 2])), rt.call(f, P("/proc/num2hex"), null, [live(b_val), 2]));
});

// /mob/proc/ghostize  (code/modules/mob/dead/observer/observer.dm:251)  may sleep
rt.def("/mob/proc/ghostize", function* ghostize(f: Frame, can_reenter_corpse: Value) {
	let ghost: Value = null;
	f.vars = () => [can_reenter_corpse, ghost];
	if (live(can_reenter_corpse) === null) {
		can_reenter_corpse = 1;
	}
	if (!truthy(rt.sv(f, "key"))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/cmptext"), null, [(yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "key"), 1, 2])), "@"])))) return f.dot;
	ghost = (yield* g.new_(f, T("/mob/dead/observer"), [live(f.src)]));
	yield* g.callName(f, rt.gl("SStgui"), "on_transfer", [live(f.src), live(ghost)]);
	rt.setFv(f, "can_reenter_corpse", live(ghost), live(can_reenter_corpse));
	rt.setFv(f, "key", live(ghost), rt.sv(f, "key"));
	return live(ghost);
}, true);

// /mob/living/verb/ghost  (code/modules/mob/dead/observer/observer.dm:266)  may sleep
rt.def("/mob/living/verb/ghost", function* ghost(f: Frame) {
	let response: Value = null;
	f.vars = () => [response];
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "succumb");
	}
	if (isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "ghostize", 1);
	} else {
		if (!isEqual((response = (yield* g.call(f, P("/proc/alert"), null, [live(f.src), "Are you -sure- you want to ghost?\n(You are alive. If you ghost whilst still alive you may not play again this round! You can't change your mind so choose wisely!!)", "Are you sure you want to ghost?", "Ghost", "Stay in body"]))), "Ghost")) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "ghostize", 0);
	}
	return live(f.dot);
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// /mob/dead/observer/proc/Move  (code/modules/mob/dead/observer/observer.dm:280)  may sleep
rt.def("/mob/dead/observer/proc/Move", function* Move(f: Frame, NewLoc: Value, direct: Value) {
	let oldloc: Value = null;
	f.vars = () => [NewLoc, direct, oldloc];
	if (truthy(rt.sv(f, "updatedir"))) {
		yield* g.srcCall(f, "setDir", live(direct));
	}
	oldloc = rt.sv(f, "loc");
	if (truthy(live(NewLoc))) {
		rt.setSv(f, "loc", live(NewLoc));
		yield* g.srcCall(f, "update_parallax_contents");
	} else {
		rt.setSv(f, "loc", rt.getStep(f, live(f.src), 0));
		if ((truthy(rt.bitAnd(live(direct), 1)) && rt.lt(rt.sv(f, "y"), rt.fv(f, "maxy", rt.world())))) {
			rt.incSrcVar(f, "y", 1, true);
		} else {
			if ((truthy(rt.bitAnd(live(direct), 2)) && rt.gt(rt.sv(f, "y"), 1))) {
				rt.incSrcVar(f, "y", -1, true);
			}
		}
		if ((truthy(rt.bitAnd(live(direct), 4)) && rt.lt(rt.sv(f, "x"), rt.fv(f, "maxx", rt.world())))) {
			rt.incSrcVar(f, "x", 1, true);
		} else {
			if ((truthy(rt.bitAnd(live(direct), 8)) && rt.gt(rt.sv(f, "x"), 1))) {
				rt.incSrcVar(f, "x", -1, true);
			}
		}
	}
	yield* g.srcCall(f, "Moved", live(oldloc), live(direct));
	return f.dot;
}, true);

// /mob/dead/observer/proc/Stat  (code/modules/mob/dead/observer/observer.dm:303)  may sleep
rt.def("/mob/dead/observer/proc/Stat", function* Stat(f: Frame) {
	let G: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [G, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) return f.dot;
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy(rt.fv(f, "is_dominating", live(G)))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("＀ Gang Takeover: ＀", [rt.fv(f, "name", live(G)), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, live(G), "domination_time_remaining", [])), 0]))])]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "message_sent", (B = rt.fv(f, "mode", rt.gl("SSticker")))))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Blobs to Blob Win: ＀/＀", [rt.len(f, rt.gl("blobs_legit")), rt.fv(f, "blobwincount", live(B))])]);
	return f.dot;
}, true);

// /mob/dead/observer/verb/reenter_corpse  (code/modules/mob/dead/observer/observer.dm:317)  may sleep
rt.def("/mob/dead/observer/verb/reenter_corpse", function* reenter_corpse(f: Frame) {
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "current", rt.sv(f, "mind"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You have no body.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "can_reenter_corpse"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You cannot re-enter your body.</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.gv(f, "key", rt.fv(f, "current", rt.sv(f, "mind")))) && !isEqual((yield* g.call(f, P("/proc/copytext"), null, [rt.gv(f, "key", rt.fv(f, "current", rt.sv(f, "mind"))), 1, 2])), "@"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Another consciousness is in your body...It is resisting you.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "client"), "change_view", [(yield* g.callName(f, rt.sv(f, "client"), "default_view", []))]);
	yield* g.callName(f, rt.gl("SStgui"), "on_transfer", [live(f.src), rt.fv(f, "current", rt.sv(f, "mind"))]);
	rt.setFv(f, "key", rt.fv(f, "current", rt.sv(f, "mind")), rt.sv(f, "key"));
	return 1;
}, true, { verb: { name: "Re-enter Corpse", category: "Ghost" } });

// /mob/dead/observer/proc/notify_cloning  (code/modules/mob/dead/observer/observer.dm:335)  may sleep
rt.def("/mob/dead/observer/proc/notify_cloning", function* notify_cloning(f: Frame, message: Value, sound: Value, source: Value, flashwindow: Value) {
	let A: Value = null, old_layer: Value = null, old_plane: Value = null;
	f.vars = () => [message, sound, source, flashwindow, A, old_layer, old_plane];
	if (live(flashwindow) === null) {
		flashwindow = 1;
	}
	if (truthy(live(flashwindow))) {
		yield* g.call(f, P("/proc/window_flash"), null, [rt.sv(f, "client")]);
	}
	if (truthy(live(message))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='ghostalert'>＀</span>", [live(message)])]);
		if (truthy(live(source))) {
			if (truthy((A = (yield* g.srcCall(f, "throw_alert", fmt("＃_notify_cloning", [live(source)]), T("/obj/screen/alert/notify_cloning")))))) {
				if (((truthy(rt.sv(f, "client")) && truthy(rt.fv(f, "prefs", rt.sv(f, "client")))) && truthy(rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))))) {
					rt.setFv(f, "icon", live(A), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))])));
				}
				rt.setFv(f, "desc", live(A), live(message));
				old_layer = rt.fv(f, "layer", live(source));
				old_plane = rt.fv(f, "plane", live(source));
				rt.setFv(f, "layer", live(source), -1);
				rt.setFv(f, "plane", live(source), -32767);
				yield* g.callName(f, live(A), "add_overlay", [live(source)]);
				rt.setFv(f, "layer", live(source), live(old_layer));
				rt.setFv(f, "plane", live(source), live(old_plane));
			}
		}
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='ghostalert'><a href=?src=＃;reenter=1>(Click to re-enter)</a></span>", [live(f.src)])]);
	if (!truthy(live(sound))) return f.dot;
	rt.op(f, "Output", [], [live(f.src), (yield* g.call(f, P("/proc/sound"), null, [live(sound)]))], false);
	return f.dot;
}, true);

// /mob/dead/observer/proc/dead_tele  (code/modules/mob/dead/observer/observer.dm:359)  may sleep
rt.def("/mob/dead/observer/proc/dead_tele", function* dead_tele(f: Frame) {
	let filtered: Value = null, V: Value = null, A: Value = null, thearea: Value = null, L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [filtered, V, A, thearea, L, _T, $e];
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Not when you're not dead!"]);
		return live(f.dot);
	}
	filtered = rt.list();
	V = null;
	rt.forList(f, 0, rt.gl("sortedAreas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (!truthy(rt.gv(f, "hidden", (A = live(V))))) {
			filtered = rt.modify(live(filtered), live(A), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((thearea = (yield* g.op(f, "Prompt", [1], [null, null, "BOOYEA", "Area to jump to", live(filtered)]))))) {
		return live(f.dot);
	}
	L = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		L = rt.modify(live(L), live(_T), add);
	}
	rt.endFor(f, 0);
	if ((!truthy(live(L)) || !truthy(rt.len(f, live(L))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "No area available."]);
	}
	rt.setFv(f, "loc", live(f.usr), rt.op(f, "PickUnweighted", [1], [live(L)]));
	yield* g.srcCall(f, "update_parallax_contents");
	return f.dot;
}, true, { verb: { name: "Teleport", category: "Ghost", desc: "Teleport to a location" } });

// /mob/dead/observer/verb/follow  (code/modules/mob/dead/observer/observer.dm:387)  may sleep
rt.def("/mob/dead/observer/verb/follow", function* follow(f: Frame) {
	let mobs: Value = null, input: Value = null, target: Value = null;
	f.vars = () => [mobs, input, target];
	mobs = (yield* g.call(f, P("/proc/getpois"), null, ["skip_mindless", 1], rt.Args.Named));
	input = (yield* g.op(f, "Prompt", [1], [null, null, "Haunt", "Please, select a mob!", live(mobs)]));
	yield* g.srcCall(f, "ManualFollow", (target = rt.index(live(mobs), live(input))));
	return f.dot;
}, true, { verb: { name: "Orbit", category: "Ghost", desc: "Follow and orbit a mob." } });

// /mob/dead/observer/proc/ManualFollow  (code/modules/mob/dead/observer/observer.dm:394)  may sleep
rt.def("/mob/dead/observer/proc/ManualFollow", function* ManualFollow(f: Frame, target: Value) {
	let I: Value = null, orbitsize: Value = null, rot_seg: Value = null;
	let $0: any;
	f.vars = () => [target, I, orbitsize, rot_seg, $0];
	if (!truthy((rt.istype(live(target), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	I = (yield* g.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(target)), rt.fv(f, "icon_state", live(target)), rt.fv(f, "dir", live(target))]));
	(orbitsize = rt.modify(live(orbitsize), multiply(divide((orbitsize = multiply(add((yield* g.callName(f, live(I), "Width", [])), (yield* g.callName(f, live(I), "Height", []))), 0.5)), rt.fv(f, "icon_size", rt.world())), multiply(rt.fv(f, "icon_size", rt.world()), 0.25)), subtract));
	if ((truthy(rt.sv(f, "orbiting")) && !isEqual(rt.fv(f, "orbiting", rt.sv(f, "orbiting")), live(target)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='notice'>Now orbiting ＀.</span>", [live(target)])]);
	}
	rot_seg = null;
	$0 = rt.sv(f, "ghost_orbit");
	if ($0 === "triangle") {
		rot_seg = 3;
	} else if ($0 === "square") {
		rot_seg = 4;
	} else if ($0 === "pentagon") {
		rot_seg = 5;
	} else if ($0 === "hexagon") {
		rot_seg = 6;
	} else {
		rot_seg = 36;
	}
	// tg_js: ghosts orbit clockwise (tg passed 0 here: anti-clockwise).
	yield* g.srcCall(f, "orbit", live(target), live(orbitsize), 1, 20, live(rot_seg));
	return f.dot;
}, true);

// /mob/dead/observer/proc/orbit  (code/modules/mob/dead/observer/observer.dm:422)  may sleep
rt.def("/mob/dead/observer/proc/orbit", function* orbit(f: Frame) {
	yield* g.srcCall(f, "setDir", 2);
	yield* g.callSuper(f, [], rt.Args.Same);
	// pt-orbit (hand-edited): the camera follows the orbited object itself (like admin possess), so it glides with the object instead of
	// jumping tile to tile each time SSorbit moves the ghost. stop_orbit puts the eye back on the ghost.
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "orbiting")) && !truthy(rt.sv(f, "observetarget")))) {
		rt.setSv(f, "orbit_eye", rt.fv(f, "orbiting", rt.sv(f, "orbiting")));
		rt.setFv(f, "eye", rt.sv(f, "client"), rt.sv(f, "orbit_eye"));
	}
	return f.dot;
}, true);

// /mob/dead/observer/proc/stop_orbit  (code/modules/mob/dead/observer/observer.dm:426)  may sleep
rt.def("/mob/dead/observer/proc/stop_orbit", function* stop_orbit(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "orbit_eye"))) { // pt-orbit (hand-edited): the camera goes back to the ghost
		if ((truthy(rt.sv(f, "client")) && isEqual(rt.fv(f, "eye", rt.sv(f, "client")), rt.sv(f, "orbit_eye")))) {
			rt.setFv(f, "eye", rt.sv(f, "client"), live(f.src));
		}
		rt.setSv(f, "orbit_eye", null);
	}
	rt.setSv(f, "pixel_y", 0);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", 2, "time", 10, "loop", -1]);
	return f.dot;
}, true);

// /mob/dead/observer/verb/jumptomob  (code/modules/mob/dead/observer/observer.dm:436)  may sleep
rt.def("/mob/dead/observer/verb/jumptomob", function* jumptomob(f: Frame) {
	let dest: Value = null, target: Value = null, M: Value = null, A: Value = null, _T: Value = null;
	f.vars = () => [dest, target, M, A, _T];
	if (!truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) return f.dot;
	dest = rt.list();
	target = null;
	dest = rt.modify(live(dest), (yield* g.call(f, P("/proc/getpois"), null, ["mobs_only", 1], rt.Args.Named)), add);
	if (!truthy((target = (yield* g.op(f, "Prompt", [1], [null, null, "Jump to Mob", "Please, select a player!", live(dest)]))))) {
		return live(f.dot);
	} else {
		M = rt.index(live(dest), live(target));
		A = live(f.src);
		if ((truthy((_T = rt.getStep(f, live(M), 0))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
			rt.setFv(f, "loc", live(A), live(_T));
			yield* g.callName(f, live(A), "update_parallax_contents", []);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), "This mob is not located in the game world."]);
		}
	}
	return f.dot;
}, true, { verb: { name: "Jump to Mob", category: "Ghost", desc: "Teleport to a mob" } });

// /mob/dead/observer/verb/change_view_range  (code/modules/mob/dead/observer/observer.dm:463)  may sleep
rt.def("/mob/dead/observer/verb/change_view_range", function* change_view_range(f: Frame) {
	let max_view: Value = null, views: Value = null, i: Value = null, new_view: Value = null;
	let $0: any, $e: any;
	f.vars = () => [max_view, views, i, new_view, $0, $e];
	if (truthy(rt.gv(f, "unlock_content", rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		$0 = 14;
	} else {
		$0 = 10;
	}
	max_view = $0;
	if (truthy((yield* g.callName(f, rt.sv(f, "client"), "is_default_view", [])))) {
		views = rt.list();
		i = null;
		rt.forRange(f, 0, 1, live(max_view), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			(views = rt.modify(live(views), live(i), rt.bitOr));
		}
		rt.endFor(f, 0);
		if (truthy((new_view = (yield* g.op(f, "Prompt", [1], [null, 7, "Modify view range", "Choose your new view", live(views)]))))) {
			yield* g.callName(f, rt.sv(f, "client"), "change_view", [(yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [live(new_view), live(max_view)]))]))]);
		}
	} else {
		yield* g.callName(f, rt.sv(f, "client"), "change_view", [(yield* g.callName(f, rt.sv(f, "client"), "default_view", []))]);
	}
	return f.dot;
}, true, { verb: { name: "View Range", category: "Ghost", desc: "Change your view range." } });

// /mob/dead/observer/verb/add_view_range  (code/modules/mob/dead/observer/observer.dm:477)  may sleep
rt.def("/mob/dead/observer/verb/add_view_range", function* add_view_range(f: Frame, input: Value) {
	let max_view: Value = null;
	let $0: any;
	f.vars = () => [input, max_view, $0];
	if (truthy(rt.gv(f, "unlock_content", rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		$0 = 14;
	} else {
		$0 = 10;
	}
	max_view = $0;
	if (!truthy(live(input))) return f.dot;
	yield* g.callName(f, rt.sv(f, "client"), "rescale_view", [multiply(live(input), 2), 3, add(multiply(live(max_view), 2), 1)]);
	return f.dot;
}, true, { hidden: true, verb: { name: "Add View Range" }, argTypes: [{ type: 32 }] });

// /mob/dead/observer/verb/boo  (code/modules/mob/dead/observer/observer.dm:486)
rt.def("/mob/dead/observer/verb/boo", function boo(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (rt.gt(rt.sv(f, "bootime"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (truthy((L = rt.locateIn(f, T("/obj/machinery/light"), rt.call(f, P("/proc/view"), null, [1, live(f.src)]))))) {
		rt.callName(f, live(L), "flicker", []);
		rt.setSv(f, "bootime", add(rt.worldTime(f), 600));
		return live(f.dot);
	}
	return live(f.dot);
}, false, { verb: { name: "Boo!", category: "Ghost", desc: "Scare your crew members because of boredom!" } });

// /mob/dead/observer/memory  (code/modules/mob/dead/observer/observer.dm:498)
rt.def("/mob/dead/observer/memory", function memory(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are dead! You have no mind to store memory!</span>"]);
	return f.dot;
}, false, { hidden: true, verb: { name: "Notes", category: "IC", desc: "View your character's notes memory." } });

// /mob/dead/observer/add_memory  (code/modules/mob/dead/observer/observer.dm:502)
rt.def("/mob/dead/observer/add_memory", function add_memory(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are dead! You have no mind to store memory!</span>"]);
	return f.dot;
}, false, { hidden: true, verb: { name: "Add Note", category: "IC" } });

// /mob/dead/observer/verb/toggle_ghostsee  (code/modules/mob/dead/observer/observer.dm:508)
rt.def("/mob/dead/observer/verb/toggle_ghostsee", function toggle_ghostsee(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "ghostvision", (!truthy(rt.sv(f, "ghostvision")) ? 1 : 0));
	rt.callSrc(f, "update_sight", []);
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "ghostvision"))) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("You ＀ have ghost vision.", [$1])]);
	return f.dot;
}, false, { verb: { name: "Toggle Ghost Vision", category: "Ghost", desc: "Toggles your ability to see things only ghosts can see, like other ghosts" } });

// /mob/dead/observer/verb/toggle_darkness  (code/modules/mob/dead/observer/observer.dm:515)
rt.def("/mob/dead/observer/verb/toggle_darkness", function toggle_darkness(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "lighting_alpha");
	if ($0 === 255) {
		rt.setSv(f, "lighting_alpha", 192);
	} else if ($0 === 192) {
		rt.setSv(f, "lighting_alpha", 128);
	} else if ($0 === 128) {
		rt.setSv(f, "lighting_alpha", 0);
	} else {
		rt.setSv(f, "lighting_alpha", 255);
	}
	rt.callSrc(f, "update_sight", []);
	return f.dot;
}, false, { verb: { name: "Toggle Darkness", category: "Ghost" } });

// /mob/dead/observer/proc/update_sight  (code/modules/mob/dead/observer/observer.dm:529)
rt.def("/mob/dead/observer/proc/update_sight", function update_sight(f: Frame) {
	if (truthy(rt.sv(f, "client"))) {
		rt.setSv(f, "ghost_others", rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client"))));
	}
	if (!truthy(rt.sv(f, "ghostvision"))) {
		rt.setSv(f, "see_invisible", 25);
	} else {
		rt.setSv(f, "see_invisible", 60);
	}
	rt.callSrc(f, "updateghostimages", []);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /proc/updateallghostimages  (code/modules/mob/dead/observer/observer.dm:541)
rt.def("/proc/updateallghostimages", function updateallghostimages(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	rt.call(f, P("/proc/listclearnulls"), null, [rt.gl("ghost_images_default")]);
	rt.call(f, P("/proc/listclearnulls"), null, [rt.gl("ghost_images_simple")]);
	O = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.callName(f, live(O), "updateghostimages", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/dead/observer/proc/updateghostimages  (code/modules/mob/dead/observer/observer.dm:548)
rt.def("/mob/dead/observer/proc/updateghostimages", function updateghostimages(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "client"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "lastsetting"))) {
		$0 = rt.sv(f, "lastsetting");
		if ($0 === 50) {
			(rt.modField(f, rt.sv(f, "client"), "images", rt.gl("ghost_images_default"), subtract));
		} else if ($0 === 1) {
			(rt.modField(f, rt.sv(f, "client"), "images", rt.gl("ghost_images_simple"), subtract));
		}
	}
	rt.setSv(f, "lastsetting", rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client"))));
	if (!truthy(rt.sv(f, "ghostvision"))) {
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client"))), 100)) return f.dot;
	$0 = rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client")));
	if ($0 === 50) {
		(rt.modField(f, rt.sv(f, "client"), "images", subtract(rt.gl("ghost_images_default"), rt.sv(f, "ghostimage_default")), rt.bitOr));
	} else if ($0 === 1) {
		(rt.modField(f, rt.sv(f, "client"), "images", subtract(rt.gl("ghost_images_simple"), rt.sv(f, "ghostimage_simple")), rt.bitOr));
	}
	return f.dot;
});

// /mob/dead/observer/verb/possess  (code/modules/mob/dead/observer/observer.dm:572)  may sleep
rt.def("/mob/dead/observer/verb/possess", function* possess(f: Frame) {
	let possessible: Value = null, L: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [possessible, L, target, $e];
	possessible = rt.list();
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy((rt.isIn(f, live(L), rt.gl("player_list")) ? 1 : 0)) && !truthy(rt.fv(f, "mind", live(L))))) {
			possessible = rt.modify(live(possessible), live(L), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((target = (yield* g.op(f, "Prompt", [1], [null, null, "Possess Mob", "Your new life begins today!", live(possessible)]))))) {
		return 0;
	}
	if (truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>This creature is too powerful for you to possess!</span>"]);
		return 0;
	}
	if (((truthy(rt.sv(f, "can_reenter_corpse")) && truthy(rt.sv(f, "mind"))) && truthy(rt.fv(f, "current", rt.sv(f, "mind"))))) {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), fmt("Your soul is still tied to your former life as ＀, if you go forward there is no going back to that life. Are you sure you wish to continue?", [rt.gv(f, "name", rt.fv(f, "current", rt.sv(f, "mind")))]), "Move On", "Yes", "No"])), "No")) {
			return 0;
		}
	}
	if (truthy(rt.fv(f, "key", live(target)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Someone has taken this body while you were choosing!</span>"]);
		return 0;
	}
	rt.setFv(f, "key", live(target), rt.sv(f, "key"));
	rt.setFv(f, "faction", live(target), rt.list("neutral"));
	return 1;
}, true, { verb: { name: "Possess!", category: "Ghost", desc: "Take over the body of a mindless creature!" } });

// /mob/dead/observer/pointed  (code/modules/mob/dead/observer/observer.dm:609)  may sleep
rt.def("/mob/dead/observer/pointed", function* pointed(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='deadsay'><b>＀</b> points to ＀.</span>", [live(f.src), live(f.args[0])])]);
	return 1;
}, true, { args: ["A"], verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// /mob/dead/observer/verb/view_manifest  (code/modules/mob/dead/observer/observer.dm:619)
rt.def("/mob/dead/observer/verb/view_manifest", function view_manifest(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = null;
	dat = rt.modify(live(dat), "<h4>Crew Manifest</h4>", add);
	dat = rt.modify(live(dat), rt.callName(f, rt.gl("data_core"), "get_manifest", []), add);
	rt.op(f, "Browse", [], [live(f.src), live(dat), "window=manifest;size=387x420;can_close=1"], false);
	return f.dot;
}, false, { verb: { name: "View Crew Manifest", category: "Ghost" } });

// /mob/dead/observer/proc/MouseDrop  (code/modules/mob/dead/observer/observer.dm:626)  may sleep
rt.def("/mob/dead/observer/proc/MouseDrop", function* MouseDrop(f: Frame) {
	if ((!truthy(live(f.usr)) || !truthy(live(f.args[0])))) {
		return live(f.dot);
	}
	if (((truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0)) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))))) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		if (truthy((yield* g.callName(f, rt.gv(f, "holder", rt.fv(f, "client", live(f.usr))), "cmd_ghost_drag", [live(f.src), live(f.args[0])])))) {
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["over"] });

// /mob/dead/observer/proc/Topic  (code/modules/mob/dead/observer/observer.dm:634)  may sleep
rt.def("/mob/dead/observer/proc/Topic", function* Topic(f: Frame) {
	let target: Value = null, tx: Value = null, ty: Value = null, tz: Value = null, target_3: Value = null;
	f.vars = () => [target, tx, ty, tz, target_3];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(live(f.usr), live(f.src))) return f.dot;
	if (truthy(rt.at(live(f.args[1]), "follow"))) {
		if ((truthy((rt.istype((target = rt.locateIn(f, rt.at(live(f.args[1]), "follow"), rt.world())), T("/atom/movable")) ? 1 : 0)) && !isEqual(live(target), live(f.src)))) {
			yield* g.srcCall(f, "ManualFollow", live(target));
			return live(f.dot);
		}
	}
	if (((truthy(rt.at(live(f.args[1]), "x")) && truthy(rt.at(live(f.args[1]), "y"))) && truthy(rt.at(live(f.args[1]), "z")))) {
		tx = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "x")]));
		ty = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "y")]));
		tz = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "z")]));
		if (truthy((rt.istype((target_3 = rt.locate(live(tx), live(ty), live(tz))), T("/turf")) ? 1 : 0))) {
			yield* g.srcCall(f, "forceMove", live(target_3));
			return live(f.dot);
		}
	}
	if (!truthy(rt.at(live(f.args[1]), "reenter"))) return f.dot;
	yield* g.srcCall(f, "reenter_corpse");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /mob/dead/observer/proc/show_data_huds  (code/modules/mob/dead/observer/observer.dm:659)
rt.def("/mob/dead/observer/proc/show_data_huds", function show_data_huds(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [hudtype, H, $e];
	hudtype = null;
	rt.forList(f, 0, rt.sv(f, "datahuds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hudtype = $e;
		rt.callName(f, (H = rt.index(rt.gl("huds"), live(hudtype))), "add_hud_to", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/dead/observer/proc/remove_data_huds  (code/modules/mob/dead/observer/observer.dm:664)
rt.def("/mob/dead/observer/proc/remove_data_huds", function remove_data_huds(f: Frame) {
	let hudtype: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [hudtype, H, $e];
	hudtype = null;
	rt.forList(f, 0, rt.sv(f, "datahuds"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hudtype = $e;
		rt.callName(f, (H = rt.index(rt.gl("huds"), live(hudtype))), "remove_hud_from", [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/dead/observer/verb/toggle_data_huds  (code/modules/mob/dead/observer/observer.dm:674)
rt.def("/mob/dead/observer/verb/toggle_data_huds", function toggle_data_huds(f: Frame) {
	if (truthy(rt.sv(f, "data_huds_on"))) {
		rt.callSrc(f, "remove_data_huds", []);
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Data HUDs disabled.</span>"]);
		rt.setSv(f, "data_huds_on", 0);
	} else {
		rt.callSrc(f, "show_data_huds", []);
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Data HUDs enabled.</span>"]);
		rt.setSv(f, "data_huds_on", 1);
	}
	return f.dot;
}, false, { verb: { name: "Toggle Sec/Med/Diag HUD", category: "Ghost", desc: "Toggles whether you see medical/security/diagnostic HUDs" } });

// /mob/dead/observer/verb/restore_ghost_apperance  (code/modules/mob/dead/observer/observer.dm:688)  may sleep
rt.def("/mob/dead/observer/verb/restore_ghost_apperance", function* restore_ghost_apperance(f: Frame) {
	yield* g.srcCall(f, "set_ghost_appearance");
	if (!(truthy(rt.sv(f, "client")) && truthy(rt.fv(f, "prefs", rt.sv(f, "client"))))) return f.dot;
	rt.setSv(f, "deadchat_name", rt.gv(f, "real_name", rt.fv(f, "prefs", rt.sv(f, "client"))));
	return f.dot;
}, true, { verb: { name: "Restore Ghost Character", category: "Ghost", desc: "Sets your deadchat name and ghost appearance to your roundstart character." } });

// /mob/dead/observer/proc/set_ghost_appearance  (code/modules/mob/dead/observer/observer.dm:693)  may sleep
rt.def("/mob/dead/observer/proc/set_ghost_appearance", function* set_ghost_appearance(f: Frame) {
	if ((!truthy(rt.sv(f, "client")) || !truthy(rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "be_random_name", rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		rt.setFv(f, "real_name", rt.fv(f, "prefs", rt.sv(f, "client")), (yield* g.call(f, P("/proc/random_unique_name"), null, [rt.sv(f, "gender")])));
	}
	if (truthy(rt.gv(f, "be_random_body", rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		yield* g.callName(f, rt.fv(f, "prefs", rt.sv(f, "client")), "random_character", [rt.sv(f, "gender")]);
	}
	if (truthy((rt.isIn(f, 2, rt.gv(f, "species_traits", rt.gv(f, "pref_species", rt.fv(f, "prefs", rt.sv(f, "client"))))) ? 1 : 0))) {
		rt.setSv(f, "hair_style", rt.gv(f, "hair_style", rt.fv(f, "prefs", rt.sv(f, "client"))));
		rt.setSv(f, "hair_color", (yield* g.srcCall(f, "brighten_color", rt.gv(f, "hair_color", rt.fv(f, "prefs", rt.sv(f, "client"))))));
	}
	if (truthy((rt.isIn(f, 3, rt.gv(f, "species_traits", rt.gv(f, "pref_species", rt.fv(f, "prefs", rt.sv(f, "client"))))) ? 1 : 0))) {
		rt.setSv(f, "facial_hair_style", rt.gv(f, "facial_hair_style", rt.fv(f, "prefs", rt.sv(f, "client"))));
		rt.setSv(f, "facial_hair_color", (yield* g.srcCall(f, "brighten_color", rt.gv(f, "facial_hair_color", rt.fv(f, "prefs", rt.sv(f, "client"))))));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /mob/dead/observer/proc/canUseTopic  (code/modules/mob/dead/observer/observer.dm:711)
rt.def("/mob/dead/observer/proc/canUseTopic", function canUseTopic(f: Frame, AM: Value, be_close: Value) {
	f.vars = () => [be_close];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (truthy(rt.call(f, P("/proc/check_rights"), null, [2, 0]))) {
		return 1;
	}
	return live(f.dot);
});

// /mob/dead/observer/proc/vv_edit_var  (code/modules/mob/dead/observer/observer.dm:719)  may sleep
rt.def("/mob/dead/observer/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = live(f.args[0]);
	if ($0 === "icon") {
		rt.setFv(f, "icon", rt.sv(f, "ghostimage_default"), rt.sv(f, "icon"));
		rt.setFv(f, "icon", rt.sv(f, "ghostimage_simple"), rt.sv(f, "icon"));
	} else if ($0 === "icon_state") {
		rt.setFv(f, "icon_state", rt.sv(f, "ghostimage_default"), rt.sv(f, "icon_state"));
		rt.setFv(f, "icon_state", rt.sv(f, "ghostimage_simple"), rt.sv(f, "icon_state"));
	} else if ($0 === "fun_verbs") {
		if (truthy(rt.sv(f, "fun_verbs"))) {
			rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/boo"), add);
			rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/possess"), add);
		} else {
			(rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/boo"), subtract));
			(rt.modSrcVar(f, "verbs", P("/mob/dead/observer/verb/possess"), subtract));
		}
	}
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /mob/dead/observer/proc/reset_perspective  (code/modules/mob/dead/observer/observer.dm:737)  may sleep
rt.def("/mob/dead/observer/proc/reset_perspective", function* reset_perspective(f: Frame) {
	let target: Value = null;
	f.vars = () => [target];
	if (truthy(rt.sv(f, "client"))) {
		if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "eye", rt.sv(f, "client"))]))) && !isEqual(rt.fv(f, "eye", rt.sv(f, "client")), live(f.src)))) {
			target = rt.fv(f, "eye", rt.sv(f, "client"));
			rt.setSv(f, "observetarget", null);
			if (truthy(rt.fv(f, "observers", live(target)))) {
				(rt.modField(f, live(target), "observers", live(f.src), subtract));
				if ((truthy(rt.fv(f, "observers", live(target))) && !truthy(rt.getLen(f, rt.fv(f, "observers", live(target)))))) {
					rt.setFv(f, "observers", live(target), null);
				}
			}
		}
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	rt.setFv(f, "screen", rt.sv(f, "client"), rt.list());
	yield* g.callName(f, rt.sv(f, "hud_used"), "show_hud", [rt.fv(f, "hud_version", rt.sv(f, "hud_used"))]);
	return f.dot;
}, true, { args: ["A"] });

// /mob/dead/observer/verb/observe  (code/modules/mob/dead/observer/observer.dm:752)  may sleep
rt.def("/mob/dead/observer/verb/observe", function* observe(f: Frame) {
	let creatures: Value = null, eye_name: Value = null, mob_eye: Value = null;
	f.vars = () => [creatures, eye_name, mob_eye];
	creatures = (yield* g.call(f, P("/proc/getpois"), null, []));
	yield* g.srcCall(f, "reset_perspective", null);
	eye_name = null;
	if (!truthy((eye_name = (yield* g.op(f, "Prompt", [1], [null, null, "Observe", "Please, select a player!", live(creatures)]))))) {
		return live(f.dot);
	}
	mob_eye = rt.index(live(creatures), live(eye_name));
	if (!((truthy(rt.sv(f, "client")) && truthy(live(mob_eye))) && truthy((rt.istype(live(mob_eye), T("/mob")) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "eye", rt.sv(f, "client"), live(mob_eye));
	rt.setFv(f, "screen", rt.sv(f, "client"), rt.list());
	if (!truthy(rt.fv(f, "hud_used", live(mob_eye)))) return f.dot;
	if (!truthy(rt.fv(f, "observers", live(mob_eye)))) {
		rt.setFv(f, "observers", live(mob_eye), rt.list());
	}
	(rt.modField(f, live(mob_eye), "observers", live(f.src), rt.bitOr));
	yield* g.callName(f, rt.fv(f, "hud_used", live(mob_eye)), "show_hud", [rt.gv(f, "hud_version", rt.fv(f, "hud_used", live(mob_eye))), live(f.src)]);
	rt.setSv(f, "observetarget", live(mob_eye));
	return f.dot;
}, true, { verb: { name: "Observe", category: "OOC" } });

// /mob/dead/observer/verb/register_pai_candidate  (code/modules/mob/dead/observer/observer.dm:779)
rt.def("/mob/dead/observer/verb/register_pai_candidate", function register_pai_candidate(f: Frame) {
	rt.callSrc(f, "register_pai", []);
	return f.dot;
}, false, { verb: { name: "pAI Setup", category: "Ghost", desc: "Upload a fragment of your personality to the global pAI databanks" } });

// /mob/dead/observer/proc/register_pai  (code/modules/mob/dead/observer/observer.dm:782)
rt.def("/mob/dead/observer/proc/register_pai", function register_pai(f: Frame) {
	if (truthy((rt.istype(live(f.src), T("/mob/dead/observer")) ? 1 : 0))) {
		if (truthy(rt.gl("SSpai"))) {
			rt.callName(f, rt.gl("SSpai"), "recruitWindow", [live(f.src)]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "Can't become a pAI candidate while not dead!"]);
	}
	return f.dot;
});

// /mob/dead/observer/proc/CtrlShiftClick  (code/modules/mob/dead/observer/observer.dm:789)  may sleep
rt.def("/mob/dead/observer/proc/CtrlShiftClick", function* CtrlShiftClick(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/check_rights"), null, [4096]))))) return f.dot;
	yield* g.srcCall(f, "change_mob_type", T("/mob/living/carbon/human"), null, null, 1);
	return f.dot;
}, true);

// /mob/dead/observer/proc/examine  (code/modules/mob/dead/observer/observer.dm:793)
rt.def("/mob/dead/observer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "invisibility"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It seems extremely obvious."]);
	return f.dot;
}, false, { args: ["user"] });

// /mob/dead/observer/proc/set_invisibility  (code/modules/mob/dead/observer/observer.dm:798)
rt.def("/mob/dead/observer/proc/set_invisibility", function set_invisibility(f: Frame, value: Value) {
	rt.setSv(f, "invisibility", live(value));
	if (!truthy(live(value))) {
		rt.callSrc(f, "set_light", [1, 2]);
	} else {
		rt.callSrc(f, "set_light", [0, 0]);
	}
	return f.dot;
});

// /mob/dead/observer/proc/vv_edit_var  (code/modules/mob/dead/observer/observer.dm:809)  may sleep
rt.def("/mob/dead/observer/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!isEqual(live(f.args[0]), "invisibility")) return f.dot;
	yield* g.srcCall(f, "set_invisibility", rt.sv(f, "invisibility"));
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /proc/set_observer_default_invisibility  (code/modules/mob/dead/observer/observer.dm:814)
rt.def("/proc/set_observer_default_invisibility", function set_observer_default_invisibility(f: Frame, amount: Value, message: Value) {
	let G: Value = null;
	let $e: any;
	f.vars = () => [message, G, $e];
	if (live(message) === null) {
		message = null;
	}
	G = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.callName(f, live(G), "set_invisibility", [live(amount)]);
		if (truthy(live(message))) {
			rt.call(f, P("/proc/to_chat"), null, [live(G), live(message)]);
		}
	}
	rt.endFor(f, 0);
	rt.setGl("observer_default_invisibility", live(amount));
	return f.dot;
});
