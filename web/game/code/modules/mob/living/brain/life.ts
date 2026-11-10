// Based on /tg/station's code/modules/mob/living/brain/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:8
rt.def("/mob/living/brain/proc/Life", function Life(f: Frame) {
	if (this.notransform) {
		return f.dot;
	}
	if (!this.loc) {
		return f.dot;
	}
	f.dot = parent_proc();
	this.handle_emp_damage();
	return f.dot;
}, false, { waitfor: false });

// life.dm:14
rt.def("/mob/living/brain/proc/update_stat", function* update_stat(f: Frame) {
	let BR: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (!(this.health <= -100)) return f.dot;
	if (this.stat != 2) {
		yield* this.death();
	}
	if (this.container && this.container.brain) {
		BR = this.container.brain;
	} else if (rt.istype(this.loc, T("/obj/item/organ/brain"))) {
		BR = this.loc;
	}
	if (!BR) return f.dot;
	BR.damaged_brain = 1;
	return f.dot;
}, true);

// life.dm:37
rt.def("/mob/living/brain/proc/handle_emp_damage", function handle_emp_damage(f: Frame) {
	if (!this.emp_damage) return f.dot;
	if (this.stat == 2) {
		this.emp_damage = 0;
	} else {
		this.emp_damage = max(this.emp_damage - 1, 0);
	}
	return f.dot;
});
