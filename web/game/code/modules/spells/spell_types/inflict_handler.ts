// Based on /tg/station's code/modules/spells/spell_types/inflict_handler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11322, "/obj/effect/proc_holder/spell/targeted/inflict_handler", "/obj/effect/proc_holder/spell/targeted", {
	amt_knockdown: 0,
	amt_unconscious: 0,
	amt_stun: 0,
	amt_dam_fire: 0,
	amt_dam_brute: 0,
	amt_dam_oxy: 0,
	amt_dam_tox: 0,
	amt_eye_blind: 0,
	amt_eye_blurry: 0,
	destroys: "none",
	summon_type: null,
	name: "Inflict Handler",
	desc: "This spell blinds and/or destroys/damages/heals and/or knockdowns/stuns the target.",
});

// inflict_handler.dm:24
rt.def("/obj/effect/proc_holder/spell/targeted/inflict_handler/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let target: Value = null;
	let $e: any;
	user ??= f.usr;
	for (target of each(targets, T("/mob/living"))) {
		playsound(target, this.sound, 50, 1);
		if (this.destroys === "gib") {
			yield* target.gib();
		} else if (this.destroys === "disintegrate") {
			yield* target.dust();
		}
		if (!target) {
			continue;
		}
		yield* target.adjustBruteLoss(this.amt_dam_brute);
		yield* target.adjustFireLoss(this.amt_dam_fire);
		yield* target.adjustToxLoss(this.amt_dam_tox);
		yield* target.adjustOxyLoss(this.amt_dam_oxy);
		yield* target.Knockdown(this.amt_knockdown);
		yield* target.Unconscious(this.amt_unconscious);
		yield* target.Stun(this.amt_stun);
		yield* target.blind_eyes(this.amt_eye_blind);
		yield* target.blur_eyes(this.amt_eye_blurry);
		if (this.summon_type) {
			yield* new_(this.summon_type, target.loc, target);
		}
	}
	return f.dot;
}, true);
