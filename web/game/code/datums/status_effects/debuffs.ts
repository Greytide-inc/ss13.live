// Based on /tg/station's code/datums/status_effects/debuffs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(928, "/datum/status_effect/incapacitating", "/datum/status_effect", {
	needs_update_stat: 0,
	tick_interval: 0,
	status_type: 2,
	alert_type: null,
});

// debuffs.dm:10
rt.def("/datum/status_effect/incapacitating/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, set_duration: Value, updating_canmove: Value) {
	if (isnum(set_duration)) {
		this.duration = set_duration;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!updating_canmove) return f.dot;
	yield* this.owner.update_canmove();
	if (!(this.needs_update_stat || rt.istype(this.owner, T("/mob/living/silicon")))) return f.dot;
	yield* this.owner.update_stat();
	return f.dot;
}, true);

// debuffs.dm:20
rt.def("/datum/status_effect/incapacitating/proc/on_remove", function* on_remove(f: Frame) {
	yield* this.owner.update_canmove();
	if (!(this.needs_update_stat || rt.istype(this.owner, T("/mob/living/silicon")))) return f.dot;
	yield* this.owner.update_stat();
	return f.dot;
}, true);

rt.type(932, "/datum/status_effect/incapacitating/sleeping", "/datum/status_effect/incapacitating", {
	carbon_owner: null,
	human_owner: null,
	needs_update_stat: 1,
	id: "sleeping",
	alert_type: rt.typePath("/obj/screen/alert/status_effect/asleep"),
});

// debuffs.dm:46
rt.def("/datum/status_effect/incapacitating/sleeping/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, updating_canmove: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (rt.istype(this.owner, T("/mob/living/carbon"))) {
		this.carbon_owner = this.owner;
	}
	if (!rt.istype(this.owner, T("/mob/living/carbon/human"))) return f.dot;
	this.human_owner = this.owner;
	return f.dot;
}, true);

// debuffs.dm:56
rt.def("/datum/status_effect/incapacitating/sleeping/proc/Destroy", function* Destroy(f: Frame) {
	this.carbon_owner = null;
	this.human_owner = null;
	return (yield* parent_proc());
}, true);

// debuffs.dm:59
rt.def("/datum/status_effect/incapacitating/sleeping/proc/tick", function* tick(f: Frame) {
	if (this.owner.staminaloss) {
		yield* this.owner.adjustStaminaLoss(-0.35);
	}
	if (this.human_owner && this.human_owner.drunkenness) {
		this.human_owner.drunkenness *= 0.997;
	}
	if (!prob(20)) return f.dot;
	if (this.carbon_owner) {
		this.carbon_owner.handle_dreams();
	}
	if (!(prob(10) && this.owner.health > 0)) return f.dot;
	yield* this.owner.emote("snore");
	return f.dot;
}, true);

rt.type(933, "/datum/status_effect/his_wrath", "/datum/status_effect", {
	id: "his_wrath",
	duration: -1,
	tick_interval: 4,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/his_wrath"),
});

// debuffs.dm:88
rt.def("/datum/status_effect/his_wrath/proc/tick", function* tick(f: Frame) {
	let HG: Value = null;
	for (HG of each(this.owner.held_items, T("/obj/item/weapon/his_grace"))) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.owner.adjustBruteLoss(0.1);
	yield* this.owner.adjustFireLoss(0.1);
	yield* this.owner.adjustToxLoss(0.2, 1, 1);
	return f.dot;
}, true);

rt.type(934, "/datum/status_effect/belligerent", "/datum/status_effect", {
	leg_damage_on_toggle: 2,
	cultist_damage_on_toggle: 10,
	id: "belligerent",
	duration: 70,
	tick_interval: 0,
	status_type: 2,
	alert_type: rt.typePath("/obj/screen/alert/status_effect/belligerent"),
});

// debuffs.dm:111
rt.def("/datum/status_effect/belligerent/proc/on_apply", function* on_apply(f: Frame) {
	return (yield* this.do_movement_toggle(1));
}, true);

