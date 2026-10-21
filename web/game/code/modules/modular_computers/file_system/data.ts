// From code/modules/modular_computers/file_system/data.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4157, "/datum/computer_file/data", "/datum/computer_file", {
	stored_data: "",
	block_size: 250,
	do_not_edit: 0,
	filetype: "DAT",
});

// /datum/computer_file/data/proc/clone  (code/modules/modular_computers/file_system/data.dm:10)  may sleep
rt.def("/datum/computer_file/data/proc/clone", function* clone(f: Frame) {
	let temp: Value = null;
	f.vars = () => [temp];
	rt.setFv(f, "stored_data", (temp = (yield* g.callSuper(f, [], rt.Args.Same))), rt.sv(f, "stored_data"));
	return live(temp);
}, true);

// /datum/computer_file/data/proc/calculate_size  (code/modules/modular_computers/file_system/data.dm:16)
rt.def("/datum/computer_file/data/proc/calculate_size", function calculate_size(f: Frame) {
	rt.setSv(f, "size", rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/round"), null, [divide(rt.length(rt.sv(f, "stored_data")), rt.sv(f, "block_size"))])]));
	return f.dot;
});
