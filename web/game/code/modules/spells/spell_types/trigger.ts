// Based on /tg/station's code/modules/spells/spell_types/trigger.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11338, "/obj/effect/proc_holder/spell/targeted/trigger", "/obj/effect/proc_holder/spell/targeted", {
	linked_spells: null,
	starting_spells: null,
	name: "Trigger",
	desc: "This spell triggers another spell or a few.",
});

// trigger.dm:5
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.linked_spells = list();

	this.starting_spells = list();
	return f.dot;
});

// trigger.dm:9
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/Initialize", function* Initialize(f: Frame) {
	let spell: Value = null, spell_to_add: Value = null;
	f.dot = (yield* parent_proc());
	for (spell of each(this.starting_spells)) {
		spell_to_add = text2path(spell);
		yield* new_(spell_to_add, this);
	}
	return f.dot;
}, true);

// trigger.dm:16
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/Destroy", function* Destroy(f: Frame) {
	let spell: Value = null;
	for (spell of each(this.contents)) {
		yield* qdel(spell);
	}
	this.linked_spells = null;
	this.starting_spells = null;
	return (yield* parent_proc());
}, true);

// trigger.dm:23
rt.def("/obj/effect/proc_holder/spell/targeted/trigger/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null, spell: Value = null;
	user ??= f.usr;
	this.playMagSound();
	for (target of each(targets, T("/mob/living"))) {
		spell = null;
		for (spell of each(this.contents, T("/obj/effect/proc_holder/spell"))) {
			yield* spell.perform(list(target), 0);
		}
		spell = null;
		for (spell of each(this.linked_spells, T("/obj/effect/proc_holder/spell"))) {
			yield* spell.perform(list(target), 0);
		}
	}
	return f.dot;
}, true);
