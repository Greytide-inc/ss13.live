// From code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/job/proc/after_spawn  empty
rt.def("/datum/job/proc/after_spawn", undefined, false, { args: ["H", "M"] });

// /datum/job/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:7)
rt.def("/datum/job/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "supervisors", "the captain and the head of personnel");
	return f.dot;
});

// /datum/outfit/job/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:12)
rt.def("/datum/outfit/job/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "box", T("/obj/item/weapon/storage/box/survival/radio"));
	return f.dot;
});

// /datum/job/captain/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:21)
rt.def("/datum/job/captain/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "supervisors", "Nanotrasen and Central Command");
	return f.dot;
});

// /datum/job/hop/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:26)
rt.def("/datum/job/hop/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "supervisors", "the captain and Central Command");
	return f.dot;
});

// /datum/job/hop/proc/get_access  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:31)
rt.def("/datum/job/hop/proc/get_access", function get_access(f: Frame) {
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return rt.call(f, P("/proc/get_all_accesses"), null, []);
});

// /datum/job/officer/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:37)
rt.def("/datum/job/officer/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 3);
	rt.setSv(f, "spawn_positions", 3);
	rt.setSv(f, "access", rt.list(1, 63, 2, 3, 42, 12, 6, 66, 4));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 2, 3, 42, 12, 6, 66, 4));
	return f.dot;
});

rt.type(721, "/datum/outfit/job/officer", "/datum/outfit/job", {});

// /datum/outfit/job/officer/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:45)
rt.def("/datum/outfit/job/officer/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "box", T("/obj/item/weapon/storage/box/security/radio"));
	return f.dot;
});

// /datum/job/detective/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:50)
rt.def("/datum/job/detective/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "access", rt.list(1, 63, 2, 3, 42, 12, 6, 66, 4));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 2, 3, 42, 12, 6, 66, 4));
	return f.dot;
});

// /datum/outfit/job/detective/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:56)
rt.def("/datum/outfit/job/detective/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "box", T("/obj/item/weapon/storage/box/security/radio"));
	return f.dot;
});

// /datum/job/doctor/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:63)
rt.def("/datum/job/doctor/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "selection_color", "#ffffff");
	rt.setSv(f, "total_positions", 3);
	rt.setSv(f, "spawn_positions", 3);
	rt.setSv(f, "access", rt.list(5, 6, 45, 33, 39, 9));
	rt.setSv(f, "minimal_access", rt.list(5, 6, 45, 33, 39, 9));
	return f.dot;
});

// /datum/job/engineer/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:74)
rt.def("/datum/job/engineer/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 2);
	rt.setSv(f, "spawn_positions", 2);
	rt.setSv(f, "access", rt.list(18, 10, 11, 23, 12, 13, 32, 24, 61));
	rt.setSv(f, "minimal_access", rt.list(18, 10, 11, 23, 12, 13, 32, 24, 61));
	return f.dot;
});

// /datum/outfit/job/engineer/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:82)
rt.def("/datum/outfit/job/engineer/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "box", T("/obj/item/weapon/storage/box/engineer/radio"));
	return f.dot;
});

// /datum/job/atmos/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:87)
rt.def("/datum/job/atmos/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 2);
	rt.setSv(f, "spawn_positions", 2);
	return f.dot;
});

// /datum/job/scientist/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:95)
rt.def("/datum/job/scientist/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 3);
	rt.setSv(f, "spawn_positions", 3);
	rt.setSv(f, "access", rt.list(29, 7, 8, 47, 55, 64, 23));
	rt.setSv(f, "minimal_access", rt.list(29, 7, 8, 47, 55, 64, 23));
	return f.dot;
});

// /datum/job/cargo_tech/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:105)
rt.def("/datum/job/cargo_tech/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 2);
	rt.setSv(f, "spawn_positions", 2);
	rt.setSv(f, "access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	rt.setSv(f, "minimal_access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	return f.dot;
});

// /datum/job/mining/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:113)
rt.def("/datum/job/mining/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "total_positions", 2);
	rt.setSv(f, "spawn_positions", 2);
	rt.setSv(f, "access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	rt.setSv(f, "minimal_access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	return f.dot;
});

rt.type(722, "/datum/outfit/job/mining", "/datum/outfit/job", {});

// /datum/outfit/job/mining/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:121)
rt.def("/datum/outfit/job/mining/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "box", T("/obj/item/weapon/storage/box/engineer/radio"));
	return f.dot;
});

// /datum/job/bartender/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:127)
rt.def("/datum/job/bartender/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "access", rt.list(35, 25, 28, 6, 66));
	rt.setSv(f, "minimal_access", rt.list(35, 25, 28, 6, 66));
	return f.dot;
});

// /datum/job/cook/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:133)
rt.def("/datum/job/cook/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "access", rt.list(35, 25, 28, 6, 66));
	rt.setSv(f, "minimal_access", rt.list(35, 25, 28, 6, 66));
	return f.dot;
});

// /datum/job/hydro/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:139)
rt.def("/datum/job/hydro/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "access", rt.list(35, 25, 28, 6, 12));
	rt.setSv(f, "minimal_access", rt.list(35, 25, 28, 6, 12));
	return f.dot;
});

// /datum/job/janitor/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:146)
rt.def("/datum/job/janitor/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "access", rt.list(26, 35, 25, 28, 6, 12));
	rt.setSv(f, "minimal_access", rt.list(26, 35, 25, 28, 6, 12));
	return f.dot;
});

// /datum/job/clown/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:155)
rt.def("/datum/job/clown/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation")) {
		return live(f.dot);
	}
	rt.setSv(f, "supervisors", "nobody but yourself");
	return f.dot;
});

// /datum/job/hos/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:159)
rt.def("/datum/job/hos/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/chief_engineer/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:160)
rt.def("/datum/job/chief_engineer/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/qm/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:161)
rt.def("/datum/job/qm/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/cmo/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:162)
rt.def("/datum/job/cmo/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

rt.type(2764, "/datum/job/geneticist", "/datum/job", {
	title: "Geneticist",
	flag: 32,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 2,
	supervisors: "the chief medical officer and research director",
	selection_color: "#ffeef0",
	outfit: rt.typePath("/datum/outfit/job/geneticist"),
	access: null,
	minimal_access: null,
});

// /datum/job/geneticist/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:163)
rt.def("/datum/job/geneticist/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/virologist/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:164)
rt.def("/datum/job/virologist/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/rd/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:165)
rt.def("/datum/job/rd/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/warden/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:166)
rt.def("/datum/job/warden/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/lawyer/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm:167)
rt.def("/datum/job/lawyer/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "OmegaStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});
