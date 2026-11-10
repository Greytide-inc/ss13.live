// Based on /tg/station's code/modules/events/electrical_storm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(300, "/datum/round_event/electrical_storm", "/datum/round_event", {
	lightsoutAmount: 1,
	lightsoutRange: 25,
	announceWhen: 1,
});

// electrical_storm.dm:15
rt.def("/datum/round_event/electrical_storm/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("An electrical storm has been detected in your area, please repair potential electronic overloads.", "Electrical Storm Alert");
	return f.dot;
}, true);

// electrical_storm.dm:19
rt.def("/datum/round_event/electrical_storm/proc/start", function* start(f: Frame) {
	let possibleEpicentres: Value = null, newEpicentre: Value = null, epicentre: Value = null, apc: Value = null;
	let epicentreList: Value = list();
	let i: Value = 1;
	while (i <= this.lightsoutAmount) {
		possibleEpicentres = list();
		newEpicentre = null;
		for (newEpicentre of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (newEpicentre.name == "lightsout" && !rt.isIn(f, newEpicentre, epicentreList)) {
				possibleEpicentres += newEpicentre;
			}
		}
		if (rt.len(f, possibleEpicentres)) {
			epicentreList += pick(possibleEpicentres);
		} else {
			break;
		}
		i++;
	}
	if (!rt.len(f, epicentreList)) {
		return f.dot;
	}
	for (epicentre of each(epicentreList, T("/obj/effect/landmark"))) {
		apc = null;
		for (apc of each(urange(this.lightsoutRange, epicentre), T("/obj/machinery/power/apc"))) {
			yield* apc.overload_lighting();
		}
	}
	return f.dot;
}, true);
