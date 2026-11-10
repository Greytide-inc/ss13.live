// Based on /tg/station's code/modules/spells/spell_types/explosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11313, "/obj/effect/proc_holder/spell/targeted/explosion", "/obj/effect/proc_holder/spell/targeted", {
	ex_severe: 1,
	ex_heavy: 2,
	ex_light: 3,
	ex_flash: 4,
	name: "Explosion",
	desc: "This spell explodes an area.",
});

// explosion.dm:12
rt.def("/obj/effect/proc_holder/spell/targeted/explosion/proc/cast", function cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	for (target of each(targets, T("/mob/living"))) {
		explosion(target.loc, this.ex_severe, this.ex_heavy, this.ex_light, this.ex_flash);
	}
	return f.dot;
});
