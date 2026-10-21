// From code/datums/riding.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(739, "/datum/riding", "/datum", {
	next_vehicle_move: 0,
	vehicle_move_delay: 2,
	keytype: null,
	ridden: null,
	slowed: 0,
	slowvalue: 1,
});

// /datum/riding/proc/New  (code/datums/riding.dm:11)
rt.def("/datum/riding/proc/New", function New(f: Frame, _ridden: Value) {
	rt.setSv(f, "ridden", live(_ridden));
	return f.dot;
});

// /datum/riding/proc/Destroy  (code/datums/riding.dm:15)  may sleep
rt.def("/datum/riding/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "ridden", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/riding/proc/handle_vehicle_layer  (code/datums/riding.dm:18)
rt.def("/datum/riding/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (!isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 1)) {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
	}
	return f.dot;
});

// /datum/riding/proc/on_vehicle_move  (code/datums/riding.dm:24)  may sleep
rt.def("/datum/riding/proc/on_vehicle_move", function* on_vehicle_move(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.srcCall(f, "ride_check", live(M));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "handle_vehicle_offsets");
	yield* g.srcCall(f, "handle_vehicle_layer");
	return f.dot;
}, true);

// /datum/riding/proc/force_dismount  (code/datums/riding.dm:33)  may sleep
rt.def("/datum/riding/proc/force_dismount", function* force_dismount(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, rt.sv(f, "ridden"), "unbuckle_mob", [live(M)]);
	return f.dot;
}, true);

// /datum/riding/proc/handle_vehicle_offsets  (code/datums/riding.dm:36)  may sleep
rt.def("/datum/riding/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let ridden_dir: Value = null, passindex: Value = null, m: Value = null, buckled_mob: Value = null, offsets: Value = null, rider_dir: Value = null, offsetdir: Value = null, diroffsets: Value = null;
	let $e: any;
	f.vars = () => [ridden_dir, passindex, m, buckled_mob, offsets, rider_dir, offsetdir, diroffsets, $e];
	ridden_dir = fmt("＀", [rt.fv(f, "dir", rt.sv(f, "ridden"))]);
	passindex = 0;
	if (!truthy((yield* g.callName(f, rt.sv(f, "ridden"), "has_buckled_mobs", [])))) return f.dot;
	m = null;
	rt.forList(f, 0, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")));
	loop10: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		m = $e;
		passindex = rt.inc(live(passindex), 1);
		buckled_mob = live(m);
		offsets = (yield* g.srcCall(f, "get_offsets", live(passindex)));
		rider_dir = (yield* g.srcCall(f, "get_rider_dir", live(passindex)));
		yield* g.callName(f, live(buckled_mob), "setDir", [live(rider_dir)]);
		offsetdir = null;
		rt.forList(f, 1, live(offsets));
		while (($e = rt.next(f, 1)) !== undefined) {
			offsetdir = $e;
			if (isEqual(live(offsetdir), live(ridden_dir))) {
				diroffsets = rt.index(live(offsets), live(offsetdir));
				rt.setFv(f, "pixel_x", live(buckled_mob), rt.index(live(diroffsets), 1));
				if (rt.ge(rt.len(f, live(diroffsets)), 2)) {
					rt.setFv(f, "pixel_y", live(buckled_mob), rt.index(live(diroffsets), 2));
				}
				if (isEqual(rt.len(f, live(diroffsets)), 3)) {
					rt.setFv(f, "layer", live(buckled_mob), rt.index(live(diroffsets), 3));
				}
				continue loop10;
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/riding/proc/get_offsets  (code/datums/riding.dm:59)
rt.def("/datum/riding/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 0), fmt("＀", [2]), rt.list(0, 0), fmt("＀", [4]), rt.list(0, 0), fmt("＀", [8]), rt.list(0, 0)]);
});

// /datum/riding/proc/get_rider_dir  (code/datums/riding.dm:64)
rt.def("/datum/riding/proc/get_rider_dir", function get_rider_dir(f: Frame, pass_index: Value) {
	return rt.fv(f, "dir", rt.sv(f, "ridden"));
});

// /datum/riding/proc/keycheck  (code/datums/riding.dm:69)
rt.def("/datum/riding/proc/keycheck", function keycheck(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "keytype"))) {
		if (truthy(rt.callName(f, live(user), "is_holding_item_of_type", [rt.sv(f, "keytype")]))) {
			return 1;
		}
	} else {
		return 1;
	}
	return 0;
});

