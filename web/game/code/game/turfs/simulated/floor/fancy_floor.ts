// From code/game/turfs/simulated/floor/fancy_floor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4553, "/turf/open/floor/wood", "/turf/open/floor", {
	broken_states: null,
	icon_state: "wood",
	floor_tile: rt.typePath("/obj/item/stack/tile/wood"),
});

// /turf/open/floor/wood/proc/attackby  (code/game/turfs/simulated/floor/fancy_floor.dm:16)  may sleep
rt.def("/turf/open/floor/wood/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "pry_tile", live(f.args[0]), live(f.args[1]));
	return live(f.dot);
}, true, { args: ["C", "user", "params"] });

// /turf/open/floor/wood/proc/try_replace_tile  (code/game/turfs/simulated/floor/fancy_floor.dm:23)  may sleep
rt.def("/turf/open/floor/wood/proc/try_replace_tile", function* try_replace_tile(f: Frame, _T: Value, user: Value, params: Value) {
	let tool: Value = null, _P: Value = null;
	f.vars = () => [_T, user, params, tool, _P];
	if (isEqual(rt.fv(f, "turf_type", live(_T)), rt.sv(f, "type"))) {
		return live(f.dot);
	}
	if (!truthy((tool = (yield* g.callName(f, live(user), "is_holding_item_of_type", [T("/obj/item/weapon/screwdriver")]))))) {
		tool = (yield* g.callName(f, live(user), "is_holding_item_of_type", [T("/obj/item/weapon/crowbar")]));
	}
	if (!truthy(live(tool))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((_P = (yield* g.srcCall(f, "pry_tile", live(tool), live(user), 1))), T("/turf/open/floor/plating")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(_P), "attackby", [live(_T), live(user), live(params)]);
	return f.dot;
}, true);

// /turf/open/floor/wood/proc/pry_tile  (code/game/turfs/simulated/floor/fancy_floor.dm:36)  may sleep
rt.def("/turf/open/floor/wood/proc/pry_tile", function* pry_tile(f: Frame, C: Value, user: Value, silent: Value) {
	let is_screwdriver: Value = null;
	f.vars = () => [C, user, silent, is_screwdriver];
	if (live(silent) === null) {
		silent = 0;
	}
	is_screwdriver = (rt.istype(live(C), T("/obj/item/weapon/screwdriver")) ? 1 : 0);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(C)), 80, 1]);
	return (yield* g.callSrc(f, "remove_tile", [null, live(user), null, live(silent), "make_tile", live(is_screwdriver)], rt.Args.Named));
}, true);

