// From code/modules/mapping/reader.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaluse_preloader  (code/modules/mapping/reader.dm:6)
rt.def("/datum/controller/global_vars/proc/InitGlobaluse_preloader", function InitGlobaluse_preloader(f: Frame) {
	rt.setGl("use_preloader", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "use_preloader", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobal_preloader  (code/modules/mapping/reader.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobal_preloader", function InitGlobal_preloader(f: Frame) {
	rt.setGl("_preloader", rt.new_(f, T("/dmm_suite/preloader"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "_preloader", add);
	return f.dot;
});

rt.type(13800, "/dmm_suite", "/datum", {}, { global: { modelCache: 877, space_key: 878, dmmRegex: 1056, trimQuotesRegex: 1057, trimRegex: 1058 } });

// /dmm_suite/verb/load_map  empty
rt.def("/dmm_suite/verb/load_map", undefined, false, { args: ["dmm_file", "x_offset", "y_offset", "z_offset", "cropMap", "measureOnly", "no_changeturf"], argTypes: [{ type: 512 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }] });

// /dmm_suite/load_map  (code/modules/mapping/reader.dm:34)  may sleep
rt.def("/dmm_suite/load_map", function* load_map(f: Frame, dmm_file: Value, x_offset: Value, y_offset: Value, z_offset: Value, cropMap: Value, measureOnly: Value, no_changeturf: Value) {
	f.vars = () => [dmm_file, x_offset, y_offset, z_offset, cropMap, measureOnly, no_changeturf];
	yield* g.callName(f, rt.gl("Master"), "StartLoadingMap", []);
	rt.setGl("space_key", null);
	f.dot = (yield* g.srcCall(f, "load_map_impl", live(dmm_file), live(x_offset), live(y_offset), live(z_offset), live(cropMap), live(measureOnly), live(no_changeturf)));
	yield* g.callName(f, rt.gl("Master"), "StopLoadingMap", []);
	return f.dot;
}, true, { argTypes: [{ type: 512 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }, { type: 32 }] });

// /dmm_suite/proc/load_map_impl  (code/modules/mapping/reader.dm:47)  may sleep
rt.def("/dmm_suite/proc/load_map_impl", function* load_map_impl(f: Frame, dmm_file: Value, x_offset: Value, y_offset: Value, z_offset: Value, cropMap: Value, measureOnly: Value, no_changeturf: Value) {
	let tfile: Value = null, bounds: Value = null, grid_models: Value = null, key_len: Value = null, stored_index: Value = null, key: Value = null, xcrdStart: Value = null, xcrd: Value = null, ycrd: Value = null, zcrd: Value = null, zexpansion: Value = null, gridLines: Value = null, leadingBlanks: Value = null, maxx: Value = null, line: Value = null, tpos: Value = null, model_key: Value = null, no_afterchange: Value = null, t: Value = null, _T: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [dmm_file, x_offset, y_offset, z_offset, cropMap, measureOnly, no_changeturf, tfile, bounds, grid_models, key_len, stored_index, key, xcrdStart, xcrd, ycrd, zcrd, zexpansion, gridLines, leadingBlanks, maxx, line, tpos, model_key, no_afterchange, t, _T, $0, $1, $2, $3, $e];
	if (truthy((yield* g.call(f, P("/proc/isfile"), null, [(tfile = live(dmm_file))])))) {
		tfile = (yield* g.call(f, P("/proc/file2text"), null, [live(tfile)]));
	}
	if (!truthy(live(x_offset))) {
		x_offset = 1;
	}
	if (!truthy(live(y_offset))) {
		y_offset = 1;
	}
	if (!truthy(live(z_offset))) {
		z_offset = add(rt.fv(f, "maxz", rt.world()), 1);
	}
	bounds = rt.list(Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity);
	grid_models = rt.list();
	key_len = 0;
	stored_index = 1;
	while (truthy((yield* g.callName(f, rt.gl("dmmRegex"), "Find", [live(tfile), live(stored_index)])))) {
		stored_index = rt.fv(f, "next", rt.gl("dmmRegex"));
		if (truthy(rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 1))) {
			key = rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 1);
			if (truthy(rt.index(live(grid_models), live(key)))) {
				continue;
			}
			if (!isEqual(live(key_len), rt.length(live(key)))) {
				if (!truthy(live(key_len))) {
					key_len = rt.length(live(key));
				} else {
					rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Inconsistant key length in DMM", "code/modules/mapping/reader.dm", 75])));
				}
			}
			if (!truthy(live(measureOnly))) {
				rt.setAt(live(grid_models), live(key), rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 2));
			}
		} else {
			if (truthy(rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 3))) {
				if (!truthy(live(key_len))) {
					rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Coords before model definition in DMM", "code/modules/mapping/reader.dm", 82])));
				}
				xcrdStart = subtract(add((yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 3)])), live(x_offset)), 1);
				xcrd = null;
				ycrd = subtract(add((yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 4)])), live(y_offset)), 1);
				zcrd = subtract(add((yield* g.call(f, P("/proc/text2num"), null, [rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 5)])), live(z_offset)), 1);
				if (truthy((zexpansion = (rt.gt(live(zcrd), rt.fv(f, "maxz", rt.world())) ? 1 : 0)))) {
					if (truthy(live(cropMap))) {
						continue;
					}
					rt.setFv(f, "maxz", rt.world(), live(zcrd));
					if (!truthy(live(no_changeturf))) {
						yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Z-level expansion occurred without no_changeturf set, this may cause problems when /turf/AfterChange is called", "code/modules/mapping/reader.dm", 97, live(f.src), live(f.usr)])]);
					}
				}
				rt.setAt(live(bounds), 1, (yield* g.call(f, P("/proc/min"), null, [rt.index(live(bounds), 1), live(xcrdStart)])));
				rt.setAt(live(bounds), 3, (yield* g.call(f, P("/proc/min"), null, [rt.index(live(bounds), 3), live(zcrd)])));
				rt.setAt(live(bounds), 6, (yield* g.call(f, P("/proc/max"), null, [rt.index(live(bounds), 6), live(zcrd)])));
				gridLines = (yield* g.call(f, P("/proc/splittext"), null, [rt.index(rt.fv(f, "group", rt.gl("dmmRegex")), 6), "\n"]));
				leadingBlanks = 0;
				while (rt.lt(live(leadingBlanks), rt.len(f, live(gridLines))) && isEqual(rt.index(live(gridLines), (leadingBlanks = rt.inc(live(leadingBlanks), 1))), "")) {
				}
				if (rt.gt(live(leadingBlanks), 1)) {
					yield* g.callName(f, live(gridLines), "Cut", [1, live(leadingBlanks)]);
				}
				if (!truthy(rt.len(f, live(gridLines)))) {
					continue;
				}
				if ((truthy(rt.len(f, live(gridLines))) && isEqual(rt.index(live(gridLines), rt.len(f, live(gridLines))), ""))) {
					yield* g.callName(f, live(gridLines), "Cut", [rt.len(f, live(gridLines))]);
				}
				rt.setAt(live(bounds), 2, (yield* g.call(f, P("/proc/min"), null, [rt.index(live(bounds), 2), live(ycrd)])));
				ycrd = rt.modify(live(ycrd), subtract(rt.len(f, live(gridLines)), 1), add);
				if ((!truthy(live(cropMap)) && rt.gt(live(ycrd), rt.fv(f, "maxy", rt.world())))) {
					if (!truthy(live(measureOnly))) {
						rt.setFv(f, "maxy", rt.world(), live(ycrd));
					}
					rt.setAt(live(bounds), 5, (yield* g.call(f, P("/proc/max"), null, [rt.index(live(bounds), 5), live(ycrd)])));
				} else {
					rt.setAt(live(bounds), 5, (yield* g.call(f, P("/proc/max"), null, [rt.index(live(bounds), 5), (yield* g.call(f, P("/proc/min"), null, [live(ycrd), rt.fv(f, "maxy", rt.world())]))])));
				}
				maxx = live(xcrdStart);
				if (truthy(live(measureOnly))) {
					line = null;
					rt.forList(f, 0, live(gridLines));
					while (($e = rt.next(f, 0)) !== undefined) {
						line = $e;
						maxx = (yield* g.call(f, P("/proc/max"), null, [live(maxx), subtract(add(live(xcrdStart), divide(rt.length(live(line)), live(key_len))), 1)]));
					}
					rt.endFor(f, 0);
				} else {
					line = null;
					rt.forList(f, 0, live(gridLines));
					while (($e = rt.next(f, 0)) !== undefined) {
						line = $e;
						if ((rt.le(live(ycrd), rt.fv(f, "maxy", rt.world())) && rt.ge(live(ycrd), 1))) {
							xcrd = live(xcrdStart);
							tpos = null;
							rt.forRange(f, 1, 1, add(subtract(rt.length(live(line)), live(key_len)), 1), live(key_len));
							while (($e = rt.next(f, 1)) !== undefined) {
								tpos = $e;
								if (rt.gt(live(xcrd), rt.fv(f, "maxx", rt.world()))) {
									if (truthy(live(cropMap))) {
										break;
									}
									rt.setFv(f, "maxx", rt.world(), live(xcrd));
								}
								if (rt.ge(live(xcrd), 1)) {
									model_key = (yield* g.call(f, P("/proc/copytext"), null, [live(line), live(tpos), add(live(tpos), live(key_len))]));
									if ((!truthy((no_afterchange = (live(no_changeturf) || live(zexpansion)))) || !isEqual(live(model_key), rt.gl("space_key")))) {
										if (!truthy(rt.index(live(grid_models), live(model_key)))) {
											rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Undefined model key in DMM.", "code/modules/mapping/reader.dm", 146])));
										}
										yield* g.srcCall(f, "parse_grid", rt.index(live(grid_models), live(model_key)), live(model_key), live(xcrd), live(ycrd), live(zcrd), (live(no_changeturf) || live(zexpansion)));
									}
									if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
										yield* g.call(f, P("/proc/stoplag"), null, []);
									}
								}
								maxx = (yield* g.call(f, P("/proc/max"), null, [live(maxx), live(xcrd)]));
								xcrd = rt.inc(live(xcrd), 1);
							}
							rt.endFor(f, 1);
						}
						ycrd = rt.inc(live(ycrd), -1);
					}
					rt.endFor(f, 0);
				}
				$0 = live(bounds);
				$1 = 4;
				$2 = rt.index(live(bounds), 4);
				if (truthy(live(cropMap))) {
					$3 = (yield* g.call(f, P("/proc/min"), null, [live(maxx), rt.fv(f, "maxx", rt.world())]));
				} else {
					$3 = live(maxx);
				}
				rt.setAt($0, $1, (yield* g.call(f, P("/proc/max"), null, [$2, $3])));
			}
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	if (isEqual(rt.index(live(bounds), 1), Infinity)) {
		return null;
	}
	if (!truthy(live(measureOnly))) {
		if (!truthy(live(no_changeturf))) {
			t = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate(rt.index(live(bounds), 1), rt.index(live(bounds), 2), rt.index(live(bounds), 3)), rt.locate(rt.index(live(bounds), 4), rt.index(live(bounds), 5), rt.index(live(bounds), 6))])));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				yield* g.callName(f, (_T = live(t)), "AfterChange", [1]);
			}
			rt.endFor(f, 0);
		}
	}
	return live(bounds);
}, true);

// /dmm_suite/proc/parse_grid  (code/modules/mapping/reader.dm:197)  may sleep
rt.def("/dmm_suite/proc/parse_grid", function* parse_grid(f: Frame, model: Value, model_key: Value, xcrd: Value, ycrd: Value, zcrd: Value, no_changeturf: Value) {
	let members: Value = null, members_attributes: Value = null, cached: Value = null, index: Value = null, old_position: Value = null, dpos: Value = null, full_def: Value = null, variables_start: Value = null, atom_def: Value = null, fields: Value = null, I: Value = null, value: Value = null, crds: Value = null, instance: Value = null, atype: Value = null, A: Value = null, first_turf_index: Value = null, _T: Value = null, underlay: Value = null;
	let $e: any, $t: any;
	f.vars = () => [model, model_key, xcrd, ycrd, zcrd, no_changeturf, members, members_attributes, cached, index, old_position, dpos, full_def, variables_start, atom_def, fields, I, value, crds, instance, atype, A, first_turf_index, _T, underlay, $e, $t];
	members = null;
	members_attributes = null;
	cached = rt.index(rt.gl("modelCache"), live(model));
	index = null;
	if (truthy(live(cached))) {
		members = rt.index(live(cached), 1);
		members_attributes = rt.index(live(cached), 2);
	} else {
		members = rt.list();
		members_attributes = rt.list();
		index = 1;
		old_position = 1;
		dpos = null;
		while (true) {
			dpos = (yield* g.srcCall(f, "find_next_delimiter_position", live(model), live(old_position), ",", "{", "}"));
			full_def = (yield* g.srcCall(f, "trim_text", (yield* g.call(f, P("/proc/copytext"), null, [live(model), live(old_position), live(dpos)]))));
			variables_start = (yield* g.call(f, P("/proc/findtext"), null, [live(full_def), "{"]));
			atom_def = (yield* g.call(f, P("/proc/text2path"), null, [(yield* g.srcCall(f, "trim_text", (yield* g.call(f, P("/proc/copytext"), null, [live(full_def), 1, live(variables_start)]))))]));
			old_position = add(live(dpos), 1);
			if (truthy(live(atom_def))) {
				yield* g.callName(f, live(members), "Add", [live(atom_def)]);
				fields = rt.list();
				if (truthy(live(variables_start))) {
					if (truthy(rt.getLen(f, (fields = (yield* g.srcCall(f, "readlist", (full_def = (yield* g.call(f, P("/proc/copytext"), null, [live(full_def), add(live(variables_start), 1), rt.length(live(full_def))]))), ";")))))) {
						if (!truthy((yield* g.call(f, P("/proc/trim"), null, [rt.index(live(fields), rt.len(f, live(fields)))])))) {
							rt.incField(f, live(fields), "len", -1, false);
						}
						I = null;
						rt.forList(f, 0, live(fields));
						while (($e = rt.next(f, 0)) !== undefined) {
							I = $e;
							if (truthy((yield* g.call(f, P("/proc/istext"), null, [(value = rt.index(live(fields), live(I)))])))) {
								rt.setAt(live(fields), live(I), (yield* g.call(f, P("/proc/apply_text_macros"), null, [live(value)])));
							}
						}
						rt.endFor(f, 0);
					}
				}
				rt.incField(f, live(members_attributes), "len", 1, true);
				rt.setAt(live(members_attributes), ($t = live(index), index = rt.inc($t, 1), $t), live(fields));
				if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
					yield* g.call(f, P("/proc/stoplag"), null, []);
				}
			}
			if (isEqual(live(dpos), 0)) break;
		}
		if ((((((((truthy(live(no_changeturf)) && !truthy(rt.gl("space_key"))) && isEqual(rt.len(f, live(members)), 2)) && isEqual(rt.len(f, live(members_attributes)), 2)) && isEqual(rt.length(rt.index(live(members_attributes), 1)), 0)) && isEqual(rt.length(rt.index(live(members_attributes), 2)), 0)) && truthy((rt.isIn(f, rt.fv(f, "area", rt.world()), live(members)) ? 1 : 0))) && truthy((rt.isIn(f, rt.fv(f, "turf", rt.world()), live(members)) ? 1 : 0)))) {
			rt.setGl("space_key", live(model_key));
			return live(f.dot);
		}
		rt.setAt(rt.gl("modelCache"), live(model), rt.list(live(members), live(members_attributes)));
	}
	crds = rt.locate(live(xcrd), live(ycrd), live(zcrd));
	index = rt.len(f, live(members));
	if (!isEqual(rt.index(live(members), live(index)), T("/area/template_noop"))) {
		instance = null;
		yield* g.callName(f, rt.gl("_preloader"), "setup", [rt.index(live(members_attributes), live(index))]);
		atype = rt.index(live(members), live(index));
		A = null;
		rt.forList(f, 0, rt.world(), T("/area"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (isEqual(rt.fv(f, "type", live(A)), live(atype))) {
				instance = live(A);
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(instance))) {
			instance = (yield* g.new_(f, live(atype), [null]));
		}
		if (truthy(live(crds))) {
			yield* g.callName(f, rt.fv(f, "contents", live(instance)), "Add", [live(crds)]);
		}
		if ((truthy(rt.gl("use_preloader")) && truthy(live(instance)))) {
			yield* g.callName(f, rt.gl("_preloader"), "load", [live(instance)]);
		}
	}
	first_turf_index = 1;
	while (!truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.index(live(members), live(first_turf_index)), T("/turf")])))) {
		first_turf_index = rt.inc(live(first_turf_index), 1);
	}
	yield* g.callName(f, rt.gl("SSatoms"), "map_loader_begin", []);
	_T = null;
	if (!isEqual(rt.index(live(members), live(first_turf_index)), T("/turf/template_noop"))) {
		_T = (yield* g.srcCall(f, "instance_atom", rt.index(live(members), live(first_turf_index)), rt.index(live(members_attributes), live(first_turf_index)), live(crds), live(no_changeturf)));
	}
	if (truthy(live(_T))) {
		index = add(live(first_turf_index), 1);
		while (rt.le(live(index), subtract(rt.len(f, live(members)), 1))) {
			underlay = rt.fv(f, "appearance", live(_T));
			rt.modField(f, (_T = (yield* g.srcCall(f, "instance_atom", rt.index(live(members), live(index)), rt.index(live(members_attributes), live(index)), live(crds), live(no_changeturf)))), "underlays", live(underlay), add);
			index = rt.inc(live(index), 1);
		}
	}
	rt.forRange(f, 0, 1, subtract(live(first_turf_index), 1), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		index = $e;
		yield* g.srcCall(f, "instance_atom", rt.index(live(members), live(index)), rt.index(live(members_attributes), live(index)), live(crds), live(no_changeturf));
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.gl("SSatoms"), "map_loader_stop", []);
	return f.dot;
}, true);

