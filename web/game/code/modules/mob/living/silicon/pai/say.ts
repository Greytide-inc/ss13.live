// Based on /tg/station's code/modules/mob/living/silicon/pai/say.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// say.dm:3
rt.def("/mob/living/silicon/pai/proc/say", function* say(f: Frame, msg: Value) {
	if (this.silent) {
		to_chat(this, "<span class='warning'>Communication circuits remain unitialized.</span>");
	} else {
		yield* parent_proc(msg);
	}
	return f.dot;
}, true);
