// From code/modules/reagents/chemistry/holder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4178, "/datum/reagents", "/datum", {
	total_volume: 0,
	maximum_volume: 100,
	my_atom: null,
	chem_temp: 150,
	last_tick: 1,
	addiction_tick: 1,
	flags: null,
	reagent_list: null,
	addiction_list: null,
});

// /datum/reagents/proc/<init>  (code/modules/reagents/chemistry/holder.dm:6)
rt.def("/datum/reagents/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_list", rt.new_(f, T("/list"), []));
	$0 = $0;
	rt.setSv(f, "addiction_list", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/reagents/proc/New  (code/modules/reagents/chemistry/holder.dm:17)  may sleep
rt.def("/datum/reagents/proc/New", function* New(f: Frame, maximum: Value) {
	let paths: Value = null, path: Value = null, D: Value = null, reaction_ids: Value = null, reaction: Value = null, id: Value = null;
	let $e: any;
	f.vars = () => [maximum, paths, path, D, reaction_ids, reaction, id, $e];
	if (live(maximum) === null) {
		maximum = 100;
	}
	rt.setSv(f, "maximum_volume", live(maximum));
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 1))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	}
	if (!truthy(rt.gl("chemical_reagents_list"))) {
		paths = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/reagent")])), T("/datum/reagent"));
		rt.setGl("chemical_reagents_list", rt.list());
		path = null;
		rt.forList(f, 0, live(paths));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			D = (yield* g.new_(f, live(path), []));
			rt.setAt(rt.gl("chemical_reagents_list"), rt.fv(f, "id", live(D)), live(D));
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.gl("chemical_reactions_list"))) return f.dot;
	paths = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/chemical_reaction")])), T("/datum/chemical_reaction"));
	rt.setGl("chemical_reactions_list", rt.list());
	path = null;
	rt.forList(f, 0, live(paths));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		D = (yield* g.new_(f, live(path), []));
		reaction_ids = rt.list();
		if ((truthy(rt.fv(f, "required_reagents", live(D))) && truthy(rt.getLen(f, rt.fv(f, "required_reagents", live(D)))))) {
			reaction = null;
			rt.forList(f, 1, rt.fv(f, "required_reagents", live(D)));
			while (($e = rt.next(f, 1)) !== undefined) {
				reaction = $e;
				reaction_ids = rt.modify(live(reaction_ids), live(reaction), add);
			}
			rt.endFor(f, 1);
		}
		id = null;
		rt.forList(f, 1, live(reaction_ids));
		if (($e = rt.next(f, 1)) !== undefined) {
			id = $e;
			if (!truthy(rt.index(rt.gl("chemical_reactions_list"), live(id)))) {
				rt.setAt(rt.gl("chemical_reactions_list"), live(id), rt.list());
			}
			rt.modAt(rt.gl("chemical_reactions_list"), live(id), live(D), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/reagents/proc/Destroy  (code/modules/reagents/chemistry/holder.dm:56)  may sleep
rt.def("/datum/reagents/proc/Destroy", function* Destroy(f: Frame) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.call(f, P("/proc/qdel"), null, [(R = live(reagent))]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(cached_reagents), "Cut", []);
	cached_reagents = null;
	if (!(truthy(rt.sv(f, "my_atom")) && isEqual(rt.fv(f, "reagents", rt.sv(f, "my_atom")), live(f.src)))) return f.dot;
	rt.setFv(f, "reagents", rt.sv(f, "my_atom"), null);
	return f.dot;
}, true);

// /datum/reagents/proc/remove_any  (code/modules/reagents/chemistry/holder.dm:68)  may sleep
rt.def("/datum/reagents/proc/remove_any", function* remove_any(f: Frame, amount: Value) {
	let cached_reagents: Value = null, total_transfered: Value = null, current_list_element: Value = null, R: Value = null;
	f.vars = () => [amount, cached_reagents, total_transfered, current_list_element, R];
	if (live(amount) === null) {
		amount = 1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	total_transfered = 0;
	current_list_element = 1;
	current_list_element = (yield* g.call(f, P("/proc/rand"), null, [1, rt.len(f, live(cached_reagents))]));
	while (!isEqual(live(total_transfered), live(amount))) {
		if (rt.ge(live(total_transfered), live(amount))) {
			break;
		}
		if ((rt.le(rt.sv(f, "total_volume"), 0) || !truthy(rt.len(f, live(cached_reagents))))) {
			break;
		}
		if (rt.gt(live(current_list_element), rt.len(f, live(cached_reagents)))) {
			current_list_element = 1;
		}
		yield* g.srcCall(f, "remove_reagent", rt.gv(f, "id", (R = rt.index(live(cached_reagents), live(current_list_element)))), 1);
		current_list_element = rt.inc(live(current_list_element), 1);
		total_transfered = rt.inc(live(total_transfered), 1);
		yield* g.srcCall(f, "update_total");
	}
	yield* g.srcCall(f, "handle_reactions");
	return live(total_transfered);
}, true);

// /datum/reagents/proc/remove_all  (code/modules/reagents/chemistry/holder.dm:94)  may sleep
rt.def("/datum/reagents/proc/remove_all", function* remove_all(f: Frame, amount: Value) {
	let cached_reagents: Value = null, part: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [amount, cached_reagents, part, reagent, R, $e];
	if (live(amount) === null) {
		amount = 1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	if (!rt.gt(rt.sv(f, "total_volume"), 0)) return f.dot;
	part = divide(live(amount), rt.sv(f, "total_volume"));
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.srcCall(f, "remove_reagent", rt.gv(f, "id", (R = live(reagent))), multiply(rt.fv(f, "volume", live(R)), live(part)));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_total");
	yield* g.srcCall(f, "handle_reactions");
	return live(amount);
}, true);

// /datum/reagents/proc/get_master_reagent_name  (code/modules/reagents/chemistry/holder.dm:106)
rt.def("/datum/reagents/proc/get_master_reagent_name", function get_master_reagent_name(f: Frame) {
	let cached_reagents: Value = null, name: Value = null, max_volume: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, name, max_volume, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	name = null;
	max_volume = 0;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (rt.gt(rt.gv(f, "volume", (R = live(reagent))), live(max_volume))) {
			max_volume = rt.fv(f, "volume", live(R));
			name = rt.fv(f, "name", live(R));
		}
	}
	rt.endFor(f, 0);
	return live(name);
});

// /datum/reagents/proc/get_master_reagent_id  (code/modules/reagents/chemistry/holder.dm:118)
rt.def("/datum/reagents/proc/get_master_reagent_id", function get_master_reagent_id(f: Frame) {
	let cached_reagents: Value = null, id: Value = null, max_volume: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, id, max_volume, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	id = null;
	max_volume = 0;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (rt.gt(rt.gv(f, "volume", (R = live(reagent))), live(max_volume))) {
			max_volume = rt.fv(f, "volume", live(R));
			id = rt.fv(f, "id", live(R));
		}
	}
	rt.endFor(f, 0);
	return live(id);
});

// /datum/reagents/proc/get_master_reagent  (code/modules/reagents/chemistry/holder.dm:130)
rt.def("/datum/reagents/proc/get_master_reagent", function get_master_reagent(f: Frame) {
	let cached_reagents: Value = null, master: Value = null, max_volume: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, master, max_volume, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	master = null;
	max_volume = 0;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (rt.gt(rt.gv(f, "volume", (R = live(reagent))), live(max_volume))) {
			max_volume = rt.fv(f, "volume", live(R));
			master = live(R);
		}
	}
	rt.endFor(f, 0);
	return live(master);
});

// /datum/reagents/proc/trans_to  (code/modules/reagents/chemistry/holder.dm:142)  may sleep
rt.def("/datum/reagents/proc/trans_to", function* trans_to(f: Frame, target: Value, amount: Value, multiplier: Value, preserve_data: Value, no_react: Value) {
	let cached_reagents: Value = null, R: Value = null, part: Value = null, trans_data: Value = null, reagent: Value = null, _T: Value = null, transfer_amount: Value = null;
	let $e: any;
	f.vars = () => [target, amount, multiplier, preserve_data, no_react, cached_reagents, R, part, trans_data, reagent, _T, transfer_amount, $e];
	if (live(amount) === null) {
		amount = 1;
	}
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if (live(preserve_data) === null) {
		preserve_data = 1;
	}
	if (live(no_react) === null) {
		no_react = 0;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	if ((!truthy(live(target)) || !truthy(rt.sv(f, "total_volume")))) {
		return live(f.dot);
	}
	if (rt.lt(live(amount), 0)) {
		return live(f.dot);
	}
	R = null;
	if (truthy((rt.istype(live(target), T("/datum/reagents")) ? 1 : 0))) {
		R = live(target);
	} else {
		if ((!truthy(rt.fv(f, "reagents", live(target))) || rt.le(rt.fv(f, "total_volume", live(f.src)), 0))) {
			return live(f.dot);
		}
		R = rt.fv(f, "reagents", live(target));
	}
	amount = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/min"), null, [live(amount), rt.fv(f, "total_volume", live(f.src))])), subtract(rt.fv(f, "maximum_volume", live(R)), rt.fv(f, "total_volume", live(R)))]));
	part = divide(live(amount), rt.fv(f, "total_volume", live(f.src)));
	trans_data = null;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		_T = live(reagent);
		transfer_amount = multiply(rt.fv(f, "volume", live(_T)), live(part));
		if (truthy(live(preserve_data))) {
			trans_data = (yield* g.srcCall(f, "copy_data", live(_T)));
		}
		yield* g.callName(f, live(R), "add_reagent", [null, rt.fv(f, "id", live(_T)), null, multiply(live(transfer_amount), live(multiplier)), null, live(trans_data), null, rt.sv(f, "chem_temp"), "no_react", 1], rt.Args.Named);
		yield* g.srcCall(f, "remove_reagent", rt.fv(f, "id", live(_T)), live(transfer_amount));
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_total");
	yield* g.callName(f, live(R), "update_total", []);
	if (!truthy(live(no_react))) {
		yield* g.callName(f, live(R), "handle_reactions", []);
		yield* g.callName(f, live(f.src), "handle_reactions", []);
	}
	return live(amount);
}, true);

// /datum/reagents/proc/copy_to  (code/modules/reagents/chemistry/holder.dm:174)  may sleep
rt.def("/datum/reagents/proc/copy_to", function* copy_to(f: Frame, target: Value, amount: Value, multiplier: Value, preserve_data: Value) {
	let cached_reagents: Value = null, R: Value = null, part: Value = null, trans_data: Value = null, reagent: Value = null, _T: Value = null, copy_amount: Value = null;
	let $e: any;
	f.vars = () => [target, amount, multiplier, preserve_data, cached_reagents, R, part, trans_data, reagent, _T, copy_amount, $e];
	if (live(amount) === null) {
		amount = 1;
	}
	if (live(multiplier) === null) {
		multiplier = 1;
	}
	if (live(preserve_data) === null) {
		preserve_data = 1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	if (!truthy(live(target))) {
		return live(f.dot);
	}
	R = null;
	if (truthy((rt.istype(live(target), T("/datum/reagents")) ? 1 : 0))) {
		R = live(target);
	} else {
		if ((!truthy(rt.fv(f, "reagents", live(target))) || rt.le(rt.fv(f, "total_volume", live(f.src)), 0))) {
			return live(f.dot);
		}
		R = rt.fv(f, "reagents", live(target));
	}
	if (rt.lt(live(amount), 0)) {
		return live(f.dot);
	}
	amount = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/min"), null, [live(amount), rt.sv(f, "total_volume")])), subtract(rt.fv(f, "maximum_volume", live(R)), rt.fv(f, "total_volume", live(R)))]));
	part = divide(live(amount), rt.sv(f, "total_volume"));
	trans_data = null;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		_T = live(reagent);
		copy_amount = multiply(rt.fv(f, "volume", live(_T)), live(part));
		if (truthy(live(preserve_data))) {
			trans_data = rt.fv(f, "data", live(_T));
		}
		yield* g.callName(f, live(R), "add_reagent", [rt.fv(f, "id", live(_T)), multiply(live(copy_amount), live(multiplier)), live(trans_data)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.src), "update_total", []);
	yield* g.callName(f, live(R), "update_total", []);
	yield* g.callName(f, live(R), "handle_reactions", []);
	yield* g.callName(f, live(f.src), "handle_reactions", []);
	return live(amount);
}, true);

// /datum/reagents/proc/trans_id_to  (code/modules/reagents/chemistry/holder.dm:205)  may sleep
rt.def("/datum/reagents/proc/trans_id_to", function* trans_id_to(f: Frame, target: Value, reagent: Value, amount: Value, preserve_data: Value) {
	let cached_reagents: Value = null, R: Value = null, trans_data: Value = null, CR: Value = null, current_reagent: Value = null;
	let $e: any;
	f.vars = () => [target, reagent, amount, preserve_data, cached_reagents, R, trans_data, CR, current_reagent, $e];
	if (live(amount) === null) {
		amount = 1;
	}
	if (live(preserve_data) === null) {
		preserve_data = 1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	if (!truthy(live(target))) {
		return live(f.dot);
	}
	if (((!truthy(rt.fv(f, "reagents", live(target))) || rt.le(rt.fv(f, "total_volume", live(f.src)), 0)) || !truthy((yield* g.callName(f, live(f.src), "get_reagent_amount", [live(reagent)]))))) {
		return live(f.dot);
	}
	if (rt.lt(live(amount), 0)) {
		return live(f.dot);
	}
	R = rt.fv(f, "reagents", live(target));
	if (rt.lt((yield* g.callName(f, live(f.src), "get_reagent_amount", [live(reagent)])), live(amount))) {
		amount = (yield* g.callName(f, live(f.src), "get_reagent_amount", [live(reagent)]));
	}
	amount = (yield* g.call(f, P("/proc/min"), null, [live(amount), subtract(rt.fv(f, "maximum_volume", live(R)), rt.fv(f, "total_volume", live(R)))]));
	trans_data = null;
	CR = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		CR = $e;
		if (isEqual(rt.gv(f, "id", (current_reagent = live(CR))), live(reagent))) {
			if (truthy(live(preserve_data))) {
				trans_data = rt.fv(f, "data", live(current_reagent));
			}
			yield* g.callName(f, live(R), "add_reagent", [rt.fv(f, "id", live(current_reagent)), live(amount), live(trans_data), rt.fv(f, "chem_temp", live(f.src))]);
			yield* g.srcCall(f, "remove_reagent", rt.fv(f, "id", live(current_reagent)), live(amount), 1);
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(f.src), "update_total", []);
	yield* g.callName(f, live(R), "update_total", []);
	yield* g.callName(f, live(R), "handle_reactions", []);
	return live(amount);
}, true);

// /datum/reagents/proc/metabolize  (code/modules/reagents/chemistry/holder.dm:233)  may sleep
rt.def("/datum/reagents/proc/metabolize", function* metabolize(f: Frame, C: Value, can_overdose: Value) {
	let cached_reagents: Value = null, cached_addictions: Value = null, need_mob_update: Value = null, reagent: Value = null, R: Value = null, new_reagent: Value = null, addiction: Value = null, A: Value = null, addiction_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, can_overdose, cached_reagents, cached_addictions, need_mob_update, reagent, R, new_reagent, addiction, A, addiction_3, $0, $e];
	if (live(can_overdose) === null) {
		can_overdose = 0;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	cached_addictions = rt.sv(f, "addiction_list");
	if (truthy(live(C))) {
		rt.setSv(f, "chem_temp", rt.fv(f, "bodytemperature", live(C)));
		yield* g.srcCall(f, "handle_reactions");
	}
	need_mob_update = 0;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if ((!truthy(rt.gv(f, "holder", (R = live(reagent)))) || truthy(rt.gv(f, "gc_destroyed", rt.fv(f, "holder", live(R)))))) {
			continue;
		}
		if (!truthy(live(C))) {
			C = rt.gv(f, "my_atom", rt.fv(f, "holder", live(R)));
		}
		if ((truthy(live(C)) && truthy(live(R)))) {
			if (!isEqual((yield* g.callName(f, live(C), "reagent_check", [live(R)])), 1)) {
				if (truthy(live(can_overdose))) {
					if (truthy(rt.fv(f, "overdose_threshold", live(R)))) {
						if ((rt.ge(rt.fv(f, "volume", live(R)), rt.fv(f, "overdose_threshold", live(R))) && !truthy(rt.fv(f, "overdosed", live(R))))) {
							rt.setFv(f, "overdosed", live(R), 1);
							need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "overdose_start", [live(C)])), add);
						}
					}
					if (truthy(rt.fv(f, "addiction_threshold", live(R)))) {
						if ((rt.ge(rt.fv(f, "volume", live(R)), rt.fv(f, "addiction_threshold", live(R))) && !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(R), live(cached_addictions)]))))) {
							new_reagent = (yield* g.new_(f, rt.fv(f, "type", live(R)), []));
							yield* g.callName(f, live(cached_addictions), "Add", [live(new_reagent)]);
						}
					}
					if (truthy(rt.fv(f, "overdosed", live(R)))) {
						need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "overdose_process", [live(C)])), add);
					}
					if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(R), live(cached_addictions)])))) {
						addiction = null;
						rt.forList(f, 1, live(cached_addictions));
						while (($e = rt.next(f, 1)) !== undefined) {
							addiction = $e;
							A = live(addiction);
							if (truthy(rt.op(f, "IsType", [], [live(R), live(A)]))) {
								rt.setFv(f, "addiction_stage", live(A), -15);
							}
						}
						rt.endFor(f, 1);
					}
				}
				need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "on_mob_life", [live(C)])), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(can_overdose))) {
		if (isEqual(rt.sv(f, "addiction_tick"), 6)) {
			rt.setSv(f, "addiction_tick", 1);
			addiction_3 = null;
			rt.forList(f, 0, live(cached_addictions));
			while (($e = rt.next(f, 0)) !== undefined) {
				addiction_3 = $e;
				R = live(addiction_3);
				if ((truthy(live(C)) && truthy(live(R)))) {
					rt.incField(f, live(R), "addiction_stage", 1, true);
					$0 = rt.fv(f, "addiction_stage", live(R));
					if (rt.inRange($0, 1, 10)) {
						need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "addiction_act_stage1", [live(C)])), add);
					} else if (rt.inRange($0, 10, 20)) {
						need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "addiction_act_stage2", [live(C)])), add);
					} else if (rt.inRange($0, 20, 30)) {
						need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "addiction_act_stage3", [live(C)])), add);
					} else if (rt.inRange($0, 30, 40)) {
						need_mob_update = rt.modify(live(need_mob_update), (yield* g.callName(f, live(R), "addiction_act_stage4", [live(C)])), add);
					} else if (rt.inRange($0, 40, 9.999999848243207e+30)) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='notice'>You feel like you've gotten over your need for ＀.</span>", [rt.fv(f, "name", live(R))])]);
						yield* g.callName(f, live(cached_addictions), "Remove", [live(R)]);
					}
				}
			}
			rt.endFor(f, 0);
		}
		rt.incSrcVar(f, "addiction_tick", 1, true);
	}
	if ((truthy(live(C)) && truthy(live(need_mob_update)))) {
		yield* g.callName(f, live(C), "updatehealth", []);
		yield* g.callName(f, live(C), "update_canmove", []);
		yield* g.callName(f, live(C), "update_stamina", []);
	}
	yield* g.srcCall(f, "update_total");
	return f.dot;
}, true);

