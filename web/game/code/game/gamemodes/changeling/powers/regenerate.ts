// Based on /tg/station's code/game/gamemodes/changeling/powers/regenerate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11247, "/obj/effect/proc_holder/changeling/regenerate", "/obj/effect/proc_holder/changeling", {
	helptext: "Will alert nearby crew if any external limbs are regenerated. Can be used while unconscious.",
	chemical_cost: 10,
	dna_cost: 0,
	req_stat: 1,
	always_keep: 1,
	name: "Regenerate",
	desc: "Allows us to regrow and restore missing external limbs, and vital internal organs, as well as removing shrapnel and restoring blood volume.",
});

// regenerate.dm:14
rt.def("/obj/effect/proc_holder/changeling/regenerate/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let C: Value = null, missing: Value = null, B: Value = null, H: Value = null;
	to_chat(user, "<span class='notice'>You feel an itching, both inside and outside as your tissues knit and reknit.</span>");
	if (rt.istype(user, T("/mob/living/carbon"))) {
		C = user;
		if (rt.len(f, (missing = C.get_missing_limbs()))) {
			playsound(user, rt.rsc("sound/magic/demon_consume.ogg"), 50, 1);
			C.visible_message(`<span class='warning'>${user}'s missing limbs reform, making a loud, grotesque sound!</span>`, "<span class='userdanger'>Your limbs regrow, making a loud, crunchy sound and giving you great pain!</span>", "<span class='italics'>You hear organic matter ripping and tearing!</span>");
			yield* C.emote("scream");
			yield* C.regenerate_limbs(1);
		}
		yield* C.regenerate_organs();
		if (!user.getorganslot("brain")) {
			yield* (B = (yield* new_(T("/obj/item/organ/brain/changeling_brain")))).Insert(C);
		}
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		(H = user).restore_blood();
		yield* H.remove_all_embedded_objects();
	}
	return 1;
}, true);
