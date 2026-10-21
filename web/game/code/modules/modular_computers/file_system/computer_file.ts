// From code/modules/modular_computers/file_system/computer_file.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4156, "/datum/computer_file", "/datum", {
	filename: "NewFile",
	filetype: "XXX",
	size: 1,
	holder: null,
	unsendable: 0,
	undeletable: 0,
	uid: null,
}, { global: { file_uid: 674 } });

// /datum/computer_file/proc/New  (code/modules/modular_computers/file_system/computer_file.dm:12)
rt.def("/datum/computer_file/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "uid", rt.incGl("file_uid", 1, true));
	return f.dot;
});

// /datum/computer_file/proc/Destroy  (code/modules/modular_computers/file_system/computer_file.dm:16)  may sleep
rt.def("/datum/computer_file/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(rt.sv(f, "holder"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.callName(f, rt.sv(f, "holder"), "remove_file", [live(f.src)]);
	if ((truthy(rt.fv(f, "holder", rt.sv(f, "holder"))) && isEqual(rt.gv(f, "active_program", rt.fv(f, "holder", rt.sv(f, "holder"))), live(f.src)))) {
		yield* g.callName(f, rt.fv(f, "holder", rt.sv(f, "holder")), "kill_program", ["forced", 1], rt.Args.Named);
	}
	rt.setSv(f, "holder", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/computer_file/proc/clone  (code/modules/modular_computers/file_system/computer_file.dm:28)  may sleep
rt.def("/datum/computer_file/proc/clone", function* clone(f: Frame, rename: Value) {
	let temp: Value = null;
	f.vars = () => [rename, temp];
	if (live(rename) === null) {
		rename = 0;
	}
	rt.setFv(f, "unsendable", (temp = (yield* g.new_(f, rt.sv(f, "type"), []))), rt.sv(f, "unsendable"));
	rt.setFv(f, "undeletable", live(temp), rt.sv(f, "undeletable"));
	rt.setFv(f, "size", live(temp), rt.sv(f, "size"));
	if (truthy(live(rename))) {
		rt.setFv(f, "filename", live(temp), add(rt.sv(f, "filename"), "(Copy)"));
	} else {
		rt.setFv(f, "filename", live(temp), rt.sv(f, "filename"));
	}
	rt.setFv(f, "filetype", live(temp), rt.sv(f, "filetype"));
	return live(temp);
}, true);
