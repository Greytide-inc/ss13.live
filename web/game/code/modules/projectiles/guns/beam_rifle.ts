// From code/modules/projectiles/guns/beam_rifle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5165, "/obj/item/weapon/gun/energy/beam_rifle", "/obj/item/weapon/gun/energy", {
	hipfire_inaccuracy: 2,
	hipfire_recoil: 10,
	scoped_inaccuracy: 0,
	scoped_recoil: 3,
	scoped: 0,
	noscope: 0,
	aiming: 0,
	aiming_time: 7,
	aiming_time_fire_threshold: 2,
	aiming_time_left: 7,
	aiming_time_increase_user_movement: 3,
	scoped_slow: 1,
	aiming_time_increase_angle_multiplier: 0.6,
	lastangle: 0,
	current_user: null,
	current_tracers: null,
	structure_piercing: 2,
	structure_bleed_coeff: 0.7,
	wall_pierce_amount: 0,
	wall_devastate: 0,
	aoe_structure_range: 1,
	aoe_structure_damage: 50,
	aoe_fire_range: 2,
	aoe_fire_chance: 40,
	aoe_mob_range: 1,
	aoe_mob_damage: 30,
	impact_structure_damage: 60,
	projectile_damage: 30,
	projectile_stun: 0,
	projectile_setting_pierce: 1,
	delay: 65,
	lastfire: 0,
	canMouseDown: 1,
	name: "particle acceleration rifle",
	desc: "An energy-based anti material marksman rifle that uses highly charged particle beams moving at extreme velocities to decimate whatever is unfortunate enough to be targetted by one. <span class='boldnotice'>Hold down left click while scoped to aim, when weapon is fully aimed (Tracer goes from red to green as it charges), release to fire. Moving while aiming or changing where you're pointing at while aiming will delay the aiming process depending on how much you changed.</span>",
	icon: rt.rsc("icons/obj/guns/energy.dmi"),
	icon_state: "esniper",
	item_state: "esniper",
	fire_sound: rt.rsc("sound/weapons/beam_sniper.ogg"),
	slot_flags: 1024,
	force: 15,
	materials: null,
	origin_tech: "",
	recoil: 5,
	ammo_x_offset: 3,
	ammo_y_offset: 3,
	modifystate: 0,
	zoomable: 1,
	zoom_amt: 17,
	zoom_out_amt: 20,
	weapon_weight: 3,
	w_class: 4,
	ammo_type: null,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/beam_rifle"),
	pin: null,
}, { global: { charged_overlay: 1047, drained_overlay: 1048 } });

// /obj/item/weapon/gun/energy/beam_rifle/proc/<init>  (code/modules/projectiles/guns/beam_rifle.dm:44)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "current_tracers", rt.list());
	$0 = $0;
	rt.setSv(f, "materials", rt.list());
	$0 = $0;
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/beam_rifle/hitscan")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/update_icon  (code/modules/projectiles/guns/beam_rifle.dm:78)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/update_icon", function update_icon(f: Frame) {
	let primary_ammo: Value = null;
	f.vars = () => [primary_ammo];
	rt.callSrc(f, "cut_overlays", []);
	primary_ammo = rt.index(rt.sv(f, "ammo_type"), 1);
	if (rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "e_cost", live(primary_ammo)))) {
		rt.callSrc(f, "add_overlay", [rt.gl("charged_overlay")]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.gl("drained_overlay")]);
	}
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/attack_self  (code/modules/projectiles/guns/beam_rifle.dm:86)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setSv(f, "projectile_setting_pierce", (!truthy(rt.sv(f, "projectile_setting_pierce")) ? 1 : 0));
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "projectile_setting_pierce"))) {
		$1 = $1;
		$2 = "pierce";
	} else {
		$2 = "impact";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldnotice'>You set ％！ to ＀ mode.</span>", [$1, $2])]);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/update_slowdown  (code/modules/projectiles/guns/beam_rifle.dm:91)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/update_slowdown", function update_slowdown(f: Frame) {
	if (truthy(rt.sv(f, "scoped"))) {
		rt.setSv(f, "slowdown", rt.sv(f, "scoped_slow"));
	} else {
		rt.setSv(f, "slowdown", rt.initial(f, live(f.src), "slowdown"));
	}
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/Initialize  (code/modules/projectiles/guns/beam_rifle.dm:96)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/Destroy  (code/modules/projectiles/guns/beam_rifle.dm:100)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/zoom  (code/modules/projectiles/guns/beam_rifle.dm:104)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/zoom", function* zoom(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "scope", live(f.args[0]), live(f.dot));
	return f.dot;
}, true, { args: ["user", "forced_zoom"] });

