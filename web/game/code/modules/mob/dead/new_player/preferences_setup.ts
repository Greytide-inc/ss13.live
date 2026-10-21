// From code/modules/mob/dead/new_player/preferences_setup.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/preferences/proc/random_character  (code/modules/mob/dead/new_player/preferences_setup.dm:5)  may sleep
rt.def("/datum/preferences/proc/random_character", function* random_character(f: Frame, gender_override: Value) {
	let rando_race: Value = null;
	f.vars = () => [gender_override, rando_race];
	if (truthy(live(gender_override))) {
		rt.setSv(f, "gender", live(gender_override));
	} else {
		rt.setSv(f, "gender", rt.op(f, "PickUnweighted", [2], ["male", "female"]));
	}
	rt.setSv(f, "underwear", (yield* g.call(f, P("/proc/random_underwear"), null, [rt.sv(f, "gender")])));
	rt.setSv(f, "undershirt", (yield* g.call(f, P("/proc/random_undershirt"), null, [rt.sv(f, "gender")])));
	rt.setSv(f, "socks", (yield* g.call(f, P("/proc/random_socks"), null, [])));
	rt.setSv(f, "skin_tone", (yield* g.call(f, P("/proc/random_skin_tone"), null, [])));
	rt.setSv(f, "hair_style", (yield* g.call(f, P("/proc/random_hair_style"), null, [rt.sv(f, "gender")])));
	rt.setSv(f, "facial_hair_style", (yield* g.call(f, P("/proc/random_facial_hair_style"), null, [rt.sv(f, "gender")])));
	rt.setSv(f, "hair_color", (yield* g.call(f, P("/proc/random_short_color"), null, [])));
	rt.setSv(f, "facial_hair_color", rt.sv(f, "hair_color"));
	rt.setSv(f, "eye_color", (yield* g.call(f, P("/proc/random_eye_color"), null, [])));
	if (!truthy(rt.sv(f, "pref_species"))) {
		rando_race = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "roundstart_races", rt.gl("config"))]);
		rt.setSv(f, "pref_species", (yield* g.new_(f, live(rando_race), [])));
	}
	rt.setSv(f, "features", (yield* g.call(f, P("/proc/random_features"), null, [])));
	rt.setSv(f, "age", (yield* g.call(f, P("/proc/rand"), null, [17, 85])));
	return f.dot;
}, true);

// /datum/preferences/proc/update_preview_icon  (code/modules/mob/dead/new_player/preferences_setup.dm:26)  may sleep
rt.def("/datum/preferences/proc/update_preview_icon", function* update_preview_icon(f: Frame) {
	let mannequin: Value = null, previewJob: Value = null, highRankFlag: Value = null, highDeptFlag: Value = null, job: Value = null, stamp: Value = null;
	let $0: any, $e: any;
	f.vars = () => [mannequin, previewJob, highRankFlag, highDeptFlag, job, stamp, $0, $e];
	if (truthy(rt.sv(f, "job_engsec_high"))) {
		$0 = rt.sv(f, "job_engsec_high");
		if ($0 === 512) {
			rt.setSv(f, "preview_icon", (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/mob/ai.dmi"), "AI", 2])));
			yield* g.callName(f, rt.sv(f, "preview_icon"), "Scale", [64, 64]);
			return live(f.dot);
		} else if ($0 === 1024) {
			rt.setSv(f, "preview_icon", (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/mob/robots.dmi"), "robot", 2])));
			yield* g.callName(f, rt.sv(f, "preview_icon"), "Scale", [64, 64]);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "copy_to", (mannequin = (yield* g.new_(f, T("/mob/living/carbon/human/dummy"), []))));
	previewJob = null;
	highRankFlag = rt.bitOr(rt.bitOr(rt.sv(f, "job_civilian_high"), rt.sv(f, "job_medsci_high")), rt.sv(f, "job_engsec_high"));
	if (truthy(rt.bitAnd(rt.sv(f, "job_civilian_low"), 8192))) {
		previewJob = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", ["Assistant"]));
	} else {
		if (truthy(live(highRankFlag))) {
			highDeptFlag = null;
			if (truthy(rt.sv(f, "job_civilian_high"))) {
				highDeptFlag = 4;
			} else {
				if (truthy(rt.sv(f, "job_medsci_high"))) {
					highDeptFlag = 2;
				} else {
					if (truthy(rt.sv(f, "job_engsec_high"))) {
						highDeptFlag = 1;
					}
				}
			}
			job = null;
			rt.forList(f, 0, rt.fv(f, "occupations", rt.gl("SSjob")), T("/datum/job"));
			while (($e = rt.next(f, 0)) !== undefined) {
				job = $e;
				if ((isEqual(rt.fv(f, "flag", live(job)), live(highRankFlag)) && isEqual(rt.fv(f, "department_flag", live(job)), live(highDeptFlag)))) {
					previewJob = live(job);
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(live(previewJob))) {
		rt.setFv(f, "job", live(mannequin), rt.fv(f, "title", live(previewJob)));
		yield* g.callName(f, live(previewJob), "equip", [live(mannequin), 1]);
	}
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	rt.setSv(f, "preview_icon", (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/effects/effects.dmi"), "nothing"])));
	yield* g.callName(f, rt.sv(f, "preview_icon"), "Scale", [80, 48]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, live(mannequin), "setDir", [1]);
	stamp = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(mannequin)]));
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "preview_icon"), "Blend", [live(stamp), 3, 25, 17]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, live(mannequin), "setDir", [8]);
	stamp = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(mannequin)]));
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "preview_icon"), "Blend", [live(stamp), 3, 1, 9]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, live(mannequin), "setDir", [2]);
	stamp = (yield* g.call(f, P("/proc/getFlatIcon"), null, [live(mannequin)]));
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "preview_icon"), "Blend", [live(stamp), 3, 49, 1]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.callName(f, rt.sv(f, "preview_icon"), "Scale", [multiply((yield* g.callName(f, rt.sv(f, "preview_icon"), "Width", [])), 2), multiply((yield* g.callName(f, rt.sv(f, "preview_icon"), "Height", [])), 2)]);
	if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
		yield* g.call(f, P("/proc/stoplag"), null, []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(mannequin)]);
	return f.dot;
}, true);
