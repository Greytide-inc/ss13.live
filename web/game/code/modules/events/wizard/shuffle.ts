// From code/modules/events/wizard/shuffle.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(351, "/datum/round_event/wizard/shuffleloc", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/shuffleloc/proc/start  (code/modules/events/wizard/shuffle.dm:12)  may sleep
rt.def("/datum/round_event/wizard/shuffleloc/proc/start", function* start(f: Frame) {
	let moblocs: Value = null, mobs: Value = null, H: Value = null, smoke: Value = null;
	let $e: any;
	f.vars = () => [moblocs, mobs, H, smoke, $e];
	moblocs = rt.list();
	mobs = rt.list();
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!isEqual(rt.fv(f, "z", live(H)), 2)) {
			continue;
		}
		moblocs = rt.modify(live(moblocs), rt.fv(f, "loc", live(H)), add);
		mobs = rt.modify(live(mobs), live(H), add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(mobs))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(moblocs)]);
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(mobs)]);
	H = null;
	rt.forList(f, 0, live(mobs), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy(live(moblocs))) {
			break;
		}
		yield* g.call(f, P("/proc/do_teleport"), null, [live(H), rt.index(live(moblocs), rt.len(f, live(moblocs)))]);
		(rt.modField(f, live(moblocs), "len", 1, subtract));
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.fv(f, "loc", live(H))]);
		yield* g.callName(f, live(smoke), "start", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(352, "/datum/round_event/wizard/shufflenames", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/shufflenames/proc/start  (code/modules/events/wizard/shuffle.dm:48)  may sleep
rt.def("/datum/round_event/wizard/shufflenames/proc/start", function* start(f: Frame) {
	let mobnames: Value = null, mobs: Value = null, H: Value = null, smoke: Value = null;
	let $e: any;
	f.vars = () => [mobnames, mobs, H, smoke, $e];
	mobnames = rt.list();
	mobs = rt.list();
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		mobnames = rt.modify(live(mobnames), rt.fv(f, "real_name", live(H)), add);
		mobs = rt.modify(live(mobs), live(H), add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(mobs))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(mobnames)]);
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(mobs)]);
	H = null;
	rt.forList(f, 0, live(mobs), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (!truthy(live(mobnames))) {
			break;
		}
		rt.setFv(f, "real_name", live(H), rt.index(live(mobnames), rt.len(f, live(mobnames))));
		(rt.modField(f, live(mobnames), "len", 1, subtract));
	}
	rt.endFor(f, 0);
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.fv(f, "loc", live(H))]);
		yield* g.callName(f, live(smoke), "start", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(353, "/datum/round_event/wizard/shuffleminds", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/shuffleminds/proc/start  (code/modules/events/wizard/shuffle.dm:82)  may sleep
rt.def("/datum/round_event/wizard/shuffleminds/proc/start", function* start(f: Frame) {
	let mobs: Value = null, H: Value = null, swapper: Value = null, H_2: Value = null, smoke: Value = null;
	let $e: any;
	f.vars = () => [mobs, H, swapper, H_2, smoke, $e];
	mobs = rt.list();
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((((truthy(rt.fv(f, "stat", live(H))) || !truthy(rt.fv(f, "mind", live(H)))) || truthy((rt.isIn(f, rt.fv(f, "mind", live(H)), rt.gv(f, "wizards", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) || truthy((rt.isIn(f, rt.fv(f, "mind", live(H)), rt.gv(f, "apprentices", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
			continue;
		}
		mobs = rt.modify(live(mobs), live(H), add);
	}
	rt.endFor(f, 0);
	if (!truthy(live(mobs))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [live(mobs)]);
	swapper = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/mind_transfer"), []));
	while (rt.gt(rt.len(f, live(mobs)), 1)) {
		(mobs = rt.modify(live(mobs), (H_2 = rt.op(f, "PickUnweighted", [1], [live(mobs)])), subtract));
		yield* g.callName(f, live(swapper), "cast", [rt.list(live(H_2)), rt.index(live(mobs), rt.len(f, live(mobs))), 1]);
		(mobs = rt.modify(live(mobs), rt.index(live(mobs), rt.len(f, live(mobs))), subtract));
	}
	H_2 = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H_2 = $e;
		yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.fv(f, "loc", live(H_2))]);
		yield* g.callName(f, live(smoke), "start", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
