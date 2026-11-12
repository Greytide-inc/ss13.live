// Based on /tg/station's code/game/machinery/autolathe.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, truthy, add, fmt } = rt;


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

// autolathe.dm:13
rt.def("/obj/machinery/autolathe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.L = list();

	this.LL = list();
	this.categories = list("Tools", "Electronics", "Construction", "T-Comm", "Security", "Machinery", "Medical", "Misc", "Dinnerware", "Imported");
	return f.dot;
});

// autolathe.dm:49
rt.def("/obj/machinery/autolathe/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass")));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/autolathe"), null))).apply_default_parts(this);
	this.wires = (yield* new_(T("/datum/wires/autolathe"), this));
	this.files = (yield* new_(T("/datum/research/autolathe"), this));
	this.matching_designs = list();
	return f.dot;
}, true);

rt.type(6715, "/obj/item/weapon/circuitboard/machine/autolathe", "/obj/item/weapon/circuitboard/machine", {
	name: "Autolathe (Machine Board)",
	build_path: rt.typePath("/obj/machinery/autolathe"),
	origin_tech: "engineering=2;programming=2",
	req_components: null,
});

// autolathe.dm:62
rt.def("/obj/item/weapon/circuitboard/machine/autolathe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 3, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// autolathe.dm:68
rt.def("/obj/machinery/autolathe/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	yield* qdel(this.materials);
	this.materials = null;
	return (yield* parent_proc());
}, true);

