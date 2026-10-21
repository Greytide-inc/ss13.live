// From code/game/objects/items/weapons/storage/bags.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5527, "/obj/item/weapon/storage/bag/trash", "/obj/item/weapon/storage/bag", {
	name: "trash bag",
	desc: "It's the heavy-duty black polymer kind. Time to take out the trash!",
	icon: rt.rsc("icons/obj/janitor.dmi"),
	icon_state: "trashbag",
	item_state: "trashbag",
	w_class: 4,
	max_w_class: 2,
	max_combined_w_class: 30,
	storage_slots: 30,
	can_hold: null,
	cant_hold: null,
});

// /obj/item/weapon/storage/bag/trash/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:40)
rt.def("/obj/item/weapon/storage/bag/trash/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list());
	$0 = $0;
	rt.setSv(f, "cant_hold", rt.list(T("/obj/item/weapon/disk/nuclear")));
	return f.dot;
});

// /obj/item/weapon/storage/bag/trash/proc/suicide_act  (code/game/objects/items/weapons/storage/bags.dm:44)
rt.def("/obj/item/weapon/storage/bag/trash/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ puts ＀ over ＀ head and starts chomping at the insides! Disgusting!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/eatfood.ogg"), 50, 1, -1]);
	return 4;
});

// /obj/item/weapon/storage/bag/trash/proc/update_icon  (code/game/objects/items/weapons/storage/bags.dm:49)
rt.def("/obj/item/weapon/storage/bag/trash/proc/update_icon", function update_icon(f: Frame) {
	if (isEqual(rt.len(f, rt.sv(f, "contents")), 0)) {
		rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	} else {
		if (rt.lt(rt.len(f, rt.sv(f, "contents")), 12)) {
			rt.setSv(f, "icon_state", fmt("＀1", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			if (rt.lt(rt.len(f, rt.sv(f, "contents")), 21)) {
				rt.setSv(f, "icon_state", fmt("＀2", [rt.initial(f, live(f.src), "icon_state")]));
			} else {
				rt.setSv(f, "icon_state", fmt("＀3", [rt.initial(f, live(f.src), "icon_state")]));
			}
		}
	}
	return f.dot;
});

// /obj/item/weapon/storage/bag/trash/proc/janicart_insert  (code/game/objects/items/weapons/storage/bags.dm:60)  may sleep
rt.def("/obj/item/weapon/storage/bag/trash/proc/janicart_insert", function* janicart_insert(f: Frame, user: Value, J: Value) {
	f.vars = () => [user, J];
	yield* g.callName(f, live(J), "put_in_cart", [live(f.src), live(user)]);
	rt.setFv(f, "mybag", live(J), live(f.src));
	yield* g.callName(f, live(J), "update_icon", []);
	return f.dot;
}, true);

rt.type(5530, "/obj/item/weapon/storage/bag/ore", "/obj/item/weapon/storage/bag", {
	name: "mining satchel",
	desc: "This little bugger can be used to store and transport ores.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "satchel",
	origin_tech: "engineering=2",
	slot_flags: 2560,
	w_class: 3,
	storage_slots: 50,
	max_combined_w_class: 200,
	max_w_class: 3,
	can_hold: null,
});

// /obj/item/weapon/storage/bag/ore/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:90)
rt.def("/obj/item/weapon/storage/bag/ore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/ore")));
	return f.dot;
});

rt.type(5533, "/obj/item/weapon/storage/bag/plants", "/obj/item/weapon/storage/bag", {
	name: "plant bag",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "plantbag",
	storage_slots: 100,
	max_combined_w_class: 100,
	max_w_class: 3,
	w_class: 1,
	resistance_flags: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/bag/plants/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:115)
rt.def("/obj/item/weapon/storage/bag/plants/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/grown"), T("/obj/item/seeds"), T("/obj/item/weapon/grown"), T("/obj/item/weapon/reagent_containers/honeycomb")));
	return f.dot;
});

rt.type(5534, "/obj/item/weapon/storage/bag/plants/portaseeder", "/obj/item/weapon/storage/bag/plants", {
	name: "portable seed extractor",
	desc: "For the enterprising botanist on the go. Less efficient than the stationary model, it creates one seed per plant.",
	icon_state: "portaseeder",
	origin_tech: "biotech=3;engineering=2",
});

