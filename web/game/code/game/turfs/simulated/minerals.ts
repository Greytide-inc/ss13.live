// From code/game/turfs/simulated/minerals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4466, "/turf/closed/mineral", "/turf/closed", {
	smooth_icon: rt.rsc("icons/turf/smoothrocks.dmi"),
	environment_type: "asteroid",
	mineralType: null,
	mineralAmt: 3,
	spread: 0,
	spreadChance: 0,
	last_act: 0,
	scan_state: "",
	defer_change: 0,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
	name: "rock",
	icon: rt.rsc("icons/turf/mining.dmi"),
	icon_state: "rock",
	smooth: 10,
	baseturf: rt.typePath("/turf/open/floor/plating/asteroid/airless"),
	initial_gas_mix: "TEMP=2.7",
	opacity: 1,
	density: 1,
	blocks_air: 1,
	layer: 4.3,
	temperature: 2.7,
});

// /turf/closed/mineral/proc/Initialize  (code/game/turfs/simulated/minerals.dm:28)  may sleep
rt.def("/turf/closed/mineral/proc/Initialize", function* Initialize(f: Frame) {
	let dir: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [dir, _T, $e];
	if (!truthy(rt.sv(f, "canSmoothWith"))) {
		rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/mineral"), T("/turf/closed/indestructible")));
	}
	rt.setSv(f, "pixel_y", -4);
	rt.setSv(f, "pixel_x", -4);
	rt.setSv(f, "icon", rt.sv(f, "smooth_icon"));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(((truthy(rt.sv(f, "mineralType")) && truthy(rt.sv(f, "mineralAmt"))) && truthy(rt.sv(f, "spread"))) && truthy(rt.sv(f, "spreadChance")))) return f.dot;
	dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "spreadChance")]))) {
			if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), live(dir))), T("/turf/closed/mineral/random")) ? 1 : 0))) {
				yield* g.srcCall(f, "Spread", live(_T));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /turf/closed/mineral/proc/shuttleRotate  (code/game/turfs/simulated/minerals.dm:42)
rt.def("/turf/closed/mineral/proc/shuttleRotate", function shuttleRotate(f: Frame, rotation: Value) {
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/angle2dir"), null, [add(live(rotation), rt.call(f, P("/proc/dir2angle"), null, [rt.sv(f, "dir")]))])]);
	rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	return f.dot;
});

// /turf/closed/mineral/proc/get_smooth_underlay_icon  (code/game/turfs/simulated/minerals.dm:47)
rt.def("/turf/closed/mineral/proc/get_smooth_underlay_icon", function get_smooth_underlay_icon(f: Frame) {
	if (truthy(rt.sv(f, "turf_type"))) {
		rt.setFv(f, "icon", live(f.args[0]), rt.initial(f, rt.sv(f, "turf_type"), "icon"));
		rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, rt.sv(f, "turf_type"), "icon_state"));
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["underlay_appearance", "asking_turf", "adjacency_dir"] });

// /turf/closed/mineral/proc/attackby  (code/game/turfs/simulated/minerals.dm:54)  may sleep
rt.def("/turf/closed/mineral/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	let _T: Value = null;
	f.vars = () => [_P, user, params, _T];
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(_P), T("/obj/item/weapon/pickaxe")) ? 1 : 0))) {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", live(user)))])))) {
			return live(f.dot);
		}
		if (rt.gt(add(rt.sv(f, "last_act"), rt.fv(f, "digspeed", live(_P))), rt.worldTime(f))) {
			return live(f.dot);
		}
		rt.setSv(f, "last_act", rt.worldTime(f));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start picking...</span>"]);
		yield* g.callName(f, live(_P), "playDigSound", []);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "digspeed", live(_P)), "target", live(f.src)], rt.Args.Named)))) {
			if (truthy((rt.istype(live(f.src), T("/turf/closed/mineral")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You finish cutting into the rock.</span>"]);
				yield* g.srcCall(f, "gets_drilled", live(user));
			}
		}
	} else {
		return (yield* g.srcCall(f, "attack_hand", live(user)));
	}
	return f.dot;
}, true);

// /turf/closed/mineral/proc/gets_drilled  (code/game/turfs/simulated/minerals.dm:78)  may sleep
rt.def("/turf/closed/mineral/proc/gets_drilled", function* gets_drilled(f: Frame) {
	let i: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [i, M, $e];
	if (((truthy(rt.sv(f, "mineralType")) && rt.gt(rt.fv(f, "mineralAmt", live(f.src)), 0)) && rt.lt(rt.fv(f, "mineralAmt", live(f.src)), 11))) {
		i = null;
		rt.forRange(f, 0, 1, rt.sv(f, "mineralAmt"), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.new_(f, rt.sv(f, "mineralType"), [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	M = null;
	rt.forList(f, 0, live(f.src), T("/obj/effect/temp_visual/mining_overlay"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "turf_type"), rt.sv(f, "defer_change"));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/turf/proc/AfterChange")])), 1, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/break_stone.ogg"), 50, 1]);
	return f.dot;
}, true);

// /turf/closed/mineral/proc/attack_animal  (code/game/turfs/simulated/minerals.dm:90)  may sleep
rt.def("/turf/closed/mineral/proc/attack_animal", function* attack_animal(f: Frame) {
	if (rt.ge(rt.fv(f, "environment_smash", live(f.args[0])), 2)) {
		yield* g.srcCall(f, "gets_drilled");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /turf/closed/mineral/proc/attack_alien  (code/game/turfs/simulated/minerals.dm:95)  may sleep
rt.def("/turf/closed/mineral/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You start digging into the rock...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/break_stone.ogg"), 50, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(M), null, 40, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>You tunnel into the rock.</span>"]);
	yield* g.srcCall(f, "gets_drilled", live(M));
	return f.dot;
}, true);

// /turf/closed/mineral/proc/Bumped  (code/game/turfs/simulated/minerals.dm:102)  may sleep
rt.def("/turf/closed/mineral/proc/Bumped", function* Bumped(f: Frame) {
	let H: Value = null, I: Value = null, R: Value = null;
	f.vars = () => [H, I, R];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.args[0]);
		if (truthy((I = (yield* g.callName(f, live(H), "is_holding_item_of_type", [T("/obj/item/weapon/pickaxe")]))))) {
			yield* g.srcCall(f, "attackby", live(I), live(H));
		}
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (truthy((rt.istype(rt.gv(f, "module_active", (R = live(f.args[0]))), T("/obj/item/weapon/pickaxe")) ? 1 : 0))) {
				yield* g.callName(f, live(f.src), "attackby", [rt.fv(f, "module_active", live(R)), live(R)]);
				return live(f.dot);
			}
		} else {
			return live(f.dot);
		}
	}
	return f.dot;
}, true, { args: ["AM"] });

// /turf/closed/mineral/proc/acid_melt  (code/game/turfs/simulated/minerals.dm:124)  may sleep
rt.def("/turf/closed/mineral/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf"));
	return f.dot;
}, true);

// /turf/closed/mineral/proc/ex_act  (code/game/turfs/simulated/minerals.dm:127)  may sleep
rt.def("/turf/closed/mineral/proc/ex_act", function* ex_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.callName(f, live(f.src), "gets_drilled", [null, 1]);
		}
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [90]))) {
			yield* g.callName(f, live(f.src), "gets_drilled", [null, 1]);
		}
	} else if ($0 === 1) {
		yield* g.callName(f, live(f.src), "gets_drilled", [null, 1]);
	}
	return live(f.dot);
}, true, { args: ["severity", "target"], waitfor: false });

// /turf/closed/mineral/proc/Spread  (code/game/turfs/simulated/minerals.dm:140)  may sleep
rt.def("/turf/closed/mineral/proc/Spread", function* Spread(f: Frame, _T: Value) {
	f.vars = () => [_T];
	yield* g.callName(f, live(_T), "ChangeTurf", [rt.sv(f, "type")]);
	return f.dot;
}, true);

rt.type(4468, "/turf/closed/mineral/random", "/turf/closed/mineral", {
	mineralSpawnChanceList: null,
	mineralChance: 13,
	display_icon_state: "rock",
});

// /turf/closed/mineral/random/proc/Initialize  (code/game/turfs/simulated/minerals.dm:149)  may sleep
rt.def("/turf/closed/mineral/random/proc/Initialize", function* Initialize(f: Frame) {
	let path: Value = null, _T: Value = null, M: Value = null;
	f.vars = () => [path, _T, M];
	if (!truthy(rt.sv(f, "mineralSpawnChanceList"))) {
		rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium"), 5, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 10, T("/turf/closed/mineral/silver"), 12, T("/turf/closed/mineral/plasma"), 20, T("/turf/closed/mineral/iron"), 40, T("/turf/closed/mineral/titanium"), 11, T("/turf/closed/mineral/gibtonite"), 4, T("/turf/open/floor/plating/asteroid/airless/cave"), 2, T("/turf/closed/mineral/bscrystal"), 1]));
	}
	if (truthy(rt.sv(f, "display_icon_state"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "display_icon_state"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "mineralChance")]))) return f.dot;
	path = (yield* g.call(f, P("/proc/pickweight"), null, [rt.sv(f, "mineralSpawnChanceList")]));
	if (!(truthy((_T = (yield* g.srcCall(f, "ChangeTurf", live(path), 0, 1)))) && truthy((rt.istype(live(_T), T("/turf/closed/mineral")) ? 1 : 0)))) return f.dot;
	rt.setFv(f, "mineralAmt", (M = live(_T)), (yield* g.call(f, P("/proc/rand"), null, [1, 5])));
	rt.setFv(f, "environment_type", live(M), rt.fv(f, "environment_type", live(f.src)));
	rt.setFv(f, "turf_type", live(M), rt.fv(f, "turf_type", live(f.src)));
	rt.setFv(f, "baseturf", live(M), rt.fv(f, "baseturf", live(f.src)));
	f.src = live(M);
	yield* g.callName(f, live(M), "levelupdate", []);
	return f.dot;
}, true);

rt.type(4469, "/turf/closed/mineral/random/high_chance", "/turf/closed/mineral/random", {
	mineralChance: 25,
	icon_state: "rock_highchance",
	mineralSpawnChanceList: null,
});

// /turf/closed/mineral/random/high_chance/proc/<init>  (code/game/turfs/simulated/minerals.dm:174)
rt.def("/turf/closed/mineral/random/high_chance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium"), 35, T("/turf/closed/mineral/diamond"), 30, T("/turf/closed/mineral/gold"), 45, T("/turf/closed/mineral/titanium"), 45, T("/turf/closed/mineral/silver"), 50, T("/turf/closed/mineral/plasma"), 50, T("/turf/closed/mineral/bscrystal"), 20]));
	return f.dot;
});

rt.type(4470, "/turf/closed/mineral/random/high_chance/volcanic", "/turf/closed/mineral/random/high_chance", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// /turf/closed/mineral/random/high_chance/volcanic/proc/<init>  (code/game/turfs/simulated/minerals.dm:184)
rt.def("/turf/closed/mineral/random/high_chance/volcanic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 35, T("/turf/closed/mineral/diamond/volcanic"), 30, T("/turf/closed/mineral/gold/volcanic"), 45, T("/turf/closed/mineral/titanium/volcanic"), 45, T("/turf/closed/mineral/silver/volcanic"), 50, T("/turf/closed/mineral/plasma/volcanic"), 50, T("/turf/closed/mineral/bscrystal/volcanic"), 20]));
	return f.dot;
});

rt.type(4471, "/turf/closed/mineral/random/low_chance", "/turf/closed/mineral/random", {
	mineralChance: 6,
	icon_state: "rock_lowchance",
	mineralSpawnChanceList: null,
});

// /turf/closed/mineral/random/low_chance/proc/<init>  (code/game/turfs/simulated/minerals.dm:193)
rt.def("/turf/closed/mineral/random/low_chance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium"), 2, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 4, T("/turf/closed/mineral/titanium"), 4, T("/turf/closed/mineral/silver"), 6, T("/turf/closed/mineral/plasma"), 15, T("/turf/closed/mineral/iron"), 40, T("/turf/closed/mineral/gibtonite"), 2, T("/turf/closed/mineral/bscrystal"), 1]));
	return f.dot;
});