// /turf/open/floor/wood/proc/remove_tile  (code/game/turfs/simulated/floor/fancy_floor.dm:41)  may sleep
rt.def("/turf/open/floor/wood/proc/remove_tile", function* remove_tile(f: Frame, user: Value, silent: Value, make_tile: Value) {
	f.vars = () => [user, silent, make_tile];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(make_tile) === null) {
		make_tile = 1;
	}
	if ((truthy(rt.sv(f, "broken")) || truthy(rt.sv(f, "burnt")))) {
		rt.setSv(f, "broken", 0);
		rt.setSv(f, "burnt", 0);
		if ((truthy(live(user)) && !truthy(live(silent)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You remove the broken planks.</span>"]);
		}
	} else {
		if (truthy(live(make_tile))) {
			if ((truthy(live(user)) && !truthy(live(silent)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You unscrew the planks.</span>"]);
			}
			if (truthy(rt.sv(f, "floor_tile"))) {
				yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
			}
		} else {
			if ((truthy(live(user)) && !truthy(live(silent)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You forcefully pry off the planks, destroying them in the process.</span>"]);
			}
		}
	}
	return (yield* g.srcCall(f, "make_plating"));
}, true);

rt.type(4556, "/turf/open/floor/grass", "/turf/open/floor", {
	turfverb: "uproot",
	ore_type: rt.typePath("/obj/item/weapon/ore/glass"),
	broken_states: null,
	name: "grass patch",
	desc: "You can't tell if this is real grass or just cheap plastic imitation.",
	icon_state: "grass",
	floor_tile: rt.typePath("/obj/item/stack/tile/grass"),
	flags: 0,
});

// /turf/open/floor/grass/proc/<init>  (code/game/turfs/simulated/floor/fancy_floor.dm:68)
rt.def("/turf/open/floor/grass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("sand"));
	return f.dot;
});

// /turf/open/floor/grass/proc/Initialize  (code/game/turfs/simulated/floor/fancy_floor.dm:74)  may sleep
rt.def("/turf/open/floor/grass/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /turf/open/floor/grass/proc/attackby  (code/game/turfs/simulated/floor/fancy_floor.dm:78)  may sleep
rt.def("/turf/open/floor/grass/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shovel")) ? 1 : 0)) && truthy(live(f.args[2])))) {
		yield* g.new_(f, rt.sv(f, "ore_type"), [live(f.src)]);
		yield* g.new_(f, rt.sv(f, "ore_type"), [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ digs up ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You ＀ ＀.</span>", [rt.fv(f, "turfverb", live(f.src)), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1]);
		yield* g.srcCall(f, "make_plating");
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	return live(f.dot);
}, true, { args: ["C", "user", "params"] });

rt.type(4557, "/turf/open/floor/grass/snow", "/turf/open/floor/grass", {
	floor_tile: null,
	name: "snow",
	icon: rt.rsc("icons/turf/snow.dmi"),
	desc: "Looks cold.",
	icon_state: "snow",
	ore_type: rt.typePath("/obj/item/stack/sheet/mineral/snow"),
	planetary_atmos: 1,
	initial_gas_mix: "o2=22;n2=82;TEMP=180",
	slowdown: 2,
});

// /turf/open/floor/grass/snow/proc/attackby  (code/game/turfs/simulated/floor/fancy_floor.dm:99)  may sleep
rt.def("/turf/open/floor/grass/snow/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(4558, "/turf/open/floor/grass/snow/basalt", "/turf/open/floor/grass/snow", {
	name: "volcanic floor",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "basalt",
	ore_type: rt.typePath("/obj/item/weapon/ore/glass/basalt"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	slowdown: 0,
});

// /turf/open/floor/grass/snow/basalt/proc/Initialize  (code/game/turfs/simulated/floor/fancy_floor.dm:112)  may sleep
rt.def("/turf/open/floor/grass/snow/basalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("basalt＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 12]))]));
	yield* g.call(f, P("/proc/set_basalt_light"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4559, "/turf/open/floor/grass/fakebasalt", "/turf/open/floor/grass", {
	turfverb: "dig up",
	name: "aesthetic volcanic flooring",
	desc: "Safely recreated turf for your hellplanet-scaping",
	icon: rt.rsc("icons/turf/floors.dmi"),
	icon_state: "basalt",
	floor_tile: rt.typePath("/obj/item/stack/tile/basalt"),
	ore_type: rt.typePath("/obj/item/weapon/ore/glass/basalt"),
	slowdown: 0,
});

// /turf/open/floor/grass/fakebasalt/proc/Initialize  (code/game/turfs/simulated/floor/fancy_floor.dm:129)  may sleep
rt.def("/turf/open/floor/grass/fakebasalt/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
	rt.setSv(f, "icon_state", fmt("basalt＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 12]))]));
	yield* g.call(f, P("/proc/set_basalt_light"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(4560, "/turf/open/floor/carpet", "/turf/open/floor", {
	broken_states: null,
	name: "carpet",
	desc: "Soft velvet carpeting. Feels good between your toes.",
	icon: rt.rsc("icons/turf/floors/carpet.dmi"),
	icon_state: "carpet",
	floor_tile: rt.typePath("/obj/item/stack/tile/carpet"),
	smooth: 1,
	canSmoothWith: null,
	flags: 0,
});

// /turf/open/floor/carpet/proc/<init>  (code/game/turfs/simulated/floor/fancy_floor.dm:141)
rt.def("/turf/open/floor/carpet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("damaged"));
	$0 = $0;
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/carpet")));
	return f.dot;
});

// /turf/open/floor/carpet/proc/Initialize  (code/game/turfs/simulated/floor/fancy_floor.dm:147)  may sleep
rt.def("/turf/open/floor/carpet/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /turf/open/floor/carpet/proc/update_icon  (code/game/turfs/simulated/floor/fancy_floor.dm:151)  may sleep
rt.def("/turf/open/floor/carpet/proc/update_icon", function* update_icon(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	if ((!truthy(rt.sv(f, "broken")) && !truthy(rt.sv(f, "burnt")))) {
		if (truthy(rt.sv(f, "smooth"))) {
			yield* g.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
		}
	} else {
		yield* g.srcCall(f, "make_plating");
		if (!truthy(rt.sv(f, "smooth"))) return f.dot;
		yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

rt.type(4561, "/turf/open/floor/carpet/black", "/turf/open/floor/carpet", {
	icon: rt.rsc("icons/turf/floors/carpet_black.dmi"),
	floor_tile: rt.typePath("/obj/item/stack/tile/carpet/black"),
	canSmoothWith: null,
});

// /turf/open/floor/carpet/black/proc/<init>  (code/game/turfs/simulated/floor/fancy_floor.dm:164)
rt.def("/turf/open/floor/carpet/black/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/carpet/black")));
	return f.dot;
});

// /turf/open/floor/carpet/proc/narsie_act  (code/game/turfs/simulated/floor/fancy_floor.dm:168)  may sleep
rt.def("/turf/open/floor/carpet/proc/narsie_act", function* narsie_act(f: Frame, force: Value, ignore_mobs: Value, probability: Value) {
	let I: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [force, ignore_mobs, probability, I, A, $e];
	if (live(probability) === null) {
		probability = 20;
	}
	f.dot = (rt.op(f, "Prob", [], [live(probability)]) || live(force));
	I = null;
	rt.forList(f, 0, live(f.src));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		A = live(I);
		if ((truthy(live(ignore_mobs)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))))) {
			continue;
		}
		if ((truthy((yield* g.call(f, P("/proc/ismob"), null, [live(A)]))) || truthy(live(f.dot)))) {
			yield* g.callName(f, live(A), "narsie_act", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/open/floor/carpet/proc/break_tile  (code/game/turfs/simulated/floor/fancy_floor.dm:178)  may sleep
rt.def("/turf/open/floor/carpet/proc/break_tile", function* break_tile(f: Frame) {
	rt.setSv(f, "broken", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /turf/open/floor/carpet/proc/burn_tile  (code/game/turfs/simulated/floor/fancy_floor.dm:182)  may sleep
rt.def("/turf/open/floor/carpet/proc/burn_tile", function* burn_tile(f: Frame) {
	rt.setSv(f, "burnt", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(4562, "/turf/open/floor/fakepit", "/turf/open/floor", {
	desc: "A clever illusion designed to look like a bottomless pit.",
	smooth: 11,
	canSmoothWith: null,
	icon: rt.rsc("icons/turf/floors/chasms.dmi"),
	icon_state: "smooth",
});

// /turf/open/floor/fakepit/proc/<init>  (code/game/turfs/simulated/floor/fancy_floor.dm:191)
rt.def("/turf/open/floor/fakepit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/open/floor/fakepit")));
	return f.dot;
});

// /turf/open/floor/fakepit/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/floor/fancy_floor.dm:196)
rt.def("/turf/open/floor/fakepit/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/floors.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), "basalt");
	return 1;
});

rt.type(4563, "/turf/open/floor/fakespace", "/turf/open/floor", {
	broken_states: null,
	icon: rt.rsc("icons/turf/space.dmi"),
	icon_state: "0",
	floor_tile: rt.typePath("/obj/item/stack/tile/fakespace"),
	plane: -95,
});

// /turf/open/floor/fakespace/proc/<init>  (code/game/turfs/simulated/floor/fancy_floor.dm:204)
rt.def("/turf/open/floor/fakespace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "broken_states", rt.list("damaged"));
	return f.dot;
});

// /turf/open/floor/fakespace/proc/Initialize  (code/game/turfs/simulated/floor/fancy_floor.dm:208)  may sleep
rt.def("/turf/open/floor/fakespace/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
	return f.dot;
}, true);

// /turf/open/floor/fakespace/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/floor/fancy_floor.dm:212)
rt.def("/turf/open/floor/fakespace/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame, underlay_appearance: Value, asking_turf: Value, adjacency_dir: Value) {
	rt.setFv(f, "icon", live(underlay_appearance), rt.rsc("icons/turf/space.dmi"));
	rt.setFv(f, "icon_state", live(underlay_appearance), fmt("＀", [rt.modulus(rt.bitXor(add(rt.sv(f, "x"), rt.sv(f, "y")), add(rt.op(f, "BitNot", [], [multiply(rt.sv(f, "x"), rt.sv(f, "y"))]), rt.sv(f, "z"))), 25)]));
	rt.setFv(f, "plane", live(underlay_appearance), -95);
	return 1;
});
