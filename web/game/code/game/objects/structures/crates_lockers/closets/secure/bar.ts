// From code/game/objects/structures/crates_lockers/closets/secure/bar.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12357, "/obj/structure/closet/secure_closet/bar", "/obj/structure/closet/secure_closet", {
	name: "booze storage",
	req_access: null,
	icon_state: "cabinet",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// /obj/structure/closet/secure_closet/bar/proc/<init>  (code/game/objects/structures/crates_lockers/closets/secure/bar.dm:3)
rt.def("/obj/structure/closet/secure_closet/bar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(25));
	return f.dot;
});

// /obj/structure/closet/secure_closet/bar/proc/PopulateContents  (code/game/objects/structures/crates_lockers/closets/secure/bar.dm:10)  may sleep
rt.def("/obj/structure/closet/secure_closet/bar/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/beer"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