// /datum/riding/proc/restore_position  (code/datums/riding.dm:77)  may sleep
rt.def("/datum/riding/proc/restore_position", function* restore_position(f: Frame, buckled_mob: Value) {
	f.vars = () => [buckled_mob];
	if (!truthy((rt.istype(live(buckled_mob), T("/mob/living")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "pixel_x", live(buckled_mob), 0);
	rt.setFv(f, "pixel_y", live(buckled_mob), 0);
	if (!truthy(rt.fv(f, "client", live(buckled_mob)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "client", live(buckled_mob)), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(buckled_mob)), "default_view", []))]);
	return f.dot;
}, true);

// /datum/riding/proc/handle_ride  (code/datums/riding.dm:85)  may sleep
rt.def("/datum/riding/proc/handle_ride", function* handle_ride(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		yield* g.srcCall(f, "Unbuckle", live(user));
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), rt.sv(f, "next_vehicle_move"))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_vehicle_move", add(rt.worldTime(f), rt.sv(f, "vehicle_move_delay")));
	if (truthy((yield* g.srcCall(f, "keycheck", live(user))))) {
		if ((!truthy((yield* g.srcCall(f, "Process_Spacemove", live(direction)))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "ridden"))]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "glide_size", rt.sv(f, "ridden"), (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [divide(32, (yield* g.call(f, P("/proc/max"), null, [divide(rt.sv(f, "vehicle_move_delay"), rt.fv(f, "tick_lag", rt.world())), 1]))), 32]))])));
		yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "ridden"), live(direction)]);
		yield* g.srcCall(f, "handle_vehicle_layer");
		yield* g.srcCall(f, "handle_vehicle_offsets");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You'll need the keys in one of your hands to drive ％！.</span>", [rt.fv(f, "name", rt.sv(f, "ridden"))])]);
	}
	return f.dot;
}, true);

// /datum/riding/proc/Unbuckle  (code/datums/riding.dm:104)  may sleep
rt.def("/datum/riding/proc/Unbuckle", function* Unbuckle(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "ridden"), P("/atom/movable/proc/unbuckle_mob"), live(M)])), 0, 1]);
	return f.dot;
}, true);

// /datum/riding/proc/Process_Spacemove  (code/datums/riding.dm:107)
rt.def("/datum/riding/proc/Process_Spacemove", function Process_Spacemove(f: Frame, direction: Value) {
	if (truthy(rt.callName(f, rt.sv(f, "ridden"), "has_gravity", []))) {
		return 1;
	}
	return 0;
});

rt.type(743, "/datum/riding/atv", "/datum/riding", {
	vehicle_move_delay: 1,
	keytype: rt.typePath("/obj/item/key"),
});

// /datum/riding/atv/proc/get_offsets  (code/datums/riding.dm:122)
rt.def("/datum/riding/atv/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 4), fmt("＀", [2]), rt.list(0, 4), fmt("＀", [4]), rt.list(0, 4), fmt("＀", [8]), rt.list(0, 4)]);
});

// /datum/riding/atv/proc/handle_vehicle_layer  (code/datums/riding.dm:126)
rt.def("/datum/riding/atv/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 2)) {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
	}
	return f.dot;
});

rt.type(744, "/datum/riding/atv/turret", "/datum/riding/atv", {
	turret: null,
});

// /datum/riding/atv/turret/proc/handle_vehicle_layer  (code/datums/riding.dm:135)
rt.def("/datum/riding/atv/turret/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 2)) {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
	}
	if (!truthy(rt.sv(f, "turret"))) return f.dot;
	if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 1)) {
		rt.setFv(f, "layer", rt.sv(f, "turret"), 4.099999904632568);
	} else {
		rt.setFv(f, "layer", rt.sv(f, "turret"), 3);
	}
	return f.dot;
});

