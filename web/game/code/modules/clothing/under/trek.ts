// From code/modules/clothing/under/trek.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8440, "/obj/item/clothing/under/trek/engsec", "/obj/item/clothing/under/trek", {
	name: "engsec uniform",
	desc: "The uniform worn by engineering/security officers",
	icon_state: "trek_engsec",
	item_color: "trek_engsec",
	item_state: "r_suit",
	armor: null,
	strip_delay: 50,
});

// /obj/item/clothing/under/trek/engsec/proc/<init>  (code/modules/clothing/under/trek.dm:22)
rt.def("/obj/item/clothing/under/trek/engsec/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});
