// Based on /tg/station's code/_onclick/item_attack.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// item_attack.dm:3
rt.def("/obj/item/proc/melee_attack_chain", function* melee_attack_chain(f: Frame, user: Value, target: Value, params: Value) {
	let resolved: Value = null;
	if (!(yield* this.pre_attackby(target, user, params))) return f.dot;
	if (!(!(resolved = (yield* target.attackby(this, user, params))) && target && !(!this || this.gc_destroyed))) return f.dot;
	yield* this.afterattack(target, user, 1, params);
	return f.dot;
}, true);

// item_attack.dm:22
rt.def("/obj/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	return (yield* I.attack_obj(this, user));
}, true);

// item_attack.dm:25
rt.def("/mob/living/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let sharpness: Value = null;
	user.changeNext_move(8);
	if (user.a_intent == "harm" && this.stat == 2 && this.butcher_results) {
		if (sharpness = I.is_sharp()) {
			to_chat(user, `<span class='notice'>You begin to butcher ${this}...</span>`);
			playsound(this.loc, rt.rsc("sound/weapons/slice.ogg"), 50, 1, -1);
			if ((yield* do_mob(user, this, 80 / sharpness)) && this.Adjacent(I)) {
				yield* this.harvest(user);
			}
			return 1;
		}
	}
	return (yield* I.attack(this, user));
}, true);

// item_attack.dm:38
rt.def("/obj/item/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (rt.bitAnd(this.flags, NOBLUDGEON)) {
		return f.dot;
	}
	if (!this.force) {
		playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), this.get_clamped_volume(), 1, -1);
	} else if (this.hitsound) {
		playsound(this.loc, this.hitsound, this.get_clamped_volume(), 1, -1);
	}
	user.lastattacked = M;
	M.lastattacker = user;
	yield* user.do_attack_animation(M);
	yield* M.attacked_by(this, user);
	add_logs(user, M, "attacked", this.name, `(INTENT: ${uppertext(user.a_intent)}) (DAMTYPE: ${uppertext(this.damtype)})`);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// item_attack.dm:57
rt.def("/obj/item/proc/attack_obj", function* attack_obj(f: Frame, O: Value, user: Value) {
	if (rt.bitAnd(this.flags, NOBLUDGEON)) {
		return f.dot;
	}
	user.changeNext_move(8);
	yield* user.do_attack_animation(O);
	yield* O.attacked_by(this, user);
	return f.dot;
}, true);

// item_attack.dm:67
rt.def("/obj/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (I.force) {
		this.visible_message(`<span class='danger'>${user} has hit ${this} with ${I}!</span>`, null, null, 3);
	}
	yield* this.take_damage(I.force, I.damtype, "melee", 1);
	return f.dot;
}, true);

// item_attack.dm:73
rt.def("/mob/living/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let location: Value = null;
	this.send_item_attack_message(I, user);
	if (!I.force) return f.dot;
	yield* this.apply_damage(I.force, I.damtype);
	if (I.damtype == "brute") {
		if (prob(33)) {
			yield* I.add_mob_blood(this);
			yield* this.add_splatter_floor((location = rt.getStep(f, this, 0)));
			if (get_dist(user, this) <= 1) {
				yield* user.add_mob_blood(this);
			}
		}
	}
	return 1;
}, true);

// item_attack.dm:86
rt.def("/mob/living/simple_animal/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	if (I.force < this.force_threshold || I.damtype == "stamina") {
		playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), I.get_clamped_volume(), 1, -1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// item_attack.dm:100
rt.def("/obj/item/proc/get_clamped_volume", function get_clamped_volume(f: Frame) {
	if (!this.w_class) return f.dot;
	if (this.force) {
		return max(30, min((this.force + this.w_class) * 4, 100));
	}
	return max(10, min(this.w_class * 6, 100));
});

// item_attack.dm:105
rt.def("/mob/living/proc/send_item_attack_message", function send_item_attack_message(f: Frame, I: Value, user: Value, hit_area: Value) {
	let message_verb: Value = "attacked";
	if (I.attack_verb && rt.len(f, I.attack_verb)) {
		message_verb = `${pick(I.attack_verb)}`;
	} else if (!I.force) {
		return f.dot;
	}
	let message_hit_area: Value = "";
	if (hit_area) {
		message_hit_area = ` in the ${hit_area}`;
	}
	let attack_message: Value = `${this} has been ${message_verb}${message_hit_area} with ${I}.`;
	if (rt.isIn(f, user, viewers(this, null))) {
		attack_message = `${user} has ${message_verb} ${this}${message_hit_area} with ${I}!`;
	}
	this.visible_message(`<span class='danger'>${attack_message}</span>`, `<span class='userdanger'>${attack_message}</span>`, null, 3);
	return 1;
});
