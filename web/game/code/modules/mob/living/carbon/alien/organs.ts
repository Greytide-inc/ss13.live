// From code/modules/mob/living/carbon/alien/organs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9465, "/obj/item/organ/alien", "/obj/item/organ", {
	alien_powers: null,
	origin_tech: "biotech=5",
	icon_state: "xgibmid2",
});

// /obj/item/organ/alien/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:4)
rt.def("/obj/item/organ/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list());
	return f.dot;
});

// /obj/item/organ/alien/proc/New  (code/modules/mob/living/carbon/alien/organs.dm:7)  may sleep
rt.def("/obj/item/organ/alien/proc/New", function* New(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "alien_powers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(A)])))) {
			(rt.modSrcVar(f, "alien_powers", live(A), subtract));
			rt.modSrcVar(f, "alien_powers", (yield* g.new_(f, live(A), [live(f.src)])), add);
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/organ/alien/proc/Insert  (code/modules/mob/living/carbon/alien/organs.dm:14)  may sleep
rt.def("/obj/item/organ/alien/proc/Insert", function* Insert(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "alien_powers"), T("/obj/effect/proc_holder/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.callName(f, live(f.args[0]), "AddAbility", [live(_P)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/alien/proc/Remove  (code/modules/mob/living/carbon/alien/organs.dm:20)  may sleep
rt.def("/obj/item/organ/alien/proc/Remove", function* Remove(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	_P = null;
	rt.forList(f, 0, rt.sv(f, "alien_powers"), T("/obj/effect/proc_holder/alien"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		yield* g.callName(f, live(f.args[0]), "RemoveAbility", [live(_P)]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/alien/proc/prepare_eat  (code/modules/mob/living/carbon/alien/organs.dm:25)  may sleep
rt.def("/obj/item/organ/alien/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.callSuper(f, [], rt.Args.Same)))), "add_reagent", ["sacid", 10]);
	return live(S);
}, true);

rt.type(9466, "/obj/item/organ/alien/plasmavessel", "/obj/item/organ/alien", {
	storedPlasma: 100,
	max_plasma: 250,
	heal_rate: 5,
	plasma_rate: 10,
	name: "plasma vessel",
	icon_state: "plasma",
	origin_tech: "biotech=5;plasmatech=4",
	w_class: 3,
	zone: "chest",
	slot: "plasmavessel",
	alien_powers: null,
});

// /obj/item/organ/alien/plasmavessel/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:37)
rt.def("/obj/item/organ/alien/plasmavessel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/plant"), T("/obj/effect/proc_holder/alien/transfer")));
	return f.dot;
});

// /obj/item/organ/alien/plasmavessel/proc/prepare_eat  (code/modules/mob/living/carbon/alien/organs.dm:45)  may sleep
rt.def("/obj/item/organ/alien/plasmavessel/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.callSuper(f, [], rt.Args.Same)))), "add_reagent", ["plasma", divide(rt.sv(f, "storedPlasma"), 10)]);
	return live(S);
}, true);

rt.type(9470, "/obj/item/organ/alien/plasmavessel/small/tiny", "/obj/item/organ/alien/plasmavessel/small", {
	max_plasma: 100,
	name: "tiny plasma vessel",
	icon_state: "plasma_tiny",
	w_class: 1,
	alien_powers: null,
});

// /obj/item/organ/alien/plasmavessel/small/tiny/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:74)
rt.def("/obj/item/organ/alien/plasmavessel/small/tiny/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/transfer")));
	return f.dot;
});

// /obj/item/organ/alien/plasmavessel/proc/on_life  (code/modules/mob/living/carbon/alien/organs.dm:78)  may sleep
rt.def("/obj/item/organ/alien/plasmavessel/proc/on_life", function* on_life(f: Frame) {
	let heal_amt: Value = null;
	f.vars = () => [heal_amt];
	if (truthy(rt.locateIn(f, T("/obj/structure/alien/weeds"), rt.fv(f, "loc", rt.sv(f, "owner"))))) {
		if (rt.ge(rt.fv(f, "health", rt.sv(f, "owner")), rt.fv(f, "maxHealth", rt.sv(f, "owner")))) {
			yield* g.callName(f, rt.sv(f, "owner"), "adjustPlasma", [rt.sv(f, "plasma_rate")]);
		} else {
			heal_amt = rt.sv(f, "heal_rate");
			if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/alien")) ? 1 : 0))) {
				(heal_amt = rt.modify(live(heal_amt), 0.20000000298023224, multiply));
			}
			yield* g.callName(f, rt.sv(f, "owner"), "adjustPlasma", [multiply(rt.sv(f, "plasma_rate"), 0.5)]);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustBruteLoss", [rt.neg(live(heal_amt))]);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustFireLoss", [rt.neg(live(heal_amt))]);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustOxyLoss", [rt.neg(live(heal_amt))]);
			yield* g.callName(f, rt.sv(f, "owner"), "adjustCloneLoss", [rt.neg(live(heal_amt))]);
		}
	} else {
		yield* g.callName(f, rt.sv(f, "owner"), "adjustPlasma", [multiply(rt.sv(f, "plasma_rate"), 0.10000000149011612)]);
	}
	return f.dot;
}, true);

