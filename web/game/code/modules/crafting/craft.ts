// From code/modules/crafting/craft.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/personal_crafting/proc/<init>  (code/modules/crafting/craft.dm:11)
rt.def("/datum/personal_crafting/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "categories", rt.list("Weaponry", "Robots", "Misc", "Tribal", "Foods"));
	rt.setSv(f, "subcategories", rt.list(rt.list("Weapons", "Ammunition"), "", "", "", rt.list("Breads", "Burgers", "Cakes", "Egg-Based Food", "Meats", "Misc. Food", "Pastries", "Pies", "Pizzas", "Salads", "Sandwiches", "Soups", "Spaghettis")));
	return f.dot;
});

// /datum/personal_crafting/proc/check_contents  (code/modules/crafting/craft.dm:54)
rt.def("/datum/personal_crafting/proc/check_contents", function check_contents(f: Frame, R: Value, contents: Value) {
	let A: Value = null, needed_amount: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [A, needed_amount, B, $e];
	A = null;
	rt.forList(f, 0, rt.fv(f, "reqs", live(R)));
	loop3: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		needed_amount = rt.index(rt.fv(f, "reqs", live(R)), live(A));
		B = null;
		rt.forList(f, 1, live(contents));
		while (($e = rt.next(f, 1)) !== undefined) {
			B = $e;
			if (truthy(rt.call(f, P("/proc/ispath"), null, [live(B), live(A)]))) {
				if (rt.ge(rt.index(live(contents), live(B)), rt.index(rt.fv(f, "reqs", live(R)), live(A)))) {
					continue loop3;
				}
				(needed_amount = rt.modify(live(needed_amount), rt.index(live(contents), live(B)), subtract));
				if (rt.le(live(needed_amount), 0)) {
					continue loop3;
				}
				continue;
			}
		}
		rt.endFor(f, 1);
		return 0;
	}
	rt.endFor(f, 0);
	A = null;
	rt.forList(f, 0, rt.fv(f, "chem_catalysts", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (rt.lt(rt.index(live(contents), live(A)), rt.index(rt.fv(f, "chem_catalysts", live(R)), live(A)))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/personal_crafting/proc/get_environment  (code/modules/crafting/craft.dm:73)
rt.def("/datum/personal_crafting/proc/get_environment", function get_environment(f: Frame, user: Value) {
	let I: Value = null, L: Value = null, A: Value = null, _T: Value = null, B: Value = null, AM: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, L, A, _T, B, AM, $0, $e];
	f.dot = rt.list();
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		f.dot = rt.modify(live(f.dot), live(I), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))]))) {
		return live(f.dot);
	}
	L = rt.call(f, P("/proc/block"), null, [rt.getStep(f, live(user), 10), rt.getStep(f, live(user), 5)]);
	A = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy(rt.callName(f, (_T = live(A)), "Adjacent", [live(user)]))) {
			B = null;
			rt.forList(f, 1, live(_T));
			while (($e = rt.next(f, 1)) !== undefined) {
				B = $e;
				if (truthy(rt.gv(f, "secondary_flags", (AM = live(B))))) {
					$0 = rt.index(rt.fv(f, "secondary_flags", live(AM)), "hologram");
				} else {
					$0 = 0;
				}
				if (truthy($0)) {
					continue;
				}
				f.dot = rt.modify(live(f.dot), live(AM), add);
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/personal_crafting/proc/get_surroundings  (code/modules/crafting/craft.dm:89)
rt.def("/datum/personal_crafting/proc/get_surroundings", function get_surroundings(f: Frame, user: Value) {
	let I: Value = null, S: Value = null, RC: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [I, S, RC, A, $0, $e];
	f.dot = rt.list();
	I = null;
	rt.forList(f, 0, rt.callSrc(f, "get_environment", [live(user)]), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.fv(f, "secondary_flags", live(I)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(I)), "hologram");
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			continue;
		}
		if (truthy((rt.istype(live(I), T("/obj/item/stack")) ? 1 : 0))) {
			S = live(I);
			rt.modAt(live(f.dot), rt.fv(f, "type", live(I)), rt.fv(f, "amount", live(S)), add);
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/reagent_containers")) ? 1 : 0))) {
				if (truthy(rt.bitAnd(rt.gv(f, "container_type", (RC = live(I))), 4096))) {
					A = null;
					rt.forList(f, 1, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(RC))), T("/datum/reagent"));
					while (($e = rt.next(f, 1)) !== undefined) {
						A = $e;
						rt.modAt(live(f.dot), rt.fv(f, "type", live(A)), rt.fv(f, "volume", live(A)), add);
					}
					rt.endFor(f, 1);
				}
			}
			rt.modAt(live(f.dot), rt.fv(f, "type", live(I)), 1, add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/personal_crafting/proc/check_tools  (code/modules/crafting/craft.dm:105)
rt.def("/datum/personal_crafting/proc/check_tools", function check_tools(f: Frame, user: Value, R: Value, contents: Value) {
	let possible_tools: Value = null, I: Value = null, SI: Value = null, A: Value = null, I_2: Value = null;
	let $e: any;
	f.vars = () => [possible_tools, I, SI, A, I_2, $e];
	if (!truthy(rt.getLen(f, rt.fv(f, "tools", live(R))))) {
		return 1;
	}
	possible_tools = rt.list();
	I = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(user)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			SI = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(I)), T("/obj/item"));
			while (($e = rt.next(f, 1)) !== undefined) {
				SI = $e;
				possible_tools = rt.modify(live(possible_tools), rt.fv(f, "type", live(SI)), add);
			}
			rt.endFor(f, 1);
		}
		possible_tools = rt.modify(live(possible_tools), rt.fv(f, "type", live(I)), add);
	}
	rt.endFor(f, 0);
	possible_tools = rt.modify(live(possible_tools), live(contents), add);
	A = null;
	rt.forList(f, 0, rt.fv(f, "tools", live(R)));
	loop31: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		I_2 = null;
		rt.forList(f, 1, live(possible_tools));
		while (($e = rt.next(f, 1)) !== undefined) {
			I_2 = $e;
			if (truthy(rt.call(f, P("/proc/ispath"), null, [live(I_2), live(A)]))) {
				continue loop31;
			}
		}
		rt.endFor(f, 1);
		return 0;
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/personal_crafting/proc/construct_item  (code/modules/crafting/craft.dm:124)  may sleep
rt.def("/datum/personal_crafting/proc/construct_item", function* construct_item(f: Frame, user: Value, R: Value) {
	let contents: Value = null, send_feedback: Value = null, parts: Value = null, I: Value = null;
	f.vars = () => [user, R, contents, send_feedback, parts, I];
	contents = (yield* g.srcCall(f, "get_surroundings", live(user)));
	send_feedback = 1;
	if (truthy((yield* g.srcCall(f, "check_contents", live(R), live(contents))))) {
		if (truthy((yield* g.srcCall(f, "check_tools", live(user), live(R), live(contents))))) {
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.fv(f, "time", live(R)), "target", live(user)], rt.Args.Named)))) {
				contents = (yield* g.srcCall(f, "get_surroundings", live(user)));
				if (!truthy((yield* g.srcCall(f, "check_contents", live(R), live(contents))))) {
					return ", missing component.";
				}
				if (!truthy((yield* g.srcCall(f, "check_tools", live(user), live(R), live(contents))))) {
					return ", missing tool.";
				}
				parts = (yield* g.srcCall(f, "del_reqs", live(R), live(user)));
				yield* g.callName(f, (I = (yield* g.new_(f, rt.fv(f, "result", live(R)), [rt.getStep(f, rt.fv(f, "loc", live(user)), 0)]))), "CheckParts", [live(parts), live(R)]);
				return 0;
			}
			return ".";
		}
		return ", missing tool.";
	}
	return ", missing component.";
}, true);

