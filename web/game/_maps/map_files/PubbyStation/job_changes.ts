// Based on /tg/station's code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// job_changes.dm:4
rt.def("/datum/job/hos/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "PubbyStation") {
		return f.dot;
	}
	this.access += 27;
	this.minimal_access += 27;
	return f.dot;
});

// job_changes.dm:10
rt.def("/datum/job/warden/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "PubbyStation") {
		return f.dot;
	}
	this.access += 27;
	this.minimal_access += 27;
	return f.dot;
});

// job_changes.dm:16
rt.def("/datum/job/officer/proc/New", function New(f: Frame) {
	parent_proc();
	if (GLOB.SSmapping.config.map_name != "PubbyStation") {
		return f.dot;
	}
	this.access += 27;
	this.minimal_access += 27;
	return f.dot;
});

// job_changes.dm:21
rt.def("/datum/job/curator/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "PubbyStation" ? 1 : 0) && parent_proc());
});

// job_changes.dm:22
rt.def("/datum/job/lawyer/proc/map_check", function map_check(f: Frame) {
	return ((GLOB.SSmapping.config.map_name != "PubbyStation" ? 1 : 0) && parent_proc());
});
