// From code/game/objects/items/stacks/stack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8968, "/obj/item/stack", "/obj/item", {
	recipes: null,
	singular_name: null,
	amount: 1,
	max_amount: 50,
	is_cyborg: 0,
	source: null,
	cost: 1,
	merge_type: null,
	full_w_class: 3,
	novariants: 1,
	origin_tech: "materials=1",
	gender: "plural",
});

// /obj/item/stack/proc/Initialize  (code/game/objects/items/stacks/stack.dm:25)  may sleep
rt.def("/obj/item/stack/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "amount", live(f.args[1]));
	}
	if (!truthy(rt.sv(f, "merge_type"))) {
		rt.setSv(f, "merge_type", rt.sv(f, "type"));
	}
	if (truthy(live(f.args[2]))) {
		S = null;
		rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item/stack"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (isEqual(rt.fv(f, "merge_type", live(S)), rt.sv(f, "merge_type"))) {
				yield* g.srcCall(f, "merge", live(S));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "update_weight");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload", "new_amount", "merge"] });

// /obj/item/stack/proc/update_weight  (code/game/objects/items/stacks/stack.dm:38)
rt.def("/obj/item/stack/proc/update_weight", function update_weight(f: Frame) {
	if (rt.le(rt.sv(f, "amount"), multiply(rt.sv(f, "max_amount"), 0.3333333432674408))) {
		rt.setSv(f, "w_class", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "full_w_class"), 2), rt.sv(f, "full_w_class")])]));
	} else {
		if (rt.le(rt.sv(f, "amount"), multiply(rt.sv(f, "max_amount"), 0.6666666865348816))) {
			rt.setSv(f, "w_class", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [subtract(rt.sv(f, "full_w_class"), 1), rt.sv(f, "full_w_class")])]));
		} else {
			rt.setSv(f, "w_class", rt.sv(f, "full_w_class"));
		}
	}
	return f.dot;
});

// /obj/item/stack/proc/update_icon  (code/game/objects/items/stacks/stack.dm:47)
rt.def("/obj/item/stack/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "novariants"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	if (rt.le(rt.sv(f, "amount"), multiply(rt.sv(f, "max_amount"), 0.3333333432674408))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		if (rt.le(rt.sv(f, "amount"), multiply(rt.sv(f, "max_amount"), 0.6666666865348816))) {
			rt.setSv(f, "icon_state", fmt("＀_2", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀_3", [rt.initial(f, live(f.src), "icon_state")]));
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/stack/proc/Destroy  (code/game/objects/items/stacks/stack.dm:58)  may sleep
rt.def("/obj/item/stack/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(live(f.usr)) && isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src)))) {
		yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/stack/proc/examine  (code/game/objects/items/stacks/stack.dm:63)
rt.def("/obj/item/stack/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "is_cyborg"))) {
		if (truthy(rt.fv(f, "singular_name", live(f.src)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is enough energy for ＀ ＀５.", [rt.callName(f, live(f.src), "get_amount", []), rt.fv(f, "singular_name", live(f.src))])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is enough energy for ＀.", [rt.callName(f, live(f.src), "get_amount", [])])]);
		}
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "singular_name", live(f.src)))) {
		if (rt.gt(rt.callName(f, live(f.src), "get_amount", []), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are ＀ ＀５ in the stack.", [rt.callName(f, live(f.src), "get_amount", []), rt.fv(f, "singular_name", live(f.src))])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is ＀ ＀ in the stack.", [rt.callName(f, live(f.src), "get_amount", []), rt.fv(f, "singular_name", live(f.src))])]);
		}
	} else {
		if (rt.gt(rt.callName(f, live(f.src), "get_amount", []), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are ＀ in the stack.", [rt.callName(f, live(f.src), "get_amount", [])])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is ＀ in the stack.", [rt.callName(f, live(f.src), "get_amount", [])])]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/stack/proc/get_amount  (code/game/objects/items/stacks/stack.dm:82)
rt.def("/obj/item/stack/proc/get_amount", function get_amount(f: Frame) {
	if (truthy(rt.sv(f, "is_cyborg"))) {
		f.dot = rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "energy", rt.sv(f, "source")), rt.sv(f, "cost"))]);
	} else {
		f.dot = rt.sv(f, "amount");
	}
	return f.dot;
});

