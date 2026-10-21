// From code/modules/jobs/access.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/proc/allowed  (code/modules/jobs/access.dm:108)
rt.def("/obj/proc/allowed", function allowed(f: Frame, M: Value) {
	let H: Value = null, george: Value = null, A: Value = null;
	f.vars = () => [H, george, A];
	if (truthy(rt.callName(f, live(f.src), "check_access", [null]))) {
		return 1;
	}
	if (truthy((rt.istype(live(M), T("/mob/living/silicon")) ? 1 : 0))) {
		if (truthy((rt.istype(live(M), T("/mob/living/silicon/pai")) ? 1 : 0))) {
			return 0;
		}
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/IsAdminGhost"), null, [live(M)]))) {
		return 1;
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((truthy(rt.callSrc(f, "check_access", [rt.callName(f, (H = live(M)), "get_active_held_item", [])])) || truthy(rt.callName(f, live(f.src), "check_access", [rt.fv(f, "wear_id", live(H))])))) {
				return 1;
			}
		} else {
			if ((truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) {
				if (truthy(rt.callSrc(f, "check_access", [rt.callName(f, (george = live(M)), "get_active_held_item", [])]))) {
					return 1;
				}
			} else {
				if (truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) {
					if ((truthy(rt.callSrc(f, "check_access", [rt.callName(f, (A = live(M)), "get_active_held_item", [])])) || truthy(rt.callSrc(f, "check_access", [rt.fv(f, "access_card", live(A))])))) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
});

// /obj/item/proc/GetAccess  (code/modules/jobs/access.dm:134)
rt.def("/obj/item/proc/GetAccess", function GetAccess(f: Frame) {
	return rt.list();
});

// /obj/item/proc/GetID  (code/modules/jobs/access.dm:137)
rt.def("/obj/item/proc/GetID", function GetID(f: Frame) {
	return null;
});

// /obj/proc/text2access  (code/modules/jobs/access.dm:140)
rt.def("/obj/proc/text2access", function text2access(f: Frame, access_text: Value) {
	let split: Value = null, x: Value = null, n: Value = null;
	let $e: any;
	f.vars = () => [split, x, n, $e];
	f.dot = rt.list();
	if (!truthy(live(access_text))) {
		return live(f.dot);
	}
	split = rt.call(f, P("/proc/splittext"), null, [live(access_text), ";"]);
	x = null;
	rt.forList(f, 0, live(split));
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		if (truthy((n = rt.call(f, P("/proc/text2num"), null, [live(x)])))) {
			f.dot = rt.modify(live(f.dot), live(n), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/proc/gen_access  (code/modules/jobs/access.dm:152)
rt.def("/obj/proc/gen_access", function gen_access(f: Frame) {
	let a: Value = null, b: Value = null;
	let $e: any;
	f.vars = () => [a, b, $e];
	if (!truthy(rt.sv(f, "req_access"))) {
		rt.setSv(f, "req_access", rt.list());
		a = null;
		rt.forList(f, 0, rt.callSrc(f, "text2access", [rt.sv(f, "req_access_txt")]));
		while (($e = rt.next(f, 0)) !== undefined) {
			a = $e;
			rt.modSrcVar(f, "req_access", live(a), add);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "req_one_access"))) return f.dot;
	rt.setSv(f, "req_one_access", rt.list());
	b = null;
	rt.forList(f, 0, rt.callSrc(f, "text2access", [rt.sv(f, "req_one_access_txt")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		b = $e;
		rt.modSrcVar(f, "req_one_access", live(b), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/proc/check_access  (code/modules/jobs/access.dm:162)
rt.def("/obj/proc/check_access", function check_access(f: Frame, I: Value) {
	let L: Value = null, req: Value = null;
	let $e: any;
	f.vars = () => [L, req, $e];
	rt.callSrc(f, "gen_access", []);
	if (!truthy((rt.istype(rt.fv(f, "req_access", live(f.src)), T("/list")) ? 1 : 0))) {
		return 1;
	}
	if ((!truthy(rt.getLen(f, (L = rt.fv(f, "req_access", live(f.src))))) && (!truthy(rt.fv(f, "req_one_access", live(f.src))) || !truthy(rt.getLen(f, rt.fv(f, "req_one_access", live(f.src))))))) {
		return 1;
	}
	if (!truthy(live(I))) {
		return 0;
	}
	req = null;
	rt.forList(f, 0, rt.fv(f, "req_access", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if (!truthy((rt.isIn(f, live(req), rt.callName(f, live(I), "GetAccess", [])) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.fv(f, "req_one_access", live(f.src))) && truthy(rt.getLen(f, rt.fv(f, "req_one_access", live(f.src)))))) {
		req = null;
		rt.forList(f, 0, rt.fv(f, "req_one_access", live(f.src)));
		while (($e = rt.next(f, 0)) !== undefined) {
			req = $e;
			if (truthy((rt.isIn(f, live(req), rt.callName(f, live(I), "GetAccess", [])) ? 1 : 0))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	return 1;
});

// /obj/proc/check_access_list  (code/modules/jobs/access.dm:184)
rt.def("/obj/proc/check_access_list", function check_access_list(f: Frame, L: Value) {
	let req: Value = null;
	let $e: any;
	f.vars = () => [req, $e];
	if ((!truthy(rt.fv(f, "req_access", live(f.src))) && !truthy(rt.fv(f, "req_one_access", live(f.src))))) {
		return 1;
	}
	if (!truthy((rt.istype(rt.fv(f, "req_access", live(f.src)), T("/list")) ? 1 : 0))) {
		return 1;
	}
	if ((!truthy(rt.getLen(f, rt.fv(f, "req_access", live(f.src)))) && (!truthy(rt.fv(f, "req_one_access", live(f.src))) || !truthy(rt.getLen(f, rt.fv(f, "req_one_access", live(f.src))))))) {
		return 1;
	}
	if (!truthy(live(L))) {
		return 0;
	}
	if (!truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) {
		return 0;
	}
	req = null;
	rt.forList(f, 0, rt.fv(f, "req_access", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		req = $e;
		if (!truthy((rt.isIn(f, live(req), live(L)) ? 1 : 0))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.fv(f, "req_one_access", live(f.src))) && truthy(rt.getLen(f, rt.fv(f, "req_one_access", live(f.src)))))) {
		req = null;
		rt.forList(f, 0, rt.fv(f, "req_one_access", live(f.src)));
		while (($e = rt.next(f, 0)) !== undefined) {
			req = $e;
			if (truthy((rt.isIn(f, live(req), live(L)) ? 1 : 0))) {
				return 1;
			}
		}
		rt.endFor(f, 0);
		return 0;
	}
	return 1;
});

// /proc/get_centcom_access  (code/modules/jobs/access.dm:205)
rt.def("/proc/get_centcom_access", function get_centcom_access(f: Frame, job: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(job);
	if ($0 === "VIP Guest") {
		return rt.list(101);
	} else if ($0 === "Custodian") {
		return rt.list(101, 105, 106);
	} else if ($0 === "Thunderdome Overseer") {
		return rt.list(101, 102);
	} else if ($0 === "Centcom Official") {
		return rt.list(101, 105);
	} else if ($0 === "Medical Officer") {
		return rt.list(101, 105, 104);
	} else if ($0 === "Death Commando") {
		return rt.list(101, 103, 105, 106);
	} else if ($0 === "Research Officer") {
		return rt.list(101, 103, 104, 107, 106);
	} else if ($0 === "Special Ops Officer") {
		return rt.list(101, 102, 103, 105, 106);
	} else if ($0 === "Admiral") {
		return rt.call(f, P("/proc/get_all_centcom_access"), null, []);
	} else if ($0 === "Centcom Commander") {
		return rt.call(f, P("/proc/get_all_centcom_access"), null, []);
	} else if ($0 === "Emergency Response Team Commander") {
		return rt.call(f, P("/proc/get_ert_access"), null, ["commander"]);
	} else if ($0 === "Security Response Officer") {
		return rt.call(f, P("/proc/get_ert_access"), null, ["sec"]);
	} else if ($0 === "Engineer Response Officer") {
		return rt.call(f, P("/proc/get_ert_access"), null, ["eng"]);
	} else if ($0 === "Medical Response Officer") {
		return rt.call(f, P("/proc/get_ert_access"), null, ["med"]);
	} else if ($0 === "Centcom Bartender") {
		return rt.list(101, 105, 110);
	}
	return f.dot;
});

// /proc/get_all_accesses  (code/modules/jobs/access.dm:238)
rt.def("/proc/get_all_accesses", function get_all_accesses(f: Frame) {
	return rt.list(1, 63, 2, 3, 4, 42, 5, 9, 6, 30, 7, 8, 33, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 23, 22, 24, 28, 25, 26, 27, 29, 31, 32, 35, 37, 38, 39, 40, 41, 45, 46, 47, 48, 50, 66, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 67, 68);
});

// /proc/get_all_centcom_access  (code/modules/jobs/access.dm:251)
rt.def("/proc/get_all_centcom_access", function get_all_centcom_access(f: Frame) {
	return rt.list(101, 102, 103, 104, 105, 106, 107, 109);
});

// /proc/get_ert_access  (code/modules/jobs/access.dm:254)
rt.def("/proc/get_ert_access", function get_ert_access(f: Frame, _class: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(_class);
	if ($0 === "commander") {
		return rt.call(f, P("/proc/get_all_centcom_access"), null, []);
	} else if ($0 === "sec") {
		return rt.list(101, 103, 105);
	} else if ($0 === "eng") {
		return rt.list(101, 103, 105, 106);
	} else if ($0 === "med") {
		return rt.list(101, 103, 104, 105);
	}
	return f.dot;
});

// /proc/get_all_syndicate_access  (code/modules/jobs/access.dm:265)
rt.def("/proc/get_all_syndicate_access", function get_all_syndicate_access(f: Frame) {
	return rt.list(150, 150);
});

// /proc/get_region_accesses  (code/modules/jobs/access.dm:268)
rt.def("/proc/get_region_accesses", function get_region_accesses(f: Frame, code: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(code);
	if ($0 === 0) {
		return rt.call(f, P("/proc/get_all_accesses"), null, []);
	} else if ($0 === 1) {
		return rt.list(28, 25, 35, 26, 22, 27, 37, 46, 38);
	} else if ($0 === 2) {
		return rt.list(63, 66, 1, 2, 3, 4, 42, 58);
	} else if ($0 === 3) {
		return rt.list(5, 9, 68, 6, 33, 39, 45, 40);
	} else if ($0 === 4) {
		return rt.list(47, 7, 8, 9, 29, 55, 65, 30, 67);
	} else if ($0 === 5) {
		return rt.list(32, 12, 10, 11, 13, 23, 24, 61, 65, 56);
	} else if ($0 === 6) {
		return rt.list(50, 48, 54, 64, 31, 41);
	} else if ($0 === 7) {
		return rt.list(19, 59, 60, 15, 16, 17, 18, 62, 21, 53, 57, 20);
	}
	return f.dot;
});

// /proc/get_region_accesses_name  (code/modules/jobs/access.dm:287)
rt.def("/proc/get_region_accesses_name", function get_region_accesses_name(f: Frame, code: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(code);
	if ($0 === 0) {
		return "All";
	} else if ($0 === 1) {
		return "General";
	} else if ($0 === 2) {
		return "Security";
	} else if ($0 === 3) {
		return "Medbay";
	} else if ($0 === 4) {
		return "Research";
	} else if ($0 === 5) {
		return "Engineering";
	} else if ($0 === 6) {
		return "Supply";
	} else if ($0 === 7) {
		return "Command";
	}
	return f.dot;
});

// /proc/get_access_desc  (code/modules/jobs/access.dm:306)
rt.def("/proc/get_access_desc", function get_access_desc(f: Frame, A: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(A);
	if ($0 === 31) {
		return "Cargo Bay";
	} else if ($0 === 34) {
		return "Delivery Chutes";
	} else if ($0 === 1) {
		return "Security";
	} else if ($0 === 2) {
		return "Holding Cells";
	} else if ($0 === 42) {
		return "Courtroom";
	} else if ($0 === 4) {
		return "Forensics";
	} else if ($0 === 5) {
		return "Medical";
	} else if ($0 === 9) {
		return "Genetics Lab";
	} else if ($0 === 6) {
		return "Morgue";
	} else if ($0 === 7) {
		return "R&D Lab";
	} else if ($0 === 8) {
		return "Toxins Lab";
	} else if ($0 === 33) {
		return "Chemistry Lab";
	} else if ($0 === 30) {
		return "RD Office";
	} else if ($0 === 25) {
		return "Bar";
	} else if ($0 === 26) {
		return "Custodial Closet";
	} else if ($0 === 10) {
		return "Engineering";
	} else if ($0 === 11) {
		return "Power Equipment";
	} else if ($0 === 12) {
		return "Maintenance";
	} else if ($0 === 13) {
		return "External Airlocks";
	} else if ($0 === 14) {
		return "Emergency Storage";
	} else if ($0 === 15) {
		return "ID Console";
	} else if ($0 === 16) {
		return "AI Chambers";
	} else if ($0 === 17) {
		return "Teleporter";
	} else if ($0 === 18) {
		return "EVA";
	} else if ($0 === 19) {
		return "Bridge";
	} else if ($0 === 20) {
		return "Captain";
	} else if ($0 === 21) {
		return "Personal Lockers";
	} else if ($0 === 22) {
		return "Chapel Office";
	} else if ($0 === 23) {
		return "Technical Storage";
	} else if ($0 === 24) {
		return "Atmospherics";
	} else if ($0 === 27) {
		return "Crematorium";
	} else if ($0 === 3) {
		return "Armory";
	} else if ($0 === 32) {
		return "Construction";
	} else if ($0 === 28) {
		return "Kitchen";
	} else if ($0 === 35) {
		return "Hydroponics";
	} else if ($0 === 37) {
		return "Library";
	} else if ($0 === 38) {
		return "Law Office";
	} else if ($0 === 29) {
		return "Robotics";
	} else if ($0 === 39) {
		return "Virology";
	} else if ($0 === 40) {
		return "CMO Office";
	} else if ($0 === 41) {
		return "Quartermaster";
	} else if ($0 === 45) {
		return "Surgery";
	} else if ($0 === 46) {
		return "Theatre";
	} else if ($0 === 36) {
		return "Manufacturing";
	} else if ($0 === 47) {
		return "Science";
	} else if ($0 === 48) {
		return "Mining";
	} else if ($0 === 49) {
		return "Mining Office";
	} else if ($0 === 50) {
		return "Cargo Office";
	} else if ($0 === 51) {
		return "Mint";
	} else if ($0 === 52) {
		return "Mint Vault";
	} else if ($0 === 53) {
		return "Main Vault";
	} else if ($0 === 54) {
		return "Mining EVA";
	} else if ($0 === 55) {
		return "Xenobiology Lab";
	} else if ($0 === 57) {
		return "HoP Office";
	} else if ($0 === 58) {
		return "HoS Office";
	} else if ($0 === 56) {
		return "CE Office";
	} else if ($0 === 59) {
		return "RC Announcements";
	} else if ($0 === 60) {
		return "Keycode Auth.";
	} else if ($0 === 61) {
		return "Telecommunications";
	} else if ($0 === 62) {
		return "Gateway";
	} else if ($0 === 63) {
		return "Brig";
	} else if ($0 === 64) {
		return "Mineral Storage";
	} else if ($0 === 65) {
		return "AI Satellite";
	} else if ($0 === 66) {
		return "Weapon Permit";
	} else if ($0 === 67) {
		return "Network Access";
	} else if ($0 === 68) {
		return "Cloning Room";
	}
	return f.dot;
});

// /proc/get_centcom_access_desc  (code/modules/jobs/access.dm:441)
rt.def("/proc/get_centcom_access_desc", function get_centcom_access_desc(f: Frame, A: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(A);
	if ($0 === 101) {
		return "Code Grey";
	} else if ($0 === 102) {
		return "Code Yellow";
	} else if ($0 === 106) {
		return "Code Orange";
	} else if ($0 === 105) {
		return "Code Green";
	} else if ($0 === 104) {
		return "Code White";
	} else if ($0 === 107) {
		return "Code Blue";
	} else if ($0 === 103) {
		return "Code Black";
	} else if ($0 === 109) {
		return "Code Gold";
	} else if ($0 === 110) {
		return "Code Scotch";
	}
	return f.dot;
});

// /proc/get_all_jobs  (code/modules/jobs/access.dm:462)
rt.def("/proc/get_all_jobs", function get_all_jobs(f: Frame) {
	return rt.list("Assistant", "Captain", "Head of Personnel", "Bartender", "Cook", "Botanist", "Quartermaster", "Cargo Technician", "Shaft Miner", "Clown", "Mime", "Janitor", "Curator", "Lawyer", "Chaplain", "Chief Engineer", "Station Engineer", "Atmospheric Technician", "Chief Medical Officer", "Medical Doctor", "Chemist", "Geneticist", "Virologist", "Research Director", "Scientist", "Roboticist", "Head of Security", "Warden", "Detective", "Security Officer");
});

// /proc/get_all_job_icons  (code/modules/jobs/access.dm:468)
rt.def("/proc/get_all_job_icons", function get_all_job_icons(f: Frame) {
	return add(rt.call(f, P("/proc/get_all_jobs"), null, []), rt.list("Prisoner"));
});

// /proc/get_all_centcom_jobs  (code/modules/jobs/access.dm:471)
rt.def("/proc/get_all_centcom_jobs", function get_all_centcom_jobs(f: Frame) {
	return rt.list("VIP Guest", "Custodian", "Thunderdome Overseer", "Centcom Official", "Medical Officer", "Death Commando", "Research Officer", "Special Ops Officer", "Admiral", "Centcom Commander", "Emergency Response Team Commander", "Security Response Officer", "Engineer Response Officer", "Medical Response Officer", "Centcom Bartender");
});

// /obj/item/proc/GetJobName  (code/modules/jobs/access.dm:474)
rt.def("/obj/item/proc/GetJobName", function GetJobName(f: Frame) {
	let I: Value = null, jobName: Value = null;
	f.vars = () => [I, jobName];
	if (!truthy((I = rt.callSrc(f, "GetID", [])))) {
		return live(f.dot);
	}
	if (truthy((rt.isIn(f, (jobName = rt.fv(f, "assignment", live(I))), rt.call(f, P("/proc/get_all_job_icons"), null, [])) ? 1 : 0))) {
		return live(jobName);
	}
	if (truthy((rt.isIn(f, live(jobName), rt.call(f, P("/proc/get_all_centcom_jobs"), null, [])) ? 1 : 0))) {
		return "Centcom";
	}
	return "Unknown";
});