// autolathe.dm:75
// tg_js: opens the `autolathe` tgui window instead of the hand-built /datum/browser page.
rt.def("/obj/machinery/autolathe/proc/interact", function* interact(f: Frame, user: Value) {
	if (!this.is_operational()) {
		return f.dot;
	}
	if (this.shocked && !rt.bitAnd(this.stat, 2)) {
		yield* this.shock(user, 50);
	}
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// Added by tg_js.
rt.def("/obj/machinery/autolathe/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "autolathe", this.name, 500, 600, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/machinery/autolathe/proc/design_entry  (tg_js)
// One design as {id, name, cost, can_build, mults:[n...]}; mults are the x5/x10 (or stack x10/x25/xMax) build buttons the old page showed.
rt.def("/obj/machinery/autolathe/proc/design_entry", function design_entry(f: Frame, D: Value) {
	const E = list();
	const dis = truthy(this.disabled);
	const mats = this.materials;
	const dm = D.materials;
	const metal = Number(rt.index(dm, "$metal")) || 0, glass = Number(rt.index(dm, "$glass")) || 0;
	const haveM = Number(mats.amount("$metal")), haveG = Number(mats.amount("$glass"));
	const mults: number[] = [];
	if (!dis) {
		if (ispath(D.build_path, T("/obj/item/stack"))) {
			const mx = Math.min(Number(D.maxstack), metal > 0 ? Math.floor(haveM / metal) : Infinity, glass > 0 ? Math.floor(haveG / glass) : Infinity);
			if (mx > 10) mults.push(10);
			if (mx > 25) mults.push(25);
			if (mx > 0) mults.push(mx);
		} else {
			if (this.can_build(D, 5)) mults.push(5);
			if (this.can_build(D, 10)) mults.push(10);
		}
	}
	rt.setAt(E, "id", D.id);
	rt.setAt(E, "name", D.name);
	rt.setAt(E, "cost", this.get_design_cost(D));
	rt.setAt(E, "can_build", !dis && this.can_build(D) ? 1 : 0);
	rt.setAt(E, "mults", list(...mults));
	return E;
});

// /obj/machinery/autolathe/proc/ui_data  (tg_js)
// screen 1 main / 2 category / 3 search, category, categories, materials [{id,name,amount}], total_amount, max_amount, busy, disabled, designs (of the category or the search results).
rt.def("/obj/machinery/autolathe/proc/ui_data", function ui_data(f: Frame, user: Value) {
	const data = list();
	const screen = Number(this.screen) || 1;
	rt.setAt(data, "screen", screen);
	rt.setAt(data, "category", this.selected_category);
	rt.setAt(data, "busy", this.busy ? 1 : 0);
	rt.setAt(data, "disabled", this.disabled ? 1 : 0);
	rt.setAt(data, "being_built", this.busy && this.being_built ? rt.initial(f, this.being_built.build_path, "name") : null);
	rt.setAt(data, "total_amount", this.materials.total_amount);
	rt.setAt(data, "max_amount", this.materials.max_amount);
	const cats = list();
	rt.forList(f, 0, this.categories);
	let $e: any;
	while (($e = rt.next(f, 0)) !== undefined) rt.modify(cats, list($e), add);
	rt.endFor(f, 0);
	rt.setAt(data, "categories", cats);
	const mats = list();
	const ml = this.materials.materials;
	rt.forList(f, 0, ml);
	while (($e = rt.next(f, 0)) !== undefined) {
		const M = rt.index(ml, $e), E = list();
		rt.setAt(E, "id", $e);
		rt.setAt(E, "name", M.name);
		rt.setAt(E, "amount", M.amount);
		rt.modify(mats, list(E), add);
	}
	rt.endFor(f, 0);
	rt.setAt(data, "materials", mats);
	const designs = list();
	if (screen === 2) {
		const kd = this.files.known_designs;
		rt.forList(f, 0, kd);
		while (($e = rt.next(f, 0)) !== undefined) {
			const D = rt.index(kd, $e);
			if (!rt.isIn(f, this.selected_category, D.category)) continue;
			rt.modify(designs, list(this.design_entry(D)), add);
		}
		rt.endFor(f, 0);
	} else if (screen === 3) {
		rt.forList(f, 0, this.matching_designs);
		while (($e = rt.next(f, 0)) !== undefined) rt.modify(designs, list(this.design_entry($e)), add);
		rt.endFor(f, 0);
	}
	rt.setAt(data, "designs", designs);
	return data;
});

// /obj/machinery/autolathe/proc/ui_act  (tg_js)  may sleep
// Every action is routed to the old Topic (its busy check and logic), then the windows are refreshed. eject has no old equivalent: it hands out sheets from the stored material.
rt.def("/obj/machinery/autolathe/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	const p = (k: string) => `${rt.at(params, k)}`;
	let href: any[] | null = null;
	switch (action) {
		case "menu": href = ["menu", p("menu")]; break;
		case "category": if (rt.isIn(f, p("category"), this.categories)) href = ["category", p("category"), "menu", 2]; break; // tg_js (public server): an unknown category used to switch the window to an empty list
		case "make": href = ["make", p("id"), "multiplier", p("multiplier")]; break;
		case "search": href = ["search", 1, "to_search", p("to_search"), "menu", 3]; break;
		case "eject":
			// tg_js (public server): the amount used to go to retrieve_sheets as typed. -5/0 did nothing, 0.5 made a half-sheet stack, and over 50 sheets
			// retrieve() hands out 50 per loop but only charges for the remainder (material_container.ts, not fixed here), so "120" gave 120 sheets for 20.
			// Whole sheets 1..50 (the page's buttons: 1, 10, All = 50), as before only while idle.
			const amt = Math.floor(Number(text2num(p("amount"))));
			if (!this.busy && amt >= 1 && amt <= 50) {
				yield* this.materials.retrieve_sheets(amt, p("material"));
			}
			GLOB.SStgui.update_uis(this);
			return 1;
	}
	if (href === null) {
		return 0;
	}
	yield* this.Topic("", rt.alist(f, href));
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// autolathe.dm:96
rt.def("/obj/machinery/autolathe/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.materials.retrieve_all();
	return f.dot;
}, true);

// autolathe.dm:100
rt.def("/obj/machinery/autolathe/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let D: Value = null, B: Value = null, material_amount: Value = null, inserted: Value = null;
	let $e: any;
	if (this.busy) {
		to_chat(user, "<span class=\"alert\">The autolathe is busy. Please wait for completion of previous operation.</span>");
		return 1;
	}
	if (this.default_deconstruction_screwdriver(user, "autolathe_t", "autolathe", O)) {
		yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (this.panel_open) {
		if (rt.istype(O, T("/obj/item/weapon/crowbar"))) {
			yield* this.default_deconstruction_crowbar(O);
			return 1;
		} else if (is_wire_tool(O)) {
			yield* this.wires.interact(user);
			return 1;
		}
	}
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (this.stat) {
		return 1;
	}
	if (rt.istype(O, T("/obj/item/weapon/disk/design_disk"))) {
		user.visible_message(fmt("＀ begins to load ％！ in ％！...", [user, O, this]), fmt("You begin to load a design from ％！...", [O]), "You hear the chatter of a floppy drive.");
		this.busy = 1;
		D = O;
		if (yield* do_after(user, 14.4, { target: this })) {
			for (B of each(D.blueprints)) {
				if (B) {
					this.files.AddDesign2Known(B);
				}
			}
		}
		this.busy = 0;
		return 1;
	}
	if (O.secondary_flags ? rt.index(O.secondary_flags, "hologram") : 0) {
		return 1;
	}
	if (!(material_amount = this.materials.get_item_material_amount(O))) {
		to_chat(user, "<span class='warning'>This object does not contain sufficient amounts of metal or glass to be accepted by the autolathe.</span>");
		return 1;
	}
	if (!this.materials.has_space(material_amount)) {
		to_chat(user, "<span class='warning'>The autolathe is full. Please remove metal or glass from the autolathe in order to insert more.</span>");
		return 1;
	}
	if (!(yield* user.temporarilyRemoveItemFromInventory(O))) {
		to_chat(user, fmt("<span class='warning'>＄！ is stuck to you and cannot be placed into the autolathe.</span>", [O]));
		return 1;
	}
	this.busy = 1;
	if (inserted = (yield* this.materials.insert_item(O))) {
		if (rt.istype(O, T("/obj/item/stack"))) {
			if (rt.index(O.materials, "$metal")) {
				flick("autolathe_o", this);
			}
			if (rt.index(O.materials, "$glass")) {
				flick("autolathe_r", this);
			}
			to_chat(user, `<span class='notice'>You insert ${inserted} sheet${inserted > 1 ? "s" : ""} to the autolathe.</span>`);
			yield* this.use_power(inserted * 100);
			if (!(!O || O.gc_destroyed)) {
				yield* user.put_in_active_hand(O);
			}
		} else {
			to_chat(user, `<span class='notice'>You insert a material total of ${inserted} to the autolathe.</span>`);
			yield* this.use_power(max(500, inserted / 10));
			yield* qdel(O);
		}
	} else {
		yield* user.put_in_active_hand(O);
	}
	this.busy = 0;
	yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
	return 1;
}, true);

// autolathe.dm:176
rt.def("/obj/machinery/autolathe/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _T: Value = null, multiplier: Value = null, is_stack: Value = null, coeff: Value = null, metal_cost: Value = null, glass_cost: Value = null, power: Value = null, materials_used: Value = null, N: Value = null, S: Value = null, i: Value = null, new_item: Value = null, mat: Value = null, v: Value = null, D: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!this.busy) {
		if (rt.at(href_list, "menu")) {
			// tg_js (public server): screen was whatever number the href said (99, -1, 0.5, null for "abc"); only the three menus exist (an unknown one left the window with no designs)
			const sc = Number(text2num(rt.at(href_list, "menu")));
			if (sc === 1 || sc === 2 || sc === 3) this.screen = sc;
			yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
		}
		if (rt.at(href_list, "category") && rt.isIn(f, rt.at(href_list, "category"), this.categories)) { // tg_js (public server): any text (up to 4 KB of it, sent on to every window of the machine) used to be stored as the category; only the machine's own categories now
			this.selected_category = rt.at(href_list, "category");
			yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
		}
		if (rt.at(href_list, "make")) {
			_T = this.loc;
			this.being_built = this.files.FindDesignByID(rt.at(href_list, "make"));
			if (!this.being_built) {
				return f.dot;
			}
			multiplier = text2num(rt.at(href_list, "multiplier"));
			is_stack = ispath(this.being_built.build_path, T("/obj/item/stack"));
			{ // tg_js (public server): the multiplier comes straight from the href. Before, a hostile player could send -5 (the cost check passes and
				// use_amount then ADDS 5 designs' worth of material, past the machine's maximum), 0.5 or 2.5 (fractional stacks and half-priced builds), "abc"
				// (a free stack of 1), or 1000 (the machine is busy for ~50 minutes). Whole numbers only: 1..maxstack for a stack, 1..10 (the page's last button)
				// otherwise; and a disabled machine (wire pulse) builds nothing, as its page greys the buttons (the old Topic never checked).
				const mv = Math.floor(Number(multiplier)), mx = is_stack ? Math.floor(Number(this.being_built.maxstack)) || 1 : 10;
				if (!(mv >= 1 && mv <= mx) || this.disabled) {
					this.being_built = null;
					return f.dot;
				}
				multiplier = mv;
			}
			coeff = is_stack ? 1 : this.prod_coeff;
			metal_cost = rt.index(this.being_built.materials, "$metal");
			glass_cost = rt.index(this.being_built.materials, "$glass");
			power = max(2000, (metal_cost + glass_cost) * multiplier / 5);
			if (this.materials.amount("$metal") >= metal_cost * multiplier * coeff && this.materials.amount("$glass") >= glass_cost * multiplier * coeff) {
				this.busy = 1;
				yield* this.use_power(power);
				this.icon_state = "autolathe";
				flick("autolathe_n", this);
				if (is_stack) {
					rt.spawnTail(f, 32 * coeff, "/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:214", _T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D);
				} else {
					rt.spawnTail(f, 32 * coeff * multiplier, "/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:230", _T, multiplier, is_stack, coeff, metal_cost, glass_cost, power, materials_used, N, S, i, new_item, mat, v, D);
				}
			}
		}
		if (rt.at(href_list, "search")) {
			this.matching_designs.Cut();
			for (v of each(this.files.known_designs)) {
				if (findtext((D = rt.index(this.files.known_designs, v)).name, rt.at(href_list, "to_search"))) {
					this.matching_designs.Add(D);
				}
			}
			yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
		}
	} else {
		to_chat(f.usr, "<span class=\"alert\">The autolathe is busy. Please wait for completion of previous operation.</span>");
	}
	yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
	return f.dot;
}, true);

// a spawn(multiply(multiply(32, live(coeff)), live(multiplier))) body of /obj/machinery/autolathe/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:230", function* (f: Frame, _T: Value, multiplier: Value, is_stack: Value, coeff: Value, metal_cost: Value, glass_cost: Value, power: Value, materials_used: Value, N: Value, S: Value, i: Value, new_item: Value, mat: Value, v: Value, D: Value) {
	try { // busy is cleared even if the build errors (tg: the lathe then said "busy" until rebuilt)
		yield* this.use_power(power);
		materials_used = rt.alist(f, ["$metal", metal_cost * coeff * multiplier, "$glass", glass_cost * coeff * multiplier]);
		this.materials.use_amount(materials_used);
		i = null;
		i = 1;
		while (i <= multiplier) {
			new_item = (yield* new_(this.being_built.build_path, _T));
			mat = null;
			for (mat of each(materials_used)) {
				rt.setAt(new_item.materials, mat, rt.index(materials_used, mat) / multiplier);
			}
			new_item.autolathe_crafted(this);
			i++;
		}
	} finally {
		this.busy = 0;
	}
	yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
	return null;
});

// a spawn(multiply(32, live(coeff))) body of /obj/machinery/autolathe/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/autolathe/proc/Topic: spawn at game/machinery/autolathe.dm:214", function* (f: Frame, _T: Value, multiplier: Value, is_stack: Value, coeff: Value, metal_cost: Value, glass_cost: Value, power: Value, materials_used: Value, N: Value, S: Value, i: Value, new_item: Value, mat: Value, v: Value, D: Value) {
	try { // busy is cleared even if the build errors (tg: the lathe then said "busy" until rebuilt)
		yield* this.use_power(power);
		materials_used = rt.alist(f, ["$metal", metal_cost * multiplier, "$glass", glass_cost * multiplier]);
		this.materials.use_amount(materials_used);
		yield* (N = (yield* new_(this.being_built.build_path, _T, multiplier))).update_icon();
		N.autolathe_crafted(this);
		S = null;
		for (S of each(_T.contents - N, T("/obj/item/stack"))) {
			if (rt.op(f, "IsType", [], [S, N.merge_type])) {
				yield* N.merge(S);
			}
		}
	} finally {
		this.busy = 0;
	}
	yield* this.updateUsrDialog(); GLOB.SStgui.update_uis(this);
	return null;
});

// autolathe.dm:259
rt.def("/obj/machinery/autolathe/proc/RefreshParts", function RefreshParts(f: Frame) {
	let MB: Value = null, M: Value = null;
	let _T: Value = 0;
	for (MB of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		_T += MB.rating * 75000;
	}
	this.materials.max_amount = _T;
	_T = 1.2;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		_T -= M.rating * 0.2;
	}
	this.prod_coeff = min(1, max(0, _T));
	return f.dot;
});

