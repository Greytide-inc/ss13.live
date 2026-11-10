// Based on /tg/station's code/game/gamemodes/clock_cult/clock_mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { fmt } = rt;


rt.type(4860, "/mob/living/simple_animal/hostile/clockwork", "/mob/living/simple_animal/hostile", {
	playstyle_string: "<span class='heavy_brass'>You are a bug, yell at whoever spawned you!</span>",
	verb_ask: "requests",
	verb_exclaim: "proclaims",
	verb_whisper: "imparts",
	verb_yell: "harangues",
	initial_language_holder: rt.typePath("/datum/language_holder/clockmob"),
	light_color: "#E42742",
	faction: null,
	gender: "neuter",
	icon: rt.rsc("icons/mob/clockwork_mobs.dmi"),
	unique_name: 1,
	minbodytemp: 0,
	unsuitable_atmos_damage: 0,
	atmos_requirements: null,
	damage_coeff: null,
	healable: 0,
	del_on_death: 1,
	speak_emote: null,
	bubble_icon: "clock",
	death_sound: rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"),
});

// clock_mobs.dm:9
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("neutral", "ratvar");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	this.speak_emote = list("clanks", "clinks", "clunks", "clangs");
	return f.dot;
});

// clock_mobs.dm:25
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// clock_mobs.dm:28
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	yield* add_servant_of_ratvar(this, 1);
	to_chat(this, this.playstyle_string);
	return f.dot;
}, true);

// clock_mobs.dm:33
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* this.fully_heal(1);
	return f.dot;
}, true);

// clock_mobs.dm:39
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = this.p_they(1);
	let t_s: Value = this.p_s();
	let msg: Value = fmt("<span class='brass'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [bicon(this), this]);
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
