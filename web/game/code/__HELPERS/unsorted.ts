// Based on /tg/station's code/__HELPERS/unsorted.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;

// unsorted.dm:30
rt.def("/proc/Get_Angle", function Get_Angle(f: Frame, start: Value, end: Value) {
	if (!start || !end) {
		return 0;
	}
	let dy: Value = 32 * end.y + end.pixel_y - (32 * start.y + start.pixel_y);
	let dx: Value = 32 * end.x + end.pixel_x - (32 * start.x + start.pixel_x);
	if (!dy) {
		return dx >= 0 ? 90 : 270;
	}
	f.dot = rt.op(f, "ArcTan", [], [dx / dy]);
	if (dy < 0) {
		f.dot += 180;
	} else {
		if (!(dx < 0)) return f.dot;
		f.dot += 360;
	}
	return f.dot;
});

// unsorted.dm:65
rt.def("/proc/get_teleport_loc", function get_teleport_loc(f: Frame, location: Value, target: Value, distance: Value, density: Value, errorx: Value, errory: Value, eoffsetx: Value, eoffsety: Value) {
	let destination: Value = null, destination_list: Value = null, center: Value = null, _T: Value = null;
	let $e: any;
	distance ??= 1;
	density ??= 0;
	errorx ??= 0;
	errory ??= 0;
	eoffsetx ??= 0;
	eoffsety ??= 0;
	let dirx: Value = 0;
	let diry: Value = 0;
	let xoffset: Value = 0;
	let yoffset: Value = 0;
	let b1xerror: Value = 0;
	let b1yerror: Value = 0;
	let b2xerror: Value = 0;
	let b2yerror: Value = 0;
	errorx = rt.op(f, "Abs", [], [errorx]);
	errory = rt.op(f, "Abs", [], [errory]);
	if (target.dir === 1) {
		diry += distance;
		yoffset += eoffsety;
		xoffset += eoffsetx;
		b1xerror -= errorx;
		b1yerror -= errory;
		b2xerror += errorx;
		b2yerror += errory;
	} else if (target.dir === 2) {
		diry -= distance;
		yoffset -= eoffsety;
		xoffset += eoffsetx;
		b1xerror -= errorx;
		b1yerror -= errory;
		b2xerror += errorx;
		b2yerror += errory;
	} else if (target.dir === 4) {
		dirx += distance;
		yoffset += eoffsetx;
		xoffset += eoffsety;
		b1xerror -= errory;
		b1yerror -= errorx;
		b2xerror += errory;
		b2yerror += errorx;
	} else if (target.dir === 8) {
		dirx -= distance;
		yoffset -= eoffsetx;
		xoffset += eoffsety;
		b1xerror -= errory;
		b1yerror -= errorx;
		b2xerror += errory;
		b2yerror += errorx;
	}
	if (destination = rt.locate(location.x + dirx, location.y + diry, location.z)) {
		if (errorx || errory) {
			destination_list = list();
			center = rt.locate(destination.x + xoffset, destination.y + yoffset, location.z);
			for (_T of each(block(rt.locate(center.x + b1xerror, center.y + b1yerror, location.z), rt.locate(center.x + b2xerror, center.y + b2yerror, location.z)), T("/turf"))) {
				if (density && _T.density) {
					continue;
				}
				if (_T.x > rt.world().maxx || _T.x < 1) {
					continue;
				}
				if (_T.y > rt.world().maxy || _T.y < 1) {
					continue;
				}
				destination_list += _T;
			}
			if (rt.len(f, destination_list)) {
				destination = pick(destination_list);
			} else {
				return f.dot;
			}
		} else {
			if (density && destination.density) {
				return f.dot;
			}
			if (destination.x > rt.world().maxx || destination.x < 1) {
				return f.dot;
			}
			if (destination.y > rt.world().maxy || destination.y < 1) {
				return f.dot;
			}
		}
	} else {
		return f.dot;
	}
	return destination;
});

// unsorted.dm:147
rt.def("/proc/getline", function getline(f: Frame, M: Value, N: Value) {
	let j: Value = null;
	let px: Value = M.x;
	let py: Value = M.y;
	let line: Value = list(rt.locate(px, py, M.z));
	let dx: Value = N.x - px;
	let dy: Value = N.y - py;
	let dxabs: Value = rt.op(f, "Abs", [], [dx]);
	let dyabs: Value = rt.op(f, "Abs", [], [dy]);
	let sdx: Value = sign(dx);
	let sdy: Value = sign(dy);
	let x: Value = rt.shiftRight(dxabs, 1);
	let y: Value = rt.shiftRight(dyabs, 1);
	if (dxabs >= dyabs) {
		j = 0;
		while (j < dxabs) {
			if ((y += dyabs) >= dxabs) {
				y -= dxabs;
				py += sdy;
			}
			line += rt.locate((px += sdx), py, M.z);
			j++;
		}
	} else {
		j = 0;
		while (j < dyabs) {
			if ((x += dxabs) >= dyabs) {
				x -= dyabs;
				px += sdx;
			}
			py += sdy;
			line += rt.locate(px, py, M.z);
			j++;
		}
	}
	return line;
});

// unsorted.dm:177
rt.def("/proc/IsGuestKey", function IsGuestKey(f: Frame, key: Value) {
	let ch: Value = null;
	if (findtext(key, "Guest-", 1, 7) != 1) {
		return 0;
	}
	let len: Value = rt.length(key);
	let i: Value = 7;
	while (i <= len) {
		if ((ch = text2ascii(key, i)) < 48 || ch > 57) {
			return 0;
		}
		i++;
	}
	return 1;
});

