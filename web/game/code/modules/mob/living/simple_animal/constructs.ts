// Based on /tg/station's code/modules/mob/living/simple_animal/constructs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4863, "/mob/living/simple_animal/hostile/construct", "/mob/living/simple_animal/hostile", {
	construct_spells: null,
	playstyle_string: "<b>You are a generic construct! Your job is to not exist, and you should probably adminhelp this.</b>",
	master: null,
	seeking: 0,
	can_repair_constructs: 0,
	can_repair_self: 0,
	pressure_resistance: 100,
	initial_language_holder: rt.typePath("/datum/language_holder/construct"),
	name: "Construct",
	real_name: "Construct",
	desc: "",
	gender: "neuter",
	speak_emote: null,
	response_help: "thinks better of touching",
	response_disarm: "flails at",
	response_harm: "punches",
	speak_chance: 1,
	icon: rt.rsc("icons/mob/mob.dmi"),
	speed: 0,
	a_intent: "harm",
	stop_automated_movement: 1,
	status_flags: 8,
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	see_in_dark: 7,
	lighting_alpha: 128,
	damage_coeff: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	healable: 0,
	faction: null,
	movement_type: 2,
	unique_name: 1,
	AIStatus: 3,
	loot: null,
	del_on_death: 1,
	deathmessage: "collapses in a shattered heap.",
});

// constructs.dm:33
rt.def("/mob/living/simple_animal/hostile/construct/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list();

	this.speak_emote = list("hisses");
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);

	this.faction = list("cult");

	this.loot = list(T("/obj/item/weapon/ectoplasm"));
	return f.dot;
});

// constructs.dm:41
rt.def("/mob/living/simple_animal/hostile/construct/proc/Initialize", function* Initialize(f: Frame) {
	let spell: Value = null;
	f.dot = (yield* parent_proc());
	this.update_health_hud();
	for (spell of each(this.construct_spells)) {
		yield* this.AddSpell((yield* new_(spell, null)));
	}
	return f.dot;
}, true);

// constructs.dm:47
rt.def("/mob/living/simple_animal/hostile/construct/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	to_chat(this, this.playstyle_string);
	return f.dot;
}, true);

// constructs.dm:51
rt.def("/mob/living/simple_animal/hostile/construct/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = this.p_they(1);
	let t_s: Value = this.p_s();
	let msg: Value = fmt("<span class='cult'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [bicon(this), this]);
	msg += `${this.desc}\n`;
	if (this.health < this.maxHealth) {
		msg += "<span class='warning'>";
		if (this.health >= this.maxHealth / 2) {
			msg += `${t_He} look${t_s} slightly dented.\n`;
		} else {
			msg += `<b>${t_He} look${t_s} severely dented!</b>\n`;
		}
		msg += "</span>";
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});

// constructs.dm:67
rt.def("/mob/living/simple_animal/hostile/construct/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let C: Value = null;
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/construct"))) {
		if (!(C = M).can_repair_constructs || C == this && !C.can_repair_self) {
			return f.dot;
		}
		if (this.health < this.maxHealth) {
			yield* this.adjustHealth(-5);
			if (this != M) {
				yield* this.Beam(M, { icon_state: "sendbeam", time: 4 });
				M.visible_message(fmt("<span class='danger'>＀ repairs some of ％<b>！'s</b> dents.</span>", [M, this]), `<span class='cult'>You repair some of <b>${this}'s</b> dents, leaving <b>${this}</b> at <b>${this.health}/${this.maxHealth}</b> health.</span>`);
			} else {
				M.visible_message(`<span class='danger'>${M} repairs some of ${this.p_their()} own dents.</span>`, `<span class='cult'>You repair some of your own dents, leaving you at <b>${M.health}/${M.maxHealth}</b> health.</span>`);
			}
		} else if (this != M) {
			to_chat(M, `<span class='cult'>You cannot repair <b>${this}'s</b> dents, as ${this.p_they()} ${this.p_have()} none!</span>`);
		} else {
			to_chat(M, "<span class='cult'>You cannot repair your own dents, as you have none!</span>");
		}
	} else {
		if (this == M) return f.dot;
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// constructs.dm:98
rt.def("/mob/living/simple_animal/hostile/construct/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.args[1]) return f.dot;
	this.update_health_hud();
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

rt.type(4864, "/mob/living/simple_animal/hostile/construct/armored", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<b>You are a Juggernaut. Though slow, your shell can withstand extreme punishment, create shield walls, rip apart enemies and walls alike, and even deflect energy weapons.</b>",
	name: "Juggernaut",
	real_name: "Juggernaut",
	desc: "A massive, armored construct built to spearhead attacks and soak up enemy fire.",
	icon_state: "behemoth",
	icon_living: "behemoth",
	maxHealth: 250,
	health: 250,
	response_harm: "harmlessly punches",
	harm_intent_damage: 0,
	obj_damage: 90,
	melee_damage_lower: 30,
	melee_damage_upper: 30,
	attacktext: "smashes their armored gauntlet into",
	speed: 3,
	environment_smash: 2,
	attack_sound: rt.rsc("sound/weapons/punch3.ogg"),
	status_flags: 0,
	mob_size: 3,
	force_threshold: 11,
	construct_spells: null,
});

// constructs.dm:123
rt.def("/mob/living/simple_animal/hostile/construct/armored/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall"));
	return f.dot;
});

