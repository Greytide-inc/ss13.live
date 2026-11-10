// Based on /tg/station's code/modules/spells/spell_types/genetic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11316, "/obj/effect/proc_holder/spell/targeted/genetic", "/obj/effect/proc_holder/spell/targeted", {
	disabilities: 0,
	mutations: null,
	duration: 100,
	name: "Genetic",
	desc: "This spell inflicts a set of mutations and disabilities upon the target.",
});

// genetic.dm:6
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutations = list();
	return f.dot;
});

// genetic.dm:19
rt.def("/obj/effect/proc_holder/spell/targeted/genetic/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, A: Value = null;
	user ??= f.usr;
	this.playMagSound();
	for (target of each(targets, T("/mob/living/carbon"))) {
		if (!target.dna) {
			continue;
		}
		A = null;
		for (A of each(this.mutations)) {
			yield* target.dna.add_mutation(A);
		}
		(rt.modField(f, target, "disabilities", this.disabilities, rt.bitOr));
		rt.spawnTail(f, this.duration, "/obj/effect/proc_holder/spell/targeted/genetic/proc/cast: spawn at modules/spells/spell_types/genetic.dm:26", targets, user, target, A);
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[5])) body of /obj/effect/proc_holder/spell/targeted/genetic/proc/cast, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/proc_holder/spell/targeted/genetic/proc/cast: spawn at modules/spells/spell_types/genetic.dm:26", function* (f: Frame, targets: Value, user: Value, target: Value, A: Value) {
	let $e: any;
	if (target && !(!target || target.gc_destroyed)) {
		A = null;
		rt.forList(f, 1, this.mutations);
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			yield* target.dna.remove_mutation(A);
		}
		rt.endFor(f, 1);
		(rt.modField(f, target, "disabilities", rt.op(f, "BitNot", [], [this.disabilities]), rt.bitAnd));
	}
	return null;
});
