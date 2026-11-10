// Based on /tg/station's code/modules/crafting/craft.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add, subtract, fmt } = rt;


rt.type(2292, "/datum/personal_crafting", "/datum", {
	busy: null,
	viewing_category: 1,
	viewing_subcategory: 1,
	categories: null,
	subcategories: null,
	button: null,
	display_craftable_only: 0,
	display_compact: 1,
});

// craft.dm:11
rt.def("/datum/personal_crafting/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.categories = list("Weaponry", "Robots", "Misc", "Tribal", "Foods");
	this.subcategories = list(list("Weapons", "Ammunition"), "", "", "", list("Breads", "Burgers", "Cakes", "Egg-Based Food", "Meats", "Misc. Food", "Pastries", "Pies", "Pizzas", "Salads", "Sandwiches", "Soups", "Spaghettis"));
	return f.dot;
});

// craft.dm:54
rt.def("/datum/personal_crafting/proc/check_contents", function check_contents(f: Frame, R: Value, contents: Value) {
	let A: Value = null, needed_amount: Value = null, B: Value = null;
	let $e: any;
	rt.forList(f, 0, R.reqs);
	loop3: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		needed_amount = rt.index(R.reqs, A);
		B = null;
		for (B of each(contents)) {
			if (ispath(B, A)) {
				if (rt.index(contents, B) >= rt.index(R.reqs, A)) {
					continue loop3;
				}
				needed_amount -= rt.index(contents, B);
				if (needed_amount <= 0) {
					continue loop3;
				}
				continue;
			}
		}
		return 0;
	}
	rt.endFor(f, 0);
	A = null;
	for (A of each(R.chem_catalysts)) {
		if (rt.index(contents, A) < rt.index(R.chem_catalysts, A)) {
			return 0;
		}
	}
	return 1;
});

// craft.dm:73
rt.def("/datum/personal_crafting/proc/get_environment", function get_environment(f: Frame, user: Value) {
	let I: Value = null, A: Value = null, _T: Value = null, B: Value = null, AM: Value = null;
	let $e: any;
	f.dot = list();
	for (I of each(user.held_items, T("/obj/item"))) {
		f.dot += I;
	}
	if (!isturf(user.loc)) {
		return f.dot;
	}
	let L: Value = block(rt.getStep(f, user, 10), rt.getStep(f, user, 5));
	for (A of each(L)) {
		if ((_T = A).Adjacent(user)) {
			B = null;
			for (B of each(_T)) {
				if ((AM = B).secondary_flags ? rt.index(AM.secondary_flags, "hologram") : 0) {
					continue;
				}
				f.dot += AM;
			}
		}
	}
	return f.dot;
});

// craft.dm:89
rt.def("/datum/personal_crafting/proc/get_surroundings", function get_surroundings(f: Frame, user: Value) {
	let I: Value = null, S: Value = null, RC: Value = null, A: Value = null;
	let $e: any;
	f.dot = list();
	for (I of each(this.get_environment(user), T("/obj/item"))) {
		if (I.secondary_flags ? rt.index(I.secondary_flags, "hologram") : 0) {
			continue;
		}
		if (rt.istype(I, T("/obj/item/stack"))) {
			S = I;
			rt.modAt(f.dot, I.type, S.amount, add);
		} else {
			if (rt.istype(I, T("/obj/item/weapon/reagent_containers"))) {
				if (rt.bitAnd((RC = I).container_type, OPENCONTAINER)) {
					A = null;
					for (A of each(RC.reagents.reagent_list, T("/datum/reagent"))) {
						rt.modAt(f.dot, A.type, A.volume, add);
					}
				}
			}
			rt.modAt(f.dot, I.type, 1, add);
		}
	}
	return f.dot;
});

