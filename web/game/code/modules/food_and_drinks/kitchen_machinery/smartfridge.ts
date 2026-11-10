// Based on /tg/station's code/modules/food_and_drinks/kitchen_machinery/smartfridge.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10901, "/obj/machinery/smartfridge", "/obj/machinery", {
	max_n_of_items: 1500,
	icon_on: "smartfridge",
	icon_off: "smartfridge-off",
	initial_contents: null,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 100,
	name: "smartfridge",
	desc: "Keeps cold things cold and hot things cold.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "smartfridge",
	layer: 2.9,
	density: 1,
});

// smartfridge.dm:21
rt.def("/obj/machinery/smartfridge/proc/Initialize", function* Initialize(f: Frame) {
	let typekey: Value = null, amount: Value = null, i: Value = null, B: Value = null;
	let $e: any;
	yield* parent_proc();
	yield* this.create_reagents();
	this.reagents.set_reacting(0);
	if (rt.istype(this.initial_contents, T("/list"))) {
		for (typekey of each(this.initial_contents)) {
			if ((amount = rt.index(this.initial_contents, typekey)) === null) {
				amount = 1;
			}
			i = null;
			rt.forRange(f, 1, 1, amount, 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* this.load((yield* new_(typekey, this)));
			}
			rt.endFor(f, 1);
		}
	}
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/smartfridge"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6754, "/obj/item/weapon/circuitboard/machine/smartfridge", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Smartfridge (Machine Board)",
	build_path: rt.typePath("/obj/machinery/smartfridge"),
	origin_tech: "programming=1",
}, { global: { fridges: 1051 } });

// smartfridge.dm:40
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1]);
	return f.dot;
});

// smartfridge.dm:51
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/New", function* New(f: Frame, loc: Value, new_type: Value) {
	if (new_type) {
		this.build_path = new_type;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// smartfridge.dm:55
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let position: Value = null;
	let $0: any;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if ((position = GLOB.fridges.Find(this.build_path, GLOB.fridges)) == rt.len(f, GLOB.fridges)) {
			$0 = 1;
		} else {
			$0 = position + 1;
		}
		position = $0;
		this.build_path = rt.index(GLOB.fridges, position);
		to_chat(user, `<span class='notice'>You set the board to ${rt.index(GLOB.fridges, this.build_path)}.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// smartfridge.dm:64
rt.def("/obj/item/weapon/circuitboard/machine/smartfridge/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='info'>${this} is set to ${rt.index(GLOB.fridges, this.build_path)}. You can use a screwdriver to reconfigure it.</span>`);
	return f.dot;
}, false);

// smartfridge.dm:68
rt.def("/obj/machinery/smartfridge/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		this.max_n_of_items = 1500 * B.rating;
	}
	return f.dot;
});

// smartfridge.dm:72
rt.def("/obj/machinery/smartfridge/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// smartfridge.dm:76
rt.def("/obj/machinery/smartfridge/proc/update_icon", function update_icon(f: Frame) {
	if (!this.stat) {
		this.icon_state = this.icon_on;
	} else {
		this.icon_state = this.icon_off;
	}
	return f.dot;
});

// smartfridge.dm:88
rt.def("/obj/machinery/smartfridge/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _P: Value = null, loaded: Value = null, G: Value = null;
	if (this.default_deconstruction_screwdriver(user, "smartfridge_open", "smartfridge", O)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, O)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(O)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, O)) {
		yield* this.power_change();
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(O)) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	if (!this.stat) {
		if (rt.len(f, this.contents) >= this.max_n_of_items) {
			to_chat(user, fmt("<span class='warning'>＄！ is full!</span>", [this]));
			return 0;
		}
		if (this.accept_check(O)) {
			yield* this.load(O);
			user.visible_message(fmt("＀ has added ％！ to ％！.", [user, O, this]), fmt("<span class='notice'>You add ％！ to ％！.</span>", [O, this]));
			yield* this.updateUsrDialog();
			return 1;
		}
		if (rt.istype(O, T("/obj/item/weapon/storage/bag"))) {
			_P = O;
			loaded = 0;
			for (G of each(_P.contents, T("/obj"))) {
				if (rt.len(f, this.contents) >= this.max_n_of_items) {
					break;
				}
				if (this.accept_check(G)) {
					yield* this.load(G);
					loaded++;
				}
			}
			yield* this.updateUsrDialog();
			if (loaded) {
				if (rt.len(f, this.contents) >= this.max_n_of_items) {
					user.visible_message(fmt("＀ loads ％！ with ％！.", [user, this, O]), fmt("<span class='notice'>You fill ％！ with ％！.</span>", [this, O]));
				} else {
					user.visible_message(fmt("＀ loads ％！ with ％！.", [user, this, O]), fmt("<span class='notice'>You load ％！ with ％！.</span>", [this, O]));
				}
				if (rt.len(f, O.contents) > 0) {
					to_chat(user, "<span class='warning'>Some items are refused.</span>");
				}
				return 1;
			} else {
				to_chat(user, `<span class='warning'>There is nothing in ${O} to put in ${this}!</span>`);
				return 0;
			}
		}
	}
	if (user.a_intent != "harm") {
		to_chat(user, fmt("<span class='warning'>＄！ smartly refuses ＀.</span>", [this, O]));
		yield* this.updateUsrDialog();
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// smartfridge.dm:152
rt.def("/obj/machinery/smartfridge/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/grown")) || rt.istype(O, T("/obj/item/seeds")) || rt.istype(O, T("/obj/item/weapon/grown"))) {
		return 1;
	}
	return 0;
});

