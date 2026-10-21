// From code/modules/mob/living/simple_animal/bot/floorbot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5037, "/mob/living/simple_animal/bot/floorbot", "/mob/living/simple_animal/bot", {
	process_type: null,
	targetdirection: null,
	replacetiles: 0,
	placetiles: 0,
	specialtiles: 0,
	maxtiles: 100,
	tiletype: null,
	fixfloors: 0,
	autotile: 0,
	max_targets: 50,
	target: null,
	oldloc: null,
	anchored: 0,
	radio_channel: "Engineering",
	bot_type: 4,
	model: "Floorbot",
	window_id: "autofloor",
	window_name: "Automatic Station Floor Repairer v1.1",
	name: "１Floorbot",
	desc: "A little floor repairing robot, he looks so excited!",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "floorbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_eng"),
	bot_core: rt.typePath("/obj/machinery/bot_core/floorbot"),
});

// /mob/living/simple_animal/bot/floorbot/proc/Initialize  (code/modules/mob/living/simple_animal/bot/floorbot.dm:42)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	J = (yield* g.new_(f, T("/datum/job/engineer"), []));
	rt.modField(f, rt.sv(f, "access_card"), "access", (yield* g.callName(f, live(J), "get_access", [])), add);
	rt.setSv(f, "prev_access", rt.fv(f, "access", rt.sv(f, "access_card")));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/floorbot/proc/turn_on  (code/modules/mob/living/simple_animal/bot/floorbot.dm:52)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/turn_on", function turn_on(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/turn_off  (code/modules/mob/living/simple_animal/bot/floorbot.dm:56)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/turn_off", function turn_off(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/bot_reset  (code/modules/mob/living/simple_animal/bot/floorbot.dm:60)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/bot_reset", function bot_reset(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "target", null);
	rt.setSv(f, "oldloc", null);
	rt.setSv(f, "ignore_list", rt.list());
	rt.setSv(f, "anchored", 0);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/set_custom_texts  (code/modules/mob/living/simple_animal/bot/floorbot.dm:68)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	rt.setSv(f, "text_hack", fmt("You corrupt ＀'s construction protocols.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack", fmt("You detect errors in ＀ and reset his programming.", [rt.sv(f, "name")]));
	rt.setSv(f, "text_dehack_fail", fmt("＀ is not responding to reset commands!", [rt.sv(f, "name")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/get_controls  (code/modules/mob/living/simple_animal/bot/floorbot.dm:74)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null, bmode: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, bmode, $0, $1];
	dat = null;
	dat = rt.modify(live(dat), rt.callSrc(f, "hack", [live(user)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "showpai", [live(user)]), add);
	dat = rt.modify(live(dat), "<TT><B>Floor Repairer Controls v1.1</B></TT><BR><BR>", add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat = rt.modify(live(dat), fmt("Status: <A href='?src=＃;power=1'>＀</A><BR>", [$0, $1]), add);
	if (truthy(rt.sv(f, "open"))) {
		$0 = "opened";
	} else {
		$0 = "closed";
	}
	dat = rt.modify(live(dat), fmt("Maintenance panel panel is ＀<BR>", [$0]), add);
	dat = rt.modify(live(dat), "Special tiles: ", add);
	if (truthy(rt.sv(f, "specialtiles"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;operation=eject'>Loaded [＀/＀]</a><BR>", [live(f.src), rt.sv(f, "specialtiles"), rt.sv(f, "maxtiles")]), add);
	} else {
		dat = rt.modify(live(dat), "None Loaded<BR>", add);
	}
	if (truthy(rt.sv(f, "locked"))) {
		$0 = "locked";
	} else {
		$0 = "unlocked";
	}
	dat = rt.modify(live(dat), fmt("Behaviour controls are ＀<BR>", [$0]), add);
	if (((!truthy(rt.sv(f, "locked")) || truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) || truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(user)])))) {
		$0 = live(f.src);
		if (truthy(rt.sv(f, "autotile"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Add tiles to new hull plating: <A href='?src=＃;operation=autotile'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "placetiles"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Place floor tiles: <A href='?src=＃;operation=place'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "replacetiles"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Replace existing floor tiles with custom tiles: <A href='?src=＃;operation=replace'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "fixfloors"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Repair damaged tiles and platings: <A href='?src=＃;operation=fix'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "anchored"))) {
			$1 = "Engaged";
		} else {
			$1 = "Disengaged";
		}
		dat = rt.modify(live(dat), fmt("Traction Magnets: <A href='?src=＃;operation=anchor'>＀</A><BR>", [$0, $1]), add);
		$0 = live(f.src);
		if (truthy(rt.sv(f, "auto_patrol"))) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat = rt.modify(live(dat), fmt("Patrol Station: <A href='?src=＃;operation=patrol'>＀</A><BR>", [$0, $1]), add);
		bmode = null;
		if (truthy(rt.sv(f, "targetdirection"))) {
			bmode = rt.call(f, P("/proc/dir2text"), null, [rt.sv(f, "targetdirection")]);
		} else {
			bmode = "disabled";
		}
		dat = rt.modify(live(dat), fmt("Line Mode : <A href='?src=＃;operation=linemode'>＀</A><BR>", [live(f.src), live(bmode)]), add);
	}
	return live(dat);
});

// /mob/living/simple_animal/bot/floorbot/proc/attackby  (code/modules/mob/living/simple_animal/bot/floorbot.dm:103)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/attackby", function* attackby(f: Frame) {
	let usedtile: Value = null, tiles: Value = null, loaded: Value = null;
	f.vars = () => [usedtile, tiles, loaded];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/plasteel")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The floorbot can produce normal tiles itself.</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "specialtiles")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile")) ? 1 : 0)))) {
		if (!isEqual(rt.gv(f, "type", (usedtile = live(f.args[0]))), rt.sv(f, "tiletype"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Different custom tiles are already inside the floorbot.</span>"]);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile")) ? 1 : 0))) {
		if (rt.ge(rt.sv(f, "specialtiles"), rt.sv(f, "maxtiles"))) {
			return live(f.dot);
		}
		tiles = live(f.args[0]);
		rt.setSv(f, "tiletype", rt.fv(f, "type", live(f.args[0])));
		loaded = (yield* g.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "maxtiles"), rt.sv(f, "specialtiles")), rt.fv(f, "amount", live(tiles))]));
		yield* g.callName(f, live(tiles), "use", [live(loaded)]);
		rt.modSrcVar(f, "specialtiles", live(loaded), add);
		if (rt.gt(live(loaded), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load ＀ tiles into the floorbot. It now contains ＀ tiles.</span>", [live(loaded), rt.sv(f, "specialtiles")])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need at least one floor tile to put into ＀!</span>", [live(f.src)])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /mob/living/simple_animal/bot/floorbot/proc/emag_act  (code/modules/mob/living/simple_animal/bot/floorbot.dm:127)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/emag_act", function* emag_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.sv(f, "emagged"), 2)) return f.dot;
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>＀ buzzes and beeps.</span>", [live(f.src)])]);
	return f.dot;
}, true, { args: ["user"] });

