// Based on /tg/station's code/modules/mapping/reader.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// reader.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaluse_preloader", function InitGlobaluse_preloader(f: Frame) {
	GLOB.use_preloader = 0;
	this.gvars_datum_init_order += "use_preloader";
	return f.dot;
});

// reader.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobal_preloader", function InitGlobal_preloader(f: Frame) {
	GLOB._preloader = new_(T("/dmm_suite/preloader"));
	this.gvars_datum_init_order += "_preloader";
	return f.dot;
});

rt.type(13800, "/dmm_suite", "/datum", {}, { global: { modelCache: 877, space_key: 878, dmmRegex: 1056, trimQuotesRegex: 1057, trimRegex: 1058 } });

// Empty in tg.
rt.def("/dmm_suite/verb/load_map", undefined, false, { args: ["dmm_file", "x_offset", "y_offset", "z_offset", "cropMap", "measureOnly", "no_changeturf"], argTypes: [{ type: 512 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }] });

// reader.dm:34
rt.def("/dmm_suite/load_map", function* load_map(f: Frame, dmm_file: Value, x_offset: Value, y_offset: Value, z_offset: Value, cropMap: Value, measureOnly: Value, no_changeturf: Value) {
	yield* GLOB.Master.StartLoadingMap();
	GLOB.space_key = null;
	f.dot = (yield* this.load_map_impl(dmm_file, x_offset, y_offset, z_offset, cropMap, measureOnly, no_changeturf));
	GLOB.Master.StopLoadingMap();
	return f.dot;
}, true, { argTypes: [{ type: 512 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }] });

