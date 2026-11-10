// Based on /tg/station's code/game/gamemodes/clock_cult/clock_mobs/clockwork_marauder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4861, "/mob/living/simple_animal/hostile/clockwork/marauder", "/mob/living/simple_animal/hostile/clockwork", {
	true_name: "Meme Master 69",
	host: null,
	recovering: 0,
	blockchance: 17,
	counterchance: 30,
	light_range: 2,
	light_power: 1.1,
	name: "clockwork marauder",
	desc: "A stalwart apparition of a soldier, blazing with crimson flames. It's armed with a gladius and shield.",
	icon_state: "clockwork_marauder",
	health: 300,
	maxHealth: 300,
	speed: 1,
	obj_damage: 40,
	melee_damage_lower: 12,
	melee_damage_upper: 12,
	attacktext: "slashes",
	attack_sound: rt.rsc("sound/weapons/bladeslice.ogg"),
	weather_immunities: null,
	movement_type: 2,
	loot: null,
	playstyle_string: "<span class='sevtug'>You are a clockwork marauder</span><b>, a living extension of Sevtug's will. As a marauder, you are somewhat slow, but may block attacks, and have a chance to also counter blocked melee attacks for extra damage, in addition to being immune to extreme temperatures and pressures. Your primary goal is to serve the creature that you are now a part of. You can use <span class='sevtug_small'><i>:b</i></span> to communicate silently with your master, but can only exit if your master calls your true name or if they are exceptionally damaged. \n\nStay near your host to protect and heal them; being too far from your host will rapidly cause you massive damage. Recall to your host if you are too weak and believe you cannot continue fighting safely. As a final note, you should probably avoid harming any fellow servants of Ratvar.</span>",
}, { global: { possible_true_names: 714, damage_heal_order: 715 } });

// clockwork_marauder.dm:14
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.weather_immunities = list("lava");

	this.loot = list(T("/obj/item/clockwork/component/geis_capacitor/fallen_armor"));
	return f.dot;
});

// clockwork_marauder.dm:35
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.true_name = pick(GLOB.possible_true_names);
	return f.dot;
}, true);

// clockwork_marauder.dm:39
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Life", function* Life(f: Frame) {
	yield* parent_proc();
	if (this.is_in_host()) {
		if (!is_servant_of_ratvar(this.host)) {
			yield* this.emerge_from_host(0, 1);
			yield* this.unbind_from_host();
			return f.dot;
		}
		if (!GLOB.ratvar_awakens && this.host.stat == 2) {
			yield* this.death();
			return f.dot;
		}
		if (GLOB.ratvar_awakens) {
			yield* this.adjustHealth(-50);
		} else {
			yield* this.adjustHealth(-10);
		}
		if (!this.recovering) {
			yield* this.heal_host();
		} else if (this.health == this.maxHealth) {
			to_chat(this, "<span class='userdanger'>Your strength has returned. You can once again come forward!</span>");
			to_chat(this.host, "<span class='userdanger'>Your marauder is now strong enough to come forward again!</span>");
			this.recovering = 0;
		}
	} else if (GLOB.ratvar_awakens) {
		yield* this.adjustHealth(-5);
		yield* this.heal_host();
	} else {
		if (!this.host) return f.dot;
		if (!is_servant_of_ratvar(this.host)) {
			yield* this.unbind_from_host();
			return f.dot;
		}
		if (this.host.stat == 2) {
			yield* this.adjustHealth(50);
			to_chat(this, "<span class='userdanger'>Your host is dead!</span>");
			return f.dot;
		}
		if (this.z && this.host.z && this.z == this.host.z) {
			const dist = get_dist(rt.getStep(f, this, 0), rt.getStep(f, this.host, 0));
			if (dist === 2) {
				yield* this.adjustHealth(-1);
			} else if (dist === 3) {
			} else if (dist === 4) {
				yield* this.adjustHealth(1);
			} else if (dist === 5) {
				yield* this.adjustHealth(3);
			} else if (dist === 6) {
				yield* this.adjustHealth(6);
			} else if (dist === 7) {
				yield* this.adjustHealth(9);
			} else if (rt.inRange(dist, 8, 1e+31)) {
				yield* this.adjustHealth(15);
				to_chat(this, "<span class='userdanger'>You're too far from your host and rapidly taking damage!</span>");
			} else {
				yield* this.adjustHealth(-2);
				yield* this.heal_host();
			}
		} else {
			yield* this.adjustHealth(15);
			to_chat(this, "<span class='userdanger'>You're too far from your host and rapidly taking damage!</span>");
		}
	}
	return f.dot;
}, true, { waitfor: false });

