// Based on /tg/station's code/controllers/subsystem/minimap.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(29, "/datum/controller/subsystem/minimap", "/datum/controller/subsystem", {
	MINIMAP_SIZE: 2048,
	TILE_SIZE: 8,
	z_levels: null,
	name: "Minimap",
	init_order: -2,
	flags: 2,
}, { const: ["MINIMAP_SIZE","TILE_SIZE"] });

// minimap.dm:1
rt.def("/datum/controller/subsystem/minimap/proc/New", function* New(f: Frame) {
	if (GLOB.SSminimap != this) {
		if (rt.istype(GLOB.SSminimap, T("/datum/controller/subsystem/minimap"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSminimap);
		}
		GLOB.SSminimap = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// minimap.dm:8
rt.def("/datum/controller/subsystem/minimap/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.z_levels = list(2);
	return f.dot;
});

// minimap.dm:11
rt.def("/datum/controller/subsystem/minimap/proc/Initialize", function Initialize(f: Frame, timeofday: Value) {
	let z: Value = null, fileloc: Value = null, z_2: Value = null;
	let hash: Value = md5(GLOB.SSmapping.config.GetFullMapPath());
	if (GLOB.config.generate_minimaps) {
		if (hash == trim(file2text(this.hash_path()))) {
			for (z of each(this.z_levels)) {
				register_asset(`minimap_${z}.png`, fcopy_rsc(this.map_path(z)));
			}
			return parent_proc();
		}
		z = null;
		for (z of each(this.z_levels)) {
			this.generate(z);
			register_asset(`minimap_${z}.png`, fcopy_rsc(this.map_path(z)));
		}
		fdel(this.hash_path());
		text2file(hash, this.hash_path());
	} else {
		to_chat(rt.world(), "<span class='boldannounce'>Minimap generation disabled. Loading from cache...</span>");
		fileloc = 0;
		if (this.check_files(0)) {
			if (hash != trim(file2text(this.hash_path()))) {
				to_chat(rt.world(), "<span class='boldannounce'>Loaded cached minimap is outdated. There may be minor discrepancies in layout.</span>");
			}
			fileloc = 0;
		} else {
			if (!this.check_files(1)) {
				to_chat(rt.world(), "<span class='boldannounce'>Failed to load backup minimap file. Aborting.</span>");
				return f.dot;
			}
			fileloc = 1;
			to_chat(rt.world(), "<span class='boldannounce'>No cached minimaps detected. Backup files loaded.</span>");
		}
		for (z_2 of each(this.z_levels)) {
			register_asset(`minimap_${z_2}.png`, fcopy_rsc(this.map_path(z_2, fileloc)));
		}
	}
	parent_proc();
	return f.dot;
}, false);

// minimap.dm:40
rt.def("/datum/controller/subsystem/minimap/proc/check_files", function check_files(f: Frame, backup: Value) {
	let z: Value = null;
	for (z of each(this.z_levels)) {
		if (!fexists(file(this.map_path(z, backup)))) {
			if (backup) {
				log_world(`Failed to find backup file for map ${GLOB.SSmapping.config.map_name} on zlevel ${z}.`);
			}
			return 0;
		}
	}
	return 1;
});

// minimap.dm:50
rt.def("/datum/controller/subsystem/minimap/proc/hash_path", function hash_path(f: Frame, backup: Value) {
	if (backup) {
		return `icons/minimaps/${GLOB.SSmapping.config.map_name}.md5`;
	}
	return `data/minimaps/${GLOB.SSmapping.config.map_name}.md5`;
});

// minimap.dm:56
rt.def("/datum/controller/subsystem/minimap/proc/map_path", function map_path(f: Frame, z: Value, backup: Value) {
	if (backup) {
		return `icons/minimaps/${GLOB.SSmapping.config.map_name}_${z}.png`;
	}
	return `data/minimaps/${GLOB.SSmapping.config.map_name}_${z}.png`;
});

// minimap.dm:61
rt.def("/datum/controller/subsystem/minimap/proc/send", function* send(f: Frame, client: Value) {
	let z: Value = null;
	for (z of each(this.z_levels)) {
		yield* send_asset(client, `minimap_${z}.png`);
	}
	return f.dot;
}, true);

// minimap.dm:66
rt.def("/datum/controller/subsystem/minimap/proc/generate", function generate(f: Frame, z: Value, x1: Value, y1: Value, x2: Value, y2: Value) {
	let minimap: Value = null, _T: Value = null, final: Value = null;
	z ??= 1;
	x1 ??= 1;
	y1 ??= 1;
	x2 ??= rt.world().maxx;
	y2 ??= rt.world().maxy;
	(minimap = new_(T("/icon"), rt.rsc("icons/minimap.dmi"))).Scale(2048, 2048);
	for (_T of each(block(rt.locate(x1, y1, z), rt.locate(x2, y2, z)))) {
		this.generate_tile(_T, minimap);
	}
	(final = new_(T("/icon"))).Insert(minimap, "", 2, 1, 0);
	fcopy(final, this.map_path(z));
	return f.dot;
});

// minimap.dm:84
rt.def("/datum/controller/subsystem/minimap/proc/generate_tile", function generate_tile(f: Frame, tile: Value, minimap: Value) {
	let tile_icon: Value = null, obj: Value = null, obj_icons: Value = null, I: Value = null, obj_icon: Value = null;
	if (rt.istype(tile, T("/turf/open/space"))) {
		if (obj = rt.locateIn(f, T("/obj/structure/lattice/catwalk"), tile)) {
			tile_icon = new_(T("/icon"), rt.rsc("icons/obj/smooth_structures/catwalk.dmi"), "catwalk", 2);
		}
		if (obj = rt.locateIn(f, T("/obj/structure/lattice"), tile)) {
			tile_icon = new_(T("/icon"), rt.rsc("icons/obj/smooth_structures/lattice.dmi"), "lattice", 2);
		}
		if (obj = rt.locateIn(f, T("/obj/structure/grille"), tile)) {
			tile_icon = new_(T("/icon"), rt.rsc("icons/obj/structures.dmi"), "grille", 2);
		}
		if (obj = rt.locateIn(f, T("/obj/structure/transit_tube"), tile)) {
			tile_icon = new_(T("/icon"), rt.rsc("icons/obj/atmospherics/pipes/transit_tube.dmi"), obj.icon_state, obj.dir);
		}
	} else {
		tile_icon = new_(T("/icon"), tile.icon, tile.icon_state, tile.dir);
		obj_icons = list();
		if (obj = rt.locateIn(f, T("/obj/structure"), tile)) {
			obj_icons += new_(T("/icon"), obj.icon, obj.icon_state, obj.dir, 1, 0);
		}
		if (obj = rt.locateIn(f, T("/obj/machinery"), tile)) {
			obj_icons += new_(T("/icon"), obj.icon, obj.icon_state, obj.dir, 1, 0);
		}
		if (obj = rt.locateIn(f, T("/obj/structure/window"), tile)) {
			obj_icons += new_(T("/icon"), rt.rsc("icons/obj/smooth_structures/window.dmi"), "window", 2);
		}
		if (obj = rt.locateIn(f, T("/obj/structure/table"), tile)) {
			obj_icons += new_(T("/icon"), rt.rsc("icons/obj/smooth_structures/table.dmi"), "table", 2);
		}
		for (I of each(obj_icons)) {
			obj_icon = I;
			tile_icon.Blend(obj_icon, 3);
		}
	}
	if (!tile_icon) return f.dot;
	tile_icon.Scale(8, 8);
	minimap.Blend(tile_icon, 3, (tile.x - 1) * 8, (tile.y - 1) * 8);
	return f.dot;
});
