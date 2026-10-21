// From code/modules/station_goals/station_goal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4201, "/datum/station_goal", "/datum", {
	name: "Generic Goal",
	weight: 1,
	required_crew: 10,
	gamemode_blacklist: null,
	completed: 0,
	report_message: "Complete this goal.",
});

// /datum/station_goal/proc/<init>  (code/modules/station_goals/station_goal.dm:10)
rt.def("/datum/station_goal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "gamemode_blacklist", rt.list());
	return f.dot;
});

// /datum/station_goal/proc/send_report  (code/modules/station_goals/station_goal.dm:15)  may sleep
rt.def("/datum/station_goal/proc/send_report", function* send_report(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Priority Nanotrasen directive received. Project \"＀\" details inbound.", [rt.sv(f, "name")]), "Incoming Priority Message", rt.rsc("sound/ai/commandreport.ogg")]);
	yield* g.call(f, P("/proc/print_command_report"), null, [null, (yield* g.srcCall(f, "get_report")), null, fmt("Nanotrasen Directive ＀ ３！", [rt.op(f, "PickUnweighted", [1], [rt.gl("phonetic_alphabet")]), (yield* g.call(f, P("/proc/rand"), null, [1, 50]))]), "announce", 0], rt.Args.Named);
	yield* g.srcCall(f, "on_report");
	return f.dot;
}, true);

// /datum/station_goal/proc/print_result  (code/modules/station_goals/station_goal.dm:30)
rt.def("/datum/station_goal/proc/print_result", function print_result(f: Frame) {
	if (truthy(rt.callSrc(f, "check_completion", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>Station Goal</b> : ＀ :  <span class='greenannounce'>Completed!</span>", [rt.sv(f, "name")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [rt.world(), fmt("<b>Station Goal</b> : ＀ : <span class='boldannounce'>Failed!</span>", [rt.sv(f, "name")])]);
	}
	return f.dot;
});

// /datum/station_goal/proc/Destroy  (code/modules/station_goals/station_goal.dm:36)  may sleep
rt.def("/datum/station_goal/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "station_goals", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/station_goal/proc/Topic  (code/modules/station_goals/station_goal.dm:40)  may sleep
rt.def("/datum/station_goal/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/check_rights"), null, [2])))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "announce"))) {
		yield* g.srcCall(f, "on_report");
		yield* g.srcCall(f, "send_report");
	} else {
		if (!truthy(rt.at(live(f.args[1]), "remove"))) return f.dot;
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });
