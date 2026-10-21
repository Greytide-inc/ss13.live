// From code/modules/clothing/under/syndicate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8336, "/obj/item/clothing/under/syndicate", "/obj/item/clothing/under", {
	name: "tactical turtleneck",
	desc: "A non-descript and slightly suspicious looking turtleneck with digital camouflage cargo pants.",
	icon_state: "syndicate",
	item_state: "bl_suit",
	item_color: "syndicate",
	has_sensor: 0,
	armor: null,
	alt_covers_chest: 1,
});

// /obj/item/clothing/under/syndicate/proc/<init>  (code/modules/clothing/under/syndicate.dm:8)
rt.def("/obj/item/clothing/under/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 40]));
	return f.dot;
});

rt.type(8338, "/obj/item/clothing/under/syndicate/tacticool", "/obj/item/clothing/under/syndicate", {
	name: "tacticool turtleneck",
	desc: "Just looking at it makes you want to buy an SKS, go into the woods, and -operate-.",
	icon_state: "tactifool",
	item_state: "bl_suit",
	item_color: "tactifool",
	armor: null,
});

// /obj/item/clothing/under/syndicate/tacticool/proc/<init>  (code/modules/clothing/under/syndicate.dm:17)
rt.def("/obj/item/clothing/under/syndicate/tacticool/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 40]));
	return f.dot;
});

rt.type(8341, "/obj/item/clothing/under/syndicate/soviet", "/obj/item/clothing/under/syndicate", {
	name: "Ratnik 5 tracksuit",
	desc: "Badly translated labels tell you to clean this in Vodka. Great for squatting in.",
	icon_state: "trackpants",
	item_color: "trackpants",
	can_adjust: 0,
	armor: null,
	resistance_flags: 0,
});

// /obj/item/clothing/under/syndicate/soviet/proc/<init>  (code/modules/clothing/under/syndicate.dm:39)
rt.def("/obj/item/clothing/under/syndicate/soviet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});