// unsorted.dm:190
rt.def("/mob/proc/rename_self", function* rename_self(f: Frame, role: Value, C: Value) {
	let newname: Value = null, M: Value = null;
	let $e: any;
	if (!C) {
		C = this.client;
	}
	let oldname: Value = this.real_name;
	let loop: Value = 1;
	let safety: Value = 0;
	while (loop && safety < 5) {
		if (C && rt.index(C.prefs.custom_names, role) && !safety) {
			newname = rt.index(C.prefs.custom_names, role);
		} else if (role === "clown") {
			newname = pick(GLOB.clown_names);
		} else if (role === "mime") {
			newname = pick(GLOB.mime_names);
		} else if (role === "ai") {
			newname = pick(GLOB.ai_names);
		} else if (role === "deity") {
			newname = pick(rt.bitOr(rt.bitOr(GLOB.clown_names, GLOB.ai_names), GLOB.mime_names));
		} else {
			return f.dot;
		}
		M = null;
		for (M of each(GLOB.player_list, T("/mob/living"))) {
			if (M == this) {
				continue;
			}
			if (!newname || M.real_name == newname) {
				newname = null;
				loop++;
				break;
			}
		}
		loop--;
		safety++;
	}
	if (!newname) return f.dot;
	yield* this.fully_replace_character_name(oldname, newname);
	return f.dot;
}, true);

// unsorted.dm:229
rt.def("/proc/ionnum", function ionnum(f: Frame) {
	return `${pick("!", "@", "#", "$", "%", "^", "&")}${pick("!", "@", "#", "$", "%", "^", "&", "*")}${pick("!", "@", "#", "$", "%", "^", "&", "*")}${pick("!", "@", "#", "$", "%", "^", "&", "*")}`;
});

// unsorted.dm:233
rt.def("/proc/active_free_borgs", function active_free_borgs(f: Frame) {
	let R: Value = null;
	f.dot = list();
	for (R of each(GLOB.living_mob_list, T("/mob/living/silicon/robot"))) {
		if (R.connected_ai || R.shell) {
			continue;
		}
		if (R.stat == 2) {
			continue;
		}
		if (R.emagged || R.scrambledcodes || R.syndicate) {
			continue;
		}
		f.dot += R;
	}
	return f.dot;
});

// unsorted.dm:245
rt.def("/proc/active_ais", function active_ais(f: Frame, check_mind: Value) {
	let A: Value = null;
	check_mind ??= 0;
	f.dot = list();
	for (A of each(GLOB.living_mob_list, T("/mob/living/silicon/ai"))) {
		if (A.stat == 2) {
			continue;
		}
		if (A.control_disabled == 1) {
			continue;
		}
		if (check_mind) {
			if (!A.mind) {
				continue;
			}
		}
		f.dot += A;
	}
	return f.dot;
});

// unsorted.dm:260
rt.def("/proc/select_active_ai_with_fewest_borgs", function select_active_ai_with_fewest_borgs(f: Frame) {
	let selected: Value = null, A: Value = null;
	let active: Value = active_ais();
	for (A of each(active, T("/mob/living/silicon/ai"))) {
		if (!selected || rt.len(f, selected.connected_robots) > rt.len(f, A.connected_robots)) {
			selected = A;
		}
	}
	return selected;
});

// unsorted.dm:268
rt.def("/proc/select_active_free_borg", function* select_active_free_borg(f: Frame, user: Value) {
	let borgs: Value = null;
	if (rt.len(f, (borgs = active_free_borgs()))) {
		if (user) {
			f.dot = (yield* g.op(f, "Prompt", [0], [rt.index(borgs, 1), "Cyborg Selection", "Unshackled cyborg signals detected:", user, borgs]));
		} else {
			f.dot = pick(borgs);
		}
	}
	return f.dot;
}, true);

// unsorted.dm:277
rt.def("/proc/select_active_ai", function* select_active_ai(f: Frame, user: Value) {
	let ais: Value = null;
	if (rt.len(f, (ais = active_ais()))) {
		if (user) {
			f.dot = (yield* g.op(f, "Prompt", [0], [rt.index(ais, 1), "AI Selection", "AI signals detected:", user, ais]));
		} else {
			f.dot = pick(ais);
		}
	}
	return f.dot;
}, true);

// unsorted.dm:287
rt.def("/proc/getpois", function* getpois(f: Frame, mobs_only: Value, skip_mindless: Value) {
	let M: Value = null, name: Value = null, A: Value = null;
	mobs_only ??= 0;
	skip_mindless ??= 0;
	let mobs: Value = (yield* sortmobs());
	let namecounts: Value = list();
	let pois: Value = list();
	const creative = is_creative(); // tg_js: on Creative, only what's on the floor (creative.ts)
	for (M of each(mobs, T("/mob"))) {
		if (creative && creative_off_floor(M)) continue;
		if (skip_mindless && !M.mind && !M.ckey) {
			if (!rt.istype(M, T("/mob/living/simple_animal/bot")) && !rt.istype(M, T("/mob/camera"))) {
				continue;
			}
		}
		if (M.client && M.client.holder && M.client.holder.fakekey) {
			continue;
		}
		name = avoid_assoc_duplicate_keys(M.name, namecounts);
		if (M.real_name && M.real_name != M.name) {
			name += ` [${M.real_name}]`;
		}
		if (M.stat == 2) {
			if (rt.istype(M, T("/mob/dead/observer"))) {
				name += " [ghost]";
			} else {
				name += " [dead]";
			}
		}
		rt.setAt(pois, name, M);
	}
	if (!mobs_only) {
		for (A of each(GLOB.poi_list, T("/atom"))) {
			if (!A || !A.loc) {
				continue;
			}
			if (creative && creative_off_floor(A)) continue;
			rt.setAt(pois, avoid_assoc_duplicate_keys(A.name, namecounts), A);
		}
	}
	return pois;
}, true);

