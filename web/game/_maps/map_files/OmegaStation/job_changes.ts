// Based on /tg/station's code/modules/jobs/map_changes/../../../../_maps/map_files/OmegaStation/job_changes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// Empty in tg.
rt.def("/datum/job/proc/after_spawn", undefined, false, { args: ["H", "M"] });

// job_changes.dm:7
rt.def("/datum/job/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.supervisors = "the captain and the head of personnel";
	return f.dot;
});

// job_changes.dm:12
rt.def("/datum/outfit/job/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.box = T("/obj/item/weapon/storage/box/survival/radio");
	return f.dot;
});

// job_changes.dm:21
rt.def("/datum/job/captain/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.supervisors = "Nanotrasen and Central Command";
	return f.dot;
});

// job_changes.dm:26
rt.def("/datum/job/hop/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.supervisors = "the captain and Central Command";
	return f.dot;
});

// job_changes.dm:31
rt.def("/datum/job/hop/proc/get_access", function get_access(f: Frame) {
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return parent_proc();
	}
	return get_all_accesses();
});

// job_changes.dm:37
rt.def("/datum/job/officer/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 3;
	this.spawn_positions = 3;
	this.access = list(1, 63, 2, 3, 42, 12, 6, 66, 4);
	this.minimal_access = list(1, 63, 2, 3, 42, 12, 6, 66, 4);
	return f.dot;
});

rt.type(721, "/datum/outfit/job/officer", "/datum/outfit/job", {});

// job_changes.dm:45
rt.def("/datum/outfit/job/officer/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.box = T("/obj/item/weapon/storage/box/security/radio");
	return f.dot;
});

// job_changes.dm:50
rt.def("/datum/job/detective/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.access = list(1, 63, 2, 3, 42, 12, 6, 66, 4);
	this.minimal_access = list(1, 63, 2, 3, 42, 12, 6, 66, 4);
	return f.dot;
});

// job_changes.dm:56
rt.def("/datum/outfit/job/detective/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.box = T("/obj/item/weapon/storage/box/security/radio");
	return f.dot;
});

// job_changes.dm:63
rt.def("/datum/job/doctor/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.selection_color = "#ffffff";
	this.total_positions = 3;
	this.spawn_positions = 3;
	this.access = list(5, 6, 45, 33, 39, 9);
	this.minimal_access = list(5, 6, 45, 33, 39, 9);
	return f.dot;
});

// job_changes.dm:74
rt.def("/datum/job/engineer/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 2;
	this.spawn_positions = 2;
	this.access = list(18, 10, 11, 23, 12, 13, 32, 24, 61);
	this.minimal_access = list(18, 10, 11, 23, 12, 13, 32, 24, 61);
	return f.dot;
});

// job_changes.dm:82
rt.def("/datum/outfit/job/engineer/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.box = T("/obj/item/weapon/storage/box/engineer/radio");
	return f.dot;
});

// job_changes.dm:87
rt.def("/datum/job/atmos/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 2;
	this.spawn_positions = 2;
	return f.dot;
});

// job_changes.dm:95
rt.def("/datum/job/scientist/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 3;
	this.spawn_positions = 3;
	this.access = list(29, 7, 8, 47, 55, 64, 23);
	this.minimal_access = list(29, 7, 8, 47, 55, 64, 23);
	return f.dot;
});

// job_changes.dm:105
rt.def("/datum/job/cargo_tech/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 2;
	this.spawn_positions = 2;
	this.access = list(12, 50, 31, 34, 41, 48, 54, 64);
	this.minimal_access = list(12, 50, 31, 34, 41, 48, 54, 64);
	return f.dot;
});

// job_changes.dm:113
rt.def("/datum/job/mining/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.total_positions = 2;
	this.spawn_positions = 2;
	this.access = list(12, 50, 31, 34, 41, 48, 54, 64);
	this.minimal_access = list(12, 50, 31, 34, 41, 48, 54, 64);
	return f.dot;
});

rt.type(722, "/datum/outfit/job/mining", "/datum/outfit/job", {});

// job_changes.dm:121
rt.def("/datum/outfit/job/mining/proc/New", function New(f: Frame) {
	parent_proc();
	this.box = T("/obj/item/weapon/storage/box/engineer/radio");
	return f.dot;
});

// job_changes.dm:127
rt.def("/datum/job/bartender/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.access = list(35, 25, 28, 6, 66);
	this.minimal_access = list(35, 25, 28, 6, 66);
	return f.dot;
});

// job_changes.dm:133
rt.def("/datum/job/cook/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.access = list(35, 25, 28, 6, 66);
	this.minimal_access = list(35, 25, 28, 6, 66);
	return f.dot;
});

// job_changes.dm:139
rt.def("/datum/job/hydro/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.access = list(35, 25, 28, 6, 12);
	this.minimal_access = list(35, 25, 28, 6, 12);
	return f.dot;
});

// job_changes.dm:146
rt.def("/datum/job/janitor/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.access = list(26, 35, 25, 28, 6, 12);
	this.minimal_access = list(26, 35, 25, 28, 6, 12);
	return f.dot;
});

// job_changes.dm:155
rt.def("/datum/job/clown/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "OmegaStation") {
		return f.dot;
	}
	this.supervisors = "nobody but yourself";
	return f.dot;
});

// job_changes.dm:159
rt.def("/datum/job/hos/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:160
rt.def("/datum/job/chief_engineer/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:161
rt.def("/datum/job/qm/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:162
rt.def("/datum/job/cmo/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
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

// job_changes.dm:163
rt.def("/datum/job/geneticist/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:164
rt.def("/datum/job/virologist/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:165
rt.def("/datum/job/rd/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:166
rt.def("/datum/job/warden/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:167
rt.def("/datum/job/lawyer/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "OmegaStation" ? 1 : 0) && parent_proc());
});
