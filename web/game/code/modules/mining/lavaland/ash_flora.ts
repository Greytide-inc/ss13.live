// From code/modules/mining/lavaland/ash_flora.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12511, "/obj/structure/flora/ash", "/obj/structure/flora", {
	harvested_name: "shortened mushrooms",
	harvested_desc: "Some quickly regrowing mushrooms, formerly known to be quite large.",
	needs_sharp_harvest: 1,
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings"),
	harvest_amount_low: 1,
	harvest_amount_high: 3,
	harvest_time: 60,
	harvest_message_low: "You pick a mushroom, but fail to collect many shavings from its cap.",
	harvest_message_med: "You pick a mushroom, carefully collecting the shavings from its cap.",
	harvest_message_high: "You harvest and collect shavings from several mushroom caps.",
	harvested: 0,
	base_icon: null,
	regrowth_time_low: 4800,
	regrowth_time_high: 8400,
	gender: "plural",
	layer: 2.75,
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "l_mushroom",
	name: "large mushrooms",
	desc: "A number of large mushrooms, covered in a faint layer of ash and what can only be spores.",
});

// /obj/structure/flora/ash/proc/New  (code/modules/mining/lavaland/ash_flora.dm:24)  may sleep
rt.def("/obj/structure/flora/ash/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "base_icon", fmt("＀＀", [rt.sv(f, "icon_state"), (yield* g.call(f, P("/proc/rand"), null, [1, 4]))]));
	rt.setSv(f, "icon_state", rt.sv(f, "base_icon"));
	if (!truthy(rt.op(f, "Prob", [], [15]))) return f.dot;
	yield* g.srcCall(f, "harvest", null, 1);
	return f.dot;
}, true);

// /obj/structure/flora/ash/proc/harvest  (code/modules/mining/lavaland/ash_flora.dm:33)  may sleep
rt.def("/obj/structure/flora/ash/proc/harvest", function* harvest(f: Frame, user: Value, no_drop: Value) {
	let rand_harvested: Value = null, msg: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [user, no_drop, rand_harvested, msg, i, $e];
	if (truthy(rt.sv(f, "harvested"))) {
		return 0;
	}
	if (!truthy(live(no_drop))) {
		if (truthy((rand_harvested = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "harvest_amount_low"), rt.sv(f, "harvest_amount_high")]))))) {
			if (truthy(live(user))) {
				msg = rt.sv(f, "harvest_message_med");
				if (isEqual(live(rand_harvested), rt.sv(f, "harvest_amount_low"))) {
					msg = rt.sv(f, "harvest_message_low");
				} else {
					if (isEqual(live(rand_harvested), rt.sv(f, "harvest_amount_high"))) {
						msg = rt.sv(f, "harvest_message_high");
					}
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀</span>", [live(msg)])]);
			}
			i = null;
			rt.forRange(f, 0, 1, live(rand_harvested), 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				yield* g.new_(f, rt.sv(f, "harvest"), [rt.getStep(f, live(f.src), 0)]);
			}
			rt.endFor(f, 0);
		}
	}
	rt.setSv(f, "icon_state", fmt("＀p", [rt.sv(f, "base_icon")]));
	rt.setSv(f, "name", rt.sv(f, "harvested_name"));
	rt.setSv(f, "desc", rt.sv(f, "harvested_desc"));
	rt.setSv(f, "harvested", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/flora/ash/proc/regrow")])), (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "regrowth_time_low"), rt.sv(f, "regrowth_time_high")]))]);
	return 1;
}, true);

// /obj/structure/flora/ash/proc/regrow  (code/modules/mining/lavaland/ash_flora.dm:53)
rt.def("/obj/structure/flora/ash/proc/regrow", function regrow(f: Frame) {
	rt.setSv(f, "icon_state", rt.sv(f, "base_icon"));
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	rt.setSv(f, "harvested", 0);
	return f.dot;
});

