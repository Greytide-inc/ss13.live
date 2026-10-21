// From code/modules/projectiles/guns/energy/kinetic_accelerator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5167, "/obj/item/weapon/gun/energy/kinetic_accelerator", "/obj/item/weapon/gun/energy", {
	overheat_time: 16,
	holds_charge: 0,
	unique_frequency: 0,
	overheat: 0,
	max_mod_capacity: 100,
	modkits: null,
	empty_state: "kineticgun_empty",
	recharge_timerid: null,
	name: "proto-kinetic accelerator",
	desc: "A self recharging, ranged mining tool that does increased damage in low pressure.",
	icon_state: "kineticgun",
	item_state: "kineticgun",
	ammo_type: null,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/emproof"),
	needs_permit: 0,
	unique_rename: 1,
	origin_tech: "combat=3;powerstorage=3;engineering=3",
	weapon_weight: 1,
	can_flashlight: 1,
	flight_x_offset: 15,
	flight_y_offset: 9,
	can_bayonet: 1,
	knife_x_offset: 15,
	knife_y_offset: 13,
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/<init>  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:24)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "modkits", rt.list());
	$0 = $0;
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/kinetic")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/examine  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:30)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/examine", function examine(f: Frame) {
	let A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, M, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "max_mod_capacity"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>＀%</b> mod capacity remaining.", [rt.callSrc(f, "get_remaining_mod_capacity", [])])]);
	A = null;
	rt.forList(f, 0, rt.callSrc(f, "get_modkits", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		M = live(A);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>There is a ＀ mod installed, using <b>＀%</b> capacity.</span>", [rt.fv(f, "name", live(M)), rt.fv(f, "cost", live(M))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/attackby  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:38)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null, MK: Value = null;
	let $e: any;
	f.vars = () => [M, MK, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (truthy(rt.len(f, rt.sv(f, "modkits")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You pry the modifications out.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			M = null;
			rt.forList(f, 0, rt.sv(f, "modkits"), T("/obj/item/borg/upgrade/modkit"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				yield* g.callName(f, live(M), "uninstall", [live(f.src)]);
			}
			rt.endFor(f, 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There are no modifications currently installed.</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/borg/upgrade/modkit")) ? 1 : 0))) {
			yield* g.callName(f, (MK = live(f.args[0])), "install", [live(f.src), live(f.args[1])]);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_remaining_mod_capacity  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:54)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_remaining_mod_capacity", function get_remaining_mod_capacity(f: Frame) {
	let current_capacity_used: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [current_capacity_used, A, M, $e];
	current_capacity_used = 0;
	A = null;
	rt.forList(f, 0, rt.callSrc(f, "get_modkits", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		current_capacity_used = rt.modify(live(current_capacity_used), rt.gv(f, "cost", (M = live(A))), add);
	}
	rt.endFor(f, 0);
	return subtract(rt.sv(f, "max_mod_capacity"), live(current_capacity_used));
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_modkits  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:60)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/get_modkits", function get_modkits(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	f.dot = rt.list();
	A = null;
	rt.forList(f, 0, rt.sv(f, "modkits"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		f.dot = rt.modify(live(f.dot), live(A), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/modify_projectile  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:66)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	let A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, M, $e];
	rt.setFv(f, "kinetic_gun", live(K), live(f.src));
	A = null;
	rt.forList(f, 0, rt.callSrc(f, "get_modkits", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.callName(f, (M = live(A)), "modify_projectile", [live(K)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/Initialize  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:76)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "holds_charge"))) return f.dot;
	yield* g.srcCall(f, "empty");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/shoot_live_shot  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:81)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "attempt_reload");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/equipped  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:85)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/equipped", function* equipped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((yield* g.srcCall(f, "can_shoot")))) return f.dot;
	yield* g.srcCall(f, "attempt_reload");
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/dropped  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:90)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "holds_charge"))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty_if_not_held")])), 2]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty_if_not_held  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:97)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty_if_not_held", function* empty_if_not_held(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.srcCall(f, "empty");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:101)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/empty", function* empty(f: Frame) {
	yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "charge", rt.sv(f, "cell"))]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/attempt_reload  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:107)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/attempt_reload", function* attempt_reload(f: Frame, recharge_time: Value) {
	let carried: Value = null, K: Value = null;
	let $e: any;
	f.vars = () => [recharge_time, carried, K, $e];
	if (truthy(rt.sv(f, "overheat"))) {
		return live(f.dot);
	}
	if (!truthy(live(recharge_time))) {
		recharge_time = rt.sv(f, "overheat_time");
	}
	rt.setSv(f, "overheat", 1);
	carried = 0;
	if (!truthy(rt.sv(f, "unique_frequency"))) {
		K = null;
		rt.forList(f, 0, (yield* g.callName(f, rt.sv(f, "loc"), "GetAllContents", [])), T("/obj/item/weapon/gun/energy/kinetic_accelerator"));
		while (($e = rt.next(f, 0)) !== undefined) {
			K = $e;
			carried = rt.inc(live(carried), 1);
		}
		rt.endFor(f, 0);
		carried = (yield* g.call(f, P("/proc/max"), null, [live(carried), 1]));
	} else {
		carried = 1;
	}
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "recharge_timerid")]);
	rt.setSv(f, "recharge_timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/reload")])), multiply(live(recharge_time), live(carried)), 8])));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/reload  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:128)  may sleep
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/reload", function* reload(f: Frame) {
	yield* g.callName(f, rt.sv(f, "cell"), "give", [rt.fv(f, "maxcharge", rt.sv(f, "cell"))]);
	yield* g.srcCall(f, "recharge_newshot", 1);
	if (!truthy(rt.sv(f, "suppressed"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/kenetic_reload.ogg"), 60, 1]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='warning'>＀ silently charges up.<span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "overheat", 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/kinetic_accelerator/proc/update_icon  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:138)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "empty_state")) && !truthy(rt.callSrc(f, "can_shoot", [])))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.sv(f, "empty_state")]);
	return f.dot;
});

rt.type(8733, "/obj/item/ammo_casing/energy/kinetic", "/obj/item/ammo_casing/energy", {
	select_name: "kinetic",
	e_cost: 500,
	projectile_type: rt.typePath("/obj/item/projectile/kinetic"),
	fire_sound: rt.rsc("sound/weapons/kenetic_accel.ogg"),
});

// /obj/item/ammo_casing/energy/kinetic/proc/ready_proj  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:151)  may sleep
rt.def("/obj/item/ammo_casing/energy/kinetic/proc/ready_proj", function* ready_proj(f: Frame) {
	let KA: Value = null;
	f.vars = () => [KA];
	if (live(f.args[3]) === null) {
		f.args[3] = "";
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/gun/energy/kinetic_accelerator")) ? 1 : 0)))) return f.dot;
	yield* g.callName(f, (KA = rt.sv(f, "loc")), "modify_projectile", [rt.sv(f, "BB")]);
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });

rt.type(8896, "/obj/item/projectile/kinetic", "/obj/item/projectile", {
	pressure_decrease_active: 0,
	pressure_decrease: 0.25,
	kinetic_gun: null,
	name: "kinetic force",
	icon_state: null,
	damage: 40,
	damage_type: "brute",
	flag: "bomb",
	range: 3,
	log_override: 1,
});

// /obj/item/projectile/kinetic/proc/Destroy  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:172)  may sleep
rt.def("/obj/item/projectile/kinetic/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "kinetic_gun", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/projectile/kinetic/proc/prehit  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:175)  may sleep
rt.def("/obj/item/projectile/kinetic/proc/prehit", function* prehit(f: Frame) {
	let target_turf: Value = null, mods: Value = null, M: Value = null, environment: Value = null, pressure: Value = null;
	let $e: any;
	f.vars = () => [target_turf, mods, M, environment, pressure, $e];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(target_turf = rt.getStep(f, live(f.args[0]), 0))])))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (truthy(rt.sv(f, "kinetic_gun"))) {
		mods = (yield* g.callName(f, rt.sv(f, "kinetic_gun"), "get_modkits", []));
		M = null;
		rt.forList(f, 0, live(mods), T("/obj/item/borg/upgrade/modkit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "projectile_prehit", [live(f.src), live(f.args[0]), rt.sv(f, "kinetic_gun")]);
		}
		rt.endFor(f, 0);
	}
	environment = (yield* g.callName(f, live(target_turf), "return_air", []));
	if (!rt.gt((pressure = (yield* g.callName(f, live(environment), "return_pressure", []))), 50)) return f.dot;
	rt.setSv(f, "name", fmt("weakened ＀", [rt.sv(f, "name")]));
	rt.setSv(f, "damage", multiply(rt.sv(f, "damage"), rt.sv(f, "pressure_decrease")));
	rt.setSv(f, "pressure_decrease_active", 1);
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/projectile/kinetic/proc/on_range  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:192)  may sleep
rt.def("/obj/item/projectile/kinetic/proc/on_range", function* on_range(f: Frame) {
	yield* g.srcCall(f, "strike_thing");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/projectile/kinetic/proc/on_hit  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:196)  may sleep
rt.def("/obj/item/projectile/kinetic/proc/on_hit", function* on_hit(f: Frame) {
	yield* g.srcCall(f, "strike_thing", live(f.args[0]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target"] });

// /obj/item/projectile/kinetic/proc/strike_thing  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:200)  may sleep
rt.def("/obj/item/projectile/kinetic/proc/strike_thing", function* strike_thing(f: Frame, target: Value) {
	let target_turf: Value = null, mods: Value = null, M: Value = null, M_1: Value = null, K: Value = null;
	let $e: any;
	f.vars = () => [target, target_turf, mods, M, M_1, K, $e];
	if (!truthy((target_turf = rt.getStep(f, live(target), 0)))) {
		target_turf = rt.getStep(f, live(f.src), 0);
	}
	if (truthy(rt.sv(f, "kinetic_gun"))) {
		mods = (yield* g.callName(f, rt.sv(f, "kinetic_gun"), "get_modkits", []));
		M = null;
		rt.forList(f, 0, live(mods), T("/obj/item/borg/upgrade/modkit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "projectile_strike_predamage", [live(f.src), live(target_turf), live(target), rt.sv(f, "kinetic_gun")]);
		}
		rt.endFor(f, 0);
		M = null;
		rt.forList(f, 0, live(mods), T("/obj/item/borg/upgrade/modkit"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.callName(f, live(M), "projectile_strike", [live(f.src), live(target_turf), live(target), rt.sv(f, "kinetic_gun")]);
		}
		rt.endFor(f, 0);
	}
	if (truthy((rt.istype(live(target_turf), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.callName(f, (M_1 = live(target_turf)), "gets_drilled", [rt.sv(f, "firer")]);
	}
	rt.setFv(f, "color", (K = (yield* g.new_(f, T("/obj/effect/temp_visual/kinetic_blast"), [live(target_turf)]))), rt.sv(f, "color"));
	return f.dot;
}, true);

rt.type(9841, "/obj/item/borg/upgrade/modkit", "/obj/item/borg/upgrade", {
	denied_type: null,
	maximum_of_type: 1,
	cost: 30,
	modifier: 1,
	origin_tech: "programming=2;materials=2;magnets=4",
	w_class: 2,
	require_module: 1,
	module_type: rt.typePath("/obj/item/weapon/robot_module/miner"),
	name: "kinetic accelerator modification kit",
	desc: "An upgrade for kinetic accelerators.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "modkit",
});

// /obj/item/borg/upgrade/modkit/proc/modify_projectile  empty
rt.def("/obj/item/borg/upgrade/modkit/proc/modify_projectile", undefined, false, { args: ["K"] });

// /obj/item/borg/upgrade/modkit/proc/projectile_prehit  empty
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_prehit", undefined, false, { args: ["K", "target", "KA"] });

// /obj/item/borg/upgrade/modkit/proc/projectile_strike_predamage  empty
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_strike_predamage", undefined, false, { args: ["K", "target_turf", "target", "KA"] });

// /obj/item/borg/upgrade/modkit/proc/projectile_strike  empty
rt.def("/obj/item/borg/upgrade/modkit/proc/projectile_strike", undefined, false, { args: ["K", "target_turf", "target", "KA"] });

// /obj/item/borg/upgrade/modkit/proc/examine  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:232)
rt.def("/obj/item/borg/upgrade/modkit/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Occupies <b>＀%</b> of mod capacity.</span>", [rt.sv(f, "cost")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/borg/upgrade/modkit/proc/attackby  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:236)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/kinetic_accelerator")) ? 1 : 0)) && !truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon")) ? 1 : 0)))) {
		yield* g.srcCall(f, "install", live(f.args[0]), live(f.args[1]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/borg/upgrade/modkit/proc/action  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:242)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/proc/action", function* action(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	H = null;
	rt.forList(f, 0, rt.gv(f, "modules", rt.fv(f, "module", live(f.args[0]))), T("/obj/item/weapon/gun/energy/kinetic_accelerator/cyborg"));
	if (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		return (yield* g.srcCall(f, "install", live(H), live(f.usr)));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["R"] });

// /obj/item/borg/upgrade/modkit/proc/install  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:252)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/proc/install", function* install(f: Frame, KA: Value, user: Value) {
	let number_of_denied: Value = null, A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [KA, user, number_of_denied, A, M, $e];
	f.dot = 1;
	if (truthy(rt.sv(f, "denied_type"))) {
		number_of_denied = 0;
		A = null;
		rt.forList(f, 0, (yield* g.callName(f, live(KA), "get_modkits", [])));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (truthy(rt.op(f, "IsType", [], [(M = live(A)), rt.sv(f, "denied_type")]))) {
				number_of_denied = rt.inc(live(number_of_denied), 1);
			}
			if (rt.ge(live(number_of_denied), rt.sv(f, "maximum_of_type"))) {
				f.dot = 0;
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (rt.ge((yield* g.callName(f, live(KA), "get_remaining_mod_capacity", [])), rt.sv(f, "cost"))) {
		if (truthy(live(f.dot))) {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(f.src), live(KA)])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You install the modkit.</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/screwdriver.ogg"), 100, 1]);
			rt.modField(f, live(KA), "modkits", live(f.src), add);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The modkit you're trying to install would conflict with an already installed modkit. Use a crowbar to remove existing modkits.</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You don't have room(<b>＀%</b> remaining, ＀% needed) to install this modkit. Use a crowbar to remove existing modkits.</span>", [(yield* g.callName(f, live(KA), "get_remaining_mod_capacity", [])), rt.sv(f, "cost")])]);
		f.dot = 0;
	}
	return f.dot;
}, true);

// /obj/item/borg/upgrade/modkit/proc/uninstall  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:273)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/proc/uninstall", function* uninstall(f: Frame, KA: Value) {
	f.vars = () => [KA];
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(KA), 0));
	(rt.modField(f, live(KA), "modkits", live(f.src), subtract));
	return f.dot;
}, true);

rt.type(9844, "/obj/item/borg/upgrade/modkit/cooldown", "/obj/item/borg/upgrade/modkit", {
	modifier: 2.5,
	name: "cooldown decrease",
	desc: "Decreases the cooldown of a kinetic accelerator.",
});

// /obj/item/borg/upgrade/modkit/cooldown/proc/install  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:313)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/cooldown/proc/install", function* install(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modField(f, live(f.args[0]), "overheat_time", rt.sv(f, "modifier"), subtract));
	return f.dot;
}, true, { args: ["KA", "user"] });

// /obj/item/borg/upgrade/modkit/cooldown/proc/uninstall  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:319)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/cooldown/proc/uninstall", function* uninstall(f: Frame) {
	rt.modField(f, live(f.args[0]), "overheat_time", rt.sv(f, "modifier"), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["KA"] });

rt.type(9846, "/obj/item/borg/upgrade/modkit/aoe", "/obj/item/borg/upgrade/modkit", {
	turf_aoe: 0,
	stats_stolen: 0,
	modifier: 0,
});

// /obj/item/borg/upgrade/modkit/aoe/proc/install  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:329)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/install", function* install(f: Frame) {
	let AOE: Value = null;
	let $e: any;
	f.vars = () => [AOE, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	AOE = null;
	rt.forList(f, 0, rt.fv(f, "modkits", live(f.args[0])), T("/obj/item/borg/upgrade/modkit/aoe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AOE = $e;
		if ((truthy(rt.fv(f, "stats_stolen", live(AOE))) || isEqual(live(AOE), live(f.src)))) {
			continue;
		}
		rt.modSrcVar(f, "modifier", rt.fv(f, "modifier", live(AOE)), add);
		rt.setFv(f, "modifier", live(AOE), 0);
		rt.modSrcVar(f, "turf_aoe", rt.fv(f, "turf_aoe", live(AOE)), add);
		rt.setFv(f, "turf_aoe", live(AOE), 0);
		rt.setFv(f, "stats_stolen", live(AOE), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["KA", "user"] });

// /obj/item/borg/upgrade/modkit/aoe/proc/uninstall  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:341)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/uninstall", function* uninstall(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "modifier", rt.initial(f, live(f.src), "modifier"));
	rt.setSv(f, "turf_aoe", rt.initial(f, live(f.src), "turf_aoe"));
	rt.setSv(f, "stats_stolen", 0);
	return f.dot;
}, true, { args: ["KA"] });

