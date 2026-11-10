// Based on /tg/station's code/datums/wires/airlock.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1060, "/datum/wires/airlock", "/datum/wires", {
	holder_type: rt.typePath("/obj/machinery/door/airlock"),
	proper_name: "Airlock",
});

// airlock.dm:16
rt.def("/datum/wires/airlock/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("Main Power 1", "Main Power 2", "Auxiliary Power 1", "Auxiliary Power 2", "Open", "Bolts", "ID Scan", "AI Connection", "High Voltage Ground", "Safety", "Timing", "Bolt Lights", "High Voltage Circuit 1", "High Voltage Circuit 2");
	this.add_duds(2);
	parent_proc();
	return f.dot;
}, false);

// airlock.dm:20
rt.def("/datum/wires/airlock/proc/interactable", function* interactable(f: Frame, user: Value) {
	let A: Value = this.holder;
	if (!rt.istype(user, T("/mob/living/silicon")) && A.isElectrified() && (yield* A.shock(user, 100))) {
		return 0;
	}
	if (!A.panel_open) return f.dot;
	return 1;
}, true);

// airlock.dm:27
rt.def("/datum/wires/airlock/proc/get_status", function get_status(f: Frame) {
	let A: Value = this.holder;
	let status: Value = list();
	status += `The door bolts ${A.locked ? "have fallen!" : "look up."}`;
	status += `The test light is ${A.hasPower() ? "on" : "off"}.`;
	status += `The AI connection light is ${A.aiControlDisabled || A.emagged ? "off" : "on"}.`;
	status += `The check wiring light is ${A.safe ? "off" : "on"}.`;
	status += `The timer is powered ${A.autoclose ? "on" : "off"}.`;
	status += `The speed light is ${A.normalspeed ? "on" : "off"}.`;
	return (status += `The emergency light is ${A.emergency ? "on" : "off"}.`);
});

// airlock.dm:40
rt.def("/datum/wires/airlock/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let A: Value = this.holder;
	if (wire === "Main Power 1" || wire === "Main Power 2") {
		A.loseMainPower();
	} else if (wire === "Auxiliary Power 1" || wire === "Auxiliary Power 2") {
		A.loseBackupPower();
	} else if (wire === "Open") {
		if (A.emagged) {
			return f.dot;
		}
		if (!A.requiresID() || A.check_access(null)) {
			if (A.density) {
				yield* A.open();
			} else {
				yield* A.close();
			}
		}
	} else if (wire === "Bolts") {
		if (!A.locked) {
			A.bolt();
			A.audible_message("<span class='italics'>You hear a click from the bottom of the door.</span>", null, 1);
		} else if (A.hasPower()) {
			A.unbolt();
			A.audible_message("<span class='italics'>You hear a click from the bottom of the door.</span>", null, 1);
		}
		yield* A.update_icon();
	} else if (wire === "ID Scan") {
		if (A.hasPower() && A.density) {
			yield* A.do_animate("deny");
			if (A.emergency) {
				A.emergency = 0;
				yield* A.update_icon();
			}
		}
	} else if (wire === "AI Connection") {
		if (A.aiControlDisabled == 0) {
			A.aiControlDisabled = 1;
		} else if (A.aiControlDisabled == -1) {
			A.aiControlDisabled = 2;
		}
		yield* sleep(10);
		if (A) {
			if (A.aiControlDisabled == 1) {
				A.aiControlDisabled = 0;
			} else if (A.aiControlDisabled == 2) {
				A.aiControlDisabled = -1;
			}
		}
	} else if (wire === "High Voltage Ground") {
		if (!A.secondsElectrified) {
			A.set_electrified(30);
			if (f.usr) {
				A.shockedby += `[${time_stamp()}]${f.usr}(ckey:${f.usr.ckey})`;
			}
			add_logs(f.usr, A, "electrified");
			yield* sleep(10);
			if (A) {
				while (A.secondsElectrified > 0) {
					A.secondsElectrified -= 1;
					if (A.secondsElectrified < 0) {
						A.set_electrified(0);
					}
					yield* sleep(10);
				}
			}
		}
	} else if (wire === "Safety") {
		A.safe = (!A.safe ? 1 : 0);
		if (!A.density) {
			yield* A.close();
		}
	} else if (wire === "Timing") {
		A.normalspeed = (!A.normalspeed ? 1 : 0);
	} else if (wire === "Bolt Lights") {
		A.lights = (!A.lights ? 1 : 0);
		yield* A.update_icon();
	}
	return f.dot;
}, true, { waitfor: false });

// airlock.dm:104
rt.def("/datum/wires/airlock/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let A: Value = this.holder;
	if (wire === "Main Power 1" || wire === "Main Power 2") {
		if (mend && !this.is_cut("Main Power 1") && !this.is_cut("Main Power 2")) {
			A.regainMainPower();
			if (f.usr) {
				yield* A.shock(f.usr, 50);
			}
		} else {
			A.loseMainPower();
			if (f.usr) {
				yield* A.shock(f.usr, 50);
			}
		}
	} else if (wire === "Auxiliary Power 1" || wire === "Auxiliary Power 2") {
		if (mend && !this.is_cut("Auxiliary Power 1") && !this.is_cut("Auxiliary Power 2")) {
			A.regainBackupPower();
			if (f.usr) {
				yield* A.shock(f.usr, 50);
			}
		} else {
			A.loseBackupPower();
			if (f.usr) {
				yield* A.shock(f.usr, 50);
			}
		}
	} else if (wire === "Bolts") {
		if (!mend) {
			A.bolt();
		}
	} else if (wire === "AI Connection") {
		if (mend) {
			if (A.aiControlDisabled == 1) {
				A.aiControlDisabled = 0;
			} else if (A.aiControlDisabled == 2) {
				A.aiControlDisabled = -1;
			}
		} else if (A.aiControlDisabled == 0) {
			A.aiControlDisabled = 1;
		} else if (A.aiControlDisabled == -1) {
			A.aiControlDisabled = 2;
		}
	} else if (wire === "High Voltage Ground") {
		if (mend) {
			if (A.secondsElectrified) {
				A.set_electrified(0);
			}
		} else if (A.secondsElectrified != -1) {
			A.set_electrified(-1);
			if (f.usr) {
				A.shockedby += `[${time_stamp()}]${f.usr}(ckey:${f.usr.ckey})`;
			}
			add_logs(f.usr, A, "electrified");
		}
	} else if (wire === "Safety") {
		A.safe = mend;
	} else if (wire === "Timing") {
		A.autoclose = mend;
		if (A.autoclose && !A.density) {
			yield* A.close();
		}
	} else if (wire === "Bolt Lights") {
		A.lights = mend;
		yield* A.update_icon();
	} else if (wire === "High Voltage Circuit 1" || wire === "High Voltage Circuit 2") {
		yield* A.shock(f.usr, 50);
	}
	return f.dot;
}, true);
