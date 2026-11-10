// Based on /tg/station's code/modules/surgery/surgery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1308, "/datum/surgery", "/datum", {
	name: "surgery",
	status: 1,
	steps: null,
	step_in_progress: 0,
	can_cancel: 1,
	location: "chest",
	requires_organic_bodypart: 1,
	possible_locs: null,
	ignore_clothes: 0,
	target: null,
	operated_bodypart: null,
	requires_bodypart: 1,
	success_multiplier: 0,
	requires_real_bodypart: 0,
	species: null,
});

// surgery.dm:4
rt.def("/datum/surgery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list();

	this.possible_locs = list();

	this.species = list(T("/mob/living/carbon/human"));
	return f.dot;
});

// surgery.dm:19
rt.def("/datum/surgery/proc/New", function New(f: Frame, surgery_target: Value, surgery_location: Value, surgery_bodypart: Value) {
	parent_proc();
	if (!surgery_target) return f.dot;
	this.target = surgery_target;
	this.target.surgeries += this;
	if (surgery_location) {
		this.location = surgery_location;
	}
	if (!surgery_bodypart) return f.dot;
	this.operated_bodypart = surgery_bodypart;
	return f.dot;
}, false);

// surgery.dm:30
rt.def("/datum/surgery/proc/Destroy", function* Destroy(f: Frame) {
	if (this.target) {
		this.target.surgeries -= this;
	}
	this.target = null;
	this.operated_bodypart = null;
	return (yield* parent_proc());
}, true);

// surgery.dm:46
rt.def("/datum/surgery/proc/next_step", function* next_step(f: Frame, user: Value) {
	let S: Value = null;
	if (this.step_in_progress) {
		return 1;
	}
	if (S = (yield* this.get_surgery_step())) {
		if (yield* S.try_op(user, this.target, user.zone_selected, user.get_active_held_item(), this)) {
			return 1;
		}
	}
	return 0;
}, true);

// surgery.dm:53
rt.def("/datum/surgery/proc/get_surgery_step", function* get_surgery_step(f: Frame) {
	let step_type: Value = rt.index(this.steps, this.status);
	return (yield* new_(step_type));
}, true);

// surgery.dm:57
rt.def("/datum/surgery/proc/complete", function* complete(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// surgery.dm:63
rt.def("/datum/surgery/proc/get_propability_multiplier", function get_propability_multiplier(f: Frame) {
	let propability: Value = 0.5;
	let _T: Value = rt.getStep(f, this.target, 0);
	if (rt.locateIn(f, T("/obj/structure/table/optable"), _T)) {
		propability = 1;
	} else if (rt.locateIn(f, T("/obj/structure/table"), _T)) {
		propability = 0.8;
	} else if (rt.locateIn(f, T("/obj/structure/bed"), _T)) {
		propability = 0.7;
	}
	return propability + this.success_multiplier;
});