// /datum/reagents/proc/process  (code/modules/reagents/chemistry/holder.dm:292)  may sleep
rt.def("/datum/reagents/proc/process", function* process(f: Frame) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 1))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.callName(f, (R = live(reagent)), "on_tick", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /datum/reagents/proc/set_reacting  (code/modules/reagents/chemistry/holder.dm:305)
rt.def("/datum/reagents/proc/set_reacting", function set_reacting(f: Frame, react: Value) {
	f.vars = () => [react];
	if (live(react) === null) {
		react = 1;
	}
	if (truthy(live(react))) {
		(rt.modSrcVar(f, "flags", 16777214, rt.bitAnd));
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		(rt.modSrcVar(f, "flags", 1, rt.bitOr));
	}
	return f.dot;
});

// /datum/reagents/proc/conditional_update_move  (code/modules/reagents/chemistry/holder.dm:312)  may sleep
rt.def("/datum/reagents/proc/conditional_update_move", function* conditional_update_move(f: Frame, A: Value, Running: Value) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [A, Running, cached_reagents, reagent, R, $e];
	if (live(Running) === null) {
		Running = 0;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.callName(f, (R = live(reagent)), "on_move", [live(A), live(Running)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_total");
	return f.dot;
}, true);

// /datum/reagents/proc/conditional_update  (code/modules/reagents/chemistry/holder.dm:319)  may sleep
rt.def("/datum/reagents/proc/conditional_update", function* conditional_update(f: Frame, A: Value) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [A, cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.callName(f, (R = live(reagent)), "on_update", [live(A)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_total");
	return f.dot;
}, true);

// /datum/reagents/proc/handle_reactions  (code/modules/reagents/chemistry/holder.dm:326)  may sleep
rt.def("/datum/reagents/proc/handle_reactions", function* handle_reactions(f: Frame) {
	let cached_reagents: Value = null, cached_reactions: Value = null, cached_my_atom: Value = null, reaction_occurred: Value = null, reagent: Value = null, R: Value = null, reaction: Value = null, C: Value = null, cached_required_reagents: Value = null, total_required_reagents: Value = null, total_matching_reagents: Value = null, cached_required_catalysts: Value = null, total_required_catalysts: Value = null, total_matching_catalysts: Value = null, matching_container: Value = null, matching_other: Value = null, multipliers: Value = null, required_temp: Value = null, is_cold_recipe: Value = null, meets_temp_requirement: Value = null, cached_results: Value = null, B: Value = null, M: Value = null, multiplier: Value = null, B_22: Value = null, _P: Value = null, seen: Value = null, M_23: Value = null, ME2: Value = null, M_24: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, cached_reactions, cached_my_atom, reaction_occurred, reagent, R, reaction, C, cached_required_reagents, total_required_reagents, total_matching_reagents, cached_required_catalysts, total_required_catalysts, total_matching_catalysts, matching_container, matching_other, multipliers, required_temp, is_cold_recipe, meets_temp_requirement, cached_results, B, M, multiplier, B_22, _P, seen, M_23, ME2, M_24, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	cached_reactions = rt.gl("chemical_reactions_list");
	cached_my_atom = rt.sv(f, "my_atom");
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 1))) {
		return live(f.dot);
	}
	reaction_occurred = 0;
	while (true) {
		reaction_occurred = 0;
		reagent = null;
		rt.forList(f, 0, live(cached_reagents));
		while (($e = rt.next(f, 0)) !== undefined) {
			reagent = $e;
			R = live(reagent);
			reaction = null;
			rt.forList(f, 1, rt.index(live(cached_reactions), rt.fv(f, "id", live(R))));
			while (($e = rt.next(f, 1)) !== undefined) {
				reaction = $e;
				if (!truthy(live(reaction))) {
					continue;
				}
				C = live(reaction);
				cached_required_reagents = rt.fv(f, "required_reagents", live(C));
				total_required_reagents = rt.len(f, live(cached_required_reagents));
				total_matching_reagents = 0;
				cached_required_catalysts = rt.fv(f, "required_catalysts", live(C));
				total_required_catalysts = rt.len(f, live(cached_required_catalysts));
				total_matching_catalysts = 0;
				matching_container = 0;
				matching_other = 0;
				multipliers = (yield* g.new_(f, T("/list"), []));
				required_temp = rt.fv(f, "required_temp", live(C));
				is_cold_recipe = rt.fv(f, "is_cold_recipe", live(C));
				meets_temp_requirement = 0;
				cached_results = rt.fv(f, "results", live(C));
				B = null;
				rt.forList(f, 2, live(cached_required_reagents));
				while (($e = rt.next(f, 2)) !== undefined) {
					B = $e;
					if (!truthy((yield* g.srcCall(f, "has_reagent", live(B), rt.index(live(cached_required_reagents), live(B)))))) {
						break;
					}
					total_matching_reagents = rt.inc(live(total_matching_reagents), 1);
					multipliers = rt.modify(live(multipliers), (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.srcCall(f, "get_reagent_amount", live(B))), rt.index(live(cached_required_reagents), live(B)))])), add);
				}
				rt.endFor(f, 2);
				B = null;
				rt.forList(f, 2, live(cached_required_catalysts));
				while (($e = rt.next(f, 2)) !== undefined) {
					B = $e;
					if (!truthy((yield* g.srcCall(f, "has_reagent", live(B), rt.index(live(cached_required_catalysts), live(B)))))) {
						break;
					}
					total_matching_catalysts = rt.inc(live(total_matching_catalysts), 1);
				}
				rt.endFor(f, 2);
				if (truthy(live(cached_my_atom))) {
					if (!truthy(rt.fv(f, "required_container", live(C)))) {
						matching_container = 1;
					} else {
						if (isEqual(rt.fv(f, "type", live(cached_my_atom)), rt.fv(f, "required_container", live(C)))) {
							matching_container = 1;
						}
					}
					if (truthy((rt.istype(live(cached_my_atom), T("/mob/living")) ? 1 : 0))) {
						if (truthy(rt.fv(f, "mob_react", live(C)))) {
							return live(f.dot);
						}
					}
					if (!truthy(rt.fv(f, "required_other", live(C)))) {
						matching_other = 1;
					} else {
						if (truthy((rt.istype(live(cached_my_atom), T("/obj/item/slime_extract")) ? 1 : 0))) {
							if (rt.gt(rt.gv(f, "Uses", (M = live(cached_my_atom))), 0)) {
								matching_other = 1;
							}
						}
					}
				} else {
					if (!truthy(rt.fv(f, "required_container", live(C)))) {
						matching_container = 1;
					}
					if (!truthy(rt.fv(f, "required_other", live(C)))) {
						matching_other = 1;
					}
				}
				if (((isEqual(live(required_temp), 0) || (truthy(live(is_cold_recipe)) && rt.le(rt.sv(f, "chem_temp"), live(required_temp)))) || (!truthy(live(is_cold_recipe)) && rt.ge(rt.sv(f, "chem_temp"), live(required_temp))))) {
					meets_temp_requirement = 1;
				}
				if (((((isEqual(live(total_matching_reagents), live(total_required_reagents)) && isEqual(live(total_matching_catalysts), live(total_required_catalysts))) && truthy(live(matching_container))) && truthy(live(matching_other))) && truthy(live(meets_temp_requirement)))) {
					multiplier = (yield* g.call(f, P("/proc/min"), null, [live(multipliers)]));
					B_22 = null;
					rt.forList(f, 2, live(cached_required_reagents));
					while (($e = rt.next(f, 2)) !== undefined) {
						B_22 = $e;
						yield* g.callSrc(f, "remove_reagent", [null, live(B_22), null, multiply(live(multiplier), rt.index(live(cached_required_reagents), live(B_22))), "safety", 1], rt.Args.Named);
					}
					rt.endFor(f, 2);
					_P = null;
					rt.forList(f, 2, rt.fv(f, "results", live(C)));
					while (($e = rt.next(f, 2)) !== undefined) {
						_P = $e;
						multiplier = (yield* g.call(f, P("/proc/max"), null, [live(multiplier), 1]));
						yield* g.srcCall(f, "add_reagent", live(_P), multiply(rt.index(live(cached_results), live(_P)), live(multiplier)), null, rt.sv(f, "chem_temp"));
					}
					rt.endFor(f, 2);
					seen = (yield* g.call(f, P("/proc/viewers"), null, [4, rt.getStep(f, rt.sv(f, "my_atom"), 0)]));
					if (truthy(live(cached_my_atom))) {
						if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(cached_my_atom)])))) {
							if (truthy(rt.fv(f, "mix_sound", live(C)))) {
								yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(cached_my_atom), 0), rt.fv(f, "mix_sound", live(C)), 80, 1]);
							}
							M_23 = null;
							rt.forList(f, 2, live(seen), T("/mob"));
							while (($e = rt.next(f, 2)) !== undefined) {
								M_23 = $e;
								yield* g.call(f, P("/proc/to_chat"), null, [live(M_23), fmt("<span class='notice'>＀ ＀</span>", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "my_atom")])), rt.fv(f, "mix_message", live(C))])]);
							}
							rt.endFor(f, 2);
						}
						if (truthy((rt.istype(live(cached_my_atom), T("/obj/item/slime_extract")) ? 1 : 0))) {
							rt.incField(f, (ME2 = rt.sv(f, "my_atom")), "Uses", -1, true);
							if (rt.le(rt.fv(f, "Uses", live(ME2)), 0)) {
								M_24 = null;
								rt.forList(f, 2, live(seen), T("/mob"));
								while (($e = rt.next(f, 2)) !== undefined) {
									M_24 = $e;
									yield* g.call(f, P("/proc/to_chat"), null, [live(M_24), fmt("<span class='notice'>＀ ＄！'s power is consumed in the reaction.</span>", [(yield* g.call(f, P("/proc/bicon"), null, [rt.sv(f, "my_atom")])), rt.sv(f, "my_atom")])]);
									rt.setFv(f, "name", live(ME2), "used slime extract");
									rt.setFv(f, "desc", live(ME2), "This extract has been used up.");
								}
								rt.endFor(f, 2);
							}
						}
					}
					yield* g.callName(f, live(C), "on_reaction", [live(f.src), live(multiplier)]);
					reaction_occurred = 1;
					break;
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		if (!truthy(live(reaction_occurred))) break;
	}
	yield* g.srcCall(f, "update_total");
	return 0;
}, true);

