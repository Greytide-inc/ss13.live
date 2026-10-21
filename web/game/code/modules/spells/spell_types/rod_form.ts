// From code/modules/spells/spell_types/rod_form.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11330, "/obj/effect/proc_holder/spell/targeted/rod_form", "/obj/effect/proc_holder/spell/targeted", {
	include_user: 1,
	name: "Rod Form",
	desc: "Take on the form of an immovable rod, destroying all in your path.",
	clothes_req: 1,
	human_req: 0,
	charge_max: 250,
	cooldown_min: 100,
	range: -1,
	invocation: "CLANG!",
	invocation_type: "shout",
	action_icon_state: "immrod",
});

// /obj/effect/proc_holder/spell/targeted/rod_form/proc/cast  (code/modules/spells/spell_types/rod_form.dm:15)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/rod_form/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, start: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [targets, user, M, start, W, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	M = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		start = rt.getStep(f, live(M), 0);
		rt.setFv(f, "wizard", (W = (yield* g.new_(f, T("/obj/effect/immovablerod/wizard"), [live(start), (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(M), rt.fv(f, "dir", live(M)), add(15, multiply(rt.sv(f, "spell_level"), 3))]))]))), live(M));
		rt.modField(f, live(W), "max_distance", multiply(rt.sv(f, "spell_level"), 3), add);
		rt.modField(f, live(W), "damage_bonus", multiply(rt.sv(f, "spell_level"), 20), add);
		rt.setFv(f, "start_turf", live(W), live(start));
		yield* g.callName(f, live(M), "forceMove", [live(W)]);
		rt.setFv(f, "notransform", live(M), 1);
		(rt.modField(f, live(M), "status_flags", 4096, rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12049, "/obj/effect/immovablerod/wizard", "/obj/effect/immovablerod", {
	max_distance: 13,
	damage_bonus: 0,
	wizard: null,
	start_turf: null,
	notify: 0,
});

// /obj/effect/immovablerod/wizard/proc/Move  (code/modules/spells/spell_types/rod_form.dm:36)  may sleep
rt.def("/obj/effect/immovablerod/wizard/proc/Move", function* Move(f: Frame) {
	if (rt.ge((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "start_turf"), rt.getStep(f, live(f.src), 0)])), rt.sv(f, "max_distance"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/effect/immovablerod/wizard/proc/Destroy  (code/modules/spells/spell_types/rod_form.dm:42)  may sleep
rt.def("/obj/effect/immovablerod/wizard/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "wizard"))) {
		(rt.modField(f, rt.sv(f, "wizard"), "status_flags", 16773119, rt.bitAnd));
		rt.setFv(f, "notransform", rt.sv(f, "wizard"), 0);
		yield* g.callName(f, rt.sv(f, "wizard"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/immovablerod/wizard/proc/penetrate  (code/modules/spells/spell_types/rod_form.dm:48)  may sleep
rt.def("/obj/effect/immovablerod/wizard/proc/penetrate", function* penetrate(f: Frame, L: Value) {
	f.vars = () => [L];
	yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ is penetrated by an immovable rod!</span>", [live(L)]), "<span class='userdanger'>The rod penetrates you!</span>", "<span class ='danger'>You hear a CLANG!</span>"]);
	yield* g.callName(f, live(L), "adjustBruteLoss", [add(70, rt.sv(f, "damage_bonus"))]);
	return f.dot;
}, true);