// /obj/item/organ/alien/plasmavessel/proc/Insert  (code/modules/mob/living/carbon/alien/organs.dm:94)  may sleep
rt.def("/obj/item/organ/alien/plasmavessel/proc/Insert", function* Insert(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (A = live(f.args[0])), "updatePlasmaDisplay", []);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/alien/plasmavessel/proc/Remove  (code/modules/mob/living/carbon/alien/organs.dm:100)  may sleep
rt.def("/obj/item/organ/alien/plasmavessel/proc/Remove", function* Remove(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/alien")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (A = live(f.args[0])), "updatePlasmaDisplay", []);
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9471, "/obj/item/organ/alien/hivenode", "/obj/item/organ/alien", {
	recent_queen_death: 0,
	name: "hive node",
	icon_state: "hivenode",
	zone: "head",
	slot: "hivenode",
	origin_tech: "biotech=5;magnets=4;bluespace=3",
	w_class: 1,
	alien_powers: null,
});

// /obj/item/organ/alien/hivenode/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:115)
rt.def("/obj/item/organ/alien/hivenode/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/whisper")));
	return f.dot;
});

// /obj/item/organ/alien/hivenode/proc/Insert  (code/modules/mob/living/carbon/alien/organs.dm:118)  may sleep
rt.def("/obj/item/organ/alien/hivenode/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	(rt.modField(f, live(f.args[0]), "faction", "alien", rt.bitOr));
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/alien/hivenode/proc/Remove  (code/modules/mob/living/carbon/alien/organs.dm:122)  may sleep
rt.def("/obj/item/organ/alien/hivenode/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	(rt.modField(f, live(f.args[0]), "faction", "alien", subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/alien/hivenode/proc/queen_death  (code/modules/mob/living/carbon/alien/organs.dm:127)  may sleep
rt.def("/obj/item/organ/alien/hivenode/proc/queen_death", function* queen_death(f: Frame) {
	if ((!truthy(rt.sv(f, "owner")) || isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/alien")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='userdanger'>Your Queen has been struck down!</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>You are struck with overwhelming agony! You feel confused, and your connection to the hivemind is severed."]);
		yield* g.callName(f, rt.sv(f, "owner"), "emote", ["roar"]);
		yield* g.callName(f, rt.sv(f, "owner"), "Stun", [200]);
	} else {
		if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>You feel a splitting pain in your head, and are struck with a wave of nausea. You cannot hear the hivemind anymore!"]);
			yield* g.callName(f, rt.sv(f, "owner"), "emote", ["scream"]);
			yield* g.callName(f, rt.sv(f, "owner"), "Knockdown", [100]);
		}
	}
	rt.modField(f, rt.sv(f, "owner"), "jitteriness", 30, add);
	rt.modField(f, rt.sv(f, "owner"), "confused", 30, add);
	rt.modField(f, rt.sv(f, "owner"), "stuttering", 30, add);
	rt.setSv(f, "recent_queen_death", 1);
	yield* g.callName(f, rt.sv(f, "owner"), "throw_alert", ["alien_noqueen", T("/obj/screen/alert/alien_vulnerable")]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/alien/hivenode/proc/clear_queen_death")])), 2400]);
	return f.dot;
}, true);

// /obj/item/organ/alien/hivenode/proc/clear_queen_death  (code/modules/mob/living/carbon/alien/organs.dm:150)  may sleep
rt.def("/obj/item/organ/alien/hivenode/proc/clear_queen_death", function* clear_queen_death(f: Frame) {
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	rt.setSv(f, "recent_queen_death", 0);
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='noticealien'>The pain of the queen's death is easing. You begin to hear the hivemind again.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "clear_alert", ["alien_noqueen"]);
	return f.dot;
}, true);

rt.type(9472, "/obj/item/organ/alien/resinspinner", "/obj/item/organ/alien", {
	name: "resin spinner",
	icon_state: "stomach-x",
	zone: "mouth",
	slot: "resinspinner",
	origin_tech: "biotech=5;materials=4",
	alien_powers: null,
});

// /obj/item/organ/alien/resinspinner/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:166)
rt.def("/obj/item/organ/alien/resinspinner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/resin")));
	return f.dot;
});

rt.type(9473, "/obj/item/organ/alien/acid", "/obj/item/organ/alien", {
	name: "acid gland",
	icon_state: "acid",
	zone: "mouth",
	slot: "acidgland",
	origin_tech: "biotech=5;materials=2;combat=2",
	alien_powers: null,
});

// /obj/item/organ/alien/acid/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:175)
rt.def("/obj/item/organ/alien/acid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/acid")));
	return f.dot;
});

rt.type(9474, "/obj/item/organ/alien/neurotoxin", "/obj/item/organ/alien", {
	name: "neurotoxin gland",
	icon_state: "neurotox",
	zone: "mouth",
	slot: "neurotoxingland",
	origin_tech: "biotech=5;combat=5",
	alien_powers: null,
});

// /obj/item/organ/alien/neurotoxin/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:184)
rt.def("/obj/item/organ/alien/neurotoxin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/neurotoxin")));
	return f.dot;
});

rt.type(9475, "/obj/item/organ/alien/eggsac", "/obj/item/organ/alien", {
	name: "egg sac",
	icon_state: "eggsac",
	zone: "groin",
	slot: "eggsac",
	w_class: 4,
	origin_tech: "biotech=6",
	alien_powers: null,
});

// /obj/item/organ/alien/eggsac/proc/<init>  (code/modules/mob/living/carbon/alien/organs.dm:194)
rt.def("/obj/item/organ/alien/eggsac/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alien_powers", rt.list(T("/obj/effect/proc_holder/alien/lay_egg")));
	return f.dot;
});