// /obj/item/borg/upgrade/modkit/aoe/proc/modify_projectile  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:347)
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	rt.setFv(f, "name", live(K), "kinetic explosion");
	return f.dot;
});

// /obj/item/borg/upgrade/modkit/aoe/proc/projectile_strike  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:352)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/aoe/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let _T: Value = null, M: Value = null, L: Value = null, armor: Value = null;
	let $e: any;
	f.vars = () => [K, target_turf, target, KA, _T, M, L, armor, $e];
	if (truthy(rt.sv(f, "stats_stolen"))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/explosion/fast"), [live(target_turf)]);
	if (truthy(rt.sv(f, "turf_aoe"))) {
		_T = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(target_turf)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(target_turf)), 1), 1])), rt.fv(f, "z", live(target_turf))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(target_turf)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(target_turf)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(target_turf)))])), live(target_turf)));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0))) {
				yield* g.callName(f, (M = live(_T)), "gets_drilled", [rt.fv(f, "firer", live(K))]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "modifier"))) return f.dot;
	L = null;
	rt.forList(f, 0, subtract(subtract((yield* g.call(f, P("/proc/range"), null, [1, live(target_turf)])), rt.fv(f, "firer", live(K))), live(target)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		armor = (yield* g.callName(f, live(L), "run_armor_check", [rt.fv(f, "def_zone", live(K)), rt.fv(f, "flag", live(K)), "", "", rt.fv(f, "armour_penetration", live(K))]));
		yield* g.callName(f, live(L), "apply_damage", [multiply(rt.fv(f, "damage", live(K)), rt.sv(f, "modifier")), rt.fv(f, "damage_type", live(K)), rt.fv(f, "def_zone", live(K)), live(armor)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>You're struck by a ＀!</span>", [rt.fv(f, "name", live(K))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(9845, "/obj/item/borg/upgrade/modkit/cooldown/repeater", "/obj/item/borg/upgrade/modkit/cooldown", {
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/cooldown/repeater"),
	modifier: -14,
	cost: 50,
	name: "rapid repeater",
	desc: "Quarters the kinetic accelerator's cooldown on striking a living target, but greatly increases the base cooldown.",
});

// /obj/item/borg/upgrade/modkit/cooldown/repeater/proc/projectile_strike_predamage  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:391)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/cooldown/repeater/proc/projectile_strike_predamage", function* projectile_strike_predamage(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let valid_repeat: Value = null, L: Value = null;
	f.vars = () => [K, target_turf, target, KA, valid_repeat, L];
	valid_repeat = 0;
	if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
		if (!isEqual(rt.gv(f, "stat", (L = live(target))), 2)) {
			valid_repeat = 1;
		}
	}
	if (truthy((rt.istype(live(target_turf), T("/turf/closed/mineral")) ? 1 : 0))) {
		valid_repeat = 1;
	}
	if (!truthy(live(valid_repeat))) return f.dot;
	rt.setFv(f, "overheat", live(KA), 0);
	yield* g.callName(f, live(KA), "attempt_reload", [multiply(rt.fv(f, "overheat_time", live(KA)), 0.25)]);
	return f.dot;
}, true);

