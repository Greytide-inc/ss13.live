// From code/modules/mob/living/silicon/damage_procs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/proc/apply_damage  (code/modules/mob/living/silicon/damage_procs.dm:3)  may sleep
rt.def("/mob/living/silicon/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value) {
	let hit_percent: Value = null;
	let $0: any;
	f.vars = () => [damage, damagetype, def_zone, blocked, hit_percent, $0];
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
	hit_percent = divide(subtract(100, live(blocked)), 100);
	if ((!truthy(live(damage)) || rt.le(live(hit_percent), 0))) {
		return 0;
	}
	$0 = live(damagetype);
	if ($0 === "brute") {
		yield* g.srcCall(f, "adjustBruteLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "fire") {
		yield* g.srcCall(f, "adjustFireLoss", multiply(live(damage), live(hit_percent)));
	} else if ($0 === "oxy") {
		if (rt.lt(live(damage), 0)) {
			yield* g.srcCall(f, "adjustOxyLoss", multiply(live(damage), live(hit_percent)));
		}
	}
	return 1;
}, true);