// constructs.dm:132
rt.def("/mob/living/simple_animal/hostile/construct/armored/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	let reflectchance: Value = null, new_x: Value = null, new_y: Value = null, curloc: Value = null;
	if (rt.istype(_P, T("/obj/item/projectile/energy")) || rt.istype(_P, T("/obj/item/projectile/beam"))) {
		if (prob((reflectchance = 80 - round(_P.damage / 3)))) {
			yield* this.apply_damage(_P.damage * 0.5, _P.damage_type);
			this.visible_message(`<span class='danger'>The ${_P.name} is reflected by ${this}'s armored shell!</span>`, `<span class='userdanger'>The ${_P.name} is reflected by your armored shell!</span>`);
			if (_P.starting) {
				new_x = _P.starting.x + pick(0, 0, -1, 1, -2, 2, -2, 2, -2, 2, -3, 3, -3, 3);
				new_y = _P.starting.y + pick(0, 0, -1, 1, -2, 2, -2, 2, -2, 2, -3, 3, -3, 3);
				curloc = rt.getStep(f, this, 0);
				_P.original = rt.locate(new_x, new_y, _P.z);
				_P.starting = curloc;
				_P.current = curloc;
				_P.firer = this;
				_P.yo = new_y - curloc.y;
				_P.xo = new_x - curloc.x;
			}
			return -1;
		}
	}
	return (yield* parent_proc(_P));
}, true);

rt.type(4866, "/mob/living/simple_animal/hostile/construct/wraith", "/mob/living/simple_animal/hostile/construct", {
	attack_refund: 10,
	crit_refund: 50,
	kill_refund: 250,
	playstyle_string: "<b>You are a Wraith. Though relatively fragile, you are fast, deadly, can phase through walls, and your attacks will lower the cooldown on phasing.</b>",
	name: "Wraith",
	real_name: "Wraith",
	desc: "A wicked, clawed shell constructed to assassinate enemies and sow chaos behind enemy lines.",
	icon_state: "floating",
	icon_living: "floating",
	maxHealth: 75,
	health: 75,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	retreat_distance: 2,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	construct_spells: null,
});

// constructs.dm:173
rt.def("/mob/living/simple_animal/hostile/construct/wraith/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift"));
	return f.dot;
});

// constructs.dm:181
rt.def("/mob/living/simple_animal/hostile/construct/wraith/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let prev_stat: Value = null, L: Value = null, S: Value = null;
	if (rt.istype(this.target, T("/mob/living")) && !iscultist(this.target)) {
		prev_stat = (L = this.target).stat;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot && isnum(prev_stat))) return f.dot;
	L = this.target;
	let refund: Value = 0;
	if (!L || L.gc_destroyed || L.stat == 2 && prev_stat != 2) {
		refund += this.kill_refund;
	} else if (L.InCritical() && prev_stat == 0) {
		refund += this.crit_refund;
	}
	if (L.stat != 2 && prev_stat != 2) {
		refund += this.attack_refund;
	}
	for (S of each(this.mob_spell_list, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt/shift"))) {
		S.charge_counter = min(S.charge_counter + refund, S.charge_max);
	}
	return f.dot;
}, true);

rt.type(4868, "/mob/living/simple_animal/hostile/construct/builder", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<b>You are an Artificer. You are incredibly weak and fragile, but you are able to construct fortifications, use magic missile, repair allied constructs, shades, and yourself (by clicking on them), <i>and, most important of all,</i> create new constructs by producing soulstones to capture souls, and shells to place those soulstones into.</b>",
	can_repair_constructs: 1,
	can_repair_self: 1,
	name: "Artificer",
	real_name: "Artificer",
	desc: "A bulbous construct dedicated to building and maintaining the Cult of Nar-Sie's armies.",
	icon_state: "artificer",
	icon_living: "artificer",
	maxHealth: 50,
	health: 50,
	response_harm: "viciously beats",
	harm_intent_damage: 5,
	obj_damage: 60,
	melee_damage_lower: 5,
	melee_damage_upper: 5,
	retreat_distance: 10,
	minimum_distance: 10,
	attacktext: "rams",
	environment_smash: 2,
	attack_sound: rt.rsc("sound/weapons/punch2.ogg"),
	construct_spells: null,
});