// /dmm_suite/proc/instance_atom  (code/modules/mapping/reader.dm:326)  may sleep
rt.def("/dmm_suite/proc/instance_atom", function* instance_atom(f: Frame, path: Value, attributes: Value, crds: Value, no_changeturf: Value) {
	f.vars = () => [path, attributes, crds, no_changeturf];
	yield* g.callName(f, rt.gl("_preloader"), "setup", [live(attributes), live(path)]);
	if (truthy(live(crds))) {
		if ((!truthy(live(no_changeturf)) && truthy((yield* g.call(f, P("/proc/ispath"), null, [live(path), T("/turf")]))))) {
			f.dot = (yield* g.callName(f, live(crds), "ChangeTurf", [live(path), 1]));
		} else {
			f.dot = (yield* g.srcCall(f, "create_atom", live(path), live(crds)));
		}
	}
	if ((truthy(rt.gl("use_preloader")) && truthy(live(f.dot)))) {
		yield* g.callName(f, rt.gl("_preloader"), "load", [live(f.dot)]);
	}
	if (!rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) return f.dot;
	yield* g.callName(f, rt.gl("SSatoms"), "map_loader_stop", []);
	yield* g.call(f, P("/proc/stoplag"), null, []);
	yield* g.callName(f, rt.gl("SSatoms"), "map_loader_begin", []);
	return f.dot;
}, true);

