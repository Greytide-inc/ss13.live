// From code/modules/spells/spell_types/shapeshift.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11331, "/obj/effect/proc_holder/spell/targeted/shapeshift", "/obj/effect/proc_holder/spell/targeted", {
	shapeshift_type: null,
	current_shapes: null,
	current_casters: null,
	possible_shapes: null,
	include_user: 1,
	name: "Shapechange",
	desc: "Take on the shape of another for a time to use their natural abilities. Once you've made your choice it cannot be changed.",
	clothes_req: 0,
	human_req: 0,
	charge_max: 200,
	cooldown_min: 50,
	range: -1,
	invocation: "RAC'WA NO!",
	invocation_type: "shout",
	action_icon_state: "shapeshift",
});

// /obj/effect/proc_holder/spell/targeted/shapeshift/proc/<init>  (code/modules/spells/spell_types/shapeshift.dm:15)
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "current_shapes", rt.list());
	$0 = $0;
	rt.setSv(f, "current_casters", rt.list());
	$0 = $0;
	rt.setSv(f, "possible_shapes", rt.list(T("/mob/living/simple_animal/mouse"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/hostile/carp/ranged/chaos"), T("/mob/living/simple_animal/bot/ed209"), T("/mob/living/simple_animal/hostile/construct/armored")));
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/shapeshift/proc/cast  (code/modules/spells/spell_types/shapeshift.dm:24)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let M: Value = null, animal_list: Value = null, path: Value = null, A: Value = null, new_shapeshift_type: Value = null;
	let $e: any;
	f.vars = () => [targets, user, M, animal_list, path, A, new_shapeshift_type, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	M = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy(rt.sv(f, "shapeshift_type"))) {
			animal_list = rt.list();
			path = null;
			rt.forList(f, 1, rt.sv(f, "possible_shapes"));
			while (($e = rt.next(f, 1)) !== undefined) {
				path = $e;
				A = live(path);
				rt.setAt(live(animal_list), rt.initial(f, live(A), "name"), live(path));
			}
			rt.endFor(f, 1);
			new_shapeshift_type = (yield* g.op(f, "Prompt", [1], [null, "It's Morphing Time!", "Choose Your Animal Form!", live(M), live(animal_list)]));
			if (truthy(rt.sv(f, "shapeshift_type"))) {
				return live(f.dot);
			}
			rt.setSv(f, "shapeshift_type", live(new_shapeshift_type));
			if (!truthy(rt.sv(f, "shapeshift_type"))) {
				rt.setSv(f, "shapeshift_type", rt.op(f, "PickUnweighted", [1], [live(animal_list)]));
			}
			rt.setSv(f, "shapeshift_type", rt.index(live(animal_list), rt.sv(f, "shapeshift_type")));
		}
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "current_shapes")) ? 1 : 0))) {
			yield* g.srcCall(f, "Restore", live(M));
		} else {
			yield* g.srcCall(f, "Shapeshift", live(M));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/shapeshift/proc/Shapeshift  (code/modules/spells/spell_types/shapeshift.dm:43)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/Shapeshift", function* Shapeshift(f: Frame, caster: Value) {
	let M: Value = null, shape: Value = null;
	let $e: any;
	f.vars = () => [caster, M, shape, $e];
	M = null;
	rt.forList(f, 0, live(caster), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(caster), "<span class='warning'>You're already shapeshifted!</span>"]);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	shape = (yield* g.new_(f, rt.sv(f, "shapeshift_type"), [rt.fv(f, "loc", live(caster))]));
	rt.setFv(f, "loc", live(caster), live(shape));
	(rt.modField(f, live(caster), "status_flags", 4096, rt.bitOr));
	(rt.modSrcVar(f, "current_shapes", live(shape), rt.bitOr));
	(rt.modSrcVar(f, "current_casters", live(caster), rt.bitOr));
	rt.setSv(f, "clothes_req", 0);
	rt.setSv(f, "human_req", 0);
	yield* g.callName(f, rt.fv(f, "mind", live(caster)), "transfer_to", [live(shape)]);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/shapeshift/proc/Restore  (code/modules/spells/spell_types/shapeshift.dm:61)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/proc/Restore", function* Restore(f: Frame, shape: Value) {
	let caster: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [shape, caster, M, $e];
	caster = null;
	M = null;
	rt.forList(f, 0, live(shape), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "current_casters")) ? 1 : 0))) {
			caster = live(M);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(caster))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(caster), rt.fv(f, "loc", live(shape)));
	(rt.modField(f, live(caster), "status_flags", 16773119, rt.bitAnd));
	rt.setSv(f, "clothes_req", rt.initial(f, live(f.src), "clothes_req"));
	rt.setSv(f, "human_req", rt.initial(f, live(f.src), "human_req"));
	yield* g.callName(f, rt.sv(f, "current_casters"), "Remove", [live(caster)]);
	yield* g.callName(f, rt.sv(f, "current_shapes"), "Remove", [live(shape)]);
	yield* g.callName(f, rt.fv(f, "mind", live(shape)), "transfer_to", [live(caster)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(shape)]);
	return f.dot;
}, true);

rt.type(11333, "/obj/effect/proc_holder/spell/targeted/shapeshift/dragon/list", "/obj/effect/proc_holder/spell/targeted/shapeshift/dragon", {
	current_shapes: null,
	current_casters: null,
	possible_shapes: null,
});

// /obj/effect/proc_holder/spell/targeted/shapeshift/dragon/list/proc/<init>  (code/modules/spells/spell_types/shapeshift.dm:84)
rt.def("/obj/effect/proc_holder/spell/targeted/shapeshift/dragon/list/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "current_shapes", rt.list(T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser")));
	$0 = $0;
	rt.setSv(f, "current_casters", rt.list());
	$0 = $0;
	rt.setSv(f, "possible_shapes", rt.list(T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser")));
	return f.dot;
});
