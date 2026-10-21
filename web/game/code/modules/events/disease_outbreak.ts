// From code/modules/events/disease_outbreak.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(297, "/datum/round_event/disease_outbreak", "/datum/round_event", {
	virus_type: null,
	announceWhen: 15,
});

// /datum/round_event/disease_outbreak/proc/announce  (code/modules/events/disease_outbreak.dm:15)  may sleep
rt.def("/datum/round_event/disease_outbreak/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Confirmed outbreak of level 7 viral biohazard aboard ＀. All personnel must contain the outbreak.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Biohazard Alert", rt.rsc("sound/ai/outbreak7.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/disease_outbreak/proc/setup  (code/modules/events/disease_outbreak.dm:18)
rt.def("/datum/round_event/disease_outbreak/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "announceWhen", rt.call(f, P("/proc/rand"), null, [15, 30]));
	return f.dot;
});

// /datum/round_event/disease_outbreak/proc/start  (code/modules/events/disease_outbreak.dm:21)  may sleep
rt.def("/datum/round_event/disease_outbreak/proc/start", function* start(f: Frame) {
	let H: Value = null, _T: Value = null, foundAlready: Value = null, D: Value = null, DS: Value = null;
	let $e: any;
	f.vars = () => [H, _T, foundAlready, D, DS, $e];
	if (!truthy(rt.sv(f, "virus_type"))) {
		rt.setSv(f, "virus_type", rt.op(f, "PickUnweighted", [5], [T("/datum/disease/dnaspread"), T("/datum/disease/advance/flu"), T("/datum/disease/advance/cold"), T("/datum/disease/brainrot"), T("/datum/disease/magnitis")]));
	}
	H = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/shuffle"), null, [rt.gl("living_mob_list")])), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy((_T = rt.getStep(f, live(H), 0)))) {
			continue;
		}
		if (!isEqual(rt.fv(f, "z", live(_T)), 2)) {
			continue;
		}
		foundAlready = 0;
		D = null;
		rt.forList(f, 1, rt.fv(f, "viruses", live(H)), T("/datum/disease"));
		if (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			foundAlready = 1;
		}
		rt.endFor(f, 1);
		if ((isEqual(rt.fv(f, "stat", live(H)), 2) || truthy(live(foundAlready)))) {
			continue;
		}
		D = null;
		if (isEqual(rt.sv(f, "virus_type"), T("/datum/disease/dnaspread"))) {
			if ((!truthy(rt.fv(f, "dna", live(H))) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 1)))) {
				continue;
			}
			D = (yield* g.new_(f, rt.sv(f, "virus_type"), []));
			rt.setAt(rt.gv(f, "strain_data", (DS = live(D))), "name", rt.fv(f, "real_name", live(H)));
			rt.setAt(rt.fv(f, "strain_data", live(DS)), "UI", rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H))));
			rt.setAt(rt.fv(f, "strain_data", live(DS)), "SE", rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(H))));
		} else {
			D = (yield* g.new_(f, rt.sv(f, "virus_type"), []));
		}
		rt.setFv(f, "carrier", live(D), 1);
		yield* g.callName(f, live(H), "AddDisease", [live(D)]);
		break;
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
