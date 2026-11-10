// Based on /tg/station's code/game/gamemodes/changeling/powers/tiny_prick.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11253, "/obj/effect/proc_holder/changeling/sting", "/obj/effect/proc_holder/changeling", {
	sting_icon: null,
	name: "Tiny Prick",
	desc: "Stabby stabby",
});

// tiny_prick.dm:7
rt.def("/obj/effect/proc_holder/changeling/sting/proc/Click", function Click(f: Frame) {
	let user: Value = null;
	if (!(user = f.usr) || !user.mind || !user.mind.changeling) {
		return f.dot;
	}
	if (!user.mind.changeling.chosen_sting) {
		this.set_sting(user);
	} else {
		this.unset_sting(user);
	}
	return f.dot;
});

// tiny_prick.dm:17
rt.def("/obj/effect/proc_holder/changeling/sting/proc/set_sting", function set_sting(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>We prepare our sting, use alt+click or middle mouse button on target to sting them.</span>");
	user.mind.changeling.chosen_sting = this;
	user.hud_used.lingstingdisplay.icon_state = this.sting_icon;
	user.hud_used.lingstingdisplay.invisibility = 0;
	return f.dot;
});

// tiny_prick.dm:23
rt.def("/obj/effect/proc_holder/changeling/sting/proc/unset_sting", function unset_sting(f: Frame, user: Value) {
	to_chat(user, "<span class='warning'>We retract our sting, we can't sting anyone for now.</span>");
	user.mind.changeling.chosen_sting = null;
	user.hud_used.lingstingdisplay.icon_state = null;
	user.hud_used.lingstingdisplay.invisibility = INVISIBILITY_ABSTRACT;
	return f.dot;
});

// tiny_prick.dm:29
rt.def("/mob/living/carbon/proc/unset_sting", function unset_sting(f: Frame) {
	if (!(this.mind && this.mind.changeling && this.mind.changeling.chosen_sting)) return f.dot;
	this.mind.changeling.chosen_sting.unset_sting(this);
	return f.dot;
});

