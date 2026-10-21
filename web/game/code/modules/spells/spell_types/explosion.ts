// From code/modules/spells/spell_types/explosion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11313, "/obj/effect/proc_holder/spell/targeted/explosion", "/obj/effect/proc_holder/spell/targeted", {
	ex_severe: 1,
	ex_heavy: 2,
	ex_light: 3,
	ex_flash: 4,
	name: "Explosion",
	desc: "This spell explodes an area.",
});

// /obj/effect/proc_holder/spell/targeted/explosion/proc/cast  (code/modules/spells/spell_types/explosion.dm:12)
rt.def("/obj/effect/proc_holder/spell/targeted/explosion/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $e: any;
	f.vars = () => [user, target, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	target = null;
	rt.forList(f, 0, live(targets), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		target = $e;
		rt.call(f, P("/proc/explosion"), null, [rt.fv(f, "loc", live(target)), rt.sv(f, "ex_severe"), rt.sv(f, "ex_heavy"), rt.sv(f, "ex_light"), rt.sv(f, "ex_flash")]);
	}
	rt.endFor(f, 0);
	return live(f.dot);
});
