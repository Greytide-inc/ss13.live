// Based on /tg/station's code/modules/mob/dead/new_player/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logout.dm:3
rt.def("/mob/dead/new_player/proc/Logout", function* Logout(f: Frame) {
	this.ready = 0;
	yield* parent_proc();
	if (!this.spawning) {
		this.key = null;
		yield* qdel(this);
	}
	return f.dot;
}, true);
