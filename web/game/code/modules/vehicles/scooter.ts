// From code/modules/vehicles/scooter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13065, "/obj/vehicle/scooter", "/obj/vehicle", {
	name: "scooter",
	desc: "A fun way to get around.",
	icon_state: "scooter",
});

// /obj/vehicle/scooter/proc/attackby  (code/modules/vehicles/scooter.dm:7)  may sleep
rt.def("/obj/vehicle/scooter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, H: Value = null;
	f.vars = () => [I, user, params, S, H];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin to remove the handlebars...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/ratchet.ogg"), 50, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(40, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	S = (yield* g.new_(f, T("/obj/vehicle/scooter/skateboard"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.new_(f, T("/obj/item/stack/rods"), [rt.getStep(f, live(f.src), 0), 2]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the handlebars from ＀.</span>", [live(f.src)])]);
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		yield* g.srcCall(f, "unbuckle_mob", (H = rt.index(rt.sv(f, "buckled_mobs"), 1)));
		yield* g.callName(f, live(S), "buckle_mob", [live(H)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/vehicle/scooter/proc/buckle_mob  (code/modules/vehicles/scooter.dm:22)  may sleep
rt.def("/obj/vehicle/scooter/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/scooter"), [])));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if ((rt.lt((yield* g.callName(f, live(f.args[0]), "get_num_legs", [])), 2) && rt.le((yield* g.callName(f, live(f.args[0]), "get_num_arms", [])), 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>Your limbless body can't ride ％！.</span>", [live(f.src)])]);
		return 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/vehicle/scooter/proc/post_buckle_mob  (code/modules/vehicles/scooter.dm:31)
rt.def("/obj/vehicle/scooter/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	rt.callName(f, rt.sv(f, "riding_datum"), "account_limbs", [live(M)]);
	return f.dot;
});

rt.type(13066, "/obj/vehicle/scooter/skateboard", "/obj/vehicle/scooter", {
	name: "skateboard",
	desc: "An unfinished scooter which can only barely be called a skateboard. It's still rideable, but probably unsafe. Looks like you'll need to add a few rods to make handlebars.",
	icon_state: "skateboard",
	density: 0,
});

// /obj/vehicle/scooter/skateboard/proc/buckle_mob  (code/modules/vehicles/scooter.dm:41)  may sleep
rt.def("/obj/vehicle/scooter/skateboard/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "riding_datum", (yield* g.new_(f, T("/datum/riding/scooter/skateboard"), [])));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /obj/vehicle/scooter/skateboard/proc/post_buckle_mob  (code/modules/vehicles/scooter.dm:45)
rt.def("/obj/vehicle/scooter/skateboard/proc/post_buckle_mob", function post_buckle_mob(f: Frame) {
	if (truthy(rt.callSrc(f, "has_buckled_mobs", []))) {
		rt.setSv(f, "density", 1);
	} else {
		rt.setSv(f, "density", 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["M"] });

// /obj/vehicle/scooter/skateboard/proc/Bump  (code/modules/vehicles/scooter.dm:52)  may sleep
rt.def("/obj/vehicle/scooter/skateboard/proc/Bump", function* Bump(f: Frame) {
	let H: Value = null, throw_target: Value = null;
	f.vars = () => [H, throw_target];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.fv(f, "density", live(f.args[0]))) && truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) return f.dot;
	H = rt.index(rt.sv(f, "buckled_mobs"), 1);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(H), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]));
	yield* g.srcCall(f, "unbuckle_mob", live(H));
	yield* g.callName(f, live(H), "throw_at", [live(throw_target), 4, 3]);
	yield* g.callName(f, live(H), "Knockdown", [100]);
	yield* g.callName(f, live(H), "adjustStaminaLoss", [40]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ crashes into ＀, sending ＀ flying!</span>", [live(f.src), live(f.args[0]), live(H)]));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["A"] });

// /obj/vehicle/scooter/skateboard/proc/MouseDrop  (code/modules/vehicles/scooter.dm:64)  may sleep
rt.def("/obj/vehicle/scooter/skateboard/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, board: Value = null;
	f.vars = () => [over_object, M, board];
	if (((!truthy((rt.istype((M = live(f.usr)), T("/mob/living/carbon")) ? 1 : 0)) || truthy((yield* g.callName(f, live(M), "incapacitated", [])))) || !truthy((yield* g.srcCall(f, "Adjacent", live(M)))))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.srcCall(f, "has_buckled_mobs"))) && isEqual(live(over_object), live(M)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You can't lift this up when somebody's on it.</span>"]);
		return live(f.dot);
	}
	if (!isEqual(live(over_object), live(M))) return f.dot;
	board = (yield* g.new_(f, T("/obj/item/weapon/melee/skateboard"), []));
	yield* g.callName(f, live(M), "put_in_hands", [live(board)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(10206, "/obj/item/scooter_frame", "/obj/item", {
	w_class: 3,
	name: "scooter frame",
	desc: "A metal frame for building a scooter. Looks like you'll need to add some metal to make wheels.",
	icon: rt.rsc("icons/obj/vehicles.dmi"),
	icon_state: "scooter_frame",
});

// /obj/item/scooter_frame/proc/attackby  (code/modules/vehicles/scooter.dm:84)  may sleep
rt.def("/obj/item/scooter_frame/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	f.vars = () => [I, user, params, M];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You deconstruct ＀.</span>", [live(f.src)])]);
		yield* g.new_(f, T("/obj/item/stack/rods"), [rt.getStep(f, live(f.src), 0), 10]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/items/ratchet.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) return f.dot;
		if (rt.lt((yield* g.callName(f, (M = live(I)), "get_amount", [])), 5)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need at least five metal sheets to make proper wheels!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin to add wheels to ＀.</span>", [live(f.src)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 80, "target", live(f.src)], rt.Args.Named)))) return f.dot;
		if ((!truthy(live(M)) || rt.lt((yield* g.callName(f, live(M), "get_amount", [])), 5))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(M), "use", [5]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You finish making wheels for ＀.</span>", [live(f.src)])]);
		yield* g.new_(f, T("/obj/vehicle/scooter/skateboard"), [rt.fv(f, "loc", live(user))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/vehicle/scooter/skateboard/proc/attackby  (code/modules/vehicles/scooter.dm:106)  may sleep
rt.def("/obj/vehicle/scooter/skateboard/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let H: Value = null, C: Value = null, S: Value = null, H_2: Value = null;
	f.vars = () => [I, user, params, H, C, S, H_2];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin to deconstruct and remove the wheels on ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.fv(f, "usesound", live(I)), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 20, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You deconstruct the wheels on ＀.</span>", [live(f.src)])]);
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.getStep(f, live(f.src), 0), 5]);
			yield* g.new_(f, T("/obj/item/scooter_frame"), [rt.getStep(f, live(f.src), 0)]);
			if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
				yield* g.srcCall(f, "unbuckle_mob", (H = rt.index(rt.sv(f, "buckled_mobs"), 1)));
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/stack/rods")) ? 1 : 0))) return f.dot;
		if (rt.lt((yield* g.callName(f, (C = live(I)), "get_amount", [])), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need at least two rods to make proper handlebars!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin making handlebars for ＀.</span>", [live(f.src)])]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 25, "target", live(f.src)], rt.Args.Named)))) return f.dot;
		if ((!truthy(live(C)) || rt.lt((yield* g.callName(f, live(C), "get_amount", [])), 2))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add the rods to ＀, creating handlebars.</span>", [live(f.src)])]);
		yield* g.callName(f, live(C), "use", [2]);
		S = (yield* g.new_(f, T("/obj/vehicle/scooter"), [rt.getStep(f, live(f.src), 0)]));
		if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
			yield* g.srcCall(f, "unbuckle_mob", (H_2 = rt.index(rt.sv(f, "buckled_mobs"), 1)));
			yield* g.callName(f, live(S), "buckle_mob", [live(H_2)]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);