// craft.dm:105
rt.def("/datum/personal_crafting/proc/check_tools", function check_tools(f: Frame, user: Value, R: Value, contents: Value) {
	let I: Value = null, SI: Value = null, A: Value = null, I_2: Value = null;
	let $e: any;
	if (!rt.len(f, R.tools)) {
		return 1;
	}
	let possible_tools: Value = list();
	for (I of each(user.contents, T("/obj/item"))) {
		if (rt.istype(I, T("/obj/item/weapon/storage"))) {
			SI = null;
			for (SI of each(I.contents, T("/obj/item"))) {
				possible_tools += SI.type;
			}
		}
		possible_tools += I.type;
	}
	possible_tools += contents;
	rt.forList(f, 0, R.tools);
	loop31: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		I_2 = null;
		for (I_2 of each(possible_tools)) {
			if (ispath(I_2, A)) {
				continue loop31;
			}
		}
		return 0;
	}
	rt.endFor(f, 0);
	return 1;
});

// craft.dm:124
rt.def("/datum/personal_crafting/proc/construct_item", function* construct_item(f: Frame, user: Value, R: Value) {
	let parts: Value = null, I: Value = null;
	let contents: Value = this.get_surroundings(user);
	let send_feedback: Value = 1;
	if (this.check_contents(R, contents)) {
		if (this.check_tools(user, R, contents)) {
			if (yield* do_after(user, R.time, { target: user })) {
				contents = this.get_surroundings(user);
				if (!this.check_contents(R, contents)) {
					return ", missing component.";
				}
				if (!this.check_tools(user, R, contents)) {
					return ", missing tool.";
				}
				parts = (yield* this.del_reqs(R, user));
				yield* (I = (yield* new_(R.result, rt.getStep(f, user.loc, 0)))).CheckParts(parts, R);
				return 0;
			}
			return ".";
		}
		return ", missing tool.";
	}
	return ", missing component.";
}, true);

// craft.dm:171
rt.def("/datum/personal_crafting/proc/del_reqs", function* del_reqs(f: Frame, R: Value, user: Value) {
	let surroundings: Value = null, data: Value = null, amt: Value = null, A: Value = null, RG: Value = null, RGNT: Value = null, RC: Value = null, S: Value = null, SD: Value = null, I: Value = null, M: Value = null, A_5: Value = null, RG_6: Value = null, ST: Value = null, AM: Value = null, DL: Value = null;
	let $e: any;
	let Deletion: Value = list();
	f.dot = list();
	rt.forList(f, 0, R.reqs);
	loop10: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		amt = rt.index(R.reqs, A);
		surroundings = this.get_environment(user);
		surroundings -= Deletion;
		if (ispath(A, T("/datum/reagent"))) {
			RG = (yield* new_(A));
			RGNT = null;
			while (amt > 0) {
				if (RG = (RC = rt.locateIn(f, T("/obj/item/weapon/reagent_containers"), surroundings)).reagents.get_reagent(A)) {
					if (!rt.locateIn(f, RG.type, Deletion)) {
						Deletion += (yield* new_(RG.type));
					}
					if (RG.volume > amt) {
						RG.volume -= amt;
						data = RG.data;
						yield* RC.reagents.conditional_update(RC);
						(RG = rt.locateIn(f, RG.type, Deletion)).volume = amt;
						RG.data += data;
						continue loop10;
					}
					surroundings -= RC;
					amt -= RG.volume;
					RC.reagents.reagent_list -= RG;
					yield* RC.reagents.conditional_update(RC);
					(RGNT = rt.locateIn(f, RG.type, Deletion)).volume += RG.volume;
					RGNT.data += RG.data;
					yield* qdel(RG);
				} else {
					surroundings -= RC;
				}
			}
		} else if (ispath(A, T("/obj/item/stack"))) {
			S = null;
			SD = null;
			while (amt > 0) {
				if ((S = rt.locateIn(f, A, surroundings)).amount >= amt) {
					if (!rt.locateIn(f, S.type, Deletion)) {
						Deletion += (SD = (yield* new_(S.type)));
					}
					yield* S.use(amt);
					(SD = rt.locateIn(f, S.type, Deletion)).amount += amt;
					continue loop10;
				}
				amt -= S.amount;
				if (!rt.locateIn(f, S.type, Deletion)) {
					Deletion += S;
				} else {
					data = S.amount;
					yield* g.callName(f, (S = rt.locateIn(f, S.type, Deletion)), "add", [data]);
				}
				surroundings -= S;
			}
		} else {
			I = null;
			while (amt > 0) {
				Deletion += (I = rt.locateIn(f, A, surroundings));
				surroundings -= I;
				amt--;
			}
		}
	}
	rt.endFor(f, 0);
	let partlist: Value = list(rt.len(f, R.parts));
	for (M of each(R.parts)) {
		rt.setAt(partlist, M, rt.index(R.parts, M));
	}
	for (A_5 of each(R.parts)) {
		if (rt.istype(A_5, T("/datum/reagent"))) {
			if ((RG_6 = rt.locateIn(f, A_5, Deletion)).volume > rt.index(partlist, A_5)) {
				RG_6.volume = rt.index(partlist, A_5);
			}
			f.dot += RG_6;
			Deletion -= RG_6;
			continue;
		} else if (rt.istype(A_5, T("/obj/item/stack"))) {
			if ((ST = rt.locateIn(f, A_5, Deletion)).amount > rt.index(partlist, A_5)) {
				ST.amount = rt.index(partlist, A_5);
			}
			f.dot += ST;
			Deletion -= ST;
			continue;
		} else {
			while (rt.index(partlist, A_5) > 0) {
				f.dot += (AM = rt.locateIn(f, A_5, Deletion));
				Deletion -= AM;
				(rt.modAt(partlist, A_5, 1, subtract));
			}
		}
	}
	while (rt.len(f, Deletion)) {
		DL = rt.index(Deletion, rt.len(f, Deletion));
		Deletion.Cut(rt.len(f, Deletion));
		yield* qdel(DL);
	}
	return f.dot;
}, true);

