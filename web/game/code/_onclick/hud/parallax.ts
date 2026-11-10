// Based on /tg/station's code/_onclick/hud/parallax.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// parallax.dm:15
rt.def("/datum/hud/proc/create_parallax", function* create_parallax(f: Frame, viewmob: Value) {
	let screenmob: Value = (viewmob || this.mymob);
	let C: Value = screenmob.client;
	if (!this.apply_parallax_pref(viewmob)) {
		return f.dot;
	}
	if (!rt.length(C.parallax_layers_cached)) {
		C.parallax_layers_cached = list();
		C.parallax_layers_cached += (yield* new_(T("/obj/screen/parallax_layer/layer_1"), null, C.view));
		C.parallax_layers_cached += (yield* new_(T("/obj/screen/parallax_layer/layer_2"), null, C.view));
		C.parallax_layers_cached += (yield* new_(T("/obj/screen/parallax_layer/layer_3"), null, C.view));
	}
	C.parallax_layers = (yield* C.parallax_layers_cached.Copy());
	if (rt.length(C.parallax_layers) > C.parallax_layers_max) {
		C.parallax_layers.len = C.parallax_layers_max;
	}
	(rt.modField(f, C, "screen", C.parallax_layers, rt.bitOr));
	let PM: Value = rt.index(screenmob.hud_used.plane_masters, `${PLANE_SPACE}`);
	if (screenmob != this.mymob) {
		C.screen -= rt.locateIn(f, T("/obj/screen/plane_master/parallax_white"), C.screen);
		C.screen += PM;
	}
	PM.color = list(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0);
	return f.dot;
}, true);

// parallax.dm:46
rt.def("/datum/hud/proc/remove_parallax", function remove_parallax(f: Frame, viewmob: Value) {
	let C: Value = null;
	let screenmob: Value = (viewmob || this.mymob);
	(C = screenmob.client).screen -= C.parallax_layers_cached;
	let PM: Value = rt.index(screenmob.hud_used.plane_masters, `${PLANE_SPACE}`);
	if (screenmob != this.mymob) {
		C.screen -= rt.locateIn(f, T("/obj/screen/plane_master/parallax_white"), C.screen);
		C.screen += PM;
	}
	PM.color = rt.initial(f, PM, "color");
	C.parallax_layers = null;
	return f.dot;
});

// parallax.dm:57
rt.def("/datum/hud/proc/apply_parallax_pref", function apply_parallax_pref(f: Frame, viewmob: Value) {
	let C: Value = null, pref: Value = null;
	let screenmob: Value = (viewmob || this.mymob);
	if ((C = screenmob.client).prefs) {
		if ((pref = C.prefs.parallax) === null) {
			pref = PARALLAX_HIGH;
			if (C.byond_version < 511) {
				pref = PARALLAX_DISABLE;
			}
		}
		if (C.prefs.parallax === PARALLAX_INSANE) {
			C.parallax_throttle = 0;
			C.parallax_layers_max = 4;
			return 1;
		} else if (C.prefs.parallax === 1) {
			C.parallax_throttle = 1;
			C.parallax_layers_max = 2;
			return 1;
		} else if (C.prefs.parallax === 2) {
			C.parallax_throttle = 2;
			C.parallax_layers_max = 1;
			return 1;
		} else if (C.prefs.parallax === PARALLAX_DISABLE) {
			return 0;
		}
	}
	C.parallax_throttle = rt.world().tick_lag;
	C.parallax_layers_max = 3;
	return 1;
});

// parallax.dm:89
rt.def("/datum/hud/proc/update_parallax_pref", function* update_parallax_pref(f: Frame, viewmob: Value) {
	this.remove_parallax(viewmob);
	yield* this.create_parallax(viewmob);
	return f.dot;
}, true);