// clockwork_marauder.dm:95
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* this.emerge_from_host(0, 1);
	yield* this.unbind_from_host();
	this.visible_message(`<span class='warning'>${this}'s equipment clatters lifelessly to the ground as the red flames within dissipate.</span>`, "<span class='userdanger'>Your equipment falls away. You feel a moment of confusion before your fragile form is annihilated.</span>");
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// clockwork_marauder.dm:102
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/Stat", function* Stat(f: Frame) {
	let resulthealth: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat(null, `Current True Name: ${this.true_name}`);
	let $0: any = null;
	stat($0, `Host: ${this.host ? this.host : "NONE"}`);
	if (this.host) {
		resulthealth = round(this.host.health / this.host.maxHealth * 100, 0.5);
		if (rt.istype(this.host, T("/mob/living/carbon"))) {
			resulthealth = round(rt.op(f, "Abs", [], [-100 - this.host.health]) / rt.op(f, "Abs", [], [-100 - this.host.maxHealth]) * 100);
		}
		stat(null, `Host Health: ${resulthealth}%`);
		if (GLOB.ratvar_awakens) {
			stat(null, `You are ${this.recovering ? "un" : ""}able to deploy!`);
		} else if (resulthealth > MARAUDER_EMERGE_THRESHOLD) {
			stat(null, `You are ${this.recovering ? "unable to deploy" : "able to deploy on hearing your True Name"}!`);
		} else {
			stat(null, `You are ${this.recovering ? "unable to deploy" : "able to deploy to protect your host"}!`);
		}
	}
	stat(null, `You do ${this.melee_damage_upper} damage on melee attacks.`);
	return f.dot;
}, true);

// clockwork_marauder.dm:124
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/bind_to_host", function* bind_to_host(f: Frame, new_host: Value) {
	let SM: Value = null, LM: Value = null;
	if (!new_host) {
		return 0;
	}
	this.host = new_host;
	(SM = (yield* new_(T("/datum/action/innate/summon_marauder")))).linked_marauder = this;
	yield* SM.Grant(this.host);
	(LM = (yield* new_(T("/datum/action/innate/linked_minds")))).linked_marauder = this;
	yield* LM.Grant(this.host);
	return 1;
}, true);

// clockwork_marauder.dm:137
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/unbind_from_host", function* unbind_from_host(f: Frame) {
	let SM: Value = null, LM: Value = null;
	if (this.host) {
		for (SM of each(this.host.actions, T("/datum/action/innate/summon_marauder"))) {
			yield* qdel(SM);
		}
		for (LM of each(this.host.actions, T("/datum/action/innate/linked_minds"))) {
			yield* qdel(LM);
		}
		this.host = null;
		return 1;
	}
	return 0;
}, true);

// clockwork_marauder.dm:147
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/heal_host", function* heal_host(f: Frame) {
	if (!this.host) {
		return f.dot;
	}
	let resulthealth: Value = round(this.host.health / this.host.maxHealth * 100, 0.5);
	if (rt.istype(this.host, T("/mob/living/carbon"))) {
		resulthealth = round(rt.op(f, "Abs", [], [-100 - this.host.health]) / rt.op(f, "Abs", [], [-100 - this.host.maxHealth]) * 100);
	}
	if (!(GLOB.ratvar_awakens || resulthealth <= MARAUDER_EMERGE_THRESHOLD)) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/heal"), this.host.loc, "#AF0AAF");
	yield* this.host.heal_ordered_damage(4, rt.gl("damage_heal_order#3"));
	return f.dot;
}, true);

// clockwork_marauder.dm:157
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/adjustHealth", function* adjustHealth(f: Frame) {
	let L: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[0] > 0) {
		for (L of each(view(2, this), T("/mob/living"))) {
			if (L.is_holding_item_of_type(T("/obj/item/weapon/nullrod"))) {
				to_chat(this, "<span class='userdanger'>The presence of a brandished holy artifact weakens your armor!</span>");
				f.args[0] *= 4;
				break;
			}
		}
	}
	f.dot = (yield* parent_proc());
	if (!(this && f.args[1])) return f.dot;
	this.update_health_hud();
	this.update_stats();
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// clockwork_marauder.dm:169
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/update_health_hud", function update_health_hud(f: Frame) {
	let M: Value = null, resulthealth: Value = null;
	if (!(this.hud_used && this.hud_used.healths)) return f.dot;
	if (rt.istype(this.hud_used, T("/datum/hud/marauder"))) {
		M = this.hud_used;
		if (this.host) {
			if (rt.istype(this.host, T("/mob/living/carbon"))) {
				resulthealth = `${round(rt.op(f, "Abs", [], [-100 - this.host.health]) / rt.op(f, "Abs", [], [-100 - this.host.maxHealth]) * 100)}%`;
			} else {
				resulthealth = `${round(this.host.health / this.host.maxHealth * 100, 0.5)}%`;
			}
		} else {
			resulthealth = "NONE";
		}
		M.hosthealth.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#AF0AAF'>HOST<br>${resulthealth}</font></div>`;
	}
	this.hud_used.healths.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#AF0AAF'>${round(this.health / this.maxHealth * 100, 0.5)}%</font>`;
	return f.dot;
});

