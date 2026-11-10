// Based on /tg/station's code/modules/station_goals/station_goal.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


rt.type(4201, "/datum/station_goal", "/datum", {
	name: "Generic Goal",
	weight: 1,
	required_crew: 10,
	gamemode_blacklist: null,
	completed: 0,
	report_message: "Complete this goal.",
});

// station_goal.dm:10
rt.def("/datum/station_goal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gamemode_blacklist = list();
	return f.dot;
});

// station_goal.dm:15
rt.def("/datum/station_goal/proc/send_report", function* send_report(f: Frame) {
	yield* priority_announce(`Priority Nanotrasen directive received. Project "${this.name}" details inbound.`, "Incoming Priority Message", rt.rsc("sound/ai/commandreport.ogg"));
	yield* print_command_report(this.get_report(), fmt("Nanotrasen Directive ＀ ３！", [pick(GLOB.phonetic_alphabet), rand(1, 50)]), { announce: 0 });
	this.on_report();
	return f.dot;
}, true);

// station_goal.dm:30
rt.def("/datum/station_goal/proc/print_result", function print_result(f: Frame) {
	if (this.check_completion()) {
		to_chat(rt.world(), `<b>Station Goal</b> : ${this.name} :  <span class='greenannounce'>Completed!</span>`);
	} else {
		to_chat(rt.world(), `<b>Station Goal</b> : ${this.name} : <span class='boldannounce'>Failed!</span>`);
	}
	return f.dot;
});

// station_goal.dm:36
rt.def("/datum/station_goal/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSticker.mode.station_goals -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// station_goal.dm:40
rt.def("/datum/station_goal/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!check_rights(2)) {
		return f.dot;
	}
	if (rt.at(href_list, "announce")) {
		this.on_report();
		yield* this.send_report();
	} else {
		if (!rt.at(href_list, "remove")) return f.dot;
		yield* qdel(this);
	}
	return f.dot;
}, true);