// autolathe.dm:268
rt.def("/obj/machinery/autolathe/proc/main_win", function main_win(f: Frame, user: Value) {
	let C: Value = null;
	let dat: Value = "<div class='statusDisplay'><h3>Autolathe Menu:</h3><br>";
	dat += this.materials_printout();
	dat += fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='menu' value='＀'><input type='text' name='to_search'><input type='submit' value='Search'></form><hr>", [this, this, 3]);
	let line_length: Value = 1;
	dat += "<table style='width:100%' align='center'><tr>";
	for (C of each(this.categories)) {
		if (line_length > 2) {
			dat += "</tr><tr>";
			line_length = 1;
		}
		dat += fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [this, C, 2, C]);
		line_length++;
	}
	return (dat += "</tr></table></div>");
});

// autolathe.dm:294
rt.def("/obj/machinery/autolathe/proc/category_win", function category_win(f: Frame, user: Value, selected_category: Value) {
	let v: Value = null, D: Value = null, max_multiplier: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	let dat: Value = fmt("<A href='?src=＃;menu=＀'>Return to main menu</A>", [this, 1]);
	dat += `<div class='statusDisplay'><h3>Browsing ${selected_category}:</h3><br>`;
	dat += this.materials_printout();
	for (v of each(this.files.known_designs)) {
		D = rt.index(this.files.known_designs, v);
		if (!rt.isIn(f, selected_category, D.category)) {
			continue;
		}
		if (this.disabled || !this.can_build(D)) {
			dat += `<span class='linkOff'>${D.name}</span>`;
		} else {
			dat += fmt("<a href='?src=＃;make=＀;multiplier=1'>＀</a>", [this, D.id, D.name]);
		}
		if (ispath(D.build_path, T("/obj/item/stack"))) {
			$0 = D.maxstack;
			if (rt.index(D.materials, "$metal")) {
				$1 = round(this.materials.amount("$metal") / rt.index(D.materials, "$metal"));
			} else {
				$1 = 1e+31;
			}
			if (rt.index(D.materials, "$glass")) {
				$2 = round(this.materials.amount("$glass") / rt.index(D.materials, "$glass"));
			} else {
				$2 = 1e+31;
			}
			if ((max_multiplier = min($0, $1, $2)) > 10 && !this.disabled) {
				dat += fmt(" <a href='?src=＃;make=＀;multiplier=10'>x10</a>", [this, D.id]);
			}
			if (max_multiplier > 25 && !this.disabled) {
				dat += fmt(" <a href='?src=＃;make=＀;multiplier=25'>x25</a>", [this, D.id]);
			}
			if (max_multiplier > 0 && !this.disabled) {
				dat += fmt(" <a href='?src=＃;make=＀;multiplier=＀'>x＀</a>", [this, D.id, max_multiplier, max_multiplier]);
			}
		} else {
			if (!this.disabled && this.can_build(D, 5)) {
				dat += fmt(" <a href='?src=＃;make=＀;multiplier=5'>x5</a>", [this, D.id]);
			}
			if (!this.disabled && this.can_build(D, 10)) {
				dat += fmt(" <a href='?src=＃;make=＀;multiplier=10'>x10</a>", [this, D.id]);
			}
		}
		dat += `${this.get_design_cost(D)}<br>`;
	}
	return (dat += "</div>");
});

