// Based on /tg/station's code/modules/mob/living/silicon/damage_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// damage_procs.dm:3
rt.def("/mob/living/silicon/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	damage ??= 0;
	damagetype ??= "brute";
	blocked ??= 0;
	let hit_percent: Value = (100 - blocked) / 100;
	if (!damage || hit_percent <= 0) {
		return 0;
	}
	if (damagetype === "brute") {
		yield* this.adjustBruteLoss(damage * hit_percent);
	} else if (damagetype === "fire") {
		yield* this.adjustFireLoss(damage * hit_percent);
	} else if (damagetype === "oxy") {
		if (damage < 0) {
			yield* this.adjustOxyLoss(damage * hit_percent);
		}
	}
	return 1;
}, true);
