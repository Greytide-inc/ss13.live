// Based on /tg/station's code/modules/events/wizard/shuffle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(351, "/datum/round_event/wizard/shuffleloc", "/datum/round_event/wizard", {});

// shuffle.dm:12
rt.def("/datum/round_event/wizard/shuffleloc/proc/start", function* start(f: Frame) {
	let H: Value = null, smoke: Value = null;
	let moblocs: Value = list();
	let mobs: Value = list();
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (H.z != ZLEVEL_STATION) {
			continue;
		}
		moblocs += H.loc;
		mobs += H;
	}
	if (!mobs) {
		return f.dot;
	}
	shuffle_inplace(moblocs);
	shuffle_inplace(mobs);
	H = null;
	for (H of each(mobs, T("/mob/living/carbon/human"))) {
		if (!moblocs) {
			break;
		}
		yield* do_teleport(H, rt.index(moblocs, rt.len(f, moblocs)));
		moblocs.len -= 1;
	}
	H = null;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, H.loc);
		yield* smoke.start();
	}
	return f.dot;
}, true);

rt.type(352, "/datum/round_event/wizard/shufflenames", "/datum/round_event/wizard", {});

// shuffle.dm:48
rt.def("/datum/round_event/wizard/shufflenames/proc/start", function* start(f: Frame) {
	let H: Value = null, smoke: Value = null;
	let mobnames: Value = list();
	let mobs: Value = list();
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		mobnames += H.real_name;
		mobs += H;
	}
	if (!mobs) {
		return f.dot;
	}
	shuffle_inplace(mobnames);
	shuffle_inplace(mobs);
	H = null;
	for (H of each(mobs, T("/mob/living/carbon/human"))) {
		if (!mobnames) {
			break;
		}
		H.real_name = rt.index(mobnames, rt.len(f, mobnames));
		mobnames.len -= 1;
	}
	H = null;
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, H.loc);
		yield* smoke.start();
	}
	return f.dot;
}, true);

rt.type(353, "/datum/round_event/wizard/shuffleminds", "/datum/round_event/wizard", {});

// shuffle.dm:82
rt.def("/datum/round_event/wizard/shuffleminds/proc/start", function* start(f: Frame) {
	let H: Value = null, H_2: Value = null, smoke: Value = null;
	let mobs: Value = list();
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (H.stat || !H.mind || rt.isIn(f, H.mind, GLOB.SSticker.mode.wizards) || rt.isIn(f, H.mind, GLOB.SSticker.mode.apprentices)) {
			continue;
		}
		mobs += H;
	}
	if (!mobs) {
		return f.dot;
	}
	shuffle_inplace(mobs);
	let swapper: Value = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/mind_transfer")));
	while (rt.len(f, mobs) > 1) {
		mobs -= (H_2 = pick(mobs));
		yield* swapper.cast(list(H_2), rt.index(mobs, rt.len(f, mobs)), 1);
		mobs -= rt.index(mobs, rt.len(f, mobs));
	}
	H_2 = null;
	for (H_2 of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(0, H_2.loc);
		yield* smoke.start();
	}
	return f.dot;
}, true);