// clockwork_marauder.dm:188
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/update_stats", function update_stats(f: Frame) {
	let healthpercent: Value = null;
	if (GLOB.ratvar_awakens) {
		this.speed = 0;
		this.melee_damage_lower = 20;
		this.melee_damage_upper = 20;
		this.attacktext = "devastates";
	} else {
		const subject = (healthpercent = this.health / this.maxHealth * 100);
		if (rt.inRange(subject, 100, 70)) {
			this.speed = 0;
			this.melee_damage_lower = 16;
			this.melee_damage_upper = 16;
			this.attacktext = "viciously slashes";
		} else if (rt.inRange(subject, 70, 40)) {
			this.speed = rt.initial(f, this, "speed");
			this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
			this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
			this.attacktext = rt.initial(f, this, "attacktext");
		} else if (rt.inRange(subject, 40, 30)) {
			this.speed = rt.initial(f, this, "speed");
			this.melee_damage_lower = 10;
			this.melee_damage_upper = 10;
			this.attacktext = "lightly slashes";
		} else if (rt.inRange(subject, 30, 20)) {
			this.speed = 2;
			this.melee_damage_lower = 8;
			this.melee_damage_upper = 8;
			this.attacktext = "lightly slashes";
		} else if (rt.inRange(subject, 20, 10)) {
			this.speed = 3;
			this.melee_damage_lower = 6;
			this.melee_damage_upper = 6;
			this.attacktext = "weakly slashes";
		} else if (rt.inRange(subject, 10, 0)) {
			this.speed = 4;
			this.melee_damage_lower = 4;
			this.melee_damage_upper = 4;
			this.attacktext = "taps";
		}
	}
	return f.dot;
});

// clockwork_marauder.dm:226
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.is_in_host()) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:231
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (yield* this.blockOrCounter(null, Proj)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:236
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/hitby", function* hitby(f: Frame, AM: Value, skipcatch: Value, hitpush: Value, blocked: Value) {
	if (yield* this.blockOrCounter(null, AM)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:241
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (!(rt.istype(M, T("/mob/living/simple_animal/hostile/clockwork/marauder")) || !(yield* this.blockOrCounter(M, M)))) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:245
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	if (yield* this.blockOrCounter(M, M)) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:249
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (yield* this.blockOrCounter(M, M)) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:253
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	if (yield* this.blockOrCounter(M, M)) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:257
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	if (yield* this.blockOrCounter(M, M)) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:261
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!(rt.istype(I, T("/obj/item/weapon/nullrod")) || !(yield* this.blockOrCounter(user, I)))) return f.dot;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:268
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/blockOrCounter", function* blockOrCounter(f: Frame, target: Value, textobject: Value) {
	let previousattacktext: Value = null;
	let $0: any, $1: any;
	if (GLOB.ratvar_awakens) {
		this.blockchance = 90;
		this.counterchance = 90;
	}
	if (prob(this.blockchance)) {
		f.dot = 1;
		if (target) {
			yield* target.do_attack_animation(this);
			target.changeNext_move(8);
		}
		this.blockchance = rt.initial(f, this, "blockchance");
		playsound(this, rt.rsc("sound/magic/clockwork/fellowship_armory.ogg"), 30, 1, 0, 1);
		$0 = this;
		if (target && rt.istype(textobject, T("/obj/item"))) {
			$1 = `${target}'s ${textobject.name}`;
		} else {
			$1 = fmt("％！", [textobject]);
		}
		$0 = `<span class='boldannounce'>${$0} blocks ${$1}!</span>`;
		if (target && rt.istype(textobject, T("/obj/item"))) {
			$1 = `${target}'s ${textobject.name}`;
		} else {
			$1 = fmt("％！", [textobject]);
		}
		this.visible_message($0, `<span class='userdanger'>You block ${$1}!</span>`);
		if (target && this.Adjacent(target)) {
			if (prob(this.counterchance)) {
				this.counterchance = rt.initial(f, this, "counterchance");
				previousattacktext = this.attacktext;
				this.attacktext = "counters";
				yield* this.UnarmedAttack(target);
				this.attacktext = previousattacktext;
			} else {
				this.counterchance = min(this.counterchance + rt.initial(f, this, "counterchance"), 100);
			}
		}
	} else {
		this.blockchance = min(this.blockchance + rt.initial(f, this, "blockchance"), 100);
	}
	if (!GLOB.ratvar_awakens) return f.dot;
	this.blockchance = 90;
	this.counterchance = 90;
	return f.dot;
}, true);