rt.type(4472, "/turf/closed/mineral/random/volcanic", "/turf/closed/mineral/random", {
	environment_type: "basalt",
	defer_change: 1,
	mineralChance: 10,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// /turf/closed/mineral/random/volcanic/proc/<init>  (code/game/turfs/simulated/minerals.dm:207)
rt.def("/turf/closed/mineral/random/volcanic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 5, T("/turf/closed/mineral/diamond/volcanic"), 1, T("/turf/closed/mineral/gold/volcanic"), 10, T("/turf/closed/mineral/titanium/volcanic"), 11, T("/turf/closed/mineral/silver/volcanic"), 12, T("/turf/closed/mineral/plasma/volcanic"), 20, T("/turf/closed/mineral/iron/volcanic"), 40, T("/turf/closed/mineral/gibtonite/volcanic"), 4, T("/turf/open/floor/plating/asteroid/airless/cave/volcanic"), 1, T("/turf/closed/mineral/bscrystal/volcanic"), 1]));
	return f.dot;
});

rt.type(4473, "/turf/closed/mineral/random/labormineral", "/turf/closed/mineral/random", {
	mineralSpawnChanceList: null,
	icon_state: "rock_labor",
});

// /turf/closed/mineral/random/labormineral/proc/<init>  (code/game/turfs/simulated/minerals.dm:214)
rt.def("/turf/closed/mineral/random/labormineral/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium"), 3, T("/turf/closed/mineral/diamond"), 1, T("/turf/closed/mineral/gold"), 8, T("/turf/closed/mineral/titanium"), 8, T("/turf/closed/mineral/silver"), 20, T("/turf/closed/mineral/plasma"), 30, T("/turf/closed/mineral/iron"), 95, T("/turf/closed/mineral/gibtonite"), 2]));
	return f.dot;
});

rt.type(4474, "/turf/closed/mineral/random/labormineral/volcanic", "/turf/closed/mineral/random/labormineral", {
	environment_type: "basalt",
	defer_change: 1,
	turf_type: rt.typePath("/turf/open/floor/plating/asteroid/basalt/lava_land_surface"),
	baseturf: rt.typePath("/turf/open/floor/plating/lava/smooth/lava_land_surface"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	mineralSpawnChanceList: null,
});

// /turf/closed/mineral/random/labormineral/volcanic/proc/<init>  (code/game/turfs/simulated/minerals.dm:227)
rt.def("/turf/closed/mineral/random/labormineral/volcanic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mineralSpawnChanceList", rt.alist(f, [T("/turf/closed/mineral/uranium/volcanic"), 3, T("/turf/closed/mineral/diamond/volcanic"), 1, T("/turf/closed/mineral/gold/volcanic"), 8, T("/turf/closed/mineral/titanium/volcanic"), 8, T("/turf/closed/mineral/silver/volcanic"), 20, T("/turf/closed/mineral/plasma/volcanic"), 30, T("/turf/closed/mineral/bscrystal/volcanic"), 1, T("/turf/closed/mineral/gibtonite/volcanic"), 2, T("/turf/closed/mineral/iron/volcanic"), 95]));
	return f.dot;
});

rt.type(4494, "/turf/closed/mineral/ash_rock", "/turf/closed/mineral", {
	smooth_icon: rt.rsc("icons/turf/walls/rock_wall.dmi"),
	environment_type: "waste",
	defer_change: 1,
	name: "rock",
	icon: rt.rsc("icons/turf/mining.dmi"),
	icon_state: "rock2",
	smooth: 10,
	canSmoothWith: null,
	baseturf: rt.typePath("/turf/open/floor/plating/ashplanet/wateryrock"),
	initial_gas_mix: "o2=14;n2=23;TEMP=300",
	turf_type: rt.typePath("/turf/open/floor/plating/ashplanet/rocky"),
});

// /turf/closed/mineral/ash_rock/proc/<init>  (code/game/turfs/simulated/minerals.dm:373)
rt.def("/turf/closed/mineral/ash_rock/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed")));
	return f.dot;
});

