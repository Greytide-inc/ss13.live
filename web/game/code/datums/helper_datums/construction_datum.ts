// Based on /tg/station's code/datums/helper_datums/construction_datum.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1027, "/datum/construction", "/datum", {
	steps: null,
	holder: null,
	result: null,
	steps_desc: null,
});

// construction_datum.dm:11
rt.def("/datum/construction/proc/New", function* New(f: Frame, atom: Value) {
	yield* parent_proc();
	this.holder = atom;
	if (!this.holder) {
		yield* qdel(this);
	}
	this.set_desc(rt.len(f, this.steps));
	return f.dot;
}, true);

// construction_datum.dm:19
rt.def("/datum/construction/proc/next_step", function* next_step(f: Frame) {
	this.steps.len--;
	if (!rt.len(f, this.steps)) {
		yield* this.spawn_result();
	} else {
		this.set_desc(rt.len(f, this.steps));
	}
	return f.dot;
}, true);

// construction_datum.dm:30
rt.def("/datum/construction/proc/check_step", function* check_step(f: Frame, used_atom: Value, user: Value) {
	let valid_step: Value = null;
	if (valid_step = this.is_right_key(used_atom)) {
		if (yield* this.custom_action(valid_step, used_atom, user)) {
			yield* this.next_step();
			return 1;
		}
	}
	return 0;
}, true);

// construction_datum.dm:38
rt.def("/datum/construction/proc/is_right_key", function is_right_key(f: Frame, used_atom: Value) {
	let L: Value = rt.index(this.steps, rt.len(f, this.steps));
	if (rt.op(f, "IsType", [], [used_atom, rt.at(L, "key")])) {
		return rt.len(f, this.steps);
	}
	return 0;
});

// construction_datum.dm:47
rt.def("/datum/construction/proc/check_all_steps", function* check_all_steps(f: Frame, used_atom: Value, user: Value) {
	let L: Value = null;
	let i: Value = 1;
	while (i <= rt.len(f, this.steps)) {
		L = rt.index(this.steps, i);
		if (rt.op(f, "IsType", [], [used_atom, rt.at(L, "key")])) {
			if (yield* this.custom_action(i, used_atom, user)) {
				rt.setAt(this.steps, i, null);
				listclearnulls(this.steps);
				if (!rt.len(f, this.steps)) {
					yield* this.spawn_result();
				}
				return 1;
			}
		}
		i++;
	}
	return 0;
}, true);

// construction_datum.dm:61
rt.def("/datum/construction/proc/spawn_result", function* spawn_result(f: Frame) {
	if (this.result) {
		yield* new_(this.result, rt.getStep(f, this.holder, 0));
		yield* qdel(this.holder);
	}
	return f.dot;
}, true);

// construction_datum.dm:66
rt.def("/datum/construction/proc/set_desc", function set_desc(f: Frame, index: Value) {
	let step: Value = rt.index(this.steps, index);
	this.holder.desc = rt.at(step, "desc");
	return f.dot;
});

rt.type(1028, "/datum/construction/reversible", "/datum/construction", {
	index: null,
});

// construction_datum.dm:74
rt.def("/datum/construction/reversible/proc/New", function* New(f: Frame, atom: Value) {
	yield* parent_proc();
	this.index = rt.len(f, this.steps);
	return f.dot;
}, true);

// construction_datum.dm:79
rt.def("/datum/construction/reversible/proc/update_index", function* update_index(f: Frame, diff: Value) {
	if ((this.index += diff) == 0) {
		yield* this.spawn_result();
	} else {
		this.set_desc(this.index);
	}
	return f.dot;
}, true);

// construction_datum.dm:87
rt.def("/datum/construction/reversible/proc/is_right_key", function is_right_key(f: Frame, used_atom: Value) {
	let L: Value = rt.index(this.steps, this.index);
	if (rt.op(f, "IsType", [], [used_atom, rt.at(L, "key")])) {
		return -1;
	} else if (rt.at(L, "backkey") && rt.op(f, "IsType", [], [used_atom, rt.at(L, "backkey")])) {
		return 1;
	}
	return 0;
});

// construction_datum.dm:95
rt.def("/datum/construction/reversible/proc/check_step", function* check_step(f: Frame, used_atom: Value, user: Value) {
	let diff: Value = null;
	if (diff = this.is_right_key(used_atom)) {
		if (yield* this.custom_action(this.index, diff, used_atom, user)) {
			yield* this.update_index(diff);
			return 1;
		}
	}
	return 0;
}, true);
