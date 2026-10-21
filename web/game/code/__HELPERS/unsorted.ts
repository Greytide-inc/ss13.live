// From code/__HELPERS/unsorted.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/invertHTML  (code/__HELPERS/unsorted.dm:10)
rt.def("/proc/invertHTML", function invertHTML(f: Frame, HTMLstring: Value) {
	let textr: Value = null, textg: Value = null, textb: Value = null, r: Value = null, _g: Value = null, b: Value = null;
	f.vars = () => [textr, textg, textb, r, _g, b];
	if (!truthy(rt.call(f, P("/proc/istext"), null, [live(HTMLstring)]))) {
		rt.call(f, P("/proc/CRASH"), null, ["Given non-text argument!"]);
		return live(f.dot);
	} else {
		if (!isEqual(rt.length(live(HTMLstring)), 7)) {
			rt.call(f, P("/proc/CRASH"), null, ["Given non-HTML argument!"]);
			return live(f.dot);
		}
	}
	textr = rt.call(f, P("/proc/copytext"), null, [live(HTMLstring), 2, 4]);
	textg = rt.call(f, P("/proc/copytext"), null, [live(HTMLstring), 4, 6]);
	textb = rt.call(f, P("/proc/copytext"), null, [live(HTMLstring), 6, 8]);
	r = rt.call(f, P("/proc/hex2num"), null, [live(textr)]);
	_g = rt.call(f, P("/proc/hex2num"), null, [live(textg)]);
	b = rt.call(f, P("/proc/hex2num"), null, [live(textb)]);
	textr = rt.call(f, P("/proc/num2hex"), null, [subtract(255, live(r)), 2]);
	textg = rt.call(f, P("/proc/num2hex"), null, [subtract(255, live(_g)), 2]);
	textb = rt.call(f, P("/proc/num2hex"), null, [subtract(255, live(b)), 2]);
	return fmt("#＀＀＀", [live(textr), live(textg), live(textb)]);
	return live(f.dot);
});

// /proc/Get_Angle  (code/__HELPERS/unsorted.dm:30)
rt.def("/proc/Get_Angle", function Get_Angle(f: Frame, start: Value, end: Value) {
	let dy: Value = null, dx: Value = null;
	let $0: any;
	f.vars = () => [dy, dx, $0];
	if ((!truthy(live(start)) || !truthy(live(end)))) {
		return 0;
	}
	dy = null;
	dx = null;
	dy = subtract(add(multiply(32, rt.fv(f, "y", live(end))), rt.fv(f, "pixel_y", live(end))), add(multiply(32, rt.fv(f, "y", live(start))), rt.fv(f, "pixel_y", live(start))));
	dx = subtract(add(multiply(32, rt.fv(f, "x", live(end))), rt.fv(f, "pixel_x", live(end))), add(multiply(32, rt.fv(f, "x", live(start))), rt.fv(f, "pixel_x", live(start))));
	if (!truthy(live(dy))) {
		if (rt.ge(live(dx), 0)) {
			$0 = 90;
		} else {
			$0 = 270;
		}
		return $0;
	}
	f.dot = rt.op(f, "ArcTan", [], [divide(live(dx), live(dy))]);
	if (rt.lt(live(dy), 0)) {
		f.dot = rt.modify(live(f.dot), 180, add);
	} else {
		if (!rt.lt(live(dx), 0)) return f.dot;
		f.dot = rt.modify(live(f.dot), 360, add);
	}
	return f.dot;
});

// /proc/get_teleport_loc  (code/__HELPERS/unsorted.dm:65)
rt.def("/proc/get_teleport_loc", function get_teleport_loc(f: Frame, location: Value, target: Value, distance: Value, density: Value, errorx: Value, errory: Value, eoffsetx: Value, eoffsety: Value) {
	let dirx: Value = null, diry: Value = null, xoffset: Value = null, yoffset: Value = null, b1xerror: Value = null, b1yerror: Value = null, b2xerror: Value = null, b2yerror: Value = null, destination: Value = null, destination_list: Value = null, center: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [distance, density, errorx, errory, eoffsetx, eoffsety, dirx, diry, xoffset, yoffset, b1xerror, b1yerror, b2xerror, b2yerror, destination, destination_list, center, _T, $0, $e];
	if (live(distance) === null) {
		distance = 1;
	}
	if (live(density) === null) {
		density = 0;
	}
	if (live(errorx) === null) {
		errorx = 0;
	}
	if (live(errory) === null) {
		errory = 0;
	}
	if (live(eoffsetx) === null) {
		eoffsetx = 0;
	}
	if (live(eoffsety) === null) {
		eoffsety = 0;
	}
	dirx = 0;
	diry = 0;
	xoffset = 0;
	yoffset = 0;
	b1xerror = 0;
	b1yerror = 0;
	b2xerror = 0;
	b2yerror = 0;
	errorx = rt.op(f, "Abs", [], [live(errorx)]);
	errory = rt.op(f, "Abs", [], [live(errory)]);
	$0 = rt.fv(f, "dir", live(target));
	if ($0 === 1) {
		diry = rt.modify(live(diry), live(distance), add);
		yoffset = rt.modify(live(yoffset), live(eoffsety), add);
		xoffset = rt.modify(live(xoffset), live(eoffsetx), add);
		(b1xerror = rt.modify(live(b1xerror), live(errorx), subtract));
		(b1yerror = rt.modify(live(b1yerror), live(errory), subtract));
		b2xerror = rt.modify(live(b2xerror), live(errorx), add);
		b2yerror = rt.modify(live(b2yerror), live(errory), add);
	} else if ($0 === 2) {
		(diry = rt.modify(live(diry), live(distance), subtract));
		(yoffset = rt.modify(live(yoffset), live(eoffsety), subtract));
		xoffset = rt.modify(live(xoffset), live(eoffsetx), add);
		(b1xerror = rt.modify(live(b1xerror), live(errorx), subtract));
		(b1yerror = rt.modify(live(b1yerror), live(errory), subtract));
		b2xerror = rt.modify(live(b2xerror), live(errorx), add);
		b2yerror = rt.modify(live(b2yerror), live(errory), add);
	} else if ($0 === 4) {
		dirx = rt.modify(live(dirx), live(distance), add);
		yoffset = rt.modify(live(yoffset), live(eoffsetx), add);
		xoffset = rt.modify(live(xoffset), live(eoffsety), add);
		(b1xerror = rt.modify(live(b1xerror), live(errory), subtract));
		(b1yerror = rt.modify(live(b1yerror), live(errorx), subtract));
		b2xerror = rt.modify(live(b2xerror), live(errory), add);
		b2yerror = rt.modify(live(b2yerror), live(errorx), add);
	} else if ($0 === 8) {
		(dirx = rt.modify(live(dirx), live(distance), subtract));
		(yoffset = rt.modify(live(yoffset), live(eoffsetx), subtract));
		xoffset = rt.modify(live(xoffset), live(eoffsety), add);
		(b1xerror = rt.modify(live(b1xerror), live(errory), subtract));
		(b1yerror = rt.modify(live(b1yerror), live(errorx), subtract));
		b2xerror = rt.modify(live(b2xerror), live(errory), add);
		b2yerror = rt.modify(live(b2yerror), live(errorx), add);
	}
	if (truthy((destination = rt.locate(add(rt.fv(f, "x", live(location)), live(dirx)), add(rt.fv(f, "y", live(location)), live(diry)), rt.fv(f, "z", live(location)))))) {
		if ((truthy(live(errorx)) || truthy(live(errory)))) {
			destination_list = rt.list();
			center = rt.locate(add(rt.fv(f, "x", live(destination)), live(xoffset)), add(rt.fv(f, "y", live(destination)), live(yoffset)), rt.fv(f, "z", live(location)));
			_T = null;
			rt.forList(f, 0, rt.call(f, P("/proc/block"), null, [rt.locate(add(rt.fv(f, "x", live(center)), live(b1xerror)), add(rt.fv(f, "y", live(center)), live(b1yerror)), rt.fv(f, "z", live(location))), rt.locate(add(rt.fv(f, "x", live(center)), live(b2xerror)), add(rt.fv(f, "y", live(center)), live(b2yerror)), rt.fv(f, "z", live(location)))]), T("/turf"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				if ((truthy(live(density)) && truthy(rt.fv(f, "density", live(_T))))) {
					continue;
				}
				if ((rt.gt(rt.fv(f, "x", live(_T)), rt.fv(f, "maxx", rt.world())) || rt.lt(rt.fv(f, "x", live(_T)), 1))) {
					continue;
				}
				if ((rt.gt(rt.fv(f, "y", live(_T)), rt.fv(f, "maxy", rt.world())) || rt.lt(rt.fv(f, "y", live(_T)), 1))) {
					continue;
				}
				destination_list = rt.modify(live(destination_list), live(_T), add);
			}
			rt.endFor(f, 0);
			if (truthy(rt.len(f, live(destination_list)))) {
				destination = rt.op(f, "PickUnweighted", [1], [live(destination_list)]);
			} else {
				return live(f.dot);
			}
		} else {
			if ((truthy(live(density)) && truthy(rt.fv(f, "density", live(destination))))) {
				return live(f.dot);
			}
			if ((rt.gt(rt.fv(f, "x", live(destination)), rt.fv(f, "maxx", rt.world())) || rt.lt(rt.fv(f, "x", live(destination)), 1))) {
				return live(f.dot);
			}
			if ((rt.gt(rt.fv(f, "y", live(destination)), rt.fv(f, "maxy", rt.world())) || rt.lt(rt.fv(f, "y", live(destination)), 1))) {
				return live(f.dot);
			}
		}
	} else {
		return live(f.dot);
	}
	return live(destination);
});

// /proc/getline  (code/__HELPERS/unsorted.dm:147)
rt.def("/proc/getline", function getline(f: Frame, M: Value, N: Value) {
	let px: Value = null, py: Value = null, line: Value = null, dx: Value = null, dy: Value = null, dxabs: Value = null, dyabs: Value = null, sdx: Value = null, sdy: Value = null, x: Value = null, y: Value = null, j: Value = null;
	f.vars = () => [px, py, line, dx, dy, dxabs, dyabs, sdx, sdy, x, y, j];
	px = rt.fv(f, "x", live(M));
	py = rt.fv(f, "y", live(M));
	line = rt.list(rt.locate(live(px), live(py), rt.fv(f, "z", live(M))));
	dx = subtract(rt.fv(f, "x", live(N)), live(px));
	dy = subtract(rt.fv(f, "y", live(N)), live(py));
	dxabs = rt.op(f, "Abs", [], [live(dx)]);
	dyabs = rt.op(f, "Abs", [], [live(dy)]);
	sdx = rt.call(f, P("/proc/sign"), null, [live(dx)]);
	sdy = rt.call(f, P("/proc/sign"), null, [live(dy)]);
	x = rt.shiftRight(live(dxabs), 1);
	y = rt.shiftRight(live(dyabs), 1);
	j = null;
	if (rt.ge(live(dxabs), live(dyabs))) {
		j = 0;
		while (rt.lt(live(j), live(dxabs))) {
			if (rt.ge((y = rt.modify(live(y), live(dyabs), add)), live(dxabs))) {
				(y = rt.modify(live(y), live(dxabs), subtract));
				py = rt.modify(live(py), live(sdy), add);
			}
			line = rt.modify(live(line), rt.locate((px = rt.modify(live(px), live(sdx), add)), live(py), rt.fv(f, "z", live(M))), add);
			j = rt.inc(live(j), 1);
		}
	} else {
		j = 0;
		while (rt.lt(live(j), live(dyabs))) {
			if (rt.ge((x = rt.modify(live(x), live(dxabs), add)), live(dyabs))) {
				(x = rt.modify(live(x), live(dyabs), subtract));
				px = rt.modify(live(px), live(sdx), add);
			}
			py = rt.modify(live(py), live(sdy), add);
			line = rt.modify(live(line), rt.locate(live(px), live(py), rt.fv(f, "z", live(M))), add);
			j = rt.inc(live(j), 1);
		}
	}
	return live(line);
});

// /proc/IsGuestKey  (code/__HELPERS/unsorted.dm:177)
rt.def("/proc/IsGuestKey", function IsGuestKey(f: Frame, key: Value) {
	let i: Value = null, ch: Value = null, len: Value = null;
	f.vars = () => [i, ch, len];
	if (!isEqual(rt.call(f, P("/proc/findtext"), null, [live(key), "Guest-", 1, 7]), 1)) {
		return 0;
	}
	i = null;
	ch = null;
	len = rt.length(live(key));
	i = 7;
	while (rt.le(live(i), live(len))) {
		if ((rt.lt((ch = rt.call(f, P("/proc/text2ascii"), null, [live(key), live(i)])), 48) || rt.gt(live(ch), 57))) {
			return 0;
		}
		i = rt.inc(live(i), 1);
	}
	return 1;
});

// /mob/proc/rename_self  (code/__HELPERS/unsorted.dm:190)  may sleep
rt.def("/mob/proc/rename_self", function* rename_self(f: Frame, role: Value, C: Value) {
	let oldname: Value = null, newname: Value = null, loop: Value = null, safety: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [role, C, oldname, newname, loop, safety, M, $0, $e];
	if (!truthy(live(C))) {
		C = rt.sv(f, "client");
	}
	oldname = rt.sv(f, "real_name");
	newname = null;
	loop = 1;
	safety = 0;
	while (truthy(live(loop)) && rt.lt(live(safety), 5)) {
		if (((truthy(live(C)) && truthy(rt.index(rt.gv(f, "custom_names", rt.fv(f, "prefs", live(C))), live(role)))) && !truthy(live(safety)))) {
			newname = rt.index(rt.gv(f, "custom_names", rt.fv(f, "prefs", live(C))), live(role));
		} else {
			$0 = live(role);
			if ($0 === "clown") {
				newname = rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")]);
			} else if ($0 === "mime") {
				newname = rt.op(f, "PickUnweighted", [1], [rt.gl("mime_names")]);
			} else if ($0 === "ai") {
				newname = rt.op(f, "PickUnweighted", [1], [rt.gl("ai_names")]);
			} else if ($0 === "deity") {
				newname = rt.op(f, "PickUnweighted", [1], [rt.bitOr(rt.bitOr(rt.gl("clown_names"), rt.gl("ai_names")), rt.gl("mime_names"))]);
			} else {
				return live(f.dot);
			}
		}
		M = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if (isEqual(live(M), live(f.src))) {
				continue;
			}
			if ((!truthy(live(newname)) || isEqual(rt.fv(f, "real_name", live(M)), live(newname)))) {
				newname = null;
				loop = rt.inc(live(loop), 1);
				break;
			}
		}
		rt.endFor(f, 0);
		loop = rt.inc(live(loop), -1);
		safety = rt.inc(live(safety), 1);
	}
	if (!truthy(live(newname))) return f.dot;
	yield* g.srcCall(f, "fully_replace_character_name", live(oldname), live(newname));
	return f.dot;
}, true);