// /obj/item/weapon/gun/energy/beam_rifle/proc/scope  (code/modules/projectiles/guns/beam_rifle.dm:109)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/scope", function scope(f: Frame, user: Value, forced: Value) {
	let scoping: Value = null;
	let $0: any;
	f.vars = () => [scoping, $0];
	scoping = null;
	$0 = live(forced);
	if ($0 === 1) {
		scoping = 1;
	} else if ($0 === 0) {
		scoping = 0;
	} else {
		scoping = (!truthy(rt.sv(f, "scoped")) ? 1 : 0);
	}
	if (truthy(live(scoping))) {
		rt.setSv(f, "spread", rt.sv(f, "scoped_inaccuracy"));
		rt.setSv(f, "recoil", rt.sv(f, "scoped_recoil"));
		rt.setSv(f, "scoped", 1);
		rt.op(f, "Output", [], [live(user), fmt("<span class='boldnotice'>You bring your ＀ up and use its scope...</span>", [live(f.src)])], false);
	} else {
		rt.setSv(f, "spread", rt.sv(f, "hipfire_inaccuracy"));
		rt.setSv(f, "recoil", rt.sv(f, "hipfire_recoil"));
		rt.setSv(f, "scoped", 0);
		rt.op(f, "Output", [], [live(user), fmt("<span class='boldnotice'>You lower your ＀.</span>", [live(f.src)])], false);
	}
	rt.callSrc(f, "update_slowdown", []);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/can_trigger_gun  (code/modules/projectiles/guns/beam_rifle.dm:129)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/can_trigger_gun", function* can_trigger_gun(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "scoped")) && !truthy(rt.sv(f, "noscope")))) {
		rt.op(f, "Output", [], [live(user), "<span class='userdanger'>This beam rifle can only be used while scoped!</span>"], false);
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [live(user)]));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/emp_act  (code/modules/projectiles/guns/beam_rifle.dm:136)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	rt.setSv(f, "chambered", null);
	yield* g.srcCall(f, "recharge_newshot");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/aiming_beam  (code/modules/projectiles/guns/beam_rifle.dm:139)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/aiming_beam", function* aiming_beam(f: Frame) {
	let A: Value = null, _T: Value = null, _P: Value = null, percent: Value = null;
	f.vars = () => [A, _T, _P, percent];
	if ((!truthy((rt.istype((A = rt.gv(f, "mouseObject", rt.fv(f, "client", rt.sv(f, "current_user")))), T("/atom")) ? 1 : 0)) || !truthy(rt.fv(f, "loc", live(A))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((_T = rt.getStep(f, rt.gv(f, "mouseObject", rt.fv(f, "client", rt.sv(f, "current_user"))), 0)), T("/turf")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "gun", (_P = (yield* g.new_(f, T("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam"), []))), live(f.src));
	rt.setFv(f, "wall_pierce_amount", live(_P), rt.sv(f, "wall_pierce_amount"));
	rt.setFv(f, "structure_pierce_amount", live(_P), rt.sv(f, "structure_piercing"));
	rt.setFv(f, "do_pierce", live(_P), rt.sv(f, "projectile_setting_pierce"));
	yield* g.callName(f, live(_P), "preparePixelProjectile", [rt.gv(f, "mouseObject", rt.fv(f, "client", rt.sv(f, "current_user"))), live(_T), rt.sv(f, "current_user"), rt.gv(f, "mouseParams", rt.fv(f, "client", rt.sv(f, "current_user"))), 0]);
	if (truthy(rt.sv(f, "aiming_time"))) {
		percent = multiply(divide(100, rt.sv(f, "aiming_time")), rt.sv(f, "aiming_time_left"));
		rt.setFv(f, "color", live(_P), rt.op(f, "Rgb", [1, 3], [multiply(255, live(percent)), multiply(255, divide(subtract(100, live(percent)), 100)), 0]));
	} else {
		rt.setFv(f, "color", live(_P), "#00ff00");
	}
	yield* g.srcCall(f, "clear_tracers");
	yield* g.callName(f, live(_P), "fire", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/clear_tracers  (code/modules/projectiles/guns/beam_rifle.dm:160)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/clear_tracers", function* clear_tracers(f: Frame) {
	let I: Value = null, PB: Value = null;
	let $e: any;
	f.vars = () => [I, PB, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "current_tracers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(rt.modSrcVar(f, "current_tracers", live(I), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [(PB = live(I))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/terminate_aiming  (code/modules/projectiles/guns/beam_rifle.dm:166)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/terminate_aiming", function* terminate_aiming(f: Frame) {
	yield* g.srcCall(f, "stop_aiming");
	yield* g.srcCall(f, "clear_tracers");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/process  (code/modules/projectiles/guns/beam_rifle.dm:170)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "aiming"))) {
		return live(f.dot);
	}
	if ((((!truthy((rt.istype(rt.sv(f, "current_user"), T("/mob")) ? 1 : 0)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "current_user"))])))) || !truthy((rt.isIn(f, live(f.src), rt.fv(f, "held_items", rt.sv(f, "current_user"))) ? 1 : 0))) || truthy((yield* g.callName(f, rt.sv(f, "current_user"), "incapacitated", []))))) {
		yield* g.srcCall(f, "terminate_aiming");
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "aiming_time_left"), 0)) {
		rt.incSrcVar(f, "aiming_time_left", -1, true);
	}
	yield* g.srcCall(f, "aiming_beam");
	yield* g.srcCall(f, "process_aim");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/gun/energy/beam_rifle/proc/process_aim  (code/modules/projectiles/guns/beam_rifle.dm:181)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/process_aim", function* process_aim(f: Frame) {
	let mouse_control: Value = null, screen_loc_params: Value = null, screen_loc_X: Value = null, screen_loc_Y: Value = null, x: Value = null, y: Value = null, screenview: Value = null, ox: Value = null, oy: Value = null, angle: Value = null, difference: Value = null;
	let $0: any;
	f.vars = () => [mouse_control, screen_loc_params, screen_loc_X, screen_loc_Y, x, y, screenview, ox, oy, angle, difference, $0];
	if (!truthy(rt.gv(f, "mouseParams", rt.fv(f, "client", rt.sv(f, "current_user"))))) return f.dot;
	mouse_control = (yield* g.call(f, P("/proc/params2list"), null, [rt.gv(f, "mouseParams", rt.fv(f, "client", rt.sv(f, "current_user")))]));
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.gv(f, "mouseLocation", rt.fv(f, "client", rt.sv(f, "current_user")))])))) {
		yield* g.callName(f, rt.sv(f, "current_user"), "face_atom", [rt.gv(f, "mouseLocation", rt.fv(f, "client", rt.sv(f, "current_user")))]);
	}
	if (!truthy(rt.at(live(mouse_control), "screen-loc"))) return f.dot;
	screen_loc_params = (yield* g.call(f, P("/proc/splittext"), null, [rt.at(live(mouse_control), "screen-loc"), ","]));
	screen_loc_X = (yield* g.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 1), ":"]));
	screen_loc_Y = (yield* g.call(f, P("/proc/splittext"), null, [rt.index(live(screen_loc_params), 2), ":"]));
	x = subtract(add(multiply((yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_X), 1)])), 32), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_X), 2)]))), 32);
	y = subtract(add(multiply((yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_Y), 1)])), 32), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(screen_loc_Y), 2)]))), 32);
	screenview = (yield* g.call(f, P("/proc/getviewsize"), null, [rt.gv(f, "view", rt.fv(f, "client", rt.sv(f, "current_user")))]));
	ox = subtract((yield* g.call(f, P("/proc/round"), null, [divide(multiply(rt.index(live(screenview), 1), rt.fv(f, "icon_size", rt.world())), 2)])), rt.gv(f, "pixel_x", rt.fv(f, "client", rt.sv(f, "current_user"))));
	oy = subtract((yield* g.call(f, P("/proc/round"), null, [divide(multiply(rt.index(live(screenview), 2), rt.fv(f, "icon_size", rt.world())), 2)])), rt.gv(f, "pixel_y", rt.fv(f, "client", rt.sv(f, "current_user"))));
	if (rt.gt(add(rt.modulus((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 360), subtract((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 1])))), 0)) {
		$0 = add(rt.modulus((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 360), subtract((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 1]))));
	} else {
		$0 = add(add(rt.modulus((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 360), subtract((yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Atan2"), null, [subtract(live(y), live(oy)), subtract(live(x), live(ox))])), 1])))), 360);
	}
	angle = $0;
	yield* g.srcCall(f, "delay_penalty", multiply((difference = rt.op(f, "Abs", [], [subtract(rt.sv(f, "lastangle"), live(angle))])), rt.sv(f, "aiming_time_increase_angle_multiplier")));
	rt.setSv(f, "lastangle", live(angle));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/on_mob_move  (code/modules/projectiles/guns/beam_rifle.dm:200)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/on_mob_move", function on_mob_move(f: Frame) {
	rt.callSrc(f, "delay_penalty", [rt.sv(f, "aiming_time_increase_user_movement")]);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/start_aiming  (code/modules/projectiles/guns/beam_rifle.dm:203)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/start_aiming", function start_aiming(f: Frame) {
	rt.setSv(f, "aiming_time_left", rt.sv(f, "aiming_time"));
	rt.setSv(f, "aiming", 1);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/stop_aiming  (code/modules/projectiles/guns/beam_rifle.dm:207)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/stop_aiming", function stop_aiming(f: Frame) {
	rt.setSv(f, "aiming_time_left", rt.sv(f, "aiming_time"));
	rt.setSv(f, "aiming", 0);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDrag  (code/modules/projectiles/guns/beam_rifle.dm:211)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDrag", function onMouseDrag(f: Frame, src_object: Value, over_object: Value, src_location: Value, over_location: Value, params: Value, mob: Value) {
	rt.setSv(f, "current_user", live(mob));
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDown  (code/modules/projectiles/guns/beam_rifle.dm:214)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseDown", function onMouseDown(f: Frame, object: Value, location: Value, params: Value, mob: Value) {
	rt.callSrc(f, "start_aiming", []);
	rt.setSv(f, "current_user", live(mob));
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/onMouseUp  (code/modules/projectiles/guns/beam_rifle.dm:218)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/onMouseUp", function* onMouseUp(f: Frame, object: Value, location: Value, params: Value, M: Value) {
	f.vars = () => [object, location, params, M];
	yield* g.srcCall(f, "process_aim");
	if (rt.le(rt.sv(f, "aiming_time_left"), rt.sv(f, "aiming_time_fire_threshold"))) {
		yield* g.srcCall(f, "sync_ammo");
		yield* g.callSrc(f, "afterattack", [null, rt.gv(f, "mouseObject", rt.fv(f, "client", live(M))), null, live(M), null, 0, null, rt.gv(f, "mouseParams", rt.fv(f, "client", live(M))), "passthrough", 1], rt.Args.Named);
	}
	yield* g.srcCall(f, "stop_aiming");
	yield* g.srcCall(f, "clear_tracers");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/beam_rifle/proc/afterattack  (code/modules/projectiles/guns/beam_rifle.dm:226)  may sleep
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/afterattack", function* afterattack(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if ((!truthy(live(f.args[4])) && rt.gt(rt.sv(f, "aiming_time"), rt.sv(f, "aiming_time_fire_threshold")))) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "lastfire"), add(rt.worldTime(f), rt.sv(f, "delay")))) {
		return live(f.dot);
	}
	rt.setSv(f, "lastfire", rt.worldTime(f));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "user", "flag", "params", "passthrough"] });

// /obj/item/weapon/gun/energy/beam_rifle/proc/sync_ammo  (code/modules/projectiles/guns/beam_rifle.dm:234)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/sync_ammo", function sync_ammo(f: Frame) {
	let AC: Value = null;
	let $e: any;
	f.vars = () => [AC, $e];
	AC = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/ammo_casing/energy/beam_rifle"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AC = $e;
		rt.callName(f, live(AC), "sync_stats", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/gun/energy/beam_rifle/proc/delay_penalty  (code/modules/projectiles/guns/beam_rifle.dm:238)
rt.def("/obj/item/weapon/gun/energy/beam_rifle/proc/delay_penalty", function delay_penalty(f: Frame, amount: Value) {
	rt.setSv(f, "aiming_time_left", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "aiming_time_left"), live(amount)), rt.sv(f, "aiming_time")])]));
	return f.dot;
});

