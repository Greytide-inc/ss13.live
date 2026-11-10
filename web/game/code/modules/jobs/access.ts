// Based on /tg/station's code/modules/jobs/access.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// access.dm:108
rt.def("/obj/proc/allowed", function allowed(f: Frame, M: Value) {
	let H: Value = null, george: Value = null, A: Value = null;
	if (this.check_access(null)) {
		return 1;
	}
	if (rt.istype(M, T("/mob/living/silicon"))) {
		if (rt.istype(M, T("/mob/living/silicon/pai"))) {
			return 0;
		}
		return 1;
	}
	if (IsAdminGhost(M)) {
		return 1;
	} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (this.check_access((H = M).get_active_held_item()) || this.check_access(H.wear_id)) {
			return 1;
		}
	} else if (rt.istype(M, T("/mob/living/carbon/monkey")) || rt.istype(M, T("/mob/living/carbon/alien/humanoid"))) {
		if (this.check_access((george = M).get_active_held_item())) {
			return 1;
		}
	} else if (rt.istype(M, T("/mob/living/simple_animal"))) {
		if (this.check_access((A = M).get_active_held_item()) || this.check_access(A.access_card)) {
			return 1;
		}
	}
	return 0;
});

// access.dm:134
rt.def("/obj/item/proc/GetAccess", function GetAccess(f: Frame) {
	return list();
});

// access.dm:137
rt.def("/obj/item/proc/GetID", function GetID(f: Frame) {
	return null;
});

// access.dm:140
rt.def("/obj/proc/text2access", function text2access(f: Frame, access_text: Value) {
	let x: Value = null, n: Value = null;
	f.dot = list();
	if (!access_text) {
		return f.dot;
	}
	let split: Value = splittext(access_text, ";");
	for (x of each(split)) {
		if (n = text2num(x)) {
			f.dot += n;
		}
	}
	return f.dot;
});

// access.dm:152
rt.def("/obj/proc/gen_access", function gen_access(f: Frame) {
	let a: Value = null, b: Value = null;
	if (!this.req_access) {
		this.req_access = list();
		for (a of each(this.text2access(this.req_access_txt))) {
			this.req_access += a;
		}
	}
	if (this.req_one_access) return f.dot;
	this.req_one_access = list();
	for (b of each(this.text2access(this.req_one_access_txt))) {
		this.req_one_access += b;
	}
	return f.dot;
});

// access.dm:162
rt.def("/obj/proc/check_access", function check_access(f: Frame, I: Value) {
	let L: Value = null, req: Value = null;
	this.gen_access();
	if (!rt.istype(this.req_access, T("/list"))) {
		return 1;
	}
	if (!rt.len(f, (L = this.req_access)) && (!this.req_one_access || !rt.len(f, this.req_one_access))) {
		return 1;
	}
	if (!I) {
		return 0;
	}
	for (req of each(this.req_access)) {
		if (!rt.isIn(f, req, I.GetAccess())) {
			return 0;
		}
	}
	if (this.req_one_access && rt.len(f, this.req_one_access)) {
		req = null;
		for (req of each(this.req_one_access)) {
			if (rt.isIn(f, req, I.GetAccess())) {
				return 1;
			}
		}
		return 0;
	}
	return 1;
});

// access.dm:184
rt.def("/obj/proc/check_access_list", function check_access_list(f: Frame, L: Value) {
	let req: Value = null;
	if (!this.req_access && !this.req_one_access) {
		return 1;
	}
	if (!rt.istype(this.req_access, T("/list"))) {
		return 1;
	}
	if (!rt.len(f, this.req_access) && (!this.req_one_access || !rt.len(f, this.req_one_access))) {
		return 1;
	}
	if (!L) {
		return 0;
	}
	if (!rt.istype(L, T("/list"))) {
		return 0;
	}
	for (req of each(this.req_access)) {
		if (!rt.isIn(f, req, L)) {
			return 0;
		}
	}
	if (this.req_one_access && rt.len(f, this.req_one_access)) {
		req = null;
		for (req of each(this.req_one_access)) {
			if (rt.isIn(f, req, L)) {
				return 1;
			}
		}
		return 0;
	}
	return 1;
});

// access.dm:205
rt.def("/proc/get_centcom_access", function get_centcom_access(f: Frame, job: Value) {
	if (job === "VIP Guest") {
		return list(101);
	} else if (job === "Custodian") {
		return list(101, 105, 106);
	} else if (job === "Thunderdome Overseer") {
		return list(101, 102);
	} else if (job === "Centcom Official") {
		return list(101, 105);
	} else if (job === "Medical Officer") {
		return list(101, 105, 104);
	} else if (job === "Death Commando") {
		return list(101, 103, 105, 106);
	} else if (job === "Research Officer") {
		return list(101, 103, 104, 107, 106);
	} else if (job === "Special Ops Officer") {
		return list(101, 102, 103, 105, 106);
	} else if (job === "Admiral") {
		return get_all_centcom_access();
	} else if (job === "Centcom Commander") {
		return get_all_centcom_access();
	} else if (job === "Emergency Response Team Commander") {
		return get_ert_access("commander");
	} else if (job === "Security Response Officer") {
		return get_ert_access("sec");
	} else if (job === "Engineer Response Officer") {
		return get_ert_access("eng");
	} else if (job === "Medical Response Officer") {
		return get_ert_access("med");
	} else if (job === "Centcom Bartender") {
		return list(101, 105, 110);
	}
	return f.dot;
});

// access.dm:238
rt.def("/proc/get_all_accesses", function get_all_accesses(f: Frame) {
	return list(1, 63, 2, 3, 4, 42, 5, 9, 6, 30, 7, 8, 33, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 22, 24, 28, 25, 26, 27, 29, 31, 32, 35, 37, 38, 39, 40, 41, 45, 46, 47, 48, 50, 66, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 67, 68);
});

// access.dm:251
rt.def("/proc/get_all_centcom_access", function get_all_centcom_access(f: Frame) {
	return list(101, 102, 103, 104, 105, 106, 107, 109);
});

// access.dm:254
rt.def("/proc/get_ert_access", function get_ert_access(f: Frame, _class: Value) {
	if (_class === "commander") {
		return get_all_centcom_access();
	} else if (_class === "sec") {
		return list(101, 103, 105);
	} else if (_class === "eng") {
		return list(101, 103, 105, 106);
	} else if (_class === "med") {
		return list(101, 103, 104, 105);
	}
	return f.dot;
});

// access.dm:265
rt.def("/proc/get_all_syndicate_access", function get_all_syndicate_access(f: Frame) {
	return list(150, 150);
});

// access.dm:268
rt.def("/proc/get_region_accesses", function get_region_accesses(f: Frame, code: Value) {
	if (code === 0) {
		return get_all_accesses();
	} else if (code === 1) {
		return list(28, 25, 35, 26, 22, 27, 37, 46, 38);
	} else if (code === 2) {
		return list(63, 66, 1, 2, 3, 4, 42, 58);
	} else if (code === 3) {
		return list(5, 9, 68, 6, 33, 39, 45, 40);
	} else if (code === 4) {
		return list(47, 7, 8, 9, 29, 55, 65, 30, 67);
	} else if (code === 5) {
		return list(32, 12, 10, 11, 13, 23, 24, 61, 65, 56);
	} else if (code === 6) {
		return list(50, 48, 54, 64, 31, 41);
	} else if (code === 7) {
		return list(19, 59, 60, 15, 16, 17, 18, 62, 21, 53, 57, 20);
	}
	return f.dot;
});

// access.dm:287
rt.def("/proc/get_region_accesses_name", function get_region_accesses_name(f: Frame, code: Value) {
	if (code === 0) {
		return "All";
	} else if (code === 1) {
		return "General";
	} else if (code === 2) {
		return "Security";
	} else if (code === 3) {
		return "Medbay";
	} else if (code === 4) {
		return "Research";
	} else if (code === 5) {
		return "Engineering";
	} else if (code === 6) {
		return "Supply";
	} else if (code === 7) {
		return "Command";
	}
	return f.dot;
});