// debuffs.dm:114
rt.def("/datum/status_effect/belligerent/proc/tick", function* tick(f: Frame) {
	if (yield* this.do_movement_toggle()) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// debuffs.dm:118
rt.def("/datum/status_effect/belligerent/proc/do_movement_toggle", function* do_movement_toggle(f: Frame, force_damage: Value) {
	let number_legs: Value = this.owner.get_num_legs();
	if (rt.istype(this.owner, T("/mob/living/carbon")) && !is_servant_of_ratvar(this.owner) && !this.owner.null_rod_check() && number_legs) {
		if (force_damage || this.owner.m_intent != "walk") {
			if (GLOB.ratvar_awakens) {
				yield* this.owner.Knockdown(20);
			}
			if (iscultist(this.owner)) {
				yield* this.owner.apply_damage(this.cultist_damage_on_toggle * 0.5, "fire", "l_leg");
				yield* this.owner.apply_damage(this.cultist_damage_on_toggle * 0.5, "fire", "r_leg");
			} else {
				yield* this.owner.apply_damage(this.leg_damage_on_toggle * 0.5, "fire", "l_leg");
				yield* this.owner.apply_damage(this.leg_damage_on_toggle * 0.5, "fire", "r_leg");
			}
		}
		if (this.owner.m_intent != "walk") {
			if (!iscultist(this.owner)) {
				to_chat(this.owner, `<span class='warning'>Your leg${number_legs > 1 ? "s shiver" : " shivers"} with pain!</span>`);
			} else {
				to_chat(this.owner, `<span class='warning'>Your leg${number_legs > 1 ? "s burn" : " burns"} with pain!</span>`);
			}
			yield* this.owner.toggle_move_intent();
		}
		return 1;
	}
	return 0;
}, true);

// debuffs.dm:139
rt.def("/datum/status_effect/belligerent/proc/on_remove", function* on_remove(f: Frame) {
	if (this.owner.m_intent != "walk") return f.dot;
	yield* this.owner.toggle_move_intent();
	return f.dot;
}, true);

rt.type(935, "/datum/status_effect/maniamotor", "/datum/status_effect", {
	motor: null,
	severity: 0,
	warned_turnoff: 0,
	warned_outofsight: 0,
	id: "maniamotor",
	duration: -1,
	tick_interval: 10,
	status_type: 0,
	alert_type: null,
}, { global: { mania_messages: 637, flee_messages: 638, turnoff_messages: 639, powerloss_messages: 640 } });

// debuffs.dm:162
rt.def("/datum/status_effect/maniamotor/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, new_motor: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.motor = new_motor;
	return f.dot;
}, true);

// debuffs.dm:168
rt.def("/datum/status_effect/maniamotor/proc/Destroy", function* Destroy(f: Frame) {
	this.motor = null;
	return (yield* parent_proc());
}, true);

// debuffs.dm:171
rt.def("/datum/status_effect/maniamotor/proc/tick", function* tick(f: Frame) {
	let pickedmessage: Value = null;
	let $0: any, $1: any, $2: any;
	let is_servant: Value = is_servant_of_ratvar(this.owner);
	let span_part: Value = this.severity > 50 ? "" : "_small";
	if (!this.motor || this.motor.gc_destroyed) {
		if (!is_servant) {
			to_chat(this.owner, `<span class='sevtug${span_part}'>You feel a frustrated voice quietly fade from your mind...</span>`);
		}
		yield* qdel(this);
		return f.dot;
	}
	if (!this.motor.active) {
		if (!is_servant && !this.warned_turnoff) {
			if (this.motor.total_accessable_power() > this.motor.mania_cost) {
				to_chat(this.owner, `<span class='sevtug${span_part}'>"${text2ratvar(pick(GLOB.turnoff_messages))}"</span>`);
			} else {
				pickedmessage = pick(GLOB.powerloss_messages);
				$0 = this.owner;
				$1 = span_part;
				if (rt.index(GLOB.powerloss_messages, pickedmessage)) {
					$2 = `${text2ratvar(pickedmessage)}`;
				} else {
					$2 = pickedmessage;
				}
				to_chat($0, `<span class='sevtug${$1}'>${$2}</span>`);
			}
			this.warned_turnoff = 1;
		}
		this.severity = max(this.severity - 2, 0);
		if (!this.severity) {
			yield* qdel(this);
			return f.dot;
		}
	} else {
		if (prob(this.severity * 2)) {
			this.warned_turnoff = 0;
		}
		if (!rt.isIn(f, this.owner, viewers(7, this.motor))) {
			if (!is_servant && !this.warned_outofsight) {
				to_chat(this.owner, `<span class='sevtug${span_part}'>"${text2ratvar(pick(GLOB.flee_messages))}"</span>`);
				this.warned_outofsight = 1;
			}
			this.severity = max(this.severity - 1, 0);
			if (!this.severity) {
				yield* qdel(this);
				return f.dot;
			}
		} else if (prob(this.severity * 2)) {
			this.warned_outofsight = 0;
		}
	}
	if (is_servant) {
		if (this.owner.hallucination) {
			this.owner.hallucination = 0;
		}
		if (this.owner.druggy) {
			yield* this.owner.adjust_drugginess(-this.owner.druggy);
		}
		if (this.owner.dizziness) {
			this.owner.dizziness = 0;
		}
		if (this.owner.confused) {
			this.owner.confused = 0;
		}
		this.severity = 0;
	} else {
		if (!(!this.owner.null_rod_check() && this.owner.stat != 2 && this.severity)) return f.dot;
		if (this.owner.getToxLoss() > MANIA_DAMAGE_TO_CONVERT) {
			if (is_eligible_servant(this.owner)) {
				to_chat(this.owner, `<span class='sevtug${span_part}'>"${text2ratvar("You are mine and his, now.")}"</span>`);
				yield* add_servant_of_ratvar(this.owner);
			}
			yield* this.owner.Unconscious(100);
		} else {
			if (prob(this.severity * 0.15)) {
				to_chat(this.owner, `<span class='sevtug${span_part}'>"${text2ratvar(pick(GLOB.mania_messages))}"</span>`);
			}
			this.owner.playsound_local(rt.getStep(f, this.motor, 0), GLOB.hum, this.severity, 1);
			yield* this.owner.adjust_drugginess(max(0, min(max(this.severity * 0.075, 1), max(0, 50 - this.owner.druggy))));
			if (this.owner.hallucination < 50) {
				this.owner.hallucination = min(this.owner.hallucination + max(this.severity * 0.075, 1), 50);
			}
			if (this.owner.dizziness < 50) {
				this.owner.dizziness = min(this.owner.dizziness + round(this.severity * 0.05, 1), 50);
			}
			if (this.owner.confused < 25) {
				this.owner.confused = min(this.owner.confused + round(this.severity * 0.025, 1), 25);
			}
			yield* this.owner.adjustToxLoss(this.severity * 0.02, 1, 1);
		}
		this.severity--;
	}
	return f.dot;
}, true);

rt.type(937, "/datum/status_effect/crusher_mark", "/datum/status_effect", {
	marked_underlay: null,
	hammer_synced: null,
	id: "crusher_mark",
	duration: 300,
	status_type: 2,
	alert_type: null,
});

// debuffs.dm:248
rt.def("/datum/status_effect/crusher_mark/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, new_hammer_synced: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.hammer_synced = new_hammer_synced;
	return f.dot;
}, true);

