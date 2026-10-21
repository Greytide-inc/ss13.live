// tg_js: the strip menu (drag yourself onto another mob) as one `strip` tgui window, after modern tg's StripMenu.
// Replaces the old HTML popups (window=mob) of show_inv on humans, monkeys/carbons, aliens, Ian and the parrot.
// Each mob kind gives its rows in strip_rows(user); the window sends every click back through the mob's own Topic
// (item=SLOT, pockets=, internal=, pouches=, remove_inv=, add_inv=), so strip delays, stripPanelUnequip/Equip and the
// canUseTopic/adjacency checks stay where they were. DM originals: code/modules/mob/living/carbon/{carbon,human/human,
// alien/humanoid/humanoid}.dm, simple_animal/friendly/dog.dm, simple_animal/parrot.dm (show_inv + Topic).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, fmt } = rt;

// One button: {text, icon, key, val, hand}. key/val/hand become the href the old Topic got.
function btn(text: string, icon: string, key: string, val: any, hand: any = "") {
	const b = rt.list();
	rt.setAt(b, "text", text);
	rt.setAt(b, "icon", icon);
	rt.setAt(b, "key", key);
	rt.setAt(b, "val", String(val));
	rt.setAt(b, "hand", String(hand));
	return b;
}

// One row: label, the item's name (null = Empty), buttons, obscured (greyed out), plain (no item text, buttons only).
function addRow(f: Frame, rows: Value, label: string, item: Value, buttons: any, obscured = false, plain = false) {
	const E = rt.list();
	rt.setAt(E, "label", label);
	// ABSTRACT items (flags & 128) are invisible to the strip menu, as in the old window.
	rt.setAt(E, "item", (truthy(item) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(item)), 128))) ? fmt("＀", [live(item)]) : null);
	rt.setAt(E, "obscured", obscured ? 1 : 0);
	rt.setAt(E, "plain", plain ? 1 : 0);
	const bl = rt.list();
	for (const b of buttons) rt.modify(bl, rt.list(b), add);
	rt.setAt(E, "buttons", bl);
	rt.modify(rows, rt.list(E), add);
}

// The take / put button of an item slot: Take when something is there, Equip (put your held item on) when not.
function slotBtns(f: Frame, item: Value, key: string, val: any, hand: any = "") {
	const has = truthy(item) && !truthy(rt.bitAnd(rt.fv(f, "flags", live(item)), 128));
	return [has ? btn("Take", "hand-paper-o", key, val, hand) : btn("Equip", "hand-grab-o", key, val, hand)];
}

// Rows for the held items (both hands), shared by humans, carbons and aliens.
function* heldRows(f: Frame, rows: Value) {
	const n = rt.len(f, rt.sv(f, "held_items"));
	for (let i = 1; i <= n; i++) {
		const I = yield* g.srcCall(f, "get_item_for_held_index", i);
		const name = yield* g.srcCall(f, "get_held_index_name", i);
		addRow(f, rows, fmt("＀", [name]), I, slotBtns(f, I, "item", 4, i));
	}
}

// /mob/proc/strip_rows  (tg_js)  overridden per mob kind
rt.def("/mob/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	return rt.list();
}, true);

// /mob/proc/ui_interact  (tg_js, after modern tg's StripMenu)  may sleep
rt.def("/mob/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "strip", rt.sv(f, "name"), 400, 520, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /mob/proc/ui_data  (tg_js)  may sleep
rt.def("/mob/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [user, data];
	data = rt.list();
	rt.setAt(live(data), "name", fmt("＀", [rt.sv(f, "name")]));
	rt.setAt(live(data), "rows", yield* g.srcCall(f, "strip_rows", live(user)));
	return live(data);
}, true);

