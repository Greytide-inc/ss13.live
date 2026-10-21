// From code/game/objects/structures/crates_lockers/closets/secure/secure_closets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/structure/closet/secure_closet/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/secure_closets.dm:8)
rt.def("/obj/structure/closet/secure_closet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 50, "laser", 50, "energy", 100, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]));
	return f.dot;
});

// /obj/structure/closet/secure_closet/proc/run_obj_armor  (code/game/objects/structures/crates_lockers/closets/secure/secure_closets.dm:12)
rt.def("/obj/structure/closet/secure_closet/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((isEqual(live(f.args[2]), "melee") && rt.lt(live(f.args[0]), 20))) {
		return 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });
