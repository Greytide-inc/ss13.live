// Based on /tg/station's code/game/gamemodes/changeling/changeling_power.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(11222, "/obj/effect/proc_holder/changeling", "/obj/effect/proc_holder", {
	helptext: "",
	chemical_cost: 0,
	dna_cost: -1,
	req_dna: 0,
	req_human: 0,
	req_stat: 0,
	always_keep: 0,
	ignores_fakedeath: 0,
	panel: "Changeling",
	name: "Prototype Sting",
	desc: "",
});

// changeling_power.dm:21
rt.def("/obj/effect/proc_holder/changeling/proc/on_purchase", function on_purchase(f: Frame, user: Value, is_respec: Value) {
	if (is_respec) return f.dot;
	return f.dot;
});

// changeling_power.dm:28
rt.def("/obj/effect/proc_holder/changeling/proc/Click", function* Click(f: Frame) {
	let user: Value = null;
	if (!(user = f.usr) || !user.mind || !user.mind.changeling) {
		return f.dot;
	}
	yield* this.try_to_sting(user);
	return f.dot;
}, true);

// changeling_power.dm:34
rt.def("/obj/effect/proc_holder/changeling/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	if (!(yield* this.can_sting(user, target))) {
		return f.dot;
	}
	let c: Value = user.mind.changeling;
	if (!(yield* this.sting_action(user, target))) return f.dot;
	this.sting_feedback(user, target);
	c.chem_charges -= this.chemical_cost;
	return f.dot;
}, true);

// changeling_power.dm:50
rt.def("/obj/effect/proc_holder/changeling/proc/can_sting", function can_sting(f: Frame, user: Value, target: Value) {
	let c: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human")) && !rt.istype(user, T("/mob/living/carbon/monkey"))) {
		return 0;
	}
	if (this.req_human && !rt.istype(user, T("/mob/living/carbon/human"))) {
		to_chat(user, "<span class='warning'>We cannot do that in this form!</span>");
		return 0;
	}
	if ((c = user.mind.changeling).chem_charges < this.chemical_cost) {
		to_chat(user, fmt("<span class='warning'>We require at least ＀ unit５ of chemicals to do that!</span>", [this.chemical_cost]));
		return 0;
	}
	if (c.absorbedcount < this.req_dna) {
		to_chat(user, fmt("<span class='warning'>We require at least ＀ sample５ of compatible DNA.</span>", [this.req_dna]));
		return 0;
	}
	if (this.req_stat < user.stat) {
		to_chat(user, "<span class='warning'>We are incapacitated.</span>");
		return 0;
	}
	if (rt.bitAnd(user.status_flags, FAKEDEATH) && !this.ignores_fakedeath) {
		to_chat(user, "<span class='warning'>We are incapacitated.</span>");
		return 0;
	}
	return 1;
});

// changeling_power.dm:72
rt.def("/obj/effect/proc_holder/changeling/proc/can_be_used_by", function can_be_used_by(f: Frame, user: Value) {
	if (!user || !user || user.gc_destroyed) {
		return 0;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human")) && !rt.istype(user, T("/mob/living/carbon/monkey"))) {
		return 0;
	}
	if (this.req_human && !rt.istype(user, T("/mob/living/carbon/human"))) {
		return 0;
	}
	return 1;
});