// /datum/personal_crafting/proc/del_reqs  (code/modules/crafting/craft.dm:171)  may sleep
rt.def("/datum/personal_crafting/proc/del_reqs", function* del_reqs(f: Frame, R: Value, user: Value) {
	let surroundings: Value = null, Deletion: Value = null, data: Value = null, amt: Value = null, A: Value = null, RG: Value = null, RGNT: Value = null, RC: Value = null, S: Value = null, SD: Value = null, I: Value = null, partlist: Value = null, M: Value = null, A_5: Value = null, RG_6: Value = null, ST: Value = null, AM: Value = null, DL: Value = null;
	let $e: any;
	f.vars = () => [R, user, surroundings, Deletion, data, amt, A, RG, RGNT, RC, S, SD, I, partlist, M, A_5, RG_6, ST, AM, DL, $e];
	surroundings = null;
	Deletion = rt.list();
	f.dot = rt.list();
	data = null;
	amt = null;
	A = null;
	rt.forList(f, 0, rt.fv(f, "reqs", live(R)));
	loop10: while (true) {
		if (($e = rt.next(f, 0)) === undefined) break;
		A = $e;
		amt = rt.index(rt.fv(f, "reqs", live(R)), live(A));
		surroundings = (yield* g.srcCall(f, "get_environment", live(user)));
		(surroundings = rt.modify(live(surroundings), live(Deletion), subtract));
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(A), T("/datum/reagent")])))) {
			RG = (yield* g.new_(f, live(A), []));
			RGNT = null;
			while (rt.gt(live(amt), 0)) {
				if (truthy((RG = (yield* g.callName(f, rt.gv(f, "reagents", (RC = rt.locateIn(f, T("/obj/item/weapon/reagent_containers"), live(surroundings)))), "get_reagent", [live(A)]))))) {
					if (!truthy(rt.locateIn(f, rt.fv(f, "type", live(RG)), live(Deletion)))) {
						Deletion = rt.modify(live(Deletion), (yield* g.new_(f, rt.fv(f, "type", live(RG)), [])), add);
					}
					if (rt.gt(rt.fv(f, "volume", live(RG)), live(amt))) {
						(rt.modField(f, live(RG), "volume", live(amt), subtract));
						data = rt.fv(f, "data", live(RG));
						yield* g.callName(f, rt.fv(f, "reagents", live(RC)), "conditional_update", [live(RC)]);
						rt.setFv(f, "volume", (RG = rt.locateIn(f, rt.fv(f, "type", live(RG)), live(Deletion))), live(amt));
						rt.modField(f, live(RG), "data", live(data), add);
						continue loop10;
					}
					(surroundings = rt.modify(live(surroundings), live(RC), subtract));
					(amt = rt.modify(live(amt), rt.fv(f, "volume", live(RG)), subtract));
					(rt.modField(f, rt.fv(f, "reagents", live(RC)), "reagent_list", live(RG), subtract));
					yield* g.callName(f, rt.fv(f, "reagents", live(RC)), "conditional_update", [live(RC)]);
					rt.modField(f, (RGNT = rt.locateIn(f, rt.fv(f, "type", live(RG)), live(Deletion))), "volume", rt.fv(f, "volume", live(RG)), add);
					rt.modField(f, live(RGNT), "data", rt.fv(f, "data", live(RG)), add);
					yield* g.call(f, P("/proc/qdel"), null, [live(RG)]);
				} else {
					(surroundings = rt.modify(live(surroundings), live(RC), subtract));
				}
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(A), T("/obj/item/stack")])))) {
				S = null;
				SD = null;
				while (rt.gt(live(amt), 0)) {
					if (rt.ge(rt.gv(f, "amount", (S = rt.locateIn(f, live(A), live(surroundings)))), live(amt))) {
						if (!truthy(rt.locateIn(f, rt.fv(f, "type", live(S)), live(Deletion)))) {
							Deletion = rt.modify(live(Deletion), (SD = (yield* g.new_(f, rt.fv(f, "type", live(S)), []))), add);
						}
						yield* g.callName(f, live(S), "use", [live(amt)]);
						rt.modField(f, (SD = rt.locateIn(f, rt.fv(f, "type", live(S)), live(Deletion))), "amount", live(amt), add);
						continue loop10;
					}
					(amt = rt.modify(live(amt), rt.fv(f, "amount", live(S)), subtract));
					if (!truthy(rt.locateIn(f, rt.fv(f, "type", live(S)), live(Deletion)))) {
						Deletion = rt.modify(live(Deletion), live(S), add);
					} else {
						data = rt.fv(f, "amount", live(S));
						yield* g.callName(f, (S = rt.locateIn(f, rt.fv(f, "type", live(S)), live(Deletion))), "add", [live(data)]);
					}
					(surroundings = rt.modify(live(surroundings), live(S), subtract));
				}
			} else {
				I = null;
				while (rt.gt(live(amt), 0)) {
					Deletion = rt.modify(live(Deletion), (I = rt.locateIn(f, live(A), live(surroundings))), add);
					(surroundings = rt.modify(live(surroundings), live(I), subtract));
					amt = rt.inc(live(amt), -1);
				}
			}
		}
	}
	rt.endFor(f, 0);
	partlist = rt.list(rt.getLen(f, rt.fv(f, "parts", live(R))));
	M = null;
	rt.forList(f, 0, rt.fv(f, "parts", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.setAt(live(partlist), live(M), rt.index(rt.fv(f, "parts", live(R)), live(M)));
	}
	rt.endFor(f, 0);
	A_5 = null;
	rt.forList(f, 0, rt.fv(f, "parts", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		A_5 = $e;
		if (truthy((rt.istype(live(A_5), T("/datum/reagent")) ? 1 : 0))) {
			if (rt.gt(rt.gv(f, "volume", (RG_6 = rt.locateIn(f, live(A_5), live(Deletion)))), rt.index(live(partlist), live(A_5)))) {
				rt.setFv(f, "volume", live(RG_6), rt.index(live(partlist), live(A_5)));
			}
			f.dot = rt.modify(live(f.dot), live(RG_6), add);
			(Deletion = rt.modify(live(Deletion), live(RG_6), subtract));
			continue;
		} else {
			if (truthy((rt.istype(live(A_5), T("/obj/item/stack")) ? 1 : 0))) {
				if (rt.gt(rt.gv(f, "amount", (ST = rt.locateIn(f, live(A_5), live(Deletion)))), rt.index(live(partlist), live(A_5)))) {
					rt.setFv(f, "amount", live(ST), rt.index(live(partlist), live(A_5)));
				}
				f.dot = rt.modify(live(f.dot), live(ST), add);
				(Deletion = rt.modify(live(Deletion), live(ST), subtract));
				continue;
			} else {
				while (rt.gt(rt.index(live(partlist), live(A_5)), 0)) {
					f.dot = rt.modify(live(f.dot), (AM = rt.locateIn(f, live(A_5), live(Deletion))), add);
					(Deletion = rt.modify(live(Deletion), live(AM), subtract));
					(rt.modAt(live(partlist), live(A_5), 1, subtract));
				}
			}
		}
	}
	rt.endFor(f, 0);
	while (truthy(rt.len(f, live(Deletion)))) {
		DL = rt.index(live(Deletion), rt.len(f, live(Deletion)));
		yield* g.callName(f, live(Deletion), "Cut", [rt.len(f, live(Deletion))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(DL)]);
	}
	return f.dot;
}, true);