// unsorted.dm:316
rt.def("/proc/sortmobs", function* sortmobs(f: Frame) {
	let M: Value = null;
	let moblist: Value = list();
	let sortmob: Value = (yield* sortNames(GLOB.mob_list));
	for (M of each(sortmob, T("/mob/living/silicon/ai"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/camera"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/silicon/pai"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/silicon/robot"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/carbon/human"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/brain"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/carbon/alien"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/dead/observer"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/dead/new_player"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/carbon/monkey"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/simple_animal/slime"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/simple_animal"))) {
		moblist.Add(M);
	}
	M = null;
	for (M of each(sortmob, T("/mob/living/carbon/true_devil"))) {
		moblist.Add(M);
	}
	return moblist;
}, true);

// unsorted.dm:366
rt.def("/proc/key_name", function key_name(f: Frame, whom: Value, include_link: Value, include_name: Value) {
	let M: Value = null, C: Value = null, key: Value = null, ckey: Value = null;
	include_name ??= 1;
	if (!whom) {
		return "*null*";
	}
	if (rt.istype(whom, T("/client"))) {
		M = (C = whom).mob;
		key = C.key;
		ckey = C.ckey;
	} else if (ismob(whom)) {
		C = (M = whom).client;
		key = M.key;
		ckey = M.ckey;
	} else if (istext(whom)) {
		key = whom;
		ckey = rt.call(f, P("/proc/ckey"), null, [whom]);
		if (C = rt.index(GLOB.directory, ckey)) {
			M = C.mob;
		}
	} else {
		return "*invalid*";
	}
	f.dot = "";
	if (!ckey) {
		include_link = 0;
	}
	if (key) {
		if (C && C.holder && C.holder.fakekey && !include_name) {
			if (include_link) {
				f.dot += `<a href='?priv_msg=${C.findStealthKey()}'>`;
			}
			f.dot += "Administrator";
		} else {
			if (include_link) {
				f.dot += `<a href='?priv_msg=${ckey}'>`;
			}
			f.dot += key;
		}
		if (!C) {
			f.dot += "[DC]";
		}
		if (include_link) {
			f.dot += "</a>";
		}
	} else {
		f.dot += "*no key*";
	}
	if (include_name && M) {
		if (M.real_name) {
			f.dot += `/(${M.real_name})`;
		} else if (M.name) {
			f.dot += `/(${M.name})`;
		}
	}
	return f.dot;
});

// unsorted.dm:418
rt.def("/proc/key_name_admin", function key_name_admin(f: Frame, whom: Value, include_name: Value) {
	include_name ??= 1;
	return key_name(whom, 1, include_name);
});

// unsorted.dm:421
rt.def("/proc/get_mob_by_ckey", function* get_mob_by_ckey(f: Frame, key: Value) {
	let M: Value = null;
	if (!key) {
		return f.dot;
	}
	let mobs: Value = (yield* sortmobs());
	for (M of each(mobs, T("/mob"))) {
		if (M.ckey == key) {
			return M;
		}
	}
	return f.dot;
}, true);

// unsorted.dm:432
rt.def("/proc/get_atom_on_turf", function get_atom_on_turf(f: Frame, M: Value, stop_type: Value) {
	let loc: Value = M;
	while (loc && loc.loc && !isturf(loc.loc)) {
		loc = loc.loc;
		if (stop_type && rt.op(f, "IsType", [], [loc, stop_type])) {
			break;
		}
	}
	return loc;
});

// unsorted.dm:442
rt.def("/proc/get_edge_target_turf", function get_edge_target_turf(f: Frame, A: Value, direction: Value) {
	let target: Value = rt.locate(A.x, A.y, A.z);
	if (!A || !target) {
		return 0;
	}
	if (rt.bitAnd(direction, 1)) {
		target = rt.locate(target.x, rt.world().maxy, target.z);
	}
	if (rt.bitAnd(direction, 2)) {
		target = rt.locate(target.x, 1, target.z);
	}
	if (rt.bitAnd(direction, 4)) {
		target = rt.locate(rt.world().maxx, target.y, target.z);
	}
	if (rt.bitAnd(direction, 8)) {
		target = rt.locate(1, target.y, target.z);
	}
	return target;
});

// unsorted.dm:467
rt.def("/proc/get_ranged_target_turf", function get_ranged_target_turf(f: Frame, A: Value, direction: Value, range: Value) {
	let x: Value = A.x;
	let y: Value = A.y;
	if (rt.bitAnd(direction, 1)) {
		y = min(rt.world().maxy, y + range);
	}
	if (rt.bitAnd(direction, 2)) {
		y = max(1, y - range);
	}
	if (rt.bitAnd(direction, 4)) {
		x = min(rt.world().maxx, x + range);
	}
	if (rt.bitAnd(direction, 8)) {
		x = max(1, x - range);
	}
	return rt.locate(x, y, A.z);
});

// unsorted.dm:482
rt.def("/proc/get_offset_target_turf", function get_offset_target_turf(f: Frame, A: Value, dx: Value, dy: Value) {
	let x: Value = min(rt.world().maxx, max(1, A.x + dx));
	let y: Value = min(rt.world().maxy, max(1, A.y + dy));
	return rt.locate(x, y, A.z);
});

// unsorted.dm:491
rt.def("/atom/proc/GetAllContents", function GetAllContents(f: Frame) {
	let A: Value = null, a: Value = null;
	let processing_list: Value = list(this);
	let assembled: Value = list();
	while (rt.len(f, processing_list)) {
		processing_list -= (A = rt.index(processing_list, 1));
		a = null;
		for (a of each(A, T("/atom"))) {
			if (!rt.isIn(f, a, assembled)) {
				(processing_list = rt.modify(processing_list, a, rt.bitOr));
			}
		}
		(assembled = rt.modify(assembled, A, rt.bitOr));
	}
	return assembled;
});

// unsorted.dm:508
rt.def("/proc/can_see", function can_see(f: Frame, source: Value, target: Value, length: Value) {
	let thing: Value = null, A: Value = null;
	length ??= 5;
	let current: Value = rt.getStep(f, source, 0);
	let target_turf: Value = rt.getStep(f, target, 0);
	let steps: Value = 1;
	if (current != target_turf) {
		current = get_step_towards(current, target_turf);
		while (current != target_turf) {
			if (steps > length) {
				return 0;
			}
			if (current.opacity) {
				return 0;
			}
			thing = null;
			for (thing of each(current)) {
				if ((A = thing).opacity) {
					return 0;
				}
			}
			current = get_step_towards(current, target_turf);
			steps++;
		}
	}
	return 1;
});

// unsorted.dm:528
rt.def("/proc/is_blocked_turf", function is_blocked_turf(f: Frame, _T: Value, exclude_mobs: Value) {
	let i: Value = null, A: Value = null;
	if (_T.density) {
		return 1;
	}
	for (i of each(_T)) {
		if ((A = i).density && (!exclude_mobs || !ismob(A))) {
			return 1;
		}
	}
	return 0;
});

// unsorted.dm:537
rt.def("/proc/is_anchored_dense_turf", function is_anchored_dense_turf(f: Frame, _T: Value) {
	let i: Value = null, A: Value = null;
	if (_T.density) {
		return 1;
	}
	for (i of each(_T)) {
		if ((A = i).density && A.anchored) {
			return 1;
		}
	}
	return 0;
});

// unsorted.dm:579
rt.def("/proc/hasvar", function hasvar(f: Frame, A: Value, varname: Value) {
	if (A.vars.Find(lowertext(varname))) {
		return 1;
	} else {
		return 0;
	}
});

// unsorted.dm:586
rt.def("/proc/repopulate_sorted_areas", function* repopulate_sorted_areas(f: Frame) {
	let A: Value = null;
	GLOB.sortedAreas = list();
	for (A of each(rt.world(), T("/area"))) {
		GLOB.sortedAreas.Add(A);
	}
	yield* sortTim(GLOB.sortedAreas, P("/proc/cmp_name_asc"));
	return f.dot;
}, true);

// unsorted.dm:594
rt.def("/area/proc/addSorted", function* addSorted(f: Frame) {
	GLOB.sortedAreas.Add(this);
	yield* sortTim(GLOB.sortedAreas, P("/proc/cmp_name_asc"));
	return f.dot;
}, true);

// unsorted.dm:600
rt.def("/proc/get_areas", function get_areas(f: Frame, areatype: Value, subtypes: Value) {
	let areatemp: Value = null, cache: Value = null, V: Value = null, A: Value = null, V_1: Value = null, A_2: Value = null;
	subtypes ??= 1;
	if (istext(areatype)) {
		areatype = text2path(areatype);
	} else if (isarea(areatype)) {
		areatype = (areatemp = areatype).type;
	} else if (!ispath(areatype)) {
		return null;
	}
	let areas: Value = list();
	if (subtypes) {
		cache = typecacheof(areatype);
		for (V of each(GLOB.sortedAreas)) {
			A = V;
			if (rt.index(cache, A.type)) {
				areas += V;
			}
		}
	} else {
		for (V_1 of each(GLOB.sortedAreas)) {
			if ((A_2 = V_1).type == areatype) {
				areas += V_1;
			}
		}
	}
	return areas;
});

// unsorted.dm:625
rt.def("/proc/get_area_turfs", function get_area_turfs(f: Frame, areatype: Value, target_z: Value, subtypes: Value) {
	let areatemp: Value = null, cache: Value = null, V: Value = null, A: Value = null, _T: Value = null, V_1: Value = null, A_2: Value = null, _T_3: Value = null;
	target_z ??= 0;
	subtypes ??= 0;
	if (istext(areatype)) {
		areatype = text2path(areatype);
	} else if (isarea(areatype)) {
		areatype = (areatemp = areatype).type;
	} else if (!ispath(areatype)) {
		return null;
	}
	let turfs: Value = list();
	if (subtypes) {
		cache = typecacheof(areatype);
		for (V of each(GLOB.sortedAreas)) {
			A = V;
			if (!rt.index(cache, A.type)) {
				continue;
			}
			_T = null;
			for (_T of each(A, T("/turf"))) {
				if (target_z == 0 || target_z == _T.z) {
					turfs += _T;
				}
			}
		}
	} else {
		for (V_1 of each(GLOB.sortedAreas)) {
			if ((A_2 = V_1).type != areatype) {
				continue;
			}
			_T_3 = null;
			for (_T_3 of each(A_2, T("/turf"))) {
				if (target_z == 0 || target_z == _T_3.z) {
					turfs += _T_3;
				}
			}
		}
	}
	return turfs;
});

// unsorted.dm:654
rt.def("/proc/get_cardinal_dir", function get_cardinal_dir(f: Frame, A: Value, B: Value) {
	let dx: Value = rt.op(f, "Abs", [], [B.x - A.x]);
	let dy: Value = rt.op(f, "Abs", [], [B.y - A.y]);
	let $0: any = rt.getDir(f, A, B);
	return rt.bitAnd($0, rand() * (dx + dy) < dy ? 3 : 12);
});

// unsorted.dm:663
rt.def("/proc/view_or_range", function view_or_range(f: Frame, distance: Value, center: Value, type: Value) {
	distance ??= rt.world().view;
	center ??= f.usr;
	if (type === "view") {
		f.dot = view(distance, center);
	} else if (type === "range") {
		f.dot = range(distance, center);
	}
	return f.dot;
});

// unsorted.dm:679
rt.def("/proc/parse_zone", function parse_zone(f: Frame, zone: Value) {
	if (zone == "r_hand") {
		return "right hand";
	}
	if (zone == "l_hand") {
		return "left hand";
	}
	if (zone == "l_arm") {
		return "left arm";
	}
	if (zone == "r_arm") {
		return "right arm";
	}
	if (zone == "l_leg") {
		return "left leg";
	}
	if (zone == "r_leg") {
		return "right leg";
	}
	if (zone == "l_foot") {
		return "left foot";
	}
	if (zone == "r_foot") {
		return "right foot";
	}
	return zone;
});

// unsorted.dm:714
rt.def("/proc/get_turf_pixel", function get_turf_pixel(f: Frame, AM: Value) {
	let _T: Value = null;
	if (!rt.istype(AM, T("/atom/movable"))) {
		return f.dot;
	}
	let M: Value = matrix(AM.transform);
	let pixel_x_offset: Value = AM.pixel_x + M.get_x_shift();
	let pixel_y_offset: Value = AM.pixel_y + M.get_y_shift();
	let AMicon: Value = icon(AM.icon, AM.icon_state);
	let AMiconheight: Value = AMicon.Height();
	let AMiconwidth: Value = AMicon.Width();
	if (AMiconheight != rt.world().icon_size || AMiconwidth != rt.world().icon_size) {
		pixel_x_offset += (AMicon.Width() / rt.world().icon_size - 1) * (rt.world().icon_size * 0.5);
		pixel_y_offset += (AMicon.Height() / rt.world().icon_size - 1) * (rt.world().icon_size * 0.5);
	}
	let rough_x: Value = round(round(pixel_x_offset, rt.world().icon_size) / rt.world().icon_size);
	let rough_y: Value = round(round(pixel_y_offset, rt.world().icon_size) / rt.world().icon_size);
	if (!(_T = rt.getStep(f, AM, 0))) {
		return null;
	}
	let final_x: Value = _T.x + rough_x;
	let final_y: Value = _T.y + rough_y;
	if (!(final_x || final_y)) return f.dot;
	return rt.locate(final_x, final_y, _T.z);
});

// unsorted.dm:758
rt.def("/proc/get", function get(f: Frame, loc: Value, type: Value) {
	while (loc) {
		if (rt.op(f, "IsType", [], [loc, type])) {
			return loc;
		}
		loc = loc.loc;
	}
	return null;
});

// unsorted.dm:766
rt.def("/datum/controller/global_vars/proc/InitGlobalcan_embed_types", function InitGlobalcan_embed_types(f: Frame) {
	GLOB.can_embed_types = typecacheof(list(T("/obj/item/stack/rods"), T("/obj/item/pipe")));
	this.gvars_datum_init_order += "can_embed_types";
	return f.dot;
});

// unsorted.dm:771
rt.def("/proc/can_embed", function can_embed(f: Frame, W: Value) {
	if (W.is_sharp()) {
		return 1;
	}
	if (is_type_in_typecache(W, GLOB.pointed_types)) {
		return 1;
	}
	if (!is_type_in_typecache(W, GLOB.can_embed_types)) return f.dot;
	return 1;
});

// unsorted.dm:783
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS", function InitGlobalWALLITEMS(f: Frame) {
	GLOB.WALLITEMS = typecacheof(list(T("/obj/machinery/power/apc"), T("/obj/machinery/airalarm"), T("/obj/item/device/radio/intercom"), T("/obj/structure/extinguisher_cabinet"), T("/obj/structure/reagent_dispensers/peppertank"), T("/obj/machinery/status_display"), T("/obj/machinery/requests_console"), T("/obj/machinery/light_switch"), T("/obj/structure/sign"), T("/obj/machinery/newscaster"), T("/obj/machinery/firealarm"), T("/obj/structure/noticeboard"), T("/obj/machinery/button"), T("/obj/machinery/computer/security/telescreen"), T("/obj/machinery/embedded_controller/radio/simple_vent_controller"), T("/obj/item/weapon/storage/secure/safe"), T("/obj/machinery/door_timer"), T("/obj/machinery/flasher"), T("/obj/machinery/keycard_auth"), T("/obj/structure/mirror"), T("/obj/structure/fireaxecabinet"), T("/obj/machinery/computer/security/telescreen/entertainment"), T("/obj/structure/sign/picture_frame")));
	this.gvars_datum_init_order += "WALLITEMS";
	return f.dot;
});