// /proc/ionnum  (code/__HELPERS/unsorted.dm:229)
rt.def("/proc/ionnum", function ionnum(f: Frame) {
	return fmt("＀＀＀＀", [rt.op(f, "PickUnweighted", [7], ["!", "@", "#", "$", "%", "^", "&"]), rt.op(f, "PickUnweighted", [8], ["!", "@", "#", "$", "%", "^", "&", "*"]), rt.op(f, "PickUnweighted", [8], ["!", "@", "#", "$", "%", "^", "&", "*"]), rt.op(f, "PickUnweighted", [8], ["!", "@", "#", "$", "%", "^", "&", "*"])]);
});

// /proc/active_free_borgs  (code/__HELPERS/unsorted.dm:233)
rt.def("/proc/active_free_borgs", function active_free_borgs(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	f.dot = rt.list();
	R = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((truthy(rt.fv(f, "connected_ai", live(R))) || truthy(rt.fv(f, "shell", live(R))))) {
			continue;
		}
		if (isEqual(rt.fv(f, "stat", live(R)), 2)) {
			continue;
		}
		if (((truthy(rt.fv(f, "emagged", live(R))) || truthy(rt.fv(f, "scrambledcodes", live(R)))) || truthy(rt.fv(f, "syndicate", live(R))))) {
			continue;
		}
		f.dot = rt.modify(live(f.dot), live(R), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/active_ais  (code/__HELPERS/unsorted.dm:245)
rt.def("/proc/active_ais", function active_ais(f: Frame, check_mind: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [check_mind, A, $e];
	if (live(check_mind) === null) {
		check_mind = 0;
	}
	f.dot = rt.list();
	A = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "stat", live(A)), 2)) {
			continue;
		}
		if (isEqual(rt.fv(f, "control_disabled", live(A)), 1)) {
			continue;
		}
		if (truthy(live(check_mind))) {
			if (!truthy(rt.fv(f, "mind", live(A)))) {
				continue;
			}
		}
		f.dot = rt.modify(live(f.dot), live(A), add);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});

// /proc/select_active_ai_with_fewest_borgs  (code/__HELPERS/unsorted.dm:260)
rt.def("/proc/select_active_ai_with_fewest_borgs", function select_active_ai_with_fewest_borgs(f: Frame) {
	let selected: Value = null, active: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [selected, active, A, $e];
	selected = null;
	active = rt.call(f, P("/proc/active_ais"), null, []);
	A = null;
	rt.forList(f, 0, live(active), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((!truthy(live(selected)) || rt.gt(rt.getLen(f, rt.fv(f, "connected_robots", live(selected))), rt.getLen(f, rt.fv(f, "connected_robots", live(A)))))) {
			selected = live(A);
		}
	}
	rt.endFor(f, 0);
	return live(selected);
});

// /proc/select_active_free_borg  (code/__HELPERS/unsorted.dm:268)  may sleep
rt.def("/proc/select_active_free_borg", function* select_active_free_borg(f: Frame, user: Value) {
	let borgs: Value = null;
	f.vars = () => [user, borgs];
	if (truthy(rt.getLen(f, (borgs = (yield* g.call(f, P("/proc/active_free_borgs"), null, [])))))) {
		if (truthy(live(user))) {
			f.dot = (yield* g.op(f, "Prompt", [0], [rt.index(live(borgs), 1), "Cyborg Selection", "Unshackled cyborg signals detected:", live(user), live(borgs)]));
		} else {
			f.dot = rt.op(f, "PickUnweighted", [1], [live(borgs)]);
		}
	}
	return live(f.dot);
}, true);

// /proc/select_active_ai  (code/__HELPERS/unsorted.dm:277)  may sleep
rt.def("/proc/select_active_ai", function* select_active_ai(f: Frame, user: Value) {
	let ais: Value = null;
	f.vars = () => [user, ais];
	if (truthy(rt.getLen(f, (ais = (yield* g.call(f, P("/proc/active_ais"), null, [])))))) {
		if (truthy(live(user))) {
			f.dot = (yield* g.op(f, "Prompt", [0], [rt.index(live(ais), 1), "AI Selection", "AI signals detected:", live(user), live(ais)]));
		} else {
			f.dot = rt.op(f, "PickUnweighted", [1], [live(ais)]);
		}
	}
	return live(f.dot);
}, true);

// /proc/getpois  (code/__HELPERS/unsorted.dm:287)  may sleep
rt.def("/proc/getpois", function* getpois(f: Frame, mobs_only: Value, skip_mindless: Value) {
	let mobs: Value = null, namecounts: Value = null, pois: Value = null, M: Value = null, name: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [mobs_only, skip_mindless, mobs, namecounts, pois, M, name, A, $e];
	if (live(mobs_only) === null) {
		mobs_only = 0;
	}
	if (live(skip_mindless) === null) {
		skip_mindless = 0;
	}
	mobs = (yield* g.call(f, P("/proc/sortmobs"), null, []));
	namecounts = rt.list();
	pois = rt.list();
	M = null;
	rt.forList(f, 0, live(mobs), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(live(skip_mindless)) && (!truthy(rt.fv(f, "mind", live(M))) && !truthy(rt.fv(f, "ckey", live(M)))))) {
			if ((!truthy((rt.istype(live(M), T("/mob/living/simple_animal/bot")) ? 1 : 0)) && !truthy((rt.istype(live(M), T("/mob/camera")) ? 1 : 0)))) {
				continue;
			}
		}
		if (((truthy(rt.fv(f, "client", live(M))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(M))))) && truthy(rt.gv(f, "fakekey", rt.gv(f, "holder", rt.fv(f, "client", live(M))))))) {
			continue;
		}
		name = (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "name", live(M)), live(namecounts)]));
		if ((truthy(rt.fv(f, "real_name", live(M))) && !isEqual(rt.fv(f, "real_name", live(M)), rt.fv(f, "name", live(M))))) {
			name = rt.modify(live(name), fmt(" [＀]", [rt.fv(f, "real_name", live(M))]), add);
		}
		if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
			if (truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0))) {
				name = rt.modify(live(name), " [ghost]", add);
			} else {
				name = rt.modify(live(name), " [dead]", add);
			}
		}
		rt.setAt(live(pois), live(name), live(M));
	}
	rt.endFor(f, 0);
	if (!truthy(live(mobs_only))) {
		A = null;
		rt.forList(f, 0, rt.gl("poi_list"), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if ((!truthy(live(A)) || !truthy(rt.fv(f, "loc", live(A))))) {
				continue;
			}
			rt.setAt(live(pois), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "name", live(A)), live(namecounts)])), live(A));
		}
		rt.endFor(f, 0);
	}
	return live(pois);
}, true);

// /proc/sortmobs  (code/__HELPERS/unsorted.dm:316)  may sleep
rt.def("/proc/sortmobs", function* sortmobs(f: Frame) {
	let moblist: Value = null, sortmob: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [moblist, sortmob, M, $e];
	moblist = rt.list();
	sortmob = (yield* g.call(f, P("/proc/sortNames"), null, [rt.gl("mob_list")]));
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/silicon/pai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/silicon/robot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/brain"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/carbon/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/carbon/monkey"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/simple_animal/slime"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/simple_animal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, live(sortmob), T("/mob/living/carbon/true_devil"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(moblist), "Add", [live(M)]);
	}
	rt.endFor(f, 0);
	return live(moblist);
}, true);

