// From code/controllers/subsystem/persistence.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(35, "/datum/controller/subsystem/persistence", "/datum/controller/subsystem", {
	secret_satchels: null,
	satchel_blacklist: null,
	new_secret_satchels: null,
	old_secret_satchels: "",
	chisel_messages: null,
	saved_messages: null,
	trophy_sav: null,
	saved_trophies: null,
	name: "Persistence",
	init_order: -100,
	flags: 2,
});

// /datum/controller/subsystem/persistence/proc/New  (code/controllers/subsystem/persistence.dm:1)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSpersistence"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSpersistence"), T("/datum/controller/subsystem/persistence")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSpersistence")]);
		}
		rt.setGl("SSpersistence", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/<init>  (code/controllers/subsystem/persistence.dm:6)
rt.def("/datum/controller/subsystem/persistence/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "satchel_blacklist", rt.list());
	$0 = $0;
	rt.setSv(f, "new_secret_satchels", rt.list());
	$0 = $0;
	rt.setSv(f, "chisel_messages", rt.list());
	$0 = $0;
	rt.setSv(f, "saved_messages", rt.list());
	$0 = $0;
	rt.setSv(f, "saved_trophies", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/Initialize  (code/controllers/subsystem/persistence.dm:17)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "LoadSatchels");
	yield* g.srcCall(f, "LoadChiselMessages");
	yield* g.srcCall(f, "LoadTrophies");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/LoadSatchels  (code/controllers/subsystem/persistence.dm:24)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/LoadSatchels", function* LoadSatchels(f: Frame) {
	let expanded_old_satchels: Value = null, placed_satchels: Value = null, free_satchels: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [expanded_old_satchels, placed_satchels, free_satchels, _T, $e];
	rt.setSv(f, "secret_satchels", (yield* g.new_(f, T("/savefile"), ["data/npc_saves/SecretSatchels.sav"])));
	rt.setSv(f, "satchel_blacklist", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/item/stack/tile/plasteel"), T("/obj/item/weapon/crowbar"))])));
	rt.setSv(f, "old_secret_satchels", rt.input(f, rt.R.index, null, [rt.sv(f, "secret_satchels"), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))]));
	expanded_old_satchels = rt.list();
	placed_satchels = 0;
	if (rt.sv(f, "old_secret_satchels") !== null) {
		if (truthy((yield* g.srcCall(f, "PlaceSecretSatchel", (expanded_old_satchels = (yield* g.call(f, P("/proc/splittext"), null, [rt.sv(f, "old_secret_satchels"), "#"]))))))) {
			placed_satchels = rt.inc(live(placed_satchels), 1);
		}
	} else {
		rt.setFv(f, "len", live(expanded_old_satchels), 0);
	}
	free_satchels = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [(yield* g.call(f, P("/proc/block"), null, [rt.locate(7, 7, 2), rt.locate(subtract(rt.fv(f, "maxx", rt.world()), 7), subtract(rt.fv(f, "maxy", rt.world()), 7), 2)]))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0)) && !truthy((rt.istype(live(_T), T("/turf/open/floor/plating")) ? 1 : 0)))) {
			if ((!truthy((yield* g.call(f, P("/proc/isemptylist"), null, [(free_satchels = rt.modify(live(free_satchels), (yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/flat/secret"), [live(_T)])), add))]))) && rt.ge(add(rt.len(f, live(free_satchels)), live(placed_satchels)), multiply(subtract(50, rt.len(f, live(expanded_old_satchels))), 0.10000000149011612)))) {
				break;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/PlaceSecretSatchel  (code/controllers/subsystem/persistence.dm:48)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/PlaceSecretSatchel", function* PlaceSecretSatchel(f: Frame, expanded_old_satchels: Value) {
	let satchel_string: Value = null, chosen_satchel: Value = null, path: Value = null, F: Value = null;
	f.vars = () => [expanded_old_satchels, satchel_string, chosen_satchel, path, F];
	satchel_string = null;
	if (rt.ge(rt.len(f, live(expanded_old_satchels)), 20)) {
		satchel_string = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(expanded_old_satchels)]));
	}
	rt.setSv(f, "old_secret_satchels", (yield* g.call(f, P("/proc/jointext"), null, [live(expanded_old_satchels), "#"])));
	rt.op(f, "OutputReference", [rt.R.index], [rt.sv(f, "secret_satchels"), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), rt.sv(f, "old_secret_satchels")], false);
	if (((!truthy((chosen_satchel = (yield* g.call(f, P("/proc/splittext"), null, [live(satchel_string), "|"])))) || truthy((yield* g.call(f, P("/proc/isemptylist"), null, [live(chosen_satchel)])))) || !isEqual(rt.len(f, live(chosen_satchel)), 3))) {
		return 0;
	}
	if (!truthy((path = (yield* g.call(f, P("/proc/text2path"), null, [rt.index(live(chosen_satchel), 3)]))))) {
		return 0;
	}
	rt.setFv(f, "x", (F = (yield* g.new_(f, T("/obj/item/weapon/storage/backpack/satchel/flat"), []))), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(chosen_satchel), 1)])));
	rt.setFv(f, "y", live(F), (yield* g.call(f, P("/proc/text2num"), null, [rt.index(live(chosen_satchel), 2)])));
	rt.setFv(f, "z", live(F), 2);
	if ((truthy((rt.istype(rt.fv(f, "loc", live(F)), T("/turf/open/floor")) ? 1 : 0)) && !truthy((rt.istype(rt.fv(f, "loc", live(F)), T("/turf/open/floor/plating")) ? 1 : 0)))) {
		yield* g.callName(f, live(F), "hide", [1]);
	}
	yield* g.new_(f, live(path), [live(F)]);
	return 1;
}, true);