// /datum/reagents/proc/isolate_reagent  (code/modules/reagents/chemistry/holder.dm:429)  may sleep
rt.def("/datum/reagents/proc/isolate_reagent", function* isolate_reagent(f: Frame, reagent: Value) {
	let cached_reagents: Value = null, _reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [reagent, cached_reagents, _reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	_reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		_reagent = $e;
		if (!isEqual(rt.gv(f, "id", (R = live(_reagent))), live(reagent))) {
			yield* g.srcCall(f, "del_reagent", rt.fv(f, "id", live(R)));
			yield* g.srcCall(f, "update_total");
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/reagents/proc/del_reagent  (code/modules/reagents/chemistry/holder.dm:437)  may sleep
rt.def("/datum/reagents/proc/del_reagent", function* del_reagent(f: Frame, reagent: Value) {
	let cached_reagents: Value = null, _reagent: Value = null, R: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [reagent, cached_reagents, _reagent, R, M, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	_reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		_reagent = $e;
		if (isEqual(rt.gv(f, "id", (R = live(_reagent))), live(reagent))) {
			if ((truthy(rt.sv(f, "my_atom")) && truthy((rt.istype(rt.sv(f, "my_atom"), T("/mob/living")) ? 1 : 0)))) {
				M = rt.sv(f, "my_atom");
				yield* g.callName(f, live(R), "on_mob_delete", [live(M)]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
			(rt.modSrcVar(f, "reagent_list", live(R), subtract));
			yield* g.srcCall(f, "update_total");
			if (truthy(rt.sv(f, "my_atom"))) {
				yield* g.callName(f, rt.sv(f, "my_atom"), "on_reagent_change", []);
				yield* g.srcCall(f, "check_ignoreslow", rt.sv(f, "my_atom"));
				yield* g.srcCall(f, "check_gofast", rt.sv(f, "my_atom"));
				yield* g.srcCall(f, "check_goreallyfast", rt.sv(f, "my_atom"));
			}
		}
	}
	rt.endFor(f, 0);
	return 1;
}, true);

// /datum/reagents/proc/check_ignoreslow  (code/modules/reagents/chemistry/holder.dm:455)
rt.def("/datum/reagents/proc/check_ignoreslow", function check_ignoreslow(f: Frame, M: Value) {
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(M)]))) return f.dot;
	if (truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["morphine"]))) {
		return 1;
	} else {
		(rt.modField(f, live(M), "status_flags", 16777199, rt.bitAnd));
	}
	return f.dot;
});

// /datum/reagents/proc/check_gofast  (code/modules/reagents/chemistry/holder.dm:462)
rt.def("/datum/reagents/proc/check_gofast", function check_gofast(f: Frame, M: Value) {
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(M)]))) return f.dot;
	if ((((truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["unholywater"])) || truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["nuka_cola"]))) || truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["stimulants"]))) || truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["ephedrine"])))) {
		return 1;
	} else {
		(rt.modField(f, live(M), "status_flags", 16777183, rt.bitAnd));
	}
	return f.dot;
});

// /datum/reagents/proc/check_goreallyfast  (code/modules/reagents/chemistry/holder.dm:469)
rt.def("/datum/reagents/proc/check_goreallyfast", function check_goreallyfast(f: Frame, M: Value) {
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [live(M)]))) return f.dot;
	if (truthy(rt.callName(f, rt.fv(f, "reagents", live(M)), "has_reagent", ["methamphetamine"]))) {
		return 1;
	} else {
		(rt.modField(f, live(M), "status_flags", 16777151, rt.bitAnd));
	}
	return f.dot;
});

// /datum/reagents/proc/update_total  (code/modules/reagents/chemistry/holder.dm:476)  may sleep
rt.def("/datum/reagents/proc/update_total", function* update_total(f: Frame) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	rt.setSv(f, "total_volume", 0);
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (rt.lt(rt.gv(f, "volume", (R = live(reagent))), 0.10000000149011612)) {
			yield* g.srcCall(f, "del_reagent", rt.fv(f, "id", live(R)));
		} else {
			rt.modSrcVar(f, "total_volume", rt.fv(f, "volume", live(R)), add);
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /datum/reagents/proc/clear_reagents  (code/modules/reagents/chemistry/holder.dm:488)  may sleep
rt.def("/datum/reagents/proc/clear_reagents", function* clear_reagents(f: Frame) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		yield* g.srcCall(f, "del_reagent", rt.gv(f, "id", (R = live(reagent))));
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /datum/reagents/proc/reaction  (code/modules/reagents/chemistry/holder.dm:496)  may sleep
rt.def("/datum/reagents/proc/reaction", function* reaction(f: Frame, A: Value, method: Value, volume_modifier: Value, show_message: Value) {
	let react_type: Value = null, L: Value = null, cached_reagents: Value = null, reagent: Value = null, R: Value = null, touch_protection: Value = null, L_5: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, method, volume_modifier, show_message, react_type, L, cached_reagents, reagent, R, touch_protection, L_5, $0, $e];
	if (live(method) === null) {
		method = 1;
	}
	if (live(volume_modifier) === null) {
		volume_modifier = 1;
	}
	if (live(show_message) === null) {
		show_message = 1;
	}
	react_type = null;
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		react_type = "LIVING";
		if (isEqual(live(method), 2)) {
			yield* g.callName(f, (L = live(A)), "taste", [live(f.src)]);
		}
	} else {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(A)])))) {
			react_type = "TURF";
		} else {
			if (truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) {
				react_type = "OBJ";
			} else {
				return live(f.dot);
			}
		}
	}
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		R = live(reagent);
		$0 = live(react_type);
		if ($0 === "LIVING") {
			touch_protection = 0;
			if (isEqual(live(method), 3)) {
				touch_protection = (yield* g.callName(f, (L_5 = live(A)), "get_permeability_protection", []));
			}
			yield* g.callName(f, live(R), "reaction_mob", [live(A), live(method), multiply(rt.fv(f, "volume", live(R)), live(volume_modifier)), live(show_message), live(touch_protection)]);
		} else if ($0 === "TURF") {
			yield* g.callName(f, live(R), "reaction_turf", [live(A), multiply(rt.fv(f, "volume", live(R)), live(volume_modifier)), live(show_message)]);
		} else if ($0 === "OBJ") {
			yield* g.callName(f, live(R), "reaction_obj", [live(A), multiply(rt.fv(f, "volume", live(R)), live(volume_modifier)), live(show_message)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/reagents/proc/holder_full  (code/modules/reagents/chemistry/holder.dm:523)
rt.def("/datum/reagents/proc/holder_full", function holder_full(f: Frame) {
	if (rt.ge(rt.sv(f, "total_volume"), rt.sv(f, "maximum_volume"))) {
		return 1;
	}
	return 0;
});

// /datum/reagents/proc/add_reagent  (code/modules/reagents/chemistry/holder.dm:528)  may sleep
rt.def("/datum/reagents/proc/add_reagent", function* add_reagent(f: Frame, reagent: Value, amount: Value, data: Value, reagtemp: Value, no_react: Value) {
	let cached_reagents: Value = null, A: Value = null, R: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [reagent, amount, data, reagtemp, no_react, cached_reagents, A, R, D, $e];
	if (live(data) === null) {
		data = null;
	}
	if (live(reagtemp) === null) {
		reagtemp = 300;
	}
	if (live(no_react) === null) {
		no_react = 0;
	}
	if ((!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(amount)]))) || !truthy(live(amount)))) {
		return 0;
	}
	if (rt.lt(live(amount), 0)) {
		return 0;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	yield* g.srcCall(f, "update_total");
	if (rt.gt(add(rt.sv(f, "total_volume"), live(amount)), rt.sv(f, "maximum_volume"))) {
		amount = subtract(rt.sv(f, "maximum_volume"), rt.sv(f, "total_volume"));
	}
	rt.setSv(f, "chem_temp", (yield* g.call(f, P("/proc/round"), null, [divide(add(multiply(live(amount), live(reagtemp)), multiply(rt.sv(f, "total_volume"), rt.sv(f, "chem_temp"))), add(rt.sv(f, "total_volume"), live(amount)))])));
	A = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.gv(f, "id", (R = live(A))), live(reagent))) {
			rt.modField(f, live(R), "volume", live(amount), add);
			yield* g.srcCall(f, "update_total");
			if (truthy(rt.sv(f, "my_atom"))) {
				yield* g.callName(f, rt.sv(f, "my_atom"), "on_reagent_change", []);
			}
			yield* g.callName(f, live(R), "on_merge", [live(data), live(amount)]);
			if (!truthy(live(no_react))) {
				yield* g.srcCall(f, "handle_reactions");
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	if (truthy((D = rt.index(rt.gl("chemical_reagents_list"), live(reagent))))) {
		cached_reagents = rt.modify(live(cached_reagents), (R = (yield* g.new_(f, rt.fv(f, "type", live(D)), [live(data)]))), add);
		rt.setFv(f, "holder", live(R), live(f.src));
		rt.setFv(f, "volume", live(R), live(amount));
		if (truthy(live(data))) {
			rt.setFv(f, "data", live(R), live(data));
			yield* g.callName(f, live(R), "on_new", [live(data)]);
		}
		yield* g.srcCall(f, "update_total");
		if (truthy(rt.sv(f, "my_atom"))) {
			yield* g.callName(f, rt.sv(f, "my_atom"), "on_reagent_change", []);
		}
		if (!truthy(live(no_react))) {
			yield* g.srcCall(f, "handle_reactions");
		}
		return 1;
	} else {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("＀ attempted to add a reagent called '＀' which doesn't exist. (＀)", [rt.sv(f, "my_atom"), live(reagent), live(f.usr)]), "code/modules/reagents/chemistry/holder.dm", 571, live(f.src), live(f.usr)])]);
	}
	return 0;
}, true, { argTypes: [{  }, {  }, { path: "/list" }, {  }, {  }] });

