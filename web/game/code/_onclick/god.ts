// From code/_onclick/god.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5099, "/mob/camera/god", "/mob/camera", {});

// /mob/camera/god/proc/UnarmedAttack  (code/_onclick/god.dm:2)
rt.def("/mob/camera/god/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value) {
	rt.callName(f, live(A), "attack_god", [live(f.src)]);
	return f.dot;
});

// /mob/camera/god/proc/RangedAttack  (code/_onclick/god.dm:5)
rt.def("/mob/camera/god/proc/RangedAttack", function RangedAttack(f: Frame, A: Value) {
	rt.callName(f, live(A), "attack_god", [live(f.src)]);
	return f.dot;
});
