// Based on /tg/station's code/modules/reagents/reagent_containers/syringes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(6546, "/obj/item/weapon/reagent_containers/syringe", "/obj/item/weapon/reagent_containers", {
	mode: 0,
	busy: 0,
	proj_piercing: 0,
	amount_per_transfer_from_this: 5,
	possible_transfer_amounts: null,
	volume: 15,
	container_type: 8192,
	name: "syringe",
	desc: "A syringe that can hold up to 15 units.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "syringe_0",
	icon_state: "0",
	materials: null,
});

// syringes.dm:11
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible_transfer_amounts = list();
	this.materials = rt.alist(f, ["$metal", 10, "$glass", 20]);
	return f.dot;
});

// syringes.dm:20
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.list_reagents) return f.dot;
	this.mode = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// syringes.dm:26
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	this.update_icon();
	return f.dot;
});

// syringes.dm:29
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/pickup", function pickup(f: Frame, user: Value) {
	parent_proc();
	this.update_icon();
	return f.dot;
}, false);

// syringes.dm:33
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/dropped", function* dropped(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// syringes.dm:37
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.mode = (!this.mode ? 1 : 0);
	this.update_icon();
	return f.dot;
});

// syringes.dm:41
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// syringes.dm:45
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// syringes.dm:53
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let L: Value = null, M: Value = null, drawn_amount: Value = null, trans: Value = null, rinject: Value = null, R: Value = null, contained: Value = null, fraction: Value = null;
	let $e: any;
	if (this.busy) {
		return f.dot;
	}
	if (!proximity) {
		return f.dot;
	}
	if (!target.reagents) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living"))) {
		if (!(yield* (L = target).can_inject(user, 1))) {
			return f.dot;
		}
	}
	if (rt.istype(target, T("/mob/living/carbon/monkey")) && prob(MONKEY_SYRINGE_RETALIATION_PROB)) {
		yield* (M = target).retaliate(user);
	}
	if (this.mode === 0) {
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			to_chat(user, "<span class='notice'>The syringe is full.</span>");
			return f.dot;
		}
		if (L) {
			drawn_amount = this.reagents.maximum_volume - this.reagents.total_volume;
			if (target != user) {
				target.visible_message(`<span class='danger'>${user} is trying to take a blood sample from ${target}!</span>`, `<span class='userdanger'>${user} is trying to take a blood sample from ${target}!</span>`);
				this.busy = 1;
				if (!(yield* do_mob(user, target, { extra_checks: (yield* new_(T("/datum/callback"), L, P("/mob/living/proc/can_inject"), user, 1)) }))) {
					this.busy = 0;
					return f.dot;
				}
				if (this.reagents.total_volume >= this.reagents.maximum_volume) {
					return f.dot;
				}
			}
			this.busy = 0;
			if (yield* L.transfer_blood_to(this, drawn_amount)) {
				user.visible_message(`${user} takes a blood sample from ${L}.`);
			} else {
				to_chat(user, `<span class='warning'>You are unable to draw any blood from ${L}!</span>`);
			}
		} else {
			if (!target.reagents.total_volume) {
				to_chat(user, `<span class='warning'>${target} is empty!</span>`);
				return f.dot;
			}
			if (!(yield* target.is_drawable())) {
				to_chat(user, `<span class='warning'>You cannot directly remove reagents from ${target}!</span>`);
				return f.dot;
			}
			trans = (yield* target.reagents.trans_to(this, this.amount_per_transfer_from_this));
			to_chat(user, `<span class='notice'>You fill ${this} with ${trans} units of the solution.</span>`);
		}
		if (this.reagents.total_volume >= this.reagents.maximum_volume) {
			this.mode = (!this.mode ? 1 : 0);
			yield* this.update_icon();
		}
	} else if (this.mode === 1) {
		if (!this.reagents.total_volume) {
			to_chat(user, `<span class='notice'>${this} is empty.</span>`);
			return f.dot;
		}
		if (!(yield* target.is_injectable())) {
			to_chat(user, `<span class='warning'>You cannot directly fill ${target}!</span>`);
			return f.dot;
		}
		if (target.reagents.total_volume >= target.reagents.maximum_volume) {
			to_chat(user, `<span class='notice'>${target} is full.</span>`);
			return f.dot;
		}
		if (L) {
			if (L != user) {
				L.visible_message(`<span class='danger'>${user} is trying to inject ${L}!</span>`, `<span class='userdanger'>${user} is trying to inject ${L}!</span>`);
				if (!(yield* do_mob(user, L, { extra_checks: (yield* new_(T("/datum/callback"), L, P("/mob/living/proc/can_inject"), user, 1)) }))) {
					return f.dot;
				}
				if (!this.reagents.total_volume) {
					return f.dot;
				}
				if (L.reagents.total_volume >= L.reagents.maximum_volume) {
					return f.dot;
				}
				L.visible_message(`<span class='danger'>${user} injects ${L} with the syringe!`, `<span class='userdanger'>${user} injects ${L} with the syringe!`);
			}
			rinject = list();
			for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
				rinject += R.name;
			}
			contained = english_list(rinject);
			if (L != user) {
				yield* add_logs(user, L, "injected", this, { addition: `which had ${contained}` });
			} else {
				log_attack(`<font color='red'>${user.name} (${user.ckey}) injected ${L.name} (${L.ckey}) with ${this.name}, which had ${contained} (INTENT: ${uppertext(user.a_intent)})</font>`);
				L.log_message(`<font color='orange'>Injected themselves (${contained}) with ${this.name}.</font>`, "Attack log");
			}
		}
		fraction = min(this.amount_per_transfer_from_this / this.reagents.total_volume, 1);
		yield* this.reagents.reaction(L, INJECT, fraction);
		yield* this.reagents.trans_to(target, this.amount_per_transfer_from_this);
		to_chat(user, `<span class='notice'>You inject ${this.amount_per_transfer_from_this} units of the solution. The syringe now contains ${this.reagents.total_volume} units.</span>`);
		if (!(this.reagents.total_volume <= 0 && this.mode == 1)) return f.dot;
		this.mode = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// syringes.dm:156
