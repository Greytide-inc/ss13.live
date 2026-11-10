// Based on /tg/station's code/modules/goonchat/jsErrorHandler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2660, "/datum/debugFileOutput", "/datum", {
	directory: "data/popupErrors",
	ext: "log",
	logFileLimit: 1048576, // tg_js: 1 MB, was 50: any player's link writes here, and the files are held in the server's memory
	validFiles: null,
});

// jsErrorHandler.dm:24
rt.def("/datum/debugFileOutput/proc/error", function error(f: Frame, fileName: Value, message: Value, C: Value) {
	let fileSize: Value = null;
	let $1: any;
	if (!fileName || !message) {
		return 0;
	}
	if (!rt.isIn(f, fileName, this.validFiles)) {
		return 0; // tg_js: was a thrown runtime: a player's made-up file name filled the server log
	}
	message = copytext(message, 1, 2000); // tg_js: one report is a line, not a 128 KB frame
	let logFile: Value = file(`${this.directory}/${fileName}.${this.ext}`);
	// tg_js: the size from the text (length() of a file is 0 here, so the limit never held)
	if ((fileSize = rt.length(file2text(`${this.directory}/${fileName}.${this.ext}`))) >= this.logFileLimit) {
		return 0; // tg_js: full: stop quietly (CRASH was a runtime per report once a player had filled it)
	}
	let $0: any = time2text(rt.world().realtime, "YYYY-MM-DD hh:mm:ss");
	if (C && C.key) {
		$1 = C.key;
	} else {
		$1 = "Unknown Client";
	}
	rt.op(f, "Output", [], [logFile, (message = `[${$0}] Client: [${$1}] triggered: ${message}`)], false);
	return 1;
});

// jsErrorHandler.dm:39
rt.def("/datum/debugFileOutput/proc/clear", function clear(f: Frame, fileName: Value) {
	if (!fileName) {
		return 0;
	}
	if (!fexists(`${this.directory}/${fileName}.${this.ext}`)) {
		rt.throw_(f, new_(T("/exception"), `Debug log file '${fileName}.${this.ext}' does not exist.`, "code/modules/goonchat/jsErrorHandler.dm", 42));
	}
	if (!rt.isIn(f, fileName, this.validFiles)) {
		rt.throw_(f, new_(T("/exception"), `Debug log file '${fileName}.${this.ext}' is not a valid path.`, "code/modules/goonchat/jsErrorHandler.dm", 45));
	}
	fdel(`${this.directory}/${fileName}.${this.ext}`);
	return 1;
});

// jsErrorHandler.dm:51
rt.def("/datum/debugFileOutput/proc/clearAll", function clearAll(f: Frame) {
	let fileName: Value = null;
	let deleted: Value = new_(T("/list"));
	for (fileName of each(this.validFiles)) {
		if (fexists(`${this.directory}/${fileName}.${this.ext}`)) {
			fdel(`${this.directory}/${fileName}.${this.ext}`);
		}
		deleted += fileName;
	}
	return deleted;
});

// jsErrorHandler.dm:60
rt.def("/datum/controller/global_vars/proc/InitGlobaldebugFileOutput", function InitGlobaldebugFileOutput(f: Frame) {
	GLOB.debugFileOutput = new_(T("/datum/debugFileOutput"));
	this.gvars_datum_init_order += "debugFileOutput";
	return f.dot;
});

// jsErrorHandler.dm:63
rt.def("/client/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!(rt.at(href_list, "action") && rt.at(href_list, "action") == "debugFileOutput" && rt.at(href_list, "file") && rt.at(href_list, "message"))) return f.dot;
	let file: Value = rt.at(href_list, "file");
	let message: Value = rt.at(href_list, "message");
	GLOB.debugFileOutput.error(file, message, this);
	return f.dot;
}, true);

// jsErrorHandler.dm:75
rt.def("/client/proc/deleteJsLogFile", function deleteJsLogFile(f: Frame, fileName: Value) {
	if (!this.holder) {
		return f.dot;
	}
	if (!fileName) {
		return f.dot;
	}
	rt.callName(f, GLOB.debugFileOutput, "clear", [fileName]);
	log_admin(`${key_name(f.usr)} deleted the '${fileName}' JS logfile`);
	message_admins(`${key_name_admin(f.usr)} deleted the '${fileName}' JS logfile`);
	return f.dot;
}, false, { hidePopup: true, verb: { name: "Delete JS Logfile", category: "Debug", desc: "Delete a logfile for JS error reporting. Be sure you want to do this!" }, argTypes: [{ type: 2 }] });

// jsErrorHandler.dm:90
rt.def("/client/proc/deleteAllJsLogFiles", function* deleteAllJsLogFiles(f: Frame) {
	if (!this.holder) {
		return f.dot;
	}
	if ((yield* alert("Are you really sure you want to delete every single JS logfile?", "No", "Yes")) == "No") {
		return f.dot;
	}
	let summary: Value = GLOB.debugFileOutput.clearAll();
	let friendlySummary: Value = summary.Join(", ");
	log_admin(`${key_name(f.usr)} deleted every JS logfile! (${friendlySummary})`);
	message_admins(`${key_name_admin(f.usr)} deleted every JS logfile! (${friendlySummary})`);
	return f.dot;
}, true, { verb: { name: "Delete All JS Logfiles", category: "", desc: "Delete all logfiles for JS error reporting. Be extra sure you want to do this!" } });
