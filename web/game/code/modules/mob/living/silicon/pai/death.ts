// Based on /tg/station's code/modules/mob/living/silicon/pai/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// death.dm:2
rt.def("/mob/living/silicon/pai/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	this.stat = 2;
	this.canmove = 0;
	yield* this.card.removePersonality();
	yield* this.card.forceMove(this.loc);
	yield* this.update_sight();
	yield* this.clear_fullscreens();
	GLOB.living_mob_list -= this;
	yield* this.ghostize();
	yield* qdel(this);
	return f.dot;
}, true);
