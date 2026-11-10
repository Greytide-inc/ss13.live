// Based on /tg/station's code/modules/mob/living/living_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


// living_defense.dm:3
rt.def("/mob/living/proc/run_armor_check", function run_armor_check(f: Frame, def_zone: Value, attack_flag: Value, absorb_text: Value, soften_text: Value, armour_penetration: Value, penetrated_text: Value) {
	let armor: Value = null;
	attack_flag ??= "melee";
	if ((armor = this.getarmor(def_zone, attack_flag)) && armour_penetration) {
		armor = max(0, armor - armour_penetration);
		if (penetrated_text) {
			to_chat(this, `<span class='userdanger'>${penetrated_text}</span>`);
		} else {
			to_chat(this, "<span class='userdanger'>Your armor was penetrated!</span>");
		}
	} else if (armor >= 100) {
		if (absorb_text) {
			to_chat(this, `<span class='userdanger'>${absorb_text}</span>`);
		} else {
			to_chat(this, "<span class='userdanger'>Your armor absorbs the blow!</span>");
		}
	} else if (armor > 0) {
		if (soften_text) {
			to_chat(this, `<span class='userdanger'>${soften_text}</span>`);
		} else {
			to_chat(this, "<span class='userdanger'>Your armor softens the blow!</span>");
		}
	}
	return armor;
});

// living_defense.dm:46
rt.def("/mob/living/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	let armor: Value = this.run_armor_check(def_zone, _P.flag, "", "", _P.armour_penetration);
	if (!_P.nodamage) {
		yield* this.apply_damage(_P.damage, _P.damage_type, def_zone, armor);
		if (_P.dismemberment) {
			yield* this.check_projectile_dismemberment(_P, def_zone);
		}
	}
	return (yield* _P.on_hit(this, armor));
}, true);

// living_defense.dm:57
rt.def("/obj/item/proc/get_volume_by_throwforce_and_or_w_class", function get_volume_by_throwforce_and_or_w_class(f: Frame) {
	if (this.throwforce && this.w_class) {
		return max(30, min((this.throwforce + this.w_class) * 5, 100));
	}
	if (this.w_class) {
		return max(20, min(this.w_class * 8, 100));
	}
	return 0;
});

// living_defense.dm:65
rt.def("/mob/living/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, zone: Value = null, dtype: Value = null, volume: Value = null, W: Value = null, armor: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/item"))) {
		I = f.args[0];
		zone = ran_zone("chest", 65);
		dtype = "brute";
		volume = I.get_volume_by_throwforce_and_or_w_class();
		if (rt.istype(I, T("/obj/item/weapon"))) {
			dtype = (W = I).damtype;
			if (W.throwforce > 0) {
				if (W.throwhitsound) {
					playsound(this.loc, W.throwhitsound, volume, 1, -1);
				} else if (W.hitsound) {
					playsound(this.loc, W.hitsound, volume, 1, -1);
				} else if (!W.throwhitsound) {
					playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), volume, 1, -1);
				}
			}
		} else if (!I.throwhitsound && I.throwforce > 0) {
			playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), volume, 1, -1);
		}
		if (!I.throwforce) {
			playsound(this.loc, rt.rsc("sound/weapons/throwtap.ogg"), 1, volume, -1);
		}
		if (!f.args[3]) {
			this.visible_message(`<span class='danger'>${this} has been hit by ${I}.</span>`, `<span class='userdanger'>${this} has been hit by ${I}.</span>`);
			armor = this.run_armor_check(zone, "melee", `Your armor has protected your ${parse_zone(zone)}.`, `Your armor has softened hit to your ${parse_zone(zone)}.`, I.armour_penetration);
			yield* this.apply_damage(I.throwforce, dtype, zone, armor);
			if (I.thrownby) {
				add_logs(I.thrownby, this, "hit", I);
			}
		} else {
			return 1;
		}
	} else {
		playsound(this.loc, rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// living_defense.dm:101
rt.def("/mob/living/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	if (M.occupant.a_intent == "harm") {
		yield* M.do_attack_animation(this);
		if (M.damtype == "brute") {
			yield* step_away(this, M, 15);
		}
		if (M.damtype === "brute") {
			yield* this.Unconscious(20);
			yield* this.take_overall_damage(rand(M.force / 2, M.force));
			playsound(this, rt.rsc("sound/weapons/punch4.ogg"), 50, 1);
		} else if (M.damtype === "fire") {
			yield* this.take_overall_damage(0, rand(M.force / 2, M.force));
			playsound(this, rt.rsc("sound/items/welder.ogg"), 50, 1);
		} else if (M.damtype === "tox") {
			yield* M.mech_toxin_damage(this);
		} else {
			return f.dot;
		}
		yield* this.updatehealth();
		this.visible_message(`<span class='danger'>${M.name} has hit ${this}!</span>`, `<span class='userdanger'>${M.name} has hit ${this}!</span>`, null, 3);
		add_logs(M.occupant, this, "attacked", M, `(INTENT: ${uppertext(M.occupant.a_intent)}) (DAMTYPE: ${uppertext(M.damtype)})`);
	} else {
		yield* step_away(this, M);
		add_logs(M.occupant, this, "pushed", M);
		this.visible_message(`<span class='warning'>${M} pushes ${this} out of the way.</span>`, null, null, 5);
	}
	return f.dot;
}, true);

// living_defense.dm:127
rt.def("/mob/living/proc/fire_act", function* fire_act(f: Frame) {
	yield* this.adjust_fire_stacks(3);
	yield* this.IgniteMob();
	return f.dot;
}, true);

// living_defense.dm:131
rt.def("/mob/living/proc/grabbedby", function* grabbedby(f: Frame, user: Value, supress_message: Value) {
	supress_message ??= 0;
	if (user == this || this.anchored || !isturf(user.loc)) {
		return 0;
	}
	if (!user.pulling || user.pulling != this) {
		yield* user.start_pulling(this, supress_message);
		return f.dot;
	}
	if (!rt.bitAnd(this.status_flags, 8)) {
		to_chat(user, `<span class='warning'>${this} can't be grabbed more aggressively!</span>`);
		return 0;
	}
	yield* this.grippedby(user);
	return f.dot;
}, true);

// living_defense.dm:144
rt.def("/mob/living/proc/grippedby", function* grippedby(f: Frame, user: Value) {
	let old_grab_state: Value = null, grab_upgrade_time: Value = null;
	if (!(user.grab_state < 3)) return f.dot;
	user.changeNext_move(10);
	playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
	if (user.grab_state) {
		old_grab_state = user.grab_state;
		grab_upgrade_time = 30;
		this.visible_message(`<span class='danger'>${user} starts to tighten ${user.p_their()} grip on ${this}!</span>`, `<span class='userdanger'>${user} starts to tighten ${user.p_their()} grip on you!</span>`);
		if (!(yield* do_mob(user, this, grab_upgrade_time))) {
			return 0;
		}
		if (!user.pulling || user.pulling != this || user.grab_state != old_grab_state || user.a_intent != "grab") {
			return 0;
		}
	}
	user.grab_state++;
	if (user.grab_state === 1) {
		yield* add_logs(user, this, "grabbed", { addition: "aggressively" });
		this.visible_message(`<span class='danger'>${user} has grabbed ${this} aggressively!</span>`, `<span class='userdanger'>${user} has grabbed ${this} aggressively!</span>`);
		yield* this.drop_all_held_items();
		yield* this.stop_pulling();
	} else if (user.grab_state === 2) {
		this.visible_message(`<span class='danger'>${user} has grabbed ${this} by the neck!</span>`, `<span class='userdanger'>${user} has grabbed you by the neck!</span>`);
		yield* this.update_canmove();
		if (!this.buckled && !this.density) {
			yield* this.Move(user.loc);
		}
	} else if (user.grab_state === 3) {
		this.visible_message(`<span class='danger'>${user} is strangling ${this}!</span>`, `<span class='userdanger'>${user} is strangling you!</span>`);
		yield* this.update_canmove();
		if (!this.buckled && !this.density) {
			yield* this.Move(user.loc);
		}
	}
	return 1;
}, true);

// living_defense.dm:181
rt.def("/mob/living/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	if (!GLOB.SSticker.HasRoundStarted()) {
		to_chat(M, "You cannot attack people before the game has started.");
		return f.dot;
	}
	if (M.buckled) {
		if (rt.isIn(f, M, this.buckled_mobs)) {
			yield* M.Feedstop();
		}
		return f.dot;
	}
	if (this.stat == 2) return f.dot;
	add_logs(M, this, "attacked");
	yield* M.do_attack_animation(this);
	this.visible_message(`<span class='danger'>The ${M.name} glomps ${this}!</span>`, `<span class='userdanger'>The ${M.name} glomps ${this}!</span>`, null, 3);
	return 1;
}, true);

// living_defense.dm:198
rt.def("/mob/living/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	yield* M.face_atom(this);
	if (M.melee_damage_upper == 0) {
		M.visible_message(fmt("<span class='notice'>＄！ ＀ ＀!</span>", [M, M.friendly, this]));
		return 0;
	} else {
		if (M.attack_sound) {
			playsound(this.loc, M.attack_sound, 50, 1, 1);
		}
		yield* M.do_attack_animation(this);
		this.visible_message(fmt("<span class='danger'>＄！ ＀ ＀!</span>", [M, M.attacktext, this]), fmt("<span class='userdanger'>＄！ ＀ ＀!</span>", [M, M.attacktext, this]), null, 3);
		add_logs(M, this, "attacked");
		return 1;
	}
}, true);

// living_defense.dm:213
rt.def("/mob/living/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	if (isturf(this.loc) && rt.istype(this.loc.loc, T("/area/start"))) {
		to_chat(M, "No attacking people at spawn, you jackass.");
		return 0;
	}
	if (M.a_intent == "harm") {
		if (M.is_muzzled() || M.wear_mask && rt.bitAnd(M.wear_mask.flags_cover, MASKCOVERSMOUTH)) {
			to_chat(M, "<span class='warning'>You can't bite with your mouth covered!</span>");
			return 0;
		}
		yield* M.do_attack_animation(this, "bite");
		if (prob(75)) {
			add_logs(M, this, "attacked");
			playsound(this.loc, rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1);
			this.visible_message(`<span class='danger'>${M.name} bites ${this}!</span>`, `<span class='userdanger'>${M.name} bites ${this}!</span>`, null, 3);
			return 1;
		} else {
			this.visible_message(`<span class='danger'>${M.name} has attempted to bite ${this}!</span>`, `<span class='userdanger'>${M.name} has attempted to bite ${this}!</span>`, null, 3);
		}
	}
	return 0;
}, true);

// living_defense.dm:234
rt.def("/mob/living/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	if (L.a_intent === "help") {
		this.visible_message(`<span class='notice'>${L.name} rubs its head against ${this}.</span>`);
		return 0;
	} else {
		yield* L.do_attack_animation(this);
		if (prob(90)) {
			add_logs(L, this, "attacked");
			this.visible_message(`<span class='danger'>${L.name} bites ${this}!</span>`, `<span class='userdanger'>${L.name} bites ${this}!</span>`, null, 3);
			playsound(this.loc, rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1);
			return 1;
		} else {
			this.visible_message(`<span class='danger'>${L.name} has attempted to bite ${this}!</span>`, `<span class='userdanger'>${L.name} has attempted to bite ${this}!</span>`, null, 3);
		}
	}
	return 0;
}, true);

// living_defense.dm:253
rt.def("/mob/living/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (M.a_intent === "help") {
		this.visible_message(`<span class='notice'>${M} caresses ${this} with its scythe like arm.</span>`);
		return 0;
	} else if (M.a_intent === "grab") {
		yield* this.grabbedby(M);
		return 0;
	} else if (M.a_intent === "harm") {
		yield* M.do_attack_animation(this);
		return 1;
	} else if (M.a_intent === "disarm") {
		yield* M.do_attack_animation(this, "disarm");
		return 1;
	}
	return f.dot;
}, true);

// living_defense.dm:269
rt.def("/mob/living/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value, origin: Value) {
	if (origin && rt.istype(origin, T("/datum/spacevine_mutation")) && isvineimmune(this)) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// living_defense.dm:276
rt.def("/mob/living/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	yield* this.take_bodypart_damage(acidpwr * min(1, acid_volume * 0.1));
	return 1;
}, true);

// living_defense.dm:280
rt.def("/mob/living/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	siemens_coeff ??= 1;
	safety ??= 0;
	tesla_shock ??= 0;
	illusion ??= 0;
	stun ??= 1;
	let $0: any = tesla_shock;
	if ($0) {
		if (this.secondary_flags) {
			$0 = rt.index(this.secondary_flags, "tesla_ignore");
		} else {
			$0 = 0;
		}
	}
	if ($0) {
		return 0;
	}
	if (!(shock_damage > 0)) return f.dot;
	if (!illusion) {
		yield* this.adjustFireLoss(shock_damage);
	}
	this.visible_message(fmt("<span class='danger'>＀ was shocked by ％！!</span>", [this, source]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
	return shock_damage;
}, true, { argTypes: [{  }, { type: 4, path: "/obj" }, {  }, {  }, {  }, {  }, {  }] });

// living_defense.dm:293
rt.def("/mob/living/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	let L: Value = this.get_contents();
	for (O of each(L, T("/obj"))) {
		yield* O.emp_act(severity);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// living_defense.dm:300
rt.def("/mob/living/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = 20;
	this.investigate_log(`(${key_name(this)}) has been consumed by the singularity.`, "singulo");
	yield* this.gib();
	return gain;
}, true);

// living_defense.dm:305
rt.def("/mob/living/proc/narsie_act", function* narsie_act(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (is_servant_of_ratvar(this) && !this.stat) {
		to_chat(this, "<span class='userdanger'>You resist Nar-Sie's influence... but not all of it. <i>Run!</i></span>");
		yield* this.adjustBruteLoss(35);
		if (this && this.reagents) {
			yield* this.reagents.add_reagent("heparin", 5);
		}
		return 0;
	}
	if (GLOB.cult_narsie && rt.index(GLOB.cult_narsie.souls_needed, this)) {
		GLOB.cult_narsie.resize(1.1);
		GLOB.cult_narsie.souls_needed -= this;
		GLOB.cult_narsie.souls += 1;
		if (GLOB.cult_narsie.souls == GLOB.cult_narsie.soul_goal && GLOB.cult_narsie.resolved == 0) {
			GLOB.cult_narsie.resolved = 1;
			rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/machines/alarm.ogg"))], false);
			yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/cult_ending_helper"), 1)), 120);
			yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/ending_helper"))), 270);
		}
	}
	if (this.client) {
		yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/harvester"), this, { cultoverride: 1 });
	} else {
		const die = rand(1, 6);
		if (die === 1) {
			yield* new_(T("/mob/living/simple_animal/hostile/construct/armored/hostile"), rt.getStep(f, this, 0));
		} else if (die === 2) {
			yield* new_(T("/mob/living/simple_animal/hostile/construct/wraith/hostile"), rt.getStep(f, this, 0));
		} else if (rt.inRange(die, 3, 6)) {
			yield* new_(T("/mob/living/simple_animal/hostile/construct/builder/hostile"), rt.getStep(f, this, 0));
		}
	}
	yield* this.spawn_dust();
	yield* this.gib();
	return 1;
}, true);

// living_defense.dm:339
rt.def("/mob/living/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let M: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.stat != 2 && !is_servant_of_ratvar(this)) {
		for (M of each(this.implants, T("/obj/item/weapon/implant/mindshield"))) {
			yield* qdel(M);
		}
		if (!(yield* add_servant_of_ratvar(this))) {
			to_chat(this, "<span class='userdanger'>A blinding light boils you alive! <i>Run!</i></span>");
			yield* this.adjustFireLoss(35);
			if (this) {
				yield* this.adjust_fire_stacks(1);
				yield* this.IgniteMob();
			}
			return 0;
		}
	}
	return 1;
}, true);

// living_defense.dm:357
rt.def("/mob/living/proc/flash_act", function* flash_act(f: Frame, intensity: Value, override_blindness_check: Value, affect_silicon: Value, visual: Value, type: Value) {
	intensity ??= 1;
	override_blindness_check ??= 0;
	affect_silicon ??= 0;
	visual ??= 0;
	type ??= T("/obj/screen/fullscreen/flash");
	if (!(this.get_eye_protection() < intensity && (override_blindness_check || !rt.bitAnd(this.disabilities, 1)))) return f.dot;
	yield* this.overlay_fullscreen("flash", type);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/proc/clear_fullscreen"), "flash", 25)), 25);
	return 1;
}, true);

// living_defense.dm:372
rt.def("/mob/living/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (f.args[0] != this) {
		f.args[4] = this.get_standard_pixel_y_offset(this.lying);
	}
	if (!f.args[2]) {
		f.args[2] = this.get_active_held_item();
	}
	yield* parent_proc();
	this.floating = 0;
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
