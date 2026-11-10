// Based on /tg/station's code/game/objects/structures/crates_lockers/closets/secure/bar.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12357, "/obj/structure/closet/secure_closet/bar", "/obj/structure/closet/secure_closet", {
	name: "booze storage",
	req_access: null,
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// bar.dm:3
rt.def("/obj/structure/closet/secure_closet/bar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(25);
	return f.dot;
});

// bar.dm:10
rt.def("/obj/structure/closet/secure_closet/bar/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	yield* parent_proc();
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/beer"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
