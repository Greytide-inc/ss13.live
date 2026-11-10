// Based on /tg/station's code/modules/mob/living/brain/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/brain/proc/death", function* death(f: Frame, gibbed: Value) {
	let mmi: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	this.stat = 2;
	if (!gibbed && this.container) {
		(mmi = this.container).visible_message(`<span class='warning'>${this}'s MMI flatlines!</span>`, "<span class='italics'>You hear something flatline.</span>");
		yield* mmi.update_icon();
	}
	return (yield* parent_proc());
}, true);

// death.dm:16
rt.def("/mob/living/brain/proc/gib", function* gib(f: Frame) {
	if (this.container) {
		yield* qdel(this.container);
	}
	if (this.loc) {
		if (rt.istype(this.loc, T("/obj/item/organ/brain"))) {
			yield* qdel(this.loc);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);
