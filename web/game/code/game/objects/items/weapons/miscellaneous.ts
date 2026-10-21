// From code/game/objects/items/weapons/miscellaneous.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7308, "/obj/item/weapon/skub", "/obj/item/weapon", {
	desc: "It's skub.",
	name: "skub",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "skub",
	w_class: 4,
	attack_verb: null,
});

// /obj/item/weapon/skub/proc/<init>  (code/game/objects/items/weapons/miscellaneous.dm:19)
rt.def("/obj/item/weapon/skub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("skubbed"));
	return f.dot;
});
