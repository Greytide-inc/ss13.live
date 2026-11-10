// Based on /tg/station's code/modules/clothing/masks/breath.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8541, "/obj/item/clothing/mask/breath", "/obj/item/clothing/mask", {
	flags: 8,
	desc: "A close-fitting mask that can be connected to an air supply.",
	name: "breath mask",
	icon_state: "breath",
	item_state: "m_mask",
	body_parts_covered: 0,
	visor_flags: 8,
	w_class: 2,
	gas_transfer_coefficient: 0.1,
	permeability_coefficient: 0.5,
	actions_types: null,
	flags_cover: 8,
	visor_flags_cover: 8,
	resistance_flags: 0,
});

// breath.dm:12
rt.def("/obj/item/clothing/mask/breath/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// breath.dm:18
rt.def("/obj/item/clothing/mask/breath/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.adjustmask(user);
	return f.dot;
}, true);

// breath.dm:21
rt.def("/obj/item/clothing/mask/breath/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	yield* parent_proc();
	if (!(yield* user.canUseTopic(this, { be_close: 1 }))) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	} else {
		yield* this.adjustmask(user);
	}
	return f.dot;
}, true);

// breath.dm:29
rt.def("/obj/item/clothing/mask/breath/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Alt-click ${this} to adjust it.</span>`);
	return f.dot;
}, false);
