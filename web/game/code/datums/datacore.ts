// From code/datums/datacore.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(391, "/datum/datacore", "/datum", {
	medical: null,
	medicalPrintCount: 0,
	general: null,
	security: null,
	securityPrintCount: 0,
	securityCrimeCounter: 0,
	locked: null,
});

// /datum/datacore/proc/<init>  (code/datums/datacore.dm:3)
rt.def("/datum/datacore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "medical", rt.list());
	$0 = $0;
	rt.setSv(f, "general", rt.list());
	$0 = $0;
	rt.setSv(f, "security", rt.list());
	$0 = $0;
	rt.setSv(f, "locked", rt.list());
	return f.dot;
});

rt.type(393, "/datum/data/record", "/datum/data", {
	fields: null,
	name: "record",
});

// /datum/data/record/proc/<init>  (code/datums/datacore.dm:17)
rt.def("/datum/data/record/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "fields", rt.list());
	return f.dot;
});

// /datum/data/record/proc/Destroy  (code/datums/datacore.dm:20)  may sleep
rt.def("/datum/data/record/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "medical", rt.gl("data_core"))) ? 1 : 0))) {
		(rt.modField(f, rt.gl("data_core"), "medical", live(f.src), subtract));
	}
	if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "security", rt.gl("data_core"))) ? 1 : 0))) {
		(rt.modField(f, rt.gl("data_core"), "security", live(f.src), subtract));
	}
	if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "general", rt.gl("data_core"))) ? 1 : 0))) {
		(rt.modField(f, rt.gl("data_core"), "general", live(f.src), subtract));
	}
	if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "locked", rt.gl("data_core"))) ? 1 : 0))) {
		(rt.modField(f, rt.gl("data_core"), "locked", live(f.src), subtract));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/datacore/proc/createCrimeEntry  (code/datums/datacore.dm:39)
rt.def("/datum/datacore/proc/createCrimeEntry", function createCrimeEntry(f: Frame, cname: Value, cdetails: Value, author: Value, time: Value) {
	let c: Value = null;
	f.vars = () => [cname, cdetails, author, time, c];
	if (live(cname) === null) {
		cname = "";
	}
	if (live(cdetails) === null) {
		cdetails = "";
	}
	if (live(author) === null) {
		author = "";
	}
	if (live(time) === null) {
		time = "";
	}
	rt.setFv(f, "crimeName", (c = rt.new_(f, T("/datum/data/crime"), [])), live(cname));
	rt.setFv(f, "crimeDetails", live(c), live(cdetails));
	rt.setFv(f, "author", live(c), live(author));
	rt.setFv(f, "time", live(c), live(time));
	rt.setFv(f, "dataId", live(c), rt.incSrcVar(f, "securityCrimeCounter", 1, false));
	return live(c);
});

// /datum/datacore/proc/addMinorCrime  (code/datums/datacore.dm:48)
rt.def("/datum/datacore/proc/addMinorCrime", function addMinorCrime(f: Frame, id: Value, crime: Value) {
	let R: Value = null, crimes: Value = null;
	let $e: any;
	f.vars = () => [id, R, crimes, $e];
	if (live(id) === null) {
		id = "";
	}
	R = null;
	rt.forList(f, 0, rt.sv(f, "security"), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(R)), "id"), live(id))) {
			crimes = rt.index(rt.fv(f, "fields", live(R)), "mi_crim");
			(crimes = rt.modify(live(crimes), live(crime), rt.bitOr));
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/datacore/proc/removeMinorCrime  (code/datums/datacore.dm:55)
rt.def("/datum/datacore/proc/removeMinorCrime", function removeMinorCrime(f: Frame, id: Value, cDataId: Value) {
	let R: Value = null, crimes: Value = null, crime: Value = null;
	let $e: any;
	f.vars = () => [R, crimes, crime, $e];
	R = null;
	rt.forList(f, 0, rt.sv(f, "security"), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(R)), "id"), live(id))) {
			crimes = rt.index(rt.fv(f, "fields", live(R)), "mi_crim");
			crime = null;
			rt.forList(f, 1, live(crimes), T("/datum/data/crime"));
			while (($e = rt.next(f, 1)) !== undefined) {
				crime = $e;
				if (isEqual(rt.fv(f, "dataId", live(crime)), rt.call(f, P("/proc/text2num"), null, [live(cDataId)]))) {
					(crimes = rt.modify(live(crimes), live(crime), subtract));
					return live(f.dot);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/datacore/proc/removeMajorCrime  (code/datums/datacore.dm:64)
rt.def("/datum/datacore/proc/removeMajorCrime", function removeMajorCrime(f: Frame, id: Value, cDataId: Value) {
	let R: Value = null, crimes: Value = null, crime: Value = null;
	let $e: any;
	f.vars = () => [R, crimes, crime, $e];
	R = null;
	rt.forList(f, 0, rt.sv(f, "security"), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(R)), "id"), live(id))) {
			crimes = rt.index(rt.fv(f, "fields", live(R)), "ma_crim");
			crime = null;
			rt.forList(f, 1, live(crimes), T("/datum/data/crime"));
			while (($e = rt.next(f, 1)) !== undefined) {
				crime = $e;
				if (isEqual(rt.fv(f, "dataId", live(crime)), rt.call(f, P("/proc/text2num"), null, [live(cDataId)]))) {
					(crimes = rt.modify(live(crimes), live(crime), subtract));
					return live(f.dot);
				}
			}
			rt.endFor(f, 1);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/datacore/proc/addMajorCrime  (code/datums/datacore.dm:73)
rt.def("/datum/datacore/proc/addMajorCrime", function addMajorCrime(f: Frame, id: Value, crime: Value) {
	let R: Value = null, crimes: Value = null;
	let $e: any;
	f.vars = () => [id, R, crimes, $e];
	if (live(id) === null) {
		id = "";
	}
	R = null;
	rt.forList(f, 0, rt.sv(f, "security"), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if (isEqual(rt.index(rt.fv(f, "fields", live(R)), "id"), live(id))) {
			crimes = rt.index(rt.fv(f, "fields", live(R)), "ma_crim");
			(crimes = rt.modify(live(crimes), live(crime), rt.bitOr));
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/datacore/proc/manifest  (code/datums/datacore.dm:80)  may sleep
rt.def("/datum/datacore/proc/manifest", function* manifest(f: Frame) {
	let N: Value = null;
	let $e: any;
	f.vars = () => [N, $e];
	N = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/new_player"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if (truthy((rt.istype(rt.fv(f, "new_character", live(N)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.srcCall(f, "manifest_inject", rt.fv(f, "new_character", live(N)), rt.fv(f, "client", live(N)));
		}
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/datacore/proc/manifest_modify  (code/datums/datacore.dm:86)
rt.def("/datum/datacore/proc/manifest_modify", function manifest_modify(f: Frame, name: Value, assignment: Value) {
	let foundrecord: Value = null;
	f.vars = () => [foundrecord];
	if (!truthy((foundrecord = rt.call(f, P("/proc/find_record"), null, ["name", live(name), rt.fv(f, "general", rt.gl("data_core"))])))) return f.dot;
	rt.setAt(rt.fv(f, "fields", live(foundrecord)), "rank", live(assignment));
	return f.dot;
});

// /datum/datacore/proc/get_manifest  (code/datums/datacore.dm:91)
rt.def("/datum/datacore/proc/get_manifest", function get_manifest(f: Frame, monochrome: Value, OOC: Value) {
	let heads: Value = null, sec: Value = null, eng: Value = null, med: Value = null, sci: Value = null, sup: Value = null, civ: Value = null, bot: Value = null, misc: Value = null, dat: Value = null, even: Value = null, t: Value = null, name: Value = null, rank: Value = null, department: Value = null, name_11: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [heads, sec, eng, med, sci, sup, civ, bot, misc, dat, even, t, name, rank, department, name_11, $0, $1, $2, $3, $e];
	heads = rt.list();
	sec = rt.list();
	eng = rt.list();
	med = rt.list();
	sci = rt.list();
	sup = rt.list();
	civ = rt.list();
	bot = rt.list();
	misc = rt.list();
	if (truthy(live(monochrome))) {
		$0 = "black";
	} else {
		$0 = "#DEF; background-color:white; color:black";
	}
	if (truthy(live(monochrome))) {
		$1 = "border-top-width: 3px";
	} else {
		$1 = "background-color: #48C; color:white";
	}
	if (truthy(live(monochrome))) {
		$2 = "border-top-width: 1px";
	} else {
		$2 = "background-color: #488;";
	}
	if (truthy(live(monochrome))) {
		$3 = "border-top-width: 2px";
	} else {
		$3 = "background-color: #DEF";
	}
	dat = fmt("\n\t<head><style>\n\t\t.manifest {border-collapse:collapse;}\n\t\t.manifest td, th {border:1px solid ＀; padding:.25em}\n\t\t.manifest th {height: 2em; ＀}\n\t\t.manifest tr.head th { ＀ }\n\t\t.manifest td:first-child {text-align:right}\n\t\t.manifest tr.alt td {＀}\n\t</style></head>\n\t<table class=\"manifest\" width='350px'>\n\t<tr class='head'><th>Name</th><th>Rank</th></tr>\n\t", [$0, $1, $2, $3]);
	even = 0;
	t = null;
	rt.forList(f, 0, rt.fv(f, "general", rt.gl("data_core")), T("/datum/data/record"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		name = rt.index(rt.fv(f, "fields", live(t)), "name");
		rank = rt.index(rt.fv(f, "fields", live(t)), "rank");
		department = 0;
		if (truthy((rt.isIn(f, live(rank), rt.gl("command_positions")) ? 1 : 0))) {
			rt.setAt(live(heads), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("security_positions")) ? 1 : 0))) {
			rt.setAt(live(sec), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("engineering_positions")) ? 1 : 0))) {
			rt.setAt(live(eng), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("medical_positions")) ? 1 : 0))) {
			rt.setAt(live(med), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("science_positions")) ? 1 : 0))) {
			rt.setAt(live(sci), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("supply_positions")) ? 1 : 0))) {
			rt.setAt(live(sup), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("civilian_positions")) ? 1 : 0))) {
			rt.setAt(live(civ), live(name), live(rank));
			department = 1;
		}
		if (truthy((rt.isIn(f, live(rank), rt.gl("nonhuman_positions")) ? 1 : 0))) {
			rt.setAt(live(bot), live(name), live(rank));
			department = 1;
		}
		if ((!truthy(live(department)) && !truthy((rt.isIn(f, live(name), live(heads)) ? 1 : 0)))) {
			rt.setAt(live(misc), live(name), live(rank));
		}
	}
	rt.endFor(f, 0);
	if (rt.gt(rt.len(f, live(heads)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Heads</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(heads));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(heads), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(sec)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Security</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(sec));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(sec), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(eng)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Engineering</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(eng));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(eng), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(med)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Medical</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(med));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(med), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(sci)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Science</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(sci));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(sci), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(sup)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Supply</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(sup));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(sup), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(civ)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Civilian</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(civ));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(civ), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(bot)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Silicon</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(bot));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(bot), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	if (rt.gt(rt.len(f, live(misc)), 0)) {
		dat = rt.modify(live(dat), "<tr><th colspan=3>Miscellaneous</th></tr>", add);
		name_11 = null;
		rt.forList(f, 0, live(misc));
		while (($e = rt.next(f, 0)) !== undefined) {
			name_11 = $e;
			if (truthy(live(even))) {
				$0 = " class='alt'";
			} else {
				$0 = "";
			}
			dat = rt.modify(live(dat), fmt("<tr＀><td>＀</td><td>＀</td></tr>", [$0, live(name_11), rt.index(live(misc), live(name_11))]), add);
			even = (!truthy(live(even)) ? 1 : 0);
		}
		rt.endFor(f, 0);
	}
	return (dat = rt.call(f, P("/proc/replacetext"), null, [(dat = rt.call(f, P("/proc/replacetext"), null, [(dat = rt.modify(live(dat), "</table>", add)), "\n", ""])), "\t", ""]));
});

