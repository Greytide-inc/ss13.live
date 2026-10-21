// From code/game/machinery/autolathe.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10776, "/obj/machinery/autolathe", "/obj/machinery", {
	operating: 0,
	L: null,
	LL: null,
	hacked: 0,
	disabled: 0,
	shocked: 0,
	hack_wire: null,
	disable_wire: null,
	shock_wire: null,
	busy: 0,
	prod_coeff: 1,
	being_built: null,
	files: null,
	matching_designs: null,
	selected_category: null,
	screen: 1,
	materials: null,
	categories: null,
	anchored: 1,
	name: "autolathe",
	desc: "It produces items using metal and glass.",
	icon_state: "autolathe",
	density: 1,
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 100,
});

// /obj/machinery/autolathe/proc/<init>  (code/game/machinery/autolathe.dm:13)
rt.def("/obj/machinery/autolathe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "L", rt.list());
	$0 = $0;
	rt.setSv(f, "LL", rt.list());
	rt.setSv(f, "categories", rt.list("Tools", "Electronics", "Construction", "T-Comm", "Security", "Machinery", "Medical", "Misc", "Dinnerware", "Imported"));
	return f.dot;
});

// /obj/machinery/autolathe/proc/New  (code/game/machinery/autolathe.dm:49)  may sleep
rt.def("/obj/machinery/autolathe/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "materials", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$metal", "$glass")])));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/autolathe"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/autolathe"), [live(f.src)])));
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research/autolathe"), [live(f.src)])));
	rt.setSv(f, "matching_designs", rt.list());
	return f.dot;
}, true);

rt.type(6715, "/obj/item/weapon/circuitboard/machine/autolathe", "/obj/item/weapon/circuitboard/machine", {
	name: "Autolathe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/autolathe"),
	origin_tech: "engineering=2;programming=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/autolathe/proc/<init>  (code/game/machinery/autolathe.dm:62)
rt.def("/obj/item/weapon/circuitboard/machine/autolathe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 3, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	return f.dot;
});