// parallax.dm:96
rt.def("/datum/hud/proc/set_parallax_movedir", function* set_parallax_movedir(f: Frame, new_parallax_movedir: Value, skip_windups: Value) {
	let animate_time: Value = null, thing: Value = null, L: Value = null, _T: Value = null, newtransform: Value = null, shortesttimer: Value = null, thing_4: Value = null, L_5: Value = null, _T_6: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $e: any;
	f.dot = 0;
	let C: Value = this.mymob.client;
	if (new_parallax_movedir == C.parallax_movedir) {
		return f.dot;
	}
	let animatedir: Value = new_parallax_movedir;
	if (new_parallax_movedir == 0) {
		animate_time = 0;
		for (thing of each(C.parallax_layers)) {
			(L = thing).icon_state = rt.initial(f, L, "icon_state");
			L.update_o(C.view);
			if ((_T = PARALLAX_LOOP_TIME / L.speed) > animate_time) {
				animate_time = _T;
			}
		}
		C.dont_animate_parallax = rt.worldTime(f) + min(animate_time, PARALLAX_LOOP_TIME);
		animatedir = C.parallax_movedir;
	}
	if (animatedir === 1) {
		newtransform = matrix(1, 0, 0, 0, 1, 480);
	} else if (animatedir === 2) {
		newtransform = matrix(1, 0, 0, 0, 1, -480);
	} else if (animatedir === 4) {
		newtransform = matrix(1, 0, 480, 0, 1, 0);
	} else if (animatedir === 8) {
		newtransform = matrix(1, 0, -480, 0, 1, 0);
	}
	if (!skip_windups) {
		for (thing_4 of each(C.parallax_layers)) {
			L_5 = thing_4;
			_T_6 = 25 / L_5.speed;
			if (shortesttimer === null) {
				shortesttimer = _T_6;
			}
			if (_T_6 < shortesttimer) {
				shortesttimer = _T_6;
			}
			L_5.transform = newtransform;
			$0 = null;
			$1 = L_5;
			$2 = "transform";
			$3 = matrix();
			$4 = "time";
			$5 = _T_6;
			$6 = "easing";
			$7 = 7;
			if (new_parallax_movedir) {
				$8 = 64;
			} else {
				$8 = 128;
			}
			rt.op(f, "Animate", [2, 10], [$0, $1, $2, $3, $4, $5, $6, rt.bitOr($7, $8), "flags", 1]);
			if (new_parallax_movedir) {
				L_5.transform = newtransform;
				rt.op(f, "Animate", [2, 4], ["transform", matrix(), "time", _T_6]);
			}
		}
	}
	C.parallax_movedir = new_parallax_movedir;
	if (C.parallax_animate_timer) {
		yield* deltimer(C.parallax_animate_timer);
	}
	let CB: Value = (yield* new_(T("/datum/callback"), this, P("/datum/hud/proc/update_parallax_motionblur"), C, animatedir, new_parallax_movedir, newtransform));
	if (skip_windups) {
		yield* CB.Invoke();
	} else {
		C.parallax_animate_timer = (yield* addtimer(CB, min(shortesttimer, 25), 12));
	}
	return f.dot;
}, true);

// parallax.dm:149
rt.def("/datum/hud/proc/update_parallax_motionblur", function update_parallax_motionblur(f: Frame, C: Value, animatedir: Value, new_parallax_movedir: Value, newtransform: Value) {
	let thing: Value = null, L: Value = null, newstate: Value = null, _T: Value = null;
	C.parallax_animate_timer = 0;
	for (thing of each(C.parallax_layers)) {
		L = thing;
		if (!new_parallax_movedir) {
			rt.op(f, "Animate", [1, 1], [L]);
			continue;
		}
		newstate = rt.initial(f, L, "icon_state");
		if (animatedir) {
			if (animatedir == 1 || animatedir == 2) {
				newstate += "_vertical";
			} else {
				newstate += "_horizontal";
			}
		}
		_T = PARALLAX_LOOP_TIME / L.speed;
		if (rt.isIn(f, newstate, icon_states(L.icon))) {
			L.icon_state = newstate;
			L.update_o(C.view);
		}
		L.transform = newtransform;
		rt.op(f, "Animate", [2, 10], [null, L, "transform", matrix(), "time", _T, "loop", -1, "flags", 1]);
	}
	return f.dot;
}, false, { argTypes: [{ path: "/client" }, {  }, {  }, { path: "/matrix" }] });

