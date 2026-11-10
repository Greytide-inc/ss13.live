// Based on /tg/station's code/datums/diseases/advance/advance.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


rt.type(972, "/datum/disease/advance", "/datum/disease", {
	properties: null,
	symptoms: null,
	id: "",
	processing: 0,
	name: "Unknown",
	desc: "An engineered disease which can contain a multitude of symptoms.",
	form: "Advance Disease",
	agent: "advance microbes",
	max_stages: 5,
	spread_text: "Unknown",
	viable_mobtypes: null,
}, { global: { advance_cures: 641 } });

// advance.dm:31
rt.def("/datum/disease/advance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.properties = list();

	this.symptoms = list();

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"));
	return f.dot;
});

// advance.dm:51
rt.def("/datum/disease/advance/proc/New", function* New(f: Frame, process: Value, D: Value) {
	let S: Value = null;
	process ??= 1;
	if (!rt.istype(D, T("/datum/disease/advance"))) {
		D = null;
	}
	if (!this.symptoms || !rt.len(f, this.symptoms)) {
		if (!D || !D.symptoms || !rt.len(f, D.symptoms)) {
			this.symptoms = (yield* this.GenerateSymptoms(0, 2));
		} else {
			for (S of each(D.symptoms, T("/datum/symptom"))) {
				this.symptoms += (yield* new_(S.type));
			}
		}
	}
	yield* this.Refresh();
	yield* parent_proc(process, D);
	return f.dot;
}, true);

// advance.dm:69
rt.def("/datum/disease/advance/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null;
	if (this.processing) {
		for (S of each(this.symptoms, T("/datum/symptom"))) {
			yield* S.End(this);
		}
	}
	return (yield* parent_proc());
}, true);

// advance.dm:75
rt.def("/datum/disease/advance/proc/stage_act", function* stage_act(f: Frame) {
	let S: Value = null;
	yield* parent_proc();
	if (this.symptoms && rt.len(f, this.symptoms)) {
		if (!this.processing) {
			this.processing = 1;
			for (S of each(this.symptoms, T("/datum/symptom"))) {
				yield* S.Start(this);
			}
		}
		S = null;
		for (S of each(this.symptoms, T("/datum/symptom"))) {
			yield* S.Activate(this);
		}
	} else {
		CRASH("We do not have any symptoms during stage_act()!");
	}
	return f.dot;
}, true);

// advance.dm:91
rt.def("/datum/disease/advance/proc/IsSame", function* IsSame(f: Frame, D: Value) {
	if (!rt.istype(D, T("/datum/disease/advance"))) {
		return 0;
	}
	if ((yield* this.GetDiseaseID()) != (yield* D.GetDiseaseID())) {
		return 0;
	}
	return 1;
}, true);

// advance.dm:101
rt.def("/datum/disease/advance/proc/cure", function* cure(f: Frame, resistance: Value) {
	let id: Value = null;
	resistance ??= 1;
	if (this.affected_mob) {
		id = `${(yield* this.GetDiseaseID())}`;
		if (resistance && !rt.isIn(f, id, this.affected_mob.resistances)) {
			rt.setAt(this.affected_mob.resistances, id, id);
		}
		this.remove_virus();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// advance.dm:109
rt.def("/datum/disease/advance/proc/Copy", function* Copy(f: Frame, process: Value) {
	process ??= 0;
	return (yield* new_(T("/datum/disease/advance"), process, this, 1));
}, true);

// advance.dm:119
rt.def("/datum/disease/advance/proc/Mix", function* Mix(f: Frame, D: Value) {
	let S: Value = null;
	if (yield* this.IsSame(D)) return f.dot;
	let possible_symptoms: Value = shuffle(D.symptoms);
	for (S of each(possible_symptoms, T("/datum/symptom"))) {
		this.AddSymptom((yield* new_(S.type)));
	}
	return f.dot;
}, true);

// advance.dm:125
rt.def("/datum/disease/advance/proc/HasSymptom", function HasSymptom(f: Frame, S: Value) {
	let symp: Value = null;
	for (symp of each(this.symptoms, T("/datum/symptom"))) {
		if (symp.id == S.id) {
			return 1;
		}
	}
	return 0;
});

// advance.dm:133
rt.def("/datum/disease/advance/proc/GenerateSymptoms", function* GenerateSymptoms(f: Frame, level_min: Value, level_max: Value, amount_get: Value) {
	let symp: Value = null, S: Value = null;
	amount_get ??= 0;
	let generated: Value = list();
	let possible_symptoms: Value = list();
	for (symp of each(GLOB.list_symptoms)) {
		if ((S = (yield* new_(symp))).level >= level_min && S.level <= level_max) {
			if (!this.HasSymptom(S)) {
				possible_symptoms += S;
			}
		}
	}
	if (!rt.len(f, possible_symptoms)) {
		return generated;
	}
	let number_of: Value = amount_get;
	if (!amount_get) {
		number_of = 1;
		while (prob(20)) {
			number_of += 1;
		}
	}
	let i: Value = 1;
	while (number_of >= i && rt.len(f, possible_symptoms)) {
		generated += pick_n_take(possible_symptoms);
		i++;
	}
	return generated;
}, true);

// advance.dm:160
rt.def("/datum/disease/advance/proc/Refresh", function* Refresh(f: Frame, new_name: Value) {
	let A: Value = null;
	new_name ??= 0;
	this.GenerateProperties();
	this.AssignProperties();
	this.id = null;
	if (!rt.index(GLOB.SSdisease.archive_diseases, (yield* this.GetDiseaseID()))) {
		if (new_name) {
			this.AssignName();
		}
		rt.setAt(GLOB.SSdisease.archive_diseases, (yield* this.GetDiseaseID()), this);
		rt.setAt(GLOB.SSdisease.archive_diseases, (yield* this.GetDiseaseID()), (yield* new_(T("/datum/disease/advance"), 0, this, 1)));
	}
	this.AssignName((A = rt.index(GLOB.SSdisease.archive_diseases, (yield* this.GetDiseaseID()))).name);
	return f.dot;
}, true);

// advance.dm:176
rt.def("/datum/disease/advance/proc/GenerateProperties", function GenerateProperties(f: Frame) {
	let S: Value = null;
	if (!this.symptoms || !rt.len(f, this.symptoms)) {
		CRASH("We did not have any symptoms before generating properties.");
		return f.dot;
	}
	this.properties = rt.alist(f, ["resistance", 0, "stealth", 0, "stage_rate", 0, "transmittable", 0, "severity", 0]);
	for (S of each(this.symptoms, T("/datum/symptom"))) {
		rt.modAt(this.properties, "resistance", S.resistance, add);
		rt.modAt(this.properties, "stealth", S.stealth, add);
		rt.modAt(this.properties, "stage_rate", S.stage_speed, add);
		rt.modAt(this.properties, "transmittable", S.transmittable, add);
		rt.setAt(this.properties, "severity", max(rt.at(this.properties, "severity"), S.severity));
	}
	return f.dot;
});

// advance.dm:193
rt.def("/datum/disease/advance/proc/AssignProperties", function AssignProperties(f: Frame) {
	if (this.properties && rt.len(f, this.properties)) {
		const item = rt.at(this.properties, "stealth");
		if (item === 2 || item === 3) {
			this.visibility_flags = HIDDEN_SCANNER;
		} else if (rt.inRange(item, 4, 1e+31)) {
			this.visibility_flags = 3;
		}
		this.SetSpread(max(BLOOD, min(2 ** (rt.at(this.properties, "transmittable") - rt.len(f, this.symptoms)), AIRBORNE)));
		this.permeability_mod = max(Ceiling(0.4 * rt.at(this.properties, "transmittable")), 1);
		this.cure_chance = 15 - max(-5, min(rt.at(this.properties, "resistance"), 5));
		this.stage_prob = max(rt.at(this.properties, "stage_rate"), 2);
		this.SetSeverity(rt.at(this.properties, "severity"));
		this.GenerateCure(this.properties);
	} else {
		CRASH("Our properties were empty or null!");
	}
	return f.dot;
});

// advance.dm:213
rt.def("/datum/disease/advance/proc/SetSpread", function SetSpread(f: Frame, spread_id: Value) {
	if (spread_id === NON_CONTAGIOUS) {
		this.spread_text = "None";
	} else if (spread_id === SPECIAL) {
		this.spread_text = "None";
	} else if (spread_id === CONTACT_GENERAL || spread_id === CONTACT_HANDS || spread_id === CONTACT_FEET) {
		this.spread_text = "On contact";
	} else if (spread_id === AIRBORNE) {
		this.spread_text = "Airborne";
	} else if (spread_id === BLOOD) {
		this.spread_text = "Blood";
	}
	this.spread_flags = spread_id;
	return f.dot;
});

// advance.dm:229
rt.def("/datum/disease/advance/proc/SetSeverity", function SetSeverity(f: Frame, level_sev: Value) {
	if (rt.inRange(level_sev, -1e+31, 0)) {
		this.severity = "No threat";
	} else if (level_sev === 1) {
		this.severity = "Minor";
	} else if (level_sev === 2) {
		this.severity = "Medium";
	} else if (level_sev === 3) {
		this.severity = "Harmful";
	} else if (level_sev === 4) {
		this.severity = "Dangerous!";
	} else if (rt.inRange(level_sev, 5, 1e+31)) {
		this.severity = "BIOHAZARD THREAT!";
	} else {
		this.severity = "Unknown";
	}
	return f.dot;
});

// advance.dm:249
rt.def("/datum/disease/advance/proc/GenerateCure", function GenerateCure(f: Frame) {
	let res: Value = null, D: Value = null;
	if (this.properties && rt.len(f, this.properties)) {
		res = max(1, min(rt.at(this.properties, "resistance") - rt.len(f, this.symptoms) / 2, rt.len(f, GLOB.advance_cures)));
		this.cures = list(rt.index(GLOB.advance_cures, res));
		this.cure_text = (D = rt.index(GLOB.chemical_reagents_list, rt.index(this.cures, 1))).name;
	}
	return f.dot;
});

// advance.dm:263
rt.def("/datum/disease/advance/proc/Evolve", function* Evolve(f: Frame, min_level: Value, max_level: Value) {
	let s: Value = null;
	if (s = safepick((yield* this.GenerateSymptoms(min_level, max_level, 1)))) {
		this.AddSymptom(s);
		yield* this.Refresh(1);
	}
	return f.dot;
}, true);

// advance.dm:271
rt.def("/datum/disease/advance/proc/Devolve", function* Devolve(f: Frame) {
	let s: Value = null;
	if (rt.len(f, this.symptoms) > 1) {
		if (s = safepick(this.symptoms)) {
			this.RemoveSymptom(s);
			yield* this.Refresh(1);
		}
	}
	return f.dot;
}, true);

// advance.dm:285
rt.def("/datum/disease/advance/proc/GetDiseaseID", function* GetDiseaseID(f: Frame) {
	let L: Value = null, S: Value = null, result: Value = null;
	if (!this.id) {
		L = list();
		for (S of each(this.symptoms, T("/datum/symptom"))) {
			L += S.id;
		}
		L = (yield* sortList(L));
		this.id = (result = jointext(L, ":"));
	}
	return this.id;
}, true);

// advance.dm:299
rt.def("/datum/disease/advance/proc/AddSymptom", function AddSymptom(f: Frame, S: Value) {
	if (this.HasSymptom(S)) {
		return f.dot;
	}
	if (rt.len(f, this.symptoms) < 7 + rand(-1, 1)) {
		this.symptoms += S;
	} else {
		this.RemoveSymptom(pick(this.symptoms));
		this.symptoms += S;
	}
	return f.dot;
});

// advance.dm:311
rt.def("/datum/disease/advance/proc/RemoveSymptom", function RemoveSymptom(f: Frame, S: Value) {
	this.symptoms -= S;
	return f.dot;
});

// advance.dm:325
rt.def("/proc/Advance_Mix", function* Advance_Mix(f: Frame, D_list: Value) {
	let A: Value = null, D1: Value = null, D2: Value = null, to_return: Value = null;
	let diseases: Value = list();
	for (A of each(D_list, T("/datum/disease/advance"))) {
		diseases += (yield* A.Copy());
	}
	if (!rt.len(f, diseases)) {
		return null;
	}
	if (rt.len(f, diseases) <= 1) {
		return pick(diseases);
	}
	let i: Value = 0;
	while (i < 20 && rt.len(f, diseases) > 1) {
		i++;
		diseases -= (D1 = pick(diseases));
		yield* (D2 = pick(diseases)).Mix(D1);
	}
	yield* (to_return = pick(diseases)).Refresh(1);
	return to_return;
}, true);

// advance.dm:355
rt.def("/proc/SetViruses", function* SetViruses(f: Frame, R: Value, data: Value) {
	let A: Value = null;
	if (!data) return f.dot;
	let preserve: Value = list();
	if (rt.istype(data, T("/list")) && rt.at(data, "viruses")) {
		for (A of each(rt.at(data, "viruses"), T("/datum/disease"))) {
			preserve += (yield* A.Copy());
		}
		R.data = (yield* data.Copy());
	}
	if (!rt.len(f, preserve)) return f.dot;
	rt.setAt(R.data, "viruses", preserve);
	return f.dot;
}, true);

// advance.dm:365
rt.def("/proc/AdminCreateVirus", function* AdminCreateVirus(f: Frame, user: Value) {
	let D: Value = null, symptom: Value = null, S: Value = null, new_name: Value = null, AD: Value = null, H: Value = null, S_5: Value = null;
	if (!user) {
		return f.dot;
	}
	let i: Value = 8;
	(D = (yield* new_(T("/datum/disease/advance"), 0, null))).symptoms = list();
	let symptoms: Value = list();
	symptoms += "Done";
	symptoms += (yield* GLOB.list_symptoms.Copy());
	while (true) {
		if (user) {
			if ((symptom = (yield* g.op(f, "Prompt", [0], [null, "Choose a Symptom", `Choose a symptom to add (${i} remaining)`, user, symptoms]))) === null) {
				return f.dot;
			} else if (istext(symptom)) {
				i = 0;
			} else if (ispath(symptom)) {
				S = (yield* new_(symptom));
				if (!D.HasSymptom(S)) {
					D.symptoms += S;
					i -= 1;
				}
			}
		}
		if (!(i > 0)) break;
	}
	if (!(rt.len(f, D.symptoms) > 0)) return f.dot;
	if (!(new_name = (yield* stripped_input(user, "Name your new disease.", "New Name")))) {
		return f.dot;
	}
	D.AssignName(new_name);
	yield* D.Refresh();
	for (AD of each(GLOB.SSdisease.processing, T("/datum/disease/advance"))) {
		yield* AD.Refresh();
	}
	for (H of each(shuffle(GLOB.living_mob_list), T("/mob/living/carbon/human"))) {
		if (H.z != ZLEVEL_STATION) {
			continue;
		}
		if (!(yield* H.HasDisease(D))) {
			yield* H.ForceContractDisease(D);
			break;
		}
	}
	let name_symptoms: Value = list();
	for (S_5 of each(D.symptoms, T("/datum/symptom"))) {
		name_symptoms += S_5.name;
	}
	message_admins(`${key_name_admin(user)} has triggered a custom virus outbreak of ${D.name}! It has these symptoms: ${english_list(name_symptoms)}`);
	return f.dot;
}, true);

// advance.dm:422
rt.def("/datum/disease/advance/proc/totalStageSpeed", function totalStageSpeed(f: Frame) {
	return rt.at(this.properties, "stage_rate");
});

// advance.dm:425
rt.def("/datum/disease/advance/proc/totalStealth", function totalStealth(f: Frame) {
	return rt.at(this.properties, "stealth");
});

// advance.dm:428
rt.def("/datum/disease/advance/proc/totalResistance", function totalResistance(f: Frame) {
	return rt.at(this.properties, "resistance");
});

// advance.dm:431
rt.def("/datum/disease/advance/proc/totalTransmittable", function totalTransmittable(f: Frame) {
	return rt.at(this.properties, "transmittable");
});
