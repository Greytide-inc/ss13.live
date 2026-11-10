// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/larva.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4823, "/mob/living/carbon/alien/larva", "/mob/living/carbon/alien", {
	amount_grown: 0,
	max_grown: 100,
	time_of_birth: null,
	pass_flags: 17,
	name: "alien larva",
	real_name: "alien larva",
	icon_state: "larva0",
	mob_size: 1,
	density: 0,
	maxHealth: 25,
	health: 25,
	rotate_on_lying: 0,
	bodyparts: null,
});

// larva.dm:17
rt.def("/mob/living/carbon/alien/larva/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.bodyparts = list(T("/obj/item/bodypart/chest/larva"), T("/obj/item/bodypart/head/larva"));
	return f.dot;
});

// larva.dm:23
rt.def("/mob/living/carbon/alien/larva/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/hide"), null)));
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/larva_evolve"), null)));
	yield* parent_proc();
	return f.dot;
}, true);

// larva.dm:28
rt.def("/mob/living/carbon/alien/larva/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/plasmavessel/small/tiny")));
	yield* parent_proc();
	return f.dot;
}, true);

// larva.dm:33
rt.def("/mob/living/carbon/alien/larva/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat(null, `Progress: ${this.amount_grown}/${this.max_grown}`);
	return f.dot;
}, true);

// larva.dm:38
rt.def("/mob/living/carbon/alien/larva/proc/adjustPlasma", function* adjustPlasma(f: Frame, amount: Value) {
	if (this.stat != 2 && amount > 0) {
		this.amount_grown = min(this.amount_grown + 1, this.max_grown);
	}
	yield* parent_proc(amount);
	return f.dot;
}, true);

// larva.dm:63
rt.def("/mob/living/carbon/alien/larva/proc/stripPanelUnequip", function stripPanelUnequip(f: Frame, what: Value, who: Value) {
	to_chat(this, "<span class='warning'>You don't have the dexterity to do this!</span>");
	return f.dot;
});

// larva.dm:67
rt.def("/mob/living/carbon/alien/larva/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value) {
	to_chat(this, "<span class='warning'>You don't have the dexterity to do this!</span>");
	return f.dot;
});