// /obj/machinery/autolathe/proc/Destroy  (code/game/machinery/autolathe.dm:68)  may sleep
rt.def("/obj/machinery/autolathe/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "materials")]);
	rt.setSv(f, "materials", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/autolathe/proc/interact  (code/game/machinery/autolathe.dm:75)  may sleep
// tg_js: opens the `autolathe` tgui window instead of the hand-built /datum/browser page.
rt.def("/obj/machinery/autolathe/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "shocked")) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 2)))) {
		yield* g.srcCall(f, "shock", live(user), 50);
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/machinery/autolathe/proc/ui_interact  (tg_js)  may sleep
rt.def("/obj/machinery/autolathe/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "autolathe", rt.sv(f, "name"), 500, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/autolathe/proc/design_entry  (tg_js)
// One design as {id, name, cost, can_build, mults:[n...]}; mults are the x5/x10 (or stack x10/x25/xMax) build buttons the old page showed.
rt.def("/obj/machinery/autolathe/proc/design_entry", function design_entry(f: Frame, D: Value) {
	const E = rt.list();
	const dis = truthy(rt.sv(f, "disabled"));
	const mats = rt.sv(f, "materials");
	const dm = rt.fv(f, "materials", live(D));
	const metal = Number(rt.index(dm, "$metal")) || 0, glass = Number(rt.index(dm, "$glass")) || 0;
	const haveM = Number(rt.callName(f, mats, "amount", ["$metal"])), haveG = Number(rt.callName(f, mats, "amount", ["$glass"]));
	const mults: number[] = [];
	if (!dis) {
		if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")]))) {
			const mx = Math.min(Number(rt.fv(f, "maxstack", live(D))), metal > 0 ? Math.floor(haveM / metal) : Infinity, glass > 0 ? Math.floor(haveG / glass) : Infinity);
			if (mx > 10) mults.push(10);
			if (mx > 25) mults.push(25);
			if (mx > 0) mults.push(mx);
		} else {
			if (truthy(rt.callSrc(f, "can_build", [live(D), 5]))) mults.push(5);
			if (truthy(rt.callSrc(f, "can_build", [live(D), 10]))) mults.push(10);
		}
	}
	rt.setAt(live(E), "id", rt.fv(f, "id", live(D)));
	rt.setAt(live(E), "name", rt.fv(f, "name", live(D)));
	rt.setAt(live(E), "cost", rt.callSrc(f, "get_design_cost", [live(D)]));
	rt.setAt(live(E), "can_build", (!dis && truthy(rt.callSrc(f, "can_build", [live(D)]))) ? 1 : 0);
	rt.setAt(live(E), "mults", rt.list(...mults));
	return live(E);
});

// /obj/machinery/autolathe/proc/ui_data  (tg_js)
// screen 1 main / 2 category / 3 search, category, categories, materials [{id,name,amount}], total_amount, max_amount, busy, disabled, designs (of the category or the search results).
rt.def("/obj/machinery/autolathe/proc/ui_data", function ui_data(f: Frame, user: Value) {
	f.vars = () => [user];
	const data = rt.list();
	const screen = Number(rt.sv(f, "screen")) || 1;
	rt.setAt(live(data), "screen", screen);
	rt.setAt(live(data), "category", rt.sv(f, "selected_category"));
	rt.setAt(live(data), "busy", truthy(rt.sv(f, "busy")) ? 1 : 0);
	rt.setAt(live(data), "disabled", truthy(rt.sv(f, "disabled")) ? 1 : 0);
	rt.setAt(live(data), "being_built", truthy(rt.sv(f, "busy")) && truthy(rt.sv(f, "being_built")) ? rt.initial(f, rt.fv(f, "build_path", rt.sv(f, "being_built")), "name") : null);
	rt.setAt(live(data), "total_amount", rt.fv(f, "total_amount", rt.sv(f, "materials")));
	rt.setAt(live(data), "max_amount", rt.fv(f, "max_amount", rt.sv(f, "materials")));
	const cats = rt.list();
	rt.forList(f, 0, rt.sv(f, "categories"));
	let $e: any;
	while (($e = rt.next(f, 0)) !== undefined) rt.modify(live(cats), rt.list(live($e)), add);
	rt.endFor(f, 0);
	rt.setAt(live(data), "categories", live(cats));
	const mats = rt.list();
	const ml = rt.fv(f, "materials", rt.sv(f, "materials"));
	rt.forList(f, 0, ml);
	while (($e = rt.next(f, 0)) !== undefined) {
		const M = rt.index(ml, live($e)), E = rt.list();
		rt.setAt(live(E), "id", live($e));
		rt.setAt(live(E), "name", rt.gv(f, "name", live(M)));
		rt.setAt(live(E), "amount", rt.fv(f, "amount", live(M)));
		rt.modify(live(mats), rt.list(live(E)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "materials", live(mats));
	const designs = rt.list();
	if (screen === 2) {
		const kd = rt.fv(f, "known_designs", rt.sv(f, "files"));
		rt.forList(f, 0, kd);
		while (($e = rt.next(f, 0)) !== undefined) {
			const D = rt.index(kd, live($e));
			if (!truthy((rt.isIn(f, rt.sv(f, "selected_category"), rt.fv(f, "category", live(D))) ? 1 : 0))) continue;
			rt.modify(live(designs), rt.list(rt.callSrc(f, "design_entry", [live(D)])), add);
		}
		rt.endFor(f, 0);
	} else if (screen === 3) {
		rt.forList(f, 0, rt.sv(f, "matching_designs"));
		while (($e = rt.next(f, 0)) !== undefined) rt.modify(live(designs), rt.list(rt.callSrc(f, "design_entry", [live($e)])), add);
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "designs", live(designs));
	return live(data);
});

// /obj/machinery/autolathe/proc/ui_act  (tg_js)  may sleep
// Every action is routed to the old Topic (its busy check and logic), then the windows are refreshed. eject has no old equivalent: it hands out sheets from the stored material.
rt.def("/obj/machinery/autolathe/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	const p = (k: string) => fmt("＀", [rt.at(live(params), k)]);
	let href: any[] | null = null;
	switch (action) {
		case "menu": href = ["menu", p("menu")]; break;
		case "category": if (truthy((rt.isIn(f, p("category"), rt.sv(f, "categories")) ? 1 : 0))) href = ["category", p("category"), "menu", 2]; break; // tg_js (public server): an unknown category used to switch the window to an empty list
		case "make": href = ["make", p("id"), "multiplier", p("multiplier")]; break;
		case "search": href = ["search", 1, "to_search", p("to_search"), "menu", 3]; break;
		case "eject":
			// tg_js (public server): the amount used to go to retrieve_sheets as typed. -5/0 did nothing, 0.5 made a half-sheet stack, and over 50 sheets
			// retrieve() hands out 50 per loop but only charges for the remainder (material_container.ts, not fixed here), so "120" gave 120 sheets for 20.
			// Whole sheets 1..50 (the page's buttons: 1, 10, All = 50), as before only while idle.
			const amt = Math.floor(Number(yield* g.call(f, P("/proc/text2num"), null, [p("amount")])));
			if (!truthy(rt.sv(f, "busy")) && amt >= 1 && amt <= 50) {
				yield* g.callName(f, rt.sv(f, "materials"), "retrieve_sheets", [amt, p("material")]);
			}
			yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
			return 1;
	}
	if (href === null) {
		return 0;
	}
	yield* g.srcCall(f, "Topic", "", rt.alist(f, href));
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/machinery/autolathe/proc/on_deconstruction  (code/game/machinery/autolathe.dm:96)  may sleep
rt.def("/obj/machinery/autolathe/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* g.callName(f, rt.sv(f, "materials"), "retrieve_all", []);
	return f.dot;
}, true);

// /obj/machinery/autolathe/proc/attackby  (code/game/machinery/autolathe.dm:100)  may sleep
rt.def("/obj/machinery/autolathe/proc/attackby", function* attackby(f: Frame) {
	let D: Value = null, B: Value = null, material_amount: Value = null, inserted: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [D, B, material_amount, inserted, $0, $1, $2, $e];
	if (truthy(rt.sv(f, "busy"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class=\"alert\">The autolathe is busy. Please wait for completion of previous operation.</span>"]);
		return 1;
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "autolathe_t", "autolathe", live(f.args[0]))))) {
		yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "panel_open"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
			yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]));
			return 1;
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
				yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
				return 1;
			}
		}
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy(rt.sv(f, "stat"))) {
		return 1;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/design_disk")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to load ％！ in ％！...", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("You begin to load a design from ％！...", [live(f.args[0])]), "You hear the chatter of a floppy drive."]);
		rt.setSv(f, "busy", 1);
		D = live(f.args[0]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 14.399999618530273, "target", live(f.src)], rt.Args.Named)))) {
			B = null;
			rt.forList(f, 0, rt.fv(f, "blueprints", live(D)));
			while (($e = rt.next(f, 0)) !== undefined) {
				B = $e;
				if (truthy(live(B))) {
					yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(B)]);
				}
			}
			rt.endFor(f, 0);
		}
		rt.setSv(f, "busy", 0);
		return 1;
	}
	if (truthy(rt.fv(f, "secondary_flags", live(f.args[0])))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.args[0])), "hologram");
	} else {
		$0 = 0;
	}
	if (truthy($0)) {
		return 1;
	}
	if (!truthy((material_amount = (yield* g.callName(f, rt.sv(f, "materials"), "get_item_material_amount", [live(f.args[0])]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This object does not contain sufficient amounts of metal or glass to be accepted by the autolathe.</span>"]);
		return 1;
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "materials"), "has_space", [live(material_amount)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The autolathe is full. Please remove metal or glass from the autolathe in order to insert more.</span>"]);
		return 1;
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to you and cannot be placed into the autolathe.</span>", [live(f.args[0])])]);
		return 1;
	}
	rt.setSv(f, "busy", 1);
	if (truthy((inserted = (yield* g.callName(f, rt.sv(f, "materials"), "insert_item", [live(f.args[0])]))))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack")) ? 1 : 0))) {
			if (truthy(rt.index(rt.fv(f, "materials", live(f.args[0])), "$metal"))) {
				yield* g.call(f, P("/proc/flick"), null, ["autolathe_o", live(f.src)]);
			}
			if (truthy(rt.index(rt.fv(f, "materials", live(f.args[0])), "$glass"))) {
				yield* g.call(f, P("/proc/flick"), null, ["autolathe_r", live(f.src)]);
			}
			$0 = live(f.args[1]);
			$1 = live(inserted);
			if (rt.gt(live(inserted), 1)) {
				$2 = "s";
			} else {
				$2 = "";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You insert ＀ sheet＀ to the autolathe.</span>", [$1, $2])]);
			yield* g.srcCall(f, "use_power", multiply(live(inserted), 100));
			if (!(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0]))))) {
				yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(f.args[0])]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert a material total of ＀ to the autolathe.</span>", [live(inserted)])]);
			yield* g.srcCall(f, "use_power", (yield* g.call(f, P("/proc/max"), null, [500, divide(live(inserted), 10)])));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		}
	} else {
		yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(f.args[0])]);
	}
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/autolathe/proc/Topic  (code/game/machinery/autolathe.dm:176)  may sleep
rt.def("/obj/machinery/autolathe/proc/Topic", function* Topic(f: Frame) {
	let _T: Value = null, multiplier: Value = null, is_stack: Value = null, coeff: Value = null, metal_cost: Value = null, glass_cost: Value = null, power: Value = null, materials_used: Value = null, N: Value = null, S: Value = null, i: Value = null, new_item: Value = null, mat: Value = null, v: Value = null, D: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D, $0, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "busy"))) {
		if (truthy(rt.at(live(f.args[1]), "menu"))) {
			// tg_js (public server): screen was whatever number the href said (99, -1, 0.5, null for "abc"); only the three menus exist (an unknown one left the window with no designs)
			const sc = Number(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "menu")]));
			if (sc === 1 || sc === 2 || sc === 3) rt.setSv(f, "screen", sc);
			yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
		}
		if (truthy(rt.at(live(f.args[1]), "category")) && truthy((rt.isIn(f, rt.at(live(f.args[1]), "category"), rt.sv(f, "categories")) ? 1 : 0))) { // tg_js (public server): any text (up to 4 KB of it, sent on to every window of the machine) used to be stored as the category; only the machine's own categories now
			rt.setSv(f, "selected_category", rt.at(live(f.args[1]), "category"));
			yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
		}
		if (truthy(rt.at(live(f.args[1]), "make"))) {
			_T = rt.sv(f, "loc");
			rt.setSv(f, "being_built", (yield* g.callName(f, rt.sv(f, "files"), "FindDesignByID", [rt.at(live(f.args[1]), "make")])));
			if (!truthy(rt.sv(f, "being_built"))) {
				return live(f.dot);
			}
			multiplier = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "multiplier")]));
			is_stack = (yield* g.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", rt.sv(f, "being_built")), T("/obj/item/stack")]));
			{ // tg_js (public server): the multiplier comes straight from the href. Before, a hostile player could send -5 (the cost check passes and
				// use_amount then ADDS 5 designs' worth of material, past the machine's maximum), 0.5 or 2.5 (fractional stacks and half-priced builds), "abc"
				// (a free stack of 1), or 1000 (the machine is busy for ~50 minutes). Whole numbers only: 1..maxstack for a stack, 1..10 (the page's last button)
				// otherwise; and a disabled machine (wire pulse) builds nothing, as its page greys the buttons (the old Topic never checked).
				const mv = Math.floor(Number(live(multiplier))), mx = truthy(live(is_stack)) ? Math.floor(Number(rt.fv(f, "maxstack", rt.sv(f, "being_built")))) || 1 : 10;
				if (!(mv >= 1 && mv <= mx) || truthy(rt.sv(f, "disabled"))) {
					rt.setSv(f, "being_built", null);
					return live(f.dot);
				}
				multiplier = mv;
			}
			if (truthy(live(is_stack))) {
				$0 = 1;
			} else {
				$0 = rt.sv(f, "prod_coeff");
			}
			coeff = $0;
			metal_cost = rt.index(rt.fv(f, "materials", rt.sv(f, "being_built")), "$metal");
			glass_cost = rt.index(rt.fv(f, "materials", rt.sv(f, "being_built")), "$glass");
			power = (yield* g.call(f, P("/proc/max"), null, [2000, divide(multiply(add(live(metal_cost), live(glass_cost)), live(multiplier)), 5)]));
			if ((rt.ge((yield* g.callName(f, rt.sv(f, "materials"), "amount", ["$metal"])), multiply(multiply(live(metal_cost), live(multiplier)), live(coeff))) && rt.ge((yield* g.callName(f, rt.sv(f, "materials"), "amount", ["$glass"])), multiply(multiply(live(glass_cost), live(multiplier)), live(coeff))))) {
				rt.setSv(f, "busy", 1);
				yield* g.srcCall(f, "use_power", live(power));
				rt.setSv(f, "icon_state", "autolathe");
				yield* g.call(f, P("/proc/flick"), null, ["autolathe_n", live(f.src)]);
				if (truthy(live(is_stack))) {
					rt.spawnTail(f, multiply(32, live(coeff)), "/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:214", _T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D);
				} else {
					rt.spawnTail(f, multiply(multiply(32, live(coeff)), live(multiplier)), "/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:230", _T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D);
				}
			}
		}
		if (truthy(rt.at(live(f.args[1]), "search"))) {
			yield* g.callName(f, rt.sv(f, "matching_designs"), "Cut", []);
			v = null;
			rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
			while (($e = rt.next(f, 0)) !== undefined) {
				v = $e;
				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.gv(f, "name", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v)))), rt.at(live(f.args[1]), "to_search")])))) {
					yield* g.callName(f, rt.sv(f, "matching_designs"), "Add", [live(D)]);
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class=\"alert\">The autolathe is busy. Please wait for completion of previous operation.</span>"]);
	}
	yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(multiply(multiply(32, live(coeff)), live(multiplier))) body of /obj/machinery/autolathe/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:230", function* (f: Frame, _T: Value, multiplier: Value, is_stack: Value, coeff: Value, metal_cost: Value, glass_cost: Value, power: Value, materials_used: Value, N: Value, S: Value, i: Value, new_item: Value, mat: Value, v: Value, D: Value) {
	let $e: any;
	f.vars = () => [_T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D, $e];
	yield* g.srcCall(f, "use_power", live(power));
	materials_used = rt.alist(f, ["$metal", multiply(multiply(live(metal_cost), live(coeff)), live(multiplier)), "$glass", multiply(multiply(live(glass_cost), live(coeff)), live(multiplier))]);
	yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [live(materials_used)]);
	i = null;
	i = 1;
	while (rt.le(live(i), live(multiplier))) {
		new_item = (yield* g.new_(f, rt.fv(f, "build_path", rt.sv(f, "being_built")), [live(_T)]));
		mat = null;
		rt.forList(f, 0, live(materials_used));
		while (($e = rt.next(f, 0)) !== undefined) {
			mat = $e;
			rt.setAt(rt.fv(f, "materials", live(new_item)), live(mat), divide(rt.index(live(materials_used), live(mat)), live(multiplier)));
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(new_item), "autolathe_crafted", [live(f.src)]);
		i = rt.inc(live(i), 1);
	}
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return null;
});