// craft.dm:268
rt.def("/datum/personal_crafting/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.not_incapacitated_turf_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "personal_crafting", "Crafting Menu", 700, 800, master_ui, state))).open();
	return f.dot;
}, true);

// craft.dm:275
rt.def("/datum/personal_crafting/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let rec: Value = null, R: Value = null;
	let data: Value = list();
	let subs: Value = list();
	let cur_subcategory: Value = "";
	let cur_category: Value = rt.index(this.categories, this.viewing_category);
	if (rt.istype(rt.index(this.subcategories, this.viewing_category), T("/list"))) {
		cur_subcategory = rt.index((subs = rt.index(this.subcategories, this.viewing_category)), this.viewing_subcategory);
	}
	rt.setAt(data, "busy", this.busy);
	rt.setAt(data, "prev_cat", rt.index(this.categories, this.prev_cat()));
	rt.setAt(data, "prev_subcat", rt.index(subs, this.prev_subcat()));
	rt.setAt(data, "category", cur_category);
	rt.setAt(data, "subcategory", cur_subcategory);
	rt.setAt(data, "next_cat", rt.index(this.categories, this.next_cat()));
	rt.setAt(data, "next_subcat", rt.index(subs, this.next_subcat()));
	rt.setAt(data, "display_craftable_only", this.display_craftable_only);
	rt.setAt(data, "display_compact", this.display_compact);
	let surroundings: Value = this.get_surroundings(user);
	let can_craft: Value = list();
	let cant_craft: Value = list();
	for (rec of each(GLOB.crafting_recipes)) {
		if ((R = rec).category != cur_category || R.subcategory != cur_subcategory) {
			continue;
		}
		if (this.check_contents(R, surroundings)) {
			can_craft += list(this.build_recipe_data(R));
		} else {
			cant_craft += list(this.build_recipe_data(R));
		}
	}
	rt.setAt(data, "can_craft", can_craft);
	rt.setAt(data, "cant_craft", cant_craft);
	return data;
});

