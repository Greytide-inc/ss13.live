// Based on /tg/station's code/game/objects/obj_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5107, "/obj", "/atom/movable", {
	crit_fail: 0,
	throwforce: 0,
	in_use: 0,
	damtype: "brute",
	force: 0,
	armor: null,
	obj_integrity: 500,
	max_integrity: 500,
	integrity_failure: 0,
	resistance_flags: 0,
	acid_level: 0,
	being_shocked: 0,
	on_blueprints: 0,
	force_blueprints: 0,
	persistence_replacement: null,
	unique_rename: 0,
	current_skin: null,
	unique_reskin: null,
	dangerous_possession: 0,
	req_access: null,
	req_access_txt: "0",
	req_one_access: null,
	req_one_access_txt: "0",
	layer: 3,
	animate_movement: 2,
});

// obj_defense.dm:5
rt.def("/obj/proc/take_damage", function* take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value, attack_dir: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	sound_effect ??= 1;
	if (sound_effect) {
		this.play_attack_sound(damage_amount, damage_type, damage_flag);
	}
	if (!(!rt.bitAnd(this.resistance_flags, 64) && this.obj_integrity > 0)) return f.dot;
	if (!((damage_amount = (yield* this.run_obj_armor(damage_amount, damage_type, damage_flag, attack_dir))) >= 1)) return f.dot;
	f.dot = damage_amount;
	this.obj_integrity = max(this.obj_integrity - damage_amount, 0);
	if (this.obj_integrity <= 0) {
		yield* this.obj_destruction(damage_flag);
	} else {
		if (!this.integrity_failure) return f.dot;
		if (!(this.obj_integrity <= this.integrity_failure)) return f.dot;
		yield* this.obj_break(damage_flag);
	}
	return f.dot;
}, true);

// obj_defense.dm:19
rt.def("/obj/proc/run_obj_armor", function run_obj_armor(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, attack_dir: Value) {
	damage_flag ??= 0;
	if (damage_type === "brute" || damage_type === "fire") {
	} else {
		return 0;
	}
	let armor_protection: Value = 0;
	if (damage_flag) {
		armor_protection = rt.index(this.armor, damage_flag);
	}
	return round(damage_amount * (100 - armor_protection) * 0.01, 0.1);
});

// obj_defense.dm:31
rt.def("/obj/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this, rt.rsc("sound/weapons/smash.ogg"), 50, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// obj_defense.dm:41
rt.def("/obj/proc/hitby", function* hitby(f: Frame, AM: Value) {
	let O: Value = null;
	yield* parent_proc();
	let tforce: Value = 0;
	if (ismob(AM)) {
		tforce = 10;
	} else if (rt.istype(AM, T("/obj"))) {
		tforce = (O = AM).throwforce;
	}
	yield* this.take_damage(tforce, "brute", "melee", 1, rt.getDir(f, this, AM));
	return f.dot;
}, true);

// obj_defense.dm:51
rt.def("/obj/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (rt.bitAnd(this.resistance_flags, INDESTRUCTIBLE)) {
		return f.dot;
	}
	yield* parent_proc();
	if (target == this) {
		yield* qdel(this);
		return f.dot;
	}
	if (severity === 1) {
		yield* qdel(this);
	} else if (severity === 2) {
		yield* this.take_damage(rand(100, 250), "brute", "bomb", 0);
	} else if (severity === 3) {
		yield* this.take_damage(rand(10, 90), "brute", "bomb", 0);
	}
	return f.dot;
}, true, { waitfor: false });

// obj_defense.dm:66
rt.def("/obj/proc/bullet_act", function* bullet_act(f: Frame) {
	f.dot = (yield* parent_proc());
	playsound(this, f.args[0].hitsound, 50, 1);
	this.visible_message(fmt("<span class='danger'>＀ is hit by ＇！!</span>", [this, f.args[0]]), null, null, 3);
	yield* this.take_damage(f.args[0].damage, f.args[0].damage_type, f.args[0].flag, 0, turn(f.args[0].dir, 180));
	return f.dot;
}, true, { args: ["P"] });

// obj_defense.dm:75
rt.def("/obj/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent == "harm") {
		yield* parent_proc(user, 1);
		this.visible_message(`<span class='danger'>${user} smashes ${this}!</span>`, null, null, 3);
		if (this.density) {
			playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
			yield* user.say(pick(";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"));
		} else {
			playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		}
		yield* this.take_damage(this.hulk_damage(), "brute", "melee", 0, rt.getDir(f, this, user));
		return 1;
	}
	return 0;
}, true);

// obj_defense.dm:88
rt.def("/obj/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let _T: Value = null;
	if (isturf(this.loc)) {
		if ((_T = this.loc).intact && this.level == 1) {
			return f.dot;
		}
	}
	yield* this.take_damage(400, "brute", "melee", 0, rt.getDir(f, this, B));
	return f.dot;
}, true);

// obj_defense.dm:95
rt.def("/obj/proc/attack_generic", function* attack_generic(f: Frame, user: Value, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value) {
	damage_amount ??= 0;
	damage_type ??= "brute";
	damage_flag ??= 0;
	sound_effect ??= 1;
	yield* user.do_attack_animation(this);
	user.changeNext_move(8);
	return (yield* this.take_damage(damage_amount, damage_type, damage_flag, sound_effect, rt.getDir(f, this, user)));
}, true);

// obj_defense.dm:100
rt.def("/obj/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	if (!(yield* this.attack_generic(user, 60, "brute", "melee", 0))) return f.dot;
	playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 100, 1);
	return f.dot;
}, true);

// obj_defense.dm:104
rt.def("/obj/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let play_soundeffect: Value = null;
	if (!M.melee_damage_upper && !M.obj_damage) {
		yield* M.emote("custom", { message: `${M.friendly} ${this}.` });
		return 0;
	} else {
		play_soundeffect = 1;
		if (M.environment_smash) {
			play_soundeffect = 0;
		}
		if (M.obj_damage) {
			f.dot = (yield* this.attack_generic(M, M.obj_damage, M.melee_damage_type, "melee", play_soundeffect));
		} else {
			f.dot = (yield* this.attack_generic(M, rand(M.melee_damage_lower, M.melee_damage_upper), M.melee_damage_type, "melee", play_soundeffect));
		}
		if (!(f.dot && !play_soundeffect)) return f.dot;
		playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
	}
	return f.dot;
}, true);

// obj_defense.dm:119
rt.def("/obj/proc/attack_slime", function* attack_slime(f: Frame, user: Value) {
	if (!user.is_adult) {
		return f.dot;
	}
	yield* this.attack_generic(user, rand(10, 15), "melee", 1);
	return f.dot;
}, true);

// obj_defense.dm:124
rt.def("/obj/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	yield* M.do_attack_animation(this);
	let play_soundeffect: Value = 0;
	let mech_damtype: Value = M.damtype;
	if (M.selected) {
		mech_damtype = M.selected.damtype;
		play_soundeffect = 1;
	} else if (M.damtype === "brute") {
		playsound(this, rt.rsc("sound/weapons/punch4.ogg"), 50, 1);
	} else if (M.damtype === "fire") {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 50, 1);
	} else if (M.damtype === "tox") {
		playsound(this, rt.rsc("sound/effects/spray2.ogg"), 50, 1);
		return 0;
	} else {
		return 0;
	}
	this.visible_message(`<span class='danger'>${M.name} has hit ${this}.</span>`, null, null, 3);
	return (yield* this.take_damage(M.force * 3, mech_damtype, "melee", play_soundeffect, rt.getDir(f, this, M)));
}, true);

// obj_defense.dm:145
rt.def("/obj/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* this.ex_act(1);
	if (this && !(!this || this.gc_destroyed)) {
		yield* qdel(this);
	}
	return 2;
}, true);

// obj_defense.dm:153
rt.def("/datum/controller/global_vars/proc/InitGlobalacid_overlay", function InitGlobalacid_overlay(f: Frame) {
	GLOB.acid_overlay = mutable_appearance(rt.rsc("icons/effects/effects.dmi"), "acid");
	this.gvars_datum_init_order += "acid_overlay";
	return f.dot;
});

// obj_defense.dm:157
rt.def("/obj/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	if (!(!rt.bitAnd(this.resistance_flags, UNACIDABLE) && acid_volume)) return f.dot;
	if (!this.acid_level) {
		rt.setAt(GLOB.SSacid.processing, this, this);
		this.add_overlay(GLOB.acid_overlay, 1);
	}
	let acid_cap: Value = acidpwr * 300;
	if (this.acid_level < acid_cap) {
		this.acid_level = min(this.acid_level + acidpwr * acid_volume, acid_cap);
	}
	return 1;
});

