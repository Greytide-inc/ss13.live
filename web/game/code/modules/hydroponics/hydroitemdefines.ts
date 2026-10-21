// From code/modules/hydroponics/hydroitemdefines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9393, "/obj/item/device/plant_analyzer", "/obj/item/device", {
	name: "plant analyzer",
	desc: "A scanner used to evaluate a plant's various areas of growth.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "hydro",
	item_state: "analyzer",
	w_class: 1,
	slot_flags: 512,
	origin_tech: "magnets=2;biotech=2",
	materials: null,
});

// /obj/item/device/plant_analyzer/proc/<init>  (code/modules/hydroponics/hydroitemdefines.dm:11)
rt.def("/obj/item/device/plant_analyzer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30, "$glass", 20]));
	return f.dot;
});

rt.type(6376, "/obj/item/weapon/reagent_containers/spray/weedspray", "/obj/item/weapon/reagent_containers/spray", {
	container_type: 4096,
	throw_speed: 3,
	throw_range: 10,
	desc: "It's a toxic mixture, in spray form, to kill small weeds.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	name: "weed spray",
	icon_state: "weedspray",
	item_state: "spray",
	volume: 100,
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
});

// /obj/item/weapon/reagent_containers/spray/weedspray/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:32)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/weedspray/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["weedkiller", 100]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/spray/weedspray/proc/suicide_act  (code/modules/hydroponics/hydroitemdefines.dm:36)
rt.def("/obj/item/weapon/reagent_containers/spray/weedspray/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is huffing ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 4;
});

rt.type(6377, "/obj/item/weapon/reagent_containers/spray/pestspray", "/obj/item/weapon/reagent_containers/spray", {
	container_type: 4096,
	throw_speed: 3,
	throw_range: 10,
	desc: "It's some pest eliminator spray! <I>Do not inhale!</I>",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	name: "pest spray",
	icon_state: "pestspray",
	item_state: "plantbgone",
	volume: 100,
	slot_flags: 512,
	throwforce: 0,
	w_class: 2,
});

// /obj/item/weapon/reagent_containers/spray/pestspray/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:54)  may sleep
rt.def("/obj/item/weapon/reagent_containers/spray/pestspray/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["pestkiller", 100]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/spray/pestspray/proc/suicide_act  (code/modules/hydroponics/hydroitemdefines.dm:58)
rt.def("/obj/item/weapon/reagent_containers/spray/pestspray/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is huffing ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 4;
});

rt.type(7507, "/obj/item/weapon/cultivator", "/obj/item/weapon", {
	flags: 64,
	name: "cultivator",
	desc: "It's used for removing weeds or scratching your back.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "cultivator",
	item_state: "cultivator",
	origin_tech: "engineering=2;biotech=2",
	force: 5,
	throwforce: 7,
	w_class: 2,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// /obj/item/weapon/cultivator/proc/<init>  (code/modules/hydroponics/hydroitemdefines.dm:72)
rt.def("/obj/item/weapon/cultivator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 50]));
	rt.setSv(f, "attack_verb", rt.list("slashed", "sliced", "cut", "clawed"));
	return f.dot;
});

rt.type(7508, "/obj/item/weapon/hatchet", "/obj/item/weapon", {
	flags: 64,
	throw_speed: 3,
	throw_range: 4,
	name: "hatchet",
	desc: "A very sharp axe blade upon a short fibremetal handle. It has a long history of chopping things, but now it is used for chopping wood.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "hatchet",
	force: 12,
	w_class: 1,
	throwforce: 15,
	materials: null,
	origin_tech: "materials=2;combat=2",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
});

// /obj/item/weapon/hatchet/proc/<init>  (code/modules/hydroponics/hydroitemdefines.dm:87)
rt.def("/obj/item/weapon/hatchet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 15000]));
	rt.setSv(f, "attack_verb", rt.list("chopped", "torn", "cut"));
	return f.dot;
});

