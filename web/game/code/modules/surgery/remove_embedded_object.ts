// Based on /tg/station's code/modules/surgery/remove_embedded_object.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1323, "/datum/surgery/embedded_removal", "/datum/surgery", {
	name: "removal of embedded objects",
	steps: null,
	possible_locs: null,
});

// remove_embedded_object.dm:3
rt.def("/datum/surgery/embedded_removal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/clamp_bleeders"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/remove_object"));
	this.possible_locs = list("r_arm", "l_arm", "r_leg", "l_leg", "chest", "head");
	return f.dot;
});

rt.type(1348, "/datum/surgery_step/remove_object", "/datum/surgery_step", {
	L: null,
	name: "remove embedded objects",
	time: 32,
	accept_hand: 1,
});

// remove_embedded_object.dm:17
rt.def("/datum/surgery_step/remove_object/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	this.L = surgery.operated_bodypart;
	if (this.L) {
		user.visible_message(`${user} looks for objects embedded in ${target}'s ${parse_zone(user.zone_selected)}.`, `<span class='notice'>You look for objects embedded in ${target}'s ${parse_zone(user.zone_selected)}...</span>`);
	} else {
		user.visible_message(`${user} looks for ${target}'s ${parse_zone(user.zone_selected)}.`, `<span class='notice'>You look for ${target}'s ${parse_zone(user.zone_selected)}...</span>`);
	}
	return f.dot;
});

// remove_embedded_object.dm:24
rt.def("/datum/surgery_step/remove_object/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let H: Value = null, objects: Value = null, I: Value = null;
	if (this.L) {
		if (rt.istype(target, T("/mob/living/carbon/human"))) {
			H = target;
			objects = 0;
			for (I of each(this.L.embedded_objects, T("/obj/item"))) {
				objects++;
				I.loc = rt.getStep(f, H, 0);
				this.L.embedded_objects -= I;
			}
			if (!H.has_embedded_objects()) {
				yield* H.clear_alert("embeddedobject");
			}
			if (objects > 0) {
				user.visible_message(`${user} sucessfully removes ${objects} objects from ${H}'s ${this.L}!`, `<span class='notice'>You successfully remove ${objects} objects from ${H}'s ${this.L.name}.</span>`);
			} else {
				to_chat(user, `<span class='warning'>You find no objects embedded in ${H}'s ${this.L}!</span>`);
			}
		}
	} else {
		to_chat(user, `<span class='warning'>You can't find ${target}'s ${parse_zone(user.zone_selected)}, let alone any objects embedded in it!</span>`);
	}
	return 1;
}, true);