// /dmm_suite/proc/create_atom  (code/modules/mapping/reader.dm:345)  may sleep
rt.def("/dmm_suite/proc/create_atom", function* create_atom(f: Frame, path: Value, crds: Value) {
	f.vars = () => [path, crds];
	f.dot = (yield* g.new_(f, live(path), [live(crds)]));
	return f.dot;
}, true, { waitfor: false });

// /dmm_suite/proc/trim_text  (code/modules/mapping/reader.dm:351)
rt.def("/dmm_suite/proc/trim_text", function trim_text(f: Frame, what: Value, trim_quotes: Value) {
	f.vars = () => [trim_quotes];
	if (live(trim_quotes) === null) {
		trim_quotes = 0;
	}
	if (truthy(live(trim_quotes))) {
		return rt.callName(f, rt.gl("trimQuotesRegex"), "Replace", [live(what), ""]);
	}
	return rt.callName(f, rt.gl("trimRegex"), "Replace", [live(what), ""]);
});

// /dmm_suite/proc/find_next_delimiter_position  (code/modules/mapping/reader.dm:359)
rt.def("/dmm_suite/proc/find_next_delimiter_position", function find_next_delimiter_position(f: Frame, text: Value, initial_position: Value, delimiter: Value, opening_escape: Value, closing_escape: Value) {
	let position: Value = null, next_delimiter: Value = null, next_opening: Value = null;
	f.vars = () => [delimiter, opening_escape, closing_escape, position, next_delimiter, next_opening];
	if (live(delimiter) === null) {
		delimiter = ",";
	}
	if (live(opening_escape) === null) {
		opening_escape = "\"";
	}
	if (live(closing_escape) === null) {
		closing_escape = "\"";
	}
	position = live(initial_position);
	next_delimiter = rt.call(f, P("/proc/findtext"), null, [live(text), live(delimiter), live(position), 0]);
	next_opening = rt.call(f, P("/proc/findtext"), null, [live(text), live(opening_escape), live(position), 0]);
	while (!isEqual(live(next_opening), 0) && rt.lt(live(next_opening), live(next_delimiter))) {
		position = add(rt.call(f, P("/proc/findtext"), null, [live(text), live(closing_escape), add(live(next_opening), 1), 0]), 1);
		next_delimiter = rt.call(f, P("/proc/findtext"), null, [live(text), live(delimiter), live(position), 0]);
		next_opening = rt.call(f, P("/proc/findtext"), null, [live(text), live(opening_escape), live(position), 0]);
	}
	return live(next_delimiter);
});