rt.type(4495, "/turf/closed/mineral/gibtonite", "/turf/closed/mineral", {
	det_time: 8,
	stage: 0,
	activated_ckey: null,
	activated_name: null,
	activated_overlay: null,
	mineralAmt: 1,
	spreadChance: 0,
	spread: 0,
	scan_state: "rock_Gibtonite",
});

// /turf/closed/mineral/gibtonite/proc/Initialize  (code/game/turfs/simulated/minerals.dm:395)  may sleep
rt.def("/turf/closed/mineral/gibtonite/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "det_time", (yield* g.call(f, P("/proc/rand"), null, [8, 10])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /turf/closed/mineral/gibtonite/proc/attackby  (code/game/turfs/simulated/minerals.dm:399)  may sleep
rt.def("/turf/closed/mineral/gibtonite/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mining_scanner")) ? 1 : 0)) || (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/t_scanner/adv_mining_scanner")) ? 1 : 0)) && isEqual(rt.sv(f, "stage"), 1)))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ holds ＀ to ＀...</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You use ＀ to locate where to cut off the chain reaction and attempt to stop it...</span>", [live(f.args[0])])]);
		yield* g.srcCall(f, "defuse");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /turf/closed/mineral/gibtonite/proc/explosive_reaction  (code/game/turfs/simulated/minerals.dm:405)
