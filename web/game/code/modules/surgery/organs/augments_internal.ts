// Based on /tg/station's code/modules/surgery/organs/augments_internal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9487, "/obj/item/organ/cyberimp", "/obj/item/organ", {
	implant_color: "#FFFFFF",
	implant_overlay: null,
	name: "cybernetic implant",
	desc: "a state-of-the-art implant that improves a baseline's functionality",
	status: 2,
});

// augments_internal.dm:11
rt.def("/obj/item/organ/cyberimp/proc/New", function* New(f: Frame) {
	let overlay: Value = null;
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
		yield* this.Insert(f.args[0]);
	}
	if (this.implant_overlay) {
		(overlay = mutable_appearance(this.icon, this.implant_overlay)).color = this.implant_color;
		this.add_overlay(overlay);
	}
	return (yield* parent_proc());
}, true, { args: ["M"] });

rt.type(9511, "/obj/item/organ/cyberimp/brain", "/obj/item/organ/cyberimp", {
	implant_overlay: "brain_implant_overlay",
	name: "cybernetic brain implant",
	desc: "injectors of extra sub-routines for the brain",
	icon_state: "brain_implant",
	zone: "head",
	w_class: 1,
});

// augments_internal.dm:32
rt.def("/obj/item/organ/cyberimp/brain/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!this.owner) {
		return f.dot;
	}
	let stun_amount: Value = 200 / severity;
	yield* this.owner.Stun(stun_amount);
	to_chat(this.owner, "<span class='warning'>Your body seizes up!</span>");
	return stun_amount;
}, true);

rt.type(9512, "/obj/item/organ/cyberimp/brain/anti_drop", "/obj/item/organ/cyberimp/brain", {
	active: 0,
	stored_items: null,
	implant_color: "#DE7E00",
	name: "anti-drop implant",
	desc: "This cybernetic brain implant will allow you to force your hand muscles to contract, preventing item dropping. Twitch ear to toggle.",
	slot: "brain_antidrop",
	origin_tech: "materials=4;programming=5;biotech=4",
	actions_types: null,
});

// augments_internal.dm:44
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_items = list();

	this.actions_types = list(T("/datum/action/item_action/organ_action/toggle"));
	return f.dot;
});

// augments_internal.dm:51
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/ui_action_click", function ui_action_click(f: Frame) {
	let I: Value = null, L: Value = null, I_1: Value = null;
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		for (I of each(this.owner.held_items, T("/obj/item"))) {
			if (!rt.bitAnd(I.flags, NODROP)) {
				this.stored_items += I;
			}
		}
		if (rt.length((L = this.owner.get_empty_held_indexes())) == rt.len(f, this.owner.held_items)) {
			to_chat(this.owner, "<span class='notice'>You are not holding any items, your hands relax...</span>");
			this.active = 0;
			this.stored_items = list();
		} else {
			for (I_1 of each(this.stored_items, T("/obj/item"))) {
				to_chat(this.owner, `<span class='notice'>Your ${this.owner.get_held_index_name(this.owner.get_held_index_of_item(I_1))}'s grip tightens.</span>`);
				(rt.modField(f, I_1, "flags", NODROP, rt.bitOr));
			}
		}
	} else {
		this.release_items();
		to_chat(this.owner, "<span class='notice'>Your hands relax...</span>");
	}
	return f.dot;
});

// augments_internal.dm:73
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let A: Value = null, I: Value = null;
	let $e: any;
	if (!this.owner) {
		return f.dot;
	}
	let range: Value = severity ? 10 : 5;
	if (this.active) {
		this.release_items();
	}
	yield* parent_proc();
	for (I of each(this.stored_items, T("/obj/item"))) {
		A = pick(oview(range));
		yield* I.throw_at(A, range, 2);
		to_chat(this.owner, `<span class='warning'>Your ${this.owner.get_held_index_name(this.owner.get_held_index_of_item(I))} spasms and throws the ${I.name}!</span>`);
	}
	this.stored_items = list();
	return f.dot;
}, true);

// augments_internal.dm:88
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/release_items", function release_items(f: Frame) {
	let I: Value = null;
	for (I of each(this.stored_items, T("/obj/item"))) {
		(rt.modField(f, I, "flags", 16777213, rt.bitAnd));
	}
	return f.dot;
});

// augments_internal.dm:94
rt.def("/obj/item/organ/cyberimp/brain/anti_drop/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.active) {
		yield* this.ui_action_click();
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(9513, "/obj/item/organ/cyberimp/brain/anti_stun", "/obj/item/organ/cyberimp/brain", {
	implant_color: "#FFFF00",
	name: "CNS Rebooter implant",
	desc: "This implant will automatically give you back control over your central nervous system, reducing downtime when stunned.",
	slot: "brain_antistun",
	origin_tech: "materials=5;programming=4;biotech=5",
});

// augments_internal.dm:106
rt.def("/obj/item/organ/cyberimp/brain/anti_stun/proc/on_life", function* on_life(f: Frame) {
	yield* parent_proc();
	if (this.crit_fail) {
		return f.dot;
	}
	if (this.owner.AmountStun() > STUN_SET_AMOUNT) {
		yield* this.owner.SetStun(STUN_SET_AMOUNT);
	}
	if (!(this.owner.AmountKnockdown() > STUN_SET_AMOUNT)) return f.dot;
	yield* this.owner.SetKnockdown(STUN_SET_AMOUNT);
	return f.dot;
}, true);

// augments_internal.dm:119
rt.def("/obj/item/organ/cyberimp/brain/anti_stun/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.crit_fail) {
		return f.dot;
	}
	this.crit_fail = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/cyberimp/brain/anti_stun/proc/reboot"))), 90 / severity);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9515, "/obj/item/organ/cyberimp/mouth/breathing_tube", "/obj/item/organ/cyberimp/mouth", {
	name: "breathing tube implant",
	desc: "This simple implant adds an internals connector to your back, allowing you to use internals without a mask and protecting you from being choked.",
	icon_state: "implant_mask",
	slot: "breathing_tube",
	w_class: 1,
	origin_tech: "materials=2;biotech=3",
});

// augments_internal.dm:139
rt.def("/obj/item/organ/cyberimp/mouth/breathing_tube/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	if (!prob(60 / severity)) return f.dot;
	to_chat(this.owner, "<span class='warning'>Your breathing tube suddenly closes!</span>");
	this.owner.losebreath += 2;
	return f.dot;
});

rt.type(5440, "/obj/item/weapon/storage/box/cyber_implants", "/obj/item/weapon/storage/box", {
	amount: 5,
	boxed: null,
	name: "boxed cybernetic implants",
	desc: "A sleek, sturdy box.",
	icon_state: "cyber_implants",
});

// augments_internal.dm:151
rt.def("/obj/item/weapon/storage/box/cyber_implants/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boxed = list(T("/obj/item/device/autosurgeon/thermal_eyes"), T("/obj/item/device/autosurgeon/xray_eyes"), T("/obj/item/device/autosurgeon/anti_stun"), T("/obj/item/device/autosurgeon/reviver"));
	return f.dot;
});

// augments_internal.dm:160
rt.def("/obj/item/weapon/storage/box/cyber_implants/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let implant: Value = null;
	while (rt.len(f, this.contents) <= this.amount) {
		implant = pick(this.boxed);
		yield* new_(implant, this);
	}
	return f.dot;
}, true);