// a spawn(multiply(32, live(coeff))) body of /obj/machinery/autolathe/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:214", function* (f: Frame, _T: Value, multiplier: Value, is_stack: Value, coeff: Value, metal_cost: Value, glass_cost: Value, power: Value, materials_used: Value, N: Value, S: Value, i: Value, new_item: Value, mat: Value, v: Value, D: Value) {
	let $e: any;
	f.vars = () => [_T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D, $e];
	yield* g.srcCall(f, "use_power", live(power));
	materials_used = rt.alist(f, ["$metal", multiply(live(metal_cost), live(multiplier)), "$glass", multiply(live(glass_cost), live(multiplier))]);
	yield* g.callName(f, rt.sv(f, "materials"), "use_amount", [live(materials_used)]);
	yield* g.callName(f, (N = (yield* g.new_(f, rt.fv(f, "build_path", rt.sv(f, "being_built")), [live(_T), live(multiplier)]))), "update_icon", []);
	yield* g.callName(f, live(N), "autolathe_crafted", [live(f.src)]);
	S = null;
	rt.forList(f, 0, subtract(rt.fv(f, "contents", live(_T)), live(N)), T("/obj/item/stack"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.op(f, "IsType", [], [live(S), rt.fv(f, "merge_type", live(N))]))) {
			yield* g.callName(f, live(N), "merge", [live(S)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "updateUsrDialog"); yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return null;
});

