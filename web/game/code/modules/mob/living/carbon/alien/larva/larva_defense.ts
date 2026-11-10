// Based on /tg/station's code/modules/mob/living/carbon/alien/larva/larva_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// larva_defense.dm:4
rt.def("/mob/living/carbon/alien/larva/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let damage: Value = rand(1, 9);
	if (prob(90)) {
		playsound(this.loc, "punch", 25, 1, -1);
		add_logs(M, this, "attacked");
		this.visible_message(`<span class='danger'>${M} has kicked ${this}!</span>`, `<span class='userdanger'>${M} has kicked ${this}!</span>`, null, 3);
		if (this.stat != 2 && damage > 4.9) {
			yield* this.Unconscious(rand(100, 200));
		}
		affecting = this.get_bodypart(ran_zone(M.zone_selected));
		yield* this.apply_damage(damage, "brute", affecting);
	} else {
		playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
		this.visible_message(`<span class='danger'>${M} has attempted to kick ${this}!</span>`, `<span class='userdanger'>${M} has attempted to kick ${this}!</span>`, null, 3);
	}
	return f.dot;
}, true);

// larva_defense.dm:22
rt.def("/mob/living/carbon/alien/larva/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent != "harm") return f.dot;
	yield* parent_proc(user, 1);
	yield* this.adjustBruteLoss(5 + rand(1, 9));
	yield* new_(T("/datum/forced_movement"), this, get_step_away(user, this, 30), 1);
	return 1;
}, true);

// larva_defense.dm:29
rt.def("/mob/living/carbon/alien/larva/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!f.args[3] && !f.args[1]) {
		f.args[1] = "bite";
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
