// Based on /tg/station's code/modules/spells/spell.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, add } = rt;


// spell.dm:12
rt.def("/datum/controller/global_vars/proc/InitGlobalspells", function InitGlobalspells(f: Frame) {
	GLOB.spells = typesof(T("/obj/effect/proc_holder/spell"));
	this.gvars_datum_init_order += "spells";
	return f.dot;
});

rt.type(11221, "/obj/effect/proc_holder", "/obj/effect", {
	panel: "Debug",
	active: 0,
	ranged_mousepointer: null,
	ranged_ability_user: null,
	ranged_clickcd_override: -1,
});

// spell.dm:16
rt.def("/obj/effect/proc_holder/proc/Destroy", function* Destroy(f: Frame) {
	if (this.ranged_ability_user) {
		yield* this.remove_ranged_ability();
	}
	return (yield* parent_proc());
}, true);

// spell.dm:20
rt.def("/obj/effect/proc_holder/proc/InterceptClickOn", function* InterceptClickOn(f: Frame, caller: Value, params: Value, A: Value) {
	if (caller.ranged_ability != this || this.ranged_ability_user != caller) {
		to_chat(caller, `<span class='warning'><b>${caller.ranged_ability.name}</b> has been disabled.`);
		yield* caller.ranged_ability.remove_ranged_ability();
		return 1;
	}
	if (this.ranged_clickcd_override >= 0) {
		this.ranged_ability_user.next_click = rt.worldTime(f) + this.ranged_clickcd_override;
	} else {
		this.ranged_ability_user.next_click = rt.worldTime(f) + 6;
	}
	yield* this.ranged_ability_user.face_atom(A);
	return 0;
}, true);

// spell.dm:32
rt.def("/obj/effect/proc_holder/proc/add_ranged_ability", function* add_ranged_ability(f: Frame, user: Value, msg: Value, forced: Value) {
	if (!user || !user.client) {
		return f.dot;
	}
	if (user.ranged_ability && user.ranged_ability != this) {
		if (forced) {
			to_chat(user, `<span class='warning'><b>${user.ranged_ability.name}</b> has been replaced by <b>${this.name}</b>.`);
			yield* user.ranged_ability.remove_ranged_ability();
		} else {
			return f.dot;
		}
	}
	user.ranged_ability = this;
	user.client.click_intercept = user.ranged_ability;
	this.add_mousepointer(user.client);
	this.ranged_ability_user = user;
	if (msg) {
		to_chat(this.ranged_ability_user, msg);
	}
	this.active = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// spell.dm:50
rt.def("/obj/effect/proc_holder/proc/add_mousepointer", function add_mousepointer(f: Frame, C: Value) {
	if (!(C && this.ranged_mousepointer && C.mouse_pointer_icon == rt.initial(f, C, "mouse_pointer_icon"))) return f.dot;
	C.mouse_pointer_icon = this.ranged_mousepointer;
	return f.dot;
});

// spell.dm:54
rt.def("/obj/effect/proc_holder/proc/remove_mousepointer", function remove_mousepointer(f: Frame, C: Value) {
	if (!(C && this.ranged_mousepointer && C.mouse_pointer_icon == this.ranged_mousepointer)) return f.dot;
	C.mouse_pointer_icon = rt.initial(f, C, "mouse_pointer_icon");
	return f.dot;
});

// spell.dm:58
rt.def("/obj/effect/proc_holder/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame, msg: Value) {
	if (!this.ranged_ability_user || !this.ranged_ability_user.client || this.ranged_ability_user.ranged_ability && this.ranged_ability_user.ranged_ability != this) {
		return f.dot;
	}
	this.ranged_ability_user.ranged_ability = null;
	this.ranged_ability_user.client.click_intercept = null;
	this.remove_mousepointer(this.ranged_ability_user.client);
	if (msg) {
		to_chat(this.ranged_ability_user, msg);
	}
	this.ranged_ability_user = null;
	this.active = 0;
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(11274, "/obj/effect/proc_holder/spell", "/obj/effect/proc_holder", {
	sound: null,
	school: "evocation",
	charge_type: "recharge",
	charge_max: 100,
	charge_counter: 0,
	still_recharging_msg: "<span class='notice'>The spell is still recharging.</span>",
	recharging: 1,
	holder_var_type: "bruteloss",
	holder_var_amount: 20,
	clothes_req: 1,
	cult_req: 0,
	human_req: 0,
	nonabstract_req: 0,
	stat_allowed: 0,
	phase_allowed: 0,
	invocation: "HURP DURP",
	invocation_emote_self: null,
	invocation_type: "none",
	range: 7,
	message: "",
	selection_type: "view",
	spell_level: 0,
	level_max: 4,
	cooldown_min: 0,
	player_lock: 1,
	overlay: 0,
	overlay_icon: rt.rsc("icons/obj/wizard.dmi"),
	overlay_icon_state: "spell",
	overlay_lifespan: 0,
	sparks_spread: 0,
	sparks_amt: 0,
	smoke_spread: 0,
	smoke_amt: 0,
	critfailchance: 0,
	centcom_cancast: 1,
	action_icon: rt.rsc("icons/mob/actions.dmi"),
	action_icon_state: "spell_default",
	action_background_icon_state: "bg_spell",
	action: null,
	anchored: 1,
	pass_flags: 1,
	name: "Spell",
	desc: "A wizard spell",
	panel: "Spells",
	density: 0,
	opacity: 0,
});

// spell.dm:129
rt.def("/obj/effect/proc_holder/spell/proc/cast_check", function* cast_check(f: Frame, skipcharge: Value, user: Value) {
	let _T: Value = null, H: Value = null, casting_clothes: Value = null;
	skipcharge ??= 0;
	user ??= f.usr;
	if (this.player_lock) {
		if (!user.mind || !rt.isIn(f, this, user.mind.spell_list) && !rt.isIn(f, this, user.mob_spell_list)) {
			to_chat(user, "<span class='warning'>You shouldn't have this spell! Something's wrong.</span>");
			return 0;
		}
	} else if (!rt.isIn(f, this, user.mob_spell_list)) {
		return 0;
	}
	if ((_T = rt.getStep(f, user, 0)).z == 1 && !this.centcom_cancast) {
		to_chat(user, "<span class='notice'>You can't cast this spell here.</span>");
		return 0;
	}
	if (!skipcharge) {
		if (this.charge_type === "recharge") {
			if (this.charge_counter < this.charge_max) {
				to_chat(user, this.still_recharging_msg);
				return 0;
			}
		} else if (this.charge_type === "charges") {
			if (!this.charge_counter) {
				to_chat(user, `<span class='notice'>${this.name} has no charges left.</span>`);
				return 0;
			}
		}
	}
	if (user.stat && !this.stat_allowed) {
		to_chat(user, "<span class='notice'>Not when you're incapacitated.</span>");
		return 0;
	}
	if (!this.phase_allowed && rt.istype(user.loc, T("/obj/effect/dummy"))) {
		to_chat(user, `<span class='notice'>${this.name} cannot be cast unless you are completely manifested in the material plane.</span>`);
		return 0;
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		H = user;
		if ((this.invocation_type == "whisper" || this.invocation_type == "shout") && H.is_muzzled()) {
			to_chat(user, "<span class='notice'>You can't get the words out!</span>");
			return 0;
		}
		casting_clothes = typecacheof(list(T("/obj/item/clothing/suit/wizrobe"), T("/obj/item/clothing/suit/space/hardsuit/wizard"), T("/obj/item/clothing/head/wizard"), T("/obj/item/clothing/head/helmet/space/hardsuit/wizard"), T("/obj/item/clothing/suit/space/hardsuit/shielded/wizard"), T("/obj/item/clothing/head/helmet/space/hardsuit/shielded/wizard")));
		if (this.clothes_req) {
			if (!is_type_in_typecache(H.wear_suit, casting_clothes)) {
				to_chat(H, "<span class='notice'>I don't feel strong enough without my robe.</span>");
				return 0;
			}
			if (!is_type_in_typecache(H.head, casting_clothes)) {
				to_chat(H, "<span class='notice'>I don't feel strong enough without my hat.</span>");
				return 0;
			}
		}
		if (this.cult_req) {
			if (!rt.istype(H.wear_suit, T("/obj/item/clothing/suit/magusred")) && !rt.istype(H.wear_suit, T("/obj/item/clothing/suit/space/hardsuit/cult"))) {
				to_chat(H, "<span class='notice'>I don't feel strong enough without my armor.</span>");
				return 0;
			}
			if (!rt.istype(H.head, T("/obj/item/clothing/head/magus")) && !rt.istype(H.head, T("/obj/item/clothing/head/helmet/space/hardsuit/cult"))) {
				to_chat(H, "<span class='notice'>I don't feel strong enough without my helmet.</span>");
				return 0;
			}
		}
	} else {
		if (this.clothes_req || this.human_req) {
			to_chat(user, "<span class='notice'>This spell can only be cast by humans!</span>");
			return 0;
		}
		if (this.nonabstract_req && (rt.istype(user, T("/mob/living/brain")) || rt.istype(user, T("/mob/living/silicon/pai")))) {
			to_chat(user, "<span class='notice'>This spell can only be cast by physical beings!</span>");
			return 0;
		}
	}
	if (!skipcharge) {
		if (this.charge_type === "recharge") {
			this.charge_counter = 0;
		} else if (this.charge_type === "charges") {
			this.charge_counter--;
		} else if (this.charge_type === "holdervar") {
			yield* this.adjust_var(user, this.holder_var_type, this.holder_var_amount);
		}
	}
	if (this.action) {
		yield* this.action.UpdateButtonIcon();
	}
	return 1;
}, true);

// spell.dm:211
rt.def("/obj/effect/proc_holder/spell/proc/invocation", function* invocation(f: Frame, user: Value) {
	user ??= f.usr;
	if (this.invocation_type === "shout") {
		if (prob(50)) {
			yield* user.say(this.invocation);
		} else {
			yield* user.say(replacetext(this.invocation, " ", "`"));
		}
	} else if (this.invocation_type === "whisper") {
		if (prob(50)) {
			yield* user.whisper(this.invocation);
		} else {
			yield* user.whisper(replacetext(this.invocation, " ", "`"));
		}
	} else if (this.invocation_type === "emote") {
		user.visible_message(this.invocation, this.invocation_emote_self);
	}
	return f.dot;
}, true);

// spell.dm:226
rt.def("/obj/effect/proc_holder/spell/proc/playMagSound", function playMagSound(f: Frame) {
	playsound(rt.getStep(f, f.usr, 0), this.sound, 50, 1);
	return f.dot;
});

// spell.dm:229
rt.def("/obj/effect/proc_holder/spell/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.action = (yield* new_(T("/datum/action/spell_action"), this));
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	this.still_recharging_msg = `<span class='notice'>${this.name} is still recharging.</span>`;
	this.charge_counter = this.charge_max;
	return f.dot;
}, true);

// spell.dm:237
rt.def("/obj/effect/proc_holder/spell/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	yield* qdel(this.action);
	return (yield* parent_proc());
}, true);

// spell.dm:242
rt.def("/obj/effect/proc_holder/spell/proc/Click", function* Click(f: Frame) {
	if (yield* this.cast_check()) {
		yield* this.choose_targets();
	}
	return 1;
}, true);

// spell.dm:256
rt.def("/obj/effect/proc_holder/spell/proc/process", function* process(f: Frame) {
	if (!(this.recharging && this.charge_type == "recharge" && this.charge_counter < this.charge_max)) return f.dot;
	if (!((this.charge_counter += 2) >= this.charge_max)) return f.dot;
	yield* this.action.UpdateButtonIcon();
	this.charge_counter = this.charge_max;
	this.recharging = 0;
	return f.dot;
}, true, { waitfor: false });

// spell.dm:264
rt.def("/obj/effect/proc_holder/spell/proc/perform", function* perform(f: Frame, targets: Value, recharge: Value, user: Value) {
	recharge ??= 1;
	user ??= f.usr;
	yield* this.before_cast(targets);
	yield* this.invocation(user);
	if (user && user.ckey) {
		user.log_message(`<span class='danger'>cast the spell ${this.name}.</span>`, "Attack log");
	}
	if (recharge) {
		this.recharging = 1;
	}
	if (this.sound) {
		this.playMagSound();
	}
	if (prob(this.critfailchance)) {
		yield* this.critfail(targets);
	} else {
		yield* this.cast(targets, { user: user });
	}
	yield* this.after_cast(targets);
	if (!this.action) return f.dot;
	yield* this.action.UpdateButtonIcon();
	return f.dot;
}, true);

// spell.dm:282
rt.def("/obj/effect/proc_holder/spell/proc/before_cast", function* before_cast(f: Frame, targets: Value) {
	let target: Value = null, location: Value = null, spell: Value = null;
	if (!this.overlay) return f.dot;
	for (target of each(targets, T("/atom"))) {
		location = null;
		if (rt.istype(target, T("/mob/living"))) {
			location = target.loc;
		} else if (isturf(target)) {
			location = target;
		}
		(spell = (yield* new_(T("/obj/effect/overlay"), location))).icon = this.overlay_icon;
		spell.icon_state = this.overlay_icon_state;
		spell.anchored = 1;
		spell.density = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), spell)), this.overlay_lifespan, 8);
	}
	return f.dot;
}, true);

// spell.dm:296
rt.def("/obj/effect/proc_holder/spell/proc/after_cast", function* after_cast(f: Frame, targets: Value) {
	let target: Value = null, location: Value = null, smoke: Value = null;
	for (target of each(targets, T("/atom"))) {
		location = null;
		if (rt.istype(target, T("/mob/living"))) {
			location = target.loc;
		} else if (isturf(target)) {
			location = target;
		}
		if (rt.istype(target, T("/mob/living")) && rt.sv(f, "message")) {
			to_chat(target, `${rt.sv(f, "message")}`);
		}
		if (this.sparks_spread) {
			yield* do_sparks(this.sparks_amt, 0, location);
		}
		if (this.smoke_spread) {
			if (this.smoke_spread == 1) {
				yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(this.smoke_amt, location);
				yield* smoke.start();
			} else if (this.smoke_spread == 2) {
				yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/bad")))).set_up(this.smoke_amt, location);
				yield* smoke.start();
			} else if (this.smoke_spread == 3) {
				yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/sleeping")))).set_up(this.smoke_amt, location);
				yield* smoke.start();
			}
		}
	}
	return f.dot;
}, true);

// spell.dm:328
rt.def("/obj/effect/proc_holder/spell/proc/revert_cast", function* revert_cast(f: Frame, user: Value) {
	user ??= f.usr;
	if (this.charge_type === "recharge") {
		this.charge_counter = this.charge_max;
	} else if (this.charge_type === "charges") {
		this.charge_counter++;
	} else if (this.charge_type === "holdervar") {
		yield* this.adjust_var(user, this.holder_var_type, -this.holder_var_amount);
	}
	if (!this.action) return f.dot;
	yield* this.action.UpdateButtonIcon();
	return f.dot;
}, true);

