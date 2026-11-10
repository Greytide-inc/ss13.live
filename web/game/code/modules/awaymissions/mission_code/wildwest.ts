// Based on /tg/station's code/modules/awaymissions/mission_code/wildwest.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(10891, "/obj/machinery/wish_granter_dark", "/obj/machinery", {
	chargesa: 1,
	insistinga: 0,
	anchored: 1,
	use_power: 0,
	name: "Wish Granter",
	desc: "You're not so sure about this, anymore...",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	density: 1,
});

// wildwest.dm:25
rt.def("/obj/machinery/wish_granter_dark/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let wish: Value = null, hijack: Value = null, F: Value = null;
	let $e: any;
	yield* f.usr.set_machine(this);
	if (this.chargesa <= 0) {
		to_chat(user, "The Wish Granter lies silent.");
		return f.dot;
	} else if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		to_chat(user, "You feel a dark stirring inside of the Wish Granter, something you want nothing of. Your instincts are better than any man's.");
		return f.dot;
	} else if (is_special_character(user)) {
		to_chat(user, "Even to a heart as dark as yours, you know nothing good will come of this.  Something instinctual makes you pull away.");
	} else if (!this.insistinga) {
		to_chat(user, "Your first touch makes the Wish Granter stir, listening to you.  Are you really sure you want to do this?");
		this.insistinga++;
	} else {
		this.chargesa--;
		this.insistinga = 0;
		const subject = (wish = (yield* g.op(f, "Prompt", [1], [null, null, "Wish", "You want...", list("Power", "Wealth", "Immortality", "To Kill", "Peace")])));
		if (subject === "Power") {
			to_chat(user, "<B>Your wish is granted, but at a terrible cost...</B>");
			to_chat(user, "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart.");
			yield* user.dna.add_mutation("Laser Eyes");
			yield* user.dna.add_mutation("Cold Resistance");
			yield* user.dna.add_mutation("X Ray Vision");
			yield* user.set_species(T("/datum/species/shadow"));
		} else if (subject === "Wealth") {
			to_chat(user, "<B>Your wish is granted, but at a terrible cost...</B>");
			to_chat(user, "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart.");
			yield* new_(T("/obj/structure/closet/syndicate/resources/everything"), this.loc);
			yield* user.set_species(T("/datum/species/shadow"));
		} else if (subject === "Immortality") {
			to_chat(user, "<B>Your wish is granted, but at a terrible cost...</B>");
			to_chat(user, "The Wish Granter punishes you for your selfishness, claiming your soul and warping your body to match the darkness in your heart.");
			user.verbs += P("/mob/living/carbon/proc/immortality");
			yield* user.set_species(T("/datum/species/shadow"));
		} else if (subject === "To Kill") {
			to_chat(user, "<B>Your wish is granted, but at a terrible cost...</B>");
			to_chat(user, "The Wish Granter punishes you for your wickedness, claiming your soul and warping your body to match the darkness in your heart.");
			GLOB.SSticker.mode.traitors += user.mind;
			user.mind.special_role = "traitor";
			(hijack = (yield* new_(T("/datum/objective/hijack")))).owner = user.mind;
			user.mind.objectives += hijack;
			to_chat(user, "<B>Your inhibitions are swept away, the bonds of loyalty broken, you are free to murder as you please!</B>");
			user.mind.announce_objectives();
			yield* user.set_species(T("/datum/species/shadow"));
		} else if (subject === "Peace") {
			to_chat(user, "<B>Whatever alien sentience that the Wish Granter possesses is satisfied with your wish. There is a distant wailing as the last of the Faithless begin to die, then silence.</B>");
			to_chat(user, "You feel as if you just narrowly avoided a terrible fate...");
			for (F of each(GLOB.mob_list, T("/mob/living/simple_animal/hostile/faithless"))) {
				yield* F.death();
			}
		}
	}
	return f.dot;
}, true);

rt.type(12046, "/obj/effect/meatgrinder", "/obj/effect", {
	triggered: 0,
	anchored: 1,
	name: "Meat Grinder",
	desc: "What is that thing?",
	density: 1,
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blobpod",
});

// wildwest.dm:95
rt.def("/obj/effect/meatgrinder/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* this.Bumped(AM);
	return f.dot;
}, true);

// wildwest.dm:102
rt.def("/obj/effect/meatgrinder/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let O: Value = null, s: Value = null;
	if (this.triggered) {
		return f.dot;
	}
	if (!(rt.istype(M, T("/mob/living/carbon/human")) && M.stat != 2 && M.ckey)) return f.dot;
	for (O of each(viewers(rt.world().view, this.loc), T("/mob"))) {
	}
	this.visible_message(`<span class='warning'>${M} triggered the ${this}!</span>`);
	this.triggered = 1;
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, this);
	yield* s.start();
	yield* explosion(M, 1, 0, 0, 0);
	yield* qdel(this);
	return f.dot;
}, true);

// wildwest.dm:119
rt.def("/mob/living/carbon/proc/immortality", function* immortality(f: Frame) {
	let C: Value = null;
	if (!(C = f.usr).stat) {
		to_chat(C, "<span class='notice'>You're not dead yet!</span>");
		return f.dot;
	}
	if (C.has_status_effect(T("/datum/status_effect/wish_granters_gift"))) {
		to_chat(C, "<span class='warning'>You're already resurrecting!</span>");
		return f.dot;
	}
	yield* C.apply_status_effect(T("/datum/status_effect/wish_granters_gift"));
	return 1;
}, true, { verb: { name: "Resurrection", category: "Immortality" } });