rt.type(9850, "/obj/item/borg/upgrade/modkit/lifesteal", "/obj/item/borg/upgrade/modkit", {
	modifier: 2.5,
	cost: 20,
	name: "lifesteal crystal",
	desc: "Causes kinetic accelerator shots to slightly heal the firer on striking a living target.",
	icon_state: "modkit_crystal",
}, { global: { damage_heal_order: 742 } });

// /obj/item/borg/upgrade/modkit/lifesteal/proc/projectile_prehit  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:410)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/lifesteal/proc/projectile_prehit", function* projectile_prehit(f: Frame, K: Value, target: Value, KA: Value) {
	let L: Value = null;
	f.vars = () => [K, target, KA, L];
	if (!(truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)) && truthy((rt.istype(rt.fv(f, "firer", live(K)), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (isEqual(rt.gv(f, "stat", (L = live(target))), 2)) {
		return live(f.dot);
	}
	yield* g.callName(f, (L = rt.fv(f, "firer", live(K))), "heal_ordered_damage", [rt.sv(f, "modifier"), rt.gl("damage_heal_order#4")]);
	return f.dot;
}, true);

rt.type(9851, "/obj/item/borg/upgrade/modkit/resonator_blasts", "/obj/item/borg/upgrade/modkit", {
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/resonator_blasts"),
	cost: 30,
	modifier: 0.25,
	name: "resonator blast",
	desc: "Causes kinetic accelerator shots to leave and detonate resonator blasts.",
});

// /obj/item/borg/upgrade/modkit/resonator_blasts/proc/projectile_strike  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:425)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/resonator_blasts/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let R: Value = null;
	f.vars = () => [K, target_turf, target, KA, R];
	if (!(truthy(live(target_turf)) && !truthy((rt.istype(live(target_turf), T("/turf/closed/mineral")) ? 1 : 0)))) return f.dot;
	if (truthy((R = rt.locateIn(f, T("/obj/effect/temp_visual/resonance"), live(target_turf))))) {
		rt.setFv(f, "damage_multiplier", live(R), rt.sv(f, "modifier"));
		yield* g.callName(f, live(R), "burst", []);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/resonance"), [live(target_turf), rt.fv(f, "firer", live(K)), null, 30]);
	return f.dot;
}, true);