// spell.dm:339
rt.def("/obj/effect/proc_holder/spell/proc/adjust_var", function* adjust_var(f: Frame, target: Value, type: Value, amount: Value) {
	target ??= f.usr;
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	if (type === "bruteloss") {
		yield* target.adjustBruteLoss(amount);
	} else if (type === "fireloss") {
		yield* target.adjustFireLoss(amount);
	} else if (type === "toxloss") {
		yield* target.adjustToxLoss(amount);
	} else if (type === "oxyloss") {
		yield* target.adjustOxyLoss(amount);
	} else if (type === "stun") {
		yield* target.AdjustStun(amount);
	} else if (type === "knockdown") {
		yield* target.AdjustKnockdown(amount);
	} else if (type === "unconscious") {
		yield* target.AdjustUnconscious(amount);
	} else {
		rt.modAt(target.vars, type, amount, add);
	}
	return f.dot;
}, true);

rt.type(11275, "/obj/effect/proc_holder/spell/targeted", "/obj/effect/proc_holder/spell", {
	max_targets: 1,
	target_ignore_prev: 1,
	include_user: 0,
	random_target: 0,
	random_target_priority: 1,
});

// spell.dm:371
rt.def("/obj/effect/proc_holder/spell/targeted/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let possible_targets: Value = null, target: Value = null, i: Value = null, target_3: Value = null, target_1: Value = null, M: Value = null, L: Value = null;
	let $e: any;
	user ??= f.usr;
	let targets: Value = list();
	if (this.max_targets === 0) {
		for (target_1 of each(view_or_range(this.range, user, this.selection_type), T("/mob/living"))) {
			if (!this.can_target(target_1)) {
				continue;
			}
			targets += target_1;
		}
	} else if (this.max_targets === 1) {
		if (this.range < 0) {
			targets += user;
		} else {
			possible_targets = list();
			for (M of each(view_or_range(this.range, user, this.selection_type), T("/mob/living"))) {
				if (!this.include_user && user == M) {
					continue;
				}
				if (!this.can_target(M)) {
					continue;
				}
				possible_targets += M;
			}
			M = null;
			if (!this.random_target) {
				M = (yield* g.op(f, "Prompt", [9], [null, null, "Targeting", "Choose the target for the spell.", possible_targets]));
			} else if (this.random_target_priority === TARGET_RANDOM) {
				M = pick(possible_targets);
			} else if (this.random_target_priority === TARGET_CLOSEST) {
				for (L of each(possible_targets, T("/mob/living"))) {
					if (M) {
						if (get_dist(user, L) < get_dist(user, M)) {
							if (yield* this.los_check(user, L)) {
								M = L;
							}
						}
					} else if (yield* this.los_check(user, L)) {
						M = L;
					}
				}
			}
			if (rt.isIn(f, M, view_or_range(this.range, user, this.selection_type))) {
				targets += M;
			}
		}
	} else {
		possible_targets = list();
		for (target of each(view_or_range(this.range, user, this.selection_type), T("/mob/living"))) {
			if (!this.can_target(target)) {
				continue;
			}
			possible_targets += target;
		}
		i = 1;
		while (i <= this.max_targets) {
			if (!rt.len(f, possible_targets)) {
				break;
			}
			if (this.target_ignore_prev) {
				possible_targets -= (target_3 = pick(possible_targets));
				targets += target_3;
			} else {
				targets += pick(possible_targets);
			}
			i++;
		}
	}
	if (!this.include_user && rt.isIn(f, user, targets)) {
		targets -= user;
	}
	if (!rt.len(f, targets)) {
		yield* this.revert_cast(user);
		return f.dot;
	}
	yield* this.perform(targets, { user: user });
	return f.dot;
}, true);

rt.type(11344, "/obj/effect/proc_holder/spell/aoe_turf", "/obj/effect/proc_holder/spell", {
	inner_radius: -1,
});

// spell.dm:438
rt.def("/obj/effect/proc_holder/spell/aoe_turf/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	let targets: Value = list();
	for (target of each(view_or_range(this.range, user, this.selection_type), T("/turf"))) {
		if (!this.can_target(target)) {
			continue;
		}
		if (!rt.isIn(f, target, view_or_range(this.inner_radius, user, this.selection_type))) {
			targets += target;
		}
	}
	if (!rt.len(f, targets)) {
		yield* this.revert_cast();
		return f.dot;
	}
	yield* this.perform(targets, { user: user });
	return f.dot;
}, true);

// spell.dm:453
rt.def("/obj/effect/proc_holder/spell/proc/updateButtonIcon", function* updateButtonIcon(f: Frame) {
	yield* this.action.UpdateButtonIcon();
	return f.dot;
}, true);

// spell.dm:456
rt.def("/obj/effect/proc_holder/spell/proc/can_be_cast_by", function can_be_cast_by(f: Frame, caster: Value) {
	if ((this.human_req || this.clothes_req) && !rt.istype(caster, T("/mob/living/carbon/human"))) {
		return 0;
	}
	return 1;
});