// debuffs.dm:253
rt.def("/datum/status_effect/crusher_mark/proc/on_apply", function on_apply(f: Frame) {
	if (this.owner.mob_size >= MOB_SIZE_LARGE) {
		this.marked_underlay = mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "shield2");
		this.marked_underlay.pixel_x = -this.owner.pixel_x;
		this.marked_underlay.pixel_y = -this.owner.pixel_y;
		this.owner.underlays += this.marked_underlay;
		return 1;
	}
	return 0;
});

// debuffs.dm:264
rt.def("/datum/status_effect/crusher_mark/proc/Destroy", function* Destroy(f: Frame) {
	this.hammer_synced = null;
	if (this.owner) {
		this.owner.underlays -= this.marked_underlay;
	}
	yield* qdel(this.marked_underlay);
	this.marked_underlay = null;
	return (yield* parent_proc());
}, true);

// debuffs.dm:269
rt.def("/datum/status_effect/crusher_mark/proc/be_replaced", function* be_replaced(f: Frame) {
	this.owner.underlays -= this.marked_underlay;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(938, "/datum/status_effect/saw_bleed", "/datum/status_effect", {
	bleed_overlay: null,
	bleed_underlay: null,
	bleed_amount: 3,
	bleed_buildup: 3,
	delay_before_decay: 5,
	bleed_damage: 200,
	needs_to_bleed: 0,
	id: "saw_bleed",
	duration: -1,
	tick_interval: 6,
	alert_type: null,
});

// debuffs.dm:287
rt.def("/datum/status_effect/saw_bleed/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		this.owner.cut_overlay(this.bleed_overlay);
		this.owner.underlays -= this.bleed_underlay;
	}
	yield* qdel(this.bleed_overlay);
	this.bleed_overlay = null;
	return (yield* parent_proc());
}, true);