// /obj/item/stack/proc/attack_self  (code/game/objects/items/stacks/stack.dm:87)  may sleep
rt.def("/obj/item/stack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/stack/proc/interact  (code/game/objects/items/stacks/stack.dm:90)  may sleep
// tg_js: opens the `stack` tgui window instead of a hand-built HTML page (the recipe list is built in ui_data).
rt.def("/obj/item/stack/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "recipes"))) {
		return live(f.dot);
	}
	if ((!truthy(live(f.src)) || rt.le((yield* g.srcCall(f, "get_amount")), 0))) {
		yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/item/stack/proc/ui_interact  (tg_js, after modern tg's stack.dm)  may sleep
rt.def("/obj/item/stack/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "stack", rt.sv(f, "name"), 420, 500, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/stack/proc/ui_data  (tg_js)  may sleep
// amount, singular, recipes: one entry per recipe slot in order. A null slot (a divider in the old page) is {sep: 1};
// a recipe is {index, title, cost, can_build, multipliers: [{n, label}]} with the same multiplier rules as the old page (5, 10, 25, max).
rt.def("/obj/item/stack/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, list: Value = null, E: Value = null, R: Value = null, mults: Value = null, M: Value = null;
	f.vars = () => [user, data, list, E, R, mults, M];
	data = rt.list();
	list = rt.list();
	const amount = Number(yield* g.callName(f, live(f.src), "get_amount", []));
	rt.setAt(live(data), "amount", amount);
	rt.setAt(live(data), "singular", truthy(rt.fv(f, "singular_name", live(f.src))) ? fmt("＀", [rt.fv(f, "singular_name", live(f.src))]) : "sheet");
	const n = Number(rt.len(f, rt.sv(f, "recipes")));
	for (let i = 1; i <= n; i++) {
		E = rt.list();
		R = rt.index(rt.sv(f, "recipes"), i);
		if (R === null) {
			rt.setAt(live(E), "sep", 1);
			rt.modify(live(list), rt.list(live(E)), add);
			continue;
		}
		const req = Number(rt.fv(f, "req_amount", live(R))), res = Number(rt.fv(f, "res_amount", live(R))), maxres = Number(rt.fv(f, "max_res_amount", live(R)));
		let max_multiplier = Math.floor(amount / req);
		rt.setAt(live(E), "index", i);
		rt.setAt(live(E), "title", res > 1 ? fmt("＀x ＀５", [res, rt.fv(f, "title", live(R))]) : fmt("＀", [rt.fv(f, "title", live(R))]));
		rt.setAt(live(E), "cost", req);
		rt.setAt(live(E), "can_build", max_multiplier > 0 ? 1 : 0);
		mults = rt.list();
		if (maxres > 1 && max_multiplier > 1) {
			max_multiplier = Math.min(max_multiplier, Math.floor(maxres / res));
			const ms = [5, 10, 25];
			const shown = ms.filter((m) => max_multiplier >= m);
			if (!ms.includes(max_multiplier)) shown.push(max_multiplier);
			for (const m of shown) {
				M = rt.list();
				rt.setAt(live(M), "n", m);
				rt.setAt(live(M), "label", m * res);
				rt.modify(live(mults), rt.list(live(M)), add);
			}
		}
		rt.setAt(live(E), "multipliers", live(mults));
		rt.modify(live(list), rt.list(live(E)), add);
	}
	rt.setAt(live(data), "recipes", live(list));
	return live(data);
}, true);

// /obj/item/stack/proc/ui_act  (tg_js)  may sleep
// Building goes through the old Topic (restrained/stat/active-hand checks, building_checks, build time, one-per-turf, on-floor, the result).
rt.def("/obj/item/stack/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "make") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["make", fmt("＀", [rt.at(live(params), "id")]), "multiplier", fmt("＀", [rt.at(live(params), "multiplier")])]));
	} else {
		return 0;
	}
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/item/stack/proc/Topic  (code/game/objects/items/stacks/stack.dm:133)  may sleep
rt.def("/obj/item/stack/proc/Topic", function* Topic(f: Frame) {
	let R: Value = null, multiplier: Value = null, O: Value = null, W: Value = null, new_item: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [R, multiplier, O, W, new_item, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy((yield* g.callName(f, live(f.usr), "restrained", []))) || truthy(rt.fv(f, "stat", live(f.usr)))) || !isEqual((yield* g.callName(f, live(f.usr), "get_active_held_item", [])), live(f.src)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "make"))) {
		if (rt.lt((yield* g.callName(f, live(f.src), "get_amount", [])), 1)) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		// tg_js, 2017 tg's own hole: the slot and the multiplier came from the href unchecked (a slot of 0, past the end or a divider runtimed, 8.5 built slot 8,
		// a multiplier of 1.5 took 1.5 sheets, x5 on a one-off recipe wasted sheets, tiles x21 made a stack of 84). Whole numbers, a real recipe, and one that fits a stack.
		const mkN = live(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "make")]));
		if (typeof mkN !== "number" || !Number.isInteger(mkN) || mkN < 1 || mkN > Number(rt.len(f, rt.sv(f, "recipes")))) {
			return live(f.dot);
		}
		R = rt.index(rt.sv(f, "recipes"), mkN);
		if (!truthy((rt.istype(live(R), T("/datum/stack_recipe")) ? 1 : 0))) {
			return live(f.dot);
		}
		if ((!truthy((multiplier = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "multiplier")])))) || rt.le(live(multiplier), 0))) {
			return live(f.dot);
		}
		const mulN = live(multiplier), maxRes = Number(rt.fv(f, "max_res_amount", live(R))), resAmt = Number(rt.fv(f, "res_amount", live(R)));
		if (typeof mulN !== "number" || !Number.isInteger(mulN) || (maxRes > 1 ? resAmt * mulN > maxRes : mulN !== 1)) {
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "building_checks", live(R), live(multiplier))))) {
			return live(f.dot);
		}
		if (truthy(rt.fv(f, "time", live(R)))) {
			yield* g.callName(f, live(f.usr), "visible_message", [fmt("<span class='notice'>＀ starts building ＀.</span>", [live(f.usr), rt.fv(f, "title", live(R))]), fmt("<span class='notice'>You start building ＀...</span>", [rt.fv(f, "title", live(R))])]);
			if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.usr), null, rt.fv(f, "time", live(R)), "target", live(f.usr)], rt.Args.Named)))) {
				return live(f.dot);
			}
			if (!truthy((yield* g.srcCall(f, "building_checks", live(R), live(multiplier))))) {
				return live(f.dot);
			}
		}
		yield* g.callName(f, (O = (yield* g.new_(f, rt.fv(f, "result_type", live(R)), [rt.fv(f, "loc", live(f.usr))]))), "setDir", [rt.fv(f, "dir", live(f.usr))]);
		yield* g.srcCall(f, "use", multiply(rt.fv(f, "req_amount", live(R)), live(multiplier)));
		if (truthy((rt.istype(live(O), T("/obj/structure/windoor_assembly")) ? 1 : 0))) {
			rt.setFv(f, "ini_dir", (W = live(O)), rt.fv(f, "dir", live(W)));
		} else {
			if (truthy((rt.istype(live(O), T("/obj/structure/window")) ? 1 : 0))) {
				rt.setFv(f, "ini_dir", (W = live(O)), rt.fv(f, "dir", live(W)));
			}
		}
		if (rt.gt(rt.fv(f, "max_res_amount", live(R)), 1)) {
			rt.setFv(f, "amount", (new_item = live(O)), multiply(rt.fv(f, "res_amount", live(R)), live(multiplier)));
			yield* g.callName(f, live(new_item), "update_icon", []);
			if (rt.le(rt.fv(f, "amount", live(new_item)), 0)) {
				return live(f.dot);
			}
		}
		if (truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0))) {
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(O)]);
		}
		yield* g.callName(f, live(O), "add_fingerprint", [live(f.usr)]);
		if (truthy((rt.istype(live(O), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			I = null;
			rt.forList(f, 0, live(O), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
			}
			rt.endFor(f, 0);
		}
	}
	if (!(truthy(live(f.src)) && isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/interact"), live(f.usr)])), 0]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/stack/proc/building_checks  (code/game/objects/items/stacks/stack.dm:188)
rt.def("/obj/item/stack/proc/building_checks", function building_checks(f: Frame, R: Value, multiplier: Value) {
	if (rt.lt(rt.callName(f, live(f.src), "get_amount", []), multiply(rt.fv(f, "req_amount", live(R)), live(multiplier)))) {
		if (rt.gt(multiply(rt.fv(f, "req_amount", live(R)), live(multiplier)), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You haven't got enough ＀ to build ％！ ＀５!</span>", [live(f.src), multiply(rt.fv(f, "req_amount", live(R)), live(multiplier)), rt.fv(f, "title", live(R))])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You haven't got enough ＀ to build ％！!</span>", [live(f.src), rt.fv(f, "title", live(R))])]);
		}
		return 0;
	}
	if ((truthy(rt.fv(f, "window_checks", live(R))) && !truthy(rt.call(f, P("/proc/valid_window_location"), null, [rt.fv(f, "loc", live(f.usr)), rt.fv(f, "dir", live(f.usr))])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>The ＀ won't fit here!</span>", [rt.fv(f, "title", live(R))])]);
		return 0;
	}
	if ((truthy(rt.fv(f, "one_per_turf", live(R))) && truthy(rt.locateIn(f, rt.fv(f, "result_type", live(R)), rt.fv(f, "loc", live(f.usr)))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>There is another ＀ here!</span>", [rt.fv(f, "title", live(R))])]);
		return 0;
	}
	if ((truthy(rt.fv(f, "on_floor", live(R))) && !truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/turf/open/floor")) ? 1 : 0)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＄！ must be constructed on the floor!</span>", [rt.fv(f, "title", live(R))])]);
		return 0;
	}
	return 1;
});

// /obj/item/stack/proc/use  (code/game/objects/items/stacks/stack.dm:206)  may sleep
rt.def("/obj/item/stack/proc/use", function* use(f: Frame, used: Value) {
	f.vars = () => [used];
	if (truthy((yield* g.srcCall(f, "zero_amount")))) {
		return 0;
	}
	if (truthy(rt.sv(f, "is_cyborg"))) {
		return (yield* g.callName(f, rt.sv(f, "source"), "use_charge", [multiply(live(used), rt.sv(f, "cost"))]));
	}
	if (rt.lt(rt.sv(f, "amount"), live(used))) {
		return 0;
	}
	(rt.modSrcVar(f, "amount", live(used), subtract));
	yield* g.srcCall(f, "zero_amount");
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "update_weight");
	return 1;
}, true);

// /obj/item/stack/proc/zero_amount  (code/game/objects/items/stacks/stack.dm:220)  may sleep
rt.def("/obj/item/stack/proc/zero_amount", function* zero_amount(f: Frame) {
	if (truthy(rt.sv(f, "is_cyborg"))) {
		return (rt.lt(rt.fv(f, "energy", rt.sv(f, "source")), rt.sv(f, "cost")) ? 1 : 0);
	}
	if (rt.lt(rt.sv(f, "amount"), 1)) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return 0;
}, true);

// /obj/item/stack/proc/add  (code/game/objects/items/stacks/stack.dm:228)
rt.def("/obj/item/stack/proc/add", function _add(f: Frame, amount: Value) {
	if (truthy(rt.sv(f, "is_cyborg"))) {
		rt.callName(f, rt.sv(f, "source"), "add_charge", [multiply(live(amount), rt.sv(f, "cost"))]);
	} else {
		rt.modField(f, live(f.src), "amount", live(amount), add);
	}
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "update_weight", []);
	return f.dot;
});

// /obj/item/stack/proc/merge  (code/game/objects/items/stacks/stack.dm:235)  may sleep
rt.def("/obj/item/stack/proc/merge", function* merge(f: Frame, S: Value) {
	let transfer: Value = null;
	f.vars = () => [S, transfer];
	if ((((!truthy(live(S)) || truthy(rt.fv(f, "gc_destroyed", live(S)))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || isEqual(live(S), live(f.src)))) {
		return live(f.dot);
	}
	transfer = (yield* g.srcCall(f, "get_amount"));
	if (truthy(rt.fv(f, "is_cyborg", live(S)))) {
		transfer = (yield* g.call(f, P("/proc/min"), null, [live(transfer), (yield* g.call(f, P("/proc/round"), null, [divide(subtract(rt.gv(f, "max_energy", rt.fv(f, "source", live(S))), rt.gv(f, "energy", rt.fv(f, "source", live(S)))), rt.fv(f, "cost", live(S)))]))]));
	} else {
		transfer = (yield* g.call(f, P("/proc/min"), null, [live(transfer), subtract(rt.fv(f, "max_amount", live(S)), rt.fv(f, "amount", live(S)))]));
	}
	if (truthy(rt.sv(f, "pulledby"))) {
		yield* g.callName(f, rt.sv(f, "pulledby"), "start_pulling", [live(S)]);
	}
	yield* g.callName(f, live(S), "copy_evidences", [live(f.src)]);
	yield* g.srcCall(f, "use", live(transfer));
	yield* g.callName(f, live(S), "add", [live(transfer)]);
	return f.dot;
}, true);

// /obj/item/stack/proc/Crossed  (code/game/objects/items/stacks/stack.dm:249)  may sleep
rt.def("/obj/item/stack/proc/Crossed", function* Crossed(f: Frame) {
	if ((truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "merge_type")])) && !truthy(rt.fv(f, "throwing", live(f.args[0]))))) {
		yield* g.srcCall(f, "merge", live(f.args[0]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["o"] });

// /obj/item/stack/proc/hitby  (code/game/objects/items/stacks/stack.dm:254)  may sleep
rt.def("/obj/item/stack/proc/hitby", function* hitby(f: Frame) {
	if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "merge_type")]))) {
		yield* g.srcCall(f, "merge", live(f.args[0]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["AM", "skip", "hitpush"] });

// /obj/item/stack/proc/attack_hand  (code/game/objects/items/stacks/stack.dm:259)  may sleep
rt.def("/obj/item/stack/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual((yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", [])), live(f.src))) {
		if (truthy((yield* g.srcCall(f, "zero_amount")))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "change_stack", live(f.args[0]), 1);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/stack/proc/AltClick  (code/game/objects/items/stacks/stack.dm:267)  may sleep
rt.def("/obj/item/stack/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let min: Value = null, max: Value = null, stackmaterial: Value = null;
	f.vars = () => [user, min, max, stackmaterial];
	if ((!truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) || !truthy((yield* g.callName(f, live(user), "canUseTopic", [live(f.src)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "is_cyborg"))) {
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "zero_amount")))) {
			return live(f.dot);
		}
		min = 0;
		max = (yield* g.callName(f, live(f.src), "get_amount", []));
		if ((((stackmaterial = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [32], [null, null, fmt("How many sheets do you wish to take out of this stack? (Maximum  ＀)", [live(max)]), live(user), null]))]))) === null || rt.le(live(stackmaterial), live(min))) || rt.ge(live(stackmaterial), (yield* g.callName(f, live(f.src), "get_amount", []))))) {
			return live(f.dot);
		} else {
			yield* g.srcCall(f, "change_stack", live(user), live(stackmaterial));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ sheets out of the stack</span>", [live(stackmaterial)])]);
		}
	}
	return f.dot;
}, true);

