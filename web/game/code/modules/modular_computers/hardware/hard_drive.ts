// Based on /tg/station's code/modules/modular_computers/hardware/hard_drive.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// hard_drive.dm:12
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stored_files = list();
	return f.dot;
});

// hard_drive.dm:15
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/on_remove", function* on_remove(f: Frame, MC: Value, user: Value) {
	yield* MC.shutdown_computer();
	return f.dot;
}, true);

// hard_drive.dm:18
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/install_default_programs", function install_default_programs(f: Frame) {
	this.store_file(new_(T("/datum/computer_file/program/computerconfig"), this));
	this.store_file(new_(T("/datum/computer_file/program/ntnetdownload"), this));
	this.store_file(new_(T("/datum/computer_file/program/filemanager"), this));
	return f.dot;
});

// hard_drive.dm:23
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>It has ${this.max_capacity} GQ of storage capacity.</span>`);
	return f.dot;
}, false);

// hard_drive.dm:27
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/diagnostics", function diagnostics(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `NT-NFS File Table Status: ${rt.len(f, this.stored_files)}/999`);
	to_chat(user, `Storage capacity: ${this.used_capacity}/${this.max_capacity}GQ`);
	return f.dot;
}, false);

// hard_drive.dm:34
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/store_file", function store_file(f: Frame, F: Value) {
	if (!F || !rt.istype(F, T("/datum/computer_file"))) {
		return 0;
	}
	if (!this.can_store_file(F)) {
		return 0;
	}
	if (!this.check_functionality()) {
		return 0;
	}
	if (!this.stored_files) {
		return 0;
	}
	if (rt.isIn(f, F, this.stored_files)) {
		return 0;
	}
	F.holder = this;
	this.stored_files.Add(F);
	this.recalculate_size();
	return 1;
});

// hard_drive.dm:57
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/remove_file", function remove_file(f: Frame, F: Value) {
	if (!F || !rt.istype(F, T("/datum/computer_file"))) {
		return 0;
	}
	if (!this.stored_files) {
		return 0;
	}
	if (!this.check_functionality()) {
		return 0;
	}
	if (rt.isIn(f, F, this.stored_files)) {
		this.stored_files -= F;
		this.recalculate_size();
		return 1;
	} else {
		return 0;
	}
});

// hard_drive.dm:76
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/recalculate_size", function recalculate_size(f: Frame) {
	let F: Value = null;
	let total_size: Value = 0;
	for (F of each(this.stored_files, T("/datum/computer_file"))) {
		total_size += rt.fv(f, "size", F);
	}
	this.used_capacity = total_size;
	return f.dot;
});

// hard_drive.dm:83
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/can_store_file", function can_store_file(f: Frame, F: Value) {
	let file: Value = null;
	if (!F || !rt.istype(F, T("/datum/computer_file"))) {
		return 0;
	}
	if (rt.isIn(f, F, this.stored_files)) {
		return 0;
	}
	let name: Value = F.filename + "." + F.filetype;
	for (file of each(this.stored_files, T("/datum/computer_file"))) {
		if (file.filename + "." + file.filetype == name) {
			return 0;
		}
	}
	if (rt.len(f, this.stored_files) >= 999) {
		return 0;
	}
	if (this.used_capacity + rt.fv(f, "size", F) > this.max_capacity) {
		return 0;
	} else {
		return 1;
	}
});

// hard_drive.dm:106
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/find_file_by_name", function find_file_by_name(f: Frame, filename: Value) {
	let F: Value = null;
	if (!this.check_functionality()) {
		return null;
	}
	if (!filename) {
		return null;
	}
	if (!this.stored_files) {
		return null;
	}
	for (F of each(this.stored_files, T("/datum/computer_file"))) {
		if (F.filename == filename) {
			return F;
		}
	}
	return null;
});

// hard_drive.dm:122
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/Destroy", function* Destroy(f: Frame) {
	this.stored_files = null;
	return (yield* parent_proc());
}, true);

// hard_drive.dm:125
rt.def("/obj/item/weapon/computer_hardware/hard_drive/proc/New", function* New(f: Frame) {
	this.install_default_programs();
	yield* parent_proc();
	return f.dot;
}, true);
