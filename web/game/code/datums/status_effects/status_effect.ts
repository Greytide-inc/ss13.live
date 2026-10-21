// From code/datums/status_effects/status_effect.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(917, "/datum/status_effect", "/datum", {
	id: "effect",
	duration: -1,
	tick_interval: 10,
	owner: null,
	status_type: 1,
	on_remove_on_mob_delete: 0,
	linked_alert: null,
	alert_type: rt.typePath("/obj/screen/alert/status_effect"),
});

// /datum/status_effect/proc/New  (code/datums/status_effects/status_effect.dm:16)  may sleep
rt.def("/datum/status_effect/proc/New", function* New(f: Frame, _arguments: Value) {
	f.vars = () => [_arguments];
	yield* g.callSrc(f, "on_creation", [live(_arguments)], rt.Args.List);
	return f.dot;
}, true);

// /datum/status_effect/proc/on_creation  (code/datums/status_effects/status_effect.dm:20)  may sleep
rt.def("/datum/status_effect/proc/on_creation", function* on_creation(f: Frame, new_owner: Value) {
	let A: Value = null;
	f.vars = () => [new_owner, A];
	if (truthy(live(new_owner))) {
		rt.setSv(f, "owner", live(new_owner));
	}
	if (truthy(rt.sv(f, "owner"))) {
		if (!truthy(rt.fv(f, "status_effects", rt.sv(f, "owner")))) {
			rt.setFv(f, "status_effects", rt.sv(f, "owner"), rt.list());
		}
		rt.modField(f, rt.sv(f, "owner"), "status_effects", live(f.src), add);
	}
	if ((!truthy(rt.sv(f, "owner")) || !truthy((yield* g.srcCall(f, "on_apply"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "duration"), -1)) {
		rt.setSv(f, "duration", add(rt.worldTime(f), rt.sv(f, "duration")));
	}
	rt.setSv(f, "tick_interval", add(rt.worldTime(f), rt.sv(f, "tick_interval")));
	if (truthy(rt.sv(f, "alert_type"))) {
		rt.setFv(f, "attached_effect", (A = (yield* g.callName(f, rt.sv(f, "owner"), "throw_alert", [rt.sv(f, "id"), rt.sv(f, "alert_type")]))), live(f.src));
		rt.setSv(f, "linked_alert", live(A));
	}
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	return 1;
}, true);

// /datum/status_effect/proc/Destroy  (code/datums/status_effects/status_effect.dm:37)  may sleep
rt.def("/datum/status_effect/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "owner"))) {
		yield* g.callName(f, rt.sv(f, "owner"), "clear_alert", [rt.sv(f, "id")]);
		if (truthy(rt.fv(f, "status_effects", rt.sv(f, "owner")))) {
			(rt.modField(f, rt.sv(f, "owner"), "status_effects", live(f.src), subtract));
			if (!truthy(rt.getLen(f, rt.fv(f, "status_effects", rt.sv(f, "owner"))))) {
				rt.setFv(f, "status_effects", rt.sv(f, "owner"), null);
			}
		}
		yield* g.srcCall(f, "on_remove");
		rt.setSv(f, "owner", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/status_effect/proc/process  (code/datums/status_effects/status_effect.dm:46)  may sleep
rt.def("/datum/status_effect/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "tick_interval"), rt.worldTime(f))) {
		yield* g.srcCall(f, "tick");
		rt.setSv(f, "tick_interval", add(rt.worldTime(f), rt.initial(f, live(f.src), "tick_interval")));
	}
	if (!(!isEqual(rt.sv(f, "duration"), -1) && rt.lt(rt.sv(f, "duration"), rt.worldTime(f)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /datum/status_effect/proc/be_replaced  (code/datums/status_effects/status_effect.dm:60)  may sleep
rt.def("/datum/status_effect/proc/be_replaced", function* be_replaced(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "clear_alert", [rt.sv(f, "id")]);
	if (truthy(rt.fv(f, "status_effects", rt.sv(f, "owner")))) {
		(rt.modField(f, rt.sv(f, "owner"), "status_effects", live(f.src), subtract));
		if (!truthy(rt.getLen(f, rt.fv(f, "status_effects", rt.sv(f, "owner"))))) {
			rt.setFv(f, "status_effects", rt.sv(f, "owner"), null);
		}
	}
	rt.setSv(f, "owner", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/proc/apply_status_effect  (code/datums/status_effects/status_effect.dm:80)  may sleep
rt.def("/mob/living/proc/apply_status_effect", function* apply_status_effect(f: Frame) {
	let S1: Value = null, S: Value = null, _arguments: Value = null;
	let $e: any;
	f.vars = () => [S1, S, _arguments, $e];
	f.dot = 0;
	S1 = live(f.args[0]);
	if (!truthy(rt.sv(f, "status_effects"))) {
		rt.setSv(f, "status_effects", rt.list());
	}
	S = null;
	rt.forList(f, 0, rt.sv(f, "status_effects"), T("/datum/status_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((isEqual(rt.fv(f, "id", live(S)), rt.initial(f, live(S1), "id")) && truthy(rt.fv(f, "status_type", live(S))))) {
			if (isEqual(rt.fv(f, "status_type", live(S)), 2)) {
				yield* g.callName(f, live(S), "be_replaced", []);
			} else {
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setAt((_arguments = (yield* g.callName(f, f.argsList, "Copy", []))), 1, live(f.src));
	f.dot = (S1 = (yield* g.new_(f, live(f.args[0]), [live(_arguments)])));
	return f.dot;
}, true, { args: ["effect"] });

// /mob/living/proc/remove_status_effect  (code/datums/status_effects/status_effect.dm:96)  may sleep
rt.def("/mob/living/proc/remove_status_effect", function* remove_status_effect(f: Frame, effect: Value) {
	let S1: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [effect, S1, S, $e];
	f.dot = 0;
	if (!truthy(rt.sv(f, "status_effects"))) return f.dot;
	S1 = live(effect);
	S = null;
	rt.forList(f, 0, rt.sv(f, "status_effects"), T("/datum/status_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.initial(f, live(S1), "id"), rt.fv(f, "id", live(S)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			f.dot = 1;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/proc/has_status_effect  (code/datums/status_effects/status_effect.dm:105)
rt.def("/mob/living/proc/has_status_effect", function has_status_effect(f: Frame, effect: Value) {
	let S1: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [S1, S, $e];
	f.dot = 0;
	if (!truthy(rt.sv(f, "status_effects"))) return f.dot;
	S1 = live(effect);
	S = null;
	rt.forList(f, 0, rt.sv(f, "status_effects"), T("/datum/status_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.initial(f, live(S1), "id"), rt.fv(f, "id", live(S)))) {
			return live(S);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /mob/living/proc/has_status_effect_list  (code/datums/status_effects/status_effect.dm:111)
rt.def("/mob/living/proc/has_status_effect_list", function has_status_effect_list(f: Frame, effect: Value) {
	let S1: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [S1, S, $e];
	f.dot = rt.list();
	if (!truthy(rt.sv(f, "status_effects"))) return f.dot;
	S1 = live(effect);
	S = null;
	rt.forList(f, 0, rt.sv(f, "status_effects"), T("/datum/status_effect"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.initial(f, live(S1), "id"), rt.fv(f, "id", live(S)))) {
			f.dot = rt.modify(live(f.dot), live(S), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