// /mob/proc/ui_act  (tg_js)  may sleep
// One action, "strip": params key/val/hand are the old href (item=SLOT;hand_index=N, pockets=left, internal=1 ...).
rt.def("/mob/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action !== "strip") {
		return 0;
	}
	const hand = rt.at(live(params), "hand");
	const href: any = [rt.at(live(params), "key"), rt.at(live(params), "val")];
	if (hand !== "" && hand !== null) href.push("hand_index", hand);
	yield* g.srcCall(f, "Topic", "", rt.alist(f, href));
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /mob/living/carbon/proc/strip_rows  (tg_js; carbon.dm:184 show_inv)  monkeys and other carbons
rt.def("/mob/living/carbon/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	const rows = rt.list();
	const mask = rt.sv(f, "wear_mask"), back = rt.sv(f, "back");
	addRow(f, rows, "Head", rt.sv(f, "head"), slotBtns(f, rt.sv(f, "head"), "item", 11));
	addRow(f, rows, "Mask", mask, slotBtns(f, mask, "item", 2));
	addRow(f, rows, "Neck", rt.sv(f, "wear_neck"), slotBtns(f, rt.sv(f, "wear_neck"), "item", 10));
	yield* heldRows(f, rows);
	const bb = slotBtns(f, back, "item", 1);
	if (truthy(rt.istype(mask, T("/obj/item/clothing/mask")) ? 1 : 0) && truthy(rt.istype(back, T("/obj/item/weapon/tank")) ? 1 : 0)) {
		bb.push(btn(truthy(rt.sv(f, "internal")) ? "Disable Internals" : "Set Internals", "cloud", "internal", 1));
	}
	addRow(f, rows, "Back", back, bb);
	if (truthy(rt.sv(f, "handcuffed"))) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (truthy(rt.sv(f, "legcuffed"))) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/carbon/human/proc/strip_rows  (tg_js; human.dm:123 show_inv)
rt.def("/mob/living/carbon/human/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	const rows = rt.list();
	const obscured = yield* g.srcCall(f, "check_obscured_slots");
	const hidden = (slot: any) => truthy(rt.isIn(f, slot, live(obscured)) ? 1 : 0);
	const mask = rt.sv(f, "wear_mask");
	const has_breathable_mask = truthy(rt.istype(mask, T("/obj/item/clothing/mask")) ? 1 : 0);
	const tankBtns = (item: Value, slot: any) => {
		const b = slotBtns(f, item, "item", slot);
		if (has_breathable_mask && truthy(rt.istype(item, T("/obj/item/weapon/tank")) ? 1 : 0)) {
			b.push(btn(truthy(rt.sv(f, "internal")) ? "Disable Internals" : "Set Internals", "cloud", "internal", slot));
		}
		return b;
	};
	yield* heldRows(f, rows);
	addRow(f, rows, "Back", rt.sv(f, "back"), tankBtns(rt.sv(f, "back"), 1));
	// [label, variable, slot, covering slot or 0]
	const table: any = [
		["Head", "head", 11, 0], ["Mask", "wear_mask", 2, 2], ["Neck", "wear_neck", 10, 10],
		["Eyes", "glasses", 8, 8], ["Ears", "ears", 7, 7], ["Exosuit", "wear_suit", 13, 0],
	];
	for (const [label, v, slot, cover] of table) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, cover ? slotBtns(f, item, "item", slot) : slotBtns(f, item, "item", slot), cover !== 0 && hidden(cover));
	}
	if (truthy(rt.sv(f, "wear_suit"))) {
		addRow(f, rows, "Suit Storage", rt.sv(f, "s_store"), tankBtns(rt.sv(f, "s_store"), 17));
	} else {
		addRow(f, rows, "Suit Storage", null, [], true);
	}
	const clothes: any = [["Shoes", "shoes", 12], ["Gloves", "gloves", 9], ["Uniform", "w_uniform", 14]];
	for (const [label, v, slot] of clothes) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, slotBtns(f, item, "item", slot), hidden(slot));
	}
	if ((rt.sv(f, "w_uniform") === null && !(truthy(rt.sv(f, "dna")) && truthy(rt.gv(f, "nojumpsuit", rt.fv(f, "species", rt.sv(f, "dna")))))) || hidden(14)) {
		addRow(f, rows, "Pockets", null, [], true);
		addRow(f, rows, "ID", null, [], true);
		addRow(f, rows, "Belt", null, [], true);
	} else {
		addRow(f, rows, "Belt", rt.sv(f, "belt"), tankBtns(rt.sv(f, "belt"), 5));
		const l = truthy(rt.sv(f, "l_store")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "l_store")), 128));
		const r = truthy(rt.sv(f, "r_store")) && !truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "r_store")), 128));
		addRow(f, rows, "Pockets", null, [btn(l ? "Left (Full)" : "Left (Empty)", "suitcase", "pockets", "left"), btn(r ? "Right (Full)" : "Right (Empty)", "suitcase", "pockets", "right")], false, true);
		addRow(f, rows, "ID", rt.sv(f, "wear_id"), slotBtns(f, rt.sv(f, "wear_id"), "item", 6));
	}
	if (truthy(rt.sv(f, "handcuffed"))) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (truthy(rt.sv(f, "legcuffed"))) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/carbon/alien/humanoid/proc/strip_rows  (tg_js; humanoid.dm:37 show_inv)
rt.def("/mob/living/carbon/alien/humanoid/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	const rows = rt.list();
	yield* heldRows(f, rows);
	addRow(f, rows, "Pouches", null, [btn("Empty Pouches", "hand-paper-o", "pouches", 1)], false, true);
	if (truthy(rt.sv(f, "handcuffed"))) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (truthy(rt.sv(f, "legcuffed"))) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/strip_rows  (tg_js; dog.dm:64 show_inv)
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	const rows = rt.list();
	const slots: any = [["Head", "inventory_head", "head"], ["Back", "inventory_back", "back"]];
	for (const [label, v, key] of slots) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, [truthy(item) ? btn("Remove", "hand-paper-o", "remove_inv", key) : btn("Equip", "hand-grab-o", "add_inv", key)]);
	}
	return rows;
}, true);

// /mob/living/simple_animal/parrot/proc/strip_rows  (tg_js; parrot.dm:184 show_inv)
rt.def("/mob/living/simple_animal/parrot/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	f.vars = () => [user];
	const rows = rt.list();
	const item = rt.sv(f, "ears");
	addRow(f, rows, "Headset", item, [truthy(item) ? btn("Remove", "hand-paper-o", "remove_inv", "ears") : btn("Equip", "hand-grab-o", "add_inv", "ears")]);
	return rows;
}, true);