// /datum/riding/atv/turret/proc/handle_vehicle_offsets  (code/datums/riding.dm:148)  may sleep
rt.def("/datum/riding/atv/turret/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "turret"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "turret"), "forceMove", [rt.getStep(f, rt.sv(f, "ridden"), 0)]);
	$0 = rt.fv(f, "dir", rt.sv(f, "ridden"));
	if ($0 === 1) {
		rt.setFv(f, "pixel_x", rt.sv(f, "turret"), 0);
		rt.setFv(f, "pixel_y", rt.sv(f, "turret"), 4);
	} else if ($0 === 4) {
		rt.setFv(f, "pixel_x", rt.sv(f, "turret"), -12);
		rt.setFv(f, "pixel_y", rt.sv(f, "turret"), 4);
	} else if ($0 === 2) {
		rt.setFv(f, "pixel_x", rt.sv(f, "turret"), 0);
		rt.setFv(f, "pixel_y", rt.sv(f, "turret"), 4);
	} else if ($0 === 8) {
		rt.setFv(f, "pixel_x", rt.sv(f, "turret"), 12);
		rt.setFv(f, "pixel_y", rt.sv(f, "turret"), 4);
	}
	return f.dot;
}, true);

rt.type(745, "/datum/riding/janicart", "/datum/riding", {
	keytype: rt.typePath("/obj/item/key/janitor"),
});

// /datum/riding/janicart/proc/get_offsets  (code/datums/riding.dm:172)
rt.def("/datum/riding/janicart/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 4), fmt("＀", [2]), rt.list(0, 7), fmt("＀", [4]), rt.list(-12, 7), fmt("＀", [8]), rt.list(12, 7)]);
});

rt.type(746, "/datum/riding/scooter", "/datum/riding", {});

// /datum/riding/scooter/proc/handle_vehicle_layer  (code/datums/riding.dm:176)
rt.def("/datum/riding/scooter/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 2)) {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
	}
	return f.dot;
});

// /datum/riding/scooter/proc/get_offsets  (code/datums/riding.dm:182)
rt.def("/datum/riding/scooter/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0), fmt("＀", [2]), rt.list(-2), fmt("＀", [4]), rt.list(0), fmt("＀", [8]), rt.list(2)]);
});

// /datum/riding/scooter/proc/handle_vehicle_offsets  (code/datums/riding.dm:185)  may sleep
rt.def("/datum/riding/scooter/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let m: Value = null, buckled_mob: Value = null;
	let $e: any;
	f.vars = () => [m, buckled_mob, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, rt.sv(f, "ridden"), "has_buckled_mobs", [])))) return f.dot;
	m = null;
	rt.forList(f, 0, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (rt.gt((yield* g.callName(f, (buckled_mob = live(m)), "get_num_legs", [])), 0)) {
			rt.setFv(f, "pixel_y", live(buckled_mob), 5);
		} else {
			rt.setFv(f, "pixel_y", live(buckled_mob), -4);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/riding/proc/account_limbs  (code/datums/riding.dm:195)
rt.def("/datum/riding/proc/account_limbs", function account_limbs(f: Frame, M: Value) {
	if ((rt.lt(rt.callName(f, live(M), "get_num_legs", []), 2) && !truthy(rt.sv(f, "slowed")))) {
		rt.setSv(f, "vehicle_move_delay", add(rt.sv(f, "vehicle_move_delay"), rt.sv(f, "slowvalue")));
		rt.setSv(f, "slowed", 1);
	} else {
		if (!truthy(rt.sv(f, "slowed"))) return f.dot;
		rt.setSv(f, "vehicle_move_delay", subtract(rt.sv(f, "vehicle_move_delay"), rt.sv(f, "slowvalue")));
		rt.setSv(f, "slowed", 0);
	}
	return f.dot;
});

rt.type(748, "/datum/riding/secway", "/datum/riding", {
	keytype: rt.typePath("/obj/item/key/security"),
});

// /datum/riding/secway/proc/get_offsets  (code/datums/riding.dm:211)
rt.def("/datum/riding/secway/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 4), fmt("＀", [2]), rt.list(0, 4), fmt("＀", [4]), rt.list(0, 4), fmt("＀", [8]), rt.list(0, 4)]);
});

rt.type(749, "/datum/riding/bicycle", "/datum/riding", {
	keytype: null,
	vehicle_move_delay: 0,
});

// /datum/riding/bicycle/proc/get_offsets  (code/datums/riding.dm:219)
rt.def("/datum/riding/bicycle/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 4), fmt("＀", [2]), rt.list(0, 4), fmt("＀", [4]), rt.list(0, 4), fmt("＀", [8]), rt.list(0, 4)]);
});

