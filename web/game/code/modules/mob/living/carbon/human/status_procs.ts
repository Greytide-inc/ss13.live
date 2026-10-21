// From code/modules/mob/living/carbon/human/status_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/Stun  (code/modules/mob/living/carbon/human/status_procs.dm:3)  may sleep
rt.def("/mob/living/carbon/human/proc/Stun", function* Stun(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_stun", [live(f.src), live(f.args[0])]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/carbon/human/proc/Knockdown  (code/modules/mob/living/carbon/human/status_procs.dm:7)  may sleep
rt.def("/mob/living/carbon/human/proc/Knockdown", function* Knockdown(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_stun", [live(f.src), live(f.args[0])]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/carbon/human/proc/Unconscious  (code/modules/mob/living/carbon/human/status_procs.dm:11)  may sleep
rt.def("/mob/living/carbon/human/proc/Unconscious", function* Unconscious(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.args[0] = (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_stun", [live(f.src), live(f.args[0])]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// /mob/living/carbon/human/proc/cure_husk  (code/modules/mob/living/carbon/human/status_procs.dm:15)  may sleep
rt.def("/mob/living/carbon/human/proc/cure_husk", function* cure_husk(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_hair");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/become_husk  (code/modules/mob/living/carbon/human/status_procs.dm:20)  may sleep
rt.def("/mob/living/carbon/human/proc/become_husk", function* become_husk(f: Frame) {
	if (truthy((rt.istype(rt.fv(f, "species", rt.sv(f, "dna")), T("/datum/species/skeleton")) ? 1 : 0))) {
		yield* g.srcCall(f, "cure_husk");
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_hair");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/set_drugginess  (code/modules/mob/living/carbon/human/status_procs.dm:28)  may sleep
rt.def("/mob/living/carbon/human/proc/set_drugginess", function* set_drugginess(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "remove_language", T("/datum/language/beachbum"));
	return f.dot;
}, true, { args: ["amount"] });

// /mob/living/carbon/human/proc/adjust_drugginess  (code/modules/mob/living/carbon/human/status_procs.dm:33)  may sleep
rt.def("/mob/living/carbon/human/proc/adjust_drugginess", function* adjust_drugginess(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((yield* g.callName(f, rt.sv(f, "dna"), "check_mutation", ["Stoner"])))) return f.dot;
	if (truthy(rt.sv(f, "druggy"))) {
		yield* g.srcCall(f, "grant_language", T("/datum/language/beachbum"));
	} else {
		yield* g.srcCall(f, "remove_language", T("/datum/language/beachbum"));
	}
	return f.dot;
}, true, { args: ["amount"] });
