// Based on /tg/station's code/modules/paperwork/stamps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7626, "/obj/item/weapon/stamp", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 7,
	pressure_resistance: 2,
	name: "１GRANTED rubber stamp",
	desc: "A rubber stamp for stamping important documents.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "stamp-ok",
	item_state: "stamp",
	throwforce: 0,
	w_class: 1,
	materials: null,
	item_color: "cargo",
	attack_verb: null,
});

// stamps.dm:11
rt.def("/obj/item/weapon/stamp/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 60]);

	this.attack_verb = list("stamped");
	return f.dot;
});

// stamps.dm:17
rt.def("/obj/item/weapon/stamp/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} stamps 'VOID' on ${user.p_their()} forehead, then promptly falls over, dead.</span>`);
	return 8;
});

// stamps.dm:71
rt.def("/obj/item/weapon/stamp/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

rt.type(7637, "/obj/item/weapon/stamp/chameleon", "/obj/item/weapon/stamp", {
	stamp_types: null,
	stamp_names: null,
	actions_types: null,
});

// stamps.dm:76
rt.def("/obj/item/weapon/stamp/chameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle"));
	return f.dot;
});

// stamps.dm:82
rt.def("/obj/item/weapon/stamp/chameleon/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null, stamp_type: Value = null;
	f.dot = (yield* parent_proc());
	this.stamp_types = typesof(T("/obj/item/weapon/stamp")) - this.type;
	this.stamp_names = list();
	for (i of each(this.stamp_types)) {
		this.stamp_names += rt.initial(f, (stamp_type = i), "name");
	}
	this.stamp_names = (yield* sortList(this.stamp_names));
	return f.dot;
}, true);

// stamps.dm:94
rt.def("/obj/item/weapon/stamp/chameleon/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	this.change_to(pick(this.stamp_types));
	return f.dot;
});

// stamps.dm:97
rt.def("/obj/item/weapon/stamp/chameleon/proc/change_to", function change_to(f: Frame, stamp_type: Value) {
	this.name = rt.initial(f, stamp_type, "name");
	this.icon_state = rt.initial(f, stamp_type, "icon_state");
	this.item_color = rt.initial(f, stamp_type, "item_color");
	return f.dot;
});

// stamps.dm:102
rt.def("/obj/item/weapon/stamp/chameleon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let stamp_type: Value = null, i: Value = null;
	let input_stamp: Value = (yield* g.op(f, "Prompt", [1], [null, "Choose a stamp.", "Choose a stamp to disguise as.", user, this.stamp_names]));
	if (!(user && rt.isIn(f, this, user.contents) && input_stamp)) return f.dot;
	for (i of each(this.stamp_types)) {
		if (rt.initial(f, (stamp_type = i), "name") == input_stamp) {
			break;
		}
	}
	yield* this.change_to(stamp_type);
	return f.dot;
}, true);
