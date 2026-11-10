// Based on /tg/station's code/modules/client/verbs/etips.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// etips.dm:6
rt.def("/client/verb/toggle_tips", function toggle_tips(f: Frame) {
	this.prefs.enable_tips = (!this.prefs.enable_tips ? 1 : 0);
	this.prefs.save_preferences();
	let $0: any = f.usr;
	to_chat($0, `<span class='danger'>Examine tooltips ${this.prefs.enable_tips ? "en" : "dis"}abled.</span>`);
	return f.dot;
}, false, { verb: { name: "Toggle examine tooltips", category: "Preferences", desc: "Toggles examine hover-over tooltips" } });

// etips.dm:15
rt.def("/client/verb/change_tip_delay", function* change_tip_delay(f: Frame) {
	let indelay: Value = null;
	indelay = text2num((indelay = (yield* stripped_input(f.usr, "Enter the tooltip delay in milliseconds (default: 500)", "Enter tooltip delay", "", 10))));
	if (!f.usr) return f.dot;
	this.prefs.tip_delay = indelay;
	this.prefs.save_preferences();
	to_chat(f.usr, `<span class='danger'>Tooltip delay set to ${indelay} milliseconds.</span>`);
	return f.dot;
}, true, { verb: { name: "Set examine tooltip delay", category: "Preferences", desc: "Sets the delay in milliseconds before examine tooltips appear" } });