// unsorted.dm:794
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS_EXTERNAL", function InitGlobalWALLITEMS_EXTERNAL(f: Frame) {
	GLOB.WALLITEMS_EXTERNAL = typecacheof(list(T("/obj/machinery/camera"), T("/obj/structure/camera_assembly"), T("/obj/structure/light_construct"), T("/obj/machinery/light")));
	this.gvars_datum_init_order += "WALLITEMS_EXTERNAL";
	return f.dot;
});

// unsorted.dm:798
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS_INVERSE", function InitGlobalWALLITEMS_INVERSE(f: Frame) {
	GLOB.WALLITEMS_INVERSE = typecacheof(list(T("/obj/structure/light_construct"), T("/obj/machinery/light")));
	this.gvars_datum_init_order += "WALLITEMS_INVERSE";
	return f.dot;
});

// unsorted.dm:803
rt.def("/proc/gotwallitem", function gotwallitem(f: Frame, loc: Value, dir: Value, check_external: Value) {
	let O: Value = null;
	check_external ??= 0;
	let locdir: Value = rt.getStep(f, loc, dir);
	for (O of each(loc, T("/obj"))) {
		if (is_type_in_typecache(O, GLOB.WALLITEMS) && check_external != 2) {
			if (is_type_in_typecache(O, GLOB.WALLITEMS_INVERSE)) {
				if (O.dir == turn(dir, 180)) {
					return 1;
				}
			} else if (O.dir == dir) {
				return 1;
			}
			if (get_turf_pixel(O) == locdir) {
				return 1;
			}
		}
		if (is_type_in_typecache(O, GLOB.WALLITEMS_EXTERNAL) && check_external) {
			if (is_type_in_typecache(O, GLOB.WALLITEMS_INVERSE)) {
				if (O.dir == turn(dir, 180)) {
					return 1;
				}
			} else if (O.dir == dir) {
				return 1;
			}
		}
	}
	O = null;
	for (O of each(locdir, T("/obj"))) {
		if (is_type_in_typecache(O, GLOB.WALLITEMS) && check_external != 2) {
			if (O.pixel_x == 0 && O.pixel_y == 0) {
				return 1;
			}
		}
	}
	return 0;
});

