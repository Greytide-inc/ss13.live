// From code/game/objects/items/stacks/bscrystal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7037, "/obj/item/weapon/ore/bluespace_crystal", "/obj/item/weapon/ore", {
	blink_range: 8,
	name: "bluespace crystal",
	desc: "A glowing bluespace crystal, not much is known about how they work. It looks very delicate.",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "bluespace_crystal",
	w_class: 1,
	materials: null,
	origin_tech: "bluespace=6;materials=3",
	points: 50,
	refined_type: rt.typePath("/obj/item/stack/sheet/bluespace_crystal"),
});

// /obj/item/weapon/ore/bluespace_crystal/proc/<init>  (code/game/objects/items/stacks/bscrystal.dm:8)
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bluespace", 2000]));
	return f.dot;
});

// /obj/item/weapon/ore/bluespace_crystal/proc/New  (code/game/objects/items/stacks/bscrystal.dm:20)  may sleep
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	return f.dot;
}, true);

// /obj/item/weapon/ore/bluespace_crystal/proc/attack_self  (code/game/objects/items/stacks/bscrystal.dm:25)  may sleep
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ crushes ＀!</span>", [live(user), live(f.src)]), fmt("<span class='danger'>You crush ＀!</span>", [live(f.src)])]);
	yield* g.new_(f, T("/obj/effect/particle_effect/sparks"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 50, 1]);
	yield* g.srcCall(f, "blink_mob", live(user));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/ore/bluespace_crystal/proc/blink_mob  (code/game/objects/items/stacks/bscrystal.dm:32)  may sleep
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/blink_mob", function* blink_mob(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.call(f, P("/proc/do_teleport"), null, [null, live(L), null, rt.getStep(f, live(L), 0), null, rt.sv(f, "blink_range"), "asoundin", rt.rsc("sound/effects/phasein.ogg")], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/weapon/ore/bluespace_crystal/proc/throw_impact  (code/game/objects/items/stacks/bscrystal.dm:35)  may sleep
rt.def("/obj/item/weapon/ore/bluespace_crystal/proc/throw_impact", function* throw_impact(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ fizzles and disappears upon impact!</span>", [live(f.src)]));
	yield* g.new_(f, T("/obj/effect/particle_effect/sparks"), [(_T = rt.getStep(f, live(f.args[0]), 0))]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 50, 1]);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.srcCall(f, "blink_mob", live(f.args[0]));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(7039, "/obj/item/weapon/ore/bluespace_crystal/artificial", "/obj/item/weapon/ore/bluespace_crystal", {
	blink_range: 4,
	name: "artificial bluespace crystal",
	desc: "An artificially made bluespace crystal, it looks delicate.",
	origin_tech: "bluespace=3;plasmatech=4",
	materials: null,
	points: 0,
	refined_type: null,
});

// /obj/item/weapon/ore/bluespace_crystal/artificial/proc/<init>  (code/game/objects/items/stacks/bscrystal.dm:49)
rt.def("/obj/item/weapon/ore/bluespace_crystal/artificial/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bluespace", 1000]));
	return f.dot;
});

rt.type(9021, "/obj/item/stack/sheet/bluespace_crystal", "/obj/item/stack/sheet", {
	crystal_type: rt.typePath("/obj/item/weapon/ore/bluespace_crystal/refined"),
	name: "bluespace polycrystal",
	icon: rt.rsc("icons/obj/telescience.dmi"),
	icon_state: "polycrystal",
	desc: "A stable polycrystal, made of fused-together bluespace crystals. You could probably break one off.",
	origin_tech: "bluespace=6;materials=3",
	materials: null,
	attack_verb: null,
	novariants: 1,
});

// /obj/item/stack/sheet/bluespace_crystal/proc/<init>  (code/game/objects/items/stacks/bscrystal.dm:61)
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bluespace", 2000]));
	rt.setSv(f, "attack_verb", rt.list("bluespace polybashed", "bluespace polybattered", "bluespace polybludgeoned", "bluespace polythrashed", "bluespace polysmashed"));
	return f.dot;
});

// /obj/item/stack/sheet/bluespace_crystal/proc/attack_self  (code/game/objects/items/stacks/bscrystal.dm:67)
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot crush the polycrystal in-hand, try breaking one off.</span>"]);
	return f.dot;
});

// /obj/item/stack/sheet/bluespace_crystal/proc/attack_hand  (code/game/objects/items/stacks/bscrystal.dm:70)  may sleep
rt.def("/obj/item/stack/sheet/bluespace_crystal/proc/attack_hand", function* attack_hand(f: Frame) {
	let BC: Value = null;
	f.vars = () => [BC];
	if (isEqual((yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", [])), live(f.src))) {
		if (truthy((yield* g.srcCall(f, "zero_amount")))) {
			return live(f.dot);
		}
		BC = (yield* g.new_(f, rt.sv(f, "crystal_type"), [live(f.src)]));
		yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(BC)]);
		yield* g.srcCall(f, "use", 1);
		if (!truthy(rt.sv(f, "amount"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You break the final crystal off.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You break off a crystal.</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });
