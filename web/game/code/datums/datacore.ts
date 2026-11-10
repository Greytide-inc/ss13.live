// Based on /tg/station's code/datums/datacore.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(391, "/datum/datacore", "/datum", {
	medical: null,
	medicalPrintCount: 0,
	general: null,
	security: null,
	securityPrintCount: 0,
	securityCrimeCounter: 0,
	locked: null,
});

// datacore.dm:3
rt.def("/datum/datacore/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.medical = list();

	this.general = list();

	this.security = list();

	this.locked = list();
	return f.dot;
});

rt.type(393, "/datum/data/record", "/datum/data", {
	fields: null,
	name: "record",
});

// datacore.dm:17
rt.def("/datum/data/record/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.fields = list();
	return f.dot;
});

// datacore.dm:20
rt.def("/datum/data/record/proc/Destroy", function* Destroy(f: Frame) {
	if (rt.isIn(f, this, GLOB.data_core.medical)) {
		GLOB.data_core.medical -= this;
	}
	if (rt.isIn(f, this, GLOB.data_core.security)) {
		GLOB.data_core.security -= this;
	}
	if (rt.isIn(f, this, GLOB.data_core.general)) {
		GLOB.data_core.general -= this;
	}
	if (rt.isIn(f, this, GLOB.data_core.locked)) {
		GLOB.data_core.locked -= this;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// datacore.dm:39
rt.def("/datum/datacore/proc/createCrimeEntry", function createCrimeEntry(f: Frame, cname: Value, cdetails: Value, author: Value, time: Value) {
	let c: Value = null;
	cname ??= "";
	cdetails ??= "";
	author ??= "";
	time ??= "";
	(c = new_(T("/datum/data/crime"))).crimeName = cname;
	c.crimeDetails = cdetails;
	c.author = author;
	c.time = time;
	c.dataId = ++this.securityCrimeCounter;
	return c;
});

// datacore.dm:48
rt.def("/datum/datacore/proc/addMinorCrime", function addMinorCrime(f: Frame, id: Value, crime: Value) {
	let R: Value = null, crimes: Value = null;
	id ??= "";
	for (R of each(this.security, T("/datum/data/record"))) {
		if (rt.index(R.fields, "id") == id) {
			crimes = rt.index(R.fields, "mi_crim");
			(crimes = rt.modify(crimes, crime, rt.bitOr));
			return f.dot;
		}
	}
	return f.dot;
});

// datacore.dm:55
rt.def("/datum/datacore/proc/removeMinorCrime", function removeMinorCrime(f: Frame, id: Value, cDataId: Value) {
	let R: Value = null, crimes: Value = null, crime: Value = null;
	for (R of each(this.security, T("/datum/data/record"))) {
		if (rt.index(R.fields, "id") == id) {
			crimes = rt.index(R.fields, "mi_crim");
			crime = null;
			for (crime of each(crimes, T("/datum/data/crime"))) {
				if (crime.dataId == text2num(cDataId)) {
					crimes -= crime;
					return f.dot;
				}
			}
		}
	}
	return f.dot;
});

// datacore.dm:64
rt.def("/datum/datacore/proc/removeMajorCrime", function removeMajorCrime(f: Frame, id: Value, cDataId: Value) {
	let R: Value = null, crimes: Value = null, crime: Value = null;
	for (R of each(this.security, T("/datum/data/record"))) {
		if (rt.index(R.fields, "id") == id) {
			crimes = rt.index(R.fields, "ma_crim");
			crime = null;
			for (crime of each(crimes, T("/datum/data/crime"))) {
				if (crime.dataId == text2num(cDataId)) {
					crimes -= crime;
					return f.dot;
				}
			}
		}
	}
	return f.dot;
});

// datacore.dm:73
rt.def("/datum/datacore/proc/addMajorCrime", function addMajorCrime(f: Frame, id: Value, crime: Value) {
	let R: Value = null, crimes: Value = null;
	id ??= "";
	for (R of each(this.security, T("/datum/data/record"))) {
		if (rt.index(R.fields, "id") == id) {
			crimes = rt.index(R.fields, "ma_crim");
			(crimes = rt.modify(crimes, crime, rt.bitOr));
			return f.dot;
		}
	}
	return f.dot;
});

// datacore.dm:80
rt.def("/datum/datacore/proc/manifest", function* manifest(f: Frame) {
	let N: Value = null;
	for (N of each(GLOB.player_list, T("/mob/dead/new_player"))) {
		if (rt.istype(N.new_character, T("/mob/living/carbon/human"))) {
			yield* this.manifest_inject(N.new_character, N.client);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// datacore.dm:86
rt.def("/datum/datacore/proc/manifest_modify", function manifest_modify(f: Frame, name: Value, assignment: Value) {
	let foundrecord: Value = null;
	if (!(foundrecord = find_record("name", name, GLOB.data_core.general))) return f.dot;
	rt.setAt(foundrecord.fields, "rank", assignment);
	return f.dot;
});

// datacore.dm:91
rt.def("/datum/datacore/proc/get_manifest", function get_manifest(f: Frame, monochrome: Value, OOC: Value) {
	let t: Value = null, name: Value = null, rank: Value = null, department: Value = null, name_11: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let heads: Value = list();
	let sec: Value = list();
	let eng: Value = list();
	let med: Value = list();
	let sci: Value = list();
	let sup: Value = list();
	let civ: Value = list();
	let bot: Value = list();
	let misc: Value = list();
	if (monochrome) {
		$0 = "black";
	} else {
		$0 = "#DEF; background-color:white; color:black";
	}
	if (monochrome) {
		$1 = "border-top-width: 3px";
	} else {
		$1 = "background-color: #48C; color:white";
	}
	if (monochrome) {
		$2 = "border-top-width: 1px";
	} else {
		$2 = "background-color: #488;";
	}
	if (monochrome) {
		$3 = "border-top-width: 2px";
	} else {
		$3 = "background-color: #DEF";
	}
	let dat: Value = `\n\t<head><style>\n\t\t.manifest {border-collapse:collapse;}\n\t\t.manifest td, th {border:1px solid ${$0}; padding:.25em}\n\t\t.manifest th {height: 2em; ${$1}}\n\t\t.manifest tr.head th { ${$2} }\n\t\t.manifest td:first-child {text-align:right}\n\t\t.manifest tr.alt td {${$3}}\n\t</style></head>\n\t<table class="manifest" width='350px'>\n\t<tr class='head'><th>Name</th><th>Rank</th></tr>\n\t`;
	let even: Value = 0;
	for (t of each(GLOB.data_core.general, T("/datum/data/record"))) {
		name = rt.index(t.fields, "name");
		rank = rt.index(t.fields, "rank");
		department = 0;
		if (rt.isIn(f, rank, GLOB.command_positions)) {
			rt.setAt(heads, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.security_positions)) {
			rt.setAt(sec, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.engineering_positions)) {
			rt.setAt(eng, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.medical_positions)) {
			rt.setAt(med, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.science_positions)) {
			rt.setAt(sci, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.supply_positions)) {
			rt.setAt(sup, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.civilian_positions)) {
			rt.setAt(civ, name, rank);
			department = 1;
		}
		if (rt.isIn(f, rank, GLOB.nonhuman_positions)) {
			rt.setAt(bot, name, rank);
			department = 1;
		}
		if (!department && !rt.isIn(f, name, heads)) {
			rt.setAt(misc, name, rank);
		}
	}
	if (rt.len(f, heads) > 0) {
		dat += "<tr><th colspan=3>Heads</th></tr>";
		for (name_11 of each(heads)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(heads, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, sec) > 0) {
		dat += "<tr><th colspan=3>Security</th></tr>";
		name_11 = null;
		for (name_11 of each(sec)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(sec, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, eng) > 0) {
		dat += "<tr><th colspan=3>Engineering</th></tr>";
		name_11 = null;
		for (name_11 of each(eng)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(eng, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, med) > 0) {
		dat += "<tr><th colspan=3>Medical</th></tr>";
		name_11 = null;
		for (name_11 of each(med)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(med, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, sci) > 0) {
		dat += "<tr><th colspan=3>Science</th></tr>";
		name_11 = null;
		for (name_11 of each(sci)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(sci, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, sup) > 0) {
		dat += "<tr><th colspan=3>Supply</th></tr>";
		name_11 = null;
		for (name_11 of each(sup)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(sup, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, civ) > 0) {
		dat += "<tr><th colspan=3>Civilian</th></tr>";
		name_11 = null;
		for (name_11 of each(civ)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(civ, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, bot) > 0) {
		dat += "<tr><th colspan=3>Silicon</th></tr>";
		name_11 = null;
		for (name_11 of each(bot)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(bot, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	if (rt.len(f, misc) > 0) {
		dat += "<tr><th colspan=3>Miscellaneous</th></tr>";
		name_11 = null;
		for (name_11 of each(misc)) {
			dat += `<tr${even ? " class='alt'" : ""}><td>${name_11}</td><td>${rt.index(misc, name_11)}</td></tr>`;
			even = (!even ? 1 : 0);
		}
	}
	return (dat = replacetext((dat = replacetext((dat += "</table>"), "\n", "")), "\t", ""));
});

// datacore.dm:199
rt.def("/datum/datacore/proc/manifest_inject", function* manifest_inject(f: Frame, H: Value, C: Value) {
	let assignment: Value = null, id: Value = null, image: Value = null, photo_front: Value = null, photo_side: Value = null, G: Value = null, M: Value = null, S: Value = null, L: Value = null;
	if (H.mind && H.mind.assigned_role != H.mind.special_role) {
		if (H.mind.assigned_role) {
			assignment = H.mind.assigned_role;
		} else if (H.job) {
			assignment = H.job;
		} else {
			assignment = "Unassigned";
		}
		id = num2hex(rt.incGl("record_id_num", 1, true), 6);
		if (!C) {
			C = H.client;
		}
		image = (yield* this.get_id_photo(H, C));
		photo_front = (yield* new_(T("/obj/item/weapon/photo")));
		photo_side = (yield* new_(T("/obj/item/weapon/photo")));
		photo_front.photocreate(null, (yield* icon(image, { dir: 2 })));
		photo_side.photocreate(null, (yield* icon(image, { dir: 8 })));
		rt.setAt((G = (yield* new_(T("/datum/data/record")))).fields, "id", id);
		rt.setAt(G.fields, "name", H.real_name);
		rt.setAt(G.fields, "rank", assignment);
		rt.setAt(G.fields, "age", H.age);
		if (GLOB.config.mutant_races) {
			rt.setAt(G.fields, "species", H.dna.species.name);
		}
		rt.setAt(G.fields, "fingerprint", md5(H.dna.uni_identity));
		rt.setAt(G.fields, "p_stat", "Active");
		rt.setAt(G.fields, "m_stat", "Stable");
		rt.setAt(G.fields, "sex", H.gender);
		rt.setAt(G.fields, "photo_front", photo_front);
		rt.setAt(G.fields, "photo_side", photo_side);
		this.general += G;
		rt.setAt((M = (yield* new_(T("/datum/data/record")))).fields, "id", id);
		rt.setAt(M.fields, "name", H.real_name);
		rt.setAt(M.fields, "blood_type", H.dna.blood_type);
		rt.setAt(M.fields, "b_dna", H.dna.unique_enzymes);
		rt.setAt(M.fields, "mi_dis", "None");
		rt.setAt(M.fields, "mi_dis_d", "No minor disabilities have been declared.");
		rt.setAt(M.fields, "ma_dis", "None");
		rt.setAt(M.fields, "ma_dis_d", "No major disabilities have been diagnosed.");
		rt.setAt(M.fields, "alg", "None");
		rt.setAt(M.fields, "alg_d", "No allergies have been detected in this patient.");
		rt.setAt(M.fields, "cdi", "None");
		rt.setAt(M.fields, "cdi_d", "No diseases have been diagnosed at the moment.");
		rt.setAt(M.fields, "notes", "No notes.");
		this.medical += M;
		rt.setAt((S = (yield* new_(T("/datum/data/record")))).fields, "id", id);
		rt.setAt(S.fields, "name", H.real_name);
		rt.setAt(S.fields, "criminal", "None");
		rt.setAt(S.fields, "mi_crim", list());
		rt.setAt(S.fields, "ma_crim", list());
		rt.setAt(S.fields, "notes", "No notes.");
		this.security += S;
		rt.setAt((L = (yield* new_(T("/datum/data/record")))).fields, "id", md5(`${H.real_name}${H.mind.assigned_role}`));
		rt.setAt(L.fields, "name", H.real_name);
		rt.setAt(L.fields, "rank", H.mind.assigned_role);
		rt.setAt(L.fields, "age", H.age);
		rt.setAt(L.fields, "sex", H.gender);
		rt.setAt(L.fields, "blood_type", H.dna.blood_type);
		rt.setAt(L.fields, "b_dna", H.dna.unique_enzymes);
		rt.setAt(L.fields, "enzymes", H.dna.struc_enzymes);
		rt.setAt(L.fields, "identity", H.dna.uni_identity);
		rt.setAt(L.fields, "species", H.dna.species.type);
		rt.setAt(L.fields, "features", H.dna.features);
		rt.setAt(L.fields, "image", image);
		rt.setAt(L.fields, "reference", H);
		this.locked += L;
	}
	return f.dot;
}, true);

// datacore.dm:281
rt.def("/datum/datacore/proc/get_id_photo", function* get_id_photo(f: Frame, H: Value, C: Value) {
	let _P: Value = null;
	let J: Value = (yield* GLOB.SSjob.GetJob(H.mind.assigned_role));
	if (!C) {
		C = H.client;
	}
	if (C) {
		_P = C.prefs;
	}
	return (yield* get_flat_human_icon(null, J, _P));
}, true);