// /dmm_suite/proc/readlist  (code/modules/mapping/reader.dm:375)
rt.def("/dmm_suite/proc/readlist", function readlist(f: Frame, text: Value, delimiter: Value) {
	let to_return: Value = null, position: Value = null, old_position: Value = null, equal_position: Value = null, trim_left: Value = null, trim_right: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [delimiter, to_return, position, old_position, equal_position, trim_left, trim_right, $0, $1, $2];
	if (live(delimiter) === null) {
		delimiter = ",";
	}
	to_return = rt.list();
	position = null;
	old_position = 1;
	while (true) {
		position = rt.callSrc(f, "find_next_delimiter_position", [live(text), live(old_position), live(delimiter)]);
		equal_position = rt.call(f, P("/proc/findtext"), null, [live(text), "=", live(old_position), live(position)]);
		$0 = live(text);
		$1 = live(old_position);
		if (truthy(live(equal_position))) {
			$1 = $1;
			$2 = live(equal_position);
		} else {
			$2 = live(position);
		}
		trim_left = rt.callSrc(f, "trim_text", [rt.call(f, P("/proc/copytext"), null, [$0, $1, $2]), 1]);
		old_position = add(live(position), 1);
		if (truthy(live(equal_position))) {
			if (truthy(rt.call(f, P("/proc/findtext"), null, [(trim_right = rt.callSrc(f, "trim_text", [rt.call(f, P("/proc/copytext"), null, [live(text), add(live(equal_position), 1), live(position)])])), "\"", 1, 2]))) {
				trim_right = rt.call(f, P("/proc/copytext"), null, [live(trim_right), 2, rt.call(f, P("/proc/findtext"), null, [live(trim_right), "\"", 3, 0])]);
			} else {
				if (truthy(rt.call(f, P("/proc/isnum"), null, [rt.call(f, P("/proc/text2num"), null, [live(trim_right)])]))) {
					trim_right = rt.call(f, P("/proc/text2num"), null, [live(trim_right)]);
				} else {
					if (isEqual(live(trim_right), "null")) {
						trim_right = null;
					} else {
						if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(trim_right), 1, 5]), "list")) {
							trim_right = rt.callSrc(f, "readlist", [rt.call(f, P("/proc/copytext"), null, [live(trim_right), 6, rt.length(live(trim_right))])]);
						} else {
							if (isEqual(rt.call(f, P("/proc/copytext"), null, [live(trim_right), 1, 2]), "'")) {
								trim_right = rt.call(f, P("/proc/file"), null, [rt.call(f, P("/proc/copytext"), null, [live(trim_right), 2, rt.length(live(trim_right))])]);
							} else {
								if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.call(f, P("/proc/text2path"), null, [live(trim_right)])]))) {
									trim_right = rt.call(f, P("/proc/text2path"), null, [live(trim_right)]);
								}
							}
						}
					}
				}
			}
			rt.setAt(live(to_return), live(trim_left), live(trim_right));
		} else {
			rt.setAt(live(to_return), live(trim_left), null);
		}
		if (isEqual(live(position), 0)) break;
	}
	return live(to_return);
});

