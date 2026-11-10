// Based on /tg/station's code/modules/mob/living/carbon/alien/humanoid/humanoid_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// humanoid_defense.dm:3
rt.def("/mob/living/carbon/alien/humanoid/proc/grabbedby", function* grabbedby(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0] == this && this.pulling && this.grab_state >= 1 && !this.pulling.anchored && rt.istype(this.pulling, T("/mob/living/carbon"))) {
		yield* this.devour_mob(this.pulling, { devour_time: 60 });
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["user", "supress_message"] });

// humanoid_defense.dm:9
rt.def("/mob/living/carbon/alien/humanoid/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent != "harm") return f.dot;
	yield* parent_proc(user, 1);
	yield* this.adjustBruteLoss(15);
	let hitverb: Value = "punched";
	if (this.mob_size < MOB_SIZE_LARGE) {
		yield* step_away(this, user, 15);
		yield* sleep(1);
		yield* step_away(this, user, 15);
		hitverb = "slammed";
	}
	playsound(this.loc, "punch", 25, 1, -1);
	this.visible_message(`<span class='danger'>${user} has ${hitverb} ${this}!</span>`, `<span class='userdanger'>${user} has ${hitverb} ${this}!</span>`, null, 3);
	return 1;
}, true);

// humanoid_defense.dm:24
rt.def("/mob/living/carbon/alien/humanoid/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let damage: Value = null, affecting: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (M.a_intent === "harm") {
		damage = rand(1, 9);
		if (prob(90)) {
			playsound(this.loc, "punch", 25, 1, -1);
			this.visible_message(`<span class='danger'>${M} has punched ${this}!</span>`, `<span class='userdanger'>${M} has punched ${this}!</span>`, null, 3);
			if (this.stat != 2 && (damage > 9 || prob(5))) {
				yield* this.Unconscious(40);
				this.visible_message(`<span class='danger'>${M} has knocked ${this} down!</span>`, `<span class='userdanger'>${M} has knocked ${this} down!</span>`);
			}
			affecting = this.get_bodypart(ran_zone(M.zone_selected));
			yield* this.apply_damage(damage, "brute", affecting);
			add_logs(M, this, "attacked");
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
			this.visible_message(`<span class='userdanger'>${M} has attempted to punch ${this}!</span>`, `<span class='userdanger'>${M} has attempted to punch ${this}!</span>`, null, 3);
		}
	} else if (M.a_intent === "disarm") {
		if (this.lying) return f.dot;
		if (prob(5)) {
			yield* this.Unconscious(40);
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			add_logs(M, this, "pushed");
			this.visible_message(`<span class='danger'>${M} has pushed down ${this}!</span>`, `<span class='userdanger'>${M} has pushed down ${this}!</span>`);
		} else if (prob(50)) {
			yield* this.drop_item();
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			this.visible_message(`<span class='danger'>${M} has disarmed ${this}!</span>`, `<span class='userdanger'>${M} has disarmed ${this}!</span>`, null, 3);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
			this.visible_message(`<span class='userdanger'>${M} has attempted to disarm ${this}!</span>`, `<span class='userdanger'>${M} has attempted to disarm ${this}!</span>`, null, 3);
		}
	}
	return f.dot;
}, true);

// humanoid_defense.dm:66
rt.def("/mob/living/carbon/alien/humanoid/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!f.args[3] && !f.args[1]) {
		f.args[1] = "claw";
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