// /proc/convert2energy  (code/__HELPERS/unsorted.dm:352)
rt.def("/proc/convert2energy", function convert2energy(f: Frame, M: Value) {
	let E: Value = null;
	f.vars = () => [E];
	return (E = multiply(live(M), 90000000305594370));
});

// /proc/convert2mass  (code/__HELPERS/unsorted.dm:357)
rt.def("/proc/convert2mass", function convert2mass(f: Frame, E: Value) {
	let M: Value = null;
	f.vars = () => [M];
	return (M = divide(live(E), 90000000305594370));
});

// /proc/key_name  (code/__HELPERS/unsorted.dm:366)
rt.def("/proc/key_name", function key_name(f: Frame, whom: Value, include_link: Value, include_name: Value) {
	let M: Value = null, C: Value = null, key: Value = null, ckey: Value = null;
	f.vars = () => [include_link, include_name, M, C, key, ckey];
	if (live(include_link) === null) {
		include_link = null;
	}
	if (live(include_name) === null) {
		include_name = 1;
	}
	M = null;
	C = null;
	key = null;
	ckey = null;
	if (!truthy(live(whom))) {
		return "*null*";
	}
	if (truthy((rt.istype(live(whom), T("/client")) ? 1 : 0))) {
		M = rt.gv(f, "mob", (C = live(whom)));
		key = rt.fv(f, "key", live(C));
		ckey = rt.fv(f, "ckey", live(C));
	} else {
		if (truthy(rt.call(f, P("/proc/ismob"), null, [live(whom)]))) {
			C = rt.gv(f, "client", (M = live(whom)));
			key = rt.fv(f, "key", live(M));
			ckey = rt.fv(f, "ckey", live(M));
		} else {
			if (truthy(rt.call(f, P("/proc/istext"), null, [live(whom)]))) {
				key = live(whom);
				ckey = rt.call(f, P("/proc/ckey"), null, [live(whom)]);
				if (truthy((C = rt.index(rt.gl("directory"), live(ckey))))) {
					M = rt.fv(f, "mob", live(C));
				}
			} else {
				return "*invalid*";
			}
		}
	}
	f.dot = "";
	if (!truthy(live(ckey))) {
		include_link = 0;
	}
	if (truthy(live(key))) {
		if ((((truthy(live(C)) && truthy(rt.fv(f, "holder", live(C)))) && truthy(rt.gv(f, "fakekey", rt.fv(f, "holder", live(C))))) && !truthy(live(include_name)))) {
			if (truthy(live(include_link))) {
				f.dot = rt.modify(live(f.dot), fmt("<a href='?priv_msg=＀'>", [rt.callName(f, live(C), "findStealthKey", [])]), add);
			}
			f.dot = rt.modify(live(f.dot), "Administrator", add);
		} else {
			if (truthy(live(include_link))) {
				f.dot = rt.modify(live(f.dot), fmt("<a href='?priv_msg=＀'>", [live(ckey)]), add);
			}
			f.dot = rt.modify(live(f.dot), live(key), add);
		}
		if (!truthy(live(C))) {
			f.dot = rt.modify(live(f.dot), "[DC]", add);
		}
		if (truthy(live(include_link))) {
			f.dot = rt.modify(live(f.dot), "</a>", add);
		}
	} else {
		f.dot = rt.modify(live(f.dot), "*no key*", add);
	}
	if ((truthy(live(include_name)) && truthy(live(M)))) {
		if (truthy(rt.fv(f, "real_name", live(M)))) {
			f.dot = rt.modify(live(f.dot), fmt("/(＀)", [rt.fv(f, "real_name", live(M))]), add);
		} else {
			if (truthy(rt.fv(f, "name", live(M)))) {
				f.dot = rt.modify(live(f.dot), fmt("/(＀)", [rt.fv(f, "name", live(M))]), add);
			}
		}
	}
	return live(f.dot);
});

// /proc/key_name_admin  (code/__HELPERS/unsorted.dm:418)
rt.def("/proc/key_name_admin", function key_name_admin(f: Frame, whom: Value, include_name: Value) {
	f.vars = () => [include_name];
	if (live(include_name) === null) {
		include_name = 1;
	}
	return rt.call(f, P("/proc/key_name"), null, [live(whom), 1, live(include_name)]);
});

// /proc/get_mob_by_ckey  (code/__HELPERS/unsorted.dm:421)  may sleep
rt.def("/proc/get_mob_by_ckey", function* get_mob_by_ckey(f: Frame, key: Value) {
	let mobs: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [key, mobs, M, $e];
	if (!truthy(live(key))) {
		return live(f.dot);
	}
	mobs = (yield* g.call(f, P("/proc/sortmobs"), null, []));
	M = null;
	rt.forList(f, 0, live(mobs), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "ckey", live(M)), live(key))) {
			return live(M);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/get_atom_on_turf  (code/__HELPERS/unsorted.dm:432)
rt.def("/proc/get_atom_on_turf", function get_atom_on_turf(f: Frame, M: Value, stop_type: Value) {
	let loc: Value = null;
	f.vars = () => [loc];
	loc = live(M);
	while ((truthy(live(loc)) && truthy(rt.fv(f, "loc", live(loc)))) && !truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(loc))]))) {
		loc = rt.fv(f, "loc", live(loc));
		if ((truthy(live(stop_type)) && truthy(rt.op(f, "IsType", [], [live(loc), live(stop_type)])))) {
			break;
		}
	}
	return live(loc);
});

// /proc/get_edge_target_turf  (code/__HELPERS/unsorted.dm:442)
rt.def("/proc/get_edge_target_turf", function get_edge_target_turf(f: Frame, A: Value, direction: Value) {
	let target: Value = null;
	f.vars = () => [target];
	target = rt.locate(rt.fv(f, "x", live(A)), rt.fv(f, "y", live(A)), rt.fv(f, "z", live(A)));
	if ((!truthy(live(A)) || !truthy(live(target)))) {
		return 0;
	}
	if (truthy(rt.bitAnd(live(direction), 1))) {
		target = rt.locate(rt.fv(f, "x", live(target)), rt.fv(f, "maxy", rt.world()), rt.fv(f, "z", live(target)));
	}
	if (truthy(rt.bitAnd(live(direction), 2))) {
		target = rt.locate(rt.fv(f, "x", live(target)), 1, rt.fv(f, "z", live(target)));
	}
	if (truthy(rt.bitAnd(live(direction), 4))) {
		target = rt.locate(rt.fv(f, "maxx", rt.world()), rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target)));
	}
	if (truthy(rt.bitAnd(live(direction), 8))) {
		target = rt.locate(1, rt.fv(f, "y", live(target)), rt.fv(f, "z", live(target)));
	}
	return live(target);
});

// /proc/get_ranged_target_turf  (code/__HELPERS/unsorted.dm:467)
rt.def("/proc/get_ranged_target_turf", function get_ranged_target_turf(f: Frame, A: Value, direction: Value, range: Value) {
	let x: Value = null, y: Value = null;
	f.vars = () => [x, y];
	x = rt.fv(f, "x", live(A));
	y = rt.fv(f, "y", live(A));
	if (truthy(rt.bitAnd(live(direction), 1))) {
		y = rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxy", rt.world()), add(live(y), live(range))]);
	}
	if (truthy(rt.bitAnd(live(direction), 2))) {
		y = rt.call(f, P("/proc/max"), null, [1, subtract(live(y), live(range))]);
	}
	if (truthy(rt.bitAnd(live(direction), 4))) {
		x = rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxx", rt.world()), add(live(x), live(range))]);
	}
	if (truthy(rt.bitAnd(live(direction), 8))) {
		x = rt.call(f, P("/proc/max"), null, [1, subtract(live(x), live(range))]);
	}
	return rt.locate(live(x), live(y), rt.fv(f, "z", live(A)));
});

// /proc/get_offset_target_turf  (code/__HELPERS/unsorted.dm:482)
rt.def("/proc/get_offset_target_turf", function get_offset_target_turf(f: Frame, A: Value, dx: Value, dy: Value) {
	let x: Value = null, y: Value = null;
	f.vars = () => [x, y];
	x = rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxx", rt.world()), rt.call(f, P("/proc/max"), null, [1, add(rt.fv(f, "x", live(A)), live(dx))])]);
	y = rt.call(f, P("/proc/min"), null, [rt.fv(f, "maxy", rt.world()), rt.call(f, P("/proc/max"), null, [1, add(rt.fv(f, "y", live(A)), live(dy))])]);
	return rt.locate(live(x), live(y), rt.fv(f, "z", live(A)));
});

// /proc/arctan  (code/__HELPERS/unsorted.dm:487)
rt.def("/proc/arctan", function arctan(f: Frame, x: Value) {
	let y: Value = null;
	f.vars = () => [y];
	return (y = rt.op(f, "ArcSin", [], [divide(live(x), rt.op(f, "Sqrt", [], [add(1, multiply(live(x), live(x)))]))]));
});