// smartfridge.dm:157
rt.def("/obj/machinery/smartfridge/proc/load", function* load(f: Frame, O: Value) {
	let M: Value = null, S: Value = null;
	if (ismob(O.loc)) {
		if (!(yield* (M = O.loc).transferItemToLoc(O, this))) {
			to_chat(f.usr, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [O, this]));
			return f.dot;
		}
	} else {
		if (rt.istype(O.loc, T("/obj/item/weapon/storage"))) {
			yield* (S = O.loc).remove_from_storage(O, this);
		}
		yield* O.forceMove(this);
	}
	return f.dot;
}, true);

// smartfridge.dm:169
rt.def("/obj/machinery/smartfridge/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// smartfridge.dm:175
rt.def("/obj/machinery/smartfridge/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// smartfridge.dm:186
// tg_js: opens the `smartfridge` tgui window (after modern tg's smartfridge.dm) instead of a hand-built HTML page.
rt.def("/obj/machinery/smartfridge/proc/interact", function* interact(f: Frame, user: Value) {
	if (this.stat) {
		return 0;
	}
	yield* this.ui_interact(user);
	return 1;
}, true);

// Added by tg_js.
rt.def("/obj/machinery/smartfridge/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "smartfridge", this.name, 440, 550, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/machinery/smartfridge/proc/ui_data  (tg_js)  may sleep
// contents: [{name (the key vend sends back), label (capitalized), amount}] grouped by name and sorted like the old page; drying_rack/drying for the rack's toggle.
rt.def("/obj/machinery/smartfridge/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let E: Value = null, O: Value = null;
	let $e: any;
	let data: Value = rt.list();
	let list: Value = rt.list();
	const counts: any = new Map();
	for (O of each(this.contents, T("/atom/movable"))) {
		const nm = String(O.name);
		counts.set(nm, (counts.get(nm) ?? 0) + 1);
	}
	for (const nm of [...counts.keys()].sort((x: string, y: string) => x.toLowerCase() < y.toLowerCase() ? -1 : x.toLowerCase() > y.toLowerCase() ? 1 : 0)) {
		E = rt.list();
		rt.setAt(E, "name", nm);
		rt.setAt(E, "label", nm.charAt(0).toUpperCase() + nm.slice(1));
		rt.setAt(E, "amount", counts.get(nm));
		rt.modify(list, rt.list(E), add);
	}
	rt.setAt(data, "contents", list);
	const rack = rt.istype(this, T("/obj/machinery/smartfridge/drying_rack")) ? 1 : 0;
	rt.setAt(data, "drying_rack", rack);
	rt.setAt(data, "drying", rack && this.drying ? 1 : 0);
	return data;
}, true);

// /obj/machinery/smartfridge/proc/ui_act  (tg_js)  may sleep
// Vending goes through the old Topic (name match, amount) and the rack's toggle through the rack's Topic.
rt.def("/obj/machinery/smartfridge/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "vend") {
		yield* this.Topic("", rt.alist(f, ["vend", rt.at(params, "name"), "amount", `${rt.at(params, "amount")}`]));
	} else if (action === "dry" && rt.istype(this, T("/obj/machinery/smartfridge/drying_rack"))) {
		yield* this.Topic("", rt.alist(f, ["dry", 1]));
	} else {
		return 0;
	}
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// smartfridge.dm:224
rt.def("/obj/machinery/smartfridge/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let O: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return 1; // tg_js (public server): refused (out of range, no power...); the drying rack's Topic needs to see that
	}
	yield* f.usr.set_machine(this);
	let N: Value = rt.at(href_list, "vend");
	let amount: Value = text2num(rt.at(href_list, "amount"));
	// tg_js (public server): the amount must be a whole number >= 1 and the name text (a fraction such as 0.5 used to vend one item);
	if (typeof N !== "string" || !Number.isInteger(Number(amount)) || Number(amount) < 1) {
		yield* this.updateUsrDialog();
		return f.dot;
	}
	let i: Value = Number(amount);
	rt.forList(f, 0, this.contents, T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (i <= 0) {
			break;
		}
		if (O.name == N) {
			O.loc = this.loc;
			i--;
		}
	}
	rt.endFor(f, 0);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10902, "/obj/machinery/smartfridge/drying_rack", "/obj/machinery/smartfridge", {
	drying: 0,
	use_power: 1,
	idle_power_usage: 5,
	active_power_usage: 200,
	icon_on: "drying_rack_on",
	icon_off: "drying_rack",
	name: "drying rack",
	desc: "A wooden contraption, used to dry plant products, food and leather.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "drying_rack_on",
});

// Empty in tg.
rt.def("/obj/machinery/smartfridge/drying_rack/proc/RefreshParts");

// Empty in tg.
rt.def("/obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_screwdriver");

// Empty in tg.
rt.def("/obj/machinery/smartfridge/drying_rack/proc/exchange_parts");

// Empty in tg.
rt.def("/obj/machinery/smartfridge/drying_rack/proc/spawn_frame");

// smartfridge.dm:259
rt.def("/obj/machinery/smartfridge/drying_rack/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.component_parts && rt.len(f, this.component_parts)) {
		this.component_parts.Cut();
	}
	this.component_parts = null;
	return f.dot;
}, true);

