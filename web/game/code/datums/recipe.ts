// From code/datums/recipe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(738, "/datum/recipe", "/datum", {
	reagents_list: null,
	items: null,
	result: null,
	time: 100,
});

// /datum/recipe/proc/check_reagents  (code/datums/recipe.dm:45)
rt.def("/datum/recipe/proc/check_reagents", function check_reagents(f: Frame, avail_reagents: Value) {
	let r_r: Value = null, aval_r_amnt: Value = null;
	let $0: any, $e: any;
	f.vars = () => [r_r, aval_r_amnt, $0, $e];
	f.dot = 1;
	r_r = null;
	rt.forList(f, 0, rt.sv(f, "reagents_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		r_r = $e;
		if (!rt.lt(rt.op(f, "Abs", [], [subtract((aval_r_amnt = rt.callName(f, live(avail_reagents), "get_reagent_amount", [live(r_r)])), rt.index(rt.sv(f, "reagents_list"), live(r_r)))]), 0.5)) {
			if (rt.gt(live(aval_r_amnt), rt.index(rt.sv(f, "reagents_list"), live(r_r)))) {
				f.dot = -1;
			} else {
				return 0;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "reagents_list"))) {
		$0 = rt.len(f, rt.sv(f, "reagents_list"));
	} else {
		$0 = 0;
	}
	if (rt.lt($0, rt.getLen(f, rt.fv(f, "reagent_list", live(avail_reagents))))) {
		return -1;
	}
	return live(f.dot);
});

// /datum/recipe/proc/check_items  (code/datums/recipe.dm:57)
rt.def("/datum/recipe/proc/check_items", function check_items(f: Frame, container: Value) {
	let checklist: Value = null, O: Value = null, found: Value = null, type: Value = null;
	let $e: any;
	f.vars = () => [checklist, O, found, type, $e];
	if (!truthy(rt.sv(f, "items"))) {
		if (truthy(rt.locateIn(f, T("/obj"), live(container)))) {
			return -1;
		} else {
			return 1;
		}
	}
	f.dot = 1;
	checklist = rt.callName(f, rt.sv(f, "items"), "Copy", []);
	O = null;
	rt.forList(f, 0, live(container), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		found = 0;
		type = null;
		rt.forList(f, 1, live(checklist));
		while (($e = rt.next(f, 1)) !== undefined) {
			type = $e;
			if (truthy(rt.op(f, "IsType", [], [live(O), live(type)]))) {
				(checklist = rt.modify(live(checklist), live(type), subtract));
				found = 1;
				break;
			}
		}
		rt.endFor(f, 1);
		if (!truthy(live(found))) {
			f.dot = -1;
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, live(checklist)))) {
		return 0;
	}
	return live(f.dot);
});

// /datum/recipe/proc/make  (code/datums/recipe.dm:79)  may sleep
rt.def("/datum/recipe/proc/make", function* make(f: Frame, container: Value) {
	let result_obj: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [container, result_obj, O, $e];
	result_obj = (yield* g.new_(f, rt.sv(f, "result"), [live(container)]));
	O = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(container)), live(result_obj)), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_to", [live(result_obj), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O)))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.fv(f, "reagents", live(container)), "clear_reagents", []);
	return live(result_obj);
}, true);

// /datum/recipe/proc/make_food  (code/datums/recipe.dm:88)  may sleep
rt.def("/datum/recipe/proc/make_food", function* make_food(f: Frame, container: Value) {
	let result_obj: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [container, result_obj, O, $e];
	result_obj = (yield* g.new_(f, rt.sv(f, "result"), [live(container)]));
	O = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(container)), live(result_obj)), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy(rt.fv(f, "reagents", live(O)))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(O)), "del_reagent", ["nutriment"]);
			yield* g.callName(f, rt.fv(f, "reagents", live(O)), "update_total", []);
			yield* g.callName(f, rt.fv(f, "reagents", live(O)), "trans_to", [live(result_obj), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(O)))]);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.fv(f, "reagents", live(container)), "clear_reagents", []);
	return live(result_obj);
}, true);

// /proc/select_recipe  (code/datums/recipe.dm:99)
rt.def("/proc/select_recipe", function select_recipe(f: Frame, avaiable_recipes: Value, obj: Value, exact: Value) {
	let possible_recipes: Value = null, recipe: Value = null, r_count: Value = null, i_count: Value = null, recipe_3: Value = null, N_i: Value = null, N_r: Value = null;
	let $0: any, $e: any;
	f.vars = () => [exact, possible_recipes, recipe, r_count, i_count, recipe_3, N_i, N_r, $0, $e];
	if (live(exact) === null) {
		exact = 1;
	}
	if (!truthy(live(exact))) {
		exact = -1;
	}
	possible_recipes = rt.new_(f, T("/list"), []);
	recipe = null;
	rt.forList(f, 0, live(avaiable_recipes), T("/datum/recipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		recipe = $e;
		if ((isEqual(rt.callName(f, live(recipe), "check_reagents", [rt.fv(f, "reagents", live(obj))]), live(exact)) && isEqual(rt.callName(f, live(recipe), "check_items", [live(obj)]), live(exact)))) {
			possible_recipes = rt.modify(live(possible_recipes), live(recipe), add);
		}
	}
	rt.endFor(f, 0);
	if (isEqual(rt.len(f, live(possible_recipes)), 0)) {
		return null;
	}
	if (isEqual(rt.len(f, live(possible_recipes)), 1)) {
		return rt.index(live(possible_recipes), 1);
	}
	r_count = 0;
	i_count = 0;
	f.dot = rt.index(live(possible_recipes), 1);
	recipe_3 = null;
	rt.forList(f, 0, live(possible_recipes), T("/datum/recipe"));
	while (($e = rt.next(f, 0)) !== undefined) {
		recipe_3 = $e;
		if (truthy(rt.fv(f, "items", live(recipe_3)))) {
			$0 = rt.getLen(f, rt.fv(f, "items", live(recipe_3)));
		} else {
			$0 = 0;
		}
		N_i = $0;
		if (truthy(rt.fv(f, "reagents_list", live(recipe_3)))) {
			$0 = rt.getLen(f, rt.fv(f, "reagents_list", live(recipe_3)));
		} else {
			$0 = 0;
		}
		N_r = $0;
		if ((rt.gt(live(N_i), live(i_count)) || (isEqual(live(N_i), live(i_count)) && rt.gt(live(N_r), live(r_count))))) {
			r_count = live(N_r);
			i_count = live(N_i);
			f.dot = live(recipe_3);
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
});