// unsorted.dm:833
rt.def("/proc/format_text", function format_text(f: Frame, text: Value) {
	return replacetext(replacetext(text, "ÿ\u0015", ""), "ÿ\u0016", "");
});

// unsorted.dm:836
rt.def("/obj/proc/atmosanalyzer_scan", function atmosanalyzer_scan(f: Frame, air_contents: Value, user: Value, target: Value) {
	let cached_gases: Value = null, id: Value = null, gas_concentration: Value = null;
	target ??= this;
	let icon: Value = target;
	user.visible_message(`${user} has used the analyzer on ${bicon(icon)} ${target}.`, `<span class='notice'>You use the analyzer on ${bicon(icon)} ${target}.</span>`);
	let pressure: Value = air_contents.return_pressure();
	let total_moles: Value = air_contents.total_moles();
	to_chat(user, `<span class='notice'>Results of analysis of ${bicon(icon)} ${target}.</span>`);
	if (total_moles > 0) {
		to_chat(user, `<span class='notice'>Pressure: ${round(pressure, 0.1)} kPa</span>`);
		cached_gases = air_contents.gases;
		for (id of each(cached_gases)) {
			gas_concentration = rt.index(rt.index(cached_gases, id), 1) / total_moles;
			if (rt.isIn(f, id, GLOB.hardcoded_gases) || gas_concentration > 0.001) {
				to_chat(user, `<span class='notice'>${rt.index(rt.index(rt.index(cached_gases, id), 3), 2)}: ${round(gas_concentration * 100, 0.01)} %</span>`);
			}
		}
		to_chat(user, `<span class='notice'>Temperature: ${round(air_contents.temperature - T0C)} &deg;C</span>`);
	} else {
		to_chat(user, `<span class='notice'>${target} is empty!</span>`);
	}
	return f.dot;
});