// tiny_prick.dm:33
rt.def("/obj/effect/proc_holder/changeling/sting/proc/can_sting", function* can_sting(f: Frame, user: Value, target: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (!user.mind.changeling.chosen_sting) {
		to_chat(user, "We haven't prepared our sting yet!");
	}
	if (!rt.istype(target, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!isturf(user.loc)) {
		return f.dot;
	}
	if (!(yield* AStar(user, target.loc, P("/turf/proc/Distance"), user.mind.changeling.sting_range, { simulated_only: 0 }))) {
		return f.dot;
	}
	if (target.mind && target.mind.changeling) {
		this.sting_feedback(user, target);
		user.mind.changeling.chem_charges -= this.chemical_cost;
	}
	return 1;
}, true);

// tiny_prick.dm:49
rt.def("/obj/effect/proc_holder/changeling/sting/proc/sting_feedback", function sting_feedback(f: Frame, user: Value, target: Value) {
	if (!target) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>We stealthily sting ${target.name}.</span>`);
	if (target.mind && target.mind.changeling) {
		to_chat(target, "<span class='warning'>You feel a tiny prick.</span>");
	}
	return 1;
});

rt.type(11254, "/obj/effect/proc_holder/changeling/sting/transformation", "/obj/effect/proc_holder/changeling/sting", {
	selected_dna: null,
	helptext: "The victim will transform much like a changeling would. Does not provide a warning to others. Mutations will not be transferred, and monkeys will become human.",
	sting_icon: "sting_transform",
	chemical_cost: 50,
	dna_cost: 3,
	name: "Transformation Sting",
	desc: "We silently sting a human, injecting a retrovirus that forces them to transform.",
});

// tiny_prick.dm:67
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/Click", function* Click(f: Frame) {
	let changeling: Value = null;
	let user: Value = f.usr;
	if ((changeling = user.mind.changeling).chosen_sting) {
		this.unset_sting(user);
		return f.dot;
	}
	this.selected_dna = (yield* changeling.select_dna("Select the target DNA: ", "Target DNA"));
	if (!this.selected_dna) {
		return f.dot;
	}
	if (rt.isIn(f, NOTRANSSTING, this.selected_dna.dna.species.species_traits)) {
		to_chat(user, "<span class = 'notice'>That DNA is not compatible with changeling retrovirus!");
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// tiny_prick.dm:81
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/can_sting", function* can_sting(f: Frame, user: Value, target: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (rt.bitAnd(target.disabilities, 64) || !target.has_dna()) {
		to_chat(user, "<span class='warning'>Our sting appears ineffective against its DNA.</span>");
		return 0;
	}
	return 1;
}, true);

// tiny_prick.dm:89
rt.def("/obj/effect/proc_holder/changeling/sting/transformation/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "transformation sting", ` new identity is ${this.selected_dna.dna.real_name}`);
	let NewDNA: Value = this.selected_dna.dna;
	if (rt.istype(target, T("/mob/living/carbon/monkey"))) {
		to_chat(user, `<span class='notice'>Our genes cry out as we sting ${target.name}!</span>`);
	}
	let C: Value = target;
	f.dot = TR_KEEPITEMS;
	if (!rt.istype(C, T("/mob/living/carbon"))) return f.dot;
	C.real_name = NewDNA.real_name;
	yield* NewDNA.transfer_identity(C);
	if (rt.istype(C, T("/mob/living/carbon/monkey"))) {
		yield* C.humanize(343);
	}
	yield* C.updateappearance({ mutcolor_update: 1 });
	return f.dot;
}, true);

rt.type(11255, "/obj/effect/proc_holder/changeling/sting/false_armblade", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "The victim will form an armblade much like a changeling would, except the armblade is dull and useless.",
	sting_icon: "sting_armblade",
	chemical_cost: 20,
	dna_cost: 1,
	name: "False Armblade Sting",
	desc: "We silently sting a human, injecting a retrovirus that mutates their arm to temporarily appear as an armblade.",
});

// tiny_prick.dm:120
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/can_sting", function* can_sting(f: Frame, user: Value, target: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (rt.bitAnd(target.disabilities, 64) || !target.has_dna()) {
		to_chat(user, "<span class='warning'>Our sting appears ineffective against its DNA.</span>");
		return 0;
	}
	return 1;
}, true);

// tiny_prick.dm:128
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	yield* add_logs(user, target, "stung", { object: "falso armblade sting" });
	if (!(yield* target.drop_item())) {
		to_chat(user, `<span class='warning'>The ${target.get_active_held_item()} is stuck to their hand, you cannot grow a false armblade over it!</span>`);
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon/monkey"))) {
		to_chat(user, `<span class='notice'>Our genes cry out as we sting ${target.name}!</span>`);
	}
	let blade: Value = (yield* new_(T("/obj/item/weapon/melee/arm_blade/false"), target, 1));
	yield* target.put_in_hands(blade);
	target.visible_message(`<span class='warning'>A grotesque blade forms around ${target.name}'s arm!</span>`, "<span class='userdanger'>Your arm twists and mutates, transforming into a horrific monstrosity!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
	playsound(target, rt.rsc("sound/effects/blobattack.ogg"), 30, 1);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/remove_fake"), target, blade)), 600);
	return 1;
}, true);

// tiny_prick.dm:146
rt.def("/obj/effect/proc_holder/changeling/sting/false_armblade/proc/remove_fake", function* remove_fake(f: Frame, target: Value, blade: Value) {
	playsound(target, rt.rsc("sound/effects/blobattack.ogg"), 30, 1);
	target.visible_message(`<span class='warning'>With a sickening crunch, ${target} reforms their ${blade.name} into an arm!</span>`, `<span class='warning'>${blade} reforms back to normal.</span>`, "<span class='italics>You hear organic matter ripping and tearing!</span>");
	yield* qdel(blade);
	yield* target.update_inv_hands();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }, { type: 4, path: "/obj/item/weapon/melee/arm_blade/false" }] });