// /datum/controller/subsystem/persistence/proc/LoadChiselMessages  (code/controllers/subsystem/persistence.dm:77)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/LoadChiselMessages", function* LoadChiselMessages(f: Frame) {
	let chisel_messages_sav: Value = null, saved_json: Value = null, saved_messages: Value = null, item: Value = null, xvar: Value = null, yvar: Value = null, zvar: Value = null, _T: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [chisel_messages_sav, saved_json, saved_messages, item, xvar, yvar, zvar, _T, M, $e];
	chisel_messages_sav = (yield* g.new_(f, T("/savefile"), ["data/npc_saves/ChiselMessages.sav"]));
	saved_json = null;
	saved_json = rt.input(f, rt.R.index, null, [live(chisel_messages_sav), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))]);
	if (!truthy(live(saved_json))) {
		return live(f.dot);
	}
	saved_messages = (yield* g.call(f, P("/proc/json_decode"), null, [live(saved_json)]));
	item = null;
	rt.forList(f, 0, live(saved_messages));
	while (($e = rt.next(f, 0)) !== undefined) {
		item = $e;
		if (!truthy((rt.istype(live(item), T("/list")) ? 1 : 0))) {
			continue;
		}
		xvar = rt.at(live(item), "x");
		yvar = rt.at(live(item), "y");
		zvar = rt.at(live(item), "z");
		if (((!truthy(live(xvar)) || !truthy(live(yvar))) || !truthy(live(zvar)))) {
			continue;
		}
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.locate(live(xvar), live(yvar), live(zvar)))])))) {
			continue;
		}
		if (truthy(rt.locateIn(f, T("/obj/structure/chisel_message"), live(_T)))) {
			continue;
		}
		if (!(!truthy((M = (yield* g.new_(f, T("/obj/structure/chisel_message"), [live(_T)])))) || truthy(rt.fv(f, "gc_destroyed", live(M))))) {
			yield* g.callName(f, live(M), "unpack", [live(item)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/log_world"), null, [fmt("Loaded ＀ engraved messages on map ＀", [rt.len(f, live(saved_messages)), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/LoadTrophies  (code/controllers/subsystem/persistence.dm:112)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/LoadTrophies", function* LoadTrophies(f: Frame) {
	let saved_json: Value = null, decoded_json: Value = null;
	f.vars = () => [saved_json, decoded_json];
	rt.setSv(f, "trophy_sav", (yield* g.new_(f, T("/savefile"), ["data/npc_saves/TrophyItems.sav"])));
	saved_json = null;
	saved_json = rt.input(f, rt.R.srcVar("trophy_sav"), null, []);
	if (!truthy(live(saved_json))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((decoded_json = (yield* g.call(f, P("/proc/json_decode"), null, [live(saved_json)]))), T("/list")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setSv(f, "saved_trophies", live(decoded_json));
	yield* g.srcCall(f, "SetUpTrophies", (yield* g.callName(f, rt.sv(f, "saved_trophies"), "Copy", [])));
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/SetUpTrophies  (code/controllers/subsystem/persistence.dm:129)  may sleep
rt.def("/datum/controller/subsystem/persistence/proc/SetUpTrophies", function* SetUpTrophies(f: Frame, trophy_items: Value) {
	let A: Value = null, _T: Value = null, trophy_data: Value = null, chosen_trophy: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [trophy_items, A, _T, trophy_data, chosen_trophy, path, $e];
	A = null;
	rt.forList(f, 0, rt.gl("trophy_cases"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.setFv(f, "added_roundstart", (_T = live(A)), 1);
		if (!truthy((rt.istype((trophy_data = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(trophy_items)]))), T("/list")) ? 1 : 0))) {
			continue;
		}
		if ((!truthy((chosen_trophy = live(trophy_data))) || truthy((yield* g.call(f, P("/proc/isemptylist"), null, [live(chosen_trophy)]))))) {
			continue;
		}
		if (!truthy((path = (yield* g.call(f, P("/proc/text2path"), null, [rt.at(live(chosen_trophy), "path")]))))) {
			continue;
		}
		rt.setFv(f, "showpiece", live(_T), (yield* g.new_(f, T("/obj/item/showpiece_dummy"), [live(_T), live(path)])));
		rt.setFv(f, "trophy_message", live(_T), rt.at(live(chosen_trophy), "message"));
		rt.setFv(f, "placer_key", live(_T), rt.at(live(chosen_trophy), "placer_key"));
		yield* g.callName(f, live(_T), "update_icon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/persistence/proc/CollectData  (code/controllers/subsystem/persistence.dm:154)
rt.def("/datum/controller/subsystem/persistence/proc/CollectData", function CollectData(f: Frame) {
	rt.callSrc(f, "CollectChiselMessages", []);
	rt.callSrc(f, "CollectSecretSatchels", []);
	rt.callSrc(f, "CollectTrophies", []);
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/CollectSecretSatchels  (code/controllers/subsystem/persistence.dm:159)
rt.def("/datum/controller/subsystem/persistence/proc/CollectSecretSatchels", function CollectSecretSatchels(f: Frame) {
	let A: Value = null, F: Value = null, savable_obj: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [A, F, savable_obj, O, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "new_secret_satchels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((((!truthy((F = live(A))) || truthy(rt.fv(f, "gc_destroyed", live(F)))) || !isEqual(rt.fv(f, "z", live(F)), 2)) || !isEqual(rt.fv(f, "invisibility", live(F)), 100))) {
			continue;
		}
		savable_obj = rt.list();
		O = null;
		rt.forList(f, 1, live(F), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if ((truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.sv(f, "satchel_blacklist")])) || truthy(rt.fv(f, "admin_spawned", live(O))))) {
				continue;
			}
			if (truthy(rt.fv(f, "persistence_replacement", live(O)))) {
				savable_obj = rt.modify(live(savable_obj), rt.fv(f, "persistence_replacement", live(O)), add);
			} else {
				savable_obj = rt.modify(live(savable_obj), rt.fv(f, "type", live(O)), add);
			}
		}
		rt.endFor(f, 1);
		if (truthy(rt.call(f, P("/proc/isemptylist"), null, [live(savable_obj)]))) {
			continue;
		}
		rt.modSrcVar(f, "old_secret_satchels", fmt("＀|＀|＀#", [rt.fv(f, "x", live(F)), rt.fv(f, "y", live(F)), rt.op(f, "PickUnweighted", [1], [live(savable_obj)])]), add);
	}
	rt.endFor(f, 0);
	rt.op(f, "OutputReference", [rt.R.index], [rt.sv(f, "secret_satchels"), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), rt.sv(f, "old_secret_satchels")], false);
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/CollectChiselMessages  (code/controllers/subsystem/persistence.dm:177)
rt.def("/datum/controller/subsystem/persistence/proc/CollectChiselMessages", function CollectChiselMessages(f: Frame) {
	let chisel_messages_sav: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [chisel_messages_sav, M, $e];
	chisel_messages_sav = rt.new_(f, T("/savefile"), ["data/npc_saves/ChiselMessages.sav"]);
	M = null;
	rt.forList(f, 0, rt.sv(f, "chisel_messages"), T("/obj/structure/chisel_message"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modSrcVar(f, "saved_messages", rt.list(rt.callName(f, live(M), "pack", [])), add);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/log_world"), null, [fmt("Saved ＀ engraved messages on map ＀", [rt.len(f, rt.sv(f, "saved_messages")), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))])]);
	rt.op(f, "OutputReference", [rt.R.index], [live(chisel_messages_sav), rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), rt.call(f, P("/proc/json_encode"), null, [rt.sv(f, "saved_messages")])], false);
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/SaveChiselMessage  (code/controllers/subsystem/persistence.dm:187)
rt.def("/datum/controller/subsystem/persistence/proc/SaveChiselMessage", function SaveChiselMessage(f: Frame, M: Value) {
	rt.modSrcVar(f, "saved_messages", rt.list(rt.callName(f, live(M), "pack", [])), add);
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/CollectTrophies  (code/controllers/subsystem/persistence.dm:191)
rt.def("/datum/controller/subsystem/persistence/proc/CollectTrophies", function CollectTrophies(f: Frame) {
	rt.op(f, "OutputReference", [rt.R.srcVar("trophy_sav")], [rt.call(f, P("/proc/json_encode"), null, [rt.sv(f, "saved_trophies")])], false);
	return f.dot;
});

// /datum/controller/subsystem/persistence/proc/SaveTrophy  (code/controllers/subsystem/persistence.dm:194)
rt.def("/datum/controller/subsystem/persistence/proc/SaveTrophy", function SaveTrophy(f: Frame, _T: Value) {
	let data: Value = null;
	f.vars = () => [data];
	if (!(!truthy(rt.fv(f, "added_roundstart", live(_T))) && truthy(rt.fv(f, "showpiece", live(_T))))) return f.dot;
	rt.setAt((data = rt.list()), "path", rt.gv(f, "type", rt.fv(f, "showpiece", live(_T))));
	rt.setAt(live(data), "message", rt.fv(f, "trophy_message", live(_T)));
	rt.setAt(live(data), "placer_key", rt.fv(f, "placer_key", live(_T)));
	rt.modSrcVar(f, "saved_trophies", rt.list(live(data)), add);
	return f.dot;
});
