// Based on /tg/station's code/modules/mob/living/carbon/human/damage_procs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// damage_procs.dm:5
rt.def("/mob/living/carbon/human/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	damage ??= 0;
	damagetype ??= "brute";
	blocked ??= 0;
	return (yield* this.dna.species.apply_damage(damage, damagetype, def_zone, blocked, this));
}, true);
