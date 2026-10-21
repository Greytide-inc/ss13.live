// From code/modules/admin/admin_investigate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/investigate_log  (code/modules/admin/admin_investigate.dm:2)
rt.def("/atom/proc/investigate_log", function investigate_log(f: Frame, message: Value, subject: Value) {
	let F: Value = null;
	f.vars = () => [F];
	if ((!truthy(live(message)) || !truthy(live(subject)))) {
		return live(f.dot);
	}
	F = rt.call(f, P("/proc/file"), null, [fmt("＀/＀.html", [rt.gl("log_directory"), live(subject)])]);
	rt.op(f, "Output", [], [live(F), fmt("<small>＀ ＃ (＀,＀,＀)</small> || ＀ ＀<br>", [rt.call(f, P("/proc/time_stamp"), null, []), live(f.src), rt.sv(f, "x"), rt.sv(f, "y"), rt.sv(f, "z"), live(f.src), live(message)])], false);
	return f.dot;
});

// /client/proc/investigate_show  (code/modules/admin/admin_investigate.dm:11)
rt.def("/client/proc/investigate_show", function investigate_show(f: Frame, subject: Value) {
	let F: Value = null;
	let $0: any;
	f.vars = () => [F, $0];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [(F = rt.call(f, P("/proc/file"), null, [fmt("＀/＀.html", [rt.gl("log_directory"), live(subject)])]))]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>No ＀ logfile was found.</span>", [live(subject)])]);
		return live(f.dot);
	}
	rt.op(f, "Browse", [], [live(f.src), live(F), fmt("window=investigate＀;size=800x300", [live(subject)])], false);
	return f.dot;
}, false, { verb: { name: "Investigate", category: "Admin" }, argTypes: [{ source: "?" }] });