// /mob/living/simple_animal/bot/floorbot/proc/Topic  (code/modules/mob/living/simple_animal/bot/floorbot.dm:133)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/Topic", function* Topic(f: Frame) {
	let setdir: Value = null;
	let $0: any;
	f.vars = () => [setdir, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	$0 = rt.at(live(f.args[1]), "operation");
	if ($0 === "replace") {
		rt.setSv(f, "replacetiles", (!truthy(rt.sv(f, "replacetiles")) ? 1 : 0));
	} else if ($0 === "place") {
		rt.setSv(f, "placetiles", (!truthy(rt.sv(f, "placetiles")) ? 1 : 0));
	} else if ($0 === "fix") {
		rt.setSv(f, "fixfloors", (!truthy(rt.sv(f, "fixfloors")) ? 1 : 0));
	} else if ($0 === "autotile") {
		rt.setSv(f, "autotile", (!truthy(rt.sv(f, "autotile")) ? 1 : 0));
	} else if ($0 === "anchor") {
		rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
	} else if ($0 === "eject") {
		if ((truthy(rt.sv(f, "specialtiles")) && rt.sv(f, "tiletype") !== null)) {
			yield* g.srcCall(f, "empty_tiles");
		}
	} else if ($0 === "linemode") {
		$0 = (setdir = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select construction direction:", rt.list("north", "east", "south", "west", "disable")])));
		if ($0 === "north") {
			rt.setSv(f, "targetdirection", 1);
		} else if ($0 === "south") {
			rt.setSv(f, "targetdirection", 2);
		} else if ($0 === "east") {
			rt.setSv(f, "targetdirection", 4);
		} else if ($0 === "west") {
			rt.setSv(f, "targetdirection", 8);
		} else if ($0 === "disable") {
			rt.setSv(f, "targetdirection", null);
		}
	}
	yield* g.srcCall(f, "update_controls");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /mob/living/simple_animal/bot/floorbot/proc/empty_tiles  (code/modules/mob/living/simple_animal/bot/floorbot.dm:167)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/empty_tiles", function* empty_tiles(f: Frame) {
	let Tsec: Value = null;
	f.vars = () => [Tsec];
	Tsec = rt.getStep(f, live(f.src), 0);
	while (rt.gt(rt.sv(f, "specialtiles"), rt.initial(f, rt.sv(f, "tiletype"), "max_amount"))) {
		yield* g.new_(f, rt.sv(f, "tiletype"), [live(Tsec), rt.initial(f, rt.sv(f, "tiletype"), "max_amount")]);
		(rt.modSrcVar(f, "specialtiles", rt.initial(f, rt.sv(f, "tiletype"), "max_amount"), subtract));
	}
	yield* g.new_(f, rt.sv(f, "tiletype"), [live(Tsec), rt.sv(f, "specialtiles")]);
	rt.setSv(f, "specialtiles", 0);
	rt.setSv(f, "tiletype", null);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/floorbot/proc/handle_automated_action  (code/modules/mob/living/simple_animal/bot/floorbot.dm:177)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let _T: Value = null, TL: Value = null, F: Value = null;
	f.vars = () => [_T, TL, F];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 8)) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.srcCall(f, "audible_message", fmt("＀ makes an excited booping beeping sound!", [live(f.src)]));
	}
	if ((!truthy(rt.sv(f, "target")) && rt.lt(rt.sv(f, "emagged"), 2))) {
		if (rt.sv(f, "targetdirection") !== null) {
			if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), rt.sv(f, "targetdirection"))), T("/turf/open/space")) ? 1 : 0))) {
				rt.setSv(f, "target", live(_T));
				rt.setSv(f, "process_type", 2);
			}
			if (truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
				rt.setSv(f, "target", live(_T));
			}
		}
		if (!truthy(rt.sv(f, "target"))) {
			rt.setSv(f, "process_type", 1);
			rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/turf/open/space"))));
		}
		if ((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "placetiles")))) {
			rt.setSv(f, "process_type", 5);
			rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/turf/open/floor"))));
		}
		if ((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "fixfloors")))) {
			rt.setSv(f, "process_type", 3);
			rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/turf/open/floor"))));
		}
		if (((!truthy(rt.sv(f, "target")) && truthy(rt.sv(f, "replacetiles"))) && rt.gt(rt.sv(f, "specialtiles"), 0))) {
			rt.setSv(f, "process_type", 6);
			rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/turf/open/floor"))));
		}
	}
	if ((!truthy(rt.sv(f, "target")) && isEqual(rt.sv(f, "emagged"), 2))) {
		rt.setSv(f, "process_type", 7);
		rt.setSv(f, "target", (yield* g.srcCall(f, "scan", T("/turf/open/floor"))));
	}
	if (!truthy(rt.sv(f, "target"))) {
		if (truthy(rt.sv(f, "auto_patrol"))) {
			if ((isEqual(rt.sv(f, "mode"), 0) || isEqual(rt.sv(f, "mode"), 4))) {
				yield* g.srcCall(f, "start_patrol");
			}
			if (isEqual(rt.sv(f, "mode"), 5)) {
				yield* g.srcCall(f, "bot_patrol");
			}
		}
	}
	if (truthy(rt.sv(f, "target"))) {
		if (isEqual(rt.len(f, rt.sv(f, "path")), 0)) {
			if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "target")])))) {
				TL = rt.getStep(f, rt.sv(f, "target"), 0);
				rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, live(TL), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 30, "id", rt.sv(f, "access_card"), "simulated_only", 0], rt.Args.Named)));
			} else {
				rt.setSv(f, "path", (yield* g.call(f, P("/proc/get_path_to"), null, [null, live(f.src), null, rt.sv(f, "target"), null, P("/turf/proc/Distance_cardinal"), null, 0, null, 30, "id", rt.sv(f, "access_card"), "simulated_only", 0], rt.Args.Named)));
			}
			if (!truthy((yield* g.srcCall(f, "bot_move", rt.sv(f, "target"))))) {
				yield* g.srcCall(f, "add_to_ignore", rt.sv(f, "target"));
				rt.setSv(f, "target", null);
				rt.setSv(f, "mode", 0);
				return live(f.dot);
			}
		} else {
			if (!truthy((yield* g.srcCall(f, "bot_move", rt.sv(f, "target"))))) {
				rt.setSv(f, "target", null);
				rt.setSv(f, "mode", 0);
				return live(f.dot);
			}
		}
		if ((isEqual(rt.sv(f, "loc"), rt.sv(f, "target")) || isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", rt.sv(f, "target"))))) {
			if (truthy((yield* g.srcCall(f, "check_bot", rt.sv(f, "target"))))) {
				rt.setSv(f, "shuffle", 1);
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					rt.setSv(f, "target", null);
					rt.setSv(f, "path", rt.list());
					return live(f.dot);
				}
			}
			if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "target")]))) && rt.lt(rt.sv(f, "emagged"), 2))) {
				yield* g.srcCall(f, "repair", rt.sv(f, "target"));
			} else {
				if ((isEqual(rt.sv(f, "emagged"), 2) && truthy((rt.istype(rt.sv(f, "target"), T("/turf/open/floor")) ? 1 : 0)))) {
					F = rt.sv(f, "target");
					rt.setSv(f, "anchored", 1);
					rt.setSv(f, "mode", 8);
					yield* g.callName(f, live(F), "ReplaceWithLattice", []);
					yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ makes an excited booping sound.</span>", [live(f.src)]));
					rt.spawnTail(f, 5, "/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/floorbot.dm:259", _T, TL, F);
				}
			}
			rt.setSv(f, "path", rt.list());
			return live(f.dot);
		}
	}
	rt.setSv(f, "oldloc", rt.sv(f, "loc"));
	return f.dot;
}, true, { waitfor: false });

