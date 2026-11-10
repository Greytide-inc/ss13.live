// Based on /tg/station's code/datums/emotes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(425, "/datum/emote", "/datum", {
	key: "",
	key_third_person: "",
	message: "",
	message_mime: "",
	message_alien: "",
	message_larva: "",
	message_robot: "",
	message_AI: "",
	message_monkey: "",
	message_simple: "",
	message_param: "",
	emote_type: 1,
	restraint_check: 0,
	muzzle_ignore: 0,
	mob_type_allowed_typecache: null,
	mob_type_blacklist_typecache: null,
	stat_allowed: 0,
}, { global: { emote_list: 634 } });

// emotes.dm:27
rt.def("/datum/emote/proc/New", function New(f: Frame) {
	if (this.key_third_person) {
		rt.setAt(GLOB.emote_list, this.key_third_person, this);
	}
	this.mob_type_allowed_typecache = typecacheof(this.mob_type_allowed_typecache);
	this.mob_type_blacklist_typecache = typecacheof(this.mob_type_blacklist_typecache);
	return f.dot;
});

// emotes.dm:32
rt.def("/datum/emote/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value, type_override: Value) {
	let I: Value = null, M: Value = null, _T: Value = null;
	f.dot = 1;
	if (!this.can_run_emote(user)) {
		return 0;
	}
	let msg: Value = this.select_message_type(user);
	if (params && this.message_param) {
		msg = this.select_param(user, params);
	}
	msg = this.replace_pronoun(user, msg);
	let L: Value = user;
	for (I of each(L.implants, T("/obj/item/weapon/implant"))) {
		yield* I.trigger(this.key, L);
	}
	if (!msg) {
		return 0;
	}
	user.log_message(msg, "Emote log");
	msg = `<b>${user}</b> ` + msg;
	for (M of each(GLOB.dead_mob_list, T("/mob"))) {
		if (!M.client || rt.istype(M, T("/mob/dead/new_player"))) {
			continue;
		}
		_T = rt.getStep(f, this, 0);
		if (M.stat == 2 && M.client && rt.bitAnd(M.client.prefs.chat_toggles, 8) && !rt.isIn(f, M, viewers(_T, null))) {
			M.show_message(msg);
		}
	}
	if (this.emote_type == 2) {
		user.audible_message(msg);
	} else {
		user.visible_message(msg);
	}
	log_emote(`${key_name(user)} : ${msg}`);
	return f.dot;
}, true);

// emotes.dm:64
rt.def("/datum/emote/proc/replace_pronoun", function replace_pronoun(f: Frame, user: Value, message: Value) {
	if (findtext(message, "their")) {
		message = replacetext(message, "their", user.p_their());
	}
	if (findtext(message, "them")) {
		message = replacetext(message, "them", user.p_them());
	}
	if (findtext(message, "%s")) {
		message = replacetext(message, "%s", user.p_s());
	}
	return message;
});

// emotes.dm:73
rt.def("/datum/emote/proc/select_message_type", function select_message_type(f: Frame, user: Value) {
	f.dot = rt.sv(f, "message");
	if (!this.muzzle_ignore && user.is_muzzled() && this.emote_type == EMOTE_AUDIBLE) {
		return `makes a ${pick("strong ", "weak ", "")}noise.`;
	}
	if (user.mind && user.mind.miming && this.message_mime) {
		f.dot = this.message_mime;
	}
	if (rt.istype(user, T("/mob/living/carbon/alien/humanoid")) && this.message_alien) {
		f.dot = this.message_alien;
	} else if (rt.istype(user, T("/mob/living/carbon/alien/larva")) && this.message_larva) {
		f.dot = this.message_larva;
	} else if (rt.istype(user, T("/mob/living/silicon/robot")) && this.message_robot) {
		f.dot = this.message_robot;
	} else if (rt.istype(user, T("/mob/living/silicon/ai")) && this.message_AI) {
		f.dot = this.message_AI;
	} else if (rt.istype(user, T("/mob/living/carbon/monkey")) && this.message_monkey) {
		f.dot = this.message_monkey;
	} else {
		if (!(rt.istype(user, T("/mob/living/simple_animal")) && this.message_simple)) return f.dot;
		f.dot = this.message_simple;
	}
	return f.dot;
});

// emotes.dm:92
rt.def("/datum/emote/proc/select_param", function select_param(f: Frame, user: Value, params: Value) {
	return replacetext(this.message_param, "%t", params);
});

// emotes.dm:96
rt.def("/datum/emote/proc/can_run_emote", function can_run_emote(f: Frame, user: Value, help_check: Value) {
	f.dot = 1;
	if (!is_type_in_typecache(user, this.mob_type_allowed_typecache)) {
		return 0;
	}
	if (is_type_in_typecache(user, this.mob_type_blacklist_typecache)) {
		return 0;
	}
	if (help_check) return f.dot;
	if (user.stat > this.stat_allowed || rt.bitAnd(user.status_flags, FAKEDEATH)) {
		return 0;
	}
	if (this.restraint_check && user.restrained()) {
		return 0;
	}
	if (!(user.reagents && user.reagents.has_reagent("mimesbane"))) return f.dot;
	return 0;
});

rt.type(426, "/datum/emote/sound", "/datum/emote", {
	sound: null,
	vary: 0,
	mob_type_allowed_typecache: null,
});

// emotes.dm:112
rt.def("/datum/emote/sound/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/brain"), T("/mob/living/silicon"));
	return f.dot;
});

// emotes.dm:115
rt.def("/datum/emote/sound/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	playsound(user.loc, this.sound, 50, this.vary);
	return f.dot;
}, true);
