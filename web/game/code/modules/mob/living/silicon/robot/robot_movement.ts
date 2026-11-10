// Based on /tg/station's code/modules/mob/living/silicon/robot/robot_movement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// robot_movement.dm:2
rt.def("/mob/living/silicon/robot/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (yield* this.ionpulse()) {
		return 1;
	}
	return (yield* parent_proc());
}, true, { args: ["movement_dir"] });

// robot_movement.dm:7
rt.def("/mob/living/silicon/robot/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += this.speed;
	f.dot += GLOB.config.robot_delay;
	return f.dot;
});

// robot_movement.dm:15
rt.def("/mob/living/silicon/robot/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return (parent_proc() || this.mob_negates_gravity());
});

// robot_movement.dm:18
rt.def("/mob/living/silicon/robot/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value) {
	if (this.magpulse) return f.dot;
	return parent_proc();
}, false, { waitfor: false });

// robot_movement.dm:22
rt.def("/mob/living/silicon/robot/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.riding_datum) return f.dot;
	yield* this.riding_datum.on_vehicle_move();
	return f.dot;
}, true);
