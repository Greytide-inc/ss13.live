// Based on /tg/station's code/datums/recipe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(738, "/datum/recipe", "/datum", {
	reagents_list: null,
	items: null,
	result: null,
	time: 100,
});

// recipe.dm:45
rt.def("/datum/recipe/proc/check_reagents", function check_reagents(f: Frame, avail_reagents: Value) {
	let r_r: Value = null, aval_r_amnt: Value = null;
	let $e: any;
	f.dot = 1;
	for (r_r of each(this.reagents_list)) {
		if (!(rt.op(f, "Abs", [], [(aval_r_amnt = avail_reagents.get_reagent_amount(r_r)) - rt.index(this.reagents_list, r_r)]) < 0.5)) {
			if (aval_r_amnt > rt.index(this.reagents_list, r_r)) {
				f.dot = -1;
			} else {
				return 0;
			}
		}
	}
	if ((this.reagents_list ? rt.len(f, this.reagents_list) : 0) < rt.len(f, avail_reagents.reagent_list)) {
		return -1;
	}
	return f.dot;
});

// recipe.dm:57
rt.def("/datum/recipe/proc/check_items", function check_items(f: Frame, container: Value) {
	let O: Value = null, found: Value = null, type: Value = null;
	if (!this.items) {
		if (rt.locateIn(f, T("/obj"), container)) {
			return -1;
		} else {
			return 1;
		}
	}
	f.dot = 1;
	let checklist: Value = this.items.Copy();
	for (O of each(container, T("/obj"))) {
		found = 0;
		type = null;
		for (type of each(checklist)) {
			if (rt.op(f, "IsType", [], [O, type])) {
				checklist -= type;
				found = 1;
				break;
			}
		}
		if (!found) {
			f.dot = -1;
		}
	}
	if (rt.len(f, checklist)) {
		return 0;
	}
	return f.dot;
});

// recipe.dm:79
rt.def("/datum/recipe/proc/make", function* make(f: Frame, container: Value) {
	let O: Value = null;
	let result_obj: Value = (yield* new_(this.result, container));
	for (O of each(container.contents - result_obj, T("/obj"))) {
		yield* O.reagents.trans_to(result_obj, O.reagents.total_volume);
		yield* qdel(O);
	}
	yield* container.reagents.clear_reagents();
	return result_obj;
}, true);

// recipe.dm:99
rt.def("/proc/select_recipe", function select_recipe(f: Frame, avaiable_recipes: Value, obj: Value, exact: Value) {
	let recipe: Value = null, recipe_3: Value = null, N_i: Value = null, N_r: Value = null;
	let $0: any, $e: any;
	exact ??= 1;
	if (!exact) {
		exact = -1;
	}
	let possible_recipes: Value = new_(T("/list"));
	for (recipe of each(avaiable_recipes, T("/datum/recipe"))) {
		if (recipe.check_reagents(obj.reagents) == exact && recipe.check_items(obj) == exact) {
			possible_recipes += recipe;
		}
	}
	if (rt.len(f, possible_recipes) == 0) {
		return null;
	}
	if (rt.len(f, possible_recipes) == 1) {
		return rt.index(possible_recipes, 1);
	}
	let r_count: Value = 0;
	let i_count: Value = 0;
	f.dot = rt.index(possible_recipes, 1);
	for (recipe_3 of each(possible_recipes, T("/datum/recipe"))) {
		if (recipe_3.items) {
			$0 = rt.len(f, recipe_3.items);
		} else {
			$0 = 0;
		}
		N_i = $0;
		if (recipe_3.reagents_list) {
			$0 = rt.len(f, recipe_3.reagents_list);
		} else {
			$0 = 0;
		}
		N_r = $0;
		if (N_i > i_count || N_i == i_count && N_r > r_count) {
			r_count = N_r;
			i_count = N_i;
			f.dot = recipe_3;
		}
	}
	return f.dot;
});