// /obj/machinery/autolathe/proc/RefreshParts  (code/game/machinery/autolathe.dm:259)
rt.def("/obj/machinery/autolathe/proc/RefreshParts", function RefreshParts(f: Frame) {
	let _T: Value = null, MB: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, MB, M, $e];
	_T = 0;
	MB = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		MB = $e;
		_T = rt.modify(live(_T), multiply(rt.fv(f, "rating", live(MB)), 75000), add);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "max_amount", rt.sv(f, "materials"), live(_T));
	_T = 1.2000000476837158;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(_T = rt.modify(live(_T), multiply(rt.fv(f, "rating", live(M)), 0.20000000298023224), subtract));
	}
	rt.endFor(f, 0);
	rt.setSv(f, "prod_coeff", rt.call(f, P("/proc/min"), null, [1, rt.call(f, P("/proc/max"), null, [0, live(_T)])]));
	return f.dot;
});

// /obj/machinery/autolathe/proc/main_win  (code/game/machinery/autolathe.dm:268)
rt.def("/obj/machinery/autolathe/proc/main_win", function main_win(f: Frame, user: Value) {
	let dat: Value = null, line_length: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [dat, line_length, C, $e];
	dat = "<div class='statusDisplay'><h3>Autolathe Menu:</h3><br>";
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	dat = rt.modify(live(dat), fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='menu' value='＀'><input type='text' name='to_search'><input type='submit' value='Search'></form><hr>", [live(f.src), live(f.src), 3]), add);
	line_length = 1;
	dat = rt.modify(live(dat), "<table style='width:100%' align='center'><tr>", add);
	C = null;
	rt.forList(f, 0, rt.sv(f, "categories"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (rt.gt(live(line_length), 2)) {
			dat = rt.modify(live(dat), "</tr><tr>", add);
			line_length = 1;
		}
		dat = rt.modify(live(dat), fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [live(f.src), live(C), 2, live(C)]), add);
		line_length = rt.inc(live(line_length), 1);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</tr></table></div>", add));
});

// /obj/machinery/autolathe/proc/category_win  (code/game/machinery/autolathe.dm:294)
rt.def("/obj/machinery/autolathe/proc/category_win", function category_win(f: Frame, user: Value, selected_category: Value) {
	let dat: Value = null, v: Value = null, D: Value = null, max_multiplier: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [dat, v, D, max_multiplier, $0, $1, $2, $e];
	dat = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [live(f.src), 1]);
	dat = rt.modify(live(dat), fmt("<div class='statusDisplay'><h3>Browsing ＀:</h3><br>", [live(selected_category)]), add);
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	v = null;
	rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
		if (!truthy((rt.isIn(f, live(selected_category), rt.fv(f, "category", live(D))) ? 1 : 0))) {
			continue;
		}
		if ((truthy(rt.sv(f, "disabled")) || !truthy(rt.callSrc(f, "can_build", [live(D)])))) {
			dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>", [rt.fv(f, "name", live(D))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;make=＀;multiplier=1'>＀</a>", [live(f.src), rt.fv(f, "id", live(D)), rt.fv(f, "name", live(D))]), add);
		}
		if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")]))) {
			$0 = rt.fv(f, "maxstack", live(D));
			if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$metal"))) {
				$1 = rt.call(f, P("/proc/round"), null, [divide(rt.callName(f, rt.sv(f, "materials"), "amount", ["$metal"]), rt.index(rt.fv(f, "materials", live(D)), "$metal"))]);
			} else {
				$1 = 9.999999848243207e+30;
			}
			if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$glass"))) {
				$2 = rt.call(f, P("/proc/round"), null, [divide(rt.callName(f, rt.sv(f, "materials"), "amount", ["$glass"]), rt.index(rt.fv(f, "materials", live(D)), "$glass"))]);
			} else {
				$2 = 9.999999848243207e+30;
			}
			if ((rt.gt((max_multiplier = rt.call(f, P("/proc/min"), null, [$0, $1, $2])), 10) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=10'>x10</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			if ((rt.gt(live(max_multiplier), 25) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=25'>x25</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			if ((rt.gt(live(max_multiplier), 0) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=＀'>x＀</a>", [live(f.src), rt.fv(f, "id", live(D)), live(max_multiplier), live(max_multiplier)]), add);
			}
		} else {
			if ((!truthy(rt.sv(f, "disabled")) && truthy(rt.callSrc(f, "can_build", [live(D), 5])))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=5'>x5</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			if ((!truthy(rt.sv(f, "disabled")) && truthy(rt.callSrc(f, "can_build", [live(D), 10])))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=10'>x10</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
		}
		dat = rt.modify(live(dat), fmt("＀<br>", [rt.callSrc(f, "get_design_cost", [live(D)])]), add);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</div>", add));
});

// /obj/machinery/autolathe/proc/search_win  (code/game/machinery/autolathe.dm:328)
rt.def("/obj/machinery/autolathe/proc/search_win", function search_win(f: Frame, user: Value) {
	let dat: Value = null, v: Value = null, D: Value = null, max_multiplier: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [dat, v, D, max_multiplier, $0, $1, $2, $e];
	dat = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [live(f.src), 1]);
	dat = rt.modify(live(dat), "<div class='statusDisplay'><h3>Search results:</h3><br>", add);
	dat = rt.modify(live(dat), rt.callSrc(f, "materials_printout", []), add);
	v = null;
	rt.forList(f, 0, rt.sv(f, "matching_designs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		v = $e;
		D = live(v);
		if ((truthy(rt.sv(f, "disabled")) || !truthy(rt.callSrc(f, "can_build", [live(D)])))) {
			dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>", [rt.fv(f, "name", live(D))]), add);
		} else {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;make=＀;multiplier=1'>＀</a>", [live(f.src), rt.fv(f, "id", live(D)), rt.fv(f, "name", live(D))]), add);
		}
		if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")]))) {
			$0 = rt.fv(f, "maxstack", live(D));
			if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$metal"))) {
				$1 = rt.call(f, P("/proc/round"), null, [divide(rt.callName(f, rt.sv(f, "materials"), "amount", ["$metal"]), rt.index(rt.fv(f, "materials", live(D)), "$metal"))]);
			} else {
				$1 = 9.999999848243207e+30;
			}
			if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$glass"))) {
				$2 = rt.call(f, P("/proc/round"), null, [divide(rt.callName(f, rt.sv(f, "materials"), "amount", ["$glass"]), rt.index(rt.fv(f, "materials", live(D)), "$glass"))]);
			} else {
				$2 = 9.999999848243207e+30;
			}
			if ((rt.gt((max_multiplier = rt.call(f, P("/proc/min"), null, [$0, $1, $2])), 10) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=10'>x10</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			if ((rt.gt(live(max_multiplier), 25) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=25'>x25</a>", [live(f.src), rt.fv(f, "id", live(D))]), add);
			}
			if ((rt.gt(live(max_multiplier), 0) && !truthy(rt.sv(f, "disabled")))) {
				dat = rt.modify(live(dat), fmt(" <a href='?src=＃;make=＀;multiplier=＀'>x＀</a>", [live(f.src), rt.fv(f, "id", live(D)), live(max_multiplier), live(max_multiplier)]), add);
			}
		}
		dat = rt.modify(live(dat), fmt("＀<br>", [rt.callSrc(f, "get_design_cost", [live(D)])]), add);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</div>", add));
});

