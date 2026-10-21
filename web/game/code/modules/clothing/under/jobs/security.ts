// From code/modules/clothing/under/jobs/security.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8291, "/obj/item/clothing/under/rank/security", "/obj/item/clothing/under/rank", {
	name: "security jumpsuit",
	desc: "A tactical security jumpsuit for officers complete with nanotrasen belt buckle.",
	icon_state: "rsecurity",
	item_state: "r_suit",
	item_color: "rsecurity",
	armor: null,
	strip_delay: 50,
	alt_covers_chest: 1,
	sensor_mode: 3,
	random_sensor: 0,
});

// /obj/item/clothing/under/rank/security/proc/<init>  (code/modules/clothing/under/jobs/security.dm:18)
rt.def("/obj/item/clothing/under/rank/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 30, "acid", 30]));
	return f.dot;
});

rt.type(8327, "/obj/item/clothing/under/rank/warden", "/obj/item/clothing/under/rank", {
	name: "security suit",
	desc: "A formal security suit for officers complete with nanotrasen belt buckle.",
	icon_state: "rwarden",
	item_state: "r_suit",
	item_color: "rwarden",
	armor: null,
	strip_delay: 50,
	alt_covers_chest: 1,
	sensor_mode: 3,
	random_sensor: 0,
});

// /obj/item/clothing/under/rank/warden/proc/<init>  (code/modules/clothing/under/jobs/security.dm:38)
rt.def("/obj/item/clothing/under/rank/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 30, "acid", 30]));
	return f.dot;
});

rt.type(8330, "/obj/item/clothing/under/rank/det", "/obj/item/clothing/under/rank", {
	name: "hard-worn suit",
	desc: "Someone who wears this means business.",
	icon_state: "detective",
	item_state: "det",
	item_color: "detective",
	armor: null,
	strip_delay: 50,
	alt_covers_chest: 1,
	sensor_mode: 3,
	random_sensor: 0,
});

// /obj/item/clothing/under/rank/det/proc/<init>  (code/modules/clothing/under/jobs/security.dm:60)
rt.def("/obj/item/clothing/under/rank/det/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 30, "acid", 30]));
	return f.dot;
});

rt.type(8332, "/obj/item/clothing/under/rank/head_of_security", "/obj/item/clothing/under/rank", {
	name: "head of security's jumpsuit",
	desc: "A security jumpsuit decorated for those few with the dedication to achieve the position of Head of Security.",
	icon_state: "rhos",
	item_state: "r_suit",
	item_color: "rhos",
	armor: null,
	strip_delay: 60,
	alt_covers_chest: 1,
	sensor_mode: 3,
	random_sensor: 0,
});

// /obj/item/clothing/under/rank/head_of_security/proc/<init>  (code/modules/clothing/under/jobs/security.dm:83)
rt.def("/obj/item/clothing/under/rank/head_of_security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});
