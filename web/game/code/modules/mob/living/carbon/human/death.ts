// From code/modules/mob/living/carbon/human/death.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/gib_animation  (code/modules/mob/living/carbon/human/death.dm:2)  may sleep
rt.def("/mob/living/carbon/human/proc/gib_animation", function* gib_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/gib_animation"), [rt.sv(f, "loc"), "gibbed-h"]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/dust_animation  (code/modules/mob/living/carbon/human/death.dm:5)  may sleep
rt.def("/mob/living/carbon/human/proc/dust_animation", function* dust_animation(f: Frame) {
	yield* g.new_(f, T("/obj/effect/temp_visual/dust_animation"), [rt.sv(f, "loc"), "dust-h"]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/spawn_gibs  (code/modules/mob/living/carbon/human/death.dm:9)  may sleep
rt.def("/mob/living/carbon/human/proc/spawn_gibs", function* spawn_gibs(f: Frame, with_bodyparts: Value) {
	f.vars = () => [with_bodyparts];
	if (truthy(live(with_bodyparts))) {
		yield* g.new_(f, T("/obj/effect/gibspawner/human"), [rt.sv(f, "loc"), rt.sv(f, "viruses"), rt.sv(f, "dna")]);
	} else {
		yield* g.new_(f, T("/obj/effect/gibspawner/humanbodypartless"), [rt.sv(f, "loc"), rt.sv(f, "viruses"), rt.sv(f, "dna")]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/spawn_dust  (code/modules/mob/living/carbon/human/death.dm:15)  may sleep
rt.def("/mob/living/carbon/human/proc/spawn_dust", function* spawn_dust(f: Frame, just_ash: Value) {
	f.vars = () => [just_ash];
	if (live(just_ash) === null) {
		just_ash = 0;
	}
	if (truthy(live(just_ash))) {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/ash"), [rt.sv(f, "loc")]);
	} else {
		yield* g.new_(f, T("/obj/effect/decal/remains/human"), [rt.sv(f, "loc")]);
	}
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/death  (code/modules/mob/living/carbon/human/death.dm:20)  may sleep
rt.def("/mob/living/carbon/human/proc/death", function* death(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "dizziness", 0);
	rt.setSv(f, "jitteriness", 0);
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "occupant", (M = rt.sv(f, "loc"))), live(f.src))) {
			yield* g.callName(f, live(M), "go_out", []);
		}
	}
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "spec_death", [live(f.args[0]), live(f.src)]);
	if (!truthy((yield* g.call(f, P("/proc/is_devil"), null, [live(f.src)])))) return f.dot;
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [(yield* g.call(f, P("/proc/is_devil"), null, [live(f.src)])), P("/datum/antagonist/devil/proc/beginResurrectionCheck"), live(f.src)]);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/carbon/human/proc/makeSkeleton  (code/modules/mob/living/carbon/human/death.dm:41)  may sleep
rt.def("/mob/living/carbon/human/proc/makeSkeleton", function* makeSkeleton(f: Frame) {
	(rt.modSrcVar(f, "status_flags", 16384, rt.bitOr));
	yield* g.srcCall(f, "set_species", T("/datum/species/skeleton"));
	return 1;
}, true);

// /mob/living/carbon/proc/Drain  (code/modules/mob/living/carbon/human/death.dm:47)  may sleep
rt.def("/mob/living/carbon/proc/Drain", function* Drain(f: Frame) {
	yield* g.srcCall(f, "become_husk");
	(rt.modSrcVar(f, "disabilities", 128, rt.bitOr));
	rt.setSv(f, "blood_volume", 0);
	return 1;
}, true);
