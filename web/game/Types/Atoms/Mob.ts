// From Types/Atoms/Mob.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/proc/CanMobAutoclick  empty
rt.def("/mob/proc/CanMobAutoclick", undefined, false, { args: ["object", "location", "params"] });

// /mob/proc/canMobMousedown  empty
rt.def("/mob/proc/canMobMousedown", undefined, false, { args: ["object", "location", "params"] });

// /mob/proc/RangedAttack  empty
rt.def("/mob/proc/RangedAttack", undefined, false, { args: ["A", "params"] });

// /mob/proc/browse_rsc_icon  empty
rt.def("/mob/proc/browse_rsc_icon", undefined, false, { args: ["icon", "icon_state", "dir"] });

// /mob/proc/petrify  empty
rt.def("/mob/proc/petrify", undefined, false, { args: ["statue_timer"] });

// /mob/proc/get_contents  empty
rt.def("/mob/proc/get_contents");

// /mob/proc/restoreEars  empty
rt.def("/mob/proc/restoreEars");

// /mob/proc/adjustEarDamage  empty
rt.def("/mob/proc/adjustEarDamage");

// /mob/proc/minimumDeafTicks  empty
rt.def("/mob/proc/minimumDeafTicks");

// /mob/proc/Login  (Types/Atoms/Mob.dm:19)
rt.def("/mob/proc/Login", function Login(f: Frame) {
	let fallback_spawn: Value = null;
	f.vars = () => [fallback_spawn];
	if (truthy(rt.sv(f, "loc"))) return f.dot;
	if (!truthy((fallback_spawn = rt.locate(1, 1, 1)))) return f.dot;
	rt.setSv(f, "loc", live(fallback_spawn));
	return f.dot;
});

// /mob/proc/Logout  (Types/Atoms/Mob.dm:25)
rt.def("/mob/proc/Logout", function Logout(f: Frame) {
	rt.del(f, rt.sv(f, "client"));
	return f.dot;
});