rt.type(8731, "/obj/item/ammo_casing/energy/beam_rifle", "/obj/item/ammo_casing/energy", {
	wall_pierce_amount: 0,
	wall_devastate: 0,
	aoe_structure_range: 1,
	aoe_structure_damage: 30,
	aoe_fire_range: 2,
	aoe_fire_chance: 66,
	aoe_mob_range: 1,
	aoe_mob_damage: 20,
	impact_structure_damage: 50,
	projectile_damage: 40,
	projectile_stun: 0,
	structure_piercing: 2,
	structure_bleed_coeff: 0.7,
	do_pierce: 1,
	host: null,
	name: "particle acceleration lens",
	desc: "Don't look into barrel!",
});

// /obj/item/ammo_casing/energy/beam_rifle/proc/sync_stats  (code/modules/projectiles/guns/beam_rifle.dm:260)
rt.def("/obj/item/ammo_casing/energy/beam_rifle/proc/sync_stats", function sync_stats(f: Frame) {
	let BR: Value = null;
	f.vars = () => [BR];
	if (!truthy((rt.istype((BR = rt.sv(f, "loc")), T("/obj/item/weapon/gun/energy/beam_rifle")) ? 1 : 0))) {
		rt.call(f, P("/proc/stack_trace"), null, ["Beam rifle syncing error"]);
	}
	rt.setSv(f, "host", live(BR));
	rt.setSv(f, "do_pierce", rt.fv(f, "projectile_setting_pierce", live(BR)));
	rt.setSv(f, "wall_pierce_amount", rt.fv(f, "wall_pierce_amount", live(BR)));
	rt.setSv(f, "wall_devastate", rt.fv(f, "wall_devastate", live(BR)));
	rt.setSv(f, "aoe_structure_range", rt.fv(f, "aoe_structure_range", live(BR)));
	rt.setSv(f, "aoe_structure_damage", rt.fv(f, "aoe_structure_damage", live(BR)));
	rt.setSv(f, "aoe_fire_range", rt.fv(f, "aoe_fire_range", live(BR)));
	rt.setSv(f, "aoe_fire_chance", rt.fv(f, "aoe_fire_chance", live(BR)));
	rt.setSv(f, "aoe_mob_range", rt.fv(f, "aoe_mob_range", live(BR)));
	rt.setSv(f, "aoe_mob_damage", rt.fv(f, "aoe_mob_damage", live(BR)));
	rt.setSv(f, "impact_structure_damage", rt.fv(f, "impact_structure_damage", live(BR)));
	rt.setSv(f, "projectile_damage", rt.fv(f, "projectile_damage", live(BR)));
	rt.setSv(f, "projectile_stun", rt.fv(f, "projectile_stun", live(BR)));
	rt.setSv(f, "delay", rt.fv(f, "delay", live(BR)));
	rt.setSv(f, "structure_piercing", rt.fv(f, "structure_piercing", live(BR)));
	rt.setSv(f, "structure_bleed_coeff", rt.fv(f, "structure_bleed_coeff", live(BR)));
	return f.dot;
});

