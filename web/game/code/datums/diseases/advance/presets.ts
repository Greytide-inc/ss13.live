// Based on /tg/station's code/datums/diseases/advance/presets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(973, "/datum/disease/advance/cold", "/datum/disease/advance", {});

// presets.dm:4
rt.def("/datum/disease/advance/cold/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Cold";
		this.symptoms = list((yield* new_(T("/datum/symptom/sneeze"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(974, "/datum/disease/advance/flu", "/datum/disease/advance", {});

// presets.dm:13
rt.def("/datum/disease/advance/flu/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Flu";
		this.symptoms = list((yield* new_(T("/datum/symptom/cough"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(975, "/datum/disease/advance/voice_change", "/datum/disease/advance", {});

// presets.dm:22
rt.def("/datum/disease/advance/voice_change/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Epiglottis Mutation";
		this.symptoms = list((yield* new_(T("/datum/symptom/voice_change"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(976, "/datum/disease/advance/heal", "/datum/disease/advance", {});

// presets.dm:31
rt.def("/datum/disease/advance/heal/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Liver Enhancer";
		this.symptoms = list((yield* new_(T("/datum/symptom/heal"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(977, "/datum/disease/advance/hullucigen", "/datum/disease/advance", {});

// presets.dm:40
rt.def("/datum/disease/advance/hullucigen/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Reality Impairment";
		this.symptoms = list((yield* new_(T("/datum/symptom/hallucigen"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(978, "/datum/disease/advance/sensory_restoration", "/datum/disease/advance", {});

// presets.dm:48
rt.def("/datum/disease/advance/sensory_restoration/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Reality Enhancer";
		this.symptoms = list((yield* new_(T("/datum/symptom/sensory_restoration"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);

rt.type(979, "/datum/disease/advance/sensory_destruction", "/datum/disease/advance", {});

// presets.dm:56
rt.def("/datum/disease/advance/sensory_destruction/proc/New", function* New(f: Frame, process: Value, D: Value, copy: Value) {
	process ??= 1;
	copy ??= 0;
	if (!D) {
		this.name = "Reality Destruction";
		this.symptoms = list((yield* new_(T("/datum/symptom/sensory_destruction"))));
	}
	yield* parent_proc(process, D, copy);
	return f.dot;
}, true);
