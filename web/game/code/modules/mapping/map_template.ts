// Based on /tg/station's code/modules/mapping/map_template.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(755, "/datum/map_template", "/datum", {
	name: "Default Template Name",
	width: 0,
	height: 0,
	mappath: null,
	loaded: 0,
}, { global: { maploader: 948 } });

// map_template.dm:11
rt.def("/datum/map_template/proc/New", function* New(f: Frame, path: Value, rename: Value) {
	if (path) {
		this.mappath = path;
	}
	if (this.mappath) {
		yield* this.preload_size(this.mappath);
	}
	if (!rename) return f.dot;
	this.name = rename;
	return f.dot;
}, true);

// map_template.dm:18
rt.def("/datum/map_template/proc/preload_size", function* preload_size(f: Frame, path: Value) {
	let bounds: Value = null;
	if (bounds = (yield* GLOB.maploader.load_map(file(path), 1, 1, 1, { cropMap: 0, measureOnly: 1 }))) {
		this.width = rt.index(bounds, MAP_MAXX);
		this.height = rt.index(bounds, MAP_MAXY);
	}
	return bounds;
}, true);

// map_template.dm:25
rt.def("/datum/map_template/proc/initTemplateBounds", function* initTemplateBounds(f: Frame, bounds: Value) {
	let L: Value = null, B: Value = null, A: Value = null;
	let atmos_machines: Value = list();
	let cables: Value = list();
	let atoms: Value = list();
	for (L of each(block(rt.locate(rt.index(bounds, MAP_MINX), rt.index(bounds, MAP_MINY), rt.index(bounds, MAP_MINZ)), rt.locate(rt.index(bounds, MAP_MAXX), rt.index(bounds, MAP_MAXY), rt.index(bounds, MAP_MAXZ))))) {
		atoms += (B = L);
		A = null;
		for (A of each(B)) {
			atoms += A;
			if (rt.istype(A, T("/obj/structure/cable"))) {
				cables += A;
				continue;
			}
			if (rt.istype(A, T("/obj/machinery/atmospherics"))) {
				atmos_machines += A;
			}
		}
	}
	yield* GLOB.SSatoms.InitializeAtoms(atoms);
	yield* GLOB.SSmachines.setup_template_powernets(cables);
	yield* GLOB.SSair.setup_template_machinery(atmos_machines);
	return f.dot;
}, true);

// map_template.dm:46
rt.def("/datum/map_template/proc/load_new_z", function* load_new_z(f: Frame) {
	let bounds: Value = null;
	let x: Value = round(rt.world().maxx / 2);
	let y: Value = round(rt.world().maxy / 2);
	if (!(bounds = (yield* GLOB.maploader.load_map(file(this.mappath), x, y)))) {
		return 0;
	}
	smooth_zlevel(rt.world().maxz);
	yield* repopulate_sorted_areas();
	yield* this.initTemplateBounds(bounds);
	log_game(`Z-level ${this.name} loaded at at ${x},${y},${rt.world().maxz}`);
	return f.dot;
}, true);

// map_template.dm:62
rt.def("/datum/map_template/proc/load", function* load(f: Frame, _T: Value, centered: Value) {
	let bounds: Value = null;
	centered ??= 0;
	if (centered) {
		_T = rt.locate(_T.x - round(this.width / 2), _T.y - round(this.height / 2), _T.z);
	}
	if (!_T) {
		return f.dot;
	}
	if (_T.x + this.width > rt.world().maxx) {
		return f.dot;
	}
	if (_T.y + this.height > rt.world().maxy) {
		return f.dot;
	}
	if (!(bounds = (yield* GLOB.maploader.load_map(file(this.mappath), _T.x, _T.y, _T.z, { cropMap: 1 })))) {
		return f.dot;
	}
	if (!GLOB.SSmapping.loading_ruins) {
		yield* repopulate_sorted_areas();
	}
	yield* this.initTemplateBounds(bounds);
	log_game(`${this.name} loaded at at ${_T.x},${_T.y},${_T.z}`);
	return 1;
}, true);

// map_template.dm:84
rt.def("/datum/map_template/proc/get_affected_turfs", function get_affected_turfs(f: Frame, _T: Value, centered: Value) {
	let corner: Value = null;
	centered ??= 0;
	let placement: Value = _T;
	if (centered) {
		if (corner = rt.locate(placement.x - round(this.width / 2), placement.y - round(this.height / 2), placement.z)) {
			placement = corner;
		}
	}
	return block(placement, rt.locate(placement.x + this.width - 1, placement.y + this.height - 1, placement.z));
});

// map_template.dm:95
rt.def("/proc/load_new_z_level", function* load_new_z_level(f: Frame, file: Value, name: Value) {
	let template: Value = null;
	yield* (template = (yield* new_(T("/datum/map_template"), file, name))).load_new_z();
	return f.dot;
}, true);
