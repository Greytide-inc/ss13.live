// Based on /tg/station's code/modules/power/monitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


rt.type(10429, "/obj/machinery/computer/monitor", "/obj/machinery/computer", {
	attached: null,
	history: null,
	record_size: 60,
	record_interval: 50,
	next_record: 0,
	icon_screen: "power",
	icon_keyboard: "power_key",
	light_color: "#E1E17D",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/powermonitor"),
	name: "power monitoring console",
	desc: "It monitors power levels across the station.",
	use_power: 2,
	idle_power_usage: 20,
	active_power_usage: 100,
});

// monitor.dm:14
rt.def("/obj/machinery/computer/monitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.history = list();
	return f.dot;
});

// monitor.dm:20
rt.def("/obj/machinery/computer/monitor/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* g.srcCall(f, "search");
	rt.setAt(this.history, "supply", list());
	rt.setAt(this.history, "demand", list());
	return f.dot;
}, true);

// monitor.dm:26
rt.def("/obj/machinery/computer/monitor/proc/process", function process(f: Frame) {
	if (!this.attached) {
		this.use_power = 1;
		rt.callSrc(f, "search", []);
	} else {
		this.use_power = 2;
		this.record();
	}
	return f.dot;
}, false, { waitfor: false });

// monitor.dm:34
rt.def("/obj/machinery/computer/monitor/proc/search", function search(f: Frame) {
	let _T: Value = rt.getStep(f, this, 0);
	this.attached = rt.locateIn(f, T("/obj/structure/cable"), _T);
	return f.dot;
});

// monitor.dm:38
rt.def("/obj/machinery/computer/monitor/proc/record", function record(f: Frame) {
	if (!(rt.worldTime(f) >= this.next_record)) return f.dot;
	this.next_record = rt.worldTime(f) + this.record_interval;
	let supply: Value = rt.at(this.history, "supply");
	if (this.attached.powernet) {
		supply += this.attached.powernet.viewavail;
	}
	if (rt.len(f, supply) > this.record_size) {
		supply.Cut(1, 2);
	}
	let demand: Value = rt.at(this.history, "demand");
	if (this.attached.powernet) {
		demand += this.attached.powernet.viewload;
	}
	if (!(rt.len(f, demand) > this.record_size)) return f.dot;
	demand.Cut(1, 2);
	return f.dot;
});

// monitor.dm:55
rt.def("/obj/machinery/computer/monitor/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "power_monitor", this.name, 1200, 1000, master_ui, state))).open();
	return f.dot;
}, true);

// monitor.dm:61
rt.def("/obj/machinery/computer/monitor/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, term: Value = null, A: Value = null, cell_charge: Value = null;
	let $e: any;
	rt.setAt((data = list()), "stored", this.record_size);
	rt.setAt(data, "interval", this.record_interval / 10);
	let $0: any = data;
	let $1: any = "attached";
	rt.setAt($0, $1, this.attached ? 1 : 0);
	rt.setAt(data, "history", this.history);
	rt.setAt(data, "areas", list());
	if (this.attached) {
		rt.setAt(data, "supply", this.attached.powernet.viewavail);
		rt.setAt(data, "demand", this.attached.powernet.viewload);
		for (term of each(this.attached.powernet.nodes, T("/obj/machinery/power/terminal"))) {
			if (rt.istype((A = term.master), T("/obj/machinery/power/apc"))) {
				cell_charge = null;
				if (!A.cell) {
					cell_charge = 0;
				} else {
					cell_charge = A.cell.percent();
				}
				rt.modAt(data, "areas", list(rt.alist(f, ["name", A.area.name, "charge", cell_charge, "load", A.lastused_total, "charging", A.charging, "eqp", A.equipment, "lgt", A.lighting, "env", A.environ])), add);
			}
		}
	}
	return data;
});
