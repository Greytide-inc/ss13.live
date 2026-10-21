// From code/modules/goonchat/jsErrorHandler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2660, "/datum/debugFileOutput", "/datum", {
	directory: "data/popupErrors",
	ext: "log",
	logFileLimit: 1048576, // tg_js: 1 MB, was 50: any player's link writes here, and the files are held in the server's memory
	validFiles: null,
});

// /datum/debugFileOutput/proc/error  (code/modules/goonchat/jsErrorHandler.dm:24)
rt.def("/datum/debugFileOutput/proc/error", function error(f: Frame, fileName: Value, message: Value, C: Value) {
	let logFile: Value = null, fileSize: Value = null;
	let $0: any, $1: any;
	f.vars = () => [message, logFile, fileSize, $0, $1];
	if ((!truthy(live(fileName)) || !truthy(live(message)))) {
		return 0;
	}
	if (!truthy((rt.isIn(f, live(fileName), rt.fv(f, "validFiles", live(f.src))) ? 1 : 0))) {
		return 0; // tg_js: was a thrown runtime: a player's made-up file name filled the server log
	}
	message = rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2000]); // tg_js: one report is a line, not a 128 KB frame
	logFile = rt.call(f, P("/proc/file"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]);
	// tg_js: the size from the text (length() of a file is 0 here, so the limit never held)
	if (rt.ge((fileSize = rt.length(rt.call(f, P("/proc/file2text"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]))), rt.fv(f, "logFileLimit", live(f.src)))) {
		return 0; // tg_js: full: stop quietly (CRASH was a runtime per report once a player had filled it)
	}
	$0 = rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "YYYY-MM-DD hh:mm:ss"]);
	if ((truthy(live(C)) && truthy(rt.fv(f, "key", live(C))))) {
		$1 = rt.fv(f, "key", live(C));
	} else {
		$1 = "Unknown Client";
	}
	rt.op(f, "Output", [], [live(logFile), (message = fmt("[＀] Client: [＀] triggered: ＀", [$0, $1, live(message)]))], false);
	return 1;
});

// /datum/debugFileOutput/proc/clear  (code/modules/goonchat/jsErrorHandler.dm:39)
rt.def("/datum/debugFileOutput/proc/clear", function clear(f: Frame, fileName: Value) {
	if (!truthy(live(fileName))) {
		return 0;
	}
	if (!truthy(rt.call(f, P("/proc/fexists"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]))) {
		rt.throw_(f, rt.new_(f, T("/exception"), [fmt("Debug log file '＀.＀' does not exist.", [live(fileName), rt.fv(f, "ext", live(f.src))]), "code/modules/goonchat/jsErrorHandler.dm", 42]));
	}
	if (!truthy((rt.isIn(f, live(fileName), rt.fv(f, "validFiles", live(f.src))) ? 1 : 0))) {
		rt.throw_(f, rt.new_(f, T("/exception"), [fmt("Debug log file '＀.＀' is not a valid path.", [live(fileName), rt.fv(f, "ext", live(f.src))]), "code/modules/goonchat/jsErrorHandler.dm", 45]));
	}
	rt.call(f, P("/proc/fdel"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]);
	return 1;
});

// /datum/debugFileOutput/proc/clearAll  (code/modules/goonchat/jsErrorHandler.dm:51)
rt.def("/datum/debugFileOutput/proc/clearAll", function clearAll(f: Frame) {
	let deleted: Value = null, fileName: Value = null;
	let $e: any;
	f.vars = () => [deleted, fileName, $e];
	deleted = rt.new_(f, T("/list"), []);
	fileName = null;
	rt.forList(f, 0, rt.fv(f, "validFiles", live(f.src)));
	while (($e = rt.next(f, 0)) !== undefined) {
		fileName = $e;
		if (truthy(rt.call(f, P("/proc/fexists"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]))) {
			rt.call(f, P("/proc/fdel"), null, [fmt("＀/＀.＀", [rt.fv(f, "directory", live(f.src)), live(fileName), rt.fv(f, "ext", live(f.src))])]);
		}
		deleted = rt.modify(live(deleted), live(fileName), add);
	}
	rt.endFor(f, 0);
	return live(deleted);
});

// /datum/controller/global_vars/proc/InitGlobaldebugFileOutput  (code/modules/goonchat/jsErrorHandler.dm:60)
rt.def("/datum/controller/global_vars/proc/InitGlobaldebugFileOutput", function InitGlobaldebugFileOutput(f: Frame) {
	rt.setGl("debugFileOutput", rt.new_(f, T("/datum/debugFileOutput"), []));
	rt.modSrcVar(f, "gvars_datum_init_order", "debugFileOutput", add);
	return f.dot;
});

// /client/proc/Topic  (code/modules/goonchat/jsErrorHandler.dm:63)  may sleep
rt.def("/client/proc/Topic", function* Topic(f: Frame) {
	let file: Value = null, message: Value = null;
	f.vars = () => [file, message];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(((truthy(rt.at(live(f.args[1]), "action")) && isEqual(rt.at(live(f.args[1]), "action"), "debugFileOutput")) && truthy(rt.at(live(f.args[1]), "file"))) && truthy(rt.at(live(f.args[1]), "message")))) return f.dot;
	file = rt.at(live(f.args[1]), "file");
	message = rt.at(live(f.args[1]), "message");
	yield* g.callName(f, rt.gl("debugFileOutput"), "error", [live(file), live(message), live(f.src)]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /client/proc/deleteJsLogFile  (code/modules/goonchat/jsErrorHandler.dm:75)
rt.def("/client/proc/deleteJsLogFile", function deleteJsLogFile(f: Frame, fileName: Value) {
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (!truthy(live(fileName))) {
		return live(f.dot);
	}
	rt.callName(f, rt.gl("debugFileOutput"), "clear", [live(fileName)]);
	rt.call(f, P("/proc/log_admin"), null, [fmt("＀ deleted the '＀' JS logfile", [rt.call(f, P("/proc/key_name"), null, [live(f.usr)]), live(fileName)])]);
	rt.call(f, P("/proc/message_admins"), null, [fmt("＀ deleted the '＀' JS logfile", [rt.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]), live(fileName)])]);
	return f.dot;
}, false, { hidePopup: true, verb: { name: "Delete JS Logfile", category: "Debug", desc: "Delete a logfile for JS error reporting. Be sure you want to do this!" }, argTypes: [{ type: 2 }] });

// /client/proc/deleteAllJsLogFiles  (code/modules/goonchat/jsErrorHandler.dm:90)  may sleep
rt.def("/client/proc/deleteAllJsLogFiles", function* deleteAllJsLogFiles(f: Frame) {
	let summary: Value = null, friendlySummary: Value = null;
	f.vars = () => [summary, friendlySummary];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, ["Are you really sure you want to delete every single JS logfile?", "No", "Yes"])), "No")) {
		return live(f.dot);
	}
	summary = (yield* g.callName(f, rt.gl("debugFileOutput"), "clearAll", []));
	friendlySummary = (yield* g.callName(f, live(summary), "Join", [", "]));
	yield* g.call(f, P("/proc/log_admin"), null, [fmt("＀ deleted every JS logfile! (＀)", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(friendlySummary)])]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ deleted every JS logfile! (＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(friendlySummary)])]);
	return f.dot;
}, true, { verb: { name: "Delete All JS Logfiles", category: "", desc: "Delete all logfiles for JS error reporting. Be extra sure you want to do this!" } });
