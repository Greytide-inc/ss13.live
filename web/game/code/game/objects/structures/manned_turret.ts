// From code/game/objects/structures/manned_turret.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10877, "/obj/machinery/manned_turret", "/obj/machinery", {
	view_range: 10,
	cooldown: 0,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	rate_of_fire: 1,
	number_of_shots: 40,
	cooldown_duration: 90,
	target: null,
	target_turf: null,
	warned: 0,
	calculated_projectile_vars: null,
	can_buckle: 1,
	buckle_lying: 0,
	name: "machine gun turret",
	desc: "While the trigger is held down, this gun will redistribute recoil to allow its user to easily shift targets.",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "machinegun",
	density: 1,
	max_integrity: 100,
	obj_integrity: 100,
	layer: 4.1,
});

// /obj/machinery/manned_turret/proc/Destroy  (code/game/objects/structures/manned_turret.dm:28)  may sleep
rt.def("/obj/machinery/manned_turret/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "target", null);
	rt.setSv(f, "target_turf", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/manned_turret/proc/unbuckle_mob  (code/game/objects/structures/manned_turret.dm:33)  may sleep
rt.def("/obj/machinery/manned_turret/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(f.args[0])), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/gun_control")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		rt.setFv(f, "pixel_x", live(f.args[0]), 0);
		rt.setFv(f, "pixel_y", live(f.args[0]), 0);
		if (truthy(rt.fv(f, "client", live(f.args[0])))) {
			yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "default_view", []))]);
		}
	}
	rt.setSv(f, "anchored", 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// /obj/machinery/manned_turret/proc/user_buckle_mob  (code/game/objects/structures/manned_turret.dm:47)  may sleep
rt.def("/obj/machinery/manned_turret/proc/user_buckle_mob", function* user_buckle_mob(f: Frame) {
	let V: Value = null, I: Value = null, TC: Value = null;
	let $e: any;
	f.vars = () => [V, I, TC, $e];
	if ((truthy((yield* g.callName(f, live(f.args[1]), "incapacitated", []))) || !truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	V = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(f.args[0])));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy((rt.istype((I = live(V)), T("/obj/item")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(I)])))) {
				TC = (yield* g.new_(f, T("/obj/item/gun_control"), [live(f.src)]));
				yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(TC)]);
			}
		} else {
			TC = (yield* g.new_(f, T("/obj/item/gun_control"), [live(f.src)]));
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(TC)]);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "pixel_y", live(f.args[0]), 14);
	rt.setSv(f, "layer", 4.099999904632568);
	yield* g.srcCall(f, "setDir", 2);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/mecha/mechmove01.ogg"), 50, 1]);
	rt.setSv(f, "anchored", 1);
	if (truthy(rt.fv(f, "client", live(f.args[0])))) {
		yield* g.callName(f, rt.fv(f, "client", live(f.args[0])), "change_view", [rt.sv(f, "view_range")]);
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/machinery/manned_turret/proc/process  (code/game/objects/structures/manned_turret.dm:72)  may sleep
rt.def("/obj/machinery/manned_turret/proc/process", function* process(f: Frame) {
	if (!truthy(rt.length(rt.sv(f, "buckled_mobs")))) {
		return 26;
	}
	yield* g.srcCall(f, "update_positioning");
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/manned_turret/proc/update_positioning  (code/game/objects/structures/manned_turret.dm:77)  may sleep
rt.def("/obj/machinery/manned_turret/proc/update_positioning", function* update_positioning(f: Frame) {
	let controller: Value = null, C: Value = null, A: Value = null, _T: Value = null;
	f.vars = () => [controller, C, A, _T];
	if (!truthy((rt.istype((controller = rt.index(rt.sv(f, "buckled_mobs"), 1)), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((C = rt.fv(f, "client", live(controller))))) return f.dot;
	A = rt.fv(f, "mouseObject", live(C));
	if (!truthy((rt.istype((_T = rt.getStep(f, live(A), 0)), T("/turf")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "direction_track", live(controller), live(_T));
	rt.setSv(f, "calculated_projectile_vars", (yield* g.call(f, P("/proc/calculate_projectile_angle_and_pixel_offsets"), null, [live(controller), rt.fv(f, "mouseParams", live(C))])));
	return f.dot;
}, true);

// /obj/machinery/manned_turret/proc/direction_track  (code/game/objects/structures/manned_turret.dm:89)  may sleep
rt.def("/obj/machinery/manned_turret/proc/direction_track", function* direction_track(f: Frame, user: Value, targeted: Value) {
	let $0: any;
	f.vars = () => [user, targeted, $0];
	if (!isEqual(rt.fv(f, "stat", live(user)), 0)) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "setDir", rt.getDir(f, live(f.src), live(targeted)));
	yield* g.callName(f, live(user), "setDir", [rt.sv(f, "dir")]);
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setFv(f, "pixel_x", live(user), 0);
		rt.setFv(f, "pixel_y", live(user), -14);
	} else if ($0 === 5) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setFv(f, "pixel_x", live(user), -8);
		rt.setFv(f, "pixel_y", live(user), -4);
	} else if ($0 === 4) {
		rt.setSv(f, "layer", 4.099999904632568);
		rt.setFv(f, "pixel_x", live(user), -14);
		rt.setFv(f, "pixel_y", live(user), 0);
	} else if ($0 === 6) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setFv(f, "pixel_x", live(user), -8);
		rt.setFv(f, "pixel_y", live(user), 4);
	} else if ($0 === 2) {
		rt.setSv(f, "layer", 4.099999904632568);
		rt.setFv(f, "pixel_x", live(user), 0);
		rt.setFv(f, "pixel_y", live(user), 14);
	} else if ($0 === 10) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setFv(f, "pixel_x", live(user), 8);
		rt.setFv(f, "pixel_y", live(user), 4);
	} else if ($0 === 8) {
		rt.setSv(f, "layer", 4.099999904632568);
		rt.setFv(f, "pixel_x", live(user), 14);
		rt.setFv(f, "pixel_y", live(user), 0);
	} else if ($0 === 9) {
		rt.setSv(f, "layer", 3.700000047683716);
		rt.setFv(f, "pixel_x", live(user), 8);
		rt.setFv(f, "pixel_y", live(user), -4);
	}
	return f.dot;
}, true);

// /obj/machinery/manned_turret/proc/checkfire  (code/game/objects/structures/manned_turret.dm:128)  may sleep
rt.def("/obj/machinery/manned_turret/proc/checkfire", function* checkfire(f: Frame, targeted_atom: Value, user: Value) {
	f.vars = () => [targeted_atom, user];
	rt.setSv(f, "target", live(targeted_atom));
	if ((isEqual(rt.sv(f, "target"), live(user)) || isEqual(rt.sv(f, "target"), rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), rt.sv(f, "cooldown"))) {
		if ((!truthy(rt.sv(f, "warned")) && rt.gt(rt.worldTime(f), add(subtract(rt.sv(f, "cooldown"), rt.sv(f, "cooldown_duration")), multiply(rt.sv(f, "rate_of_fire"), rt.sv(f, "number_of_shots")))))) {
			rt.setSv(f, "warned", 1);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/sear.ogg"), 100, 1]);
		}
		return live(f.dot);
	} else {
		rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown_duration")));
		rt.setSv(f, "warned", 0);
		yield* g.srcCall(f, "volley", live(user));
	}
	return f.dot;
}, true);

// /obj/machinery/manned_turret/proc/volley  (code/game/objects/structures/manned_turret.dm:142)  may sleep
rt.def("/obj/machinery/manned_turret/proc/volley", function* volley(f: Frame, user: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [user, i, $e];
	rt.setSv(f, "target_turf", rt.getStep(f, rt.sv(f, "target"), 0));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "number_of_shots"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/manned_turret/proc/fire_helper"), live(user)])), multiply(live(i), rt.sv(f, "rate_of_fire"))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/manned_turret/proc/fire_helper  (code/game/objects/structures/manned_turret.dm:147)  may sleep
rt.def("/obj/machinery/manned_turret/proc/fire_helper", function* fire_helper(f: Frame, user: Value) {
	let targets_from: Value = null, _P: Value = null;
	f.vars = () => [user, targets_from, _P];
	yield* g.srcCall(f, "update_positioning");
	targets_from = rt.getStep(f, live(f.src), 0);
	if ((!truthy(rt.sv(f, "target")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "target"))))) {
		rt.setSv(f, "target", rt.sv(f, "target_turf"));
	}
	rt.setFv(f, "current", (_P = (yield* g.new_(f, rt.sv(f, "projectile_type"), [live(targets_from)]))), live(targets_from));
	rt.setFv(f, "starting", live(_P), live(targets_from));
	rt.setFv(f, "firer", live(_P), live(user));
	rt.setFv(f, "original", live(_P), rt.sv(f, "target"));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/gunshot_smg.ogg"), 75, 1]);
	rt.setFv(f, "xo", live(_P), subtract(rt.fv(f, "x", rt.sv(f, "target")), rt.fv(f, "x", live(targets_from))));
	rt.setFv(f, "yo", live(_P), subtract(rt.fv(f, "y", rt.sv(f, "target")), rt.fv(f, "y", live(targets_from))));
	rt.setFv(f, "Angle", live(_P), add(rt.index(rt.sv(f, "calculated_projectile_vars"), 1), (yield* g.call(f, P("/proc/rand"), null, [-9, 9]))));
	rt.setFv(f, "p_x", live(_P), rt.index(rt.sv(f, "calculated_projectile_vars"), 2));
	rt.setFv(f, "p_y", live(_P), rt.index(rt.sv(f, "calculated_projectile_vars"), 3));
	yield* g.callName(f, live(_P), "fire", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

rt.type(10878, "/obj/machinery/manned_turret/ultimate", "/obj/machinery/manned_turret", {
	view_range: 12,
	projectile_type: rt.typePath("/obj/item/projectile/bullet/weakbullet3"),
	name: "Infinity Gun",
});

// /obj/machinery/manned_turret/ultimate/proc/checkfire  (code/game/objects/structures/manned_turret.dm:170)  may sleep
rt.def("/obj/machinery/manned_turret/ultimate/proc/checkfire", function* checkfire(f: Frame, targeted_atom: Value, user: Value) {
	f.vars = () => [targeted_atom, user];
	rt.setSv(f, "target", live(targeted_atom));
	if ((isEqual(rt.sv(f, "target"), live(user)) || isEqual(rt.sv(f, "target"), rt.getStep(f, live(f.src), 0)))) {
		return live(f.dot);
	}
	rt.setSv(f, "target_turf", rt.getStep(f, rt.sv(f, "target"), 0));
	yield* g.srcCall(f, "fire_helper", live(user));
	return f.dot;
}, true);

rt.type(9873, "/obj/item/gun_control", "/obj/item", {
	turret: null,
	w_class: 5,
	flags: 16518,
	name: "turret controls",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "offhand",
	resistance_flags: 50,
});

// /obj/item/gun_control/proc/Initialize  (code/game/objects/structures/manned_turret.dm:186)  may sleep
rt.def("/obj/item/gun_control/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "turret", rt.sv(f, "loc"));
	if (truthy((rt.istype(rt.sv(f, "turret"), T("/obj/machinery/manned_turret")) ? 1 : 0))) return f.dot;
	return 2;
}, true);

// /obj/item/gun_control/proc/Destroy  (code/game/objects/structures/manned_turret.dm:193)  may sleep
rt.def("/obj/item/gun_control/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "turret", null);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/gun_control/proc/attack_obj  (code/game/objects/structures/manned_turret.dm:199)  may sleep
rt.def("/obj/item/gun_control/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(O), "attacked_by", [live(f.src), live(user)]);
	return f.dot;
}, true);

// /obj/item/gun_control/proc/attack  (code/game/objects/structures/manned_turret.dm:205)  may sleep
rt.def("/obj/item/gun_control/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	f.vars = () => [M, user];
	rt.setFv(f, "lastattacked", live(user), live(M));
	rt.setFv(f, "lastattacker", live(M), live(user));
	yield* g.callName(f, live(M), "attacked_by", [live(f.src), live(user)]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/gun_control/proc/afterattack  (code/game/objects/structures/manned_turret.dm:209)  may sleep
rt.def("/obj/item/gun_control/proc/afterattack", function* afterattack(f: Frame) {
	let E: Value = null;
	f.vars = () => [E];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "calculated_projectile_vars", (E = rt.fv(f, "buckled", live(f.args[1]))), (yield* g.call(f, P("/proc/calculate_projectile_angle_and_pixel_offsets"), null, [live(f.args[1]), live(f.args[3])])));
	yield* g.callName(f, live(E), "direction_track", [live(f.args[1]), live(f.args[0])]);
	yield* g.callName(f, live(E), "checkfire", [live(f.args[0]), live(f.args[1])]);
	return f.dot;
}, true, { args: ["targeted_atom", "user", "flag", "params"] });