rt.type(9852, "/obj/item/borg/upgrade/modkit/bounty", "/obj/item/borg/upgrade/modkit", {
	maximum_bounty: 25,
	bounties_reaped: null,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/bounty"),
	modifier: 1.25,
	cost: 30,
	name: "death syphon",
	desc: "Killing or assisting in killing a creature permenantly increases your damage against that type of creature.",
});

// /obj/item/borg/upgrade/modkit/bounty/proc/<init>  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:440)
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bounties_reaped", rt.list());
	return f.dot;
});

// /obj/item/borg/upgrade/modkit/bounty/proc/projectile_prehit  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:443)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/projectile_prehit", function* projectile_prehit(f: Frame, K: Value, target: Value, KA: Value) {
	let L: Value = null, existing_marks: Value = null, i: Value = null, SM: Value = null;
	let $e: any;
	f.vars = () => [K, target, KA, L, existing_marks, i, SM, $e];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
	L = live(target);
	existing_marks = (yield* g.callName(f, live(L), "has_status_effect_list", [T("/datum/status_effect/syphon_mark")]));
	i = null;
	rt.forList(f, 0, live(existing_marks));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (isEqual(rt.gv(f, "reward_target", (SM = live(i))), live(f.src))) {
			rt.setFv(f, "reward_target", live(SM), null);
			yield* g.call(f, P("/proc/qdel"), null, [live(SM)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/syphon_mark"), live(f.src)]);
	return f.dot;
}, true);

// /obj/item/borg/upgrade/modkit/bounty/proc/projectile_strike  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:454)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/projectile_strike", function* projectile_strike(f: Frame, K: Value, target_turf: Value, target: Value, KA: Value) {
	let L: Value = null, kill_modifier: Value = null, armor: Value = null;
	f.vars = () => [K, target_turf, target, KA, L, kill_modifier, armor];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
	L = live(target);
	if (!truthy(rt.index(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L))))) return f.dot;
	kill_modifier = 1;
	if (truthy(rt.fv(f, "pressure_decrease_active", live(K)))) {
		(kill_modifier = rt.modify(live(kill_modifier), rt.fv(f, "pressure_decrease", live(K)), multiply));
	}
	armor = (yield* g.callName(f, live(L), "run_armor_check", [rt.fv(f, "def_zone", live(K)), rt.fv(f, "flag", live(K)), "", "", rt.fv(f, "armour_penetration", live(K))]));
	yield* g.callName(f, live(L), "apply_damage", [multiply(rt.index(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L))), live(kill_modifier)), rt.fv(f, "damage_type", live(K)), rt.fv(f, "def_zone", live(K)), live(armor)]);
	return f.dot;
}, true);