// /obj/item/ammo_casing/energy/beam_rifle/proc/ready_proj  (code/modules/projectiles/guns/beam_rifle.dm:281)  may sleep
rt.def("/obj/item/ammo_casing/energy/beam_rifle/proc/ready_proj", function* ready_proj(f: Frame, target: Value, user: Value, quiet: Value, zone_override: Value) {
	let HS_BB: Value = null;
	f.vars = () => [target, user, quiet, zone_override, HS_BB];
	f.dot = (yield* g.callSuper(f, [live(target), live(user), live(quiet), live(zone_override)]));
	if (!truthy((rt.istype((HS_BB = rt.sv(f, "BB")), T("/obj/item/projectile/beam/beam_rifle/hitscan")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "impact_direct_damage", live(HS_BB), rt.sv(f, "projectile_damage"));
	rt.setFv(f, "stun", live(HS_BB), rt.sv(f, "projectile_stun"));
	rt.setFv(f, "impact_structure_damage", live(HS_BB), rt.sv(f, "impact_structure_damage"));
	rt.setFv(f, "aoe_mob_damage", live(HS_BB), rt.sv(f, "aoe_mob_damage"));
	rt.setFv(f, "aoe_mob_range", live(HS_BB), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "aoe_mob_range"), 15]))])));
	rt.setFv(f, "aoe_fire_chance", live(HS_BB), rt.sv(f, "aoe_fire_chance"));
	rt.setFv(f, "aoe_fire_range", live(HS_BB), rt.sv(f, "aoe_fire_range"));
	rt.setFv(f, "aoe_structure_damage", live(HS_BB), rt.sv(f, "aoe_structure_damage"));
	rt.setFv(f, "aoe_structure_range", live(HS_BB), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "aoe_structure_range"), 15]))])));
	rt.setFv(f, "wall_devastate", live(HS_BB), rt.sv(f, "wall_devastate"));
	rt.setFv(f, "wall_pierce_amount", live(HS_BB), rt.sv(f, "wall_pierce_amount"));
	rt.setFv(f, "structure_pierce_amount", live(HS_BB), rt.sv(f, "structure_piercing"));
	rt.setFv(f, "structure_bleed_coeff", live(HS_BB), rt.sv(f, "structure_bleed_coeff"));
	rt.setFv(f, "do_pierce", live(HS_BB), rt.sv(f, "do_pierce"));
	rt.setFv(f, "gun", live(HS_BB), rt.sv(f, "host"));
	return f.dot;
}, true);

