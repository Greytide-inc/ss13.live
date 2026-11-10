// Based on /tg/station's code/modules/surgery/organs/augments_chest.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9503, "/obj/item/organ/cyberimp/chest/nutriment", "/obj/item/organ/cyberimp/chest", {
	hunger_threshold: 150,
	synthesizing: 0,
	poison_amount: 5,
	name: "Nutriment pump implant",
	desc: "This implant with synthesize and pump into your bloodstream a small amount of nutriment when you are starving.",
	icon_state: "chest_implant",
	implant_color: "#00AA00",
	slot: "stomach",
	origin_tech: "materials=2;powerstorage=2;biotech=2",
});

// augments_chest.dm:23
rt.def("/obj/item/organ/cyberimp/chest/nutriment/proc/on_life", function* on_life(f: Frame) {
	if (this.synthesizing) {
		return f.dot;
	}
	if (!(this.owner.nutrition <= this.hunger_threshold)) return f.dot;
	this.synthesizing = 1;
	to_chat(this.owner, "<span class='notice'>You feel less hungry...</span>");
	this.owner.nutrition += 50;
	yield* sleep(50);
	this.synthesizing = 0;
	return f.dot;
}, true);

// augments_chest.dm:31
rt.def("/obj/item/organ/cyberimp/chest/nutriment/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!this.owner) {
		return f.dot;
	}
	yield* this.owner.reagents.add_reagent("bad_food", this.poison_amount / severity);
	to_chat(this.owner, "<span class='warning'>You feel like your insides are burning.</span>");
	return f.dot;
}, true);

rt.type(9505, "/obj/item/organ/cyberimp/chest/reviver", "/obj/item/organ/cyberimp/chest", {
	revive_cost: 0,
	reviving: 0,
	cooldown: 0,
	name: "Reviver implant",
	desc: "This implant will attempt to revive you if you lose consciousness. For the faint of heart!",
	icon_state: "chest_implant",
	implant_color: "#AD0000",
	origin_tech: "materials=5;programming=4;biotech=4",
	slot: "heartdrive",
});

// augments_chest.dm:59
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/on_life", function* on_life(f: Frame) {
	if (this.reviving) {
		if (this.owner.stat == 1) {
			yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/cyberimp/chest/reviver/proc/heal"))), 30);
		} else {
			this.cooldown = this.revive_cost + rt.worldTime(f);
			this.reviving = 0;
			to_chat(this.owner, `<span class='notice'>Your reviver implant shuts down and starts recharging. It will be ready again in ${this.revive_cost / 10} seconds.</span>`);
		}
		return f.dot;
	}
	if (this.cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	if (this.owner.stat != 1) {
		return f.dot;
	}
	if (this.owner.suiciding) {
		return f.dot;
	}
	this.revive_cost = 0;
	this.reviving = 1;
	to_chat(this.owner, "<span class='notice'>You feel a faint buzzing as your reviver implant starts patching your wounds...</span>");
	return f.dot;
}, true);

// augments_chest.dm:79
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/heal", function* heal(f: Frame) {
	if (this.owner.getOxyLoss()) {
		yield* this.owner.adjustOxyLoss(-5);
		this.revive_cost += 5;
	}
	if (this.owner.getBruteLoss()) {
		yield* this.owner.adjustBruteLoss(-2);
		this.revive_cost += 40;
	}
	if (this.owner.getFireLoss()) {
		yield* this.owner.adjustFireLoss(-2);
		this.revive_cost += 40;
	}
	if (!this.owner.getToxLoss()) return f.dot;
	yield* this.owner.adjustToxLoss(-1);
	this.revive_cost += 40;
	return f.dot;
}, true);

