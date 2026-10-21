// From code/controllers/subsystem/minimap.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(29, "/datum/controller/subsystem/minimap", "/datum/controller/subsystem", {
	MINIMAP_SIZE: 2048,
	TILE_SIZE: 8,
	z_levels: null,
	name: "Minimap",
	init_order: -2,
	flags: 2,
}, { const: ["MINIMAP_SIZE","TILE_SIZE"] });

// /datum/controller/subsystem/minimap/proc/New  (code/controllers/subsystem/minimap.dm:1)  may sleep
rt.def("/datum/controller/subsystem/minimap/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSminimap"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSminimap"), T("/datum/controller/subsystem/minimap")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSminimap")]);
		}
		rt.setGl("SSminimap", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/minimap/proc/<init>  (code/controllers/subsystem/minimap.dm:8)
rt.def("/datum/controller/subsystem/minimap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "z_levels", rt.list(2));
	return f.dot;
});

// /datum/controller/subsystem/minimap/proc/Initialize  (code/controllers/subsystem/minimap.dm:11)
rt.def("/datum/controller/subsystem/minimap/proc/Initialize", function Initialize(f: Frame) {
	let hash: Value = null, z: Value = null, fileloc: Value = null, z_2: Value = null;
	let $e: any;
	f.vars = () => [hash, z, fileloc, z_2, $e];
	hash = rt.call(f, P("/proc/md5"), null, [rt.callName(f, rt.fv(f, "config", rt.gl("SSmapping")), "GetFullMapPath", [])]);
	if (truthy(rt.fv(f, "generate_minimaps", rt.gl("config")))) {
		if (isEqual(live(hash), rt.call(f, P("/proc/trim"), null, [rt.call(f, P("/proc/file2text"), null, [rt.callSrc(f, "hash_path", [])])]))) {
			z = null;
			rt.forList(f, 0, rt.sv(f, "z_levels"));
			while (($e = rt.next(f, 0)) !== undefined) {
				z = $e;
				rt.call(f, P("/proc/register_asset"), null, [fmt("minimap_＀.png", [live(z)]), rt.call(f, P("/proc/fcopy_rsc"), null, [rt.callSrc(f, "map_path", [live(z)])])]);
			}
			rt.endFor(f, 0);
			return rt.callSuper(f, [], rt.Args.Same);
		}
		z = null;
		rt.forList(f, 0, rt.sv(f, "z_levels"));
		while (($e = rt.next(f, 0)) !== undefined) {
			z = $e;
			rt.callSrc(f, "generate", [live(z)]);
			rt.call(f, P("/proc/register_asset"), null, [fmt("minimap_＀.png", [live(z)]), rt.call(f, P("/proc/fcopy_rsc"), null, [rt.callSrc(f, "map_path", [live(z)])])]);
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/fdel"), null, [rt.callSrc(f, "hash_path", [])]);
		rt.call(f, P("/proc/text2file"), null, [live(hash), rt.callSrc(f, "hash_path", [])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Minimap generation disabled. Loading from cache...</span>"]);
		fileloc = 0;
		if (truthy(rt.callSrc(f, "check_files", [0]))) {
			if (!isEqual(live(hash), rt.call(f, P("/proc/trim"), null, [rt.call(f, P("/proc/file2text"), null, [rt.callSrc(f, "hash_path", [])])]))) {
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Loaded cached minimap is outdated. There may be minor discrepancies in layout.</span>"]);
			}
			fileloc = 0;
		} else {
			if (!truthy(rt.callSrc(f, "check_files", [1]))) {
				rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>Failed to load backup minimap file. Aborting.</span>"]);
				return live(f.dot);
			}
			fileloc = 1;
			rt.call(f, P("/proc/to_chat"), null, [rt.world(), "<span class='boldannounce'>No cached minimaps detected. Backup files loaded.</span>"]);
		}
		z_2 = null;
		rt.forList(f, 0, rt.sv(f, "z_levels"));
		while (($e = rt.next(f, 0)) !== undefined) {
			z_2 = $e;
			rt.call(f, P("/proc/register_asset"), null, [fmt("minimap_＀.png", [live(z_2)]), rt.call(f, P("/proc/fcopy_rsc"), null, [rt.callSrc(f, "map_path", [live(z_2), live(fileloc)])])]);
		}
		rt.endFor(f, 0);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["timeofday"] });

// /datum/controller/subsystem/minimap/proc/check_files  (code/controllers/subsystem/minimap.dm:40)
rt.def("/datum/controller/subsystem/minimap/proc/check_files", function check_files(f: Frame, backup: Value) {
	let z: Value = null;
	let $e: any;
	f.vars = () => [z, $e];
	z = null;
	rt.forList(f, 0, rt.sv(f, "z_levels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		z = $e;
		if (!truthy(rt.call(f, P("/proc/fexists"), null, [rt.call(f, P("/proc/file"), null, [rt.callSrc(f, "map_path", [live(z), live(backup)])])]))) {
			if (truthy(live(backup))) {
				rt.call(f, P("/proc/log_world"), null, [fmt("Failed to find backup file for map ＀ on zlevel ＀.", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), live(z)])]);
			}
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/controller/subsystem/minimap/proc/hash_path  (code/controllers/subsystem/minimap.dm:50)
rt.def("/datum/controller/subsystem/minimap/proc/hash_path", function hash_path(f: Frame, backup: Value) {
	if (truthy(live(backup))) {
		return fmt("icons/minimaps/＀.md5", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))]);
	}
	return fmt("data/minimaps/＀.md5", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping")))]);
});

// /datum/controller/subsystem/minimap/proc/map_path  (code/controllers/subsystem/minimap.dm:56)
rt.def("/datum/controller/subsystem/minimap/proc/map_path", function map_path(f: Frame, z: Value, backup: Value) {
	if (truthy(live(backup))) {
		return fmt("icons/minimaps/＀_＀.png", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), live(z)]);
	}
	return fmt("data/minimaps/＀_＀.png", [rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), live(z)]);
});

// /datum/controller/subsystem/minimap/proc/send  (code/controllers/subsystem/minimap.dm:61)  may sleep
rt.def("/datum/controller/subsystem/minimap/proc/send", function* send(f: Frame, client: Value) {
	let z: Value = null;
	let $e: any;
	f.vars = () => [client, z, $e];
	z = null;
	rt.forList(f, 0, rt.sv(f, "z_levels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		z = $e;
		yield* g.call(f, P("/proc/send_asset"), null, [live(client), fmt("minimap_＀.png", [live(z)])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/minimap/proc/generate  (code/controllers/subsystem/minimap.dm:66)
rt.def("/datum/controller/subsystem/minimap/proc/generate", function generate(f: Frame, z: Value, x1: Value, y1: Value, x2: Value, y2: Value) {
	let minimap: Value = null, _T: Value = null, final: Value = null;
	let $e: any;
	f.vars = () => [z, x1, y1, x2, y2, minimap, _T, final, $e];
	if (live(z) === null) {
		z = 1;
	}
	if (live(x1) === null) {
		x1 = 1;
	}
	if (live(y1) === null) {
		y1 = 1;
	}
	if (live(x2) === null) {
		x2 = rt.fv(f, "maxx", rt.world());
	}
	if (live(y2) === null) {
		y2 = rt.fv(f, "maxy", rt.world());
	}
	rt.callName(f, (minimap = rt.new_(f, T("/icon"), [rt.rsc("icons/minimap.dmi")])), "Scale", [2048, 2048]);
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(live(x1), live(y1), live(z)), rt.locate(live(x2), live(y2), live(z))]));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.callSrc(f, "generate_tile", [live(_T), live(minimap)]);
	}
	rt.endFor(f, 0);
	rt.callName(f, (final = rt.new_(f, T("/icon"), [])), "Insert", [live(minimap), "", 2, 1, 0]);
	rt.call(f, P("/proc/fcopy"), null, [live(final), rt.callSrc(f, "map_path", [live(z)])]);
	return f.dot;
});

// /datum/controller/subsystem/minimap/proc/generate_tile  (code/controllers/subsystem/minimap.dm:84)
rt.def("/datum/controller/subsystem/minimap/proc/generate_tile", function generate_tile(f: Frame, tile: Value, minimap: Value) {
	let tile_icon: Value = null, obj: Value = null, obj_icons: Value = null, I: Value = null, obj_icon: Value = null;
	let $e: any;
	f.vars = () => [tile_icon, obj, obj_icons, I, obj_icon, $e];
	tile_icon = null;
	obj = null;
	obj_icons = null;
	if (truthy((rt.istype(live(tile), T("/turf/open/space")) ? 1 : 0))) {
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/lattice/catwalk"), live(tile))))) {
			tile_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/obj/smooth_structures/catwalk.dmi"), "catwalk", 2]);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/lattice"), live(tile))))) {
			tile_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/obj/smooth_structures/lattice.dmi"), "lattice", 2]);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/grille"), live(tile))))) {
			tile_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/obj/structures.dmi"), "grille", 2]);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/transit_tube"), live(tile))))) {
			tile_icon = rt.new_(f, T("/icon"), [rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"), rt.fv(f, "icon_state", live(obj)), rt.fv(f, "dir", live(obj))]);
		}
	} else {
		tile_icon = rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(tile)), rt.fv(f, "icon_state", live(tile)), rt.fv(f, "dir", live(tile))]);
		obj_icons = rt.list();
		if (truthy((obj = rt.locateIn(f, T("/obj/structure"), live(tile))))) {
			obj_icons = rt.modify(live(obj_icons), rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(obj)), rt.fv(f, "icon_state", live(obj)), rt.fv(f, "dir", live(obj)), 1, 0]), add);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/machinery"), live(tile))))) {
			obj_icons = rt.modify(live(obj_icons), rt.new_(f, T("/icon"), [rt.fv(f, "icon", live(obj)), rt.fv(f, "icon_state", live(obj)), rt.fv(f, "dir", live(obj)), 1, 0]), add);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/window"), live(tile))))) {
			obj_icons = rt.modify(live(obj_icons), rt.new_(f, T("/icon"), [rt.rsc("icons/obj/smooth_structures/window.dmi"), "window", 2]), add);
		}
		if (truthy((obj = rt.locateIn(f, T("/obj/structure/table"), live(tile))))) {
			obj_icons = rt.modify(live(obj_icons), rt.new_(f, T("/icon"), [rt.rsc("icons/obj/smooth_structures/table.dmi"), "table", 2]), add);
		}
		I = null;
		rt.forList(f, 0, live(obj_icons));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			obj_icon = live(I);
			rt.callName(f, live(tile_icon), "Blend", [live(obj_icon), 3]);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(live(tile_icon))) return f.dot;
	rt.callName(f, live(tile_icon), "Scale", [8, 8]);
	rt.callName(f, live(minimap), "Blend", [live(tile_icon), 3, multiply(subtract(rt.fv(f, "x", live(tile)), 1), 8), multiply(subtract(rt.fv(f, "y", live(tile)), 1), 8)]);
	return f.dot;
});
