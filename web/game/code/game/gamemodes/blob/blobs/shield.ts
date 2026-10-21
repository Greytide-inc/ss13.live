// From code/game/gamemodes/blob/blobs/shield.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12145, "/obj/structure/blob/shield", "/obj/structure/blob", {
	brute_resist: 0.25,
	explosion_block: 3,
	point_return: 4,
	atmosblock: 1,
	name: "strong blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blob_shield",
	desc: "A solid wall of slightly twitching tendrils.",
	obj_integrity: 150,
	max_integrity: 150,
	armor: null,
});

// /obj/structure/blob/shield/proc/<init>  (code/game/gamemodes/blob/blobs/shield.dm:12)
rt.def("/obj/structure/blob/shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]));
	return f.dot;
});

// /obj/structure/blob/shield/proc/scannerreport  (code/game/gamemodes/blob/blobs/shield.dm:18)
rt.def("/obj/structure/blob/shield/proc/scannerreport", function scannerreport(f: Frame) {
	if (truthy(rt.sv(f, "atmosblock"))) {
		return "Will prevent the spread of atmospheric changes.";
	}
	return "N/A";
});

// /obj/structure/blob/shield/proc/update_icon  (code/game/gamemodes/blob/blobs/shield.dm:25)
rt.def("/obj/structure/blob/shield/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.le(rt.sv(f, "obj_integrity"), 75)) {
		rt.setSv(f, "icon_state", "blob_shield_damaged");
		rt.setSv(f, "name", "weakened strong blob");
		rt.setSv(f, "desc", "A wall of twitching tendrils.");
		rt.setSv(f, "atmosblock", 0);
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
		rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		rt.setSv(f, "atmosblock", 1);
	}
	rt.callSrc(f, "air_update_turf", [1]);
	return f.dot;
});
