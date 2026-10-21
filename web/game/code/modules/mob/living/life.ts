// From code/modules/mob/living/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/Life  (code/modules/mob/living/life.dm:6)  may sleep
rt.def("/mob/living/proc/Life", function* Life(f: Frame, seconds: Value, times_fired: Value) {
	let E: Value = null, environment: Value = null;
	let $e: any;
	f.vars = () => [seconds, times_fired, E, environment, $e];
	if (truthy(rt.sv(f, "digitalinvis"))) {
		yield* g.srcCall(f, "handle_diginvis");
	}
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "loc"))) {
		if (truthy(rt.sv(f, "client"))) {
			E = null;
			rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/error"));
			if (($e = rt.next(f, 0)) !== undefined) {
				E = $e;
				rt.setSv(f, "loc", rt.fv(f, "loc", live(E)));
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ was found to have no .loc with an attached client, if the cause is unknown it would be wise to ask how this was accomplished.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.src)]))])]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was found to have no .loc with an attached client.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))])]);
		} else {
			return live(f.dot);
		}
	}
	environment = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", []));
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_breathing", live(times_fired));
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_mutations_and_radiation");
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_chemicals_in_body");
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_random_events");
	}
	if (truthy(live(environment))) {
		yield* g.srcCall(f, "handle_environment", live(environment));
	}
	yield* g.srcCall(f, "handle_fire");
	yield* g.srcCall(f, "handle_stomach");
	yield* g.srcCall(f, "update_gravity", (yield* g.srcCall(f, "mob_has_gravity")));
	if (truthy(rt.sv(f, "machine"))) {
		yield* g.callName(f, rt.sv(f, "machine"), "check_eye", [live(f.src)]);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_disabilities");
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "handle_status_effects");
	}
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	return 1;
}, true, { waitfor: false });

// /mob/living/proc/handle_diginvis  (code/modules/mob/living/life.dm:67)
rt.def("/mob/living/proc/handle_diginvis", function handle_diginvis(f: Frame) {
	let AI: Value = null;
	let $e: any;
	f.vars = () => [AI, $e];
	if (!truthy(rt.sv(f, "digitaldisguise"))) {
		rt.setFv(f, "digitaldisguise", live(f.src), rt.call(f, P("/proc/image"), null, ["loc", live(f.src)], rt.Args.Named));
	}
	rt.setFv(f, "override", rt.fv(f, "digitaldisguise", live(f.src)), 1);
	AI = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/silicon/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AI = $e;
		(rt.modField(f, rt.fv(f, "client", live(AI)), "images", rt.fv(f, "digitaldisguise", live(f.src)), rt.bitOr));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/proc/handle_fire  (code/modules/mob/living/life.dm:81)  may sleep
rt.def("/mob/living/proc/handle_fire", function* handle_fire(f: Frame) {
	let G: Value = null, location: Value = null;
	f.vars = () => [G, location];
	if (rt.lt(rt.sv(f, "fire_stacks"), 0)) {
		rt.setSv(f, "fire_stacks", (yield* g.call(f, P("/proc/min"), null, [0, add(rt.sv(f, "fire_stacks"), 1)])));
	}
	if (!truthy(rt.sv(f, "on_fire"))) {
		return 1;
	}
	if (rt.gt(rt.sv(f, "fire_stacks"), 0)) {
		yield* g.srcCall(f, "adjust_fire_stacks", -0.10000000149011612);
	} else {
		yield* g.srcCall(f, "ExtinguishMob");
		return live(f.dot);
	}
	if ((!truthy(rt.index(rt.gv(f, "gases", (G = (yield* g.callName(f, rt.sv(f, "loc"), "return_air", [])))), "o2")) || rt.lt(rt.index(rt.index(rt.fv(f, "gases", live(G)), "o2"), 1), 1))) {
		yield* g.srcCall(f, "ExtinguishMob");
		return live(f.dot);
	}
	yield* g.callName(f, (location = rt.getStep(f, live(f.src), 0)), "hotspot_expose", [700, 50, 1]);
	return f.dot;
}, true);

// /mob/living/proc/handle_status_effects  (code/modules/mob/living/life.dm:103)
rt.def("/mob/living/proc/handle_status_effects", function handle_status_effects(f: Frame) {
	if (!truthy(rt.sv(f, "confused"))) return f.dot;
	rt.setSv(f, "confused", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "confused"), 1)]));
	return f.dot;
});

// /mob/living/proc/handle_disabilities  (code/modules/mob/living/life.dm:108)  may sleep
rt.def("/mob/living/proc/handle_disabilities", function* handle_disabilities(f: Frame) {
	if (truthy(rt.sv(f, "eye_blind"))) {
		if ((!truthy(rt.sv(f, "stat")) && !truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1)))) {
			rt.setSv(f, "eye_blind", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "eye_blind"), 1), 0])));
			if ((truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "eye_blind")))) {
				yield* g.srcCall(f, "clear_alert", "blind");
				yield* g.srcCall(f, "clear_fullscreen", "blind");
			}
		} else {
			rt.setSv(f, "eye_blind", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "eye_blind"), 1), 1])));
		}
	} else {
		if (!truthy(rt.sv(f, "eye_blurry"))) return f.dot;
		rt.setSv(f, "eye_blurry", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "eye_blurry"), 1), 0])));
		if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "eye_blurry")))) return f.dot;
		yield* g.srcCall(f, "clear_fullscreen", "blurry");
	}
	return f.dot;
}, true);