rt.type(8866, "/obj/item/projectile/beam/beam_rifle", "/obj/item/projectile/beam", {
	gun: null,
	structure_pierce_amount: 0,
	structure_bleed_coeff: 0,
	structure_pierce: 0,
	do_pierce: 1,
	wall_pierce_amount: 0,
	wall_pierce: 0,
	wall_devastate: 0,
	aoe_structure_range: 0,
	aoe_structure_damage: 0,
	aoe_fire_range: 0,
	aoe_fire_chance: 0,
	aoe_mob_range: 0,
	aoe_mob_damage: 0,
	impact_structure_damage: 0,
	impact_direct_damage: 0,
	cached: null,
	name: "particle beam",
	icon: "",
	hitsound: rt.rsc("sound/effects/explosion3.ogg"),
	damage: 0,
	damage_type: "fire",
	flag: "energy",
	range: 150,
	jitter: 10,
});

// /obj/item/projectile/beam/beam_rifle/proc/AOE  (code/modules/projectiles/guns/beam_rifle.dm:336)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/AOE", function* AOE(f: Frame, epicenter: Value) {
	let L: Value = null, _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [epicenter, L, _T, O, $e];
	if (!truthy(live(epicenter))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/explosion/fast"), [live(epicenter)]);
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "aoe_mob_range"), live(epicenter)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "adjustFireLoss", [rt.sv(f, "aoe_mob_damage")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＄！ sears you!</span>", [live(f.src)])]);
	}
	rt.endFor(f, 0);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "aoe_fire_range"), live(epicenter)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "aoe_fire_chance")]))) {
			yield* g.new_(f, T("/obj/effect/hotspot"), [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "aoe_structure_range"), live(epicenter)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
			if (isEqual(rt.fv(f, "level", live(O)), 1)) {
				continue;
			}
			yield* g.callName(f, live(O), "take_damage", [multiply(rt.sv(f, "aoe_structure_damage"), (yield* g.srcCall(f, "get_damage_coeff", live(O)))), "fire", "laser", 0]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/projectile/beam/beam_rifle/proc/check_pierce  (code/modules/projectiles/guns/beam_rifle.dm:352)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/check_pierce", function* check_pierce(f: Frame, target: Value) {
	let AM: Value = null, O: Value = null;
	f.vars = () => [target, AM, O];
	if (!truthy(rt.sv(f, "do_pierce"))) {
		return 0;
	}
	if (truthy((rt.istype(live(target), T("/turf/closed")) ? 1 : 0))) {
		if (rt.lt(rt.incSrcVar(f, "wall_pierce", 1, true), rt.sv(f, "wall_pierce_amount"))) {
			rt.setSv(f, "loc", live(target));
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "wall_devastate")]))) {
				yield* g.callName(f, live(target), "ex_act", [2]);
			}
			return 1;
		}
	}
	if (truthy((rt.istype(live(target), T("/atom/movable")) ? 1 : 0))) {
		if (((truthy(rt.gv(f, "density", (AM = live(target)))) && !truthy((yield* g.callName(f, live(AM), "CanPass", [live(f.src), rt.getStep(f, live(target), 0)])))) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)]))))) {
			if (rt.lt(rt.incSrcVar(f, "structure_pierce", 1, true), rt.sv(f, "structure_pierce_amount"))) {
				if (truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0))) {
					yield* g.callName(f, (O = live(AM)), "take_damage", [multiply(multiply(add(rt.sv(f, "impact_structure_damage"), rt.sv(f, "aoe_structure_damage")), rt.sv(f, "structure_bleed_coeff")), (yield* g.srcCall(f, "get_damage_coeff", live(AM)))), "fire", "energy", 0]);
				}
				rt.setSv(f, "loc", rt.getStep(f, live(AM), 0));
				return 1;
			}
		}
	}
	return 0;
}, true);