// constructs.dm:223
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser"), T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile/lesser"));
	return f.dot;
});

// constructs.dm:236
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/Found", function Found(f: Frame, A: Value) {
	let C: Value = null;
	if (rt.istype(A, T("/mob/living/simple_animal/hostile/construct"))) {
		if ((C = A).health < C.maxHealth) {
			return 1;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
});

// constructs.dm:246
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	if (this.see_invisible < the_target.invisibility) {
		return 0;
	}
	if (!(this.Found(the_target) || parent_proc())) return f.dot;
	return 1;
}, false);

// constructs.dm:252
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/MoveToTarget", function* MoveToTarget(f: Frame, possible_targets: Value) {
	let L: Value = null;
	yield* parent_proc();
	if (!rt.istype(this.target, T("/mob/living"))) return f.dot;
	if (rt.istype((L = this.target), T("/mob/living/simple_animal/hostile/construct")) && L.health >= L.maxHealth) {
		yield* this.LoseTarget();
		return 0;
	}
	if (!(L.health <= this.melee_damage_lower + this.melee_damage_upper)) return f.dot;
	this.retreat_distance = null;
	this.minimum_distance = 1;
	return f.dot;
}, true);

// constructs.dm:263
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/Aggro", function* Aggro(f: Frame) {
	yield* parent_proc();
	if (!rt.istype(this.target, T("/mob/living/simple_animal/hostile/construct"))) return f.dot;
	this.retreat_distance = null;
	this.minimum_distance = 1;
	return f.dot;
}, true);

// constructs.dm:269
rt.def("/mob/living/simple_animal/hostile/construct/builder/proc/LoseAggro", function LoseAggro(f: Frame) {
	parent_proc();
	this.retreat_distance = rt.initial(f, this, "retreat_distance");
	this.minimum_distance = rt.initial(f, this, "minimum_distance");
	return f.dot;
});

rt.type(4870, "/mob/living/simple_animal/hostile/construct/builder/noncult", "/mob/living/simple_animal/hostile/construct/builder", {
	construct_spells: null,
});

// constructs.dm:279
rt.def("/mob/living/simple_animal/hostile/construct/builder/noncult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/wall"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/floor"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/soulstone/noncult"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct/lesser"), T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile/lesser"));
	return f.dot;
});

rt.type(4871, "/mob/living/simple_animal/hostile/construct/harvester", "/mob/living/simple_animal/hostile/construct", {
	playstyle_string: "<B>You are a Harvester. You are incapable of directly killing humans, but your attacks will remove their limbs: Bring those who still cling to this world of illusion back to the Geometer so they may know Truth. Your form and any you are pulling can pass through runed walls effortlessly.</B>",
	can_repair_constructs: 1,
	name: "Harvester",
	real_name: "Harvester",
	desc: "A long, thin construct built to herald Nar-Sie's rise. It'll be all over soon.",
	icon_state: "chosen",
	icon_living: "chosen",
	maxHealth: 60,
	health: 60,
	sight: 4,
	melee_damage_lower: 15,
	melee_damage_upper: 20,
	attacktext: "butchers",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	construct_spells: null,
});

// constructs.dm:300
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.construct_spells = list(T("/obj/effect/proc_holder/spell/aoe_turf/area_conversion"), T("/obj/effect/proc_holder/spell/aoe_turf/conjure/lesserforcewall"));
	return f.dot;
});

// constructs.dm:308
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/Bump", function* Bump(f: Frame, AM: Value) {
	let stored_pulling: Value = null;
	f.dot = (yield* parent_proc());
	if (!(rt.istype(AM, T("/turf/closed/wall/mineral/cult")) && AM != this.loc)) return f.dot;
	if (stored_pulling = this.pulling) {
		yield* stored_pulling.setDir(rt.getDir(f, stored_pulling.loc, this.loc));
		yield* stored_pulling.forceMove(this.loc);
	}
	yield* this.forceMove(AM);
	if (!stored_pulling) return f.dot;
	yield* this.start_pulling(stored_pulling, 1);
	return f.dot;
}, true);

