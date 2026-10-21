// From code/game/objects/items/weapons/clown_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7135, "/obj/item/weapon/soap", "/obj/item/weapon", {
	cleanspeed: 50,
	flags: 4,
	throw_speed: 3,
	throw_range: 7,
	name: "soap",
	desc: "A cheap bar of soap. Doesn't smell.",
	gender: "plural",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "soap",
	w_class: 1,
	throwforce: 0,
	force_string: "robust... against germs",
});

// /obj/item/weapon/soap/proc/suicide_act  (code/game/objects/items/weapons/clown_items.dm:46)  may sleep
rt.def("/obj/item/weapon/soap/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "say", [";FFFFFFFFFFFFFFFFUUUUUUUDGE!!"]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ lifts ＀ to their mouth and gnaws on it furiously, producing a thick froth! ＀'ll never get that BB gun now!", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_they", [1]))])]);
	yield* g.new_(f, T("/obj/effect/particle_effect/foam"), [rt.sv(f, "loc")]);
	return 4;
}, true);

// /obj/item/weapon/soap/proc/Crossed  (code/game/objects/items/weapons/clown_items.dm:52)  may sleep
rt.def("/obj/item/weapon/soap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	f.vars = () => [AM, M];
	if (!truthy((rt.istype(live(AM), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (M = live(AM)), "slip", [80, live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/soap/proc/afterattack  (code/game/objects/items/weapons/clown_items.dm:57)  may sleep
rt.def("/obj/item/weapon/soap/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let H: Value = null, C: Value = null;
	f.vars = () => [target, user, proximity, H, C];
	if ((!truthy(live(proximity)) || !truthy((yield* g.srcCall(f, "check_allowed_items", live(target)))))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "client", live(user))) && truthy((rt.isIn(f, live(target), rt.gv(f, "screen", rt.fv(f, "client", live(user)))) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to take that ＀ off before cleaning it!</span>", [rt.fv(f, "name", live(target))])]);
	} else {
		if (truthy((rt.istype(live(target), T("/obj/effect/decal/cleanable")) ? 1 : 0))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to scrub ％！ out with ＀.", [live(user), rt.fv(f, "name", live(target)), live(f.src)]), fmt("<span class='warning'>You begin to scrub ％！ out with ＀...</span>", [rt.fv(f, "name", live(target)), live(f.src)])]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "cleanspeed", live(f.src)), "target", live(target)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You scrub ％！ out.</span>", [rt.fv(f, "name", live(target))])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(target)]);
			}
		} else {
			if ((truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0)) && isEqual(rt.fv(f, "zone_selected", live(user)), "mouth"))) {
				H = live(user);
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>％！ washes ％！'s mouth out with ＀!</span>", [live(user), live(target), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You wash ％！'s mouth out with ＀!</span>", [live(target), rt.fv(f, "name", live(f.src))])]);
				rt.setFv(f, "lip_style", live(H), null);
				yield* g.callName(f, live(H), "update_body", []);
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(target), T("/obj/structure/window")) ? 1 : 0))) {
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to clean ％！ with ＀...", [live(user), rt.fv(f, "name", live(target)), live(f.src)]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [rt.fv(f, "name", live(target)), live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "cleanspeed", live(f.src)), "target", live(target)], rt.Args.Named)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You clean ％！.</span>", [rt.fv(f, "name", live(target))])]);
						yield* g.callName(f, live(target), "remove_atom_colour", [3]);
						yield* g.callName(f, live(target), "set_opacity", [rt.initial(f, live(target), "opacity")]);
					}
				} else {
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ begins to clean ％！ with ＀...", [live(user), rt.fv(f, "name", live(target)), live(f.src)]), fmt("<span class='notice'>You begin to clean ％！ with ＀...</span>", [rt.fv(f, "name", live(target)), live(f.src)])]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "cleanspeed", live(f.src)), "target", live(target)], rt.Args.Named)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You clean ％！.</span>", [rt.fv(f, "name", live(target))])]);
						yield* g.call(f, P("/proc/qdel"), null, [(C = rt.locateIn(f, T("/obj/effect/decal/cleanable"), live(target)))]);
						yield* g.callName(f, live(target), "remove_atom_colour", [3]);
						yield* g.callName(f, live(target), "clean_blood", []);
						yield* g.callName(f, live(target), "wash_cream", []);
					}
				}
			}
		}
	}
	return live(f.dot);
}, true);