// /datum/datacore/proc/manifest_inject  (code/datums/datacore.dm:199)  may sleep
rt.def("/datum/datacore/proc/manifest_inject", function* manifest_inject(f: Frame, H: Value, C: Value) {
	let assignment: Value = null, id: Value = null, image: Value = null, photo_front: Value = null, photo_side: Value = null, G: Value = null, M: Value = null, S: Value = null, L: Value = null;
	f.vars = () => [H, C, assignment, id, image, photo_front, photo_side, G, M, S, L];
	if ((truthy(rt.fv(f, "mind", live(H))) && !isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H))), rt.gv(f, "special_role", rt.fv(f, "mind", live(H)))))) {
		assignment = null;
		if (truthy(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H))))) {
			assignment = rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H)));
		} else {
			if (truthy(rt.fv(f, "job", live(H)))) {
				assignment = rt.fv(f, "job", live(H));
			} else {
				assignment = "Unassigned";
			}
		}
		id = (yield* g.call(f, P("/proc/num2hex"), null, [rt.incGl("record_id_num", 1, true), 6]));
		if (!truthy(live(C))) {
			C = rt.fv(f, "client", live(H));
		}
		image = (yield* g.srcCall(f, "get_id_photo", live(H), live(C)));
		photo_front = (yield* g.new_(f, T("/obj/item/weapon/photo"), []));
		photo_side = (yield* g.new_(f, T("/obj/item/weapon/photo"), []));
		yield* g.callName(f, live(photo_front), "photocreate", [null, (yield* g.call(f, P("/proc/icon"), null, [null, live(image), "dir", 2], rt.Args.Named))]);
		yield* g.callName(f, live(photo_side), "photocreate", [null, (yield* g.call(f, P("/proc/icon"), null, [null, live(image), "dir", 8], rt.Args.Named))]);
		rt.setAt(rt.gv(f, "fields", (G = (yield* g.new_(f, T("/datum/data/record"), [])))), "id", live(id));
		rt.setAt(rt.fv(f, "fields", live(G)), "name", rt.fv(f, "real_name", live(H)));
		rt.setAt(rt.fv(f, "fields", live(G)), "rank", live(assignment));
		rt.setAt(rt.fv(f, "fields", live(G)), "age", rt.fv(f, "age", live(H)));
		if (truthy(rt.fv(f, "mutant_races", rt.gl("config")))) {
			rt.setAt(rt.fv(f, "fields", live(G)), "species", rt.gv(f, "name", rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
		}
		rt.setAt(rt.fv(f, "fields", live(G)), "fingerprint", (yield* g.call(f, P("/proc/md5"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))])));
		rt.setAt(rt.fv(f, "fields", live(G)), "p_stat", "Active");
		rt.setAt(rt.fv(f, "fields", live(G)), "m_stat", "Stable");
		rt.setAt(rt.fv(f, "fields", live(G)), "sex", rt.fv(f, "gender", live(H)));
		rt.setAt(rt.fv(f, "fields", live(G)), "photo_front", live(photo_front));
		rt.setAt(rt.fv(f, "fields", live(G)), "photo_side", live(photo_side));
		rt.modSrcVar(f, "general", live(G), add);
		rt.setAt(rt.gv(f, "fields", (M = (yield* g.new_(f, T("/datum/data/record"), [])))), "id", live(id));
		rt.setAt(rt.fv(f, "fields", live(M)), "name", rt.fv(f, "real_name", live(H)));
		rt.setAt(rt.fv(f, "fields", live(M)), "blood_type", rt.gv(f, "blood_type", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(M)), "b_dna", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(M)), "mi_dis", "None");
		rt.setAt(rt.fv(f, "fields", live(M)), "mi_dis_d", "No minor disabilities have been declared.");
		rt.setAt(rt.fv(f, "fields", live(M)), "ma_dis", "None");
		rt.setAt(rt.fv(f, "fields", live(M)), "ma_dis_d", "No major disabilities have been diagnosed.");
		rt.setAt(rt.fv(f, "fields", live(M)), "alg", "None");
		rt.setAt(rt.fv(f, "fields", live(M)), "alg_d", "No allergies have been detected in this patient.");
		rt.setAt(rt.fv(f, "fields", live(M)), "cdi", "None");
		rt.setAt(rt.fv(f, "fields", live(M)), "cdi_d", "No diseases have been diagnosed at the moment.");
		rt.setAt(rt.fv(f, "fields", live(M)), "notes", "No notes.");
		rt.modSrcVar(f, "medical", live(M), add);
		rt.setAt(rt.gv(f, "fields", (S = (yield* g.new_(f, T("/datum/data/record"), [])))), "id", live(id));
		rt.setAt(rt.fv(f, "fields", live(S)), "name", rt.fv(f, "real_name", live(H)));
		rt.setAt(rt.fv(f, "fields", live(S)), "criminal", "None");
		rt.setAt(rt.fv(f, "fields", live(S)), "mi_crim", rt.list());
		rt.setAt(rt.fv(f, "fields", live(S)), "ma_crim", rt.list());
		rt.setAt(rt.fv(f, "fields", live(S)), "notes", "No notes.");
		rt.modSrcVar(f, "security", live(S), add);
		rt.setAt(rt.gv(f, "fields", (L = (yield* g.new_(f, T("/datum/data/record"), [])))), "id", (yield* g.call(f, P("/proc/md5"), null, [fmt("＀＀", [rt.fv(f, "real_name", live(H)), rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H)))])])));
		rt.setAt(rt.fv(f, "fields", live(L)), "name", rt.fv(f, "real_name", live(H)));
		rt.setAt(rt.fv(f, "fields", live(L)), "rank", rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "age", rt.fv(f, "age", live(H)));
		rt.setAt(rt.fv(f, "fields", live(L)), "sex", rt.fv(f, "gender", live(H)));
		rt.setAt(rt.fv(f, "fields", live(L)), "blood_type", rt.gv(f, "blood_type", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "b_dna", rt.gv(f, "unique_enzymes", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "enzymes", rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "identity", rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "species", rt.gv(f, "type", rt.gv(f, "species", rt.fv(f, "dna", live(H)))));
		rt.setAt(rt.fv(f, "fields", live(L)), "features", rt.gv(f, "features", rt.fv(f, "dna", live(H))));
		rt.setAt(rt.fv(f, "fields", live(L)), "image", live(image));
		rt.setAt(rt.fv(f, "fields", live(L)), "reference", live(H));
		rt.modSrcVar(f, "locked", live(L), add);
	}
	return live(f.dot);
}, true);

// /datum/datacore/proc/get_id_photo  (code/datums/datacore.dm:281)  may sleep
rt.def("/datum/datacore/proc/get_id_photo", function* get_id_photo(f: Frame, H: Value, C: Value) {
	let J: Value = null, _P: Value = null;
	f.vars = () => [H, C, J, _P];
	J = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [rt.gv(f, "assigned_role", rt.fv(f, "mind", live(H)))]));
	_P = null;
	if (!truthy(live(C))) {
		C = rt.fv(f, "client", live(H));
	}
	if (truthy(live(C))) {
		_P = rt.fv(f, "prefs", live(C));
	}
	return (yield* g.call(f, P("/proc/get_flat_human_icon"), null, [null, live(J), live(_P)]));
}, true);
