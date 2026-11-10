// Based on /tg/station's code/modules/language/narsian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(2783, "/datum/language/narsie", "/datum/language", {
	name: "Nar-Sian",
	desc: "The ancient, blood-soaked, impossibly complex language of Nar-Sian cultists.",
	speech_verb: "intones",
	ask_verb: "inquires",
	exclaim_verb: "invokes",
	key: "n",
	sentence_chance: 8,
	space_chance: 95,
	syllables: null,
	icon_state: "narsie",
	default_priority: 10,
}, { global: { base_syllables: 669 } });

// narsian.dm:32
rt.def("/datum/language/narsie/proc/New", function New(f: Frame) {
	let syllable: Value = null, target_syllable: Value = null;
	for (syllable of each(GLOB.base_syllables)) {
		target_syllable = null;
		for (target_syllable of each(GLOB.base_syllables)) {
			if (syllable != target_syllable) {
				if (rt.length(syllable) + rt.length(target_syllable) > 8) {
					this.syllables += `${syllable}${target_syllable}`;
				} else if (prob(80)) {
					this.syllables += `${syllable}'${target_syllable}`;
				} else if (prob(25)) {
					this.syllables += `${syllable}-${target_syllable}`;
				} else {
					this.syllables += `${syllable}${target_syllable}`;
				}
			}
		}
	}
	parent_proc();
	return f.dot;
});