rt.type(741, "/datum/riding/space/speedbike", "/datum/riding/space", {
	keytype: null,
	vehicle_move_delay: 0,
});

// /datum/riding/space/speedbike/proc/handle_vehicle_layer  (code/datums/riding.dm:227)
rt.def("/datum/riding/space/speedbike/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "dir", rt.sv(f, "ridden"));
	if ($0 === 1 || $0 === 2) {
		rt.setFv(f, "pixel_x", rt.sv(f, "ridden"), -16);
		rt.setFv(f, "pixel_y", rt.sv(f, "ridden"), -16);
	} else if ($0 === 4 || $0 === 8) {
		rt.setFv(f, "pixel_x", rt.sv(f, "ridden"), -18);
		rt.setFv(f, "pixel_y", rt.sv(f, "ridden"), 0);
	}
	return f.dot;
});

// /datum/riding/space/speedbike/proc/get_offsets  (code/datums/riding.dm:236)
rt.def("/datum/riding/space/speedbike/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, -8), fmt("＀", [2]), rt.list(0, 4), fmt("＀", [4]), rt.list(-10, 5), fmt("＀", [8]), rt.list(10, 5)]);
});

rt.type(742, "/datum/riding/space/speedwagon", "/datum/riding/space", {
	vehicle_move_delay: 0,
});

// /datum/riding/space/speedwagon/proc/handle_vehicle_layer  (code/datums/riding.dm:244)
rt.def("/datum/riding/space/speedwagon/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	rt.setFv(f, "layer", rt.sv(f, "ridden"), 3.700000047683716);
	return f.dot;
});

// /datum/riding/space/speedwagon/proc/get_offsets  (code/datums/riding.dm:247)
rt.def("/datum/riding/space/speedwagon/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(pass_index);
	if ($0 === 1) {
		return rt.alist(f, [fmt("＀", [1]), rt.list(-10, -4), fmt("＀", [2]), rt.list(16, 3), fmt("＀", [4]), rt.list(-4, 30), fmt("＀", [8]), rt.list(4, -3)]);
	} else if ($0 === 2) {
		return rt.alist(f, [fmt("＀", [1]), rt.list(19, -5, 4), fmt("＀", [2]), rt.list(-13, 3, 4), fmt("＀", [4]), rt.list(-4, -3, 4.099999904632568), fmt("＀", [8]), rt.list(4, 28, 3.9000000953674316)]);
	} else if ($0 === 3) {
		return rt.alist(f, [fmt("＀", [1]), rt.list(-10, -18, 4.199999809265137), fmt("＀", [2]), rt.list(16, 25, 3.9000000953674316), fmt("＀", [4]), rt.list(-22, 30), fmt("＀", [8]), rt.list(22, -3, 4.099999904632568)]);
	} else if ($0 === 4) {
		return rt.alist(f, [fmt("＀", [1]), rt.list(19, -18, 4.199999809265137), fmt("＀", [2]), rt.list(-13, 25, 3.9000000953674316), fmt("＀", [4]), rt.list(-22, 3, 3.9000000953674316), fmt("＀", [8]), rt.list(22, 28)]);
	}
	return f.dot;
});

rt.type(750, "/datum/riding/boat", "/datum/riding", {
	keytype: rt.typePath("/obj/item/weapon/oar"),
});

// /datum/riding/boat/proc/handle_ride  (code/datums/riding.dm:262)  may sleep
rt.def("/datum/riding/boat/proc/handle_ride", function* handle_ride(f: Frame) {
	let next: Value = null, current: Value = null;
	f.vars = () => [next, current];
	next = rt.getStep(f, rt.sv(f, "ridden"), live(f.args[1]));
	current = rt.getStep(f, rt.sv(f, "ridden"), 0);
	if ((truthy((rt.istype(live(next), T("/turf/open/floor/plating/lava")) ? 1 : 0)) || truthy((rt.istype(live(current), T("/turf/open/floor/plating/lava")) ? 1 : 0)))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "Boats don't go on land!"]);
		return 0;
	}
	return f.dot;
}, true, { args: ["user", "direction"] });