// reader.dm:47
rt.def("/dmm_suite/proc/load_map_impl", function* load_map_impl(f: Frame, dmm_file: Value, x_offset: Value, y_offset: Value, z_offset: Value, cropMap: Value, measureOnly: Value, no_changeturf: Value) {
	let tfile: Value = null, key: Value = null, xcrdStart: Value = null, xcrd: Value = null, ycrd: Value = null, zcrd: Value = null, zexpansion: Value = null, gridLines: Value = null, leadingBlanks: Value = null, maxx: Value = null, line: Value = null, tpos: Value = null, model_key: Value = null, no_afterchange: Value = null, t: Value = null, _T: Value = null;
	let $e: any;
	if (isfile((tfile = dmm_file))) {
		tfile = file2text(tfile);
	}
	if (!x_offset) {
		x_offset = 1;
	}
	if (!y_offset) {
		y_offset = 1;
	}
	if (!z_offset) {
		z_offset = rt.world().maxz + 1;
	}
	let bounds: Value = list(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity);
	let grid_models: Value = list();
	let key_len: Value = 0;
	let stored_index: Value = 1;
	while (GLOB.dmmRegex.Find(tfile, stored_index)) {
		stored_index = rt.fv(f, "next", GLOB.dmmRegex);
		if (rt.index(GLOB.dmmRegex.group, 1)) {
			key = rt.index(GLOB.dmmRegex.group, 1);
			if (rt.index(grid_models, key)) {
				continue;
			}
			if (key_len != rt.length(key)) {
				if (!key_len) {
					key_len = rt.length(key);
				} else {
					rt.throw_(f, (yield* new_(T("/exception"), "Inconsistant key length in DMM", "code/modules/mapping/reader.dm", 75)));
				}
			}
			if (!measureOnly) {
				rt.setAt(grid_models, key, rt.index(GLOB.dmmRegex.group, 2));
			}
		} else if (rt.index(GLOB.dmmRegex.group, 3)) {
			if (!key_len) {
				rt.throw_(f, (yield* new_(T("/exception"), "Coords before model definition in DMM", "code/modules/mapping/reader.dm", 82)));
			}
			xcrdStart = text2num(rt.index(GLOB.dmmRegex.group, 3)) + x_offset - 1;
			xcrd = null;
			ycrd = text2num(rt.index(GLOB.dmmRegex.group, 4)) + y_offset - 1;
			zcrd = text2num(rt.index(GLOB.dmmRegex.group, 5)) + z_offset - 1;
			if (zexpansion = (zcrd > rt.world().maxz ? 1 : 0)) {
				if (cropMap) {
					continue;
				}
				rt.world().maxz = zcrd;
				if (!no_changeturf) {
					warning(`${"Z-level expansion occurred without no_changeturf set, this may cause problems when /turf/AfterChange is called"} in ${"code/modules/mapping/reader.dm"} at line ${97} src: ${this} usr: ${f.usr}.`);
				}
			}
			rt.setAt(bounds, 1, min(rt.index(bounds, 1), xcrdStart));
			rt.setAt(bounds, MAP_MINZ, min(rt.index(bounds, MAP_MINZ), zcrd));
			rt.setAt(bounds, MAP_MAXZ, max(rt.index(bounds, MAP_MAXZ), zcrd));
			gridLines = splittext(rt.index(GLOB.dmmRegex.group, 6), "\n");
			leadingBlanks = 0;
			while (leadingBlanks < rt.len(f, gridLines) && rt.index(gridLines, ++leadingBlanks) == "") {
			}
			if (leadingBlanks > 1) {
				gridLines.Cut(1, leadingBlanks);
			}
			if (!rt.len(f, gridLines)) {
				continue;
			}
			if (rt.len(f, gridLines) && rt.index(gridLines, rt.len(f, gridLines)) == "") {
				gridLines.Cut(rt.len(f, gridLines));
			}
			rt.setAt(bounds, MAP_MINY, min(rt.index(bounds, MAP_MINY), ycrd));
			ycrd += rt.len(f, gridLines) - 1;
			if (!cropMap && ycrd > rt.world().maxy) {
				if (!measureOnly) {
					rt.world().maxy = ycrd;
				}
				rt.setAt(bounds, MAP_MAXY, max(rt.index(bounds, MAP_MAXY), ycrd));
			} else {
				rt.setAt(bounds, MAP_MAXY, max(rt.index(bounds, MAP_MAXY), min(ycrd, rt.world().maxy)));
			}
			maxx = xcrdStart;
			if (measureOnly) {
				line = null;
				for (line of each(gridLines)) {
					maxx = max(maxx, xcrdStart + rt.length(line) / key_len - 1);
				}
			} else {
				line = null;
				for (line of each(gridLines)) {
					if (ycrd <= rt.world().maxy && ycrd >= 1) {
						xcrd = xcrdStart;
						tpos = null;
						rt.forRange(f, 1, 1, rt.length(line) - key_len + 1, key_len);
						while (($e = rt.next(f, 1)) !== undefined) {
							tpos = $e;
							if (xcrd > rt.world().maxx) {
								if (cropMap) {
									break;
								}
								rt.world().maxx = xcrd;
							}
							if (xcrd >= 1) {
								model_key = copytext(line, tpos, tpos + key_len);
								if (!(no_afterchange = (no_changeturf || zexpansion)) || model_key != GLOB.space_key) {
									if (!rt.index(grid_models, model_key)) {
										rt.throw_(f, (yield* new_(T("/exception"), "Undefined model key in DMM.", "code/modules/mapping/reader.dm", 146)));
									}
									yield* this.parse_grid(rt.index(grid_models, model_key), model_key, xcrd, ycrd, zcrd, (no_changeturf || zexpansion));
								}
								if (rt.tickUsage(f) > GLOB.current_ticklimit) {
									yield* stoplag();
								}
							}
							maxx = max(maxx, xcrd);
							xcrd++;
						}
						rt.endFor(f, 1);
					}
					ycrd--;
				}
			}
			rt.setAt(bounds, MAP_MAXX, max(rt.index(bounds, MAP_MAXX), cropMap ? min(maxx, rt.world().maxx) : maxx));
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	if (rt.index(bounds, 1) == Infinity) {
		return null;
	}
	if (!measureOnly) {
		if (!no_changeturf) {
			for (t of each(block(rt.locate(rt.index(bounds, 1), rt.index(bounds, MAP_MINY), rt.index(bounds, MAP_MINZ)), rt.locate(rt.index(bounds, MAP_MAXX), rt.index(bounds, MAP_MAXY), rt.index(bounds, MAP_MAXZ))))) {
				yield* (_T = t).AfterChange(1);
			}
		}
	}
	return bounds;
}, true);

// reader.dm:197
rt.def("/dmm_suite/proc/parse_grid", function* parse_grid(f: Frame, model: Value, model_key: Value, xcrd: Value, ycrd: Value, zcrd: Value, no_changeturf: Value) {
	let members: Value = null, members_attributes: Value = null, index: Value = null, old_position: Value = null, dpos: Value = null, full_def: Value = null, variables_start: Value = null, atom_def: Value = null, fields: Value = null, I: Value = null, value: Value = null, instance: Value = null, atype: Value = null, A: Value = null, _T: Value = null, underlay: Value = null;
	let $e: any, $t: any;
	let cached: Value = rt.index(GLOB.modelCache, model);
	if (cached) {
		members = rt.index(cached, 1);
		members_attributes = rt.index(cached, 2);
	} else {
		members = list();
		members_attributes = list();
		index = 1;
		old_position = 1;
		while (true) {
			dpos = this.find_next_delimiter_position(model, old_position, ",", "{", "}");
			full_def = this.trim_text(copytext(model, old_position, dpos));
			variables_start = findtext(full_def, "{");
			atom_def = text2path(this.trim_text(copytext(full_def, 1, variables_start)));
			old_position = dpos + 1;
			if (atom_def) {
				members.Add(atom_def);
				fields = list();
				if (variables_start) {
					if (rt.len(f, (fields = this.readlist((full_def = copytext(full_def, variables_start + 1, rt.length(full_def))), ";")))) {
						if (!trim(rt.index(fields, rt.len(f, fields)))) {
							--fields.len;
						}
						I = null;
						for (I of each(fields)) {
							if (istext((value = rt.index(fields, I)))) {
								rt.setAt(fields, I, apply_text_macros(value));
							}
						}
					}
				}
				members_attributes.len++;
				rt.setAt(members_attributes, ($t = index, index = rt.inc($t, 1), $t), fields);
				if (rt.tickUsage(f) > GLOB.current_ticklimit) {
					yield* stoplag();
				}
			}
			if (dpos == 0) break;
		}
		if (no_changeturf && !GLOB.space_key && rt.len(f, members) == 2 && rt.len(f, members_attributes) == 2 && rt.length(rt.index(members_attributes, 1)) == 0 && rt.length(rt.index(members_attributes, 2)) == 0 && rt.isIn(f, rt.world().area, members) && rt.isIn(f, rt.world().turf, members)) {
			GLOB.space_key = model_key;
			return f.dot;
		}
		rt.setAt(GLOB.modelCache, model, list(members, members_attributes));
	}
	let crds: Value = rt.locate(xcrd, ycrd, zcrd);
	index = rt.len(f, members);
	if (rt.index(members, index) != T("/area/template_noop")) {
		yield* GLOB._preloader.setup(rt.index(members_attributes, index));
		atype = rt.index(members, index);
		for (A of each(rt.world(), T("/area"))) {
			if (A.type == atype) {
				instance = A;
				break;
			}
		}
		if (!instance) {
			instance = (yield* new_(atype, null));
		}
		if (crds) {
			instance.contents.Add(crds);
		}
		if (GLOB.use_preloader && instance) {
			yield* GLOB._preloader.load(instance);
		}
	}
	let first_turf_index: Value = 1;
	while (!ispath(rt.index(members, first_turf_index), T("/turf"))) {
		first_turf_index++;
	}
	GLOB.SSatoms.map_loader_begin();
	if (rt.index(members, first_turf_index) != T("/turf/template_noop")) {
		_T = (yield* this.instance_atom(rt.index(members, first_turf_index), rt.index(members_attributes, first_turf_index), crds, no_changeturf));
	}
	if (_T) {
		index = first_turf_index + 1;
		while (index <= rt.len(f, members) - 1) {
			underlay = _T.appearance;
			(_T = (yield* this.instance_atom(rt.index(members, index), rt.index(members_attributes, index), crds, no_changeturf))).underlays += underlay;
			index++;
		}
	}
	rt.forRange(f, 0, 1, first_turf_index - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		index = $e;
		yield* this.instance_atom(rt.index(members, index), rt.index(members_attributes, index), crds, no_changeturf);
	}
	rt.endFor(f, 0);
	GLOB.SSatoms.map_loader_stop();
	return f.dot;
}, true);

// reader.dm:326
rt.def("/dmm_suite/proc/instance_atom", function* instance_atom(f: Frame, path: Value, attributes: Value, crds: Value, no_changeturf: Value) {
	yield* GLOB._preloader.setup(attributes, path);
	if (crds) {
		if (!no_changeturf && ispath(path, T("/turf"))) {
			f.dot = (yield* crds.ChangeTurf(path, 1));
		} else {
			f.dot = (yield* this.create_atom(path, crds));
		}
	}
	if (GLOB.use_preloader && f.dot) {
		yield* GLOB._preloader.load(f.dot);
	}
	if (!(rt.tickUsage(f) > GLOB.current_ticklimit)) return f.dot;
	GLOB.SSatoms.map_loader_stop();
	yield* stoplag();
	GLOB.SSatoms.map_loader_begin();
	return f.dot;
}, true);

// reader.dm:345
rt.def("/dmm_suite/proc/create_atom", function* create_atom(f: Frame, path: Value, crds: Value) {
	f.dot = (yield* new_(path, crds));
	return f.dot;
}, true, { waitfor: false });

// reader.dm:351
rt.def("/dmm_suite/proc/trim_text", function trim_text(f: Frame, what: Value, trim_quotes: Value) {
	trim_quotes ??= 0;
	if (trim_quotes) {
		return GLOB.trimQuotesRegex.Replace(what, "");
	}
	return GLOB.trimRegex.Replace(what, "");
});

// reader.dm:359
rt.def("/dmm_suite/proc/find_next_delimiter_position", function find_next_delimiter_position(f: Frame, text: Value, initial_position: Value, delimiter: Value, opening_escape: Value, closing_escape: Value) {
	delimiter ??= ",";
	opening_escape ??= "\"";
	closing_escape ??= "\"";
	let position: Value = initial_position;
	let next_delimiter: Value = findtext(text, delimiter, position, 0);
	let next_opening: Value = findtext(text, opening_escape, position, 0);
	while (next_opening != 0 && next_opening < next_delimiter) {
		position = findtext(text, closing_escape, next_opening + 1, 0) + 1;
		next_delimiter = findtext(text, delimiter, position, 0);
		next_opening = findtext(text, opening_escape, position, 0);
	}
	return next_delimiter;
});

// reader.dm:375
rt.def("/dmm_suite/proc/readlist", function readlist(f: Frame, text: Value, delimiter: Value) {
	let position: Value = null, equal_position: Value = null, trim_left: Value = null, trim_right: Value = null;
	let $0: any, $1: any, $2: any;
	delimiter ??= ",";
	let to_return: Value = list();
	let old_position: Value = 1;
	while (true) {
		position = this.find_next_delimiter_position(text, old_position, delimiter);
		equal_position = findtext(text, "=", old_position, position);
		$0 = text;
		$1 = old_position;
		if (equal_position) {

			$2 = equal_position;
		} else {
			$2 = position;
		}
		trim_left = this.trim_text(copytext($0, $1, $2), 1);
		old_position = position + 1;
		if (equal_position) {
			if (findtext((trim_right = this.trim_text(copytext(text, equal_position + 1, position))), "\"", 1, 2)) {
				trim_right = copytext(trim_right, 2, findtext(trim_right, "\"", 3, 0));
			} else if (isnum(text2num(trim_right))) {
				trim_right = text2num(trim_right);
			} else if (trim_right == "null") {
				trim_right = null;
			} else if (copytext(trim_right, 1, 5) == "list") {
				trim_right = this.readlist(copytext(trim_right, 6, rt.length(trim_right)));
			} else if (copytext(trim_right, 1, 2) == "'") {
				trim_right = file(copytext(trim_right, 2, rt.length(trim_right)));
			} else if (ispath(text2path(trim_right))) {
				trim_right = text2path(trim_right);
			}
			rt.setAt(to_return, trim_left, trim_right);
		} else {
			rt.setAt(to_return, trim_left, null);
		}
		if (position == 0) break;
	}
	return to_return;
});

// reader.dm:427
rt.def("/dmm_suite/proc/Destroy", function* Destroy(f: Frame) {
	yield* parent_proc();
	return QDEL_HINT_HARDDEL_NOW;
}, true);

rt.type(13801, "/dmm_suite/preloader", "/datum", {
	attributes: null,
	target_path: null,
});

// reader.dm:440
rt.def("/dmm_suite/preloader/proc/setup", function setup(f: Frame, the_attributes: Value, path: Value) {
	if (!rt.len(f, the_attributes)) return f.dot;
	GLOB.use_preloader = 1;
	this.attributes = the_attributes;
	this.target_path = path;
	return f.dot;
});

// reader.dm:446
// tg bug fixed: readlist doesn't know `newlist(...)` (MetaStation's hitman briefcase, `contents = newlist(...)`), so the raw text
// was written to the var. Here the listed types are made inside the object instead, after its other vars are set.
rt.def("/dmm_suite/preloader/proc/load", function* load(f: Frame, what: Value) {
	let attribute: Value = null, value: Value = null, made: Value = null, path: Value = null;
	let $e: any;
	for (attribute of each(this.attributes)) {
		if (rt.istype((value = rt.index(this.attributes, attribute)), T("/list"))) {
			value = rt.call(f, P("/proc/deepCopyList"), null, [value]);
		}
		if (attribute == "contents" && rt.call(f, P("/proc/copytext"), null, [value, 1, 9]) == "newlist(") {
			made = rt.call(f, P("/proc/splittext"), null, [rt.call(f, P("/proc/copytext"), null, [value, 9, rt.length(value)]), ","]);
		} else {
			rt.setAt(what.vars, attribute, value);
		}
	}
	GLOB.use_preloader = 0;
	if (made !== null) {
		rt.forList(f, 0, made);
		while (($e = rt.next(f, 0)) !== undefined) {
			path = rt.call(f, P("/proc/text2path"), null, [$e]);
			if (rt.call(f, P("/proc/ispath"), null, [path])) yield* new_(path, what);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);
