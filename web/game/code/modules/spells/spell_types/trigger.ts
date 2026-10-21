// From code/modules/spells/spell_types/trigger.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11338, "/obj/effect/proc_holder/spell/targeted/trigger", "/obj/effect/proc_holder/spell/targeted", {
	linked_spells: null,
	starting_spells: null,
	name: "Trigger",
	desc: "This spell triggers another spell or a few.",
});

// /obj/effect/proc_holder/spell/targeted/trigger/proc/<init>  (code/modules/spells/spell_types/trigger.dm:5)
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "linked_spells", rt.list());
	$0 = $0;
	rt.setSv(f, "starting_spells", rt.list());
	return f.dot;
});

// /obj/effect/proc_holder/spell/targeted/trigger/proc/Initialize  (code/modules/spells/spell_types/trigger.dm:9)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/Initialize", function* Initialize(f: Frame) {
	let spell: Value = null, spell_to_add: Value = null;
	let $e: any;
	f.vars = () => [spell, spell_to_add, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	spell = null;
	rt.forList(f, 0, rt.sv(f, "starting_spells"));
	while (($e = rt.next(f, 0)) !== undefined) {
		spell = $e;
		spell_to_add = (yield* g.call(f, P("/proc/text2path"), null, [live(spell)]));
		yield* g.new_(f, live(spell_to_add), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/effect/proc_holder/spell/targeted/trigger/proc/Destroy  (code/modules/spells/spell_types/trigger.dm:16)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/Destroy", function* Destroy(f: Frame) {
	let spell: Value = null;
	let $e: any;
	f.vars = () => [spell, $e];
	spell = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		spell = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(spell)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "linked_spells", null);
	rt.setSv(f, "starting_spells", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/spell/targeted/trigger/proc/cast  (code/modules/spells/spell_types/trigger.dm:23)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, spell: Value = null;
	let $e: any;
	f.vars = () => [targets, user, target, spell, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.srcCall(f, "playMagSound");
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		spell = null;
		rt.forList(f, 1, rt.sv(f, "contents"), T("/obj/effect/proc_holder/spell"));
		while (($e = rt.next(f, 1)) !== undefined) {
			spell = $e;
			yield* g.callName(f, live(spell), "perform", [rt.list(live(target)), 0]);
		}
		rt.endFor(f, 1);
		spell = null;
		rt.forList(f, 1, rt.sv(f, "linked_spells"), T("/obj/effect/proc_holder/spell"));
		while (($e = rt.next(f, 1)) !== undefined) {
			spell = $e;
			yield* g.callName(f, live(spell), "perform", [rt.list(live(target)), 0]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);
