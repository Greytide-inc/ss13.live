// Based on /tg/station's code/modules/mob/living/carbon/alien/special/alien_embryo.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9458, "/obj/item/organ/body_egg/alien_embryo", "/obj/item/organ/body_egg", {
	stage: 0,
	bursting: 0,
	name: "alien embryo",
	icon: rt.rsc("icons/mob/alien.dmi"),
	icon_state: "larva0_dead",
});

// alien_embryo.dm:11
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/on_find", function* on_find(f: Frame, finder: Value) {
	yield* parent_proc();
	if (this.stage < 4) {
		to_chat(finder, "It's small and weak, barely the size of a foetus.");
	} else {
		to_chat(finder, "It's grown quite large, and writhes slightly as you look at it.");
		if (!prob(10)) return f.dot;
		yield* this.AttemptGrow(0);
	}
	return f.dot;
}, true);

// alien_embryo.dm:20
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	yield* (S = (yield* parent_proc())).reagents.add_reagent("sacid", 10);
	return S;
}, true);

// alien_embryo.dm:25
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/on_life", function* on_life(f: Frame) {
	if (this.stage === 2 || this.stage === 3) {
		if (prob(2)) {
			yield* this.owner.emote("sneeze");
		}
		if (prob(2)) {
			yield* this.owner.emote("cough");
		}
		if (prob(2)) {
			to_chat(this.owner, "<span class='danger'>Your throat feels sore.</span>");
		}
		if (prob(2)) {
			to_chat(this.owner, "<span class='danger'>Mucous runs down the back of your throat.</span>");
		}
	} else if (this.stage === 4) {
		if (prob(2)) {
			yield* this.owner.emote("sneeze");
		}
		if (prob(2)) {
			yield* this.owner.emote("cough");
		}
		if (prob(4)) {
			to_chat(this.owner, "<span class='danger'>Your muscles ache.</span>");
			if (prob(20)) {
				yield* this.owner.take_bodypart_damage(1);
			}
		}
		if (prob(4)) {
			to_chat(this.owner, "<span class='danger'>Your stomach hurts.</span>");
			if (prob(20)) {
				yield* this.owner.adjustToxLoss(1);
			}
		}
	} else if (this.stage === 5) {
		to_chat(this.owner, "<span class='danger'>You feel something tearing its way out of your stomach...</span>");
		yield* this.owner.adjustToxLoss(10);
	}
	return f.dot;
}, true);

// alien_embryo.dm:53
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/egg_process", function* egg_process(f: Frame) {
	let S: Value = null;
	if (this.stage < 5 && prob(3)) {
		this.stage++;
		yield* ImmediateInvokeAsync(this, P("/obj/item/organ/body_egg/proc/RefreshInfectionImage"));
	}
	if (!(this.stage == 5 && prob(50))) return f.dot;
	for (S of each(this.owner.surgeries, T("/datum/surgery"))) {
		if (S.location == "chest" && rt.istype((yield* S.get_surgery_step()), T("/datum/surgery_step/manipulate_organs"))) {
			yield* this.AttemptGrow(0);
			return f.dot;
		}
	}
	yield* this.AttemptGrow();
	return f.dot;
}, true);

// alien_embryo.dm:67
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/AttemptGrow", function* AttemptGrow(f: Frame, gib_on_success: Value) {
	let new_xeno: Value = null;
	gib_on_success ??= 1;
	if (!this.owner || this.bursting) {
		return f.dot;
	}
	this.bursting = 1;
	let candidates: Value = (yield* pollGhostCandidates(`Do you want to play as an alien larva that will burst out of ${this.owner}?`, "xenomorph", null, "xenomorph", 100, "alien_larva"));
	if (!this || this.gc_destroyed || !this.owner || this.owner.gc_destroyed) {
		return f.dot;
	}
	if (!rt.len(f, candidates) || !this.owner) {
		this.bursting = 0;
		this.stage = 4;
		return f.dot;
	}
	let ghost: Value = pick(candidates);
	let overlay: Value = mutable_appearance(rt.rsc("icons/mob/alien.dmi"), "burst_lie");
	this.owner.add_overlay(overlay);
	let xeno_loc: Value = rt.getStep(f, this.owner, 0);
	(new_xeno = (yield* new_(T("/mob/living/carbon/alien/larva"), xeno_loc))).key = ghost.key;
	rt.op(f, "Output", [], [new_xeno, sound(rt.rsc("sound/voice/hiss5.ogg"), 0, 0, 0, 100)], false);
	new_xeno.canmove = 0;
	new_xeno.notransform = 1;
	new_xeno.invisibility = INVISIBILITY_MAXIMUM;
	yield* sleep(6);
	// tg_js: the larva is hidden and frozen only for the burst's 0.6 s; it comes out first, whatever happened to the host
	// or embryo meanwhile (tg returned first when they were deleted, leaving the larva player invisible and frozen).
	if (new_xeno && !new_xeno.gc_destroyed) {
		new_xeno.canmove = 1;
		new_xeno.notransform = 0;
		new_xeno.invisibility = 0;
	}
	if (!this || this.gc_destroyed || !this.owner || this.owner.gc_destroyed) {
		return f.dot;
	}
	if (gib_on_success) {
		new_xeno.visible_message(`<span class='danger'>${new_xeno} bursts out of ${this.owner} in a shower of gore!</span>`, `<span class='userdanger'>You exit ${this.owner}, your previous host.</span>`, "<span class='italics'>You hear organic matter ripping and tearing!</span>");
		yield* this.owner.gib(1);
	} else {
		new_xeno.visible_message(`<span class='danger'>${new_xeno} wriggles out of ${this.owner}!</span>`, `<span class='userdanger'>You exit ${this.owner}, your previous host.</span>`);
		yield* this.owner.adjustBruteLoss(40);
		this.owner.cut_overlay(overlay);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// alien_embryo.dm:120
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/AddInfectionImages", function AddInfectionImages(f: Frame) {
	let alien: Value = null, I: Value = null;
	for (alien of each(GLOB.player_list, T("/mob/living/carbon/alien"))) {
		if (alien.client) {
			I = image(rt.rsc("icons/mob/alien.dmi"), { loc: this.owner, icon_state: `infected${this.stage}` });
			alien.client.images += I;
		}
	}
	return f.dot;
});

// alien_embryo.dm:130
rt.def("/obj/item/organ/body_egg/alien_embryo/proc/RemoveInfectionImages", function* RemoveInfectionImages(f: Frame) {
	let alien: Value = null, I: Value = null;
	for (alien of each(GLOB.player_list, T("/mob/living/carbon/alien"))) {
		if (alien.client) {
			I = null;
			for (I of each(alien.client.images, T("/image"))) {
				if (dd_hasprefix_case(I.icon_state, "infected") && I.loc == this.owner) {
					yield* qdel(I);
				}
			}
		}
	}
	return f.dot;
}, true);