// spell.dm:462
rt.def("/obj/effect/proc_holder/spell/targeted/proc/los_check", function* los_check(f: Frame, A: Value, B: Value) {
	let dummy: Value = null, turf: Value = null, AM: Value = null;
	(rt.modField(f, (dummy = (yield* new_(T("/obj"), A.loc))), "pass_flags", 1, rt.bitOr));
	for (turf of each(getline(A, B), T("/turf"))) {
		AM = null;
		for (AM of each(turf, T("/atom/movable"))) {
			if (!(yield* AM.CanPass(dummy, turf, 1))) {
				yield* qdel(dummy);
				return 0;
			}
		}
	}
	yield* qdel(dummy);
	return 1;
}, true);

// spell.dm:473
rt.def("/obj/effect/proc_holder/spell/proc/can_cast", function can_cast(f: Frame, user: Value) {
	user ??= f.usr;
	if ((!user.mind || !rt.isIn(f, this, user.mind.spell_list)) && !rt.isIn(f, this, user.mob_spell_list)) {
		return 0;
	}
	if (this.charge_type === "recharge") {
		if (this.charge_counter < this.charge_max) {
			return 0;
		}
	} else if (this.charge_type === "charges") {
		if (!this.charge_counter) {
			return 0;
		}
	}
	if (user.stat && !this.stat_allowed) {
		return 0;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		if (this.clothes_req || this.human_req) {
			return 0;
		}
		if (this.nonabstract_req && (rt.istype(user, T("/mob/living/brain")) || rt.istype(user, T("/mob/living/silicon/pai")))) {
			return 0;
		}
	}
	return 1;
});

rt.type(11375, "/obj/effect/proc_holder/spell/self", "/obj/effect/proc_holder/spell", {
	range: -1,
});

// spell.dm:498
rt.def("/obj/effect/proc_holder/spell/self/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	user ??= f.usr;
	if (!user) {
		yield* this.revert_cast();
		return f.dot;
	}
	yield* this.perform(null, { user: user });
	return f.dot;
}, true);

rt.type(11376, "/obj/effect/proc_holder/spell/self/basic_heal", "/obj/effect/proc_holder/spell/self", {
	human_req: 1,
	clothes_req: 0,
	charge_max: 100,
	cooldown_min: 50,
	invocation: "Victus sano!",
	invocation_type: "whisper",
	school: "restoration",
	sound: rt.rsc("sound/magic/staff_healing.ogg"),
	name: "Lesser Heal",
	desc: "Heals a small amount of brute and burn damage.",
});

// spell.dm:517
rt.def("/obj/effect/proc_holder/spell/self/basic_heal/proc/cast", function* cast(f: Frame, user: Value) {
	user.visible_message(`<span class='warning'>A wreath of gentle light passes over ${user}!</span>`, "<span class='notice'>You wreath yourself in healing light!</span>");
	yield* user.adjustBruteLoss(-10);
	yield* user.adjustFireLoss(-10);
	return f.dot;
}, true);