// unsorted.dm:872
rt.def("/proc/random_step", function* random_step(f: Frame, AM: Value, steps: Value, chance: Value) {
	let initial_chance: Value = chance;
	while (steps > 0) {
		if (prob(chance)) {
			yield* step(AM, pick(GLOB.alldirs));
		}
		chance = max(chance - initial_chance / steps, 0);
		steps--;
	}
	return f.dot;
}, true);

// unsorted.dm:881
rt.def("/proc/living_player_count", function living_player_count(f: Frame) {
	let mob: Value = null;
	let living_player_count: Value = 0;
	for (mob of each(GLOB.player_list)) {
		if (rt.isIn(f, mob, GLOB.living_mob_list)) {
			living_player_count += 1;
		}
	}
	return living_player_count;
});

// unsorted.dm:887
rt.def("/proc/randomColor", function randomColor(f: Frame, mode: Value) {
	mode ??= 0;
	if (mode === 0) {
		return pick("white", "black", "gray", "red", "green", "blue", "brown", "yellow", "orange", "darkred", "crimson", "lime", "darkgreen", "cyan", "navy", "teal", "purple", "indigo");
	} else if (mode === 1) {
		return pick("red", "green", "blue", "brown", "yellow", "orange", "darkred", "crimson", "lime", "darkgreen", "cyan", "navy", "teal", "purple", "indigo");
	} else {
		return "white";
	}
});

// unsorted.dm:898
rt.def("/proc/params2turf", function params2turf(f: Frame, scr_loc: Value, origin: Value, viewing_client: Value) {
	if (!scr_loc) {
		return null;
	}
	let actual_view: Value = getviewsize(viewing_client ? viewing_client.view : rt.world().view);
	let tX: Value = splittext(scr_loc, ",");
	let tY: Value = splittext(rt.index(tX, 2), ":");
	let tZ: Value = origin.z;
	tY = rt.index(tY, 1);
	tX = rt.index((tX = splittext(rt.index(tX, 1), ":")), 1);
	tX = max(1, min(origin.x + text2num(tX) - round(rt.index(actual_view, 1) / 2) - 1, rt.world().maxx));
	tY = max(1, min(origin.y + text2num(tY) - round(rt.index(actual_view, 2) / 2) - 1, rt.world().maxy));
	return rt.locate(tX, tY, tZ);
});

// unsorted.dm:925
rt.def("/proc/IsValidSrc", function IsValidSrc(f: Frame, D: Value) {
	if (rt.istype(D, T("/datum"))) {
		return (!(!D || D.gc_destroyed) ? 1 : 0);
	}
	return 0;
});

// unsorted.dm:979
rt.def("/proc/center_image", function center_image(f: Frame, I: Value, x_dimension: Value, y_dimension: Value) {
	x_dimension ??= 0;
	y_dimension ??= 0;
	if (!I) {
		return f.dot;
	}
	if (!x_dimension || !y_dimension) {
		return f.dot;
	}
	if (x_dimension == rt.world().icon_size && y_dimension == rt.world().icon_size) {
		return I;
	}
	let x_offset: Value = -(x_dimension / rt.world().icon_size - 1) * (rt.world().icon_size * 0.5);
	let y_offset: Value = -(y_dimension / rt.world().icon_size - 1) * (rt.world().icon_size * 0.5);
	if (x_dimension < rt.world().icon_size) {
		x_offset *= -1;
	}
	if (y_dimension < rt.world().icon_size) {
		y_offset *= -1;
	}
	I.pixel_x = x_offset;
	I.pixel_y = y_offset;
	return I;
});

// unsorted.dm:1007
rt.def("/proc/urange", function urange(f: Frame, dist: Value, center: Value, orange: Value, areas: Value) {
	let V: Value = null, _T: Value = null;
	dist ??= 0;
	center ??= f.usr;
	orange ??= 0;
	areas ??= 0;
	if (!dist) {
		if (!orange) {
			return list(center);
		}
		return list();
	}
	let turfs: Value = block(rt.locate(max(center.x - dist, 1), max(center.y - dist, 1), center.z), rt.locate(min(center.x + dist, rt.world().maxx), min(center.y + dist, rt.world().maxy), center.z));
	if (orange) {
		turfs -= rt.getStep(f, center, 0);
	}
	f.dot = list();
	for (V of each(turfs)) {
		f.dot += (_T = V);
		f.dot += _T.contents;
		if (areas) {
			(f.dot = rt.modify(f.dot, _T.loc, rt.bitOr));
		}
	}
	return f.dot;
});