// constructs.dm:319
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let C: Value = null, parts: Value = null, undismembermerable_limbs: Value = null, X: Value = null, BP: Value = null, BP_3: Value = null;
	if (rt.istype(this.target, T("/mob/living/carbon"))) {
		C = this.target;
		parts = list();
		undismembermerable_limbs = 0;
		for (X of each(C.bodyparts)) {
			if ((BP = X).body_part != HEAD && BP.body_part != CHEST) {
				if (BP.dismemberable) {
					parts += BP;
				} else {
					undismembermerable_limbs++;
				}
			}
		}
		if (!rt.length(parts)) {
			if (undismembermerable_limbs) {
				return (yield* parent_proc());
			}
			yield* C.Knockdown(60);
			this.visible_message(`<span class='danger'>${this} knocks ${C} down!</span>`);
			to_chat(this, `<span class='cultlarge'>"Bring ${C.p_them()} to me."</span>`);
			return 0;
		}
		yield* this.do_attack_animation(C);
		yield* (BP_3 = pick(parts)).dismember();
		return 0;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// constructs.dm:344
rt.def("/mob/living/simple_animal/hostile/construct/harvester/proc/Initialize", function* Initialize(f: Frame) {
	let seek: Value = null;
	f.dot = (yield* parent_proc());
	yield* (seek = (yield* new_(T("/datum/action/innate/seek_prey")))).Grant(this);
	yield* seek.Activate();
	return f.dot;
}, true);

rt.type(163, "/datum/action/innate/seek_master", "/datum/action/innate", {
	tracking: 0,
	the_construct: null,
	name: "Seek your Master",
	desc: "You and your master share a soul-link that informs you of their location",
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	button_icon_state: "cult_mark",
});

// constructs.dm:362
rt.def("/datum/action/innate/seek_master/proc/Grant", function* Grant(f: Frame, C: Value) {
	this.the_construct = C;
	yield* parent_proc();
	return f.dot;
}, true);

// constructs.dm:366
rt.def("/datum/action/innate/seek_master/proc/Activate", function Activate(f: Frame) {
	if (!GLOB.SSticker.mode.eldergod) {
		this.the_construct.master = GLOB.blood_target;
	}
	if (!this.the_construct.master) {
		to_chat(this.the_construct, "<span class='cultitalic'>You have no master to seek!</span>");
		this.the_construct.seeking = 0;
		return f.dot;
	}
	if (this.tracking) {
		this.tracking = 0;
		this.the_construct.seeking = 0;
		to_chat(this.the_construct, "<span class='cultitalic'>You are no longer tracking your master.</span>");
		return f.dot;
	} else {
		this.tracking = 1;
		this.the_construct.seeking = 1;
		to_chat(this.the_construct, "<span class='cultitalic'>You are now tracking your master.</span>");
	}
	return f.dot;
});

rt.type(164, "/datum/action/innate/seek_prey", "/datum/action/innate", {
	the_construct: null,
	name: "Seek the Harvest",
	desc: "None can hide from Nar'Sie, activate to track a survivor attempting to flee the red harvest!",
	background_icon_state: "bg_demon",
	buttontooltipstyle: "cult",
	button_icon_state: "cult_mark",
});

// constructs.dm:392
rt.def("/datum/action/innate/seek_prey/proc/Grant", function* Grant(f: Frame, C: Value) {
	this.the_construct = C;
	yield* parent_proc();
	return f.dot;
}, true);

// constructs.dm:396
rt.def("/datum/action/innate/seek_prey/proc/Activate", function Activate(f: Frame) {
	if (GLOB.cult_narsie === null) {
		return f.dot;
	}
	if (this.the_construct.seeking) {
		this.desc = "None can hide from Nar'Sie, activate to track a survivor attempting to flee the red harvest!";
		this.button_icon_state = "cult_mark";
		this.the_construct.seeking = 0;
		to_chat(this.the_construct, "<span class='cultitalic'>You are now tracking Nar'Sie, return to reap the harvest!</span>");
		return f.dot;
	} else {
		if (rt.length(GLOB.cult_narsie.souls_needed)) {
			this.the_construct.master = pick(GLOB.cult_narsie.souls_needed);
			to_chat(this.the_construct, `<span class='cultitalic'>You are now tracking your prey, ${this.the_construct.master} - harvest them!</span>`);
		} else {
			to_chat(this.the_construct, "<span class='cultitalic'>Nar'Sie has completed her harvest!</span>");
			return f.dot;
		}
		this.desc = "Activate to track Nar'Sie!";
		this.button_icon_state = "sintouch";
		this.the_construct.seeking = 1;
	}
	return f.dot;
});

// constructs.dm:420
rt.def("/mob/living/simple_animal/hostile/construct/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!this.hud_used) return f.dot;
	if (this.health >= this.maxHealth) {
		this.hud_used.healths.icon_state = `${this.icon_state}_health0`;
	} else if (this.health > this.maxHealth * 0.8) {
		this.hud_used.healths.icon_state = `${this.icon_state}_health2`;
	} else if (this.health > this.maxHealth * 0.6) {
		this.hud_used.healths.icon_state = `${this.icon_state}_health3`;
	} else if (this.health > this.maxHealth * 0.4) {
		this.hud_used.healths.icon_state = `${this.icon_state}_health4`;
	} else if (this.health > this.maxHealth * 0.2) {
		this.hud_used.healths.icon_state = `${this.icon_state}_health5`;
	} else {
		this.hud_used.healths.icon_state = `${this.icon_state}_health6`;
	}
	return f.dot;
});
