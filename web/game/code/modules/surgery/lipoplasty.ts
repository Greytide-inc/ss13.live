// Based on /tg/station's code/modules/surgery/lipoplasty.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1317, "/datum/surgery/lipoplasty", "/datum/surgery", {
	name: "lipoplasty",
	steps: null,
	possible_locs: null,
});

// lipoplasty.dm:3
rt.def("/datum/surgery/lipoplasty/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/cut_fat"), T("/datum/surgery_step/remove_fat"), T("/datum/surgery_step/close"));

	this.possible_locs = list("chest");
	return f.dot;
});

// lipoplasty.dm:7
rt.def("/datum/surgery/lipoplasty/proc/can_start", function can_start(f: Frame, user: Value, target: Value) {
	if (rt.bitAnd(target.disabilities, 32)) {
		return 1;
	}
	return 0;
});

rt.type(1343, "/datum/surgery_step/cut_fat", "/datum/surgery_step", {
	name: "cut excess fat",
	implements: null,
	time: 64,
});

// lipoplasty.dm:15
rt.def("/datum/surgery_step/cut_fat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/circular_saw"), 100, T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), 100, T("/obj/item/weapon/hatchet"), 35, T("/obj/item/weapon/kitchen/knife/butcher"), 25]);
	return f.dot;
});

// lipoplasty.dm:19
rt.def("/datum/surgery_step/cut_fat/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to cut away ${target}'s excess fat.`, `<span class='notice'>You begin to cut away ${target}'s excess fat...</span>`);
	return f.dot;
});

// lipoplasty.dm:22
rt.def("/datum/surgery_step/cut_fat/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} cuts ${target}'s excess fat loose!`, `<span class='notice'>You cut ${target}'s excess fat loose.</span>`);
	return 1;
});

rt.type(1344, "/datum/surgery_step/remove_fat", "/datum/surgery_step", {
	name: "remove loose fat",
	implements: null,
	time: 32,
});

// lipoplasty.dm:28
rt.def("/datum/surgery_step/remove_fat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/retractor"), 100, T("/obj/item/weapon/screwdriver"), 45, T("/obj/item/weapon/wirecutters"), 35]);
	return f.dot;
});

// lipoplasty.dm:32
rt.def("/datum/surgery_step/remove_fat/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to extract ${target}'s loose fat!`, `<span class='notice'>You begin to extract ${target}'s loose fat...</span>`);
	return f.dot;
});

// lipoplasty.dm:35
rt.def("/datum/surgery_step/remove_fat/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let newmeat: Value = null;
	user.visible_message(`${user} extracts ${target}'s fat!`, `<span class='notice'>You extract ${target}'s fat.</span>`);
	target.overeatduration = 0;
	let removednutriment: Value = target.nutrition;
	target.nutrition = NUTRITION_LEVEL_WELL_FED;
	removednutriment -= 450;
	let H: Value = target;
	let typeofmeat: Value = T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human");
	if (H.dna && H.dna.species) {
		typeofmeat = H.dna.species.meat;
	}
	(newmeat = (yield* new_(typeofmeat))).name = "fatty meat";
	newmeat.desc = "Extremely fatty tissue taken from a patient.";
	newmeat.subjectname = H.real_name;
	newmeat.subjectjob = H.job;
	yield* newmeat.reagents.add_reagent("nutriment", removednutriment / 15);
	newmeat.loc = target.loc;
	return 1;
}, true);