rt.type(751, "/datum/riding/boat/dragon", "/datum/riding/boat", {
	keytype: null,
	vehicle_move_delay: 1,
});

// /datum/riding/boat/dragon/proc/get_offsets  (code/datums/riding.dm:276)
rt.def("/datum/riding/boat/dragon/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(1, 2), fmt("＀", [2]), rt.list(1, 2), fmt("＀", [4]), rt.list(1, 2), fmt("＀", [8]), rt.list(1, 2)]);
});

rt.type(752, "/datum/riding/animal", "/datum/riding", {
	keytype: null,
});

// /datum/riding/animal/proc/handle_ride  (code/datums/riding.dm:284)  may sleep
rt.def("/datum/riding/animal/proc/handle_ride", function* handle_ride(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		yield* g.srcCall(f, "Unbuckle", live(user));
		return live(f.dot);
	}
	if (rt.lt(rt.worldTime(f), rt.sv(f, "next_vehicle_move"))) {
		return live(f.dot);
	}
	rt.setSv(f, "next_vehicle_move", add(rt.worldTime(f), rt.sv(f, "vehicle_move_delay")));
	if (truthy((yield* g.srcCall(f, "keycheck", live(user))))) {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "ridden"))])))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/step"), null, [rt.sv(f, "ridden"), live(direction)]);
		yield* g.srcCall(f, "handle_vehicle_layer");
		yield* g.srcCall(f, "handle_vehicle_offsets");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You'll need something  to guide the ＀.</span>", [rt.fv(f, "name", rt.sv(f, "ridden"))])]);
	}
	return f.dot;
}, true);

rt.type(753, "/datum/riding/human", "/datum/riding", {
	keytype: null,
});

// /datum/riding/human/proc/ride_check  (code/datums/riding.dm:307)  may sleep
rt.def("/datum/riding/human/proc/ride_check", function* ride_check(f: Frame, M: Value) {
	let H: Value = null;
	f.vars = () => [M, H];
	H = rt.sv(f, "ridden");
	if ((truthy((yield* g.callName(f, live(M), "incapacitated", [0, 1]))) || truthy((yield* g.callName(f, live(H), "incapacitated", [0, 1]))))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ falls off ＀!</span>", [live(M), rt.sv(f, "ridden")])]);
		yield* g.srcCall(f, "Unbuckle", live(M));
		return 0;
	}
	if (truthy((yield* g.callName(f, live(M), "restrained", [1])))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ can't hang onto ＀ with their hands cuffed!</span>", [live(M), rt.sv(f, "ridden")])]);
		yield* g.srcCall(f, "Unbuckle", live(M));
		return 0;
	}
	if (!isEqual(rt.fv(f, "pulling", live(H)), live(M))) return f.dot;
	yield* g.callName(f, live(H), "stop_pulling", []);
	return f.dot;
}, true);

// /datum/riding/human/proc/get_offsets  (code/datums/riding.dm:320)
rt.def("/datum/riding/human/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 6), fmt("＀", [2]), rt.list(0, 6), fmt("＀", [4]), rt.list(-6, 4), fmt("＀", [8]), rt.list(6, 4)]);
});

// /datum/riding/human/proc/handle_vehicle_layer  (code/datums/riding.dm:324)
rt.def("/datum/riding/human/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if ((truthy(rt.fv(f, "buckled_mobs", rt.sv(f, "ridden"))) && truthy(rt.getLen(f, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")))))) {
		if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 2)) {
			rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
		} else {
			rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
		}
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4);
	}
	return f.dot;
});

// /datum/riding/human/proc/force_dismount  (code/datums/riding.dm:333)  may sleep
rt.def("/datum/riding/human/proc/force_dismount", function* force_dismount(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "ridden"), "unbuckle_mob", [live(user)]);
	yield* g.callName(f, live(user), "Knockdown", [60]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ pushes ＀ off of them!</span>", [rt.sv(f, "ridden"), live(user)])]);
	return f.dot;
}, true);

