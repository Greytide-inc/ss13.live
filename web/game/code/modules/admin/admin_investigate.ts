// Based on /tg/station's code/modules/admin/admin_investigate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


// admin_investigate.dm:2
rt.def("/atom/proc/investigate_log", function investigate_log(f: Frame, message: Value, subject: Value) {
	if (!message || !subject) {
		return f.dot;
	}
	let F: Value = file(`${GLOB.log_directory}/${subject}.html`);
	rt.op(f, "Output", [], [F, fmt("<small>＀ ＃ (＀,＀,＀)</small> || ＀ ＀<br>", [time_stamp(), this, this.x, this.y, this.z, this, message])], false);
	return f.dot;
});

// admin_investigate.dm:11
rt.def("/client/proc/investigate_show", function investigate_show(f: Frame, subject: Value) {
	let F: Value = null;
	if (!this.holder) {
		return f.dot;
	}
	if (!fexists((F = file(`${GLOB.log_directory}/${subject}.html`)))) {
		to_chat(this, `<span class='danger'>No ${subject} logfile was found.</span>`);
		return f.dot;
	}
	rt.op(f, "Browse", [], [this, F, `window=investigate${subject};size=800x300`], false);
	return f.dot;
}, false, { verb: { name: "Investigate", category: "Admin" }, argTypes: [{ source: "?" }] });
