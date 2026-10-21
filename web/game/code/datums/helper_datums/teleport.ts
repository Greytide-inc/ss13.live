// From code/datums/helper_datums/teleport.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/do_teleport  (code/datums/helper_datums/teleport.dm:3)  may sleep
rt.def("/proc/do_teleport", function* do_teleport(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = null;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	if (live(f.args[6]) === null) {
		f.args[6] = null;
	}
	if (live(f.args[7]) === null) {
		f.args[7] = null;
	}
	if (truthy((yield* g.callName(f, (D = (yield* g.new_(f, T("/datum/teleport/instant/science"), []))), "start", [f.argsList], rt.Args.List)))) {
		return 1;
	}
	return 0;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

rt.type(1047, "/datum/teleport", "/datum", {
	teleatom: null,
	destination: null,
	precision: 0,
	effectin: null,
	effectout: null,
	soundin: null,
	soundout: null,
	force_teleport: 1,
});

// /datum/teleport/proc/start  (code/datums/helper_datums/teleport.dm:19)  may sleep
rt.def("/datum/teleport/proc/start", function* start(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = null;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	if (live(f.args[6]) === null) {
		f.args[6] = null;
	}
	if (live(f.args[7]) === null) {
		f.args[7] = null;
	}
	if (!truthy((yield* g.callSrc(f, "initTeleport", [f.argsList], rt.Args.List)))) {
		return 0;
	}
	return 1;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

// /datum/teleport/proc/initTeleport  (code/datums/helper_datums/teleport.dm:24)  may sleep
rt.def("/datum/teleport/proc/initTeleport", function* initTeleport(f: Frame, ateleatom: Value, adestination: Value, aprecision: Value, afteleport: Value, aeffectin: Value, aeffectout: Value, asoundin: Value, asoundout: Value) {
	f.vars = () => [ateleatom, adestination, aprecision, afteleport, aeffectin, aeffectout, asoundin, asoundout];
	if (!truthy((yield* g.srcCall(f, "setTeleatom", live(ateleatom))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "setDestination", live(adestination))))) {
		return 0;
	}
	if (!truthy((yield* g.srcCall(f, "setPrecision", live(aprecision))))) {
		return 0;
	}
	yield* g.srcCall(f, "setEffects", live(aeffectin), live(aeffectout));
	yield* g.srcCall(f, "setForceTeleport", live(afteleport));
	yield* g.srcCall(f, "setSounds", live(asoundin), live(asoundout));
	return 1;
}, true);

// /datum/teleport/proc/setPrecision  (code/datums/helper_datums/teleport.dm:37)
rt.def("/datum/teleport/proc/setPrecision", function setPrecision(f: Frame, aprecision: Value) {
	if (truthy(rt.call(f, P("/proc/isnum"), null, [live(aprecision)]))) {
		rt.setSv(f, "precision", live(aprecision));
		return 1;
	}
	return 0;
});

// /datum/teleport/proc/setDestination  (code/datums/helper_datums/teleport.dm:44)
rt.def("/datum/teleport/proc/setDestination", function setDestination(f: Frame, adestination: Value) {
	if (truthy((rt.istype(live(adestination), T("/atom")) ? 1 : 0))) {
		rt.setSv(f, "destination", live(adestination));
		return 1;
	}
	return 0;
});

// /datum/teleport/proc/setTeleatom  (code/datums/helper_datums/teleport.dm:51)  may sleep
rt.def("/datum/teleport/proc/setTeleatom", function* setTeleatom(f: Frame, ateleatom: Value) {
	f.vars = () => [ateleatom];
	if ((truthy((rt.istype(live(ateleatom), T("/obj/effect")) ? 1 : 0)) && !truthy((rt.istype(live(ateleatom), T("/obj/effect/dummy/chameleon")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(ateleatom)]);
		return 0;
	}
	if (truthy((rt.istype(live(ateleatom), T("/atom/movable")) ? 1 : 0))) {
		rt.setSv(f, "teleatom", live(ateleatom));
		return 1;
	}
	return 0;
}, true);

// /datum/teleport/proc/setEffects  (code/datums/helper_datums/teleport.dm:62)
rt.def("/datum/teleport/proc/setEffects", function setEffects(f: Frame, aeffectin: Value, aeffectout: Value) {
	let $0: any;
	f.vars = () => [aeffectin, aeffectout, $0];
	if (live(aeffectin) === null) {
		aeffectin = null;
	}
	if (live(aeffectout) === null) {
		aeffectout = null;
	}
	if (truthy((rt.istype(live(aeffectin), T("/datum/effect_system")) ? 1 : 0))) {
		$0 = live(aeffectin);
	} else {
		$0 = null;
	}
	rt.setSv(f, "effectin", $0);
	if (truthy((rt.istype(live(aeffectout), T("/datum/effect_system")) ? 1 : 0))) {
		$0 = live(aeffectout);
	} else {
		$0 = null;
	}
	rt.setSv(f, "effectout", $0);
	return 1;
});

// /datum/teleport/proc/setForceTeleport  (code/datums/helper_datums/teleport.dm:68)
rt.def("/datum/teleport/proc/setForceTeleport", function setForceTeleport(f: Frame, afteleport: Value) {
	rt.setSv(f, "force_teleport", live(afteleport));
	return 1;
});

// /datum/teleport/proc/setSounds  (code/datums/helper_datums/teleport.dm:73)
rt.def("/datum/teleport/proc/setSounds", function setSounds(f: Frame, asoundin: Value, asoundout: Value) {
	let $0: any;
	f.vars = () => [asoundin, asoundout, $0];
	if (live(asoundin) === null) {
		asoundin = null;
	}
	if (live(asoundout) === null) {
		asoundout = null;
	}
	if (truthy(rt.call(f, P("/proc/isfile"), null, [live(asoundin)]))) {
		$0 = live(asoundin);
	} else {
		$0 = null;
	}
	rt.setSv(f, "soundin", $0);
	if (truthy(rt.call(f, P("/proc/isfile"), null, [live(asoundout)]))) {
		$0 = live(asoundout);
	} else {
		$0 = null;
	}
	rt.setSv(f, "soundout", $0);
	return 1;
});

// /datum/teleport/proc/playSpecials  (code/datums/helper_datums/teleport.dm:84)
rt.def("/datum/teleport/proc/playSpecials", function playSpecials(f: Frame, location: Value, effect: Value, sound: Value) {
	if (!truthy(live(location))) return f.dot;
	if (truthy(live(effect))) {
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/teleport/proc/do_effect"), live(location), live(effect)]);
	}
	if (!truthy(live(sound))) return f.dot;
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/datum/teleport/proc/do_sound"), live(location), live(sound)]);
	return f.dot;
});

// /datum/teleport/proc/do_effect  (code/datums/helper_datums/teleport.dm:90)  may sleep
rt.def("/datum/teleport/proc/do_effect", function* do_effect(f: Frame, location: Value, effect: Value) {
	f.vars = () => [location, effect];
	f.src = null;
	yield* g.callName(f, live(effect), "attach", [live(location)]);
	yield* g.callName(f, live(effect), "start", []);
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }, { path: "/datum/effect_system" }] });

// /datum/teleport/proc/do_sound  (code/datums/helper_datums/teleport.dm:95)
rt.def("/datum/teleport/proc/do_sound", function do_sound(f: Frame, location: Value, sound: Value) {
	f.src = null;
	rt.call(f, P("/proc/playsound"), null, [live(location), live(sound), 60, 1]);
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }, {  }] });

// /datum/teleport/proc/doTeleport  (code/datums/helper_datums/teleport.dm:101)  may sleep
rt.def("/datum/teleport/proc/doTeleport", function* doTeleport(f: Frame) {
	let destturf: Value = null, curturf: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [destturf, curturf, A, $0, $1, $2, $3];
	destturf = null;
	curturf = rt.getStep(f, rt.sv(f, "teleatom"), 0);
	if (((!truthy((destturf = (yield* g.call(f, P("/proc/get_teleport_turf"), null, [rt.getStep(f, rt.sv(f, "destination"), 0), rt.sv(f, "precision")])))) || !truthy(live(curturf))) || truthy((yield* g.callName(f, live(destturf), "is_transition_turf", []))))) {
		return 0;
	}
	if (truthy(rt.gv(f, "noteleport", (A = (yield* g.call(f, P("/proc/get_area"), null, [live(curturf)])))))) {
		return 0;
	}
	yield* g.srcCall(f, "playSpecials", live(curturf), rt.sv(f, "effectin"), rt.sv(f, "soundin"));
	if (truthy(rt.sv(f, "force_teleport"))) {
		yield* g.callName(f, rt.sv(f, "teleatom"), "forceMove", [live(destturf)]);
		if (truthy((rt.istype(rt.sv(f, "teleatom"), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
			$0 = rt.sv(f, "teleatom");
			$1 = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "teleatom")]);
			if (truthy(live(curturf))) {
				$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(curturf)), rt.fv(f, "y", live(curturf)), rt.fv(f, "z", live(curturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(curturf)), rt.fv(f, "y", live(curturf)), rt.fv(f, "z", live(curturf))])]);
			} else {
				$2 = "nonexistent location";
			}
			$2 = fmt("＀", [$2]);
			if (truthy(live(destturf))) {
				$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(destturf)), rt.fv(f, "y", live(destturf)), rt.fv(f, "z", live(destturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(destturf)), rt.fv(f, "y", live(destturf)), rt.fv(f, "z", live(destturf))])]);
			} else {
				$3 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ has teleported from ＀ to ＀.", [$0, $1, $2, fmt("＀", [$3])])]);
		}
		yield* g.srcCall(f, "playSpecials", live(destturf), rt.sv(f, "effectout"), rt.sv(f, "soundout"));
	} else {
		if (truthy((yield* g.callName(f, rt.sv(f, "teleatom"), "Move", [live(destturf)])))) {
			yield* g.srcCall(f, "playSpecials", live(destturf), rt.sv(f, "effectout"), rt.sv(f, "soundout"));
			if (truthy((rt.istype(rt.sv(f, "teleatom"), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0))) {
				$0 = rt.sv(f, "teleatom");
				$1 = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "teleatom")]);
				if (truthy(live(curturf))) {
					$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(curturf)), rt.fv(f, "y", live(curturf)), rt.fv(f, "z", live(curturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(curturf)), rt.fv(f, "y", live(curturf)), rt.fv(f, "z", live(curturf))])]);
				} else {
					$2 = "nonexistent location";
				}
				$2 = fmt("＀", [$2]);
				if (truthy(live(destturf))) {
					$3 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(destturf)), rt.fv(f, "y", live(destturf)), rt.fv(f, "z", live(destturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(destturf)), rt.fv(f, "y", live(destturf)), rt.fv(f, "z", live(destturf))])]);
				} else {
					$3 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ ＀ has teleported from ＀ to ＀.", [$0, $1, $2, fmt("＀", [$3])])]);
			}
		}
	}
	return 1;
}, true);