rt.def("/turf/closed/mineral/gibtonite/proc/explosive_reaction", function explosive_reaction(f: Frame, user: Value, triggered_by_explosion: Value) {
	let bombturf: Value = null, A: Value = null, notify_admins: Value = null;
	f.vars = () => [user, triggered_by_explosion, bombturf, A, notify_admins];
	if (live(user) === null) {
		user = null;
	}
	if (live(triggered_by_explosion) === null) {
		triggered_by_explosion = 0;
	}
	if (!isEqual(rt.sv(f, "stage"), 0)) return f.dot;
	rt.setSv(f, "activated_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/turf/smoothrocks.dmi"), "rock_Gibtonite_active", 4.349999904632568]));
	rt.callSrc(f, "add_overlay", [rt.sv(f, "activated_overlay")]);
	rt.setSv(f, "name", "gibtonite deposit");
	rt.setSv(f, "desc", "An active gibtonite reserve. Run!");
	rt.setSv(f, "stage", 1);
	rt.callSrc(f, "visible_message", ["<span class='danger'>There was gibtonite inside! It's going to explode!</span>"]);
	bombturf = rt.getStep(f, live(f.src), 0);
	A = rt.call(f, P("/proc/get_area"), null, [live(bombturf)]);
	notify_admins = 0;
	if (!isEqual(rt.sv(f, "z"), 5)) {
		notify_admins = 1;
		if (!truthy(live(triggered_by_explosion))) {
			rt.call(f, P("/proc/message_admins"), null, [fmt("＀ has triggered a gibtonite deposit reaction at ＀ ＀.", [fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		} else {
			rt.call(f, P("/proc/message_admins"), null, [fmt("An explosion has triggered a gibtonite deposit reaction at ＀ ＀.", [rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		}
	}
	if (!truthy(live(triggered_by_explosion))) {
		rt.call(f, P("/proc/log_game"), null, [fmt("＀ has triggered a gibtonite deposit reaction at ＀ ＀.", [rt.call(f, P("/proc/key_name"), null, [live(user)]), rt.fv(f, "name", live(A)), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	} else {
		rt.call(f, P("/proc/log_game"), null, [fmt("An explosion has triggered a gibtonite deposit reaction at ＀ ＀", [rt.fv(f, "name", live(A)), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	}
	rt.callSrc(f, "countdown", [live(notify_admins)]);
	return f.dot;
});

// /turf/closed/mineral/gibtonite/proc/countdown  (code/game/turfs/simulated/minerals.dm:432)  may sleep
rt.def("/turf/closed/mineral/gibtonite/proc/countdown", function* countdown(f: Frame, notify_admins: Value) {
	let bombturf: Value = null;
	f.vars = () => [notify_admins, bombturf];
	if (live(notify_admins) === null) {
		notify_admins = 0;
	}
	while (((truthy((rt.istype(live(f.src), T("/turf/closed/mineral/gibtonite")) ? 1 : 0)) && isEqual(rt.sv(f, "stage"), 1)) && rt.gt(rt.sv(f, "det_time"), 0)) && rt.ge(rt.sv(f, "mineralAmt"), 1)) {
		rt.incSrcVar(f, "det_time", -1, true);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
	}
	if (!truthy((rt.istype(live(f.src), T("/turf/closed/mineral/gibtonite")) ? 1 : 0))) return f.dot;
	if (!((isEqual(rt.sv(f, "stage"), 1) && rt.le(rt.sv(f, "det_time"), 0)) && rt.ge(rt.sv(f, "mineralAmt"), 1))) return f.dot;
	bombturf = rt.getStep(f, live(f.src), 0);
	rt.setSv(f, "mineralAmt", 0);
	rt.setSv(f, "stage", 3);
	yield* g.call(f, P("/proc/explosion"), null, [null, live(bombturf), null, 1, null, 3, null, 5, "adminlog", live(notify_admins)], rt.Args.Named);
	return f.dot;
}, true, { waitfor: false });

// /turf/closed/mineral/gibtonite/proc/defuse  (code/game/turfs/simulated/minerals.dm:443)
rt.def("/turf/closed/mineral/gibtonite/proc/defuse", function defuse(f: Frame) {
	if (!isEqual(rt.sv(f, "stage"), 1)) return f.dot;
	rt.callSrc(f, "cut_overlay", [rt.sv(f, "activated_overlay")]);
	rt.setFv(f, "icon_state", rt.sv(f, "activated_overlay"), "rock_Gibtonite_inactive");
	rt.callSrc(f, "add_overlay", [rt.sv(f, "activated_overlay")]);
	rt.setSv(f, "desc", "An inactive gibtonite reserve. The ore can be extracted.");
	rt.setSv(f, "stage", 2);
	if (rt.lt(rt.sv(f, "det_time"), 0)) {
		rt.setSv(f, "det_time", 0);
	}
	rt.callSrc(f, "visible_message", [fmt("<span class='notice'>The chain reaction was stopped! The gibtonite had ＀ reactions left till the explosion!</span>", [rt.fv(f, "det_time", live(f.src))])]);
	return f.dot;
});

// /turf/closed/mineral/gibtonite/proc/gets_drilled  (code/game/turfs/simulated/minerals.dm:454)  may sleep
rt.def("/turf/closed/mineral/gibtonite/proc/gets_drilled", function* gets_drilled(f: Frame, user: Value, triggered_by_explosion: Value) {
	let bombturf: Value = null, G: Value = null;
	f.vars = () => [user, triggered_by_explosion, bombturf, G];
	if (live(triggered_by_explosion) === null) {
		triggered_by_explosion = 0;
	}
	if ((isEqual(rt.sv(f, "stage"), 0) && rt.ge(rt.sv(f, "mineralAmt"), 1))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 50, 1]);
		yield* g.srcCall(f, "explosive_reaction", live(user), live(triggered_by_explosion));
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "stage"), 1) && rt.ge(rt.sv(f, "mineralAmt"), 1))) {
		bombturf = rt.getStep(f, live(f.src), 0);
		rt.setSv(f, "mineralAmt", 0);
		rt.setSv(f, "stage", 3);
		yield* g.call(f, P("/proc/explosion"), null, [null, live(bombturf), null, 1, null, 2, null, 5, "adminlog", 0], rt.Args.Named);
	}
	if (isEqual(rt.sv(f, "stage"), 2)) {
		G = (yield* g.new_(f, T("/obj/item/weapon/twohanded/required/gibtonite"), [live(f.src)]));
		if (rt.le(rt.sv(f, "det_time"), 0)) {
			rt.setFv(f, "quality", live(G), 3);
			rt.setFv(f, "icon_state", live(G), "Gibtonite ore 3");
		}
		if ((rt.ge(rt.sv(f, "det_time"), 1) && rt.le(rt.sv(f, "det_time"), 2))) {
			rt.setFv(f, "quality", live(G), 2);
			rt.setFv(f, "icon_state", live(G), "Gibtonite ore 2");
		}
	}
	yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "turf_type"), rt.sv(f, "defer_change"));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/turf/proc/AfterChange")])), 1, 1]);
	return f.dot;
}, true);