// /obj/item/weapon/storage/bag/plants/portaseeder/verb/dissolve_contents  (code/game/objects/items/weapons/storage/bags.dm:130)  may sleep
rt.def("/obj/item/weapon/storage/bag/plants/portaseeder/verb/dissolve_contents", function* dissolve_contents(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.call(f, P("/proc/seedify"), null, [live(O), 1]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "close_all");
	return f.dot;
}, true, { verb: { name: "Activate Seed Extraction", category: "Object", desc: "Activate to convert your plants into plantable seeds." } });

rt.type(5535, "/obj/item/weapon/storage/bag/sheetsnatcher", "/obj/item/weapon/storage/bag", {
	capacity: 300,
	name: "sheet snatcher",
	desc: "A patented Nanotrasen storage system designed for any kind of mineral sheet.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "sheetsnatcher",
	w_class: 3,
	allow_quick_empty: 1,
});

// /obj/item/weapon/storage/bag/sheetsnatcher/proc/can_be_inserted  (code/game/objects/items/weapons/storage/bags.dm:155)
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/can_be_inserted", function can_be_inserted(f: Frame, W: Value, stop_messages: Value) {
	let current: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [stop_messages, current, S, $e];
	if (live(stop_messages) === null) {
		stop_messages = 0;
	}
	if (((!truthy((rt.istype(live(W), T("/obj/item/stack/sheet")) ? 1 : 0)) || truthy((rt.istype(live(W), T("/obj/item/stack/sheet/mineral/sandstone")) ? 1 : 0))) || truthy((rt.istype(live(W), T("/obj/item/stack/sheet/mineral/wood")) ? 1 : 0)))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("The snatcher does not accept ＀.", [live(W)])]);
		}
		return 0;
	}
	current = 0;
	S = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		current = rt.modify(live(current), rt.fv(f, "amount", live(S)), add);
	}
	rt.endFor(f, 0);
	if (isEqual(rt.sv(f, "capacity"), live(current))) {
		if (!truthy(live(stop_messages))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The snatcher is full.</span>"]);
		}
		return 0;
	}
	return 1;
});

// /obj/item/weapon/storage/bag/sheetsnatcher/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/bags.dm:171)  may sleep
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/handle_item_insertion", function* handle_item_insertion(f: Frame, W: Value, prevent_warning: Value) {
	let S: Value = null, amount: Value = null, inserted: Value = null, current: Value = null, S2: Value = null, sheet: Value = null;
	let $e: any;
	f.vars = () => [W, prevent_warning, S, amount, inserted, current, S2, sheet, $e];
	if (live(prevent_warning) === null) {
		prevent_warning = 0;
	}
	if (!truthy((rt.istype((S = live(W)), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		return 0;
	}
	amount = null;
	inserted = 0;
	current = 0;
	S2 = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S2 = $e;
		current = rt.modify(live(current), rt.fv(f, "amount", live(S2)), add);
	}
	rt.endFor(f, 0);
	if (rt.lt(rt.sv(f, "capacity"), add(live(current), rt.fv(f, "amount", live(S))))) {
		amount = subtract(rt.sv(f, "capacity"), live(current));
	} else {
		amount = rt.fv(f, "amount", live(S));
	}
	sheet = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		sheet = $e;
		if (isEqual(rt.fv(f, "type", live(S)), rt.fv(f, "type", live(sheet)))) {
			rt.modField(f, live(sheet), "amount", live(amount), add);
			(rt.modField(f, live(S), "amount", live(amount), subtract));
			inserted = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if ((!truthy(live(inserted)) || !truthy(rt.fv(f, "amount", live(S))))) {
		yield* g.callName(f, live(f.usr), "dropItemToGround", [live(S)]);
		if ((truthy(rt.fv(f, "client", live(f.usr))) && !isEqual(rt.fv(f, "s_active", live(f.usr)), live(f.src)))) {
			(rt.modField(f, rt.fv(f, "client", live(f.usr)), "screen", live(S), subtract));
		}
		yield* g.callName(f, live(S), "dropped", [live(f.usr)]);
		if (!truthy(rt.fv(f, "amount", live(S)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		} else {
			if (truthy(rt.fv(f, "pulledby", live(S)))) {
				yield* g.callName(f, rt.fv(f, "pulledby", live(S)), "stop_pulling", []);
			}
			rt.setFv(f, "loc", live(S), live(f.src));
		}
	}
	yield* g.srcCall(f, "orient2hud", live(f.usr));
	if (truthy(rt.fv(f, "s_active", live(f.usr)))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(f.usr)), "show_to", [live(f.usr)]);
	}
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/weapon/storage/bag/sheetsnatcher/proc/orient2hud  (code/game/objects/items/weapons/storage/bags.dm:218)  may sleep
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/orient2hud", function* orient2hud(f: Frame, user: Value) {
	let adjusted_contents: Value = null, numbered_contents: Value = null, I: Value = null, D: Value = null, row_num: Value = null, col_count: Value = null;
	let $e: any;
	f.vars = () => [user, adjusted_contents, numbered_contents, I, D, row_num, col_count, $e];
	adjusted_contents = rt.len(f, rt.sv(f, "contents"));
	numbered_contents = null;
	if (truthy(rt.sv(f, "display_contents_with_number"))) {
		numbered_contents = rt.list();
		adjusted_contents = 0;
		I = null;
		rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			adjusted_contents = rt.inc(live(adjusted_contents), 1);
			rt.setFv(f, "number", (D = (yield* g.new_(f, T("/datum/numbered_display"), [live(I)]))), rt.fv(f, "amount", live(I)));
			yield* g.callName(f, live(numbered_contents), "Add", [live(D)]);
		}
		rt.endFor(f, 0);
	}
	row_num = 0;
	col_count = subtract((yield* g.call(f, P("/proc/min"), null, [7, rt.sv(f, "storage_slots")])), 1);
	if (rt.gt(live(adjusted_contents), 7)) {
		row_num = (yield* g.call(f, P("/proc/round"), null, [divide(subtract(live(adjusted_contents), 1), 7)]));
	}
	yield* g.callName(f, live(f.src), "standard_orient_objs", [live(row_num), live(col_count), live(numbered_contents)]);
	return live(f.dot);
}, true);

