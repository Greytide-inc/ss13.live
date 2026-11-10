// Based on /tg/station's code/modules/modular_computers/file_system/programs/file_browser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// file_browser.dm:16
rt.def("/datum/computer_file/program/filemanager/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let newname: Value = null, F: Value = null, file: Value = null, F_3: Value = null, C: Value = null, newname_4: Value = null, newtext: Value = null, backup: Value = null;
	let $0: any, $1: any;
	if (yield* parent_proc()) {
		return 1;
	}
	let HDD: Value = rt.index(this.computer.all_components, "HDD");
	let RHDD: Value = rt.index(this.computer.all_components, "SDD");
	let printer: Value = rt.index(this.computer.all_components, "PRINT");
	if (action === "PRG_openfile") {
		f.dot = 1;
		this.open_file = rt.at(params, "name");
	} else if (action === "PRG_newtextfile") {
		f.dot = 1;
		if (!(newname = (yield* stripped_input(f.usr, "Enter file name or leave blank to cancel:", "File rename", { max_length: 50 })))) {
			return 1;
		}
		if (!HDD) {
			return 1;
		}
		(F = (yield* new_(T("/datum/computer_file/data")))).filename = newname;
		F.filetype = "TXT";
		HDD.store_file(F);
	} else if (action === "PRG_deletefile") {
		f.dot = 1;
		if (!HDD) {
			return 1;
		}
		if (!(file = HDD.find_file_by_name(rt.at(params, "name"))) || file.undeletable) {
			return 1;
		}
		HDD.remove_file(file);
	} else if (action === "PRG_usbdeletefile") {
		f.dot = 1;
		if (!RHDD) {
			return 1;
		}
		if (!(file = RHDD.find_file_by_name(rt.at(params, "name"))) || file.undeletable) {
			return 1;
		}
		RHDD.remove_file(file);
	} else if (action === "PRG_closefile") {
		f.dot = 1;
		this.open_file = null;
		this.error = null;
	} else if (action === "PRG_clone") {
		f.dot = 1;
		if (!HDD) {
			return 1;
		}
		if (!(F_3 = HDD.find_file_by_name(rt.at(params, "name"))) || !rt.istype(F_3, T("/datum/computer_file"))) {
			return 1;
		}
		C = (yield* F_3.clone(1));
		HDD.store_file(C);
	} else if (action === "PRG_rename") {
		f.dot = 1;
		if (!HDD) {
			return 1;
		}
		if (!(file = HDD.find_file_by_name(rt.at(params, "name"))) || !rt.istype(file, T("/datum/computer_file"))) {
			return 1;
		}
		newname_4 = (yield* stripped_input(f.usr, "Enter new file name:", "File rename", file.filename, { max_length: 50 }));
		if (file && newname_4) {
			file.filename = newname_4;
		}
	} else if (action === "PRG_edit") {
		f.dot = 1;
		if (!this.open_file) {
			return 1;
		}
		if (!HDD) {
			return 1;
		}
		if (!(F_3 = HDD.find_file_by_name(this.open_file)) || !rt.istype(F_3, T("/datum/computer_file/data"))) {
			return 1;
		}
		if (F_3.do_not_edit && (yield* alert("WARNING: This file is not compatible with editor. Editing it may result in permanently corrupted formatting or damaged data consistency. Edit anyway?", "Incompatible File", "No", "Yes")) == "No") {
			return 1;
		}
		if (!(newtext = (yield* stripped_multiline_input(f.usr, `Editing file ${this.open_file}. You may use most tags used in paper formatting:`, "Text Editor", html_decode(F_3.stored_data), 16384, 1)))) {
			return f.dot;
		}
		if (F_3) {
			backup = (yield* F_3.clone());
			HDD.remove_file(F_3);
			F_3.stored_data = newtext;
			F_3.calculate_size();
			if (!HDD.store_file(F_3)) {
				this.error = `I/O error: Unable to overwrite file. Hard drive is probably full. You may want to backup your changes before closing this window:<br><br>${F_3.stored_data}<br><br>`;
				HDD.store_file(backup);
			}
		}
	} else if (action === "PRG_printfile") {
		f.dot = 1;
		if (!this.open_file) {
			return 1;
		}
		if (!HDD) {
			return 1;
		}
		if (!(F_3 = HDD.find_file_by_name(this.open_file)) || !rt.istype(F_3, T("/datum/computer_file/data"))) {
			return 1;
		}
		if (!printer) {
			this.error = "Missing Hardware: Your computer does not have required hardware to complete this operation.";
			return 1;
		}
		$0 = printer;
		if (this.computer.emagged) {
			$1 = "Comic Sans MS";
		} else {
			$1 = "Times New Roman";
		}
		if (!(yield* $0.print_text(`<font face="${$1}">` + this.prepare_printjob(F_3.stored_data) + "</font>", this.open_file))) {
			this.error = "Hardware error: Printer was unable to print the file. It may be out of paper.";
			return 1;
		}
	} else if (action === "PRG_copytousb") {
		f.dot = 1;
		if (!HDD || !RHDD) {
			return 1;
		}
		if (!(F_3 = HDD.find_file_by_name(rt.at(params, "name"))) || !rt.istype(F_3, T("/datum/computer_file"))) {
			return 1;
		}
		C = (yield* F_3.clone(0));
		RHDD.store_file(C);
	} else if (action === "PRG_copyfromusb") {
		f.dot = 1;
		if (!HDD || !RHDD) {
			return 1;
		}
		if (!(F_3 = RHDD.find_file_by_name(rt.at(params, "name"))) || !rt.istype(F_3, T("/datum/computer_file"))) {
			return 1;
		}
		C = (yield* F_3.clone(0));
		HDD.store_file(C);
	}
	return f.dot;
}, true);

