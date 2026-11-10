// Based on /tg/station's code/modules/surgery/plastic_surgery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1321, "/datum/surgery/plastic_surgery", "/datum/surgery", {
	name: "plastic surgery",
	steps: null,
	possible_locs: null,
});

// plastic_surgery.dm:3
rt.def("/datum/surgery/plastic_surgery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.steps = list(T("/datum/surgery_step/incise"), T("/datum/surgery_step/retract_skin"), T("/datum/surgery_step/reshape_face"), T("/datum/surgery_step/close"));

	this.possible_locs = list("head");
	return f.dot;
});

rt.type(1346, "/datum/surgery_step/reshape_face", "/datum/surgery_step", {
	name: "reshape face",
	implements: null,
	time: 64,
});

// plastic_surgery.dm:9
rt.def("/datum/surgery_step/reshape_face/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.implements = rt.alist(f, [T("/obj/item/weapon/scalpel"), 100, T("/obj/item/weapon/kitchen/knife"), 50, T("/obj/item/weapon/wirecutters"), 35]);
	return f.dot;
});

// plastic_surgery.dm:13
rt.def("/datum/surgery_step/reshape_face/proc/preop", function preop(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	user.visible_message(`${user} begins to alter ${target}'s appearance.`, `<span class='notice'>You begin to alter ${target}'s appearance...</span>`);
	return f.dot;
});

// plastic_surgery.dm:16
rt.def("/datum/surgery_step/reshape_face/proc/success", function* success(f: Frame, user: Value, target: Value, target_zone: Value, tool: Value, surgery: Value) {
	let oldname: Value = null, newname: Value = null, H: Value = null;
	if (rt.bitAnd(target.status_flags, 16384)) {
		(rt.modField(f, target, "status_flags", 16760831, rt.bitAnd));
		user.visible_message(`${user} successfully restores ${target}'s appearance!`, `<span class='notice'>You successfully restore ${target}'s appearance.</span>`);
	} else {
		oldname = target.real_name;
		target.real_name = target.dna.species.random_name(target.gender, 1);
		newname = target.real_name;
		user.visible_message(`${user} alters ${oldname}'s appearance completely, ${target.p_they()} is now ${newname}!`, `<span class='notice'>You alter ${oldname}'s appearance completely, ${target.p_they()} is now ${newname}.</span>`);
	}
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		yield* (H = target).sec_hud_set_ID();
	}
	return 1;
}, true);
