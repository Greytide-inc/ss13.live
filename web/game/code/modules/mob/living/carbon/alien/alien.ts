// Based on /tg/station's code/modules/mob/living/carbon/alien/alien.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4822, "/mob/living/carbon/alien", "/mob/living/carbon", {
	nightvision: 1,
	wear_id: null,
	has_fine_manipulation: 0,
	move_delay_add: 0,
	heat_protection: 0.5,
	leaping: 0,
	verb_say: "hisses",
	initial_language_holder: rt.typePath("/datum/language_holder/alien"),
	name: "alien",
	voice_name: "alien",
	icon: rt.rsc("icons/mob/alien.dmi"),
	gender: "female",
	dna: null,
	faction: null,
	ventcrawler: 2,
	sight: 4,
	see_in_dark: 4,
	bubble_icon: "alien",
	status_flags: 12,
	unique_name: 1,
	type_of_meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"),
	gib_type: rt.typePath("/obj/effect/decal/cleanable/xenoblood/xgibs"),
}, { global: { alien_name_regex: 1042 } });

// alien.dm:12
rt.def("/mob/living/carbon/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("alien");
	return f.dot;
});

// alien.dm:36
rt.def("/mob/living/carbon/alien/proc/Initialize", function* Initialize(f: Frame) {
	this.verbs += P("/mob/living/proc/mob_sleep");
	this.verbs += P("/mob/living/proc/lay_down");
	yield* this.create_bodyparts();
	yield* this.create_internal_organs();
	yield* parent_proc();
	return f.dot;
}, true);

// alien.dm:46
rt.def("/mob/living/carbon/alien/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	this.internal_organs += (yield* new_(T("/obj/item/organ/brain/alien")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/alien/hivenode")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/tongue/alien")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/eyes/night_vision/alien")));
	this.internal_organs += (yield* new_(T("/obj/item/organ/ears")));
	yield* parent_proc();
	return f.dot;
}, true);

// alien.dm:57
rt.def("/mob/living/carbon/alien/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let thermal_protection: Value = null;
	if (!environment) {
		return f.dot;
	}
	let loc_temp: Value = this.get_temperature(environment);
	if (!this.on_fire) {
		if (loc_temp > this.bodytemperature) {
			if ((thermal_protection = this.heat_protection) < 1) {
				this.bodytemperature += (1 - thermal_protection) * ((loc_temp - this.bodytemperature) / BODYTEMP_HEAT_DIVISOR);
			}
		} else {
			this.bodytemperature += 1 * ((loc_temp - this.bodytemperature) / BODYTEMP_HEAT_DIVISOR);
		}
	}
	if (this.bodytemperature > 360.15) {
		yield* this.throw_alert("alien_fire", T("/obj/screen/alert/alien_fire"));
		if (rt.inRange(this.bodytemperature, 360, 400)) {
			yield* this.apply_damage(HEAT_DAMAGE_LEVEL_1, "fire");
		} else if (rt.inRange(this.bodytemperature, 400, 460)) {
			yield* this.apply_damage(HEAT_DAMAGE_LEVEL_2, "fire");
		} else if (rt.inRange(this.bodytemperature, 460, 1e+31)) {
			if (this.on_fire) {
				yield* this.apply_damage(HEAT_DAMAGE_LEVEL_3, "fire");
			} else {
				yield* this.apply_damage(HEAT_DAMAGE_LEVEL_2, "fire");
			}
		}
	} else {
		yield* this.clear_alert("alien_fire");
	}
	return f.dot;
}, true);

// alien.dm:97
rt.def("/mob/living/carbon/alien/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat(null, `Intent: ${this.a_intent}`);
	return f.dot;
}, true);

// alien.dm:103
rt.def("/mob/living/carbon/alien/proc/getTrail", function getTrail(f: Frame) {
	if (this.getBruteLoss() < 200) {
		return pick(list("xltrails_1", "xltrails2"));
	}
	return pick(list("xttrails_1", "xttrails2"));
});

// alien.dm:113
rt.def("/mob/living/carbon/alien/proc/AddInfectionImages", function AddInfectionImages(f: Frame) {
	let C: Value = null, A: Value = null, I: Value = null;
	if (this.client) {
		for (C of each(GLOB.mob_list, T("/mob/living"))) {
			if (rt.bitAnd(C.status_flags, XENO_HOST)) {
				if (A = C.getorgan(T("/obj/item/organ/body_egg/alien_embryo"))) {
					I = image(rt.rsc("icons/mob/alien.dmi"), { loc: C, icon_state: `infected${A.stage}` });
					this.client.images += I;
				}
			}
		}
	}
	return f.dot;
});

// alien.dm:128
rt.def("/mob/living/carbon/alien/proc/RemoveInfectionImages", function* RemoveInfectionImages(f: Frame) {
	let I: Value = null;
	if (this.client) {
		for (I of each(this.client.images, T("/image"))) {
			if (dd_hasprefix_case(I.icon_state, "infected")) {
				yield* qdel(I);
			}
		}
	}
	return f.dot;
}, true);

// alien.dm:137
rt.def("/mob/living/carbon/alien/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	lying ??= 0;
	return rt.initial(f, this, "pixel_y");
});

// alien.dm:140
rt.def("/mob/living/carbon/alien/proc/alien_evolve", function* alien_evolve(f: Frame, new_xeno: Value) {
	to_chat(this, "<span class='noticealien'>You begin to evolve!</span>");
	this.visible_message(`<span class='alertalien'>${this} begins to twist and contort!</span>`);
	yield* new_xeno.setDir(this.dir);
	if (!GLOB.alien_name_regex.Find(this.name)) {
		new_xeno.name = this.name;
		new_xeno.real_name = this.real_name;
	}
	if (this.mind) {
		yield* this.mind.transfer_to(new_xeno);
	}
	yield* qdel(this);
	return f.dot;
}, true);
