// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/carbon/alien/humanoid/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.stat == 2) {
		return f.dot;
	}
	f.dot = (yield* parent_proc());
	yield* this.update_canmove();
	yield* this.update_icons();
	(rt.modSrcVar(f, "status_flags", 8, rt.bitOr));
	return f.dot;
}, true);

// death.dm:13
rt.def("/mob/living/carbon/alien/humanoid/royal/queen/proc/death", function* death(f: Frame, gibbed: Value) {
	let C: Value = null, node: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	for (C of each(GLOB.living_mob_list, T("/mob/living/carbon"))) {
		if (C == this) {
			continue;
		}
		if (rt.istype((node = C.getorgan(T("/obj/item/organ/alien/hivenode"))), T("/obj/item/organ/alien/hivenode"))) {
			yield* node.queen_death();
		}
	}
	return (yield* parent_proc());
}, true);