// /obj/item/weapon/storage/bag/sheetsnatcher/quick_empty  (code/game/objects/items/weapons/storage/bags.dm:236)  may sleep
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/quick_empty", function* quick_empty(f: Frame) {
	let location: Value = null, S: Value = null, N: Value = null, stacksize: Value = null;
	let $e: any;
	f.vars = () => [location, S, N, stacksize, $e];
	location = rt.getStep(f, live(f.src), 0);
	S = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item/stack/sheet"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		while (truthy(rt.fv(f, "amount", live(S)))) {
			N = (yield* g.new_(f, rt.fv(f, "type", live(S)), [live(location)]));
			stacksize = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "amount", live(S)), rt.fv(f, "max_amount", live(N))]));
			rt.setFv(f, "amount", live(N), live(stacksize));
			(rt.modField(f, live(S), "amount", live(stacksize), subtract));
		}
		if (!truthy(rt.fv(f, "amount", live(S)))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "orient2hud", live(f.usr));
	if (truthy(rt.fv(f, "s_active", live(f.usr)))) {
		yield* g.callName(f, rt.fv(f, "s_active", live(f.usr)), "show_to", [live(f.usr)]);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { verb: { name: "Empty Contents", category: "Object" } });

// /obj/item/weapon/storage/bag/sheetsnatcher/proc/remove_from_storage  (code/game/objects/items/weapons/storage/bags.dm:252)  may sleep
rt.def("/obj/item/weapon/storage/bag/sheetsnatcher/proc/remove_from_storage", function* remove_from_storage(f: Frame, W: Value, new_location: Value) {
	let S: Value = null, temp: Value = null;
	f.vars = () => [W, new_location, S, temp];
	if (!truthy((rt.istype((S = live(W)), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		return 0;
	}
	if (rt.gt(rt.fv(f, "amount", live(S)), rt.fv(f, "max_amount", live(S)))) {
		rt.setFv(f, "amount", (temp = (yield* g.new_(f, rt.fv(f, "type", live(S)), [live(f.src)]))), subtract(rt.fv(f, "amount", live(S)), rt.fv(f, "max_amount", live(S))));
		rt.setFv(f, "amount", live(S), rt.fv(f, "max_amount", live(S)));
	}
	return (yield* g.callSuper(f, [live(S), live(new_location)]));
}, true);

rt.type(5537, "/obj/item/weapon/storage/bag/books", "/obj/item/weapon/storage/bag", {
	name: "book bag",
	desc: "A bag for books.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "bookbag",
	display_contents_with_number: 0,
	storage_slots: 7,
	max_combined_w_class: 21,
	max_w_class: 3,
	w_class: 4,
	resistance_flags: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/bag/books/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:291)
rt.def("/obj/item/weapon/storage/bag/books/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/book"), T("/obj/item/weapon/storage/book"), T("/obj/item/weapon/spellbook")));
	return f.dot;
});

