// Based on /tg/station's code/modules/surgery/tail_modification.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1324, "/datum/surgery/tail_removal", "/datum/surgery", {
	name: "tail removal",
	possible_locs: null,
	steps: null,
	species: null,
});

// tail_modification.dm:10
rt.def("/datum/surgery/tail_removal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_locs = list("groin");

	this.steps = list(T("/datum/surgery_step/sever_tail"), T("/datum/surgery_step/close"));

	this.species = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// tail_modification.dm:13
rt.def("/datum/surgery/tail_removal/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let L: Value = target;
	if (rt.isIn(f, "tail_lizard", L.dna.species.mutant_bodyparts) || rt.isIn(f, "waggingtail_lizard", L.dna.species.mutant_bodyparts)) {
		return 1;
	}
	return 0;
});

rt.type(1349, "/datum/surgery_step/sever_tail", "/datum/surgery_step", {
	name: "sever tail",
	time: 64,
	implements: null,
});

// tail_modification.dm:20
rt.def("/datum/surgery_step/sever_tail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/sabre"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/melee/arm_blade"), 80, T("/obj/item/weapon/twohanded/required/chainsaw"), 80, T("/obj/item/weapon/mounted_chainsaw"), 80, T("/obj/item/weapon/twohanded/fireaxe"), 50, T("/obj/item/weapon/hatchet"), 40, T("/obj/item"), 30]);
	return f.dot;
});

// tail_modification.dm:28
rt.def("/datum/surgery_step/sever_tail/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to sever ${target}'s tail!`, `<span class='notice'>You begin to sever ${target}'s tail...</span>`);
	return f.dot;
});

// tail_modification.dm:31
rt.def("/datum/surgery_step/sever_tail/proc/tool_check", function tool_check(f: Frame, user: Value, tool: Value) {
	if (this.implement_type == T("/obj/item") && !tool.is_sharp()) {
		return 0;
	}
	return 1;
});

// tail_modification.dm:37
rt.def("/datum/surgery_step/sever_tail/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let S: Value = null;
	let L: Value = target;
	user.visible_message(`${user} severs ${L}'s tail!`, `<span class='notice'>You sever ${L}'s tail.</span>`);
	if (rt.isIn(f, "tail_lizard", L.dna.species.mutant_bodyparts)) {
		L.dna.species.mutant_bodyparts -= "tail_lizard";
	} else if (rt.isIn(f, "waggingtail_lizard", L.dna.species.mutant_bodyparts)) {
		L.dna.species.mutant_bodyparts -= "waggingtail_lizard";
	}
	if (rt.isIn(f, "spines", L.dna.features)) {
		L.dna.features -= "spines";
	}
	(S = (yield* new_(T("/obj/item/severedtail"), rt.getStep(f, target, 0)))).add_atom_colour(`#${rt.index(L.dna.features, "mcolor")}`, FIXED_COLOUR_PRIORITY);
	S.markings = `${rt.index(L.dna.features, "tail_lizard")}`;
	yield* L.update_body();
	return 1;
}, true);

rt.type(1325, "/datum/surgery/tail_attachment", "/datum/surgery", {
	name: "tail attachment",
	possible_locs: null,
	steps: null,
	species: null,
});

// tail_modification.dm:57
rt.def("/datum/surgery/tail_attachment/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_locs = list("groin");

	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/replace"), T("/datum/surgery_step/attach_tail"), T("/datum/surgery_step/close"));

	this.species = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// tail_modification.dm:60
rt.def("/datum/surgery/tail_attachment/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	let L: Value = target;
	if (!rt.isIn(f, "tail_lizard", L.dna.species.mutant_bodyparts) && !rt.isIn(f, "waggingtail_lizard", L.dna.species.mutant_bodyparts)) {
		return 1;
	}
	return 0;
});

rt.type(1350, "/datum/surgery_step/attach_tail", "/datum/surgery_step", {
	name: "attach tail",
	time: 64,
	implements: null,
});

// tail_modification.dm:67
rt.def("/datum/surgery_step/attach_tail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/severedtail"), 100]);
	return f.dot;
});

// tail_modification.dm:71
rt.def("/datum/surgery_step/attach_tail/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to attach a tail to ${target}!`, `<span class='notice'>You begin to attach the tail to ${target}...</span>`);
	return f.dot;
});

// tail_modification.dm:74
rt.def("/datum/surgery_step/attach_tail/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let L: Value = target;
	user.visible_message(`${user} gives ${L} a tail!`, `<span class='notice'>You give ${L} a tail. It adjusts to ${L}'s melanin.</span>`);
	if (!rt.index(L.dna.features, "mcolor")) {
		rt.setAt(L.dna.features, "mcolor", tool.color);
	}
	let _T: Value = tool;
	rt.setAt(L.dna.features, "tail_lizard", _T.markings);
	L.dna.species.mutant_bodyparts += "tail_lizard";
	yield* qdel(tool);
	yield* L.update_mutant_bodyparts();
	return 1;
}, true);
