// From code/controllers/subsystem/mapping.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(28, "/datum/controller/subsystem/mapping", "/datum/controller/subsystem", {
	nuke_tiles: null,
	nuke_threats: null,
	config: null,
	next_map_config: null,
	map_templates: null,
	ruins_templates: null,
	space_ruins_templates: null,
	lava_ruins_templates: null,
	shuttle_templates: null,
	shelter_templates: null,
	loading_ruins: 0,
	name: "Mapping",
	init_order: 12,
	flags: 2,
});

// /datum/controller/subsystem/mapping/proc/New  (code/controllers/subsystem/mapping.dm:1)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSmapping"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSmapping"), T("/datum/controller/subsystem/mapping")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSmapping")]);
		}
		rt.setGl("SSmapping", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/<init>  (code/controllers/subsystem/mapping.dm:6)
rt.def("/datum/controller/subsystem/mapping/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "nuke_tiles", rt.list());
	$0 = $0;
	rt.setSv(f, "nuke_threats", rt.list());
	$0 = $0;
	rt.setSv(f, "map_templates", rt.list());
	$0 = $0;
	rt.setSv(f, "ruins_templates", rt.list());
	$0 = $0;
	rt.setSv(f, "space_ruins_templates", rt.list());
	$0 = $0;
	rt.setSv(f, "lava_ruins_templates", rt.list());
	$0 = $0;
	rt.setSv(f, "shuttle_templates", rt.list());
	$0 = $0;
	rt.setSv(f, "shelter_templates", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/PreInit  (code/controllers/subsystem/mapping.dm:24)
rt.def("/datum/controller/subsystem/mapping/proc/PreInit", function PreInit(f: Frame) {
	if (!truthy(rt.sv(f, "config"))) {
		rt.setSv(f, "config", rt.new_(f, T("/datum/map_config"), []));
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/controller/subsystem/mapping/proc/Initialize  (code/controllers/subsystem/mapping.dm:34)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/Initialize", function* Initialize(f: Frame) {
	let mining_type: Value = null, space_zlevels: Value = null, i: Value = null;
	let $0: any, $e: any;
	f.vars = () => [mining_type, space_zlevels, i, $0, $e];
	if (truthy(rt.fv(f, "defaulted", rt.sv(f, "config")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Unable to load next map config, defaulting to Box Station</span>"]);
	}
	yield* g.srcCall(f, "loadWorld");
	yield* g.call(f, P("/proc/repopulate_sorted_areas"), null, []);
	yield* g.call(f, P("/proc/process_teleport_locs"), null, []);
	yield* g.srcCall(f, "preloadTemplates");
	yield* g.call(f, P("/proc/createRandomZlevel"), null, []);
	rt.setSv(f, "loading_ruins", 1);
	if (isEqual((mining_type = rt.fv(f, "minetype", rt.sv(f, "config"))), "lavaland")) {
		yield* g.call(f, P("/proc/seedRuins"), null, [rt.list(5), rt.fv(f, "lavaland_budget", rt.gl("config")), T("/area/lavaland/surface/outdoors/unexplored"), rt.sv(f, "lava_ruins_templates")]);
		yield* g.call(f, P("/proc/spawn_rivers"), null, []);
	}
	space_zlevels = rt.list();
	i = null;
	rt.forRange(f, 0, 3, 12, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(i);
		if ($0 === 5 || $0 === 5 || $0 === 12 || $0 === 11) {
			continue;
		} else {
			space_zlevels = rt.modify(live(space_zlevels), live(i), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/seedRuins"), null, [live(space_zlevels), rt.fv(f, "space_budget", rt.gl("config")), T("/area/space"), rt.sv(f, "space_ruins_templates")]);
	rt.setSv(f, "loading_ruins", 0);
	yield* g.call(f, P("/proc/repopulate_sorted_areas"), null, []);
	yield* g.call(f, P("/proc/setup_map_transitions"), null, []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["timeofday"] });

// /datum/controller/subsystem/mapping/proc/add_nuke_threat  (code/controllers/subsystem/mapping.dm:71)
rt.def("/datum/controller/subsystem/mapping/proc/add_nuke_threat", function add_nuke_threat(f: Frame, nuke: Value) {
	rt.setAt(rt.sv(f, "nuke_threats"), live(nuke), 1);
	rt.callSrc(f, "check_nuke_threats", []);
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/remove_nuke_threat  (code/controllers/subsystem/mapping.dm:74)
rt.def("/datum/controller/subsystem/mapping/proc/remove_nuke_threat", function remove_nuke_threat(f: Frame, nuke: Value) {
	(rt.modSrcVar(f, "nuke_threats", live(nuke), subtract));
	rt.callSrc(f, "check_nuke_threats", []);
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/check_nuke_threats  (code/controllers/subsystem/mapping.dm:78)
rt.def("/datum/controller/subsystem/mapping/proc/check_nuke_threats", function check_nuke_threats(f: Frame) {
	let d: Value = null, N: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [d, N, C, $e];
	d = null;
	rt.forList(f, 0, rt.sv(f, "nuke_threats"), T("/datum"));
	while (($e = rt.next(f, 0)) !== undefined) {
		d = $e;
		if ((!truthy((rt.istype(live(d), T("/datum")) ? 1 : 0)) || (!truthy(live(d)) || truthy(rt.fv(f, "gc_destroyed", live(d)))))) {
			(rt.modSrcVar(f, "nuke_threats", live(d), subtract));
		}
	}
	rt.endFor(f, 0);
	N = null;
	rt.forList(f, 0, rt.sv(f, "nuke_tiles"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		rt.callName(f, (C = live(N)), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/Recover  (code/controllers/subsystem/mapping.dm:87)
rt.def("/datum/controller/subsystem/mapping/proc/Recover", function Recover(f: Frame) {
	(rt.modSrcVar(f, "flags", 1, rt.bitOr));
	rt.setSv(f, "map_templates", rt.fv(f, "map_templates", rt.gl("SSmapping")));
	rt.setSv(f, "ruins_templates", rt.fv(f, "ruins_templates", rt.gl("SSmapping")));
	rt.setSv(f, "space_ruins_templates", rt.fv(f, "space_ruins_templates", rt.gl("SSmapping")));
	rt.setSv(f, "lava_ruins_templates", rt.fv(f, "lava_ruins_templates", rt.gl("SSmapping")));
	rt.setSv(f, "shuttle_templates", rt.fv(f, "shuttle_templates", rt.gl("SSmapping")));
	rt.setSv(f, "shelter_templates", rt.fv(f, "shelter_templates", rt.gl("SSmapping")));
	rt.setSv(f, "config", rt.fv(f, "config", rt.gl("SSmapping")));
	rt.setSv(f, "next_map_config", rt.fv(f, "next_map_config", rt.gl("SSmapping")));
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/TryLoadZ  (code/controllers/subsystem/mapping.dm:100)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/TryLoadZ", function* TryLoadZ(f: Frame, filename: Value, errorList: Value, forceLevel: Value, last: Value) {
	f.vars = () => [filename, errorList, forceLevel, last];
	if (!truthy(rt.gl("loader"))) {
		rt.setGl("loader", (yield* g.new_(f, T("/dmm_suite"), [])));
	}
	if (!truthy((yield* g.callName(f, rt.gl("loader"), "load_map", [null, (yield* g.call(f, P("/proc/file"), null, [live(filename)])), null, 0, null, 0, null, live(forceLevel), "no_changeturf", 1], rt.Args.Named)))) {
		(errorList = rt.modify(live(errorList), live(filename), rt.bitOr));
	}
	if (!truthy(live(last))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.gl("loader")]);
	rt.setGl("loader", null);
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/CreateSpace  (code/controllers/subsystem/mapping.dm:108)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/CreateSpace", function* CreateSpace(f: Frame, MaxZLevel: Value) {
	f.vars = () => [MaxZLevel];
	while (rt.lt(rt.fv(f, "maxz", rt.world()), live(MaxZLevel))) {
		rt.incField(f, rt.world(), "maxz", 1, false);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/loadWorld  (code/controllers/subsystem/mapping.dm:115)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/loadWorld", function* loadWorld(f: Frame) {
	let FailedZs: Value = null, start_time: Value = null, query_round_map_name: Value = null, msg: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [FailedZs, start_time, query_round_map_name, msg, I, $0, $1, $2, $3, $e];
	FailedZs = rt.list();
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	start_time = add($0, multiply($1, $2));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", [fmt("Loading ＀...", [rt.fv(f, "map_name", rt.sv(f, "config"))])])]);
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Loading ＀...", [rt.fv(f, "map_name", rt.sv(f, "config"))])]);
	yield* g.srcCall(f, "TryLoadZ", (yield* g.callName(f, rt.sv(f, "config"), "GetFullMapPath", [])), live(FailedZs), 2);
	$0 = rt.world();
	$1 = rt.fv(f, "timeofday", rt.world());
	$2 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$3 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$3 = rt.gl("midnight_rollovers");
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='boldannounce'>＀</span>", [fmt("Loaded station in ＀s!", [divide(subtract(add($1, multiply($2, $3)), live(start_time)), 10)])])]);
	$0 = rt.fv(f, "timeofday", rt.world());
	$1 = 864000;
	if (!isEqual(rt.gl("rollovercheck_last_timeofday"), rt.fv(f, "timeofday", rt.world()))) {
		$2 = (yield* g.call(f, P("/proc/update_midnight_rollover"), null, []));
	} else {
		$2 = rt.gl("midnight_rollovers");
	}
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Loaded station in ＀s!", [divide(subtract(add($0, multiply($1, $2)), live(start_time)), 10)])]);
	if (!isEqual(rt.fv(f, "minetype", rt.sv(f, "config")), "lavaland")) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", ["WARNING: A map without lavaland set as it's minetype was loaded! This is being ignored! Update the maploader code!"])]);
		yield* g.call(f, P("/proc/log_world"), null, ["WARNING: A map without lavaland set as it's minetype was loaded! This is being ignored! Update the maploader code!"]);
	}
	yield* g.srcCall(f, "CreateSpace", 12);
	if (!truthy(rt.length(live(FailedZs)))) return f.dot;
	msg = fmt("RED ALERT! The following map files failed to load: ＀", [rt.index(live(FailedZs), 1)]);
	if (rt.gt(rt.len(f, live(FailedZs)), 1)) {
		I = null;
		rt.forRange(f, 0, 2, rt.len(f, live(FailedZs)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			msg = rt.modify(live(msg), fmt(", ＀", [rt.index(live(FailedZs), live(I))]), add);
		}
		rt.endFor(f, 0);
	}
	msg = rt.modify(live(msg), ". Yell at your server host!", add);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>＀</span>", [live(msg)])]);
	yield* g.call(f, P("/proc/log_world"), null, [live(msg)]);
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/maprotate  (code/controllers/subsystem/mapping.dm:142)
rt.def("/datum/controller/subsystem/mapping/proc/maprotate", function maprotate(f: Frame) {
	let players: Value = null, mapvotes: Value = null, c: Value = null, vote: Value = null, M: Value = null, map: Value = null, VM: Value = null, pickedmap: Value = null;
	let $e: any;
	f.vars = () => [players, mapvotes, c, vote, M, map, VM, pickedmap, $e];
	players = rt.len(f, rt.gl("clients"));
	mapvotes = rt.list();
	if (truthy(rt.fv(f, "allow_map_voting", rt.gl("config")))) {
		c = null;
		rt.forList(f, 0, rt.gl("clients"), T("/client"));
		while (($e = rt.next(f, 0)) !== undefined) {
			c = $e;
			if (!truthy((vote = rt.gv(f, "preferred_map", rt.fv(f, "prefs", live(c)))))) {
				if (truthy(rt.fv(f, "defaultmap", rt.gl("config")))) {
					rt.modAt(live(mapvotes), rt.gv(f, "map_name", rt.fv(f, "defaultmap", rt.gl("config"))), 1, add);
				}
				continue;
			}
			rt.modAt(live(mapvotes), live(vote), 1, add);
		}
		rt.endFor(f, 0);
	} else {
		M = null;
		rt.forList(f, 0, rt.fv(f, "maplist", rt.gl("config")));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			rt.setAt(live(mapvotes), live(M), 1);
		}
		rt.endFor(f, 0);
	}
	map = null;
	rt.forList(f, 0, live(mapvotes));
	while (($e = rt.next(f, 0)) !== undefined) {
		map = $e;
		if (!truthy(live(map))) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
		}
		if (!truthy((rt.isIn(f, live(map), rt.fv(f, "maplist", rt.gl("config"))) ? 1 : 0))) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
			continue;
		}
		if (!truthy((VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(map))))) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
			continue;
		}
		if (rt.le(rt.fv(f, "voteweight", live(VM)), 0)) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
			continue;
		}
		if ((rt.gt(rt.fv(f, "config_min_users", live(VM)), 0) && rt.lt(live(players), rt.fv(f, "config_min_users", live(VM))))) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
			continue;
		}
		if ((rt.gt(rt.fv(f, "config_max_users", live(VM)), 0) && rt.gt(live(players), rt.fv(f, "config_max_users", live(VM))))) {
			rt.callName(f, live(mapvotes), "Remove", [live(map)]);
			continue;
		}
		if (truthy(rt.fv(f, "allow_map_voting", rt.gl("config")))) {
			rt.setAt(live(mapvotes), live(map), multiply(rt.index(live(mapvotes), live(map)), rt.fv(f, "voteweight", live(VM))));
		}
	}
	rt.endFor(f, 0);
	if (!truthy((pickedmap = rt.call(f, P("/proc/pickweight"), null, [live(mapvotes)])))) {
		return live(f.dot);
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("Randomly rotating map to ＀", [rt.gv(f, "map_name", (VM = rt.index(rt.fv(f, "maplist", rt.gl("config")), live(pickedmap))))])]);
	f.dot = rt.callSrc(f, "changemap", [live(VM)]);
	if (!(truthy(live(f.dot)) && !isEqual(rt.fv(f, "map_name", live(VM)), rt.fv(f, "map_name", rt.sv(f, "config"))))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<span class='boldannounce'>Map rotation has chosen ＀ for next round!</span>", [rt.fv(f, "map_name", live(VM))])]);
	return f.dot;
});

// /datum/controller/subsystem/mapping/proc/changemap  (code/controllers/subsystem/mapping.dm:190)
rt.def("/datum/controller/subsystem/mapping/proc/changemap", function changemap(f: Frame, VM: Value) {
	if (!truthy(rt.callName(f, live(VM), "MakeNextMap", []))) {
		rt.setSv(f, "next_map_config", rt.new_(f, T("/datum/map_config"), ["default_to_box", 1], rt.Args.Named));
		rt.call(f, P("/proc/message_admins"), null, [fmt("Failed to set new map with next_map.json for ＀! Using default as backup!", [rt.fv(f, "map_name", live(VM))])]);
		return live(f.dot);
	}
	rt.setSv(f, "next_map_config", live(VM));
	return 1;
});

// /datum/controller/subsystem/mapping/proc/preloadTemplates  (code/controllers/subsystem/mapping.dm:199)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/preloadTemplates", function* preloadTemplates(f: Frame, path: Value) {
	let filelist: Value = null, map: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [path, filelist, map, _T, $e];
	if (live(path) === null) {
		path = "_maps/templates/";
	}
	filelist = (yield* g.call(f, P("/proc/flist"), null, [live(path)]));
	map = null;
	rt.forList(f, 0, live(filelist));
	while (($e = rt.next(f, 0)) !== undefined) {
		map = $e;
		_T = (yield* g.new_(f, T("/datum/map_template"), ["path", fmt("＀＀", [live(path), live(map)]), "rename", fmt("＀", [live(map)])], rt.Args.Named));
		rt.setAt(rt.sv(f, "map_templates"), rt.fv(f, "name", live(_T)), live(_T));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "preloadRuinTemplates");
	yield* g.srcCall(f, "preloadShuttleTemplates");
	yield* g.srcCall(f, "preloadShelterTemplates");
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/preloadRuinTemplates  (code/controllers/subsystem/mapping.dm:210)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/preloadRuinTemplates", function* preloadRuinTemplates(f: Frame) {
	let banned: Value = null, item: Value = null, ruin_type: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [banned, item, ruin_type, R, $e];
	banned = (yield* g.call(f, P("/proc/generateMapList"), null, ["config/lavaruinblacklist.txt"]));
	banned = rt.modify(live(banned), (yield* g.call(f, P("/proc/generateMapList"), null, ["config/spaceruinblacklist.txt"])), add);
	item = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/map_template/ruin")])), T("/datum/map_template/ruin")));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy(rt.initial(f, (ruin_type = live(item)), "id"))) {
			continue;
		}
		R = (yield* g.new_(f, live(ruin_type), []));
		if (truthy((yield* g.callName(f, live(banned), "Find", [rt.fv(f, "mappath", live(R))])))) {
			continue;
		}
		rt.setAt(rt.sv(f, "map_templates"), rt.fv(f, "name", live(R)), live(R));
		rt.setAt(rt.sv(f, "ruins_templates"), rt.fv(f, "name", live(R)), live(R));
		if (truthy((rt.istype(live(R), T("/datum/map_template/ruin/lavaland")) ? 1 : 0))) {
			rt.setAt(rt.sv(f, "lava_ruins_templates"), rt.fv(f, "name", live(R)), live(R));
		} else {
			if (truthy((rt.istype(live(R), T("/datum/map_template/ruin/space")) ? 1 : 0))) {
				rt.setAt(rt.sv(f, "space_ruins_templates"), rt.fv(f, "name", live(R)), live(R));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/preloadShuttleTemplates  (code/controllers/subsystem/mapping.dm:232)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/preloadShuttleTemplates", function* preloadShuttleTemplates(f: Frame) {
	let unbuyable: Value = null, item: Value = null, shuttle_type: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [unbuyable, item, shuttle_type, S, $e];
	unbuyable = (yield* g.call(f, P("/proc/generateMapList"), null, ["config/unbuyableshuttles.txt"]));
	item = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/map_template/shuttle")])), T("/datum/map_template/shuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy(rt.initial(f, (shuttle_type = live(item)), "suffix"))) {
			continue;
		}
		S = (yield* g.new_(f, live(shuttle_type), []));
		if (truthy((yield* g.callName(f, live(unbuyable), "Find", [rt.fv(f, "mappath", live(S))])))) {
			rt.setFv(f, "can_be_bought", live(S), 0);
		}
		rt.setAt(rt.sv(f, "shuttle_templates"), rt.fv(f, "shuttle_id", live(S)), live(S));
		rt.setAt(rt.sv(f, "map_templates"), rt.fv(f, "shuttle_id", live(S)), live(S));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/mapping/proc/preloadShelterTemplates  (code/controllers/subsystem/mapping.dm:247)  may sleep
rt.def("/datum/controller/subsystem/mapping/proc/preloadShelterTemplates", function* preloadShelterTemplates(f: Frame) {
	let item: Value = null, shelter_type: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [item, shelter_type, S, $e];
	item = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/map_template/shelter")])), T("/datum/map_template/shelter")));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy(rt.initial(f, (shelter_type = live(item)), "mappath"))) {
			continue;
		}
		S = (yield* g.new_(f, live(shelter_type), []));
		rt.setAt(rt.sv(f, "shelter_templates"), rt.fv(f, "shelter_id", live(S)), live(S));
		rt.setAt(rt.sv(f, "map_templates"), rt.fv(f, "shelter_id", live(S)), live(S));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