// /obj/machinery/autolathe/proc/materials_printout  (code/game/machinery/autolathe.dm:354)
rt.def("/obj/machinery/autolathe/proc/materials_printout", function materials_printout(f: Frame) {
	let dat: Value = null, mat_id: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [dat, mat_id, M, $e];
	dat = fmt("<b>Total amount:</b> ＀ / ＀ cm<sup>3</sup><br>", [rt.fv(f, "total_amount", rt.sv(f, "materials")), rt.fv(f, "max_amount", rt.sv(f, "materials"))]);
	mat_id = null;
	rt.forList(f, 0, rt.fv(f, "materials", rt.sv(f, "materials")));
	while (($e = rt.next(f, 0)) !== undefined) {
		mat_id = $e;
		dat = rt.modify(live(dat), fmt("<b>＀ amount:</b> ＀ cm<sup>3</sup><br>", [rt.gv(f, "name", (M = rt.index(rt.fv(f, "materials", rt.sv(f, "materials")), live(mat_id)))), rt.fv(f, "amount", live(M))]), add);
	}
	rt.endFor(f, 0);
	return live(dat);
});

// /obj/machinery/autolathe/proc/can_build  (code/game/machinery/autolathe.dm:361)
rt.def("/obj/machinery/autolathe/proc/can_build", function can_build(f: Frame, D: Value, amount: Value) {
	let coeff: Value = null;
	let $0: any;
	f.vars = () => [amount, coeff, $0];
	if (live(amount) === null) {
		amount = 1;
	}
	if (truthy(rt.getLen(f, rt.fv(f, "make_reagents", live(D))))) {
		return 0;
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")]))) {
		$0 = 1;
	} else {
		$0 = rt.sv(f, "prod_coeff");
	}
	coeff = $0;
	if ((truthy(rt.index(rt.fv(f, "materials", live(D)), "$metal")) && rt.lt(rt.callName(f, rt.sv(f, "materials"), "amount", ["$metal"]), multiply(multiply(rt.index(rt.fv(f, "materials", live(D)), "$metal"), live(coeff)), live(amount))))) {
		return 0;
	}
	if ((truthy(rt.index(rt.fv(f, "materials", live(D)), "$glass")) && rt.lt(rt.callName(f, rt.sv(f, "materials"), "amount", ["$glass"]), multiply(multiply(rt.index(rt.fv(f, "materials", live(D)), "$glass"), live(coeff)), live(amount))))) {
		return 0;
	}
	return 1;
});

