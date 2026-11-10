// Based on /tg/station's code/game/objects/items/weapons/implants/implant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7399, "/obj/item/weapon/implant", "/obj/item/weapon", {
	activated: 1,
	imp_in: null,
	allow_multiple: 0,
	uses: -1,
	flags: 16384,
	name: "implant",
	icon: rt.rsc("icons/obj/implants.dmi"),
	icon_state: "generic",
	origin_tech: "materials=2;biotech=3;programming=2",
	actions_types: null,
	item_color: "b",
});

// implant.dm:6
rt.def("/obj/item/weapon/implant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/hands_free/activate"));
	return f.dot;
});

// implant.dm:22
rt.def("/obj/item/weapon/implant/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.activate("action_button");
	return f.dot;
}, true);

// implant.dm:42
rt.def("/obj/item/weapon/implant/proc/implant", function* implant(f: Frame, target: Value, user: Value, silent: Value) {
	let X: Value = null, imp_e: Value = null, A: Value = null, H: Value = null;
	silent ??= 0;
	if (!target.implants) {
		target.implants = list();
	}
	if (!target.can_be_implanted() || !this.can_be_implanted_in(target)) {
		return 0;
	}
	for (X of each(target.implants)) {
		if (rt.op(f, "IsType", [], [X, this.type])) {
			imp_e = X;
			if (!this.allow_multiple) {
				if (imp_e.uses < rt.initial(f, imp_e, "uses") * 2) {
					if (this.uses == -1) {
						imp_e.uses = -1;
					} else {
						imp_e.uses = min(imp_e.uses + this.uses, rt.initial(f, imp_e, "uses") * 2);
					}
					yield* qdel(this);
					return 1;
				} else {
					return 0;
				}
			}
		}
	}
	this.loc = target;
	this.imp_in = target;
	target.implants += this;
	if (this.activated) {
		X = null;
		for (X of each(this.actions)) {
			yield* (A = X).Grant(target);
		}
	}
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		(H = target).sec_hud_set_implants();
	}
	if (user) {
		yield* add_logs(user, target, "implanted", { object: `${this.name}` });
	}
	return 1;
}, true);

// implant.dm:76
rt.def("/obj/item/weapon/implant/proc/removed", function* removed(f: Frame, source: Value, silent: Value, special: Value) {
	let X: Value = null, A: Value = null, H: Value = null;
	silent ??= 0;
	special ??= 0;
	this.loc = null;
	this.imp_in = null;
	source.implants -= this;
	for (X of each(this.actions)) {
		yield* (A = X).Grant(source);
	}
	if (rt.istype(source, T("/mob/living/carbon/human"))) {
		(H = source).sec_hud_set_implants();
	}
	return 1;
}, true);

// implant.dm:90
rt.def("/obj/item/weapon/implant/proc/Destroy", function* Destroy(f: Frame) {
	if (this.imp_in) {
		yield* this.removed(this.imp_in);
	}
	return (yield* parent_proc());
}, true);

// implant.dm:94
rt.def("/obj/item/weapon/implant/proc/get_data", function get_data(f: Frame) {
	return "No information available";
});

// implant.dm:98
rt.def("/obj/item/weapon/implant/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);