rt.type(5538, "/obj/item/weapon/storage/bag/tray", "/obj/item/weapon/storage/bag", {
	throw_speed: 3,
	throw_range: 5,
	flags: 64,
	name: "tray",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "tray",
	desc: "A metal tray to lay food on.",
	force: 5,
	throwforce: 10,
	w_class: 4,
	materials: null,
	preposition: "on",
});

// /obj/item/weapon/storage/bag/tray/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:308)
rt.def("/obj/item/weapon/storage/bag/tray/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 3000]));
	return f.dot;
});

// /obj/item/weapon/storage/bag/tray/proc/attack  (code/game/objects/items/weapons/storage/bags.dm:312)  may sleep
rt.def("/obj/item/weapon/storage/bag/tray/proc/attack", function* attack(f: Frame) {
	let oldContents: Value = null, I: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [oldContents, I, i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	oldContents = (yield* g.callName(f, rt.sv(f, "contents"), "Copy", []));
	yield* g.srcCall(f, "quick_empty");
	I = null;
	rt.forList(f, 0, live(oldContents), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.spawnTail(f, 0, "/obj/item/weapon/storage/bag/tray/proc/attack: spawn at game/objects/items/weapons/storage/bags.dm:319", oldContents, I, i);
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/items/trayhit1.ogg"), 50, 1]);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/items/trayhit2.ogg"), 50, 1]);
	}
	if (!(truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/monkey")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [10]))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "Knockdown", [40]);
	return f.dot;
}, true, { args: ["M", "user"] });

// a spawn(0) body of /obj/item/weapon/storage/bag/tray/proc/attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/storage/bag/tray/proc/attack: spawn at game/objects/items/weapons/storage/bags.dm:319", function* (f: Frame, oldContents: Value, I: Value, i: Value) {
	f.vars = () => [oldContents, I, i];
	i = null;
	i = 1;
	while (rt.le(live(i), (yield* g.call(f, P("/proc/rand"), null, [1, 2])))) {
		if (truthy(live(I))) {
			yield* g.call(f, P("/proc/step"), null, [live(I), rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
			yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [2, 4]))]);
		}
		i = rt.inc(live(i), 1);
	}
	return null;
});

// /obj/item/weapon/storage/bag/tray/proc/rebuild_overlays  (code/game/objects/items/weapons/storage/bags.dm:335)
rt.def("/obj/item/weapon/storage/bag/tray/proc/rebuild_overlays", function rebuild_overlays(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	rt.callSrc(f, "cut_overlays", []);
	I = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(I)), rt.fv(f, "icon_state", live(I))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/storage/bag/tray/proc/remove_from_storage  (code/game/objects/items/weapons/storage/bags.dm:340)  may sleep
rt.def("/obj/item/weapon/storage/bag/tray/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "rebuild_overlays");
	return f.dot;
}, true, { args: ["W", "new_location"] });

// /obj/item/weapon/storage/bag/tray/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/bags.dm:344)  may sleep
rt.def("/obj/item/weapon/storage/bag/tray/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(f.args[0])), rt.fv(f, "icon_state", live(f.args[0]))])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["I", "prevent_warning"] });

rt.type(5539, "/obj/item/weapon/storage/bag/chemistry", "/obj/item/weapon/storage/bag", {
	name: "chemistry bag",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bag",
	desc: "A bag for storing pills, patches, and bottles.",
	storage_slots: 50,
	max_combined_w_class: 200,
	w_class: 1,
	preposition: "in",
	resistance_flags: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/bag/chemistry/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:361)
rt.def("/obj/item/weapon/storage/bag/chemistry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/pill"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle")));
	return f.dot;
});

rt.type(5540, "/obj/item/weapon/storage/bag/bio", "/obj/item/weapon/storage/bag", {
	name: "bio bag",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "biobag",
	desc: "A bag for the safe transportation and disposal of biowaste and other biological materials.",
	storage_slots: 25,
	max_combined_w_class: 200,
	w_class: 1,
	preposition: "in",
	resistance_flags: 4,
	can_hold: null,
});

// /obj/item/weapon/storage/bag/bio/proc/<init>  (code/game/objects/items/weapons/storage/bags.dm:377)
rt.def("/obj/item/weapon/storage/bag/bio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/slime_extract"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"), T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/reagent_containers/hypospray/medipen"), T("/obj/item/trash/deadmouse"), T("/obj/item/weapon/reagent_containers/food/snacks/monkeycube")));
	return f.dot;
});