// /datum/personal_crafting/proc/ui_interact  (code/modules/crafting/craft.dm:268)  may sleep
rt.def("/datum/personal_crafting/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("not_incapacitated_turf_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "personal_crafting", "Crafting Menu", 700, 800, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /datum/personal_crafting/proc/ui_data  (code/modules/crafting/craft.dm:275)
rt.def("/datum/personal_crafting/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, subs: Value = null, cur_subcategory: Value = null, cur_category: Value = null, surroundings: Value = null, can_craft: Value = null, cant_craft: Value = null, rec: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [data, subs, cur_subcategory, cur_category, surroundings, can_craft, cant_craft, rec, R, $e];
	data = rt.list();
	subs = rt.list();
	cur_subcategory = "";
	cur_category = rt.index(rt.sv(f, "categories"), rt.sv(f, "viewing_category"));
	if (truthy((rt.istype(rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category")), T("/list")) ? 1 : 0))) {
		cur_subcategory = rt.index((subs = rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category"))), rt.sv(f, "viewing_subcategory"));
	}
	rt.setAt(live(data), "busy", rt.sv(f, "busy"));
	rt.setAt(live(data), "prev_cat", rt.index(rt.sv(f, "categories"), rt.callSrc(f, "prev_cat", [])));
	rt.setAt(live(data), "prev_subcat", rt.index(live(subs), rt.callSrc(f, "prev_subcat", [])));
	rt.setAt(live(data), "category", live(cur_category));
	rt.setAt(live(data), "subcategory", live(cur_subcategory));
	rt.setAt(live(data), "next_cat", rt.index(rt.sv(f, "categories"), rt.callSrc(f, "next_cat", [])));
	rt.setAt(live(data), "next_subcat", rt.index(live(subs), rt.callSrc(f, "next_subcat", [])));
	rt.setAt(live(data), "display_craftable_only", rt.sv(f, "display_craftable_only"));
	rt.setAt(live(data), "display_compact", rt.sv(f, "display_compact"));
	surroundings = rt.callSrc(f, "get_surroundings", [live(user)]);
	can_craft = rt.list();
	cant_craft = rt.list();
	rec = null;
	rt.forList(f, 0, rt.gl("crafting_recipes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rec = $e;
		if ((!isEqual(rt.gv(f, "category", (R = live(rec))), live(cur_category)) || !isEqual(rt.fv(f, "subcategory", live(R)), live(cur_subcategory)))) {
			continue;
		}
		if (truthy(rt.callSrc(f, "check_contents", [live(R), live(surroundings)]))) {
			can_craft = rt.modify(live(can_craft), rt.list(rt.callSrc(f, "build_recipe_data", [live(R)])), add);
		} else {
			cant_craft = rt.modify(live(cant_craft), rt.list(rt.callSrc(f, "build_recipe_data", [live(R)])), add);
		}
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "can_craft", live(can_craft));
	rt.setAt(live(data), "cant_craft", live(cant_craft));
	return live(data);
});

// /datum/personal_crafting/proc/ui_act  (code/modules/crafting/craft.dm:309)  may sleep
rt.def("/datum/personal_crafting/proc/ui_act", function* ui_act(f: Frame) {
	let TR: Value = null, fail_msg: Value = null;
	let $0: any;
	f.vars = () => [TR, fail_msg, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "make") {
		TR = rt.locateIn(f, rt.at(live(f.args[1]), "recipe"), rt.world());
		rt.setSv(f, "busy", 1);
		yield* g.srcCall(f, "ui_interact", live(f.usr));
		if (!truthy((fail_msg = (yield* g.srcCall(f, "construct_item", live(f.usr), live(TR)))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＀ constructed.</span>", [rt.fv(f, "name", live(TR))])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>Construction failed＀</span>", [live(fail_msg)])]);
		}
		rt.setSv(f, "busy", 0);
		yield* g.srcCall(f, "ui_interact", live(f.usr));
	} else if ($0 === "forwardCat") {
		rt.setSv(f, "viewing_category", (yield* g.srcCall(f, "next_cat", 0)));
		f.dot = 1;
	} else if ($0 === "backwardCat") {
		rt.setSv(f, "viewing_category", (yield* g.srcCall(f, "prev_cat", 0)));
		f.dot = 1;
	} else if ($0 === "forwardSubCat") {
		rt.setSv(f, "viewing_subcategory", (yield* g.srcCall(f, "next_subcat")));
		f.dot = 1;
	} else if ($0 === "backwardSubCat") {
		rt.setSv(f, "viewing_subcategory", (yield* g.srcCall(f, "prev_subcat")));
		f.dot = 1;
	} else if ($0 === "toggle_recipes") {
		rt.setSv(f, "display_craftable_only", (!truthy(rt.sv(f, "display_craftable_only")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "toggle_compact") {
		rt.setSv(f, "display_compact", (!truthy(rt.sv(f, "display_compact")) ? 1 : 0));
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/personal_crafting/proc/next_cat  (code/modules/crafting/craft.dm:345)
rt.def("/datum/personal_crafting/proc/next_cat", function next_cat(f: Frame, readonly: Value) {
	f.vars = () => [readonly];
	if (live(readonly) === null) {
		readonly = 1;
	}
	if (!truthy(live(readonly))) {
		rt.setSv(f, "viewing_subcategory", 1);
	}
	f.dot = add(rt.modulus(rt.sv(f, "viewing_category"), rt.len(f, rt.sv(f, "categories"))), 1);
	return f.dot;
});

// /datum/personal_crafting/proc/next_subcat  (code/modules/crafting/craft.dm:350)
rt.def("/datum/personal_crafting/proc/next_subcat", function next_subcat(f: Frame) {
	let subs: Value = null;
	f.vars = () => [subs];
	if (!truthy((rt.istype(rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category")), T("/list")) ? 1 : 0))) return f.dot;
	subs = rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category"));
	f.dot = add(rt.modulus(rt.sv(f, "viewing_subcategory"), rt.len(f, live(subs))), 1);
	return f.dot;
});

// /datum/personal_crafting/proc/prev_cat  (code/modules/crafting/craft.dm:357)
rt.def("/datum/personal_crafting/proc/prev_cat", function prev_cat(f: Frame, readonly: Value) {
	f.vars = () => [readonly];
	if (live(readonly) === null) {
		readonly = 1;
	}
	if (!truthy(live(readonly))) {
		rt.setSv(f, "viewing_subcategory", 1);
	}
	if (isEqual(rt.sv(f, "viewing_category"), rt.len(f, rt.sv(f, "categories")))) {
		f.dot = subtract(rt.sv(f, "viewing_category"), 1);
	} else {
		f.dot = subtract(rt.modulus(rt.sv(f, "viewing_category"), rt.len(f, rt.sv(f, "categories"))), 1);
	}
	if (!rt.le(live(f.dot), 0)) return f.dot;
	f.dot = rt.len(f, rt.sv(f, "categories"));
	return f.dot;
});

// /datum/personal_crafting/proc/prev_subcat  (code/modules/crafting/craft.dm:367)
rt.def("/datum/personal_crafting/proc/prev_subcat", function prev_subcat(f: Frame) {
	let subs: Value = null;
	f.vars = () => [subs];
	if (truthy((rt.istype(rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category")), T("/list")) ? 1 : 0))) {
		subs = rt.index(rt.sv(f, "subcategories"), rt.sv(f, "viewing_category"));
		if (isEqual(rt.sv(f, "viewing_subcategory"), rt.len(f, live(subs)))) {
			f.dot = subtract(rt.sv(f, "viewing_subcategory"), 1);
		} else {
			f.dot = subtract(rt.modulus(rt.sv(f, "viewing_subcategory"), rt.len(f, live(subs))), 1);
		}
		if (rt.le(live(f.dot), 0)) {
			f.dot = rt.len(f, live(subs));
		}
	} else {
		f.dot = null;
	}
	return f.dot;
});

// /datum/personal_crafting/proc/build_recipe_data  (code/modules/crafting/craft.dm:380)
rt.def("/datum/personal_crafting/proc/build_recipe_data", function build_recipe_data(f: Frame, R: Value) {
	let data: Value = null, req_text: Value = null, tool_text: Value = null, catalyst_text: Value = null, a: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [data, req_text, tool_text, catalyst_text, a, A, $e];
	rt.setAt((data = rt.list()), "name", rt.fv(f, "name", live(R)));
	rt.setAt(live(data), "ref", fmt("＃", [live(R)]));
	req_text = "";
	tool_text = "";
	catalyst_text = "";
	a = null;
	rt.forList(f, 0, rt.fv(f, "reqs", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		A = live(a);
		req_text = rt.modify(live(req_text), fmt(" ＀ ＀,", [rt.index(rt.fv(f, "reqs", live(R)), live(A)), rt.initial(f, live(A), "name")]), add);
	}
	rt.endFor(f, 0);
	req_text = rt.call(f, P("/proc/replacetext"), null, [live(req_text), ",", "", -1]);
	rt.setAt(live(data), "req_text", live(req_text));
	a = null;
	rt.forList(f, 0, rt.fv(f, "chem_catalysts", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		A = live(a);
		catalyst_text = rt.modify(live(catalyst_text), fmt(" ＀ ＀,", [rt.index(rt.fv(f, "chem_catalysts", live(R)), live(A)), rt.initial(f, live(A), "name")]), add);
	}
	rt.endFor(f, 0);
	catalyst_text = rt.call(f, P("/proc/replacetext"), null, [live(catalyst_text), ",", "", -1]);
	rt.setAt(live(data), "catalyst_text", live(catalyst_text));
	a = null;
	rt.forList(f, 0, rt.fv(f, "tools", live(R)));
	while (($e = rt.next(f, 0)) !== undefined) {
		a = $e;
		A = live(a);
		tool_text = rt.modify(live(tool_text), fmt(" ＀ ＀,", [rt.index(rt.fv(f, "tools", live(R)), live(A)), rt.initial(f, live(A), "name")]), add);
	}
	rt.endFor(f, 0);
	tool_text = rt.call(f, P("/proc/replacetext"), null, [live(tool_text), ",", "", -1]);
	rt.setAt(live(data), "tool_text", live(tool_text));
	return live(data);
});
