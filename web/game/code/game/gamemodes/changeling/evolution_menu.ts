// Based on /tg/station's code/game/gamemodes/changeling/evolution_menu.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// evolution_menu.dm:5
rt.def("/datum/changeling/proc/purchasePower", function* purchasePower(f: Frame, user: Value, sting_name: Value) {
	let thepower: Value = null, path: Value = null, S: Value = null;
	for (path of each(typesof(T("/obj/effect/proc_holder/changeling")) - T("/obj/effect/proc_holder/changeling"))) {
		if (rt.initial(f, (S = path), "name") == sting_name) {
			thepower = (yield* new_(path));
			break;
		}
	}
	if (!thepower) {
		to_chat(user, "This is awkward. Changeling power purchase failed, please report this bug to a coder!");
		return f.dot;
	}
	if (this.absorbedcount < thepower.req_dna) {
		to_chat(user, "We lack the energy to evolve this ability!");
		return f.dot;
	}
	if (this.has_sting(thepower)) {
		to_chat(user, "We have already evolved this ability!");
		return f.dot;
	}
	if (thepower.dna_cost < 0) {
		to_chat(user, "We cannot evolve this ability.");
		return f.dot;
	}
	if (this.geneticpoints < thepower.dna_cost) {
		to_chat(user, "We have reached our capacity for abilities.");
		return f.dot;
	}
	if (rt.bitAnd(user.status_flags, FAKEDEATH)) {
		to_chat(user, "We lack the energy to evolve new abilities right now.");
		return f.dot;
	}
	this.geneticpoints -= thepower.dna_cost;
	this.purchasedpowers += thepower;
	yield* thepower.on_purchase(user);
	return f.dot;
}, true);

// evolution_menu.dm:41
rt.def("/datum/changeling/proc/lingRespec", function* lingRespec(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		to_chat(user, "<span class='danger'>We can't remove our evolutions in this form!</span>");
		return f.dot;
	}
	if (this.canrespec) {
		to_chat(user, "<span class='notice'>We have removed our evolutions from this form, and are now ready to readapt.</span>");
		yield* user.remove_changeling_powers(1);
		this.canrespec = 0;
		yield* user.make_changeling(1);
		return 1;
	} else {
		to_chat(user, "<span class='danger'>You lack the power to readapt your evolutions!</span>");
		return 0;
	}
}, true);

// evolution_menu.dm:55
rt.def("/mob/proc/make_changeling", function* make_changeling(f: Frame, is_respec: Value) {
	let path: Value = null, S: Value = null, C: Value = null, prof: Value = null, B: Value = null;
	if (!this.mind) {
		return f.dot;
	}
	if (!rt.istype(this, T("/mob/living/carbon/human")) && !rt.istype(this, T("/mob/living/carbon/monkey"))) {
		return f.dot;
	}
	if (!this.mind.changeling) {
		this.mind.changeling = (yield* new_(T("/datum/changeling"), this.gender));
	}
	if (this.mind.changeling.purchasedpowers) {
		yield* this.remove_changeling_powers(1);
	}
	for (path of each(typesof(T("/obj/effect/proc_holder/changeling")) - T("/obj/effect/proc_holder/changeling"))) {
		if (!(S = (yield* new_(path))).dna_cost) {
			if (!this.mind.changeling.has_sting(S)) {
				this.mind.changeling.purchasedpowers += S;
			}
			yield* S.on_purchase(this, is_respec);
		}
	}
	if (rt.istype((C = this), T("/mob/living/carbon/human"))) {
		prof = (yield* this.mind.changeling.add_new_profile(C, this));
		this.mind.changeling.first_prof = prof;
		if (B = C.getorganslot("brain")) {
			B.vital = 0;
			B.decoy_override = 1;
		}
	}
	return 1;
}, true);

// evolution_menu.dm:86
rt.def("/datum/changeling/proc/reset", function reset(f: Frame) {
	this.chosen_sting = null;
	this.geneticpoints = rt.initial(f, this, "geneticpoints");
	this.sting_range = rt.initial(f, this, "sting_range");
	this.chem_storage = rt.initial(f, this, "chem_storage");
	this.chem_recharge_rate = rt.initial(f, this, "chem_recharge_rate");
	this.chem_charges = min(this.chem_charges, this.chem_storage);
	this.chem_recharge_slowdown = rt.initial(f, this, "chem_recharge_slowdown");
	this.mimicing = "";
	return f.dot;
});

// evolution_menu.dm:95
rt.def("/mob/proc/remove_changeling_powers", function* remove_changeling_powers(f: Frame, keep_free_powers: Value) {
	let p: Value = null;
	keep_free_powers ??= 0;
	if (!(rt.istype(this, T("/mob/living/carbon/human")) || rt.istype(this, T("/mob/living/carbon/monkey")))) return f.dot;
	if (this.mind && this.mind.changeling) {
		this.mind.changeling.changeling_speak = 0;
		yield* this.mind.changeling.reset();
		for (p of each(this.mind.changeling.purchasedpowers, T("/obj/effect/proc_holder/changeling"))) {
			if (p.dna_cost == 0 && keep_free_powers || p.always_keep) {
				continue;
			}
			this.mind.changeling.purchasedpowers -= p;
			yield* p.on_refund(this);
		}
	}
	if (!this.hud_used) return f.dot;
	this.hud_used.lingstingdisplay.icon_state = null;
	this.hud_used.lingstingdisplay.invisibility = INVISIBILITY_ABSTRACT;
	return f.dot;
}, true);

// evolution_menu.dm:109
rt.def("/datum/changeling/proc/has_sting", function has_sting(f: Frame, power: Value) {
	let _P: Value = null;
	for (_P of each(this.purchasedpowers, T("/obj/effect/proc_holder/changeling"))) {
		if (rt.initial(f, power, "name") == _P.name) {
			return 1;
		}
	}
	return 0;
});