// /datum/reagents/proc/add_reagent_list  (code/modules/reagents/chemistry/holder.dm:575)  may sleep
rt.def("/datum/reagents/proc/add_reagent_list", function* add_reagent_list(f: Frame, list_reagents: Value, data: Value) {
	let r_id: Value = null, amt: Value = null;
	let $e: any;
	f.vars = () => [list_reagents, data, r_id, amt, $e];
	if (live(data) === null) {
		data = null;
	}
	r_id = null;
	rt.forList(f, 0, live(list_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		r_id = $e;
		amt = rt.index(live(list_reagents), live(r_id));
		yield* g.srcCall(f, "add_reagent", live(r_id), live(amt), live(data));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/reagents/proc/remove_reagent  (code/modules/reagents/chemistry/holder.dm:581)  may sleep
rt.def("/datum/reagents/proc/remove_reagent", function* remove_reagent(f: Frame, reagent: Value, amount: Value, safety: Value) {
	let cached_reagents: Value = null, A: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [reagent, amount, safety, cached_reagents, A, R, $e];
	if (live(amount) === null) {
		amount = 0;
		yield* g.call(f, P("/proc/CRASH"), null, ["null amount passed to reagent code"]);
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(amount)])))) {
		return 0;
	}
	if (rt.lt(live(amount), 0)) {
		return 0;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	A = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.gv(f, "id", (R = live(A))), live(reagent))) {
			amount = (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(amount), rt.fv(f, "volume", live(R))]))]));
			(rt.modField(f, live(R), "volume", live(amount), subtract));
			yield* g.srcCall(f, "update_total");
			if (!truthy(live(safety))) {
				yield* g.srcCall(f, "handle_reactions");
			}
			if (truthy(rt.sv(f, "my_atom"))) {
				yield* g.callName(f, rt.sv(f, "my_atom"), "on_reagent_change", []);
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /datum/reagents/proc/has_reagent  (code/modules/reagents/chemistry/holder.dm:611)
rt.def("/datum/reagents/proc/has_reagent", function has_reagent(f: Frame, reagent: Value, amount: Value) {
	let cached_reagents: Value = null, _reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [amount, cached_reagents, _reagent, R, $e];
	if (live(amount) === null) {
		amount = -1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	_reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		_reagent = $e;
		if (isEqual(rt.gv(f, "id", (R = live(_reagent))), live(reagent))) {
			if (!truthy(live(amount))) {
				return live(R);
			} else {
				if (rt.ge(rt.fv(f, "volume", live(R)), live(amount))) {
					return live(R);
				} else {
					return 0;
				}
			}
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/reagents/proc/get_reagent_amount  (code/modules/reagents/chemistry/holder.dm:626)
rt.def("/datum/reagents/proc/get_reagent_amount", function get_reagent_amount(f: Frame, reagent: Value) {
	let cached_reagents: Value = null, _reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, _reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	_reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		_reagent = $e;
		if (isEqual(rt.gv(f, "id", (R = live(_reagent))), live(reagent))) {
			return rt.fv(f, "volume", live(R));
		}
	}
	rt.endFor(f, 0);
	return 0;
});

// /datum/reagents/proc/get_reagents  (code/modules/reagents/chemistry/holder.dm:635)
rt.def("/datum/reagents/proc/get_reagents", function get_reagents(f: Frame) {
	let names: Value = null, cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [names, cached_reagents, reagent, R, $e];
	names = rt.list();
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		names = rt.modify(live(names), rt.gv(f, "name", (R = live(reagent))), add);
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/jointext"), null, [live(names), ","]);
});

// /datum/reagents/proc/remove_all_type  (code/modules/reagents/chemistry/holder.dm:644)  may sleep
rt.def("/datum/reagents/proc/remove_all_type", function* remove_all_type(f: Frame, reagent_type: Value, amount: Value, strict: Value, safety: Value) {
	let cached_reagents: Value = null, has_removed_reagent: Value = null, reagent: Value = null, R: Value = null, matches: Value = null;
	let $e: any;
	f.vars = () => [reagent_type, amount, strict, safety, cached_reagents, has_removed_reagent, reagent, R, matches, $e];
	if (live(strict) === null) {
		strict = 0;
	}
	if (live(safety) === null) {
		safety = 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [live(amount)])))) {
		return 1;
	}
	cached_reagents = rt.sv(f, "reagent_list");
	has_removed_reagent = 0;
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		R = live(reagent);
		matches = 0;
		if (truthy(live(strict))) {
			if (isEqual(rt.fv(f, "type", live(R)), live(reagent_type))) {
				matches = 1;
			}
		} else {
			if (truthy(rt.op(f, "IsType", [], [live(R), live(reagent_type)]))) {
				matches = 1;
			}
		}
		if (truthy(live(matches))) {
			has_removed_reagent = (yield* g.srcCall(f, "remove_reagent", rt.fv(f, "id", live(R)), live(amount), live(safety)));
		}
	}
	rt.endFor(f, 0);
	return live(has_removed_reagent);
}, true);

