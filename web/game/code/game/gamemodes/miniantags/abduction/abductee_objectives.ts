// Based on /tg/station's code/game/gamemodes/miniantags/abduction/abductee_objectives.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1141, "/datum/objective/abductee/random", "/datum/objective/abductee", {});

// abductee_objectives.dm:8
rt.def("/datum/objective/abductee/random/proc/New", function New(f: Frame) {
	this.explanation_text = pick(rt.world().file2list("strings/abductee_objectives.txt"));
	return f.dot;
});

rt.type(1142, "/datum/objective/abductee/steal", "/datum/objective/abductee", {
	explanation_text: "Steal all",
});

// abductee_objectives.dm:14
rt.def("/datum/objective/abductee/steal/proc/New", function New(f: Frame) {
	let target: Value = null;
	this.explanation_text += ` ${(target = pick(list("pets", "lights", "monkeys", "fruits", "shoes", "bars of soap", "weapons", "computers", "organs")))}.`;
	return f.dot;
});

rt.type(1143, "/datum/objective/abductee/paint", "/datum/objective/abductee", {
	explanation_text: "The station is hideous. You must color it all",
});

// abductee_objectives.dm:21
rt.def("/datum/objective/abductee/paint/proc/New", function New(f: Frame) {
	let color: Value = null;
	this.explanation_text += ` ${(color = pick(list("red", "blue", "green", "yellow", "orange", "purple", "black", "in rainbows", "in blood")))}!`;
	return f.dot;
});

rt.type(1144, "/datum/objective/abductee/speech", "/datum/objective/abductee", {
	explanation_text: "Your brain is broken... you can only communicate in",
});

// abductee_objectives.dm:28
rt.def("/datum/objective/abductee/speech/proc/New", function New(f: Frame) {
	let style: Value = null;
	this.explanation_text += ` ${(style = pick(list("pantomime", "rhyme", "haiku", "extended metaphors", "riddles", "extremely literal terms", "sound effects", "military jargon", "three word sentences")))}.`;
	return f.dot;
});

rt.type(1145, "/datum/objective/abductee/capture", "/datum/objective/abductee", {
	explanation_text: "Capture",
});

// abductee_objectives.dm:35
rt.def("/datum/objective/abductee/capture/proc/New", function New(f: Frame) {
	let X: Value = null, J: Value = null, target: Value = null;
	let jobs: Value = GLOB.SSjob.occupations.Copy();
	for (X of each(jobs)) {
		if ((J = X).current_positions < 1) {
			jobs -= J;
		}
	}
	if (rt.len(f, jobs) > 0) {
		this.explanation_text += ` a ${(target = pick(jobs)).title}.`;
	} else {
		this.explanation_text += " someone.";
	}
	return f.dot;
});

rt.type(1146, "/datum/objective/abductee/calling", "/datum/objective/abductee", {});

// abductee_objectives.dm:47
rt.def("/datum/objective/abductee/calling/proc/New", function New(f: Frame) {
	let D: Value = null;
	if (!(D = pick(GLOB.dead_mob_list))) return f.dot;
	this.explanation_text = `You know that ${D} has perished. Hold a seance to call them from the spirit realm.`;
	return f.dot;
});

rt.type(1147, "/datum/objective/abductee/forbiddennumber", "/datum/objective/abductee", {});

// abductee_objectives.dm:54
rt.def("/datum/objective/abductee/forbiddennumber/proc/New", function New(f: Frame) {
	let number: Value = null;
	this.explanation_text = `Ignore anything in a set of ${(number = rand(2, 10))}, they don't exist.`;
	return f.dot;
});