// /atom/proc/GetAllContents  (code/__HELPERS/unsorted.dm:491)
rt.def("/atom/proc/GetAllContents", function GetAllContents(f: Frame) {
	let processing_list: Value = null, assembled: Value = null, A: Value = null, a: Value = null;
	let $e: any;
	f.vars = () => [processing_list, assembled, A, a, $e];
	processing_list = rt.list(live(f.src));
	assembled = rt.list();
	while (truthy(rt.len(f, live(processing_list)))) {
		(processing_list = rt.modify(live(processing_list), (A = rt.index(live(processing_list), 1)), subtract));
		a = null;
		rt.forList(f, 0, live(A), T("/atom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			a = $e;
			if (!truthy((rt.isIn(f, live(a), live(assembled)) ? 1 : 0))) {
				(processing_list = rt.modify(live(processing_list), live(a), rt.bitOr));
			}
		}
		rt.endFor(f, 0);
		(assembled = rt.modify(live(assembled), live(A), rt.bitOr));
	}
	return live(assembled);
});

// /proc/can_see  (code/__HELPERS/unsorted.dm:508)
rt.def("/proc/can_see", function can_see(f: Frame, source: Value, target: Value, length: Value) {
	let current: Value = null, target_turf: Value = null, steps: Value = null, thing: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [length, current, target_turf, steps, thing, A, $e];
	if (live(length) === null) {
		length = 5;
	}
	current = rt.getStep(f, live(source), 0);
	target_turf = rt.getStep(f, live(target), 0);
	steps = 1;
	if (!isEqual(live(current), live(target_turf))) {
		current = rt.call(f, P("/proc/get_step_towards"), null, [live(current), live(target_turf)]);
		while (!isEqual(live(current), live(target_turf))) {
			if (rt.gt(live(steps), live(length))) {
				return 0;
			}
			if (truthy(rt.fv(f, "opacity", live(current)))) {
				return 0;
			}
			thing = null;
			rt.forList(f, 0, live(current));
			while (($e = rt.next(f, 0)) !== undefined) {
				thing = $e;
				if (truthy(rt.gv(f, "opacity", (A = live(thing))))) {
					return 0;
				}
			}
			rt.endFor(f, 0);
			current = rt.call(f, P("/proc/get_step_towards"), null, [live(current), live(target_turf)]);
			steps = rt.inc(live(steps), 1);
		}
	}
	return 1;
});

// /proc/is_blocked_turf  (code/__HELPERS/unsorted.dm:528)
rt.def("/proc/is_blocked_turf", function is_blocked_turf(f: Frame, _T: Value, exclude_mobs: Value) {
	let i: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, A, $e];
	if (truthy(rt.fv(f, "density", live(_T)))) {
		return 1;
	}
	i = null;
	rt.forList(f, 0, live(_T));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy(rt.gv(f, "density", (A = live(i)))) && (!truthy(live(exclude_mobs)) || !truthy(rt.call(f, P("/proc/ismob"), null, [live(A)]))))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/is_anchored_dense_turf  (code/__HELPERS/unsorted.dm:537)
rt.def("/proc/is_anchored_dense_turf", function is_anchored_dense_turf(f: Frame, _T: Value) {
	let i: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, A, $e];
	if (truthy(rt.fv(f, "density", live(_T)))) {
		return 1;
	}
	i = null;
	rt.forList(f, 0, live(_T));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((truthy(rt.gv(f, "density", (A = live(i)))) && truthy(rt.fv(f, "anchored", live(A))))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/get_step_towards2  (code/__HELPERS/unsorted.dm:546)
rt.def("/proc/get_step_towards2", function get_step_towards2(f: Frame, ref: Value, trg: Value) {
	let base_dir: Value = null, temp: Value = null, dir_alt1: Value = null, dir_alt2: Value = null, turf_last1: Value = null, turf_last2: Value = null, free_tile: Value = null, breakpoint: Value = null;
	f.vars = () => [base_dir, temp, dir_alt1, dir_alt2, turf_last1, turf_last2, free_tile, breakpoint];
	base_dir = rt.getDir(f, live(ref), rt.call(f, P("/proc/get_step_towards"), null, [live(ref), live(trg)]));
	if (truthy(rt.call(f, P("/proc/is_blocked_turf"), null, [(temp = rt.call(f, P("/proc/get_step_towards"), null, [live(ref), live(trg)]))]))) {
		dir_alt1 = rt.call(f, P("/proc/turn"), null, [live(base_dir), 90]);
		dir_alt2 = rt.call(f, P("/proc/turn"), null, [live(base_dir), -90]);
		turf_last1 = live(temp);
		turf_last2 = live(temp);
		free_tile = null;
		breakpoint = 0;
		while (!truthy(live(free_tile)) && rt.lt(live(breakpoint), 10)) {
			if (!truthy(rt.call(f, P("/proc/is_blocked_turf"), null, [live(turf_last1)]))) {
				free_tile = live(turf_last1);
				break;
			}
			if (!truthy(rt.call(f, P("/proc/is_blocked_turf"), null, [live(turf_last2)]))) {
				free_tile = live(turf_last2);
				break;
			}
			turf_last1 = rt.getStep(f, live(turf_last1), live(dir_alt1));
			turf_last2 = rt.getStep(f, live(turf_last2), live(dir_alt2));
			breakpoint = rt.inc(live(breakpoint), 1);
		}
		if (!truthy(live(free_tile))) {
			return rt.getStep(f, live(ref), live(base_dir));
		}
		return rt.call(f, P("/proc/get_step_towards"), null, [live(ref), live(free_tile)]);
	} else {
		return rt.getStep(f, live(ref), live(base_dir));
	}
	return f.dot;
});

// /proc/hasvar  (code/__HELPERS/unsorted.dm:579)
rt.def("/proc/hasvar", function hasvar(f: Frame, A: Value, varname: Value) {
	if (truthy(rt.callName(f, rt.fv(f, "vars", live(A)), "Find", [rt.call(f, P("/proc/lowertext"), null, [live(varname)])]))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /proc/repopulate_sorted_areas  (code/__HELPERS/unsorted.dm:586)  may sleep
rt.def("/proc/repopulate_sorted_areas", function* repopulate_sorted_areas(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	rt.setGl("sortedAreas", rt.list());
	A = null;
	rt.forList(f, 0, rt.world(), T("/area"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, rt.gl("sortedAreas"), "Add", [live(A)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sortTim"), null, [rt.gl("sortedAreas"), P("/proc/cmp_name_asc")]);
	return f.dot;
}, true);

// /area/proc/addSorted  (code/__HELPERS/unsorted.dm:594)  may sleep
rt.def("/area/proc/addSorted", function* addSorted(f: Frame) {
	yield* g.callName(f, rt.gl("sortedAreas"), "Add", [live(f.src)]);
	yield* g.call(f, P("/proc/sortTim"), null, [rt.gl("sortedAreas"), P("/proc/cmp_name_asc")]);
	return f.dot;
}, true);

// /proc/get_areas  (code/__HELPERS/unsorted.dm:600)
rt.def("/proc/get_areas", function get_areas(f: Frame, areatype: Value, subtypes: Value) {
	let areatemp: Value = null, areas: Value = null, cache: Value = null, V: Value = null, A: Value = null, V_1: Value = null, A_2: Value = null;
	let $e: any;
	f.vars = () => [areatype, subtypes, areatemp, areas, cache, V, A, V_1, A_2, $e];
	if (live(subtypes) === null) {
		subtypes = 1;
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(areatype)]))) {
		areatype = rt.call(f, P("/proc/text2path"), null, [live(areatype)]);
	} else {
		if (truthy(rt.call(f, P("/proc/isarea"), null, [live(areatype)]))) {
			areatype = rt.gv(f, "type", (areatemp = live(areatype)));
		} else {
			if (!truthy(rt.call(f, P("/proc/ispath"), null, [live(areatype)]))) {
				return null;
			}
		}
	}
	areas = rt.list();
	if (truthy(live(subtypes))) {
		cache = rt.call(f, P("/proc/typecacheof"), null, [live(areatype)]);
		V = null;
		rt.forList(f, 0, rt.gl("sortedAreas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			A = live(V);
			if (truthy(rt.index(live(cache), rt.fv(f, "type", live(A))))) {
				areas = rt.modify(live(areas), live(V), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		V_1 = null;
		rt.forList(f, 0, rt.gl("sortedAreas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V_1 = $e;
			if (isEqual(rt.gv(f, "type", (A_2 = live(V_1))), live(areatype))) {
				areas = rt.modify(live(areas), live(V_1), add);
			}
		}
		rt.endFor(f, 0);
	}
	return live(areas);
});

// /proc/get_area_turfs  (code/__HELPERS/unsorted.dm:625)
rt.def("/proc/get_area_turfs", function get_area_turfs(f: Frame, areatype: Value, target_z: Value, subtypes: Value) {
	let areatemp: Value = null, turfs: Value = null, cache: Value = null, V: Value = null, A: Value = null, _T: Value = null, V_1: Value = null, A_2: Value = null, _T_3: Value = null;
	let $e: any;
	f.vars = () => [areatype, target_z, subtypes, areatemp, turfs, cache, V, A, _T, V_1, A_2, _T_3, $e];
	if (live(target_z) === null) {
		target_z = 0;
	}
	if (live(subtypes) === null) {
		subtypes = 0;
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(areatype)]))) {
		areatype = rt.call(f, P("/proc/text2path"), null, [live(areatype)]);
	} else {
		if (truthy(rt.call(f, P("/proc/isarea"), null, [live(areatype)]))) {
			areatype = rt.gv(f, "type", (areatemp = live(areatype)));
		} else {
			if (!truthy(rt.call(f, P("/proc/ispath"), null, [live(areatype)]))) {
				return null;
			}
		}
	}
	turfs = rt.list();
	if (truthy(live(subtypes))) {
		cache = rt.call(f, P("/proc/typecacheof"), null, [live(areatype)]);
		V = null;
		rt.forList(f, 0, rt.gl("sortedAreas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V = $e;
			A = live(V);
			if (!truthy(rt.index(live(cache), rt.fv(f, "type", live(A))))) {
				continue;
			}
			_T = null;
			rt.forList(f, 1, live(A), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T = $e;
				if ((isEqual(live(target_z), 0) || isEqual(live(target_z), rt.fv(f, "z", live(_T))))) {
					turfs = rt.modify(live(turfs), live(_T), add);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	} else {
		V_1 = null;
		rt.forList(f, 0, rt.gl("sortedAreas"));
		while (($e = rt.next(f, 0)) !== undefined) {
			V_1 = $e;
			if (!isEqual(rt.gv(f, "type", (A_2 = live(V_1))), live(areatype))) {
				continue;
			}
			_T_3 = null;
			rt.forList(f, 1, live(A_2), T("/turf"));
			while (($e = rt.next(f, 1)) !== undefined) {
				_T_3 = $e;
				if ((isEqual(live(target_z), 0) || isEqual(live(target_z), rt.fv(f, "z", live(_T_3))))) {
					turfs = rt.modify(live(turfs), live(_T_3), add);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	return live(turfs);
});

// /proc/get_cardinal_dir  (code/__HELPERS/unsorted.dm:654)
rt.def("/proc/get_cardinal_dir", function get_cardinal_dir(f: Frame, A: Value, B: Value) {
	let dx: Value = null, dy: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dx, dy, $0, $1];
	dx = rt.op(f, "Abs", [], [subtract(rt.fv(f, "x", live(B)), rt.fv(f, "x", live(A)))]);
	dy = rt.op(f, "Abs", [], [subtract(rt.fv(f, "y", live(B)), rt.fv(f, "y", live(A)))]);
	$0 = rt.getDir(f, live(A), live(B));
	if (rt.lt(multiply(rt.call(f, P("/proc/rand"), null, []), add(live(dx), live(dy))), live(dy))) {
		$1 = 3;
	} else {
		$1 = 12;
	}
	return rt.bitAnd($0, $1);
});

// /proc/anyprob  (code/__HELPERS/unsorted.dm:660)
rt.def("/proc/anyprob", function anyprob(f: Frame, value: Value) {
	return (isEqual(rt.call(f, P("/proc/rand"), null, [1, live(value)]), live(value)) ? 1 : 0);
});

// /proc/view_or_range  (code/__HELPERS/unsorted.dm:663)
rt.def("/proc/view_or_range", function view_or_range(f: Frame, distance: Value, center: Value, type: Value) {
	let $0: any;
	f.vars = () => [distance, center, $0];
	if (live(distance) === null) {
		distance = rt.fv(f, "view", rt.world());
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	$0 = live(type);
	if ($0 === "view") {
		f.dot = rt.call(f, P("/proc/view"), null, [live(distance), live(center)]);
	} else if ($0 === "range") {
		f.dot = rt.call(f, P("/proc/range"), null, [live(distance), live(center)]);
	}
	return live(f.dot);
});

// /proc/oview_or_orange  (code/__HELPERS/unsorted.dm:671)
rt.def("/proc/oview_or_orange", function oview_or_orange(f: Frame, distance: Value, center: Value, type: Value) {
	let $0: any;
	f.vars = () => [distance, center, $0];
	if (live(distance) === null) {
		distance = rt.fv(f, "view", rt.world());
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	$0 = live(type);
	if ($0 === "view") {
		f.dot = rt.call(f, P("/proc/oview"), null, [live(distance), live(center)]);
	} else if ($0 === "range") {
		f.dot = rt.call(f, P("/proc/orange"), null, [live(distance), live(center)]);
	}
	return live(f.dot);
});

// /proc/parse_zone  (code/__HELPERS/unsorted.dm:679)
rt.def("/proc/parse_zone", function parse_zone(f: Frame, zone: Value) {
	if (isEqual(live(zone), "r_hand")) {
		return "right hand";
	}
	if (isEqual(live(zone), "l_hand")) {
		return "left hand";
	}
	if (isEqual(live(zone), "l_arm")) {
		return "left arm";
	}
	if (isEqual(live(zone), "r_arm")) {
		return "right arm";
	}
	if (isEqual(live(zone), "l_leg")) {
		return "left leg";
	}
	if (isEqual(live(zone), "r_leg")) {
		return "right leg";
	}
	if (isEqual(live(zone), "l_foot")) {
		return "left foot";
	}
	if (isEqual(live(zone), "r_foot")) {
		return "right foot";
	}
	return live(zone);
});

// /proc/get_turf_pixel  (code/__HELPERS/unsorted.dm:714)
rt.def("/proc/get_turf_pixel", function get_turf_pixel(f: Frame, AM: Value) {
	let M: Value = null, pixel_x_offset: Value = null, pixel_y_offset: Value = null, AMicon: Value = null, AMiconheight: Value = null, AMiconwidth: Value = null, rough_x: Value = null, rough_y: Value = null, _T: Value = null, final_x: Value = null, final_y: Value = null;
	f.vars = () => [M, pixel_x_offset, pixel_y_offset, AMicon, AMiconheight, AMiconwidth, rough_x, rough_y, _T, final_x, final_y];
	if (!truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0))) {
		return live(f.dot);
	}
	M = rt.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(AM))]);
	pixel_x_offset = add(rt.fv(f, "pixel_x", live(AM)), rt.callName(f, live(M), "get_x_shift", []));
	pixel_y_offset = add(rt.fv(f, "pixel_y", live(AM)), rt.callName(f, live(M), "get_y_shift", []));
	AMicon = rt.call(f, P("/proc/icon"), null, [rt.fv(f, "icon", live(AM)), rt.fv(f, "icon_state", live(AM))]);
	AMiconheight = rt.callName(f, live(AMicon), "Height", []);
	AMiconwidth = rt.callName(f, live(AMicon), "Width", []);
	if ((!isEqual(live(AMiconheight), rt.fv(f, "icon_size", rt.world())) || !isEqual(live(AMiconwidth), rt.fv(f, "icon_size", rt.world())))) {
		pixel_x_offset = rt.modify(live(pixel_x_offset), multiply(subtract(divide(rt.callName(f, live(AMicon), "Width", []), rt.fv(f, "icon_size", rt.world())), 1), multiply(rt.fv(f, "icon_size", rt.world()), 0.5)), add);
		pixel_y_offset = rt.modify(live(pixel_y_offset), multiply(subtract(divide(rt.callName(f, live(AMicon), "Height", []), rt.fv(f, "icon_size", rt.world())), 1), multiply(rt.fv(f, "icon_size", rt.world()), 0.5)), add);
	}
	rough_x = rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/round"), null, [live(pixel_x_offset), rt.fv(f, "icon_size", rt.world())]), rt.fv(f, "icon_size", rt.world()))]);
	rough_y = rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/round"), null, [live(pixel_y_offset), rt.fv(f, "icon_size", rt.world())]), rt.fv(f, "icon_size", rt.world()))]);
	if (!truthy((_T = rt.getStep(f, live(AM), 0)))) {
		return null;
	}
	final_x = add(rt.fv(f, "x", live(_T)), live(rough_x));
	final_y = add(rt.fv(f, "y", live(_T)), live(rough_y));
	if (!(truthy(live(final_x)) || truthy(live(final_y)))) return f.dot;
	return rt.locate(live(final_x), live(final_y), rt.fv(f, "z", live(_T)));
});

// /proc/getPixelDistance  (code/__HELPERS/unsorted.dm:750)
rt.def("/proc/getPixelDistance", function getPixelDistance(f: Frame, A: Value, B: Value, centered: Value) {
	f.vars = () => [centered];
	if (live(centered) === null) {
		centered = 1;
	}
	if ((!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0)) || !truthy((rt.istype(live(B), T("/atom")) ? 1 : 0)))) {
		return 0;
	}
	f.dot = add(rt.call(f, P("/proc/bounds_dist"), null, [live(A), live(B)]), rt.op(f, "Sqrt", [], [add(rt.power(add(rt.fv(f, "pixel_x", live(A)), rt.fv(f, "pixel_x", live(B))), 2), rt.power(add(rt.fv(f, "pixel_y", live(A)), rt.fv(f, "pixel_y", live(B))), 2))]));
	if (!truthy(live(centered))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.fv(f, "icon_size", rt.world()), add);
	return f.dot;
});

// /proc/get  (code/__HELPERS/unsorted.dm:758)
rt.def("/proc/get", function get(f: Frame, loc: Value, type: Value) {
	f.vars = () => [loc];
	while (truthy(live(loc))) {
		if (truthy(rt.op(f, "IsType", [], [live(loc), live(type)]))) {
			return live(loc);
		}
		loc = rt.fv(f, "loc", live(loc));
	}
	return null;
});

// /datum/controller/global_vars/proc/InitGlobalcan_embed_types  (code/__HELPERS/unsorted.dm:766)
rt.def("/datum/controller/global_vars/proc/InitGlobalcan_embed_types", function InitGlobalcan_embed_types(f: Frame) {
	rt.setGl("can_embed_types", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/item/stack/rods"), T("/obj/item/pipe"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "can_embed_types", add);
	return f.dot;
});

// /proc/can_embed  (code/__HELPERS/unsorted.dm:771)
rt.def("/proc/can_embed", function can_embed(f: Frame, W: Value) {
	if (truthy(rt.callName(f, live(W), "is_sharp", []))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.gl("pointed_types")]))) {
		return 1;
	}
	if (!truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(W), rt.gl("can_embed_types")]))) return f.dot;
	return 1;
});

// /datum/controller/global_vars/proc/InitGlobalWALLITEMS  (code/__HELPERS/unsorted.dm:783)
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS", function InitGlobalWALLITEMS(f: Frame) {
	rt.setGl("WALLITEMS", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/machinery/power/apc"), T("/obj/machinery/airalarm"), T("/obj/item/device/radio/intercom"), T("/obj/structure/extinguisher_cabinet"), T("/obj/structure/reagent_dispensers/peppertank"), T("/obj/machinery/status_display"), T("/obj/machinery/requests_console"), T("/obj/machinery/light_switch"), T("/obj/structure/sign"), T("/obj/machinery/newscaster"), T("/obj/machinery/firealarm"), T("/obj/structure/noticeboard"), T("/obj/machinery/button"), T("/obj/machinery/computer/security/telescreen"), T("/obj/machinery/embedded_controller/radio/simple_vent_controller"), T("/obj/item/weapon/storage/secure/safe"), T("/obj/machinery/door_timer"), T("/obj/machinery/flasher"), T("/obj/machinery/keycard_auth"), T("/obj/structure/mirror"), T("/obj/structure/fireaxecabinet"), T("/obj/machinery/computer/security/telescreen/entertainment"), T("/obj/structure/sign/picture_frame"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "WALLITEMS", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalWALLITEMS_EXTERNAL  (code/__HELPERS/unsorted.dm:794)
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS_EXTERNAL", function InitGlobalWALLITEMS_EXTERNAL(f: Frame) {
	rt.setGl("WALLITEMS_EXTERNAL", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/machinery/camera"), T("/obj/structure/camera_assembly"), T("/obj/structure/light_construct"), T("/obj/machinery/light"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "WALLITEMS_EXTERNAL", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalWALLITEMS_INVERSE  (code/__HELPERS/unsorted.dm:798)
rt.def("/datum/controller/global_vars/proc/InitGlobalWALLITEMS_INVERSE", function InitGlobalWALLITEMS_INVERSE(f: Frame) {
	rt.setGl("WALLITEMS_INVERSE", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/structure/light_construct"), T("/obj/machinery/light"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "WALLITEMS_INVERSE", add);
	return f.dot;
});

// /proc/gotwallitem  (code/__HELPERS/unsorted.dm:803)
rt.def("/proc/gotwallitem", function gotwallitem(f: Frame, loc: Value, dir: Value, check_external: Value) {
	let locdir: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [check_external, locdir, O, $e];
	if (live(check_external) === null) {
		check_external = 0;
	}
	locdir = rt.getStep(f, live(loc), live(dir));
	O = null;
	rt.forList(f, 0, live(loc), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("WALLITEMS")])) && !isEqual(live(check_external), 2))) {
			if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("WALLITEMS_INVERSE")]))) {
				if (isEqual(rt.fv(f, "dir", live(O)), rt.call(f, P("/proc/turn"), null, [live(dir), 180]))) {
					return 1;
				}
			} else {
				if (isEqual(rt.fv(f, "dir", live(O)), live(dir))) {
					return 1;
				}
			}
			if (isEqual(rt.call(f, P("/proc/get_turf_pixel"), null, [live(O)]), live(locdir))) {
				return 1;
			}
		}
		if ((truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("WALLITEMS_EXTERNAL")])) && truthy(live(check_external)))) {
			if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("WALLITEMS_INVERSE")]))) {
				if (isEqual(rt.fv(f, "dir", live(O)), rt.call(f, P("/proc/turn"), null, [live(dir), 180]))) {
					return 1;
				}
			} else {
				if (isEqual(rt.fv(f, "dir", live(O)), live(dir))) {
					return 1;
				}
			}
		}
	}
	rt.endFor(f, 0);
	O = null;
	rt.forList(f, 0, live(locdir), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.gl("WALLITEMS")])) && !isEqual(live(check_external), 2))) {
			if ((isEqual(rt.fv(f, "pixel_x", live(O)), 0) && isEqual(rt.fv(f, "pixel_y", live(O)), 0))) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /proc/format_text  (code/__HELPERS/unsorted.dm:833)
rt.def("/proc/format_text", function format_text(f: Frame, text: Value) {
	return rt.call(f, P("/proc/replacetext"), null, [rt.call(f, P("/proc/replacetext"), null, [live(text), "ÿ\u0015", ""]), "ÿ\u0016", ""]);
});

// /obj/proc/atmosanalyzer_scan  (code/__HELPERS/unsorted.dm:836)
rt.def("/obj/proc/atmosanalyzer_scan", function atmosanalyzer_scan(f: Frame, air_contents: Value, user: Value, target: Value) {
	let icon: Value = null, pressure: Value = null, total_moles: Value = null, cached_gases: Value = null, id: Value = null, gas_concentration: Value = null;
	let $e: any;
	f.vars = () => [target, icon, pressure, total_moles, cached_gases, id, gas_concentration, $e];
	if (live(target) === null) {
		target = live(f.src);
	}
	icon = live(target);
	rt.callName(f, live(user), "visible_message", [fmt("＀ has used the analyzer on ＀ ＀.", [live(user), rt.call(f, P("/proc/bicon"), null, [live(icon)]), live(target)]), fmt("<span class='notice'>You use the analyzer on ＀ ＀.</span>", [rt.call(f, P("/proc/bicon"), null, [live(icon)]), live(target)])]);
	pressure = rt.callName(f, live(air_contents), "return_pressure", []);
	total_moles = rt.callName(f, live(air_contents), "total_moles", []);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Results of analysis of ＀ ＀.</span>", [rt.call(f, P("/proc/bicon"), null, [live(icon)]), live(target)])]);
	if (rt.gt(live(total_moles), 0)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Pressure: ＀ kPa</span>", [rt.call(f, P("/proc/round"), null, [live(pressure), 0.10000000149011612])])]);
		cached_gases = rt.fv(f, "gases", live(air_contents));
		id = null;
		rt.forList(f, 0, live(cached_gases));
		while (($e = rt.next(f, 0)) !== undefined) {
			id = $e;
			gas_concentration = divide(rt.index(rt.index(live(cached_gases), live(id)), 1), live(total_moles));
			if ((truthy((rt.isIn(f, live(id), rt.gl("hardcoded_gases")) ? 1 : 0)) || rt.gt(live(gas_concentration), 0.0010000000474974513))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀: ＀ %</span>", [rt.index(rt.index(rt.index(live(cached_gases), live(id)), 3), 2), rt.call(f, P("/proc/round"), null, [multiply(live(gas_concentration), 100), 0.009999999776482582])])]);
			}
		}
		rt.endFor(f, 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Temperature: ＀ &deg;C</span>", [rt.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "temperature", live(air_contents)), 273.1499938964844)])])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is empty!</span>", [live(target)])]);
	}
	return live(f.dot);
});