rt.type(11256, "/obj/effect/proc_holder/changeling/sting/extract_dna", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Will give you the DNA of your target, allowing you to transform into them.",
	sting_icon: "sting_extract",
	chemical_cost: 25,
	dna_cost: 0,
	name: "Extract DNA Sting",
	desc: "We stealthily sting a target and extract their DNA.",
});

// tiny_prick.dm:164
rt.def("/obj/effect/proc_holder/changeling/sting/extract_dna/proc/can_sting", function* can_sting(f: Frame, user: Value, target: Value) {
	if (!(yield* parent_proc())) return f.dot;
	return user.mind.changeling.can_absorb_dna(user, target);
}, true);

// tiny_prick.dm:168
rt.def("/obj/effect/proc_holder/changeling/sting/extract_dna/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "extraction sting");
	if (!user.mind.changeling.has_dna(target.dna)) {
		yield* user.mind.changeling.add_new_profile(target, user);
	}
	return 1;
}, true);

rt.type(11257, "/obj/effect/proc_holder/changeling/sting/mute", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Does not provide a warning to the victim that they have been stung, until they try to speak and cannot.",
	sting_icon: "sting_mute",
	chemical_cost: 20,
	dna_cost: 2,
	name: "Mute Sting",
	desc: "We silently sting a human, completely silencing them for a short time.",
});

// tiny_prick.dm:182
rt.def("/obj/effect/proc_holder/changeling/sting/mute/proc/sting_action", function sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "mute sting");
	target.silent += 30;
	return 1;
});

rt.type(11258, "/obj/effect/proc_holder/changeling/sting/blind", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "This sting completely blinds a target for a short time.",
	sting_icon: "sting_blind",
	chemical_cost: 25,
	dna_cost: 1,
	name: "Blind Sting",
	desc: "Temporarily blinds the target.",
});

// tiny_prick.dm:195
rt.def("/obj/effect/proc_holder/changeling/sting/blind/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "blind sting");
	to_chat(target, "<span class='danger'>Your eyes burn horrifically!</span>");
	yield* target.become_nearsighted();
	yield* target.blind_eyes(20);
	yield* target.blur_eyes(40);
	return 1;
}, true);

rt.type(11259, "/obj/effect/proc_holder/changeling/sting/LSD", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "We evolve the ability to sting a target with a powerful hallucinogenic chemical. The target does not notice they have been stung, and the effect occurs after 30 to 60 seconds.",
	sting_icon: "sting_lsd",
	chemical_cost: 10,
	dna_cost: 1,
	name: "Hallucination Sting",
	desc: "Causes terror in the target.",
});

// tiny_prick.dm:211
rt.def("/obj/effect/proc_holder/changeling/sting/LSD/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "LSD sting");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/proc_holder/changeling/sting/LSD/proc/hallucination_time"), target)), rand(300, 600));
	return 1;
}, true);

// tiny_prick.dm:217
rt.def("/obj/effect/proc_holder/changeling/sting/LSD/proc/hallucination_time", function hallucination_time(f: Frame, target: Value) {
	if (!target) return f.dot;
	target.hallucination = max(400, target.hallucination);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

rt.type(11260, "/obj/effect/proc_holder/changeling/sting/cryo", "/obj/effect/proc_holder/changeling/sting", {
	helptext: "Does not provide a warning to the victim, though they will likely realize they are suddenly freezing.",
	sting_icon: "sting_cryo",
	chemical_cost: 15,
	dna_cost: 2,
	name: "Cryogenic Sting",
	desc: "We silently sting a human with a cocktail of chemicals that freeze them.",
});

// tiny_prick.dm:228
rt.def("/obj/effect/proc_holder/changeling/sting/cryo/proc/sting_action", function* sting_action(f: Frame, user: Value, target: Value) {
	add_logs(user, target, "stung", "cryo sting");
	if (target.reagents) {
		yield* target.reagents.add_reagent("frostoil", 30);
	}
	return 1;
}, true);