// parallax.dm:175
rt.def("/datum/hud/proc/update_parallax", function* update_parallax(f: Frame) {
	let areaobj: Value = null, force: Value = null, last_delay: Value = null, thing: Value = null, L: Value = null, change_x: Value = null, change_y: Value = null;
	let C: Value = this.mymob.client;
	let posobj: Value = rt.getStep(f, C.eye, 0);
	// The eye can be off the map for a moment (a brain's Login while its head is still being placed): 2017 tg read
	// null.loc here. Modern tg returns early too.
	if (!posobj) {
		return null;
	}
	yield* this.set_parallax_movedir((areaobj = posobj.loc).parallax_movedir, 0);
	if (!C.previous_turf || C.previous_turf.z != posobj.z) {
		C.previous_turf = posobj;
		force = 1;
	}
	if (!force && rt.worldTime(f) < C.last_parallax_shift + C.parallax_throttle) {
		return f.dot;
	}
	let offset_x: Value = posobj.x - C.previous_turf.x;
	let offset_y: Value = posobj.y - C.previous_turf.y;
	if (!offset_x && !offset_y && !force) {
		return f.dot;
	}
	last_delay = min((last_delay = rt.worldTime(f) - C.last_parallax_shift), C.parallax_throttle);
	C.previous_turf = posobj;
	C.last_parallax_shift = rt.worldTime(f);
	for (thing of each(C.parallax_layers)) {
		if ((L = thing).view_sized != C.view) {
			L.update_o(C.view);
		}
		change_x = offset_x * L.speed;
		L.offset_x -= change_x;
		change_y = offset_y * L.speed;
		L.offset_y -= change_y;
		if (L.offset_x > 240) {
			L.offset_x -= 480;
		}
		if (L.offset_x < -240) {
			L.offset_x += 480;
		}
		if (L.offset_y > 240) {
			L.offset_y -= 480;
		}
		if (L.offset_y < -240) {
			L.offset_y += 480;
		}
		if (!areaobj.parallax_movedir && C.dont_animate_parallax <= rt.worldTime(f) && (offset_x || offset_y) && rt.op(f, "Abs", [], [offset_x]) <= max(C.parallax_throttle / rt.world().tick_lag + 1, 1) && rt.op(f, "Abs", [], [offset_y]) <= max(C.parallax_throttle / rt.world().tick_lag + 1, 1) && (round(rt.op(f, "Abs", [], [change_x])) > 1 || round(rt.op(f, "Abs", [], [change_y])) > 1)) {
			L.transform = matrix(1, 0, offset_x * L.speed, 0, 1, offset_y * L.speed);
			rt.op(f, "Animate", [2, 6], [null, L, "transform", matrix(), "time", last_delay]);
		}
		L.screen_loc = `CENTER-7:${round(L.offset_x, 1)},CENTER-7:${round(L.offset_y, 1)}`;
	}
	return f.dot;
}, true);

// parallax.dm:226
rt.def("/atom/movable/proc/update_parallax_contents", function* update_parallax_contents(f: Frame) {
	let thing: Value = null, M: Value = null;
	if (!rt.length(this.client_mobs_in_contents)) return f.dot;
	for (thing of each(this.client_mobs_in_contents)) {
		if ((M = thing) && M.client && M.hud_used && rt.length(M.client.parallax_layers)) {
			yield* M.hud_used.update_parallax();
		}
	}
	return f.dot;
}, true);

// parallax.dm:233
rt.def("/mob/proc/update_parallax_teleport", function* update_parallax_teleport(f: Frame) {
	if (!(this.client && this.client.eye && this.hud_used && rt.length(this.client.parallax_layers))) return f.dot;
	let areaobj: Value = get_area(this.client.eye);
	yield* this.hud_used.set_parallax_movedir(areaobj.parallax_movedir, 1);
	return f.dot;
}, true);

rt.type(11137, "/obj/screen/parallax_layer", "/obj/screen", {
	speed: 1,
	offset_x: 0,
	offset_y: 0,
	view_sized: null,
	icon: rt.rsc("icons/effects/parallax.dmi"),
	blend_mode: 2,
	plane: -90,
	screen_loc: "CENTER-7,CENTER-7",
	mouse_opacity: 0,
});

// parallax.dm:250
rt.def("/obj/screen/parallax_layer/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	if (!f.args[1]) {
		f.args[1] = rt.world().view;
	}
	this.update_o(f.args[1]);
	return f.dot;
}, false, { args: ["mapload", "view"] });

// parallax.dm:256
rt.def("/obj/screen/parallax_layer/proc/update_o", function update_o(f: Frame, view: Value) {
	let x: Value = null, y: Value = null, texture_overlay: Value = null;
	let $e: any;
	if (!view) {
		view = rt.world().view;
	}
	let viewscales: Value = getviewsize(view);
	let countx: Value = Ceiling(rt.index(viewscales, 1) / 2 / (480 / rt.world().icon_size)) + 1;
	let county: Value = Ceiling(rt.index(viewscales, 2) / 2 / (480 / rt.world().icon_size)) + 1;
	let new_overlays: Value = new_(T("/list"));
	rt.forRange(f, 0, -countx, countx, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		y = null;
		rt.forRange(f, 1, -county, county, 1);
		while (($e = rt.next(f, 1)) !== undefined) {
			y = $e;
			if (x == 0 && y == 0) {
				continue;
			}
			(texture_overlay = mutable_appearance(this.icon, this.icon_state)).transform = matrix(1, 0, x * 480, 0, 1, y * 480);
			new_overlays += texture_overlay;
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	this.cut_overlays();
	this.add_overlay(new_overlays);
	this.view_sized = view;
	return f.dot;
});
