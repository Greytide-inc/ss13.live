// From code/modules/mob/living/carbon/alien/larva/larva.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /mob/living/carbon/alien/larva/proc/<init>  (code/modules/mob/living/carbon/alien/larva/larva.dm:17)
rt.def("/mob/living/carbon/alien/larva/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "bodyparts", rt.list(T("/obj/item/bodypart/chest/larva"), T("/obj/item/bodypart/head/larva")));
	return f.dot;
});

// /mob/living/carbon/alien/larva/proc/Initialize  (code/modules/mob/living/carbon/alien/larva/larva.dm:23)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/hide"), [null])));
	yield* g.srcCall(f, "AddAbility", (yield* g.new_(f, T("/obj/effect/proc_holder/alien/larva_evolve"), [null])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/larva/larva.dm:28)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/plasmavessel/small/tiny"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/Stat  (code/modules/mob/living/carbon/alien/larva/larva.dm:33)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Progress: ＀/＀", [rt.sv(f, "amount_grown"), rt.sv(f, "max_grown")])]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/adjustPlasma  (code/modules/mob/living/carbon/alien/larva/larva.dm:38)  may sleep
rt.def("/mob/living/carbon/alien/larva/proc/adjustPlasma", function* adjustPlasma(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if ((!isEqual(rt.sv(f, "stat"), 2) && rt.gt(live(amount), 0))) {
		rt.setSv(f, "amount_grown", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "amount_grown"), 1), rt.sv(f, "max_grown")])));
	}
	yield* g.callSuper(f, [live(amount)]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/larva/proc/stripPanelUnequip  (code/modules/mob/living/carbon/alien/larva/larva.dm:63)
rt.def("/mob/living/carbon/alien/larva/proc/stripPanelUnequip", function stripPanelUnequip(f: Frame, what: Value, who: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
	return live(f.dot);
});

// /mob/living/carbon/alien/larva/proc/stripPanelEquip  (code/modules/mob/living/carbon/alien/larva/larva.dm:67)
rt.def("/mob/living/carbon/alien/larva/proc/stripPanelEquip", function stripPanelEquip(f: Frame, what: Value, who: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
	return live(f.dot);
});
