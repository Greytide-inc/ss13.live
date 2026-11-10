// Based on /tg/station's code/modules/mob/living/simple_animal/slime/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/simple_animal/slime/proc/death", function* death(f: Frame, gibbed: Value) {
	let M: Value = null, R: Value = null, E: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	if (!gibbed) {
		if (this.is_adult) {
			(M = (yield* new_(T("/mob/living/simple_animal/slime"), this.loc, this.colour))).rabid = 1;
			yield* M.regenerate_icons();
			this.is_adult = 0;
			this.maxHealth = 150;
			for (R of each(this.actions, T("/datum/action/innate/slime/reproduce"))) {
				yield* R.Remove(this);
			}
			yield* (E = (yield* new_(T("/datum/action/innate/slime/evolve")))).Grant(this);
			yield* this.revive({ full_heal: 1 });
			yield* this.regenerate_icons();
			this.update_name();
			return f.dot;
		}
	}
	if (this.buckled) {
		yield* this.Feedstop({ silent: 1 });
	}
	this.stat = 2;
	this.cut_overlays();
	yield* this.update_canmove();
	if (GLOB.SSticker && GLOB.SSticker.mode) {
		GLOB.SSticker.mode.check_win();
	}
	return (yield* parent_proc(gibbed));
}, true);

// death.dm:35
rt.def("/mob/living/simple_animal/slime/proc/gib", function* gib(f: Frame) {
	yield* this.death(1);
	yield* qdel(this);
	return f.dot;
}, true);

// death.dm:40
rt.def("/mob/living/simple_animal/slime/proc/Destroy", function* Destroy(f: Frame) {
	let X: Value = null;
	for (X of each(GLOB.machines, T("/obj/machinery/computer/camera_advanced/xenobio"))) {
		if (rt.isIn(f, this, X.stored_slimes)) {
			X.stored_slimes -= this;
		}
	}
	return (yield* parent_proc());
}, true);