// smartfridge.dm:265
rt.def("/obj/machinery/smartfridge/drying_rack/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* new_(T("/obj/item/stack/sheet/mineral/wood"), this.loc, 10);
	yield* parent_proc();
	return f.dot;
}, true);

// smartfridge.dm:274
rt.def("/obj/machinery/smartfridge/drying_rack/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["C", "ignore_panel"] });

// smartfridge.dm:285
rt.def("/obj/machinery/smartfridge/drying_rack/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) { // tg_js (public server): 2017 tg ignored this and switched the rack from anywhere on the map
		return 1;
	}
	if (rt.at(href_list, "dry")) {
		this.toggle_drying(0);
	}
	yield* this.updateUsrDialog();
	yield* this.update_icon();
	return f.dot;
}, true);

// smartfridge.dm:292
rt.def("/obj/machinery/smartfridge/drying_rack/proc/power_change", function power_change(f: Frame) {
	if (this.powered() && this.anchored) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		this.toggle_drying(1);
	}
	this.update_icon();
	return f.dot;
});

// smartfridge.dm:300
rt.def("/obj/machinery/smartfridge/drying_rack/proc/load", function* load(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// smartfridge.dm:304
rt.def("/obj/machinery/smartfridge/drying_rack/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (this.drying) {
		this.add_overlay("drying_rack_drying");
	}
	if (!rt.len(f, this.contents)) return f.dot;
	this.add_overlay("drying_rack_filled");
	return f.dot;
});

// smartfridge.dm:312
rt.def("/obj/machinery/smartfridge/drying_rack/proc/process", function* process(f: Frame) {
	yield* parent_proc();
	if (!this.drying) return f.dot;
	if (!(yield* this.rack_dry())) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { waitfor: false });

// smartfridge.dm:318
rt.def("/obj/machinery/smartfridge/drying_rack/proc/accept_check", function accept_check(f: Frame, O: Value) {
	let S: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if ((S = O).dried_type) {
			return 1;
		}
	}
	if (rt.istype(O, T("/obj/item/stack/sheet/wetleather"))) {
		return 1;
	}
	return 0;
});

// smartfridge.dm:327
rt.def("/obj/machinery/smartfridge/drying_rack/proc/toggle_drying", function toggle_drying(f: Frame, forceoff: Value) {
	if (this.drying || forceoff) {
		this.drying = 0;
		this.use_power = 1;
	} else {
		this.drying = 1;
		this.use_power = 2;
	}
	this.update_icon();
	return f.dot;
});

// smartfridge.dm:336
rt.def("/obj/machinery/smartfridge/drying_rack/proc/rack_dry", function* rack_dry(f: Frame) {
	let S: Value = null, dried: Value = null, WL: Value = null, L: Value = null;
	for (S of each(this.contents, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		if (S.dried_type == S.type) {
			S.add_atom_colour("#ad7257", FIXED_COLOUR_PRIORITY);
			S.dry = 1;
			S.loc = rt.getStep(f, this, 0);
		} else {
			dried = S.dried_type;
			yield* new_(dried, this.loc);
			yield* qdel(S);
		}
		return 1;
	}
	for (WL of each(this.contents, T("/obj/item/stack/sheet/wetleather"))) {
		(L = (yield* new_(T("/obj/item/stack/sheet/leather"), this.loc))).amount = WL.amount;
		yield* qdel(WL);
		return 1;
	}
	return 0;
}, true);

// smartfridge.dm:354
rt.def("/obj/machinery/smartfridge/drying_rack/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* parent_proc();
	this.atmos_spawn_air("TEMP=1000");
	return f.dot;
}, true);

