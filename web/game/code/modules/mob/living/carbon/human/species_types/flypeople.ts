// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/flypeople.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4079, "/datum/species/fly", "/datum/species", {
	name: "Flyperson",
	id: "fly",
	say_mod: "buzzes",
	mutanttongue: rt.typePath("/obj/item/organ/tongue/fly"),
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly"),
});

// flypeople.dm:9
rt.def("/datum/species/fly/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id != "pestkiller") return f.dot;
	yield* H.adjustToxLoss(3);
	yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
	return 1;
}, true);

// flypeople.dm:16
rt.def("/datum/species/fly/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	let nutri_check: Value = null, pos: Value = null;
	if (rt.istype(chem, T("/datum/reagent/consumable"))) {
		if ((nutri_check = chem).nutriment_factor > 0) {
			pos = rt.getStep(f, H, 0);
			yield* H.vomit(0, 0, 0, 2, 1);
			playsound(pos, rt.rsc("sound/effects/splat.ogg"), 50, 1);
			H.visible_message(`<span class='danger'>${H} vomits on the floor!</span>`, "<span class='userdanger'>You throw up on the floor!</span>");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flypeople.dm:27
rt.def("/datum/species/fly/proc/check_weakness", function check_weakness(f: Frame, weapon: Value, attacker: Value) {
	if (rt.istype(weapon, T("/obj/item/weapon/melee/flyswatter"))) {
		return 29;
	}
	return 0;
});
