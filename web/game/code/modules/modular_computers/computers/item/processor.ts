// Based on /tg/station's code/modules/modular_computers/computers/item/processor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9414, "/obj/item/device/modular_computer/processor", "/obj/item/device/modular_computer", {
	machinery_computer: null,
	icon_state_unpowered: null,
	icon_state_menu: null,
	hardware_flag: 0,
	name: "processing unit",
	desc: "You shouldn't see this. If you do, report it.",
	icon: null,
	icon_state: null,
});

// processor.dm:14
rt.def("/obj/item/device/modular_computer/processor/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.machinery_computer && this.machinery_computer.cpu == this) {
		this.machinery_computer.cpu = null;
	}
	this.machinery_computer = null;
	return f.dot;
}, true);

// processor.dm:20
rt.def("/obj/item/device/modular_computer/processor/proc/New", function New(f: Frame, comp: Value) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (!comp || !rt.istype(comp, T("/obj/machinery/modular_computer"))) {
		CRASH("Inapropriate type passed to obj/item/device/modular_computer/processor/New()! Aborting.");
		return f.dot;
	}
	this.all_components = list();
	this.idle_threads = list();
	this.machinery_computer = comp;
	this.machinery_computer.cpu = this;
	this.hardware_flag = this.machinery_computer.hardware_flag;
	this.max_hardware_size = this.machinery_computer.max_hardware_size;
	this.steel_sheet_cost = this.machinery_computer.steel_sheet_cost;
	this.obj_integrity = this.machinery_computer.obj_integrity;
	this.max_integrity = this.machinery_computer.max_integrity;
	this.integrity_failure = this.machinery_computer.integrity_failure;
	this.base_active_power_usage = this.machinery_computer.base_active_power_usage;
	this.base_idle_power_usage = this.machinery_computer.base_idle_power_usage;
	return f.dot;
});

// processor.dm:40
rt.def("/obj/item/device/modular_computer/processor/proc/relay_qdel", function* relay_qdel(f: Frame) {
	yield* qdel(this.machinery_computer);
	return f.dot;
}, true);

// processor.dm:44
rt.def("/obj/item/device/modular_computer/processor/proc/update_icon", function* update_icon(f: Frame) {
	if (!this.machinery_computer) return f.dot;
	return (yield* this.machinery_computer.update_icon());
}, true);

// processor.dm:54
rt.def("/obj/item/device/modular_computer/processor/proc/shutdown_computer", function* shutdown_computer(f: Frame) {
	if (!this.machinery_computer) {
		return f.dot;
	}
	yield* parent_proc();
	yield* this.machinery_computer.update_icon();
	return f.dot;
}, true);

// processor.dm:61
rt.def("/obj/item/device/modular_computer/processor/proc/add_verb", function add_verb(f: Frame, path: Value) {
	if (path === "CARD") {
		this.machinery_computer.verbs += P("/obj/machinery/modular_computer/proc/eject_id");
	} else if (path === "SDD") {
		this.machinery_computer.verbs += P("/obj/machinery/modular_computer/proc/eject_disk");
	} else if (path === "AI") {
		this.machinery_computer.verbs += P("/obj/machinery/modular_computer/proc/eject_card");
	}
	return f.dot;
});

// processor.dm:70
rt.def("/obj/item/device/modular_computer/processor/proc/remove_verb", function remove_verb(f: Frame, path: Value) {
	if (path === "CARD") {
		this.machinery_computer.verbs -= P("/obj/machinery/modular_computer/proc/eject_id");
	} else if (path === "SDD") {
		this.machinery_computer.verbs -= P("/obj/machinery/modular_computer/proc/eject_disk");
	} else if (path === "AI") {
		this.machinery_computer.verbs -= P("/obj/machinery/modular_computer/proc/eject_card");
	}
	return f.dot;
});