// /proc/check_target_facings  (code/__HELPERS/unsorted.dm:861)
rt.def("/proc/check_target_facings", function check_target_facings(f: Frame, initator: Value, target: Value) {
	if ((!truthy(rt.call(f, P("/proc/ismob"), null, [live(target)])) || truthy(rt.fv(f, "lying", live(target))))) {
		return 0;
	}
	if (isEqual(rt.fv(f, "dir", live(initator)), rt.fv(f, "dir", live(target)))) {
		return 1;
	}
	if ((truthy(rt.call(f, P("/proc/is_A_facing_B"), null, [live(initator), live(target)])) && truthy(rt.call(f, P("/proc/is_A_facing_B"), null, [live(target), live(initator)])))) {
		return 2;
	}
	if (!(((isEqual(add(rt.fv(f, "dir", live(initator)), 2), rt.fv(f, "dir", live(target))) || isEqual(subtract(rt.fv(f, "dir", live(initator)), 2), rt.fv(f, "dir", live(target)))) || isEqual(add(rt.fv(f, "dir", live(initator)), 6), rt.fv(f, "dir", live(target)))) || isEqual(subtract(rt.fv(f, "dir", live(initator)), 6), rt.fv(f, "dir", live(target))))) return f.dot;
	return 3;
});

// /proc/random_step  (code/__HELPERS/unsorted.dm:872)  may sleep
rt.def("/proc/random_step", function* random_step(f: Frame, AM: Value, steps: Value, chance: Value) {
	let initial_chance: Value = null;
	f.vars = () => [AM, steps, chance, initial_chance];
	initial_chance = live(chance);
	while (rt.gt(live(steps), 0)) {
		if (truthy(rt.op(f, "Prob", [], [live(chance)]))) {
			yield* g.call(f, P("/proc/step"), null, [live(AM), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])]);
		}
		chance = (yield* g.call(f, P("/proc/max"), null, [subtract(live(chance), divide(live(initial_chance), live(steps))), 0]));
		steps = rt.inc(live(steps), -1);
	}
	return f.dot;
}, true);

