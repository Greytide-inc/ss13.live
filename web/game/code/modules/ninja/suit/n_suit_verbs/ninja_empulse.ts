// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/ninja_empulse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// ninja_empulse.dm:6
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ninjapulse", function* ninjapulse(f: Frame) {
	let H: Value = null;
	if (this.ninjacost(250, N_STEALTH_CANCEL)) return f.dot;
	playsound((H = this.affecting).loc, rt.rsc("sound/effects/empulse.ogg"), 60, 2);
	yield* empulse(H, 4, 6);
	this.s_coold = 2;
	return f.dot;
}, true);