// obj_defense.dm:170
rt.def("/obj/proc/acid_processing", function* acid_processing(f: Frame) {
	let armour_value: Value = null;
	f.dot = 1;
	if (!rt.bitAnd(this.resistance_flags, ACID_PROOF)) {
		for (armour_value of each(this.armor)) {
			if (armour_value != "acid" && armour_value != "fire") {
				rt.setAt(this.armor, armour_value, max(rt.index(this.armor, armour_value) - round(rt.op(f, "Sqrt", [], [this.acid_level]) * 0.1), 0));
			}
		}
		if (prob(33)) {
			playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 150, 1);
		}
		yield* this.take_damage(min(1 + round(rt.op(f, "Sqrt", [], [this.acid_level]) * 0.3), 300), "fire", "acid", 0);
	}
	this.acid_level = max(this.acid_level - (5 + 3 * round(rt.op(f, "Sqrt", [], [this.acid_level]))), 0);
	if (this.acid_level) return f.dot;
	return 0;
}, true);

// obj_defense.dm:184
rt.def("/obj/proc/acid_melt", function* acid_melt(f: Frame) {
	GLOB.SSacid.processing -= this;
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// obj_defense.dm:190
rt.def("/obj/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	let _T: Value = null;
	if (isturf(this.loc)) {
		if ((_T = this.loc).intact && this.level == 1) {
			return f.dot;
		}
	}
	if (exposed_temperature && !rt.bitAnd(this.resistance_flags, FIRE_PROOF)) {
		yield* this.take_damage(max(0, min(0.02 * exposed_temperature, 20)), "fire", "fire", 0);
	}
	if (!(!rt.bitAnd(this.resistance_flags, 8) && rt.bitAnd(this.resistance_flags, 4))) return f.dot;
	(rt.modSrcVar(f, "resistance_flags", 8, rt.bitOr));
	rt.setAt(GLOB.SSfire_burning.processing, this, this);
	this.add_overlay(GLOB.fire_overlay, 1);
	return 1;
}, true);

// obj_defense.dm:204
rt.def("/obj/proc/burn", function* burn(f: Frame) {
	if (rt.bitAnd(this.resistance_flags, 8)) {
		GLOB.SSfire_burning.processing -= this;
	}
	yield* this.deconstruct(0);
	return f.dot;
}, true);

// obj_defense.dm:209
rt.def("/obj/proc/extinguish", function extinguish(f: Frame) {
	if (!rt.bitAnd(this.resistance_flags, 8)) return f.dot;
	(rt.modSrcVar(f, "resistance_flags", 16777207, rt.bitAnd));
	this.cut_overlay(GLOB.fire_overlay, 1);
	GLOB.SSfire_burning.processing -= this;
	return f.dot;
});

// obj_defense.dm:218
rt.def("/obj/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	this.being_shocked = 1;
	let power_bounced: Value = power / 2;
	yield* tesla_zap(this, 3, power_bounced);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/proc/reset_shocked"))), 10);
	return f.dot;
}, true);

// obj_defense.dm:227
rt.def("/obj/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* qdel(this);
	return f.dot;
}, true);

// obj_defense.dm:235
rt.def("/obj/proc/obj_destruction", function* obj_destruction(f: Frame, damage_flag: Value) {
	if (damage_flag == "acid") {
		yield* this.acid_melt();
	} else if (damage_flag == "fire") {
		yield* this.burn();
	} else {
		yield* this.deconstruct(0);
	}
	return f.dot;
}, true);

// obj_defense.dm:245
rt.def("/obj/proc/modify_max_integrity", function* modify_max_integrity(f: Frame, new_max: Value, can_break: Value, damage_type: Value, new_failure_integrity: Value) {
	let percentage: Value = null;
	can_break ??= 1;
	damage_type ??= "brute";
	let current_integrity: Value = this.obj_integrity;
	let current_max: Value = this.max_integrity;
	if (current_integrity != 0 && current_max != 0) {
		percentage = current_integrity / current_max;
		this.obj_integrity = (current_integrity = max(1, round(percentage * new_max)));
	}
	this.max_integrity = new_max;
	if (new_failure_integrity !== null) {
		this.integrity_failure = new_failure_integrity;
	}
	if (can_break && this.integrity_failure && current_integrity <= this.integrity_failure) {
		yield* this.obj_break(damage_type);
		return 1;
	}
	return 0;
}, true);

// obj_defense.dm:265
rt.def("/obj/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	CRASH("Unimplemented GetExplosionBlock()");
	return f.dot;
});
