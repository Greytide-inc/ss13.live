// From code/modules/holodeck/holo_effect.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12070, "/obj/effect/holodeck_effect", "/obj/effect", {
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	invisibility: 101,
});

// /obj/effect/holodeck_effect/proc/deactivate  (code/modules/holodeck/holo_effect.dm:16)  may sleep
rt.def("/obj/effect/holodeck_effect/proc/deactivate", function* deactivate(f: Frame, HC: Value) {
	f.vars = () => [HC];
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12071, "/obj/effect/holodeck_effect/cards", "/obj/effect/holodeck_effect", {
	D: null,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_nanotrasen_full",
});

// /obj/effect/holodeck_effect/cards/proc/activate  (code/modules/holodeck/holo_effect.dm:34)  may sleep
rt.def("/obj/effect/holodeck_effect/cards/proc/activate", function* activate(f: Frame, HC: Value) {
	f.vars = () => [HC];
	rt.setSv(f, "D", (yield* g.new_(f, T("/obj/item/toy/cards/deck"), [rt.sv(f, "loc")])));
	yield* g.srcCall(f, "safety", (!truthy(rt.fv(f, "emagged", live(HC))) ? 1 : 0));
	rt.setFv(f, "holo", rt.sv(f, "D"), live(HC));
	return rt.sv(f, "D");
}, true);

// /obj/effect/holodeck_effect/cards/proc/safety  (code/modules/holodeck/holo_effect.dm:40)
rt.def("/obj/effect/holodeck_effect/cards/proc/safety", function safety(f: Frame, active: Value) {
	if (!truthy(rt.sv(f, "D"))) {
		return live(f.dot);
	}
	if (truthy(live(active))) {
		rt.setFv(f, "card_hitsound", rt.sv(f, "D"), null);
		rt.setFv(f, "card_force", rt.sv(f, "D"), 0);
		rt.setFv(f, "card_throwforce", rt.sv(f, "D"), 0);
		rt.setFv(f, "card_throw_speed", rt.sv(f, "D"), 3);
		rt.setFv(f, "card_throw_range", rt.sv(f, "D"), 7);
		rt.setFv(f, "card_attack_verb", rt.sv(f, "D"), rt.list("attacked"));
	} else {
		rt.setFv(f, "card_hitsound", rt.sv(f, "D"), rt.rsc("sound/weapons/bladeslice.ogg"));
		rt.setFv(f, "card_force", rt.sv(f, "D"), 5);
		rt.setFv(f, "card_throwforce", rt.sv(f, "D"), 10);
		rt.setFv(f, "card_throw_speed", rt.sv(f, "D"), 3);
		rt.setFv(f, "card_throw_range", rt.sv(f, "D"), 7);
		rt.setFv(f, "card_attack_verb", rt.sv(f, "D"), rt.list("attacked", "sliced", "diced", "slashed", "cut"));
	}
	return f.dot;
});

rt.type(12072, "/obj/effect/holodeck_effect/sparks", "/obj/effect/holodeck_effect", {});

// /obj/effect/holodeck_effect/sparks/proc/activate  (code/modules/holodeck/holo_effect.dm:59)  may sleep
rt.def("/obj/effect/holodeck_effect/sparks/proc/activate", function* activate(f: Frame, HC: Value) {
	let _T: Value = null, s: Value = null;
	f.vars = () => [HC, _T, s];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) return f.dot;
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(_T)]);
	yield* g.callName(f, live(s), "start", []);
	rt.setFv(f, "temperature", live(_T), 5000);
	yield* g.callName(f, live(_T), "hotspot_expose", [50000, 50000, 1]);
	return f.dot;
}, true);

rt.type(12073, "/obj/effect/holodeck_effect/mobspawner", "/obj/effect/holodeck_effect", {
	mobtype: rt.typePath("/mob/living/simple_animal/hostile/carp/holocarp"),
	mob: null,
});

// /obj/effect/holodeck_effect/mobspawner/proc/activate  (code/modules/holodeck/holo_effect.dm:74)  may sleep
rt.def("/obj/effect/holodeck_effect/mobspawner/proc/activate", function* activate(f: Frame, HC: Value) {
	let v: Value = null;
	let $e: any;
	f.vars = () => [HC, v, $e];
	if (truthy((rt.istype(rt.sv(f, "mobtype"), T("/list")) ? 1 : 0))) {
		rt.setSv(f, "mobtype", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "mobtype")]));
	}
	rt.setSv(f, "mob", (yield* g.new_(f, rt.sv(f, "mobtype"), [rt.sv(f, "loc")])));
	v = null;
	rt.forList(f, 0, rt.bitAnd(rt.list("butcher_results", "corpse", "weapon1", "weapon2", "blood_volume"), rt.fv(f, "vars", rt.sv(f, "mob"))));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		rt.setAt(rt.fv(f, "vars", rt.sv(f, "mob")), live(v), null);
	}
	rt.endFor(f, 0);
	return rt.sv(f, "mob");
}, true);

// /obj/effect/holodeck_effect/mobspawner/proc/deactivate  (code/modules/holodeck/holo_effect.dm:85)  may sleep
rt.def("/obj/effect/holodeck_effect/mobspawner/proc/deactivate", function* deactivate(f: Frame, HC: Value) {
	f.vars = () => [HC];
	if (truthy(rt.sv(f, "mob"))) {
		yield* g.callName(f, live(HC), "derez", [rt.sv(f, "mob")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12074, "/obj/effect/holodeck_effect/mobspawner/pet", "/obj/effect/holodeck_effect/mobspawner", {
	mobtype: null,
});

// /obj/effect/holodeck_effect/mobspawner/pet/proc/<init>  (code/modules/holodeck/holo_effect.dm:89)
rt.def("/obj/effect/holodeck_effect/mobspawner/pet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mobtype", rt.list(T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/chick/holo"), T("/mob/living/simple_animal/pet/cat"), T("/mob/living/simple_animal/pet/cat/kitten"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/pet/dog/corgi/puppy"), T("/mob/living/simple_animal/pet/dog/pug"), T("/mob/living/simple_animal/pet/fox")));
	return f.dot;
});