// augments_chest.dm:93
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let H: Value = null;
	if (!this.owner) {
		return f.dot;
	}
	if (this.reviving) {
		this.revive_cost += 200;
	} else {
		this.cooldown += 200;
	}
	if (!rt.istype(this.owner, T("/mob/living/carbon/human"))) return f.dot;
	if (!((H = this.owner).stat != 2 && prob(50 / severity) && H.can_heartattack())) return f.dot;
	H.set_heartattack(1);
	to_chat(H, "<span class='userdanger'>You feel a horrible agony in your chest!</span>");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/cyberimp/chest/reviver/proc/undo_heart_attack"))), 600 / severity);
	return f.dot;
}, true);

// augments_chest.dm:109
rt.def("/obj/item/organ/cyberimp/chest/reviver/proc/undo_heart_attack", function undo_heart_attack(f: Frame) {
	let H: Value = null;
	if (!rt.istype((H = this.owner), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	H.set_heartattack(0);
	if (H.stat != 0) return f.dot;
	to_chat(H, "<span class='notice'>You feel your heart beating again!</span>");
	return f.dot;
});

rt.type(9506, "/obj/item/organ/cyberimp/chest/thrusters", "/obj/item/organ/cyberimp/chest", {
	on: 0,
	ion_trail: null,
	name: "implantable thrusters set",
	desc: "An implantable set of thruster ports. They use the gas from environment or subject's internals for propulsion in zero-gravity areas. Unlike regular jetpack, this device has no stablilzation system.",
	slot: "thrusters",
	icon_state: "imp_jetpack",
	origin_tech: "materials=4;magnets=4;biotech=4;engineering=5",
	implant_overlay: null,
	implant_color: null,
	actions_types: null,
	w_class: 3,
});

// augments_chest.dm:126
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/toggle"));
	return f.dot;
});

// augments_chest.dm:132
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.ion_trail) {
		this.ion_trail = (yield* new_(T("/datum/effect_system/trail_follow/ion")));
	}
	yield* this.ion_trail.set_up(f.args[0]);
	return f.dot;
}, true, { args: ["M", "special"] });

// augments_chest.dm:139
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.on) {
		yield* this.toggle({ silent: 1 });
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// augments_chest.dm:143
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* this.toggle();
	return f.dot;
}, true);

// augments_chest.dm:146
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/toggle", function* toggle(f: Frame, silent: Value) {
	silent ??= 0;
	if (!this.on) {
		if (this.crit_fail) {
			if (!silent) {
				to_chat(this.owner, "<span class='warning'>Your thrusters set seems to be broken!</span>");
			}
			return 0;
		}
		this.on = 1;
		if (yield* this.allow_thrust(0.01)) {
			yield* this.ion_trail.start();
			if (!silent) {
				to_chat(this.owner, "<span class='notice'>You turn your thrusters set on.</span>");
			}
		}
	} else {
		yield* this.ion_trail.stop();
		if (!silent) {
			to_chat(this.owner, "<span class='notice'>You turn your thrusters set off.</span>");
		}
		this.on = 0;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// augments_chest.dm:165
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	if (this.on) {
		this.icon_state = "imp_jetpack-on";
	} else {
		this.icon_state = "imp_jetpack";
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// augments_chest.dm:173
rt.def("/obj/item/organ/cyberimp/chest/thrusters/proc/allow_thrust", function* allow_thrust(f: Frame, num: Value) {
	let _T: Value = null, environment: Value = null, I: Value = null, removed: Value = null;
	if (!this.on || !this.owner) {
		return 0;
	}
	if (!(_T = rt.getStep(f, this.owner, 0))) {
		return 0;
	}
	if ((environment = _T.return_air()) && environment.return_pressure() > 30) {
		return 1;
	}
	if (this.owner.getPlasma() >= num * 100) {
		yield* this.owner.adjustPlasma(-num * 100);
		return 1;
	}
	if ((I = this.owner.internal) && I.air_contents && I.air_contents.total_moles() > num) {
		if ((removed = (yield* I.air_contents.remove(num))).total_moles() > 0.005) {
			yield* _T.assume_air(removed);
			return 1;
		} else {
			yield* _T.assume_air(removed);
		}
	}
	yield* this.toggle({ silent: 1 });
	return 0;
}, true);
