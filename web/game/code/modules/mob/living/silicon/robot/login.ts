// Based on /tg/station's code/modules/mob/living/silicon/robot/login.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// login.dm:3
rt.def("/mob/living/silicon/robot/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	yield* this.regenerate_icons();
	yield* this.show_laws(0);
	if (!this.mind) return f.dot;
	yield* GLOB.SSticker.mode.remove_revolutionary(this.mind);
	yield* GLOB.SSticker.mode.remove_gangster(this.mind, 1, { remove_bosses: 1 });
	return f.dot;
}, true);