// /obj/item/projectile/beam/beam_rifle/proc/get_damage_coeff  (code/modules/projectiles/guns/beam_rifle.dm:372)
rt.def("/obj/item/projectile/beam/beam_rifle/proc/get_damage_coeff", function get_damage_coeff(f: Frame, target: Value) {
	if (truthy((rt.istype(live(target), T("/obj/machinery/door")) ? 1 : 0))) {
		return 0.4000000059604645;
	}
	if (truthy((rt.istype(live(target), T("/obj/structure/window")) ? 1 : 0))) {
		return 0.5;
	}
	return 1;
});

// /obj/item/projectile/beam/beam_rifle/proc/handle_impact  (code/modules/projectiles/guns/beam_rifle.dm:379)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/handle_impact", function* handle_impact(f: Frame, target: Value) {
	let O: Value = null, L: Value = null;
	f.vars = () => [target, O, L];
	if (truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
		yield* g.callName(f, (O = live(target)), "take_damage", [multiply(rt.sv(f, "impact_structure_damage"), (yield* g.srcCall(f, "get_damage_coeff", live(target)))), "fire", "laser", 0]);
	}
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (L = live(target)), "adjustFireLoss", [rt.sv(f, "impact_direct_damage")]);
	yield* g.callName(f, live(L), "emote", ["scream"]);
	return f.dot;
}, true);

// /obj/item/projectile/beam/beam_rifle/proc/handle_hit  (code/modules/projectiles/guns/beam_rifle.dm:389)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/handle_hit", function* handle_hit(f: Frame, target: Value) {
	f.vars = () => [target];
	if ((!truthy(rt.sv(f, "cached")) && !(!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))))) {
		rt.setSv(f, "cached", rt.getStep(f, live(target), 0));
	}
	if (truthy(rt.sv(f, "nodamage"))) {
		return 0;
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "cached"), rt.rsc("sound/effects/explosion3.ogg"), 100, 1]);
	yield* g.srcCall(f, "AOE", rt.sv(f, "cached"));
	if (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))) return f.dot;
	yield* g.srcCall(f, "handle_impact", live(target));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/projectile/beam/beam_rifle/proc/Bump  (code/modules/projectiles/guns/beam_rifle.dm:399)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/Bump", function* Bump(f: Frame) {
	if (truthy((yield* g.srcCall(f, "check_pierce", live(f.args[0]))))) {
		rt.modSrcVar(f, "permutated", live(f.args[0]), add);
		return 0;
	}
	if (!(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0]))))) {
		rt.setSv(f, "cached", rt.getStep(f, live(f.args[0]), 0));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "yes"] });