rt.def("/obj/item/weapon/reagent_containers/syringe/proc/update_icon", function update_icon(f: Frame) {
	let injoverlay: Value = null, filling_overlay: Value = null;
	let rounded_vol: Value = max(0, min(round(this.reagents.total_volume / this.volume * 15, 5), 15));
	this.cut_overlays();
	if (ismob(this.loc)) {
		if (this.mode === 0) {
			injoverlay = "draw";
		} else if (this.mode === 1) {
			injoverlay = "inject";
		}
		this.add_overlay(injoverlay);
	}
	this.icon_state = `${rounded_vol}`;
	this.item_state = `syringe_${rounded_vol}`;
	if (!this.reagents.total_volume) return f.dot;
	(filling_overlay = mutable_appearance(rt.rsc("icons/obj/reagentfillings.dmi"), `syringe${rounded_vol}`)).color = mix_color_from_reagents(this.reagents.reagent_list);
	this.add_overlay(filling_overlay);
	return f.dot;
});

rt.type(6547, "/obj/item/weapon/reagent_containers/syringe/epinephrine", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (epinephrine)",
	desc: "Contains epinephrine - used to stabilize patients.",
});

// syringes.dm:177
rt.def("/obj/item/weapon/reagent_containers/syringe/epinephrine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["epinephrine", 15]);
	return f.dot;
});

rt.type(6548, "/obj/item/weapon/reagent_containers/syringe/charcoal", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (charcoal)",
	desc: "Contains charcoal.",
});

// syringes.dm:182
rt.def("/obj/item/weapon/reagent_containers/syringe/charcoal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["charcoal", 15]);
	return f.dot;
});

rt.type(6549, "/obj/item/weapon/reagent_containers/syringe/antiviral", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (spaceacillin)",
	desc: "Contains antiviral agents.",
});

// syringes.dm:187
rt.def("/obj/item/weapon/reagent_containers/syringe/antiviral/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["spaceacillin", 15]);
	return f.dot;
});

rt.type(6550, "/obj/item/weapon/reagent_containers/syringe/bioterror", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "bioterror syringe",
	desc: "Contains several paralyzing reagents.",
});

// syringes.dm:192
rt.def("/obj/item/weapon/reagent_containers/syringe/bioterror/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["neurotoxin", 5, "mutetoxin", 5, "sodium_thiopental", 5]);
	return f.dot;
});

rt.type(6551, "/obj/item/weapon/reagent_containers/syringe/stimulants", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 50,
	volume: 50,
	list_reagents: null,
	name: "Stimpack",
	desc: "Contains stimulants.",
});

// syringes.dm:199
rt.def("/obj/item/weapon/reagent_containers/syringe/stimulants/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["stimulants", 50]);
	return f.dot;
});

rt.type(6552, "/obj/item/weapon/reagent_containers/syringe/calomel", "/obj/item/weapon/reagent_containers/syringe", {
	list_reagents: null,
	name: "syringe (calomel)",
	desc: "Contains calomel.",
});

// syringes.dm:204
rt.def("/obj/item/weapon/reagent_containers/syringe/calomel/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["calomel", 15]);
	return f.dot;
});

rt.type(6554, "/obj/item/weapon/reagent_containers/syringe/lethal/choral", "/obj/item/weapon/reagent_containers/syringe/lethal", {
	list_reagents: null,
});

// syringes.dm:213
rt.def("/obj/item/weapon/reagent_containers/syringe/lethal/choral/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["chloralhydrate", 50]);
	return f.dot;
});

rt.type(6555, "/obj/item/weapon/reagent_containers/syringe/lethal/execution", "/obj/item/weapon/reagent_containers/syringe/lethal", {
	list_reagents: null,
});

// syringes.dm:216
rt.def("/obj/item/weapon/reagent_containers/syringe/lethal/execution/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["plasma", 15, "formaldehyde", 15, "cyanide", 10, "facid", 10]);
	return f.dot;
});

rt.type(6556, "/obj/item/weapon/reagent_containers/syringe/mulligan", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 1,
	volume: 1,
	list_reagents: null,
	name: "Mulligan",
	desc: "A syringe used to completely change the users identity.",
});

// syringes.dm:223
rt.def("/obj/item/weapon/reagent_containers/syringe/mulligan/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["mulligan", 1]);
	return f.dot;
});

rt.type(6557, "/obj/item/weapon/reagent_containers/syringe/gluttony", "/obj/item/weapon/reagent_containers/syringe", {
	amount_per_transfer_from_this: 1,
	volume: 1,
	list_reagents: null,
	name: "Gluttony's Blessing",
	desc: "A syringe recovered from a dread place. It probably isn't wise to use.",
});

// syringes.dm:230
rt.def("/obj/item/weapon/reagent_containers/syringe/gluttony/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["gluttonytoxin", 1]);
	return f.dot;
});

rt.type(6559, "/obj/item/weapon/reagent_containers/syringe/noreact", "/obj/item/weapon/reagent_containers/syringe", {
	volume: 20,
	name: "cryo syringe",
	desc: "An advanced syringe that stops reagents inside from reacting. It can hold up to 20 units.",
	origin_tech: "materials=3;engineering=3",
});

// syringes.dm:246
rt.def("/obj/item/weapon/reagent_containers/syringe/noreact/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.reagents.set_reacting(0);
	return f.dot;
}, true);