// a spawn(5) body of /mob/living/simple_animal/bot/floorbot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/floorbot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/floorbot.dm:259", function* (f: Frame, _T: Value, TL: Value, F: Value) {
	f.vars = () => [_T, TL, F];
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "mode", 0);
	rt.setSv(f, "target", null);
	return null;
});

// /mob/living/simple_animal/bot/floorbot/proc/is_hull_breach  (code/modules/mob/living/simple_animal/bot/floorbot.dm:269)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/is_hull_breach", function is_hull_breach(f: Frame, t: Value) {
	let t_area: Value = null;
	f.vars = () => [t_area];
	if ((truthy((t_area = rt.call(f, P("/proc/get_area"), null, [live(t)]))) && (isEqual(rt.fv(f, "name", live(t_area)), "Space") || truthy(rt.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", live(t_area)), "huttle"]))))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/process_scan  (code/modules/mob/living/simple_animal/bot/floorbot.dm:279)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/process_scan", function process_scan(f: Frame, scan_target: Value) {
	let result: Value = null, F: Value = null;
	let $0: any;
	f.vars = () => [result, F, $0];
	result = null;
	F = null;
	$0 = rt.sv(f, "process_type");
	if ($0 === 1) {
		if (truthy(rt.callSrc(f, "is_hull_breach", [live(scan_target)]))) {
			result = live(scan_target);
			rt.setSv(f, "anchored", 1);
		}
	} else if ($0 === 2) {
		if (isEqual(rt.getDir(f, live(f.src), live(scan_target)), rt.sv(f, "targetdirection"))) {
			result = live(scan_target);
			rt.setSv(f, "anchored", 1);
		}
	} else if ($0 === 5) {
		if (truthy((rt.istype((F = live(scan_target)), T("/turf/open/floor/plating")) ? 1 : 0))) {
			result = live(F);
		}
	} else if ($0 === 6) {
		if ((truthy((rt.istype((F = live(scan_target)), T("/turf/open/floor")) ? 1 : 0)) && !truthy((rt.istype(live(F), T("/turf/open/floor/plating")) ? 1 : 0)))) {
			result = live(F);
		}
	} else if ($0 === 3) {
		if ((truthy((rt.istype((F = live(scan_target)), T("/turf/open/floor")) ? 1 : 0)) && (truthy(rt.fv(f, "broken", live(F))) || truthy(rt.fv(f, "burnt", live(F)))))) {
			result = live(F);
		}
	} else if ($0 === 7) {
		if (!truthy((rt.istype((F = live(scan_target)), T("/turf/open/floor/plating")) ? 1 : 0))) {
			result = live(F);
		}
	} else {
		result = live(scan_target);
	}
	return live(result);
});

// /mob/living/simple_animal/bot/floorbot/proc/repair  (code/modules/mob/living/simple_animal/bot/floorbot.dm:310)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/repair", function* repair(f: Frame, target_turf: Value) {
	let F: Value = null;
	let $0: any;
	f.vars = () => [target_turf, F, $0];
	if (truthy((rt.istype(live(target_turf), T("/turf/open/space")) ? 1 : 0))) {
		if ((!truthy((yield* g.srcCall(f, "is_hull_breach", live(target_turf)))) && !truthy(rt.sv(f, "targetdirection")))) {
			rt.setSv(f, "target", null);
			return live(f.dot);
		}
	} else {
		if (!truthy((rt.istype(live(target_turf), T("/turf/open/floor")) ? 1 : 0))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(target_turf), T("/turf/open/space")) ? 1 : 0))) {
		rt.setSv(f, "anchored", 1);
		rt.setSv(f, "icon_state", "floorbot-c");
		if (truthy(rt.sv(f, "targetdirection"))) {
			$0 = fmt("＀ begins installing a bridge plating.", [live(f.src)]);
		} else {
			$0 = fmt("＀ begins to repair the hole.", [live(f.src)]);
		}
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ </span>", [$0]));
		rt.setSv(f, "mode", 8);
		yield* g.call(f, P("/proc/sleep"), null, [50]);
		if ((isEqual(rt.sv(f, "mode"), 8) && isEqual(rt.fv(f, "loc", live(f.src)), live(target_turf)))) {
			if (truthy(rt.sv(f, "autotile"))) {
				yield* g.callName(f, live(target_turf), "ChangeTurf", [T("/turf/open/floor/plasteel")]);
			} else {
				yield* g.callName(f, live(target_turf), "ChangeTurf", [T("/turf/open/floor/plating")]);
			}
		}
	} else {
		if (((!isEqual(rt.gv(f, "type", (F = live(target_turf))), rt.initial(f, rt.sv(f, "tiletype"), "turf_type")) && ((truthy(rt.fv(f, "broken", live(F))) || truthy(rt.fv(f, "burnt", live(F)))) || truthy((rt.istype(live(F), T("/turf/open/floor/plating")) ? 1 : 0)))) || isEqual(rt.fv(f, "type", live(F)), (rt.initial(f, rt.sv(f, "tiletype"), "turf_type") && (rt.fv(f, "broken", live(F)) || rt.fv(f, "burnt", live(F))))))) {
			rt.setSv(f, "anchored", 1);
			rt.setSv(f, "icon_state", "floorbot-c");
			rt.setSv(f, "mode", 8);
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ begins repairing the floor.</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/sleep"), null, [50]);
			if (((isEqual(rt.sv(f, "mode"), 8) && truthy(live(F))) && isEqual(rt.fv(f, "loc", live(f.src)), live(F)))) {
				rt.setFv(f, "broken", live(F), 0);
				rt.setFv(f, "burnt", live(F), 0);
				yield* g.callName(f, live(F), "ChangeTurf", [T("/turf/open/floor/plasteel")]);
			}
		}
		if ((((truthy(rt.sv(f, "replacetiles")) && !isEqual(rt.fv(f, "type", live(F)), rt.initial(f, rt.sv(f, "tiletype"), "turf_type"))) && truthy(rt.sv(f, "specialtiles"))) && !truthy((rt.istype(live(F), T("/turf/open/floor/plating")) ? 1 : 0)))) {
			rt.setSv(f, "anchored", 1);
			rt.setSv(f, "icon_state", "floorbot-c");
			rt.setSv(f, "mode", 8);
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ begins replacing the floor tiles.</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/sleep"), null, [50]);
			if (((isEqual(rt.sv(f, "mode"), 8) && truthy(live(F))) && isEqual(rt.fv(f, "loc", live(f.src)), live(F)))) {
				rt.setFv(f, "broken", live(F), 0);
				rt.setFv(f, "burnt", live(F), 0);
				yield* g.callName(f, live(F), "ChangeTurf", [rt.initial(f, rt.sv(f, "tiletype"), "turf_type")]);
				(rt.modSrcVar(f, "specialtiles", 1, subtract));
				if (isEqual(rt.sv(f, "specialtiles"), 0)) {
					yield* g.srcCall(f, "speak", "Requesting refill of custom floortiles to continue replacing.");
				}
			}
		}
	}
	rt.setSv(f, "mode", 0);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "anchored", 0);
	rt.setSv(f, "target", null);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/floorbot/proc/update_icon  (code/modules/mob/living/simple_animal/bot/floorbot.dm:362)