// /obj/item/stack/proc/change_stack  (code/game/objects/items/stacks/stack.dm:288)  may sleep
rt.def("/obj/item/stack/proc/change_stack", function* change_stack(f: Frame, user: Value, amount: Value) {
	let F: Value = null;
	f.vars = () => [user, amount, F];
	f.dot = (F = (yield* g.new_(f, rt.sv(f, "type"), [live(user), live(amount), 0])));
	yield* g.callName(f, live(F), "copy_evidences", [live(f.src)]);
	yield* g.callName(f, live(user), "put_in_hands", [live(F)]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.callName(f, live(F), "add_fingerprint", [live(user)]);
	yield* g.srcCall(f, "use", live(amount));
	return f.dot;
}, true);

// /obj/item/stack/proc/attackby  (code/game/objects/items/stacks/stack.dm:299)  may sleep
rt.def("/obj/item/stack/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "merge_type")]))) {
		yield* g.srcCall(f, "merge", (S = live(f.args[0])));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Your ＀ stack now contains ＀ ＀５.</span>", [rt.fv(f, "name", live(S)), (yield* g.callName(f, live(S), "get_amount", [])), rt.fv(f, "singular_name", live(S))])]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/stack/proc/copy_evidences  (code/game/objects/items/stacks/stack.dm:307)
rt.def("/obj/item/stack/proc/copy_evidences", function copy_evidences(f: Frame, from: Value) {
	rt.setFv(f, "blood_DNA", live(f.src), rt.fv(f, "blood_DNA", live(from)));
	rt.setFv(f, "fingerprints", live(f.src), rt.fv(f, "fingerprints", live(from)));
	rt.setFv(f, "fingerprintshidden", live(f.src), rt.fv(f, "fingerprintshidden", live(from)));
	rt.setFv(f, "fingerprintslast", live(f.src), rt.fv(f, "fingerprintslast", live(from)));
	return f.dot;
});

// /obj/item/stack/proc/microwave_act  (code/game/objects/items/stacks/stack.dm:314)
rt.def("/obj/item/stack/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (!(truthy(live(M)) && rt.lt(rt.fv(f, "dirty", live(M)), 100))) return f.dot;
	rt.modField(f, live(M), "dirty", rt.sv(f, "amount"), add);
	return f.dot;
});
