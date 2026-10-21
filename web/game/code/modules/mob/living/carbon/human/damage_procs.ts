// From code/modules/mob/living/carbon/human/damage_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/apply_damage  (code/modules/mob/living/carbon/human/damage_procs.dm:5)  may sleep
rt.def("/mob/living/carbon/human/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	f.vars = () => [damage, damagetype, def_zone, blocked];
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	if (live(def_zone) === null) {
		def_zone = null;
	}
	if (live(blocked) === null) {
		blocked = 0;
	}
	return (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "apply_damage", [live(damage), live(damagetype), live(def_zone), live(blocked), live(f.src)]));
}, true);