rt.def("/mob/living/simple_animal/bot/floorbot/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("floorbot＀", [rt.sv(f, "on")]));
	return f.dot;
});

// /mob/living/simple_animal/bot/floorbot/proc/explode  (code/modules/mob/living/simple_animal/bot/floorbot.dm:367)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null, N: Value = null, _T: Value = null;
	f.vars = () => [Tsec, N, _T];
	rt.setSv(f, "on", 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ blows apart!</span>", [live(f.src)]));
	Tsec = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "contents", (N = (yield* g.new_(f, T("/obj/item/weapon/storage/toolbox/mechanical"), [live(Tsec)]))), rt.list());
	yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [live(Tsec)]);
	if ((truthy(rt.sv(f, "specialtiles")) && rt.sv(f, "tiletype") !== null)) {
		yield* g.srcCall(f, "empty_tiles");
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(Tsec)]);
	}
	rt.setFv(f, "amount", (_T = (yield* g.new_(f, T("/obj/item/stack/tile/plasteel"), [live(Tsec)]))), 1);
	yield* g.call(f, P("/proc/do_sparks"), null, [3, 1, live(f.src)]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/floorbot/proc/UnarmedAttack  (code/modules/mob/living/simple_animal/bot/floorbot.dm:391)  may sleep
rt.def("/mob/living/simple_animal/bot/floorbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.args[0])])))) {
		yield* g.srcCall(f, "repair", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A"] });
