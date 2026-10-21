// From code/game/objects/items/religion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6995, "/obj/item/weapon/banner", "/obj/item/weapon", {
	moralecooldown: 0,
	moralewait: 600,
	name: "banner",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "banner",
	item_state: "banner",
	desc: "A banner with Nanotrasen's logo on it.",
});

// /obj/item/weapon/banner/proc/attack_self  (code/game/objects/items/religion.dm:11)  may sleep
rt.def("/obj/item/weapon/banner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [user, H, $e];
	if (rt.gt(add(rt.sv(f, "moralecooldown"), rt.sv(f, "moralewait")), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You increase the morale of your fellows!</span>"]);
	rt.setSv(f, "moralecooldown", rt.worldTime(f));
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [4, rt.getStep(f, live(f.src), 0)])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>Your morale is increased by ＀'s banner!</span>", [live(user)])]);
		yield* g.callName(f, live(H), "adjustBruteLoss", [-15]);
		yield* g.callName(f, live(H), "adjustFireLoss", [-15]);
		yield* g.callName(f, live(H), "AdjustStun", [-40]);
		yield* g.callName(f, live(H), "AdjustKnockdown", [-40]);
		yield* g.callName(f, live(H), "AdjustUnconscious", [-40]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7768, "/obj/item/clothing/suit/armor/plate/crusader", "/obj/item/clothing/suit/armor/plate", {
	name: "Crusader's Armour",
	desc: "Armour that's comprised of metal and cloth.",
	icon_state: "crusader",
	w_class: 4,
	slowdown: 2,
	body_parts_covered: 2046,
	armor: null,
});

// /obj/item/clothing/suit/armor/plate/crusader/proc/<init>  (code/game/objects/items/religion.dm:60)
rt.def("/obj/item/clothing/suit/armor/plate/crusader/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]));
	return f.dot;
});

rt.type(7997, "/obj/item/clothing/head/helmet/plate/crusader", "/obj/item/clothing/head/helmet/plate", {
	name: "Crusader's Hood",
	desc: "A brownish hood.",
	icon_state: "crusader",
	w_class: 3,
	flags_inv: 416,
	armor: null,
});

// /obj/item/clothing/head/helmet/plate/crusader/proc/<init>  (code/game/objects/items/religion.dm:74)
rt.def("/obj/item/clothing/head/helmet/plate/crusader/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]));
	return f.dot;
});

rt.type(8000, "/obj/item/clothing/head/helmet/plate/crusader/prophet", "/obj/item/clothing/head/helmet/plate/crusader", {
	flags: 0,
	name: "Prophet's Hat",
	desc: "A religious-looking hat.",
	alternate_worn_icon: rt.rsc("icons/mob/large-worn-icons/64x64/head.dmi"),
	armor: null,
	worn_x_dimension: 64,
	worn_y_dimension: 64,
});

// /obj/item/clothing/head/helmet/plate/crusader/prophet/proc/<init>  (code/game/objects/items/religion.dm:88)
rt.def("/obj/item/clothing/head/helmet/plate/crusader/prophet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 60, "laser", 60, "energy", 50, "bomb", 70, "bio", 50, "rad", 50, "fire", 60, "acid", 60]));
	return f.dot;
});

rt.type(6998, "/obj/item/weapon/godstaff", "/obj/item/weapon", {
	conversion_color: "#ffffff",
	staffcooldown: 0,
	staffwait: 30,
	name: "godstaff",
	desc: "It's a stick..?",
	icon_state: "godstaff-red",
});

// /obj/item/weapon/godstaff/proc/afterattack  (code/game/objects/items/religion.dm:109)  may sleep
rt.def("/obj/item/weapon/godstaff/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	f.vars = () => [target, user, proximity_flag, click_parameters];
	if (rt.gt(add(rt.sv(f, "staffcooldown"), rt.sv(f, "staffwait")), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ chants deeply and waves their staff!", [live(user)])]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 20, 1, live(f.src)])))) {
		yield* g.callName(f, live(target), "add_atom_colour", [rt.sv(f, "conversion_color"), 3]);
	}
	rt.setSv(f, "staffcooldown", rt.worldTime(f));
	return f.dot;
}, true);

rt.type(8483, "/obj/item/clothing/shoes/plate", "/obj/item/clothing/shoes", {
	flags: 1024,
	name: "Plate Boots",
	desc: "Metal boots, they look heavy.",
	icon_state: "crusader",
	w_class: 3,
	armor: null,
	cold_protection: 96,
	min_cold_protection_temperature: 2,
	heat_protection: 96,
	max_heat_protection_temperature: 1500,
});

// /obj/item/clothing/shoes/plate/proc/<init>  (code/game/objects/items/religion.dm:145)
rt.def("/obj/item/clothing/shoes/plate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 40, "bomb", 60, "bio", 0, "rad", 0, "fire", 60, "acid", 60]));
	return f.dot;
});

rt.type(5336, "/obj/item/weapon/storage/box/itemset/crusader/blue", "/obj/item/weapon/storage/box/itemset/crusader", {});

// /obj/item/weapon/storage/box/itemset/crusader/blue/proc/New  (code/game/objects/items/religion.dm:166)  may sleep
rt.def("/obj/item/weapon/storage/box/itemset/crusader/blue/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "contents", rt.list());
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/plate/crusader/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/plate/crusader/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/plate/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/plate/blue"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5337, "/obj/item/weapon/storage/box/itemset/crusader/red", "/obj/item/weapon/storage/box/itemset/crusader", {});

// /obj/item/weapon/storage/box/itemset/crusader/red/proc/New  (code/game/objects/items/religion.dm:176)  may sleep
rt.def("/obj/item/weapon/storage/box/itemset/crusader/red/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "contents", rt.list());
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	yield* g.new_(f, T("/obj/item/clothing/suit/armor/plate/crusader/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/head/helmet/plate/crusader/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/plate/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/shoes/plate/red"), [live(f.src)]);
	return f.dot;
}, true);