// debuffs.dm:293
rt.def("/datum/status_effect/saw_bleed/proc/on_apply", function on_apply(f: Frame) {
	if (this.owner.stat == 2) {
		return 0;
	}
	this.bleed_overlay = mutable_appearance(rt.rsc("icons/effects/bleed.dmi"), `bleed${this.bleed_amount}`);
	this.bleed_underlay = mutable_appearance(rt.rsc("icons/effects/bleed.dmi"), `bleed${this.bleed_amount}`);
	let I: Value = icon(this.owner.icon, this.owner.icon_state, this.owner.dir);
	let icon_height: Value = I.Height();
	this.bleed_overlay.pixel_x = -this.owner.pixel_x;
	this.bleed_overlay.pixel_y = Floor(icon_height * 0.25);
	this.bleed_overlay.transform = matrix() * (icon_height / rt.world().icon_size);
	this.bleed_underlay.pixel_x = -this.owner.pixel_x;
	this.bleed_underlay.transform = matrix() * (icon_height / rt.world().icon_size) * 3;
	this.bleed_underlay.alpha = 40;
	this.owner.add_overlay(this.bleed_overlay);
	this.owner.underlays += this.bleed_underlay;
	return parent_proc();
});

// debuffs.dm:310
rt.def("/datum/status_effect/saw_bleed/proc/tick", function* tick(f: Frame) {
	if (this.owner.stat == 2) {
		yield* qdel(this);
	} else {
		yield* this.add_bleed(-1);
	}
	return f.dot;
}, true);

// debuffs.dm:316
rt.def("/datum/status_effect/saw_bleed/proc/add_bleed", function* add_bleed(f: Frame, amount: Value) {
	this.owner.cut_overlay(this.bleed_overlay);
	this.owner.underlays -= this.bleed_underlay;
	if (this.bleed_amount += amount) {
		if (this.bleed_amount >= 10) {
			this.needs_to_bleed = 1;
			yield* qdel(this);
		} else {
			if (amount > 0) {
				this.tick_interval += this.delay_before_decay;
			}
			this.bleed_overlay.icon_state = `bleed${this.bleed_amount}`;
			this.bleed_underlay.icon_state = `bleed${this.bleed_amount}`;
			this.owner.add_overlay(this.bleed_overlay);
			this.owner.underlays += this.bleed_underlay;
		}
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// debuffs.dm:335
rt.def("/datum/status_effect/saw_bleed/proc/on_remove", function* on_remove(f: Frame) {
	let _T: Value = null, d: Value = null;
	if (this.needs_to_bleed) {
		yield* new_(T("/obj/effect/temp_visual/bleed/explode"), (_T = rt.getStep(f, this.owner, 0)));
		for (d of each(GLOB.alldirs)) {
			yield* new_(T("/obj/effect/temp_visual/dir_setting/bloodsplatter"), _T, d);
		}
		playsound(_T, "desceration", 200, 1, -1);
		yield* this.owner.adjustBruteLoss(this.bleed_damage);
	} else {
		yield* new_(T("/obj/effect/temp_visual/bleed"), rt.getStep(f, this.owner, 0));
	}
	return f.dot;
}, true);