rt.type(7140, "/obj/item/weapon/bikehorn", "/obj/item/weapon", {
	next_usable: 0,
	honksound: rt.rsc("sound/items/bikehorn.ogg"),
	cooldowntime: 20,
	throw_speed: 3,
	throw_range: 7,
	name: "bike horn",
	desc: "A horn off of a bicycle.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "bike_horn",
	item_state: "bike_horn",
	throwforce: 0,
	hitsound: null,
	w_class: 1,
	attack_verb: null,
});

// /obj/item/weapon/bikehorn/proc/<init>  (code/game/objects/items/weapons/clown_items.dm:108)
rt.def("/obj/item/weapon/bikehorn/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("HONKED"));
	return f.dot;
});

// /obj/item/weapon/bikehorn/proc/suicide_act  (code/game/objects/items/weapons/clown_items.dm:114)
rt.def("/obj/item/weapon/bikehorn/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ solemnly points the horn at ＀ temple! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "honksound"), 50, 1]);
	return 1;
});

// /obj/item/weapon/bikehorn/proc/attack  (code/game/objects/items/weapons/clown_items.dm:119)  may sleep
rt.def("/obj/item/weapon/bikehorn/proc/attack", function* attack(f: Frame) {
	if (!rt.gt(rt.sv(f, "next_usable"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "honksound"), 50, 1, -1]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user"] });

// /obj/item/weapon/bikehorn/proc/attack_self  (code/game/objects/items/weapons/clown_items.dm:124)  may sleep
rt.def("/obj/item/weapon/bikehorn/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (rt.gt(rt.sv(f, "next_usable"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "next_usable", add(rt.worldTime(f), rt.sv(f, "cooldowntime")));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "honksound"), 50, 1]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	return f.dot;
}, true);

// /obj/item/weapon/bikehorn/proc/Crossed  (code/game/objects/items/weapons/clown_items.dm:130)
rt.def("/obj/item/weapon/bikehorn/proc/Crossed", function Crossed(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "honksound"), 50, 1, -1]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["L"] });

rt.type(7142, "/obj/item/weapon/bikehorn/golden", "/obj/item/weapon/bikehorn", {
	name: "golden bike horn",
	desc: "Golden? Clearly, it's made with bananium! Honk!",
	icon_state: "gold_horn",
	item_state: "gold_horn",
});

// /obj/item/weapon/bikehorn/golden/proc/attack  (code/game/objects/items/weapons/clown_items.dm:149)  may sleep
rt.def("/obj/item/weapon/bikehorn/golden/proc/attack", function* attack(f: Frame) {
	yield* g.srcCall(f, "flip_mobs");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/bikehorn/golden/proc/attack_self  (code/game/objects/items/weapons/clown_items.dm:153)  may sleep
rt.def("/obj/item/weapon/bikehorn/golden/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.srcCall(f, "flip_mobs");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/bikehorn/golden/proc/flip_mobs  (code/game/objects/items/weapons/clown_items.dm:157)  may sleep
rt.def("/obj/item/weapon/bikehorn/golden/proc/flip_mobs", function* flip_mobs(f: Frame, M: Value, user: Value) {
	let _T: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [M, user, _T, H, $e];
	if (rt.gt(rt.sv(f, "next_usable"), rt.worldTime(f))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	rt.forList(f, 0, (yield* g.call(f, P("/proc/ohearers"), null, [7, live(_T)])), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((yield* g.callName(f, live(M), "can_hear", []))))) {
			if (truthy((rt.istype(rt.gv(f, "ears", (H = live(M))), T("/obj/item/clothing/ears/earmuffs")) ? 1 : 0))) {
				continue;
			}
		}
		yield* g.callName(f, live(M), "emote", ["flip"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(5830, "/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter", "/obj/item/weapon/reagent_containers/food/drinks/soda_cans", {
	name: "Canned Laughter",
	desc: "Just looking at this makes you want to giggle.",
	icon_state: "laughter",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter/proc/<init>  (code/game/objects/items/weapons/clown_items.dm:170)
rt.def("/obj/item/weapon/reagent_containers/food/drinks/soda_cans/canned_laughter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["laughter", 50]));
	return f.dot;
});
