// Based on /tg/station's code/_onclick/god.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(5099, "/mob/camera/god", "/mob/camera", {});

// god.dm:2
rt.def("/mob/camera/god/proc/UnarmedAttack", function UnarmedAttack(f: Frame, A: Value) {
	A.attack_god(this);
	return f.dot;
});

// god.dm:5
rt.def("/mob/camera/god/proc/RangedAttack", function RangedAttack(f: Frame, A: Value) {
	A.attack_god(this);
	return f.dot;
});
