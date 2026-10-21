// From code/modules/events/wizard/race.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(348, "/datum/round_event/wizard/race", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/race/proc/start  (code/modules/events/wizard/race.dm:11)  may sleep
rt.def("/datum/round_event/wizard/race/proc/start", function* start(f: Frame) {
	let all_the_same: Value = null, all_species: Value = null, speciestype: Value = null, S: Value = null, new_species: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [all_the_same, all_species, speciestype, S, new_species, H, $e];
	all_the_same = 0;
	all_species = rt.list();
	speciestype = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
	while (($e = rt.next(f, 0)) !== undefined) {
		speciestype = $e;
		if (!truthy(rt.gv(f, "dangerous_existence", (S = (yield* g.new_(f, live(speciestype), [])))))) {
			all_species = rt.modify(live(all_species), live(speciestype), add);
		}
	}
	rt.endFor(f, 0);
	new_species = rt.op(f, "PickUnweighted", [1], [live(all_species)]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		all_the_same = 1;
	}
	H = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, live(H), "set_species", [live(new_species)]);
		rt.setFv(f, "real_name", live(H), (yield* g.callName(f, live(new_species), "random_name", [rt.fv(f, "gender", live(H)), 1])));
		rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(H)), (yield* g.callName(f, rt.fv(f, "dna", live(H)), "generate_unique_enzymes", [])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel somehow... different?</span>"]);
		if (!truthy(live(all_the_same))) {
			new_species = rt.op(f, "PickUnweighted", [1], [live(all_species)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