// craft.dm:309
rt.def("/datum/personal_crafting/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let TR: Value = null, fail_msg: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "make") {
		TR = rt.locateIn(f, rt.at(params, "recipe"), rt.world());
		this.busy = 1;
		yield* this.ui_interact(f.usr);
		if (!(fail_msg = (yield* this.construct_item(f.usr, TR)))) {
			to_chat(f.usr, `<span class='notice'>${TR.name} constructed.</span>`);
		} else {
			to_chat(f.usr, `<span class='warning'>Construction failed${fail_msg}</span>`);
		}
		this.busy = 0;
		yield* this.ui_interact(f.usr);
	} else if (action === "forwardCat") {
		this.viewing_category = this.next_cat(0);
		f.dot = 1;
	} else if (action === "backwardCat") {
		this.viewing_category = this.prev_cat(0);
		f.dot = 1;
	} else if (action === "forwardSubCat") {
		this.viewing_subcategory = this.next_subcat();
		f.dot = 1;
	} else if (action === "backwardSubCat") {
		this.viewing_subcategory = this.prev_subcat();
		f.dot = 1;
	} else if (action === "toggle_recipes") {
		this.display_craftable_only = (!this.display_craftable_only ? 1 : 0);
		f.dot = 1;
	} else if (action === "toggle_compact") {
		this.display_compact = (!this.display_compact ? 1 : 0);
		f.dot = 1;
	}
	return f.dot;
}, true);

// craft.dm:345
rt.def("/datum/personal_crafting/proc/next_cat", function next_cat(f: Frame, readonly: Value) {
	readonly ??= 1;
	if (!readonly) {
		this.viewing_subcategory = 1;
	}
	f.dot = this.viewing_category % rt.len(f, this.categories) + 1;
	return f.dot;
});

// craft.dm:350
rt.def("/datum/personal_crafting/proc/next_subcat", function next_subcat(f: Frame) {
	if (!rt.istype(rt.index(this.subcategories, this.viewing_category), T("/list"))) return f.dot;
	let subs: Value = rt.index(this.subcategories, this.viewing_category);
	f.dot = this.viewing_subcategory % rt.len(f, subs) + 1;
	return f.dot;
});

// craft.dm:357
rt.def("/datum/personal_crafting/proc/prev_cat", function prev_cat(f: Frame, readonly: Value) {
	readonly ??= 1;
	if (!readonly) {
		this.viewing_subcategory = 1;
	}
	if (this.viewing_category == rt.len(f, this.categories)) {
		f.dot = this.viewing_category - 1;
	} else {
		f.dot = this.viewing_category % rt.len(f, this.categories) - 1;
	}
	if (!(f.dot <= 0)) return f.dot;
	f.dot = rt.len(f, this.categories);
	return f.dot;
});

// craft.dm:367
rt.def("/datum/personal_crafting/proc/prev_subcat", function prev_subcat(f: Frame) {
	let subs: Value = null;
	if (rt.istype(rt.index(this.subcategories, this.viewing_category), T("/list"))) {
		subs = rt.index(this.subcategories, this.viewing_category);
		if (this.viewing_subcategory == rt.len(f, subs)) {
			f.dot = this.viewing_subcategory - 1;
		} else {
			f.dot = this.viewing_subcategory % rt.len(f, subs) - 1;
		}
		if (f.dot <= 0) {
			f.dot = rt.len(f, subs);
		}
	} else {
		f.dot = null;
	}
	return f.dot;
});

// craft.dm:380
rt.def("/datum/personal_crafting/proc/build_recipe_data", function build_recipe_data(f: Frame, R: Value) {
	let data: Value = null, a: Value = null, A: Value = null;
	rt.setAt((data = list()), "name", R.name);
	rt.setAt(data, "ref", fmt("＃", [R]));
	let req_text: Value = "";
	let tool_text: Value = "";
	let catalyst_text: Value = "";
	for (a of each(R.reqs)) {
		A = a;
		req_text += ` ${rt.index(R.reqs, A)} ${rt.initial(f, A, "name")},`;
	}
	req_text = replacetext(req_text, ",", "", -1);
	rt.setAt(data, "req_text", req_text);
	a = null;
	for (a of each(R.chem_catalysts)) {
		A = a;
		catalyst_text += ` ${rt.index(R.chem_catalysts, A)} ${rt.initial(f, A, "name")},`;
	}
	catalyst_text = replacetext(catalyst_text, ",", "", -1);
	rt.setAt(data, "catalyst_text", catalyst_text);
	a = null;
	for (a of each(R.tools)) {
		A = a;
		tool_text += ` ${rt.index(R.tools, A)} ${rt.initial(f, A, "name")},`;
	}
	tool_text = replacetext(tool_text, ",", "", -1);
	rt.setAt(data, "tool_text", tool_text);
	return data;
});
