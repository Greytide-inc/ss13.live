// From code/modules/modular_computers/computers/item/processor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/modular_computer/processor/proc/Destroy  (code/modules/modular_computers/computers/item/processor.dm:14)  may sleep
rt.def("/obj/item/device/modular_computer/processor/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy(rt.sv(f, "machinery_computer")) && isEqual(rt.fv(f, "cpu", rt.sv(f, "machinery_computer")), live(f.src)))) {
		rt.setFv(f, "cpu", rt.sv(f, "machinery_computer"), null);
	}
	rt.setSv(f, "machinery_computer", null);
	return f.dot;
}, true);

// /obj/item/device/modular_computer/processor/proc/New  (code/modules/modular_computers/computers/item/processor.dm:20)
rt.def("/obj/item/device/modular_computer/processor/proc/New", function New(f: Frame, comp: Value) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if ((!truthy(live(comp)) || !truthy((rt.istype(live(comp), T("/obj/machinery/modular_computer")) ? 1 : 0)))) {
		rt.call(f, P("/proc/CRASH"), null, ["Inapropriate type passed to obj/item/device/modular_computer/processor/New()! Aborting."]);
		return live(f.dot);
	}
	rt.setSv(f, "all_components", rt.list());
	rt.setSv(f, "idle_threads", rt.list());
	rt.setSv(f, "machinery_computer", live(comp));
	rt.setFv(f, "cpu", rt.sv(f, "machinery_computer"), live(f.src));
	rt.setSv(f, "hardware_flag", rt.fv(f, "hardware_flag", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "max_hardware_size", rt.fv(f, "max_hardware_size", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "steel_sheet_cost", rt.fv(f, "steel_sheet_cost", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "obj_integrity", rt.fv(f, "obj_integrity", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "max_integrity", rt.fv(f, "max_integrity", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "integrity_failure", rt.fv(f, "integrity_failure", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "base_active_power_usage", rt.fv(f, "base_active_power_usage", rt.sv(f, "machinery_computer")));
	rt.setSv(f, "base_idle_power_usage", rt.fv(f, "base_idle_power_usage", rt.sv(f, "machinery_computer")));
	return f.dot;
});

// /obj/item/device/modular_computer/processor/proc/relay_qdel  (code/modules/modular_computers/computers/item/processor.dm:40)  may sleep
rt.def("/obj/item/device/modular_computer/processor/proc/relay_qdel", function* relay_qdel(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "machinery_computer")]);
	return f.dot;
}, true);

// /obj/item/device/modular_computer/processor/proc/update_icon  (code/modules/modular_computers/computers/item/processor.dm:44)  may sleep
rt.def("/obj/item/device/modular_computer/processor/proc/update_icon", function* update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "machinery_computer"))) return f.dot;
	return (yield* g.callName(f, rt.sv(f, "machinery_computer"), "update_icon", []));
}, true);

// /obj/item/device/modular_computer/processor/proc/shutdown_computer  (code/modules/modular_computers/computers/item/processor.dm:54)  may sleep
rt.def("/obj/item/device/modular_computer/processor/proc/shutdown_computer", function* shutdown_computer(f: Frame) {
	if (!truthy(rt.sv(f, "machinery_computer"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "machinery_computer"), "update_icon", []);
	return live(f.dot);
}, true);

// /obj/item/device/modular_computer/processor/proc/add_verb  (code/modules/modular_computers/computers/item/processor.dm:61)
rt.def("/obj/item/device/modular_computer/processor/proc/add_verb", function add_verb(f: Frame, path: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(path);
	if ($0 === "CARD") {
		rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_id"), add);
	} else if ($0 === "SDD") {
		rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_disk"), add);
	} else if ($0 === "AI") {
		rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_card"), add);
	}
	return f.dot;
});

// /obj/item/device/modular_computer/processor/proc/remove_verb  (code/modules/modular_computers/computers/item/processor.dm:70)
rt.def("/obj/item/device/modular_computer/processor/proc/remove_verb", function remove_verb(f: Frame, path: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(path);
	if ($0 === "CARD") {
		(rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_id"), subtract));
	} else if ($0 === "SDD") {
		(rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_disk"), subtract));
	} else if ($0 === "AI") {
		(rt.modField(f, rt.sv(f, "machinery_computer"), "verbs", P("/obj/machinery/modular_computer/proc/eject_card"), subtract));
	}
	return f.dot;
});
