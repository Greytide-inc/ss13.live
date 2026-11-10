// Based on /tg/station's code/modules/mob/living/silicon/examine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// examine.dm:2
rt.def("/mob/living/silicon/proc/examine", function examine(f: Frame, user: Value) {
	if (!(this.laws && rt.istype(user, T("/mob/dead/observer")))) return f.dot;
	to_chat(user, `<b>${this} has the following laws:</b>`);
	this.laws.show_laws(user);
	return f.dot;
});