rt.type(754, "/datum/riding/cyborg", "/datum/riding", {
	keytype: null,
});

// /datum/riding/cyborg/proc/ride_check  (code/datums/riding.dm:341)  may sleep
rt.def("/datum/riding/cyborg/proc/ride_check", function* ride_check(f: Frame, user: Value) {
	let kick: Value = null, R: Value = null, carbonuser: Value = null;
	f.vars = () => [user, kick, R, carbonuser];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		kick = 1;
		if (truthy((rt.istype(rt.sv(f, "ridden"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "module", (R = rt.sv(f, "ridden")))) && truthy(rt.gv(f, "ride_allow_incapacitated", rt.fv(f, "module", live(R)))))) {
				kick = 0;
			}
		}
		if (truthy(live(kick))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>You fall off of ＀!</span>", [rt.sv(f, "ridden")])]);
			yield* g.srcCall(f, "Unbuckle", live(user));
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (truthy((yield* g.callName(f, (carbonuser = live(user)), "get_num_arms", [])))) return f.dot;
	yield* g.srcCall(f, "Unbuckle", live(user));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>You can't grab onto ＀ with no hands!</span>", [rt.sv(f, "ridden")])]);
	return live(f.dot);
}, true);

// /datum/riding/cyborg/proc/handle_vehicle_layer  (code/datums/riding.dm:359)
rt.def("/datum/riding/cyborg/proc/handle_vehicle_layer", function handle_vehicle_layer(f: Frame) {
	if ((truthy(rt.fv(f, "buckled_mobs", rt.sv(f, "ridden"))) && truthy(rt.getLen(f, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")))))) {
		if (isEqual(rt.fv(f, "dir", rt.sv(f, "ridden")), 2)) {
			rt.setFv(f, "layer", rt.sv(f, "ridden"), 4.099999904632568);
		} else {
			rt.setFv(f, "layer", rt.sv(f, "ridden"), 3);
		}
	} else {
		rt.setFv(f, "layer", rt.sv(f, "ridden"), 4);
	}
	return f.dot;
});

// /datum/riding/cyborg/proc/get_offsets  (code/datums/riding.dm:368)
rt.def("/datum/riding/cyborg/proc/get_offsets", function get_offsets(f: Frame, pass_index: Value) {
	return rt.alist(f, [fmt("＀", [1]), rt.list(0, 4), fmt("＀", [2]), rt.list(0, 4), fmt("＀", [4]), rt.list(-6, 3), fmt("＀", [8]), rt.list(6, 3)]);
});

// /datum/riding/cyborg/proc/handle_vehicle_offsets  (code/datums/riding.dm:371)  may sleep
rt.def("/datum/riding/cyborg/proc/handle_vehicle_offsets", function* handle_vehicle_offsets(f: Frame) {
	let M: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [M, R, $e];
	if (!truthy((yield* g.callName(f, rt.sv(f, "ridden"), "has_buckled_mobs", [])))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.fv(f, "buckled_mobs", rt.sv(f, "ridden")), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "setDir", [rt.fv(f, "dir", rt.sv(f, "ridden"))]);
		if (truthy((rt.istype(rt.sv(f, "ridden"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "module", (R = rt.sv(f, "ridden"))), T("/obj/item/weapon/robot_module")) ? 1 : 0))) {
				rt.setFv(f, "pixel_x", live(M), rt.index(rt.gv(f, "ride_offset_x", rt.fv(f, "module", live(R))), (yield* g.call(f, P("/proc/dir2text"), null, [rt.fv(f, "dir", rt.sv(f, "ridden"))]))));
				rt.setFv(f, "pixel_y", live(M), rt.index(rt.gv(f, "ride_offset_y", rt.fv(f, "module", live(R))), (yield* g.call(f, P("/proc/dir2text"), null, [rt.fv(f, "dir", rt.sv(f, "ridden"))]))));
			}
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/riding/cyborg/proc/force_dismount  (code/datums/riding.dm:383)  may sleep
rt.def("/datum/riding/cyborg/proc/force_dismount", function* force_dismount(f: Frame, M: Value) {
	let target: Value = null, targetm: Value = null;
	f.vars = () => [M, target, targetm];
	yield* g.callName(f, rt.sv(f, "ridden"), "unbuckle_mob", [live(M)]);
	target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [rt.sv(f, "ridden"), rt.fv(f, "dir", rt.sv(f, "ridden"))]));
	targetm = rt.getStep(f, rt.getStep(f, rt.sv(f, "ridden"), 0), rt.fv(f, "dir", rt.sv(f, "ridden")));
	yield* g.callName(f, live(M), "Move", [live(targetm)]);
	yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ is thrown clear of ＀!</span>", [live(M), rt.sv(f, "ridden")])]);
	yield* g.callName(f, live(M), "throw_at", [live(target), 14, 5, rt.sv(f, "ridden")]);
	yield* g.callName(f, live(M), "Knockdown", [60]);
	return f.dot;
}, true);

// /datum/riding/proc/equip_buckle_inhands  (code/datums/riding.dm:393)  may sleep
rt.def("/datum/riding/proc/equip_buckle_inhands", function* equip_buckle_inhands(f: Frame, user: Value, amount_required: Value) {
	let amount_equipped: Value = null, amount_needed: Value = null, inhand: Value = null;
	f.vars = () => [user, amount_required, amount_equipped, amount_needed, inhand];
	if (live(amount_required) === null) {
		amount_required = 1;
	}
	amount_equipped = 0;
	amount_needed = null;
	amount_needed = live(amount_required);
	while (rt.gt(live(amount_needed), 0)) {
		rt.setFv(f, "rider", (inhand = (yield* g.new_(f, T("/obj/item/riding_offhand"), [live(user)]))), live(user));
		rt.setFv(f, "ridden", live(inhand), rt.sv(f, "ridden"));
		if (truthy((yield* g.callName(f, live(user), "put_in_hands", [live(inhand), 1])))) {
			amount_equipped = rt.inc(live(amount_equipped), 1);
		} else {
			break;
		}
		amount_needed = rt.inc(live(amount_needed), -1);
	}
	if (rt.ge(live(amount_equipped), live(amount_required))) {
		return 1;
	} else {
		yield* g.srcCall(f, "unequip_buckle_inhands", live(user));
		return 0;
	}
	return f.dot;
}, true);

// /datum/riding/proc/unequip_buckle_inhands  (code/datums/riding.dm:408)  may sleep
rt.def("/datum/riding/proc/unequip_buckle_inhands", function* unequip_buckle_inhands(f: Frame, user: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [user, O, $e];
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(user)), T("/obj/item/riding_offhand"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (!isEqual(rt.fv(f, "ridden", live(O)), rt.sv(f, "ridden"))) {
			yield* g.call(f, P("/proc/CRASH"), null, ["RIDING OFFHAND ON WRONG MOB"]);
			continue;
		}
		if (truthy(rt.fv(f, "selfdeleting", live(O)))) {
			continue;
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(7651, "/obj/item/riding_offhand", "/obj/item", {
	rider: null,
	ridden: null,
	selfdeleting: 0,
	flags: 16516,
	name: "offhand",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 115,
});

// /obj/item/riding_offhand/proc/dropped  (code/datums/riding.dm:431)  may sleep
rt.def("/obj/item/riding_offhand/proc/dropped", function* dropped(f: Frame) {
	rt.setSv(f, "selfdeleting", 1);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/riding_offhand/proc/equipped  (code/datums/riding.dm:434)  may sleep
rt.def("/obj/item/riding_offhand/proc/equipped", function* equipped(f: Frame) {
	if (!isEqual(rt.sv(f, "loc"), rt.sv(f, "rider"))) {
		rt.setSv(f, "selfdeleting", 1);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/riding_offhand/proc/Destroy  (code/datums/riding.dm:441)  may sleep
rt.def("/obj/item/riding_offhand/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "selfdeleting"))) {
		if (truthy((rt.isIn(f, rt.sv(f, "rider"), rt.fv(f, "buckled_mobs", rt.sv(f, "ridden"))) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "ridden"), "unbuckle_mob", [rt.sv(f, "rider")]);
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
