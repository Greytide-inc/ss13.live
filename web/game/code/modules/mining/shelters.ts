// Based on /tg/station's code/modules/mining/shelters.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(859, "/datum/map_template/shelter", "/datum/map_template", {
	shelter_id: null,
	description: null,
	blacklisted_turfs: null,
	whitelisted_turfs: null,
	banned_areas: null,
	banned_objects: null,
});

// shelters.dm:10
rt.def("/datum/map_template/shelter/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.blacklisted_turfs = typecacheof(T("/turf/closed"));
	this.whitelisted_turfs = list();
	this.banned_areas = typecacheof(T("/area/shuttle"));
	this.banned_objects = list();
	return f.dot;
}, true);

// shelters.dm:17
rt.def("/datum/map_template/shelter/proc/check_deploy", function check_deploy(f: Frame, deploy_location: Value) {
	let _T: Value = null, A: Value = null, banned: Value = null, permitted: Value = null, O: Value = null;
	let affected: Value = this.get_affected_turfs(deploy_location, { centered: 1 });
	for (_T of each(affected, T("/turf"))) {
		if (is_type_in_typecache((A = get_area(_T)), this.banned_areas)) {
			return "bad area";
		}
		banned = is_type_in_typecache(_T, this.blacklisted_turfs);
		permitted = is_type_in_typecache(_T, this.whitelisted_turfs);
		if (banned && !permitted) {
			return "bad turfs";
		}
		O = null;
		for (O of each(_T, T("/obj"))) {
			if (O.density && O.anchored || is_type_in_typecache(O, this.banned_objects)) {
				return "anchored objects";
			}
		}
	}
	return "allowed";
});

rt.type(860, "/datum/map_template/shelter/alpha", "/datum/map_template/shelter", {
	name: "Shelter Alpha",
	shelter_id: "shelter_alpha",
	description: "A cosy self-contained pressurized shelter, with built-in navigation, entertainment, medical facilities and a sleeping area! Order now, and we'll throw in a TINY FAN, absolutely free!",
	mappath: "_maps/templates/shelter_1.dmm",
});

// shelters.dm:43
rt.def("/datum/map_template/shelter/alpha/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.whitelisted_turfs = typecacheof(T("/turf/closed/mineral"));
	this.banned_objects = typecacheof(T("/obj/structure/stone_tile"));
	return f.dot;
}, true);

rt.type(861, "/datum/map_template/shelter/beta", "/datum/map_template/shelter", {
	name: "Shelter Beta",
	shelter_id: "shelter_beta",
	description: "An extremly luxurious shelter, containing all the amenities of home, including carpeted floors, hot and cold running water, a gourmet three course meal, cooking facilities, and a deluxe companion to keep you from getting lonely during an ash storm.",
	mappath: "_maps/templates/shelter_2.dmm",
});

// shelters.dm:58
rt.def("/datum/map_template/shelter/beta/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	this.whitelisted_turfs = typecacheof(T("/turf/closed/mineral"));
	this.banned_objects = typecacheof(T("/obj/structure/stone_tile"));
	return f.dot;
}, true);
