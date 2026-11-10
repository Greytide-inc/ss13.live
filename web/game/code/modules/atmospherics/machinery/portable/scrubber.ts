// Based on /tg/station's code/modules/atmospherics/machinery/portable/scrubber.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10704, "/obj/machinery/portable_atmospherics/scrubber", "/obj/machinery/portable_atmospherics", {
	on: 0,
	volume_rate: 1000,
	scrubbing: null,
	volume: 1000,
	name: "portable air scrubber",
	icon_state: "pscrubber:0",
	density: 1,
});

// scrubber.dm:13
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null;
	yield* (_T = rt.getStep(f, this, 0)).assume_air(this.air_contents);
	this.air_update_turf();
	return (yield* parent_proc());
}, true);

// scrubber.dm:19
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `pscrubber:${this.on}`;
	this.cut_overlays();
	if (this.holding) {
		this.add_overlay("scrubber-open");
	}
	if (!this.connected_port) return f.dot;
	this.add_overlay("scrubber-connector");
	return f.dot;
});

// scrubber.dm:28
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	if (!this.on) {
		return f.dot;
	}
	if (this.holding) {
		yield* this.scrub(this.holding.air_contents);
	} else {
		yield* this.scrub((_T = rt.getStep(f, this, 0)).return_air());
	}
	return f.dot;
}, true);

// scrubber.dm:39
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/scrub", function* scrub(f: Frame, mixture: Value) {
	let gas: Value = null;
	let transfer_moles: Value = min(1, this.volume_rate / mixture.volume) * mixture.total_moles();
	let filtering: Value = (yield* mixture.remove(transfer_moles));
	let filtered: Value = (yield* new_(T("/datum/gas_mixture")));
	if (!filtering) {
		return f.dot;
	}
	filtered.temperature = filtering.temperature;
	for (gas of each(rt.bitAnd(filtering.gases, this.scrubbing))) {
		filtered.add_gas(gas);
		rt.setAt(rt.index(filtered.gases, gas), 1, rt.index(rt.index(filtering.gases, gas), 1));
		rt.setAt(rt.index(filtering.gases, gas), 1, 0);
	}
	filtering.garbage_collect();
	yield* this.air_contents.merge(filtered);
	yield* mixture.merge(filtering);
	if (this.holding) return f.dot;
	this.air_update_turf();
	return f.dot;
}, true);

// scrubber.dm:59
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.is_operational()) {
		if (prob(50 / severity)) {
			this.on = (!this.on ? 1 : 0);
		}
		yield* this.update_icon();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// scrubber.dm:67
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "portable_scrubber", this.name, 420, 335, master_ui, state))).open();
	return f.dot;
}, true);

// scrubber.dm:73
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	let $0: any = data;
	let $1: any = "connected";
	rt.setAt($0, $1, this.connected_port ? 1 : 0);
	rt.setAt(data, "pressure", round(this.air_contents.return_pressure() ? this.air_contents.return_pressure() : 0));
	if (this.holding) {
		rt.setAt(data, "holding", list());
		rt.setAt(rt.at(data, "holding"), "name", this.holding.name);
		rt.setAt(rt.at(data, "holding"), "pressure", round(this.holding.air_contents.return_pressure()));
	}
	return data;
});

// scrubber.dm:85
rt.def("/obj/machinery/portable_atmospherics/scrubber/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "power") {
		this.on = (!this.on ? 1 : 0);
		f.dot = 1;
	} else if (action === "eject") {
		if (this.holding) {
			this.holding.loc = rt.getStep(f, this, 0);
			this.holding = null;
			f.dot = 1;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(10705, "/obj/machinery/portable_atmospherics/scrubber/huge", "/obj/machinery/portable_atmospherics/scrubber", {
	movable: 0,
	anchored: 1,
	volume_rate: 1500,
	volume: 50000,
	name: "huge air scrubber",
	icon_state: "scrubber:0",
	active_power_usage: 500,
	idle_power_usage: 10,
});

// scrubber.dm:114
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `scrubber:${this.on}`;
	return f.dot;
});

// scrubber.dm:117
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/process_atmos", function* process_atmos(f: Frame) {
	let AT: Value = null;
	let $e: any;
	if (!this.anchored && !this.movable || !this.is_operational()) {
		this.on = 0;
		yield* this.update_icon();
	}
	this.use_power = this.on ? 2 : 1;
	if (!this.on) {
		return f.dot;
	}
	yield* parent_proc();
	if (this.holding) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	for (AT of each((yield* _T.GetAtmosAdjacentTurfs({ alldir: 1 })), T("/turf"))) {
		yield* this.scrub(AT.return_air());
	}
	return f.dot;
}, true);

// scrubber.dm:131
rt.def("/obj/machinery/portable_atmospherics/scrubber/huge/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	if (yield* this.default_unfasten_wrench(user, W)) {
		if (!this.movable) {
			this.on = 0;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
