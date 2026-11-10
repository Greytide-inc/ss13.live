// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// life.dm:9
rt.def("/mob/living/carbon/alien/larva/proc/Life", function Life(f: Frame) {
	if (this.notransform) {
		return f.dot;
	}
	if (!parent_proc()) return f.dot;
	if (!(this.amount_grown < this.max_grown)) return f.dot;
	this.amount_grown++;
	this.update_icons();
	return f.dot;
}, false, { waitfor: false });

// life.dm:17
rt.def("/mob/living/carbon/alien/larva/proc/update_stat", function* update_stat(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2) {
		if (this.health <= -this.maxHealth || !this.getorgan(T("/obj/item/organ/brain"))) {
			yield* this.death();
			return f.dot;
		}
		if (this.IsUnconscious() || this.IsSleeping() || this.getOxyLoss() > 50 || rt.bitAnd(this.status_flags, FAKEDEATH) || this.health <= 0) {
			if (this.stat == 0) {
				this.stat = 1;
				yield* this.blind_eyes(1);
				yield* this.update_canmove();
			}
		} else if (this.stat == 1) {
			this.stat = 0;
			this.resting = 0;
			yield* this.adjust_blindness(-1);
			yield* this.update_canmove();
		}
	}
	yield* this.update_damage_hud();
	this.update_health_hud();
	return f.dot;
}, true);
