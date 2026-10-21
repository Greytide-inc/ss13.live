// From code/modules/modular_computers/hardware/hard_drive.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7586, "/obj/item/weapon/computer_hardware/hard_drive", "/obj/item/weapon/computer_hardware", {
	max_capacity: 128,
	used_capacity: 0,
	stored_files: null,
	power_usage: 25,
	critical: 1,
	device_type: "HDD",
	name: "hard disk drive",
	desc: "A small HDD, for use in basic computers where power efficiency is desired.",
	icon_state: "harddisk_mini",
	w_class: 1,
	origin_tech: "programming=1;engineering=1",
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/<init>  (code/modules/modular_computers/hardware/hard_drive.dm:12)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_files", rt.list());
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/on_remove  (code/modules/modular_computers/hardware/hard_drive.dm:15)  may sleep
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/on_remove", function* on_remove(f: Frame, MC: Value, user: Value) {
	f.vars = () => [MC, user];
	yield* g.callName(f, live(MC), "shutdown_computer", []);
	return f.dot;
}, true);

// /obj/item/weapon/computer_hardware/hard_drive/proc/install_default_programs  (code/modules/modular_computers/hardware/hard_drive.dm:18)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/install_default_programs", function install_default_programs(f: Frame) {
	rt.callSrc(f, "store_file", [rt.new_(f, T("/datum/computer_file/program/computerconfig"), [live(f.src)])]);
	rt.callSrc(f, "store_file", [rt.new_(f, T("/datum/computer_file/program/ntnetdownload"), [live(f.src)])]);
	rt.callSrc(f, "store_file", [rt.new_(f, T("/datum/computer_file/program/filemanager"), [live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/examine  (code/modules/modular_computers/hardware/hard_drive.dm:23)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has ＀ GQ of storage capacity.</span>", [rt.sv(f, "max_capacity")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/hard_drive/proc/diagnostics  (code/modules/modular_computers/hardware/hard_drive.dm:27)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/diagnostics", function diagnostics(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("NT-NFS File Table Status: ＀/999", [rt.len(f, rt.sv(f, "stored_files"))])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Storage capacity: ＀/＀GQ", [rt.sv(f, "used_capacity"), rt.sv(f, "max_capacity")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/computer_hardware/hard_drive/proc/store_file  (code/modules/modular_computers/hardware/hard_drive.dm:34)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/store_file", function store_file(f: Frame, F: Value) {
	if ((!truthy(live(F)) || !truthy((rt.istype(live(F), T("/datum/computer_file")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "can_store_file", [live(F)]))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_functionality", []))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "stored_files"))) {
		return 0;
	}
	if (truthy((rt.isIn(f, live(F), rt.sv(f, "stored_files")) ? 1 : 0))) {
		return 0;
	}
	rt.setFv(f, "holder", live(F), live(f.src));
	rt.callName(f, rt.sv(f, "stored_files"), "Add", [live(F)]);
	rt.callSrc(f, "recalculate_size", []);
	return 1;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/remove_file  (code/modules/modular_computers/hardware/hard_drive.dm:57)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/remove_file", function remove_file(f: Frame, F: Value) {
	if ((!truthy(live(F)) || !truthy((rt.istype(live(F), T("/datum/computer_file")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "stored_files"))) {
		return 0;
	}
	if (!truthy(rt.callSrc(f, "check_functionality", []))) {
		return 0;
	}
	if (truthy((rt.isIn(f, live(F), rt.sv(f, "stored_files")) ? 1 : 0))) {
		(rt.modSrcVar(f, "stored_files", live(F), subtract));
		rt.callSrc(f, "recalculate_size", []);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/recalculate_size  (code/modules/modular_computers/hardware/hard_drive.dm:76)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/recalculate_size", function recalculate_size(f: Frame) {
	let total_size: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [total_size, F, $e];
	total_size = 0;
	F = null;
	rt.forList(f, 0, rt.sv(f, "stored_files"), T("/datum/computer_file"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		total_size = rt.modify(live(total_size), rt.fv(f, "size", live(F)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "used_capacity", live(total_size));
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/can_store_file  (code/modules/modular_computers/hardware/hard_drive.dm:83)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/can_store_file", function can_store_file(f: Frame, F: Value) {
	let name: Value = null, file: Value = null;
	let $e: any;
	f.vars = () => [name, file, $e];
	if ((!truthy(live(F)) || !truthy((rt.istype(live(F), T("/datum/computer_file")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy((rt.isIn(f, live(F), rt.sv(f, "stored_files")) ? 1 : 0))) {
		return 0;
	}
	name = add(add(rt.fv(f, "filename", live(F)), "."), rt.fv(f, "filetype", live(F)));
	file = null;
	rt.forList(f, 0, rt.sv(f, "stored_files"), T("/datum/computer_file"));
	while (($e = rt.next(f, 0)) !== undefined) {
		file = $e;
		if (isEqual(add(add(rt.fv(f, "filename", live(file)), "."), rt.fv(f, "filetype", live(file))), live(name))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	if (rt.ge(rt.len(f, rt.sv(f, "stored_files")), 999)) {
		return 0;
	}
	if (rt.gt(add(rt.sv(f, "used_capacity"), rt.fv(f, "size", live(F))), rt.sv(f, "max_capacity"))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/find_file_by_name  (code/modules/modular_computers/hardware/hard_drive.dm:106)
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/find_file_by_name", function find_file_by_name(f: Frame, filename: Value) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	if (!truthy(rt.callSrc(f, "check_functionality", []))) {
		return null;
	}
	if (!truthy(live(filename))) {
		return null;
	}
	if (!truthy(rt.sv(f, "stored_files"))) {
		return null;
	}
	F = null;
	rt.forList(f, 0, rt.sv(f, "stored_files"), T("/datum/computer_file"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (isEqual(rt.fv(f, "filename", live(F)), live(filename))) {
			return live(F);
		}
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/item/weapon/computer_hardware/hard_drive/proc/Destroy  (code/modules/modular_computers/hardware/hard_drive.dm:122)  may sleep
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "stored_files", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/computer_hardware/hard_drive/proc/New  (code/modules/modular_computers/hardware/hard_drive.dm:125)  may sleep
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "install_default_programs");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