// /datum/teleport/proc/teleport  (code/datums/helper_datums/teleport.dm:125)  may sleep
rt.def("/datum/teleport/proc/teleport", function* teleport(f: Frame) {
	if (truthy((yield* g.srcCall(f, "teleportChecks")))) {
		return (yield* g.srcCall(f, "doTeleport"));
	}
	return 0;
}, true);

rt.type(1048, "/datum/teleport/instant", "/datum/teleport", {});

// /datum/teleport/instant/proc/start  (code/datums/helper_datums/teleport.dm:132)  may sleep
rt.def("/datum/teleport/instant/proc/start", function* start(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = null;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	if (live(f.args[6]) === null) {
		f.args[6] = null;
	}
	if (live(f.args[7]) === null) {
		f.args[7] = null;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if (truthy((yield* g.srcCall(f, "teleport")))) {
			return 1;
		}
	}
	return 0;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

rt.type(1049, "/datum/teleport/instant/science", "/datum/teleport/instant", {});

// /datum/teleport/instant/science/proc/setEffects  (code/datums/helper_datums/teleport.dm:141)
rt.def("/datum/teleport/instant/science/proc/setEffects", function setEffects(f: Frame) {
	let aeffect: Value = null;
	f.vars = () => [aeffect];
	if ((live(f.args[0]) === null || live(f.args[1]) === null)) {
		rt.callName(f, (aeffect = rt.new_(f, T("/datum/effect_system/spark_spread"), [])), "set_up", [5, 1, rt.sv(f, "teleatom")]);
		rt.setSv(f, "effectin", (rt.sv(f, "effectin") || live(aeffect)));
		rt.setSv(f, "effectout", (rt.sv(f, "effectout") || live(aeffect)));
		return 1;
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["aeffectin", "aeffectout"] });

// /datum/teleport/instant/science/proc/setPrecision  (code/datums/helper_datums/teleport.dm:151)
rt.def("/datum/teleport/instant/science/proc/setPrecision", function setPrecision(f: Frame) {
	let bagholding: Value = null, MM: Value = null;
	f.vars = () => [bagholding, MM];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(rt.sv(f, "teleatom"), T("/obj/item/weapon/storage/backpack/holding")) ? 1 : 0))) {
		rt.setSv(f, "precision", rt.call(f, P("/proc/rand"), null, [1, 100]));
	}
	if (truthy(rt.getLen(f, (bagholding = rt.callName(f, rt.sv(f, "teleatom"), "search_contents_for", [T("/obj/item/weapon/storage/backpack/holding")]))))) {
		rt.setSv(f, "precision", rt.call(f, P("/proc/max"), null, [multiply(rt.call(f, P("/proc/rand"), null, [1, 100]), rt.len(f, live(bagholding))), 100]));
		if (truthy((rt.istype(rt.sv(f, "teleatom"), T("/mob/living")) ? 1 : 0))) {
			rt.call(f, P("/proc/to_chat"), null, [(MM = rt.sv(f, "teleatom")), "<span class='warning'>The bluespace interface on your bag of holding interferes with the teleport!</span>"]);
		}
	}
	return 1;
}, false, { args: ["aprecision"] });

