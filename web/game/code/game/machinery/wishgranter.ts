// Based on /tg/station's code/game/machinery/wishgranter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10857, "/obj/machinery/wish_granter", "/obj/machinery", {
	charges: 1,
	insisting: 0,
	use_power: 0,
	anchored: 1,
	name: "wish granter",
	desc: "You're not so sure about this, anymore...",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "syndbeacon",
	density: 1,
});

// wishgranter.dm:15
rt.def("/obj/machinery/wish_granter/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let hijack: Value = null;
	if (this.charges <= 0) {
		to_chat(user, "The Wish Granter lies silent.");
		return f.dot;
	} else if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		to_chat(user, "You feel a dark stirring inside of the Wish Granter, something you want nothing of. Your instincts are better than any man's.");
		return f.dot;
	} else if (is_special_character(user)) {
		to_chat(user, "Even to a heart as dark as yours, you know nothing good will come of this.  Something instinctual makes you pull away.");
	} else if (!this.insisting) {
		to_chat(user, "Your first touch makes the Wish Granter stir, listening to you.  Are you really sure you want to do this?");
		this.insisting++;
	} else {
		to_chat(user, `You speak.  ${pick("I want the station to disappear", "Humanity is corrupt, mankind must be destroyed", "I want to be rich", "I want to rule the world", "I want immortality.")}.  The Wish Granter answers.`);
		to_chat(user, "Your head pounds for a moment, before your vision clears.  You are the avatar of the Wish Granter, and your power is LIMITLESS!  And it's all yours.  You need to make sure no one can take it from you.  No one can know, first.");
		this.charges--;
		this.insisting = 0;
		yield* user.dna.add_mutation("Hulk");
		yield* user.dna.add_mutation("X Ray Vision");
		yield* user.dna.add_mutation("Cold Resistance");
		yield* user.dna.add_mutation("Telekinesis");
		GLOB.SSticker.mode.traitors += user.mind;
		user.mind.special_role = "Avatar of the Wish Granter";
		(hijack = (yield* new_(T("/datum/objective/hijack")))).owner = user.mind;
		user.mind.objectives += hijack;
		user.mind.announce_objectives();
		to_chat(user, "You have a very bad feeling about this.");
	}
	return f.dot;
}, true);