// clockwork_marauder.dm:295
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	if (this.host && (this.is_in_host() || message_mode == "binary")) {
		this.marauder_comms(message);
		return 1;
	}
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:301
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/marauder_comms", function marauder_comms(f: Frame, message: Value) {
	let M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	let name_part: Value = `<span class='sevtug'>${this} (${this.true_name})</span>`;
	message = `<span class='sevtug_small'>"${message}"</span>`;
	to_chat(this, `${name_part}<span class='sevtug_small'>:</span> ${message}`);
	to_chat(this.host, `${name_part}<span class='sevtug_small'>:</span> ${message}`);
	for (M of each(GLOB.mob_list)) {
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			$0 = M;
			$1 = link;
			$2 = name_part;
			if (findtextEx(this.host.name, this.host.real_name)) {
				$3 = `${this.host.name}`;
			} else {
				$3 = `${this.host.real_name} (as ${this.host.name})`;
			}
			to_chat($0, `${$1} ${$2} <span class='sevtug_small'>(to</span> <span class='sevtug'>${$3}</span><span class='sevtug_small'>):</span> ${message} `);
		}
	}
	return 1;
});

// clockwork_marauder.dm:312
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/return_to_host", function* return_to_host(f: Frame) {
	if (this.is_in_host()) {
		return 0;
	}
	if (!this.host) {
		to_chat(this, "<span class='warning'>You don't have a host!</span>");
		return 0;
	}
	let resulthealth: Value = round(this.host.health / this.host.maxHealth * 100, 0.5);
	if (rt.istype(this.host, T("/mob/living/carbon"))) {
		resulthealth = round(rt.op(f, "Abs", [], [-100 - this.host.health]) / rt.op(f, "Abs", [], [-100 - this.host.maxHealth]) * 100);
	}
	this.host.visible_message(`<span class='warning'>${this.host}'s skin flashes crimson!</span>`, `<span class='sevtug'>You feel ${this.true_name}'s consciousness settle in your mind.</span>`);
	this.visible_message(`<span class='warning'>${this} suddenly disappears!</span>`, `<span class='sevtug'>You return to ${this.host}.</span>`);
	yield* this.forceMove(this.host);
	if (resulthealth > MARAUDER_EMERGE_THRESHOLD && this.health != this.maxHealth) {
		this.recovering = 1;
		to_chat(this, "<span class='userdanger'>You have weakened and will need to recover before manifesting again!</span>");
		to_chat(this.host, `<span class='sevtug'>${this.true_name} has weakened and will need to recover before manifesting again!</span>`);
	}
	return 1;
}, true);

// clockwork_marauder.dm:330
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/try_emerge", function* try_emerge(f: Frame) {
	let resulthealth: Value = null;
	if (!this.host) {
		to_chat(this, "<span class='warning'>You don't have a host!</span>");
		return 0;
	}
	if (!GLOB.ratvar_awakens) {
		resulthealth = round(this.host.health / this.host.maxHealth * 100, 0.5);
		if (rt.istype(this.host, T("/mob/living/carbon"))) {
			resulthealth = round(rt.op(f, "Abs", [], [-100 - this.host.health]) / rt.op(f, "Abs", [], [-100 - this.host.maxHealth]) * 100);
		}
		if (this.host.stat != 2 && resulthealth > MARAUDER_EMERGE_THRESHOLD) {
			to_chat(this, `<span class='warning'>Your host must be at ${MARAUDER_EMERGE_THRESHOLD}% or less health to emerge like this!</span>`);
			return 0;
		}
	}
	return (yield* this.emerge_from_host(0));
}, true);

