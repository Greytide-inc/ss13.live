// Based on /tg/station's code/modules/mob/living/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logout.dm:2
rt.def("/mob/living/proc/Logout", function* Logout(f: Frame) {
	if (this.ranged_ability && this.client) {
		this.ranged_ability.remove_mousepointer(this.client);
	}
	yield* parent_proc();
	if (!(!this.key && this.mind)) return f.dot;
	this.mind.active = 0;
	return f.dot;
}, true);
