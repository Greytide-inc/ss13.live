// From code/modules/vehicles/vehicle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13057, "/obj/vehicle", "/obj", {
	auto_door_open: 1,
	view_range: 7,
	riding_datum: null,
	anchored: 0,
	can_buckle: 1,
	buckle_lying: 0,
	obj_integrity: 300,
	max_integrity: 300,
	armor: null,
	name: "vehicle",
	desc: "A basic vehicle, vroom",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "fuckyou",
	density: 1,
});

// /obj/vehicle/proc/<init>  (code/modules/vehicles/vehicle.dm:13)
rt.def("/obj/vehicle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 60, "acid", 60]));
	return f.dot;
});

// /obj/vehicle/proc/Destroy  (code/modules/vehicles/vehicle.dm:19)  may sleep
rt.def("/obj/vehicle/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "riding_datum")]);
	rt.setSv(f, "riding_datum", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/vehicle/proc/unbuckle_mob  (code/modules/vehicles/vehicle.dm:35)  may sleep
rt.def("/obj/vehicle/proc/unbuckle_mob", function* unbuckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "restore_position", [live(f.args[0])]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["buckled_mob", "force"] });

// /obj/vehicle/proc/user_buckle_mob  (code/modules/vehicles/vehicle.dm:40)  may sleep
rt.def("/obj/vehicle/proc/user_buckle_mob", function* user_buckle_mob(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if (truthy((yield* g.callName(f, live(f.args[1]), "incapacitated", [])))) {
		return live(f.dot);
	}
	A = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.fv(f, "density", live(A)))) {
			if ((!isEqual(live(A), live(f.src)) && !isEqual(live(A), live(f.args[0])))) {
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "loc", live(f.args[0]), rt.getStep(f, live(f.src), 0));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "client", live(f.args[1])))) {
		yield* g.callName(f, rt.fv(f, "client", live(f.args[1])), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(f.args[1])), "default_view", []))]);
	}
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	rt.setFv(f, "ridden", rt.sv(f, "riding_datum"), live(f.src));
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_offsets", []);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/vehicle/proc/relaymove  (code/modules/vehicles/vehicle.dm:57)  may sleep
rt.def("/obj/vehicle/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_ride", [live(user), live(direction)]);
	return f.dot;
}, true);

// /obj/vehicle/proc/Moved  (code/modules/vehicles/vehicle.dm:61)  may sleep
rt.def("/obj/vehicle/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_layer", []);
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_offsets", []);
	return f.dot;
}, true);

// /obj/vehicle/proc/Bump  (code/modules/vehicles/vehicle.dm:68)  may sleep
rt.def("/obj/vehicle/proc/Bump", function* Bump(f: Frame) {
	let m: Value = null;
	let $e: any;
	f.vars = () => [m, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "auto_door_open"))) return f.dot;
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/machinery/door")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) return f.dot;
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		yield* g.callName(f, live(f.args[0]), "Bumped", [live(m)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["M"] });

// /obj/vehicle/proc/Process_Spacemove  (code/modules/vehicles/vehicle.dm:76)
rt.def("/obj/vehicle/proc/Process_Spacemove", function Process_Spacemove(f: Frame, direction: Value) {
	if (truthy(rt.callSrc(f, "has_gravity", []))) {
		return 1;
	}
	if ((truthy(rt.sv(f, "pulledby")) && !isEqual(rt.fv(f, "loc", rt.sv(f, "pulledby")), rt.sv(f, "loc")))) {
		return 1;
	}
	return 0;
});

// /obj/vehicle/proc/run_obj_armor  (code/modules/vehicles/vehicle.dm:89)
rt.def("/obj/vehicle/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 20))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/vehicle/proc/deconstruct  (code/modules/vehicles/vehicle.dm:94)  may sleep
rt.def("/obj/vehicle/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 5]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/vehicle/proc/examine  (code/modules/vehicles/vehicle.dm:98)
rt.def("/obj/vehicle/proc/examine", function examine(f: Frame) {
	let healthpercent: Value = null;
	let $0: any;
	f.vars = () => [healthpercent, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's on fire!</span>"]);
	}
	$0 = (healthpercent = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100));
	if (rt.inRange($0, 50, 99)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It looks slightly damaged."]);
	} else if (rt.inRange($0, 25, 50)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It appears heavily damaged."]);
	} else if (rt.inRange($0, 0, 25)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's falling apart!</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });
