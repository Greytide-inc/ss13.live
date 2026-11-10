// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/humanoid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4824, "/mob/living/carbon/alien/humanoid", "/mob/living/carbon/alien", {
	r_store: null,
	l_store: null,
	caste: "",
	alt_icon: rt.rsc("icons/mob/alienleap.dmi"),
	leap_on_click: 0,
	pounce_cooldown: 0,
	pounce_cooldown_time: 30,
	custom_pixel_x_offset: 0,
	custom_pixel_y_offset: 0,
	sneaking: 0,
	drooling: 0,
	pass_flags: 1,
	name: "alien",
	icon_state: "alien",
	butcher_results: null,
	possible_a_intents: null,
	limb_destroyer: 1,
	bodyparts: null,
});

// humanoid.dm:5
rt.def("/mob/living/carbon/alien/humanoid/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"), 5, T("/obj/item/stack/sheet/animalhide/xeno"), 1]);
	this.possible_a_intents = list("help", "disarm", "grab", "harm");

	this.bodyparts = list(T("/obj/item/bodypart/chest/alien"), T("/obj/item/bodypart/head/alien"), T("/obj/item/bodypart/l_arm/alien"), T("/obj/item/bodypart/r_arm/alien"), T("/obj/item/bodypart/r_leg/alien"), T("/obj/item/bodypart/l_leg/alien"));
	return f.dot;
});

// humanoid.dm:25
rt.def("/mob/living/carbon/alien/humanoid/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.AddAbility((yield* new_(T("/obj/effect/proc_holder/alien/regurgitate"), null)));
	yield* parent_proc();
	return f.dot;
}, true);

// humanoid.dm:29
rt.def("/mob/living/carbon/alien/humanoid/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += this.move_delay_add + GLOB.config.alien_delay + this.sneaking;
	return f.dot;
});

// humanoid.dm:33
rt.def("/mob/living/carbon/alien/humanoid/proc/restrained", function restrained(f: Frame, ignore_grab: Value) {
	f.dot = this.handcuffed;
	return f.dot;
});

// humanoid.dm:37
rt.def("/mob/living/carbon/alien/humanoid/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* user.set_machine(this);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// humanoid.dm:62
rt.def("/mob/living/carbon/alien/humanoid/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!f.usr.canUseTopic(this, BE_CLOSE, NO_DEXTERY)) return f.dot;
	if (!rt.at(href_list, "pouches")) return f.dot;
	this.visible_message(`<span class='danger'>${f.usr} tries to empty ${this}'s pouches.</span>`, `<span class='userdanger'>${f.usr} tries to empty ${this}'s pouches.</span>`);
	if (!(yield* do_mob(f.usr, this, 20))) return f.dot;
	yield* this.dropItemToGround(this.r_store);
	yield* this.dropItemToGround(this.l_store);
	return f.dot;
}, true);

// humanoid.dm:73
rt.def("/mob/living/carbon/alien/humanoid/proc/cuff_resist", function* cuff_resist(f: Frame, I: Value) {
	playsound(this, rt.rsc("sound/voice/hiss5.ogg"), 40, 1, 1);
	yield* parent_proc(I, { cuff_break: 2 });
	return f.dot;
}, true);

// humanoid.dm:77
rt.def("/mob/living/carbon/alien/humanoid/proc/resist_grab", function* resist_grab(f: Frame, moving_resist: Value) {
	if (this.pulledby.grab_state) {
		this.visible_message(`<span class='danger'>${this} has broken free of ${this.pulledby}'s grip!</span>`);
	}
	yield* this.pulledby.stop_pulling();
	f.dot = 0;
	return f.dot;
}, true);

// humanoid.dm:84
rt.def("/mob/living/carbon/alien/humanoid/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	lying ??= 0;
	if (this.leaping) {
		return -32;
	} else if (this.custom_pixel_y_offset) {
		return this.custom_pixel_y_offset;
	} else {
		return rt.initial(f, this, "pixel_y");
	}
});

// humanoid.dm:92
rt.def("/mob/living/carbon/alien/humanoid/proc/get_standard_pixel_x_offset", function get_standard_pixel_x_offset(f: Frame, lying: Value) {
	lying ??= 0;
	if (this.leaping) {
		return -32;
	} else if (this.custom_pixel_x_offset) {
		return this.custom_pixel_x_offset;
	} else {
		return rt.initial(f, this, "pixel_x");
	}
});

// humanoid.dm:102
rt.def("/mob/living/carbon/alien/humanoid/proc/alien_evolve", function* alien_evolve(f: Frame, new_xeno: Value) {
	let A: Value = null;
	yield* this.drop_all_held_items();
	for (A of each(this.stomach_contents, T("/atom/movable"))) {
		yield* this.stomach_contents.Remove(A);
		new_xeno.stomach_contents.Add(A);
		A.loc = new_xeno;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// humanoid.dm:111
rt.def("/proc/get_alien_type", function get_alien_type(f: Frame, alienpath: Value) {
	let A: Value = null;
	for (A of each(GLOB.living_mob_list, T("/mob/living/carbon/alien/humanoid"))) {
		if (!rt.op(f, "IsType", [], [A, alienpath])) {
			continue;
		}
		if (!A.key || A.stat == 2) {
			continue;
		}
		return A;
	}
	return 0;
});

// humanoid.dm:121
rt.def("/mob/living/carbon/alien/humanoid/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	if (breath && breath.total_moles() > 0 && !this.sneaking) {
		playsound(rt.getStep(f, this, 0), pick(rt.rsc("sound/voice/lowHiss2.ogg"), rt.rsc("sound/voice/lowHiss3.ogg"), rt.rsc("sound/voice/lowHiss4.ogg")), 50, 0, -5);
	}
	yield* parent_proc();
	return f.dot;
}, true);
