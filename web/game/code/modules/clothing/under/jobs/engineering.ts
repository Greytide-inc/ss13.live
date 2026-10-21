// From code/modules/clothing/under/jobs/engineering.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8310, "/obj/item/clothing/under/rank/chief_engineer", "/obj/item/clothing/under/rank", {
	desc: "It's a high visibility jumpsuit given to those engineers insane enough to achieve the rank of \"Chief Engineer\". It has minor radiation shielding.",
	name: "chief engineer's jumpsuit",
	icon_state: "chiefengineer",
	item_state: "gy_suit",
	item_color: "chief",
	armor: null,
	resistance_flags: 0,
});

// /obj/item/clothing/under/rank/chief_engineer/proc/<init>  (code/modules/clothing/under/jobs/engineering.dm:8)
rt.def("/obj/item/clothing/under/rank/chief_engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 10, "fire", 80, "acid", 40]));
	return f.dot;
});

rt.type(8312, "/obj/item/clothing/under/rank/engineer", "/obj/item/clothing/under/rank", {
	desc: "It's an orange high visibility jumpsuit worn by engineers. It has minor radiation shielding.",
	name: "engineer's jumpsuit",
	icon_state: "engine",
	item_state: "engi_suit",
	item_color: "engine",
	armor: null,
	resistance_flags: 0,
});

// /obj/item/clothing/under/rank/engineer/proc/<init>  (code/modules/clothing/under/jobs/engineering.dm:25)
rt.def("/obj/item/clothing/under/rank/engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 10, "fire", 60, "acid", 20]));
	return f.dot;
});