// /datum/reagents/proc/get_data  (code/modules/reagents/chemistry/holder.dm:667)
rt.def("/datum/reagents/proc/get_data", function get_data(f: Frame, reagent_id: Value) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (isEqual(rt.gv(f, "id", (R = live(reagent))), live(reagent_id))) {
			return rt.fv(f, "data", live(R));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/reagents/proc/set_data  (code/modules/reagents/chemistry/holder.dm:675)
rt.def("/datum/reagents/proc/set_data", function set_data(f: Frame, reagent_id: Value, new_data: Value) {
	let cached_reagents: Value = null, reagent: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [cached_reagents, reagent, R, $e];
	cached_reagents = rt.sv(f, "reagent_list");
	reagent = null;
	rt.forList(f, 0, live(cached_reagents));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent = $e;
		if (isEqual(rt.gv(f, "id", (R = live(reagent))), live(reagent_id))) {
			rt.setFv(f, "data", live(R), live(new_data));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/reagents/proc/copy_data  (code/modules/reagents/chemistry/holder.dm:683)
rt.def("/datum/reagents/proc/copy_data", function copy_data(f: Frame, current_reagent: Value) {
	let trans_data: Value = null, v: Value = null;
	f.vars = () => [trans_data, v];
	if ((!truthy(live(current_reagent)) || !truthy(rt.fv(f, "data", live(current_reagent))))) {
		return null;
	}
	if (!truthy((rt.istype(rt.fv(f, "data", live(current_reagent)), T("/list")) ? 1 : 0))) {
		return rt.fv(f, "data", live(current_reagent));
	}
	if (truthy(rt.index((trans_data = rt.callName(f, rt.fv(f, "data", live(current_reagent)), "Copy", [])), "viruses"))) {
		v = rt.at(live(trans_data), "viruses");
		rt.setAt(live(trans_data), "viruses", rt.callName(f, live(v), "Copy", []));
	}
	return live(trans_data);
});

// /datum/reagents/proc/get_reagent  (code/modules/reagents/chemistry/holder.dm:704)
rt.def("/datum/reagents/proc/get_reagent", function get_reagent(f: Frame, type: Value) {
	let cached_reagents: Value = null;
	f.vars = () => [cached_reagents];
	cached_reagents = rt.sv(f, "reagent_list");
	f.dot = rt.locateIn(f, live(type), live(cached_reagents));
	return f.dot;
});

// /datum/reagents/proc/generate_taste_message  (code/modules/reagents/chemistry/holder.dm:709)
rt.def("/datum/reagents/proc/generate_taste_message", function generate_taste_message(f: Frame, minimum_percent: Value) {
	let out: Value = null, tastes: Value = null, R: Value = null, taste_data: Value = null, taste: Value = null, ratio: Value = null, amount: Value = null, taste_desc: Value = null, taste_amount: Value = null, total_taste: Value = null, percent: Value = null, intensity_desc: Value = null;
	let $e: any;
	f.vars = () => [minimum_percent, out, tastes, R, taste_data, taste, ratio, amount, taste_desc, taste_amount, total_taste, percent, intensity_desc, $e];
	if (live(minimum_percent) === null) {
		minimum_percent = 15;
	}
	out = rt.list();
	tastes = rt.list();
	if (rt.le(live(minimum_percent), 100)) {
		R = null;
		rt.forList(f, 0, rt.sv(f, "reagent_list"), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (!truthy(rt.fv(f, "taste_mult", live(R)))) {
				continue;
			}
			if (truthy((rt.istype(live(R), T("/datum/reagent/consumable/nutriment")) ? 1 : 0))) {
				taste_data = rt.fv(f, "data", live(R));
				taste = null;
				rt.forList(f, 1, live(taste_data));
				while (($e = rt.next(f, 1)) !== undefined) {
					taste = $e;
					ratio = rt.index(live(taste_data), live(taste));
					amount = multiply(multiply(live(ratio), rt.fv(f, "taste_mult", live(R))), rt.fv(f, "volume", live(R)));
					if (truthy((rt.isIn(f, live(taste), live(tastes)) ? 1 : 0))) {
						rt.modAt(live(tastes), live(taste), live(amount), add);
					} else {
						rt.setAt(live(tastes), live(taste), live(amount));
					}
				}
				rt.endFor(f, 1);
			} else {
				taste_desc = rt.fv(f, "taste_description", live(R));
				taste_amount = multiply(rt.fv(f, "volume", live(R)), rt.fv(f, "taste_mult", live(R)));
				if (truthy((rt.isIn(f, live(taste_desc), live(tastes)) ? 1 : 0))) {
					rt.modAt(live(tastes), live(taste_desc), live(taste_amount), add);
				} else {
					rt.setAt(live(tastes), live(taste_desc), live(taste_amount));
				}
			}
		}
		rt.endFor(f, 0);
		if (rt.gt((total_taste = rt.call(f, P("/proc/counterlist_sum"), null, [live(tastes)])), 0)) {
			taste_desc = null;
			rt.forList(f, 0, live(tastes));
			while (($e = rt.next(f, 0)) !== undefined) {
				taste_desc = $e;
				if (rt.lt((percent = multiply(divide(rt.index(live(tastes), live(taste_desc)), live(total_taste)), 100)), live(minimum_percent))) {
					continue;
				}
				intensity_desc = "a hint of";
				if ((rt.gt(live(percent), multiply(live(minimum_percent), 2)) || isEqual(live(percent), 100))) {
					intensity_desc = "";
				} else {
					if (rt.gt(live(percent), multiply(live(minimum_percent), 3))) {
						intensity_desc = "the strong flavor of";
					}
				}
				if (!isEqual(live(intensity_desc), "")) {
					out = rt.modify(live(out), fmt("＀ ＀", [live(intensity_desc), live(taste_desc)]), add);
				} else {
					out = rt.modify(live(out), fmt("＀", [live(taste_desc)]), add);
				}
			}
			rt.endFor(f, 0);
		}
	}
	return rt.call(f, P("/proc/english_list"), null, [live(out), "something indescribable"]);
});

// /atom/proc/create_reagents  (code/modules/reagents/chemistry/holder.dm:759)  may sleep
rt.def("/atom/proc/create_reagents", function* create_reagents(f: Frame, max_vol: Value) {
	f.vars = () => [max_vol];
	if (truthy(rt.sv(f, "reagents"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "reagents")]);
	}
	rt.setSv(f, "reagents", (yield* g.new_(f, T("/datum/reagents"), [live(max_vol)])));
	rt.setFv(f, "my_atom", rt.sv(f, "reagents"), live(f.src));
	return f.dot;
}, true);

// /proc/get_random_reagent_id  (code/modules/reagents/chemistry/holder.dm:765)
rt.def("/proc/get_random_reagent_id", function get_random_reagent_id(f: Frame) {
	let thing: Value = null, R: Value = null, picked_reagent: Value = null;
	let $e: any;
	f.vars = () => [thing, R, picked_reagent, $e];
	if (!truthy(rt.len(f, rt.gl("random_reagents")))) {
		thing = null;
		rt.forList(f, 0, subtract(rt.call(f, P("/proc/typesof"), null, [T("/datum/reagent")]), T("/datum/reagent")));
		while (($e = rt.next(f, 0)) !== undefined) {
			thing = $e;
			if (truthy(rt.initial(f, (R = live(thing)), "can_synth"))) {
				rt.modGl("random_reagents", rt.initial(f, live(R), "id"), add);
			}
		}
		rt.endFor(f, 0);
	}
	return (picked_reagent = rt.op(f, "PickUnweighted", [1], [rt.gl("random_reagents")]));
});
