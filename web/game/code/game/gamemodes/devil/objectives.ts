// From code/game/gamemodes/devil/objectives.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1135, "/datum/objective/devil/soulquantity", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL1",
	target_amount: 4,
});

// /datum/objective/devil/soulquantity/proc/New  (code/game/gamemodes/devil/objectives.dm:9)
rt.def("/datum/objective/devil/soulquantity/proc/New", function New(f: Frame) {
	rt.setSv(f, "target_amount", rt.op(f, "PickUnweighted", [3], [6, 7, 8]));
	rt.callSrc(f, "update_explanation_text", []);
	return f.dot;
});

// /datum/objective/devil/soulquantity/proc/update_explanation_text  (code/game/gamemodes/devil/objectives.dm:13)
rt.def("/datum/objective/devil/soulquantity/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	rt.setSv(f, "explanation_text", fmt("Purchase, and retain control over at least ＀ souls.", [rt.sv(f, "target_amount")]));
	return f.dot;
});

// /datum/objective/devil/soulquantity/proc/check_completion  (code/game/gamemodes/devil/objectives.dm:17)
rt.def("/datum/objective/devil/soulquantity/proc/check_completion", function check_completion(f: Frame) {
	let count: Value = null, devilDatum: Value = null, souls: Value = null, S: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [count, devilDatum, souls, S, L, $e];
	count = 0;
	devilDatum = rt.callName(f, rt.sv(f, "owner"), "has_antag_datum", [T("/datum/antagonist/devil")]);
	souls = rt.fv(f, "soulsOwned", live(devilDatum));
	S = null;
	rt.forList(f, 0, live(souls));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.gv(f, "soulOwner", (L = live(S))), rt.sv(f, "owner"))) {
			count = rt.inc(live(count), 1);
		}
	}
	rt.endFor(f, 0);
	return (rt.ge(live(count), rt.sv(f, "target_amount")) ? 1 : 0);
});

rt.type(1136, "/datum/objective/devil/soulquality", "/datum/objective/devil", {
	contractType: null,
	contractName: null,
	explanation_text: "You shouldn't see this text.  Error:DEVIL2",
});

// /datum/objective/devil/soulquality/proc/New  (code/game/gamemodes/devil/objectives.dm:33)
rt.def("/datum/objective/devil/soulquality/proc/New", function New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.setSv(f, "contractType", rt.op(f, "PickUnweighted", [6], ["power", "wealth", "prestige", "magic", "revive", "knowledge"]));
	rt.setSv(f, "target_amount", rt.op(f, "PickUnweighted", [2], [1, 2]));
	$0 = rt.sv(f, "contractType");
	if ($0 === "power") {
		rt.setSv(f, "contractName", "for power");
	} else if ($0 === "wealth") {
		rt.setSv(f, "contractName", "for wealth");
	} else if ($0 === "prestige") {
		rt.setSv(f, "contractName", "for prestige");
	} else if ($0 === "magic") {
		rt.setSv(f, "contractName", "for magic");
	} else if ($0 === "revive") {
		rt.setSv(f, "contractName", "of revival");
	} else if ($0 === "knowledge") {
		rt.setSv(f, "contractName", "for knowledge");
	}
	rt.callSrc(f, "update_explanation_text", []);
	return f.dot;
});

// /datum/objective/devil/soulquality/proc/update_explanation_text  (code/game/gamemodes/devil/objectives.dm:53)
rt.def("/datum/objective/devil/soulquality/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	rt.setSv(f, "explanation_text", fmt("Have mortals sign at least ＀ contracts ＀", [rt.sv(f, "target_amount"), rt.sv(f, "contractName")]));
	return f.dot;
});

// /datum/objective/devil/soulquality/proc/check_completion  (code/game/gamemodes/devil/objectives.dm:57)
rt.def("/datum/objective/devil/soulquality/proc/check_completion", function check_completion(f: Frame) {
	let count: Value = null, devilDatum: Value = null, souls: Value = null, S: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [count, devilDatum, souls, S, L, $e];
	count = 0;
	devilDatum = rt.callName(f, rt.sv(f, "owner"), "has_antag_datum", [T("/datum/antagonist/devil")]);
	souls = rt.fv(f, "soulsOwned", live(devilDatum));
	S = null;
	rt.forList(f, 0, live(souls));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if ((!truthy(rt.callName(f, (L = live(S)), "owns_soul", [])) && isEqual(rt.fv(f, "damnation_type", live(L)), rt.sv(f, "contractType")))) {
			count = rt.inc(live(count), 1);
		}
	}
	rt.endFor(f, 0);
	return (rt.ge(live(count), rt.sv(f, "target_amount")) ? 1 : 0);
});

rt.type(1137, "/datum/objective/devil/sintouch", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL3",
});

// /datum/objective/devil/sintouch/proc/New  (code/game/gamemodes/devil/objectives.dm:71)
rt.def("/datum/objective/devil/sintouch/proc/New", function New(f: Frame) {
	rt.setSv(f, "target_amount", rt.op(f, "PickUnweighted", [2], [4, 5]));
	rt.setSv(f, "explanation_text", fmt("Ensure at least ＀ mortals are sintouched.", [rt.sv(f, "target_amount")]));
	return f.dot;
});

// /datum/objective/devil/sintouch/proc/check_completion  (code/game/gamemodes/devil/objectives.dm:75)
rt.def("/datum/objective/devil/sintouch/proc/check_completion", function check_completion(f: Frame) {
	return (rt.ge(rt.sv(f, "target_amount"), rt.getLen(f, rt.gv(f, "sintouched", rt.fv(f, "mode", rt.gl("SSticker"))))) ? 1 : 0);
});

rt.type(1138, "/datum/objective/devil/buy_target", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL4",
});

// /datum/objective/devil/buy_target/proc/update_explanation_text  (code/game/gamemodes/devil/objectives.dm:84)
rt.def("/datum/objective/devil/buy_target/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	if (truthy(rt.sv(f, "target"))) {
		rt.setSv(f, "explanation_text", fmt("Purchase and retain the soul of ＀, the ＀.", [rt.fv(f, "name", rt.sv(f, "target")), rt.fv(f, "assigned_role", rt.sv(f, "target"))]));
	} else {
		rt.setSv(f, "explanation_text", "Free objective.");
	}
	return f.dot;
});

// /datum/objective/devil/buy_target/proc/check_completion  (code/game/gamemodes/devil/objectives.dm:89)
rt.def("/datum/objective/devil/buy_target/proc/check_completion", function check_completion(f: Frame) {
	return (isEqual(rt.fv(f, "soulOwner", rt.sv(f, "target")), rt.sv(f, "owner")) ? 1 : 0);
});

rt.type(1139, "/datum/objective/devil/outsell", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL5",
});

// /datum/objective/devil/outsell/proc/New  empty
rt.def("/datum/objective/devil/outsell/proc/New");

// /datum/objective/devil/outsell/proc/update_explanation_text  (code/game/gamemodes/devil/objectives.dm:98)
rt.def("/datum/objective/devil/outsell/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let opponent: Value = null;
	f.vars = () => [opponent];
	rt.setSv(f, "explanation_text", fmt("Purchase and retain control over more souls than ＀, known to mortals as ＀, the ＀.", [rt.gv(f, "truename", (opponent = rt.callName(f, rt.sv(f, "target"), "has_antag_datum", [T("/datum/antagonist/devil")]))), rt.fv(f, "name", rt.sv(f, "target")), rt.fv(f, "assigned_role", rt.sv(f, "target"))]));
	return f.dot;
});

// /datum/objective/devil/outsell/proc/check_completion  (code/game/gamemodes/devil/objectives.dm:103)
rt.def("/datum/objective/devil/outsell/proc/check_completion", function check_completion(f: Frame) {
	let selfcount: Value = null, devilDatum: Value = null, souls: Value = null, S: Value = null, L: Value = null, targetcount: Value = null, S_4: Value = null, L_5: Value = null;
	let $e: any;
	f.vars = () => [selfcount, devilDatum, souls, S, L, targetcount, S_4, L_5, $e];
	selfcount = 0;
	devilDatum = rt.callName(f, rt.sv(f, "owner"), "has_antag_datum", [T("/datum/antagonist/devil")]);
	souls = rt.fv(f, "soulsOwned", live(devilDatum));
	S = null;
	rt.forList(f, 0, live(souls));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.gv(f, "soulOwner", (L = live(S))), rt.sv(f, "owner"))) {
			selfcount = rt.inc(live(selfcount), 1);
		}
	}
	rt.endFor(f, 0);
	targetcount = 0;
	souls = rt.gv(f, "soulsOwned", (devilDatum = rt.callName(f, rt.sv(f, "target"), "has_antag_datum", [T("/datum/antagonist/devil")])));
	S_4 = null;
	rt.forList(f, 0, live(souls));
	while (($e = rt.next(f, 0)) !== undefined) {
		S_4 = $e;
		if (isEqual(rt.gv(f, "soulOwner", (L_5 = live(S_4))), rt.sv(f, "target"))) {
			targetcount = rt.inc(live(targetcount), 1);
		}
	}
	rt.endFor(f, 0);
	return (rt.gt(live(selfcount), live(targetcount)) ? 1 : 0);
});