// /obj/item/weapon/hatchet/proc/suicide_act  (code/modules/hydroponics/hydroitemdefines.dm:94)
rt.def("/obj/item/weapon/hatchet/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is chopping at ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bladeslice.ogg"), 50, 1, -1]);
	return 1;
});

rt.type(7510, "/obj/item/weapon/scythe", "/obj/item/weapon", {
	throw_speed: 2,
	throw_range: 3,
	flags: 64,
	icon_state: "scythe0",
	name: "scythe",
	desc: "A sharp and curved blade on a long fibremetal handle, this tool makes it easy to reap what you sow.",
	force: 13,
	throwforce: 5,
	w_class: 4,
	armour_penetration: 20,
	slot_flags: 1024,
	origin_tech: "materials=3;combat=2",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// /obj/item/weapon/scythe/proc/suicide_act  (code/modules/hydroponics/hydroitemdefines.dm:115)  may sleep
rt.def("/obj/item/weapon/scythe/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let C: Value = null, BP: Value = null;
	f.vars = () => [user, C, BP];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is beheading ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), (yield* g.callName(f, live(user), "p_them", [])), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(user);
		if (truthy((BP = (yield* g.callName(f, live(C), "get_bodypart", ["head"]))))) {
			yield* g.callName(f, live(BP), "drop_limb", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-01.ogg")]), 50, 1, -1]);
		}
	}
	return 1;
}, true);

rt.type(6394, "/obj/item/weapon/reagent_containers/glass/bottle/nutrient", "/obj/item/weapon/reagent_containers/glass/bottle", {
	name: "bottle of nutrient",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
	volume: 50,
	w_class: 1,
	amount_per_transfer_from_this: 10,
	possible_transfer_amounts: null,
});

// /obj/item/weapon/reagent_containers/glass/bottle/nutrient/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:139)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "pixel_x", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setFv(f, "pixel_y", live(f.src), (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

rt.type(6395, "/obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez", "/obj/item/weapon/reagent_containers/glass/bottle/nutrient", {
	name: "bottle of E-Z-Nutrient",
	desc: "Contains a fertilizer that causes mild mutations with each harvest.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle16",
});

// /obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:151)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/ez/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["eznutriment", 50]);
	return f.dot;
}, true);

rt.type(6396, "/obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z", "/obj/item/weapon/reagent_containers/glass/bottle/nutrient", {
	name: "bottle of Left 4 Zed",
	desc: "Contains a fertilizer that limits plant yields to no more than one and causes significant mutations in plants.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle18",
});

// /obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:161)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/l4z/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["left4zednutriment", 50]);
	return f.dot;
}, true);

rt.type(6397, "/obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh", "/obj/item/weapon/reagent_containers/glass/bottle/nutrient", {
	name: "bottle of Robust Harvest",
	desc: "Contains a fertilizer that increases the yield of a plant by 30% while causing no mutations.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle15",
});

// /obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:171)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/nutrient/rh/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["robustharvestnutriment", 50]);
	return f.dot;
}, true);

rt.type(6400, "/obj/item/weapon/reagent_containers/glass/bottle/killer/weedkiller", "/obj/item/weapon/reagent_containers/glass/bottle/killer", {
	name: "bottle of weed killer",
	desc: "Contains a herbicide.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle19",
});

// /obj/item/weapon/reagent_containers/glass/bottle/killer/weedkiller/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:195)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/killer/weedkiller/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["weedkiller", 50]);
	return f.dot;
}, true);

rt.type(6401, "/obj/item/weapon/reagent_containers/glass/bottle/killer/pestkiller", "/obj/item/weapon/reagent_containers/glass/bottle/killer", {
	name: "bottle of pest spray",
	desc: "Contains a pesticide.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle20",
});

// /obj/item/weapon/reagent_containers/glass/bottle/killer/pestkiller/proc/Initialize  (code/modules/hydroponics/hydroitemdefines.dm:205)  may sleep
rt.def("/obj/item/weapon/reagent_containers/glass/bottle/killer/pestkiller/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["pestkiller", 50]);
	return f.dot;
}, true);
