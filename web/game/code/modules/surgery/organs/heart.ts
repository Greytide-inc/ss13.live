// Based on /tg/station's code/modules/surgery/organs/heart.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9440, "/obj/item/organ/heart", "/obj/item/organ", {
	beating: 1,
	icon_base: "heart",
	beat: 0,
	name: "heart",
	icon_state: "heart-on",
	zone: "chest",
	slot: "heart",
	origin_tech: "biotech=5",
	attack_verb: null,
});

// heart.dm:15
rt.def("/obj/item/organ/heart/proc/update_icon", function update_icon(f: Frame) {
	if (this.beating) {
		this.icon_state = `${this.icon_base}-on`;
	} else {
		this.icon_state = `${this.icon_base}-off`;
	}
	return f.dot;
});

// heart.dm:20
rt.def("/obj/item/organ/heart/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/heart/proc/stop_if_unowned"))), 120);
	return f.dot;
}, true, { args: ["M", "special"] });

// heart.dm:25
rt.def("/obj/item/organ/heart/proc/stop_if_unowned", function stop_if_unowned(f: Frame) {
	if (this.owner) return f.dot;
	this.Stop();
	return f.dot;
});

// heart.dm:29
rt.def("/obj/item/organ/heart/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.beating) return f.dot;
	this.visible_message(`<span class='notice'>${user} squeezes ${this} to make it beat again!</span>`, `<span class='notice'>You squeeze ${this} to make it beat again!</span>`);
	this.Restart();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/heart/proc/stop_if_unowned"))), 80);
	return f.dot;
}, true);

// heart.dm:39
rt.def("/obj/item/organ/heart/proc/Stop", function Stop(f: Frame) {
	this.beating = 0;
	this.update_icon();
	return 1;
});

// heart.dm:44
rt.def("/obj/item/organ/heart/proc/Restart", function Restart(f: Frame) {
	this.beating = 1;
	this.update_icon();
	return 1;
});

// heart.dm:48
rt.def("/obj/item/organ/heart/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	(S = (yield* parent_proc())).icon_state = "heart-off";
	return S;
}, true);

// heart.dm:53
rt.def("/obj/item/organ/heart/proc/on_life", function on_life(f: Frame) {
	let H: Value = null;
	if (!this.owner.client) return f.dot;
	let slowbeat: Value = sound(rt.rsc("sound/health/slowbeat.ogg"), { repeat: 1 });
	let fastbeat: Value = sound(rt.rsc("sound/health/fastbeat.ogg"), { repeat: 1 });
	if ((H = this.owner).health <= 0 && this.beat != BEAT_SLOW) {
		this.beat = BEAT_SLOW;
		H.playsound_local(rt.getStep(f, H, BEAT_NONE), slowbeat, 40, BEAT_NONE, { channel: CHANNEL_HEARTBEAT });
		to_chat(this.owner, "<span class = 'notice'>You feel your heart slow down...</span>");
	}
	if (this.beat == BEAT_SLOW && H.health > BEAT_NONE) {
		H.stop_sound_channel(CHANNEL_HEARTBEAT);
		this.beat = BEAT_NONE;
	}
	if (!H.jitteriness) return f.dot;
	if (!(!this.beat || this.beat == BEAT_SLOW)) return f.dot;
	H.playsound_local(rt.getStep(f, H, 0), fastbeat, 40, 0, { channel: CHANNEL_HEARTBEAT });
	this.beat = BEAT_FAST;
	return f.dot;
});

rt.type(9455, "/obj/item/organ/heart/cursed", "/obj/item/organ/heart", {
	last_pump: 0,
	add_colour: 1,
	pump_delay: 30,
	blood_loss: 100,
	heal_brute: 0,
	heal_burn: 0,
	heal_oxy: 0,
	name: "cursed heart",
	desc: "A heart that, when inserted, will force you to pump it manually.",
	icon_state: "cursedheart-off",
	icon_base: "cursedheart",
	origin_tech: "biotech=6",
	actions_types: null,
});

// heart.dm:77
rt.def("/obj/item/organ/heart/cursed/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/organ_action/cursed_heart"));
	return f.dot;
});

// heart.dm:90
rt.def("/obj/item/organ/heart/cursed/proc/attack", function* attack(f: Frame, H: Value, user: Value, target: Value) {
	if (H == user && rt.istype(H, T("/mob/living/carbon/human"))) {
		playsound(user, rt.rsc("sound/effects/singlebeat.ogg"), 40, 1);
		yield* user.drop_item();
		yield* this.Insert(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// heart.dm:98
rt.def("/obj/item/organ/heart/cursed/proc/on_life", function* on_life(f: Frame) {
	let H: Value = null;
	if (!(rt.worldTime(f) > this.last_pump + this.pump_delay)) return f.dot;
	if (rt.istype(this.owner, T("/mob/living/carbon/human")) && this.owner.client) {
		if ((H = this.owner).dna && !rt.isIn(f, NOBLOOD, H.dna.species.species_traits)) {
			H.blood_volume = max(H.blood_volume - this.blood_loss, 0);
			to_chat(H, "<span class = 'userdanger'>You have to keep pumping your blood!</span>");
			if (this.add_colour) {
				yield* H.add_client_colour(T("/datum/client_colour/cursed_heart_blood"));
				this.add_colour = 0;
			}
		}
	} else {
		this.last_pump = rt.worldTime(f);
	}
	return f.dot;
}, true);

// heart.dm:111
rt.def("/obj/item/organ/heart/cursed/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.owner) return f.dot;
	to_chat(this.owner, "<span class ='userdanger'>Your heart has been replaced with a cursed one, you have to pump this one manually otherwise you'll die!</span>");
	return f.dot;
}, true, { args: ["M", "special"] });

rt.type(230, "/datum/action/item_action/organ_action/cursed_heart", "/datum/action/item_action/organ_action", {
	name: "Pump your blood",
});

// heart.dm:120
rt.def("/datum/action/item_action/organ_action/cursed_heart/proc/Trigger", function* Trigger(f: Frame) {
	let H: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/obj/item/organ/heart/cursed")))) return f.dot;
	let cursed_heart: Value = this.target;
	if (rt.worldTime(f) < cursed_heart.last_pump + (cursed_heart.pump_delay - 10)) {
		to_chat(this.owner, "<span class='userdanger'>Too soon!</span>");
		return f.dot;
	}
	cursed_heart.last_pump = rt.worldTime(f);
	playsound(this.owner, rt.rsc("sound/effects/singlebeat.ogg"), 40, 1);
	to_chat(this.owner, "<span class = 'notice'>Your heart beats.</span>");
	if (!rt.istype((H = this.owner), T("/mob/living/carbon/human"))) return f.dot;
	if (!(H.dna && !rt.isIn(f, NOBLOOD, H.dna.species.species_traits))) return f.dot;
	H.blood_volume = min(H.blood_volume + cursed_heart.blood_loss * 0.5, BLOOD_VOLUME_MAXIMUM);
	yield* H.remove_client_colour(T("/datum/client_colour/cursed_heart_blood"));
	cursed_heart.add_colour = 1;
	yield* H.adjustBruteLoss(-cursed_heart.heal_brute);
	yield* H.adjustFireLoss(-cursed_heart.heal_burn);
	yield* H.adjustOxyLoss(-cursed_heart.heal_oxy);
	return f.dot;
}, true);
