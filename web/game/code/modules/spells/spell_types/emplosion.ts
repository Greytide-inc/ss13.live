// Based on /tg/station's code/modules/spells/spell_types/emplosion.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11311, "/obj/effect/proc_holder/spell/targeted/emplosion", "/obj/effect/proc_holder/spell/targeted", {
	emp_heavy: 2,
	emp_light: 3,
	name: "Emplosion",
	desc: "This spell emplodes an area.",
	action_icon_state: "emp",
	sound: rt.rsc("sound/weapons/zapbang.ogg"),
});

// emplosion.dm:12
rt.def("/obj/effect/proc_holder/spell/targeted/emplosion/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	playsound(rt.getStep(f, user, 0), this.sound, 50, 1);
	for (target of each(targets, T("/mob/living"))) {
		yield* empulse(target.loc, this.emp_heavy, this.emp_light);
	}
	return f.dot;
}, true);