// /obj/item/projectile/beam/beam_rifle/proc/on_hit  (code/modules/projectiles/guns/beam_rifle.dm:407)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0]))))) {
		rt.setSv(f, "cached", rt.getStep(f, live(f.args[0]), 0));
	}
	yield* g.srcCall(f, "handle_hit", live(f.args[0]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(8867, "/obj/item/projectile/beam/beam_rifle/hitscan", "/obj/item/projectile/beam/beam_rifle", {
	tracer_type: rt.typePath("/obj/effect/temp_visual/projectile_beam/tracer"),
	icon_state: "",
});

// /obj/item/projectile/beam/beam_rifle/hitscan/proc/fire  (code/modules/projectiles/guns/beam_rifle.dm:418)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/fire", function* fire(f: Frame, setAngle: Value, direct_target: Value) {
	let next_run: Value = null, old_pixel_x: Value = null, old_pixel_y: Value = null, safety: Value = null, M: Value = null, Pixel_x: Value = null, Pixel_y: Value = null, pixel_x_offset: Value = null, pixel_y_offset: Value = null, new_x: Value = null, new_y: Value = null, delay: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any;
	f.vars = () => [setAngle, direct_target, next_run, old_pixel_x, old_pixel_y, safety, M, Pixel_x, Pixel_y, pixel_x_offset, pixel_y_offset, new_x, new_y, delay, $0, $1, $2, $3, $4, $5, $6, $7, $8];
	if (((!truthy(rt.sv(f, "log_override")) && truthy(rt.sv(f, "firer"))) && truthy(rt.sv(f, "original")))) {
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "firer"), rt.sv(f, "original"), "fired at", live(f.src), fmt(" ＀", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
	}
	if (truthy(live(setAngle))) {
		rt.setSv(f, "Angle", live(setAngle));
	}
	next_run = rt.worldTime(f);
	old_pixel_x = rt.sv(f, "pixel_x");
	old_pixel_y = rt.sv(f, "pixel_y");
	safety = 0;
	while (truthy(rt.sv(f, "loc"))) {
		if (rt.gt((safety = rt.inc(live(safety), 1)), multiply(rt.sv(f, "range"), 3))) {
			return live(f.dot);
		}
		if ((!truthy(rt.sv(f, "current")) || isEqual(rt.sv(f, "loc"), rt.sv(f, "current")))) {
			rt.setSv(f, "current", rt.locate((yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "x"), rt.sv(f, "xo")), rt.fv(f, "maxx", rt.world())]))])), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "y"), rt.sv(f, "yo")), rt.fv(f, "maxy", rt.world())]))])), rt.sv(f, "z")));
		}
		if (!truthy(rt.sv(f, "Angle"))) {
			rt.setSv(f, "Angle", (yield* g.call(f, P("/proc/round"), null, [(yield* g.call(f, P("/proc/Get_Angle"), null, [live(f.src), rt.sv(f, "current")]))])));
		}
		if (truthy(rt.sv(f, "spread"))) {
			rt.modSrcVar(f, "Angle", multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), rt.sv(f, "spread")), add);
		}
		yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [rt.sv(f, "Angle")]);
		rt.setSv(f, "transform", live(M));
		Pixel_x = add(rt.op(f, "Sin", [], [rt.sv(f, "Angle")]), multiply(multiply(16, rt.op(f, "Sin", [], [rt.sv(f, "Angle")])), 2));
		Pixel_y = add(rt.op(f, "Cos", [], [rt.sv(f, "Angle")]), multiply(multiply(16, rt.op(f, "Cos", [], [rt.sv(f, "Angle")])), 2));
		pixel_x_offset = add(live(old_pixel_x), live(Pixel_x));
		pixel_y_offset = add(live(old_pixel_y), live(Pixel_y));
		new_x = rt.sv(f, "x");
		new_y = rt.sv(f, "y");
		while (rt.gt(live(pixel_x_offset), 16)) {
			(pixel_x_offset = rt.modify(live(pixel_x_offset), 32, subtract));
			(old_pixel_x = rt.modify(live(old_pixel_x), 32, subtract));
			new_x = rt.inc(live(new_x), 1);
		}
		while (rt.lt(live(pixel_x_offset), -16)) {
			pixel_x_offset = rt.modify(live(pixel_x_offset), 32, add);
			old_pixel_x = rt.modify(live(old_pixel_x), 32, add);
			new_x = rt.inc(live(new_x), -1);
		}
		while (rt.gt(live(pixel_y_offset), 16)) {
			(pixel_y_offset = rt.modify(live(pixel_y_offset), 32, subtract));
			(old_pixel_y = rt.modify(live(old_pixel_y), 32, subtract));
			new_y = rt.inc(live(new_y), 1);
		}
		while (rt.lt(live(pixel_y_offset), -16)) {
			pixel_y_offset = rt.modify(live(pixel_y_offset), 32, add);
			old_pixel_y = rt.modify(live(old_pixel_y), 32, add);
			new_y = rt.inc(live(new_y), -1);
		}
		rt.setSv(f, "pixel_x", live(old_pixel_x));
		rt.setSv(f, "pixel_y", live(old_pixel_y));
		yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), rt.locate(live(new_x), live(new_y), rt.sv(f, "z"))]);
		next_run = rt.modify(live(next_run), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "tick_lag", rt.world()), rt.sv(f, "speed")])), add);
		if (rt.le((delay = subtract(live(next_run), rt.worldTime(f))), multiply(rt.fv(f, "tick_lag", rt.world()), 2))) {
			rt.setSv(f, "pixel_x", live(pixel_x_offset));
			rt.setSv(f, "pixel_y", live(pixel_y_offset));
		} else {
			$0 = null;
			$1 = live(f.src);
			$2 = "pixel_x";
			$3 = live(pixel_x_offset);
			$4 = "pixel_y";
			$5 = live(pixel_y_offset);
			$6 = "time";
			$7 = 1;
			if (rt.le(live(delay), 3)) {
				$8 = subtract(live(delay), 1);
			} else {
				$8 = live(delay);
			}
			rt.op(f, "Animate", [2, 10], [$0, $1, $2, $3, $4, $5, $6, (yield* g.call(f, P("/proc/max"), null, [$7, $8])), "flags", 1]);
		}
		old_pixel_x = live(pixel_x_offset);
		old_pixel_y = live(pixel_y_offset);
		if (((truthy(rt.sv(f, "original")) && rt.ge(rt.fv(f, "layer", rt.sv(f, "original")), 2.75)) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "original")]))))) {
			if (isEqual(rt.sv(f, "loc"), rt.getStep(f, rt.sv(f, "original"), 0))) {
				if (!truthy((rt.isIn(f, rt.sv(f, "original"), rt.sv(f, "permutated")) ? 1 : 0))) {
					yield* g.srcCall(f, "Bump", rt.sv(f, "original"), 1);
				}
			}
		}
		yield* g.srcCall(f, "Range");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/projectile/beam/beam_rifle/hitscan/proc/Range  (code/modules/projectiles/guns/beam_rifle.dm:479)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/Range", function* Range(f: Frame) {
	yield* g.srcCall(f, "spawn_tracer_effect");
	if (!(!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && truthy(rt.sv(f, "loc")))) return f.dot;
	rt.setSv(f, "cached", rt.getStep(f, live(f.src), 0));
	return f.dot;
}, true);

