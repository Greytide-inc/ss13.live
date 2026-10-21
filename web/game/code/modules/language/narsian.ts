// From code/modules/language/narsian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/language/narsie/proc/New  (code/modules/language/narsian.dm:32)
rt.def("/datum/language/narsie/proc/New", function New(f: Frame) {
	let syllable: Value = null, target_syllable: Value = null;
	let $e: any;
	f.vars = () => [syllable, target_syllable, $e];
	syllable = null;
	rt.forList(f, 0, rt.gl("base_syllables"));
	while (($e = rt.next(f, 0)) !== undefined) {
		syllable = $e;
		target_syllable = null;
		rt.forList(f, 1, rt.gl("base_syllables"));
		while (($e = rt.next(f, 1)) !== undefined) {
			target_syllable = $e;
			if (!isEqual(live(syllable), live(target_syllable))) {
				if (rt.gt(add(rt.length(live(syllable)), rt.length(live(target_syllable))), 8)) {
					rt.modSrcVar(f, "syllables", fmt("＀＀", [live(syllable), live(target_syllable)]), add);
				} else {
					if (truthy(rt.op(f, "Prob", [], [80]))) {
						rt.modSrcVar(f, "syllables", fmt("＀'＀", [live(syllable), live(target_syllable)]), add);
					} else {
						if (truthy(rt.op(f, "Prob", [], [25]))) {
							rt.modSrcVar(f, "syllables", fmt("＀-＀", [live(syllable), live(target_syllable)]), add);
						} else {
							rt.modSrcVar(f, "syllables", fmt("＀＀", [live(syllable), live(target_syllable)]), add);
						}
					}
				}
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
