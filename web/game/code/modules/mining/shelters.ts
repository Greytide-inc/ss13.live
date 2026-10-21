// From code/modules/mining/shelters.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(859, "/datum/map_template/shelter", "/datum/map_template", {
	shelter_id: null,
	description: null,
	blacklisted_turfs: null,
	whitelisted_turfs: null,
	banned_areas: null,
	banned_objects: null,
});

// /datum/map_template/shelter/proc/New  (code/modules/mining/shelters.dm:10)  may sleep
rt.def("/datum/map_template/shelter/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "blacklisted_turfs", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/turf/closed")])));
	rt.setSv(f, "whitelisted_turfs", rt.list());
	rt.setSv(f, "banned_areas", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/area/shuttle")])));
	rt.setSv(f, "banned_objects", rt.list());
	return f.dot;
}, true);

// /datum/map_template/shelter/proc/check_deploy  (code/modules/mining/shelters.dm:17)
rt.def("/datum/map_template/shelter/proc/check_deploy", function check_deploy(f: Frame, deploy_location: Value) {
	let affected: Value = null, _T: Value = null, A: Value = null, banned: Value = null, permitted: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [affected, _T, A, banned, permitted, O, $e];
	affected = rt.callSrc(f, "get_affected_turfs", [null, live(deploy_location), "centered", 1], rt.Args.Named);
	_T = null;
	rt.forList(f, 0, live(affected), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [(A = rt.call(f, P("/proc/get_area"), null, [live(_T)])), rt.sv(f, "banned_areas")]))) {
			return "bad area";
		}
		banned = rt.call(f, P("/proc/is_type_in_typecache"), null, [live(_T), rt.sv(f, "blacklisted_turfs")]);
		permitted = rt.call(f, P("/proc/is_type_in_typecache"), null, [live(_T), rt.sv(f, "whitelisted_turfs")]);
		if ((truthy(live(banned)) && !truthy(live(permitted)))) {
			return "bad turfs";
		}
		O = null;
		rt.forList(f, 1, live(_T), T("/obj"));
		while (($e = rt.next(f, 1)) !== undefined) {
			O = $e;
			if (((truthy(rt.fv(f, "density", live(O))) && truthy(rt.fv(f, "anchored", live(O)))) || truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(O), rt.sv(f, "banned_objects")])))) {
				return "anchored objects";
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return "allowed";
});

rt.type(860, "/datum/map_template/shelter/alpha", "/datum/map_template/shelter", {
	name: "Shelter Alpha",
	shelter_id: "shelter_alpha",
	description: "A cosy self-contained pressurized shelter, with built-in navigation, entertainment, medical facilities and a sleeping area! Order now, and we'll throw in a TINY FAN, absolutely free!",
	mappath: "_maps/templates/shelter_1.dmm",
});

// /datum/map_template/shelter/alpha/proc/New  (code/modules/mining/shelters.dm:43)  may sleep
rt.def("/datum/map_template/shelter/alpha/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "whitelisted_turfs", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/turf/closed/mineral")])));
	rt.setSv(f, "banned_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/obj/structure/stone_tile")])));
	return f.dot;
}, true);

rt.type(861, "/datum/map_template/shelter/beta", "/datum/map_template/shelter", {
	name: "Shelter Beta",
	shelter_id: "shelter_beta",
	description: "An extremly luxurious shelter, containing all the amenities of home, including carpeted floors, hot and cold running water, a gourmet three course meal, cooking facilities, and a deluxe companion to keep you from getting lonely during an ash storm.",
	mappath: "_maps/templates/shelter_2.dmm",
});

// /datum/map_template/shelter/beta/proc/New  (code/modules/mining/shelters.dm:58)  may sleep
rt.def("/datum/map_template/shelter/beta/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "whitelisted_turfs", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/turf/closed/mineral")])));
	rt.setSv(f, "banned_objects", (yield* g.call(f, P("/proc/typecacheof"), null, [T("/obj/structure/stone_tile")])));
	return f.dot;
}, true);
