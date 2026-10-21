// From code/modules/modular_computers/file_system/programs/file_browser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4164, "/datum/computer_file/program/filemanager", "/datum/computer_file/program", {
	open_file: null,
	error: null,
	filename: "filemanager",
	filedesc: "File Manager",
	extended_desc: "This program allows management of files.",
	program_icon_state: "generic",
	size: 8,
	requires_ntnet: 0,
	available_on_ntnet: 0,
	undeletable: 1,
	tgui_id: "ntos_file_manager",
});

// /datum/computer_file/program/filemanager/proc/ui_act  (code/modules/modular_computers/file_system/programs/file_browser.dm:16)  may sleep
rt.def("/datum/computer_file/program/filemanager/proc/ui_act", function* ui_act(f: Frame) {
	let HDD: Value = null, RHDD: Value = null, printer: Value = null, newname: Value = null, F: Value = null, file: Value = null, F_3: Value = null, C: Value = null, newname_4: Value = null, newtext: Value = null, backup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [HDD, RHDD, printer, newname, F, file, F_3, C, newname_4, newtext, backup, $0, $1];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	HDD = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	RHDD = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "SDD");
	printer = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "PRINT");
	$0 = live(f.args[0]);
	if ($0 === "PRG_openfile") {
		f.dot = 1;
		rt.setSv(f, "open_file", rt.at(live(f.args[1]), "name"));
	} else if ($0 === "PRG_newtextfile") {
		f.dot = 1;
		if (!truthy((newname = (yield* g.call(f, P("/proc/stripped_input"), null, [null, live(f.usr), null, "Enter file name or leave blank to cancel:", null, "File rename", "max_length", 50], rt.Args.Named))))) {
			return 1;
		}
		if (!truthy(live(HDD))) {
			return 1;
		}
		rt.setFv(f, "filename", (F = (yield* g.new_(f, T("/datum/computer_file/data"), []))), live(newname));
		rt.setFv(f, "filetype", live(F), "TXT");
		yield* g.callName(f, live(HDD), "store_file", [live(F)]);
	} else if ($0 === "PRG_deletefile") {
		f.dot = 1;
		if (!truthy(live(HDD))) {
			return 1;
		}
		if ((!truthy((file = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || truthy(rt.fv(f, "undeletable", live(file))))) {
			return 1;
		}
		yield* g.callName(f, live(HDD), "remove_file", [live(file)]);
	} else if ($0 === "PRG_usbdeletefile") {
		f.dot = 1;
		if (!truthy(live(RHDD))) {
			return 1;
		}
		if ((!truthy((file = (yield* g.callName(f, live(RHDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || truthy(rt.fv(f, "undeletable", live(file))))) {
			return 1;
		}
		yield* g.callName(f, live(RHDD), "remove_file", [live(file)]);
	} else if ($0 === "PRG_closefile") {
		f.dot = 1;
		rt.setSv(f, "open_file", null);
		rt.setSv(f, "error", null);
	} else if ($0 === "PRG_clone") {
		f.dot = 1;
		if (!truthy(live(HDD))) {
			return 1;
		}
		if ((!truthy((F_3 = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || !truthy((rt.istype(live(F_3), T("/datum/computer_file")) ? 1 : 0)))) {
			return 1;
		}
		C = (yield* g.callName(f, live(F_3), "clone", [1]));
		yield* g.callName(f, live(HDD), "store_file", [live(C)]);
	} else if ($0 === "PRG_rename") {
		f.dot = 1;
		if (!truthy(live(HDD))) {
			return 1;
		}
		if ((!truthy((file = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || !truthy((rt.istype(live(file), T("/datum/computer_file")) ? 1 : 0)))) {
			return 1;
		}
		newname_4 = (yield* g.call(f, P("/proc/stripped_input"), null, [null, live(f.usr), null, "Enter new file name:", null, "File rename", null, rt.fv(f, "filename", live(file)), "max_length", 50], rt.Args.Named));
		if ((truthy(live(file)) && truthy(live(newname_4)))) {
			rt.setFv(f, "filename", live(file), live(newname_4));
		}
	} else if ($0 === "PRG_edit") {
		f.dot = 1;
		if (!truthy(rt.sv(f, "open_file"))) {
			return 1;
		}
		if (!truthy(live(HDD))) {
			return 1;
		}
		if ((!truthy((F_3 = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.sv(f, "open_file")])))) || !truthy((rt.istype(live(F_3), T("/datum/computer_file/data")) ? 1 : 0)))) {
			return 1;
		}
		if ((truthy(rt.fv(f, "do_not_edit", live(F_3))) && isEqual((yield* g.call(f, P("/proc/alert"), null, ["WARNING: This file is not compatible with editor. Editing it may result in permanently corrupted formatting or damaged data consistency. Edit anyway?", "Incompatible File", "No", "Yes"])), "No"))) {
			return 1;
		}
		if (!truthy((newtext = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, [live(f.usr), fmt("Editing file ＀. You may use most tags used in paper formatting:", [rt.sv(f, "open_file")]), "Text Editor", (yield* g.call(f, P("/proc/html_decode"), null, [rt.fv(f, "stored_data", live(F_3))])), 16384, 1]))))) {
			return live(f.dot);
		}
		if (truthy(live(F_3))) {
			backup = (yield* g.callName(f, live(F_3), "clone", []));
			yield* g.callName(f, live(HDD), "remove_file", [live(F_3)]);
			rt.setFv(f, "stored_data", live(F_3), live(newtext));
			yield* g.callName(f, live(F_3), "calculate_size", []);
			if (!truthy((yield* g.callName(f, live(HDD), "store_file", [live(F_3)])))) {
				rt.setSv(f, "error", fmt("I/O error: Unable to overwrite file. Hard drive is probably full. You may want to backup your changes before closing this window:<br><br>＀<br><br>", [rt.fv(f, "stored_data", live(F_3))]));
				yield* g.callName(f, live(HDD), "store_file", [live(backup)]);
			}
		}
	} else if ($0 === "PRG_printfile") {
		f.dot = 1;
		if (!truthy(rt.sv(f, "open_file"))) {
			return 1;
		}
		if (!truthy(live(HDD))) {
			return 1;
		}
		if ((!truthy((F_3 = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.sv(f, "open_file")])))) || !truthy((rt.istype(live(F_3), T("/datum/computer_file/data")) ? 1 : 0)))) {
			return 1;
		}
		if (!truthy(live(printer))) {
			rt.setSv(f, "error", "Missing Hardware: Your computer does not have required hardware to complete this operation.");
			return 1;
		}
		$0 = live(printer);
		if (truthy(rt.fv(f, "emagged", rt.sv(f, "computer")))) {
			$1 = "Comic Sans MS";
		} else {
			$1 = "Times New Roman";
		}
		if (!truthy((yield* g.callName(f, $0, "print_text", [add(add(fmt("<font face=\"＀\">", [$1]), (yield* g.srcCall(f, "prepare_printjob", rt.fv(f, "stored_data", live(F_3))))), "</font>"), rt.sv(f, "open_file")])))) {
			rt.setSv(f, "error", "Hardware error: Printer was unable to print the file. It may be out of paper.");
			return 1;
		}
	} else if ($0 === "PRG_copytousb") {
		f.dot = 1;
		if ((!truthy(live(HDD)) || !truthy(live(RHDD)))) {
			return 1;
		}
		if ((!truthy((F_3 = (yield* g.callName(f, live(HDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || !truthy((rt.istype(live(F_3), T("/datum/computer_file")) ? 1 : 0)))) {
			return 1;
		}
		C = (yield* g.callName(f, live(F_3), "clone", [0]));
		yield* g.callName(f, live(RHDD), "store_file", [live(C)]);
	} else if ($0 === "PRG_copyfromusb") {
		f.dot = 1;
		if ((!truthy(live(HDD)) || !truthy(live(RHDD)))) {
			return 1;
		}
		if ((!truthy((F_3 = (yield* g.callName(f, live(RHDD), "find_file_by_name", [rt.at(live(f.args[1]), "name")])))) || !truthy((rt.istype(live(F_3), T("/datum/computer_file")) ? 1 : 0)))) {
			return 1;
		}
		C = (yield* g.callName(f, live(F_3), "clone", [0]));
		yield* g.callName(f, live(HDD), "store_file", [live(C)]);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /datum/computer_file/program/filemanager/proc/parse_tags  (code/modules/modular_computers/file_system/programs/file_browser.dm:138)
rt.def("/datum/computer_file/program/filemanager/proc/parse_tags", function parse_tags(f: Frame, t: Value) {
	f.vars = () => [t];
	return (t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[center]", "<center>"])), "[/center]", "</center>"])), "[br]", "<BR>"])), "\n", "<BR>"])), "[b]", "<B>"])), "[/b]", "</B>"])), "[i]", "<I>"])), "[/i]", "</I>"])), "[u]", "<U>"])), "[/u]", "</U>"])), "[time]", fmt("＀", [rt.call(f, P("/proc/worldtime2text"), null, [])])])), "[date]", fmt("＀ ＀", [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "realtime", rt.world()), "MMM DD"]), add(rt.gl("year_integer"), 540)])])), "[large]", "<font size=\"4\">"])), "[/large]", "</font>"])), "[h1]", "<H1>"])), "[/h1]", "</H1>"])), "[h2]", "<H2>"])), "[/h2]", "</H2>"])), "[h3]", "<H3>"])), "[/h3]", "</H3>"])), "[*]", "<li>"])), "[hr]", "<HR>"])), "[small]", "<font size = \"1\">"])), "[/small]", "</font>"])), "[list]", "<ul>"])), "[/list]", "</ul>"])), "[table]", "<table border=1 cellspacing=0 cellpadding=3 style='border: 1px solid black;'>"])), "[/table]", "</td></tr></table>"])), "[grid]", "<table>"])), "[/grid]", "</td></tr></table>"])), "[row]", "</td><tr>"])), "[tr]", "</td><tr>"])), "[td]", "<td>"])), "[cell]", "<td>"])), "[tab]", "&nbsp;&nbsp;&nbsp;&nbsp;"]));
	return f.dot;
});

