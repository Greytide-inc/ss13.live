// From code/game/gamemodes/miniantags/abduction/abductee_objectives.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1141, "/datum/objective/abductee/random", "/datum/objective/abductee", {});

// /datum/objective/abductee/random/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:8)
rt.def("/datum/objective/abductee/random/proc/New", function New(f: Frame) {
	rt.setSv(f, "explanation_text", rt.op(f, "PickUnweighted", [1], [rt.callName(f, rt.world(), "file2list", ["strings/abductee_objectives.txt"])]));
	return f.dot;
});

rt.type(1142, "/datum/objective/abductee/steal", "/datum/objective/abductee", {
	explanation_text: "Steal all",
});

// /datum/objective/abductee/steal/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:14)
rt.def("/datum/objective/abductee/steal/proc/New", function New(f: Frame) {
	let target: Value = null;
	f.vars = () => [target];
	rt.modSrcVar(f, "explanation_text", fmt(" ＀.", [(target = rt.op(f, "PickUnweighted", [1], [rt.list("pets", "lights", "monkeys", "fruits", "shoes", "bars of soap", "weapons", "computers", "organs")]))]), add);
	return f.dot;
});

rt.type(1143, "/datum/objective/abductee/paint", "/datum/objective/abductee", {
	explanation_text: "The station is hideous. You must color it all",
});

// /datum/objective/abductee/paint/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:21)
rt.def("/datum/objective/abductee/paint/proc/New", function New(f: Frame) {
	let color: Value = null;
	f.vars = () => [color];
	rt.modSrcVar(f, "explanation_text", fmt(" ＀!", [(color = rt.op(f, "PickUnweighted", [1], [rt.list("red", "blue", "green", "yellow", "orange", "purple", "black", "in rainbows", "in blood")]))]), add);
	return f.dot;
});

rt.type(1144, "/datum/objective/abductee/speech", "/datum/objective/abductee", {
	explanation_text: "Your brain is broken... you can only communicate in",
});

// /datum/objective/abductee/speech/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:28)
rt.def("/datum/objective/abductee/speech/proc/New", function New(f: Frame) {
	let style: Value = null;
	f.vars = () => [style];
	rt.modSrcVar(f, "explanation_text", fmt(" ＀.", [(style = rt.op(f, "PickUnweighted", [1], [rt.list("pantomime", "rhyme", "haiku", "extended metaphors", "riddles", "extremely literal terms", "sound effects", "military jargon", "three word sentences")]))]), add);
	return f.dot;
});

rt.type(1145, "/datum/objective/abductee/capture", "/datum/objective/abductee", {
	explanation_text: "Capture",
});

// /datum/objective/abductee/capture/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:35)
rt.def("/datum/objective/abductee/capture/proc/New", function New(f: Frame) {
	let jobs: Value = null, X: Value = null, J: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [jobs, X, J, target, $e];
	jobs = rt.callName(f, rt.fv(f, "occupations", rt.gl("SSjob")), "Copy", []);
	X = null;
	rt.forList(f, 0, live(jobs));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (rt.lt(rt.gv(f, "current_positions", (J = live(X))), 1)) {
			(jobs = rt.modify(live(jobs), live(J), subtract));
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(jobs)), 0)) {
		rt.modSrcVar(f, "explanation_text", fmt(" a ＀.", [rt.gv(f, "title", (target = rt.op(f, "PickUnweighted", [1], [live(jobs)])))]), add);
	} else {
		rt.modSrcVar(f, "explanation_text", " someone.", add);
	}
	return f.dot;
});

rt.type(1146, "/datum/objective/abductee/calling", "/datum/objective/abductee", {});

// /datum/objective/abductee/calling/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:47)
rt.def("/datum/objective/abductee/calling/proc/New", function New(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (!truthy((D = rt.op(f, "PickUnweighted", [1], [rt.gl("dead_mob_list")])))) return f.dot;
	rt.setSv(f, "explanation_text", fmt("You know that ＀ has perished. Hold a seance to call them from the spirit realm.", [live(D)]));
	return f.dot;
});

rt.type(1147, "/datum/objective/abductee/forbiddennumber", "/datum/objective/abductee", {});

// /datum/objective/abductee/forbiddennumber/proc/New  (code/game/gamemodes/miniantags/abduction/abductee_objectives.dm:54)
rt.def("/datum/objective/abductee/forbiddennumber/proc/New", function New(f: Frame) {
	let number: Value = null;
	f.vars = () => [number];
	rt.setSv(f, "explanation_text", fmt("Ignore anything in a set of ＀, they don't exist.", [(number = rt.call(f, P("/proc/rand"), null, [2, 10]))]));
	return f.dot;
});