// /proc/living_player_count  (code/__HELPERS/unsorted.dm:881)
rt.def("/proc/living_player_count", function living_player_count(f: Frame) {
	let living_player_count: Value = null, mob: Value = null;
	let $e: any;
	f.vars = () => [living_player_count, mob, $e];
	living_player_count = 0;
	mob = null;
	rt.forList(f, 0, rt.gl("player_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		mob = $e;
		if (truthy((rt.isIn(f, live(mob), rt.gl("living_mob_list")) ? 1 : 0))) {
			living_player_count = rt.modify(live(living_player_count), 1, add);
		}
	}
	rt.endFor(f, 0);
	return live(living_player_count);
});

// /proc/randomColor  (code/__HELPERS/unsorted.dm:887)
rt.def("/proc/randomColor", function randomColor(f: Frame, mode: Value) {
	let $0: any;
	f.vars = () => [mode, $0];
	if (live(mode) === null) {
		mode = 0;
	}
	$0 = live(mode);
	if ($0 === 0) {
		return rt.op(f, "PickUnweighted", [18], ["white", "black", "gray", "red", "green", "blue", "brown", "yellow", "orange", "darkred", "crimson", "lime", "darkgreen", "cyan", "navy", "teal", "purple", "indigo"]);
	} else if ($0 === 1) {
		return rt.op(f, "PickUnweighted", [15], ["red", "green", "blue", "brown", "yellow", "orange", "darkred", "crimson", "lime", "darkgreen", "cyan", "navy", "teal", "purple", "indigo"]);
	} else {
		return "white";
	}
	return f.dot;
});

// /proc/params2turf  (code/__HELPERS/unsorted.dm:898)
rt.def("/proc/params2turf", function params2turf(f: Frame, scr_loc: Value, origin: Value, viewing_client: Value) {
	let actual_view: Value = null, tX: Value = null, tY: Value = null, tZ: Value = null;
	let $0: any;
	f.vars = () => [actual_view, tX, tY, tZ, $0];
	if (!truthy(live(scr_loc))) {
		return null;
	}
	if (truthy(live(viewing_client))) {
		$0 = rt.fv(f, "view", live(viewing_client));
	} else {
		$0 = rt.fv(f, "view", rt.world());
	}
	actual_view = rt.call(f, P("/proc/getviewsize"), null, [$0]);
	tX = rt.call(f, P("/proc/splittext"), null, [live(scr_loc), ","]);
	tY = rt.call(f, P("/proc/splittext"), null, [rt.index(live(tX), 2), ":"]);
	tZ = rt.fv(f, "z", live(origin));
	tY = rt.index(live(tY), 1);
	tX = rt.index((tX = rt.call(f, P("/proc/splittext"), null, [rt.index(live(tX), 1), ":"])), 1);
	tX = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(subtract(add(rt.fv(f, "x", live(origin)), rt.call(f, P("/proc/text2num"), null, [live(tX)])), rt.call(f, P("/proc/round"), null, [divide(rt.index(live(actual_view), 1), 2)])), 1), rt.fv(f, "maxx", rt.world())])]);
	tY = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(subtract(add(rt.fv(f, "y", live(origin)), rt.call(f, P("/proc/text2num"), null, [live(tY)])), rt.call(f, P("/proc/round"), null, [divide(rt.index(live(actual_view), 2), 2)])), 1), rt.fv(f, "maxy", rt.world())])]);
	return rt.locate(live(tX), live(tY), live(tZ));
});

// /proc/screen_loc2turf  (code/__HELPERS/unsorted.dm:912)
rt.def("/proc/screen_loc2turf", function screen_loc2turf(f: Frame, text: Value, origin: Value) {
	let tZ: Value = null, tX: Value = null, tY: Value = null;
	f.vars = () => [tZ, tX, tY];
	if (!truthy(live(text))) {
		return null;
	}
	tZ = rt.call(f, P("/proc/splittext"), null, [live(text), ","]);
	tX = rt.call(f, P("/proc/splittext"), null, [rt.index(live(tZ), 1), "-"]);
	tY = rt.call(f, P("/proc/text2num"), null, [rt.index(live(tX), 2)]);
	tX = rt.call(f, P("/proc/text2num"), null, [rt.index((tX = rt.call(f, P("/proc/splittext"), null, [rt.index(live(tZ), 2), "-"])), 2)]);
	tZ = rt.fv(f, "z", live(origin));
	tX = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(add(rt.fv(f, "x", live(origin)), 7), live(tX)), rt.fv(f, "maxx", rt.world())])]);
	tY = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(add(rt.fv(f, "y", live(origin)), 7), live(tY)), rt.fv(f, "maxy", rt.world())])]);
	return rt.locate(live(tX), live(tY), live(tZ));
});

// /proc/IsValidSrc  (code/__HELPERS/unsorted.dm:925)
rt.def("/proc/IsValidSrc", function IsValidSrc(f: Frame, D: Value) {
	if (truthy((rt.istype(live(D), T("/datum")) ? 1 : 0))) {
		return (!(!truthy(live(D)) || truthy(rt.fv(f, "gc_destroyed", live(D)))) ? 1 : 0);
	}
	return 0;
});

// /proc/is_A_facing_B  (code/__HELPERS/unsorted.dm:933)
rt.def("/proc/is_A_facing_B", function is_A_facing_B(f: Frame, A: Value, B: Value) {
	let LA: Value = null, goal_dir: Value = null, clockwise_A_dir: Value = null, anticlockwise_A_dir: Value = null;
	f.vars = () => [LA, goal_dir, clockwise_A_dir, anticlockwise_A_dir];
	if ((!truthy((rt.istype(live(A), T("/atom")) ? 1 : 0)) || !truthy((rt.istype(live(B), T("/atom")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "lying", (LA = live(A))))) {
			return 0;
		}
	}
	goal_dir = rt.call(f, P("/proc/angle2dir"), null, [rt.call(f, P("/proc/dir2angle"), null, [add(rt.getDir(f, live(B), live(A)), 180)])]);
	clockwise_A_dir = rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), -45]);
	anticlockwise_A_dir = rt.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(B)), 45]);
	if (((isEqual(rt.fv(f, "dir", live(A)), live(goal_dir)) || isEqual(live(clockwise_A_dir), live(goal_dir))) || isEqual(live(anticlockwise_A_dir), live(goal_dir)))) {
		return 1;
	}
	return 0;
});

// /proc/center_image  (code/__HELPERS/unsorted.dm:979)
rt.def("/proc/center_image", function center_image(f: Frame, I: Value, x_dimension: Value, y_dimension: Value) {
	let x_offset: Value = null, y_offset: Value = null;
	f.vars = () => [x_dimension, y_dimension, x_offset, y_offset];
	if (live(x_dimension) === null) {
		x_dimension = 0;
	}
	if (live(y_dimension) === null) {
		y_dimension = 0;
	}
	if (!truthy(live(I))) {
		return live(f.dot);
	}
	if ((!truthy(live(x_dimension)) || !truthy(live(y_dimension)))) {
		return live(f.dot);
	}
	if ((isEqual(live(x_dimension), rt.fv(f, "icon_size", rt.world())) && isEqual(live(y_dimension), rt.fv(f, "icon_size", rt.world())))) {
		return live(I);
	}
	x_offset = multiply(rt.neg(subtract(divide(live(x_dimension), rt.fv(f, "icon_size", rt.world())), 1)), multiply(rt.fv(f, "icon_size", rt.world()), 0.5));
	y_offset = multiply(rt.neg(subtract(divide(live(y_dimension), rt.fv(f, "icon_size", rt.world())), 1)), multiply(rt.fv(f, "icon_size", rt.world()), 0.5));
	if (rt.lt(live(x_dimension), rt.fv(f, "icon_size", rt.world()))) {
		(x_offset = rt.modify(live(x_offset), -1, multiply));
	}
	if (rt.lt(live(y_dimension), rt.fv(f, "icon_size", rt.world()))) {
		(y_offset = rt.modify(live(y_offset), -1, multiply));
	}
	rt.setFv(f, "pixel_x", live(I), live(x_offset));
	rt.setFv(f, "pixel_y", live(I), live(y_offset));
	return live(I);
});

