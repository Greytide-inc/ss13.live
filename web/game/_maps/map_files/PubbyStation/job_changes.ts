// From code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/job/hos/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm:4)
rt.def("/datum/job/hos/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "PubbyStation")) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "access", 27, add);
	rt.modSrcVar(f, "minimal_access", 27, add);
	return f.dot;
});

// /datum/job/warden/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm:10)
rt.def("/datum/job/warden/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "PubbyStation")) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "access", 27, add);
	rt.modSrcVar(f, "minimal_access", 27, add);
	return f.dot;
});

// /datum/job/officer/proc/New  (code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm:16)
rt.def("/datum/job/officer/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "PubbyStation")) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "access", 27, add);
	rt.modSrcVar(f, "minimal_access", 27, add);
	return f.dot;
});

// /datum/job/curator/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm:21)
rt.def("/datum/job/curator/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "PubbyStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});

// /datum/job/lawyer/proc/map_check  (code/modules/jobs/map_changes/../../../../_maps/map_files/PubbyStation/job_changes.dm:22)
rt.def("/datum/job/lawyer/proc/map_check", function map_check(f: Frame) {
	return ((!isEqual(rt.gv(f, "map_name", rt.fv(f, "config", rt.gl("SSmapping"))), "PubbyStation") ? 1 : 0) && rt.callSuper(f, [], rt.Args.Same));
});