// /obj/item/borg/upgrade/modkit/bounty/proc/get_kill  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:465)
rt.def("/obj/item/borg/upgrade/modkit/bounty/proc/get_kill", function get_kill(f: Frame, L: Value) {
	let bonus_mod: Value = null;
	f.vars = () => [bonus_mod];
	bonus_mod = 1;
	if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
		bonus_mod = 4;
	}
	if (!truthy(rt.index(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L))))) {
		rt.setAt(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L)), rt.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "modifier"), live(bonus_mod)), rt.sv(f, "maximum_bounty")]));
	} else {
		rt.setAt(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L)), rt.call(f, P("/proc/min"), null, [add(rt.index(rt.sv(f, "bounties_reaped"), rt.fv(f, "type", live(L))), multiply(rt.sv(f, "modifier"), live(bonus_mod))), rt.sv(f, "maximum_bounty")]));
	}
	return f.dot;
});

rt.type(9853, "/obj/item/borg/upgrade/modkit/indoors", "/obj/item/borg/upgrade/modkit", {
	modifier: 2,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/indoors"),
	maximum_of_type: 2,
	cost: 35,
	name: "decrease pressure penalty",
	desc: "A syndicate modification kit that increases the damage a kinetic accelerator does in a high pressure environment.",
});

// /obj/item/borg/upgrade/modkit/indoors/proc/modify_projectile  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:482)
rt.def("/obj/item/borg/upgrade/modkit/indoors/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	(rt.modField(f, live(K), "pressure_decrease", rt.sv(f, "modifier"), multiply));
	return f.dot;
});