// unsorted.dm:1026
rt.def("/proc/spiral_range", function spiral_range(f: Frame, dist: Value, center: Value, orange: Value) {
	let t_center: Value = null, _T: Value = null, y: Value = null, x: Value = null;
	let $e: any;
	dist ??= 0;
	center ??= f.usr;
	orange ??= 0;
	if (!dist) {
		if (!orange) {
			return list(center);
		}
		return list();
	}
	if (!(t_center = rt.getStep(f, center, 0))) {
		return list();
	}
	let L: Value = list();
	let c_dist: Value = 1;
	if (!orange) {
		L += t_center;
		L += t_center.contents;
	}
	while (c_dist <= dist) {
		y = t_center.y + c_dist;
		rt.forRange(f, 0, (x = t_center.x - c_dist + 1), t_center.x + c_dist, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
				L += _T.contents;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y + c_dist - 1;
		x = t_center.x + c_dist;
		rt.forRange(f, 0, t_center.y - c_dist, y, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
				L += _T.contents;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y - c_dist;
		x = t_center.x + c_dist - 1;
		rt.forRange(f, 0, t_center.x - c_dist, x, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
				L += _T.contents;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y - c_dist + 1;
		x = t_center.x - c_dist;
		rt.forRange(f, 0, y, t_center.y + c_dist, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
				L += _T.contents;
			}
		}
		rt.endFor(f, 0);
		c_dist++;
	}
	return L;
});

// unsorted.dm:1084
rt.def("/proc/spiral_range_turfs", function* spiral_range_turfs(f: Frame, dist: Value, center: Value, orange: Value, outlist: Value, tick_checked: Value) {
	let t_center: Value = null, _T: Value = null, y: Value = null, x: Value = null;
	let $e: any;
	dist ??= 0;
	center ??= f.usr;
	orange ??= 0;
	outlist ??= list();
	outlist.Cut();
	if (!dist) {
		return (outlist += center);
	}
	if (!(t_center = rt.getStep(f, center, 0))) {
		return outlist;
	}
	let L: Value = outlist;
	let c_dist: Value = 1;
	if (!orange) {
		L += t_center;
	}
	while (c_dist <= dist) {
		y = t_center.y + c_dist;
		rt.forRange(f, 0, (x = t_center.x - c_dist + 1), t_center.x + c_dist, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y + c_dist - 1;
		x = t_center.x + c_dist;
		rt.forRange(f, 0, t_center.y - c_dist, y, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y - c_dist;
		x = t_center.x + c_dist - 1;
		rt.forRange(f, 0, t_center.x - c_dist, x, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
			}
		}
		rt.endFor(f, 0);
		y = t_center.y - c_dist + 1;
		x = t_center.x - c_dist;
		rt.forRange(f, 0, y, t_center.y + c_dist, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (_T = rt.locate(x, y, t_center.z)) {
				L += _T;
			}
		}
		rt.endFor(f, 0);
		c_dist++;
		if (tick_checked) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
	}
	return L;
}, true);

// unsorted.dm:1137
rt.def("/atom/proc/contains", function contains(f: Frame, A: Value) {
	if (!A) {
		return 0;
	}
	let location: Value = A.loc;
	while (location) {
		if (location == this) {
			return 1;
		}
		location = location.loc;
	}
	return f.dot;
});

// unsorted.dm:1145
rt.def("/proc/flick_overlay_static", function* flick_overlay_static(f: Frame, O: Value, A: Value, duration: Value) {
	if (!A || !O) {
		return f.dot;
	}
	A.add_overlay(O);
	yield* sleep(duration);
	A.cut_overlay(O);
	return f.dot;
}, true, { waitfor: false });

// unsorted.dm:1152
rt.def("/proc/get_areas_in_z", function get_areas_in_z(f: Frame, zlevel: Value) {
	let V: Value = null, A: Value = null, _T: Value = null;
	f.dot = list();
	let validarea: Value = 0;
	for (V of each(GLOB.sortedAreas)) {
		A = V;
		validarea = 1;
		_T = null;
		for (_T of each(A, T("/turf"))) {
			if (_T.z != zlevel) {
				validarea = 0;
				break;
			}
		}
		if (validarea) {
			f.dot += A;
		}
	}
	return f.dot;
});

// unsorted.dm:1167
rt.def("/proc/get_closest_atom", function get_closest_atom(f: Frame, type: Value, list: Value, source: Value) {
	let closest_atom: Value = null, closest_distance: Value = null, A: Value = null, distance: Value = null;
	for (A of each(list)) {
		if (!rt.op(f, "IsType", [], [A, type])) {
			continue;
		}
		distance = get_dist(source, A);
		if (!closest_atom) {
			closest_distance = distance;
			closest_atom = A;
		} else if (closest_distance > distance) {
			closest_distance = distance;
			closest_atom = A;
		}
	}
	return closest_atom;
});

// unsorted.dm:1182
rt.def("/proc/pick_closest_path", function* pick_closest_path(f: Frame, value: Value, matches: Value) {
	let chosen: Value = null;
	matches ??= get_fancy_list_of_atom_types();
	if (value == 0) {
		if ((value = (yield* g.op(f, "Prompt", [3], [null, null, "Search for type", "Enter type to find (blank for all, cancel to cancel)", null]))) === null) {
			return f.dot;
		}
	}
	if ((value = trim(value)) !== null && value != "") {
		matches = filter_fancy_list(matches, value);
	}
	if (rt.len(f, matches) == 0) {
		return f.dot;
	}
	if (rt.len(f, matches) == 1) {
		chosen = rt.index(matches, 1);
	} else if (!(chosen = (yield* g.op(f, "Prompt", [1], [null, rt.index(matches, 1), "Pick Type", "Select a type", matches])))) {
		return f.dot;
	}
	return (chosen = rt.index(matches, chosen));
}, true);

// unsorted.dm:1205
rt.def("/proc/stack_trace", function stack_trace(f: Frame, msg: Value) {
	CRASH(msg);
	return f.dot;
});

// unsorted.dm:1214
rt.def("/proc/stoplag", function* stoplag(f: Frame) {
	if (!GLOB.Master || !rt.bitAnd(GLOB.Master.current_runlevel, RUNLEVELS_DEFAULT)) {
		yield* sleep(rt.world().tick_lag);
		return 1;
	}
	f.dot = 0;
	let i: Value = 1;
	while (true) {
		f.dot += round(i * max(max(rt.tickUsage(f), rt.world().cpu) / 100 * max(GLOB.Master.sleep_delta, 1), 1));
		yield* sleep(i * rt.world().tick_lag * max(max(rt.tickUsage(f), rt.world().cpu) / 100 * max(GLOB.Master.sleep_delta, 1), 1));
		i *= 2;
		if (!(rt.tickUsage(f) > min(TICK_LIMIT_TO_RUN, GLOB.current_ticklimit))) break;
	}
	return f.dot;
}, true);

// unsorted.dm:1229
rt.def("/proc/flash_color", function flash_color(f: Frame, mob_or_client: Value, flash_color: Value, flash_time: Value) {
	let C: Value = null, M: Value = null;
	flash_color ??= "#960000";
	flash_time ??= 20;
	if (ismob(mob_or_client)) {
		if ((M = mob_or_client).client) {
			C = M.client;
		} else {
			return f.dot;
		}
	} else if (rt.istype(mob_or_client, T("/client"))) {
		C = mob_or_client;
	}
	if (!rt.istype(C, T("/client"))) {
		return f.dot;
	}
	C.color = flash_color;
	rt.op(f, "Animate", [2, 6], [null, C, "color", rt.initial(f, C, "color"), "time", flash_time]);
	return f.dot;
});

// unsorted.dm:1254
rt.def("/proc/______qdel_list_wrapper", function* ______qdel_list_wrapper(f: Frame, L: Value) {
	let I: Value = null;
	if (!L) return f.dot;
	for (I of each(L)) {
		yield* qdel(I);
	}
	L.Cut();
	return f.dot;
}, true, { argTypes: [{ path: "/list" }] });

// unsorted.dm:1259
rt.def("/proc/random_nukecode", function random_nukecode(f: Frame) {
	let val: Value = rand(0, 99999);
	let str: Value = `${val}`;
	while (rt.length(str) < 5) {
		str = "0" + str;
	}
	f.dot = str;
	return f.dot;
});

// unsorted.dm:1266
rt.def("/atom/proc/Shake", function Shake(f: Frame, pixelshiftx: Value, pixelshifty: Value, duration: Value) {
	pixelshiftx ??= 15;
	pixelshifty ??= 15;
	duration ??= 250;
	let initialpixelx: Value = this.pixel_x;
	let initialpixely: Value = this.pixel_y;
	let shiftx: Value = rand(-pixelshiftx, pixelshiftx);
	let shifty: Value = rand(-pixelshifty, pixelshifty);
	rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", this.pixel_x + shiftx, "pixel_y", this.pixel_y + shifty, "time", 0.2, "loop", duration]);
	this.pixel_x = initialpixelx;
	this.pixel_y = initialpixely;
	return f.dot;
});

// unsorted.dm:1275
rt.def("/proc/weightclass2text", function weightclass2text(f: Frame, w_class: Value) {
	if (w_class === WEIGHT_CLASS_TINY) {
		f.dot = "tiny";
	} else if (w_class === WEIGHT_CLASS_SMALL) {
		f.dot = "small";
	} else if (w_class === WEIGHT_CLASS_NORMAL) {
		f.dot = "normal-sized";
	} else if (w_class === WEIGHT_CLASS_BULKY) {
		f.dot = "bulky";
	} else if (w_class === WEIGHT_CLASS_HUGE) {
		f.dot = "huge";
	} else if (w_class === WEIGHT_CLASS_GIGANTIC) {
		f.dot = "gigantic";
	} else {
		f.dot = "";
	}
	return f.dot;
});

// unsorted.dm:1291
rt.def("/datum/controller/global_vars/proc/InitGlobaldview_mob", function* InitGlobaldview_mob(f: Frame) {
	GLOB.dview_mob = (yield* new_(T("/mob/dview")));
	this.gvars_datum_init_order += "dview_mob";
	return f.dot;
}, true);

// unsorted.dm:1295
rt.def("/proc/dview", function dview(f: Frame, range: Value, center: Value, invis_flags: Value) {
	range ??= rt.world().view;
	invis_flags ??= 0;
	if (!center) {
		return f.dot;
	}
	GLOB.dview_mob.loc = center;
	GLOB.dview_mob.see_invisible = invis_flags;
	f.dot = view(range, GLOB.dview_mob);
	GLOB.dview_mob.loc = null;
	return f.dot;
});

rt.type(5094, "/mob/dview", "/mob", {
	ready_to_die: 0,
	anchored: 1,
	name: "INTERNAL DVIEW MOB",
	invisibility: 101,
	density: 0,
	see_in_dark: 1000000,
});

// unsorted.dm:1314
rt.def("/mob/dview/proc/Destroy", function* Destroy(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (!this.ready_to_die) {
		stack_trace("ALRIGHT WHICH FUCKER TRIED TO DELETE *MY* DVIEW?");
		if (!f.args[0]) {
			return QDEL_HINT_LETMELIVE;
		}
		log_world("EVACUATE THE SHITCODE IS TRYING TO STEAL MUH JOBS");
		GLOB.dview_mob = (yield* new_(T("/mob/dview")));
	}
	return (yield* parent_proc());
}, true, { args: ["force"] });

// unsorted.dm:1334
rt.def("/proc/valid_window_location", function valid_window_location(f: Frame, _T: Value, dir_to_check: Value) {
	let O: Value = null, W: Value = null;
	if (!_T) {
		return 0;
	}
	for (O of each(_T, T("/obj"))) {
		if (rt.istype(O, T("/obj/machinery/door/window")) && (O.dir == dir_to_check || dir_to_check == 5)) {
			return 0;
		}
		if (rt.istype(O, T("/obj/structure/windoor_assembly"))) {
			if ((W = O).ini_dir == dir_to_check || dir_to_check == 5) {
				return 0;
			}
		}
		if (rt.istype(O, T("/obj/structure/window"))) {
			if ((W = O).ini_dir == dir_to_check || W.ini_dir == 5 || dir_to_check == 5) {
				return 0;
			}
		}
	}
	return 1;
});

// unsorted.dm:1414
rt.def("/proc/get_mob_or_brainmob", function get_mob_or_brainmob(f: Frame, occupant: Value) {
	let mob_occupant: Value = null, head: Value = null, brain: Value = null;
	if (rt.istype(occupant, T("/mob/living"))) {
		mob_occupant = occupant;
	} else if (rt.istype(occupant, T("/obj/item/bodypart"))) {
		mob_occupant = (head = occupant).brainmob;
	} else if (rt.istype(occupant, T("/obj/item/organ"))) {
		mob_occupant = (brain = occupant).brainmob;
	}
	return mob_occupant;
});

// unsorted.dm:1431
rt.def("/proc/BitCount", function BitCount(f: Frame, bitfield: Value) {
	let temp: Value = null;
	return (temp = rt.bitAnd((temp = bitfield - rt.bitAnd(rt.shiftRight(bitfield, 1), 46811) - rt.bitAnd(rt.shiftRight(bitfield, 2), 37449)) + rt.shiftRight(temp, 3), 29127) % 63);
});