// /obj/item/projectile/beam/beam_rifle/hitscan/proc/spawn_tracer_effect  (code/modules/projectiles/guns/beam_rifle.dm:484)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/proc/spawn_tracer_effect", function* spawn_tracer_effect(f: Frame) {
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), (yield* g.new_(f, rt.sv(f, "tracer_type"), [null, rt.sv(f, "loc"), "time", 5, "angle_override", rt.sv(f, "Angle"), "p_x", rt.sv(f, "pixel_x"), "p_y", rt.sv(f, "pixel_y"), "color_override", rt.sv(f, "color")], rt.Args.Named))])), 5, 8]);
	return f.dot;
}, true);

rt.type(8868, "/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam", "/obj/item/projectile/beam/beam_rifle/hitscan", {
	tracer_type: rt.typePath("/obj/effect/temp_visual/projectile_beam/tracer/aiming"),
	name: "aiming beam",
	hitsound: null,
	hitsound_wall: null,
	nodamage: 1,
	damage: 0,
});

// /obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/prehit  (code/modules/projectiles/guns/beam_rifle.dm:495)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/prehit", function* prehit(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 0;
}, true);

// /obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/on_hit  (code/modules/projectiles/guns/beam_rifle.dm:499)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/on_hit", function* on_hit(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return 0;
}, true);

// /obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/spawn_tracer_effect  (code/modules/projectiles/guns/beam_rifle.dm:503)  may sleep
rt.def("/obj/item/projectile/beam/beam_rifle/hitscan/aiming_beam/proc/spawn_tracer_effect", function* spawn_tracer_effect(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = (yield* g.new_(f, rt.sv(f, "tracer_type"), [null, rt.sv(f, "loc"), "time", 5, "angle_override", rt.sv(f, "Angle"), "p_x", rt.sv(f, "pixel_x"), "p_y", rt.sv(f, "pixel_y"), "color_override", rt.sv(f, "color")], rt.Args.Named));
	if (!(truthy((rt.istype(rt.sv(f, "gun"), T("/obj/item/weapon/gun/energy/beam_rifle")) ? 1 : 0)) && truthy((rt.istype(live(_T), T("/obj/effect/temp_visual/projectile_beam")) ? 1 : 0)))) return f.dot;
	rt.setAt(rt.fv(f, "current_tracers", rt.sv(f, "gun")), live(_T), 1);
	return f.dot;
}, true);

rt.type(11691, "/obj/effect/temp_visual/projectile_beam", "/obj/effect/temp_visual", {
	anchored: 1,
	duration: 5,
	randomdir: 0,
	light_power: 1,
	light_range: 2,
	light_color: "#00ffff",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	layer: 4.1,
});

// /obj/effect/temp_visual/projectile_beam/proc/New  (code/modules/projectiles/guns/beam_rifle.dm:518)  may sleep
rt.def("/obj/effect/temp_visual/projectile_beam/proc/New", function* New(f: Frame) {
	let look: Value = null, M: Value = null;
	f.vars = () => [look, M];
	if (live(f.args[0]) === null) {
		f.args[0] = 5;
	}
	rt.setSv(f, "duration", live(f.args[0]));
	rt.setFv(f, "pixel_x", (look = (yield* g.new_(f, T("/mutable_appearance"), [live(f.src)]))), live(f.args[2]));
	rt.setFv(f, "pixel_y", live(look), live(f.args[3]));
	if (truthy(live(f.args[4]))) {
		rt.setFv(f, "color", live(look), live(f.args[4]));
	}
	yield* g.callName(f, (M = (yield* g.new_(f, T("/matrix"), []))), "Turn", [live(f.args[1])]);
	rt.setFv(f, "transform", live(look), live(M));
	rt.setSv(f, "appearance", live(look));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["time", "angle_override", "p_x", "p_y", "color_override"] });