// /dmm_suite/proc/Destroy  (code/modules/mapping/reader.dm:427)  may sleep
rt.def("/dmm_suite/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 4;
}, true);

rt.type(13801, "/dmm_suite/preloader", "/datum", {
	attributes: null,
	target_path: null,
});

// /dmm_suite/preloader/proc/setup  (code/modules/mapping/reader.dm:440)
rt.def("/dmm_suite/preloader/proc/setup", function setup(f: Frame, the_attributes: Value, path: Value) {
	if (!truthy(rt.len(f, live(the_attributes)))) return f.dot;
	rt.setGl("use_preloader", 1);
	rt.setSv(f, "attributes", live(the_attributes));
	rt.setSv(f, "target_path", live(path));
	return f.dot;
});

// /dmm_suite/preloader/proc/load  (code/modules/mapping/reader.dm:446)
// tg bug fixed: readlist doesn't know `newlist(...)` (MetaStation's hitman briefcase, `contents = newlist(...)`), so the raw text
// was written to the var. Here the listed types are made inside the object instead, after its other vars are set.
rt.def("/dmm_suite/preloader/proc/load", function* load(f: Frame, what: Value) {
	let attribute: Value = null, value: Value = null, made: Value = null, path: Value = null;
	let $e: any;
	f.vars = () => [attribute, value, made, path, $e];
	attribute = null;
	rt.forList(f, 0, rt.sv(f, "attributes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		attribute = $e;
		if (truthy((rt.istype((value = rt.index(rt.sv(f, "attributes"), live(attribute))), T("/list")) ? 1 : 0))) {
			value = rt.call(f, P("/proc/deepCopyList"), null, [live(value)]);
		}
		if (isEqual(live(attribute), "contents") && isEqual(rt.call(f, P("/proc/copytext"), null, [live(value), 1, 9]), "newlist(")) {
			made = rt.call(f, P("/proc/splittext"), null, [rt.call(f, P("/proc/copytext"), null, [live(value), 9, rt.length(live(value))]), ","]);
		} else {
			rt.setAt(rt.fv(f, "vars", live(what)), live(attribute), live(value));
		}
	}
	rt.endFor(f, 0);
	rt.setGl("use_preloader", 0);
	if (live(made) !== null) {
		rt.forList(f, 0, live(made));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = rt.call(f, P("/proc/text2path"), null, [$e]);
			if (truthy(rt.call(f, P("/proc/ispath"), null, [live(path)]))) yield* g.new_(f, live(path), [live(what)]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);
