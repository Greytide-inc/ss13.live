// From code/modules/spells/spell_types/emplosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11311, "/obj/effect/proc_holder/spell/targeted/emplosion", "/obj/effect/proc_holder/spell/targeted", {
	emp_heavy: 2,
	emp_light: 3,
	name: "Emplosion",
	desc: "This spell emplodes an area.",
	action_icon_state: "emp",
	sound: rt.rsc("sound/weapons/zapbang.ogg"),
});

// /obj/effect/proc_holder/spell/targeted/emplosion/proc/cast  (code/modules/spells/spell_types/emplosion.dm:12)  may sleep
rt.def("/obj/effect/proc_holder/spell/targeted/emplosion/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [targets, user, target, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.sv(f, "sound"), 50, 1]);
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		yield* g.call(f, P("/proc/empulse"), null, [rt.fv(f, "loc", live(target)), rt.sv(f, "emp_heavy"), rt.sv(f, "emp_light")]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);