rt.type(9854, "/obj/item/borg/upgrade/modkit/trigger_guard", "/obj/item/borg/upgrade/modkit", {
	cost: 20,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/trigger_guard"),
	name: "modified trigger guard",
	desc: "Allows creatures normally incapable of firing guns to operate the weapon when installed.",
});

// /obj/item/borg/upgrade/modkit/trigger_guard/proc/install  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:493)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/trigger_guard/proc/install", function* install(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "trigger_guard", live(f.args[0]), -1);
	return f.dot;
}, true, { args: ["KA", "user"] });

// /obj/item/borg/upgrade/modkit/trigger_guard/proc/uninstall  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:498)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/trigger_guard/proc/uninstall", function* uninstall(f: Frame) {
	rt.setFv(f, "trigger_guard", live(f.args[0]), 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["KA"] });

rt.type(9855, "/obj/item/borg/upgrade/modkit/chassis_mod", "/obj/item/borg/upgrade/modkit", {
	chassis_icon: "kineticgun_u",
	chassis_name: "super-kinetic accelerator",
	cost: 0,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/chassis_mod"),
	name: "super chassis",
	desc: "Makes your KA yellow. All the fun of having a more powerful KA without actually having a more powerful KA.",
});

// /obj/item/borg/upgrade/modkit/chassis_mod/proc/install  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:513)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/chassis_mod/proc/install", function* install(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "icon_state", live(f.args[0]), rt.sv(f, "chassis_icon"));
	rt.setFv(f, "name", live(f.args[0]), rt.sv(f, "chassis_name"));
	return f.dot;
}, true, { args: ["KA", "user"] });

// /obj/item/borg/upgrade/modkit/chassis_mod/proc/uninstall  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:519)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/chassis_mod/proc/uninstall", function* uninstall(f: Frame) {
	rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, live(f.args[0]), "icon_state"));
	rt.setFv(f, "name", live(f.args[0]), rt.initial(f, live(f.args[0]), "name"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["KA"] });

rt.type(9857, "/obj/item/borg/upgrade/modkit/tracer", "/obj/item/borg/upgrade/modkit", {
	bolt_color: "#FFFFFF",
	cost: 0,
	denied_type: rt.typePath("/obj/item/borg/upgrade/modkit/tracer"),
	name: "white tracer bolts",
	desc: "Causes kinetic accelerator bolts to have a white tracer trail and explosion.",
});

// /obj/item/borg/upgrade/modkit/tracer/proc/modify_projectile  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:537)
rt.def("/obj/item/borg/upgrade/modkit/tracer/proc/modify_projectile", function modify_projectile(f: Frame, K: Value) {
	rt.setFv(f, "icon_state", live(K), "ka_tracer");
	rt.setFv(f, "color", live(K), rt.sv(f, "bolt_color"));
	return f.dot;
});

rt.type(9858, "/obj/item/borg/upgrade/modkit/tracer/adjustable", "/obj/item/borg/upgrade/modkit/tracer", {
	name: "adjustable tracer bolts",
	desc: "Causes kinetic accelerator bolts to have a adjustably-colored tracer trail and explosion. Use in-hand to change color.",
});

// /obj/item/borg/upgrade/modkit/tracer/adjustable/proc/attack_self  (code/modules/projectiles/guns/energy/kinetic_accelerator.dm:545)  may sleep
rt.def("/obj/item/borg/upgrade/modkit/tracer/adjustable/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "bolt_color", (yield* g.op(f, "Prompt", [256], [null, null, "Choose Color", live(user), null])));
	return f.dot;
}, true);
