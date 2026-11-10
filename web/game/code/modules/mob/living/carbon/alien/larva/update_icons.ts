// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/update_icons.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// update_icons.dm:3
rt.def("/mob/living/carbon/alien/larva/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	this.cut_overlays();
	this.update_icons();
	return f.dot;
});

// update_icons.dm:8
rt.def("/mob/living/carbon/alien/larva/proc/update_icons", function update_icons(f: Frame) {
	let state: Value = 0;
	if (this.amount_grown > 80) {
		state = 2;
	} else if (this.amount_grown > 50) {
		state = 1;
	}
	if (this.stat == 2) {
		this.icon_state = `larva${state}_dead`;
	} else if (this.handcuffed || this.legcuffed) {
		this.icon_state = `larva${state}_cuff`;
	} else if (this.stat == 1 || this.lying || this.resting) {
		this.icon_state = `larva${state}_sleep`;
	} else if (this.IsStun()) {
		this.icon_state = `larva${state}_stun`;
	} else {
		this.icon_state = `larva${state}`;
	}
	return f.dot;
});

// update_icons.dm:25
rt.def("/mob/living/carbon/alien/larva/proc/update_transform", function update_transform(f: Frame) {
	parent_proc();
	return this.update_icons();
});

// update_icons.dm:29
rt.def("/mob/living/carbon/alien/larva/proc/update_inv_handcuffed", function update_inv_handcuffed(f: Frame) {
	this.update_icons();
	return f.dot;
});
