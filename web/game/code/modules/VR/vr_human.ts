// From code/modules/VR/vr_human.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4818, "/mob/living/carbon/human/virtual_reality", "/mob/living/carbon/human", {
	real_me: null,
	vr_sleeper: null,
	quit_action: null,
});

// /mob/living/carbon/human/virtual_reality/proc/Initialize  (code/modules/VR/vr_human.dm:10)  may sleep
rt.def("/mob/living/carbon/human/virtual_reality/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "quit_action", (yield* g.new_(f, T("/datum/action/quit_vr"), [])));
	yield* g.callName(f, rt.sv(f, "quit_action"), "Grant", [live(f.src)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/virtual_reality/proc/death  (code/modules/VR/vr_human.dm:16)  may sleep
rt.def("/mob/living/carbon/human/virtual_reality/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "revert_to_reality");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/human/virtual_reality/proc/Destroy  (code/modules/VR/vr_human.dm:21)  may sleep
rt.def("/mob/living/carbon/human/virtual_reality/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "revert_to_reality");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/carbon/human/virtual_reality/ghost  (code/modules/VR/vr_human.dm:29)  may sleep
rt.def("/mob/living/carbon/human/virtual_reality/ghost", function* ghost(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	H = rt.sv(f, "real_me");
	yield* g.srcCall(f, "revert_to_reality", 0, 0);
	if (!truthy(live(H))) return f.dot;
	yield* g.callName(f, live(H), "ghost", []);
	return f.dot;
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// /mob/living/carbon/human/virtual_reality/proc/revert_to_reality  (code/modules/VR/vr_human.dm:36)  may sleep
rt.def("/mob/living/carbon/human/virtual_reality/proc/revert_to_reality", function* revert_to_reality(f: Frame, refcleanup: Value, deathchecks: Value) {
	f.vars = () => [refcleanup, deathchecks];
	if (live(refcleanup) === null) {
		refcleanup = 1;
	}
	if (live(deathchecks) === null) {
		deathchecks = 1;
	}
	if ((truthy(rt.sv(f, "real_me")) && truthy(rt.sv(f, "mind")))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [rt.sv(f, "real_me")]);
		if (((truthy(live(deathchecks)) && truthy(rt.sv(f, "vr_sleeper"))) && truthy(rt.fv(f, "you_die_in_the_game_you_die_for_real", rt.sv(f, "vr_sleeper"))))) {
			yield* g.callName(f, rt.sv(f, "real_me"), "death", [0]);
		}
	}
	if (!truthy(live(refcleanup))) return f.dot;
	rt.setFv(f, "vr_human", rt.sv(f, "vr_sleeper"), null);
	rt.setSv(f, "vr_sleeper", null);
	rt.setSv(f, "real_me", null);
	return f.dot;
}, true);

rt.type(271, "/datum/action/quit_vr", "/datum/action", {
	name: "Quit Virtual Reality",
});

// /datum/action/quit_vr/proc/Trigger  (code/modules/VR/vr_human.dm:50)  may sleep
rt.def("/datum/action/quit_vr/proc/Trigger", function* Trigger(f: Frame) {
	let VR: Value = null;
	f.vars = () => [VR];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/carbon/human/virtual_reality")) ? 1 : 0))) {
		yield* g.callName(f, (VR = rt.sv(f, "owner")), "revert_to_reality", [0, 0]);
	} else {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	}
	return f.dot;
}, true);