// /datum/computer_file/program/filemanager/proc/prepare_printjob  (code/modules/modular_computers/file_system/programs/file_browser.dm:176)
rt.def("/datum/computer_file/program/filemanager/proc/prepare_printjob", function prepare_printjob(f: Frame, t: Value) {
	f.vars = () => [t];
	return (t = rt.callSrc(f, "parse_tags", [(t = rt.call(f, P("/proc/replacetext"), null, [(t = rt.call(f, P("/proc/replacetext"), null, [live(t), "[field]", "<span class=\"paper_field\"></span>"])), "[sign]", "<span class=\"paper_field\"></span>"]))]));
});

// /datum/computer_file/program/filemanager/proc/ui_data  (code/modules/modular_computers/file_system/programs/file_browser.dm:182)
rt.def("/datum/computer_file/program/filemanager/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, HDD: Value = null, RHDD: Value = null, file: Value = null, files: Value = null, F: Value = null, usbfiles: Value = null, F_5: Value = null;
	let $e: any;
	f.vars = () => [data, HDD, RHDD, file, files, F, usbfiles, F_5, $e];
	data = rt.callSrc(f, "get_header_data", []);
	HDD = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "HDD");
	RHDD = rt.index(rt.fv(f, "all_components", rt.sv(f, "computer")), "SDD");
	if (truthy(rt.sv(f, "error"))) {
		rt.setAt(live(data), "error", rt.sv(f, "error"));
	}
	if (truthy(rt.sv(f, "open_file"))) {
		file = null;
		if ((!truthy(rt.sv(f, "computer")) || !truthy(live(HDD)))) {
			rt.setAt(live(data), "error", "I/O ERROR: Unable to access hard drive.");
		} else {
			if (!truthy((rt.istype((file = rt.callName(f, live(HDD), "find_file_by_name", [rt.sv(f, "open_file")])), T("/datum/computer_file/data")) ? 1 : 0))) {
				rt.setAt(live(data), "error", "I/O ERROR: Unable to open file.");
			} else {
				rt.setAt(live(data), "filedata", rt.callSrc(f, "parse_tags", [rt.fv(f, "stored_data", live(file))]));
				rt.setAt(live(data), "filename", fmt("＀.＀", [rt.fv(f, "filename", live(file)), rt.fv(f, "filetype", live(file))]));
			}
		}
	} else {
		if ((!truthy(rt.sv(f, "computer")) || !truthy(live(HDD)))) {
			rt.setAt(live(data), "error", "I/O ERROR: Unable to access hard drive.");
		} else {
			files = rt.op(f, "CreateMultidimensionalList", [1], [0]);
			F = null;
			rt.forList(f, 0, rt.fv(f, "stored_files", live(HDD)), T("/datum/computer_file"));
			while (($e = rt.next(f, 0)) !== undefined) {
				F = $e;
				rt.callName(f, live(files), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "filename", live(F)), "type", rt.fv(f, "filetype", live(F)), "size", rt.fv(f, "size", live(F)), "undeletable", rt.fv(f, "undeletable", live(F))]))]);
			}
			rt.endFor(f, 0);
			rt.setAt(live(data), "files", live(files));
			if (truthy(live(RHDD))) {
				rt.setAt(live(data), "usbconnected", 1);
				usbfiles = rt.op(f, "CreateMultidimensionalList", [1], [0]);
				F_5 = null;
				rt.forList(f, 0, rt.fv(f, "stored_files", live(RHDD)), T("/datum/computer_file"));
				while (($e = rt.next(f, 0)) !== undefined) {
					F_5 = $e;
					rt.callName(f, live(usbfiles), "Add", [rt.list(rt.alist(f, ["name", rt.fv(f, "filename", live(F_5)), "type", rt.fv(f, "filetype", live(F_5)), "size", rt.fv(f, "size", live(F_5)), "undeletable", rt.fv(f, "undeletable", live(F_5))]))]);
				}
				rt.endFor(f, 0);
				rt.setAt(live(data), "usbfiles", live(usbfiles));
			}
		}
	}
	return live(data);
});
