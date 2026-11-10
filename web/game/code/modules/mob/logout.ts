// Based on /tg/station's code/modules/mob/logout.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// logout.dm:2
rt.def("/mob/proc/Logout", function* Logout(f: Frame) {
	yield* this.set_typing_indicator(0);
	yield* GLOB.SStgui.on_logout(this);
	yield* this.unset_machine();
	GLOB.player_list -= this;
	yield* parent_proc();
	if (this.loc) {
		this.loc.on_log(0);
	}
	return 1;
}, true);
