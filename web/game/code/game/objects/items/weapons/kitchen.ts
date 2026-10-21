// From code/game/objects/items/weapons/kitchen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7270, "/obj/item/weapon/kitchen/fork", "/obj/item/weapon/kitchen", {
	forkload: null,
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "fork",
	desc: "Pointy.",
	icon_state: "fork",
	force: 5,
	w_class: 1,
	throwforce: 0,
	materials: null,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	armor: null,
});

// /obj/item/weapon/kitchen/fork/proc/<init>  (code/game/objects/items/weapons/kitchen.dm:24)
rt.def("/obj/item/weapon/kitchen/fork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 80]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "stabbed", "poked"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/kitchen/fork/proc/attack  (code/game/objects/items/weapons/kitchen.dm:32)  may sleep
rt.def("/obj/item/weapon/kitchen/fork/proc/attack", function* attack(f: Frame) {
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.sv(f, "forkload"))) {
		if (isEqual(live(f.args[0]), live(f.args[1]))) {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ eats a delicious forkful of omelette!</span>", [live(f.args[1])])]);
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", [rt.fv(f, "id", rt.sv(f, "forkload")), 1]);
		} else {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='notice'>＀ feeds ＀ a delicious forkful of omelette!</span>", [live(f.args[1]), live(f.args[0])])]);
			yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "add_reagent", [rt.fv(f, "id", rt.sv(f, "forkload")), 1]);
		}
		rt.setSv(f, "icon_state", "fork");
		rt.setSv(f, "forkload", null);
	} else {
		if (isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "eyes")) {
			if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
				f.args[0] = live(f.args[1]);
			}
			return (yield* g.srcCall(f, "eyestab", live(f.args[0]), live(f.args[1])));
		}
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(7271, "/obj/item/weapon/kitchen/knife", "/obj/item/weapon/kitchen", {
	bayonet: 0,
	flags: 64,
	throw_speed: 3,
	throw_range: 6,
	name: "kitchen knife",
	icon_state: "knife",
	desc: "A general purpose Chef's Knife made by SpaceCook Incorporated. Guaranteed to stay sharp for years to come.",
	force: 10,
	w_class: 2,
	throwforce: 10,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	materials: null,
	attack_verb: null,
	sharpness: 2,
	armor: null,
});

// /obj/item/weapon/kitchen/knife/proc/<init>  (code/game/objects/items/weapons/kitchen.dm:64)
rt.def("/obj/item/weapon/kitchen/knife/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 12000]));
	rt.setSv(f, "attack_verb", rt.list("slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/item/weapon/kitchen/knife/proc/attack  (code/game/objects/items/weapons/kitchen.dm:71)  may sleep
rt.def("/obj/item/weapon/kitchen/knife/proc/attack", function* attack(f: Frame) {
	if (isEqual(rt.fv(f, "zone_selected", live(f.args[1])), "eyes")) {
		if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
			f.args[0] = live(f.args[1]);
		}
		return (yield* g.srcCall(f, "eyestab", live(f.args[0]), live(f.args[1])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user"] });

// /obj/item/weapon/kitchen/knife/proc/suicide_act  (code/game/objects/items/weapons/kitchen.dm:79)
rt.def("/obj/item/weapon/kitchen/knife/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [rt.op(f, "PickUnweighted", [3], [fmt("<span class='suicide'>＀ is slitting ＀ wrists with the ＀! It looks like ＀ trying to commit suicide.</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.fv(f, "name", live(f.src)), rt.callName(f, live(user), "p_theyre", [])]), fmt("<span class='suicide'>＀ is slitting ＀ throat with the ＀! It looks like ＀ trying to commit suicide.</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.fv(f, "name", live(f.src)), rt.callName(f, live(user), "p_theyre", [])]), fmt("<span class='suicide'>＀ is slitting ＀ stomach open with the ＀! It looks like ＀ trying to commit seppuku.</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.fv(f, "name", live(f.src)), rt.callName(f, live(user), "p_theyre", [])])])]);
	return 1;
});

rt.type(7273, "/obj/item/weapon/kitchen/knife/butcher", "/obj/item/weapon/kitchen/knife", {
	flags: 64,
	name: "butcher's cleaver",
	icon_state: "butch",
	desc: "A huge thing used for chopping and chopping up meat. This includes clowns and clown by-products.",
	force: 15,
	throwforce: 10,
	materials: null,
	attack_verb: null,
	w_class: 3,
});

// /obj/item/weapon/kitchen/knife/butcher/proc/<init>  (code/game/objects/items/weapons/kitchen.dm:98)
rt.def("/obj/item/weapon/kitchen/knife/butcher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 18000]));
	rt.setSv(f, "attack_verb", rt.list("cleaved", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

rt.type(7276, "/obj/item/weapon/kitchen/knife/combat/bone", "/obj/item/weapon/kitchen/knife/combat", {
	name: "bone dagger",
	item_state: "bone_dagger",
	icon_state: "bone_dagger",
	desc: "A sharpened bone. The bare mimimum in survival.",
	force: 15,
	throwforce: 15,
	materials: null,
});

// /obj/item/weapon/kitchen/knife/combat/bone/proc/<init>  (code/game/objects/items/weapons/kitchen.dm:128)
rt.def("/obj/item/weapon/kitchen/knife/combat/bone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(7278, "/obj/item/weapon/kitchen/knife/carrotshiv", "/obj/item/weapon/kitchen/knife", {
	name: "carrot shiv",
	icon_state: "carrotshiv",
	item_state: "carrotshiv",
	desc: "Unlike other carrots, you should probably keep this far away from your eyes.",
	force: 8,
	throwforce: 12,
	materials: null,
	origin_tech: "biotech=3;combat=2",
	attack_verb: null,
	armor: null,
});

// /obj/item/weapon/kitchen/knife/carrotshiv/proc/<init>  (code/game/objects/items/weapons/kitchen.dm:144)
rt.def("/obj/item/weapon/kitchen/knife/carrotshiv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	rt.setSv(f, "attack_verb", rt.list("shanked", "shivved"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});
