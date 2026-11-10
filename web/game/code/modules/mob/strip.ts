// tg_js: the strip menu (drag yourself onto another mob) as one `strip` tgui window, after modern tg's StripMenu.
// Replaces the old HTML popups (window=mob) of show_inv on humans, monkeys/carbons, aliens, Ian and the parrot.
// Each mob kind gives its rows in strip_rows(user); the window sends every click back through the mob's own Topic
// (item=SLOT, pockets=, internal=, pouches=, remove_inv=, add_inv=), so strip delays, stripPanelUnequip/Equip and the
// canUseTopic/adjacency checks stay where they were. DM originals: code/modules/mob/living/carbon/{carbon,human/human,
// alien/humanoid/humanoid}.dm, simple_animal/friendly/dog.dm, simple_animal/parrot.dm (show_inv + Topic).
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, truthy, isEqual, add, fmt } = rt;

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
	rt.setAt(E, "item", item && !rt.bitAnd(rt.fv(f, "flags", item), 128) ? fmt("＀", [item]) : null);
	rt.setAt(E, "obscured", obscured ? 1 : 0);
	rt.setAt(E, "plain", plain ? 1 : 0);
	const bl = rt.list();
	for (const b of buttons) rt.modify(bl, rt.list(b), add);
	rt.setAt(E, "buttons", bl);
	rt.modify(rows, rt.list(E), add);
}

// The take / put button of an item slot: Take when something is there, Equip (put your held item on) when not.
function slotBtns(f: Frame, item: Value, key: string, val: any, hand: any = "") {
	const has = truthy(item) && !rt.bitAnd(rt.fv(f, "flags", item), 128);
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
	return list();
}, true);

// /mob/proc/ui_interact  (tg_js, after modern tg's StripMenu)  may sleep
rt.def("/mob/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "strip", this.name, 400, 520, master_ui, state))).open();
	return f.dot;
}, true);

// Added by tg_js.
rt.def("/mob/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = list();
	rt.setAt(data, "name", `${this.name}`);
	rt.setAt(data, "rows", yield* this.strip_rows(user));
	return data;
}, true);