// /obj/machinery/autolathe/proc/get_design_cost  (code/game/machinery/autolathe.dm:373)
rt.def("/obj/machinery/autolathe/proc/get_design_cost", function get_design_cost(f: Frame, D: Value) {
	let coeff: Value = null, dat: Value = null;
	let $0: any;
	f.vars = () => [coeff, dat, $0];
	if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.fv(f, "build_path", live(D)), T("/obj/item/stack")]))) {
		$0 = 1;
	} else {
		$0 = rt.sv(f, "prod_coeff");
	}
	coeff = $0;
	dat = null;
	if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$metal"))) {
		dat = rt.modify(live(dat), fmt("＀ metal ", [multiply(rt.index(rt.fv(f, "materials", live(D)), "$metal"), live(coeff))]), add);
	}
	if (truthy(rt.index(rt.fv(f, "materials", live(D)), "$glass"))) {
		dat = rt.modify(live(dat), fmt("＀ glass", [multiply(rt.index(rt.fv(f, "materials", live(D)), "$glass"), live(coeff))]), add);
	}
	return live(dat);
});

// /obj/machinery/autolathe/proc/reset  (code/game/machinery/autolathe.dm:382)
rt.def("/obj/machinery/autolathe/proc/reset", function reset(f: Frame, wire: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(wire);
	if ($0 === "Hack") {
		if (!truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", [live(wire)]))) {
			rt.callSrc(f, "adjust_hacked", [0]);
		}
	} else if ($0 === "High Voltage Ground") {
		if (!truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", [live(wire)]))) {
			rt.setSv(f, "shocked", 0);
		}
	} else if ($0 === "Disable") {
		if (truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", [live(wire)]))) return f.dot;
		rt.setSv(f, "disabled", 0);
	}
	return f.dot;
});

// /obj/machinery/autolathe/proc/shock  (code/game/machinery/autolathe.dm:394)  may sleep
rt.def("/obj/machinery/autolathe/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	f.vars = () => [user, prb, s];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [5, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 0.699999988079071, 1])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/machinery/autolathe/proc/adjust_hacked  (code/game/machinery/autolathe.dm:407)
rt.def("/obj/machinery/autolathe/proc/adjust_hacked", function adjust_hacked(f: Frame, state: Value) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	rt.setSv(f, "hacked", live(state));
	D = null;
	rt.forList(f, 0, rt.fv(f, "possible_designs", rt.sv(f, "files")), T("/datum/design"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if ((truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 4)) && truthy((rt.isIn(f, "hacked", rt.fv(f, "category", live(D))) ? 1 : 0)))) {
			if (truthy(rt.sv(f, "hacked"))) {
				rt.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(D)]);
			} else {
				(rt.modField(f, rt.sv(f, "files"), "known_designs", rt.fv(f, "id", live(D)), subtract));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});