// /proc/find_safe_turf  (code/datums/helper_datums/teleport.dm:166)
rt.def("/proc/find_safe_turf", function find_safe_turf(f: Frame, zlevel: Value, zlevels: Value, extended_safety_checks: Value) {
	let cycles: Value = null, cycle: Value = null, x: Value = null, y: Value = null, z: Value = null, random_location: Value = null, F: Value = null, A: Value = null, A_gases: Value = null, trace_gases: Value = null, id: Value = null, pressure: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [zlevel, zlevels, extended_safety_checks, cycles, cycle, x, y, z, random_location, F, A, A_gases, trace_gases, id, pressure, L, $e];
	if (live(zlevel) === null) {
		zlevel = 2;
	}
	if (live(extended_safety_checks) === null) {
		extended_safety_checks = 0;
	}
	if (!truthy(live(zlevels))) {
		zlevels = rt.list(live(zlevel));
	}
	cycles = 1000;
	cycle = null;
	rt.forRange(f, 0, 1, live(cycles), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		cycle = $e;
		x = rt.call(f, P("/proc/rand"), null, [1, rt.fv(f, "maxx", rt.world())]);
		y = rt.call(f, P("/proc/rand"), null, [1, rt.fv(f, "maxy", rt.world())]);
		z = rt.op(f, "PickUnweighted", [1], [live(zlevels)]);
		if (!truthy((rt.istype((random_location = rt.locate(live(x), live(y), live(z))), T("/turf/open/floor")) ? 1 : 0))) {
			continue;
		}
		if (!truthy(rt.gv(f, "air", (F = live(random_location))))) {
			continue;
		}
		A = rt.fv(f, "air", live(F));
		A_gases = rt.fv(f, "gases", live(A));
		trace_gases = null;
		id = null;
		rt.forList(f, 1, live(A_gases));
		while (($e = rt.next(f, 1)) !== undefined) {
			id = $e;
			if (truthy((rt.isIn(f, live(id), rt.gl("hardcoded_gases")) ? 1 : 0))) {
				continue;
			}
			trace_gases = 1;
			break;
		}
		rt.endFor(f, 1);
		if (truthy(live(trace_gases))) {
			continue;
		}
		if (!(truthy(rt.at(live(A_gases), "o2")) && rt.ge(rt.index(rt.at(live(A_gases), "o2"), 1), 16))) {
			continue;
		}
		if (truthy(rt.at(live(A_gases), "plasma"))) {
			continue;
		}
		if ((truthy(rt.at(live(A_gases), "co2")) && rt.ge(rt.index(rt.at(live(A_gases), "co2"), 1), 10))) {
			continue;
		}
		if ((rt.le(rt.fv(f, "temperature", live(A)), 270) || rt.ge(rt.fv(f, "temperature", live(A)), 360))) {
			continue;
		}
		if ((rt.le((pressure = rt.callName(f, live(A), "return_pressure", [])), 20) || rt.ge(live(pressure), 550))) {
			continue;
		}
		if (truthy(live(extended_safety_checks))) {
			if (truthy((rt.istype(live(F), T("/turf/open/floor/plating/lava")) ? 1 : 0))) {
				if (!truthy(rt.callName(f, (L = live(F)), "is_safe", []))) {
					continue;
				}
			}
		}
		return live(F);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /proc/get_teleport_turfs  (code/datums/helper_datums/teleport.dm:218)
rt.def("/proc/get_teleport_turfs", function get_teleport_turfs(f: Frame, center: Value, precision: Value) {
	let posturfs: Value = null, _T: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [precision, posturfs, _T, A, $e];
	if (live(precision) === null) {
		precision = 0;
	}
	if (!truthy(live(precision))) {
		return rt.list(live(center));
	}
	posturfs = rt.list();
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [live(precision), live(center)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.callName(f, live(_T), "is_transition_turf", []))) {
			continue;
		}
		if (!truthy(rt.gv(f, "noteleport", (A = rt.fv(f, "loc", live(_T)))))) {
			rt.callName(f, live(posturfs), "Add", [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return live(posturfs);
});

// /proc/get_teleport_turf  (code/datums/helper_datums/teleport.dm:230)
rt.def("/proc/get_teleport_turf", function get_teleport_turf(f: Frame, center: Value, precision: Value) {
	f.vars = () => [precision];
	if (live(precision) === null) {
		precision = 0;
	}
	return rt.call(f, P("/proc/safepick"), null, [rt.call(f, P("/proc/get_teleport_turfs"), null, [live(center), live(precision)])]);
});
