// Based on /tg/station's code/datums/wires/particle_accelerator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1071, "/datum/wires/particle_accelerator/control_box", "/datum/wires/particle_accelerator", {
	holder_type: rt.typePath("/obj/machinery/particle_accelerator/control_box"),
	proper_name: "Particle Accelerator",
});

// particle_accelerator.dm:10
rt.def("/datum/wires/particle_accelerator/control_box/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Power", "Strength", "Limiter", "Interface");
	this.add_duds(2);
	parent_proc();
	return f.dot;
}, false);

// particle_accelerator.dm:14
rt.def("/datum/wires/particle_accelerator/control_box/proc/interactable", function interactable(f: Frame, user: Value) {
	let C: Value = null;
	if ((C = this.holder).construction_state != 2) return f.dot;
	return 1;
});

// particle_accelerator.dm:19
rt.def("/datum/wires/particle_accelerator/control_box/proc/on_pulse", function on_pulse(f: Frame, wire: Value) {
	let C: Value = this.holder;
	if (wire === "Power") {
		C.toggle_power();
	} else if (wire === "Strength") {
		C.add_strength();
	} else if (wire === "Interface") {
		C.interface_control = (!C.interface_control ? 1 : 0);
	} else if (wire === "Limiter") {
		C.visible_message(`${bicon(C)}<b>${C}</b> makes a large whirring noise.`);
	}
	return f.dot;
});

// particle_accelerator.dm:31
rt.def("/datum/wires/particle_accelerator/control_box/proc/on_cut", function on_cut(f: Frame, wire: Value, mend: Value) {
	let i: Value = null;
	let C: Value = this.holder;
	if (wire === "Power") {
		if (C.active == (!mend ? 1 : 0)) {
			C.toggle_power();
		}
	} else if (wire === "Strength") {
		i = 1;
		while (i < 3) {
			C.remove_strength();
			i++;
		}
	} else if (wire === "Interface") {
		if (!mend) {
			C.interface_control = 0;
		}
	} else if (wire === "Limiter") {
		C.strength_upper_limit = mend ? 2 : 3;
		if (!(C.strength_upper_limit < C.strength)) return f.dot;
		C.remove_strength();
	}
	return f.dot;
});
