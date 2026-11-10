// Based on /tg/station's code/modules/mob/dead/new_player/preferences_setup.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// preferences_setup.dm:5
rt.def("/datum/preferences/proc/random_character", function* random_character(f: Frame, gender_override: Value) {
	let rando_race: Value = null;
	if (gender_override) {
		this.gender = gender_override;
	} else {
		this.gender = pick("male", "female");
	}
	this.underwear = (yield* random_underwear(this.gender));
	this.undershirt = (yield* random_undershirt(this.gender));
	this.socks = (yield* random_socks());
	this.skin_tone = random_skin_tone();
	this.hair_style = random_hair_style(this.gender);
	this.facial_hair_style = random_facial_hair_style(this.gender);
	this.hair_color = random_short_color();
	this.facial_hair_color = this.hair_color;
	this.eye_color = random_eye_color();
	if (!this.pref_species) {
		rando_race = pick(GLOB.config.roundstart_races);
		this.pref_species = (yield* new_(rando_race));
	}
	this.features = (yield* random_features());
	this.age = rand(17, 85);
	return f.dot;
}, true);

// preferences_setup.dm:26
rt.def("/datum/preferences/proc/update_preview_icon", function* update_preview_icon(f: Frame) {
	let mannequin: Value = null, previewJob: Value = null, highDeptFlag: Value = null, job: Value = null;
	let $e: any;
	if (this.job_engsec_high) {
		if (this.job_engsec_high === 512) {
			this.preview_icon = icon(rt.rsc("icons/mob/ai.dmi"), "AI", 2);
			this.preview_icon.Scale(64, 64);
			return f.dot;
		} else if (this.job_engsec_high === 1024) {
			this.preview_icon = icon(rt.rsc("icons/mob/robots.dmi"), "robot", 2);
			this.preview_icon.Scale(64, 64);
			return f.dot;
		}
	}
	yield* this.copy_to((mannequin = (yield* new_(T("/mob/living/carbon/human/dummy")))));
	let highRankFlag: Value = rt.bitOr(rt.bitOr(this.job_civilian_high, this.job_medsci_high), this.job_engsec_high);
	if (rt.bitAnd(this.job_civilian_low, 8192)) {
		previewJob = (yield* GLOB.SSjob.GetJob("Assistant"));
	} else if (highRankFlag) {
		if (this.job_civilian_high) {
			highDeptFlag = 4;
		} else if (this.job_medsci_high) {
			highDeptFlag = 2;
		} else if (this.job_engsec_high) {
			highDeptFlag = 1;
		}
		for (job of each(GLOB.SSjob.occupations, T("/datum/job"))) {
			if (job.flag == highRankFlag && job.department_flag == highDeptFlag) {
				previewJob = job;
				break;
			}
		}
	}
	if (previewJob) {
		mannequin.job = previewJob.title;
		yield* previewJob.equip(mannequin, 1);
	}
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.preview_icon = icon(rt.rsc("icons/effects/effects.dmi"), "nothing");
	this.preview_icon.Scale(80, 48);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* mannequin.setDir(1);
	let stamp: Value = getFlatIcon(mannequin);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.preview_icon.Blend(stamp, 3, 25, 17);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* mannequin.setDir(8);
	stamp = getFlatIcon(mannequin);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.preview_icon.Blend(stamp, 3, 1, 9);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* mannequin.setDir(2);
	stamp = getFlatIcon(mannequin);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.preview_icon.Blend(stamp, 3, 49, 1);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	this.preview_icon.Scale(this.preview_icon.Width() * 2, this.preview_icon.Height() * 2);
	if (rt.tickUsage(f) > GLOB.current_ticklimit) {
		yield* stoplag();
	}
	yield* qdel(mannequin);
	return f.dot;
}, true);