// /obj/structure/flora/ash/proc/attackby  (code/modules/mining/lavaland/ash_flora.dm:59)  may sleep
rt.def("/obj/structure/flora/ash/proc/attackby", function* attackby(f: Frame) {
	if (((!truthy(rt.sv(f, "harvested")) && truthy(rt.sv(f, "needs_sharp_harvest"))) && truthy(rt.fv(f, "sharpness", live(f.args[0]))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ starts to harvest from ＀ with ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You begin to harvest from ＀ with ＀.</span>", [live(f.src), live(f.args[0])])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.sv(f, "harvest_time"), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "harvest", live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/flora/ash/proc/attack_hand  (code/modules/mining/lavaland/ash_flora.dm:67)  may sleep
rt.def("/obj/structure/flora/ash/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((!truthy(rt.sv(f, "harvested")) && !truthy(rt.sv(f, "needs_sharp_harvest")))) {
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ starts to harvest from ＀.</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You begin to harvest from ＀.</span>", [live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[0]), null, rt.sv(f, "harvest_time"), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "harvest", live(f.args[0]));
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(12516, "/obj/structure/flora/ash/cacti", "/obj/structure/flora/ash", {
	harvested_name: "cacti",
	harvested_desc: "A bunch of prickly cacti. You can see fruits slowly growing beneath the covering of ash.",
	harvest: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit"),
	needs_sharp_harvest: 0,
	harvest_amount_high: 2,
	harvest_time: 10,
	harvest_message_low: "You pick a cactus fruit.",
	harvest_message_med: "You pick several cactus fruit.",
	harvest_message_high: "You pick a pair of cactus fruit.",
	regrowth_time_low: 4800,
	regrowth_time_high: 7200,
	icon_state: "cactus",
	name: "fruiting cacti",
	desc: "Several prickly cacti, brimming with ripe fruit and covered in a thin layer of ash.",
});

// /obj/structure/flora/ash/cacti/proc/Crossed  (code/modules/mining/lavaland/ash_flora.dm:141)  may sleep
rt.def("/obj/structure/flora/ash/cacti/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let H: Value = null, picked_def_zone: Value = null, O: Value = null;
	f.vars = () => [AM, H, picked_def_zone, O];
	if (!((truthy((rt.istype(live(AM), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "has_gravity", rt.sv(f, "loc"))))) && truthy(rt.op(f, "Prob", [], [70])))) return f.dot;
	if (!(!truthy(rt.gv(f, "shoes", (H = live(AM)))) && !truthy(rt.fv(f, "lying", live(H))))) return f.dot;
	picked_def_zone = rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"]);
	if ((!truthy((rt.istype((O = (yield* g.callName(f, live(H), "get_bodypart", [live(picked_def_zone)]))), T("/obj/item/bodypart")) ? 1 : 0)) || truthy((rt.isIn(f, 15, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(H), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [3, 6])), "brute", live(picked_def_zone)]);
	yield* g.callName(f, live(H), "Knockdown", [40]);
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ steps on a cactus!</span>", [live(H)]), "<span class='userdanger'>You step on a cactus!</span>"]);
	return f.dot;
}, true);

rt.type(6349, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", "/obj/item/weapon/reagent_containers/food/snacks/grown", {
	name: "mushroom shavings",
	desc: "Some shavings from a tall mushroom. With enough, might serve as a bowl.",
	icon: rt.rsc("icons/obj/lavaland/ash_flora.dmi"),
	icon_state: "mushroom_shavings",
	list_reagents: null,
	w_class: 1,
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	seed: rt.typePath("/obj/item/seeds/lavaland/polypore"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:158)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["sugar", 3, "ethanol", 2, "stabilizing_agent", 3, "minttoxin", 2]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/New  (code/modules/mining/lavaland/ash_flora.dm:166)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-4, 4])));
	return f.dot;
}, true);

rt.type(6351, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom leaf",
	desc: "A leaf, from a mushroom.",
	list_reagents: null,
	icon_state: "mushroom_leaf",
	seed: rt.typePath("/obj/item/seeds/lavaland/porcini"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:176)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_leaf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 3, "vitfro", 2, "nicotine", 2]));
	return f.dot;
});

rt.type(6352, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom cap",
	desc: "The cap of a large mushroom.",
	list_reagents: null,
	icon_state: "mushroom_cap",
	seed: rt.typePath("/obj/item/seeds/lavaland/inocybe"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:184)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_cap/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["mindbreaker", 2, "entpoly", 4, "mushroomhallucinogen", 2]));
	return f.dot;
});

rt.type(6353, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "mushroom stem",
	desc: "A long mushroom stem. It's slightly glowing.",
	list_reagents: null,
	icon_state: "mushroom_stem",
	luminosity: 1,
	seed: rt.typePath("/obj/item/seeds/lavaland/ember"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:192)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/mushroom_stem/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["tinlux", 2, "vitamin", 1, "space_drugs", 1]));
	return f.dot;
});

rt.type(6354, "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit", "/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora", {
	name: "cactus fruit",
	list_reagents: null,
	desc: "A cactus fruit covered in a thick, reddish skin. And some ash.",
	icon_state: "cactus_fruit",
	seed: rt.typePath("/obj/item/seeds/lavaland/cactus"),
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:199)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/cactus_fruit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["vitamin", 2, "nutriment", 2, "vitfro", 4]));
	return f.dot;
});

rt.type(1801, "/datum/crafting_recipe/mushroom_bowl", "/datum/crafting_recipe", {
	name: "Mushroom Bowl",
	time: 30,
	category: "Tribal",
	result: rt.typePath("/obj/item/weapon/reagent_containers/food/drinks/mushroom_bowl"),
	reqs: null,
});

// /datum/crafting_recipe/mushroom_bowl/proc/<init>  (code/modules/mining/lavaland/ash_flora.dm:219)
rt.def("/datum/crafting_recipe/mushroom_bowl/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/grown/ash_flora/shavings"), 5]));
	return f.dot;
});