// autolathe.dm:354
rt.def("/obj/machinery/autolathe/proc/materials_printout", function materials_printout(f: Frame) {
	let mat_id: Value = null, M: Value = null;
	let dat: Value = `<b>Total amount:</b> ${this.materials.total_amount} / ${this.materials.max_amount} cm<sup>3</sup><br>`;
	for (mat_id of each(this.materials.materials)) {
		dat += `<b>${(M = rt.index(this.materials.materials, mat_id)).name} amount:</b> ${M.amount} cm<sup>3</sup><br>`;
	}
	return dat;
});

// autolathe.dm:361
rt.def("/obj/machinery/autolathe/proc/can_build", function can_build(f: Frame, D: Value, amount: Value) {
	amount ??= 1;
	if (rt.len(f, D.make_reagents)) {
		return 0;
	}
	let coeff: Value = ispath(D.build_path, T("/obj/item/stack")) ? 1 : this.prod_coeff;
	if (rt.index(D.materials, "$metal") && this.materials.amount("$metal") < rt.index(D.materials, "$metal") * coeff * amount) {
		return 0;
	}
	if (rt.index(D.materials, "$glass") && this.materials.amount("$glass") < rt.index(D.materials, "$glass") * coeff * amount) {
		return 0;
	}
	return 1;
});

