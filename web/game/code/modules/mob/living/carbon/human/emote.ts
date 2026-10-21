// From code/modules/mob/living/carbon/human/emote.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(507, "/datum/emote/living/carbon/human", "/datum/emote/living/carbon", {
	mob_type_allowed_typecache: null,
});

// /datum/emote/living/carbon/human/proc/<init>  (code/modules/mob/living/carbon/human/emote.dm:2)
rt.def("/datum/emote/living/carbon/human/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "mob_type_allowed_typecache", rt.list(T("/mob/living/carbon/human")));
	return f.dot;
});

rt.type(519, "/datum/emote/living/carbon/human/wag", "/datum/emote/living/carbon/human", {
	key: "wag",
	key_third_person: "wags",
	message: "wags their tail.",
});

// /datum/emote/living/carbon/human/wag/proc/run_emote  (code/modules/mob/living/carbon/human/emote.dm:76)  may sleep
rt.def("/datum/emote/living/carbon/human/wag/proc/run_emote", function* run_emote(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	H = live(f.args[0]);
	if (truthy(live(f.dot))) {
		yield* g.callName(f, live(H), "startTailWag", []);
	} else {
		yield* g.callName(f, live(H), "endTailWag", []);
	}
	return f.dot;
}, true, { args: ["user", "params"] });

// /datum/emote/living/carbon/human/wag/proc/can_run_emote  (code/modules/mob/living/carbon/human/emote.dm:84)
rt.def("/datum/emote/living/carbon/human/wag/proc/can_run_emote", function can_run_emote(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!((truthy(rt.gv(f, "dna", (H = live(f.args[0])))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && (truthy((rt.isIn(f, "tail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)) || !isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"), "None")))) return f.dot;
	return 1;
}, false, { args: ["user"] });

// /datum/emote/living/carbon/human/wag/proc/select_message_type  (code/modules/mob/living/carbon/human/emote.dm:91)
rt.def("/datum/emote/living/carbon/human/wag/proc/select_message_type", function select_message_type(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	H = live(f.args[0]);
	if (!(truthy((rt.isIn(f, "waggingtail_lizard", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)) || truthy((rt.isIn(f, "waggingtail_human", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) return f.dot;
	f.dot = null;
	return f.dot;
}, false, { args: ["user"] });

rt.type(520, "/datum/emote/living/carbon/human/wing", "/datum/emote/living/carbon/human", {
	key: "wing",
	key_third_person: "wings",
	message: "their wings.",
});

// /datum/emote/living/carbon/human/wing/proc/run_emote  (code/modules/mob/living/carbon/human/emote.dm:102)  may sleep
rt.def("/datum/emote/living/carbon/human/wing/proc/run_emote", function* run_emote(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	H = live(f.args[0]);
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [(yield* g.srcCall(f, "select_message_type", live(f.args[0]))), "open"])))) {
		yield* g.callName(f, live(H), "OpenWings", []);
	} else {
		yield* g.callName(f, live(H), "CloseWings", []);
	}
	return f.dot;
}, true, { args: ["user", "params"] });

// /datum/emote/living/carbon/human/wing/proc/select_message_type  (code/modules/mob/living/carbon/human/emote.dm:111)
rt.def("/datum/emote/living/carbon/human/wing/proc/select_message_type", function select_message_type(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	H = live(f.args[0]);
	if (truthy((rt.isIn(f, "wings", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
		f.dot = add("opens ", rt.sv(f, "message"));
	} else {
		f.dot = add("closes ", rt.sv(f, "message"));
	}
	return f.dot;
}, false, { args: ["user"] });

// /datum/emote/living/carbon/human/wing/proc/can_run_emote  (code/modules/mob/living/carbon/human/emote.dm:119)
rt.def("/datum/emote/living/carbon/human/wing/proc/can_run_emote", function can_run_emote(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!((truthy(rt.gv(f, "dna", (H = live(f.args[0])))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && !isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings"), "None"))) return f.dot;
	return 1;
}, false, { args: ["user"] });

// /mob/living/carbon/human/proc/startTailWag  (code/modules/mob/living/carbon/human/emote.dm:127)  may sleep
rt.def("/mob/living/carbon/human/proc/startTailWag", function* startTailWag(f: Frame) {
	if ((!truthy(rt.sv(f, "dna")) || !truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "tail_lizard", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "tail_lizard", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "spines", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingtail_lizard", rt.bitOr));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingspines", rt.bitOr));
	}
	if (truthy((rt.isIn(f, "tail_human", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "tail_human", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingtail_human", rt.bitOr));
	}
	yield* g.srcCall(f, "update_body");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/endTailWag  (code/modules/mob/living/carbon/human/emote.dm:141)  may sleep
rt.def("/mob/living/carbon/human/proc/endTailWag", function* endTailWag(f: Frame) {
	if ((!truthy(rt.sv(f, "dna")) || !truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "waggingtail_lizard", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingtail_lizard", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingspines", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "tail_lizard", rt.bitOr));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "spines", rt.bitOr));
	}
	if (truthy((rt.isIn(f, "waggingtail_human", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "waggingtail_human", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "tail_human", rt.bitOr));
	}
	yield* g.srcCall(f, "update_body");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/OpenWings  (code/modules/mob/living/carbon/human/emote.dm:154)  may sleep
rt.def("/mob/living/carbon/human/proc/OpenWings", function* OpenWings(f: Frame) {
	if ((!truthy(rt.sv(f, "dna")) || !truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "wings", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "wings", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "wingsopen", rt.bitOr));
	}
	yield* g.srcCall(f, "update_body");
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/CloseWings  (code/modules/mob/living/carbon/human/emote.dm:162)  may sleep
rt.def("/mob/living/carbon/human/proc/CloseWings", function* CloseWings(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((!truthy(rt.sv(f, "dna")) || !truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, "wingsopen", rt.gv(f, "mutant_bodyparts", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "wingsopen", subtract));
		(rt.modField(f, rt.fv(f, "species", rt.sv(f, "dna")), "mutant_bodyparts", "wings", rt.bitOr));
	}
	yield* g.srcCall(f, "update_body");
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	yield* g.callName(f, (_T = rt.sv(f, "loc")), "Entered", [live(f.src)]);
	return f.dot;
}, true);