// /mob/proc/ui_act  (tg_js)  may sleep
// One action, "strip": params key/val/hand are the old href (item=SLOT;hand_index=N, pockets=left, internal=1 ...).
rt.def("/mob/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action !== "strip") {
		return 0;
	}
	const hand = rt.at(params, "hand");
	const href: any = [rt.at(params, "key"), rt.at(params, "val")];
	if (hand !== "" && hand !== null) href.push("hand_index", hand);
	yield* this.Topic("", rt.alist(f, href));
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /mob/living/carbon/proc/strip_rows  (tg_js; carbon.dm:184 show_inv)  monkeys and other carbons
rt.def("/mob/living/carbon/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	const rows = list();
	const mask = this.wear_mask, back = this.back;
	addRow(f, rows, "Head", this.head, slotBtns(f, this.head, "item", 11));
	addRow(f, rows, "Mask", mask, slotBtns(f, mask, "item", 2));
	addRow(f, rows, "Neck", this.wear_neck, slotBtns(f, this.wear_neck, "item", 10));
	yield* heldRows(f, rows);
	const bb = slotBtns(f, back, "item", 1);
	if (rt.istype(mask, T("/obj/item/clothing/mask")) && rt.istype(back, T("/obj/item/weapon/tank"))) {
		bb.push(btn(this.internal ? "Disable Internals" : "Set Internals", "cloud", "internal", 1));
	}
	addRow(f, rows, "Back", back, bb);
	if (this.handcuffed) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (this.legcuffed) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/carbon/human/proc/strip_rows  (tg_js; human.dm:123 show_inv)
rt.def("/mob/living/carbon/human/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	const rows = list();
	const obscured = this.check_obscured_slots();
	const hidden = (slot: any) => truthy(rt.isIn(f, slot, obscured));
	const mask = this.wear_mask;
	const has_breathable_mask = truthy(rt.istype(mask, T("/obj/item/clothing/mask")));
	const tankBtns = (item: Value, slot: any) => {
		const b = slotBtns(f, item, "item", slot);
		if (has_breathable_mask && rt.istype(item, T("/obj/item/weapon/tank"))) {
			b.push(btn(this.internal ? "Disable Internals" : "Set Internals", "cloud", "internal", slot));
		}
		return b;
	};
	yield* heldRows(f, rows);
	addRow(f, rows, "Back", this.back, tankBtns(this.back, 1));
	// [label, variable, slot, covering slot or 0]
	const table: any = [
		["Head", "head", 11, 0], ["Mask", "wear_mask", 2, 2], ["Neck", "wear_neck", 10, 10],
		["Eyes", "glasses", 8, 8], ["Ears", "ears", 7, 7], ["Exosuit", "wear_suit", 13, 0],
	];
	for (const [label, v, slot, cover] of table) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, cover ? slotBtns(f, item, "item", slot) : slotBtns(f, item, "item", slot), cover !== 0 && hidden(cover));
	}
	if (this.wear_suit) {
		addRow(f, rows, "Suit Storage", this.s_store, tankBtns(this.s_store, 17));
	} else {
		addRow(f, rows, "Suit Storage", null, [], true);
	}
	const clothes: any = [["Shoes", "shoes", 12], ["Gloves", "gloves", 9], ["Uniform", "w_uniform", 14]];
	for (const [label, v, slot] of clothes) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, slotBtns(f, item, "item", slot), hidden(slot));
	}
	if (this.w_uniform === null && !(this.dna && this.dna.species.nojumpsuit) || hidden(14)) {
		addRow(f, rows, "Pockets", null, [], true);
		addRow(f, rows, "ID", null, [], true);
		addRow(f, rows, "Belt", null, [], true);
	} else {
		addRow(f, rows, "Belt", this.belt, tankBtns(this.belt, 5));
		const l = truthy(this.l_store) && !rt.bitAnd(this.l_store.flags, 128);
		const r = truthy(this.r_store) && !rt.bitAnd(this.r_store.flags, 128);
		addRow(f, rows, "Pockets", null, [btn(l ? "Left (Full)" : "Left (Empty)", "suitcase", "pockets", "left"), btn(r ? "Right (Full)" : "Right (Empty)", "suitcase", "pockets", "right")], false, true);
		addRow(f, rows, "ID", this.wear_id, slotBtns(f, this.wear_id, "item", 6));
	}
	if (this.handcuffed) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (this.legcuffed) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/carbon/alien/humanoid/proc/strip_rows  (tg_js; humanoid.dm:37 show_inv)
rt.def("/mob/living/carbon/alien/humanoid/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	const rows = list();
	yield* heldRows(f, rows);
	addRow(f, rows, "Pouches", null, [btn("Empty Pouches", "hand-paper-o", "pouches", 1)], false, true);
	if (this.handcuffed) addRow(f, rows, "Handcuffed", null, [btn("Remove", "chain-broken", "item", 3)], false, true);
	if (this.legcuffed) addRow(f, rows, "Legcuffed", null, [btn("Remove", "chain-broken", "item", 19)], false, true);
	return rows;
}, true);

// /mob/living/simple_animal/pet/dog/corgi/proc/strip_rows  (tg_js; dog.dm:64 show_inv)
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	const rows = list();
	const slots: any = [["Head", "inventory_head", "head"], ["Back", "inventory_back", "back"]];
	for (const [label, v, key] of slots) {
		const item = rt.sv(f, v);
		addRow(f, rows, label, item, [item ? btn("Remove", "hand-paper-o", "remove_inv", key) : btn("Equip", "hand-grab-o", "add_inv", key)]);
	}
	return rows;
}, true);

// /mob/living/simple_animal/parrot/proc/strip_rows  (tg_js; parrot.dm:184 show_inv)
rt.def("/mob/living/simple_animal/parrot/proc/strip_rows", function* strip_rows(f: Frame, user: Value) {
	const rows = list();
	const item = this.ears;
	addRow(f, rows, "Headset", item, [item ? btn("Remove", "hand-paper-o", "remove_inv", "ears") : btn("Equip", "hand-grab-o", "add_inv", "ears")]);
	return rows;
}, true);