// autolathe.dm:373
rt.def("/obj/machinery/autolathe/proc/get_design_cost", function get_design_cost(f: Frame, D: Value) {
	let dat: Value = null;
	let coeff: Value = ispath(D.build_path, T("/obj/item/stack")) ? 1 : this.prod_coeff;
	if (rt.index(D.materials, "$metal")) {
		dat += `${rt.index(D.materials, "$metal") * coeff} metal `;
	}
	if (rt.index(D.materials, "$glass")) {
		dat += `${rt.index(D.materials, "$glass") * coeff} glass`;
	}
	return dat;
});

// autolathe.dm:382
rt.def("/obj/machinery/autolathe/proc/reset", function reset(f: Frame, wire: Value) {
	if (wire === "Hack") {
		if (!this.wires.is_cut(wire)) {
			this.adjust_hacked(0);
		}
	} else if (wire === "High Voltage Ground") {
		if (!this.wires.is_cut(wire)) {
			this.shocked = 0;
		}
	} else if (wire === "Disable") {
		if (this.wires.is_cut(wire)) return f.dot;
		this.disabled = 0;
	}
	return f.dot;
});

// autolathe.dm:394
rt.def("/obj/machinery/autolathe/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 1, this);
	yield* s.start();
	if (yield* electrocute_mob(user, get_area(this), this, 0.7, 1)) {
		return 1;
	} else {
		return 0;
	}
}, true);

// autolathe.dm:407
rt.def("/obj/machinery/autolathe/proc/adjust_hacked", function adjust_hacked(f: Frame, state: Value) {
	let D: Value = null;
	this.hacked = state;
	for (D of each(this.files.possible_designs, T("/datum/design"))) {
		if (rt.bitAnd(D.build_type, AUTOLATHE) && rt.isIn(f, "hacked", D.category)) {
			if (this.hacked) {
				this.files.AddDesign2Known(D);
			} else {
				this.files.known_designs -= D.id;
			}
		}
	}
	return f.dot;
});
