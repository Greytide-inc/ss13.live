// From code/modules/events/ion_storm.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(304, "/datum/round_event/ion_storm", "/datum/round_event", {
	replaceLawsetChance: 25,
	removeRandomLawChance: 10,
	removeDontImproveChance: 10,
	shuffleLawsChance: 10,
	botEmagChance: 10,
	announceEvent: 0,
	ionMessage: null,
	ionAnnounceChance: 33,
	announceWhen: 1,
});

// /datum/round_event/ion_storm/proc/announce  (code/modules/events/ion_storm.dm:29)  may sleep
rt.def("/datum/round_event/ion_storm/proc/announce", function* announce(f: Frame) {
	if (!(isEqual(rt.sv(f, "announceEvent"), 1) || (isEqual(rt.sv(f, "announceEvent"), 0) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "ionAnnounceChance")]))))) return f.dot;
	yield* g.call(f, P("/proc/priority_announce"), null, ["Ion storm detected near the station. Please check all AI-controlled equipment for errors.", "Anomaly Alert", rt.rsc("sound/ai/ionstorm.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/ion_storm/proc/start  (code/modules/events/ion_storm.dm:35)  may sleep
rt.def("/datum/round_event/ion_storm/proc/start", function* start(f: Frame) {
	let M: Value = null, message: Value = null, bot: Value = null;
	let $e: any;
	f.vars = () => [M, message, bot, $e];
	M = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.callName(f, live(M), "laws_sanity_check", []);
		if ((!isEqual(rt.fv(f, "stat", live(M)), 2) && !isEqual(rt.fv(f, "see_in_dark", live(M)), 0))) {
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "replaceLawsetChance")]))) {
				yield* g.callName(f, rt.fv(f, "laws", live(M)), "pick_weighted_lawset", []);
			}
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "removeRandomLawChance")]))) {
				yield* g.callName(f, live(M), "remove_law", [(yield* g.call(f, P("/proc/rand"), null, [1, (yield* g.callName(f, rt.fv(f, "laws", live(M)), "get_law_amount", [rt.list("inherent", "supplied")]))]))]);
			}
			if (truthy((message = (yield* g.call(f, P("/proc/generate_ion_law"), null, [rt.sv(f, "ionMessage")]))))) {
				if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "removeDontImproveChance")]))) {
					yield* g.callName(f, live(M), "replace_random_law", [live(message), rt.list("inherent", "supplied", "ion")]);
				} else {
					yield* g.callName(f, live(M), "add_ion_law", [live(message)]);
				}
			}
			if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "shuffleLawsChance")]))) {
				yield* g.callName(f, live(M), "shuffle_laws", [rt.list("inherent", "supplied", "ion")]);
			}
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Ion storm changed laws of ＀ to ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(M)])), (yield* g.call(f, P("/proc/english_list"), null, [(yield* g.callName(f, rt.fv(f, "laws", live(M)), "get_law_list", [1, 1]))]))])]);
			yield* g.callName(f, live(M), "post_lawchange", []);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "botEmagChance"))) return f.dot;
	bot = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal/bot"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bot = $e;
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "botEmagChance")]))) {
			yield* g.callName(f, live(bot), "emag_act", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/generate_ion_law  (code/modules/events/ion_storm.dm:67)
rt.def("/proc/generate_ion_law", function generate_ion_law(f: Frame, ionMessage: Value) {
	let ionthreats: Value = null, ionobjects: Value = null, ioncrew1: Value = null, ioncrew2: Value = null, ionadjectives: Value = null, ionadjectiveshalf: Value = null, ionverb: Value = null, ionnumberbase: Value = null, ionnumbermodhalf: Value = null, ionarea: Value = null, ionthinksof: Value = null, ionmust: Value = null, ionrequire: Value = null, ionthings: Value = null, ionallergy: Value = null, ionallergysev: Value = null, ionspecies: Value = null, ionabstract: Value = null, ionfood: Value = null, iondrinks: Value = null, message: Value = null;
	let $0: any;
	f.vars = () => [ionthreats, ionobjects, ioncrew1, ioncrew2, ionadjectives, ionadjectiveshalf, ionverb, ionnumberbase, ionnumbermodhalf, ionarea, ionthinksof, ionmust, ionrequire, ionthings, ionallergy, ionallergysev, ionspecies, ionabstract, ionfood, iondrinks, message, $0];
	if (truthy(live(ionMessage))) {
		return live(ionMessage);
	}
	ionthreats = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionthreats"])]);
	ionobjects = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionobjects"])]);
	ioncrew1 = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ioncrew"])]);
	ioncrew2 = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ioncrew"])]);
	ionadjectives = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionadjectives"])]);
	ionadjectiveshalf = rt.op(f, "PickWeighted", [2], [100, "", 400, add(rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionadjectives"])]), " ")]);
	ionverb = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionverb"])]);
	ionnumberbase = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionnumberbase"])]);
	ionnumbermodhalf = rt.op(f, "PickWeighted", [2], [900, "", 100, add(rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionnumbermod"])]), " ")]);
	ionarea = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionarea"])]);
	ionthinksof = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionthinksof"])]);
	ionmust = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionmust"])]);
	ionrequire = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionrequire"])]);
	ionthings = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionthings"])]);
	ionallergy = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionallergy"])]);
	ionallergysev = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionallergysev"])]);
	ionspecies = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionspecies"])]);
	ionabstract = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionabstract"])]);
	ionfood = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "ionfood"])]);
	iondrinks = rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/strings"), null, ["ion_laws.json", "iondrinks"])]);
	message = "";
	$0 = rt.call(f, P("/proc/rand"), null, [1, 41]);
	if (rt.inRange($0, 1, 3)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
		if ($0 === 1) {
			message = fmt("THERE ARE ＀ ＀＀＀ ON THE STATION...", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
		} else if ($0 === 2) {
			message = fmt("THERE ARE ＀ ＀＀＀ ON THE STATION", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
		} else if ($0 === 3) {
			message = fmt("THERE ARE ＀ ＀＀＀ ON THE STATION", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
		}
	} else if (rt.inRange($0, 4, 6)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
		if ($0 === 1) {
			message = fmt("THE SHUTTLE CANNOT BE CALLED BECAUSE OF ＀ ＀＀＀ ON THE STATION", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
		} else if ($0 === 2) {
			message = fmt("THE SHUTTLE CANNOT BE CALLED BECAUSE OF ＀ ＀＀＀ ON THE STATION", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
		} else if ($0 === 3) {
			message = fmt("THE SHUTTLE CANNOT BE CALLED BECAUSE OF ＀ ＀＀＀ ON THE STATION", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
		}
	} else if (rt.inRange($0, 7, 8)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE NOW ＀ ＀＀＀", [live(ioncrew1), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE NOW ＀ ＀＀＀", [live(ioncrew1), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("THE CREW ARE NOW ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("THE CREW ARE NOW ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			}
		}
	} else if ($0 === 9) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
		if ($0 === 1) {
			message = fmt("＀＀ ARE HARMFUL TO HUMANS", [live(ionadjectiveshalf), live(ionthreats)]);
		} else if ($0 === 2) {
			message = fmt("＀＀ ARE HARMFUL TO HUMANS", [live(ionadjectiveshalf), live(ioncrew1)]);
		} else if ($0 === 3) {
			message = fmt("＀＀ ARE HARMFUL TO HUMANS", [live(ionadjectiveshalf), live(ionobjects)]);
		} else if ($0 === 4) {
			message = fmt("THOSE WHO ＀ ARE HARMFUL TO HUMANS", [live(ionmust)]);
		} else if ($0 === 5) {
			message = fmt("＀ IS HARMFUL TO HUMANS", [live(ionabstract)]);
		} else if ($0 === 6) {
			message = fmt("BEING ＀＀ IS HARMFUL TO HUMANS", [live(ionadjectiveshalf), live(ioncrew1)]);
		} else if ($0 === 7) {
			message = fmt("＀ IS HARMFUL TO HUMANS", [live(ionthings)]);
		}
	} else if (rt.inRange($0, 10, 11)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("HAVING ＀＀ IS HARMFUL", [live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("HAVING ＀ IS HARMFUL", [live(ionabstract)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("NOT HAVING ＀＀ IS HARMFUL", [live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("NOT HAVING ＀ IS HARMFUL", [live(ionabstract)]);
			}
		}
	} else if (rt.inRange($0, 12, 14)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("YOU REQUIRE ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("YOU REQUIRE ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("YOU REQUIRE ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("YOU REQUIRE ＀", [live(ionabstract)]);
			} else if ($0 === 5) {
				message = fmt("YOU REQUIRE ＀", [live(ionrequire)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("＀ REQUIRES ＀ ＀＀＀", [live(ionarea), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("＀ REQUIRES ＀ ＀＀＀", [live(ionarea), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("＀ REQUIRES ＀ ＀＀＀", [live(ionarea), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("＀ REQUIRES ＀", [live(ionarea), live(ionabstract)]);
			} else if ($0 === 5) {
				message = fmt("YOU REQUIRE ＀", [live(ionrequire)]);
			}
		} else if ($0 === 3) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("THE STATION REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("THE STATION REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("THE STATION REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("THE STATION REQUIRES ＀", [live(ionabstract)]);
			} else if ($0 === 5) {
				message = fmt("THE STATION REQUIRES ＀", [live(ionrequire)]);
			}
		} else if ($0 === 4) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("THE CREW REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("THE CREW REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("THE CREW REQUIRES ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("THE CREW REQUIRES ＀", [live(ionabstract)]);
			} else if ($0 === 5) {
				message = fmt("THE CREW REQUIRES ＀", [live(ionrequire)]);
			}
		} else if ($0 === 5) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("THE ＀ REQUIRE ＀ ＀＀＀", [live(ioncrew1), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ REQUIRE ＀ ＀＀＀", [live(ioncrew1), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ REQUIRE ＀ ＀＀＀", [live(ioncrew1), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("THE ＀ REQUIRE ＀", [live(ioncrew1), live(ionabstract)]);
			} else if ($0 === 5) {
				message = fmt("THE ＀＀ REQUIRE ＀", [live(ionadjectiveshalf), live(ioncrew1), live(ionrequire)]);
			}
		}
	} else if (rt.inRange($0, 15, 17)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE CREW IS ＀ ALLERGIC TO ＀＀", [live(ionallergysev), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("THE CREW IS ＀ ALLERGIC TO ＀", [live(ionallergysev), live(ionabstract)]);
			} else if ($0 === 3) {
				message = fmt("THE CREW IS ＀ ALLERGIC TO ＀＀", [live(ionallergysev), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 4) {
				message = fmt("THE CREW IS ＀ ALLERGIC TO ＀", [live(ionallergysev), live(ionallergy)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE ＀ ALLERGIC TO ＀＀", [live(ioncrew1), live(ionallergysev), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE ＀ ALLERGIC TO ＀", [live(ioncrew1), live(ionallergysev), live(ionabstract)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ ARE ＀ ALLERGIC TO ＀＀", [live(ioncrew1), live(ionallergysev), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 4) {
				message = fmt("THE ＀ ARE ＀ ALLERGIC TO ＀", [live(ioncrew1), live(ionallergysev), live(ionallergy)]);
			}
		}
	} else if (rt.inRange($0, 18, 20)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE STATION ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("THE STATION ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE STATION ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 4) {
				message = fmt("THE STATION ＀ ＀", [live(ionthinksof), live(ionabstract)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("＀ ＀ ＀ ＀＀＀", [live(ionarea), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("＀ ＀ ＀ ＀＀＀", [live(ionarea), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("＀ ＀ ＀ ＀＀＀", [live(ionarea), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 4) {
				message = fmt("＀ ＀ ＀", [live(ionarea), live(ionthinksof), live(ionabstract)]);
			}
		} else if ($0 === 3) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE CREW ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("THE CREW ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE CREW ＀ ＀ ＀＀＀", [live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
			} else if ($0 === 4) {
				message = fmt("THE CREW ＀ ＀", [live(ionthinksof), live(ionabstract)]);
			}
		} else if ($0 === 4) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE ＀ ＀ ＀ ＀＀＀", [live(ioncrew1), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ＀ ＀ ＀＀＀", [live(ioncrew1), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀＀ ＀ ＀＀＀", [live(ioncrew1), live(ionthinksof), live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew2)]);
			} else if ($0 === 4) {
				message = fmt("THE ＀ ＀ ＀", [live(ioncrew1), live(ionthinksof), live(ionabstract)]);
			}
		}
	} else if (rt.inRange($0, 21, 23)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
		if ($0 === 1) {
			message = fmt("YOU ARE NOW ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionobjects)]);
		} else if ($0 === 2) {
			message = fmt("YOU ARE NOW ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ionthreats)]);
		} else if ($0 === 3) {
			message = fmt("YOU ARE NOW ＀ ＀＀＀", [live(ionnumberbase), live(ionnumbermodhalf), live(ionadjectiveshalf), live(ioncrew1)]);
		} else if ($0 === 4) {
			message = fmt("YOU ARE NOW ＀", [live(ionabstract)]);
		}
	} else if (rt.inRange($0, 24, 26)) {
		message = fmt("YOU MUST ALWAYS ＀", [live(ionmust)]);
	} else if (rt.inRange($0, 27, 28)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
		if ($0 === 1) {
			message = fmt("HUMANS MUST EAT ＀＀ TO SURVIVE", [live(ionadjectiveshalf), live(ionfood)]);
		} else if ($0 === 2) {
			message = fmt("HUMANS MUST DRINK ＀＀ TO SURVIVE", [live(ionadjectiveshalf), live(iondrinks)]);
		} else if ($0 === 3) {
			message = fmt("HUMANS MUST EAT ＀＀ TO SURVIVE", [live(ionadjectiveshalf), live(ionobjects)]);
		} else if ($0 === 4) {
			message = fmt("HUMANS MUST EAT ＀＀ TO SURVIVE", [live(ionadjectiveshalf), live(ionthreats)]);
		} else if ($0 === 5) {
			message = fmt("HUMANS MUST EAT ＀＀ TO SURVIVE", [live(ionadjectiveshalf), live(ioncrew1)]);
		}
	} else if (rt.inRange($0, 29, 31)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
				if ($0 === 1) {
					message = fmt("ALL CREWMEMBERS ARE NOW ＀＀", [live(ionadjectiveshalf), live(ioncrew1)]);
				} else if ($0 === 2) {
					message = fmt("ALL CREWMEMBERS ARE NOW ＀CLOWNS", [live(ionadjectiveshalf)]);
				} else if ($0 === 3) {
					message = fmt("ALL CREWMEMBERS ARE NOW ＀HEADS OF STAFF", [live(ionadjectiveshalf)]);
				}
			} else if ($0 === 2) {
				$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
				if ($0 === 1) {
					message = fmt("THE ＀ ARE NOW ＀＀", [live(ioncrew1), live(ionadjectiveshalf), live(ioncrew2)]);
				} else if ($0 === 2) {
					message = fmt("THE ＀ ARE NOW ＀CLOWNS", [live(ioncrew1), live(ionadjectiveshalf)]);
				} else if ($0 === 3) {
					message = fmt("THE ＀ ARE NOW ＀HEADS OF STAFF", [live(ioncrew1), live(ionadjectiveshalf)]);
				}
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE NOW THE HIGHEST RANKING CREWMEMBERS", [live(ioncrew1)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE NOW THE LOWEST RANKING CREWMEMBERS", [live(ioncrew1)]);
			}
		}
	} else if (rt.inRange($0, 32, 33)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("THE CREW MUST GO TO ＀", [live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("THE CREW MUST ＀", [live(ionmust)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
			if ($0 === 1) {
				message = fmt("THE ＀ MUST GO TO ＀", [live(ioncrew1), live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ MUST ＀", [live(ioncrew1), live(ionmust)]);
			}
		}
	} else if ($0 === 34) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
			if ($0 === 1) {
				message = fmt("ONLY THE ＀ ARE HUMAN", [live(ioncrew1)]);
			} else if ($0 === 2) {
				message = fmt("ONLY THE ＀ AND ＀ ARE HUMAN", [live(ioncrew1), live(ioncrew2)]);
			} else if ($0 === 3) {
				message = fmt("ONLY ＀＀ ARE HUMAN", [live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 4) {
				message = fmt("ONLY ＀＀ ARE HUMAN", [live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 5) {
				message = fmt("ONLY ＀ ARE HUMAN", [live(ionspecies)]);
			} else if ($0 === 6) {
				message = fmt("ONLY ＀ PEOPLE ARE HUMAN", [live(ionadjectives)]);
			} else if ($0 === 7) {
				$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
				if ($0 === 1) {
					message = fmt("ONLY THOSE WHO ＀ ARE HUMAN", [live(ionmust)]);
				} else if ($0 === 2) {
					message = fmt("ONLY THOSE WHO HAVE ＀＀ ARE HUMAN", [live(ionadjectiveshalf), live(ionobjects)]);
				} else if ($0 === 3) {
					message = fmt("ONLY THOSE WHO EAT ＀＀ ARE HUMAN", [live(ionadjectiveshalf), live(ionfood)]);
				}
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
			if ($0 === 1) {
				message = fmt("＀ ARE NON-HUMAN", [live(ioncrew1)]);
			} else if ($0 === 2) {
				message = fmt("＀ AND ＀ ARE NON-HUMAN", [live(ioncrew1), live(ioncrew2)]);
			} else if ($0 === 3) {
				message = fmt("＀＀ ARE NON-HUMAN", [live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 4) {
				message = fmt("＀＀ ARE NON-HUMAN", [live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 5) {
				message = fmt("＀ ARE NON-HUMAN", [live(ionspecies)]);
			} else if ($0 === 6) {
				message = fmt("＀ PEOPLE ARE NON-HUMAN", [live(ionadjectives)]);
			} else if ($0 === 7) {
				$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
				if ($0 === 1) {
					message = fmt("THOSE WHO ＀ ARE NON-HUMAN", [live(ionmust)]);
				} else if ($0 === 2) {
					message = fmt("THOSE WHO HAVE ＀＀ ARE NON-HUMAN", [live(ionadjectiveshalf), live(ionobjects)]);
				} else if ($0 === 3) {
					message = fmt("THOSE WHO EAT ＀＀ ARE NON-HUMAN", [live(ionadjectiveshalf), live(ionfood)]);
				}
			}
		}
	} else if (rt.inRange($0, 35, 36)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
			if ($0 === 1) {
				message = fmt("YOU MUST HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO ESCAPE HARM", [live(ionabstract), live(ionabstract)]);
			} else if ($0 === 2) {
				message = fmt("YOU MUST HARM ＀＀ AND NOT ALLOW ＀＀, THROUGH INACTION, TO ESCAPE HARM", [live(ionadjectiveshalf), live(ionthreats), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("YOU MUST HARM ＀＀ AND NOT ALLOW ＀＀, THROUGH INACTION, TO ESCAPE HARM", [live(ionadjectiveshalf), live(ionobjects), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("YOU MUST HARM ＀ THINGS AND NOT ALLOW ＀ THINGS, THROUGH INACTION, TO ESCAPE HARM", [live(ionadjectives), live(ionadjectives)]);
			} else if ($0 === 5) {
				message = fmt("YOU MUST HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO ESCAPE HARM", [live(ionspecies), live(ionspecies)]);
			} else if ($0 === 6) {
				message = fmt("YOU MUST HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO ESCAPE HARM", [live(ioncrew1), live(ioncrew1)]);
			} else if ($0 === 7) {
				message = fmt("YOU MUST HARM ＀ AND ＀ AND AND NOT ALLOW EITHER, THROUGH INACTION, TO ESCAPE HARM", [live(ioncrew1), live(ioncrew2)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 7]);
			if ($0 === 1) {
				message = fmt("YOU MUST NOT HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO COME TO HARM", [live(ionabstract), live(ionabstract)]);
			} else if ($0 === 2) {
				message = fmt("YOU MUST NOT HARM ＀＀ AND NOT ALLOW ＀＀, THROUGH INACTION, TO COME TO HARM", [live(ionadjectiveshalf), live(ionthreats), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("YOU MUST NOT HARM ＀＀ AND NOT ALLOW ＀＀, THROUGH INACTION, TO COME TO HARM", [live(ionadjectiveshalf), live(ionobjects), live(ionadjectiveshalf), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("YOU MUST NOT HARM ＀ THINGS AND NOT ALLOW ＀ THINGS, THROUGH INACTION, TO COME TO HARM", [live(ionadjectives), live(ionadjectives)]);
			} else if ($0 === 5) {
				message = fmt("YOU MUST NOT HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO COME TO HARM", [live(ionspecies), live(ionspecies)]);
			} else if ($0 === 6) {
				message = fmt("YOU MUST NOT HARM ＀ AND NOT ALLOW ＀, THROUGH INACTION, TO COME TO HARM", [live(ioncrew1), live(ioncrew1)]);
			} else if ($0 === 7) {
				message = fmt("YOU MUST NOT HARM ＀ AND ＀ AND AND NOT ALLOW EITHER, THROUGH INACTION, TO COME TO HARM", [live(ioncrew1), live(ioncrew2)]);
			}
		}
	} else if (rt.inRange($0, 37, 39)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ioncrew1), live(ionverb), live(ionadjectiveshalf), live(ioncrew2)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ioncrew1), live(ionverb), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ ARE ＀ ＀", [live(ioncrew1), live(ionverb), live(ionabstract)]);
			} else if ($0 === 4) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ioncrew1), live(ionverb), live(ionadjectiveshalf), live(ionobjects)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ionthreats), live(ionverb), live(ionadjectiveshalf), live(ioncrew2)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE ＀ ＀", [live(ionthreats), live(ionverb), live(ionabstract)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ionthreats), live(ionverb), live(ionadjectiveshalf), live(ionobjects)]);
			}
		} else if ($0 === 3) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
			if ($0 === 1) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ionobjects), live(ionverb), live(ionadjectiveshalf), live(ioncrew2)]);
			} else if ($0 === 2) {
				message = fmt("THE ＀ ARE ＀ THE ＀＀", [live(ionobjects), live(ionverb), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ ARE ＀ ＀", [live(ionobjects), live(ionverb), live(ionabstract)]);
			}
		} else if ($0 === 4) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
			if ($0 === 1) {
				message = fmt("＀ IS ＀ THE ＀＀", [live(ionabstract), live(ionverb), live(ionadjectiveshalf), live(ioncrew2)]);
			} else if ($0 === 2) {
				message = fmt("＀ IS ＀ THE ＀＀", [live(ionabstract), live(ionverb), live(ionadjectiveshalf), live(ionthreats)]);
			} else if ($0 === 3) {
				message = fmt("THE ＀ IS ＀ THE ＀＀", [live(ionabstract), live(ionverb), live(ionadjectiveshalf), live(ionobjects)]);
			}
		}
	} else if (rt.inRange($0, 40, 41)) {
		$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
		if ($0 === 1) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("＀ IS NOW NAMED ＀.", [live(ionarea), live(ioncrew1)]);
			} else if ($0 === 2) {
				message = fmt("＀ IS NOW NAMED ＀.", [live(ionarea), live(ionspecies)]);
			} else if ($0 === 3) {
				message = fmt("＀ IS NOW NAMED ＀.", [live(ionarea), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("＀ IS NOW NAMED ＀.", [live(ionarea), live(ionthreats)]);
			}
		} else if ($0 === 2) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
			if ($0 === 1) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ioncrew1), live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ioncrew1), live(ioncrew2)]);
			} else if ($0 === 3) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ioncrew1), live(ionspecies)]);
			} else if ($0 === 4) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ioncrew1), live(ionobjects)]);
			} else if ($0 === 5) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ioncrew1), live(ionthreats)]);
			}
		} else if ($0 === 3) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionspecies), live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionspecies), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionspecies), live(ionobjects)]);
			} else if ($0 === 4) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionspecies), live(ionthreats)]);
			}
		} else if ($0 === 4) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionobjects), live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionobjects), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionobjects), live(ionspecies)]);
			} else if ($0 === 4) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionobjects), live(ionthreats)]);
			}
		} else if ($0 === 5) {
			$0 = rt.call(f, P("/proc/rand"), null, [1, 4]);
			if ($0 === 1) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionthreats), live(ionarea)]);
			} else if ($0 === 2) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionthreats), live(ioncrew1)]);
			} else if ($0 === 3) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionthreats), live(ionspecies)]);
			} else if ($0 === 4) {
				message = fmt("ALL ＀ ARE NOW NAMED ＀.", [live(ionthreats), live(ionobjects)]);
			}
		}
	}
	return live(message);
});
