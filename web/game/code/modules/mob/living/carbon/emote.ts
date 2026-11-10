// Based on /tg/station's code/modules/mob/living/carbon/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(493, "/datum/emote/living/carbon", "/datum/emote/living", {
	mob_type_allowed_typecache: null,
});

// emote.dm:2
rt.def("/datum/emote/living/carbon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon"));
	return f.dot;
});

rt.type(498, "/datum/emote/living/carbon/gnarl", "/datum/emote/living/carbon", {
	key: "gnarl",
	key_third_person: "gnarls",
	message: "gnarls and shows its teeth...",
	mob_type_allowed_typecache: null,
});

// emote.dm:30
rt.def("/datum/emote/living/carbon/gnarl/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

rt.type(500, "/datum/emote/living/carbon/roll", "/datum/emote/living/carbon", {
	key: "roll",
	key_third_person: "rolls",
	message: "rolls.",
	restraint_check: 1,
	mob_type_allowed_typecache: null,
});

// emote.dm:43
rt.def("/datum/emote/living/carbon/roll/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

rt.type(501, "/datum/emote/living/carbon/scratch", "/datum/emote/living/carbon", {
	key: "scratch",
	key_third_person: "scratches",
	message: "scratches.",
	restraint_check: 1,
	mob_type_allowed_typecache: null,
});

// emote.dm:50
rt.def("/datum/emote/living/carbon/scratch/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

rt.type(502, "/datum/emote/living/carbon/screech", "/datum/emote/living/carbon", {
	key: "screech",
	key_third_person: "screeches",
	message: "screeches.",
	mob_type_allowed_typecache: null,
});

// emote.dm:57
rt.def("/datum/emote/living/carbon/screech/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

rt.type(503, "/datum/emote/living/carbon/sign", "/datum/emote/living/carbon", {
	key: "sign",
	key_third_person: "signs",
	message_param: "signs the number %t.",
	restraint_check: 1,
	mob_type_allowed_typecache: null,
});

// emote.dm:63
rt.def("/datum/emote/living/carbon/sign/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

// emote.dm:67
rt.def("/datum/emote/living/carbon/sign/proc/select_param", function select_param(f: Frame, user: Value, params: Value) {
	f.dot = parent_proc();
	if (isnum(text2num(params))) return f.dot;
	return rt.sv(f, "message");
}, false);

rt.type(504, "/datum/emote/living/carbon/sign/signal", "/datum/emote/living/carbon/sign", {
	key: "signal",
	key_third_person: "signals",
	message_param: "raises %t fingers.",
	restraint_check: 1,
	mob_type_allowed_typecache: null,
});

// emote.dm:75
rt.def("/datum/emote/living/carbon/sign/signal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/human"));
	return f.dot;
});

rt.type(505, "/datum/emote/living/carbon/tail", "/datum/emote/living/carbon", {
	key: "tail",
	message: "waves their tail.",
	mob_type_allowed_typecache: null,
});

// emote.dm:81
rt.def("/datum/emote/living/carbon/tail/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});
