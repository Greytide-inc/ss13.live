// Based on /tg/station's code/modules/modular_computers/file_system/computer_file.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(4156, "/datum/computer_file", "/datum", {
	filename: "NewFile",
	filetype: "XXX",
	size: 1,
	holder: null,
	unsendable: 0,
	undeletable: 0,
	uid: null,
}, { global: { file_uid: 674 } });

// computer_file.dm:12
rt.def("/datum/computer_file/proc/New", function New(f: Frame) {
	parent_proc();
	this.uid = rt.incGl("file_uid", 1, true);
	return f.dot;
});

// computer_file.dm:16
rt.def("/datum/computer_file/proc/Destroy", function* Destroy(f: Frame) {
	if (!this.holder) {
		return (yield* parent_proc());
	}
	this.holder.remove_file(this);
	if (this.holder.holder && this.holder.holder.active_program == this) {
		yield* this.holder.holder.kill_program({ forced: 1 });
	}
	this.holder = null;
	return (yield* parent_proc());
}, true);

// computer_file.dm:28
rt.def("/datum/computer_file/proc/clone", function* clone(f: Frame, rename: Value) {
	let temp: Value = null;
	rename ??= 0;
	(temp = (yield* new_(this.type))).unsendable = this.unsendable;
	temp.undeletable = this.undeletable;
	rt.setFv(f, "size", temp, rt.sv(f, "size"));
	if (rename) {
		temp.filename = this.filename + "(Copy)";
	} else {
		temp.filename = this.filename;
	}
	temp.filetype = this.filetype;
	return temp;
}, true);
