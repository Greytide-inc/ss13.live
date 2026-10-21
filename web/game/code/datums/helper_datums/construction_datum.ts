// From code/datums/helper_datums/construction_datum.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1027, "/datum/construction", "/datum", {
	steps: null,
	holder: null,
	result: null,
	steps_desc: null,
});

// /datum/construction/proc/New  (code/datums/helper_datums/construction_datum.dm:11)  may sleep
rt.def("/datum/construction/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "holder", live(f.args[0]));
	if (!truthy(rt.sv(f, "holder"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.srcCall(f, "set_desc", rt.len(f, rt.sv(f, "steps")));
	return live(f.dot);
}, true, { args: ["atom"] });

// /datum/construction/proc/next_step  (code/datums/helper_datums/construction_datum.dm:19)  may sleep
rt.def("/datum/construction/proc/next_step", function* next_step(f: Frame) {
	rt.incField(f, rt.sv(f, "steps"), "len", -1, true);
	if (!truthy(rt.len(f, rt.sv(f, "steps")))) {
		yield* g.srcCall(f, "spawn_result");
	} else {
		yield* g.srcCall(f, "set_desc", rt.len(f, rt.sv(f, "steps")));
	}
	return live(f.dot);
}, true);

// /datum/construction/proc/check_step  (code/datums/helper_datums/construction_datum.dm:30)  may sleep
rt.def("/datum/construction/proc/check_step", function* check_step(f: Frame, used_atom: Value, user: Value) {
	let valid_step: Value = null;
	f.vars = () => [used_atom, user, valid_step];
	if (truthy((valid_step = (yield* g.srcCall(f, "is_right_key", live(used_atom)))))) {
		if (truthy((yield* g.srcCall(f, "custom_action", live(valid_step), live(used_atom), live(user))))) {
			yield* g.srcCall(f, "next_step");
			return 1;
		}
	}
	return 0;
}, true);

// /datum/construction/proc/is_right_key  (code/datums/helper_datums/construction_datum.dm:38)
rt.def("/datum/construction/proc/is_right_key", function is_right_key(f: Frame, used_atom: Value) {
	let L: Value = null;
	f.vars = () => [L];
	L = rt.index(rt.sv(f, "steps"), rt.len(f, rt.sv(f, "steps")));
	if (truthy(rt.op(f, "IsType", [], [live(used_atom), rt.at(live(L), "key")]))) {
		return rt.len(f, rt.sv(f, "steps"));
	}
	return 0;
});

// /datum/construction/proc/check_all_steps  (code/datums/helper_datums/construction_datum.dm:47)  may sleep
rt.def("/datum/construction/proc/check_all_steps", function* check_all_steps(f: Frame, used_atom: Value, user: Value) {
	let i: Value = null, L: Value = null;
	f.vars = () => [used_atom, user, i, L];
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "steps")))) {
		L = rt.index(rt.sv(f, "steps"), live(i));
		if (truthy(rt.op(f, "IsType", [], [live(used_atom), rt.at(live(L), "key")]))) {
			if (truthy((yield* g.srcCall(f, "custom_action", live(i), live(used_atom), live(user))))) {
				rt.setAt(rt.sv(f, "steps"), live(i), null);
				yield* g.call(f, P("/proc/listclearnulls"), null, [rt.sv(f, "steps")]);
				if (!truthy(rt.len(f, rt.sv(f, "steps")))) {
					yield* g.srcCall(f, "spawn_result");
				}
				return 1;
			}
		}
		i = rt.inc(live(i), 1);
	}
	return 0;
}, true);

// /datum/construction/proc/spawn_result  (code/datums/helper_datums/construction_datum.dm:61)  may sleep
rt.def("/datum/construction/proc/spawn_result", function* spawn_result(f: Frame) {
	if (truthy(rt.sv(f, "result"))) {
		yield* g.new_(f, rt.sv(f, "result"), [rt.getStep(f, rt.sv(f, "holder"), 0)]);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "holder")]);
	}
	return live(f.dot);
}, true);

// /datum/construction/proc/set_desc  (code/datums/helper_datums/construction_datum.dm:66)
rt.def("/datum/construction/proc/set_desc", function set_desc(f: Frame, index: Value) {
	let step: Value = null;
	f.vars = () => [step];
	step = rt.index(rt.sv(f, "steps"), live(index));
	rt.setFv(f, "desc", rt.sv(f, "holder"), rt.at(live(step), "desc"));
	return live(f.dot);
});

rt.type(1028, "/datum/construction/reversible", "/datum/construction", {
	index: null,
});

// /datum/construction/reversible/proc/New  (code/datums/helper_datums/construction_datum.dm:74)  may sleep
rt.def("/datum/construction/reversible/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "index", rt.len(f, rt.sv(f, "steps")));
	return live(f.dot);
}, true, { args: ["atom"] });

// /datum/construction/reversible/proc/update_index  (code/datums/helper_datums/construction_datum.dm:79)  may sleep
rt.def("/datum/construction/reversible/proc/update_index", function* update_index(f: Frame, diff: Value) {
	f.vars = () => [diff];
	if (isEqual((rt.modSrcVar(f, "index", live(diff), add)), 0)) {
		yield* g.srcCall(f, "spawn_result");
	} else {
		yield* g.srcCall(f, "set_desc", rt.sv(f, "index"));
	}
	return live(f.dot);
}, true);

// /datum/construction/reversible/proc/is_right_key  (code/datums/helper_datums/construction_datum.dm:87)
rt.def("/datum/construction/reversible/proc/is_right_key", function is_right_key(f: Frame, used_atom: Value) {
	let L: Value = null;
	f.vars = () => [L];
	L = rt.index(rt.sv(f, "steps"), rt.sv(f, "index"));
	if (truthy(rt.op(f, "IsType", [], [live(used_atom), rt.at(live(L), "key")]))) {
		return -1;
	} else {
		if ((truthy(rt.at(live(L), "backkey")) && truthy(rt.op(f, "IsType", [], [live(used_atom), rt.at(live(L), "backkey")])))) {
			return 1;
		}
	}
	return 0;
});

// /datum/construction/reversible/proc/check_step  (code/datums/helper_datums/construction_datum.dm:95)  may sleep
rt.def("/datum/construction/reversible/proc/check_step", function* check_step(f: Frame, used_atom: Value, user: Value) {
	let diff: Value = null;
	f.vars = () => [used_atom, user, diff];
	if (truthy((diff = (yield* g.srcCall(f, "is_right_key", live(used_atom)))))) {
		if (truthy((yield* g.srcCall(f, "custom_action", rt.sv(f, "index"), live(diff), live(used_atom), live(user))))) {
			yield* g.srcCall(f, "update_index", live(diff));
			return 1;
		}
	}
	return 0;
}, true);
