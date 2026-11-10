// Based on /tg/station's code/modules/mining/equipment/regenerative_core.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7541, "/obj/item/weapon/hivelordstabilizer", "/obj/item/weapon", {
	name: "stabilizing serum",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "bottle19",
	desc: "Inject certain types of monster organs with this stabilizer to preserve their healing powers indefinitely.",
	w_class: 1,
	origin_tech: "biotech=3",
});

// regenerative_core.dm:11
rt.def("/obj/item/weapon/hivelordstabilizer/proc/afterattack", function* afterattack(f: Frame, M: Value, user: Value) {
	let C: Value = null;
	if (!rt.istype((C = M), T("/obj/item/organ/regenerative_core"))) {
		to_chat(user, "<span class='warning'>The stabilizer only works on certain types of monster organs, generally regenerative in nature.</span>");
		return (yield* parent_proc());
	}
	yield* C.preserved();
	to_chat(user, `<span class='notice'>You inject the ${M} with the stabilizer. It will no longer go inert.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9460, "/obj/item/organ/regenerative_core", "/obj/item/organ", {
	inert: 0,
	preserved: 0,
	flags: 4,
	name: "regenerative core",
	desc: "All that remains of a hivelord. It can be used to heal completely, but it will rapidly decay into uselessness.",
	icon_state: "roro core 2",
	slot: "hivecore",
	force: 0,
	actions_types: null,
});

// regenerative_core.dm:28
rt.def("/obj/item/organ/regenerative_core/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/use"));
	return f.dot;
});

// regenerative_core.dm:33
rt.def("/obj/item/organ/regenerative_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/regenerative_core/proc/inert_check"))), 2400);
	return f.dot;
}, true);

// regenerative_core.dm:37
rt.def("/obj/item/organ/regenerative_core/proc/inert_check", function* inert_check(f: Frame) {
	if (this.preserved) return f.dot;
	yield* this.go_inert();
	return f.dot;
}, true);

// regenerative_core.dm:43
rt.def("/obj/item/organ/regenerative_core/proc/preserved", function* preserved(f: Frame, implanted: Value) {
	implanted ??= 0;
	this.inert = 0;
	this.preserved = 1;
	yield* this.update_icon();
	this.desc = "All that remains of a hivelord. It is preserved, allowing you to use it to heal completely without danger of decay.";
	return f.dot;
}, true);

// regenerative_core.dm:52
rt.def("/obj/item/organ/regenerative_core/proc/go_inert", function* go_inert(f: Frame) {
	this.inert = 1;
	this.name = "decayed regenerative core";
	this.desc = "All that remains of a hivelord. It has decayed, and is completely useless.";
	yield* this.update_icon();
	return f.dot;
}, true);

// regenerative_core.dm:59
rt.def("/obj/item/organ/regenerative_core/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (this.inert) {
		to_chat(this.owner, `<span class='notice'>${this} breaks down as it tries to activate.</span>`);
	} else {
		yield* this.owner.revive({ full_heal: 1 });
	}
	yield* qdel(this);
	return f.dot;
}, true);

// regenerative_core.dm:65
rt.def("/obj/item/organ/regenerative_core/proc/on_life", function* on_life(f: Frame) {
	yield* parent_proc();
	if (!(this.owner.health < 0)) return f.dot;
	yield* this.ui_action_click();
	return f.dot;
}, true);

// regenerative_core.dm:70
rt.def("/obj/item/organ/regenerative_core/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let H: Value = null;
	if (proximity_flag && rt.istype(target, T("/mob/living/carbon/human"))) {
		H = target;
		if (this.inert) {
			to_chat(user, `<span class='notice'>${this} has decayed and can no longer be used to heal.</span>`);
			return f.dot;
		} else {
			if (H.stat == 2) {
				to_chat(user, `<span class='notice'>${this} are useless on the dead.</span>`);
				return f.dot;
			}
			if (H != user) {
				H.visible_message(`${user} forces ${H} to apply ${this}... ${H.p_they()} quickly regenerate all injuries!`);
			} else {
				to_chat(user, `<span class='notice'>You start to smear ${this} on yourself. It feels and smells disgusting, but you feel amazingly refreshed in mere moments.</span>`);
			}
			yield* H.revive({ full_heal: 1 });
			yield* qdel(this);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// regenerative_core.dm:90
rt.def("/obj/item/organ/regenerative_core/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!(!this.preserved && !this.inert)) return f.dot;
	yield* this.preserved(1);
	this.owner.visible_message(`<span class='notice'>${this} stabilizes as it's inserted.</span>`);
	return f.dot;
}, true, { args: ["M", "special", "drop_if_replaced"] });

// regenerative_core.dm:96
rt.def("/obj/item/organ/regenerative_core/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!this.inert && !f.args[1]) {
		this.owner.visible_message(`<span class='notice'>${this} rapidly decays as it's removed.</span>`);
		yield* this.go_inert();
	}
	return (yield* parent_proc());
}, true, { args: ["M", "special"] });

// regenerative_core.dm:102
rt.def("/obj/item/organ/regenerative_core/proc/prepare_eat", function prepare_eat(f: Frame) {
	return null;
});

rt.type(9461, "/obj/item/organ/regenerative_core/legion", "/obj/item/organ/regenerative_core", {
	desc: "A strange rock that crackles with power. It can be used to heal completely, but it will rapidly decay into uselessness.",
	icon_state: "legion_soul",
});

// regenerative_core.dm:110
rt.def("/obj/item/organ/regenerative_core/legion/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// regenerative_core.dm:114
rt.def("/obj/item/organ/regenerative_core/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	this.icon_state = this.inert ? "legion_soul_inert" : "legion_soul";
	this.cut_overlays();
	if (!this.inert && !this.preserved) {
		this.add_overlay("legion_soul_crackle");
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// regenerative_core.dm:123
rt.def("/obj/item/organ/regenerative_core/legion/proc/go_inert", function* go_inert(f: Frame) {
	yield* parent_proc();
	this.desc = `${this} has become inert. It has decayed, and is completely useless.`;
	return f.dot;
}, true);

// regenerative_core.dm:127
rt.def("/obj/item/organ/regenerative_core/legion/proc/preserved", function* preserved(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	this.desc = `${this} has been stabilized. It is preserved, allowing you to use it to heal completely without danger of decay.`;
	return f.dot;
}, true, { args: ["implanted"] });
