// From code/modules/mob/living/carbon/alien/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/Life  (code/modules/mob/living/carbon/alien/life.dm:2)
rt.def("/mob/living/carbon/alien/proc/Life", function Life(f: Frame) {
	rt.callSrc(f, "findQueen", []);
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { waitfor: false });

// /mob/living/carbon/alien/proc/check_breath  (code/modules/mob/living/carbon/alien/life.dm:6)  may sleep
rt.def("/mob/living/carbon/alien/proc/check_breath", function* check_breath(f: Frame, breath: Value) {
	let toxins_used: Value = null, tox_detect_threshold: Value = null, breath_pressure: Value = null, breath_gases: Value = null, Toxins_pp: Value = null;
	f.vars = () => [breath, toxins_used, tox_detect_threshold, breath_pressure, breath_gases, Toxins_pp];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if ((!truthy(live(breath)) || isEqual((yield* g.callName(f, live(breath), "total_moles", [])), 0))) {
		return 0;
	}
	toxins_used = 0;
	tox_detect_threshold = 0.019999999552965164;
	breath_pressure = divide(multiply(multiply((yield* g.callName(f, live(breath), "total_moles", [])), 8.3100004196167), rt.fv(f, "temperature", live(breath))), 0.5);
	breath_gases = rt.fv(f, "gases", live(breath));
	yield* g.callName(f, live(breath), "assert_gases", ["plasma", "o2"]);
	if (rt.gt((Toxins_pp = multiply(divide(rt.index(rt.at(live(breath_gases), "plasma"), 1), (yield* g.callName(f, live(breath), "total_moles", []))), live(breath_pressure))), live(tox_detect_threshold))) {
		yield* g.srcCall(f, "adjustPlasma", multiply(rt.index(rt.at(live(breath_gases), "plasma"), 1), 250));
		yield* g.srcCall(f, "throw_alert", "alien_tox", T("/obj/screen/alert/alien_tox"));
		toxins_used = rt.index(rt.at(live(breath_gases), "plasma"), 1);
	} else {
		yield* g.srcCall(f, "clear_alert", "alien_tox");
	}
	(rt.modAt(rt.at(live(breath_gases), "plasma"), 1, live(toxins_used), subtract));
	rt.modAt(rt.at(live(breath_gases), "o2"), 1, live(toxins_used), add);
	yield* g.callName(f, live(breath), "garbage_collect", []);
	yield* g.srcCall(f, "handle_breath_temperature", live(breath));
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/handle_status_effects  (code/modules/mob/living/carbon/alien/life.dm:42)  may sleep
rt.def("/mob/living/carbon/alien/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!rt.gt(rt.sv(f, "move_delay_add"), 0)) return f.dot;
	rt.setSv(f, "move_delay_add", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "move_delay_add"), (yield* g.call(f, P("/proc/rand"), null, [1, 2])))])));
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/handle_fire  (code/modules/mob/living/carbon/alien/life.dm:51)  may sleep
rt.def("/mob/living/carbon/alien/proc/handle_fire", function* handle_fire(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "bodytemperature", 30, add);
	return live(f.dot);
}, true);
