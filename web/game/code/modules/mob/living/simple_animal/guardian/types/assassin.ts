// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/assassin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4873, "/mob/living/simple_animal/hostile/guardian/assassin", "/mob/living/simple_animal/hostile/guardian", {
	toggle: 0,
	stealthcooldown: 160,
	canstealthalert: null,
	instealthalert: null,
	playstyle_string: "<span class='holoparasite'>As an <b>assassin</b> type you do medium damage and have no damage resistance, but can enter stealth, massively increasing the damage of your next attack and causing it to ignore armor. Stealth is broken when you attack or take damage.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Space Ninja, a lethal, invisible assassin.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Assassin modules loaded. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one! It's an assassin carp! Just when you thought it was safe to go back to the water... which is unhelpful, because we're in space.</span>",
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	damage_coeff: null,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode/Assassin"),
});

// assassin.dm:7
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);
	return f.dot;
});

// assassin.dm:20
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.stealthcooldown = 0;
	return f.dot;
}, true);

// assassin.dm:24
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.updatestealthalert();
	if (!(this.loc == this.summoner && this.toggle)) return f.dot;
	yield* this.ToggleMode(0);
	return f.dot;
}, true, { waitfor: false });

// assassin.dm:30
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!(this.stealthcooldown >= rt.worldTime(f))) return f.dot;
	stat(null, `Stealth Cooldown Remaining: ${max(round((this.stealthcooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds`);
	return f.dot;
}, true);

// assassin.dm:36
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!(this.toggle && (rt.istype(this.target, T("/mob/living")) || rt.istype(this.target, T("/obj/structure/window")) || rt.istype(this.target, T("/obj/structure/grille"))))) return f.dot;
	yield* this.ToggleMode(1);
	return f.dot;
}, true);

// assassin.dm:42
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot > 0 && this.toggle)) return f.dot;
	yield* this.ToggleMode(1);
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// assassin.dm:47
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/Recall", function* Recall(f: Frame) {
	if (!((yield* parent_proc()) && this.toggle)) return f.dot;
	yield* this.ToggleMode(0);
	return f.dot;
}, true);

// assassin.dm:52
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/ToggleMode", function* ToggleMode(f: Frame, forced: Value) {
	forced ??= 0;
	if (this.toggle) {
		this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
		this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
		this.armour_penetration = rt.initial(f, this, "armour_penetration");
		this.obj_damage = rt.initial(f, this, "obj_damage");
		this.environment_smash = rt.initial(f, this, "environment_smash");
		this.alpha = rt.initial(f, this, "alpha");
		if (!forced) {
			to_chat(this, "<span class='danger'><B>You exit stealth.</span></B>");
		} else {
			this.visible_message(fmt("<span class='danger'>＄！ suddenly appears!</span>", [this]));
			this.stealthcooldown = rt.worldTime(f) + rt.initial(f, this, "stealthcooldown");
			this.cooldown = rt.worldTime(f) + 40;
		}
		yield* this.updatestealthalert();
		this.toggle = 0;
	} else if (this.stealthcooldown <= rt.worldTime(f)) {
		if (this.loc == this.summoner) {
			to_chat(this, "<span class='danger'><B>You have to be manifested to enter stealth!</span></B>");
			return f.dot;
		}
		this.melee_damage_lower = 50;
		this.melee_damage_upper = 50;
		this.armour_penetration = 100;
		this.obj_damage = 0;
		this.environment_smash = 0;
		yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), rt.getStep(f, this, 0));
		this.alpha = 15;
		if (!forced) {
			to_chat(this, "<span class='danger'><B>You enter stealth, empowering your next attack.</span></B>");
		}
		yield* this.updatestealthalert();
		this.toggle = 1;
	} else {
		if (forced) return f.dot;
		to_chat(this, `<span class='danger'><B>You cannot yet enter stealth, wait another ${max(round((this.stealthcooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds!</span></B>`);
	}
	return f.dot;
}, true);

// assassin.dm:85
rt.def("/mob/living/simple_animal/hostile/guardian/assassin/proc/updatestealthalert", function* updatestealthalert(f: Frame) {
	if (this.stealthcooldown <= rt.worldTime(f)) {
		if (this.toggle) {
			if (!this.instealthalert) {
				this.instealthalert = (yield* this.throw_alert("instealth", T("/obj/screen/alert/instealth")));
				yield* this.clear_alert("canstealth");
				this.canstealthalert = null;
			}
		} else if (!this.canstealthalert) {
			this.canstealthalert = (yield* this.throw_alert("canstealth", T("/obj/screen/alert/canstealth")));
			yield* this.clear_alert("instealth");
			this.instealthalert = null;
		}
	} else {
		yield* this.clear_alert("instealth");
		this.instealthalert = null;
		yield* this.clear_alert("canstealth");
		this.canstealthalert = null;
	}
	return f.dot;
}, true);