rt.type(10903, "/obj/machinery/smartfridge/drinks", "/obj/machinery/smartfridge", {
	name: "drink showcase",
	desc: "A refrigerated storage unit for tasty tasty alcohol.",
});

// smartfridge.dm:366
rt.def("/obj/machinery/smartfridge/drinks/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (!rt.istype(O, T("/obj/item/weapon/reagent_containers")) || !O.reagents || !rt.len(f, O.reagents.reagent_list)) {
		return 0;
	}
	if (!(rt.istype(O, T("/obj/item/weapon/reagent_containers/glass")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/food/drinks")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/food/condiment")))) return f.dot;
	return 1;
});

rt.type(10904, "/obj/machinery/smartfridge/food", "/obj/machinery/smartfridge", {
	desc: "A refrigerated storage unit for food.",
});

// smartfridge.dm:378
rt.def("/obj/machinery/smartfridge/food/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks"))) {
		return 1;
	}
	return 0;
});

rt.type(10905, "/obj/machinery/smartfridge/extract", "/obj/machinery/smartfridge", {
	name: "smart slime extract storage",
	desc: "A refrigerated storage unit for slime extracts.",
});

// smartfridge.dm:390
rt.def("/obj/machinery/smartfridge/extract/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (rt.istype(O, T("/obj/item/slime_extract"))) {
		return 1;
	}
	if (rt.istype(O, T("/obj/item/device/slime_scanner"))) {
		return 1;
	}
	return 0;
});

rt.type(10906, "/obj/machinery/smartfridge/extract/preloaded", "/obj/machinery/smartfridge/extract", {
	initial_contents: null,
});

// smartfridge.dm:397
rt.def("/obj/machinery/smartfridge/extract/preloaded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.initial_contents = rt.alist(f, [T("/obj/item/device/slime_scanner"), 2]);
	return f.dot;
});

rt.type(10907, "/obj/machinery/smartfridge/chemistry", "/obj/machinery/smartfridge", {
	name: "smart chemical storage",
	desc: "A refrigerated storage unit for medicine storage.",
});

// smartfridge.dm:407
rt.def("/obj/machinery/smartfridge/chemistry/proc/accept_check", function accept_check(f: Frame, O: Value) {
	let I: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/storage/pill_bottle"))) {
		if (rt.len(f, O.contents)) {
			for (I of each(O, T("/obj/item"))) {
				if (!this.accept_check(I)) {
					return 0;
				}
			}
			return 1;
		}
		return 0;
	}
	if (!rt.istype(O, T("/obj/item/weapon/reagent_containers"))) {
		return 0;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/pill"))) {
		return 1;
	}
	if (!O.reagents || !rt.len(f, O.reagents.reagent_list)) {
		return 0;
	}
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers/syringe")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/glass/bottle")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/glass/beaker")) || rt.istype(O, T("/obj/item/weapon/reagent_containers/spray"))) {
		return 1;
	}
	return 0;
});

rt.type(10908, "/obj/machinery/smartfridge/chemistry/preloaded", "/obj/machinery/smartfridge/chemistry", {
	initial_contents: null,
});

// smartfridge.dm:425
rt.def("/obj/machinery/smartfridge/chemistry/preloaded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.initial_contents = rt.alist(f, [T("/obj/item/weapon/reagent_containers/pill/epinephrine"), 12, T("/obj/item/weapon/reagent_containers/pill/charcoal"), 5, T("/obj/item/weapon/reagent_containers/glass/bottle/epinephrine"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/charcoal"), 1]);
	return f.dot;
});

rt.type(10910, "/obj/machinery/smartfridge/chemistry/virology/preloaded", "/obj/machinery/smartfridge/chemistry/virology", {
	initial_contents: null,
});

// smartfridge.dm:439
rt.def("/obj/machinery/smartfridge/chemistry/virology/preloaded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.initial_contents = rt.alist(f, [T("/obj/item/weapon/reagent_containers/syringe/antiviral"), 4, T("/obj/item/weapon/reagent_containers/glass/bottle/cold"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/flu_virion"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/mutagen"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/plasma"), 1, T("/obj/item/weapon/reagent_containers/glass/bottle/synaptizine"), 1]);
	return f.dot;
});

rt.type(10911, "/obj/machinery/smartfridge/disks", "/obj/machinery/smartfridge", {
	name: "disk compartmentalizer",
	desc: "A machine capable of storing a variety of disks. Denoted by most as the DSU (disk storage unit).",
});

// smartfridge.dm:455
rt.def("/obj/machinery/smartfridge/disks/proc/accept_check", function accept_check(f: Frame, O: Value) {
	if (rt.istype(O, T("/obj/item/weapon/disk"))) {
		return 1;
	} else {
		return 0;
	}
});
