// Based on /tg/station's code/modules/events/disease_outbreak.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(297, "/datum/round_event/disease_outbreak", "/datum/round_event", {
	virus_type: null,
	announceWhen: 15,
});

// disease_outbreak.dm:15
rt.def("/datum/round_event/disease_outbreak/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Confirmed outbreak of level 7 viral biohazard aboard ${station_name()}. All personnel must contain the outbreak.`, "Biohazard Alert", rt.rsc("sound/ai/outbreak7.ogg"));
	return f.dot;
}, true);

// disease_outbreak.dm:18
rt.def("/datum/round_event/disease_outbreak/proc/setup", function setup(f: Frame) {
	this.announceWhen = rand(15, 30);
	return f.dot;
});

// disease_outbreak.dm:21
rt.def("/datum/round_event/disease_outbreak/proc/start", function* start(f: Frame) {
	let H: Value = null, _T: Value = null, foundAlready: Value = null, D: Value = null, DS: Value = null;
	let $e: any;
	if (!this.virus_type) {
		this.virus_type = pick(T("/datum/disease/dnaspread"), T("/datum/disease/advance/flu"), T("/datum/disease/advance/cold"), T("/datum/disease/brainrot"), T("/datum/disease/magnitis"));
	}
	for (H of each(shuffle(GLOB.living_mob_list), T("/mob/living/carbon/human"))) {
		if (!(_T = rt.getStep(f, H, 0))) {
			continue;
		}
		if (_T.z != ZLEVEL_STATION) {
			continue;
		}
		foundAlready = 0;
		D = null;
		rt.forList(f, 1, H.viruses, T("/datum/disease"));
		if (($e = rt.next(f, 1)) !== undefined) {
			D = $e;
			foundAlready = 1;
		}
		rt.endFor(f, 1);
		if (H.stat == 2 || foundAlready) {
			continue;
		}
		D = null;
		if (this.virus_type == T("/datum/disease/dnaspread")) {
			if (!H.dna || rt.bitAnd(H.disabilities, 1)) {
				continue;
			}
			D = (yield* new_(this.virus_type));
			rt.setAt((DS = D).strain_data, "name", H.real_name);
			rt.setAt(DS.strain_data, "UI", H.dna.uni_identity);
			rt.setAt(DS.strain_data, "SE", H.dna.struc_enzymes);
		} else {
			D = (yield* new_(this.virus_type));
		}
		D.carrier = 1;
		yield* H.AddDisease(D);
		break;
	}
	return f.dot;
}, true);
