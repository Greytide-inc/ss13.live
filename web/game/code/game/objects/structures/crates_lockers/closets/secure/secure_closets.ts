// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/secure_closets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(12356, "/obj/structure/closet/secure_closet", "/obj/structure/closet", {
	locked: 1,
	secure: 1,
	name: "secure locker",
	desc: "It's a card-locked storage unit.",
	icon_state: "secure",
	obj_integrity: 250,
	max_integrity: 250,
	armor: null,
});

// secure_closets.dm:8
rt.def("/obj/structure/closet/secure_closet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 30, "bullet", 50, "laser", 50, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]);
	return f.dot;
});

// secure_closets.dm:12
rt.def("/obj/structure/closet/secure_closet/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if ((f.args[2] == "melee" && f.args[0] < 20)) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });
