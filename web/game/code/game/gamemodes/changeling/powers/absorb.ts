// Based on /tg/station's code/game/gamemodes/changeling/powers/absorb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11223, "/obj/effect/proc_holder/changeling/absorbDNA", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 0,
	dna_cost: 0,
	req_human: 1,
	name: "Absorb DNA",
	desc: "Absorb the DNA of our victim.",
});

// absorb.dm:9
rt.def("/obj/effect/proc_holder/changeling/absorbDNA/proc/can_sting", function can_sting(f: Frame, user: Value) {
	let changeling: Value = null;
	if (!parent_proc()) {
		return f.dot;
	}
	if ((changeling = user.mind.changeling).isabsorbing) {
		to_chat(user, "<span class='warning'>We are already absorbing!</span>");
		return f.dot;
	}
	if (!user.pulling || !rt.istype(user.pulling, T("/mob/living/carbon"))) {
		to_chat(user, "<span class='warning'>We must be grabbing a creature to absorb them!</span>");
		return f.dot;
	}
	if (user.grab_state <= 2) {
		to_chat(user, "<span class='warning'>We must have a tighter grip to absorb this creature!</span>");
		return f.dot;
	}
	let target: Value = user.pulling;
	return changeling.can_absorb_dna(user, target);
}, false);

// absorb.dm:30
rt.def("/obj/effect/proc_holder/changeling/absorbDNA/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let i: Value = null, recent_speech: Value = null, say_log: Value = null, spoken_memory: Value = null;
	let $e: any;
	let changeling: Value = user.mind.changeling;
	let target: Value = user.pulling;
	changeling.isabsorbing = 1;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (i === 1) {
			to_chat(user, "<span class='notice'>This creature is compatible. We must hold still...</span>");
		} else if (i === 2) {
			user.visible_message(`<span class='warning'>${user} extends a proboscis!</span>`, "<span class='notice'>We extend a proboscis.</span>");
		} else if (i === 3) {
			user.visible_message(`<span class='danger'>${user} stabs ${target} with the proboscis!</span>`, `<span class='notice'>We stab ${target} with the proboscis.</span>`);
			to_chat(target, "<span class='userdanger'>You feel a sharp stabbing pain!</span>");
			yield* target.take_overall_damage(40);
		}
		if (!(yield* do_mob(user, target, 150))) {
			to_chat(user, `<span class='warning'>Our absorption of ${target} has been interrupted!</span>`);
			changeling.isabsorbing = 0;
			return f.dot;
		}
	}
	rt.endFor(f, 0);
	user.visible_message(`<span class='danger'>${user} sucks the fluids from ${target}!</span>`, `<span class='notice'>We have absorbed ${target}.</span>`);
	to_chat(target, "<span class='userdanger'>You are absorbed by the changeling!</span>");
	if (!changeling.has_dna(target.dna)) {
		yield* changeling.add_new_profile(target, user);
	}
	if (user.nutrition < NUTRITION_LEVEL_WELL_FED) {
		user.nutrition = min(user.nutrition + target.nutrition, NUTRITION_LEVEL_WELL_FED);
	}
	if (target.mind) {
		target.mind.show_memory(user, 0);
		recent_speech = list();
		if (rt.length((say_log = rt.index(target.logging, "Say log"))) > LING_ABSORB_RECENT_SPEECH) {
			recent_speech = (yield* say_log.Copy(rt.len(f, say_log) - LING_ABSORB_RECENT_SPEECH + 1, 0));
		} else {
			for (spoken_memory of each(say_log)) {
				if (rt.len(f, recent_speech) >= LING_ABSORB_RECENT_SPEECH) {
					break;
				}
				rt.setAt(recent_speech, spoken_memory, rt.index(say_log, spoken_memory));
			}
		}
		if (rt.len(f, recent_speech)) {
			user.mind.store_memory(`<B>Some of ${target}'s speech patterns, we should study these to better impersonate them!</B>`);
			to_chat(user, `<span class='boldnotice'>Some of ${target}'s speech patterns, we should study these to better impersonate them!</span>`);
			spoken_memory = null;
			for (spoken_memory of each(recent_speech)) {
				user.mind.store_memory(`"${rt.index(recent_speech, spoken_memory)}"`);
				to_chat(user, `<span class='notice'>"${rt.index(recent_speech, spoken_memory)}"</span>`);
			}
			user.mind.store_memory(`<B>We have no more knowledge of ${target}'s speech patterns.</B>`);
			to_chat(user, `<span class='boldnotice'>We have no more knowledge of ${target}'s speech patterns.</span>`);
		}
		if (target.mind.changeling) {
			changeling.chem_charges += min(target.mind.changeling.chem_charges, changeling.chem_storage);
			changeling.absorbedcount += target.mind.changeling.absorbedcount;
			target.mind.changeling.stored_profiles.len = 1;
			target.mind.changeling.absorbedcount = 0;
		}
	}
	changeling.chem_charges = min(changeling.chem_charges + 10, changeling.chem_storage);
	changeling.isabsorbing = 0;
	changeling.canrespec = 1;
	yield* target.death(0);
	yield* target.Drain();
	return 1;
}, true);
