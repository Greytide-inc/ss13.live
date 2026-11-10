// Based on /tg/station's code/modules/modular_computers/file_system/data.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4157, "/datum/computer_file/data", "/datum/computer_file", {
	stored_data: "",
	block_size: 250,
	do_not_edit: 0,
	filetype: "DAT",
});

// data.dm:10
rt.def("/datum/computer_file/data/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	(temp = (yield* parent_proc())).stored_data = this.stored_data;
	return temp;
}, true);

// data.dm:16
rt.def("/datum/computer_file/data/proc/calculate_size", function calculate_size(f: Frame) {
	rt.setSv(f, "size", max(1, round(rt.length(this.stored_data) / this.block_size)));
	return f.dot;
});