// file_browser.dm:138
rt.def("/datum/computer_file/program/filemanager/proc/parse_tags", function parse_tags(f: Frame, t: Value) {
	return (t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext((t = replacetext(t, "[center]", "<center>")), "[/center]", "</center>")), "[br]", "<BR>")), "\n", "<BR>")), "[b]", "<B>")), "[/b]", "</B>")), "[i]", "<I>")), "[/i]", "</I>")), "[u]", "<U>")), "[/u]", "</U>")), "[time]", `${worldtime2text()}`)), "[date]", `${time2text(rt.world().realtime, "MMM DD")} ${GLOB.year_integer + 540}`)), "[large]", "<font size=\"4\">")), "[/large]", "</font>")), "[h1]", "<H1>")), "[/h1]", "</H1>")), "[h2]", "<H2>")), "[/h2]", "</H2>")), "[h3]", "<H3>")), "[/h3]", "</H3>")), "[*]", "<li>")), "[hr]", "<HR>")), "[small]", "<font size = \"1\">")), "[/small]", "</font>")), "[list]", "<ul>")), "[/list]", "</ul>")), "[table]", "<table border=1 cellspacing=0 cellpadding=3 style='border: 1px solid black;'>")), "[/table]", "</td></tr></table>")), "[grid]", "<table>")), "[/grid]", "</td></tr></table>")), "[row]", "</td><tr>")), "[tr]", "</td><tr>")), "[td]", "<td>")), "[cell]", "<td>")), "[tab]", "&nbsp;&nbsp;&nbsp;&nbsp;"));
});

// file_browser.dm:176
rt.def("/datum/computer_file/program/filemanager/proc/prepare_printjob", function prepare_printjob(f: Frame, t: Value) {
	return (t = this.parse_tags((t = replacetext((t = replacetext(t, "[field]", "<span class=\"paper_field\"></span>")), "[sign]", "<span class=\"paper_field\"></span>"))));
});

// file_browser.dm:182
rt.def("/datum/computer_file/program/filemanager/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let file: Value = null, files: Value = null, F: Value = null, usbfiles: Value = null, F_5: Value = null;
	let data: Value = this.get_header_data();
	let HDD: Value = rt.index(this.computer.all_components, "HDD");
	let RHDD: Value = rt.index(this.computer.all_components, "SDD");
	if (this.error) {
		rt.setAt(data, "error", this.error);
	}
	if (this.open_file) {
		if (!this.computer || !HDD) {
			rt.setAt(data, "error", "I/O ERROR: Unable to access hard drive.");
		} else if (!rt.istype((file = HDD.find_file_by_name(this.open_file)), T("/datum/computer_file/data"))) {
			rt.setAt(data, "error", "I/O ERROR: Unable to open file.");
		} else {
			rt.setAt(data, "filedata", this.parse_tags(file.stored_data));
			rt.setAt(data, "filename", `${file.filename}.${file.filetype}`);
		}
	} else if (!this.computer || !HDD) {
		rt.setAt(data, "error", "I/O ERROR: Unable to access hard drive.");
	} else {
		files = rt.op(f, "CreateMultidimensionalList", [1], [0]);
		for (F of each(HDD.stored_files, T("/datum/computer_file"))) {
			files.Add(list(rt.alist(f, ["name", F.filename, "type", F.filetype, "size", rt.fv(f, "size", F), "undeletable", F.undeletable])));
		}
		rt.setAt(data, "files", files);
		if (RHDD) {
			rt.setAt(data, "usbconnected", 1);
			usbfiles = rt.op(f, "CreateMultidimensionalList", [1], [0]);
			for (F_5 of each(RHDD.stored_files, T("/datum/computer_file"))) {
				usbfiles.Add(list(rt.alist(f, ["name", F_5.filename, "type", F_5.filetype, "size", rt.fv(f, "size", F_5), "undeletable", F_5.undeletable])));
			}
			rt.setAt(data, "usbfiles", usbfiles);
		}
	}
	return data;
});