// clockwork_marauder.dm:343
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/emerge_from_host", function* emerge_from_host(f: Frame, hostchosen: Value, force: Value) {
	if (!this.is_in_host()) {
		return 0;
	}
	if (!force && this.recovering) {
		if (hostchosen) {
			to_chat(this.host, `<span class='sevtug'>${this.true_name} is too weak to come forth!</span>`);
		} else {
			to_chat(this.host, `<span class='sevtug'>${this.true_name} tries to emerge to protect you, but it's too weak!</span>`);
		}
		to_chat(this, "<span class='userdanger'>You try to come forth, but you're too weak!</span>");
		return 0;
	}
	if (!force) {
		if (hostchosen) {
			to_chat(this.host, `<span class='sevtug'>Your words echo with power as ${this.true_name} emerges from your body!</span>`);
		} else {
			to_chat(this.host, `<span class='sevtug'>${this.true_name} emerges from your body to protect you!</span>`);
		}
	}
	yield* this.forceMove(this.host.loc);
	this.visible_message(`<span class='warning'>${this.host}'s skin glows red as ${this.name} emerges from their body!</span>`, `<span class='sevtug_small'>You exit the safety of ${this.host}'s body!</span>`);
	return 1;
}, true);

// clockwork_marauder.dm:362
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/get_alt_name", function get_alt_name(f: Frame) {
	return ` (${text2ratvar(this.true_name)})`;
});

// clockwork_marauder.dm:365
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/is_in_host", function is_in_host(f: Frame) {
	return (this.host && (this.loc == this.host ? 1 : 0));
});

rt.type(88, "/datum/action/innate/summon_marauder", "/datum/action/innate", {
	linked_marauder: null,
	name: "Force Marauder to Emerge/Recall",
	desc: "Allows you to force your clockwork marauder to emerge or recall as required.",
	button_icon_state: "clockwork_marauder",
	background_icon_state: "bg_clock",
	check_flags: 8,
	buttontooltipstyle: "clockcult",
}, { global: { defend_phrases: 626, return_phrases: 627 } });

// clockwork_marauder.dm:382
rt.def("/datum/action/innate/summon_marauder/proc/IsAvailable", function IsAvailable(f: Frame) {
	let L: Value = null;
	if (!this.linked_marauder) {
		return 0;
	}
	if (rt.istype(this.owner, T("/mob/living"))) {
		if (!(L = this.owner).can_speak_vocal() || L.stat) {
			return 0;
		}
	}
	return parent_proc();
});

// clockwork_marauder.dm:391
rt.def("/datum/action/innate/summon_marauder/proc/Activate", function* Activate(f: Frame) {
	if (this.linked_marauder.is_in_host()) {
		yield* clockwork_say(this.owner, text2ratvar(`${pick(GLOB.defend_phrases)}, ${this.linked_marauder.true_name}!`));
		yield* this.linked_marauder.emerge_from_host(1);
	} else {
		yield* clockwork_say(this.owner, text2ratvar(`${pick(GLOB.return_phrases)}, ${this.linked_marauder.true_name}!`));
		yield* this.linked_marauder.return_to_host();
	}
	return 1;
}, true);

rt.type(89, "/datum/action/innate/linked_minds", "/datum/action/innate", {
	linked_marauder: null,
	name: "Linked Minds",
	desc: "Allows you to silently communicate with your marauder.",
	button_icon_state: "linked_minds",
	background_icon_state: "bg_clock",
	check_flags: 8,
	buttontooltipstyle: "clockcult",
});

// clockwork_marauder.dm:410
rt.def("/datum/action/innate/linked_minds/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.linked_marauder) {
		return 0;
	}
	return parent_proc();
});

// clockwork_marauder.dm:415
rt.def("/datum/action/innate/linked_minds/proc/Activate", function* Activate(f: Frame) {
	let M: Value = null, link: Value = null;
	let $0: any, $e: any;
	let message: Value = (yield* stripped_input(this.owner, "Enter a message to tell your marauder.", "Telepathy"));
	if (!this.owner || !message) {
		return 0;
	}
	if (!this.linked_marauder) {
		to_chat(this.owner, "<span class='warning'>Your marauder seems to have been destroyed!</span>");
		return 0;
	}
	if (findtextEx(this.owner.name, this.owner.real_name)) {
		$0 = `${this.owner.name}`;
	} else {
		$0 = `${this.owner.real_name} (as ${this.owner.name})`;
	}
	let name_part: Value = `<span class='sevtug'>Servant ${$0}</span>`;
	message = `<span class='sevtug_small'>"${message}"</span>`;
	to_chat(this.owner, `${name_part}<span class='sevtug_small'>:</span> ${message}`);
	to_chat(this.linked_marauder, `${name_part}<span class='sevtug_small'>:</span> ${message}`);
	for (M of each(GLOB.mob_list)) {
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			to_chat(M, `${link} ${name_part} <span class='sevtug_small'>(to</span> <span class='sevtug'>${this.linked_marauder} (${this.linked_marauder.true_name})</span><span class='sevtug_small'>):</span> ${message}`);
		}
	}
	return 1;
}, true);
