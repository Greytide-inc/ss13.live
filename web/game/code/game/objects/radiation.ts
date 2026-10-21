// From code/game/objects/radiation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/radiation_pulse  (code/game/objects/radiation.dm:2)  may sleep
rt.def("/proc/radiation_pulse", function* radiation_pulse(f: Frame, epicenter: Value, heavy_range: Value, light_range: Value, severity: Value, log: Value) {
	let light_severity: Value = null, _T: Value = null, distance: Value = null;
	let $e: any;
	f.vars = () => [epicenter, heavy_range, light_range, severity, log, light_severity, _T, distance, $e];
	if (live(log) === null) {
		log = 0;
	}
	if ((!truthy(live(epicenter)) || !truthy(live(severity)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(epicenter)])))) {
		epicenter = rt.getStep(f, rt.fv(f, "loc", live(epicenter)), 0);
	}
	if (rt.gt(live(heavy_range), live(light_range))) {
		light_range = live(heavy_range);
	}
	light_severity = multiply(live(severity), 0.5);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [live(light_range), live(epicenter)])), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (rt.lt((distance = (yield* g.call(f, P("/proc/get_dist"), null, [live(epicenter), live(_T)]))), 0)) {
			distance = 0;
		}
		if (rt.lt(live(distance), live(heavy_range))) {
			yield* g.callName(f, live(_T), "rad_act", [live(severity)]);
		} else {
			if (isEqual(live(distance), live(heavy_range))) {
				if (truthy(rt.op(f, "Prob", [], [50]))) {
					yield* g.callName(f, live(_T), "rad_act", [live(severity)]);
				} else {
					yield* g.callName(f, live(_T), "rad_act", [live(light_severity)]);
				}
			} else {
				if (rt.le(live(distance), live(light_range))) {
					yield* g.callName(f, live(_T), "rad_act", [live(light_severity)]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(log))) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Radiation pulse with size (＀, ＀) and severity ＀ in area ＀ ", [live(heavy_range), live(light_range), live(severity), rt.gv(f, "name", rt.fv(f, "loc", live(epicenter)))])]);
	}
	return 1;
}, true);

// /mob/living/proc/rad_act  (code/game/objects/radiation.dm:34)  may sleep
rt.def("/mob/living/proc/rad_act", function* rad_act(f: Frame, amount: Value, silent: Value) {
	let blocked: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [amount, silent, blocked, I, $e];
	if (live(silent) === null) {
		silent = 0;
	}
	if (!truthy(live(amount))) return f.dot;
	blocked = (yield* g.srcCall(f, "getarmor", null, "rad"));
	if (!truthy(live(silent))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Your skin feels warm."]);
	}
	yield* g.srcCall(f, "apply_effect", live(amount), "irradiate", live(blocked));
	I = null;
	rt.forList(f, 0, live(f.src), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(I), "rad_act", [live(amount)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/proc/rad_act  (code/game/objects/radiation.dm:44)  may sleep
rt.def("/mob/living/carbon/proc/rad_act", function* rad_act(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((truthy(rt.sv(f, "dna")) && truthy((rt.isIn(f, 9, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)))) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["amount", "silent"] });

// /mob/living/silicon/proc/rad_act  (code/game/objects/radiation.dm:50)  may sleep
rt.def("/mob/living/silicon/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.vars = () => [amount];
	f.dot = (yield* g.callSuper(f, [live(amount), 1]));
	return f.dot;
}, true);

// /mob/living/simple_animal/bot/proc/rad_act  (code/game/objects/radiation.dm:53)  may sleep
rt.def("/mob/living/simple_animal/bot/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.vars = () => [amount];
	f.dot = (yield* g.callSuper(f, [live(amount), 1]));
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/proc/rad_act  (code/game/objects/radiation.dm:56)  may sleep
rt.def("/mob/living/simple_animal/drone/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.vars = () => [amount];
	f.dot = (yield* g.callSuper(f, [live(amount), 1]));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/swarmer/proc/rad_act  (code/game/objects/radiation.dm:59)  may sleep
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/rad_act", function* rad_act(f: Frame, amount: Value) {
	f.vars = () => [amount];
	f.dot = (yield* g.callSuper(f, [live(amount), 1]));
	return f.dot;
}, true);