// /proc/urange  (code/__HELPERS/unsorted.dm:1007)
rt.def("/proc/urange", function urange(f: Frame, dist: Value, center: Value, orange: Value, areas: Value) {
	let turfs: Value = null, V: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [dist, center, orange, areas, turfs, V, _T, $e];
	if (live(dist) === null) {
		dist = 0;
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(orange) === null) {
		orange = 0;
	}
	if (live(areas) === null) {
		areas = 0;
	}
	if (!truthy(live(dist))) {
		if (!truthy(live(orange))) {
			return rt.list(live(center));
		}
		return rt.list();
	}
	turfs = rt.call(f, P("/proc/block"), null, [rt.locate(rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(center)), live(dist)), 1]), rt.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(center)), live(dist)), 1]), rt.fv(f, "z", live(center))), rt.locate(rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(center)), live(dist)), rt.fv(f, "maxx", rt.world())]), rt.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(center)), live(dist)), rt.fv(f, "maxy", rt.world())]), rt.fv(f, "z", live(center)))]);
	if (truthy(live(orange))) {
		(turfs = rt.modify(live(turfs), rt.getStep(f, live(center), 0), subtract));
	}
	f.dot = rt.list();
	V = null;
	rt.forList(f, 0, live(turfs));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		f.dot = rt.modify(live(f.dot), (_T = live(V)), add);
		f.dot = rt.modify(live(f.dot), rt.fv(f, "contents", live(_T)), add);
		if (truthy(live(areas))) {
			(f.dot = rt.modify(live(f.dot), rt.fv(f, "loc", live(_T)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/spiral_range  (code/__HELPERS/unsorted.dm:1026)
rt.def("/proc/spiral_range", function spiral_range(f: Frame, dist: Value, center: Value, orange: Value) {
	let t_center: Value = null, L: Value = null, _T: Value = null, y: Value = null, x: Value = null, c_dist: Value = null;
	let $e: any;
	f.vars = () => [dist, center, orange, t_center, L, _T, y, x, c_dist, $e];
	if (live(dist) === null) {
		dist = 0;
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(orange) === null) {
		orange = 0;
	}
	if (!truthy(live(dist))) {
		if (!truthy(live(orange))) {
			return rt.list(live(center));
		}
		return rt.list();
	}
	if (!truthy((t_center = rt.getStep(f, live(center), 0)))) {
		return rt.list();
	}
	L = rt.list();
	_T = null;
	y = null;
	x = null;
	c_dist = 1;
	if (!truthy(live(orange))) {
		L = rt.modify(live(L), live(t_center), add);
		L = rt.modify(live(L), rt.fv(f, "contents", live(t_center)), add);
	}
	while (rt.le(live(c_dist), live(dist))) {
		y = add(rt.fv(f, "y", live(t_center)), live(c_dist));
		rt.forRange(f, 0, (x = add(subtract(rt.fv(f, "x", live(t_center)), live(c_dist)), 1)), add(rt.fv(f, "x", live(t_center)), live(c_dist)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
				L = rt.modify(live(L), rt.fv(f, "contents", live(_T)), add);
			}
		}
		rt.endFor(f, 0);
		y = subtract(add(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		x = add(rt.fv(f, "x", live(t_center)), live(c_dist));
		rt.forRange(f, 0, subtract(rt.fv(f, "y", live(t_center)), live(c_dist)), live(y), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
				L = rt.modify(live(L), rt.fv(f, "contents", live(_T)), add);
			}
		}
		rt.endFor(f, 0);
		y = subtract(rt.fv(f, "y", live(t_center)), live(c_dist));
		x = subtract(add(rt.fv(f, "x", live(t_center)), live(c_dist)), 1);
		rt.forRange(f, 0, subtract(rt.fv(f, "x", live(t_center)), live(c_dist)), live(x), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
				L = rt.modify(live(L), rt.fv(f, "contents", live(_T)), add);
			}
		}
		rt.endFor(f, 0);
		y = add(subtract(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		x = subtract(rt.fv(f, "x", live(t_center)), live(c_dist));
		rt.forRange(f, 0, live(y), add(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
				L = rt.modify(live(L), rt.fv(f, "contents", live(_T)), add);
			}
		}
		rt.endFor(f, 0);
		c_dist = rt.inc(live(c_dist), 1);
	}
	return live(L);
});

// /proc/spiral_range_turfs  (code/__HELPERS/unsorted.dm:1084)  may sleep
rt.def("/proc/spiral_range_turfs", function* spiral_range_turfs(f: Frame, dist: Value, center: Value, orange: Value, outlist: Value, tick_checked: Value) {
	let t_center: Value = null, L: Value = null, _T: Value = null, y: Value = null, x: Value = null, c_dist: Value = null;
	let $e: any;
	f.vars = () => [dist, center, orange, outlist, tick_checked, t_center, L, _T, y, x, c_dist, $e];
	if (live(dist) === null) {
		dist = 0;
	}
	if (live(center) === null) {
		center = live(f.usr);
	}
	if (live(orange) === null) {
		orange = 0;
	}
	if (live(outlist) === null) {
		outlist = rt.list();
	}
	yield* g.callName(f, live(outlist), "Cut", []);
	if (!truthy(live(dist))) {
		return (outlist = rt.modify(live(outlist), live(center), add));
	}
	if (!truthy((t_center = rt.getStep(f, live(center), 0)))) {
		return live(outlist);
	}
	L = live(outlist);
	_T = null;
	y = null;
	x = null;
	c_dist = 1;
	if (!truthy(live(orange))) {
		L = rt.modify(live(L), live(t_center), add);
	}
	while (rt.le(live(c_dist), live(dist))) {
		y = add(rt.fv(f, "y", live(t_center)), live(c_dist));
		rt.forRange(f, 0, (x = add(subtract(rt.fv(f, "x", live(t_center)), live(c_dist)), 1)), add(rt.fv(f, "x", live(t_center)), live(c_dist)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
		rt.endFor(f, 0);
		y = subtract(add(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		x = add(rt.fv(f, "x", live(t_center)), live(c_dist));
		rt.forRange(f, 0, subtract(rt.fv(f, "y", live(t_center)), live(c_dist)), live(y), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
		rt.endFor(f, 0);
		y = subtract(rt.fv(f, "y", live(t_center)), live(c_dist));
		x = subtract(add(rt.fv(f, "x", live(t_center)), live(c_dist)), 1);
		rt.forRange(f, 0, subtract(rt.fv(f, "x", live(t_center)), live(c_dist)), live(x), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			x = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
		rt.endFor(f, 0);
		y = add(subtract(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		x = subtract(rt.fv(f, "x", live(t_center)), live(c_dist));
		rt.forRange(f, 0, live(y), add(rt.fv(f, "y", live(t_center)), live(c_dist)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			y = $e;
			if (truthy((_T = rt.locate(live(x), live(y), rt.fv(f, "z", live(t_center)))))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
		rt.endFor(f, 0);
		c_dist = rt.inc(live(c_dist), 1);
		if (truthy(live(tick_checked))) {
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
	}
	return live(L);
}, true);

// /atom/proc/contains  (code/__HELPERS/unsorted.dm:1137)
rt.def("/atom/proc/contains", function contains(f: Frame, A: Value) {
	let location: Value = null;
	f.vars = () => [location];
	if (!truthy(live(A))) {
		return 0;
	}
	location = null;
	location = rt.fv(f, "loc", live(A));
	while (truthy(live(location))) {
		if (isEqual(live(location), live(f.src))) {
			return 1;
		}
		location = rt.fv(f, "loc", live(location));
	}
	return f.dot;
});

// /proc/flick_overlay_static  (code/__HELPERS/unsorted.dm:1145)  may sleep
rt.def("/proc/flick_overlay_static", function* flick_overlay_static(f: Frame, O: Value, A: Value, duration: Value) {
	f.vars = () => [O, A, duration];
	if ((!truthy(live(A)) || !truthy(live(O)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "add_overlay", [live(O)]);
	yield* g.call(f, P("/proc/sleep"), null, [live(duration)]);
	yield* g.callName(f, live(A), "cut_overlay", [live(O)]);
	return f.dot;
}, true, { waitfor: false });

// /proc/get_areas_in_z  (code/__HELPERS/unsorted.dm:1152)
rt.def("/proc/get_areas_in_z", function get_areas_in_z(f: Frame, zlevel: Value) {
	let validarea: Value = null, V: Value = null, A: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [validarea, V, A, _T, $e];
	f.dot = rt.list();
	validarea = 0;
	V = null;
	rt.forList(f, 0, rt.gl("sortedAreas"));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		A = live(V);
		validarea = 1;
		_T = null;
		rt.forList(f, 1, live(A), T("/turf"));
		while (($e = rt.next(f, 1)) !== undefined) {
			_T = $e;
			if (!isEqual(rt.fv(f, "z", live(_T)), live(zlevel))) {
				validarea = 0;
				break;
			}
		}
		rt.endFor(f, 1);
		if (truthy(live(validarea))) {
			f.dot = rt.modify(live(f.dot), live(A), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/get_closest_atom  (code/__HELPERS/unsorted.dm:1167)
rt.def("/proc/get_closest_atom", function get_closest_atom(f: Frame, type: Value, list: Value, source: Value) {
	let closest_atom: Value = null, closest_distance: Value = null, A: Value = null, distance: Value = null;
	let $e: any;
	f.vars = () => [closest_atom, closest_distance, A, distance, $e];
	closest_atom = null;
	closest_distance = null;
	A = null;
	rt.forList(f, 0, live(list));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (!truthy(rt.op(f, "IsType", [], [live(A), live(type)]))) {
			continue;
		}
		distance = rt.call(f, P("/proc/get_dist"), null, [live(source), live(A)]);
		if (!truthy(live(closest_atom))) {
			closest_distance = live(distance);
			closest_atom = live(A);
		} else {
			if (rt.gt(live(closest_distance), live(distance))) {
				closest_distance = live(distance);
				closest_atom = live(A);
			}
		}
	}
	rt.endFor(f, 0);
	return live(closest_atom);
});

// /proc/pick_closest_path  (code/__HELPERS/unsorted.dm:1182)  may sleep
rt.def("/proc/pick_closest_path", function* pick_closest_path(f: Frame, value: Value, matches: Value) {
	let chosen: Value = null;
	f.vars = () => [value, matches, chosen];
	if (live(matches) === null) {
		matches = (yield* g.call(f, P("/proc/get_fancy_list_of_atom_types"), null, []));
	}
	if (isEqual(live(value), 0)) {
		if ((value = (yield* g.op(f, "Prompt", [3], [null, null, "Search for type", "Enter type to find (blank for all, cancel to cancel)", null]))) === null) {
			return live(f.dot);
		}
	}
	if (((value = (yield* g.call(f, P("/proc/trim"), null, [live(value)]))) !== null && !isEqual(live(value), ""))) {
		matches = (yield* g.call(f, P("/proc/filter_fancy_list"), null, [live(matches), live(value)]));
	}
	if (isEqual(rt.len(f, live(matches)), 0)) {
		return live(f.dot);
	}
	chosen = null;
	if (isEqual(rt.len(f, live(matches)), 1)) {
		chosen = rt.index(live(matches), 1);
	} else {
		if (!truthy((chosen = (yield* g.op(f, "Prompt", [1], [null, rt.index(live(matches), 1), "Pick Type", "Select a type", live(matches)]))))) {
			return live(f.dot);
		}
	}
	return (chosen = rt.index(live(matches), live(chosen)));
}, true);

// /proc/stack_trace  (code/__HELPERS/unsorted.dm:1205)
rt.def("/proc/stack_trace", function stack_trace(f: Frame, msg: Value) {
	rt.call(f, P("/proc/CRASH"), null, [live(msg)]);
	return f.dot;
});

// /proc/stoplag  (code/__HELPERS/unsorted.dm:1214)  may sleep
rt.def("/proc/stoplag", function* stoplag(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	if ((!truthy(rt.gl("Master")) || !truthy(rt.bitAnd(rt.fv(f, "current_runlevel", rt.gl("Master")), 14)))) {
		yield* g.call(f, P("/proc/sleep"), null, [rt.fv(f, "tick_lag", rt.world())]);
		return 1;
	}
	f.dot = 0;
	i = 1;
	while (true) {
		f.dot = rt.modify(live(f.dot), (yield* g.call(f, P("/proc/round"), null, [multiply(live(i), (yield* g.call(f, P("/proc/max"), null, [multiply(divide((yield* g.call(f, P("/proc/max"), null, [rt.tickUsage(f), rt.fv(f, "cpu", rt.world())])), 100), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "sleep_delta", rt.gl("Master")), 1]))), 1])))])), add);
		yield* g.call(f, P("/proc/sleep"), null, [multiply(multiply(live(i), rt.fv(f, "tick_lag", rt.world())), (yield* g.call(f, P("/proc/max"), null, [multiply(divide((yield* g.call(f, P("/proc/max"), null, [rt.tickUsage(f), rt.fv(f, "cpu", rt.world())])), 100), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "sleep_delta", rt.gl("Master")), 1]))), 1])))]);
		(i = rt.modify(live(i), 2, multiply));
		if (!rt.gt(rt.tickUsage(f), (yield* g.call(f, P("/proc/min"), null, [58, rt.gl("current_ticklimit")])))) break;
	}
	return f.dot;
}, true);

// /proc/flash_color  (code/__HELPERS/unsorted.dm:1229)
rt.def("/proc/flash_color", function flash_color(f: Frame, mob_or_client: Value, flash_color: Value, flash_time: Value) {
	let C: Value = null, M: Value = null;
	f.vars = () => [flash_color, flash_time, C, M];
	if (live(flash_color) === null) {
		flash_color = "#960000";
	}
	if (live(flash_time) === null) {
		flash_time = 20;
	}
	C = null;
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(mob_or_client)]))) {
		if (truthy(rt.gv(f, "client", (M = live(mob_or_client))))) {
			C = rt.fv(f, "client", live(M));
		} else {
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(mob_or_client), T("/client")) ? 1 : 0))) {
			C = live(mob_or_client);
		}
	}
	if (!truthy((rt.istype(live(C), T("/client")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "color", live(C), live(flash_color));
	rt.op(f, "Animate", [2, 6], [null, live(C), "color", rt.initial(f, live(C), "color"), "time", live(flash_time)]);
	return f.dot;
});

// /proc/______qdel_list_wrapper  (code/__HELPERS/unsorted.dm:1254)  may sleep
rt.def("/proc/______qdel_list_wrapper", function* ______qdel_list_wrapper(f: Frame, L: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [L, I, $e];
	if (!truthy(live(L))) return f.dot;
	I = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(L), "Cut", []);
	return f.dot;
}, true, { argTypes: [{ path: "/list" }] });

// /proc/random_nukecode  (code/__HELPERS/unsorted.dm:1259)
rt.def("/proc/random_nukecode", function random_nukecode(f: Frame) {
	let val: Value = null, str: Value = null;
	f.vars = () => [val, str];
	val = rt.call(f, P("/proc/rand"), null, [0, 99999]);
	str = fmt("＀", [live(val)]);
	while (rt.lt(rt.length(live(str)), 5)) {
		str = add("0", live(str));
	}
	f.dot = live(str);
	return f.dot;
});

// /atom/proc/Shake  (code/__HELPERS/unsorted.dm:1266)
rt.def("/atom/proc/Shake", function Shake(f: Frame, pixelshiftx: Value, pixelshifty: Value, duration: Value) {
	let initialpixelx: Value = null, initialpixely: Value = null, shiftx: Value = null, shifty: Value = null;
	f.vars = () => [pixelshiftx, pixelshifty, duration, initialpixelx, initialpixely, shiftx, shifty];
	if (live(pixelshiftx) === null) {
		pixelshiftx = 15;
	}
	if (live(pixelshifty) === null) {
		pixelshifty = 15;
	}
	if (live(duration) === null) {
		duration = 250;
	}
	initialpixelx = rt.sv(f, "pixel_x");
	initialpixely = rt.sv(f, "pixel_y");
	shiftx = rt.call(f, P("/proc/rand"), null, [rt.neg(live(pixelshiftx)), live(pixelshiftx)]);
	shifty = rt.call(f, P("/proc/rand"), null, [rt.neg(live(pixelshifty)), live(pixelshifty)]);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(shiftx)), "pixel_y", add(rt.sv(f, "pixel_y"), live(shifty)), "time", 0.20000000298023224, "loop", live(duration)]);
	rt.setSv(f, "pixel_x", live(initialpixelx));
	rt.setSv(f, "pixel_y", live(initialpixely));
	return f.dot;
});

// /proc/weightclass2text  (code/__HELPERS/unsorted.dm:1275)
rt.def("/proc/weightclass2text", function weightclass2text(f: Frame, w_class: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(w_class);
	if ($0 === 1) {
		f.dot = "tiny";
	} else if ($0 === 2) {
		f.dot = "small";
	} else if ($0 === 3) {
		f.dot = "normal-sized";
	} else if ($0 === 4) {
		f.dot = "bulky";
	} else if ($0 === 5) {
		f.dot = "huge";
	} else if ($0 === 6) {
		f.dot = "gigantic";
	} else {
		f.dot = "";
	}
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldview_mob  (code/__HELPERS/unsorted.dm:1291)  may sleep
rt.def("/datum/controller/global_vars/proc/InitGlobaldview_mob", function* InitGlobaldview_mob(f: Frame) {
	rt.setGl("dview_mob", (yield* g.new_(f, T("/mob/dview"), [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "dview_mob", add);
	return f.dot;
}, true);

// /proc/dview  (code/__HELPERS/unsorted.dm:1295)
rt.def("/proc/dview", function dview(f: Frame, range: Value, center: Value, invis_flags: Value) {
	f.vars = () => [range, invis_flags];
	if (live(range) === null) {
		range = rt.fv(f, "view", rt.world());
	}
	if (live(invis_flags) === null) {
		invis_flags = 0;
	}
	if (!truthy(live(center))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", rt.gl("dview_mob"), live(center));
	rt.setFv(f, "see_invisible", rt.gl("dview_mob"), live(invis_flags));
	f.dot = rt.call(f, P("/proc/view"), null, [live(range), rt.gl("dview_mob")]);
	rt.setFv(f, "loc", rt.gl("dview_mob"), null);
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

// /mob/dview/proc/Destroy  (code/__HELPERS/unsorted.dm:1314)  may sleep
rt.def("/mob/dview/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (!truthy(rt.sv(f, "ready_to_die"))) {
		yield* g.call(f, P("/proc/stack_trace"), null, ["ALRIGHT WHICH FUCKER TRIED TO DELETE *MY* DVIEW?"]);
		if (!truthy(live(f.args[0]))) {
			return 1;
		}
		yield* g.call(f, P("/proc/log_world"), null, ["EVACUATE THE SHITCODE IS TRYING TO STEAL MUH JOBS"]);
		rt.setGl("dview_mob", (yield* g.new_(f, T("/mob/dview"), [])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["force"] });

// /proc/valid_window_location  (code/__HELPERS/unsorted.dm:1334)
rt.def("/proc/valid_window_location", function valid_window_location(f: Frame, _T: Value, dir_to_check: Value) {
	let O: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [O, W, $e];
	if (!truthy(live(_T))) {
		return 0;
	}
	O = null;
	rt.forList(f, 0, live(_T), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy((rt.istype(live(O), T("/obj/machinery/door/window")) ? 1 : 0)) && (isEqual(rt.fv(f, "dir", live(O)), live(dir_to_check)) || isEqual(live(dir_to_check), 5)))) {
			return 0;
		}
		if (truthy((rt.istype(live(O), T("/obj/structure/windoor_assembly")) ? 1 : 0))) {
			if ((isEqual(rt.gv(f, "ini_dir", (W = live(O))), live(dir_to_check)) || isEqual(live(dir_to_check), 5))) {
				return 0;
			}
		}
		if (truthy((rt.istype(live(O), T("/obj/structure/window")) ? 1 : 0))) {
			if (((isEqual(rt.gv(f, "ini_dir", (W = live(O))), live(dir_to_check)) || isEqual(rt.fv(f, "ini_dir", live(W)), 5)) || isEqual(live(dir_to_check), 5))) {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /proc/get_mob_or_brainmob  (code/__HELPERS/unsorted.dm:1414)
rt.def("/proc/get_mob_or_brainmob", function get_mob_or_brainmob(f: Frame, occupant: Value) {
	let mob_occupant: Value = null, head: Value = null, brain: Value = null;
	f.vars = () => [mob_occupant, head, brain];
	mob_occupant = null;
	if (truthy((rt.istype(live(occupant), T("/mob/living")) ? 1 : 0))) {
		mob_occupant = live(occupant);
	} else {
		if (truthy((rt.istype(live(occupant), T("/obj/item/bodypart")) ? 1 : 0))) {
			mob_occupant = rt.gv(f, "brainmob", (head = live(occupant)));
		} else {
			if (truthy((rt.istype(live(occupant), T("/obj/item/organ")) ? 1 : 0))) {
				mob_occupant = rt.gv(f, "brainmob", (brain = live(occupant)));
			}
		}
	}
	return live(mob_occupant);
});

// /proc/BitCount  (code/__HELPERS/unsorted.dm:1431)
rt.def("/proc/BitCount", function BitCount(f: Frame, bitfield: Value) {
	let temp: Value = null;
	f.vars = () => [temp];
	return (temp = rt.modulus(rt.bitAnd(add((temp = subtract(subtract(live(bitfield), rt.bitAnd(rt.shiftRight(live(bitfield), 1), 46811)), rt.bitAnd(rt.shiftRight(live(bitfield), 2), 37449))), rt.shiftRight(live(temp), 3)), 29127), 63));
});
