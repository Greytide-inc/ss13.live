// From code/modules/mob/living/silicon/robot/robot_movement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/robot/proc/Process_Spacemove  (code/modules/mob/living/silicon/robot/robot_movement.dm:2)  may sleep
rt.def("/mob/living/silicon/robot/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy((yield* g.srcCall(f, "ionpulse")))) {
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["movement_dir"] });

// /mob/living/silicon/robot/proc/movement_delay  (code/modules/mob/living/silicon/robot/robot_movement.dm:7)
rt.def("/mob/living/silicon/robot/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	f.dot = rt.modify(live(f.dot), rt.sv(f, "speed"), add);
	f.dot = rt.modify(live(f.dot), rt.fv(f, "robot_delay", rt.gl("config")), add);
	return f.dot;
});

// /mob/living/silicon/robot/proc/mob_has_gravity  (code/modules/mob/living/silicon/robot/robot_movement.dm:15)
rt.def("/mob/living/silicon/robot/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return (rt.callSuper(f, [], rt.Args.Same) || rt.callSrc(f, "mob_negates_gravity", []));
});

// /mob/living/silicon/robot/proc/experience_pressure_difference  (code/modules/mob/living/silicon/robot/robot_movement.dm:18)
rt.def("/mob/living/silicon/robot/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	if (truthy(rt.sv(f, "magpulse"))) return f.dot;
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["pressure_difference", "direction"], waitfor: false });

// /mob/living/silicon/robot/proc/Moved  (code/modules/mob/living/silicon/robot/robot_movement.dm:22)  may sleep
rt.def("/mob/living/silicon/robot/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "on_vehicle_move", []);
	return f.dot;
}, true);
