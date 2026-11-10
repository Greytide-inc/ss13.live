// Based on BYOND's Types/Atoms/Mob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// Empty in tg.
rt.def("/mob/proc/CanMobAutoclick", undefined, false, { args: ["object", "location", "params"] });

// Empty in tg.
rt.def("/mob/proc/canMobMousedown", undefined, false, { args: ["object", "location", "params"] });

// Empty in tg.
rt.def("/mob/proc/RangedAttack", undefined, false, { args: ["A", "params"] });

// Empty in tg.
rt.def("/mob/proc/browse_rsc_icon", undefined, false, { args: ["icon", "icon_state", "dir"] });

// Empty in tg.
rt.def("/mob/proc/petrify", undefined, false, { args: ["statue_timer"] });

// Empty in tg.
rt.def("/mob/proc/get_contents");

// Empty in tg.
rt.def("/mob/proc/restoreEars");

// Empty in tg.
rt.def("/mob/proc/adjustEarDamage");

// Empty in tg.
rt.def("/mob/proc/minimumDeafTicks");

// Mob.dm:19
rt.def("/mob/proc/Login", function Login(f: Frame) {
	let fallback_spawn: Value = null;
	if (this.loc) return f.dot;
	if (!(fallback_spawn = rt.locate(1, 1, 1))) return f.dot;
	this.loc = fallback_spawn;
	return f.dot;
});

// Mob.dm:25
rt.def("/mob/proc/Logout", function Logout(f: Frame) {
	rt.del(f, this.client);
	return f.dot;
});
