// From code/modules/spells/spell_types/genetic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11316, "/obj/effect/proc_holder/spell/targeted/genetic", "/obj/effect/proc_holder/spell/targeted", {
	disabilities: 0,
	mutations: null,
	duration: 100,
	name: "Genetic",
	desc: "This spell inflicts a set of mutations and disabilities upon the target.",
});

// /obj/effect/proc_holder/spell/targeted/genetic/proc/<init>  (code/modules/spells/spell_types/genetic.dm:6)
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mutations", rt.list());
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/genetic/proc/cast  (code/modules/spells/spell_types/genetic.dm:19)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [targets, user, target, A, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.srcCall(f, "playMagSound");
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		if (!truthy(rt.fv(f, "dna", live(target)))) {
			continue;
		}
		A = null;
		rt.forList(f, 1, rt.sv(f, "mutations"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			yield* g.callName(f, rt.fv(f, "dna", live(target)), "add_mutation", [live(A)]);
		}
		rt.endFor(f, 1);
		(rt.modField(f, live(target), "disabilities", rt.sv(f, "disabilities"), rt.bitOr));
		rt.spawnTail(f, rt.sv(f, "duration"), "/obj/effect/proc_holder/spell/targeted/genetic/proc/cast: spawn at modules/spells/spell_types/genetic.dm:26", targets, user, target, A);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[5])) body of /obj/effect/proc_holder/spell/targeted/genetic/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/genetic/proc/cast: spawn at modules/spells/spell_types/genetic.dm:26", function* (f: Frame, targets: Value, user: Value, target: Value, A: Value) {
	let $e: any;
	f.vars = () => [targets, user, target, A, $e];
	if ((truthy(live(target)) && !(!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target)))))) {
		A = null;
		rt.forList(f, 1, rt.sv(f, "mutations"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			yield* g.callName(f, rt.fv(f, "dna", live(target)), "remove_mutation", [live(A)]);
		}
		rt.endFor(f, 1);
		(rt.modField(f, live(target), "disabilities", rt.op(f, "BitNot", [], [rt.sv(f, "disabilities")]), rt.bitAnd));
	}
	return null;
});
