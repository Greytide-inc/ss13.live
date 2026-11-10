// Based on /tg/station's code/modules/events/wizard/race.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(348, "/datum/round_event/wizard/race", "/datum/round_event/wizard", {});

// race.dm:11
rt.def("/datum/round_event/wizard/race/proc/start", function* start(f: Frame) {
	let speciestype: Value = null, S: Value = null, H: Value = null;
	let all_the_same: Value = 0;
	let all_species: Value = list();
	for (speciestype of each(typesof(T("/datum/species")) - T("/datum/species"))) {
		if (!(S = (yield* new_(speciestype))).dangerous_existence) {
			all_species += speciestype;
		}
	}
	let new_species: Value = pick(all_species);
	if (prob(50)) {
		all_the_same = 1;
	}
	for (H of each(GLOB.mob_list, T("/mob/living/carbon/human"))) {
		yield* H.set_species(new_species);
		H.real_name = new_species.random_name(H.gender, 1);
		H.dna.unique_enzymes = H.dna.generate_unique_enzymes();
		to_chat(H, "<span class='notice'>You feel somehow... different?</span>");
		if (!all_the_same) {
			new_species = pick(all_species);
		}
	}
	return f.dot;
}, true);
