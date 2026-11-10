// Based on /tg/station's code/game/gamemodes/blob/blobs/shield.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// shield.dm:12
rt.def("/obj/structure/blob/shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 90, "acid", 90]);
	return f.dot;
});

// shield.dm:18
rt.def("/obj/structure/blob/shield/proc/scannerreport", function scannerreport(f: Frame) {
	if (this.atmosblock) {
		return "Will prevent the spread of atmospheric changes.";
	}
	return "N/A";
});

// shield.dm:25
rt.def("/obj/structure/blob/shield/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.obj_integrity <= 75) {
		this.icon_state = "blob_shield_damaged";
		this.name = "weakened strong blob";
		this.desc = "A wall of twitching tendrils.";
		this.atmosblock = 0;
	} else {
		this.icon_state = rt.initial(f, this, "icon_state");
		this.name = rt.initial(f, this, "name");
		this.desc = rt.initial(f, this, "desc");
		this.atmosblock = 1;
	}
	this.air_update_turf(1);
	return f.dot;
});
