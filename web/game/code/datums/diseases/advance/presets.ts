// From code/datums/diseases/advance/presets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(973, "/datum/disease/advance/cold", "/datum/disease/advance", {});

// /datum/disease/advance/cold/proc/New  (code/datums/diseases/advance/presets.dm:4)  may sleep
rt.def("/datum/disease/advance/cold/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Cold");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/sneeze"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(974, "/datum/disease/advance/flu", "/datum/disease/advance", {});

// /datum/disease/advance/flu/proc/New  (code/datums/diseases/advance/presets.dm:13)  may sleep
rt.def("/datum/disease/advance/flu/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Flu");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/cough"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(975, "/datum/disease/advance/voice_change", "/datum/disease/advance", {});

// /datum/disease/advance/voice_change/proc/New  (code/datums/diseases/advance/presets.dm:22)  may sleep
rt.def("/datum/disease/advance/voice_change/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Epiglottis Mutation");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/voice_change"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(976, "/datum/disease/advance/heal", "/datum/disease/advance", {});

// /datum/disease/advance/heal/proc/New  (code/datums/diseases/advance/presets.dm:31)  may sleep
rt.def("/datum/disease/advance/heal/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Liver Enhancer");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/heal"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(977, "/datum/disease/advance/hullucigen", "/datum/disease/advance", {});

// /datum/disease/advance/hullucigen/proc/New  (code/datums/diseases/advance/presets.dm:40)  may sleep
rt.def("/datum/disease/advance/hullucigen/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Reality Impairment");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/hallucigen"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(978, "/datum/disease/advance/sensory_restoration", "/datum/disease/advance", {});

// /datum/disease/advance/sensory_restoration/proc/New  (code/datums/diseases/advance/presets.dm:48)  may sleep
rt.def("/datum/disease/advance/sensory_restoration/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Reality Enhancer");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/sensory_restoration"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);

rt.type(979, "/datum/disease/advance/sensory_destruction", "/datum/disease/advance", {});

// /datum/disease/advance/sensory_destruction/proc/New  (code/datums/diseases/advance/presets.dm:56)  may sleep
rt.def("/datum/disease/advance/sensory_destruction/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	f.vars = () => [process, D, copy];
	if (live(process) === null) {
		process = 1;
	}
	if (live(copy) === null) {
		copy = 0;
	}
	if (!truthy(live(D))) {
		rt.setSv(f, "name", "Reality Destruction");
		rt.setSv(f, "symptoms", rt.list((yield* g.new_(f, T("/datum/symptom/sensory_destruction"), []))));
	}
	yield* g.callSuper(f, [live(process), live(D), live(copy)]);
	return f.dot;
}, true);
