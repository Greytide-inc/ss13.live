// Based on /tg/station's code/modules/surgery/surgery_step.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1326, "/datum/surgery_step", "/datum", {
	name: null,
	implements: null,
	implement_type: null,
	accept_hand: 0,
	accept_any_item: 0,
	time: 10,
});

// surgery_step.dm:3
rt.def("/datum/surgery_step/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = list();
	return f.dot;
});

// surgery_step.dm:13
rt.def("/datum/surgery_step/proc/try_op", function* try_op(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let path: Value = null;
	let success: Value = 0;
	if (this.accept_hand) {
		if (!tool) {
			success = 1;
		}
	}
	if (this.accept_any_item) {
		if (tool && this.tool_check(user, tool)) {
			success = 1;
		}
	} else {
		for (path of each(this.implements)) {
			if (rt.op(f, "IsType", [], [tool, path])) {
				this.implement_type = path;
				if (this.tool_check(user, tool)) {
					success = 1;
					break;
				}
			}
		}
	}
	if (success) {
		if (target_zone == surgery.location) {
			if (get_location_accessible(target, target_zone) || surgery.ignore_clothes) {
				yield* this.initiate(user, target, target_zone, tool, surgery);
				return 1;
			} else {
				to_chat(user, `<span class='warning'>You need to expose ${target}'s ${parse_zone(target_zone)} to perform surgery on it!</span>`);
				return 1;
			}
		}
	}
	if (rt.istype(user, T("/mob/living/silicon/robot")) && user.a_intent != "harm") {
		return 1;
	}
	return 0;
}, true);

// surgery_step.dm:40
rt.def("/datum/surgery_step/proc/initiate", function* initiate(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let advance: Value = null, prob_chance: Value = null;
	surgery.step_in_progress = 1;
	let speed_mod: Value = 1;
	if ((yield* this.preop(user, target, target_zone, tool, surgery)) == -1) {
		surgery.step_in_progress = 0;
		return f.dot;
	}
	if (tool) {
		speed_mod = tool.toolspeed;
	}
	if (yield* do_after(user, this.time * speed_mod, { target: target })) {
		advance = 0;
		prob_chance = 100;
		if (this.implement_type) {
			prob_chance = rt.index(this.implements, this.implement_type);
		}
		prob_chance *= surgery.get_propability_multiplier();
		if (prob(prob_chance) || rt.istype(user, T("/mob/living/silicon/robot"))) {
			if (yield* this.success(user, target, target_zone, tool, surgery)) {
				advance = 1;
			}
		} else if (this.failure(user, target, target_zone, tool, surgery)) {
			advance = 1;
		}
		if (advance) {
			surgery.status++;
			if (surgery.status > rt.len(f, surgery.steps)) {
				yield* surgery.complete();
			}
		}
	}
	surgery.step_in_progress = 0;
	return f.dot;
}, true);

// surgery_step.dm:75
rt.def("/datum/surgery_step/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to perform surgery on ${target}.`, `<span class='notice'>You begin to perform surgery on ${target}...</span>`);
	return f.dot;
});

// surgery_step.dm:79
rt.def("/datum/surgery_step/proc/success", function success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} succeeds!`, "<span class='notice'>You succeed.</span>");
	return 1;
});

// surgery_step.dm:83
rt.def("/datum/surgery_step/proc/failure", function failure(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`<span class='warning'>${user} screws up!</span>`, "<span class='warning'>You screw up!</span>");
	return 0;
});
