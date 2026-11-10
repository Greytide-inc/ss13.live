// Based on /tg/station's code/modules/mob/living/carbon/human/status_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// status_procs.dm:3
rt.def("/mob/living/carbon/human/proc/Stun", function* Stun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* this.dna.species.spec_stun(this, f.args[0]));
	return (yield* parent_proc());
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// status_procs.dm:7
rt.def("/mob/living/carbon/human/proc/Knockdown", function* Knockdown(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* this.dna.species.spec_stun(this, f.args[0]));
	return (yield* parent_proc());
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// status_procs.dm:11
rt.def("/mob/living/carbon/human/proc/Unconscious", function* Unconscious(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* this.dna.species.spec_stun(this, f.args[0]));
	return (yield* parent_proc());
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// status_procs.dm:15
rt.def("/mob/living/carbon/human/proc/cure_husk", function* cure_husk(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_hair();
	return f.dot;
}, true);

// status_procs.dm:20
rt.def("/mob/living/carbon/human/proc/become_husk", function* become_husk(f: Frame) {
	if (rt.istype(this.dna.species, T("/datum/species/skeleton"))) {
		yield* this.cure_husk();
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_hair();
	return f.dot;
}, true);

// status_procs.dm:28
rt.def("/mob/living/carbon/human/proc/set_drugginess", function* set_drugginess(f: Frame, amount: Value) {
	yield* parent_proc();
	if (amount) return f.dot;
	yield* this.remove_language(T("/datum/language/beachbum"));
	return f.dot;
}, true);

// status_procs.dm:33
rt.def("/mob/living/carbon/human/proc/adjust_drugginess", function* adjust_drugginess(f: Frame, amount: Value) {
	yield* parent_proc();
	if (this.dna.check_mutation("Stoner")) return f.dot;
	if (this.druggy) {
		yield* this.grant_language(T("/datum/language/beachbum"));
	} else {
		yield* this.remove_language(T("/datum/language/beachbum"));
	}
	return f.dot;
}, true);
