// Based on /tg/station's code/datums/wires/robot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(1074, "/datum/wires/robot", "/datum/wires", {
	holder_type: rt.typePath("/mob/living/silicon/robot"),
	randomize: 1,
});

// robot.dm:11
rt.def("/datum/wires/robot/proc/New", function New(f: Frame, holder: Value) {
	this.wires = list("AI Connection", "Camera", "AI Law Synchronization", "Lockdown", "Reset Module");
	this.add_duds(2);
	parent_proc();
	return f.dot;
}, false);

// robot.dm:15
rt.def("/datum/wires/robot/proc/interactable", function interactable(f: Frame, user: Value) {
	let R: Value = null;
	if (!(R = this.holder).wiresexposed) return f.dot;
	return 1;
});

// robot.dm:20
rt.def("/datum/wires/robot/proc/get_status", function get_status(f: Frame) {
	let R: Value = this.holder;
	let status: Value = list();
	status += `The law sync module is ${R.lawupdate ? "on" : "off"}.`;
	status += `The intelligence link display shows ${R.connected_ai ? R.connected_ai.name : "NULL"}.`;
	status += `The camera light is ${R.camera !== null && R.camera.status ? "on" : "off"}.`;
	status += `The lockdown indicator is ${R.lockcharge ? "on" : "off"}.`;
	return (status += `The reset module hardware light is ${R.has_module() ? "on" : "off"}.`);
});

// robot.dm:30
rt.def("/datum/wires/robot/proc/on_pulse", function* on_pulse(f: Frame, wire: Value) {
	let new_ai: Value = null;
	let R: Value = this.holder;
	if (wire === "AI Connection") {
		if (!R.emagged) {
			if ((new_ai = (yield* select_active_ai(R))) && new_ai != R.connected_ai) {
				R.connected_ai = new_ai;
				if (R.shell) {
					yield* R.undeploy();
					R.notify_ai(AI_SHELL);
				} else {
					R.notify_ai(1);
				}
			}
		}
	} else if (wire === "Camera") {
		if (R.camera !== null && !R.scrambledcodes) {
			yield* R.camera.toggle_cam(f.usr, 0);
			R.visible_message(`${R}'s camera lense focuses loudly.`, "Your camera lense focuses loudly.");
		}
	} else if (wire === "AI Law Synchronization") {
		if (R.lawupdate) {
			R.visible_message(`${R} gently chimes.`, "LawSync protocol engaged.");
			yield* R.lawsync();
			yield* R.show_laws();
		}
	} else if (wire === "Lockdown") {
		yield* R.SetLockdown((!R.lockcharge ? 1 : 0));
	} else if (wire === "Reset Module") {
		if (!R.has_module()) return f.dot;
		R.visible_message(`${R}'s module servos twitch.`, "Your module display flickers.");
	}
	return f.dot;
}, true);

// robot.dm:58
rt.def("/datum/wires/robot/proc/on_cut", function* on_cut(f: Frame, wire: Value, mend: Value) {
	let R: Value = this.holder;
	if (wire === "AI Connection") {
		if (!mend) {
			R.connected_ai = null;
			yield* R.undeploy();
		}
	} else if (wire === "AI Law Synchronization") {
		if (mend) {
			if (!R.emagged) {
				R.lawupdate = 1;
			}
		} else if (!R.deployed) {
			R.lawupdate = 0;
		}
	} else if (wire === "Camera") {
		if (R.camera !== null && !R.scrambledcodes) {
			R.camera.status = mend;
			yield* R.camera.toggle_cam(f.usr, 0);
			R.visible_message(`${R}'s camera lense focuses loudly.`, "Your camera lense focuses loudly.");
		}
	} else if (wire === "Lockdown") {
		yield* R.SetLockdown((!mend ? 1 : 0));
	} else if (wire === "Reset Module") {
		if (!(R.has_module() && !mend)) return f.dot;
		yield* R.ResetModule();
	}
	return f.dot;
}, true);