// access.dm:306
rt.def("/proc/get_access_desc", function get_access_desc(f: Frame, A: Value) {
	if (A === 31) {
		return "Cargo Bay";
	} else if (A === 34) {
		return "Delivery Chutes";
	} else if (A === 1) {
		return "Security";
	} else if (A === 2) {
		return "Holding Cells";
	} else if (A === 42) {
		return "Courtroom";
	} else if (A === 4) {
		return "Forensics";
	} else if (A === 5) {
		return "Medical";
	} else if (A === 9) {
		return "Genetics Lab";
	} else if (A === 6) {
		return "Morgue";
	} else if (A === 7) {
		return "R&D Lab";
	} else if (A === 8) {
		return "Toxins Lab";
	} else if (A === 33) {
		return "Chemistry Lab";
	} else if (A === 30) {
		return "RD Office";
	} else if (A === 25) {
		return "Bar";
	} else if (A === 26) {
		return "Custodial Closet";
	} else if (A === 10) {
		return "Engineering";
	} else if (A === 11) {
		return "Power Equipment";
	} else if (A === 12) {
		return "Maintenance";
	} else if (A === 13) {
		return "External Airlocks";
	} else if (A === 14) {
		return "Emergency Storage";
	} else if (A === 15) {
		return "ID Console";
	} else if (A === 16) {
		return "AI Chambers";
	} else if (A === 17) {
		return "Teleporter";
	} else if (A === 18) {
		return "EVA";
	} else if (A === 19) {
		return "Bridge";
	} else if (A === 20) {
		return "Captain";
	} else if (A === 21) {
		return "Personal Lockers";
	} else if (A === 22) {
		return "Chapel Office";
	} else if (A === 23) {
		return "Technical Storage";
	} else if (A === 24) {
		return "Atmospherics";
	} else if (A === 27) {
		return "Crematorium";
	} else if (A === 3) {
		return "Armory";
	} else if (A === 32) {
		return "Construction";
	} else if (A === 28) {
		return "Kitchen";
	} else if (A === 35) {
		return "Hydroponics";
	} else if (A === 37) {
		return "Library";
	} else if (A === 38) {
		return "Law Office";
	} else if (A === 29) {
		return "Robotics";
	} else if (A === 39) {
		return "Virology";
	} else if (A === 40) {
		return "CMO Office";
	} else if (A === 41) {
		return "Quartermaster";
	} else if (A === 45) {
		return "Surgery";
	} else if (A === 46) {
		return "Theatre";
	} else if (A === 36) {
		return "Manufacturing";
	} else if (A === 47) {
		return "Science";
	} else if (A === 48) {
		return "Mining";
	} else if (A === 49) {
		return "Mining Office";
	} else if (A === 50) {
		return "Cargo Office";
	} else if (A === 51) {
		return "Mint";
	} else if (A === 52) {
		return "Mint Vault";
	} else if (A === 53) {
		return "Main Vault";
	} else if (A === 54) {
		return "Mining EVA";
	} else if (A === 55) {
		return "Xenobiology Lab";
	} else if (A === 57) {
		return "HoP Office";
	} else if (A === 58) {
		return "HoS Office";
	} else if (A === 56) {
		return "CE Office";
	} else if (A === 59) {
		return "RC Announcements";
	} else if (A === 60) {
		return "Keycode Auth.";
	} else if (A === 61) {
		return "Telecommunications";
	} else if (A === 62) {
		return "Gateway";
	} else if (A === 63) {
		return "Brig";
	} else if (A === 64) {
		return "Mineral Storage";
	} else if (A === 65) {
		return "AI Satellite";
	} else if (A === 66) {
		return "Weapon Permit";
	} else if (A === 67) {
		return "Network Access";
	} else if (A === 68) {
		return "Cloning Room";
	}
	return f.dot;
});

// access.dm:441
rt.def("/proc/get_centcom_access_desc", function get_centcom_access_desc(f: Frame, A: Value) {
	if (A === 101) {
		return "Code Grey";
	} else if (A === 102) {
		return "Code Yellow";
	} else if (A === 106) {
		return "Code Orange";
	} else if (A === 105) {
		return "Code Green";
	} else if (A === 104) {
		return "Code White";
	} else if (A === 107) {
		return "Code Blue";
	} else if (A === 103) {
		return "Code Black";
	} else if (A === 109) {
		return "Code Gold";
	} else if (A === 110) {
		return "Code Scotch";
	}
	return f.dot;
});

// access.dm:462
rt.def("/proc/get_all_jobs", function get_all_jobs(f: Frame) {
	return list("Assistant", "Captain", "Head of Personnel", "Bartender", "Cook", "Botanist", "Quartermaster", "Cargo Technician", "Shaft Miner", "Clown", "Mime", "Janitor", "Curator", "Lawyer", "Chaplain", "Chief Engineer", "Station Engineer", "Atmospheric Technician", "Chief Medical Officer", "Medical Doctor", "Chemist", "Geneticist", "Virologist", "Research Director", "Scientist", "Roboticist", "Head of Security", "Warden", "Detective", "Security Officer");
});

// access.dm:468
rt.def("/proc/get_all_job_icons", function get_all_job_icons(f: Frame) {
	return get_all_jobs() + list("Prisoner");
});

// access.dm:471
rt.def("/proc/get_all_centcom_jobs", function get_all_centcom_jobs(f: Frame) {
	return list("VIP Guest", "Custodian", "Thunderdome Overseer", "Centcom Official", "Medical Officer", "Death Commando", "Research Officer", "Special Ops Officer", "Admiral", "Centcom Commander", "Emergency Response Team Commander", "Security Response Officer", "Engineer Response Officer", "Medical Response Officer", "Centcom Bartender");
});

// access.dm:474
rt.def("/obj/item/proc/GetJobName", function GetJobName(f: Frame) {
	let I: Value = null, jobName: Value = null;
	if (!(I = this.GetID())) {
		return f.dot;
	}
	if (rt.isIn(f, (jobName = I.assignment), get_all_job_icons())) {
		return jobName;
	}
	if (rt.isIn(f, jobName, get_all_centcom_jobs())) {
		return "Centcom";
	}
	return "Unknown";
});
